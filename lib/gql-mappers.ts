/**
 * Maps GraphQL response shapes to canonical types in lib/api-types.ts.
 * All visit/patient/product hooks should use these mappers — no parallel entity types.
 */

import {
  AccountStatus,
  type BillingState,
  DepartmentInsurancePolicyMode,
  EncounterType,
  type ExemptionType,
  Gender,
  RoleName,
  type Department,
  type InsuranceCoverage,
  type InsuranceProvider,
  type Patient,
  type PatientInsurance,
  type Product,
  type ProductInsuranceCoverage,
  type ProductType,
  type ProductUnit,
  type Visit,
  type VisitDepartment,
  VisitDepartmentDiagnosisType,
  type VisitDepartmentProduct,
  type VisitProductStatus,
  type Worker,
  type LastDepartmentVisitInfo,
  type LastPatientDepartmentVisitOutput,
} from "@/lib/api-types";

const EMPTY_TIMESTAMP = "";

export type GqlInsuranceCoverage = {
  id: string;
  insuranceProviderId: string;
  insuranceProviderName: string;
  departmentId?: string | null;
  departmentName?: string | null;
  encounterType?: string | null;
  patientSharePercentage: number;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type GqlInsuranceProvider = {
  id: string;
  insuranceName: string;
  acronym?: string | null;
  coverages?: GqlInsuranceCoverage[] | null;
  supportedByClinic?: boolean | null;
  iconUrl?: string | null;
};

export type GqlPatientInsurance = {
  id: string;
  insuranceCardNumber: string;
  providingCompanyOrEmployer?: string | null;
  principalMember?: boolean | null;
  principalMemberName?: string | null;
  principalMemberPhoneNumber?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
  deactivated?: boolean | null;
  patientSharePercentage?: number | null;
  patientShareCoverageId?: string | null;
  insuranceProvider: GqlInsuranceProvider;
  patient?: { id: string } | null;
};

export type GqlPatient = {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
  patientIdentifier?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  primaryPhoneNumber?: string | null;
  alternativePhone?: string | null;
  cell?: string | null;
  village?: string | null;
  city?: string | null;
  district?: string | null;
  postalAddress?: string | null;
  nationalIdNumber?: string | null;
  passportNumber?: string | null;
  emergencyContactName?: string | null;
  emergencyContactRelationship?: string | null;
  emergencyContactPhoneNumber?: string | null;
  patientInsurances?: GqlPatientInsurance[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type GqlWorkerRef = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  username?: string | null;
};

export type GqlWorker = GqlWorkerRef & {
  accountStatus?: string | null;
  roles?: string[] | null;
  departments?: Array<{ id: string; name: string }> | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  profilePhotoUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type GqlCoverage = {
  id: string;
  insuranceProvider?: GqlInsuranceProvider | null;
  cost?: number | null;
  covered?: boolean | null;
  requireMedicalAdvisor?: boolean | null;
  mustPrescribedBy?: string | null;
  drugAdministrationFrequency?: string | null;
  authorizationRequestReasons?: string[] | null;
};

export type GqlProduct = {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  genericName?: string | null;
  type?: string | null;
  unit?: string | null;
  privateRhicPrice?: number | null;
  clinicPrice?: number | null;
  notPaid?: boolean | null;
  quantifiable?: boolean | null;
  insuranceCoverages?: GqlCoverage[] | null;
};

export type GqlVisitDepartmentProduct = {
  id: string;
  product?: GqlProduct | null;
  quantity: number;
  status: string;
  billingState?: string | null;
  exemptionMode?: string | null;
  source?: string | null;
  addedBy?: GqlWorkerRef | null;
  billedBy?: GqlWorkerRef | null;
  confirmedBy?: GqlWorkerRef | null;
  billingConfirmationStatus?: string | null;
  processor?: GqlWorkerRef | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type GqlVisitDepartment = {
  id: string;
  status: string;
  encounterType?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  addedBy?: GqlWorkerRef | null;
  completedBy?: GqlWorkerRef | null;
  processors?: GqlWorkerRef[] | null;
  profile?: {
    id: string;
    name: string;
    encounterType?: string | null;
    isDefault?: boolean | null;
    products?: GqlProduct[] | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
  departmentTemplate?: {
    id: string;
    name: string;
    encounterType?: string | null;
    isDefault?: boolean | null;
    products?: GqlProduct[] | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
  childVisitDepartments?: GqlVisitDepartment[] | null;
  diagnostics?: Array<{
    id: string;
    diagnosisName: string;
    icd11Code?: string | null;
    type?: VisitDepartmentDiagnosisType | null;
    notes?: string | null;
    createdAt?: string | null;
  }> | null;
  symptoms?: Array<{
    id: string;
    symptomName: string;
    sonomedId?: string | null;
    notes?: string | null;
    createdAt?: string | null;
  }> | null;
  medications?: Array<{
    id: string;
    medicationName: string;
    instructions: string;
    createdAt?: string | null;
  }> | null;
  products?: GqlVisitDepartmentProduct[] | null;
  preInstructions?: unknown[] | null;
  department?: {
    id: string;
    name: string;
    insurancePolicyMode?: string | null;
    requestsProducts?: boolean | null;
    nursing?: boolean | null;
    supportRequests?: boolean | null;
    profiles?: Array<{
      id: string;
      name: string;
      encounterType?: string | null;
      isDefault?: boolean | null;
      products?: GqlProduct[] | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    }> | null;
  } | null;
  answerId?: string | null;
  hasFinalizedConsultationAnswers?: boolean | null;
  hasBillableProducts?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type GqlVisit = {
  id: string;
  visitDate: string;
  status: string;
  vitalSigns?: unknown[] | null;
  linkedInsurances?: GqlPatientInsurance[] | null;
  patient: GqlPatient;
  departments?: GqlVisitDepartment[] | null;
  estimatedTotal?: number | null;
  estimatedInsurancePay?: number | null;
  estimatedPatientPay?: number | null;
  quickBillEligible?: boolean | null;
};

function parseGender(value?: string | null): Gender {
  const normalized = String(value || "").toUpperCase();
  if (normalized === Gender.MALE || normalized === "M") return Gender.MALE;
  if (normalized === Gender.FEMALE || normalized === "F") return Gender.FEMALE;
  if (normalized === Gender.OTHER) return Gender.OTHER;
  return Gender.OTHER;
}

function parseEncounterType(value?: string | null): EncounterType {
  const normalized = String(value || "").toUpperCase();
  if (normalized in EncounterType) {
    return EncounterType[normalized as keyof typeof EncounterType];
  }
  return EncounterType.OUTPATIENT;
}

export function mapGqlInsuranceCoverage(
  rule: GqlInsuranceCoverage,
): InsuranceCoverage {
  return {
    id: rule.id,
    insuranceProviderId: rule.insuranceProviderId,
    insuranceProviderName: rule.insuranceProviderName,
    departmentId: rule.departmentId ?? null,
    departmentName: rule.departmentName ?? null,
    encounterType: rule.encounterType ? parseEncounterType(rule.encounterType) : null,
    patientSharePercentage: Number(rule.patientSharePercentage ?? 0),
    createdAt: rule.createdAt || EMPTY_TIMESTAMP,
    updatedAt: rule.updatedAt || EMPTY_TIMESTAMP,
  };
}

export function mapGqlInsuranceProvider(
  provider: GqlInsuranceProvider,
): InsuranceProvider {
  return {
    id: provider.id,
    insuranceName: provider.insuranceName,
    acronym: provider.acronym,
    coverages: (provider.coverages || []).map(mapGqlInsuranceCoverage),
    supportedByClinic: provider.supportedByClinic ?? true,
    iconUrl: provider.iconUrl,
    createdAt: EMPTY_TIMESTAMP,
    updatedAt: EMPTY_TIMESTAMP,
    name: provider.insuranceName,
  };
}

export function mapGqlProductInsuranceCoverage(
  coverage: GqlCoverage,
): ProductInsuranceCoverage {
  return {
    id: String(coverage.id || ""),
    insuranceProvider: mapGqlInsuranceProvider(
      coverage.insuranceProvider || { id: "", insuranceName: "" },
    ),
    cost: Number(coverage.cost ?? 0),
    covered: Boolean(coverage.covered),
    notPaid: Boolean((coverage as Record<string, unknown>).notPaid),
    requireMedicalAdvisor: Boolean(coverage.requireMedicalAdvisor),
    mustPrescribedBy:
      coverage.mustPrescribedBy as ProductInsuranceCoverage["mustPrescribedBy"],
    drugAdministrationFrequency:
      coverage.drugAdministrationFrequency as ProductInsuranceCoverage["drugAdministrationFrequency"],
    authorizationRequestReasons: coverage.authorizationRequestReasons || [],
    createdAt: EMPTY_TIMESTAMP,
    updatedAt: EMPTY_TIMESTAMP,
  };
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
    notPaid: Boolean((product as Record<string, unknown>).notPaid),
    quantifiable: product.quantifiable !== false,
    insuranceCoverages: (product.insuranceCoverages || []).map(
      mapGqlProductInsuranceCoverage,
    ),
    createdAt: EMPTY_TIMESTAMP,
    updatedAt: EMPTY_TIMESTAMP,
  };
}

export function mapGqlWorkerRef(
  worker?: GqlWorkerRef | null,
): Worker | undefined {
  if (!worker?.id) return undefined;
  const firstName = worker.firstName || "";
  const lastName = worker.lastName;
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
    name:
      [firstName, lastName].filter(Boolean).join(" ") ||
      worker.email ||
      undefined,
  };
}

function parseAccountStatus(value?: string | null): AccountStatus {
  const normalized = String(value || "").toUpperCase();
  if (normalized in AccountStatus) {
    return AccountStatus[normalized as keyof typeof AccountStatus];
  }
  return AccountStatus.PENDING;
}

export function mapGqlWorker(worker?: GqlWorker | null): Worker {
  const ref = mapGqlWorkerRef(worker);
  if (!ref) {
    return {
      id: "",
      firstName: "",
      accountStatus: AccountStatus.PENDING,
      roles: [],
      departments: [],
      createdAt: EMPTY_TIMESTAMP,
      updatedAt: EMPTY_TIMESTAMP,
    };
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
    dateOfBirth: worker?.dateOfBirth || undefined,
    gender: worker?.gender || undefined,
    profilePhotoUrl: worker?.profilePhotoUrl || undefined,
    createdAt: worker?.createdAt || EMPTY_TIMESTAMP,
    updatedAt: worker?.updatedAt || EMPTY_TIMESTAMP,
  };
}

export function mapGqlPatient(patient: GqlPatient): Patient {
  const mapped: Patient = {
    id: patient.id,
    firstName: patient.firstName,
    middleName: patient.middleName,
    lastName: patient.lastName,
    patientIdentifier: patient.patientIdentifier,
    dateOfBirth: patient.dateOfBirth || EMPTY_TIMESTAMP,
    gender: parseGender(patient.gender),
    primaryPhoneNumber: patient.primaryPhoneNumber,
    alternativePhone: patient.alternativePhone,
    cell: patient.cell,
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
  };
  mapped.patientInsurances = (patient.patientInsurances || []).map(
    (insurance) => mapGqlPatientInsurance(insurance, mapped),
  );
  return mapped;
}

export function mapGqlPatientSummary(patient: {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
  patientIdentifier?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  age?: number | null;
  primaryPhoneNumber?: string | null;
  district?: string | null;
  cell?: string | null;
  village?: string | null;
  nationalIdNumber?: string | null;
}): Patient {
  return {
    id: patient.id,
    firstName: patient.firstName,
    middleName: patient.middleName || undefined,
    lastName: patient.lastName,
    patientIdentifier: patient.patientIdentifier,
    dateOfBirth: patient.dateOfBirth || EMPTY_TIMESTAMP,
    age: patient.age ?? null,
    gender: parseGender(patient.gender),
    primaryPhoneNumber: patient.primaryPhoneNumber,
    district: patient.district,
    cell: patient.cell,
    village: patient.village,
    nationalIdNumber: patient.nationalIdNumber,
    patientInsurances: [],
    createdAt: EMPTY_TIMESTAMP,
    updatedAt: EMPTY_TIMESTAMP,
  };
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
    deactivated: Boolean(insurance.deactivated),
    patientSharePercentage: insurance.patientSharePercentage ?? null,
    patientShareCoverageId: insurance.patientShareCoverageId ?? null,
    createdAt: EMPTY_TIMESTAMP,
    updatedAt: EMPTY_TIMESTAMP,
  };
}

export function mapGqlVisitDepartmentProduct(
  item: GqlVisitDepartmentProduct,
): VisitDepartmentProduct {    const product = item.product
    ? mapGqlProduct(item.product)
    : {
        id: "",
        name: "",
        code: "",
        description: "",
        type: "MEDICAL_ACT" as ProductType,
        unit: "UNKNOWN" as ProductUnit,
        notPaid: false,
        insuranceCoverages: [],
        createdAt: EMPTY_TIMESTAMP,
        updatedAt: EMPTY_TIMESTAMP,
      };

  return {
    id: item.id,
    product,
    quantity: Number(item.quantity ?? 0),
    status: item.status as VisitProductStatus,
    billingState: (item.billingState as BillingState | undefined) || null,
    exemptionMode: (item.exemptionMode as ExemptionType | undefined) || null,
    source: (item.source as VisitDepartmentProduct["source"]) || null,
    addedBy: mapGqlWorkerRef(item.addedBy),
    billedBy: mapGqlWorkerRef(item.billedBy),
    confirmedBy: mapGqlWorkerRef(item.confirmedBy),
    billingConfirmationStatus: (item.billingConfirmationStatus as any) || null,
    processor: mapGqlWorkerRef(item.processor),
    billingItem: (item as any).billingItem
      ? {
          id: String((item as any).billingItem.id),
          visitDepartmentProductId: String((item as any).billingItem.visitDepartmentProductId || item.id),
          productId: String((item as any).billingItem.productId || (item.product?.id ?? "")),
          productName: String((item as any).billingItem.productName || (item.product?.name ?? "")),
          unitPriceSnapshot: Number((item as any).billingItem.unitPriceSnapshot ?? 0),
          quantitySnapshot: Number((item as any).billingItem.quantitySnapshot ?? item.quantity ?? 0),
          insuranceCoveredAmount: Number((item as any).billingItem.insuranceCoveredAmount ?? 0),
          patientPayableAmount: Number((item as any).billingItem.patientPayableAmount ?? 0),
          appliedPatientSharePct: (item as any).billingItem.appliedPatientSharePct ?? null,
          patientShareSource: (item as any).billingItem.patientShareSource ?? null,
          createdAt: (item as any).billingItem.createdAt || EMPTY_TIMESTAMP,
          updatedAt: (item as any).billingItem.updatedAt || EMPTY_TIMESTAMP,
        }
      : null,
    createdAt: item.createdAt || EMPTY_TIMESTAMP,
    updatedAt: item.updatedAt || EMPTY_TIMESTAMP,
  };
}

export function mapGqlDepartmentSummary(
  department: NonNullable<GqlVisitDepartment["department"]>,
): Department {
  return {
    id: department.id,
    name: department.name,
    insurancePolicyMode:
      (department.insurancePolicyMode as DepartmentInsurancePolicyMode) ||
      DepartmentInsurancePolicyMode.ALL,
    insurancePolicies: [],
    profiles: (department.profiles || []).map((profile) => ({
      id: profile.id,
      name: profile.name,
      encounterType: parseEncounterType(profile.encounterType),
      isDefault: Boolean(profile.isDefault),
      products: (profile.products || []).map(mapGqlProduct),
      createdAt: profile.createdAt || EMPTY_TIMESTAMP,
      updatedAt: profile.updatedAt || EMPTY_TIMESTAMP,
    })),
    nursing: department.nursing ?? false,
    supportRequests: department.supportRequests ?? false,
    requestsProducts: department.requestsProducts ?? false,
    createdAt: EMPTY_TIMESTAMP,
    updatedAt: EMPTY_TIMESTAMP,
  };
}

export function mapGqlVisitDepartment(
  dept: GqlVisitDepartment,
): VisitDepartment {
  const mappedDepartment = dept.department
    ? mapGqlDepartmentSummary(dept.department)
    : {
        id: "",
        name: "",
        insurancePolicyMode: DepartmentInsurancePolicyMode.ALL,
        insurancePolicies: [],
        profiles: [],
        nursing: false,
        supportRequests: false,
        requestsProducts: false,
        createdAt: EMPTY_TIMESTAMP,
        updatedAt: EMPTY_TIMESTAMP,
      };

  return {
    id: dept.id,
    department: mappedDepartment,
    status: dept.status as VisitDepartment["status"],
    encounterType: parseEncounterType(dept.encounterType),
    profile: dept.profile
      ? {
          id: dept.profile.id,
          name: dept.profile.name,
          encounterType: parseEncounterType(dept.profile.encounterType),
          isDefault: Boolean(dept.profile.isDefault),
          products: (dept.profile.products || []).map(mapGqlProduct),
          createdAt: dept.profile.createdAt || EMPTY_TIMESTAMP,
          updatedAt: dept.profile.updatedAt || EMPTY_TIMESTAMP,
        }
      : null,
    startedAt: dept.startedAt ?? null,
    completedAt: dept.completedAt,
    addedBy: mapGqlWorkerRef(dept.addedBy),
    completedBy: mapGqlWorkerRef(dept.completedBy),
    processors: (dept.processors || [])
      .map(mapGqlWorkerRef)
      .filter((worker): worker is Worker => Boolean(worker)),
    childVisitDepartments: (dept.childVisitDepartments || []).map(
      mapGqlVisitDepartment,
    ),
    products: (dept.products || []).map(mapGqlVisitDepartmentProduct),
    diagnostics: (dept.diagnostics || []).map((diagnosis) => ({
      id: String(diagnosis.id),
      diagnosisName: String(diagnosis.diagnosisName || ""),
      icd11Code: diagnosis.icd11Code,
      type: diagnosis.type || VisitDepartmentDiagnosisType.FINAL,
      notes: diagnosis.notes || "",
      createdAt: diagnosis.createdAt || EMPTY_TIMESTAMP,
    })),
    symptoms: (dept.symptoms || []).map((symptom) => ({
      id: String(symptom.id),
      symptomName: symptom.symptomName || "",
      sonomedId: symptom.sonomedId || null,
      notes: symptom.notes || "",
      createdAt: symptom.createdAt || EMPTY_TIMESTAMP,
    })),
    medications: (dept.medications || []).map((medication) => ({
      id: String(medication.id),
      medicationName: String(medication.medicationName || ""),
      instructions: String(medication.instructions || ""),
      createdAt: medication.createdAt || EMPTY_TIMESTAMP,
    })),
    preInstructions: ((dept.preInstructions || []) as any[]).map((pi: any) => ({
      id: String(pi.id || ""),
      type: String(pi.type || ""),
      note: pi.note || null,
      addedBy: mapGqlWorkerRef(pi.addedBy),
      medications: [],
      products: [],
      createdAt: pi.createdAt || EMPTY_TIMESTAMP,
    })),
    notes: (dept as any).notes
      ? {
          totalNotes: Number((dept as any).notes.totalNotes || 0),
          newNotes: Number((dept as any).notes.newNotes || 0),
        }
      : null,
    billing: (dept as any).billing
      ? {
          id: String((dept as any).billing.id),
          visitDepartment: null as any,
          status: (dept as any).billing.status,
          totalAmount: Number((dept as any).billing.totalAmount ?? 0),
          insuranceCoveredAmount: Number((dept as any).billing.insuranceCoveredAmount ?? 0),
          patientPayableAmount: Number((dept as any).billing.patientPayableAmount ?? 0),
          paidAmount: Number((dept as any).billing.paidAmount ?? 0),
          outstandingAmount: Number((dept as any).billing.outstandingAmount ?? 0),
          payments: [],
          insuranceBillings: ((dept as any).billing.insuranceBillings || []).map((ib: any) => ({
            id: String(ib.id),
            patientInsurance: ib.patientInsurance ? mapGqlPatientInsurance(ib.patientInsurance, null as any) : null,
            status: ib.status,
            totalAmount: Number(ib.totalAmount ?? 0),
            insuranceCoveredAmount: Number(ib.insuranceCoveredAmount ?? 0),
            patientPayableAmount: Number(ib.patientPayableAmount ?? 0),
            paidAmount: Number(ib.paidAmount ?? 0),
            outstandingAmount: Number(ib.outstandingAmount ?? 0),
            outstandingType: ib.outstandingType ?? null,
            outstandingReason: ib.outstandingReason ?? null,
            items: [],
            createdAt: ib.createdAt || EMPTY_TIMESTAMP,
            updatedAt: ib.updatedAt || EMPTY_TIMESTAMP,
          })),
          createdAt: (dept as any).billing.createdAt || EMPTY_TIMESTAMP,
          updatedAt: (dept as any).billing.updatedAt || EMPTY_TIMESTAMP,
        }
      : null,
    answerId: dept.answerId ?? null,
    hasFinalizedConsultationAnswers: dept.hasFinalizedConsultationAnswers ?? null,
    hasBillableProducts: dept.hasBillableProducts ?? null,
    createdAt: dept.createdAt || EMPTY_TIMESTAMP,
    updatedAt: dept.updatedAt || EMPTY_TIMESTAMP,
  };
}

export function mapGqlLastDepartmentVisitInfo(
  input?: {
    visitId?: string | null;
    visitDepartment?: GqlVisitDepartment | null;
  } | null,
): LastDepartmentVisitInfo | null {
  if (!input?.visitId || !input?.visitDepartment) return null;
  return {
    visitId: String(input.visitId),
    visitDepartment: mapGqlVisitDepartment(input.visitDepartment),
  };
}

export function mapGqlLastPatientDepartmentVisitOutput(
  input?: {
    lastVisit?: GqlVisit | null;
    lastDepartmentVisit?: {
      visitId?: string | null;
      visitDepartment?: GqlVisitDepartment | null;
    } | null;
  } | null,
): LastPatientDepartmentVisitOutput | null {
  if (!input) return null;
  return {
    lastVisit: input.lastVisit ? mapGqlVisit(input.lastVisit) : null,
    lastDepartmentVisit: mapGqlLastDepartmentVisitInfo(
      input.lastDepartmentVisit,
    ),
  };
}

export function mapGqlVisit(
  visit: GqlVisit,
  options?: { patientMapper?: (patient: GqlPatient) => Patient },
): Visit {
  const patient = options?.patientMapper
    ? options.patientMapper(visit.patient)
    : mapGqlPatient(visit.patient);

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
    estimatedTotal: visit.estimatedTotal ?? null,
    estimatedInsurancePay: visit.estimatedInsurancePay ?? null,
    estimatedPatientPay: visit.estimatedPatientPay ?? null,
    quickBillEligible: visit.quickBillEligible ?? null,
  };
}

export function mapGqlVisitListItem(visit: GqlVisit): Visit {
  const patient = visit.patient.dateOfBirth
    ? mapGqlPatient(visit.patient)
    : mapGqlPatientSummary(visit.patient);

  return mapGqlVisit({ ...visit, patient }, { patientMapper: () => patient });
}
