"use client"

import { useState, useEffect } from "react"
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

interface VisitSettingsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  visit: Visit
  onVisitUpdated?: () => void
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

  const [cancelVisit, { loading: cancelling }] = useMutation(
    CANCEL_VISIT_MUTATION,
    {
      onCompleted: (data) => {
        if (data?.cancelVisit?.status === "SUCCESS") {
          toast.success("Visit cancelled successfully")
          onVisitUpdated?.()
          onOpenChange(false)
        } else {
          toast.error(data?.cancelVisit?.message || "Failed to cancel visit")
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to cancel visit")
      },
    },
  )

  const [deleteVisit, { loading: deleting }] = useMutation(
    DELETE_VISIT_MUTATION,
    {
      onCompleted: (data) => {
        if (data?.deleteVisit?.status === "SUCCESS") {
          toast.success("Visit deleted successfully")
          onVisitUpdated?.()
          onOpenChange(false)
        } else {
          toast.error(data?.deleteVisit?.message || "Failed to delete visit")
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete visit")
      },
    },
  )

  const [removeDepartment, { loading: removingDept }] = useMutation(
    REMOVE_VISIT_DEPARTMENT_MUTATION,
    {
      onCompleted: (data) => {
        if (data?.removeVisitDepartment?.status === "SUCCESS") {
          toast.success("Department removed successfully")
          onVisitUpdated?.()
        } else {
          toast.error(
            data?.removeVisitDepartment?.message ||
              "Failed to remove department",
          )
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to remove department")
      },
    },
  )

  const [finaliseDepartment, { loading: finalisingDept }] = useMutation(
    FINALISE_VISIT_DEPARTMENT_MUTATION,
    {
      onCompleted: (data) => {
        if (data?.updateVisitDepartmentStatus?.status === "SUCCESS") {
          toast.success("Department finalised successfully")
          onVisitUpdated?.()
        } else {
          toast.error(
            data?.updateVisitDepartmentStatus?.message ||
              "Failed to finalise department",
          )
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to finalise department")
      },
    },
  )

  const [changeVisitDate] = useMutation(CHANGE_VISIT_DATE_MUTATION, {
    onCompleted: (data) => {
      if (data?.changeVisitDate?.status === "SUCCESS") {
        toast.success("Visit date updated successfully")
        onVisitUpdated?.()
      } else {
        toast.error(
          data?.changeVisitDate?.message || "Failed to update visit date",
        )
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update visit date")
    },
  })

  const [updateBillingDate] = useMutation(UPDATE_BILLING_DATE_MUTATION, {
    onCompleted: (data) => {
      if (data?.updateBillingDate?.status === "SUCCESS") {
        toast.success("Billing date updated successfully")
        onVisitUpdated?.()
      } else {
        toast.error(
          data?.updateBillingDate?.message || "Failed to update billing date",
        )
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update billing date")
    },
  })

  const { startBillEditing, loading: startingBillEdit } = useStartBillEditing()

  const [fetchBilling, { data: billingData }] = useLazyQuery(
    gql`
      query GetVisitBillingForSettings($visitId: ID!) {
        visitBilling(visitId: $visitId) {
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
    `,
    { fetchPolicy: "network-only" },
  )

  useEffect(() => {
    if (open) {
      fetchBilling({ variables: { visitId: visit.id } })
    }
  }, [open, visit.id])

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

    await updateBillingDate({
      variables: {
        input: {
          departmentInsuranceBillingId,
          billingDate: new Date(newDate).toISOString(),
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

  const handleStartBillEditing = async () => {
    try {
      const result = await startBillEditing(visit.id)
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

  const handleDeleteVisit = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this visit? This action cannot be undone.",
      )
    )
      return
    await deleteVisit({ variables: { visitId: visit.id } })
  }

  const handleRemoveDepartment = async (departmentId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this department from the visit?",
      )
    )
      return
    await removeDepartment({ variables: { visitDepartmentId: departmentId } })
  }

  const handleFinaliseDepartment = async (departmentId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to finalise this department? This will lock it from further changes.",
      )
    )
      return
    await finaliseDepartment({
      variables: { visitDepartmentId: departmentId },
    })
  }

  const handleVisitDateChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newDate = e.target.value
    if (!newDate) return
    await changeVisitDate({
      variables: {
        input: {
          visitId: visit.id,
          visitDate: new Date(newDate).toISOString(),
        },
      },
    })
  }

  const canCancelVisit =
    visit.status !== "CANCELLED" && visit.status !== "COMPLETED"
  const canDeleteVisit = visit.status !== "BILL_EDITING"
  const hasDepartments = visit.departments && visit.departments.length > 0
  const hasNoProducts = (dept: Visit["departments"][number]) =>
    !dept.products || dept.products.length === 0

  if (!isRendered || typeof document === "undefined") return null

  return createPortal(
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
                          ? new Date(visit.visitDate)
                              .toISOString()
                              .slice(0, 16)
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
                      {visit.status === "COMPLETED" && (
                        <button
                          type="button"
                          onClick={handleStartBillEditing}
                          disabled={startingBillEdit}
                          className="ml-auto px-2.5 py-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1"
                        >
                          {startingBillEdit ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <ReceiptText className="h-3 w-3" />
                          )}
                          Enable Billing Edit
                        </button>
                      )}
                      {visit.status === "BILL_EDITING" && (
                        <span className="ml-auto text-xs text-amber-600 font-medium">
                          Billing edit mode active
                        </span>
                      )}
                    </div>
                    {(() => {
                      // Flatten all insurance billings across departments
                      const allInsBillings: any[] = [];
                      billingData?.visitBilling?.departments?.forEach((dept: any) => {
                        (dept.insuranceBillings || []).forEach((ib: any) => {
                          allInsBillings.push({
                            ...ib,
                            departmentName: dept.visitDepartment?.department?.name || "Department",
                          });
                        });
                      });

                      if (allInsBillings.length > 0) {
                        return (
                          <div className="space-y-3">
                            {allInsBillings.map((ib: any) => (
                              <div
                                key={ib.id}
                                className="rounded-lg border border-border/50 p-3 space-y-2"
                              >
                                <p className="text-sm font-medium text-foreground">
                                  {ib.departmentName}
                                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                                    • Total: {ib.totalAmount}
                                  </span>
                                </p>
                                <input
                                  type="datetime-local"
                                  defaultValue={
                                    ib.billingDate
                                      ? new Date(ib.billingDate)
                                          .toISOString()
                                          .slice(0, 16)
                                      : ""
                                  }
                                  min={visit.visitDate
                                    ? new Date(
                                        new Date(visit.visitDate).getTime() +
                                          5 * 60 * 1000,
                                      )
                                        .toISOString()
                                        .slice(0, 16)
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
                        );
                      }

                      return (
                        <div className="text-center py-4 text-muted-foreground">
                          <p className="text-sm">No billing records yet</p>
                        </div>
                      );
                    })()}
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
                              const deptBilling = billingData?.visitBilling?.departments?.find(
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
  )
}
