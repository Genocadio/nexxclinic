"use client"

import { Calendar, Stethoscope, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  showMetrics: boolean
  onToggleMetrics: () => void
  canSeeRegisterAndCreate: boolean
  onRegisterNewPatient: () => void
  onCreateVisit: () => void
}

export function DashboardHeader({
  showMetrics,
  onToggleMetrics,
  canSeeRegisterAndCreate,
  onRegisterNewPatient,
  onCreateVisit,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="text-center space-y-2">
        <button
          onClick={onToggleMetrics}
          className="text-3xl font-bold text-foreground hover:text-primary transition-colors duration-200 cursor-pointer block w-full"
        >
          Today
        </button>
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="hidden md:flex flex-row gap-3 w-full justify-end">
        {canSeeRegisterAndCreate && (
          <Button
            onClick={onRegisterNewPatient}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Patient</span>
          </Button>
        )}
        {canSeeRegisterAndCreate && (
          <Button
            onClick={onCreateVisit}
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Create Visit</span>
          </Button>
        )}
      </div>
    </div>
  )
}