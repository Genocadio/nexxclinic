'use client'

import { useMemo } from 'react'
import type { VisitDepartment } from '@/lib/api-types'
import AddActionConsumableModal from '@/components/add-action-consumable-modal'
import {
  buildVisitDepartmentProductOptions,
  collectExistingProductReferenceIds,
  resolveCatalogDepartmentIdForService,
} from '@/lib/visit-department-product-utils'

type ProductPickerItem = {
  id: string
  name: string
}

type AddVisitDepartmentProductModalProps = {
  open: boolean
  onClose: () => void
  visitDepartments?: VisitDepartment[]
  /** Active service tab name (billing) or department name (consultation) */
  activeServiceName?: string
  /** When set, locks product add to this catalog department id */
  currentCatalogDepartmentId?: string
  viewMode?: 'all' | 'service'
  onAdd: (
    type: 'action' | 'consumable',
    item: ProductPickerItem,
    quantity: number,
    catalogDepartmentId: string,
  ) => void | Promise<void>
  existingProductReferenceIds?: string[]
  isSubmitting?: boolean
}

/**
 * Shared product picker used in consultation (product listener) and billing.
 * Wraps the spotlight search UI from add-action-consumable-modal.
 */
export function AddVisitDepartmentProductModal({
  open,
  onClose,
  visitDepartments = [],
  activeServiceName,
  currentCatalogDepartmentId,
  viewMode = 'service',
  onAdd,
  existingProductReferenceIds,
  isSubmitting = false,
}: AddVisitDepartmentProductModalProps) {
  const departmentOptions = useMemo(
    () => buildVisitDepartmentProductOptions(visitDepartments),
    [visitDepartments],
  )

  const resolvedCurrentDepartmentId = useMemo(() => {
    if (currentCatalogDepartmentId) return currentCatalogDepartmentId
    return resolveCatalogDepartmentIdForService(visitDepartments, activeServiceName)
  }, [currentCatalogDepartmentId, visitDepartments, activeServiceName])

  const resolvedExistingIds = useMemo(
    () => existingProductReferenceIds ?? collectExistingProductReferenceIds(visitDepartments),
    [existingProductReferenceIds, visitDepartments],
  )

  return (
    <AddActionConsumableModal
      isOpen={open}
      onClose={onClose}
      departments={departmentOptions.map(({ id, name }) => ({ id, name }))}
      currentDepartmentId={resolvedCurrentDepartmentId}
      viewMode={viewMode}
      onAdd={onAdd}
      existingProductReferenceIds={resolvedExistingIds}
      isSubmitting={isSubmitting}
    />
  )
}

export default AddVisitDepartmentProductModal
