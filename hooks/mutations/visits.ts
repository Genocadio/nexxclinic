import { gql } from '@apollo/client'

export const CREATE_VISIT_MUTATION = gql`
  mutation CreateVisit($input: CreateVisitInput!) {
    createVisit(input: $input) {
      status
      message
      
      data {
        id
        visitDate
        status
        patient {
          id
          firstName
          lastName
        }
        linkedInsurances {
          id
          insuranceProvider {
            id
            insuranceName
            acronym
            defaultCoveragePercentage
          }
        }
        departments {
          id
          department {
            id
            name
          }
        }
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

export const ADD_VISIT_VITAL_SIGNS_MUTATION = gql`
  mutation AddVisitVitalSigns($input: AddVisitVitalSignsInput!) {
    addVisitVitalSigns(input: $input) {
      status
      message

      data {
        id
        visitDate
        status
        patient {
          id
          firstName
          lastName
        }
        vitalSigns {
          id
          createdAt
          addedBy {
            id
            firstName
            lastName
          }
          measurements {
            id
            measurementName
            value
            unit
            createdAt
          }
        }
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

export const ADD_CHILD_VISIT_DEPARTMENT_MUTATION = gql`
  mutation AddChildVisitDepartment($input: AddChildVisitDepartmentInput!) {
    addChildVisitDepartment(input: $input) {
      status
      message
      data {
        id
        status
        completedAt
        department {
          id
          name
        }
        products {
          id
          product {
            id
            name
            code
            type
          }
          quantity
          price
          status
        }
        createdAt
        updatedAt
      }
    }
  }
`

export const ADD_DIAGNOSIS_MUTATION = gql`
  mutation AddDiagnosis($input: AddDiagnosisInput!) {
    addDiagnosis(input: $input) {
      status
      message
      data {
        id
        status
        completedAt
        updatedAt
        department {
          id
          name
        }
        diagnostics {
          id
          diagnosisName
          icd11Code
          createdAt
        }
      }
    }
  }
`

export const ADD_MEDICATION_MUTATION = gql`
  mutation AddMedication($input: AddMedicationInput!) {
    addMedication(input: $input) {
      status
      message
      data {
        id
        status
        completedAt
        updatedAt
        department {
          id
          name
        }
        medications {
          id
          medicationName
          instructions
          createdAt
        }
      }
    }
  }
`

export const UPSERT_CONSULTATION_ANSWERS_MUTATION = gql`
  mutation UpsertConsultationAnswers($input: ConsultationAnswersInput!) {
    upsertConsultationAnswers(input: $input) {
      status
      message
      data {
        id
        consultationId
        visitId
        patientId
        departmentId
        status
        answers
        submittedAt
        updatedAt
        dedicatedForm {
          id
          version
        }
      }
    }
  }
`

export const GENERATE_CONSULTATION_PDF_MUTATION = gql`
  mutation GenerateConsultationPdf($consultationId: ID!, $departmentId: ID!) {
    generateConsultationPdf(consultationId: $consultationId, departmentId: $departmentId) {
      status
      message
      data {
        pdfBase64
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
        status
        completedAt
        updatedAt
        department {
          id
          name
        }
      }
    }
  }
`

export const ADD_DEPARTMENT_TO_VISIT_MUTATION = gql`
  mutation AddDepartmentToVisit($visitId: ID!, $departmentId: ID!) {
    addVisitDepartment(visitId: $visitId, departmentId: $departmentId) {
      status
      message
      data {
        id
        patient {
          id
          firstName
          lastName
        }
        departments {
          id
          department {
            id
            name
          }
          status
        }
      }
    }
  }
`

export const LINK_VISIT_INSURANCES_MUTATION = gql`
  mutation LinkVisitInsurances($visitId: ID!, $insuranceIds: [ID!]!) {
    linkVisitInsurances(visitId: $visitId, insuranceIds: $insuranceIds) {
      status
      message
      data {
        id
        linkedInsurances {
          id
          insuranceCardNumber
          principalMember
          principalMemberName
          principalMemberPhoneNumber
          validFrom
          validUntil
          insuranceProvider {
            id
            insuranceName
            acronym
            defaultCoveragePercentage
          }
        }
      }
    }
  }
`

export const UNLINK_VISIT_INSURANCES_MUTATION = gql`
  mutation UnlinkVisitInsurances($visitId: ID!, $insuranceIds: [ID!]!) {
    unlinkVisitInsurances(visitId: $visitId, insuranceIds: $insuranceIds) {
      status
      message
      data {
        id
        linkedInsurances {
          id
          insuranceCardNumber
          principalMember
          principalMemberName
          principalMemberPhoneNumber
          validFrom
          validUntil
          insuranceProvider {
            id
            insuranceName
            acronym
            defaultCoveragePercentage
          }
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
        }
      }
    }
  }
`

export const REMOVE_VISIT_DEPARTMENT_PRODUCT_MUTATION = gql`
  mutation RemoveVisitDepartmentProduct($visitDepartmentProductId: ID!) {
    removeVisitDepartmentProduct(visitDepartmentProductId: $visitDepartmentProductId) {
      status
      message
      data {
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

export const COMPLETE_VISIT_MUTATION = gql`
  mutation CompleteVisit($visitId: ID!) {
    completeVisit(visitId: $visitId) {
      status
      message
      data {
        id
        status
      }
    }
  }
`

export const COMPLETE_CONSULTATION_VISIT_MUTATION = gql`
  mutation CompleteConsultationVisit($input: ConsultationAnswersInput!, $final: Boolean!) {
    completeConsultationVisit(input: $input, final: $final) {
      status
      message
      data {
        id
        visitDate
        status
        patient {
          id
          firstName
          lastName
        }
        departments {
          id
          department {
            id
            name
          }
          status
        }
      }
    }
  }
`

export const ADD_VISIT_DEPARTMENT_NOTE_MUTATION = gql`
  mutation AddVisitDepartmentNote($input: AddVisitDepartmentNoteInput!) {
    addVisitDepartmentNote(input: $input) {
      status
      message
      data {
        id
        visitDepartmentId
        content
        createdBy {
          id
          firstName
          lastName
        }
        viewed
        createdAt
      }
    }
  }
`

export const MARK_VISIT_DEPARTMENT_NOTE_VIEWED_MUTATION = gql`
  mutation MarkVisitDepartmentNoteViewed($noteId: ID!) {
    markVisitDepartmentNoteViewed(noteId: $noteId) {
      status
      message
      data {
        id
        visitDepartmentId
        content
        createdBy {
          id
          firstName
          lastName
        }
        viewed
        createdAt
      }
    }
  }
`

export const MARK_VISIT_DEPARTMENT_NOTES_VIEWED_MUTATION = gql`
  mutation MarkVisitDepartmentNotesViewed($visitDepartmentId: ID!) {
    markVisitDepartmentNotesViewed(visitDepartmentId: $visitDepartmentId) {
      status
      message
      data {
        totalNotes
        newNotes
      }
    }
  }
`
