import { gql } from '@apollo/client'

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      status
      message
      
      data {
        accessToken
        refreshToken
        user {
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
  }
`

export const SET_INITIAL_PASSWORD_MUTATION = gql`
  mutation SetInitialPassword($input: SetInitialPasswordInput!) {
    setInitialPassword(input: $input) {
      status
      message
      
    }
  }
`

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      status
      message
      
      data {
        id
        name
        email
        phoneNumber
        title
      }
    }
  }
`

export const ADMIN_CREATE_USER_MUTATION = gql`
  mutation AdminCreateUser($input: AdminCreateUserInput!) {
    adminCreateUser(input: $input) {
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

export const ACTIVATE_USER_MUTATION = gql`
  mutation ActivateUser($id: ID!) {
    activateUser(id: $id) {
      status
      message
      
    }
  }
`

export const DEACTIVATE_USER_MUTATION = gql`
  mutation DeactivateUser($id: ID!) {
    deactivateUser(id: $id) {
      status
      message
      
    }
  }
`

export const UPDATE_USER_ROLES_MUTATION = gql`
  mutation UpdateUserRoles($id: ID!, $roles: [String!]!) {
    updateUserRoles(id: $id, roles: $roles) {
      status
      message
      
    }
  }
`

export const ADMIN_UPDATE_USER_MUTATION = gql`
  mutation AdminUpdateUser($id: ID!, $input: UpdateUserInput!) {
    adminUpdateUser(id: $id, input: $input) {
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

export const UPDATE_MY_PROFILE_MUTATION = gql`
  mutation UpdateMyProfile($input: UpdateProfileInput!) {
    updateMyProfile(input: $input) {
      status
      message
      
    }
  }
`

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      status
      message
      
    }
  }
`

export const DELETE_USER_PASSWORD_MUTATION = gql`
  mutation DeleteUserPassword($id: ID!) {
    deleteUserPassword(id: $id) {
      status
      message
      
    }
  }
`
