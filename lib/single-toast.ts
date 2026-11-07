"use client"

import { toast, type ToastContent, type ToastOptions, type Id } from "react-toastify"

let isPatched = false
let currentActiveToastId: Id | null = null
let lastToastKey = ""
let lastToastTime = 0

function extractTextKey(content: ToastContent<unknown>): string {
  if (typeof content === "string" || typeof content === "number") {
    return String(content).trim()
  }
  return ""
}

/**
 * Ensures only a single toast is ever shown at one time across the application,
 * preventing duplicate or queued toasts from stacking or racing.
 */
export function initSingleToastManager() {
  if (isPatched || typeof window === "undefined") return
  isPatched = true

  const wrapMethod = <T extends (content: ToastContent<any>, options?: ToastOptions<any>) => Id>(
    type: string,
    originalFn: T,
  ): T => {
    return ((content: ToastContent<any>, options?: ToastOptions<any>): Id => {
      const text = extractTextKey(content)
      const dedupeKey = String(options?.toastId || (text ? `${type}:${text}` : ""))
      const now = Date.now()

      // Drop identical toasts fired within a short window or while already active
      if (dedupeKey) {
        if (dedupeKey === lastToastKey && now - lastToastTime < 800) {
          return currentActiveToastId ?? dedupeKey
        }
        if (toast.isActive(dedupeKey)) {
          return dedupeKey
        }
      }

      lastToastKey = dedupeKey
      lastToastTime = now

      // Clear any waiting queue and dismiss any currently visible toast so only ONE toast shows
      toast.clearWaitingQueue()
      if (currentActiveToastId !== null && currentActiveToastId !== dedupeKey) {
        toast.dismiss(currentActiveToastId)
      } else {
        toast.dismiss()
      }

      const nextOptions: ToastOptions<any> = dedupeKey
        ? { ...options, toastId: dedupeKey }
        : { ...options }

      const id = originalFn(content, nextOptions)
      currentActiveToastId = id
      return id
    }) as T
  }

  toast.success = wrapMethod("success", toast.success.bind(toast))
  toast.error = wrapMethod("error", toast.error.bind(toast))
  toast.info = wrapMethod("info", toast.info.bind(toast))
  toast.warn = wrapMethod("warn", toast.warn.bind(toast))
  toast.warning = wrapMethod("warn", toast.warning.bind(toast))

  toast.onChange((payload) => {
    if (payload.status === "added") {
      toast.clearWaitingQueue()
      if (currentActiveToastId !== null && currentActiveToastId !== payload.id) {
        toast.dismiss(currentActiveToastId)
      }
      currentActiveToastId = payload.id
    } else if (payload.status === "removed" && currentActiveToastId === payload.id) {
      currentActiveToastId = null
    }
  })
}
