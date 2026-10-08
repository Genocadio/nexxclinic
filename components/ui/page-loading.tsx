"use client"

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

export function PageLoading({ className }: PageLoadingProps) {
  return (
    <main
      role="status"
      aria-label="Loading page"
      className={cn(
        "flex min-h-screen flex-col bg-background px-5 text-foreground",
        className,
      )}
    >
      
      <div className="flex flex-1 items-start justify-center pt-[18vh]">
        <div className="w-full max-w-sm space-y-4">
          <span className="block h-5 w-2/5 animate-pulse rounded bg-muted" />
          <span className="block h-3 w-full animate-pulse rounded bg-muted" />
          <span className="block h-3 w-4/5 animate-pulse rounded bg-muted" />
          <span className="block h-9 w-1/3 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </main>
  )
}
