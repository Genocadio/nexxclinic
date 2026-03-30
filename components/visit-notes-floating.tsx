"use client"

import { useEffect, useMemo, useState } from "react"
import { StickyNote } from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VisitNoteItem {
  type?: string | null
  text?: string | null
  scope?: 'visit' | 'department'
  departmentName?: string
}

interface VisitNotesFloatingProps {
  notes: VisitNoteItem[]
  noteTypes: string[]
  title?: string
  allowedDisplayTypes?: string[]
  onAddNote?: (type: string, text: string) => Promise<void>
}

export default function VisitNotesFloating({
  notes,
  noteTypes,
  title = "Visit Notes",
  allowedDisplayTypes,
  onAddNote,
}: VisitNotesFloatingProps) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [selectedType, setSelectedType] = useState(noteTypes[0] || "GENERAL")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!noteTypes.includes(selectedType)) {
      setSelectedType(noteTypes[0] || "GENERAL")
    }
  }, [noteTypes, selectedType])

  const visibleNotes = useMemo(() => {
    if (!allowedDisplayTypes || allowedDisplayTypes.length === 0) {
      return notes || []
    }

    const allowed = new Set(allowedDisplayTypes)
    return (notes || []).filter((note) => note?.type && allowed.has(String(note.type)))
  }, [allowedDisplayTypes, notes])

  const handleAdd = async () => {
    if (!onAddNote) return
    const trimmed = text.trim()
    if (!trimmed) return

    setSubmitting(true)
    try {
      await onAddNote(selectedType, trimmed)
      setText("")
    } catch (error: any) {
      const message = error?.message || "Failed to save note"
      toast.error(message)
      console.error("Failed to add note", error)
    } finally {
      setSubmitting(false)
    }
  }

  const addBulletPrefix = () => {
    setText((prev) => (prev ? `${prev}\n- ` : '- '))
  }

  const addNumberPrefix = () => {
    setText((prev) => {
      if (!prev) return '1. '
      const lines = prev.split('\n')
      const last = lines[lines.length - 1] || ''
      const match = last.match(/^(\d+)\.\s/)
      const next = match ? Number(match[1]) + 1 : 1
      return `${prev}\n${next}. `
    })
  }

  const formatLineBlocks = (content: string) => {
    const lines = content.split('\n')
    const blocks: Array<{ type: 'ul' | 'ol' | 'p'; items: string[] }> = []

    const pushBlock = (type: 'ul' | 'ol' | 'p', value: string) => {
      const last = blocks[blocks.length - 1]
      if (last && last.type === type) {
        last.items.push(value)
        return
      }
      blocks.push({ type, items: [value] })
    }

    lines.forEach((rawLine) => {
      const line = rawLine.trimEnd()
      if (!line.trim()) return

      if (line.startsWith('- ')) {
        pushBlock('ul', line.slice(2))
        return
      }

      const numbered = line.match(/^\d+\.\s+(.*)$/)
      if (numbered) {
        pushBlock('ol', numbered[1])
        return
      }

      pushBlock('p', line)
    })

    if (blocks.length === 0) {
      return <p className="text-xs text-muted-foreground">No content</p>
    }

    return (
      <div className="space-y-1">
        {blocks.map((block, idx) => {
          if (block.type === 'ul') {
            return (
              <ul key={`ul-${idx}`} className="list-disc pl-4 text-xs text-foreground space-y-0.5">
                {block.items.map((item, itemIdx) => (
                  <li key={`ul-${idx}-${itemIdx}`}>{item}</li>
                ))}
              </ul>
            )
          }

          if (block.type === 'ol') {
            return (
              <ol key={`ol-${idx}`} className="list-decimal pl-4 text-xs text-foreground space-y-0.5">
                {block.items.map((item, itemIdx) => (
                  <li key={`ol-${idx}-${itemIdx}`}>{item}</li>
                ))}
              </ol>
            )
          }

          return block.items.map((item, itemIdx) => (
            <p key={`p-${idx}-${itemIdx}`} className="text-xs text-foreground whitespace-pre-wrap">{item}</p>
          ))
        })}
      </div>
    )
  }

  return (
    <>
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
        <Button
          type="button"
          size="icon"
          className="relative rounded-full h-12 w-12 border-2 border-white/30 bg-card/90 text-foreground hover:bg-card shadow-lg"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle notes"
          title="Notes"
        >
          <StickyNote className="h-5 w-5" />
          {!open && visibleNotes.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold leading-5 text-center shadow-lg ring-2 ring-background animate-pulse">
              {visibleNotes.length}
            </span>
          )}
        </Button>
      </div>

      {open && (
        <div className="fixed right-20 top-1/2 -translate-y-1/2 w-[360px] max-w-[calc(100vw-7rem)] z-40 bg-card border border-border rounded-2xl shadow-2xl p-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">View and add notes</p>
          </div>

          <div className="max-h-56 overflow-y-auto rounded-xl border border-border/70 bg-background/70 p-3 space-y-2">
            {visibleNotes.length === 0 ? (
              <p className="text-xs text-muted-foreground">No notes yet.</p>
            ) : (
              visibleNotes.map((note, idx) => (
                <div key={`${note.type || "note"}-${idx}`} className="rounded-lg border border-border/60 bg-card/80 p-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{note.type || "GENERAL"}</p>
                    <span className="text-[10px] font-semibold rounded-full border border-border/70 px-2 py-0.5 text-muted-foreground">
                      {note.scope === 'department'
                        ? `Department${note.departmentName ? `: ${note.departmentName}` : ''}`
                        : 'Visit'}
                    </span>
                  </div>
                  {formatLineBlocks(note.text || "")}
                </div>
              ))
            )}
          </div>

          {onAddNote && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Button type="button" variant="outline" className="h-7 rounded-full px-3 text-[11px]" onClick={addBulletPrefix}>
                  • List
                </Button>
                <Button type="button" variant="outline" className="h-7 rounded-full px-3 text-[11px]" onClick={addNumberPrefix}>
                  1. Numbered
                </Button>

                {noteTypes.length > 1 ? (
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="h-7 min-h-0 w-auto rounded-full border-border/70 bg-background/80 px-3 py-0 text-[11px] font-semibold text-muted-foreground leading-none [&>svg]:hidden">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[120px] rounded-xl p-1">
                      {noteTypes.map((type) => (
                        <SelectItem key={type} value={type} className="h-7 text-[11px] leading-none px-2">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="inline-flex rounded-full border border-border/70 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                    {selectedType}
                  </div>
                )}
              </div>

              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' || e.shiftKey) return

                  const textarea = e.currentTarget
                  const cursorPos = textarea.selectionStart
                  const textBeforeCursor = text.slice(0, cursorPos)
                  const lines = textBeforeCursor.split('\n')
                  const currentLine = lines[lines.length - 1] || ''

                  const bulletMatch = currentLine.match(/^(\s*)-\s/)
                  if (bulletMatch) {
                    e.preventDefault()
                    const indent = bulletMatch[1]
                    const textAfterCursor = text.slice(cursorPos)
                    const updated = `${textBeforeCursor}\n${indent}- ${textAfterCursor}`
                    setText(updated)
                    setTimeout(() => {
                      textarea.selectionStart = textarea.selectionEnd = cursorPos + indent.length + 3
                    }, 0)
                    return
                  }

                  const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s/)
                  if (numberedMatch) {
                    e.preventDefault()
                    const indent = numberedMatch[1]
                    const nextNum = Number(numberedMatch[2]) + 1
                    const textAfterCursor = text.slice(cursorPos)
                    const updated = `${textBeforeCursor}\n${indent}${nextNum}. ${textAfterCursor}`
                    setText(updated)
                    setTimeout(() => {
                      textarea.selectionStart = textarea.selectionEnd = cursorPos + indent.length + String(nextNum).length + 3
                    }, 0)
                  }
                }}
                rows={5}
                placeholder="Write note..."
                className="bg-background/80 border-border/80"
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" className="h-8 rounded-full" onClick={() => setText("")}>
                  Clear
                </Button>
                <Button
                  type="button"
                  className="h-8 rounded-full"
                  onClick={handleAdd}
                  disabled={submitting || text.trim().length === 0}
                >
                  {submitting ? "Saving..." : "Add Note"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
