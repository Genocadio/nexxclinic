import { gql } from '@apollo/client'

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      status
      message
      
      data {
        id
        name
        description
        type
        quantifiable
        privatePrice
        clinicPrice
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      status
      message
      
      data {
        id
        name
        description
        type
        quantifiable
        privatePrice
        clinicPrice
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      status
      message
      
    }
  }
`

export const ADD_PRODUCT_INSURANCE_COVERAGE_MUTATION = gql`
  mutation AddProductInsuranceCoverage($productId: ID!, $insuranceId: ID!, $coverage: Float!) {
    addProductInsuranceCoverage(productId: $productId, insuranceId: $insuranceId, coverage: $coverage) {
      status
      message
      
    }
  }
`

export const REMOVE_PRODUCT_INSURANCE_COVERAGE_MUTATION = gql`
  mutation RemoveProductInsuranceCoverage($productId: ID!, $insuranceId: ID!) {
    removeProductInsuranceCoverage(productId: $productId, insuranceId: $insuranceId) {
      status
      message
      
    }
  }
`
