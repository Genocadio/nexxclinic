"use client"

import React, { useState, useMemo } from "react"
import {
  HandCoins,
  Search,
  Download,
  Phone,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ClinicReportsData } from "@/hooks/reports/use-clinic-reports"

interface AdminReportsLoansProps {
  data: ClinicReportsData
}

function formatRwf(amount: number): string {
  return `${Math.round(amount).toLocaleString()} RWF`
}

export function AdminReportsLoans({ data }: AdminReportsLoansProps) {
  const { overview, deepReports } = data
  const { loans } = deepReports

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UNPAID" | "PARTIALLY_PAID">("ALL")

  const filteredLoans = useMemo(() => {
    return loans.filter((l) => {
      if (statusFilter !== "ALL" && l.status !== statusFilter) return false
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        l.patientName.toLowerCase().includes(q) ||
        l.patientIdentifier.toLowerCase().includes(q) ||
        l.patientPhone.toLowerCase().includes(q) ||
        l.departmentName.toLowerCase().includes(q) ||
        l.clinicianName.toLowerCase().includes(q) ||
        l.reason.toLowerCase().includes(q)
      )
    })
  }, [loans, statusFilter, searchQuery])

  const totalOutstanding = loans.reduce((sum, l) => sum + (l.outstandingAmount || 0), 0)
  const totalBilled = loans.reduce((sum, l) => sum + (l.totalBilled || 0), 0)
  const totalPaid = loans.reduce((sum, l) => sum + (l.paidAmount || 0), 0)

  const unpaidCount = loans.filter((l) => l.status === "UNPAID").length
  const partialCount = loans.filter((l) => l.status === "PARTIALLY_PAID").length

  const exportCsv = () => {
    const headers = [
      "Visit Date",
      "Patient Name",
      "Identifier",
      "Phone Number",
      "Department",
      "Clinician",
      "Total Billed (RWF)",
      "Paid Amount (RWF)",
      "Outstanding Loan (RWF)",
      "Status",
      "Promissory Reason",
    ]
    const rows = filteredLoans.map((r) => [
      `"${r.date}"`,
      `"${r.patientName}"`,
      `"${r.patientIdentifier}"`,
      `"${r.patientPhone}"`,
      `"${r.departmentName}"`,
      `"${r.clinicianName}"`,
      r.totalBilled,
      r.paidAmount,
      r.outstandingAmount,
      `"${r.status}"`,
      `"${r.reason.replace(/"/g, '""')}"`,
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `clinic_patient_loans_${data.fromDate}_to_${data.toDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-red-600 dark:text-red-400 block">Total Current Loans</span>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatRwf(totalOutstanding)}</p>
            <span className="text-[11px] text-muted-foreground">{loans.length} debtor patient files</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center">
            <HandCoins className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 block">Unpaid Debts</span>
            <p className="text-xl font-bold text-foreground mt-0.5">{unpaidCount}</p>
            <span className="text-[11px] text-muted-foreground">0% paid so far</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 block">Partially Paid</span>
            <p className="text-xl font-bold text-foreground mt-0.5">{partialCount}</p>
            <span className="text-[11px] text-muted-foreground">Recovered: {formatRwf(totalPaid)}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-muted/50 border border-border/70 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground block">Average Debt / Debtor</span>
            <p className="text-xl font-bold text-foreground mt-0.5">
              {loans.length > 0 ? formatRwf(totalOutstanding / loans.length) : "0 RWF"}
            </p>
            <span className="text-[11px] text-muted-foreground">Across all debtors</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 2. CONTROLS & SUB-FILTERS */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant={statusFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("ALL")}
            className="rounded-xl h-8 text-xs font-medium"
          >
            All Loans ({loans.length})
          </Button>
          <Button
            variant={statusFilter === "UNPAID" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("UNPAID")}
            className="rounded-xl h-8 text-xs font-medium"
          >
            Unpaid ({unpaidCount})
          </Button>
          <Button
            variant={statusFilter === "PARTIALLY_PAID" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("PARTIALLY_PAID")}
            className="rounded-xl h-8 text-xs font-medium"
          >
            Partially Paid ({partialCount})
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search patient, phone, file #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 rounded-xl text-xs bg-background/80"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            disabled={filteredLoans.length === 0}
            className="rounded-xl h-8 text-xs gap-1.5 shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* 3. PATIENT LOANS LEDGER TABLE */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <h4 className="text-sm font-semibold text-foreground">Current Patient Loans & Debtors Ledger</h4>
          <span className="text-xs text-muted-foreground">{filteredLoans.length} debtors listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-left">
                <th className="pb-2 font-medium">Patient Details</th>
                <th className="pb-2 font-medium">Contact</th>
                <th className="pb-2 font-medium">Department</th>
                <th className="pb-2 font-medium">Clinician</th>
                <th className="pb-2 font-medium text-right">Total Billed</th>
                <th className="pb-2 font-medium text-right">Paid Amount</th>
                <th className="pb-2 font-medium text-right text-red-600 dark:text-red-400">Outstanding Loan</th>
                <th className="pb-2 font-medium">Reason / Note</th>
                <th className="pb-2 font-medium text-center">Status</th>
                <th className="pb-2 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredLoans.map((item) => {
                const dateStr = item.date ? item.date.replace("T", " ").substring(0, 16) : "N/A"
                const isPartial = item.status === "PARTIALLY_PAID"

                return (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 font-semibold text-foreground">
                      <div className="min-w-[130px]">
                        <span>{item.patientName}</span>
                        {item.patientIdentifier && (
                          <span className="text-[10px] text-muted-foreground block font-mono">
                            {item.patientIdentifier}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {item.patientPhone ? (
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Phone className="h-3 w-3 text-primary shrink-0" />
                          <span>{item.patientPhone}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">No phone</span>
                      )}
                    </td>
                    <td className="py-2.5 text-muted-foreground">{item.departmentName}</td>
                    <td className="py-2.5 text-foreground">{item.clinicianName}</td>
                    <td className="py-2.5 text-right text-muted-foreground">{formatRwf(item.totalBilled)}</td>
                    <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                      {formatRwf(item.paidAmount)}
                    </td>
                    <td className="py-2.5 text-right font-bold text-red-600 dark:text-red-400">
                      {formatRwf(item.outstandingAmount)}
                    </td>
                    <td className="py-2.5 text-muted-foreground max-w-[180px] truncate" title={item.reason}>
                      {item.reason}
                    </td>
                    <td className="py-2.5 text-center">
                      <Badge
                        variant="outline"
                        className={
                          isPartial
                            ? "text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                            : "text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
                        }
                      >
                        {isPartial ? "Partial" : "Unpaid"}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground whitespace-nowrap">{dateStr}</td>
                  </tr>
                )
              })}
              {filteredLoans.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-muted-foreground text-xs">
                    No debtor records found matching the criteria in this date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
