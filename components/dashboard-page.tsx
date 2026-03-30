"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useVisits, useDepartments, type Visit, useProcessVisitDepartment, useUpdateVisitDepartmentStatus, useDashboardStats } from "@/hooks/auth-hooks"
import Header from "@/components/header"
import PatientRegistrationModal from "@/components/patient-registration-modal"
import VisitCreationModal from "@/components/visit-creation-modal"
import { AddDepartmentModal } from "@/components/add-department-modal"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import InlineTryAgain from "@/components/inline-try-again"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, Calendar, Clock, CheckCircle, AlertCircle, UserPlus, Stethoscope, User, ReceiptText, Plus, List, LayoutGrid } from "lucide-react"
import { toast } from "react-toastify"

export default function DashboardPage() {
  const router = useRouter()
  const { doctor } = useAuth()
  const { visits, loading, error, refetch: refetchVisits } = useVisits()
  const { stats: dashboardStats, loading: dashboardStatsLoading } = useDashboardStats(1)
  const { departments, refetch: refetchDepartments } = useDepartments()
  const { processDepartment } = useProcessVisitDepartment()
  const { updateDepartmentStatus } = useUpdateVisitDepartmentStatus()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [mobileSearchActive, setMobileSearchActive] = useState(false)
  const [showMetrics, setShowMetrics] = useState(true)
  const [showMobileActionSheet, setShowMobileActionSheet] = useState(false)

  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const hasReceptionistRole = roles.includes("RECEPTIONIST")
  const hasFinanceRole = roles.includes("FINANCE")
  const isReceptionistOnly = hasReceptionistRole && roles.length === 1
  const hasConsultationRole = roles.some((role) => ["DOCTOR", "OPHTHALMOLOGIST", "NURSE", "SPECIALIST", "ADMIN"].includes(role))
  const canSeeConsultButton = !isReceptionistOnly
  const canSeeBillButton = hasFinanceRole && !isReceptionistOnly
  const canSeeRegisterAndCreate = hasReceptionistRole || hasFinanceRole
  const canSeeVisitActionButtons = !isReceptionistOnly

  // Modal states
  const [showPatientRegistrationModal, setShowPatientRegistrationModal] = useState(false)
  const [showVisitCreationModal, setShowVisitCreationModal] = useState(false)
  const [registeredPatientId, setRegisteredPatientId] = useState<string | null>(null)
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false)
  const [selectedVisitForDepartment, setSelectedVisitForDepartment] = useState<Visit | null>(null)

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
    return hasNoBillables(visit) ? "NOT BILLABLE" : visit.billingStatus
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

  const formatDepartmentTime = (time?: string) => {
    if (!time) return "-"
    return new Date(time).toLocaleString()
  }

  const allVisits = useMemo(() => {
    let filtered = visits

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
  }, [visits, searchQuery, statusFilter])

  const handleConsultVisit = async (visit: Visit) => {
    // Process first department before navigating to consultation
    try {
      const firstDeptId = visit.departments?.[0]?.department?.id || visit.departments?.[0]?.id
      if (firstDeptId) {
        await processDepartment(visit.id, firstDeptId)
        // Optionally refetch visits to update department status
        refetchVisits()
      }
    } catch (err) {
      // Continue to consultation even if processing fails
      console.error('Failed to process department:', err)
    }
    
    // Navigate to consultation page
    router.push(`/consultation/${visit.id}`)
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
    refetchDepartments()
  }

  const handleGoToBilling = (visit: Visit) => {
    router.push(`/billing?visitId=${visit.id}&patientId=${visit.patient.id}`)
  }

  const handleViewConsultation = (visit: Visit) => {
    router.push(`/consultation/${visit.id}`)
  }

  const handleDischargeVisit = async (visit: Visit) => {
    const confirmed = window.confirm('Discharge this patient and complete the visit?')
    if (!confirmed) return

    try {
      const allDepartments = visit.departments || []
      const notCompleted = allDepartments.filter((dept) => dept.status !== 'COMPLETED' && dept.status !== 'CANCELLED')

      if (notCompleted.length > 0) {
        for (const dept of notCompleted) {
          const deptId = String(dept.department?.id || dept.id || '')
          if (!deptId) continue

          const res = await updateDepartmentStatus(String(visit.id), deptId, 'COMPLETED')
          if (res?.status !== 'SUCCESS') {
            toast.error(res?.messages?.[0]?.text || 'Failed to complete department during discharge')
            return
          }
        }
      } else {
        // Trigger backend completion aggregation if all departments are already marked completed.
        const fallbackDepartment = allDepartments[allDepartments.length - 1]
        const fallbackId = String(fallbackDepartment?.department?.id || fallbackDepartment?.id || '')
        if (fallbackId) {
          await updateDepartmentStatus(String(visit.id), fallbackId, 'COMPLETED')
        }
      }

      await refetchVisits()
      toast.success('Patient discharged successfully')
    } catch (err) {
      console.error('Discharge visit error:', err)
      toast.error('Failed to discharge patient')
    }
  }

  const handlePatientRegistered = (patientId: string, _insurances: any[], _proceedToVisit: boolean) => {
    setRegisteredPatientId(patientId)
    setShowPatientRegistrationModal(false)
    setShowVisitCreationModal(true)
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
              {/* Header with date */}
              <div className="mb-8">
                <div className="text-center space-y-2">
                  <button
                    onClick={() => setShowMetrics(!showMetrics)}
                    className="text-3xl font-bold text-foreground hover:text-primary transition-colors duration-200 cursor-pointer block w-full"
                  >
                    Today
                  </button>
                  <p className="text-muted-foreground flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                  </p>
                </div>
                <div className="hidden md:flex flex-row gap-3 w-full justify-end">
                    {canSeeRegisterAndCreate && (
                      <Button
                        onClick={() => setShowPatientRegistrationModal(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Register New Patient</span>
                      </Button>
                    )}
                    {canSeeRegisterAndCreate && (
                      <Button
                        onClick={openVisitCreationModal}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Stethoscope className="w-4 h-4" />
                        <span>Create Visit</span>
                      </Button>
                    )}
                </div>
              </div>

              {showMetrics && (
              <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
                {/* Open metric */}
                <div className="flex flex-col gap-1.5">
                  <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                    <div className="flex items-start justify-between gap-2 md:gap-3">
                      <div className="min-w-0 w-full md:w-auto">
                        <p className="hidden md:block text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 font-medium truncate">Open</p>
                        {dashboardStatsLoading ? (
                          <Skeleton className="h-7 md:h-9 w-12 md:w-16" />
                        ) : (
                          <p className="text-xl md:text-3xl font-bold text-foreground text-center md:text-left">{dashboardStats?.totalOpen ?? 0}</p>
                        )}
                      </div>
                      <div className="hidden md:block bg-orange-500/10 p-2 md:p-3 rounded-xl md:rounded-2xl flex-shrink-0">
                        <AlertCircle className="w-4 h-4 md:w-6 md:h-6 text-orange-500" />
                      </div>
                    </div>
                  </div>
                  <div className="md:hidden text-center">
                    <span className="inline-block px-2.5 py-1 bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-full border border-orange-200 dark:border-orange-900/50">Open</span>
                  </div>
                </div>
                {/* Completed metric */}
                <div className="flex flex-col gap-1.5">
                  <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                    <div className="flex items-start justify-between gap-2 md:gap-3">
                      <div className="min-w-0 w-full md:w-auto">
                        <p className="hidden md:block text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 font-medium truncate">Completed</p>
                        {dashboardStatsLoading ? (
                          <Skeleton className="h-7 md:h-9 w-12 md:w-16" />
                        ) : (
                          <p className="text-xl md:text-3xl font-bold text-foreground text-center md:text-left">{dashboardStats?.totalCompleted ?? 0}</p>
                        )}
                      </div>
                      <div className="hidden md:block bg-primary/10 p-2 md:p-3 rounded-xl md:rounded-2xl flex-shrink-0">
                        <Clock className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="md:hidden text-center">
                    <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">Completed</span>
                  </div>
                </div>
                {/* Waiting metric */}
                <div className="flex flex-col gap-1.5">
                  <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                    <div className="flex items-start justify-between gap-2 md:gap-3">
                      <div className="min-w-0 w-full md:w-auto">
                        <p className="hidden md:block text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 font-medium truncate">Waiting</p>
                        {dashboardStatsLoading ? (
                          <Skeleton className="h-7 md:h-9 w-12 md:w-16" />
                        ) : (
                          <p className="text-xl md:text-3xl font-bold text-foreground text-center md:text-left">{dashboardStats?.totalWaitingForBilling ?? 0}</p>
                        )}
                      </div>
                      <div className="hidden md:block bg-green-500/10 p-2 md:p-3 rounded-xl md:rounded-2xl flex-shrink-0">
                        <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-green-500" />
                      </div>
                    </div>
                  </div>
                  <div className="md:hidden text-center">
                    <span className="inline-block px-2.5 py-1 bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full border border-green-200 dark:border-green-900/50">Waiting</span>
                  </div>
                </div>
              </div>
              )}

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
                        <InlineTryAgain onTryAgain={() => refetchVisits()} />
                      </div>
                    ) : allVisits.length === 0 ? (
                      <div className={`text-center py-8 ${viewMode === "grid" ? "col-span-full" : ""}`}>
                        <User className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-muted-foreground">No visits found</p>
                      </div>
                    ) : (
                      allVisits.map((visit) => (
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
                                        <p className="text-muted-foreground">No departments yet</p>
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
                                {!isReceptionistOnly && (
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
                              {isDischarged(visit) && (
                                <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                                  Discharged
                                </span>
                              )}
                              {canSeeVisitActionButtons && canSeeConsultButton && (visit.visitStatus === 'CREATED' || visit.visitStatus === 'IN_PROGRESS') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleConsultVisit(visit)
                                  }}
                                  title="Start Consult"
                                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap flex items-center gap-1 sm:gap-2"
                                >
                                  <Stethoscope className="w-4 h-4 flex-shrink-0" />
                                  <span className="hidden sm:inline lg:hidden">Consult</span>
                                  <span className="hidden lg:inline">Start Consult</span>
                                </button>
                              )}
                              {canSeeVisitActionButtons && hasConsultationRole && (visit.visitStatus === 'COMPLETED' || visit.visitStatus === 'CANCELLED') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewConsultation(visit)
                                  }}
                                  title="View Consultation"
                                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap flex items-center gap-1 sm:gap-2"
                                >
                                  <Stethoscope className="w-4 h-4 flex-shrink-0" />
                                  <span className="hidden sm:inline lg:hidden">View</span>
                                  <span className="hidden lg:inline">View Consultation</span>
                                </button>
                              )}
                              {canSeeVisitActionButtons && canAddDepartment(visit) && !isDischarged(visit) && (
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
                              {canSeeVisitActionButtons && canDischargeVisit(visit) && (
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
                              {canSeeVisitActionButtons && canSeeBillButton && hasUnbilledItems(visit) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleGoToBilling(visit)
                                  }}
                                  title="Bill Visit"
                                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                                >
                                  <ReceiptText className="w-4 h-4 flex-shrink-0" />
                                  <span className="hidden sm:inline lg:hidden">Bill</span>
                                  <span className="hidden lg:inline">Bill Visit</span>
                                </button>
                              )}
                              {canSeeVisitActionButtons && canSeeBillButton && visit.billingStatus === 'BILLED' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleGoToBilling(visit)
                                  }}
                                  title="View Billing"
                                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                                >
                                  <ReceiptText className="w-4 h-4 flex-shrink-0" />
                                  <span className="hidden sm:inline lg:hidden">View Bill</span>
                                  <span className="hidden lg:inline">View Billing</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Mobile Search Overlay - Full Screen */}
      {mobileSearchActive && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
          {/* Search Bar */}
          <div className="flex items-center gap-2 p-4 border-b border-border/30">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-11 pr-4 py-3 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-full text-foreground dark:text-slate-100 placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 shadow-sm"
              />
            </div>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="rounded-full h-10 w-10 flex-shrink-0"
              onClick={() => {
                setMobileSearchActive(false)
                setSearchQuery("")
              }}
              title="Close"
              aria-label="Close search"
            >
              ✕
            </Button>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto">
            {searchQuery ? (
              <div className="divide-y divide-border/30">
                {allVisits
                  .filter(
                    (visit) =>
                      `${visit.patient.firstName} ${visit.patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((visit) => (
                    <button
                      key={visit.id}
                      onClick={() => {
                        setSearchQuery(`${visit.patient.firstName} ${visit.patient.lastName}`)
                        setMobileSearchActive(false)
                      }}
                      className="w-full px-4 py-4 text-left hover:bg-muted/50 active:bg-muted/70 transition-colors"
                    >
                      <p className="font-medium text-foreground text-base">
                        {visit.patient.firstName} {visit.patient.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(visit.visitDate).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                {allVisits.filter((visit) =>
                  `${visit.patient.firstName} ${visit.patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 && (
                  <p className="px-4 py-8 text-center text-muted-foreground">No patients found</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-center">Start typing to search patients</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button for mobile reception */}
      {canSeeRegisterAndCreate && !mobileSearchActive && (
        <div className="md:hidden fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowMobileActionSheet(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Mobile Action Sheet - Choose New or Existing Patient */}
      <AlertDialog open={showMobileActionSheet} onOpenChange={setShowMobileActionSheet}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>What would you like to do?</AlertDialogTitle>
            <AlertDialogDescription>
              Create a new patient record or start a visit for an existing patient.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-3">
            <AlertDialogAction
              onClick={() => {
                setShowMobileActionSheet(false)
                setShowPatientRegistrationModal(true)
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Register New Patient
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                setShowMobileActionSheet(false)
                openVisitCreationModal()
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Create Visit
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modals */}
      <PatientRegistrationModal
        isOpen={showPatientRegistrationModal}
        onClose={() => setShowPatientRegistrationModal(false)}
        onPatientRegistered={handlePatientRegistered}
        hideSearchPanel={typeof window !== "undefined" && window.innerWidth < 768}
      />

      <VisitCreationModal
        isOpen={showVisitCreationModal}
        onClose={closeVisitCreationModal}
        onVisitCreated={handleVisitCreated}
        preSelectedPatientId={registeredPatientId}
      />

      {selectedVisitForDepartment && (
        <AddDepartmentModal
          visit={selectedVisitForDepartment}
          departments={departments || []}
          isOpen={addDepartmentModalOpen}
          onClose={() => {
            setAddDepartmentModalOpen(false)
            setSelectedVisitForDepartment(null)
          }}
          onSuccess={handleAddDepartmentSuccess}
        />
      )}
    </div>
  )
}
