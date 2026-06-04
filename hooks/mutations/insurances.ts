import { gql } from '@apollo/client'

export const CREATE_INSURANCE_PROVIDER_MUTATION = gql`
  mutation CreateInsuranceProvider($input: CreateInsuranceProviderInput!) {
    createInsuranceProvider(input: $input) {
      status
      message
      
      data {
        id
        insuranceName
        acronym
        defaultCoveragePercentage
        supportedByClinic
        iconUrl
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_INSURANCE_PROVIDER_MUTATION = gql`
  mutation UpdateInsuranceProvider($insuranceProviderId: ID!, $input: UpdateInsuranceProviderInput!) {
    updateInsuranceProvider(insuranceProviderId: $insuranceProviderId, input: $input) {
      status
      message
      
      data {
        id
        insuranceName
        acronym
        defaultCoveragePercentage
        supportedByClinic
        iconUrl
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_INSURANCE_PROVIDER_MUTATION = gql`
  mutation DeleteInsuranceProvider($insuranceProviderId: ID!) {
    deleteInsuranceProvider(insuranceProviderId: $insuranceProviderId) {
      status
      message
    }
  }
`
