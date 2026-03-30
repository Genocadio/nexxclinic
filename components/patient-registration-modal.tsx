"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRegisterPatient, useInsurances, useDepartments, useCreateVisit, usePatients, type PatientRegistrationInput, type PatientFilterInput, type Patient } from "@/hooks/auth-hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { AlertCircle, Check, ChevronsUpDown, Edit } from "lucide-react"
import { toast } from "react-toastify"
import { cn } from "@/lib/utils"
import { validateEmailOrPhone } from "@/lib/validation-utils"
import PatientEditModal from "@/components/patient-edit-modal"

const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

const isDominantMemberRequired = (dateOfBirth: string, hasInsurance: boolean): boolean => {
  if (!hasInsurance) return false
  const age = calculateAge(dateOfBirth)
  return age <= 18
}

// moved inside component to access insurances safely

interface PatientRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onPatientRegistered?: (patientId: string, patientInsurances: any[], proceedToVisit: boolean) => void
  hideSearchPanel?: boolean
}

export default function PatientRegistrationModal({ isOpen, onClose, onPatientRegistered, hideSearchPanel = false }: PatientRegistrationModalProps) {
  const { registerPatient, loading } = useRegisterPatient()
  const { insurances, loading: insurancesLoading } = useInsurances()
  const solidFieldClass = "w-full bg-background dark:bg-gray-900 border-border/70"
  const solidPanelClass = "rounded-2xl border border-border/60 bg-background/95 dark:bg-gray-900/90 shadow-sm"
  const [error, setError] = useState("")
  const [showNotes, setShowNotes] = useState(false)
  const [insurancePopoverOpen, setInsurancePopoverOpen] = useState<{ [key: number]: boolean }>({})
  const [editPatientModal, setEditPatientModal] = useState(false)
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<Patient | null>(null)

  const getInsuranceName = (insuranceId: number) => {
    if (!insuranceId || insuranceId === 0) return "Select insurance..."
    const insurance = insurances.find((ins) => ins.id === insuranceId)
    return insurance ? `${insurance.name} (${insurance.acronym})` : "Select insurance..."
  }

  // Search filters for potential duplicate detection
  const [searchFilters, setSearchFilters] = useState<PatientFilterInput>({})
  const [firstNameCommitted, setFirstNameCommitted] = useState(false)
  const hasSearchCriteria = Object.keys(searchFilters).length > 0 && Object.values(searchFilters).some(value => value !== undefined && value !== '')
  const { patients: potentialMatches, loading: searchingPatients } = usePatients(hasSearchCriteria ? searchFilters : undefined, 0, 10)

  // Reset firstNameCommitted when modal opens
  useEffect(() => {
    if (isOpen) {
      setFirstNameCommitted(false)
      setSearchFilters({})
    }
  }, [isOpen])

  const [formData, setFormData] = useState<PatientRegistrationInput>({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    contactInfo: {
      phone: "",
      email: "",
      address: {
        street: "",
        sector: "",
        district: "",
        country: ""
      }
    },
    emergencyContact: {
      name: "",
      relation: "",
      phone: ""
    },
    nationalId: "",
    insurances: [],
    notes: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const keys = field.split('.')
      const updated = { ...prev }

      let current: any = updated
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value

      return updated
    })

    // Update search filters for duplicate detection
    // Only search if firstName has been committed (user moved away from it) or if other fields are being filled
    if ((field === 'firstName' && firstNameCommitted) || 
        field === 'lastName' || 
        field === 'dateOfBirth' || 
        field === 'gender' || 
        field === 'contactInfo.phone') {
      setSearchFilters(prev => {
        const newFilters = { ...prev }

        if (field === 'firstName' || field === 'lastName') {
          // Combine first and last name for the name filter
          const firstName = field === 'firstName' ? value : formData.firstName
          const lastName = field === 'lastName' ? value : formData.lastName
          const fullName = [firstName, lastName].filter(Boolean).join(' ')
          // Only search if we have at least 2 characters
          newFilters.name = fullName.length >= 2 ? fullName : undefined
        } else if (field === 'dateOfBirth') {
          newFilters.dob = value || undefined
        } else if (field === 'gender') {
          // Gender is not directly in the filter, but we can keep it for potential future use
        } else if (field === 'contactInfo.phone') {
          // Only search if we have at least 3 characters for phone
          newFilters.phoneNumber = value && value.length >= 3 ? value : undefined
        }

        // Remove empty filters
        Object.keys(newFilters).forEach(key => {
          if (!newFilters[key as keyof PatientFilterInput]) {
            delete newFilters[key as keyof PatientFilterInput]
          }
        })

        return newFilters
      })
    }
  }

  const addInsurance = () => {
    setFormData(prev => ({
      ...prev,
      insurances: [
        ...(prev.insurances || []),
        {
          insuranceId: 0,
          insuranceCardNumber: "",
          dominantMember: {
            firstName: "",
            lastName: "",
            phone: ""
          },
          status: "ACTIVE"
        }
      ]
    }))
  }

  const updateInsurance = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      insurances: (prev.insurances || []).map((insurance, i) => {
        if (i === index) {
          if (field.startsWith('dominantMember.')) {
            const dominantMemberField = field.split('.')[1]
            return {
              ...insurance,
              dominantMember: {
                ...insurance.dominantMember,
                [dominantMemberField]: value
              }
            }
          }
          return { ...insurance, [field]: value }
        }
        return insurance
      })
    }))
  }

  const removeInsurance = (index: number) => {
    setFormData(prev => ({
      ...prev,
      insurances: (prev.insurances || []).filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.firstName || !formData.dateOfBirth) {
      toast.error("Please fill in required fields (First Name and Date of Birth)")
      return
    }

    // Validate email or phone if provided
    if (formData.contactInfo?.email) {
      const emailOrPhoneValidation = validateEmailOrPhone(formData.contactInfo.email)
      if (!emailOrPhoneValidation.valid) {
        toast.error(`Email/Phone validation: ${emailOrPhoneValidation.error}`)
        return
      }
    }

    // Validate dominant member requirement for patients <= 18 with insurance
    const hasInsurance = (formData.insurances?.length ?? 0) > 0
    const dominantMemberRequired = isDominantMemberRequired(formData.dateOfBirth, hasInsurance)

    if (dominantMemberRequired) {
      for (let i = 0; i < (formData.insurances?.length || 0); i++) {
        const insurance = formData.insurances![i]
        if (!insurance.dominantMember?.firstName || !insurance.dominantMember?.lastName || !insurance.dominantMember?.phone) {
          toast.error(`Insurance #${i + 1}: Dominant member information (First Name, Last Name, Phone) is required for patients 18 years or younger`)
          return
        }
      }
    }

    try {
      const result = await registerPatient(formData)
      if (result.status === 'SUCCESS') {
        toast.success("Patient registered successfully!")
        if (onPatientRegistered && result.data?.id) {
          onPatientRegistered(result.data.id, result.data.insurances || [], true)
        }
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          middleName: "",
          dateOfBirth: "",
          gender: "",
          contactInfo: {
            phone: "",
            email: "",
            address: {
              street: "",
              sector: "",
              district: "",
              country: ""
            }
          },
          emergencyContact: {
            name: "",
            relation: "",
            phone: ""
          },
          nationalId: "",
          insurances: [],
          notes: ""
        })
        onClose()
      } else {
        const message = result.messages?.[0]?.text || 'Patient registration failed'
        toast.error(message)
      }
    } catch (error) {
      toast.error('Network error occurred')
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-3xl shadow-2xl">
        <DialogTitle className="sr-only">Register New Patient</DialogTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full max-h-[calc(90vh-180px)] overflow-hidden">
          {/* Registration Form */}
          <div className="overflow-y-auto scrollbar-hide pr-2 pb-20 rounded-2xl border border-border/50 bg-background/90 dark:bg-gray-900/85 p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className={`${solidPanelClass} p-4 grid grid-cols-1 md:grid-cols-2 gap-4`}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                First Name *
              </label>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                onBlur={() => {
                  if (formData.firstName.trim()) {
                    setFirstNameCommitted(true)
                    // Trigger search when leaving firstName field if it has content
                    setSearchFilters(prev => {
                      const newFilters = { ...prev }
                      const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ')
                      newFilters.name = fullName.length >= 2 ? fullName : undefined
                      
                      // Remove empty filters
                      Object.keys(newFilters).forEach(key => {
                        if (!newFilters[key as keyof PatientFilterInput]) {
                          delete newFilters[key as keyof PatientFilterInput]
                        }
                      })
                      
                      return newFilters
                    })
                  }
                }}
                placeholder="Enter first name"
                className={`${solidFieldClass} rounded-xl focus:ring-primary/50`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Last Name
              </label>
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                className={solidFieldClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Middle Name
              </label>
              <Input
                type="text"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                placeholder="Enter middle name"
                className={solidFieldClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Date of Birth *
              </label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className={solidFieldClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-background dark:bg-gray-900 p-3">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                  <Checkbox
                    checked={formData.gender === 'M'}
                    onCheckedChange={(checked) => handleInputChange('gender', checked ? 'M' : '')}
                  />
                  Male
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                  <Checkbox
                    checked={formData.gender === 'F'}
                    onCheckedChange={(checked) => handleInputChange('gender', checked ? 'F' : '')}
                  />
                  Female
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                National ID
              </label>
              <Input
                type="text"
                value={formData.nationalId}
                onChange={(e) => handleInputChange('nationalId', e.target.value)}
                placeholder="Enter national ID"
                className={solidFieldClass}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className={`${solidPanelClass} border-t pt-6 px-4 pb-4`}>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={formData.contactInfo?.phone}
                  onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                  placeholder="Enter phone number"
                  className={solidFieldClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email or Phone
                </label>
                <Input
                  type="text"
                  value={formData.contactInfo?.email}
                  onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                  placeholder="Email (user@domain.com) or Phone (+256701234567 or 0712345678)"
                  className={solidFieldClass}
                />
              </div>
            </div>

            {/* Address */}
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  value={formData.contactInfo?.address?.street}
                  onChange={(e) => handleInputChange('contactInfo.address.street', e.target.value)}
                  placeholder="Street"
                  className={solidFieldClass}
                />
                <Input
                  type="text"
                  value={formData.contactInfo?.address?.sector}
                  onChange={(e) => handleInputChange('contactInfo.address.sector', e.target.value)}
                  placeholder="Sector"
                  className={solidFieldClass}
                />
                <Input
                  type="text"
                  value={formData.contactInfo?.address?.district}
                  onChange={(e) => handleInputChange('contactInfo.address.district', e.target.value)}
                  placeholder="District"
                  className={solidFieldClass}
                />
                <Input
                  type="text"
                  value={formData.contactInfo?.address?.country}
                  onChange={(e) => handleInputChange('contactInfo.address.country', e.target.value)}
                  placeholder="Country"
                  className={solidFieldClass}
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className={`${solidPanelClass} border-t pt-6 px-4 pb-4`}>
            <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="text"
                value={formData.emergencyContact?.name}
                onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                placeholder="Contact name"
                className={solidFieldClass}
              />
              <Input
                type="text"
                value={formData.emergencyContact?.relation}
                onChange={(e) => handleInputChange('emergencyContact.relation', e.target.value)}
                placeholder="Relation"
                className={solidFieldClass}
              />
              <Input
                type="tel"
                value={formData.emergencyContact?.phone}
                onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                placeholder="Phone number"
                className={solidFieldClass}
              />
            </div>
          </div>

          {/* Insurance Information */}
          <div className={`${solidPanelClass} border-t pt-6 px-4 pb-4`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Insurance Information</h3>
              <Button type="button" onClick={addInsurance} className="rounded-full px-4 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md" size="sm">
                Add Insurance
              </Button>
            </div>

            {formData.insurances?.map((insurance, index) => (
              <div key={index} className="border border-border/60 rounded-2xl p-4 mb-4 bg-background dark:bg-gray-900 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Insurance #{index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeInsurance(index)}
                    size="sm"
                    className="rounded-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Insurance Provider
                    </label>
                    <Popover
                      open={insurancePopoverOpen[index] || false}
                      onOpenChange={(open) => setInsurancePopoverOpen(prev => ({ ...prev, [index]: open }))}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={insurancePopoverOpen[index]}
                          className="w-full justify-between bg-background dark:bg-gray-900 border-border/70"
                        >
                          {getInsuranceName(insurance.insuranceId)}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 bg-background dark:bg-gray-900 border-border/70" align="start">
                        <Command>
                          <CommandInput placeholder="Search insurance..." />
                          <CommandList>
                            <CommandEmpty>No insurance found.</CommandEmpty>
                            <CommandGroup>
                              {insurances.map((ins) => (
                                <CommandItem
                                  key={ins.id}
                                  value={`${ins.name} ${ins.acronym}`}
                                  onSelect={() => {
                                    updateInsurance(index, 'insuranceId', ins.id)
                                    setInsurancePopoverOpen(prev => ({ ...prev, [index]: false }))
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      insurance.insuranceId === ins.id ? "opacity-100" : "opacity-0"
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
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Card Number
                    </label>
                    <Input
                      type="text"
                      value={insurance.insuranceCardNumber}
                      onChange={(e) => updateInsurance(index, 'insuranceCardNumber', e.target.value)}
                      placeholder="Enter card number"
                      className={solidFieldClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Insurance Status
                    </label>
                    <Select
                      value={insurance.status}
                      onValueChange={(value) => updateInsurance(index, 'status', value)}
                    >
                      <SelectTrigger suppressHydrationWarning className={solidFieldClass}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="text-sm font-medium text-foreground mb-2">
                    Dominant Member Information
                    {isDominantMemberRequired(formData.dateOfBirth, true) && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                    <span className="text-xs text-muted-foreground ml-2">
                      ({isDominantMemberRequired(formData.dateOfBirth, true) ? 'Required' : 'Optional'} for patients ≤18 years)
                    </span>
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        First Name
                        {isDominantMemberRequired(formData.dateOfBirth, true) && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <Input
                        type="text"
                        value={insurance.dominantMember?.firstName || ""}
                        onChange={(e) => updateInsurance(index, 'dominantMember.firstName', e.target.value)}
                        placeholder="First name"
                        className={solidFieldClass}
                        required={isDominantMemberRequired(formData.dateOfBirth, true)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Last Name
                        {isDominantMemberRequired(formData.dateOfBirth, true) && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <Input
                        type="text"
                        value={insurance.dominantMember?.lastName || ""}
                        onChange={(e) => updateInsurance(index, 'dominantMember.lastName', e.target.value)}
                        placeholder="Last name"
                        className={solidFieldClass}
                        required={isDominantMemberRequired(formData.dateOfBirth, true)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Phone
                        {isDominantMemberRequired(formData.dateOfBirth, true) && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <Input
                        type="tel"
                        value={insurance.dominantMember?.phone || ""}
                        onChange={(e) => updateInsurance(index, 'dominantMember.phone', e.target.value)}
                        placeholder="Phone number"
                        className={solidFieldClass}
                        required={isDominantMemberRequired(formData.dateOfBirth, true)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className={`${solidPanelClass} border-t pt-6 px-4 pb-4`}>
            {!showNotes ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNotes(true)}
                className="rounded-full px-4 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md"
              >
                Add Notes
              </Button>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-foreground">
                    Notes
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotes(false)}
                  >
                    Hide
                  </Button>
                </div>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter any additional notes"
                  className="w-full p-3 border border-border/70 rounded-lg bg-background dark:bg-gray-900 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>

            <div className="absolute bottom-6 left-6 right-[50%] flex justify-center pointer-events-none">
            <div className="flex gap-3 pointer-events-auto">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-full px-6 bg-background dark:bg-gray-900 border border-border/70 text-foreground hover:bg-muted/40 dark:hover:bg-muted/50 shadow-lg">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-lg hover:opacity-90 transition-all duration-200">
                {loading ? "Registering..." : "Register Patient"}
              </Button>
            </div>
          </div>
        </form>
        </div>

          {/* Potential Matches Panel (hidden on mobile) */}
          {!hideSearchPanel && (
            <div className="hidden md:block border-l border-border/50 pl-6 overflow-y-auto scrollbar-hide pb-20 rounded-2xl bg-background/90 dark:bg-gray-900/85 p-4">
              <>
                <div className="sticky top-0 bg-background dark:bg-gray-900 pb-4 border-b border-border/50 mb-4 rounded-2xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground">Potential Matches</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchingPatients ? 'Searching for existing patients...' : 'Existing patients that match your search criteria'}
                  </p>
                  {Object.keys(searchFilters).length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Searching with: {Object.entries(searchFilters).map(([key, value]) => `${key}: ${value}`).join(', ')}
                    </div>
                  )}
                </div>

                {searchingPatients ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-sm text-muted-foreground">Searching...</div>
                  </div>
                ) : potentialMatches.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground mb-2">
                      Found {potentialMatches.length} potential match{potentialMatches.length !== 1 ? 'es' : ''}
                    </div>
                    {potentialMatches.map((patient: Patient) => (
                      <div
                        key={patient.id}
                        className="border border-border/60 rounded-2xl p-4 hover:bg-muted/50 dark:hover:bg-muted/40 transition-all duration-200 w-full bg-background dark:bg-gray-900 shadow-sm"
                      >
                        <div className="mb-3 flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-foreground text-base">
                              {patient.firstName} {patient.lastName}
                            </h4>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPatientForEdit(patient)
                                setEditPatientModal(true)
                              }}
                              title="Edit patient"
                              className="rounded-full"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              onClick={() => {
                                // Handle selecting existing patient
                                toast.success(`Selected existing patient: ${patient.firstName} ${patient.lastName}`)
                                onClose()
                                // Call onPatientRegistered with existing patient info to proceed to visit creation
                                if (onPatientRegistered) {
                                  onPatientRegistered(patient.id.toString(), patient.insurances || [], true)
                                }
                              }}
                              className="rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md"
                            >
                              Select
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</div>
                          <div>Gender: {patient.gender}</div>
                          {patient.contactInfo?.phone && (
                            <div className="col-span-2">Phone: {patient.contactInfo.phone}</div>
                          )}
                          {patient.nationalId && (
                            <div className="col-span-2">ID: {patient.nationalId}</div>
                          )}
                          {patient.latestVisit && (
                            <div className="col-span-2">Last Visit: {new Date(patient.latestVisit.visitDate).toLocaleDateString()}</div>
                          )}
                        </div>
                        {patient.insurances && patient.insurances.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-xs font-medium text-foreground mb-2">Insurance:</div>
                            <div className="space-y-1">
                              {patient.insurances.map((insurance: any, idx: number) => (
                                <div key={idx} className="text-xs bg-muted/50 rounded-xl px-3 py-2 border border-border/40">
                                  <div className="font-medium">{insurance.insurance.name} ({insurance.insurance.acronym})</div>
                                  <div className="text-muted-foreground">Card: {insurance.insuranceCardNumber}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-sm text-muted-foreground">
                      No matching patients found
                    </div>
                  </div>
                )}
              </>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>

    <PatientEditModal
      isOpen={editPatientModal}
      onClose={() => {
        setEditPatientModal(false)
        setSelectedPatientForEdit(null)
      }}
      patient={selectedPatientForEdit}
      onPatientUpdated={(updatedPatient) => {
        // After edit, automatically select the patient
        toast.success(`Patient updated and selected: ${updatedPatient.firstName} ${updatedPatient.lastName}`)
        setEditPatientModal(false)
        setSelectedPatientForEdit(null)
        onClose()
        if (onPatientRegistered) {
          onPatientRegistered(updatedPatient.id.toString(), updatedPatient.insurances || [], true)
        }
      }}
    />
  </>
  )
}