"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { usePathname } from "@/lib/navigation"
import { useAuth } from "@/lib/auth-context"
import { useUpdateMySettings } from "@/hooks/auth-hooks"
import type { FontSizePreference } from "@/lib/api-types"

interface FontSizeContextType {
  fontSize: FontSizePreference
  previewSize: FontSizePreference
  hasPersistedSetting: boolean
  setPreview: (size: FontSizePreference) => void
  applyFontSize: (size: FontSizePreference) => Promise<boolean>
  applyDisplaySettings: (options: { fontSize: FontSizePreference; theme?: string }) => Promise<boolean>
  resetPreview: () => void
  isLoading: boolean
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined)

const DEFAULT_FONT_SIZE: FontSizePreference = "md"
const VALID_SIZES: FontSizePreference[] = ["sm", "md", "lg", "xl"]

function isValidFontSize(size: any): size is FontSizePreference {
  return VALID_SIZES.includes(size)
}

function isAuthRoute(pathname?: string | null): boolean {
  if (!pathname) return false
  return (
    pathname === "/auth" ||
    pathname.startsWith("/auth/") ||
    pathname === "/register" ||
    pathname === "/create-password"
  )
}

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuth = isAuthRoute(pathname)
  const { doctor } = useAuth()
  const { updateMySettings } = useUpdateMySettings()

  // fontSize is the saved preference (from DB or localStorage or default)
  const [fontSize, setFontSizeState] = useState<FontSizePreference>(DEFAULT_FONT_SIZE)
  // previewSize is the currently active/selected size in the preview UI
  const [previewSize, setPreviewSize] = useState<FontSizePreference>(DEFAULT_FONT_SIZE)
  // whether the user currently has an explicit font size stored in DB
  const [hasPersistedSetting, setHasPersistedSetting] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Apply data-font-size attribute to root html element
  const applyToDocument = useCallback((size: FontSizePreference) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-font-size", size)
    }
  }, [])

  // Initial load from localStorage (or enforce default font size on auth/login/register routes)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isAuth || !doctor) {
        // Login, register, and unauthenticated screens always follow default font size
        setFontSizeState(DEFAULT_FONT_SIZE)
        setPreviewSize(DEFAULT_FONT_SIZE)
        applyToDocument(DEFAULT_FONT_SIZE)
        return
      }

      const stored = localStorage.getItem("app_font_size")
      if (isValidFontSize(stored)) {
        setFontSizeState(stored)
        setPreviewSize(stored)
        applyToDocument(stored)
      } else {
        applyToDocument(DEFAULT_FONT_SIZE)
      }
    }
  }, [applyToDocument, isAuth, doctor])

  // Sync with doctor's settings on login, doctor change, or route change
  useEffect(() => {
    if (isAuth) {
      // Login and register should always follow default font size, not previous user's settings
      setFontSizeState(DEFAULT_FONT_SIZE)
      setPreviewSize(DEFAULT_FONT_SIZE)
      applyToDocument(DEFAULT_FONT_SIZE)
      return
    }

    if (doctor) {
      const dbFontSize = doctor.settings?.fontSize as FontSizePreference | undefined
      if (dbFontSize && isValidFontSize(dbFontSize)) {
        setHasPersistedSetting(true)
        setFontSizeState(dbFontSize)
        setPreviewSize(dbFontSize)
        applyToDocument(dbFontSize)
        if (typeof window !== "undefined") {
          localStorage.setItem("app_font_size", dbFontSize)
        }
      } else {
        // Doctor is logged in but hasn't set a font size yet
        setHasPersistedSetting(false)
        const stored = typeof window !== "undefined" ? localStorage.getItem("app_font_size") : null
        if (isValidFontSize(stored)) {
          setFontSizeState(stored)
          setPreviewSize(stored)
          applyToDocument(stored)
        } else {
          setFontSizeState(DEFAULT_FONT_SIZE)
          setPreviewSize(DEFAULT_FONT_SIZE)
          applyToDocument(DEFAULT_FONT_SIZE)
        }
      }
    } else {
      // Not logged in: always enforce default font size
      setFontSizeState(DEFAULT_FONT_SIZE)
      setPreviewSize(DEFAULT_FONT_SIZE)
      applyToDocument(DEFAULT_FONT_SIZE)
    }
  }, [doctor, isAuth, applyToDocument])

  // Live preview callback: updates preview state and applies immediately to HTML root
  const setPreview = useCallback(
    (size: FontSizePreference) => {
      setPreviewSize(size)
      applyToDocument(size)
    },
    [applyToDocument]
  )

  // Reset preview back to saved font size
  const resetPreview = useCallback(() => {
    setPreviewSize(fontSize)
    applyToDocument(fontSize)
  }, [fontSize, applyToDocument])

  // Persist font size and optional theme choices atomically
  const applyDisplaySettings = useCallback(
    async (options: { fontSize: FontSizePreference; theme?: string }): Promise<boolean> => {
      setIsLoading(true)
      try {
        const { fontSize: size, theme } = options
        setFontSizeState(size)
        setPreviewSize(size)
        applyToDocument(size)

        if (typeof window !== "undefined") {
          localStorage.setItem("app_font_size", size)
          if (theme) {
            localStorage.setItem("theme", theme)
          }
        }

        if (doctor) {
          const res = await updateMySettings({
            fontSize: size,
            ...(theme ? { theme } : {}),
          })
          if (res.status === "SUCCESS") {
            setHasPersistedSetting(true)
            // Update doctor in localStorage
            const updatedDoctor = {
              ...doctor,
              settings: {
                ...(doctor.settings || {}),
                fontSize: size,
                ...(theme ? { theme } : {}),
              },
            }
            if (typeof window !== "undefined") {
              localStorage.setItem("doctor", JSON.stringify(updatedDoctor))
              window.dispatchEvent(new CustomEvent("auth-user-updated"))
            }
            return true
          }
        }
        setHasPersistedSetting(true)
        return true
      } catch (err) {
        console.error("Failed to persist display settings:", err)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [doctor, updateMySettings, applyToDocument]
  )

  const applyFontSize = useCallback(
    async (size: FontSizePreference): Promise<boolean> => {
      return applyDisplaySettings({ fontSize: size })
    },
    [applyDisplaySettings]
  )

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        previewSize,
        hasPersistedSetting,
        setPreview,
        applyFontSize,
        applyDisplaySettings,
        resetPreview,
        isLoading,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  )
}

export function useFontSize() {
  const context = useContext(FontSizeContext)
  if (!context) {
    throw new Error("useFontSize must be used within a FontSizeProvider")
  }
  return context
}
