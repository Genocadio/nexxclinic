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
        department {
          id
          name
        }
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
        department {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`
