import { gql } from "@apollo/client";

export const VISIT_DEPARTMENT_BILLING_FRAGMENT = gql`
  fragment VisitDepartmentBillingFields on VisitDepartmentBilling {
    id
    visitDepartment {
      id
      status
      department {
        id
        name
      }
    }
    status
    totalAmount
    insuranceCoveredAmount
    patientPayableAmount
    paidAmount
    outstandingAmount
    payments {
      id
      amount
      paymentMethod
      reference
      createdAt
      updatedAt
    }
    insuranceBillings {
      id
      patientInsurance {
        id
        insuranceCardNumber
        principalMemberName
        insuranceProvider {
          id
          insuranceName
          acronym
        }
      }
      status
      totalAmount
      insuranceCoveredAmount
      patientPayableAmount
      paidAmount
      outstandingAmount
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
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
`;

export const CREATE_BILL_MUTATION = gql`
  mutation BillVisit($input: BillVisitInput!) {
    billVisit(input: $input) {
      status
      message
      data {
        id
        visitId
        departments {
          ...VisitDepartmentBillingFields
        }
        createdAt
        updatedAt
      }
    }
  }
  ${VISIT_DEPARTMENT_BILLING_FRAGMENT}
`;

export const EDIT_BILL_MUTATION = gql`
  mutation EditBillVisit($input: EditBillVisitInput!) {
    editBillVisit(input: $input) {
      status
      message
      data {
        id
        visitId
        departments {
          ...VisitDepartmentBillingFields
        }
        createdAt
        updatedAt
      }
    }
  }
  ${VISIT_DEPARTMENT_BILLING_FRAGMENT}
`;

export const RECORD_VISIT_BILLING_PAYMENT_MUTATION = gql`
  mutation RecordVisitBillingPayment($input: RecordVisitBillingPaymentInput!) {
    recordVisitBillingPayment(input: $input) {
      status
      message
      data {
        id
        visitId
        departments {
          ...VisitDepartmentBillingFields
        }
        createdAt
        updatedAt
      }
    }
  }
  ${VISIT_DEPARTMENT_BILLING_FRAGMENT}
`;

export const GENERATE_INVOICE_MUTATION = gql`
  mutation GenerateInvoice($departmentInsuranceBillingId: ID!) {
    generateInvoice(
      departmentInsuranceBillingId: $departmentInsuranceBillingId
    ) {
      status
      message
      data {
        signedUrl
      }
    }
  }
`;
