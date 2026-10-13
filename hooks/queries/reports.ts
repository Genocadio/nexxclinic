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

export const GET_CLINIC_REPORTS = gql`
  query GetClinicReports(
    $fromDate: String
    $toDate: String
    $period: String
    $departmentId: ID
    $departmentIds: [ID]
    $clinicianId: ID
    $clinicianIds: [ID]
    $insuranceId: ID
    $insuranceIds: [ID]
    $isPrivateOnly: Boolean
  ) {
    getClinicReports(
      fromDate: $fromDate
      toDate: $toDate
      period: $period
      departmentId: $departmentId
      departmentIds: $departmentIds
      clinicianId: $clinicianId
      clinicianIds: $clinicianIds
      insuranceId: $insuranceId
      insuranceIds: $insuranceIds
      isPrivateOnly: $isPrivateOnly
    ) {
      status
      message
      data
    }
  }
`
