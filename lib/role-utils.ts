export const ADMIN_ROLE = "ADMIN"
export const MANAGER_ROLE = "MANAGER"

export const hasRole = (roles: string[], role: string) => roles.includes(role)

export const hasAdminAccess = (roles: string[]) => hasRole(roles, ADMIN_ROLE) || hasRole(roles, MANAGER_ROLE)

export const isManagerOnly = (roles: string[]) => hasRole(roles, MANAGER_ROLE) && roles.length === 1

export const isManagerWithoutAdmin = (roles: string[]) => hasRole(roles, MANAGER_ROLE) && !hasRole(roles, ADMIN_ROLE)

export const canManageAdminUsers = (roles: string[]) => hasRole(roles, ADMIN_ROLE)

export const canManagerAccessAdminPath = (pathname: string | null) => {
  if (!pathname) return false
  return pathname === "/admin" || pathname.startsWith("/admin/users")
}

export const getPostLoginPath = (roles: string[]) => (isManagerOnly(roles) ? "/admin" : "/")