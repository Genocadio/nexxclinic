"use client"

import React, { useState, useMemo } from "react"
import { ShieldCheck, Search, Check, X, ChevronsUpDown, ShieldAlert } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export interface InsuranceOption {
  id: string
  insuranceName: string
  acronym?: string | null
}

interface PayerFilterComboboxProps {
  insurances: InsuranceOption[]
  selectedInsuranceIds: string[]
  isPrivateOnly: boolean
  onChange: (options: { insuranceIds: string[]; isPrivateOnly: boolean }) => void
  loading?: boolean
  className?: string
}

export function PayerFilterCombobox({
  insurances,
  selectedInsuranceIds,
  isPrivateOnly,
  onChange,
  loading = false,
  className,
}: PayerFilterComboboxProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter insurances based on search query
  const filteredInsurances = useMemo(() => {
    if (!searchQuery.trim()) return insurances
    const q = searchQuery.toLowerCase().trim()
    return insurances.filter((ins) => {
      const name = (ins.insuranceName || "").toLowerCase()
      const acr = (ins.acronym || "").toLowerCase()
      return name.includes(q) || acr.includes(q)
    })
  }, [insurances, searchQuery])

  // Selected insurance objects
  const selectedInsurances = useMemo(() => {
    return insurances.filter((ins) => selectedInsuranceIds.includes(ins.id))
  }, [insurances, selectedInsuranceIds])

  const toggleInsurance = (id: string) => {
    // If private only was checked, clear it when selecting specific insurance
    const nextPrivate = false
    let nextIds: string[]
    if (selectedInsuranceIds.includes(id)) {
      nextIds = selectedInsuranceIds.filter((item) => item !== id)
    } else {
      nextIds = [...selectedInsuranceIds, id]
    }
    onChange({ insuranceIds: nextIds, isPrivateOnly: nextPrivate })
  }

  const togglePrivateOnly = () => {
    if (isPrivateOnly) {
      onChange({ insuranceIds: [], isPrivateOnly: false })
    } else {
      // Set private only, clear specific insurances
      onChange({ insuranceIds: [], isPrivateOnly: true })
    }
  }

  const handleClearAll = () => {
    onChange({ insuranceIds: [], isPrivateOnly: false })
  }

  const isFiltering = isPrivateOnly || selectedInsuranceIds.length > 0
  const totalSelectedCount = (isPrivateOnly ? 1 : 0) + selectedInsuranceIds.length

  // Trigger text label
  const triggerLabel = useMemo(() => {
    if (!isFiltering) return "All Payers"
    if (isPrivateOnly) return "Private Only (Cash)"
    if (selectedInsuranceIds.length === 1) {
      const ins = selectedInsurances[0]
      return ins?.acronym || ins?.insuranceName || "1 Insurance"
    }
    return `${selectedInsuranceIds.length} Insurances`
  }, [isFiltering, isPrivateOnly, selectedInsuranceIds.length, selectedInsurances])

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
            isFiltering && "border-primary/40 text-foreground font-medium",
            className
          )}
        >
          <div className="flex items-center gap-1.5 truncate max-w-[140px] sm:max-w-[180px]">
            <ShieldCheck
              className={cn(
                "h-3 w-3 shrink-0",
                isFiltering ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span className={cn("truncate", !isFiltering && "text-muted-foreground")}>
              {triggerLabel}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isFiltering && (
              <Badge
                variant="secondary"
                className="h-4 px-1 text-[10px] font-semibold bg-primary/15 text-primary border-0"
              >
                {totalSelectedCount}
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
              placeholder="Search insurance provider..."
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
                !isFiltering ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All Payers (Reset)
            </button>
            {isFiltering && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-destructive/80 hover:text-destructive cursor-pointer hover:underline"
              >
                Clear Selection ({totalSelectedCount})
              </button>
            )}
          </div>
        </div>

        {/* Selected Chips */}
        {isFiltering && (
          <div className="p-2 border-b border-border/30 bg-primary/5 flex flex-wrap gap-1 max-h-24 overflow-y-auto">
            {isPrivateOnly && (
              <Badge
                variant="outline"
                className="text-[10px] py-0.5 px-2 bg-background/80 hover:bg-background border-primary/30 text-foreground flex items-center gap-1 rounded-lg"
              >
                <span className="truncate max-w-[120px]">Private (Cash Only)</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePrivateOnly()
                  }}
                  className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted p-0.5"
                  title="Remove Private Only filter"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            )}
            {selectedInsurances.map((ins) => (
              <Badge
                key={ins.id}
                variant="outline"
                className="text-[10px] py-0.5 px-2 bg-background/80 hover:bg-background border-primary/30 text-foreground flex items-center gap-1 rounded-lg"
              >
                <span className="truncate max-w-[120px]">
                  {ins.acronym || ins.insuranceName}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleInsurance(ins.id)
                  }}
                  className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted p-0.5"
                  title={`Remove ${ins.acronym || ins.insuranceName}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Scrollable Payers List */}
        <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
          {/* Private Only Option */}
          <div
            role="button"
            tabIndex={0}
            onClick={togglePrivateOnly}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                togglePrivateOnly()
              }
            }}
            className={cn(
              "w-full flex items-center justify-between p-2 rounded-xl text-left cursor-pointer transition-colors text-xs border border-transparent",
              isPrivateOnly
                ? "bg-primary/10 text-foreground hover:bg-primary/15 border-primary/20"
                : "hover:bg-muted/60 text-foreground"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Checkbox
                checked={isPrivateOnly}
                onCheckedChange={togglePrivateOnly}
                className="rounded-md"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-semibold flex items-center justify-center shrink-0">
                <ShieldAlert className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate text-foreground">
                  Private Only (Cash)
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  Uninsured patient encounters only
                </p>
              </div>
            </div>

            {isPrivateOnly && (
              <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-1.5" />
            )}
          </div>

          <div className="my-1 border-t border-border/40" />

          {loading ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Loading insurance providers...
            </div>
          ) : filteredInsurances.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              {searchQuery ? `No insurance found matching "${searchQuery}"` : "No supported insurances available."}
            </div>
          ) : (
            filteredInsurances.map((ins) => {
              const isSelected = selectedInsuranceIds.includes(ins.id)
              return (
                <div
                  key={ins.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleInsurance(ins.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      toggleInsurance(ins.id)
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
                      onCheckedChange={() => toggleInsurance(ins.id)}
                      className="rounded-md"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="w-6 h-6 rounded-full bg-primary/15 text-primary text-[10px] font-semibold flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-3 w-3" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate text-foreground">
                        {ins.acronym ? `${ins.acronym} - ${ins.insuranceName}` : ins.insuranceName}
                      </p>
                      {ins.acronym && (
                        <p className="text-[10px] text-muted-foreground truncate">
                          Code: {ins.acronym}
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
            {!isFiltering ? "Viewing all payers" : `${totalSelectedCount} filter(s) active`}
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
