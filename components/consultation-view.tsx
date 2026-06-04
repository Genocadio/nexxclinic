"use client"

import { useState } from "react"
import type { Patient } from "@/lib/api-types"
import { ArrowLeft, Plus, Trash2, Save, AlertCircle, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Legacy type definitions - should be replaced with api-types when schema is available
interface VitalSigns {
  temperature?: number
  pulse?: number
  bloodPressure?: string
  respiratoryRate?: number
  oxygenSaturation?: number
}

interface ExaminationFindings {
  visualAcuityOD?: string
  visualAcuityOS?: string
  iop?: string
  fundus?: string
  [key: string]: string | undefined
}

interface Prescription {
  id: string
  type: "medication" | "glasses" | "appointment"
  medication?: string
  dosage?: string
  frequency?: string
  duration?: string
  sphericalOD?: string
  cylindricalOD?: string
  axisOD?: string
  sphericalOS?: string
  cylindricalOS?: string
  axisOS?: string
  appointmentDate?: string
  appointmentReason?: string
  notes?: string
}

interface Consultation {
  id: string
  date: string
  status: "pending" | "ongoing" | "completed"
  chiefComplaint?: string
  history?: string
  vitalSigns: VitalSigns
  examinationFindings: ExaminationFindings
  diagnosis?: string
  prescriptions: Prescription[]
  notes?: string
}

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

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-xs text-muted-foreground">Consultation - {consultation.date}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/70 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => onSave(consultation)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-border overflow-x-auto">
          {["history", "examination", "diagnosis", "prescriptions", "summary"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, " $1")}
              {completionStatus[tab as keyof typeof completionStatus] && (
                <CheckCircle className="w-4 h-4 ml-1 inline text-green-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-160px)]">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {activeTab === "summary" && <SummaryTab consultation={consultation} patient={patient} />}
            {/* Other tabs content would go here */}
            <div className="text-center py-12 text-muted-foreground">
              {activeTab} content implementation pending
            </div>
          </div>
        </div>
      </div>
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
              <span className="text-foreground font-medium">{patient.firstName} {patient.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gender:</span>
              <span className="text-foreground">{patient.gender === "M" ? "Male" : "Female"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contact:</span>
              <span className="text-foreground">{patient.contactInfo?.phone}</span>
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
    </div>
  )
}
