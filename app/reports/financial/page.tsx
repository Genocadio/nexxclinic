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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  Layers,
  Filter,
  X,
} from "lucide-react"

import { ReportsPeriodSelector } from "@/components/reports/reports-period-selector"
import { ReportsInMenuFilter } from "@/components/reports/reports-in-menu-filter"
import { AdminReportsOverview } from "@/components/reports/admin-reports-overview"
import { AdminReportsEarnings } from "@/components/reports/admin-reports-earnings"
import { AdminReportsWaivers } from "@/components/reports/admin-reports-waivers"
import { AdminReportsAdjustments } from "@/components/reports/admin-reports-adjustments"
import { AdminReportsLoans } from "@/components/reports/admin-reports-loans"
import { AdminReportsDetailed } from "@/components/reports/admin-reports-detailed"
import { ReportsSectionDock } from "@/components/reports/reports-section-dock"

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


  // Carousel dock tab items
  const tabs = useMemo(() => [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      count: reportData?.overview?.totalPatients,
    },
    {
      id: "detailed",
      label: "Detailed",
      icon: Layers,
      count: reportData ? (reportData.encountersList?.length || reportData.overview?.totalVisits) : undefined,
    },
    {
      id: "earnings",
      label: "Earnings",
      icon: TrendingUp,
      count: undefined,
    },
    {
      id: "waivers",
      label: "Waivers",
      icon: Percent,
      count: reportData ? (reportData.overview?.waiverCount + reportData.overview?.giveawayCount) : undefined,
    },
    {
      id: "adjustments",
      label: "Adjustments",
      icon: SlidersHorizontal,
      count: reportData?.deepReports?.adjustments?.length,
    },
    {
      id: "loans",
      label: "Loans",
      icon: HandCoins,
      count: reportData?.overview?.loanCount,
    },
  ], [reportData])

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
        <ReportsSectionDock items={tabs} activeId={activeTab} onSelect={setActiveTab} />

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
              <AdminReportsOverview
                data={reportData}
                onTabChange={setActiveTab}
                onSelectPayer={({ insuranceId, isPrivateOnly: priv }) => {
                  if (priv) {
                    setIsPrivateOnly((prev) => !prev)
                    setSelectedInsuranceIds([])
                  } else if (insuranceId) {
                    setIsPrivateOnly(false)
                    setSelectedInsuranceIds((prev) =>
                      prev.includes(insuranceId)
                        ? prev.filter((id) => id !== insuranceId)
                        : [insuranceId]
                    )
                  } else {
                    setIsPrivateOnly(false)
                    setSelectedInsuranceIds([])
                  }
                }}
                cliniciansRoster={clinicians as any}
                selectedInsuranceIds={selectedInsuranceIds}
                isPrivateOnly={isPrivateOnly}
              />
            )}
            {activeTab === "detailed" && (
              <AdminReportsDetailed
                data={reportData}
                selectedDepartmentIds={selectedDepartmentIds}
                selectedClinicianIds={selectedClinicianIds}
                selectedInsuranceIds={selectedInsuranceIds}
                isPrivateOnly={isPrivateOnly}
                departments={departments}
                clinicians={clinicians as any}
                insurances={insurances}
              />
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

      {/* Floating Filter Button (Bottom Left) */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 animate-in fade-in duration-300">
        <ReportsInMenuFilter
          departments={departments}
          selectedDepartmentIds={selectedDepartmentIds}
          onDepartmentChange={setSelectedDepartmentIds}
          clinicians={clinicians as any}
          selectedClinicianIds={selectedClinicianIds}
          onClinicianChange={setSelectedClinicianIds}
          loadingClinicians={usersLoading}
          insurances={insurances}
          selectedInsuranceIds={selectedInsuranceIds}
          isPrivateOnly={isPrivateOnly}
          onPayerChange={({ insuranceIds, isPrivateOnly: priv }) => {
            setSelectedInsuranceIds(insuranceIds)
            setIsPrivateOnly(priv)
          }}
        />
      </div>

      {/* Floating Time Period Selector (Always accessible, Bottom Right) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 animate-in fade-in duration-300">
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
