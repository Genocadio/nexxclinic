"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import Header from "@/components/header"
import { useAuth } from "@/lib/auth-context"
import { canAccessFinancialReports } from "@/lib/role-utils"
import { useClinicReports } from "@/hooks/reports/use-clinic-reports"
import { useDepartments } from "@/hooks/departments/hooks"
import { useInsurances } from "@/hooks/insurances/hooks"
import { useUsers } from "@/hooks/auth/hooks"
import type { ReportPeriod } from "@/lib/user-reports-calculator"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  TrendingUp,
  Percent,
  SlidersHorizontal,
  HandCoins,
  LayoutDashboard,
  ShieldAlert,
  RotateCcw,
  Stethoscope,
  Landmark,
} from "lucide-react"

import { ReportsPeriodSelector } from "@/components/reports/reports-period-selector"
import { DepartmentFilterCombobox } from "@/components/reports/department-filter-combobox"
import { ClinicianFilterCombobox } from "@/components/reports/clinician-filter-combobox"
import { PayerFilterCombobox } from "@/components/reports/payer-filter-combobox"
import { AdminReportsOverview } from "@/components/reports/admin-reports-overview"
import { AdminReportsEarnings } from "@/components/reports/admin-reports-earnings"
import { AdminReportsWaivers } from "@/components/reports/admin-reports-waivers"
import { AdminReportsAdjustments } from "@/components/reports/admin-reports-adjustments"
import { AdminReportsLoans } from "@/components/reports/admin-reports-loans"

function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function FinancialReportsPage() {
  const { doctor } = useAuth()
  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const canAccess = canAccessFinancialReports(roles)

  // Filter States
  const [period, setPeriod] = useState<ReportPeriod>("today")
  const [customFromDate, setCustomFromDate] = useState<string>("")
  const [customToDate, setCustomToDate] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>([])
  const [selectedClinicianIds, setSelectedClinicianIds] = useState<string[]>([])
  const [selectedInsuranceIds, setSelectedInsuranceIds] = useState<string[]>([])
  const [isPrivateOnly, setIsPrivateOnly] = useState<boolean>(false)

  // Active Tab for Financial Reports: overview, earnings, waivers, adjustments, loans
  const [activeTab, setActiveTab] = useState<string>("overview")

  // Load auxiliary lists for filters
  const { departments = [] } = useDepartments({ skip: !canAccess })
  const { insurances = [] } = useInsurances({ supportedByClinic: true })
  const { users = [], loading: usersLoading } = useUsers()

  // Filter roster for staff with clinician/doctor roles
  const clinicians = useMemo(() => {
    return users.filter((u) =>
      u.roles?.some((r) =>
        ["CLINICIAN", "DOCTOR", "PHYSICIAN"].includes(String(r).toUpperCase())
      )
    )
  }, [users])

  // Range Display Label
  const rangeDisplayLabel = useMemo(() => {
    const today = new Date()
    if (period === "today") {
      return today.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    }
    if (period === "week") {
      const past7 = new Date(today)
      past7.setDate(today.getDate() - 6)
      const f = past7.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
      const t = today.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      return `${f} – ${t}`
    }
    if (period === "month") {
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ]
      return `${monthNames[selectedMonth]} ${selectedYear}`
    }
    if (customFromDate && customToDate) {
      const f = new Date(customFromDate)
      const t = new Date(customToDate)
      const fStr = f.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
      const tStr = t.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      if (customFromDate === customToDate) {
        return f.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      }
      return `${fStr} – ${tStr}`
    }
    return "Custom Range"
  }, [period, selectedMonth, selectedYear, customFromDate, customToDate])

  // Compute normalized fromDate and toDate for API
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
      const safeYear = Math.min(selectedYear, today.getFullYear())
      const safeMonth =
        safeYear === today.getFullYear()
          ? Math.min(selectedMonth, today.getMonth())
          : selectedMonth
      const firstDay = new Date(safeYear, safeMonth, 1)
      const lastDay = new Date(safeYear, safeMonth + 1, 0)
      return {
        fromDate: formatLocalDate(firstDay),
        toDate: formatLocalDate(lastDay),
      }
    }
    const todayStr = formatLocalDate(today)
    const safeFrom = customFromDate > todayStr ? todayStr : customFromDate || todayStr
    const safeTo = customToDate > todayStr ? todayStr : customToDate || todayStr
    return {
      fromDate: safeFrom,
      toDate: safeTo,
    }
  }, [period, selectedMonth, selectedYear, customFromDate, customToDate])

  // Query Clinic Reports
  const {
    reportData,
    loading: reportsLoading,
    refetch,
  } = useClinicReports({
    fromDate,
    toDate,
    period,
    departmentIds: selectedDepartmentIds.length > 0 ? selectedDepartmentIds : undefined,
    clinicianIds: selectedClinicianIds.length > 0 ? selectedClinicianIds : undefined,
    insuranceIds: selectedInsuranceIds.length > 0 ? selectedInsuranceIds : undefined,
    isPrivateOnly: isPrivateOnly ? true : undefined,
    skip: !canAccess,
  })

  // Has active filters
  const hasActiveFilters =
    selectedDepartmentIds.length > 0 ||
    selectedClinicianIds.length > 0 ||
    selectedInsuranceIds.length > 0 ||
    isPrivateOnly

  const handleResetFilters = () => {
    setSelectedDepartmentIds([])
    setSelectedClinicianIds([])
    setSelectedInsuranceIds([])
    setIsPrivateOnly(false)
  }

  if (!canAccess) {
    return (
      <div className="h-screen overflow-hidden bg-background flex flex-col">
        <Header doctor={doctor} />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="h-14 w-14 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Clinic reports and financial management analytics are only accessible to administrators and clinic managers.
            </p>
          </div>
          <Link href="/">
            <Button variant="default" className="rounded-xl">
              Return to Dashboard
            </Button>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground flex flex-col">
      <Header doctor={doctor} />

      <main className={cn(
        "container w-full mx-auto px-4 sm:px-6 max-w-7xl transition-all flex-1 min-h-0 min-w-0",
        "py-3 sm:py-4 space-y-3 sm:space-y-3.5 overflow-y-auto"
      )}>
        {/* Top Control Header: Page Title + Nav Switcher + Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-card/80 backdrop-blur-xl border border-border/70 p-3 sm:p-3.5 rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Landmark className="h-4 w-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">Financial Reports</h2>
              <Badge variant="outline" className="text-[11px] py-0 px-2 bg-primary/10 text-primary border-primary/20">
                Revenue & Audit
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Period: <span className="font-medium text-foreground">{rangeDisplayLabel}</span>
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Department Multi-Select Combobox with Search */}
            <DepartmentFilterCombobox
              departments={departments}
              selectedIds={selectedDepartmentIds}
              onChange={setSelectedDepartmentIds}
            />

            {/* Clinician Multi-Select Combobox with Search */}
            <ClinicianFilterCombobox
              clinicians={clinicians as any}
              selectedIds={selectedClinicianIds}
              onChange={setSelectedClinicianIds}
              loading={usersLoading}
            />

            {/* Payer Multi-Select Combobox with Search */}
            <PayerFilterCombobox
              insurances={insurances}
              selectedInsuranceIds={selectedInsuranceIds}
              isPrivateOnly={isPrivateOnly}
              onChange={({ insuranceIds, isPrivateOnly }) => {
                setSelectedInsuranceIds(insuranceIds)
                setIsPrivateOnly(isPrivateOnly)
              }}
            />

            {/* Reset Filters button if any active */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground rounded-xl"
                title="Reset filters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Tab Switcher: Overview, Earnings, Waivers, Adjustments, Loans */}
        <div className="flex items-center justify-center w-full overflow-x-auto pb-1">
          <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-card/80 backdrop-blur-xl border border-border/70 p-1.5 rounded-2xl shadow-sm flex-wrap max-w-full">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("overview")}
              className="rounded-xl h-8.5 sm:h-9 px-2.5 sm:px-4 text-xs font-medium gap-1.5 whitespace-nowrap shrink-0"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Overview</span>
              {reportData && (
                <Badge variant="secondary" className="py-0 px-1 text-[10px]">
                  {reportData.overview.totalPatients}
                </Badge>
              )}
            </Button>

            <Button
              variant={activeTab === "earnings" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("earnings")}
              className="rounded-xl h-8.5 sm:h-9 px-2.5 sm:px-4 text-xs font-medium gap-1.5 whitespace-nowrap shrink-0"
            >
              <TrendingUp className="h-4 w-4 shrink-0" />
              <span>Earnings Deep Dive</span>
            </Button>

            <Button
              variant={activeTab === "waivers" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("waivers")}
              className="rounded-xl h-8.5 sm:h-9 px-2.5 sm:px-4 text-xs font-medium gap-1.5 whitespace-nowrap shrink-0"
            >
              <Percent className="h-4 w-4 shrink-0" />
              <span>Waivers & Giveaways</span>
              {reportData && (
                <Badge variant="secondary" className="py-0 px-1 text-[10px]">
                  {reportData.overview.waiverCount + reportData.overview.giveawayCount}
                </Badge>
              )}
            </Button>

            <Button
              variant={activeTab === "adjustments" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("adjustments")}
              className="rounded-xl h-8.5 sm:h-9 px-2.5 sm:px-4 text-xs font-medium gap-1.5 whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4 shrink-0" />
              <span>Adjustments Only</span>
              {reportData && (
                <Badge variant="secondary" className="py-0 px-1 text-[10px]">
                  {reportData.deepReports.adjustments.length}
                </Badge>
              )}
            </Button>

            <Button
              variant={activeTab === "loans" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("loans")}
              className="rounded-xl h-8.5 sm:h-9 px-2.5 sm:px-4 text-xs font-medium gap-1.5 whitespace-nowrap shrink-0"
            >
              <HandCoins className="h-4 w-4 shrink-0" />
              <span>Current Loans & Debtors</span>
              {reportData && (
                <Badge variant="secondary" className="py-0 px-1 text-[10px]">
                  {reportData.overview.loanCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Loading Indicator for refetching */}
        {reportsLoading && reportData && (
          <div className="flex items-center justify-center p-2.5 bg-card/60 backdrop-blur-md rounded-xl border border-border/50 animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
            <span className="text-xs text-muted-foreground">Updating financial reports...</span>
          </div>
        )}

        {/* Initial Loading Skeleton */}
        {reportsLoading && !reportData ? (
          <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-20 bg-card/80 border border-border/70 rounded-xl p-3" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
              <div className="lg:col-span-7 h-64 bg-card/80 border border-border/70 rounded-2xl" />
              <div className="lg:col-span-5 h-64 bg-card/80 border border-border/70 rounded-2xl" />
            </div>
          </div>
        ) : reportData ? (
          <>
            {activeTab === "overview" && (
              <AdminReportsOverview data={reportData} onTabChange={setActiveTab} />
            )}
            {activeTab === "earnings" && (
              <AdminReportsEarnings data={reportData} />
            )}
            {activeTab === "waivers" && (
              <AdminReportsWaivers data={reportData} />
            )}
            {activeTab === "adjustments" && (
              <AdminReportsAdjustments data={reportData} />
            )}
            {activeTab === "loans" && (
              <AdminReportsLoans data={reportData} />
            )}
          </>
        ) : null}
      </main>

      {/* Floating Time Period Selector (Always accessible) */}
      <div className="fixed bottom-6 right-6 z-40 animate-in fade-in duration-300">
        <ReportsPeriodSelector
          period={period}
          setPeriod={setPeriod}
          customFromDate={customFromDate}
          setCustomFromDate={setCustomFromDate}
          customToDate={customToDate}
          setCustomToDate={setCustomToDate}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          rangeDisplayLabel={rangeDisplayLabel}
        />
      </div>
    </div>
  )
}
