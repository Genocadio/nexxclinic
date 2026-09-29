import { gql } from "@apollo/client"

export const GET_USER_REPORTS = gql`
  query GetUserReports(
    $fromDate: String
    $toDate: String
    $period: String
    $workerId: ID
  ) {
    getUserReports(
      fromDate: $fromDate
      toDate: $toDate
      period: $period
      workerId: $workerId
    ) {
      status
      message
      data
    }
  }
`
