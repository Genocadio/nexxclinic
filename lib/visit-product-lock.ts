export const VISIT_PRODUCT_CHANGES_LOCKED_MESSAGE =
  'This visit or department is completed. You can still edit form answers; products are view-only.'

export function isVisitOrDepartmentClosedForProducts(
  visitStatus?: string | null,
  visitDepartmentStatus?: string | null
): boolean {
  const normalizedVisitStatus = String(visitStatus || '').toUpperCase()
  const normalizedDepartmentStatus = String(visitDepartmentStatus || '').toUpperCase()

  return (
    normalizedVisitStatus === 'COMPLETED' ||
    normalizedVisitStatus === 'CANCELLED' ||
    normalizedDepartmentStatus === 'COMPLETED' ||
    normalizedDepartmentStatus === 'CANCELLED'
  )
}
