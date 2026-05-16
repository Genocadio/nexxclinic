"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import FormActionsDisplay from "@/components/form-actions-display"
import type { FormAction, FormField } from "@/lib/form-storage"

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

interface FormFieldRendererProps {
  field: FormField
  currentValue: any
  formAnswers: Record<string, any>
  setFormAnswers: (fn: (prev: Record<string, any>) => Record<string, any>) => void
  tableShapes: Record<string, { rows: number; columns: number }>
  setTableShapes: (fn: (prev: Record<string, any>) => Record<string, any>) => void
  diagnosticDrafts: Record<string, { diagnosis: string; description: string }>
  setDiagnosticDrafts: (fn: (prev: Record<string, any>) => Record<string, any>) => void
  medicationLongDrafts: Record<string, { name: string; frequency: string; amount: string; days: string; notes: string }>
  setMedicationLongDrafts: (fn: (prev: Record<string, any>) => Record<string, any>) => void
  medicationMiniDrafts: Record<string, { name: string; notes: string }>
  setMedicationMiniDrafts: (fn: (prev: Record<string, any>) => Record<string, any>) => void
  onActionListenerClick?: (fieldId: string) => void
  fieldActions?: FormAction[]
  onUpdateQuantity?: (actionId: string, quantity: number) => void
  onRemoveAction?: (actionId: string) => void
  onRestoreAction?: (actionId: string) => void
  visitId?: string
  departmentId?: string
}

export function FormFieldRenderer({
  field,
  currentValue,
  formAnswers,
  setFormAnswers,
  tableShapes,
  setTableShapes,
  diagnosticDrafts,
  setDiagnosticDrafts,
  medicationLongDrafts,
  setMedicationLongDrafts,
  medicationMiniDrafts,
  setMedicationMiniDrafts,
  onActionListenerClick,
  fieldActions = [],
  onUpdateQuantity,
  onRemoveAction,
  onRestoreAction,
  visitId,
  departmentId,
}: FormFieldRendererProps) {
  const contrastInputClass = "border-border/80 bg-background/80 dark:bg-slate-950/60 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:border-primary/70"
  const ensureHeaders = (count: number, source: string[] | undefined, prefix: string) =>
    Array.from({ length: count }).map((_, idx) => source?.[idx] || `${prefix} ${idx + 1}`)

  if (field.type === 'text') {
    return <Input className={contrastInputClass} value={currentValue || ''} placeholder={field.placeholder || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))} />
  }
  if (field.type === 'email') {
    return <Input className={contrastInputClass} type="email" value={currentValue || ''} placeholder={field.placeholder || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))} />
  }
  if (field.type === 'number') {
    return <Input className={contrastInputClass} type="number" value={currentValue || ''} placeholder={field.placeholder || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))} />
  }
  if (field.type === 'date') {
    return <Input className={contrastInputClass} type="date" value={currentValue || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))} />
  }
  if (field.type === 'textarea') {
    return <Textarea className={contrastInputClass} rows={3} value={currentValue || ''} placeholder={field.placeholder || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))} />
  }
  if (field.type === 'select') {
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
  }
  if (field.type === 'radio') {
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
  }
  if (field.type === 'checkbox') {
    return (
      <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background/60 px-3 py-2">
        <Checkbox checked={Boolean(currentValue)} onCheckedChange={(checked) => setFormAnswers((prev) => ({ ...prev, [field.id]: Boolean(checked) }))} />
        <span className="text-sm">{field.placeholder || 'Checked'}</span>
      </div>
    )
  }
  if (field.type === 'table') {
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
  if (field.type === 'diagnosticRecord') {
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
  if (field.type === 'medicationLongForm') {
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
  if (field.type === 'medicationMiniForm') {
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
  if (field.type === 'actionListener') {
    const shouldCenterActionButton = Boolean(field.centerLabel) || /add\s+action\s+or\s+consumable\s+listener/i.test(field.label || '')
    const actionButtonTextStyle = `${field.boldLabel ? 'font-bold' : ''} ${field.italicLabel ? 'italic' : ''} ${field.underlineLabel ? 'underline' : ''}`
    return (
      <div className="space-y-3">
        <div className={shouldCenterActionButton ? 'flex justify-center' : 'flex'}>
          <Button 
            onClick={() => onActionListenerClick?.(field.id)}
            className={`inline-flex h-9 px-4 rounded-xl gap-2 border-border/70 bg-card/70 hover:bg-card shadow-sm ${actionButtonTextStyle}`}
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
        {fieldActions && fieldActions.length > 0 && (
          <FormActionsDisplay
            items={fieldActions}
            hideLabel={true}
            visitId={visitId}
            departmentId={departmentId}
            onUpdateQuantity={onUpdateQuantity ? (id, qty) => onUpdateQuantity(id, qty) : undefined}
            onRemove={onRemoveAction ? (id) => onRemoveAction(id) : undefined}
            onRestore={onRestoreAction ? (id) => onRestoreAction(id) : undefined}
          />
        )}
      </div>
    )
  }

  return <Input className={contrastInputClass} value={currentValue || ''} placeholder={field.placeholder || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))} />
}
