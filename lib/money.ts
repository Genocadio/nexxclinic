/**
 * Money arithmetic helpers.
 *
 * Financial values in the billing flow always carry exactly 2 decimal places
 * (HALF_UP), matching the backend's `MoneyUtils`. To avoid floating-point
 * drift, every computation is done in integer cents and only converted back to
 * a (2 dp) money number for display and for the GraphQL payloads.
 *
 * The per-line insurance split mirrors `BillingPricingCalculator` /
 * `VisitBillingService` on the backend:
 *   - lineTotal  = round2(unitPrice × quantity)
 *   - covered    = min(lineTotal, round2(lineTotal × (100 − pct) / 100))
 *   - patientPay = lineTotal − covered
 * where `pct` is the insurer's `defaultCoveragePercentage` (the patient's
 * co-pay share). For an insured line the unit price IS the coverage cost, so
 * the coverage-cost total equals the line total.
 */

const CENT_FACTOR = 100;

/** Convert a money amount (RWF, 2 dp) to integer cents. */
export function toCents(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const twoDp = Number(value.toFixed(2));
  return Math.round(twoDp * CENT_FACTOR);
}

/** Convert integer cents back to a money amount (RWF, exactly 2 dp). */
export function fromCents(cents: number): number {
  return Math.round(cents) / CENT_FACTOR;
}

/** Round an arbitrary amount to money (2 dp, HALF_UP) without float drift. */
export function roundMoney(value: number): number {
  return fromCents(toCents(value));
}

/** Exact sum of money amounts (no intermediate float rounding). */
export function sumMoney(values: readonly number[]): number {
  let cents = 0;
  for (const value of values) cents += toCents(value);
  return fromCents(cents);
}

/** Exact difference of two money amounts. */
export function subMoney(a: number, b: number): number {
  return fromCents(toCents(a) - toCents(b));
}

/**
 * Normalize a quantity to 4 decimal places (HALF_UP), mirroring the backend's
 * `MoneyUtils.toQuantity`.
 */
export function toQuantity(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1;
  return Math.round(value * 10000) / 10000;
}

/** line total in cents = round2(unitPrice × quantity). */
export function lineTotalToCents(
  unitPrice: number,
  quantity: number,
): number {
  const priceCents = toCents(unitPrice);
  const qty = toQuantity(quantity);
  return Math.round(priceCents * qty);
}

/**
 * Insurance-covered amount in cents: (100 − pct)% of the money total, rounded
 * HALF_UP (mirrors the backend `calculateCoveredAmount`). Returns the full
 * total when `pct <= 0`.
 */
export function insuranceShareCents(
  totalCents: number,
  patientSharePct: number,
): number {
  const pct = Number(patientSharePct) || 0;
  if (pct <= 0) return totalCents;
  return Math.round((totalCents * (100 - pct)) / 100);
}
