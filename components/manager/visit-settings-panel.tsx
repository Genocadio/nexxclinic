"use client"

import { useState, useEffect, useMemo } from "react"
import { createPortal } from "react-dom"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  X,
  Trash2,
  Calendar,
  CalendarClock,
  ReceiptText,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Settings,
  Building2,
  Info,
  Eye,
  FileText,
  Ban,
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
  FINALISE_VISIT_DEPARTMENT_MUTATION,
  UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION,
  CHANGE_VISIT_DEPARTMENT_PROFILE_MUTATION,
  REMOVE_VISIT_DEPARTMENT_PROFILE_MUTATION,
  UPDATE_VISIT_DEPARTMENT_ENCOUNTER_DATE_MUTATION,
  COMPLETE_VISIT_MUTATION,
} from "@/hooks/mutations/visits"
import { canDischargeVisit } from "@/lib/visit-product-utils"
import {
  UPDATE_BILLING_DATE_MUTATION,
} from "@/hooks/mutations/billing"
import {
  useStartBillEditing,
  useCancelBillEditing,
  useGenerateInvoice,
} from "@/hooks/billing/hooks"
import { useGenerateConsultationPdf } from "@/hooks/visits/visit-mutations"
import { ConsultationPreviewSheet } from "@/components/dashboard/consultation-preview-sheet"
import { openInvoicePreview, resolveInvoiceUrl } from "@/lib/invoice-utils"
import { VISITS_QUERY, GET_VISIT_QUERY } from "@/hooks/queries/visits"
import { GET_BILL_BY_VISIT_QUERY } from "@/hooks/queries/billing"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useDepartments } from "@/hooks/auth-hooks"
import { hasRole } from "@/lib/role-utils"
import type { DepartmentProfile as DepartmentProfileType } from "@/lib/api-types"

function getRandomMinutes(min = 5, max = 10): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function addMinutesToDate(dateStr: string | number | Date, minutes: number): string {
  const d = new Date(dateStr)
  d.setMinutes(d.getMinutes() + minutes)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const hours = String(d.getHours()).padStart(2, "0")
  const mins = String(d.getMinutes()).padStart(2, "0")
  const secs = String(d.getSeconds()).padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${mins}:${secs}`
}

function parseTimeMs(dateStr: string | number | Date | null | undefined): number | null {
  if (!dateStr) return null
  const t = new Date(dateStr).getTime()
  return isNaN(t) ? null : t
}

function formatFullDateTime(val: unknown): string {
  if (!val) return "—"
  try {
    const d = new Date(val as string | number)
    if (isNaN(d.getTime())) return String(val)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d)
  } catch {
    return String(val)
  }
}

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
  const { doctor } = useAuth()
  const roles = useMemo(
    () => ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[],
    [doctor]
  )
  const hasAdminRole = hasRole(roles, "ADMIN")
  const hasManagerRole = hasRole(roles, "MANAGER")
  const hasFinanceRole = hasRole(roles, "FINANCE")
  const isAdminOrManager = hasAdminRole || hasManagerRole || hasFinanceRole

  const [isRendered, setIsRendered] = useState(open)
  const [activeTab, setActiveTab] = useState<"general" | "departments">(
    "general",
  )
  // Confirmation dialog state
  const [deleteTarget, setDeleteTarget] = useState<
    { type: "visit" | "cancel-visit" | "department" | "finalise" | "cancel-department" | "discharge"; id: string; name: string } | null
  >(null)
  // Pending date changes per department (encounter date & billing date)
  const [pendingDepartmentEncounterDate, setPendingDepartmentEncounterDate] = useState<{
    visitDepartmentId: string
    date: string
  } | null>(null)
  const [pendingBillingDate, setPendingBillingDate] = useState<{
    billingId: string
    visitDepartmentId: string
    date: string
  } | null>(null)
  const [applyingDate, setApplyingDate] = useState(false)

  // Consultation preview sheet state
  const [consultationPreviewOpen, setConsultationPreviewOpen] = useState(false)
  const [consultationPreviewContext, setConsultationPreviewContext] = useState<{
    answerId: string | null
    departmentName: string
    patientName: string
    visitDepartment: Visit["departments"][number] | null
  } | null>(null)

  // ── Mutations with refetchQueries so state updates instantly ──
  const refetchConfig = {
    refetchQueries: [
      "GetVisit",
      "GetVisits",
      "GetVisitBilling",
      "GetVisitBillingForSettings",
      "GetVisitDepartmentProfiles",
      { query: VISITS_QUERY, variables: { input: {} } },
      { query: GET_VISIT_QUERY, variables: { id: visit.id } },
      { query: GET_BILL_BY_VISIT_QUERY, variables: { visitId: visit.id } },
      { query: GET_VISIT_BILLING, variables: { visitId: visit.id } },
      { query: GET_VISIT_DEPARTMENT_PROFILES, variables: { visitId: visit.id } },
    ],
    awaitRefetchQueries: true,
  }

  const [completeVisitMutation, { loading: completingVisit }] = useMutation(
    COMPLETE_VISIT_MUTATION,
    {
      ...refetchConfig,
      onCompleted: (data) => {
        handleResponse(data?.completeVisit, {
          successMessage: "Patient discharged successfully",
          onSuccess: () => {
            onVisitUpdated?.()
            onOpenChange(false)
          },
        })
      },
      onError: (error) => {
        toast.error(error.message || "Failed to discharge patient")
      },
    },
  )

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
          onSuccess: () => {
            onVisitUpdated?.()
            void fetchBilling({ variables: { visitId: visit.id } })
            void fetchProfiles({ variables: { visitId: visit.id } })
          },
        })
      },
      onError: (error) => {
        toast.error(error.message || "Failed to remove department")
      },
    },
  )

  const [cancelDepartment, { loading: cancellingDept }] = useMutation(
    UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION,
    {
      ...refetchConfig,
      onCompleted: (data) => {
        handleResponse(data?.updateVisitDepartmentStatus, {
          successMessage: "Department cancelled successfully",
          onSuccess: () => {
            onVisitUpdated?.()
            void fetchBilling({ variables: { visitId: visit.id } })
            void fetchProfiles({ variables: { visitId: visit.id } })
          },
        })
      },
      onError: (error) => {
        toast.error(error.message || "Failed to cancel department")
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
          onSuccess: () => {
            onVisitUpdated?.()
            void fetchBilling({ variables: { visitId: visit.id } })
            void fetchProfiles({ variables: { visitId: visit.id } })
          },
        })
      },
      onError: (error) => {
        toast.error(error.message || "Failed to finalise department")
      },
    },
  )

  const [updateDepartmentEncounterDate, { loading: updatingEncounterDate }] = useMutation(
    UPDATE_VISIT_DEPARTMENT_ENCOUNTER_DATE_MUTATION,
    {
      ...refetchConfig,
      onCompleted: (data) => {
        handleResponse(data?.updateVisitDepartmentEncounterDate, {
          successMessage: "Department encounter date updated successfully",
          onSuccess: () => {
            onVisitUpdated?.()
            void fetchBilling({ variables: { visitId: visit.id } })
            void fetchProfiles({ variables: { visitId: visit.id } })
          },
        })
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update department encounter date")
      },
    },
  )

  const [updateBillingDate, { loading: updatingBillingDate }] = useMutation(UPDATE_BILLING_DATE_MUTATION, {
    ...refetchConfig,
    onCompleted: (data) => {
      handleResponse(data?.updateBillingDate, {
        successMessage: "Billing date updated successfully",
        onSuccess: () => {
          onVisitUpdated?.()
          void fetchBilling({ variables: { visitId: visit.id } })
        },
      })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update billing date")
    },
  })

  const { startBillEditing, loading: startingBillEdit } = useStartBillEditing()
  const { cancelBillEditing, loading: cancellingBillEdit } = useCancelBillEditing()

  const [fetchLiveVisit, { data: liveVisitData }] = useLazyQuery(GET_VISIT_QUERY, {
    fetchPolicy: "network-only",
  })

  const currentVisit: Visit = useMemo(() => {
    return (liveVisitData?.visit?.data as Visit) || visit
  }, [liveVisitData, visit])

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
      void fetchLiveVisit({ variables: { id: visit.id } })
      void fetchBilling({ variables: { visitId: visit.id } })
    }
  }, [open, visit.id, fetchLiveVisit, fetchBilling])

  // ── Clinic department profile (assigned + available catalog profiles) ──
  const { departments = [] } = useDepartments()
  const { doctor: authDoctor } = useAuth()
  const currentRoles = ((authDoctor as unknown as { roles?: string[] } | null)
    ?.roles || []) as string[]
  // Profiles can be changed/assigned by managers, admins, and clinicians.
  const canManageProfile =
    hasRole(currentRoles, "MANAGER") ||
    hasRole(currentRoles, "ADMIN") ||
    hasRole(currentRoles, "CLINICIAN")

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
            void fetchBilling({ variables: { visitId: visit.id } })
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

  const [removeProfile, { loading: removingProfile }] = useMutation(
    REMOVE_VISIT_DEPARTMENT_PROFILE_MUTATION,
    {
      ...refetchConfig,
      onCompleted: (data) => {
        handleResponse(data?.removeVisitDepartmentProfile, {
          successMessage: "Department profile removed successfully",
          onSuccess: () => {
            onVisitUpdated?.()
            void fetchProfiles({ variables: { visitId: visit.id } })
            void fetchBilling({ variables: { visitId: visit.id } })
          },
        })
      },
      onError: (error) => {
        toast.error(error.message || "Failed to remove department profile")
      },
    },
  )

  const handleRemoveDepartmentProfile = (visitDepartmentId: string) => {
    void removeProfile({ variables: { visitDepartmentId } })
  }

  const { generateInvoice, loading: generatingInvoice } = useGenerateInvoice()
  const { generateConsultationPdf, loading: generatingConsultationPdf } = useGenerateConsultationPdf()

  const handleDepartmentEncounterDateChange = (
    visitDepartmentId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newDate = e.target.value
    if (!newDate) return
    const encounterDate = newDate.length === 16 ? `${newDate}:00` : newDate
    setPendingDepartmentEncounterDate({ visitDepartmentId, date: encounterDate })
  }

  const confirmDepartmentEncounterDateChange = async (applyToChildren = false) => {
    if (!pendingDepartmentEncounterDate) return
    setApplyingDate(true)
    try {
      const deptIdsToUpdate = [pendingDepartmentEncounterDate.visitDepartmentId]
      if (applyToChildren) {
        const parentDept = (visit.departments || []).find(
          (d) => d.id === pendingDepartmentEncounterDate.visitDepartmentId,
        )
        if (parentDept?.childVisitDepartments && parentDept.childVisitDepartments.length > 0) {
          parentDept.childVisitDepartments.forEach((c) => {
            if (c.id && !deptIdsToUpdate.includes(c.id)) {
              deptIdsToUpdate.push(c.id)
            }
          })
        }
      }

      for (const deptId of deptIdsToUpdate) {
        await updateDepartmentEncounterDate({
          variables: {
            input: {
              visitDepartmentId: deptId,
              encounterDate: pendingDepartmentEncounterDate.date,
            },
          },
        })
      }
      setPendingDepartmentEncounterDate(null)
      onVisitUpdated?.()
      void fetchLiveVisit({ variables: { id: visit.id } })
    } finally {
      setApplyingDate(false)
    }
  }

  const handleBillingDateChange = (
    departmentInsuranceBillingId: string,
    visitDepartmentId: string,
    dept: Visit["departments"][number],
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newDate = e.target.value
    if (!newDate) return

    // Validate: billing date must be at least 5 minutes after department encounter date
    const refDateStr = dept.startedAt || dept.createdAt
    if (refDateStr) {
      const refTime = new Date(refDateStr).getTime()
      const billingTime = new Date(newDate).getTime()
      const fiveMinutesMs = 5 * 60 * 1000
      if (billingTime < refTime + fiveMinutesMs) {
        toast.error("Billing date must be at least 5 minutes after this department's encounter date")
        return
      }
    }

    const billingDate = newDate.length === 16 ? `${newDate}:00` : newDate
    setPendingBillingDate({ billingId: departmentInsuranceBillingId, visitDepartmentId, date: billingDate })
  }

  const syncAllDepartmentTimes = async (
    anchorDeptId?: string,
    anchorEncounterDate?: string,
  ) => {
    const depts = [...(currentVisit.departments || [])]
    if (depts.length === 0) return

    setApplyingDate(true)
    try {
      let anchorIdx = 0
      if (anchorDeptId) {
        const foundIdx = depts.findIndex((d) => d.id === anchorDeptId)
        if (foundIdx !== -1) anchorIdx = foundIdx
      }

      const deptEncounterUpdates = new Map<string, string>()
      const billingDateUpdates = new Map<string, string>()

      const getDeptBillings = (d: Visit["departments"][number]) => {
        const deptBilling = billingDepartments?.find(
          (b: any) => b.visitDepartment?.id === d.id,
        )
        return (deptBilling?.insuranceBillings || []) as any[]
      }

      const getEffectiveEncDate = (d: Visit["departments"][number], idx: number): string => {
        if (idx === anchorIdx && anchorEncounterDate) return anchorEncounterDate
        if (deptEncounterUpdates.has(d.id)) return deptEncounterUpdates.get(d.id)!
        return d.startedAt || d.createdAt || currentVisit.visitDate
      }

      if (anchorEncounterDate && anchorDeptId) {
        deptEncounterUpdates.set(anchorDeptId, anchorEncounterDate)
      }

      const anchorDept = depts[anchorIdx]
      const anchorEncDate = getEffectiveEncDate(anchorDept, anchorIdx)
      const anchorBillings = getDeptBillings(anchorDept)
      let anchorEndTime = anchorEncDate

      if (anchorBillings.length > 0) {
        for (const ib of anchorBillings) {
          const currentBTime = parseTimeMs(ib.billingDate)
          const encTime = parseTimeMs(anchorEncDate)!
          const minAllowedBTime = encTime + 5 * 60 * 1000
          if (currentBTime == null || currentBTime < minAllowedBTime) {
            const newBDate = addMinutesToDate(anchorEncDate, getRandomMinutes(5, 10))
            billingDateUpdates.set(ib.id, newBDate)
            if (parseTimeMs(newBDate)! > parseTimeMs(anchorEndTime)!) {
              anchorEndTime = newBDate
            }
          } else {
            if (currentBTime > parseTimeMs(anchorEndTime)!) {
              anchorEndTime = ib.billingDate
            }
          }
        }
      } else {
        anchorEndTime = addMinutesToDate(anchorEncDate, getRandomMinutes(5, 10))
      }

      // ── Forward pass: anchorIdx + 1 to depts.length - 1 ──
      let prevEndTime = anchorEndTime
      for (let i = anchorIdx + 1; i < depts.length; i++) {
        const curDept = depts[i]
        const curEncDate = curDept.startedAt || curDept.createdAt || currentVisit.visitDate
        const curEncTime = parseTimeMs(curEncDate)!
        const prevEndMs = parseTimeMs(prevEndTime)!
        const minAllowedEncTime = prevEndMs + 5 * 60 * 1000

        let effectiveEncDate = curEncDate
        if (curEncTime < minAllowedEncTime) {
          effectiveEncDate = addMinutesToDate(prevEndTime, getRandomMinutes(5, 10))
          deptEncounterUpdates.set(curDept.id, effectiveEncDate)
        }

        const curBillings = getDeptBillings(curDept)
        let curEndTime = effectiveEncDate

        if (curBillings.length > 0) {
          for (const ib of curBillings) {
            const currentBTime = parseTimeMs(ib.billingDate)
            const encTime = parseTimeMs(effectiveEncDate)!
            const minAllowedBTime = encTime + 5 * 60 * 1000
            if (currentBTime == null || currentBTime < minAllowedBTime) {
              const newBDate = addMinutesToDate(effectiveEncDate, getRandomMinutes(5, 10))
              billingDateUpdates.set(ib.id, newBDate)
              if (parseTimeMs(newBDate)! > parseTimeMs(curEndTime)!) {
                curEndTime = newBDate
              }
            } else {
              if (currentBTime > parseTimeMs(curEndTime)!) {
                curEndTime = ib.billingDate
              }
            }
          }
        } else {
          curEndTime = addMinutesToDate(effectiveEncDate, getRandomMinutes(5, 10))
        }

        prevEndTime = curEndTime
      }

      // ── Backward pass: anchorIdx - 1 down to 0 ──
      let nextStartTime = anchorEncDate
      for (let i = anchorIdx - 1; i >= 0; i--) {
        const curDept = depts[i]
        const nextStartMs = parseTimeMs(nextStartTime)!
        const maxAllowedEndTime = nextStartMs - 5 * 60 * 1000

        const curBillings = getDeptBillings(curDept)
        const curEncDate = curDept.startedAt || curDept.createdAt || currentVisit.visitDate

        let curLatestBTime = -1
        let curLatestBDate: string | null = null
        for (const ib of curBillings) {
          const bMs = parseTimeMs(ib.billingDate)
          if (bMs != null && bMs > curLatestBTime) {
            curLatestBTime = bMs
            curLatestBDate = ib.billingDate
          }
        }

        let curEndMs = curLatestBTime > 0 ? curLatestBTime : parseTimeMs(curEncDate)! + 5 * 60 * 1000
        let effectiveEndDate = curLatestBDate || addMinutesToDate(curEncDate, 5)

        if (curEndMs > maxAllowedEndTime) {
          effectiveEndDate = addMinutesToDate(nextStartTime, -getRandomMinutes(5, 10))
          curEndMs = parseTimeMs(effectiveEndDate)!
          for (const ib of curBillings) {
            billingDateUpdates.set(ib.id, effectiveEndDate)
          }
        }

        const curEncTime = parseTimeMs(curEncDate)!
        const maxAllowedEncTime = curEndMs - 5 * 60 * 1000
        let effectiveEncDate = curEncDate

        if (curEncTime > maxAllowedEncTime) {
          effectiveEncDate = addMinutesToDate(effectiveEndDate, -getRandomMinutes(5, 10))
          deptEncounterUpdates.set(curDept.id, effectiveEncDate)
        }

        nextStartTime = effectiveEncDate
      }

      for (const [deptId, encDate] of deptEncounterUpdates.entries()) {
        await updateDepartmentEncounterDate({
          variables: {
            input: {
              visitDepartmentId: deptId,
              encounterDate: encDate.length === 16 ? `${encDate}:00` : encDate,
            },
          },
        })
      }

      for (const [billingId, bDate] of billingDateUpdates.entries()) {
        await updateBillingDate({
          variables: {
            input: {
              departmentInsuranceBillingId: billingId,
              billingDate: bDate.length === 16 ? `${bDate}:00` : bDate,
            },
          },
        })
      }

      const totalUpdates = deptEncounterUpdates.size + billingDateUpdates.size
      if (totalUpdates > 0) {
        toast.success(`Synchronized ${totalUpdates} timestamp(s) across departments (5-min rule)`)
      } else {
        toast.info("All department timestamps already satisfy the 5-minute rule")
      }
      setPendingDepartmentEncounterDate(null)
      setPendingBillingDate(null)
      onVisitUpdated?.()
      void fetchLiveVisit({ variables: { id: visit.id } })
      void fetchBilling({ variables: { visitId: visit.id } })
    } catch (err: any) {
      toast.error(err.message || "Failed to synchronize department times")
    } finally {
      setApplyingDate(false)
    }
  }

  const confirmBillingDateChange = async () => {
    if (!pendingBillingDate) return
    setApplyingDate(true)
    try {
      await updateBillingDate({
        variables: {
          input: {
            departmentInsuranceBillingId: pendingBillingDate.billingId,
            billingDate: pendingBillingDate.date,
          },
        },
      })
      setPendingBillingDate(null)
      onVisitUpdated?.()
      void fetchLiveVisit({ variables: { id: visit.id } })
    } finally {
      setApplyingDate(false)
    }
  }

  const handlePreviewInvoice = async (departmentInsuranceBillingId: string) => {
    try {
      const invoiceUrl = await resolveInvoiceUrl(
        departmentInsuranceBillingId,
        generateInvoice,
      )
      openInvoicePreview(invoiceUrl)
    } catch (err: any) {
      toast.error(err.message || "Failed to generate invoice")
    }
  }

  const handlePreviewConsultation = (dept: Visit["departments"][number]) => {
    if (!dept.answerId) {
      toast.error("No consultation answers found for this department")
      return
    }
    setConsultationPreviewContext({
      answerId: dept.answerId,
      departmentName: dept.department?.name || "Department",
      patientName: `${visit.patient.firstName} ${visit.patient.lastName}`.trim(),
      visitDepartment: dept,
    })
    setConsultationPreviewOpen(true)
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
        toast.success("Billing editing mode enabled for department")
        onVisitUpdated?.()
        void fetchLiveVisit({ variables: { id: visit.id } })
        void fetchBilling({ variables: { visitId: visit.id } })
      } else {
        toast.error(result.message || "Failed to enable billing editing")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to enable billing editing")
    }
  }

  const handleCancelBillEditing = async (visitDepartmentId?: string) => {
    const deptId = visitDepartmentId
    if (!deptId) return
    try {
      const result = await cancelBillEditing(deptId)
      if (result.status === "SUCCESS") {
        toast.success("Billing editing cancelled")
        onVisitUpdated?.()
        void fetchLiveVisit({ variables: { id: visit.id } })
        void fetchBilling({ variables: { visitId: visit.id } })
      } else {
        toast.error(result.message || "Failed to cancel billing editing")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel billing editing")
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

  const handleCancelVisit = () => {
    setDeleteTarget({
      type: "cancel-visit",
      id: visit.id,
      name: `Visit #${visit.id.slice(-8)} for ${visit.patient?.fullName || visit.patient?.firstName || 'Patient'}`,
    })
  }

  const handleDeleteVisit = () => {
    setDeleteTarget({ type: "visit", id: visit.id, name: `Visit ${visit.patient?.fullName || visit.patient?.firstName || ''}` })
  }

  const handleRemoveDepartment = (departmentId: string) => {
    const dept = visit.departments?.find((d) => d.id === departmentId)
    setDeleteTarget({ type: "department", id: departmentId, name: dept?.department?.name || 'this department' })
  }

  const handleCancelDepartment = (departmentId: string) => {
    const dept = visit.departments?.find((d) => d.id === departmentId)
    setDeleteTarget({ type: "cancel-department", id: departmentId, name: dept?.department?.name || 'this department' })
  }

  const handleFinaliseDepartment = (departmentId: string) => {
    const dept = visit.departments?.find((d) => d.id === departmentId)
    setDeleteTarget({ type: "finalise", id: departmentId, name: dept?.department?.name || 'this department' })
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    if (deleteTarget.type === "visit") {
      await deleteVisit({ variables: { visitId: deleteTarget.id } })
    } else if (deleteTarget.type === "cancel-visit") {
      await cancelVisit({ variables: { visitId: deleteTarget.id } })
    } else if (deleteTarget.type === "discharge") {
      await completeVisitMutation({ variables: { visitId: deleteTarget.id } })
    } else if (deleteTarget.type === "department") {
      await removeDepartment({ variables: { visitDepartmentId: deleteTarget.id } })
    } else if (deleteTarget.type === "finalise") {
      await finaliseDepartment({ variables: { visitDepartmentId: deleteTarget.id } })
    } else if (deleteTarget.type === "cancel-department") {
      await cancelDepartment({
        variables: {
          input: {
            visitDepartmentId: deleteTarget.id,
            status: "CANCELLED",
          },
        },
      })
    }
    setDeleteTarget(null)
  }

  const canCancelVisit =
    currentVisit.status !== "CANCELLED" && currentVisit.status !== "COMPLETED"
  const hasDeptEditing = (currentVisit.departments || []).some((d: any) => d.status === "DEPARTMENT_EDITING")
  const canDeleteVisit = !hasDeptEditing
  const hasDepartments = currentVisit.departments && currentVisit.departments.length > 0
  const canDischarge = canDischargeVisit(currentVisit)

  // ── Derived billing state ──
  const billingDepartments = billingData?.visitBilling?.data?.departments
  const hasBillingData = billingDepartments && billingDepartments.length > 0
  const isBillEditing = (currentVisit.departments || []).some((d) => d.status === "DEPARTMENT_EDITING")

  if (!isRendered || typeof document === "undefined") return null

  const deleteDialogTitle =
    deleteTarget?.type === "visit"
      ? "Delete this visit?"
      : deleteTarget?.type === "cancel-visit"
        ? "Cancel this visit?"
        : deleteTarget?.type === "discharge"
          ? `Discharge "${deleteTarget?.name || 'patient'}"?`
          : deleteTarget?.type === "finalise"
            ? `Finalise "${deleteTarget?.name || ''}"?`
            : deleteTarget?.type === "cancel-department"
              ? `Cancel "${deleteTarget?.name || ''}"?`
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
        className={`absolute left-0 top-0 h-full w-[min(92vw,48rem)] border-r border-border bg-background dark:bg-slate-900 shadow-2xl transition-transform duration-200 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
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
                  {/* Visit Overview */}
                  <div className="rounded-xl border border-border p-4 space-y-4 bg-muted/10">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-foreground">
                        Visit Overview
                      </h3>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
                        visit.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : visit.status === "CANCELLED"
                            ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      }`}>
                        {visit.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Patient</span>
                        <p className="font-semibold text-foreground text-sm">
                          {visit.patient?.firstName} {visit.patient?.lastName}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Created At</span>
                        <p className="font-medium text-foreground">
                          {formatFullDateTime(visit.createdAt)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Total Departments</span>
                        <p className="font-medium text-foreground">
                          {visit.departments?.length || 0}
                        </p>
                      </div>
                      {isBillEditing && (
                        <div className="space-y-1">
                          <span className="text-muted-foreground">Billing Edit Mode</span>
                          <p className="font-semibold text-amber-600">Active</p>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground pt-2 border-t border-border/60">
                      Encounter timestamps and billing dates are configured per department in the{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("departments")}
                        className="text-primary hover:underline font-medium"
                      >
                        Departments
                      </button>{" "}
                      tab.
                    </p>
                  </div>

                  {/* Discharge Patient Action */}
                  {canDischarge && (
                    <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 space-y-3 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <h3 className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm">
                              Ready for Patient Discharge
                            </h3>
                          </div>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300">
                            All departments are completed. You can discharge the patient and mark the visit as completed.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget({
                            type: "discharge",
                            id: visit.id,
                            name: `${visit.patient?.firstName} ${visit.patient?.lastName}`.trim(),
                          })}
                          disabled={completingVisit}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                        >
                          {completingVisit ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3.5 w-3.5" />
                          )}
                          Discharge Patient
                        </button>
                      </div>
                    </div>
                  )}

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
                  <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-foreground">
                        Visit Departments
                      </h3>
                    </div>
                    {isAdminOrManager && currentVisit.departments && currentVisit.departments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => void syncAllDepartmentTimes()}
                        disabled={applyingDate}
                        className="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        title="Auto-sync encounter and billing timestamps across all departments to follow the 5-minute rule"
                      >
                        {applyingDate ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CalendarClock className="h-3.5 w-3.5" />
                        )}
                        Auto-Sync Department Times (5-Min Rule)
                      </button>
                    )}
                  </div>

                  {!hasDepartments ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No departments assigned to this visit</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentVisit.departments.map((dept) => (
                        <div
                          key={dept.id}
                          className="rounded-xl border border-border p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">
                                {dept.department?.name || "Unknown Department"}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                Status: <span className="font-semibold text-foreground">{dept.status}</span>
                                {dept.status === "DEPARTMENT_EDITING" && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                                    Editing Active
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Billing Editing Controls for Manager / Admin */}
                              {isAdminOrManager && (
                                <>
                                  {dept.status === "DEPARTMENT_EDITING" ? (
                                    <button
                                      type="button"
                                      onClick={() => handleCancelBillEditing(dept.id)}
                                      disabled={cancellingBillEdit}
                                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                                      title="Cancel billing edits and restore department status"
                                    >
                                      {cancellingBillEdit ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <X className="h-3 w-3" />
                                      )}
                                      Cancel Edit
                                    </button>
                                  ) : (
                                    (dept.status === "COMPLETED" || dept.status === "FINALISED") && (
                                      <button
                                        type="button"
                                        onClick={() => handleStartBillEditing(dept.id)}
                                        disabled={startingBillEdit}
                                        className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                                        title="Enable billing editing mode on this department"
                                      >
                                        {startingBillEdit ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <ReceiptText className="h-3 w-3" />
                                        )}
                                        Enable Billing Edit
                                      </button>
                                    )
                                  )}
                                </>
                              )}

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
                                  <div className="absolute right-0 top-6 z-[150] hidden group-hover:block w-56 p-3 bg-popover border border-border rounded-lg shadow-lg text-xs text-muted-foreground space-y-1">
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
                              {(() => {
                                const isTerminal =
                                  dept.status === "COMPLETED" ||
                                  dept.status === "FINALISED" ||
                                  dept.status === "CANCELLED";
                                const hasProducts = Boolean(
                                  dept.products && dept.products.length > 0
                                );
                                const isAdminOrManager =
                                  hasAdminRole || hasManagerRole || hasFinanceRole;
                                const isAssignedProcessor = Boolean(
                                  doctor?.id &&
                                    dept.processors?.some(
                                      (p) => String(p.id) === String(doctor.id)
                                    )
                                );

                                let canCancelDept = false;
                                if (!isTerminal) {
                                  if (dept.status === "ACTIVE") {
                                    canCancelDept = isAssignedProcessor || isAdminOrManager;
                                  } else {
                                    canCancelDept =
                                      !hasProducts || isAssignedProcessor || isAdminOrManager;
                                  }
                                }
                                const canDeleteDept = (hasAdminRole || hasManagerRole) && dept.status !== "FINALISED";

                                return (
                                  <>
                                    {canCancelDept && (
                                      <button
                                        type="button"
                                        onClick={() => handleCancelDepartment(dept.id)}
                                        disabled={cancellingDept}
                                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                                      >
                                        {cancellingDept ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <Ban className="h-3 w-3" />
                                        )}
                                        Cancel
                                      </button>
                                    )}
                                    {canDeleteDept && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveDepartment(dept.id)}
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
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                          {dept.products && dept.products.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {dept.products.length} product
                              {dept.products.length !== 1 ? "s" : ""} added
                            </div>
                          )}

                          {/* Encounter Date & Time for this department */}
                          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
                            <div className="flex items-center gap-1.5">
                              <CalendarClock className="h-3.5 w-3.5 text-primary" />
                              <span className="text-xs font-medium text-foreground">
                                Encounter Date & Time
                              </span>
                            </div>
                            <div>
                              <input
                                type="datetime-local"
                                key={`dept-encounter-${dept.id}-${dept.startedAt || dept.createdAt}`}
                                defaultValue={
                                  dept.startedAt
                                    ? dept.startedAt.slice(0, 16)
                                    : dept.createdAt
                                      ? dept.createdAt.slice(0, 16)
                                      : ""
                                }
                                onChange={(e) =>
                                  handleDepartmentEncounterDateChange(dept.id, e)
                                }
                                disabled={visit.status === "CANCELLED" || dept.status === "CANCELLED"}
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              {pendingDepartmentEncounterDate?.visitDepartmentId === dept.id && (
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => void confirmDepartmentEncounterDateChange(false)}
                                    disabled={applyingDate}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1 shadow-xs"
                                  >
                                    {applyingDate ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-3 w-3" />
                                    )}
                                    Apply to This Dept
                                  </button>
                                  {dept.childVisitDepartments && dept.childVisitDepartments.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => void confirmDepartmentEncounterDateChange(true)}
                                      disabled={applyingDate}
                                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1 shadow-xs"
                                      title={`Apply this encounter date to ${dept.department?.name || 'this department'} and all its ${dept.childVisitDepartments.length} child department(s)`}
                                    >
                                      {applyingDate ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <CalendarClock className="h-3 w-3" />
                                      )}
                                      Apply to All Child Departments ({dept.childVisitDepartments.length})
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => setPendingDepartmentEncounterDate(null)}
                                    disabled={applyingDate}
                                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs font-medium rounded-md transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                              <p className="text-[11px] text-muted-foreground mt-1">
                                Sets the encounter timestamp for this department
                              </p>
                            </div>
                          </div>

                          {/* Billing Date & Time for this department */}
                          {(() => {
                            const deptBilling = billingDepartments?.find(
                              (b: any) => b.visitDepartment?.id === dept.id,
                            )
                            const insBillings = deptBilling?.insuranceBillings || []
                            return (
                              <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
                                <div className="flex items-center gap-1.5">
                                  <ReceiptText className="h-3.5 w-3.5 text-primary" />
                                  <span className="text-xs font-medium text-foreground">
                                    Department Billing Date & Time
                                  </span>
                                </div>

                                {insBillings.length > 0 ? (
                                  <div className="space-y-3">
                                    {insBillings.map((ib: any) => (
                                      <div
                                        key={ib.id}
                                        className="rounded-md border border-border/40 bg-background p-2.5 space-y-1.5"
                                      >
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-medium text-foreground">
                                            {ib.insurance?.name || "Billing Record"}
                                            {ib.insurance?.acronym ? ` (${ib.insurance.acronym})` : ""}
                                          </span>
                                          <span className="text-muted-foreground">
                                            {ib.totalAmount?.toLocaleString()} RWF
                                            {ib.status && (
                                              <span className={`ml-2 font-medium ${
                                                ib.status === "PAID" ? "text-emerald-600" :
                                                ib.status === "PARTIALLY_PAID" ? "text-amber-600" :
                                                "text-muted-foreground"
                                              }`}>
                                                • {ib.status}
                                              </span>
                                            )}
                                          </span>
                                        </div>
                                        <input
                                          type="datetime-local"
                                          key={`billing-date-${ib.id}-${ib.billingDate}`}
                                          defaultValue={
                                            ib.billingDate
                                              ? ib.billingDate.slice(0, 16)
                                              : ""
                                          }
                                          min={
                                            dept.startedAt
                                              ? dept.startedAt.slice(0, 16)
                                              : dept.createdAt
                                                ? dept.createdAt.slice(0, 16)
                                                : undefined
                                          }
                                          onChange={(e) =>
                                            handleBillingDateChange(ib.id, dept.id, dept, e)
                                          }
                                          disabled={visit.status === "CANCELLED" || dept.status === "CANCELLED"}
                                          className="w-full px-3 py-1.5 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        {pendingBillingDate?.billingId === ib.id && (
                                          <div className="flex items-center gap-2 mt-1.5">
                                            <button
                                              type="button"
                                              onClick={() => void confirmBillingDateChange()}
                                              disabled={applyingDate}
                                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1"
                                            >
                                              {applyingDate ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                              ) : (
                                                <CheckCircle className="h-3 w-3" />
                                              )}
                                              Apply Billing Date
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setPendingBillingDate(null)}
                                              disabled={applyingDate}
                                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs font-medium rounded-md transition-colors"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        )}
                                        <p className="text-[10px] text-muted-foreground">
                                          Must be at least 5 minutes after this department&apos;s encounter date
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground italic">
                                    No billing records for this department yet
                                  </p>
                                )}
                              </div>
                            )
                          })()}

                          {/* Clinic profile (assigned + available), with change/set/clear for managers & clinicians */}
                          {(() => {
                            const profileDept = profileDeptsByVisitDeptId.get(dept.id)
                            const deptCatalog = departments.find(
                              (d) => String(d.id) === String(dept.department?.id || dept.id),
                            )
                            const assigned = profileDept?.assigned ?? (dept.profile ? { id: dept.profile.id, name: dept.profile.name, encounterType: (dept as any).encounterType } : null)
                            const rawAvailable = (profileDept?.available?.length ? profileDept.available : (deptCatalog?.profiles || (dept.department as any)?.profiles || [])) as Array<{ id: string; name: string; encounterType?: string }>
                            const available = rawAvailable.map((p) => ({
                              id: p.id,
                              name: p.name,
                              encounterType: p.encounterType || "",
                            }))
                            const isSupportRequests = Boolean(deptCatalog?.supportRequests || (dept.department as any)?.supportRequests)
                            const loading = profilesLoading && !profileDept && !deptCatalog
                            const isLocked = dept.status === "BILLING" || dept.status === "COMPLETED" || dept.status === "FINALISED" || dept.status === "DEPARTMENT_EDITING"

                            if (isSupportRequests) {
                              return (
                                <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                      <FileText className="h-3.5 w-3.5 text-primary" />
                                      Clinic Profile
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    This department supports requests, so profiles cannot be applied.
                                  </p>
                                </div>
                              )
                            }

                            if (!loading && available.length === 0) {
                              return (
                                <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                      <FileText className="h-3.5 w-3.5 text-primary" />
                                      Clinic Profile
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground italic">
                                    No profiles configured for this department
                                  </p>
                                </div>
                              )
                            }

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
                                {assigned ? (
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
                                {canManageProfile && !loading && !isLocked && (
                                  <>
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
                                          placeholder={assigned ? "Change profile..." : "Select and assign profile..."}
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
                                    {assigned && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveDepartmentProfile(dept.id)}
                                        disabled={removingProfile || changingProfile}
                                        className="mt-1.5 px-2 py-1 text-[11px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                      >
                                        {removingProfile ? "Removing..." : "Remove profile"}
                                      </button>
                                    )}
                                  </>
                                )}
                                {canManageProfile && !loading && (dept.status === "COMPLETED" || dept.status === "FINALISED") && (
                                  <p className="text-[11px] text-muted-foreground mt-1">
                                    Profile is locked on {dept.status.toLowerCase()} departments. Use
                                    &quot;Edit Billing&quot; on the billing page to enter edit mode first.
                                  </p>
                                )}
                                {canManageProfile && !loading && dept.status === "BILLING" && (
                                  <p className="text-[11px] text-muted-foreground mt-1">
                                    Profile is locked while the department is in billing.
                                  </p>
                                )}
                                {canManageProfile && !loading && dept.status === "DEPARTMENT_EDITING" && (
                                  <p className="text-[11px] text-muted-foreground mt-1">
                                    Department is in billing edit mode.
                                  </p>
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
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1 border border-blue-200"
                              >
                                <FileText className="h-3 w-3" />
                                Preview Consultation
                              </button>
                            )}
                            {(() => {
                              const deptBilling = billingDepartments?.find(
                                (b: any) => b.visitDepartment?.id === dept.id,
                              )
                              const firstInsuranceBilling =
                                deptBilling?.insuranceBillings?.[0]
                              if (firstInsuranceBilling) {
                                return (
                                  <button
                                    type="button"
                                    onClick={() => handlePreviewInvoice(firstInsuranceBilling.id)}
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
        title={deleteDialogTitle}
        entityName={deleteTarget?.name || ''}
        dependencies={deleteDialogDeps}
        confirmLabel={
          deleteTarget?.type === "visit"
            ? "Delete Visit"
            : deleteTarget?.type === "cancel-visit"
              ? "Cancel Visit"
              : deleteTarget?.type === "finalise"
                ? "Finalise"
                : deleteTarget?.type === "cancel-department"
                  ? "Cancel Department"
                  : "Remove Department"
        }
        busy={cancelling || deleting || removingDept || finalisingDept || cancellingDept}
        onConfirm={() => void handleConfirmDelete()}
      />

      <ConsultationPreviewSheet
        open={consultationPreviewOpen}
        onOpenChange={setConsultationPreviewOpen}
        answerId={consultationPreviewContext?.answerId ?? null}
        departmentName={consultationPreviewContext?.departmentName}
        patientName={consultationPreviewContext?.patientName}
        visitDepartment={consultationPreviewContext?.visitDepartment ?? null}
      />
    </>
  )
}
