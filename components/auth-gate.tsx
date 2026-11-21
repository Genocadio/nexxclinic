"use client"

import type React from "react"

import { useEffect, useMemo, useRef } from "react"
import { usePathname, useRouter } from "@/lib/navigation"

import { useAuth } from "@/lib/auth-context"
import { getPostLoginPath, hasAdminAccess } from "@/lib/role-utils"
import { AppLoadingState } from "@/components/ui/app-loading-state"
import { PageLoading } from "@/components/ui/page-loading"

const publicRoutes = new Set(["/auth", "/create-password"])

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading, doctor } = useAuth()
  const redirectTargetRef = useRef<string | null>(null)

  const isPublicRoute = pathname ? publicRoutes.has(pathname) : false
  const roles = useMemo(() => doctor?.roles ?? [], [doctor])
  const isAdminRoute = pathname?.startsWith("/admin") || false
  const canAccessAdmin = hasAdminAccess(roles)

  useEffect(() => {
    if (isLoading) {
      return
    }

    let redirectTarget: string | null = null

    if (!isPublicRoute && !isAuthenticated) {
      redirectTarget = "/auth"
    } else if (isAuthenticated && isAdminRoute && !canAccessAdmin) {
      // Admin paths are restricted to ADMIN role only.
      redirectTarget = "/"
    } else if ((pathname === "/auth" || pathname === "/create-password") && isAuthenticated) {
      redirectTarget = getPostLoginPath(roles)
    }

    if (!redirectTarget) {
      redirectTargetRef.current = null
      return
    }

    if (redirectTargetRef.current !== redirectTarget) {
      redirectTargetRef.current = redirectTarget
      router.replace(redirectTarget)
    }
  }, [canAccessAdmin, isAdminRoute, isAuthenticated, isLoading, isPublicRoute, pathname, roles, router])

  if (isPublicRoute) {
    return <>{children}</>
  }

  if (isLoading) {
    if (pathname === "/") {
      return <PageLoading variant="dashboard" />
    }
    return <AppLoadingState />
  }

  if (!isAuthenticated) {
    return <AppLoadingState message="Opening sign in…" />
  }

  return <>{children}</>
}