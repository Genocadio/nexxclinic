"use client"

import { handleUnauthenticatedSession } from "@/lib/response-handler"
import { pruneApolloCache } from "@/lib/apollo-client"

export const MAX_INACTIVITY_MS = 2 * 60 * 60 * 1000 // 2 hours (120 minutes)
export const TOKEN_REFRESH_THRESHOLD_MS = 20 * 60 * 1000 // Refresh when <= 20 minutes left
export const ACTIVITY_THROTTLE_MS = 30 * 1000 // Throttle storage writes to once per 30 seconds
export const CHECK_INTERVAL_MS = 30 * 1000 // Check session state every 30 seconds

export const STORAGE_KEY_LAST_ACTIVITY = "auth_last_activity"
export const STORAGE_KEY_AUTH_TOKEN = "authToken"
export const STORAGE_KEY_REFRESH_TOKEN = "refreshToken"
export const STORAGE_KEY_DOCTOR = "doctor"

let isRefreshing = false
let lastActivityLocal = Date.now()
let lastRecordedWrite = 0

/**
 * Safely parse the expiration timestamp (in milliseconds) from a standard JWT.
 */
export function parseJwtExp(token?: string | null): number | null {
  if (!token || typeof token !== "string") return null
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    const parsed = JSON.parse(jsonPayload)
    if (typeof parsed.exp === "number") {
      return parsed.exp * 1000
    }
    return null
  } catch {
    return null
  }
}

/**
 * Retrieve the timestamp of the last user interaction across all open browser tabs.
 */
export function getLastActivityTimestamp(): number {
  if (typeof window === "undefined") return Date.now()
  try {
    const stored = localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY)
    if (stored) {
      const num = Number(stored)
      if (!isNaN(num) && num > 0) {
        return num
      }
    }
  } catch {
    // Fallback to local variable
  }
  return lastActivityLocal
}

/**
 * Record user interaction (mouse move, click, key press, touch, scroll).
 * Throttled to avoid unnecessary storage write operations.
 */
export function recordUserActivity(force = false): void {
  if (typeof window === "undefined") return
  const now = Date.now()
  lastActivityLocal = now

  if (force || now - lastRecordedWrite >= ACTIVITY_THROTTLE_MS) {
    lastRecordedWrite = now
    try {
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, String(now))
    } catch {
      // Storage unavailable or quota exceeded
    }
  }
}

/**
 * Check if the user has been inactive for at least the given duration.
 */
export function isUserInactiveFor(durationMs = MAX_INACTIVITY_MS): boolean {
  const lastActivity = getLastActivityTimestamp()
  return Date.now() - lastActivity >= durationMs
}

/**
 * Perform a silent token refresh using the stored refresh token.
 */
export async function executeSilentTokenRefresh(): Promise<boolean> {
  if (typeof window === "undefined" || isRefreshing) return false

  const refreshToken = localStorage.getItem(STORAGE_KEY_REFRESH_TOKEN)
  if (!refreshToken) return false

  isRefreshing = true
  const query = `
    mutation RefreshToken($input: RefreshTokenInput!) {
      refreshToken(input: $input) {
        status
        message
        data {
          accessToken
          refreshToken
          user {
            id
            firstName
            lastName
            email
            phoneNumber
            username
            accountStatus
            roles
            departments {
              id
              name
            }
          }
        }
      }
    }
  `

  try {
    const res = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { input: { refreshToken } },
      }),
    })

    if (!res.ok) {
      console.warn("[AuthSession] Silent refresh request failed with HTTP status:", res.status)
      return false
    }

    const json = await res.json()
    const payload = json?.data?.refreshToken

    if (payload?.status === "SUCCESS" && payload?.data?.accessToken) {
      const { accessToken, refreshToken: newRefreshToken, user } = payload.data
      localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, accessToken)

      if (newRefreshToken) {
        localStorage.setItem(STORAGE_KEY_REFRESH_TOKEN, newRefreshToken)
      }
      if (user) {
        localStorage.setItem(STORAGE_KEY_DOCTOR, JSON.stringify(user))
      }

      window.dispatchEvent(
        new CustomEvent("auth-token-refreshed", { detail: payload.data }),
      )
      return true
    } else {
      console.warn(
        "[AuthSession] Silent refresh unsuccessful:",
        payload?.message || "Invalid payload",
      )
      return false
    }
  } catch (err) {
    console.error("[AuthSession] Error during silent token refresh:", err)
    return false
  } finally {
    isRefreshing = false
  }
}

/**
 * Evaluates the current session:
 * 1. If user inactive >= 2 hours: signs out with an inactivity notice.
 * 2. If user active and token has <= 20 mins left: silently refreshes token.
 */
export function checkSessionAndRefreshToken(): void {
  if (typeof window === "undefined") return

  const token = localStorage.getItem(STORAGE_KEY_AUTH_TOKEN)
  if (!token) return // User is not authenticated

  const now = Date.now()
  const lastActivity = getLastActivityTimestamp()
  const inactiveMs = now - lastActivity

  // Rule 1: If inactive for 2 hours with no use, sign out immediately.
  if (inactiveMs >= MAX_INACTIVITY_MS) {
    console.warn("[AuthSession] User inactive for 2 hours. Signing out.")
    handleUnauthenticatedSession("You have been signed out due to 2 hours of inactivity.")
    return
  }

  // Rule 2: User is active. Check token expiration.
  const expMs = parseJwtExp(token)
  if (!expMs) return

  const timeRemainingMs = expMs - now

  // Periodic garbage collection for Apollo cache to free unreferenced query objects
  pruneApolloCache()

  // If token has less than 20 minutes remaining (or has just expired but user is active), refresh silently
  if (timeRemainingMs <= TOKEN_REFRESH_THRESHOLD_MS) {
    void executeSilentTokenRefresh()
  }
}

/**
 * Initialize session activity tracking and background silent refresh.
 * Attach window activity event listeners and sets up a periodic heartbeat.
 */
export function initAuthSessionManager(): () => void {
  if (typeof window === "undefined") return () => {}

  // Record initial activity on load
  recordUserActivity(true)

  const handleActivity = () => {
    recordUserActivity(false)
  }

  const activityEvents: (keyof WindowEventMap)[] = [
    "mousemove",
    "mousedown",
    "keydown",
    "touchstart",
    "scroll",
    "wheel",
  ]

  activityEvents.forEach((evt) => {
    window.addEventListener(evt, handleActivity, { passive: true })
  })

  // Periodic heartbeat timer
  const intervalId = window.setInterval(() => {
    checkSessionAndRefreshToken()
  }, CHECK_INTERVAL_MS)

  // Listen to visibility change: when tab becomes visible after sleep, check immediately
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      recordUserActivity(false)
      checkSessionAndRefreshToken()
    }
  }
  document.addEventListener("visibilitychange", handleVisibilityChange)

  // Cleanup function
  return () => {
    activityEvents.forEach((evt) => {
      window.removeEventListener(evt, handleActivity)
    })
    document.removeEventListener("visibilitychange", handleVisibilityChange)
    window.clearInterval(intervalId)
  }
}
