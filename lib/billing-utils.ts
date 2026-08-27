// Billing Data Structure and Utilities

import {
  fromCents,
  insuranceShareCents,
  lineTotalToCents,
  toCents,
} from "@/lib/money";

export interface BillingItem {
  id: string;
  productId?: string;
  isNewInEditMode?: boolean;
  /** How the product line was added to the visit department. */
  source?: "USER" | "PROFILE" | null;
  name: string;
  quantity: number;
  price: number;
  basePrice?: number;
  insuranceCoverageCosts?: Record<string, number>;
  insuranceCoverageMeta?: Record<string, InsuranceCoverageMeta>;
  insuranceNotCovered?: boolean;
  type: "product";
  visitDepartmentId?: string;
  rootVisitDepartmentId?: string;
  departmentId?: string;
  departmentName?: string;
  childDepartmentName?: string;
  encounterType?: string;
  departmentCompletedTime?: string;
  departmentStatus?: string;
  paymentStatus: "pending" | "paid" | "exempted" | "partial";
  exempted: boolean;
  exemptionType?: "none" | "patient-share" | "full";
  exemptionReason?: string;
  amountPaid?: number;
  selectedInsuranceId?: string; // Can select specific insurance or 'none'
  /** The specific coverage tier selected for this line (optional override). */
  selectedCoverageId?: string;
  /** ID of the processor worker assigned to this product line. */
  processorId?: string;
  /** Name of the processor worker assigned to this product line. */
  processorName?: string;
  /** Applied patient share percentage (0-100) for this line. */
  appliedPatientSharePct?: number | null;
  /** Source of the applied percentage. */
  patientShareSource?: 'OVERRIDE' | 'RULE' | 'PATIENT_DEFAULT' | 'PROVIDER_DEFAULT' | 'EXEMPTED' | null;
  doneBy: {
    name: string;
    title: string;
  };
}

export interface BillingData {
  visitId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientId_Number: string;
  gender: string;
  visitDate: string;
  currency: string; // RWF (Rwanda Franks)
  insurances?: {
    id?: string;
    name: string;
    acronym: string;
    coveragePercentage: number;
  }[];
  items: BillingItem[];
  /**
   * When patient doesn't pay full amount, classify the outstanding:
   * 'loan' = patient still owes (preselected for partial payments)
   * 'giveaway' = clinic absorbs (preselected for exemptions)
   */
  outstandingType?: 'loan' | 'giveaway';
  outstandingReason?: string;
  paymentMethod?:
    | "CASH"
    | "MOBILE_MONEY"
    | "CARD"
    | "BANK_TRANSFER"
    | "CHEQUE"
    | "MIXED";
  amountPaid?: number; // Track amount patient paid
  paymentStatus?: "unpaid" | "partial" | "full"; // Track payment status
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type InsuranceCoverageMeta = {
  cost: number;
  covered: boolean;
};

/** A coverage tier from an insurance provider. */
export type CoverageTier = {
  coverageId: string;
  departmentId: string | null;
  departmentName: string | null;
  encounterType: string | null;
  patientSharePercentage: number;
};

/**
 * Find the best matching coverage tier for a billing line based on
 * department + encounter type context.
 *
 * Resolution order (most specific wins):
 * 1. Exact: dept + encounterType match
 * 2. Department only match
 * 3. Encounter type only match
 * 4. Base (no conditions)
 */
export function findBestMatchingCoverage(
  coverages: CoverageTier[],
  departmentId?: string,
  encounterType?: string,
): CoverageTier | undefined {
  if (!coverages || coverages.length === 0) return undefined;

  // 1. Exact match: dept + encounterType
  if (departmentId && encounterType) {
    const exact = coverages.find(
      (c) => c.departmentId === departmentId && c.encounterType === encounterType,
    );
    if (exact) return exact;
  }

  // 2. Department only
  if (departmentId) {
    const deptOnly = coverages.find(
      (c) => c.departmentId === departmentId && !c.encounterType,
    );
    if (deptOnly) return deptOnly;
  }

  // 3. Encounter type only
  if (encounterType) {
    const etOnly = coverages.find(
      (c) => !c.departmentId && c.encounterType === encounterType,
    );
    if (etOnly) return etOnly;
  }

  // 4. Base (no conditions)
  return coverages.find((c) => !c.departmentId && !c.encounterType);
}

/**
 * Filter coverage tiers to only those whose conditions are satisfied by
 * the billing item's context.
 *
 * Rules:
 * - Base tier (no dept, no encounterType) → always included
 * - Dept-only tier → only if dept matches
 * - EncounterType-only tier → only if encounterType matches  
 * - Dept+EncounterType tier → only if BOTH match
 * - If item has no dept/encounterType, conditional tiers for that axis are excluded
 */
export function filterMatchingCoverages(
  coverages: CoverageTier[],
  departmentId?: string,
  encounterType?: string,
): CoverageTier[] {
  if (!coverages) return [];

  return coverages.filter((c) => {
    // Base tier: no conditions → always show
    if (!c.departmentId && !c.encounterType) return true;

    // Tier has department condition
    if (c.departmentId && !c.encounterType) {
      return departmentId ? c.departmentId === departmentId : false;
    }

    // Tier has encounterType condition only
    if (!c.departmentId && c.encounterType) {
      return encounterType ? c.encounterType === encounterType : false;
    }

    // Tier has both conditions — both must match
    return (
      departmentId !== undefined &&
      encounterType !== undefined &&
      c.departmentId === departmentId &&
      c.encounterType === encounterType
    );
  });
}

type ProductCoverageInput = {
  insurance?: { id?: string | number };
  insuranceProvider?: { id?: string | number };
  cost?: number;
  price?: number;
  covered?: boolean;
};

export function buildProductCoverageMaps(coverages?: ProductCoverageInput[]) {
  const costs: Record<string, number> = {};
  const meta: Record<string, InsuranceCoverageMeta> = {};

  (coverages || []).forEach((coverage) => {
    const providerId =
      coverage?.insuranceProvider?.id ?? coverage?.insurance?.id;
    if (providerId === undefined || providerId === null) return;
    const key = String(providerId);
    const numericCost = Number(coverage?.cost ?? coverage?.price ?? 0);
    costs[key] = numericCost;
    meta[key] = {
      cost: numericCost,
      covered: coverage?.covered !== false && numericCost > 0,
    };
  });

  return { costs, meta };
}

export function resolveBillingUnitPrice(
  basePrice: number,
  coverageCosts: Record<string, number>,
  coverageMeta: Record<string, InsuranceCoverageMeta>,
  providerId?: string,
): { price: number; notCovered: boolean } {
  if (!providerId) {
    return { price: basePrice, notCovered: false };
  }

  const meta = coverageMeta[providerId];
  const cost = coverageCosts[providerId];

  if (meta?.covered && Number.isFinite(cost) && cost > 0) {
    return { price: cost, notCovered: false };
  }

  return { price: basePrice, notCovered: true };
}

export function applyInsuranceSelectionToItem(
  item: BillingItem,
  visitInsuranceId: string | undefined,
  providerId: string | undefined,
): BillingItem {
  const basePrice = item.basePrice ?? item.price;
  const { price, notCovered } = resolveBillingUnitPrice(
    basePrice,
    item.insuranceCoverageCosts || {},
    item.insuranceCoverageMeta || {},
    providerId,
  );

  return {
    ...item,
    selectedInsuranceId: visitInsuranceId,
    price,
    insuranceNotCovered: visitInsuranceId ? notCovered : false,
  };
}

export function getItemInsuranceSplit(
  item: BillingItem,
  coveragePercentage: number,
) {
  const exemptionType = item.exemptionType || (item.exempted ? "full" : "none");

  if (exemptionType === "full") {
    return { itemTotal: 0, insuranceAmount: 0, patientAmount: 0, skip: true };
  }

  // Exact line total in integer cents — mirrors backend toMoney(unitPrice × quantity).
  const unitPrice = item.price ?? item.basePrice ?? 0;
  const lineTotalCents = lineTotalToCents(unitPrice, item.quantity ?? 1);
  const itemTotal = fromCents(lineTotalCents);

  // PATIENT_SHARE exemption: the patient's share is waived; insurance still
  // covers its normal amount. This must be checked before the no-insurance
  // early return because the exemption zero patientAmount regardless.
  if (exemptionType === "patient-share") {
    const coveredCents = Math.min(
      insuranceShareCents(lineTotalCents, coveragePercentage),
      lineTotalCents,
    );
    return {
      itemTotal,
      insuranceAmount: fromCents(coveredCents),
      patientAmount: 0,
      skip: false,
    };
  }

  if (!item.selectedInsuranceId || item.insuranceNotCovered) {
    return {
      itemTotal,
      insuranceAmount: 0,
      patientAmount: itemTotal,
      skip: false,
    };
  }

  // Mirrors the backend: the insurer covers (100 − pct)% of the coverage cost
  // (for an insured line the unit price IS the coverage cost), capped at the
  // line total; the patient pays the remainder. Rounding happens once, HALF_UP
  // to 2 dp — never to whole RWF.
  const coveredCents = Math.min(
    insuranceShareCents(lineTotalCents, coveragePercentage),
    lineTotalCents,
  );
  const patientCents = lineTotalCents - coveredCents;

  return {
    itemTotal,
    insuranceAmount: fromCents(coveredCents),
    patientAmount: fromCents(patientCents),
    skip: false,
  };
}

export interface DepartmentBillAllocation {
  visitDepartmentId: string;
  patientPayable: number;
  allocatedPayment: number;
  hasExemptions: boolean;
  noteRequired: boolean;
}

/**
 * Group billable items by root (top-level) department, compute each
 * department's patient payable, then distribute `totalPayment` across them
 * (settling each department in order until the payment is exhausted).
 *
 * A department needs a billing note when it has an exempted product OR its
 * allocated payment does not cover its full patient payable (a balance is
 * left — including billing with no payment at all).
 *
 * When `originalTotalCents` is provided (edit mode), the note-required check
 * compares the allocated payment against the ORIGINAL patient payable derived
 * from `originalTotalCents`, so that automatic capping due to item removal /
 * exemption changes does not falsely trigger a note requirement.
 */
export function computeDepartmentBillAllocations(
  items: BillingItem[],
  totalPayment: number,
  getCoveragePercentage: (item: BillingItem) => number,
  originalTotalCents?: number,
): DepartmentBillAllocation[] {
  const map = new Map<
    string,
    DepartmentBillAllocation & { patientPayableCents: number }
  >();

  for (const item of items) {
    const rootId = String(
      item.rootVisitDepartmentId || item.visitDepartmentId || "",
    );
    if (!rootId) continue;

    let entry = map.get(rootId);
    if (!entry) {
      entry = {
        visitDepartmentId: rootId,
        patientPayable: 0,
        patientPayableCents: 0,
        allocatedPayment: 0,
        hasExemptions: false,
        noteRequired: false,
      };
      map.set(rootId, entry);
    }

    const exemptionType =
      item.exemptionType || (item.exempted ? "full" : "none");
    if (exemptionType !== "none") {
      entry.hasExemptions = true;
    }
    if (exemptionType === "full" || exemptionType === "patient-share") {
      continue; // zero patient payable
    }

    const { patientAmount } = getItemInsuranceSplit(
      item,
      getCoveragePercentage(item),
    );
    entry.patientPayableCents += toCents(patientAmount);
  }

  let remainingCents = Math.max(0, toCents(totalPayment));
  const allocations = Array.from(map.values());
  for (const entry of allocations) {
    entry.patientPayable = fromCents(entry.patientPayableCents);
    const amountCents = Math.min(entry.patientPayableCents, remainingCents);
    entry.allocatedPayment = fromCents(amountCents);
    remainingCents -= amountCents;
  }

  // Determine note-required per department. In edit mode (originalTotalCents
  // provided), use the PREVIOUS paid amount as the distribution cap so that
  // automatic capping of amountPaid to the new total does not falsely trigger
  // a note requirement when the user has not intentionally reduced payment.
  const noteRefCents = originalTotalCents ?? toCents(totalPayment);
  let refRemainingCents = Math.max(0, noteRefCents);
  const refAllocs: number[] = [];
  for (const entry of allocations) {
    const refAmt = Math.min(entry.patientPayableCents, refRemainingCents);
    refAllocs.push(refAmt);
    refRemainingCents -= refAmt;
  }
  for (let i = 0; i < allocations.length; i++) {
    const entry = allocations[i];
    const hasOutstanding = refAllocs[i] < entry.patientPayableCents;
    // Note is required only when there's an actual unpaid balance (patient owes
    // money). Exemptions alone with zero patient payable don't require a note.
    entry.noteRequired = hasOutstanding;
  }

  return allocations.map(({ patientPayableCents: _cents, ...entry }) => entry);
}

export const EXEMPTION_PRESETS = [
  "Waived by Doctor",
  "Financial Hardship",
  "Insurance Covers Full",
  "Free Treatment Program",
  "Referral Case",
  "Emergency Relief",
  "Staff/Family",
  "Charity Case",
  "Other",
];

// Calculate itemized charges
export const calculateItemTotal = (item: BillingItem): number => {
  const unitPrice = item.price ?? item.basePrice ?? 0;
  return fromCents(lineTotalToCents(unitPrice, item.quantity ?? 1));
};

// Calculate subtotal
export const calculateSubtotal = (items: BillingItem[]): number => {
  return items
    .filter(
      (item) =>
        (item.exemptionType || (item.exempted ? "full" : "none")) !== "full",
    )
    .reduce((total, item) => total + calculateItemTotal(item), 0);
};

// Calculate insurance coverage
export const calculateInsuranceCoverage = (
  subtotal: number,
  coveragePercentage: number,
): number => {
  return (subtotal * coveragePercentage) / 100;
};

// Calculate total insurance coverage from multiple insurances
// Using the highest coverage percentage
export const calculateTotalInsuranceCoverage = (
  subtotal: number,
  insurances?: { coveragePercentage: number }[],
): number => {
  if (!insurances || insurances.length === 0) return 0;
  const maxCoverage = Math.max(
    ...insurances.map((ins) => ins.coveragePercentage),
  );
  return calculateInsuranceCoverage(subtotal, maxCoverage);
};

// Get the effective insurance coverage percentage
export const getEffectiveCoveragePercentage = (
  insurances?: { coveragePercentage: number }[],
): number => {
  if (!insurances || insurances.length === 0) return 0;
  return Math.max(...insurances.map((ins) => ins.coveragePercentage));
};

// Calculate patient responsibility (without insurance)
export const calculatePatientResponsibility = (
  subtotal: number,
  coveragePercentage: number,
): number => {
  return subtotal - calculateInsuranceCoverage(subtotal, coveragePercentage);
};

// Calculate exempted items total
export const calculateExemptedTotal = (items: BillingItem[]): number => {
  return items.reduce((total, item) => {
    const exemption = item.exemptionType || (item.exempted ? "full" : "none");
    if (exemption === "none") return total;
    return total + calculateItemTotal(item);
  }, 0);
};

// Calculate payment status
export const calculatePaymentStatus = (
  totalAmount: number,
  amountPaid: number,
): "unpaid" | "partial" | "full" => {
  if (amountPaid <= 0) return "unpaid";
  if (amountPaid >= totalAmount) return "full";
  return "partial";
};

// Calculate remaining balance
export const calculateRemainingBalance = (
  totalAmount: number,
  amountPaid: number,
): number => {
  const remaining = totalAmount - amountPaid;
  return remaining > 0 ? remaining : 0;
};

// Check if patient paid full amount
export const isFullyPaid = (
  totalAmount: number,
  amountPaid: number,
): boolean => {
  return amountPaid >= totalAmount;
};

// Check if patient paid half amount
export const isHalfPaid = (
  totalAmount: number,
  amountPaid: number,
): boolean => {
  const halfAmount = totalAmount / 2;
  return amountPaid >= halfAmount && amountPaid < totalAmount;
};

// ============================================
// SHARED TOTALS COMPUTATION
// ============================================

export interface BillingTotals {
  subtotal: number;
  insuranceCoverage: number;
  patientResponsibility: number;
  totalAmount: number;
}

/**
 * Compute billing totals for a set of items. This is the single source of
 * truth used by the billing page and summary components so every screen
 * shows identical numbers (no more Math.round drift between components).
 */
export function computeBillingTotals(
  items: BillingItem[],
  getCoveragePercentage: (item: BillingItem) => number,
): BillingTotals {
  let subtotalCents = 0;
  let insuranceCoverageCents = 0;
  let patientResponsibilityCents = 0;

  items.forEach((item) => {
    const coveragePct = getCoveragePercentage(item);
    const { itemTotal, insuranceAmount, patientAmount, skip } =
      getItemInsuranceSplit(item, coveragePct);

    if (skip) return;
    subtotalCents += toCents(itemTotal);
    insuranceCoverageCents += toCents(insuranceAmount);
    patientResponsibilityCents += toCents(patientAmount);
  });

  return {
    subtotal: fromCents(subtotalCents),
    insuranceCoverage: fromCents(insuranceCoverageCents),
    patientResponsibility: fromCents(patientResponsibilityCents),
    totalAmount: fromCents(patientResponsibilityCents),
  };
}
