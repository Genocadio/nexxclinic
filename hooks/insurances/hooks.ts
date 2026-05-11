import { useMutation, useQuery } from '@apollo/client'
import { GET_INSURANCES_QUERY } from '../queries'
import { CREATE_INSURANCE_PROVIDER_MUTATION, UPDATE_INSURANCE_PROVIDER_MUTATION, DELETE_INSURANCE_PROVIDER_MUTATION } from '../mutations'
import { gql } from '@apollo/client'

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
  const insuranceInput: any = {
    page: input?.page ?? 0,
    size: input?.size ?? 200,
    ...(input?.query ? { query: input.query } : {}),
  }
  if (!input || !("supportedByClinic" in input)) {
    insuranceInput.supportedByClinic = true
  } else if (typeof input.supportedByClinic === 'boolean') {
    insuranceInput.supportedByClinic = input.supportedByClinic
  }

  const { data, loading, error, refetch } = useQuery(GET_INSURANCES_QUERY_LOCAL, {
    variables: { input: insuranceInput },
    fetchPolicy: 'cache-and-network'
  })

  const insurances = (data?.insuranceProviders?.data || []).map((insurance: any) => ({
    id: String(insurance.id),
    name: insurance.insuranceName,
    acronym: insurance.acronym,
    coveragePercentage: insurance.defaultCoveragePercentage,
    supportedByClinic: insurance.supportedByClinic,
    iconUrl: insurance.iconUrl,
  }))

  return { insurances, loading: loading || false, error: error?.message || null, refetch }
}

export function useInsuranceSearch(searchQuery: string) {
  const { data, loading, error } = useQuery(GET_INSURANCES_QUERY_LOCAL, {
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

  const insurances = (data?.insuranceProviders?.data || []).map((insurance: any) => ({
    id: String(insurance.id),
    name: insurance.insuranceName,
    acronym: insurance.acronym,
    coveragePercentage: insurance.defaultCoveragePercentage,
    supportedByClinic: insurance.supportedByClinic,
    iconUrl: insurance.iconUrl,
  }))

  return { insurances, loading, error: error?.message || null }
}

export function useCreateInsuranceProvider() {
  const [mutation, { loading, error }] = useMutation(CREATE_INSURANCE_PROVIDER_MUTATION)
  const createInsuranceProvider = async (input: {
    insuranceName: string
    acronym?: string
    defaultCoveragePercentage: number
    supportedByClinic?: boolean
    iconUrl?: string
  }) => {
    const { data } = await mutation({ variables: { input } })
    return data?.createInsuranceProvider?.data
  }
  return { createInsuranceProvider, loading, error: error?.message || null }
}

export function useUpdateInsuranceProvider() {
  const [mutation, { loading, error }] = useMutation(UPDATE_INSURANCE_PROVIDER_MUTATION)
  const updateInsuranceProvider = async (insuranceProviderId: string | number, input: {
    insuranceName?: string
    acronym?: string
    defaultCoveragePercentage?: number
    supportedByClinic?: boolean
    iconUrl?: string
  }) => {
    const { data } = await mutation({ variables: { insuranceProviderId, input } })
    return data?.updateInsuranceProvider?.data
  }
  return { updateInsuranceProvider, loading, error: error?.message || null }
}

export function useDeleteInsuranceProvider() {
  const [mutation, { loading, error }] = useMutation(DELETE_INSURANCE_PROVIDER_MUTATION)
  const deleteInsuranceProvider = async (insuranceProviderId: string | number) => {
    const { data } = await mutation({ variables: { insuranceProviderId } })
    return data?.deleteInsuranceProvider?.status === 'SUCCESS'
  }
  return { deleteInsuranceProvider, loading, error: error?.message || null }
}
