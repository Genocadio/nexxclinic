import { gql } from '@apollo/client'

export const GET_PATIENTS_QUERY = gql`
  query SearchPatients($input: SearchPatientsInput) {
    searchPatients(input: $input) {
      status
      message
      data {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
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
        lastVisit {
          id
          status
          visitDate
        }
        patientInsurances {
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
        createdAt
      }
      pagination {
        total
        totalPages
      }
    }
  }
`

export const GET_PATIENT_QUERY = gql`
  query GetPatient($patientId: ID!) {
    patient(patientId: $patientId) {
      status
      message
      data {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
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
        lastVisit {
          id
          status
          visitDate
        }
        createdAt
      }
    }
    patientInsurances(patientId: $patientId) {
      status
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

