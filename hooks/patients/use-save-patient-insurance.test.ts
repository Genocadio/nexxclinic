import { describe, expect, it } from "vitest"
import { validateSavePatientInsuranceInput } from "./use-save-patient-insurance"

const yearsAgo = (years: number) => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - years)
  return date.toISOString().slice(0, 10)
}

describe("validateSavePatientInsuranceInput principal member rules", () => {
  const baseInput = {
    patientId: "patient-1",
    insuranceProviderId: "provider-1",
    insuranceCardNumber: "CARD-1",
    providingCompanyOrEmployer: "Acme Ltd",
    isSelf: false,
  }

  it("allows patients aged 18 or older to omit principal member details", () => {
    expect(
      validateSavePatientInsuranceInput({
        ...baseInput,
        patientDateOfBirth: yearsAgo(18),
      }),
    ).toEqual({})
  })

  it("requires principal member details for patients under 18", () => {
    expect(
      validateSavePatientInsuranceInput({
        ...baseInput,
        patientDateOfBirth: yearsAgo(17),
      }),
    ).toEqual({
      dominant:
        "Principal member full name and phone are required for patients under 18 years.",
    })
  })
})
