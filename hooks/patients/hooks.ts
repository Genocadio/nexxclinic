import { useMutation, useQuery } from '@apollo/client'
import { GET_PATIENTS_QUERY, GET_PATIENT_QUERY } from '../queries'
import { REGISTER_PATIENT_MUTATION, CREATE_PATIENT_INSURANCE_MUTATION, UPDATE_PATIENT_INSURANCE_MUTATION, UPDATE_PATIENT_MUTATION } from '../mutations'
import React from 'react'
import type { Patient, SearchPatientsInput, PatientInsurance, Visit, ApiResponse, UpdatePatientInput } from '../types'
import { Gender } from '@/lib/api-types'
import {
  mapGqlPatient,
  mapGqlPatientInsurance,
  mapGqlVisit,
  type GqlPatient,
  type GqlPatientInsurance,
} from '@/lib/gql-mappers'

/** Patient list search filters (extends GraphQL SearchPatientsInput with legacy query keys). */
export type PatientFilterInput = SearchPatientsInput & {
  name?: string
  phoneNumber?: string
  insuranceName?: string
}

interface LocalGqlPatient extends GqlPatient {
  lastVisit?: {
    id: string
    status: string
    visitDate: string
  } | null
}

export interface SearchPatientsQueryData {
  searchPatients: {
    status: string
    message?: string
    data: LocalGqlPatient[]
    pagination?: {
      total: number
      totalPages: number
    }
  }
}

export interface GetPatientQueryData {
  patient: {
    status: string
    message?: string
    data: GqlPatient
  }
  patientInsurances: {
    status: string
    data: GqlPatientInsurance[]
  }
}

export interface RegisterPatientInput {
  firstName: string
  middleName?: string | null
  lastName?: string | null
  dateOfBirth: string
  gender?: string | null
  contactInfo?: {
    phone?: string | null
    email?: string | null
    address?: {
      street?: string | null
      sector?: string | null
      district?: string | null
      country?: string | null
    } | null
  } | null
  nationalIdNumber?: string | null
  emergencyContact?: {
    name?: string | null
    relation?: string | null
    phone?: string | null
  } | null
  insurances?: Array<{
    id?: string
    insuranceId?: string | null
    insuranceCardNumber: string
    providingCompanyOrEmployer: string
    dominantMember?: {
      firstName?: string | null
      lastName?: string | null
      phone?: string | null
    } | null
  }> | null
  notes?: string | null
}

type RegisterPatientInsuranceInput = NonNullable<RegisterPatientInput['insurances']>[number]

const getDominantMemberPayload = (dominantMember?: RegisterPatientInsuranceInput['dominantMember']) => {
  const firstName = dominantMember?.firstName?.trim() || ''
  const lastName = dominantMember?.lastName?.trim() || ''
  const phone = dominantMember?.phone?.trim() || ''
  const hasDominantMemberData = Boolean(firstName || lastName || phone)

  return {
    principalMember: !hasDominantMemberData,
    principalMemberName: hasDominantMemberData ? [firstName, lastName].filter(Boolean).join(' ') || null : null,
    principalMemberPhoneNumber: hasDominantMemberData ? phone || null : null,
  }
}

const attachLastVisit = (patient: Patient, lastVisit?: LocalGqlPatient['lastVisit']): Patient => {
  if (!lastVisit) return patient
  return {
    ...patient,
    lastVisit: {
      id: lastVisit.id,
      visitDate: lastVisit.visitDate,
      status: lastVisit.status as Visit['status'],
      patient,
      linkedInsurances: [],
      departments: [],
      vitalSigns: [],
    },
  }
}

const mapInsuranceMutationResult = (
  insurance: Pick<
    GqlPatientInsurance,
    | 'id'
    | 'insuranceCardNumber'
    | 'principalMember'
    | 'principalMemberName'
    | 'principalMemberPhoneNumber'
    | 'validFrom'
    | 'validUntil'
  >,
  insuranceProviderId: string,
  patientId?: string,
): PatientInsurance => {
  const patient: Patient = {
    id: patientId || '',
    firstName: '',
    dateOfBirth: '',
    gender: Gender.OTHER,
    patientInsurances: [],
    createdAt: '',
    updatedAt: '',
  }

  return mapGqlPatientInsurance(
    {
      ...insurance,
      insuranceProvider: {
        id: insuranceProviderId,
        insuranceName: '',
      },
    },
    patient,
  )
}

export interface PatientInsuranceMutationInput {
  patientId?: string
  insuranceProviderId: string
  insuranceCardNumber: string
  providingCompanyOrEmployer?: string | null
  dominantMember?: {
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
  } | null
  validFrom: string
  validUntil: string
}

export function useCreatePatientInsurance() {
  const [createPatientInsuranceMutation, { loading, error }] = useMutation(CREATE_PATIENT_INSURANCE_MUTATION)

  const createPatientInsurance = async (input: PatientInsuranceMutationInput): Promise<ApiResponse<PatientInsurance>> => {
    try {
      const result = await createPatientInsuranceMutation({
        variables: {
          input: {
            patientId: input.patientId,
            insuranceProviderId: input.insuranceProviderId,
            insuranceCardNumber: input.insuranceCardNumber,
            providingCompanyOrEmployer: input.providingCompanyOrEmployer,
            principalMember: !input.dominantMember?.firstName?.trim() && !input.dominantMember?.lastName?.trim() && !input.dominantMember?.phone?.trim(),
            principalMemberName: [input.dominantMember?.firstName, input.dominantMember?.lastName].filter(Boolean).join(' ') || null,
            principalMemberPhoneNumber: input.dominantMember?.phone?.trim() || null,
            validFrom: input.validFrom,
            validUntil: input.validUntil,
          },
        },
      })

      const created = result.data?.createPatientInsurance
      const createdData = created?.data
      const insuranceProvider = input.insuranceProviderId

      return {
        status: created?.status || 'ERROR',
        message: created?.message,
        messages: created?.message ? [{ text: created.message, type: created.status || 'ERROR' }] : undefined,
        data: createdData
          ? mapInsuranceMutationResult(createdData, insuranceProvider, input.patientId)
          : undefined,
      }
    } catch (err) {
      console.error('Create patient insurance error:', err)
      throw err
    }
  }

  return { createPatientInsurance, loading, error }
}

export function useUpdatePatientInsurance() {
  const [updatePatientInsuranceMutation, { loading, error }] = useMutation(UPDATE_PATIENT_INSURANCE_MUTATION)

  const updatePatientInsurance = async (patientInsuranceId: string, input: PatientInsuranceMutationInput): Promise<ApiResponse<PatientInsurance>> => {
    try {
      const result = await updatePatientInsuranceMutation({
        variables: {
          patientInsuranceId,
          input: {
            patientId: input.patientId,
            insuranceProviderId: input.insuranceProviderId,
            insuranceCardNumber: input.insuranceCardNumber,
            providingCompanyOrEmployer: input.providingCompanyOrEmployer,
            principalMember: !input.dominantMember?.firstName?.trim() && !input.dominantMember?.lastName?.trim() && !input.dominantMember?.phone?.trim(),
            principalMemberName: [input.dominantMember?.firstName, input.dominantMember?.lastName].filter(Boolean).join(' ') || null,
            principalMemberPhoneNumber: input.dominantMember?.phone?.trim() || null,
            validFrom: input.validFrom,
            validUntil: input.validUntil,
          },
        },
      })

      const updated = result.data?.updatePatientInsurance
      const updatedData = updated?.data
      const insuranceProvider = input.insuranceProviderId

      return {
        status: updated?.status || 'ERROR',
        message: updated?.message,
        messages: updated?.message ? [{ text: updated.message, type: updated.status || 'ERROR' }] : undefined,
        data: updatedData
          ? mapInsuranceMutationResult(updatedData, insuranceProvider, input.patientId)
          : undefined,
      }
    } catch (err) {
      console.error('Update patient insurance error:', err)
      throw err
    }
  }

  return { updatePatientInsurance, loading, error }
}

export function usePatients(filter?: PatientFilterInput, page: number = 0, size: number = 20) {
  const shouldSkip = !filter || Object.keys(filter).length === 0
  const input = {
    ...(filter?.name ? { name: filter.name } : {}),
    ...(filter?.phoneNumber ? { phoneNumber: filter.phoneNumber } : {}),
    ...(filter?.age != null ? { age: filter.age } : {}),
    page,
    size,
  }
  
  const { data, loading, error, refetch } = useQuery<SearchPatientsQueryData>(GET_PATIENTS_QUERY, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
    skip: shouldSkip,
  })

  const patients: Patient[] = (data?.searchPatients?.data || []).map((gqlPatient: LocalGqlPatient) =>
    attachLastVisit(mapGqlPatient(gqlPatient), gqlPatient.lastVisit),
  )
  const totalPages = data?.searchPatients?.pagination?.totalPages || 0
  const totalElements = data?.searchPatients?.pagination?.total || 0

  return {
    patients,
    loading,
    error,
    totalPages,
    totalElements,
    refetch
  }
}

export function usePatient(id: string | null) {
  const { data, loading, error, refetch } = useQuery<GetPatientQueryData>(GET_PATIENT_QUERY, {
    variables: { patientId: id },
    skip: !id,
    fetchPolicy: 'cache-and-network'
  })

  const patientData = data?.patient?.data
  const patientInsurances = data?.patientInsurances?.data || []
  const patient = React.useMemo<Patient | undefined>(() => {
    if (!patientData) {
      return undefined
    }

    const gqlPatient = patientData as LocalGqlPatient
    let mapped = mapGqlPatient(gqlPatient)
    mapped = {
      ...mapped,
      patientInsurances: patientInsurances.map((insurance) => mapGqlPatientInsurance(insurance, mapped)),
    }
    return attachLastVisit(mapped, gqlPatient.lastVisit)
  }, [patientData, patientInsurances])

  return {
    patient,
    loading,
    error,
    refetch
  }
}

export function useRegisterPatient() {
  const [registerPatientMutation, { loading, error }] = useMutation(REGISTER_PATIENT_MUTATION)

  const registerPatient = async (input: RegisterPatientInput): Promise<ApiResponse<Visit>> => {
    try {
      const patientInput: any = {
        firstName: input.firstName,
        middleName: input.middleName || null,
        lastName: input.lastName || null,
        dateOfBirth: input.dateOfBirth,
        gender: input.gender === 'M' ? 'MALE' : input.gender === 'F' ? 'FEMALE' : input.gender || null,
        primaryPhoneNumber: input.contactInfo?.phone || null,
        alternativePhone: null,
        village: input.contactInfo?.address?.street || null,
        city: input.contactInfo?.address?.sector || null,
        district: input.contactInfo?.address?.district || null,
        postalAddress: input.contactInfo?.address?.country || null,
        nationalIdNumber: input.nationalIdNumber || null,
        passportNumber: null,
        emergencyContactName: input.emergencyContact?.name || null,
        emergencyContactRelationship: input.emergencyContact?.relation || null,
        emergencyContactPhoneNumber: input.emergencyContact?.phone || null,
      }

      if (input.insurances && input.insurances.length > 0) {
        const now = new Date()
        const validFrom = now.toISOString().slice(0, 10)
        const validUntil = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString().slice(0, 10)

        patientInput.insurances = input.insurances
          .filter((insurance) => insurance?.insuranceId && insurance?.insuranceCardNumber && insurance?.providingCompanyOrEmployer)
          .map((insurance) => ({
            insuranceProviderId: String(insurance.insuranceId),
            insuranceCardNumber: insurance.insuranceCardNumber,
            providingCompanyOrEmployer: insurance.providingCompanyOrEmployer,
            ...getDominantMemberPayload(insurance.dominantMember),
            validFrom,
            validUntil,
          }))
      }

      const result = await registerPatientMutation({
        variables: { input: patientInput }
      })

      const created = result?.data?.createPatient
      const visitData = created?.data

      return {
        status: created?.status || 'ERROR',
        message: created?.message,
        messages: created?.message ? [{ text: created.message, type: created.status || 'ERROR' }] : undefined,
        data: visitData
          ? mapGqlVisit({
              id: visitData.id,
              visitDate: visitData.visitDate,
              status: visitData.status,
              patient: visitData.patient,
              linkedInsurances: visitData.linkedInsurances || [],
              departments: [],
              vitalSigns: [],
            })
          : undefined,
      }
    } catch (err) {
      console.error('Patient registration error:', err)
      throw err
    }
  }

  return { registerPatient, loading, error }
}

export function useUpdatePatient() {
  const [updatePatientMutation, { loading, error }] = useMutation(UPDATE_PATIENT_MUTATION)
  const [createPatientInsuranceMutation] = useMutation(CREATE_PATIENT_INSURANCE_MUTATION)
  const [updatePatientInsuranceMutation] = useMutation(UPDATE_PATIENT_INSURANCE_MUTATION)

  const updatePatient = async (patientId: string, input: UpdatePatientInput): Promise<ApiResponse<Patient>> => {
    try {
      const patientInput = {
        firstName: input.firstName,
        middleName: input.middleName ?? null,
        lastName: input.lastName ?? null,
        dateOfBirth: input.dateOfBirth,
        gender: input.gender ?? null,
        primaryPhoneNumber: input.primaryPhoneNumber ?? null,
        alternativePhone: input.alternativePhone ?? null,
        village: input.village ?? null,
        city: input.city ?? null,
        district: input.district ?? null,
        postalAddress: input.postalAddress ?? null,
        nationalIdNumber: input.nationalIdNumber ?? null,
        passportNumber: input.passportNumber ?? null,
        emergencyContactName: input.emergencyContactName ?? null,
        emergencyContactRelationship: input.emergencyContactRelationship ?? null,
        emergencyContactPhoneNumber: input.emergencyContactPhoneNumber ?? null,
      }

      const result = await updatePatientMutation({
        variables: { patientId, input: patientInput }
      })

      const updated = result.data.updatePatient
      const insuranceResults: PatientInsurance[] = []

      return {
        status: updated?.status || 'ERROR',
        message: updated?.message,
        messages: updated?.message ? [{ text: updated.message, type: updated.status || 'ERROR' }] : undefined,
        data: updated?.data
          ? {
              ...mapGqlPatient(updated.data),
              patientInsurances:
                insuranceResults.length > 0 ? insuranceResults : mapGqlPatient(updated.data).patientInsurances,
            }
          : undefined,
      }
    } catch (err) {
      console.error('Patient update error:', err)
      throw err
    }
  }

  return { updatePatient, loading, error }
}
