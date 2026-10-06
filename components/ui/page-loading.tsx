"use client"

import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type PageLoadingVariant =
  | "default"
  | "dashboard"
  | "clinical"
  | "consultation"
  | "triage"
  | "table"
  | "admin"
  | "list"
  | "billing"
  | "account"

export interface PageLoadingProps {
  variant?: PageLoadingVariant
  showHeader?: boolean
  className?: string
}

/**
 * Top placeholder navigation bar matching the app header layout.
 */
function TopNavSkeleton() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/40 bg-background/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-5 w-28 rounded-md hidden sm:block" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-36 rounded-full hidden md:block" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </header>
  )
}

/**
 * Unified lightweight global page loading skeleton UI.
 * Consistent across full page loading states in the application.
 */
export function PageLoading({
  variant = "default",
  showHeader = true,
  className,
}: PageLoadingProps) {
  return (
    <div className={cn("h-screen overflow-y-auto bg-background text-foreground flex flex-col", className)}>
      {showHeader && <TopNavSkeleton />}

      {/* Render variant layout */}
      {(variant === "default" || variant === "dashboard") && (
        <main className="flex-1 min-w-0 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Header Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1.5">
              <Skeleton className="h-7 w-48 rounded-lg" />
              <Skeleton className="h-4 w-64 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-28 rounded-full" />
              <Skeleton className="h-9 w-32 rounded-full" />
            </div>
          </div>

          {/* Metric / Stat KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-8 w-8 rounded-xl" />
                </div>
                <Skeleton className="h-7 w-16 rounded-md" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-border/50 bg-card/60 p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-36 rounded-md" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/30 bg-muted/20"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-3 w-20 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border/50 bg-card/60 p-5 space-y-3 shadow-sm">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </main>
      )}

      {(variant === "clinical" || variant === "consultation" || variant === "triage") && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Patient Header Banner */}
          <div className="rounded-2xl border border-border/50 bg-card/70 backdrop-blur-md p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Skeleton className="h-12 w-12 rounded-full shrink-0" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-40 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3.5 w-56 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>

          {/* Form / Cards split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/50 bg-card/60 p-5 space-y-3 shadow-sm"
                >
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/50 bg-card/60 p-5 space-y-4 shadow-sm">
                <Skeleton className="h-4 w-28 rounded-md" />
                <div className="grid grid-cols-2 gap-2.5">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-14 rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {(variant === "table" || variant === "admin" || variant === "list") && (
        <main className="flex-1 min-w-0 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-7 w-48 rounded-lg" />
              <Skeleton className="h-3.5 w-64 rounded" />
            </div>
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/60 p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border/20 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-36 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        </main>
      )}

      {variant === "billing" && (
        <main className="flex-1 min-w-0 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-44 rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28 rounded-full" />
              <Skeleton className="h-9 w-28 rounded-full" />
            </div>
          </div>

          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-28 rounded-full" />
            ))}
          </div>

          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/60 p-4 shadow-sm"
              >
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
                <Skeleton className="h-7 w-20 rounded-lg" />
                <Skeleton className="h-7 w-24 rounded-lg" />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <div className="w-full sm:w-80 space-y-3 rounded-2xl border border-border/50 bg-card/60 p-5 shadow-sm">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-3.5 w-28 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {variant === "account" && (
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-6">
          <div className="space-y-1">
            <Skeleton className="h-7 w-40 rounded-lg" />
            <Skeleton className="h-4 w-60 rounded" />
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/60 p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-5">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-3.5 w-52 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </main>
      )}
    </div>
  )
}

export default PageLoading
