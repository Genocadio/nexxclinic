import { gql } from "@apollo/client";

export const GET_PATIENTS_QUERY = gql`
  query SearchPatients($input: SearchPatientsInput) {
    searchPatients(input: $input) {
      status
      message
      data {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
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
        createdAt
      }
      pagination {
        total
        totalPages
      }
    }
  }
`;

export const GET_PATIENT_QUERY = gql`
  query GetPatient($patientId: ID!) {
    patient(patientId: $patientId) {
      status
      message
      data {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
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
        createdAt
      }
    }
    patientInsurances(patientId: $patientId) {
      status
      data {
        id
        insuranceCardNumber
        providingCompanyOrEmployer
          patientSharePercentage
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
  }
`;
