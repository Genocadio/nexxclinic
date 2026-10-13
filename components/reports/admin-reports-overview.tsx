"use client"

import React from "react"
import {
  Users,
  Wallet,
  Building2,
  Stethoscope,
  TrendingUp,
  Receipt,
  Gift,
  HandCoins,
  ShieldAlert,
  Clock,
  CheckCircle2,
  UserCheck,
  CreditCard,
  Smartphone,
  Banknote,
  Percent,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ClinicReportsData } from "@/hooks/reports/use-clinic-reports"
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"

interface AdminReportsOverviewProps {
  data: ClinicReportsData
  onTabChange?: (tab: string) => void
}

function formatRwf(amount: number): string {
  return `${Math.round(amount).toLocaleString()} RWF`
}

function CustomTimelineTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-xl border border-border/80 rounded-xl p-3 shadow-xl text-xs space-y-1.5 min-w-[170px]">
        <p className="font-semibold text-foreground border-b border-border/50 pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-bold text-foreground">{Math.round(entry.value).toLocaleString()} RWF</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function AdminReportsOverview({ data, onTabChange }: AdminReportsOverviewProps) {
  const { overview, financialBreakdown } = data
  const genderTotal = (overview.maleCount || 0) + (overview.femaleCount || 0) + (overview.otherGenderCount || 0)
  const malePct = genderTotal > 0 ? Math.round((overview.maleCount / genderTotal) * 100) : 0
  const femalePct = genderTotal > 0 ? Math.round((overview.femaleCount / genderTotal) * 100) : 0
  const otherPct = genderTotal > 0 ? Math.max(0, 100 - malePct - femalePct) : 0

  const ageBrackets = overview.ageBrackets || { under18: 0, adults18to50: 0, seniors50plus: 0 }
  const ageTotal = ageBrackets.under18 + ageBrackets.adults18to50 + ageBrackets.seniors50plus
  const under18Pct = ageTotal > 0 ? Math.round((ageBrackets.under18 / ageTotal) * 100) : 0
  const adultsPct = ageTotal > 0 ? Math.round((ageBrackets.adults18to50 / ageTotal) * 100) : 0
  const seniorsPct = ageTotal > 0 ? Math.max(0, 100 - under18Pct - adultsPct) : 0

  return (
    <div className="space-y-4">
      {/* 1. TOP KPI GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {/* Total Patients */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground truncate">Total Patients</span>
            <div className="h-6 w-6 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <p className="text-base sm:text-lg font-bold text-foreground truncate">{overview.totalPatients}</p>
            <p className="text-[10px] text-muted-foreground truncate">{overview.totalVisits} visits total</p>
          </div>
        </div>

        {/* Total Gross Billed */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground truncate">Gross Billed</span>
            <div className="h-6 w-6 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <p className="text-base sm:text-lg font-bold text-foreground truncate">{formatRwf(overview.totalGrossBilled)}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate">{overview.settlementRatePct}% settled</p>
          </div>
        </div>

        {/* Insurance Expected */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground truncate">Insurance Share</span>
            <div className="h-6 w-6 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Building2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <p className="text-base sm:text-lg font-bold text-foreground truncate">{formatRwf(overview.insuranceCoveredAmount)}</p>
            <p className="text-[10px] text-muted-foreground truncate">
              {overview.totalGrossBilled > 0
                ? `${Math.round((overview.insuranceCoveredAmount / overview.totalGrossBilled) * 100)}% of gross`
                : "Claims portion"}
            </p>
          </div>
        </div>

        {/* Patient Cash Collected */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground truncate">Cash Collected</span>
            <div className="h-6 w-6 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <p className="text-base sm:text-lg font-bold text-foreground truncate">{formatRwf(overview.patientCashCollected)}</p>
            <p className="text-[10px] text-muted-foreground truncate">Direct patient payments</p>
          </div>
        </div>

        {/* Pending on Billing */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground truncate">Pending Billing</span>
            <div className="h-6 w-6 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Receipt className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <p className="text-base sm:text-lg font-bold text-foreground truncate">{formatRwf(overview.pendingBillingAmount)}</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 truncate">{overview.pendingBillingCount} unbilled items</p>
          </div>
        </div>

        {/* Waivers */}
        <div
          onClick={() => onTabChange?.("waivers")}
          className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-xs flex flex-col justify-between cursor-pointer hover:border-purple-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground truncate">Total Waivers</span>
            <div className="h-6 w-6 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Percent className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <p className="text-base sm:text-lg font-bold text-foreground truncate">{formatRwf(overview.waiverAmount)}</p>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 truncate">{overview.waiverCount} exemptions</p>
          </div>
        </div>

        {/* Giveaways */}
        <div
          onClick={() => onTabChange?.("waivers")}
          className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-xs flex flex-col justify-between cursor-pointer hover:border-rose-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground truncate">Giveaways</span>
            <div className="h-6 w-6 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Gift className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <p className="text-base sm:text-lg font-bold text-foreground truncate">{formatRwf(overview.giveawayAmount)}</p>
            <p className="text-[10px] text-rose-600 dark:text-rose-400 truncate">{overview.giveawayCount} absorbed</p>
          </div>
        </div>

        {/* Current Loans */}
        <div
          onClick={() => onTabChange?.("loans")}
          className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-xs flex flex-col justify-between cursor-pointer hover:border-red-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground truncate">Current Loans</span>
            <div className="h-6 w-6 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
              <HandCoins className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1">
            <p className="text-base sm:text-lg font-bold text-foreground truncate">{formatRwf(overview.patientLoanAmount)}</p>
            <p className="text-[10px] text-red-600 dark:text-red-400 truncate">{overview.loanCount} debtor balances</p>
          </div>
        </div>
      </div>

      {/* 2. REVENUE TIMELINE & DEMOGRAPHICS (SIDE-BY-SIDE ON DESKTOP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Timeline Chart (7 cols) */}
        <div className="lg:col-span-7 bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Clinic Cashflow & Revenue Timeline</h4>
              <p className="text-[11px] text-muted-foreground">Distribution of gross billed, collections, loans & absorbed giveaways</p>
            </div>
            <Badge variant="outline" className="text-[11px] py-0 px-2 bg-primary/10 text-primary border-primary/20">
              {data.period.toUpperCase()}
            </Badge>
          </div>

          <div className="w-full h-[250px] pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={financialBreakdown.moneyTimeline} margin={{ top: 12, right: 12, left: -16, bottom: 4 }}>
                <defs>
                  <linearGradient id="grossRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={true}
                  stroke="currentColor"
                  className="text-border/80 dark:text-border/60"
                  strokeOpacity={0.7}
                />
                <XAxis
                  dataKey="label"
                  stroke="currentColor"
                  className="text-[11px] font-medium text-foreground/80"
                  tickLine={{ stroke: "currentColor", className: "text-border" }}
                  axisLine={{ stroke: "currentColor", className: "text-border/80" }}
                  dy={4}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-[11px] font-medium text-foreground/80"
                  tickLine={{ stroke: "currentColor", className: "text-border" }}
                  axisLine={{ stroke: "currentColor", className: "text-border/80" }}
                  tickFormatter={(val) => val >= 1000 ? `${Math.round(val / 1000)}k` : `${val}`}
                />
                <Tooltip content={<CustomTimelineTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "8px", fontSize: "11px" }}
                  formatter={(value) => (
                    <span className="text-foreground font-medium text-xs mr-2">{value}</span>
                  )}
                />
                {/* Gross Trend Area & Line */}
                <Area
                  type="monotone"
                  dataKey="gross"
                  name="Gross Billed (Trend)"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="url(#grossRevenueGrad)"
                  dot={{ r: 3, fill: "#2563eb", strokeWidth: 1, stroke: "#ffffff" }}
                  activeDot={{ r: 5, fill: "#1d4ed8" }}
                />
                <Bar dataKey="collected" name="Patient Paid" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="insurance" name="Insurance" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="loan" name="Loans" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="giveaway" name="Giveaways" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={18} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics & Peak Hour (5 cols) */}
        <div className="lg:col-span-5 bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Patient Demographics & Peak Activity</h4>
            </div>
            <Badge variant="outline" className="text-[11px] py-0 px-2 bg-muted/40 font-normal">
              {genderTotal} patients
            </Badge>
          </div>

          {/* Gender Ratio */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-blue-600 dark:text-blue-400 text-[11px]">
                Male: {overview.maleCount} ({malePct}%)
              </span>
              <span className="text-pink-600 dark:text-pink-400 text-[11px]">
                Female: {overview.femaleCount} ({femalePct}%)
              </span>
            </div>
            <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden flex">
              <div className="bg-blue-500 h-full" style={{ width: `${malePct}%` }} />
              <div className="bg-pink-500 h-full" style={{ width: `${femalePct}%` }} />
              {otherPct > 0 && <div className="bg-purple-500 h-full" style={{ width: `${otherPct}%` }} />}
            </div>
          </div>

          {/* Age Distribution */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span>Age Brackets</span>
              <span>Avg Age: {overview.averageAge} yrs</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">&lt;18 yrs</span>
                  <span className="font-semibold text-foreground">{under18Pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full" style={{ width: `${under18Pct}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground block text-right">{ageBrackets.under18} pts</span>
              </div>
              <div className="p-2 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">18–50 yrs</span>
                  <span className="font-semibold text-foreground">{adultsPct}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${adultsPct}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground block text-right">{ageBrackets.adults18to50} pts</span>
              </div>
              <div className="p-2 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">50+ yrs</span>
                  <span className="font-semibold text-foreground">{seniorsPct}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${seniorsPct}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground block text-right">{ageBrackets.seniors50plus} pts</span>
              </div>
            </div>
          </div>

          {/* Peak Active Hour Card */}
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <div>
                <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 block">Peak Workflow Hour</span>
                <span className="text-xs font-bold text-foreground">{overview.peakActivityHour}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-700 dark:text-amber-300">
              Busiest Window
            </Badge>
          </div>
        </div>
      </div>

      {/* 3. DEPARTMENT & CLINICIAN EARNINGS SUMMARY CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Department Breakdown */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Top Departments by Turnover</h4>
            </div>
            <button
              type="button"
              onClick={() => onTabChange?.("earnings")}
              className="text-xs text-primary font-medium hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-2">
            {financialBreakdown.departmentBreakdown.slice(0, 5).map((dept) => (
              <div
                key={dept.departmentId}
                className="p-2.5 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between text-xs"
              >
                <div className="min-w-0">
                  <span className="font-semibold text-foreground block truncate">{dept.name}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {dept.visitsCount} visits • Ins: {formatRwf(dept.insurance)}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-foreground block">{formatRwf(dept.gross)}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    Paid: {formatRwf(dept.patientPaid)}
                  </span>
                </div>
              </div>
            ))}
            {financialBreakdown.departmentBreakdown.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No department billing recorded in period.</p>
            )}
          </div>
        </div>

        {/* Clinician Breakdown */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Clinician Contributions</h4>
            </div>
            <button
              type="button"
              onClick={() => onTabChange?.("earnings")}
              className="text-xs text-primary font-medium hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-2">
            {financialBreakdown.clinicianBreakdown.slice(0, 5).map((c) => (
              <div
                key={c.clinicianId}
                className="p-2.5 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between text-xs"
              >
                <div className="min-w-0">
                  <span className="font-semibold text-foreground block truncate">{c.name}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {c.consultationsCount} consultations • Pending: {formatRwf(c.pending)}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-foreground block">{formatRwf(c.gross)}</span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400">
                    Waived: {formatRwf(c.waivers)}
                  </span>
                </div>
              </div>
            ))}
            {financialBreakdown.clinicianBreakdown.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No clinician turnover recorded in period.</p>
            )}
          </div>
        </div>
      </div>

      {/* 4. PAYMENT MODES COLLECTION TILES */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Payment Collections by Channel</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Smartphone className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 block truncate">Mobile Money</span>
              <span className="text-sm font-bold text-foreground">{formatRwf(financialBreakdown.momoCollected)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Banknote className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 block truncate">Cash in Hand</span>
              <span className="text-sm font-bold text-foreground">{formatRwf(financialBreakdown.cashCollected)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <CreditCard className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400 block truncate">POS / Card</span>
              <span className="text-sm font-bold text-foreground">{formatRwf(financialBreakdown.cardCollected)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 block truncate">Bank Transfer</span>
              <span className="text-sm font-bold text-foreground">{formatRwf(financialBreakdown.bankTransferCollected)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
