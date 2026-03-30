"use client"

import type { Patient, Consultation, ConsultationStatus } from "@/lib/types"
import { ArrowLeft, History } from "lucide-react"
import { useState } from "react"
import MedicalHistory from "@/components/medical-history"

interface PatientListViewProps {
  patient: Patient
  onConsultationSelect: (consultation: Consultation) => void
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
  patientsList,
  setPatientsList,
  isCompletedPatient = false,
}: PatientListViewProps) {
  const [filterStatus, setFilterStatus] = useState<ConsultationStatus | "all">("all")
  const [activeSection, setActiveSection] = useState<"overview" | "history">("overview")

  const filteredConsultations = patient.consultations.filter((c) => filterStatus === "all" || c.status === filterStatus)

  const stats = {
    pending: patient.consultations.filter((c) => c.status === "pending").length,
    ongoing: patient.consultations.filter((c) => c.status === "ongoing").length,
    completed: patient.consultations.filter((c) => c.status === "completed").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
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
              <h2 className="font-semibold text-card-foreground text-lg">{patient.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {patient.age} years • {patient.gender === "M" ? "Male" : "Female"}
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

          {/* Section tabs */}
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
              {/* Filter tabs */}
              <div className="p-3 border-b border-border space-y-2">
                {["pending", "ongoing", "completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as ConsultationStatus | "all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      filterStatus === status
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/70"
                    }`}
                  >
                    <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    <span className="text-xs font-semibold">{stats[status as keyof typeof stats]}</span>
                  </button>
                ))}
              </div>

              {/* Consultations list */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
                  {filteredConsultations.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm py-8">
                      No {filterStatus === "all" ? "" : filterStatus} consultations
                    </p>
                  ) : (
                    filteredConsultations.map((consultation) => (
                      <button
                        key={consultation.id}
                        onClick={() => onConsultationSelect(consultation)}
                        className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground truncate">
                          {consultation.chiefComplaint || "Follow-up visit"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{consultation.date}</p>
                        <span
                          className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                            consultation.status === "completed"
                              ? "bg-primary/20 text-primary"
                              : consultation.status === "ongoing"
                                ? "bg-accent/20 text-accent"
                                : "bg-secondary/20 text-secondary"
                          }`}
                        >
                          {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {activeSection === "overview" ? (
              <>
                {/* Patient Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Medical History</p>
                    <p className="text-foreground text-sm">{patient.medicalHistory}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Contact Information</p>
                    <p className="text-foreground text-sm font-medium">{patient.email}</p>
                    <p className="text-foreground text-sm">{patient.phone}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Activity</p>
                    <p className="text-foreground text-sm font-medium">{patient.lastVisit}</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {patient.consultations.length} total consultations
                    </p>
                  </div>
                </div>

                {/* Recent Consultations */}
                <div className="bg-card border border-border rounded-lg">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-card-foreground">Recent Consultations</h3>
                  </div>

                  <div className="p-4">
                    {patient.consultations.slice(0, 3).map((cons) => (
                      <button
                        key={cons.id}
                        onClick={() => onConsultationSelect(cons)}
                        className="w-full text-left p-4 mb-3 rounded-lg border border-border hover:bg-muted transition-colors last:mb-0"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{cons.chiefComplaint || "Routine visit"}</p>
                            <p className="text-xs text-muted-foreground mt-1">{cons.date}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                              cons.status === "completed"
                                ? "bg-primary/20 text-primary"
                                : cons.status === "ongoing"
                                  ? "bg-accent/20 text-accent"
                                  : "bg-secondary/20 text-secondary"
                            }`}
                          >
                            {cons.status.charAt(0).toUpperCase() + cons.status.slice(1)}
                          </span>
                        </div>
                        {cons.diagnosis && <p className="text-xs text-muted-foreground">{cons.diagnosis}</p>}
                      </button>
                    ))}

                    {patient.consultations.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        {patient.consultations.length - 3} more consultation(s) - View in History tab
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <MedicalHistory patient={patient} onConsultationSelect={onConsultationSelect} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
