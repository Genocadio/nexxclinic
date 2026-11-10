"use client"

import React, { useState, useMemo } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  SlidersHorizontal,
  Building2,
  UserCheck,
  CreditCard,
  Search,
  X,
  RotateCcw,
  Check,
  Banknote,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface DepartmentOption {
  id: string
  name: string
  code?: string
  description?: string
}

export interface ClinicianOption {
  id: string
  firstName?: string
  lastName?: string
  fullName?: string
  name?: string
  email?: string
  username?: string
  roles?: string[]
}

export interface InsuranceOption {
  id: string
  name?: string
  insuranceName?: string
  acronym?: string | null
  code?: string
}

export interface ReportsInMenuFilterProps {
  departments: DepartmentOption[]
  selectedDepartmentIds: string[]
  onDepartmentChange: (ids: string[]) => void

  clinicians: ClinicianOption[]
  selectedClinicianIds: string[]
  onClinicianChange: (ids: string[]) => void
  loadingClinicians?: boolean

  insurances: InsuranceOption[]
  selectedInsuranceIds: string[]
  isPrivateOnly: boolean
  onPayerChange: (params: { insuranceIds: string[]; isPrivateOnly: boolean }) => void

  className?: string
}

type FilterCategory = "departments" | "clinicians" | "payers"

export function ReportsInMenuFilter({
  departments = [],
  selectedDepartmentIds = [],
  onDepartmentChange,
  clinicians = [],
  selectedClinicianIds = [],
  onClinicianChange,
  loadingClinicians = false,
  insurances = [],
  selectedInsuranceIds = [],
  isPrivateOnly = false,
  onPayerChange,
  className,
}: ReportsInMenuFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("departments")
  const [searchQuery, setSearchQuery] = useState("")

  const activeFilterCount =
    selectedDepartmentIds.length +
    selectedClinicianIds.length +
    selectedInsuranceIds.length +
    (isPrivateOnly ? 1 : 0)

  const hasActiveFilters = activeFilterCount > 0

  // Summary label for minimized floating filter button
  const appliedFilterSummary = useMemo(() => {
    if (!hasActiveFilters) return "Filters"
    const labels: string[] = []

    if (selectedDepartmentIds.length > 0) {
      const matched = departments.find((d) => d.id === selectedDepartmentIds[0])
      labels.push(matched?.name || `${selectedDepartmentIds.length} Depts`)
    }
    if (selectedClinicianIds.length > 0) {
      const matched = clinicians.find((c) => c.id === selectedClinicianIds[0])
      const clinicianName =
        matched?.fullName ||
        matched?.name ||
        (matched?.firstName
          ? `${matched.firstName} ${matched.lastName || ""}`.trim()
          : `${selectedClinicianIds.length} Clinicians`)
      labels.push(clinicianName)
    }
    if (isPrivateOnly) {
      labels.push("Private")
    } else if (selectedInsuranceIds.length > 0) {
      const matched = insurances.find((i) => i.id === selectedInsuranceIds[0])
      labels.push(
        matched?.acronym ||
        matched?.name ||
        matched?.insuranceName ||
        `${selectedInsuranceIds.length} Payers`
      )
    }

    if (labels.length === 1) return labels[0]
    return `${labels[0]} +${activeFilterCount - 1}`
  }, [
    hasActiveFilters,
    activeFilterCount,
    selectedDepartmentIds,
    departments,
    selectedClinicianIds,
    clinicians,
    isPrivateOnly,
    selectedInsuranceIds,
    insurances,
  ])

  // Clear all filters across all categories
  const handleResetAll = () => {
    onDepartmentChange([])
    onClinicianChange([])
    onPayerChange({ insuranceIds: [], isPrivateOnly: false })
  }

  // Filtered lists based on category and in-menu search
  const filteredDepartments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return departments
    return departments.filter(
      (d) =>
        (d.name || "").toLowerCase().includes(q) ||
        (d.code || "").toLowerCase().includes(q)
    )
  }, [departments, searchQuery])

  const filteredClinicians = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return clinicians
    return clinicians.filter((c) => {
      const fn = (c.firstName || "").toLowerCase()
      const ln = (c.lastName || "").toLowerCase()
      const full = (c.fullName || c.name || `${fn} ${ln}`).toLowerCase()
      const email = (c.email || "").toLowerCase()
      const username = (c.username || "").toLowerCase()
      return (
        full.includes(q) ||
        fn.includes(q) ||
        ln.includes(q) ||
        email.includes(q) ||
        username.includes(q)
      )
    })
  }, [clinicians, searchQuery])

  const filteredInsurances = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return insurances
    return insurances.filter((i) => {
      const name = (i.name || i.insuranceName || "").toLowerCase()
      const acr = (i.acronym || i.code || "").toLowerCase()
      return name.includes(q) || acr.includes(q)
    })
  }, [insurances, searchQuery])

  // Toggle helpers
  const toggleDepartment = (id: string) => {
    if (selectedDepartmentIds.includes(id)) {
      onDepartmentChange(selectedDepartmentIds.filter((item) => item !== id))
    } else {
      onDepartmentChange([...selectedDepartmentIds, id])
    }
  }

  const toggleClinician = (id: string) => {
    if (selectedClinicianIds.includes(id)) {
      onClinicianChange(selectedClinicianIds.filter((item) => item !== id))
    } else {
      onClinicianChange([...selectedClinicianIds, id])
    }
  }

  const toggleInsurance = (id: string) => {
    if (selectedInsuranceIds.includes(id)) {
      onPayerChange({
        insuranceIds: selectedInsuranceIds.filter((item) => item !== id),
        isPrivateOnly: false,
      })
    } else {
      onPayerChange({
        insuranceIds: [...selectedInsuranceIds, id],
        isPrivateOnly: false,
      })
    }
  }

  const togglePrivateOnly = () => {
    onPayerChange({
      insuranceIds: [],
      isPrivateOnly: !isPrivateOnly,
    })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          size="sm"
          title={appliedFilterSummary}
          aria-label={appliedFilterSummary}
          className={cn(
            "group relative h-9 w-9 sm:w-auto p-0 sm:px-3.5 text-xs rounded-full backdrop-blur-xl font-semibold flex items-center justify-center sm:justify-start gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 select-none",
            hasActiveFilters
              ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary shadow-primary/25"
              : "bg-card/95 border-border/80 text-foreground hover:bg-card hover:border-primary/50 hover:text-primary",
            className
          )}
        >
          <div
            className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
              hasActiveFilters
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
            )}
          >
            <SlidersHorizontal className="h-3 w-3" />
          </div>

          <span className="hidden sm:inline font-semibold max-w-[150px] truncate">
            {appliedFilterSummary}
          </span>

          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="hidden sm:inline-flex h-4 px-1 text-[10px] rounded-full bg-background/20 text-current font-mono font-bold"
            >
              {activeFilterCount}
            </Badge>
          )}

          {/* Mobile-only active indicator dot */}
          {hasActiveFilters && (
            <span className="sm:hidden absolute top-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={10}
        className="w-[330px] sm:w-[370px] p-3 rounded-2xl shadow-2xl border border-border/80 bg-card/95 backdrop-blur-2xl space-y-2.5 z-[150]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <SlidersHorizontal className="h-3 w-3" />
            </div>
            <span className="text-xs font-bold text-foreground">Filter Reports</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="h-4 px-1.5 text-[10px] rounded-full font-mono font-bold">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetAll}
              className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-destructive rounded-lg gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset all</span>
            </Button>
          )}
        </div>

        {/* Category Segmented Navigation */}
        <div className="grid grid-cols-3 gap-1 bg-muted/60 p-0.5 rounded-xl border border-border/50 text-[11px] font-medium">
          <button
            type="button"
            onClick={() => {
              setActiveCategory("departments")
              setSearchQuery("")
            }}
            className={cn(
              "flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg transition-all cursor-pointer truncate",
              activeCategory === "departments"
                ? "bg-card text-foreground font-bold shadow-2xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Building2 className="h-3 w-3 shrink-0" />
            <span className="truncate">Depts</span>
            {selectedDepartmentIds.length > 0 && (
              <Badge
                variant="secondary"
                className="h-3.5 px-1 text-[9px] rounded-full bg-primary/15 text-primary font-mono ml-0.5"
              >
                {selectedDepartmentIds.length}
              </Badge>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCategory("clinicians")
              setSearchQuery("")
            }}
            className={cn(
              "flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg transition-all cursor-pointer truncate",
              activeCategory === "clinicians"
                ? "bg-card text-foreground font-bold shadow-2xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <UserCheck className="h-3 w-3 shrink-0" />
            <span className="truncate">Clinicians</span>
            {selectedClinicianIds.length > 0 && (
              <Badge
                variant="secondary"
                className="h-3.5 px-1 text-[9px] rounded-full bg-primary/15 text-primary font-mono ml-0.5"
              >
                {selectedClinicianIds.length}
              </Badge>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCategory("payers")
              setSearchQuery("")
            }}
            className={cn(
              "flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg transition-all cursor-pointer truncate",
              activeCategory === "payers"
                ? "bg-card text-foreground font-bold shadow-2xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <CreditCard className="h-3 w-3 shrink-0" />
            <span className="truncate">Payers</span>
            {(selectedInsuranceIds.length > 0 || isPrivateOnly) && (
              <Badge
                variant="secondary"
                className="h-3.5 px-1 text-[9px] rounded-full bg-primary/15 text-primary font-mono ml-0.5"
              >
                {selectedInsuranceIds.length + (isPrivateOnly ? 1 : 0)}
              </Badge>
            )}
          </button>
        </div>

        {/* Integrated In-Menu Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeCategory === "departments"
                ? "Search departments..."
                : activeCategory === "clinicians"
                ? "Search clinicians..."
                : "Search payers & schemes..."
            }
            className="h-8 pl-8 pr-7 text-xs rounded-xl bg-background/80 border-border/70 focus-visible:ring-1 focus-visible:ring-primary/40"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-2 h-4 w-4 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* In-Menu Options List (No Nested Popovers!) */}
        <div className="max-h-56 overflow-y-auto space-y-1 pr-1 overscroll-contain">
          {/* DEPARTMENTS TAB */}
          {activeCategory === "departments" && (
            <>
              {filteredDepartments.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No departments match "{searchQuery}"
                </div>
              ) : (
                filteredDepartments.map((dept) => {
                  const isChecked = selectedDepartmentIds.includes(dept.id)
                  return (
                    <div
                      key={dept.id}
                      onClick={() => toggleDepartment(dept.id)}
                      className={cn(
                        "flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer select-none transition-colors",
                        isChecked
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted/60"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleDepartment(dept.id)}
                          className="data-[state=checked]:bg-primary shrink-0"
                        />
                        <span className="truncate">{dept.name}</span>
                      </div>
                      {dept.code && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0 font-mono text-muted-foreground shrink-0 uppercase"
                        >
                          {dept.code}
                        </Badge>
                      )}
                    </div>
                  )
                })
              )}
            </>
          )}

          {/* CLINICIANS TAB */}
          {activeCategory === "clinicians" && (
            <>
              {loadingClinicians ? (
                <div className="flex items-center justify-center py-6 text-xs text-muted-foreground gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  <span>Loading clinicians roster...</span>
                </div>
              ) : filteredClinicians.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No clinicians match "{searchQuery}"
                </div>
              ) : (
                filteredClinicians.map((clinician) => {
                  const isChecked = selectedClinicianIds.includes(clinician.id)
                  const name =
                    clinician.fullName ||
                    clinician.name ||
                    (clinician.firstName
                      ? `${clinician.firstName} ${clinician.lastName || ""}`.trim()
                      : clinician.username || clinician.id)
                  const role = clinician.roles?.[0] || "Clinician"

                  return (
                    <div
                      key={clinician.id}
                      onClick={() => toggleClinician(clinician.id)}
                      className={cn(
                        "flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer select-none transition-colors",
                        isChecked
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted/60"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleClinician(clinician.id)}
                          className="data-[state=checked]:bg-primary shrink-0"
                        />
                        <span className="truncate">{name}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0 font-mono text-muted-foreground shrink-0 capitalize"
                      >
                        {role.toLowerCase()}
                      </Badge>
                    </div>
                  )
                })
              )}
            </>
          )}

          {/* PAYERS TAB */}
          {activeCategory === "payers" && (
            <>
              {/* Private Patients Quick Toggle */}
              <div
                onClick={togglePrivateOnly}
                className={cn(
                  "flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs cursor-pointer select-none border transition-colors mb-1.5",
                  isPrivateOnly
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold"
                    : "border-border/60 hover:bg-muted/60 text-foreground"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Checkbox
                    checked={isPrivateOnly}
                    onCheckedChange={togglePrivateOnly}
                    className="data-[state=checked]:bg-amber-600 shrink-0"
                  />
                  <div className="flex items-center gap-1.5 truncate">
                    <Banknote className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="truncate">Private Patients</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0 font-mono shrink-0 uppercase",
                    isPrivateOnly
                      ? "border-amber-500/40 text-amber-700 dark:text-amber-300"
                      : "text-muted-foreground"
                  )}
                >
                  Cash / POS
                </Badge>
              </div>

              {/* Insurances List */}
              {filteredInsurances.length === 0 ? (
                <div className="text-center py-4 text-xs text-muted-foreground">
                  No insurance schemes match "{searchQuery}"
                </div>
              ) : (
                filteredInsurances.map((ins) => {
                  const isChecked = selectedInsuranceIds.includes(ins.id)
                  const name = ins.name || ins.insuranceName || "Insurance"
                  const acr = ins.acronym || ins.code

                  return (
                    <div
                      key={ins.id}
                      onClick={() => toggleInsurance(ins.id)}
                      className={cn(
                        "flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer select-none transition-colors",
                        isChecked
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted/60"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleInsurance(ins.id)}
                          className="data-[state=checked]:bg-primary shrink-0"
                        />
                        <span className="truncate">{name}</span>
                      </div>
                      {acr && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0 font-mono text-muted-foreground shrink-0 uppercase"
                        >
                          {acr}
                        </Badge>
                      )}
                    </div>
                  )
                })
              )}
            </>
          )}
        </div>

        {/* Applied Filter Chips Footer */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-border/50 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
              <span>Applied filters:</span>
              <button
                type="button"
                onClick={handleResetAll}
                className="text-[10px] text-destructive hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pr-0.5">
              {/* Dept chips */}
              {selectedDepartmentIds.map((id) => {
                const dept = departments.find((d) => d.id === id)
                return (
                  <Badge
                    key={`d-${id}`}
                    variant="secondary"
                    className="h-5 px-1.5 text-[10px] rounded-lg gap-1 bg-primary/10 text-primary hover:bg-primary/20 shrink-0 font-medium"
                  >
                    <span className="truncate max-w-[90px]">{dept?.name || "Dept"}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleDepartment(id)
                      }}
                      className="hover:text-destructive cursor-pointer"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                )
              })}

              {/* Clinician chips */}
              {selectedClinicianIds.map((id) => {
                const c = clinicians.find((item) => item.id === id)
                const name =
                  c?.fullName ||
                  c?.name ||
                  (c?.firstName ? `${c.firstName} ${c.lastName || ""}`.trim() : "Clinician")
                return (
                  <Badge
                    key={`c-${id}`}
                    variant="secondary"
                    className="h-5 px-1.5 text-[10px] rounded-lg gap-1 bg-primary/10 text-primary hover:bg-primary/20 shrink-0 font-medium"
                  >
                    <span className="truncate max-w-[90px]">{name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleClinician(id)
                      }}
                      className="hover:text-destructive cursor-pointer"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                )
              })}

              {/* Private chip */}
              {isPrivateOnly && (
                <Badge
                  variant="secondary"
                  className="h-5 px-1.5 text-[10px] rounded-lg gap-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 shrink-0 font-medium"
                >
                  <span>Private</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePrivateOnly()
                    }}
                    className="hover:text-destructive cursor-pointer"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              )}

              {/* Payer chips */}
              {selectedInsuranceIds.map((id) => {
                const ins = insurances.find((item) => item.id === id)
                const name = ins?.acronym || ins?.name || ins?.insuranceName || "Payer"
                return (
                  <Badge
                    key={`p-${id}`}
                    variant="secondary"
                    className="h-5 px-1.5 text-[10px] rounded-lg gap-1 bg-primary/10 text-primary hover:bg-primary/20 shrink-0 font-medium"
                  >
                    <span className="truncate max-w-[90px]">{name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleInsurance(id)
                      }}
                      className="hover:text-destructive cursor-pointer"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                )
              })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
