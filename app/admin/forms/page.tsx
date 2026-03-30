"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import { useAuth } from '@/lib/auth-context'
import { useDepartments } from '@/hooks/auth-hooks'
import FormBuilderActionList from '@/components/form-builder-action-list'
import FormActionsDisplay from '@/components/form-actions-display'
import AddActionConsumableModal from '@/components/add-action-consumable-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ArrowLeft, Plus, Trash2, Upload, Download, Copy, Eye, ArrowUp, ArrowDown, ArrowRight, Bold, Italic, Underline, AlignCenter, Pill } from 'lucide-react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField, FormSection, ConditionalRendering, TableConfig, TableHeaderPlacement, FormAction } from '@/lib/form-storage'
import { useToast } from '@/hooks/use-toast'

const fieldSchema = z.object({
  label: z.string().min(1, 'Label required'),
  type: z.enum(['text', 'email', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date', 'table', 'diagnosticRecord', 'medicationLongForm', 'medicationMiniForm', 'actionListener']),
  placeholder: z.string().optional(),
  required: z.boolean().default(true),
  options: z.string().optional(),
})

type FieldSchema = z.infer<typeof fieldSchema>

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

const metaSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  departmentId: z.string().min(1, 'Department required'),
})

type MetaSchema = z.infer<typeof metaSchema>

type BackendFormStatus = 'DRAFT' | 'FINAL'

interface BackendForm {
  id: string
  title: string
  description?: string
  status: BackendFormStatus
  currentVersionNumber?: string
  sections?: FormSection[]
  fields?: FormField[]
  actions?: FormAction[]
}

interface BackendFormListItem {
  id: string
  title: string
  status: BackendFormStatus
  currentVersionNumber?: string
  createdAt?: string
  updatedAt?: string
}

const FORM_SCHEMA_VERSION = 1

const FORM_FRAGMENT = gql`
  fragment FormBuilderData on Form {
    id
    departmentId
    title
    description
    status
    currentVersionNumber
    currentSchemaVersion
    createdAt
    updatedAt
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
    actions {
      id
      name
      type
      quantity
      price
      isQuantifiable
      backendId
    }
  }
`

const GET_FORMS_QUERY = gql`
  query GetFormsForDepartment($departmentId: ID!) {
    getForms(departmentId: $departmentId) {
      status
      messages {
        text
        type
      }
      data {
        id
        departmentId
        title
        status
        currentVersionNumber
        createdAt
        updatedAt
      }
    }
  }
`

const GET_FORM_QUERY = gql`
  query GetForm($departmentId: ID!, $formId: ID!) {
    getForm(departmentId: $departmentId, formId: $formId) {
      status
      messages {
        text
        type
      }
      data {
        ...FormBuilderData
      }
    }
  }
  ${FORM_FRAGMENT}
`

const GET_FORM_VERSION_HISTORY_QUERY = gql`
  query GetFormVersionHistory($departmentId: ID!, $formId: ID!) {
    getFormVersionHistory(departmentId: $departmentId, formId: $formId) {
      status
      messages {
        text
        type
      }
      data {
        id
        versionNumber
        status
        createdAt
      }
    }
  }
`

const CREATE_FORM_MUTATION = gql`
  mutation CreateForm($departmentId: ID!, $input: FormInput!) {
    createForm(departmentId: $departmentId, input: $input) {
      status
      messages {
        text
        type
      }
      data {
        ...FormBuilderData
      }
    }
  }
  ${FORM_FRAGMENT}
`

const UPDATE_FORM_MUTATION = gql`
  mutation UpdateForm($departmentId: ID!, $formId: ID!, $input: FormInput!) {
    updateForm(departmentId: $departmentId, formId: $formId, input: $input) {
      status
      messages {
        text
        type
      }
      data {
        ...FormBuilderData
      }
    }
  }
  ${FORM_FRAGMENT}
`

const FINALIZE_FORM_MUTATION = gql`
  mutation FinalizeForm($departmentId: ID!, $formId: ID!) {
    finalizeForm(departmentId: $departmentId, formId: $formId) {
      status
      messages {
        text
        type
      }
      data {
        ...FormBuilderData
      }
    }
  }
  ${FORM_FRAGMENT}
`

const toIntColumns = (value?: number) => {
  if (value === 1 || value === 2 || value === 3 || value === 4) return value
  return 2
}

const normalizeFormField = (field: any, index: number): FormField => ({
  id: field?.id || `field_${Date.now()}_${index}`,
  label: field?.label || 'Untitled',
  type: field?.type || 'text',
  placeholder: field?.placeholder || undefined,
  required: Boolean(field?.required),
  hideLabel: Boolean(field?.hideLabel),
  boldLabel: Boolean(field?.boldLabel),
  centerLabel: Boolean(field?.centerLabel),
  italicLabel: Boolean(field?.italicLabel),
  underlineLabel: Boolean(field?.underlineLabel),
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
  order: typeof field?.order === 'number' ? field.order : index,
})

const normalizeFormSection = (section: any, index: number): FormSection => ({
  id: section?.id || `section_${Date.now()}_${index}`,
  title: section?.title || 'Untitled Section',
  boldTitle: Boolean(section?.boldTitle),
  italicTitle: Boolean(section?.italicTitle),
  underlineTitle: Boolean(section?.underlineTitle),
  centerTitle: Boolean(section?.centerTitle),
  columns: toIntColumns(Number(section?.columns)),
  order: typeof section?.order === 'number' ? section.order : index,
  fields: Array.isArray(section?.fields)
    ? section.fields.map((field: any, fieldIndex: number) => normalizeFormField(field, fieldIndex))
    : [],
})

const normalizeFormAction = (action: any, index: number): FormAction => ({
  id: action?.id || `action_${Date.now()}_${index}`,
  name: action?.name || 'Unnamed item',
  type: action?.type === 'consumable' ? 'consumable' : 'action',
  quantity: Number(action?.quantity) || 1,
  price: Number(action?.price) || 0,
  isQuantifiable: action?.isQuantifiable !== false,
  backendId: action?.backendId ? String(action.backendId) : undefined,
})

const mapBackendForm = (form: any): BackendForm => ({
  id: String(form?.id || ''),
  title: form?.title || '',
  description: form?.description || '',
  status: form?.status === 'FINAL' ? 'FINAL' : 'DRAFT',
  currentVersionNumber: form?.currentVersionNumber || undefined,
  fields: Array.isArray(form?.fields) ? form.fields.map((field: any, idx: number) => normalizeFormField(field, idx)) : [],
  sections: Array.isArray(form?.sections) ? form.sections.map((section: any, idx: number) => normalizeFormSection(section, idx)) : [],
  actions: Array.isArray(form?.actions) ? form.actions.map((action: any, idx: number) => normalizeFormAction(action, idx)) : [],
})

const buildFormInput = (title: string, description: string | undefined, fields: FormField[], sections: FormSection[], actions: FormAction[]) => ({
  title,
  description,
  schemaVersion: FORM_SCHEMA_VERSION,
  fields,
  sections,
  actions,
})

export default function FormsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { doctor } = useAuth()
  const { toast } = useToast()
  const { departments, loading: departmentsLoading } = useDepartments()

  const [fields, setFields] = useState<FormField[]>([])
  const [sections, setSections] = useState<FormSection[]>([])
  const [actions, setActions] = useState<FormAction[]>([])
  const [saving, setSaving] = useState(false)
  const [jsonPreview, setJsonPreview] = useState<string>('')
  const [fieldEditorOpen, setFieldEditorOpen] = useState(false)
  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [editingLabel, setEditingLabel] = useState('')
  const [editingType, setEditingType] = useState<FormField['type']>('text')
  const [editingPlaceholder, setEditingPlaceholder] = useState('')
  const [editingRequired, setEditingRequired] = useState(true)
  const [editingHideLabel, setEditingHideLabel] = useState(false)
  const [editingBoldLabel, setEditingBoldLabel] = useState(false)
  const [editingCenterLabel, setEditingCenterLabel] = useState(false)
  const [editingItalicLabel, setEditingItalicLabel] = useState(false)
  const [editingUnderlineLabel, setEditingUnderlineLabel] = useState(false)
  const [editingOptions, setEditingOptions] = useState('')
  const [editingTableMode, setEditingTableMode] = useState<TableConfig['mode']>('fixed')
  const [editingTableRows, setEditingTableRows] = useState(3)
  const [editingTableColumns, setEditingTableColumns] = useState(3)
  const [editingTableHeaderPlacement, setEditingTableHeaderPlacement] = useState<TableHeaderPlacement>('none')
  const [editingTableColumnHeaders, setEditingTableColumnHeaders] = useState('Column 1\nColumn 2\nColumn 3')
  const [editingTableRowHeaders, setEditingTableRowHeaders] = useState('Row 1\nRow 2\nRow 3')
  const [editingConditionalEnabled, setEditingConditionalEnabled] = useState(false)
  const [editingConditionalDependsOn, setEditingConditionalDependsOn] = useState('')
  const [editingConditionalCondition, setEditingConditionalCondition] = useState<ConditionalRendering['condition']>('notEmpty')
  const [editingConditionalValue, setEditingConditionalValue] = useState('')
  const [editingConditionalItemType, setEditingConditionalItemType] = useState<'action' | 'consumable'>('action')
  const [mode, setMode] = useState<'meta' | 'edit'>('meta')
  const [typePickerOpen, setTypePickerOpen] = useState(false)
  const [sectionEditorOpen, setSectionEditorOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<FormSection | null>(null)
  const [editingSectionTitle, setEditingSectionTitle] = useState('')
  const [editingSectionColumns, setEditingSectionColumns] = useState<1 | 2 | 3 | 4>(2)
  const [editingSectionBoldTitle, setEditingSectionBoldTitle] = useState(false)
  const [editingSectionItalicTitle, setEditingSectionItalicTitle] = useState(false)
  const [editingSectionUnderlineTitle, setEditingSectionUnderlineTitle] = useState(false)
  const [editingSectionCenterTitle, setEditingSectionCenterTitle] = useState(false)
  const [sectionFieldTypePickerColumn, setSectionFieldTypePickerColumn] = useState<string | null>(null) // sectionId_columnIndex
  const [editingSectionField, setEditingSectionField] = useState<{ sectionId: string; field: FormField } | null>(null)
  const [sectionFieldEditorOpen, setSectionFieldEditorOpen] = useState(false)
  const [previewFormValues, setPreviewFormValues] = useState<{ [key: string]: any }>({})
  const [diagnosticDrafts, setDiagnosticDrafts] = useState<{ [key: string]: { diagnosis: string; description: string } }>({})
  const [medicationLongDrafts, setMedicationLongDrafts] = useState<{ [key: string]: { name: string; frequency: string; amount: string; days: string; notes: string } }>({})
  const [medicationMiniDrafts, setMedicationMiniDrafts] = useState<{ [key: string]: { name: string; notes: string } }>({})
  const [tableShapes, setTableShapes] = useState<{ [key: string]: { rows: number; columns: number } }>({})
  const [showAddActionModal, setShowAddActionModal] = useState(false)
  const [activeFormId, setActiveFormId] = useState<string | null>(null)
  const [activeFormStatus, setActiveFormStatus] = useState<BackendFormStatus | null>(null)
  const [activeVersionNumber, setActiveVersionNumber] = useState<string | null>(null)
  const [versionHistoryCount, setVersionHistoryCount] = useState(0)
  const [formsLoading, setFormsLoading] = useState(false)
  const [finalizing, setFinalizing] = useState(false)
  const [formsCatalog, setFormsCatalog] = useState<BackendFormListItem[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewForm, setPreviewForm] = useState<BackendForm | null>(null)
  const [savedSnapshot, setSavedSnapshot] = useState('')

  const defaultDeptId = searchParams.get('departmentId') || ''
  const defaultDeptName = searchParams.get('departmentName') || ''
  const requestedFormId = searchParams.get('formId') || ''

  const [loadForms] = useLazyQuery(GET_FORMS_QUERY)
  const [loadForm] = useLazyQuery(GET_FORM_QUERY)
  const [loadVersionHistory] = useLazyQuery(GET_FORM_VERSION_HISTORY_QUERY)
  const [createFormMutation] = useMutation(CREATE_FORM_MUTATION)
  const [updateFormMutation] = useMutation(UPDATE_FORM_MUTATION)
  const [finalizeFormMutation] = useMutation(FINALIZE_FORM_MUTATION)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MetaSchema>({
    resolver: zodResolver(metaSchema),
    defaultValues: {
      title: '',
      description: '',
      departmentId: defaultDeptId,
    },
  })

  const {
    register: registerField,
    handleSubmit: handleFieldSubmit,
    reset: resetFieldForm,
    setValue: setFieldValue,
    formState: { errors: fieldErrors },
    watch: watchField,
  } = useForm<FieldSchema>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      label: '',
      type: 'text',
      placeholder: '',
      required: true,
      options: '',
    },
  })

  const selectedDeptId = watch('departmentId')

  const getBuilderSnapshot = (title: string, description: string, nextFields: FormField[], nextSections: FormSection[], nextActions: FormAction[]) =>
    JSON.stringify({
      title: title || '',
      description: description || '',
      fields: nextFields,
      sections: nextSections,
      actions: nextActions,
    })

  const currentSnapshot = getBuilderSnapshot(
    watch('title') || '',
    watch('description') || '',
    fields,
    sections,
    actions,
  )

  const hasUnsavedChanges = currentSnapshot !== savedSnapshot

  const applyBackendFormToEditor = (form: BackendForm | null) => {
    if (!form) {
      setActiveFormId(null)
      setActiveFormStatus(null)
      setActiveVersionNumber(null)
      setFields([])
      setSections([])
      setActions([])
      setSavedSnapshot(getBuilderSnapshot('', '', [], [], []))
      setValue('title', '')
      setValue('description', '')
      setJsonPreview('')
      setMode('meta')
      return
    }

    setActiveFormId(form.id)
    setActiveFormStatus(form.status)
    setActiveVersionNumber(form.currentVersionNumber || null)
    setValue('title', form.title)
    setValue('description', form.description || '')
    setFields(form.fields || [])
    setSections(form.sections || [])
    setActions(form.actions || [])
    setSavedSnapshot(getBuilderSnapshot(form.title || '', form.description || '', form.fields || [], form.sections || [], form.actions || []))
    setJsonPreview(JSON.stringify(form, null, 2))
    setMode('edit')
  }

  const refreshFormsCatalog = async (departmentId: string) => {
    const formsResult = await loadForms({ variables: { departmentId }, fetchPolicy: 'network-only' })
    const forms = formsResult?.data?.getForms?.data || []
    const mapped: BackendFormListItem[] = Array.isArray(forms)
      ? forms.map((form: any) => ({
          id: String(form?.id || ''),
          title: form?.title || 'Untitled Form',
          status: form?.status === 'FINAL' ? 'FINAL' : 'DRAFT',
          currentVersionNumber: form?.currentVersionNumber || undefined,
          createdAt: form?.createdAt || undefined,
          updatedAt: form?.updatedAt || undefined,
        }))
      : []

    mapped.sort((a, b) => {
      const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return bDate - aDate
    })

    setFormsCatalog(mapped)
    return mapped
  }

  const openFormInEditor = async (departmentId: string, formId: string) => {
    const formResult = await loadForm({
      variables: { departmentId, formId },
      fetchPolicy: 'network-only',
    })
    const backendFormData = formResult?.data?.getForm?.data
    if (!backendFormData) throw new Error('Unable to load selected form')

    const versionResult = await loadVersionHistory({
      variables: { departmentId, formId },
      fetchPolicy: 'network-only',
    })
    const versions = versionResult?.data?.getFormVersionHistory?.data || []
    setVersionHistoryCount(Array.isArray(versions) ? versions.length : 0)

    applyBackendFormToEditor(mapBackendForm(backendFormData))
  }

  const onCreateNewForm = () => {
    if (!selectedDeptId) return
    setActiveFormId(null)
    setActiveFormStatus('DRAFT')
    setActiveVersionNumber(null)
    setVersionHistoryCount(0)
    setFields([])
    setSections([])
    setActions([])
    setJsonPreview('')
    setPreviewFormValues({})
    setValue('title', '')
    setValue('description', '')
    setSavedSnapshot(getBuilderSnapshot('', '', [], [], []))
    setMode('edit')
  }

  const onOpenFormFromCatalog = async (formId: string) => {
    if (!selectedDeptId) return
    try {
      setFormsLoading(true)
      await openFormInEditor(String(selectedDeptId), formId)
    } catch (err: any) {
      toast({ title: 'Failed to open form', description: err?.message || 'Unexpected error' })
    } finally {
      setFormsLoading(false)
    }
  }

  const onFinalizeFromCatalog = async (formId: string) => {
    if (!selectedDeptId || !formId) return
    try {
      setFinalizing(true)
      const result = await finalizeFormMutation({
        variables: { departmentId: selectedDeptId, formId },
      })
      const payload = result?.data?.finalizeForm
      if (payload?.status !== 'SUCCESS' || !payload?.data) {
        const message = payload?.messages?.[0]?.text || 'Unable to finalize form'
        throw new Error(message)
      }

      await refreshFormsCatalog(String(selectedDeptId))

      if (activeFormId === formId) {
        const mapped = mapBackendForm(payload.data)
        applyBackendFormToEditor(mapped)
        const versionResult = await loadVersionHistory({
          variables: { departmentId: selectedDeptId, formId: mapped.id },
          fetchPolicy: 'network-only',
        })
        const versions = versionResult?.data?.getFormVersionHistory?.data || []
        setVersionHistoryCount(Array.isArray(versions) ? versions.length : 0)
      }

      toast({ title: 'Form finalized' })
    } catch (err: any) {
      toast({ title: 'Finalize failed', description: err?.message || 'Unexpected error' })
    } finally {
      setFinalizing(false)
    }
  }

  const onPreviewFormFromCatalog = async (formId: string) => {
    if (!selectedDeptId) return
    try {
      setFormsLoading(true)
      const formResult = await loadForm({
        variables: { departmentId: selectedDeptId, formId },
        fetchPolicy: 'network-only',
      })
      const backendFormData = formResult?.data?.getForm?.data
      if (!backendFormData) throw new Error('Unable to load preview')
      setPreviewForm(mapBackendForm(backendFormData))
      setPreviewOpen(true)
    } catch (err: any) {
      toast({ title: 'Preview failed', description: err?.message || 'Unexpected error' })
    } finally {
      setFormsLoading(false)
    }
  }

  const loadFormForDepartment = async (departmentId: string) => {
    if (!departmentId) return

    setFormsLoading(true)
    try {
      const forms = await refreshFormsCatalog(departmentId)

      if (!Array.isArray(forms) || forms.length === 0) {
        setVersionHistoryCount(0)
        applyBackendFormToEditor(null)
        return
      }

      const requested = requestedFormId
        ? forms.find((form) => form.id === requestedFormId)
        : null
      const target = requested || forms[0]
      await openFormInEditor(departmentId, target.id)
    } catch (err: any) {
      setVersionHistoryCount(0)
      applyBackendFormToEditor(null)
      setFormsCatalog([])
      toast({ title: 'Failed to load forms', description: err?.message || 'Unexpected error' })
    } finally {
      setFormsLoading(false)
    }
  }

  const parseHeaderLines = (text: string, fallbackCount: number, prefix: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    if (lines.length === 0) {
      return Array.from({ length: fallbackCount }, (_, idx) => `${prefix} ${idx + 1}`)
    }
    const normalized = [...lines]
    while (normalized.length < fallbackCount) {
      normalized.push(`${prefix} ${normalized.length + 1}`)
    }
    return normalized.slice(0, fallbackCount)
  }

  const applyTableConfigToState = (cfg?: TableConfig) => {
    const rows = cfg?.rows ?? 3
    const columns = cfg?.columns ?? 3
    setEditingTableMode(cfg?.mode || 'fixed')
    setEditingTableRows(rows)
    setEditingTableColumns(columns)
    setEditingTableHeaderPlacement(cfg?.headerPlacement || 'none')
    const hasColumnHeaders = cfg?.headerPlacement === 'top' || cfg?.headerPlacement === 'both'
    const hasRowHeaders = cfg?.headerPlacement === 'left' || cfg?.headerPlacement === 'right' || cfg?.headerPlacement === 'both'
    const colHeaders = hasColumnHeaders && cfg?.columnHeaders?.length ? cfg.columnHeaders : Array.from({ length: columns }, (_, idx) => `Column ${idx + 1}`)
    const rowHeaders = hasRowHeaders && cfg?.rowHeaders?.length ? cfg.rowHeaders : Array.from({ length: rows }, (_, idx) => `Row ${idx + 1}`)
    setEditingTableColumnHeaders(colHeaders.join('\n'))
    setEditingTableRowHeaders(rowHeaders.join('\n'))
  }

  const buildTableConfigFromEditing = (): TableConfig => {
    const rows = Math.max(1, editingTableRows)
    const columns = Math.max(1, editingTableColumns)
    return {
      mode: editingTableMode,
      rows,
      columns,
      headerPlacement: editingTableHeaderPlacement,
      columnHeaders: parseHeaderLines(editingTableColumnHeaders, columns, 'Column'),
      rowHeaders: parseHeaderLines(editingTableRowHeaders, rows, 'Row'),
    }
  }

  const defaultTableConfig = (): TableConfig => ({
    mode: 'fixed',
    rows: 3,
    columns: 3,
    headerPlacement: 'none',
    columnHeaders: [],
    rowHeaders: [],
  })

  const onAddAction = (type: 'action' | 'consumable', item: any, quantity: number, departmentId: string) => {
    const newAction: FormAction = {
      id: `${type}_${Date.now()}`,
      name: item.name,
      type,
      quantity,
      price: 0, // Price not used in form builder
      isQuantifiable: item.isQuantifiable !== false,
      backendId: item.id ? String(item.id) : undefined,
    }
    setActions([...actions, newAction])
    setShowAddActionModal(false)
    toast({ title: `${type === 'action' ? 'Action' : 'Consumable'} added`, description: item.name })
  }

  const onRemoveAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id))
    toast({ title: 'Item removed' })
  }

  const onUpdateActionQuantity = (id: string, quantity: number) => {
    setActions(actions.map(a => a.id === id ? { ...a, quantity } : a))
  }

  // Load existing form when department changes
  useEffect(() => {
    if (!selectedDeptId) {
      applyBackendFormToEditor(null)
      setVersionHistoryCount(0)
      return
    }

    loadFormForDepartment(String(selectedDeptId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeptId, requestedFormId])

  // Ensure table shapes follow current fields
  useEffect(() => {
    const tables = getAllFields().filter(f => f.type === 'table' && f.tableConfig)
    setTableShapes(prev => {
      const next: { [key: string]: { rows: number; columns: number } } = {}
      tables.forEach(t => {
        const cfg = t.tableConfig!
        const existingShape = prev[t.id]
        next[t.id] = existingShape || { rows: cfg.rows, columns: cfg.columns }
      })
      return next
    })
  }, [fields, sections])

  const onAddField = (data: FieldSchema) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: data.label,
      type: data.type,
      placeholder: data.placeholder || undefined,
      required: data.required,
      hideLabel: false,
      boldLabel: false,
      centerLabel: false,
      italicLabel: false,
      underlineLabel: false,
      options: data.options ? data.options.split('\n').filter(Boolean) : undefined,
      tableConfig: data.type === 'table' ? buildTableConfigFromEditing() : undefined,
      order: fields.length + sections.length,
    }
    setFields([...fields, newField])
    resetFieldForm()
    toast({ title: 'Field added', description: newField.label })
  }

  const moveField = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= fields.length) return
    const updated = [...fields]
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    setFields(updated.map((f, idx) => ({ ...f, order: idx })))
  }

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id).map((f, idx) => ({ ...f, order: idx })))
  }

  const moveSection = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= sections.length) return
    const updated = [...sections]
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    setSections(updated.map((s, idx) => ({ ...s, order: idx })))
  }

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id).map((s, idx) => ({ ...s, order: idx })))
  }

  // Unified move function for mixed fields and sections
  const moveItem = (type: 'field' | 'section', id: string, dir: 'up' | 'down') => {
    // Create a unified array with both fields and sections
    const allItems = [
      ...fields.map(f => ({ ...f, itemType: 'field' as const })),
      ...sections.map(s => ({ ...s, itemType: 'section' as const }))
    ].sort((a, b) => a.order - b.order)

    const currentIndex = allItems.findIndex(item => 
      item.itemType === type && item.id === id
    )
    
    if (currentIndex === -1) return
    
    const targetIndex = dir === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= allItems.length) return

    // Swap items
    ;[allItems[currentIndex], allItems[targetIndex]] = [allItems[targetIndex], allItems[currentIndex]]

    // Update orders
    allItems.forEach((item, idx) => {
      item.order = idx
    })

    // Split back into fields and sections
    setFields(allItems.filter(item => item.itemType === 'field').map(({ itemType, ...f }) => f as FormField))
    setSections(allItems.filter(item => item.itemType === 'section').map(({ itemType, ...s }) => s as FormSection))
  }

  const onAddFieldToSection = (sectionId: string, fieldType: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: fieldType,
      placeholder: '',
      required: true,
      hideLabel: false,
      boldLabel: false,
      centerLabel: false,
      italicLabel: false,
      underlineLabel: false,
      options: undefined,
      tableConfig: fieldType === 'table' ? defaultTableConfig() : undefined,
      order: 0,
    }
    const updated = sections.map(s => s.id === sectionId ? {
      ...s,
      fields: [...s.fields, newField],
    } : s)
    setSections(updated)
    setSectionFieldTypePickerColumn(null)
    toast({ title: 'Field added to section', description: newField.label })
  }

  const onCreateNewSection = () => {
    const newSection: FormSection = {
      id: `section_${Date.now()}`,
      title: 'New Section',
      boldTitle: false,
      italicTitle: false,
      underlineTitle: false,
      centerTitle: false,
      columns: 2,
      fields: [],
      order: fields.length + sections.length,
    }
    setSections([...sections, newSection])
    setEditingSection(newSection)
    setEditingSectionTitle(newSection.title)
    setEditingSectionColumns(newSection.columns)
    setEditingSectionBoldTitle(false)
    setEditingSectionItalicTitle(false)
    setEditingSectionUnderlineTitle(false)
    setEditingSectionCenterTitle(false)
    setSectionEditorOpen(true)
    setTypePickerOpen(false)
    toast({ title: 'Section created' })
  }

  const onSaveSection = () => {
    if (!editingSection) return
    const updated = sections.map(s => s.id === editingSection.id ? {
      ...s,
      title: editingSectionTitle,
      columns: editingSectionColumns,
      boldTitle: editingSectionBoldTitle,
      italicTitle: editingSectionItalicTitle,
      underlineTitle: editingSectionUnderlineTitle,
      centerTitle: editingSectionCenterTitle,
    } : s)
    setSections(updated)
    setSectionEditorOpen(false)
    toast({ title: 'Section updated' })
  }

  const moveSectionFieldHorizontally = (sectionId: string, fieldIdx: number, dir: 'left' | 'right') => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return
    const target = dir === 'left' ? fieldIdx - 1 : fieldIdx + 1
    if (target < 0 || target >= section.fields.length) return
    const updated = sections.map(s => {
      if (s.id !== sectionId) return s
      const newFields = [...s.fields]
      ;[newFields[fieldIdx], newFields[target]] = [newFields[target], newFields[fieldIdx]]
      return { ...s, fields: newFields.map((f, idx) => ({ ...f, order: idx })) }
    })
    setSections(updated)
  }

  // Helper functions for conditional rendering
  const getAllFields = (): FormField[] => {
    const allFields = [...fields]
    sections.forEach(s => allFields.push(...s.fields))
    return allFields
  }

  const hasActionListenerField = (): boolean => {
    return getAllFields().some(f => f.type === 'actionListener')
  }

  const getParentChildRelationships = () => {
    const allFields = getAllFields()
    const parents: { [key: string]: number } = {}
    const children: { [key: string]: number } = {}
    
    let parentIndex = 1
    let childIndex = 1
    
    allFields.forEach(field => {
      if (field.conditionalRendering) {
        const parentId = field.conditionalRendering.dependsOn
        if (!parents[parentId]) {
          parents[parentId] = parentIndex++
        }
        if (!children[field.id]) {
          children[field.id] = childIndex++
        }
      }
    })
    
    return { parents, children }
  }

  const checkFieldCondition = (field: FormField, formValues: { [key: string]: any }): boolean => {
    if (!field.conditionalRendering) return true
    
    const { dependsOn, condition, value, itemType } = field.conditionalRendering
    const dependentValue = formValues[dependsOn]
    
    switch (condition) {
      case 'notEmpty':
        return dependentValue !== undefined && dependentValue !== '' && dependentValue !== null
      case 'equals':
        return dependentValue === value
      case 'checked':
        return Boolean(dependentValue)
      case 'includes':
        return Array.isArray(dependentValue) ? dependentValue.includes(value) : dependentValue === value
      case 'hasItem': {
        // Only meaningful when dependsOn is an action listener field; leverage current actions list
        const pool = actions.filter(a => !itemType || a.type === itemType)
        if (!value) return pool.length > 0
        return pool.some(a => a.name === value)
      }
      default:
        return true
    }
  }

  const ensureHeaders = (count: number, provided?: string[], prefix: string = 'Column') => {
    const headers = (provided && provided.length ? [...provided] : []).filter(Boolean)
    while (headers.length < count) headers.push(`${prefix} ${headers.length + 1}`)
    return headers.slice(0, count)
  }

  const renderTablePreview = (f: FormField) => {
    if (f.type !== 'table' || !f.tableConfig) return null
    const cfg = f.tableConfig
    const shape = tableShapes[f.id] || { rows: cfg.rows, columns: cfg.columns }
    const rows = Math.max(1, shape.rows)
    const columns = Math.max(1, shape.columns)
    const hasLeft = cfg.headerPlacement === 'left' || cfg.headerPlacement === 'both'
    const hasRight = cfg.headerPlacement === 'right' || cfg.headerPlacement === 'both'
    const hasTop = cfg.headerPlacement === 'top' || cfg.headerPlacement === 'both'
    const columnHeaders = hasTop ? ensureHeaders(columns, cfg.columnHeaders, 'Column') : []
    const rowHeaders = (hasLeft || hasRight) ? ensureHeaders(rows, cfg.rowHeaders, 'Row') : []

    const updateShape = (nextRows: number, nextCols: number) => {
      setTableShapes(prev => ({ ...prev, [f.id]: { rows: Math.max(1, nextRows), columns: Math.max(1, nextCols) } }))
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{rows} × {columns}</span>
          {cfg.mode === 'variableRows' && (
            <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => updateShape(rows + 1, columns)}>+ Row</Button>
          )}
          {cfg.mode === 'variableColumns' && (
            <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => updateShape(rows, columns + 1)}>+ Col</Button>
          )}
          {cfg.headerPlacement !== 'none' && <span className="text-[10px] text-muted-foreground">headers: {cfg.headerPlacement}</span>}
        </div>
        <div className="overflow-auto border rounded-md">
          <table className="min-w-full border-collapse text-sm">
            {hasTop && (
              <thead>
                <tr>
                  {hasLeft && <th className="w-24 border px-2 py-1 bg-muted" />}
                  {Array.from({ length: columns }).map((_, cIdx) => (
                    <th key={`col-${cIdx}`} className="border px-2 py-1 bg-muted text-left">{columnHeaders[cIdx]}</th>
                  ))}
                  {hasRight && <th className="w-24 border px-2 py-1 bg-muted" />}
                </tr>
              </thead>
            )}
            <tbody>
              {Array.from({ length: rows }).map((_, rIdx) => (
                <tr key={`row-${rIdx}`}>
                  {hasLeft && <td className="border px-2 py-1 bg-muted/70 text-xs font-medium">{rowHeaders[rIdx]}</td>}
                  {Array.from({ length: columns }).map((_, cIdx) => {
                    const cellKey = `${f.id}_r${rIdx}_c${cIdx}`
                    return (
                      <td key={cellKey} className="border px-2 py-1">
                        <Input
                          className="h-9"
                          value={previewFormValues[cellKey] || ''}
                          onChange={(e) => setPreviewFormValues({ ...previewFormValues, [cellKey]: e.target.value })}
                        />
                      </td>
                    )
                  })}
                  {hasRight && <td className="border px-2 py-1 bg-muted/70 text-xs font-medium">{rowHeaders[rIdx]}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderFieldPreviewControl = (f: FormField) => {
    switch (f.type) {
      case 'text':
        return <Input placeholder={f.placeholder} className="border-2" value={previewFormValues[f.id] || ''} onChange={(e) => setPreviewFormValues({ ...previewFormValues, [f.id]: e.target.value })} />
      case 'email':
        return <Input type="email" placeholder={f.placeholder} className="border-2" value={previewFormValues[f.id] || ''} onChange={(e) => setPreviewFormValues({ ...previewFormValues, [f.id]: e.target.value })} />
      case 'number':
        return <Input type="number" placeholder={f.placeholder} className="border-2" value={previewFormValues[f.id] || ''} onChange={(e) => setPreviewFormValues({ ...previewFormValues, [f.id]: e.target.value })} />
      case 'date':
        return <Input type="date" className="border-2" value={previewFormValues[f.id] || ''} onChange={(e) => setPreviewFormValues({ ...previewFormValues, [f.id]: e.target.value })} />
      case 'textarea':
        return <Textarea rows={3} placeholder={f.placeholder} className="border-2" value={previewFormValues[f.id] || ''} onChange={(e) => setPreviewFormValues({ ...previewFormValues, [f.id]: e.target.value })} />
      case 'select':
        return (
          <Select value={previewFormValues[f.id] || ''} onValueChange={(v) => setPreviewFormValues({ ...previewFormValues, [f.id]: v })}>
            <SelectTrigger>
              <SelectValue placeholder={f.placeholder || 'Select'} />
            </SelectTrigger>
            <SelectContent>
              {f.options?.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'radio':
        return (
          <div className="flex flex-col gap-2">
            {f.options?.map(opt => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input type="radio" name={f.id} checked={previewFormValues[f.id] === opt} onChange={() => setPreviewFormValues({ ...previewFormValues, [f.id]: opt })} /> {opt}
              </label>
            ))}
          </div>
        )
      case 'checkbox':
        return (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={Boolean(previewFormValues[f.id])} onChange={(e) => setPreviewFormValues({ ...previewFormValues, [f.id]: e.target.checked })} /> {f.placeholder || 'Checkbox'}
          </label>
        )
      case 'table':
        return renderTablePreview(f)
      case 'diagnosticRecord': {
        const records: DiagnosticRecordEntry[] = Array.isArray(previewFormValues[f.id]) ? previewFormValues[f.id] : []
        const draft = diagnosticDrafts[f.id] || { diagnosis: '', description: '' }

        const addRecord = () => {
          const diagnosis = draft.diagnosis.trim()
          const description = draft.description.trim()
          if (!diagnosis) return

          const nextRecord: DiagnosticRecordEntry = {
            id: `diag_${Date.now()}`,
            diagnosis,
            description: description || undefined,
          }

          setPreviewFormValues({
            ...previewFormValues,
            [f.id]: [...records, nextRecord],
          })
          setDiagnosticDrafts({
            ...diagnosticDrafts,
            [f.id]: { diagnosis: '', description: '' },
          })
        }

        return (
          <div className="space-y-3 border rounded-lg p-3 bg-card/40">
            <Input
              placeholder={f.placeholder || 'Enter diagnostic'}
              value={draft.diagnosis}
              onChange={(e) => setDiagnosticDrafts({
                ...diagnosticDrafts,
                [f.id]: { ...draft, diagnosis: e.target.value },
              })}
            />
            <Textarea
              rows={2}
              placeholder="Optional description"
              value={draft.description}
              onChange={(e) => setDiagnosticDrafts({
                ...diagnosticDrafts,
                [f.id]: { ...draft, description: e.target.value },
              })}
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
                        onClick={() => setPreviewFormValues({
                          ...previewFormValues,
                          [f.id]: records.filter((r) => r.id !== record.id),
                        })}
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
        const records: MedicationLongEntry[] = Array.isArray(previewFormValues[f.id]) ? previewFormValues[f.id] : []
        const draft = medicationLongDrafts[f.id] || { name: '', frequency: '', amount: '', days: '', notes: '' }

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

          setPreviewFormValues({
            ...previewFormValues,
            [f.id]: [...records, nextRecord],
          })
          setMedicationLongDrafts({
            ...medicationLongDrafts,
            [f.id]: { name: '', frequency: '', amount: '', days: '', notes: '' },
          })
        }

        return (
          <div className="space-y-3 border rounded-lg p-3 bg-card/40">
            <Input
              placeholder={f.placeholder || 'Medication name'}
              value={draft.name}
              onChange={(e) => setMedicationLongDrafts({
                ...medicationLongDrafts,
                [f.id]: { ...draft, name: e.target.value },
              })}
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Frequency"
                value={draft.frequency}
                onChange={(e) => setMedicationLongDrafts({
                  ...medicationLongDrafts,
                  [f.id]: { ...draft, frequency: e.target.value },
                })}
              />
              <Input
                placeholder="Amount"
                value={draft.amount}
                onChange={(e) => setMedicationLongDrafts({
                  ...medicationLongDrafts,
                  [f.id]: { ...draft, amount: e.target.value },
                })}
              />
              <Input
                placeholder="Days"
                value={draft.days}
                onChange={(e) => setMedicationLongDrafts({
                  ...medicationLongDrafts,
                  [f.id]: { ...draft, days: e.target.value },
                })}
              />
            </div>
            <Textarea
              rows={2}
              placeholder="Additional notes"
              value={draft.notes}
              onChange={(e) => setMedicationLongDrafts({
                ...medicationLongDrafts,
                [f.id]: { ...draft, notes: e.target.value },
              })}
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
                        {record.notes && (
                          <p className="text-xs text-muted-foreground break-words">{record.notes}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => setPreviewFormValues({
                          ...previewFormValues,
                          [f.id]: records.filter((r) => r.id !== record.id),
                        })}
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
        const records: MedicationMiniEntry[] = Array.isArray(previewFormValues[f.id]) ? previewFormValues[f.id] : []
        const draft = medicationMiniDrafts[f.id] || { name: '', notes: '' }

        const addMedication = () => {
          const name = draft.name.trim()
          const notes = draft.notes.trim()
          if (!name) return

          const nextRecord: MedicationMiniEntry = {
            id: `med_mini_${Date.now()}`,
            name,
            notes: notes || undefined,
          }

          setPreviewFormValues({
            ...previewFormValues,
            [f.id]: [...records, nextRecord],
          })
          setMedicationMiniDrafts({
            ...medicationMiniDrafts,
            [f.id]: { name: '', notes: '' },
          })
        }

        return (
          <div className="space-y-3 border rounded-lg p-3 bg-card/40">
            <Input
              placeholder={f.placeholder || 'Medication name'}
              value={draft.name}
              onChange={(e) => setMedicationMiniDrafts({
                ...medicationMiniDrafts,
                [f.id]: { ...draft, name: e.target.value },
              })}
            />
            <Textarea
              rows={2}
              placeholder="Extra notes"
              value={draft.notes}
              onChange={(e) => setMedicationMiniDrafts({
                ...medicationMiniDrafts,
                [f.id]: { ...draft, notes: e.target.value },
              })}
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
                        {record.notes && (
                          <p className="text-xs text-muted-foreground break-words">{record.notes}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => setPreviewFormValues({
                          ...previewFormValues,
                          [f.id]: records.filter((r) => r.id !== record.id),
                        })}
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
        return (
          <FormActionsDisplay
            items={actions}
            label={f.label}
            hideLabel={f.hideLabel}
            bold={f.boldLabel}
            center={f.centerLabel}
            italic={f.italicLabel}
            underline={f.underlineLabel}
            onRemove={onRemoveAction}
            onUpdateQuantity={onUpdateActionQuantity}
          />
        )
      default:
        return null
    }
  }

  const removeSectionField = (sectionId: string, fieldId: string) => {
    const updated = sections.map(s => s.id === sectionId ? {
      ...s,
      fields: s.fields.filter(f => f.id !== fieldId).map((f, idx) => ({ ...f, order: idx }))
    } : s)
    setSections(updated)
  }

  const onSaveSectionField = () => {
    if (!editingSectionField) return
    const updated = sections.map(s => s.id === editingSectionField.sectionId ? {
      ...s,
      fields: s.fields.map(f => f.id === editingSectionField.field.id ? {
        ...f,
        label: editingLabel,
        type: editingType,
        placeholder: editingPlaceholder || undefined,
        required: editingRequired,
        hideLabel: editingHideLabel,
        boldLabel: editingBoldLabel,
        centerLabel: editingCenterLabel,
        italicLabel: editingItalicLabel,
        underlineLabel: editingUnderlineLabel,
        options: editingOptions ? editingOptions.split('\n').filter(Boolean) : undefined,
        tableConfig: editingType === 'table' ? buildTableConfigFromEditing() : undefined,
        conditionalRendering: editingConditionalEnabled ? {
          dependsOn: editingConditionalDependsOn,
          condition: editingConditionalCondition,
          value: editingConditionalValue || undefined,
          itemType: editingConditionalCondition === 'hasItem' ? editingConditionalItemType : undefined,
        } : undefined,
      } : f)
    } : s)
    setSections(updated)
    setEditingSectionField(null)
    setSectionFieldEditorOpen(false)
  }

  const onSave = async (meta: MetaSchema) => {
    if (fields.length === 0 && sections.length === 0) {
      toast({ title: 'Add at least one field or section' })
      return
    }

    const input = buildFormInput(meta.title, meta.description, fields, sections, actions)

    try {
      setSaving(true)

      const result = activeFormId
        ? await updateFormMutation({
            variables: {
              departmentId: meta.departmentId,
              formId: activeFormId,
              input,
            },
          })
        : await createFormMutation({
            variables: {
              departmentId: meta.departmentId,
              input,
            },
          })

      const payload = activeFormId ? result?.data?.updateForm : result?.data?.createForm
      if (payload?.status !== 'SUCCESS' || !payload?.data) {
        const message = payload?.messages?.[0]?.text || 'Unable to save form'
        throw new Error(message)
      }

      const mapped = mapBackendForm(payload.data)
      applyBackendFormToEditor(mapped)
      setSavedSnapshot(getBuilderSnapshot(mapped.title || '', mapped.description || '', mapped.fields || [], mapped.sections || [], mapped.actions || []))

      await refreshFormsCatalog(String(meta.departmentId))

      const versionResult = await loadVersionHistory({
        variables: { departmentId: meta.departmentId, formId: mapped.id },
        fetchPolicy: 'network-only',
      })
      const versions = versionResult?.data?.getFormVersionHistory?.data || []
      setVersionHistoryCount(Array.isArray(versions) ? versions.length : 0)

      toast({
        title: activeFormStatus === 'FINAL' ? 'New version created' : activeFormId ? 'Form updated' : 'Form created',
        description: mapped.currentVersionNumber
          ? `Current version ${mapped.currentVersionNumber}`
          : 'Draft saved successfully',
      })
    } catch (err: any) {
      toast({ title: 'Save failed', description: err?.message || 'Unexpected error' })
    } finally {
      setSaving(false)
    }
  }

  const onFinalize = async () => {
    if (!selectedDeptId || !activeFormId) {
      toast({ title: 'Save the form first before finalizing' })
      return
    }

    try {
      setFinalizing(true)
      const result = await finalizeFormMutation({
        variables: { departmentId: selectedDeptId, formId: activeFormId },
      })
      const payload = result?.data?.finalizeForm
      if (payload?.status !== 'SUCCESS' || !payload?.data) {
        const message = payload?.messages?.[0]?.text || 'Unable to finalize form'
        throw new Error(message)
      }

      const mapped = mapBackendForm(payload.data)
      applyBackendFormToEditor(mapped)

      await refreshFormsCatalog(String(selectedDeptId))

      const versionResult = await loadVersionHistory({
        variables: { departmentId: selectedDeptId, formId: mapped.id },
        fetchPolicy: 'network-only',
      })
      const versions = versionResult?.data?.getFormVersionHistory?.data || []
      setVersionHistoryCount(Array.isArray(versions) ? versions.length : 0)

      toast({
        title: 'Form finalized',
        description: 'Future edits will be versioned by the backend.',
      })
    } catch (err: any) {
      toast({ title: 'Finalize failed', description: err?.message || 'Unexpected error' })
    } finally {
      setFinalizing(false)
    }
  }

  const exportJson = () => {
    if (!jsonPreview) {
      toast({ title: 'No form to export' })
      return
    }
    navigator.clipboard?.writeText(jsonPreview)
    toast({ title: 'Copied JSON to clipboard' })
  }

  const selectedDeptName = useMemo(() => {
    const found = departments?.find((d: any) => String(d.id) === String(selectedDeptId))
    return found?.name || defaultDeptName
  }, [departments, selectedDeptId, defaultDeptName])

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => {
              const query = selectedDeptId
                ? `?departmentId=${selectedDeptId}&departmentName=${encodeURIComponent(selectedDeptName || '')}`
                : ''
              router.push(`/admin/forms/manage${query}`)
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Form Builder</h1>
            <p className="text-muted-foreground">Create department forms backed by server drafts, finalization, and version history.</p>
            {mode === 'edit' && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                {activeFormStatus && (
                  <Badge variant={activeFormStatus === 'FINAL' ? 'secondary' : 'default'}>
                    {activeFormStatus === 'FINAL' ? 'Finalized' : 'Draft'}
                  </Badge>
                )}
                {activeVersionNumber && (
                  <Badge variant="outline">Version {activeVersionNumber}</Badge>
                )}
                {versionHistoryCount > 0 && (
                  <Badge variant="outline">{versionHistoryCount} version{versionHistoryCount > 1 ? 's' : ''}</Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {mode === 'meta' ? (
          <div className="max-w-2xl">
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-sm">Form Metadata</h3>
              {departmentsLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, idx) => (
                    <Skeleton key={idx} className="h-9 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Department</label>
                    <Select value={selectedDeptId} onValueChange={(v) => setValue('departmentId', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((d: any) => (
                          <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.departmentId && <p className="text-xs text-destructive">{errors.departmentId.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Title</label>
                    <Input placeholder="Form title" {...register('title')} />
                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Description</label>
                    <Input placeholder="Optional description" {...register('description')} />
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => {
                    if (!selectedDeptId) { toast({ title: 'Select a department' }); return }
                    if (!watch('title')) { toast({ title: 'Enter a title' }); return }
                    setMode('edit')
                  }}
                  className="rounded-full"
                >
                  Start Designing
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <PanelGroup direction="horizontal" className="gap-4">
            <Panel defaultSize={50} minSize={30}>
              <div className="space-y-4 overflow-y-auto">
                {/* Sections and Fields */}
                <Card className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Form Structure</h3>
                    <span className="text-xs text-muted-foreground">Sections & Fields</span>
                  </div>

                  {fields.length === 0 && sections.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No fields or sections yet. Add them using the dock below.</p>
                  ) : (
                    <div className="space-y-3">
                      {/* Unified rendering: fields and sections in order */}
                      {(() => {
                        const { parents, children } = getParentChildRelationships()
                        return [
                        ...fields.map(f => ({ ...f, itemType: 'field' as const })),
                        ...sections.map(s => ({ ...s, itemType: 'section' as const }))
                      ]
                        .sort((a, b) => a.order - b.order)
                        .map((item) => {
                          if (item.itemType === 'field') {
                            const f = item as FormField & { itemType: 'field' }
                            const isParent = parents[f.id]
                            const isChild = children[f.id]
                            return (
                              <div key={f.id} className="flex items-center justify-between border rounded-lg px-3 py-2 bg-card/50 ml-0">
                                <Popover open={fieldEditorOpen && editingField?.id === f.id} onOpenChange={(open) => {
                                  if (!open && editingField?.id === f.id) setFieldEditorOpen(false)
                                }}>
                                  <PopoverTrigger asChild>
                                    <div className="flex-1 cursor-pointer" onClick={() => {
                                      setEditingField(f)
                                      setEditingLabel(f.label)
                                      setEditingType(f.type)
                                      setEditingPlaceholder(f.placeholder || '')
                                      setEditingRequired(Boolean(f.required))
                                      setEditingHideLabel(Boolean(f.hideLabel))
                                      setEditingBoldLabel(Boolean(f.boldLabel))
                                      setEditingCenterLabel(Boolean(f.centerLabel))
                                      setEditingItalicLabel(Boolean(f.italicLabel))
                                      setEditingUnderlineLabel(Boolean(f.underlineLabel))
                                      setEditingOptions((f.options || []).join('\n'))
                                      applyTableConfigToState(f.tableConfig)
                                          setEditingConditionalEnabled(Boolean(f.conditionalRendering))
                                          setEditingConditionalDependsOn(f.conditionalRendering?.dependsOn || '')
                                          setEditingConditionalCondition(f.conditionalRendering?.condition || 'notEmpty')
                                          setEditingConditionalValue(f.conditionalRendering?.value || '')
                                          setEditingConditionalItemType(f.conditionalRendering?.itemType || 'action')
                                      setEditingConditionalItemType(f.conditionalRendering?.itemType || 'action')
                                      setFieldEditorOpen(true)
                                    }}>
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">{f.label} <span className="text-xs text-muted-foreground">({f.type})</span> {f.required && <span className="text-red-500">*</span>}</p>
                                        {isParent && <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">P{isParent}</Badge>}
                                        {isChild && <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">C{isChild}</Badge>}
                                      </div>
                                      {f.hideLabel && (
                                        <p className="text-xs text-muted-foreground">Label hidden</p>
                                      )}
                                      {f.options && f.options.length > 0 && (
                                        <p className="text-xs text-muted-foreground">Options: {f.options.join(', ')}</p>
                                      )}
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80 rounded-xl" side="right" align="start" sideOffset={8}>
                                    <FieldEditor
                                      field={f}
                                      label={editingLabel}
                                      setLabel={setEditingLabel}
                                      type={editingType}
                                      setType={setEditingType}
                                      placeholder={editingPlaceholder}
                                      setPlaceholder={setEditingPlaceholder}
                                      required={editingRequired}
                                      setRequired={setEditingRequired}
                                      hideLabel={editingHideLabel}
                                      setHideLabel={setEditingHideLabel}
                                      boldLabel={editingBoldLabel}
                                      setBoldLabel={setEditingBoldLabel}
                                      centerLabel={editingCenterLabel}
                                      setCenterLabel={setEditingCenterLabel}
                                      italicLabel={editingItalicLabel}
                                      setItalicLabel={setEditingItalicLabel}
                                      underlineLabel={editingUnderlineLabel}
                                      setUnderlineLabel={setEditingUnderlineLabel}
                                      options={editingOptions}
                                      setOptions={setEditingOptions}
                                      tableMode={editingTableMode}
                                      setTableMode={setEditingTableMode}
                                      tableRows={editingTableRows}
                                      setTableRows={setEditingTableRows}
                                      tableColumns={editingTableColumns}
                                      setTableColumns={setEditingTableColumns}
                                      tableHeaderPlacement={editingTableHeaderPlacement}
                                      setTableHeaderPlacement={setEditingTableHeaderPlacement}
                                      tableColumnHeaders={editingTableColumnHeaders}
                                      setTableColumnHeaders={setEditingTableColumnHeaders}
                                      tableRowHeaders={editingTableRowHeaders}
                                      setTableRowHeaders={setEditingTableRowHeaders}
                                      conditionalEnabled={editingConditionalEnabled}
                                      setConditionalEnabled={setEditingConditionalEnabled}
                                      conditionalDependsOn={editingConditionalDependsOn}
                                      setConditionalDependsOn={setEditingConditionalDependsOn}
                                      conditionalCondition={editingConditionalCondition}
                                      setConditionalCondition={setEditingConditionalCondition}
                                      conditionalValue={editingConditionalValue}
                                      setConditionalValue={setEditingConditionalValue}
                                      conditionalItemType={editingConditionalItemType}
                                      setConditionalItemType={setEditingConditionalItemType}
                                      availableFields={getAllFields()}
                                      onSave={() => {
                                        const updated = fields.map(fld => fld.id === f.id ? {
                                          ...fld,
                                          label: editingLabel,
                                          type: editingType,
                                          placeholder: editingPlaceholder || undefined,
                                          required: editingRequired,
                                          hideLabel: editingHideLabel,
                                          boldLabel: editingBoldLabel,
                                          centerLabel: editingCenterLabel,
                                          italicLabel: editingItalicLabel,
                                          underlineLabel: editingUnderlineLabel,
                                          options: editingOptions ? editingOptions.split('\n').filter(Boolean) : undefined,
                                          tableConfig: editingType === 'table' ? buildTableConfigFromEditing() : undefined,
                                          conditionalRendering: editingConditionalEnabled ? {
                                            dependsOn: editingConditionalDependsOn,
                                            condition: editingConditionalCondition,
                                            value: editingConditionalValue || undefined,
                                            itemType: editingConditionalCondition === 'hasItem' ? editingConditionalItemType : undefined,
                                          } : undefined,
                                        } : fld)
                                        setFields(updated)
                                        setFieldEditorOpen(false)
                                      }}
                                      onClose={() => setFieldEditorOpen(false)}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => moveItem('field', f.id, 'up')}>
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => moveItem('field', f.id, 'down')}>
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => removeField(f.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )
                          } else {
                            // Section rendering
                            const s = item as FormSection & { itemType: 'section' }
                            return (
                        <div key={s.id} className="border-2 border-blue-500 rounded-lg p-3 bg-blue-50 dark:bg-blue-950 space-y-2">
                          {/* Section Header - Click to edit properties */}
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-blue-300 dark:border-blue-700">
                            <Popover open={sectionEditorOpen && editingSection?.id === s.id} onOpenChange={(open) => {
                              if (!open && editingSection?.id === s.id) setSectionEditorOpen(false)
                            }}>
                              <PopoverTrigger asChild>
                                <div className="flex-1 cursor-pointer" onClick={() => {
                                  setEditingSection(s)
                                  setEditingSectionTitle(s.title)
                                  setEditingSectionColumns(s.columns)
                                  setEditingSectionBoldTitle(Boolean(s.boldTitle))
                                  setEditingSectionItalicTitle(Boolean(s.italicTitle))
                                  setEditingSectionUnderlineTitle(Boolean(s.underlineTitle))
                                  setEditingSectionCenterTitle(Boolean(s.centerTitle))
                                  setSectionEditorOpen(true)
                                }}>
                                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">{s.title}</p>
                                  <p className="text-xs text-muted-foreground">{s.columns} column(s)</p>
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 rounded-xl" side="right" align="start" sideOffset={8}>
                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium">Title</label>
                                    <Input value={editingSectionTitle} onChange={(e) => setEditingSectionTitle(e.target.value)} />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium">Columns</label>
                                    <Select value={String(editingSectionColumns)} onValueChange={(v) => setEditingSectionColumns(Number(v) as 1 | 2 | 3 | 4)}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1">1 Column</SelectItem>
                                        <SelectItem value="2">2 Columns</SelectItem>
                                        <SelectItem value="3">3 Columns</SelectItem>
                                        <SelectItem value="4">4 Columns</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-medium">Title Styling</label>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        type="button"
                                        variant={editingSectionBoldTitle ? "default" : "outline"}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setEditingSectionBoldTitle(!editingSectionBoldTitle)}
                                      >
                                        <Bold className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant={editingSectionItalicTitle ? "default" : "outline"}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setEditingSectionItalicTitle(!editingSectionItalicTitle)}
                                      >
                                        <Italic className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant={editingSectionUnderlineTitle ? "default" : "outline"}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setEditingSectionUnderlineTitle(!editingSectionUnderlineTitle)}
                                      >
                                        <Underline className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant={editingSectionCenterTitle ? "default" : "outline"}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setEditingSectionCenterTitle(!editingSectionCenterTitle)}
                                      >
                                        <AlignCenter className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" onClick={() => setSectionEditorOpen(false)} className="rounded-full">Cancel</Button>
                                    <Button size="sm" onClick={onSaveSection} className="rounded-full">Save</Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => moveItem('section', s.id, 'up')}>
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => moveItem('section', s.id, 'down')}>
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => removeSection(s.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Section Columns with Add Buttons */}
                          <div className={`grid gap-2 ${s.columns === 1 ? 'grid-cols-1' : s.columns === 2 ? 'grid-cols-2' : s.columns === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                            {Array.from({ length: s.columns }).map((_, colIdx) => {
                              const fieldsInColumn = s.fields.filter((_, fIdx) => fIdx % s.columns === colIdx)
                              return (
                                <div key={colIdx} className="border border-blue-300 dark:border-blue-700 rounded p-2 space-y-2 bg-white dark:bg-slate-900">
                                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Col {colIdx + 1}</p>
                                  
                                  {/* Fields in this column */}
                                  {fieldsInColumn.map((f, fIdx) => {
                                    const actualIdx = s.fields.findIndex(field => field.id === f.id)
                                    const isOpen = sectionFieldEditorOpen && editingSectionField?.sectionId === s.id && editingSectionField?.field.id === f.id
                                    return (
                                      <div key={f.id} className="border rounded px-2 py-1 bg-card/50 hover:bg-card relative">
                                        <Popover open={isOpen} onOpenChange={(open) => {
                                          if (open) {
                                            setEditingSectionField({ sectionId: s.id, field: f })
                                            setEditingLabel(f.label)
                                            setEditingType(f.type)
                                            setEditingPlaceholder(f.placeholder || '')
                                            setEditingRequired(Boolean(f.required))
                                            setEditingHideLabel(Boolean(f.hideLabel))
                                            setEditingBoldLabel(Boolean(f.boldLabel))
                                            setEditingCenterLabel(Boolean(f.centerLabel))
                                            setEditingItalicLabel(Boolean(f.italicLabel))
                                            setEditingUnderlineLabel(Boolean(f.underlineLabel))
                                            setEditingOptions((f.options || []).join('\n'))
                                            applyTableConfigToState(f.tableConfig)
                                            setEditingConditionalEnabled(Boolean(f.conditionalRendering))
                                            setEditingConditionalDependsOn(f.conditionalRendering?.dependsOn || '')
                                            setEditingConditionalCondition(f.conditionalRendering?.condition || 'notEmpty')
                                            setEditingConditionalValue(f.conditionalRendering?.value || '')
                                            setSectionFieldEditorOpen(true)
                                          } else {
                                            setSectionFieldEditorOpen(false)
                                            setEditingSectionField(null)
                                          }
                                        }}>
                                          <PopoverTrigger asChild>
                                            <div className="cursor-pointer">
                                              <div className="flex items-center justify-between">
                                                <div className="flex-1" onClick={() => {
                                                  setEditingSectionField({ sectionId: s.id, field: f })
                                                  setEditingLabel(f.label)
                                                  setEditingType(f.type)
                                                  setEditingPlaceholder(f.placeholder || '')
                                                  setEditingRequired(Boolean(f.required))
                                                  setEditingHideLabel(Boolean(f.hideLabel))
                                                  setEditingBoldLabel(Boolean(f.boldLabel))
                                                  setEditingCenterLabel(Boolean(f.centerLabel))
                                                  setEditingItalicLabel(Boolean(f.italicLabel))
                                                  setEditingUnderlineLabel(Boolean(f.underlineLabel))
                                                  setEditingOptions((f.options || []).join('\n'))
                                                  applyTableConfigToState(f.tableConfig)
                                                  setEditingConditionalEnabled(Boolean(f.conditionalRendering))
                                                  setEditingConditionalDependsOn(f.conditionalRendering?.dependsOn || '')
                                                  setEditingConditionalCondition(f.conditionalRendering?.condition || 'notEmpty')
                                                  setEditingConditionalValue(f.conditionalRendering?.value || '')
                                                  setSectionFieldEditorOpen(true)
                                                }}>
                                                  <p className="text-xs font-medium">{f.label}</p>
                                                  <p className="text-[10px] text-muted-foreground">({f.type})</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); moveSectionFieldHorizontally(s.id, actualIdx, 'left') }}>
                                                    <ArrowLeft className="h-3 w-3" />
                                                  </Button>
                                                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); moveSectionFieldHorizontally(s.id, actualIdx, 'right') }}>
                                                    <ArrowRight className="h-3 w-3" />
                                                  </Button>
                                                  <Button variant="destructive" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); removeSectionField(s.id, f.id) }}>
                                                    <Trash2 className="h-3 w-3" />
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-80 rounded-xl" side="right" align="start" sideOffset={8}>
                                            <FieldEditor
                                              field={f}
                                              label={editingLabel}
                                              setLabel={setEditingLabel}
                                              type={editingType}
                                              setType={setEditingType}
                                              placeholder={editingPlaceholder}
                                              setPlaceholder={setEditingPlaceholder}
                                              required={editingRequired}
                                              setRequired={setEditingRequired}
                                              hideLabel={editingHideLabel}
                                              setHideLabel={setEditingHideLabel}
                                              boldLabel={editingBoldLabel}
                                              setBoldLabel={setEditingBoldLabel}
                                              centerLabel={editingCenterLabel}
                                              setCenterLabel={setEditingCenterLabel}
                                              italicLabel={editingItalicLabel}
                                              setItalicLabel={setEditingItalicLabel}
                                              underlineLabel={editingUnderlineLabel}
                                              setUnderlineLabel={setEditingUnderlineLabel}
                                              options={editingOptions}
                                              setOptions={setEditingOptions}
                                              tableMode={editingTableMode}
                                              setTableMode={setEditingTableMode}
                                              tableRows={editingTableRows}
                                              setTableRows={setEditingTableRows}
                                              tableColumns={editingTableColumns}
                                              setTableColumns={setEditingTableColumns}
                                              tableHeaderPlacement={editingTableHeaderPlacement}
                                              setTableHeaderPlacement={setEditingTableHeaderPlacement}
                                              tableColumnHeaders={editingTableColumnHeaders}
                                              setTableColumnHeaders={setEditingTableColumnHeaders}
                                              tableRowHeaders={editingTableRowHeaders}
                                              setTableRowHeaders={setEditingTableRowHeaders}
                                              conditionalEnabled={editingConditionalEnabled}
                                              setConditionalEnabled={setEditingConditionalEnabled}
                                              conditionalDependsOn={editingConditionalDependsOn}
                                              setConditionalDependsOn={setEditingConditionalDependsOn}
                                              conditionalCondition={editingConditionalCondition}
                                              setConditionalCondition={setEditingConditionalCondition}
                                              conditionalValue={editingConditionalValue}
                                              setConditionalValue={setEditingConditionalValue}
                                              conditionalItemType={editingConditionalItemType}
                                              setConditionalItemType={setEditingConditionalItemType}
                                              availableFields={getAllFields()}
                                              onSave={onSaveSectionField}
                                              onClose={() => {
                                                setSectionFieldEditorOpen(false)
                                                setEditingSectionField(null)
                                              }}
                                            />
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                    )
                                  })}

                                  {/* Add button for this column */}
                                  <Popover open={sectionFieldTypePickerColumn === `${s.id}_${colIdx}`} onOpenChange={(open) => setSectionFieldTypePickerColumn(open ? `${s.id}_${colIdx}` : null)}>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" size="sm" className="w-full text-xs">
                                        <Plus className="h-3 w-3 mr-1" /> Add
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 rounded-2xl" side="right" align="start" sideOffset={4}>
                                      <div className="grid grid-cols-2 gap-2">
                                        {(['text','email','number','textarea','select','radio','checkbox','date','table','diagnosticRecord','medicationLongForm','medicationMiniForm','actionListener'] as const).map(t => (
                                          <Button key={t} variant="outline" size="sm" onClick={() => {
                                            onAddFieldToSection(s.id, t)
                                          }} className="text-xs">{t}</Button>
                                        ))}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        )
                            }
                          })
                      })()}
                    </div>
                  )}
                </Card>
              </div>
            </Panel>
            <PanelResizeHandle className="w-1 bg-border rounded" />
            <Panel defaultSize={50} minSize={30}>
              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Preview</h3>
                  <span className="text-xs text-muted-foreground">Use the dock below to save</span>
                </div>
                <Separator />
              {fields.length === 0 && sections.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing to preview. Add fields or sections first.</p>
              ) : (
                <div className="space-y-6">
                  {/* Unified rendering: fields and sections in order */}
                  {[
                    ...fields.map(f => ({ ...f, itemType: 'field' as const })),
                    ...sections.map(s => ({ ...s, itemType: 'section' as const }))
                  ]
                    .sort((a, b) => a.order - b.order)
                    .map((item) => {
                      if (item.itemType === 'field') {
                        const f = item as FormField & { itemType: 'field' }
                        if (!checkFieldCondition(f, previewFormValues)) return null
                        return (
                    <div key={f.id} className="space-y-1">
                      {!f.hideLabel && (
                        <label className={`text-sm font-medium flex items-center gap-1 ${f.boldLabel ? 'font-bold' : ''} ${f.centerLabel ? 'justify-center' : ''} ${f.italicLabel ? 'italic' : ''} ${f.underlineLabel ? 'underline' : ''}`}>
                          {f.label}
                          {f.required && <span className="text-red-500">*</span>}
                        </label>
                      )}
                      {renderFieldPreviewControl(f)}
                    </div>
                        )
                      } else {
                        // Render section
                        const s = item as FormSection & { itemType: 'section' }
                        return (
                          <div key={s.id} className="border-l-4 border-blue-400 pl-4 space-y-4">
                            <h4 className={`font-semibold text-sm ${s.boldTitle ? 'font-bold' : ''} ${s.italicTitle ? 'italic' : ''} ${s.underlineTitle ? 'underline' : ''} ${s.centerTitle ? 'text-center' : ''}`}>{s.title}</h4>
                            <div className={`grid gap-4 ${s.columns === 1 ? 'grid-cols-1' : s.columns === 2 ? 'grid-cols-2' : s.columns === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                              {s.fields.filter(f => checkFieldCondition(f, previewFormValues)).map((f) => (
                                <div key={f.id} className="space-y-1">
                                  {!f.hideLabel && (
                                    <label className={`text-sm font-medium flex items-center gap-1 ${f.boldLabel ? 'font-bold' : ''} ${f.centerLabel ? 'justify-center' : ''} ${f.italicLabel ? 'italic' : ''} ${f.underlineLabel ? 'underline' : ''}`}>
                                      {f.label}
                                      {f.required && <span className="text-red-500">*</span>}
                                    </label>
                                  )}
                                  {renderFieldPreviewControl(f)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
                    })}
                </div>
              )}
              </Card>
            </Panel>
          </PanelGroup>
        )}

        <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
          <SheetContent side="right" className="sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{previewForm?.title || 'Form Preview'}</SheetTitle>
              <SheetDescription>
                {previewForm?.description || 'Read-only preview of selected form'}
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-6">
              <FormCatalogPreview form={previewForm} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Add New Field Dialog */}
        {mode === 'edit' && (
          <Dialog open={fieldEditorOpen && !editingField} onOpenChange={(open) => {
            if (!open && !editingField) setFieldEditorOpen(false)
          }}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Field</DialogTitle>
              </DialogHeader>
              <FieldEditor
                field={null}
                label={editingLabel}
                setLabel={setEditingLabel}
                type={editingType}
                setType={setEditingType}
                placeholder={editingPlaceholder}
                setPlaceholder={setEditingPlaceholder}
                required={editingRequired}
                setRequired={setEditingRequired}
                hideLabel={editingHideLabel}
                setHideLabel={setEditingHideLabel}
                boldLabel={editingBoldLabel}
                setBoldLabel={setEditingBoldLabel}
                centerLabel={editingCenterLabel}
                setCenterLabel={setEditingCenterLabel}
                italicLabel={editingItalicLabel}
                setItalicLabel={setEditingItalicLabel}
                underlineLabel={editingUnderlineLabel}
                setUnderlineLabel={setEditingUnderlineLabel}
                options={editingOptions}
                setOptions={setEditingOptions}
                tableMode={editingTableMode}
                setTableMode={setEditingTableMode}
                tableRows={editingTableRows}
                setTableRows={setEditingTableRows}
                tableColumns={editingTableColumns}
                setTableColumns={setEditingTableColumns}
                tableHeaderPlacement={editingTableHeaderPlacement}
                setTableHeaderPlacement={setEditingTableHeaderPlacement}
                tableColumnHeaders={editingTableColumnHeaders}
                setTableColumnHeaders={setEditingTableColumnHeaders}
                tableRowHeaders={editingTableRowHeaders}
                setTableRowHeaders={setEditingTableRowHeaders}
                conditionalEnabled={editingConditionalEnabled}
                setConditionalEnabled={setEditingConditionalEnabled}
                conditionalDependsOn={editingConditionalDependsOn}
                setConditionalDependsOn={setEditingConditionalDependsOn}
                conditionalCondition={editingConditionalCondition}
                setConditionalCondition={setEditingConditionalCondition}
                conditionalValue={editingConditionalValue}
                setConditionalValue={setEditingConditionalValue}
                conditionalItemType={editingConditionalItemType}
                setConditionalItemType={setEditingConditionalItemType}
                availableFields={getAllFields()}
                onSave={() => {
                  const newField: FormField = {
                    id: `field_${Date.now()}`,
                    label: editingLabel || 'Untitled',
                    type: editingType,
                    placeholder: editingPlaceholder || undefined,
                    required: editingRequired,
                    hideLabel: editingHideLabel,
                    boldLabel: editingBoldLabel,
                    centerLabel: editingCenterLabel,
                    italicLabel: editingItalicLabel,
                    underlineLabel: editingUnderlineLabel,
                    options: editingOptions ? editingOptions.split('\n').filter(Boolean) : undefined,
                    tableConfig: editingType === 'table' ? buildTableConfigFromEditing() : undefined,
                    order: fields.length + sections.length,
                    conditionalRendering: editingConditionalEnabled ? {
                      dependsOn: editingConditionalDependsOn,
                      condition: editingConditionalCondition,
                      value: editingConditionalValue || undefined,
                      itemType: editingConditionalCondition === 'hasItem' ? editingConditionalItemType : undefined,
                    } : undefined,
                  }
                  setFields([...fields, newField])
                  setFieldEditorOpen(false)
                }}
                onClose={() => setFieldEditorOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Floating bottom dock (glassy pill) */}
        {mode === 'edit' && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <div className="glass-gray rounded-full shadow-xl px-3 py-2 flex items-center gap-3">
              <TooltipProvider>
                <div className="flex items-center gap-3">
                  {/* Add Field */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Popover open={typePickerOpen} onOpenChange={setTypePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                            aria-label="Add"
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 rounded-2xl glass-gray" side="top" align="center" sideOffset={8}>
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-white/90">Add New</p>
                            <Button variant="outline" size="sm" onClick={() => {
                              setEditingField(null)
                              setEditingLabel('')
                              setEditingType('text')
                              setEditingPlaceholder('')
                              setEditingRequired(true)
                              setEditingHideLabel(false)
                              setEditingBoldLabel(false)
                              setEditingCenterLabel(false)
                              setEditingItalicLabel(false)
                              setEditingUnderlineLabel(false)
                              setEditingOptions('')
                              applyTableConfigToState(undefined)
                              setEditingConditionalEnabled(false)
                              setEditingConditionalDependsOn('')
                              setEditingConditionalCondition('notEmpty')
                              setEditingConditionalValue('')
                              setEditingConditionalItemType('action')
                              setFieldEditorOpen(true)
                              setTypePickerOpen(false)
                            }} className="w-full text-xs">
                              + Field
                            </Button>
                            <Button variant="outline" size="sm" onClick={onCreateNewSection} className="w-full text-xs">
                              + Section
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add Field or Section</p>
                    </TooltipContent>
                  </Tooltip>
                  {hasActionListenerField() && (
                    <>
                      <div className="w-px h-6 bg-white/20" />

                      {/* Add Action/Consumable */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setShowAddActionModal(true)}
                            className="rounded-full h-12 px-5 border-2 border-white/30 bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                            aria-label="Add Action/Consumable"
                          >
                            <Pill className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add Action or Consumable</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="w-px h-6 bg-white/20" />
                    </>
                  )}

                  {activeFormStatus === 'FINAL' ? (
                    hasUnsavedChanges && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleSubmit(onSave)}
                            disabled={saving || formsLoading || !selectedDeptId}
                            className="rounded-full h-12 px-5 border-2 border-white/30 bg-[#FF6900] hover:bg-[#e05f00] text-white shadow-lg disabled:opacity-50"
                            aria-label="Create New Version"
                          >
                            <Upload className="h-5 w-5 mr-2" /> {saving ? 'Creating...' : 'Create New Version'}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Save your edits as a new version from this finalized form</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  ) : (
                    <>
                      {hasUnsavedChanges && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={handleSubmit(onSave)}
                              disabled={saving || formsLoading || !selectedDeptId}
                              className="rounded-full h-12 px-5 border-2 border-white/30 bg-[#FF6900] hover:bg-[#e05f00] text-white shadow-lg disabled:opacity-50"
                              aria-label="Save Draft"
                            >
                              <Eye className="h-5 w-5 mr-2" /> {saving ? 'Saving...' : 'Save Draft'}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Save current draft changes</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={onFinalize}
                            disabled={finalizing || !activeFormId || hasUnsavedChanges}
                            className="rounded-full h-12 px-5 border-2 border-white/30 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg disabled:opacity-50"
                            aria-label="Finalize Form"
                          >
                            <Upload className="h-5 w-5 mr-2" /> {finalizing ? 'Finalizing...' : 'Finalize'}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{hasUnsavedChanges ? 'Save draft changes before finalizing' : 'Finalize this draft form'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
              </TooltipProvider>
            </div>
          </div>
        )}

        {/* Add Action/Consumable Modal */}
        {mode === 'edit' && (
          <AddActionConsumableModal
            isOpen={showAddActionModal}
            onClose={() => setShowAddActionModal(false)}
            departments={[]} // No departments needed for form builder testing
            currentDepartmentId="test" // Dummy department for form builder
            viewMode="service"
            onAdd={onAddAction}
            isSubmitting={false}
          />
        )}

      </main>
    </div>
  )
}

function FormCatalogPreview({ form }: { form: BackendForm | null }) {
  if (!form) {
    return <p className="text-sm text-muted-foreground">No form loaded for preview.</p>
  }

  const orderedItems = [
    ...(form.fields || []).map((field) => ({ ...field, itemType: 'field' as const })),
    ...(form.sections || []).map((section) => ({ ...section, itemType: 'section' as const })),
  ].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant={form.status === 'FINAL' ? 'secondary' : 'default'}>
          {form.status === 'FINAL' ? 'Final' : 'Draft'}
        </Badge>
        {form.currentVersionNumber && <Badge variant="outline">Version {form.currentVersionNumber}</Badge>}
      </div>

      {orderedItems.length === 0 ? (
        <p className="text-sm text-muted-foreground">This form has no fields yet.</p>
      ) : (
        orderedItems.map((item) => {
          if (item.itemType === 'field') {
            const field = item as FormField & { itemType: 'field' }
            return (
              <div key={field.id} className="rounded-lg border p-3 space-y-1">
                <p className="text-sm font-medium">
                  {field.label} <span className="text-xs text-muted-foreground">({field.type})</span>
                </p>
                {field.placeholder && <p className="text-xs text-muted-foreground">Placeholder: {field.placeholder}</p>}
                {field.options && field.options.length > 0 && (
                  <p className="text-xs text-muted-foreground">Options: {field.options.join(', ')}</p>
                )}
              </div>
            )
          }

          const section = item as FormSection & { itemType: 'section' }
          return (
            <div key={section.id} className="rounded-lg border p-3 space-y-2">
              <div>
                <p className="text-sm font-semibold">{section.title}</p>
                <p className="text-xs text-muted-foreground">{section.columns} column(s)</p>
              </div>
              {(section.fields || []).length === 0 ? (
                <p className="text-xs text-muted-foreground">No fields in this section.</p>
              ) : (
                <div className="space-y-1">
                  {(section.fields || []).map((field) => (
                    <p key={field.id} className="text-xs">
                      {field.label} <span className="text-muted-foreground">({field.type})</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

// Field Editor Component
function FieldEditor({
  field,
  label,
  setLabel,
  type,
  setType,
  placeholder,
  setPlaceholder,
  required,
  setRequired,
  hideLabel,
  setHideLabel,
  boldLabel,
  setBoldLabel,
  centerLabel,
  setCenterLabel,
  italicLabel,
  setItalicLabel,
  underlineLabel,
  setUnderlineLabel,
  options,
  setOptions,
  tableMode,
  setTableMode,
  tableRows,
  setTableRows,
  tableColumns,
  setTableColumns,
  tableHeaderPlacement,
  setTableHeaderPlacement,
  tableColumnHeaders,
  setTableColumnHeaders,
  tableRowHeaders,
  setTableRowHeaders,
  conditionalEnabled,
  setConditionalEnabled,
  conditionalDependsOn,
  setConditionalDependsOn,
  conditionalCondition,
  setConditionalCondition,
  conditionalValue,
  setConditionalValue,
  conditionalItemType,
  setConditionalItemType,
  availableFields,
  onSave,
  onClose,
}: {
  field: FormField | null
  label: string
  setLabel: (v: string) => void
  type: FormField['type']
  setType: (v: FormField['type']) => void
  placeholder: string
  setPlaceholder: (v: string) => void
  required: boolean
  setRequired: (v: boolean) => void
  hideLabel: boolean
  setHideLabel: (v: boolean) => void
  boldLabel: boolean
  setBoldLabel: (v: boolean) => void
  centerLabel: boolean
  setCenterLabel: (v: boolean) => void
  italicLabel: boolean
  setItalicLabel: (v: boolean) => void
  underlineLabel: boolean
  setUnderlineLabel: (v: boolean) => void
  options: string
  setOptions: (v: string) => void
  tableMode: TableConfig['mode']
  setTableMode: (v: TableConfig['mode']) => void
  tableRows: number
  setTableRows: (v: number) => void
  tableColumns: number
  setTableColumns: (v: number) => void
  tableHeaderPlacement: TableHeaderPlacement
  setTableHeaderPlacement: (v: TableHeaderPlacement) => void
  tableColumnHeaders: string
  setTableColumnHeaders: (v: string) => void
  tableRowHeaders: string
  setTableRowHeaders: (v: string) => void
  conditionalEnabled: boolean
  setConditionalEnabled: (v: boolean) => void
  conditionalDependsOn: string
  setConditionalDependsOn: (v: string) => void
  conditionalCondition: ConditionalRendering['condition']
  setConditionalCondition: (v: ConditionalRendering['condition']) => void
  conditionalValue: string
  setConditionalValue: (v: string) => void
  conditionalItemType: 'action' | 'consumable'
  setConditionalItemType: (v: 'action' | 'consumable') => void
  availableFields: FormField[]
  onSave: () => void
  onClose: () => void
}) {
  const [itemSearch, setItemSearch] = useState(conditionalValue || '')
  const [itemOptions, setItemOptions] = useState<string[]>([])
  const [itemLoading, setItemLoading] = useState(false)

  useEffect(() => {
    setItemSearch(conditionalValue || '')
  }, [conditionalValue])

  useEffect(() => {
    if (conditionalCondition !== 'hasItem') {
      setItemOptions([])
      return
    }
    const q = itemSearch.trim()
    if (q.length < 2) {
      setItemOptions([])
      return
    }
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        setItemLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') || '' : ''
        const isAction = conditionalItemType === 'action'
        const query = isAction
          ? `query SearchActions($name: String, $page: Int, $size: Int) { getActions(name: $name, page: $page, size: $size) { data { content { name } } } }`
          : `query SearchConsumables($name: String, $page: Int, $size: Int) { getConsumables(name: $name, page: $page, size: $size) { data { content { name } } } }`
        const variables = { name: q, page: 0, size: 10 }
        const resp = await fetch(`${baseUrl}/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify({ query, variables }),
          signal: controller.signal,
        })
        if (!resp.ok) throw new Error('search failed')
        const data = await resp.json()
        const items = isAction
          ? data?.data?.getActions?.data?.content || []
          : data?.data?.getConsumables?.data?.content || []
        const names = (items || []).map((it: any) => it?.name).filter(Boolean)
        setItemOptions(names)
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          setItemOptions([])
        }
      } finally {
        setItemLoading(false)
      }
    }, 300)
    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [itemSearch, conditionalCondition, conditionalItemType])
    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            <div className="space-y-1">
              <label className="text-xs font-medium">Label</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium">Type</label>
                <Select value={type} onValueChange={(v) => {
                  const nextType = v as FormField['type']
                  setType(nextType)
                  if (nextType === 'table') {
                    setTableMode('fixed')
                    setTableRows(3)
                    setTableColumns(3)
                    setTableHeaderPlacement('none')
                    setTableColumnHeaders('')
                    setTableRowHeaders('')
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="diagnosticRecord">Diagnostic Record</SelectItem>
                    <SelectItem value="medicationLongForm">Medication Long Form</SelectItem>
                    <SelectItem value="medicationMiniForm">Medication Mini Form</SelectItem>
                    <SelectItem value="actionListener">Action Listener</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Required</label>
                <div className="flex items-center gap-2 py-2">
                  <Checkbox checked={required} onCheckedChange={(v) => setRequired(Boolean(v))} />
                  <span className="text-xs">Required</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox checked={hideLabel} onCheckedChange={(v) => setHideLabel(Boolean(v))} />
                <span className="text-xs">Hide Label</span>
              </div>
              {!hideLabel && (
                <div className="space-y-1">
                  <label className="text-xs font-medium">Label Styling</label>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant={boldLabel ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setBoldLabel(!boldLabel)}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant={italicLabel ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setItalicLabel(!italicLabel)}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant={underlineLabel ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setUnderlineLabel(!underlineLabel)}
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant={centerLabel ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCenterLabel(!centerLabel)}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Placeholder</label>
              <Input value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
            </div>
            {type === 'table' && (
              <div className="space-y-3 border border-dashed rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Table Settings</span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span>Fixed presets:</span>
                    {[3,4].map(preset => (
                      <Button key={preset} variant="outline" size="sm" className="h-7 px-2"
                        onClick={() => { setTableMode('fixed'); setTableRows(preset); setTableColumns(preset); }}>
                        {preset}x{preset}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Mode</label>
                    <Select value={tableMode} onValueChange={(v) => setTableMode(v as TableConfig['mode'])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="variableRows">Variable rows</SelectItem>
                        <SelectItem value="variableColumns">Variable columns</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Headers</label>
                    <Select value={tableHeaderPlacement} onValueChange={(v) => setTableHeaderPlacement(v as TableHeaderPlacement)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No headers</SelectItem>
                        <SelectItem value="top">Top only</SelectItem>
                        <SelectItem value="left">Left only</SelectItem>
                        <SelectItem value="right">Right only</SelectItem>
                        <SelectItem value="both">Both sides</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Rows</label>
                    <Input type="number" min={1} value={tableRows} disabled={tableMode === 'variableColumns'} onChange={(e) => setTableRows(Number(e.target.value) || 1)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Columns</label>
                    <Input type="number" min={1} value={tableColumns} disabled={tableMode === 'variableRows'} onChange={(e) => setTableColumns(Number(e.target.value) || 1)} />
                  </div>
                </div>
                {(tableHeaderPlacement === 'top' || tableHeaderPlacement === 'both') && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Column Headers</label>
                    <Textarea rows={2} value={tableColumnHeaders} onChange={(e) => setTableColumnHeaders(e.target.value)} placeholder="One per line" />
                  </div>
                )}
                {(tableHeaderPlacement === 'left' || tableHeaderPlacement === 'right' || tableHeaderPlacement === 'both') && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Row Headers</label>
                    <Textarea rows={2} value={tableRowHeaders} onChange={(e) => setTableRowHeaders(e.target.value)} placeholder="One per line" />
                  </div>
                )}
                {tableHeaderPlacement === 'none' && (
                  <p className="text-xs text-muted-foreground italic">No headers configured. Table will display as a plain grid.</p>
                )}
                <p className="text-[11px] text-muted-foreground">Only one axis can be variable at a time; headers are configurable here and locked in the live preview.</p>
              </div>
            )}
            {(type === 'select' || type === 'radio') && (
              <div className="space-y-1">
                <label className="text-xs font-medium">Options (one per line)</label>
                <Textarea rows={3} value={options} onChange={(e) => setOptions(e.target.value)} />
              </div>
            )}
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox checked={conditionalEnabled} onCheckedChange={(v) => setConditionalEnabled(Boolean(v))} />
                <span className="text-xs font-medium">Conditional Rendering</span>
              </div>
              {conditionalEnabled && (
                <div className="space-y-2 pl-6 border-l-2 border-blue-200">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Show when field:</label>
                    <Select value={conditionalDependsOn} onValueChange={setConditionalDependsOn}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFields.filter(f => f.id !== field?.id).map(f => (
                          <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Condition:</label>
                    {(() => {
                      const dependsOnField = availableFields.find(f => f.id === conditionalDependsOn)
                      const isActionListener = dependsOnField?.type === 'actionListener'
                      return (
                        <Select value={conditionalCondition} onValueChange={(v) => setConditionalCondition(v as ConditionalRendering['condition'])}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="notEmpty">Is not empty</SelectItem>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="checked">Is checked</SelectItem>
                            <SelectItem value="includes">Includes option</SelectItem>
                            <SelectItem value="hasItem" disabled={!isActionListener}>Has action/consumable</SelectItem>
                          </SelectContent>
                        </Select>
                      )
                    })()}
                    {(() => {
                      const dependsOnField = availableFields.find(f => f.id === conditionalDependsOn)
                      const isActionListener = dependsOnField?.type === 'actionListener'
                      if (conditionalCondition === 'hasItem' && !isActionListener) {
                        return <p className="text-[11px] text-orange-600">Select an action listener field to enable this condition.</p>
                      }
                      return null
                    })()}
                  </div>
                  {conditionalCondition === 'hasItem' && (
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Item type</label>
                        <Select value={conditionalItemType} onValueChange={(v) => setConditionalItemType(v as 'action' | 'consumable')}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="action">Action</SelectItem>
                            <SelectItem value="consumable">Consumable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Item name to match</label>
                        <Input
                          value={itemSearch}
                          onChange={(e) => {
                            setItemSearch(e.target.value)
                            setConditionalValue(e.target.value)
                          }}
                          placeholder="Search backend actions/consumables"
                        />
                        {itemLoading && <p className="text-[11px] text-muted-foreground">Searching...</p>}
                        {!itemLoading && itemOptions.length > 0 && (
                          <div className="border rounded-md bg-card shadow-sm max-h-40 overflow-y-auto text-xs">
                            {itemOptions.map(name => (
                              <button
                                key={name}
                                className="w-full text-left px-3 py-2 hover:bg-muted"
                                onClick={() => {
                                  setConditionalValue(name)
                                  setItemSearch(name)
                                  setItemOptions([])
                                }}
                              >
                                {name}
                              </button>
                            ))}
                          </div>
                        )}
                        {itemSearch.trim().length < 2 && conditionalValue === '' && (
                          <p className="text-[11px] text-muted-foreground">Type at least 2 characters to search backend.</p>
                        )}
                        <p className="text-[11px] text-muted-foreground">Select from backend search; matches against actions/consumables.</p>
                      </div>
                    </div>
                  )}
                  {(conditionalCondition === 'equals' || conditionalCondition === 'includes') && conditionalCondition !== 'hasItem' && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Value:</label>
                      <Input value={conditionalValue} onChange={(e) => setConditionalValue(e.target.value)} placeholder="Enter value" />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={onClose} className="rounded-full">Cancel</Button>
              <Button size="sm" onClick={onSave} className="rounded-full">Save</Button>
            </div>
          </div>
  )
}