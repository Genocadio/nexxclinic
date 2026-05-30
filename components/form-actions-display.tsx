"use client"

import { useState, useRef } from "react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Pill, Trash2, Minus, Plus, AlertTriangle } from "lucide-react"
import type { FormAction } from "@/lib/form-storage"
import { useRemoveProductFromVisitDepartment, useUpdateProductQuantity } from "@/hooks/visits"

interface FormActionsDisplayProps {
  items: FormAction[]
  label?: string
  hideLabel?: boolean
  bold?: boolean
  center?: boolean
  italic?: boolean
  underline?: boolean
  visitId?: string
  departmentId?: string
  onRemove?: (id: string) => void
  onRestore?: (id: string) => void
  onUpdateQuantity?: (id: string, quantity: number) => void
  readOnly?: boolean
}

export default function FormActionsDisplay({
  items,
  label = "Products",
  hideLabel = false,
  bold = false,
  center = false,
  italic = false,
  underline = false,
  visitId,
  departmentId,
  onRemove,
  onRestore,
  onUpdateQuantity,
  readOnly = false,
}: FormActionsDisplayProps) {
  const { updateQuantity } = useUpdateProductQuantity()
  const { removeProduct } = useRemoveProductFromVisitDepartment()
  // Track which item's qty is being directly edited, and the draft string value
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftQty, setDraftQty] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const canUseServer = Boolean(visitId && departmentId)

  const updateServerQuantity = async (item: FormAction, nextQty: number) => {
    if (!canUseServer) {
      onUpdateQuantity && onUpdateQuantity(item.id, nextQty)
      return
    }

    try {
      console.log('=== Update Product Quantity ===')
      console.log('Product:', item.name)
      console.log('Using visitDepartmentProductId:', item.backendId)
      console.log('Next Quantity:', nextQty)
      console.log('==============================')

      if (!item.backendId) {
        throw new Error(`No backendId found for item: ${item.name}. This item may not have been properly added to the visit.`)
      }

      await updateQuantity(item.backendId, nextQty)
      onUpdateQuantity && onUpdateQuantity(item.id, nextQty)
    } catch (e) {
      console.error('update quantity error', e)
    }
  }

  const removeServerItem = async (item: FormAction) => {
    if (!canUseServer) {
      onRemove && onRemove(item.id)
      return
    }

    try {
      if (!item.backendId) {
        throw new Error(`No backendId found for item: ${item.name}`)
      }
      
      console.log('[FormActionsDisplay] Removing visit department product:', {
        itemId: item.id,
        itemName: item.name,
        itemType: item.type,
        backendId: item.backendId,
        source: item.source,
        removedFromVisit: item.removedFromVisit,
      })
      
      const response = await removeProduct(item.backendId)
      
      console.log('[FormActionsDisplay] Remove response:', response)
      
      if (response?.status !== 'SUCCESS') {
        throw new Error(response?.message || 'Failed to remove visit department product')
      }
      onRemove && onRemove(item.id)
    } catch (e) {
      console.error('remove item error', e)
    }
  }

  const renderItem = (item: FormAction) => {
    const isRemoved = item.removedFromVisit === true

    return (
      <div
        key={item.id}
        className={`group rounded-lg border transition-all duration-200 overflow-hidden ${
          isRemoved
            ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/40'
            : 'bg-white dark:bg-slate-900 border-orange-100 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700/50 hover:shadow-sm'
        }`}
      >
        {/* Always-visible compact row */}
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {isRemoved && (
              <AlertTriangle className="h-3 w-3 shrink-0 text-amber-500" />
            )}
            <p className={`text-sm font-medium truncate leading-tight ${isRemoved ? 'line-through text-muted-foreground' : ''}`}>
              {item.name}
            </p>
          </div>
          {/* Quantity pill — always visible */}
          <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5 leading-none">
            ×{item.quantity}
          </span>
        </div>

        {/* Hover-only controls — collapses to 0 height by default */}
        {readOnly ? (
          <div className="px-3 pb-2 pt-0">
            <div className="flex items-center justify-between gap-2">
              <div />
              <span className="text-xs text-muted-foreground">{isRemoved ? 'Removed' : 'Saved'}</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-200">
            <div className="overflow-hidden">
              <div className={`flex items-center justify-between gap-2 px-3 pb-2 pt-0 ${isRemoved ? 'opacity-60' : ''}`}>
              {/* Quantity stepper */}
              {item.isQuantifiable !== false ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    disabled={isRemoved}
                    onClick={() => {
                      if (isRemoved) return
                      const next = Math.max(1, item.quantity - 1)
                      canUseServer && item.backendId
                        ? updateServerQuantity(item, next)
                        : onUpdateQuantity?.(item.id, next)
                    }}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  {/* Inline editable quantity — click to type directly */}
                  {editingId === item.id ? (
                    <input
                      ref={inputRef}
                      type="number"
                      min={1}
                      value={draftQty}
                      onChange={(e) => setDraftQty(e.target.value)}
                      onFocus={(e) => e.target.select()}
                      onBlur={() => {
                        const parsed = parseInt(draftQty, 10)
                        const next = Number.isFinite(parsed) && parsed >= 1 ? parsed : item.quantity
                        if (next !== item.quantity) {
                          canUseServer && item.backendId
                            ? updateServerQuantity(item, next)
                            : onUpdateQuantity?.(item.id, next)
                        }
                        setEditingId(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          ;(e.target as HTMLInputElement).blur()
                        }
                        if (e.key === 'Escape') {
                          setEditingId(null)
                        }
                      }}
                      className="w-8 text-center text-xs font-medium tabular-nums bg-transparent border-b border-primary/60 outline-none focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  ) : (
                    <span
                      className="text-xs tabular-nums font-medium w-8 text-center cursor-text hover:text-primary transition-colors select-none"
                      title="Click to edit quantity"
                      onClick={() => {
                        if (isRemoved) return
                        setDraftQty(String(item.quantity))
                        setEditingId(item.id)
                        // focus after render
                        setTimeout(() => inputRef.current?.focus(), 0)
                      }}
                    >
                      {item.quantity}
                    </span>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    disabled={isRemoved}
                    onClick={() => {
                      if (isRemoved) return
                      const next = item.quantity + 1
                      canUseServer && item.backendId
                        ? updateServerQuantity(item, next)
                        : onUpdateQuantity?.(item.id, next)
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div />
              )}

              {/* Right-side actions */}
              <div className="flex items-center gap-1">
                {isRemoved && onRestore ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-6 px-2 text-[11px]"
                    onClick={() => onRestore(item.id)}
                  >
                    Restore
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    if (isRemoved) {
                      onRemove?.(item.id)
                      return
                    }
                    canUseServer && item.backendId
                      ? removeServerItem(item)
                      : onRemove?.(item.id)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {!hideLabel && (
        <label
          className={`text-sm font-medium flex items-center gap-2 ${bold ? 'font-bold' : ''} ${center ? 'justify-center' : ''} ${italic ? 'italic' : ''} ${underline ? 'underline' : ''}`}
        >
          <Pill className="h-4 w-4 text-orange-500" />
          {label}
        </label>
      )}
      <Card className="p-3 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/30">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {items.map(renderItem)}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-sm text-muted-foreground">No products added yet</p>
          </div>
        )}
      </Card>
    </div>
  )
}
