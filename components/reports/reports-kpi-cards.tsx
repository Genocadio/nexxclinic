"use client"

import type React from "react"
import {
  Users,
  Building2,
  Stethoscope,
  HeartPulse,
  Receipt,
  FileCheck2,
  TrendingUp,
  Activity,
  CheckCircle2,
  Pill,
  Syringe,
  Wallet,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
} from "lucide-react"
import type { UserReportsData } from "@/lib/user-reports-calculator"
import { formatRWF } from "@/lib/utils"

interface ReportsKpiCardsProps {
  data: UserReportsData
  activeTab: string
}

export function ReportsKpiCards({ data, activeTab }: ReportsKpiCardsProps) {
  if (activeTab === "activity") {
    const cards = [
      {
        label: "Recorded Actions",
        value: data.totalInteractions,
        description: "Actions attributed to you",
        icon: Activity,
        color: "bg-primary/10 text-primary",
      },
      {
        label: "Patients Touched",
        value: data.uniquePatientsTouched,
        description: "Unique patients with activity",
        icon: Users,
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      },
      ...(data.hasReception
        ? [{
            label: "Departments Dispatched",
            value: data.reception.departmentsDispatchedCount,
            description: "Departments assigned by you",
            icon: Building2,
            color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
          }]
        : []),
      ...(data.hasClinician
        ? [{
            label: "Consultations",
            value: data.clinician.consultationsCount,
            description: `${data.clinician.consultationsCompletedCount} completed`,
            icon: Stethoscope,
            color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          }]
        : []),
      ...(data.hasNurse
        ? [{
            label: "Nursing Actions",
            value: data.nurse.vitalsRecordedCount + data.nurse.triageEncountersCount + data.nurse.nursingActsCount,
            description: "Vitals, triage and nursing acts",
            icon: HeartPulse,
            color: "bg-red-500/10 text-red-600 dark:text-red-400",
          }]
        : []),
      ...(data.canViewFinance && data.hasFinance
        ? [{
            label: "Items Billed",
            value: data.finance?.billedItemsCount ?? 0,
            description: "Billing actions attributed to you",
            icon: Receipt,
            color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          }]
        : []),
    ]

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mt-3">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </div>
        ))}
      </div>
    )
  }

  if (activeTab === "reception") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Visits Initiated</span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-3">{data.reception.visitsInitiatedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Patient check-ins started</p>
        </div>

        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Departments Dispatched</span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-3">{data.reception.departmentsDispatchedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Queues and services assigned</p>
        </div>

        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Insured Patients</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-3">{data.reception.insuredVisitsCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Covered with active insurance</p>
        </div>
      </div>
    )
  }

  if (activeTab === "clinician") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Consultations</span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-3">{data.clinician.consultationsCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Assigned as clinician</p>
        </div>

        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Completed</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-3">{data.clinician.consultationsCompletedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {data.clinician.consultationsInProgressCount} currently active/pending
          </p>
        </div>

        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Prescriptions & Orders</span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Pill className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-3">{data.clinician.prescriptionsCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Drugs, lab acts, or products ordered</p>
        </div>

        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Internal Referrals</span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-3">{data.clinician.referralsCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Sub-departments dispatched</p>
        </div>
      </div>
    )
  }

  if (activeTab === "nurse") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Vital Signs Recorded</span>
            <div className="h-9 w-9 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
              <HeartPulse className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-3">{data.nurse.vitalsRecordedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Sets of vital parameters taken</p>
        </div>

        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Triage Encounters</span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-3">{data.nurse.triageEncountersCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Patients triaged</p>
        </div>

        <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Nursing Acts & Consumables</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Syringe className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-3">{data.nurse.nursingActsCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Medical acts & materials logged</p>
        </div>
      </div>
    )
  }

  return null
}
