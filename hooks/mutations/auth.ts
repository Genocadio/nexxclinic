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
          departments {
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
  mutation Register($input: SelfRegisterInput!) {
    selfRegister(input: $input) {
      status
      message
      
      data {
        id
        firstName
        lastName
        email
        phoneNumber
        username
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

export const ACTIVATE_USER_MUTATION = gql`
  mutation ActivateUser($input: ActivateUserInput!) {
    activateUser(input: $input) {
      status
      message
      
    }
  }
`

export const DEACTIVATE_USER_MUTATION = gql`
  mutation DeactivateUser($input: DeactivateUserInput!) {
    deactivateUser(input: $input) {
      status
      message
      
    }
  }
`

export const ADMIN_UPDATE_USER_MUTATION = gql`
  mutation AdminUpdateUser($userId: ID!, $input: AdminUpdateUserInput!) {
    adminUpdateUser(userId: $userId, input: $input) {
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

export const UPDATE_USER_ROLES_MUTATION = gql`
  mutation UpdateUserRoles($input: ActivateUserInput!) {
    activateUser(input: $input) {
      status
      message
      
    }
  }
`

export const UPDATE_MY_PROFILE_MUTATION = gql`
  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
    updateMyProfile(input: $input) {
      status
      message
      
    }
  }
`

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($input: ChangeMyPasswordInput!) {
    changeMyPassword(input: $input) {
      status
      message
      
    }
  }
`

export const DELETE_USER_PASSWORD_MUTATION = gql`
  mutation AdminTriggerPasswordReset($input: AdminTriggerPasswordResetInput!) {
    adminTriggerPasswordReset(input: $input) {
      status
      message
      
    }
  }
`
