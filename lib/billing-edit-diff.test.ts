import { describe, it, expect } from "vitest";
import type { BillingItem } from "@/lib/billing-utils";
import {
  detectEditedItemChanges,
  hasEditChanges,
  snapshotBillingItems,
} from "@/lib/billing-edit-diff";

const makeItem = (over: Partial<BillingItem> = {}): BillingItem => ({
  id: "p1",
  productId: "prod-1",
  name: "Refraction",
  quantity: 1,
  price: 22609.1,
  basePrice: 22609.1,
  type: "product",
  paymentStatus: "pending",
  exempted: false,
  exemptionType: "none",
  doneBy: { name: "Staff", title: "" },
  ...over,
});

// A resolver that returns the percentage baked into the item (or a manual pct)
const pctResolver = (item: BillingItem) =>
  item.snapshotPct ?? item.appliedPatientSharePct ?? 15;

describe("billing edit change detection", () => {
  const base = makeItem();
  const snapshot = snapshotBillingItems([base], pctResolver)!;

  it("detects NO change for an untouched item", () => {
    expect(hasEditChanges([makeItem()], snapshot, pctResolver)).toBe(false);
    expect(detectEditedItemChanges([makeItem()], snapshot, pctResolver).size).toBe(0);
  });

  it("detects a quantity change", () => {
    const changed = makeItem({ quantity: 2 });
    expect(hasEditChanges([changed], snapshot, pctResolver)).toBe(true);
    expect(detectEditedItemChanges([changed], snapshot, pctResolver).get("p1")).toBe("modified");
  });

  it("detects an insurance change", () => {
    const changed = makeItem({ selectedInsuranceId: "rssb-1" });
    expect(hasEditChanges([changed], snapshot, pctResolver)).toBe(true);
  });

  it("detects a coverage tier change", () => {
    const changed = makeItem({
      selectedInsuranceId: "rssb-1",
      selectedCoverageId: "tier-2",
    });
    expect(hasEditChanges([changed], snapshot, pctResolver)).toBe(true);
  });

  it("detects a waiver (patient-share exemption) change", () => {
    const changed = makeItem({ exemptionType: "patient-share", exempted: true });
    expect(hasEditChanges([changed], snapshot, pctResolver)).toBe(true);
    expect(detectEditedItemChanges([changed], snapshot, pctResolver).get("p1")).toBe("modified");
  });

  it("detects a full-exemption change and its reversal", () => {
    const exempted = makeItem({ exemptionType: "full", exempted: true });
    expect(hasEditChanges([exempted], snapshot, pctResolver)).toBe(true);
    const back = makeItem({ exemptionType: "none", exempted: false });
    expect(hasEditChanges([back], snapshot, pctResolver)).toBe(false);
  });

  it("detects an exemption-reason change", () => {
    const changed = makeItem({ exemptionReason: "waived by clinician" });
    expect(hasEditChanges([changed], snapshot, pctResolver)).toBe(true);
  });

  it("detects a price change", () => {
    const changed = makeItem({ price: 100 });
    expect(hasEditChanges([changed], snapshot, pctResolver)).toBe(true);
  });

  it("detects a DERIVED-percentage change even with identical raw fields", () => {
    // Same selectedInsuranceId, coverage, exemption, price... but the resolved
    // percentage differs (e.g. a coverage rule or patient-share edit).
    const changed = makeItem({ appliedPatientSharePct: 30 }); // 15 -> 30
    expect(hasEditChanges([changed], snapshot, pctResolver)).toBe(true);
    expect(detectEditedItemChanges([changed], snapshot, pctResolver).get("p1")).toBe("modified");
  });

  it("detects an insurance-data change DURING the session (baked base is frozen)", () => {
    // Snapshot baked at capture time with resolver A (=15).
    const bakedSnapshot = snapshotBillingItems([base], () => 15)!;
    expect(bakedSnapshot[0].snapshotPct).toBe(15);
    // Later the resolved % for the SAME item becomes 25 (insurance rule /
    // patient-share change), with NO raw item field change. The frozen
    // snapshotPct (15) still differs from the live resolve (25) -> detected.
    const liveResolver = () => 25;
    expect(hasEditChanges([base], bakedSnapshot, liveResolver)).toBe(true);
  });

  it("detects an added item", () => {
    const current = [
      base,
      makeItem({ id: "p2", productId: "prod-2", name: "Consultation" }),
    ];
    expect(hasEditChanges(current, snapshot, pctResolver)).toBe(true);
    expect(detectEditedItemChanges(current, snapshot, pctResolver).get("p2")).toBe("added");
    expect(detectEditedItemChanges(current, snapshot, pctResolver).get("p1")).toBeUndefined();
  });

  it("detects a removed item", () => {
    const removedSnap = snapshotBillingItems([base, makeItem({ id: "p2" })], pctResolver)!;
    expect(hasEditChanges([base], removedSnap, pctResolver)).toBe(true);
  });

  it("returns false when there is no snapshot baseline", () => {
    expect(hasEditChanges([base], null, pctResolver)).toBe(false);
  });
});
