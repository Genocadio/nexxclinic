import { useCallback } from 'react'
import type { PatientInsurance } from '@/lib/api-types'
import { isDominantMemberRequired } from '@/lib/validation-utils'
import { useCreatePatientInsurance, useUpdatePatientInsurance } from '@/hooks/patients/hooks'

export type SavePatientInsuranceInput = {
  patientId: string
  patientDateOfBirth: string
  insuranceProviderId: string
  insuranceCardNumber: string
  providingCompanyOrEmployer: string
  dominantFirstName?: string
  dominantLastName?: string
  dominantPhone?: string
  existingPatientInsurances?: PatientInsurance[]
}

export type SavePatientInsuranceFieldErrors = {
  card?: string
  employer?: string
  dominant?: string
}

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
  if (
    dominantRequired
    && (!input.dominantFirstName?.trim() || !input.dominantLastName?.trim() || !input.dominantPhone?.trim())
  ) {
    errors.dominant =
      'Dominant member first name, last name and phone are required for patients 18 years or younger.'
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

    const dominantMember =
      input.dominantFirstName || input.dominantLastName || input.dominantPhone
        ? {
            firstName: input.dominantFirstName || '',
            lastName: input.dominantLastName || '',
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
