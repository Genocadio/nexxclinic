/**
 * hooks/types.ts - Hook-specific re-exports only
 * All entity types MUST come from lib/api-types.ts (canonical source)
 * All input types MUST come from lib/api-input-types.ts (canonical source)
 * This file only contains hook-specific wrappers for API responses
 */

import type {
  ApiResponse as ApiResponseBase,
  Worker,
  ClinicProfile,
} from "@/lib/api-types"

// ============================================
// RE-EXPORTS FROM CANONICAL TYPES
// ============================================

// Re-export ALL entity types from canonical source
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
  // Entity Types - CANONICAL SOURCE
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
  // Input Types - CANONICAL SOURCE
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
} from "@/lib/api-types"

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
} from "@/lib/api-input-types"

// ============================================
// HOOK-SPECIFIC RESPONSE WRAPPERS (ONLY)
// ============================================

/**
 * Hook response wrapper for API responses
 * Maintains backward compatibility with existing hook code
 */
export interface ApiResponse<T> extends ApiResponseBase<T> {
  status: string
  message?: string
  data?: T
  messages?: {
    text: string
    type: string
  }[]
}

/**
 * Login response wrapper - hook specific
 * Used by authentication hooks
 */
export interface LoginResponse {
  status: string
  message?: string
  data?: {
    token?: string
    accessToken?: string
    refreshToken?: string
    user?: Worker
    clinicProfile?: ClinicProfile | null
    needsPasswordSetup?: boolean
  }
  messages?: {
    text: string
    type: string
  }[]
}

/**
 * Invoice response wrapper - hook specific
 */
export interface InvoiceResponse {
  status: string
  message?: string
  data?: {
    invoiceUrl?: string
  }
}
