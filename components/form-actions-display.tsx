"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Pill, Trash2, Minus, Plus } from "lucide-react"
import type { FormAction } from "@/lib/form-storage"
import { useUpdateActionQuantity, useUpdateConsumableQuantity, useRemoveActionFromVisitDepartment, useRemoveConsumableFromVisitDepartment } from "@/hooks/auth-hooks"

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
  onUpdateQuantity?: (id: string, quantity: number) => void
}

export default function FormActionsDisplay({
  items,
  label = "Actions & Consumables",
  hideLabel = false,
  bold = false,
  center = false,
  italic = false,
  underline = false,
  visitId,
  departmentId,
  onRemove,
  onUpdateQuantity,
}: FormActionsDisplayProps) {
  const actions = items.filter(item => item.type === 'action')
  const consumables = items.filter(item => item.type === 'consumable')
  const { updateQuantity: updateActionQty } = useUpdateActionQuantity()
  const { updateQuantity: updateConsumableQty } = useUpdateConsumableQuantity()
  const { removeAction } = useRemoveActionFromVisitDepartment()
  const { removeConsumable } = useRemoveConsumableFromVisitDepartment()

  const canUseServer = Boolean(visitId && departmentId)

  const updateServerQuantity = async (item: FormAction, nextQty: number) => {
    if (!canUseServer) {
      onUpdateQuantity && onUpdateQuantity(item.id, nextQty)
      return
    }

    try {
      console.log('=== Update Quantity Request ===')
      console.log('Item ID (internal):', item.id)
      console.log('Item Name:', item.name)
      console.log('Item Type:', item.type)
      console.log('Using backendId:', item.backendId)
      console.log('Next Quantity:', nextQty)
      console.log('VisitId:', visitId)
      console.log('DepartmentId:', departmentId)
      console.log('Raw Data stored:', item.rawData)
      console.log('==============================')

      if (!item.backendId) {
        throw new Error(`No backendId found for item: ${item.name}. This item may not have been properly added to the visit.`)
      }

      if (item.type === 'action') {
        await updateActionQty(visitId!, departmentId!, item.backendId, nextQty)
      } else {
        await updateConsumableQty(visitId!, departmentId!, item.backendId, nextQty)
      }
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
      if (item.type === 'action') {
        await removeAction(visitId!, departmentId!, item.backendId)
      } else {
        await removeConsumable(visitId!, departmentId!, item.backendId)
      }
      onRemove && onRemove(item.id)
    } catch (e) {
      console.error('remove item error', e)
    }
  }

  return (
    <div className="space-y-3">
      {!hideLabel && (
        <label className={`text-sm font-medium flex items-center gap-2 ${bold ? 'font-bold' : ''} ${center ? 'justify-center' : ''} ${italic ? 'italic' : ''} ${underline ? 'underline' : ''}`}>
          <Pill className="h-4 w-4 text-orange-500" />
          {label}
        </label>
      )}
      <Card className="p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/30">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {/* Actions Column */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-3">Actions</h4>
              {actions.length > 0 ? (
                actions.map((item) => (
                  <div key={item.id} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-orange-100 dark:border-orange-900/30">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        {item.isQuantifiable !== false && (
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <span>Qty:</span>
                            <div className="flex items-center gap-1">
                              <Button variant="outline" size="sm" className="h-6 w-6 p-0"
                                onClick={() => {
                                  const next = Math.max(1, item.quantity - 1)
                                  if (canUseServer && item.backendId) {
                                    updateServerQuantity(item, next)
                                  } else {
                                    onUpdateQuantity && onUpdateQuantity(item.id, next)
                                  }
                                }}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-2">{item.quantity}</span>
                              <Button variant="outline" size="sm" className="h-6 w-6 p-0"
                                onClick={() => {
                                  const next = item.quantity + 1
                                  if (canUseServer && item.backendId) {
                                    updateServerQuantity(item, next)
                                  } else {
                                    onUpdateQuantity && onUpdateQuantity(item.id, next)
                                  }
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Button variant="destructive" size="sm" className="h-7 px-2"
                          onClick={() => {
                            if (canUseServer && item.backendId) {
                              removeServerItem(item)
                            } else {
                              onRemove && onRemove(item.id)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">No actions</p>
              )}
            </div>

            {/* Consumables Column */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-3">Consumables</h4>
              {consumables.length > 0 ? (
                consumables.map((item) => (
                  <div key={item.id} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-orange-100 dark:border-orange-900/30">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        {item.isQuantifiable !== false && (
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <span>Qty:</span>
                            <div className="flex items-center gap-1">
                              <Button variant="outline" size="sm" className="h-6 w-6 p-0"
                                onClick={() => {
                                  const next = Math.max(1, item.quantity - 1)
                                  if (canUseServer && item.backendId) {
                                    updateServerQuantity(item, next)
                                  } else {
                                    onUpdateQuantity && onUpdateQuantity(item.id, next)
                                  }
                                }}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-2">{item.quantity}</span>
                              <Button variant="outline" size="sm" className="h-6 w-6 p-0"
                                onClick={() => {
                                  const next = item.quantity + 1
                                  if (canUseServer && item.backendId) {
                                    updateServerQuantity(item, next)
                                  } else {
                                    onUpdateQuantity && onUpdateQuantity(item.id, next)
                                  }
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Button variant="destructive" size="sm" className="h-7 px-2"
                          onClick={() => {
                            if (canUseServer && item.backendId) {
                              removeServerItem(item)
                            } else {
                              onRemove && onRemove(item.id)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">No consumables</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No actions or consumables added yet</p>
          </div>
        )}
      </Card>
    </div>
  )
}
