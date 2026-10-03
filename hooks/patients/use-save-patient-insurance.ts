import { useCallback } from 'react'
import type { PatientInsurance } from '@/lib/api-types'
import { isDominantMemberRequired } from '@/lib/validation-utils'
import { splitFullName } from '@/lib/patient-display-utils'
import { useCreatePatientInsurance, useUpdatePatientInsurance } from '@/hooks/patients/hooks'

export type SavePatientInsuranceInput = {
  patientId: string
  patientDateOfBirth: string
  insuranceProviderId: string
  insuranceCardNumber: string
  providingCompanyOrEmployer: string
  isSelf?: boolean
  dominantName?: string
  dominantFirstName?: string
  dominantLastName?: string
  dominantPhone?: string
  existingPatientInsurances?: PatientInsurance[]
  /** Optional patient-specific default patient share percentage (0-100). */
  patientSharePercentage?: number | null
  /** Reference to an InsuranceCoverage record. Takes precedence over patientSharePercentage. */
  patientShareCoverageId?: string | null
}

export type SavePatientInsuranceFieldErrors = {
  card?: string
  employer?: string
  dominant?: string
}

/**
 * Matches the backend rule for principalMemberPhoneNumber:
 * optional leading +, then 7-15 digits.
 */
const PHONE_NUMBER_REGEX = /^\+?\d{7,15}$/

export function validateSavePatientInsuranceInput(
  input: SavePatientInsuranceInput,
): SavePatientInsuranceFieldErrors {
  const errors: SavePatientInsuranceFieldErrors = {}
  const dominantRequired = isDominantMemberRequired(input.patientDateOfBirth, true)

  if (!input.insuranceCardNumber.trim()) {
    errors.card = 'Insurance card number is required.'
  }
  if (!input.providingCompanyOrEmployer.trim()) {
    errors.employer = 'Providing company or employer is required.'
  }

  // If patient is self, no dominant member validation required
  if (input.isSelf) {
    return errors
  }

  // Format validation — reject invalid phone even if dominant is not required
  if (input.dominantPhone?.trim() && !PHONE_NUMBER_REGEX.test(input.dominantPhone.trim().replace(/\s+/g, ''))) {
    errors.dominant = 'Enter a valid phone number (7-15 digits, optional leading +)'
  }

  const resolved = input.dominantName
    ? splitFullName(input.dominantName)
    : {
        firstName: input.dominantFirstName?.trim() || '',
        lastName: input.dominantLastName?.trim() || '',
      }

  const firstName = resolved.firstName || input.dominantFirstName?.trim() || ''
  const lastName = resolved.lastName || input.dominantLastName?.trim() || ''

  const mustFillDominant =
    dominantRequired ||
    input.isSelf === false ||
    Boolean(input.dominantName?.trim() || firstName || lastName || input.dominantPhone?.trim())

  if (
    mustFillDominant
    && (!firstName || !lastName || !input.dominantPhone?.trim())
  ) {
    errors.dominant = dominantRequired
      ? 'Principal member full name and phone are required for patients 18 years or younger.'
      : 'Principal member full name and phone are required when patient is not the principal policyholder.'
  }

  return errors
}

export function useSavePatientInsurance() {
  const { createPatientInsurance, loading: creating } = useCreatePatientInsurance()
  const { updatePatientInsurance, loading: updating } = useUpdatePatientInsurance()

  const savePatientInsurance = useCallback(async (input: SavePatientInsuranceInput) => {
    const fieldErrors = validateSavePatientInsuranceInput(input)
    if (Object.keys(fieldErrors).length > 0) {
      return { status: 'VALIDATION_ERROR' as const, fieldErrors }
    }

    const resolved = input.dominantName
      ? splitFullName(input.dominantName)
      : {
          firstName: input.dominantFirstName || '',
          lastName: input.dominantLastName || '',
        }

    const dominantMember =
      !input.isSelf && (input.dominantName || input.dominantFirstName || input.dominantLastName || input.dominantPhone)
        ? {
            name: input.dominantName || [resolved.firstName, resolved.lastName].filter(Boolean).join(' ') || undefined,
            firstName: resolved.firstName || '',
            lastName: resolved.lastName || '',
            phone: input.dominantPhone || '',
          }
        : undefined

    const existingInsurance = (input.existingPatientInsurances || []).find(
      (ins) => String(ins.insuranceProvider.id) === input.insuranceProviderId,
    )

    const commonPayload = {
      patientId: input.patientId,
      insuranceProviderId: input.insuranceProviderId,
      insuranceCardNumber: input.insuranceCardNumber,
      providingCompanyOrEmployer: input.providingCompanyOrEmployer || null,
      dominantMember,
      validFrom: new Date().toISOString().slice(0, 10),
      validUntil: new Date(
        new Date().getFullYear() + 1,
        new Date().getMonth(),
        new Date().getDate(),
      ).toISOString().slice(0, 10),
      patientSharePercentage: input.patientSharePercentage ?? null,
      patientShareCoverageId: input.patientShareCoverageId ?? null,
    }

    const response = existingInsurance
      ? await updatePatientInsurance(existingInsurance.id, commonPayload)
      : await createPatientInsurance(commonPayload)

    return { status: response?.status || 'ERROR', response, fieldErrors: {} as SavePatientInsuranceFieldErrors }
  }, [createPatientInsurance, updatePatientInsurance])

  return {
    savePatientInsurance,
    loading: creating || updating,
  }
}
