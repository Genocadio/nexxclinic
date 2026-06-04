import { gql } from '@apollo/client'

export const GET_DEPARTMENTS_QUERY = gql`
  query GetDepartments($input: SearchDepartmentsInput) {
    departments(input: $input) {
      status
      message
      
      data {
        id
        name
        nursing
        supportRequests
        requestsProducts
        insurancePolicyMode
        insurancePolicies {
          id
          insuranceName
          acronym
          defaultCoveragePercentage
          supportedByClinic
          iconUrl
        }
        defaultProducts {
          id
          name
          genericName
          code
          description
          type
          unit
          privateRhicPrice
          clinicPrice
          insuranceCoverages {
            id
            insuranceProvider {
              id
              insuranceName
              acronym
              defaultCoveragePercentage
              supportedByClinic
              iconUrl
            }
            cost
            covered
            requireMedicalAdvisor
          }
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

export const GET_DEPARTMENT_QUERY = gql`
  query GetDepartment($id: ID!) {
    department(departmentId: $id) {
      status
      message
      
      data {
        id
        name
        nursing
        supportRequests
        requestsProducts
        insurancePolicyMode
        insurancePolicies {
          id
          insuranceName
          acronym
          defaultCoveragePercentage
          supportedByClinic
          iconUrl
        }
        defaultProducts {
          id
          name
          genericName
          code
          description
          type
          unit
          privateRhicPrice
          clinicPrice
          insuranceCoverages {
            id
            insuranceProvider {
              id
              insuranceName
              acronym
              defaultCoveragePercentage
              supportedByClinic
              iconUrl
            }
            cost
            covered
            requireMedicalAdvisor
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`
