"use client"

import { useMemo, useState } from "react"
import type { Patient, Consultation } from "@/lib/types"
import { History, X } from "lucide-react"

interface ConsultationViewProps {
  consultation: Consultation
  patient: Patient
  onSave: (consultation: Consultation) => void
  onBack: () => void
  patientsList: Patient[]
  setPatientsList: (patients: Patient[]) => void
}

export default function ConsultationView({
  consultation,
  patient,
  onSave,
  onBack,
  patientsList,
  setPatientsList,
}: ConsultationViewProps) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState<Consultation | null>(null)

  const previousVisits = useMemo(() => {
    const visits = patient.consultations.filter((c) => c.id !== consultation.id)
    // Chronological: newest first
    return visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [patient.consultations, consultation.id])

  return (
    <div className="min-h-screen bg-background">
      {/* Empty consultation canvas */}
      <div className="h-[calc(100vh-64px)]" />

      {/* Floating history button */}
      <button
        onClick={() => {
          setSelectedVisit(null)
          setHistoryOpen(true)
        }}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        aria-label="Open patient history"
      >
        <History className="w-5 h-5" />
        Patient History
      </button>

      {/* Right-side floating history panel */}
      {historyOpen && (
        <div className="fixed top-16 right-6 z-50 w-[380px] bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">Previous Visits</h2>
              <p className="text-xs text-muted-foreground">Sorted by date • newest first</p>
            </div>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-2 rounded-lg hover:bg-muted/70 text-muted-foreground"
              aria-label="Close history"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List view */}
          {!selectedVisit && (
            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
              {previousVisits.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">No previous consultations</p>
              ) : (
                previousVisits.map((v) => (
                  <div key={v.id} className="border border-border rounded-lg p-3 bg-card/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {v.chiefComplaint || "Routine visit"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{v.date}</p>
                        {v.diagnosis && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">Dx: {v.diagnosis}</p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                          v.status === "completed"
                            ? "bg-primary/20 text-primary"
                            : v.status === "ongoing"
                              ? "bg-accent/20 text-accent"
                              : "bg-secondary/20 text-secondary"
                        }`}
                      >
                        {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-end">
                      <button
                        onClick={() => setSelectedVisit(v)}
                        className="px-3 py-1.5 rounded-md text-sm bg-muted hover:bg-muted/70 transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Details view */}
          {selectedVisit && (
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{selectedVisit.chiefComplaint || "Visit"}</p>
                  <p className="text-xs text-muted-foreground">{selectedVisit.date}</p>
                </div>
                <button
                  onClick={() => setSelectedVisit(null)}
                  className="px-3 py-1.5 rounded-md text-sm bg-muted hover:bg-muted/70 transition-colors"
                >
                  Back to Summary
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="bg-muted/30 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-foreground mb-2">Chief Complaint</h3>
                  <p className="text-sm text-card-foreground whitespace-pre-wrap">{selectedVisit.chiefComplaint}</p>
                </div>

                {selectedVisit.history && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h3 className="text-sm font-medium text-foreground mb-2">History of Present Illness</h3>
                    <p className="text-sm text-card-foreground whitespace-pre-wrap">{selectedVisit.history}</p>
                  </div>
                )}

                {selectedVisit.diagnosis && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h3 className="text-sm font-medium text-foreground mb-2">Diagnosis</h3>
                    <p className="text-sm text-card-foreground whitespace-pre-wrap">{selectedVisit.diagnosis}</p>
                  </div>
                )}

                {selectedVisit.prescriptions.length > 0 && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h3 className="text-sm font-medium text-foreground mb-2">Treatment Plan</h3>
                    <div className="space-y-2">
                      {selectedVisit.prescriptions.map((presc, idx) => (
                        <div key={presc.id} className="border-l-4 border-primary pl-3">
                          <p className="text-sm font-medium text-card-foreground capitalize">
                            {idx + 1}. {presc.type === "appointment" ? "Follow-up Appointment" : presc.type}
                          </p>
                          {presc.type === "medication" && (
                            <p className="text-xs text-muted-foreground mt-1">
                              <span className="font-medium">{presc.medication}</span>
                              {presc.dosage && ` • ${presc.dosage}`}
                              {presc.frequency && ` • ${presc.frequency}`}
                              {presc.duration && ` • ${presc.duration}`}
                            </p>
                          )}
                          {presc.type === "glasses" && (
                            <p className="text-xs text-muted-foreground mt-1">
                              OD: {presc.sphericalOD}
                              {presc.cylindricalOD && ` (${presc.cylindricalOD})`}
                              {presc.axisOD && ` • Axis ${presc.axisOD}`} • OS: {presc.sphericalOS}
                              {presc.cylindricalOS && ` (${presc.cylindricalOS})`}
                              {presc.axisOS && ` • Axis ${presc.axisOS}`}
                            </p>
                          )}
                          {presc.type === "appointment" && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {presc.appointmentDate}
                              {presc.appointmentReason && ` • ${presc.appointmentReason}`}
                            </p>
                          )}
                          {presc.notes && <p className="text-xs text-muted-foreground mt-1">{presc.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVisit.notes && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h3 className="text-sm font-medium text-foreground mb-2">Clinical Notes</h3>
                    <p className="text-sm text-card-foreground whitespace-pre-wrap">{selectedVisit.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}"use client"

import { useState } from "react"
import type { Patient, Consultation, VitalSigns, ExaminationFindings, Prescription } from "@/lib/types"
import { ArrowLeft, Plus, Trash2, Save, AlertCircle, CheckCircle, History, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ConsultationViewProps {
  consultation: Consultation
  patient: Patient
  onSave: (consultation: Consultation) => void
  onBack: () => void
  patientsList: Patient[]
  setPatientsList: (patients: Patient[]) => void
}

export default function ConsultationView({
  consultation: initialConsultation,
  patient,
  onSave,
  onBack,
  patientsList,
  setPatientsList,
}: ConsultationViewProps) {
  const [consultation, setConsultation] = useState(initialConsultation)
  const [activeTab, setActiveTab] = useState<"history" | "examination" | "diagnosis" | "prescriptions" | "summary">(
    "history",
  )
  const [completionStatus, setCompletionStatus] = useState({
    history: !!initialConsultation.chiefComplaint,
    examination: !!initialConsultation.examinationFindings.visualAcuityOD,
    diagnosis: !!initialConsultation.diagnosis,
    prescriptions: initialConsultation.prescriptions.length > 0,
  })
  const [showHistory, setShowHistory] = useState(false)
  const [selectedHistoryVisit, setSelectedHistoryVisit] = useState<Consultation | null>(null)

  const handleVitalSignChange = (key: keyof VitalSigns, value: string | number) => {
    setConsultation({
      ...consultation,
      vitalSigns: {
        ...consultation.vitalSigns,
        [key]: typeof value === "string" ? value : Number(value),
      "use client"

      import { useMemo, useState } from "react"
      import type { Patient, Consultation } from "@/lib/types"
      import { History, X } from "lucide-react"

      interface ConsultationViewProps {
        consultation: Consultation
        patient: Patient
        onSave: (consultation: Consultation) => void
        onBack: () => void
        patientsList: Patient[]
        setPatientsList: (patients: Patient[]) => void
      }

      export default function ConsultationView({
        consultation,
        patient,
        onSave,
        onBack,
        patientsList,
        setPatientsList,
      }: ConsultationViewProps) {
        const [historyOpen, setHistoryOpen] = useState(false)
        const [selectedVisit, setSelectedVisit] = useState<Consultation | null>(null)

        const previousVisits = useMemo(() => {
          const visits = patient.consultations.filter((c) => c.id !== consultation.id)
          return visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }, [patient.consultations, consultation.id])

        return (
          <div className="min-h-screen bg-background">
            {/* Empty consultation canvas */}
            <div className="h-[calc(100vh-64px)]" />

            {/* Floating history button */}
            <button
              onClick={() => {
                setSelectedVisit(null)
                setHistoryOpen(true)
              }}
              className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label="Open patient history"
            >
              <History className="w-5 h-5" />
              Patient History
            </button>

            {/* Right-side floating history panel */}
            {historyOpen && (
              <div className="fixed top-16 right-6 z-50 w-[380px] bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div>
                    <h2 className="text-lg font-semibold text-card-foreground">Previous Visits</h2>
                    <p className="text-xs text-muted-foreground">Sorted by date • newest first</p>
                  </div>
                  <button
                    onClick={() => setHistoryOpen(false)}
                    className="p-2 rounded-lg hover:bg-muted/70 text-muted-foreground"
                    aria-label="Close history"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* List view */}
                {!selectedVisit && (
                  <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
                    {previousVisits.length === 0 ? (
                      <p className="text-center text-muted-foreground text-sm py-8">No previous consultations</p>
                    ) : (
                      previousVisits.map((v) => (
                        <div key={v.id} className="border border-border rounded-lg p-3 bg-card/50">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground truncate">
                                {v.chiefComplaint || "Routine visit"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{v.date}</p>
                              {v.diagnosis && (
                                <p className="text-xs text-muted-foreground mt-1 truncate">Dx: {v.diagnosis}</p>
                              )}
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                                v.status === "completed"
                                  ? "bg-primary/20 text-primary"
                                  : v.status === "ongoing"
                                    ? "bg-accent/20 text-accent"
                                    : "bg-secondary/20 text-secondary"
                              }`}
                            >
                              {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-end">
                            <button
                              onClick={() => setSelectedVisit(v)}
                              className="px-3 py-1.5 rounded-md text-sm bg-muted hover:bg-muted/70 transition-colors"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Details view */}
                {selectedVisit && (
                  <div className="max-h-[70vh] overflow-y-auto">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-card-foreground">{selectedVisit.chiefComplaint || "Visit"}</p>
                        <p className="text-xs text-muted-foreground">{selectedVisit.date}</p>
                      </div>
                      <button
                        onClick={() => setSelectedVisit(null)}
                        className="px-3 py-1.5 rounded-md text-sm bg-muted hover:bg-muted/70 transition-colors"
                      >
                        Back to Summary
                      </button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="bg-muted/30 rounded-lg p-3">
                        <h3 className="text-sm font-medium text-foreground mb-2">Chief Complaint</h3>
                        <p className="text-sm text-card-foreground whitespace-pre-wrap">{selectedVisit.chiefComplaint}</p>
                      </div>

                      {selectedVisit.history && (
                        <div className="bg-muted/30 rounded-lg p-3">
                          <h3 className="text-sm font-medium text-foreground mb-2">History of Present Illness</h3>
                          <p className="text-sm text-card-foreground whitespace-pre-wrap">{selectedVisit.history}</p>
                        </div>
                      )}

                      {selectedVisit.diagnosis && (
                        <div className="bg-muted/30 rounded-lg p-3">
                          <h3 className="text-sm font-medium text-foreground mb-2">Diagnosis</h3>
                          <p className="text-sm text-card-foreground whitespace-pre-wrap">{selectedVisit.diagnosis}</p>
                        </div>
                      )}

                      {selectedVisit.prescriptions.length > 0 && (
                        <div className="bg-muted/30 rounded-lg p-3">
                          <h3 className="text-sm font-medium text-foreground mb-2">Treatment Plan</h3>
                          <div className="space-y-2">
                            {selectedVisit.prescriptions.map((presc, idx) => (
                              <div key={presc.id} className="border-l-4 border-primary pl-3">
                                <p className="text-sm font-medium text-card-foreground capitalize">
                                  {idx + 1}. {presc.type === "appointment" ? "Follow-up Appointment" : presc.type}
                                </p>
                                {presc.type === "medication" && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    <span className="font-medium">{presc.medication}</span> {presc.dosage && `• ${presc.dosage}`} {presc.frequency && `• ${presc.frequency}`} {presc.duration && `• ${presc.duration}`}
                                  </p>
                                )}
                                {presc.type === "glasses" && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    OD: {presc.sphericalOD} {presc.cylindricalOD && `(${presc.cylindricalOD})`} {presc.axisOD && `• Axis ${presc.axisOD}`} • OS: {presc.sphericalOS} {presc.cylindricalOS && `(${presc.cylindricalOS})`} {presc.axisOS && `• Axis ${presc.axisOS}`}
                                  </p>
                                )}
                                {presc.type === "appointment" && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {presc.appointmentDate} {presc.appointmentReason && `• ${presc.appointmentReason}`}
                                  </p>
                                )}
                                {presc.notes && <p className="text-xs text-muted-foreground mt-1">{presc.notes}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedVisit.notes && (
                        <div className="bg-muted/30 rounded-lg p-3">
                          <h3 className="text-sm font-medium text-foreground mb-2">Clinical Notes</h3>
                          <p className="text-sm text-card-foreground whitespace-pre-wrap">{selectedVisit.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      }
    </div>
  )
}

function SummaryTab({
  consultation,
  patient,
}: {
  consultation: Consultation
  patient: Patient
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-card-foreground mb-4">Patient Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="text-foreground font-medium">{patient.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Age:</span>
              <span className="text-foreground">{patient.age} years old</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gender:</span>
              <span className="text-foreground">{patient.gender === "M" ? "Male" : "Female"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contact:</span>
              <span className="text-foreground">{patient.phone}</span>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Medical History:</p>
              <p className="text-foreground text-xs">{patient.medicalHistory}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-card-foreground mb-4">Consultation Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="text-foreground">{consultation.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-foreground font-medium capitalize">{consultation.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vital Signs:</span>
              <span className="text-foreground">
                {Object.values(consultation.vitalSigns).filter((v) => v).length} recorded
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prescriptions:</span>
              <span className="text-foreground font-medium">{consultation.prescriptions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {consultation.chiefComplaint && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-card-foreground mb-3">Chief Complaint</h3>
          <p className="text-foreground text-sm">{consultation.chiefComplaint}</p>
        </div>
      )}

      {consultation.diagnosis && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-card-foreground mb-3">Diagnosis</h3>
          <p className="text-foreground text-sm whitespace-pre-wrap">{consultation.diagnosis}</p>
        </div>
      )}

      {consultation.prescriptions.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-card-foreground mb-4">Treatment Plan</h3>
          <div className="space-y-3">
            {consultation.prescriptions.map((presc, idx) => (
              <div key={presc.id} className="border-l-4 border-primary pl-4 pb-3">
                <p className="font-medium text-foreground capitalize">
                  {idx + 1}. {presc.type === "appointment" ? "Follow-up Appointment" : presc.type}
                </p>
                {presc.type === "medication" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">{presc.medication}</span> - {presc.dosage} for {presc.duration}
                  </p>
                )}
                {presc.type === "glasses" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    OD: {presc.sphericalOD} {presc.cylindricalOD && `(${presc.cylindricalOD})`} • OS:{" "}
                    {presc.sphericalOS} {presc.cylindricalOS && `(${presc.cylindricalOS})`}
                  </p>
                )}
                {presc.type === "appointment" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {presc.appointmentDate} - {presc.appointmentReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {consultation.notes && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-card-foreground mb-3">Clinical Notes</h3>
          <p className="text-foreground text-sm whitespace-pre-wrap">{consultation.notes}</p>
        </div>
      )}
    </div>
  )
}
