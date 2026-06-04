/**
 * Maps GraphQL response shapes to canonical types in lib/api-types.ts.
 * All visit/patient/product hooks should use these mappers — no parallel entity types.
 */

import {
  AccountStatus,
  DepartmentInsurancePolicyMode,
  EncounterType,
  Gender,
  RoleName,
  type Department,
  type InsuranceProvider,
  type Patient,
  type PatientInsurance,
  type Product,
  type ProductInsuranceCoverage,
  type ProductType,
  type ProductUnit,
  type Visit,
  type VisitDepartment,
  type VisitDepartmentProduct,
  type VisitProductStatus,
  type Worker,
} from "@/lib/api-types"

const EMPTY_TIMESTAMP = ""

export type GqlInsuranceProvider = {
  id: string
  insuranceName: string
  acronym?: string | null
  defaultCoveragePercentage?: number | null
  supportedByClinic?: boolean | null
  iconUrl?: string | null
}

export type GqlPatientInsurance = {
  id: string
  insuranceCardNumber: string
  providingCompanyOrEmployer?: string | null
  principalMember?: boolean | null
  principalMemberName?: string | null
  principalMemberPhoneNumber?: string | null
  validFrom?: string | null
  validUntil?: string | null
  insuranceProvider: GqlInsuranceProvider
  patient?: { id: string } | null
}

export type GqlPatient = {
  id: string
  firstName: string
  middleName?: string | null
  lastName?: string | null
  dateOfBirth?: string | null
  gender?: string | null
  primaryPhoneNumber?: string | null
  alternativePhone?: string | null
  village?: string | null
  city?: string | null
  district?: string | null
  postalAddress?: string | null
  nationalIdNumber?: string | null
  passportNumber?: string | null
  emergencyContactName?: string | null
  emergencyContactRelationship?: string | null
  emergencyContactPhoneNumber?: string | null
  patientInsurances?: GqlPatientInsurance[] | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type GqlWorkerRef = {
  id: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phoneNumber?: string | null
  username?: string | null
}

export type GqlWorker = GqlWorkerRef & {
  accountStatus?: string | null
  roles?: string[] | null
  departments?: Array<{ id: string; name: string }> | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type GqlCoverage = {
  id: string
  insuranceProvider?: GqlInsuranceProvider | null
  cost?: number | null
  covered?: boolean | null
  requireMedicalAdvisor?: boolean | null
  mustPrescribedBy?: string | null
  drugAdministrationFrequency?: string | null
  authorizationRequestReasons?: string[] | null
}

export type GqlProduct = {
  id: string
  name: string
  code?: string | null
  description?: string | null
  genericName?: string | null
  type?: string | null
  unit?: string | null
  privateRhicPrice?: number | null
  clinicPrice?: number | null
  insuranceCoverages?: GqlCoverage[] | null
}

export type GqlVisitDepartmentProduct = {
  id: string
  product?: GqlProduct | null
  quantity: number
  price?: number | null
  status: string
  addedBy?: GqlWorkerRef | null
  billedBy?: GqlWorkerRef | null
  processor?: GqlWorkerRef | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type GqlVisitDepartment = {
  id: string
  status: string
  encounterType?: string | null
  completedAt?: string | null
  childVisitDepartments?: GqlVisitDepartment[] | null
  diagnostics?: Array<{
    id: string
    diagnosisName: string
    icd11Code?: string | null
    createdAt?: string | null
  }> | null
  medications?: Array<{
    id: string
    medicationName: string
    instructions: string
    createdAt?: string | null
  }> | null
  products?: GqlVisitDepartmentProduct[] | null
  preInstructions?: unknown[] | null
  department?: {
    id: string
    name: string
    insurancePolicyMode?: string | null
    requestsProducts?: boolean | null
    nursing?: boolean | null
    supportRequests?: boolean | null
  } | null
  processors?: GqlWorkerRef[] | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type GqlVisit = {
  id: string
  visitDate: string
  status: string
  vitalSigns?: unknown[] | null
  linkedInsurances?: GqlPatientInsurance[] | null
  patient: GqlPatient
  departments?: GqlVisitDepartment[] | null
}

function parseGender(value?: string | null): Gender {
  const normalized = String(value || "").toUpperCase()
  if (normalized === Gender.MALE || normalized === "M") return Gender.MALE
  if (normalized === Gender.FEMALE || normalized === "F") return Gender.FEMALE
  if (normalized === Gender.OTHER) return Gender.OTHER
  return Gender.OTHER
}

function parseEncounterType(value?: string | null): EncounterType {
  const normalized = String(value || "").toUpperCase()
  if (normalized in EncounterType) {
    return EncounterType[normalized as keyof typeof EncounterType]
  }
  return EncounterType.OUTPATIENT
}

export function mapGqlInsuranceProvider(provider: GqlInsuranceProvider): InsuranceProvider {
  return {
    id: provider.id,
    insuranceName: provider.insuranceName,
    acronym: provider.acronym,
    defaultCoveragePercentage: Number(provider.defaultCoveragePercentage ?? 0),
    supportedByClinic: provider.supportedByClinic ?? true,
    iconUrl: provider.iconUrl,
    createdAt: EMPTY_TIMESTAMP,
    updatedAt: EMPTY_TIMESTAMP,
    name: provider.insuranceName,
  }
}

export function mapGqlProductInsuranceCoverage(coverage: GqlCoverage): ProductInsuranceCoverage {
  return {
    id: String(coverage.id || ""),
    insuranceProvider: mapGqlInsuranceProvider(
      coverage.insuranceProvider || { id: "", insuranceName: "" },
    ),
    cost: Number(coverage.cost ?? 0),
    covered: Boolean(coverage.covered),
    requireMedicalAdvisor: Boolean(coverage.requireMedicalAdvisor),
    mustPrescribedBy: coverage.mustPrescribedBy as ProductInsuranceCoverage["mustPrescribedBy"],
    drugAdministrationFrequency:
      coverage.drugAdministrationFrequency as ProductInsuranceCoverage["drugAdministrationFrequency"],
    authorizationRequestReasons: coverage.authorizationRequestReasons || [],
    createdAt: EMPTY_TIMESTAMP,
    updatedAt: EMPTY_TIMESTAMP,
  }
}

export function mapGqlProduct(product: GqlProduct): Product {
  return {
    id: product.id,
    name: product.name,
    genericName: product.genericName,
    code: product.code || "",
    description: product.description || "",
    type: (product.type as ProductType) || ("MEDICAL_ACT" as ProductType),
    unit: (product.unit as ProductUnit) || ("UNKNOWN" as ProductUnit),
    privateRhicPrice: product.privateRhicPrice,
    clinicPrice: product.clinicPrice,
    insuranceCoverages: (product.insuranceCoverages || []).map(mapGqlProductInsuranceCoverage),
    createdAt: EMPTY_TIMESTAMP,
    updatedAt: EMPTY_TIMESTAMP,
  }
}

export function mapGqlWorkerRef(worker?: GqlWorkerRef | null): Worker | undefined {
  if (!worker?.id) return undefined
  const firstName = worker.firstName || ""
  const lastName = worker.lastName
  return {
    id: worker.id,
    firstName,
    lastName,
    email: worker.email,
    phoneNumber: worker.phoneNumber,
    username: worker.username,
    accountStatus: AccountStatus.ACTIVE,
    roles: [],
    departments: [],
    createdAt: EMPTY_TIMESTAMP,
    updatedAt: EMPTY_TIMESTAMP,
    name: [firstName, lastName].filter(Boolean).join(" ") || worker.email || undefined,
  }
}

function parseAccountStatus(value?: string | null): AccountStatus {
  const normalized = String(value || "").toUpperCase()
  if (normalized in AccountStatus) {
    return AccountStatus[normalized as keyof typeof AccountStatus]
  }
  return AccountStatus.PENDING
}

export function mapGqlWorker(worker?: GqlWorker | null): Worker {
  const ref = mapGqlWorkerRef(worker)
  if (!ref) {
    return {
      id: "",
      firstName: "",
      accountStatus: AccountStatus.PENDING,
      roles: [],
      departments: [],
      createdAt: EMPTY_TIMESTAMP,
      updatedAt: EMPTY_TIMESTAMP,
    }
  }

  return {
    ...ref,
    accountStatus: parseAccountStatus(worker?.accountStatus),
    roles: (worker?.roles || []) as RoleName[],
    departments: (worker?.departments || []).map((department) =>
      mapGqlDepartmentSummary({
        id: department.id,
        name: department.name,
        insurancePolicyMode: undefined,
        requestsProducts: false,
        nursing: false,
        supportRequests: false,
      }),
    ),
    createdAt: worker?.createdAt || EMPTY_TIMESTAMP,
    updatedAt: worker?.updatedAt || EMPTY_TIMESTAMP,
  }
}

export function mapGqlPatient(patient: GqlPatient): Patient {
  const mapped: Patient = {
    id: patient.id,
    firstName: patient.firstName,
    middleName: patient.middleName,
    lastName: patient.lastName,
    dateOfBirth: patient.dateOfBirth || EMPTY_TIMESTAMP,
    gender: parseGender(patient.gender),
    primaryPhoneNumber: patient.primaryPhoneNumber,
    alternativePhone: patient.alternativePhone,
    village: patient.village,
    city: patient.city,
    district: patient.district,
    postalAddress: patient.postalAddress,
    nationalIdNumber: patient.nationalIdNumber,
    passportNumber: patient.passportNumber,
    emergencyContactName: patient.emergencyContactName,
    emergencyContactRelationship: patient.emergencyContactRelationship,
    emergencyContactPhoneNumber: patient.emergencyContactPhoneNumber,
    patientInsurances: [],
    createdAt: patient.createdAt || EMPTY_TIMESTAMP,
    updatedAt: patient.updatedAt || EMPTY_TIMESTAMP,
  }
  mapped.patientInsurances = (patient.patientInsurances || []).map((insurance) =>
    mapGqlPatientInsurance(insurance, mapped),
  )
  return mapped
}

export function mapGqlPatientSummary(patient: {
  id: string
  firstName: string
  lastName?: string | null
  primaryPhoneNumber?: string | null
}): Patient {
  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    dateOfBirth: EMPTY_TIMESTAMP,
    gender: Gender.OTHER,
    primaryPhoneNumber: patient.primaryPhoneNumber,
    patientInsurances: [],
    createdAt: EMPTY_TIMESTAMP,
    updatedAt: EMPTY_TIMESTAMP,
  }
}

export function mapGqlPatientInsurance(
  insurance: GqlPatientInsurance,
  patient: Patient,
): PatientInsurance {
  return {
    id: insurance.id,
    patient,
    insuranceProvider: mapGqlInsuranceProvider(insurance.insuranceProvider),
    insuranceCardNumber: insurance.insuranceCardNumber,
    providingCompanyOrEmployer: insurance.providingCompanyOrEmployer,
    principalMember: Boolean(insurance.principalMember),
    principalMemberName: insurance.principalMemberName,
    principalMemberPhoneNumber: insurance.principalMemberPhoneNumber,
    validFrom: insurance.validFrom || EMPTY_TIMESTAMP,
    validUntil: insurance.validUntil || EMPTY_TIMESTAMP,
    createdAt: EMPTY_TIMESTAMP,
    updatedAt: EMPTY_TIMESTAMP,
  }
}

export function mapGqlVisitDepartmentProduct(
  item: GqlVisitDepartmentProduct,
): VisitDepartmentProduct {
  const product = item.product
    ? mapGqlProduct(item.product)
    : {
        id: "",
        name: "",
        code: "",
        description: "",
        type: "MEDICAL_ACT" as ProductType,
        unit: "UNKNOWN" as ProductUnit,
        insuranceCoverages: [],
        createdAt: EMPTY_TIMESTAMP,
        updatedAt: EMPTY_TIMESTAMP,
      }

  return {
    id: item.id,
    product,
    quantity: Number(item.quantity ?? 0),
    price: Number(item.price ?? product.clinicPrice ?? product.privateRhicPrice ?? 0),
    status: item.status as VisitProductStatus,
    addedBy: mapGqlWorkerRef(item.addedBy),
    billedBy: mapGqlWorkerRef(item.billedBy),
    processor: mapGqlWorkerRef(item.processor),
    createdAt: item.createdAt || EMPTY_TIMESTAMP,
    updatedAt: item.updatedAt || EMPTY_TIMESTAMP,
  }
}

export function mapGqlDepartmentSummary(department: NonNullable<GqlVisitDepartment["department"]>): Department {
  return {
    id: department.id,
    name: department.name,
    insurancePolicyMode:
      (department.insurancePolicyMode as DepartmentInsurancePolicyMode) ||
      DepartmentInsurancePolicyMode.ALL,
    insurancePolicies: [],
    defaultProducts: [],
    nursing: department.nursing ?? false,
    supportRequests: department.supportRequests ?? false,
    requestsProducts: department.requestsProducts ?? false,
    createdAt: EMPTY_TIMESTAMP,
    updatedAt: EMPTY_TIMESTAMP,
  }
}

export function mapGqlVisitDepartment(department: GqlVisitDepartment): VisitDepartment {
  const mappedDepartment = department.department
    ? mapGqlDepartmentSummary(department.department)
    : {
        id: "",
        name: "",
        insurancePolicyMode: DepartmentInsurancePolicyMode.ALL,
        insurancePolicies: [],
        defaultProducts: [],
        nursing: false,
        supportRequests: false,
        requestsProducts: false,
        createdAt: EMPTY_TIMESTAMP,
        updatedAt: EMPTY_TIMESTAMP,
      }

  return {
    id: department.id,
    department: mappedDepartment,
    status: department.status as VisitDepartment["status"],
    encounterType: parseEncounterType(department.encounterType),
    completedAt: department.completedAt,
    processors: (department.processors || [])
      .map(mapGqlWorkerRef)
      .filter((worker): worker is Worker => Boolean(worker)),
    childVisitDepartments: (department.childVisitDepartments || []).map(mapGqlVisitDepartment),
    products: (department.products || []).map(mapGqlVisitDepartmentProduct),
    diagnostics: (department.diagnostics || []).map((diagnosis) => ({
      id: String(diagnosis.id),
      diagnosisName: String(diagnosis.diagnosisName || ""),
      icd11Code: diagnosis.icd11Code,
      createdAt: diagnosis.createdAt || EMPTY_TIMESTAMP,
    })),
    medications: (department.medications || []).map((medication) => ({
      id: String(medication.id),
      medicationName: String(medication.medicationName || ""),
      instructions: String(medication.instructions || ""),
      createdAt: medication.createdAt || EMPTY_TIMESTAMP,
    })),
    preInstructions: [],
    createdAt: department.createdAt || EMPTY_TIMESTAMP,
    updatedAt: department.updatedAt || EMPTY_TIMESTAMP,
  }
}

export function mapGqlVisit(
  visit: GqlVisit,
  options?: { patientMapper?: (patient: GqlPatient) => Patient },
): Visit {
  const patient = options?.patientMapper
    ? options.patientMapper(visit.patient)
    : mapGqlPatient(visit.patient)

  return {
    id: visit.id,
    patient,
    status: visit.status as Visit["status"],
    visitDate: visit.visitDate,
    linkedInsurances: (visit.linkedInsurances || []).map((insurance) =>
      mapGqlPatientInsurance(insurance, patient),
    ),
    departments: (visit.departments || []).map(mapGqlVisitDepartment),
    vitalSigns: [],
  }
}

export function mapGqlVisitListItem(visit: GqlVisit): Visit {
  const patient = visit.patient.dateOfBirth
    ? mapGqlPatient(visit.patient)
    : mapGqlPatientSummary(visit.patient)

  return mapGqlVisit({ ...visit, patient }, { patientMapper: () => patient })
}
