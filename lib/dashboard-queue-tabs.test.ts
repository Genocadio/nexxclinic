import { describe, expect, it } from "vitest"
import { getDashboardQueueTabs } from "./dashboard-queue-tabs"

const noRoles = {
  hasReceptionistRole: false,
  hasNurseRole: false,
  hasFinanceRole: false,
  hasClinicianOrDoctorRole: false,
}

describe("getDashboardQueueTabs", () => {
  it("keeps receptionist queues when Finance is also assigned", () => {
    const tabs = getDashboardQueueTabs({
      ...noRoles,
      hasReceptionistRole: true,
      hasFinanceRole: true,
    })

    expect(tabs.map(({ id }) => id)).toEqual([
      "all",
      "TRIAGE",
      "TO_BILL",
      "OUTSTANDING",
      "COMPLETED",
    ])
    expect(tabs[1].label).toBe("Waiting Triage")
  })

  it("combines all three role queues without duplicating Triage", () => {
    const tabs = getDashboardQueueTabs({
      ...noRoles,
      hasReceptionistRole: true,
      hasNurseRole: true,
      hasFinanceRole: true,
    })

    expect(tabs.map(({ id }) => id)).toEqual([
      "all",
      "TRIAGE",
      "IN_PROGRESS",
      "TO_BILL",
      "OUTSTANDING",
      "COMPLETED",
    ])
  })

  it("preserves the single-role Reception and Finance queues", () => {
    const receptionistTabs = getDashboardQueueTabs({
      ...noRoles,
      hasReceptionistRole: true,
    })
    const financeTabs = getDashboardQueueTabs({
      ...noRoles,
      hasFinanceRole: true,
    })

    expect(receptionistTabs.map(({ id }) => id)).toEqual([
      "all",
      "TRIAGE",
      "COMPLETED",
    ])
    expect(financeTabs.map(({ id }) => id)).toEqual([
      "TO_BILL",
      "OUTSTANDING",
      "COMPLETED",
    ])
  })
})
