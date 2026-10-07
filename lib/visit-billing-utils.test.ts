import { describe, expect, it } from "vitest";
import {
  flattenDepartmentInsuranceBillings,
  flattenVisitBillingItems,
  getVisitBillingTotals,
  isVisitDepartmentProductBilled,
  mapGqlVisitBilling,
  visitBillingLineTotal,
  type GqlVisitBilling,
} from "@/lib/visit-billing-utils";

const gqlBilling: GqlVisitBilling = {
  id: "vb-1",
  visitId: "visit-1",
  version: { id: "ver-1", version: 2 },
  createdAt: "2026-08-04T10:00:00Z",
  updatedAt: "2026-08-04T10:00:00Z",
  departments: [
    {
      id: "vdb-1",
      status: "PARTIALLY_PAID",
      totalAmount: 20000,
      insuranceCoveredAmount: 8000,
      patientPayableAmount: 12000,
      paidAmount: 4000,
      outstandingAmount: 8000,
      visitDepartment: {
        id: "visit-dept-1",
        status: "BILLING",
        department: { id: "dep-1", name: "Consultation" },
      },
      payments: [{ id: "pay-1", amount: 4000, paymentMethod: "MOBILE_MONEY" }],
      insuranceBillings: [
        {
          id: "dib-1",
          status: "PARTIALLY_PAID",
          totalAmount: 20000,
          insuranceCoveredAmount: 8000,
          patientPayableAmount: 12000,
          paidAmount: 4000,
          outstandingAmount: 8000,
          patientInsurance: {
            id: "pi-1",
            insuranceCardNumber: "CARD-1",
            principalMemberName: "Jane Doe",
            insuranceProvider: {
              id: "prov-1",
              insuranceName: "RSSB",
              acronym: "RSSB",
            },
          },
          items: [
            {
              id: "item-1",
              visitDepartmentProductId: "vdp-1",
              productId: "product-1",
              productName: "Panadol",
              unitPriceSnapshot: 5000,
              quantitySnapshot: 2,
              insuranceCoveredAmount: 0,
              patientPayableAmount: 10000,
            },
            {
              id: "item-2",
              visitDepartmentProductId: "vdp-2",
              productId: "product-2",
              productName: "Consultation",
              unitPriceSnapshot: 10000,
              quantitySnapshot: 1,
              insuranceCoveredAmount: 8000,
              patientPayableAmount: 2000,
            },
          ],
        },
      ],
    },
  ],
};

describe("mapGqlVisitBilling", () => {
  it("maps the version and core fields", () => {
    const mapped = mapGqlVisitBilling(gqlBilling);
    expect(mapped.id).toBe("vb-1");
    expect(mapped.visitId).toBe("visit-1");
    expect(mapped.version).toEqual({ id: "ver-1", version: 2 });
  });

  it("maps department billing and items", () => {
    const mapped = mapGqlVisitBilling(gqlBilling);
    const dept = mapped.departments[0];
    expect(dept.status).toBe("PARTIALLY_PAID");
    expect(dept.payments[0].amount).toBe(4000);
    expect(dept.insuranceBillings[0].items).toHaveLength(2);
    expect(dept.insuranceBillings[0].patientInsurance?.insuranceCardNumber).toBe(
      "CARD-1",
    );
  });

  it("handles a missing version gracefully", () => {
    const mapped = mapGqlVisitBilling({
      ...gqlBilling,
      version: null,
    });
    expect(mapped.version).toBeUndefined();
  });
});

describe("flatten helpers", () => {
  it("flattens insurance billings and items", () => {
    const mapped = mapGqlVisitBilling(gqlBilling);
    expect(flattenDepartmentInsuranceBillings(mapped)).toHaveLength(1);
    expect(flattenVisitBillingItems(mapped)).toHaveLength(2);
    expect(flattenVisitBillingItems(null)).toHaveLength(0);
  });
});

describe("getVisitBillingTotals", () => {
  it("sums amounts across insurance billings", () => {
    const totals = getVisitBillingTotals(mapGqlVisitBilling(gqlBilling));
    expect(totals.totalAmount).toBe(20000);
    expect(totals.insuranceCoveredAmount).toBe(8000);
    expect(totals.patientPayableAmount).toBe(12000);
    expect(totals.paidAmount).toBe(4000);
    expect(totals.outstandingAmount).toBe(8000);
  });

  type GqlDept = NonNullable<GqlVisitBilling["departments"]>[number];
  type GqlBucket = NonNullable<GqlDept["insuranceBillings"]>[number];

  const makeBucket = (
    id: string,
    outstanding: number,
    outstandingType?: string,
    paid?: number,
  ): GqlBucket => ({
    id,
    status: "UNPAID",
    totalAmount: 12000,
    insuranceCoveredAmount: 0,
    patientPayableAmount: 12000,
    paidAmount: paid ?? 12000 - outstanding,
    outstandingAmount: outstanding,
    outstandingType,
    items: [],
  });

  const makeDept = (buckets: GqlBucket[]): GqlDept => ({
    id: "vdb-split",
    status: "PARTIALLY_PAID",
    totalAmount: 12000,
    insuranceCoveredAmount: 0,
    patientPayableAmount: 12000,
    paidAmount: 4000,
    outstandingAmount: buckets.reduce(
      (sum, b) => sum + b.outstandingAmount,
      0,
    ),
    insuranceBillings: buckets,
  });

  it("books buckets without a declared type as loan (Outstanding)", () => {
    const totals = getVisitBillingTotals(
      mapGqlVisitBilling({
        ...gqlBilling,
        departments: [makeDept([makeBucket("dib-legacy", 8000)])],
      }),
    );
    expect(totals.outstandingAmount).toBe(8000);
    expect(totals.loanOutstandingAmount).toBe(8000);
    expect(totals.giveawayOutstandingAmount).toBe(0);
  });

  it("splits outstanding into loan and giveaway by declared OutstandingType", () => {
    const totals = getVisitBillingTotals(
      mapGqlVisitBilling({
        ...gqlBilling,
        departments: [
          makeDept([
            makeBucket("dib-loan", 5000, "LOAN"),
            makeBucket("dib-giveaway", 3000, "GIVEAWAY"),
          ]),
        ],
      }),
    );
    expect(totals.outstandingAmount).toBe(8000);
    expect(totals.loanOutstandingAmount).toBe(5000);
    expect(totals.giveawayOutstandingAmount).toBe(3000);
    expect(
      totals.loanOutstandingAmount + totals.giveawayOutstandingAmount,
    ).toBe(totals.outstandingAmount);
  });

  it("books the derived fallback residual as loan when no bucket reports one", () => {
    const totals = getVisitBillingTotals(
      mapGqlVisitBilling({
        ...gqlBilling,
        departments: [
          makeDept([
            // Backend-reported residual lags (0) while the patient still owes
            // 12000 − 4000 — the fallback path must kick in.
            makeBucket("dib-unreported", 0, "GIVEAWAY", 4000),
          ]),
        ],
      }),
    );
    // Bucket reports no residual → outstanding is derived from patient payable
    // (12000 − 4000). The unclassified fallback keeps the "Outstanding" wording.
    expect(totals.outstandingAmount).toBe(8000);
    expect(totals.loanOutstandingAmount).toBe(8000);
    expect(totals.giveawayOutstandingAmount).toBe(0);
  });

  it("shows zero outstanding when the patient is fully paid, even when insurance-covered money is unpaid", () => {
    const totals = getVisitBillingTotals(
      mapGqlVisitBilling({
        ...gqlBilling,
        departments: [
          {
            id: "vdb-1",
            status: "PAID",
            totalAmount: 22958.26,
            insuranceCoveredAmount: 19514.52,
            patientPayableAmount: 3107.14,
            paidAmount: 3107.14,
            outstandingAmount: 0,
            visitDepartment: {
              id: "visit-dept-1",
              status: "BILLING",
              department: { id: "dep-1", name: "Consultation" },
            },
            payments: [],
            insuranceBillings: [
              {
                id: "dib-1",
                status: "PAID",
                totalAmount: 22958.26,
                insuranceCoveredAmount: 19514.52,
                patientPayableAmount: 3107.14,
                paidAmount: 3107.14,
                outstandingAmount: 0,
                patientInsurance: {
                  id: "pi-1",
                  insuranceCardNumber: "CARD-1",
                  principalMemberName: "Jane Doe",
                  insuranceProvider: {
                    id: "prov-1",
                    insuranceName: "RSSB",
                    acronym: "RSSB",
                  },
                },
                items: [],
              },
            ],
          },
        ],
      }),
    );
    expect(totals.totalAmount).toBe(22958.26);
    expect(totals.patientPayableAmount).toBe(3107.14);
    expect(totals.outstandingAmount).toBe(0);
  });

  it("derives outstanding from patient payable when the backend amount is missing", () => {
    const totals = getVisitBillingTotals(
      mapGqlVisitBilling({
        ...gqlBilling,
        departments: [
          {
            id: "vdb-1",
            status: "PARTIALLY_PAID",
            totalAmount: 20000,
            insuranceCoveredAmount: 8000,
            patientPayableAmount: 12000,
            paidAmount: 4000,
            outstandingAmount: 0,
            visitDepartment: {
              id: "visit-dept-1",
              status: "BILLING",
              department: { id: "dep-1", name: "Consultation" },
            },
            payments: [],
            insuranceBillings: [
              {
                ...gqlBilling.departments![0].insuranceBillings![0],
                outstandingAmount: 0,
              },
            ],
          },
        ],
      }),
    );
    expect(totals.outstandingAmount).toBe(12000 - 4000);
    expect(totals.outstandingAmount).not.toBe(20000 - 4000);
  });

  it("returns zeros for no billing", () => {
    const totals = getVisitBillingTotals(null);
    expect(totals).toEqual({
      totalAmount: 0,
      insuranceCoveredAmount: 0,
      patientPayableAmount: 0,
      paidAmount: 0,
      outstandingAmount: 0,
      loanOutstandingAmount: 0,
      giveawayOutstandingAmount: 0,
      waivedAmount: 0,
    });
  });
});

describe("line + billed helpers", () => {
  it("computes line totals from snapshot price × quantity", () => {
    const item = mapGqlVisitBilling(gqlBilling).departments[0].insuranceBillings[0]
      .items[0];
    expect(visitBillingLineTotal(item)).toBe(10000);
  });

  it("detects billed products by visit department product id", () => {
    const mapped = mapGqlVisitBilling(gqlBilling);
    expect(isVisitDepartmentProductBilled(mapped, "vdp-1")).toBe(true);
    expect(isVisitDepartmentProductBilled(mapped, "missing")).toBe(false);
  });
});
