"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"
type ThemePreference = Theme | "system"

interface ThemeContextType {
  theme: Theme
  preference: ThemePreference
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const systemThemeQuery = "(prefers-color-scheme: dark)"

function getSystemTheme(): Theme {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia(systemThemeQuery).matches ? "dark" : "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>("system")
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedPreference = localStorage.getItem("theme") as ThemePreference | null
    if (savedPreference === "light" || savedPreference === "dark" || savedPreference === "system") {
      setPreference(savedPreference)
      return
    }

    setPreference("system")
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (preference === "system") {
      const mediaQuery = window.matchMedia(systemThemeQuery)
      const applySystemTheme = () => {
        setTheme(mediaQuery.matches ? "dark" : "light")
      }

      applySystemTheme()
      mediaQuery.addEventListener("change", applySystemTheme)

      return () => {
        mediaQuery.removeEventListener("change", applySystemTheme)
      }
    }

    setTheme(preference)
  }, [mounted, preference])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    root.style.colorScheme = theme
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted) return

    localStorage.setItem("theme", preference)
  }, [mounted, preference])

  const toggleTheme = () => {
    setPreference((prev) => {
      const resolvedTheme = prev === "system" ? getSystemTheme() : prev
      return resolvedTheme === "dark" ? "light" : "dark"
    })
  }

  if (!mounted) {
    return <>{children}</>
  }

  return <ThemeContext.Provider value={{ theme, preference, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    // Return default theme context if not wrapped in provider
    return { theme: "light" as const, preference: "system" as const, toggleTheme: () => {} }
  }
  return context
}
