"use client"

import React, { useMemo } from "react"
import type { Patient } from "@/lib/api-types"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import PatientFormDialog from "@/components/patient/patient-form-dialog"
import { usePatient } from "@/hooks/patients/hooks"
import { Loader2 } from "lucide-react"

interface PatientEditModalProps {
  isOpen: boolean
  onClose: () => void
  patient: Patient | null
  onPatientUpdated?: (patient: Patient) => void
}

export default function PatientEditModal({
  isOpen,
  onClose,
  patient,
  onPatientUpdated,
}: PatientEditModalProps) {
  const patientId = isOpen && patient?.id ? String(patient.id) : null
  const { patient: loadedPatient, loading } = usePatient(patientId)

  // Merge loaded patient (which has complete patientInsurances) with initial prop
  const effectivePatient = useMemo(() => {
    if (!patient) return null
    if (!loadedPatient) return patient
    return {
      ...patient,
      ...loadedPatient,
      patientInsurances:
        loadedPatient.patientInsurances && loadedPatient.patientInsurances.length > 0
          ? loadedPatient.patientInsurances
          : patient.patientInsurances || [],
    }
  }, [patient, loadedPatient])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="max-w-full sm:max-w-[1180px] max-h-[calc(100dvh-2rem)] overflow-hidden backdrop-blur-2xl bg-card/95 dark:bg-card/95 text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-2 sm:p-4"
      >
        <DialogTitle className="sr-only">Edit Patient</DialogTitle>
        {loading && (
          <Loader2 className="pointer-events-none absolute right-4 top-4 z-10 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        <div className="max-h-[calc(100dvh-4rem)] min-h-0 overflow-y-auto scrollbar-hide px-1">
          <PatientFormDialog
            isOpen={isOpen}
            onClose={onClose}
            mode="edit"
            patient={effectivePatient}
            onPatientSaved={(_id, _insurances, _proceed, _visit, updatedPatient) => {
              if (updatedPatient && onPatientUpdated) {
                onPatientUpdated(updatedPatient)
              }
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
