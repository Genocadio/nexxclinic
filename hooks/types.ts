export interface ApiResponse<T> {
  status: string
  message?: string
  data?: T
  messages?: {
    text: string
    type: string
  }[]
}

export interface LoginResponse {
  status: string
  message?: string
  data?: {
    token?: string
    accessToken?: string
    refreshToken?: string
    user?: {
      id: string
      firstName?: string
      lastName?: string
      email: string
      phoneNumber: string
      accountStatus?: string
      roles: string[]
    }
    needsPasswordSetup?: boolean
  }
  messages?: {
    text: string
    type: string
  }[]
}

export interface UserAccount {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  username: string
  accountStatus: string
  roles: string[]
  department?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
  gender?: string
  dateOfBirth?: string
  profilePhotoUrl?: string
  title?: string
}

export interface UserResponse {
  status: string
  data?: UserAccount
  messages?: {
    text: string
    type: string
  }[]
}

export interface UserListResponse {
  status: string
  data?: UserAccount[]
  messages?: {
    text: string
    type: string
  }[]
}

export interface RegisterResponse {
  status: string
  message?: string
  data?: {
    id: string
    name: string
    email: string
    phoneNumber: string
    title: string
  }
  messages?: {
    text: string
    type: string
  }[]
}

export type PaymentStatus = "PENDING" | "BILLED"

export interface VisitDepartmentAction {
  id: string
  action: {
    id: string
    name: string
    type?: string
    privatePrice?: number
  }
  quantity: number
  paymentStatus?: PaymentStatus
  doneBy?: {
    id: string
    name: string
    title?: string
  }
  doneAt?: string
}

export interface VisitDepartmentConsumable {
  id: string
  consumable: {
    id: string
    name: string
    type?: string
    privatePrice?: number
  }
  quantity: number
  paymentStatus?: PaymentStatus
  usedBy?: {
    id: string
    name: string
    title?: string
  }
  usedAt?: string
}

export interface VisitDepartmentProduct {
  id: string
  product: {
    id: string
    name: string
    type?: string
    privatePrice?: number
  }
  quantity: number
  addedBy?: {
    id: string
    name: string
    title?: string
  }
  addedAt?: string
}

export interface VisitDepartmentNote {
  id: string
  note: string
  createdBy?: {
    id: string
    name: string
  }
  createdAt: string
}

export interface VisitDepartmentDiagnosis {
  id: string
  diagnosisName: string
  icd11Code?: string
  createdAt?: string
}

export interface VisitDepartmentMedication {
  id: string
  medicationName: string
  instructions: string
  createdAt?: string
}

export interface VisitDepartment {
  id: string
  status: string
  transferTime: string
  completedTime: string
  department: {
    id: string
    name: string
  }
  transferredBy?: {
    id: string
    name: string
    title?: string
    departmentNames?: string[]
  }
  processors?: {
    id: string
    name: string
    title?: string
  }[]
  products?: VisitDepartmentProduct[]
  actions?: VisitDepartmentAction[]
  consumables?: VisitDepartmentConsumable[]
  notes?: VisitDepartmentNote[]
  diagnostics?: VisitDepartmentDiagnosis[]
  medications?: VisitDepartmentMedication[]
}

export interface VisitVitalSignMeasurement {
  id: string
  measurementName: string
  value: string
  unit: string
  createdAt?: string
}

export interface VisitVitalSignsGroup {
  id: string
  addedBy?: {
    id: string
    firstName?: string
    lastName?: string
  }
  createdAt?: string
  measurements: VisitVitalSignMeasurement[]
}

export type VisitVitalSign = VisitVitalSignMeasurement

export interface InsuranceProvider {
  id: string
  insuranceName: string
  acronym?: string
  defaultCoveragePercentage: number
  supportedByClinic: boolean
  iconUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface PatientInsurance {
  id: string
  insurance: Insurance
  insuranceCardNumber: string
  status: string
  dominantMember?: {
    firstName: string
    lastName: string
    phone: string
  }
  validFrom?: string
  validUntil?: string
  principalMember?: boolean
  principalMemberName?: string
  principalMemberPhoneNumber?: string
  createdAt?: string
  updatedAt?: string
}

export interface Visit {
  id: string
  visitDate: string
  status: string
  visitStatus?: string
  billingStatus: string
  patient: Patient
  insurances?: PatientInsurance[]
  visitNotes?: {
    id: string
    note: string
    createdBy?: {
      id: string
      name: string
    }
    createdAt: string
  }[]
  vitalSigns?: VisitVitalSignsGroup[]
  departments?: VisitDepartment[]
  createdAt?: string
  updatedAt?: string
}

export interface Address {
  street?: string
  sector?: string
  district?: string
  country?: string
}

export interface ContactInfo {
  phone?: string
  phoneNumber?: string
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
  gender?: string
  dateOfBirth?: string
  nationalId?: string
  contactInfo?: ContactInfo
  emergencyContact?: EmergencyContact
  insurances?: PatientInsurance[]
  registrationDate?: string
  registeredBy?: string
  notes?: string
  lastVisit?: Visit
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id: string
  name: string
  genericName?: string
  code?: string
  description?: string
  type?: string
  unit?: string
  privateRhicPrice?: number
  clinicPrice?: number
  insuranceCoverages?: Array<{
    id: string
    insurance: Insurance
    cost?: number
    covered?: boolean
    requireMedicalAdvisor?: boolean
  }>
}

export interface Department {
  id: string
  name: string
  description?: string
  insurancePolicyMode?: string
  nursing?: boolean
  supportRequests?: boolean
  insurancePolicies?: Insurance[]
  defaultProducts?: Product[]
  createdAt?: string
  updatedAt?: string
}

export interface Insurance {
  id: string
  name: string
  type?: string
  acronym?: string
  coveragePercentage?: number
  supportedByClinic?: boolean
  iconUrl?: string
  privatePrice?: number
  createdAt?: string
  updatedAt?: string
}

export interface VisitBillingItem {
  id: string
  visitDepartmentProductId: string
  productId: string
  productName: string
  unitPriceSnapshot: number
  quantitySnapshot: number
  lineTotal: number
  insuranceCoveredAmount: number
  patientPayableAmount: number
  appliedPatientInsuranceId?: string
  createdAt?: string
  updatedAt?: string
}

export interface Bill {
  id: string
  visitId: string
  totalAmount: number
  paidAmount: number
  status: string
  items?: VisitBillingItem[]
  createdAt?: string
  updatedAt?: string
}

export interface InvoiceResponse {
  status: string
  message?: string
  data?: {
    invoiceUrl?: string
  }
}

export interface VisitFilterInput {
  status?: string
  patientName?: string
  fromDate?: string
  toDate?: string
}

export interface FormField {
  id: string
  label: string
  type: string
  placeholder?: string
  required: boolean
  order: number
  hideLabel?: boolean
  boldLabel?: boolean
  italicLabel?: boolean
  underlineLabel?: boolean
  centerLabel?: boolean
  options?: string[]
  tableConfig?: {
    mode: 'fixed' | 'dynamic'
    rows: number
    columns: number
    headerPlacement: 'none' | 'top' | 'left'
    columnHeaders: string[]
    rowHeaders: string[]
  }
  labRecordConfig?: {
    layout: 'valueUnit' | 'result'
    rows: {
      id: string
      name: string
      unitMode?: 'dropdown' | 'none'
      unitOptions?: string[]
      defaultUnit?: string
      resultOptions?: string[]
    }[]
  }
  conditionalRendering?: {
    dependsOn: string
    condition: 'equals' | 'includes'
    value: string | number
    itemType?: string
  }
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
  fields: FormField[]
}

export interface FormAction {
  id: string
  name: string
  type: 'action' | 'consumable'
  quantity: number
  price?: number
  isQuantifiable: boolean
  backendId?: string
}

export interface BackendForm {
  id: string
  departmentId: string
  title: string
  description?: string
  status: 'DRAFT' | 'FINAL'
  version: string
  fields: FormField[]
  sections: FormSection[]
  actions: FormAction[]
  createdAt: string
  updatedAt: string
}

export interface PatientFilterInput {
  name?: string
  age?: number
  dob?: string
  phoneNumber?: string
  insuranceName?: string
}
