import { gql } from '@apollo/client'

export const GET_BILL_BY_VISIT_QUERY = gql`
  query GetVisitBilling($visitId: ID!) {
    visitBilling(visitId: $visitId) {
      status
      message
      data {
        id
        visitId
        departments {
          id
          status
          totalAmount
          insuranceCoveredAmount
          patientPayableAmount
          paidAmount
          outstandingAmount
          insuranceBillings {
            id
            status
            totalAmount
            insuranceCoveredAmount
            patientPayableAmount
            paidAmount
            outstandingAmount
            invoiceUrl
            items {
              id
              visitDepartmentProductId
              productId
              productName
              unitPriceSnapshot
              quantitySnapshot
              insuranceCoveredAmount
              patientPayableAmount
            }
          }
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`

export const GET_INVOICE_QUERY = gql`
  query GetInvoice($departmentInsuranceBillingId: ID!) {
    getInvoice(departmentInsuranceBillingId: $departmentInsuranceBillingId) {
      status
      message
      data {
        invoiceUrl
      }
    }
  }
`

