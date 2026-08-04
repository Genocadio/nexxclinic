"use client"

import { useState, useEffect } from "react"
import { usePatients } from "@/hooks/auth-hooks"
import type { Patient, Visit } from "@/lib/api-types"
import type { SearchPatientsInput } from "@/lib/api-input-types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Edit } from "lucide-react"
import { toast } from "react-toastify"
import PatientFormDialog from "@/components/patient/patient-form-dialog"
import PatientEditModal from "@/components/patient-edit-modal"

interface PatientRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onPatientRegistered?: (
    patientId: string,
    patientInsurances: any[],
    proceedToVisit: boolean,
    createdVisit?: Visit,
  ) => void
  hideSearchPanel?: boolean
}

export default function PatientRegistrationModal({
  isOpen,
  onClose,
  onPatientRegistered,
  hideSearchPanel = false,
}: PatientRegistrationModalProps) {
  const [editPatientModal, setEditPatientModal] = useState(false)
  const [selectedPatientForEdit, setSelectedPatientForEdit] =
    useState<Patient | null>(null)

  // Search filters for potential duplicate detection
  const [searchFilters, setSearchFilters] = useState<SearchPatientsInput>({})

  const { patients: potentialMatches } =
    usePatients(
      Object.keys(searchFilters).length > 0 &&
      Object.values(searchFilters).some((v) => v !== undefined && v !== "")
        ? searchFilters
        : undefined,
      0,
      10,
    )

  const showPotentialMatches =
    !hideSearchPanel && potentialMatches.length > 0
  const dialogWidthClass = showPotentialMatches
    ? "sm:max-w-[1180px]"
    : "sm:max-w-[780px]"

  // Reset search filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchFilters({})
    }
  }, [isOpen])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          showCloseButton={false}
          className={`max-w-full ${dialogWidthClass} max-h-[90vh] overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-3xl shadow-2xl p-2 sm:p-4`}
        >
          <DialogTitle className="sr-only">Register New Patient</DialogTitle>
          <div
            className={
              "grid grid-cols-1 gap-2 sm:gap-6 h-full max-h-[calc(90vh-180px)] overflow-hidden" +
              (showPotentialMatches
                ? " lg:grid-cols-[760px_minmax(340px,1fr)]"
                : "")
            }
          >
            {/* Registration Form */}
            <div className="mx-auto w-full max-w-[760px] overflow-y-auto scrollbar-hide pr-2 pb-20 rounded-2xl border border-border/50 bg-[#FBF2ED] dark:bg-slate-900 shadow-lg p-2 sm:p-4">
              <h2 className="text-lg font-bold mb-4">Register New Patient</h2>
              <PatientFormDialog
                isOpen={isOpen}
                onClose={onClose}
                mode="create"
                onPatientSaved={(
                  patientId,
                  patientInsurances,
                  _proceedToVisit,
                  createdVisit,
                ) => {
                  if (onPatientRegistered) {
                    onPatientRegistered(
                      patientId,
                      patientInsurances,
                      false,
                      createdVisit,
                    )
                  }
                }}
              />
            </div>

            {/* Potential Matches Panel (hidden on mobile) */}
            {showPotentialMatches && (
              <div className="hidden md:block border-l border-border/50 overflow-y-auto scrollbar-hide pb-20 rounded-2xl bg-[#FBF2ED] dark:bg-slate-900 shadow-lg px-8 py-6">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground mb-2">
                    Found {potentialMatches.length} potential match
                    {potentialMatches.length !== 1 ? "es" : ""}
                  </div>
                  {potentialMatches.map((patient: Patient) => (
                    <div
                      key={patient.id}
                      className="relative overflow-visible border border-border/60 rounded-2xl p-4 hover:bg-muted/50 dark:hover:bg-muted/40 transition-all duration-200 w-full bg-background dark:bg-gray-900 shadow-sm"
                    >
                      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
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
                            toast.success(
                              `Selected existing patient: ${patient.firstName} ${patient.lastName}`,
                            )
                            onClose()
                            if (onPatientRegistered) {
                              onPatientRegistered(
                                patient.id.toString(),
                                patient.patientInsurances || [],
                                true,
                              )
                            }
                          }}
                          className="rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md"
                        >
                          Select
                        </Button>
                      </div>
                      <div className="mb-3 flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-foreground text-base">
                            {patient.firstName} {patient.lastName}
                          </h4>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div>
                          DOB:{" "}
                          {new Date(
                            patient.dateOfBirth,
                          ).toLocaleDateString()}
                        </div>
                        <div>Gender: {patient.gender}</div>
                        {patient.primaryPhoneNumber && (
                          <div className="col-span-2">
                            Phone: {patient.primaryPhoneNumber}
                          </div>
                        )}
                        {patient.nationalIdNumber && (
                          <div className="col-span-2">
                            ID: {patient.nationalIdNumber}
                          </div>
                        )}
                      </div>
                      {patient.patientInsurances &&
                        patient.patientInsurances.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-xs font-medium text-foreground mb-2">
                              Insurances:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {patient.patientInsurances.map(
                                (insurance, idx) => (
                                  <div
                                    key={idx}
                                    className="relative group text-xs bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg px-3 py-2 border border-primary/30 cursor-help hover:border-primary/50 transition-colors"
                                  >
                                    <span className="font-medium text-foreground">
                                      {insurance.insuranceProvider
                                        .acronym ||
                                        insurance.insuranceProvider
                                          .insuranceName}
                                    </span>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                                      <div className="bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                                        <div className="font-semibold">
                                          {
                                            insurance.insuranceProvider
                                              .insuranceName
                                          }
                                        </div>
                                        <div className="text-xs text-slate-300">
                                          Card:{" "}
                                          {insurance.insuranceCardNumber}
                                        </div>
                                        {insurance.principalMemberName && (
                                          <div className="text-xs text-slate-300">
                                            Member:{" "}
                                            {insurance.principalMemberName}
                                          </div>
                                        )}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
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
          toast.success(
            `Patient updated and selected: ${updatedPatient.firstName} ${updatedPatient.lastName}`,
          )
          setEditPatientModal(false)
          setSelectedPatientForEdit(null)
          onClose()
          if (onPatientRegistered) {
            onPatientRegistered(
              updatedPatient.id.toString(),
              updatedPatient.patientInsurances || [],
              true,
            )
          }
        }}
      />
    </>
  )
}
