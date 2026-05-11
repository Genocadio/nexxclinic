import { gql } from '@apollo/client'

export const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment($input: DepartmentInput!) {
    createDepartment(input: $input) {
      status
      message
      
      data {
        id
        name
        description
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation UpdateDepartment($id: ID!, $input: DepartmentInput!) {
    updateDepartment(id: $id, input: $input) {
      status
      message
      
      data {
        id
        name
        description
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
