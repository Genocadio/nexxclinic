# Type Standardization & Migration Guide

## Overview

This project has been refactored to use a single, canonical source of truth for all TypeScript types aligned with the GraphQL schema. This eliminates type duplication and ensures consistency across the entire application.

## New Type Structure

### Three Main Type Files

1. **`/lib/api-types.ts`** - ⭐ PRIMARY (Single Source of Truth)
   - All canonical entity types (Worker, Patient, Department, Visit, Form, etc.)
   - All GraphQL-aligned enums
   - Response interfaces (ApiResponse, PaginationInfo, etc.)
   - **USE THIS FOR ALL NEW CODE**

2. **`/lib/api-input-types.ts`** - Mutation/Input Types
   - All input types for API mutations
   - Includes: Create*, Update*, Search*, Add*, Bill* input types
   - Import from here when passing data to mutations

3. **`/lib/types.ts`** - Legacy Compatibility Layer
   - Re-exports canonical types for backward compatibility
   - Contains deprecated types with `@deprecated` comments
   - Will be gradually phased out
   - **ONLY USE FOR LEGACY CODE MAINTENANCE**

4. **`/hooks/types.ts`** - Hook Response Wrappers
   - Re-exports canonical types
   - Hook-specific response wrappers (LoginResponse, etc.)
   - Re-exports input types for hook consumers

## Migration Path

### For NEW Code
```typescript
// ✅ DO THIS - Import from canonical source
import type { 
  Worker, 
  Patient, 
  Department,
  Visit,
  VisitDepartment,
  ApiResponse,
} from "@/lib/api-types"

import type {
  CreatePatientInput,
  CreateVisitInput,
} from "@/lib/api-input-types"
```

### For EXISTING Code (Still Works)
```typescript
// ✅ STILL WORKS - But imported from compatibility layer
import type { Worker, Patient } from "@/lib/types"
import type { Worker, Patient } from "@/hooks/types"
```

### Deprecation Timeline
- **Now**: All canonical types are available
- **Next Phase**: Gradually update imports across the codebase
- **Future**: Legacy imports may be removed

## Type Mapping Reference

### Entity Types (All in `/lib/api-types.ts`)

| Old Name | New Name | Status |
|----------|----------|--------|
| `User` | `Worker` | ✅ New canonical name |
| `Insurance` | `InsuranceProvider` | ✅ New canonical name |
| `VisitDepartment` | `VisitDepartment` | ✅ Unified definition |
| `Form` | `Form` | ✅ Unified definition |
| `ClinicProfile` | `ClinicProfile` | ✅ Standardized |
| `Patient` | `Patient` | ✅ Standardized |

### Response Types

```typescript
// Old way (deprecated)
type ApiResponse<T> = { status: Status; data?: T; messages?: Message[] }

// New way (canonical)
import type { ApiResponse, PaginationInfo } from "@/lib/api-types"

// For paginated responses
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: PaginationInfo
}
```

### Enum Migration

```typescript
// Old way - String union types
type VisitStatus = "CREATED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

// New way - Proper enums (aligned with GraphQL)
enum VisitStatus {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

import { VisitStatus } from "@/lib/api-types"
```

## Key Improvements

### ✅ Benefits

1. **Single Source of Truth**
   - GraphQL schema → TypeScript types → UI components
   - No more conflicting definitions

2. **Eliminated Type Duplication**
   - `VisitDepartment` no longer defined in 3+ places
   - `Department` now has unified structure
   - Product/Consumable distinction removed

3. **Better IDE Support**
   - Proper enums with autocomplete
   - Consistent field naming across types
   - Better error messages

4. **Easier Maintenance**
   - Update GraphQL? Update api-types.ts once
   - Add new field? Update one place
   - All components automatically get the change

5. **Backward Compatibility**
   - Old imports still work
   - Deprecation warnings guide migration
   - No breaking changes required immediately

## Common Patterns

### Using Worker Type (Replaces User)
```typescript
import type { Worker, RoleName } from "@/lib/api-types"

const worker: Worker = {
  id: "123",
  firstName: "John",
  lastName: "Doe",
  roles: [RoleName.CLINICIAN],
  accountStatus: AccountStatus.ACTIVE,
  departments: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}
```

### Creating Visit with Typed Departments
```typescript
import type { CreateVisitInput, CreateVisitDepartmentInput } from "@/lib/api-input-types"
import { EncounterType } from "@/lib/api-types"

const visitInput: CreateVisitInput = {
  patientId: "pat-123",
  departments: [
    {
      departmentId: "dept-1",
      encounterType: EncounterType.OUTPATIENT,
      products: [],
    } as CreateVisitDepartmentInput,
  ],
}
```

### Handling API Responses
```typescript
import type { ApiResponse, PaginatedResponse } from "@/lib/api-types"
import { ResponseStatus } from "@/lib/api-types"

// Single item response
const response: ApiResponse<Patient> = {
  status: ResponseStatus.SUCCESS,
  data: patient,
  message: "Patient retrieved",
}

// Paginated response
const pageResponse: PaginatedResponse<Patient> = {
  status: ResponseStatus.SUCCESS,
  data: patients,
  pagination: {
    total: 100,
    perPage: 10,
    currentPage: 1,
    totalPages: 10,
  },
}
```

## Removed Type Duplication Examples

### Before (Duplicated)
```typescript
// In lib/types.ts
export interface VisitDepartment {
  id: string
  department: Department
  status: DepartmentStatus
  // ... 10 more fields
}

// In hooks/types.ts
export interface VisitDepartment {
  id: string
  department: Department
  status: string // Different!
  // ... different structure
}
```

### After (Single Source)
```typescript
// In lib/api-types.ts - ONLY PLACE IT'S DEFINED
export interface VisitDepartment {
  id: string
  department: Department
  status: VisitDepartmentStatus // Proper enum
  encounterType: EncounterType
  completedAt?: string | null
  processors: Worker[]
  childVisitDepartments: VisitDepartment[]
  products: VisitDepartmentProduct[]
  diagnostics?: VisitDepartmentDiagnosis[] | null
  medications?: VisitDepartmentMedication[] | null
  preInstructions: VisitPreInstruction[]
  createdAt: string
  updatedAt: string
}

// Imported everywhere from single source
import type { VisitDepartment } from "@/lib/api-types"
```

## Updating Your Components

### Step 1: Update Import Statements
```typescript
// Before
import type { Worker, Department, VisitDepartment } from "@/lib/types"
import type { CreateVisitInput } from "@/hooks/types"

// After
import type { 
  Worker, 
  Department, 
  VisitDepartment,
  CreateVisitInput,
} from "@/lib/api-types"
import type { CreateVisitInput } from "@/lib/api-input-types"
```

### Step 2: Use Proper Enums
```typescript
// Before
const status: string = "ACTIVE"

// After
import { VisitDepartmentStatus } from "@/lib/api-types"

const status: VisitDepartmentStatus = VisitDepartmentStatus.ACTIVE
```

### Step 3: Leverage Type Safety
```typescript
// Now TypeScript will catch errors
import type { Worker } from "@/lib/api-types"

const worker: Worker = {
  // TypeScript will require ALL required fields
  // and warn about unknown fields
}
```

## FAQ

**Q: Can I still use my old imports?**  
A: Yes! They're re-exported from the compatibility layer, but they'll show deprecation warnings over time.

**Q: Do I need to update all my code at once?**  
A: No. The system is fully backward compatible. Update as you touch files.

**Q: What if I'm using the wrong type?**  
A: TypeScript will catch it. The type system now provides better error messages.

**Q: Where should new types go?**  
A: Ask yourself:
- Is it a GraphQL entity? → `api-types.ts`
- Is it an input/mutation type? → `api-input-types.ts`
- Is it hook-specific? → `hooks/types.ts`
- Is it a legacy compatibility wrapper? → `lib/types.ts`

## Next Steps

1. **Review this guide** - Understand the new structure
2. **Use new imports** - When creating new files/components
3. **Update existing code** - As you modify components
4. **Remove deprecations** - Address TypeScript warnings
5. **Verify types** - Run `tsc --noEmit` to check all types

## Support

If you encounter type issues or have questions:
1. Check this guide
2. Review the type definitions in `/lib/api-types.ts`
3. Look at the GraphQL schema for the source of truth
4. Ask teammates for context on legacy types
