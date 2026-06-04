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
  onInsuranceSelect: (insuranceId: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function InsuranceAutocomplete({
  insurances,
  selectedInsuranceId,
  onInsuranceSelect,
  placeholder = 'Search insurances...',
  disabled = false,
  className,
}: InsuranceAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  
  // Use backend search when user types, otherwise use provided insurances
  const { insurances: searchResults, loading: searchLoading } = useInsuranceSearch(inputValue)
  
  const displayInsurances = React.useMemo(() => {
    // If we have a search query (2+ chars), use backend results
    // Otherwise, use the provided insurances list
    if (inputValue.length >= 2) {
      return searchResults
    }
    return insurances
  }, [inputValue, searchResults, insurances])

  const selectedInsurance = React.useMemo(() => {
    // First try to find in the original insurances list
    let insurance = insurances.find(i => String(i.id) === selectedInsuranceId)
    
    // If not found and we have search results, try to find there
    if (!insurance && searchResults.length > 0) {
      insurance = searchResults.find(i => String(i.id) === selectedInsuranceId)
    }
    
    return insurance
  }, [insurances, searchResults, selectedInsuranceId])

  const handleSelect = (insuranceId: string) => {
    onInsuranceSelect(insuranceId)
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
    onInsuranceSelect('')
    setInputValue('')
  }

  const getDisplayText = (insurance: InsuranceProvider) => {
    const label = insurance.insuranceName || insurance.name || ''
    return insurance.acronym ? `${label} (${insurance.acronym})` : label
  }

  // If an insurance is selected, show a cleaner UI with just the name and clear button
  if (selectedInsurance) {
    return (
      <div className={cn('flex items-center gap-2 w-full', className)}>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{selectedInsurance.insuranceName || selectedInsurance.name}</span>
            {selectedInsurance.acronym && (
              <span className="text-xs text-muted-foreground">{selectedInsurance.acronym}</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            className="h-6 w-6 p-0 rounded-full hover:bg-muted-foreground/20 ml-auto"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between rounded-lg', className)}
          disabled={disabled}
        >
          {placeholder}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 rounded-lg" align="start">
        <Command>
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
                  onSelect={() => handleSelect(String(insurance.id))}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      String(insurance.id) === selectedInsuranceId ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{insurance.insuranceName || insurance.name}</span>
                    {insurance.acronym && (
                      <span className="text-xs text-muted-foreground">{insurance.acronym}</span>
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
