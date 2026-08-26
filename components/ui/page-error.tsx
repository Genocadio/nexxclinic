"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[PageError]", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground/60 font-mono">
          Error ID: {error.digest}
        </p>
      )}
      <Button
        onClick={reset}
        variant="outline"
        className="mt-2 gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  )
}
