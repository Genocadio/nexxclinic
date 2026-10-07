import { describe, expect, it } from "vitest"
import {
  canDischargeVisit,
  getVisitProductBillingState,
  getVisitProductExemptionMode,
  isBilledVisitProduct,
  visitProductsFullySettled,
  visitHasUnbilledProducts,
} from "./visit-product-utils"
import type { Visit, VisitDepartmentProduct } from "./api-types"

describe("canDischargeVisit", () => {
  it("returns false for null/undefined visits", () => {
    expect(canDischargeVisit(null)).toBe(false)
    expect(canDischargeVisit(undefined)).toBe(false)
  })

  it("returns false if visit has already terminal status", () => {
    const visit = {
      id: "v-1",
      status: "COMPLETED",
      departments: [{ id: "d-1", status: "COMPLETED", answerId: "ans-1" }],
    } as unknown as Visit
    expect(canDischargeVisit(visit)).toBe(false)
  })

  it("returns false if visit has no departments", () => {
    const visit = {
      id: "v-1",
      status: "ACTIVE",
      departments: [],
    } as unknown as Visit
    expect(canDischargeVisit(visit)).toBe(false)
  })

  it("returns false if visit departments have no answer recorded", () => {
    const visit = {
      id: "v-1",
      status: "ACTIVE",
      departments: [
        {
          id: "d-1",
          status: "COMPLETED",
          answerId: null,
          hasFinalizedConsultationAnswers: false,
        },
      ],
    } as unknown as Visit
    expect(canDischargeVisit(visit)).toBe(false)
  })

  it("returns false if any non-cancelled department is not completed/finalised", () => {
    const visit = {
      id: "v-1",
      status: "ACTIVE",
      departments: [
        {
          id: "d-1",
          status: "ACTIVE",
          answerId: "ans-1",
        },
      ],
    } as unknown as Visit
    expect(canDischargeVisit(visit)).toBe(false)
  })

  it("returns true when departments are completed/finalised and at least one has an answer", () => {
    const visit = {
      id: "v-1",
      status: "ACTIVE",
      departments: [
        {
          id: "d-1",
          status: "COMPLETED",
          answerId: "ans-123",
        },
      ],
    } as unknown as Visit
    expect(canDischargeVisit(visit)).toBe(true)
  })

  it("returns true when answer is indicated via hasFinalizedConsultationAnswers", () => {
    const visit = {
      id: "v-1",
      status: "ACTIVE",
      departments: [
        {
          id: "d-1",
          status: "COMPLETED",
          hasFinalizedConsultationAnswers: true,
        },
      ],
    } as unknown as Visit
    expect(canDischargeVisit(visit)).toBe(true)
  })
})

describe("billing state / exemption mode split", () => {
  const product = (fields: Partial<VisitDepartmentProduct>): VisitDepartmentProduct =>
    ({ id: "p-1", quantity: 1, ...fields }) as unknown as VisitDepartmentProduct

  const visitWith = (products: VisitDepartmentProduct[]): Visit =>
    ({
      id: "v-1",
      status: "ACTIVE",
      departments: [{ id: "d-1", status: "BILLING", products }],
    }) as unknown as Visit

  it("derives billing state from the legacy status when billingState is absent", () => {
    expect(getVisitProductBillingState(product({ status: "PENDING" as any }))).toBe("UNBILLED")
    expect(getVisitProductBillingState(product({ status: "UNPAID" as any }))).toBe("UNBILLED")
    expect(getVisitProductBillingState(product({ status: "CORRECTION_PENDING" as any }))).toBe("CORRECTING")
    expect(getVisitProductBillingState(product({ status: "BILLED" as any }))).toBe("BILLED")
    expect(getVisitProductBillingState(product({ status: "EXEMPTED" as any }))).toBe("BILLED")
    expect(getVisitProductBillingState(product({ status: "PATIENT_SHARE_EXEMPTED" as any }))).toBe("BILLED")
  })

  it("prefers the dedicated billingState field over the legacy status", () => {
    const p = product({ status: "EXEMPTED" as any, billingState: "UNBILLED" as any })
    expect(getVisitProductBillingState(p)).toBe("UNBILLED")
  })

  it("derives exemption mode from the legacy status when exemptionMode is absent", () => {
    expect(getVisitProductExemptionMode(product({ status: "BILLED" as any }))).toBe("NONE")
    expect(getVisitProductExemptionMode(product({ status: "EXEMPTED" as any }))).toBe("FULL")
    expect(
      getVisitProductExemptionMode(product({ status: "PATIENT_SHARE_EXEMPTED" as any })),
    ).toBe("PATIENT_SHARE")
  })

  it("treats BILLED+FULL as exempted, not billed as a normal charge", () => {
    expect(isBilledVisitProduct(product({ billingState: "BILLED" as any, exemptionMode: "NONE" as any }))).toBe(true)
    expect(isBilledVisitProduct(product({ billingState: "BILLED" as any, exemptionMode: "FULL" as any }))).toBe(false)
    expect(isBilledVisitProduct(product({ billingState: "CORRECTING" as any }))).toBe(false)
  })

  it("settles a visit when every product is billed, regardless of exemption mode", () => {
    const visit = visitWith([
      product({ billingState: "BILLED" as any, exemptionMode: "NONE" as any }),
      product({ id: "p-2", billingState: "BILLED" as any, exemptionMode: "FULL" as any }),
      product({ id: "p-3", billingState: "BILLED" as any, exemptionMode: "PATIENT_SHARE" as any }),
    ])
    expect(visitProductsFullySettled(visit)).toBe(true)
    expect(visitHasUnbilledProducts(visit)).toBe(false)
  })

  it("does not settle while a product is unbilled or mid-correction", () => {
    expect(visitProductsFullySettled(visitWith([product({ billingState: "UNBILLED" as any })]))).toBe(false)
    expect(visitProductsFullySettled(visitWith([product({ billingState: "CORRECTING" as any })]))).toBe(false)
    expect(visitHasUnbilledProducts(visitWith([product({ billingState: "CORRECTING" as any })]))).toBe(false)
    expect(visitHasUnbilledProducts(visitWith([product({ billingState: "UNBILLED" as any })]))).toBe(true)
  })
})
