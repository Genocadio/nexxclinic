import { useMutation, useQuery } from '@apollo/client'
import { GET_PATIENTS_QUERY, GET_PATIENT_QUERY } from '../queries'
import { REGISTER_PATIENT_MUTATION, CREATE_PATIENT_INSURANCE_MUTATION, UPDATE_PATIENT_INSURANCE_MUTATION, UPDATE_PATIENT_MUTATION } from '../mutations'
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
  validFrom?: string | null
  validUntil?: string | null
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

const mapDominantMember = (insurance: Pick<GqlPatientInsurance, 'principalMember' | 'principalMemberName' | 'principalMemberPhoneNumber'>) => {
  if (insurance.principalMember || (!insurance.principalMemberName && !insurance.principalMemberPhoneNumber)) {
    return undefined
  }

  return {
    firstName: insurance.principalMemberName?.split(' ')?.[0] || '',
    lastName: insurance.principalMemberName?.split(' ')?.slice(1).join(' ') || '',
    phone: insurance.principalMemberPhoneNumber || '',
  }
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
        dominantMember: mapDominantMember(insurance),
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
      const linkedInsurances = visitData?.linkedInsurances || []
      const insuranceResults: PatientInsurance[] = linkedInsurances.map((insurance: any) => ({
        id: insurance.id,
        insuranceCardNumber: insurance.insuranceCardNumber,
        status: 'ACTIVE',
        insurance: {
          id: insurance.insuranceProvider.id,
          name: insurance.insuranceProvider.insuranceName,
          acronym: insurance.insuranceProvider.acronym,
          coveragePercentage: insurance.insuranceProvider.defaultCoveragePercentage,
        },
        dominantMember: mapDominantMember(insurance),
        validFrom: insurance.validFrom || undefined,
        validUntil: insurance.validUntil || undefined,
      }))

      return {
        status: created?.status || 'ERROR',
        message: created?.message,
        messages: created?.message ? [{ text: created.message, type: created.status || 'ERROR' }] : undefined,
        data: visitData?.patient
          ? {
              id: visitData.id,
              visitDate: visitData.visitDate,
              status: visitData.status,
              visitStatus: visitData.status,
              billingStatus: 'PENDING',
              patient: {
                id: visitData.patient.id,
                firstName: visitData.patient.firstName,
                middleName: visitData.patient.middleName || undefined,
                lastName: visitData.patient.lastName || undefined,
                dateOfBirth: visitData.patient.dateOfBirth,
                gender: visitData.patient.gender === 'MALE' ? 'M' : visitData.patient.gender === 'FEMALE' ? 'F' : (visitData.patient.gender || ''),
                contactInfo: {
                  phone: visitData.patient.primaryPhoneNumber || undefined,
                  email: input.contactInfo?.email || undefined,
                  address: {
                    street: visitData.patient.village || undefined,
                    sector: visitData.patient.city || undefined,
                    district: visitData.patient.district || undefined,
                    country: visitData.patient.postalAddress || undefined,
                  },
                },
                emergencyContact: {
                  name: visitData.patient.emergencyContactName || undefined,
                  relation: visitData.patient.emergencyContactRelationship || undefined,
                  phone: visitData.patient.emergencyContactPhoneNumber || undefined,
                },
                nationalId: visitData.patient.nationalIdNumber || undefined,
                insurances: insuranceResults,
                registrationDate: visitData.patient.createdAt,
                notes: input.notes || undefined,
              },
              insurances: insuranceResults,
              departments: [],
              vitalSigns: [],
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
  const [createPatientInsuranceMutation] = useMutation(CREATE_PATIENT_INSURANCE_MUTATION)
  const [updatePatientInsuranceMutation] = useMutation(UPDATE_PATIENT_INSURANCE_MUTATION)

  const updatePatient = async (patientId: string, input: RegisterPatientInput): Promise<ApiResponse<Patient>> => {
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

      const result = await updatePatientMutation({
        variables: { patientId, input: patientInput }
      })

      const updated = result.data.updatePatient
      const insuranceResults: PatientInsurance[] = []

      if (input.insurances && input.insurances.length > 0) {
        for (const insurance of input.insurances) {
          if (!insurance?.insuranceId || !insurance?.insuranceCardNumber) {
            continue
          }

          const now = new Date()
          const validFrom = now.toISOString().slice(0, 10)
          const validUntil = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString().slice(0, 10)

          const insuranceInput = {
            insuranceProviderId: String(insurance.insuranceId),
            insuranceCardNumber: insurance.insuranceCardNumber,
            providingCompanyOrEmployer: insurance.providingCompanyOrEmployer,
            ...getDominantMemberPayload(insurance.dominantMember),
            validFrom,
            validUntil,
          }

          if (insurance.id) {
            const insuranceUpdateResult = await updatePatientInsuranceMutation({
              variables: {
                patientInsuranceId: insurance.id,
                input: insuranceInput,
              },
            })
            const updatedInsurance = insuranceUpdateResult?.data?.updatePatientInsurance?.data
            if (updatedInsurance) {
              insuranceResults.push({
                id: updatedInsurance.id,
                insuranceCardNumber: updatedInsurance.insuranceCardNumber,
                status: 'ACTIVE',
                insurance: {
                  id: updatedInsurance.insuranceProvider.id,
                  name: updatedInsurance.insuranceProvider.insuranceName,
                  acronym: updatedInsurance.insuranceProvider.acronym,
                  coveragePercentage: updatedInsurance.insuranceProvider.defaultCoveragePercentage,
                },
                dominantMember: mapDominantMember(updatedInsurance),
                validFrom: updatedInsurance.validFrom || undefined,
                validUntil: updatedInsurance.validUntil || undefined,
              })
            }
          } else {
            const insuranceCreateResult = await createPatientInsuranceMutation({
              variables: {
                input: {
                  patientId,
                  insuranceProviderId: String(insurance.insuranceId),
                  insuranceCardNumber: insurance.insuranceCardNumber,
                  providingCompanyOrEmployer: insurance.providingCompanyOrEmployer,
                  ...getDominantMemberPayload(insurance.dominantMember),
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
                dominantMember: mapDominantMember(createdInsurance),
                validFrom: createdInsurance.validFrom || undefined,
                validUntil: createdInsurance.validUntil || undefined,
              })
            }
          }
        }
      }

      return {
        status: updated?.status || 'ERROR',
        message: updated?.message,
        messages: updated?.message ? [{ text: updated.message, type: updated.status || 'ERROR' }] : undefined,
        data: updated?.data
          ? {
              id: updated.data.id,
              firstName: updated.data.firstName,
              middleName: updated.data.middleName || undefined,
              lastName: updated.data.lastName || undefined,
              dateOfBirth: updated.data.dateOfBirth,
              gender: updated.data.gender === 'MALE' ? 'M' : updated.data.gender === 'F' ? 'F' : (updated.data.gender || ''),
              contactInfo: {
                phone: updated.data.primaryPhoneNumber || undefined,
                email: input.contactInfo?.email || undefined,
                address: {
                  street: updated.data.village || undefined,
                  sector: updated.data.city || undefined,
                  district: updated.data.district || undefined,
                  country: updated.data.postalAddress || undefined,
                },
              },
              emergencyContact: {
                name: updated.data.emergencyContactName || undefined,
                relation: updated.data.emergencyContactRelationship || undefined,
                phone: updated.data.emergencyContactPhoneNumber || undefined,
              },
              nationalId: updated.data.nationalIdNumber || undefined,
              insurances: insuranceResults.length > 0 ? insuranceResults : undefined,
              registrationDate: updated.data.createdAt,
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
