"use client"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import FormActionsDisplay from "@/components/form-actions-display"
import type { FormAction, FormField } from "@/lib/form-storage"
import { useAddDiagnosisToVisitDepartment, useAddMedicationToVisitDepartment } from "@/hooks/visits"

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

interface LabRecordEntryValue {
  value?: string
  unit?: string
  result?: string
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
  visitDepartmentId?: string
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
  visitDepartmentId,
}: FormFieldRendererProps) {
  const contrastInputClass = "border-border/80 bg-background/80 dark:bg-slate-950/60 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:border-primary/70"
  const ensureHeaders = (count: number, source: string[] | undefined, prefix: string) =>
    Array.from({ length: count }).map((_, idx) => source?.[idx] || `${prefix} ${idx + 1}`)
  const createDefaultLabRows = (layout: 'valueUnit' | 'result') =>
    Array.from({ length: 3 }, (_, idx) => ({
      id: `lab_row_${idx + 1}`,
      name: `Row ${idx + 1}`,
      unitMode: layout === 'valueUnit' ? 'dropdown' : 'none',
      unitOptions: layout === 'valueUnit' ? ['mg/dL', 'mmol/L'] : [],
      defaultUnit: layout === 'valueUnit' ? 'mg/dL' : undefined,
      resultOptions: layout === 'result' ? ['+ve', '-ve'] : [],
    }))
  const sanitizeLongMedicationNote = (raw: string | undefined) => {
    const text = String(raw || '').trim()
    if (!text) return undefined
    const extracted = (text.match(/Extra notes:\s*(.+)$/i)?.[1] || '').trim()
    if (extracted) return extracted
    if (/^Frequency:\s*/i.test(text)) return undefined
    return text
  }

  const { addDiagnosis } = useAddDiagnosisToVisitDepartment()
  const { addMedication } = useAddMedicationToVisitDepartment()

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
        <SelectTrigger className={cn("w-full min-w-0 text-left truncate flex items-center justify-between", contrastInputClass)}>
          <SelectValue placeholder={field.placeholder || 'Select option'} className="truncate" />
        </SelectTrigger>
        <SelectContent>
          {(field.options || []).map((opt) => (
            <SelectItem key={opt} value={opt} className="break-words max-w-full">
              <span className="truncate break-words w-full" title={opt}>{opt}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
  if (field.type === 'radio') {
    return (
      <div className="space-y-2">
        {(field.options || []).map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm rounded-md border border-border/70 bg-background/60 px-3 py-2 cursor-pointer select-none hover:bg-accent/10 transition-colors w-full min-w-0">
            <input type="radio" name={field.id} checked={currentValue === opt} onChange={() => setFormAnswers((prev) => ({ ...prev, [field.id]: opt }))} className="shrink-0" />
            <span className="truncate break-words min-w-0 flex-1" title={opt}>{opt}</span>
          </label>
        ))}
      </div>
    )
  }
  if (field.type === 'checkbox') {
    if (field.options && field.options.length > 0) {
      const selectedValues: string[] = Array.isArray(currentValue)
        ? currentValue
        : typeof currentValue === 'string'
        ? currentValue.split(',').map((v) => v.trim()).filter(Boolean)
        : currentValue
        ? [String(currentValue)]
        : []

      const handleToggle = (opt: string, checked: boolean) => {
        const next = checked ? [...selectedValues, opt] : selectedValues.filter((v) => v !== opt)
        setFormAnswers((prev) => ({ ...prev, [field.id]: next }))
      }

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
          {field.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm rounded-md border border-border/70 bg-background/60 px-3 py-2 cursor-pointer select-none hover:bg-accent/10 transition-colors w-full min-w-0">
              <Checkbox checked={selectedValues.includes(opt)} onCheckedChange={(checked) => handleToggle(opt, Boolean(checked))} />
              <span className="truncate break-words min-w-0 flex-1" title={opt}>{opt}</span>
            </label>
          ))}
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background/60 px-3 py-2 cursor-pointer select-none w-full min-w-0">
        <Checkbox checked={Boolean(currentValue)} onCheckedChange={(checked) => setFormAnswers((prev) => ({ ...prev, [field.id]: Boolean(checked) }))} />
        <span className="text-sm truncate break-words min-w-0 flex-1" title={field.placeholder || 'Checked'}>{field.placeholder || 'Checked'}</span>
      </div>
    )
  }
  if (field.type === 'table') {
    const cfg = field.tableConfig || { mode: 'STATIC' as const, rows: 3, columns: 3, headerPlacement: 'none' as const }
    const shape = tableShapes[field.id] || { rows: cfg.rows, columns: cfg.columns }
    const rows = Math.max(1, shape.rows)
    const columns = Math.max(1, shape.columns)
    const headerPlacementHasSide = (placement: string, side: 'top' | 'left' | 'right') => {
      if (!placement || placement === 'none') return false
      if (placement === 'both') return side === 'top' || side === 'left'
      return placement.split('-').includes(side)
    }
    const hasLeft = headerPlacementHasSide(cfg.headerPlacement, 'left')
    const hasRight = headerPlacementHasSide(cfg.headerPlacement, 'right')
    const hasTop = headerPlacementHasSide(cfg.headerPlacement, 'top')
    const columnHeaders = hasTop ? ensureHeaders(columns, cfg.columnHeaders, 'Column') : []
    const rowHeaders = (hasLeft || hasRight) ? ensureHeaders(rows, cfg.rowHeaders, 'Row') : []

    const updateShape = (nextRows: number, nextCols: number) => {
      setTableShapes((prev) => ({ ...prev, [field.id]: { rows: Math.max(1, nextRows), columns: Math.max(1, nextCols) } }))
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{rows} x {columns}</span>
          {cfg.mode === 'DYNAMIC' && <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => updateShape(rows + 1, columns)}>+ Row</Button>}
          {cfg.mode === 'DYNAMIC' && <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => updateShape(rows, columns + 1)}>+ Col</Button>}
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
                  {hasLeft && <th className="border border-border/60 bg-muted/30 px-2 py-1 text-left font-medium whitespace-nowrap">{rowHeaders[rowIdx]}</th>}
                  {Array.from({ length: columns }).map((_, colIdx) => {
                    const cellKey = `${field.id}_r${rowIdx}_c${colIdx}`
                    return (
                      <td key={cellKey} className="border border-border/60 p-1 min-w-[90px]">
                        <Input className={contrastInputClass} value={formAnswers[cellKey] || ''} onChange={(e) => setFormAnswers((prev) => ({ ...prev, [cellKey]: e.target.value }))} />
                      </td>
                    )
                  })}
                  {hasRight && <th className="border border-border/60 bg-muted/30 px-2 py-1 text-left font-medium whitespace-nowrap">{rowHeaders[rowIdx]}</th>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  if (field.type === 'labRecord') {
    const cfg = field.labRecordConfig || { layout: 'valueUnit' as const, rows: createDefaultLabRows('valueUnit') }
    const rows = cfg.rows.length > 0 ? cfg.rows : createDefaultLabRows(cfg.layout)
    const recordValue = (currentValue && typeof currentValue === 'object' ? currentValue : { rows: {} }) as { rows?: Record<string, LabRecordEntryValue> }

    const updateLabRecordRow = (rowId: string, patch: LabRecordEntryValue) => {
      const nextRows = {
        ...(recordValue.rows || {}),
        [rowId]: {
          ...(recordValue.rows?.[rowId] || {}),
          ...patch,
        },
      }
      setFormAnswers((prev) => ({
        ...prev,
        [field.id]: { rows: nextRows },
      }))
    }

    const headerGridClass = cfg.layout === 'valueUnit' ? 'grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.9fr)]' : 'grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]'
    return (
      <div className="space-y-3 border rounded-lg p-3 bg-card/40">
        <div className="overflow-hidden rounded-md border bg-background">
          <div className={`grid ${headerGridClass} gap-0 border-b bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground`}>
            <div className="px-3 py-2">Name</div>
            {cfg.layout === 'valueUnit' ? <div className="px-3 py-2">Value</div> : <div className="px-3 py-2">Result</div>}
            {cfg.layout === 'valueUnit' ? <div className="px-3 py-2">Unit</div> : null}
          </div>
          <div className="divide-y">
            {rows.map((row) => {
              const rowValue = recordValue.rows?.[row.id] || {}
              const unitOptions = (row.unitOptions || []).length > 0 ? row.unitOptions! : ['mg/dL', 'mmol/L']
              const resultOptions = (row.resultOptions || []).length > 0 ? row.resultOptions! : ['+ve', '-ve']

              return (
                <div key={row.id} className={`grid ${headerGridClass} items-center gap-2 px-3 py-2`}>
                  <div className="text-sm font-medium break-words">{row.name}</div>
                  {cfg.layout === 'valueUnit' ? (
                    <Input
                      className={contrastInputClass}
                      value={rowValue.value || ''}
                      placeholder="Enter value"
                      onChange={(e) => updateLabRecordRow(row.id, { value: e.target.value })}
                    />
                  ) : (
                    <Select value={rowValue.result || ''} onValueChange={(v) => updateLabRecordRow(row.id, { result: v })}>
                      <SelectTrigger className={contrastInputClass}>
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent>
                        {resultOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {cfg.layout === 'valueUnit' ? (
                    row.unitMode === 'none' ? (
                      <div className="text-xs text-muted-foreground">None</div>
                    ) : (
                      <Select
                        value={rowValue.unit || row.defaultUnit || ''}
                        onValueChange={(v) => updateLabRecordRow(row.id, { unit: v })}
                      >
                        <SelectTrigger className={contrastInputClass}>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {unitOptions.map((unit) => (
                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
  if (field.type === 'diagnosticRecord') {
    const records: DiagnosticRecordEntry[] = Array.isArray(currentValue) ? currentValue : []
    const draft = diagnosticDrafts[field.id] || { diagnosis: '', description: '' }

    const addRecord = async () => {
      const diagnosisName = draft.diagnosis.trim()
      const notes = draft.description.trim()
      if (!diagnosisName || !visitDepartmentId) return

      // Do not send notes as ICD-11 code to backend — leave icd11Code undefined
      const result = await addDiagnosis(visitDepartmentId, diagnosisName)
      if (result?.status !== 'SUCCESS') {
        console.error('[Consultation] Failed to add diagnosis', result)
        return
      }

      const addedDiagnosis = Array.isArray(result?.data?.diagnostics)
        ? result.data.diagnostics[result.data.diagnostics.length - 1]
        : undefined

      const nextRecord: DiagnosticRecordEntry = {
        id: String(addedDiagnosis?.id || `diag_${Date.now()}`),
        diagnosis: String(addedDiagnosis?.diagnosisName || diagnosisName),
        // store the UI notes locally; do not treat this as an ICD-11 code
        description: notes || undefined,
      }

      setFormAnswers((prev) => {
        const existing = Array.isArray(prev[field.id]) ? prev[field.id] : []
        if (existing.some((r: any) => String(r.id) === String(nextRecord.id))) return prev
        return { ...prev, [field.id]: [...existing, nextRecord] }
      })
      setDiagnosticDrafts((prev) => ({ ...prev, [field.id]: { diagnosis: '', description: '' } }))
    }

    return (
      <div className="space-y-3 border rounded-lg p-3 bg-card/40">
        <Input
          className={contrastInputClass}
          placeholder={field.placeholder || 'Enter diagnostic'}
          value={draft.diagnosis}
          onChange={(e) => setDiagnosticDrafts((prev) => ({ ...prev, [field.id]: { ...draft, diagnosis: e.target.value } }))}
        />
        <Textarea
          className={contrastInputClass}
          rows={2}
          placeholder="Extra notes"
          value={draft.description}
          onChange={(e) => setDiagnosticDrafts((prev) => ({ ...prev, [field.id]: { ...draft, description: e.target.value } }))}
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={addRecord} disabled={!draft.diagnosis.trim() || !visitDepartmentId} className="rounded-full">
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
                    {record.description && <p className="text-xs text-muted-foreground break-words">{record.description}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => setFormAnswers((prev) => ({ ...prev, [field.id]: records.filter((r) => r.id !== record.id) }))}
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

    const addMedicationRecord = async () => {
      const name = draft.name.trim()
      const frequency = draft.frequency.trim()
      const amount = draft.amount.trim()
      const days = draft.days.trim()
      const notes = draft.notes.trim()
      if (!name || !frequency || !amount || !days || !visitDepartmentId) return

      const instructions = `Frequency: ${frequency}, Amount: ${amount}, Days: ${days}${notes ? `, Extra notes: ${notes}` : ''}`
      const result = await addMedication(visitDepartmentId, name, instructions)
      if (result?.status !== 'SUCCESS') {
        console.error('[Consultation] Failed to add medication', result)
        return
      }

      const addedMedication = Array.isArray(result?.data?.medications)
        ? result.data.medications[result.data.medications.length - 1]
        : undefined

      const nextRecord: MedicationLongEntry = {
        id: String(addedMedication?.id || `med_long_${Date.now()}`),
        name: String(addedMedication?.medicationName || name),
        frequency,
        amount,
        days,
        notes: sanitizeLongMedicationNote(String(addedMedication?.instructions || '')) || notes || undefined,
      }

      setFormAnswers((prev) => {
        const existing = Array.isArray(prev[field.id]) ? prev[field.id] : []
        if (existing.some((r: any) => String(r.id) === String(nextRecord.id))) return prev
        return { ...prev, [field.id]: [...existing, nextRecord] }
      })
      setMedicationLongDrafts((prev) => ({ ...prev, [field.id]: { name: '', frequency: '', amount: '', days: '', notes: '' } }))
    }

    return (
      <div className="space-y-3 border rounded-lg p-3 bg-card/40">
        <Input
          className={contrastInputClass}
          placeholder={field.placeholder || 'Medication name'}
          value={draft.name}
          onChange={(e) => setMedicationLongDrafts((prev) => ({ ...prev, [field.id]: { ...draft, name: e.target.value } }))}
        />
        <div className="grid grid-cols-3 gap-2">
          <Input className={contrastInputClass} placeholder="Frequency" value={draft.frequency} onChange={(e) => setMedicationLongDrafts((prev) => ({ ...prev, [field.id]: { ...draft, frequency: e.target.value } }))} />
          <Input className={contrastInputClass} placeholder="Amount" value={draft.amount} onChange={(e) => setMedicationLongDrafts((prev) => ({ ...prev, [field.id]: { ...draft, amount: e.target.value } }))} />
          <Input className={contrastInputClass} placeholder="Days" value={draft.days} onChange={(e) => setMedicationLongDrafts((prev) => ({ ...prev, [field.id]: { ...draft, days: e.target.value } }))} />
        </div>
        <Textarea
          className={contrastInputClass}
          rows={2}
          placeholder="Extra notes"
          value={draft.notes}
          onChange={(e) => setMedicationLongDrafts((prev) => ({ ...prev, [field.id]: { ...draft, notes: e.target.value } }))}
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={addMedicationRecord} disabled={!draft.name.trim() || !draft.frequency.trim() || !draft.amount.trim() || !draft.days.trim() || !visitDepartmentId} className="rounded-full">
            Add Medication
          </Button>
        </div>
        {records.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            {records.map((record) => (
              <div key={record.id} className="rounded-md border px-3 py-2 bg-background">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    {(() => {
                      const displayNote = sanitizeLongMedicationNote(record.notes)
                      return (
                        <>
                    <p className="text-sm font-medium break-words">{record.name}</p>
                    <p className="text-xs text-muted-foreground break-words">Frequency: {record.frequency} | Amount: {record.amount} | Days: {record.days}</p>
                          {displayNote && <p className="text-xs text-muted-foreground break-words">{displayNote}</p>}
                        </>
                      )
                    })()}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => setFormAnswers((prev) => ({ ...prev, [field.id]: records.filter((r) => r.id !== record.id) }))}
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

    const addMedicationRecord = async () => {
      const name = draft.name.trim()
      const notes = draft.notes.trim()
      if (!name || !visitDepartmentId) return

      const instructions = notes || 'No additional notes'
      const result = await addMedication(visitDepartmentId, name, instructions)
      if (result?.status !== 'SUCCESS') {
        console.error('[Consultation] Failed to add medication', result)
        return
      }

      const addedMedication = Array.isArray(result?.data?.medications)
        ? result.data.medications[result.data.medications.length - 1]
        : undefined

      const nextRecord: MedicationMiniEntry = {
        id: String(addedMedication?.id || `med_mini_${Date.now()}`),
        name: String(addedMedication?.medicationName || name),
        notes: String(addedMedication?.instructions || notes || '') || undefined,
      }

      setFormAnswers((prev) => {
        const existing = Array.isArray(prev[field.id]) ? prev[field.id] : []
        if (existing.some((r: any) => String(r.id) === String(nextRecord.id))) return prev
        return { ...prev, [field.id]: [...existing, nextRecord] }
      })
      setMedicationMiniDrafts((prev) => ({ ...prev, [field.id]: { name: '', notes: '' } }))
    }

    return (
      <div className="space-y-3 border rounded-lg p-3 bg-card/40">
        <Input
          className={contrastInputClass}
          placeholder={field.placeholder || 'Medication name'}
          value={draft.name}
          onChange={(e) => setMedicationMiniDrafts((prev) => ({ ...prev, [field.id]: { ...draft, name: e.target.value } }))}
        />
        <Textarea
          className={contrastInputClass}
          rows={2}
          placeholder="Extra notes"
          value={draft.notes}
          onChange={(e) => setMedicationMiniDrafts((prev) => ({ ...prev, [field.id]: { ...draft, notes: e.target.value } }))}
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={addMedicationRecord} disabled={!draft.name.trim() || !visitDepartmentId} className="rounded-full">
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
                    onClick={() => setFormAnswers((prev) => ({ ...prev, [field.id]: records.filter((r) => r.id !== record.id) }))}
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
