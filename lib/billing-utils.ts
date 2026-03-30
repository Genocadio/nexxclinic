// Billing Data Structure and Utilities

export interface BillingItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  type: 'action' | 'consumable';
  departmentId?: string;
  departmentName?: string;
  departmentCompletedTime?: string;
  departmentStatus?: string;
  paymentStatus: 'pending' | 'paid' | 'exempted' | 'partial';
  exempted: boolean;
  exemptionType?: 'none' | 'patient-share' | 'full';
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
  paymentMethod?: 'cash' | 'momo' | 'airtel-money' | 'pending';
  amountPaid?: number; // Track amount patient paid
  paymentStatus?: 'unpaid' | 'partial' | 'full'; // Track payment status
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const EXEMPTION_PRESETS = [
  'Waived by Doctor',
  'Financial Hardship',
  'Insurance Covers Full',
  'Free Treatment Program',
  'Referral Case',
  'Emergency Relief',
  'Staff/Family',
  'Charity Case',
  'Other',
];

// Calculate itemized charges
export const calculateItemTotal = (item: BillingItem): number => {
  return item.quantity * item.price;
};

// Calculate subtotal
export const calculateSubtotal = (items: BillingItem[]): number => {
  return items
    .filter((item) => (item.exemptionType || (item.exempted ? 'full' : 'none')) !== 'full')
    .reduce((total, item) => total + calculateItemTotal(item), 0);
};

// Calculate insurance coverage
export const calculateInsuranceCoverage = (
  subtotal: number,
  coveragePercentage: number
): number => {
  return (subtotal * coveragePercentage) / 100;
};

// Calculate total insurance coverage from multiple insurances
// Using the highest coverage percentage
export const calculateTotalInsuranceCoverage = (
  subtotal: number,
  insurances?: { coveragePercentage: number }[]
): number => {
  if (!insurances || insurances.length === 0) return 0;
  const maxCoverage = Math.max(...insurances.map(ins => ins.coveragePercentage));
  return calculateInsuranceCoverage(subtotal, maxCoverage);
};

// Get the effective insurance coverage percentage
export const getEffectiveCoveragePercentage = (
  insurances?: { coveragePercentage: number }[]
): number => {
  if (!insurances || insurances.length === 0) return 0;
  return Math.max(...insurances.map(ins => ins.coveragePercentage));
};

// Calculate patient responsibility (without insurance)
export const calculatePatientResponsibility = (
  subtotal: number,
  coveragePercentage: number
): number => {
  return subtotal - calculateInsuranceCoverage(subtotal, coveragePercentage);
};

// Calculate discount percentage from amount
export const convertDiscountAmountToPercentage = (
  amount: number,
  baseAmount: number
): number => {
  if (baseAmount === 0) return 0;
  return (amount / baseAmount) * 100;
};

// Calculate discount
export const calculateDiscount = (
  amount: number,
  discountPercentage: number
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
  discountPercentage: number
): number => {
  return amount - calculateDiscount(amount, discountPercentage);
};

// Calculate exempted items total
export const calculateExemptedTotal = (items: BillingItem[]): number => {
  return items.reduce((total, item) => {
    const exemption = item.exemptionType || (item.exempted ? 'full' : 'none');
    if (exemption === 'none') return total;
    return total + calculateItemTotal(item);
  }, 0);
};

// Save billing to localStorage
export const saveBillingToLocalStorage = (billing: BillingData): void => {
  const existing = JSON.parse(
    localStorage.getItem('billings') || '[]'
  ) as BillingData[];
  const filtered = existing.filter((b) => b.visitId !== billing.visitId);
  filtered.push(billing);
  localStorage.setItem('billings', JSON.stringify(filtered));
};

// Get billing from localStorage
export const getBillingFromLocalStorage = (
  visitId: string
): BillingData | null => {
  const billings = JSON.parse(
    localStorage.getItem('billings') || '[]'
  ) as BillingData[];
  return billings.find((b) => b.visitId === visitId) || null;
};

// Get all billings from localStorage
export const getAllBillingsFromLocalStorage = (): BillingData[] => {
  return JSON.parse(localStorage.getItem('billings') || '[]');
};

// Calculate payment status
export const calculatePaymentStatus = (
  totalAmount: number,
  amountPaid: number
): 'unpaid' | 'partial' | 'full' => {
  if (amountPaid <= 0) return 'unpaid';
  if (amountPaid >= totalAmount) return 'full';
  return 'partial';
};

// Calculate remaining balance
export const calculateRemainingBalance = (
  totalAmount: number,
  amountPaid: number
): number => {
  const remaining = totalAmount - amountPaid;
  return remaining > 0 ? remaining : 0;
};

// Check if patient paid full amount
export const isFullyPaid = (
  totalAmount: number,
  amountPaid: number
): boolean => {
  return amountPaid >= totalAmount;
};

// Check if patient paid half amount
export const isHalfPaid = (
  totalAmount: number,
  amountPaid: number
): boolean => {
  const halfAmount = totalAmount / 2;
  return amountPaid >= halfAmount && amountPaid < totalAmount;
};
