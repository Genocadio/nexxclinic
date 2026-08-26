"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 border-b border-border/40 bg-card/50" />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border/40 bg-card/50 p-5 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
