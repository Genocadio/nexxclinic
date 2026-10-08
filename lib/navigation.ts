"use client"

import { useMemo } from "react"
import {
  usePathname,
  useRouter as useNextRouter,
  useSearchParams,
} from "next/navigation"

export { usePathname, useSearchParams }

export function notifyNavigationStart(
  href?: string,
  message = "Opening page…",
  slowMessage = "Still opening page…",
) {
  if (typeof window === "undefined") return
  if (href) {
    const target = new URL(href, window.location.href)
    if (
      target.origin !== window.location.origin ||
      `${target.pathname}${target.search}` === `${window.location.pathname}${window.location.search}`
    ) {
      return
    }
  }

  window.dispatchEvent(
    new CustomEvent("app:navigation-start", {
      detail: {
        fromPath: `${window.location.pathname}${window.location.search}`,
        target: href,
        message,
        slowMessage,
      },
    }),
  )
}

export function finishNavigationFeedback() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("app:navigation-end"))
  }
}

export function useRouter() {
  const router = useNextRouter()

  return useMemo(
    () => ({
      ...router,
      push: (href: Parameters<typeof router.push>[0], options?: Parameters<typeof router.push>[1]) => {
        notifyNavigationStart(href)
        router.push(href, options)
      },
      replace: (href: Parameters<typeof router.replace>[0], options?: Parameters<typeof router.replace>[1]) => {
        notifyNavigationStart(href)
        router.replace(href, options)
      },
      back: () => {
        notifyNavigationStart()
        router.back()
      },
      forward: () => {
        notifyNavigationStart()
        router.forward()
      },
    }),
    [router],
  )
}
