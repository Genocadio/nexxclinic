"use client"

import { Stethoscope, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  showMetrics?: boolean
  onToggleMetrics?: () => void
  canSeeRegisterAndCreate: boolean
  onRegisterNewPatient: () => void
  onCreateVisit: () => void
}

export function DashboardHeader({
  canSeeRegisterAndCreate,
  onRegisterNewPatient,
  onCreateVisit,
}: DashboardHeaderProps) {
  if (!canSeeRegisterAndCreate) return null

  return (
    <div className="mb-6 hidden md:flex flex-row gap-3 w-full justify-end">
      <Button
        onClick={onRegisterNewPatient}
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        <span>Register New Patient</span>
      </Button>
      <Button
        onClick={onCreateVisit}
        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
      >
        <Stethoscope className="w-4 h-4" />
        <span>Create Visit</span>
      </Button>
    </div>
  )
}