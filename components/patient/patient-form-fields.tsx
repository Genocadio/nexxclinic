"use client"

import { useState } from "react"
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
import { sanitizePhoneInput } from "@/lib/validation-utils"
import {
  calculateAge,
  isDominantMemberRequired,
  validateDateOfBirth,
} from "@/lib/validation-utils"
import { DatePickerGrid } from "@/components/ui/date-picker-grid"
import {
  COUNTRIES,
  RWANDA_PROVINCES,
  getRwandaDistricts,
  getRwandaSectors,
  isRwandaSelected,
} from "@/lib/location-data"

export interface PatientFormFieldsProps {
  formData: RegisterPatientInput
  onFieldChange: (field: string, value: string) => void
  onCountryChange: (country: string) => void
  onProvinceChange: (province: string) => void
  onDistrictChange: (district: string) => void
  onSectorChange: (sector: string) => void
  onAddInsurance: () => void
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
  onAddInsurance,
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
      ? `${insurance.insuranceName} (${insurance.acronym || ""})`
      : "Select insurance..."
  }

  const dobValidation = formData.dateOfBirth
    ? validateDateOfBirth(formData.dateOfBirth)
    : null

  return (
    <>
      {/* Basic Information */}
      <div
        className={`${solidPanelClass} p-2 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4`}
      >
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
            First Name *
          </label>
          <Input
            type="text"
            value={fieldValue(formData.firstName)}
            onChange={(e) => onFieldChange("firstName", e.target.value)}
            onBlur={() => onFieldBlur?.("firstName", formData.firstName || "")}
            placeholder="Enter first name"
            className={`${solidFieldClass} rounded-xl focus:ring-primary/50 ${fieldErrors["firstName"] ? "border-red-500" : ""}`}
            required
          />
          <FieldError message={fieldErrors["firstName"]} />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
            Last Name
          </label>
          <Input
            type="text"
            value={fieldValue(formData.lastName)}
            onChange={(e) => onFieldChange("lastName", e.target.value)}
            onBlur={() => onFieldBlur?.("lastName", formData.lastName || "")}
            placeholder="Enter last name"
            className={solidFieldClass}
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
            Middle Name
          </label>
          <Input
            type="text"
            value={fieldValue(formData.middleName)}
            onChange={(e) => onFieldChange("middleName", e.target.value)}
            onBlur={() => onFieldBlur?.("middleName", formData.middleName || "")}
            placeholder="Enter middle name"
            className={solidFieldClass}
          />
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
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
            National ID
          </label>
          <Input
            type="text"
            value={fieldValue(formData.nationalIdNumber)}
            onChange={(e) => onFieldChange("nationalIdNumber", e.target.value)}
            placeholder="Enter national ID"
            className={solidFieldClass}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div
        className={`${solidPanelClass} border-t pt-3 sm:pt-6 px-2 sm:px-4 pb-2 sm:pb-4`}
      >
        <h4 className="text-sm sm:text-md font-medium mb-2 sm:mb-3">
          Contact Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
              Phone
            </label>
            <Input
              type="tel"
              value={fieldValue(formData.contactInfo?.phone)}
              onChange={(e) =>
                onFieldChange("contactInfo.phone", e.target.value)
              }
              placeholder="Enter phone number"
              className={solidFieldClass}
            />
          </div>

          {/* Country inline with phone */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
              Country
            </label>
            <Popover
              open={countryPopoverOpen}
              onOpenChange={setCountryPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={countryPopoverOpen}
                  className="w-full justify-between bg-background dark:bg-gray-900 border-border/70"
                >
                  {formData.contactInfo?.address?.country ||
                    "Select country..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-full p-0 bg-background dark:bg-gray-900 border-border/70"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {COUNTRIES.map((country) => (
                        <CommandItem
                          key={country}
                          value={country}
                          onSelect={() => {
                            onCountryChange(country)
                            setCountryPopoverOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.contactInfo?.address?.country ===
                                country
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
        </div>

        {/* Address */}
        <div className="mt-2 sm:mt-4">
          <h4 className="text-sm sm:text-md font-medium mb-2 sm:mb-2">
            Address
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">

            {/* Rwanda cascading dropdowns */}
            {isRwandaSelected(formData.contactInfo?.address?.country) ? (
              <>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                    Province
                  </label>
                  <Popover
                    open={provincePopoverOpen}
                    onOpenChange={setProvincePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={provincePopoverOpen}
                        className="w-full justify-between bg-background dark:bg-gray-900 border-border/70"
                      >
                        {formData.contactInfo?.address?.province ||
                          "Select province..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0 bg-background dark:bg-gray-900 border-border/70"
                      align="start"
                    >
                      <Command>
                        <CommandInput placeholder="Search province..." />
                        <CommandList>
                          <CommandEmpty>No province found.</CommandEmpty>
                          <CommandGroup>
                            {RWANDA_PROVINCES.map((province) => (
                              <CommandItem
                                key={province}
                                value={province}
                                onSelect={() => {
                                  onProvinceChange(province)
                                  setProvincePopoverOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.contactInfo?.address?.province ===
                                      province
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

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                    District
                  </label>
                  <Popover
                    open={districtPopoverOpen}
                    onOpenChange={setDistrictPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={districtPopoverOpen}
                        className="w-full justify-between bg-background dark:bg-gray-900 border-border/70"
                        disabled={!formData.contactInfo?.address?.province}
                      >
                        {formData.contactInfo?.address?.district ||
                          "Select district..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0 bg-background dark:bg-gray-900 border-border/70"
                      align="start"
                    >
                      <Command>
                        <CommandInput placeholder="Search district..." />
                        <CommandList>
                          <CommandEmpty>No district found.</CommandEmpty>
                          <CommandGroup>
                            {getRwandaDistricts(
                              formData.contactInfo?.address?.province || "",
                            ).map((district) => (
                              <CommandItem
                                key={district}
                                value={district}
                                onSelect={() => {
                                  onDistrictChange(district)
                                  setDistrictPopoverOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.contactInfo?.address?.district ===
                                      district
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {district}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                    Sector
                  </label>
                  <Popover
                    open={sectorPopoverOpen}
                    onOpenChange={setSectorPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={sectorPopoverOpen}
                        className="w-full justify-between bg-background dark:bg-gray-900 border-border/70"
                        disabled={!formData.contactInfo?.address?.district}
                      >
                        {formData.contactInfo?.address?.sector ||
                          "Select sector..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0 bg-background dark:bg-gray-900 border-border/70"
                      align="start"
                    >
                      <Command>
                        <CommandInput placeholder="Search sector..." />
                        <CommandList>
                          <CommandEmpty>No sector found.</CommandEmpty>
                          <CommandGroup>
                            {getRwandaSectors(
                              formData.contactInfo?.address?.province || "",
                              formData.contactInfo?.address?.district || "",
                            ).map((sector) => (
                              <CommandItem
                                key={sector}
                                value={sector}
                                onSelect={() => {
                                  onSectorChange(sector)
                                  setSectorPopoverOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.contactInfo?.address?.sector ===
                                      sector
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {sector}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                    Cell
                  </label>
                  <Input
                    type="text"
                    value={fieldValue(formData.contactInfo?.address?.cell)}
                    onChange={(e) =>
                      onFieldChange("contactInfo.address.cell", e.target.value)
                    }
                    placeholder="Cell"
                    className={solidFieldClass}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                    Village
                  </label>
                  <Input
                    type="text"
                    value={fieldValue(formData.contactInfo?.address?.village)}
                    onChange={(e) =>
                      onFieldChange("contactInfo.address.village", e.target.value)
                    }
                    placeholder="Village"
                    className={solidFieldClass}
                  />
                </div>
              </>
            ) : formData.contactInfo?.address?.country ? (
              <>
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
              </>
            ) : null}

            {/* Street - manual input, optional, full width */}
            {formData.contactInfo?.address?.country && (
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-1.5">
                  Street
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
      </div>

      {/* Emergency Contact */}
      <div
        className={`${solidPanelClass} border-t pt-3 sm:pt-6 px-2 sm:px-4 pb-2 sm:pb-4`}
      >
        <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4">
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
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
      </div>

      {/* Insurance Information */}
      <div
        className={`${solidPanelClass} border-t pt-3 sm:pt-6 px-2 sm:px-4 pb-2 sm:pb-4`}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-lg font-semibold">Insurance</h3>
          <button
            type="button"
            onClick={onAddInsurance}
            className="rounded-full px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md text-xs sm:text-base inline-block w-fit"
          >
            + Add
          </button>
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
                        {getInsuranceName(insurance.insuranceId ?? "")}
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
                                key={ins.id}
                                value={`${ins.name} ${ins.acronym}`}
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
                                {ins.name} ({ins.acronym})
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
                        <span className="text-[11px] text-muted-foreground">
                          {coverages.length} tiers available
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-2">
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
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px]">
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
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                                First Name <span className="text-red-500">*</span>
                              </label>
                              <Input
                                type="text"
                                value={insurance.dominantMember?.firstName || ""}
                                onChange={(e) =>
                                  onUpdateInsurance(
                                    index,
                                    "dominantMember.firstName",
                                    e.target.value,
                                  )
                                }
                                placeholder="First name"
                                className={solidFieldClass}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                                Last Name <span className="text-red-500">*</span>
                              </label>
                              <Input
                                type="text"
                                value={insurance.dominantMember?.lastName || ""}
                                onChange={(e) =>
                                  onUpdateInsurance(
                                    index,
                                    "dominantMember.lastName",
                                    e.target.value,
                                  )
                                }
                                placeholder="Last name"
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
                      <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/60">
                        Required for patients &lt;18 years
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={insurance.dominantMember?.firstName || ""}
                          onChange={(e) =>
                            onUpdateInsurance(
                              index,
                              "dominantMember.firstName",
                              e.target.value,
                            )
                          }
                          placeholder="First name"
                          className={solidFieldClass}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={insurance.dominantMember?.lastName || ""}
                          onChange={(e) =>
                            onUpdateInsurance(
                              index,
                              "dominantMember.lastName",
                              e.target.value,
                            )
                          }
                          placeholder="Last name"
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
    </>
  )
}
