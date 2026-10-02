"use client"

import { useEffect } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleChunkError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const errorMsg =
        "message" in event
          ? event.message
          : (event as any).reason?.message || (event as any).reason || ""
      const strMsg = typeof errorMsg === "string" ? errorMsg : ""

      const isChunkError =
        /Loading chunk .* failed/i.test(strMsg) ||
        /Failed to load chunk/i.test(strMsg) ||
        /ChunkLoadError/i.test(strMsg) ||
        /CSS chunk .* failed/i.test(strMsg) ||
        /Failed to fetch dynamically imported module/i.test(strMsg) ||
        /error loading dynamically imported module/i.test(strMsg)

      if (isChunkError) {
        const reloadKey = "chunk_failed_reload_timestamp"
        const lastReload = Number(sessionStorage.getItem(reloadKey) || "0")
        const now = Date.now()

        // Reload once within a 15-second window to fetch the new build HTML
        if (!lastReload || now - lastReload > 15000) {
          sessionStorage.setItem(reloadKey, String(now))
          window.location.reload()
        }
      }
    }

    window.addEventListener("error", handleChunkError)
    window.addEventListener("unhandledrejection", handleChunkError)

    return () => {
      window.removeEventListener("error", handleChunkError)
      window.removeEventListener("unhandledrejection", handleChunkError)
    }
  }, [])

  return <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
}
