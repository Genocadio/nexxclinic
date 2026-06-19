"use client"

import { GitBranch, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { FormBlock, BlockConditional, ConditionalConditionType } from '@/lib/formbuilder-storage'
import {
  canBlockBeParent,
  getAvailableConditions,
  getBlockDisplayLabel,
  getConditionSummary,
} from '@/lib/formbuilder-conditional'

export interface ConditionalConfigProps {
  allBlocks: FormBlock[]
  currentBlockId: string
  value: BlockConditional | undefined
  onChange: (v: BlockConditional | undefined) => void
  isActive: boolean
}

export function ConditionalConfig({
  allBlocks,
  currentBlockId,
  value,
  onChange,
  isActive,
}: ConditionalConfigProps) {
  // Eligible parent blocks: must produce answer state, must not be self
  const eligible = allBlocks.filter(
    b => b.id !== currentBlockId && canBlockBeParent(b.type),
  )

  // ── Badge mode (not editing, but condition is set) ──────────────────────
  if (!isActive) {
    if (!value) return null
    return (
      <div className="mt-1.5 flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
        <GitBranch className="h-2.5 w-2.5 text-amber-500 shrink-0" />
        <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-tight truncate">
          <span className="font-semibold">Show if:</span>{' '}
          {getConditionSummary(value, allBlocks)}
        </p>
      </div>
    )
  }

  // ── Editor mode (block is active) ───────────────────────────────────────

  const parentBlock   = allBlocks.find(b => b.id === value?.dependsOn)
  const condOptions   = parentBlock ? getAvailableConditions(parentBlock.type) : []
  const activeCond    = condOptions.find(c => c.condition === value?.condition)
  const parentOptions = parentBlock?.options ?? []

  const handleParentChange = (parentId: string) => {
    const newParent = allBlocks.find(b => b.id === parentId)
    if (!newParent) return
    const newConds = getAvailableConditions(newParent.type)
    onChange({
      dependsOn: parentId,
      condition: newConds[0]?.condition ?? 'notEmpty',
    })
  }

  const handleConditionChange = (cond: ConditionalConditionType) => {
    if (!value) return
    onChange({ ...value, condition: cond, value: undefined, itemType: undefined })
  }

  return (
    <div className="mt-3 pt-3 border-t border-border/40 space-y-2.5">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <GitBranch className="h-3 w-3 text-amber-500" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Conditional
          </span>
          {value && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
        </div>
        {value && (
          <button
            onClick={() => onChange(undefined)}
            className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-0.5 transition-colors"
          >
            <X className="h-2.5 w-2.5" />
            Remove
          </button>
        )}
      </div>

      {/* No condition set */}
      {!value ? (
        eligible.length === 0 ? (
          <p className="text-[10px] text-muted-foreground italic">
            Add other fillable fields above this block to enable conditional display.
          </p>
        ) : (
          <button
            onClick={() => {
              const first = eligible[0]
              const conds = getAvailableConditions(first.type)
              onChange({
                dependsOn: first.id,
                condition: conds[0]?.condition ?? 'notEmpty',
              })
            }}
            className="w-full py-1.5 text-[11px] text-muted-foreground border border-dashed border-border rounded hover:bg-muted/30 transition-colors flex items-center justify-center gap-1.5"
          >
            <GitBranch className="h-3 w-3" />
            Add condition
          </button>
        )
      ) : (
        <div className="space-y-2 text-xs">
          {/* 1 · Parent block picker */}
          <div>
            <label className="text-[10px] text-muted-foreground">Show when</label>
            <select
              value={value.dependsOn}
              onChange={e => handleParentChange(e.target.value)}
              className="w-full mt-0.5 h-7 px-2 text-xs border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
            >
              {eligible.map(b => (
                <option key={b.id} value={b.id}>
                  {getBlockDisplayLabel(b)}
                </option>
              ))}
              {!eligible.find(b => b.id === value.dependsOn) && (
                <option value={value.dependsOn} disabled>
                  (deleted block)
                </option>
              )}
            </select>
          </div>

          {/* 2 · Condition picker (only when parent supports multiple) */}
          {condOptions.length > 1 && (
            <div>
              <label className="text-[10px] text-muted-foreground">Condition</label>
              <select
                value={value.condition}
                onChange={e => handleConditionChange(e.target.value as ConditionalConditionType)}
                className="w-full mt-0.5 h-7 px-2 text-xs border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
              >
                {condOptions.map(opt => (
                  <option key={opt.condition} value={opt.condition}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 3 · Value picker (for 'equals' / 'includes') */}
          {activeCond?.needsValue && (
            <div>
              <label className="text-[10px] text-muted-foreground">
                {value.condition === 'includes' ? 'Option to include' : 'Value to match'}
              </label>
              {parentOptions.length > 0 ? (
                /* Parent has predefined options → show them as a dropdown */
                <select
                  value={value.value ?? ''}
                  onChange={e =>
                    onChange({ ...value, value: e.target.value || undefined })
                  }
                  className="w-full mt-0.5 h-7 px-2 text-xs border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
                >
                  <option value="">Select option…</option>
                  {parentOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                /* Free-text input (for text/textarea/number parents) */
                <Input
                  className="mt-0.5 h-7 text-xs"
                  value={value.value ?? ''}
                  placeholder="Enter value…"
                  onChange={e =>
                    onChange({ ...value, value: e.target.value || undefined })
                  }
                />
              )}
            </div>
          )}

          {/* 4 · hasItem extra controls (product listener parent) */}
          {activeCond?.needsItemControls && (
            <>
              <div>
                <label className="text-[10px] text-muted-foreground">
                  Product type filter
                </label>
                <select
                  value={value.itemType ?? ''}
                  onChange={e =>
                    onChange({
                      ...value,
                      itemType: (e.target.value || undefined) as
                        | 'action'
                        | 'consumable'
                        | undefined,
                    })
                  }
                  className="w-full mt-0.5 h-7 px-2 text-xs border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
                >
                  <option value="">Any type</option>
                  <option value="action">Actions only</option>
                  <option value="consumable">Consumables only</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground">
                  Product name filter{' '}
                  <span className="font-normal">(optional — leave blank for any)</span>
                </label>
                <Input
                  className="mt-0.5 h-7 text-xs"
                  value={value.value ?? ''}
                  placeholder="e.g. ECG, Consultation…"
                  onChange={e =>
                    onChange({ ...value, value: e.target.value || undefined })
                  }
                />
              </div>
            </>
          )}

          {/* 5 · Live summary */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded px-2.5 py-2">
            <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-snug">
              <span className="font-semibold">⤷ Show if:</span>{' '}
              {getConditionSummary(value, allBlocks)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
