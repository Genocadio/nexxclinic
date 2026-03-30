"use client"

import type { Patient, Consultation } from "@/lib/types"
import { Calendar, Eye, AlertCircle, TrendingUp, FileText } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface MedicalHistoryProps {
  patient: Patient
  onConsultationSelect: (consultation: Consultation) => void
}

export default function MedicalHistory({ patient, onConsultationSelect }: MedicalHistoryProps) {
  const [expandedConsultation, setExpandedConsultation] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline")

  const sortedConsultations = [...patient.consultations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const diagnosticTrends = patient.consultations.reduce(
    (acc, cons) => {
      if (cons.diagnosis) {
        const key = cons.diagnosis.split(",")[0].trim()
        acc[key] = (acc[key] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const medicationFrequency = patient.consultations.reduce(
    (acc, cons) => {
      cons.prescriptions.forEach((presc) => {
        if (presc.type === "medication" && presc.medication) {
          acc[presc.medication] = (acc[presc.medication] || 0) + 1
        }
      })
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Total Visits
          </p>
          <p className="text-2xl font-bold text-foreground">{patient.consultations.length}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Completed
          </p>
          <p className="text-2xl font-bold text-primary">
            {patient.consultations.filter((c) => c.status === "completed").length}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Ongoing
          </p>
          <p className="text-2xl font-bold text-accent">
            {patient.consultations.filter((c) => c.status === "ongoing").length}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Unique Diagnoses
          </p>
          <p className="text-2xl font-bold text-secondary">{Object.keys(diagnosticTrends).length}</p>
        </div>
      </div>

      {/* Diagnostic Summary */}
      {Object.keys(diagnosticTrends).length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-card-foreground mb-4">Diagnostic Summary</h3>
          <div className="space-y-2">
            {Object.entries(diagnosticTrends)
              .sort((a, b) => b[1] - a[1])
              .map(([diagnosis, count]) => (
                <div key={diagnosis} className="flex items-center justify-between">
                  <span className="text-foreground text-sm">{diagnosis}</span>
                  <span className="flex items-center gap-2">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: `${(count / Math.max(...Object.values(diagnosticTrends))) * 100}px` }}
                    />
                    <span className="text-xs text-muted-foreground font-medium">{count}x</span>
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Medication Summary */}
      {Object.keys(medicationFrequency).length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-card-foreground mb-4">Medication History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(medicationFrequency)
              .sort((a, b) => b[1] - a[1])
              .map(([medication, count]) => (
                <div key={medication} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-foreground text-sm font-medium">{medication}</span>
                  <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded">
                    {count} prescription{count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("timeline")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === "timeline"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-muted/70"
          }`}
        >
          Timeline View
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/70"
          }`}
        >
          List View
        </button>
      </div>

      {/* Consultation History */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <FileText className="w-5 h-5 text-foreground" />
          <h3 className="font-semibold text-card-foreground">Complete Medical History</h3>
        </div>

        <div className="p-4">
          {viewMode === "timeline" ? (
            <div className="space-y-4">
              {sortedConsultations.map((consultation, index) => (
                <div key={consultation.id} className="relative">
                  {/* Timeline line */}
                  {index !== sortedConsultations.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border" />
                  )}

                  {/* Timeline item */}
                  <button onClick={() => onConsultationSelect(consultation)} className="w-full text-left relative">
                    {/* Timeline dot */}
                    <div className="flex gap-4">
                      <div className="relative flex flex-col items-center pt-1">
                        <div
                          className={`w-4 h-4 rounded-full border-2 z-10 ${
                            consultation.status === "completed"
                              ? "bg-primary border-primary"
                              : consultation.status === "ongoing"
                                ? "bg-accent border-accent"
                                : "bg-secondary border-secondary"
                          }`}
                        />
                      </div>

                      <div className="flex-1 pb-4">
                        <div className="p-4 rounded-lg border border-border hover:bg-muted transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-foreground">{consultation.date}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {consultation.chiefComplaint || "Follow-up visit"}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                                consultation.status === "completed"
                                  ? "bg-primary/20 text-primary"
                                  : consultation.status === "ongoing"
                                    ? "bg-accent/20 text-accent"
                                    : "bg-secondary/20 text-secondary"
                              }`}
                            >
                              {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                            </span>
                      <Badge
                        variant={consultation.status === "completed" ? "default" : consultation.status === "ongoing" ? "outline" : "secondary"}
                      >
                        {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                      </Badge>
                          </div>

                          {expandedConsultation === consultation.id && (
                            <div className="mt-4 pt-4 border-t border-border space-y-3 text-sm">
                              {consultation.diagnosis && (
                                <div>
                                  <p className="text-xs text-muted-foreground font-medium mb-1">Diagnosis</p>
                                  <p className="text-foreground">{consultation.diagnosis}</p>
                                </div>
                              )}

                              {Object.values(consultation.vitalSigns).some((v) => v) && (
                                <div>
                                  <p className="text-xs text-muted-foreground font-medium mb-2">Vital Signs</p>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    {consultation.vitalSigns.bloodPressure && (
                                      <div>
                                        <span className="text-muted-foreground">BP:</span>{" "}
                                        {consultation.vitalSigns.bloodPressure}
                                      </div>
                                    )}
                                    {consultation.vitalSigns.heartRate > 0 && (
                                      <div>
                                        <span className="text-muted-foreground">HR:</span>{" "}
                                        {consultation.vitalSigns.heartRate} bpm
                                      </div>
                                    )}
                                    {consultation.vitalSigns.temperature > 0 && (
                                      <div>
                                        <span className="text-muted-foreground">Temp:</span>{" "}
                                        {consultation.vitalSigns.temperature}°C
                                      </div>
                                    )}
                                    {consultation.vitalSigns.oxygenSaturation > 0 && (
                                      <div>
                                        <span className="text-muted-foreground">O₂:</span>{" "}
                                        {consultation.vitalSigns.oxygenSaturation}%
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {consultation.examinationFindings.visualAcuityOD && (
                                <div>
                                  <p className="text-xs text-muted-foreground font-medium mb-1">Visual Acuity</p>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <span className="text-muted-foreground">OD:</span>{" "}
                                      {consultation.examinationFindings.visualAcuityOD}
                                    </div>
                                    {consultation.examinationFindings.visualAcuityOS && (
                                      <div>
                                        <span className="text-muted-foreground">OS:</span>{" "}
                                        {consultation.examinationFindings.visualAcuityOS}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {consultation.prescriptions.length > 0 && (
                                <div>
                                  <p className="text-xs text-muted-foreground font-medium mb-2">Prescriptions</p>
                                  <ul className="space-y-1">
                                    {consultation.prescriptions.map((presc) => (
                                      <li key={presc.id} className="text-foreground text-xs">
                                        • {presc.type === "appointment" ? "Follow-up" : presc.type}
                                        {presc.medication && `: ${presc.medication}`}
                                        {presc.sphericalOD && `: OD ${presc.sphericalOD}, OS ${presc.sphericalOS}`}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              setExpandedConsultation(expandedConsultation === consultation.id ? null : consultation.id)
                            }}
                            className="text-xs text-primary hover:underline mt-2"
                          >
                            {expandedConsultation === consultation.id ? "Hide" : "View"} Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedConsultations.map((consultation) => (
                <button
                  key={consultation.id}
                  onClick={() => onConsultationSelect(consultation)}
                  className="w-full text-left p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{consultation.date}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {consultation.chiefComplaint || "Follow-up visit"}
                      </p>
                      {consultation.diagnosis && (
                        <p className="text-xs text-muted-foreground mt-2">{consultation.diagnosis}</p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                        consultation.status === "completed"
                          ? "bg-primary/20 text-primary"
                          : consultation.status === "ongoing"
                            ? "bg-accent/20 text-accent"
                            : "bg-secondary/20 text-secondary"
                      }`}
                    >
                      {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                    </span>
                    <Badge
                      variant={consultation.status === "completed" ? "default" : consultation.status === "ongoing" ? "outline" : "secondary"}
                    >
                      {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
