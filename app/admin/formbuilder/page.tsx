"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  fbGetAllForms,
  fbDeleteForm,
  fbDuplicateForm,
  fbSaveForm,
  type SavedForm,
  type FormTemplateType,
} from '@/lib/formbuilder-storage'
import { getPreset, TEMPLATE_PRESETS } from '@/lib/formbuilder-presets'
import { TemplatePicker } from '@/components/formbuilder/template-picker'
import {
  Plus, Search, FileText, Copy, Trash2, PenLine, ArrowLeft, Clock, LayoutGrid, List,
} from 'lucide-react'

const TYPE_LABELS: Record<FormTemplateType, string> = {
  consultation: 'Consultation',
  consent: 'Consent',
  referral: 'Referral',
  discharge: 'Discharge',
  report: 'Report',
  custom: 'Custom',
}

const TYPE_COLORS: Record<FormTemplateType, string> = {
  consultation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  consent:      'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  referral:     'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  discharge:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  report:       'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  custom:       'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export default function FormBuilderListPage() {
  const router = useRouter()
  const { doctor } = useAuth()
  const [forms, setForms] = useState<SavedForm[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mounted, setMounted] = useState(false)

  const reload = useCallback(() => setForms(fbGetAllForms()), [])

  useEffect(() => {
    setMounted(true)
    reload()
  }, [reload])

  const handleCreate = (name: string, type: FormTemplateType) => {
    const preset = getPreset(type)
    const blocks = preset ? preset.blocks() : []
    const saved = fbSaveForm({ name, type, blocks })
    setPickerOpen(false)
    router.push(`/admin/formbuilder/edit?id=${saved.id}`)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this form? This cannot be undone.')) return
    fbDeleteForm(id)
    reload()
  }

  const handleDuplicate = (id: string) => {
    const copy = fbDuplicateForm(id)
    if (copy) {
      reload()
      router.push(`/admin/formbuilder/edit?id=${copy.id}`)
    }
  }

  const filtered = forms.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    TYPE_LABELS[f.type].toLowerCase().includes(search.toLowerCase()),
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => router.push('/admin')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Form Builder</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {forms.length} form{forms.length !== 1 ? 's' : ''} saved locally
              </p>
            </div>
          </div>
          <Button
            onClick={() => setPickerOpen(true)}
            className="bg-[#FF6900] hover:bg-[#e05f00] text-white gap-2"
          >
            <Plus className="h-4 w-4" />
            New Form
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-52 max-w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search forms…"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-30" />
            {forms.length === 0 ? (
              <>
                <p className="text-lg font-medium text-foreground">No forms yet</p>
                <p className="text-sm mt-1">Create your first form using a preset template or a blank canvas.</p>
                <Button
                  className="mt-4 bg-[#FF6900] hover:bg-[#e05f00] text-white gap-2"
                  onClick={() => setPickerOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  New Form
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm">No forms match your search.</p>
                <button className="text-sm text-primary mt-2 underline" onClick={() => setSearch('')}>Clear search</button>
              </>
            )}
          </div>
        )}

        {/* Grid view */}
        {viewMode === 'grid' && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((form) => {
              const preset = TEMPLATE_PRESETS.find((p) => p.type === form.type)
              return (
                <div
                  key={form.id}
                  className="group flex flex-col rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/admin/formbuilder/edit?id=${form.id}`)}
                >
                  {/* Card top colour strip */}
                  <div className={`h-1.5 ${preset?.color.includes('blue') ? 'bg-blue-400' : preset?.color.includes('rose') ? 'bg-rose-400' : preset?.color.includes('amber') ? 'bg-amber-400' : preset?.color.includes('emerald') ? 'bg-emerald-400' : preset?.color.includes('purple') ? 'bg-purple-400' : 'bg-slate-400'}`} />
                  <div className="flex flex-col gap-3 p-4 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xl">{preset?.emoji ?? '📄'}</span>
                      <Badge className={`text-[10px] px-1.5 py-0 ${TYPE_COLORS[form.type]}`}>
                        {TYPE_LABELS[form.type]}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground line-clamp-2">{form.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{form.blocks.length} block{form.blocks.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/50 pt-2">
                      <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {timeAgo(form.updatedAt)}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <button title="Edit" onClick={(e) => { e.stopPropagation(); router.push(`/admin/formbuilder/edit?id=${form.id}`) }} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                          <PenLine className="h-3 w-3" />
                        </button>
                        <button title="Duplicate" onClick={(e) => { e.stopPropagation(); handleDuplicate(form.id) }} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                          <Copy className="h-3 w-3" />
                        </button>
                        <button title="Delete" onClick={(e) => { e.stopPropagation(); handleDelete(form.id) }} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* List view */}
        {viewMode === 'list' && filtered.length > 0 && (
          <div className="border border-border rounded-2xl overflow-hidden">
            {filtered.map((form, idx) => {
              const preset = TEMPLATE_PRESETS.find((p) => p.type === form.type)
              return (
                <div
                  key={form.id}
                  className={`group flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors ${idx > 0 ? 'border-t border-border' : ''}`}
                  onClick={() => router.push(`/admin/formbuilder/edit?id=${form.id}`)}
                >
                  <span className="text-lg">{preset?.emoji ?? '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{form.name}</p>
                    <p className="text-xs text-muted-foreground">{form.blocks.length} blocks · updated {timeAgo(form.updatedAt)}</p>
                  </div>
                  <Badge className={`text-[10px] px-1.5 py-0 shrink-0 ${TYPE_COLORS[form.type]}`}>
                    {TYPE_LABELS[form.type]}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={(e) => { e.stopPropagation(); router.push(`/admin/formbuilder/edit?id=${form.id}`) }} title="Edit" className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                      <PenLine className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDuplicate(form.id) }} title="Duplicate" className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(form.id) }} title="Delete" className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <TemplatePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onCreate={handleCreate} />
    </div>
  )
}
