import { gql } from '@apollo/client'

export const GET_BILL_BY_VISIT_QUERY = gql`
  query GetVisitBillings($visitId: ID!) {
    visitBillings(visitId: $visitId) {
      status
      message
      
      data {
        id
        visitId
        status
        billingDate
        totalAmount
        insuranceCoveredAmount
        patientPayableAmount
        paidAmount
        outstandingAmount
        fullyBilledVisit
        billedBy {
          id
          firstName
          lastName
        }
        items {
          id
          visitDepartmentProductId
          productId
          productName
          unitPriceSnapshot
          quantitySnapshot
          lineTotal
          insuranceCoveredAmount
          patientPayableAmount
          appliedPatientInsuranceId
          createdAt
          updatedAt
        }
      }
    }
  }
`
