"use client"

import React, { useState, useMemo, useEffect } from "react"
import dynamic from "next/dynamic"
import Header from "@/components/header"
import { useAuth } from "@/lib/auth-context"
import { useUserReports } from "@/hooks/reports"
import { calculateUserReports, type ReportPeriod, type UserReportsData } from "@/lib/user-reports-calculator"
import { RoleName } from "@/lib/api-types"
import { cn } from "@/lib/utils"
import {
  ReportsClinicianSkeleton,
  ReportsFinanceSkeleton,
  ReportsKpiCardsSkeleton,
  ReportsChartSkeleton,
  ReportsTableSkeleton,
} from "@/components/reports/reports-skeleton"

// Dynamically imported report components with skeleton fallbacks for optimal bundle size & lazy loading
const ReportsFinanceView = dynamic(
  () => import("@/components/reports/reports-finance-view").then((mod) => mod.ReportsFinanceView),
  { ssr: false, loading: () => <ReportsFinanceSkeleton /> }
)

const ReportsClinicianView = dynamic(
  () => import("@/components/reports/reports-clinician-view").then((mod) => mod.ReportsClinicianView),
  { ssr: false, loading: () => <ReportsClinicianSkeleton /> }
)

const ReportsKpiCards = dynamic(
  () => import("@/components/reports/reports-kpi-cards").then((mod) => mod.ReportsKpiCards),
  { ssr: false, loading: () => <ReportsKpiCardsSkeleton /> }
)

const ReportsChart = dynamic(
  () => import("@/components/reports/reports-chart").then((mod) => mod.ReportsChart),
  { ssr: false, loading: () => <ReportsChartSkeleton /> }
)

const ReportsActivityTable = dynamic(
  () => import("@/components/reports/reports-activity-table").then((mod) => mod.ReportsActivityTable),
  { ssr: false, loading: () => <ReportsTableSkeleton /> }
)

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Calendar,
  Clock,
  ChevronDown,
  UserCheck,
  Stethoscope,
  HeartPulse,
  Receipt,
  LayoutDashboard,
  Loader2,
  Wallet,
  Activity,
} from "lucide-react"

import { ReportsPeriodSelector } from "@/components/reports/reports-period-selector"

// Helper to format date to YYYY-MM-DD in local time
function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function ReportsPage() {
  const { doctor, isLoading: authLoading } = useAuth()

  // Period state: 'today', 'week', 'month', 'custom'
  const [period, setPeriod] = useState<ReportPeriod>("today")
  const [customFromDate, setCustomFromDate] = useState<string>(() => formatLocalDate(new Date()))
  const [customToDate, setCustomToDate] = useState<string>(() => formatLocalDate(new Date()))
  const [activeTab, setActiveTab] = useState<string>("clinician")

  // Compute dynamic label for the time selector
  const rangeDisplayLabel = useMemo(() => {
    const today = new Date()
    const currentYear = today.getFullYear()

    if (period === "today") {
      return today.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    }

    if (period === "week") {
      const past7 = new Date()
      past7.setDate(today.getDate() - 6)
      const fromStr = past7.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      const toStr = today.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
      return `This Week (${fromStr} – ${toStr})`
    }

    if (period === "month") {
      const monthName = today.toLocaleDateString("en-GB", { month: "long" })
      return `${monthName} ${today.getFullYear()}`
    }

    // Custom
    if (customFromDate && customToDate) {
      const f = new Date(customFromDate)
      const t = new Date(customToDate)
      const fStr = f.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: f.getFullYear() !== currentYear ? "numeric" : undefined,
      })
      const tStr = t.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      return `${fStr} – ${tStr}`
    }

    return "Custom Range"
  }, [period, customFromDate, customToDate])

  // Compute actual fromDate and toDate based on selected period
  const { fromDate, toDate } = useMemo(() => {
    const today = new Date()
    if (period === "today") {
      const d = formatLocalDate(today)
      return { fromDate: d, toDate: d }
    }
    if (period === "week") {
      const past7 = new Date(today)
      past7.setDate(today.getDate() - 6)
      return { fromDate: formatLocalDate(past7), toDate: formatLocalDate(today) }
    }
    if (period === "month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      return { fromDate: formatLocalDate(firstDay), toDate: formatLocalDate(today) }
    }
    // custom
    return {
      fromDate: customFromDate || formatLocalDate(today),
      toDate: customToDate || formatLocalDate(today),
    }
  }, [period, customFromDate, customToDate])

  // Fetch reports from backend for the period
  const { reportData: backendReportData, loading: reportsLoading, refetch } = useUserReports({
    fromDate,
    toDate,
    period,
    skip: authLoading || !doctor,
  })

  // Calculate or fallback report metrics
  const reportData: UserReportsData = useMemo(() => {
    if (backendReportData) return backendReportData
    return calculateUserReports([], doctor, period, fromDate, toDate)
  }, [backendReportData, doctor, period, fromDate, toDate])

  // Default tab based on user roles
  const defaultTab = useMemo(() => {
    if (reportData.hasClinician) return "clinician"
    if (reportData.hasFinance) return "finance"
    if (reportData.hasNurse) return "nurse"
    if (reportData.hasReception) return "reception"
    return "clinician"
  }, [reportData])

  // Determine if single role user
  const activeRoleCount = [
    reportData.hasReception,
    reportData.hasClinician,
    reportData.hasNurse,
    reportData.hasFinance,
  ].filter(Boolean).length

  const isSingleRoleUser = !reportData.isAdminOrManager && activeRoleCount <= 1

  // Single role target
  const singleRoleTarget = useMemo(() => {
    if (!isSingleRoleUser) return null
    return defaultTab
  }, [isSingleRoleUser, defaultTab])

  // Auto-switch to single role target or fallback to default tab
  useEffect(() => {
    if (isSingleRoleUser && singleRoleTarget) {
      setActiveTab(singleRoleTarget)
    } else if (!reportData.allowedTabs.includes(activeTab as any)) {
      setActiveTab(defaultTab)
    }
  }, [isSingleRoleUser, singleRoleTarget, reportData.allowedTabs, activeTab, defaultTab])

  // Activities filtered according to activeTab
  const activitiesForActiveTab = useMemo(() => {
    if (activeTab === "reception") return reportData.reception.activities
    if (activeTab === "clinician") return reportData.clinician.activities
    if (activeTab === "nurse") return reportData.nurse.activities
    if (activeTab === "finance") return reportData.finance.activities
    return reportData.allActivities
  }, [activeTab, reportData])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header doctor={doctor} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  // Clinician table expanded state for upward expansion
  const [isClinicianTableExpanded, setIsClinicianTableExpanded] = useState(false)

  // Determine if top control bar should be rendered
  const showTopBar = (!isSingleRoleUser || (activeTab !== "clinician" && activeTab !== "finance")) && !isClinicianTableExpanded

  return (
    <div className={cn(
      "bg-background text-foreground flex flex-col",
      isClinicianTableExpanded ? "h-screen overflow-hidden" : "min-h-screen"
    )}>
      <Header doctor={doctor} />

      <main className={cn(
        "container mx-auto px-4 sm:px-6 max-w-7xl transition-all",
        isClinicianTableExpanded
          ? "py-2.5 flex-1 flex flex-col min-h-0 overflow-hidden"
          : "py-6 space-y-6 flex-1"
      )}>
        {/* Top Control Bar: Rendered for multi-role users or single-role non-clinician tabs */}
        {showTopBar && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card/80 backdrop-blur-xl border border-border/70 p-3 rounded-2xl shadow-sm">
            {/* Left: Multi-role navigation or single-role clean header */}
            {!isSingleRoleUser ? (
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {reportData.hasClinician && (
                  <Button
                    variant={activeTab === "clinician" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("clinician")}
                    className="rounded-xl h-8 px-3 text-xs font-medium gap-1.5 whitespace-nowrap"
                  >
                    <Stethoscope className="h-3.5 w-3.5" />
                    Clinician
                    {reportData.clinician.activities.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 py-0 px-1.5 text-[10px] bg-secondary/80 text-secondary-foreground"
                      >
                        {reportData.clinician.activities.length}
                      </Badge>
                    )}
                  </Button>
                )}

                {reportData.hasNurse && (
                  <Button
                    variant={activeTab === "nurse" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("nurse")}
                    className="rounded-xl h-8 px-3 text-xs font-medium gap-1.5 whitespace-nowrap"
                  >
                    <HeartPulse className="h-3.5 w-3.5" />
                    Nursing
                    {reportData.nurse.activities.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 py-0 px-1.5 text-[10px] bg-secondary/80 text-secondary-foreground"
                      >
                        {reportData.nurse.activities.length}
                      </Badge>
                    )}
                  </Button>
                )}

                {reportData.hasFinance && (
                  <Button
                    variant={activeTab === "finance" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("finance")}
                    className="rounded-xl h-8 px-3 text-xs font-medium gap-1.5 whitespace-nowrap"
                  >
                    <Wallet className="h-3.5 w-3.5" />
                    Billing & Money
                    {reportData.finance.activities.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 py-0 px-1.5 text-[10px] bg-secondary/80 text-secondary-foreground"
                      >
                        {reportData.finance.activities.length}
                      </Badge>
                    )}
                  </Button>
                )}

                {reportData.hasReception && (
                  <Button
                    variant={activeTab === "reception" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("reception")}
                    className="rounded-xl h-8 px-3 text-xs font-medium gap-1.5 whitespace-nowrap"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Reception
                    {reportData.reception.activities.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 py-0 px-1.5 text-[10px] bg-secondary/80 text-secondary-foreground"
                      >
                        {reportData.reception.activities.length}
                      </Badge>
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {activeTab === "nurse" ? (
                    <HeartPulse className="h-4 w-4" />
                  ) : (
                    <UserCheck className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <h1 className="text-sm font-bold text-foreground">
                    {activeTab === "nurse"
                      ? "Nursing & Triage Report"
                      : "Reception & Intake Report"}
                  </h1>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading Indicator for background refetching */}
        {reportsLoading && backendReportData && (
          <div className="flex items-center justify-center p-3 bg-card/60 backdrop-blur-md rounded-xl border border-border/50 animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
            <span className="text-xs text-muted-foreground">Updating reports for selected time frame...</span>
          </div>
        )}

        {/* If initial reports query is loading without existing data */}
        {reportsLoading && !backendReportData ? (
          activeTab === "finance" ? (
            <ReportsFinanceSkeleton />
          ) : activeTab === "clinician" ? (
            <ReportsClinicianSkeleton />
          ) : (
            <div className="space-y-6">
              <ReportsKpiCardsSkeleton />
              <ReportsChartSkeleton />
              <ReportsTableSkeleton />
            </div>
          )
        ) : (
          <>
            {/* Content depending on Active Tab */}
            {activeTab === "finance" ? (
              <ReportsFinanceView data={reportData} />
            ) : activeTab === "clinician" ? (
              <ReportsClinicianView
                data={reportData}
                isTableExpanded={isClinicianTableExpanded}
                onToggleTableExpand={setIsClinicianTableExpanded}
              />
            ) : (
              <>
                {/* KPI Metric Cards */}
                <ReportsKpiCards data={reportData} activeTab={activeTab} />

                {/* Timeline Chart */}
                <ReportsChart data={reportData} activeTab={activeTab} />
              </>
            )}

            {/* Detailed Audit Table (For nurse, reception) */}
            {activeTab !== "clinician" && activeTab !== "finance" && (
              <ReportsActivityTable
                activities={activitiesForActiveTab}
                title={
                  activeTab === "nurse"
                    ? "Triage & Vital Signs Encounters"
                    : "Reception & Intake Activity Records"
                }
              />
            )}
          </>
        )}

      </main>

      {/* Floating Time Period Selector (Always accessible, unified across all roles/views) */}
      <div className="fixed bottom-6 right-6 z-40 animate-in fade-in duration-300">
        <ReportsPeriodSelector
          period={period}
          setPeriod={setPeriod}
          customFromDate={customFromDate}
          setCustomFromDate={setCustomFromDate}
          customToDate={customToDate}
          setCustomToDate={setCustomToDate}
          rangeDisplayLabel={rangeDisplayLabel}
        />
      </div>
    </div>
  )
}
