"use client";

import { useMemo } from "react";
import {
  computeBillingTotals,
  type BillingItem,
  type BillingTotals,
} from "@/lib/billing-utils";

const EMPTY_TOTALS: BillingTotals = {
  subtotal: 0,
  insuranceCoverage: 0,
  patientResponsibility: 0,
  totalAmount: 0,
};

/**
 * Shared totals hook for billing summary components. Single source of truth
 * for subtotal / insurance / patient responsibility / discount / total so the
 * billing page and every summary card display identical numbers.
 */
export function useBillingTotals(
  items: BillingItem[],
  getCoveragePercentage: (item: BillingItem) => number,
): BillingTotals {
  return useMemo(
    () => computeBillingTotals(items, getCoveragePercentage),
    [items, getCoveragePercentage],
  );
}

export { EMPTY_TOTALS };
