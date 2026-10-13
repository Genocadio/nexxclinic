export const ADMIN_ROLE = "ADMIN"
export const MANAGER_ROLE = "MANAGER"
export const MEDICAL_REPORTS_ROLE = "MEDICAL_REPORTS"
export const FINANCE_REPORTS_ROLE = "FINANCE_REPORTS"

const ROLE_ALIASES: Record<string, string[]> = {
  ADMIN: ["ADMIN", "CLINIC_ADMIN"],
  CLINIC_ADMIN: ["CLINIC_ADMIN", "ADMIN"],
  RECEPTIONIST: ["RECEPTIONIST", "RECEPTION"],
  RECEPTION: ["RECEPTION", "RECEPTIONIST"],
  DOCTOR: ["DOCTOR", "CLINICIAN"],
  CLINICIAN: ["CLINICIAN", "DOCTOR"],
  OPHTHALMOLOGIST: ["OPHTHALMOLOGIST", "CLINICIAN"],
  SPECIALIST: ["SPECIALIST", "CLINICIAN"],
  FINANCE_REPORTS: ["FINANCE_REPORTS", "FINANCIAL_REPORTS"],
  FINANCIAL_REPORTS: ["FINANCIAL_REPORTS", "FINANCE_REPORTS"],
  MEDICAL_REPORTS: ["MEDICAL_REPORTS", "CLINICAL_REPORTS"],
  CLINICAL_REPORTS: ["CLINICAL_REPORTS", "MEDICAL_REPORTS"],
}

const normalizeRole = (role: string) => role.trim().toUpperCase()

export const hasRole = (roles: string[], role: string) => {
  const normalizedRole = normalizeRole(role)
  const equivalentRoles = ROLE_ALIASES[normalizedRole] || [normalizedRole]
  const normalizedUserRoles = roles.map(normalizeRole)
  return normalizedUserRoles.some((userRole) => equivalentRoles.includes(userRole))
}

export const hasAdminAccess = (roles: string[]) => hasRole(roles, ADMIN_ROLE)

export const hasAdminOrManagerAccess = (roles: string[]) =>
  hasRole(roles, ADMIN_ROLE) || hasRole(roles, MANAGER_ROLE)

export const canAccessFinancialReports = (roles: string[]) =>
  hasRole(roles, ADMIN_ROLE) || hasRole(roles, MANAGER_ROLE) || hasRole(roles, FINANCE_REPORTS_ROLE)

export const canAccessMedicalReports = (roles: string[]) =>
  hasRole(roles, ADMIN_ROLE) || hasRole(roles, MANAGER_ROLE) || hasRole(roles, MEDICAL_REPORTS_ROLE)

export const canAccessAnyClinicReports = (roles: string[]) =>
  canAccessFinancialReports(roles) || canAccessMedicalReports(roles)

export const isManagerOnly = (roles: string[]) => hasRole(roles, MANAGER_ROLE) && roles.length === 1

export const isManagerWithoutAdmin = (roles: string[]) => hasRole(roles, MANAGER_ROLE) && !hasRole(roles, ADMIN_ROLE)

export const canManageAdminUsers = (roles: string[]) => hasRole(roles, ADMIN_ROLE)

/** Managers can access /admin/reports, /reports/financial, /reports/medical, and /admin/users */
export const canManagerAccessAdminPath = (pathname: string | null) => {
  if (!pathname) return false
  return (
    pathname === "/admin/reports" ||
    pathname === "/admin/users" ||
    pathname.startsWith("/reports/financial") ||
    pathname.startsWith("/reports/medical")
  )
}

export const getPostLoginPath = (roles: string[]) => "/"

export const canAccessBilling = (roles: string[]) => {
  // Only users with FINANCE or CASHIER roles can access billing
  return hasRole(roles, "FINANCE") || hasRole(roles, "CASHIER")
}
