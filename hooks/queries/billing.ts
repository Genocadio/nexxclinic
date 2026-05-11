import { gql } from '@apollo/client'

export const GET_BILL_BY_VISIT_QUERY = gql`
  query GetBillByVisit($visitId: ID!) {
    getBillByVisit(visitId: $visitId) {
      status
      message
      
      data {
        id
        visitId
        totalAmount
        paidAmount
        status
        items {
          id
          name
          type
          quantity
          unitPrice
          totalPrice
        }
        createdAt
        updatedAt
      }
    }
  }
`
