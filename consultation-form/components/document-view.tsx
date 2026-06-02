"use client"

import { type ConsultationRecord, getRecordIcon, getRecordColor } from "@/lib/mock-data"
import { format, isToday } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pencil, Plus, LogOut } from "lucide-react"

interface DocumentViewProps {
  records: ConsultationRecord[]
  onEditRecord: (record: ConsultationRecord) => void
  onAddRecord?: () => void
  onDischarge?: () => void
  isDoctor?: boolean
  isPatientDischarged?: boolean
}

export function DocumentView({ 
  records, 
  onEditRecord, 
  onAddRecord,
  onDischarge,
  isDoctor = false,
  isPatientDischarged = false
}: DocumentViewProps) {
  const reversedRecords = [...records].reverse()
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Add record button and discharge button at top */}
      <div className="flex gap-3">
        {onAddRecord && (
          <Button onClick={onAddRecord} className="gap-2 flex-1" size="lg">
            <Plus className="h-5 w-5" />
            Record New Entry
          </Button>
        )}
        {isDoctor && !isPatientDischarged && onDischarge && (
          <Button 
            onClick={onDischarge} 
            variant="destructive" 
            className="gap-2" 
            size="lg"
          >
            <LogOut className="h-5 w-5" />
            Discharge
          </Button>
        )}
      </div>
      
      {reversedRecords.map((record) => {
        const isRecordToday = isToday(record.timestamp)

        return (
          <Card key={record.id} className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                {record.items.map((item) => {
                  const productType = item.type === "products" ? (item.details["Product Type"] as "action" | "consumable") : undefined
                  return (
                    <Badge key={item.id} className={getRecordColor(item.type, productType)}>
                      {getRecordIcon(item.type, productType)} {item.type === "products" ? productType : item.type.replace("-", " ")}
                    </Badge>
                  )
                })}
                {isRecordToday && (
                  <Badge variant="outline" className="text-xs">
                    Today
                  </Badge>
                )}
              </div>
              {record.editable && (
                <Button size="sm" variant="ghost" onClick={() => onEditRecord(record)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{record.summary}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">{record.createdBy}</span>
                  <span>•</span>
                  <span>{record.role}</span>
                  <span>•</span>
                  <span>{format(record.timestamp, "MMMM dd, yyyy 'at' h:mm a")}</span>
                </div>
              </div>

              {/* Display all items */}
              <div className="space-y-6">
                {record.items.map((item) => {
                  const productType = item.type === "products" ? (item.details["Product Type"] as "action" | "consumable") : undefined
                  return (
                  <div key={item.id} className="border-l-4 border-l-primary pl-4 py-2">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <span className="text-lg">{getRecordIcon(item.type, productType)}</span>
                      {item.type === "products" ? productType : item.type.replace("-", " ")}
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(item.details)
                        .filter(([key]) => key !== "Product Type")
                        .map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-4 text-sm">
                          <dt className="font-medium text-muted-foreground">{key}:</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </div>
                  </div>
                  )
                })}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
