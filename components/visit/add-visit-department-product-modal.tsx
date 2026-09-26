'use client'

import { useMemo } from 'react'
import type { VisitDepartment } from '@/lib/api-types'
import AddActionConsumableModal from '@/components/add-action-consumable-modal'
import {
  buildVisitDepartmentProductOptions,
  collectExistingProductReferenceIds,
  resolveCatalogDepartmentIdForService,
  resolveVisitDepartmentIdForService,
} from '@/lib/visit-department-product-utils'

type ProductPickerItem = {
  id: string
  name: string
  clinicPrice?: number | null
  privateRhicPrice?: number | null
}

type PatientInsurance = {
  id: string
  insuranceProvider: {
    id: string
    insuranceName: string
    acronym?: string | null
    coverages: { patientSharePercentage: number }[]
  }
}

type Processor = {
  id: string
  firstName: string
  lastName?: string | null
}

type AddVisitDepartmentProductModalProps = {
  open: boolean
  onClose: () => void
  visitDepartments?: VisitDepartment[]
  visitDepartmentId?: string
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
    processorId?: string,
  ) => void | Promise<void>
  existingProductReferenceIds?: string[]
  isSubmitting?: boolean
  linkedInsurances?: PatientInsurance[]
}

/**
 * Shared product picker used in consultation (product listener) and billing.
 * Wraps the spotlight search UI from add-action-consumable-modal.
 */
export function AddVisitDepartmentProductModal({
  open,
  onClose,
  visitDepartments = [],
  visitDepartmentId,
  activeServiceName,
  currentCatalogDepartmentId,
  viewMode = 'service',
  onAdd,
  existingProductReferenceIds,
  isSubmitting = false,
  linkedInsurances = [],
}: AddVisitDepartmentProductModalProps) {
  const departmentOptions = useMemo(
    () => buildVisitDepartmentProductOptions(visitDepartments),
    [visitDepartments],
  )

  const resolvedCurrentDepartmentId = useMemo(() => {
    if (currentCatalogDepartmentId) return currentCatalogDepartmentId
    return resolveCatalogDepartmentIdForService(visitDepartments, activeServiceName)
  }, [currentCatalogDepartmentId, visitDepartments, activeServiceName])

  const resolvedVisitDepartmentId = useMemo(() => {
    if (visitDepartmentId) return visitDepartmentId
    if (activeServiceName) {
      const fromService = resolveVisitDepartmentIdForService(visitDepartments, activeServiceName)
      if (fromService) return fromService
    }
    const activeDept = visitDepartments.find(
      (dept) =>
        String(dept.department?.id) === String(resolvedCurrentDepartmentId) ||
        String(dept.id) === String(resolvedCurrentDepartmentId),
    )
    return activeDept ? String(activeDept.id) : undefined
  }, [visitDepartmentId, activeServiceName, visitDepartments, resolvedCurrentDepartmentId])

  // Resolve processors from the active visit department
  const activeProcessors = useMemo(() => {
    const activeDept = visitDepartments.find(
      (dept) => String(dept.department?.id) === String(resolvedCurrentDepartmentId),
    )
    return activeDept?.processors || []
  }, [visitDepartments, resolvedCurrentDepartmentId])

  const resolvedExistingIds = useMemo(
    () => existingProductReferenceIds ?? collectExistingProductReferenceIds(visitDepartments),
    [existingProductReferenceIds, visitDepartments],
  )

  return (
    <AddActionConsumableModal
      isOpen={open}
      onClose={onClose}
      departments={departmentOptions.map(({ id, name, visitDepartmentId }) => ({ id, name, visitDepartmentId }))}
      currentDepartmentId={resolvedCurrentDepartmentId}
      visitDepartmentId={resolvedVisitDepartmentId}
      viewMode={viewMode}
      onAdd={onAdd}
      existingProductReferenceIds={resolvedExistingIds}
      isSubmitting={isSubmitting}
      linkedInsurances={linkedInsurances}
      processors={activeProcessors}
    />
  )
}

export default AddVisitDepartmentProductModal
