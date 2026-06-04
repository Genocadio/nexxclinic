import { gql } from '@apollo/client'

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts($input: SearchProductsInput) {
    products(input: $input) {
      status
      message
      
      data {
        id
        name
        genericName
        code
        description
        type
        unit
        metadata
        privateRhicPrice
        clinicPrice
        insuranceCoverages {
          id
          insuranceProvider {
            id
            insuranceName
            acronym
            defaultCoveragePercentage
          }
          cost
          covered
          requireMedicalAdvisor
          mustPrescribedBy
          drugAdministrationFrequency
          authorizationRequestReasons
        }
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

export const GET_PRODUCT_QUERY = gql`
  query GetProduct($id: ID!) {
    product(productId: $id) {
      status
      message
      
      data {
        id
        name
        genericName
        code
        description
        type
        unit
        metadata
        privateRhicPrice
        clinicPrice
        insuranceCoverages {
          id
          insuranceProvider {
            id
            insuranceName
            acronym
            defaultCoveragePercentage
          }
          cost
          covered
          requireMedicalAdvisor
          mustPrescribedBy
          drugAdministrationFrequency
          authorizationRequestReasons
        }
        createdAt
        updatedAt
      }
    }
  }
`
