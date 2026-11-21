import { describe, expect, it } from "vitest"
import { getPatientShareDefaultInfo } from "./insurance-utils"

describe("getPatientShareDefaultInfo", () => {
  it("uses the current percentage of the patient's selected tier", () => {
    expect(
      getPatientShareDefaultInfo({
        patientSharePercentage: 15,
        patientShareCoverageId: "tier-a",
        insuranceProvider: {
          coverages: [
            {
              id: "tier-a",
              departmentName: "Dental",
              patientSharePercentage: 25,
            },
          ],
        },
      }),
    ).toEqual({
      percentage: 25,
      source: "Patient default",
      tierLabel: "Dental",
    })
  })

  it("preserves an explicit zero patient share", () => {
    expect(
      getPatientShareDefaultInfo({
        patientSharePercentage: 0,
        insuranceProvider: {
          coverages: [{ patientSharePercentage: 30 }],
        },
      }),
    ).toEqual({ percentage: 0, source: "Patient default" })
  })

  it("falls back to the provider base only when no patient default is saved", () => {
    expect(
      getPatientShareDefaultInfo({
        insuranceProvider: {
          coverages: [
            { departmentId: "dept-1", patientSharePercentage: 10 },
            { patientSharePercentage: 35 },
          ],
        },
      }),
    ).toEqual({
      percentage: 35,
      source: "Provider base",
      tierLabel: "Base / General",
    })
  })

  it("identifies insurers whose share depends on service rules", () => {
    expect(
      getPatientShareDefaultInfo({
        insuranceProvider: {
          coverages: [{ departmentId: "dept-1", patientSharePercentage: 20 }],
        },
      }),
    ).toEqual({ percentage: null, source: "Service rules" })
  })
})
