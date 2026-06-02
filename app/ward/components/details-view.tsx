"use client"

import { type ConsultationRecord, getRecordIcon, getRecordColor } from "../lib/mock-data"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Pencil } from "lucide-react"

interface DetailsViewProps {
  record: ConsultationRecord
  onClose: () => void
  onEdit: (record: ConsultationRecord) => void
}

export function DetailsView({ record, onClose, onEdit }: DetailsViewProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {record.items.map((item) => {
              const productType = item.type === "products" ? (item.details["Product Type"] as "action" | "consumable") : undefined
              return (
                <Badge key={item.id} className={getRecordColor(item.type, productType)}>
                  {getRecordIcon(item.type, productType)} {item.type === "products" ? productType : item.type.replace("-", " ")}
                </Badge>
              )
            })}
          </div>
          <CardTitle className="text-xl">{record.summary}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 space-y-6 overflow-y-auto">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Recorded By</h3>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {record.createdBy
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{record.createdBy}</p>
              <p className="text-xs text-muted-foreground">{record.role}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Date & Time</h3>
          <p className="text-sm">{format(record.timestamp, "EEEE, MMMM dd, yyyy")}</p>
          <p className="text-sm text-muted-foreground">{format(record.timestamp, "h:mm a")}</p>
        </div>

        <div className="space-y-6">
          {record.items.map((item) => {
            const productType = item.type === "products" ? (item.details["Product Type"] as "action" | "consumable") : undefined
            return (
              <div key={item.id} className="border-l-4 border-l-primary pl-4 py-2">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="text-lg">{getRecordIcon(item.type, productType)}</span>
                  {item.type === "products" ? productType : item.type.replace("-", " ")}
                </h4>
                <div className="space-y-3">
                  {Object.entries(item.details)
                    .filter(([key]) => key !== "Product Type")
                    .map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">{key}</p>
                        <p className="text-sm">{value}</p>
                      </div>
                    ))}
                </div>
              </div>
            )
          })}
        </div>

        {record.editable && (
          <div className="pt-4">
            <Button onClick={() => onEdit(record)} className="w-full">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Record
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
