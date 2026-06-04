"use client"

import type { ScheduledTask } from "@/lib/mock-data"
import { format, isToday, isPast } from "date-fns"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, AlertCircle } from "lucide-react"

interface CarePlanNoticesProps {
  tasks: ScheduledTask[]
}

export function CarePlanNotices({ tasks }: CarePlanNoticesProps) {
  const todayTasks = tasks.filter((task) => isToday(task.scheduledTime))

  if (todayTasks.length === 0) return null

  return (
    <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Today's Care Plan
      </h3>
      <div className="space-y-2">
        {todayTasks.map((task) => {
          const isPastTime = isPast(task.scheduledTime)
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
              text: isPastTime ? "Due now" : "Scheduled",
            },
          }

          const config = statusConfig[task.status]

          return (
            <div key={task.id} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2 flex-1">
                {config.icon}
                <span className="font-medium">{format(task.scheduledTime, "h:mm a")}</span>
                <span className="text-muted-foreground">-</span>
                <span>{task.plan.description}</span>
              </div>
              <Badge className={config.badge} variant="secondary">
                {config.text}
              </Badge>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
