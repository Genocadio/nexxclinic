'use client'

import * as React from 'react'
import { Check, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface DepartmentOption {
  id: string | number
  name: string
}

interface DepartmentAutocompleteProps {
  departments: DepartmentOption[]
  selectedDepartmentId: string
  onDepartmentSelect: (departmentId: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DepartmentAutocomplete({
  departments,
  selectedDepartmentId,
  onDepartmentSelect,
  placeholder = 'Search departments...',
  disabled = false,
  className,
}: DepartmentAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const displayDepartments = React.useMemo(() => {
    if (!inputValue.trim()) return departments

    const query = inputValue.trim().toLowerCase()
    return departments.filter((dept) => dept.name.toLowerCase().includes(query))
  }, [departments, inputValue])

  const selectedDepartment = React.useMemo(() => {
    return departments.find((dept) => String(dept.id) === selectedDepartmentId)
  }, [departments, selectedDepartmentId])

  const handleSelect = (departmentId: string) => {
    onDepartmentSelect(departmentId)
    setOpen(false)
    setInputValue('')
  }

  const handleClearSelection = () => {
    onDepartmentSelect('')
    setInputValue('')
  }

  if (selectedDepartment) {
    return (
      <div className={cn('flex items-center gap-2 w-full', className)}>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
          <span className="text-sm font-medium">{selectedDepartment.name}</span>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleClearSelection}
            className="h-6 w-6 p-0 rounded-full hover:bg-muted-foreground/20"
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
          type="button"
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
            onValueChange={(value) => {
              setInputValue(value)
              if (!open && value.length > 0) {
                setOpen(true)
              }
            }}
          />
          <CommandList>
            <CommandEmpty>No departments found.</CommandEmpty>
            <CommandGroup>
              {displayDepartments.map((department) => (
                <CommandItem
                  key={department.id}
                  value={department.name}
                  onSelect={() => handleSelect(String(department.id))}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      String(department.id) === selectedDepartmentId ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {department.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}