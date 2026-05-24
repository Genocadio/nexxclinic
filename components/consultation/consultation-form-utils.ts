import type { FormField, FormSection, FormAction } from "@/lib/form-storage"

export type BackendFormStatus = 'DRAFT' | 'FINAL'

export interface BackendDepartmentForm {
  id: string
  title: string
  description?: string
  status: BackendFormStatus
  currentVersionNumber?: string
  currentSchemaVersion?: string
  fields: FormField[]
  sections: FormSection[]
}

export const resolveSchemaVersion = (currentSchemaVersion: unknown, currentVersionNumber?: string): string | undefined => {
  const parsedSchema = Number(currentSchemaVersion)
  if (Number.isFinite(parsedSchema)) {
    return String(parsedSchema)
  }

  const lastVersionToken = String(currentVersionNumber || '').split('.').pop()
  const parsedFromVersionLabel = Number(lastVersionToken)
  if (Number.isFinite(parsedFromVersionLabel)) {
    return String(parsedFromVersionLabel)
  }

  return undefined
}

export const normalizeField = (field: any, idx: number): FormField => ({
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
  labRecordConfig: field?.labRecordConfig
    ? {
        layout: field.labRecordConfig.layout === 'result' ? 'result' : 'valueUnit',
        rows: Array.isArray(field.labRecordConfig.rows)
          ? field.labRecordConfig.rows.map((row: any, rowIndex: number) => ({
              id: row?.id || `lab_row_${Date.now()}_${rowIndex}`,
              name: row?.name || `Row ${rowIndex + 1}`,
              unitMode: row?.unitMode === 'none' ? 'none' : 'dropdown',
              unitOptions: Array.isArray(row?.unitOptions) ? row.unitOptions.filter(Boolean) : [],
              defaultUnit: row?.defaultUnit || undefined,
              resultOptions: Array.isArray(row?.resultOptions) ? row.resultOptions.filter(Boolean) : [],
            }))
          : [],
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

export const normalizeSection = (section: any, idx: number): FormSection => ({
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

export const getAllFormFields = (form: BackendDepartmentForm | null): FormField[] => {
  if (!form) return []
  return [...(form.fields || []), ...(form.sections || []).flatMap((section) => section.fields || [])]
}

export const buildAnswersForSubmission = (
  formAnswers: Record<string, any>,
  tableShapes: Record<string, { rows: number; columns: number }>,
  fieldActions: Record<string, FormAction[]>,
  departmentForm: BackendDepartmentForm | null
): Record<string, any> => {
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

export const hydrateSavedAnswers = (
  savedAnswers: Record<string, any>,
  form: BackendDepartmentForm,
  setFormAnswers: (fn: (prev: Record<string, any>) => Record<string, any>) => void,
  setFieldActions: (fn: (prev: Record<string, FormAction[]>) => Record<string, FormAction[]>) => void,
  setTableShapes: (fn: (prev: Record<string, { rows: number; columns: number }>) => Record<string, { rows: number; columns: number }>) => void
) => {
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
        source: 'saved',
      }))
    }
  })

  setFormAnswers(() => nextFormAnswers)
  setFieldActions(() => nextFieldActions)
  setTableShapes(() => nextTableShapes)
}

export const shouldShowField = (field: FormField, formAnswers: Record<string, any>, fieldActions: Record<string, FormAction[]>): boolean => {
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

      const normalizedItemType = String(itemType || '').toLowerCase()
      const filteredByType = normalizedItemType === 'action' || normalizedItemType === 'consumable'
        ? items.filter((item: any) => String(item?.type || '').toLowerCase() === normalizedItemType)
        : items

      if (!value) {
        const result = filteredByType.length > 0
        console.log('[Consultation] hasItem no value', {
          dependsOn,
          itemType,
          itemsCount: filteredByType.length,
          result,
        })
        return result
      }

      const expected = String(value).trim().toLowerCase()
      const matched = filteredByType.some((item: any) => {
        const itemName = String(item?.name || '').trim().toLowerCase()
        const itemIds = [
          item?.id,
          item?.backendId,
          item?.rawData?.id,
          item?.rawData?.product?.id,
          item?.rawData?.action?.id,
          item?.rawData?.consumable?.id,
        ]
          .filter(Boolean)
          .map((id) => String(id).trim().toLowerCase())
        return itemName.includes(expected) || itemIds.includes(expected)
      })

      console.log('[Consultation] hasItem', {
        dependsOn,
        itemType,
        value,
        expected,
        itemsCount: filteredByType.length,
        matched,
        itemNames: filteredByType.map((item: any) => item?.name || ''),
        itemIds: filteredByType.map((item: any) => [item?.id, item?.backendId, item?.rawData?.id].filter(Boolean)),
      })

      return matched
    }
    default:
      return true
  }
}
