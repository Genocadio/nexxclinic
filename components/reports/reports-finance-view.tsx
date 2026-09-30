"use client"

import React from "react"
import {
  Wallet,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Gift,
  Download,
  Smartphone,
  Banknote,
  Landmark,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"
import type { UserReportsData } from "@/lib/user-reports-calculator"
import { formatRWF } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ReportsFinanceViewProps {
  data: UserReportsData
}

// Custom chart tooltip
function CustomMoneyTooltip({ active, payload, label }: any) {
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
            <span className="font-bold text-foreground">{formatRWF(entry.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function ReportsFinanceView({
  data,
}: ReportsFinanceViewProps) {
  const money = data.finance.money

  // Export financial summary to CSV
  const handleExportCSV = () => {
    const headers = ["Payment Mode / Settlement Channel", "Amount (RWF)", "Proportion", "Transaction Count / Details"]
    const rows = [
      ["Mobile Money (MoMo)", money.momoCollected, money.patientCashCollected > 0 ? `${Math.round((money.momoCollected / money.patientCashCollected) * 100)}% of collections` : "0%", money.paymentModesBreakdown["MOBILE_MONEY"]?.count || 0],
      ["Cash in Hand", money.cashCollected, money.patientCashCollected > 0 ? `${Math.round((money.cashCollected / money.patientCashCollected) * 100)}% of collections` : "0%", money.paymentModesBreakdown["CASH"]?.count || 0],
      ["POS / Card", money.cardCollected, money.patientCashCollected > 0 ? `${Math.round((money.cardCollected / money.patientCashCollected) * 100)}% of collections` : "0%", money.paymentModesBreakdown["CARD"]?.count || 0],
      ["Bank Transfer", money.bankTransferCollected, money.patientCashCollected > 0 ? `${Math.round((money.bankTransferCollected / money.patientCashCollected) * 100)}% of collections` : "0%", money.paymentModesBreakdown["BANK_TRANSFER"]?.count || 0],
      ["Total Patient Collections", money.patientCashCollected, money.totalGrossBilled > 0 ? `${Math.round((money.patientCashCollected / money.totalGrossBilled) * 100)}% of gross billed` : "0%", "-"],
      ["Insurance Receivables", money.insuranceCoveredAmount, money.totalGrossBilled > 0 ? `${Math.round((money.insuranceCoveredAmount / money.totalGrossBilled) * 100)}% of gross billed` : "0%", "-"],
      ["Patient Loans / Credit", money.patientLoanAmount, money.totalGrossBilled > 0 ? `${Math.round((money.patientLoanAmount / money.totalGrossBilled) * 100)}% of gross billed` : "0%", `${money.loanCount} encounters`],
      ["Giveaways / Waived", money.giveawayAmount, money.totalGrossBilled > 0 ? `${Math.round((money.giveawayAmount / money.totalGrossBilled) * 100)}% of gross billed` : "0%", `${money.giveawayCount} items`],
      ["Total Gross Invoiced", money.totalGrossBilled, "100%", "-"],
    ]

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `billing-settlement-report-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Period Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/70 backdrop-blur-xl border border-border/60 p-3 sm:p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              Money & Settlement Report
              <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                Finance & Billing
              </Badge>
            </h2>
            <p className="text-xs text-muted-foreground">
              Direct collections across payment modes, insurance coverage, patient debt, and exemptions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-start sm:justify-end shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-8 px-3 text-xs rounded-xl border-border/80 gap-1.5 text-foreground hover:bg-muted/80"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            Export Breakdown
          </Button>
        </div>
      </div>

      {/* Top Money KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Gross Billed */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Invoiced Amount</span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-3">{formatRWF(money.totalGrossBilled)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Gross billing volume across all payers
          </p>
        </div>

        {/* Insurance Share */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Insurance Receivables</span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-3">{formatRWF(money.insuranceCoveredAmount)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {money.totalGrossBilled > 0
              ? `${Math.round((money.insuranceCoveredAmount / money.totalGrossBilled) * 100)}% of total invoiced`
              : "Covered by insurers"}
          </p>
        </div>

        {/* Patient Cash Collected */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Direct Collections</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-3">{formatRWF(money.patientCashCollected)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Paid via MoMo, Cash, POS Cards & Bank
          </p>
        </div>

        {/* Patient Loan & Giveaway Combined */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Patient Loans & Giveaways</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="text-2xl font-bold text-foreground">
              {formatRWF(money.patientLoanAmount + money.giveawayAmount)}
            </p>
          </div>
          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              Loan: {formatRWF(money.patientLoanAmount)} ({money.loanCount})
            </span>
            <span className="text-pink-600 dark:text-pink-400 font-medium">
              Waived: {formatRWF(money.giveawayAmount)} ({money.giveawayCount})
            </span>
          </div>
        </div>
      </div>

      {/* Payment Modes & Settlement Channels Detailed Grid */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Payment Modes & Settlement Channels
          </h3>
          <p className="text-xs text-muted-foreground">
            Summary of all financial collections, credit instruments, exemptions, and billing receivables
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* 1. Mobile Money (MoMo) */}
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Mobile Money (MoMo)
              </span>
              <Badge variant="outline" className="text-[10px] bg-card border-amber-500/30 text-amber-600 dark:text-amber-400">
                MoMo / Airtel
              </Badge>
            </div>
            <p className="text-xl font-bold text-foreground">{formatRWF(money.momoCollected)}</p>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-amber-500/20">
              <span>
                {money.patientCashCollected > 0
                  ? `${Math.round((money.momoCollected / money.patientCashCollected) * 100)}% of collections`
                  : "0%"}
              </span>
              <span>{money.paymentModesBreakdown["MOBILE_MONEY"]?.count || 0} payments</span>
            </div>
          </div>

          {/* 2. Cash in Hand */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Cash in Hand
              </span>
              <Badge variant="outline" className="text-[10px] bg-card border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                Physical Cash
              </Badge>
            </div>
            <p className="text-xl font-bold text-foreground">{formatRWF(money.cashCollected)}</p>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-emerald-500/20">
              <span>
                {money.patientCashCollected > 0
                  ? `${Math.round((money.cashCollected / money.patientCashCollected) * 100)}% of collections`
                  : "0%"}
              </span>
              <span>{money.paymentModesBreakdown["CASH"]?.count || 0} payments</span>
            </div>
          </div>

          {/* 3. Patient Loans / Debt */}
          <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 dark:bg-orange-500/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                Patient Loans / Credit
              </span>
              <Badge variant="outline" className="text-[10px] bg-card border-orange-500/30 text-orange-600 dark:text-orange-400">
                Outstanding Debt
              </Badge>
            </div>
            <p className="text-xl font-bold text-foreground">{formatRWF(money.patientLoanAmount)}</p>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-orange-500/20">
              <span>
                {money.totalGrossBilled > 0
                  ? `${Math.round((money.patientLoanAmount / money.totalGrossBilled) * 100)}% of gross billed`
                  : "0%"}
              </span>
              <span>{money.loanCount} encounters</span>
            </div>
          </div>

          {/* 4. Giveaways / Waived Shares */}
          <div className="p-4 rounded-xl border border-pink-500/20 bg-pink-500/5 dark:bg-pink-500/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Gift className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                Giveaways / Waived
              </span>
              <Badge variant="outline" className="text-[10px] bg-card border-pink-500/30 text-pink-600 dark:text-pink-400">
                Social Exemption
              </Badge>
            </div>
            <p className="text-xl font-bold text-foreground">{formatRWF(money.giveawayAmount)}</p>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-pink-500/20">
              <span>
                {money.totalGrossBilled > 0
                  ? `${Math.round((money.giveawayAmount / money.totalGrossBilled) * 100)}% of gross billed`
                  : "0%"}
              </span>
              <span>{money.giveawayCount} items</span>
            </div>
          </div>
        </div>

        {/* Secondary Channels row: Cards, Bank, Insurance, Gross Invoiced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Card / POS */}
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-violet-500" />
                POS / Card
              </span>
              <p className="text-sm font-bold text-foreground">{formatRWF(money.cardCollected)}</p>
            </div>
            <Badge variant="outline" className="text-[10px] bg-card">
              {money.paymentModesBreakdown["CARD"]?.count || 0} txn
            </Badge>
          </div>

          {/* Bank Transfer */}
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Landmark className="h-3.5 w-3.5 text-blue-500" />
                Bank Transfer
              </span>
              <p className="text-sm font-bold text-foreground">{formatRWF(money.bankTransferCollected)}</p>
            </div>
            <Badge variant="outline" className="text-[10px] bg-card">
              {money.paymentModesBreakdown["BANK_TRANSFER"]?.count || 0} txn
            </Badge>
          </div>

          {/* Insurance Covered */}
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Insurance Covered
              </span>
              <p className="text-sm font-bold text-foreground">{formatRWF(money.insuranceCoveredAmount)}</p>
            </div>
            <Badge variant="outline" className="text-[10px] bg-card text-blue-600 dark:text-blue-400">
              Receivables
            </Badge>
          </div>

          {/* Total Invoiced Volume */}
          <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                Gross Invoiced
              </span>
              <p className="text-sm font-bold text-foreground">{formatRWF(money.totalGrossBilled)}</p>
            </div>
            <Badge variant="default" className="text-[10px] bg-primary text-primary-foreground">
              100% Total
            </Badge>
          </div>
        </div>
      </div>

      {/* Financial Flow Timeline & Settlement Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Flow Timeline Chart */}
        <div className="lg:col-span-2 bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Financial Flow Timeline</h3>
              <p className="text-xs text-muted-foreground">
                Breakdown of gross invoiced volume into Insurance, Cash, Loans, and Giveaways
              </p>
            </div>
          </div>

          {money.moneyTimeline.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-xs text-muted-foreground">
              No monetary transactions recorded for this period.
            </div>
          ) : (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={money.moneyTimeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                  <XAxis dataKey="label" stroke="currentColor" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="currentColor"
                    className="text-xs text-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
                  />
                  <Tooltip content={<CustomMoneyTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
                  <Bar dataKey="insurance" name="Insurance Share" fill="#4453C8" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="patientCash" name="Direct Collections" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="loan" name="Patient Loan" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="giveaway" name="Giveaways" fill="#EC4899" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Settlement Summary & Collection Rate */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-foreground">Settlement Summary</h3>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                {money.settlementRatePct}% Settled
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Distribution and recovery of gross invoiced volume
            </p>

            <div className="space-y-3">
              {/* Insurance Share */}
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  Insurance Share
                </span>
                <span className="font-bold text-foreground">{formatRWF(money.insuranceCoveredAmount)}</span>
              </div>

              {/* Direct Collections */}
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  Direct Collections
                </span>
                <span className="font-bold text-foreground">{formatRWF(money.patientCashCollected)}</span>
              </div>

              {/* Patient Loan */}
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Patient Loan
                </span>
                <div className="text-right">
                  <span className="font-bold text-foreground">{formatRWF(money.patientLoanAmount)}</span>
                  {money.loanCount > 0 && (
                    <span className="block text-[10px] text-muted-foreground">({money.loanCount} encounters)</span>
                  )}
                </div>
              </div>

              {/* Giveaways */}
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-pink-500/5 border border-pink-500/20">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <Gift className="h-4 w-4 text-pink-600" />
                  Giveaway / Waived
                </span>
                <div className="text-right">
                  <span className="font-bold text-foreground">{formatRWF(money.giveawayAmount)}</span>
                  {money.giveawayCount > 0 && (
                    <span className="block text-[10px] text-muted-foreground">({money.giveawayCount} items)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-border/60 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground">Total Invoiced:</span>
              <span className="font-bold text-foreground text-sm">{formatRWF(money.totalGrossBilled)}</span>
            </div>
            {money.outstandingBalance > 0 && (
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                <span className="font-medium">Outstanding Balance:</span>
                <span className="font-bold">{formatRWF(money.outstandingBalance)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
