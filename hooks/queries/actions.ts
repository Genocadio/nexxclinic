import { gql } from '@apollo/client'

export const GET_ACTIONS_QUERY = gql`
  query GetActions($name: String, $page: Int, $size: Int) {
    products(input: { name: $name, type: MEDICAL_ACT, page: $page, size: $size }) {
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
