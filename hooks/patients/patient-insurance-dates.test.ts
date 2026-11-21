import { describe, expect, it } from "vitest"
import {
  getDefaultPatientInsuranceValidityDates,
  getExistingPatientInsuranceValidityDates,
} from "./patient-insurance-dates"

describe("patient insurance validity dates", () => {
  it("preserves the dates from an existing policy", () => {
    expect(
      getExistingPatientInsuranceValidityDates({
        validFrom: "2024-02-01",
        validUntil: "2025-01-31",
      }),
    ).toEqual({
      validFrom: "2024-02-01",
      validUntil: "2025-01-31",
    })
  })

  it("does not invent dates when an existing policy is unavailable", () => {
    expect(getExistingPatientInsuranceValidityDates(undefined)).toEqual({})
  })

  it("sets a one-year validity period for a new policy", () => {
    expect(
      getDefaultPatientInsuranceValidityDates(new Date(2026, 0, 19)),
    ).toEqual({
      validFrom: "2026-01-19",
      validUntil: "2027-01-19",
    })
  })
})
