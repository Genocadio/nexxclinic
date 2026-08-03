// Billing Data Structure and Utilities

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
  departmentCompletedTime?: string;
  departmentStatus?: string;
  paymentStatus: "pending" | "paid" | "exempted" | "partial";
  exempted: boolean;
  exemptionType?: "none" | "patient-share" | "full";
  exemptionReason?: string;
  amountPaid?: number;
  selectedInsuranceId?: string; // Can select specific insurance or 'none'
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
  discountPercentage: number;
  discountAmount?: number; // Store discount as amount
  discountReason?: string;
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
  const itemTotal = calculateItemTotal(item);
  const exemptionType = item.exemptionType || (item.exempted ? "full" : "none");

  if (exemptionType === "full") {
    return { itemTotal: 0, insuranceAmount: 0, patientAmount: 0, skip: true };
  }

  if (!item.selectedInsuranceId || item.insuranceNotCovered) {
    return {
      itemTotal,
      insuranceAmount: 0,
      patientAmount: itemTotal,
      skip: false,
    };
  }

  // defaultCoveragePercentage is the patient's share (co-pay), not the insurer's share.
  const patientAmount = Math.round((itemTotal * coveragePercentage) / 100);
  const insuranceAmount = itemTotal - patientAmount;

  if (exemptionType === "patient-share") {
    return {
      itemTotal,
      insuranceAmount: itemTotal,
      patientAmount: 0,
      skip: false,
    };
  }

  return { itemTotal, insuranceAmount, patientAmount, skip: false };
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
 */
export function computeDepartmentBillAllocations(
  items: BillingItem[],
  totalPayment: number,
  getCoveragePercentage: (item: BillingItem) => number,
): DepartmentBillAllocation[] {
  const map = new Map<string, DepartmentBillAllocation>();

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
    entry.patientPayable += patientAmount;
  }

  let remaining = Math.max(0, totalPayment || 0);
  const allocations = Array.from(map.values());
  for (const entry of allocations) {
    const amount = Math.min(entry.patientPayable, remaining);
    entry.allocatedPayment = amount;
    remaining -= amount;
  }

  for (const entry of allocations) {
    entry.noteRequired =
      entry.hasExemptions ||
      entry.allocatedPayment < entry.patientPayable - 0.001;
  }

  return allocations;
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
  return item.quantity * item.price;
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

// Calculate discount percentage from amount
export const convertDiscountAmountToPercentage = (
  amount: number,
  baseAmount: number,
): number => {
  if (baseAmount === 0) return 0;
  return (amount / baseAmount) * 100;
};

// Calculate discount
export const calculateDiscount = (
  amount: number,
  discountPercentage: number,
): number => {
  return (amount * discountPercentage) / 100;
};

// Calculate discount from amount (alternative)
export const calculateDiscountFromAmount = (discountAmount: number): number => {
  return discountAmount;
};

// Calculate total after discount
export const calculateTotalAfterDiscount = (
  amount: number,
  discountPercentage: number,
): number => {
  return amount - calculateDiscount(amount, discountPercentage);
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
  discount: number;
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
  discountPercentage: number,
): BillingTotals {
  let subtotal = 0;
  let insuranceCoverage = 0;
  let patientResponsibility = 0;

  items.forEach((item) => {
    const coveragePct = getCoveragePercentage(item);
    const { itemTotal, insuranceAmount, patientAmount, skip } =
      getItemInsuranceSplit(item, coveragePct);

    if (skip) return;
    subtotal += itemTotal;
    insuranceCoverage += insuranceAmount;
    patientResponsibility += patientAmount;
  });

  const discount = (patientResponsibility * (discountPercentage || 0)) / 100;
  const totalAmount = patientResponsibility - discount;

  return {
    subtotal,
    insuranceCoverage,
    patientResponsibility,
    discount,
    totalAmount,
  };
}
