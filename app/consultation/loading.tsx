"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function ConsultationLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-14 border-b border-border/40 bg-card/50" />
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="bg-card/70 border border-border/40 rounded-2xl p-4 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
