"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useUpdatePatient } from "@/hooks/auth-hooks"
import type { Patient, Gender } from "@/lib/api-types"
import type { UpdatePatientInput } from "@/lib/api-input-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import { sanitizeEmailInput, sanitizePhoneInput } from "@/lib/validation-utils"

interface PatientEditModalProps {
  isOpen: boolean
  onClose: () => void
  patient: Patient | null
  onPatientUpdated?: (patient: Patient) => void
}

const emptyForm: UpdatePatientInput = {
  firstName: "",
  lastName: "",
  middleName: "",
  dateOfBirth: "",
  gender: undefined,
  primaryPhoneNumber: "",
  alternativePhone: "",
  village: "",
  city: "",
  district: "",
  postalAddress: "",
  nationalIdNumber: "",
  passportNumber: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhoneNumber: "",
}

export default function PatientEditModal({ isOpen, onClose, patient, onPatientUpdated }: PatientEditModalProps) {
  const { updatePatient, loading } = useUpdatePatient()
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<UpdatePatientInput>(emptyForm)

  // Populate form when patient data is available
  useEffect(() => {
    if (patient && isOpen) {
      setFormData({
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
      })
      setError("")
    }
  }, [patient, isOpen])

  const handleChange = (field: keyof UpdatePatientInput, value: string) => {
    const sanitized =
      field === "primaryPhoneNumber" || field === "alternativePhone" || field === "emergencyContactPhoneNumber"
        ? sanitizePhoneInput(value)
        : value
    setFormData(prev => ({ ...prev, [field]: sanitized }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.firstName || !formData.dateOfBirth) {
      toast.error("Please fill in required fields (First Name and Date of Birth)")
      return
    }

    try {
      if (!patient?.id) {
        toast.error("Patient ID not found")
        return
      }

      const result = await updatePatient(patient.id, formData)
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden bg-card/95 backdrop-blur-xl border-border/50 rounded-3xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Patient</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update patient information
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto scrollbar-hide pr-2 max-h-[calc(90vh-180px)] pb-20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">First Name *</label>
                <Input
                  type="text"
                  value={formData.firstName || ""}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
                <Input
                  type="text"
                  value={formData.lastName || ""}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Middle Name</label>
                <Input
                  type="text"
                  value={formData.middleName || ""}
                  onChange={(e) => handleChange("middleName", e.target.value)}
                  placeholder="Enter middle name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Date of Birth *</label>
                <Input
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Gender</label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value as Gender }))}
                >
                  <SelectTrigger suppressHydrationWarning>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">National ID</label>
                <Input
                  type="text"
                  value={formData.nationalIdNumber || ""}
                  onChange={(e) => handleChange("nationalIdNumber", e.target.value)}
                  placeholder="Enter national ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Passport Number</label>
                <Input
                  type="text"
                  value={formData.passportNumber || ""}
                  onChange={(e) => handleChange("passportNumber", e.target.value)}
                  placeholder="Enter passport number"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                  <Input
                    type="tel"
                    value={formData.primaryPhoneNumber || ""}
                    onChange={(e) => handleChange("primaryPhoneNumber", e.target.value)}
                    placeholder="Enter primary phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Alternative Phone</label>
                  <Input
                    type="tel"
                    value={formData.alternativePhone || ""}
                    onChange={(e) => handleChange("alternativePhone", e.target.value)}
                    placeholder="Enter alternative phone"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mt-4">
                <h4 className="text-md font-medium mb-2">Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    value={formData.village || ""}
                    onChange={(e) => handleChange("village", e.target.value)}
                    placeholder="Village"
                  />
                  <Input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="City"
                  />
                  <Input
                    type="text"
                    value={formData.district || ""}
                    onChange={(e) => handleChange("district", e.target.value)}
                    placeholder="District"
                  />
                  <Input
                    type="text"
                    value={formData.postalAddress || ""}
                    onChange={(e) => handleChange("postalAddress", e.target.value)}
                    placeholder="Postal Address"
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
                  value={formData.emergencyContactName || ""}
                  onChange={(e) => handleChange("emergencyContactName", e.target.value)}
                  placeholder="Contact name"
                />
                <Input
                  type="text"
                  value={formData.emergencyContactRelationship || ""}
                  onChange={(e) => handleChange("emergencyContactRelationship", e.target.value)}
                  placeholder="Relationship"
                />
                <Input
                  type="tel"
                  value={formData.emergencyContactPhoneNumber || ""}
                  onChange={(e) => handleChange("emergencyContactPhoneNumber", e.target.value)}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <DialogFooter>
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
