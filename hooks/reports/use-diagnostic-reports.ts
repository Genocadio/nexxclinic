import { useQuery } from "@apollo/client"
import { GET_DIAGNOSTIC_REPORTS } from "@/hooks/queries/reports"
import type { ReportPeriod } from "@/lib/user-reports-calculator"
import type { ClinicDiagnosticRecord, ClinicReportsData } from "@/hooks/reports/use-clinic-reports"

export interface DiagnosticReportsData {
  period: string
  fromDate: string
  toDate: string
  diagnosticReports: ClinicDiagnosticRecord[]
}

export interface UseDiagnosticReportsOptions {
  fromDate?: string
  toDate?: string
  period?: ReportPeriod
  departmentId?: string
  departmentIds?: string[]
  clinicianId?: string
  clinicianIds?: string[]
  skip?: boolean
}

export function useDiagnosticReports(options?: UseDiagnosticReportsOptions) {
  const { data, loading, error, refetch } = useQuery(GET_DIAGNOSTIC_REPORTS, {
    variables: {
      fromDate: options?.fromDate,
      toDate: options?.toDate,
      period: options?.period,
      departmentId: options?.departmentId || null,
      departmentIds:
        options?.departmentIds && options.departmentIds.length > 0
          ? options.departmentIds
          : null,
      clinicianId: options?.clinicianId || null,
      clinicianIds:
        options?.clinicianIds && options.clinicianIds.length > 0
          ? options.clinicianIds
          : null,
    },
    skip: options?.skip,
    fetchPolicy: "network-only",
  })

  const rawData = data?.getDiagnosticReports?.data
  const reportData: DiagnosticReportsData | null = rawData
    ? (rawData as DiagnosticReportsData)
    : null
  const status = data?.getDiagnosticReports?.status
  const message = data?.getDiagnosticReports?.message

  return {
    reportData,
    loading,
    error,
    status,
    message,
    refetch,
  }
}
