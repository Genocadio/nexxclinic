/**
 * Visit billing helpers aligned with user.graphqls VisitBilling → VisitDepartmentBilling → DepartmentInsuranceBilling.
 */

import {
  DepartmentInsurancePolicyMode,
  EncounterType,
  VisitBillingStatus,
  VisitDepartmentStatus,
  VisitProductStatus,
  type DepartmentInsuranceBilling,
  type VisitBilling,
  type VisitBillingItem,
  type VisitDepartment,
  type VisitDepartmentBilling,
} from "@/lib/api-types"

export type VisitBillingTotals = {
  totalAmount: number
  insuranceCoveredAmount: number
  patientPayableAmount: number
  paidAmount: number
  outstandingAmount: number
}

const EMPTY_TS = ""

/** Minimal visit department when billing query omits nested visitDepartment fields. */
function emptyVisitDepartmentStub(id = ""): VisitDepartment {
  return {
    id,
    department: {
      id: "",
      name: "",
      insurancePolicyMode: DepartmentInsurancePolicyMode.ALL,
      insurancePolicies: [],
      defaultProducts: [],
      nursing: false,
      supportRequests: false,
      requestsProducts: false,
      createdAt: EMPTY_TS,
      updatedAt: EMPTY_TS,
    },
    status: VisitDepartmentStatus.PENDING,
    encounterType: EncounterType.OUTPATIENT,
    processors: [],
    childVisitDepartments: [],
    products: [],
    preInstructions: [],
    createdAt: EMPTY_TS,
    updatedAt: EMPTY_TS,
  }
}

export type GqlVisitBillingItem = {
  id: string
  visitDepartmentProductId: string
  productId: string
  productName: string
  unitPriceSnapshot: number
  quantitySnapshot: number
  insuranceCoveredAmount: number
  patientPayableAmount: number
  createdAt?: string | null
  updatedAt?: string | null
}

export type GqlDepartmentInsuranceBilling = {
  id: string
  status: string
  totalAmount: number
  insuranceCoveredAmount: number
  patientPayableAmount: number
  paidAmount: number
  outstandingAmount: number
  invoiceUrl?: string | null
  items?: GqlVisitBillingItem[] | null
  patientInsurance?: unknown | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type GqlVisitDepartmentBilling = {
  id: string
  status: string
  totalAmount: number
  insuranceCoveredAmount: number
  patientPayableAmount: number
  paidAmount: number
  outstandingAmount: number
  insuranceBillings?: GqlDepartmentInsuranceBilling[] | null
  visitDepartment?: { id: string } | null
  payments?: unknown[] | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type GqlVisitBilling = {
  id: string
  visitId: string
  departments?: GqlVisitDepartmentBilling[] | null
  createdAt: string
  updatedAt: string
}

function mapGqlVisitBillingItem(item: GqlVisitBillingItem): VisitBillingItem {
  return {
    id: item.id,
    visitDepartmentProductId: item.visitDepartmentProductId,
    productId: item.productId,
    productName: item.productName,
    unitPriceSnapshot: Number(item.unitPriceSnapshot ?? 0),
    quantitySnapshot: Number(item.quantitySnapshot ?? 0),
    insuranceCoveredAmount: Number(item.insuranceCoveredAmount ?? 0),
    patientPayableAmount: Number(item.patientPayableAmount ?? 0),
    createdAt: item.createdAt || EMPTY_TS,
    updatedAt: item.updatedAt || EMPTY_TS,
  }
}

function mapGqlDepartmentInsuranceBilling(
  billing: GqlDepartmentInsuranceBilling,
): DepartmentInsuranceBilling {
  return {
    id: billing.id,
    patientInsurance: null,
    status: billing.status as VisitBillingStatus,
    totalAmount: Number(billing.totalAmount ?? 0),
    insuranceCoveredAmount: Number(billing.insuranceCoveredAmount ?? 0),
    patientPayableAmount: Number(billing.patientPayableAmount ?? 0),
    paidAmount: Number(billing.paidAmount ?? 0),
    outstandingAmount: Number(billing.outstandingAmount ?? 0),
    invoiceUrl: billing.invoiceUrl,
    items: (billing.items || []).map(mapGqlVisitBillingItem),
    createdAt: billing.createdAt || EMPTY_TS,
    updatedAt: billing.updatedAt || EMPTY_TS,
  }
}

function mapGqlVisitDepartmentBilling(
  department: GqlVisitDepartmentBilling,
): VisitDepartmentBilling {
  return {
    id: department.id,
    visitDepartment: emptyVisitDepartmentStub(department.visitDepartment?.id || department.id),
    status: department.status as VisitBillingStatus,
    totalAmount: Number(department.totalAmount ?? 0),
    insuranceCoveredAmount: Number(department.insuranceCoveredAmount ?? 0),
    patientPayableAmount: Number(department.patientPayableAmount ?? 0),
    paidAmount: Number(department.paidAmount ?? 0),
    outstandingAmount: Number(department.outstandingAmount ?? 0),
    payments: [],
    insuranceBillings: (department.insuranceBillings || []).map(mapGqlDepartmentInsuranceBilling),
    createdAt: department.createdAt || EMPTY_TS,
    updatedAt: department.updatedAt || EMPTY_TS,
  }
}

export function mapGqlVisitBilling(data: GqlVisitBilling): VisitBilling {
  return {
    id: data.id,
    visitId: data.visitId,
    departments: (data.departments || []).map(mapGqlVisitDepartmentBilling),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

export function flattenDepartmentInsuranceBillings(
  visitBilling: VisitBilling | null | undefined,
): DepartmentInsuranceBilling[] {
  if (!visitBilling) return []
  return (visitBilling.departments || []).flatMap((dept) => dept.insuranceBillings || [])
}

export function flattenVisitBillingItems(
  visitBilling: VisitBilling | null | undefined,
): VisitBillingItem[] {
  return flattenDepartmentInsuranceBillings(visitBilling).flatMap((ib) => ib.items || [])
}

export function getLatestDepartmentInsuranceBilling(
  visitBilling: VisitBilling | null | undefined,
): DepartmentInsuranceBilling | undefined {
  const all = flattenDepartmentInsuranceBillings(visitBilling)
  return all.length > 0 ? all[all.length - 1] : undefined
}

export function getLatestDepartmentInsuranceBillingId(
  visitBilling: VisitBilling | null | undefined,
): string | undefined {
  return getLatestDepartmentInsuranceBilling(visitBilling)?.id
}

export function getVisitBillingTotals(
  visitBilling: VisitBilling | null | undefined,
): VisitBillingTotals {
  const insuranceBillings = flattenDepartmentInsuranceBillings(visitBilling)
  const totalAmount = insuranceBillings.reduce((sum, ib) => sum + Number(ib.totalAmount || 0), 0)
  const insuranceCoveredAmount = insuranceBillings.reduce(
    (sum, ib) => sum + Number(ib.insuranceCoveredAmount || 0),
    0,
  )
  const patientPayableAmount = insuranceBillings.reduce(
    (sum, ib) => sum + Number(ib.patientPayableAmount || 0),
    0,
  )
  const paidAmount = insuranceBillings.reduce((sum, ib) => sum + Number(ib.paidAmount || 0), 0)
  const outstandingAmount = insuranceBillings.reduce(
    (sum, ib) => sum + Number(ib.outstandingAmount || 0),
    0,
  )

  return {
    totalAmount,
    insuranceCoveredAmount,
    patientPayableAmount,
    paidAmount,
    outstandingAmount: outstandingAmount || Math.max(0, totalAmount - paidAmount),
  }
}

export function isVisitDepartmentProductBilled(
  visitBilling: VisitBilling | null | undefined,
  visitDepartmentProductId: string,
): boolean {
  return flattenVisitBillingItems(visitBilling).some(
    (item) => item.visitDepartmentProductId === visitDepartmentProductId,
  )
}

export function visitBillingLineTotal(item: VisitBillingItem): number {
  return Number(item.unitPriceSnapshot || 0) * Number(item.quantitySnapshot || 0)
}

/** @deprecated Use VisitProductStatus on visit department products instead */
export function isVisitBillingFullyPaid(visitBilling: VisitBilling | null | undefined): boolean {
  const totals = getVisitBillingTotals(visitBilling)
  return totals.totalAmount > 0 && totals.paidAmount >= totals.totalAmount
}
