'use client'

import * as React from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useInsuranceSearch } from '@/hooks/auth-hooks'
import type { InsuranceProvider } from '@/lib/api-types'

interface InsuranceAutocompleteProps {
  insurances: InsuranceProvider[]
  selectedInsuranceId: string
  /** Called with the id and the full picked insurance (may come from backend search results). */
  onInsuranceSelect: (insuranceId: string, insurance?: InsuranceProvider) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  /**
   * When true (default), a picked insurance replaces the trigger with a
   * selected chip. Set false to keep showing the search trigger and let the
   * parent render its own selection chip from the picked object.
   */
  showSelectionChip?: boolean
}

export function InsuranceAutocomplete({
  insurances,
  selectedInsuranceId,
  onInsuranceSelect,
  placeholder = 'Search insurances...',
  disabled = false,
  className,
  showSelectionChip = true,
}: InsuranceAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  // Keep the full picked insurance locally so the selection stays visible even
  // when it came from backend search results (not present in the `insurances` prop).
  const [selectedInsurance, setSelectedInsurance] = React.useState<InsuranceProvider | null>(null)

  // Use backend search when user types, otherwise use provided insurances
  const { insurances: searchResults, loading: searchLoading } = useInsuranceSearch(inputValue)

  const isSearching = inputValue.trim().length >= 2

  const displayInsurances = React.useMemo(() => {
    // If we have a search query (2+ chars), use backend results
    // Otherwise, use the provided insurances list
    if (isSearching) {
      return searchResults
    }
    return insurances
  }, [isSearching, searchResults, insurances])

  // Keep the local selection in sync with the prop (including when it is cleared).
  React.useEffect(() => {
    if (!selectedInsuranceId) {
      setSelectedInsurance(null)
      return
    }
    const found =
      insurances.find((i) => String(i.id) === selectedInsuranceId) ||
      searchResults.find((i) => String(i.id) === selectedInsuranceId)
    if (found) {
      setSelectedInsurance(found)
    }
  }, [insurances, searchResults, selectedInsuranceId])

  const handleSelect = (insurance: InsuranceProvider) => {
    setSelectedInsurance(insurance)
    onInsuranceSelect(String(insurance.id), insurance)
    setOpen(false)
    setInputValue('')
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (!open && value.length > 0) {
      setOpen(true)
    }
  }

  const handleClearSelection = () => {
    setSelectedInsurance(null)
    onInsuranceSelect('')
    setInputValue('')
  }

  // If an insurance is selected, show a cleaner UI with just the name and clear button
  if (selectedInsurance && showSelectionChip) {
    return (
      <div className={cn('flex items-center gap-2 w-full', className)}>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{selectedInsurance.insuranceName || selectedInsurance.name}</span>
            {selectedInsurance.acronym && (
              <span className="text-xs text-muted-foreground truncate">{selectedInsurance.acronym}</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            className="h-6 w-6 p-0 rounded-full hover:bg-muted-foreground/20 ml-auto shrink-0"
            type="button"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setInputValue('')
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between rounded-lg', className)}
          disabled={disabled}
        >
          <span className="truncate">{inputValue || placeholder}</span>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 rounded-lg" align="start">
        <Command shouldFilter={!isSearching}>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={handleInputChange}
          />
          <CommandList>
            <CommandEmpty>
              {searchLoading ? 'Searching...' : 'No insurances found.'}
            </CommandEmpty>
            <CommandGroup>
              {displayInsurances.map((insurance) => (
                <CommandItem
                  key={insurance.id}
                  value={insurance.insuranceName || insurance.name || ''}
                  onSelect={() => handleSelect(insurance)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      String(insurance.id) === selectedInsuranceId ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{insurance.insuranceName || insurance.name}</span>
                    {insurance.acronym && (
                      <span className="text-xs text-muted-foreground truncate">{insurance.acronym}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
