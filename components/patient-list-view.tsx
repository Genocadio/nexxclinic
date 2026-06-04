"use client"

import type { Patient, Visit } from "@/lib/api-types"
import { VisitStatus } from "@/lib/api-types"
import {
  formatPatientGender,
  getPatientAge,
  getPatientDisplayName,
  getPatientPhone,
} from "@/lib/patient-display-utils"
import { ArrowLeft, History } from "lucide-react"
import { useMemo, useState } from "react"
import MedicalHistory from "@/components/medical-history"

type VisitSummaryStatus = "pending" | "ongoing" | "completed"

interface PatientVisitSummary {
  id: string
  date: string
  status: VisitSummaryStatus
  chiefComplaint?: string
  diagnosis?: string
}

function mapVisitStatusToSummary(status: Visit["status"]): VisitSummaryStatus {
  if (status === VisitStatus.COMPLETED) return "completed"
  if (status === VisitStatus.IN_PROGRESS) return "ongoing"
  return "pending"
}

function visitToSummary(visit: Visit): PatientVisitSummary {
  return {
    id: visit.id,
    date: visit.visitDate,
    status: mapVisitStatusToSummary(visit.status),
    chiefComplaint: "Visit",
  }
}

interface PatientListViewProps {
  patient: Patient
  onConsultationSelect: (visit: PatientVisitSummary) => void
  onNewConsultation: (patient: Patient) => void
  onBack: () => void
  patientsList: Patient[]
  setPatientsList: (patients: Patient[]) => void
  isCompletedPatient?: boolean
}

export default function PatientListView({
  patient,
  onConsultationSelect,
  onNewConsultation,
  onBack,
  isCompletedPatient = false,
}: PatientListViewProps) {
  const [filterStatus, setFilterStatus] = useState<VisitSummaryStatus | "all">("all")
  const [activeSection, setActiveSection] = useState<"overview" | "history">("overview")

  const visitSummaries = useMemo(
    () => (patient.lastVisit ? [visitToSummary(patient.lastVisit)] : []),
    [patient.lastVisit],
  )

  const filteredVisits = visitSummaries.filter(
    (visit) => filterStatus === "all" || visit.status === filterStatus,
  )

  const stats = {
    pending: visitSummaries.filter((visit) => visit.status === "pending").length,
    ongoing: visitSummaries.filter((visit) => visit.status === "ongoing").length,
    completed: visitSummaries.filter((visit) => visit.status === "completed").length,
  }

  const displayName = getPatientDisplayName(patient)
  const age = getPatientAge(patient)

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-full md:w-96 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Patients</span>
            </button>

            <div className="mb-4">
              <h2 className="font-semibold text-card-foreground text-lg">{displayName}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {age != null ? `${age} years` : "Age unknown"} • {formatPatientGender(patient.gender)}
              </p>
            </div>

            {!isCompletedPatient && (
              <button
                onClick={() => onNewConsultation(patient)}
                className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                + New Consultation
              </button>
            )}
          </div>

          <div className="p-3 border-b border-border flex gap-2">
            <button
              onClick={() => setActiveSection("overview")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
                activeSection === "overview"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/70"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("history")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors font-medium flex items-center justify-center gap-1 ${
                activeSection === "history"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/70"
              }`}
            >
              <History className="w-4 h-4" />
              History
            </button>
          </div>

          {activeSection === "overview" && (
            <>
              <div className="p-3 border-b border-border space-y-2">
                {(["pending", "ongoing", "completed"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      filterStatus === status
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/70"
                    }`}
                  >
                    <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    <span className="text-xs font-semibold">{stats[status]}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
                  {filteredVisits.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm py-8">
                      No {filterStatus === "all" ? "" : filterStatus} visits
                    </p>
                  ) : (
                    filteredVisits.map((visit) => (
                      <button
                        key={visit.id}
                        onClick={() => onConsultationSelect(visit)}
                        className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground truncate">
                          {visit.chiefComplaint || "Follow-up visit"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{visit.date}</p>
                        <span
                          className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                            visit.status === "completed"
                              ? "bg-primary/20 text-primary"
                              : visit.status === "ongoing"
                                ? "bg-accent/20 text-accent"
                                : "bg-secondary/20 text-secondary"
                          }`}
                        >
                          {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {activeSection === "overview" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Location</p>
                    <p className="text-foreground text-sm">
                      {[patient.village, patient.city, patient.district].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Contact Information</p>
                    <p className="text-foreground text-sm">{getPatientPhone(patient) || "—"}</p>
                    <p className="text-foreground text-sm">{patient.postalAddress || "—"}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Activity</p>
                    <p className="text-foreground text-sm font-medium">
                      {patient.lastVisit?.visitDate || "No recent visit"}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {visitSummaries.length} recorded visit(s)
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-card-foreground">Recent Visits</h3>
                  </div>

                  <div className="p-4">
                    {visitSummaries.slice(0, 3).map((visit) => (
                      <button
                        key={visit.id}
                        onClick={() => onConsultationSelect(visit)}
                        className="w-full text-left p-4 mb-3 rounded-lg border border-border hover:bg-muted transition-colors last:mb-0"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{visit.chiefComplaint || "Routine visit"}</p>
                            <p className="text-xs text-muted-foreground mt-1">{visit.date}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                              visit.status === "completed"
                                ? "bg-primary/20 text-primary"
                                : visit.status === "ongoing"
                                  ? "bg-accent/20 text-accent"
                                  : "bg-secondary/20 text-secondary"
                            }`}
                          >
                            {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                          </span>
                        </div>
                      </button>
                    ))}

                    {visitSummaries.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No visits yet</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <MedicalHistory
                patient={patient}
                onVisitSelect={(visit) =>
                  onConsultationSelect({
                    id: visit.id,
                    date: visit.visitDate,
                    status: "completed",
                  })
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
