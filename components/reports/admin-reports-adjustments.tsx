"use client"

import React, { useState, useMemo } from "react"
import {
  SlidersHorizontal,
  Search,
  Download,
  AlertCircle,
  FileSpreadsheet,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ClinicReportsData } from "@/hooks/reports/use-clinic-reports"

interface AdminReportsAdjustmentsProps {
  data: ClinicReportsData
}

function formatRwf(amount: number): string {
  return `${Math.round(amount).toLocaleString()} RWF`
}

export function AdminReportsAdjustments({ data }: AdminReportsAdjustmentsProps) {
  const { deepReports } = data
  const { adjustments } = deepReports

  const [searchQuery, setSearchQuery] = useState("")

  const filteredAdjustments = useMemo(() => {
    if (!searchQuery.trim()) return adjustments
    const q = searchQuery.toLowerCase()
    return adjustments.filter(
      (a) =>
        a.patientName.toLowerCase().includes(q) ||
        a.patientIdentifier.toLowerCase().includes(q) ||
        a.departmentName.toLowerCase().includes(q) ||
        a.clinicianName.toLowerCase().includes(q) ||
        a.productName.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q)
    )
  }, [adjustments, searchQuery])

  const totalVariance = adjustments.reduce((sum, a) => sum + (a.difference || 0), 0)

  const exportCsv = () => {
    const headers = ["Date", "Patient Name", "Identifier", "Department", "Clinician", "Product", "Catalog Price (RWF)", "Adjusted Price (RWF)", "Difference (RWF)", "Reason"]
    const rows = filteredAdjustments.map((r) => [
      `"${r.date}"`,
      `"${r.patientName}"`,
      `"${r.patientIdentifier}"`,
      `"${r.departmentName}"`,
      `"${r.clinicianName}"`,
      `"${r.productName}"`,
      r.originalPrice,
      r.adjustedPrice,
      r.difference,
      `"${r.reason.replace(/"/g, '""')}"`,
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `clinic_price_adjustments_${data.fromDate}_to_${data.toDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 block">Total Price Adjustments</span>
            <p className="text-xl font-bold text-foreground mt-0.5">{adjustments.length}</p>
            <span className="text-[11px] text-muted-foreground">Recorded manual price modifications</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 block">Total Price Variance</span>
            <p className="text-xl font-bold text-foreground mt-0.5">{formatRwf(totalVariance)}</p>
            <span className="text-[11px] text-muted-foreground">Cumulative discount / variance applied</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ArrowDownRight className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-muted/50 border border-border/70 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground block">Average Adjustment Size</span>
            <p className="text-xl font-bold text-foreground mt-0.5">
              {adjustments.length > 0 ? formatRwf(totalVariance / adjustments.length) : "0 RWF"}
            </p>
            <span className="text-[11px] text-muted-foreground">Per adjusted service or item</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 2. SEARCH & CONTROLS */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search adjustments by patient, product, clinician..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 rounded-xl text-xs bg-background/80"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={exportCsv}
          disabled={filteredAdjustments.length === 0}
          className="rounded-xl h-8 text-xs gap-1.5 shrink-0"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>

      {/* 3. DETAILED ADJUSTMENTS TABLE */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <h4 className="text-sm font-semibold text-foreground">Price Overrides & Line Adjustments Log</h4>
          <span className="text-xs text-muted-foreground">{filteredAdjustments.length} logged adjustments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-left">
                <th className="pb-2 font-medium">Patient</th>
                <th className="pb-2 font-medium">Department</th>
                <th className="pb-2 font-medium">Clinician</th>
                <th className="pb-2 font-medium">Product / Service</th>
                <th className="pb-2 font-medium text-right">Standard Price</th>
                <th className="pb-2 font-medium text-right">Adjusted Price</th>
                <th className="pb-2 font-medium text-right">Variance</th>
                <th className="pb-2 font-medium">Reason</th>
                <th className="pb-2 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredAdjustments.map((item) => {
                const dateStr = item.date ? item.date.replace("T", " ").substring(0, 16) : "N/A"
                const isDiscount = item.originalPrice > item.adjustedPrice

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
                    <td className="py-2.5 text-muted-foreground">{item.departmentName}</td>
                    <td className="py-2.5 text-foreground">{item.clinicianName}</td>
                    <td className="py-2.5 font-medium text-foreground max-w-[160px] truncate">{item.productName}</td>
                    <td className="py-2.5 text-right text-muted-foreground">{formatRwf(item.originalPrice)}</td>
                    <td className="py-2.5 text-right font-semibold text-foreground">{formatRwf(item.adjustedPrice)}</td>
                    <td className="py-2.5 text-right font-bold">
                      <span className={isDiscount ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}>
                        {isDiscount ? "-" : "+"}{formatRwf(item.difference)}
                      </span>
                    </td>
                    <td className="py-2.5 text-muted-foreground max-w-[180px] truncate" title={item.reason}>
                      {item.reason}
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground whitespace-nowrap">{dateStr}</td>
                  </tr>
                )
              })}
              {filteredAdjustments.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-muted-foreground text-xs">
                    No price adjustments recorded in this period.
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
