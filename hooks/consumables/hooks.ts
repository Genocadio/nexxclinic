import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

const GET_PRODUCTS_QUERY = gql`
  query GetProducts($name: String, $page: Int, $size: Int) {
    products(input: { name: $name, page: $page, size: $size }) {
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

export function useProducts() {
  const { data, loading, error, refetch: refetchQuery } = useQuery(GET_PRODUCTS_QUERY, {
    variables: { page: 1, size: 100 },
    fetchPolicy: 'cache-and-network'
  })

  const products = data?.products?.data || []

  const refetch = async (name?: string, page: number = 1, size: number = 100) => {
    return refetchQuery({ name, page, size })
  }

  return { products, loading: loading || false, error: error?.message || null, refetch }
}
