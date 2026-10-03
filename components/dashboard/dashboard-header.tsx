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
    <div className="hidden md:flex flex-row items-center gap-3 w-full justify-end pr-14 sm:pr-20 py-0.5">
      <Button
        onClick={onRegisterNewPatient}
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 py-2 shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
      >
        <UserPlus className="w-4 h-4" />
        <span>Register New Patient</span>
      </Button>
      <Button
        onClick={onCreateVisit}
        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-5 py-2 shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
      >
        <Stethoscope className="w-4 h-4" />
        <span>Create Visit</span>
      </Button>
    </div>
  )
}