// Form storage and management utilities

export interface ConditionalRendering {
  dependsOn: string // field ID that this field depends on
  condition: 'notEmpty' | 'equals' | 'checked' | 'includes' | 'hasItem'
  value?: string // for 'equals', 'includes', and 'hasItem' conditions (item name for hasItem)
  itemType?: 'action' | 'consumable' // only for hasItem condition
}

export interface FormAction {
  id: string
  name: string
  type: 'action' | 'consumable'
  quantity: number
  privatePrice: number
  isQuantifiable?: boolean
  backendId?: string
  rawData?: Record<string, any> // Store complete backend response for accurate ID
}

export type TableHeaderPlacement = 'none' | 'top' | 'left' | 'right' | 'both'

export interface TableConfig {
  mode: 'fixed' | 'variableRows' | 'variableColumns'
  rows: number
  columns: number
  headerPlacement: TableHeaderPlacement
  columnHeaders?: string[]
  rowHeaders?: string[]
}

export interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'table' | 'diagnosticRecord' | 'medicationLongForm' | 'medicationMiniForm' | 'actionListener'
  placeholder?: string
  required: boolean
  hideLabel?: boolean
  boldLabel?: boolean
  centerLabel?: boolean
  italicLabel?: boolean
  underlineLabel?: boolean
  options?: string[] // for select/radio
  tableConfig?: TableConfig
  order: number
  conditionalRendering?: ConditionalRendering
}

export interface FormSection {
  id: string
  title: string
  boldTitle?: boolean
  italicTitle?: boolean
  underlineTitle?: boolean
  centerTitle?: boolean
  columns: 1 | 2 | 3 | 4
  fields: FormField[]
  order: number
}

export interface DepartmentForm {
  id: string
  departmentId: string | number
  title: string
  description?: string
  fields: FormField[]
  sections: FormSection[]
  actions: FormAction[]
  createdAt: string
  updatedAt: string
}

const FORMS_STORAGE_KEY = 'department_forms'

export function saveDepartmentForm(departmentId: string | number, form: Omit<DepartmentForm, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const allForms = getAllDepartmentForms()
    const existing = allForms.find(f => f.departmentId === departmentId)
    
    const now = new Date().toISOString()
    const newForm: DepartmentForm = {
      id: existing?.id || `form_${Date.now()}`,
      ...form,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }
    
    const updated = existing 
      ? allForms.map(f => f.departmentId === departmentId ? newForm : f)
      : [...allForms, newForm]
    
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(updated))
    
    // Log to console
    console.log('✅ Department Form Saved:', newForm)
    console.log('📋 Form Schema:', JSON.stringify(newForm, null, 2))
    
    return newForm
  } catch (err) {
    console.error('Error saving department form:', err)
    throw err
  }
}

export function getDepartmentForm(departmentId: string | number): DepartmentForm | null {
  try {
    const allForms = getAllDepartmentForms()
    return allForms.find(f => f.departmentId === departmentId) || null
  } catch (err) {
    console.error('Error getting department form:', err)
    return null
  }
}

export function getAllDepartmentForms(): DepartmentForm[] {
  try {
    const data = localStorage.getItem(FORMS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (err) {
    console.error('Error getting all forms:', err)
    return []
  }
}

export function deleteDepartmentForm(departmentId: string | number) {
  try {
    const allForms = getAllDepartmentForms()
    const updated = allForms.filter(f => f.departmentId !== departmentId)
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(updated))
    console.log('🗑️ Department Form Deleted for:', departmentId)
  } catch (err) {
    console.error('Error deleting department form:', err)
    throw err
  }
}

export function exportFormAsJSON(departmentId: string | number) {
  const form = getDepartmentForm(departmentId)
  if (!form) return null
  return JSON.stringify(form, null, 2)
}
