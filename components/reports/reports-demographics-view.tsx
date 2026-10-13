"use client"

import React, { useMemo } from "react"
import {
  Users,
  UserCheck,
  Activity,
  Clock,
  Flame,
  CheckCircle2,
  Pill,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Building2,
  Receipt,
  Sparkles,
} from "lucide-react"
import type { UserReportsData } from "@/lib/user-reports-calculator"
import { ReportsChart } from "@/components/reports/reports-chart"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ReportsDemographicsViewProps {
  data: UserReportsData
  periodLabel?: string
}

export function ReportsDemographicsView({
  data,
  periodLabel,
}: ReportsDemographicsViewProps) {
  const demographics = data.demographics ?? data.clinician?.demographics

  const totalPatients = demographics?.totalPatientsCount || data.uniquePatientsTouched || 0
  const maleCount = demographics?.maleCount || 0
  const femaleCount = demographics?.femaleCount || 0
  const otherGenderCount = demographics?.otherGenderCount || 0
  const averageAge = demographics?.averageAge || 0
  const ageBrackets = demographics?.ageBrackets || { under18: 0, adults18to50: 0, seniors50plus: 0 }
  const peakActivityHour = demographics?.peakActivityHour || "N/A"
  const averageDurationMinutes = demographics?.averageEncounterTimeMinutes || 0

  // Gender percentages
  const genderTotal = maleCount + femaleCount + otherGenderCount
  const malePct = genderTotal > 0 ? Math.round((maleCount / genderTotal) * 100) : 0
  const femalePct = genderTotal > 0 ? Math.round((femaleCount / genderTotal) * 100) : 0
  const otherPct = genderTotal > 0 ? Math.max(0, 100 - malePct - femalePct) : 0

  // Age brackets percentages
  const ageTotal = ageBrackets.under18 + ageBrackets.adults18to50 + ageBrackets.seniors50plus
  const under18Pct = ageTotal > 0 ? Math.round((ageBrackets.under18 / ageTotal) * 100) : 0
  const adultsPct = ageTotal > 0 ? Math.round((ageBrackets.adults18to50 / ageTotal) * 100) : 0
  const seniorsPct = ageTotal > 0 ? Math.max(0, 100 - under18Pct - adultsPct) : 0

  // Role Metrics
  const consultationsCount = data.clinician?.consultationsCount || 0
  const consultationsCompleted = data.clinician?.consultationsCompletedCount || 0
  const completionRate =
    consultationsCount > 0 ? Math.round((consultationsCompleted / consultationsCount) * 100) : 100
  const prescriptionsCount = data.clinician?.prescriptionsCount || 0

  const nursingActsCount = data.nurse?.nursingActsCount || 0
  const vitalsRecordedCount = data.nurse?.vitalsRecordedCount || 0
  const triageEncountersCount = data.nurse?.triageEncountersCount || 0

  const visitsInitiatedCount = data.reception?.visitsInitiatedCount || 0
  const departmentsDispatchedCount = data.reception?.departmentsDispatchedCount || 0
  const insuredVisits = data.reception?.insuredVisitsCount || 0
  const privateVisits = data.reception?.privateVisitsCount || 0
  const totalVisits = insuredVisits + privateVisits

  // Dynamic Role Card #2
  const roleCard = useMemo(() => {
    if (data.hasClinician || consultationsCount > 0) {
      return {
        label: "Consultations",
        value: `${consultationsCount}`,
        subtitle: `${consultationsCompleted} completed (${completionRate}%)`,
        icon: Stethoscope,
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      }
    }
    if (data.hasNurse || (nursingActsCount + vitalsRecordedCount) > 0) {
      return {
        label: "Nursing Actions",
        value: `${nursingActsCount + vitalsRecordedCount}`,
        subtitle: `${vitalsRecordedCount} vitals recorded`,
        icon: HeartPulse,
        color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      }
    }
    if (data.hasReception || visitsInitiatedCount > 0) {
      return {
        label: "Visits Initiated",
        value: `${visitsInitiatedCount}`,
        subtitle: `${departmentsDispatchedCount} dispatched`,
        icon: Building2,
        color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      }
    }
    return {
      label: "Total Actions",
      value: `${data.totalInteractions}`,
      subtitle: "Recorded interactions",
      icon: Activity,
      color: "bg-primary/10 text-primary",
    }
  }, [
    data.hasClinician,
    data.hasNurse,
    data.hasReception,
    consultationsCount,
    consultationsCompleted,
    completionRate,
    nursingActsCount,
    vitalsRecordedCount,
    visitsInitiatedCount,
    departmentsDispatchedCount,
    data.totalInteractions,
  ])

  // Dynamic Secondary Card #3
  const secondaryCard = useMemo(() => {
    if (data.hasClinician || prescriptionsCount > 0) {
      return {
        label: "Prescriptions & Orders",
        value: `${prescriptionsCount}`,
        subtitle: "Drugs & clinical items",
        icon: Pill,
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      }
    }
    if (data.hasNurse || triageEncountersCount > 0) {
      return {
        label: "Triage Encounters",
        value: `${triageEncountersCount}`,
        subtitle: "Initial assessments",
        icon: Activity,
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      }
    }
    if (data.hasReception) {
      return {
        label: "Departments Dispatched",
        value: `${departmentsDispatchedCount}`,
        subtitle: "Queues assigned",
        icon: Building2,
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      }
    }
    return {
      label: "Recorded Workflow",
      value: `${data.totalInteractions}`,
      subtitle: "System events",
      icon: Receipt,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    }
  }, [
    data.hasClinician,
    data.hasNurse,
    data.hasReception,
    prescriptionsCount,
    triageEncountersCount,
    departmentsDispatchedCount,
    data.totalInteractions,
  ])

  return (
    <div className="space-y-3.5">
      {/* 1. SINGLE UNIFIED ROW OF COMPACT KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {/* Card 1: Total Patients */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-xs flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[12px] font-medium text-muted-foreground block truncate">
              Patients in Total
            </span>
            <p className="text-base sm:text-lg font-bold text-foreground truncate mt-0.5">
              {totalPatients}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {genderTotal > 0 ? `${maleCount}M • ${femaleCount}F` : "Unique patients"}
            </p>
          </div>
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="h-4 w-4" />
          </div>
        </div>

        {/* Card 2: Primary Role Metric */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-xs flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[12px] font-medium text-muted-foreground block truncate">
              {roleCard.label}
            </span>
            <p className="text-base sm:text-lg font-bold text-foreground truncate mt-0.5">
              {roleCard.value}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {roleCard.subtitle}
            </p>
          </div>
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${roleCard.color}`}>
            <roleCard.icon className="h-4 w-4" />
          </div>
        </div>

        {/* Card 3: Secondary Role Metric */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-xs flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[12px] font-medium text-muted-foreground block truncate">
              {secondaryCard.label}
            </span>
            <p className="text-base sm:text-lg font-bold text-foreground truncate mt-0.5">
              {secondaryCard.value}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {secondaryCard.subtitle}
            </p>
          </div>
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${secondaryCard.color}`}>
            <secondaryCard.icon className="h-4 w-4" />
          </div>
        </div>

        {/* Card 4: Average Age */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-xs flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[12px] font-medium text-muted-foreground block truncate">
              Average Patient Age
            </span>
            <p className="text-base sm:text-lg font-bold text-foreground truncate mt-0.5">
              {averageAge > 0 ? `${averageAge} yrs` : "N/A"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {ageTotal > 0
                ? `<18: ${ageBrackets.under18} • 18-50: ${ageBrackets.adults18to50} • 50+: ${ageBrackets.seniors50plus}`
                : "Across all ages"}
            </p>
          </div>
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <UserCheck className="h-4 w-4" />
          </div>
        </div>

        {/* Card 5: High Active Hour & Flow */}
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-xs flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[12px] font-medium text-muted-foreground block truncate">
              High Active Hour
            </span>
            <p className="text-base sm:text-lg font-bold text-foreground truncate mt-0.5">
              {peakActivityHour}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {averageDurationMinutes > 0 ? `Avg ${averageDurationMinutes}m / patient` : "Busiest workflow window"}
            </p>
          </div>
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* 2. SIDE-BY-SIDE 2-COLUMN BALANCED LAYOUT ON PC (Chart + Demographics) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left Column (7 cols): Compact Activity Timeline */}
        <div className="lg:col-span-7 flex flex-col min-h-0">
          <ReportsChart data={data} activeTab="overview" compact className="flex-1 h-full" />
        </div>

        {/* Right Column (5 cols): Compact Demographics & Clinical Workflow */}
        <div className="lg:col-span-5 bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                Patient Demographics & Flow
              </h4>
            </div>
            <Badge variant="outline" className="text-[11px] py-0 px-1.5 bg-muted/40 font-normal">
              {genderTotal > 0 ? `${genderTotal} profiles` : periodLabel || "Selected period"}
            </Badge>
          </div>

          {/* Gender Ratio Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-blue-600 dark:text-blue-400 text-[11px]">
                Male: {maleCount} ({malePct}%)
              </span>
              <span className="text-pink-600 dark:text-pink-400 text-[11px]">
                Female: {femaleCount} ({femalePct}%)
              </span>
            </div>
            <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-500 h-full transition-all duration-500"
                style={{ width: `${malePct}%` }}
              />
              <div
                className="bg-pink-500 h-full transition-all duration-500"
                style={{ width: `${femalePct}%` }}
              />
              {otherPct > 0 && (
                <div
                  className="bg-purple-500 h-full transition-all duration-500"
                  style={{ width: `${otherPct}%` }}
                />
              )}
            </div>
          </div>

          {/* Age Brackets Mini Rows */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span>Age Distribution</span>
              <span>{ageTotal} patients</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {/* <18 */}
              <div className="p-2 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">&lt;18 yrs</span>
                  <span className="font-semibold text-foreground">{under18Pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${under18Pct}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground block text-right">{ageBrackets.under18} pts</span>
              </div>

              {/* 18-50 */}
              <div className="p-2 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">18–50 yrs</span>
                  <span className="font-semibold text-foreground">{adultsPct}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${adultsPct}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground block text-right">{ageBrackets.adults18to50} pts</span>
              </div>

              {/* 50+ */}
              <div className="p-2 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">50+ yrs</span>
                  <span className="font-semibold text-foreground">{seniorsPct}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${seniorsPct}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground block text-right">{ageBrackets.seniors50plus} pts</span>
              </div>
            </div>
          </div>

          {/* Operational Progress / Completion Rate */}
          <div className="pt-1 border-t border-border/50 space-y-1.5">
            {consultationsCount > 0 ? (
              <>
                <div className="flex justify-between items-center text-[11px] font-medium">
                  <span className="text-foreground">Consultation Completion</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {completionRate}% ({consultationsCompleted} of {consultationsCount})
                  </span>
                </div>
                <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                  {100 - completionRate > 0 && (
                    <div
                      className="bg-amber-400 h-full transition-all duration-500"
                      style={{ width: `${100 - completionRate}%` }}
                    />
                  )}
                </div>
              </>
            ) : totalVisits > 0 ? (
              <>
                <div className="flex justify-between items-center text-[11px] font-medium">
                  <span className="text-foreground">Payer Split</span>
                  <span className="text-primary font-semibold">
                    {insuredVisits} Insured • {privateVisits} Private
                  </span>
                </div>
                <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden flex">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${totalVisits > 0 ? Math.round((insuredVisits / totalVisits) * 100) : 0}%` }}
                  />
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${totalVisits > 0 ? Math.round((privateVisits / totalVisits) * 100) : 0}%` }}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between text-[11px] text-muted-foreground py-0.5">
                <span>Recorded Actions</span>
                <span className="font-semibold text-foreground">{data.totalInteractions} events</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
