"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  useRegisterPatient,
  useUpdatePatient,
  useInsurances,
} from "@/hooks/auth-hooks"
import { useSavePatientInsurance } from "@/hooks/patients/use-save-patient-insurance"
import { useDeletePatientInsurance } from "@/hooks/patients/hooks"
import {
  getChangedInsuranceRows,
  getInsuranceSaveKey,
  getInsuranceSnapshot,
  persistInsuranceChanges,
  type FormInsurance,
  type SavedInsuranceEntry,
} from "@/components/patient/patient-insurance-save"
import type { Patient, Gender, Visit, PatientInsurance } from "@/lib/api-types"
import type { UpdatePatientInput } from "@/lib/api-input-types"
import type { RegisterPatientInput } from "@/hooks/patients/hooks"
import { toast } from "react-toastify"
import {
  sanitizeEmailOrPhoneInput,
  sanitizePhoneInput,
  sanitizeNationalIdInput,
  parseRwandaNationalId,
  calculateAge,
  validateDateOfBirth,
  isInsuranceEntryComplete,
  canAddNewInsurance,
} from "@/lib/validation-utils"
import { cn } from "@/lib/utils"
import { splitFullName, splitWorkerName } from "@/lib/patient-display-utils"
import {
  getRwandaDistricts,
  getRwandaSectors,
  getAllRwandaDistricts,
  getAllRwandaSectors,
  findRwandaCellInfo,
  findRwandaVillageInfo,
} from "@/lib/location-data"
import PatientFormFields from "@/components/patient/patient-form-fields"

interface PatientFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onRequestClose?: () => void
  onDirtyChange?: (dirty: boolean) => void
  onBusyChange?: (busy: boolean) => void
  mode: "create" | "edit"
  patient?: Patient | null
  onPatientSaved?: (
    patientId: string,
    patientInsurances: any[],
    proceedToVisit: boolean,
    createdVisit?: Visit,
    updatedPatient?: Patient,
  ) => void
  /** Called when a field loses focus, e.g. for duplicate detection. */
  onFieldBlur?: (field: string, value: string) => void
  /** Called on every form field change with the current form data. */
  onFormChange?: (formData: RegisterPatientInput) => void
}

const flatToNested = (flat: UpdatePatientInput): RegisterPatientInput => {
  const gender = flat.gender === "MALE" ? "M" as const : flat.gender === "FEMALE" ? "F" as const : ""
  const fullName = [flat.firstName, flat.middleName, flat.lastName].filter(Boolean).join(" ").trim()
  return {
    name: fullName,
    firstName: flat.firstName || "",
    lastName: flat.lastName || "",
    middleName: flat.middleName || "",
    dateOfBirth: flat.dateOfBirth || "",
    gender,
    contactInfo: {
      phone: flat.primaryPhoneNumber || "",
      email: flat.alternativePhone || "",
      address: {
        country: flat.postalAddress || "Rwanda",
        province: "",
        district: flat.district || "",
        sector: flat.city || "",
        cell: flat.cell || "",
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

const nestedToFlat = (nested: RegisterPatientInput): UpdatePatientInput => {
  const resolved = nested.name
    ? splitFullName(nested.name)
    : {
        firstName: nested.firstName,
        middleName: nested.middleName,
        lastName: nested.lastName,
      }

  return {
    firstName: resolved.firstName || undefined,
    lastName: resolved.lastName || undefined,
    middleName: resolved.middleName || undefined,
    dateOfBirth: nested.dateOfBirth || undefined,
    gender: nested.gender === "M" ? "MALE" as Gender : nested.gender === "F" ? "FEMALE" as Gender : undefined,
    primaryPhoneNumber: nested.contactInfo?.phone || undefined,
    alternativePhone: nested.contactInfo?.email || undefined,
    cell: nested.contactInfo?.address?.cell || undefined,
    village: nested.contactInfo?.address?.village || undefined,
    city: nested.contactInfo?.address?.sector || undefined,
    district: nested.contactInfo?.address?.district || undefined,
    postalAddress: nested.contactInfo?.address?.country || undefined,
    nationalIdNumber: nested.nationalIdNumber || undefined,
    passportNumber: undefined,
    emergencyContactName: nested.emergencyContact?.name || undefined,
    emergencyContactRelationship: nested.emergencyContact?.relation || undefined,
    emergencyContactPhoneNumber: nested.emergencyContact?.phone || undefined,
  }
}

const getPatientDetailsSnapshot = (formData: RegisterPatientInput) =>
  JSON.stringify(nestedToFlat(formData))

const EMPTY_FORM: RegisterPatientInput = {
  name: "",
  firstName: "",
  lastName: "",
  middleName: "",
  dateOfBirth: "",
  gender: "",
  contactInfo: {
    phone: "",
    email: "",
    address: {
      country: "Rwanda",
      province: "",
      district: "",
      sector: "",
      cell: "",
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
  onRequestClose,
  onDirtyChange,
  onBusyChange,
  mode,
  patient,
  onPatientSaved,
  onFieldBlur,
  onFormChange,
}: PatientFormDialogProps) {
  const { registerPatient, loading: registerLoading } = useRegisterPatient()
  const { updatePatient, loading: updateLoading } = useUpdatePatient()
  const { savePatientInsurance } = useSavePatientInsurance()
  const { deletePatientInsurance } = useDeletePatientInsurance()
  const { insurances } = useInsurances()

  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<RegisterPatientInput>(EMPTY_FORM)
  const [savingChanges, setSavingChanges] = useState(false)
  const [insuranceSaveErrors, setInsuranceSaveErrors] = useState<Record<string, string>>({})
  const hasInteractedRef = useRef(false)
  const savedInsuranceEntriesRef = useRef<Map<string, SavedInsuranceEntry>>(new Map())
  const initialFormSnapshotRef = useRef(JSON.stringify(EMPTY_FORM))
  const initialPatientDetailsSnapshotRef = useRef(
    getPatientDetailsSnapshot(EMPTY_FORM),
  )
  const nextInsuranceClientIdRef = useRef(0)
  const formRef = useRef<HTMLFormElement>(null)
  const initializingFormRef = useRef(false)

  const isEdit = mode === "edit"

  /**
   * Convert existing PatientInsurance records from the API into the form's
   * RegisterPatientInput.insurances shape so they appear pre-filled in edit mode.
   */
  const mapExistingInsurances = (patientInsurances: PatientInsurance[]): NonNullable<RegisterPatientInput["insurances"]> => {
    return (patientInsurances || [])
      .filter((pi) => !pi.deactivated)
      .map((pi) => {
        const isPrincipal = pi.principalMember
        const fullName = pi.principalMemberName?.trim() || ""
        const nameParts = fullName ? fullName.split(/\s+/) : []
        return {
          id: pi.id,
          insuranceId: pi.insuranceProvider.id,
          insuranceCardNumber: pi.insuranceCardNumber,
          providingCompanyOrEmployer: pi.providingCompanyOrEmployer || "",
          patientShareCoverageId: pi.patientShareCoverageId || "",
          patientSharePercentage: pi.patientSharePercentage ?? "",
          isSelf: isPrincipal,
          dominantMember: isPrincipal
            ? { name: "", firstName: "", lastName: "", phone: "" }
            : {
                name: fullName,
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                phone: pi.principalMemberPhoneNumber || "",
              },
        }
      })
  }

  // Pre-fill form in edit mode (including existing insurances)
  useEffect(() => {
    if (!isOpen) return
    if (isEdit && patient) {
      const nested = flatToNested({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        middleName: patient.middleName || "",
        dateOfBirth: patient.dateOfBirth || "",
        gender: patient.gender as Gender | undefined,
        primaryPhoneNumber: patient.primaryPhoneNumber || "",
        alternativePhone: patient.alternativePhone || "",
        cell: patient.cell || "",
        village: patient.village || "",
        city: patient.city || "",
        district: patient.district || "",
        postalAddress: patient.postalAddress || "",
        nationalIdNumber: patient.nationalIdNumber || "",
        passportNumber: patient.passportNumber || "",
        emergencyContactName: patient.emergencyContactName || "",
        emergencyContactRelationship: patient.emergencyContactRelationship || "",
        emergencyContactPhoneNumber: patient.emergencyContactPhoneNumber || "",
      })
      // Populate insurance from existing patient records
      nested.insurances = mapExistingInsurances(patient.patientInsurances || [])
      savedInsuranceEntriesRef.current = new Map<string, SavedInsuranceEntry>(
        nested.insurances
          .filter((insurance) => insurance.id)
          .map((insurance, index) => [
            String(insurance.id),
            {
              snapshot: getInsuranceSnapshot(insurance),
              insurance,
              index,
            },
          ] as const),
      )
      initialFormSnapshotRef.current = JSON.stringify(nested)
      initialPatientDetailsSnapshotRef.current =
        getPatientDetailsSnapshot(nested)
      initializingFormRef.current = true
      setFormData(nested)
    } else if (!isEdit) {
      initialFormSnapshotRef.current = JSON.stringify(EMPTY_FORM)
      initialPatientDetailsSnapshotRef.current =
        getPatientDetailsSnapshot(EMPTY_FORM)
      initializingFormRef.current = true
      setFormData(EMPTY_FORM)
      savedInsuranceEntriesRef.current = new Map()
    }
    setError("")
    setFieldErrors({})
    setInsuranceSaveErrors({})
  }, [isOpen, isEdit, patient])

  useEffect(() => {
    if (!isOpen) return
    if (initializingFormRef.current) {
      initializingFormRef.current = false
      onDirtyChange?.(false)
      return
    }
    onDirtyChange?.(JSON.stringify(formData) !== initialFormSnapshotRef.current)
  }, [formData, isOpen, onDirtyChange])

  const handleInputChange = (field: string, value: string) => {
    hasInteractedRef.current = true
    const sanitizedValue =
      field === "contactInfo.email"
        ? sanitizeEmailOrPhoneInput(value)
        : field === "contactInfo.phone" || field === "emergencyContact.phone"
          ? sanitizePhoneInput(value)
          : field === "nationalIdNumber"
            ? sanitizeNationalIdInput(value)
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

      if (field === "name") {
        const parts = splitFullName(sanitizedValue)
        updated.name = sanitizedValue
        updated.firstName = parts.firstName
        updated.middleName = parts.middleName || ""
        updated.lastName = parts.lastName || ""
      }

      // Auto-populate Gender & Year of Birth from Rwandan 16-digit National ID
      if (field === "nationalIdNumber") {
        const nidInfo = parseRwandaNationalId(sanitizedValue)
        if (nidInfo.valid) {
          if (nidInfo.gender) {
            updated.gender = nidInfo.gender
          }
          if (nidInfo.yearOfBirth) {
            if (prev.dateOfBirth && /^\d{4}-\d{2}-\d{2}$/.test(prev.dateOfBirth)) {
              const [, mm, dd] = prev.dateOfBirth.split("-")
              updated.dateOfBirth = `${nidInfo.yearOfBirth}-${mm}-${dd}`
            } else {
              updated.dateOfBirth = `${nidInfo.yearOfBirth}-01-01`
            }
          }
        }
      }
      return updated
    })

    // Clear the inline error for the field being edited (or its group).
    setFieldErrors((prev) => {
      if (Object.keys(prev).length === 0) return prev
      const next = { ...prev }
      if (field === "name" || field === "firstName") {
        delete next["name"]
        delete next["firstName"]
      } else if (field === "dateOfBirth") {
        delete next["dateOfBirth"]
      } else if (field.startsWith("insurance.")) {
        const idx = field.split(".")[1]
        delete next[`insurance.${idx}.provider`]
        delete next[`insurance.${idx}.card`]
        delete next[`insurance.${idx}.employer`]
        delete next[`insurance.${idx}.dominant`]
      } else {
        delete next[field]
      }
      return next
    })
  }

  const addInsurance = () => {
    hasInteractedRef.current = true
    const insurances = formData.insurances || []
    if (insurances.length > 0) {
      const incompleteIndex = insurances.findIndex(
        (ins) => !isInsuranceEntryComplete(ins, formData.dateOfBirth),
      )
      if (incompleteIndex !== -1) {
        toast.warning(
          `Please fill in all required fields for Insurance #${incompleteIndex + 1} before adding another.`,
        )
        return
      }
    }
    const isAdult = calculateAge(formData.dateOfBirth) >= 18
    setFormData((prev) => ({
      ...prev,
      insurances: [
        ...(prev.insurances || []),
        {
          clientId: `local-insurance-${nextInsuranceClientIdRef.current++}`,
          insuranceId: "0",
          insuranceCardNumber: "",
          providingCompanyOrEmployer: "",
          patientShareCoverageId: "",
          patientSharePercentage: "",
          isSelf: isAdult,
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
    value: string | number | boolean,
  ) => {
    hasInteractedRef.current = true
    const insurance = formData.insurances?.[index]
    if (insurance) {
      const errorKey = getInsuranceSaveKey(insurance, index)
      setInsuranceSaveErrors((previous) => {
        if (!(errorKey in previous)) return previous
        const next = { ...previous }
        delete next[errorKey]
        return next
      })
    }
    setFormData((prev) => ({
      ...prev,
      insurances: (prev.insurances || []).map((insurance, i) => {
        if (i === index) {
          if (field.startsWith("dominantMember.")) {
            const dmField = field.split(".")[1]
            let dm = { ...insurance.dominantMember, [dmField]: value }
            if (dmField === "name") {
              const split = splitWorkerName(String(value))
              dm = {
                ...dm,
                name: String(value),
                firstName: split.firstName,
                lastName: split.lastName || "",
              }
            }
            return { ...insurance, dominantMember: dm }
          }
          if (field === "isSelf") {
            const isSelf = Boolean(value)
            return {
              ...insurance,
              isSelf,
              dominantMember: isSelf
                ? { name: "", firstName: "", lastName: "", phone: "" }
                : insurance.dominantMember || { name: "", firstName: "", lastName: "", phone: "" },
            }
          }
          return { ...insurance, [field]: value }
        }
        return insurance
      }),
    }))
  }

  const removeInsurance = (index: number) => {
    hasInteractedRef.current = true
    const remainingInsurances = (formData.insurances || []).filter(
      (_, currentIndex) => currentIndex !== index,
    )
    setInsuranceSaveErrors((previous) => {
      const next: Record<string, string> = {}
      remainingInsurances.forEach((insurance, newIndex) => {
        const oldIndex = newIndex < index ? newIndex : newIndex + 1
        const previousError =
          previous[getInsuranceSaveKey(insurance, oldIndex)]
        if (previousError) {
          next[getInsuranceSaveKey(insurance, newIndex)] = previousError
        }
      })
      return next
    })
    setFormData((prev) => ({
      ...prev,
      insurances: (prev.insurances || []).filter((_, i) => i !== index),
    }))
  }

  const handleCountryChange = (country: string) => {
    hasInteractedRef.current = true
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
    hasInteractedRef.current = true
    setFormData((prev) => {
      const validDistricts = getRwandaDistricts(province)
      const currentDistrict = prev.contactInfo?.address?.district || ""
      const keepDistrict = validDistricts.includes(currentDistrict)
      return {
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          email: prev.contactInfo?.email,
          phone: prev.contactInfo?.phone,
          address: {
            ...prev.contactInfo?.address,
            country: "Rwanda",
            province,
            district: keepDistrict ? currentDistrict : "",
            sector: keepDistrict ? prev.contactInfo?.address?.sector || "" : "",
          },
        },
      }
    })
  }

  const handleDistrictChange = (district: string, province?: string) => {
    hasInteractedRef.current = true
    setFormData((prev) => {
      let resolvedProvince = province || prev.contactInfo?.address?.province || ""
      if (!resolvedProvince) {
        const allDistricts = getAllRwandaDistricts()
        const found = allDistricts.find((d) => d.district.toLowerCase() === district.toLowerCase())
        if (found) resolvedProvince = found.province
      }
      const validSectors = resolvedProvince ? getRwandaSectors(resolvedProvince, district) : []
      const keepSector = validSectors.includes(prev.contactInfo?.address?.sector || "")

      return {
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          email: prev.contactInfo?.email,
          phone: prev.contactInfo?.phone,
          address: {
            ...prev.contactInfo?.address,
            country: "Rwanda",
            province: resolvedProvince,
            district,
            sector: keepSector ? prev.contactInfo?.address?.sector || "" : "",
          },
        },
      }
    })
  }

  const handleSectorChange = (sector: string, district?: string, province?: string) => {
    hasInteractedRef.current = true
    setFormData((prev) => {
      let resolvedDistrict = district || prev.contactInfo?.address?.district || ""
      let resolvedProvince = province || prev.contactInfo?.address?.province || ""

      if (!resolvedDistrict || !resolvedProvince) {
        const allSectors = getAllRwandaSectors()
        const match = allSectors.find(
          (s) =>
            s.sector.toLowerCase() === sector.toLowerCase() &&
            (!district || s.district.toLowerCase() === district.toLowerCase()) &&
            (!province || s.province.toLowerCase() === province.toLowerCase()),
        )
        if (match) {
          resolvedDistrict = match.district
          resolvedProvince = match.province
        }
      }

      return {
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          email: prev.contactInfo?.email,
          phone: prev.contactInfo?.phone,
          address: {
            ...prev.contactInfo?.address,
            country: "Rwanda",
            province: resolvedProvince,
            district: resolvedDistrict,
            sector,
            cell: prev.contactInfo?.address?.cell || "",
            village: prev.contactInfo?.address?.village || "",
          },
        },
      }
    })
  }

  const handleCellChange = (
    cell: string,
    sector?: string,
    district?: string,
    province?: string,
  ) => {
    hasInteractedRef.current = true
    setFormData((prev) => {
      let resolvedSector = sector || prev.contactInfo?.address?.sector || ""
      let resolvedDistrict = district || prev.contactInfo?.address?.district || ""
      let resolvedProvince = province || prev.contactInfo?.address?.province || ""

      if (!resolvedSector || !resolvedDistrict || !resolvedProvince) {
        const found =
          findRwandaCellInfo(cell, resolvedSector, resolvedDistrict, resolvedProvince) ||
          findRwandaCellInfo(cell)
        if (found) {
          resolvedSector = found.sector
          resolvedDistrict = found.district
          resolvedProvince = found.province
        }
      }

      return {
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          email: prev.contactInfo?.email,
          phone: prev.contactInfo?.phone,
          address: {
            ...prev.contactInfo?.address,
            country: "Rwanda",
            province: resolvedProvince,
            district: resolvedDistrict,
            sector: resolvedSector,
            cell,
            village: prev.contactInfo?.address?.village || "",
          },
        },
      }
    })
  }

  const handleVillageChange = (
    village: string,
    cell?: string,
    sector?: string,
    district?: string,
    province?: string,
  ) => {
    hasInteractedRef.current = true
    setFormData((prev) => {
      let resolvedCell = cell || prev.contactInfo?.address?.cell || ""
      let resolvedSector = sector || prev.contactInfo?.address?.sector || ""
      let resolvedDistrict = district || prev.contactInfo?.address?.district || ""
      let resolvedProvince = province || prev.contactInfo?.address?.province || ""

      if (!resolvedCell || !resolvedSector || !resolvedDistrict || !resolvedProvince) {
        const found =
          findRwandaVillageInfo(village, resolvedCell, resolvedSector, resolvedDistrict, resolvedProvince) ||
          findRwandaVillageInfo(village)
        if (found) {
          resolvedCell = found.cell
          resolvedSector = found.sector
          resolvedDistrict = found.district
          resolvedProvince = found.province
        }
      }

      return {
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          email: prev.contactInfo?.email,
          phone: prev.contactInfo?.phone,
          address: {
            ...prev.contactInfo?.address,
            country: "Rwanda",
            province: resolvedProvince,
            district: resolvedDistrict,
            sector: resolvedSector,
            cell: resolvedCell,
            village,
          },
        },
      }
    })
  }

  // ── Notify parent of ALL form data changes (duplicate detection) ─────────
  // A single useEffect on formData ensures every handler — handleInputChange,
  // handleCountryChange, addInsurance, updateInsurance, removeInsurance, etc.
  // — automatically notifies the parent without needing individual calls.
  useEffect(() => {
    if (hasInteractedRef.current) {
      onFormChange?.(formData)
    }
  }, [formData, onFormChange])

  const loading = isEdit
    ? updateLoading || savingChanges
    : registerLoading

  const scrollToFirstFieldError = () => {
    requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLElement>("[data-field-error]")
        ?.scrollIntoView({ behavior: "smooth", block: "center" })
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    // Inline field validation (shown below the fields, never as toasts).
    const nextErrors: Record<string, string> = {}
    const fullNameValue = (formData.name ?? [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(" ")).trim()
    if (!fullNameValue) {
      nextErrors["name"] = "Full name is required"
      nextErrors["firstName"] = "Full name is required"
    }
    if (!formData.dateOfBirth) {
      nextErrors["dateOfBirth"] = "Date of birth is required"
    } else {
      const dobValidation = validateDateOfBirth(formData.dateOfBirth)
      if (!dobValidation.valid) {
        nextErrors["dateOfBirth"] = dobValidation.error || "Invalid date of birth"
      }
    }
    if (!formData.gender) {
      nextErrors["gender"] = "Gender is required"
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      scrollToFirstFieldError()
      return
    }

    const insuranceRows = formData.insurances || []
    const insuranceRowsToSave = getChangedInsuranceRows(
      insuranceRows,
      isEdit,
      savedInsuranceEntriesRef.current,
    )

    const insuranceErrors: Record<string, string> = {}
    for (const { insurance, index } of insuranceRowsToSave) {
      const missing = (value?: string | null) => !value?.trim()
      const prefix = `insurance.${index}`
      const isMinor = calculateAge(formData.dateOfBirth) < 18

      if (!insurance.insuranceId || String(insurance.insuranceId) === "0") {
        insuranceErrors[`${prefix}.provider`] = "Select an insurance provider"
      }
      if (missing(insurance.insuranceCardNumber)) {
        insuranceErrors[`${prefix}.card`] = "Insurance card number is required"
      }
      if (missing(insurance.providingCompanyOrEmployer)) {
        insuranceErrors[`${prefix}.employer`] = "Providing company or employer is required"
      }

      const hasDominantInfo = Boolean(
        insurance.dominantMember?.name?.trim() ||
        insurance.dominantMember?.firstName?.trim() ||
        insurance.dominantMember?.lastName?.trim() ||
        insurance.dominantMember?.phone?.trim(),
      )
      if (isMinor || hasDominantInfo) {
        const phone = insurance.dominantMember?.phone?.trim()
        if (phone && !/^\+?\d{7,15}$/.test(phone.replace(/\s+/g, ""))) {
          insuranceErrors[`${prefix}.dominant`] =
            "Enter a valid phone number (7-15 digits, optional leading +)"
        }
        const dmResolved = insurance.dominantMember?.name
          ? splitFullName(insurance.dominantMember.name)
          : {
              firstName: insurance.dominantMember?.firstName?.trim() || "",
              lastName: insurance.dominantMember?.lastName?.trim() || "",
            }
        const hasDmName = Boolean(
          insurance.dominantMember?.name?.trim() ||
          (dmResolved.firstName && dmResolved.lastName)
        )
        if (!hasDmName || missing(insurance.dominantMember?.phone)) {
          insuranceErrors[`${prefix}.dominant`] =
            "Principal member full name and phone are required for patients under 18 or when details are provided"
        }
      }
    }

    if (Object.keys(insuranceErrors).length > 0) {
      setFieldErrors(insuranceErrors)
      scrollToFirstFieldError()
      return
    }
    setFieldErrors({})

    if (isEdit) {
      if (!patient?.id) {
        toast.error("Patient ID not found")
        return
      }

      const updateInput = nestedToFlat(formData)
      const patientDetailsSnapshot = JSON.stringify(updateInput)
      const patientDetailsChanged =
        patientDetailsSnapshot !== initialPatientDetailsSnapshotRef.current
      setSavingChanges(true)
      onBusyChange?.(true)
      try {
        let updatedPatient: Patient | undefined
        let updateMessage: string | undefined
        if (patientDetailsChanged) {
          const result = await updatePatient(patient.id, updateInput)
          if (result.status !== "SUCCESS") {
            const message =
              (result as any).message ||
              (result as any).messages?.[0]?.text ||
              "Patient update failed"
            toast.error(message)
            return
          }
          initialPatientDetailsSnapshotRef.current = patientDetailsSnapshot
          updatedPatient = result.data
          updateMessage = result.message
        }

        const persistence = await persistInsuranceChanges({
          insuranceRows,
          savedEntries: savedInsuranceEntriesRef.current,
          saveInsurance: async (insurance: FormInsurance) => {
            const isAdult = calculateAge(formData.dateOfBirth) >= 18
            const isSelf = isAdult ? insurance.isSelf !== false : false
            const dmResolved = insurance.dominantMember?.name
              ? splitFullName(insurance.dominantMember.name)
              : {
                  firstName: insurance.dominantMember?.firstName?.trim() || "",
                  lastName: insurance.dominantMember?.lastName?.trim() || "",
                }
            const saveResult = await savePatientInsurance({
              patientId: patient.id,
              patientDateOfBirth: formData.dateOfBirth,
              insuranceProviderId: String(insurance.insuranceId),
              insuranceCardNumber: insurance.insuranceCardNumber,
              providingCompanyOrEmployer: insurance.providingCompanyOrEmployer,
              isSelf,
              dominantName: insurance.dominantMember?.name || undefined,
              dominantFirstName: isSelf ? undefined : (dmResolved.firstName || undefined),
              dominantLastName: isSelf ? undefined : (dmResolved.lastName || undefined),
              dominantPhone: isSelf ? undefined : (insurance.dominantMember?.phone || undefined),
              patientSharePercentage:
                insurance.patientSharePercentage !== "" &&
                insurance.patientSharePercentage != null
                  ? Number(insurance.patientSharePercentage)
                  : null,
              patientShareCoverageId: insurance.patientShareCoverageId || null,
              existingPatientInsuranceId: insurance.id,
              existingPatientInsurances: patient.patientInsurances,
            })
            return {
              status: saveResult.status,
              id: saveResult.response?.data?.id,
              message: saveResult.response?.message,
            }
          },
          deleteInsurance: async (id) => {
            const deleteResult = await deletePatientInsurance(id)
            return {
              status: deleteResult.status,
              data: deleteResult.data,
              message: deleteResult.message,
            }
          },
        })
        savedInsuranceEntriesRef.current = persistence.savedEntries

        const failedDeletes = persistence.failures
          .filter((failure) => failure.kind === "delete")
          .sort((a, b) => a.index - b.index)
        const nextInsuranceRows = insuranceRows.map((insurance, index) => {
          const id = persistence.newIds.get(index)
          return id ? { ...insurance, id } : insurance
        })
        for (const failure of failedDeletes) {
          if (
            nextInsuranceRows.some(
              (insurance) =>
                String(insurance.id || "") ===
                String(failure.insurance.id || ""),
            )
          ) {
            continue
          }
          nextInsuranceRows.splice(
            Math.min(failure.index, nextInsuranceRows.length),
            0,
            failure.insurance,
          )
        }

        const nextInsuranceErrors: Record<string, string> = {}
        for (const failure of persistence.failures) {
          const index = failure.insurance.id
            ? nextInsuranceRows.findIndex(
                (insurance) =>
                  String(insurance.id || "") ===
                  String(failure.insurance.id || ""),
              )
            : nextInsuranceRows.indexOf(failure.insurance)
          const row = nextInsuranceRows[index]
          nextInsuranceErrors[
            row ? getInsuranceSaveKey(row, index) : failure.key
          ] = failure.message
        }
        setInsuranceSaveErrors(nextInsuranceErrors)

        const committedInsuranceRows = nextInsuranceRows.flatMap(
          (insurance) => {
            const id = insurance.id && String(insurance.id)
            const savedEntry = id
              ? persistence.savedEntries.get(id)
              : undefined
            return savedEntry ? [savedEntry.insurance] : []
          },
        )
        const currentFormSnapshot = JSON.stringify({
          ...formData,
          insurances: nextInsuranceRows,
        })
        initialFormSnapshotRef.current = JSON.stringify({
          ...formData,
          insurances: committedInsuranceRows,
        })
        onDirtyChange?.(
          currentFormSnapshot !== initialFormSnapshotRef.current,
        )

        if (persistence.newIds.size > 0 || failedDeletes.length > 0) {
          setFormData((previous) => ({
            ...previous,
            insurances: nextInsuranceRows,
          }))
        }

        if (persistence.failures.length > 0) {
          toast.error(
            patientDetailsChanged
              ? "Patient details saved. Review the insurance entries marked below and try again."
              : "Review the insurance entries marked below and try again.",
          )
          return
        }

        toast.success(
          updateMessage || "Patient changes saved successfully!",
        )
        if (onPatientSaved) {
          onPatientSaved(
            patient.id,
            [],
            false,
            undefined,
            updatedPatient ?? patient,
          )
        }
        onClose()
      } catch {
        toast.error("Network error occurred")
      } finally {
        setSavingChanges(false)
        onBusyChange?.(false)
      }
    } else {
      onBusyChange?.(true)
      try {
        const result = await registerPatient(formData)
        if (result.status === "SUCCESS") {
          initialFormSnapshotRef.current = JSON.stringify(EMPTY_FORM)
          onDirtyChange?.(false)
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
      } finally {
        onBusyChange?.(false)
      }
    }
  }

  const submitLabel = isEdit
    ? loading ? "Saving..." : "Save Changes"
    : loading ? "Registering..." : "Register"

  // Add Insurance stays disabled while an existing entry is unfilled
  const canAddInsurance = canAddNewInsurance(
    formData.insurances,
    formData.dateOfBirth,
  )

  return (
    <>
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-2"
        noValidate
      >
        <fieldset disabled={loading} className="min-w-0 w-full border-0 p-0">
          <PatientFormFields
            formData={formData}
            onFieldChange={handleInputChange}
            onFieldBlur={onFieldBlur}
            onCountryChange={handleCountryChange}
            onProvinceChange={handleProvinceChange}
            onDistrictChange={handleDistrictChange}
            onSectorChange={handleSectorChange}
            onCellChange={handleCellChange}
            onVillageChange={handleVillageChange}
            onUpdateInsurance={updateInsurance}
            onRemoveInsurance={removeInsurance}
            availableInsurances={insurances}
            loading={loading}
            fieldErrors={fieldErrors}
            insuranceSaveErrors={insuranceSaveErrors}
            dateError={fieldErrors["dateOfBirth"]}
          />
        </fieldset>

        {/* Pinned actions: sticky so Add Insurance / Cancel / Register stay
            visible whenever the form scrolls (small heights); settles at the
            end when it fits. */}
        <div className="sticky bottom-0 z-10 -mx-1 flex flex-col gap-2 border-t border-border/30 bg-card/95 px-1 pt-2 backdrop-blur-sm dark:bg-card/95 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-3">
          <button
            type="button"
            onClick={addInsurance}
            disabled={!canAddInsurance || loading}
            title={
              !canAddInsurance
                ? "Please complete all required fields on the current insurance first"
                : undefined
            }
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium shadow-md transition-all duration-200 flex-1 sm:flex-none",
              canAddInsurance
                ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white hover:opacity-90 cursor-pointer"
                : "bg-muted text-muted-foreground border border-border/60 opacity-60 cursor-not-allowed",
            )}
          >
            + Add Insurance
          </button>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={onRequestClose || onClose}
              disabled={loading}
              className="rounded-full px-5 py-2 bg-background dark:bg-gray-900 border border-border/70 text-foreground hover:bg-muted/40 dark:hover:bg-muted/50 shadow-lg text-sm flex-1 sm:flex-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full px-8 py-2 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-lg hover:opacity-90 transition-all duration-200 text-sm flex-1 sm:flex-none disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
