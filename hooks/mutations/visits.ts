import { gql } from '@apollo/client'

export const CREATE_VISIT_MUTATION = gql`
  mutation CreateVisit($input: CreateVisitInput!) {
    createVisit(input: $input) {
      status
      message
      
      data {
        id
        visitDate
        visitStatus
        billingStatus
        patient {
          id
          firstName
          lastName
        }
        createdAt
        updatedAt
      }
    }
  }
`

export const ADD_VISIT_NOTE_MUTATION = gql`
  mutation AddVisitNote($visitId: ID!, $note: String!) {
    addVisitNote(visitId: $visitId, note: $note) {
      status
      message
      
      data {
        id
        note
        createdBy {
          id
          firstName
          lastName
          email
        }
        createdAt
      }
    }
  }
`

export const ADD_DEPARTMENT_NOTE_MUTATION = gql`
  mutation AddDepartmentNote($visitId: ID!, $departmentId: ID!, $note: String!) {
    addDepartmentNote(visitId: $visitId, departmentId: $departmentId, note: $note) {
      status
      message
      
      data {
        id
        note
        createdBy {
          id
          firstName
          lastName
          email
        }
        createdAt
      }
    }
  }
`

export const UPSERT_CONSULTATION_ANSWERS_MUTATION = gql`
  mutation UpsertConsultationAnswers($input: ConsultationAnswersInput!) {
    upsertConsultationAnswers(input: $input) {
      status
      message
      errors {
        field
        message
        code
      }
      
      data {
        id
        consultationId
        answers
        status
        createdAt
        updatedAt
      }
    }
  }
`

export const GENERATE_CONSULTATION_PDF_MUTATION = gql`
  mutation GenerateConsultationPdf($consultationId: ID!, $departmentId: ID!) {
    generateConsultationPdf(consultationId: $consultationId, departmentId: $departmentId) {
      status
      message
      errors {
        field
        message
        code
      }
      
      data {
        pdfUrl
      }
    }
  }
`

export const PROCESS_VISIT_DEPARTMENT_MUTATION = gql`
  mutation ProcessVisitDepartment($visitId: ID!, $departmentId: ID!) {
    processVisitDepartment(visitId: $visitId, departmentId: $departmentId) {
      status
      message
      errors {
        field
        message
        code
      }
      
      data {
        id
        status
        transferTime
        completedTime
      }
    }
  }
`

export const ADD_PRODUCT_TO_VISIT_DEPARTMENT_MUTATION = gql`
  mutation AddVisitDepartmentProduct($input: CreateVisitDepartmentProductInput!) {
    addVisitDepartmentProduct(input: $input) {
      status
      message
      
      data {
        id
        departments {
          id
          department {
            id
            name
          }
          status
          products {
            id
            product {
              id
              name
              type
            }
            quantity
            price
            status
            addedBy {
              id
              firstName
              lastName
              email
            }
          }
        }
      }
    }
  }
`

export const COMPLETE_VISIT_DEPARTMENT_MUTATION = gql`
  mutation CompleteVisitDepartment($visitId: ID!, $departmentId: ID!) {
    completeVisitDepartment(visitId: $visitId, departmentId: $departmentId) {
      status
      message
      
      data {
        id
        status
        completedTime
      }
    }
  }
`

export const UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION = gql`
  mutation UpdateVisitDepartmentStatus($input: UpdateVisitDepartmentStatusInput!) {
    updateVisitDepartmentStatus(input: $input) {
      status
      message
      
      data {
        id
        departments {
          id
          status
        }
      }
    }
  }
`

export const ADD_DEPARTMENT_TO_VISIT_MUTATION = gql`
  mutation AddDepartmentToVisit($visitId: ID!, $departmentId: ID!) {
    addDepartmentToVisit(visitId: $visitId, departmentId: $departmentId) {
      status
      message
      
      data {
        id
        visit {
          id
          visitDate
        }
        department {
          id
          name
        }
        status
      }
    }
  }
`

export const ADD_INSURANCE_TO_VISIT_MUTATION = gql`
  mutation AddInsuranceToVisit($visitId: ID!, $insuranceId: ID!) {
    addInsuranceToVisit(visitId: $visitId, insuranceId: $insuranceId) {
      status
      message
      
      data {
        id
        visit {
          id
        }
        insurance {
          id
          name
        }
      }
    }
  }
`

export const UPDATE_VISIT_DEPARTMENT_PRODUCT_QUANTITY_MUTATION = gql`
  mutation UpdateVisitDepartmentProductQuantity($input: UpdateVisitDepartmentProductQuantityInput!) {
    updateVisitDepartmentProductQuantity(input: $input) {
      status
      message
      
      data {
        id
        departments {
          id
          status
          products {
            id
            product {
              id
              name
              type
            }
            quantity
            price
            status
          }
        }
      }
    }
  }
`

export const UPDATE_VISIT_DEPARTMENT_PRODUCT_STATUS_MUTATION = gql`
  mutation UpdateVisitDepartmentProductStatus($input: UpdateVisitDepartmentProductStatusInput!) {
    updateVisitDepartmentProductStatus(input: $input) {
      status
      message
      
      data {
        id
        departments {
          id
          status
          products {
            id
            product {
              id
              name
              type
            }
            quantity
            price
            status
          }
        }
      }
    }
  }
`

export const REMOVE_ACTION_FROM_VISIT_DEPARTMENT_MUTATION = gql`
  mutation RemoveActionFromVisitDepartment($visitId: ID!, $departmentId: ID!, $itemId: ID!) {
    removeActionFromVisitDepartment(input: { visitId: $visitId, departmentId: $departmentId, itemId: $itemId }) {
      status
      data {
        id
        departments {
          id
          status
          actions { id action { id name type privatePrice } quantity }
          consumables { id consumable { id name type privatePrice } quantity }
        }
      }
      messages { text type }
    }
  }
`

export const REMOVE_CONSUMABLE_FROM_VISIT_DEPARTMENT_MUTATION = gql`
  mutation RemoveConsumableFromVisitDepartment($visitId: ID!, $departmentId: ID!, $itemId: ID!) {
    removeConsumableFromVisitDepartment(input: { visitId: $visitId, departmentId: $departmentId, itemId: $itemId }) {
      status
      data {
        id
        departments {
          id
          status
          actions { id action { id name type privatePrice } quantity }
          consumables { id consumable { id name type privatePrice } quantity }
        }
      }
      messages { text type }
    }
  }
`

export const UPDATE_ACTION_QUANTITY_MUTATION = gql`
  mutation UpdateActionQuantity($visitId: ID!, $departmentId: ID!, $itemId: ID!, $quantity: Int!) {
    updateActionQuantity(input: { visitId: $visitId, departmentId: $departmentId, itemId: $itemId, quantity: $quantity }) {
      status
      data {
        id
        departments {
          id
          status
          actions { id action { id name type privatePrice } quantity }
          consumables { id consumable { id name type privatePrice } quantity }
        }
      }
      messages { text type }
    }
  }
`

export const UPDATE_CONSUMABLE_QUANTITY_MUTATION = gql`
  mutation UpdateConsumableQuantity($visitId: ID!, $departmentId: ID!, $itemId: ID!, $quantity: Int!) {
    updateConsumableQuantity(input: { visitId: $visitId, departmentId: $departmentId, itemId: $itemId, quantity: $quantity }) {
      status
      data {
        id
        departments {
          id
          status
          actions { id action { id name type privatePrice } quantity }
          consumables { id consumable { id name type privatePrice } quantity }
        }
      }
      messages { text type }
    }
  }
`
