"use client"

import { useEffect, useState } from "react"
import type { Patient } from "@/lib/types"
import { useAddActionToVisitDepartment, useRemoveActionFromVisitDepartment, useAddConsumableToVisitDepartment, useRemoveConsumableFromVisitDepartment } from "@/hooks/auth-hooks"
import { useConsultationAnswers, useLatestForm } from "@/hooks/forms"
import AddActionConsumableModal from "@/components/add-action-consumable-modal"
import FormActionsDisplay from "@/components/form-actions-display"
import { ConsultationSidePanels } from "@/components/consultation/consultation-side-panels"
import { ConsultationBottomDock } from "@/components/consultation/consultation-bottom-dock"
import { ConsultationFormDisplay } from "@/components/consultation/consultation-form-display"
import { useUpdateProductQuantity } from "@/hooks/visits"
import {
  normalizeField,
  normalizeSection,
  buildAnswersForSubmission,
  hydrateSavedAnswers,
  type BackendDepartmentForm,
} from "@/components/consultation/consultation-form-utils"
import type { FormAction } from "@/lib/form-storage"

interface ConsultationViewBackboneProps {
  consultation: any
  patient: Patient
  departmentId?: string
  onSave: (consultation: any) => void
  onBack: () => void
}

interface PanelState {
  pinned: boolean
  hover: boolean
}

export default function ConsultationViewBackbone({
  consultation: initialConsultation,
  patient,
  departmentId,
  onSave,
  onBack: _onBack,
}: ConsultationViewBackboneProps) {
  const [consultation, setConsultation] = useState<any>(initialConsultation)
  const [departmentForm, setDepartmentForm] = useState<BackendDepartmentForm | null>(null)
  const [formAnswers, setFormAnswers] = useState<Record<string, any>>({})
  const [existingSubmissionStatus, setExistingSubmissionStatus] = useState<'DRAFT' | 'FINAL' | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formLoadFailed, setFormLoadFailed] = useState(false)
  const [formReloadKey, setFormReloadKey] = useState(0)
  const { loadLatestForm: loadForm } = useLatestForm(departmentId || null)
  const { loadConsultationAnswers: loadAnswers } = useConsultationAnswers(initialConsultation.consultationId || null, departmentId || null, departmentForm?.id || null)
  
  // Action/consumable modal state
  const [showAddActionModal, setShowAddActionModal] = useState(false)
  const [actionListenerFieldId, setActionListenerFieldId] = useState<string | null>(null)
  const [fieldActions, setFieldActions] = useState<Record<string, FormAction[]>>({})
  const [tableShapes, setTableShapes] = useState<Record<string, { rows: number; columns: number }>>({})
  const [diagnosticDrafts, setDiagnosticDrafts] = useState<Record<string, { diagnosis: string; description: string }>>({})
  const [medicationLongDrafts, setMedicationLongDrafts] = useState<Record<string, { name: string; frequency: string; amount: string; days: string; notes: string }>>({})
  const [medicationMiniDrafts, setMedicationMiniDrafts] = useState<Record<string, { name: string; notes: string }>>({})
  const { addAction } = useAddActionToVisitDepartment()
  const { removeAction } = useRemoveActionFromVisitDepartment()
  const { addConsumable } = useAddConsumableToVisitDepartment()
  const { removeConsumable } = useRemoveConsumableFromVisitDepartment()
  const { updateQuantity: updateProductQuantity } = useUpdateProductQuantity()

  // Panel states
  const [idPanel, setIdPanel] = useState<PanelState>({ pinned: false, hover: false })
  const [vitalsPanel, setVitalsPanel] = useState<PanelState>({ pinned: false, hover: false })
  const [historyPanel, setHistoryPanel] = useState<PanelState>({ pinned: false, hover: false })

  // Load form on department change
  useEffect(() => {
    const loadLatestFinalizedForm = async () => {
      if (!departmentId) {
        setDepartmentForm(null)
        return
      }

      try {
        setFormLoading(true)
        setFormLoadFailed(false)

        const formResult = await loadForm({
          variables: { departmentId },
          fetchPolicy: 'network-only',
        })

        const raw = formResult?.data?.getLatestForm?.data
        if (!raw) {
          setDepartmentForm(null)
          return
        }

        setDepartmentForm({
          id: String(raw.id),
          title: raw.title || 'Consultation Form',
          description: raw.description || '',
          status: raw.status === 'FINAL' ? 'FINAL' : 'DRAFT',
          currentVersionNumber: raw.version || undefined,
          currentSchemaVersion: raw.version || undefined,
          fields: Array.isArray(raw.fields) ? raw.fields.map((field: any, idx: number) => normalizeField(field, idx)) : [],
          sections: Array.isArray(raw.sections) ? raw.sections.map((section: any, idx: number) => normalizeSection(section, idx)) : [],
        })
      } catch (err) {
        console.error('Failed to load finalized department form', err)
        setDepartmentForm(null)
        setFormLoadFailed(true)
      } finally {
        setFormLoading(false)
      }
    }

    loadLatestFinalizedForm()
  }, [departmentId, loadForm, formReloadKey])

  // Load existing answers on form/consultation change
  useEffect(() => {
    const loadExistingAnswers = async () => {
      if (!departmentId || !consultation.consultationId || !departmentForm) {
        return
      }

      try {
        const answersResult = await loadAnswers({
          variables: {
            consultationId: consultation.consultationId,
            departmentId,
            formId: departmentForm.id,
          },
          fetchPolicy: 'network-only',
        })

        const answerData = answersResult?.data?.getConsultationAnswers?.data
        const rawAnswers = answerData?.answers
        const storedStatus = answerData?.status
        const storedFormId = answerData?.formId ? String(answerData.formId) : ''
        const storedSchemaVersion = answerData?.formVersion ? String(answerData.formVersion) : ''
        const expectedFormId = String(departmentForm.id || '')
        const expectedSchemaVersion = departmentForm.currentSchemaVersion ? String(departmentForm.currentSchemaVersion) : ''

        setExistingSubmissionStatus(storedStatus === 'FINAL' ? 'FINAL' : storedStatus === 'DRAFT' ? 'DRAFT' : null)

        const formMatches = storedFormId && expectedFormId && storedFormId === expectedFormId
        const schemaMatches = !expectedSchemaVersion || !storedSchemaVersion || storedSchemaVersion === expectedSchemaVersion

        if (!formMatches || !schemaMatches) {
          setFormAnswers({})
          setFieldActions({})
          setTableShapes({})
          return
        }

        if (!rawAnswers) {
          return
        }

        const parsed = JSON.parse(rawAnswers)
        const answerMap = parsed?.values && typeof parsed.values === 'object' ? parsed.values : parsed

        if (answerMap && typeof answerMap === 'object') {
          hydrateSavedAnswers(answerMap, departmentForm, setFormAnswers, setFieldActions, setTableShapes)
        }
      } catch (err) {
        console.error('Failed to load existing consultation answers', err)
      }
    }

    loadExistingAnswers()
  }, [consultation.consultationId, departmentForm, departmentId, loadAnswers])
  
  const handleStatusSave = (status: 'draft' | 'finalized') => {
    const normalizedAnswers = buildAnswersForSubmission(formAnswers, tableShapes, fieldActions, departmentForm)

    const answersPayload = {
      formId: departmentForm?.id,
      formSchemaVersion: departmentForm?.currentSchemaVersion,
      formVersionNumber: departmentForm?.currentVersionNumber,
      values: normalizedAnswers,
    }

    const formSubmissionPayload = {
      consultationId: consultation.consultationId,
      departmentId,
      formId: departmentForm?.id,
      formSchemaVersion: departmentForm?.currentSchemaVersion,
      formVersionNumber: departmentForm?.currentVersionNumber,
      formTitle: departmentForm?.title,
      existingSubmissionStatus,
      status,
      answers: answersPayload,
      submittedAt: new Date().toISOString(),
    }

    if (status === 'finalized') {
      console.log('Consultation form completed:', formSubmissionPayload)
    } else {
      console.log('Consultation form draft saved:', formSubmissionPayload)
    }

    const timestamped = {
      ...consultation.timestamps,
      finalizedAt: status === 'finalized'
        ? consultation.timestamps.finalizedAt ?? new Date().toISOString()
        : undefined,
    }

    const updated: any = {
      ...consultation,
      status,
      timestamps: timestamped,
      specialtyExtensions: {
        ...(consultation.specialtyExtensions || {}),
        dynamicFormResponse: formSubmissionPayload,
      },
    }

    setConsultation(updated)
    onSave(updated)
  }

  const handleAddAction = async (type: 'action' | 'consumable', item: any, quantity: number, departmentIdParam: string) => {
    if (!actionListenerFieldId) return

    try {
      const visitId = consultation.consultationId
      const searchResultId = item.id
      
      let result: any = null
      if (type === 'action') {
        result = await addAction(visitId, departmentIdParam, searchResultId, quantity)
      } else {
        result = await addConsumable(visitId, departmentIdParam, searchResultId, quantity)
      }

      if (result?.status === 'SUCCESS' && result.data) {
        let actualBackendId: string | null = null
        
        if (result.data?.departments) {
          const dept = result.data.departments.find((d: any) => String(d.id) === String(departmentIdParam))
          if (dept) {
            const actionsList = type === 'action' ? dept.actions : dept.consumables
            if (actionsList && actionsList.length > 0) {
              const addedItem = actionsList.find((action: any) => {
                const actionOrConsumableRef = type === 'action' ? action.action : action.consumable
                return String(actionOrConsumableRef?.id) === String(searchResultId)
              })
              if (addedItem?.id) {
                actualBackendId = String(addedItem.id)
              }
            }
          }
        }

        if (!actualBackendId) {
          actualBackendId = String(searchResultId)
        }

        const newAction: FormAction = {
          id: `${type}-${searchResultId}-${Date.now()}`,
          name: item.name,
          type,
          quantity,
          privatePrice: item.privatePrice,
          isQuantifiable: item.isQuantifiable !== false,
          backendId: actualBackendId,
          rawData: item,
        }

        setFieldActions(prev => ({
          ...prev,
          [actionListenerFieldId]: [...(prev[actionListenerFieldId] || []), newAction],
        }))
      }
    } catch (err) {
      console.error('Failed to add action/consumable:', err)
    }
  }

  const handleRemoveAction = async (fieldId: string, actionId: string) => {
    const action = fieldActions[fieldId]?.find(a => a.id === actionId)
    if (!action || !action.backendId) return

    try {
      const visitId = consultation.consultationId
      const departmentIdParam = departmentId || ''

      if (action.type === 'action') {
        const result = await removeAction(visitId, departmentIdParam, action.backendId)
        if (result?.status === 'SUCCESS') {
          setFieldActions(prev => ({
            ...prev,
            [fieldId]: prev[fieldId]?.filter(a => a.id !== actionId) || [],
          }))
        }
      } else {
        const result = await removeConsumable(visitId, departmentIdParam, action.backendId)
        if (result?.status === 'SUCCESS') {
          setFieldActions(prev => ({
            ...prev,
            [fieldId]: prev[fieldId]?.filter(a => a.id !== actionId) || [],
          }))
        }
      }
    } catch (err) {
      console.error('Failed to remove action/consumable:', err)
    }
  }

  const handleUpdateActionQuantity = async (fieldId: string, actionId: string, quantity: number) => {
    const action = fieldActions[fieldId]?.find(a => a.id === actionId)
    
    // Update local state first
    setFieldActions(prev => ({
      ...prev,
      [fieldId]: prev[fieldId]?.map(a => a.id === actionId ? { ...a, quantity } : a) || [],
    }))

    // If we have a backendId and quantity is 0, remove the item from backend
    if (action?.backendId && quantity === 0) {
      await handleRemoveAction(fieldId, actionId)
      return
    }

    // If we have a backendId, update the quantity on the backend
    if (action?.backendId) {
      try {
        await updateProductQuantity(action.backendId, quantity)
      } catch (err) {
        console.error('Failed to update quantity on backend:', err)
        // Revert local state on error
        setFieldActions(prev => ({
          ...prev,
          [fieldId]: prev[fieldId]?.map(a => a.id === actionId ? { ...a, quantity: action.quantity } : a) || [],
        }))
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
<ConsultationFormDisplay
             departmentForm={departmentForm}
             formLoading={formLoading}
             formLoadFailed={formLoadFailed}
             formAnswers={formAnswers}
             setFormAnswers={setFormAnswers}
             tableShapes={tableShapes}
             setTableShapes={setTableShapes}
             diagnosticDrafts={diagnosticDrafts}
             setDiagnosticDrafts={setDiagnosticDrafts}
             medicationLongDrafts={medicationLongDrafts}
             setMedicationLongDrafts={setMedicationLongDrafts}
             medicationMiniDrafts={medicationMiniDrafts}
             setMedicationMiniDrafts={setMedicationMiniDrafts}
             fieldActions={fieldActions}
             onFormReload={() => setFormReloadKey((prev) => prev + 1)}
             onActionListenerClick={() => setShowAddActionModal(true)}
             onUpdateQuantity={handleUpdateActionQuantity}
             onRemoveAction={handleRemoveAction}
             visitId={consultation.consultationId}
             currentDepartmentId={departmentId}
           />
        </div>
      </div>

      <ConsultationSidePanels
        patient={patient}
        idPanel={idPanel}
        vitalsPanel={vitalsPanel}
        historyPanel={historyPanel}
        setIdPanel={setIdPanel}
        setVitalsPanel={setVitalsPanel}
        setHistoryPanel={setHistoryPanel}
      />

      <ConsultationBottomDock
        onSaveDraft={() => handleStatusSave('draft')}
        onComplete={() => handleStatusSave('finalized')}
      />

      <AddActionConsumableModal
        isOpen={showAddActionModal}
        onClose={() => setShowAddActionModal(false)}
        departments={departmentId ? [{ id: departmentId, name: '' }] : []}
        currentDepartmentId={departmentId}
        viewMode="service"
        onAdd={handleAddAction}
      />
    </div>
  )
}
