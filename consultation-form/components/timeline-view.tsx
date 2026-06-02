"use client"

import { type ConsultationRecord, getRecordIcon, getRecordColor } from "@/lib/mock-data"
import { format, isToday } from "date-fns"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Plus, Calendar, LogOut } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TimelineViewProps {
  records: ConsultationRecord[]
  onSelectRecord: (record: ConsultationRecord) => void
  onEditRecord: (record: ConsultationRecord) => void
  onAddRecord: () => void
  onDischarge?: () => void
  admissionTime?: Date
  isDoctor?: boolean
  isPatientDischarged?: boolean
}

export function TimelineView({ 
  records, 
  onSelectRecord, 
  onEditRecord, 
  onAddRecord, 
  onDischarge,
  admissionTime, 
  isDoctor = false,
  isPatientDischarged = false 
}: TimelineViewProps) {
  // Reverse records to show newest first
  const reversedRecords = [...records].reverse()
  const nextCardIsLeft = reversedRecords.length % 2 === 0
  const currentTime = new Date()

  return (
    <TooltipProvider>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

        <div className="space-y-8">
          {/* Current time marker at top */}
          <div className="relative">
            <div className="absolute left-1/2 top-6 w-4 h-4 rounded-full bg-green-500 border-4 border-background -translate-x-1/2 z-10" />
            <div className={`flex ${nextCardIsLeft ? "justify-start pr-[52%]" : "justify-end pl-[52%]"}`}>
              <div className="text-xs text-muted-foreground font-medium p-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Today • {format(currentTime, "h:mm a")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add new record button and discharge button at top */}
          <div className="relative">
            <div className="absolute left-1/2 top-6 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 z-10" />
            <div className={`flex gap-3 ${nextCardIsLeft ? "justify-start pr-[52%]" : "justify-end pl-[52%]"}`}>
              <Button onClick={onAddRecord} className="gap-2 flex-1" size="lg">
                <Plus className="h-5 w-5" />
                Record New Entry
              </Button>
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
          </div>

          {reversedRecords.map((record, index) => {
            const isLeft = index % 2 === 0
            const isRecordToday = isToday(record.timestamp)

            const isFirstRecord = index === reversedRecords.length - 1
            return (
              <div key={record.id} className="relative">
                {/* Timeline dot with tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`absolute left-1/2 top-6 w-4 h-4 rounded-full border-4 border-background -translate-x-1/2 z-10 cursor-help ${record.isCompleted ? "bg-green-500" : "bg-primary"}`} />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-semibold">{format(record.timestamp, "EEEE, MMMM dd, yyyy")}</p>
                      <p className="text-sm">{format(record.timestamp, "h:mm a")}</p>
                      {record.isCompleted && <p className="text-xs text-green-400">Discharged</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>

              {/* Record card */}
              <div className={`flex ${isLeft ? "justify-start pr-[52%]" : "justify-end pl-[52%]"}`}>
                <Card
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow w-full"
                  onClick={() => onSelectRecord(record)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                      <p className="font-medium text-sm mb-1">{record.summary}</p>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p>
                          {record.createdBy} • {record.role}
                        </p>
                        <p>{format(record.timestamp, "MMM dd, yyyy • h:mm a")}</p>
                      </div>
                    </div>
                    {record.editable && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditRecord(record)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )
        })}

          {/* Admission time marker at bottom */}
          {admissionTime && (
            <div className="relative">
              <div className="absolute left-1/2 top-6 w-4 h-4 rounded-full bg-blue-500 border-4 border-background -translate-x-1/2 z-10" />
              <div className={`flex ${reversedRecords.length % 2 === 0 ? "justify-start pr-[52%]" : "justify-end pl-[52%]"}`}>
                <div className="text-xs text-muted-foreground font-medium p-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Started • {format(admissionTime, "MMM dd, yyyy 'at' h:mm a")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
