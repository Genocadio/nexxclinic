import type { Visit, VisitDepartment, VisitDepartmentProduct } from "@/lib/api-types"
import { BillingState, ExemptionType, VisitProductStatus } from "@/lib/api-types"

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

/**
 * Billing lifecycle state of a product, preferring the dedicated `billingState`
 * field when the query provides it, falling back to the legacy combined
 * `status` string otherwise (mutation responses that do not select the field).
 */
export function getVisitProductBillingState(
  product: Pick<VisitDepartmentProduct, "status"> &
    Partial<Pick<VisitDepartmentProduct, "billingState">>,
): BillingState {
  if (product.billingState) return product.billingState
  const status = normalizeVisitProductStatus(product.status)
  if (status === VisitProductStatus.CORRECTION_PENDING) return BillingState.CORRECTING
  if (
    status === VisitProductStatus.BILLED ||
    status === VisitProductStatus.EXEMPTED ||
    status === VisitProductStatus.PATIENT_SHARE_EXEMPTED
  ) {
    return BillingState.BILLED
  }
  return BillingState.UNBILLED
}

/**
 * Exemption mode recorded when the line was billed — only meaningful when the
 * billing state is BILLED. Falls back to the legacy combined `status`.
 */
export function getVisitProductExemptionMode(
  product: Pick<VisitDepartmentProduct, "status"> &
    Partial<Pick<VisitDepartmentProduct, "exemptionMode">>,
): ExemptionType {
  if (product.exemptionMode) return product.exemptionMode
  const status = normalizeVisitProductStatus(product.status)
  if (status === VisitProductStatus.EXEMPTED) return ExemptionType.FULL
  if (status === VisitProductStatus.PATIENT_SHARE_EXEMPTED) return ExemptionType.PATIENT_SHARE
  return ExemptionType.NONE
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
  return getAllVisitDepartmentProducts(visit).some(
    (product) => getVisitProductBillingState(product) === BillingState.UNBILLED,
  )
}

export function visitHasBillableProducts(visit: Visit): boolean {
  return getAllVisitDepartmentProducts(visit).length > 0
}

export function visitProductsFullySettled(visit: Visit): boolean {
  const products = getAllVisitDepartmentProducts(visit)
  if (products.length === 0) return false
  return products.every(
    (product) => getVisitProductBillingState(product) === BillingState.BILLED,
  )
}

export function isPendingConfirmationVisitProduct(product: VisitDepartmentProduct): boolean {
  return product.billingConfirmationStatus === "PENDING_OPERATOR_CONFIRMATION"
}

export function countPendingOperatorConfirmations(visit: Visit): number {
  return getAllVisitDepartmentProducts(visit).filter(isPendingConfirmationVisitProduct).length
}

export function countUnbilledVisitProducts(visit: Visit): number {
  return getAllVisitDepartmentProducts(visit).filter(
    (product) => getVisitProductBillingState(product) === BillingState.UNBILLED,
  ).length
}

export function countBilledVisitProducts(visit: Visit): number {
  return getAllVisitDepartmentProducts(visit).filter(isBilledVisitProduct).length
}

/** Billed as a normal charge: state BILLED with no exemption mode. */
export function isBilledVisitProduct(product: VisitDepartmentProduct): boolean {
  return (
    getVisitProductBillingState(product) === BillingState.BILLED &&
    getVisitProductExemptionMode(product) === ExemptionType.NONE
  )
}

export function getUnbilledVisitProductNames(visit: Visit): string[] {
  return getAllVisitDepartmentProducts(visit)
    .filter((product) => getVisitProductBillingState(product) === BillingState.UNBILLED)
    .map((product) => product.product?.name || "Product")
}

export function getBilledVisitProductNames(visit: Visit): string[] {
  return getAllVisitDepartmentProducts(visit)
    .filter(isBilledVisitProduct)
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

export function getVisitDepartmentBillingStatus(dept: VisitDepartment): string | null {
  if (dept.billing?.status) {
    return dept.billing.status
  }
  const products = dept.products || []
  if (products.length === 0) return null
  const allBilled = products.every(
    (p) => getVisitProductBillingState(p) === BillingState.BILLED,
  )
  if (allBilled) return "BILLED"
  const someBilled = products.some((p) => isBilledVisitProduct(p))
  if (someBilled) return "PARTIALLY_BILLED"
  return "UNBILLED"
}

/** Visit-level billing summary derived from department products (GraphQL Visit has no billingStatus). */
export type DerivedVisitBillingStatus = "BILLED" | "BILLING" | "PENDING"

export function getDerivedVisitBillingStatus(visit: Visit): DerivedVisitBillingStatus {
  if (visitProductsFullySettled(visit)) return "BILLED"
  if (visitHasDepartmentReadyForBilling(visit)) return "BILLING"
  return "PENDING"
}

/** Returns true if a visit is eligible for discharge (all assigned departments are COMPLETED, FINALISED, or CANCELLED, visit has at least one recorded consultation answer, and visit is not already terminal). */
export function canDischargeVisit(visit?: Visit | null): boolean {
  if (!visit) return false
  const visitStatus = String(visit.status || "").toUpperCase()
  if (visitStatus === "COMPLETED" || visitStatus === "CANCELLED" || visitStatus === "FINALISED") {
    return false
  }
  const allDepts = flattenVisitDepartments(visit.departments || [])
  if (allDepts.length === 0) return false

  const hasAnyAnswer = allDepts.some(
    (dept) => Boolean(dept.answerId || dept.hasFinalizedConsultationAnswers),
  )
  if (!hasAnyAnswer) return false

  return allDepts.every((dept) => {
    const status = String(dept.status || "").toUpperCase()
    return status === "COMPLETED" || status === "FINALISED" || status === "CANCELLED"
  })
}

