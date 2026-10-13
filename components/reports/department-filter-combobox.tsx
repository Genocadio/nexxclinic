"use client"

import React, { useState, useMemo } from "react"
import { Building2, Search, Check, X, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export interface DepartmentOption {
  id: string
  name: string
  code?: string
  description?: string
}

interface DepartmentFilterComboboxProps {
  departments: DepartmentOption[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  loading?: boolean
  className?: string
}

export function DepartmentFilterCombobox({
  departments,
  selectedIds,
  onChange,
  loading = false,
  className,
}: DepartmentFilterComboboxProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter departments based on search query
  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) return departments
    const q = searchQuery.toLowerCase().trim()
    return departments.filter((d) => {
      const name = (d.name || "").toLowerCase()
      const code = (d.code || "").toLowerCase()
      return name.includes(q) || code.includes(q)
    })
  }, [departments, searchQuery])

  // Get selected objects for chips
  const selectedDepartments = useMemo(() => {
    return departments.filter((d) => selectedIds.includes(d.id))
  }, [departments, selectedIds])

  const toggleDepartment = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  const handleClearAll = () => {
    onChange([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size="sm"
          className={cn(
            "h-8 rounded-xl text-xs bg-background/80 hover:bg-background justify-between gap-1.5 px-2.5 font-normal border-border/80 shadow-2xs",
            selectedIds.length > 0 && "border-primary/40 text-foreground font-medium",
            className
          )}
        >
          <div className="flex items-center gap-1.5 truncate max-w-[140px] sm:max-w-[180px]">
            <Building2
              className={cn(
                "h-3 w-3 shrink-0",
                selectedIds.length > 0 ? "text-primary" : "text-muted-foreground"
              )}
            />
            {selectedIds.length === 0 ? (
              <span className="truncate text-muted-foreground">All Departments</span>
            ) : selectedIds.length === 1 ? (
              <span className="truncate">
                {selectedDepartments[0]?.name}
              </span>
            ) : (
              <span className="truncate">
                {selectedIds.length} Departments
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {selectedIds.length > 0 && (
              <Badge
                variant="secondary"
                className="h-4 px-1 text-[10px] font-semibold bg-primary/15 text-primary border-0"
              >
                {selectedIds.length}
              </Badge>
            )}
            <ChevronsUpDown className="h-3 w-3 opacity-50 shrink-0 ml-0.5" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-72 sm:w-80 p-0 rounded-2xl shadow-xl border-border/80 bg-card/95 backdrop-blur-xl z-50 overflow-hidden"
      >
        {/* Search Header */}
        <div className="p-2.5 border-b border-border/40 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search department name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-7 text-xs rounded-xl bg-background border-border/60 focus-visible:ring-1 focus-visible:ring-primary/40"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick actions row */}
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/30 text-[11px]">
            <button
              type="button"
              onClick={handleClearAll}
              className={cn(
                "hover:underline font-medium cursor-pointer transition-colors",
                selectedIds.length === 0 ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All Departments (Reset)
            </button>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-destructive/80 hover:text-destructive cursor-pointer hover:underline"
              >
                Clear Selection ({selectedIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Selected Departments Chips (if any selected) */}
        {selectedIds.length > 0 && (
          <div className="p-2 border-b border-border/30 bg-primary/5 flex flex-wrap gap-1 max-h-24 overflow-y-auto">
            {selectedDepartments.map((d) => (
              <Badge
                key={d.id}
                variant="outline"
                className="text-[10px] py-0.5 px-2 bg-background/80 hover:bg-background border-primary/30 text-foreground flex items-center gap-1 rounded-lg"
              >
                <span className="truncate max-w-[120px]">
                  {d.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleDepartment(d.id)
                  }}
                  className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted p-0.5"
                  title={`Remove ${d.name}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Scrollable Departments List */}
        <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
          {loading ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Loading departments...
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              {searchQuery ? `No departments found matching "${searchQuery}"` : "No departments available."}
            </div>
          ) : (
            filteredDepartments.map((d) => {
              const isSelected = selectedIds.includes(d.id)
              return (
                <div
                  key={d.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleDepartment(d.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      toggleDepartment(d.id)
                    }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-xl text-left cursor-pointer transition-colors text-xs group",
                    isSelected
                      ? "bg-primary/10 text-foreground hover:bg-primary/15"
                      : "hover:bg-muted/60 text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleDepartment(d.id)}
                      className="rounded-md"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="w-6 h-6 rounded-full bg-primary/15 text-primary text-[10px] font-semibold flex items-center justify-center shrink-0">
                      <Building2 className="h-3 w-3" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate text-foreground">
                        {d.name}
                      </p>
                      {d.code && (
                        <p className="text-[10px] text-muted-foreground truncate">
                          Code: {d.code}
                        </p>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-1.5" />
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Footer with count */}
        <div className="p-2 border-t border-border/40 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground px-3">
          <span>
            {selectedIds.length === 0 ? "Viewing all departments" : `${selectedIds.length} of ${departments.length} selected`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-6 px-2 text-[11px] rounded-lg"
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
