"use client"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Default page-level loading skeleton. Used by Next.js loading.tsx files
 * to show a meaningful skeleton instead of a blank page or spinner while
 * the route chunk loads.
 */
export default function PageLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top nav skeleton */}
      <div className="h-14 border-b border-border/40 bg-card/50 backdrop-blur-sm" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page title */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>

        {/* Stats / cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border/40 bg-card/50 p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-56 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
