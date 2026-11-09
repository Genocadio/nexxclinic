"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTheme, type ThemePreference } from "@/lib/theme-context"
import { useUpdateMySettings } from "@/hooks/auth-hooks"
import { FontSizeOnboardingDialog } from "@/components/font-size-onboarding-dialog"

export function UserSettingsSync() {
  const { doctor } = useAuth()
  const { preference, setThemePreference } = useTheme()
  const { updateMySettings } = useUpdateMySettings()

  // Track the last synced theme from doctor to prevent loop
  const lastSyncedDoctorId = useRef<string | null>(null)

  // 1. Restore theme from doctor settings on login / doctor change
  useEffect(() => {
    if (!doctor) {
      lastSyncedDoctorId.current = null
      return
    }

    if (lastSyncedDoctorId.current !== doctor.id) {
      lastSyncedDoctorId.current = doctor.id
      const dbTheme = doctor.settings?.theme?.toLowerCase() as ThemePreference | undefined
      if (dbTheme && (dbTheme === "light" || dbTheme === "dark" || dbTheme === "system")) {
        if (dbTheme !== preference) {
          setThemePreference(dbTheme)
        }
      }
    }
  }, [doctor, preference, setThemePreference])

  // 2. Persist theme to DB whenever user changes theme
  useEffect(() => {
    const handleThemeChange = async (e: Event) => {
      const customEvent = e as CustomEvent<ThemePreference>
      const newTheme = customEvent.detail
      if (!doctor || !newTheme) return

      // Don't re-save if it matches current DB setting
      if (doctor.settings?.theme === newTheme) return

      try {
        await updateMySettings({ theme: newTheme })
        // Update local doctor cache
        const updatedDoctor = {
          ...doctor,
          settings: {
            ...(doctor.settings || {}),
            theme: newTheme,
          },
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("doctor", JSON.stringify(updatedDoctor))
          window.dispatchEvent(new CustomEvent("auth-user-updated"))
        }
      } catch (err) {
        console.error("Failed to persist theme setting:", err)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("theme-preference-changed", handleThemeChange as EventListener)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("theme-preference-changed", handleThemeChange as EventListener)
      }
    }
  }, [doctor, updateMySettings])

  return <FontSizeOnboardingDialog />
}
