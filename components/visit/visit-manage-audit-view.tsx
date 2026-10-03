"use client"

import React, { useState, useMemo, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "@apollo/client"
import { useAuth } from "@/lib/auth-context"
import { useVisit } from "@/hooks/auth-hooks"
import { useVisitDepartmentNotes } from "@/hooks/visits/hooks"
import { GET_BILL_BY_VISIT_QUERY } from "@/hooks/queries"
import { COMPLETE_VISIT_MUTATION } from "@/hooks/mutations/visits"
import { useGenerateInvoice } from "@/hooks/billing/hooks"
import { openInvoicePreview, resolveInvoiceUrl } from "@/lib/invoice-utils"
import { toast } from "react-toastify"
import { hasRole } from "@/lib/role-utils"
import { canDischargeVisit } from "@/lib/visit-product-utils"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import type {
  Visit,
  VisitDepartment,
  VisitDepartmentProduct,
  Worker,
  PatientInsurance,
  VisitDepartmentDiagnosis,
  VisitDepartmentMedication,
  VisitPreInstruction,
} from "@/lib/api-types"
import {
  resolvePatientSharePercentage,
  type CoverageTier,
} from "@/lib/billing-utils"
import { isInsuranceActive, getInsuranceDisplayName } from "@/lib/insurance-utils"
import { formatRWF } from "@/lib/utils"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { ConsultationPreviewSheet } from "@/components/dashboard/consultation-preview-sheet"
import { VisitSettingsPanel } from "@/components/manager/visit-settings-panel"
import { ConsultationSidePanels } from "@/components/consultation/consultation-side-panels"
import PatientHistorySidePane from "@/components/patient-history-side-pane"
import DepartmentNotesFloating from "@/components/department-notes-floating"
import {
  ArrowLeft,
  RefreshCw,
  Clock,
  User,
  Activity,
  Stethoscope,
  Pill,
  FileText,
  Building2,
  Calendar,
  Search,
  Eye,
  Settings,
  ReceiptText,
  ShieldCheck,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Timer,
  FileCheck2,
  CornerDownRight,
  ChevronRight,
  Layers,
  CalendarClock,
  Loader2,
} from "lucide-react"

// ============================================
// Types & Helper Functions
// ============================================

function parseTimestamp(val: unknown): Date | null {
  if (!val) return null
  if (typeof val === "number") {
    const d = new Date(val)
    return isNaN(d.getTime()) ? null : d
  }
  if (typeof val === "string") {
    const trimmed = val.trim()
    if (!trimmed) return null
    if (/^\d+$/.test(trimmed)) {
      const num = Number(trimmed)
      const d = new Date(num)
      if (!isNaN(d.getTime())) return d
    }
    const d = new Date(trimmed)
    if (!isNaN(d.getTime())) return d
  }
  return null
}

function formatFullDateTime(d: Date | null | undefined): string {
  if (!d) return "—"
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d)
  } catch {
    return String(d)
  }
}

function formatTimeOnly(d: Date | null | undefined): string {
  if (!d) return "—"
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d)
  } catch {
    return String(d)
  }
}

function formatDuration(start: Date | null | undefined, end: Date | null | undefined): string {
  if (!start) return "—"
  const endFinal = end || new Date()
  const diffMs = Math.max(0, endFinal.getTime() - start.getTime())
  const totalMinutes = Math.floor(diffMs / (1000 * 60))

  if (totalMinutes < 1) return "< 1 min"
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

function getWorkerName(worker?: Worker | null): string {
  if (!worker) return "Staff / System"
  const parts = [worker.firstName, worker.lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(" ") : worker.username || worker.email || "Staff"
}

export interface ProductBillingSummary {
  unitPrice: number
  lineTotal: number
  insuranceName: string
  isInsured: boolean
  coveragePct: number
  patientSharePct: number
  insuranceAmount: number
  patientAmount: number
}

export function resolveProductBillingSummary(
  prod: VisitDepartmentProduct,
  dept: VisitDepartment,
  linkedInsurances?: PatientInsurance[] | null,
): ProductBillingSummary {
  const quantity = Number(prod.quantity) || 1
  const product = prod.product
  const basePrice = Number(product?.clinicPrice ?? product?.privateRhicPrice ?? 0)

  // Primary linked active insurance
  const activeInsurances = (linkedInsurances || []).filter(isInsuranceActive)
  const primaryInsurance = activeInsurances[0] || (linkedInsurances || [])[0]
  const provider = primaryInsurance?.insuranceProvider

  // Find matched coverage for this provider
  const matchedCoverage = (product?.insuranceCoverages || []).find(
    (cov) => cov.insuranceProvider?.id === provider?.id
  )

  const isInsured = Boolean(
    primaryInsurance &&
    matchedCoverage &&
    matchedCoverage.covered !== false &&
    Number(matchedCoverage.cost) > 0
  )

  const unitPrice = isInsured && matchedCoverage ? Number(matchedCoverage.cost) : basePrice
  const lineTotal = unitPrice * quantity

  if (!isInsured || !primaryInsurance) {
    return {
      unitPrice,
      lineTotal,
      insuranceName: "Cash / Private",
      isInsured: false,
      coveragePct: 0,
      patientSharePct: 100,
      insuranceAmount: 0,
      patientAmount: lineTotal,
    }
  }

  const coverageTiers: CoverageTier[] = (provider?.coverages || []).map((c) => ({
    coverageId: c.id,
    departmentId: c.departmentId ?? null,
    departmentName: c.departmentName ?? null,
    encounterType: c.encounterType ?? null,
    patientSharePercentage: Number(c.patientSharePercentage) || 0,
  }))

  const patientSharePct = resolvePatientSharePercentage({
    departmentId: dept.department?.id ?? null,
    encounterType: dept.encounterType ?? null,
    patientSharePercentage: primaryInsurance.patientSharePercentage ?? null,
    coverages: coverageTiers,
  })

  const coveragePct = Math.max(0, 100 - patientSharePct)
  const insuranceAmount = Math.round((lineTotal * coveragePct) / 100)
  const patientAmount = lineTotal - insuranceAmount

  return {
    unitPrice,
    lineTotal,
    insuranceName: getInsuranceDisplayName(provider),
    isInsured: true,
    coveragePct,
    patientSharePct,
    insuranceAmount,
    patientAmount,
  }
}

export { getInsuranceDisplayName }

export interface DepartmentAppliedInsurance {
  patientInsurance: PatientInsurance
  isPolicyActive: boolean
  patientSharePct: number
  coveragePct: number
  displayName: string
}

export function getDepartmentAppliedInsurances(
  dept: VisitDepartment,
  linkedInsurances?: PatientInsurance[] | null,
): DepartmentAppliedInsurance[] {
  if (!linkedInsurances || linkedInsurances.length === 0) return []

  const policyMode = dept.department?.insurancePolicyMode || "ALL"
  const policyProviderIds = new Set(
    (dept.department?.insurancePolicies || []).map((p) => (typeof p === "string" ? p : p.id))
  )

  const applicableInsurances = linkedInsurances.filter((ins) => {
    const providerId = ins.insuranceProvider?.id
    if (!providerId) return true

    if (policyMode === "ONLY") {
      return policyProviderIds.has(providerId)
    } else if (policyMode === "EXCEPT") {
      return !policyProviderIds.has(providerId)
    }
    return true // ALL
  })

  return applicableInsurances.map((ins) => {
    const provider = ins.insuranceProvider
    const coverageTiers: CoverageTier[] = (provider?.coverages || []).map((c) => ({
      coverageId: c.id,
      departmentId: c.departmentId ?? null,
      departmentName: c.departmentName ?? null,
      encounterType: c.encounterType ?? null,
      patientSharePercentage: Number(c.patientSharePercentage) || 0,
    }))

    const patientSharePct = resolvePatientSharePercentage({
      departmentId: dept.department?.id ?? null,
      encounterType: dept.encounterType ?? null,
      patientSharePercentage: ins.patientSharePercentage ?? null,
      coverages: coverageTiers,
    })

    const coveragePct = Math.max(0, 100 - patientSharePct)
    const displayName = getInsuranceDisplayName(provider)
    const isPolicyActive = isInsuranceActive(ins)

    return {
      patientInsurance: ins,
      isPolicyActive,
      patientSharePct,
      coveragePct,
      displayName,
    }
  })
}

// ============================================
// Main Component
// ============================================

export interface VisitManageAuditViewProps {
  visitId: string
}

export function VisitManageAuditView({ visitId }: VisitManageAuditViewProps) {
  const router = useRouter()
  const { doctor } = useAuth()

  // Guard: Only Managers and Admins
  const isManagerOrAdmin = useMemo(() => {
    const roles = (doctor?.roles || []).map(String)
    return hasRole(roles, "MANAGER") || hasRole(roles, "ADMIN")
  }, [doctor])

  // Fetch visit details
  const {
    visit,
    loading,
    error,
    refetch,
  } = useVisit(visitId)

  // Fetch all department notes for the visit
  const {
    notes: departmentNotes,
    loading: notesLoading,
    refetch: refetchNotes,
  } = useVisitDepartmentNotes(visitId, null)

  // Invoice preview query and hook
  const { generateInvoice, loading: generatingInvoice } = useGenerateInvoice()
  const { data: visitBillingData } = useQuery(GET_BILL_BY_VISIT_QUERY, {
    variables: { visitId },
    fetchPolicy: "cache-and-network",
    skip: !visitId,
  })

  // Sheets & Panels
  const [previewConsultationAnswerId, setPreviewConsultationAnswerId] = useState<string | null>(null)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const [dischargeConfirmOpen, setDischargeConfirmOpen] = useState(false)

  // Floating Patient/Vitals/History Side Panels
  const [idPanel, setIdPanel] = useState<{ pinned: boolean; hover: boolean }>({
    pinned: false,
    hover: false,
  })
  const [vitalsPanel, setVitalsPanel] = useState<{ pinned: boolean; hover: boolean }>({
    pinned: false,
    hover: false,
  })
  const [historyPanel, setHistoryPanel] = useState<{ pinned: boolean; hover: boolean }>({
    pinned: false,
    hover: false,
  })
  const [patientHistoryOpen, setPatientHistoryOpen] = useState(false)

  const [completeVisitMutation, { loading: discharging }] = useMutation(
    COMPLETE_VISIT_MUTATION,
    {
      onCompleted: (data) => {
        if (data?.completeVisit?.status === "SUCCESS") {
          toast.success("Patient discharged successfully")
          void handleRefresh()
          setDischargeConfirmOpen(false)
        } else {
          toast.error(data?.completeVisit?.message || "Failed to discharge patient")
        }
      },
      onError: (err) => {
        toast.error(err.message || "Failed to discharge patient")
      },
    }
  )

  const handleDischargePatient = async () => {
    if (!visit || discharging) return
    await completeVisitMutation({ variables: { visitId: visit.id } })
  }

  // Active View Mode: "VISIT" for high-level visit lifecycle, or a specific department ID
  const [selectedViewKey, setSelectedViewKey] = useState<string>("VISIT")

  // Search & Filter state for Products Table
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const [productStatusFilter, setProductStatusFilter] = useState<"ALL" | "BILLED" | "PENDING" | "EXEMPTED">("ALL")

  // Handle Refresh
  const handleRefresh = useCallback(async () => {
    await Promise.all([refetch(), refetchNotes()])
  }, [refetch, refetchNotes])

  // Handle Preview Invoice
  const handlePreviewInvoice = useCallback(async () => {
    const billingDepartments = visitBillingData?.visitBilling?.data?.departments || []

    let targetInsuranceBillingId: string | null = null

    if (selectedViewKey !== "VISIT") {
      const deptBilling = billingDepartments.find(
        (b: any) => b.visitDepartment?.id === selectedViewKey
      )
      targetInsuranceBillingId = deptBilling?.insuranceBillings?.[0]?.id || null
    }

    if (!targetInsuranceBillingId) {
      for (const d of billingDepartments) {
        if (d.insuranceBillings && d.insuranceBillings.length > 0) {
          targetInsuranceBillingId = d.insuranceBillings[0].id
          break
        }
      }
    }

    if (!targetInsuranceBillingId) {
      toast.info("No invoice record found yet. This visit has not been billed yet.")
      return
    }

    try {
      const invoiceUrl = await resolveInvoiceUrl(targetInsuranceBillingId, generateInvoice)
      openInvoicePreview(invoiceUrl)
    } catch (err: any) {
      toast.error(err.message || "Failed to generate invoice preview")
    }
  }, [visitBillingData, selectedViewKey, generateInvoice])

  // Calculate Visit Base Timestamps
  const visitAdmissionTime = useMemo(() => {
    if (!visit) return null
    const deptDates = (visit.departments || [])
      .map((d) => parseTimestamp(d.createdAt))
      .filter((d): d is Date => d !== null)

    const visitParsed = parseTimestamp(visit.visitDate)
    if (deptDates.length > 0) {
      deptDates.sort((a, b) => a.getTime() - b.getTime())
      return deptDates[0]
    }
    return visitParsed
  }, [visit])

  const visitCompletionTime = useMemo(() => {
    if (!visit) return null
    if (visit.status !== "COMPLETED" && visit.status !== "FINALISED") return null
    const deptDates = (visit.departments || [])
      .map((d) => parseTimestamp(d.completedAt))
      .filter((d): d is Date => d !== null)
    if (deptDates.length > 0) {
      deptDates.sort((a, b) => b.getTime() - a.getTime())
      return deptDates[0]
    }
    return null
  }, [visit])

  // Flat list of all departments (including child departments)
  const flattenedDepartments = useMemo(() => {
    if (!visit) return []
    const list: Array<{
      dept: VisitDepartment
      isChild: boolean
      parentName?: string
      index: number
    }> = []

    let counter = 1
    const addDept = (d: VisitDepartment, isChild = false, parentName?: string) => {
      list.push({ dept: d, isChild, parentName, index: counter++ })
      ;(d.childVisitDepartments || []).forEach((cd) => addDept(cd, true, d.department?.name))
    }

    ;(visit.departments || []).forEach((d) => addDept(d))
    return list
  }, [visit])

  // Active Selected Department (if not in "VISIT" mode)
  const activeDepartmentMeta = useMemo(() => {
    if (selectedViewKey === "VISIT") return null
    return flattenedDepartments.find((item) => item.dept.id === selectedViewKey) || null
  }, [flattenedDepartments, selectedViewKey])

  // Fallback to "VISIT" if selected department is no longer present in visit
  useEffect(() => {
    if (selectedViewKey !== "VISIT" && flattenedDepartments.length > 0) {
      const exists = flattenedDepartments.some((item) => item.dept.id === selectedViewKey)
      if (!exists) {
        setSelectedViewKey("VISIT")
      }
    }
  }, [flattenedDepartments, selectedViewKey])

  // Filtered Products for Active Department
  const filteredDepartmentProducts = useMemo(() => {
    if (!activeDepartmentMeta) return []
    let list = activeDepartmentMeta.dept.products || []

    if (productStatusFilter !== "ALL") {
      list = list.filter((p) => p.status === productStatusFilter)
    }

    if (productSearchQuery.trim()) {
      const q = productSearchQuery.toLowerCase()
      list = list.filter((p) => {
        const inName = (p.product?.name || "").toLowerCase().includes(q)
        const inCode = (p.product?.code || "").toLowerCase().includes(q)
        const inAdded = getWorkerName(p.addedBy).toLowerCase().includes(q)
        const inBilled = getWorkerName(p.billedBy).toLowerCase().includes(q)
        const inApproved = getWorkerName(p.confirmedBy || p.processor).toLowerCase().includes(q)
        return inName || inCode || inAdded || inBilled || inApproved
      })
    }

    return list
  }, [activeDepartmentMeta, productStatusFilter, productSearchQuery])

  // Department Billing Financial Totals
  const departmentFinancialTotals = useMemo(() => {
    if (!activeDepartmentMeta) {
      return { totalAmount: 0, insuranceAmount: 0, patientAmount: 0, billedCount: 0, pendingCount: 0 }
    }
    const products = activeDepartmentMeta.dept.products || []
    let totalAmount = 0
    let insuranceAmount = 0
    let patientAmount = 0
    let billedCount = 0
    let pendingCount = 0

    products.forEach((prod) => {
      if (prod.status === "BILLED") billedCount++
      if (prod.status === "PENDING") pendingCount++

      const summary = resolveProductBillingSummary(prod, activeDepartmentMeta.dept, visit?.linkedInsurances)
      totalAmount += summary.lineTotal
      insuranceAmount += summary.insuranceAmount
      patientAmount += summary.patientAmount
    })

    return {
      totalAmount,
      insuranceAmount,
      patientAmount,
      billedCount,
      pendingCount,
    }
  }, [activeDepartmentMeta, visit?.linkedInsurances])

  // Applied Insurances for Active Department
  const activeDepartmentAppliedInsurances = useMemo(() => {
    if (!activeDepartmentMeta) return []
    return getDepartmentAppliedInsurances(activeDepartmentMeta.dept, visit?.linkedInsurances)
  }, [activeDepartmentMeta, visit?.linkedInsurances])


  // If user is not Manager or Admin
  if (!isManagerOrAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Header doctor={doctor} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Manager Access Restricted
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              The detailed Visit Audit and Monitoring view is reserved for Clinic Managers and Administrators.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // Loading State
  if (loading && !visit) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Header doctor={doctor} />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </main>
      </div>
    )
  }

  // Error / Not Found State
  if (error || !visit) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Header doctor={doctor} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Visit Not Found
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {error || "Could not retrieve the requested visit record. It may have been deleted or the ID is invalid."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                onClick={() => void handleRefresh()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const patient = visit.patient
  const patientFullName = [patient?.firstName, patient?.middleName, patient?.lastName]
    .filter(Boolean)
    .join(" ") || "Unknown Patient"

  const primaryInsurance = (visit.linkedInsurances || [])[0]
  const consultationDeptWithAnswer = (visit.departments || []).find((d) => d.answerId)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100">
      <Header doctor={doctor} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Navigation & Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Manager Portal
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Visit &amp; Department Audit Monitor
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                {patientFullName}
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                  ({patient?.patientIdentifier || "No ID"})
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* View / Department Selector Dropdown in Top Bar */}
            <div className="w-full sm:w-auto min-w-[240px]">
              <Select value={selectedViewKey} onValueChange={setSelectedViewKey}>
                <SelectTrigger className="h-9 rounded-xl bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-indigo-500/20">
                  <SelectValue placeholder="Select View / Department" />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-80">
                  <SelectItem value="VISIT" className="text-xs font-semibold py-2">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <span>Visit View (Overview)</span>
                      <span className="text-[10px] text-slate-400 ml-auto font-normal">
                        {flattenedDepartments.length} depts
                      </span>
                    </div>
                  </SelectItem>
                  {flattenedDepartments.map(({ dept, isChild, parentName, index }) => (
                    <SelectItem key={dept.id} value={dept.id} className="text-xs py-2">
                      <div className="flex items-center gap-2 w-full">
                        {isChild ? (
                          <CornerDownRight className="w-3.5 h-3.5 text-slate-400 ml-2 flex-shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                            {index}
                          </span>
                        )}
                        <span className="font-medium truncate">
                          {dept.department?.name || "Department"}
                          {isChild && parentName ? ` (${parentName})` : ""}
                        </span>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ml-auto flex-shrink-0 ${
                            dept.status === "COMPLETED" || dept.status === "FINALISED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {dept.status}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => void handlePreviewInvoice()}
              disabled={generatingInvoice}
              className="h-9 rounded-xl shadow-sm text-xs bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 font-medium text-slate-800 dark:text-slate-200"
              title="Preview Invoice"
            >
              {generatingInvoice ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-purple-600 dark:text-purple-400" />
              ) : (
                <ReceiptText className="w-3.5 h-3.5 mr-1.5 text-purple-600 dark:text-purple-400" />
              )}
              Preview Invoice
            </Button>

            {canDischargeVisit(visit) && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setDischargeConfirmOpen(true)}
                disabled={discharging}
                className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm text-xs font-semibold"
              >
                {discharging ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                )}
                Discharge Patient
              </Button>
            )}

            {consultationDeptWithAnswer?.answerId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewConsultationAnswerId(consultationDeptWithAnswer.answerId || null)}
                className="h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5 text-slate-600 dark:text-slate-400" />
                View Consultation
              </Button>
            )}

            <Button
              variant="default"
              size="sm"
              onClick={() => setShowSettingsPanel(true)}
              className="h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm text-xs"
            >
              <Settings className="w-3.5 h-3.5 mr-1.5" />
              Visit Actions
            </Button>
          </div>
        </div>



        {/* ========================================================================= */}
        {/* VIEW 1: VISIT VIEW (Lifecycle, Department Progression Flow & Timings)      */}
        {/* ========================================================================= */}
        {selectedViewKey === "VISIT" && (
          <div className="space-y-6">
            {/* Visit Progression Stepper / Timeline */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Visit Encounter Lifecycle &amp; Department Flow
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Chronological progression of when this visit was created, when each department was added, their completion status, and processors.
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  Total Departments: <span className="font-bold text-slate-900 dark:text-white">{flattenedDepartments.length}</span>
                </div>
              </div>

              {/* Vertical Progression Stepper */}
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {/* 1. Visit Creation Node */}
                <div className="relative group">
                  <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border bg-emerald-50 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-800 flex items-center justify-center -translate-x-1/2 text-emerald-600 dark:text-emerald-400">
                    <CalendarClock className="w-3.5 h-3.5" />
                  </div>

                  <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          Visit Created
                        </span>
                        <Badge variant="default" className="text-[10px]">
                          Created
                        </Badge>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {formatFullDateTime(visitAdmissionTime)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Created by:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          Reception Desk
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Scheduled Date:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {visit.visitDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Department Nodes */}
                {flattenedDepartments.map(({ dept, isChild, parentName, index }) => {
                  const deptCreated = parseTimestamp(dept.createdAt)
                  const deptStarted = parseTimestamp(dept.startedAt)
                  const deptCompleted = parseTimestamp(dept.completedAt)
                  const isOngoing = !deptCompleted && dept.status !== "COMPLETED" && dept.status !== "FINALISED"
                  const totalDurationStr = formatDuration(deptCreated, deptCompleted)
                  const queueWaitStr = deptStarted
                    ? formatDuration(deptCreated, deptStarted)
                    : isOngoing
                    ? `${formatDuration(deptCreated, new Date())} (waiting)`
                    : "—"
                  const consultDurationStr = deptStarted
                    ? formatDuration(deptStarted, deptCompleted)
                    : "—"
                  const addedByName = dept.addedBy ? getWorkerName(dept.addedBy) : null
                  const processorNames = (dept.processors || []).map(getWorkerName).join(", ")
                  const prodsCount = dept.products?.length || 0
                  const medsCount = dept.medications?.length || 0
                  const diagCount = dept.diagnostics?.length || 0

                  return (
                    <div key={dept.id} className="relative group">
                      <div
                        className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center -translate-x-1/2 text-xs font-bold ${
                          dept.status === "COMPLETED" || dept.status === "FINALISED"
                            ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                            : isOngoing
                            ? "bg-amber-50 border-amber-300 dark:bg-amber-950 dark:border-amber-800 text-amber-600 dark:text-amber-400 animate-pulse"
                            : "bg-slate-100 border-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {index}
                      </div>

                      <div className="bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition-all border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Building2 className="w-4 h-4 text-purple-500" />
                              {dept.department?.name || "Department"}
                            </span>
                            {isChild && (
                              <Badge variant="secondary" className="text-[10px]">
                                Sub-Department of {parentName}
                              </Badge>
                            )}
                            <Badge
                              variant={
                                dept.status === "COMPLETED" || dept.status === "FINALISED"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-[10px]"
                            >
                              {dept.status}
                            </Badge>
                            <span className="text-xs text-slate-400 font-medium">
                              ({dept.encounterType})
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-slate-500">Wait:</span>
                              <span className="font-semibold text-amber-600 dark:text-amber-400">{queueWaitStr}</span>
                            </div>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <div className="flex items-center gap-1">
                              <span className="text-slate-500">Consult:</span>
                              <span className="font-semibold text-blue-600 dark:text-blue-400">{consultDurationStr}</span>
                            </div>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <div className="flex items-center gap-1">
                              <span className="text-slate-500">Total:</span>
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                {totalDurationStr}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Timings & Routing Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Department Added</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                              {formatFullDateTime(deptCreated)}
                            </span>
                            <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                              By: {addedByName || "Staff / System"}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultation Started</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                              {deptStarted ? formatFullDateTime(deptStarted) : "Awaiting Consultation"}
                            </span>
                            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium block mt-0.5">
                              {deptStarted ? `Wait in Queue: ${queueWaitStr}` : "Waiting in queue"}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              {deptCompleted ? "Completed / Finalised" : "Status & Time"}
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                              {deptCompleted ? formatFullDateTime(deptCompleted) : (deptStarted ? "Consultation In Progress" : "Queued in clinic")}
                            </span>
                            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium block mt-0.5 truncate">
                              {deptCompleted
                                ? `Completed By: ${dept.completedBy ? getWorkerName(dept.completedBy) : "Staff / System"}`
                                : (deptStarted ? `Consulting: ${formatDuration(deptStarted, new Date())}` : "Not yet started")}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Processors</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
                              {processorNames || "Unassigned"}
                            </span>
                            <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                              {(dept.processors || []).length} assigned clinician(s)
                            </span>
                          </div>
                        </div>

                        {/* Department Items Summary & Drill Down Action */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium">
                              {prodsCount} Products/Acts
                            </span>
                            {medsCount > 0 && (
                              <span className="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-medium">
                                {medsCount} Prescriptions
                              </span>
                            )}
                            {diagCount > 0 && (
                              <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-medium">
                                {diagCount} Diagnoses
                              </span>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedViewKey(dept.id)}
                            className="h-8 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 self-start sm:self-auto"
                          >
                            Inspect Department Details &amp; Products
                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* 3. Visit Conclusion Node */}
                <div className="relative group">
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center -translate-x-1/2 ${
                      visitCompletionTime
                        ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-50 border-amber-300 dark:bg-amber-950 dark:border-amber-800 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>

                  <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {visitCompletionTime ? "Visit Completed & Encounter Finalised" : "Visit Ongoing in Clinic"}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {visitCompletionTime ? formatFullDateTime(visitCompletionTime) : "Active Stay"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {visitCompletionTime
                        ? `Total patient encounter duration: ${formatDuration(visitAdmissionTime, visitCompletionTime)}`
                        : "Patient is still undergoing treatment or awaiting discharge across departments"}
                    </p>
                    {canDischargeVisit(visit) && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/80 mt-2">
                        <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                          All departments are complete. Patient is ready for discharge.
                        </span>
                        <Button
                          size="sm"
                          onClick={() => setDischargeConfirmOpen(true)}
                          disabled={discharging}
                          className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm"
                        >
                          {discharging ? (
                            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          )}
                          Discharge Patient
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: DEPARTMENT VIEW (Direct Products & Acceptances Table View)        */}
        {/* ========================================================================= */}
        {selectedViewKey !== "VISIT" && activeDepartmentMeta && (
          <div className="space-y-5">
            {/* Department Summary Header Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {activeDepartmentMeta.dept.department?.name || "Department"}
                      </h3>
                      <Badge
                        variant={
                          activeDepartmentMeta.dept.status === "COMPLETED" || activeDepartmentMeta.dept.status === "FINALISED"
                            ? "default"
                            : "secondary"
                        }
                        className="text-[11px]"
                      >
                        {activeDepartmentMeta.dept.status}
                      </Badge>
                      {activeDepartmentMeta.isChild && (
                        <Badge variant="outline" className="text-[10px]">
                          Sub-Dept of {activeDepartmentMeta.parentName}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Encounter Type: {activeDepartmentMeta.dept.encounterType} • Profile: {activeDepartmentMeta.dept.profile?.name || "Default"}
                    </p>
                  </div>
                </div>

                {/* Right side: Applied Insurance Badges + Financial Overview Chips */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Applied Insurance Badges with Hover Details */}
                  {activeDepartmentAppliedInsurances.length > 0 && (
                    <TooltipProvider delayDuration={150}>
                      <div className="flex items-center gap-1.5 flex-wrap mr-1">
                        {activeDepartmentAppliedInsurances.map((applied, idx) => {
                          const ins = applied.patientInsurance
                          return (
                            <Tooltip key={ins.id || idx}>
                              <TooltipTrigger asChild>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100/80 dark:bg-purple-950/40 dark:hover:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 cursor-pointer transition-colors shadow-xs">
                                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                  <span className="font-bold text-xs">{applied.displayName}</span>
                                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950 px-1 py-0.2 rounded">
                                    {applied.coveragePct}%
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" align="end" className="p-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl space-y-2 min-w-[220px]">
                                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                                  <div className="flex items-center gap-1.5 font-bold text-xs text-purple-700 dark:text-purple-300">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>{ins.insuranceProvider?.insuranceName || applied.displayName}</span>
                                  </div>
                                  {applied.isPolicyActive ? (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-300">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Card No:</span>
                                    <span className="font-mono font-semibold">{ins.insuranceCardNumber || "—"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Coverage:</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{applied.coveragePct}% (Co-pay {applied.patientSharePct}%)</span>
                                  </div>
                                  {ins.providingCompanyOrEmployer && (
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Employer:</span>
                                      <span className="font-medium truncate max-w-[130px]">{ins.providingCompanyOrEmployer}</span>
                                    </div>
                                  )}
                                  {ins.principalMemberName && !ins.principalMember && (
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Principal:</span>
                                      <span className="font-medium truncate max-w-[130px]">{ins.principalMemberName}</span>
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    </TooltipProvider>
                  )}

                  {/* Financial Overview Chips */}
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Billed</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatRWF(departmentFinancialTotals.totalAmount)}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Insurer Pay</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {formatRWF(departmentFinancialTotals.insuranceAmount)}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Pay</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {formatRWF(departmentFinancialTotals.patientAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Meta Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Intake &amp; Queue Entry</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    Added: {formatFullDateTime(parseTimestamp(activeDepartmentMeta.dept.createdAt))}
                  </p>
                  <p className="text-slate-500 text-[11px] truncate">
                    By: {activeDepartmentMeta.dept.addedBy ? getWorkerName(activeDepartmentMeta.dept.addedBy) : "Staff / System"}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Consultation Started</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {activeDepartmentMeta.dept.startedAt
                      ? `Started: ${formatFullDateTime(parseTimestamp(activeDepartmentMeta.dept.startedAt))}`
                      : "Awaiting Consultation"}
                  </p>
                  <p className="text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                    {activeDepartmentMeta.dept.startedAt
                      ? `Queue Wait: ${formatDuration(parseTimestamp(activeDepartmentMeta.dept.createdAt), parseTimestamp(activeDepartmentMeta.dept.startedAt))}`
                      : "Waiting in department queue"}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Completion &amp; Durations</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {activeDepartmentMeta.dept.completedAt
                      ? `Ended: ${formatFullDateTime(parseTimestamp(activeDepartmentMeta.dept.completedAt))}`
                      : (activeDepartmentMeta.dept.startedAt ? "Consultation In Progress" : "Queued in clinic")}
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400 font-medium text-[11px] truncate">
                    {activeDepartmentMeta.dept.completedAt
                      ? `By: ${activeDepartmentMeta.dept.completedBy ? getWorkerName(activeDepartmentMeta.dept.completedBy) : "Staff / Clinician"}`
                      : (activeDepartmentMeta.dept.startedAt
                          ? `Consult: ${formatDuration(parseTimestamp(activeDepartmentMeta.dept.startedAt), parseTimestamp(activeDepartmentMeta.dept.completedAt))}`
                          : "—")}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Processors &amp; Items</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                    {(activeDepartmentMeta.dept.processors || []).map(getWorkerName).join(", ") || "Unassigned"}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    {activeDepartmentMeta.dept.products?.length || 0} Acts • {activeDepartmentMeta.dept.medications?.length || 0} Meds • {activeDepartmentMeta.dept.diagnostics?.length || 0} Diags
                  </p>
                </div>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* PRIMARY SECTION: PRODUCTS & ACCEPTANCES TABLE (Full Financial Audit) */}
            {/* ===================================================================== */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Products, Medical Acts &amp; Consumables ({activeDepartmentMeta.dept.products?.length || 0})
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Itemised billing prices, insurance coverage percentage, patient vs insurer share, and clinician/billing attributions.
                  </p>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Filter items or staff..."
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      className="pl-8 h-8 text-xs rounded-lg"
                    />
                  </div>

                  <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-xs">
                    {(
                      [
                        { id: "ALL", label: "All" },
                        { id: "BILLED", label: `Billed (${departmentFinancialTotals.billedCount})` },
                        { id: "PENDING", label: `Pending (${departmentFinancialTotals.pendingCount})` },
                      ] as const
                    ).map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setProductStatusFilter(st.id)}
                        className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
                          productStatusFilter === st.id
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {filteredDepartmentProducts.length === 0 ? (
                <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="font-medium text-xs">No products or medical acts match the active filter in this department.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3 font-semibold">Item &amp; Code</th>
                        <th className="p-3 font-semibold text-center">Qty &amp; Unit Price</th>
                        <th className="p-3 font-semibold text-right">Billing Total</th>
                        <th className="p-3 font-semibold">Insurance Used &amp; Coverage %</th>
                        <th className="p-3 font-semibold">Status &amp; Approval</th>
                        <th className="p-3 font-semibold">Prescribed By &amp; Time</th>
                        <th className="p-3 font-semibold">Billed By &amp; Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {filteredDepartmentProducts.map((p) => {
                        const isAddedByProcessor = Boolean(
                          p.addedBy &&
                            (activeDepartmentMeta.dept.processors || []).some(
                              (proc) => proc.id === p.addedBy?.id
                            )
                        )
                        const addedByName = getWorkerName(p.addedBy)
                        const billedByName = p.billedBy ? getWorkerName(p.billedBy) : null
                        const confirmedByName = p.confirmedBy ? getWorkerName(p.confirmedBy) : null
                        const processorName = p.processor ? getWorkerName(p.processor) : null
                        const approvedByName = confirmedByName || processorName
                        const isBilled = p.status === "BILLED"
                        const addTime = parseTimestamp(p.createdAt)
                        const billingTime = isBilled ? parseTimestamp(p.updatedAt || p.createdAt) : null

                        // Financial & Insurance breakdown
                        const billingSummary = resolveProductBillingSummary(
                          p,
                          activeDepartmentMeta.dept,
                          visit.linkedInsurances
                        )

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                            {/* 1. Item & Code */}
                            <td className="p-3 font-medium text-slate-900 dark:text-white">
                              <div>
                                <span className="font-semibold">{p.product?.name}</span>
                                {p.product?.code && (
                                  <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                                    ({p.product.code})
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                <span>{p.product?.type || "Product"}</span>
                                {p.product?.unit && <span>• {p.product.unit}</span>}
                                {p.source && p.source !== "USER" && (
                                  <Badge variant="outline" className="text-[9px] px-1 py-0 border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                    {p.source}
                                  </Badge>
                                )}
                              </div>
                            </td>

                            {/* 2. Qty & Unit Price */}
                            <td className="p-3 text-center">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">{p.quantity}</span>
                              <span className="text-[11px] text-slate-500 block">
                                @ {formatRWF(billingSummary.unitPrice)}
                              </span>
                            </td>

                            {/* 3. Billing Total Price */}
                            <td className="p-3 text-right">
                              <span className="font-bold text-slate-900 dark:text-white text-sm block">
                                {formatRWF(billingSummary.lineTotal)}
                              </span>
                              {p.status === "EXEMPTED" ? (
                                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block">
                                  100% Exempted
                                </span>
                              ) : billingSummary.isInsured ? (
                                <span className="text-[10px] text-slate-500 block font-medium">
                                  Pt: {formatRWF(billingSummary.patientAmount)}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 block">
                                  Cash Line
                                </span>
                              )}
                            </td>

                            {/* 4. Insurance Used & Coverage Percentage */}
                            <td className="p-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <Badge
                                    variant={billingSummary.isInsured ? "default" : "secondary"}
                                    className={`text-[10px] font-semibold px-2 py-0 ${
                                      billingSummary.isInsured
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    }`}
                                  >
                                    {billingSummary.insuranceName}
                                  </Badge>

                                  {billingSummary.isInsured && (
                                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                                      {billingSummary.coveragePct}% Covered
                                    </span>
                                  )}
                                </div>

                                {billingSummary.isInsured ? (
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 space-x-1 font-mono">
                                    <span>Insurer: <strong className="text-purple-700 dark:text-purple-300">{formatRWF(billingSummary.insuranceAmount)}</strong></span>
                                    <span>•</span>
                                    <span>Patient: <strong className="text-slate-700 dark:text-slate-300">{formatRWF(billingSummary.patientAmount)} ({billingSummary.patientSharePct}%)</strong></span>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-slate-400 block">
                                    0% Insurance • 100% Patient Pay
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 5. Status & Approval */}
                            <td className="p-3">
                              <div className="space-y-1">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                                    p.status === "BILLED"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                                      : p.status === "PENDING"
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                                      : p.status === "EXEMPTED"
                                      ? "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
                                      : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                                  }`}
                                >
                                  {p.status}
                                </span>

                                {!isAddedByProcessor ? (
                                  <div className="text-[10px]">
                                    {approvedByName ? (
                                      <span className="text-emerald-700 dark:text-emerald-400 font-medium block">
                                        Approved: {approvedByName}
                                      </span>
                                    ) : (
                                      <span className="text-amber-600 dark:text-amber-400 font-medium block">
                                        Awaiting Approval
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-slate-400 block italic">
                                    Treating Processor
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 6. Prescribed / Added By & Time */}
                            <td className="p-3">
                              <div className="space-y-0.5">
                                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span>{addedByName}</span>
                                  {!isAddedByProcessor && (
                                    <Badge
                                      variant="outline"
                                      className="text-[9px] px-1 py-0 border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                                    >
                                      Outside Dept
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-500 font-mono block">
                                  {formatFullDateTime(addTime)}
                                </span>
                              </div>
                            </td>

                            {/* 7. Billed By & Time */}
                            <td className="p-3">
                              <div className="space-y-0.5">
                                {billedByName ? (
                                  <>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                                      {billedByName}
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-mono block">
                                      {formatFullDateTime(billingTime)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">Not yet billed</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Prescriptions & Diagnoses in this Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prescriptions */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Pill className="w-4 h-4 text-sky-500" />
                  Prescriptions &amp; Medications ({activeDepartmentMeta.dept.medications?.length || 0})
                </h4>
                {(activeDepartmentMeta.dept.medications || []).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No prescriptions recorded in this department.</p>
                ) : (
                  <div className="space-y-2">
                    {activeDepartmentMeta.dept.medications?.map((med) => (
                      <div key={med.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs">
                        <p className="font-bold text-slate-900 dark:text-white">{med.medicationName}</p>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5">{med.instructions || "As directed"}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">
                          Prescribed: {formatFullDateTime(parseTimestamp(med.createdAt))}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Diagnoses */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-purple-500" />
                  Diagnoses &amp; ICD-11 ({activeDepartmentMeta.dept.diagnostics?.length || 0})
                </h4>
                {(activeDepartmentMeta.dept.diagnostics || []).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No diagnoses entered in this department.</p>
                ) : (
                  <div className="space-y-2">
                    {activeDepartmentMeta.dept.diagnostics?.map((diag) => (
                      <div key={diag.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs">
                        <p className="font-bold text-slate-900 dark:text-white">{diag.diagnosisName}</p>
                        {diag.icd11Code && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 inline-block mt-1">
                            ICD-11: {diag.icd11Code}
                          </span>
                        )}
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">
                          Logged: {formatFullDateTime(parseTimestamp(diag.createdAt))}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Preview Consultation Sheet */}
      {previewConsultationAnswerId && (
        <ConsultationPreviewSheet
          open={Boolean(previewConsultationAnswerId)}
          onOpenChange={(open) => {
            if (!open) setPreviewConsultationAnswerId(null)
          }}
          answerId={previewConsultationAnswerId}
          patientName={patientFullName}
        />
      )}

      {/* Visit Settings Panel */}
      {showSettingsPanel && (
        <VisitSettingsPanel
          open={showSettingsPanel}
          onOpenChange={setShowSettingsPanel}
          visit={visit}
          onVisitUpdated={() => {
            void handleRefresh()
          }}
        />
      )}

      {/* Floating Department Notes Button (Accessible to Managers & Admins with All Notes) */}
      {(visit.departments?.length ?? 0) > 0 && (
        <DepartmentNotesFloating
          visitId={visit.id}
          visitDepartments={visit.departments ?? []}
          noteTypes={["PUBLIC", "CONSULTATION", "BILLING", "FORMS", "ADMIN"]}
          allowedDisplayTypes={["PUBLIC", "CONSULTATION", "BILLING", "FORMS", "ADMIN"]}
        />
      )}

      {/* Floating Side Panels (Identification, Vitals, History) */}
      <ConsultationSidePanels
        patient={(visit.patient || {}) as any}
        vitals={visit?.vitalSigns || []}
        visitInsurances={visit?.linkedInsurances || visit?.patient?.patientInsurances || []}
        idPanel={idPanel}
        vitalsPanel={vitalsPanel}
        historyPanel={historyPanel}
        setIdPanel={setIdPanel}
        setVitalsPanel={setVitalsPanel}
        setHistoryPanel={setHistoryPanel}
        onOpenHistory={() => setPatientHistoryOpen(true)}
      />

      {/* Patient History Side Pane */}
      {patientHistoryOpen && patient?.id && (
        <PatientHistorySidePane
          patientId={patient.id}
          currentVisitId={visit.id}
          currentVisitDepartmentId={activeDepartmentMeta?.dept?.id || null}
          onPreviewDepartmentAnswers={({ answerId }) => {
            if (answerId) setPreviewConsultationAnswerId(answerId)
          }}
          onClose={() => setPatientHistoryOpen(false)}
        />
      )}

      {/* Discharge Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={dischargeConfirmOpen}
        onOpenChange={(open) => {
          if (!open && !discharging) setDischargeConfirmOpen(false)
        }}
        title="Discharge patient?"
        entityName={patientFullName}
        extraWarning="This will mark the patient visit as completed and finalized across all departments."
        confirmLabel="Discharge Patient"
        busy={discharging}
        onConfirm={handleDischargePatient}
      />
    </div>
  )
}
