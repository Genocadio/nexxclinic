import type { RegisterPatientInput } from "@/hooks/patients/hooks"

export type FormInsurance = NonNullable<RegisterPatientInput["insurances"]>[number]

export interface SavedInsuranceEntry {
  snapshot: string
  insurance: FormInsurance
  index: number
}

export interface InsuranceSaveOutcome {
  status: string
  id?: string
  message?: string
}

export interface InsuranceDeleteOutcome {
  status: string
  data?: boolean
  message?: string
}

export interface InsuranceSaveFailure {
  key: string
  kind: "save" | "delete"
  index: number
  insurance: FormInsurance
  message: string
}

export const getInsuranceSnapshot = (insurance: FormInsurance) =>
  JSON.stringify({
    insuranceId: insurance.insuranceId || "",
    insuranceCardNumber: insurance.insuranceCardNumber || "",
    providingCompanyOrEmployer: insurance.providingCompanyOrEmployer || "",
    patientShareCoverageId: insurance.patientShareCoverageId || "",
    patientSharePercentage: insurance.patientSharePercentage ?? "",
    isSelf: insurance.isSelf !== false,
    dominantMemberName:
      insurance.dominantMember?.name?.trim() ||
      [
        insurance.dominantMember?.firstName?.trim(),
        insurance.dominantMember?.lastName?.trim(),
      ]
        .filter(Boolean)
        .join(" "),
    dominantMemberPhone: insurance.dominantMember?.phone?.trim() || "",
  })

export const getInsuranceSaveKey = (
  insurance: FormInsurance,
  index: number,
) =>
  insurance.id
    ? `insurance-${insurance.id}`
    : insurance.clientId
      ? `new-${insurance.clientId}`
      : `new-${index}`

export function getChangedInsuranceRows(
  insuranceRows: FormInsurance[],
  isEdit: boolean,
  savedEntries: Map<string, SavedInsuranceEntry>,
) {
  return insuranceRows
    .map((insurance, index) => ({ insurance, index }))
    .filter(({ insurance }) => {
      if (!isEdit || !insurance.id) return true
      return (
        savedEntries.get(String(insurance.id))?.snapshot !==
        getInsuranceSnapshot(insurance)
      )
    })
}

export async function persistInsuranceChanges(options: {
  insuranceRows: FormInsurance[]
  savedEntries: Map<string, SavedInsuranceEntry>
  saveInsurance: (
    insurance: FormInsurance,
    index: number,
  ) => Promise<InsuranceSaveOutcome>
  deleteInsurance: (id: string) => Promise<InsuranceDeleteOutcome>
}) {
  const savedEntries = new Map(options.savedEntries)
  const newIds = new Map<number, string>()
  const failures: InsuranceSaveFailure[] = []

  for (const [index, insurance] of options.insuranceRows.entries()) {
    if (!insurance.id) continue
    const id = String(insurance.id)
    const savedEntry = savedEntries.get(id)
    if (savedEntry && savedEntry.snapshot === getInsuranceSnapshot(insurance)) {
      savedEntries.set(id, {
        snapshot: savedEntry.snapshot,
        insurance,
        index,
      })
    }
  }

  const changedRows = getChangedInsuranceRows(
    options.insuranceRows,
    true,
    options.savedEntries,
  )

  for (const { insurance, index } of changedRows) {
    try {
      const outcome = await options.saveInsurance(insurance, index)
      const savedId = String(insurance.id || outcome.id || "")
      if (outcome.status !== "SUCCESS" || !savedId) {
        failures.push({
          key: getInsuranceSaveKey(insurance, index),
          kind: "save",
          index,
          insurance,
          message: outcome.message || "Could not save this insurance. Please try again.",
        })
        continue
      }

      const savedInsurance = { ...insurance, id: savedId }
      savedEntries.set(savedId, {
        snapshot: getInsuranceSnapshot(savedInsurance),
        insurance: savedInsurance,
        index,
      })
      if (!insurance.id) newIds.set(index, savedId)
    } catch (error) {
      failures.push({
        key: getInsuranceSaveKey(insurance, index),
        kind: "save",
        index,
        insurance,
        message:
          error instanceof Error
            ? error.message
            : "Could not save this insurance. Please try again.",
      })
    }
  }

  const currentIds = new Set(
    options.insuranceRows
      .map((insurance) => insurance.id && String(insurance.id))
      .filter((id): id is string => Boolean(id)),
  )
  for (const id of newIds.values()) currentIds.add(id)

  for (const [id, savedEntry] of savedEntries) {
    if (currentIds.has(id)) continue
    try {
      const outcome = await options.deleteInsurance(id)
      if (outcome.status === "SUCCESS" && outcome.data) {
        savedEntries.delete(id)
      } else {
        failures.push({
          key: getInsuranceSaveKey(savedEntry.insurance, savedEntry.index),
          kind: "delete",
          index: savedEntry.index,
          insurance: savedEntry.insurance,
          message: outcome.message
            ? `${outcome.message} The entry was restored; remove it and save again to retry.`
            : "Could not remove this insurance. The entry was restored; remove it and save again to retry.",
        })
      }
    } catch (error) {
      failures.push({
        key: getInsuranceSaveKey(savedEntry.insurance, savedEntry.index),
        kind: "delete",
        index: savedEntry.index,
        insurance: savedEntry.insurance,
        message:
          error instanceof Error
            ? `${error.message} The entry was restored; remove it and save again to retry.`
            : "Could not remove this insurance. The entry was restored; remove it and save again to retry.",
      })
    }
  }

  return { savedEntries, newIds, failures }
}
