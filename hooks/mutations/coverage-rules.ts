import { gql } from '@apollo/client'

export const GET_INSURANCE_COVERAGE_RULES = gql`
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

export const CREATE_INSURANCE_COVERAGE_RULE_MUTATION = gql`
  mutation CreateInsuranceCoverageRule($input: CreateInsuranceCoverageRuleInput!) {
    createInsuranceCoverageRule(input: $input) {
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

export const UPDATE_INSURANCE_COVERAGE_RULE_MUTATION = gql`
  mutation UpdateInsuranceCoverageRule($ruleId: ID!, $input: UpdateInsuranceCoverageRuleInput!) {
    updateInsuranceCoverageRule(ruleId: $ruleId, input: $input) {
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

export const DELETE_INSURANCE_COVERAGE_RULE_MUTATION = gql`
  mutation DeleteInsuranceCoverageRule($ruleId: ID!) {
    deleteInsuranceCoverageRule(ruleId: $ruleId) {
      status
      message
      data
    }
  }
`
