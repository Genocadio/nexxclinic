import { describe, expect, it, beforeEach, afterEach, vi } from "vitest"
import {
  parseJwtExp,
  getLastActivityTimestamp,
  recordUserActivity,
  isUserInactiveFor,
  MAX_INACTIVITY_MS,
  STORAGE_KEY_LAST_ACTIVITY,
  checkSessionAndRefreshToken,
} from "./auth-session-manager"

// Mock localStorage for test runner
const memoryStore = new Map<string, string>()
const mockLocalStorage = {
  getItem: (key: string) => memoryStore.get(key) ?? null,
  setItem: (key: string, value: string) => memoryStore.set(key, String(value)),
  removeItem: (key: string) => memoryStore.delete(key),
  clear: () => memoryStore.clear(),
}

describe("auth-session-manager", () => {
  beforeEach(() => {
    memoryStore.clear()
    ;(globalThis as any).localStorage = mockLocalStorage
    ;(globalThis as any).window = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      setInterval: vi.fn(),
      clearInterval: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  })

  afterEach(() => {
    memoryStore.clear()
    vi.restoreAllMocks()
  })

  describe("parseJwtExp", () => {
    it("returns null for null, undefined, or malformed strings", () => {
      expect(parseJwtExp(null)).toBeNull()
      expect(parseJwtExp(undefined)).toBeNull()
      expect(parseJwtExp("")).toBeNull()
      expect(parseJwtExp("not-a-jwt")).toBeNull()
    })

    it("parses valid JWT exp timestamp in milliseconds", () => {
      // payload: { "sub": "123", "exp": 1727989200 }
      const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64")
      const payload = Buffer.from(JSON.stringify({ sub: "user-1", exp: 1727989200 })).toString("base64")
      const fakeJwt = `${header}.${payload}.signature`

      expect(parseJwtExp(fakeJwt)).toBe(1727989200 * 1000)
    })

    it("returns null if payload has no exp field", () => {
      const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64")
      const payload = Buffer.from(JSON.stringify({ sub: "user-1" })) .toString("base64")
      const fakeJwt = `${header}.${payload}.signature`

      expect(parseJwtExp(fakeJwt)).toBeNull()
    })
  })

  describe("activity tracking", () => {
    it("records and retrieves last activity timestamp", () => {
      const before = Date.now()
      recordUserActivity(true)
      const after = Date.now()

      const lastActivity = getLastActivityTimestamp()
      expect(lastActivity).toBeGreaterThanOrEqual(before)
      expect(lastActivity).toBeLessThanOrEqual(after)
    })

    it("correctly identifies user inactivity", () => {
      const pastTime = Date.now() - (MAX_INACTIVITY_MS + 1000)
      mockLocalStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, String(pastTime))

      expect(isUserInactiveFor(MAX_INACTIVITY_MS)).toBe(true)
    })

    it("identifies active user when within threshold", () => {
      const recentTime = Date.now() - 5000
      mockLocalStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, String(recentTime))

      expect(isUserInactiveFor(MAX_INACTIVITY_MS)).toBe(false)
    })
  })

  describe("checkSessionAndRefreshToken", () => {
    it("does nothing if user is not authenticated (no token)", () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch")
      checkSessionAndRefreshToken()
      expect(fetchSpy).not.toHaveBeenCalled()
    })
  })
})
