export interface PatientInsuranceValidityDates {
  validFrom: string
  validUntil: string
}

const formatDateOnly = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

export function getDefaultPatientInsuranceValidityDates(
  now = new Date(),
): PatientInsuranceValidityDates {
  return {
    validFrom: formatDateOnly(now),
    validUntil: formatDateOnly(
      new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
    ),
  }
}

export function getExistingPatientInsuranceValidityDates(
  insurance:
    | Pick<PatientInsuranceValidityDates, "validFrom" | "validUntil">
    | undefined,
): Partial<PatientInsuranceValidityDates> {
  return insurance
    ? { validFrom: insurance.validFrom, validUntil: insurance.validUntil }
    : {}
}
