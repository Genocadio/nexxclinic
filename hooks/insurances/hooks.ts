import { useMutation, useQuery } from '@apollo/client'
import { GET_INSURANCES_QUERY } from '../queries'
import { CREATE_INSURANCE_PROVIDER_MUTATION, UPDATE_INSURANCE_PROVIDER_MUTATION, DELETE_INSURANCE_PROVIDER_MUTATION } from '../mutations'
import { gql } from '@apollo/client'
import type { InsuranceProvider, ApiResponse, SearchInsuranceProvidersInput } from '../types'
import { mapGqlInsuranceProvider, type GqlInsuranceProvider } from '@/lib/gql-mappers'

interface LocalGqlInsuranceProvider extends GqlInsuranceProvider {
  defaultCoveragePercentage: number
  supportedByClinic: boolean
}

export interface InsuranceProvidersQueryData {
  insuranceProviders: {
    status: string
    message?: string
    data: LocalGqlInsuranceProvider[]
  }
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

  const insurances: InsuranceProvider[] = (data?.insuranceProviders?.data || []).map(
    (insurance: LocalGqlInsuranceProvider) => mapGqlInsuranceProvider(insurance),
  )

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

  const insurances: InsuranceProvider[] = (data?.insuranceProviders?.data || []).map(
    (insurance: LocalGqlInsuranceProvider) => mapGqlInsuranceProvider(insurance),
  )

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
  }): Promise<any> => {
    try {
      const { data } = await mutation({ variables: { input } })
      const payload = data?.createInsuranceProvider
      const created = payload?.data
      
      return {
        status: payload?.status || 'ERROR',
        message: payload?.message,
        data: created ? {
          id: created.id,
          insuranceName: created.insuranceName,
          acronym: created.acronym || undefined,
          defaultCoveragePercentage: created.defaultCoveragePercentage,
          supportedByClinic: created.supportedByClinic,
          iconUrl: created.iconUrl || undefined,
        } : undefined,
      }
    } catch (err) {
      console.error('Create insurance provider error:', err)
      throw err
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
  }): Promise<any> => {
    try {
      const { data } = await mutation({ variables: { insuranceProviderId, input } })
      const payload = data?.updateInsuranceProvider
      const updated = payload?.data
      
      return {
        status: payload?.status || 'ERROR',
        message: payload?.message,
        data: updated ? {
          id: updated.id,
          insuranceName: updated.insuranceName,
          acronym: updated.acronym || undefined,
          defaultCoveragePercentage: updated.defaultCoveragePercentage,
          supportedByClinic: updated.supportedByClinic,
          iconUrl: updated.iconUrl || undefined,
        } : undefined,
      }
    } catch (err) {
      console.error('Update insurance provider error:', err)
      throw err
    }
  }
  return { updateInsuranceProvider, loading, error: error?.message || null }
}

export function useDeleteInsuranceProvider() {
  const [mutation, { loading, error }] = useMutation<DeleteInsuranceProviderPayload>(DELETE_INSURANCE_PROVIDER_MUTATION)
  const deleteInsuranceProvider = async (insuranceProviderId: string | number): Promise<any> => {
    try {
      const { data } = await mutation({ variables: { insuranceProviderId } })
      const payload = data?.deleteInsuranceProvider
      
      return {
        status: payload?.status || 'ERROR',
        message: payload?.message,
        data: null,
      }
    } catch (err) {
      console.error('Delete insurance provider error:', err)
      throw err
    }
  }
  return { deleteInsuranceProvider, loading, error: error?.message || null }
}
