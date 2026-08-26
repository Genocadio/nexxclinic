"use client"

import { useEffect, useCallback } from "react"

interface ShortcutMap {
  [key: string]: () => void
}

/**
 * Registers global keyboard shortcuts. Shortcuts are disabled while the user
 * is typing in an input, textarea, or select element to avoid conflicts.
 *
 * @example
 *   useKeyboardShortcuts({
 *     "ctrl+s": () => handleSave(),
 *     "ctrl+p": () => handlePrint(),
 *     "escape": () => handleCloseModal(),
 *   })
 */
export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      // Don't fire shortcuts while typing in form fields
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return

      // Build the pressed key string
      const parts: string[] = []
      if (e.ctrlKey || e.metaKey) parts.push("ctrl")
      if (e.shiftKey) parts.push("shift")
      if (e.altKey) parts.push("alt")
      parts.push(e.key.toLowerCase())
      const combo = parts.join("+")

      const action = shortcuts[combo]
      if (action) {
        e.preventDefault()
        action()
      }
    },
    [shortcuts],
  )

  useEffect(() => {
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handler])
}
