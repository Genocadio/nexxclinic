import { useMutation, useQuery } from '@apollo/client'
import { GET_DEPARTMENTS_QUERY } from '../queries'
import {
  CREATE_DEPARTMENT_MUTATION,
  UPDATE_DEPARTMENT_MUTATION,
  REMOVE_DEPARTMENT_PROFILE_MUTATION,
} from '../mutations'
import type { Department, DepartmentProfile, Product } from '../types'
import { mapGqlInsuranceProvider, mapGqlProduct } from '@/lib/gql-mappers'
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

export interface GqlDepartmentProfile {
  id: string
  name: string
  isDefault?: boolean | null
  products?: GqlProduct[] | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface GqlDepartment {
  id: string
  name: string
  insurancePolicyMode?: string | null
  nursing?: boolean | null
  supportRequests?: boolean | null
  requestsProducts?: boolean | null
  insurancePolicies?: GqlInsurance[] | null
  profiles?: GqlDepartmentProfile[] | null
  createdAt?: string | null
  updatedAt?: string | null
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

export interface RemoveDepartmentProfilePayload {
  removeDepartmentProfile: {
    status: string
    message?: string
    data?: GqlDepartment | null
  }
}

const mapGqlProductForProfile = (product: GqlProduct): Product =>
  mapGqlProduct({
    ...product,
    insuranceCoverages: (product.insuranceCoverages || []).map((coverage) => ({
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
              defaultCoveragePercentage:
                coverage.insurance.coveragePercentage,
            }
          : { id: '', insuranceName: '' },
      cost: coverage.cost,
      covered: coverage.covered,
      requireMedicalAdvisor: coverage.requireMedicalAdvisor,
    })),
  })

export const mapDepartmentProfileFromApi = (
  profile: GqlDepartmentProfile,
): DepartmentProfile => ({
  id: profile.id,
  name: profile.name,
  isDefault: Boolean(profile.isDefault),
  products: (profile.products || []).map(mapGqlProductForProfile),
  createdAt: profile.createdAt || '',
  updatedAt: profile.updatedAt || '',
})

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
  profiles: (department.profiles || []).map(mapDepartmentProfileFromApi),
  createdAt: department.createdAt || '',
  updatedAt: department.updatedAt || '',
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

export interface DepartmentProfileMutationInput {
  id?: string
  name: string
  isDefault?: boolean
  productIds?: string[]
}

export function useCreateDepartment() {
  const [mutate, { loading, error }] = useMutation<CreateDepartmentPayload>(CREATE_DEPARTMENT_MUTATION)
  const createDepartment = async (name: string, input?: { insuranceProviderIds?: string[]; profiles?: DepartmentProfileMutationInput[]; insurancePolicyMode?: string; nursing?: boolean; supportRequests?: boolean; requestsProducts?: boolean }) => {
    const { data } = await mutate({
      variables: {
        input: {
          name,
          insuranceProviderIds: input?.insuranceProviderIds,
          profiles: input?.profiles,
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
  const updateDepartment = async (id: number | string, input: { name?: string; insuranceProviderIds?: string[]; profiles?: DepartmentProfileMutationInput[]; insurancePolicyMode?: string; nursing?: boolean; supportRequests?: boolean; requestsProducts?: boolean }) => {
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

export function useRemoveDepartmentProfile() {
  const [mutate, { loading, error }] = useMutation<RemoveDepartmentProfilePayload>(REMOVE_DEPARTMENT_PROFILE_MUTATION)
  const removeDepartmentProfile = async (profileId: number | string) => {
    const { data } = await mutate({ variables: { profileId } })
    const payload = data?.removeDepartmentProfile
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
      data: payload?.data ? mapDepartmentFromApi(payload.data) : null,
    }
  }
  return { removeDepartmentProfile, loading, error: error?.message || null }
}
