'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface MedicationFrequencyOption {
  acronym: string
  meaning: string
  keywords?: string[]
}

export const COMMON_MEDICATION_FREQUENCIES: MedicationFrequencyOption[] = [
  { acronym: 'OD', meaning: 'Once daily', keywords: ['once', '1', 'daily', 'qd'] },
  { acronym: 'BID', meaning: 'Twice daily (every 12h)', keywords: ['twice', '2', 'bd'] },
  { acronym: 'TDS', meaning: 'Three times daily (every 8h)', keywords: ['three', '3', 'tid', 'thrice'] },
  { acronym: 'QDS', meaning: 'Four times daily (every 6h)', keywords: ['four', '4', 'qid'] },
  { acronym: 'PRN', meaning: 'As needed (pro re nata)', keywords: ['as needed', 'when required', 'pain', 'sos'] },
  { acronym: 'STAT', meaning: 'Immediately (single dose)', keywords: ['immediately', 'now', 'urgent', 'once'] },
  { acronym: 'Q4H', meaning: 'Every 4 hours', keywords: ['4h', 'four hours'] },
  { acronym: 'Q6H', meaning: 'Every 6 hours', keywords: ['6h', 'six hours'] },
  { acronym: 'Q8H', meaning: 'Every 8 hours', keywords: ['8h', 'eight hours'] },
  { acronym: 'Q12H', meaning: 'Every 12 hours', keywords: ['12h', 'twelve hours'] },
  { acronym: 'MANE', meaning: 'In the morning', keywords: ['morning', 'qam', 'am'] },
  { acronym: 'NOCTE', meaning: 'At night / bedtime', keywords: ['night', 'bedtime', 'qhs', 'on', 'pm'] },
  { acronym: 'AC', meaning: 'Before meals', keywords: ['before food', 'empty stomach'] },
  { acronym: 'PC', meaning: 'After meals', keywords: ['after food'] },
  { acronym: 'QOD', meaning: 'Every other day', keywords: ['alternate', 'other day'] },
  { acronym: 'WEEKLY', meaning: 'Once a week', keywords: ['week', 'once weekly'] },
]

export interface MedicationFrequencyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  id?: string
}

export function MedicationFrequencyInput({
  value,
  onChange,
  placeholder = 'Frequency (e.g. TDS)',
  className,
  disabled = false,
  id,
}: MedicationFrequencyInputProps) {
  const [open, setOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  const query = value.trim().toLowerCase()

  const filteredOptions = React.useMemo(() => {
    if (!query) return COMMON_MEDICATION_FREQUENCIES
    return COMMON_MEDICATION_FREQUENCIES.filter((opt) => {
      if (opt.acronym.toLowerCase().includes(query)) return true
      if (opt.meaning.toLowerCase().includes(query)) return true
      if (opt.keywords?.some((k) => k.toLowerCase().includes(query))) return true
      return false
    })
  }, [query])

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (acronym: string) => {
    onChange(acronym)
    setOpen(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true)
      return
    }

    if (e.key === 'Escape') {
      setOpen(false)
      setHighlightedIndex(-1)
      return
    }

    if (open && filteredOptions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((prev) => (prev <= 0 ? filteredOptions.length - 1 : prev - 1))
      } else if (e.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        e.preventDefault()
        handleSelect(filteredOptions[highlightedIndex].acronym)
      }
    }
  }

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-frequency-item]')
      const activeEl = items[highlightedIndex] as HTMLElement | undefined
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex])

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          id={id}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
            setHighlightedIndex(-1)
          }}
          onFocus={() => {
            setOpen(true)
          }}
          onClick={() => {
            setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          className={cn('pr-7', className)}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            setOpen((prev) => !prev)
            inputRef.current?.focus()
          }}
          className="absolute right-1.5 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded"
          title="Toggle frequency options"
          aria-label="Toggle frequency options"
        >
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-150', open && 'rotate-180')} />
        </button>
      </div>

      {open && (
        <div
          ref={listRef}
          className="absolute left-0 top-full mt-1 w-[280px] sm:w-[320px] max-h-60 overflow-y-auto rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md text-popover-foreground shadow-xl z-50 p-1.5 divide-y divide-border/20 isolate animate-in fade-in-0 zoom-in-95 duration-100"
        >
          {filteredOptions.length > 0 ? (
            <div className="space-y-0.5">
              {filteredOptions.map((opt, idx) => {
                const isSelected = value.trim().toUpperCase() === opt.acronym
                const isHighlighted = idx === highlightedIndex
                return (
                  <button
                    key={opt.acronym}
                    type="button"
                    data-frequency-item
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSelect(opt.acronym)
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={cn(
                      'w-full flex items-center justify-between gap-2.5 px-2.5 py-1.5 text-left rounded-lg text-xs transition-colors cursor-pointer',
                      isHighlighted || isSelected
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted/70 text-foreground'
                    )}
                  >
                    <span className="font-bold tracking-wide text-xs shrink-0">
                      {opt.acronym}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate text-right">
                      {opt.meaning}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="px-2.5 py-2 text-xs text-muted-foreground">
              Custom frequency: <span className="font-semibold text-foreground">"{value}"</span>
              <p className="text-[10px] text-muted-foreground/80 mt-0.5">Click away to keep custom value</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
