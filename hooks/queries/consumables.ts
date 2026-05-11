import { gql } from '@apollo/client'

export const GET_CONSUMABLES_QUERY = gql`
  query GetConsumables($name: String, $page: Int, $size: Int) {
    products(input: { name: $name, type: CONSUMABLE_DEVICE, page: $page, size: $size }) {
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
