/**
 * Shared utilities for insurance status checks across billing, visit creation,
 * and patient registration UIs.
 */

export interface InsuranceLike {
  deactivated?: boolean;
  validFrom?: string | null;
  validUntil?: string | null;
}

/**
 * Returns `true` when a PatientInsurance is currently active: not deactivated,
 * validFrom is in the past, and validUntil is in the future.
 */
export function isInsuranceActive(ins: InsuranceLike): boolean {
  if (ins.deactivated) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (ins.validFrom) {
    const from = new Date(ins.validFrom);
    from.setHours(0, 0, 0, 0);
    if (from > today) return false;
  }
  if (ins.validUntil) {
    const until = new Date(ins.validUntil);
    until.setHours(0, 0, 0, 0);
    if (until < today) return false;
  }
  return true;
}

/**
 * Returns a human-readable tooltip string describing the insurance status.
 * Used for hover tooltips on grayed-out insurance badges.
 */
export function insuranceStatusLabel(ins: InsuranceLike): string {
  if (ins.deactivated) return "Insurance is deactivated";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (ins.validFrom) {
    const from = new Date(ins.validFrom);
    from.setHours(0, 0, 0, 0);
    if (from > today) {
      return `Insurance starts on ${formatDate(ins.validFrom)}`;
    }
  }
  if (ins.validUntil) {
    const until = new Date(ins.validUntil);
    until.setHours(0, 0, 0, 0);
    if (until < today) {
      return `Insurance expired on ${formatDate(ins.validUntil)}`;
    }
  }
  return "Insurance is active";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
