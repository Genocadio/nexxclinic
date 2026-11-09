"use client"

import { useState, useEffect, useMemo, useRef, Fragment } from "react"
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
  RotateCcw,
  Plus,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  SlidersHorizontal,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AddDepartmentModal } from "@/components/add-department-modal"
import { cn } from "@/lib/utils"

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

/** Reusable Icon-only action button with hover tooltip */
function ActionIconButton({
  tooltip,
  icon,
  onClick,
  disabled,
  className,
  variant = "outline",
}: {
  tooltip: string
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  variant?: "outline" | "danger" | "warning" | "success" | "primary" | "ghost"
}) {
  const variantStyles = {
    outline: "border-border bg-background hover:bg-muted text-foreground",
    danger: "border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60",
    warning: "border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60",
    success: "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60",
    primary: "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20",
    ghost: "border-transparent bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground",
  }[variant]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0",
            variantStyles,
            className
          )}
          aria-label={tooltip}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
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
            insuranceCoveredAmount
            patientPayableAmount
            paidAmount
            outstandingAmount
            patientInsurance {
              id
              insuranceCardNumber
              insuranceProvider {
                id
                insuranceName
                acronym
              }
            }
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
  const hasReceptionistRole = hasRole(roles, "RECEPTION")
  const hasNurseRole = hasRole(roles, "NURSE")
  const hasClinicianRole = hasRole(roles, "CLINICIAN") || hasRole(roles, "DOCTOR")
  const isAdminOrManager = hasAdminRole || hasManagerRole || hasFinanceRole

  const [isRendered, setIsRendered] = useState(open)
  const [addDeptOpen, setAddDeptOpen] = useState(false)
  const [expandedDeptIds, setExpandedDeptIds] = useState<Record<string, boolean>>({})
  const [showDateChangeDeptIds, setShowDateChangeDeptIds] = useState<Record<string, boolean>>({})

  // Confirmation dialog state
  const [deleteTarget, setDeleteTarget] = useState<
    { type: "visit" | "cancel-visit" | "department" | "finalise" | "cancel-department" | "discharge" | "re-enable-department" | "open-department"; id: string; name: string } | null
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

  const isDateChangeOpen = (deptId: string) => {
    if (pendingDepartmentEncounterDate?.visitDepartmentId === deptId) return true
    if (pendingBillingDate?.visitDepartmentId === deptId) return true
    return Boolean(showDateChangeDeptIds[deptId])
  }

  const toggleDateChange = (deptId: string) => {
    setShowDateChangeDeptIds((prev) => ({
      ...prev,
      [deptId]: !isDateChangeOpen(deptId),
    }))
  }

  // Consultation preview sheet state
  const [consultationPreviewOpen, setConsultationPreviewOpen] = useState(false)
  const [consultationPreviewContext, setConsultationPreviewContext] = useState<{
    answerId: string | null
    departmentName: string
    patientName: string
    visitId: string
    visitDepartmentId: string
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

  const [reEnableDepartmentMutation, { loading: reEnablingDept }] = useMutation(
    UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION,
    {
      ...refetchConfig,
      onCompleted: (data) => {
        handleResponse(data?.updateVisitDepartmentStatus, {
          successMessage: "Department re-enabled successfully",
          onSuccess: () => {
            onVisitUpdated?.()
            void fetchBilling({ variables: { visitId: visit.id } })
            void fetchProfiles({ variables: { visitId: visit.id } })
          },
        })
      },
      onError: (error) => {
        toast.error(error.message || "Failed to re-enable department")
      },
    },
  )

  const [openDepartmentMutation, { loading: openingDept }] = useMutation(
    UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION,
    {
      ...refetchConfig,
      onCompleted: (data) => {
        handleResponse(data?.updateVisitDepartmentStatus, {
          successMessage: "Visit opened successfully. You can add new products.",
          onSuccess: () => {
            onVisitUpdated?.()
            void fetchBilling({ variables: { visitId: visit.id } })
            void fetchProfiles({ variables: { visitId: visit.id } })
          },
        })
      },
      onError: (error) => {
        toast.error(error.message || "Failed to open visit")
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

  const batchSyncingDatesRef = useRef(false)

  const [updateDepartmentEncounterDate, { loading: updatingEncounterDate }] = useMutation(
    UPDATE_VISIT_DEPARTMENT_ENCOUNTER_DATE_MUTATION,
    {
      ...refetchConfig,
      onCompleted: (data) => {
        handleResponse(data?.updateVisitDepartmentEncounterDate, {
          successMessage: batchSyncingDatesRef.current ? false : "Department encounter date updated successfully",
          onSuccess: () => {
            if (!batchSyncingDatesRef.current) {
              onVisitUpdated?.()
              void fetchBilling({ variables: { visitId: visit.id } })
              void fetchProfiles({ variables: { visitId: visit.id } })
            }
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
        successMessage: batchSyncingDatesRef.current ? false : "Billing date updated successfully",
        onSuccess: () => {
          if (!batchSyncingDatesRef.current) {
            onVisitUpdated?.()
            void fetchBilling({ variables: { visitId: visit.id } })
          }
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
  const [previewingInvoiceKey, setPreviewingInvoiceKey] = useState<string | null>(null)
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

      const targetDeptId = pendingDepartmentEncounterDate.visitDepartmentId
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
      setShowDateChangeDeptIds((prev) => ({ ...prev, [targetDeptId]: false }))
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
    batchSyncingDatesRef.current = true
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
      batchSyncingDatesRef.current = false
      setApplyingDate(false)
    }
  }

  const confirmBillingDateChange = async () => {
    if (!pendingBillingDate) return
    setApplyingDate(true)
    try {
      const targetDeptId = pendingBillingDate.visitDepartmentId
      await updateBillingDate({
        variables: {
          input: {
            departmentInsuranceBillingId: pendingBillingDate.billingId,
            billingDate: pendingBillingDate.date,
          },
        },
      })
      setPendingBillingDate(null)
      setShowDateChangeDeptIds((prev) => ({ ...prev, [targetDeptId]: false }))
      onVisitUpdated?.()
      void fetchLiveVisit({ variables: { id: visit.id } })
    } finally {
      setApplyingDate(false)
    }
  }

  const handlePreviewInvoice = async (
    departmentInsuranceBillingId: string,
    copyType?: string,
  ) => {
    const key = `${departmentInsuranceBillingId}-${copyType || "DEFAULT"}`
    setPreviewingInvoiceKey(key)
    try {
      const invoiceUrl = await resolveInvoiceUrl(
        departmentInsuranceBillingId,
        generateInvoice,
        copyType,
      )
      openInvoicePreview(invoiceUrl)
    } catch (err: any) {
      toast.error(err.message || "Failed to generate invoice")
    } finally {
      setPreviewingInvoiceKey(null)
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
      visitId: String(visit.id),
      visitDepartmentId: String(dept.id),
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

  const handleReEnableDepartment = (departmentId: string) => {
    const dept = visit.departments?.find((d) => d.id === departmentId)
    setDeleteTarget({ type: "re-enable-department", id: departmentId, name: dept?.department?.name || 'this department' })
  }

  const handleOpenDepartment = (departmentId: string) => {
    const dept = visit.departments?.find((d) => d.id === departmentId)
    setDeleteTarget({ type: "open-department", id: departmentId, name: dept?.department?.name || "this department" })
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
    } else if (deleteTarget.type === "re-enable-department") {
      await reEnableDepartmentMutation({
        variables: {
          input: {
            visitDepartmentId: deleteTarget.id,
            status: "PENDING",
          },
        },
      })
    } else if (deleteTarget.type === "open-department") {
      await openDepartmentMutation({
        variables: {
          input: {
            visitDepartmentId: deleteTarget.id,
            status: "ACTIVE",
          },
        },
      })
    }
    setDeleteTarget(null)
  }

  const canCancelVisit = currentVisit.status !== "CANCELLED"
  const hasDeptEditing = (currentVisit.departments || []).some((d: any) => d.status === "DEPARTMENT_EDITING")
  const canDeleteVisit = !hasDeptEditing
  const canDischarge = canDischargeVisit(currentVisit)

  // ── Derived billing state ──
  const billingDepartments = billingData?.visitBilling?.data?.departments
  const isBillEditing = (currentVisit.departments || []).some((d) => d.status === "DEPARTMENT_EDITING")

  // Check if visit is active (not cancelled or completed)
  const isVisitActive =
    currentVisit.status !== "CANCELLED" &&
    currentVisit.status !== "COMPLETED" &&
    currentVisit.status !== "FINALISED"

  // ── Department Hierarchy & Tree Logic ──
  // Child department IDs across the entire visit
  const childDeptIds = useMemo(() => {
    const ids = new Set<string>()
    ;(currentVisit?.departments || []).forEach((d) => {
      ;(d.childVisitDepartments || []).forEach((c) => {
        if (c?.id) ids.add(c.id)
      })
    })
    return ids
  }, [currentVisit])

  // Root departments (not listed as children of any other department)
  const rootDepartments = useMemo(() => {
    return (currentVisit?.departments || []).filter((d) => !childDeptIds.has(d.id))
  }, [currentVisit, childDeptIds])

  // Hierarchical flattened list with tree depth for rendering tree nodes
  const flattenedDepartments = useMemo(() => {
    const list: Array<{
      dept: Visit["departments"][number]
      isChild: boolean
      parentName?: string
      depth: number
    }> = []

    const visitDeptMap = new Map<string, Visit["departments"][number]>()
    ;(currentVisit?.departments || []).forEach((d) => visitDeptMap.set(d.id, d))

    const addNode = (
      d: Visit["departments"][number],
      isChild = false,
      parentName?: string,
      depth = 0
    ) => {
      const fullDept = visitDeptMap.get(d.id) || d
      list.push({ dept: fullDept, isChild, parentName, depth })
      ;(fullDept.childVisitDepartments || []).forEach((cd) => {
        addNode(
          cd as unknown as Visit["departments"][number],
          true,
          fullDept.department?.name,
          depth + 1
        )
      })
    }

    rootDepartments.forEach((rd) => addNode(rd))
    return list
  }, [currentVisit, rootDepartments])

  const isSingleDept = flattenedDepartments.length === 1

  const isDeptExpanded = (deptId: string, index: number) => {
    if (isSingleDept) return true
    if (expandedDeptIds[deptId] !== undefined) return expandedDeptIds[deptId]
    return index === 0
  }

  const toggleDeptExpanded = (deptId: string, index: number) => {
    setExpandedDeptIds((prev) => ({
      ...prev,
      [deptId]: !isDeptExpanded(deptId, index),
    }))
  }

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
              : deleteTarget?.type === "re-enable-department"
                ? `Re-enable "${deleteTarget?.name || ''}"?`
                : deleteTarget?.type === "open-department"
                  ? `Open "${deleteTarget?.name || ''}" for new products?`
                : `Remove "${deleteTarget?.name || ''}"?`;

  const deleteDialogDeps =
    deleteTarget?.type === "department"
      ? (visit.departments?.find((d) => d.id === deleteTarget?.id)?.products || []).map(
          (p) => ({ label: `${p.product.name} (${p.quantity}x)` })
        )
      : [];

  return (
    <TooltipProvider delayDuration={200}>
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
              <div className="border-b border-border/70 px-4 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary shrink-0" />
                      <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">
                        Visit Settings & Actions
                      </h2>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {visit.patient?.firstName} {visit.patient?.lastName} • Visit #{visit.id.slice(-8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Add Department button when visit is active */}
                    {isVisitActive && (
                      <ActionIconButton
                        tooltip="Add Department to Visit"
                        variant="primary"
                        icon={<Plus className="h-4 w-4" />}
                        onClick={() => setAddDeptOpen(true)}
                      />
                    )}
                    {isAdminOrManager && flattenedDepartments.length > 1 && (
                      <ActionIconButton
                        tooltip="Auto-Sync Department Times (5-Min Rule)"
                        variant="outline"
                        icon={applyingDate ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4 text-primary" />}
                        disabled={applyingDate}
                        onClick={() => void syncAllDepartmentTimes()}
                      />
                    )}
                    <ActionIconButton
                      tooltip="Close Settings"
                      variant="ghost"
                      icon={<X className="h-4 w-4" />}
                      onClick={() => onOpenChange(false)}
                    />
                  </div>
                </div>
              </div>

              {/* Scrollable Main Content */}
              <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-4 pr-3 pb-6">
                  {/* Top Visit Overview Strip */}
                  <div className="rounded-xl border border-border p-3.5 space-y-3 bg-muted/10">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold text-foreground text-sm">
                          Visit Summary
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={cn(
                          "text-xs px-2.5 py-0.5 rounded-full font-semibold",
                          visit.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                            : visit.status === "CANCELLED"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                        )}>
                          {visit.status}
                        </span>
                        {isBillEditing && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                            Billing Edit Mode
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-muted-foreground">Visit Created</span>
                        <p className="font-medium text-foreground truncate">
                          {formatFullDateTime(visit.createdAt)}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-muted-foreground">Encounter Date</span>
                        <p className="font-medium text-foreground truncate">
                          {formatFullDateTime(visit.visitDate)}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-muted-foreground">Departments</span>
                        <p className="font-medium text-foreground">
                          {flattenedDepartments.length} {flattenedDepartments.length === 1 ? "department" : "departments"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ready for Discharge Alert Banner */}
                  {canDischarge && (
                    <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3.5 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm">
                            Ready for Patient Discharge
                          </h4>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300">
                            All departments are completed. You can discharge the patient and finalize the visit.
                          </p>
                        </div>
                      </div>
                      <ActionIconButton
                        tooltip="Discharge Patient"
                        variant="success"
                        icon={completingVisit ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        disabled={completingVisit}
                        onClick={() => setDeleteTarget({
                          type: "discharge",
                          id: visit.id,
                          name: `${visit.patient?.firstName} ${visit.patient?.lastName}`.trim(),
                        })}
                      />
                    </div>
                  )}

                  {/* Department Section Header (if multi-department) */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-foreground text-sm">
                        {isSingleDept ? "Department Details & Actions" : `Departments (${flattenedDepartments.length})`}
                      </h3>
                    </div>
                    {isVisitActive && (
                      <ActionIconButton
                        tooltip="Add Department to Visit"
                        variant="primary"
                        icon={<Plus className="h-4 w-4" />}
                        onClick={() => setAddDeptOpen(true)}
                      />
                    )}
                  </div>

                  {/* Department Tree / List */}
                  {flattenedDepartments.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-border rounded-xl text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm font-medium">No departments assigned to this visit</p>
                      {isVisitActive && (
                        <button
                          type="button"
                          onClick={() => setAddDeptOpen(true)}
                          className="mt-3 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Department
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {flattenedDepartments.map(({ dept, isChild, parentName, depth }, index) => {
                        const isExpanded = isDeptExpanded(dept.id, index)
                        const isTerminal =
                          dept.status === "COMPLETED" ||
                          dept.status === "FINALISED" ||
                          dept.status === "CANCELLED"
                        const hasProducts = Boolean(dept.products && dept.products.length > 0)
                        const isAssignedProcessor = Boolean(
                          doctor?.id &&
                            dept.processors?.some((p) => String(p.id) === String(doctor.id))
                        )

                        let canCancelDept = false
                        if (!isTerminal) {
                          if (dept.status === "ACTIVE") {
                            canCancelDept = isAssignedProcessor || isAdminOrManager
                          } else {
                            canCancelDept = !hasProducts || isAssignedProcessor || isAdminOrManager
                          }
                        }

                        const canReEnableDept =
                          dept.status === "CANCELLED" &&
                          isVisitActive &&
                          (isAdminOrManager || hasReceptionistRole || hasNurseRole || hasClinicianRole)

                        const canDeleteDept =
                          (hasAdminRole || hasManagerRole) && dept.status !== "FINALISED"

                        const deptBilling = billingDepartments?.find(
                          (b: any) => b.visitDepartment?.id === dept.id,
                        )
                        const insBillings = (deptBilling?.insuranceBillings || []) as any[]

                        const profileDept = profileDeptsByVisitDeptId.get(dept.id)
                        const deptCatalog = departments.find(
                          (d) => String(d.id) === String(dept.department?.id || dept.id),
                        )
                        const assignedProfile =
                          profileDept?.assigned ??
                          (dept.profile
                            ? {
                                id: dept.profile.id,
                                name: dept.profile.name,
                                encounterType: (dept as any).encounterType,
                              }
                            : null)
                        const rawAvailable = (profileDept?.available?.length
                          ? profileDept.available
                          : deptCatalog?.profiles || (dept.department as any)?.profiles || []) as Array<{
                          id: string
                          name: string
                          encounterType?: string
                        }>
                        const availableProfiles = rawAvailable.map((p) => ({
                          id: p.id,
                          name: p.name,
                          encounterType: p.encounterType || "",
                        }))
                        const isSupportRequests = Boolean(
                          deptCatalog?.supportRequests || (dept.department as any)?.supportRequests
                        )
                        const isProfileLocked =
                          dept.status === "BILLING" ||
                          dept.status === "COMPLETED" ||
                          dept.status === "FINALISED" ||
                          dept.status === "DEPARTMENT_EDITING"

                        return (
                          <div
                            key={dept.id}
                            className={cn(
                              "rounded-xl border border-border bg-card transition-all shadow-xs",
                              isChild && depth > 0 && "ml-4 sm:ml-6 border-l-4 border-l-primary/40 pl-1"
                            )}
                          >
                            {/* Department Tree Header Row */}
                            {isSingleDept ? (
                              <div className="flex items-center justify-between gap-2 p-3 border-b border-border/60 bg-muted/20 rounded-t-xl">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                                  <span className="font-semibold text-foreground text-sm truncate">
                                    {dept.department?.name || "Unknown Department"}
                                  </span>
                                  <span className="text-xs text-muted-foreground truncate">
                                    ({dept.encounterType || "Encounter"})
                                  </span>
                                  <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                                    dept.status === "COMPLETED"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                      : dept.status === "CANCELLED"
                                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                        : dept.status === "ACTIVE"
                                          ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                                          : dept.status === "DEPARTMENT_EDITING"
                                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                            : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                                  )}>
                                    {dept.status}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  "flex items-center justify-between gap-2 p-3 transition-colors cursor-pointer select-none",
                                  isExpanded ? "border-b border-border/60 bg-muted/20 rounded-t-xl" : "hover:bg-muted/30 rounded-xl"
                                )}
                                onClick={() => toggleDeptExpanded(dept.id, index)}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <button
                                    type="button"
                                    className="p-1 -ml-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                                    aria-label={isExpanded ? "Collapse department" : "Expand department"}
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4 shrink-0 text-foreground" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 shrink-0" />
                                    )}
                                  </button>
                                  {isChild && (
                                    <CornerDownRight className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                                  )}
                                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                                  <span className="font-semibold text-foreground text-sm truncate">
                                    {dept.department?.name || "Unknown Department"}
                                  </span>
                                  {isChild && parentName && (
                                    <span className="text-xs text-muted-foreground hidden sm:inline truncate">
                                      ({parentName})
                                    </span>
                                  )}
                                  <span className="text-xs text-muted-foreground hidden md:inline truncate">
                                    • {dept.encounterType || "Encounter"}
                                  </span>
                                  <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                                    dept.status === "COMPLETED"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                      : dept.status === "CANCELLED"
                                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                        : dept.status === "ACTIVE"
                                          ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                                          : dept.status === "DEPARTMENT_EDITING"
                                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                            : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                                  )}>
                                    {dept.status}
                                  </span>
                                </div>

                                {/* Quick Indicators when collapsed */}
                                {!isExpanded && (
                                  <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
                                    {dept.answerId && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="p-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                                            <FileText className="h-3.5 w-3.5" />
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">Consultation Recorded</TooltipContent>
                                      </Tooltip>
                                    )}
                                    {insBillings.length > 0 && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium text-xs">
                                            <ReceiptText className="h-3.5 w-3.5" />
                                            <span>{insBillings.length}</span>
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">{insBillings.length} Billing Record(s)</TooltipContent>
                                      </Tooltip>
                                    )}
                                    {hasProducts && (
                                      <span className="hidden md:inline font-normal">
                                        {dept.products.length} {dept.products.length === 1 ? "item" : "items"}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Expanded Content / Actions */}
                            {isExpanded && (
                              <div className="p-3.5 space-y-4">
                                {/* Actions Toolbar: Icon-only buttons with hover tooltips */}
                                <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-border/60">
                                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Department Actions
                                  </span>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {/* Change Date Icon Button */}
                                    <ActionIconButton
                                      tooltip={isDateChangeOpen(dept.id) ? "Hide Dates Panel" : "Adjust Encounter & Billing Timestamps"}
                                      variant={isDateChangeOpen(dept.id) ? "primary" : "outline"}
                                      icon={<CalendarClock className="h-4 w-4 text-primary" />}
                                      disabled={visit.status === "CANCELLED" || dept.status === "CANCELLED" || dept.status === "DEPARTMENT_EDITING"}
                                      onClick={() => toggleDateChange(dept.id)}
                                    />

                                    {/* Consultation Preview Icon */}
                                    {dept.answerId && (
                                      <ActionIconButton
                                        tooltip="Preview Consultation Answers"
                                        variant="outline"
                                        icon={<FileText className="h-4 w-4 text-blue-600" />}
                                        onClick={() => handlePreviewConsultation(dept)}
                                      />
                                    )}

                                    {/* Invoices & Receipts Download Icons */}
                                    {insBillings.map((ib: any) => {
                                      const isInsured = Boolean(
                                        (ib.insuranceCoveredAmount && ib.insuranceCoveredAmount > 0) ||
                                          ib.patientInsurance,
                                      )
                                      const invoiceNo = ib.id ? ib.id.slice(-8).toUpperCase() : ""
                                      const providerName =
                                        ib.patientInsurance?.insuranceProvider?.acronym ||
                                        ib.patientInsurance?.insuranceProvider?.insuranceName ||
                                        "Insurer"

                                      if (isInsured) {
                                        const claimKey = `${ib.id}-INSURANCE`
                                        const receiptKey = `${ib.id}-PATIENT`
                                        const isClaimLoading = previewingInvoiceKey === claimKey
                                        const isReceiptLoading = previewingInvoiceKey === receiptKey

                                        return (
                                          <Fragment key={ib.id}>
                                            <ActionIconButton
                                              tooltip={`Download ${providerName} Claim (Insurer Ref: #${invoiceNo})`}
                                              variant="primary"
                                              icon={isClaimLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ReceiptText className="h-4 w-4 text-blue-600" />}
                                              disabled={generatingInvoice}
                                              onClick={() => handlePreviewInvoice(ib.id, "INSURANCE")}
                                            />
                                            <ActionIconButton
                                              tooltip={`Download Patient Co-pay Receipt (${providerName} Ref: #${invoiceNo})`}
                                              variant="success"
                                              icon={isReceiptLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ReceiptText className="h-4 w-4 text-emerald-600" />}
                                              disabled={generatingInvoice}
                                              onClick={() => handlePreviewInvoice(ib.id, "PATIENT")}
                                            />
                                          </Fragment>
                                        )
                                      }

                                      const privKey = `${ib.id}-DEFAULT`
                                      const isPrivLoading = previewingInvoiceKey === privKey

                                      return (
                                        <ActionIconButton
                                          key={ib.id}
                                          tooltip={`Download Private Invoice & Receipt (Ref: #${invoiceNo})`}
                                          variant="primary"
                                          icon={isPrivLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ReceiptText className="h-4 w-4 text-purple-600" />}
                                          disabled={generatingInvoice}
                                          onClick={() => handlePreviewInvoice(ib.id)}
                                        />
                                      )
                                    })}

                                    {/* Billing Edit controls for manager/admin */}
                                    {isAdminOrManager && (
                                      <>
                                        {dept.status === "DEPARTMENT_EDITING" ? (
                                          <ActionIconButton
                                            tooltip="Cancel Billing Edit and restore department status"
                                            variant="danger"
                                            icon={cancellingBillEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                            disabled={cancellingBillEdit}
                                            onClick={() => handleCancelBillEditing(dept.id)}
                                          />
                                        ) : (
                                          (dept.status === "COMPLETED" || dept.status === "FINALISED") && (
                                            <>
                                              <ActionIconButton
                                                tooltip="Enable Billing Editing Mode"
                                                variant="outline"
                                                icon={startingBillEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : <ReceiptText className="h-4 w-4 text-indigo-600" />}
                                                disabled={startingBillEdit}
                                                onClick={() => handleStartBillEditing(dept.id)}
                                              />
                                              <ActionIconButton
                                                tooltip="Open Visit for Adding New Products"
                                                variant="outline"
                                                icon={openingDept ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4 text-sky-600" />}
                                                disabled={openingDept}
                                                onClick={() => handleOpenDepartment(dept.id)}
                                              />
                                            </>
                                          )
                                        )}
                                      </>
                                    )}

                                    {/* Finalise Department button */}
                                    {dept.status === "COMPLETED" &&
                                      dept.hasFinalizedConsultationAnswers &&
                                      !dept.hasBillableProducts && (
                                      <ActionIconButton
                                        tooltip="Finalise Department"
                                        variant="success"
                                        icon={finalisingDept ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                        disabled={finalisingDept}
                                        onClick={() => handleFinaliseDepartment(dept.id)}
                                      />
                                    )}

                                    {/* Re-enable Department */}
                                    {canReEnableDept && (
                                      <ActionIconButton
                                        tooltip={`Re-enable ${dept.department?.name || 'Department'}`}
                                        variant="success"
                                        icon={reEnablingDept ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                                        disabled={reEnablingDept}
                                        onClick={() => handleReEnableDepartment(dept.id)}
                                      />
                                    )}

                                    {/* Cancel & Delete Department: ONLY for multi-department visits */}
                                    {!isSingleDept && canCancelDept && (
                                      <ActionIconButton
                                        tooltip={`Cancel ${dept.department?.name || 'Department'}`}
                                        variant="warning"
                                        icon={cancellingDept ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                                        disabled={cancellingDept}
                                        onClick={() => handleCancelDepartment(dept.id)}
                                      />
                                    )}
                                    {!isSingleDept && canDeleteDept && (
                                      <ActionIconButton
                                        tooltip={`Remove ${dept.department?.name || 'Department'}`}
                                        variant="danger"
                                        icon={removingDept ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                        disabled={removingDept}
                                        onClick={() => handleRemoveDepartment(dept.id)}
                                      />
                                    )}
                                  </div>
                                </div>

                                {/* Unified Encounter & Billing Timestamps Section: Minimised by default */}
                                <div className="rounded-xl border border-border/70 bg-muted/20 p-2.5 transition-all space-y-2.5">
                                  {/* Minimised Header Strip: Toggled via toolbar icon or click */}
                                  <div
                                    onClick={() => {
                                      if (visit.status !== "CANCELLED" && dept.status !== "CANCELLED" && dept.status !== "DEPARTMENT_EDITING") {
                                        toggleDateChange(dept.id)
                                      }
                                    }}
                                    className="flex items-center justify-between gap-2 cursor-pointer hover:opacity-90 select-none"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <CalendarClock className="h-4 w-4 text-primary" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <p className="text-xs font-semibold text-foreground truncate">
                                            Encounter & Billing Dates
                                          </p>
                                          {insBillings.length > 0 ? (
                                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium shrink-0">
                                              {insBillings.length} {insBillings.length === 1 ? "Billing" : "Billings"}
                                            </span>
                                          ) : (
                                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground shrink-0">
                                              Unbilled
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                          Seen: {formatFullDateTime(dept.startedAt || dept.createdAt || currentVisit.visitDate)}
                                          {insBillings.length > 0 && insBillings[0]?.billingDate && (
                                            <span className="hidden sm:inline"> • Billed: {formatFullDateTime(insBillings[0].billingDate)}</span>
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
                                      {isDateChangeOpen(dept.id) ? (
                                        <ChevronDown className="h-4 w-4 text-foreground" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </div>
                                  </div>

                                  {/* Change Panel: Revealed on click */}
                                  {isDateChangeOpen(dept.id) && (
                                    <div className="pt-3 border-t border-border/60 space-y-3">
                                      <div className="flex items-center justify-between pb-1">
                                        <div>
                                          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                            <CalendarClock className="h-3.5 w-3.5 text-primary" />
                                            Adjust Department Timestamps
                                          </h4>
                                          <p className="text-[11px] text-muted-foreground mt-0.5">
                                            Update encounter start time and synchronized invoice billing dates.
                                          </p>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setPendingDepartmentEncounterDate(null)
                                            setPendingBillingDate(null)
                                            setShowDateChangeDeptIds((prev) => ({ ...prev, [dept.id]: false }))
                                          }}
                                          className="text-xs text-muted-foreground hover:text-foreground px-2 py-0.5 rounded hover:bg-muted transition-colors cursor-pointer"
                                        >
                                          Done
                                        </button>
                                      </div>

                                      {dept.status === "DEPARTMENT_EDITING" ? (
                                        <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg px-2.5 py-2">
                                          Timestamp editing is locked while department billing edit mode is active.
                                        </p>
                                      ) : (
                                        <div className="space-y-3">
                                          {/* Step 1: Department Encounter Date */}
                                          <div className="rounded-lg border border-border/70 bg-background p-3 space-y-2">
                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                                <span className="size-4 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center">1</span>
                                                Department Encounter Date & Time
                                              </span>
                                              <span className="text-[11px] text-muted-foreground">
                                                Current: {formatFullDateTime(dept.startedAt || dept.createdAt || currentVisit.visitDate)}
                                              </span>
                                            </div>

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
                                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
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
                                                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
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
                                                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs font-medium rounded-md transition-colors cursor-pointer"
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                            )}
                                            <p className="text-[11px] text-muted-foreground">
                                              Sets the official encounter attendance timestamp for this department.
                                            </p>
                                          </div>

                                          {/* Step 2: Department Billing Timestamps (if applicable) */}
                                          {insBillings.length > 0 && (
                                            <div className="rounded-lg border border-border/70 bg-background p-3 space-y-2.5">
                                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                                  <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center justify-center">2</span>
                                                  Billing Invoices & Receipts Date & Time
                                                </span>
                                                <span className="text-[11px] text-muted-foreground">
                                                  {insBillings.length} billing record{insBillings.length > 1 ? "s" : ""}
                                                </span>
                                              </div>

                                              <div className="space-y-2">
                                                {insBillings.map((ib: any) => (
                                                  <div
                                                    key={ib.id}
                                                    className="rounded-md border border-border/60 bg-muted/20 p-2.5 space-y-1.5"
                                                  >
                                                    <div className="flex items-center justify-between text-xs">
                                                      <span className="font-semibold text-foreground">
                                                        {ib.patientInsurance?.insuranceProvider?.insuranceName || ib.insurance?.name || "Billing Record"}
                                                        {ib.patientInsurance?.insuranceProvider?.acronym ? ` (${ib.patientInsurance.insuranceProvider.acronym})` : ""}
                                                      </span>
                                                      <span className="text-muted-foreground font-medium">
                                                        {ib.totalAmount?.toLocaleString()} RWF
                                                        {ib.status && (
                                                          <span className={`ml-2 ${
                                                            ib.status === "PAID" ? "text-emerald-600 font-semibold" :
                                                            ib.status === "PARTIALLY_PAID" ? "text-amber-600 font-semibold" :
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
                                                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1 cursor-pointer"
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
                                                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs font-medium rounded-md transition-colors cursor-pointer"
                                                        >
                                                          Cancel
                                                        </button>
                                                      </div>
                                                    )}
                                                    <p className="text-[11px] text-muted-foreground">
                                                      Must be at least 5 minutes after encounter date
                                                    </p>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Clinic Profile Section */}
                                <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                      <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                                      Clinic Profile
                                    </span>
                                    {profilesLoading && !profileDept && !deptCatalog && (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                                    )}
                                  </div>

                                  {isSupportRequests ? (
                                    <p className="text-xs text-muted-foreground">
                                      This department supports requests, so profiles cannot be applied.
                                    </p>
                                  ) : availableProfiles.length === 0 ? (
                                    <p className="text-xs text-muted-foreground italic">
                                      No profiles configured for this department
                                    </p>
                                  ) : (
                                    <div className="space-y-2">
                                      {assignedProfile ? (
                                        <div className="flex items-center justify-between gap-2 bg-background p-2 rounded-md border border-border/50">
                                          <div className="min-w-0">
                                            <p className="text-xs font-semibold text-foreground truncate">
                                              {assignedProfile.name}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground truncate">
                                              {assignedProfile.encounterType || profileDept?.encounterType || "No encounter type"}
                                            </p>
                                          </div>
                                          <span className="shrink-0 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-full">
                                            Active
                                          </span>
                                        </div>
                                      ) : (
                                        <p className="text-xs text-muted-foreground">
                                          No profile currently assigned
                                        </p>
                                      )}

                                      {canManageProfile && !isProfileLocked && (
                                        <div className="flex items-center gap-2">
                                          <Select
                                            value={assignedProfile?.id || "none"}
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
                                                placeholder={assignedProfile ? "Change profile..." : "Select profile..."}
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="none">
                                                No profile
                                              </SelectItem>
                                              {availableProfiles.map((p) => (
                                                <SelectItem key={p.id} value={p.id}>
                                                  {p.name}
                                                  {p.encounterType ? ` — ${p.encounterType}` : ""}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          {assignedProfile && (
                                            <ActionIconButton
                                              tooltip="Remove Assigned Profile"
                                              variant="danger"
                                              icon={removingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                              disabled={removingProfile || changingProfile}
                                              onClick={() => handleRemoveDepartmentProfile(dept.id)}
                                            />
                                          )}
                                        </div>
                                      )}

                                      {isProfileLocked && (
                                        <p className="text-[11px] text-muted-foreground">
                                          Profile locked while department is {dept.status.toLowerCase()}.
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Danger Zone: Whole Visit Cancel & Delete */}
                  <div className="rounded-xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 p-3.5 space-y-2 mt-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        <div>
                          <h4 className="font-semibold text-rose-700 dark:text-rose-300 text-sm">
                            Visit Danger Zone
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {isSingleDept
                              ? "Cancel or permanently delete this visit encounter."
                              : "Actions apply to the entire visit across all departments."}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {canCancelVisit && (
                          <ActionIconButton
                            tooltip="Cancel Entire Visit"
                            variant="warning"
                            icon={cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                            disabled={!canCancelVisit || cancelling}
                            onClick={handleCancelVisit}
                          />
                        )}
                        {canDeleteVisit && (
                          <ActionIconButton
                            tooltip="Permanently Delete Visit"
                            variant="danger"
                            icon={deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            disabled={!canDeleteVisit || deleting}
                            onClick={handleDeleteVisit}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </ScrollArea>
            </div>
          </aside>
        </div>,
        document.body,
      )}

      {/* Add Department Modal */}
      <AddDepartmentModal
        visit={currentVisit}
        isOpen={addDeptOpen}
        onClose={() => setAddDeptOpen(false)}
        onSuccess={() => {
          onVisitUpdated?.()
          void fetchLiveVisit({ variables: { id: visit.id } })
          void fetchBilling({ variables: { visitId: visit.id } })
          void fetchProfiles({ variables: { visitId: visit.id } })
        }}
      />

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
              : deleteTarget?.type === "discharge"
                ? "Discharge"
                : deleteTarget?.type === "finalise"
                  ? "Finalise"
                  : deleteTarget?.type === "cancel-department"
                    ? "Cancel Department"
                    : deleteTarget?.type === "re-enable-department"
                      ? "Re-enable Department"
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
        visitId={consultationPreviewContext?.visitId}
        visitDepartmentId={consultationPreviewContext?.visitDepartmentId}
        visitDepartment={consultationPreviewContext?.visitDepartment ?? null}
      />
    </TooltipProvider>
  )
}

