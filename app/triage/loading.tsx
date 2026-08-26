"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function TriageLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 border-b border-border/40 bg-card/50" />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-80 w-full rounded-3xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
