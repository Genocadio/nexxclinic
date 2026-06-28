import { gql } from "@apollo/client";

export const GET_STANDALONE_FORMS_QUERY = gql`
  query GetStandaloneForms(
    $isTemplate: Boolean
    $category: String
    $name: String
  ) {
    getStandaloneForms(
      isTemplate: $isTemplate
      category: $category
      name: $name
    ) {
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
`;

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
`;

const STANDALONE_FORM_FRAGMENT = gql`
  fragment StandaloneFormFields on StandaloneForm {
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
`;

export const GET_DEPARTMENT_FORMS_QUERY = gql`
  query GetDepartmentForms($departmentId: ID!) {
    getDepartmentForms(departmentId: $departmentId) {
      status
      message
      data {
        forms {
          isDefault
          form {
            ...StandaloneFormFields
          }
        }
        defaultForm {
          ...StandaloneFormFields
        }
      }
    }
  }
  ${STANDALONE_FORM_FRAGMENT}
`;

export const GET_STANDALONE_ANSWERS_QUERY = gql`
  query GetStandaloneAnswers($formId: ID, $patientId: ID) {
    getStandaloneAnswers(formId: $formId, patientId: $patientId) {
      id
      score
      status
      patientId
      visitId
      submittedAt
      createdAt
      updatedAt
      form {
        id
        name
      }
      formVersion {
        id
        versionLabel
        majorVersion
        minorVersion
      }
    }
  }
`;

export const GET_STANDALONE_ANSWER_QUERY = gql`
  query GetStandaloneAnswer($id: ID!) {
    getStandaloneAnswer(id: $id) {
      status
      message
      data {
        id
        answers
        score
        status
        patientId
        visitId
        submittedAt
        createdAt
        updatedAt
        form {
          ...StandaloneFormFields
        }
        formVersion {
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
  ${STANDALONE_FORM_FRAGMENT}
`;
