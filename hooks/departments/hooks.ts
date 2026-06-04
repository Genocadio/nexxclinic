import { useMutation, useQuery } from '@apollo/client'
import { GET_DEPARTMENTS_QUERY } from '../queries'
import { 
  CREATE_DEPARTMENT_MUTATION, 
  UPDATE_DEPARTMENT_MUTATION, 
  DELETE_DEPARTMENT_MUTATION, 
  ADD_DEPARTMENT_INSURANCE_MUTATION, 
  REMOVE_DEPARTMENT_INSURANCE_MUTATION, 
  ADD_DEPARTMENT_PRODUCT_MUTATION, 
  REMOVE_DEPARTMENT_PRODUCT_MUTATION 
} from '../mutations'
import type { Department, Product } from '../types'
import {
  mapGqlInsuranceProvider,
  mapGqlProduct,
  type GqlCoverage,
} from '@/lib/gql-mappers'
import { DepartmentInsurancePolicyMode } from '@/lib/api-types'

export interface GqlInsurance {
  id: string
  insuranceName?: string | null
  acronym?: string | null
  defaultCoveragePercentage?: number | null
  supportedByClinic?: boolean | null
  iconUrl?: string | null
}

export interface GqlProductCoverage {
  id: string
  insuranceProvider?: {
    id: string
    insuranceName?: string | null
    acronym?: string | null
    defaultCoveragePercentage?: number | null
  } | null
  insurance?: {
    id: string
    name?: string | null
    acronym?: string | null
    coveragePercentage?: number | null
  } | null
  cost?: number | null
  covered?: boolean | null
  requireMedicalAdvisor?: boolean | null
}

export interface GqlProduct {
  id: string
  name: string
  genericName?: string | null
  code?: string | null
  description?: string | null
  type?: string | null
  unit?: string | null
  privateRhicPrice?: number | null
  clinicPrice?: number | null
  insuranceCoverages?: GqlProductCoverage[] | null
}

export interface GqlDepartment {
  id: string
  name: string
  insurancePolicyMode?: string | null
  nursing?: boolean | null
  supportRequests?: boolean | null
  requestsProducts?: boolean | null
  insurancePolicies?: GqlInsurance[] | null
  defaultProducts?: GqlProduct[] | null
}

export interface DepartmentsQueryData {
  departments: {
    status: string
    message?: string
    data: GqlDepartment[]
  }
}

export interface CreateDepartmentPayload {
  createDepartment: {
    status: string
    message?: string
    data?: GqlDepartment | null
  }
}

export interface UpdateDepartmentPayload {
  updateDepartment: {
    status: string
    message?: string
    data?: GqlDepartment | null
  }
}

export interface DeleteDepartmentPayload {
  deleteDepartment: {
    status: string
    message?: string
  }
}

export interface AddDepartmentInsurancePayload {
  addDepartmentInsurance: {
    status: string
    message?: string
    data?: GqlDepartment | null
  }
}

export interface RemoveDepartmentInsurancePayload {
  removeDepartmentInsurance: {
    status: string
    message?: string
    data?: GqlDepartment | null
  }
}

export interface AddDepartmentProductPayload {
  addDepartmentProduct: {
    status: string
    message?: string
    data?: GqlDepartment | null
  }
}

export interface RemoveDepartmentProductPayload {
  removeDepartmentProduct: {
    status: string
    message?: string
    data?: GqlDepartment | null
  }
}

const mapDepartmentFromApi = (department: GqlDepartment): Department => ({
  id: department.id,
  name: department.name,
  insurancePolicyMode:
    (department.insurancePolicyMode as DepartmentInsurancePolicyMode) ||
    DepartmentInsurancePolicyMode.ALL,
  nursing: department.nursing ?? false,
  supportRequests: department.supportRequests ?? false,
  requestsProducts: department.requestsProducts ?? false,
  insurancePolicies: (department.insurancePolicies || []).map((insurance: GqlInsurance) =>
    mapGqlInsuranceProvider({
      id: insurance.id,
      insuranceName: insurance.insuranceName || 'Unknown Insurance',
      acronym: insurance.acronym,
      defaultCoveragePercentage: insurance.defaultCoveragePercentage,
      supportedByClinic: insurance.supportedByClinic,
      iconUrl: insurance.iconUrl,
    }),
  ),
  defaultProducts: (department.defaultProducts || []).map((product: GqlProduct) =>
    mapGqlProduct({
      id: product.id,
      name: product.name,
      genericName: product.genericName,
      code: product.code || '',
      description: product.description || '',
      type: product.type,
      unit: product.unit,
      privateRhicPrice: product.privateRhicPrice,
      clinicPrice: product.clinicPrice,
      insuranceCoverages: (product.insuranceCoverages || []).map(
        (coverage: GqlProductCoverage): GqlCoverage => ({
          id: coverage.id,
          insuranceProvider: coverage.insuranceProvider
            ? {
                id: coverage.insuranceProvider.id,
                insuranceName: coverage.insuranceProvider.insuranceName || '',
                acronym: coverage.insuranceProvider.acronym,
                defaultCoveragePercentage:
                  coverage.insuranceProvider.defaultCoveragePercentage,
              }
            : coverage.insurance
              ? {
                  id: coverage.insurance.id,
                  insuranceName: coverage.insurance.name || '',
                  acronym: coverage.insurance.acronym,
                  defaultCoveragePercentage: coverage.insurance.coveragePercentage,
                }
              : { id: '', insuranceName: '' },
          cost: coverage.cost,
          covered: coverage.covered,
          requireMedicalAdvisor: coverage.requireMedicalAdvisor,
        }),
      ),
    }),
  ),
  createdAt: '',
  updatedAt: '',
})

export function useDepartments(options?: { skip?: boolean; input?: { name?: string; supportRequests?: boolean; requestsProducts?: boolean; page?: number; size?: number } }) {
  const variables = {
    input: {
      page: options?.input?.page ?? 0,
      size: options?.input?.size ?? 200,
      name: options?.input?.name || undefined,
      supportRequests: options?.input?.supportRequests,
      requestsProducts: options?.input?.requestsProducts,
    },
  }

  const { data, loading, error, refetch: refetchQuery } = useQuery<DepartmentsQueryData>(GET_DEPARTMENTS_QUERY, {
    variables,
    fetchPolicy: 'cache-and-network',
    skip: options?.skip ?? false,
  })

  const departments = (data?.departments?.data || []).map(mapDepartmentFromApi)
  const refetch = () => refetchQuery(variables)

  return { departments, loading: loading || false, error: error?.message || null, refetch }
}

export function useCreateDepartment() {
  const [mutate, { loading, error }] = useMutation<CreateDepartmentPayload>(CREATE_DEPARTMENT_MUTATION)
  const createDepartment = async (name: string, input?: { insuranceProviderIds?: string[]; defaultProductIds?: string[]; insurancePolicyMode?: string; nursing?: boolean; supportRequests?: boolean; requestsProducts?: boolean }) => {
    const { data } = await mutate({
      variables: {
        input: {
          name,
          insuranceProviderIds: input?.insuranceProviderIds,
          defaultProductIds: input?.defaultProductIds,
          insurancePolicyMode: input?.insurancePolicyMode,
          nursing: input?.nursing,
          supportRequests: input?.supportRequests,
          requestsProducts: input?.requestsProducts,
        },
      },
    })
    const payload = data?.createDepartment
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
      data: payload?.data ? mapDepartmentFromApi(payload.data) : null,
    }
  }
  return { createDepartment, loading, error: error?.message || null }
}

export function useUpdateDepartment() {
  const [mutate, { loading, error }] = useMutation<UpdateDepartmentPayload>(UPDATE_DEPARTMENT_MUTATION)
  const updateDepartment = async (id: number | string, input: { name?: string; insuranceProviderIds?: string[]; defaultProductIds?: string[]; insurancePolicyMode?: string; nursing?: boolean; supportRequests?: boolean; requestsProducts?: boolean }) => {
    const { data } = await mutate({ variables: { departmentId: id, input } })
    const payload = data?.updateDepartment
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
      data: payload?.data ? mapDepartmentFromApi(payload.data) : null,
    }
  }
  return { updateDepartment, loading, error: error?.message || null }
}

export function useDeleteDepartment() {
  const [mutate, { loading, error }] = useMutation<DeleteDepartmentPayload>(DELETE_DEPARTMENT_MUTATION)
  const deleteDepartment = async (id: number | string) => {
    const { data } = await mutate({ variables: { id } })
    const payload = data?.deleteDepartment
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
    }
  }
  return { deleteDepartment, loading, error: error?.message || null }
}

export function useAddDepartmentInsurance() {
  const [mutate, { loading, error }] = useMutation<AddDepartmentInsurancePayload>(ADD_DEPARTMENT_INSURANCE_MUTATION)
  const addDepartmentInsurance = async (departmentId: number | string, insuranceId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, insuranceId } })
    const payload = data?.addDepartmentInsurance
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
      data: payload?.data ? mapDepartmentFromApi(payload.data) : null,
    }
  }
  return { addDepartmentInsurance, loading, error: error?.message || null }
}

export function useRemoveDepartmentInsurance() {
  const [mutate, { loading, error }] = useMutation<RemoveDepartmentInsurancePayload>(REMOVE_DEPARTMENT_INSURANCE_MUTATION)
  const removeDepartmentInsurance = async (departmentId: number | string, insuranceId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, insuranceId } })
    const payload = data?.removeDepartmentInsurance
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
      data: payload?.data ? mapDepartmentFromApi(payload.data) : null,
    }
  }
  return { removeDepartmentInsurance, loading, error: error?.message || null }
}

export function useAddDepartmentProduct() {
  const [mutate, { loading, error }] = useMutation<AddDepartmentProductPayload>(ADD_DEPARTMENT_PRODUCT_MUTATION)
  const addDepartmentProduct = async (departmentId: number | string, productId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, productId } })
    const payload = data?.addDepartmentProduct
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
      data: payload?.data ? mapDepartmentFromApi(payload.data) : null,
    }
  }
  return { addDepartmentProduct, loading, error: error?.message || null }
}

export function useRemoveDepartmentProduct() {
  const [mutate, { loading, error }] = useMutation<RemoveDepartmentProductPayload>(REMOVE_DEPARTMENT_PRODUCT_MUTATION)
  const removeDepartmentProduct = async (departmentId: number | string, productId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, productId } })
    const payload = data?.removeDepartmentProduct
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
      data: payload?.data ? mapDepartmentFromApi(payload.data) : null,
    }
  }
  return { removeDepartmentProduct, loading, error: error?.message || null }
}
