/**
 * lib/types.ts - Legacy and utility types
 * This file maintains backward compatibility with existing code.
 * All canonical entity types are now in lib/api-types.ts
 * All input types are now in lib/api-input-types.ts
 * 
 * Migration path: Use api-types.ts and api-input-types.ts for new code
 */

// ============================================
// RE-EXPORT CANONICAL TYPES FOR COMPATIBILITY
// ============================================

export type {
  // Enums
  ResponseStatus,
  RoleName,
  AccountStatus,
  Gender,
  DocumentType,
  ProductType,
  ProductUnit,
  MustPrescribedBy,
  DrugAdministrationFrequency,
  DepartmentInsurancePolicyMode,
  VisitStatus,
  VisitProductStatus,
  VisitDepartmentStatus,
  EncounterType,
  VisitBillingStatus,
  ClinicContactType,
  FormStatus,
  FieldType,
  TableMode,
  ConditionalCondition,
  AnswerStatus,
  VisitPreInstructionProductStatus,
  PaymentMethod,
  // Interfaces
  ApiResponse,
  PaginationInfo,
  PaginatedResponse,
  Worker,
  Patient,
  Department,
  InsuranceProvider,
  PatientInsurance,
  Product,
  ProductInsuranceCoverage,
  Visit,
  VisitDepartment,
  VisitDepartmentProduct,
  VisitDepartmentDiagnosis,
  VisitDepartmentMedication,
  VisitVitalSignsGroup,
  VitalMeasurement,
  VisitPreInstruction,
  VisitPreInstructionMedication,
  VisitPreInstructionProduct,
  VisitBilling,
  VisitDepartmentBilling,
  DepartmentInsuranceBilling,
  VisitBillingItem,
  VisitBillingPayment,
  Form,
  FormVersion,
  FormSection,
  FormField,
  FormAction,
  TableConfig,
  ConditionalRendering,
  ConsultationAnswer,
  ClinicProfile,
  ClinicContact,
  ClinicMetadata,
  AuditLog,
  User,
  Insurance,
} from "./api-types"

// ============================================
// LEGACY TYPE ALIASES (for backward compatibility)
// ============================================

/**
 * @deprecated Use ResponseStatus enum from api-types instead
 */
export type Status = "SUCCESS" | "ERROR" | "WARNING" | "UNAUTHENTICATED" | "UNAUTHORIZED" | "RESET_PASSWORD"

/**
 * @deprecated Use RoleName enum from api-types instead
 */
export type Role = "ADMIN" | "MANAGER" | "RECEPTIONIST" | "OPHTHALMOLOGIST" | "NURSE" | "DOCTOR" | "SPECIALIST" | "FINANCE"

/**
 * @deprecated Use VisitStatus enum from api-types instead
 */
export type VisitType = "INPATIENT" | "OUTPATIENT" | "TELEMEDICINE"

/**
 * @deprecated Use VisitDepartmentStatus enum from api-types instead
 */
export type DepartmentStatus = "PENDING" | "CREATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

/**
 * @deprecated Use VisitBillingStatus enum from api-types instead
 */
export type BillStatus = "PENDING" | "PARTIALLY_PAID" | "PAID" | "CANCELLED"

/**
 * @deprecated Legacy billing type
 */
export type PaymentMode = "PRIVATE" | "INSURANCE" | "MIXED"

/**
 * @deprecated Legacy billing type
 */
export type PaymentStatus = "PENDING" | "BILLED"

/**
 * @deprecated Legacy billing type
 */
export type BillingStatus = "PENDING" | "BILLED" | "PARTIALLY_BILLED"

/**
 * @deprecated Legacy billing type
 */
export type PaymentScope = "DEPARTMENT" | "FULL"

/**
 * @deprecated Legacy billing type
 */
export type ExemptionType = "NONE" | "PATIENT_PART" | "FULL"

/**
 * @deprecated Legacy billing type
 */
export type DiscountType = "NONE" | "FIXED" | "PERCENTAGE"

/**
 * @deprecated Legacy note type
 */
export type NoteType = "GENERAL" | "DIAGNOSIS" | "PRESCRIPTION" | "OBSERVATION" | "INTERNAL"

/**
 * @deprecated Use AnswerStatus enum from api-types instead
 */
export type ActivationStatus = "PENDING" | "ACTIVE" | "INACTIVE"

// ============================================
// LEGACY UTILITY TYPES (not in GraphQL schema)
// ============================================

/**
 * @deprecated Legacy user wrapper
 */
export interface PublicUser {
  id: string
  name: string
  title?: string
  departmentNames?: string[]
}

/**
 * @deprecated Legacy auth payload
 */
export interface AuthPayload {
  token: string
  user: Worker
}

/**
 * @deprecated Legacy message type
 */
export interface Message {
  text: string
  type: string
}

// ============================================
// LEGACY PATIENT-RELATED TYPES
// ============================================

/**
 * @deprecated Use ClinicContact with nested properties instead
 */
export interface Address {
  street?: string
  sector?: string
  district?: string
  country?: string
}

/**
 * @deprecated Use Patient.primaryPhoneNumber and related fields instead
 */
export interface ContactInfo {
  phone?: string
  email?: string
  address?: Address
}

/**
 * @deprecated Use Patient.emergencyContact* fields instead
 */
export interface EmergencyContact {
  name?: string
  relation?: string
  phone?: string
}

/**
 * @deprecated Use PatientInsurance.principalMember* fields instead
 */
export interface DominantMember {
  firstName: string
  lastName: string
  phone: string
}

// ============================================
// LEGACY BILLING TYPES
// ============================================

/**
 * @deprecated Legacy discount type
 */
export interface Discount {
  type: DiscountType
  value: number
}

/**
 * @deprecated Legacy billing totals
 */
export interface BillTotals {
  beforeDiscount: number
  discount: number
  afterDiscount: number
  patientTotalDue: number
  insuranceTotalCover: number
  patientTotalPaid: number
  patientBalance: number
}

/**
 * @deprecated Use VisitBillingItem instead
 */
export interface BillItemDetail {
  id: string
  itemType: string
  itemId: string
  name: string
  basePriceAtBilling: number
  quantity: number
  paymentMode: PaymentMode
  insurance?: InsuranceProvider
  insurancePartAmount?: number
  patientPartAmount?: number
  exemptionType?: ExemptionType
  exemptionReason?: string
  itemDiscount?: Discount
  finalAmountCharged: number
}

/**
 * @deprecated Use VisitDepartmentBilling instead
 */
export interface BillingItem {
  id: string
  department: Department
  action?: unknown
  items: BillItemDetail[]
}

/**
 * @deprecated Use VisitBillingPayment instead
 */
export interface Payment {
  id: string
  billId: string
  scope: PaymentScope
  department?: Department
  method: PaymentMethod
  amount: number
  receivedByUser: PublicUser
  receivedAt: string
  reference?: string
}

/**
 * @deprecated Use VisitBilling instead
 */
export interface Bill {
  id: string
  billingDisplayId: string
  visit: Visit
  billedByUser: PublicUser
  billedAt: string
  note?: string
  globalDiscount?: Discount
  totals: BillTotals
  status: BillStatus
  billingItems?: BillingItem[]
  payments?: Payment[]
}

// ============================================
// LEGACY VISIT TYPES
// ============================================

/**
 * @deprecated Use VisitDepartment fields instead
 */
export interface VisitNote {
  type: NoteType
  text: string
}

/**
 * @deprecated Use VisitDepartment.processors instead
 */
export interface VisitDepartmentProcessor {
  user: PublicUser
  startTime: string
  endTime?: string
}

/**
 * @deprecated Use VisitDepartmentProduct instead
 */
export interface VisitAction {
  id?: string
  action: unknown
  quantity: number
  doneBy: PublicUser
  paymentStatus: PaymentStatus
}

/**
 * @deprecated Use VisitDepartmentProduct instead
 */
export interface VisitConsumable {
  id?: string
  consumable: unknown
  quantity: number
  doneBy: PublicUser
  paymentStatus: PaymentStatus
}

/**
 * @deprecated Use VisitDepartment from api-types instead
 */
export interface VisitDepartmentLegacy {
  id?: string
  department: Department
  status: DepartmentStatus
  billingStatus: BillStatus
  transferredBy?: PublicUser
  transferTime?: string
  processors?: VisitDepartmentProcessor[]
  completedTime?: string
  actions?: VisitAction[]
  consumables?: VisitConsumable[]
  notes?: VisitNote[]
}

/**
 * @deprecated Use Visit from api-types instead
 */
export interface VisitLegacy {
  id?: string
  patient: Patient
  insurances?: InsuranceProvider[]
  visitDate?: string
  registeredBy: PublicUser
  visitStatus: VisitStatus
  visitType: VisitType
  departments?: VisitDepartmentLegacy[]
  visitNotes?: VisitNote[]
  billingStatus: BillingStatus
}

// ============================================
// LEGACY FORM TYPES
// ============================================

/**
 * @deprecated Use FormListItem instead
 */
export interface FormListItem {
  id: string
  departmentId: string
  title: string
  status: FormStatus
  version?: string
  createdAt: string
  updatedAt: string
}

/**
 * @deprecated Use FormVersion instead
 */
export interface FormVersionItem {
  id: string
  formId: string
  versionNumber: string
  status: FormStatus
  createdAt: string
  createdBy?: string
  sections?: FormSection[]
  fields?: FormField[]
  actions?: FormAction[]
  meta?: string
}

// ============================================
// PAGINATION
// ============================================

/**
 * Legacy pagination wrapper - use PaginationInfo from api-types
 */
export interface PageInfo<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

// ============================================
// QUERY RESPONSE TYPE ALIASES
// ============================================

export type UserListResponse = ApiResponse<Worker[]>
export type UserResponse = ApiResponse<Worker>
export type AuthResponse = ApiResponse<{ user: Worker; accessToken: string; refreshToken: string }>
export type PatientResponse = ApiResponse<Patient>
export type PatientPageResponse = ApiResponse<PageInfo<Patient>>
export type DepartmentResponse = ApiResponse<Department>
export type DepartmentListResponse = ApiResponse<Department[]>
export type InsuranceResponse = ApiResponse<InsuranceProvider>
export type InsuranceListResponse = ApiResponse<InsuranceProvider[]>
export type VisitResponse = ApiResponse<Visit>
export type VisitListResponse = ApiResponse<Visit[]>
export type VisitPageResponse = ApiResponse<PageInfo<Visit>>
export type BillResponse = ApiResponse<Bill>
export type PaymentResponse = ApiResponse<Payment>
export type FormResponse = ApiResponse<Form>
export type FormListResponse = ApiResponse<FormListItem[]>
export type FormVersionListResponse = ApiResponse<FormVersionItem[]>
export type MessageResponse = ApiResponse<null>

// ============================================
// LEGACY INPUT TYPES (Kept for backward compatibility)
// ============================================

/**
 * @deprecated Use CreatePatientInsuranceInput from api-input-types instead
 */
export interface DominantMemberInput {
  firstName: string
  lastName: string
  phone: string
}

/**
 * @deprecated Use UpdatePatientInput from api-input-types instead
 */
export interface AddressInput {
  street?: string
  sector?: string
  district?: string
  country?: string
}

/**
 * @deprecated Use UpdatePatientInput from api-input-types instead
 */
export interface ContactInfoInput {
  phone?: string
  email?: string
  address?: AddressInput
}

/**
 * @deprecated Use UpdatePatientInput from api-input-types instead
 */
export interface EmergencyContactInput {
  name?: string
  relation?: string
  phone?: string
}

/**
 * @deprecated Use CreatePatientInsuranceInput from api-input-types instead
 */
export interface PatientInsuranceInput {
  insuranceId: string
  insuranceCardNumber: string
  providingCompanyOrEmployer: string
  dominantMember?: DominantMemberInput
}

/**
 * @deprecated Use CreatePatientInput from api-input-types instead
 */
export interface PatientInputLegacy {
  firstName: string
  lastName?: string
  middleName?: string
  dateOfBirth: string
  gender?: string
  contactInfo?: ContactInfoInput
  emergencyContact?: EmergencyContactInput
  nationalId?: string
  insurances?: PatientInsuranceInput[]
  notes?: string
}

/**
 * @deprecated Use CreateProductInput from api-input-types instead
 */
export interface ActionInput {
  name: string
  quantifiable: boolean
  type: string
  privatePrice: number
  clinicPrice: number
}

/**
 * @deprecated Use CreateProductInput from api-input-types instead
 */
export interface ConsumableInput {
  name: string
  quantifiable: boolean
  type: string
  privatePrice: number
  clinicPrice: number
}

/**
 * @deprecated Use CreateDepartmentInput from api-input-types instead
 */
export interface DepartmentInput {
  name: string
}

/**
 * @deprecated Use CreateInsuranceProviderInput from api-input-types instead
 */
export interface InsuranceInput {
  name: string
  acronym: string
  coveragePercentage: number
}

/**
 * @deprecated Legacy coverage request
 */
export interface CoverageRequestInput {
  insuranceId: string
  price: number
}

/**
 * @deprecated Legacy discount input
 */
export interface DiscountInput {
  type: DiscountType
  value: number
}

/**
 * @deprecated Legacy billing item request
 */
export interface BillItemRequestInput {
  itemType: string
  itemId: string
  quantity: number
  insuranceId?: string
  itemDiscount?: DiscountInput
}

/**
 * @deprecated Legacy billing item request
 */
export interface BillingItemRequestInput {
  departmentId: string
  actionId?: string
  items: BillItemRequestInput[]
}

/**
 * @deprecated Legacy billing request
 */
export interface BillingRequestInput {
  visitId: string
  note?: string
  globalDiscount?: DiscountInput
  billingItems: BillingItemRequestInput[]
}

/**
 * @deprecated Legacy payment request
 */
export interface PaymentRequestInput {
  billId: string
  scope: PaymentScope
  departmentId?: string
  method: PaymentMethod
  amount: number
  reference?: string
}

/**
 * @deprecated Use AddVisitPreInstructionsInput from api-input-types instead
 */
export interface VisitNoteInput {
  type: string
  text: string
}

/**
 * @deprecated Legacy visit action input
 */
export interface VisitActionInput {
  action: EntityIdInput
  quantity?: number
  doneBy?: string
  paymentStatus: PaymentStatus
}

/**
 * @deprecated Legacy entity ID input
 */
export interface EntityIdInput {
  id: string
}

/**
 * @deprecated Legacy visit consumable input
 */
export interface VisitConsumableInput {
  consumable: EntityIdInput
  quantity?: number
  doneBy?: string
  paymentStatus: PaymentStatus
}

/**
 * @deprecated Use CreateVisitDepartmentInput from api-input-types instead
 */
export interface VisitDepartmentProcessorInput {
  userId?: string
  time: string
}

/**
 * @deprecated Use CreateVisitDepartmentInput from api-input-types instead
 */
export interface VisitDepartmentInputLegacy {
  department: EntityIdInput
  status: DepartmentStatus
  transferredBy?: string
  transferTime?: string
  processors?: VisitDepartmentProcessorInput[]
  completedTime?: string
  actions?: VisitActionInput[]
  consumables?: VisitConsumableInput[]
}

/**
 * @deprecated Use CreateVisitInput from api-input-types instead
 */
export interface CreateVisitInputLegacy {
  patientId: string
  visitDate?: string
  linkedPatientInsuranceIds?: string[]
  departments?: VisitDepartmentInputLegacy[]
  visitNotes?: VisitNoteInput[]
}

/**
 * @deprecated Legacy department operation input
 */
export interface AddDepartmentInput {
  visitId: string
  departmentId: string
}

/**
 * @deprecated Legacy department operation input
 */
export interface ProcessDepartmentInput {
  visitId: string
  departmentId: string
}

/**
 * @deprecated Legacy department operation input
 */
export interface AddProcessorInput {
  visitId: string
  departmentId: string
  userId: string
}

/**
 * @deprecated Legacy department operation input
 */
export interface AddActionInput {
  visitId: string
  departmentId: string
  actionId: string
  quantity?: number
}

/**
 * @deprecated Legacy department operation input
 */
export interface AddConsumableInput {
  visitId: string
  departmentId: string
  consumableId: string
  quantity?: number
}

/**
 * @deprecated Legacy operation input
 */
export interface AddNoteInput {
  visitId: string
  departmentId?: string
  note: VisitNoteInput
}

/**
 * @deprecated Legacy operation input
 */
export interface RemoveItemInput {
  visitId: string
  departmentId: string
  itemId: string
}

/**
 * @deprecated Legacy operation input
 */
export interface UpdateQuantityInput {
  visitId: string
  departmentId: string
  itemId: string
  quantity: number
}

/**
 * @deprecated Use VisitFilterInput instead
 */
export interface VisitFilterInput {
  status?: VisitStatus
  billingStatus?: BillingStatus
  visitType?: VisitType
  patientName?: string
  fromDate?: string
  toDate?: string
}

/**
 * @deprecated Use SearchPatientsInput from api-input-types instead
 */
export interface PatientFilterInput {
  name?: string
  age?: number
  dob?: string
  phoneNumber?: string
  insuranceName?: string
}
