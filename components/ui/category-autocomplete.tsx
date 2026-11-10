'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Plus, Search, Tag, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { FIXED_PRODUCT_CATEGORIES, type FixedProductCategory } from '@/lib/api-types'

export { FIXED_PRODUCT_CATEGORIES, type FixedProductCategory }

export const CATEGORY_SEARCH_KEYWORDS: Record<string, string[]> = {
  Consultations: ['consult', 'visit', 'doctor', 'examination', 'checkup', 'general', 'specialist'],
  Ophthalmology: ['eye', 'vision', 'optical', 'refraction', 'glasses', 'cataract', 'optometry', 'retina'],
  Dental: ['teeth', 'tooth', 'dentist', 'oral', 'extraction', 'scaling', 'caries', 'orthodontics'],
  'Imaging / Radiology': ['xray', 'x-ray', 'ultrasound', 'echography', 'ct', 'mri', 'radiology', 'scan'],
  Laboratory: ['lab', 'blood', 'urine', 'stool', 'culture', 'hematology', 'biochemistry', 'test'],
  'Pharmacy / Medicines': ['drug', 'medicine', 'tablet', 'syrup', 'injection', 'pharma', 'medication', 'capsule'],
  'Surgery / Procedures': ['surgical', 'operation', 'procedure', 'suture', 'wound', 'dressing', 'biopsy'],
  'Consumables & Devices': ['consumable', 'device', 'syringe', 'glove', 'needle', 'catheter', 'bandage', 'gauze'],
  'Physiotherapy & Rehabilitation': ['physio', 'rehabilitation', 'therapy', 'massage', 'exercise', 'kinesitherapy'],
  'Maternity & Obstetrics': ['maternity', 'obstetrics', 'gynecology', 'antenatal', 'delivery', 'birth', 'pregnancy'],
  'Emergency & Critical Care': ['emergency', 'urgent', 'icu', 'critical', 'resuscitation', 'oxygen', 'ambulance'],
  'General & Administrative': ['general', 'admin', 'certificate', 'paperwork', 'attestation', 'hospitalization'],
}

/**
 * Extracts all category strings from a product's metadata.
 * Backward compatible: reads both `metadata.categories` (array) and `metadata.category` (string).
 */
export function extractProductCategories(
  product: { metadata?: Record<string, unknown> | null } | null | undefined
): string[] {
  if (!product || !product.metadata || typeof product.metadata !== 'object') {
    return []
  }
  const meta = product.metadata as Record<string, unknown>
  const list: string[] = []

  if (Array.isArray(meta.categories)) {
    for (const item of meta.categories) {
      if (typeof item === 'string' && item.trim()) {
        list.push(item.trim())
      }
    }
  } else if (typeof meta.category === 'string' && meta.category.trim()) {
    list.push(meta.category.trim())
  }

  // Deduplicate case-insensitively while preserving original casing
  const seen = new Set<string>()
  const result: string[] = []
  for (const item of list) {
    const lower = item.toLowerCase()
    if (!seen.has(lower)) {
      seen.add(lower)
      result.push(item)
    }
  }
  return result
}

/**
 * Builds metadata object with both `categories: string[]` and `category: string`
 * for full backward compatibility across all queries and services.
 */
export function buildProductCategoryMetadata(
  categories: string[] | string | undefined | null,
  existingMetadata?: Record<string, unknown> | null
): Record<string, unknown> {
  const meta: Record<string, unknown> =
    existingMetadata && typeof existingMetadata === 'object'
      ? { ...existingMetadata }
      : {}

  const rawList = Array.isArray(categories)
    ? categories
    : typeof categories === 'string' && categories.trim()
    ? [categories.trim()]
    : []

  const cleanCategories = Array.from(
    new Set(rawList.map((c) => c.trim()).filter(Boolean))
  )

  if (cleanCategories.length > 0) {
    meta.categories = cleanCategories
    meta.category = cleanCategories[0] // backward compatibility for single-category consumers
  } else {
    delete meta.categories
    delete meta.category
  }

  return meta
}

export interface CategoryAutocompleteProps {
  /** Single string or array of strings when multiple=true */
  value?: string | string[]
  /** Called with string[] when multiple=true, or string when multiple=false */
  onValueChange: (category: any) => void
  /** Enables selecting more than one category */
  multiple?: boolean
  categories?: readonly string[] | string[]
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
}

export function CategoryAutocomplete({
  value = '',
  onValueChange,
  multiple = false,
  categories = FIXED_PRODUCT_CATEGORIES,
  placeholder,
  disabled = false,
  className,
}: CategoryAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  // Normalize selected categories into an array
  const selectedList = React.useMemo(() => {
    if (Array.isArray(value)) {
      return value.map((v) => String(v).trim()).filter(Boolean)
    }
    if (typeof value === 'string' && value.trim()) {
      return [value.trim()]
    }
    return []
  }, [value])

  const isMultiple = multiple || Array.isArray(value)

  // Merge provided categories with selected list to ensure all selected show up
  const allCategories = React.useMemo(() => {
    const set = new Set<string>(categories)
    selectedList.forEach((c) => set.add(c))
    return Array.from(set).sort()
  }, [categories, selectedList])

  const handleToggle = (category: string) => {
    const trimmed = category.trim()
    if (!trimmed) return

    if (!isMultiple) {
      onValueChange(trimmed)
      setOpen(false)
      setSearchQuery('')
      return
    }

    const exists = selectedList.some((c) => c.toLowerCase() === trimmed.toLowerCase())
    let next: string[]
    if (exists) {
      next = selectedList.filter((c) => c.toLowerCase() !== trimmed.toLowerCase())
    } else {
      next = [...selectedList, trimmed]
    }
    onValueChange(next)
    setSearchQuery('')
  }

  const handleRemoveOne = (e: React.MouseEvent, category: string) => {
    e.stopPropagation()
    const next = selectedList.filter((c) => c.toLowerCase() !== category.toLowerCase())
    onValueChange(isMultiple ? next : '')
  }

  const handleClearAll = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    onValueChange(isMultiple ? [] : '')
    setSearchQuery('')
  }

  const defaultPlaceholder = isMultiple
    ? 'Select categories (e.g. Consultations, Dental)...'
    : 'Select category (optional)...'

  const effectivePlaceholder = placeholder || defaultPlaceholder

  // Check if search query is a new custom category not in the list
  const trimmedSearch = searchQuery.trim()
  const isCustomCandidate =
    trimmedSearch.length > 1 &&
    !allCategories.some((c) => c.toLowerCase() === trimmedSearch.toLowerCase())

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            'flex items-center justify-between gap-2 w-full min-h-10 px-3 py-1.5 text-sm rounded-xl border border-input bg-white dark:bg-slate-950 transition-colors',
            'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
            disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : 'cursor-pointer',
            className
          )}
          onClick={() => {
            if (!disabled) setOpen((prev) => !prev)
          }}
          onKeyDown={(e) => {
            if (disabled) return
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
            }
          }}
        >
          <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1 py-0.5">
            <Tag className={cn('h-3.5 w-3.5 shrink-0', selectedList.length > 0 ? 'text-primary' : 'text-muted-foreground')} />

            {selectedList.length === 0 ? (
              <span className="truncate text-muted-foreground">{effectivePlaceholder}</span>
            ) : isMultiple ? (
              selectedList.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-medium gap-1 flex items-center"
                >
                  <span>{cat}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveOne(e, cat)}
                      className="hover:bg-purple-500/20 rounded-full p-0.5 transition-colors"
                      title={`Remove ${cat}`}
                      aria-label={`Remove ${cat}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  )}
                </Badge>
              ))
            ) : (
              <span className="truncate font-medium text-foreground">{selectedList[0]}</span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {selectedList.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClearAll}
                className="h-5 w-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Clear categories"
                aria-label="Clear categories"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-60" />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] sm:w-[360px] p-0 rounded-2xl shadow-xl z-[150]" align="start">
        <Command>
          <CommandInput
            placeholder="Search category (e.g. dental, eye, lab)..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-10"
          />
          <CommandList className="max-h-[300px] overflow-y-auto p-1.5 scrollbar-thin">
            <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
              {isCustomCandidate ? (
                <div className="space-y-2 px-2">
                  <p className="text-xs text-muted-foreground">Category not found in standard list.</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggle(trimmedSearch)}
                    className="w-full text-xs gap-1 rounded-xl"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add &ldquo;{trimmedSearch}&rdquo;
                  </Button>
                </div>
              ) : (
                'No matching category found.'
              )}
            </CommandEmpty>

            {/* Custom category creation option when typing */}
            {isCustomCandidate && (
              <CommandGroup>
                <CommandItem
                  value={`custom_new_category_${trimmedSearch}`}
                  onSelect={() => handleToggle(trimmedSearch)}
                  className="rounded-xl cursor-pointer text-xs py-2 text-primary font-medium flex items-center gap-2"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add custom category: <strong>&ldquo;{trimmedSearch}&rdquo;</strong></span>
                </CommandItem>
              </CommandGroup>
            )}

            {/* Clear option */}
            {selectedList.length > 0 && (
              <>
                <CommandGroup>
                  <CommandItem
                    value="__clear_all__ unassign"
                    onSelect={() => handleClearAll()}
                    className="rounded-xl cursor-pointer text-xs text-muted-foreground hover:text-foreground py-2"
                  >
                    <X className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span className="italic">Clear all categories ({selectedList.length} selected)</span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator className="my-1" />
              </>
            )}

            <CommandGroup heading="Standard Clinic Categories">
              {allCategories.map((cat) => {
                const isSelected = selectedList.some((c) => c.toLowerCase() === cat.toLowerCase())
                const keywords = CATEGORY_SEARCH_KEYWORDS[cat] || []
                const searchTokens = `${cat} ${keywords.join(' ')}`

                return (
                  <CommandItem
                    key={cat}
                    value={searchTokens}
                    onSelect={() => handleToggle(cat)}
                    className="rounded-xl cursor-pointer py-2 px-2.5 flex items-center justify-between text-xs sm:text-sm font-medium"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Tag className={cn('h-3.5 w-3.5 shrink-0', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                      <span className={cn('truncate', isSelected ? 'text-primary font-semibold' : 'text-foreground')}>
                        {cat}
                      </span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary shrink-0 ml-2" />}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>

          {isMultiple && selectedList.length > 0 && (
            <div className="p-2 border-t border-border/40 flex items-center justify-between bg-muted/20">
              <span className="text-[11px] text-muted-foreground font-medium">
                {selectedList.length} {selectedList.length === 1 ? 'category' : 'categories'} selected
              </span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="h-7 px-2.5 text-xs rounded-lg"
              >
                Done
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
