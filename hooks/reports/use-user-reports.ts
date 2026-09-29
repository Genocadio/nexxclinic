import { useQuery } from "@apollo/client"
import { GET_USER_REPORTS } from "@/hooks/queries/reports"
import type { UserReportsData, ReportPeriod } from "@/lib/user-reports-calculator"

export interface UseUserReportsOptions {
  fromDate?: string
  toDate?: string
  period?: ReportPeriod
  workerId?: string
  skip?: boolean
}

export function useUserReports(options?: UseUserReportsOptions) {
  const { data, loading, error, refetch } = useQuery(GET_USER_REPORTS, {
    variables: {
      fromDate: options?.fromDate,
      toDate: options?.toDate,
      period: options?.period,
      workerId: options?.workerId,
    },
    skip: options?.skip,
    fetchPolicy: "network-only",
  })

  const rawData = data?.getUserReports?.data
  const reportData: UserReportsData | null = rawData ? (rawData as UserReportsData) : null
  const status = data?.getUserReports?.status
  const message = data?.getUserReports?.message

  return {
    reportData,
    loading,
    error,
    status,
    message,
    refetch,
  }
}
