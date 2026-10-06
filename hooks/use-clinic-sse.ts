"use client"

import { useEffect, useRef } from "react"
import { useApolloClient } from "@apollo/client"
import { useAuth } from "@/lib/auth-context"

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

    const scheduleReconnect = (minimumDelay?: number) => {
      if (isUnmounted) return

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      const baseDelay = minimumDelay ?? Math.min(1000 * 2 ** reconnectAttemptsRef.current, 15000)
      const jitter = Math.floor(Math.random() * Math.min(baseDelay * 0.2, 1000))
      reconnectAttemptsRef.current += 1
      reconnectTimeoutRef.current = setTimeout(connectSse, baseDelay + jitter)
    }

    const connectSse = () => {
      if (isUnmounted) return

      const token = localStorage.getItem("authToken")
      if (!token) {
        scheduleReconnect(1000)
        return
      }

      const streamUrl = new URL("/api/v1/events/stream", window.location.origin)
      streamUrl.searchParams.set("token", token)
      console.debug("[Clinic SSE] connecting", streamUrl.pathname)

      // Close previous connection if any
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }

      try {
        const es = new EventSource(streamUrl)
        eventSourceRef.current = es

        es.onopen = () => {
          console.debug("[Clinic SSE] connected")
          reconnectAttemptsRef.current = 0
          reconnectTimeoutRef.current = null
          void apolloClient
            .refetchQueries({ include: ["GetVisits", "DashboardStats"] })
            .catch((error) => console.warn("Failed to refresh clinic queues after SSE connect:", error))
        }

        const handleIncomingEvent = (e: MessageEvent, eventType: string) => {
          if (isUnmounted || !e.data) return

          try {
            const data: ClinicSseEvent = JSON.parse(e.data)
            console.debug("[Clinic SSE] received", eventType)
            
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
              void apolloClient
                .refetchQueries({
                  include: Array.from(new Set(queriesToRefetch)),
                })
                .catch((error) => console.warn(`Failed to refresh clinic data for ${eventType}:`, error))
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
          console.warn("[Clinic SSE] connection error; reconnecting", { readyState: es.readyState })
          es.close()
          eventSourceRef.current = null

          scheduleReconnect()
        }
      } catch {
        // Fallback: retry later
        scheduleReconnect(5000)
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
