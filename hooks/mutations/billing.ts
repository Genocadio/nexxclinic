import { gql } from '@apollo/client'

export const CREATE_BILL_MUTATION = gql`
  mutation BillVisit($input: BillVisitInput!) {
    billVisit(input: $input) {
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
        }
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
