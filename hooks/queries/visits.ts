import { gql } from '@apollo/client'

/** Product line items on a visit department (parent or child). */
const visitDepartmentProductFields = `
  id
  product {
    id
    name
    code
    type
    unit
    privateRhicPrice
    clinicPrice
    insuranceCoverages {
      id
      insuranceProvider {
        id
        insuranceName
        acronym
        defaultCoveragePercentage
      }
      cost
      covered
      requireMedicalAdvisor
    }
  }
  quantity
  price
  status
  addedBy {
    id
    firstName
    lastName
  }
  billedBy {
    id
    firstName
    lastName
  }
  processor {
    id
    firstName
    lastName
  }
  createdAt
  updatedAt
`

/** Nested visit department (child of a consultation department). */
const childVisitDepartmentFields = `
  id
  status
  completedAt
  department {
    id
    name
    requestsProducts
  }
  processors {
    id
    firstName
    lastName
  }
  diagnostics {
    id
    diagnosisName
    icd11Code
    createdAt
  }
  medications {
    id
    medicationName
    instructions
    createdAt
  }
  products {
    ${visitDepartmentProductFields}
  }
  createdAt
  updatedAt
`

export const GET_VISIT_QUERY = gql`
  query GetVisit($id: ID!) {
    visit(visitId: $id) {
      status
      message
      
      data {
        id
        status
        visitDate
        patient {
          id
          firstName
          lastName
          middleName
          gender
          dateOfBirth
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
          patientInsurances {
            id
            insuranceCardNumber
            providingCompanyOrEmployer
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
        linkedInsurances {
          id
          patient {
            id
            firstName
            lastName
          }
          insuranceProvider {
            id
            insuranceName
            acronym
            defaultCoveragePercentage
          }
          insuranceCardNumber
          providingCompanyOrEmployer
          principalMember
          principalMemberName
          principalMemberPhoneNumber
          validFrom
          validUntil
        }
        departments {
          id
          department {
            id
            name
            insurancePolicyMode
            requestsProducts
          }
          status
          completedAt
          processors {
            id
            firstName
            lastName
          }
          diagnostics {
            id
            diagnosisName
            icd11Code
            createdAt
          }
          medications {
            id
            medicationName
            instructions
            createdAt
          }
          products {
            ${visitDepartmentProductFields}
          }
          childVisitDepartments {
            ${childVisitDepartmentFields}
          }
          preInstructions {
            id
            type
            note
            createdAt
            addedBy {
              id
              firstName
              lastName
            }
          }
          notes {
            totalNotes
            newNotes
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`

export const VISITS_QUERY = gql`
  query GetVisits($input: SearchVisitsInput!) {
    visits(input: $input) {
      status
      message
      
      data {
        id
        status
        visitDate
        patient {
          id
          firstName
          lastName
          primaryPhoneNumber
        }
        linkedInsurances {
          id
          insuranceProvider {
            id
            insuranceName
            acronym
          }
        }
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
              code
              type
              unit
              privateRhicPrice
              clinicPrice
            }
            quantity
            price
            status
            addedBy {
              id
              firstName
              lastName
            }
            billedBy {
              id
              firstName
              lastName
            }
            createdAt
            updatedAt
          }
          childVisitDepartments {
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
                unit
                privateRhicPrice
                clinicPrice
              }
              quantity
              price
              status
              addedBy {
                id
                firstName
                lastName
              }
              billedBy {
                id
                firstName
                lastName
              }
              createdAt
              updatedAt
            }
          }
          notes {
            totalNotes
            newNotes
          }
        }
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

export const GET_PATIENT_HISTORY_QUERY = gql`
  query GetPatientHistory($patientId: ID!, $input: SearchPatientHistoryInput!) {
    getPatientHistory(patientId: $patientId, input: $input) {
      status
      message
      
      data {
        id
        status
        visitDate
        patient {
          id
          firstName
          lastName
          middleName
          dateOfBirth
          gender
        }
        departments {
          id
          department {
            id
            name
          }
          status
          completedAt
          diagnostics {
            id
            diagnosisName
            icd11Code
            createdAt
          }
          medications {
            id
            medicationName
            instructions
            createdAt
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
            createdAt
          }
          createdAt
          updatedAt
        }
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

export const DASHBOARD_STATS_QUERY = gql`
  query DashboardStats($days: Int!) {
    dashboardStats(days: $days) {
      status
      message
      
      data {
        totalVisits
        completedVisits
        inProgressVisits
        totalRevenue
      }
    }
  }
`

export const VISIT_DEPARTMENT_NOTES_QUERY = gql`
  query GetVisitDepartmentNotes($visitId: ID!, $visitDepartmentId: ID!) {
    visitDepartmentNotes(visitId: $visitId, visitDepartmentId: $visitDepartmentId) {
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
