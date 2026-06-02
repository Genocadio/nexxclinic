import { gql } from '@apollo/client'

export const CREATE_BILL_MUTATION = gql`
  mutation BillVisit($input: BillVisitInput!) {
    billVisit(input: $input) {
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
        }
      }
    }
  }
`

export const GENERATE_INVOICE_MUTATION = gql`
  mutation GenerateInvoice($departmentInsuranceBillingId: ID!) {
    generateInvoice(departmentInsuranceBillingId: $departmentInsuranceBillingId) {
      status
      message
      data {
        invoiceUrl
      }
    }
  }
`
