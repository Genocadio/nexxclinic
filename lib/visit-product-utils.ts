import type { Visit, VisitDepartment, VisitDepartmentProduct } from "@/lib/api-types"
import { VisitProductStatus } from "@/lib/api-types"

/** Flatten parent and child visit departments (depth-first). */
export function flattenVisitDepartments(
  departments: VisitDepartment[] = [],
): VisitDepartment[] {
  const flattened: VisitDepartment[] = []
  const stack = [...departments]
  while (stack.length > 0) {
    const current = stack.shift()
    if (!current) continue
    flattened.push(current)
    if (current.childVisitDepartments?.length) {
      stack.push(...current.childVisitDepartments)
    }
  }
  return flattened
}

export function getAllVisitDepartmentProducts(visit: Visit): VisitDepartmentProduct[] {
  return flattenVisitDepartments(visit.departments || []).flatMap((dept) => dept.products || [])
}

export function normalizeVisitProductStatus(status?: string | VisitProductStatus): string {
  return String(status || "").toUpperCase()
}

export function isUnbilledVisitProductStatus(status?: string | VisitProductStatus): boolean {
  const normalized = normalizeVisitProductStatus(status)
  return (
    normalized === VisitProductStatus.UNPAID ||
    normalized === VisitProductStatus.PENDING
  )
}

export function isBilledVisitProductStatus(status?: string | VisitProductStatus): boolean {
  return normalizeVisitProductStatus(status) === VisitProductStatus.BILLED
}

export function visitHasUnbilledProducts(visit: Visit): boolean {
  return getAllVisitDepartmentProducts(visit).some((product) =>
    isUnbilledVisitProductStatus(product.status),
  )
}

export function visitHasBillableProducts(visit: Visit): boolean {
  return getAllVisitDepartmentProducts(visit).length > 0
}

export function visitProductsFullySettled(visit: Visit): boolean {
  const products = getAllVisitDepartmentProducts(visit)
  if (products.length === 0) return false
  return products.every((product) => {
    const status = normalizeVisitProductStatus(product.status)
    return status === VisitProductStatus.BILLED || status === VisitProductStatus.EXEMPTED
  })
}

export function countUnbilledVisitProducts(visit: Visit): number {
  return getAllVisitDepartmentProducts(visit).filter((product) =>
    isUnbilledVisitProductStatus(product.status),
  ).length
}

export function countBilledVisitProducts(visit: Visit): number {
  return getAllVisitDepartmentProducts(visit).filter((product) =>
    isBilledVisitProductStatus(product.status),
  ).length
}

export function getUnbilledVisitProductNames(visit: Visit): string[] {
  return getAllVisitDepartmentProducts(visit)
    .filter((product) => isUnbilledVisitProductStatus(product.status))
    .map((product) => product.product?.name || "Product")
}

export function getBilledVisitProductNames(visit: Visit): string[] {
  return getAllVisitDepartmentProducts(visit)
    .filter((product) => isBilledVisitProductStatus(product.status))
    .map((product) => product.product?.name || "Product")
}

export function getDepartmentsReadyForBilling(visit: Visit): string[] {
  return flattenVisitDepartments(visit.departments || [])
    .filter((dept) => normalizeVisitProductStatus(dept.status) === "BILLING")
    .map((dept) => dept.department?.name || "Department")
}

export function visitHasDepartmentReadyForBilling(visit: Visit): boolean {
  return getDepartmentsReadyForBilling(visit).length > 0
}

/** Visit-level billing summary derived from department products (GraphQL Visit has no billingStatus). */
export type DerivedVisitBillingStatus = "BILLED" | "BILLING" | "PENDING"

export function getDerivedVisitBillingStatus(visit: Visit): DerivedVisitBillingStatus {
  if (visitProductsFullySettled(visit)) return "BILLED"
  if (visitHasDepartmentReadyForBilling(visit)) return "BILLING"
  return "PENDING"
}
