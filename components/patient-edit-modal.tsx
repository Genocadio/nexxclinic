"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useUpdatePatient, useInsurances, type PatientRegistrationInput, type Patient, type ActivationStatus } from "@/hooks/auth-hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { AlertCircle, Check, ChevronsUpDown } from "lucide-react"
import { toast } from "react-toastify"
import { cn } from "@/lib/utils"

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

interface PatientEditModalProps {
  isOpen: boolean
  onClose: () => void
  patient: Patient | null
  onPatientUpdated?: (patient: Patient) => void
}

export default function PatientEditModal({ isOpen, onClose, patient, onPatientUpdated }: PatientEditModalProps) {
  const { updatePatient, loading } = useUpdatePatient()
  const { insurances, loading: insurancesLoading } = useInsurances()
  const [error, setError] = useState("")
  const [insurancePopoverOpen, setInsurancePopoverOpen] = useState<{ [key: number]: boolean }>({})
  const [showNotes, setShowNotes] = useState(false)

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

  // Populate form when patient data is available
  useEffect(() => {
    if (patient && isOpen) {
      setFormData({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        middleName: patient.middleName || "",
        dateOfBirth: patient.dateOfBirth || "",
        gender: patient.gender || "",
        contactInfo: {
          phone: patient.contactInfo?.phone || "",
          email: patient.contactInfo?.email || "",
          address: {
            street: patient.contactInfo?.address?.street || "",
            sector: patient.contactInfo?.address?.sector || "",
            district: patient.contactInfo?.address?.district || "",
            country: patient.contactInfo?.address?.country || ""
          }
        },
        emergencyContact: {
          name: patient.emergencyContact?.name || "",
          relation: patient.emergencyContact?.relation || "",
          phone: patient.emergencyContact?.phone || ""
        },
        nationalId: patient.nationalId || "",
        insurances: patient.insurances?.map(ins => ({
          insuranceId: parseInt(ins.insurance.id),
          insuranceCardNumber: ins.insuranceCardNumber || "",
          dominantMember: ins.dominantMember ? {
            firstName: ins.dominantMember.firstName || "",
            lastName: ins.dominantMember.lastName || "",
            phone: ins.dominantMember.phone || ""
          } : undefined,
          status: ins.status as ActivationStatus
        })) || [],
        notes: patient.notes || ""
      })
      setError("")
    }
  }, [patient, isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const keys = field.split('.')
      const updated = { ...prev }

      let current: any = updated
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return updated
    })
  }

  const updateInsurance = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newInsurances = [...(prev.insurances || [])]
      const keys = field.split('.')
      let current: any = newInsurances[index]
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return { ...prev, insurances: newInsurances }
    })
  }

  const removeInsurance = (index: number) => {
    setFormData(prev => {
      const newInsurances = (prev.insurances || []).filter((_, i) => i !== index)
      return { ...prev, insurances: newInsurances }
    })
  }

  const addInsurance = () => {
    setFormData(prev => ({
      ...prev,
      insurances: [
        ...(prev.insurances || []),
        {
          insuranceId: 0,
          insuranceCardNumber: "",
          dominantMember: { firstName: "", lastName: "", phone: "" },
          status: "PENDING" as ActivationStatus
        }
      ]
    }))
  }

  const getInsuranceName = (insuranceId: number) => {
    if (!insuranceId || insuranceId === 0) return "Select insurance..."
    const insurance = insurances.find(ins => ins.id === insuranceId)
    return insurance ? `${insurance.name} (${insurance.acronym})` : "Select insurance..."
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.firstName || !formData.dateOfBirth) {
      toast.error("Please fill in required fields (First Name and Date of Birth)")
      return
    }

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
      if (!patient?.id) {
        toast.error("Patient ID not found")
        return
      }

      const result = await updatePatient(patient.id, formData)
      if (result.status === 'SUCCESS') {
        toast.success("Patient updated successfully!")
        if (onPatientUpdated && result.data) {
          onPatientUpdated(result.data)
        }
        onClose()
      } else {
        const message = result.messages?.[0]?.text || 'Patient update failed'
        toast.error(message)
      }
    } catch (error) {
      toast.error('Network error occurred')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden bg-card/95 backdrop-blur-xl border-border/50 rounded-3xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Patient</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update patient information
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto scrollbar-hide pr-2 max-h-[calc(90vh-180px)] pb-20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  First Name *
                </label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  className="w-full"
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
                  className="w-full"
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
                  className="w-full"
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
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Gender
                </label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger suppressHydrationWarning>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                    <SelectItem value="O">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                  className="w-full"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
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
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.contactInfo?.email}
                    onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                    placeholder="Enter email address"
                    className="w-full"
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
                    className="w-full"
                  />
                  <Input
                    type="text"
                    value={formData.contactInfo?.address?.sector}
                    onChange={(e) => handleInputChange('contactInfo.address.sector', e.target.value)}
                    placeholder="Sector"
                    className="w-full"
                  />
                  <Input
                    type="text"
                    value={formData.contactInfo?.address?.district}
                    onChange={(e) => handleInputChange('contactInfo.address.district', e.target.value)}
                    placeholder="District"
                    className="w-full"
                  />
                  <Input
                    type="text"
                    value={formData.contactInfo?.address?.country}
                    onChange={(e) => handleInputChange('contactInfo.address.country', e.target.value)}
                    placeholder="Country"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  value={formData.emergencyContact?.name}
                  onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                  placeholder="Contact name"
                  className="w-full"
                />
                <Input
                  type="text"
                  value={formData.emergencyContact?.relation}
                  onChange={(e) => handleInputChange('emergencyContact.relation', e.target.value)}
                  placeholder="Relation"
                  className="w-full"
                />
                <Input
                  type="tel"
                  value={formData.emergencyContact?.phone}
                  onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                  placeholder="Phone number"
                  className="w-full"
                />
              </div>
            </div>

            {/* Insurance Information */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Insurance Information</h3>
                <Button type="button" onClick={addInsurance} size="sm" className="rounded-full px-4 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md">
                  Add Insurance
                </Button>
              </div>

              {formData.insurances?.map((insurance, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
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
                            className="w-full justify-between"
                          >
                            {getInsuranceName(insurance.insuranceId)}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
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
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Insurance Status
                      </label>
                      <Select
                        value={insurance.status}
                        onValueChange={(value) => updateInsurance(index, 'status', value)}
                      >
                        <SelectTrigger suppressHydrationWarning>
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
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="border-t pt-6">
              {!showNotes ? (
                <Button type="button" onClick={() => setShowNotes(true)} className="rounded-full px-4 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md">
                  Add Notes
                </Button>
              ) : (
                <>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter any additional notes"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                </>
              )}
            </div>
          </form>
        </div>

        {/* Floating action bar */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-white/20 backdrop-blur-xl shadow-2xl rounded-full px-6 py-3 flex gap-3 pointer-events-auto border border-white/30">
            <Button variant="outline" onClick={onClose} className="rounded-full px-6 border-red-500 text-red-600 hover:bg-red-50">
              Cancel
            </Button>
            <Button onClick={(e) => handleSubmit(e as any)} disabled={loading} className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
