"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Activity, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "react-toastify"
import { useAuth } from "@/lib/auth-context"
import Header from "@/components/header"
import InlineTryAgain from "@/components/inline-try-again"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { handleResponse } from "@/lib/response-handler"
import { useAddVisitVitalSigns, useVisit, useDepartments, useAddDepartmentToVisit, normalizeVisitVitalSigns } from "@/hooks/auth-hooks"
import { AddDepartmentModal } from "@/components/add-department-modal"

interface VitalRow {
  id: string
  measurementName: string
  value: string
  unit: string
  isPreset?: boolean
}

const defaultRows = (): VitalRow[] => [
  { id: "preset-bp", measurementName: "Blood Pressure", value: "", unit: "mmHg", isPreset: true },
  { id: "preset-hr", measurementName: "Heart Rate", value: "", unit: "bpm", isPreset: true },
  { id: "preset-temp", measurementName: "Temperature", value: "", unit: "°C", isPreset: true },
  { id: "preset-spo2", measurementName: "Oxygen Saturation", value: "", unit: "%", isPreset: true },
  { id: "preset-weight", measurementName: "Weight", value: "", unit: "kg", isPreset: true },
  { id: "preset-height", measurementName: "Height", value: "", unit: "cm", isPreset: true },
]

const createRow = (): VitalRow => ({
  id: `vital-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  measurementName: "",
  value: "",
  unit: "",
  isPreset: false,
})

export default function TriagePage() {
  const router = useRouter()
  const params = useParams()
  const visitId = params.visitId as string
  const { doctor } = useAuth()
  const { visit, loading, error, refetch } = useVisit(visitId)
  const { addVisitVitalSigns, loading: savingVitals } = useAddVisitVitalSigns()
  const { departments } = useDepartments()
  const { addDepartmentToVisit } = useAddDepartmentToVisit()

  const roles = (useAuth()?.doctor?.roles) || []
  const isNurse = roles.includes("NURSE")

  const [rows, setRows] = useState<VitalRow[]>(defaultRows)
  const [modalOpen, setModalOpen] = useState(false)
  const [addDeptOpen, setAddDeptOpen] = useState(false)
  const [vitalIndex, setVitalIndex] = useState(0)

  useEffect(() => {
    if (!loading && !visit && !error) router.push("/")
  }, [loading, visit, error, router])

  const patientName = visit ? `${visit.patient.firstName} ${visit.patient.lastName || ""}`.trim() : "Unknown patient"

  const getInitials = (name: string) => {
    if (!name) return "?"
    const parts = name.split(" ").filter(Boolean)
    return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase()
  }

  const getAge = (dob?: string) => {
    if (!dob) return null
    try {
      const diff = Date.now() - new Date(dob).getTime()
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
    } catch {
      return null
    }
  }

  const currentDepartmentName = useMemo(() => {
    const deps = visit?.departments || []
    const active = deps.find((d) => d.status !== "COMPLETED" && d.status !== "CANCELLED")
    if (active) return active.department?.name || "Unknown department"
    return deps.length === 0 ? "Triage" : deps[0].department?.name || "Triage"
  }, [visit?.departments])

  const groupedEntries = useMemo(() => normalizeVisitVitalSigns(visit?.vitalSigns || []), [visit?.vitalSigns])

  useEffect(() => {
    setVitalIndex((i) => Math.min(i, Math.max(0, groupedEntries.length - 1)))
  }, [groupedEntries.length])

  const updateRow = (rowId: string, field: keyof VitalRow, value: string) => setRows((rs) => rs.map((r) => r.id === rowId ? { ...r, [field]: value } : r))
  const addCustomRow = () => setRows((rs) => [...rs, createRow()])
  const removeRow = (rowId: string) => setRows((rs) => rs.filter((r) => r.id !== rowId))
  const resetRows = () => setRows(defaultRows())

  const handleSubmit = async (e?: FormEvent): Promise<boolean> => {
    if (e) e.preventDefault()
    const rowsToSend = rows.filter((row) => row.isPreset ? !!row.value.trim() : !!(row.measurementName.trim() || row.value.trim() || row.unit.trim()))
    if (!rowsToSend.length) { toast.error("Add at least one vital sign before saving."); return false }
    const invalid = rowsToSend.find((row) => row.isPreset ? !row.value.trim() : (!row.measurementName.trim() || !row.value.trim() || !row.unit.trim()))
    if (invalid) { toast.error(invalid.isPreset ? `${invalid.measurementName} value cannot be empty.` : "Custom vital name, value, and unit cannot be empty."); return false }
    const payload = rowsToSend.map((r) => ({ measurementName: r.measurementName.trim(), value: r.value.trim(), unit: r.unit.trim() }))

    if (!visit) { toast.error("Visit not loaded yet"); return false }
    try {
      const response = await addVisitVitalSigns(visit.id, payload)
      const saved = await handleResponse(response, { successMessage: "Vital signs saved successfully.", errorMessage: true })
      if (saved) { resetRows(); await refetch(); return true }
      return false
    } catch (err: any) { toast.error(err?.message || 'Failed to save vital signs'); return false }
  }

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-80 w-full rounded-3xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <InlineTryAgain onTryAgain={async () => { await refetch() }} />
      </div>
    </div>
  )

  if (!visit) return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Visit not found, redirecting...</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(180deg,_rgba(248,250,252,1)_0%,_rgba(241,245,249,1)_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(15,23,42,1)_100%)]">
      <Header doctor={doctor} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <Button variant="ghost" onClick={() => router.back()} className="px-0 hover:bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        {/* patient header: avatar left, actions right */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="rounded-2xl border border-border/60 bg-card/85 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white flex items-center justify-center text-lg font-semibold shadow-xl">
                {getInitials(patientName)}
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-foreground">{patientName}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>{getAge(visit.patient.dateOfBirth) !== null ? `${getAge(visit.patient.dateOfBirth)}y` : ""}</span>
                  <span>{visit.patient.gender || ""}</span>
                </div>
              </div>
            </div>

            {/* actions moved to bottom dock */}
          </div>
        </div>

        {/* current vitals centered */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <Card className="border-border/60 bg-card/90 shadow-lg backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-xl">Current vital signs</CardTitle>
                    <CardDescription>Most recent measurements recorded for this visit.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {groupedEntries.length > 1 && (
                      <div className="flex items-center gap-1">
                        <button aria-label="Previous entry" onClick={() => setVitalIndex((i) => Math.max(0, i - 1))} className="p-2 rounded-md hover:bg-muted/40" disabled={vitalIndex === 0}>
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button aria-label="Next entry" onClick={() => setVitalIndex((i) => Math.min(groupedEntries.length - 1, i + 1))} className="p-2 rounded-md hover:bg-muted/40" disabled={vitalIndex === groupedEntries.length - 1}>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {groupedEntries.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-6 text-center">
                    <Activity className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="font-medium text-foreground">No vitals recorded yet</p>
                    <p className="text-sm text-muted-foreground">Use the Record vital signs button above to capture the first entry.</p>
                  </div>
                ) : (() => {
                  const group = groupedEntries[vitalIndex]
                  if (!group) return null
                  return (
                    <div key={group.createdAt} className="space-y-3">
                      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span>{group.createdAt && group.createdAt !== "unknown" ? new Date(group.createdAt).toLocaleString() : ""}</span>
                        {groupedEntries.length > 0 && (
                          <span className="font-medium text-foreground">
                            {group.createdAt && group.createdAt !== "unknown" ? new Date(group.createdAt).toLocaleString() : "Recorded"}
                            {group.addedBy ? ` • ${group.addedBy.firstName || ""} ${group.addedBy.lastName || ""}` : null}
                          </span>
                        )}
                      </div>
                      {group.measurements.map((vital: any) => (
                        <div key={vital.id} className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{vital.measurementName}</p>
                              <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{vital.value} <span className="text-sm font-medium text-muted-foreground">{vital.unit}</span></p>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              {group.addedBy ? (<p>By {group.addedBy.firstName || ""} {group.addedBy.lastName || ""}</p>) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-black/25 border border-white/20 rounded-3xl shadow-2xl p-3 flex flex-col" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
            <DialogTitle className="sr-only">Record vital signs</DialogTitle>
            <div className="grid grid-cols-1 gap-4">
              <div className="overflow-y-auto scrollbar-hide pr-2 pb-6 rounded-2xl border border-border/50 bg-[#FBF2ED] dark:bg-slate-900 shadow-lg p-4 max-h-[64vh]">
                <h3 className="text-lg font-semibold mb-2">Record vital signs</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    {rows.map((row, index) => {
                      return (
                        <div key={row.id} className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_0.6fr_auto] gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Measurement</label>
                            {row.isPreset ? (
                              <div className="flex h-10 items-center rounded-md border border-transparent bg-transparent px-3 text-sm font-medium text-foreground select-none pointer-events-none">{row.measurementName}</div>
                            ) : (
                              <Input value={row.measurementName} onChange={(ev) => updateRow(row.id, "measurementName", ev.target.value)} placeholder={index === 0 ? "Blood Pressure" : "Measurement name"} />
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Value</label>
                            <Input value={row.value} onChange={(ev) => updateRow(row.id, "value", ev.target.value)} placeholder="120/80" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Unit</label>
                            {row.isPreset ? (
                              <div className="flex h-10 items-center rounded-md border border-transparent bg-transparent px-3 text-sm text-muted-foreground select-none pointer-events-none">{row.unit}</div>
                            ) : (
                              <Input value={row.unit} onChange={(ev) => updateRow(row.id, "unit", ev.target.value)} placeholder="mmHg" />
                            )}
                          </div>
                          <div className="flex items-end justify-end">
                            {!row.isPreset ? (
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(row.id)} disabled={rows.length === 1} className="text-muted-foreground hover:text-destructive rounded-full" aria-label="Remove measurement"><Trash2 className="w-4 h-4" /></Button>
                            ) : (<div className="h-10 w-10" />)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </form>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => { resetRows(); setModalOpen(false) }} className="rounded-full px-5">Cancel</Button>
                <div className="flex-1" />
                <Button size="sm" onClick={async () => { const saved = await handleSubmit(); if (saved) setModalOpen(false) }} disabled={savingVitals} className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md">{savingVitals ? "Saving..." : "Save vital signs"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AddDepartmentModal visit={visit} isOpen={addDeptOpen} onClose={() => setAddDeptOpen(false)} onSuccess={async () => { setAddDeptOpen(false); await refetch() }} />

        {/* Floating dock (center bottom) with Add Vital and Add Department. Hidden for completed/cancelled visits. */}
        {visit && !["COMPLETED", "CANCELLED"].includes(visit.status) && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <div className="glass-gray rounded-full shadow-xl px-3 py-2 flex items-center gap-2">
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                        onClick={() => setModalOpen(true)}
                        aria-label="Add vital signs"
                      >
                        <Activity className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add vital signs</p>
                    </TooltipContent>
                  </Tooltip>

                  <div className="w-px h-8 bg-white/20" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                        onClick={() => setAddDeptOpen(true)}
                        aria-label="Add department"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add department</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
