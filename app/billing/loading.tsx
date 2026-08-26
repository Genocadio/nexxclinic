"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function BillingLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 border-b border-border/40 bg-card/50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
        {/* Insurance pills */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-32 rounded-full" />
          ))}
        </div>
        {/* Billing items */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-border/40 bg-card/50 p-4">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          ))}
        </div>
        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-72 space-y-3 rounded-xl border border-border/40 bg-card/50 p-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
