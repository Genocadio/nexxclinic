import { describe, expect, it } from "vitest";
import {
  buildCreateBillInput,
  buildEditBillInput,
} from "@/lib/billing-input-builders";
import type { BillingData, BillingItem } from "@/lib/billing-utils";

const makeItem = (overrides: Partial<BillingItem>): BillingItem => ({
  id: "item-1",
  productId: "product-1",
  name: "Panadol",
  quantity: 2,
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

const makeBillingData = (overrides: Partial<BillingData>): BillingData => ({
  visitId: "visit-1",
  patientId: "patient-1",
  patientName: "Jane Doe",
  patientAge: 30,
  patientId_Number: "ID-1",
  gender: "FEMALE",
  visitDate: "2026-08-04",
  currency: "RWF",
  items: [],
  discountPercentage: 0,
  paymentMethod: "CASH",
  amountPaid: 0,
  notes: "",
  ...overrides,
} as BillingData);

describe("buildCreateBillInput", () => {
  it("bills private items without insurance", () => {
    const item = makeItem({});
    const input = buildCreateBillInput(
      makeBillingData({ items: [item] }),
      [item],
      (i) => i.price,
    );

    expect(input.visitId).toBe("visit-1");
    expect(input.departments).toHaveLength(1);
    const product = input.departments[0].products[0];
    expect(product.visitDepartmentProductId).toBe(item.id);
    expect(product.parentVisitDepartmentId).toBe(item.visitDepartmentId);
    expect(product.coverageType).toBe("PRIVATE");
    expect(product.patientInsuranceId).toBeUndefined();
    expect(product.isExempted).toBe(false);
  });

  it("bills as INSURANCE only when covered", () => {
    const covered = makeItem({
      id: "item-covered",
      selectedInsuranceId: "ins-1",
      insuranceNotCovered: false,
    });
    const notCovered = makeItem({
      id: "item-not-covered",
      selectedInsuranceId: "ins-1",
      insuranceNotCovered: true,
    });

    const input = buildCreateBillInput(
      makeBillingData({ items: [covered, notCovered] }),
      [covered, notCovered],
      (i) => i.price,
    );

    const products = input.departments[0].products;
    const byId = Object.fromEntries(products.map((p) => [p.visitDepartmentProductId, p]));
    expect(byId["item-covered"].coverageType).toBe("INSURANCE");
    expect(byId["item-covered"].patientInsuranceId).toBe("ins-1");
    expect(byId["item-not-covered"].coverageType).toBe("PRIVATE");
    expect(byId["item-not-covered"].patientInsuranceId).toBeUndefined();
  });

  it("marks exempted lines with isExempted", () => {
    const item = makeItem({ exempted: true, exemptionType: "full" });
    const input = buildCreateBillInput(
      makeBillingData({ items: [item] }),
      [item],
      (i) => i.price,
    );
    expect(input.departments[0].products[0].isExempted).toBe(true);
  });

  it("groups products under their root department", () => {
    const a = makeItem({ id: "a", rootVisitDepartmentId: "root-1" });
    const b = makeItem({ id: "b", rootVisitDepartmentId: "root-2" });
    const input = buildCreateBillInput(
      makeBillingData({ items: [a, b] }),
      [a, b],
      (i) => i.price,
    );
    expect(input.departments.map((d) => d.visitDepartmentId).sort()).toEqual([
      "root-1",
      "root-2",
    ]);
  });

  it("allocates the paid amount across departments", () => {
    const item = makeItem({});
    const input = buildCreateBillInput(
      makeBillingData({ items: [item], amountPaid: 5000 }),
      [item],
      (i) => i.price,
    );
    const payments = input.departments[0].payments;
    expect(payments).toHaveLength(1);
    expect(payments![0].amount).toBeGreaterThan(0);
    expect(payments![0].paymentMethod).toBe("CASH");
  });
});

describe("buildEditBillInput", () => {
  it("diffs added, removed and updated products", () => {
    const existing = makeItem({ id: "existing", productId: "product-existing", quantity: 2 });
    const added = makeItem({ id: "added", productId: "product-added", quantity: 1 });
    const removed = makeItem({ id: "removed", productId: "product-removed", quantity: 3 });
    const snapshot = [existing, removed];

    const current = [
      existing,
      { ...added, quantity: 2 }, // quantity changed after being added? treat as added
    ];

    const input = buildEditBillInput(
      makeBillingData({ items: current }),
      snapshot,
      (i) => i.price,
    );

    const dept = input.departments[0];
    expect(dept.removedProductIds).toContain("product-removed");
    // The added item is billed in billProducts
    expect(dept.billProducts.map((p) => p.productId)).toContain("product-added");
    expect(dept.addedProducts).toHaveLength(1);
  });

  it("sends coverageType on every billProducts entry", () => {
    const existing = makeItem({
      id: "existing",
      productId: "product-existing",
      selectedInsuranceId: "ins-1",
      insuranceNotCovered: false,
    });
    const input = buildEditBillInput(
      makeBillingData({ items: [existing] }),
      [existing],
      (i) => i.price,
    );
    const product = input.departments[0].billProducts[0];
    expect(product.coverageType).toBe("INSURANCE");
    expect(product.patientInsuranceId).toBe("ins-1");
  });

  it("sends the reduced post-refund payment when an edit exempts a paid product", () => {
    // Mirrors guide §5.4 Example 1: a previously paid private product is
    // exempted in edit mode, shrinking the corrected patient payable well below
    // the amount already paid. The edit must submit the reduced payment rather
    // than omit it (omitting carries forward the old larger amount, which the
    // backend rejects).
    const privateExempted = makeItem({
      id: "private-exempted",
      productId: "product-fluorescein",
      name: "Fluorescein staining test",
      price: 20912,
      quantity: 1,
      exempted: true,
      exemptionType: "full",
      selectedInsuranceId: undefined,
    });
    const insured = (id: string, productId: string) =>
      makeItem({
        id,
        productId,
        name: `Insured line ${id}`,
        price: 4000,
        quantity: 1,
        selectedInsuranceId: "ins-policy-1",
        insuranceNotCovered: false,
      });
    const current = [
      privateExempted,
      insured("ins-1", "product-ins-1"),
      insured("ins-2", "product-ins-2"),
      insured("ins-3", "product-ins-3"),
    ];

    // amountPaid mirrors the already-paid amount from the previous version.
    const input = buildEditBillInput(
      makeBillingData({ items: current, amountPaid: 28126.74 }),
      current,
      (item) => (item.id === "private-exempted" ? 0 : 65),
    );

    const dept = input.departments[0];
    const exemptedProduct = dept.billProducts.find(
      (p) => p.productId === "product-fluorescein",
    );
    expect(exemptedProduct?.isExempted).toBe(true);
    expect(exemptedProduct?.coverageType).toBe("PRIVATE");
    expect(exemptedProduct?.patientInsuranceId).toBeUndefined();

    // Patient share of each 4000 line @ 65% = 2600 -> 3 * 2600 = 7800. The
    // submitted payment is the corrected payable, not the old 28126.74.
    const payment = dept.payments?.[0];
    expect(payment).toBeDefined();
    expect(payment!.amount).toBe(7800);
    expect(payment!.paymentMethod).toBe("CASH");
  });

  it("omits payments when amountPaid is 0 (carry-forward intent)", () => {
    const item = makeItem({});
    const input = buildEditBillInput(
      makeBillingData({ items: [item], amountPaid: 0 }),
      [item],
      (i) => i.price,
    );
    expect(input.departments[0].payments).toBeUndefined();
  });
});
