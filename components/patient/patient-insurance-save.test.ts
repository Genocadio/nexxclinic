import { describe, expect, it, vi } from "vitest"
import type { FormInsurance, SavedInsuranceEntry } from "./patient-insurance-save"
import {
  getInsuranceSaveKey,
  getInsuranceSnapshot,
  persistInsuranceChanges,
} from "./patient-insurance-save"

const makeInsurance = (overrides: Partial<FormInsurance> = {}): FormInsurance => ({
  id: "insurance-1",
  insuranceId: "provider-1",
  insuranceCardNumber: "CARD-1",
  providingCompanyOrEmployer: "Employer",
  patientShareCoverageId: "coverage-1",
  patientSharePercentage: 20,
  isSelf: true,
  dominantMember: { name: "", firstName: "", lastName: "", phone: "" },
  ...overrides,
})

const savedEntry = (
  insurance: FormInsurance,
  index = 0,
): SavedInsuranceEntry => ({
  snapshot: getInsuranceSnapshot(insurance),
  insurance,
  index,
})

describe("patient insurance persistence", () => {
  it("uses a stable client key for an unsaved insurance row", () => {
    const newInsurance = makeInsurance({
      id: undefined,
      clientId: "local-insurance-1",
    })

    expect(getInsuranceSaveKey(newInsurance, 3)).toBe(
      "new-local-insurance-1",
    )
  })

  it("updates edited insurance entries without resaving untouched entries", async () => {
    const unchanged = makeInsurance()
    const edited = makeInsurance({
      id: "insurance-2",
      insuranceCardNumber: "UPDATED",
    })
    const saved = new Map([
      ["insurance-1", savedEntry(unchanged, 0)],
      ["insurance-2", savedEntry(makeInsurance({ id: "insurance-2" }), 1)],
    ])
    const saveInsurance = vi.fn().mockResolvedValue({ status: "SUCCESS" })

    const result = await persistInsuranceChanges({
      insuranceRows: [unchanged, edited],
      savedEntries: saved,
      saveInsurance,
      deleteInsurance: vi.fn(),
    })

    expect(saveInsurance).toHaveBeenCalledTimes(1)
    expect(saveInsurance).toHaveBeenCalledWith(edited, 1)
    expect(result.savedEntries.get("insurance-2")?.snapshot).toBe(
      getInsuranceSnapshot(edited),
    )
    expect(result.failures).toEqual([])
  })

  it("persists a new insurance and records its server ID", async () => {
    const newInsurance = makeInsurance({ id: undefined })
    const saveInsurance = vi.fn().mockResolvedValue({
      status: "SUCCESS",
      id: "insurance-new",
    })

    const result = await persistInsuranceChanges({
      insuranceRows: [newInsurance],
      savedEntries: new Map(),
      saveInsurance,
      deleteInsurance: vi.fn(),
    })

    expect(saveInsurance).toHaveBeenCalledWith(newInsurance, 0)
    expect(result.newIds.get(0)).toBe("insurance-new")
    expect(result.savedEntries.get("insurance-new")?.snapshot).toBe(
      getInsuranceSnapshot(newInsurance),
    )
    expect(result.failures).toEqual([])
  })

  it("deletes an insurance removed from the form", async () => {
    const removed = makeInsurance()
    const deleteInsurance = vi.fn().mockResolvedValue({
      status: "SUCCESS",
      data: true,
    })
    const saved = new Map([["insurance-1", savedEntry(removed)]])

    const result = await persistInsuranceChanges({
      insuranceRows: [],
      savedEntries: saved,
      saveInsurance: vi.fn(),
      deleteInsurance,
    })

    expect(deleteInsurance).toHaveBeenCalledWith("insurance-1")
    expect(result.savedEntries.size).toBe(0)
    expect(result.failures).toEqual([])
  })

  it("persists a changed coverage tier", async () => {
    const original = makeInsurance()
    const changed = makeInsurance({
      patientShareCoverageId: "coverage-2",
      patientSharePercentage: 35,
    })
    const saveInsurance = vi.fn().mockResolvedValue({ status: "SUCCESS" })

    const result = await persistInsuranceChanges({
      insuranceRows: [changed],
      savedEntries: new Map([["insurance-1", savedEntry(original)]]),
      saveInsurance,
      deleteInsurance: vi.fn(),
    })

    expect(saveInsurance).toHaveBeenCalledWith(changed, 0)
    expect(result.savedEntries.get("insurance-1")?.snapshot).toBe(
      getInsuranceSnapshot(changed),
    )
    expect(result.failures).toEqual([])
  })

  it("keeps failed saves and deletions retryable when other changes succeed", async () => {
    const updated = makeInsurance({
      id: "insurance-1",
      insuranceCardNumber: "SAVED",
    })
    const failedAddition = makeInsurance({
      id: undefined,
      insuranceId: "provider-2",
    })
    const removed = makeInsurance({ id: "insurance-3" })
    const saved = new Map([
      ["insurance-1", savedEntry(makeInsurance(), 0)],
      ["insurance-3", savedEntry(removed, 2)],
    ])
    const saveInsurance = vi
      .fn()
      .mockResolvedValueOnce({ status: "SUCCESS" })
      .mockResolvedValueOnce({
        status: "ERROR",
        message: "Create rejected",
      })

    const result = await persistInsuranceChanges({
      insuranceRows: [updated, failedAddition],
      savedEntries: saved,
      saveInsurance,
      deleteInsurance: vi.fn().mockResolvedValue({
        status: "ERROR",
        data: false,
        message: "Delete rejected",
      }),
    })

    expect(result.failures).toEqual([
      expect.objectContaining({
        kind: "save",
        key: "new-1",
        message: "Create rejected",
      }),
      expect.objectContaining({
        kind: "delete",
        key: "insurance-insurance-3",
        message: expect.stringContaining("Delete rejected"),
        insurance: removed,
      }),
    ])
    expect(result.savedEntries.get("insurance-1")?.snapshot).toBe(
      getInsuranceSnapshot(updated),
    )
    expect(result.savedEntries.get("insurance-3")?.insurance).toEqual(removed)
  })
})
