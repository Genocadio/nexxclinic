"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import FormBuilderActionItem, { ActionItem } from "./form-builder-action-item"

interface FormBuilderActionListProps {
  items: ActionItem[]
  onRemove: (id: string) => void
  title?: string
}

export default function FormBuilderActionList({
  items,
  onRemove,
  title = "Actions & Consumables",
}: FormBuilderActionListProps) {
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <Card className="p-4 space-y-3 bg-card/50 border-orange-200 dark:border-orange-900/30">
      <h3 className="text-sm font-semibold">{title}</h3>

      {items.length > 0 ? (
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <FormBuilderActionItem
                key={item.id}
                item={item}
                onRemove={onRemove}
              />
            ))}
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Total Value:</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              {totalValue.toLocaleString()} RWF
            </span>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No actions or consumables added</p>
        </div>
      )}
    </Card>
  )
}
