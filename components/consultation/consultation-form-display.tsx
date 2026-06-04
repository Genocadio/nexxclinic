"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import InlineTryAgain from "@/components/inline-try-again"
import { FormFieldRenderer } from "./form-field-renderer"
import type { BackendDepartmentForm } from "./consultation-form-utils"
import { shouldShowField } from "./consultation-form-utils"
import type { FormAction } from "@/lib/form-storage"

interface ConsultationFormDisplayProps {
  departmentForm: BackendDepartmentForm | null
  formLoading: boolean
  formLoadFailed: boolean
  formAnswers: Record<string, any>
  setFormAnswers?: (fn: (prev: Record<string, any>) => Record<string, any>) => void
  tableShapes: Record<string, { rows: number; columns: number }>
  setTableShapes?: (fn: (prev: Record<string, any>) => Record<string, any>) => void
  diagnosticDrafts: Record<string, { diagnosis: string; description: string }>
  setDiagnosticDrafts?: (fn: (prev: Record<string, any>) => Record<string, any>) => void
  medicationLongDrafts: Record<string, { name: string; frequency: string; amount: string; days: string; notes: string }>
  setMedicationLongDrafts?: (fn: (prev: Record<string, any>) => Record<string, any>) => void
  medicationMiniDrafts: Record<string, { name: string; notes: string }>
  setMedicationMiniDrafts?: (fn: (prev: Record<string, any>) => Record<string, any>) => void
  fieldActions: Record<string, FormAction[]>
  onFormReload?: () => void
  onActionListenerClick?: (fieldId: string) => void
  onUpdateQuantity?: (fieldId: string, actionId: string, quantity: number) => void
  onRemoveAction?: (fieldId: string, actionId: string) => void
  onRestoreAction?: (fieldId: string, actionId: string) => void
  visitId?: string
  currentDepartmentId?: string
  visitDepartmentId?: string
  hideActionListenerAddButton?: boolean
  productsLocked?: boolean
  readOnly?: boolean
}

export function ConsultationFormDisplay({
  departmentForm,
  formLoading,
  formLoadFailed,
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
  fieldActions,
  onFormReload,
  onActionListenerClick,
  onUpdateQuantity,
  onRemoveAction,
  onRestoreAction,
  visitId,
  currentDepartmentId,
  visitDepartmentId,
  hideActionListenerAddButton = false,
  productsLocked = false,
  readOnly = false,
}: ConsultationFormDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{departmentForm?.title || 'Department Consultation Form'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {formLoading ? (
          <p className="text-sm text-muted-foreground">Loading latest finalized department form...</p>
        ) : formLoadFailed ? (
          <InlineTryAgain onTryAgain={() => { void onFormReload?.() }} />
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
                  const field = item as typeof item & { itemType: 'field' }
                  if (!shouldShowField(field, formAnswers, fieldActions)) return null

                  const currentValue = formAnswers[field.id]
                  return (
                    <div key={field.id} className="space-y-1">
                      {!field.hideLabel && (
                        <Label className={`${field.boldLabel ? 'font-bold' : ''} ${field.italicLabel ? 'italic' : ''} ${field.underlineLabel ? 'underline' : ''} ${field.centerLabel ? 'text-center block' : ''}`}>
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                      )}
<FormFieldRenderer
                         field={field}
                         currentValue={currentValue}
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
                         onActionListenerClick={onActionListenerClick}
                         fieldActions={fieldActions[field.id] || []}
                         onUpdateQuantity={onUpdateQuantity ? (actionId, qty) => onUpdateQuantity(field.id, actionId, qty) : undefined}
                         onRemoveAction={onRemoveAction ? (actionId) => onRemoveAction(field.id, actionId) : undefined}
                         onRestoreAction={onRestoreAction ? (actionId) => onRestoreAction(field.id, actionId) : undefined}
                         visitId={visitId}
                         departmentId={currentDepartmentId}
                         visitDepartmentId={visitDepartmentId}
                         hideActionListenerAddButton={hideActionListenerAddButton}
                         productsLocked={productsLocked}
                         readOnly={readOnly}
                       />
                    </div>
                  )
                }

                const section = item as typeof item & { itemType: 'section' }
                return (
                  <div key={section.id} className="pt-2 space-y-3">
                    <hr className="border-t border-border/50 dark:border-slate-800" />
                    <h4 className={`font-semibold text-sm ${section.boldTitle ? 'font-bold' : ''} ${section.italicTitle ? 'italic' : ''} ${section.underlineTitle ? 'underline' : ''} ${section.centerTitle ? 'text-center' : ''}`}>
                      {section.title}
                    </h4>
                      {(section.fields || []).length === 0 ? (
                      <p className="text-xs text-muted-foreground">No fields in this section.</p>
                    ) : (
                      <div className={`grid gap-3 ${section.columns === 1 ? 'grid-cols-1' : section.columns === 2 ? 'grid-cols-2' : section.columns === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                        {(section.fields || []).filter((field) => shouldShowField(field, formAnswers, fieldActions)).map((field) => {
                          const currentValue = formAnswers[field.id]
                          return (
                            <div key={field.id} className="space-y-1">
                              {!field.hideLabel && (
                                <Label className={`${field.boldLabel ? 'font-bold' : ''} ${field.italicLabel ? 'italic' : ''} ${field.underlineLabel ? 'underline' : ''} ${field.centerLabel ? 'text-center block' : ''}`}>
                                  {field.label} {field.required && <span className="text-red-500">*</span>}
                                </Label>
                              )}
<FormFieldRenderer
                                 field={field}
                                 currentValue={currentValue}
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
                                 onActionListenerClick={onActionListenerClick}
                                 fieldActions={fieldActions[field.id] || []}
                                 onUpdateQuantity={onUpdateQuantity ? (actionId, qty) => onUpdateQuantity(field.id, actionId, qty) : undefined}
                                 onRemoveAction={onRemoveAction ? (actionId) => onRemoveAction(field.id, actionId) : undefined}
                                 onRestoreAction={onRestoreAction ? (actionId) => onRestoreAction(field.id, actionId) : undefined}
                                 visitId={visitId}
                                 visitDepartmentId={visitDepartmentId}
                                 hideActionListenerAddButton={hideActionListenerAddButton}
                                 productsLocked={productsLocked}
                                 readOnly={readOnly}
                               />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
          </>
        )}
      </CardContent>
    </Card>
  )
}
