"use client"

import React, { useMemo } from "react"
import {
  Users,
  Wallet,
  Building2,
  Stethoscope,
  TrendingUp,
  Receipt,
  Gift,
  HandCoins,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  UserCheck,
  CreditCard,
  Smartphone,
  Banknote,
  Percent,
  Filter,
  ExternalLink,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ClinicReportsData } from "@/hooks/reports/use-clinic-reports"
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"

interface AdminReportsOverviewProps {
  data: ClinicReportsData
  onTabChange?: (tab: string) => void
  onSelectPayer?: (payer: { insuranceId?: string; isPrivateOnly?: boolean }) => void
  cliniciansRoster?: Array<{ id: string; name?: string; roles?: string[] }>
  selectedInsuranceIds?: string[]
  isPrivateOnly?: boolean
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

export function AdminReportsOverview({
  data,
  onTabChange,
  onSelectPayer,
  cliniciansRoster,
  selectedInsuranceIds = [],
  isPrivateOnly = false,
}: AdminReportsOverviewProps) {
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

  // Private vs Insured Patient Share calculation
  const privateEntry = financialBreakdown.insuranceBreakdown.find((i: any) => {
    const n = (i.name || i.insuranceName || "").toLowerCase()
    return n.includes("private") || n.includes("cash")
  })
  const privateAmount = (overview as any).privatePatientAmount ?? (privateEntry ? privateEntry.totalAmount : 0)
  const totalPatientPortion = overview.patientShareAmount || 0
  const insuredCoPay = Math.max(0, totalPatientPortion - privateAmount)

  // Combined Waivers + Absorbed Giveaways
  const totalWaiversAndGiveaways = (overview.waiverAmount || 0) + (overview.giveawayAmount || 0)
  const totalExemptionsCount = (overview.waiverCount || 0) + (overview.giveawayCount || 0)

  // Option 1: Net Realized Money Made = Insurance Share + Patient Cash Collected (Co-pays + Privates)
  // Waivers, giveaways, and unpaid debtor loans are excluded
  const totalMoneyMade = overview.totalMoneyMade ?? ((overview.insuranceCoveredAmount || 0) + (overview.patientCashCollected || 0))

  // Verified clinicians filter: exclude non-clinicians or cashiers who billed
  const verifiedClinicians = useMemo(() => {
    return (financialBreakdown.clinicianBreakdown || []).filter((c) => {
      if (!c.clinicianId || !c.name) return false
      const nameLower = c.name.toLowerCase().trim()
      if (nameLower === "n/a" || nameLower === "unassigned" || nameLower === "clinician") return false
      if (cliniciansRoster && cliniciansRoster.length > 0) {
        return cliniciansRoster.some((r) => r.id === c.clinicianId)
      }
      return true
    })
  }, [financialBreakdown.clinicianBreakdown, cliniciansRoster])

  // Construct unified payer rows (Insurances + Private / Cash)
  const payerRows = useMemo(() => {
    const list = financialBreakdown.insuranceBreakdown || []
    let hasPrivateInList = false

    const rows = list.map((ins: any) => {
      const rawName = ins.name || ins.insuranceName || "Unknown Payer"
      const isPrivate =
        rawName.toLowerCase().includes("private") ||
        rawName.toLowerCase().includes("cash") ||
        rawName.toLowerCase().includes("self")

      if (isPrivate) hasPrivateInList = true

      const visitsCount = ins.count || 0
      const insuranceShare = isPrivate ? 0 : (ins.insuranceCovered || 0)
      const patientPaid = isPrivate
        ? (ins.paidAmount ?? ins.patientPaid ?? ins.totalAmount ?? 0)
        : (ins.paidAmount ?? ins.patientPaid ?? 0)
      const totalEarnings = insuranceShare + patientPaid
      const giveawaysAndWaivers = (ins.giveawayAmount || 0) + (ins.waiverAmount || 0)
      const currentLoans = ins.loanAmount ?? ins.outstanding ?? 0
      const totalExpected = Math.max(
        ins.totalAmount || 0,
        totalEarnings + giveawaysAndWaivers + currentLoans
      )
      const isSelected = isPrivate
        ? isPrivateOnly
        : (ins.id ? selectedInsuranceIds?.includes(ins.id) : selectedInsuranceIds?.includes(rawName))

      return {
        id: ins.id || rawName,
        name: isPrivate ? "Private / Cash (Self-Pay)" : rawName,
        isPrivate,
        visitsCount,
        insuranceShare,
        patientPaid,
        totalEarnings,
        giveawaysAndWaivers,
        currentLoans,
        totalExpected,
        isSelected,
      }
    })

    // If private revenue exists in overview or there's private amount not yet represented in list:
    if (!hasPrivateInList && ((overview as any).privatePatientAmount > 0 || privateAmount > 0)) {
      const pAmt = (overview as any).privatePatientAmount || privateAmount
      rows.push({
        id: "private-cash",
        name: "Private / Cash (Self-Pay)",
        isPrivate: true,
        visitsCount: 0,
        insuranceShare: 0,
        patientPaid: pAmt,
        totalEarnings: pAmt,
        giveawaysAndWaivers: 0,
        currentLoans: 0,
        totalExpected: pAmt,
        isSelected: isPrivateOnly,
      })
    }

    return rows.sort((a, b) => b.totalEarnings - a.totalEarnings)
  }, [financialBreakdown.insuranceBreakdown, overview, privateAmount, selectedInsuranceIds, isPrivateOnly])

  // Compute Grand Totals across all payer channels
  const grandTotals = useMemo(() => {
    const sumVisits = payerRows.reduce((acc, r) => acc + r.visitsCount, 0)
    const sumInsShare = payerRows.reduce((acc, r) => acc + r.insuranceShare, 0)
    const sumPatPaid = payerRows.reduce((acc, r) => acc + r.patientPaid, 0)
    const sumEarnings = payerRows.reduce((acc, r) => acc + r.totalEarnings, 0)
    const sumGiveaways = payerRows.reduce((acc, r) => acc + r.giveawaysAndWaivers, 0)
    const sumLoans = payerRows.reduce((acc, r) => acc + r.currentLoans, 0)
    const sumExpected = payerRows.reduce((acc, r) => acc + r.totalExpected, 0)

    return {
      visitsCount: overview.totalVisits > sumVisits ? overview.totalVisits : sumVisits,
      insuranceShare: overview.insuranceCoveredAmount ?? sumInsShare,
      patientPaid: overview.patientCashCollected ?? sumPatPaid,
      totalEarnings: totalMoneyMade ?? ((overview.insuranceCoveredAmount || 0) + (overview.patientCashCollected || 0)),
      giveawaysAndWaivers: totalWaiversAndGiveaways > 0 ? totalWaiversAndGiveaways : sumGiveaways,
      currentLoans: overview.patientLoanAmount ?? sumLoans,
      totalExpected: overview.totalGrossBilled > 0 ? overview.totalGrossBilled : sumExpected,
    }
  }, [payerRows, overview, totalMoneyMade, totalWaiversAndGiveaways])

  return (
    <div className="space-y-4">
      {/* 1. TOP FINANCIAL OVERVIEW TABLE (INSURANCE & PRIVATE IN ROWS, GRAND TOTALS FOOTER) */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground tracking-tight">Financial Overview & Payer Breakdown</h3>
              <Badge variant="outline" className="text-[11px] py-0 px-2 bg-primary/10 text-primary border-primary/20 font-medium">
                Accounting Reconciliation
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tabular breakdown of revenue channels showing earnings, absorbed giveaways, outstanding loans, and gross expected
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(selectedInsuranceIds?.length > 0 || isPrivateOnly) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectPayer?.({ insuranceId: undefined, isPrivateOnly: false })}
                className="h-7 px-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg gap-1 font-medium"
              >
                Clear Payer Filter ✕
              </Button>
            )}
            <Badge variant="outline" className="text-xs py-1 px-2.5 bg-muted/40 font-mono">
              {payerRows.length} Payer Channels
            </Badge>
          </div>
        </div>

        {/* Tabular View */}
        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full text-xs text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-border/70 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold bg-muted/20">
                <th className="py-2.5 px-3 rounded-l-xl">Payer / Channel</th>
                <th className="py-2.5 px-3 text-center">Visits</th>
                <th className="py-2.5 px-3 text-right">Insurance Share</th>
                <th className="py-2.5 px-3 text-right">Patient Paid</th>
                <th className="py-2.5 px-3 text-right bg-primary/5 dark:bg-primary/10 text-primary font-bold">
                  Total Earnings (Money Made)
                </th>
                <th className="py-2.5 px-3 text-right">Giveaways & Waivers</th>
                <th className="py-2.5 px-3 text-right">Current Loans</th>
                <th className="py-2.5 px-3 text-right font-bold text-foreground rounded-r-xl">Total Expected (Gross)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {payerRows.map((row) => {
                const initials = (row.name.substring(0, 2) || "PA").toUpperCase()
                const earningsPct = grandTotals.totalEarnings > 0
                  ? Math.round((row.totalEarnings / grandTotals.totalEarnings) * 100)
                  : 0
                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectPayer?.({ insuranceId: row.isPrivate ? undefined : row.id, isPrivateOnly: row.isPrivate })}
                    className={cn(
                      "hover:bg-muted/30 transition-colors group cursor-pointer",
                      row.isSelected && "bg-primary/10 border-l-4 border-l-primary"
                    )}
                    title={row.isSelected ? "Click to clear filter" : `Click to filter report by ${row.name}`}
                  >
                    {/* Payer / Channel */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0",
                          row.isPrivate
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                        )}>
                          {row.isPrivate ? "PV" : initials}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground text-xs block truncate">{row.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {row.isPrivate ? "Direct Patient Self-Pay" : "Third-Party Insurer"}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] py-0 px-1.5 ml-1 shrink-0 font-medium",
                            row.isPrivate
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                              : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30"
                          )}
                        >
                          {row.isPrivate ? "Private" : "Insurance"}
                        </Badge>
                      </div>
                    </td>

                    {/* Visits */}
                    <td className="py-3 px-3 text-center">
                      <span className="font-medium text-foreground">{row.visitsCount}</span>
                      {grandTotals.visitsCount > 0 && (
                        <span className="text-[10px] text-muted-foreground block">
                          {Math.round((row.visitsCount / grandTotals.visitsCount) * 100)}%
                        </span>
                      )}
                    </td>

                    {/* Insurance Share */}
                    <td className="py-3 px-3 text-right">
                      {row.isPrivate ? (
                        <span className="text-muted-foreground text-xs">—</span>
                      ) : (
                        <div>
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {formatRwf(row.insuranceShare)}
                          </span>
                          {row.totalExpected > 0 && (
                            <span className="text-[10px] text-muted-foreground block">
                              {Math.round((row.insuranceShare / row.totalExpected) * 100)}% covered
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Patient Paid */}
                    <td className="py-3 px-3 text-right">
                      <div>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatRwf(row.patientPaid)}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          {row.isPrivate ? "100% direct cash" : "Patient co-pay"}
                        </span>
                      </div>
                    </td>

                    {/* Total Earnings / Money Made */}
                    <td className="py-3 px-3 text-right bg-primary/5 dark:bg-primary/10">
                      <div>
                        <span className="font-bold text-foreground text-sm">
                          {formatRwf(row.totalEarnings)}
                        </span>
                        <span className="text-[10px] text-primary font-medium block">
                          {earningsPct}% of total
                        </span>
                      </div>
                    </td>

                    {/* Giveaways & Waivers */}
                    <td className="py-3 px-3 text-right">
                      {row.giveawaysAndWaivers > 0 ? (
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {formatRwf(row.giveawaysAndWaivers)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>

                    {/* Current Loans */}
                    <td className="py-3 px-3 text-right">
                      {row.currentLoans > 0 ? (
                        <div>
                          <span className="font-bold text-rose-600 dark:text-rose-400">
                            {formatRwf(row.currentLoans)}
                          </span>
                          <span className="text-[10px] text-rose-500 block">unpaid balance</span>
                        </div>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">Settled ✓</span>
                      )}
                    </td>

                    {/* Total Expected / Gross */}
                    <td className="py-3 px-3 text-right font-bold text-foreground">
                      <span className="text-xs sm:text-sm">{formatRwf(row.totalExpected)}</span>
                    </td>
                  </tr>
                )
              })}

              {payerRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-xs text-muted-foreground">
                    No financial billing records found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>

            {/* GRAND TOTALS FOOTER */}
            <tfoot>
              <tr className="border-t-2 border-border/80 bg-muted/40 font-bold text-foreground">
                <td className="py-3.5 px-3 rounded-bl-xl">
                  <div className="flex items-center gap-2">
                    <span className="uppercase text-xs tracking-wider">Grand Total</span>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                      {payerRows.length} Payers
                    </Badge>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-center text-xs">
                  {grandTotals.visitsCount}
                </td>
                <td className="py-3.5 px-3 text-right text-indigo-600 dark:text-indigo-400">
                  {formatRwf(grandTotals.insuranceShare)}
                </td>
                <td className="py-3.5 px-3 text-right text-emerald-600 dark:text-emerald-400">
                  {formatRwf(grandTotals.patientPaid)}
                </td>
                <td className="py-3.5 px-3 text-right bg-primary/10 text-primary text-sm font-extrabold">
                  {formatRwf(grandTotals.totalEarnings)}
                </td>
                <td className="py-3.5 px-3 text-right text-purple-600 dark:text-purple-400">
                  {formatRwf(grandTotals.giveawaysAndWaivers)}
                </td>
                <td className="py-3.5 px-3 text-right text-rose-600 dark:text-rose-400">
                  {grandTotals.currentLoans > 0 ? formatRwf(grandTotals.currentLoans) : "0 RWF"}
                </td>
                <td className="py-3.5 px-3 text-right text-sm font-extrabold text-foreground rounded-br-xl">
                  {formatRwf(grandTotals.totalExpected)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Accounting Reconciliation Footnote */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-foreground">Reconciliation Formula:</span>
            <span>Total Earnings ({formatRwf(grandTotals.totalEarnings)})</span>
            <span>+ Giveaways & Waivers ({formatRwf(grandTotals.giveawaysAndWaivers)})</span>
            <span>+ Current Loans ({formatRwf(grandTotals.currentLoans)})</span>
            <span>= <span className="font-semibold text-foreground">Total Expected ({formatRwf(grandTotals.totalExpected)})</span></span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {payerRows.length} Payer Channels
          </span>
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


      {/* 4. DEPARTMENT & CLINICIAN EARNINGS SUMMARY CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Department Breakdown */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Top Departments by Turnover</h4>
            </div>
            <Badge variant="outline" className="text-[11px] py-0 px-2 bg-muted/40 font-normal">
              {financialBreakdown.departmentBreakdown.length} departments
            </Badge>
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

        {/* Clinician Breakdown (Verified Clinicians Only) */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Clinician Contributions</h4>
            </div>
            <Badge variant="outline" className="text-[11px] py-0 px-2 bg-muted/40 font-normal">
              {verifiedClinicians.length} clinicians
            </Badge>
          </div>

          <div className="space-y-2">
            {verifiedClinicians.slice(0, 5).map((c) => (
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
            {verifiedClinicians.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                No clinician turnover recorded in period.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 5. PAYMENT MODES COLLECTION TILES */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Payment Collections by Channel</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Smartphone className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-muted-foreground block truncate">Mobile Money</span>
              <span className="text-sm font-bold text-foreground">{formatRwf(financialBreakdown.momoCollected)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Banknote className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-muted-foreground block truncate">Cash in Hand</span>
              <span className="text-sm font-bold text-foreground">{formatRwf(financialBreakdown.cashCollected)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <CreditCard className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-muted-foreground block truncate">POS / Card</span>
              <span className="text-sm font-bold text-foreground">{formatRwf(financialBreakdown.cardCollected)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-muted-foreground block truncate">Bank Transfer</span>
              <span className="text-sm font-bold text-foreground">{formatRwf(financialBreakdown.bankTransferCollected)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
