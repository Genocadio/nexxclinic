import { gql, useQuery } from '@apollo/client'
import type { InsuranceCoverageRule } from '../types'
import { mapGqlInsuranceCoverageRule, type GqlInsuranceCoverageRule } from '@/lib/gql-mappers'

export const GET_INSURANCES_QUERY = gql`
  query GetInsurances($input: SearchInsuranceProvidersInput) {
    insuranceProviders(input: $input) {
      status
      message
      
      data {
        id
        insuranceName
        acronym
        defaultPatientSharePercentage
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
        defaultPatientSharePercentage
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
  query GetInsuranceCoverageRules($input: SearchInsuranceCoverageRulesInput) {
    insuranceCoverageRules(input: $input) {
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

interface InsuranceCoverageRulesQueryData {
  insuranceCoverageRules: {
    status: string
    message?: string
    data: GqlInsuranceCoverageRule[]
  }
}

/**
 * Fetch insurance coverage rules, optionally filtered by provider or department.
 */
export function useInsuranceCoverageRules(input?: {
  insuranceProviderId?: string
  departmentId?: string
}) {
  const { data, loading, error, refetch } = useQuery<InsuranceCoverageRulesQueryData>(
    GET_INSURANCE_COVERAGE_RULES,
    {
      variables: { input: input || {} },
      fetchPolicy: 'cache-and-network',
      skip: !input?.insuranceProviderId,
    },
  )

  const rules: InsuranceCoverageRule[] = (data?.insuranceCoverageRules?.data || []).map(
    mapGqlInsuranceCoverageRule,
  )

  return { rules, loading, error: error?.message || null, refetch }
}
