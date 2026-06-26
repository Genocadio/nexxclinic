import { gql } from '@apollo/client'

export const GET_STANDALONE_FORMS_QUERY = gql`
  query GetStandaloneForms($isTemplate: Boolean, $category: String) {
    getStandaloneForms(isTemplate: $isTemplate, category: $category) {
      status
      message
      data {
        id
        name
        description
        type
        category
        isTemplate
        createdBy
        createdAt
        updatedAt
        activeVersion {
          id
          formId
          versionLabel
          majorVersion
          minorVersion
          blocks
          theme
          status
          createdAt
        }
      }
    }
  }
`

export const GET_STANDALONE_FORM_QUERY = gql`
  query GetStandaloneForm($id: ID!) {
    getStandaloneForm(id: $id) {
      status
      message
      data {
        id
        name
        description
        type
        category
        isTemplate
        createdBy
        createdAt
        updatedAt
        activeVersion {
          id
          formId
          versionLabel
          majorVersion
          minorVersion
          blocks
          theme
          status
          createdAt
        }
      }
    }
  }
`
