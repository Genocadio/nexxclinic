import { gql } from "@apollo/client";

export const GET_BILL_BY_VISIT_QUERY = gql`
  query GetVisitBilling($visitId: ID!) {
    visitBilling(visitId: $visitId) {
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
        createdAt
        updatedAt
      }
    }
  }
`;

