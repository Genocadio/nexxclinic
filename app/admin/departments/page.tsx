"use client"

import React, { useMemo, useState } from 'react'
import { useRouter } from '@/lib/navigation'
import Header from '@/components/header'
import { useAuth } from '@/lib/auth-context'
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useProducts,
  useInsurances,
} from '@/hooks/auth-hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ProductAutocomplete } from '@/components/ui/product-autocomplete'
import { InsuranceAutocomplete } from '@/components/ui/insurance-autocomplete'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  Plus,
  Pencil,
  X,
  FileText,
  Building2,
  HeartPulse,
  Layers,
  ShieldCheck,
  Settings,
  Search,
  Check,
  Activity,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Workflow,
  ClipboardList,
  ShieldAlert,
  Shield,
  Stethoscope,
  FlaskConical,
} from 'lucide-react'
import { DepartmentFormsPanel } from '@/components/admin/department-forms-panel'
import { DepartmentProfilesPanel } from '@/components/admin/department-profiles-panel'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import type { Department, InsuranceProvider, Product } from '@/lib/api-types'

export default function DepartmentsPage() {
  const router = useRouter()
  const { doctor } = useAuth()
  const { toast } = useToast()

  const { departments, loading: departmentsLoading, refetch: refetchDepartments } = useDepartments()
  const { products, loading: productsLoading } = useProducts()
  const { insurances, loading: insurancesLoading } = useInsurances()

  const { createDepartment } = useCreateDepartment()
  const { updateDepartment } = useUpdateDepartment()

  // Navigation / Selection state
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [activeTab, setActiveTab] = useState<string>('settings')
  const [catalogSearch, setCatalogSearch] = useState('')

  // Settings form state for currently selected department
  const [settingsName, setSettingsName] = useState('')
  const [settingsNursing, setSettingsNursing] = useState(false)
  const [settingsSupportRequests, setSettingsSupportRequests] = useState(false)
  const [settingsRequestsProducts, setSettingsRequestsProducts] = useState(true)
  const [settingsSaving, setSettingsSaving] = useState(false)

  // Modal creation state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [departmentName, setDepartmentName] = useState('')
  const [departmentProfileName, setDepartmentProfileName] = useState('Default')
  const [departmentInsurancePolicyMode, setDepartmentInsurancePolicyMode] = useState('')
  const [departmentProductIds, setDepartmentProductIds] = useState<string[]>([])
  const [departmentInsuranceIds, setDepartmentInsuranceIds] = useState<string[]>([])
  const [departmentNursing, setDepartmentNursing] = useState<boolean>(false)
  const [departmentSupportRequests, setDepartmentSupportRequests] = useState<boolean>(false)
  const [departmentRequestsProducts, setDepartmentRequestsProducts] = useState<boolean>(true)
  const [pendingProductId, setPendingProductId] = useState('')
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null)
  const [pickedProducts, setPickedProducts] = useState<Record<string, Product>>({})
  const [pendingInsuranceId, setPendingInsuranceId] = useState('')
  const [pendingInsurance, setPendingInsurance] = useState<InsuranceProvider | null>(null)
  const [pickedInsurances, setPickedInsurances] = useState<Record<string, InsuranceProvider>>({})
  const [creating, setCreating] = useState(false)

  // Insurance linking states for active workspace
  const [policiesUpdating, setPoliciesUpdating] = useState(false)
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('')
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceProvider | null>(null)

  // Select a department and populate settings
  const handleSelectDepartment = (dept: Department, tab: string = 'settings') => {
    setSelectedDepartment(dept)
    setActiveTab(tab)
    setSettingsName(dept.name)
    setSettingsNursing(Boolean(dept.nursing))
    if (dept.supportRequests) {
      setSettingsSupportRequests(true)
      setSettingsRequestsProducts(false)
    } else {
      setSettingsSupportRequests(false)
      setSettingsRequestsProducts(Boolean(dept.requestsProducts ?? true))
    }
    setSelectedInsuranceId('')
    setSelectedInsurance(null)
  }

  // Deselect back to catalog
  const handleBackToCatalog = () => {
    setSelectedDepartment(null)
    setSelectedInsuranceId('')
    setSelectedInsurance(null)
  }

  const availableInsurances = useMemo(() => {
    if (!selectedDepartment) return insurances
    const linkedIds = new Set((selectedDepartment.insurancePolicies || []).map((i) => String(i.id)))
    return insurances.filter((i: InsuranceProvider) => !linkedIds.has(String(i.id)))
  }, [insurances, selectedDepartment])

  const modalAvailableProducts = useMemo(() => {
    const linkedIds = new Set(departmentProductIds)
    return products.filter((product: Product) => !linkedIds.has(String(product.id)))
  }, [departmentProductIds, products])

  const modalAvailableInsurances = useMemo(() => {
    const linkedIds = new Set(departmentInsuranceIds)
    return insurances.filter((insurance: InsuranceProvider) => !linkedIds.has(String(insurance.id)))
  }, [departmentInsuranceIds, insurances])

  // Catalog filtered list
  const filteredDepartments = useMemo(() => {
    if (!catalogSearch.trim()) return departments
    const query = catalogSearch.toLowerCase().trim()
    return departments.filter((dept: Department) =>
      dept.name.toLowerCase().includes(query) ||
      (dept.insurancePolicyMode && dept.insurancePolicyMode.toLowerCase().includes(query))
    )
  }, [departments, catalogSearch])

  // Catalog statistics
  const stats = useMemo(() => {
    const total = departments.length
    const nursingCount = departments.filter((d: Department) => d.nursing).length
    const fulfillersCount = departments.filter((d: Department) => d.supportRequests).length
    const orderingCount = departments.filter((d: Department) => d.requestsProducts || (!d.supportRequests && d.requestsProducts !== false)).length
    return { total, nursingCount, fulfillersCount, orderingCount }
  }, [departments])

  const resetDepartmentCreateForm = () => {
    setDepartmentName('')
    setDepartmentProfileName('Default')
    setDepartmentInsurancePolicyMode('')
    setDepartmentProductIds([])
    setDepartmentInsuranceIds([])
    setPendingProductId('')
    setPendingProduct(null)
    setPickedProducts({})
    setPendingInsuranceId('')
    setPendingInsurance(null)
    setPickedInsurances({})
    setDepartmentNursing(false)
    setDepartmentSupportRequests(false)
    setDepartmentRequestsProducts(true)
  }

  const openCreateModal = () => {
    resetDepartmentCreateForm()
    setIsCreateModalOpen(true)
  }

  const handleAddModalProduct = () => {
    if (!pendingProductId || departmentProductIds.includes(pendingProductId)) return
    setDepartmentProductIds((current) => [...current, pendingProductId])
    if (pendingProduct) {
      setPickedProducts((current) => ({ ...current, [pendingProductId]: pendingProduct }))
    }
    setPendingProductId('')
    setPendingProduct(null)
  }

  const handleRemoveModalProduct = (productId: string) => {
    setDepartmentProductIds((current) => current.filter((id) => id !== productId))
    setPickedProducts((current) => {
      const next = { ...current }
      delete next[productId]
      return next
    })
  }

  const handleAddModalInsurance = () => {
    if (!pendingInsuranceId || departmentInsuranceIds.includes(pendingInsuranceId)) return
    setDepartmentInsuranceIds((current) => [...current, pendingInsuranceId])
    if (pendingInsurance) {
      setPickedInsurances((current) => ({ ...current, [pendingInsuranceId]: pendingInsurance }))
    }
    setPendingInsuranceId('')
    setPendingInsurance(null)
  }

  const handleRemoveModalInsurance = (insuranceId: string) => {
    setDepartmentInsuranceIds((current) => current.filter((id) => id !== insuranceId))
    setPickedInsurances((current) => {
      const next = { ...current }
      delete next[insuranceId]
      return next
    })
  }

  const handleCreateDepartment = async () => {
    if (!departmentName.trim()) return
    try {
      setCreating(true)
      const createdResp = await createDepartment(departmentName.trim(), {
        insurancePolicyMode: departmentInsurancePolicyMode || undefined,
        insuranceProviderIds: departmentInsuranceIds,
        profiles:
          departmentProductIds.length > 0
            ? [
                {
                  name: departmentProfileName.trim() || 'Default',
                  isDefault: true,
                  productIds: departmentProductIds,
                },
              ]
            : undefined,
        nursing: departmentNursing,
        supportRequests: departmentSupportRequests,
        requestsProducts: departmentRequestsProducts,
      })
      if (createdResp?.status === 'SUCCESS' && createdResp.data) {
        toast({ title: 'Department created', description: createdResp.data.name })
        setIsCreateModalOpen(false)
        await refetchDepartments()
        handleSelectDepartment(createdResp.data, 'settings')
      } else {
        toast({
          title: 'Create failed',
          description: createdResp?.message || 'Failed to create department',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      console.error('Create error:', err)
      toast({
        title: 'Operation failed',
        description: err?.message || 'Failed to create department',
        variant: 'destructive',
      })
    } finally {
      setCreating(false)
    }
  }

  // Save general settings for currently active department
  const handleSaveSettings = async () => {
    if (!selectedDepartment || !settingsName.trim()) return
    try {
      setSettingsSaving(true)
      const updatedResp = await updateDepartment(selectedDepartment.id, {
        name: settingsName.trim(),
        nursing: settingsNursing,
        supportRequests: settingsSupportRequests,
        requestsProducts: settingsRequestsProducts,
      })
      if (updatedResp?.status === 'SUCCESS' && updatedResp.data) {
        toast({ title: 'Settings saved', description: `${updatedResp.data.name} updated successfully.` })
        setSelectedDepartment(updatedResp.data)
        await refetchDepartments()
      } else {
        toast({
          title: 'Save failed',
          description: updatedResp?.message || 'Failed to update department settings',
          variant: 'destructive',
        })
      }
    } catch (err: any) {
      console.error('Save settings error:', err)
      toast({
        title: 'Save failed',
        description: err?.message || 'Failed to update department settings',
        variant: 'destructive',
      })
    } finally {
      setSettingsSaving(false)
    }
  }

  // Insurance mode mutation
  const handlePolicyModeChange = async (newMode: string) => {
    if (!selectedDepartment || selectedDepartment.insurancePolicyMode === newMode) return

    setSelectedInsuranceId('')
    setSelectedInsurance(null)
    setPoliciesUpdating(true)

    try {
      const updateData: { insurancePolicyMode: string; insuranceProviderIds?: string[] } = {
        insurancePolicyMode: newMode,
      }
      if (selectedDepartment.insurancePolicyMode === 'ALL' && newMode !== 'ALL') {
        updateData.insuranceProviderIds = []
      }

      const resp = await updateDepartment(selectedDepartment.id, updateData)
      if (resp?.status === 'SUCCESS' && resp.data) {
        setSelectedDepartment(resp.data)
        await refetchDepartments()
        toast({
          title: 'Insurance policy mode updated',
          description:
            newMode === 'ALL'
              ? 'All insurance policies are accepted in this department.'
              : newMode === 'ONLY'
              ? 'Only selected insurance policies are accepted.'
              : 'Selected insurance policies will be exempted.',
        })
      } else {
        toast({ title: 'Update failed', description: resp?.message || 'Failed to update policy mode', variant: 'destructive' })
      }
    } catch (err: any) {
      console.error('Policy mode change error:', err)
      toast({
        title: 'Failed to update policy mode',
        description: err?.message || 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setPoliciesUpdating(false)
    }
  }

  // Add insurance policy to department
  const handleAddInsurancePolicy = async () => {
    if (!selectedDepartment || !selectedInsuranceId) return
    setPoliciesUpdating(true)
    try {
      const currentInsuranceIds = (selectedDepartment.insurancePolicies || []).map((i) => String(i.id))
      if (currentInsuranceIds.includes(selectedInsuranceId)) {
        toast({ title: 'Already linked', description: 'This insurance policy is already linked to the department.' })
        setSelectedInsuranceId('')
        setSelectedInsurance(null)
        return
      }
      const resp = await updateDepartment(selectedDepartment.id, {
        insuranceProviderIds: [...currentInsuranceIds, selectedInsuranceId],
      })
      if (resp?.status === 'SUCCESS' && resp.data) {
        setSelectedDepartment(resp.data)
        await refetchDepartments()
        setSelectedInsuranceId('')
        setSelectedInsurance(null)
        toast({ title: 'Insurance added', description: 'Insurance policy successfully added.' })
      } else {
        toast({ title: 'Failed to add insurance', description: resp?.message || 'Failed to add insurance policy', variant: 'destructive' })
      }
    } catch (err: any) {
      console.error('Add insurance error:', err)
      toast({
        title: 'Failed to add insurance',
        description: err?.message || 'Failed to add insurance policy',
        variant: 'destructive',
      })
    } finally {
      setPoliciesUpdating(false)
    }
  }

  // Remove insurance policy from department
  const handleRemoveInsurancePolicy = async (insuranceId: string | number) => {
    if (!selectedDepartment) return
    setPoliciesUpdating(true)
    try {
      const currentInsuranceIds = (selectedDepartment.insurancePolicies || []).map((i) => String(i.id))
      const resp = await updateDepartment(selectedDepartment.id, {
        insuranceProviderIds: currentInsuranceIds.filter((id: string) => id !== String(insuranceId)),
      })
      if (resp?.status === 'SUCCESS' && resp.data) {
        setSelectedDepartment(resp.data)
        await refetchDepartments()
        toast({ title: 'Insurance removed', description: 'Insurance policy removed from department.' })
      } else {
        toast({ title: 'Failed to remove insurance', description: resp?.message || 'Failed to remove insurance policy', variant: 'destructive' })
      }
    } catch (err: any) {
      console.error('Remove insurance error:', err)
      toast({
        title: 'Failed to remove insurance',
        description: err?.message || 'Failed to remove insurance policy',
        variant: 'destructive',
      })
    } finally {
      setPoliciesUpdating(false)
    }
  }

  const renderInsuranceChip = (insurance: InsuranceProvider | null, onClear: () => void) => {
    if (!insurance) return null
    return (
      <div className="flex items-center justify-between rounded-lg border px-3 py-2 bg-muted/30">
        <span className="text-sm font-medium truncate">
          {insurance.insuranceName || insurance.name}
          {insurance.acronym && (
            <span className="text-xs text-muted-foreground ml-1">({insurance.acronym})</span>
          )}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full shrink-0"
          onClick={onClear}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      <Header doctor={doctor} />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6 flex-1 min-h-0 min-w-0 overflow-y-auto">
        {/* ========================================================================= */}
        {/* VIEW A: CATALOG VIEW (WHEN NO DEPARTMENT IS SELECTED)                     */}
        {/* ========================================================================= */}
        {!selectedDepartment ? (
          <div className="space-y-6">
            {/* Top Navigation & Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    Department Management
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Configure clinical departments, nursing workflows, request fulfillment, insurance policies, and forms.
                  </p>
                </div>
              </div>

              <Button
                onClick={openCreateModal}
                className="rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md font-medium px-5"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Department
              </Button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border bg-card/70 p-4 shadow-xs">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Departments</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Active hospital units</p>
              </div>
              <div className="rounded-xl border bg-card/70 p-4 shadow-xs">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <HeartPulse className="h-3.5 w-3.5" /> Nursing Stations
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">{stats.nursingCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Triage & vitals active</p>
              </div>
              <div className="rounded-xl border bg-card/70 p-4 shadow-xs">
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <FlaskConical className="h-3.5 w-3.5" /> Request Fulfillers
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">{stats.fulfillersCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Labs, Pharmacy, Imaging</p>
              </div>
              <div className="rounded-xl border bg-card/70 p-4 shadow-xs">
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1">
                  <Stethoscope className="h-3.5 w-3.5" /> Order Departments
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">{stats.orderingCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Clinics & OPD stations</p>
              </div>
            </div>

            {/* Search Filter Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search departments by name or policy mode..."
                className="pl-9 rounded-xl bg-card"
              />
            </div>

            {/* Department Cards Grid */}
            {departmentsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, idx) => (
                  <Skeleton key={idx} className="h-48 w-full rounded-2xl" />
                ))}
              </div>
            ) : filteredDepartments.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-2xl bg-muted/10 space-y-3">
                <Building2 className="h-10 w-10 text-muted-foreground mx-auto" />
                <h3 className="text-base font-semibold">No departments found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {catalogSearch ? 'No departments match your search query.' : 'Get started by creating your first department.'}
                </p>
                {!catalogSearch && (
                  <Button onClick={openCreateModal} size="sm" className="rounded-full mt-2">
                    <Plus className="h-4 w-4 mr-1.5" /> Add First Department
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDepartments.map((dept: Department) => {
                  const isNursing = Boolean(dept.nursing)
                  const isFulfiller = Boolean(dept.supportRequests)
                  const profileCount = dept.profiles?.length || 0
                  const insuranceCount = (dept.insurancePolicies || []).length

                  return (
                    <div
                      key={dept.id}
                      onClick={() => handleSelectDepartment(dept, 'settings')}
                      className="group relative rounded-2xl border border-border/70 bg-card hover:bg-card/90 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer p-5 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Header & Badges */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              "size-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0",
                              isNursing
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-primary/10 text-primary"
                            )}>
                              {isNursing ? <HeartPulse className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                            </div>
                            <div>
                              <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                                {dept.name}
                              </h3>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleSelectDepartment(dept, 'settings')}>
                                <Settings className="h-4 w-4 mr-2" /> General Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSelectDepartment(dept, 'insurances')}>
                                <ShieldCheck className="h-4 w-4 mr-2" /> Insurances ({insuranceCount})
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSelectDepartment(dept, 'profiles')}>
                                <Layers className="h-4 w-4 mr-2" /> Profiles ({profileCount})
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSelectDepartment(dept, 'forms')}>
                                <FileText className="h-4 w-4 mr-2" /> Forms Management
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Capabilities & Operational Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {isNursing && (
                            <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[12px] gap-1">
                              <HeartPulse className="h-3 w-3" /> Nursing Station
                            </Badge>
                          )}
                          {isFulfiller ? (
                            <Badge variant="secondary" className="bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 text-[12px] gap-1">
                              <FlaskConical className="h-3 w-3" /> Fulfills Requests
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20 text-[12px] gap-1">
                              <Stethoscope className="h-3 w-3" /> Orders Products
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[12px]">
                            {dept.insurancePolicyMode === 'ALL'
                              ? 'All Insurances'
                              : dept.insurancePolicyMode === 'ONLY'
                              ? `Only ${insuranceCount} Insurances`
                              : dept.insurancePolicyMode === 'EXCEPT'
                              ? `${insuranceCount} Exempted`
                              : 'Policy Default'}
                          </Badge>
                        </div>
                      </div>

                      {/* Footer Info & Enter Workspace */}
                      <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                            {profileCount} {profileCount === 1 ? 'profile' : 'profiles'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                            {dept.insurancePolicyMode === 'ALL' ? 'All' : `${insuranceCount} linked`}
                          </span>
                        </div>
                        <span className="text-primary font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Manage <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW B: DEDICATED FULL-SCREEN DEPARTMENT WORKSPACE                         */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Top Workspace Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToCatalog}
                  className="rounded-full shrink-0 gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" /> All Departments
                </Button>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                      <Building2 className="h-6 w-6 text-primary" />
                      {selectedDepartment.name}
                    </h1>
                    {Boolean(selectedDepartment.nursing) && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-xs gap-1">
                        <HeartPulse className="h-3 w-3" /> Nursing Station Active
                      </Badge>
                    )}
                    {Boolean(selectedDepartment.supportRequests) ? (
                      <Badge className="bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 text-xs gap-1">
                        <FlaskConical className="h-3 w-3" /> Fulfills Support Requests
                      </Badge>
                    ) : (
                      <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20 text-xs gap-1">
                        <Stethoscope className="h-3 w-3" /> Orders Products
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configure settings, insurance policies, service profiles, and clinical forms
                  </p>
                </div>
              </div>
            </div>

            {/* Main Tabs Container */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-muted/60 p-1 rounded-xl h-auto grid grid-cols-2 sm:grid-cols-4 gap-1 w-full max-w-2xl">
                <TabsTrigger
                  value="settings"
                  className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
                <TabsTrigger
                  value="insurances"
                  className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Insurances
                  {(selectedDepartment.insurancePolicies || []).length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-[11px] px-1.5 py-0 h-4">
                      {(selectedDepartment.insurancePolicies || []).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="profiles"
                  className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
                >
                  <Layers className="h-4 w-4" />
                  Profiles
                  {(selectedDepartment.profiles || []).length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-[11px] px-1.5 py-0 h-4">
                      {(selectedDepartment.profiles || []).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="forms"
                  className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
                >
                  <FileText className="h-4 w-4" />
                  Forms
                </TabsTrigger>
              </TabsList>

              {/* ------------------------------------------------------------- */}
              {/* TAB 1: SETTINGS                                               */}
              {/* ------------------------------------------------------------- */}
              <TabsContent value="settings" className="space-y-6">
                <Card className="border-border/70 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">General Department Settings</CardTitle>
                    <CardDescription>
                      Update the department&apos;s name, nursing capabilities, and clinical request workflow mode.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Department Name Input */}
                    <div className="space-y-2 max-w-lg">
                      <label className="text-sm font-semibold text-foreground">Department Name *</label>
                      <Input
                        value={settingsName}
                        onChange={(e) => setSettingsName(e.target.value)}
                        placeholder="e.g. Cardiology, Outpatient Clinic, Central Lab"
                        className="rounded-xl"
                      />
                    </div>

                    {/* Nursing Features Toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border/70 bg-muted/20 p-5 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <HeartPulse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <p className="text-sm font-semibold text-foreground">Nursing Features & Station Queues</p>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                          When enabled, this department gets full nursing features: patient triage queues, vital signs recording (BP, Pulse, SpO2, Temperature), bedside nursing notes, and nurse observation workflow.
                        </p>
                      </div>
                      <Switch
                        checked={settingsNursing}
                        onCheckedChange={setSettingsNursing}
                      />
                    </div>

                    {/* Mutually Exclusive Workflow Role Selector */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Workflow className="h-4 w-4 text-primary" />
                          <p className="text-sm font-semibold text-foreground">Request Workflow Mode</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          A department operates either as a clinical requester (ordering tests/medications) or a service fulfiller (fulfilling orders). Select one role:
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Option 1: Request Products */}
                        <div
                          onClick={() => {
                            setSettingsRequestsProducts(true)
                            setSettingsSupportRequests(false)
                          }}
                          className={cn(
                            "flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2",
                            settingsRequestsProducts && !settingsSupportRequests
                              ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                              : "border-border/70 hover:border-border bg-background"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                              <Stethoscope className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                              Order / Request Products
                            </div>
                            <span className={cn(
                              "size-3 rounded-full border-2",
                              settingsRequestsProducts && !settingsSupportRequests
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/40 bg-transparent"
                            )} />
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Clinical department (e.g. General OPD, Dental, Internal Medicine, Pediatrics) where physicians examine patients and generate orders for lab tests, radiology scans, and medications.
                          </p>
                        </div>

                        {/* Option 2: Fulfill Support Requests */}
                        <div
                          onClick={() => {
                            setSettingsRequestsProducts(false)
                            setSettingsSupportRequests(true)
                          }}
                          className={cn(
                            "flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2",
                            settingsSupportRequests
                              ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                              : "border-border/70 hover:border-border bg-background"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                              <FlaskConical className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              Fulfill Support Requests
                            </div>
                            <span className={cn(
                              "size-3 rounded-full border-2",
                              settingsSupportRequests
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/40 bg-transparent"
                            )} />
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Service department (e.g. Central Clinical Lab, Pharmacy, Diagnostic Imaging / Radiology) that receives, processes, and fulfills incoming diagnostic and dispensing orders.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Save Action */}
                    <div className="pt-4 border-t border-border/60 flex justify-end">
                      <Button
                        onClick={handleSaveSettings}
                        disabled={settingsSaving || !settingsName.trim()}
                        className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md font-medium"
                      >
                        {settingsSaving ? 'Saving…' : 'Save Department Settings'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ------------------------------------------------------------- */}
              {/* TAB 2: INSURANCES                                             */}
              {/* ------------------------------------------------------------- */}
              <TabsContent value="insurances" className="space-y-6">
                <Card className="border-border/70 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Insurance Policies & Coverage Rules
                    </CardTitle>
                    <CardDescription>
                      Configure how patient health insurance policies apply to orders, visits, and services billed under this department.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Policy Mode Selector Cards */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground">Select Insurance Policy Mode</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {/* Mode 1: ALL */}
                        <div
                          onClick={() => !policiesUpdating && handlePolicyModeChange('ALL')}
                          className={cn(
                            "flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2",
                            selectedDepartment.insurancePolicyMode === 'ALL'
                              ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                              : "border-border/70 hover:border-border bg-background"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                              <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              All Insurances Apply
                            </div>
                            <span className={cn(
                              "size-3 rounded-full border-2",
                              selectedDepartment.insurancePolicyMode === 'ALL'
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/40 bg-transparent"
                            )} />
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Every active clinic insurance scheme is accepted for this department automatically with no exceptions.
                          </p>
                        </div>

                        {/* Mode 2: ONLY */}
                        <div
                          onClick={() => !policiesUpdating && handlePolicyModeChange('ONLY')}
                          className={cn(
                            "flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2",
                            selectedDepartment.insurancePolicyMode === 'ONLY'
                              ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                              : "border-border/70 hover:border-border bg-background"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                              <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              Only Selected Insurances
                            </div>
                            <span className={cn(
                              "size-3 rounded-full border-2",
                              selectedDepartment.insurancePolicyMode === 'ONLY'
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/40 bg-transparent"
                            )} />
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Strict whitelist. Only the specific insurance providers explicitly added below are accepted.
                          </p>
                        </div>

                        {/* Mode 3: EXCEPT */}
                        <div
                          onClick={() => !policiesUpdating && handlePolicyModeChange('EXCEPT')}
                          className={cn(
                            "flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2",
                            selectedDepartment.insurancePolicyMode === 'EXCEPT'
                              ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                              : "border-border/70 hover:border-border bg-background"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                              <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              Exempt Selected Insurances
                            </div>
                            <span className={cn(
                              "size-3 rounded-full border-2",
                              selectedDepartment.insurancePolicyMode === 'EXCEPT'
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/40 bg-transparent"
                            )} />
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            All clinic insurances apply EXCEPT the specific insurance providers blacklisted/exempted below.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mode Explanations & Active Policies Management */}
                    {selectedDepartment.insurancePolicyMode === 'ALL' ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                        <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                            Universal Insurance Coverage Enabled
                          </p>
                          <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                            Patients with any valid insurance scheme can receive covered services in this department. To restrict coverage or blacklist specific insurers, select &quot;Only Selected&quot; or &quot;Exempt Selected&quot; above.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-2">
                        {/* Search & Add Insurance Provider */}
                        <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {selectedDepartment.insurancePolicyMode === 'ONLY'
                              ? 'Add Allowed Insurance Provider'
                              : 'Add Exempted Insurance Provider'}
                          </p>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                            <div className="flex-1">
                              <InsuranceAutocomplete
                                insurances={availableInsurances.filter((insurance) =>
                                  !(selectedDepartment.insurancePolicies || []).some(
                                    (existing) => String(existing.id) === String(insurance.id)
                                  )
                                )}
                                selectedInsuranceId={selectedInsuranceId}
                                onInsuranceSelect={(id, insurance) => {
                                  setSelectedInsuranceId(id)
                                  setSelectedInsurance(insurance || null)
                                }}
                                placeholder={insurancesLoading ? 'Loading insurance providers...' : 'Search insurance by name or acronym...'}
                                disabled={insurancesLoading || policiesUpdating}
                                className="w-full"
                                showSelectionChip={false}
                              />
                            </div>
                            <Button
                              onClick={handleAddInsurancePolicy}
                              disabled={!selectedInsuranceId || policiesUpdating}
                              className="rounded-xl shrink-0"
                            >
                              <Plus className="h-4 w-4 mr-1.5" />
                              {policiesUpdating ? 'Updating…' : 'Add Policy'}
                            </Button>
                          </div>
                          {renderInsuranceChip(selectedInsurance, () => {
                            setSelectedInsuranceId('')
                            setSelectedInsurance(null)
                          })}
                        </div>

                        {/* List of Configured Policies */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Configured Policies ({(selectedDepartment.insurancePolicies || []).length})
                            </p>
                          </div>

                          {(selectedDepartment.insurancePolicies || []).length === 0 ? (
                            <div className="text-center py-8 border border-dashed rounded-xl bg-muted/10 space-y-2">
                              <ShieldAlert className="h-8 w-8 text-muted-foreground mx-auto" />
                              <p className="text-sm font-medium">No insurance policies configured</p>
                              <p className="text-xs text-muted-foreground">
                                {selectedDepartment.insurancePolicyMode === 'ONLY'
                                  ? 'No insurances will be accepted until you add at least one allowed policy above.'
                                  : 'No insurances are currently exempted. All clinic insurances will apply.'}
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {(selectedDepartment.insurancePolicies || []).map((insurance) => (
                                <div
                                  key={insurance.id}
                                  className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/30 transition-colors"
                                >
                                  <div className="flex items-center gap-2.5 overflow-hidden">
                                    <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                      {insurance.acronym?.substring(0, 3) || 'INS'}
                                    </div>
                                    <div className="truncate">
                                      <p className="text-sm font-medium text-foreground truncate">
                                        {insurance.insuranceName || insurance.name}
                                      </p>
                                      {insurance.acronym && (
                                        <p className="text-xs text-muted-foreground">{insurance.acronym}</p>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                                    disabled={policiesUpdating}
                                    onClick={() => handleRemoveInsurancePolicy(insurance.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ------------------------------------------------------------- */}
              {/* TAB 3: PROFILES                                               */}
              {/* ------------------------------------------------------------- */}
              <TabsContent value="profiles" className="space-y-6">
                <Card className="border-border/70 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Layers className="h-5 w-5 text-primary" />
                      Department Profiles & Product Packages
                    </CardTitle>
                    <CardDescription>
                      Profiles bundle standard consultations, lab investigations, or diagnostic services together for rapid encounter ordering.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DepartmentProfilesPanel
                      department={selectedDepartment}
                      products={products}
                      onDepartmentUpdate={(updated) => setSelectedDepartment(updated)}
                      refetchDepartments={refetchDepartments}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ------------------------------------------------------------- */}
              {/* TAB 4: FORMS MANAGEMENT                                       */}
              {/* ------------------------------------------------------------- */}
              <TabsContent value="forms" className="space-y-6">
                <Card className="border-border/70 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Department Clinical Forms
                    </CardTitle>
                    <CardDescription>
                      Attach and manage digital medical forms, intake questionnaires, and clinical assessment templates for {selectedDepartment.name}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DepartmentFormsPanel
                      departmentId={String(selectedDepartment.id)}
                      departmentName={selectedDepartment.name}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADD DEPARTMENT MODAL                                                      */}
        {/* ========================================================================= */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden backdrop-blur-2xl bg-card/95 dark:bg-card/95 text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-3 flex flex-col">
            <div className="flex-1 overflow-hidden bg-[#FBF2ED] dark:bg-slate-900 border border-border/40 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">Add New Department</DialogTitle>
                <DialogDescription>
                  Create a new clinical or service department in the hospital system.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto pr-2 space-y-5 my-4 scrollbar-thin">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Department Name *</label>
                  <Input
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    placeholder="e.g. Ophthalmology, Maternity, Biochemistry"
                    className="rounded-xl bg-white dark:bg-slate-950"
                  />
                </div>

                {/* Nursing Capability Switch */}
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white dark:bg-slate-950 p-4 shadow-sm">
                  <div className="pr-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nursing Features</p>
                    <p className="text-sm font-medium text-foreground">Enable nursing station & triage</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Enables triage vital signs recording, queue management, and nursing observation notes.
                    </p>
                  </div>
                  <Switch checked={departmentNursing} onCheckedChange={(v: boolean) => setDepartmentNursing(v)} />
                </div>

                {/* Request Workflow Role (mutually exclusive) */}
                <div className="rounded-xl border border-border/60 bg-white dark:bg-slate-950 p-4 shadow-sm space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Request Workflow Mode</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Choose whether this department initiates patient orders or fulfills incoming service requests.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setDepartmentRequestsProducts(true)
                        setDepartmentSupportRequests(false)
                      }}
                      className={cn(
                        "flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer",
                        departmentRequestsProducts && !departmentSupportRequests
                          ? "border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary shadow-xs"
                          : "border-border/60 hover:border-border bg-background/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">Order / Request Products</span>
                        <span className={cn(
                          "size-2 rounded-full",
                          departmentRequestsProducts && !departmentSupportRequests ? "bg-primary" : "bg-muted-foreground/30"
                        )} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        Clinical unit (e.g. OPD, Consultation) where doctors prescribe and order tests/medications.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDepartmentRequestsProducts(false)
                        setDepartmentSupportRequests(true)
                      }}
                      className={cn(
                        "flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer",
                        departmentSupportRequests
                          ? "border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary shadow-xs"
                          : "border-border/60 hover:border-border bg-background/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">Fulfill Support Requests</span>
                        <span className={cn(
                          "size-2 rounded-full",
                          departmentSupportRequests ? "bg-primary" : "bg-muted-foreground/30"
                        )} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        Service unit (e.g. Laboratory, Pharmacy, Radiology) that fulfills incoming support requests.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Insurance Policy Mode (Optional) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Initial Insurance Policy Mode (Optional)</label>
                  <Select value={departmentInsurancePolicyMode} onValueChange={setDepartmentInsurancePolicyMode}>
                    <SelectTrigger className="rounded-xl bg-white dark:bg-slate-950">
                      <SelectValue placeholder="Default (All insurances apply)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All insurances apply</SelectItem>
                      <SelectItem value="ONLY">Only selected insurances apply</SelectItem>
                      <SelectItem value="EXCEPT">Selected insurances are exempted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Optional Initial Profile */}
                <div className="space-y-3 rounded-xl border border-border/60 bg-white dark:bg-slate-950 p-4 shadow-sm">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Initial Profile (Optional)</label>
                    <p className="text-[12px] text-muted-foreground">
                      Create an initial product package profile for this department.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Profile Name</label>
                    <Input
                      value={departmentProfileName}
                      onChange={(e) => setDepartmentProfileName(e.target.value)}
                      placeholder="Default"
                      className="rounded-xl bg-white dark:bg-slate-950"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <ProductAutocomplete
                      products={modalAvailableProducts}
                      selectedProductId={pendingProductId}
                      onProductSelect={(id, product) => {
                        setPendingProductId(id)
                        setPendingProduct(product || null)
                      }}
                      placeholder={productsLoading ? 'Loading products...' : 'Search products to bundle...'}
                      disabled={productsLoading}
                      className="flex-1"
                    />
                    <Button type="button" size="sm" onClick={handleAddModalProduct} disabled={!pendingProductId}>
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 scrollbar-thin">
                    {departmentProductIds.map((productId) => {
                      const product =
                        pickedProducts[productId] ||
                        products.find((item: Product) => String(item.id) === productId)
                      return (
                        <div key={productId} className="flex items-center justify-between rounded-lg border px-3 py-2 bg-muted/20">
                          <span className="text-sm font-medium">{product?.name || productId}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-full h-7 w-7"
                            onClick={() => handleRemoveModalProduct(productId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                    {departmentProductIds.length === 0 && (
                      <p className="text-xs text-muted-foreground">No initial products added.</p>
                    )}
                  </div>
                </div>

                {/* Optional Initial Insurance Providers */}
                {departmentInsurancePolicyMode && departmentInsurancePolicyMode !== 'ALL' && (
                  <div className="space-y-3 rounded-xl border border-border/60 bg-white dark:bg-slate-950 p-4 shadow-sm">
                    <label className="text-xs font-semibold text-muted-foreground">Initial Insurance Providers</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <InsuranceAutocomplete
                          insurances={modalAvailableInsurances.filter(
                            (insurance) => !departmentInsuranceIds.includes(String(insurance.id))
                          )}
                          selectedInsuranceId={pendingInsuranceId}
                          onInsuranceSelect={(id, insurance) => {
                            setPendingInsuranceId(id)
                            setPendingInsurance(insurance || null)
                          }}
                          placeholder={insurancesLoading ? 'Loading insurances...' : 'Search insurances...'}
                          disabled={insurancesLoading}
                          className="flex-1"
                          showSelectionChip={false}
                        />
                        <Button type="button" size="sm" onClick={handleAddModalInsurance} disabled={!pendingInsuranceId}>
                          Add
                        </Button>
                      </div>
                      {renderInsuranceChip(pendingInsurance, () => {
                        setPendingInsuranceId('')
                        setPendingInsurance(null)
                      })}
                    </div>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 scrollbar-thin">
                      {departmentInsuranceIds.map((insuranceId) => {
                        const insurance =
                          pickedInsurances[insuranceId] ||
                          insurances.find((item: InsuranceProvider) => String(item.id) === insuranceId)
                        return (
                          <div key={insuranceId} className="flex items-center justify-between rounded-lg border px-3 py-2 bg-muted/20">
                            <span className="text-sm font-medium">
                              {insurance?.insuranceName || insurance?.name || insuranceId}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="rounded-full h-7 w-7"
                              onClick={() => handleRemoveModalInsurance(insuranceId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                      {departmentInsuranceIds.length === 0 && (
                        <p className="text-xs text-muted-foreground">No initial insurances selected.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/30 sticky bottom-0 bg-background/95 dark:bg-slate-900/95 -mx-2 px-2 pb-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="rounded-full px-5">
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateDepartment}
                  disabled={creating || !departmentName.trim()}
                  className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md"
                >
                  {creating ? 'Creating…' : 'Create Department'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
