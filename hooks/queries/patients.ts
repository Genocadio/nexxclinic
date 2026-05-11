import { gql } from '@apollo/client'

export const GET_PATIENTS_QUERY = gql`
  query GetPatients($limit: Int, $offset: Int, $name: String) {
    patients(limit: $limit, offset: $offset, name: $name) {
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

export const GET_PATIENT_QUERY = gql`
  query GetPatient($id: ID!) {
    patient(patientId: $id) {
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
        updatedAt
      }
    }
  }
`
