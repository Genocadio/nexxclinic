import { Gender, type Patient } from "@/lib/api-types"

export function getPatientDisplayName(patient: Patient): string {
  return [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(" ").trim()
}

export function getPatientAge(patient: Patient): number | null {
  if (!patient.dateOfBirth) return null
  const dob = new Date(patient.dateOfBirth)
  if (Number.isNaN(dob.getTime())) return null
  return new Date().getFullYear() - dob.getFullYear()
}

export function formatPatientGender(gender: Gender): string {
  if (gender === Gender.MALE) return "Male"
  if (gender === Gender.FEMALE) return "Female"
  return "Other"
}

export function getPatientPhone(patient: Patient): string {
  return patient.primaryPhoneNumber || patient.alternativePhone || ""
}

/**
 * Splits a single full name string into firstName, middleName, and lastName.
 * - 1 name:  { firstName: "John", middleName: undefined, lastName: undefined }
 * - 2 names: { firstName: "John", middleName: undefined, lastName: "Doe" }
 * - 3 names: { firstName: "Jean", middleName: "Paul", lastName: "Habimana" }
 * - 4+ names:{ firstName: "Jean", middleName: "Pierre Paul", lastName: "Habimana" }
 */
export function splitFullName(fullName?: string | null): {
  firstName: string
  middleName?: string
  lastName?: string
} {
  const trimmed = (fullName || "").trim().replace(/\s+/g, " ")
  if (!trimmed) {
    return { firstName: "", middleName: undefined, lastName: undefined }
  }
  const parts = trimmed.split(" ")
  if (parts.length === 1) {
    return { firstName: parts[0], middleName: undefined, lastName: undefined }
  }
  if (parts.length === 2) {
    return { firstName: parts[0], middleName: undefined, lastName: parts[1] }
  }
  const firstName = parts[0]
  const lastName = parts[parts.length - 1]
  const middleName = parts.slice(1, -1).join(" ")
  return {
    firstName,
    middleName: middleName || undefined,
    lastName: lastName || undefined,
  }
}

/**
 * Splits a full name for user/worker records where there are only firstName and lastName.
 * - 1 name:  { firstName: "Eric", lastName: undefined }
 * - 2 names: { firstName: "Eric", lastName: "Habimana" }
 * - 3+ names:{ firstName: "Eric", lastName: "Jean Habimana" }
 */
export function splitWorkerName(fullName?: string | null): {
  firstName: string
  lastName?: string
} {
  const trimmed = (fullName || "").trim().replace(/\s+/g, " ")
  if (!trimmed) {
    return { firstName: "", lastName: undefined }
  }
  const parts = trimmed.split(" ")
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: undefined }
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  }
}
