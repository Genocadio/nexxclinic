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
