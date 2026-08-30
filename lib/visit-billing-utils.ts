/**
 * Visit billing helpers aligned with user.graphqls VisitBilling → VisitDepartmentBilling → DepartmentInsuranceBilling.
 */

import {
  DepartmentInsurancePolicyMode,
  EncounterType,
  Gender,
  VisitBillingStatus,
  VisitDepartmentStatus,
  type DepartmentInsuranceBilling,
  type VisitBilling,
  type VisitBillingItem,
  type VisitBillingPayment,
  type VisitDepartment,
  type VisitDepartmentBilling,
} from "@/lib/api-types";

export type VisitBillingTotals = {
  totalAmount: number;
  insuranceCoveredAmount: number;
  patientPayableAmount: number;
  paidAmount: number;
  outstandingAmount: number;
};

const EMPTY_TS = "";

/** Minimal visit department when billing query omits nested visitDepartment fields. */
function emptyVisitDepartmentStub(id = "", name?: string | null): VisitDepartment {
  return {
    id,
    department: {
      id: "",
      name: name || "",
      insurancePolicyMode: DepartmentInsurancePolicyMode.ALL,
      insurancePolicies: [],
      profiles: [],
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
  };
}

export type GqlVisitBillingItem = {
  id: string;
  visitDepartmentProductId: string;
  productId: string;
  productName: string;
  unitPriceSnapshot: number;
  quantitySnapshot: number;
  insuranceCoveredAmount: number;
  patientPayableAmount: number;
  appliedPatientSharePct?: number | null;
  patientShareSource?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type GqlPatientInsuranceRef = {
  id: string;
  insuranceCardNumber?: string | null;
  principalMemberName?: string | null;
  deactivated?: boolean | null;
  insuranceProvider?: {
    id: string;
    insuranceName?: string | null;
    acronym?: string | null;
  } | null;
};

export type GqlBillingPayment = {
  id: string;
  amount: number;
  paymentMethod: string;
  reference?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type GqlDepartmentInsuranceBilling = {
  id: string;
  status: string;
  totalAmount: number;
  insuranceCoveredAmount: number;
  patientPayableAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  outstandingType?: string | null;
  outstandingReason?: string | null;
  items?: GqlVisitBillingItem[] | null;
  patientInsurance?: GqlPatientInsuranceRef | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type GqlVisitDepartmentBilling = {
  id: string;
  status: string;
  totalAmount: number;
  insuranceCoveredAmount: number;
  patientPayableAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  insuranceBillings?: GqlDepartmentInsuranceBilling[] | null;
  visitDepartment?: {
    id: string;
    status?: string | null;
    department?: { id: string; name?: string | null } | null;
  } | null;
  payments?: GqlBillingPayment[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type GqlVisitBilling = {
  id: string;
  visitId: string;
  version?: { id: string; version: number } | null;
  departments?: GqlVisitDepartmentBilling[] | null;
  createdAt: string;
  updatedAt: string;
};

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
    appliedPatientSharePct: item.appliedPatientSharePct ?? null,
    patientShareSource: (item.patientShareSource as VisitBillingItem['patientShareSource']) ?? null,
    createdAt: item.createdAt || EMPTY_TS,
    updatedAt: item.updatedAt || EMPTY_TS,
  };
}

function mapGqlPatientInsuranceRef(
  insurance?: GqlPatientInsuranceRef | null,
): DepartmentInsuranceBilling["patientInsurance"] {
  if (!insurance?.id) return null;
  const provider = insurance.insuranceProvider;
  return {
    id: insurance.id,
    insuranceCardNumber: insurance.insuranceCardNumber || "",
    providingCompanyOrEmployer: null,
    principalMember: false,
    principalMemberName: insurance.principalMemberName,
    principalMemberPhoneNumber: null,
    validFrom: "",
    validUntil: "",
    deactivated: Boolean(insurance.deactivated),
    insuranceProvider: {
      id: provider?.id || "",
      insuranceName: provider?.insuranceName || "",
      acronym: provider?.acronym,
      coverages: [],
      supportedByClinic: true,
      createdAt: EMPTY_TS,
      updatedAt: EMPTY_TS,
      name: provider?.insuranceName || "",
    },
    patient: {
      id: "",
      firstName: "",
      dateOfBirth: "",
      gender: Gender.OTHER,
      patientInsurances: [],
      createdAt: EMPTY_TS,
      updatedAt: EMPTY_TS,
    },
    createdAt: EMPTY_TS,
    updatedAt: EMPTY_TS,
  };
}

function mapGqlDepartmentInsuranceBilling(
  billing: GqlDepartmentInsuranceBilling,
): DepartmentInsuranceBilling {
  return {
    id: billing.id,
    patientInsurance: mapGqlPatientInsuranceRef(billing.patientInsurance),
    status: billing.status as VisitBillingStatus,
    totalAmount: Number(billing.totalAmount ?? 0),
    insuranceCoveredAmount: Number(billing.insuranceCoveredAmount ?? 0),
    patientPayableAmount: Number(billing.patientPayableAmount ?? 0),
    paidAmount: Number(billing.paidAmount ?? 0),
    outstandingAmount: Number(billing.outstandingAmount ?? 0),
    outstandingType: billing.outstandingType || null,
    outstandingReason: billing.outstandingReason || null,
    items: (billing.items || []).map(mapGqlVisitBillingItem),
    createdAt: billing.createdAt || EMPTY_TS,
    updatedAt: billing.updatedAt || EMPTY_TS,
  };
}

function mapGqlVisitDepartmentBilling(
  department: GqlVisitDepartmentBilling,
): VisitDepartmentBilling {
  return {
    id: department.id,
    visitDepartment: emptyVisitDepartmentStub(
      department.visitDepartment?.id || department.id,
      department.visitDepartment?.department?.name,
    ),
    status: department.status as VisitBillingStatus,
    totalAmount: Number(department.totalAmount ?? 0),
    insuranceCoveredAmount: Number(department.insuranceCoveredAmount ?? 0),
    patientPayableAmount: Number(department.patientPayableAmount ?? 0),
    paidAmount: Number(department.paidAmount ?? 0),
    outstandingAmount: Number(department.outstandingAmount ?? 0),
    payments: (department.payments || []).map((payment) => ({
      id: payment.id,
      amount: Number(payment.amount ?? 0),
      paymentMethod: payment.paymentMethod as VisitBillingPayment["paymentMethod"],
      reference: payment.reference,
      createdAt: payment.createdAt || EMPTY_TS,
      updatedAt: payment.updatedAt || EMPTY_TS,
    })),
    insuranceBillings: (department.insuranceBillings || []).map(
      mapGqlDepartmentInsuranceBilling,
    ),
    createdAt: department.createdAt || EMPTY_TS,
    updatedAt: department.updatedAt || EMPTY_TS,
  };
}

export function mapGqlVisitBilling(data: GqlVisitBilling): VisitBilling {
  return {
    id: data.id,
    visitId: data.visitId,
    version: data.version
      ? { id: data.version.id, version: Number(data.version.version ?? 0) }
      : undefined,
    departments: (data.departments || []).map(mapGqlVisitDepartmentBilling),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function flattenDepartmentInsuranceBillings(
  visitBilling: VisitBilling | null | undefined,
): DepartmentInsuranceBilling[] {
  if (!visitBilling) return [];
  return (visitBilling.departments || []).flatMap(
    (dept) => dept.insuranceBillings || [],
  );
}

export function flattenVisitBillingItems(
  visitBilling: VisitBilling | null | undefined,
): VisitBillingItem[] {
  return flattenDepartmentInsuranceBillings(visitBilling).flatMap(
    (ib) => ib.items || [],
  );
}

export function getLatestDepartmentInsuranceBilling(
  visitBilling: VisitBilling | null | undefined,
): DepartmentInsuranceBilling | undefined {
  const all = flattenDepartmentInsuranceBillings(visitBilling);
  return all.length > 0 ? all[all.length - 1] : undefined;
}

export function getLatestDepartmentInsuranceBillingId(
  visitBilling: VisitBilling | null | undefined,
): string | undefined {
  return getLatestDepartmentInsuranceBilling(visitBilling)?.id;
}

export function getVisitBillingTotals(
  visitBilling: VisitBilling | null | undefined,
): VisitBillingTotals {
  const insuranceBillings = flattenDepartmentInsuranceBillings(visitBilling);
  const totalAmount = insuranceBillings.reduce(
    (sum, ib) => sum + Number(ib.totalAmount || 0),
    0,
  );
  const insuranceCoveredAmount = insuranceBillings.reduce(
    (sum, ib) => sum + Number(ib.insuranceCoveredAmount || 0),
    0,
  );
  const patientPayableAmount = insuranceBillings.reduce(
    (sum, ib) => sum + Number(ib.patientPayableAmount || 0),
    0,
  );
  const paidAmount = insuranceBillings.reduce(
    (sum, ib) => sum + Number(ib.paidAmount || 0),
    0,
  );
  const outstandingAmount = insuranceBillings.reduce(
    (sum, ib) => sum + Number(ib.outstandingAmount || 0),
    0,
  );

  return {
    totalAmount,
    insuranceCoveredAmount,
    patientPayableAmount,
    paidAmount,
    // Outstanding is the patient's residual only (patient payable minus paid).
    // It must never include the insurance-contributed amount, so if the
    // backend's reported outstanding is missing/zero, derive it from the
    // patient payable rather than the service total.
    outstandingAmount:
      outstandingAmount || Math.max(0, patientPayableAmount - paidAmount),
  };
}

export function isVisitDepartmentProductBilled(
  visitBilling: VisitBilling | null | undefined,
  visitDepartmentProductId: string,
): boolean {
  return flattenVisitBillingItems(visitBilling).some(
    (item) => item.visitDepartmentProductId === visitDepartmentProductId,
  );
}

export function visitBillingLineTotal(item: VisitBillingItem): number {
  return (
    Number(item.unitPriceSnapshot || 0) * Number(item.quantitySnapshot || 0)
  );
}

/** @deprecated Use VisitProductStatus on visit department products instead */
export function isVisitBillingFullyPaid(
  visitBilling: VisitBilling | null | undefined,
): boolean {
  const totals = getVisitBillingTotals(visitBilling);
  return totals.totalAmount > 0 && totals.paidAmount >= totals.totalAmount;
}
