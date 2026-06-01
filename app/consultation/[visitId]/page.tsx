"use client"

import { useParams, useRouter } from "next/navigation"
import { useAddDepartmentNote, useCompleteConsultationVisit, useVisit } from "@/hooks/auth-hooks"
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
  const { visit, loading, error, refetch } = useVisit(visitId)
  const { completeConsultationVisit } = useCompleteConsultationVisit()
  const { addDepartmentNote } = useAddDepartmentNote()

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

  const firstDepartment = visit.departments?.[0]
  const firstDepartmentId = firstDepartment?.department?.id || firstDepartment?.id
  const firstVisitDepartmentId = firstDepartment?.id
  const firstDepartmentStatus = firstDepartment?.status

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
  
  // Extract existing products from the first department.
  // Prefer raw products if present, otherwise rebuild from actions/consumables.
  const rawDepartmentProducts = firstDepartment?.products || []
  const fallbackProductsFromActions = (firstDepartment?.actions || []).map((item: any) => ({
    id: item.id,
    product: {
      id: item.action?.id,
      name: item.action?.name,
      type: item.action?.type,
      privatePrice: item.action?.privatePrice,
    },
    quantity: item.quantity,
  }))
  const fallbackProductsFromConsumables = (firstDepartment?.consumables || []).map((item: any) => ({
    id: item.id,
    product: {
      id: item.consumable?.id,
      name: item.consumable?.name,
      type: item.consumable?.type,
      privatePrice: item.consumable?.privatePrice,
    },
    quantity: item.quantity,
  }))
  const departmentProductsSource = rawDepartmentProducts.length > 0
    ? rawDepartmentProducts
    : [...fallbackProductsFromActions, ...fallbackProductsFromConsumables]

  const existingProducts = departmentProductsSource.map((product: any) => ({
    id: product.id,
    name: product.product?.name || '',
    type: product.product?.type === 'CONSUMABLE_DEVICE' ? 'consumable' : 'action',
    quantity: product.quantity || 0,
    privatePrice: Number(product.product?.privateRhicPrice ?? product.product?.clinicPrice ?? product.product?.privatePrice ?? 0),
    isQuantifiable: true,
    backendId: String(product.id),
    rawData: product,
  }))

  const requestProductsEnabled = (visit.departments || []).some((department) => department.department?.requestsProducts === true)

  console.log('[Consultation-Page] visitId:', visit.id, 'firstDepartmentId:', firstDepartment?.id, 'rawProducts:', rawDepartmentProducts.length, 'actions:', (firstDepartment?.actions || []).length, 'consumables:', (firstDepartment?.consumables || []).length, 'existingProductsMapped:', existingProducts.length)

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <ConsultationViewBackbone
        consultation={consultation}
        patient={patient}
        departmentId={firstDepartmentId ? String(firstDepartmentId) : undefined}
        departmentStatus={firstDepartmentStatus ? String(firstDepartmentStatus) : undefined}
        visitDepartmentId={firstVisitDepartmentId ? String(firstVisitDepartmentId) : undefined}
        existingProducts={existingProducts}
        requestProductsEnabled={requestProductsEnabled}
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
