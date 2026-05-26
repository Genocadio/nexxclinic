"use client"

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { useAuth } from '@/lib/auth-context'
import { 
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
  useAddDepartmentInsurance,
  useRemoveDepartmentInsurance,
  useAddDepartmentProduct,
  useRemoveDepartmentProduct,
  useProducts,
  useInsurances,
} from '@/hooks/auth-hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ProductAutocomplete } from '@/components/ui/product-autocomplete'
import { InsuranceAutocomplete } from '@/components/ui/insurance-autocomplete'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Plus, Pencil, Trash, X, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function DepartmentsPage() {
  const router = useRouter()
  const { doctor } = useAuth()
  const { toast } = useToast()

  const { departments, loading: departmentsLoading, refetch: refetchDepartments } = useDepartments()
  const { products, loading: productsLoading } = useProducts()
  const { insurances, loading: insurancesLoading } = useInsurances()

  const { createDepartment } = useCreateDepartment()
  const { updateDepartment } = useUpdateDepartment()
  const { deleteDepartment } = useDeleteDepartment()
  const { addDepartmentInsurance } = useAddDepartmentInsurance()
  const { removeDepartmentInsurance } = useRemoveDepartmentInsurance()
  const { addDepartmentProduct } = useAddDepartmentProduct()
  const { removeDepartmentProduct } = useRemoveDepartmentProduct()
  const [selectedDepartment, setSelectedDepartment] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuDepartment, setMenuDepartment] = useState<any>(null)
  const [departmentName, setDepartmentName] = useState('')
  const [departmentInsurancePolicyMode, setDepartmentInsurancePolicyMode] = useState('')
  const [departmentProductIds, setDepartmentProductIds] = useState<string[]>([])
  const [departmentInsuranceIds, setDepartmentInsuranceIds] = useState<string[]>([])
  const [departmentNursing, setDepartmentNursing] = useState<boolean>(false)
  const [departmentSupportRequests, setDepartmentSupportRequests] = useState<boolean>(false)
  const [departmentRequestsProducts, setDepartmentRequestsProducts] = useState<boolean>(false)
  const [pendingProductId, setPendingProductId] = useState('')
  const [pendingInsuranceId, setPendingInsuranceId] = useState('')
  const [saving, setSaving] = useState(false)

  // Linking states
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('')

  const availableProducts = useMemo(() => {
    if (!selectedDepartment) return products
    const linkedIds = new Set((selectedDepartment.defaultProducts || []).map((product: any) => String(product.id)))
    return products.filter((product: any) => !linkedIds.has(String(product.id)))
  }, [products, selectedDepartment])

  const availableInsurances = useMemo(() => {
    if (!selectedDepartment) return insurances
    const linkedIds = new Set((selectedDepartment.insurancePolicies || []).map((i: any) => String(i.id)))
    return insurances.filter((i: any) => !linkedIds.has(String(i.id)))
  }, [insurances, selectedDepartment])

  const modalAvailableProducts = useMemo(() => {
    const linkedIds = new Set(departmentProductIds)
    return products.filter((product: any) => !linkedIds.has(String(product.id)))
  }, [departmentProductIds, products])

  const modalAvailableInsurances = useMemo(() => {
    const linkedIds = new Set(departmentInsuranceIds)
    return insurances.filter((insurance: any) => !linkedIds.has(String(insurance.id)))
  }, [departmentInsuranceIds, insurances])

  const resetDepartmentForm = () => {
    setDepartmentName('')
    setDepartmentInsurancePolicyMode('')
    setDepartmentProductIds([])
    setDepartmentInsuranceIds([])
    setPendingProductId('')
    setPendingInsuranceId('')
    setDepartmentNursing(false)
    setDepartmentSupportRequests(false)
    setDepartmentRequestsProducts(false)
  }

  const handleAddModalProduct = () => {
    if (!pendingProductId || departmentProductIds.includes(pendingProductId)) return
    setDepartmentProductIds((current) => [...current, pendingProductId])
    setPendingProductId('')
  }

  const handleRemoveModalProduct = (productId: string) => {
    setDepartmentProductIds((current) => current.filter((id) => id !== productId))
  }

  const handleAddModalInsurance = () => {
    if (!pendingInsuranceId || departmentInsuranceIds.includes(pendingInsuranceId)) return
    setDepartmentInsuranceIds((current) => [...current, pendingInsuranceId])
    setPendingInsuranceId('')
  }

  const handleRemoveModalInsurance = (insuranceId: string) => {
    setDepartmentInsuranceIds((current) => current.filter((id) => id !== insuranceId))
  }

  const openAddModal = () => {
    setModalMode('add')
    resetDepartmentForm()
    setIsModalOpen(true)
  }

  const openEditModal = () => {
    if (!selectedDepartment) return
    setModalMode('edit')
    setDepartmentName(selectedDepartment.name)
    setDepartmentInsurancePolicyMode('')
    setDepartmentProductIds([])
    setDepartmentInsuranceIds([])
    setPendingProductId('')
    setPendingInsuranceId('')
    setDepartmentNursing(Boolean(selectedDepartment.nursing))
    setDepartmentSupportRequests(Boolean(selectedDepartment.supportRequests))
    setDepartmentRequestsProducts(Boolean(selectedDepartment.requestsProducts))
    setIsModalOpen(true)
  }

  const openDepartmentMenu = (department: any) => {
    setMenuDepartment(department)
    setMenuOpen(true)
  }

  const closeDepartmentMenu = () => {
    setMenuOpen(false)
    setMenuDepartment(null)
  }

  const handlePolicyModeChange = async (department: any, newMode: string) => {
    if (!department || department.insurancePolicyMode === newMode) return
    
    try {
      // If switching from ALL to another mode, clear existing insurance policies first
      const updateData: any = {
        insurancePolicyMode: newMode,
      }
      
      // Clear existing insurance policies when switching from ALL
      if (department.insurancePolicyMode === 'ALL' && newMode !== 'ALL') {
        updateData.insuranceProviderIds = []
      }
      
      const resp = await updateDepartment(department.id, updateData)

      if (resp?.status === 'SUCCESS') {
        const updated = resp.data
        // Update both selectedDepartment and menuDepartment if they exist
        if (selectedDepartment?.id === department.id) {
          setSelectedDepartment(updated)
        }
        if (menuDepartment?.id === department.id) {
          setMenuDepartment(updated)
        }
        await refetchDepartments()
        if (department.insurancePolicyMode === 'ALL' && newMode !== 'ALL') {
          toast({ 
            title: 'Policy mode changed', 
            description: 'Switched from "All insurances apply" to selective mode. You can now add specific insurance policies.' 
          })
        } else {
          toast({ 
            title: 'Policy mode updated', 
            description: `Insurance policy mode changed to ${newMode}` 
          })
        }
      } else {
        toast({ title: 'Update failed', description: resp?.message || 'Failed to update policy mode', variant: 'destructive' })
      }
    } catch (err: any) {
      console.error('Policy mode change error:', err)
      toast({ 
        title: 'Failed to update policy mode', 
        description: err?.message || 'Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleCreateOrUpdate = async () => {
    try {
      setSaving(true)
      if (modalMode === 'add') {
        const createdResp = await createDepartment(departmentName.trim(), {
          insurancePolicyMode: departmentInsurancePolicyMode || undefined,
          insuranceProviderIds: departmentInsuranceIds,
          defaultProductIds: departmentProductIds,
          nursing: departmentNursing,
          supportRequests: departmentSupportRequests,
          requestsProducts: departmentRequestsProducts,
        })
        if (createdResp?.status === 'SUCCESS') {
          toast({ title: 'Department created', description: createdResp.data?.name })
          setSelectedDepartment(createdResp.data)
          await refetchDepartments()
        } else {
          toast({ title: 'Create failed', description: createdResp?.message || 'Failed to create department', variant: 'destructive' })
        }
      } else if (selectedDepartment) {
        // Edit mode - update the department metadata
        const updatedResp = await updateDepartment(selectedDepartment.id, {
          name: departmentName.trim(),
          nursing: departmentNursing,
          supportRequests: departmentSupportRequests,
          requestsProducts: departmentRequestsProducts,
        })
        if (updatedResp?.status === 'SUCCESS') {
          toast({ title: 'Department name updated', description: updatedResp.data?.name })
          setSelectedDepartment(updatedResp.data)
          await refetchDepartments()
        } else {
          toast({ title: 'Update failed', description: updatedResp?.message || 'Failed to update department', variant: 'destructive' })
        }
      }
      setIsModalOpen(false)
    } catch (err: any) {
      console.error('Create/Update error:', err)
      
      // Extract the actual error message from various possible error structures
      let errorMessage = modalMode === 'add' ? 'Failed to create department' : 'Failed to update department name'
      
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.graphQLErrors?.length > 0) {
        const gqlError = err.graphQLErrors[0]
        if (gqlError?.message) {
          errorMessage = gqlError.message
        } else if (gqlError?.extensions?.exception?.message) {
          errorMessage = gqlError.extensions.exception.message
        }
      } else if (err?.networkError?.result?.errors?.length > 0) {
        const networkError = err.networkError.result.errors[0]
        errorMessage = networkError.message || errorMessage
      }
      
      // Check for specific database constraint violations
      if (errorMessage.includes('duplicate key value violates unique constraint') || 
          errorMessage.includes('uk_department_insurance_policy')) {
        errorMessage = 'This insurance policy is already linked to the department'
      }
      
      toast({ 
        title: 'Operation failed', 
        description: errorMessage,
        variant: 'destructive'
      })
      // Don't close modal on error
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedDepartment) return
    if (!confirm('Delete this department?')) return
    try {
      setSaving(true)
      const resp = await deleteDepartment(selectedDepartment.id)
      if (resp?.status === 'SUCCESS') {
        toast({ title: 'Department deleted' })
        setSelectedDepartment(null)
        await refetchDepartments()
      } else {
        toast({ title: 'Delete failed', description: resp?.message || 'Please try again.' })
      }
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err?.message || 'Unexpected error' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddProduct = async () => {
    const department = menuDepartment || selectedDepartment
    if (!department || !selectedProductId) return
    try {
      const currentProductIds = (department.defaultProducts || []).map((p: any) => String(p.id))
      const resp = await updateDepartment(department.id, {
        defaultProductIds: [...currentProductIds, selectedProductId]
      })
      if (resp?.status === 'SUCCESS') {
        const updated = resp.data
        // Update both selectedDepartment and menuDepartment if they exist
        if (selectedDepartment?.id === department.id) {
          setSelectedDepartment(updated)
        }
        if (menuDepartment?.id === department.id) {
          setMenuDepartment(updated)
        }
        await refetchDepartments()
        setSelectedProductId('')
        toast({ title: 'Product added successfully', description: resp.message || 'The product has been linked to the department.' })
      } else {
        toast({ title: 'Failed to add product', description: resp?.message || 'Failed to add product to department', variant: 'destructive' })
      }
    } catch (err: any) {
      console.error('Add product error:', err)
      
      // Extract the actual error message from various possible error structures
      let errorMessage = 'Failed to add product to department'
      
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.graphQLErrors?.length > 0) {
        const gqlError = err.graphQLErrors[0]
        if (gqlError?.message) {
          errorMessage = gqlError.message
        } else if (gqlError?.extensions?.exception?.message) {
          errorMessage = gqlError.extensions.exception.message
        }
      } else if (err?.networkError?.result?.errors?.length > 0) {
        const networkError = err.networkError.result.errors[0]
        errorMessage = networkError.message || errorMessage
      }
      
      // Check for specific database constraint violations
      if (errorMessage.includes('duplicate key value violates unique constraint') || 
          errorMessage.includes('uk_department_product')) {
        errorMessage = 'This product is already linked to the department'
      }
      
      toast({ 
        title: 'Failed to add product', 
        description: errorMessage,
        variant: 'destructive'
      })
    }
  }

  const handleRemoveProduct = async (productId: string | number) => {
    const department = menuDepartment || selectedDepartment
    if (!department) return
    try {
      const currentProductIds = (department.defaultProducts || []).map((p: any) => String(p.id))
      const resp = await updateDepartment(department.id, {
        defaultProductIds: currentProductIds.filter((id: string) => id !== String(productId))
      })
      if (resp?.status === 'SUCCESS') {
        const updated = resp.data
        // Update both selectedDepartment and menuDepartment if they exist
        if (selectedDepartment?.id === department.id) {
          setSelectedDepartment(updated)
        }
        if (menuDepartment?.id === department.id) {
          setMenuDepartment(updated)
        }
        await refetchDepartments()
        toast({ title: 'Product removed successfully', description: resp.message || 'The product has been unlinked from the department.' })
      } else {
        toast({ title: 'Failed to remove product', description: resp?.message || 'Failed to remove product from department', variant: 'destructive' })
      }
    } catch (err: any) {
      console.error('Remove product error:', err)
      const errorMessage = err?.message || 'Failed to remove product from department'
      toast({ 
        title: 'Failed to remove product', 
        description: errorMessage,
        variant: 'destructive'
      })
    }
  }

  const handleAddInsurancePolicy = async () => {
    const department = menuDepartment || selectedDepartment
    if (!department || !selectedInsuranceId) return
    try {
      const currentInsuranceIds = (department.insurancePolicies || []).map((i: any) => String(i.id))
      const resp = await updateDepartment(department.id, {
        insuranceProviderIds: [...currentInsuranceIds, selectedInsuranceId]
      })
      if (resp?.status === 'SUCCESS') {
        const updated = resp.data
        // Update both selectedDepartment and menuDepartment if they exist
        if (selectedDepartment?.id === department.id) {
          setSelectedDepartment(updated)
        }
        if (menuDepartment?.id === department.id) {
          setMenuDepartment(updated)
        }
        await refetchDepartments()
        setSelectedInsuranceId('')
        toast({ title: 'Insurance policy added successfully', description: resp.message || 'The insurance policy has been linked to the department.' })
      } else {
        toast({ title: 'Failed to add insurance policy', description: resp?.message || 'Failed to add insurance policy to department', variant: 'destructive' })
      }
    } catch (err: any) {
      console.error('Add insurance error:', err)
      
      // Extract the actual error message from various possible error structures
      let errorMessage = 'Failed to add insurance policy to department'
      
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.graphQLErrors?.length > 0) {
        const gqlError = err.graphQLErrors[0]
        if (gqlError?.message) {
          errorMessage = gqlError.message
        } else if (gqlError?.extensions?.exception?.message) {
          errorMessage = gqlError.extensions.exception.message
        }
      } else if (err?.networkError?.result?.errors?.length > 0) {
        const networkError = err.networkError.result.errors[0]
        errorMessage = networkError.message || errorMessage
      }
      
      // Check for specific database constraint violations
      if (errorMessage.includes('duplicate key value violates unique constraint') || 
          errorMessage.includes('uk_department_insurance_policy')) {
        errorMessage = 'This insurance policy is already linked to the department'
      }
      
      toast({ 
        title: 'Failed to add insurance policy', 
        description: errorMessage,
        variant: 'destructive'
      })
    }
  }

  const handleRemoveInsurancePolicy = async (insuranceId: string | number) => {
    const department = menuDepartment || selectedDepartment
    if (!department) return
    try {
      const currentInsuranceIds = (department.insurancePolicies || []).map((i: any) => String(i.id))
      const resp = await updateDepartment(department.id, {
        insuranceProviderIds: currentInsuranceIds.filter((id: string) => id !== String(insuranceId))
      })
      if (resp?.status === 'SUCCESS') {
        const updated = resp.data
        // Update both selectedDepartment and menuDepartment if they exist
        if (selectedDepartment?.id === department.id) {
          setSelectedDepartment(updated)
        }
        if (menuDepartment?.id === department.id) {
          setMenuDepartment(updated)
        }
        await refetchDepartments()
        toast({ title: 'Insurance policy removed successfully', description: resp.message || 'The insurance policy has been unlinked from the department.' })
      } else {
        toast({ title: 'Failed to remove insurance policy', description: resp?.message || 'Failed to remove insurance policy from department', variant: 'destructive' })
      }
    } catch (err: any) {
      console.error('Remove insurance error:', err)
      const errorMessage = err?.message || 'Failed to remove insurance policy from department'
      toast({ 
        title: 'Failed to remove insurance policy', 
        description: errorMessage,
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full" onClick={() => router.push('/admin')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Departments</h1>
          <p className="text-muted-foreground">Create, edit, and manage default links & exemptions.</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Departments list */}
        <section className="bg-card/70 dark:bg-slate-900/70 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Departments</p>
            <Button onClick={openAddModal} className="rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Department
            </Button>
          </div>

          {departmentsLoading ? (
            <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
              {[...Array(5)].map((_, idx) => (
                <Skeleton key={idx} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className={`w-full p-3 rounded-xl border ${selectedDepartment?.id === dept.id ? 'bg-muted' : 'bg-background/60'} hover:bg-muted`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedDepartment(dept)}
                      className="flex-1 text-left"
                    >
                      <span className="font-medium">{dept.name}</span>
                      <div className="text-xs text-muted-foreground mt-1">
                        {dept.defaultProducts?.length || 0} products • {(dept.insurancePolicies || []).length} insurances
                      </div>
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDepartmentMenu(dept)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Manage Products & Insurances
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedDepartment(dept); openEditModal(); }}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Name
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedDepartment(dept); handleDelete(); }} className="text-destructive">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              {departments.length === 0 && (
                <p className="text-sm text-muted-foreground">No departments yet.</p>
              )}
            </div>
          )}
        </section>

        {/* Right - Department details */}
        <section className="bg-card/70 dark:bg-slate-900/70 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          {!selectedDepartment ? (
            <p className="text-sm text-muted-foreground">Select a department to view and manage details.</p>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{selectedDepartment.name}</h2>
                  <p className="text-xs text-muted-foreground">Manage default products and insurance policies</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/forms/manage?departmentId=${selectedDepartment.id}&departmentName=${encodeURIComponent(selectedDepartment.name)}`)}
                    className="rounded-full"
                  >
                    <FileText className="h-4 w-4 mr-2" /> Manage Forms
                  </Button>
                  <Button variant="outline" size="sm" onClick={openEditModal} className="rounded-full">
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDelete} className="rounded-full">
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>

              {/* Products section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Default Products</h3>
                  <div className="flex items-center gap-2">
                    <ProductAutocomplete
                      products={availableProducts}
                      selectedProductId={selectedProductId}
                      onProductSelect={setSelectedProductId}
                      placeholder={productsLoading ? 'Loading...' : 'Search products...'}
                      disabled={productsLoading}
                      className="w-56"
                    />
                    <Button size="sm" onClick={handleAddProduct} disabled={!selectedProductId}>Add</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {(selectedDepartment.defaultProducts || []).map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <span className="text-sm">{product.name}</span>
                      <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleRemoveProduct(product.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {(selectedDepartment.defaultProducts || []).length === 0 && (
                    <p className="text-xs text-muted-foreground">No products linked.</p>
                  )}
                </div>
              </div>

              {/* Insurance policies section - moved under products */}
              <div className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">Insurance Policies</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs bg-muted/50 hover:bg-muted/70 rounded-full">
                          {selectedDepartment.insurancePolicyMode === 'ALL' 
                            ? 'All insurances apply' 
                            : selectedDepartment.insurancePolicyMode === 'ONLY' 
                            ? 'Only selected insurances apply' 
                            : 'Selected insurances exempted'}
                          <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => handlePolicyModeChange(selectedDepartment, 'ALL')}>
                          All insurances apply
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePolicyModeChange(selectedDepartment, 'ONLY')}>
                          Only selected insurances apply
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePolicyModeChange(selectedDepartment, 'EXCEPT')}>
                          Selected insurances exempted
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {selectedDepartment.insurancePolicyMode === 'ALL' && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>All insurance policies apply</strong> to this department. Click the policy badge above to change this setting and enable selective insurance management.
                      </p>
                    </div>
                  )}

                  {selectedDepartment.insurancePolicyMode !== 'ALL' && (
                    <div className="space-y-3">
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-2">Add Insurance Policy</p>
                        <div className="flex flex-col space-y-2">
                          <InsuranceAutocomplete
                            insurances={availableInsurances.filter(insurance => 
                              !(selectedDepartment.insurancePolicies || []).some((existing: any) => 
                                String(existing.id) === String(insurance.id)
                              )
                            )}
                            selectedInsuranceId={selectedInsuranceId}
                            onInsuranceSelect={setSelectedInsuranceId}
                            placeholder={insurancesLoading ? 'Loading...' : 'Search insurances...'}
                            disabled={insurancesLoading}
                            className="w-full"
                          />
                          <Button 
                            size="sm" 
                            onClick={handleAddInsurancePolicy} 
                            disabled={!selectedInsuranceId}
                            className="w-full"
                          >
                            Add Insurance Policy
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {(selectedDepartment.insurancePolicies || []).map((insurance: any) => (
                    <div key={insurance.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex-1">
                        <span className="text-sm font-medium">{insurance.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({insurance.acronym})</span>
                      </div>
                      {selectedDepartment.insurancePolicyMode !== 'ALL' && (
                        <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleRemoveInsurancePolicy(insurance.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {(selectedDepartment.insurancePolicies || []).length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-xs text-muted-foreground">
                        {selectedDepartment.insurancePolicyMode === 'ALL' 
                          ? 'All insurance policies apply to this department.' 
                          : 'No insurance policies linked. Add your first policy above.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </>
          )}
        </section>
      </div>

      {/* Floating action button for mobile screens */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button
          onClick={openAddModal}
          className="h-12 w-12 rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Add/Edit modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-black/25 border border-white/20 rounded-3xl shadow-2xl p-3 flex flex-col">
          <div className="flex-1 overflow-hidden bg-[#FBF2ED] dark:bg-slate-900 border border-border/40 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">{modalMode === 'add' ? 'Add Department' : 'Edit Department'}</DialogTitle>
              <DialogDescription>
                {modalMode === 'add' ? 'Fill in the details below to create a new system department. Operational flags like nursing and support requests are managed by the backend and shown after creation.' : 'Update the department name below.'}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2 space-y-5 my-4 scrollbar-thin">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Name *</label>
                <Input value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} placeholder="Department name" className="rounded-xl bg-white dark:bg-slate-950" />
              </div>

              {modalMode === 'edit' && selectedDepartment && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-border/60 bg-white dark:bg-slate-950 p-4 shadow-sm items-center">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Nursing</p>
                      <p className="text-sm text-foreground">Enable nursing features for this department</p>
                    </div>
                    <Switch checked={departmentNursing} onCheckedChange={(v: boolean) => setDepartmentNursing(v)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Support Requests</p>
                      <p className="text-sm text-foreground">Allow support request workflow for this department</p>
                    </div>
                    <Switch checked={departmentSupportRequests} onCheckedChange={(v: boolean) => setDepartmentSupportRequests(v)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Request Products</p>
                      <p className="text-sm text-foreground">Allow this department to request products when needed</p>
                    </div>
                    <Switch checked={departmentRequestsProducts} onCheckedChange={(v: boolean) => setDepartmentRequestsProducts(v)} />
                  </div>
                </div>
              )}
              
              {modalMode === 'add' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Nursing</label>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-foreground">Enable nursing features for this department</p>
                        <Switch checked={departmentNursing} onCheckedChange={(v: boolean) => setDepartmentNursing(v)} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Support Requests</label>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-foreground">Allow support request workflow for this department</p>
                        <Switch checked={departmentSupportRequests} onCheckedChange={(v: boolean) => setDepartmentSupportRequests(v)} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Request Products</label>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-foreground">Allow this department to request products when needed</p>
                        <Switch checked={departmentRequestsProducts} onCheckedChange={(v: boolean) => setDepartmentRequestsProducts(v)} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Insurance Policy Mode</label>
                    <Select value={departmentInsurancePolicyMode} onValueChange={setDepartmentInsurancePolicyMode}>
                      <SelectTrigger className="rounded-xl bg-white dark:bg-slate-950">
                        <SelectValue placeholder="Optional policy mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All insurances apply</SelectItem>
                        <SelectItem value="ONLY">Only selected insurances apply</SelectItem>
                        <SelectItem value="EXCEPT">Selected insurances are exempted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 rounded-xl border border-border/60 bg-white dark:bg-slate-950 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-muted-foreground">Initial Products (Optional)</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <ProductAutocomplete
                        products={modalAvailableProducts}
                        selectedProductId={pendingProductId}
                        onProductSelect={setPendingProductId}
                        placeholder={productsLoading ? 'Loading products...' : 'Search products...'}
                        disabled={productsLoading}
                        className="flex-1"
                      />
                      <Button type="button" size="sm" onClick={handleAddModalProduct} disabled={!pendingProductId}>Add</Button>
                    </div>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 scrollbar-thin">
                      {departmentProductIds.map((productId) => {
                        const product = products.find((item: any) => String(item.id) === productId)
                        return (
                          <div key={productId} className="flex items-center justify-between rounded-lg border px-3 py-2 bg-muted/20">
                            <span className="text-sm font-medium">{product?.name || productId}</span>
                            <Button type="button" variant="outline" size="icon" className="rounded-full h-7 w-7" onClick={() => handleRemoveModalProduct(productId)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                      {departmentProductIds.length === 0 && <p className="text-xs text-muted-foreground">No products selected.</p>}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-xl border border-border/60 bg-white dark:bg-slate-950 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-muted-foreground">Initial Insurances (Optional)</label>
                        {departmentInsurancePolicyMode === 'ALL' && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            All insurances apply
                          </span>
                        )}
                      </div>
                    </div>
                    {departmentInsurancePolicyMode !== 'ALL' && (
                      <>
                        <div className="flex items-center gap-2">
                          <InsuranceAutocomplete
                            insurances={modalAvailableInsurances.filter((insurance: any) => 
                              !departmentInsuranceIds.includes(String(insurance.id))
                            )}
                            selectedInsuranceId={pendingInsuranceId}
                            onInsuranceSelect={setPendingInsuranceId}
                            placeholder={insurancesLoading ? 'Loading insurances...' : 'Search insurances...'}
                            disabled={insurancesLoading}
                            className="flex-1"
                          />
                          <Button type="button" size="sm" onClick={handleAddModalInsurance} disabled={!pendingInsuranceId}>Add</Button>
                        </div>
                      </>
                    )}
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 scrollbar-thin">
                      {departmentInsuranceIds.map((insuranceId) => {
                        const insurance = insurances.find((item: any) => String(item.id) === insuranceId)
                        return (
                          <div key={insuranceId} className="flex items-center justify-between rounded-lg border px-3 py-2 bg-muted/20">
                            <span className="text-sm font-medium">{insurance?.name || insuranceId}</span>
                            {departmentInsurancePolicyMode !== 'ALL' && (
                              <Button type="button" variant="outline" size="icon" className="rounded-full h-7 w-7" onClick={() => handleRemoveModalInsurance(insuranceId)}>
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )
                      })}
                      {departmentInsuranceIds.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          {departmentInsurancePolicyMode === 'ALL' 
                            ? 'All insurance policies will apply.' 
                            : 'No insurances selected.'}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-border/30 sticky bottom-0 bg-background/95 dark:bg-slate-900/95 -mx-2 px-2 pb-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-full px-5">Cancel</Button>
              <Button onClick={handleCreateOrUpdate} disabled={saving || !departmentName.trim()} className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md">
                {modalMode === 'add' ? 'Create' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Department Management Menu */}
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Manage Department: {menuDepartment?.name}</DialogTitle>
          </DialogHeader>
          {menuDepartment && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
                  Nursing: {typeof menuDepartment.nursing === 'boolean' ? (menuDepartment.nursing ? 'Enabled' : 'Disabled') : 'Not available yet'}
                </span>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
                  Support Requests: {typeof menuDepartment.supportRequests === 'boolean' ? (menuDepartment.supportRequests ? 'Enabled' : 'Disabled') : 'Not available yet'}
                </span>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
                  Request Products: {typeof menuDepartment.requestsProducts === 'boolean' ? (menuDepartment.requestsProducts ? 'Enabled' : 'Disabled') : 'Not available yet'}
                </span>
              </div>

              {/* Products section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Default Products</h3>
                  <div className="flex items-center gap-2">
                    <ProductAutocomplete
                      products={availableProducts}
                      selectedProductId={selectedProductId}
                      onProductSelect={setSelectedProductId}
                      placeholder={productsLoading ? 'Loading...' : 'Search products...'}
                      disabled={productsLoading}
                      className="w-56"
                    />
                    <Button size="sm" onClick={handleAddProduct} disabled={!selectedProductId}>Add</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {(menuDepartment.defaultProducts || []).map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <span className="text-sm">{product.name}</span>
                      <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleRemoveProduct(product.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {(menuDepartment.defaultProducts || []).length === 0 && (
                    <p className="text-xs text-muted-foreground">No products linked.</p>
                  )}
                </div>
              </div>

              {/* Insurance policies section */}
              <div className="space-y-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">Insurance Policies</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs bg-muted/50 hover:bg-muted/70 rounded-full">
                          {menuDepartment.insurancePolicyMode === 'ALL' 
                            ? 'All insurances apply' 
                            : menuDepartment.insurancePolicyMode === 'ONLY' 
                            ? 'Only selected insurances apply' 
                            : 'Selected insurances exempted'}
                          <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => handlePolicyModeChange(menuDepartment, 'ALL')}>
                          All insurances apply
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePolicyModeChange(menuDepartment, 'ONLY')}>
                          Only selected insurances apply
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePolicyModeChange(menuDepartment, 'EXCEPT')}>
                          Selected insurances exempted
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {menuDepartment.insurancePolicyMode === 'ALL' && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>All insurance policies apply</strong> to this department. Click the policy badge above to change this setting and enable selective insurance management.
                      </p>
                    </div>
                  )}

                  {menuDepartment.insurancePolicyMode !== 'ALL' && (
                    <div className="space-y-3">
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-2">Add Insurance Policy</p>
                        <div className="flex flex-col space-y-2">
                          <InsuranceAutocomplete
                            insurances={availableInsurances.filter(insurance => 
                              !(menuDepartment.insurancePolicies || []).some((existing: any) => 
                                String(existing.id) === String(insurance.id)
                              )
                            )}
                            selectedInsuranceId={selectedInsuranceId}
                            onInsuranceSelect={setSelectedInsuranceId}
                            placeholder={insurancesLoading ? 'Loading...' : 'Search insurances...'}
                            disabled={insurancesLoading}
                            className="w-full"
                          />
                          <Button 
                            size="sm" 
                            onClick={handleAddInsurancePolicy} 
                            disabled={!selectedInsuranceId}
                            className="w-full"
                          >
                            Add Insurance Policy
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {(menuDepartment.insurancePolicies || []).map((insurance: any) => (
                    <div key={insurance.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex-1">
                        <span className="text-sm font-medium">{insurance.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({insurance.acronym})</span>
                      </div>
                      {menuDepartment.insurancePolicyMode !== 'ALL' && (
                        <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleRemoveInsurancePolicy(insurance.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {(menuDepartment.insurancePolicies || []).length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-xs text-muted-foreground">
                        {menuDepartment.insurancePolicyMode === 'ALL' 
                          ? 'All insurance policies apply to this department.' 
                          : 'No insurance policies linked. Add your first policy above.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={closeDepartmentMenu} className="rounded-full">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      </main>
    </div>
  )
}
