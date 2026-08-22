import { useMutation, useQuery } from '@apollo/client'
import {
  GET_INSURANCE_COVERAGE_RULES,
  CREATE_INSURANCE_COVERAGE_RULE_MUTATION,
  UPDATE_INSURANCE_COVERAGE_RULE_MUTATION,
  DELETE_INSURANCE_COVERAGE_RULE_MUTATION,
} from '../mutations/coverage-rules'
import { mapGqlInsuranceCoverageRule, type GqlInsuranceCoverageRule } from '@/lib/gql-mappers'
import type { InsuranceCoverageRule } from '@/lib/api-types'

// ── Query ────────────────────────────────────────────────────────────────────

interface InsuranceCoverageRulesQueryData {
  insuranceCoverageRules: {
    status: string
    message?: string
    data: GqlInsuranceCoverageRule[]
  }
}

/**
 * Fetch insurance coverage rules filtered by provider (and optionally department).
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

// ── Mutations ────────────────────────────────────────────────────────────────

interface CreateRulePayload {
  createInsuranceCoverageRule: {
    status: string
    message?: string
    data?: GqlInsuranceCoverageRule | null
  }
}

export function useCreateInsuranceCoverageRule() {
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
    const payload = data?.createInsuranceCoverageRule
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
      data: payload?.data ? mapGqlInsuranceCoverageRule(payload.data) : null,
    }
  }

  return { createRule, loading, error: error?.message || null }
}

interface UpdateRulePayload {
  updateInsuranceCoverageRule: {
    status: string
    message?: string
    data?: GqlInsuranceCoverageRule | null
  }
}

export function useUpdateInsuranceCoverageRule() {
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
    const payload = data?.updateInsuranceCoverageRule
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
      data: payload?.data ? mapGqlInsuranceCoverageRule(payload.data) : null,
    }
  }

  return { updateRule, loading, error: error?.message || null }
}

interface DeleteRulePayload {
  deleteInsuranceCoverageRule: {
    status: string
    message?: string
  }
}

export function useDeleteInsuranceCoverageRule() {
  const [mutation, { loading, error }] = useMutation<DeleteRulePayload>(
    DELETE_INSURANCE_COVERAGE_RULE_MUTATION,
  )

  const deleteRule = async (ruleId: string) => {
    const { data } = await mutation({ variables: { ruleId } })
    const payload = data?.deleteInsuranceCoverageRule
    return {
      status: payload?.status || 'ERROR',
      message: payload?.message,
    }
  }

  return { deleteRule, loading, error: error?.message || null }
}
