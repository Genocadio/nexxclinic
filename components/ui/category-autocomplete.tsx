'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Search, Tag, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

export interface CategoryAutocompleteProps {
  value?: string
  onValueChange: (category: string) => void
  categories?: readonly string[] | string[]
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
}

export function CategoryAutocomplete({
  value = '',
  onValueChange,
  categories = FIXED_PRODUCT_CATEGORIES,
  placeholder = 'Select category (optional)...',
  disabled = false,
  className,
}: CategoryAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const selectedCategory = (value || '').trim()

  const handleSelect = (category: string) => {
    onValueChange(category)
    setOpen(false)
    setSearchQuery('')
  }

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    onValueChange('')
    setSearchQuery('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            'flex items-center justify-between gap-2 w-full h-10 px-3 py-2 text-sm rounded-xl border border-input bg-white dark:bg-slate-950 transition-colors',
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
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Tag className={cn('h-3.5 w-3.5 shrink-0', selectedCategory ? 'text-primary' : 'text-muted-foreground')} />
            {selectedCategory ? (
              <span className="truncate font-medium text-foreground">{selectedCategory}</span>
            ) : (
              <span className="truncate text-muted-foreground">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {selectedCategory && (
              <button
                type="button"
                onClick={handleClear}
                className="h-5 w-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Clear category"
                aria-label="Clear category"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-60" />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] sm:w-[340px] p-0 rounded-2xl shadow-xl z-[150]" align="start">
        <Command>
          <CommandInput
            placeholder="Search category (e.g. dental, eye, lab)..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-10"
          />
          <CommandList className="max-h-[280px] overflow-y-auto p-1.5 scrollbar-thin">
            <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
              No matching category found.
            </CommandEmpty>

            {/* Clear option */}
            <CommandGroup>
              <CommandItem
                value="__none__ unassigned clear without no category"
                onSelect={() => handleSelect('')}
                className="rounded-xl cursor-pointer text-xs text-muted-foreground hover:text-foreground py-2"
              >
                <X className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <span className="italic">None (Unassigned)</span>
                {!selectedCategory && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
              </CommandItem>
            </CommandGroup>

            <CommandSeparator className="my-1" />

            <CommandGroup heading="Standard Clinic Categories">
              {categories.map((cat) => {
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase()
                const keywords = CATEGORY_SEARCH_KEYWORDS[cat] || []
                const searchTokens = `${cat} ${keywords.join(' ')}`

                return (
                  <CommandItem
                    key={cat}
                    value={searchTokens}
                    onSelect={() => handleSelect(cat)}
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
        </Command>
      </PopoverContent>
    </Popover>
  )
}
