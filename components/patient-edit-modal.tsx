"use client"

import type React from "react"
import type { Patient } from "@/lib/api-types"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import PatientFormDialog from "@/components/patient/patient-form-dialog"

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[780px] max-h-[90vh] overflow-y-auto scrollbar-hide backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-3xl shadow-2xl p-2 sm:p-4"
      >
        <DialogTitle className="sr-only">Edit Patient</DialogTitle>
        <div className="mx-auto w-full max-w-[760px] pr-2 pb-20 rounded-2xl border border-border/50 bg-[#FBF2ED] dark:bg-slate-900 shadow-lg p-2 sm:p-4">
          <h2 className="text-lg font-bold mb-4">Edit Patient</h2>
          <PatientFormDialog
            isOpen={isOpen}
            onClose={onClose}
            mode="edit"
            patient={patient}
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
