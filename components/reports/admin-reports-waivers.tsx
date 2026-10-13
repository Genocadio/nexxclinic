"use client"

import React, { useState, useMemo } from "react"
import {
  Percent,
  Gift,
  Search,
  Download,
  Filter,
  AlertCircle,
  CheckCircle2,
  Calendar,
  FileSpreadsheet,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ClinicReportsData } from "@/hooks/reports/use-clinic-reports"

interface AdminReportsWaiversProps {
  data: ClinicReportsData
}

function formatRwf(amount: number): string {
  return `${Math.round(amount).toLocaleString()} RWF`
}

export function AdminReportsWaivers({ data }: AdminReportsWaiversProps) {
  const { overview, deepReports } = data
  const { waivers, giveaways } = deepReports

  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"ALL" | "FULL" | "PATIENT_SHARE" | "GIVEAWAY">("ALL")

  // Combine waivers and giveaways into unified list
  const unifiedRecords = useMemo(() => {
    const list: Array<{
      id: string
      patientName: string
      patientIdentifier: string
      departmentName: string
      clinicianName: string
      amount: number
      kind: "FULL" | "PATIENT_SHARE" | "GIVEAWAY"
      productName: string
      reason: string
      date: string
    }> = []

    waivers.forEach((w) => {
      list.push({
        id: w.id,
        patientName: w.patientName,
        patientIdentifier: w.patientIdentifier,
        departmentName: w.departmentName,
        clinicianName: w.clinicianName,
        amount: w.amount,
        kind: w.waiverType === "PATIENT_SHARE" ? "PATIENT_SHARE" : "FULL",
        productName: w.productName,
        reason: w.reason,
        date: w.date,
      })
    })

    giveaways.forEach((g) => {
      list.push({
        id: g.id,
        patientName: g.patientName,
        patientIdentifier: g.patientIdentifier,
        departmentName: g.departmentName,
        clinicianName: g.clinicianName,
        amount: g.amount,
        kind: "GIVEAWAY",
        productName: g.productName,
        reason: g.reason,
        date: g.date,
      })
    })

    // Sort by date desc
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return list
  }, [waivers, giveaways])

  const filteredRecords = useMemo(() => {
    return unifiedRecords.filter((item) => {
      if (filterType !== "ALL" && item.kind !== filterType) return false
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        item.patientName.toLowerCase().includes(q) ||
        item.patientIdentifier.toLowerCase().includes(q) ||
        item.departmentName.toLowerCase().includes(q) ||
        item.clinicianName.toLowerCase().includes(q) ||
        item.productName.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q)
      )
    })
  }, [unifiedRecords, filterType, searchQuery])

  const exportCsv = () => {
    const headers = ["Date", "Patient Name", "Identifier", "Type", "Department", "Clinician", "Product/Service", "Amount (RWF)", "Reason"]
    const rows = filteredRecords.map((r) => [
      `"${r.date}"`,
      `"${r.patientName}"`,
      `"${r.patientIdentifier}"`,
      `"${r.kind}"`,
      `"${r.departmentName}"`,
      `"${r.clinicianName}"`,
      `"${r.productName}"`,
      r.amount,
      `"${r.reason.replace(/"/g, '""')}"`,
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `clinic_waivers_giveaways_${data.fromDate}_to_${data.toDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400 block">Total Waivers (Exemptions)</span>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatRwf(overview.waiverAmount)}</p>
            <span className="text-[11px] text-muted-foreground">{overview.waiverCount} clinical fee waivers</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Percent className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400 block">Giveaways (Clinic Absorbed)</span>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatRwf(overview.giveawayAmount)}</p>
            <span className="text-[11px] text-muted-foreground">{overview.giveawayCount} absorbed balances</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Gift className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-primary block">Net Cost to Clinic</span>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatRwf(overview.waiverAmount + overview.giveawayAmount)}</p>
            <span className="text-[11px] text-muted-foreground">{overview.waiverCount + overview.giveawayCount} total interventions</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 2. SEARCH & SUB-FILTERS TOOLBAR */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant={filterType === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("ALL")}
            className="rounded-xl h-8 text-xs font-medium"
          >
            All Records ({unifiedRecords.length})
          </Button>
          <Button
            variant={filterType === "FULL" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("FULL")}
            className="rounded-xl h-8 text-xs font-medium"
          >
            Full Waivers
          </Button>
          <Button
            variant={filterType === "PATIENT_SHARE" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("PATIENT_SHARE")}
            className="rounded-xl h-8 text-xs font-medium"
          >
            Patient Share Waivers
          </Button>
          <Button
            variant={filterType === "GIVEAWAY" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("GIVEAWAY")}
            className="rounded-xl h-8 text-xs font-medium"
          >
            Giveaways (Absorbed)
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search patient, doctor, reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 rounded-xl text-xs bg-background/80"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            disabled={filteredRecords.length === 0}
            className="rounded-xl h-8 text-xs gap-1.5 shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* 3. INTERACTIVE WAIVERS TABLE */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <h4 className="text-sm font-semibold text-foreground">Detailed Waivers & Absorbed Giveaways Ledger</h4>
          <span className="text-xs text-muted-foreground">{filteredRecords.length} records found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-left">
                <th className="pb-2 font-medium">Patient</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Product / Service</th>
                <th className="pb-2 font-medium">Department</th>
                <th className="pb-2 font-medium">Clinician / User</th>
                <th className="pb-2 font-medium text-right">Waived Amount</th>
                <th className="pb-2 font-medium">Reason / Clinical Note</th>
                <th className="pb-2 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredRecords.map((item) => {
                const dateStr = item.date ? item.date.replace("T", " ").substring(0, 16) : "N/A"
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
                    <td className="py-2.5">
                      {item.kind === "FULL" && (
                        <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30">
                          Full Waiver
                        </Badge>
                      )}
                      {item.kind === "PATIENT_SHARE" && (
                        <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
                          Co-Pay Waived
                        </Badge>
                      )}
                      {item.kind === "GIVEAWAY" && (
                        <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30">
                          Giveaway
                        </Badge>
                      )}
                    </td>
                    <td className="py-2.5 font-medium text-foreground max-w-[160px] truncate">
                      {item.productName}
                    </td>
                    <td className="py-2.5 text-muted-foreground">{item.departmentName}</td>
                    <td className="py-2.5 text-foreground">{item.clinicianName}</td>
                    <td className="py-2.5 text-right font-bold text-foreground">
                      {formatRwf(item.amount)}
                    </td>
                    <td className="py-2.5 text-muted-foreground max-w-[200px] truncate" title={item.reason}>
                      {item.reason}
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground whitespace-nowrap">
                      {dateStr}
                    </td>
                  </tr>
                )
              })}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted-foreground text-xs">
                    No waivers or absorbed giveaways match the criteria in this date range.
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
