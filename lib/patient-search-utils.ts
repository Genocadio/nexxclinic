import type { PatientFilterInput } from "@/hooks/patients/hooks";

export type SearchFilterType = "name" | "insuranceCardNumber";

/**
 * Resolves a patient search query into the appropriate PatientFilterInput.
 *
 * Rules:
 * - If searchFilterType is "insuranceCardNumber": search by insuranceCardNumber.
 * - In smart search mode ("name"):
 *   1. If query contains letters: search by name.
 *   2. If query consists of digits (<= 12 digits, covering international phone numbers): search by phoneNumber.
 *   3. If query consists of digits exceeding 12 digits (e.g. 16-digit Rwandan national ID): automatically and silently switch to ID search (name parameter matches nationalIdNumber, patientIdentifier, and fullName).
 */
export function resolvePatientSearchFilter(
  query: string,
  searchFilterType: SearchFilterType = "name"
): PatientFilterInput {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return {};
  }

  if (searchFilterType === "insuranceCardNumber") {
    return { insuranceCardNumber: trimmedQuery };
  }

  const digitsOnly = trimmedQuery.replace(/\D/g, "");
  const hasLetters = /[a-zA-Z]/.test(trimmedQuery);

  if (hasLetters) {
    return { name: trimmedQuery };
  }

  if (digitsOnly.length > 12) {
    // Digits exceed 12 -> silently and automatically switch to ID search
    return { name: trimmedQuery };
  }

  if (digitsOnly.length > 0) {
    // Digits <= 12 -> phone number search
    return { phoneNumber: trimmedQuery };
  }

  return { name: trimmedQuery };
}
