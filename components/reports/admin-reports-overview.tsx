"use client"

import React, { useMemo, useState, useEffect } from "react"
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
  CheckCircle2,
  CreditCard,
  Smartphone,
  Banknote,
  Percent,
  Filter,
  ExternalLink,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  X,
  FileSpreadsheet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

  const [isTableExpanded, setIsTableExpanded] = useState(false)
  const [expandedPayerId, setExpandedPayerId] = useState<string | null>(null)

  // Prevent background scroll when table is full-screen expanded
  useEffect(() => {
    if (isTableExpanded) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isTableExpanded])

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
      const recordedWaivers = (ins.giveawayAmount || 0) + (ins.waiverAmount || 0)
      const currentLoans = ins.loanAmount ?? ins.outstanding ?? 0
      // Accounting reconciliation: If recorded waivers are 0 and gross exceeds earnings + loans,
      // the difference represents absorbed clinical waivers so the row balances accurately
      const inferredWaivers = recordedWaivers === 0 && (ins.totalAmount || 0) > (totalEarnings + currentLoans)
        ? Math.max(0, (ins.totalAmount || 0) - (totalEarnings + currentLoans))
        : 0
      const giveawaysAndWaivers = recordedWaivers > 0 ? recordedWaivers : inferredWaivers
      const totalExpected = Math.round(totalEarnings + giveawaysAndWaivers + currentLoans)
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
      {/* Expanded Table Modal Backdrop */}
      {isTableExpanded && (
        <div
          className="fixed inset-0 z-[55] bg-background/80 backdrop-blur-sm transition-opacity"
          onClick={() => setIsTableExpanded(false)}
        />
      )}

      {/* 1. TOP FINANCIAL OVERVIEW TABLE (REVENUE BY PAYER) */}
      <div
        className={cn(
          "bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 transition-all",
          isTableExpanded && "fixed inset-2 sm:inset-4 lg:inset-6 z-[60] bg-background border border-border shadow-2xl min-h-0 flex flex-col overflow-hidden"
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground tracking-tight">Revenue by Payer</h3>
              <Badge variant="outline" className="text-[11px] py-0 px-2 bg-primary/10 text-primary border-primary/20 font-medium">
                Reconciliation
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Breakdown by insurance & private self-pay showing earnings, absorbed waivers, debt, and gross
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {(selectedInsuranceIds?.length > 0 || isPrivateOnly) && (
              <TooltipProvider delayDuration={150}>
                <UiTooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSelectPayer?.({ insuranceId: undefined, isPrivateOnly: false })}
                      className="h-8 w-8 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl"
                      aria-label="Clear payer filter"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Clear Payer Filter</TooltipContent>
                </UiTooltip>
              </TooltipProvider>
            )}

            <Badge variant="outline" className="text-xs py-1 px-2.5 bg-muted/40 font-mono">
              {payerRows.length} Payers
            </Badge>

            <TooltipProvider delayDuration={150}>
              <UiTooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsTableExpanded((prev) => !prev)}
                    className="h-8 w-8 rounded-xl border-border/80 text-foreground hover:bg-muted/80 shrink-0"
                    aria-label={isTableExpanded ? "Fit normal view" : "Expand table full screen"}
                  >
                    {isTableExpanded ? (
                      <Minimize2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Maximize2 className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isTableExpanded ? "Fit Normal View" : "Expand Table"}
                </TooltipContent>
              </UiTooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Tabular View */}
        <div className={cn(
          "overflow-x-auto -mx-1 sm:mx-0",
          isTableExpanded && "flex-1 min-h-0 overflow-y-auto"
        )}>
          <table className="w-full text-xs text-left border-collapse min-w-[850px]">
            <thead className={cn(isTableExpanded && "sticky top-0 z-20 bg-background/95 backdrop-blur-xl shadow-xs")}>
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
                const isRowOpen = expandedPayerId === row.id
                return (
                  <React.Fragment key={row.id}>
                    <tr
                      onClick={() => onSelectPayer?.({ insuranceId: row.isPrivate ? undefined : row.id, isPrivateOnly: row.isPrivate })}
                      className={cn(
                        "hover:bg-muted/30 transition-colors group cursor-pointer",
                        row.isSelected && "bg-primary/10 border-l-4 border-l-primary"
                      )}
                      title={row.isSelected ? "Click to clear filter" : `Click to filter report by ${row.name}`}
                    >
                      {/* Payer / Channel with accordion toggle */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedPayerId((prev) => (prev === row.id ? null : row.id))
                            }}
                            className="p-1 rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-transform"
                            title={isRowOpen ? "Collapse row details" : "Expand row details"}
                            aria-label="Toggle details"
                          >
                            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isRowOpen && "rotate-180 text-primary")} />
                          </button>
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

                    {/* Accordion Row Details */}
                    {isRowOpen && (
                      <tr className="bg-muted/20 border-b border-border/50 animate-in fade-in duration-200">
                        <td colSpan={8} className="py-3 px-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/60 p-3 rounded-xl border border-border/50">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1">
                              <div className="p-2 rounded-lg bg-background/80 border border-border/40">
                                <span className="text-[10px] text-muted-foreground block">Revenue Share</span>
                                <span className="text-xs font-bold text-primary">{earningsPct}% of all earnings</span>
                              </div>
                              <div className="p-2 rounded-lg bg-background/80 border border-border/40">
                                <span className="text-[10px] text-muted-foreground block">Average / Visit</span>
                                <span className="text-xs font-bold text-foreground">
                                  {row.visitsCount > 0 ? formatRwf(row.totalEarnings / row.visitsCount) : "—"}
                                </span>
                              </div>
                              <div className="p-2 rounded-lg bg-background/80 border border-border/40">
                                <span className="text-[10px] text-muted-foreground block">Recovery Rate</span>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                  {row.totalExpected > 0 ? `${Math.round((row.totalEarnings / row.totalExpected) * 100)}%` : "100%"}
                                </span>
                              </div>
                              <div className="p-2 rounded-lg bg-background/80 border border-border/40">
                                <span className="text-[10px] text-muted-foreground block">Outstanding Debt</span>
                                <span className={cn("text-xs font-bold", row.currentLoans > 0 ? "text-rose-600" : "text-emerald-600")}>
                                  {formatRwf(row.currentLoans)}
                                </span>
                              </div>
                            </div>

                            {onTabChange && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onSelectPayer?.({ insuranceId: row.isPrivate ? undefined : row.id, isPrivateOnly: row.isPrivate })
                                  onTabChange("detailed")
                                }}
                                className="h-8 px-3 text-xs rounded-xl border-border/70 gap-1.5 shrink-0 hover:bg-primary hover:text-primary-foreground transition-all"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>View Encounters</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
            <span className="font-semibold text-foreground">Reconciliation:</span>
            <span>Earnings ({formatRwf(grandTotals.totalEarnings)})</span>
            <span>+ Waivers ({formatRwf(grandTotals.giveawaysAndWaivers)})</span>
            <span>+ Loans ({formatRwf(grandTotals.currentLoans)})</span>
            <span>= <span className="font-semibold text-foreground">Expected ({formatRwf(grandTotals.totalExpected)})</span></span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {payerRows.length} Payer Channels
          </span>
        </div>
      </div>

      {/* 2. REVENUE TIMELINE */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div>
            <h4 className="text-sm font-semibold text-foreground">Revenue Timeline</h4>
            <p className="text-[11px] text-muted-foreground">Distribution of gross billed, collections, loans & absorbed giveaways</p>
          </div>
          <Badge variant="outline" className="text-[11px] py-0 px-2 bg-primary/10 text-primary border-primary/20">
            {data.period.toUpperCase()}
          </Badge>
        </div>

        <div className="w-full h-[280px] pt-3">
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


      {/* 4. DEPARTMENT & CLINICIAN EARNINGS SUMMARY CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Department Breakdown */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Top Departments</h4>
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
              <h4 className="text-sm font-semibold text-foreground">Clinician Revenue</h4>
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
        <h4 className="text-sm font-semibold text-foreground">Collections by Mode</h4>
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
