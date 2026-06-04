export const ADMIN_ROLE = "ADMIN"
export const MANAGER_ROLE = "MANAGER"

const ROLE_ALIASES: Record<string, string[]> = {
  ADMIN: ["ADMIN", "CLINIC_ADMIN"],
  CLINIC_ADMIN: ["CLINIC_ADMIN", "ADMIN"],
  RECEPTIONIST: ["RECEPTIONIST", "RECEPTION"],
  RECEPTION: ["RECEPTION", "RECEPTIONIST"],
  DOCTOR: ["DOCTOR", "CLINICIAN"],
  CLINICIAN: ["CLINICIAN", "DOCTOR"],
  OPHTHALMOLOGIST: ["OPHTHALMOLOGIST", "CLINICIAN"],
  SPECIALIST: ["SPECIALIST", "CLINICIAN"],
}

const normalizeRole = (role: string) => role.trim().toUpperCase()

export const hasRole = (roles: string[], role: string) => {
  const normalizedRole = normalizeRole(role)
  const equivalentRoles = ROLE_ALIASES[normalizedRole] || [normalizedRole]
  const normalizedUserRoles = roles.map(normalizeRole)
  return normalizedUserRoles.some((userRole) => equivalentRoles.includes(userRole))
}

export const hasAdminAccess = (roles: string[]) => hasRole(roles, ADMIN_ROLE) || hasRole(roles, MANAGER_ROLE)

export const isManagerOnly = (roles: string[]) => hasRole(roles, MANAGER_ROLE) && roles.length === 1

export const isManagerWithoutAdmin = (roles: string[]) => hasRole(roles, MANAGER_ROLE) && !hasRole(roles, ADMIN_ROLE)

export const canManageAdminUsers = (roles: string[]) => hasRole(roles, ADMIN_ROLE)

export const canManagerAccessAdminPath = (pathname: string | null) => {
  if (!pathname) return false
  return pathname === "/admin" || pathname.startsWith("/admin/users")
}

export const getPostLoginPath = (roles: string[]) => (isManagerOnly(roles) ? "/admin" : "/")