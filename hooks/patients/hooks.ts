import { useMutation, useQuery } from '@apollo/client'
import { GET_PATIENTS_QUERY, GET_PATIENT_QUERY } from '../queries'
import { REGISTER_PATIENT_MUTATION, CREATE_PATIENT_INSURANCE_MUTATION, UPDATE_PATIENT_MUTATION } from '../mutations'
import React from 'react'
import type { Patient, PatientFilterInput, PatientInsurance, Visit, ApiResponse } from '../types'

export interface GqlPatient {
  id: string
  firstName: string
  middleName?: string | null
  lastName?: string | null
  dateOfBirth: string
  gender: string
  primaryPhoneNumber?: string | null
  alternativePhone?: string | null
  village?: string | null
  city?: string | null
  district?: string | null
  postalAddress?: string | null
  nationalIdNumber?: string | null
  passportNumber?: string | null
  emergencyContactName?: string | null
  emergencyContactRelationship?: string | null
  emergencyContactPhoneNumber?: string | null
  lastVisit?: {
    id: string
    status: string
    visitDate: string
  } | null
  createdAt: string
}

export interface SearchPatientsQueryData {
  searchPatients: {
    status: string
    message?: string
    data: GqlPatient[]
    pagination?: {
      total: number
      totalPages: number
    }
  }
}

export interface GqlInsuranceProvider {
  id: string
  insuranceName: string
  acronym?: string | null
  defaultCoveragePercentage: number
}

export interface GqlPatientInsurance {
  id: string
  insuranceCardNumber: string
  principalMember: boolean
  principalMemberName?: string | null
  principalMemberPhoneNumber?: string | null
  insuranceProvider: GqlInsuranceProvider
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
    insuranceId?: string | null
    insuranceCardNumber?: string | null
    dominantMember?: {
      firstName?: string | null
      lastName?: string | null
      phone?: string | null
    } | null
  }> | null
  notes?: string | null
}

export function usePatients(filter?: PatientFilterInput, page: number = 0, size: number = 20) {
  const input = {
    ...(filter?.name ? { name: filter.name } : {}),
    ...(filter?.phoneNumber ? { phoneNumber: filter.phoneNumber } : {}),
    ...(filter?.age != null ? { age: filter.age } : {}),
    page,
    size,
  }
  
  const { data, loading, error, refetch } = useQuery<SearchPatientsQueryData>(GET_PATIENTS_QUERY, {
    variables: { input },
    fetchPolicy: 'cache-and-network'
  })

  const patients: Patient[] = (data?.searchPatients?.data || []).map((patient: GqlPatient) => ({
    id: patient.id,
    firstName: patient.firstName,
    middleName: patient.middleName || undefined,
    lastName: patient.lastName || undefined,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender === 'MALE' ? 'M' : patient.gender === 'FEMALE' ? 'F' : (patient.gender || ''),
    contactInfo: {
      phone: patient.primaryPhoneNumber || undefined,
      email: undefined,
      address: {
        street: patient.village || undefined,
        sector: patient.city || undefined,
        district: patient.district || undefined,
        country: patient.postalAddress || undefined,
      },
    },
    emergencyContact: {
      name: patient.emergencyContactName || undefined,
      relation: patient.emergencyContactRelationship || undefined,
      phone: patient.emergencyContactPhoneNumber || undefined,
    },
    nationalId: patient.nationalIdNumber || undefined,
    insurances: [],
    registrationDate: patient.createdAt,
    lastVisit: patient.lastVisit
      ? {
          id: patient.lastVisit.id,
          visitDate: patient.lastVisit.visitDate,
          status: patient.lastVisit.status,
          billingStatus: 'PENDING',
          patient: {} as Patient,
          registeredBy: { id: '', name: '' },
          visitStatus: patient.lastVisit.status as any,
          visitType: 'OUTPATIENT',
        }
      : undefined,
  }))
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

    return {
      id: patientData.id,
      firstName: patientData.firstName,
      middleName: patientData.middleName || undefined,
      lastName: patientData.lastName || undefined,
      dateOfBirth: patientData.dateOfBirth,
      gender: patientData.gender === 'MALE' ? 'M' : patientData.gender === 'FEMALE' ? 'F' : (patientData.gender || ''),
      contactInfo: {
        phone: patientData.primaryPhoneNumber || undefined,
        email: undefined,
        address: {
          street: patientData.village || undefined,
          sector: patientData.city || undefined,
          district: patientData.district || undefined,
          country: patientData.postalAddress || undefined,
        },
      },
      emergencyContact: {
        name: patientData.emergencyContactName || undefined,
        relation: patientData.emergencyContactRelationship || undefined,
        phone: patientData.emergencyContactPhoneNumber || undefined,
      },
      nationalId: patientData.nationalIdNumber || undefined,
      insurances: patientInsurances.map((insurance: GqlPatientInsurance) => ({
        id: insurance.id,
        insuranceCardNumber: insurance.insuranceCardNumber,
        status: 'ACTIVE',
        insurance: {
          id: insurance.insuranceProvider.id,
          name: insurance.insuranceProvider.insuranceName,
          acronym: insurance.insuranceProvider.acronym || undefined,
          coveragePercentage: insurance.insuranceProvider.defaultCoveragePercentage,
        },
        dominantMember: insurance.principalMember
          ? {
              firstName: insurance.principalMemberName?.split(' ')?.[0] || '',
              lastName: insurance.principalMemberName?.split(' ')?.slice(1).join(' ') || '',
              phone: insurance.principalMemberPhoneNumber || '',
            }
          : undefined,
      })),
      registrationDate: patientData.createdAt,
      lastVisit: patientData.lastVisit
        ? {
            id: patientData.lastVisit.id,
            visitDate: patientData.lastVisit.visitDate,
            status: patientData.lastVisit.status,
            billingStatus: 'PENDING',
            patient: {} as Patient,
            registeredBy: { id: '', name: '' },
            visitStatus: patientData.lastVisit.status as any,
            visitType: 'OUTPATIENT',
          }
        : undefined,
    }
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
  const [createPatientInsuranceMutation] = useMutation(CREATE_PATIENT_INSURANCE_MUTATION)

  const registerPatient = async (input: RegisterPatientInput): Promise<ApiResponse<Patient>> => {
    try {
      const patientInput = {
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

      const result = await registerPatientMutation({
        variables: { input: patientInput }
      })

      const created = result?.data?.createPatient
      const patientId = created?.data?.id
      const insuranceResults: PatientInsurance[] = []

      if (patientId && input.insurances && input.insurances.length > 0) {
        const now = new Date()
        const validFrom = now.toISOString().slice(0, 10)
        const validUntil = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString().slice(0, 10)

        for (const insurance of input.insurances) {
          if (!insurance?.insuranceId || !insurance?.insuranceCardNumber) {
            continue
          }

          const principalMemberName = [insurance.dominantMember?.firstName, insurance.dominantMember?.lastName]
            .filter(Boolean)
            .join(' ')

          const insuranceCreateResult = await createPatientInsuranceMutation({
            variables: {
              input: {
                patientId: String(patientId),
                insuranceProviderId: String(insurance.insuranceId),
                insuranceCardNumber: insurance.insuranceCardNumber,
                providingCompanyOrEmployer: null,
                principalMember: Boolean(principalMemberName),
                principalMemberName: principalMemberName || null,
                principalMemberPhoneNumber: insurance.dominantMember?.phone || null,
                validFrom,
                validUntil,
              },
            },
          })

          const createdInsurance = insuranceCreateResult?.data?.createPatientInsurance?.data
          if (createdInsurance) {
            insuranceResults.push({
              id: createdInsurance.id,
              insuranceCardNumber: createdInsurance.insuranceCardNumber,
              status: 'ACTIVE',
              insurance: {
                id: createdInsurance.insuranceProvider.id,
                name: createdInsurance.insuranceProvider.insuranceName,
                acronym: createdInsurance.insuranceProvider.acronym,
                coveragePercentage: createdInsurance.insuranceProvider.defaultCoveragePercentage,
              },
              dominantMember: createdInsurance.principalMember
                ? {
                    firstName: insurance.dominantMember?.firstName || '',
                    lastName: insurance.dominantMember?.lastName || '',
                    phone: createdInsurance.principalMemberPhoneNumber || '',
                  }
                : undefined,
            } as any)
          }
        }
      }

      return {
        status: created?.status || 'ERROR',
        message: created?.message,
        messages: created?.message ? [{ text: created.message, type: created.status || 'ERROR' }] : undefined,
        data: created?.data
          ? {
              id: created.data.id,
              firstName: created.data.firstName,
              middleName: created.data.middleName || undefined,
              lastName: created.data.lastName || undefined,
              dateOfBirth: created.data.dateOfBirth,
              gender: created.data.gender === 'MALE' ? 'M' : created.data.gender === 'FEMALE' ? 'F' : (created.data.gender || ''),
              contactInfo: {
                phone: created.data.primaryPhoneNumber || undefined,
                email: input.contactInfo?.email || undefined,
                address: {
                  street: created.data.village || undefined,
                  sector: created.data.city || undefined,
                  district: created.data.district || undefined,
                  country: created.data.postalAddress || undefined,
                },
              },
              emergencyContact: {
                name: created.data.emergencyContactName || undefined,
                relation: created.data.emergencyContactRelationship || undefined,
                phone: created.data.emergencyContactPhoneNumber || undefined,
              },
              nationalId: created.data.nationalIdNumber || undefined,
              insurances: insuranceResults,
              registrationDate: created.data.createdAt,
              notes: input.notes || undefined,
            }
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

  const updatePatient = async (patientId: string, input: RegisterPatientInput): Promise<ApiResponse<Patient>> => {
    try {
      const patientInput = {
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

      const result = await updatePatientMutation({
        variables: { patientId, input: patientInput }
      })
      return result.data.updatePatient
    } catch (err) {
      console.error('Patient update error:', err)
      throw err
    }
  }

  return { updatePatient, loading, error }
}
