/**
 * MIGRATION GUIDE: Using the Response Handler Utility
 * 
 * Before: Ad-hoc error handling, hardcoded messages
 * After: Standardized, consistent error/success handling with actual backend messages
 */

// ============================================================================
// EXAMPLE 1: Simple Mutation with Status Check (Before & After)
// ============================================================================

// ❌ BEFORE - Shows "success" even on error
async function handleAddProduct_OLD() {
  try {
    await addAction(visitId, departmentId, productId, quantity)
    await refetchVisit()
    toast.success('Product added successfully') // No status check!
  } catch (err) {
    toast.error('Failed to add product')
  }
}

// ✅ AFTER - Checks status and shows actual message
async function handleAddProduct_NEW() {
  try {
    const result = await addAction(visitId, departmentId, productId, quantity)
    
    if (result?.status === 'SUCCESS') {
      await refetchVisit()
      toast.success(result.message || 'Product added successfully')
    } else {
      const message = result?.message || result?.messages?.[0]?.text || 'Failed to add product'
      toast.error(message)
    }
  } catch (err) {
    toast.error(err?.message || 'Failed to add product')
  }
}

// ✅ BEST - Using the utility function
import { handleResponse } from '@/lib/response-handler'

async function handleAddProduct_BEST() {
  try {
    const result = await addAction(visitId, departmentId, productId, quantity)
    
    if (await handleResponse(result, { 
      successMessage: 'Product added successfully',
      onSuccess: () => refetchVisit()
    })) {
      // Additional success logic if needed
    }
  } catch (err) {
    toast.error(err?.message || 'Network error occurred')
  }
}

// ============================================================================
// EXAMPLE 2: Form Submission (Create/Update)
// ============================================================================

// ❌ BEFORE - Silently succeeds or shows generic error
const handleCreateInsurance_OLD = async () => {
  setSaving(true)
  try {
    await createInsuranceProvider({
      insuranceName: name,
      acronym,
      defaultCoveragePercentage: coverage,
    })
    toast.success('Insurance created!')
    resetForm()
    setModalOpen(false)
  } catch (err: any) {
    toast.error(err?.message || 'Failed to create')
  } finally {
    setSaving(false)
  }
}

// ✅ AFTER - Shows backend message and proper status
const handleCreateInsurance_NEW = async () => {
  setSaving(true)
  try {
    const response = await createInsuranceProvider({
      insuranceName: name,
      acronym,
      defaultCoveragePercentage: coverage,
    })
    
    if (response?.status === 'SUCCESS') {
      toast.success(response?.message || 'Insurance created successfully!')
      await refetch()
      resetForm()
      setModalOpen(false)
    } else {
      toast.error(response?.message || 'Failed to create insurance')
    }
  } catch (err: any) {
    toast.error(err?.message || 'Network error occurred')
  } finally {
    setSaving(false)
  }
}

// ✅ BEST - Clean with utility
import { handleResponse } from '@/lib/response-handler'

const handleCreateInsurance_BEST = async () => {
  setSaving(true)
  try {
    const response = await createInsuranceProvider({
      insuranceName: name,
      acronym,
      defaultCoveragePercentage: coverage,
    })
    
    if (await handleResponse(response, {
      successMessage: 'Insurance created successfully!',
      onSuccess: async () => {
        await refetch()
        resetForm()
        setModalOpen(false)
      },
      onError: (msg) => console.error('Create failed:', msg)
    })) {
      // Success - modal will be closed via onSuccess
    }
  } catch (err: any) {
    toast.error(err?.message || 'Network error occurred')
  } finally {
    setSaving(false)
  }
}

// ============================================================================
// EXAMPLE 3: Chained Operations (Complete departments then visit)
// ============================================================================

// ❌ BEFORE - No status checks on the second operation
const handleDischarge_OLD = async (visit: Visit) => {
  try {
    // Complete departments
    for (const dept of notCompleted) {
      await updateDepartmentStatus(dept.id, 'COMPLETED')  // No status check!
    }
    
    // Complete visit
    await completeVisit(visitId)  // No status check!
    toast.success('Discharged successfully')
  } catch (err) {
    toast.error('Discharge failed')
  }
}

// ✅ AFTER - Checks each step
const handleDischarge_NEW = async (visit: Visit) => {
  try {
    // Complete departments
    for (const dept of notCompleted) {
      const result = await updateDepartmentStatus(dept.id, 'COMPLETED')
      if (result?.status !== 'SUCCESS') {
        toast.error(result?.message || `Failed to complete ${dept.name}`)
        return
      }
    }
    
    // Complete visit
    const visitResult = await completeVisit(visitId)
    if (visitResult?.status !== 'SUCCESS') {
      toast.error(visitResult?.message || 'Failed to complete visit')
      return
    }
    
    toast.success('Patient discharged successfully')
    await refetchVisit()
  } catch (err) {
    toast.error('Discharge failed')
  }
}

// ============================================================================
// EXAMPLE 4: Delete Operations with Confirmation
// ============================================================================

// ❌ BEFORE - Shows "success" without checking actual result
const handleDelete_OLD = async (id: string) => {
  if (!confirm('Delete?')) return
  setSaving(true)
  try {
    const ok = await deleteInsuranceProvider(id)
    if (ok) {
      await refetch()
      toast.success('Deleted!')
    } else {
      toast.error('Delete failed')
    }
  } catch (err: any) {
    toast.error(err?.message || 'Delete failed')
  } finally {
    setSaving(false)
  }
}

// ✅ AFTER - Checks response status from hook
const handleDelete_NEW = async (id: string) => {
  if (!confirm('Delete?')) return
  setSaving(true)
  try {
    const response = await deleteInsuranceProvider(id)
    
    if (response?.status === 'SUCCESS') {
      await refetch()
      toast.success(response?.message || 'Deleted successfully')
    } else {
      toast.error(response?.message || 'Delete failed')
    }
  } catch (err: any) {
    toast.error(err?.message || 'Delete failed')
  } finally {
    setSaving(false)
  }
}

// ✅ BEST - Using utility with callbacks
import { handleResponse } from '@/lib/response-handler'

const handleDelete_BEST = async (id: string) => {
  if (!confirm('Delete this provider?')) return
  
  setSaving(true)
  try {
    const response = await deleteInsuranceProvider(id)
    
    await handleResponse(response, {
      successMessage: 'Deleted successfully',
      onSuccess: async () => {
        await refetch()
        if (editingId === id) resetForm()
      },
      onError: (msg) => console.error('Delete error:', msg)
    })
  } finally {
    setSaving(false)
  }
}

// ============================================================================
// EXAMPLE 5: Using executeWithHandler for One-Off Operations
// ============================================================================

import { executeWithHandler } from '@/lib/response-handler'

// Directly execute and get data
const data = await executeWithHandler(
  createPatient(formData),
  {
    successMessage: 'Patient created successfully!',
    onSuccess: () => refreshPatientList()
  }
)

if (data) {
  // Use the patient data
  selectPatient(data.id)
}

// ============================================================================
// MIGRATION CHECKLIST
// ============================================================================

/*
 * When updating a component handler:
 * 
 * □ Import handleResponse or executeWithHandler from '@/lib/response-handler'
 * □ Remove hardcoded success messages
 * □ Add response?.status === 'SUCCESS' check
 * □ Extract message from response: result.message || result.messages?.[0]?.text
 * □ Pass message to toast.success() and toast.error()
 * □ Test with:
 *   - Authorized user (should succeed)
 *   - Unauthorized user (should show "not allowed" error)
 *   - Bad data (should show backend validation message)
 *   - Network disconnected (should show network error)
 * 
 * Reference Status Values:
 * □ SUCCESS - Operation succeeded
 * □ ERROR - Generic error
 * □ UNAUTHENTICATED - Not logged in
 * □ UNAUTHORISED - No permission (THIS IS WHAT YOU WANT TO TEST!)
 * □ PARTIAL_SUCCESS - Some items processed
 */
