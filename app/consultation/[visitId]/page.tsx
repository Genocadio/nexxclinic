"use client"

import { useParams, useRouter } from "next/navigation"
import { useCompleteConsultationVisit, useVisit } from "@/hooks/auth-hooks"
import { useVisitDepartmentNotes, useAddVisitDepartmentNote, useMarkVisitDepartmentNotesViewed } from "@/hooks/visits/hooks"
import { useAuth } from "@/lib/auth-context"
import ConsultationViewBackbone from "@/components/consultation-view-backbone"
import VisitNotesFloating from "@/components/visit-notes-floating"
import Header from "@/components/header"
import type { Patient } from "@/lib/api-types"
import { EncounterType } from "@/lib/api-types"
import type { FormAction } from "@/lib/form-storage"
import { Button } from "@/components/ui/button"
import { FlaskConical, StickyNote } from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import InlineTryAgain from "@/components/inline-try-again"
import { toast } from "react-toastify"

export default function ConsultationPage() {
  const router = useRouter()
  const params = useParams()
  const visitId = params.visitId as string
  const { doctor } = useAuth()
  const { visit, loading, error, refetch } = useVisit(visitId)
  const { completeConsultationVisit } = useCompleteConsultationVisit()
  const { addVisitDepartmentNote } = useAddVisitDepartmentNote()
  const { markNotesViewed } = useMarkVisitDepartmentNotesViewed()
  const [notesOpen, setNotesOpen] = useState(false)
  const [requestProductsOpen, setRequestProductsOpen] = useState(false)

  const firstDepartment = visit?.departments?.[0]
  const firstVisitDepartmentId = firstDepartment?.id
  const { notes: departmentNotes, loading: notesLoading, refetch: refetchNotes } = useVisitDepartmentNotes(
    visitId,
    firstVisitDepartmentId || null
  )

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
          <InlineTryAgain onTryAgain={() => { void refetch() }} />
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

  const firstDepartmentId = firstDepartment?.department?.id || firstDepartment?.id
  const firstDepartmentStatus = firstDepartment?.status

  const consultation = {
    consultationId: visit.id,
    encounterType:
      firstDepartment?.encounterType === EncounterType.INPATIENT_ADMISSION ||
      firstDepartment?.encounterType === EncounterType.INPATIENT_OBSERVATION
        ? "inpatient"
        : "outpatient",
    department: firstDepartment?.department?.name || "general",
    status: "draft" as const,
    timestamps: {
      startedAt: visit.visitDate || new Date().toISOString(),
      finalizedAt: undefined,
    },
    reasonForVisit: {
      chiefComplaint: "",
      presentingBodySite: "",
      onset: undefined,
    },
    history: {
      isAllergyReviewPerformed: false,
      allergies: [] as string[],
      pastMedicalHistory: [] as string[],
    },
    reviewOfSystems: {
      performed: false,
      findings: [] as string[],
    },
    assessment: {
      problemList: [] as string[],
      diagnoses: [] as string[],
      clinicalImpression: "",
    },
    plan: {
      orders: [] as unknown[],
    },
    specialtyExtensions: {},
    audit: {
      createdBy: doctor?.id || "",
      lastUpdatedBy: doctor?.id || "",
      version: 1,
    },
    id: visit.id,
    patientId: visit.patient.id,
    doctorId: doctor?.id || "",
    date: visit.visitDate,
  }

  const patient: Patient = visit.patient

  const existingProducts: FormAction[] = (firstDepartment?.products || []).map((line) => ({
    id: line.id,
    name: line.product.name,
    type: line.product.type === "CONSUMABLE_DEVICE" ? "consumable" : "action",
    quantity: line.quantity || 0,
    price: Number(line.price ?? line.product.clinicPrice ?? line.product.privateRhicPrice ?? 0),
    privatePrice: Number(line.price ?? line.product.clinicPrice ?? line.product.privateRhicPrice ?? 0),
    isQuantifiable: true,
    backendId: String(line.id),
  }))

  const requestProductsEnabled = Boolean(firstDepartment?.department?.requestsProducts)

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <div className="fixed right-6 top-1/2 z-50 -translate-y-1/2 flex flex-col items-center gap-3 rounded-full border border-border/60 bg-card/80 p-2 shadow-2xl backdrop-blur">
        {requestProductsEnabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setRequestProductsOpen(true)}
            className="rounded-full border border-border/70 bg-background p-2 text-foreground hover:bg-muted"
            title="Investigations"
            aria-label="Open investigations"
          >
            <FlaskConical className="h-5 w-5" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setNotesOpen((prev) => !prev)}
          className="rounded-full border border-border/70 bg-background p-2 text-foreground hover:bg-muted"
          title="Notes"
          aria-label="Open notes"
        >
          <StickyNote className="h-5 w-5" />
        </Button>
      </div>
      <ConsultationViewBackbone
        consultation={consultation}
        patient={patient}
        departmentId={firstDepartmentId ? String(firstDepartmentId) : undefined}
        departmentStatus={firstDepartmentStatus ? String(firstDepartmentStatus) : undefined}
        visitDepartmentId={firstVisitDepartmentId ? String(firstVisitDepartmentId) : undefined}
        existingProducts={existingProducts}
        requestProductsEnabled={requestProductsEnabled}
        requestProductsOpen={requestProductsOpen}
        onRequestProductsOpenChange={setRequestProductsOpen}
        userRoles={doctor?.roles || []}
        onSave={async (updatedConsultation) => {
          try {
            const dynamicFormResponse = (updatedConsultation.specialtyExtensions as any)?.dynamicFormResponse
            const formId = dynamicFormResponse?.formId
            const formVersion = dynamicFormResponse?.formVersion || dynamicFormResponse?.formSchemaVersion || dynamicFormResponse?.formVersionNumber
            const departmentToSave = String(dynamicFormResponse?.departmentId || firstDepartmentId || '')
            const desiredStatus = updatedConsultation.status === 'finalized' ? 'FINAL' : 'DRAFT'
            const answersMap = dynamicFormResponse?.answers?.values ?? {}

            if (!formId || !departmentToSave || formVersion === undefined || formVersion === null) {
              console.warn('Skipping consultation answers save: missing form context', {
                formId,
                formVersion,
                departmentToSave,
              })
              toast.error('Form context is missing. Please refresh and try again.')
              return
            }

            const completeResult = await completeConsultationVisit({
              consultationId: updatedConsultation.consultationId || visit.id,
              visitId: visit.id,
              patientId: visit.patient.id,
              departmentId: departmentToSave,
              formId: String(formId),
              formVersion: String(formVersion),
              status: desiredStatus,
              answers: JSON.stringify(answersMap),
            }, updatedConsultation.status === 'finalized')

            if (completeResult?.status !== 'SUCCESS') {
              const backendMessage = completeResult?.messages?.map((m) => m?.text).filter(Boolean).join(' | ') || 'Failed to complete consultation'
              toast.error(backendMessage)
              return
            }

            toast.success(completeResult?.message || 'Consultation saved successfully')
            console.log('Consultation answers saved', {
              consultationId: updatedConsultation.consultationId || visit.id,
              departmentId: departmentToSave,
              formId: String(formId),
              status: updatedConsultation.status,
            })

            if (updatedConsultation.status === 'finalized') {
              router.push('/')
            }
          } catch (error) {
            console.error('Unexpected consultation save error', error)
            toast.error('Unexpected consultation save error')
          }
        }}
        onBack={() => router.back()}
      />
      <VisitNotesFloating
        title="Consultation Notes"
        notes={departmentNotes}
        noteTypes={[
          'BILLING',
          'FORMS',
          'CONSULTATION',
          'ADMIN',
          'PUBLIC',
        ]}
        open={notesOpen}
        onOpenChange={setNotesOpen}
        hideToggleButton
        onAddNote={async (noteType, content) => {
          const visitDepartmentId = String(firstVisitDepartmentId || '')
          if (!visitDepartmentId) {
            throw new Error('No department selected for consultation note')
          }

          const result = await addVisitDepartmentNote(visitDepartmentId, content, noteType)
          if (result?.status !== 'SUCCESS') {
            throw new Error(result?.message || 'Failed to add note')
          }
          await refetchNotes()
          await refetch()
        }}
        onMarkAsViewed={async (noteId) => {
          await markNotesViewed(String(firstVisitDepartmentId || ''))
          await refetchNotes()
          await refetch()
        }}
      />
    </div>
  )
}
