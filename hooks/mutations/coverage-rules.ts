import { gql } from '@apollo/client'

export const GET_INSURANCE_COVERAGE_RULES = gql`
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

export const CREATE_INSURANCE_COVERAGE_RULE_MUTATION = gql`
  mutation CreateInsuranceCoverage($input: CreateInsuranceCoverageInput!) {
    createInsuranceCoverage(input: $input) {
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
  mutation UpdateInsuranceCoverage($ruleId: ID!, $input: UpdateInsuranceCoverageInput!) {
    updateInsuranceCoverage(ruleId: $ruleId, input: $input) {
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
  mutation DeleteInsuranceCoverage($ruleId: ID!) {
    deleteInsuranceCoverage(ruleId: $ruleId) {
      status
      message
      data
    }
  }
`
