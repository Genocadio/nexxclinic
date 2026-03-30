"use client"

import { useParams, useRouter } from "next/navigation"
import { useAddDepartmentNote, useUpsertConsultationAnswers, useUpdateVisitDepartmentStatus, useVisits } from "@/hooks/auth-hooks"
import { useAuth } from "@/lib/auth-context"
import ConsultationViewBackbone from "@/components/consultation-view-backbone"
import VisitNotesFloating from "@/components/visit-notes-floating"
import Header from "@/components/header"
import type { Patient, Consultation } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import InlineTryAgain from "@/components/inline-try-again"
import { toast } from "react-toastify"

export default function ConsultationPage() {
  const router = useRouter()
  const params = useParams()
  const visitId = params.visitId as string
  const { doctor } = useAuth()
  const { visits, loading, error, refetch } = useVisits()
  const { upsertConsultationAnswers } = useUpsertConsultationAnswers()
  const { updateDepartmentStatus } = useUpdateVisitDepartmentStatus()
  const { addDepartmentNote } = useAddDepartmentNote()

  // Find the visit from the fetched visits
  const visit = visits.find(v => v.id === visitId)

  // Redirect to dashboard if visit not found after loading completes
  useEffect(() => {
    if (!loading && !visit && !error) {
      router.push('/')
    }
  }, [loading, visit, error, router])

  // Show loading spinner while fetching visits
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header doctor={doctor} />
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="bg-card/70 dark:bg-slate-900/70 border border-border/50 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header doctor={doctor} />
        <div className="max-w-5xl mx-auto px-6 py-8">
          <InlineTryAgain onTryAgain={() => refetch()} />
        </div>
      </div>
    )
  }

  // Visit not found after loading - show error state briefly before redirect
  if (!visit) {
    return (
      <div className="min-h-screen bg-background">
        <Header doctor={doctor} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Visit not found, redirecting...</p>
          </div>
        </div>
      </div>
    )
  }

  // Create consultation object from visit with new backbone structure
  const consultation: Consultation = {
    consultationId: visit.id,
    encounterType: visit.visitType === 'OUTPATIENT' ? 'outpatient' : 
                   visit.visitType === 'INPATIENT' ? 'inpatient' : 
                   visit.visitType === 'EMERGENCY' ? 'emergency' : 'outpatient',
    department: 'ophthalmology', // Default, should be mapped from visit
    status: visit.visitStatus === 'CREATED' ? 'draft' : 'draft',

    timestamps: {
      startedAt: visit.visitDate || new Date().toISOString(),
      finalizedAt: undefined
    },

    reasonForVisit: {
      chiefComplaint: visit.visitNotes?.find(note => note.type === 'GENERAL')?.text || "",
      presentingBodySite: "",
      onset: undefined
    },

    history: {
      isAllergyReviewPerformed: false,
      allergies: [],
      pastMedicalHistory: []
    },

    reviewOfSystems: {
      performed: false,
      findings: []
    },

    assessment: {
      problemList: [],
      diagnoses: [],
      clinicalImpression: ""
    },

    plan: {
      orders: []
    },

    specialtyExtensions: {},

    audit: {
      createdBy: doctor?.id || "",
      lastUpdatedBy: doctor?.id || "",
      version: 1
    },

    // Legacy compatibility fields
    id: visit.id,
    patientId: visit.patient.id,
    doctorId: doctor?.id || "",
    date: visit.visitDate
  }

  // Convert visit to patient format
  const patient: Patient = {
    id: visit.patient.id,
    name: `${visit.patient.firstName} ${visit.patient.lastName}`,
    age: new Date().getFullYear() - new Date(visit.patient.dateOfBirth).getFullYear(),
    gender: visit.patient.gender as "M" | "F",
    email: "",
    phone: visit.patient.contactInfo?.phone || "",
    dateOfBirth: visit.patient.dateOfBirth,
    medicalHistory: visit.patient.notes || "",
    lastVisit: visit.visitDate,
    consultations: []
  }

  const firstDepartmentId = visit.departments?.[0]?.department?.id || visit.departments?.[0]?.id
  const firstDepartment = visit.departments?.[0]

  const scopedNotes = [
    ...(visit.visitNotes || []).map((note) => ({
      ...note,
      scope: 'visit' as const,
    })),
    ...((firstDepartment?.notes || []).map((note) => ({
      ...note,
      scope: 'department' as const,
      departmentName: firstDepartment?.department?.name,
    }))),
  ]
  
  // Extract existing actions and consumables from the first department
  const existingActions = firstDepartment?.actions || []
  const existingConsumables = firstDepartment?.consumables || []

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <ConsultationViewBackbone
        consultation={consultation}
        patient={patient}
        departmentId={firstDepartmentId ? String(firstDepartmentId) : undefined}
        onSave={async (updatedConsultation) => {
          try {
            const dynamicFormResponse = (updatedConsultation.specialtyExtensions as any)?.dynamicFormResponse
            const formId = dynamicFormResponse?.formId
            const formSchemaVersion = dynamicFormResponse?.formSchemaVersion
            const departmentToSave = String(dynamicFormResponse?.departmentId || firstDepartmentId || '')
            const existingSubmissionStatus = dynamicFormResponse?.existingSubmissionStatus as 'DRAFT' | 'FINAL' | undefined
            let answersAlreadyFinal = existingSubmissionStatus === 'FINAL'

            if (!formId || !departmentToSave || formSchemaVersion === undefined || formSchemaVersion === null) {
              console.warn('Skipping consultation answers save: missing form context', {
                formId,
                formSchemaVersion,
                departmentToSave,
              })
              toast.error('Form context is missing. Please refresh and try again.')
              return
            }

            if (!answersAlreadyFinal) {
              const answersMap = dynamicFormResponse?.answers?.values ?? {}
              const saveResult = await upsertConsultationAnswers({
                consultationId: updatedConsultation.consultationId || visit.id,
                visitId: visit.id,
                patientId: visit.patient.id,
                departmentId: departmentToSave,
                formId: String(formId),
                formSchemaVersion: String(formSchemaVersion),
                status: updatedConsultation.status === 'finalized' ? 'FINAL' : 'DRAFT',
                answers: JSON.stringify(answersMap),
              })

              if (saveResult?.status !== 'SUCCESS') {
                const backendMessage = saveResult?.messages?.map((m) => m?.text).filter(Boolean).join(' | ') || 'Failed to persist consultation answers'
                const alreadyFinalMessage = /already\s+FINAL/i.test(backendMessage)

                if (alreadyFinalMessage) {
                  answersAlreadyFinal = true
                  console.warn('Skipping upsert because backend reports answers are already FINAL')
                } else {
                  console.error('Failed to persist consultation answers', saveResult?.messages)
                  toast.error(backendMessage)
                  return
                }
              }
            } else {
              console.log('Skipping upsert because consultation answers are already FINAL')
            }

            if (updatedConsultation.status === 'finalized') {
              const completeResult = await updateDepartmentStatus(visit.id, departmentToSave, 'COMPLETED')
              if (completeResult?.status !== 'SUCCESS') {
                console.error('Consultation answers saved, but completing department failed', completeResult?.messages)
                toast.error(completeResult?.messages?.[0]?.text || 'Failed to complete department status')
                return
              }

              router.push('/')
              return
            }

            console.log('Consultation answers saved', {
              consultationId: updatedConsultation.consultationId || visit.id,
              departmentId: departmentToSave,
              formId: String(formId),
              status: updatedConsultation.status,
            })
          } catch (error) {
            console.error('Unexpected consultation save error', error)
            toast.error('Unexpected consultation save error')
          }
        }}
        onBack={() => router.back()}
      />
      <VisitNotesFloating
        title="Consultation Notes"
        notes={scopedNotes}
        noteTypes={[
          'GENERAL',
          'DIAGNOSIS',
          'PRESCRIPTION',
          'OBSERVATION',
          'INTERNAL',
          'RECEPTION',
          'REPORT',
          'BILLING',
        ]}
        onAddNote={async (type, text) => {
          const departmentToSave = String(firstDepartmentId || '')
          if (!departmentToSave) {
            throw new Error('No department selected for consultation note')
          }

          const result = await addDepartmentNote(visit.id, departmentToSave, type, text)
          if (result?.status !== 'SUCCESS') {
            throw new Error(result?.messages?.[0]?.text || 'Failed to add note')
          }
          await refetch()
        }}
      />
    </div>
  )
}
