import { gql } from '@apollo/client'

const DEPARTMENT_PROFILE_PRODUCT_FRAGMENT = gql`
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

const DEPARTMENT_PROFILE_FRAGMENT = gql`
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

export const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
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

export const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation UpdateDepartment($departmentId: ID!, $input: UpdateDepartmentInput!) {
    updateDepartment(departmentId: $departmentId, input: $input) {
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

export const REMOVE_DEPARTMENT_PROFILE_MUTATION = gql`
  mutation RemoveDepartmentProfile($profileId: ID!) {
    removeDepartmentProfile(profileId: $profileId) {
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
