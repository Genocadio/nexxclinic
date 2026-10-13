import { useQuery } from "@apollo/client"
import { GET_CLINIC_REPORTS } from "@/hooks/queries/reports"
import type { ReportPeriod } from "@/lib/user-reports-calculator"

export interface ClinicReportsOverview {
  totalPatients: number
  totalVisits: number
  maleCount: number
  femaleCount: number
  otherGenderCount: number
  averageAge: number
  ageBrackets: {
    under18: number
    adults18to50: number
    seniors50plus: number
  }
  peakActivityHour: string
  totalGrossBilled: number
  insuranceCoveredAmount: number
  patientShareAmount: number
  patientCashCollected: number
  patientLoanAmount: number
  giveawayAmount: number
  waiverAmount: number
  pendingBillingAmount: number
  outstandingBalance: number
  loanCount: number
  giveawayCount: number
  waiverCount: number
  pendingBillingCount: number
  settlementRatePct: number
}

export interface ClinicReportsWaiver {
  id: string
  patientName: string
  patientIdentifier: string
  departmentName: string
  clinicianName: string
  amount: number
  waiverType: "FULL" | "PATIENT_SHARE" | string
  productName: string
  reason: string
  date: string
}

export interface ClinicReportsGiveaway {
  id: string
  patientName: string
  patientIdentifier: string
  departmentName: string
  clinicianName: string
  amount: number
  productName: string
  reason: string
  date: string
}

export interface ClinicReportsAdjustment {
  id: string
  patientName: string
  patientIdentifier: string
  departmentName: string
  clinicianName: string
  productName: string
  originalPrice: number
  adjustedPrice: number
  difference: number
  reason: string
  date: string
}

export interface ClinicReportsLoan {
  id: string
  patientName: string
  patientIdentifier: string
  patientPhone: string
  departmentName: string
  clinicianName: string
  totalBilled: number
  paidAmount: number
  outstandingAmount: number
  reason: string
  status: "PARTIALLY_PAID" | "UNPAID" | string
  date: string
}

export interface ClinicReportsDepartmentBreakdown {
  departmentId: string
  name: string
  gross: number
  insurance: number
  patientPaid: number
  loans: number
  giveaways: number
  waivers: number
  pending: number
  visitsCount: number
}

export interface ClinicReportsClinicianBreakdown {
  clinicianId: string
  name: string
  consultationsCount: number
  gross: number
  insurance: number
  patientPaid: number
  pending: number
  waivers: number
}

export interface ClinicReportsInsuranceBreakdown {
  id?: string
  name: string
  totalAmount: number
  insuranceCovered: number
  patientPaid: number
  outstanding: number
}

export interface ClinicDiagnosticRecord {
  id: string
  diagnosisName: string
  icd11Code?: string
  type: "HYPOTHESIS" | "FINAL" | string
  notes?: string
  patientId: string
  patientName: string
  patientGender?: string
  patientAge?: number | null
  departmentId: string
  departmentName: string
  clinicianId: string
  clinicianName: string
  date: string
  symptoms: string[]
  medications: string[]
}

export interface ClinicReportsData {
  period: string
  fromDate: string
  toDate: string
  overview: ClinicReportsOverview
  financialBreakdown: {
    momoCollected: number
    cashCollected: number
    cardCollected: number
    bankTransferCollected: number
    otherCollected: number
    paymentModesBreakdown: Record<string, { amount: number; count: number }>
    insuranceBreakdown: ClinicReportsInsuranceBreakdown[]
    categoryBreakdown: Record<string, { count: number; totalAmount: number }>
    departmentBreakdown: ClinicReportsDepartmentBreakdown[]
    clinicianBreakdown: ClinicReportsClinicianBreakdown[]
    moneyTimeline: Array<{
      label: string
      rawKey: string
      gross: number
      collected: number
      insurance: number
      loan: number
      giveaway: number
      waiver: number
    }>
  }
  deepReports: {
    waivers: ClinicReportsWaiver[]
    giveaways: ClinicReportsGiveaway[]
    adjustments: ClinicReportsAdjustment[]
    loans: ClinicReportsLoan[]
    diagnosticReports?: ClinicDiagnosticRecord[]
  }
  diagnosticReports?: ClinicDiagnosticRecord[]
}

export interface UseClinicReportsOptions {
  fromDate?: string
  toDate?: string
  period?: ReportPeriod
  departmentId?: string
  departmentIds?: string[]
  clinicianId?: string
  clinicianIds?: string[]
  insuranceId?: string
  insuranceIds?: string[]
  isPrivateOnly?: boolean
  skip?: boolean
}

export function useClinicReports(options?: UseClinicReportsOptions) {
  const { data, loading, error, refetch } = useQuery(GET_CLINIC_REPORTS, {
    variables: {
      fromDate: options?.fromDate,
      toDate: options?.toDate,
      period: options?.period,
      departmentId: options?.departmentId || null,
      departmentIds: options?.departmentIds && options.departmentIds.length > 0 ? options.departmentIds : null,
      clinicianId: options?.clinicianId || null,
      clinicianIds: options?.clinicianIds && options.clinicianIds.length > 0 ? options.clinicianIds : null,
      insuranceId: options?.insuranceId || null,
      insuranceIds: options?.insuranceIds && options.insuranceIds.length > 0 ? options.insuranceIds : null,
      isPrivateOnly: options?.isPrivateOnly ?? null,
    },
    skip: options?.skip,
    fetchPolicy: "network-only",
  })

  const rawData = data?.getClinicReports?.data
  const reportData: ClinicReportsData | null = rawData ? (rawData as ClinicReportsData) : null
  const status = data?.getClinicReports?.status
  const message = data?.getClinicReports?.message

  return {
    reportData,
    loading,
    error,
    status,
    message,
    refetch,
  }
}
