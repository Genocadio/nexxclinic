import { gql } from '@apollo/client'

export const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
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

export const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation UpdateDepartment($departmentId: ID!, $input: UpdateDepartmentInput!) {
    updateDepartment(departmentId: $departmentId, input: $input) {
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

export const DELETE_DEPARTMENT_MUTATION = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id) {
      status
      message
      
    }
  }
`

export const ADD_DEPARTMENT_INSURANCE_MUTATION = gql`
  mutation AddDepartmentInsurance($departmentId: ID!, $insuranceId: ID!) {
    addDepartmentInsurance(departmentId: $departmentId, insuranceId: $insuranceId) {
      status
      message
      
    }
  }
`

export const REMOVE_DEPARTMENT_INSURANCE_MUTATION = gql`
  mutation RemoveDepartmentInsurance($departmentId: ID!, $insuranceId: ID!) {
    removeDepartmentInsurance(departmentId: $departmentId, insuranceId: $insuranceId) {
      status
      message
      
    }
  }
`

export const ADD_DEPARTMENT_PRODUCT_MUTATION = gql`
  mutation AddDepartmentProduct($departmentId: ID!, $productId: ID!) {
    addDepartmentProduct(departmentId: $departmentId, productId: $productId) {
      status
      message
      
    }
  }
`

export const REMOVE_DEPARTMENT_PRODUCT_MUTATION = gql`
  mutation RemoveDepartmentProduct($departmentId: ID!, $productId: ID!) {
    removeDepartmentProduct(departmentId: $departmentId, productId: $productId) {
      status
      message
      
    }
  }
`
