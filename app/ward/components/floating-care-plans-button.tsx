"use client"

import { useState } from "react"
import type { ScheduledTask, CarePlan } from "../lib/mock-data"
import { format, isToday, isPast } from "date-fns"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, AlertCircle, Plus, Edit, Calendar, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingCarePlansButtonProps {
  tasks: ScheduledTask[]
  carePlans: CarePlan[]
  currentUserRole: "Doctor" | "Nurse"
  onCreatePlan: () => void
  onEditPlan: (plan: CarePlan) => void
}

export function FloatingCarePlansButton({
  tasks,
  carePlans,
  currentUserRole,
  onCreatePlan,
  onEditPlan,
}: FloatingCarePlansButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const todayTasks = tasks.filter((task) => isToday(task.scheduledTime))
  const pendingCount = todayTasks.filter((t) => t.status === "pending" || t.status === "overdue").length
  const totalCount = carePlans.length

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded ? (
        <Card className="w-96 max-w-[calc(100vw-3rem)] bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 shadow-xl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Care Plans & Schedule
              </h3>
              <div className="flex items-center gap-2">
                {currentUserRole === "Doctor" && (
                  <Button size="sm" variant="ghost" onClick={onCreatePlan} className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setIsExpanded(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {todayTasks.length > 0 ? (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-medium text-muted-foreground">Today's Tasks</p>
                {todayTasks.map((task) => {
                  const statusConfig = {
                    completed: {
                      icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
                      badge: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
                      text: "Completed",
                    },
                    overdue: {
                      icon: <AlertCircle className="h-4 w-4 text-red-600" />,
                      badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
                      text: "Overdue",
                    },
                    pending: {
                      icon: <Clock className="h-4 w-4 text-blue-600" />,
                      badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                      text: isPast(task.scheduledTime) ? "Due now" : "Scheduled",
                    },
                  }

                  const config = statusConfig[task.status]

                  return (
                    <div key={task.id} className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {config.icon}
                        <span className="font-medium whitespace-nowrap">{format(task.scheduledTime, "h:mm a")}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="truncate">{task.plan.description}</span>
                      </div>
                      <Badge className={config.badge} variant="secondary">
                        {config.text}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks scheduled today</p>
            )}

            <div className="border-t border-blue-200 dark:border-blue-800 pt-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Active Care Plans</p>
              <div className="space-y-2">
                {carePlans.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No active care plans</p>
                ) : (
                  carePlans.map((plan) => (
                    <div key={plan.id} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{plan.description}</p>
                        <p className="text-xs text-muted-foreground">{plan.frequency} • {plan.scheduledTimes.join(", ")}</p>
                      </div>
                      {currentUserRole === "Doctor" && (
                        <Button size="sm" variant="ghost" onClick={() => onEditPlan(plan)} className="h-8 w-8 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Button
          size="lg"
          onClick={() => setIsExpanded(true)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg relative",
            totalCount === 0
              ? "bg-blue-600 hover:bg-blue-700"
              : pendingCount > 0
              ? "bg-orange-600 hover:bg-orange-700"
              : "bg-blue-600 hover:bg-blue-700",
          )}
        >
          {totalCount === 0 ? <Plus className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
          {totalCount > 0 && (
            <Badge
              className={cn(
                "absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold",
                pendingCount > 0
                  ? "bg-red-600 text-white hover:bg-red-600"
                  : "bg-green-600 text-white hover:bg-green-600",
              )}
            >
              {pendingCount > 0 ? pendingCount : totalCount}
            </Badge>
          )}
        </Button>
      )}
    </div>
  )
}
