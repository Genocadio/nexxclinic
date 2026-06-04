"use client"

import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardStatsProps {
  showMetrics: boolean
  loading: boolean
  totalOpen?: number
  totalCompleted?: number
  totalWaitingForBilling?: number
}

export function DashboardStats({ showMetrics, loading, totalOpen = 0, totalCompleted = 0, totalWaitingForBilling = 0 }: DashboardStatsProps) {
  if (!showMetrics) return null

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
      <div className="flex flex-col gap-1.5">
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-all duration-200">
          <div className="flex items-start justify-between gap-2 md:gap-3">
            <div className="min-w-0 w-full md:w-auto">
              <p className="hidden md:block text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 font-medium truncate">Open</p>
              {loading ? <Skeleton className="h-7 md:h-9 w-12 md:w-16" /> : <p className="text-xl md:text-3xl font-bold text-foreground text-center md:text-left">{totalOpen}</p>}
            </div>
            <div className="hidden md:block bg-orange-500/10 p-2 md:p-3 rounded-xl md:rounded-2xl flex-shrink-0">
              <AlertCircle className="w-4 h-4 md:w-6 md:h-6 text-orange-500" />
            </div>
          </div>
        </div>
        <div className="md:hidden text-center">
          <span className="inline-block px-2.5 py-1 bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-full border border-orange-200 dark:border-orange-900/50">Open</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-all duration-200">
          <div className="flex items-start justify-between gap-2 md:gap-3">
            <div className="min-w-0 w-full md:w-auto">
              <p className="hidden md:block text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 font-medium truncate">Completed</p>
              {loading ? <Skeleton className="h-7 md:h-9 w-12 md:w-16" /> : <p className="text-xl md:text-3xl font-bold text-foreground text-center md:text-left">{totalCompleted}</p>}
            </div>
            <div className="hidden md:block bg-primary/10 p-2 md:p-3 rounded-xl md:rounded-2xl flex-shrink-0">
              <Clock className="w-4 h-4 md:w-6 md:h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="md:hidden text-center">
          <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">Completed</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-all duration-200">
          <div className="flex items-start justify-between gap-2 md:gap-3">
            <div className="min-w-0 w-full md:w-auto">
              <p className="hidden md:block text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 font-medium truncate">Waiting</p>
              {loading ? <Skeleton className="h-7 md:h-9 w-12 md:w-16" /> : <p className="text-xl md:text-3xl font-bold text-foreground text-center md:text-left">{totalWaitingForBilling}</p>}
            </div>
            <div className="hidden md:block bg-green-500/10 p-2 md:p-3 rounded-xl md:rounded-2xl flex-shrink-0">
              <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="md:hidden text-center">
          <span className="inline-block px-2.5 py-1 bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full border border-green-200 dark:border-green-900/50">Waiting</span>
        </div>
      </div>
    </div>
  )
}