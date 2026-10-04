import { gql } from "@apollo/client";

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
    notPaid
    quantifiable
    insuranceCoverages {
      id
      insuranceProvider {
        id
        insuranceName
        acronym
        coverages {

                        id

                        insuranceProviderId

                        insuranceProviderName

                        departmentId

                        departmentName

                        encounterType

                        patientSharePercentage

                        createdAt

                        updatedAt

                      }
      }
      cost
      covered
      requireMedicalAdvisor
    }
  }
  quantity
  status
  source
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
`;

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
  addedBy {
    id
    firstName
    lastName
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
  answerId
  hasFinalizedConsultationAnswers
  hasBillableProducts
  createdAt
  updatedAt
`;

export const GET_VISIT_QUERY = gql`
  query GetVisit($id: ID!) {
    visit(visitId: $id) {
      status
      message

      data {
        id
        status
        visitDate
        createdAt
        patient {
          id
          firstName
          lastName
          middleName
          patientIdentifier
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
          patientSharePercentage
          patientShareCoverageId
          deactivated
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
              coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
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
            coverages {
              id
              insuranceProviderId
              insuranceProviderName
              departmentId
              departmentName
              encounterType
              patientSharePercentage
              createdAt
              updatedAt
            }
          }
          insuranceCardNumber
          patientSharePercentage
          patientShareCoverageId
          deactivated
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
          profile {
            id
            name
            isDefault
            products {
              id
              name
            }
          }
          startedAt
          completedAt
          addedBy {
            id
            firstName
            lastName
          }
          completedBy {
            id
            firstName
            lastName
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
          answerId
          hasFinalizedConsultationAnswers
          hasBillableProducts
          createdAt
          updatedAt
        }
        estimatedTotal
        estimatedInsurancePay
        estimatedPatientPay
        quickBillEligible
      }
    }
  }
`;

export const VISITS_QUERY = gql`
  query GetVisits($input: SearchVisitsInput!) {
    visits(input: $input) {
      status
      message

      data {
        id
        status
        visitDate
        createdAt
        patient {
          id
          firstName
          middleName
          lastName
          patientIdentifier
          gender
          dateOfBirth
          age
          primaryPhoneNumber
          alternativePhone
          village
          cell
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
            patientSharePercentage
            patientShareCoverageId
            deactivated
            principalMember
            principalMemberName
            principalMemberPhoneNumber
            insuranceProvider {
              id
              insuranceName
              acronym
              iconUrl
              coverages {
                id
                insuranceProviderId
                insuranceProviderName
                departmentId
                departmentName
                encounterType
                patientSharePercentage
                createdAt
                updatedAt
              }
            }
          }
        }
        linkedInsurances {
          id
          insuranceCardNumber
          providingCompanyOrEmployer
          principalMember
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
          startedAt
          completedAt
          addedBy {
            id
            firstName
            lastName
          }
          completedBy {
            id
            firstName
            lastName
          }
          processors {
            id
            firstName
            lastName
          }
          createdAt
          updatedAt
          answerId
          hasFinalizedConsultationAnswers
          billing {
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
              outstandingType
              outstandingReason
              billingDate
            }
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
              notPaid
              quantifiable
            }
            quantity
            status
            source
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
            confirmedBy {
              id
              firstName
              lastName
            }
            billingConfirmationStatus
            processor {
              id
              firstName
              lastName
            }
            billingItem {
              id
              unitPriceSnapshot
              quantitySnapshot
              insuranceCoveredAmount
              patientPayableAmount
              appliedPatientSharePct
            }
            createdAt
            updatedAt
          }
          childVisitDepartments {
            id
            status
            startedAt
            completedAt
            addedBy {
              id
              firstName
              lastName
            }
            completedBy {
              id
              firstName
              lastName
            }
            processors {
              id
              firstName
              lastName
            }
            billing {
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
                outstandingType
                outstandingReason
                billingDate
              }
            }
            createdAt
            updatedAt
            answerId
            hasFinalizedConsultationAnswers
            hasBillableProducts
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
                notPaid
                quantifiable
              }
              quantity
              status
              source
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
              confirmedBy {
                id
                firstName
                lastName
              }
              billingConfirmationStatus
              processor {
                id
                firstName
                lastName
              }
              billingItem {
                id
                unitPriceSnapshot
                quantitySnapshot
                insuranceCoveredAmount
                patientPayableAmount
                appliedPatientSharePct
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
        estimatedTotal
        estimatedInsurancePay
        estimatedPatientPay
        quickBillEligible
      }
      pagination {
        total
        perPage
        currentPage
        totalPages
      }
    }
  }
`;

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
          patientIdentifier
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
          startedAt
          completedAt
          answerId
          hasFinalizedConsultationAnswers
          hasBillableProducts
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
            status
            createdAt
          }
          createdAt
          updatedAt
        }
        estimatedTotal
        estimatedInsurancePay
        estimatedPatientPay
        quickBillEligible
      }
      pagination {
        total
        perPage
        currentPage
        totalPages
      }

    }
  }
`;

export const LAST_PATIENT_DEPARTMENT_VISIT_QUERY = gql`
  query LastPatientDepartmentVisit($visitId: ID!, $departmentId: ID!) {
    lastPatientDepartmentVisit(visitId: $visitId, departmentId: $departmentId) {
      status
      message
      data {
        lastVisit {
          id
          status
          visitDate
          patient {
            id
            firstName
            lastName
            middleName
            patientIdentifier
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
            startedAt
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
              status
              createdAt
            }            createdAt
            updatedAt
            answerId
            hasFinalizedConsultationAnswers
            hasBillableProducts
          }
          estimatedTotal
          estimatedInsurancePay
          estimatedPatientPay
          quickBillEligible

        }
        lastDepartmentVisit {
          visitId
          visitDepartment {
            id
            department {
              id
              name
            }
            status
            startedAt
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
              status
              createdAt
            }
            createdAt
            updatedAt
            answerId
          }
        }
      }
    }
  }
`;

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
`;

export const VISIT_DEPARTMENT_NOTES_QUERY = gql`
  query GetVisitDepartmentNotes($visitId: ID!, $visitDepartmentId: ID) {
    visitDepartmentNotes(
      visitId: $visitId
      visitDepartmentId: $visitDepartmentId
    ) {
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
        noteType
        viewed
        createdAt
      }
    }
  }
`;
