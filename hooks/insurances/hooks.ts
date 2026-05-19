import { useMutation, useQuery } from '@apollo/client'
import { GET_INSURANCES_QUERY } from '../queries'
import { CREATE_INSURANCE_PROVIDER_MUTATION, UPDATE_INSURANCE_PROVIDER_MUTATION, DELETE_INSURANCE_PROVIDER_MUTATION } from '../mutations'
import { gql } from '@apollo/client'
import type { Insurance, InsuranceProvider, ApiResponse } from '../types'

export interface GqlInsuranceProvider {
  id: string
  insuranceName: string
  acronym?: string | null
  defaultCoveragePercentage: number
  supportedByClinic: boolean
  iconUrl?: string | null
}

export interface InsuranceProvidersQueryData {
  insuranceProviders: {
    status: string
    message?: string
    data: GqlInsuranceProvider[]
  }
}

export interface SearchInsuranceProvidersInput {
  supportedByClinic?: boolean | null
  page?: number | null
  size?: number | null
  query?: string | null
}

const GET_INSURANCES_QUERY_LOCAL = gql`
  query GetInsurances($input: SearchInsuranceProvidersInput) {
    insuranceProviders(input: $input) {
      status
      message
      data {
        id
        insuranceName
        acronym
        defaultCoveragePercentage
        supportedByClinic
        iconUrl
      }
    }
  }
`

export function useInsurances(input?: { supportedByClinic?: boolean | null; page?: number; size?: number; query?: string }) {
  const insuranceInput: SearchInsuranceProvidersInput = {
    page: input?.page ?? 0,
    size: input?.size ?? 200,
    ...(input?.query ? { query: input.query } : {}),
  }
  if (!input || !("supportedByClinic" in input)) {
    insuranceInput.supportedByClinic = true
  } else if (typeof input.supportedByClinic === 'boolean') {
    insuranceInput.supportedByClinic = input.supportedByClinic
  }

  const { data, loading, error, refetch } = useQuery<InsuranceProvidersQueryData>(GET_INSURANCES_QUERY_LOCAL, {
    variables: { input: insuranceInput },
    fetchPolicy: 'cache-and-network'
  })

  const insurances: Insurance[] = (data?.insuranceProviders?.data || []).map((insurance: GqlInsuranceProvider) => ({
    id: String(insurance.id),
    name: insurance.insuranceName,
    acronym: insurance.acronym || undefined,
    coveragePercentage: insurance.defaultCoveragePercentage,
    supportedByClinic: insurance.supportedByClinic,
    iconUrl: insurance.iconUrl || undefined,
  }))

  return { insurances, loading: loading || false, error: error?.message || null, refetch }
}

export function useInsuranceSearch(searchQuery: string) {
  const { data, loading, error } = useQuery<InsuranceProvidersQueryData>(GET_INSURANCES_QUERY_LOCAL, {
    variables: { 
      input: { 
        query: searchQuery || undefined,
        supportedByClinic: true,
        page: 0, 
        size: 20 
      } 
    },
    fetchPolicy: 'cache-and-network',
    skip: !searchQuery || searchQuery.length < 2,
  })

  const insurances: Insurance[] = (data?.insuranceProviders?.data || []).map((insurance: GqlInsuranceProvider) => ({
    id: String(insurance.id),
    name: insurance.insuranceName,
    acronym: insurance.acronym || undefined,
    coveragePercentage: insurance.defaultCoveragePercentage,
    supportedByClinic: insurance.supportedByClinic,
    iconUrl: insurance.iconUrl || undefined,
  }))

  return { insurances, loading, error: error?.message || null }
}

export interface CreateInsuranceProviderPayload {
  createInsuranceProvider: {
    status: string
    message?: string
    data?: GqlInsuranceProvider | null
  }
}

export interface UpdateInsuranceProviderPayload {
  updateInsuranceProvider: {
    status: string
    message?: string
    data?: GqlInsuranceProvider | null
  }
}

export interface DeleteInsuranceProviderPayload {
  deleteInsuranceProvider: {
    status: string
    message?: string
  }
}

export function useCreateInsuranceProvider() {
  const [mutation, { loading, error }] = useMutation<CreateInsuranceProviderPayload>(CREATE_INSURANCE_PROVIDER_MUTATION)
  const createInsuranceProvider = async (input: {
    insuranceName: string
    acronym?: string
    defaultCoveragePercentage: number
    supportedByClinic?: boolean
    iconUrl?: string
  }): Promise<InsuranceProvider | undefined> => {
    const { data } = await mutation({ variables: { input } })
    const created = data?.createInsuranceProvider?.data
    if (!created) return undefined
    return {
      id: created.id,
      insuranceName: created.insuranceName,
      acronym: created.acronym || undefined,
      defaultCoveragePercentage: created.defaultCoveragePercentage,
      supportedByClinic: created.supportedByClinic,
      iconUrl: created.iconUrl || undefined,
    }
  }
  return { createInsuranceProvider, loading, error: error?.message || null }
}

export function useUpdateInsuranceProvider() {
  const [mutation, { loading, error }] = useMutation<UpdateInsuranceProviderPayload>(UPDATE_INSURANCE_PROVIDER_MUTATION)
  const updateInsuranceProvider = async (insuranceProviderId: string | number, input: {
    insuranceName?: string
    acronym?: string
    defaultCoveragePercentage?: number
    supportedByClinic?: boolean
    iconUrl?: string
  }): Promise<InsuranceProvider | undefined> => {
    const { data } = await mutation({ variables: { insuranceProviderId, input } })
    const updated = data?.updateInsuranceProvider?.data
    if (!updated) return undefined
    return {
      id: updated.id,
      insuranceName: updated.insuranceName,
      acronym: updated.acronym || undefined,
      defaultCoveragePercentage: updated.defaultCoveragePercentage,
      supportedByClinic: updated.supportedByClinic,
      iconUrl: updated.iconUrl || undefined,
    }
  }
  return { updateInsuranceProvider, loading, error: error?.message || null }
}

export function useDeleteInsuranceProvider() {
  const [mutation, { loading, error }] = useMutation<DeleteInsuranceProviderPayload>(DELETE_INSURANCE_PROVIDER_MUTATION)
  const deleteInsuranceProvider = async (insuranceProviderId: string | number): Promise<boolean> => {
    const { data } = await mutation({ variables: { insuranceProviderId } })
    return data?.deleteInsuranceProvider?.status === 'SUCCESS'
  }
  return { deleteInsuranceProvider, loading, error: error?.message || null }
}
