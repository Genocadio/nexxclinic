"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { TEMPLATE_PRESETS } from '@/lib/formbuilder-presets'
import type { FormTemplateType } from '@/lib/formbuilder-storage'

interface TemplatePickerProps {
  open: boolean
  onClose: () => void
  onCreate: (name: string, type: FormTemplateType) => void
}

export function TemplatePicker({ open, onClose, onCreate }: TemplatePickerProps) {
  const [selected, setSelected] = useState<FormTemplateType | null>(null)
  const [name, setName] = useState('')

  const handleCreate = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const type = selected ?? 'custom'
    onCreate(trimmed, type)
    setName('')
    setSelected(null)
  }

  const handleSelectAndContinue = (type: FormTemplateType) => {
    setSelected(type)
    const preset = TEMPLATE_PRESETS.find((p) => p.type === type)
    if (preset && !name) setName(preset.label)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">New Form</DialogTitle>
          <DialogDescription>
            Start from a preset template or build from a blank canvas.
          </DialogDescription>
        </DialogHeader>

        {/* Template grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {TEMPLATE_PRESETS.map((preset) => (
            <button
              key={preset.type}
              onClick={() => handleSelectAndContinue(preset.type)}
              className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                selected === preset.type
                  ? `${preset.color} border-current`
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
              }`}
            >
              <span className="text-2xl">{preset.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight">{preset.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{preset.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Name input + create */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground">Form name</label>
            <Input
              className="mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Paediatric Consultation Form"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
          </div>

          {selected && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${TEMPLATE_PRESETS.find(p => p.type === selected)?.color ?? ''}`}>
              <span>{TEMPLATE_PRESETS.find(p => p.type === selected)?.emoji}</span>
              <span className="font-medium">{TEMPLATE_PRESETS.find(p => p.type === selected)?.label}</span>
              <span className="text-muted-foreground">template selected</span>
              <button onClick={() => setSelected(null)} className="ml-auto text-muted-foreground hover:text-foreground text-xs">
                Clear
              </button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="bg-[#FF6900] hover:bg-[#e05f00] text-white"
            >
              {selected ? `Create from ${TEMPLATE_PRESETS.find(p => p.type === selected)?.label}` : 'Create blank form'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
