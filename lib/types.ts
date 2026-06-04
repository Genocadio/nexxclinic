/**
 * lib/types.ts - Re-export canonical types only
 * SINGLE SOURCE OF TRUTH: lib/api-types.ts
 * This file only re-exports for backward compatibility
 * 
 * All entity types, input types, and enums come from:
 * - lib/api-types.ts (canonical entity & enum definitions)
 * - lib/api-input-types.ts (canonical input definitions)
 * - Aligned 100% with user.graphqls schema
 */

// ============================================
// RE-EXPORT ALL CANONICAL TYPES
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
  // Entity Types
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

// Re-export all input types
export type {
  WorkerDocumentInput,
  SelfRegisterInput,
  AdminCreateUserInput,
  AdminUpdateUserInput,
  ActivateUserInput,
  DeactivateUserInput,
  LoginInput,
  SetInitialPasswordInput,
  RefreshSessionInput,
  RefreshTokenInput,
  LogoutInput,
  UpdateMyProfileInput,
  ChangeMyPasswordInput,
  AdminTriggerPasswordResetInput,
  AdminSetUserSessionLimitInput,
  CreateInsuranceProviderInput,
  UpdateInsuranceProviderInput,
  SearchInsuranceProvidersInput,
  CreatePatientInput,
  UpdatePatientInput,
  SearchPatientsInput,
  CreatePatientInsuranceInput,
  UpdatePatientInsuranceInput,
  CreateProductInsuranceCoverageInput,
  UpdateProductInsuranceCoverageInput,
  CreateProductInput,
  UpdateProductInput,
  SearchProductsInput,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  SearchDepartmentsInput,
  CreateVisitInput,
  ChangeVisitDateInput,
  CreateVisitDepartmentInput,
  CreateVisitDepartmentProductItemInput,
  CreateVisitDepartmentProductInput,
  AddChildVisitDepartmentProductInput,
  AddChildVisitDepartmentInput,
  UpdateVisitDepartmentProductStatusInput,
  UpdateVisitDepartmentStatusInput,
  UpdateVisitDepartmentProductQuantityInput,
  SearchVisitsInput,
  SearchPatientHistoryInput,
  BillingPaymentInput,
  BillVisitDepartmentProductInput,
  BillVisitDepartmentInput,
  BillVisitInput,
  RecordVisitBillingPaymentInput,
  AddVisitVitalSignItemInput,
  AddVisitVitalSignsInput,
  AddVisitPreInstructionMedicationInput,
  AddVisitPreInstructionProductInput,
  AddVisitPreInstructionItemInput,
  AddVisitPreInstructionsInput,
  AddDiagnosisInput,
  AddMedicationInput,
  ConditionalRenderingInput,
  TableConfigInput,
  LabRecordRowInput,
  LabRecordConfigInput,
  FormFieldInput,
  FormSectionInput,
  FormActionInput,
  FormInput,
  ConsultationAnswersInput,
  KeyValueInput,
  ClinicContactInput,
  ClinicMetadataInput,
  UpdateClinicProfileInput,
} from "./api-input-types"

// ============================================
// UTILITY RESPONSE TYPE ALIASES
// ============================================

import type { ApiResponse, Worker, Patient, Department, InsuranceProvider, Visit, Form, PageInfo } from "./api-types"

export type UserListResponse = ApiResponse<Worker[]>
export type UserResponse = ApiResponse<Worker>
export type AuthResponse = ApiResponse<{ user: Worker; accessToken: string; refreshToken: string }>
export type PatientResponse = ApiResponse<Patient>
export type DepartmentResponse = ApiResponse<Department>
export type DepartmentListResponse = ApiResponse<Department[]>
export type InsuranceResponse = ApiResponse<InsuranceProvider>
export type InsuranceListResponse = ApiResponse<InsuranceProvider[]>
export type VisitResponse = ApiResponse<Visit>
export type VisitListResponse = ApiResponse<Visit[]>
export type FormResponse = ApiResponse<Form>
export type MessageResponse = ApiResponse<null>

// Legacy pagination wrapper - use PaginationInfo from api-types for new code
export interface PageInfo<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}
