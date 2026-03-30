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
  useActions,
  useConsumables,
  useInsurances,
  useLinkActionToDepartment,
  useUnlinkActionFromDepartment,
  useLinkConsumableToDepartment,
  useUnlinkConsumableFromDepartment,
  useAddExemptedInsuranceToDepartment,
  useRemoveExemptedInsuranceFromDepartment,
} from '@/hooks/auth-hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Plus, Pencil, Trash, X, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function DepartmentsPage() {
  const router = useRouter()
  const { doctor } = useAuth()
  const { toast } = useToast()

  const { departments, loading: departmentsLoading, refetch: refetchDepartments } = useDepartments()
  const { actions, loading: actionsLoading } = useActions()
  const { consumables, loading: consumablesLoading } = useConsumables()
  const { insurances, loading: insurancesLoading } = useInsurances()

  const { createDepartment } = useCreateDepartment()
  const { updateDepartment } = useUpdateDepartment()
  const { deleteDepartment } = useDeleteDepartment()
  const { linkActionToDepartment } = useLinkActionToDepartment()
  const { unlinkActionFromDepartment } = useUnlinkActionFromDepartment()
  const { linkConsumableToDepartment } = useLinkConsumableToDepartment()
  const { unlinkConsumableFromDepartment } = useUnlinkConsumableFromDepartment()
  const { addExemptedInsuranceToDepartment } = useAddExemptedInsuranceToDepartment()
  const { removeExemptedInsuranceFromDepartment } = useRemoveExemptedInsuranceFromDepartment()

  const [selectedDepartment, setSelectedDepartment] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [departmentName, setDepartmentName] = useState('')
  const [saving, setSaving] = useState(false)

  // Linking states
  const [selectedActionId, setSelectedActionId] = useState<string>('')
  const [selectedConsumableId, setSelectedConsumableId] = useState<string>('')
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>('')

  const availableActions = useMemo(() => {
    if (!selectedDepartment) return actions
    const linkedIds = new Set((selectedDepartment.actions || []).map((a: any) => String(a.id)))
    return actions.filter((a: any) => !linkedIds.has(String(a.id)))
  }, [actions, selectedDepartment])

  const availableConsumables = useMemo(() => {
    if (!selectedDepartment) return consumables
    const linkedIds = new Set((selectedDepartment.consumables || []).map((c: any) => String(c.id)))
    return consumables.filter((c: any) => !linkedIds.has(String(c.id)))
  }, [consumables, selectedDepartment])

  const availableInsurances = useMemo(() => {
    if (!selectedDepartment) return insurances
    const linkedIds = new Set((selectedDepartment.exemptedInsurances || []).map((i: any) => String(i.id)))
    return insurances.filter((i: any) => !linkedIds.has(String(i.id)))
  }, [insurances, selectedDepartment])

  const openAddModal = () => {
    setModalMode('add')
    setDepartmentName('')
    setIsModalOpen(true)
  }

  const openEditModal = () => {
    if (!selectedDepartment) return
    setModalMode('edit')
    setDepartmentName(selectedDepartment.name || '')
    setIsModalOpen(true)
  }

  const handleCreateOrUpdate = async () => {
    try {
      setSaving(true)
      if (modalMode === 'add') {
        const created = await createDepartment(departmentName.trim())
        toast({ title: 'Department created', description: created?.name })
        await refetchDepartments()
        setSelectedDepartment(created)
      } else if (selectedDepartment) {
        const updated = await updateDepartment(selectedDepartment.id, departmentName.trim())
        toast({ title: 'Department updated', description: updated?.name })
        setSelectedDepartment(updated)
        await refetchDepartments()
      }
      setIsModalOpen(false)
    } catch (err: any) {
      toast({ title: 'Operation failed', description: err?.message || 'Unexpected error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedDepartment) return
    if (!confirm('Delete this department?')) return
    try {
      setSaving(true)
      const ok = await deleteDepartment(selectedDepartment.id)
      if (ok) {
        toast({ title: 'Department deleted' })
        setSelectedDepartment(null)
        await refetchDepartments()
      } else {
        toast({ title: 'Delete failed', description: 'Please try again.' })
      }
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err?.message || 'Unexpected error' })
    } finally {
      setSaving(false)
    }
  }

  const handleLinkAction = async () => {
    if (!selectedDepartment || !selectedActionId) return
    try {
      const updated = await linkActionToDepartment(selectedDepartment.id, selectedActionId)
      setSelectedDepartment(updated)
      setSelectedActionId('')
      toast({ title: 'Action linked' })
      await refetchDepartments()
    } catch (err: any) {
      toast({ title: 'Link failed', description: err?.message || 'Unexpected error' })
    }
  }

  const handleUnlinkAction = async (actionId: string | number) => {
    if (!selectedDepartment) return
    try {
      const updated = await unlinkActionFromDepartment(selectedDepartment.id, actionId)
      setSelectedDepartment(updated)
      toast({ title: 'Action unlinked' })
      await refetchDepartments()
    } catch (err: any) {
      toast({ title: 'Unlink failed', description: err?.message || 'Unexpected error' })
    }
  }

  const handleLinkConsumable = async () => {
    if (!selectedDepartment || !selectedConsumableId) return
    try {
      const updated = await linkConsumableToDepartment(selectedDepartment.id, selectedConsumableId)
      setSelectedDepartment(updated)
      setSelectedConsumableId('')
      toast({ title: 'Consumable linked' })
      await refetchDepartments()
    } catch (err: any) {
      toast({ title: 'Link failed', description: err?.message || 'Unexpected error' })
    }
  }

  const handleUnlinkConsumable = async (consumableId: string | number) => {
    if (!selectedDepartment) return
    try {
      const updated = await unlinkConsumableFromDepartment(selectedDepartment.id, consumableId)
      setSelectedDepartment(updated)
      toast({ title: 'Consumable unlinked' })
      await refetchDepartments()
    } catch (err: any) {
      toast({ title: 'Unlink failed', description: err?.message || 'Unexpected error' })
    }
  }

  const handleAddExemptedInsurance = async () => {
    if (!selectedDepartment || !selectedInsuranceId) return
    try {
      const updated = await addExemptedInsuranceToDepartment(selectedDepartment.id, selectedInsuranceId)
      setSelectedDepartment(updated)
      setSelectedInsuranceId('')
      toast({ title: 'Exempted insurance added' })
      await refetchDepartments()
    } catch (err: any) {
      toast({ title: 'Operation failed', description: err?.message || 'Unexpected error' })
    }
  }

  const handleRemoveExemptedInsurance = async (insuranceId: string | number) => {
    if (!selectedDepartment) return
    try {
      const updated = await removeExemptedInsuranceFromDepartment(selectedDepartment.id, insuranceId)
      setSelectedDepartment(updated)
      toast({ title: 'Exempted insurance removed' })
      await refetchDepartments()
    } catch (err: any) {
      toast({ title: 'Operation failed', description: err?.message || 'Unexpected error' })
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
            <Button onClick={openAddModal} className="rounded-full" size="sm">
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
              {departments.map((dept: any) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`w-full text-left p-3 rounded-xl border ${selectedDepartment?.id === dept.id ? 'bg-muted' : 'bg-background/60'} hover:bg-muted`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dept.name}</span>
                    <span className="text-xs text-muted-foreground">{(dept.actions?.length || 0) + (dept.consumables?.length || 0)} items linked</span>
                  </div>
                </button>
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
                  <p className="text-xs text-muted-foreground">Manage default actions, consumables & exempted insurances</p>
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

              {/* Actions section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Default Actions</h3>
                  <div className="flex items-center gap-2">
                    <Select value={selectedActionId} onValueChange={setSelectedActionId}>
                      <SelectTrigger className="w-56">
                        <SelectValue placeholder={actionsLoading ? 'Loading...' : 'Select action'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableActions.map((a: any) => (
                          <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
                        ))}
                        {availableActions.length === 0 && (
                          <div className="px-2 py-2 text-xs text-muted-foreground">No actions available</div>
                        )}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleLinkAction} disabled={!selectedActionId}>Add</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {(selectedDepartment.actions || []).map((a: any) => (
                    <div key={a.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <span className="text-sm">{a.name}</span>
                      <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleUnlinkAction(a.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {(selectedDepartment.actions || []).length === 0 && (
                    <p className="text-xs text-muted-foreground">No actions linked.</p>
                  )}
                </div>
              </div>

              {/* Consumables section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Default Consumables</h3>
                  <div className="flex items-center gap-2">
                    <Select value={selectedConsumableId} onValueChange={setSelectedConsumableId}>
                      <SelectTrigger className="w-56">
                        <SelectValue placeholder={consumablesLoading ? 'Loading...' : 'Select consumable'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableConsumables.map((c: any) => (
                          <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                        ))}
                        {availableConsumables.length === 0 && (
                          <div className="px-2 py-2 text-xs text-muted-foreground">No consumables available</div>
                        )}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleLinkConsumable} disabled={!selectedConsumableId}>Add</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {(selectedDepartment.consumables || []).map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <span className="text-sm">{c.name}</span>
                      <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleUnlinkConsumable(c.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {(selectedDepartment.consumables || []).length === 0 && (
                    <p className="text-xs text-muted-foreground">No consumables linked.</p>
                  )}
                </div>
              </div>

              {/* Exempted insurances section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Exempted Insurances</h3>
                  <div className="flex items-center gap-2">
                    <Select value={selectedInsuranceId} onValueChange={setSelectedInsuranceId}>
                      <SelectTrigger className="w-56">
                        <SelectValue placeholder={insurancesLoading ? 'Loading...' : 'Select insurance'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableInsurances.map((i: any) => (
                          <SelectItem key={i.id} value={String(i.id)}>{i.name}</SelectItem>
                        ))}
                        {availableInsurances.length === 0 && (
                          <div className="px-2 py-2 text-xs text-muted-foreground">No insurances available</div>
                        )}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleAddExemptedInsurance} disabled={!selectedInsuranceId}>Add</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {(selectedDepartment.exemptedInsurances || []).map((i: any) => (
                    <div key={i.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <span className="text-sm">{i.name} <span className="text-xs text-muted-foreground">({i.acronym})</span></span>
                      <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleRemoveExemptedInsurance(i.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {(selectedDepartment.exemptedInsurances || []).length === 0 && (
                    <p className="text-xs text-muted-foreground">No exempted insurances.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Add/Edit modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalMode === 'add' ? 'Add Department' : 'Edit Department'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <label className="text-sm">Name</label>
            <Input value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} placeholder="Department name" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={handleCreateOrUpdate} disabled={saving || !departmentName.trim()} className="rounded-full">
              {modalMode === 'add' ? 'Create' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      </main>
    </div>
  )
}
