"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useActions, useConsumables, useInsurances, useCreateActions, useUpdateAction, useDeleteAction, useCreateConsumables, useUpdateConsumable, useDeleteConsumable, useAddActionInsuranceCoverage, useRemoveActionInsuranceCoverage, useAddConsumableInsuranceCoverage, useRemoveConsumableInsuranceCoverage } from "@/hooks/auth-hooks"
import { Pencil, Trash2, ArrowLeft, Plus, X, Shield } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "react-toastify"

export default function ManageActionsConsumablesPage() {
  const router = useRouter()
  const { doctor } = useAuth()
  const { actions, loading: actionsLoading, error: actionsError, refetch: refetchActions } = useActions()
  const { consumables, loading: consumablesLoading, error: consumablesError, refetch: refetchConsumables } = useConsumables()
  const { insurances, loading: insurancesLoading } = useInsurances()
  
  const { createActions } = useCreateActions()
  const { updateAction } = useUpdateAction()
  const { deleteAction } = useDeleteAction()
  const { createConsumables } = useCreateConsumables()
  const { updateConsumable } = useUpdateConsumable()
  const { deleteConsumable } = useDeleteConsumable()
  const { addCoverage: addActionCoverage } = useAddActionInsuranceCoverage()
  const { removeCoverage: removeActionCoverage } = useRemoveActionInsuranceCoverage()
  const { addCoverage: addConsumableCoverage } = useAddConsumableInsuranceCoverage()
  const { removeCoverage: removeConsumableCoverage } = useRemoveConsumableInsuranceCoverage()
  
  const [itemMode, setItemMode] = useState<"action" | "consumable">("action")
  const [saving, setSaving] = useState(false)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  
  // Selected item for detail view
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [selectedItemMode, setSelectedItemMode] = useState<"action" | "consumable">("action")
  
  // Add/Edit modal state
  const [addEditModalOpen, setAddEditModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [itemName, setItemName] = useState("")
  const [itemType, setItemType] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [itemClinicPrice, setItemClinicPrice] = useState("")
  const [itemQuantifiable, setItemQuantifiable] = useState(true)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  
  // Insurance coverage state for detail panel
  const [newCoverageInsuranceId, setNewCoverageInsuranceId] = useState("")
  const [newCoveragePrice, setNewCoveragePrice] = useState("")

  const resetItemForm = () => {
    setItemName("")
    setItemType("")
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

  const openEditModal = (item: any, mode: "action" | "consumable") => {
    setEditingItemId(item.id)
    setItemName(item.name)
    setItemType(item.type)
    setItemPrice(String(item.privatePrice))
    setItemClinicPrice(item.clinicPrice ? String(item.clinicPrice) : "")
    setItemQuantifiable(item.quantifiable)
    setItemMode(mode)
    setModalMode("edit")
    setAddEditModalOpen(true)
  }

  const handleCreateItem = async () => {
    if (!itemName || !itemType || !itemPrice) return
    setSaving(true)
    try {
      if (itemMode === "action") {
        await createActions([{
          name: itemName,
          type: itemType,
          privatePrice: Number(itemPrice),
          clinicPrice: itemClinicPrice ? Number(itemClinicPrice) : undefined,
          quantifiable: itemQuantifiable
        }])
        await refetchActions()
        toast.success("Action created successfully!")
      } else {
        await createConsumables([{
          name: itemName,
          type: itemType,
          privatePrice: Number(itemPrice),
          clinicPrice: itemClinicPrice ? Number(itemClinicPrice) : undefined,
          quantifiable: itemQuantifiable
        }])
        await refetchConsumables()
        toast.success("Consumable created successfully!")
      }
      resetItemForm()
      setAddEditModalOpen(false)
    } catch (err) {
      toast.error('Failed to create item')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateItem = async () => {
    if (!editingItemId || !itemName || !itemType || !itemPrice) return
    setSaving(true)
    try {
      if (itemMode === "action") {
        await updateAction(editingItemId, {
          name: itemName,
          type: itemType,
          privatePrice: Number(itemPrice),
          clinicPrice: itemClinicPrice ? Number(itemClinicPrice) : undefined,
          quantifiable: itemQuantifiable
        })
        await refetchActions()
        toast.success("Action updated successfully!")
      } else {
        await updateConsumable(editingItemId, {
          name: itemName,
          type: itemType,
          privatePrice: Number(itemPrice),
          clinicPrice: itemClinicPrice ? Number(itemClinicPrice) : undefined,
          quantifiable: itemQuantifiable
        })
        await refetchConsumables()
        toast.success("Consumable updated successfully!")
      }
      
      // Update selected item if it's the one being edited
      if (selectedItem && selectedItem.id === editingItemId) {
        const updatedItem = itemMode === "action"
          ? actions.find((a: any) => a.id === editingItemId)
          : consumables.find((c: any) => c.id === editingItemId)
        if (updatedItem) {
          setSelectedItem(updatedItem)
        }
      }
      
      resetItemForm()
      setAddEditModalOpen(false)
    } catch (err) {
      toast.error('Failed to update item')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (id: string, mode: "action" | "consumable") => {
    if (!confirm("Are you sure you want to delete this item?")) return
    setSaving(true)
    try {
      if (mode === "action") {
        await deleteAction(id)
        await refetchActions()
        toast.success("Action deleted successfully!")
      } else {
        await deleteConsumable(id)
        await refetchConsumables()
        toast.success("Consumable deleted successfully!")
      }
      
      // Clear selected item if it's the one being deleted
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null)
      }
    } catch (err) {
      toast.error('Failed to delete item')
    } finally {
      setSaving(false)
    }
  }

  const handleSelectItem = (item: any, mode: "action" | "consumable") => {
    setSelectedItem(item)
    setSelectedItemMode(mode)
    setNewCoverageInsuranceId("")
    setNewCoveragePrice("")
  }

  const handleSearch = async () => {
    if (itemMode === "action") {
      await refetchActions(searchQuery || undefined, 0, 100)
    } else {
      await refetchConsumables(searchQuery || undefined, 0, 100)
    }
  }

  const handleClearSearch = async () => {
    setSearchQuery("")
    if (itemMode === "action") {
      await refetchActions(undefined, 0, 100)
    } else {
      await refetchConsumables(undefined, 0, 100)
    }
  }

  // Also clear search when switching modes
  const handleModeSwitch = async (mode: "action" | "consumable") => {
    setItemMode(mode)
    setSelectedItem(null)
    setSearchQuery("")
    // Refresh the list for the new mode
    if (mode === "action") {
      await refetchActions(undefined, 0, 100)
    } else {
      await refetchConsumables(undefined, 0, 100)
    }
  }

  const handleAddCoverage = async () => {
    if (!selectedItem || !newCoverageInsuranceId || !newCoveragePrice) {
      toast.error("Please select insurance and enter price")
      return
    }
    setSaving(true)
    try {
      let result
      if (selectedItemMode === "action") {
        result = await addActionCoverage(selectedItem.id, newCoverageInsuranceId, Number(newCoveragePrice))
        await refetchActions()
      } else {
        result = await addConsumableCoverage(selectedItem.id, newCoverageInsuranceId, Number(newCoveragePrice))
        await refetchConsumables()
      }
      toast.success("Insurance coverage added successfully!")
      setNewCoverageInsuranceId("")
      setNewCoveragePrice("")
      
      // Update the selected item immediately with the result from mutation
      if (result?.status === 'SUCCESS' && result?.data) {
        setSelectedItem(result.data)
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
      let result
      if (selectedItemMode === "action") {
        result = await removeActionCoverage(selectedItem.id, insuranceId)
        await refetchActions()
      } else {
        result = await removeConsumableCoverage(selectedItem.id, insuranceId)
        await refetchConsumables()
      }
      toast.success("Insurance coverage removed successfully!")
      
      // Update the selected item immediately with the result from mutation
      if (result?.status === 'SUCCESS' && result?.data) {
        setSelectedItem(result.data)
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
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => router.push('/admin')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Actions & Consumables</h1>
            <p className="text-muted-foreground">Create, edit, and manage actions, consumables & insurance coverages.</p>
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant={itemMode === "action" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => handleModeSwitch("action")}
          >
            Actions
          </Button>
          <Button
            variant={itemMode === "consumable" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => handleModeSwitch("consumable")}
          >
            Consumables
          </Button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - List */}
          <section className="bg-card/70 dark:bg-slate-900/70 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                {itemMode === "action" ? "Actions" : "Consumables"} List
              </p>
              <Button
                onClick={openAddModal}
                disabled={saving}
                className="rounded-full"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {itemMode === "action" ? "Action" : "Consumable"}
              </Button>
            </div>

            {/* Search input */}
            <div className="flex gap-2">
              <Input
                placeholder={`Search ${itemMode === "action" ? "actions" : "consumables"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch()
                }}
                className="flex-1"
              />
              {searchQuery && (
                <Button variant="outline" onClick={handleClearSearch} size="sm">
                  Clear
                </Button>
              )}
              <Button onClick={handleSearch} size="sm">
                Search
              </Button>
            </div>

            {/* Actions list */}
            {itemMode === "action" && (
              <>
                {actionsLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, idx) => (
                      <Skeleton key={idx} className="h-16 w-full rounded-xl" />
                    ))}
                  </div>
                ) : actionsError ? (
                  <p className="text-destructive text-sm">
                    {typeof actionsError === 'string' ? actionsError : 'Failed to load actions'}
                  </p>
                ) : actions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No actions yet.</p>
                ) : (
                  <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {actions.map((act: any) => (
                      <div
                        key={act.id}
                        className={`flex items-center justify-between bg-card/60 dark:bg-slate-900/60 border rounded-xl px-4 py-3 cursor-pointer transition-all hover:border-primary ${
                          selectedItem?.id === act.id ? 'border-primary bg-primary/10' : 'border-border/40 dark:border-slate-800'
                        }`}
                        onClick={() => handleSelectItem(act, "action")}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{act.name}</p>
                          <p className="text-xs text-muted-foreground">{act.type} • {act.privatePrice} RWF</p>
                          {act.insuranceCoverages && act.insuranceCoverages.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Shield className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-blue-500">{act.insuranceCoverages.length} coverage(s)</span>
                            </div>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteItem(act.id, "action")
                          }}
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Consumables list */}
            {itemMode === "consumable" && (
              <>
                {consumablesLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, idx) => (
                      <Skeleton key={idx} className="h-16 w-full rounded-xl" />
                    ))}
                  </div>
                ) : consumablesError ? (
                  <p className="text-destructive text-sm">
                    {typeof consumablesError === 'string' ? consumablesError : 'Failed to load consumables'}
                  </p>
                ) : consumables.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No consumables yet.</p>
                ) : (
                  <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {consumables.map((cons: any) => (
                      <div
                        key={cons.id}
                        className={`flex items-center justify-between bg-card/60 dark:bg-slate-900/60 border rounded-xl px-4 py-3 cursor-pointer transition-all hover:border-primary ${
                          selectedItem?.id === cons.id ? 'border-primary bg-primary/10' : 'border-border/40 dark:border-slate-800'
                        }`}
                        onClick={() => handleSelectItem(cons, "consumable")}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{cons.name}</p>
                          <p className="text-xs text-muted-foreground">{cons.type} • {cons.privatePrice} RWF</p>
                          {cons.insuranceCoverages && cons.insuranceCoverages.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Shield className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-blue-500">{cons.insuranceCoverages.length} coverage(s)</span>
                            </div>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteItem(cons.id, "consumable")
                          }}
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          {/* Right column - Details */}
          <section className="bg-card/40 dark:bg-slate-900/40 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-6 shadow-lg">
            {selectedItem ? (
              <div className="space-y-6">
                {/* Item details header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{selectedItem.name}</h3>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7 rounded-full"
                        onClick={() => openEditModal(selectedItem, selectedItemMode)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Type:</strong> {selectedItem.type}</p>
                      <p><strong>Private Price:</strong> {selectedItem.privatePrice} RWF</p>
                      <p><strong>Quantifiable:</strong> {selectedItem.quantifiable ? 'Yes' : 'No'}</p>
                      {selectedItem.clinicPrice && (
                        <p><strong>Clinic Price:</strong> {selectedItem.clinicPrice} RWF</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-6">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Insurance Coverages
                  </h4>

                  {/* Existing coverages */}
                  {selectedItem.insuranceCoverages && selectedItem.insuranceCoverages.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {selectedItem.insuranceCoverages.map((coverage: any) => (
                        <div
                          key={coverage.id}
                          className="flex items-center justify-between bg-muted/30 dark:bg-slate-800/30 rounded-lg px-3 py-2"
                        >
                          <div>
                            <p className="font-medium text-sm">{coverage.insurance.name} ({coverage.insurance.acronym})</p>
                            <p className="text-xs text-muted-foreground">
                              Price: {coverage.price} RWF • Coverage: {coverage.insurance.coveragePercentage}%
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handleRemoveCoverage(coverage.insurance.id)}
                            disabled={saving}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-4">No insurance coverages yet</p>
                  )}

                  {/* Add new coverage */}
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-xs font-medium mb-3 text-foreground">Add New Coverage</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label className="text-xs">Insurance</Label>
                        <Select value={newCoverageInsuranceId} onValueChange={setNewCoverageInsuranceId}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select insurance" />
                          </SelectTrigger>
                          <SelectContent>
                            {insurancesLoading ? (
                              <SelectItem value="loading" disabled>Loading...</SelectItem>
                            ) : insurances.filter((ins: any) => 
                              !selectedItem.insuranceCoverages?.some((cov: any) => cov.insurance.id === ins.id.toString())
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
                          className="h-9"
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
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select an item to view details and manage insurance coverages</p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Add/Edit Modal */}
        <Dialog open={addEditModalOpen} onOpenChange={setAddEditModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {modalMode === "add" ? "Add" : "Edit"} {itemMode === "action" ? "Action" : "Consumable"}
              </DialogTitle>
              <DialogDescription>
                {modalMode === "add" ? "Create a new" : "Update the"} {itemMode === "action" ? "action" : "consumable"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input placeholder="Name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
              </div>
              <div>
                <Label>Type</Label>
                <Input placeholder="Type (e.g., Surgery, Diagnostic)" value={itemType} onChange={(e) => setItemType(e.target.value)} />
              </div>
              <div>
                <Label>Private Price (RWF)</Label>
                <Input placeholder="Private Price" type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
              </div>
              <div>
                <Label>Clinic Price (RWF) <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <Input placeholder="Clinic Price" type="number" value={itemClinicPrice} onChange={(e) => setItemClinicPrice(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="quantifiable-modal"
                  checked={itemQuantifiable}
                  onCheckedChange={(checked) => setItemQuantifiable(!!checked)}
                />
                <Label htmlFor="quantifiable-modal" className="text-sm cursor-pointer">Quantifiable</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAddEditModalOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={modalMode === "add" ? handleCreateItem : handleUpdateItem} disabled={saving}>
                {saving ? "Saving..." : modalMode === "add" ? "Create" : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
