import { describe, expect, it } from "bun:test"
import { canDischargeVisit } from "./visit-product-utils"
import type { Visit } from "./api-types"

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
