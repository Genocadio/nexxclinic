"use client"

import { useVisitLiveness } from "@/hooks/use-visit-liveness"
import { Users } from "lucide-react"

interface VisitPresenceBadgeProps {
  visitId: string | null | undefined
  className?: string
}

export function VisitPresenceBadge({ visitId, className = "" }: VisitPresenceBadgeProps) {
  const { otherViewers, isCollaborating } = useVisitLiveness(visitId)

  if (!isCollaborating || otherViewers.length === 0) {
    return null
  }

  const names = otherViewers.map((v) => v.name).join(", ")

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 transition-all ${className}`}
      title={`Currently viewing: ${names}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <Users className="w-3.5 h-3.5" />
      <span>
        {otherViewers.length === 1
          ? `${otherViewers[0].name} is also viewing`
          : `${otherViewers.length} others viewing`}
      </span>
    </div>
  )
}
