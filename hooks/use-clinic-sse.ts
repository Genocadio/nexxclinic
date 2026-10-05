"use client"

import { useEffect, useRef } from "react"
import { useApolloClient } from "@apollo/client"
import { useAuth } from "@/lib/auth-context"
import { getRuntimeConfig } from "@/lib/runtime-config"

export interface ClinicSseEvent {
  eventId: string
  type:
    | "VISIT_CREATED"
    | "VISIT_DEPARTMENT_STATE_CHANGED"
    | "BILLING_COMPLETED"
    | "VISIT_DISCHARGED"
    | "VISIT_CANCELLED"
    | "VISIT_REOPENED"
    | "VISIT_PRODUCT_CHANGED"
    | "VISIT_NOTE_ADDED"
    | "VISIT_INSURANCE_CHANGED"
    | "VISIT_VITALS_CHANGED"
    | "VISIT_PRESENCE_CHANGED"
    | "USER_CREATED"
    | "USER_UPDATED"
    | "PING"
  timestamp: string
  visitId?: string
  patientId?: string
  patientName?: string
  departmentId?: string
  departmentName?: string
  departmentStatus?: string
  visitStatus?: string
  actorId?: string
  actorName?: string
  metadata?: Record<string, unknown>
}

export function useClinicSse() {
  const { doctor, isAuthenticated } = useAuth()
  const apolloClient = useApolloClient()
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)

  useEffect(() => {
    if (!isAuthenticated || !doctor || typeof window === "undefined") {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      return
    }

    let isUnmounted = false

    const connectSse = () => {
      if (isUnmounted) return

      const token = localStorage.getItem("authToken")
      if (!token) return

      const config = getRuntimeConfig()
      const baseUrl = config.API_BASE_URL || ""
      const streamUrl = `${baseUrl}/api/v1/events/stream?token=${encodeURIComponent(token)}`

      // Close previous connection if any
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }

      try {
        const es = new EventSource(streamUrl)
        eventSourceRef.current = es

        es.onopen = () => {
          reconnectAttemptsRef.current = 0
        }

        const handleIncomingEvent = (e: MessageEvent, eventType: string) => {
          if (isUnmounted || !e.data) return

          try {
            const data: ClinicSseEvent = JSON.parse(e.data)
            
            // Dispatch browser custom event for fine-grained local listeners
            window.dispatchEvent(
              new CustomEvent("clinic-sse-event", {
                detail: { ...data, type: eventType },
              })
            )

            // Silent Apollo Cache Refetch
            const queriesToRefetch: string[] = []

            if (eventType === "USER_CREATED" || eventType === "USER_UPDATED") {
              queriesToRefetch.push("SearchWorkers", "GetUsers", "Me")
            } else {
              queriesToRefetch.push("GetVisits", "DashboardStats")

              if (eventType === "VISIT_CREATED") {
                queriesToRefetch.push("SearchPatients")
              }
              if (
                eventType === "BILLING_COMPLETED" ||
                eventType === "VISIT_DEPARTMENT_STATE_CHANGED" ||
                eventType === "VISIT_PRODUCT_CHANGED" ||
                eventType === "VISIT_INSURANCE_CHANGED"
              ) {
                queriesToRefetch.push("GetVisitBilling", "GetVisitDepartmentBilling", "GetVisit")
              }
              if (eventType === "VISIT_NOTE_ADDED") {
                queriesToRefetch.push("GetVisitDepartmentNotes", "GetVisit")
              }
              if (eventType === "VISIT_VITALS_CHANGED") {
                queriesToRefetch.push("GetVisit")
              }
              if (
                eventType === "VISIT_DISCHARGED" ||
                eventType === "VISIT_CANCELLED" ||
                eventType === "VISIT_REOPENED"
              ) {
                queriesToRefetch.push("GetVisit")
              }
            }

            if (queriesToRefetch.length > 0) {
              apolloClient.refetchQueries({
                include: Array.from(new Set(queriesToRefetch)),
              })
            }
          } catch {
            // Ignore parse errors (e.g. keep-alive pings)
          }
        }

        // Register event type listeners
        const eventTypes = [
          "VISIT_CREATED",
          "VISIT_DEPARTMENT_STATE_CHANGED",
          "BILLING_COMPLETED",
          "VISIT_DISCHARGED",
          "VISIT_CANCELLED",
          "VISIT_REOPENED",
          "VISIT_PRODUCT_CHANGED",
          "VISIT_NOTE_ADDED",
          "VISIT_INSURANCE_CHANGED",
          "VISIT_VITALS_CHANGED",
          "VISIT_PRESENCE_CHANGED",
          "USER_CREATED",
          "USER_UPDATED",
        ]

        eventTypes.forEach((type) => {
          es.addEventListener(type, (e: MessageEvent) => handleIncomingEvent(e, type))
        })

        es.onerror = () => {
          es.close()
          eventSourceRef.current = null

          if (!isUnmounted) {
            // Exponential backoff: 1s, 2s, 4s, capped at 15s
            const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 15000)
            reconnectAttemptsRef.current += 1
            reconnectTimeoutRef.current = setTimeout(connectSse, delay)
          }
        }
      } catch {
        // Fallback: retry later
        if (!isUnmounted) {
          reconnectTimeoutRef.current = setTimeout(connectSse, 5000)
        }
      }
    }

    connectSse()

    return () => {
      isUnmounted = true
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [isAuthenticated, doctor, apolloClient])
}
