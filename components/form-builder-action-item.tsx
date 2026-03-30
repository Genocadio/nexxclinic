"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Trash2 } from "lucide-react"

export interface ActionItem {
  id: string
  name: string
  type: 'action' | 'consumable'
  quantity: number
  price: number
}

interface FormBuilderActionItemProps {
  item: ActionItem
  onRemove: (id: string) => void
}

export default function FormBuilderActionItem({
  item,
  onRemove,
}: FormBuilderActionItemProps) {
  return (
    <Card className="p-3 bg-card border-l-4 border-l-orange-400">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <Badge
              variant={item.type === 'action' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {item.type}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>Qty: {item.quantity}</span>
            <span>•</span>
            <span>{(item.price * item.quantity).toLocaleString()} RWF</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
