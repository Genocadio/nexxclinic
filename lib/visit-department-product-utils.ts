import type { VisitDepartment } from '@/lib/api-types'

export type VisitDepartmentProductOption = {
  /** Catalog department id — passed to addVisitDepartmentProduct mutation */
  id: string
  name: string
  visitDepartmentId: string
}

export function buildVisitDepartmentProductOptions(
  visitDepartments: VisitDepartment[] = [],
): VisitDepartmentProductOption[] {
  return visitDepartments
    .filter((dept) => dept.status !== 'CANCELLED')
    .map((dept) => ({
      id: String(dept.department?.id || dept.id),
      name: dept.department?.name || 'General',
      visitDepartmentId: String(dept.id),
    }))
}

export function resolveCatalogDepartmentIdForService(
  visitDepartments: VisitDepartment[] = [],
  serviceName?: string,
): string | undefined {
  if (!serviceName) return undefined
  const match = visitDepartments.find(
    (dept) => (dept.department?.name || 'General') === serviceName,
  )
  return match?.department?.id ? String(match.department.id) : undefined
}

export function collectExistingProductReferenceIds(
  visitDepartments: VisitDepartment[] = [],
): string[] {
  const ids = new Set<string>()
  const walk = (departments: VisitDepartment[]) => {
    for (const dept of departments) {
      for (const line of dept.products || []) {
        if (line.product?.id) ids.add(String(line.product.id))
      }
      walk(dept.childVisitDepartments || [])
    }
  }
  walk(visitDepartments)
  return Array.from(ids)
}
