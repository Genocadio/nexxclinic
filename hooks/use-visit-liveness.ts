"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import type { ClinicSseEvent } from "./use-clinic-sse"

export interface VisitViewer {
  workerId: string
  name: string
  role?: string
  roles?: string[]
  activity?: string
}

export function normalizeViewer(raw: any): VisitViewer {
  const name =
    raw.name ||
    raw.workerName ||
    [raw.firstName, raw.lastName].filter(Boolean).join(" ") ||
    "Staff"
  const role = raw.role || (Array.isArray(raw.roles) ? raw.roles[0] : "") || ""
  const roles: string[] = Array.isArray(raw.roles)
    ? raw.roles
    : role
      ? [role]
      : []
  return {
    workerId: String(raw.workerId || raw.id || ""),
    name,
    role,
    roles,
    activity: raw.activity || "viewing",
  }
}

export function isViewerBilling(viewer: VisitViewer): boolean {
  const allRoles = viewer.roles && viewer.roles.length > 0 ? viewer.roles : viewer.role ? [viewer.role] : []
  return allRoles.some((r) => {
    const norm = String(r || "").toUpperCase()
    return norm === "FINANCE" || norm === "CASHIER" || norm === "BILLING"
  })
}

export interface UseVisitLivenessOptions {
  onBillingPersonnelOpened?: (viewer: VisitViewer) => void
  onSseEvent?: (event: ClinicSseEvent) => void
}

export function useVisitLiveness(
  visitId: string | null | undefined,
  options?: UseVisitLivenessOptions
) {
  const { doctor, isAuthenticated } = useAuth()
  const [activeViewers, setActiveViewers] = useState<VisitViewer[]>([])
  const [lastEvent, setLastEvent] = useState<ClinicSseEvent | null>(null)
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null)
  const optionsRef = useRef(options)
  optionsRef.current = options
  const notifiedBillingIdsRef = useRef<Set<string>>(new Set())

  const sendPresence = useCallback(
    async (active: boolean, activity?: string) => {
      if (!visitId || !isAuthenticated || typeof window === "undefined") return
      const token = localStorage.getItem("authToken")
      if (!token) return

      let url = `/api/v1/events/presence?visitId=${encodeURIComponent(
        visitId
      )}&active=${active}`
      if (activity) {
        url += `&activity=${encodeURIComponent(activity)}`
      }

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

  const updateActivity = useCallback(
    (activity: string) => {
      void sendPresence(true, activity)
    },
    [sendPresence]
  )

  const applyViewers = useCallback(
    (rawList: any[]) => {
      const normalized = rawList.map(normalizeViewer)
      setActiveViewers(normalized)

      // Detect billing personnel viewing who is not current user
      const currentUserId = doctor?.id
      const currentBillingViewers = normalized.filter(
        (v) => v.workerId !== currentUserId && isViewerBilling(v)
      )

      currentBillingViewers.forEach((bv) => {
        if (!notifiedBillingIdsRef.current.has(bv.workerId)) {
          notifiedBillingIdsRef.current.add(bv.workerId)
          optionsRef.current?.onBillingPersonnelOpened?.(bv)
        }
      })

      // Clean up notified IDs if they are no longer in viewers
      const activeBillingIds = new Set(currentBillingViewers.map((v) => v.workerId))
      notifiedBillingIdsRef.current.forEach((id) => {
        if (!activeBillingIds.has(id)) {
          notifiedBillingIdsRef.current.delete(id)
        }
      })
    },
    [doctor?.id]
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
        const rawList = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.viewers)
            ? data.viewers
            : []
        applyViewers(rawList)
      }
    } catch {
      // Silently ignore
    }
  }, [visitId, isAuthenticated, applyViewers])

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

      const eventVisitId = String(detail.visitId || "").toLowerCase()
      const currentVisitId = String(visitId || "").toLowerCase()
      if (eventVisitId && currentVisitId && eventVisitId === currentVisitId) {
        setLastEvent(detail)
        optionsRef.current?.onSseEvent?.(detail)
        if (detail.type === "VISIT_PRESENCE_CHANGED") {
          const rawList = Array.isArray(detail.metadata?.viewers)
            ? (detail.metadata.viewers as any[])
            : null
          if (rawList) {
            applyViewers(rawList)
          } else {
            fetchPresence()
          }
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
  }, [visitId, isAuthenticated, sendPresence, fetchPresence, applyViewers])

  const otherViewers = activeViewers.filter((v) => v.workerId !== doctor?.id)
  const billingViewers = otherViewers.filter((v) => isViewerBilling(v))

  return {
    activeViewers,
    otherViewers,
    billingViewers,
    isBillingViewing: billingViewers.length > 0,
    isCollaborating: otherViewers.length > 0,
    lastEvent,
    sendPresence,
    fetchPresence,
    updateActivity,
  }
}
