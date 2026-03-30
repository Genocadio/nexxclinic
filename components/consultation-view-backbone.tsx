"use client"

import { useEffect, useState } from "react"
import type { Patient, Consultation, ConsultationStatus, ReasonForVisit, History, ReviewOfSystems, Assessment, Plan, Allergy, PastMedicalCondition, ReviewOfSystemsFinding, Problem, Diagnosis, Order } from "@/lib/types"
import { gql, useLazyQuery } from "@apollo/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, X, User, HeartPulse, History, CheckCircle, FilePenLine, ArrowRightLeft } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDateOnly } from "@/lib/utils"
import type { FormField, FormSection, FormAction } from "@/lib/form-storage"
import FormActionsDisplay from "@/components/form-actions-display"
import AddActionConsumableModal from "@/components/add-action-consumable-modal"
import InlineTryAgain from "@/components/inline-try-again"
import { useAddActionToVisitDepartment, useRemoveActionFromVisitDepartment, useAddConsumableToVisitDepartment, useRemoveConsumableFromVisitDepartment } from "@/hooks/auth-hooks"

interface ConsultationViewBackboneProps {
  consultation: Consultation
  patient: Patient
  departmentId?: string
  onSave: (consultation: Consultation) => void
  onBack: () => void
}

type BackendFormStatus = 'DRAFT' | 'FINAL'

interface BackendDepartmentForm {
  id: string
  title: string
  description?: string
  status: BackendFormStatus
  currentVersionNumber?: string
  currentSchemaVersion?: string
  fields: FormField[]
  sections: FormSection[]
}

const resolveSchemaVersion = (currentSchemaVersion: unknown, currentVersionNumber?: string): string | undefined => {
  const parsedSchema = Number(currentSchemaVersion)
  if (Number.isFinite(parsedSchema)) {
    return String(parsedSchema)
  }

  // Fallback for backends that only expose semantic version labels.
  const lastVersionToken = String(currentVersionNumber || '').split('.').pop()
  const parsedFromVersionLabel = Number(lastVersionToken)
  if (Number.isFinite(parsedFromVersionLabel)) {
    return String(parsedFromVersionLabel)
  }

  return undefined
}

const GET_FORMS_QUERY = gql`
  query ConsultationGetForms($departmentId: ID!) {
    getForms(departmentId: $departmentId) {
      data {
        id
        title
        status
        updatedAt
        createdAt
      }
    }
  }
`

const GET_FORM_QUERY = gql`
  query ConsultationGetForm($departmentId: ID!, $formId: ID!) {
    getForm(departmentId: $departmentId, formId: $formId) {
      data {
        id
        title
        description
        status
        currentVersionNumber
        currentSchemaVersion
        fields {
          id
          label
          type
          placeholder
          required
          order
          hideLabel
          boldLabel
          italicLabel
          underlineLabel
          centerLabel
          options
          tableConfig {
            mode
            rows
            columns
            headerPlacement
            columnHeaders
            rowHeaders
          }
          conditionalRendering {
            dependsOn
            condition
            value
            itemType
          }
        }
        sections {
          id
          title
          boldTitle
          italicTitle
          underlineTitle
          centerTitle
          columns
          order
          fields {
            id
            label
            type
            placeholder
            required
            order
            hideLabel
            boldLabel
            italicLabel
            underlineLabel
            centerLabel
            options
            tableConfig {
              mode
              rows
              columns
              headerPlacement
              columnHeaders
              rowHeaders
            }
            conditionalRendering {
              dependsOn
              condition
              value
              itemType
            }
          }
        }
      }
    }
  }
`

const GET_CONSULTATION_ANSWERS_QUERY = gql`
  query ConsultationGetAnswers($consultationId: ID!, $departmentId: ID!, $formId: ID!) {
    getConsultationAnswers(consultationId: $consultationId, departmentId: $departmentId, formId: $formId) {
      status
      data {
        id
        formId
        formSchemaVersion
        status
        answers
      }
      messages {
        text
        type
      }
    }
  }
`

interface PanelState {
  pinned: boolean
  hover: boolean
}

interface DiagnosticRecordEntry {
  id: string
  diagnosis: string
  description?: string
}

interface MedicationLongEntry {
  id: string
  name: string
  frequency: string
  amount: string
  days: string
  notes?: string
}

interface MedicationMiniEntry {
  id: string
  name: string
  notes?: string
}

export default function ConsultationViewBackbone({
  consultation: initialConsultation,
  patient,
  departmentId,
  onSave,
  onBack: _onBack,
}: ConsultationViewBackboneProps) {
  const [consultation, setConsultation] = useState<Consultation>(initialConsultation)
  const [departmentForm, setDepartmentForm] = useState<BackendDepartmentForm | null>(null)
  const [formAnswers, setFormAnswers] = useState<Record<string, any>>({})
  const [existingSubmissionStatus, setExistingSubmissionStatus] = useState<'DRAFT' | 'FINAL' | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formLoadFailed, setFormLoadFailed] = useState(false)
  const [formReloadKey, setFormReloadKey] = useState(0)
  const [loadForms] = useLazyQuery(GET_FORMS_QUERY)
  const [loadForm] = useLazyQuery(GET_FORM_QUERY)
  const [loadAnswers] = useLazyQuery(GET_CONSULTATION_ANSWERS_QUERY)
  
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

  const normalizeField = (field: any, idx: number): FormField => ({
    id: field?.id || `field_${idx}`,
    label: field?.label || 'Untitled',
    type: field?.type || 'text',
    placeholder: field?.placeholder || undefined,
    required: Boolean(field?.required),
    order: typeof field?.order === 'number' ? field.order : idx,
    hideLabel: Boolean(field?.hideLabel),
    boldLabel: Boolean(field?.boldLabel),
    italicLabel: Boolean(field?.italicLabel),
    underlineLabel: Boolean(field?.underlineLabel),
    centerLabel: Boolean(field?.centerLabel),
    options: Array.isArray(field?.options) ? field.options.filter(Boolean) : undefined,
    tableConfig: field?.tableConfig
      ? {
          mode: field.tableConfig.mode || 'fixed',
          rows: Number(field.tableConfig.rows) || 3,
          columns: Number(field.tableConfig.columns) || 3,
          headerPlacement: field.tableConfig.headerPlacement || 'none',
          columnHeaders: Array.isArray(field.tableConfig.columnHeaders) ? field.tableConfig.columnHeaders : [],
          rowHeaders: Array.isArray(field.tableConfig.rowHeaders) ? field.tableConfig.rowHeaders : [],
        }
      : undefined,
    conditionalRendering: field?.conditionalRendering
      ? {
          dependsOn: field.conditionalRendering.dependsOn,
          condition: field.conditionalRendering.condition,
          value: field.conditionalRendering.value || undefined,
          itemType: field.conditionalRendering.itemType || undefined,
        }
      : undefined,
  })

  const normalizeSection = (section: any, idx: number): FormSection => ({
    id: section?.id || `section_${idx}`,
    title: section?.title || 'Untitled Section',
    boldTitle: Boolean(section?.boldTitle),
    italicTitle: Boolean(section?.italicTitle),
    underlineTitle: Boolean(section?.underlineTitle),
    centerTitle: Boolean(section?.centerTitle),
    columns: section?.columns === 1 || section?.columns === 2 || section?.columns === 3 || section?.columns === 4 ? section.columns : 2,
    order: typeof section?.order === 'number' ? section.order : idx,
    fields: Array.isArray(section?.fields) ? section.fields.map((field: any, fieldIdx: number) => normalizeField(field, fieldIdx)) : [],
  })

  const getAllFormFields = (form: BackendDepartmentForm | null): FormField[] => {
    if (!form) return []
    return [...(form.fields || []), ...(form.sections || []).flatMap((section) => section.fields || [])]
  }

  const buildAnswersForSubmission = (): Record<string, any> => {
    const payload: Record<string, any> = {}
    const allFields = getAllFormFields(departmentForm)

    allFields.forEach((field) => {
      if (field.type !== 'table' && field.type !== 'actionListener') {
        if (Object.prototype.hasOwnProperty.call(formAnswers, field.id)) {
          payload[field.id] = formAnswers[field.id]
        }
      }

      if (field.type === 'table') {
        const shape = tableShapes[field.id] || {
          rows: field.tableConfig?.rows || 3,
          columns: field.tableConfig?.columns || 3,
        }
        const rows = Math.max(1, shape.rows)
        const columns = Math.max(1, shape.columns)
        const tableRows = Array.from({ length: rows }).map((_, rowIdx) =>
          Array.from({ length: columns }).map((_, colIdx) => {
            const cellKey = `${field.id}_r${rowIdx}_c${colIdx}`
            return payload[cellKey] ?? ''
          }),
        )
        payload[field.id] = { rows: tableRows }
      }

      if (field.type === 'actionListener') {
        const linkedItems = fieldActions[field.id] || []
        payload[field.id] = {
          triggered: linkedItems.length > 0,
          quantity: linkedItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
          items: linkedItems.map((item) => ({
            type: item.type,
            backendId: item.backendId,
            catalogItemId: item.rawData?.id || undefined,
            name: item.name,
            quantity: item.quantity,
          })),
        }
      }
    })

    return payload
  }

  const hydrateSavedAnswers = (savedAnswers: Record<string, any>, form: BackendDepartmentForm) => {
    const nextFormAnswers: Record<string, any> = {}
    const nextFieldActions: Record<string, FormAction[]> = {}
    const nextTableShapes: Record<string, { rows: number; columns: number }> = {}
    const allFields = getAllFormFields(form)

    Object.entries(savedAnswers || {}).forEach(([key, value]) => {
      nextFormAnswers[key] = value
    })

    allFields.forEach((field) => {
      if (field.type === 'table') {
        const tableValue = savedAnswers?.[field.id]
        const rows = Array.isArray(tableValue?.rows) ? tableValue.rows : []
        const derivedRows = Math.max(1, rows.length || field.tableConfig?.rows || 1)
        const derivedColumns = Math.max(
          1,
          rows.reduce((max: number, row: any) => (Array.isArray(row) ? Math.max(max, row.length) : max), 0) || field.tableConfig?.columns || 1,
        )
        nextTableShapes[field.id] = { rows: derivedRows, columns: derivedColumns }

        rows.forEach((row: any[], rowIdx: number) => {
          if (!Array.isArray(row)) return
          row.forEach((cellValue, colIdx) => {
            const cellKey = `${field.id}_r${rowIdx}_c${colIdx}`
            nextFormAnswers[cellKey] = cellValue ?? ''
          })
        })
      }

      if (field.type === 'actionListener') {
        const actionValue = savedAnswers?.[field.id]
        const items = Array.isArray(actionValue?.items) ? actionValue.items : []
        nextFieldActions[field.id] = items.map((item: any, idx: number) => ({
          id: `${field.id}-${item?.backendId || idx}`,
          name: item?.name || 'Unknown item',
          type: item?.type === 'consumable' ? 'consumable' : 'action',
          quantity: Number(item?.quantity || 1),
          privatePrice: Number(item?.privatePrice || 0),
          backendId: item?.backendId,
          rawData: {
            id: item?.catalogItemId,
            ...item,
          },
        }))
      }
    })

    setFormAnswers(nextFormAnswers)
    setFieldActions(nextFieldActions)
    setTableShapes(nextTableShapes)
  }

  useEffect(() => {
    const loadLatestFinalizedForm = async () => {
      if (!departmentId) {
        setDepartmentForm(null)
        return
      }

      try {
        setFormLoading(true)
        setFormLoadFailed(false)
        const formsResult = await loadForms({ variables: { departmentId }, fetchPolicy: 'network-only' })
        const forms = formsResult?.data?.getForms?.data || []

        const latestFinal = [...forms]
          .filter((f: any) => f?.status === 'FINAL')
          .sort((a: any, b: any) => {
            const aDate = new Date(a?.updatedAt || a?.createdAt || 0).getTime()
            const bDate = new Date(b?.updatedAt || b?.createdAt || 0).getTime()
            return bDate - aDate
          })[0]

        if (!latestFinal?.id) {
          setDepartmentForm(null)
          return
        }

        const formResult = await loadForm({
          variables: { departmentId, formId: String(latestFinal.id) },
          fetchPolicy: 'network-only',
        })

        const raw = formResult?.data?.getForm?.data
        if (!raw) {
          setDepartmentForm(null)
          return
        }

        setDepartmentForm({
          id: String(raw.id),
          title: raw.title || 'Consultation Form',
          description: raw.description || '',
          status: raw.status === 'FINAL' ? 'FINAL' : 'DRAFT',
          currentVersionNumber: raw.currentVersionNumber || undefined,
          currentSchemaVersion: resolveSchemaVersion(raw.currentSchemaVersion, raw.currentVersionNumber || undefined),
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
  }, [departmentId, loadForm, loadForms, formReloadKey])

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
        const storedSchemaVersion = answerData?.formSchemaVersion ? String(answerData.formSchemaVersion) : ''
        const expectedFormId = String(departmentForm.id || '')
        const expectedSchemaVersion = departmentForm.currentSchemaVersion ? String(departmentForm.currentSchemaVersion) : ''

        setExistingSubmissionStatus(storedStatus === 'FINAL' ? 'FINAL' : storedStatus === 'DRAFT' ? 'DRAFT' : null)

        const formMatches = storedFormId && expectedFormId && storedFormId === expectedFormId
        const schemaMatches = !expectedSchemaVersion || !storedSchemaVersion || storedSchemaVersion === expectedSchemaVersion

        if (!formMatches || !schemaMatches) {
          // Ignore persisted answers from older/newer schemas to avoid sending invalid keys back to backend.
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
          hydrateSavedAnswers(answerMap, departmentForm)
        }
      } catch (err) {
        console.error('Failed to load existing consultation answers', err)
      }
    }

    loadExistingAnswers()
  }, [consultation.consultationId, departmentForm, departmentId, loadAnswers])
  
  // Simple panel state tracking (pinned/hover only)
  const [idPanel, setIdPanel] = useState<PanelState>({ pinned: false, hover: false })
  const [vitalsPanel, setVitalsPanel] = useState<PanelState>({ pinned: false, hover: false })
  const [historyPanel, setHistoryPanel] = useState<PanelState>({ pinned: false, hover: false })
  
  // Derived visibility states
  const showIdPanel = idPanel.pinned || idPanel.hover
  const showVitalsPanel = vitalsPanel.pinned || vitalsPanel.hover
  const showHistoryPanel = historyPanel.pinned || historyPanel.hover
  
  // Smart auto-positioning (always on the left rail)
  const activePanels = [
    { key: 'id', active: showIdPanel },
    { key: 'vitals', active: showVitalsPanel },
    { key: 'history', active: showHistoryPanel },
  ].filter(p => p.active)

  const getPanelSlot = (panelKey: string): 'single' | 'upper' | 'lower' | 'middle' => {
    if (activePanels.length === 0) return 'single'
    if (activePanels.length === 1) return 'single'
    if (activePanels.length === 2) {
      const panelIndex = activePanels.findIndex(p => p.key === panelKey)
      return panelIndex === 0 ? 'upper' : 'lower'
    }
    // 3 panels (id, vitals, history order preserved)
    const panelIndex = activePanels.findIndex(p => p.key === panelKey)
    return panelIndex === 0 ? 'upper' : panelIndex === 1 ? 'middle' : 'lower'
  }

  const getPositionStyle = (slot: 'single' | 'upper' | 'lower' | 'middle', count: number) => {
    // Keep panels on the left rail with generous vertical spacing, centered as a group
    const base = { left: '5rem', transform: 'translateY(-50%)' }

    if (count <= 1) {
      return { ...base, top: '50%' }
    }

    if (count === 2) {
      return slot === 'upper'
        ? { ...base, top: '30%' }
        : { ...base, top: '70%' }
    }

    // 3 panels
    if (slot === 'upper') return { ...base, top: '25%' }
    if (slot === 'middle') return { ...base, top: '50%' }
    return { ...base, top: '75%' }
  }
  
  // Handle panel click - pin/unpin
  const handlePanelClick = (panelKey: 'id' | 'vitals' | 'history') => {
    if (panelKey === 'id') {
      setIdPanel(prev => ({
        ...prev,
        pinned: !prev.pinned,
        hover: false
      }))
    } else if (panelKey === 'vitals') {
      setVitalsPanel(prev => ({
        ...prev,
        pinned: !prev.pinned,
        hover: false
      }))
    } else if (panelKey === 'history') {
      setHistoryPanel(prev => ({
        ...prev,
        pinned: !prev.pinned,
        hover: false
      }))
    }
  }

  // Update nested state helpers
  const updateReasonForVisit = (updates: Partial<ReasonForVisit>) => {
    setConsultation(prev => ({
      ...prev,
      reasonForVisit: { ...prev.reasonForVisit, ...updates }
    }))
  }

  const updateHistory = (updates: Partial<History>) => {
    setConsultation(prev => ({
      ...prev,
      history: { ...prev.history, ...updates }
    }))
  }

  const addAllergy = () => {
    const newAllergy: Allergy = {
      code: "",
      display: "",
      status: "active"
    }
    updateHistory({
      allergies: [...consultation.history.allergies, newAllergy],
      isAllergyReviewPerformed: true,
    })
  }

  const removeAllergy = (index: number) => {
    const newAllergies = consultation.history.allergies.filter((_, i) => i !== index)
    updateHistory({
      allergies: newAllergies,
      isAllergyReviewPerformed: newAllergies.length > 0,
    })
  }

  const updateAllergy = (index: number, updates: Partial<Allergy>) => {
    const updatedAllergies = [...consultation.history.allergies]
    updatedAllergies[index] = { ...updatedAllergies[index], ...updates }
    updateHistory({ 
      allergies: updatedAllergies,
      isAllergyReviewPerformed: updatedAllergies.length > 0,
    })
  }

  const addPastMedicalCondition = () => {
    const newCondition: PastMedicalCondition = {
      conditionId: `condition-${Date.now()}`,
      code: "",
      display: ""
    }
    updateHistory({
      pastMedicalHistory: [...consultation.history.pastMedicalHistory, newCondition]
    })
  }

  const removePastMedicalCondition = (index: number) => {
    updateHistory({
      pastMedicalHistory: consultation.history.pastMedicalHistory.filter((_, i) => i !== index)
    })
  }

  const updatePastMedicalCondition = (index: number, updates: Partial<PastMedicalCondition>) => {
    const updatedConditions = [...consultation.history.pastMedicalHistory]
    updatedConditions[index] = { ...updatedConditions[index], ...updates }
    updateHistory({ pastMedicalHistory: updatedConditions })
  }

  const updateReviewOfSystems = (updates: Partial<ReviewOfSystems>) => {
    setConsultation(prev => ({
      ...prev,
      reviewOfSystems: { ...prev.reviewOfSystems, ...updates }
    }))
  }

  const addROSFinding = () => {
    const newFinding: ReviewOfSystemsFinding = {
      system: "general",
      finding: "",
      isPositive: false
    }
    updateReviewOfSystems({
      findings: [...consultation.reviewOfSystems.findings, newFinding]
    })
  }

  const removeROSFinding = (index: number) => {
    updateReviewOfSystems({
      findings: consultation.reviewOfSystems.findings.filter((_, i) => i !== index)
    })
  }

  const updateROSFinding = (index: number, updates: Partial<ReviewOfSystemsFinding>) => {
    const updatedFindings = [...consultation.reviewOfSystems.findings]
    updatedFindings[index] = { ...updatedFindings[index], ...updates }
    updateReviewOfSystems({ findings: updatedFindings })
  }

  const updateAssessment = (updates: Partial<Assessment>) => {
    setConsultation(prev => ({
      ...prev,
      assessment: { ...prev.assessment, ...updates }
    }))
  }

  const addProblem = () => {
    const newProblem: Problem = {
      problemId: `problem-${Date.now()}`,
      description: "",
      status: "active"
    }
    updateAssessment({
      problemList: [...consultation.assessment.problemList, newProblem]
    })
  }

  const removeProblem = (index: number) => {
    updateAssessment({
      problemList: consultation.assessment.problemList.filter((_, i) => i !== index)
    })
  }

  const updateProblem = (index: number, updates: Partial<Problem>) => {
    const updatedProblems = [...consultation.assessment.problemList]
    updatedProblems[index] = { ...updatedProblems[index], ...updates }
    updateAssessment({ problemList: updatedProblems })
  }

  const addDiagnosis = () => {
    const newDiagnosis: Diagnosis = {
      code: "",
      description: "",
      isPrimary: false,
      type: "provisional"
    }
    updateAssessment({
      diagnoses: [...consultation.assessment.diagnoses, newDiagnosis]
    })
  }

  const removeDiagnosis = (index: number) => {
    updateAssessment({
      diagnoses: consultation.assessment.diagnoses.filter((_, i) => i !== index)
    })
  }

  const updateDiagnosis = (index: number, updates: Partial<Diagnosis>) => {
    const updatedDiagnoses = [...consultation.assessment.diagnoses]
    updatedDiagnoses[index] = { ...updatedDiagnoses[index], ...updates }
    updateAssessment({ diagnoses: updatedDiagnoses })
  }

  const updatePlan = (updates: Partial<Plan>) => {
    setConsultation(prev => ({
      ...prev,
      plan: { ...prev.plan, ...updates }
    }))
  }

  const handleStatusSave = (status: ConsultationStatus) => {
    const normalizedAnswers = buildAnswersForSubmission()

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

    const updated: Consultation = {
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

  const addOrder = () => {
    const newOrder: Order = {
      orderId: `order-${Date.now()}`,
      category: "medication",
      orderCode: "",
      instruction: "",
      intent: "order"
    }
    updatePlan({
      orders: [...consultation.plan.orders, newOrder]
    })
  }

  const removeOrder = (index: number) => {
    updatePlan({
      orders: consultation.plan.orders.filter((_, i) => i !== index)
    })
  }

  const updateOrder = (index: number, updates: Partial<Order>) => {
    const updatedOrders = [...consultation.plan.orders]
    updatedOrders[index] = { ...updatedOrders[index], ...updates }
    updatePlan({ orders: updatedOrders })
  }

  const shouldShowField = (field: FormField) => {
    if (!field.conditionalRendering) return true
    const { dependsOn, condition, value, itemType } = field.conditionalRendering
    const dependentValue = formAnswers[dependsOn]

    switch (condition) {
      case 'notEmpty':
        return dependentValue !== undefined && dependentValue !== null && dependentValue !== ''
      case 'equals':
        return String(dependentValue ?? '') === String(value ?? '')
      case 'checked':
        return Boolean(dependentValue)
      case 'includes':
        return Array.isArray(dependentValue)
          ? dependentValue.includes(value)
          : String(dependentValue ?? '').includes(String(value ?? ''))
      case 'hasItem': {
        const actionItemsFromState = fieldActions[dependsOn] || []
        const actionItemsFromAnswers = Array.isArray(dependentValue?.items) ? dependentValue.items : []
        const items = actionItemsFromState.length > 0 ? actionItemsFromState : actionItemsFromAnswers

        const filteredByType = itemType
          ? items.filter((item: any) => String(item?.type || '').toLowerCase() === String(itemType).toLowerCase())
          : items

        if (!value) return filteredByType.length > 0

        return filteredByType.some((item: any) => {
          const itemName = String(item?.name || '').toLowerCase()
          const expected = String(value).toLowerCase()
          return itemName.includes(expected)
        })
      }
      default:
        return true
    }
  }

  const handleAddAction = async (type: 'action' | 'consumable', item: any, quantity: number, departmentIdParam: string) => {
    if (!actionListenerFieldId) return

    try {
      const visitId = consultation.consultationId
      const searchResultId = item.id
      
      console.log('Adding action/consumable with search result ID:', searchResultId, 'Type:', type, 'Item name:', item.name)
      
      let result: any = null
      if (type === 'action') {
        result = await addAction(visitId, departmentIdParam, searchResultId, quantity)
      } else {
        result = await addConsumable(visitId, departmentIdParam, searchResultId, quantity)
      }

      if (result?.status === 'SUCCESS' && result.data) {
        console.log('Add action response - full visit data:', result.data)
        
        // Extract actual VisitAction ID from response
        let actualBackendId: string | null = null
        
        if (result.data?.departments) {
          const dept = result.data.departments.find((d: any) => String(d.id) === String(departmentIdParam))
          console.log(`Found department:`, dept?.id, `Looking for dept ID:`, departmentIdParam, `Match:`, dept !== undefined)
          
          if (dept) {
            const actionsList = type === 'action' ? dept.actions : dept.consumables
            console.log(`${type} list from response:`, actionsList)
            
            if (actionsList && actionsList.length > 0) {
              // Find by matching the backend action/consumable ID with our search result
              const addedItem = actionsList.find((action: any) => {
                const actionOrConsumableRef = type === 'action' ? action.action : action.consumable
                return String(actionOrConsumableRef?.id) === String(searchResultId)
              })
              
              if (addedItem?.id) {
                actualBackendId = String(addedItem.id)
                console.log(`Successfully found VisitAction ID: ${actualBackendId} (search ID was: ${searchResultId})`)
              }
            }
          }
        }

        // Fallback: if we couldn't extract, just use the search ID (this is the problem case)
        if (!actualBackendId) {
          console.warn(`WARNING: Could not extract VisitAction ID from response, falling back to search ID: ${searchResultId}`)
          console.warn('This may cause errors in update/remove operations')
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

        console.log('Storing FormAction with backendId:', newAction.backendId, 'Full action:', newAction)

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

  const handleUpdateActionQuantity = (fieldId: string, actionId: string, quantity: number) => {
    setFieldActions(prev => ({
      ...prev,
      [fieldId]: prev[fieldId]?.map(a => a.id === actionId ? { ...a, quantity } : a) || [],
    }))
  }

  const renderFormFieldControl = (field: FormField) => {
    const currentValue = formAnswers[field.id]
    const contrastInputClass = "border-border/80 bg-background/80 dark:bg-slate-950/60 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:border-primary/70"
    const ensureHeaders = (count: number, source: string[] | undefined, prefix: string) =>
      Array.from({ length: count }).map((_, idx) => source?.[idx] || `${prefix} ${idx + 1}`)

    switch (field.type) {
      case 'text':
        return <Input className={contrastInputClass} value={currentValue || ''} placeholder={field.placeholder || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))} />
      case 'email':
        return <Input className={contrastInputClass} type="email" value={currentValue || ''} placeholder={field.placeholder || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))} />
      case 'number':
        return <Input className={contrastInputClass} type="number" value={currentValue || ''} placeholder={field.placeholder || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))} />
      case 'date':
        return <Input className={contrastInputClass} type="date" value={currentValue || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))} />
      case 'textarea':
        return <Textarea className={contrastInputClass} rows={3} value={currentValue || ''} placeholder={field.placeholder || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))} />
      case 'select':
        return (
          <Select value={currentValue || ''} onValueChange={(v) => setFormAnswers((prev) => ({ ...prev, [field.id]: v }))}>
            <SelectTrigger className={contrastInputClass}>
              <SelectValue placeholder={field.placeholder || 'Select option'} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'radio':
        return (
          <div className="space-y-2">
            {(field.options || []).map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm rounded-md border border-border/70 bg-background/60 px-3 py-2">
                <input type="radio" name={field.id} checked={currentValue === opt} onChange={() => setFormAnswers((prev) => ({ ...prev, [field.id]: opt }))} />
                {opt}
              </label>
            ))}
          </div>
        )
      case 'checkbox':
        return (
          <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background/60 px-3 py-2">
            <Checkbox checked={Boolean(currentValue)} onCheckedChange={(checked) => setFormAnswers((prev) => ({ ...prev, [field.id]: Boolean(checked) }))} />
            <span className="text-sm">{field.placeholder || 'Checked'}</span>
          </div>
        )
      case 'table': {
        const cfg = field.tableConfig || { mode: 'fixed' as const, rows: 3, columns: 3, headerPlacement: 'none' as const }
        const shape = tableShapes[field.id] || { rows: cfg.rows, columns: cfg.columns }
        const rows = Math.max(1, shape.rows)
        const columns = Math.max(1, shape.columns)
        const hasLeft = cfg.headerPlacement === 'left' || cfg.headerPlacement === 'both'
        const hasRight = cfg.headerPlacement === 'right' || cfg.headerPlacement === 'both'
        const hasTop = cfg.headerPlacement === 'top' || cfg.headerPlacement === 'both'
        const columnHeaders = hasTop ? ensureHeaders(columns, cfg.columnHeaders, 'Column') : []
        const rowHeaders = (hasLeft || hasRight) ? ensureHeaders(rows, cfg.rowHeaders, 'Row') : []

        const updateShape = (nextRows: number, nextCols: number) => {
          setTableShapes((prev) => ({ ...prev, [field.id]: { rows: Math.max(1, nextRows), columns: Math.max(1, nextCols) } }))
        }

        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{rows} x {columns}</span>
              {cfg.mode === 'variableRows' && (
                <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => updateShape(rows + 1, columns)}>+ Row</Button>
              )}
              {cfg.mode === 'variableColumns' && (
                <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => updateShape(rows, columns + 1)}>+ Col</Button>
              )}
              {cfg.headerPlacement !== 'none' && <span className="text-[10px] text-muted-foreground">headers: {cfg.headerPlacement}</span>}
            </div>
            <div className="overflow-auto border border-border/70 rounded-md bg-background/50">
            <table className="min-w-full border-collapse text-sm">
              {hasTop && (
                <thead>
                  <tr>
                    {hasLeft && <th className="w-24 border border-border/60 bg-muted/40 px-2 py-1 text-left font-semibold" />}
                    {Array.from({ length: columns }).map((_, colIdx) => (
                      <th key={`${field.id}_ch_${colIdx}`} className="border border-border/60 bg-muted/40 px-2 py-1 text-left font-semibold">
                        {columnHeaders[colIdx]}
                      </th>
                    ))}
                    {hasRight && <th className="w-24 border border-border/60 bg-muted/40 px-2 py-1 text-left font-semibold" />}
                  </tr>
                </thead>
              )}
              <tbody>
                {Array.from({ length: rows }).map((_, rowIdx) => (
                  <tr key={`${field.id}_r_${rowIdx}`}>
                    {hasLeft && (
                      <th className="border border-border/60 bg-muted/30 px-2 py-1 text-left font-medium whitespace-nowrap">
                        {rowHeaders[rowIdx]}
                      </th>
                    )}
                    {Array.from({ length: columns }).map((_, colIdx) => {
                      const cellKey = `${field.id}_r${rowIdx}_c${colIdx}`
                      return (
                        <td key={cellKey} className="border border-border/60 p-1 min-w-[90px]">
                          <Input className={contrastInputClass} value={formAnswers[cellKey] || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [cellKey]: e.target.value }))} />
                        </td>
                      )
                    })}
                    {hasRight && (
                      <th className="border border-border/60 bg-muted/30 px-2 py-1 text-left font-medium whitespace-nowrap">
                        {rowHeaders[rowIdx]}
                      </th>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )
      }
      case 'diagnosticRecord': {
        const records: DiagnosticRecordEntry[] = Array.isArray(currentValue) ? currentValue : []
        const draft = diagnosticDrafts[field.id] || { diagnosis: '', description: '' }

        const addRecord = () => {
          const diagnosis = draft.diagnosis.trim()
          const description = draft.description.trim()
          if (!diagnosis) return

          const nextRecord: DiagnosticRecordEntry = {
            id: `diag_${Date.now()}`,
            diagnosis,
            description: description || undefined,
          }

          setFormAnswers((prev) => ({ ...prev, [field.id]: [...records, nextRecord] }))
          setDiagnosticDrafts((prev) => ({ ...prev, [field.id]: { diagnosis: '', description: '' } }))
        }

        return (
          <div className="space-y-3 border rounded-lg p-3 bg-card/40">
            <Input
              className={contrastInputClass}
              placeholder={field.placeholder || 'Enter diagnostic'}
              value={draft.diagnosis}
              onChange={(e) => setDiagnosticDrafts((prev) => ({
                ...prev,
                [field.id]: { ...draft, diagnosis: e.target.value },
              }))}
            />
            <Textarea
              className={contrastInputClass}
              rows={2}
              placeholder="Optional description"
              value={draft.description}
              onChange={(e) => setDiagnosticDrafts((prev) => ({
                ...prev,
                [field.id]: { ...draft, description: e.target.value },
              }))}
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={addRecord} disabled={!draft.diagnosis.trim()} className="rounded-full">
                Add Diagnostic
              </Button>
            </div>
            {records.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                {records.map((record) => (
                  <div key={record.id} className="rounded-md border px-3 py-2 bg-background">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <p className="text-sm font-medium break-words">{record.diagnosis}</p>
                        {record.description && (
                          <p className="text-xs text-muted-foreground break-words">{record.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => setFormAnswers((prev) => ({
                          ...prev,
                          [field.id]: records.filter((r) => r.id !== record.id),
                        }))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }
      case 'medicationLongForm': {
        const records: MedicationLongEntry[] = Array.isArray(currentValue) ? currentValue : []
        const draft = medicationLongDrafts[field.id] || { name: '', frequency: '', amount: '', days: '', notes: '' }

        const addMedication = () => {
          const name = draft.name.trim()
          const frequency = draft.frequency.trim()
          const amount = draft.amount.trim()
          const days = draft.days.trim()
          const notes = draft.notes.trim()
          if (!name || !frequency || !amount || !days) return

          const nextRecord: MedicationLongEntry = {
            id: `med_long_${Date.now()}`,
            name,
            frequency,
            amount,
            days,
            notes: notes || undefined,
          }

          setFormAnswers((prev) => ({ ...prev, [field.id]: [...records, nextRecord] }))
          setMedicationLongDrafts((prev) => ({
            ...prev,
            [field.id]: { name: '', frequency: '', amount: '', days: '', notes: '' },
          }))
        }

        return (
          <div className="space-y-3 border rounded-lg p-3 bg-card/40">
            <Input
              className={contrastInputClass}
              placeholder={field.placeholder || 'Medication name'}
              value={draft.name}
              onChange={(e) => setMedicationLongDrafts((prev) => ({
                ...prev,
                [field.id]: { ...draft, name: e.target.value },
              }))}
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                className={contrastInputClass}
                placeholder="Frequency"
                value={draft.frequency}
                onChange={(e) => setMedicationLongDrafts((prev) => ({
                  ...prev,
                  [field.id]: { ...draft, frequency: e.target.value },
                }))}
              />
              <Input
                className={contrastInputClass}
                placeholder="Amount"
                value={draft.amount}
                onChange={(e) => setMedicationLongDrafts((prev) => ({
                  ...prev,
                  [field.id]: { ...draft, amount: e.target.value },
                }))}
              />
              <Input
                className={contrastInputClass}
                placeholder="Days"
                value={draft.days}
                onChange={(e) => setMedicationLongDrafts((prev) => ({
                  ...prev,
                  [field.id]: { ...draft, days: e.target.value },
                }))}
              />
            </div>
            <Textarea
              className={contrastInputClass}
              rows={2}
              placeholder="Additional notes"
              value={draft.notes}
              onChange={(e) => setMedicationLongDrafts((prev) => ({
                ...prev,
                [field.id]: { ...draft, notes: e.target.value },
              }))}
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={addMedication} disabled={!draft.name.trim() || !draft.frequency.trim() || !draft.amount.trim() || !draft.days.trim()} className="rounded-full">
                Add Medication
              </Button>
            </div>
            {records.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                {records.map((record) => (
                  <div key={record.id} className="rounded-md border px-3 py-2 bg-background">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <p className="text-sm font-medium break-words">{record.name}</p>
                        <p className="text-xs text-muted-foreground break-words">Frequency: {record.frequency} | Amount: {record.amount} | Days: {record.days}</p>
                        {record.notes && <p className="text-xs text-muted-foreground break-words">{record.notes}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => setFormAnswers((prev) => ({
                          ...prev,
                          [field.id]: records.filter((r) => r.id !== record.id),
                        }))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }
      case 'medicationMiniForm': {
        const records: MedicationMiniEntry[] = Array.isArray(currentValue) ? currentValue : []
        const draft = medicationMiniDrafts[field.id] || { name: '', notes: '' }

        const addMedication = () => {
          const name = draft.name.trim()
          const notes = draft.notes.trim()
          if (!name) return

          const nextRecord: MedicationMiniEntry = {
            id: `med_mini_${Date.now()}`,
            name,
            notes: notes || undefined,
          }

          setFormAnswers((prev) => ({ ...prev, [field.id]: [...records, nextRecord] }))
          setMedicationMiniDrafts((prev) => ({ ...prev, [field.id]: { name: '', notes: '' } }))
        }

        return (
          <div className="space-y-3 border rounded-lg p-3 bg-card/40">
            <Input
              className={contrastInputClass}
              placeholder={field.placeholder || 'Medication name'}
              value={draft.name}
              onChange={(e) => setMedicationMiniDrafts((prev) => ({
                ...prev,
                [field.id]: { ...draft, name: e.target.value },
              }))}
            />
            <Textarea
              className={contrastInputClass}
              rows={2}
              placeholder="Extra notes"
              value={draft.notes}
              onChange={(e) => setMedicationMiniDrafts((prev) => ({
                ...prev,
                [field.id]: { ...draft, notes: e.target.value },
              }))}
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={addMedication} disabled={!draft.name.trim()} className="rounded-full">
                Add Medication
              </Button>
            </div>
            {records.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                {records.map((record) => (
                  <div key={record.id} className="rounded-md border px-3 py-2 bg-background">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <p className="text-sm font-medium break-words">{record.name}</p>
                        {record.notes && <p className="text-xs text-muted-foreground break-words">{record.notes}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => setFormAnswers((prev) => ({
                          ...prev,
                          [field.id]: records.filter((r) => r.id !== record.id),
                        }))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }
      case 'actionListener':
        {
        const shouldCenterActionButton = Boolean(field.centerLabel) || /add\s+action\s+or\s+consumable\s+listener/i.test(field.label || '')
        const actionButtonTextStyle = `${field.boldLabel ? 'font-bold' : ''} ${field.italicLabel ? 'italic' : ''} ${field.underlineLabel ? 'underline' : ''}`
        return (
          <div className="space-y-3">
            <div className={shouldCenterActionButton ? 'flex justify-center' : 'flex'}>
            <Button 
              onClick={() => {
                setActionListenerFieldId(field.id)
                setShowAddActionModal(true)
              }}
              className={`inline-flex h-9 px-4 rounded-xl gap-2 border-border/70 bg-card/70 hover:bg-card shadow-sm ${actionButtonTextStyle}`}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Add Action or Consumable
            </Button>
            </div>
            {fieldActions[field.id] && fieldActions[field.id].length > 0 && (
              <FormActionsDisplay
                items={fieldActions[field.id]}
                label={field.label}
                hideLabel={true}
                bold={field.boldLabel}
                center={field.centerLabel}
                italic={field.italicLabel}
                underline={field.underlineLabel}
                visitId={consultation.consultationId}
                departmentId={departmentId}
                onRemove={(actionId) => handleRemoveAction(field.id, actionId)}
                onUpdateQuantity={(actionId, quantity) => handleUpdateActionQuantity(field.id, actionId, quantity)}
              />
            )}
          </div>
        )
      }
      default:
        return <Input className={contrastInputClass} value={currentValue || ''} placeholder={field.placeholder || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{departmentForm?.title || 'Department Consultation Form'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formLoading ? (
                <p className="text-sm text-muted-foreground">Loading latest finalized department form...</p>
              ) : formLoadFailed ? (
                <InlineTryAgain onTryAgain={() => setFormReloadKey((prev) => prev + 1)} />
              ) : !departmentForm ? (
                <p className="text-sm text-muted-foreground">No finalized form found for this department. Please finalize a form in admin before consultation.</p>
              ) : (
                <>
                  {departmentForm.description && (
                    <p className="text-sm text-muted-foreground">{departmentForm.description}</p>
                  )}

                  {[
                    ...departmentForm.fields.map(field => ({ ...field, itemType: 'field' as const })),
                    ...departmentForm.sections.map(section => ({ ...section, itemType: 'section' as const })),
                  ]
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((item) => {
                      if (item.itemType === 'field') {
                        const field = item as FormField & { itemType: 'field' }
                        if (!shouldShowField(field)) return null

                        return (
                          <div key={field.id} className="space-y-1">
                            {!field.hideLabel && (
                              <Label className={`${field.boldLabel ? 'font-bold' : ''} ${field.italicLabel ? 'italic' : ''} ${field.underlineLabel ? 'underline' : ''} ${field.centerLabel ? 'text-center block' : ''}`}>
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                              </Label>
                            )}
                            {renderFormFieldControl(field)}
                          </div>
                        )
                      }

                      const section = item as FormSection & { itemType: 'section' }
                      return (
                        <div key={section.id} className="border-l-4 border-blue-400 pl-4 space-y-3">
                          <h4 className={`font-semibold text-sm ${section.boldTitle ? 'font-bold' : ''} ${section.italicTitle ? 'italic' : ''} ${section.underlineTitle ? 'underline' : ''} ${section.centerTitle ? 'text-center' : ''}`}>
                            {section.title}
                          </h4>
                          {(section.fields || []).length === 0 ? (
                            <p className="text-xs text-muted-foreground">No fields in this section.</p>
                          ) : (
                            <div className={`grid gap-3 ${section.columns === 1 ? 'grid-cols-1' : section.columns === 2 ? 'grid-cols-2' : section.columns === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                              {(section.fields || []).filter((field) => shouldShowField(field)).map((field) => (
                                <div key={field.id} className="space-y-1">
                                  {!field.hideLabel && (
                                    <Label className={`${field.boldLabel ? 'font-bold' : ''} ${field.italicLabel ? 'italic' : ''} ${field.underlineLabel ? 'underline' : ''} ${field.centerLabel ? 'text-center block' : ''}`}>
                                      {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </Label>
                                  )}
                                  {renderFormFieldControl(field)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                </>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Floating bottom dock (glassy pill) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="glass-gray rounded-full shadow-xl px-3 py-2 flex items-center gap-2">
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                    onClick={() => handleStatusSave('draft')}
                    aria-label="Save as Draft"
                  >
                    <FilePenLine className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save as Draft</p>
                </TooltipContent>
              </Tooltip>

              <div className="w-px h-8 bg-white/20" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                    onClick={() => handleStatusSave('finalized')}
                    aria-label="Complete"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Complete</p>
                </TooltipContent>
              </Tooltip>

              <div className="w-px h-8 bg-white/20" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                    onClick={() => {/* transfer action placeholder */}}
                    aria-label="Transfer"
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Transfer</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>

    {/* Left vertical pill with quick panels */}
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 bg-card/60 backdrop-blur-xl border border-border/50 rounded-full p-2 shadow-2xl">
      <button
        title="Identification"
        className={`p-2 rounded-full transition-colors ${idPanel.pinned ? 'bg-white/40 ring-2 ring-white/60' : 'hover:bg-muted'}`}
        onMouseEnter={() => setIdPanel(prev => ({ ...prev, hover: !prev.pinned }))}
        onMouseLeave={() => setIdPanel(prev => ({ ...prev, hover: false }))}
        onClick={() => handlePanelClick('id')}
      >
        <User className={`w-5 h-5 ${idPanel.pinned ? 'text-foreground' : 'text-muted-foreground'}`} />
      </button>
      <button
        title="Vital Signs"
        className={`p-2 rounded-full transition-colors ${vitalsPanel.pinned ? 'bg-white/40 ring-2 ring-white/60' : 'hover:bg-muted'}`}
        onMouseEnter={() => setVitalsPanel(prev => ({ ...prev, hover: !prev.pinned }))}
        onMouseLeave={() => setVitalsPanel(prev => ({ ...prev, hover: false }))}
        onClick={() => handlePanelClick('vitals')}
      >
        <HeartPulse className={`w-5 h-5 ${vitalsPanel.pinned ? 'text-foreground' : 'text-muted-foreground'}`} />
      </button>
      <button
        title="History"
        className={`p-2 rounded-full transition-colors ${historyPanel.pinned ? 'bg-white/40 ring-2 ring-white/60' : 'hover:bg-muted'}`}
        onMouseEnter={() => setHistoryPanel(prev => ({ ...prev, hover: !prev.pinned }))}
        onMouseLeave={() => setHistoryPanel(prev => ({ ...prev, hover: false }))}
        onClick={() => handlePanelClick('history')}
      >
        <History className={`w-5 h-5 ${historyPanel.pinned ? 'text-foreground' : 'text-muted-foreground'}`} />
      </button>
    </div>

    {/* Identification Panel */}
    {showIdPanel && (
      <div
        className="fixed z-40 w-80 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
        style={getPositionStyle(getPanelSlot('id'), activePanels.length)}
      >
        <div className="flex items-center justify-between p-3 border-b border-border">
          <p className="text-sm font-semibold">Identification</p>
          {idPanel.pinned && <span className="text-xs bg-white/30 px-2 py-1 rounded">Pinned</span>}
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div className="font-medium text-foreground">{patient.name}</div>
          <div className="text-muted-foreground">Age: {patient.age}</div>
          <div className="text-muted-foreground">Gender: {patient.gender}</div>
          <div className="text-muted-foreground">DOB: {formatDateOnly(patient.dateOfBirth)}</div>
          {patient.phone && <div className="text-muted-foreground">Phone: {patient.phone}</div>}
          {patient.email && <div className="text-muted-foreground">Email: {patient.email}</div>}
        </div>
      </div>
    )}

    {/* Vital Signs Panel (dummy) */}
    {showVitalsPanel && (
      <div
        className="fixed z-40 w-80 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
        style={getPositionStyle(getPanelSlot('vitals'), activePanels.length)}
      >
        <div className="flex items-center justify-between p-3 border-b border-border">
          <p className="text-sm font-semibold">Vital Signs</p>
          {vitalsPanel.pinned && <span className="text-xs bg-white/30 px-2 py-1 rounded">Pinned</span>}
        </div>
        <div className="p-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">BP</p>
            <p className="font-medium">120/80</p>
          </div>
          <div>
            <p className="text-muted-foreground">HR</p>
            <p className="font-medium">72 bpm</p>
          </div>
          <div>
            <p className="text-muted-foreground">Temp</p>
            <p className="font-medium">36.8 °C</p>
          </div>
          <div>
            <p className="text-muted-foreground">O2 Sat</p>
            <p className="font-medium">98%</p>
          </div>
          <div>
            <p className="text-muted-foreground">RR</p>
            <p className="font-medium">16/min</p>
          </div>
        </div>
      </div>
    )}

    {/* History Panel (dummy) */}
    {showHistoryPanel && (
      <div
        className="fixed z-40 w-96 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
        style={getPositionStyle(getPanelSlot('history'), activePanels.length)}
      >
        <div className="flex items-center justify-between p-3 border-b border-border">
          <p className="text-sm font-semibold">History</p>
          {historyPanel.pinned && <span className="text-xs bg-white/30 px-2 py-1 rounded">Pinned</span>}
        </div>
        <div className="p-4 space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Allergies</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fluoroquinolones (rash)</li>
              <li>Penicillin (hives)</li>
            </ul>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Past Medical History</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hypertension (I10)</li>
              <li>Type 2 Diabetes (E11)</li>
            </ul>
          </div>
        </div>
      </div>
    )}

    {/* Add Action/Consumable Modal */}
    <AddActionConsumableModal
      isOpen={showAddActionModal}
      onClose={() => setShowAddActionModal(false)}
      departments={departmentId ? [{ id: departmentId, name: '' }] : []}
      currentDepartmentId={departmentId}
      viewMode="service"
      onAdd={handleAddAction}
      isSubmitting={false}
    />
    </div>
  )
}
