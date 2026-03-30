"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useAuth } from "@/lib/auth-context"

const publicRoutes = new Set(["/auth", "/create-password"])

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading, doctor } = useAuth()

  const isPublicRoute = pathname ? publicRoutes.has(pathname) : false
  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const isAdminRoute = pathname?.startsWith("/admin") || false
  const hasAdminRole = roles.includes("ADMIN")

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!isPublicRoute && !isAuthenticated) {
      router.replace("/auth")
      return
    }

    if (isAuthenticated && isAdminRoute && !hasAdminRole) {
      router.replace("/")
      return
    }

    if ((pathname === "/auth" || pathname === "/create-password") && isAuthenticated) {
      router.replace("/")
    }
  }, [hasAdminRole, isAdminRoute, isAuthenticated, isLoading, isPublicRoute, pathname, router])

  if (isPublicRoute) {
    return <>{children}</>
  }

  if (isLoading || !isAuthenticated) {
    return null
  }

  return <>{children}</>
}