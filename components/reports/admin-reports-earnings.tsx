"use client"

import React from "react"
import {
  Pill,
  Activity,
  FlaskConical,
  Package,
  Stethoscope,
  Building2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ClinicReportsData } from "@/hooks/reports/use-clinic-reports"

interface AdminReportsEarningsProps {
  data: ClinicReportsData
}

function formatRwf(amount: number): string {
  return `${Math.round(amount).toLocaleString()} RWF`
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  DRUG: {
    label: "Pharmacy & Drugs",
    icon: Pill,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  MEDICAL_ACT: {
    label: "Medical Procedures",
    icon: Activity,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  BIOLOGICAL_ACT: {
    label: "Laboratory & Diagnostics",
    icon: FlaskConical,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  CONSUMABLE_DEVICE: {
    label: "Consumables & Devices",
    icon: Package,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  CONSULTATION: {
    label: "Consultation & Fees",
    icon: Stethoscope,
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
}

export function AdminReportsEarnings({ data }: AdminReportsEarningsProps) {
  const { overview, financialBreakdown } = data
  const { categoryBreakdown, insuranceBreakdown, departmentBreakdown, clinicianBreakdown } = financialBreakdown

  const totalCatGross = Object.values(categoryBreakdown).reduce((sum, c) => sum + (c.totalAmount || 0), 0)

  return (
    <div className="space-y-4">
      {/* 1. PRODUCT CATEGORY TURNOVER CARDS */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-foreground">Turnover by Clinical Product Category</h4>
          <span className="text-xs text-muted-foreground">Total: {formatRwf(totalCatGross || overview.totalGrossBilled)}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const entry = categoryBreakdown[key] || { count: 0, totalAmount: 0 }
            const sharePct = totalCatGross > 0 ? Math.round((entry.totalAmount / totalCatGross) * 100) : 0
            const Icon = config.icon

            return (
              <div
                key={key}
                className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground truncate">{config.label}</span>
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{formatRwf(entry.totalAmount)}</p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                    <span>{Math.round(entry.count)} items</span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                      {sharePct}% share
                    </Badge>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. INSURANCE CLAIMS & SETTLEMENT BREAKDOWN */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Insurance Payers & Claim Settlements</h4>
          </div>
          <Badge variant="outline" className="text-[11px] py-0 px-2 bg-muted/40 font-normal">
            {insuranceBreakdown.length} active payers
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-left">
                <th className="pb-2 font-medium">Insurance Company</th>
                <th className="pb-2 font-medium text-right">Total Billed</th>
                <th className="pb-2 font-medium text-right">Claim Expected (Ins)</th>
                <th className="pb-2 font-medium text-right">Patient Co-Pay Paid</th>
                <th className="pb-2 font-medium text-right">Outstanding Claim</th>
                <th className="pb-2 font-medium text-right">Claim Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {insuranceBreakdown.map((ins: any, idx) => {
                const insName = ins.name || ins.insuranceName || "Private / Insurance"
                const initials = (insName.substring(0, 2) || "IN").toUpperCase()
                const insSharePct = overview.totalGrossBilled > 0 ? Math.round((ins.totalAmount / overview.totalGrossBilled) * 100) : 0
                return (
                  <tr key={ins.id || `ins-${idx}`} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 font-semibold text-foreground flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                        {initials}
                      </div>
                      {insName}
                    </td>
                    <td className="py-2.5 text-right font-medium text-foreground">{formatRwf(ins.totalAmount || 0)}</td>
                    <td className="py-2.5 text-right text-indigo-600 dark:text-indigo-400 font-medium">{formatRwf(ins.insuranceCovered || 0)}</td>
                    <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-medium">{formatRwf(ins.patientPaid || ins.paidAmount || 0)}</td>
                    <td className="py-2.5 text-right text-red-600 dark:text-red-400 font-medium">{formatRwf(ins.outstanding || ins.loanAmount || 0)}</td>
                    <td className="py-2.5 text-right">
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                        {insSharePct}%
                      </Badge>
                    </td>
                  </tr>
                )
              })}
              {insuranceBreakdown.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-muted-foreground text-xs">
                    No insurance billing records in this period (private only or unbilled).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. DEPARTMENT REVENUE MATRIX */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Department Financial Performance</h4>
          </div>
          <Badge variant="outline" className="text-[11px] py-0 px-2 bg-muted/40 font-normal">
            {departmentBreakdown.length} departments
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-left">
                <th className="pb-2 font-medium">Department</th>
                <th className="pb-2 font-medium text-center">Visits</th>
                <th className="pb-2 font-medium text-right">Gross Billed</th>
                <th className="pb-2 font-medium text-right">Insurance</th>
                <th className="pb-2 font-medium text-right">Patient Paid</th>
                <th className="pb-2 font-medium text-right">Loans</th>
                <th className="pb-2 font-medium text-right">Absorbed / Waived</th>
                <th className="pb-2 font-medium text-right">Pending Billing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {departmentBreakdown.map((dept) => (
                <tr key={dept.departmentId} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-semibold text-foreground">{dept.name}</td>
                  <td className="py-2.5 text-center text-muted-foreground">{dept.visitsCount}</td>
                  <td className="py-2.5 text-right font-medium text-foreground">{formatRwf(dept.gross)}</td>
                  <td className="py-2.5 text-right text-indigo-600 dark:text-indigo-400">{formatRwf(dept.insurance)}</td>
                  <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400">{formatRwf(dept.patientPaid)}</td>
                  <td className="py-2.5 text-right text-red-600 dark:text-red-400">{formatRwf(dept.loans)}</td>
                  <td className="py-2.5 text-right text-purple-600 dark:text-purple-400">{formatRwf(dept.giveaways + dept.waivers)}</td>
                  <td className="py-2.5 text-right text-amber-600 dark:text-amber-400">{formatRwf(dept.pending)}</td>
                </tr>
              ))}
              {departmentBreakdown.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-muted-foreground text-xs">
                    No department data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CLINICIAN PERFORMANCE MATRIX */}
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Clinician Prescriptions & Turnover</h4>
          </div>
          <Badge variant="outline" className="text-[11px] py-0 px-2 bg-muted/40 font-normal">
            {clinicianBreakdown.length} clinicians
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-left">
                <th className="pb-2 font-medium">Clinician Name</th>
                <th className="pb-2 font-medium text-center">Consultations</th>
                <th className="pb-2 font-medium text-right">Gross Generated</th>
                <th className="pb-2 font-medium text-right">Insurance Share</th>
                <th className="pb-2 font-medium text-right">Patient Paid</th>
                <th className="pb-2 font-medium text-right">Pending on Bill</th>
                <th className="pb-2 font-medium text-right">Waivers Approved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {clinicianBreakdown.map((c) => (
                <tr key={c.clinicianId} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-semibold text-foreground">{c.name}</td>
                  <td className="py-2.5 text-center text-muted-foreground">{c.consultationsCount}</td>
                  <td className="py-2.5 text-right font-medium text-foreground">{formatRwf(c.gross)}</td>
                  <td className="py-2.5 text-right text-indigo-600 dark:text-indigo-400">{formatRwf(c.insurance)}</td>
                  <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400">{formatRwf(c.patientPaid)}</td>
                  <td className="py-2.5 text-right text-amber-600 dark:text-amber-400">{formatRwf(c.pending)}</td>
                  <td className="py-2.5 text-right text-purple-600 dark:text-purple-400">{formatRwf(c.waivers)}</td>
                </tr>
              ))}
              {clinicianBreakdown.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted-foreground text-xs">
                    No clinician records found in this timeframe.
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
