export interface DashboardQueueTab {
  id: string
  label: string
}

interface DashboardRoleFlags {
  hasReceptionistRole: boolean
  hasNurseRole: boolean
  hasFinanceRole: boolean
  hasClinicianOrDoctorRole: boolean
}

export function getDashboardQueueTabs({
  hasReceptionistRole,
  hasNurseRole,
  hasFinanceRole,
  hasClinicianOrDoctorRole,
}: DashboardRoleFlags): DashboardQueueTab[] {
  const tabs: DashboardQueueTab[] = []

  if (hasReceptionistRole) {
    tabs.push(
      { id: "all", label: "All Active" },
      { id: "TRIAGE", label: "Waiting Triage" },
    )
  }

  if (hasClinicianOrDoctorRole) {
    tabs.push(
      { id: "NEEDS_ME", label: "Needs Me" },
      { id: "IN_CARE", label: "In Care" },
    )
  }

  if (hasNurseRole) {
    if (!hasReceptionistRole) {
      tabs.push({ id: "TRIAGE", label: "Triage" })
    }
    if (!hasClinicianOrDoctorRole) {
      tabs.push({ id: "IN_PROGRESS", label: "In Progress" })
    }
  }

  if (hasFinanceRole) {
    tabs.push(
      { id: "TO_BILL", label: "To Bill" },
      { id: "OUTSTANDING", label: "Outstanding" },
    )
  }

  if (hasClinicianOrDoctorRole) {
    tabs.push({ id: "ON_HOLD", label: "On Hold" })
  }

  if (tabs.length === 0) {
    tabs.push({ id: "all", label: "All Active" })
  }

  tabs.push({ id: "COMPLETED", label: "Discharged" })
  return tabs
}
