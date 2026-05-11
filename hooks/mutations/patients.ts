import { gql } from '@apollo/client'

export const REGISTER_PATIENT_MUTATION = gql`
  mutation RegisterPatient($input: RegisterPatientInput!) {
    registerPatient(input: $input) {
      status
      message
      
      data {
        id
        firstName
        lastName
        middleName
        gender
        dateOfBirth
        nationalId
        contactInfo {
          phoneNumber
          email
          address
        }
        insurances {
          id
          provider {
            id
            name
          }
          policyNumber
          memberNumber
        }
        createdAt
        updatedAt
      }
    }
  }
`

export const CREATE_PATIENT_INSURANCE_MUTATION = gql`
  mutation CreatePatientInsurance($patientId: ID!, $input: PatientInsuranceInput!) {
    createPatientInsurance(patientId: $patientId, input: $input) {
      status
      message
      
      data {
        id
        provider {
          id
          name
        }
        policyNumber
        memberNumber
      }
    }
  }
`

export const UPDATE_PATIENT_MUTATION = gql`
  mutation UpdatePatient($id: ID!, $input: UpdatePatientInput!) {
    updatePatient(id: $id, input: $input) {
      status
      message
      
      data {
        id
        firstName
        lastName
        middleName
        gender
        dateOfBirth
        nationalId
        contactInfo {
          phoneNumber
          email
          address
        }
        insurances {
          id
          provider {
            id
            name
          }
          policyNumber
          memberNumber
        }
        createdAt
        updatedAt
      }
    }
  }
`
