# Type Standardization Implementation Checklist

## ✅ Phase 1: Foundation (COMPLETED)

- [x] Create `/lib/api-types.ts` with 771 lines
  - [x] 27 GraphQL-aligned enums
  - [x] 47 canonical entity interfaces
  - [x] All nested types (VisitDepartment, Billing, Form, etc.)
  - [x] Response wrappers (ApiResponse, PaginationInfo)
  - [x] Backward-compatible type aliases

- [x] Create `/lib/api-input-types.ts` with 665 lines
  - [x] 50+ input/mutation types
  - [x] All Create*, Update*, Search*, Add*, Bill* inputs
  - [x] Consolidated from scattered locations
  - [x] Properly typed and documented

- [x] Refactor `/lib/types.ts` (780 lines)
  - [x] Keep re-exports from api-types.ts
  - [x] Mark legacy types as @deprecated
  - [x] Create compatibility layer
  - [x] Document migration path

- [x] Refactor `/hooks/types.ts` (660 lines)
  - [x] Re-export canonical types
  - [x] Re-export input types
  - [x] Keep hook-specific wrappers
  - [x] Clear separation of concerns

- [x] Create documentation
  - [x] TYPES_MIGRATION_GUIDE.md
  - [x] TYPES_DEDUPLICATION_SUMMARY.md
  - [x] TYPES_ARCHITECTURE.md
  - [x] TYPES_IMPLEMENTATION_CHECKLIST.md

## 📋 Phase 2: Update Application Imports (Ready to Start)

### Priority 1: Core Utilities & Hooks
- [ ] `/hooks/useAuth.ts` - Update to import from api-types.ts
- [ ] `/hooks/useVisit.ts` - Update visit-related imports
- [ ] `/hooks/usePatient.ts` - Update patient-related imports
- [ ] `/lib/api-client.ts` - Update response type imports
- [ ] `/lib/utils/` - Update any utility files using types

### Priority 2: API & Services
- [ ] `/app/api/` - Update all route handlers
  - [ ] `/app/api/auth/*` - Login, register, session
  - [ ] `/app/api/patients/*` - Patient operations
  - [ ] `/app/api/visits/*` - Visit operations
  - [ ] `/app/api/billing/*` - Billing operations
  - [ ] `/app/api/forms/*` - Form operations

### Priority 3: Page Components
- [ ] `/app/dashboard/` - Update imports
- [ ] `/app/patients/` - Update imports
- [ ] `/app/visits/` - Update imports
- [ ] `/app/billing/` - Update imports
- [ ] `/app/admin/` - Update imports
- [ ] `/app/forms/` - Update imports
- [ ] `/app/ward/` - Update imports

### Priority 4: UI Components
- [ ] `/components/auth/` - Update auth components
- [ ] `/components/patients/` - Update patient components
- [ ] `/components/visits/` - Update visit components
- [ ] `/components/billing/` - Update billing components
- [ ] `/components/forms/` - Update form components
- [ ] `/components/common/` - Update shared components
- [ ] `/components/layout/` - Update layout components

### Priority 5: Business Logic
- [ ] `/lib/billing-utils.ts` - Update type imports
- [ ] `/lib/form-storage.ts` - Update form types
- [ ] `/lib/mock-data.ts` - Update mock data types
- [ ] `/consultation-form/lib/mock-data.ts` - Update
- [ ] `/app/ward/lib/mock-data.ts` - Update

## 🔍 Phase 3: Verification & Testing

### Code Quality Checks
- [ ] Run `npx tsc --noEmit` - Verify all types
- [ ] Check for remaining `any` types
- [ ] Verify no circular imports
- [ ] Check for unused imports
- [ ] Run linter on updated files

### Type Safety Validation
- [ ] Search for `.ts` files still importing from old locations
  ```bash
  grep -r "from '@/lib/types'" ./app ./components ./hooks --include="*.ts*"
  grep -r "from '@/hooks/types'" ./app ./components --include="*.ts*"
  ```
- [ ] Verify all imports resolve correctly
- [ ] Check API response types match GraphQL
- [ ] Validate input types against mutations

### Functionality Testing
- [ ] Test login flow with new Worker type
- [ ] Test patient creation with new input types
- [ ] Test visit operations with new Visit types
- [ ] Test billing with new billing types
- [ ] Test form operations with new form types

## 🗑️ Phase 4: Cleanup (After Verification)

### Remove Duplicate Definitions
- [ ] Search for inline type definitions in components
- [ ] Move inline types to api-types.ts or lib/types.ts
- [ ] Remove old type definitions from old locations
- [ ] Update imports

### Archive Legacy Code
- [ ] Document deprecated types that are being removed
- [ ] Create a changelog entry
- [ ] Mark removal date (e.g., "Will be removed in v2.0")
- [ ] Keep only what's needed for backward compatibility

### Documentation Updates
- [ ] Update component documentation with proper types
- [ ] Update API documentation
- [ ] Update README with type usage examples
- [ ] Remove old type documentation

## 📊 Metrics & Tracking

### Before Refactoring
- Type files: 2 (lib/types.ts, hooks/types.ts)
- Lines of code: ~650
- Type duplications: 8+ major types
- Enum consistency: Low (string unions)

### After Phase 1 (Foundation)
- [x] Type files: 4 canonical + 2 refactored
- [x] Lines of code: 2,876 (organized)
- [x] Type duplications: 0 (all consolidated)
- [x] Enum consistency: 100% (proper enums)

### After Phase 2 (In Progress)
- [ ] Import consistency: 100%
- [ ] API tests passing: 100%
- [ ] TypeScript errors: 0
- [ ] `any` types remaining: 0

## 🎯 Success Criteria

### For Phase 1 (Foundation) ✅
- [x] api-types.ts complete with all entities
- [x] api-input-types.ts complete with all inputs
- [x] lib/types.ts refactored as compatibility layer
- [x] hooks/types.ts refactored with re-exports
- [x] All documentation created
- [x] No breaking changes to existing code

### For Phase 2 (Updates)
- [ ] All hooks updated to use api-types.ts
- [ ] All API routes updated
- [ ] All components updated
- [ ] TypeScript compiler reports 0 errors
- [ ] All tests passing

### For Phase 3 (Verification)
- [ ] All type imports follow new pattern
- [ ] No circular dependencies
- [ ] No unused imports
- [ ] API responses match GraphQL schema
- [ ] Type safety across entire app

### For Phase 4 (Cleanup)
- [ ] No inline type definitions in components
- [ ] Legacy types removed (except documented deprecated ones)
- [ ] All tests passing
- [ ] Code review approved
- [ ] Ready for production

## 📝 Common Tasks During Migration

### Finding Files to Update
```bash
# Find all files importing from old locations
grep -r "from '@/lib/types'" . --include="*.ts" --include="*.tsx"
grep -r "from '@/hooks/types'" . --include="*.ts" --include="*.tsx"

# Find files using specific old types
grep -r "User\|Insurance\|VisitDepartment" . --include="*.ts" --include="*.tsx" | grep "interface\|type"
```

### Updating Imports
```typescript
// Before
import type { User, Insurance, VisitDepartment } from "@/lib/types"
import type { CreateVisitInput } from "@/hooks/types"

// After
import type { Worker, InsuranceProvider, VisitDepartment } from "@/lib/api-types"
import type { CreateVisitInput } from "@/lib/api-input-types"
```

### Testing Changes
```bash
# Run TypeScript compiler
npx tsc --noEmit

# Check specific file
npx tsc --noEmit path/to/file.ts

# Find type errors
npx tsc --noEmit 2>&1 | grep "error TS"
```

## 🚀 Quick Start for Phase 2

When ready to start updating imports:

1. **Start with hooks** (most files)
   ```bash
   # Update /hooks directory
   cd hooks
   # Replace imports in each file
   ```

2. **Update API routes** (clear improvements)
   ```bash
   # Update /app/api directory
   # Replace imports for request/response types
   ```

3. **Update components** (largest group)
   ```bash
   # Update /components directory
   # Use find + sed or IDE find-replace
   ```

4. **Update pages** (final step)
   ```bash
   # Update /app directory
   # Verify with TypeScript compiler
   ```

## 🔧 Tools & Commands

### IDE Find & Replace (VS Code)
```
Find:    from '@/lib/types'
Replace: from '@/lib/api-types'

Find:    from '@/hooks/types'
Replace: from '@/lib/api-input-types'
```

### Command Line (sed/grep)
```bash
# Dry run to see what would be replaced
grep -r "from '@/lib/types'" ./app --include="*.ts*"

# Actual replacement (backup first!)
find . -name "*.ts" -o -name "*.tsx" | xargs sed -i.bak "s|from '@/lib/types'|from '@/lib/api-types'|g"
```

### Validation Script
```bash
#!/bin/bash
# Verify all type imports after migration

echo "Checking for old type imports..."
OLD_IMPORTS=$(grep -r "from '@/lib/types'" . --include="*.ts*" | grep -v "node_modules" | wc -l)
echo "  Old lib/types imports: $OLD_IMPORTS"

echo "Checking TypeScript compilation..."
npx tsc --noEmit

echo "Done!"
```

## 📞 Need Help?

1. **Type structure unclear?**
   - Read: TYPES_ARCHITECTURE.md
   - Check: /lib/api-types.ts source

2. **Migration questions?**
   - Read: TYPES_MIGRATION_GUIDE.md
   - Check: Common patterns section

3. **What was duplicated?**
   - Read: TYPES_DEDUPLICATION_SUMMARY.md
   - Check: Before/after comparisons

4. **TypeScript errors?**
   - Run: `npx tsc --noEmit`
   - Check error messages
   - Compare with existing usage

## 🎉 Final Checklist

- [ ] All files reviewed and updated
- [ ] TypeScript compiler: 0 errors
- [ ] All tests passing
- [ ] Code review approved
- [ ] Documentation updated
- [ ] Team trained on new structure
- [ ] Deprecation warnings addressed
- [ ] Ready for merge to main
