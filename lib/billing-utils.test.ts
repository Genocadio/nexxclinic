import { describe, expect, it } from "vitest";
import {
  computeBillingTotals,
  computeDepartmentBillAllocations,
  getItemInsuranceSplit,
  resolvePatientSharePercentage,
  type BillingItem,
  type CoverageTier,
} from "@/lib/billing-utils";

const makeItem = (overrides: Partial<BillingItem>): BillingItem => ({
  id: "item-1",
  productId: "product-1",
  name: "Panadol",
  quantity: 1,
  price: 5000,
  type: "product",
  paymentStatus: "pending",
  exempted: false,
  exemptionType: "none",
  doneBy: { name: "Dr. A", title: "Clinician" },
  visitDepartmentId: "visit-dept-1",
  rootVisitDepartmentId: "root-dept-1",
  ...overrides,
});

// Backend reference implementation (BillingPricingCalculator / VisitBillingService).
//   lineTotal  = round2(unitPrice × quantity)
//   covered    = min(lineTotal, round2(lineTotal × (100 − pct) / 100))
//   patientPay = round2(lineTotal − covered)
// where pct = the insurer's defaultPatientSharePercentage (patient co-pay share).
const round2 = (n: number) => Math.round(n * 100) / 100;

function backendPatientPayable(
  unitPrice: number,
  quantity: number,
  pct: number,
): { lineTotal: number; covered: number; patient: number } {
  const lineTotal = round2(unitPrice * quantity);
  const covered =
    pct <= 0
      ? lineTotal
      : Math.min(lineTotal, round2((lineTotal * (100 - pct)) / 100));
  return { lineTotal, covered, patient: round2(lineTotal - covered) };
}

describe("getItemInsuranceSplit", () => {
  it("bills private lines fully to the patient", () => {
    const item = makeItem({ price: 20912, quantity: 1 });
    const split = getItemInsuranceSplit(item, 0);
    expect(split.itemTotal).toBe(20912);
    expect(split.insuranceAmount).toBe(0);
    expect(split.patientAmount).toBe(20912);
    expect(split.skip).toBe(false);
  });

  it("matches the backend split exactly for non-integer patient shares", () => {
    // lineTotal = 1,234.56, pct 15 → covered 1,049.38, patient 185.18.
    // The old frontend Math.round to whole RWF produced 185 (a 0.18 drift).
    const item = makeItem({
      price: 1234.56,
      quantity: 1,
      selectedInsuranceId: "ins-1",
      insuranceNotCovered: false,
    });
    const { patient } = backendPatientPayable(1234.56, 1, 15);
    const split = getItemInsuranceSplit(item, 15);
    expect(split.patientAmount).toBe(185.18);
    expect(split.patientAmount).toBe(patient);
    expect(split.insuranceAmount).toBe(1049.38);
  });

  it("keeps cents on the line total (never rounds to whole RWF)", () => {
    const item = makeItem({
      price: 3333.33,
      quantity: 2,
      selectedInsuranceId: "ins-1",
      insuranceNotCovered: false,
    });
    const split = getItemInsuranceSplit(item, 15);
    const expected = backendPatientPayable(3333.33, 2, 15);
    expect(split.itemTotal).toBe(6666.66);
    expect(split.patientAmount).toBe(expected.patient);
  });

  it("rounds quantity to 4dp like the backend toQuantity", () => {
    const item = makeItem({ price: 1000, quantity: 1.33335 });
    const split = getItemInsuranceSplit(item, 0);
    // backend: toQuantity(1.33335) = 1.3334 → lineTotal 1,333.40
    expect(split.itemTotal).toBe(1333.4);
    expect(split.patientAmount).toBe(1333.4);
  });

  it("treats full exemptions as zero", () => {
    const item = makeItem({ exempted: true, exemptionType: "full" });
    const split = getItemInsuranceSplit(item, 0);
    expect(split.skip).toBe(true);
    expect(split.itemTotal).toBe(0);
    expect(split.patientAmount).toBe(0);
  });

  it("patient-share exemption: insurance covers its normal amount, patient pays zero", () => {
    // PATIENT_SHARE means the patient's share is waived but insurance still
    // covers its normal amount (85% of the line total for pct=15). The
    // patient amount is zero.
    const item = makeItem({
      exempted: true,
      exemptionType: "patient-share",
      selectedInsuranceId: "ins-1",
      insuranceNotCovered: false,
      price: 10000,
      quantity: 2,
    });
    const split = getItemInsuranceSplit(item, 15);
    expect(split.skip).toBe(false);
    expect(split.itemTotal).toBe(20000);
    // Insurance covers its normal amount: 85% of 20000 = 17000
    expect(split.insuranceAmount).toBe(17000);
    // Patient share is waived
    expect(split.patientAmount).toBe(0);
  });

  it("patient-share exemption with coveragePercentage=0: insurance covers full line", () => {
    // A patient-share exemption with coveragePercentage=0 means 0% patient
    // co-pay, so insurance covers 100% of the line. The patient amount is
    // zeroed by the exemption.
    const item = makeItem({
      exempted: true,
      exemptionType: "patient-share",
      price: 5000,
      quantity: 1,
    });
    const split = getItemInsuranceSplit(item, 0);
    expect(split.skip).toBe(false);
    expect(split.itemTotal).toBe(5000);
    // coveragePercentage=0 → insurance covers 100%
    expect(split.insuranceAmount).toBe(5000);
    // Patient share is waived
    expect(split.patientAmount).toBe(0);
  });
});

describe("computeBillingTotals", () => {
  it("sums exact per-line patient payables (no whole-RWF rounding, no float drift)", () => {
    // Reproduces the reported bug shape: private bucket + insurance bucket must
    // total exactly 28,126.74 — never a rounded 28,127.00.
    const privateItem = makeItem({ price: 20912, quantity: 1 });
    const insuredLines = [
      makeItem({ id: "a", price: 20000, quantity: 1 }),
      makeItem({ id: "b", price: 5000, quantity: 1 }),
      makeItem({ id: "c", price: 3333.33, quantity: 1 }),
      makeItem({ id: "d", price: 1234.56, quantity: 1 }),
      makeItem({ id: "e", price: 1234.56, quantity: 1 }),
      makeItem({ id: "f", price: 2000, quantity: 1 }),
      makeItem({ id: "g", price: 7777.77, quantity: 1 }),
      makeItem({ id: "h", price: 8888.88, quantity: 1 }),
    ];
    for (const line of insuredLines) {
      line.selectedInsuranceId = "ins-1";
      line.insuranceNotCovered = false;
    }
    const items = [privateItem, ...insuredLines];

    const expectedPatient = insuredLines.reduce(
      (sum, line) =>
        sum + backendPatientPayable(line.price, line.quantity, 15).patient,
      0,
    );
    const expectedTotal = round2(20912 + expectedPatient);

    const totals = computeBillingTotals(
      items,
      (item) => (item.selectedInsuranceId ? 15 : 0),
    );

    expect(totals.patientResponsibility).toBe(expectedTotal);
    expect(totals.totalAmount).toBe(expectedTotal);
    // The total carries cents — the old code wrongly rounded to a whole 28,127.00.
    expect(totals.totalAmount % 1).not.toBe(0);
    expect(round2(totals.totalAmount)).toBe(totals.totalAmount);
  });

  it("computes totals without discount (removed)", () => {
    const item = makeItem({ price: 1000, quantity: 3 });
    const totals = computeBillingTotals([item], () => 0);
    expect(totals.patientResponsibility).toBe(3000);
    expect(totals.totalAmount).toBe(3000);
  });
});

describe("computeDepartmentBillAllocations", () => {
  it("allocates the exact payment without rounding and flags a note when short", () => {
    const a = makeItem({
      id: "a",
      rootVisitDepartmentId: "root-1",
      price: 20912,
      quantity: 1,
    });
    const b = makeItem({
      id: "b",
      rootVisitDepartmentId: "root-2",
      price: 1234.56,
      quantity: 1,
    });
    b.selectedInsuranceId = "ins-1";
    b.insuranceNotCovered = false;

    const payment = round2(
      20912 + backendPatientPayable(1234.56, 1, 15).patient,
    );
    const allocations = computeDepartmentBillAllocations(
      [a, b],
      payment,
      (item) => (item.selectedInsuranceId ? 15 : 0),
    );

    const byDept = Object.fromEntries(
      allocations.map((alloc) => [alloc.visitDepartmentId, alloc]),
    );
    expect(byDept["root-1"].patientPayable).toBe(20912);
    expect(byDept["root-1"].allocatedPayment).toBe(20912);
    expect(byDept["root-2"].patientPayable).toBe(185.18);
    expect(byDept["root-2"].allocatedPayment).toBe(185.18);
    // Fully covered → no note required.
    expect(byDept["root-1"].noteRequired).toBe(false);
    expect(byDept["root-2"].noteRequired).toBe(false);
  });

  it("marks a note required when the payment does not cover the full payable", () => {
    const item = makeItem({ price: 1000, quantity: 1 });
    const allocations = computeDepartmentBillAllocations(
      [item],
      500,
      () => 0,
    );
    expect(allocations[0].patientPayable).toBe(1000);
    expect(allocations[0].allocatedPayment).toBe(500);
    expect(allocations[0].noteRequired).toBe(true);
  });
});

// ─── resolvePatientSharePercentage ───────────────────────────────────────
// Mirrors BillingPricingCalculator.resolvePatientSharePercentage (backend
// single source of truth). Chain:
//   override (if allowed) -> exact(dept+enc) -> dept -> enc -> base-rule
//   -> patient-default -> provider-base -> 0
const tier = (
  coverageId: string,
  pct: number,
  dept?: string | null,
  enc?: string | null,
): CoverageTier => ({
  coverageId,
  departmentId: dept ?? null,
  departmentName: null,
  encounterType: enc ?? null,
  patientSharePercentage: pct,
});

const makeTiers = (...t: CoverageTier[]) => t;

describe("resolvePatientSharePercentage", () => {
  it("returns 0 when no coverages and no patient default", () => {
    const pct = resolvePatientSharePercentage({
      departmentId: "dept-a",
      encounterType: "OUTPATIENT",
      coverages: [],
    });
    expect(pct).toBe(0);
  });

  it("accepts a per-line override when no exact rule blocks it", () => {
    // Provider has only a dept-only rule (encounter null): override allowed.
    const coverages = makeTiers(
      tier("dept-a", 10, "dept-a"),
      tier("override", 30),
    );
    const pct = resolvePatientSharePercentage({
      departmentId: "dept-a",
      encounterType: "OUTPATIENT",
      selectedCoverageId: "override",
      coverages,
    });
    expect(pct).toBe(30);
  });

  it("rejects the override when an exact (dept+encounterType) rule exists, falling to the rule", () => {
    const coverages = makeTiers(
      tier("exact", 10, "dept-a", "OUTPATIENT"),
      tier("override", 50),
    );
    const pct = resolvePatientSharePercentage({
      departmentId: "dept-a",
      encounterType: "OUTPATIENT",
      selectedCoverageId: "override",
      coverages,
    });
    expect(pct).toBe(10);
  });

  it("clamps an out-of-range override to [0,100]", () => {
    const coverages = makeTiers(
      tier("override-high", 150),
      tier("override-low", -10),
    );
    expect(
      resolvePatientSharePercentage({
        departmentId: "dept-a",
        selectedCoverageId: "override-high",
        coverages,
      }),
    ).toBe(100);
    expect(
      resolvePatientSharePercentage({
        departmentId: "dept-a",
        selectedCoverageId: "override-low",
        coverages,
      }),
    ).toBe(0);
  });

  it("ignores an override that is not among the provider coverages", () => {
    const coverages = makeTiers(tier("dept-a", 20, "dept-a"));
    const pct = resolvePatientSharePercentage({
      departmentId: "dept-a",
      encounterType: "OUTPATIENT",
      selectedCoverageId: "ghost",
      coverages,
    });
    expect(pct).toBe(20);
  });

  it("resolves exact dept+encounterType rule over dept-only", () => {
    const coverages = makeTiers(
      tier("dept-a", 20, "dept-a"),
      tier("exact", 5, "dept-a", "OUTPATIENT"),
    );
    const pct = resolvePatientSharePercentage({
      departmentId: "dept-a",
      encounterType: "OUTPATIENT",
      coverages,
    });
    expect(pct).toBe(5);
  });

  it("resolves dept-only rule", () => {
    const coverages = makeTiers(tier("dept-a", 10, "dept-a"));
    const pct = resolvePatientSharePercentage({
      departmentId: "dept-a",
      encounterType: "OUTPATIENT",
      coverages,
    });
    expect(pct).toBe(10);
  });

  it("resolves encounter-type-only rule", () => {
    const coverages = makeTiers(tier("enc", 8, null, "OUTPATIENT"));
    const pct = resolvePatientSharePercentage({
      departmentId: "dept-a",
      encounterType: "OUTPATIENT",
      coverages,
    });
    expect(pct).toBe(8);
  });

  it("uses the base rule when no dept/encounter rule matches", () => {
    const coverages = makeTiers(tier("base", 25));
    const pct = resolvePatientSharePercentage({
      departmentId: "dept-z",
      encounterType: "INPATIENT",
      coverages,
    });
    expect(pct).toBe(25);
  });

  it("base coverage rule wins over the patient-specific default (backend order)", () => {
    const coverages = makeTiers(tier("base", 25));
    const pct = resolvePatientSharePercentage({
      departmentId: "dept-a",
      encounterType: "OUTPATIENT",
      patientSharePercentage: 35,
      coverages,
    });
    expect(pct).toBe(25);
  });

  it("uses the patient-specific default when no coverage rule matches", () => {
    const coverages = makeTiers(tier("dept-other", 15, "dept-other"));
    const pct = resolvePatientSharePercentage({
      departmentId: "dept-a",
      encounterType: "OUTPATIENT",
      patientSharePercentage: 40,
      coverages,
    });
    expect(pct).toBe(40);
  });
});

