"use client"

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
}: FormActionsDisplayProps) {
  const { updateQuantity } = useUpdateProductQuantity()
  const { removeProduct } = useRemoveProductFromVisitDepartment()

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
    const isConsumable = item.type === 'consumable'
    return (
      <div
        key={item.id}
        className={`group p-3 rounded-lg border transition-colors ${
          isRemoved
            ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/40 opacity-90'
            : 'bg-white dark:bg-slate-900 border-orange-100 dark:border-orange-900/30'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-medium leading-tight break-words">{item.name}</p>
              <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                isConsumable
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
              }`}>
                {isConsumable ? 'Consumable' : 'Act'}
              </span>
            </div>
            {isRemoved ? (
              <p className="text-xs text-amber-700 dark:text-amber-200 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 shrink-0" />
                Removed from visit
              </p>
            ) : null}
            {item.isQuantifiable !== false && (
              <div className={`flex items-center gap-1.5 ${isRemoved ? 'opacity-60' : ''}`}>
                <span className="text-xs text-muted-foreground">Qty:</span>
                <div className="flex items-center gap-0.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 w-6 p-0 ${isRemoved ? 'cursor-not-allowed opacity-50' : ''}`}
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
                  <span className="text-xs font-medium px-1.5 tabular-nums">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 w-6 p-0 ${isRemoved ? 'cursor-not-allowed opacity-50' : ''}`}
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
              </div>
            )}
          </div>

          {/* Action buttons — visible on hover */}
          <div className="flex flex-col items-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {isRemoved && onRestore ? (
              <Button variant="secondary" size="sm" className="h-7 px-2 text-xs" onClick={() => onRestore(item.id)}>
                Restore
              </Button>
            ) : null}
            <Button
              variant="destructive"
              size="sm"
              className="h-7 w-7 p-0"
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
      <Card className="p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/30">
        {items.length > 0 ? (
          /* Responsive grid: 1 col on small screens, 2 cols on md+ */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map(renderItem)}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No products added yet</p>
          </div>
        )}
      </Card>
    </div>
  )
}
