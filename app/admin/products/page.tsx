"use client"

import React, { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { 
  useProductsPaginated, 
  useInsurances, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct, 
  useAddProductInsuranceCoverage, 
  useRemoveProductInsuranceCoverage 
} from "@/hooks/auth-hooks"
import { Pencil, Trash2, ArrowLeft, Plus, X, Shield, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "react-toastify"

const PRODUCT_TYPE_OPTIONS = ["DRUG", "MEDICAL_ACT", "BIOLOGICAL_ACT", "CONSUMABLE_DEVICE"] as const
type ProductTypeOption = typeof PRODUCT_TYPE_OPTIONS[number]

export default function ManageProductsPage() {
  const router = useRouter()
  const { doctor } = useAuth()
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [searchName, setSearchName] = useState("")
  const [filterType, setFilterType] = useState<string>("ALL")
  
  // Query hook
  const { 
    products, 
    loading: productsLoading, 
    error: productsError, 
    hasMore, 
    loadMore, 
    refresh 
  } = useProductsPaginated({
    name: searchName || undefined,
    type: filterType !== "ALL" ? (filterType as any) : undefined,
    size: 30
  })

  const { insurances, loading: insurancesLoading } = useInsurances()
  
  const { createProduct } = useCreateProduct()
  const { updateProduct } = useUpdateProduct()
  const { deleteProduct } = useDeleteProduct()
  const { addCoverage } = useAddProductInsuranceCoverage()
  const { removeCoverage } = useRemoveProductInsuranceCoverage()
  
  const [saving, setSaving] = useState(false)
  
  // Selected item for detail view
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  
  // Add/Edit modal state
  const [addEditModalOpen, setAddEditModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [itemName, setItemName] = useState("")
  const [itemDescription, setItemDescription] = useState("")
  const [itemType, setItemType] = useState<ProductTypeOption>("MEDICAL_ACT")
  const [itemPrice, setItemPrice] = useState("")
  const [itemClinicPrice, setItemClinicPrice] = useState("")
  const [itemQuantifiable, setItemQuantifiable] = useState(true)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  
  // Insurance coverage state for detail panel
  const [newCoverageInsuranceId, setNewCoverageInsuranceId] = useState("")
  const [newCoveragePrice, setNewCoveragePrice] = useState("")

  const resetItemForm = () => {
    setItemName("")
    setItemDescription("")
    setItemType("MEDICAL_ACT")
    setItemPrice("")
    setItemClinicPrice("")
    setItemQuantifiable(true)
    setEditingItemId(null)
  }

  const openAddModal = () => {
    resetItemForm()
    setModalMode("add")
    setAddEditModalOpen(true)
  }

  const openEditModal = (item: any) => {
    const incomingType = String(item.type || "").toUpperCase() as ProductTypeOption

    setEditingItemId(item.id)
    setItemName(item.name)
    setItemDescription(item.description || "")
    setItemType(PRODUCT_TYPE_OPTIONS.includes(incomingType) ? incomingType : "MEDICAL_ACT")
    setItemPrice(String(item.privatePrice))
    setItemClinicPrice(item.clinicPrice ? String(item.clinicPrice) : "")
    setItemQuantifiable(item.quantifiable)
    setModalMode("edit")
    setAddEditModalOpen(true)
  }

  const handleCreateItem = async () => {
    if (!itemName || !itemType || !itemPrice) {
      toast.warn("Please fill in all required fields.")
      return
    }
    setSaving(true)
    try {
      const createdResp = await createProduct({
        name: itemName,
        code: itemName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || `product-${Date.now()}`,
        description: itemDescription || itemName,
        type: itemType,
        unit: 'PCS',
        privateRhicPrice: Number(itemPrice),
        clinicPrice: itemClinicPrice ? Number(itemClinicPrice) : undefined,
        insuranceCoverages: [],
      })
      await refresh()
      if (createdResp?.status === 'SUCCESS') {
        toast.success(createdResp.message || 'Product created successfully!')
        resetItemForm()
        setAddEditModalOpen(false)
        if (createdResp.data) setSelectedItem(createdResp.data)
      } else {
        toast.error(createdResp?.message || 'Failed to create product')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateItem = async () => {
    if (!editingItemId || !itemName || !itemType || !itemPrice) {
      toast.warn("Please fill in all required fields.")
      return
    }
    setSaving(true)
    try {
      const updatedResp = await updateProduct(editingItemId, {
        name: itemName,
        code: itemName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || `product-${editingItemId}`,
        description: itemDescription || itemName,
        type: itemType,
        unit: 'PCS',
        privateRhicPrice: Number(itemPrice),
        clinicPrice: itemClinicPrice ? Number(itemClinicPrice) : undefined,
      })
      await refresh()
      if (updatedResp?.status === 'SUCCESS') {
        toast.success(updatedResp.message || 'Product updated successfully!')
      } else {
        toast.error(updatedResp?.message || 'Failed to update product')
      }
      
      // Update selected item in view immediately
      if (selectedItem && selectedItem.id === editingItemId) {
        const updatedData = updatedResp?.data
        setSelectedItem({
          ...selectedItem,
          ...(updatedData || {}),
          name: itemName,
          description: itemDescription,
          type: itemType,
          privatePrice: Number(itemPrice),
          clinicPrice: itemClinicPrice ? Number(itemClinicPrice) : undefined,
        })
      }
      
      resetItemForm()
      setAddEditModalOpen(false)
    } catch (err) {
      toast.error('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    setSaving(true)
    try {
      const resp = await deleteProduct(id)
      await refresh()
      if (resp?.status === 'SUCCESS') {
        toast.success(resp.message || 'Product deleted successfully!')
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem(null)
        }
      } else {
        toast.error(resp?.message || 'Failed to delete product')
      }
    } catch (err) {
      toast.error('Failed to delete product')
    } finally {
      setSaving(false)
    }
  }

  const handleSearch = () => {
    setSearchName(searchQuery)
    setSelectedItem(null)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchName("")
    setSelectedItem(null)
  }

  const handleTypeFilterChange = (type: string) => {
    setFilterType(type)
    setSelectedItem(null)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 80) {
      if (hasMore && !productsLoading && !saving) {
        loadMore()
      }
    }
  }

  const handleAddCoverage = async () => {
    if (!selectedItem || !newCoverageInsuranceId || !newCoveragePrice) {
      toast.warn("Please select insurance and enter price")
      return
    }
    setSaving(true)
    try {
      const resultResp = await addCoverage(selectedItem.id, newCoverageInsuranceId, Number(newCoveragePrice))
      await refresh()
      if (resultResp?.status === 'SUCCESS') {
        toast.success(resultResp.message || 'Insurance coverage added successfully!')
        setNewCoverageInsuranceId("")
        setNewCoveragePrice("")
        if (resultResp.data) setSelectedItem(resultResp.data)
      } else {
        toast.error(resultResp?.message || 'Failed to add coverage')
      }
    } catch (err) {
      toast.error('Failed to add coverage')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveCoverage = async (insuranceId: string) => {
    if (!selectedItem) return
    setSaving(true)
    try {
      const targetCov = selectedItem.insuranceCoverages?.find((cov: any) => String(cov.insuranceProvider?.id || cov.insurance?.id) === String(insuranceId))
      if (!targetCov) {
        toast.error("Coverage not found")
        return
      }
      const resp = await removeCoverage(targetCov.id)
      await refresh()
      if (resp?.status === 'SUCCESS') {
        toast.success(resp.message || 'Insurance coverage removed successfully!')

        // Update local selection
        setSelectedItem({
          ...selectedItem,
          insuranceCoverages: (selectedItem.insuranceCoverages || []).filter((cov: any) => String(cov.insuranceProvider?.id || cov.insurance?.id) !== String(insuranceId))
        })
      } else {
        toast.error(resp?.message || 'Failed to remove coverage')
      }
    } catch (err) {
      toast.error('Failed to remove coverage')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Title Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => router.push('/admin')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manage Products</h1>
              <p className="text-muted-foreground">Create, edit, and manage products and insurance coverages.</p>
            </div>
          </div>
          <Button
            onClick={openAddModal}
            disabled={saving}
            className="rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch()
              }}
              className="flex-1 rounded-xl"
            />
            {searchQuery && (
              <Button variant="outline" onClick={handleClearSearch} className="rounded-xl">
                Clear
              </Button>
            )}
            <Button onClick={handleSearch} className="rounded-xl">
              Search
            </Button>
          </div>
          
          <div className="w-full md:w-64">
            <Select value={filterType} onValueChange={handleTypeFilterChange}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {PRODUCT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Two-column Layout */}
        <div className={`grid grid-cols-1 ${selectedItem ? "lg:grid-cols-2" : ""} gap-6`}>
          
          {/* Left Column - Infinite Scroll List */}
          <section className="bg-card/70 dark:bg-slate-900/70 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col min-h-[500px]">
            <p className="text-sm font-semibold text-foreground mb-4">
              Products List
            </p>

            {productsError && (
              <p className="text-destructive text-sm py-4">
                {productsError}
              </p>
            )}

            <div 
              onScroll={handleScroll}
              className="flex-1 space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 scrollbar-thin"
            >
              {products.map((item: any) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between bg-card/60 dark:bg-slate-900/60 border rounded-xl px-4 py-3 cursor-pointer transition-all hover:border-primary ${
                    selectedItem?.id === item.id ? 'border-primary bg-primary/10' : 'border-border/40 dark:border-slate-800'
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.type} • {item.privatePrice} RWF</p>
                    {item.insuranceCoverages && item.insuranceCoverages.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Shield className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-blue-500">{item.insuranceCoverages.length} coverage(s)</span>
                      </div>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteItem(item.id)
                    }}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}

              {productsLoading && products.length === 0 && (
                <div className="space-y-2 pt-2">
                  {[...Array(5)].map((_, idx) => (
                    <Skeleton key={idx} className="h-16 w-full rounded-xl animate-pulse" />
                  ))}
                </div>
              )}

              {productsLoading && products.length > 0 && (
                <div className="py-4 flex justify-center items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></span>
                </div>
              )}

              {!productsLoading && products.length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-10">No products found.</p>
              )}

              {!hasMore && products.length > 0 && (
                <p className="text-xs text-center text-muted-foreground py-4 border-t border-border/20 mt-4">
                  All products loaded.
                </p>
              )}
            </div>
          </section>

          {/* Right Column - Product details */}
          {selectedItem && (
            <section className="bg-card/40 dark:bg-slate-900/40 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-6 shadow-lg min-h-[500px]">
              <div className="space-y-6">
                
                {/* Details Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-foreground">{selectedItem.name}</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full"
                          onClick={() => openEditModal(selectedItem)}
                          disabled={saving}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleDeleteItem(selectedItem.id)}
                          disabled={saving}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground bg-muted/20 dark:bg-slate-800/10 p-4 rounded-xl border border-border/20">
                      <p><strong>Code:</strong> {selectedItem.code}</p>
                      <p><strong>Type:</strong> {selectedItem.type}</p>
                      <p><strong>Private Price:</strong> {selectedItem.privatePrice} RWF</p>
                      {selectedItem.clinicPrice && (
                        <p><strong>Clinic Price:</strong> {selectedItem.clinicPrice} RWF</p>
                      )}
                      <p><strong>Quantifiable:</strong> {selectedItem.quantifiable ? 'Yes' : 'No'}</p>
                      {selectedItem.description && (
                        <p><strong>Description:</strong> {selectedItem.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Insurance Coverages */}
                <div className="border-t border-border/50 pt-6">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    Insurance Coverages
                  </h4>

                  {selectedItem.insuranceCoverages && selectedItem.insuranceCoverages.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {selectedItem.insuranceCoverages.map((coverage: any) => {
                        const provider = coverage.insuranceProvider || coverage.insurance
                        return (
                          <div
                            key={coverage.id}
                            className="flex items-center justify-between bg-muted/30 dark:bg-slate-800/30 rounded-xl px-3 py-2 border border-border/10"
                          >
                            <div>
                              <p className="font-semibold text-sm">{provider?.insuranceName || provider?.name} ({provider?.acronym})</p>
                              <p className="text-xs text-muted-foreground">
                                Cost: {coverage.cost || coverage.price || 0} RWF • Coverage: {provider?.defaultCoveragePercentage || provider?.coveragePercentage}%
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full hover:bg-destructive/10"
                              onClick={() => handleRemoveCoverage(provider?.id)}
                              disabled={saving}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-4">No insurance coverages set up yet.</p>
                  )}

                  {/* Add New Coverage Form */}
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-xs font-semibold mb-3 text-foreground">Add New Coverage</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label className="text-xs">Insurance</Label>
                        <Select value={newCoverageInsuranceId} onValueChange={setNewCoverageInsuranceId}>
                          <SelectTrigger className="h-9 rounded-xl">
                            <SelectValue placeholder="Select insurance" />
                          </SelectTrigger>
                          <SelectContent>
                            {insurancesLoading ? (
                              <SelectItem value="loading" disabled>Loading...</SelectItem>
                            ) : insurances.filter((ins: any) => 
                              !selectedItem.insuranceCoverages?.some((cov: any) => {
                                const providerId = cov.insuranceProvider?.id || cov.insurance?.id
                                return String(providerId) === String(ins.id)
                              })
                            ).map((insurance: any) => (
                              <SelectItem key={insurance.id} value={insurance.id.toString()}>
                                {insurance.name} ({insurance.acronym})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Price (RWF)</Label>
                        <Input
                          type="number"
                          placeholder="Enter price"
                          value={newCoveragePrice}
                          onChange={(e) => setNewCoveragePrice(e.target.value)}
                          className="h-9 rounded-xl"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleAddCoverage}
                      disabled={saving || !newCoverageInsuranceId || !newCoveragePrice}
                      size="sm"
                      className="w-full rounded-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Coverage
                    </Button>
                  </div>
                </div>

              </div>
            </section>
          )}
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

        {/* Add/Edit Modal */}
        <Dialog open={addEditModalOpen} onOpenChange={setAddEditModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-black/25 border border-white/20 rounded-3xl shadow-2xl p-3 flex flex-col">
            <div className="flex-1 overflow-hidden bg-[#FBF2ED] dark:bg-slate-900 border border-border/40 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {modalMode === "add" ? "Create Product" : "Edit Product"}
                </DialogTitle>
                <DialogDescription>
                  Fill in the details below to {modalMode === "add" ? "create a new" : "update the"} product.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 my-4 scrollbar-thin">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Name *</Label>
                  <Input placeholder="Product Name" value={itemName} onChange={(e) => setItemName(e.target.value)} className="rounded-xl bg-white dark:bg-slate-950" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Description (Optional)</Label>
                  <Input placeholder="Description" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} className="rounded-xl bg-white dark:bg-slate-950" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Product Type *</Label>
                  <Select value={itemType} onValueChange={(value) => setItemType(value as ProductTypeOption)}>
                    <SelectTrigger className="rounded-xl bg-white dark:bg-slate-950">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_TYPE_OPTIONS.map((typeOption) => (
                        <SelectItem key={typeOption} value={typeOption}>
                          {typeOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Private Price (RWF) *</Label>
                  <Input placeholder="Private Price" type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} className="rounded-xl bg-white dark:bg-slate-950" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Clinic Price (RWF) (Optional)</Label>
                  <Input placeholder="Clinic Price" type="number" value={itemClinicPrice} onChange={(e) => setItemClinicPrice(e.target.value)} className="rounded-xl bg-white dark:bg-slate-950" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="quantifiable-modal"
                    checked={itemQuantifiable}
                    onCheckedChange={(checked) => setItemQuantifiable(!!checked)}
                  />
                  <Label htmlFor="quantifiable-modal" className="text-sm font-semibold text-foreground cursor-pointer select-none">Quantifiable</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/30 sticky bottom-0 bg-background/95 dark:bg-slate-900/95 -mx-2 px-2 pb-2">
                <Button variant="outline" onClick={() => setAddEditModalOpen(false)} disabled={saving} className="rounded-full px-5">
                  Cancel
                </Button>
                <Button onClick={modalMode === "add" ? handleCreateItem : handleUpdateItem} disabled={saving} className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md">
                  {saving ? "Saving..." : modalMode === "add" ? "Create Product" : "Update Product"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
