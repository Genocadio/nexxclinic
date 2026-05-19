import { gql } from '@apollo/client'

export const REGISTER_PATIENT_MUTATION = gql`
  mutation RegisterPatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      status
      message
      data {
        id
        firstName
        lastName
        middleName
        gender
        dateOfBirth
        primaryPhoneNumber
        alternativePhone
        village
        city
        district
        postalAddress
        nationalIdNumber
        passportNumber
        emergencyContactName
        emergencyContactRelationship
        emergencyContactPhoneNumber
        createdAt
        updatedAt
      }
    }
  }
`

export const CREATE_PATIENT_INSURANCE_MUTATION = gql`
  mutation CreatePatientInsurance($input: CreatePatientInsuranceInput!) {
    createPatientInsurance(input: $input) {
      status
      message
      data {
        id
        insuranceCardNumber
        principalMember
        principalMemberName
        principalMemberPhoneNumber
        insuranceProvider {
          id
          insuranceName
          acronym
          defaultCoveragePercentage
        }
      }
    }
  }
`

export const UPDATE_PATIENT_MUTATION = gql`
  mutation UpdatePatient($patientId: ID!, $input: UpdatePatientInput!) {
    updatePatient(patientId: $patientId, input: $input) {
      status
      message
      data {
        id
        firstName
        lastName
        middleName
        gender
        dateOfBirth
        primaryPhoneNumber
        alternativePhone
        village
        city
        district
        postalAddress
        nationalIdNumber
        passportNumber
        emergencyContactName
        emergencyContactRelationship
        emergencyContactPhoneNumber
        createdAt
        updatedAt
      }
    }
  }
`

