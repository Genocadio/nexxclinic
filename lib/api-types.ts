/**
 * api-types.ts - Canonical TypeScript types aligned with GraphQL schema
 * This is the single source of truth for all entity types in the application.
 * All other type files should import and re-export from here to maintain consistency.
 */

// ============================================
// ENUMS - Aligned with GraphQL schema
// ============================================

export enum ResponseStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  UNAUTHENTICATED = "UNAUTHENTICATED",
  UNAUTHORISED = "UNAUTHORISED",
  PARTIAL_SUCCESS = "PARTIAL_SUCCESS",
}

export enum RoleName {
  MANAGER = "MANAGER",
  CLINIC_ADMIN = "CLINIC_ADMIN",
  FINANCE = "FINANCE",
  STAFF = "STAFF",
  RECEPTION = "RECEPTION",
  NURSE = "NURSE",
  CLINICIAN = "CLINICIAN",
  ADMIN = "ADMIN",
}

export enum AccountStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum DocumentType {
  LICENSE = "LICENSE",
  DIPLOMA_CERTIFICATE = "DIPLOMA_CERTIFICATE",
  DEGREE_CERTIFICATE = "DEGREE_CERTIFICATE",
  TRAINING_CERTIFICATE = "TRAINING_CERTIFICATE",
  NATIONAL_ID = "NATIONAL_ID",
  PASSPORT = "PASSPORT",
  BACKGROUND_CHECK = "BACKGROUND_CHECK",
  WORK_PERMIT = "WORK_PERMIT",
  OTHER = "OTHER",
}

export enum ProductType {
  DRUG = "DRUG",
  MEDICAL_ACT = "MEDICAL_ACT",
  BIOLOGICAL_ACT = "BIOLOGICAL_ACT",
  CONSUMABLE_DEVICE = "CONSUMABLE_DEVICE",
}

export enum ProductUnit {
  TABLET = "TABLET",
  CAPSULE = "CAPSULE",
  PESSARY = "PESSARY",
  SUPPOSITORY = "SUPPOSITORY",
  BOX_OF_6_TABLETS = "BOX_OF_6_TABLETS",
  BOX_OF_7_PESSARIES = "BOX_OF_7_PESSARIES",
  BOX_OF_9_TABLETS = "BOX_OF_9_TABLETS",
  BOX_OF_12_TABLETS = "BOX_OF_12_TABLETS",
  BOX_OF_12_PESSARIES = "BOX_OF_12_PESSARIES",
  BOX_OF_14_TABLETS = "BOX_OF_14_TABLETS",
  BOX_OF_18_TABLETS = "BOX_OF_18_TABLETS",
  BOX_OF_18_PESSARIES = "BOX_OF_18_PESSARIES",
  BOX_OF_24_TABLETS = "BOX_OF_24_TABLETS",
  BOX_OF_1_PESSARY = "BOX_OF_1_PESSARY",
  BOX_OF_3_PESSARIES = "BOX_OF_3_PESSARIES",
  BOX_OF_6_PESSARIES = "BOX_OF_6_PESSARIES",
  BOTTLE = "BOTTLE",
  VIAL = "VIAL",
  AMPOULE = "AMPOULE",
  TUBE = "TUBE",
  TUBE_OF_15_TABLETS = "TUBE_OF_15_TABLETS",
  TUBE_OF_20_TABLETS = "TUBE_OF_20_TABLETS",
  TUBE_OF_50_STRIPS = "TUBE_OF_50_STRIPS",
  BOX = "BOX",
  SACHET = "SACHET",
  POT = "POT",
  ROLL = "ROLL",
  PIECE = "PIECE",
  DOSE = "DOSE",
  KIT_OF_ONE_DAY_DOSE = "KIT_OF_ONE_DAY_DOSE",
  PCS = "PCS",
  UNKNOWN = "UNKNOWN",
}

export enum MustPrescribedBy {
  ALL = "ALL",
}

export enum DrugAdministrationFrequency {
  CUSTOM_HOURS = "CUSTOM_HOURS",
}

export enum DepartmentInsurancePolicyMode {
  ALL = "ALL",
  ONLY = "ONLY",
  EXCEPT = "EXCEPT",
}

export enum VisitStatus {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum VisitProductStatus {
  BILLED = "BILLED",
  EXEMPTED = "EXEMPTED",
  UNPAID = "UNPAID",
  PENDING = "PENDING",
}

export enum VisitDepartmentStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  ON_HOLD = "ON_HOLD",
  BILLING = "BILLING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum EncounterType {
  OUTPATIENT = "OUTPATIENT",
  INPATIENT_OBSERVATION = "INPATIENT_OBSERVATION",
  INPATIENT_ADMISSION = "INPATIENT_ADMISSION",
}

export enum VisitBillingStatus {
  UNPAID = "UNPAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
}

export enum ClinicContactType {
  PHONE = "PHONE",
  EMAIL = "EMAIL",
  POBOX = "POBOX",
}

export enum FormStatus {
  DRAFT = "DRAFT",
  FINAL = "FINAL",
}

export enum FieldType {
  text = "text",
  email = "email",
  number = "number",
  date = "date",
  textarea = "textarea",
  actionListener = "actionListener",
  select = "select",
  radio = "radio",
  checkbox = "checkbox",
  table = "table",
  labRecord = "labRecord",
  signature = "signature",
  file = "file",
  heading = "heading",
  paragraph = "paragraph",
  diagnosticRecord = "diagnosticRecord",
  medicationLongForm = "medicationLongForm",
  medicationMiniForm = "medicationMiniForm",
}

export enum TableMode {
  STATIC = "STATIC",
  DYNAMIC = "DYNAMIC",
}

export enum ConditionalCondition {
  equals = "equals",
  not_equals = "not_equals",
  contains = "contains",
  not_contains = "not_contains",
  greater_than = "greater_than",
  less_than = "less_than",
  is_empty = "is_empty",
  is_not_empty = "is_not_empty",
  hasItem = "hasItem",
}

export enum AnswerStatus {
  DRAFT = "DRAFT",
  FINAL = "FINAL",
}

export enum VisitPreInstructionProductStatus {
  PENDING = "PENDING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export enum PaymentMethod {
  CASH = "CASH",
  MOBILE_MONEY = "MOBILE_MONEY",
  CARD = "CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  CHEQUE = "CHEQUE",
  MIXED = "MIXED",
}

// ============================================
// RESPONSE INTERFACES
// ============================================

export interface ApiMessage {
  text: string
  type: string
}

export interface ApiResponse<T = unknown> {
  status: ResponseStatus | string
  message?: string
  data?: T
  messages?: ApiMessage[]
}

export interface PaginationInfo {
  total: number
  perPage: number
  currentPage: number
  totalPages: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: PaginationInfo
}

// ============================================
// CORE ENTITIES
// ============================================

/**
 * Worker - Represents a clinic staff member
 * Replaces legacy "User" type - aligned with GraphQL schema
 */
export interface Worker {
  id: string
  firstName: string
  lastName?: string | null
  email?: string | null
  phoneNumber?: string | null
  username?: string | null
  accountStatus: AccountStatus
  roles: RoleName[]
  departments: Department[]
  createdAt: string
  updatedAt: string
  // Legacy field compatibility
  name?: string
  title?: string
}

/**
 * Patient - Represents a clinic patient
 */
export interface Patient {
  id: string
  firstName: string
  middleName?: string | null
  lastName?: string | null
  dateOfBirth: string
  gender: Gender
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
  patientInsurances: PatientInsurance[]
  lastVisit?: Visit | null
  createdAt: string
  updatedAt: string
}

/**
 * Department - Represents a clinic department (e.g., Pediatrics, Maternity)
 */
export interface Department {
  id: string
  name: string
  insurancePolicyMode: DepartmentInsurancePolicyMode
  insurancePolicies: InsuranceProvider[]
  defaultProducts: Product[]
  nursing: boolean
  supportRequests: boolean
  requestsProducts: boolean
  createdAt: string
  updatedAt: string
}

/**
 * InsuranceProvider - Health insurance company
 */
export interface InsuranceProvider {
  id: string
  insuranceName: string
  acronym?: string | null
  defaultCoveragePercentage: number
  supportedByClinic: boolean
  iconUrl?: string | null
  createdAt: string
  updatedAt: string
  // Legacy field compatibility
  name?: string
}

/**
 * PatientInsurance - Link between patient and insurance provider
 */
export interface PatientInsurance {
  id: string
  patient: Patient
  insuranceProvider: InsuranceProvider
  insuranceCardNumber: string
  providingCompanyOrEmployer?: string | null
  principalMember: boolean
  principalMemberName?: string | null
  principalMemberPhoneNumber?: string | null
  validFrom: string
  validUntil: string
  createdAt: string
  updatedAt: string
}

/**
 * Product - Medical product, drug, or consumable
 */
export interface Product {
  id: string
  name: string
  genericName?: string | null
  code: string
  description: string
  type: ProductType
  unit: ProductUnit
  metadata?: Record<string, unknown> | null
  privateRhicPrice?: number | null
  clinicPrice?: number | null
  insuranceCoverages: ProductInsuranceCoverage[]
  createdAt: string
  updatedAt: string
}

/**
 * ProductInsuranceCoverage - Insurance coverage details for a product
 */
export interface ProductInsuranceCoverage {
  id: string
  insuranceProvider: InsuranceProvider
  cost: number
  covered: boolean
  requireMedicalAdvisor: boolean
  mustPrescribedBy: MustPrescribedBy
  drugAdministrationFrequency: DrugAdministrationFrequency
  authorizationRequestReasons: string[]
  createdAt: string
  updatedAt: string
}

// ============================================
// VISIT ENTITIES
// ============================================

/**
 * Visit - Represents a patient's visit/encounter
 */
export interface Visit {
  id: string
  patient: Patient
  status: VisitStatus
  visitDate: string
  linkedInsurances: PatientInsurance[]
  departments: VisitDepartment[]
  vitalSigns: VisitVitalSignsGroup[]
}

/**
 * VisitDepartmentNotesSummary - Summary of notes for a visit department
 */
export interface VisitDepartmentNotesSummary {
  totalNotes: number
  newNotes: number
}

/**
 * VisitDepartment - Department services rendered during a visit
 */
export interface VisitDepartment {
  id: string
  department: Department
  status: VisitDepartmentStatus
  encounterType: EncounterType
  completedAt?: string | null
  processors: Worker[]
  childVisitDepartments: VisitDepartment[]
  products: VisitDepartmentProduct[]
  diagnostics?: VisitDepartmentDiagnosis[] | null
  medications?: VisitDepartmentMedication[] | null
  preInstructions: VisitPreInstruction[]
  notes?: VisitDepartmentNotesSummary | null
  createdAt: string
  updatedAt: string
}

/**
 * VisitDepartmentProduct - Product/service billed during a visit
 */
export interface VisitDepartmentProduct {
  id: string
  product: Product
  quantity: number
  price: number
  status: VisitProductStatus
  addedBy?: Worker | null
  billedBy?: Worker | null
  processor?: Worker | null
  createdAt: string
  updatedAt: string
}

/**
 * VisitDepartmentDiagnosis - Diagnosis for a department visit
 */
export interface VisitDepartmentDiagnosis {
  id: string
  diagnosisName: string
  icd11Code?: string | null
  createdAt: string
}

/**
 * VisitDepartmentMedication - Medication prescribed during a visit
 */
export interface VisitDepartmentMedication {
  id: string
  medicationName: string
  instructions: string
  createdAt: string
}

/**
 * VisitVitalSignsGroup - Group of vital signs recorded at a point in time
 */
export interface VisitVitalSignsGroup {
  id: string
  addedBy?: Worker | null
  createdAt: string
  measurements: VitalMeasurement[]
}

/**
 * VitalMeasurement - Individual vital sign measurement
 */
export interface VitalMeasurement {
  id: string
  measurementName: string
  value: string
  unit: string
  createdAt: string
}

/**
 * VisitPreInstruction - Pre-discharge instructions with medications or products
 */
export interface VisitPreInstruction {
  id: string
  type: string
  note?: string | null
  addedBy?: Worker | null
  medications: VisitPreInstructionMedication[]
  products: VisitPreInstructionProduct[]
  createdAt: string
}

/**
 * VisitPreInstructionMedication - Medication in pre-discharge instruction
 */
export interface VisitPreInstructionMedication {
  id: string
  medName: string
  dosage?: string | null
  route?: string | null
  frequency?: string | null
  duration?: string | null
  quantity?: string | null
  otherInstructions?: string | null
  createdAt: string
}

/**
 * VisitPreInstructionProduct - Product in pre-discharge instruction
 */
export interface VisitPreInstructionProduct {
  id: string
  product?: Product | null
  quantity?: number | null
  requestedBy?: Worker | null
  status: VisitPreInstructionProductStatus
  processedBy?: Worker | null
  createdAt: string
  updatedAt: string
}

// ============================================
// BILLING ENTITIES
// ============================================

/**
 * VisitBilling - Main billing record for a visit
 */
export interface VisitBilling {
  id: string
  visitId: string
  departments: VisitDepartmentBilling[]
  createdAt: string
  updatedAt: string
}

/**
 * VisitDepartmentBilling - Billing for a department visit
 */
export interface VisitDepartmentBilling {
  id: string
  visitDepartment: VisitDepartment
  status: VisitBillingStatus
  totalAmount: number
  insuranceCoveredAmount: number
  patientPayableAmount: number
  paidAmount: number
  outstandingAmount: number
  payments: VisitBillingPayment[]
  insuranceBillings: DepartmentInsuranceBilling[]
  createdAt: string
  updatedAt: string
}

/**
 * DepartmentInsuranceBilling - Insurance-specific billing for a department
 */
export interface DepartmentInsuranceBilling {
  id: string
  patientInsurance?: PatientInsurance | null
  status: VisitBillingStatus
  totalAmount: number
  insuranceCoveredAmount: number
  patientPayableAmount: number
  paidAmount: number
  outstandingAmount: number
  invoiceUrl?: string | null
  items: VisitBillingItem[]
  createdAt: string
  updatedAt: string
}

/**
 * VisitBillingItem - Individual item in billing
 */
export interface VisitBillingItem {
  id: string
  visitDepartmentProductId: string
  productId: string
  productName: string
  unitPriceSnapshot: number
  quantitySnapshot: number
  insuranceCoveredAmount: number
  patientPayableAmount: number
  createdAt: string
  updatedAt: string
}

/**
 * VisitBillingPayment - Payment record for billing
 */
export interface VisitBillingPayment {
  id: string
  amount: number
  paymentMethod: PaymentMethod
  reference?: string | null
  createdAt: string
  updatedAt: string
}

// ============================================
// FORM ENTITIES
// ============================================

/**
 * Form - Medical consultation form
 */
export interface Form {
  id: string
  departmentId: string
  title: string
  description?: string | null
  status: FormStatus
  version: string
  createdAt: string
  updatedAt: string
  sections?: FormSection[] | null
  fields?: FormField[] | null
  actions?: FormAction[] | null
}

/**
 * FormVersion - Version of a form
 */
export interface FormVersion {
  id: string
  formId: string
  departmentId: string
  title: string
  description?: string | null
  status: FormStatus
  version: string
  createdAt: string
  updatedAt: string
  sections?: FormSection[] | null
  fields?: FormField[] | null
  actions?: FormAction[] | null
}

/**
 * FormSection - Section within a form
 */
export interface FormSection {
  id: string
  title: string
  boldTitle: boolean
  italicTitle: boolean
  underlineTitle: boolean
  centerTitle: boolean
  columns: number
  order: number
  fields?: FormField[] | null
}

/**
 * FormField - Field within a form section
 */
export interface FormField {
  id: string
  label: string
  type: FieldType
  placeholder?: string | null
  required: boolean
  order: number
  hideLabel: boolean
  boldLabel: boolean
  italicLabel: boolean
  underlineLabel: boolean
  centerLabel: boolean
  options?: string[] | null
  tableConfig?: TableConfig | null
  conditionalRendering?: ConditionalRendering | null
}

/**
 * FormAction - Action associated with a form (e.g., procedures, products)
 */
export interface FormAction {
  id: string
  name: string
  type: string
  quantity: number
  price: number
  isQuantifiable: boolean
  backendId?: string | null
}

/**
 * TableConfig - Configuration for table fields in forms
 */
export interface TableConfig {
  mode: TableMode
  rows?: number | null
  columns?: number | null
  headerPlacement?: string | null
  columnHeaders?: string[] | null
  rowHeaders?: string[] | null
}

/**
 * ConditionalRendering - Conditional logic for form fields
 */
export interface ConditionalRendering {
  dependsOn: string
  condition: ConditionalCondition
  value?: string | null
  itemType?: string | null
}

/**
 * ConsultationAnswer - Answers to a consultation form
 */
export interface ConsultationAnswer {
  id?: string | null
  consultationId?: string | null
  visitId?: string | null
  patientId?: string | null
  departmentId?: string | null
  status?: AnswerStatus | null
  answers?: string | null
  submittedAt?: string | null
  updatedAt?: string | null
  dedicatedForm: Form
}

// ============================================
// CLINIC ENTITIES
// ============================================

/**
 * ClinicProfile - Clinic information and metadata
 */
export interface ClinicProfile {
  id: string
  name?: string | null
  username?: string | null
  address?: string | null
  contacts: ClinicContact[]
  tinNumber?: string | null
  logoUrl?: string | null
  metadata?: ClinicMetadata[] | null
  createdAt: string
  updatedAt: string
}

/**
 * ClinicContact - Contact information for clinic
 */
export interface ClinicContact {
  contactType: ClinicContactType
  value: string
  description?: string | null
}

/**
 * ClinicMetadata - Metadata for clinic
 */
export interface ClinicMetadata {
  key: string
  value: string
}

// ============================================
// AUDIT
// ============================================

/**
 * AuditLog - Record of system actions
 */
export interface AuditLog {
  id: string
  action: string
  details?: string | null
  timestamp: string
}

// ============================================
// LEGACY TYPE ALIASES FOR BACKWARD COMPATIBILITY
// ============================================

/**
 * @deprecated Use Worker instead
 */
export type User = Worker

/**
 * @deprecated Use InsuranceProvider instead
 */
export type Insurance = InsuranceProvider
