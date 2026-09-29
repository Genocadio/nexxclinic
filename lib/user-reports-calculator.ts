import type { Visit, Worker, RoleName, VisitDepartment } from "@/lib/api-types"

export type ReportPeriod = "today" | "week" | "month" | "custom"

export interface UserActivityItem {
  id: string
  timestamp: string
  role: "RECEPTION" | "CLINICIAN" | "NURSE" | "FINANCE" | "MANAGER" | "ADMIN" | "GENERAL"
  actionType: string
  patientName: string
  patientId: string
  patientIdentifier?: string | null
  departmentName?: string
  details: string
  amount?: number | null
  status?: string
}

export interface InsuranceMoneySummary {
  insuranceName: string
  totalAmount: number
  insuranceCovered: number
  patientShare: number
  paidAmount: number
  loanAmount: number
  giveawayAmount: number
  count: number
}

export interface DepartmentMoneySummary {
  departmentId: string
  departmentName: string
  totalAmount: number
  insuranceCovered: number
  patientShare: number
  paidAmount: number
  loanAmount: number
  giveawayAmount: number
  encountersCount: number
}

export interface ClinicianProductTurnoverItem {
  id: string
  productId: string
  productName: string
  productCode?: string | null
  productType: string
  quantity: number
  unitPrice: number
  lineTotal: number
  insuranceCoveredAmount: number
  patientPayableAmount: number
  status: string
  patientName: string
  patientId: string
  patientIdentifier?: string | null
  departmentId?: string
  departmentName: string
  timestamp: string
  isBilled: boolean
  isExempted: boolean
  insuranceName?: string | null
  visitId?: string | null
  visitDepartmentId?: string | null
}

export interface ClinicianTurnoverCategorySummary {
  category: string
  count: number
  totalRevenue: number
  insuranceCovered: number
  patientShare: number
}

export interface FinanceMoneyTimelinePoint {
  date: string
  label: string
  gross: number
  insurance: number
  patientCash: number
  loan: number
  giveaway: number
}

export interface PaymentModeDetail {
  method: string
  label: string
  amount: number
  count: number
}

export interface FinanceMoneyReport {
  totalGrossBilled: number
  insuranceCoveredAmount: number
  patientShareAmount: number
  patientCashCollected: number
  patientLoanAmount: number
  giveawayAmount: number
  outstandingBalance: number
  loanCount: number
  giveawayCount: number
  settlementRatePct: number

  // Payment mode breakdowns
  momoCollected: number
  cashCollected: number
  cardCollected: number
  bankTransferCollected: number
  otherCollected: number
  paymentModesBreakdown: Record<string, { amount: number; count: number }>

  moneyTimeline: FinanceMoneyTimelinePoint[]
  insuranceBreakdown: InsuranceMoneySummary[]
}


export interface ClinicianMoneyReport {
  totalGrossBilled: number
  insuranceCoveredAmount: number
  patientShareAmount: number
  patientCashCollected: number
  patientLoanAmount: number
  giveawayAmount: number
  outstandingBalance: number
  loanCount: number
  giveawayCount: number

  // Specific Product Turnover for items approved/prescribed by the clinician
  totalProductTurnover: number
  productItemsApprovedCount: number
  productTurnoverByCategory: Record<string, ClinicianTurnoverCategorySummary>
  productTurnoverList: ClinicianProductTurnoverItem[]

  moneyTimeline: FinanceMoneyTimelinePoint[]
  insuranceBreakdown: InsuranceMoneySummary[]
  departmentBreakdown: DepartmentMoneySummary[]
}

export interface ClinicianDemographicsReport {
  totalPatientsCount: number
  maleCount: number
  femaleCount: number
  otherGenderCount: number
  averageAge: number
  ageBrackets: {
    under18: number
    adults18to50: number
    seniors50plus: number
  }
  averageEncounterTimeMinutes: number
  peakActivityHour: string
  encountersByHour: Record<string, number>
}

export interface ClinicianEncounterProductItem {
  name: string
  code?: string | null
  quantity: number
  unitPrice: number
  lineTotal: number
  insuranceCovered: number
  patientShare: number
  status: string
  type: string
}

export interface ClinicianEncounterDetail {
  id: string
  visitId: string
  visitDepartmentId: string
  timestamp: string
  startedAt?: string | null
  completedAt?: string | null
  durationMinutes?: number | null
  patientName: string
  patientId: string
  patientIdentifier?: string | null
  gender?: string | null
  age?: number | null
  dateOfBirth?: string | null
  departmentId: string
  departmentName: string
  insuranceName: string
  status: string
  products: ClinicianEncounterProductItem[]
  totalGross: number
  totalInsurance: number
  totalPatient: number
}

export interface FinanceGeneralReport {
  billedItemsCount: number
  departmentsBilledCount: number
  categoryBreakdown: Record<string, { count: number; totalAmount: number }>
  activities: UserActivityItem[]
}

export interface UserReportsData {
  workerId: string
  workerName: string
  roles: RoleName[]
  period: ReportPeriod
  fromDate: string
  toDate: string

  // Role permissions
  hasReception: boolean
  hasClinician: boolean
  hasNurse: boolean
  hasFinance: boolean
  isAdminOrManager: boolean
  allowedTabs: Array<"reception" | "clinician" | "nurse" | "finance">

  // Global summary
  totalInteractions: number
  uniquePatientsTouched: number

  // Reception Stats
  reception: {
    visitsInitiatedCount: number
    departmentsDispatchedCount: number
    uniquePatientsCount: number
    insuredVisitsCount: number
    privateVisitsCount: number
    activities: UserActivityItem[]
  }

  // Clinician Stats
  clinician: {
    consultationsCount: number
    consultationsCompletedCount: number
    consultationsInProgressCount: number
    prescriptionsCount: number
    referralsCount: number
    productCategoryBreakdown: Record<string, number>
    money: ClinicianMoneyReport
    demographics: ClinicianDemographicsReport
    encountersList: ClinicianEncounterDetail[]
    activities: UserActivityItem[]
  }

  // Nurse Stats
  nurse: {
    vitalsRecordedCount: number
    triageEncountersCount: number
    nursingActsCount: number
    activities: UserActivityItem[]
  }

  // Finance / Billing Stats
  finance: {
    general: FinanceGeneralReport
    money: FinanceMoneyReport
    totalRevenueBilled: number
    billedItemsCount: number
    departmentsBilledCount: number
    activities: UserActivityItem[]
  }

  // Timeline for general activities chart
  timeline: Array<{
    date: string
    label: string
    reception: number
    clinician: number
    nurse: number
    finance: number
    total: number
  }>

  // All combined activities sorted by timestamp desc
  allActivities: UserActivityItem[]
}

/**
 * Normalizes an ISO date/time string to YYYY-MM-DD
 */
function toDateKey(isoOrDateString?: string | null): string {
  if (!isoOrDateString) return new Date().toISOString().slice(0, 10)
  return isoOrDateString.slice(0, 10)
}

/**
 * Checks if a timestamp falls within [fromDate, toDate] inclusive (comparing YYYY-MM-DD)
 */
function isWithinDateRange(timestamp: string | undefined | null, fromDate: string, toDate: string): boolean {
  if (!timestamp) return false
  const key = toDateKey(timestamp)
  return key >= fromDate && key <= toDate
}

/**
 * Computes patient age from date of birth string or fallback age
 */
export function calculatePatientAge(dateOfBirth?: string | null, fallbackAge?: number | null): number | null {
  if (fallbackAge != null && fallbackAge > 0) return fallbackAge
  if (!dateOfBirth) return null
  try {
    const dob = new Date(dateOfBirth)
    if (isNaN(dob.getTime())) return null
    const diffMs = Date.now() - dob.getTime()
    const ageDt = new Date(diffMs)
    const calculated = Math.abs(ageDt.getUTCFullYear() - 1970)
    return calculated >= 0 && calculated <= 130 ? calculated : null
  } catch {
    return null
  }
}

/**
 * Calculates duration in minutes between start and completion
 */
export function calculateEncounterDurationMinutes(startedAt?: string | null, completedAt?: string | null): number | null {
  if (!startedAt || !completedAt) return null
  try {
    const start = new Date(startedAt).getTime()
    const end = new Date(completedAt).getTime()
    if (isNaN(start) || isNaN(end) || end < start) return null
    const diffMins = Math.round((end - start) / (1000 * 60))
    if (diffMins >= 0 && diffMins <= 720) return diffMins
    return null
  } catch {
    return null
  }
}

/**
 * Formats hour of day into readable 12h range (e.g. 09:00 - 10:00 AM)
 */
export function formatHourRange(hour: number): string {
  const formatH = (h: number) => {
    const period = h >= 12 ? "PM" : "AM"
    const displayH = h % 12 === 0 ? 12 : h % 12
    return `${String(displayH).padStart(2, "0")}:00 ${period}`
  }
  const nextHour = (hour + 1) % 24
  return `${formatH(hour)} - ${formatH(nextHour)}`
}

/**
 * Extracts concise insurance acronym or short name
 */
export function getInsuranceAcronym(
  provider?: { acronym?: string | null; insuranceName?: string | null; name?: string | null } | null,
): string | null {
  if (!provider) return null
  if (provider.acronym && provider.acronym.trim()) {
    return provider.acronym.trim()
  }
  const fullName = (provider.insuranceName || provider.name || "").trim()
  if (!fullName) return null

  // Check parenthesized acronym first e.g. "Rwanda Social Security Board (RSSB)"
  const match = fullName.match(/\(([^)]+)\)/)
  if (match && match[1]) return match[1].trim()

  // If already short (e.g. RAMA, RSSB, MMI, CBHI, UAP, PRIME, etc.)
  if (fullName.length <= 8) return fullName

  const lower = fullName.toLowerCase()
  if (lower.includes("rwanda social security") || lower.includes("rssb")) return "RSSB"
  if (lower.includes("military medical") || lower.includes("mmi")) return "MMI"
  if (lower.includes("radiant")) return "RADIANT"
  if (lower.includes("prime")) return "PRIME"
  if (lower.includes("britam")) return "BRITAM"
  if (lower.includes("old mutual") || lower.includes("uap")) return "UAP"
  if (lower.includes("sanlam")) return "SANLAM"
  if (lower.includes("eden care")) return "EDEN CARE"
  if (lower.includes("mutuelle") || lower.includes("cbhi") || lower.includes("community based")) return "CBHI"
  if (lower.includes("mituelle")) return "CBHI"
  if (lower.includes("sonarwa")) return "SONARWA"
  if (lower.includes("mayfair")) return "MAYFAIR"
  if (lower.includes("soras")) return "SORAS"

  return fullName
}

/**
 * Resolves insurance acronym from visit, department billing, or patient profile
 */
export function resolveVisitInsuranceAcronym(
  dept?: VisitDepartment | null,
  visit?: Visit | null,
  hasInsuranceFallback?: boolean,
): string {
  // 1. From department billing
  const deptIns = dept?.billing?.insuranceBillings?.[0]?.patientInsurance?.insuranceProvider
  const deptAcronym = getInsuranceAcronym(deptIns)
  if (deptAcronym) return deptAcronym

  // 2. From visit linked insurances
  if (visit?.linkedInsurances && visit.linkedInsurances.length > 0) {
    for (const lIns of visit.linkedInsurances) {
      const acronym = getInsuranceAcronym(lIns.insuranceProvider)
      if (acronym) return acronym
    }
  }

  // 3. From patient profile insurances
  const patientInsurances = (visit?.patient as any)?.patientInsurances
  if (Array.isArray(patientInsurances) && patientInsurances.length > 0) {
    for (const pIns of patientInsurances) {
      const acronym = getInsuranceAcronym(pIns.insuranceProvider)
      if (acronym) return acronym
    }
  }

  // 4. Direct provider property on visit if any
  const directIns = (visit as any)?.patientInsurance?.insuranceProvider || (visit as any)?.insuranceProvider
  const directAcronym = getInsuranceAcronym(directIns)
  if (directAcronym) return directAcronym

  const hasInsurance =
    hasInsuranceFallback ??
    (Boolean(visit?.linkedInsurances?.length) || Boolean(patientInsurances?.length))
  return hasInsurance ? "Insured" : "Private / Cash"
}

/**
 * Pure calculator that extracts user-specific stats from visits array
 */
export function calculateUserReports(
  visits: Visit[],
  worker: Worker | null,
  period: ReportPeriod,
  fromDate: string,
  toDate: string,
): UserReportsData {
  const workerId = worker?.id ? String(worker.id) : ""
  const workerName = worker ? `${worker.firstName || ""} ${worker.lastName || ""}`.trim() || worker.username || "User" : "User"
  const rawRoles = (worker?.roles || []) as RoleName[]

  const isAdminOrManager = rawRoles.some((r) =>
    ["ADMIN", "MANAGER", "CLINIC_ADMIN"].includes(String(r)),
  )
  const hasReception = isAdminOrManager || rawRoles.some((r) => String(r) === "RECEPTION")
  const hasClinician = isAdminOrManager || rawRoles.some((r) => String(r) === "CLINICIAN")
  const hasNurse = isAdminOrManager || rawRoles.some((r) => String(r) === "NURSE")
  const hasFinance = isAdminOrManager || rawRoles.some((r) => String(r) === "FINANCE")

  const allowedTabs: Array<"reception" | "clinician" | "nurse" | "finance"> = []
  if (hasClinician) allowedTabs.push("clinician")
  if (hasFinance) allowedTabs.push("finance")
  if (hasNurse) allowedTabs.push("nurse")
  if (hasReception) allowedTabs.push("reception")

  const isUserMatch = (userObj?: { id?: string | number | null } | null) => {
    if (!userObj?.id || !workerId) return false
    return String(userObj.id) === workerId
  }

  const isProcessorMatch = (processors?: Array<{ id?: string | number | null }> | null) => {
    if (!processors || !processors.length || !workerId) return false
    return processors.some((p) => String(p?.id) === workerId)
  }

  const receptionActivities: UserActivityItem[] = []
  const clinicianActivities: UserActivityItem[] = []
  const nurseActivities: UserActivityItem[] = []
  const financeActivities: UserActivityItem[] = []

  const uniquePatientsSet = new Set<string>()
  const receptionPatientsSet = new Set<string>()

  let insuredVisitsCount = 0
  let privateVisitsCount = 0
  let visitsInitiatedCount = 0
  let departmentsDispatchedCount = 0

  let consultationsCount = 0
  let consultationsCompletedCount = 0
  let consultationsInProgressCount = 0
  let prescriptionsCount = 0
  let referralsCount = 0
  const clinicianProductCategoryBreakdown: Record<string, number> = {}

  // Clinician Demographics & Encounters accumulators
  const clinicianEncountersList: ClinicianEncounterDetail[] = []
  const clinicianPatientsSet = new Set<string>()
  let clinicianMaleCount = 0
  let clinicianFemaleCount = 0
  let clinicianOtherGenderCount = 0
  let clinicianTotalAgeSum = 0
  let clinicianAgeCount = 0
  let clinicianUnder18Count = 0
  let clinicianAdults18to50Count = 0
  let clinicianSeniors50plusCount = 0
  let clinicianTotalDurationMinutes = 0
  let clinicianDurationCount = 0
  const clinicianEncountersByHour: Record<string, number> = {}

  let vitalsRecordedCount = 0
  let triageEncountersCount = 0
  let nursingActsCount = 0

  // General billing metrics (Finance)
  let billedItemsCount = 0
  const billedDepartmentsSet = new Set<string>()
  const financeCategoryBreakdown: Record<string, { count: number; totalAmount: number }> = {}

  // Finance Money report accumulators
  let totalGrossBilled = 0
  let insuranceCoveredAmount = 0
  let patientShareAmount = 0
  let patientCashCollected = 0
  let patientLoanAmount = 0
  let giveawayAmount = 0
  let loanCount = 0
  let giveawayCount = 0

  let momoCollected = 0
  let cashCollected = 0
  let cardCollected = 0
  let bankTransferCollected = 0
  let otherCollected = 0
  const paymentModesBreakdownMap: Record<string, { amount: number; count: number }> = {}

  const insuranceBreakdownMap: Record<string, InsuranceMoneySummary> = {}

  // Clinician Money report accumulators
  let clinicianTotalGrossBilled = 0
  let clinicianInsuranceCoveredAmount = 0
  let clinicianPatientShareAmount = 0
  let clinicianPatientCashCollected = 0
  let clinicianPatientLoanAmount = 0
  let clinicianGiveawayAmount = 0
  let clinicianLoanCount = 0
  let clinicianGiveawayCount = 0

  // Clinician Product Turnover list & category accumulators
  let clinicianProductTurnoverTotal = 0
  let clinicianProductItemsApprovedCount = 0
  const clinicianProductTurnoverByCategory: Record<string, ClinicianTurnoverCategorySummary> = {}
  const clinicianProductTurnoverList: ClinicianProductTurnoverItem[] = []

  const clinicianDepartmentBreakdownMap: Record<string, DepartmentMoneySummary> = {}
  const clinicianInsuranceBreakdownMap: Record<string, InsuranceMoneySummary> = {}

  // Determine timeline granularity and range
  const startMs = new Date(fromDate).getTime()
  const endMs = new Date(toDate).getTime()
  const diffDays = Math.max(0, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)))

  const isDailyView = period === "today" || fromDate === toDate || diffDays === 0
  const isWeeklyView = !isDailyView && (period === "week" || diffDays <= 7)
  const isMonthlyView = !isDailyView && !isWeeklyView && (period === "month" || diffDays <= 31)

  // Activity timeline map: key -> { reception, clinician, nurse, finance, total }
  const timelineMap: Record<string, { reception: number; clinician: number; nurse: number; finance: number; total: number }> = {}
  const moneyTimelineMap: Record<string, { gross: number; insurance: number; patientCash: number; loan: number; giveaway: number }> = {}
  const clinicianMoneyTimelineMap: Record<string, { gross: number; insurance: number; patientCash: number; loan: number; giveaway: number }> = {}

  // Pre-fill timeline buckets based on resolution
  if (isDailyView) {
    // Pre-fill standard working hours 06:00 to 20:00 (15 hourly slots)
    for (let h = 6; h <= 20; h++) {
      const hKey = `${String(h).padStart(2, "0")}:00`
      timelineMap[hKey] = { reception: 0, clinician: 0, nurse: 0, finance: 0, total: 0 }
      moneyTimelineMap[hKey] = { gross: 0, insurance: 0, patientCash: 0, loan: 0, giveaway: 0 }
      clinicianMoneyTimelineMap[hKey] = { gross: 0, insurance: 0, patientCash: 0, loan: 0, giveaway: 0 }
    }
  } else {
    // Pre-fill daily slots from fromDate to toDate (up to 31 days)
    if (diffDays <= 31 && fromDate && toDate) {
      try {
        const [fYear, fMonth, fDay] = fromDate.split("-").map(Number)
        const [tYear, tMonth, tDay] = toDate.split("-").map(Number)
        const cur = new Date(fYear, fMonth - 1, fDay)
        const end = new Date(tYear, tMonth - 1, tDay)

        while (cur <= end) {
          const dKey = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`
          timelineMap[dKey] = { reception: 0, clinician: 0, nurse: 0, finance: 0, total: 0 }
          moneyTimelineMap[dKey] = { gross: 0, insurance: 0, patientCash: 0, loan: 0, giveaway: 0 }
          clinicianMoneyTimelineMap[dKey] = { gross: 0, insurance: 0, patientCash: 0, loan: 0, giveaway: 0 }
          cur.setDate(cur.getDate() + 1)
        }
      } catch {
        // fallback
      }
    }
  }

  const getBucketKey = (timestamp: string): string => {
    if (isDailyView) {
      const d = new Date(timestamp)
      if (!isNaN(d.getTime())) {
        return `${String(d.getHours()).padStart(2, "0")}:00`
      }
      return "08:00"
    }
    return toDateKey(timestamp)
  }

  const bumpTimeline = (timestamp: string, type: "reception" | "clinician" | "nurse" | "finance") => {
    const key = getBucketKey(timestamp)
    if (!timelineMap[key]) {
      timelineMap[key] = { reception: 0, clinician: 0, nurse: 0, finance: 0, total: 0 }
    }
    timelineMap[key][type]++
    timelineMap[key].total++
  }

  const bumpMoneyTimeline = (timestamp: string, gross: number, ins: number, cash: number, loan: number, give: number) => {
    const key = getBucketKey(timestamp)
    if (!moneyTimelineMap[key]) {
      moneyTimelineMap[key] = { gross: 0, insurance: 0, patientCash: 0, loan: 0, giveaway: 0 }
    }
    moneyTimelineMap[key].gross += gross
    moneyTimelineMap[key].insurance += ins
    moneyTimelineMap[key].patientCash += cash
    moneyTimelineMap[key].loan += loan
    moneyTimelineMap[key].giveaway += give
  }

  const bumpClinicianMoneyTimeline = (timestamp: string, gross: number, ins: number, cash: number, loan: number, give: number) => {
    const key = getBucketKey(timestamp)
    if (!clinicianMoneyTimelineMap[key]) {
      clinicianMoneyTimelineMap[key] = { gross: 0, insurance: 0, patientCash: 0, loan: 0, giveaway: 0 }
    }
    clinicianMoneyTimelineMap[key].gross += gross
    clinicianMoneyTimelineMap[key].insurance += ins
    clinicianMoneyTimelineMap[key].patientCash += cash
    clinicianMoneyTimelineMap[key].loan += loan
    clinicianMoneyTimelineMap[key].giveaway += give
  }

  // Iterate over all visits
  for (const visit of visits) {
    const visitDate = visit.visitDate || visit.createdAt || ""
    const patientName = `${visit.patient?.firstName || ""} ${visit.patient?.lastName || ""}`.trim() || "Unknown Patient"
    const patientId = String(visit.patient?.id || "")
    const patientIdentifier = visit.patient?.patientIdentifier || null
    const hasInsurance = (visit.linkedInsurances?.length ?? 0) > 0

    let patientTouchedByWorker = false

    // 1. Check Vital Signs (Nurse)
    if (Array.isArray(visit.vitalSigns)) {
      for (const vs of visit.vitalSigns) {
        const vsTime = vs.createdAt || visitDate
        if ((isUserMatch(vs.addedBy) || isAdminOrManager) && isWithinDateRange(vsTime, fromDate, toDate)) {
          vitalsRecordedCount++
          patientTouchedByWorker = true
          bumpTimeline(vsTime, "nurse")

          const measurementSummary = (vs.measurements || [])
            .map((m) => `${m.measurementName}: ${m.value}${m.unit ? ` ${m.unit}` : ""}`)
            .join(", ")

          nurseActivities.push({
            id: `vs-${vs.id}`,
            timestamp: vsTime,
            role: "NURSE",
            actionType: "Vital Signs Recorded",
            patientName,
            patientId,
            patientIdentifier,
            details: measurementSummary ? `Recorded: ${measurementSummary}` : "Recorded vital signs",
            status: "RECORDED",
          })
        }
      }
    }

    // 2. Check Visit Departments & Products & Department Billings
    const processDepartment = (dept: VisitDepartment, isChild = false) => {
      const deptTime = dept.startedAt || dept.createdAt || visitDate
      const deptId = String(dept.department?.id || dept.id)
      const deptName = dept.department?.name || (isChild ? "Sub-department" : "Consultation")
      const isTriage = deptName.toLowerCase().includes("triage")

      // Check if addedBy worker (Reception / Referral)
      if ((isUserMatch(dept.addedBy) || isAdminOrManager) && isWithinDateRange(deptTime, fromDate, toDate)) {
        departmentsDispatchedCount++
        patientTouchedByWorker = true
        receptionPatientsSet.add(patientId)

        if (!isChild) {
          visitsInitiatedCount++
          if (hasInsurance) insuredVisitsCount++
          else privateVisitsCount++
        } else {
          referralsCount++
        }

        bumpTimeline(deptTime, "reception")
        receptionActivities.push({
          id: `dept-add-${dept.id}`,
          timestamp: deptTime,
          role: "RECEPTION",
          actionType: isChild ? "Referral Dispatched" : "Department Dispatched",
          patientName,
          patientId,
          patientIdentifier,
          departmentName: deptName,
          details: `Dispatched to ${deptName} (${hasInsurance ? "Insured" : "Private"})`,
          status: dept.status,
        })
      }

      // Check if clinician processor, completedBy, addedBy or has prescribed products
      const hasWorkerPrescribedOnDept =
        Array.isArray(dept.products) &&
        dept.products.some((p) => isUserMatch(p.addedBy) || isUserMatch(p.processor))
      const hasWorkerPrescribedInPeriod =
        Array.isArray(dept.products) &&
        dept.products.some(
          (p) =>
            (isUserMatch(p.addedBy) || isUserMatch(p.processor)) &&
            isWithinDateRange(p.createdAt || deptTime, fromDate, toDate),
        )

      const isClinicianOnDept =
        isProcessorMatch(dept.processors) ||
        isUserMatch(dept.completedBy) ||
        hasWorkerPrescribedOnDept ||
        (isUserMatch(dept.addedBy) && !isTriage)

      const isDeptInPeriod = isWithinDateRange(deptTime, fromDate, toDate) || hasWorkerPrescribedInPeriod
      const effectiveDeptTime = hasWorkerPrescribedInPeriod
        ? dept.products?.find(
            (p) =>
              (isUserMatch(p.addedBy) || isUserMatch(p.processor)) &&
              isWithinDateRange(p.createdAt || deptTime, fromDate, toDate),
          )?.createdAt || deptTime
        : deptTime

      if ((isClinicianOnDept || isAdminOrManager) && isDeptInPeriod) {
        consultationsCount++
        patientTouchedByWorker = true
        if (patientId) clinicianPatientsSet.add(patientId)

        if (dept.status === "COMPLETED") {
          consultationsCompletedCount++
        } else {
          consultationsInProgressCount++
        }

        // Demographics tracking
        const pGender = (visit.patient?.gender || "").toUpperCase()
        if (pGender === "MALE" || pGender.startsWith("M")) {
          clinicianMaleCount++
        } else if (pGender === "FEMALE" || pGender.startsWith("F")) {
          clinicianFemaleCount++
        } else {
          clinicianOtherGenderCount++
        }

        const patAge = calculatePatientAge(visit.patient?.dateOfBirth, visit.patient?.age)
        if (patAge != null) {
          clinicianTotalAgeSum += patAge
          clinicianAgeCount++
          if (patAge < 18) clinicianUnder18Count++
          else if (patAge <= 50) clinicianAdults18to50Count++
          else clinicianSeniors50plusCount++
        }

        const durMins = calculateEncounterDurationMinutes(dept.startedAt, dept.completedAt)
        if (durMins != null) {
          clinicianTotalDurationMinutes += durMins
          clinicianDurationCount++
        }

        const deptDateObj = new Date(effectiveDeptTime)
        if (!isNaN(deptDateObj.getTime())) {
          const hKey = `${String(deptDateObj.getHours()).padStart(2, "0")}:00`
          clinicianEncountersByHour[hKey] = (clinicianEncountersByHour[hKey] || 0) + 1
        }

        bumpTimeline(effectiveDeptTime, "clinician")
        clinicianActivities.push({
          id: `consult-${dept.id}`,
          timestamp: effectiveDeptTime,
          role: "CLINICIAN",
          actionType: "Consultation Encounter",
          patientName,
          patientId,
          patientIdentifier,
          departmentName: deptName,
          details: `Consultation in ${deptName} (${dept.status})`,
          status: dept.status,
        })

        // CLINICIAN FINANCIAL ACCUMULATION for this department encounter
        // Only count financial amounts if the department is completed / finalised and not in DEPARTMENT_EDITING
        const isDeptCompletedBilled = dept.status === "COMPLETED" || dept.status === "FINALISED"

        let encounterGross = 0
        let encounterInsCov = 0
        let encounterPatPay = 0
        let encounterPaid = 0
        let encounterLoan = 0
        let encounterGiveaway = 0

        const resolvedDeptInsuranceName = resolveVisitInsuranceAcronym(dept, visit, hasInsurance)

        if (isDeptCompletedBilled && dept.billing) {
          const b = dept.billing
          if (Array.isArray(b.insuranceBillings) && b.insuranceBillings.length > 0) {
            for (const ib of b.insuranceBillings) {
              const insName =
                getInsuranceAcronym(ib.patientInsurance?.insuranceProvider) || resolvedDeptInsuranceName
              const tot = Number(ib.totalAmount || 0)
              const insCov = Number(ib.insuranceCoveredAmount || 0)
              const patPay = Number(ib.patientPayableAmount || 0)
              const paid = Number(ib.paidAmount || 0)
              const outstanding = Number(ib.outstandingAmount || 0)
              const isLoan = ib.outstandingType === "LOAN"
              const isGiveaway = ib.outstandingType === "GIVEAWAY"

              const loanVal = isLoan ? outstanding : 0
              const giveVal = isGiveaway ? outstanding : 0

              encounterGross += tot
              encounterInsCov += insCov
              encounterPatPay += patPay
              encounterPaid += paid
              encounterLoan += loanVal
              encounterGiveaway += giveVal

              if (isLoan && loanVal > 0) clinicianLoanCount++
              if (isGiveaway && giveVal > 0) clinicianGiveawayCount++

              // Clinician Insurance breakdown
              if (!clinicianInsuranceBreakdownMap[insName]) {
                clinicianInsuranceBreakdownMap[insName] = {
                  insuranceName: insName,
                  totalAmount: 0,
                  insuranceCovered: 0,
                  patientShare: 0,
                  paidAmount: 0,
                  loanAmount: 0,
                  giveawayAmount: 0,
                  count: 0,
                }
              }
              const insEntry = clinicianInsuranceBreakdownMap[insName]
              insEntry.totalAmount += tot
              insEntry.insuranceCovered += insCov
              insEntry.patientShare += patPay
              insEntry.paidAmount += paid
              insEntry.loanAmount += loanVal
              insEntry.giveawayAmount += giveVal
              insEntry.count++
            }
          } else {
            const tot = Number(b.totalAmount || 0)
            const insCov = Number(b.insuranceCoveredAmount || 0)
            const patPay = Number(b.patientPayableAmount || 0)
            const paid = Number(b.paidAmount || 0)
            const outstanding = Number(b.outstandingAmount || 0)

            encounterGross += tot
            encounterInsCov += insCov
            encounterPatPay += patPay
            encounterPaid += paid
            if (outstanding > 0) {
              encounterLoan += outstanding
              clinicianLoanCount++
            }
          }
        } else if (isDeptCompletedBilled && Array.isArray(dept.products)) {
          // Fallback if dept.billing is not attached: sum ONLY products that are BILLED or EXEMPTED
          for (const p of dept.products) {
            const isProdBilled = p.status === "BILLED" || p.status === "EXEMPTED" || p.status === "PATIENT_SHARE_EXEMPTED"
            if (!isProdBilled) continue

            const unitPrice = Number(
              p.billingItem?.unitPriceSnapshot ?? p.product?.privateRhicPrice ?? p.product?.clinicPrice ?? 0,
            )
            const lineTotal = (p.quantity || 1) * unitPrice
            encounterGross += lineTotal
            encounterPaid += lineTotal
            if (p.status === "EXEMPTED" || p.status === "PATIENT_SHARE_EXEMPTED") {
              encounterGiveaway += lineTotal
              clinicianGiveawayCount++
            }
          }
        }

        // Map department encounter products
        const encounterProducts: ClinicianEncounterProductItem[] = Array.isArray(dept.products)
          ? dept.products.map((p) => {
              const uPrice = Number(
                p.billingItem?.unitPriceSnapshot ?? p.product?.privateRhicPrice ?? p.product?.clinicPrice ?? 0,
              )
              const q = p.quantity || 1
              const lTotal = q * uPrice
              const insC = Number(p.billingItem?.insuranceCoveredAmount ?? 0)
              const patP = Number(p.billingItem?.patientPayableAmount ?? Math.max(0, lTotal - insC))
              return {
                name: p.product?.name || "Medical Item",
                code: p.product?.code || null,
                quantity: q,
                unitPrice: uPrice,
                lineTotal: lTotal,
                insuranceCovered: insC,
                patientShare: patP,
                status: String(p.status || "PENDING"),
                type: String(p.product?.type || "OTHER"),
              }
            })
          : []

        // Only compute fallback financial amounts for items that are actually billed/exempted
        const billedEncounterProducts = encounterProducts.filter(
          (p) => p.status === "BILLED" || p.status === "EXEMPTED" || p.status === "PATIENT_SHARE_EXEMPTED",
        )
        const effectiveGross = isDeptCompletedBilled
          ? (encounterGross > 0 ? encounterGross : billedEncounterProducts.reduce((s, p) => s + p.lineTotal, 0))
          : 0
        const effectiveInsCov = isDeptCompletedBilled
          ? (encounterInsCov > 0 ? encounterInsCov : billedEncounterProducts.reduce((s, p) => s + p.insuranceCovered, 0))
          : 0
        const effectivePatPay = isDeptCompletedBilled
          ? (encounterPatPay > 0 ? encounterPatPay : billedEncounterProducts.reduce((s, p) => s + p.patientShare, 0))
          : 0

        clinicianEncountersList.push({
          id: `clinician-enc-${dept.id}`,
          visitId: String(visit.id || ""),
          visitDepartmentId: String(dept.id || ""),
          timestamp: effectiveDeptTime,
          startedAt: dept.startedAt || null,
          completedAt: dept.completedAt || null,
          durationMinutes: durMins,
          patientName,
          patientId,
          patientIdentifier,
          gender: visit.patient?.gender || null,
          age: patAge,
          dateOfBirth: visit.patient?.dateOfBirth || null,
          departmentId: deptId,
          departmentName: deptName,
          insuranceName: resolvedDeptInsuranceName,
          status: String(dept.status || "PENDING"),
          products: encounterProducts,
          totalGross: effectiveGross,
          totalInsurance: effectiveInsCov,
          totalPatient: effectivePatPay,
        })

        clinicianTotalGrossBilled += encounterGross
        clinicianInsuranceCoveredAmount += encounterInsCov
        clinicianPatientShareAmount += encounterPatPay
        clinicianPatientCashCollected += encounterPaid
        clinicianPatientLoanAmount += encounterLoan
        clinicianGiveawayAmount += encounterGiveaway

        bumpClinicianMoneyTimeline(effectiveDeptTime, encounterGross, encounterInsCov, encounterPaid, encounterLoan, encounterGiveaway)

        // Clinician Department breakdown
        if (!clinicianDepartmentBreakdownMap[deptName]) {
          clinicianDepartmentBreakdownMap[deptName] = {
            departmentId: deptId,
            departmentName: deptName,
            totalAmount: 0,
            insuranceCovered: 0,
            patientShare: 0,
            paidAmount: 0,
            loanAmount: 0,
            giveawayAmount: 0,
            encountersCount: 0,
          }
        }
        const deptEntry = clinicianDepartmentBreakdownMap[deptName]
        deptEntry.totalAmount += encounterGross
        deptEntry.insuranceCovered += encounterInsCov
        deptEntry.patientShare += encounterPatPay
        deptEntry.paidAmount += encounterPaid
        deptEntry.loanAmount += encounterLoan
        deptEntry.giveawayAmount += encounterGiveaway
        deptEntry.encountersCount++
      }

      // Check triage encounter for nurses
      if (isTriage && (isClinicianOnDept || isUserMatch(dept.addedBy) || isAdminOrManager) && isWithinDateRange(deptTime, fromDate, toDate)) {
        triageEncountersCount++
        nurseActivities.push({
          id: `triage-${dept.id}`,
          timestamp: deptTime,
          role: "NURSE",
          actionType: "Triage Assessment",
          patientName,
          patientId,
          patientIdentifier,
          departmentName: "Triage",
          details: `Assisted triage for ${patientName}`,
          status: dept.status,
        })
      }

      // Process Products on this department
      let hasWorkerBilledOnDept = false
      if (Array.isArray(dept.products)) {
        for (const prod of dept.products) {
          const prodTime = prod.createdAt || deptTime
          const prodName = prod.product?.name || "Medical Item"
          const prodType = prod.product?.type || "OTHER"
          const qty = prod.quantity || 1
          const unitPrice = Number(
            prod.billingItem?.unitPriceSnapshot ?? prod.product?.privateRhicPrice ?? prod.product?.clinicPrice ?? 0,
          )
          const lineTotal = qty * unitPrice
          const isBilledByWorker = isUserMatch(prod.billedBy) || isAdminOrManager
          const isClinicianApproved = isUserMatch(prod.addedBy) || isUserMatch(prod.processor) || (isClinicianOnDept && isUserMatch(dept.completedBy)) || isAdminOrManager

          // 1. Clinician Prescribed / Added / Approved turnover tracking
          if (isClinicianApproved && isWithinDateRange(prodTime, fromDate, toDate)) {
            patientTouchedByWorker = true
            prescriptionsCount++
            clinicianProductCategoryBreakdown[prodType] = (clinicianProductCategoryBreakdown[prodType] || 0) + qty

            const insCov = Number(prod.billingItem?.insuranceCoveredAmount ?? 0)
            const patPay = Number(prod.billingItem?.patientPayableAmount ?? Math.max(0, lineTotal - insCov))
            const isBilled = prod.status === "BILLED"
            const isExempted = prod.status === "EXEMPTED" || prod.status === "PATIENT_SHARE_EXEMPTED"
            const isBilledOrExempted = isBilled || isExempted

            const isDeptCompletedBilled = dept.status === "COMPLETED" || dept.status === "FINALISED"
            const shouldCountMoney = isBilledOrExempted && isDeptCompletedBilled

            // Only add monetary turnover if the product has been billed or exempted on a completed/billed department
            if (shouldCountMoney) {
              clinicianProductTurnoverTotal += lineTotal
              clinicianProductItemsApprovedCount += qty
            }

            if (!clinicianProductTurnoverByCategory[prodType]) {
              clinicianProductTurnoverByCategory[prodType] = {
                category: prodType,
                count: 0,
                totalRevenue: 0,
                insuranceCovered: 0,
                patientShare: 0,
              }
            }
            const catEntry = clinicianProductTurnoverByCategory[prodType]
            catEntry.count += qty
            if (shouldCountMoney) {
              catEntry.totalRevenue += lineTotal
              catEntry.insuranceCovered += insCov
              catEntry.patientShare += patPay
            }

            const deptInsuranceName = resolveVisitInsuranceAcronym(dept, visit, hasInsurance)

            clinicianProductTurnoverList.push({
              id: `prod-turnover-${prod.id}`,
              productId: String(prod.product?.id || ""),
              productName: prodName,
              productCode: prod.product?.code || null,
              productType: prodType,
              quantity: qty,
              unitPrice,
              lineTotal,
              insuranceCoveredAmount: insCov,
              patientPayableAmount: patPay,
              status: String(prod.status || "PENDING"),
              patientName,
              patientId,
              patientIdentifier,
              departmentId: deptId,
              departmentName: deptName,
              timestamp: prodTime,
              isBilled: isBilled && isDeptCompletedBilled,
              isExempted: isExempted && isDeptCompletedBilled,
              insuranceName: deptInsuranceName,
              visitId: String(visit.id || ""),
              visitDepartmentId: String(dept.id || ""),
            })

            const isNursingAct = prodType === "MEDICAL_ACT" || prodType === "CONSUMABLE_DEVICE"
            if (isNursingAct && isUserMatch(prod.addedBy)) {
              nursingActsCount += qty
              bumpTimeline(prodTime, "nurse")
              nurseActivities.push({
                id: `nursing-act-${prod.id}`,
                timestamp: prodTime,
                role: "NURSE",
                actionType: "Nursing Act / Consumable",
                patientName,
                patientId,
                patientIdentifier,
                departmentName: deptName,
                details: `${prodName} (Qty: ${qty})`,
                amount: lineTotal,
                status: prod.status,
              })
            } else if (isUserMatch(prod.addedBy)) {
              bumpTimeline(prodTime, "clinician")
              clinicianActivities.push({
                id: `prod-add-${prod.id}`,
                timestamp: prodTime,
                role: "CLINICIAN",
                actionType: "Product / Prescription Ordered",
                patientName,
                patientId,
                patientIdentifier,
                departmentName: deptName,
                details: `Prescribed ${prodName} (Qty: ${qty})`,
                amount: lineTotal,
                status: prod.status,
              })
            }
          }

          // 2. Billed by cashier / finance worker
          if (isBilledByWorker && isWithinDateRange(prodTime, fromDate, toDate)) {
            billedItemsCount++
            hasWorkerBilledOnDept = true
            patientTouchedByWorker = true

            // General category breakdown
            if (!financeCategoryBreakdown[prodType]) {
              financeCategoryBreakdown[prodType] = { count: 0, totalAmount: 0 }
            }
            financeCategoryBreakdown[prodType].count += qty
            financeCategoryBreakdown[prodType].totalAmount += lineTotal

            // Product status giveaway check
            if (prod.status === "EXEMPTED" || prod.status === "PATIENT_SHARE_EXEMPTED") {
              giveawayAmount += lineTotal
              giveawayCount++
            }

            bumpTimeline(prodTime, "finance")
            financeActivities.push({
              id: `bill-${prod.id}`,
              timestamp: prodTime,
              role: "FINANCE",
              actionType: "Billed Line Item",
              patientName,
              patientId,
              patientIdentifier,
              departmentName: deptName,
              details: `Billed: ${prodName} (Qty: ${qty}) [${prod.status || "BILLED"}]`,
              amount: lineTotal,
              status: prod.status || "BILLED",
            })
          }
        }
      }

      // Check Department Billing & Insurance Breakdown for FINANCE worker
      if (dept.billing) {
        const b = dept.billing
        const bTime = b.createdAt || deptTime
        const isBilledInPeriod = isWithinDateRange(bTime, fromDate, toDate)

        if ((hasWorkerBilledOnDept || isAdminOrManager) && isBilledInPeriod) {
          billedDepartmentsSet.add(String(dept.id))

          // Process payments attached to this billing department
          if (Array.isArray(b.payments) && b.payments.length > 0) {
            for (const pay of b.payments) {
              const payAmt = Number(pay.amount || 0)
              if (payAmt <= 0) continue
              const rawMethod = String(pay.paymentMethod || "CASH").toUpperCase()
              let methodKey = "CASH"
              if (rawMethod.includes("MOBILE") || rawMethod.includes("MOMO") || rawMethod.includes("MTN") || rawMethod.includes("AIRTEL")) {
                methodKey = "MOBILE_MONEY"
                momoCollected += payAmt
              } else if (rawMethod.includes("CARD") || rawMethod.includes("POS") || rawMethod.includes("VISA") || rawMethod.includes("MASTERCARD")) {
                methodKey = "CARD"
                cardCollected += payAmt
              } else if (rawMethod.includes("BANK") || rawMethod.includes("TRANSFER")) {
                methodKey = "BANK_TRANSFER"
                bankTransferCollected += payAmt
              } else if (rawMethod.includes("CASH")) {
                methodKey = "CASH"
                cashCollected += payAmt
              } else {
                methodKey = rawMethod
                otherCollected += payAmt
              }

              if (!paymentModesBreakdownMap[methodKey]) {
                paymentModesBreakdownMap[methodKey] = { amount: 0, count: 0 }
              }
              paymentModesBreakdownMap[methodKey].amount += payAmt
              paymentModesBreakdownMap[methodKey].count++
            }
          }

          // Process insurance billings for finance money report
          if (Array.isArray(b.insuranceBillings) && b.insuranceBillings.length > 0) {
            for (const ib of b.insuranceBillings) {
              const insName =
                getInsuranceAcronym(ib.patientInsurance?.insuranceProvider) ||
                resolveVisitInsuranceAcronym(dept, visit, hasInsurance)
              const tot = Number(ib.totalAmount || 0)
              const insCov = Number(ib.insuranceCoveredAmount || 0)
              const patPay = Number(ib.patientPayableAmount || 0)
              const paid = Number(ib.paidAmount || 0)
              const outstanding = Number(ib.outstandingAmount || 0)
              const isLoan = ib.outstandingType === "LOAN"
              const isGiveaway = ib.outstandingType === "GIVEAWAY"

              const loanVal = isLoan ? outstanding : 0
              const giveVal = isGiveaway ? outstanding : 0

              totalGrossBilled += tot
              insuranceCoveredAmount += insCov
              patientShareAmount += patPay
              patientCashCollected += paid
              patientLoanAmount += loanVal
              if (isGiveaway) {
                giveawayAmount += giveVal
                giveawayCount++
              }
              if (isLoan && loanVal > 0) {
                loanCount++
              }

              bumpMoneyTimeline(bTime, tot, insCov, paid, loanVal, giveVal)

              if (!insuranceBreakdownMap[insName]) {
                insuranceBreakdownMap[insName] = {
                  insuranceName: insName,
                  totalAmount: 0,
                  insuranceCovered: 0,
                  patientShare: 0,
                  paidAmount: 0,
                  loanAmount: 0,
                  giveawayAmount: 0,
                  count: 0,
                }
              }
              const entry = insuranceBreakdownMap[insName]
              entry.totalAmount += tot
              entry.insuranceCovered += insCov
              entry.patientShare += patPay
              entry.paidAmount += paid
              entry.loanAmount += loanVal
              entry.giveawayAmount += giveVal
              entry.count++
            }
          } else {
            // Fallback to top-level billing fields
            const tot = Number(b.totalAmount || 0)
            const insCov = Number(b.insuranceCoveredAmount || 0)
            const patPay = Number(b.patientPayableAmount || 0)
            const paid = Number(b.paidAmount || 0)
            const outstanding = Number(b.outstandingAmount || 0)

            totalGrossBilled += tot
            insuranceCoveredAmount += insCov
            patientShareAmount += patPay
            patientCashCollected += paid
            if (outstanding > 0) {
              patientLoanAmount += outstanding
              loanCount++
            }

            bumpMoneyTimeline(bTime, tot, insCov, paid, outstanding, 0)
          }
        }
      } else if (hasWorkerBilledOnDept) {
        billedDepartmentsSet.add(String(dept.id))
        let deptProdTotal = 0
        if (Array.isArray(dept.products)) {
          for (const p of dept.products) {
            if ((isUserMatch(p.billedBy) || isAdminOrManager) && isWithinDateRange(p.createdAt || deptTime, fromDate, toDate)) {
              const unitPrice = Number(
                p.billingItem?.unitPriceSnapshot ?? p.product?.privateRhicPrice ?? p.product?.clinicPrice ?? 0,
              )
              const lineTotal = (p.quantity || 1) * unitPrice
              deptProdTotal += lineTotal
            }
          }
        }
        if (deptProdTotal > 0) {
          totalGrossBilled += deptProdTotal
          patientCashCollected += deptProdTotal
          bumpMoneyTimeline(deptTime, deptProdTotal, 0, deptProdTotal, 0, 0)
        }
      }

      // Check child departments recursively
      if (Array.isArray(dept.childVisitDepartments)) {
        for (const child of dept.childVisitDepartments) {
          processDepartment(child, true)
        }
      }
    }

    // Process top-level departments
    if (Array.isArray(visit.departments)) {
      for (const dept of visit.departments) {
        processDepartment(dept, false)
      }
    }

    if (patientTouchedByWorker && patientId) {
      uniquePatientsSet.add(patientId)
    }
  }

  // Combine and sort all activities
  const allActivities = [
    ...(hasReception ? receptionActivities : []),
    ...(hasClinician ? clinicianActivities : []),
    ...(hasNurse ? nurseActivities : []),
    ...(hasFinance ? financeActivities : []),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Sort clinician turnover list by timestamp desc
  clinicianProductTurnoverList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Sort clinician encounters list by timestamp desc
  clinicianEncountersList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Find peak activity hour for clinician
  let peakHourStr = "N/A"
  let maxHourCount = 0
  for (const [hKey, count] of Object.entries(clinicianEncountersByHour)) {
    if (count > maxHourCount) {
      maxHourCount = count
      const hourNum = parseInt(hKey.split(":")[0], 10)
      peakHourStr = formatHourRange(hourNum)
    }
  }

  const clinicianDemographics: ClinicianDemographicsReport = {
    totalPatientsCount: clinicianPatientsSet.size || consultationsCount,
    maleCount: clinicianMaleCount,
    femaleCount: clinicianFemaleCount,
    otherGenderCount: clinicianOtherGenderCount,
    averageAge: clinicianAgeCount > 0 ? Math.round((clinicianTotalAgeSum / clinicianAgeCount) * 10) / 10 : 0,
    ageBrackets: {
      under18: clinicianUnder18Count,
      adults18to50: clinicianAdults18to50Count,
      seniors50plus: clinicianSeniors50plusCount,
    },
    averageEncounterTimeMinutes: clinicianDurationCount > 0 ? Math.round(clinicianTotalDurationMinutes / clinicianDurationCount) : 0,
    peakActivityHour: peakHourStr,
    encountersByHour: clinicianEncountersByHour,
  }

  const formatTimelineLabel = (key: string): string => {
    if (isDailyView) {
      return key
    }
    try {
      const [y, m, d] = key.split("-").map(Number)
      if (y && m && d) {
        const dateObj = new Date(y, m - 1, d)
        if (isWeeklyView) {
          return dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
        }
        return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      }
      const dObj = new Date(key)
      return !isNaN(dObj.getTime()) ? dObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : key
    } catch {
      return key
    }
  }

  // Format activity timeline sorted chronologically
  const timelineDates = Object.keys(timelineMap).sort()
  const timeline = timelineDates.map((date) => {
    const entry = timelineMap[date]
    return {
      date,
      label: formatTimelineLabel(date),
      ...entry,
    }
  })

  // Format finance money timeline sorted chronologically
  const moneyTimelineDates = Object.keys(moneyTimelineMap).sort()
  const moneyTimeline: FinanceMoneyTimelinePoint[] = moneyTimelineDates.map((date) => {
    const entry = moneyTimelineMap[date]
    return {
      date,
      label: formatTimelineLabel(date),
      ...entry,
    }
  })

  // Format clinician money timeline sorted chronologically
  const clinicianMoneyTimelineDates = Object.keys(clinicianMoneyTimelineMap).sort()
  const clinicianMoneyTimeline: FinanceMoneyTimelinePoint[] = clinicianMoneyTimelineDates.map((date) => {
    const entry = clinicianMoneyTimelineMap[date]
    return {
      date,
      label: formatTimelineLabel(date),
      ...entry,
    }
  })

  // Insurance breakdown list sorted by totalAmount desc
  const insuranceBreakdown = Object.values(insuranceBreakdownMap).sort((a, b) => b.totalAmount - a.totalAmount)
  const clinicianInsuranceBreakdown = Object.values(clinicianInsuranceBreakdownMap).sort((a, b) => b.totalAmount - a.totalAmount)
  const clinicianDepartmentBreakdown = Object.values(clinicianDepartmentBreakdownMap).sort((a, b) => b.totalAmount - a.totalAmount)

  // Settlement rate calculation (Finance)
  const totalReceivables = totalGrossBilled
  const totalSettled = insuranceCoveredAmount + patientCashCollected + giveawayAmount
  const settlementRatePct = totalReceivables > 0 ? Math.min(100, Math.round((totalSettled / totalReceivables) * 100)) : 100
  const outstandingBalance = Math.max(0, totalGrossBilled - insuranceCoveredAmount - patientCashCollected - giveawayAmount)

  // Ensure payment modes breakdown reconciles with total patient cash collected
  const totalPaymentModesCollected = momoCollected + cashCollected + cardCollected + bankTransferCollected + otherCollected
  if (patientCashCollected > totalPaymentModesCollected) {
    const diff = patientCashCollected - totalPaymentModesCollected
    cashCollected += diff
    if (!paymentModesBreakdownMap["CASH"]) {
      paymentModesBreakdownMap["CASH"] = { amount: 0, count: 0 }
    }
    paymentModesBreakdownMap["CASH"].amount += diff
    paymentModesBreakdownMap["CASH"].count += 1
  }

  const financeMoneyReport: FinanceMoneyReport = {
    totalGrossBilled,
    insuranceCoveredAmount,
    patientShareAmount,
    patientCashCollected,
    patientLoanAmount,
    giveawayAmount,
    outstandingBalance,
    loanCount,
    giveawayCount,
    settlementRatePct,
    momoCollected,
    cashCollected,
    cardCollected,
    bankTransferCollected,
    otherCollected,
    paymentModesBreakdown: paymentModesBreakdownMap,
    moneyTimeline,
    insuranceBreakdown,
  }


  const clinicianMoneyReport: ClinicianMoneyReport = {
    totalGrossBilled: clinicianTotalGrossBilled || clinicianProductTurnoverTotal,
    insuranceCoveredAmount: clinicianInsuranceCoveredAmount,
    patientShareAmount: clinicianPatientShareAmount,
    patientCashCollected: clinicianPatientCashCollected,
    patientLoanAmount: clinicianPatientLoanAmount,
    giveawayAmount: clinicianGiveawayAmount,
    outstandingBalance: Math.max(0, (clinicianTotalGrossBilled || clinicianProductTurnoverTotal) - clinicianInsuranceCoveredAmount - clinicianPatientCashCollected - clinicianGiveawayAmount),
    loanCount: clinicianLoanCount,
    giveawayCount: clinicianGiveawayCount,

    totalProductTurnover: clinicianProductTurnoverTotal,
    productItemsApprovedCount: clinicianProductItemsApprovedCount,
    productTurnoverByCategory: clinicianProductTurnoverByCategory,
    productTurnoverList: clinicianProductTurnoverList,

    moneyTimeline: clinicianMoneyTimeline,
    insuranceBreakdown: clinicianInsuranceBreakdown,
    departmentBreakdown: clinicianDepartmentBreakdown,
  }

  const financeGeneralReport: FinanceGeneralReport = {
    billedItemsCount,
    departmentsBilledCount: billedDepartmentsSet.size,
    categoryBreakdown: financeCategoryBreakdown,
    activities: financeActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  }

  const totalInteractions = allActivities.length

  return {
    workerId,
    workerName,
    roles: rawRoles,
    period,
    fromDate,
    toDate,
    hasReception,
    hasClinician,
    hasNurse,
    hasFinance,
    isAdminOrManager,
    allowedTabs,
    totalInteractions,
    uniquePatientsTouched: uniquePatientsSet.size,
    reception: {
      visitsInitiatedCount,
      departmentsDispatchedCount,
      uniquePatientsCount: receptionPatientsSet.size,
      insuredVisitsCount,
      privateVisitsCount,
      activities: receptionActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    },
    clinician: {
      consultationsCount,
      consultationsCompletedCount,
      consultationsInProgressCount,
      prescriptionsCount,
      referralsCount,
      productCategoryBreakdown: clinicianProductCategoryBreakdown,
      money: clinicianMoneyReport,
      demographics: clinicianDemographics,
      encountersList: clinicianEncountersList,
      activities: clinicianActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    },
    nurse: {
      vitalsRecordedCount,
      triageEncountersCount,
      nursingActsCount,
      activities: nurseActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    },
    finance: {
      general: financeGeneralReport,
      money: financeMoneyReport,
      totalRevenueBilled: totalGrossBilled || patientCashCollected,
      billedItemsCount,
      departmentsBilledCount: billedDepartmentsSet.size,
      activities: financeActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    },
    timeline,
    allActivities,
  }
}
