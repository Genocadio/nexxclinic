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
          patientSharePercentage
          patientShareCoverageId
          deactivated
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
      outstandingType
      outstandingReason
      items {
        id
        visitDepartmentProductId
        productId
        productName
        unitPriceSnapshot
        quantitySnapshot
        insuranceCoveredAmount
        patientPayableAmount
        appliedPatientSharePct
        patientShareSource
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
        version {
          id
          version
        }
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
        version {
          id
          version
        }
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
        version {
          id
          version
        }
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

// ── Bill Editing Mode ────────────────────────────────────────────────────────

export const START_BILL_EDITING_MUTATION = gql`
  mutation StartBillEditing($visitDepartmentId: ID!) {
    startBillEditing(visitDepartmentId: $visitDepartmentId) {
      status
      message
      data {
        visitDepartmentId
        status
      }
    }
  }
`;

export const COMPLETE_BILL_EDITING_MUTATION = gql`
  mutation CompleteBillEditing($visitDepartmentId: ID!) {
    completeBillEditing(visitDepartmentId: $visitDepartmentId) {
      status
      message
      data {
        visitDepartmentId
        status
      }
    }
  }
`;

export const CANCEL_BILL_EDITING_MUTATION = gql`
  mutation CancelBillEditing($visitDepartmentId: ID!, $addedProductIds: [ID!]) {
    cancelBillEditing(visitDepartmentId: $visitDepartmentId, addedProductIds: $addedProductIds) {
      status
      message
      data {
        visitDepartmentId
        status
      }
    }
  }
`;

export const UPDATE_BILLING_DATE_MUTATION = gql`
  mutation UpdateBillingDate($input: UpdateBillingDateInput!) {
    updateBillingDate(input: $input) {
      status
      message
      data {
        id
        billingDate
        totalAmount
      }
    }
  }
`;

export const QUICK_BILL_MUTATION = gql`
  mutation QuickBill($visitId: ID!) {
    quickBill(visitId: $visitId) {
      status
      message
    }
  }
`;
