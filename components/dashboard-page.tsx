"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useVisits, useDepartments, type Visit, useUpdateVisitDepartmentStatus, useDashboardStats, useGetInvoiceLazy } from "@/hooks/auth-hooks"
import { useLazyQuery } from "@apollo/client"
import { GET_BILL_BY_VISIT_QUERY } from "@/hooks/queries"
import Header from "@/components/header"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardMobileUi } from "@/components/dashboard/dashboard-mobile-ui"
import { ConsultationPreviewSheet } from "@/components/dashboard/consultation-preview-sheet"
import PatientHistorySidePane from "@/components/patient-history-side-pane"
import PatientRegistrationModal from "@/components/patient-registration-modal"
import VisitCreationModal from "@/components/visit-creation-modal"
import { AddDepartmentModal } from "@/components/add-department-modal"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import InlineTryAgain from "@/components/inline-try-again"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Search, Calendar, Clock, CheckCircle, AlertCircle, UserPlus, Stethoscope, User, ReceiptText, Plus, List, LayoutGrid, Printer, FilePenLine, Activity, Eye, History } from "lucide-react"
import { toast } from "react-toastify"
import { hasRole } from "@/lib/role-utils"

export default function DashboardPage() {
  const router = useRouter()
  const { doctor } = useAuth()
  const { visits, loading, error, refetch: refetchVisits } = useVisits()
  const [isMounted, setIsMounted] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [showMetrics, setShowMetrics] = useState(true)

  const { stats: dashboardStats, loading: dashboardStatsLoading } = useDashboardStats(1, {
    skip: !isMounted || !showMetrics,
  })

  const { updateDepartmentStatus } = useUpdateVisitDepartmentStatus()
  const { getInvoice } = useGetInvoiceLazy()
  const [getVisitBillings] = useLazyQuery(GET_BILL_BY_VISIT_QUERY)
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

  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const userDepartments = ((doctor as unknown as { departments?: Array<{ id: string; name?: string }> } | null)?.departments || []) as Array<{ id: string; name?: string }>
  const legacyUserDepartment = (doctor as unknown as { department?: { id: string; name: string } } | null)?.department
  const userDepartmentIds = userDepartments.length > 0
    ? userDepartments.map((dept) => String(dept.id || '')).filter(Boolean)
    : legacyUserDepartment?.id
      ? [String(legacyUserDepartment.id)]
      : []
  const hasReceptionistRole = roles.includes("RECEPTIONIST") || roles.includes("RECEPTION")
  const hasFinanceRole = roles.includes("FINANCE")
  const isReceptionistOnly = hasReceptionistRole && roles.length === 1
  const hasNurseRole = roles.includes("NURSE")
  const hasConsultationRole = roles.some((role) => ["DOCTOR", "OPHTHALMOLOGIST", "SPECIALIST", "ADMIN"].includes(role))
  const hasClinicianOrDoctorRole = roles.some((role) => ["CLINICIAN", "DOCTOR"].includes(role))
  const canViewPatientHistory = hasRole(roles, "CLINICIAN")
  const canSeeBillingInfo = hasFinanceRole
  const canSeeConsultButton = !isReceptionistOnly
  // Bill button: Finance role always sees billing, regardless of other roles
  const canSeeBillButton = hasFinanceRole
  // Add Department: only Receptionists can route a patient to a new department
  const canSeeAddDepartment = hasReceptionistRole
  const canSeeRegisterAndCreate = hasReceptionistRole
  const canSeeVisitActionButtons = !isReceptionistOnly

  // Feature toggle to hide/show Discharge actions globally
  const ENABLE_DISCHARGE = false

  // Modal states
  const [showPatientRegistrationModal, setShowPatientRegistrationModal] = useState(false)
  const [showVisitCreationModal, setShowVisitCreationModal] = useState(false)
  const [registeredPatientId, setRegisteredPatientId] = useState<string | null>(null)
  const [locallyCreatedVisits, setLocallyCreatedVisits] = useState<Visit[]>([])
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false)
  const [selectedVisitForDepartment, setSelectedVisitForDepartment] = useState<Visit | null>(null)
  const [previewConsultationOpen, setPreviewConsultationOpen] = useState(false)
  const [previewConsultationContext, setPreviewConsultationContext] = useState<{
    consultationId: string
    departmentId: string
    departmentName: string
    patientName: string
    previewStartedAt: number
  } | null>(null)
  const [patientHistoryOpen, setPatientHistoryOpen] = useState(false)
  const [patientHistoryVisit, setPatientHistoryVisit] = useState<Visit | null>(null)

  const getSavedConsultationPreviewContext = (consultationId: string) => {
    if (typeof window === 'undefined') return null

    const prefix = `consultation_form_context:${consultationId}:`
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index)
      if (!key || !key.startsWith(prefix)) continue

      try {
        const raw = window.localStorage.getItem(key)
        if (!raw) continue

        const parsed = JSON.parse(raw)
        const resolvedVisitDepartmentId = String(parsed?.visitDepartmentId || parsed?.departmentId || '')
        if (parsed?.consultationId === consultationId && resolvedVisitDepartmentId) {
          return {
            ...parsed,
            departmentId: resolvedVisitDepartmentId,
            visitDepartmentId: resolvedVisitDepartmentId,
          } as { consultationId?: string; departmentId?: string; visitDepartmentId?: string; departmentName?: string; patientName?: string; formId?: string; formVersion?: string; form?: unknown }
        }
      } catch {
        // Ignore malformed saved preview context and fall back to visit-based resolution.
      }
    }

    return null
  }

  const openVisitCreationModal = () => {
    setRegisteredPatientId(null)
    setShowVisitCreationModal(true)
  }

  const closeVisitCreationModal = () => {
    setShowVisitCreationModal(false)
    setRegisteredPatientId(null)
  }

  function hasUnbilledItems(visit: Visit) {
    if (visit.billingStatus === 'BILLED') return false

    return visit.departments?.some((dept) =>
      dept.actions?.some((action) => action.paymentStatus === 'PENDING') ||
      dept.consumables?.some((consumable) => consumable.paymentStatus === 'PENDING')
    ) || false
  }

  const hasNoBillables = (visit: Visit) => {
    return !(visit.departments || []).some((dept) =>
      (dept.actions && dept.actions.length > 0) || (dept.consumables && dept.consumables.length > 0),
    )
  }

  const getBillingDisplayStatus = (visit: Visit) => {
    return hasNoBillables(visit) ? "0 to bill" : visit.billingStatus
  }

  const hasIncompleteDepartments = (visit: Visit) => {
    return (visit.departments || []).some((dept) => dept.status !== 'COMPLETED' && dept.status !== 'CANCELLED')
  }

  const canDischargeVisit = (visit: Visit) => {
    if (visit.visitStatus === 'COMPLETED' || visit.visitStatus === 'CANCELLED') return false
    if (hasIncompleteDepartments(visit)) return false
    return !hasUnbilledItems(visit) || hasNoBillables(visit)
  }

  const isDischarged = (visit: Visit) => visit.visitStatus === 'COMPLETED' && !hasUnbilledItems(visit)

  const isVisitDepartmentBillingOrCompleted = (visit: Visit, departmentStatus: string) => {
    const normalizedDepartmentStatus = String(departmentStatus || '').toUpperCase()
    const normalizedVisitBillingStatus = String(visit.billingStatus || '').toUpperCase()
    return (
      normalizedDepartmentStatus === 'COMPLETED'
      || normalizedDepartmentStatus === 'BILLING'
      || normalizedVisitBillingStatus === 'BILLED'
      || normalizedVisitBillingStatus === 'BILLING'
    )
  }

  const getMatchingUserDepartment = (visit: Visit, options?: { mustBeClosed?: boolean }) => {
    const mustBeClosed = Boolean(options?.mustBeClosed)
    const matchingDepartments = (visit.departments || []).filter((dept) =>
      userDepartmentIds.includes(String(dept.department?.id || dept.id || '')),
    )

    if (matchingDepartments.length === 0) return null

    if (mustBeClosed) {
      return matchingDepartments.find((dept) => isVisitDepartmentBillingOrCompleted(visit, dept.status)) || null
    }

    return matchingDepartments.find((dept) => {
      const normalizedDepartmentStatus = String(dept.status || '').toUpperCase()
      const normalizedVisitBillingStatus = String(visit.billingStatus || '').toUpperCase()

      if (normalizedDepartmentStatus === 'COMPLETED' || normalizedDepartmentStatus === 'CANCELLED' || normalizedDepartmentStatus === 'BILLING') {
        return false
      }

      if (normalizedVisitBillingStatus === 'BILLED' || normalizedVisitBillingStatus === 'BILLING') {
        return false
      }

      return true
    }) || null
  }

  const canConsultVisit = (visit: Visit) => {
    // Check if user has CLINICIAN or DOCTOR role
    if (!hasClinicianOrDoctorRole) return false
    
    // Check if user has at least one department assigned
    if (userDepartmentIds.length === 0) return false
    
    // Check if visit has departments
    if (!visit.departments || visit.departments.length === 0) return false
    
    // Eligible when any visit department matches a user's department and is not completed/cancelled.
    const matchingDepartment = getMatchingUserDepartment(visit, { mustBeClosed: false })
    const match = Boolean(matchingDepartment)
    if (process.env.NODE_ENV !== 'production') {
      try {
        // eslint-disable-next-line no-console
        console.debug('DashboardPage canConsultVisit:', {
          hasClinicianOrDoctorRole,
          userDepartmentIds,
          matchingDepartment: matchingDepartment
            ? { id: matchingDepartment.department?.id, name: matchingDepartment.department?.name, status: matchingDepartment.status }
            : null,
          match,
        })
      } catch (e) {
        // ignore
      }
    }

    return match
  }

  const handlePreviewConsultation = (visit: Visit) => {
    const previewStartedAt = Date.now()
    const savedPreviewContext = getSavedConsultationPreviewContext(visit.id)
    const matchedClosedDepartment = getMatchingUserDepartment(visit, { mustBeClosed: true })
    const departmentId = String(savedPreviewContext?.visitDepartmentId || savedPreviewContext?.departmentId || matchedClosedDepartment?.department?.id || matchedClosedDepartment?.id || '')

    if (!departmentId) {
      toast.error('No completed or billed department found for consultation preview.')
      return
    }

    const departmentName = savedPreviewContext?.departmentName || matchedClosedDepartment?.department?.name || 'Department'

    console.log('[ConsultationPreview] clicked', {
      consultationId: visit.id,
      departmentId,
      visitDepartmentId: savedPreviewContext?.visitDepartmentId || null,
      usedSavedContext: Boolean(savedPreviewContext?.departmentId),
      previewStartedAt,
    })

    setPreviewConsultationContext({
      consultationId: visit.id,
      departmentId,
      departmentName,
      patientName: `${visit.patient.firstName} ${visit.patient.lastName}`.trim(),
      previewStartedAt,
    })
    setPreviewConsultationOpen(true)
  }

  const formatDepartmentTime = (time?: string) => {
    if (!time) return "-"
    return new Date(time).toLocaleString()
  }

  const getTriageDuration = (visit: Visit) => {
    const startedAt = new Date(visit.visitDate).getTime()
    if (Number.isNaN(startedAt)) return 'Triage'

    const elapsedMs = Math.max(Date.now() - startedAt, 0)
    const totalMinutes = Math.floor(elapsedMs / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours <= 0) {
      return `Triage • ${minutes}m`
    }

    return `Triage • ${hours}h ${minutes}m`
  }

  const allVisits = useMemo(() => {
    const serverVisitIds = new Set(visits.map((visit) => visit.id))
    let filtered = [
      ...locallyCreatedVisits.filter((visit) => !serverVisitIds.has(visit.id)),
      ...visits,
    ]

    if (searchQuery) {
      filtered = filtered.filter(visit =>
        `${visit.patient.firstName} ${visit.patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter === "BILLING") {
      filtered = filtered.filter((visit) => hasUnbilledItems(visit))
    } else if (statusFilter !== "all") {
      filtered = filtered.filter(visit => visit.visitStatus === statusFilter)
    }

    return filtered
  }, [visits, locallyCreatedVisits, searchQuery, statusFilter])

  const handleConsultVisit = async (visit: Visit) => {
    // Mark first department as ACTIVE before navigating to consultation
    try {
      const firstVisitDeptId = visit.departments?.[0]?.id
      if (firstVisitDeptId) {
        await updateDepartmentStatus(firstVisitDeptId, 'ACTIVE')
        // Optionally refetch visits to update department status
        refetchVisits()
      }
    } catch (err) {
      // Continue to consultation even if updating status fails
      console.error('Failed to update department status:', err)
    }
    
    // Navigate to consultation page
    router.push(`/consultation/${visit.id}`)
  }

  const handleTriageVisit = (visit: Visit) => {
    router.push(`/triage/${visit.id}`)
  }

  const canAddDepartment = (visit: Visit) => {
    return visit.visitStatus !== 'COMPLETED'
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

  const handlePreviewInvoice = async (visit: Visit) => {
    try {
      setPrintingVisitId(visit.id)
      
      const billRes = await getVisitBillings({ variables: { visitId: visit.id } })
      const bill = billRes.data?.visitBillings?.data?.[billRes.data?.visitBillings?.data?.length - 1] || billRes.data?.visitBillings?.data?.[0]
      
      if (!bill?.id) {
        toast.error("No bill found for this visit.")
        return
      }

      const response = await getInvoice(bill.id)

      const invoiceUrl = response?.data?.invoiceUrl
      if (response?.status !== 'SUCCESS' || !invoiceUrl) {
        const errorMsg = response?.message || 'Failed to fetch invoice PDF'
        toast.error(errorMsg)
        return
      }

      if (invoiceUrl.startsWith('http://') || invoiceUrl.startsWith('https://') || invoiceUrl.startsWith('/')) {
        const previewWindow = window.open(invoiceUrl, '_blank')
        if (!previewWindow) {
          toast.error('Unable to open invoice preview. Please allow pop-ups and try again.')
          return
        }
      } else {
        // Clean base64 string if it has data URI prefix
        const base64Data = invoiceUrl.replace(/^data:application\/pdf;base64,/, '')
        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i += 1) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'application/pdf' })
        const blobUrl = URL.createObjectURL(blob)
        const previewWindow = window.open(blobUrl, '_blank')
        if (!previewWindow) {
          toast.error('Unable to open invoice preview. Please allow pop-ups and try again.')
          return
        }
      }
    } catch (err: any) {
      console.error('Preview invoice error:', err)
      toast.error(err?.message || 'Failed to fetch invoice PDF')
    } finally {
      setPrintingVisitId(null)
    }
  }

  const handleEditConsultation = (visit: Visit) => {
    router.push(`/consultation/${visit.id}`)
  }

  const handleViewPatientHistory = (visit: Visit) => {
    setPatientHistoryVisit(visit)
    setPatientHistoryOpen(true)
  }

  const handleDischargeVisit = async (visit: Visit) => {
    const confirmed = window.confirm('Discharge this patient and complete the visit?')
    if (!confirmed) return

    try {
      const allDepartments = visit.departments || []
      const notCompleted = allDepartments.filter((dept) => dept.status !== 'COMPLETED' && dept.status !== 'CANCELLED')

      if (notCompleted.length > 0) {
        for (const dept of notCompleted) {
          const visitDeptId = String(dept.id || '')
          if (!visitDeptId) continue

          const res = await updateDepartmentStatus(visitDeptId, 'COMPLETED')
          if (res?.status !== 'SUCCESS') {
            toast.error(res?.messages?.[0]?.text || 'Failed to complete department during discharge')
            return
          }
        }
      } else {
        // Trigger backend completion aggregation if all departments are already marked completed.
        const fallbackDepartment = allDepartments[allDepartments.length - 1]
        const fallbackId = String(fallbackDepartment?.id || '')
        if (fallbackId) {
          await updateDepartmentStatus(fallbackId, 'COMPLETED')
        }
      }

      await refetchVisits()
      toast.success('Patient discharged successfully')
    } catch (err) {
      console.error('Discharge visit error:', err)
      toast.error('Failed to discharge patient')
    }
  }

  const handlePatientRegistered = (patientId: string, _insurances: any[], proceedToVisit: boolean, createdVisit?: Visit) => {
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
                totalWaitingForBilling={dashboardStats?.totalWaitingForBilling ?? 0}
              />

                <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-lg overflow-hidden">
                {/* Status filters */}
                <div className="p-6 border-b border-border/30">
                  {/* Desktop filters - visible on md and up */}
                  <div className="hidden md:flex gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        statusFilter === "all"
                          ? "bg-primary text-primary-foreground shadow-lg scale-105"
                          : "bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted/70 hover:scale-105"
                      }`}
                    >
                      All Visits
                    </button>
                    <button
                      onClick={() => setStatusFilter("CREATED")}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        statusFilter === "CREATED"
                          ? "bg-primary text-primary-foreground shadow-lg scale-105"
                          : "bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted/70 hover:scale-105"
                      }`}
                    >
                      Created
                    </button>
                    <button
                      onClick={() => setStatusFilter("IN_PROGRESS")}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        statusFilter === "IN_PROGRESS"
                          ? "bg-primary text-primary-foreground shadow-lg scale-105"
                          : "bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted/70 hover:scale-105"
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => setStatusFilter("COMPLETED")}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        statusFilter === "COMPLETED"
                          ? "bg-primary text-primary-foreground shadow-lg scale-105"
                          : "bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted/70 hover:scale-105"
                      }`}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => setStatusFilter("CANCELLED")}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        statusFilter === "CANCELLED"
                          ? "bg-primary text-primary-foreground shadow-lg scale-105"
                          : "bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted/70 hover:scale-105"
                      }`}
                    >
                      Cancelled
                    </button>
                    <button
                      onClick={() => setStatusFilter("BILLING")}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        statusFilter === "BILLING"
                          ? "bg-blue-500 text-white shadow-lg scale-105"
                          : "bg-muted/50 backdrop-blur-sm text-foreground hover:bg-muted/70 hover:scale-105"
                      }`}
                    >
                      Billing
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
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 0.75rem center',
                              paddingRight: '2rem'
                            }}
                          >
                            <option value="all">All Visits</option>
                            <option value="CREATED">Created</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="BILLING">Billing</option>
                          </select>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="rounded-full h-10 w-10 flex-shrink-0"
                          onClick={() => setViewMode((prev) => (prev === "list" ? "grid" : "list"))}
                          title={viewMode === "list" ? "Switch to grid view" : "Switch to list view"}
                          aria-label={viewMode === "list" ? "Switch to grid view" : "Switch to list view"}
                        >
                          {viewMode === "list" ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
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
                <div className={`p-6 ${mobileSearchActive ? "hidden md:block" : ""}`}>
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
                        onClick={() => setViewMode((prev) => (prev === "list" ? "grid" : "list"))}
                        title={viewMode === "list" ? "Switch to grid view" : "Switch to list view"}
                        aria-label={viewMode === "list" ? "Switch to grid view" : "Switch to list view"}
                      >
                        {viewMode === "list" ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                      </Button>
                    </div>
                  ) : null}

                  {/* Visits / Patients view */}
                  <TooltipProvider>
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" : "space-y-2"}>
                    {loading ? (
                      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 col-span-full" : "space-y-2"}>
                        {[...Array(5)].map((_, idx) => (
                          <div key={idx} className="p-4 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-3 w-48" />
                                <Skeleton className="h-3 w-32" />
                              </div>
                              <div className="flex gap-2">
                                <Skeleton className="h-9 w-28 rounded-full" />
                                <Skeleton className="h-9 w-28 rounded-full" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : error ? (
                      <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                        <InlineTryAgain onTryAgain={() => { void refetchVisits() }} />
                      </div>
                    ) : allVisits.length === 0 ? (
                      <div className={`text-center py-8 ${viewMode === "grid" ? "col-span-full" : ""}`}>
                        <User className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-muted-foreground">No visits found</p>
                      </div>
                    ) : (
                      allVisits.map((visit: Visit) => {
                        const consultButtonDebug = {
                          canSeeVisitActionButtons,
                          canSeeConsultButton,
                          canConsultVisit: canConsultVisit(visit),
                          visitStatus: visit.visitStatus,
                          statusCheck: visit.visitStatus === 'CREATED' || visit.visitStatus === 'IN_PROGRESS',
                        }
                        if (process.env.NODE_ENV !== 'production') {
                          // eslint-disable-next-line no-console
                          console.debug(`[ConsultButton check for ${visit.patient.firstName} ${visit.patient.lastName}]:`, consultButtonDebug)
                        }
                        return (
                        <div
                          key={visit.id}
                          className={`p-4 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-2xl hover:bg-card/90 dark:hover:bg-slate-900/90 hover:shadow-md transition-all duration-200 ${viewMode === "grid" ? "h-full" : ""}`}
                        >
                          <div className={viewMode === "grid" ? "h-full flex flex-col justify-between gap-4" : "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-3"}>
                            <div className={viewMode === "grid" ? "space-y-2" : "flex items-center gap-3 flex-1"}>
                              <div className={viewMode === "grid" ? "flex items-center gap-2" : "contents"}>
                                {visit.visitStatus === 'CREATED' && <AlertCircle className="w-4 h-4 text-secondary flex-shrink-0" />}
                                {visit.visitStatus === 'IN_PROGRESS' && <Clock className="w-4 h-4 text-accent flex-shrink-0" />}
                                {visit.visitStatus === 'COMPLETED' && <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />}
                                {visit.visitStatus === 'CANCELLED' && <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <h3 className="font-medium text-foreground truncate cursor-help">
                                      {visit.patient.firstName} {visit.patient.lastName}
                                    </h3>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-sm">
                                    <div className="space-y-2 text-xs">
                                      <p className="font-semibold">Departments history</p>
                                      {(visit.departments || []).length === 0 ? (
                                        <p className="text-muted-foreground">Current service: {getTriageDuration(visit)}</p>
                                      ) : (
                                        (visit.departments || []).map((dept) => (
                                          <div key={dept.id} className="border-b border-border/30 pb-2 last:border-b-0 last:pb-0">
                                            <p className="font-medium">{dept.department?.name || "Unknown Department"}</p>
                                            <p>Status: {dept.status || "-"}</p>
                                            <p>Transfer: {formatDepartmentTime(dept.transferTime)}</p>
                                            <p>Completed: {formatDepartmentTime(dept.completedTime)}</p>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm text-muted-foreground truncate">
                                  {new Date(visit.visitDate).toLocaleDateString()}
                                </p>
                                {canSeeBillingInfo && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    Billing: {getBillingDisplayStatus(visit)}
                                  </p>
                                )}
                                {isReceptionistOnly && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    Status: {visit.visitStatus}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className={`flex items-center gap-2 flex-wrap ${viewMode === "grid" ? "justify-start" : "justify-end lg:justify-start lg:flex-nowrap"}`}>
                              {(() => {
                                const matchedClosedDepartment = getMatchingUserDepartment(visit, { mustBeClosed: true })
                                const showClosedConsultationActions = Boolean(
                                  canSeeVisitActionButtons
                                  && canSeeConsultButton
                                  && hasClinicianOrDoctorRole
                                  && matchedClosedDepartment,
                                )

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

                                    {!showClosedConsultationActions && canSeeVisitActionButtons && canSeeConsultButton && canConsultVisit(visit) && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleConsultVisit(visit)
                                      }}
                                      title="Start Consult"
                                      aria-label="Start Consult"
                                      className="h-9 w-9 sm:h-10 sm:w-10 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                    >
                                      <Stethoscope className="w-4 h-4 flex-shrink-0" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Start Consult</p>
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
                                                handlePreviewConsultation(visit)
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

                              {canSeeVisitActionButtons && hasNurseRole && (visit.visitStatus === 'CREATED' || visit.visitStatus === 'IN_PROGRESS') && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleTriageVisit(visit)
                                      }}
                                      title="Open Triage"
                                      aria-label="Open Triage"
                                      className="h-9 w-9 sm:h-10 sm:w-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                    >
                                      <Activity className="w-4 h-4 flex-shrink-0" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Triage</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {canSeeVisitActionButtons
                                && hasConsultationRole
                                && (visit.visitStatus === 'COMPLETED' || visit.visitStatus === 'CANCELLED')
                                && !Boolean(getMatchingUserDepartment(visit, { mustBeClosed: true })) && (
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
                              {canSeeAddDepartment && canAddDepartment(visit) && !isDischarged(visit) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAddDepartment(visit)
                                  }}
                                  title="Add Department"
                                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                                >
                                  <Plus className="w-4 h-4 flex-shrink-0" />
                                  <span className="hidden sm:inline lg:hidden">Dept</span>
                                  <span className="hidden lg:inline">Add Department</span>
                                </button>
                              )}
                              {canSeeVisitActionButtons && canDischargeVisit(visit) && ENABLE_DISCHARGE && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDischargeVisit(visit)
                                  }}
                                  title="Discharge Patient"
                                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                                >
                                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                  <span className="hidden sm:inline lg:hidden">Discharge</span>
                                  <span className="hidden lg:inline">Discharge</span>
                                </button>
                              )}
                              {canSeeBillButton && hasUnbilledItems(visit) && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleGoToBilling(visit)
                                      }}
                                      title="Bill Visit"
                                      className="h-9 w-9 sm:h-10 sm:w-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                    >
                                      <ReceiptText className="w-4 h-4 flex-shrink-0" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Bill Visit</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {canSeeBillButton && visit.billingStatus === 'BILLED' && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        void handlePreviewInvoice(visit)
                                      }}
                                      title="Preview Invoice"
                                      disabled={printingVisitId === visit.id}
                                      className="h-9 w-9 sm:h-10 sm:w-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center relative"
                                    >
                                      <ReceiptText className={`w-4 h-4 flex-shrink-0 ${printingVisitId === visit.id ? 'animate-spin' : ''}`} />
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
                            </div>
                          </div>
                        </div>
                        )
                      })
                    )}
                  </div>
                  </TooltipProvider>
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
          onClose={() => setPatientHistoryOpen(false)}
        />
      )}

      {/* Modals */}
      {showPatientRegistrationModal && (
        <PatientRegistrationModal
          isOpen={showPatientRegistrationModal}
          onClose={() => setShowPatientRegistrationModal(false)}
          onPatientRegistered={handlePatientRegistered}
          hideSearchPanel={typeof window !== "undefined" && window.innerWidth < 768}
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
        consultationId={previewConsultationContext?.consultationId || null}
        departmentId={previewConsultationContext?.departmentId || null}
        departmentName={previewConsultationContext?.departmentName}
        patientName={previewConsultationContext?.patientName}
        previewStartedAt={previewConsultationContext?.previewStartedAt || null}
      />
    </div>
  )
}
