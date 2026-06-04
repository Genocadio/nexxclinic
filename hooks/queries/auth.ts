import { gql } from '@apollo/client'

export const ME_QUERY = gql`
  query Me {
    me {
      status
      message
      
      data {
        id
        firstName
        lastName
        email
        phoneNumber
        username
        accountStatus
        roles
        departments {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`

export const CLINIC_PROFILE_QUERY = gql`
  query ClinicProfile {
    clinicProfile {
      status
      message

      data {
        id
        name
        address
        contacts {
          contactType
          value
          description
        }
        tinNumber
        logoUrl
        metadata
        createdAt
        updatedAt
      }
    }
  }
`

export const GET_USERS_QUERY = gql`
  query GetUsers {
    listUsers {
      status
      message
      
      data {
        id
        firstName
        lastName
        email
        phoneNumber
        username
        accountStatus
        roles
        departments {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`
