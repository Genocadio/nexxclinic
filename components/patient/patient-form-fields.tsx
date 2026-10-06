"use client"

import { useState, useMemo } from "react"
import type { InsuranceProvider } from "@/lib/api-types"
import type { RegisterPatientInput } from "@/hooks/patients/hooks"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field-error"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  sanitizePhoneInput,
  calculateAge,
  isDominantMemberRequired,
  validateDateOfBirth,
  canAddNewInsurance,
  parseRwandaNationalId,
  checkRwandaNationalIdMismatch,
} from "@/lib/validation-utils"
import { DatePickerGrid } from "@/components/ui/date-picker-grid"
import {
  COUNTRIES,
  RWANDA_PROVINCES,
  getRwandaDistricts,
  getRwandaSectors,
  getDistrictsForSelection,
  getSectorsForSelection,
  getCellsForSelection,
  getVillagesForSelection,
  isRwandaSelected,
} from "@/lib/location-data"

export interface PatientFormFieldsProps {
  formData: RegisterPatientInput
  onFieldChange: (field: string, value: string) => void
  onCountryChange: (country: string) => void
  onProvinceChange: (province: string) => void
  onDistrictChange: (district: string, province?: string) => void
  onSectorChange: (sector: string, district?: string, province?: string) => void
  onCellChange?: (cell: string, sector?: string, district?: string, province?: string) => void
  onVillageChange?: (village: string, cell?: string, sector?: string, district?: string, province?: string) => void
  onUpdateInsurance: (index: number, field: string, value: string | number | boolean) => void
  onRemoveInsurance: (index: number) => void
  availableInsurances: InsuranceProvider[]
  loading?: boolean
  dateError?: string
  /** Inline field errors keyed by dotted path, e.g. `firstName`, `insurance.0.card`. */
  fieldErrors?: Record<string, string>
  /** Fired when a field loses focus, with the field path and its current value. */
  onFieldBlur?: (field: string, value: string) => void
}

export default function PatientFormFields({
  formData,
  onFieldChange,
  onCountryChange,
  onProvinceChange,
  onDistrictChange,
  onSectorChange,
  onCellChange,
  onVillageChange,
  onUpdateInsurance,
  onRemoveInsurance,
  availableInsurances,
  dateError,
  fieldErrors = {},
  onFieldBlur,
}: PatientFormFieldsProps) {
  const [insurancePopoverOpen, setInsurancePopoverOpen] = useState<{
    [key: number]: boolean
  }>({})
  const [countryPopoverOpen, setCountryPopoverOpen] = useState(false)
  const [provincePopoverOpen, setProvincePopoverOpen] = useState(false)
  const [districtPopoverOpen, setDistrictPopoverOpen] = useState(false)
  const [sectorPopoverOpen, setSectorPopoverOpen] = useState(false)
  const [cellPopoverOpen, setCellPopoverOpen] = useState(false)
  const [villagePopoverOpen, setVillagePopoverOpen] = useState(false)
  // Emergency contact stays behind a small button (desktop density); it opens
  // automatically when editing a patient that already has one.
  const [emergencyOpen, setEmergencyOpen] = useState(false)

  const [countrySearch, setCountrySearch] = useState("")
  const [provinceSearch, setProvinceSearch] = useState("")
  const [districtSearch, setDistrictSearch] = useState("")
  const [sectorSearch, setSectorSearch] = useState("")
  const [cellSearch, setCellSearch] = useState("")
  const [villageSearch, setVillageSearch] = useState("")

  const prov = formData.contactInfo?.address?.province
  const dist = formData.contactInfo?.address?.district
  const sect = formData.contactInfo?.address?.sector
  const cell = formData.contactInfo?.address?.cell

  const rawDistricts = useMemo(() => getDistrictsForSelection(prov), [prov])
  const rawSectors = useMemo(() => getSectorsForSelection(prov, dist), [prov, dist])
  const rawCells = useMemo(() => getCellsForSelection(prov, dist, sect), [prov, dist, sect])
  const rawVillages = useMemo(() => getVillagesForSelection(prov, dist, sect, cell), [prov, dist, sect, cell])

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase()
    if (!q) return COUNTRIES.slice(0, 50)
    return COUNTRIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 50)
  }, [countrySearch])

  const filteredProvinces = useMemo(() => {
    const q = provinceSearch.trim().toLowerCase()
    if (!q) return RWANDA_PROVINCES
    return RWANDA_PROVINCES.filter((p) => p.toLowerCase().includes(q))
  }, [provinceSearch])

  const filteredDistricts = useMemo(() => {
    const q = districtSearch.trim().toLowerCase()
    if (!q) return rawDistricts.slice(0, 50)
    return rawDistricts.filter(
      (item) => item.district.toLowerCase().includes(q) || item.province.toLowerCase().includes(q)
    ).slice(0, 50)
  }, [rawDistricts, districtSearch])

  const filteredSectors = useMemo(() => {
    const q = sectorSearch.trim().toLowerCase()
    if (!q) return rawSectors.slice(0, 50)
    return rawSectors.filter(
      (item) => item.sector.toLowerCase().includes(q) || item.district.toLowerCase().includes(q) || item.province.toLowerCase().includes(q)
    ).slice(0, 50)
  }, [rawSectors, sectorSearch])

  const filteredCells = useMemo(() => {
    const q = cellSearch.trim().toLowerCase()
    if (!q) return rawCells.slice(0, 50)
    return rawCells.filter(
      (item) => item.cell.toLowerCase().includes(q) || item.sector.toLowerCase().includes(q) || item.district.toLowerCase().includes(q)
    ).slice(0, 50)
  }, [rawCells, cellSearch])

  const filteredVillages = useMemo(() => {
    const q = villageSearch.trim().toLowerCase()
    if (!q) return rawVillages.slice(0, 50)
    return rawVillages.filter(
      (item) => item.village.toLowerCase().includes(q) || item.cell.toLowerCase().includes(q) || item.sector.toLowerCase().includes(q)
    ).slice(0, 50)
  }, [rawVillages, villageSearch])

  const solidFieldClass = "w-full bg-white dark:bg-gray-900 border-border/70"
  const solidPanelClass =
    "rounded-2xl border border-border/60 bg-white dark:bg-slate-950 shadow-sm"
  const fieldValue = (value?: string | null) => value ?? ""

  const getInsuranceName = (insuranceId: string | number) => {
    if (!insuranceId || String(insuranceId) === "0")
      return "Select insurance..."
    const insurance = availableInsurances.find(
      (ins) => String(ins.id) === String(insuranceId),
    )
    return insurance
      ? `${insurance.acronym || insurance.insuranceName || insurance.name || 'Insurance'}`
      : 'Select insurance...'
  }

  const dobValidation = formData.dateOfBirth
    ? validateDateOfBirth(formData.dateOfBirth)
    : null

  const canAddInsurance = canAddNewInsurance(
    formData.insurances,
    formData.dateOfBirth,
  )

  const hasInsurances = Boolean(formData.insurances?.length)

  const hasEmergencyData = Boolean(
    formData.emergencyContact?.name?.trim() ||
      formData.emergencyContact?.relation?.trim() ||
      formData.emergencyContact?.phone?.trim(),
  )
  const showEmergency = emergencyOpen || hasEmergencyData

  const nidInfo = parseRwandaNationalId(formData.nationalIdNumber)
  const nidMismatch = checkRwandaNationalIdMismatch(
    formData.nationalIdNumber,
    formData.gender,
    formData.dateOfBirth,
  )

  return (
    <div className="@container flex flex-col gap-2 sm:gap-3">
      {/* Basic Information */}
      <div
        className={`${solidPanelClass} grid grid-cols-1 gap-2 p-2 sm:gap-3 sm:p-3 @md:grid-cols-2 @3xl:grid-cols-4`}
      >
        <div className="@md:col-span-2">
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
            Full Name *
          </label>
          <Input
            type="text"
            value={fieldValue(formData.name ?? [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(" "))}
            onChange={(e) => onFieldChange("name", e.target.value)}
            onBlur={() => onFieldBlur?.("name", formData.name || formData.firstName || "")}
            placeholder="Enter full name (e.g. Jean Paul Habimana)"
            className={`${solidFieldClass} rounded-xl focus:ring-primary/50 ${fieldErrors["name"] || fieldErrors["firstName"] ? "border-red-500" : ""}`}
            required
          />
          <FieldError message={fieldErrors["name"] || fieldErrors["firstName"]} />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
            Date of Birth *
          </label>
          <DatePickerGrid
            key={formData.dateOfBirth || "empty"}
            value={formData.dateOfBirth}
            onChange={(date) => onFieldChange("dateOfBirth", date)}
          />
          {formData.dateOfBirth && dobValidation?.valid && (
            <p className="text-xs text-muted-foreground mt-1">
              Age: {calculateAge(formData.dateOfBirth)} years
            </p>
          )}
          {dateError && (
            <p className="text-xs text-destructive mt-1">{dateError}</p>
          )}
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
            Gender
          </label>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 rounded-xl border border-border/70 bg-background dark:bg-gray-900 p-2 sm:p-3">
            <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-foreground cursor-pointer">
              <Checkbox
                checked={formData.gender === "M"}
                onCheckedChange={(checked) =>
                  onFieldChange("gender", checked ? "M" : "")
                }
              />
              Male
            </label>
            <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-foreground cursor-pointer">
              <Checkbox
                checked={formData.gender === "F"}
                onCheckedChange={(checked) =>
                  onFieldChange("gender", checked ? "F" : "")
                }
              />
              Female
            </label>
          </div>
          <FieldError message={fieldErrors["gender"]} />
        </div>
        <div className="@3xl:col-span-2">
          <div className="flex items-center justify-between gap-1 mb-1 sm:mb-1.5">
            <label className="block text-xs sm:text-sm font-medium text-foreground">
              National ID / Passport Number
            </label>
            {nidInfo.valid && !nidMismatch.hasMismatch && (
              <span className="text-[11px] sm:text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                🇷🇼 NID: {nidInfo.genderLabel}, {nidInfo.yearOfBirth}
              </span>
            )}
          </div>
          <Input
            type="text"
            value={fieldValue(formData.nationalIdNumber)}
            onChange={(e) => onFieldChange("nationalIdNumber", e.target.value)}
            onBlur={() => onFieldBlur?.("nationalIdNumber", formData.nationalIdNumber || "")}
            placeholder="Enter 16-digit national ID or passport"
            className={cn(
              solidFieldClass,
              nidMismatch.hasMismatch && "border-amber-500/80 focus-visible:ring-amber-500/30"
            )}
          />
          {nidMismatch.hasMismatch && nidMismatch.warning && (
            <p className="text-[12px] text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center gap-1">
              <span>⚠️</span>
              <span>{nidMismatch.warning}</span>
            </p>
          )}
        </div>
        <div className="@3xl:col-span-2">
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
            Phone Number
          </label>
          <Input
            type="tel"
            value={fieldValue(formData.contactInfo?.phone)}
            onChange={(e) =>
              onFieldChange("contactInfo.phone", sanitizePhoneInput(e.target.value))
            }
            onBlur={() => onFieldBlur?.("contactInfo.phone", formData.contactInfo?.phone || "")}
            placeholder="e.g. 0788 123 456 or +250 788 123 456"
            className={solidFieldClass}
          />
        </div>
      </div>

      {/* Address */}
      <div
        className={`${solidPanelClass} border-t p-2 sm:p-3`}
      >
        <h4 className="mb-1 text-sm font-medium text-foreground sm:mb-2">
          Address
        </h4>

        <div className="grid grid-cols-1 gap-2 @md:grid-cols-2 @2xl:grid-cols-3 @3xl:grid-cols-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
              Country
            </label>
            <Popover
              open={countryPopoverOpen}
              onOpenChange={(open) => {
                setCountryPopoverOpen(open)
                if (!open) setCountrySearch("")
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={countryPopoverOpen}
                  className="w-full justify-between bg-background dark:bg-gray-900 border-border/70 text-left font-normal"
                >
                  <span className="truncate">
                    {formData.contactInfo?.address?.country || "Select country..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] min-w-[240px] p-0 bg-white dark:bg-slate-900 text-foreground border-border/80 shadow-2xl opacity-100 z-[160] backdrop-blur-none"
                align="start"
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search country..."
                    value={countrySearch}
                    onValueChange={setCountrySearch}
                  />
                  <CommandList className="max-h-60 overflow-y-auto">
                    {filteredCountries.length === 0 && (
                      <CommandEmpty>No country found.</CommandEmpty>
                    )}
                    <CommandGroup>
                      {filteredCountries.map((country) => (
                        <CommandItem
                          key={country}
                          value={country}
                          onSelect={() => {
                            onCountryChange(country)
                            setCountryPopoverOpen(false)
                            setCountrySearch("")
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 shrink-0",
                              formData.contactInfo?.address?.country === country
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {country}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Rwanda cascading / smart direct dropdowns */}
          {isRwandaSelected(formData.contactInfo?.address?.country) ? (
            <>
              <div className="contents">
                {/* Province */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                    Province
                  </label>
                  <Popover
                    open={provincePopoverOpen}
                    onOpenChange={(open) => {
                      setProvincePopoverOpen(open)
                      if (!open) setProvinceSearch("")
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={provincePopoverOpen}
                        className="w-full justify-between bg-background dark:bg-gray-900 border-border/70 text-left font-normal"
                      >
                        <span className="truncate">
                          {formData.contactInfo?.address?.province || "Select province..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-0 bg-white dark:bg-slate-900 text-foreground border-border/80 shadow-2xl opacity-100 z-[160] backdrop-blur-none"
                      align="start"
                    >
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search province..."
                          value={provinceSearch}
                          onValueChange={setProvinceSearch}
                        />
                        <CommandList className="max-h-60 overflow-y-auto">
                          {filteredProvinces.length === 0 && (
                            <CommandEmpty>No province found.</CommandEmpty>
                          )}
                          <CommandGroup>
                            {filteredProvinces.map((province) => (
                              <CommandItem
                                key={province}
                                value={province}
                                onSelect={() => {
                                  onProvinceChange(province)
                                  setProvincePopoverOpen(false)
                                  setProvinceSearch("")
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 shrink-0",
                                    formData.contactInfo?.address?.province === province
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {province}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* District (smart selector with province sublabel) */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                    District
                  </label>
                  <Popover
                    open={districtPopoverOpen}
                    onOpenChange={(open) => {
                      setDistrictPopoverOpen(open)
                      if (!open) setDistrictSearch("")
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={districtPopoverOpen}
                        className="w-full justify-between bg-background dark:bg-gray-900 border-border/70 text-left font-normal"
                      >
                        <span className="truncate">
                          {formData.contactInfo?.address?.district || "Select district..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] min-w-[240px] p-0 bg-white dark:bg-slate-900 text-foreground border-border/80 shadow-2xl opacity-100 z-[160] backdrop-blur-none"
                      align="start"
                    >
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search district..."
                          value={districtSearch}
                          onValueChange={setDistrictSearch}
                        />
                        <CommandList className="max-h-60 overflow-y-auto">
                          {filteredDistricts.length === 0 && (
                            <CommandEmpty>No district found.</CommandEmpty>
                          )}
                          <CommandGroup>
                            {filteredDistricts.map((item) => (
                              <CommandItem
                                key={`${item.province}-${item.district}`}
                                value={`${item.district} ${item.province}`}
                                onSelect={() => {
                                  onDistrictChange(item.district, item.province)
                                  setDistrictPopoverOpen(false)
                                  setDistrictSearch("")
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 shrink-0",
                                    formData.contactInfo?.address?.district === item.district
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <div className="flex flex-col min-w-0">
                                  <span className="font-medium text-foreground text-xs sm:text-sm [[data-selected=true]_&]:text-accent-foreground">{item.district}</span>
                                  <span className="text-[11px] sm:text-[12px] text-muted-foreground [[data-selected=true]_&]:text-accent-foreground/80">{item.province}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Sector (smart direct selector with district and province sublabel) */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                    Sector
                  </label>
                  <Popover
                    open={sectorPopoverOpen}
                    onOpenChange={(open) => {
                      setSectorPopoverOpen(open)
                      if (!open) setSectorSearch("")
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={sectorPopoverOpen}
                        className="w-full justify-between bg-background dark:bg-gray-900 border-border/70 text-left font-normal"
                      >
                        <span className="truncate">
                          {formData.contactInfo?.address?.sector || "Select sector..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0 bg-white dark:bg-slate-900 text-foreground border-border/80 shadow-2xl opacity-100 z-[160] backdrop-blur-none"
                      align="start"
                    >
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search any sector..."
                          value={sectorSearch}
                          onValueChange={setSectorSearch}
                        />
                        <CommandList className="max-h-60 overflow-y-auto">
                          {filteredSectors.length === 0 && (
                            <CommandEmpty>No sector found.</CommandEmpty>
                          )}
                          <CommandGroup>
                            {filteredSectors.map((item) => {
                              const isSelected =
                                formData.contactInfo?.address?.sector === item.sector &&
                                (!formData.contactInfo?.address?.district ||
                                  formData.contactInfo?.address?.district === item.district)
                              return (
                                <CommandItem
                                  key={`${item.province}-${item.district}-${item.sector}`}
                                  value={`${item.sector} ${item.district} ${item.province}`}
                                  onSelect={() => {
                                    onSectorChange(item.sector, item.district, item.province)
                                    setSectorPopoverOpen(false)
                                    setSectorSearch("")
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4 shrink-0",
                                      isSelected ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-medium text-foreground text-xs sm:text-sm [[data-selected=true]_&]:text-accent-foreground">{item.sector}</span>
                                    <span className="text-[11px] sm:text-[12px] text-muted-foreground [[data-selected=true]_&]:text-accent-foreground/80">
                                      {item.district}, {item.province}
                                    </span>
                                  </div>
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="contents">
                {/* Cell (smart selector with sector, district sublabel) */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                    Cell
                  </label>
                  <Popover
                    open={cellPopoverOpen}
                    onOpenChange={(open) => {
                      setCellPopoverOpen(open)
                      if (!open) setCellSearch("")
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={cellPopoverOpen}
                        className="w-full justify-between bg-background dark:bg-gray-900 border-border/70 text-left font-normal"
                      >
                        <span className="truncate">
                          {formData.contactInfo?.address?.cell || "Select cell..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0 bg-white dark:bg-slate-900 text-foreground border-border/80 shadow-2xl opacity-100 z-[160] backdrop-blur-none"
                      align="start"
                    >
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search any cell..."
                          value={cellSearch}
                          onValueChange={setCellSearch}
                        />
                        <CommandList className="max-h-60 overflow-y-auto">
                          {filteredCells.length === 0 && (
                            <CommandEmpty>No cell found.</CommandEmpty>
                          )}
                          <CommandGroup>
                            {filteredCells.map((item) => {
                              const isSelected =
                                formData.contactInfo?.address?.cell === item.cell &&
                                (!formData.contactInfo?.address?.sector ||
                                  formData.contactInfo?.address?.sector === item.sector)
                              return (
                                <CommandItem
                                  key={`${item.province}-${item.district}-${item.sector}-${item.cell}`}
                                  value={`${item.cell} ${item.sector} ${item.district}`}
                                  onSelect={() => {
                                    if (onCellChange) {
                                      onCellChange(item.cell, item.sector, item.district, item.province)
                                    } else {
                                      onFieldChange("contactInfo.address.cell", item.cell)
                                    }
                                    setCellPopoverOpen(false)
                                    setCellSearch("")
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4 shrink-0",
                                      isSelected ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-medium text-foreground text-xs sm:text-sm [[data-selected=true]_&]:text-accent-foreground">{item.cell}</span>
                                    <span className="text-[11px] sm:text-[12px] text-muted-foreground [[data-selected=true]_&]:text-accent-foreground/80">
                                      {item.sector}, {item.district}
                                    </span>
                                  </div>
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Village (smart selector with cell, sector, district sublabel) */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                    Village
                  </label>
                  <Popover
                    open={villagePopoverOpen}
                    onOpenChange={(open) => {
                      setVillagePopoverOpen(open)
                      if (!open) setVillageSearch("")
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={villagePopoverOpen}
                        className="w-full justify-between bg-background dark:bg-gray-900 border-border/70 text-left font-normal"
                      >
                        <span className="truncate">
                          {formData.contactInfo?.address?.village || "Select village..."}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0 bg-white dark:bg-slate-900 text-foreground border-border/80 shadow-2xl opacity-100 z-[160] backdrop-blur-none"
                      align="start"
                    >
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search any village..."
                          value={villageSearch}
                          onValueChange={setVillageSearch}
                        />
                        <CommandList className="max-h-60 overflow-y-auto">
                          {filteredVillages.length === 0 && (
                            <CommandEmpty>No village found.</CommandEmpty>
                          )}
                          <CommandGroup>
                            {filteredVillages.map((item) => {
                              const isSelected =
                                formData.contactInfo?.address?.village === item.village &&
                                (!formData.contactInfo?.address?.cell ||
                                  formData.contactInfo?.address?.cell === item.cell)
                              return (
                                <CommandItem
                                  key={`${item.province}-${item.district}-${item.sector}-${item.cell}-${item.village}`}
                                  value={`${item.village} ${item.cell} ${item.sector} ${item.district}`}
                                  onSelect={() => {
                                    if (onVillageChange) {
                                      onVillageChange(item.village, item.cell, item.sector, item.district, item.province)
                                    } else {
                                      onFieldChange("contactInfo.address.village", item.village)
                                    }
                                    setVillagePopoverOpen(false)
                                    setVillageSearch("")
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4 shrink-0",
                                      isSelected ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-medium text-foreground text-xs sm:text-sm [[data-selected=true]_&]:text-accent-foreground">{item.village}</span>
                                    <span className="text-[11px] sm:text-[12px] text-muted-foreground [[data-selected=true]_&]:text-accent-foreground/80">
                                      {item.cell}, {item.sector}, {item.district}
                                    </span>
                                  </div>
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </>
          ) : formData.contactInfo?.address?.country ? (
            <div className="contents">
              <Input
                type="text"
                value={fieldValue(formData.contactInfo?.address?.province)}
                onChange={(e) =>
                  onFieldChange(
                    "contactInfo.address.province",
                    e.target.value,
                  )
                }
                placeholder="Province / State"
                className={solidFieldClass}
              />
              <Input
                type="text"
                value={fieldValue(formData.contactInfo?.address?.district)}
                onChange={(e) =>
                  onFieldChange(
                    "contactInfo.address.district",
                    e.target.value,
                  )
                }
                placeholder="District"
                className={solidFieldClass}
              />
              <Input
                type="text"
                value={fieldValue(formData.contactInfo?.address?.sector)}
                onChange={(e) =>
                  onFieldChange("contactInfo.address.sector", e.target.value)
                }
                placeholder="Sector / City"
                className={solidFieldClass}
              />
              <Input
                type="text"
                value={fieldValue(formData.contactInfo?.address?.cell)}
                onChange={(e) =>
                  onFieldChange("contactInfo.address.cell", e.target.value)
                }
                placeholder="Cell"
                className={solidFieldClass}
              />
              <Input
                type="text"
                value={fieldValue(formData.contactInfo?.address?.village)}
                onChange={(e) =>
                  onFieldChange(
                    "contactInfo.address.village",
                    e.target.value,
                  )
                }
                placeholder="Village"
                className={solidFieldClass}
              />
            </div>
          ) : null}

          {/* Street - manual input, optional */}
          {formData.contactInfo?.address?.country && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                Street / Additional Address (optional)
              </label>
              <Input
                type="text"
                value={fieldValue(formData.contactInfo?.address?.address)}
                onChange={(e) =>
                  onFieldChange(
                    "contactInfo.address.address",
                    e.target.value,
                  )
                }
                placeholder="Street (optional)"
                className={solidFieldClass}
              />
            </div>
          )}
        </div>
      </div>

      {/* Insurance Information */}
      <div
        className={`${solidPanelClass} border-t p-2 sm:p-3`}
      >
        <div className="mb-1 sm:mb-2">
          <h3 className="text-sm sm:text-lg font-semibold">Insurance: Private</h3>
          {!canAddInsurance && (formData.insurances?.length ?? 0) > 0 && (
            <p className="text-[12px] text-amber-600 dark:text-amber-400 mt-0.5">
              Complete existing insurance details before adding another
            </p>
          )}
        </div>

        {formData.insurances?.map((insurance, index) => {
          const hasProvider =
            insurance.insuranceId &&
            String(insurance.insuranceId) !== "0"

          return (
            <div
              key={index}
              className="border border-border/60 rounded-xl sm:rounded-2xl p-2 sm:p-4 mb-2 sm:mb-4 bg-background dark:bg-gray-900 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2 sm:mb-4">
                <h4 className="font-medium text-xs sm:text-base">
                  Insurance #{index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => onRemoveInsurance(index)}
                  className="rounded-full px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                    Insurance Provider
                  </label>
                  <FieldError message={fieldErrors[`insurance.${index}.provider`]} />
                  <Popover
                    open={insurancePopoverOpen[index] || false}
                    onOpenChange={(open) =>
                      setInsurancePopoverOpen((prev) => ({
                        ...prev,
                        [index]: open,
                      }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={insurancePopoverOpen[index]}
                        className="w-full justify-between bg-background dark:bg-gray-900 border-border/70"
                      >
                        {getInsuranceName(insurance.insuranceId ?? "") || insurance.insuranceId}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0 bg-background dark:bg-gray-900 border-border/70"
                      align="start"
                    >
                      <Command>
                        <CommandInput placeholder="Search insurance..." />
                        <CommandList>
                          <CommandEmpty>No insurance found.</CommandEmpty>
                          <CommandGroup>
                            {availableInsurances.map((ins) => (
                              <CommandItem
                                key={ins.id}                                value={ins.acronym || ins.name || ins.id} 
                                onSelect={() => {
                                  onUpdateInsurance(index, "insuranceId", ins.id)
                                  const covs = ins.coverages || []
                                  if (covs.length === 1 && covs[0]) {
                                    onUpdateInsurance(index, "patientShareCoverageId", covs[0].id)
                                    onUpdateInsurance(index, "patientSharePercentage", covs[0].patientSharePercentage)
                                  } else if (covs.length > 1) {
                                    const base = covs.find((c) => !c.departmentId && !c.encounterType) || covs[0]
                                    if (base) {
                                      onUpdateInsurance(index, "patientShareCoverageId", base.id)
                                      onUpdateInsurance(index, "patientSharePercentage", base.patientSharePercentage)
                                    }
                                  }
                                  setInsurancePopoverOpen((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }))
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    String(insurance.insuranceId) ===
                                      String(ins.id)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {ins.acronym || ins.name || 'Insurance'}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {hasProvider && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                      Card Number *
                    </label>
                    <Input
                      type="text"
                      value={insurance.insuranceCardNumber}
                      onChange={(e) =>
                        onUpdateInsurance(
                           index,
                          "insuranceCardNumber",
                          e.target.value,
                        )
                      }
                      placeholder="Enter card number"
                      className={`${solidFieldClass} ${fieldErrors[`insurance.${index}.card`] ? "border-red-500" : ""}`}
                      required
                    />
                    <FieldError message={fieldErrors[`insurance.${index}.card`]} />
                  </div>
                )}
              </div>

              {hasProvider && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mt-2 sm:mt-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                      Providing Company / Employer *
                    </label>
                    <Input
                      type="text"
                      value={insurance.providingCompanyOrEmployer}
                      onChange={(e) =>
                        onUpdateInsurance(
                          index,
                          "providingCompanyOrEmployer",
                          e.target.value,
                        )
                      }
                      placeholder="Enter company or employer"
                      className={`${solidFieldClass} ${fieldErrors[`insurance.${index}.employer`] ? "border-red-500" : ""}`}
                      required
                    />
                    <FieldError message={fieldErrors[`insurance.${index}.employer`]} />
                  </div>
                </div>
              )}

              {hasProvider && (() => {
                const selectedProvider = availableInsurances.find(
                  (ins) => String(ins.id) === String(insurance.insuranceId),
                )
                const coverages = selectedProvider?.coverages || []

                const getCoverageLabel = (cov: typeof coverages[0]) => {
                  if (cov.departmentName) return `${cov.departmentName} (${cov.patientSharePercentage}%)`
                  if (cov.encounterType) {
                    const typeName = cov.encounterType.replace(/_/g, " ").toLowerCase()
                    const formatted = typeName.charAt(0).toUpperCase() + typeName.slice(1)
                    return `${formatted} (${cov.patientSharePercentage}%)`
                  }
                  return `Base / General (${cov.patientSharePercentage}%)`
                }

                if (coverages.length > 1) {
                  return (
                    <div className="mt-2 sm:mt-4 p-3 rounded-xl border border-border/60 bg-muted/20">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label className="block text-xs sm:text-sm font-medium text-foreground">
                          Default Patient Share / Coverage Tier
                        </label>
                        <span className="text-[12px] text-muted-foreground">
                          {coverages.length} tiers available
                        </span>
                      </div>
                      <p className="text-[12px] text-muted-foreground mb-2">
                        This insurance has multiple coverage conditions. Select the default tier for this patient:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {coverages.map((cov) => {
                          const isSelected = insurance.patientShareCoverageId === cov.id
                          return (
                            <button
                              key={cov.id}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  onUpdateInsurance(index, "patientShareCoverageId", "")
                                  onUpdateInsurance(index, "patientSharePercentage", "")
                                } else {
                                  onUpdateInsurance(index, "patientShareCoverageId", cov.id)
                                  onUpdateInsurance(index, "patientSharePercentage", cov.patientSharePercentage)
                                }
                              }}
                              className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                                isSelected
                                  ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white border-transparent shadow-sm"
                                  : "bg-white dark:bg-slate-900 border-border/60 hover:border-primary/50 text-foreground"
                              }`}
                            >
                              {getCoverageLabel(cov)}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                }

                if (coverages.length === 1 && coverages[0]) {
                  const singleCov = coverages[0]
                  return (
                    <div className="mt-2 sm:mt-4 p-2.5 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-foreground">Default Coverage: </span>
                        <span className="text-muted-foreground">{getCoverageLabel(singleCov)}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[12px]">
                        {singleCov.patientSharePercentage}% Patient Share
                      </span>
                    </div>
                  )
                }

                return null
              })()}

              {hasProvider && (() => {
                const isAdult = calculateAge(formData.dateOfBirth) >= 18
                const isSelf = isAdult ? (insurance.isSelf !== false) : false

                if (isAdult) {
                  return (
                    <div className="mt-2 sm:mt-4 p-3 rounded-xl border border-border/50 bg-muted/20 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`insurance-${index}-isSelf`}
                          checked={insurance.isSelf !== false}
                          onCheckedChange={(checked) => {
                            onUpdateInsurance(index, "isSelf", Boolean(checked))
                            if (checked) {
                              onUpdateInsurance(index, "dominantMember.firstName", "")
                              onUpdateInsurance(index, "dominantMember.lastName", "")
                              onUpdateInsurance(index, "dominantMember.phone", "")
                            }
                          }}
                        />
                        <label
                          htmlFor={`insurance-${index}-isSelf`}
                          className="text-xs sm:text-sm font-medium text-foreground cursor-pointer select-none"
                        >
                          Self (Patient is the principal policyholder)
                        </label>
                      </div>

                      {!isSelf && (
                        <div className="pt-2 border-t border-border/40 space-y-2">
                          <h5 className="text-xs sm:text-sm font-medium text-foreground">
                            Principal Member Information <span className="text-red-500">*</span>
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                                Principal Member Full Name <span className="text-red-500">*</span>
                              </label>
                              <Input
                                type="text"
                                value={insurance.dominantMember?.name ?? [insurance.dominantMember?.firstName, insurance.dominantMember?.lastName].filter(Boolean).join(" ")}
                                onChange={(e) =>
                                  onUpdateInsurance(
                                    index,
                                    "dominantMember.name",
                                    e.target.value,
                                  )
                                }
                                placeholder="Enter principal member name"
                                className={solidFieldClass}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                                Phone <span className="text-red-500">*</span>
                              </label>
                              <Input
                                type="tel"
                                value={insurance.dominantMember?.phone || ""}
                                onChange={(e) =>
                                  onUpdateInsurance(
                                    index,
                                    "dominantMember.phone",
                                    sanitizePhoneInput(e.target.value),
                                  )
                                }
                                placeholder="Phone number"
                                className={solidFieldClass}
                                required
                              />
                            </div>
                          </div>
                          <FieldError message={fieldErrors[`insurance.${index}.dominant`]} />
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <div className="mt-2 sm:mt-4 p-3 rounded-xl border border-border/50 bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs sm:text-sm font-medium text-foreground">
                        Principal Member Information <span className="text-red-500">*</span>
                      </h5>
                      <span className="text-[12px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/60">
                        Required for patients &lt;18 years
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                          Principal Member Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={insurance.dominantMember?.name ?? [insurance.dominantMember?.firstName, insurance.dominantMember?.lastName].filter(Boolean).join(" ")}
                          onChange={(e) =>
                            onUpdateInsurance(
                              index,
                              "dominantMember.name",
                              e.target.value,
                            )
                          }
                          placeholder="Enter principal member name"
                          className={solidFieldClass}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="tel"
                          value={insurance.dominantMember?.phone || ""}
                          onChange={(e) =>
                            onUpdateInsurance(
                              index,
                              "dominantMember.phone",
                              sanitizePhoneInput(e.target.value),
                            )
                          }
                          placeholder="Phone number"
                          className={solidFieldClass}
                          required
                        />
                      </div>
                    </div>
                    <FieldError message={fieldErrors[`insurance.${index}.dominant`]} />
                  </div>
                )
              })()}
            </div>
          )
        })}
      </div>

      {/* Emergency Contact — collapsed behind a small button so the base form
          fits one page on desktop; opens on demand (or for existing data). */}
      <div
        className={`${solidPanelClass} border-t p-2 sm:p-3`}
      >
        <div className="mb-1 flex items-center justify-between gap-2 sm:mb-2">
          <h3 className="text-sm font-semibold">Emergency Contact</h3>
          {showEmergency && !hasEmergencyData ? (
            <button
              type="button"
              onClick={() => setEmergencyOpen(false)}
              className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted"
            >
              Hide
            </button>
          ) : !showEmergency ? (
            <button
              type="button"
              onClick={() => setEmergencyOpen(true)}
              className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted"
            >
              + Add emergency contact
            </button>
          ) : null}
        </div>
        {showEmergency && (
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
          <Input
            type="text"
            value={fieldValue(formData.emergencyContact?.name)}
            onChange={(e) =>
              onFieldChange("emergencyContact.name", e.target.value)
            }
            placeholder="Contact name"
            className={solidFieldClass}
          />
          <Select
            value={formData.emergencyContact?.relation || ""}
            onValueChange={(value) =>
              onFieldChange("emergencyContact.relation", value)
            }
          >
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="Relation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Spouse">Spouse</SelectItem>
              <SelectItem value="Parent">Parent</SelectItem>
              <SelectItem value="Child">Child</SelectItem>
              <SelectItem value="Sibling">Sibling</SelectItem>
              <SelectItem value="Relative">Relative</SelectItem>
              <SelectItem value="Friend">Friend</SelectItem>
              <SelectItem value="Neighbor">Neighbor</SelectItem>
              <SelectItem value="Colleague">Colleague</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="tel"
            value={fieldValue(formData.emergencyContact?.phone)}
            onChange={(e) =>
              onFieldChange("emergencyContact.phone", e.target.value)
            }
            placeholder="Phone number"
            className={solidFieldClass}
          />
          </div>
        )}
      </div>
    </div>
  )
}
