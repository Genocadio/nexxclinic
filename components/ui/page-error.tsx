"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [isReloading, setIsReloading] = useState(false)

  const message = error?.message || ""
  const isChunkError =
    /Loading chunk .* failed/i.test(message) ||
    /Failed to load chunk/i.test(message) ||
    /ChunkLoadError/i.test(message) ||
    /CSS chunk .* failed/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message)

  useEffect(() => {
    console.error("[PageError]", error)

    if (isChunkError) {
      const reloadKey = "chunk_failed_reload_timestamp"
      const lastReload = Number(sessionStorage.getItem(reloadKey) || "0")
      const now = Date.now()

      // Prevent infinite reload loops: reload once per 15-second window
      if (!lastReload || now - lastReload > 15000) {
        sessionStorage.setItem(reloadKey, String(now))
        setIsReloading(true)
        window.location.reload()
      }
    }
  }, [error, isChunkError])

  // When auto-reloading after a new deployment chunk mismatch
  if (isChunkError && isReloading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full bg-primary/10 p-4 text-primary animate-spin">
          <Loader2 className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Updating application...
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          A new version has been deployed. Refreshing to get the latest update.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">
        {isChunkError ? "Application update available" : "Something went wrong"}
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        {isChunkError
          ? "A new update was deployed. Please reload the page to apply the latest version."
          : error.message || "An unexpected error occurred. Please try again."}
      </p>
      {error.digest && !isChunkError && (
        <p className="text-xs text-muted-foreground/60 font-mono">
          Error ID: {error.digest}
        </p>
      )}
      <Button
        onClick={() => {
          if (isChunkError) {
            window.location.reload()
          } else {
            reset()
          }
        }}
        variant="outline"
        className="mt-2 gap-2 font-semibold"
      >
        <RefreshCw className="h-4 w-4" />
        {isChunkError ? "Reload application" : "Try again"}
      </Button>
    </div>
  )
}
