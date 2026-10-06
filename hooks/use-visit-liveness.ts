"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import type { ClinicSseEvent } from "./use-clinic-sse"

export interface VisitViewer {
  workerId: string
  name: string
  roles?: string[]
}

export function useVisitLiveness(visitId: string | null | undefined) {
  const { doctor, isAuthenticated } = useAuth()
  const [activeViewers, setActiveViewers] = useState<VisitViewer[]>([])
  const [lastEvent, setLastEvent] = useState<ClinicSseEvent | null>(null)
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null)

  const sendPresence = useCallback(
    async (active: boolean) => {
      if (!visitId || !isAuthenticated || typeof window === "undefined") return
      const token = localStorage.getItem("authToken")
      if (!token) return

      const url = `/api/v1/events/presence?visitId=${encodeURIComponent(
        visitId
      )}&active=${active}`

      try {
        await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch {
        // Silently ignore network blips for presence
      }
    },
    [visitId, isAuthenticated]
  )

  const fetchPresence = useCallback(async () => {
    if (!visitId || !isAuthenticated || typeof window === "undefined") return
    const token = localStorage.getItem("authToken")
    if (!token) return

    const url = `/api/v1/events/presence?visitId=${encodeURIComponent(visitId)}`

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        if (data && Array.isArray(data.viewers)) {
          setActiveViewers(data.viewers)
        }
      }
    } catch {
      // Silently ignore
    }
  }, [visitId, isAuthenticated])

  useEffect(() => {
    if (!visitId || !isAuthenticated) return

    // Register active presence
    sendPresence(true)
    fetchPresence()

    // Heartbeat every 45s
    heartbeatRef.current = setInterval(() => {
      sendPresence(true)
    }, 45000)

    const handleSseEvent = (event: Event) => {
      const customEvent = event as CustomEvent<ClinicSseEvent>
      const detail = customEvent.detail
      if (!detail) return

      if (detail.visitId === visitId) {
        setLastEvent(detail)
        if (detail.type === "VISIT_PRESENCE_CHANGED") {
          fetchPresence()
        }
      }
    }

    const handleBeforeUnload = () => {
      sendPresence(false)
    }

    window.addEventListener("clinic-sse-event", handleSseEvent)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
      }
      window.removeEventListener("clinic-sse-event", handleSseEvent)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      sendPresence(false)
    }
  }, [visitId, isAuthenticated, sendPresence, fetchPresence])

  const otherViewers = activeViewers.filter((v) => v.workerId !== doctor?.id)

  return {
    activeViewers,
    otherViewers,
    isCollaborating: otherViewers.length > 0,
    lastEvent,
  }
}
