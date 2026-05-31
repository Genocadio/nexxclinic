import { useMutation, useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { GET_VISIT_QUERY, VISITS_QUERY, DASHBOARD_STATS_QUERY } from '../queries'
import { 
  CREATE_VISIT_MUTATION, 
  ADD_VISIT_NOTE_MUTATION, 
  ADD_VISIT_VITAL_SIGNS_MUTATION,
  ADD_DEPARTMENT_NOTE_MUTATION,
  ADD_DIAGNOSIS_MUTATION,
  ADD_MEDICATION_MUTATION,
  UPSERT_CONSULTATION_ANSWERS_MUTATION,
  GENERATE_CONSULTATION_PDF_MUTATION,
  PROCESS_VISIT_DEPARTMENT_MUTATION,
  ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION,
  COMPLETE_VISIT_DEPARTMENT_MUTATION,
  UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION,
  ADD_DEPARTMENT_TO_VISIT_MUTATION,
  LINK_VISIT_INSURANCES_MUTATION,
  UNLINK_VISIT_INSURANCES_MUTATION,
  REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION,
  UPDATE_ACTION_QUANTITY_MUTATION,
  UPDATE_CONSUMABLE_QUANTITY_MUTATION,
  UPDATE_VISIT_DEPARTMENT_PRODUCT_QUANTITY_MUTATION,
  UPDATE_VISIT_DEPARTMENT_PRODUCT_STATUS_MUTATION,
  COMPLETE_VISIT_MUTATION,
  COMPLETE_CONSULTATION_VISIT_MUTATION,
} from '../mutations'
import type { 
  Visit, 
  VisitFilterInput, 
  VisitDepartment, 
  VisitDepartmentProduct, 
  VisitDepartmentAction, 
  VisitDepartmentConsumable, 
  VisitDepartmentNote,
  Patient,
  PatientInsurance,
  VisitVitalSignsGroup,
  ApiResponse 
} from '../types'

export interface GqlCoverage {
  id: string
  insuranceProvider?: {
    id: string
    insuranceName: string
    acronym?: string | null
    defaultCoveragePercentage: number
  } | null
  cost?: number | null
  covered?: boolean | null
  requireMedicalAdvisor?: boolean | null
}

export interface GqlVisitDepartmentProduct {
  id: string
  product?: {
    id: string
    name: string
    type: string
    privateRhicPrice?: number | null
    clinicPrice?: number | null
    insuranceCoverages?: GqlCoverage[] | null
  } | null
  quantity: number
  status: string
  addedBy?: {
    id: string
    firstName?: string | null
    lastName?: string | null
    email?: string | null
  } | null
  createdAt: string
}

export interface GqlVisitDepartment {
  id: string
  status: string
  transferTime?: string | null
  completedTime?: string | null
  diagnostics?: Array<{
    id: string
    diagnosisName: string
    icd11Code?: string | null
    createdAt?: string | null
  }> | null
  medications?: Array<{
    id: string
    medicationName: string
    instructions: string
    createdAt?: string | null
  }> | null
  products?: GqlVisitDepartmentProduct[] | null
  department?: {
    id: string
    name: string
  } | null
  transferredBy?: {
    id: string
    firstName?: string | null
    lastName?: string | null
    title?: string | null
    departmentNames?: string[] | null
  } | null
  processors?: Array<{
    id: string
    firstName?: string | null
    lastName?: string | null
    title?: string | null
  }> | null
  notes?: Array<{
    id: string
    note: string
    createdBy?: {
      id: string
      firstName?: string | null
      lastName?: string | null
    } | null
    createdAt: string
  }> | null
}

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
  patientInsurances?: Array<{
    id: string
    insuranceCardNumber: string
    providingCompanyOrEmployer?: string | null
    principalMember?: boolean | null
    principalMemberName?: string | null
    principalMemberPhoneNumber?: string | null
    validFrom?: string | null
    validUntil?: string | null
    insuranceProvider: {
      id: string
      insuranceName: string
      acronym?: string | null
      defaultCoveragePercentage: number
    }
  }> | null
  createdAt: string
}

export interface GqlVisit {
  id: string
  visitDate: string
  status: string
  vitalSigns?: Array<{
    id: string
    createdAt: string
    addedBy?: {
      id: string
      firstName?: string | null
      lastName?: string | null
    } | null
    measurements?: Array<{
      id: string
      measurementName: string
      value: string
      unit: string
      createdAt?: string | null
    }> | null
  }> | null
  linkedInsurances?: Array<{
    id: string
    insuranceCardNumber: string
    insuranceProvider: {
      id: string
      insuranceName: string
      acronym?: string | null
      defaultCoveragePercentage: number
    }
  }> | null
  patient: GqlPatient
  departments?: GqlVisitDepartment[] | null
  createdAt: string
  updatedAt?: string
}

export interface VisitsQueryData {
  visits: {
    status: string
    message?: string
    data: GqlVisit[]
    pagination?: {
      total: number
      totalPages: number
    }
  }
}

export interface GetVisitQueryData {
  visit: {
    status: string
    message?: string
    data: GqlVisit
  }
}

const toGroupCreatedAt = (value?: string | null) => {
  if (!value) return 'unknown'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? 'unknown' : parsed.toISOString()
}

export const normalizeVisitVitalSigns = (vitalSigns: any[] = []): VisitVitalSignsGroup[] => {
  if (!Array.isArray(vitalSigns) || vitalSigns.length === 0) return []

  const hasGroupedShape = Array.isArray(vitalSigns[0]?.measurements)

  if (hasGroupedShape) {
    return vitalSigns
      .map((group: any, index: number) => ({
        id: String(group?.id || group?.createdAt || `group-${index}`),
        createdAt: toGroupCreatedAt(group?.createdAt),
        addedBy: group?.addedBy ? {
          id: String(group.addedBy.id || ''),
          firstName: group.addedBy.firstName || undefined,
          lastName: group.addedBy.lastName || undefined,
        } : undefined,
        measurements: (group?.measurements || [])
          .map((measurement: any, measurementIndex: number) => ({
            id: String(measurement?.id || `${group?.id || group?.createdAt || 'group'}-${measurementIndex}`),
            measurementName: String(measurement?.measurementName || ''),
            value: String(measurement?.value || ''),
            unit: String(measurement?.unit || ''),
            createdAt: measurement?.createdAt || group?.createdAt || undefined,
          }))
          .filter((measurement: any) => measurement.measurementName || measurement.value || measurement.unit),
      }))
      .filter((group: VisitVitalSignsGroup) => group.measurements.length > 0)
      .sort((a, b) => {
        if (a.createdAt === 'unknown') return 1
        if (b.createdAt === 'unknown') return -1
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      })
  }

  const grouped = new Map<string, any[]>()
  vitalSigns.forEach((vitalSign: any) => {
    const key = toGroupCreatedAt(vitalSign?.createdAt)
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(vitalSign)
  })

  return Array.from(grouped.entries())
    .map(([createdAt, items], index) => ({
      id: `group-${index}-${createdAt}`,
      createdAt,
      measurements: items.map((vitalSign: any, measurementIndex: number) => ({
        id: String(vitalSign?.id || `${createdAt}-${measurementIndex}`),
        measurementName: String(vitalSign?.measurementName || ''),
        value: String(vitalSign?.value || ''),
        unit: String(vitalSign?.unit || ''),
        createdAt: vitalSign?.createdAt || undefined,
      })),
      addedBy: items[0]?.addedBy ? {
        id: String(items[0].addedBy.id || ''),
        firstName: items[0].addedBy.firstName || undefined,
        lastName: items[0].addedBy.lastName || undefined,
      } : undefined,
    }))
    .sort((a, b) => {
      if (a.createdAt === 'unknown') return 1
      if (b.createdAt === 'unknown') return -1
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })
}

export interface CreateVisitPayload {
  createVisit: {
    status: string
    message?: string
    data?: GqlVisit | null
  }
}

export interface DashboardStatsData {
  getDashboardStats: {
    status: string
    message?: string
    data?: {
      totalVisits: number
      totalOpen: number
      totalCompleted: number
      totalWaitingForBilling: number
    } | null
  }
}

const mapVisitDepartmentProducts = (departments: GqlVisitDepartment[] = []): VisitDepartment[] => departments.map((department) => {
  const products = department.products || []

  const mapCoverage = (coverage: GqlCoverage) => ({
    id: String(coverage?.id || ''),
    insurance: {
      id: String(coverage?.insuranceProvider?.id || ''),
      name: coverage?.insuranceProvider?.insuranceName || '',
      acronym: coverage?.insuranceProvider?.acronym || '',
      coveragePercentage: Number(coverage?.insuranceProvider?.defaultCoveragePercentage || 0),
    },
    cost: Number(coverage?.cost ?? 0),
    covered: Boolean(coverage?.covered),
    requireMedicalAdvisor: Boolean(coverage?.requireMedicalAdvisor),
  })

  const actions: VisitDepartmentAction[] = products.filter((item: GqlVisitDepartmentProduct) => item.product?.type !== 'CONSUMABLE_DEVICE').map((item: GqlVisitDepartmentProduct) => {
    const p = item.product;
    if (!p) throw new Error('Product is undefined');
    return {
      id: item.id,
      quantity: item.quantity,
      paymentStatus: item.status as any,
      doneBy: item.addedBy ? {
        id: item.addedBy.id,
        name: [item.addedBy.firstName, item.addedBy.lastName].filter(Boolean).join(' ') || item.addedBy.email || '',
        title: '',
        departmentNames: [],
      } : undefined,
      action: {
        id: p.id,
        name: p.name,
        type: p.type,
        privatePrice: Number(p.privateRhicPrice ?? p.clinicPrice ?? 0),
        clinicPrice: Number(p.clinicPrice ?? 0),
        insuranceCoverages: (p.insuranceCoverages || []).map(mapCoverage),
      },
    }
  })

  const consumables: VisitDepartmentConsumable[] = products.filter((item: GqlVisitDepartmentProduct) => item.product?.type === 'CONSUMABLE_DEVICE').map((item: GqlVisitDepartmentProduct) => {
    const p = item.product;
    if (!p) throw new Error('Product is undefined');
    return {
      id: item.id,
      quantity: item.quantity,
      paymentStatus: item.status as any,
      doneBy: item.addedBy ? {
        id: item.addedBy.id,
        name: [item.addedBy.firstName, item.addedBy.lastName].filter(Boolean).join(' ') || item.addedBy.email || '',
        title: '',
        departmentNames: [],
      } : undefined,
      consumable: {
        id: p.id,
        name: p.name,
        type: p.type,
        privatePrice: Number(p.privateRhicPrice ?? p.clinicPrice ?? 0),
        clinicPrice: Number(p.clinicPrice ?? 0),
        insuranceCoverages: (p.insuranceCoverages || []).map(mapCoverage),
      },
    }
  })

  return {
    id: department.id,
    status: department.status,
    transferTime: department.transferTime || '',
    completedTime: department.completedTime || '',
    products: products.map((item: GqlVisitDepartmentProduct) => {
      const p = item.product;
      return {
        id: item.id,
        product: {
          id: p?.id || '',
          name: p?.name || '',
          type: p?.type,
          privatePrice: Number(p?.privateRhicPrice ?? p?.clinicPrice ?? 0),
        },
        quantity: item.quantity,
        addedBy: item.addedBy ? {
          id: item.addedBy.id,
          name: [item.addedBy.firstName, item.addedBy.lastName].filter(Boolean).join(' ') || item.addedBy.email || '',
          title: '',
        } : undefined,
        addedAt: item.createdAt,
      }
    }),
    department: {
      id: department.department?.id || '',
      name: department.department?.name || '',
      requestsProducts: department.department?.requestsProducts ?? undefined,
    },
    transferredBy: {
      id: department.transferredBy?.id || '',
      name: [department.transferredBy?.firstName, department.transferredBy?.lastName].filter(Boolean).join(' ') || '',
      title: department.transferredBy?.title || '',
      departmentNames: department.transferredBy?.departmentNames || [],
    },
    processors: (department.processors || []).map((processor) => ({
      id: processor.id,
      name: [processor.firstName, processor.lastName].filter(Boolean).join(' ') || '',
      title: processor.title || '',
    })),
    actions,
    consumables,
    notes: (department.notes || []).map((note) => ({
      id: note.id,
      note: note.note,
      createdBy: {
        id: note.createdBy?.id || '',
        name: [note.createdBy?.firstName, note.createdBy?.lastName].filter(Boolean).join(' ') || '',
      },
      createdAt: note.createdAt,
    })),
    diagnostics: (department.diagnostics || []).map((diagnosis) => ({
      id: String(diagnosis.id),
      diagnosisName: String(diagnosis.diagnosisName || ''),
      icd11Code: diagnosis.icd11Code || undefined,
      createdAt: diagnosis.createdAt || undefined,
    })),
    medications: (department.medications || []).map((medication) => ({
      id: String(medication.id),
      medicationName: String(medication.medicationName || ''),
      instructions: String(medication.instructions || ''),
      createdAt: medication.createdAt || undefined,
    })),
  }
})

const mapProductDepartmentsToLegacyItems = (departments: GqlVisitDepartment[] = []): VisitDepartment[] =>
  departments.map((department) => {
    const products = department.products || []
    const actions: VisitDepartmentAction[] = products
      .filter((item: GqlVisitDepartmentProduct) => item.product?.type !== 'CONSUMABLE_DEVICE')
      .map((item: GqlVisitDepartmentProduct) => {
        const p = item.product;
        if (!p) throw new Error('Product not found');
        return {
          id: item.id,
          quantity: item.quantity,
          paymentStatus: item.status as any,
          action: {
            id: p.id,
            name: p.name,
            type: p.type,
            privatePrice: Number(p.privateRhicPrice ?? p.clinicPrice ?? 0),
          },
        };
      })
    const consumables: VisitDepartmentConsumable[] = products
      .filter((item: GqlVisitDepartmentProduct) => item.product?.type === 'CONSUMABLE_DEVICE')
      .map((item: GqlVisitDepartmentProduct) => {
        const p = item.product;
        if (!p) throw new Error('Product not found');
        return {
          id: item.id,
          quantity: item.quantity,
          paymentStatus: item.status as any,
          consumable: {
            id: p.id,
            name: p.name,
            type: p.type,
            privatePrice: Number(p.privateRhicPrice ?? p.clinicPrice ?? 0),
          },
        };
      })

    return {
      id: department.id,
      status: department.status,
      transferTime: department.transferTime || '',
      completedTime: department.completedTime || '',
      department: {
        id: department.department?.id || '',
        name: department.department?.name || '',
      },
      actions,
      consumables,
      products: [],
    }
  })

export function useVisits(size?: number, page?: number, filter?: VisitFilterInput) {
  const visitDate = filter?.fromDate && filter?.toDate
    ? (filter.fromDate === filter.toDate ? filter.fromDate : undefined)
    : (filter?.fromDate || filter?.toDate)

  const input = {
    ...(filter?.status ? { status: filter.status } : {}),
    ...(filter?.patientName ? { patientName: filter.patientName } : {}),
    ...(visitDate ? { visitDate } : {}),
    page: page ?? 0,
    size: size ?? 20,
  }

  const { data, loading, error, refetch } = useQuery<VisitsQueryData>(VISITS_QUERY, {
    variables: { input },
    fetchPolicy: 'cache-and-network'
  })

  const errorKind = error?.networkError ? 'network' : error?.graphQLErrors?.length ? 'graphql' : null
  const errorMessage = error?.graphQLErrors?.[0]?.message || error?.networkError?.message || error?.message || null

  const visits: Visit[] = (data?.visits?.data || []).map((v: GqlVisit) => ({
    id: v.id,
    visitDate: v.visitDate,
    status: v.status,
    visitStatus: v.status,
    billingStatus: 'PENDING',
    patient: {
      id: v.patient.id,
      firstName: v.patient.firstName,
      lastName: v.patient.lastName || '',
      middleName: v.patient.middleName || '',
      gender: v.patient.gender || '',
      dateOfBirth: v.patient.dateOfBirth,
      nationalId: v.patient.nationalIdNumber || '',
      contactInfo: {
        phone: v.patient.primaryPhoneNumber || '',
        phoneNumber: v.patient.primaryPhoneNumber || '',
      },
      insurances: [],
    },
    insurances: (v.linkedInsurances || []).map((insurance) => ({
      id: insurance.id,
      insuranceCardNumber: insurance.insuranceCardNumber,
      status: 'ACTIVE',
      insurance: {
        id: insurance.insuranceProvider.id,
        name: insurance.insuranceProvider.insuranceName,
        acronym: insurance.insuranceProvider.acronym || undefined,
        coveragePercentage: insurance.insuranceProvider.defaultCoveragePercentage,
        supportedByClinic: true,
      },
      patient: {} as Patient,
      validFrom: '',
      validUntil: '',
      principalMember: false,
    })),
    departments: mapVisitDepartmentProducts(v.departments || []),
    vitalSigns: normalizeVisitVitalSigns(v.vitalSigns || []),
  }))

  return {
    visits,
    totalPages: data?.visits?.pagination?.totalPages || 0,
    totalElements: data?.visits?.pagination?.total || 0,
    loading,
    error: errorMessage,
    errorKind,
    refetch
  }
}

export function useDashboardStats(days: number = 1, options?: { skip?: boolean }) {
  const { data, loading, error, refetch } = useQuery<DashboardStatsData>(DASHBOARD_STATS_QUERY, {
    variables: { days },
    fetchPolicy: 'cache-and-network',
    skip: options?.skip,
  })

  const stats = data?.getDashboardStats?.data || null

  return {
    stats: stats
      ? {
          totalVisits: Number(stats.totalVisits || 0),
          totalOpen: Number(stats.totalOpen || 0),
          totalCompleted: Number(stats.totalCompleted || 0),
          totalWaitingForBilling: Number(stats.totalWaitingForBilling || 0),
        }
      : null,
    loading,
    error: error?.message || null,
    refetch,
  }
}

export function useVisit(id: string | null) {
  const { data, loading, error, refetch } = useQuery<GetVisitQueryData>(GET_VISIT_QUERY, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network'
  })

  const visitData = data?.visit?.data
  const visit: Visit | undefined = useMemo(() => {
    if (!visitData) return undefined
    return {
        id: visitData.id,
        visitDate: visitData.visitDate,
        status: visitData.status,
        visitStatus: visitData.status,
        billingStatus: 'UNPAID',
        patient: {
          id: visitData.patient.id,
          firstName: visitData.patient.firstName,
          lastName: visitData.patient.lastName || '',
          middleName: visitData.patient.middleName || '',
          gender: visitData.patient.gender || '',
          dateOfBirth: visitData.patient.dateOfBirth || '',
          nationalId: visitData.patient.nationalIdNumber || '',
          contactInfo: {
            phone: visitData.patient.primaryPhoneNumber || '',
            phoneNumber: visitData.patient.primaryPhoneNumber || '',
            email: '',
          },
          insurances: (visitData.patient.patientInsurances || []).map((insurance) => ({
            id: insurance.id,
            insuranceCardNumber: insurance.insuranceCardNumber,
            status: 'ACTIVE',
            insurance: {
              id: insurance.insuranceProvider.id,
              name: insurance.insuranceProvider.insuranceName,
              acronym: insurance.insuranceProvider.acronym || undefined,
              coveragePercentage: insurance.insuranceProvider.defaultCoveragePercentage,
              supportedByClinic: true,
            },
            patient: {} as Patient,
            validFrom: insurance.validFrom || undefined,
            validUntil: insurance.validUntil || undefined,
            principalMember: Boolean(insurance.principalMember),
            principalMemberName: insurance.principalMemberName || undefined,
            principalMemberPhoneNumber: insurance.principalMemberPhoneNumber || undefined,
            providingCompanyOrEmployer: insurance.providingCompanyOrEmployer || undefined,
          })),
        },
        insurances: (visitData.linkedInsurances || []).map((insurance) => ({
          id: insurance.id,
          insuranceCardNumber: insurance.insuranceCardNumber,
          status: 'ACTIVE',
          insurance: {
            id: insurance.insuranceProvider.id,
            name: insurance.insuranceProvider.insuranceName,
            acronym: insurance.insuranceProvider.acronym || undefined,
            coveragePercentage: insurance.insuranceProvider.defaultCoveragePercentage,
            supportedByClinic: true,
          },
          patient: {} as Patient,
          validFrom: insurance.validFrom || undefined,
          validUntil: insurance.validUntil || undefined,
          principalMember: Boolean(insurance.principalMember),
          principalMemberName: insurance.principalMemberName || undefined,
          principalMemberPhoneNumber: insurance.principalMemberPhoneNumber || undefined,
          providingCompanyOrEmployer: insurance.providingCompanyOrEmployer || undefined,
        })),
        visitNotes: [],
        departments: mapVisitDepartmentProducts(visitData.departments || []),
        vitalSigns: normalizeVisitVitalSigns(visitData.vitalSigns || []),
      }
  }, [visitData])
  const errorMessage = error?.message || null

  return {
    visit,
    loading,
    error: errorMessage,
    refetch,
  }
}

export function useCreateVisit() {
  const [createVisitMutation, { loading, error }] = useMutation<CreateVisitPayload>(CREATE_VISIT_MUTATION)

  const createVisit = async (input: {
    patientId: string
    insuranceIds?: string[]
    departmentIds: string[]
    visitNotes?: { type: string; text: string }[]
  }): Promise<ApiResponse<Visit>> => {
    try {
      const departments = (input.departmentIds || []).map((departmentId) => ({
        departmentId,
        products: [],
      }))

      const result = await createVisitMutation({
        variables: {
          input: {
            patientId: input.patientId,
            linkedPatientInsuranceIds: input.insuranceIds || [],
            departments,
          },
        }
      })
      const payload = result?.data?.createVisit
      return {
        status: payload?.status || 'ERROR',
        messages: payload?.message ? [{ text: payload.message, type: payload.status || 'ERROR' }] : undefined,
        data: payload?.data
          ? {
              id: payload.data.id,
              visitDate: payload.data.visitDate,
              status: payload.data.status,
              visitStatus: payload.data.status,
              billingStatus: 'UNPAID',
              patient: {
                id: payload.data.patient.id,
                firstName: payload.data.patient.firstName,
                lastName: payload.data.patient.lastName || '',
                middleName: payload.data.patient.middleName || '',
                gender: payload.data.patient.gender || '',
                dateOfBirth: '',
                insurances: [],
              },
              insurances: (payload.data.linkedInsurances || []).map((insurance) => ({
                id: insurance.id,
                insuranceCardNumber: insurance.insuranceCardNumber,
                status: 'ACTIVE',
                insurance: {
                  id: insurance.insuranceProvider.id,
                  name: insurance.insuranceProvider.insuranceName,
                  acronym: insurance.insuranceProvider.acronym || undefined,
                  coveragePercentage: insurance.insuranceProvider.defaultCoveragePercentage,
                  supportedByClinic: true,
                },
                patient: {} as Patient,
                validFrom: '',
                validUntil: '',
                principalMember: false,
              })),
              visitNotes: (input.visitNotes || []).map((note) => ({
                id: '',
                note: note.text,
                createdAt: '',
              })),
              departments: (payload.data.departments || []).map((dept) => ({
                id: dept.id,
                status: 'CREATED',
                transferTime: '',
                completedTime: '',
                department: {
                  id: dept.department?.id || '',
                  name: dept.department?.name || '',
                },
                transferredBy: {
                  id: '',
                  name: '',
                  title: '',
                  departmentNames: [],
                },
                processors: [],
                actions: [],
                consumables: [],
              })),
            }
          : undefined,
      }
    } catch (err) {
      console.error('Visit creation error:', err)
      throw err
    }
  }

  return { createVisit, loading, error }
}

export function useAddVisitNote() {
  const [mutation, { loading, error }] = useMutation(ADD_VISIT_NOTE_MUTATION)

  const addVisitNote = async (visitId: string, type: string | null | undefined, text: string): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { visitId, type, text } })
      return result.data?.addVisitNote
    } catch (err) {
      console.error('Add visit note error:', err)
      throw err
    }
  }

  return { addVisitNote, loading, error }
}

export function useAddVisitVitalSigns() {
  const [mutation, { loading, error }] = useMutation(ADD_VISIT_VITAL_SIGNS_MUTATION)

  const addVisitVitalSigns = async (
    visitId: string,
    vitalSigns: Array<{ measurementName: string; value: string; unit: string }>,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitId,
            vitalSigns,
          },
        },
      })
      const payload = result.data?.addVisitVitalSigns
      return {
        status: payload?.status || 'ERROR',
        message: payload?.message,
        messages: payload?.message ? [{ text: payload.message, type: payload.status || 'ERROR' }] : undefined,
        data: payload?.data
          ? {
              ...payload.data,
              vitalSigns: normalizeVisitVitalSigns(payload.data.vitalSigns || []),
            }
          : undefined,
      }
    } catch (err) {
      console.error('Add visit vital signs error:', err)
      throw err
    }
  }

  return { addVisitVitalSigns, loading, error }
}

export function useAddDepartmentNote() {
  const [mutation, { loading, error }] = useMutation(ADD_DEPARTMENT_NOTE_MUTATION)

  const addDepartmentNote = async (visitId: string, departmentId: string, type: string | null | undefined, text: string): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { visitId, departmentId, type, text } })
      return result.data?.addDepartmentNote
    } catch (err) {
      console.error('Add department note error:', err)
      throw err
    }
  }

  return { addDepartmentNote, loading, error }
}

export function useAddDiagnosisToVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(ADD_DIAGNOSIS_MUTATION)

  const addDiagnosis = async (visitDepartmentId: string, diagnosisName: string, icd11Code?: string): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitDepartmentId,
            diagnosisName,
            icd11Code: icd11Code || undefined,
          },
        },
      })
      return result.data?.addDiagnosis
    } catch (err) {
      console.error('Add diagnosis error:', err)
      throw err
    }
  }

  return { addDiagnosis, loading, error }
}

export function useAddMedicationToVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(ADD_MEDICATION_MUTATION)

  const addMedication = async (visitDepartmentId: string, medicationName: string, instructions: string): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitDepartmentId,
            medicationName,
            instructions,
          },
        },
      })
      return result.data?.addMedication
    } catch (err) {
      console.error('Add medication error:', err)
      throw err
    }
  }

  return { addMedication, loading, error }
}

export function useUpsertConsultationAnswers() {
  const [upsertMutation, { loading, error }] = useMutation(UPSERT_CONSULTATION_ANSWERS_MUTATION)

  const upsertConsultationAnswers = async (input: {
    consultationId: string
    visitId: string
    patientId: string
    departmentId: string
    formId: string
    formVersion: string
    status: 'DRAFT' | 'FINAL'
    answers: string
  }): Promise<ApiResponse<any>> => {
    try {
      const result = await upsertMutation({ variables: { input } })
      return result.data?.upsertConsultationAnswers
    } catch (err) {
      console.error('Upsert consultation answers error:', err)
      throw err
    }
  }

  return { upsertConsultationAnswers, loading, error }
}

export function useGenerateConsultationPdf() {
  const [generatePdfMutation, { loading, error }] = useMutation(GENERATE_CONSULTATION_PDF_MUTATION)

  const generateConsultationPdf = async (input: {
    consultationId: string
    departmentId: string
    formId: string
  }): Promise<ApiResponse<any>> => {
    try {
      const result = await generatePdfMutation({
        variables: {
          consultationId: input.consultationId,
          departmentId: input.departmentId,
          formId: input.formId,
        },
      })
      return result.data?.generateConsultationPdf
    } catch (err) {
      console.error('Generate consultation PDF error:', err)
      throw err
    }
  }

  return { generateConsultationPdf, loading, error }
}

export function useRemoveActionFromVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION)
  const removeAction = async (visitId: string, departmentId: string, actionId: string): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { visitDepartmentProductId: actionId } })
      return result.data.removeVisitDepartmentProduct
    } catch (err) {
      console.error('Remove action error:', err)
      throw err
    }
  }

  return { removeAction, loading, error }
}

export function useRemoveConsumableFromVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION)
  const removeConsumable = async (visitId: string, departmentId: string, consumableId: string): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { visitDepartmentProductId: consumableId } })
      return result.data.removeVisitDepartmentProduct
    } catch (err) {
      console.error('Remove consumable error:', err)
      throw err
    }
  }

  return { removeConsumable, loading, error }
}

export function useRemoveProductFromVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION)
  const removeProduct = async (visitDepartmentProductId: string): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { visitDepartmentProductId } })
      return result.data.removeVisitDepartmentProduct
    } catch (err) {
      console.error('Remove product error:', err)
      throw err
    }
  }

  return { removeProduct, loading, error }
}

export function useUpdateActionQuantity() {
  const [mutation, { loading, error }] = useMutation(UPDATE_ACTION_QUANTITY_MUTATION)
  const updateQuantity = async (visitId: string, departmentId: string, itemId: string, quantity: number): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { visitId, departmentId, itemId, quantity } })
      const response = result.data.updateActionQuantity
      if (response.status !== 'SUCCESS') {
        const errorMsg = response.messages?.[0]?.text || `Update failed with status: ${response.status}`
        console.error('Update action quantity failed:', errorMsg)
        throw new Error(errorMsg)
      }
      return response
    } catch (err) {
      console.error('Update action quantity error:', err)
      throw err
    }
  }

  return { updateQuantity, loading, error }
}

export function useUpdateConsumableQuantity() {
  const [mutation, { loading, error }] = useMutation(UPDATE_CONSUMABLE_QUANTITY_MUTATION)
  const updateQuantity = async (visitId: string, departmentId: string, itemId: string, quantity: number): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { visitId, departmentId, itemId, quantity } })
      const response = result.data.updateConsumableQuantity
      if (response.status !== 'SUCCESS') {
        const errorMsg = response.messages?.[0]?.text || `Update failed with status: ${response.status}`
        console.error('Update consumable quantity failed:', errorMsg)
        throw new Error(errorMsg)
      }
      return response
    } catch (err) {
      console.error('Update consumable quantity error:', err)
      throw err
    }
  }

  return { updateQuantity, loading, error }
}

export function useAddActionToVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION)

  const addAction = async (visitId: string, departmentId: string, actionId: string, quantity?: number): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitId,
            departmentId,
            productId: actionId,
            quantity: quantity ?? 1,
            status: 'PENDING',
          },
        },
      })
      const payload = result.data?.addVisitDepartmentProduct
      return {
        status: payload?.status || 'ERROR',
        messages: payload?.message ? [{ text: payload.message, type: payload.status || 'ERROR' }] : undefined,
        data: payload?.data
          ? {
              ...payload.data,
              departments: mapProductDepartmentsToLegacyItems([payload.data as GqlVisitDepartment]),
            }
          : undefined,
      }
    } catch (err) {
      console.error('Add action error:', err)
      throw err
    }
  }

  return { addAction, loading, error }
}

export function useAddConsumableToVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION)

  const addConsumable = async (visitId: string, departmentId: string, consumableId: string, quantity?: number): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitId,
            departmentId,
            productId: consumableId,
            quantity: quantity ?? 1,
            status: 'PENDING',
          },
        },
      })
      const payload = result.data?.addVisitDepartmentProduct
      return {
        status: payload?.status || 'ERROR',
        messages: payload?.message ? [{ text: payload.message, type: payload.status || 'ERROR' }] : undefined,
        data: payload?.data
          ? {
              ...payload.data,
              departments: mapProductDepartmentsToLegacyItems([payload.data as GqlVisitDepartment]),
            }
          : undefined,
      }
    } catch (err) {
      console.error('Add consumable error:', err)
      throw err
    }
  }

  return { addConsumable, loading, error }
}

export function useCompleteConsultationVisit() {
  const [mutation, { loading, error }] = useMutation(COMPLETE_CONSULTATION_VISIT_MUTATION)

  const completeConsultationVisit = async (input: {
    consultationId: string
    visitId: string
    patientId: string
    departmentId: string
    formId: string
    formVersion?: string
    status: 'DRAFT' | 'FINAL'
    answers: string
  }, final: boolean): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: { input, final },
      })
      const payload = result.data?.completeConsultationVisit
      return {
        status: payload?.status || 'ERROR',
        message: payload?.message,
        messages: payload?.message ? [{ text: payload.message, type: payload.status || 'ERROR' }] : undefined,
        data: payload?.data,
      }
    } catch (err) {
      console.error('Complete consultation visit error:', err)
      throw err
    }
  }

  return { completeConsultationVisit, loading, error }
}

export function useAddProductToVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION)

  const addProduct = async (visitId: string, departmentId: string, productId: string, quantity?: number): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitId,
            departmentId,
            productId,
            quantity: quantity ?? 1,
            status: 'PENDING',
          },
        },
      })
      const payload = result.data?.addVisitDepartmentProduct
      return {
        status: payload?.status || 'ERROR',
        messages: payload?.message ? [{ text: payload.message, type: payload.status || 'ERROR' }] : undefined,
        data: payload?.data
          ? {
              ...payload.data,
              departments: mapProductDepartmentsToLegacyItems([payload.data as GqlVisitDepartment]),
            }
          : undefined,
      }
    } catch (err) {
      console.error('Add product error:', err)
      throw err
    }
  }

  return { addProduct, loading, error }
}

export function useCompleteVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(COMPLETE_VISIT_DEPARTMENT_MUTATION)

  const completeDepartment = async (visitId: string, departmentId: string): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { visitId, departmentId } })
      return result.data.completeVisitDepartment
    } catch (err) {
      console.error('Complete department error:', err)
      throw err
    }
  }

  return { completeDepartment, loading, error }
}

export function useUpdateVisitDepartmentStatus() {
  const [mutation, { loading, error }] = useMutation(UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION)

  const updateDepartmentStatus = async (
    visitDepartmentId: string,
    status: 'ACTIVE' | 'PENDING' | 'COMPLETED',
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { input: { visitDepartmentId, status } } })
      return result.data.updateVisitDepartmentStatus
    } catch (err) {
      console.error('Update visit department status error:', err)
      throw err
    }
  }

  return { updateDepartmentStatus, loading, error }
}

export function useAddDepartmentToVisit() {
  const [mutation, { loading, error }] = useMutation(ADD_DEPARTMENT_TO_VISIT_MUTATION)

  const addDepartmentToVisit = async (visitId: string, departmentId: string): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          visitId,
          departmentId,
        },
        refetchQueries: ['GetVisits', 'GetVisit'],
        awaitRefetchQueries: true,
      })
      return result.data?.addVisitDepartment
    } catch (err) {
      console.error('Add department to visit error:', err)
      throw err
    }
  }

  return { addDepartmentToVisit, loading, error }
}

export function useLinkVisitInsurances() {
  const [mutation, { loading, error }] = useMutation(LINK_VISIT_INSURANCES_MUTATION)

  const linkVisitInsurances = async (visitId: string, insuranceIds: string[]): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          visitId,
          insuranceIds,
        },
      })
      return result.data?.linkVisitInsurances
    } catch (err) {
      console.error('Link visit insurances error:', err)
      throw err
    }
  }

  return { linkVisitInsurances, loading, error }
}

export function useUnlinkVisitInsurances() {
  const [mutation, { loading, error }] = useMutation(UNLINK_VISIT_INSURANCES_MUTATION)

  const unlinkVisitInsurances = async (visitId: string, insuranceIds: string[]): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          visitId,
          insuranceIds,
        },
      })
      return result.data?.unlinkVisitInsurances
    } catch (err) {
      console.error('Unlink visit insurances error:', err)
      throw err
    }
  }

  return { unlinkVisitInsurances, loading, error }
}

export function useUpdateProductQuantity() {
  const [mutation, { loading, error }] = useMutation(UPDATE_VISIT_DEPARTMENT_PRODUCT_QUANTITY_MUTATION)

  const updateQuantity = async (visitDepartmentProductId: string, quantity: number): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitDepartmentProductId,
            quantity: parseFloat(quantity.toString()),
          },
        },
      })
      const payload = result.data?.updateVisitDepartmentProductQuantity
      return {
        status: payload?.status || 'ERROR',
        message: payload?.message,
        data: payload?.data,
      }
    } catch (err) {
      console.error('Update product quantity error:', err)
      throw err
    }
  }

  return { updateQuantity, loading, error }
}

export function useUpdateProductStatus() {
  const [mutation, { loading, error }] = useMutation(UPDATE_VISIT_DEPARTMENT_PRODUCT_STATUS_MUTATION)

  const updateStatus = async (visitDepartmentProductId: string, status: string): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitDepartmentProductId,
            status,
          },
        },
      })
      const payload = result.data?.updateVisitDepartmentProductStatus
      return {
        status: payload?.status || 'ERROR',
        message: payload?.message,
        data: payload?.data,
      }
    } catch (err) {
      console.error('Update product status error:', err)
      throw err
    }
  }

  return { updateStatus, loading, error }
}

export function useCompleteVisit() {
  const [mutation, { loading, error }] = useMutation(COMPLETE_VISIT_MUTATION)

  const completeVisit = async (visitId: string): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { visitId } })
      return result.data.completeVisit
    } catch (err) {
      console.error('Complete visit error:', err)
      throw err
    }
  }

  return { completeVisit, loading, error }
}
