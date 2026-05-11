import { gql } from '@apollo/client'

export const GET_DEPARTMENTS_QUERY = gql`
  query GetDepartments($input: SearchDepartmentsInput) {
    departments(input: $input) {
      status
      message
      
      data {
        id
        name
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
          code
          type
          unit
          privateRhicPrice
          clinicPrice
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
          code
          type
          unit
          privateRhicPrice
          clinicPrice
        }
        createdAt
        updatedAt
      }
    }
  }
`
