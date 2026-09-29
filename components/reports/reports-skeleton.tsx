import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function ReportsKpiCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-card/80 border border-border/70 rounded-2xl p-5 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
          <Skeleton className="h-7 w-20 rounded-md" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
      ))}
    </div>
  )
}

export function ReportsChartSkeleton() {
  return (
    <div className="bg-card/80 border border-border/70 rounded-2xl p-6 shadow-sm space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-3 w-64 rounded" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="h-[280px] w-full flex items-end gap-3 pt-6 px-4">
        {[40, 75, 55, 90, 65, 80, 45, 70, 95, 60, 85, 50].map((h, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            <Skeleton
              className="w-full rounded-t-md"
              style={{ height: `${h}%` }}
            />
            <Skeleton className="h-2.5 w-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReportsTableSkeleton() {
  return (
    <div className="bg-card/80 border border-border/70 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-44 rounded" />
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-4 pb-2 border-b border-border/50">
          <Skeleton className="h-4 flex-1 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <Skeleton className="h-4 flex-1 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReportsFinanceSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/70 border border-border/60 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-56 rounded" />
            <Skeleton className="h-3 w-72 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-36 rounded-xl" />
        </div>
      </div>

      {/* KPI Cards */}
      <ReportsKpiCardsSkeleton />

      {/* Chart Skeleton */}
      <ReportsChartSkeleton />

      {/* Table Skeleton */}
      <ReportsTableSkeleton />
    </div>
  )
}

export function ReportsClinicianSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/70 border border-border/60 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-48 rounded" />
            <Skeleton className="h-3 w-64 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-32 rounded-xl" />
          <Skeleton className="h-8 w-36 rounded-xl" />
        </div>
      </div>

      {/* Sub-tab pills */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-36 rounded-xl" />
        <Skeleton className="h-8 w-36 rounded-xl" />
      </div>

      {/* KPI Cards */}
      <ReportsKpiCardsSkeleton />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ReportsChartSkeleton />
        </div>
        <div className="space-y-6">
          <div className="bg-card/80 border border-border/70 rounded-2xl p-5 shadow-sm space-y-4">
            <Skeleton className="h-5 w-36 rounded" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-3.5 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
