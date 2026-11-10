import { describe, expect, it } from "vitest"
import { calculateUserReports, reconcileUserReportsData } from "./user-reports-calculator"

describe("reconcileUserReportsData", () => {
  it("lifts zero headline counts to match breakdown lists", () => {
    const base = calculateUserReports([], null, "today", "2026-01-01", "2026-01-01")
    const data = {
      ...base,
      totalInteractions: 0,
      uniquePatientsTouched: 0,
      clinician: {
        ...base.clinician,
        consultationsCount: 0,
        prescriptionsCount: 0,
        encountersList: [
          { id: "1", patientId: "p1", status: "COMPLETED", gender: "MALE", age: 30 },
          { id: "2", patientId: "p2", status: "IN_PROGRESS", gender: "FEMALE", age: 60 },
        ] as any,
      },
    }
    const out = reconcileUserReportsData(data)
    expect(out.clinician.consultationsCount).toBe(2)
    expect(out.clinician.consultationsCompletedCount).toBe(1)
    expect(out.uniquePatientsTouched).toBe(2)
    expect(out.demographics?.maleCount).toBe(1)
    expect(out.demographics?.totalPatientsCount).toBe(2)
  })
})
