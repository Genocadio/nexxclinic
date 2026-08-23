import { gql, useQuery } from '@apollo/client'
import type { InsuranceCoverage } from '../types'
import { mapGqlInsuranceCoverage, type GqlInsuranceCoverage } from '@/lib/gql-mappers'

export const GET_INSURANCES_QUERY = gql`
  query GetInsurances($input: SearchInsuranceProvidersInput) {
    insuranceProviders(input: $input) {
      status
      message
      
      data {
        id
        insuranceName
        acronym
        coverages {

                        id

                        insuranceProviderId

                        insuranceProviderName

                        departmentId

                        departmentName

                        encounterType

                        patientSharePercentage

                        createdAt

                        updatedAt

                      }
        supportedByClinic
        iconUrl
        createdAt
        updatedAt
      }
      pagination {
        total
        perPage
        currentPage
        totalPages
      }
    }
  }
`

export const GET_INSURANCE_QUERY = gql`
  query GetInsurance($id: ID!) {
    insuranceProvider(insuranceProviderId: $id) {
      status
      message
      
      data {
        id
        insuranceName
        acronym
        coverages {

                        id

                        insuranceProviderId

                        insuranceProviderName

                        departmentId

                        departmentName

                        encounterType

                        patientSharePercentage

                        createdAt

                        updatedAt

                      }
        supportedByClinic
        iconUrl
        createdAt
        updatedAt
      }
    }
  }
`

// ── Insurance Coverage Rules ──────────────────────────────────────────────────

const GET_INSURANCE_COVERAGE_RULES = gql`
  query GetInsuranceCoverages($input: SearchInsuranceCoveragesInput) {
    insuranceCoverages(input: $input) {
      status
      message
      data {
        id
        insuranceProviderId
        insuranceProviderName
        departmentId
        departmentName
        encounterType
        patientSharePercentage
        createdAt
        updatedAt
      }
    }
  }
`

interface InsuranceCoveragesQueryData {
  insuranceCoverages: {
    status: string
    message?: string
    data: GqlInsuranceCoverage[]
  }
}

/**
 * Fetch insurance coverage rules, optionally filtered by provider or department.
 */
export function useInsuranceCoverages(input?: {
  insuranceProviderId?: string
  departmentId?: string
}) {
  const { data, loading, error, refetch } = useQuery<InsuranceCoveragesQueryData>(
    GET_INSURANCE_COVERAGE_RULES,
    {
      variables: { input: input || {} },
      fetchPolicy: 'cache-and-network',
      skip: !input?.insuranceProviderId,
    },
  )

  const rules: InsuranceCoverage[] = (data?.insuranceCoverages?.data || []).map(
    mapGqlInsuranceCoverage,
  )

  return { rules, loading, error: error?.message || null, refetch }
}
