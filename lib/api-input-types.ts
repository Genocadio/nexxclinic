/**
 * api-input-types.ts - Input/Mutation types aligned with GraphQL schema
 * Contains all input types for mutations and queries.
 * This consolidates scattered input types from across the codebase.
 */

import type {
  Gender,
  DocumentType,
  RoleName,
  ProductType,
  ProductUnit,
  MustPrescribedBy,
  DrugAdministrationFrequency,
  DepartmentInsurancePolicyMode,
  EncounterType,
  VisitProductStatus,
  VisitDepartmentStatus,
  TableMode,
  ConditionalCondition,
  FieldType,
  AnswerStatus,
  VisitStatus,
  PaymentMethod,
} from "./api-types"

// ============================================
// WORKER/USER INPUT TYPES
// ============================================

export interface WorkerDocumentInput {
  type?: DocumentType
  title?: string
  isRequired?: boolean
  documentUrl?: string
  documentNumber?: string
  hasExpiration?: boolean
  expirationDate?: string
  issuedBy?: string
  issuedDate?: string
  notes?: string
}

export interface SelfRegisterInput {
  firstName: string
  lastName?: string
  gender?: Gender
  dateOfBirth?: string
  profilePhotoUrl?: string
  email?: string
  phoneNumber?: string
  username?: string
  departmentIds?: string[]
  password: string
  workerDocProfile?: WorkerDocumentInput
}

export interface AdminCreateUserInput {
  firstName: string
  lastName?: string
  gender?: Gender
  dateOfBirth?: string
  profilePhotoUrl?: string
  email?: string
  phoneNumber?: string
  username?: string
  departmentIds?: string[]
  roles: RoleName[]
  workerDocProfile?: WorkerDocumentInput
}

export interface AdminUpdateUserInput {
  firstName?: string
  lastName?: string
  gender?: Gender
  dateOfBirth?: string
  profilePhotoUrl?: string
  email?: string
  phoneNumber?: string
  username?: string
  departmentIds?: string[]
  roles?: RoleName[]
  workerDocProfile?: WorkerDocumentInput
}

export interface ActivateUserInput {
  userId: string
  roles: RoleName[]
}

export interface DeactivateUserInput {
  userId: string
  revokeSessions?: boolean
}

// ============================================
// AUTHENTICATION INPUT TYPES
// ============================================

export interface LoginInput {
  identifier: string
  password: string
}

export interface SetInitialPasswordInput {
  identifier: string
  newPassword: string
}

export interface RefreshSessionInput {
  refreshToken: string
}

export interface RefreshTokenInput {
  refreshToken: string
}

export interface LogoutInput {
  refreshToken?: string
  revokeAllSessions?: boolean
}

export interface UpdateMyProfileInput {
  firstName?: string
  lastName?: string
  gender?: Gender
  dateOfBirth?: string
  profilePhotoUrl?: string
  email?: string
  phoneNumber?: string
  username?: string
  departmentIds?: string[]
  workerDocProfile?: WorkerDocumentInput
}

export interface ChangeMyPasswordInput {
  currentPassword: string
  newPassword: string
}

export interface AdminTriggerPasswordResetInput {
  userId: string
  revokeSessions?: boolean
}

export interface AdminSetUserSessionLimitInput {
  userId: string
  maxActiveSessions: number
}

// ============================================
// INSURANCE INPUT TYPES
// ============================================

export interface CreateInsuranceProviderInput {
  insuranceName: string
  acronym?: string
  defaultCoveragePercentage: number
  supportedByClinic?: boolean
  iconUrl?: string
}

export interface UpdateInsuranceProviderInput {
  insuranceName?: string
  acronym?: string
  defaultCoveragePercentage?: number
  supportedByClinic?: boolean
  iconUrl?: string
}

export interface SearchInsuranceProvidersInput {
  query?: string
  supportedByClinic?: boolean
  page?: number
  size?: number
}

// ============================================
// PATIENT INPUT TYPES
// ============================================

export interface CreatePatientInput {
  firstName: string
  middleName?: string
  lastName?: string
  dateOfBirth: string
  gender: Gender
  primaryPhoneNumber?: string
  alternativePhone?: string
  village?: string
  city?: string
  district?: string
  postalAddress?: string
  nationalIdNumber?: string
  passportNumber?: string
  emergencyContactName?: string
  emergencyContactRelationship?: string
  emergencyContactPhoneNumber?: string
  insurances?: CreatePatientInsuranceInput[]
}

export interface UpdatePatientInput {
  firstName?: string
  middleName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: Gender
  primaryPhoneNumber?: string
  alternativePhone?: string
  village?: string
  city?: string
  district?: string
  postalAddress?: string
  nationalIdNumber?: string
  passportNumber?: string
  emergencyContactName?: string
  emergencyContactRelationship?: string
  emergencyContactPhoneNumber?: string
}

export interface SearchPatientsInput {
  name?: string
  phoneNumber?: string
  insuranceProviderId?: string
  age?: number
  minAge?: number
  maxAge?: number
  page?: number
  size?: number
}

// ============================================
// PATIENT INSURANCE INPUT TYPES
// ============================================

export interface CreatePatientInsuranceInput {
  patientId?: string
  insuranceProviderId: string
  insuranceCardNumber: string
  providingCompanyOrEmployer?: string
  principalMember: boolean
  principalMemberName?: string
  principalMemberPhoneNumber?: string
  validFrom: string
  validUntil: string
}

export interface UpdatePatientInsuranceInput {
  patientId?: string
  insuranceProviderId?: string
  insuranceCardNumber?: string
  providingCompanyOrEmployer?: string
  principalMember?: boolean
  principalMemberName?: string
  principalMemberPhoneNumber?: string
  validFrom?: string
  validUntil?: string
}

// ============================================
// PRODUCT INPUT TYPES
// ============================================

export interface CreateProductInsuranceCoverageInput {
  insuranceProviderId: string
  cost?: number
  covered?: boolean
  requireMedicalAdvisor?: boolean
  mustPrescribedBy?: MustPrescribedBy
  drugAdministrationFrequency?: DrugAdministrationFrequency
  authorizationRequestReasons?: string[]
}

export interface UpdateProductInsuranceCoverageInput {
  insuranceProviderId: string
  cost?: number
  covered?: boolean
  requireMedicalAdvisor?: boolean
  mustPrescribedBy?: MustPrescribedBy
  drugAdministrationFrequency?: DrugAdministrationFrequency
  authorizationRequestReasons?: string[]
}

export interface CreateProductInput {
  id?: string
  name: string
  genericName?: string
  code: string
  description: string
  type: ProductType
  unit: ProductUnit
  metadata?: Record<string, unknown>
  privateRhicPrice?: number
  clinicPrice?: number
  insuranceCoverages?: CreateProductInsuranceCoverageInput[]
}

export interface UpdateProductInput {
  name?: string
  genericName?: string
  code?: string
  description?: string
  type?: ProductType
  unit?: ProductUnit
  metadata?: Record<string, unknown>
  privateRhicPrice?: number
  clinicPrice?: number
  insuranceCoverages?: UpdateProductInsuranceCoverageInput[]
}

export interface SearchProductsInput {
  name?: string
  type?: ProductType
  page?: number
  size?: number
}

// ============================================
// DEPARTMENT INPUT TYPES
// ============================================

export interface CreateDepartmentInput {
  name: string
  insurancePolicyMode?: DepartmentInsurancePolicyMode
  insuranceProviderIds?: string[]
  defaultProductIds?: string[]
  nursing?: boolean
  supportRequests?: boolean
  requestsProducts?: boolean
}

export interface UpdateDepartmentInput {
  name?: string
  insurancePolicyMode?: DepartmentInsurancePolicyMode
  insuranceProviderIds?: string[]
  defaultProductIds?: string[]
  nursing?: boolean
  supportRequests?: boolean
  requestsProducts?: boolean
}

export interface SearchDepartmentsInput {
  name?: string
  supportRequests?: boolean
  requestsProducts?: boolean
  page?: number
  size?: number
}

// ============================================
// VISIT INPUT TYPES
// ============================================

export interface CreateVisitInput {
  patientId: string
  visitDate?: string
  linkedPatientInsuranceIds?: string[]
  departments?: CreateVisitDepartmentInput[]
}

export interface ChangeVisitDateInput {
  visitId: string
  visitDate: string
}

export interface CreateVisitDepartmentInput {
  departmentId: string
  encounterType?: EncounterType
  products?: CreateVisitDepartmentProductItemInput[]
}

export interface CreateVisitDepartmentProductItemInput {
  productId: string
  processorId?: string
  quantity?: number
  price?: number
  status?: VisitProductStatus
}

export interface CreateVisitDepartmentProductInput {
  visitId: string
  departmentId: string
  productId: string
  processorId?: string
  quantity?: number
  price?: number
  status?: VisitProductStatus
}

export interface AddChildVisitDepartmentProductInput {
  productId: string
  quantity: number
}

export interface AddChildVisitDepartmentInput {
  parentVisitDepartmentId: string
  departmentId: string
  products: AddChildVisitDepartmentProductInput[]
  processorId?: string
  encounterType?: EncounterType
}

export interface UpdateVisitDepartmentProductStatusInput {
  visitDepartmentProductId: string
  status: VisitProductStatus
}

export interface UpdateVisitDepartmentStatusInput {
  visitDepartmentId: string
  status: VisitDepartmentStatus
}

export interface UpdateVisitDepartmentProductQuantityInput {
  visitDepartmentProductId: string
  quantity: number
}

export interface SearchVisitsInput {
  visitDate?: string
  status?: VisitStatus
  patientName?: string
  page?: number
  size?: number
}

export interface SearchPatientHistoryInput {
  year?: number
  month?: number
  day?: number
  startDate?: string
  endDate?: string
  startMonth?: string
  endMonth?: string
  startYear?: number
  endYear?: number
  departmentIds?: string[]
  page?: number
  size?: number
}

// ============================================
// BILLING INPUT TYPES
// ============================================

export interface BillingPaymentInput {
  amount: number
  paymentMethod: PaymentMethod
  reference?: string
}

export interface BillVisitDepartmentProductInput {
  visitDepartmentProductId: string
  parentVisitDepartmentId?: string
  patientInsuranceId?: string
  quantity?: number
  unitPrice?: number
  isExempted?: boolean
}

export interface BillVisitDepartmentInput {
  visitDepartmentId: string
  products: BillVisitDepartmentProductInput[]
  payments?: BillingPaymentInput[]
}

export interface BillVisitInput {
  visitId: string
  departments: BillVisitDepartmentInput[]
}

export interface RecordVisitBillingPaymentInput {
  departmentInsuranceBillingId: string
  amount: number
  paymentMethod: PaymentMethod
  reference?: string
}

// ============================================
// VITAL SIGNS INPUT TYPES
// ============================================

export interface AddVisitVitalSignItemInput {
  measurementName: string
  value: string
  unit: string
}

export interface AddVisitVitalSignsInput {
  visitId: string
  vitalSigns: AddVisitVitalSignItemInput[]
}

// ============================================
// PRE-INSTRUCTION INPUT TYPES
// ============================================

export interface AddVisitPreInstructionMedicationInput {
  medName: string
  dosage?: string
  route?: string
  frequency?: string
  duration?: string
  quantity?: string
  otherInstructions?: string
}

export interface AddVisitPreInstructionProductInput {
  productId: string
  quantity?: number
}

export interface AddVisitPreInstructionItemInput {
  type: string
  note?: string
  medications?: AddVisitPreInstructionMedicationInput[]
  products?: AddVisitPreInstructionProductInput[]
}

export interface AddVisitPreInstructionsInput {
  visitDepartmentId: string
  items: AddVisitPreInstructionItemInput[]
}

// ============================================
// DIAGNOSIS & MEDICATION INPUT TYPES
// ============================================

export interface AddDiagnosisInput {
  visitDepartmentId: string
  diagnosisName: string
  icd11Code?: string
}

export interface AddMedicationInput {
  visitDepartmentId: string
  medicationName: string
  instructions: string
}

// ============================================
// FORM INPUT TYPES
// ============================================

export interface ConditionalRenderingInput {
  dependsOn: string
  condition: ConditionalCondition
  value?: string
  itemType?: string
}

export interface TableConfigInput {
  mode: TableMode
  rows?: number
  columns?: number
  headerPlacement?: string
  columnHeaders?: string[]
  rowHeaders?: string[]
}

export interface LabRecordRowInput {
  id?: string
  name: string
  unitMode?: string
  unitOptions?: string[]
  defaultUnit?: string
  resultOptions?: string[]
}

export interface LabRecordConfigInput {
  layout: string
  rows: LabRecordRowInput[]
}

export interface FormFieldInput {
  id: string
  label: string
  type: FieldType
  placeholder?: string
  required: boolean
  order: number
  hideLabel: boolean
  boldLabel: boolean
  italicLabel: boolean
  underlineLabel: boolean
  centerLabel: boolean
  options?: string[]
  tableConfig?: TableConfigInput
  labRecordConfig?: LabRecordConfigInput
  conditionalRendering?: ConditionalRenderingInput
}

export interface FormSectionInput {
  id: string
  title: string
  boldTitle: boolean
  italicTitle: boolean
  underlineTitle: boolean
  centerTitle: boolean
  columns: number
  order: number
  fields?: FormFieldInput[]
}

export interface FormActionInput {
  id: string
  name: string
  type: string
  quantity: number
  price: number
  isQuantifiable: boolean
  backendId?: string
}

export interface FormInput {
  title: string
  description?: string
  fields?: FormFieldInput[]
  sections?: FormSectionInput[]
  actions?: FormActionInput[]
}

// ============================================
// CONSULTATION ANSWER INPUT TYPES
// ============================================

export interface ConsultationAnswersInput {
  consultationId: string
  visitId: string
  patientId: string
  departmentId: string
  formId: string
  formVersion?: string
  status?: AnswerStatus
  answers?: string
}

// ============================================
// CLINIC INPUT TYPES
// ============================================

export interface KeyValueInput {
  key: string
  value?: string
}

export interface ClinicContactInput {
  contactType: string
  value: string
  description?: string
}

export interface ClinicMetadataInput {
  key: string
  value: string
}

export interface UpdateClinicProfileInput {
  name?: string
  username?: string
  address?: string
  logoUrl?: string
  tinNumber?: string
  contacts?: ClinicContactInput[]
  metadata?: ClinicMetadataInput[]
}
