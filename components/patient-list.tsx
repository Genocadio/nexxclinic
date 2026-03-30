"use client"

import type { Patient, Consultation, ConsultationStatus } from "@/lib/types"
import { ArrowLeft } from "lucide-react"

interface PatientListProps {
  patient: Patient
  onConsultationSelect: (consultation: Consultation) => void
  onNewConsultation: (patient: Patient) => void
  filterStatus: ConsultationStatus | "all"
  setFilterStatus: (status: ConsultationStatus | "all") => void
  onBack: () => void
}

export default function PatientList({
  patient,
  onConsultationSelect,
  onNewConsultation,
  filterStatus,
  setFilterStatus,
  onBack,
}: PatientListProps) {
  const filteredConsultations = patient.consultations.filter((c) => filterStatus === "all" || c.status === filterStatus)

  const stats = {
    pending: patient.consultations.filter((c) => c.status === "pending").length,
    ongoing: patient.consultations.filter((c) => c.status === "ongoing").length,
    completed: patient.consultations.filter((c) => c.status === "completed").length,
  }

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patients</span>
        </button>

        <div className="mb-4">
          <h2 className="font-semibold text-card-foreground">{patient.name}</h2>
          <p className="text-xs text-muted-foreground">Age: {patient.age}</p>
        </div>

        <button
          onClick={() => onNewConsultation(patient)}
          className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          + New Consultation
        </button>
      </div>

      <div className="p-3 border-b border-border space-y-2">
        {["pending", "ongoing", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as ConsultationStatus | "all")}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
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
    </div>
  )
}
