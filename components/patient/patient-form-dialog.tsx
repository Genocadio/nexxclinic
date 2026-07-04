"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import {
  useRegisterPatient,
  useUpdatePatient,
  useInsurances,
} from "@/hooks/auth-hooks"
import { useCreatePatientInsurance } from "@/hooks/patients/hooks"
import type { Patient, Gender, Visit } from "@/lib/api-types"
import type { UpdatePatientInput } from "@/lib/api-input-types"
import type { RegisterPatientInput } from "@/hooks/patients/hooks"
import { toast } from "react-toastify"
import {
  sanitizeEmailOrPhoneInput,
  sanitizePhoneInput,
  isDominantMemberRequired,
  validateDateOfBirth,
} from "@/lib/validation-utils"
import PatientFormFields from "@/components/patient/patient-form-fields"

interface PatientFormDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  patient?: Patient | null
  onPatientSaved?: (
    patientId: string,
    patientInsurances: any[],
    proceedToVisit: boolean,
    createdVisit?: Visit,
    updatedPatient?: Patient,
  ) => void
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

const EMPTY_FORM: RegisterPatientInput = {
  firstName: "",
  lastName: "",
  middleName: "",
  dateOfBirth: "",
  gender: "",
  contactInfo: {
    phone: "",
    email: "",
    address: {
      country: "",
      province: "",
      district: "",
      sector: "",
      village: "",
      address: "",
    },
  },
  emergencyContact: {
    name: "",
    relation: "",
    phone: "",
  },
  nationalIdNumber: "",
  insurances: [],
}

export default function PatientFormDialog({
  isOpen,
  onClose,
  mode,
  patient,
  onPatientSaved,
}: PatientFormDialogProps) {
  const { registerPatient, loading: registerLoading } = useRegisterPatient()
  const { updatePatient, loading: updateLoading } = useUpdatePatient()
  const { createPatientInsurance } = useCreatePatientInsurance()
  const { insurances } = useInsurances()

  const [error, setError] = useState("")
  const [dateError, setDateError] = useState("")
  const [formData, setFormData] = useState<RegisterPatientInput>(EMPTY_FORM)
  const [savingInsurances, setSavingInsurances] = useState<Set<number>>(new Set())

  const isEdit = mode === "edit"
  const createPatientInsuranceRef = useRef(createPatientInsurance)
  createPatientInsuranceRef.current = createPatientInsurance

  // Pre-fill form in edit mode
  useEffect(() => {
    if (!isOpen) return
    if (isEdit && patient) {
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
    } else if (!isEdit) {
      setFormData(EMPTY_FORM)
    }
    setError("")
    setDateError("")
    setSavingInsurances(new Set())
  }, [isOpen, isEdit, patient])

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue =
      field === "contactInfo.email"
        ? sanitizeEmailOrPhoneInput(value)
        : field === "contactInfo.phone" || field === "emergencyContact.phone"
          ? sanitizePhoneInput(value)
          : value

    setFormData((prev) => {
      const keys = field.split(".")
      const updated = { ...prev }
      let current: any = updated
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = sanitizedValue
      return updated
    })

    if (field === "dateOfBirth") setDateError("")
  }

  const addInsurance = () => {
    setFormData((prev) => ({
      ...prev,
      insurances: [
        ...(prev.insurances || []),
        {
          insuranceId: "0",
          insuranceCardNumber: "",
          providingCompanyOrEmployer: "",
          dominantMember: {
            firstName: "",
            lastName: "",
            phone: "",
          },
        },
      ],
    }))
  }

  const updateInsurance = (
    index: number,
    field: string,
    value: string | number,
  ) => {
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

  // In edit mode, auto-save insurance when all required fields are filled
  const pendingSaveRef = useRef<Set<number>>(new Set())
  useEffect(() => {
    if (!isEdit || !patient?.id) return
    const insurances = formData.insurances || []
    for (let i = 0; i < insurances.length; i++) {
      const ins = insurances[i]
      if (
        ins.insuranceId &&
        String(ins.insuranceId) !== "0" &&
        ins.insuranceCardNumber?.trim() &&
        ins.providingCompanyOrEmployer?.trim() &&
        !savingInsurances.has(i) &&
        !pendingSaveRef.current.has(i)
      ) {
        const dominantRequired = isDominantMemberRequired(formData.dateOfBirth, true)
        if (
          !dominantRequired ||
          (ins.dominantMember?.firstName?.trim() &&
            ins.dominantMember?.lastName?.trim() &&
            ins.dominantMember?.phone?.trim())
        ) {
          pendingSaveRef.current.add(i)
          setSavingInsurances((prev) => new Set(prev).add(i))

          const now = new Date()
          const validFrom = now.toISOString().slice(0, 10)
          const validUntil = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
            .toISOString().slice(0, 10)

          createPatientInsuranceRef.current({
            patientId: patient.id,
            insuranceProviderId: String(ins.insuranceId),
            insuranceCardNumber: ins.insuranceCardNumber,
            providingCompanyOrEmployer: ins.providingCompanyOrEmployer,
            dominantMember: ins.dominantMember,
            validFrom,
            validUntil,
          })
            .then(() => {
              toast.success("Insurance saved to patient record")
            })
            .catch(() => {
              toast.error("Failed to save insurance")
            })
            .finally(() => {
              pendingSaveRef.current.delete(i)
              setSavingInsurances((prev) => {
                const next = new Set(prev)
                next.delete(i)
                return next
              })
            })
        }
      }
    }
  }, [isEdit, patient?.id, formData])

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
        address: {
          ...prev.contactInfo?.address,
          province,
          district: "",
          sector: "",
        },
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
        address: {
          ...prev.contactInfo?.address,
          district,
          sector: "",
        },
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
        address: {
          ...prev.contactInfo?.address,
          sector,
        },
      },
    }))
  }

  const canSubmit = useMemo(() => {
    if (
      !formData.firstName?.trim() ||
      !formData.dateOfBirth ||
      !formData.gender
    )
      return false

    if (formData.dateOfBirth) {
      const dv = validateDateOfBirth(formData.dateOfBirth)
      if (!dv.valid) return false
    }

    if (!isEdit) {
      const hasInsurance = (formData.insurances?.length ?? 0) > 0
      if (hasInsurance) {
        for (const ins of formData.insurances!) {
          if (
            !ins.insuranceId ||
            String(ins.insuranceId) === "0" ||
            !ins.insuranceCardNumber?.trim() ||
            !ins.providingCompanyOrEmployer?.trim()
          )
            return false
        }

        const dominantRequired = isDominantMemberRequired(
          formData.dateOfBirth,
          true,
        )
        if (dominantRequired) {
          for (const ins of formData.insurances!) {
            if (
              !ins.dominantMember?.firstName?.trim() ||
              !ins.dominantMember?.lastName?.trim() ||
              !ins.dominantMember?.phone?.trim()
            )
              return false
          }
        }
      }
    }

    return true
  }, [formData, isEdit])

  const loading = isEdit ? updateLoading : registerLoading

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

    if (isEdit) {
      if (!patient?.id) {
        toast.error("Patient ID not found")
        return
      }

      try {
        const updateInput = nestedToFlat(formData)
        const result = await updatePatient(patient.id, updateInput)
        if (result.status === "SUCCESS") {
          toast.success(result.message || "Patient updated successfully!")
          if (onPatientSaved && result.data) {
            onPatientSaved(patient.id, [], false, undefined, result.data)
          }
          onClose()
        } else {
          const message = (result as any).message || (result as any).messages?.[0]?.text || "Patient update failed"
          toast.error(message)
        }
      } catch {
        toast.error("Network error occurred")
      }
    } else {
      const hasInsurance = (formData.insurances?.length ?? 0) > 0
      const dominantMemberRequired = isDominantMemberRequired(
        formData.dateOfBirth,
        hasInsurance,
      )

      if (dominantMemberRequired) {
        for (let i = 0; i < (formData.insurances?.length || 0); i++) {
          const insurance = formData.insurances![i]
          if (
            !insurance.dominantMember?.firstName ||
            !insurance.dominantMember?.lastName ||
            !insurance.dominantMember?.phone
          ) {
            toast.error(
              `Insurance #${i + 1}: Dominant member information (First Name, Last Name, Phone) is required for patients 18 years or younger`,
            )
            return
          }
        }
      }

      if (formData.insurances && formData.insurances.length > 0) {
        for (let i = 0; i < formData.insurances.length; i++) {
          const insurance = formData.insurances[i]
          if (
            !insurance.insuranceId ||
            String(insurance.insuranceId) === "0" ||
            !insurance.insuranceCardNumber ||
            !insurance.providingCompanyOrEmployer
          ) {
            toast.error(
              `Insurance #${i + 1}: Insurance provider, card number, and providing company/employer are required`,
            )
            return
          }
        }
      }

      try {
        const result = await registerPatient(formData)
        if (result.status === "SUCCESS") {
          toast.success(result.message || "Patient registered successfully!")
          if (onPatientSaved && result.data?.patient?.id) {
            onPatientSaved(
              result.data.patient.id,
              result.data.linkedInsurances || [],
              false,
              result.data,
            )
          }
          setFormData(EMPTY_FORM)
          onClose()
        } else {
          const message =
            result.message ||
            (result as any).messages?.[0]?.text ||
            "Patient registration failed"
          toast.error(message)
        }
      } catch {
        toast.error("Network error occurred")
      }
    }
  }

  const submitLabel = isEdit
    ? loading ? "Saving..." : "Save Changes"
    : loading ? "Registering..." : "Register"

  return (
    <>
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
        <PatientFormFields
          formData={formData}
          onFieldChange={handleInputChange}
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

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-8 pt-3 sm:pt-6 border-t border-border/30 -mx-2 sm:-mx-4 px-2 sm:px-4 pb-2 sm:pb-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 sm:py-2.5 bg-background dark:bg-gray-900 border border-border/70 text-foreground hover:bg-muted/40 dark:hover:bg-muted/50 shadow-lg text-xs sm:text-base flex-1 sm:flex-initial"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="rounded-full px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-lg hover:opacity-90 transition-all duration-200 text-xs sm:text-base flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </>
  )
}
