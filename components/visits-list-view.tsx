"use client"
import { useState, useEffect, useMemo } from "react"
import {
  useDepartments,
  useGenerateInvoice,
} from "@/hooks/auth-hooks"
import type { Visit, VisitBilling } from "@/lib/api-types"
import { mapGqlVisitBilling } from "@/lib/visit-billing-utils"
import {
  getDerivedVisitBillingStatus,
  visitHasUnbilledProducts,
  visitHasBillableProducts,
  visitProductsFullySettled,
  canDischargeVisit,
} from "@/lib/visit-product-utils"
import { useLazyQuery, useMutation } from "@apollo/client"
import { GET_BILL_BY_VISIT_QUERY } from "@/hooks/queries"
import { COMPLETE_VISIT_MUTATION, CANCEL_VISIT_MUTATION } from "@/hooks/mutations/visits"
import { toast } from "react-toastify"
import { openInvoicePreview, resolveInvoiceUrl } from "@/lib/invoice-utils"
import { BillingPreviewSheet } from "@/components/billing/billing-preview-sheet"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useRouter } from "next/navigation"
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  ReceiptText,
  Plus,
  Stethoscope,
  Activity,
  Loader2,
  Ban,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { useAuth } from "@/lib/auth-context"
import { hasRole } from "@/lib/role-utils"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

const AddDepartmentModal = dynamic(
  () => import("./add-department-modal").then((m) => m.AddDepartmentModal),
  { ssr: false }
)
interface VisitsListViewProps {
  visits: Visit[]
  onVisitSelect: (visit: Visit) => void
  onConsultVisit: (visit: Visit) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  refetchVisits?: () => void
}

export default function VisitsListView({
  visits,
  onVisitSelect,
  onConsultVisit,
  searchQuery,
  onSearchChange,
  refetchVisits,
}: VisitsListViewProps) {
  const router = useRouter()
  const { refetch: refetchDepartments } = useDepartments()
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { doctor } = useAuth()
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false)
  const [selectedVisitForDepartment, setSelectedVisitForDepartment] =
    useState<Visit | null>(null)
  const { generateInvoice } = useGenerateInvoice()
  const [getVisitBillings] = useLazyQuery(GET_BILL_BY_VISIT_QUERY)
  const [previewingVisitId, setPreviewingVisitId] = useState<string | null>(
    null,
  )
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewVisitBilling, setPreviewVisitBilling] =
    useState<VisitBilling | null>(null)
  const [previewDepartmentId, setPreviewDepartmentId] = useState<string | null>(
    null,
  )
  const [previewVisit, setPreviewVisit] = useState<Visit | null>(null)
  const [previewStartedAt, setPreviewStartedAt] = useState<number | null>(null)
  // In-flight invoice generation (print/download) — disables those buttons
  // so a double click can't fire generateInvoice twice.
  const [printingInvoice, setPrintingInvoice] = useState(false)
  const [navigatingVisitId, setNavigatingVisitId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25

  // Reset page when search query or visit count changes significantly
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const totalPages = Math.max(1, Math.ceil(visits.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedVisits = useMemo<Visit[]>(() => {
    const start = (safeCurrentPage - 1) * pageSize
    return visits.slice(start, start + pageSize)
  }, [visits, safeCurrentPage, pageSize])

  // Safety guard: auto-clear navigating state after 3.5s or on window focus
  useEffect(() => {
    if (!navigatingVisitId) return
    const timer = setTimeout(() => {
      setNavigatingVisitId(null)
    }, 3500)
    const handleFocus = () => setNavigatingVisitId(null)
    window.addEventListener("focus", handleFocus)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("focus", handleFocus)
    }
  }, [navigatingVisitId])
  const handleDownloadInvoice = async (
    departmentInsuranceBillingId: string,
    copyType?: string,
  ) => {
    if (printingInvoice) return
    setPrintingInvoice(true)
    try {
      const invoiceUrl = await resolveInvoiceUrl(
        departmentInsuranceBillingId,
        generateInvoice,
        copyType,
      )
      openInvoicePreview(invoiceUrl)
    } finally {
      setPrintingInvoice(false)
    }
  }
  const handlePreviewInvoice = async (visit: Visit) => {
    try {
      setPreviewingVisitId(visit.id)
      const billRes = await getVisitBillings({
        variables: { visitId: visit.id },
      })
      const gqlVisitBilling = billRes.data?.visitBilling?.data
      if (!gqlVisitBilling) {
        toast.error("No bill found for this visit.")
        return
      }

      setPreviewVisitBilling(mapGqlVisitBilling(gqlVisitBilling))
      setPreviewVisit(visit)
      // choose initial department if available
      const topLevelDepartments = visit?.departments || []
      if (topLevelDepartments.length === 1)
        setPreviewDepartmentId(topLevelDepartments[0].id)
      setPreviewStartedAt(Date.now())
      setPreviewOpen(true)
    } catch (err: unknown) {
      console.error("Preview invoice error:", err)
      const message =
        err instanceof Error ? err.message : "Failed to load bill for preview"
      toast.error(message)
    } finally {
      setPreviewingVisitId(null)
    }
  }
  const hasUnbilledItems = (visit: Visit) => {
    if (visitProductsFullySettled(visit)) return false
    return visitHasUnbilledProducts(visit)
  }
  const canAddDepartment = (visit: Visit) => {
    return (
      getDerivedVisitBillingStatus(visit) !== "BILLED" &&
      visit.status !== "IN_PROGRESS" &&
      visit.status !== "COMPLETED" &&
      visit.status !== "CANCELLED"
    )
  }
  const handleAddDepartment = (visit: Visit) => {
    setSelectedVisitForDepartment(visit)
    setAddDepartmentModalOpen(true)
  }
  const handleAddDepartmentSuccess = () => {
    // Refetch visits and departments data after successful addition
    refetchVisits?.()
    refetchDepartments()
  }
  const getTriageDuration = (visit: Visit) => {
    const startedAt = new Date(visit.visitDate).getTime()
    if (Number.isNaN(startedAt)) return "Triage"
    const elapsedMs = Math.max(Date.now() - startedAt, 0)
    const totalMinutes = Math.floor(elapsedMs / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours <= 0) {
      return `Triage • ${minutes}m`
    }

    return `Triage • ${hours}h ${minutes}m`
  }
  const handleGoToBilling = (visit: Visit) => {
    router.push(`/billing?visitId=${visit.id}&patientId=${visit.patient.id}`)
  }
  const handleTriageVisit = (visit: Visit) => {
    router.push(`/triage?visitId=${visit.id}`)
  }
  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles ||
    []) as string[]
  const isClinicianLike =
    roles.includes("CLINICIAN") || roles.includes("DOCTOR")
  const hasNurseRole = roles.includes("NURSE")
  const hasReceptionistRole =
    roles.includes("RECEPTIONIST") || roles.includes("RECEPTION")
  const hasFinanceRole = roles.includes("FINANCE")
  const hasManagerRole = hasRole(roles, "MANAGER")
  const hasAdminRole = hasRole(roles, "ADMIN")
  const canSeeDischargeButton = hasManagerRole || hasAdminRole || hasFinanceRole

  const [dischargeConfirmVisit, setDischargeConfirmVisit] = useState<Visit | null>(null)
  const [completeVisitMutation, { loading: discharging }] = useMutation(
    COMPLETE_VISIT_MUTATION,
    {
      onCompleted: (data) => {
        if (data?.completeVisit?.status === "SUCCESS") {
          toast.success("Patient discharged successfully")
          refetchVisits?.()
          setDischargeConfirmVisit(null)
        } else {
          toast.error(data?.completeVisit?.message || "Failed to discharge patient")
        }
      },
      onError: (err) => {
        toast.error(err.message || "Failed to discharge patient")
      },
    }
  )

  const handleDischargeVisit = async (targetVisit: Visit) => {
    if (discharging) return
    await completeVisitMutation({ variables: { visitId: targetVisit.id } })
  }

  const [visitToCancel, setVisitToCancel] = useState<Visit | null>(null)
  const [cancelVisitMutation, { loading: cancelingVisit }] = useMutation(
    CANCEL_VISIT_MUTATION,
    {
      onCompleted: (data) => {
        if (data?.cancelVisit?.status === "SUCCESS") {
          toast.success("Visit cancelled successfully")
          refetchVisits?.()
          setVisitToCancel(null)
        } else {
          toast.error(data?.cancelVisit?.message || "Failed to cancel visit")
        }
      },
      onError: (err) => {
        toast.error(err.message || "Failed to cancel visit")
      },
    }
  )

  const handleCancelVisit = async (targetVisit: Visit) => {
    if (cancelingVisit) return
    await cancelVisitMutation({ variables: { visitId: targetVisit.id } })
  }

  const canUserCancelWholeVisit = (visit: Visit) => {
    if (!visit || !visit.id) return false
    if (visit.status === "COMPLETED" || visit.status === "FINALISED" || visit.status === "CANCELLED") {
      return false
    }
    const canRoleCancel = hasReceptionistRole || hasFinanceRole || hasManagerRole || hasAdminRole
    if (!canRoleCancel) return false

    if (visitHasBillableProducts(visit)) {
      return false
    }
    const allDepts = visit.departments || []
    const hasCompletedDept = allDepts.some((d: any) => d.status === "COMPLETED" || d.status === "FINALISED")
    if (hasCompletedDept) return false

    return true
  }
  const getUserDepartmentIds = () => {
    if (!doctor) return []
    const anyDoc = doctor as any
    // Extract departments from stored user object
    const depts = Array.isArray(anyDoc.departments) ? anyDoc.departments : []
    if (depts.length > 0) {
      return depts
        .map((dept: { id?: string }) => String(dept.id || ""))
        .filter(Boolean)
    }

    // Backward compatibility for older stored sessions
    const dept = anyDoc.department
    if (dept && dept.id) {
      return [String(dept.id)]
    }
    return []
  }
  const userDepartmentIds = getUserDepartmentIds()
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CREATED":
        return <AlertCircle className="w-4 h-4 text-secondary" />
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4 text-accent" />
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-primary" />
      case "CANCELLED":
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />
    }
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CREATED":
        return "text-secondary"
      case "IN_PROGRESS":
        return "text-accent"
      case "COMPLETED":
        return "text-primary"
      case "CANCELLED":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
  }
  return (
    <div
      className="bg-card/70 dark:bg-transparent border border-border dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/40"
      style={isDark ? { backgroundColor: "#121827" } : undefined}
    >
      {/* Search bar */}
      <div className="p-6 border-b border-border dark:border-slate-800/80">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground dark:text-slate-300" />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background dark:bg-[#1a2333] border border-border dark:border-slate-800 rounded-lg text-foreground dark:text-slate-100 placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Visits list */}
      <div className="divide-y divide-border dark:divide-slate-800/80">
        {visits.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No visits found</p>
          </div>
        ) : (
          paginatedVisits.map((visit) => (
            <div
              key={visit.id}
              onClick={() => onVisitSelect(visit)}
              className="p-4 hover:bg-muted/50 dark:bg-transparent dark:hover:bg-[#1b2535] dark:text-slate-100 cursor-pointer transition-colors"
              style={isDark ? { backgroundColor: "#121827" } : undefined}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-3">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(visit.status)}
                  <div className="min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {visit.patient.firstName} {visit.patient.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground dark:text-slate-300 truncate">
                      Visit #{visit.id.slice(-8)} •{" "}
                      {new Date(visit.visitDate).toLocaleDateString()}
                    </p>
                    {/* Show active department for progress tracking when visit is not completed/cancelled */}
                    {visit.status !== "COMPLETED" &&
                      visit.status !== "CANCELLED" && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          {visit.departments?.length === 0
                            ? `Active Department: ${getTriageDuration(visit)}`
                            : `Active Department: ${visit.departments?.find((dept) => dept.status === "ACTIVE")?.department?.name || "None"}`}
                        </p>
                      )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end lg:justify-start lg:flex-nowrap">
                  {(() => {
                    // Match any visit department on the visit against user's departments
                    // and allow consultation when that visit department is not finalised/cancelled.
                    const matchingDept = visit.departments?.find((d) => {
                      const deptId = String(d?.department?.id || d?.id || "")
                      const isDepartmentOpen =
                        d?.status !== "FINALISED" && d?.status !== "CANCELLED"
                      return (
                        deptId &&
                        userDepartmentIds.includes(deptId) &&
                        isDepartmentOpen
                      )
                    })
                    const canUserConsultThisVisit =
                      isClinicianLike && Boolean(matchingDept)
                    const showConsultButton = canUserConsultThisVisit
                    const hasExistingAnswer = Boolean(
                      matchingDept?.answerId ||
                        matchingDept?.hasFinalizedConsultationAnswers,
                    )
                    const isEligibleForContinue = Boolean(
                      matchingDept &&
                        matchingDept.status !== "FINALISED" &&
                        matchingDept.status !== "CANCELLED",
                    )
                    const isContinue =
                      hasExistingAnswer && isEligibleForContinue
                    const consultButtonTitle = isContinue
                      ? "Continue"
                      : "Start Consult"
                    const consultButtonText = isContinue
                      ? "Continue"
                      : "Consult"
                    const consultButtonFullText =
                      navigatingVisitId === visit.id
                        ? "Opening…"
                        : isContinue
                          ? "Continue"
                          : "Start Consult"
                    const showTriageButton =
                      (visit.status === "CREATED" ||
                        visit.status === "IN_PROGRESS") &&
                      hasNurseRole
                    if (process.env.NODE_ENV !== "production") {
                      try {
                         

                      } catch {
                        // ignore
                      }
                    }

                    return (
                      <>
                        {showConsultButton && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setNavigatingVisitId(visit.id)
                              onConsultVisit(visit)
                            }}
                            title={consultButtonTitle}
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap flex items-center gap-1 sm:gap-2"
                          >
                            {navigatingVisitId === visit.id ? (
                              <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
                            ) : (
                              <Stethoscope className="w-4 h-4 flex-shrink-0" />
                            )}
                            <span className="hidden sm:inline lg:hidden">
                              {consultButtonText}
                            </span>
                            <span className="hidden lg:inline">
                              {consultButtonFullText}
                            </span>
                          </button>
                        )}

                        {showTriageButton && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setNavigatingVisitId(visit.id)
                              handleTriageVisit(visit)
                            }}
                            title="Open Triage"
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap flex items-center gap-1 sm:gap-2"
                          >
                            {navigatingVisitId === visit.id ? (
                              <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
                            ) : (
                              <Activity className="w-4 h-4 flex-shrink-0" />
                            )}
                            <span className="hidden sm:inline lg:hidden">
                              Triage
                            </span>
                            <span className="hidden lg:inline">
                              {navigatingVisitId === visit.id ? "Opening…" : "Open Triage"}
                            </span>
                          </button>
                        )}

                        {/* Add Department: only for RECEPTIONIST role */}
                        {hasReceptionistRole && canAddDepartment(visit) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddDepartment(visit)
                            }}
                            title="Add Department"
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                          >
                            <Plus className="w-4 h-4 flex-shrink-0" />
                            <span className="hidden sm:inline lg:hidden">
                              Dept
                            </span>
                            <span className="hidden lg:inline">
                              Add Department
                            </span>
                          </button>
                        )}
                        {/* Bill Visit: only for FINANCE role */}
                        {hasFinanceRole && hasUnbilledItems(visit) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setNavigatingVisitId(visit.id)
                              handleGoToBilling(visit)
                            }}
                            title="Bill Visit"
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                          >
                            {navigatingVisitId === visit.id ? (
                              <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
                            ) : (
                              <ReceiptText className="w-4 h-4 flex-shrink-0" />
                            )}
                            <span className="hidden sm:inline lg:hidden">
                              Bill
                            </span>
                            <span className="hidden lg:inline">
                              {navigatingVisitId === visit.id ? "Opening…" : "Bill Visit"}
                            </span>
                          </button>
                        )}
                        {/* Preview Invoice: only for FINANCE role if billed or completed/finalised */}
                        {hasFinanceRole &&
                          (getDerivedVisitBillingStatus(visit) === "BILLED" ||
                            visit.status === "COMPLETED" ||
                            visit.status === "FINALISED") && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                void handlePreviewInvoice(visit)
                              }}
                              title="Preview Invoice"
                              disabled={previewingVisitId === visit.id}
                              className="px-2 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                            >
                              <ReceiptText
                                className={`w-4 h-4 flex-shrink-0 ${previewingVisitId === visit.id ? "animate-spin" : ""}`}
                              />
                              <span className="hidden sm:inline lg:hidden">
                                Invoice
                              </span>
                              <span className="hidden lg:inline">
                                Preview Invoice
                              </span>
                            </button>
                          )}
                        {/* Discharge Patient: when all departments completed, visible to MANAGER, ADMIN, FINANCE */}
                        {canSeeDischargeButton && canDischargeVisit(visit) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDischargeConfirmVisit(visit)
                            }}
                            disabled={discharging && dischargeConfirmVisit?.id === visit.id}
                            title="Discharge Patient"
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                          >
                            {discharging && dischargeConfirmVisit?.id === visit.id ? (
                              <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            )}
                            <span className="hidden sm:inline lg:hidden">
                              Discharge
                            </span>
                            <span className="hidden lg:inline">
                              Discharge
                            </span>
                          </button>
                        )}
                        {/* Cancel Visit: for RECEPTION, FINANCE, MANAGER, ADMIN when no products/billing exist */}
                        {canUserCancelWholeVisit(visit) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setVisitToCancel(visit)
                            }}
                            disabled={cancelingVisit && visitToCancel?.id === visit.id}
                            title="Cancel Visit"
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 dark:text-rose-400 text-xs sm:text-sm font-medium rounded-full border border-rose-300 dark:border-rose-900/60 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap cursor-pointer"
                          >
                            <Ban className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
                            <span className="hidden sm:inline lg:hidden">
                              Cancel
                            </span>
                            <span className="hidden lg:inline">
                              Cancel Visit
                            </span>
                          </button>
                        )}
                      </>
                    )
                  })()}

                  <div className="text-right text-xs sm:text-sm ml-auto lg:ml-0 dark:text-slate-100">
                    {/* Only show visit status if COMPLETED or CANCELLED */}
                    {visit.status === "COMPLETED" ||
                    visit.status === "CANCELLED" ? (
                      <span
                        className={`font-medium ${getStatusColor(visit.status)}`}
                      >
                        {visit.status}
                      </span>
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        In Progress
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground dark:text-slate-300 mt-1">
                      {visit.patient.gender} •{" "}
                      {new Date().getFullYear() -
                        new Date(visit.patient.dateOfBirth).getFullYear()}{" "}
                      years old
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-muted-foreground">
          <span>
            Showing {(safeCurrentPage - 1) * pageSize + 1}–{Math.min(safeCurrentPage * pageSize, visits.length)} of {visits.length} visits
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="h-8 px-2.5"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="font-medium text-foreground px-1">
              Page {safeCurrentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="h-8 px-2.5"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {selectedVisitForDepartment && (
        <AddDepartmentModal
          visit={selectedVisitForDepartment}
          isOpen={addDepartmentModalOpen}
          onClose={() => {
            setAddDepartmentModalOpen(false)
            setSelectedVisitForDepartment(null)
          }}
          onSuccess={handleAddDepartmentSuccess}
        />
      )}

      <BillingPreviewSheet
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open)
          if (!open) {
            setPreviewVisitBilling(null)
            setPreviewDepartmentId(null)
            setPreviewVisit(null)
            setPreviewStartedAt(null)
          }
        }}
        visit={previewVisit}
        billingData={null}
        visitBilling={previewVisitBilling}
        selectedDepartmentId={previewDepartmentId}
        onDepartmentSelect={setPreviewDepartmentId}
        previewStartedAt={previewStartedAt}
        onPrintInvoice={handleDownloadInvoice}
        onDownloadInvoice={handleDownloadInvoice}
        canViewMore={hasFinanceRole}
        onViewMore={() => {
          if (previewVisit) {
            router.push(`/billing?visitId=${previewVisit.id}`)
          }
        }}
        printingInvoice={printingInvoice}
      />

      {/* Discharge Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={Boolean(dischargeConfirmVisit)}
        onOpenChange={(open) => {
          if (!open && !discharging) setDischargeConfirmVisit(null)
        }}
        title="Discharge patient?"
        entityName={dischargeConfirmVisit ? `${dischargeConfirmVisit.patient.firstName} ${dischargeConfirmVisit.patient.lastName}` : "Patient"}
        extraWarning="This will mark the patient visit as completed and finalized across all departments."
        confirmLabel="Discharge Patient"
        busy={discharging}
        onConfirm={async () => {
          if (dischargeConfirmVisit) {
            await handleDischargeVisit(dischargeConfirmVisit)
          }
        }}
      />

      {/* Cancel Visit Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(visitToCancel)}
        onOpenChange={(open) => {
          if (!open && !cancelingVisit) setVisitToCancel(null)
        }}
        title="Cancel Visit"
        description={
          visitToCancel ? (
            <span>
              Are you sure you want to cancel the entire visit for{" "}
              <strong className="text-foreground">
                {visitToCancel.patient.firstName} {visitToCancel.patient.lastName}
              </strong>? Since no products or services have been billed, the visit and its departments will be marked as cancelled.
            </span>
          ) : null
        }
        confirmLabel="Cancel Visit"
        cancelLabel="Keep Visit"
        destructive
        busy={cancelingVisit}
        onConfirm={() => {
          if (visitToCancel) {
            void handleCancelVisit(visitToCancel)
          }
        }}
      />
    </div>
  )
}
