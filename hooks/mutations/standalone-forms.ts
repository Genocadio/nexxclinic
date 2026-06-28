import { gql } from "@apollo/client";

export const CREATE_STANDALONE_FORM_MUTATION = gql`
  mutation CreateStandaloneForm($input: StandaloneFormInput!) {
    createStandaloneForm(input: $input) {
      status
      message
      data {
        id
        name
        description
        type
        category
        isTemplate
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

export const UPDATE_STANDALONE_FORM_MUTATION = gql`
  mutation UpdateStandaloneForm(
    $id: ID!
    $input: StandaloneFormInput!
    $markFinal: Boolean
  ) {
    updateStandaloneForm(id: $id, input: $input, markFinal: $markFinal) {
      status
      message
      data {
        id
        name
        description
        type
        category
        isTemplate
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

export const DELETE_STANDALONE_FORM_MUTATION = gql`
  mutation DeleteStandaloneForm($id: ID!, $confirmDeleteAnswers: Boolean) {
    deleteStandaloneForm(id: $id, confirmDeleteAnswers: $confirmDeleteAnswers) {
      status
      message
      data
    }
  }
`;

export const DUPLICATE_STANDALONE_FORM_MUTATION = gql`
  mutation DuplicateStandaloneForm($sourceFormId: ID!) {
    duplicateStandaloneForm(sourceFormId: $sourceFormId) {
      status
      message
      data {
        id
        name
        description
        type
        category
        isTemplate
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

export const SAVE_STANDALONE_ANSWER_MUTATION = gql`
  mutation SaveStandaloneAnswer(
    $formVersionId: ID!
    $answers: JSON!
    $status: AnswerStatus
    $score: Float
  ) {
    saveStandaloneAnswer(
      formVersionId: $formVersionId
      answers: $answers
      status: $status
      score: $score
    ) {
      status
      message
      data {
        id
        answers
        score
        status
        submittedAt
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_STANDALONE_ANSWER_MUTATION = gql`
  mutation UpdateStandaloneAnswer(
    $answerId: ID!
    $answers: JSON!
    $status: AnswerStatus
    $score: Float
  ) {
    updateStandaloneAnswer(
      answerId: $answerId
      answers: $answers
      status: $status
      score: $score
    ) {
      status
      message
      data {
        id
        answers
        score
        status
        visitId
        submittedAt
        createdAt
        updatedAt
        formVersion {
          id
        }
      }
    }
  }
`;

export const SAVE_VISIT_STANDALONE_ANSWER_MUTATION = gql`
  mutation SaveVisitStandaloneAnswer(
    $visitId: ID!
    $visitDepartmentId: ID!
    $formVersionId: ID!
    $answers: JSON!
    $status: AnswerStatus
    $score: Float
  ) {
    saveVisitStandaloneAnswer(
      visitId: $visitId
      visitDepartmentId: $visitDepartmentId
      formVersionId: $formVersionId
      answers: $answers
      status: $status
      score: $score
    ) {
      status
      message
      data {
        answer {
          id
          answers
          score
          status
          visitId
          submittedAt
          createdAt
          updatedAt
          formVersion {
            id
          }
        }
        visitDepartment {
          id
          answerId
        }
      }
    }
  }
`;

export const LINK_STANDALONE_FORM_TO_DEPARTMENT_MUTATION = gql`
  mutation LinkStandaloneFormToDepartment($departmentId: ID!, $formId: ID!) {
    linkStandaloneFormToDepartment(
      departmentId: $departmentId
      formId: $formId
    ) {
      status
      message
      data {
        id
        name
        activeVersion {
          id
        }
      }
    }
  }
`;

export const UNLINK_STANDALONE_FORM_FROM_DEPARTMENT_MUTATION = gql`
  mutation UnlinkStandaloneFormFromDepartment(
    $departmentId: ID!
    $formId: ID!
  ) {
    unlinkStandaloneFormFromDepartment(
      departmentId: $departmentId
      formId: $formId
    ) {
      status
      message
      data
    }
  }
`;

export const SET_DEFAULT_STANDALONE_FORM_FOR_DEPARTMENT_MUTATION = gql`
  mutation SetDefaultStandaloneFormForDepartment(
    $departmentId: ID!
    $formId: ID!
  ) {
    setDefaultStandaloneFormForDepartment(
      departmentId: $departmentId
      formId: $formId
    ) {
      status
      message
      data {
        id
        name
      }
    }
  }
`;
