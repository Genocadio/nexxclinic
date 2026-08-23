import { gql } from '@apollo/client'

export const DEPARTMENT_PROFILE_PRODUCT_FRAGMENT = gql`
  fragment DepartmentProfileProduct on Product {
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
        coverages {

                        id

                        insuranceProviderId

                        insuranceProviderName

                        departmentId

                        departmentName

                        encounterType

                        patientSharePercentage

                        createdAt

                        updatedAt

                      }
        supportedByClinic
        iconUrl
      }
      cost
      covered
      requireMedicalAdvisor
    }
  }
`

export const DEPARTMENT_PROFILE_FRAGMENT = gql`
  fragment DepartmentProfileFields on DepartmentProfile {
    id
    name
    isDefault
    products {
      ...DepartmentProfileProduct
    }
    createdAt
    updatedAt
  }
`

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
          coverages {

                          id

                          insuranceProviderId

                          insuranceProviderName

                          departmentId

                          departmentName

                          encounterType

                          patientSharePercentage

                          createdAt

                          updatedAt

                        }
          supportedByClinic
          iconUrl
        }
        profiles {
          ...DepartmentProfileFields
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
  ${DEPARTMENT_PROFILE_PRODUCT_FRAGMENT}
  ${DEPARTMENT_PROFILE_FRAGMENT}
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
          coverages {

                          id

                          insuranceProviderId

                          insuranceProviderName

                          departmentId

                          departmentName

                          encounterType

                          patientSharePercentage

                          createdAt

                          updatedAt

                        }
          supportedByClinic
          iconUrl
        }
        profiles {
          ...DepartmentProfileFields
        }
        createdAt
        updatedAt
      }
    }
  }
  ${DEPARTMENT_PROFILE_PRODUCT_FRAGMENT}
  ${DEPARTMENT_PROFILE_FRAGMENT}
`
