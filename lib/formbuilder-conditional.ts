// Conditional rendering utilities for the new form builder.
// Pure functions — no React, no side effects.

import type {
  BlockType,
  FormBlock,
  BlockConditional,
  ConditionalConditionType,
} from './formbuilder-storage'

// ─── Which block types can act as parents (they produce answer state) ────────

const PARENT_CAPABLE = new Set<BlockType>([
  'text_input', 'textarea_input', 'number_input', 'date_input',
  'checkbox_single', 'checkbox_group',
  'radio_group', 'select_input',
  'signature',
  'diagnostic_record', 'medication_full', 'medication_mini', 'lab_record',
  'product_listener',
])

export function canBlockBeParent(type: BlockType): boolean {
  return PARENT_CAPABLE.has(type)
}

// ─── Short display labels per block type ─────────────────────────────────────

const TYPE_SHORT: Partial<Record<BlockType, string>> = {
  text_input:         'text',
  textarea_input:     'textarea',
  number_input:       'number',
  date_input:         'date',
  checkbox_single:    'checkbox',
  checkbox_group:     'checkboxes',
  radio_group:        'radio',
  select_input:       'dropdown',
  signature:          'signature',
  diagnostic_record:  'diagnosis',
  medication_full:    'medication',
  medication_mini:    'medication',
  lab_record:         'lab',
  product_listener:   'products',
}

export function getBlockDisplayLabel(block: FormBlock): string {
  if (block.label) {
    const short = TYPE_SHORT[block.type]
    const trunc = block.label.length > 28 ? block.label.slice(0, 28) + '…' : block.label
    return short ? `"${trunc}" (${short})` : `"${trunc}"`
  }
  if (block.content) {
    const clean = block.content.replace(/\{\{[^}]+\}\}/g, '[…]')
    const trunc = clean.length > 32 ? clean.slice(0, 32) + '…' : clean
    return `"${trunc}"`
  }
  return `[${TYPE_SHORT[block.type] ?? block.type}]`
}

// ─── Available conditions per parent type ────────────────────────────────────

export interface ConditionOption {
  condition: ConditionalConditionType
  label: string
  /** This condition needs a free-text or option value  */
  needsValue: boolean
  /** This condition shows the hasItem extra controls */
  needsItemControls: boolean
}

export function getAvailableConditions(parentType: BlockType): ConditionOption[] {
  switch (parentType) {
    case 'text_input':
    case 'textarea_input':
    case 'number_input':
    case 'date_input':
      return [
        { condition: 'notEmpty', label: 'is filled in',  needsValue: false, needsItemControls: false },
        { condition: 'equals',   label: 'equals value',  needsValue: true,  needsItemControls: false },
      ]

    case 'checkbox_single':
      return [
        { condition: 'checked', label: 'is checked', needsValue: false, needsItemControls: false },
      ]

    case 'checkbox_group':
      return [
        { condition: 'notEmpty', label: 'has any selection',  needsValue: false, needsItemControls: false },
        { condition: 'includes', label: 'includes option',    needsValue: true,  needsItemControls: false },
      ]

    case 'radio_group':
    case 'select_input':
      return [
        { condition: 'notEmpty', label: 'has any selection', needsValue: false, needsItemControls: false },
        { condition: 'equals',   label: 'equals option',     needsValue: true,  needsItemControls: false },
      ]

    case 'signature':
      return [
        { condition: 'notEmpty', label: 'is signed', needsValue: false, needsItemControls: false },
      ]

    case 'diagnostic_record':
      return [
        { condition: 'notEmpty', label: 'has any diagnosis', needsValue: false, needsItemControls: false },
      ]

    case 'medication_full':
    case 'medication_mini':
      return [
        { condition: 'notEmpty', label: 'has any medication', needsValue: false, needsItemControls: false },
      ]

    case 'lab_record':
      return [
        { condition: 'notEmpty', label: 'has any result', needsValue: false, needsItemControls: false },
      ]

    case 'product_listener':
      return [
        { condition: 'hasItem', label: 'has product / action added', needsValue: false, needsItemControls: true },
      ]

    default:
      return [
        { condition: 'notEmpty', label: 'is filled in', needsValue: false, needsItemControls: false },
      ]
  }
}

// ─── Human-readable summary of a condition ───────────────────────────────────

export function getConditionSummary(
  cond: BlockConditional,
  allBlocks: FormBlock[],
): string {
  const parent = allBlocks.find(b => b.id === cond.dependsOn)
  const pName = parent ? getBlockDisplayLabel(parent) : '(deleted block)'

  switch (cond.condition) {
    case 'notEmpty': {
      const verb =
        parent?.type === 'signature'         ? 'is signed'           :
        parent?.type === 'diagnostic_record'  ? 'has a diagnosis'     :
        parent?.type === 'medication_full' ||
        parent?.type === 'medication_mini'    ? 'has a medication'    :
        parent?.type === 'lab_record'         ? 'has a result'        :
        parent?.type === 'checkbox_single'    ? 'is checked'          :
                                                'is filled in'
      return `${pName} ${verb}`
    }
    case 'equals':
      return `${pName} = "${cond.value ?? ''}"`
    case 'checked':
      return `${pName} is checked`
    case 'includes':
      return `${pName} includes "${cond.value ?? ''}"`
    case 'hasItem':
      if (cond.value)     return `${pName} has "${cond.value}"`
      if (cond.itemType)  return `${pName} has a ${cond.itemType}`
      return `${pName} has any product`
    default:
      return `${pName} has a value`
  }
}

// ─── Runtime evaluator (mirrors old shouldShowField exactly) ─────────────────

type ProductItem = { id?: string; name?: string; type?: string; backendId?: string }

export function shouldShowBlock(
  block: FormBlock,
  formAnswers: Record<string, unknown>,
  fieldActions: Record<string, ProductItem[]> = {},
): boolean {
  const cr = block.conditionalRendering
  if (!cr) return true

  const { dependsOn, condition, value, itemType } = cr
  const parentVal = formAnswers[dependsOn]

  switch (condition) {
    case 'notEmpty': {
      if (Array.isArray(parentVal)) return parentVal.length > 0
      const obj = parentVal as Record<string, unknown> | null | undefined
      // Diagnostic / medication lists store entries as arrays
      if (obj && typeof obj === 'object' && Array.isArray(obj['items']))
        return (obj['items'] as unknown[]).length > 0
      return parentVal !== undefined && parentVal !== null && parentVal !== ''
    }

    case 'equals':
      return String(parentVal ?? '') === String(value ?? '')

    case 'checked':
      return Boolean(parentVal)

    case 'includes':
      if (Array.isArray(parentVal)) return parentVal.includes(value)
      return String(parentVal ?? '').includes(String(value ?? ''))

    case 'hasItem': {
      // Items can come from the live field-actions state OR from saved answers
      const stateItems = fieldActions[dependsOn] ?? []
      const rawItems: unknown[] =
        Array.isArray((parentVal as Record<string, unknown>)?.['items'])
          ? (parentVal as Record<string, unknown>)['items'] as unknown[]
          : []
      const pool: ProductItem[] = stateItems.length > 0 ? stateItems : (rawItems as ProductItem[])

      const typed: ProductItem[] = itemType
        ? pool.filter(item => String(item.type ?? '').toLowerCase() === itemType)
        : pool

      if (!value) return typed.length > 0

      const expected = value.trim().toLowerCase()
      return typed.some(item => {
        const n = String(item.name ?? '').toLowerCase()
        const ids = [item.id, item.backendId]
          .filter(Boolean)
          .map(id => String(id).toLowerCase())
        return n.includes(expected) || ids.includes(expected)
      })
    }

    default:
      return true
  }
}
