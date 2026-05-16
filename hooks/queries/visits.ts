import { gql } from '@apollo/client'

export const GET_VISIT_QUERY = gql`
  query GetVisit($id: ID!) {
    visit(visitId: $id) {
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
            defaultCoveragePercentage
          }
          insuranceCardNumber
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
          }
          status
          completedAt
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
            }
            quantity
            price
            status
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
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`

export const VISITS_QUERY = gql`
  query GetVisits($input: SearchVisitsInput!) {
    visits(input: $input) {
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
          primaryPhoneNumber
        }
        linkedInsurances {
          id
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
        }
      }
      pagination {
        total
        perPage
        currentPage
        totalPages
      }
    }
  }
`

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
`
