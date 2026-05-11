"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"
import {
  useCreateInsuranceProvider,
  useDeleteInsuranceProvider,
  useInsurances,
  useUpdateInsuranceProvider,
} from "@/hooks/auth-hooks"
import { Pencil, Trash2, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ManageInsurancesPage() {
  const router = useRouter()
  const { doctor } = useAuth()
  const { toast } = useToast()
  const { insurances, loading, error, refetch } = useInsurances({ supportedByClinic: null, page: 0, size: 200 })
  const { createInsuranceProvider } = useCreateInsuranceProvider()
  const { updateInsuranceProvider } = useUpdateInsuranceProvider()
  const { deleteInsuranceProvider } = useDeleteInsuranceProvider()
  const [name, setName] = useState("")
  const [acronym, setAcronym] = useState("")
  const [coverage, setCoverage] = useState("")
  const [iconUrl, setIconUrl] = useState("")
  const [supportedByClinic, setSupportedByClinic] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    setName("")
    setAcronym("")
    setCoverage("")
    setIconUrl("")
    setSupportedByClinic(true)
    setEditingId(null)
  }

  const handleCreate = async () => {
    if (!name || !acronym || !coverage) return
    const coverageValue = Number(coverage)
    if (Number.isNaN(coverageValue) || coverageValue < 0 || coverageValue > 100) {
      toast({ title: "Invalid coverage", description: "Coverage must be between 0 and 100." })
      return
    }
    setSaving(true)
    try {
      await createInsuranceProvider({
        insuranceName: name,
        acronym,
        defaultCoveragePercentage: coverageValue,
        supportedByClinic,
        iconUrl: iconUrl || undefined,
      })
      await refetch()
      toast({ title: "Insurance created" })
      resetForm()
    } catch (err: any) {
      toast({ title: "Create failed", description: err?.message || "Unexpected error" })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (editingId == null || !name || !acronym || !coverage) return
    const coverageValue = Number(coverage)
    if (Number.isNaN(coverageValue) || coverageValue < 0 || coverageValue > 100) {
      toast({ title: "Invalid coverage", description: "Coverage must be between 0 and 100." })
      return
    }
    setSaving(true)
    try {
      await updateInsuranceProvider(editingId, {
        insuranceName: name,
        acronym,
        defaultCoveragePercentage: coverageValue,
        supportedByClinic,
        iconUrl: iconUrl || undefined,
      })
      await refetch()
      toast({ title: "Insurance updated" })
      resetForm()
    } catch (err: any) {
      toast({ title: "Update failed", description: err?.message || "Unexpected error" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this insurance provider?")) return
    setSaving(true)
    try {
      const ok = await deleteInsuranceProvider(id)
      if (ok) {
        await refetch()
        if (editingId === id) resetForm()
        toast({ title: "Insurance deleted" })
      } else {
        toast({ title: "Delete failed", description: "Please try again." })
      }
    } catch (err: any) {
      toast({ title: "Delete failed", description: err?.message || "Unexpected error" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
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
            <h1 className="text-2xl font-bold text-foreground">Manage Insurances</h1>
            <p className="text-muted-foreground">Create, edit, and delete insurances.</p>
          </div>
        </div>

        <section className="bg-card/70 dark:bg-slate-900/70 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Insurance Form</p>
            {saving && <span className="text-xs text-muted-foreground">Saving...</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Acronym" value={acronym} onChange={(e) => setAcronym(e.target.value)} />
            <Input placeholder="Coverage %" type="number" value={coverage} onChange={(e) => setCoverage(e.target.value)} />
            <Input placeholder="Icon URL (optional)" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} className="sm:col-span-2" />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox checked={supportedByClinic} onCheckedChange={(checked) => setSupportedByClinic(Boolean(checked))} />
              Supported by clinic
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={editingId ? handleUpdate : handleCreate}
              disabled={saving}
              className="rounded-full"
            >
              {editingId ? "Update Insurance" : "Add Insurance"}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm} disabled={saving} className="rounded-full">Cancel Edit</Button>
            )}
          </div>

          <div className="border-t border-border/40 dark:border-slate-800 pt-4 space-y-2">
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, idx) => (
                  <Skeleton key={idx} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <p className="text-destructive text-sm">
                {typeof error === 'string' ? error : 'Failed to load insurances'}
              </p>
            ) : insurances.length === 0 ? (
              <p className="text-sm text-muted-foreground">No insurances yet.</p>
            ) : (
              <div className="space-y-2">
                {insurances.map((ins) => (
                  <div
                    key={ins.id}
                    className="flex items-center justify-between bg-card/60 dark:bg-slate-900/60 border border-border/40 dark:border-slate-800 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{ins.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ins.acronym} • {ins.coveragePercentage}% coverage • {ins.supportedByClinic ? "Clinic Supported" : "External"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          setEditingId(ins.id)
                          setName(ins.name)
                          setAcronym(ins.acronym)
                          setCoverage(String(ins.coveragePercentage))
                          setIconUrl(ins.iconUrl || "")
                          setSupportedByClinic(Boolean(ins.supportedByClinic))
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="rounded-full"
                        onClick={() => handleDelete(ins.id)}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
