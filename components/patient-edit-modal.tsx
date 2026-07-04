"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useUpdatePatient, useInsurances } from "@/hooks/auth-hooks"
import type { Patient, Gender } from "@/lib/api-types"
import type { UpdatePatientInput } from "@/lib/api-input-types"
import type { RegisterPatientInput } from "@/hooks/patients/hooks"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import { sanitizeEmailOrPhoneInput, sanitizePhoneInput, validateDateOfBirth } from "@/lib/validation-utils"
import PatientFormFields from "@/components/patient/patient-form-fields"

interface PatientEditModalProps {
  isOpen: boolean
  onClose: () => void
  patient: Patient | null
  onPatientUpdated?: (patient: Patient) => void
}

const flatToNested = (flat: UpdatePatientInput): RegisterPatientInput => {
  const gender = flat.gender === "MALE" ? "M" as const : flat.gender === "FEMALE" ? "F" as const : ""
  return {
    firstName: flat.firstName || "",
    lastName: flat.lastName || "",
    middleName: flat.middleName || "",
    dateOfBirth: flat.dateOfBirth || "",
    gender,
    contactInfo: {
      phone: flat.primaryPhoneNumber || "",
      email: flat.alternativePhone || "",
      address: {
        country: flat.postalAddress || "",
        province: "",
        district: flat.district || "",
        sector: flat.city || "",
        village: flat.village || "",
        address: "",
      },
    },
    nationalIdNumber: flat.nationalIdNumber || "",
    emergencyContact: {
      name: flat.emergencyContactName || "",
      relation: flat.emergencyContactRelationship || "",
      phone: flat.emergencyContactPhoneNumber || "",
    },
    insurances: [],
  }
}

const nestedToFlat = (nested: RegisterPatientInput): UpdatePatientInput => ({
  firstName: nested.firstName || undefined,
  lastName: nested.lastName || undefined,
  middleName: nested.middleName || undefined,
  dateOfBirth: nested.dateOfBirth || undefined,
  gender: nested.gender === "M" ? "MALE" as Gender : nested.gender === "F" ? "FEMALE" as Gender : undefined,
  primaryPhoneNumber: nested.contactInfo?.phone || undefined,
  alternativePhone: nested.contactInfo?.email || undefined,
  village: nested.contactInfo?.address?.village || undefined,
  city: nested.contactInfo?.address?.sector || undefined,
  district: nested.contactInfo?.address?.district || undefined,
  postalAddress: nested.contactInfo?.address?.country || undefined,
  nationalIdNumber: nested.nationalIdNumber || undefined,
  passportNumber: undefined,
  emergencyContactName: nested.emergencyContact?.name || undefined,
  emergencyContactRelationship: nested.emergencyContact?.relation || undefined,
  emergencyContactPhoneNumber: nested.emergencyContact?.phone || undefined,
})

export default function PatientEditModal({ isOpen, onClose, patient, onPatientUpdated }: PatientEditModalProps) {
  const { updatePatient, loading } = useUpdatePatient()
  const { insurances } = useInsurances()
  const [error, setError] = useState("")
  const [dateError, setDateError] = useState("")
  const [formData, setFormData] = useState<RegisterPatientInput>({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    contactInfo: { phone: "", email: "", address: { country: "", province: "", district: "", sector: "", village: "", address: "" } },
    emergencyContact: { name: "", relation: "", phone: "" },
    nationalIdNumber: "",
    insurances: [],
  })

  useEffect(() => {
    if (patient && isOpen) {
      setFormData(flatToNested({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        middleName: patient.middleName || "",
        dateOfBirth: patient.dateOfBirth || "",
        gender: patient.gender as Gender | undefined,
        primaryPhoneNumber: patient.primaryPhoneNumber || "",
        alternativePhone: patient.alternativePhone || "",
        village: patient.village || "",
        city: patient.city || "",
        district: patient.district || "",
        postalAddress: patient.postalAddress || "",
        nationalIdNumber: patient.nationalIdNumber || "",
        passportNumber: patient.passportNumber || "",
        emergencyContactName: patient.emergencyContactName || "",
        emergencyContactRelationship: patient.emergencyContactRelationship || "",
        emergencyContactPhoneNumber: patient.emergencyContactPhoneNumber || "",
      }))
      setError("")
      setDateError("")
    }
  }, [patient, isOpen])

  const handleFieldChange = (field: string, value: string) => {
    const sanitized =
      field.startsWith("contactInfo.phone") || field === "emergencyContact.phone"
        ? sanitizePhoneInput(value)
        : field === "contactInfo.email"
          ? sanitizeEmailOrPhoneInput(value)
          : value

    setFormData((prev) => {
      const keys = field.split(".")
      const updated = { ...prev }
      let current: any = updated
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = sanitized
      return updated
    })

    if (field === "dateOfBirth") setDateError("")
  }

  const handleCountryChange = (country: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        email: prev.contactInfo?.email,
        phone: prev.contactInfo?.phone,
        address: {
          country,
          province: "",
          district: "",
          sector: "",
          village: prev.contactInfo?.address?.village || "",
          address: prev.contactInfo?.address?.address || "",
        },
      },
    }))
  }

  const handleProvinceChange = (province: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        email: prev.contactInfo?.email,
        phone: prev.contactInfo?.phone,
        address: { ...prev.contactInfo?.address, province, district: "", sector: "" },
      },
    }))
  }

  const handleDistrictChange = (district: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        email: prev.contactInfo?.email,
        phone: prev.contactInfo?.phone,
        address: { ...prev.contactInfo?.address, district, sector: "" },
      },
    }))
  }

  const handleSectorChange = (sector: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        email: prev.contactInfo?.email,
        phone: prev.contactInfo?.phone,
        address: { ...prev.contactInfo?.address, sector },
      },
    }))
  }

  const addInsurance = () => {
    setFormData((prev) => ({
      ...prev,
      insurances: [
        ...(prev.insurances || []),
        { insuranceId: "0", insuranceCardNumber: "", providingCompanyOrEmployer: "", dominantMember: { firstName: "", lastName: "", phone: "" } },
      ],
    }))
  }

  const updateInsurance = (index: number, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      insurances: (prev.insurances || []).map((insurance, i) => {
        if (i === index) {
          if (field.startsWith("dominantMember.")) {
            const dmField = field.split(".")[1]
            return { ...insurance, dominantMember: { ...insurance.dominantMember, [dmField]: value } }
          }
          return { ...insurance, [field]: value }
        }
        return insurance
      }),
    }))
  }

  const removeInsurance = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      insurances: (prev.insurances || []).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!formData.firstName || !formData.dateOfBirth || !formData.gender) {
      toast.error("Please fill in required fields (First Name, Date of Birth, and Gender)")
      return
    }

    const dobValidation = validateDateOfBirth(formData.dateOfBirth)
    if (!dobValidation.valid) {
      setDateError(dobValidation.error || "Invalid date of birth")
      toast.error(dobValidation.error || "Invalid date of birth")
      return
    }
    setDateError("")

    try {
      if (!patient?.id) {
        toast.error("Patient ID not found")
        return
      }

      const updateInput = nestedToFlat(formData)
      const result = await updatePatient(patient.id, updateInput)
      if (result.status === "SUCCESS") {
        toast.success(result.message || "Patient updated successfully!")
        if (onPatientUpdated && result.data) {
          onPatientUpdated(result.data)
        }
        onClose()
      } else {
        const message = (result as any).message || (result as any).messages?.[0]?.text || "Patient update failed"
        toast.error(message)
      }
    } catch {
      toast.error("Network error occurred")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[780px] max-h-[90vh] overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-3xl shadow-2xl p-2 sm:p-4"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Patient</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto scrollbar-hide pr-2 max-h-[calc(90vh-180px)] pb-20">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <PatientFormFields
              formData={formData}
              onFieldChange={handleFieldChange}
              onCountryChange={handleCountryChange}
              onProvinceChange={handleProvinceChange}
              onDistrictChange={handleDistrictChange}
              onSectorChange={handleSectorChange}
              onAddInsurance={addInsurance}
              onUpdateInsurance={updateInsurance}
              onRemoveInsurance={removeInsurance}
              availableInsurances={insurances}
              loading={loading}
              dateError={dateError}
            />

            <DialogFooter className="gap-2">
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
