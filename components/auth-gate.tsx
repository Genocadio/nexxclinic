"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useAuth } from "@/lib/auth-context"
import { canManagerAccessAdminPath, getPostLoginPath, hasAdminAccess, isManagerOnly, isManagerWithoutAdmin } from "@/lib/role-utils"

const publicRoutes = new Set(["/auth", "/create-password"])

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading, doctor } = useAuth()

  const isPublicRoute = pathname ? publicRoutes.has(pathname) : false
  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const isAdminRoute = pathname?.startsWith("/admin") || false
  const canAccessAdmin = hasAdminAccess(roles)
  const managerOnly = isManagerOnly(roles)
  const managerWithoutAdmin = isManagerWithoutAdmin(roles)

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!isPublicRoute && !isAuthenticated) {
      router.replace("/auth")
      return
    }

    if (isAuthenticated && isAdminRoute && !canAccessAdmin) {
      router.replace("/")
      return
    }

    if (isAuthenticated && managerWithoutAdmin && isAdminRoute && !canManagerAccessAdminPath(pathname ?? null)) {
      router.replace("/admin")
      return
    }

    if (isAuthenticated && managerOnly && !isAdminRoute && pathname !== "/account") {
      router.replace("/admin")
      return
    }

    if ((pathname === "/auth" || pathname === "/create-password") && isAuthenticated) {
      router.replace(getPostLoginPath(roles))
    }
  }, [canAccessAdmin, isAdminRoute, isAuthenticated, isLoading, isPublicRoute, managerOnly, managerWithoutAdmin, pathname, roles, router])

  if (isPublicRoute) {
    return <>{children}</>
  }

  if (isLoading || !isAuthenticated) {
    return null
  }

  return <>{children}</>
}