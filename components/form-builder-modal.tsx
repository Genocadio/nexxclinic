"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Eye, X } from 'lucide-react'
import { FormField, DepartmentForm, saveDepartmentForm, getDepartmentForm } from '@/lib/form-storage'
import { useToast } from '@/hooks/use-toast'

interface FormBuilderModalProps {
  isOpen: boolean
  departmentId: string | number
  departmentName: string
  onClose: () => void
}

export function FormBuilderModal({ isOpen, departmentId, departmentName, onClose }: FormBuilderModalProps) {
  const { toast } = useToast()
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [fields, setFields] = useState<FormField[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  // Field editor (two-step flow)
  const [fieldEditorVisible, setFieldEditorVisible] = useState(false)
  const [fieldEditorStep, setFieldEditorStep] = useState<'nameType' | 'config'>('nameType')
  const [isEditingFieldId, setIsEditingFieldId] = useState<string | null>(null)
  const [fieldDraft, setFieldDraft] = useState<Partial<FormField>>({ type: 'text', required: true })

  // Load existing form on mount
  React.useEffect(() => {
    if (isOpen) {
      const existing = getDepartmentForm(departmentId)
      if (existing) {
        setFormTitle(existing.title)
        setFormDescription(existing.description || '')
        setFields(existing.fields)
      } else {
        setFormTitle('')
        setFormDescription('')
        setFields([])
      }
    }
  }, [isOpen, departmentId])

  const addField = () => {
    if (!fieldDraft.label || !String(fieldDraft.label).trim()) {
      toast({ title: 'Field label required' })
      return
    }

    const field: FormField = {
      id: isEditingFieldId || `field_${Date.now()}`,
      label: String(fieldDraft.label),
      type: (fieldDraft.type as FormField['type']) || 'text',
      placeholder: fieldDraft.placeholder || undefined,
      required: fieldDraft.required ?? true,
      options: Array.isArray(fieldDraft.options) ? fieldDraft.options : (fieldDraft.options ? String(fieldDraft.options).split('\n').filter(o => o.trim()) : undefined),
      order: isEditingFieldId ? (fields.findIndex(f => f.id === isEditingFieldId) ?? fields.length - 1) : fields.length,
    }

    if (isEditingFieldId) {
      setFields(fields.map((f) => f.id === isEditingFieldId ? { ...field, order: f.order } : f))
      toast({ title: 'Field updated' })
    } else {
      setFields([...fields, field])
      toast({ title: 'Field added' })
    }

    // reset editor
    setFieldEditorVisible(false)
    setFieldEditorStep('nameType')
    setIsEditingFieldId(null)
    setFieldDraft({ type: 'text', required: true })
  }

  const removeField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId).map((f, idx) => ({ ...f, order: idx })))
  }

  const startNewField = () => {
    setIsEditingFieldId(null)
    setFieldDraft({ type: 'text', required: true })
    setFieldEditorStep('nameType')
    setFieldEditorVisible(true)
  }

  const startEditField = (field: FormField) => {
    setIsEditingFieldId(field.id)
    setFieldDraft({ ...field })
    setFieldEditorStep('config')
    setFieldEditorVisible(true)
  }

  const handleSaveForm = async () => {
    if (!formTitle.trim()) {
      toast({ title: 'Form title required' })
      return
    }

    try {
      setSaving(true)
      const form = saveDepartmentForm(departmentId, {
        title: formTitle,
        description: formDescription,
        fields,
        departmentId,
      })
      toast({ title: 'Form saved', description: `Form for ${departmentName} saved successfully` })
      onClose()
    } catch (err: any) {
      toast({ title: 'Save failed', description: err?.message })
    } finally {
      setSaving(false)
    }
  }

  const handleClearForm = () => {
    if (!confirm('Clear all fields?')) return
    setFields([])
    toast({ title: 'Form cleared' })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-3xl shadow-2xl p-2 sm:p-4">
        <DialogHeader>
          <DialogTitle>Form Builder - {departmentName}</DialogTitle>
          <DialogDescription>Create custom forms for visit submissions</DialogDescription>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-6">
            {/* Form metadata */}
            <div className="space-y-3 border-b pb-4">
              <div className="space-y-1">
                <Label htmlFor="formTitle" className="text-sm font-medium">Form Title</Label>
                <Input
                  id="formTitle"
                  placeholder="e.g., Patient History Form"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="formDesc" className="text-sm font-medium">Description (optional)</Label>
                <Input
                  id="formDesc"
                  placeholder="Brief description of this form"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Field creation / editor (two-step) */}
            <div className="space-y-3 border-b pb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Fields</h3>
                <Button size="sm" onClick={startNewField} className="rounded-full">
                  <Plus className="h-4 w-4 mr-2" /> New Field
                </Button>
              </div>

              {fieldEditorVisible && (
                <div className="mt-3 bg-white dark:bg-slate-800 p-3 rounded-lg border">
                  {fieldEditorStep === 'nameType' ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Field Label</Label>
                        <Input value={String(fieldDraft.label || '')} onChange={(e) => setFieldDraft(d => ({ ...d, label: e.target.value }))} />
                      </div>
                      <div>
                        <Label className="text-xs">Field Type</Label>
                        <Select value={String(fieldDraft.type || 'text')} onValueChange={(v) => setFieldDraft(d => ({ ...d, type: v as any }))}>
                          <SelectTrigger className="w-full min-w-0 text-left truncate flex items-center justify-between">
                            <SelectValue placeholder="Select type" className="truncate" />
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
                            <SelectItem value="diagnosticRecord">Diagnostic Record</SelectItem>
                            <SelectItem value="medicationLongForm">Medication Long Form</SelectItem>
                            <SelectItem value="medicationMiniForm">Medication Mini Form</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => { setFieldEditorVisible(false); setFieldEditorStep('nameType') }} >Cancel</Button>
                        <Button onClick={() => setFieldEditorStep('config')} className="ml-auto" disabled={!fieldDraft.label || !String(fieldDraft.label).trim()}>Next</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Type</Label>
                        <Select value={String(fieldDraft.type || 'text')} onValueChange={(v) => setFieldDraft(d => ({ ...d, type: v as any }))}>
                          <SelectTrigger className="w-full min-w-0 text-left truncate flex items-center justify-between">
                            <SelectValue placeholder="Select type" className="truncate" />
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
                            <SelectItem value="diagnosticRecord">Diagnostic Record</SelectItem>
                            <SelectItem value="medicationLongForm">Medication Long Form</SelectItem>
                            <SelectItem value="medicationMiniForm">Medication Mini Form</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Render type-specific config inputs */}
                      {(fieldDraft.type === 'text' || fieldDraft.type === 'email' || fieldDraft.type === 'number' || fieldDraft.type === 'textarea' || fieldDraft.type === 'date') && (
                        <div>
                          <Label className="text-xs">Placeholder</Label>
                          <Input value={String(fieldDraft.placeholder || '')} onChange={(e) => setFieldDraft(d => ({ ...d, placeholder: e.target.value }))} />
                          <label className="flex items-center gap-2 mt-2">
                            <input type="checkbox" checked={fieldDraft.required ?? true} onChange={(e) => setFieldDraft(d => ({ ...d, required: e.target.checked }))} />
                            <span className="text-xs">Required</span>
                          </label>
                        </div>
                      )}

                      {(fieldDraft.type === 'select' || fieldDraft.type === 'radio' || fieldDraft.type === 'checkbox') && (
                        <div>
                          <Label className="text-xs">Options (one per line)</Label>
                          <textarea className="w-full px-3 py-2 border rounded-md text-sm" rows={4} value={Array.isArray(fieldDraft.options) ? (fieldDraft.options as string[]).join('\n') : String(fieldDraft.options || '')} onChange={(e) => setFieldDraft(d => ({ ...d, options: e.target.value }))} />
                          <label className="flex items-center gap-2 mt-2">
                            <input type="checkbox" checked={fieldDraft.required ?? true} onChange={(e) => setFieldDraft(d => ({ ...d, required: e.target.checked }))} />
                            <span className="text-xs">Required</span>
                          </label>
                        </div>
                      )}

                      {fieldDraft.type === 'diagnosticRecord' && (
                        <div>
                          <Label className="text-xs">Diagnostic Placeholder</Label>
                          <Input value={String(fieldDraft.placeholder || '')} onChange={(e) => setFieldDraft(d => ({ ...d, placeholder: e.target.value }))} />
                        </div>
                      )}

                      {(fieldDraft.type === 'medicationLongForm' || fieldDraft.type === 'medicationMiniForm') && (
                        <div>
                          <Label className="text-xs">Medication Placeholder</Label>
                          <Input value={String(fieldDraft.placeholder || '')} onChange={(e) => setFieldDraft(d => ({ ...d, placeholder: e.target.value }))} />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setFieldEditorStep('nameType')}>Back</Button>
                        <Button onClick={addField} className="ml-auto">{isEditingFieldId ? 'Save' : 'Add Field'}</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Current fields list */}
              <div className="space-y-2 bg-slate-50 dark:bg-slate-900/30 rounded-lg p-3 max-h-[200px] overflow-y-auto mt-3">
                {fields.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No fields yet. Add one above.</p>
                ) : (
                  fields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded border text-xs">
                      <div className="flex-1">
                        <span className="font-medium">{field.label}</span>
                        <span className="text-muted-foreground ml-2">({field.type})</span>
                        {field.required && <span className="text-red-500 ml-2">*</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => startEditField(field)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeField(field.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Current fields */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Fields ({fields.length})</h3>
                {fields.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleClearForm}>Clear All</Button>
                )}
              </div>
              <div className="space-y-2 bg-slate-50 dark:bg-slate-900/30 rounded-lg p-3 max-h-[200px] overflow-y-auto">
                {fields.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No fields yet. Add one above.</p>
                ) : (
                  fields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded border text-xs">
                      <div className="flex-1">
                        <span className="font-medium">{field.label}</span>
                        <span className="text-muted-foreground ml-2">({field.type})</span>
                        {field.required && <span className="text-red-500 ml-2">*</span>}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeField(field.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPreview(true)} className="rounded-full">
                <Eye className="h-4 w-4 mr-2" /> Preview
              </Button>
              <Button variant="outline" onClick={onClose} className="rounded-full">Cancel</Button>
              <Button
                onClick={handleSaveForm}
                disabled={saving || !formTitle.trim()}
                className="rounded-full ml-auto"
              >
                Save Form
              </Button>
            </div>
          </div>
        ) : (
          <FormPreview
            title={formTitle}
            description={formDescription}
            fields={fields}
            onBack={() => setShowPreview(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

interface FormPreviewProps {
  title: string
  description?: string
  fields: FormField[]
  onBack: () => void
}

function FormPreview({ title, description, fields, onBack }: FormPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{title || 'Untitled Form'}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="space-y-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg p-4">
        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No fields to preview</p>
        ) : (
          fields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'text' && (
                <input type="text" placeholder={field.placeholder} className="w-full px-3 py-2 border rounded-md text-sm" disabled />
              )}
              {field.type === 'email' && (
                <input type="email" placeholder={field.placeholder} className="w-full px-3 py-2 border rounded-md text-sm" disabled />
              )}
              {field.type === 'number' && (
                <input type="number" placeholder={field.placeholder} className="w-full px-3 py-2 border rounded-md text-sm" disabled />
              )}
              {field.type === 'date' && (
                <input type="date" className="w-full px-3 py-2 border rounded-md text-sm" disabled />
              )}
              {field.type === 'textarea' && (
                <textarea placeholder={field.placeholder} className="w-full px-3 py-2 border rounded-md text-sm" rows={3} disabled />
              )}
              {field.type === 'select' && (
                <select className="w-full px-3 py-2 border rounded-md text-sm truncate" disabled>
                  <option value="">{field.placeholder || 'Select...'}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt} className="truncate">{opt}</option>
                  ))}
                </select>
              )}
              {field.type === 'radio' && (
                <div className="space-y-2">
                  {field.options?.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm w-full min-w-0">
                      <input type="radio" disabled className="shrink-0" />
                      <span className="truncate break-words min-w-0 flex-1" title={opt}>{opt}</span>
                    </label>
                  ))}
                </div>
              )}
              {field.type === 'checkbox' && (
                field.options && field.options.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                    {field.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-sm rounded-md border p-2 bg-white dark:bg-slate-800 w-full min-w-0">
                        <input type="checkbox" disabled className="shrink-0" />
                        <span className="truncate break-words min-w-0 flex-1" title={opt}>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <label className="flex items-center gap-2 text-sm w-full min-w-0">
                    <input type="checkbox" disabled className="shrink-0" />
                    <span className="truncate break-words min-w-0 flex-1" title={field.placeholder || 'Option'}>{field.placeholder || 'Option'}</span>
                  </label>
                )
              )}
              {field.type === 'diagnosticRecord' && (
                <div className="space-y-2 border rounded-md p-3">
                  <input type="text" placeholder={field.placeholder || 'Enter diagnostic'} className="w-full px-3 py-2 border rounded-md text-sm" disabled />
                  <textarea placeholder="Optional description" className="w-full px-3 py-2 border rounded-md text-sm" rows={2} disabled />
                  <Button size="sm" className="rounded-full" disabled>Add Diagnostic</Button>
                </div>
              )}
              {field.type === 'medicationLongForm' && (
                <div className="space-y-2 border rounded-md p-3">
                  <input type="text" placeholder={field.placeholder || 'Medication name'} className="w-full px-3 py-2 border rounded-md text-sm" disabled />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Frequency" className="w-full px-3 py-2 border rounded-md text-sm" disabled />
                    <input type="text" placeholder="Amount" className="w-full px-3 py-2 border rounded-md text-sm" disabled />
                  </div>
                  <textarea placeholder="Additional notes" className="w-full px-3 py-2 border rounded-md text-sm" rows={2} disabled />
                  <Button size="sm" className="rounded-full" disabled>Add Medication</Button>
                </div>
              )}
              {field.type === 'medicationMiniForm' && (
                <div className="space-y-2 border rounded-md p-3">
                  <input type="text" placeholder={field.placeholder || 'Medication name'} className="w-full px-3 py-2 border rounded-md text-sm" disabled />
                  <textarea placeholder="Extra notes" className="w-full px-3 py-2 border rounded-md text-sm" rows={2} disabled />
                  <Button size="sm" className="rounded-full" disabled>Add Medication</Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onBack} className="rounded-full">Back</Button>
      </div>
    </div>
  )
}
