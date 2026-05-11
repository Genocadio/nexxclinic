import { gql } from '@apollo/client'

export const CREATE_INSURANCE_PROVIDER_MUTATION = gql`
  mutation CreateInsuranceProvider($input: InsuranceProviderInput!) {
    createInsuranceProvider(input: $input) {
      status
      message
      
      data {
        id
        name
        type
        privatePrice
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_INSURANCE_PROVIDER_MUTATION = gql`
  mutation UpdateInsuranceProvider($id: ID!, $input: InsuranceProviderInput!) {
    updateInsuranceProvider(id: $id, input: $input) {
      status
      message
      
      data {
        id
        name
        type
        privatePrice
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_INSURANCE_PROVIDER_MUTATION = gql`
  mutation DeleteInsuranceProvider($id: ID!) {
    deleteInsuranceProvider(id: $id) {
      status
      message
      
    }
  }
`
