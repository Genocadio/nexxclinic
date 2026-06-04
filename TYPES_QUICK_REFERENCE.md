# Type System Quick Reference

## 🎯 TL;DR - What Changed

| Aspect | Before | After |
|--------|--------|-------|
| Type Definitions | Scattered in 2 files | Organized in 4 files |
| Duplications | 8+ entity types duplicated | 1 canonical definition each |
| Enums | String unions (15+) | Proper enums (27) |
| Input Types | ~50 scattered definitions | 50+ consolidated |
| GraphQL Alignment | ~60% | 100% |
| IDE Support | Limited | Full autocomplete |

## 📁 Files at a Glance

```typescript
// ⭐ PRIMARY - Use this for new code
import type { Worker, Patient, Visit, Form } from "@/lib/api-types"
import { VisitStatus, RoleName } from "@/lib/api-types"

// Mutations/Input - Use this for API calls
import type { CreateVisitInput, BillVisitInput } from "@/lib/api-input-types"

// Legacy (Still works) - Gradually migrate away
import type { User } from "@/lib/types"  // Now re-exported as Worker

// Hook wrappers (If needed)
import type { LoginResponse } from "@/hooks/types"
```

## 🔑 Key Type Names (Old → New)

| Old Name | New Name | Location |
|----------|----------|----------|
| User | Worker | api-types.ts |
| Insurance | InsuranceProvider | api-types.ts |
| Department | Department | api-types.ts |
| VisitDepartment | VisitDepartment | api-types.ts |
| Form | Form | api-types.ts |
| ClinicProfile | ClinicProfile | api-types.ts |

## 📋 Common Imports

### Entity Types
```typescript
import type {
  Worker,              // Staff member
  Patient,             // Patient record
  Department,          // Department info
  Visit,               // Patient visit
  VisitDepartment,     // Department in visit
  Product,             // Drug/consumable
  InsuranceProvider,   // Insurance company
  Form,                // Consultation form
  ClinicProfile,       // Clinic info
} from "@/lib/api-types"
```

### Enums (for type safety)
```typescript
import {
  VisitStatus,                 // CREATED | IN_PROGRESS | COMPLETED | CANCELLED
  VisitDepartmentStatus,       // ACTIVE | PENDING | ON_HOLD | BILLING | COMPLETED
  RoleName,                    // MANAGER | CLINICIAN | ADMIN | NURSE | FINANCE | ...
  ProductType,                 // DRUG | MEDICAL_ACT | CONSUMABLE_DEVICE | ...
  FormStatus,                  // DRAFT | FINAL
  FieldType,                   // text | email | number | date | textarea | ...
  PaymentMethod,               // CASH | MOMO | BANK_TRANSFER | CARD
} from "@/lib/api-types"
```

### Response Types
```typescript
import type {
  ApiResponse,                 // Standard API response wrapper
  PaginatedResponse,           // For paginated data
  PaginationInfo,              // Pagination metadata
} from "@/lib/api-types"
```

### Input Types
```typescript
import type {
  // Auth
  LoginInput,
  RefreshTokenInput,
  ChangeMyPasswordInput,
  
  // Patient
  CreatePatientInput,
  UpdatePatientInput,
  SearchPatientsInput,
  
  // Visit
  CreateVisitInput,
  CreateVisitDepartmentInput,
  BillVisitInput,
  
  // Form
  FormInput,
  FormFieldInput,
  ConsultationAnswersInput,
} from "@/lib/api-input-types"
```

## ✨ Usage Examples

### Creating with Proper Types
```typescript
import type { CreatePatientInput } from "@/lib/api-input-types"
import { Gender } from "@/lib/api-types"

const newPatient: CreatePatientInput = {
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1990-01-01",
  gender: Gender.MALE,  // ✅ Type-safe enum
  primaryPhoneNumber: "+1234567890",
}

const result = await api.createPatient(newPatient)
```

### Handling API Responses
```typescript
import type { ApiResponse, PaginatedResponse } from "@/lib/api-types"
import { Patient } from "@/lib/api-types"

// Single item
const response: ApiResponse<Patient> = await api.getPatient(id)
if (response.status === ResponseStatus.SUCCESS) {
  console.log(response.data?.firstName)
}

// Paginated list
const pageResponse: PaginatedResponse<Patient> = await api.searchPatients(query)
console.log(pageResponse.pagination?.total)
```

### Using Enums for Safety
```typescript
import { VisitStatus, VisitDepartmentStatus } from "@/lib/api-types"

// ✅ Type-safe comparison
if (visit.status === VisitStatus.IN_PROGRESS) {
  // Do something
}

// ❌ No longer works - caught by TypeScript
if (visit.status === "IN_PROGRESS") {  // Error: wrong string value
  // ...
}
```

### Form Types
```typescript
import type { Form, FormField, FormSection } from "@/lib/api-types"
import { FieldType, FormStatus } from "@/lib/api-types"

const form: Form = {
  id: "form-123",
  departmentId: "dept-456",
  title: "Consultation",
  status: FormStatus.DRAFT,
  sections: [
    {
      id: "sec-1",
      title: "Patient Info",
      columns: 2,
      order: 1,
      fields: [
        {
          id: "field-1",
          label: "Symptoms",
          type: FieldType.textarea,
          required: true,
          order: 1,
          // ... other field properties
        },
      ],
    },
  ],
}
```

## 🚫 Don't Do This Anymore

```typescript
// ❌ WRONG - String comparison (no type safety)
if (visit.status === "IN_PROGRESS") { }

// ✅ RIGHT - Enum comparison
if (visit.status === VisitStatus.IN_PROGRESS) { }

// ❌ WRONG - Using old User type
const user: User = { ... }

// ✅ RIGHT - Using new Worker type
const worker: Worker = { ... }

// ❌ WRONG - Inline type definitions
type MyVisit = { id: string; status: string }

// ✅ RIGHT - Use canonical types
import type { Visit } from "@/lib/api-types"

// ❌ WRONG - Untyped API calls
const result = await api.createVisit(data as any)

// ✅ RIGHT - Properly typed
const result: ApiResponse<Visit> = await api.createVisit(visitInput)
```

## 🔍 Finding the Right Type

**"I need a type for..."**

- **A clinic staff member** → `Worker`
- **A patient record** → `Patient`
- **Department information** → `Department`
- **A patient's visit** → `Visit`
- **Services in a visit** → `VisitDepartment`
- **Billing information** → `VisitBilling` or `VisitDepartmentBilling`
- **A form** → `Form` or `FormVersion`
- **An insurance company** → `InsuranceProvider`
- **A medication/drug** → `Product`
- **Vital signs** → `VisitVitalSignsGroup` & `VitalMeasurement`

**"I need an input type for..."**

- **Creating a patient** → `CreatePatientInput`
- **Updating a patient** → `UpdatePatientInput`
- **Searching patients** → `SearchPatientsInput`
- **Creating a visit** → `CreateVisitInput`
- **Adding department to visit** → `CreateVisitDepartmentInput`
- **Billing a visit** → `BillVisitInput`
- **Logging in** → `LoginInput`
- **Creating a form** → `FormInput`
- **Submitting form answers** → `ConsultationAnswersInput`

**"I need to compare..."**

- **Visit status** → `VisitStatus` enum
- **Department status** → `VisitDepartmentStatus` enum
- **Form status** → `FormStatus` enum
- **Product type** → `ProductType` enum
- **Field type** → `FieldType` enum
- **User role** → `RoleName` enum
- **Payment method** → `PaymentMethod` enum

## 📚 Documentation Map

| Need | File |
|------|------|
| How to migrate imports | `TYPES_MIGRATION_GUIDE.md` |
| What was eliminated | `TYPES_DEDUPLICATION_SUMMARY.md` |
| How types are organized | `TYPES_ARCHITECTURE.md` |
| What to update next | `TYPES_IMPLEMENTATION_CHECKLIST.md` |
| Project completion status | `TYPES_COMPLETION_SUMMARY.md` |
| This quick reference | `TYPES_QUICK_REFERENCE.md` |

## 🛠️ Useful Commands

```bash
# Check for old imports
grep -r "from '@/lib/types'" . --include="*.ts*"
grep -r "from '@/hooks/types'" . --include="*.ts*"

# Verify TypeScript compilation
npx tsc --noEmit

# Find files using specific types
grep -r "User\b" . --include="*.ts*" | grep "interface\|type"

# Replace imports (dry run)
grep -r "from '@/lib/types'" . --include="*.ts*" | head -5

# Replace imports (actual)
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i "s|from '@/lib/types'|from '@/lib/api-types'|g"
```

## ⚡ Quick Migration Checklist

- [ ] Read this quick reference
- [ ] Check `TYPES_MIGRATION_GUIDE.md`
- [ ] Update imports from `@/lib/types` → `@/lib/api-types`
- [ ] Update imports from `@/hooks/types` → check what to use
- [ ] Replace string comparisons with enum comparisons
- [ ] Run `npx tsc --noEmit`
- [ ] Test affected components
- [ ] Verify no TypeScript errors

## 🎯 Success Indicators

✅ **You're using the new system correctly when:**
- TypeScript compiler reports 0 errors
- IDE shows autocomplete for type properties
- You use enums instead of string comparisons
- Components have full type safety
- No `any` types in your code
- Imports come from `api-types.ts` or `api-input-types.ts`

❌ **Watch out for:**
- Old imports from `@/lib/types` (except legacy)
- String-based enum comparisons
- `any` types
- TypeScript errors about missing properties
- Circular imports
- Duplicate type definitions

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| "Type X not found" | Check `api-types.ts` for correct name |
| "Expected Y but got Z" | Use the enum from `api-types.ts` |
| "Unknown property" | Check the interface definition in `api-types.ts` |
| "String not valid enum" | Use enum value: `Status.ACTIVE` not `"ACTIVE"` |
| "Module not found" | Verify import path: `@/lib/api-types` or `@/lib/api-input-types` |

---

**Created:** June 4, 2026  
**Purpose:** Quick reference for new type system  
**Status:** ✅ Complete and ready to use
