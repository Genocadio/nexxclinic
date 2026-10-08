"use client"

import { Loader2 } from "lucide-react"

export function LoadingIndicator({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-card/95 px-4 py-2.5 text-sm font-medium text-foreground shadow-lg backdrop-blur"
    >
      <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}

export function AppLoadingState({ message = "Loading your workspace…" }: { message?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <LoadingIndicator message={message} />
    </main>
  )
}
