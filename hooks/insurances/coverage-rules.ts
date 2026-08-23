import { useMutation, useQuery } from '@apollo/client'
import {
  GET_INSURANCE_COVERAGE_RULES,
  CREATE_INSURANCE_COVERAGE_RULE_MUTATION,
  UPDATE_INSURANCE_COVERAGE_RULE_MUTATION,
  DELETE_INSURANCE_COVERAGE_RULE_MUTATION,
} from '../mutations/coverage-rules'
import { mapGqlInsuranceCoverage, type GqlInsuranceCoverage } from '@/lib/gql-mappers'
import type { InsuranceCoverage } from '@/lib/api-types'

// ── Query ────────────────────────────────────────────────────────────────────

interface InsuranceCoveragesQueryData {
  insuranceCoverages: {
    status: string
    message?: string
    data: GqlInsuranceCoverage[]
  }
}

/**
 * Fetch insurance coverage rules filtered by provider (and optionally department).
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

// ── Mutations ────────────────────────────────────────────────────────────────

interface CreateRulePayload {
  createInsuranceCoverage: {
    status: string
    message?: string
    data?: GqlInsuranceCoverage | null
  }
}

export function useCreateInsuranceCoverage() {
  const [mutation, { loading, error }] = useMutation<CreateRulePayload>(
    CREATE_INSURANCE_COVERAGE_RULE_MUTATION,
  )

  const createRule = async (input: {
    insuranceProviderId: string
    departmentId?: string | null
    encounterType?: string | null
    patientSharePercentage: number
  }) => {
    const { data } = await mutation({ variables: { input } })
    const payload = data?.createInsuranceCoverage
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
      data: payload?.data ? mapGqlInsuranceCoverage(payload.data) : null,
    }
  }

  return { createRule, loading, error: error?.message || null }
}

interface UpdateRulePayload {
  updateInsuranceCoverage: {
    status: string
    message?: string
    data?: GqlInsuranceCoverage | null
  }
}

export function useUpdateInsuranceCoverage() {
  const [mutation, { loading, error }] = useMutation<UpdateRulePayload>(
    UPDATE_INSURANCE_COVERAGE_RULE_MUTATION,
  )

  const updateRule = async (
    ruleId: string,
    input: {
      departmentId?: string | null
      encounterType?: string | null
      patientSharePercentage?: number
    },
  ) => {
    const { data } = await mutation({ variables: { ruleId, input } })
    const payload = data?.updateInsuranceCoverage
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
      data: payload?.data ? mapGqlInsuranceCoverage(payload.data) : null,
    }
  }

  return { updateRule, loading, error: error?.message || null }
}

interface DeleteRulePayload {
  deleteInsuranceCoverage: {
    status: string
    message?: string
  }
}

export function useDeleteInsuranceCoverage() {
  const [mutation, { loading, error }] = useMutation<DeleteRulePayload>(
    DELETE_INSURANCE_COVERAGE_RULE_MUTATION,
  )

  const deleteRule = async (ruleId: string) => {
    const { data } = await mutation({ variables: { ruleId } })
    const payload = data?.deleteInsuranceCoverage
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
    }
  }

  return { deleteRule, loading, error: error?.message || null }
}
