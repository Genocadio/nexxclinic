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
}

export interface Visit {
  id: string
  visitDate: string
  status: string
  visitStatus?: string
  billingStatus: PaymentStatus
  patient: {
    id: string
    firstName: string
    lastName: string
    middleName?: string
    gender?: string
    dateOfBirth?: string
    nationalId?: string
    contactInfo?: {
      phoneNumber?: string
      email?: string
      address?: string
    }
    insurances?: any[]
  }
  insurances?: any[]
  visitNotes?: {
    id: string
    note: string
    createdBy?: {
      id: string
      name: string
    }
    createdAt: string
  }[]
  departments?: VisitDepartment[]
  createdAt?: string
  updatedAt?: string
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  middleName?: string
  gender?: string
  dateOfBirth?: string
  nationalId?: string
  contactInfo?: {
    phoneNumber?: string
    email?: string
    address?: string
  }
  insurances?: any[]
  createdAt?: string
  updatedAt?: string
}

export interface Department {
  id: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface Insurance {
  id: string
  name: string
  type?: string
  privatePrice?: number
  createdAt?: string
  updatedAt?: string
}

export interface Bill {
  id: string
  visitId: string
  totalAmount: number
  paidAmount: number
  status: string
  items?: any[]
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
