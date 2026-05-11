import { gql } from '@apollo/client'

export const CREATE_BILL_MUTATION = gql`
  mutation CreateBill($visitId: ID!) {
    createBill(visitId: $visitId) {
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

export const GENERATE_INVOICE_MUTATION = gql`
  mutation GenerateInvoice($billId: ID!) {
    generateInvoice(billId: $billId) {
      status
      message
      
      data {
        invoiceUrl
      }
    }
  }
`
