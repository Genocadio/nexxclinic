"use client"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  useVisits,
  useUpdateVisitDepartmentStatus,
  useDashboardStats,
  useGenerateInvoice,
} from "@/hooks/auth-hooks"
import type { Visit, VisitBilling } from "@/lib/api-types"
import { mapGqlVisitBilling } from "@/lib/visit-billing-utils"
import {
  countBilledVisitProducts,
  countPendingOperatorConfirmations,
  countUnbilledVisitProducts,
  flattenVisitDepartments,
  getBilledVisitProductNames,
  getDepartmentsReadyForBilling,
  getDerivedVisitBillingStatus,
  getUnbilledVisitProductNames,
  getVisitDepartmentBillingStatus,
  visitHasBillableProducts,
  visitHasDepartmentReadyForBilling,
  visitHasUnbilledProducts,
  visitProductsFullySettled,
} from "@/lib/visit-product-utils"
import { useLazyQuery, useMutation } from "@apollo/client"
import { GET_BILL_BY_VISIT_QUERY } from "@/hooks/queries"
import { FINALISE_VISIT_MUTATION } from "@/hooks/mutations/visits"
import Header from "@/components/header"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardMobileUi } from "@/components/dashboard/dashboard-mobile-ui"
import { ConsultationPreviewSheet } from "@/components/dashboard/consultation-preview-sheet"
import PatientHistorySidePane from "@/components/patient-history-side-pane"
import PatientRegistrationModal from "@/components/patient-registration-modal"
import VisitCreationModal from "@/components/visit-creation-modal"
import { AddDepartmentModal } from "@/components/add-department-modal"
import { ProfileSelectDialog } from "@/components/profile-select-dialog"
import { useChangeVisitDepartmentProfile, useConsultVisit } from "@/hooks/visits/department-mutations"
import { useCompleteVisit } from "@/hooks/visits/visit-mutations"
import type { DepartmentProfile } from "@/lib/api-types"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import InlineTryAgain from "@/components/inline-try-again"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  User,
  ReceiptText,
  Plus,
  List,
  LayoutGrid,
  FilePenLine,
  Activity,
  Eye,
  History,
  Loader2,
  Settings,
  SlidersHorizontal,
  Info,
  ChevronDown,
} from "lucide-react"
import { toast } from "react-toastify"
import { hasRole } from "@/lib/role-utils"
import { openInvoicePreview, resolveInvoiceUrl } from "@/lib/invoice-utils"
import { BillingPreviewSheet } from "@/components/billing/billing-preview-sheet"
import { VisitSettingsPanel } from "@/components/manager/visit-settings-panel"
export default function DashboardPage() {
  const router = useRouter()
  const { doctor } = useAuth()
  const { visits, loading, error, refetch: refetchVisits } = useVisits()
  const [isMounted, setIsMounted] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [showMetrics, setShowMetrics] = useState(true)
  const { stats: dashboardStats, loading: dashboardStatsLoading } =
    useDashboardStats(1, {
      skip: !isMounted || !showMetrics,
    })
  const { updateDepartmentStatus } = useUpdateVisitDepartmentStatus()
  const { changeVisitDepartmentProfile } = useChangeVisitDepartmentProfile()
  const { consultVisit } = useConsultVisit()
  const { completeVisit } = useCompleteVisit()
  const { generateInvoice } = useGenerateInvoice()
  const [getVisitBillings] = useLazyQuery(GET_BILL_BY_VISIT_QUERY)
  const [finaliseVisitMutation, { loading: finalisingVisit }] = useMutation(
    FINALISE_VISIT_MUTATION,
    {
      onCompleted: (data) => {
        if (data?.finaliseVisit?.status === "SUCCESS") {
          toast.success("Visit finalised successfully")
          void refetchVisits()
        } else {
          toast.error(data?.finaliseVisit?.message || "Failed to finalise visit")
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to finalise visit")
      },
    },
  )
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewVisitBilling, setPreviewVisitBilling] =
    useState<VisitBilling | null>(null)
  const [previewDepartmentId, setPreviewDepartmentId] = useState<string | null>(
    null,
  )
  const [previewVisit, setPreviewVisit] = useState<Visit | null>(null)
  const [previewStartedAt, setPreviewStartedAt] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [mobileSearchActive, setMobileSearchActive] = useState(false)
  const [showMobileActionSheet, setShowMobileActionSheet] = useState(false)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedViewMode = localStorage.getItem("dashboard_viewMode")
      if (storedViewMode === "list" || storedViewMode === "grid") {
        setViewMode(storedViewMode)
      }
      const storedShowMetrics = localStorage.getItem("dashboard_showMetrics")
      if (storedShowMetrics !== null) {
        setShowMetrics(storedShowMetrics === "true")
      }
      setIsMounted(true)
    }
  }, [])
  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      localStorage.setItem("dashboard_viewMode", viewMode)
    }
  }, [viewMode, isMounted])
  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      localStorage.setItem("dashboard_showMetrics", String(showMetrics))
    }
  }, [showMetrics, isMounted])
  const [printingVisitId, setPrintingVisitId] = useState<string | null>(null)
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null)
  const [navigatingVisitId, setNavigatingVisitId] = useState<string | null>(null)

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
  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles ||
    []) as string[]
  const userDepartments = ((
    doctor as unknown as {
      departments?: Array<{ id: string; name?: string }>
    } | null
  )?.departments || []) as Array<{ id: string; name?: string }>
  const legacyUserDepartment = (
    doctor as unknown as { department?: { id: string; name: string } } | null
  )?.department
  const userDepartmentIds =
    userDepartments.length > 0
      ? userDepartments.map((dept) => String(dept.id || "")).filter(Boolean)
      : legacyUserDepartment?.id
        ? [String(legacyUserDepartment.id)]
        : []
  const hasReceptionistRole =
    roles.includes("RECEPTIONIST") || roles.includes("RECEPTION")
  const hasFinanceRole = roles.includes("FINANCE")
  const hasManagerRole = hasRole(roles, "MANAGER")
  const hasAdminRole = hasRole(roles, "ADMIN")
  const isReceptionistOnly = hasReceptionistRole && roles.length === 1
  const hasNurseRole = roles.includes("NURSE")
  const hasConsultationRole = roles.some((role) =>
    ["DOCTOR", "OPHTHALMOLOGIST", "SPECIALIST", "ADMIN"].includes(role),
  )
  const hasClinicianOrDoctorRole = roles.some((role) =>
    ["CLINICIAN", "DOCTOR"].includes(role),
  )
  const canViewPatientHistory = hasRole(roles, "CLINICIAN")
  const canSeeBillingInfo = hasFinanceRole
  const canSeeConsultButton = !isReceptionistOnly
  // Bill button: Finance role always sees billing, regardless of other roles
  const canSeeBillButton = hasFinanceRole
  // Add Department: only Receptionists can route a patient to a new department
  const canSeeAddDepartment = hasReceptionistRole
  const canSeeRegisterAndCreate = hasReceptionistRole
  const canSeeVisitActionButtons = !isReceptionistOnly
  // Discharge button: visible to FINANCE, MANAGER, and ADMIN when all departments are completed/finalised
  const canSeeDischargeButton = hasFinanceRole || hasManagerRole || hasAdminRole
  // Duration & Department times visibility: Manager and Admin can see all department times,
  // while other users can only see time spent in their own assigned department.
  const canViewAllDeptTimes = hasManagerRole || hasAdminRole
  const isUserDept = (deptId?: string | null) => {
    if (!deptId) return false
    return userDepartmentIds.includes(String(deptId))
  }
  // Modal states
  const [showPatientRegistrationModal, setShowPatientRegistrationModal] =
    useState(false)
  const [showVisitCreationModal, setShowVisitCreationModal] = useState(false)
  const [registeredPatientId, setRegisteredPatientId] = useState<string | null>(
    null,
  )
  const [locallyCreatedVisits, setLocallyCreatedVisits] = useState<Visit[]>([])
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false)
  const [selectedVisitForDepartment, setSelectedVisitForDepartment] =
    useState<Visit | null>(null)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [profileDialogVisit, setProfileDialogVisit] = useState<Visit | null>(null)
  const [profileDialogLoading, setProfileDialogLoading] = useState(false)
  const [profileDialogProfiles, setProfileDialogProfiles] = useState<DepartmentProfile[]>([])
  const [previewConsultationOpen, setPreviewConsultationOpen] = useState(false)
  const [previewConsultationContext, setPreviewConsultationContext] = useState<{
    answerId: string | null
    departmentName: string
    patientName: string
    visitDepartment: Visit["departments"][number] | null
    previewStartedAt: number
  } | null>(null)
  const [patientHistoryOpen, setPatientHistoryOpen] = useState(false)
  const [patientHistoryVisit, setPatientHistoryVisit] = useState<Visit | null>(
    null,
  )
  const [settingsVisit, setSettingsVisit] = useState<Visit | null>(null)
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false)
  const openVisitCreationModal = () => {
    setRegisteredPatientId(null)
    setShowVisitCreationModal(true)
  }
  const closeVisitCreationModal = () => {
    setShowVisitCreationModal(false)
    setRegisteredPatientId(null)
  }
  const hasUnbilledItems = (visit: Visit) => {
    if (visitProductsFullySettled(visit)) return false
    return visitHasUnbilledProducts(visit)
  }
  const hasNoBillables = (visit: Visit) => !visitHasBillableProducts(visit)
  const countUnbilledProducts = countUnbilledVisitProducts
  const countBilledProducts = countBilledVisitProducts
  const getUnbilledProductNames = getUnbilledVisitProductNames
  const getBilledProductNames = getBilledVisitProductNames
  const hasDepartmentReadyForBilling = visitHasDepartmentReadyForBilling
  const formatProductsToBillLabel = (count: number) => {
    if (count === 0) return "No products to bill"
    return count === 1 ? "1 product to bill" : `${count} products to bill`
  }
  const formatProductsBilledLabel = (count: number) => {
    if (count === 0) return "No products billed"
    return count === 1 ? "1 product billed" : `${count} products billed`
  }
  const canPreviewVisitInvoice = (visit: Visit) => {
    const hasDeptEditing = (visit.departments || []).some((d: any) => d.status === "DEPARTMENT_EDITING")
    if (hasDeptEditing) return false
    if (hasNoBillables(visit)) return false
    return countUnbilledProducts(visit) === 0 && countBilledProducts(visit) > 0
  }
  const getBillingDisplayStatus = (visit: Visit) => {
    const hasDeptEditing = (visit.departments || []).some((d: any) => d.status === "DEPARTMENT_EDITING")
    if (hasDeptEditing) return "Editing billing"
    if (hasDepartmentReadyForBilling(visit)) return "Ready for billing"
    const unbilledCount = countUnbilledProducts(visit)
    const billedCount = countBilledProducts(visit)
    const pendingConfirmations = countPendingOperatorConfirmations(visit)
    if (
      visitProductsFullySettled(visit) ||
      (unbilledCount === 0 && billedCount > 0)
    ) {
      if (pendingConfirmations > 0) {
        return `All products billed (${pendingConfirmations} pending confirmation)`
      }
      return "All products billed"
    }

    if (hasNoBillables(visit)) return formatProductsToBillLabel(0)
    if (unbilledCount > 0 && billedCount > 0) {
      const base = `${formatProductsToBillLabel(unbilledCount)} · ${billedCount} billed`
      return pendingConfirmations > 0 ? `${base} (${pendingConfirmations} pending)` : base
    }

    const base = formatProductsToBillLabel(unbilledCount)
    return pendingConfirmations > 0 ? `${base} (${pendingConfirmations} pending)` : base
  }
  const renderBillingTooltipContent = (
    visit: Visit,
    unbilledCount: number,
    unbilledNames: string[],
    billedCount: number,
    billedNames: string[],
    departmentsReady: string[],
  ) => {
    const showAllBilledSummary =
      unbilledCount === 0 && billedCount > 0 && departmentsReady.length === 0
    return (
      <div className="space-y-2 text-xs">
        {departmentsReady.length > 0 && (
          <div>
            <p className="font-medium text-emerald-600 dark:text-emerald-400">
              Ready for billing
            </p>
            <ul className="list-disc pl-4 text-muted-foreground mt-0.5">
              {departmentsReady.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}

        {unbilledCount > 0 && (
          <div>
            <p className="font-medium">
              {formatProductsToBillLabel(unbilledCount)}
            </p>
            <ul className="list-disc pl-4 text-muted-foreground mt-0.5">
              {unbilledNames.map((name, index) => (
                <li key={`unbilled-${name}-${index}`}>{name}</li>
              ))}
            </ul>
          </div>
        )}

        {billedCount > 0 && (
          <div>
            <p className="font-medium text-muted-foreground">
              {showAllBilledSummary
                ? "All products billed"
                : formatProductsBilledLabel(billedCount)}
            </p>
            <ul className="list-disc pl-4 text-muted-foreground mt-0.5">
              {billedNames.map((name, index) => (
                <li key={`billed-${name}-${index}`}>{name}</li>
              ))}
            </ul>
          </div>
        )}

        {unbilledCount === 0 && billedCount === 0 && !hasNoBillables(visit) && (
          <p className="text-muted-foreground">No billable products</p>
        )}

        {hasNoBillables(visit) && (
          <p className="text-muted-foreground">
            {formatProductsToBillLabel(0)}
          </p>
        )}
      </div>
    )
  }
  const hasIncompleteDepartments = (visit: Visit) => {
    return flattenVisitDepartments(visit.departments || []).some(
      (dept) => dept.status !== "COMPLETED",
    )
  }
  const canDischargeVisit = (visit: Visit) => {
    const visitStatus = String(visit.status || "").toUpperCase()
    if (visitStatus === "COMPLETED" || visitStatus === "CANCELLED" || visitStatus === "FINALISED") {
      return false
    }
    const allDepts = flattenVisitDepartments(visit.departments || [])
    if (allDepts.length === 0) return false
    return allDepts.every((dept) => {
      const status = String(dept.status || "").toUpperCase()
      return status === "COMPLETED" || status === "FINALISED"
    })
  }
  const isDischarged = (visit: Visit) =>
    (visit.status === "COMPLETED" || visit.status === "FINALISED") && !hasUnbilledItems(visit)
  const canFinaliseVisit = (visit: Visit) => {
    return getFinaliseBlockers(visit).length === 0
  }

  /** Returns a list of human-readable reasons why a visit cannot be finalised. */
  const getFinaliseBlockers = (visit: Visit): string[] => {
    const blockers: string[] = []
    if (visit.status !== "COMPLETED") return ["Visit is not completed yet"]
    if (!visit.departments || visit.departments.length === 0) {
      blockers.push("No departments assigned")
      return blockers
    }
    const nonCancelledDepts = (visit.departments || []).filter(
      (d) => d.status !== "CANCELLED",
    )
    if (nonCancelledDepts.length === 0) {
      blockers.push("No active departments")
      return blockers
    }
    // Check each department
    for (const dept of nonCancelledDepts) {
      if (dept.status !== "COMPLETED") {
        blockers.push(`${dept.department.name} is not completed (${dept.status})`)
      }
      if (dept.hasBillableProducts) {
        blockers.push(`${dept.department.name} has unbilled products`)
      }
      if (dept.answerId && !dept.hasFinalizedConsultationAnswers) {
        blockers.push(`${dept.department.name} has draft consultation answers`)
      }
    }
    return blockers
  }
  const handleFinaliseVisit = async (visit: Visit) => {
    await finaliseVisitMutation({ variables: { visitId: visit.id } })
  }
  const isVisitDepartmentBillingOrCompleted = (
    visit: Visit,
    departmentStatus: string,
  ) => {
    const normalizedDepartmentStatus = String(
      departmentStatus || "",
    ).toUpperCase()
    return normalizedDepartmentStatus === "FINALISED"
  }
  const getMatchingUserDepartment = (
    visit: Visit,
    options?: { mustBeClosed?: boolean },
  ) => {
    const mustBeClosed = Boolean(options?.mustBeClosed)
    const matchingDepartments = (visit.departments || []).filter((dept) =>
      userDepartmentIds.includes(String(dept.department?.id || dept.id || "")),
    )
    if (matchingDepartments.length === 0) return null
    if (mustBeClosed) {
      return (
        matchingDepartments.find((dept) =>
          isVisitDepartmentBillingOrCompleted(visit, dept.status),
        ) || null
      )
    }

    return (
      matchingDepartments.find((dept) => {
        const normalizedDepartmentStatus = String(
          dept.status || "",
        ).toUpperCase()
        if (
          normalizedDepartmentStatus === "FINALISED" ||
          normalizedDepartmentStatus === "CANCELLED"
        ) {
          return false
        }

        return true
      }) || null
    )
  }
  const canConsultVisit = (visit: Visit) => {
    // Check if user has CLINICIAN or DOCTOR role
    if (!hasClinicianOrDoctorRole) return false
    // Check if user has at least one department assigned
    if (userDepartmentIds.length === 0) return false
    // Check if visit has departments
    if (!visit.departments || visit.departments.length === 0) return false
    // Eligible when any visit department matches a user's department and is not completed/cancelled.
    const matchingDepartment = getMatchingUserDepartment(visit, {
      mustBeClosed: false,
    })
    const match = Boolean(matchingDepartment)

    return match
  }
  const handlePreviewConsultation = (visit: Visit) => {
    const previewStartedAt = Date.now()
    const matchedClosedDepartment =
      (visit.departments || []).find((dept) => {
        const normalizedStatus = String(dept.status || "").toUpperCase()
        return (
          Boolean(dept.answerId) &&
          (normalizedStatus === "COMPLETED" || normalizedStatus === "BILLING")
        )
      }) || getMatchingUserDepartment(visit, { mustBeClosed: true })
    const answerId = matchedClosedDepartment?.answerId
      ? String(matchedClosedDepartment.answerId)
      : null
    const departmentName =
      matchedClosedDepartment?.department?.name || "Department"
    setPreviewConsultationContext({
      answerId,
      departmentName,
      patientName:
        `${visit.patient.firstName} ${visit.patient.lastName}`.trim(),
      visitDepartment: matchedClosedDepartment || null,
      previewStartedAt,
    })
    setPreviewConsultationOpen(true)
  }
  const parseTimestamp = (time?: string | number | null): number | null => {
    if (!time) return null
    if (typeof time === "number") {
      return isNaN(time) ? null : time
    }
    const str = String(time).trim()
    if (!str) return null
    if (/^\d+$/.test(str)) {
      const num = Number(str)
      return isNaN(num) ? null : num
    }
    const parsed = new Date(str).getTime()
    return isNaN(parsed) ? null : parsed
  }
  const formatDepartmentTime = (
    time?: string | number | null,
    fallbackTime?: string | number | null,
  ) => {
    const ts = parseTimestamp(time) || parseTimestamp(fallbackTime)
    if (!ts) return "-"
    return new Date(ts).toLocaleString()
  }
  const getTriageDuration = (visit: Visit) => {
    const startedAt = parseTimestamp(visit.visitDate)
    if (!startedAt) return "Triage"
    const elapsedMs = Math.max(Date.now() - startedAt, 0)
    const totalMinutes = Math.floor(elapsedMs / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours <= 0) {
      return `Triage • ${minutes}m`
    }

    return `Triage • ${hours}h ${minutes}m`
  }
  const formatDepartmentDuration = (
    startTime?: string | number | null,
    endTime?: string | number | null,
    fallbackStartTime?: string | number | null,
  ) => {
    const start = parseTimestamp(startTime) || parseTimestamp(fallbackStartTime)
    if (!start) return "-"
    const end = parseTimestamp(endTime) || Date.now()
    const diffMs = Math.max(end - start, 0)
    const totalMinutes = Math.floor(diffMs / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours <= 0) {
      return `${minutes}m`
    }
    return `${hours}h ${minutes}m`
  }
  const getVisitActiveDepartmentInfo = (visit: Visit) => {
    const allDepts = flattenVisitDepartments(visit.departments || [])
    if (allDepts.length === 0) {
      return {
        activeDept: null,
        displayName: "Triage / Check-in",
        status: "IN_PROGRESS",
        isTriage: true,
        duration: formatDepartmentDuration(visit.visitDate),
        allDepts: [],
      }
    }

    // 1. First look for active / in-progress / editing / billing / on-hold department
    const activeDept = allDepts.find((dept) => {
      const s = String(dept.status || "").toUpperCase()
      return (
        s === "ACTIVE" ||
        s === "IN_PROGRESS" ||
        s === "DEPARTMENT_EDITING" ||
        s === "BILLING" ||
        s === "ON_HOLD"
      )
    })
    if (activeDept) {
      return {
        activeDept,
        displayName: activeDept.department?.name || "Active Department",
        status: activeDept.status || "ACTIVE",
        isTriage: false,
        duration: formatDepartmentDuration(
          activeDept.createdAt,
          null,
          visit.visitDate,
        ),
        allDepts,
      }
    }

    // 2. Look for first pending department
    const pendingDept = allDepts.find((dept) => {
      const s = String(dept.status || "").toUpperCase()
      return s === "PENDING"
    })
    if (pendingDept) {
      return {
        activeDept: pendingDept,
        displayName: pendingDept.department?.name || "Pending Department",
        status: "PENDING",
        isTriage: false,
        duration: null,
        allDepts,
      }
    }

    // 3. If all completed / finalised / cancelled
    const lastDept = allDepts[allDepts.length - 1]
    const allCompleted = allDepts.every((dept) => {
      const s = String(dept.status || "").toUpperCase()
      return s === "COMPLETED" || s === "FINALISED"
    })

    return {
      activeDept: lastDept,
      displayName: lastDept?.department?.name || "Completed",
      status: allCompleted ? "COMPLETED" : (lastDept?.status || "COMPLETED"),
      isTriage: false,
      duration: lastDept
        ? formatDepartmentDuration(
            lastDept.createdAt,
            lastDept.completedAt,
            visit.visitDate,
          )
        : null,
      allDepts,
    }
  }
  const filterCounts = useMemo(() => {
    const serverVisitIds = new Set(visits.map((visit) => visit.id))
    const baseList = [
      ...locallyCreatedVisits.filter((visit) => !serverVisitIds.has(visit.id)),
      ...visits,
    ]
    let searchedList = baseList
    if (searchQuery) {
      searchedList = searchedList.filter((visit) =>
        `${visit.patient.firstName} ${visit.patient.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    }

    return {
      all: searchedList.length,
      IN_PROGRESS: searchedList.filter((v) => v.status === "CREATED" || v.status === "IN_PROGRESS" || (v.status as string) === "BILLING" || hasUnbilledItems(v)).length,
      COMPLETED: searchedList.filter((v) => v.status === "COMPLETED" || v.status === "FINALISED").length,
    }
  }, [visits, locallyCreatedVisits, searchQuery])

  const allVisits = useMemo(() => {
    const serverVisitIds = new Set(visits.map((visit) => visit.id))
    let filtered = [
      ...locallyCreatedVisits.filter((visit) => !serverVisitIds.has(visit.id)),
      ...visits,
    ]
    if (searchQuery) {
      filtered = filtered.filter((visit) =>
        `${visit.patient.firstName} ${visit.patient.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter === "IN_PROGRESS") {
      filtered = filtered.filter((visit) => visit.status === "CREATED" || visit.status === "IN_PROGRESS" || (visit.status as string) === "BILLING" || hasUnbilledItems(visit))
    } else if (statusFilter === "COMPLETED") {
      filtered = filtered.filter((visit) => visit.status === "COMPLETED" || visit.status === "FINALISED")
    } else if (statusFilter !== "all") {
      filtered = filtered.filter((visit) => visit.status === statusFilter)
    }

    return filtered
  }, [visits, locallyCreatedVisits, searchQuery, statusFilter])
  const handleConsultVisit = async (visit: Visit) => {
    // Check if the matching department has profiles
    const matchingDept = visit.departments?.find((d) => {
      const deptId = String(d?.department?.id || d?.id || "")
      const isDepartmentOpen = d?.status !== "FINALISED" && d?.status !== "CANCELLED"
      return deptId && userDepartmentIds.includes(deptId) && isDepartmentOpen
    }) || visit.departments?.find((d) => {
      const deptId = String(d?.department?.id || d?.id || "")
      return deptId && userDepartmentIds.includes(deptId)
    })
    const profiles = matchingDept?.department?.profiles || []
    // Only show profile selection when the department has profiles available
    // AND the department does not already have a profile assigned or an answer.
    // If a profile is already set, skip straight to consultation.
    const alreadyHasProfile = Boolean(matchingDept?.profile?.id || matchingDept?.answerId || matchingDept?.status === "COMPLETED")
    if (profiles.length > 0 && !alreadyHasProfile) {
      // Show profile selection dialog
      setNavigatingVisitId(null)
      setProfileDialogVisit(visit)
      setProfileDialogProfiles(profiles)
      setProfileDialogOpen(true)
    } else {
      // Direct consultation or continue: call consultVisit mutation to mark ACTIVE & add processor
      if (matchingDept?.id) {
        try {
          const res = await consultVisit(matchingDept.id)
          if (res?.status !== "SUCCESS") {
            toast.error(res?.message || "Failed to start consultation")
            setNavigatingVisitId(null)
            return
          }
        } catch (err: any) {
          console.error("Failed to start consultation:", err)
          toast.error(err?.message || "Failed to start consultation")
          setNavigatingVisitId(null)
          return
        }
      }
      router.push(`/consultation?visitId=${visit.id}${matchingDept?.id ? `&visitDepartmentId=${matchingDept.id}` : ""}`)
    }
  }
  const handleProfileSelected = async (profile: DepartmentProfile) => {
    const visit = profileDialogVisit
    if (!visit) return
    setProfileDialogLoading(true)
    let matchingDeptId: string | undefined
    try {
      const matchingDept = visit.departments?.find((d) => {
        const deptId = String(d?.department?.id || d?.id || "")
        const isDepartmentOpen = d?.status !== "FINALISED" && d?.status !== "CANCELLED"
        return deptId && userDepartmentIds.includes(deptId) && isDepartmentOpen
      })
      matchingDeptId = matchingDept?.id
      if (matchingDept) {
        // Single unified consultVisit mutation: applies profile, sets ACTIVE on 1st time, adds processor
        const res = await consultVisit(matchingDept.id, profile.id)
        if (res?.status !== "SUCCESS") {
          toast.error(res?.message || "Failed to start consultation")
          setProfileDialogLoading(false)
          return
        }
      }
      refetchVisits()
    } catch (err: any) {
      console.error("Failed to apply profile and start consultation:", err)
      toast.error(err?.message || "Failed to apply profile and start consultation")
      setProfileDialogLoading(false)
      return
    }
    setProfileDialogLoading(false)
    setProfileDialogOpen(false)
    setProfileDialogVisit(null)
    setProfileDialogProfiles([])
    router.push(`/consultation?visitId=${visit.id}${matchingDeptId ? `&visitDepartmentId=${matchingDeptId}` : ""}`)
  }
  const handleTriageVisit = (visit: Visit) => {
    router.push(`/triage?visitId=${visit.id}`)
  }
  const canAddDepartment = (visit: Visit) => {
    return (
      visit.status !== "COMPLETED" &&
      visit.status !== "CANCELLED"
    )
  }
  const handleAddDepartment = (visit: Visit) => {
    setSelectedVisitForDepartment(visit)
    setAddDepartmentModalOpen(true)
  }
  const handleAddDepartmentSuccess = () => {
    // Refresh visits data after successful department addition
    refetchVisits()
  }
  const handleGoToBilling = (visit: Visit) => {
    router.push(`/billing?visitId=${visit.id}&patientId=${visit.patient.id}`)
  }
  const handleDownloadInvoice = async (
    departmentInsuranceBillingId: string,
  ) => {
    setDownloadingInvoiceId(departmentInsuranceBillingId)
    try {
      const invoiceUrl = await resolveInvoiceUrl(
        departmentInsuranceBillingId,
        generateInvoice,
      )
      openInvoicePreview(invoiceUrl)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate invoice"
      toast.error(message)
    } finally {
      setDownloadingInvoiceId(null)
    }
  }
  const handlePreviewInvoice = async (visit: Visit) => {
    try {
      setPrintingVisitId(visit.id)
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
      setPreviewStartedAt(Date.now())
      setPreviewOpen(true)
    } catch (err: unknown) {
      console.error("Preview invoice error:", err)
      const message =
        err instanceof Error ? err.message : "Failed to load bill for preview"
      toast.error(message)
    } finally {
      setPrintingVisitId(null)
    }
  }
  const handleEditConsultation = (visit: Visit) => {
    const matchingDept = (visit.departments || []).find((d) => {
      const deptId = String(d?.department?.id || d?.id || "")
      return deptId && userDepartmentIds.includes(deptId)
    }) || visit.departments?.[0]
    router.push(`/consultation?visitId=${visit.id}${matchingDept?.id ? `&visitDepartmentId=${matchingDept.id}` : ""}`)
  }
  const handleOpenSettings = (visit: Visit) => {
    setSettingsVisit(visit)
    setSettingsPanelOpen(true)
  }
  const handleManagerPreviewConsultation = (visit: Visit) => {
    // Find any completed department with an answerId for preview
    const completedDept = (visit.departments || []).find((dept) => {
      const normalizedStatus = String(dept.status || "").toUpperCase()
      return (
        Boolean(dept.answerId) &&
        (normalizedStatus === "COMPLETED" || normalizedStatus === "FINALISED")
      )
    })
    const answerId = completedDept?.answerId ? String(completedDept.answerId) : null
    const departmentName = completedDept?.department?.name || "Department"
    setPreviewConsultationContext({
      answerId,
      departmentName,
      patientName: `${visit.patient.firstName} ${visit.patient.lastName}`.trim(),
      visitDepartment: completedDept || null,
      previewStartedAt: Date.now(),
    })
    setPreviewConsultationOpen(true)
  }
  const handleViewPatientHistory = (visit: Visit) => {
    setPatientHistoryVisit(visit)
    setPatientHistoryOpen(true)
  }
  const [dischargeConfirmVisit, setDischargeConfirmVisit] = useState<Visit | null>(null)
  // In-flight discharge — keeps the confirm dialog open with a spinner so the
  // department-status completion loop can't be triggered twice.
  const [discharging, setDischarging] = useState(false)

  const handleDischargeVisit = async (visit: Visit) => {
    if (discharging) return
    setDischarging(true)
    try {
      const res = await completeVisit(visit.id)
      if (res?.status === "SUCCESS") {
        toast.success("Patient discharged successfully")
        await refetchVisits()
      } else {
        toast.error(res?.message || "Failed to discharge patient")
      }
    } catch (err: any) {
      console.error("Discharge visit error:", err)
      toast.error(err?.message || "Failed to discharge patient")
    } finally {
      setDischarging(false)
      setDischargeConfirmVisit(null)
    }
  }
  const handlePatientRegistered = (
    patientId: string,
    _insurances: any[],
    proceedToVisit: boolean,
    createdVisit?: Visit,
  ) => {
    setShowPatientRegistrationModal(false)
    if (createdVisit) {
      setRegisteredPatientId(null)
      setShowVisitCreationModal(false)
      setLocallyCreatedVisits((current) => [
        createdVisit,
        ...current.filter((visit) => visit.id !== createdVisit.id),
      ])
      refetchVisits()
      return
    }

    if (proceedToVisit) {
      setRegisteredPatientId(patientId)
      setShowVisitCreationModal(true)
    }
  }
  const handleVisitCreated = () => {
    // Refetch visits data without full page reload
    refetchVisits()
  }
  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <DashboardHeader
              showMetrics={showMetrics}
              onToggleMetrics={() => setShowMetrics(!showMetrics)}
              canSeeRegisterAndCreate={canSeeRegisterAndCreate}
              onRegisterNewPatient={() => setShowPatientRegistrationModal(true)}
              onCreateVisit={openVisitCreationModal}
            />

            <DashboardStats
              showMetrics={showMetrics}
              loading={dashboardStatsLoading}
              totalOpen={dashboardStats?.totalOpen ?? 0}
              totalCompleted={dashboardStats?.totalCompleted ?? 0}
              totalWaitingForBilling={
                dashboardStats?.totalWaitingForBilling ?? 0
              }
            />

            <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-lg overflow-hidden">
              {/* Status filters */}
              <div className="p-6 border-b border-border/30">
                {/* Desktop filters - visible on md and up */}
                <div className="hidden md:flex gap-2 flex-wrap justify-center items-center">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      statusFilter === "all"
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted/70 hover:scale-105"
                    }`}
                  >
                    <span>All Visits</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        statusFilter === "all"
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted-foreground/15 text-muted-foreground"
                      }`}
                    >
                      {filterCounts.all}
                    </span>
                  </button>
                  <button
                    onClick={() => setStatusFilter("IN_PROGRESS")}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      statusFilter === "IN_PROGRESS"
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted/70 hover:scale-105"
                    }`}
                  >
                    <span>In Progress</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        statusFilter === "IN_PROGRESS"
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted-foreground/15 text-muted-foreground"
                      }`}
                    >
                      {filterCounts.IN_PROGRESS}
                    </span>
                  </button>
                  <button
                    onClick={() => setStatusFilter("COMPLETED")}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      statusFilter === "COMPLETED"
                        ? "bg-emerald-600 text-white shadow-md scale-105"
                        : "bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted/70 hover:scale-105"
                    }`}
                  >
                    <span>Completed</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        statusFilter === "COMPLETED"
                          ? "bg-white/25 text-white"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {filterCounts.COMPLETED}
                    </span>
                  </button>
                </div>

                {/* Mobile filter, layout switch, and search controls */}
                <div className="md:hidden">
                  {!mobileSearchActive ? (
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-full bg-primary text-primary-foreground border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium appearance-none cursor-pointer text-sm"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 0.75rem center",
                            paddingRight: "2rem",
                          }}
                        >
                          <option value="all">All Visits ({filterCounts.all})</option>
                          <option value="IN_PROGRESS">In Progress ({filterCounts.IN_PROGRESS})</option>
                          <option value="COMPLETED">Completed ({filterCounts.COMPLETED})</option>
                        </select>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="rounded-full h-10 w-10 flex-shrink-0"
                        onClick={() =>
                          setViewMode((prev) =>
                            prev === "list" ? "grid" : "list",
                          )
                        }
                        title={
                          viewMode === "list"
                            ? "Switch to grid view"
                            : "Switch to list view"
                        }
                        aria-label={
                          viewMode === "list"
                            ? "Switch to grid view"
                            : "Switch to list view"
                        }
                      >
                        {viewMode === "list" ? (
                          <LayoutGrid className="w-4 h-4" />
                        ) : (
                          <List className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="rounded-full h-10 w-10 flex-shrink-0"
                        onClick={() => setMobileSearchActive(true)}
                        title="Search"
                        aria-label="Search"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Visits list */}
              <div
                className={`p-6 ${mobileSearchActive ? "hidden md:block" : ""}`}
              >
                {/* Search bar - Desktop and expanded mobile */}
                {!mobileSearchActive ? (
                  <div className="hidden md:flex mb-4 gap-3 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-3 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search by patient name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-full text-foreground dark:text-slate-100 placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 shadow-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="rounded-full"
                      onClick={() =>
                        setViewMode((prev) =>
                          prev === "list" ? "grid" : "list",
                        )
                      }
                      title={
                        viewMode === "list"
                          ? "Switch to grid view"
                          : "Switch to list view"
                      }
                      aria-label={
                        viewMode === "list"
                          ? "Switch to grid view"
                          : "Switch to list view"
                      }
                    >
                      {viewMode === "list" ? (
                        <LayoutGrid className="w-4 h-4" />
                      ) : (
                        <List className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ) : null}

                {/* Visits / Patients view */}
                <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
                        : "space-y-2"
                    }
                  >
                    {loading ? (
                      viewMode === "grid" ? (
                        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                          {[...Array(6)].map((_, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-2xl h-full"
                            >
                              <div className="h-full flex flex-col justify-between gap-4">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                                    <div className="min-w-0 flex-1 space-y-2">
                                      <Skeleton className="h-4 w-3/5 max-w-40" />
                                      <Skeleton className="h-3 w-1/2 max-w-28" />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Skeleton className="h-3 w-full max-w-52" />
                                    <Skeleton className="h-3 w-2/3 max-w-40" />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                  <Skeleton className="h-8 w-24 rounded-full" />
                                  <Skeleton className="h-8 w-20 rounded-full" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {[...Array(5)].map((_, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-2xl"
                            >
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                                  <div className="min-w-0 flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/5 max-w-64" />
                                    <Skeleton className="h-3 w-2/5 max-w-40" />
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Skeleton className="h-8 w-24 rounded-full" />
                                  <Skeleton className="h-8 w-24 rounded-full" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    ) : error ? (
                      <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                        <InlineTryAgain
                          onTryAgain={() => {
                            void refetchVisits()
                          }}
                        />
                      </div>
                    ) : allVisits.length === 0 ? (
                      <div
                        className={`text-center py-8 ${viewMode === "grid" ? "col-span-full" : ""}`}
                      >
                        <User className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-muted-foreground">No visits found</p>
                      </div>
                    ) : (
                      allVisits.map((visit: Visit) => {
                        const unbilledProductCount =
                          countUnbilledProducts(visit)
                        const unbilledProductNames =
                          getUnbilledProductNames(visit)
                        const billedProductCount = countBilledProducts(visit)
                        const billedProductNames = getBilledProductNames(visit)
                        const departmentsReadyForBilling =
                          getDepartmentsReadyForBilling(visit)
                        const totalNewNotes = (visit.departments || []).reduce(
                          (sum, dept) => sum + (dept.notes?.newNotes || 0),
                          0,
                        )
                        return (
                          <div
                            key={visit.id}
                            className={`p-4 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-2xl hover:bg-card/90 dark:hover:bg-slate-900/90 hover:shadow-md transition-all duration-200 ${viewMode === "grid" ? "h-full" : ""}`}
                          >
                            <div
                              className={
                                viewMode === "grid"
                                  ? "h-full flex flex-col justify-between gap-4"
                                  : "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-3"
                              }
                            >
                              <div
                                className={
                                  viewMode === "grid"
                                    ? "space-y-2"
                                    : "flex items-center gap-3 flex-1"
                                }
                              >
                                <div
                                  className={
                                    viewMode === "grid"
                                      ? "flex items-center gap-2"
                                      : "contents"
                                  }
                                >
                                  {visit.status === "CREATED" && (
                                    <AlertCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                                  )}
                                  {visit.status === "IN_PROGRESS" && (
                                    <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                                  )}
                                  {visit.status === "COMPLETED" && (
                                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                  )}
                                  {visit.status === "FINALISED" && (
                                    <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                                  )}
                                  {visit.status === "CANCELLED" && (
                                    <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                  )}
                                  {totalNewNotes > 0 && (
                                    <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                                      {totalNewNotes}
                                    </span>
                                  )}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <h3 className="font-medium text-foreground truncate cursor-help">
                                        {visit.patient.firstName}{" "}
                                        {visit.patient.lastName}
                                      </h3>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-sm">
                                      <div className="space-y-2 text-xs">
                                        {visit.patient.patientIdentifier && (
                                          <p className="font-mono text-[11px] text-muted-foreground">
                                            ID:{" "}
                                            {visit.patient.patientIdentifier}
                                          </p>
                                        )}
                                        <p className="font-semibold">
                                          Departments history
                                        </p>
                                        {(visit.departments || []).length ===
                                        0 ? (
                                          <p className="text-muted-foreground">
                                            Current service:{" "}
                                            {getTriageDuration(visit)}
                                          </p>
                                        ) : (
                                          (visit.departments || []).map(
                                            (dept) => (
                                              <div
                                                key={dept.id}
                                                className="border-b border-border/30 pb-2 last:border-b-0 last:pb-0"
                                              >
                                                <p className="font-medium">
                                                  {dept.department?.name ||
                                                    "Unknown Department"}
                                                </p>
                                                <p>
                                                  Status: {dept.status || "-"}
                                                  {getVisitDepartmentBillingStatus(dept) && (
                                                    <span className="ml-1.5 text-xs text-muted-foreground">
                                                      ({getVisitDepartmentBillingStatus(dept)})
                                                    </span>
                                                  )}
                                                </p>
                                                {(canViewAllDeptTimes ||
                                                  isUserDept(
                                                    dept.department?.id,
                                                  ) ||
                                                  isUserDept(dept.id)) && (
                                                  <>
                                                    <p>
                                                      Checked in:{" "}
                                                      {formatDepartmentTime(
                                                        dept.createdAt,
                                                        visit.visitDate,
                                                      )}
                                                    </p>
                                                    {dept.completedAt && (
                                                      <p>
                                                        Completed:{" "}
                                                        {formatDepartmentTime(
                                                          dept.completedAt,
                                                        )}
                                                      </p>
                                                    )}
                                                  </>
                                                )}
                                                {dept.notes &&
                                                  dept.notes.newNotes > 0 && (
                                                    <p className="text-red-500 font-semibold">
                                                      {dept.notes.newNotes} new
                                                      note(s)
                                                    </p>
                                                  )}
                                              </div>
                                            ),
                                          )
                                        )}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm text-muted-foreground truncate">
                                    {new Date(
                                      visit.visitDate,
                                    ).toLocaleDateString()}
                                  </p>
                                  {canSeeBillingInfo && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <p className={`text-xs truncate cursor-help ${
                                          (visit.departments || []).some((d: any) => d.status === "DEPARTMENT_EDITING")
                                            ? "text-amber-600 dark:text-amber-400 font-medium"
                                            : "text-muted-foreground"
                                        }`}>
                                          Billing:{" "}
                                          {getBillingDisplayStatus(visit)}
                                        </p>
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-xs">
                                        {renderBillingTooltipContent(
                                          visit,
                                          unbilledProductCount,
                                          unbilledProductNames,
                                          billedProductCount,
                                          billedProductNames,
                                          departmentsReadyForBilling,
                                        )}
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  {(() => {
                                    const activeDeptInfo =
                                      getVisitActiveDepartmentInfo(visit)
                                    const isPillActive =
                                      activeDeptInfo.status === "ACTIVE" ||
                                      activeDeptInfo.status === "IN_PROGRESS" ||
                                      activeDeptInfo.status ===
                                        "DEPARTMENT_EDITING" ||
                                      activeDeptInfo.status === "BILLING"
                                    const isPillPending =
                                      activeDeptInfo.status === "PENDING"
                                    const isPillCompleted =
                                      activeDeptInfo.status === "COMPLETED" ||
                                      activeDeptInfo.status === "FINALISED"
                                    const isPillCancelled =
                                      activeDeptInfo.status === "CANCELLED"
                                    const isUserActiveDept =
                                      activeDeptInfo.activeDept &&
                                      (isUserDept(
                                        activeDeptInfo.activeDept.department
                                          ?.id,
                                      ) ||
                                        isUserDept(
                                          activeDeptInfo.activeDept.id,
                                        ))
                                    const canSeeActivePillDuration =
                                      canViewAllDeptTimes ||
                                      Boolean(isUserActiveDept)
                                    const canSeeTriageTimes =
                                      canViewAllDeptTimes ||
                                      hasNurseRole ||
                                      hasReceptionistRole

                                    return (
                                      <div className="mt-1.5 flex items-center">
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <button
                                              type="button"
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/15 hover:bg-secondary/25 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-foreground border border-border/60 hover:border-border transition-all shadow-2xs cursor-pointer select-none"
                                              title="Click to view department timeline & details"
                                              aria-label={`View department timeline for ${visit.patient.firstName} ${visit.patient.lastName}`}
                                            >
                                              <span className="relative flex h-2 w-2 flex-shrink-0">
                                                {isPillActive ? (
                                                  <>
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                  </>
                                                ) : isPillPending ? (
                                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                                ) : isPillCancelled ? (
                                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                                ) : (
                                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                                                )}
                                              </span>
                                              <span className="font-semibold truncate max-w-[130px] sm:max-w-[170px]">
                                                {activeDeptInfo.displayName}
                                              </span>
                                              {isPillActive &&
                                                activeDeptInfo.duration &&
                                                canSeeActivePillDuration && (
                                                  <span className="text-[10px] text-muted-foreground font-normal">
                                                    • {activeDeptInfo.duration}
                                                  </span>
                                                )}
                                              {isPillPending && (
                                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                                  (Pending)
                                                </span>
                                              )}
                                              {activeDeptInfo.allDepts.length >
                                                1 && (
                                                <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.2 rounded-full">
                                                  {
                                                    activeDeptInfo.allDepts
                                                      .length
                                                  }
                                                </span>
                                              )}
                                              <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors ml-0.5 flex-shrink-0" />
                                            </button>
                                          </PopoverTrigger>
                                          <PopoverContent
                                            align="start"
                                            sideOffset={6}
                                            className="w-80 sm:w-96 p-4 shadow-xl max-h-[80vh] overflow-y-auto z-50"
                                          >
                                            <div className="space-y-3">
                                              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                                                <h4 className="font-semibold text-xs text-foreground">
                                                  Visit Departments
                                                </h4>
                                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                  {
                                                    activeDeptInfo.allDepts
                                                      .length
                                                  }{" "}
                                                  department
                                                  {activeDeptInfo.allDepts
                                                    .length === 1
                                                    ? ""
                                                    : "s"}
                                                </span>
                                              </div>

                                              {activeDeptInfo.allDepts
                                                .length === 0 ? (
                                                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/40">
                                                  <div className="mt-0.5 h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                                    <Clock className="w-3.5 h-3.5" />
                                                  </div>
                                                  <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                      <span className="font-semibold text-xs text-foreground">
                                                        Triage / Check-in
                                                      </span>
                                                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                                        In Progress
                                                      </span>
                                                    </div>
                                                    {canSeeTriageTimes && (
                                                      <>
                                                        <p className="text-[11px] text-muted-foreground">
                                                          Checked in:{" "}
                                                          {formatDepartmentTime(
                                                            visit.visitDate,
                                                          )}
                                                        </p>
                                                        <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                                                          Time in triage:{" "}
                                                          {formatDepartmentDuration(
                                                            visit.visitDate,
                                                          )}
                                                        </p>
                                                      </>
                                                    )}
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
                                                  {activeDeptInfo.allDepts.map(
                                                    (dept, idx) => {
                                                      const status = String(
                                                        dept.status || "",
                                                      ).toUpperCase()
                                                      const isPending =
                                                        status === "PENDING"
                                                      const isCompleted =
                                                        status ===
                                                          "COMPLETED" ||
                                                        status === "FINALISED"
                                                      const isCancelled =
                                                        status === "CANCELLED"
                                                      const isActive =
                                                        !isPending &&
                                                        !isCompleted &&
                                                        !isCancelled
                                                      const isThisUserDept =
                                                        isUserDept(
                                                          dept.department?.id,
                                                        ) ||
                                                        isUserDept(dept.id)
                                                      const canSeeThisDeptTimes =
                                                        canViewAllDeptTimes ||
                                                        Boolean(isThisUserDept)

                                                      return (
                                                        <div
                                                          key={dept.id || idx}
                                                          className="relative group"
                                                        >
                                                          {/* Timeline indicator node */}
                                                          <div
                                                            className={`absolute -left-4 top-2 h-3 w-3 rounded-full border-2 border-background ${
                                                              isActive
                                                                ? "bg-blue-500 ring-2 ring-blue-500/30"
                                                                : isCompleted
                                                                  ? "bg-emerald-500"
                                                                  : isCancelled
                                                                    ? "bg-rose-500"
                                                                    : "bg-amber-400"
                                                            }`}
                                                          />
                                                          <div
                                                            className={`p-3 rounded-xl border transition-colors ${
                                                              isActive
                                                                ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-800/40"
                                                                : isCompleted
                                                                  ? "bg-emerald-50/30 dark:bg-emerald-950/10 border-border/40"
                                                                  : isCancelled
                                                                    ? "bg-rose-50/30 dark:bg-rose-950/10 border-border/40"
                                                                    : "bg-muted/30 border-border/40"
                                                            }`}
                                                          >
                                                            <div className="flex items-center justify-between gap-2">
                                                              <span className="font-semibold text-xs text-foreground truncate">
                                                                {dept.department
                                                                  ?.name ||
                                                                  "Unknown Department"}
                                                              </span>
                                                              <span
                                                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                                  isActive
                                                                    ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                                                                    : isCompleted
                                                                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                                                                      : isCancelled
                                                                        ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20"
                                                                        : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                                                                }`}
                                                              >
                                                                {isPending
                                                                  ? "Pending / Not started"
                                                                  : isCompleted
                                                                    ? "Completed"
                                                                    : isCancelled
                                                                      ? "Cancelled"
                                                                      : "In Progress"}
                                                              </span>
                                                            </div>

                                                            {canSeeThisDeptTimes && (
                                                              <div className="mt-1.5 space-y-0.5 text-[11px] text-muted-foreground">
                                                                <div className="flex items-center justify-between">
                                                                  <span>
                                                                    Created:
                                                                  </span>
                                                                  <span className="font-mono text-[10px]">
                                                                    {formatDepartmentTime(
                                                                      dept.createdAt,
                                                                      visit.visitDate,
                                                                    )}
                                                                  </span>
                                                                </div>

                                                                {isCompleted &&
                                                                  dept.completedAt && (
                                                                    <div className="flex items-center justify-between">
                                                                      <span>
                                                                        Completed:
                                                                      </span>
                                                                      <span className="font-mono text-[10px]">
                                                                        {formatDepartmentTime(
                                                                          dept.completedAt,
                                                                        )}
                                                                      </span>
                                                                    </div>
                                                                  )}

                                                                {isActive && (
                                                                  <div className="flex items-center justify-between font-medium text-blue-600 dark:text-blue-400">
                                                                    <span>
                                                                      Time in
                                                                      department:
                                                                    </span>
                                                                    <span>
                                                                      {formatDepartmentDuration(
                                                                        dept.createdAt,
                                                                        null,
                                                                        visit.visitDate,
                                                                      )}
                                                                    </span>
                                                                  </div>
                                                                )}

                                                                {isCompleted && (
                                                                  <div className="flex items-center justify-between font-medium text-emerald-600 dark:text-emerald-400">
                                                                    <span>
                                                                      Total
                                                                      duration:
                                                                    </span>
                                                                    <span>
                                                                      {formatDepartmentDuration(
                                                                        dept.createdAt,
                                                                        dept.completedAt,
                                                                        visit.visitDate,
                                                                      )}
                                                                    </span>
                                                                  </div>
                                                                )}

                                                                {isPending && (
                                                                  <div className="text-amber-600 dark:text-amber-400 font-medium pt-0.5">
                                                                    Status:
                                                                    Pending (Not
                                                                    yet started)
                                                                  </div>
                                                                )}
                                                              </div>
                                                            )}

                                                            {!canSeeThisDeptTimes &&
                                                              isPending && (
                                                                <div className="mt-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                                                                  Status:
                                                                  Pending (Not
                                                                  yet started)
                                                                </div>
                                                              )}

                                                            {dept.notes &&
                                                              dept.notes
                                                                .newNotes >
                                                                0 && (
                                                                <div className="mt-1.5 pt-1.5 border-t border-border/30 text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                                                                  {
                                                                    dept.notes
                                                                      .newNotes
                                                                  }{" "}
                                                                  new note(s)
                                                                </div>
                                                              )}
                                                          </div>
                                                        </div>
                                                      )
                                                    },
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                    )
                                  })()}
                                </div>
                              </div>
                              <div
                                className={`flex items-center gap-2 flex-wrap ${viewMode === "grid" ? "justify-start" : "justify-end lg:justify-start lg:flex-nowrap"}`}
                              >
                                {(() => {
                                  const matchedClosedDepartment =
                                    getMatchingUserDepartment(visit, {
                                      mustBeClosed: true,
                                    })
                                  const showClosedConsultationActions = Boolean(
                                    canSeeVisitActionButtons &&
                                    canSeeConsultButton &&
                                    hasClinicianOrDoctorRole &&
                                    matchedClosedDepartment,
                                  )
                                  const matchingActiveDept =
                                    getMatchingUserDepartment(visit, {
                                      mustBeClosed: false,
                                    }) ||
                                    (visit.departments || []).find((d) => {
                                      const deptId = String(
                                        d?.department?.id || d?.id || "",
                                      )
                                      return (
                                        deptId &&
                                        userDepartmentIds.includes(deptId)
                                      )
                                    })
                                  const hasExistingAnswer = Boolean(
                                    matchingActiveDept?.answerId ||
                                      matchingActiveDept?.hasFinalizedConsultationAnswers,
                                  )
                                  const isEligibleForContinue = Boolean(
                                    matchingActiveDept &&
                                      matchingActiveDept.status !==
                                        "FINALISED" &&
                                      matchingActiveDept.status !== "CANCELLED",
                                  )
                                  const consultButtonLabel =
                                    hasExistingAnswer && isEligibleForContinue
                                      ? "Continue"
                                      : "Start Consult"
                                  return (
                                    <>
                                      {canViewPatientHistory && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                handleViewPatientHistory(visit)
                                              }}
                                              title="View Patient History"
                                              aria-label="View Patient History"
                                              className="h-9 w-9 sm:h-10 sm:w-10 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                            >
                                              <History className="w-4 h-4 flex-shrink-0" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>View Patient History</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      )}

                                      {!showClosedConsultationActions &&
                                        canSeeVisitActionButtons &&
                                        canSeeConsultButton &&
                                        canConsultVisit(visit) && (
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  setNavigatingVisitId(visit.id)
                                                  handleConsultVisit(visit)
                                                }}
                                                title={consultButtonLabel}
                                                aria-label={consultButtonLabel}
                                                disabled={navigatingVisitId === visit.id}
                                                className="h-9 w-9 sm:h-10 sm:w-10 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                              >
                                                {navigatingVisitId === visit.id ? (
                                                  <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
                                                ) : (
                                                  <Stethoscope className="w-4 h-4 flex-shrink-0" />
                                                )}
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>{consultButtonLabel}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        )}

                                      {showClosedConsultationActions && (
                                        <>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  handleEditConsultation(visit)
                                                }}
                                                title="Edit Consultation"
                                                aria-label="Edit Consultation"
                                                className="h-9 w-9 sm:h-10 sm:w-10 bg-slate-700 hover:bg-slate-800 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                              >
                                                <FilePenLine className="w-4 h-4 flex-shrink-0" />
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Edit Consultation</p>
                                            </TooltipContent>
                                          </Tooltip>

                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  handlePreviewConsultation(
                                                    visit,
                                                  )
                                                }}
                                                title="Preview Consultation"
                                                aria-label="Preview Consultation"
                                                className="h-9 w-9 sm:h-10 sm:w-10 bg-slate-500 hover:bg-slate-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                              >
                                                <Eye className="w-4 h-4 flex-shrink-0" />
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Preview Consultation</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </>
                                      )}
                                    </>
                                  )
                                })()}

                                {canSeeVisitActionButtons &&
                                  hasNurseRole &&
                                  (visit.status === "CREATED" ||
                                    visit.status === "IN_PROGRESS") && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setNavigatingVisitId(visit.id)
                                            handleTriageVisit(visit)
                                          }}
                                          title="Open Triage"
                                          aria-label="Open Triage"
                                          disabled={navigatingVisitId === visit.id}
                                          className="h-9 w-9 sm:h-10 sm:w-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                        >
                                          {navigatingVisitId === visit.id ? (
                                            <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
                                          ) : (
                                            <Activity className="w-4 h-4 flex-shrink-0" />
                                          )}
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Triage</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                {canSeeVisitActionButtons &&
                                  hasConsultationRole &&
                                  (visit.status === "COMPLETED" ||
                                    visit.status === "CANCELLED") &&
                                  !Boolean(
                                    getMatchingUserDepartment(visit, {
                                      mustBeClosed: true,
                                    }),
                                  ) && (
                                    <>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleEditConsultation(visit)
                                            }}
                                            title="Edit Consultation"
                                            aria-label="Edit Consultation"
                                            className="h-9 w-9 sm:h-10 sm:w-10 bg-slate-700 hover:bg-slate-800 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                          >
                                            <FilePenLine className="w-4 h-4 flex-shrink-0" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Edit Consultation</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </>
                                  )}
                                {canSeeAddDepartment &&
                                  canAddDepartment(visit) &&
                                  !isDischarged(visit) && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleAddDepartment(visit)
                                          }}
                                          title="Add Department"
                                          aria-label="Add Department"
                                          className="h-9 w-9 sm:h-10 sm:w-10 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                        >
                                          <Plus className="w-4 h-4 flex-shrink-0" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Add Department</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                {canSeeDischargeButton &&
                                  canDischargeVisit(visit) && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setDischargeConfirmVisit(visit)
                                          }}
                                          title="Discharge Patient"
                                          aria-label="Discharge Patient"
                                          disabled={discharging}
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
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Discharge Patient (set visit to completed)</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                {canSeeBillButton &&
                                  hasUnbilledItems(visit) && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setNavigatingVisitId(visit.id)
                                            handleGoToBilling(visit)
                                          }}
                                          title="Bill Visit"
                                          disabled={navigatingVisitId === visit.id}
                                          className="h-9 w-9 sm:h-10 sm:w-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                        >
                                          {navigatingVisitId === visit.id ? (
                                            <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
                                          ) : (
                                            <ReceiptText className="w-4 h-4 flex-shrink-0" />
                                          )}
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {renderBillingTooltipContent(
                                          visit,
                                          unbilledProductCount,
                                          unbilledProductNames,
                                          billedProductCount,
                                          billedProductNames,
                                          departmentsReadyForBilling,
                                        )}
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                {canSeeBillButton &&
                                  (visit.departments || []).some((d: any) => d.status === "DEPARTMENT_EDITING") && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleGoToBilling(visit)
                                          }}
                                          title="Continue billing"
                                          className="h-9 w-9 sm:h-10 sm:w-10 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center relative"
                                        >
                                          <ReceiptText className="w-4 h-4 flex-shrink-0" />
                                          <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center border border-white">
                                            ✎
                                          </span>
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Continue billing</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                {canSeeBillButton &&
                                  canPreviewVisitInvoice(visit) && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            void handlePreviewInvoice(visit)
                                          }}
                                          title="Preview Invoice"
                                          disabled={
                                            printingVisitId === visit.id
                                          }
                                          className="h-9 w-9 sm:h-10 sm:w-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center relative"
                                        >
                                          <ReceiptText
                                            className={`w-4 h-4 flex-shrink-0 ${printingVisitId === visit.id ? "animate-spin" : ""}`}
                                          />
                                          <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center border border-white">
                                            ✓
                                          </span>
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Preview Invoice</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}

                                {/* Manager role buttons */}
                                {(hasManagerRole || hasAdminRole) && (
                                  <>
                                    {/* Manager: Preview Consultation */}
                                    {(visit.status === "COMPLETED" ||
                                      visit.status === "IN_PROGRESS" ||
                                      visit.status === "CREATED") &&
                                      (visit.departments || []).some(
                                        (d) => d.answerId,
                                      ) && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleManagerPreviewConsultation(visit)
                                            }}
                                            title="Preview Consultation"
                                            aria-label="Preview Consultation"
                                            className="h-9 w-9 sm:h-10 sm:w-10 bg-slate-500 hover:bg-slate-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                          >
                                            <Eye className="w-4 h-4 flex-shrink-0" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Preview Consultation</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    )}

                                    {/* Manager: Finalise Visit */}
                                    {(visit.status === "COMPLETED" || visit.status === "FINALISED") && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              if (canFinaliseVisit(visit)) {
                                                void handleFinaliseVisit(visit)
                                              }
                                            }}
                                            title="Finalise Visit"
                                            aria-label="Finalise Visit"
                                            disabled={finalisingVisit || !canFinaliseVisit(visit)}
                                            className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full shadow-md transition-all duration-200 whitespace-nowrap flex items-center gap-1 sm:gap-2 ${
                                              canFinaliseVisit(visit)
                                                ? "bg-teal-600 hover:bg-teal-700 text-white hover:shadow-lg"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                            }`}
                                          >
                                            {finalisingVisit ? (
                                              <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
                                            ) : canFinaliseVisit(visit) ? (
                                              <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                            ) : (
                                              <Info className="w-4 h-4 flex-shrink-0" />
                                            )}
                                            <span className="hidden sm:inline lg:hidden">
                                              Finalise
                                            </span>
                                            <span className="hidden lg:inline">
                                              {finalisingVisit ? "Finalising…" : canFinaliseVisit(visit) ? "Finalise Visit" : "Not Ready"}
                                            </span>
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="max-w-xs">
                                          {canFinaliseVisit(visit) ? (
                                            <p>Finalise Visit — locks all departments, no more edits</p>
                                          ) : (
                                            <div>
                                              <p className="font-medium mb-1">Cannot finalise yet:</p>
                                              <ul className="list-disc list-inside space-y-0.5">
                                                {getFinaliseBlockers(visit).map((reason, i) => (
                                                  <li key={i} className="text-xs">• {reason}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </TooltipContent>
                                      </Tooltip>
                                    )}

                                    {/* Manager: Manage & Audit Detailed View */}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            router.push(`/visits/manage?visitId=${visit.id}`)
                                          }}
                                          title="Manage & Audit Visit"
                                          aria-label="Manage & Audit Visit"
                                          className="h-9 w-9 sm:h-10 sm:w-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                        >
                                          <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Manage &amp; Audit Visit</p>
                                      </TooltipContent>
                                    </Tooltip>

                                    {/* Manager: Settings */}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleOpenSettings(visit)
                                          }}
                                          title="Visit Settings"
                                          aria-label="Visit Settings"
                                          className="h-9 w-9 sm:h-10 sm:w-10 bg-slate-700 hover:bg-slate-800 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                        >
                                          <Settings className="w-4 h-4 flex-shrink-0" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Visit Settings</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashboardMobileUi
        canSeeRegisterAndCreate={canSeeRegisterAndCreate}
        allVisits={allVisits}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mobileSearchActive={mobileSearchActive}
        setMobileSearchActive={setMobileSearchActive}
        showMobileActionSheet={showMobileActionSheet}
        setShowMobileActionSheet={setShowMobileActionSheet}
        setShowPatientRegistrationModal={setShowPatientRegistrationModal}
        openVisitCreationModal={openVisitCreationModal}
      />

      {patientHistoryOpen && patientHistoryVisit && (
        <PatientHistorySidePane
          patientId={String(patientHistoryVisit.patient.id)}
          currentVisitId={String(patientHistoryVisit.id)}
          onPreviewDepartmentAnswers={({
            answerId,
            departmentName,
            patientName,
          }) => {
            setPreviewConsultationContext({
              answerId,
              departmentName,
              patientName,
              visitDepartment: null,
              previewStartedAt: Date.now(),
            })
            setPreviewConsultationOpen(true)
          }}
          onClose={() => setPatientHistoryOpen(false)}
        />
      )}

      {/* Modals */}
      {showPatientRegistrationModal && (
        <PatientRegistrationModal
          isOpen={showPatientRegistrationModal}
          onClose={() => setShowPatientRegistrationModal(false)}
          onPatientRegistered={handlePatientRegistered}
          hideSearchPanel={
            typeof window !== "undefined" && window.innerWidth < 768
          }
        />
      )}

      {showVisitCreationModal && (
        <VisitCreationModal
          isOpen={showVisitCreationModal}
          onClose={closeVisitCreationModal}
          onVisitCreated={handleVisitCreated}
          preSelectedPatientId={registeredPatientId ?? undefined}
        />
      )}

      {selectedVisitForDepartment && addDepartmentModalOpen && (
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

      <ConsultationPreviewSheet
        open={previewConsultationOpen}
        onOpenChange={(open) => {
          setPreviewConsultationOpen(open)
          if (!open) {
            setPreviewConsultationContext(null)
          }
        }}
        answerId={previewConsultationContext?.answerId || null}
        departmentName={previewConsultationContext?.departmentName}
        patientName={previewConsultationContext?.patientName}
        visitDepartment={previewConsultationContext?.visitDepartment || null}
        previewStartedAt={previewConsultationContext?.previewStartedAt || null}
      />
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
        printingInvoice={Boolean(downloadingInvoiceId)}
        onViewMore={() => {
          if (previewVisit) {
            router.push(`/billing?visitId=${previewVisit.id}`)
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(dischargeConfirmVisit)}
        onOpenChange={(open) => {
          if (!open) setDischargeConfirmVisit(null)
        }}
        title="Discharge this patient?"
        description="Discharging will set the visit status to COMPLETED."
        confirmLabel="Discharge"
        busy={discharging}
        onConfirm={() => {
          if (!dischargeConfirmVisit || discharging) return
          void handleDischargeVisit(dischargeConfirmVisit)
        }}
      />

      <ProfileSelectDialog
        open={profileDialogOpen}
        onClose={() => {
          if (!profileDialogLoading) {
            setProfileDialogOpen(false)
            setProfileDialogVisit(null)
            setProfileDialogProfiles([])
          }
        }}
        onSelect={handleProfileSelected}
        patientName={profileDialogVisit ? `${profileDialogVisit.patient.firstName} ${profileDialogVisit.patient.lastName}` : ""}
        profiles={profileDialogProfiles}
        loading={profileDialogLoading}
      />

      {settingsVisit && (
        <VisitSettingsPanel
          open={settingsPanelOpen}
          onOpenChange={(open) => {
            setSettingsPanelOpen(open)
            if (!open) setSettingsVisit(null)
          }}
          visit={settingsVisit}
          onVisitUpdated={() => {
            void refetchVisits()
          }}
        />
      )}
    </div>
  )
}
