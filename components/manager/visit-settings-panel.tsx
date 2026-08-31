"use client"

import { useState, useEffect, useMemo } from "react"
import { createPortal } from "react-dom"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  X,
  Trash2,
  Calendar,
  ReceiptText,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Settings,
  Building2,
  Info,
  Eye,
  FileText,
} from "lucide-react"
import { toast } from "react-toastify"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import { handleResponse } from "@/lib/response-handler"
import type { Visit } from "@/lib/api-types"
import {
  useMutation,
  useLazyQuery,
  gql,
} from "@apollo/client"
import {
  CANCEL_VISIT_MUTATION,
  DELETE_VISIT_MUTATION,
  REMOVE_VISIT_DEPARTMENT_MUTATION,
  CHANGE_VISIT_DATE_MUTATION,
  FINALISE_VISIT_DEPARTMENT_MUTATION,
  CHANGE_VISIT_DEPARTMENT_PROFILE_MUTATION,
} from "@/hooks/mutations/visits"
import {
  UPDATE_BILLING_DATE_MUTATION,
} from "@/hooks/mutations/billing"
import {
  useStartBillEditing,
  useGenerateInvoice,
} from "@/hooks/billing/hooks"
import { useGenerateConsultationPdf } from "@/hooks/visits/visit-mutations"
import { VISITS_QUERY } from "@/hooks/queries/visits"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { hasRole } from "@/lib/role-utils"
import type { DepartmentProfile as DepartmentProfileType } from "@/lib/api-types"

const GET_VISIT_BILLING = gql`
  query GetVisitBillingForSettings($visitId: ID!) {
    visitBilling(visitId: $visitId) {
      status
      message
      data {
        id
        departments {
          id
          status
          totalAmount
          visitDepartment {
            id
            department {
              id
              name
            }
          }
          insuranceBillings {
            id
            status
            totalAmount
            billingDate
            invoiceUrl
          }
        }
      }
    }
  }
`

const GET_VISIT_DEPARTMENT_PROFILES = gql`
  query GetVisitDepartmentProfiles($visitId: ID!) {
    visit(visitId: $visitId) {
      status
      message
      data {
        id
        departments {
          id
          encounterType
          profile {
            id
            name
            encounterType
          }
          department {
            id
            name
            profiles {
              id
              name
              encounterType
              isDefault
            }
          }
        }
      }
    }
  }
`

interface VisitSettingsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  visit: Visit
  onVisitUpdated?: () => void
}

interface ProfileDept {
  id: string
  encounterType: string
  assigned?: { id: string; name: string; encounterType: string } | null
  available: { id: string; name: string; encounterType: string }[]
}

export function VisitSettingsPanel({
  open,
  onOpenChange,
  visit,
  onVisitUpdated,
}: VisitSettingsPanelProps) {
  const [isRendered, setIsRendered] = useState(open)
  const [activeTab, setActiveTab] = useState<"general" | "departments">(
    "general",
  )
  // Confirmation dialog state
  const [deleteTarget, setDeleteTarget] = useState<
    { type: "visit" | "department" | "finalise"; id: string; name: string } | null
  >(null)

  // ── Mutations with refetchQueries so state updates instantly ──
  const refetchConfig = {
    refetchQueries: [
      { query: VISITS_QUERY, variables: { input: {} } },
    ],
  }

  const [cancelVisit, { loading: cancelling }] = useMutation(
    CANCEL_VISIT_MUTATION,
    {
      ...refetchConfig,
      onCompleted: (data) => {
        handleResponse(data?.cancelVisit, {
          successMessage: "Visit cancelled successfully",
          onSuccess: () => { onVisitUpdated?.(); onOpenChange(false) },
        })
      },
      onError: (error) => {
        toast.error(error.message || "Failed to cancel visit")
      },
    },
  )

  const [deleteVisit, { loading: deleting }] = useMutation(
    DELETE_VISIT_MUTATION,
    {
      ...refetchConfig,
      onCompleted: (data) => {
        handleResponse(data?.deleteVisit, {
          successMessage: "Visit deleted successfully",
          onSuccess: () => { onVisitUpdated?.(); onOpenChange(false) },
        })
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete visit")
      },
    },
  )

  const [removeDepartment, { loading: removingDept }] = useMutation(
    REMOVE_VISIT_DEPARTMENT_MUTATION,
    {
      ...refetchConfig,
      onCompleted: (data) => {
        handleResponse(data?.removeVisitDepartment, {
          successMessage: "Department removed successfully",
          onSuccess: () => onVisitUpdated?.(),
        })
      },
      onError: (error) => {
        toast.error(error.message || "Failed to remove department")
      },
    },
  )

  const [finaliseDepartment, { loading: finalisingDept }] = useMutation(
    FINALISE_VISIT_DEPARTMENT_MUTATION,
    {
      ...refetchConfig,
      onCompleted: (data) => {
        handleResponse(data?.updateVisitDepartmentStatus, {
          successMessage: "Department finalised successfully",
          onSuccess: () => onVisitUpdated?.(),
        })
      },
      onError: (error) => {
        toast.error(error.message || "Failed to finalise department")
      },
    },
  )

  const [changeVisitDate] = useMutation(CHANGE_VISIT_DATE_MUTATION, {
    ...refetchConfig,
    onCompleted: (data) => {
      handleResponse(data?.changeVisitDate, {
        successMessage: "Visit date updated successfully",
        onSuccess: () => onVisitUpdated?.(),
      })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update visit date")
    },
  })

  const [updateBillingDate] = useMutation(UPDATE_BILLING_DATE_MUTATION, {
    onCompleted: (data) => {
      handleResponse(data?.updateBillingDate, {
        successMessage: "Billing date updated successfully",
        onSuccess: () => { void fetchBilling({ variables: { visitId: visit.id } }) },
      })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update billing date")
    },
  })

  const { startBillEditing, loading: startingBillEdit } = useStartBillEditing()

  const [fetchBilling, { data: billingData, error: billingError }] = useLazyQuery(
    GET_VISIT_BILLING,
    { fetchPolicy: "network-only" },
  )

  // Log billing query errors silently — surface via toast
  useEffect(() => {
    if (billingError) {
      console.error("[VisitSettings] Billing query error:", billingError)
      toast.error("Failed to load billing data: " + (billingError.message || "Unknown error"))
    }
  }, [billingError])

  useEffect(() => {
    if (open) {
      fetchBilling({ variables: { visitId: visit.id } })
    }
  }, [open, visit.id, fetchBilling])

  // ── Clinic department profile (assigned + available catalog profiles) ──
  const { doctor: authDoctor } = useAuth()
  const currentRoles = ((authDoctor as unknown as { roles?: string[] } | null)
    ?.roles || []) as string[]
  // Profiles can be changed/assigned by managers and clinicians.
  const canManageProfile = hasRole(currentRoles, "MANAGER") || hasRole(currentRoles, "CLINICIAN")

  const [fetchProfiles, {
    data: profilesData,
    loading: profilesLoading,
    error: profilesError,
  }] = useLazyQuery(GET_VISIT_DEPARTMENT_PROFILES, { fetchPolicy: "network-only" })

  // Keyed by visitDepartment id so we can look up each department's assigned
  // profile and its available catalog profiles regardless of hierarchy/order.
  const profileDeptsByVisitDeptId = useMemo(() => {
    const map = new Map<string, ProfileDept>()
    const rawDepts = (profilesData?.visit?.data?.departments || []) as Array<{
      id: string
      encounterType: string
      profile?: { id: string; name: string; encounterType: string } | null
      department?: { id: string; name: string; profiles: DepartmentProfileType[] }
    }>
    rawDepts.forEach((dept) => {
      map.set(dept.id, {
        id: dept.id,
        encounterType: dept.encounterType,
        assigned: dept.profile
          ? {
              id: dept.profile.id,
              name: dept.profile.name,
              encounterType: dept.profile.encounterType,
            }
          : null,
        available: (dept.department?.profiles || []).map((p) => ({
          id: p.id,
          name: p.name,
          encounterType: p.encounterType,
        })),
      })
    })
    return map
  }, [profilesData])

  useEffect(() => {
    if (open) {
      fetchProfiles({ variables: { visitId: visit.id } })
    }
  }, [open, visit.id, fetchProfiles])

  useEffect(() => {
    if (profilesError) {
      console.error("[VisitSettings] Profiles query error:", profilesError)
    }
  }, [profilesError])

  const [changeProfile, { loading: changingProfile }] = useMutation(
    CHANGE_VISIT_DEPARTMENT_PROFILE_MUTATION,
    {
      ...refetchConfig,
      onCompleted: (data) => {
        handleResponse(data?.changeVisitDepartmentProfile, {
          successMessage: "Department profile updated successfully",
          onSuccess: () => {
            onVisitUpdated?.()
            void fetchProfiles({ variables: { visitId: visit.id } })
          },
        })
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update department profile")
      },
    },
  )

  const handleChangeDepartmentProfile = (visitDepartmentId: string, profileId: string | null) => {
    void changeProfile({ variables: { visitDepartmentId, profileId } })
  }

  const { generateInvoice, loading: generatingInvoice } = useGenerateInvoice()
  const { generateConsultationPdf, loading: generatingConsultationPdf } = useGenerateConsultationPdf()

  const handleBillingDateChange = async (
    departmentInsuranceBillingId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newDate = e.target.value
    if (!newDate) return

    // Validate: billing date must be at least 5 minutes after visit date
    if (visit.visitDate) {
      const visitTime = new Date(visit.visitDate).getTime()
      const billingTime = new Date(newDate).getTime()
      const fiveMinutesMs = 5 * 60 * 1000
      if (billingTime < visitTime + fiveMinutesMs) {
        toast.error("Billing date must be at least 5 minutes after the visit date")
        return
      }
    }

    // datetime-local gives "YYYY-MM-DDTHH:MM" — append seconds for
    // LocalDateTime on the backend (no UTC conversion, no Z suffix).
    const billingDate = newDate.length === 16 ? `${newDate}:00` : newDate

    await updateBillingDate({
      variables: {
        input: {
          departmentInsuranceBillingId,
          billingDate,
        },
      },
    })
  }

  const handlePreviewInvoice = async (departmentInsuranceBillingId: string) => {
    try {
      const result = await generateInvoice(departmentInsuranceBillingId)
      if (result?.data?.signedUrl) {
        window.open(result.data.signedUrl, "_blank")
      } else {
        toast.error(result?.message || "Failed to generate invoice")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate invoice")
    }
  }

  const handlePreviewConsultation = async (dept: Visit["departments"][number]) => {
    if (!dept.answerId) {
      toast.error("No consultation answers found for this department")
      return
    }
    try {
      const result = await generateConsultationPdf({
        consultationId: dept.answerId,
        departmentId: dept.department?.id || "",
        formId: "",
      })
      if (result?.data?.signedUrl) {
        window.open(result.data.signedUrl, "_blank")
      } else {
        toast.error(result?.message || "Failed to generate consultation PDF")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate consultation PDF")
    }
  }

  const handleStartBillEditing = async (visitDepartmentId?: string) => {
    const deptId = visitDepartmentId
    if (!deptId) {
      toast.error("No department selected for billing edit")
      return
    }
    try {
      const result = await startBillEditing(deptId)
      if (result.status === "SUCCESS") {
        toast.success("Billing edit mode enabled")
        onVisitUpdated?.()
      } else {
        toast.error(result.message || "Failed to enable billing edit")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to enable billing edit")
    }
  }

  useEffect(() => {
    if (open) {
      setIsRendered(true)
      setActiveTab("general")
      return
    }

    const timeout = window.setTimeout(() => {
      setIsRendered(false)
    }, 220)
    return () => window.clearTimeout(timeout)
  }, [open])

  const handleCancelVisit = async () => {
    if (!window.confirm("Are you sure you want to cancel this visit?")) return
    await cancelVisit({ variables: { visitId: visit.id } })
  }

  const handleDeleteVisit = () => {
    setDeleteTarget({ type: "visit", id: visit.id, name: `Visit ${visit.patient?.fullName || visit.patient?.firstName || ''}` })
  }

  const handleRemoveDepartment = (departmentId: string) => {
    const dept = visit.departments?.find((d) => d.id === departmentId)
    setDeleteTarget({ type: "department", id: departmentId, name: dept?.department?.name || 'this department' })
  }

  const handleFinaliseDepartment = (departmentId: string) => {
    const dept = visit.departments?.find((d) => d.id === departmentId)
    setDeleteTarget({ type: "finalise", id: departmentId, name: dept?.department?.name || 'this department' })
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    if (deleteTarget.type === "visit") {
      await deleteVisit({ variables: { visitId: deleteTarget.id } })
    } else if (deleteTarget.type === "department") {
      await removeDepartment({ variables: { visitDepartmentId: deleteTarget.id } })
    } else if (deleteTarget.type === "finalise") {
      await finaliseDepartment({ variables: { visitDepartmentId: deleteTarget.id } })
    }
    setDeleteTarget(null)
  }

  const handleVisitDateChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newDate = e.target.value
    if (!newDate) return
    // datetime-local gives "YYYY-MM-DDTHH:MM" — append seconds for
    // LocalDateTime on the backend (no UTC conversion, no Z suffix).
    const visitDate = newDate.length === 16 ? `${newDate}:00` : newDate
    await changeVisitDate({
      variables: {
        input: {
          visitId: visit.id,
          visitDate,
        },
      },
    })
  }

  const canCancelVisit =
    visit.status !== "CANCELLED" && visit.status !== "COMPLETED"
  const hasDeptEditing = (visit.departments || []).some((d: any) => d.status === "DEPARTMENT_EDITING")
  const canDeleteVisit = !hasDeptEditing
  const hasDepartments = visit.departments && visit.departments.length > 0

  // ── Derived billing state ──
  const billingDepartments = billingData?.visitBilling?.data?.departments
  const hasBillingData = billingDepartments && billingDepartments.length > 0
  const isBillEditing = (visit.departments || []).some((d) => d.status === "DEPARTMENT_EDITING")

  // Flatten all insurance billings across departments
  const allInsBillings: any[] = []
  billingDepartments?.forEach((dept: any) => {
    ;(dept.insuranceBillings || []).forEach((ib: any) => {
      allInsBillings.push({
        ...ib,
        departmentName: dept.visitDepartment?.department?.name || "Department",
      })
    })
  })

  if (!isRendered || typeof document === "undefined") return null

  const deleteDialogTitle =
    deleteTarget?.type === "visit"
      ? "Delete this visit?"
      : deleteTarget?.type === "finalise"
        ? `Finalise "${deleteTarget?.name || ''}"?`
        : `Remove "${deleteTarget?.name || ''}"?`;

  const deleteDialogDeps =
    deleteTarget?.type === "department"
      ? (visit.departments?.find((d) => d.id === deleteTarget?.id)?.products || []).map(
          (p) => ({ label: `${p.product.name} (${p.quantity}x)` })
        )
      : [];

  return (
    <>
    {createPortal(
    <div className="fixed inset-0 z-[88]">
      <div
        className={`absolute inset-0 bg-slate-950/40 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Visit Settings"
        className={`absolute left-0 top-16 h-[calc(100vh-4rem)] w-[min(92vw,48rem)] border-r border-border bg-background dark:bg-slate-900 shadow-2xl transition-transform duration-200 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-border/70 px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Visit Settings
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {visit.patient.firstName} {visit.patient.lastName} • Visit #
                  {visit.id.slice(-8)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close settings"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border/70">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "general"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("departments")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "departments"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Departments
            </button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-6 pr-4">
              {/* General Tab */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  {/* Visit Date */}
                  <div className="rounded-xl border border-border p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-foreground">
                        Visit Date
                      </h3>
                    </div>
                    <div>
                      <input
                        type="datetime-local"
                        defaultValue={visit.visitDate
                          ? visit.visitDate.slice(0, 16)
                          : ""}
                        onChange={handleVisitDateChange}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Change the visit date for this patient encounter
                      </p>
                    </div>
                  </div>

                  {/* Billing Date */}
                  <div className="rounded-xl border border-border p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <ReceiptText className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-foreground">
                        Billing Date
                      </h3>
                      {/* Billing edit is now per-department, triggered from the billing page */}
                      {/* Billing edit mode active badge */}
                      {isBillEditing && (
                        <span className="ml-auto text-xs text-amber-600 font-medium">
                          Billing edit mode active
                        </span>
                      )}
                    </div>

                    {/* Billing date inputs */}
                    {hasBillingData ? (
                      <div className="space-y-3">
                        {allInsBillings.map((ib: any) => (
                          <div
                            key={ib.id}
                            className="rounded-lg border border-border/50 p-3 space-y-2"
                          >
                            <p className="text-sm font-medium text-foreground">
                              {ib.departmentName}
                              <span className="ml-2 text-xs text-muted-foreground font-normal">
                                • Total: {ib.totalAmount?.toLocaleString()} RWF
                              </span>
                              {ib.status && (
                                <span className={`ml-2 text-xs font-medium ${
                                  ib.status === "PAID" ? "text-emerald-600" :
                                  ib.status === "PARTIALLY_PAID" ? "text-amber-600" :
                                  "text-muted-foreground"
                                }`}>
                                  {ib.status}
                                </span>
                              )}
                            </p>
                            <input
                              type="datetime-local"
                              defaultValue={
                                ib.billingDate
                                  ? ib.billingDate.slice(0, 16)
                                  : ""
                              }
                              min={visit.visitDate
                                ? visit.visitDate.slice(0, 16)
                                : undefined}
                              onChange={(e) =>
                                handleBillingDateChange(ib.id, e)
                              }
                              disabled={visit.status === "CANCELLED"}
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">
                              Must be at least 5 minutes after visit date
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">No billing records yet</p>
                      </div>
                    )}
                  </div>

                  {/* Danger Zone */}
                  <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <h3 className="font-medium text-red-700">
                        Danger Zone
                      </h3>
                    </div>

                    {/* Cancel Visit */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          Cancel Visit
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Mark this visit as cancelled
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCancelVisit}
                        disabled={!canCancelVisit || cancelling}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        {cancelling ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                        Cancel Visit
                      </button>
                    </div>

                    {/* Delete Visit */}
                    <div className="flex items-center justify-between pt-4 border-t border-red-200">
                      <div>
                        <p className="font-medium text-foreground">
                          Delete Visit
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete this visit and all its data
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDeleteVisit}
                        disabled={!canDeleteVisit || deleting}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        {deleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete Visit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Departments Tab */}
              {activeTab === "departments" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-4 w-4 text-primary" />
                    <h3 className="font-medium text-foreground">
                      Visit Departments
                    </h3>
                  </div>

                  {!hasDepartments ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No departments assigned to this visit</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {visit.departments.map((dept) => (
                        <div
                          key={dept.id}
                          className="rounded-xl border border-border p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">
                                {dept.department?.name || "Unknown Department"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Status: {dept.status}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {dept.status === "COMPLETED" &&
                                dept.hasFinalizedConsultationAnswers &&
                                !dept.hasBillableProducts && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleFinaliseDepartment(dept.id)
                                  }
                                  disabled={finalisingDept}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                                >
                                  {finalisingDept ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-3 w-3" />
                                  )}
                                  Finalise
                                </button>
                              )}
                              {dept.status === "COMPLETED" &&
                                (!dept.hasFinalizedConsultationAnswers ||
                                  dept.hasBillableProducts) && (
                                <div className="relative group">
                                  <Info className="h-4 w-4 text-amber-500 cursor-help" />
                                  <div className="absolute right-0 top-6 z-50 hidden group-hover:block w-56 p-3 bg-popover border border-border rounded-lg shadow-lg text-xs text-muted-foreground space-y-1">
                                    <p className="font-medium text-foreground">
                                      Cannot finalise yet:
                                    </p>
                                    {!dept.hasFinalizedConsultationAnswers && (
                                      <p>• Consultation answers are not finalised</p>
                                    )}
                                    {dept.hasBillableProducts && (
                                      <p>• Department has unbilled products</p>
                                    )}
                                  </div>
                                </div>
                              )}
                              {dept.status !== "FINALISED" && dept.status !== "CANCELLED" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveDepartment(dept.id)
                                  }
                                  disabled={removingDept}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                                >
                                  {removingDept ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3 w-3" />
                                  )}
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                          {dept.products && dept.products.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {dept.products.length} product
                              {dept.products.length !== 1 ? "s" : ""} added
                            </div>
                          )}

                          {/* Clinic profile (assigned + available), with change/clear for managers & clinicians */}
                          {(() => {
                            const profileDept = profileDeptsByVisitDeptId.get(dept.id)
                            const assigned = profileDept?.assigned
                            const available = profileDept?.available || []
                            const loading = profilesLoading && !profileDept
                            return (
                              <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                    <FileText className="h-3.5 w-3.5 text-primary" />
                                    Clinic Profile
                                  </span>
                                  {loading && (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                                  )}
                                </div>
                                {!profileDept && !loading ? (
                                  <p className="text-xs text-muted-foreground">
                                    Profile not available
                                  </p>
                                ) : assigned ? (
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-foreground truncate">
                                        {assigned.name}
                                      </p>
                                      <p className="text-[11px] text-muted-foreground truncate">
                                        {assigned.encounterType || profileDept?.encounterType || "No encounter type"}
                                      </p>
                                    </div>
                                      <span className="shrink-0 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-full">
                                        Active
                                      </span>
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground">
                                    No profile assigned
                                    {profileDept?.encounterType
                                      ? ` — encounter: ${profileDept.encounterType}`
                                      : ""}
                                  </p>
                                )}
                                {canManageProfile && !loading && dept.status !== "BILLING" && dept.status !== "COMPLETED" && (
                                  <Select
                                    value={assigned?.id || "none"}
                                    onValueChange={(value) =>
                                      handleChangeDepartmentProfile(
                                        dept.id,
                                        value === "none" ? null : value,
                                      )
                                    }
                                  >
                                    <SelectTrigger
                                      disabled={changingProfile}
                                      className="h-8 w-full text-xs"
                                    >
                                      <SelectValue
                                        placeholder={assigned ? "Change profile" : "Assign a profile"}
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">
                                        No profile
                                      </SelectItem>
                                      {available.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                          {p.name}
                                          {p.encounterType
                                            ? ` — ${p.encounterType}`
                                            : ""}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            )
                          })()}

                          {/* Preview buttons */}
                          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                            {dept.answerId && (
                              <button
                                type="button"
                                onClick={() => handlePreviewConsultation(dept)}
                                disabled={generatingConsultationPdf}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1 border border-blue-200"
                              >
                                {generatingConsultationPdf ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <FileText className="h-3 w-3" />
                                )}
                                Preview Consultation
                              </button>
                            )}
                            {(() => {
                              const deptBilling = billingDepartments?.find(
                                (b: any) => b.visitDepartment?.id === dept.id,
                              )
                              const invoiceBilling = deptBilling?.insuranceBillings?.find(
                                (ib: any) => ib.invoiceUrl,
                              )
                              if (invoiceBilling) {
                                return (
                                  <button
                                    type="button"
                                    onClick={() => handlePreviewInvoice(invoiceBilling.id)}
                                    disabled={generatingInvoice}
                                    className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1 border border-purple-200"
                                  >
                                    {generatingInvoice ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Eye className="h-3 w-3" />
                                    )}
                                    Preview Invoice
                                  </button>
                                )
                              }
                              return null
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </ScrollArea>
        </div>
      </aside>
    </div>,
    document.body,
  )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        entityName={deleteTarget?.name || ''}
        dependencies={deleteDialogDeps}
        confirmLabel={
          deleteTarget?.type === "visit"
            ? "Delete Visit"
            : deleteTarget?.type === "finalise"
              ? "Finalise"
              : "Remove Department"
        }
        busy={cancelling || deleting || removingDept || finalisingDept}
        onConfirm={() => void handleConfirmDelete()}
      />
    </>
  )
}
