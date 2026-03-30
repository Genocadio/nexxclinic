"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import Header from '@/components/header'
import { useAuth } from '@/lib/auth-context'
import { useDepartments } from '@/hooks/auth-hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ArrowLeft, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { FormField, FormSection } from '@/lib/form-storage'

type BackendFormStatus = 'DRAFT' | 'FINAL'

interface BackendFormListItem {
  id: string
  title: string
  description?: string
  status: BackendFormStatus
  currentVersionNumber?: string
  createdAt?: string
  updatedAt?: string
}

interface BackendFormPreview {
  id: string
  title: string
  description?: string
  status: BackendFormStatus
  currentVersionNumber?: string
  fields?: FormField[]
  sections?: FormSection[]
}

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
  query GetFormForPreview($departmentId: ID!, $formId: ID!) {
    getForm(departmentId: $departmentId, formId: $formId) {
      status
      messages {
        text
        type
      }
      data {
        id
        title
        description
        status
        currentVersionNumber
        fields {
          id
          label
          type
          placeholder
          required
          options
          hideLabel
          boldLabel
          italicLabel
          underlineLabel
          centerLabel
          order
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
          columns
          order
          fields {
            id
            label
            type
            placeholder
            required
            options
            hideLabel
            boldLabel
            italicLabel
            underlineLabel
            centerLabel
            order
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

const FINALIZE_FORM_MUTATION = gql`
  mutation FinalizeFormFromManage($departmentId: ID!, $formId: ID!) {
    finalizeForm(departmentId: $departmentId, formId: $formId) {
      status
      messages {
        text
        type
      }
      data {
        id
        status
        currentVersionNumber
      }
    }
  }
`

const mapFormList = (raw: any[]): BackendFormListItem[] => {
  const items = (raw || []).map((form) => ({
    id: String(form?.id || ''),
    title: form?.title || 'Untitled Form',
    status: (form?.status === 'FINAL' ? 'FINAL' : 'DRAFT') as BackendFormStatus,
    currentVersionNumber: form?.currentVersionNumber || undefined,
    createdAt: form?.createdAt || undefined,
    updatedAt: form?.updatedAt || undefined,
  }))

  items.sort((a, b) => {
    const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime()
    const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime()
    return bDate - aDate
  })

  return items
}

const mapPreviewField = (field: any, index: number): FormField => ({
  id: field?.id || `field_${index}`,
  label: field?.label || 'Untitled',
  type: field?.type || 'text',
  placeholder: field?.placeholder || undefined,
  required: Boolean(field?.required),
  order: typeof field?.order === 'number' ? field.order : index,
  options: Array.isArray(field?.options) ? field.options.filter(Boolean) : undefined,
  hideLabel: Boolean(field?.hideLabel),
  boldLabel: Boolean(field?.boldLabel),
  italicLabel: Boolean(field?.italicLabel),
  underlineLabel: Boolean(field?.underlineLabel),
  centerLabel: Boolean(field?.centerLabel),
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
        dependsOn: field.conditionalRendering.dependsOn || '',
        condition: field.conditionalRendering.condition || 'notEmpty',
        value: field.conditionalRendering.value || undefined,
        itemType: field.conditionalRendering.itemType || undefined,
      }
    : undefined,
})

const mapFormPreview = (raw: any): BackendFormPreview => ({
  id: String(raw?.id || ''),
  title: raw?.title || 'Untitled Form',
  description: raw?.description || '',
  status: raw?.status === 'FINAL' ? 'FINAL' : 'DRAFT',
  currentVersionNumber: raw?.currentVersionNumber || undefined,
  fields: Array.isArray(raw?.fields)
    ? raw.fields.map((f: any, idx: number) => mapPreviewField(f, idx))
    : [],
  sections: Array.isArray(raw?.sections)
    ? raw.sections.map((s: any, idx: number) => ({
        id: s?.id || `section_${idx}`,
        title: s?.title || 'Untitled Section',
        columns: s?.columns === 1 || s?.columns === 2 || s?.columns === 3 || s?.columns === 4 ? s.columns : 2,
        order: typeof s?.order === 'number' ? s.order : idx,
        fields: Array.isArray(s?.fields)
          ? s.fields.map((f: any, fieldIdx: number) => mapPreviewField(f, fieldIdx))
          : [],
      }))
    : [],
})

export default function FormsManagePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { doctor } = useAuth()
  const { toast } = useToast()
  const { departments } = useDepartments()

  const defaultDeptId = searchParams.get('departmentId') || ''
  const defaultDeptName = searchParams.get('departmentName') || ''

  const [departmentId, setDepartmentId] = useState(defaultDeptId)
  const [forms, setForms] = useState<BackendFormListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [finalizingFormId, setFinalizingFormId] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewForm, setPreviewForm] = useState<BackendFormPreview | null>(null)

  const [loadForms] = useLazyQuery(GET_FORMS_QUERY)
  const [loadForm] = useLazyQuery(GET_FORM_QUERY)
  const [finalizeForm] = useMutation(FINALIZE_FORM_MUTATION)

  const selectedDepartmentName = useMemo(() => {
    const found = departments?.find((d: any) => String(d.id) === String(departmentId))
    return found?.name || defaultDeptName || 'Department'
  }, [departments, departmentId, defaultDeptName])

  const refreshForms = async (deptId: string) => {
    if (!deptId) {
      setForms([])
      return
    }
    setLoading(true)
    try {
      const result = await loadForms({ variables: { departmentId: deptId }, fetchPolicy: 'network-only' })
      const raw = result?.data?.getForms?.data || []
      setForms(mapFormList(raw))
    } catch (err: any) {
      setForms([])
      toast({ title: 'Failed to load forms', description: err?.message || 'Unexpected error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshForms(departmentId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId])

  const openBuilderForNew = () => {
    if (!departmentId) {
      toast({ title: 'Select a department first' })
      return
    }
    router.push(`/admin/forms?departmentId=${departmentId}&departmentName=${encodeURIComponent(selectedDepartmentName)}`)
  }

  const openBuilderForEdit = (formId: string) => {
    if (!departmentId) return
    router.push(`/admin/forms?departmentId=${departmentId}&departmentName=${encodeURIComponent(selectedDepartmentName)}&formId=${formId}`)
  }

  const handleFinalize = async (formId: string) => {
    if (!departmentId) return
    try {
      setFinalizingFormId(formId)
      const result = await finalizeForm({ variables: { departmentId, formId } })
      const payload = result?.data?.finalizeForm
      if (payload?.status !== 'SUCCESS') {
        const message = payload?.messages?.[0]?.text || 'Unable to finalize form'
        throw new Error(message)
      }
      toast({ title: 'Form finalized' })
      await refreshForms(departmentId)
    } catch (err: any) {
      toast({ title: 'Finalize failed', description: err?.message || 'Unexpected error' })
    } finally {
      setFinalizingFormId(null)
    }
  }

  const handlePreview = async (formId: string) => {
    if (!departmentId) return
    try {
      setLoading(true)
      const result = await loadForm({ variables: { departmentId, formId }, fetchPolicy: 'network-only' })
      const raw = result?.data?.getForm?.data
      if (!raw) throw new Error('Unable to load form preview')
      setPreviewForm(mapFormPreview(raw))
      setPreviewOpen(true)
    } catch (err: any) {
      toast({ title: 'Preview failed', description: err?.message || 'Unexpected error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => router.push('/admin/departments')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Forms</h1>
            <p className="text-muted-foreground">Pick a department, manage multiple forms, then open builder for edit or new.</p>
          </div>
        </div>

        <Card className="p-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-[280px_1fr] md:items-end">
            <div className="space-y-1">
              <label className="text-xs font-medium">Department</label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {(departments || []).map((d: any) => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-start md:justify-end">
              <Button onClick={openBuilderForNew} className="rounded-full" disabled={!departmentId}>
                <Plus className="h-4 w-4 mr-2" /> Add New Form
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Forms for {selectedDepartmentName}</h2>
            <span className="text-xs text-muted-foreground">{forms.length} form{forms.length === 1 ? '' : 's'}</span>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, idx) => (
                <Skeleton key={idx} className="h-16 w-full" />
              ))}
            </div>
          ) : forms.length === 0 ? (
            <p className="text-sm text-muted-foreground">No forms found for this department.</p>
          ) : (
            <div className="space-y-2">
              {forms.map((form) => (
                <div key={form.id} className="rounded-xl border p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{form.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={form.status === 'FINAL' ? 'secondary' : 'default'}>
                        {form.status === 'FINAL' ? 'Final' : 'Draft'}
                      </Badge>
                      {form.currentVersionNumber && <Badge variant="outline">v{form.currentVersionNumber}</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => openBuilderForEdit(form.id)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => handlePreview(form.id)}>
                      Preview
                    </Button>
                    {form.status !== 'FINAL' && (
                      <Button
                        size="sm"
                        className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleFinalize(form.id)}
                        disabled={finalizingFormId === form.id}
                      >
                        {finalizingFormId === form.id ? 'Finalizing...' : 'Finalize'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
          <SheetContent side="right" className="sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{previewForm?.title || 'Form Preview'}</SheetTitle>
              <SheetDescription>{previewForm?.description || 'Read-only form preview'}</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-6">
              <ManageFormPreview form={previewForm} />
            </div>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  )
}

function ManageFormPreview({ form }: { form: BackendFormPreview | null }) {
  const [values, setValues] = useState<Record<string, any>>({})

  if (!form) return <p className="text-sm text-muted-foreground">No preview loaded.</p>

  const ordered = [
    ...(form.fields || []).map((f) => ({ ...f, itemType: 'field' as const })),
    ...(form.sections || []).map((s) => ({ ...s, itemType: 'section' as const })),
  ].sort((a, b) => (a.order || 0) - (b.order || 0))

  const getFieldMetadata = (field: FormField) => {
    const parts: string[] = [
      `Type: ${field.type}`,
      `Required: ${field.required ? 'yes' : 'no'}`,
    ]
    if (field.placeholder) parts.push(`Placeholder: ${field.placeholder}`)
    if (field.options?.length) parts.push(`Options: ${field.options.join(', ')}`)
    if (field.tableConfig) {
      parts.push(`Table: ${field.tableConfig.rows}x${field.tableConfig.columns} (${field.tableConfig.mode})`)
      parts.push(`Headers: ${field.tableConfig.headerPlacement}`)
    }
    if (field.conditionalRendering) {
      const c = field.conditionalRendering
      parts.push(`Condition: ${c.condition} on ${c.dependsOn}${c.value ? ` = ${c.value}` : ''}`)
    }
    return parts.join(' | ')
  }

  const renderFieldControl = (field: FormField) => {
    const value = values[field.id]
    switch (field.type) {
      case 'text':
        return <Input value={value || ''} placeholder={field.placeholder || ''} onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))} />
      case 'email':
        return <Input type="email" value={value || ''} placeholder={field.placeholder || ''} onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))} />
      case 'number':
        return <Input type="number" value={value || ''} placeholder={field.placeholder || ''} onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))} />
      case 'date':
        return <Input type="date" value={value || ''} onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))} />
      case 'textarea':
      case 'diagnosticRecord':
      case 'medicationLongForm':
      case 'medicationMiniForm':
        return <Textarea rows={3} value={value || ''} placeholder={field.placeholder || ''} onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))} />
      case 'select':
        return (
          <Select value={value || ''} onValueChange={(v) => setValues((prev) => ({ ...prev, [field.id]: v }))}>
            <SelectTrigger>
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
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={field.id}
                  checked={value === opt}
                  onChange={() => setValues((prev) => ({ ...prev, [field.id]: opt }))}
                />
                {opt}
              </label>
            ))}
          </div>
        )
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={Boolean(value)}
              onCheckedChange={(checked) => setValues((prev) => ({ ...prev, [field.id]: Boolean(checked) }))}
            />
            <span className="text-sm">{field.placeholder || 'Checked'}</span>
          </div>
        )
      case 'table': {
        const rows = field.tableConfig?.rows || 3
        const columns = field.tableConfig?.columns || 3
        return (
          <div className="overflow-auto border rounded-md">
            <table className="min-w-full border-collapse text-sm">
              <tbody>
                {Array.from({ length: rows }).map((_, rowIdx) => (
                  <tr key={`${field.id}_r_${rowIdx}`}>
                    {Array.from({ length: columns }).map((_, colIdx) => {
                      const key = `${field.id}_r${rowIdx}_c${colIdx}`
                      return (
                        <td key={key} className="border p-1 min-w-[80px]">
                          <Input
                            value={values[key] || ''}
                            onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      case 'actionListener':
        return (
          <Button disabled className="w-full gap-2" variant="outline">
            <Plus className="h-4 w-4" />
            Add Action or Consumable (Preview - Disabled)
          </Button>
        )
      default:
        return <Input value={value || ''} placeholder={field.placeholder || ''} onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))} />
    }
  }

  const renderField = (field: FormField) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="rounded-lg border p-3 space-y-2 hover:border-blue-400 transition-colors">
          {!field.hideLabel && (
            <label className={`text-sm font-medium ${field.boldLabel ? 'font-bold' : ''} ${field.italicLabel ? 'italic' : ''} ${field.underlineLabel ? 'underline' : ''} ${field.centerLabel ? 'text-center block' : ''}`}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
          )}
          {renderFieldControl(field)}
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-md text-xs">
        <p>{getFieldMetadata(field)}</p>
      </TooltipContent>
    </Tooltip>
  )

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={form.status === 'FINAL' ? 'secondary' : 'default'}>{form.status === 'FINAL' ? 'Final' : 'Draft'}</Badge>
          {form.currentVersionNumber && <Badge variant="outline">Version {form.currentVersionNumber}</Badge>}
        </div>

        {ordered.length === 0 ? (
          <p className="text-sm text-muted-foreground">This form has no fields yet.</p>
        ) : (
          ordered.map((item) => {
            if (item.itemType === 'field') {
              const field = item as FormField & { itemType: 'field' }
              return <div key={field.id}>{renderField(field)}</div>
            }

            const section = item as FormSection & { itemType: 'section' }
            return (
              <div key={section.id} className="rounded-lg border p-3 space-y-3">
                <p className="text-sm font-semibold">{section.title}</p>
                {(section.fields || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No fields in this section.</p>
                ) : (
                  <div className={`grid gap-3 ${section.columns === 1 ? 'grid-cols-1' : section.columns === 2 ? 'grid-cols-2' : section.columns === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                    {(section.fields || []).map((field) => (
                      <div key={field.id}>{renderField(field)}</div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </TooltipProvider>
  )
}
