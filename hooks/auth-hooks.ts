import { gql, useMutation, useQuery } from '@apollo/client'
import React from 'react'

export interface LoginResponse {
  status: string
  data?: {
    token: string
    user: {
      id: string
      name: string
      email: string
      phoneNumber: string
      title: string
      roles: string[]
      active: boolean
    }
  }
  messages?: {
    text: string
    type: string
  }[]
}

export interface UserAccount {
  id: string
  name: string
  email: string
  phoneNumber: string
  title?: string
  roles: string[]
  active: boolean
  departments?: {
    id: string
    name: string
  }[]
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
  doneBy?: {
    id: string
    name: string
    title?: string
    departmentNames?: string[]
  }
  paymentStatus?: PaymentStatus
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
  doneBy?: {
    id: string
    name: string
    title?: string
    departmentNames?: string[]
  }
  paymentStatus?: PaymentStatus
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
  transferredBy: {
    id: string
    name: string
    title: string
    departmentNames: string[]
  }
  processors: {
    startTime: string
    endTime: string
  }[]
  actions?: VisitDepartmentAction[]
  consumables?: VisitDepartmentConsumable[]
}

export interface Visit {
  id: string
  visitDate: string
  visitStatus: string
  billingStatus: string
  patient: {
    id: string
    firstName: string
    lastName: string
    middleName: string
    gender: string
    notes: string
    dateOfBirth: string
    insurances: {
      id: string
      insuranceCardNumber: string
      status: string
      insurance: {
        id: string
        name: string
        acronym: string
        coveragePercentage: number
      }
    }[]
  }
  insurances: {
    id: string
    name: string
    acronym: string
    coveragePercentage: number
  }[]
  visitNotes: {
    type: string
    text: string
  }[]
  departments: VisitDepartment[]
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  middleName?: string
  dateOfBirth: string
  gender: string
  contactInfo?: {
    phone?: string
    email?: string
    address?: {
      street?: string
      sector?: string
      district?: string
      country?: string
    }
  }
  emergencyContact?: {
    name?: string
    relation?: string
    phone?: string
  }
  nationalId?: string
  insurances?: PatientInsurance[]
  registrationDate?: string
  registeredBy?: string
  notes?: string
  latestVisit?: {
    id: string
    visitDate: string
    visitStatus: string
  }
}

export interface Insurance {
  id: number
  name: string
  acronym: string
  coveragePercentage: number
}

export interface PatientResponse {
  status: string
  data?: Patient
  messages?: {
    text: string
    type: string
  }[]
}

export interface VisitResponse {
  status: string
  data?: Visit
  messages?: {
    text: string
    type: string
  }[]
}

export interface ConsultationAnswersPayload {
  id: string
  consultationId: string
  visitId: string
  patientId: string
  departmentId: string
  formId: string
  formSchemaVersion: string
  status: 'DRAFT' | 'FINAL'
  answers: string
  submittedAt?: string
  updatedAt?: string
}

export interface ConsultationAnswersResponse {
  status: string
  data?: ConsultationAnswersPayload
  messages?: {
    text: string
    type: string
  }[]
}

export interface VisitsResponse {
  status: string
  messages?: {
    text: string
    type: string
  }[]
  data?: {
    totalPages: number
    totalElements: number
    size: number
    number: number
    content: Visit[]
  }
}

export interface DashboardStats {
  totalVisits: number
  totalOpen: number
  totalCompleted: number
  totalWaitingForBilling: number
}

export interface Department {
  id: number
  name: string
}

const GET_DEPARTMENTS_QUERY = gql`
  query GetDepartments {
    getDepartments {
      status
      messages {
        text
        type
      }
      data {
        id
        name
        actions {
          id
          name
          quantifiable
          type
          privatePrice
          clinicPrice
          insuranceCoverages {
            id
            insurance {
              id
              name
              acronym
              coveragePercentage
            }
            price
          }
        }
        consumables {
          id
          name
          quantifiable
          type
          privatePrice
          clinicPrice
          insuranceCoverages {
            id
            insurance {
              id
              name
              acronym
              coveragePercentage
            }
            price
          }
        }
        exemptedInsurances {
          id
          name
          acronym
          coveragePercentage
        }
      }
    }
  }
`

export function useDepartments() {
  const { data, loading, error, refetch } = useQuery(GET_DEPARTMENTS_QUERY, {
    fetchPolicy: 'cache-and-network'
  })

  const departments = data?.getDepartments?.data || []

  return { departments, loading: loading || false, error: error?.message || null, refetch }
}

// Department mutations
const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment($input: DepartmentInput!) {
    createDepartment(input: $input) {
      status
      messages { text type }
      data {
        id
        name
        actions { id name }
        consumables { id name }
        exemptedInsurances { id name acronym coveragePercentage }
      }
    }
  }
`

const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation UpdateDepartment($id: ID!, $input: DepartmentInput!) {
    updateDepartment(id: $id, input: $input) {
      status
      messages { text type }
      data {
        id
        name
        actions { id name }
        consumables { id name }
        exemptedInsurances { id name acronym coveragePercentage }
      }
    }
  }
`

const DELETE_DEPARTMENT_MUTATION = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id) {
      status
      messages { text type }
    }
  }
`

const LINK_ACTION_TO_DEPARTMENT_MUTATION = gql`
  mutation LinkActionToDepartment($departmentId: ID!, $actionId: ID!) {
    linkActionToDepartment(departmentId: $departmentId, actionId: $actionId) {
      status
      messages { text type }
      data {
        id
        name
        actions { id name }
        consumables { id name }
        exemptedInsurances { id name acronym coveragePercentage }
      }
    }
  }
`

const UNLINK_ACTION_FROM_DEPARTMENT_MUTATION = gql`
  mutation UnlinkActionFromDepartment($departmentId: ID!, $actionId: ID!) {
    unlinkActionFromDepartment(departmentId: $departmentId, actionId: $actionId) {
      status
      messages { text type }
      data {
        id
        name
        actions { id name }
        consumables { id name }
        exemptedInsurances { id name acronym coveragePercentage }
      }
    }
  }
`

const LINK_CONSUMABLE_TO_DEPARTMENT_MUTATION = gql`
  mutation LinkConsumableToDepartment($departmentId: ID!, $consumableId: ID!) {
    linkConsumableToDepartment(departmentId: $departmentId, consumableId: $consumableId) {
      status
      messages { text type }
      data {
        id
        name
        actions { id name }
        consumables { id name }
        exemptedInsurances { id name acronym coveragePercentage }
      }
    }
  }
`

const UNLINK_CONSUMABLE_FROM_DEPARTMENT_MUTATION = gql`
  mutation UnlinkConsumableFromDepartment($departmentId: ID!, $consumableId: ID!) {
    unlinkConsumableFromDepartment(departmentId: $departmentId, consumableId: $consumableId) {
      status
      messages { text type }
      data {
        id
        name
        actions { id name }
        consumables { id name }
        exemptedInsurances { id name acronym coveragePercentage }
      }
    }
  }
`

const ADD_EXEMPTED_INSURANCE_TO_DEPARTMENT_MUTATION = gql`
  mutation AddExemptedInsuranceToDepartment($departmentId: ID!, $insuranceId: ID!) {
    addExemptedInsuranceToDepartment(departmentId: $departmentId, insuranceId: $insuranceId) {
      status
      messages { text type }
      data {
        id
        name
        actions { id name }
        consumables { id name }
        exemptedInsurances { id name acronym coveragePercentage }
      }
    }
  }
`

const REMOVE_EXEMPTED_INSURANCE_FROM_DEPARTMENT_MUTATION = gql`
  mutation RemoveExemptedInsuranceFromDepartment($departmentId: ID!, $insuranceId: ID!) {
    removeExemptedInsuranceFromDepartment(departmentId: $departmentId, insuranceId: $insuranceId) {
      status
      messages { text type }
      data {
        id
        name
        actions { id name }
        consumables { id name }
        exemptedInsurances { id name acronym coveragePercentage }
      }
    }
  }
`

export function useCreateDepartment() {
  const [mutate, { loading, error }] = useMutation(CREATE_DEPARTMENT_MUTATION)
  const createDepartment = async (name: string) => {
    const { data } = await mutate({ variables: { input: { name } } })
    return data?.createDepartment?.data
  }
  return { createDepartment, loading, error: error?.message || null }
}

export function useUpdateDepartment() {
  const [mutate, { loading, error }] = useMutation(UPDATE_DEPARTMENT_MUTATION)
  const updateDepartment = async (id: number | string, name: string) => {
    const { data } = await mutate({ variables: { id, input: { name } } })
    return data?.updateDepartment?.data
  }
  return { updateDepartment, loading, error: error?.message || null }
}

export function useDeleteDepartment() {
  const [mutate, { loading, error }] = useMutation(DELETE_DEPARTMENT_MUTATION)
  const deleteDepartment = async (id: number | string) => {
    const { data } = await mutate({ variables: { id } })
    return data?.deleteDepartment?.status === 'SUCCESS'
  }
  return { deleteDepartment, loading, error: error?.message || null }
}

export function useLinkActionToDepartment() {
  const [mutate, { loading, error }] = useMutation(LINK_ACTION_TO_DEPARTMENT_MUTATION)
  const linkActionToDepartment = async (departmentId: number | string, actionId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, actionId } })
    return data?.linkActionToDepartment?.data
  }
  return { linkActionToDepartment, loading, error: error?.message || null }
}

export function useUnlinkActionFromDepartment() {
  const [mutate, { loading, error }] = useMutation(UNLINK_ACTION_FROM_DEPARTMENT_MUTATION)
  const unlinkActionFromDepartment = async (departmentId: number | string, actionId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, actionId } })
    return data?.unlinkActionFromDepartment?.data
  }
  return { unlinkActionFromDepartment, loading, error: error?.message || null }
}

export function useLinkConsumableToDepartment() {
  const [mutate, { loading, error }] = useMutation(LINK_CONSUMABLE_TO_DEPARTMENT_MUTATION)
  const linkConsumableToDepartment = async (departmentId: number | string, consumableId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, consumableId } })
    return data?.linkConsumableToDepartment?.data
  }
  return { linkConsumableToDepartment, loading, error: error?.message || null }
}

export function useUnlinkConsumableFromDepartment() {
  const [mutate, { loading, error }] = useMutation(UNLINK_CONSUMABLE_FROM_DEPARTMENT_MUTATION)
  const unlinkConsumableFromDepartment = async (departmentId: number | string, consumableId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, consumableId } })
    return data?.unlinkConsumableFromDepartment?.data
  }
  return { unlinkConsumableFromDepartment, loading, error: error?.message || null }
}

export function useAddExemptedInsuranceToDepartment() {
  const [mutate, { loading, error }] = useMutation(ADD_EXEMPTED_INSURANCE_TO_DEPARTMENT_MUTATION)
  const addExemptedInsuranceToDepartment = async (departmentId: number | string, insuranceId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, insuranceId } })
    return data?.addExemptedInsuranceToDepartment?.data
  }
  return { addExemptedInsuranceToDepartment, loading, error: error?.message || null }
}

export function useRemoveExemptedInsuranceFromDepartment() {
  const [mutate, { loading, error }] = useMutation(REMOVE_EXEMPTED_INSURANCE_FROM_DEPARTMENT_MUTATION)
  const removeExemptedInsuranceFromDepartment = async (departmentId: number | string, insuranceId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, insuranceId } })
    return data?.removeExemptedInsuranceFromDepartment?.data
  }
  return { removeExemptedInsuranceFromDepartment, loading, error: error?.message || null }
}

export type ActivationStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE'

export interface PatientRegistrationInput {
  firstName: string
  lastName?: string
  middleName?: string
  dateOfBirth: string
  gender?: string
  contactInfo?: {
    phone?: string
    email?: string
    address?: {
      street?: string
      sector?: string
      district?: string
      country?: string
    }
  }
  emergencyContact?: {
    name?: string
    relation?: string
    phone?: string
  }
  nationalId?: string
  insurances?: {
    insuranceId: number
    insuranceCardNumber?: string
    dominantMember?: {
      firstName?: string
      lastName?: string
      phone?: string
    }
    status?: ActivationStatus
  }[]
  notes?: string
}

export interface PatientInsurance {
  id: string
  insurance: {
    id: string
    name: string
    acronym: string
    coveragePercentage: number
  }
  insuranceCardNumber: string
  dominantMember?: {
    firstName: string
    lastName: string
    phone: string
  }
  status: ActivationStatus
}

export interface PatientFilterInput {
  name?: string
  age?: number
  dob?: string
  phoneNumber?: string
  insuranceName?: string
}

export interface VisitFilterInput {
  status?: string
  billingStatus?: string
  patientName?: string
  fromDate?: string
  toDate?: string
}

export interface PatientPage {
  content: Patient[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export interface PatientPageResponse {
  status: string
  data?: PatientPage
  messages?: {
    text: string
    type: string
  }[]
}

const GET_PATIENTS_QUERY = gql`
  query GetPatients($filter: PatientFilterInput, $page: Int, $size: Int) {
    getPatients(filter: $filter, page: $page, size: $size) {
      status
      messages {
        text
        type
      }
      data {
        content {
          id
          firstName
          lastName
          middleName
          dateOfBirth
          gender
          contactInfo {
            phone
            email
            address {
              street
              sector
              district
              country
            }
          }
          emergencyContact {
            name
            relation
            phone
          }
          nationalId
          insurances {
            id
            insuranceCardNumber
            status
            insurance {
              id
              name
              acronym
              coveragePercentage
            }
            dominantMember {
              firstName
              lastName
              phone
            }
          }
          registrationDate
          registeredBy
          notes
          latestVisit {
            id
            visitDate
            visitStatus
          }
        }
        totalPages
        totalElements
        size
        number
      }
    }
  }
`

const GET_PATIENT_QUERY = gql`
  query GetPatient($id: ID!) {
    getPatient(id: $id) {
      status
      messages {
        text
        type
      }
      data {
        id
        firstName
        lastName
        middleName
        dateOfBirth
        gender
        contactInfo {
          phone
          email
          address {
            street
            sector
            district
            country
          }
        }
        emergencyContact {
          name
          relation
          phone
        }
        nationalId
        insurances {
          id
          insuranceCardNumber
          status
          insurance {
            id
            name
            acronym
            coveragePercentage
          }
          dominantMember {
            firstName
            lastName
            phone
          }
        }
        registrationDate
        registeredBy
        notes
      }
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      status
      data {
        token
        user {
          id
          name
          email
          phoneNumber
          title
          roles
          active
        }
      }
      messages {
        text
        type
      }
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $phoneNumber: String!, $title: String!) {
    register(name: $name, email: $email, password: $password, phoneNumber: $phoneNumber, title: $title) {
      status
      data {
        id
        name
        email
        phoneNumber
        title
      }
      messages {
        text
        type
      }
    }
  }
`

const GET_USERS_QUERY = gql`
  query GetUsers {
    getUsers {
      status
      messages {
        text
        type
      }
      data {
        id
        name
        email
        phoneNumber
        title
        roles
        active
        departments {
          id
          name
        }
      }
    }
  }
`

const ADMIN_CREATE_USER_MUTATION = gql`
  mutation AdminCreateUser(
    $name: String!
    $email: String!
    $phoneNumber: String!
    $title: String
    $roles: [Role]!
    $departmentIds: [ID]
  ) {
    adminCreateUser(
      name: $name
      email: $email
      phoneNumber: $phoneNumber
      title: $title
      roles: $roles
      departmentIds: $departmentIds
    ) {
      status
      messages {
        text
        type
      }
      data {
        id
        name
        email
        phoneNumber
        title
        roles
        active
        departments {
          id
          name
        }
      }
    }
  }
`

const ACTIVATE_USER_MUTATION = gql`
  mutation ActivateUser($userId: ID!) {
    activateUser(userId: $userId) {
      status
      messages {
        text
        type
      }
      data {
        id
        active
      }
    }
  }
`

const DEACTIVATE_USER_MUTATION = gql`
  mutation DeactivateUser($userId: ID!) {
    deactivateUser(userId: $userId) {
      status
      messages {
        text
        type
      }
      data {
        id
        active
      }
    }
  }
`

const UPDATE_USER_ROLES_MUTATION = gql`
  mutation UpdateUserRoles($userId: ID!, $roles: [Role]!) {
    updateUserRoles(userId: $userId, roles: $roles) {
      status
      messages {
        text
        type
      }
      data {
        id
        roles
      }
    }
  }
`

const ADMIN_UPDATE_USER_MUTATION = gql`
  mutation AdminUpdateUser($userId: ID!, $name: String, $phoneNumber: String, $title: String, $departmentIds: [ID]) {
    adminUpdateUser(
      userId: $userId
      name: $name
      phoneNumber: $phoneNumber
      title: $title
      departmentIds: $departmentIds
    ) {
      status
      messages {
        text
        type
      }
      data {
        id
        name
        email
        phoneNumber
        title
        roles
        active
        departments {
          id
          name
        }
      }
    }
  }
`

const UPDATE_MY_PROFILE_MUTATION = gql`
  mutation UpdateMyProfile($name: String, $email: String, $phoneNumber: String, $title: String) {
    updateMyProfile(name: $name, email: $email, phoneNumber: $phoneNumber, title: $title) {
      status
      messages {
        text
        type
      }
      data {
        id
        name
        email
        phoneNumber
        title
        roles
        active
      }
    }
  }
`

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      status
      messages {
        text
        type
      }
      data {
        id
      }
    }
  }
`

const CREATE_PASSWORD_MUTATION = gql`
  mutation CreatePassword($identifier: String!, $password: String!) {
    createPassword(identifier: $identifier, password: $password) {
      status
      messages {
        text
        type
      }
      data {
        id
      }
    }
  }
`

const DELETE_USER_PASSWORD_MUTATION = gql`
  mutation DeleteUserPassword($userId: ID!) {
    deleteUserPassword(userId: $userId) {
      status
      messages {
        text
        type
      }
      data {
        id
      }
    }
  }
`

const GET_VISIT_QUERY = gql`
  query GetVisit($id: ID!) {
    getVisit(id: $id) {
      status
      messages { text type }
      data {
        id
        visitDate
        visitStatus
        billingStatus
        patient {
          id
          firstName
          lastName
          middleName
          gender
          notes
          dateOfBirth
          nationalId
          contactInfo { phone email }
          insurances {
            id
            insuranceCardNumber
            status
            insurance {
              id
              name
              acronym
              coveragePercentage
            }
          }
        }
        insurances {
          id
          name
          acronym
          coveragePercentage
        }
        visitNotes { type text }
        departments {
          id
          status
          transferTime
          completedTime
          department { id name }
          transferredBy { id name title departmentNames }
          processors { startTime endTime }
          actions {
            id
            quantity
            paymentStatus
            doneBy { id name title departmentNames }
            action { id name type privatePrice }
          }
          consumables {
            id
            quantity
            paymentStatus
            doneBy { id name title departmentNames }
            consumable { id name type privatePrice }
          }
        }
      }
    }
  }
`

const VISITS_QUERY = gql`
  query Visits($size: Int, $page: Int, $filter: VisitFilterInput) {
    visits(size: $size, page: $page, filter: $filter) {
      status
      messages {
        text
        type
      }
      data {
        totalPages
        totalElements
        size
        number
        content {
          id
          visitDate
          visitStatus
          billingStatus
          patient {
            id
            firstName
            lastName
            middleName
            gender
            notes
            dateOfBirth
            insurances {
              id
              insuranceCardNumber
              status
              insurance {
                id
                name
                acronym
                coveragePercentage
              }
            }
          }
          insurances {
            id
            name
            acronym
            coveragePercentage
          }
          visitNotes {
            type
            text
          }
          departments {
            id
            status
            transferTime
            completedTime
            department {
              id
              name
            }
            transferredBy {
              id
              name
              title
              departmentNames
            }
            processors {
              startTime
              endTime
            }
            actions {
              id
              quantity
              paymentStatus
              doneBy {
                id
                name
                title
                departmentNames
              }
              action {
                id
                name
                type
                privatePrice
              }
            }
            consumables {
              id
              quantity
              paymentStatus
              doneBy {
                id
                name
                title
                departmentNames
              }
              consumable {
                id
                name
                type
                privatePrice
              }
            }
          }
        }
      }
    }
  }
`

const DASHBOARD_STATS_QUERY = gql`
  query GetDashboardStats($days: Int) {
    getDashboardStats(days: $days) {
      status
      messages {
        text
        type
      }
      data {
        totalVisits
        totalOpen
        totalCompleted
        totalWaitingForBilling
      }
    }
  }
`

const REGISTER_PATIENT_MUTATION = gql`
  mutation RegisterPatient($input: PatientInput!) {
    registerPatient(input: $input) {
      status
      data {
        id
        firstName
        lastName
        middleName
        dateOfBirth
        gender
        contactInfo {
          phone
          email
          address {
            street
            sector
            district
            country
          }
        }
        emergencyContact {
          name
          relation
          phone
        }
        nationalId
        insurances {
          id
          insurance {
            id
            name
            acronym
            coveragePercentage
          }
          insuranceCardNumber
          dominantMember {
            firstName
            lastName
            phone
          }
          status
        }
        registrationDate
        registeredBy
        notes
      }
      messages {
        text
        type
      }
    }
  }
`

const UPDATE_PATIENT_MUTATION = gql`
  mutation UpdatePatient($id: ID!, $input: PatientInput!) {
    updatePatient(id: $id, input: $input) {
      status
      data {
        id
        firstName
        lastName
        middleName
        dateOfBirth
        gender
        contactInfo {
          phone
          email
          address {
            street
            sector
            district
            country
          }
        }
        emergencyContact {
          name
          relation
          phone
        }
        nationalId
        insurances {
          id
          insurance {
            id
            name
            acronym
            coveragePercentage
          }
          insuranceCardNumber
          dominantMember {
            firstName
            lastName
            phone
          }
          status
        }
        registrationDate
        registeredBy
        notes
      }
      messages {
        text
        type
      }
    }
  }
`

const CREATE_VISIT_MUTATION = gql`
  mutation CreateVisit($patientId: ID!, $insuranceIds: [ID], $departmentIds: [ID!]!, $visitType: VisitType!, $visitNotes: [VisitNoteInput]) {
    createVisit(input: {
      patientId: $patientId,
      insuranceIds: $insuranceIds,
      departmentIds: $departmentIds,
      visitType: $visitType,
      visitNotes: $visitNotes
    }) {
      status
      data {
        id
        visitDate
        visitStatus
        billingStatus
        patient {
          id
          firstName
          lastName
          middleName
          gender
        }
        insurances {
          id
          name
          acronym
          coveragePercentage
        }
        departments {
          id
          department {
            id
            name
          }
          status
        }
      }
      messages {
        text
        type
      }
    }
  }
`

const ADD_VISIT_NOTE_MUTATION = gql`
  mutation AddVisitNote($visitId: ID!, $type: NoteType, $text: String!) {
    addVisitNote(visitId: $visitId, type: $type, text: $text) {
      status
      data {
        id
        visitStatus
        visitNotes {
          type
          text
        }
      }
      messages {
        text
        type
      }
    }
  }
`

const ADD_DEPARTMENT_NOTE_MUTATION = gql`
  mutation AddDepartmentNote($visitId: ID!, $departmentId: ID!, $type: NoteType, $text: String!) {
    addDepartmentNote(visitId: $visitId, departmentId: $departmentId, type: $type, text: $text) {
      status
      data {
        id
        departments {
          id
          department { id name }
          notes {
            type
            text
          }
        }
      }
      messages {
        text
        type
      }
    }
  }
`

const UPSERT_CONSULTATION_ANSWERS_MUTATION = gql`
  mutation UpsertConsultationAnswers($input: ConsultationAnswersInput!) {
    upsertConsultationAnswers(input: $input) {
      status
      data {
        id
        consultationId
        visitId
        patientId
        departmentId
        formId
        formSchemaVersion
        status
        answers
        submittedAt
        updatedAt
      }
      messages {
        text
        type
      }
    }
  }
`

// Note: According to the GraphQL schema, CreateVisitInput includes:
// patientId: ID!
// insuranceIds: [ID]
// departmentIds: [ID]
// visitType: VisitType!
// visitNotes: [VisitNoteInput]

export function useLogin() {
  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION)

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation({
        variables: { email, password }
      })
      return result.data.login as LoginResponse
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  }

  return { login, loading, error }
}

export function useRegister() {
  const [registerMutation, { loading, error }] = useMutation(REGISTER_MUTATION)

  const register = async (name: string, email: string, password: string, phoneNumber: string, title: string) => {
    try {
      const result = await registerMutation({
        variables: { name, email, password, phoneNumber, title }
      })
      return result.data.register as RegisterResponse
    } catch (err) {
      console.error('Register error:', err)
      throw err
    }
  }

  return { register, loading, error }
}

export function useUsers() {
  const { data, loading, error, refetch } = useQuery(GET_USERS_QUERY, {
    fetchPolicy: 'cache-and-network'
  })

  // Safely extract error message to prevent rendering Error objects
  const errorMessage = error?.message || null

  return {
    users: (data?.getUsers?.data || []) as UserAccount[],
    loading,
    error: errorMessage,
    refetch,
  }
}

export function useAdminCreateUser() {
  const [mutation, { loading, error }] = useMutation(ADMIN_CREATE_USER_MUTATION)

  const adminCreateUser = async (input: {
    name: string
    email: string
    phoneNumber: string
    title?: string
    roles: string[]
    departmentIds?: string[]
  }) => {
    try {
      const result = await mutation({ variables: { ...input } })
      return result.data?.adminCreateUser as UserResponse
    } catch (err) {
      console.error('Admin create user error:', err)
      throw err
    }
  }

  return { adminCreateUser, loading, error }
}

export function useActivateUser() {
  const [mutation, { loading, error }] = useMutation(ACTIVATE_USER_MUTATION)

  const activateUser = async (userId: string) => {
    try {
      const result = await mutation({ variables: { userId } })
      return result.data?.activateUser as UserResponse
    } catch (err) {
      console.error('Activate user error:', err)
      throw err
    }
  }

  return { activateUser, loading, error }
}

export function useDeactivateUser() {
  const [mutation, { loading, error }] = useMutation(DEACTIVATE_USER_MUTATION)

  const deactivateUser = async (userId: string) => {
    try {
      const result = await mutation({ variables: { userId } })
      return result.data?.deactivateUser as UserResponse
    } catch (err) {
      console.error('Deactivate user error:', err)
      throw err
    }
  }

  return { deactivateUser, loading, error }
}

export function useUpdateUserRoles() {
  const [mutation, { loading, error }] = useMutation(UPDATE_USER_ROLES_MUTATION)

  const updateUserRoles = async (userId: string, roles: string[]) => {
    try {
      const result = await mutation({ variables: { userId, roles } })
      return result.data?.updateUserRoles as UserResponse
    } catch (err) {
      console.error('Update user roles error:', err)
      throw err
    }
  }

  return { updateUserRoles, loading, error }
}

export function useAdminUpdateUser() {
  const [mutation, { loading, error }] = useMutation(ADMIN_UPDATE_USER_MUTATION)

  const adminUpdateUser = async (input: {
    userId: string
    name?: string
    phoneNumber?: string
    title?: string
    departmentIds?: string[]
  }) => {
    try {
      const result = await mutation({ variables: { ...input } })
      return result.data?.adminUpdateUser as UserResponse
    } catch (err) {
      console.error('Admin update user error:', err)
      throw err
    }
  }

  return { adminUpdateUser, loading, error }
}

export function useUpdateMyProfile() {
  const [mutation, { loading, error }] = useMutation(UPDATE_MY_PROFILE_MUTATION)

  const updateMyProfile = async (input: {
    name?: string
    email?: string
    phoneNumber?: string
    title?: string
  }) => {
    try {
      const result = await mutation({ variables: { ...input } })
      return result.data?.updateMyProfile as UserResponse
    } catch (err) {
      console.error('Update my profile error:', err)
      throw err
    }
  }

  return { updateMyProfile, loading, error }
}

export function useChangePassword() {
  const [mutation, { loading, error }] = useMutation(CHANGE_PASSWORD_MUTATION)

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const result = await mutation({ variables: { currentPassword, newPassword } })
      return result.data?.changePassword as UserResponse
    } catch (err) {
      console.error('Change password error:', err)
      throw err
    }
  }

  return { changePassword, loading, error }
}

export function useCreatePassword() {
  const [mutation, { loading, error }] = useMutation(CREATE_PASSWORD_MUTATION)

  const createPassword = async (identifier: string, password: string) => {
    try {
      const result = await mutation({ variables: { identifier, password } })
      return result.data?.createPassword as UserResponse
    } catch (err) {
      console.error('Create password error:', err)
      throw err
    }
  }

  return { createPassword, loading, error }
}

export function useDeleteUserPassword() {
  const [mutation, { loading, error }] = useMutation(DELETE_USER_PASSWORD_MUTATION)

  const deleteUserPassword = async (userId: string) => {
    try {
      const result = await mutation({ variables: { userId } })
      return result.data?.deleteUserPassword as UserResponse
    } catch (err) {
      console.error('Delete user password error:', err)
      throw err
    }
  }

  return { deleteUserPassword, loading, error }
}

export function useVisits(size?: number, page?: number, filter?: VisitFilterInput) {
  const { data, loading, error, refetch } = useQuery(VISITS_QUERY, {
    variables: { size, page, filter },
    fetchPolicy: 'cache-and-network'
  })

  // Safely extract error message to prevent rendering Error objects
  const errorMessage = error?.message || null

  return {
    visits: data?.visits?.data?.content || [],
    totalPages: data?.visits?.data?.totalPages || 0,
    totalElements: data?.visits?.data?.totalElements || 0,
    loading,
    error: errorMessage,
    refetch
  }
}

export function useDashboardStats(days: number = 1) {
  const { data, loading, error, refetch } = useQuery(DASHBOARD_STATS_QUERY, {
    variables: { days },
    fetchPolicy: 'cache-and-network',
  })

  const stats = data?.getDashboardStats?.data || null

  return {
    stats: stats
      ? {
          totalVisits: Number(stats.totalVisits || 0),
          totalOpen: Number(stats.totalOpen || 0),
          totalCompleted: Number(stats.totalCompleted || 0),
          totalWaitingForBilling: Number(stats.totalWaitingForBilling || 0),
        }
      : null,
    loading,
    error: error?.message || null,
    refetch,
  }
}

export function useRegisterPatient() {
  const [registerPatientMutation, { loading, error }] = useMutation(REGISTER_PATIENT_MUTATION)

  const registerPatient = async (input: PatientRegistrationInput) => {
    try {
      const result = await registerPatientMutation({
        variables: { input }
      })
      return result.data.registerPatient as PatientResponse
    } catch (err) {
      console.error('Patient registration error:', err)
      throw err
    }
  }

  return { registerPatient, loading, error }
}

export function useUpdatePatient() {
  const [updatePatientMutation, { loading, error }] = useMutation(UPDATE_PATIENT_MUTATION)

  const updatePatient = async (id: string, input: PatientRegistrationInput) => {
    try {
      const result = await updatePatientMutation({
        variables: { id, input }
      })
      return result.data.updatePatient as PatientResponse
    } catch (err) {
      console.error('Patient update error:', err)
      throw err
    }
  }

  return { updatePatient, loading, error }
}

const GET_INSURANCES_QUERY = gql`
  query GetInsurances {
    getInsurances {
      status
      messages {
        text
        type
      }
      data {
        id
        name
        acronym
        coveragePercentage
      }
    }
  }
`

export function useInsurances() {
  const { data, loading, error, refetch } = useQuery(GET_INSURANCES_QUERY, {
    fetchPolicy: 'cache-and-network'
  })

  const insurances = data?.getInsurances?.data || []

  return { insurances, loading: loading || false, error: error?.message || null, refetch }
}

export function usePatients(filter?: PatientFilterInput, page: number = 0, size: number = 20) {
  const shouldSkip = !filter || Object.keys(filter).filter(key => filter[key as keyof PatientFilterInput] != null).length === 0
  
  const { data, loading, error, refetch } = useQuery(GET_PATIENTS_QUERY, {
    variables: { filter, page, size },
    skip: shouldSkip,
    fetchPolicy: 'cache-and-network'
  })

  const patients = data?.getPatients?.data?.content || []
  const totalPages = data?.getPatients?.data?.totalPages || 0
  const totalElements = data?.getPatients?.data?.totalElements || 0

  return {
    patients,
    loading,
    error,
    totalPages,
    totalElements,
    refetch
  }
}

export function usePatient(id: string | null) {
  const { data, loading, error, refetch } = useQuery(GET_PATIENT_QUERY, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network'
  })

  const patient = data?.getPatient?.data

  return {
    patient,
    loading,
    error,
    refetch
  }
}

export function useVisit(id: string | null) {
  const { data, loading, error, refetch } = useQuery(GET_VISIT_QUERY, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network'
  })

  const visit = data?.getVisit?.data as Visit | undefined
  // Safely extract error message to prevent rendering Error objects
  const errorMessage = error?.message || null

  return {
    visit,
    loading,
    error: errorMessage,
    refetch,
  }
}

export function useCreateVisit() {
  const [createVisitMutation, { loading, error }] = useMutation(CREATE_VISIT_MUTATION)

  const createVisit = async (input: {
    patientId: string
    insuranceIds?: string[]
    departmentIds: string[]
    visitType?: 'INPATIENT' | 'OUTPATIENT' | 'TELEMEDICINE'
    visitNotes?: { type: string; text: string }[]
  }) => {
    try {
      const result = await createVisitMutation({
        variables: {
          patientId: input.patientId,
          insuranceIds: input.insuranceIds,
          departmentIds: input.departmentIds,
          visitType: input.visitType || 'OUTPATIENT',
          visitNotes: input.visitNotes,
        }
      })
      return result.data.createVisit as VisitResponse
    } catch (err) {
      console.error('Visit creation error:', err)
      throw err
    }
  }

  return { createVisit, loading, error }
}

export function useAddVisitNote() {
  const [mutation, { loading, error }] = useMutation(ADD_VISIT_NOTE_MUTATION)

  const addVisitNote = async (visitId: string, type: string | null | undefined, text: string) => {
    try {
      const result = await mutation({ variables: { visitId, type, text } })
      return result.data?.addVisitNote as VisitResponse
    } catch (err) {
      console.error('Add visit note error:', err)
      throw err
    }
  }

  return { addVisitNote, loading, error }
}

export function useAddDepartmentNote() {
  const [mutation, { loading, error }] = useMutation(ADD_DEPARTMENT_NOTE_MUTATION)

  const addDepartmentNote = async (visitId: string, departmentId: string, type: string | null | undefined, text: string) => {
    try {
      const result = await mutation({ variables: { visitId, departmentId, type, text } })
      return result.data?.addDepartmentNote as VisitResponse
    } catch (err) {
      console.error('Add department note error:', err)
      throw err
    }
  }

  return { addDepartmentNote, loading, error }
}

export function useUpsertConsultationAnswers() {
  const [upsertMutation, { loading, error }] = useMutation(UPSERT_CONSULTATION_ANSWERS_MUTATION)

  const upsertConsultationAnswers = async (input: {
    consultationId: string
    visitId: string
    patientId: string
    departmentId: string
    formId: string
    formSchemaVersion: string
    status: 'DRAFT' | 'FINAL'
    answers: string
  }) => {
    try {
      const result = await upsertMutation({ variables: { input } })
      return result.data?.upsertConsultationAnswers as ConsultationAnswersResponse
    } catch (err) {
      console.error('Upsert consultation answers error:', err)
      throw err
    }
  }

  return { upsertConsultationAnswers, loading, error }
}

// Process visit department (move department to IN_PROGRESS)
const PROCESS_VISIT_DEPARTMENT_MUTATION = gql`
  mutation ProcessVisitDepartment($visitId: ID!, $departmentId: ID!) {
    processVisitDepartment(input: { visitId: $visitId, departmentId: $departmentId }) {
      status
      data {
        id
        visitStatus
        departments {
          id
          status
          department { id name }
          processors { startTime endTime }
          actions { id action { id name type privatePrice } quantity }
          consumables { id consumable { id name type privatePrice } quantity }
        }
      }
      messages { text type }
    }
  }
`

export function useProcessVisitDepartment() {
  const [processMutation, { loading, error }] = useMutation(PROCESS_VISIT_DEPARTMENT_MUTATION)

  const processDepartment = async (visitId: string, departmentId: string) => {
    try {
      const result = await processMutation({ variables: { visitId, departmentId } })
      return result.data.processVisitDepartment as VisitResponse
    } catch (err) {
      console.error('Process department error:', err)
      throw err
    }
  }

  return { processDepartment, loading, error }
}

// Add action to visit department
const ADD_ACTION_TO_VISIT_DEPARTMENT_MUTATION = gql`
  mutation AddActionToVisitDepartment($visitId: ID!, $departmentId: ID!, $actionId: ID!, $quantity: Int) {
    addActionToVisitDepartment(input: { visitId: $visitId, departmentId: $departmentId, actionId: $actionId, quantity: $quantity }) {
      status
      data {
        id
        departments {
          id
          status
          actions { id action { id name type privatePrice } quantity }
          consumables { id consumable { id name type privatePrice } quantity }
        }
      }
      messages { text type }
    }
  }
`

export function useAddActionToVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(ADD_ACTION_TO_VISIT_DEPARTMENT_MUTATION)

  const addAction = async (visitId: string, departmentId: string, actionId: string, quantity?: number) => {
    try {
      const result = await mutation({ variables: { visitId, departmentId, actionId, quantity } })
      return result.data.addActionToVisitDepartment as VisitResponse
    } catch (err) {
      console.error('Add action error:', err)
      throw err
    }
  }

  return { addAction, loading, error }
}

// Add consumable to visit department
const ADD_CONSUMABLE_TO_VISIT_DEPARTMENT_MUTATION = gql`
  mutation AddConsumableToVisitDepartment($visitId: ID!, $departmentId: ID!, $consumableId: ID!, $quantity: Int) {
    addConsumableToVisitDepartment(input: { visitId: $visitId, departmentId: $departmentId, consumableId: $consumableId, quantity: $quantity }) {
      status
      data {
        id
        departments {
          id
          status
          actions { id action { id name type privatePrice } quantity }
          consumables { id consumable { id name type privatePrice } quantity }
        }
      }
      messages { text type }
    }
  }
`

export function useAddConsumableToVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(ADD_CONSUMABLE_TO_VISIT_DEPARTMENT_MUTATION)

  const addConsumable = async (visitId: string, departmentId: string, consumableId: string, quantity?: number) => {
    try {
      const result = await mutation({ variables: { visitId, departmentId, consumableId, quantity } })
      return result.data.addConsumableToVisitDepartment as VisitResponse
    } catch (err) {
      console.error('Add consumable error:', err)
      throw err
    }
  }

  return { addConsumable, loading, error }
}

// Complete visit department
const COMPLETE_VISIT_DEPARTMENT_MUTATION = gql`
  mutation CompleteVisitDepartment($visitId: ID!, $departmentId: ID!) {
    completeVisitDepartment(input: { visitId: $visitId, departmentId: $departmentId }) {
      status
      data {
        id
        visitStatus
        departments {
          id
          status
          completedTime
          department { id name }
        }
      }
      messages { text type }
    }
  }
`

export function useCompleteVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(COMPLETE_VISIT_DEPARTMENT_MUTATION)

  const completeDepartment = async (visitId: string, departmentId: string) => {
    try {
      const result = await mutation({ variables: { visitId, departmentId } })
      return result.data.completeVisitDepartment as VisitResponse
    } catch (err) {
      console.error('Complete department error:', err)
      throw err
    }
  }

  return { completeDepartment, loading, error }
}

const UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION = gql`
  mutation UpdateVisitDepartmentStatus($visitId: ID!, $departmentId: ID!, $status: DepartmentStatus!) {
    updateVisitDepartmentStatus(input: { visitId: $visitId, departmentId: $departmentId, status: $status }) {
      status
      data {
        id
        visitStatus
        departments {
          id
          status
          completedTime
          department { id name }
        }
      }
      messages { text type }
    }
  }
`

export function useUpdateVisitDepartmentStatus() {
  const [mutation, { loading, error }] = useMutation(UPDATE_VISIT_DEPARTMENT_STATUS_MUTATION)

  const updateDepartmentStatus = async (
    visitId: string,
    departmentId: string,
    status: 'PENDING' | 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  ) => {
    try {
      const result = await mutation({ variables: { visitId, departmentId, status } })
      return result.data.updateVisitDepartmentStatus as VisitResponse
    } catch (err) {
      console.error('Update visit department status error:', err)
      throw err
    }
  }

  return { updateDepartmentStatus, loading, error }
}

const GET_ACTIONS_QUERY = gql`
  query GetActions($name: String, $page: Int, $size: Int) {
    getActions(name: $name, page: $page, size: $size) {
      status
      messages {
        text
        type
      }
      data {
        content {
          id
          name
          quantifiable
          type
          privatePrice
          clinicPrice
          insuranceCoverages {
            id
            insurance {
              id
              name
              acronym
              coveragePercentage
            }
            price
          }
        }
        totalPages
        totalElements
        size
        number
      }
    }
  }
`

export function useActions() {
  const { data, loading, error, refetch: refetchQuery } = useQuery(GET_ACTIONS_QUERY, {
    variables: { page: 0, size: 100 },
    fetchPolicy: 'cache-and-network'
  })

  const actions = data?.getActions?.data?.content || []

  const refetch = async (name?: string, page: number = 0, size: number = 100) => {
    return refetchQuery({ name, page, size })
  }

  return { actions, loading: loading || false, error: error?.message || null, refetch }
}

const GET_CONSUMABLES_QUERY = gql`
  query GetConsumables($name: String, $page: Int, $size: Int) {
    getConsumables(name: $name, page: $page, size: $size) {
      status
      messages {
        text
        type
      }
      data {
        content {
          id
          name
          quantifiable
          type
          privatePrice
          clinicPrice
          insuranceCoverages {
            id
            insurance {
              id
              name
              acronym
              coveragePercentage
            }
            price
          }
        }
        totalPages
        totalElements
        size
        number
      }
    }
  }
`

export function useConsumables() {
  const { data, loading, error, refetch: refetchQuery } = useQuery(GET_CONSUMABLES_QUERY, {
    variables: { page: 0, size: 100 },
    fetchPolicy: 'cache-and-network'
  })

  const consumables = data?.getConsumables?.data?.content || []

  const refetch = async (name?: string, page: number = 0, size: number = 100) => {
    return refetchQuery({ name, page, size })
  }

  return { consumables, loading: loading || false, error: error?.message || null, refetch }
}

// Remove action from visit department
const REMOVE_ACTION_FROM_VISIT_DEPARTMENT_MUTATION = gql`
  mutation RemoveActionFromVisitDepartment($visitId: ID!, $departmentId: ID!, $itemId: ID!) {
    removeActionFromVisitDepartment(input: { visitId: $visitId, departmentId: $departmentId, itemId: $itemId }) {
      status
      data {
        id
        departments {
          id
          status
          actions { id action { id name type privatePrice } quantity }
          consumables { id consumable { id name type privatePrice } quantity }
        }
      }
      messages { text type }
    }
  }
`

export function useRemoveActionFromVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(REMOVE_ACTION_FROM_VISIT_DEPARTMENT_MUTATION)

  const removeAction = async (visitId: string, departmentId: string, actionId: string) => {
    try {
      const result = await mutation({ variables: { visitId, departmentId, itemId: actionId } })
      return result.data.removeActionFromVisitDepartment as VisitResponse
    } catch (err) {
      console.error('Remove action error:', err)
      throw err
    }
  }

  return { removeAction, loading, error }
}

// Remove consumable from visit department
const REMOVE_CONSUMABLE_FROM_VISIT_DEPARTMENT_MUTATION = gql`
  mutation RemoveConsumableFromVisitDepartment($visitId: ID!, $departmentId: ID!, $itemId: ID!) {
    removeConsumableFromVisitDepartment(input: { visitId: $visitId, departmentId: $departmentId, itemId: $itemId }) {
      status
      data {
        id
        departments {
          id
          status
          actions { id action { id name type privatePrice } quantity }
          consumables { id consumable { id name type privatePrice } quantity }
        }
      }
      messages { text type }
    }
  }
`

export function useRemoveConsumableFromVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(REMOVE_CONSUMABLE_FROM_VISIT_DEPARTMENT_MUTATION)

  const removeConsumable = async (visitId: string, departmentId: string, consumableId: string) => {
    try {
      const result = await mutation({ variables: { visitId, departmentId, itemId: consumableId } })
      return result.data.removeConsumableFromVisitDepartment as VisitResponse
    } catch (err) {
      console.error('Remove consumable error:', err)
      throw err
    }
  }

  return { removeConsumable, loading, error }
}

// Update action quantity in visit department
const UPDATE_ACTION_QUANTITY_MUTATION = gql`
  mutation UpdateActionQuantity($visitId: ID!, $departmentId: ID!, $itemId: ID!, $quantity: Int!) {
    updateActionQuantity(input: { visitId: $visitId, departmentId: $departmentId, itemId: $itemId, quantity: $quantity }) {
      status
      data {
        id
        departments {
          id
          status
          actions { id action { id name type privatePrice } quantity }
          consumables { id consumable { id name type privatePrice } quantity }
        }
      }
      messages { text type }
    }
  }
`

export function useUpdateActionQuantity() {
  const [mutation, { loading, error }] = useMutation(UPDATE_ACTION_QUANTITY_MUTATION)

  const updateQuantity = async (visitId: string, departmentId: string, itemId: string, quantity: number) => {
    try {
      const result = await mutation({ variables: { visitId, departmentId, itemId, quantity } })
      const response = result.data.updateActionQuantity as VisitResponse
      if (response.status !== 'SUCCESS') {
        const errorMsg = response.messages?.[0]?.text || `Update failed with status: ${response.status}`
        console.error('Update action quantity failed:', errorMsg)
        throw new Error(errorMsg)
      }
      return response
    } catch (err) {
      console.error('Update action quantity error:', err)
      throw err
    }
  }

  return { updateQuantity, loading, error }
}

// Update consumable quantity in visit department
const UPDATE_CONSUMABLE_QUANTITY_MUTATION = gql`
  mutation UpdateConsumableQuantity($visitId: ID!, $departmentId: ID!, $itemId: ID!, $quantity: Int!) {
    updateConsumableQuantity(input: { visitId: $visitId, departmentId: $departmentId, itemId: $itemId, quantity: $quantity }) {
      status
      data {
        id
        departments {
          id
          status
          actions { id action { id name type privatePrice } quantity }
          consumables { id consumable { id name type privatePrice } quantity }
        }
      }
      messages { text type }
    }
  }
`

export function useUpdateConsumableQuantity() {
  const [mutation, { loading, error }] = useMutation(UPDATE_CONSUMABLE_QUANTITY_MUTATION)

  const updateQuantity = async (visitId: string, departmentId: string, itemId: string, quantity: number) => {
    try {
      const result = await mutation({ variables: { visitId, departmentId, itemId, quantity } })
      const response = result.data.updateConsumableQuantity as VisitResponse
      if (response.status !== 'SUCCESS') {
        const errorMsg = response.messages?.[0]?.text || `Update failed with status: ${response.status}`
        console.error('Update consumable quantity failed:', errorMsg)
        throw new Error(errorMsg)
      }
      return response
    } catch (err) {
      console.error('Update consumable quantity error:', err)
      throw err
    }
  }

  return { updateQuantity, loading, error }
}

// Billing Queries and Mutations
const GET_BILL_BY_VISIT_QUERY = gql`
  query GetBillByVisit($visitId: ID!) {
    getBillByVisit(visitId: $visitId) {
      status
      data {
        id
        billingDisplayId
        billedByUser {
          id
          name
          title
        }
        billedAt
        note
        globalDiscount {
          type
          value
        }
        totals {
          beforeDiscount
          discount
          afterDiscount
          patientTotalDue
          insuranceTotalCover
          patientTotalPaid
          patientBalance
        }
        status
        billingItems {
          id
          department {
            id
            name
          }
          action {
            id
            name
          }
          items {
            id
            itemType
            itemId
            name
            basePriceAtBilling
            quantity
            paymentMode
            insurance {
              id
              name
              acronym
              coveragePercentage
            }
            insurancePartAmount
            patientPartAmount
            exemptionType
            exemptionReason
            itemDiscount {
              type
              value
            }
            finalAmountCharged
          }
        }
        payments {
          id
          billId
          scope
          department {
            id
            name
          }
          method
          amount
          receivedByUser {
            id
            name
            title
          }
          receivedAt
          reference
        }
      }
      messages {
        text
        type
      }
    }
  }
`

const CREATE_BILL_MUTATION = gql`
  mutation CreateBill($input: BillingRequestInput!) {
    createBill(input: $input) {
      status
      data {
        id
        billingDisplayId
        billedByUser {
          id
          name
          title
        }
        billedAt
        note
        totals {
          beforeDiscount
          discount
          afterDiscount
          patientTotalDue
          insuranceTotalCover
          patientTotalPaid
          patientBalance
        }
        status
      }
      messages {
        text
        type
      }
    }
  }
`

export interface BillResponse {
  status: string
  data?: {
    id: string
    billingDisplayId: string
    billedByUser: {
      id: string
      name: string
      title?: string
    }
    billedAt: string
    note?: string
    globalDiscount?: {
      type: string
      value: number
    }
    totals: {
      beforeDiscount: number
      discount: number
      afterDiscount: number
      patientTotalDue: number
      insuranceTotalCover: number
      patientTotalPaid: number
      patientBalance: number
    }
    status: string
    billingItems?: {
      id: string
      department: {
        id: string
        name: string
      }
      action?: {
        id: string
        name: string
      }
      items: {
        id: string
        itemType: string
        itemId: string
        name: string
        basePriceAtBilling: number
        quantity: number
        paymentMode: string
        insurance?: {
          id: string
          name: string
          acronym: string
          coveragePercentage: number
        }
        insurancePartAmount?: number
        patientPartAmount?: number
        exemptionType?: string
        exemptionReason?: string
        itemDiscount?: {
          type: string
          value: number
        }
        finalAmountCharged: number
      }[]
    }[]
    payments?: {
      id: string
      billId: string
      scope: string
      department?: {
        id: string
        name: string
      }
      method: string
      amount: number
      receivedByUser: {
        id: string
        name: string
        title?: string
      }
      receivedAt: string
      reference?: string
    }[]
  }
  messages?: {
    text: string
    type: string
  }[]
}

export function useGetBillByVisit(visitId: string | null) {
  const { data, loading, error, refetch } = useQuery(GET_BILL_BY_VISIT_QUERY, {
    variables: { visitId },
    skip: !visitId,
    fetchPolicy: 'cache-and-network'
  })

  const bill = data?.getBillByVisit?.data

  return {
    bill,
    loading,
    error,
    refetch,
  }
}

export function useCreateBill() {
  const [createBillMutation, { loading, error }] = useMutation(CREATE_BILL_MUTATION)

  const createBill = async (input: {
    visitId: string
    note?: string
    globalDiscount?: {
      type: 'NONE' | 'FIXED' | 'PERCENTAGE'
      value: number
    }
    billingItems: {
      departmentId: string
      actionId?: string
      items: {
        itemType: string
        itemId: string
        quantity: number
        insuranceId?: string
        itemDiscount?: {
          type: 'NONE' | 'FIXED' | 'PERCENTAGE'
          value: number
        }
      }[]
    }[]
  }) => {
    try {
      const result = await createBillMutation({
        variables: { input }
      })
      return result.data.createBill as BillResponse
    } catch (err) {
      console.error('Create bill error:', err)
      throw err
    }
  }

  return { createBill, loading, error }
}

// Insurance Coverage Management for Actions
const ADD_ACTION_INSURANCE_COVERAGE_MUTATION = gql`
  mutation AddActionInsuranceCoverage($id: ID!, $insuranceId: ID!, $price: Float!) {
    addActionInsuranceCoverage(id: $id, input: { insuranceId: $insuranceId, price: $price }) {
      status
      data {
        id
        name
        insuranceCoverages {
          id
          insurance {
            id
            name
            acronym
            coveragePercentage
          }
          price
        }
      }
      messages {
        text
        type
      }
    }
  }
`

const REMOVE_ACTION_INSURANCE_COVERAGE_MUTATION = gql`
  mutation RemoveActionInsuranceCoverage($id: ID!, $insuranceId: ID!) {
    removeActionInsuranceCoverage(id: $id, insuranceId: $insuranceId) {
      status
      data {
        id
        name
        insuranceCoverages {
          id
          insurance {
            id
            name
            acronym
            coveragePercentage
          }
          price
        }
      }
      messages {
        text
        type
      }
    }
  }
`

export function useAddActionInsuranceCoverage() {
  const [mutation, { loading, error }] = useMutation(ADD_ACTION_INSURANCE_COVERAGE_MUTATION)

  const addCoverage = async (actionId: string, insuranceId: string, price: number) => {
    try {
      const result = await mutation({ variables: { id: actionId, insuranceId, price } })
      return result.data.addActionInsuranceCoverage
    } catch (err) {
      console.error('Add action insurance coverage error:', err)
      throw err
    }
  }

  return { addCoverage, loading, error }
}

export function useRemoveActionInsuranceCoverage() {
  const [mutation, { loading, error }] = useMutation(REMOVE_ACTION_INSURANCE_COVERAGE_MUTATION)

  const removeCoverage = async (actionId: string, insuranceId: string) => {
    try {
      const result = await mutation({ variables: { id: actionId, insuranceId } })
      return result.data.removeActionInsuranceCoverage
    } catch (err) {
      console.error('Remove action insurance coverage error:', err)
      throw err
    }
  }

  return { removeCoverage, loading, error }
}

// Insurance Coverage Management for Consumables
const ADD_CONSUMABLE_INSURANCE_COVERAGE_MUTATION = gql`
  mutation AddConsumableInsuranceCoverage($id: ID!, $insuranceId: ID!, $price: Float!) {
    addConsumableInsuranceCoverage(id: $id, input: { insuranceId: $insuranceId, price: $price }) {
      status
      data {
        id
        name
        insuranceCoverages {
          id
          insurance {
            id
            name
            acronym
            coveragePercentage
          }
          price
        }
      }
      messages {
        text
        type
      }
    }
  }
`

const REMOVE_CONSUMABLE_INSURANCE_COVERAGE_MUTATION = gql`
  mutation RemoveConsumableInsuranceCoverage($id: ID!, $insuranceId: ID!) {
    removeConsumableInsuranceCoverage(id: $id, insuranceId: $insuranceId) {
      status
      data {
        id
        name
        insuranceCoverages {
          id
          insurance {
            id
            name
            acronym
            coveragePercentage
          }
          price
        }
      }
      messages {
        text
        type
      }
    }
  }
`

export function useAddConsumableInsuranceCoverage() {
  const [mutation, { loading, error }] = useMutation(ADD_CONSUMABLE_INSURANCE_COVERAGE_MUTATION)

  const addCoverage = async (consumableId: string, insuranceId: string, price: number) => {
    try {
      const result = await mutation({ variables: { id: consumableId, insuranceId, price } })
      return result.data.addConsumableInsuranceCoverage
    } catch (err) {
      console.error('Add consumable insurance coverage error:', err)
      throw err
    }
  }

  return { addCoverage, loading, error }
}

export function useRemoveConsumableInsuranceCoverage() {
  const [mutation, { loading, error }] = useMutation(REMOVE_CONSUMABLE_INSURANCE_COVERAGE_MUTATION)

  const removeCoverage = async (consumableId: string, insuranceId: string) => {
    try {
      const result = await mutation({ variables: { id: consumableId, insuranceId } })
      return result.data.removeConsumableInsuranceCoverage
    } catch (err) {
      console.error('Remove consumable insurance coverage error:', err)
      throw err
    }
  }

  return { removeCoverage, loading, error }
}

// Create/Update/Delete Actions and Consumables using GraphQL
const CREATE_ACTIONS_MUTATION = gql`
  mutation CreateActions($input: [ActionInput!]!) {
    createActions(input: $input) {
      status
      data {
        id
        name
        quantifiable
        type
        privatePrice
        clinicPrice
      }
      messages {
        text
        type
      }
    }
  }
`

const UPDATE_ACTION_MUTATION = gql`
  mutation UpdateAction($id: ID!, $input: ActionInput!) {
    updateAction(id: $id, input: $input) {
      status
      data {
        id
        name
        quantifiable
        type
        privatePrice
        clinicPrice
      }
      messages {
        text
        type
      }
    }
  }
`

const DELETE_ACTION_MUTATION = gql`
  mutation DeleteAction($id: ID!) {
    deleteAction(id: $id) {
      status
      messages {
        text
        type
      }
    }
  }
`

export function useCreateActions() {
  const [mutation, { loading, error }] = useMutation(CREATE_ACTIONS_MUTATION)

  const createActions = async (actions: Array<{
    name: string
    quantifiable: boolean
    type: string
    privatePrice: number
    clinicPrice?: number
  }>) => {
    try {
      const result = await mutation({ variables: { input: actions } })
      return result.data.createActions
    } catch (err) {
      console.error('Create actions error:', err)
      throw err
    }
  }

  return { createActions, loading, error }
}

export function useUpdateAction() {
  const [mutation, { loading, error }] = useMutation(UPDATE_ACTION_MUTATION)

  const updateAction = async (id: string, input: {
    name: string
    quantifiable: boolean
    type: string
    privatePrice: number
    clinicPrice?: number
  }) => {
    try {
      const result = await mutation({ variables: { id, input } })
      return result.data.updateAction
    } catch (err) {
      console.error('Update action error:', err)
      throw err
    }
  }

  return { updateAction, loading, error }
}

export function useDeleteAction() {
  const [mutation, { loading, error }] = useMutation(DELETE_ACTION_MUTATION)

  const deleteAction = async (id: string) => {
    try {
      const result = await mutation({ variables: { id } })
      return result.data.deleteAction
    } catch (err) {
      console.error('Delete action error:', err)
      throw err
    }
  }

  return { deleteAction, loading, error }
}

const CREATE_CONSUMABLES_MUTATION = gql`
  mutation CreateConsumables($input: [ConsumableInput!]!) {
    createConsumables(input: $input) {
      status
      data {
        id
        name
        quantifiable
        type
        privatePrice
        clinicPrice
      }
      messages {
        text
        type
      }
    }
  }
`

const UPDATE_CONSUMABLE_MUTATION = gql`
  mutation UpdateConsumable($id: ID!, $input: ConsumableInput!) {
    updateConsumable(id: $id, input: $input) {
      status
      data {
        id
        name
        quantifiable
        type
        privatePrice
        clinicPrice
      }
      messages {
        text
        type
      }
    }
  }
`

const DELETE_CONSUMABLE_MUTATION = gql`
  mutation DeleteConsumable($id: ID!) {
    deleteConsumable(id: $id) {
      status
      messages {
        text
        type
      }
    }
  }
`

export function useCreateConsumables() {
  const [mutation, { loading, error }] = useMutation(CREATE_CONSUMABLES_MUTATION)

  const createConsumables = async (consumables: Array<{
    name: string
    quantifiable: boolean
    type: string
    privatePrice: number
    clinicPrice?: number
  }>) => {
    try {
      const result = await mutation({ variables: { input: consumables } })
      return result.data.createConsumables
    } catch (err) {
      console.error('Create consumables error:', err)
      throw err
    }
  }

  return { createConsumables, loading, error }
}

export function useUpdateConsumable() {
  const [mutation, { loading, error }] = useMutation(UPDATE_CONSUMABLE_MUTATION)

  const updateConsumable = async (id: string, input: {
    name: string
    quantifiable: boolean
    type: string
    privatePrice: number
    clinicPrice?: number
  }) => {
    try {
      const result = await mutation({ variables: { id, input } })
      return result.data.updateConsumable
    } catch (err) {
      console.error('Update consumable error:', err)
      throw err
    }
  }

  return { updateConsumable, loading, error }
}

export function useDeleteConsumable() {
  const [mutation, { loading, error }] = useMutation(DELETE_CONSUMABLE_MUTATION)

  const deleteConsumable = async (id: string) => {
    try {
      const result = await mutation({ variables: { id } })
      return result.data.deleteConsumable
    } catch (err) {
      console.error('Delete consumable error:', err)
      throw err
    }
  }

  return { deleteConsumable, loading, error }
}