# Type System Architecture

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    GraphQL Schema                               │
│          (user.graphqls, visits.graphqls, forms.graphqls)       │
│           ⬇️  [SOURCE OF TRUTH]  ⬇️                             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                  TypeScript Type System (NEW)                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ⭐ /lib/api-types.ts                                                   │
│     └─ Canonical Entity Types (SINGLE SOURCE OF TRUTH)                 │
│        ├─ 27 Enums (RoleName, VisitStatus, ProductType, etc.)          │
│        ├─ Core Entities (Worker, Patient, Department, etc.)            │
│        ├─ Visit Types (Visit, VisitDepartment, VitalSigns, etc.)       │
│        ├─ Billing Types (VisitBilling, Payment, etc.)                  │
│        ├─ Form Types (Form, FormField, FormSection, etc.)              │
│        ├─ Response Wrappers (ApiResponse, PaginationInfo, etc.)        │
│        └─ Backward Compat Aliases (User→Worker, Insurance→Provider)    │
│                                                                          │
│  /lib/api-input-types.ts                                               │
│     └─ Mutation/Input Types                                            │
│        ├─ Worker Inputs (SelfRegister, AdminCreate, etc.)              │
│        ├─ Auth Inputs (Login, RefreshToken, ChangePassword, etc.)      │
│        ├─ Patient Inputs (CreatePatient, UpdatePatient, etc.)          │
│        ├─ Insurance Inputs (CreateProvider, UpdateProvider, etc.)      │
│        ├─ Product Inputs (CreateProduct, UpdateProduct, etc.)          │
│        ├─ Visit Inputs (CreateVisit, AddDepartment, etc.)              │
│        ├─ Billing Inputs (BillVisit, RecordPayment, etc.)              │
│        ├─ Form Inputs (FormField, FormSection, etc.)                   │
│        └─ Clinic Inputs (UpdateClinicProfile, etc.)                    │
│                                                                          │
│  /lib/types.ts (REFACTORED)                                            │
│     └─ Legacy Compatibility Layer                                      │
│        ├─ Re-exports from api-types.ts                                 │
│        ├─ @deprecated Type Aliases                                    │
│        ├─ Legacy Utility Types (for gradual migration)                 │
│        └─ PageInfo, Filter Inputs, etc. (not in GraphQL)               │
│                                                                          │
│  /hooks/types.ts (REFACTORED)                                          │
│     └─ Hook Response Wrappers                                          │
│        ├─ Re-exports from api-types.ts & api-input-types.ts            │
│        ├─ LoginResponse (hook-specific wrapper)                        │
│        ├─ UserResponse, UserListResponse (hook wrappers)               │
│        └─ Hook-specific Message types                                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                    Application Code                                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Components, Pages, Hooks, Utils                                        │
│       ⬇️  import from                                                   │
│     /lib/api-types & /lib/api-input-types                               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Type Hierarchy & Organization

### By Category

```typescript
// ============================================================
// ENUMS (27 total) - GraphQL Scalar Values
// ============================================================
ResponseStatus     ├─ SUCCESS | ERROR | UNAUTHENTICATED | ...
RoleName           ├─ MANAGER | CLINICIAN | ADMIN | NURSE | ...
AccountStatus      ├─ PENDING | ACTIVE | DISABLED
Gender             ├─ MALE | FEMALE | OTHER
DocumentType       ├─ LICENSE | PASSPORT | DEGREE_CERTIFICATE | ...
ProductType        ├─ DRUG | MEDICAL_ACT | CONSUMABLE_DEVICE | ...
ProductUnit        ├─ TABLET | CAPSULE | BOTTLE | ... (36 units!)
VisitStatus        ├─ CREATED | IN_PROGRESS | COMPLETED | CANCELLED
VisitProductStatus ├─ BILLED | EXEMPTED | UNPAID | PENDING
VisitDepartmentStatus ├─ ACTIVE | PENDING | ON_HOLD | BILLING | COMPLETED
EncounterType      ├─ OUTPATIENT | INPATIENT_OBSERVATION | INPATIENT_ADMISSION
VisitBillingStatus ├─ UNPAID | PARTIALLY_PAID | PAID
FieldType          ├─ text | email | number | date | textarea | ... (17 types!)
TableMode          ├─ STATIC | DYNAMIC
ConditionalCondition ├─ equals | not_equals | greater_than | ...
AnswerStatus       ├─ DRAFT | FINAL
FormStatus         ├─ DRAFT | FINAL
PaymentMethod      ├─ CASH | MOMO | BANK_TRANSFER | CARD
// + 9 more enums

// ============================================================
// CORE ENTITY TYPES
// ============================================================

// USER/WORKER DOMAIN
Worker             // replaces "User" - represents clinic staff
  ├─ id, firstName, lastName, email, phoneNumber, username
  ├─ accountStatus: AccountStatus
  ├─ roles: RoleName[]
  ├─ departments: Department[]
  └─ createdAt, updatedAt

// PATIENT DOMAIN
Patient            // represents clinic patient
  ├─ id, firstName, middleName, lastName
  ├─ dateOfBirth: string
  ├─ gender: Gender
  ├─ contact information fields
  ├─ patientInsurances: PatientInsurance[]
  ├─ lastVisit: Visit | null
  └─ createdAt, updatedAt

PatientInsurance   // links patient to insurance provider
  ├─ id, insuranceCardNumber
  ├─ patient: Patient
  ├─ insuranceProvider: InsuranceProvider
  ├─ principalMember info
  ├─ validFrom, validUntil
  └─ createdAt, updatedAt

// ORGANIZATION DOMAIN
Department         // clinic department (Pediatrics, Maternity, etc.)
  ├─ id, name
  ├─ insurancePolicyMode: DepartmentInsurancePolicyMode
  ├─ insurancePolicies: InsuranceProvider[]
  ├─ defaultProducts: Product[]
  ├─ nursing, supportRequests, requestsProducts
  └─ createdAt, updatedAt

InsuranceProvider  // health insurance company
  ├─ id, insuranceName, acronym
  ├─ defaultCoveragePercentage, supportedByClinic
  ├─ iconUrl
  └─ createdAt, updatedAt

ClinicProfile      // clinic information
  ├─ id, name, username, address
  ├─ contacts: ClinicContact[]
  ├─ tinNumber, logoUrl
  ├─ metadata: ClinicMetadata[]
  └─ createdAt, updatedAt

// PRODUCT DOMAIN
Product            // drugs, medical acts, consumables
  ├─ id, name, genericName, code
  ├─ description, type: ProductType, unit: ProductUnit
  ├─ privateRhicPrice, clinicPrice
  ├─ insuranceCoverages: ProductInsuranceCoverage[]
  └─ createdAt, updatedAt

ProductInsuranceCoverage // insurance coverage for a product
  ├─ id
  ├─ insuranceProvider: InsuranceProvider
  ├─ cost, covered, requireMedicalAdvisor
  ├─ mustPrescribedBy, drugAdministrationFrequency
  ├─ authorizationRequestReasons: string[]
  └─ createdAt, updatedAt

// ============================================================
// VISIT DOMAIN (Most Complex)
// ============================================================

Visit              // patient encounter
  ├─ id
  ├─ patient: Patient
  ├─ status: VisitStatus
  ├─ visitDate: string
  ├─ linkedInsurances: PatientInsurance[]
  ├─ departments: VisitDepartment[]
  └─ vitalSigns: VisitVitalSignsGroup[]

VisitDepartment    // department services during visit
  ├─ id, department: Department
  ├─ status: VisitDepartmentStatus
  ├─ encounterType: EncounterType
  ├─ processors: Worker[]
  ├─ completedAt: string | null
  ├─ childVisitDepartments: VisitDepartment[]
  ├─ products: VisitDepartmentProduct[]
  ├─ diagnostics: VisitDepartmentDiagnosis[] | null
  ├─ medications: VisitDepartmentMedication[] | null
  ├─ preInstructions: VisitPreInstruction[]
  └─ createdAt, updatedAt

VisitDepartmentProduct // product billed in visit
  ├─ id, product: Product
  ├─ quantity, price
  ├─ status: VisitProductStatus
  ├─ addedBy, billedBy, processor: Worker | null
  └─ createdAt, updatedAt

VisitDepartmentDiagnosis // diagnosis recorded
  ├─ id, diagnosisName, icd11Code | null
  └─ createdAt

VisitDepartmentMedication // medication prescribed
  ├─ id, medicationName, instructions
  └─ createdAt

VisitVitalSignsGroup // vital signs at point in time
  ├─ id, addedBy: Worker | null
  ├─ measurements: VitalMeasurement[]
  └─ createdAt

VitalMeasurement   // individual vital sign
  ├─ id, measurementName, value, unit
  └─ createdAt

VisitPreInstruction // pre-discharge instructions
  ├─ id, type, note | null, addedBy: Worker | null
  ├─ medications: VisitPreInstructionMedication[]
  ├─ products: VisitPreInstructionProduct[]
  └─ createdAt

VisitPreInstructionMedication
  ├─ id, medName, dosage, route, frequency, duration, quantity
  ├─ otherInstructions
  └─ createdAt

VisitPreInstructionProduct
  ├─ id, product: Product | null, quantity | null
  ├─ requestedBy, processedBy: Worker | null
  ├─ status: VisitPreInstructionProductStatus
  └─ createdAt, updatedAt

// ============================================================
// BILLING DOMAIN
// ============================================================

VisitBilling       // billing for entire visit
  ├─ id, visitId
  ├─ departments: VisitDepartmentBilling[]
  └─ createdAt, updatedAt

VisitDepartmentBilling // billing for department in visit
  ├─ id, visitDepartment: VisitDepartment
  ├─ status: VisitBillingStatus
  ├─ totalAmount, insuranceCoveredAmount, patientPayableAmount
  ├─ paidAmount, outstandingAmount
  ├─ payments: VisitBillingPayment[]
  ├─ insuranceBillings: DepartmentInsuranceBilling[]
  └─ createdAt, updatedAt

DepartmentInsuranceBilling // insurance-specific billing
  ├─ id, patientInsurance: PatientInsurance | null
  ├─ status: VisitBillingStatus
  ├─ totalAmount, insuranceCoveredAmount, patientPayableAmount
  ├─ paidAmount, outstandingAmount
  ├─ invoiceUrl | null
  ├─ items: VisitBillingItem[]
  └─ createdAt, updatedAt

VisitBillingItem   // individual billing item
  ├─ id, visitDepartmentProductId, productId, productName
  ├─ unitPriceSnapshot, quantitySnapshot
  ├─ insuranceCoveredAmount, patientPayableAmount
  └─ createdAt, updatedAt

VisitBillingPayment // payment record
  ├─ id, amount, paymentMethod: PaymentMethod
  ├─ reference | null
  └─ createdAt, updatedAt

// ============================================================
// FORM DOMAIN
// ============================================================

Form               // consultation form
  ├─ id, departmentId, title, description | null
  ├─ status: FormStatus, version: string
  ├─ sections: FormSection[] | null
  ├─ fields: FormField[] | null
  ├─ actions: FormAction[] | null
  └─ createdAt, updatedAt

FormVersion        // versioned form
  ├─ (same as Form, with formId and versionId)

FormSection        // section in form
  ├─ id, title, columns, order
  ├─ formatting flags: boldTitle, italicTitle, underlineTitle, centerTitle
  ├─ fields: FormField[] | null

FormField          // input field in form
  ├─ id, label, type: FieldType, placeholder | null
  ├─ required, order, hideLabel
  ├─ formatting flags: boldLabel, italicLabel, etc.
  ├─ options: string[] | null
  ├─ tableConfig: TableConfig | null
  └─ conditionalRendering: ConditionalRendering | null

TableConfig        // configuration for table fields
  ├─ mode: TableMode
  ├─ rows, columns, headerPlacement
  ├─ columnHeaders: string[] | null
  └─ rowHeaders: string[] | null

ConditionalRendering // conditional display logic
  ├─ dependsOn: string (field ID)
  ├─ condition: ConditionalCondition
  ├─ value | null
  └─ itemType | null

FormAction         // action/product in form
  ├─ id, name, type, quantity, price
  ├─ isQuantifiable
  └─ backendId | null

ConsultationAnswer // submitted form answers
  ├─ id, consultationId, visitId, patientId, departmentId
  ├─ status: AnswerStatus | null
  ├─ answers: string | null
  ├─ submittedAt, updatedAt
  └─ dedicatedForm: Form

// ============================================================
// RESPONSE TYPES
// ============================================================

ApiResponse<T>     // standard API response
  ├─ status: ResponseStatus | string
  ├─ message | null
  ├─ data?: T
  └─ (can also have messages array for backward compat)

PaginatedResponse<T> // paginated API response
  ├─ extends ApiResponse<T[]>
  └─ pagination: PaginationInfo

PaginationInfo     // pagination metadata
  ├─ total: number
  ├─ perPage: number
  ├─ currentPage: number
  └─ totalPages: number

// ============================================================
// INPUT/MUTATION TYPES (50+ in /lib/api-input-types.ts)
// ============================================================

// Naming convention: [Verb][Entity]Input
//   CREATE - SelfRegisterInput, AdminCreateUserInput
//   UPDATE - AdminUpdateUserInput, UpdateMyProfileInput
//   LOGIN  - LoginInput, RefreshTokenInput
//   SEARCH - SearchPatientsInput, SearchProductsInput
//   ADD    - AddChildVisitDepartmentInput, AddDiagnosisInput
//   BILL   - BillVisitInput, BillVisitDepartmentInput
//   CHANGE - ChangeVisitDateInput, ChangeMyPasswordInput
//   (See /lib/api-input-types.ts for complete list)
```

## Import Patterns

### Pattern 1: Entity Types
```typescript
// New code (recommended)
import type {
  Worker,
  Patient,
  Department,
  Visit,
  VisitDepartment,
  Product,
  InsuranceProvider,
} from "@/lib/api-types"

// For enums
import {
  VisitStatus,
  RoleName,
  VisitDepartmentStatus,
  EncounterType,
} from "@/lib/api-types"
```

### Pattern 2: Input Types
```typescript
import type {
  CreatePatientInput,
  CreateVisitInput,
  CreateVisitDepartmentInput,
  BillVisitInput,
} from "@/lib/api-input-types"
```

### Pattern 3: Response Wrappers
```typescript
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationInfo,
} from "@/lib/api-types"

const response: ApiResponse<Patient> = { ... }
const pageResponse: PaginatedResponse<Patient> = { ... }
```

### Pattern 4: Hook Responses (Legacy)
```typescript
import type {
  LoginResponse,
  UserResponse,
  UserListResponse,
} from "@/hooks/types"
```

### Pattern 5: Backward Compatibility (Do NOT use for new code)
```typescript
// ❌ OLD - Still works but deprecated
import type { User, Insurance } from "@/lib/types"

// ✅ NEW - Use these instead
import type { Worker, InsuranceProvider } from "@/lib/api-types"
```

## File Size Comparison

### Before (Scattered)
```
lib/types.ts       ~500 lines (mixed legacy + current)
hooks/types.ts     ~150 lines (incomplete + duplicate)
Total              ~650 lines (with duplicates & gaps)
```

### After (Organized)
```
lib/api-types.ts          771 lines (canonical, comprehensive)
lib/api-input-types.ts    665 lines (all inputs in one place)
lib/types.ts (refactored) 780 lines (legacy + re-exports)
hooks/types.ts (refactored) 660 lines (wrappers + re-exports)
Total                    2,876 lines (organized, aligned with GraphQL)
```

## Type Safety Improvements

### Before
```typescript
// ❌ Typos not caught
const status: string = "VIIST_STATUS_IN_PROGRESS"

// ❌ Unknown fields not caught
const worker: any = {
  firstName: "John",
  unknown_field: "value",  // No error!
}

// ❌ Missing required fields not enforced
const dept: Department = {
  id: "123",
  // Missing: name, insurancePolicyMode, etc.
}
```

### After
```typescript
// ✅ Enum validation
const status: VisitStatus = VisitStatus.IN_PROGRESS
// TypeScript error: "VIIST_STATUS_IN_PROGRESS" not assignable

// ✅ Type safety
const worker: Worker = {
  id: "123",
  firstName: "John",
  // TypeScript error: missing required fields!
  // lastName, accountStatus, roles, departments, createdAt, updatedAt
}

// ✅ Field validation
const dept: Department = {
  id: "123",
  name: "Pediatrics",
  // TypeScript error: missing required fields!
  // insurancePolicyMode, insurancePolicies, defaultProducts, ...
}
```

## GraphQL ↔ TypeScript Alignment

Every GraphQL type has a corresponding TypeScript interface:

```
GraphQL Type              → TypeScript Type
─────────────────────────────────────────
type Worker              → interface Worker
type Patient             → interface Patient
type Department          → interface Department
type Visit               → interface Visit
type VisitDepartment     → interface VisitDepartment
type Form                → interface Form
type ClinicProfile       → interface ClinicProfile
...and 40+ more entities

enum VisitStatus         → enum VisitStatus
enum RoleName            → enum RoleName
...and 25+ more enums

input CreatePatientInput → interface CreatePatientInput
input BillVisitInput     → interface BillVisitInput
...and 50+ more inputs

type ApiResponse         → interface ApiResponse<T>
```

## Migration Strategy

### Phase 1: Foundation (DONE ✓)
- ✅ Create api-types.ts with canonical entities
- ✅ Create api-input-types.ts with all inputs
- ✅ Refactor lib/types.ts as compatibility layer
- ✅ Refactor hooks/types.ts to re-export
- ✅ Create migration documentation

### Phase 2: Gradual Migration (Next)
- Update imports in hooks and utilities
- Update imports in components
- Update imports in pages
- Run TypeScript compiler to catch issues

### Phase 3: Cleanup (After)
- Remove old inline type definitions
- Delete deprecated types from lib/types.ts
- Update any remaining legacy imports
- Verify type safety across board

## Best Practices

1. **Always import from canonical sources**
   ```typescript
   // ✅ Good
   import type { Worker, Patient, Visit } from "@/lib/api-types"
   
   // ❌ Avoid
   import type { User } from "@/lib/types"
   ```

2. **Use enums for comparison**
   ```typescript
   // ✅ Good
   if (visit.status === VisitStatus.COMPLETED) { ... }
   
   // ❌ Avoid
   if (visit.status === "COMPLETED") { ... }
   ```

3. **Use input types for mutations**
   ```typescript
   // ✅ Good
   const input: CreateVisitInput = { ... }
   await api.createVisit(input)
   
   // ❌ Avoid
   const input: any = { ... }
   ```

4. **Leverage IDE autocomplete**
   - Type hints provide field suggestions
   - Hover over fields to see documentation
   - Catch typos before runtime

## Validation

Run this to verify all types are working:
```bash
npx tsc --noEmit
```

This will:
- Check all TypeScript files
- Verify all imports
- Validate type assignments
- Catch any type errors
