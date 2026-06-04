import { useMutation, useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { GET_VISIT_QUERY, VISITS_QUERY, DASHBOARD_STATS_QUERY } from '../queries'
import { 
  CREATE_VISIT_MUTATION, 
  ADD_VISIT_NOTE_MUTATION, 
  ADD_VISIT_VITAL_SIGNS_MUTATION,
  ADD_CHILD_VISIT_DEPARTMENT_MUTATION,
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
  SearchVisitsInput,
  VisitDepartment,
  VisitVitalSignsGroup,
  ApiResponse,
} from '../types'
import {
  mapGqlVisit,
  mapGqlVisitListItem,
  mapGqlVisitDepartment,
  mapGqlWorkerRef,
  type GqlVisit,
  type GqlVisitDepartment,
} from '@/lib/gql-mappers'

const EMPTY_TIMESTAMP = ''

/** @deprecated Use SearchVisitsInput from api-input-types */
export type VisitFilterInput = SearchVisitsInput & {
  fromDate?: string
  toDate?: string
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
        addedBy: mapGqlWorkerRef(group?.addedBy) ?? null,
        measurements: (group?.measurements || [])
          .map((measurement: any, measurementIndex: number) => ({
            id: String(measurement?.id || `${group?.id || group?.createdAt || 'group'}-${measurementIndex}`),
            measurementName: String(measurement?.measurementName || ''),
            value: String(measurement?.value || ''),
            unit: String(measurement?.unit || ''),
            createdAt: measurement?.createdAt || group?.createdAt || EMPTY_TIMESTAMP,
          }))
          .filter(
            (measurement: { measurementName: string; value: string; unit: string }) =>
              measurement.measurementName || measurement.value || measurement.unit,
          ),
      }))
      .filter((group) => group.measurements.length > 0)
      .sort((a, b) => {
        if (a.createdAt === 'unknown') return 1
        if (b.createdAt === 'unknown') return -1
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      }) as VisitVitalSignsGroup[]
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
        createdAt: vitalSign?.createdAt || createdAt || EMPTY_TIMESTAMP,
      })),
      addedBy: mapGqlWorkerRef(items[0]?.addedBy) ?? null,
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

  const visits: Visit[] = (data?.visits?.data || []).map((v: GqlVisit) => {
    const mapped = mapGqlVisitListItem(v)
    mapped.vitalSigns = normalizeVisitVitalSigns(v.vitalSigns || [])
    return mapped
  })

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
    const mapped = mapGqlVisit(visitData)
    mapped.vitalSigns = normalizeVisitVitalSigns(visitData.vitalSigns || [])
    return mapped
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
        data: payload?.data ? mapGqlVisit(payload.data as GqlVisit) : undefined,
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
          ? mapGqlVisitDepartment(payload.data as GqlVisitDepartment)
          : undefined,
      }
    } catch (err) {
      console.error('Add action error:', err)
      throw err
    }
  }

  return { addAction, loading, error }
}

export function useAddChildVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(ADD_CHILD_VISIT_DEPARTMENT_MUTATION)

  const addChildVisitDepartment = async (input: {
    parentVisitDepartmentId: string
    departmentId: string
    products: Array<{ productId: string; quantity: number }>
    processorId?: string
  }): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            parentVisitDepartmentId: input.parentVisitDepartmentId,
            departmentId: input.departmentId,
            products: input.products.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
            processorId: input.processorId,
          },
        },
      })
      const payload = result.data?.addChildVisitDepartment
      return {
        status: payload?.status || 'ERROR',
        messages: payload?.message ? [{ text: payload.message, type: payload.status || 'ERROR' }] : undefined,
        data: payload?.data ? mapGqlVisitDepartment(payload.data as GqlVisitDepartment) : undefined,
      }
    } catch (err) {
      console.error('Add child visit department error:', err)
      throw err
    }
  }

  return { addChildVisitDepartment, loading, error }
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
          ? mapGqlVisitDepartment(payload.data as GqlVisitDepartment)
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
          ? mapGqlVisitDepartment(payload.data as GqlVisitDepartment)
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
