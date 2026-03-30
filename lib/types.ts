// ============================================
// ENUMS
// ============================================

export type Role = "ADMIN" | "RECEPTIONIST" | "OPHTHALMOLOGIST" | "NURSE" | "DOCTOR" | "SPECIALIST" | "FINANCE"
export type Status = "SUCCESS" | "ERROR" | "WARNING" | "UNAUTHENTICATED" | "UNAUTHORIZED" | "RESET_PASSWORD"
export type VisitStatus = "CREATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
export type VisitType = "INPATIENT" | "OUTPATIENT" | "TELEMEDICINE"
export type DepartmentStatus = "PENDING" | "CREATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
export type BillStatus = "PENDING" | "PARTIALLY_PAID" | "PAID" | "CANCELLED"
export type PaymentMode = "PRIVATE" | "INSURANCE" | "MIXED"
export type PaymentStatus = "PENDING" | "BILLED"
export type BillingStatus = "PENDING" | "BILLED" | "PARTIALLY_BILLED"
export type PaymentMethod = "CASH" | "MOMO" | "BANK_TRANSFER" | "CARD"
export type PaymentScope = "DEPARTMENT" | "FULL"
export type ExemptionType = "NONE" | "PATIENT_PART" | "FULL"
export type DiscountType = "NONE" | "FIXED" | "PERCENTAGE"
export type NoteType = "GENERAL" | "DIAGNOSIS" | "PRESCRIPTION" | "OBSERVATION" | "INTERNAL"
export type FormStatus = "DRAFT" | "FINAL"
export type ActivationStatus = "PENDING" | "ACTIVE" | "INACTIVE"

// ============================================
// USER & AUTHENTICATION
// ============================================

export interface User {
  id: string
  name: string
  email: string
  phoneNumber: string
  title?: string
  roles: Role[]
  active: boolean
  departments?: Department[]
}

export interface PublicUser {
  id: string
  name: string
  title?: string
  departmentNames?: string[]
}

export interface AuthPayload {
  token: string
  user: User
}

// ============================================
// MESSAGES & RESPONSES
// ============================================

export interface Message {
  text: string
  type: string
}

export type ApiResponse<T> = {
  status: Status
  data?: T
  messages?: Message[]
}

// ============================================
// INSURANCE
// ============================================

export interface Insurance {
  id: string
  name: string
  acronym: string
  coveragePercentage: number
}

export interface PatientInsurance {
  id: string
  insurance: Insurance
  insuranceCardNumber?: string
  dominantMember?: DominantMember
  status: ActivationStatus
}

export interface DominantMember {
  firstName: string
  lastName: string
  phone: string
}

// ============================================
// DEPARTMENT
// ============================================

export interface Department {
  id: string
  name: string
  actions?: Action[]
  consumables?: Consumable[]
  exemptedInsurances?: Insurance[]
}

// ============================================
// ACTIONS & CONSUMABLES
// ============================================

export interface CoverageResponse {
  id: string
  insurance: Insurance
  price: number
}

export interface Action {
  id: string
  name?: string
  quantifiable: boolean
  type: string
  privatePrice: number
  clinicPrice?: number
  insuranceCoverages?: CoverageResponse[]
}

export interface Consumable {
  id: string
  name?: string
  quantifiable: boolean
  type: string
  privatePrice: number
  clinicPrice?: number
  insuranceCoverages?: CoverageResponse[]
}

export interface FormActionItem {
  id: string
  name: string
  type: string
  quantity?: number
  price: number
  isQuantifiable: boolean
  backendId: string
}

// ============================================
// PATIENT
// ============================================

export interface Address {
  street?: string
  sector?: string
  district?: string
  country?: string
}

export interface ContactInfo {
  phone?: string
  email?: string
  address?: Address
}

export interface EmergencyContact {
  name?: string
  relation?: string
  phone?: string
}

export interface Patient {
  id: string
  firstName: string
  lastName?: string
  middleName?: string
  dateOfBirth: string
  gender?: string
  contactInfo?: ContactInfo
  emergencyContact?: EmergencyContact
  nationalId?: string
  insurances?: PatientInsurance[]
  registrationDate?: string
  registeredBy?: string
  notes?: string
  latestVisit?: Visit
}

// ============================================
// BILLING
// ============================================

export interface Discount {
  type: DiscountType
  value: number
}

export interface BillTotals {
  beforeDiscount: number
  discount: number
  afterDiscount: number
  patientTotalDue: number
  insuranceTotalCover: number
  patientTotalPaid: number
  patientBalance: number
}

export interface BillItemDetail {
  id: string
  itemType: string
  itemId: string
  name: string
  basePriceAtBilling: number
  quantity: number
  paymentMode: PaymentMode
  insurance?: Insurance
  insurancePartAmount?: number
  patientPartAmount?: number
  exemptionType?: ExemptionType
  exemptionReason?: string
  itemDiscount?: Discount
  finalAmountCharged: number
}

export interface BillingItem {
  id: string
  department: Department
  action?: Action
  items: BillItemDetail[]
}

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
// VISITS
// ============================================

export interface VisitNote {
  type: NoteType
  text: string
}

export interface VisitDepartmentProcessor {
  user: PublicUser
  startTime: string
  endTime?: string
}

export interface VisitAction {
  id?: string
  action: Action
  quantity: number
  doneBy: PublicUser
  paymentStatus: PaymentStatus
}

export interface VisitConsumable {
  id?: string
  consumable: Consumable
  quantity: number
  doneBy: PublicUser
  paymentStatus: PaymentStatus
}

export interface VisitDepartment {
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

export interface Visit {
  id?: string
  patient: Patient
  insurances?: Insurance[]
  visitDate?: string
  registeredBy: PublicUser
  visitStatus: VisitStatus
  visitType: VisitType
  departments?: VisitDepartment[]
  visitNotes?: VisitNote[]
  billingStatus: BillingStatus
}

// ============================================
// FORMS
// ============================================

export interface ConditionalRendering {
  dependsOn: string
  condition: string
  value?: string
  itemType?: string
}

export interface TableConfig {
  mode: string
  rows: number
  columns: number
  headerPlacement: string
  columnHeaders?: string[]
  rowHeaders?: string[]
}

export interface FormField {
  id: string
  label: string
  type: string
  placeholder?: string
  required?: boolean
  order: number
  hideLabel?: boolean
  boldLabel?: boolean
  italicLabel?: boolean
  underlineLabel?: boolean
  centerLabel?: boolean
  conditionalRendering?: ConditionalRendering
  options?: string[]
  tableConfig?: TableConfig
}

export interface FormSection {
  id: string
  title: string
  boldTitle?: boolean
  italicTitle?: boolean
  underlineTitle?: boolean
  centerTitle?: boolean
  columns: number
  order: number
  fields?: FormField[]
}

export interface Form {
  id: string
  departmentId: string
  title: string
  description?: string
  status: FormStatus
  currentVersionNumber?: string
  currentSchemaVersion?: number
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
  sections?: FormSection[]
  fields?: FormField[]
  actions?: FormActionItem[]
  meta?: string
}

export interface FormListItem {
  id: string
  departmentId: string
  title: string
  status: FormStatus
  currentVersionNumber?: string
  createdAt: string
  updatedAt: string
}

export interface FormVersionItem {
  id: string
  formId: string
  versionNumber: string
  schemaVersion?: number
  status: FormStatus
  createdAt: string
  createdBy?: string
  sections?: FormSection[]
  fields?: FormField[]
  actions?: FormActionItem[]
  meta?: string
}

// ============================================
// PAGINATION
// ============================================

export interface PageInfo<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

// ============================================
// QUERY RESPONSE TYPES
// ============================================

export type UserListResponse = ApiResponse<User[]>
export type UserResponse = ApiResponse<User>
export type AuthResponse = ApiResponse<AuthPayload>
export type PatientResponse = ApiResponse<Patient>
export type PatientPageResponse = ApiResponse<PageInfo<Patient>>
export type DepartmentResponse = ApiResponse<Department>
export type DepartmentListResponse = ApiResponse<Department[]>
export type InsuranceResponse = ApiResponse<Insurance>
export type InsuranceListResponse = ApiResponse<Insurance[]>
export type ActionResponse = ApiResponse<Action>
export type ActionPageResponse = ApiResponse<PageInfo<Action>>
export type ActionListResponse = ApiResponse<Action[]>
export type ConsumableResponse = ApiResponse<Consumable>
export type ConsumablePageResponse = ApiResponse<PageInfo<Consumable>>
export type ConsumableListResponse = ApiResponse<Consumable[]>
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
// INPUT TYPES FOR MUTATIONS
// ============================================

export interface AddressInput {
  street?: string
  sector?: string
  district?: string
  country?: string
}

export interface ContactInfoInput {
  phone?: string
  email?: string
  address?: AddressInput
}

export interface EmergencyContactInput {
  name?: string
  relation?: string
  phone?: string
}

export interface DominantMemberInput {
  firstName: string
  lastName: string
  phone: string
}

export interface PatientInsuranceInput {
  insuranceId: string
  insuranceCardNumber?: string
  dominantMember?: DominantMemberInput
  status: ActivationStatus
}

export interface PatientInput {
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

export interface ActionInput {
  name: string
  quantifiable: boolean
  type: string
  privatePrice: number
  clinicPrice: number
}

export interface ConsumableInput {
  name: string
  quantifiable: boolean
  type: string
  privatePrice: number
  clinicPrice: number
}

export interface DepartmentInput {
  name: string
}

export interface InsuranceInput {
  name: string
  acronym: string
  coveragePercentage: number
}

export interface CoverageRequestInput {
  insuranceId: string
  price: number
}

export interface DiscountInput {
  type: DiscountType
  value: number
}

export interface BillItemRequestInput {
  itemType: string
  itemId: string
  quantity: number
  insuranceId?: string
  itemDiscount?: DiscountInput
}

export interface BillingItemRequestInput {
  departmentId: string
  actionId?: string
  items: BillItemRequestInput[]
}

export interface BillingRequestInput {
  visitId: string
  note?: string
  globalDiscount?: DiscountInput
  billingItems: BillingItemRequestInput[]
}

export interface PaymentRequestInput {
  billId: string
  scope: PaymentScope
  departmentId?: string
  method: PaymentMethod
  amount: number
  reference?: string
}

export interface VisitNoteInput {
  type: string
  text: string
}

export interface VisitActionInput {
  action: EntityIdInput
  quantity?: number
  doneBy?: string
  paymentStatus: PaymentStatus
}

export interface EntityIdInput {
  id: string
}

export interface VisitConsumableInput {
  consumable: EntityIdInput
  quantity?: number
  doneBy?: string
  paymentStatus: PaymentStatus
}

export interface VisitDepartmentProcessorInput {
  userId?: string
  time: string
}

export interface VisitDepartmentInput {
  department: EntityIdInput
  status: DepartmentStatus
  transferredBy?: string
  transferTime?: string
  processors?: VisitDepartmentProcessorInput[]
  completedTime?: string
  actions?: VisitActionInput[]
  consumables?: VisitConsumableInput[]
}

export interface CreateVisitInput {
  patientId: string
  insuranceIds?: string[]
  departmentIds?: string[]
  visitNotes?: VisitNoteInput[]
  visitType: VisitType
}

export interface AddDepartmentInput {
  visitId: string
  departmentId: string
}

export interface ProcessDepartmentInput {
  visitId: string
  departmentId: string
}

export interface AddProcessorInput {
  visitId: string
  departmentId: string
  userId: string
}

export interface AddActionInput {
  visitId: string
  departmentId: string
  actionId: string
  quantity?: number
}

export interface AddConsumableInput {
  visitId: string
  departmentId: string
  consumableId: string
  quantity?: number
}

export interface AddNoteInput {
  visitId: string
  departmentId?: string
  note: VisitNoteInput
}

export interface RemoveItemInput {
  visitId: string
  departmentId: string
  itemId: string
}

export interface UpdateQuantityInput {
  visitId: string
  departmentId: string
  itemId: string
  quantity: number
}

export interface ConditionalRenderingInput {
  dependsOn: string
  condition: string
  value?: string
  itemType?: string
}

export interface TableConfigInput {
  mode: string
  rows: number
  columns: number
  headerPlacement: string
  columnHeaders?: string[]
  rowHeaders?: string[]
}

export interface FormFieldInput {
  id: string
  label: string
  type: string
  placeholder?: string
  required?: boolean
  order: number
  hideLabel?: boolean
  boldLabel?: boolean
  italicLabel?: boolean
  underlineLabel?: boolean
  centerLabel?: boolean
  conditionalRendering?: ConditionalRenderingInput
  options?: string[]
  tableConfig?: TableConfigInput
}

export interface FormSectionInput {
  id: string
  title: string
  boldTitle?: boolean
  italicTitle?: boolean
  underlineTitle?: boolean
  centerTitle?: boolean
  columns: number
  order: number
  fields?: FormFieldInput[]
}

export interface FormActionInput {
  id: string
  name: string
  type: string
  quantity?: number
  price: number
  isQuantifiable?: boolean
  backendId?: string
}

export interface FormInput {
  title: string
  description?: string
  schemaVersion: number
  sections?: FormSectionInput[]
  fields?: FormFieldInput[]
  actions?: FormActionInput[]
}

export interface VisitFilterInput {
  status?: VisitStatus
  billingStatus?: BillingStatus
  visitType?: VisitType
  patientName?: string
  fromDate?: string
  toDate?: string
}

export interface PatientFilterInput {
  name?: string
  age?: number
  dob?: string
  phoneNumber?: string
  insuranceName?: string
}
