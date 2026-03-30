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

  // Form field creation
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [newFieldType, setNewFieldType] = useState<FormField['type']>('text')
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('')
  const [newFieldRequired, setNewFieldRequired] = useState(true)
  const [newFieldOptions, setNewFieldOptions] = useState('')

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
    if (!newFieldLabel.trim()) {
      toast({ title: 'Field label required' })
      return
    }

    const field: FormField = {
      id: `field_${Date.now()}`,
      label: newFieldLabel,
      type: newFieldType,
      placeholder: newFieldPlaceholder || undefined,
      required: newFieldRequired,
      options: newFieldOptions ? newFieldOptions.split('\n').filter(o => o.trim()) : undefined,
      order: fields.length,
    }

    setFields([...fields, field])
    setNewFieldLabel('')
    setNewFieldPlaceholder('')
    setNewFieldOptions('')
    setNewFieldRequired(true)
    toast({ title: 'Field added' })
  }

  const removeField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId).map((f, idx) => ({ ...f, order: idx })))
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

            {/* Field creation */}
            <div className="space-y-3 border-b pb-4">
              <h3 className="font-semibold text-sm">Add Field</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Input
                    placeholder="Field label"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addField()
                    }}
                  />
                </div>
                <div>
                  <Select value={newFieldType} onValueChange={(v) => setNewFieldType(v as any)}>
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
                      <SelectItem value="diagnosticRecord">Diagnostic Record</SelectItem>
                      <SelectItem value="medicationLongForm">Medication Long Form</SelectItem>
                      <SelectItem value="medicationMiniForm">Medication Mini Form</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newFieldRequired}
                      onChange={(e) => setNewFieldRequired(e.target.checked)}
                    />
                    <span className="text-xs">Required</span>
                  </label>
                </div>
                <div className="col-span-2">
                  <Input
                    placeholder="Placeholder text"
                    value={newFieldPlaceholder}
                    onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                  />
                </div>
                {(newFieldType === 'select' || newFieldType === 'radio') && (
                  <div className="col-span-2">
                    <textarea
                      placeholder="Options (one per line)"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      rows={3}
                      value={newFieldOptions}
                      onChange={(e) => setNewFieldOptions(e.target.value)}
                    />
                  </div>
                )}
                <Button onClick={addField} className="col-span-2 rounded-full" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Field
                </Button>
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
                <select className="w-full px-3 py-2 border rounded-md text-sm" disabled>
                  <option value="">{field.placeholder || 'Select...'}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
              {field.type === 'radio' && (
                <div className="space-y-2">
                  {field.options?.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm">
                      <input type="radio" disabled />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {field.type === 'checkbox' && (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" disabled />
                  {field.placeholder || 'Option'}
                </label>
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
