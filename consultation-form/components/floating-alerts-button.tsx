"use client"

import { useState } from "react"
import type { PatientAlert } from "@/lib/mock-data"
import { format } from "date-fns"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Plus, X, FileWarning } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingAlertsButtonProps {
  alerts: PatientAlert[]
  currentUserRole: "Doctor" | "Nurse"
  onCreateAlert: () => void
}

export function FloatingAlertsButton({ alerts, currentUserRole, onCreateAlert }: FloatingAlertsButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const highSeverityCount = alerts.filter((a) => a.severity === "high").length

  const getSeverityConfig = (severity: PatientAlert["severity"]) => {
    const configs = {
      high: {
        badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-300",
        icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
      },
      medium: {
        badge: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-300",
        icon: <AlertTriangle className="h-4 w-4 text-orange-600" />,
      },
      low: {
        badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-300",
        icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
      },
    }
    return configs[severity]
  }

  const getTypeLabel = (type: PatientAlert["type"]) => {
    const labels = {
      allergy: "Allergy",
      warning: "Warning",
      note: "Note",
    }
    return labels[type]
  }

  return (
    <div className="fixed bottom-6 right-24 z-50">
      {isExpanded ? (
        <Card className="w-96 max-w-[calc(100vw-3rem)] bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 shadow-xl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <FileWarning className="h-4 w-4" />
                Patient Alerts & Notes
              </h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={onCreateAlert} className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsExpanded(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No alerts or notes</p>
              ) : (
                alerts.map((alert) => {
                  const config = getSeverityConfig(alert.severity)
                  return (
                    <div
                      key={alert.id}
                      className="p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {config.icon}
                          <p className="text-sm font-semibold">{alert.title}</p>
                        </div>
                        <Badge className={config.badge} variant="outline">
                          {getTypeLabel(alert.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{alert.createdBy}</span>
                        <span>{format(alert.createdAt, "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Button
          size="lg"
          onClick={() => setIsExpanded(true)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg relative",
            alerts.length === 0
              ? "bg-gray-600 hover:bg-gray-700"
              : highSeverityCount > 0
                ? "bg-red-600 hover:bg-red-700"
                : "bg-orange-600 hover:bg-orange-700",
          )}
        >
          {alerts.length === 0 ? <Plus className="h-6 w-6" /> : <FileWarning className="h-6 w-6" />}
          {alerts.length > 0 && (
            <Badge
              className={cn(
                "absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold",
                highSeverityCount > 0
                  ? "bg-red-600 text-white hover:bg-red-600"
                  : "bg-orange-600 text-white hover:bg-orange-600",
              )}
            >
              {alerts.length}
            </Badge>
          )}
        </Button>
      )}
    </div>
  )
}
