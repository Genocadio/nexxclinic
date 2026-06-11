"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { usePatients, useDepartments, useCreateVisit, usePatient } from "@/hooks/auth-hooks"
import type { Patient } from "@/lib/api-types"
import type { PatientFilterInput } from "@/hooks/patients/hooks"
import { getPatientDisplayName, getPatientPhone } from "@/lib/patient-display-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, User, ArrowLeft, Edit, X, ShieldPlus } from "lucide-react"
import { toast } from "react-toastify"
import PatientEditModal from "@/components/patient-edit-modal"
import { AddPatientInsuranceModal } from "@/components/patient/add-patient-insurance-modal"
import { DepartmentAutocomplete } from "@/components/ui/department-autocomplete"

const TRIAGE_SERVICE_ID = '__TRIAGE__'

interface VisitCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onVisitCreated?: () => void
  preSelectedPatientId?: string
}

type ModalStep = "patient-selection" | "visit-details"
type SearchFilterType = "name" | "phoneNumber" | "insuranceName"

export default function VisitCreationModal({ isOpen, onClose, onVisitCreated, preSelectedPatientId }: VisitCreationModalProps) {
  const [currentStep, setCurrentStep] = useState<ModalStep>("patient-selection")
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(preSelectedPatientId || null)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  const { patient: preSelectedPatientData, loading: _patientLoading, refetch: refetchPreSelectedPatient } = usePatient(preSelectedPatientId || null)
  const { patient: selectedPatientDetails, refetch: refetchSelectedPatientDetails } = usePatient(selectedPatientId && !preSelectedPatientId ? selectedPatientId : null)
  const { departments, loading: departmentsLoading } = useDepartments()
  const { createVisit, loading: visitLoading } = useCreateVisit()
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilterType, setSearchFilterType] = useState<SearchFilterType>("name")
  const [patientFilter, setPatientFilter] = useState<PatientFilterInput>({})
  const [shouldSearch, setShouldSearch] = useState(false)
  
  const [selectedServiceId, setSelectedServiceId] = useState<string>(TRIAGE_SERVICE_ID)
  const [selectedInsuranceIds, setSelectedInsuranceIds] = useState<string[]>([])
  const [visitNoteText, setVisitNoteText] = useState("")
  const [visitNoteDepartment, setVisitNoteDepartment] = useState<string>("visit")
  const [queuedNotes, setQueuedNotes] = useState<Array<{ id: string; text: string; departmentId?: string }>>([])
  const [showNotesSection, setShowNotesSection] = useState(false)
  const [editPatientModal, setEditPatientModal] = useState(false)
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<Patient | null>(null)
  const [showAddInsuranceModal, setShowAddInsuranceModal] = useState(false)
  const [addInsurancePatientId, setAddInsurancePatientId] = useState<string | null>(null)
  const [hoveredPatientId, setHoveredPatientId] = useState<string | null>(null)

  // Only fetch patients when search is triggered
  const { patients, loading: patientsLoading, refetch: refetchPatients, totalElements } = usePatients(
    shouldSearch ? patientFilter : undefined,
    0,
    20
  )

  const { patient: insuranceTargetPatient, refetch: refetchInsuranceTargetPatient } = usePatient(
    showAddInsuranceModal ? addInsurancePatientId : null,
  )

  const handleInsuranceSaved = async () => {
    await refetchPatients()
    await refetchInsuranceTargetPatient()
    if (selectedPatientId) await refetchSelectedPatientDetails()
    if (preSelectedPatientId) await refetchPreSelectedPatient()
  }

  const canContinueFromSelection = Boolean(selectedPatientId && (!preSelectedPatientId || selectedPatient))
  const triageSelected = selectedServiceId === TRIAGE_SERVICE_ID
  const hasSelectedDepartment = Boolean(selectedServiceId && !triageSelected)
  const canCreateVisit = triageSelected || hasSelectedDepartment

  // Search handler with debouncing
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setShouldSearch(false)
      setPatientFilter({})
      return
    }

    const filter: PatientFilterInput = {};
    switch(searchFilterType){
        case "name":
            filter.name = searchQuery.trim();
            break;
        case "phoneNumber":
            filter.phoneNumber = searchQuery.trim();
            break;
        case "insuranceName":
            filter.insuranceName = searchQuery.trim();
            break;
    }
    setPatientFilter(filter);
    setShouldSearch(true);
  }, [searchQuery, searchFilterType])

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setShouldSearch(false)
      setPatientFilter({})
      return
    }

    const timeoutId = setTimeout(() => {
      const filter: PatientFilterInput = {};
      switch(searchFilterType){
        case "name":
          filter.name = searchQuery.trim();
          break;
        case "phoneNumber":
          filter.phoneNumber = searchQuery.trim();
          break;
        case "insuranceName":
          filter.insuranceName = searchQuery.trim();
          break;
      }
      setPatientFilter(filter);
      setShouldSearch(true);
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchFilterType])

  const displayedPatients = preSelectedPatientData && !patients.some((p: Patient) => p.id === preSelectedPatientData.id)
    ? [preSelectedPatientData, ...patients]
    : patients

  useEffect(() => {
    if (preSelectedPatientData) {
      setSelectedPatient((current: Patient | null) => (current?.id === preSelectedPatientData.id ? current : preSelectedPatientData))
      setSelectedPatientId((current: string | null) => (current === preSelectedPatientData.id ? current : preSelectedPatientData.id))
      setCurrentStep((current: ModalStep) => (current === "visit-details" ? current : "visit-details"))
    }
  }, [preSelectedPatientData])

  useEffect(() => {
    if (selectedPatientDetails && !preSelectedPatientId) {
      setSelectedPatient((current: Patient | null) => (current?.id === selectedPatientDetails.id ? current : selectedPatientDetails))
    }
  }, [selectedPatientDetails, preSelectedPatientId])

  useEffect(() => {
    const patient = preSelectedPatientData || selectedPatientDetails

    if (patient && patient.patientInsurances) {
      if (patient.patientInsurances.length === 1) {
        setSelectedInsuranceIds([String(patient.patientInsurances[0].id)])
      } else {
        setSelectedInsuranceIds([])
      }
    }
  }, [preSelectedPatientData, selectedPatientDetails])

  useEffect(() => {
    if (preSelectedPatientId) {
      setSelectedPatientId((current: string | null) => (current === preSelectedPatientId ? current : preSelectedPatientId))
      // Skip patient-selection step entirely if preselected
      if (preSelectedPatientData) {
        setSelectedPatient((current: Patient | null) => (current?.id === preSelectedPatientData.id ? current : preSelectedPatientData))
        setCurrentStep((current: ModalStep) => (current === "visit-details" ? current : "visit-details"))
      }
    } else {
      setSelectedPatientId((current) => (current === null ? current : null))
      setCurrentStep((current) => (current === "patient-selection" ? current : "patient-selection"))
    }
  }, [preSelectedPatientId, preSelectedPatientData])

  useEffect(() => {
    if (!isOpen) {
      // Reset modal state when closed
      setCurrentStep("patient-selection")
      setSelectedPatientId(preSelectedPatientId || null)
      setSelectedPatient(null)
      setSearchQuery("")
      setSearchFilterType("name")
      setPatientFilter({})
      setShouldSearch(false)
      setSelectedServiceId(TRIAGE_SERVICE_ID)
      setSelectedInsuranceIds([])
      setVisitNoteText("")
      setVisitNoteDepartment("visit")
      setQueuedNotes([])
    }
  }, [isOpen])

  const canCreateNewVisit = useCallback((patient: any) => {
    if (!patient.lastVisit) return true
    
    // Cannot create new visit if last visit is CREATED or IN_PROGRESS
    const blockedStatuses = ['CREATED', 'IN_PROGRESS']
    return !blockedStatuses.includes(patient.lastVisit.status)
  }, [])

  const handlePatientSelect = useCallback((patient: any) => {
    if (!canCreateNewVisit(patient)) {
      toast.error(`Cannot create new visit. Patient has an active visit (${patient.lastVisit.status.replace('_', ' ')}).`)
      return
    }
    
    setSelectedPatientId(patient.id)
    setSelectedPatient(patient)
    setCurrentStep("visit-details")
  }, [canCreateNewVisit])

  const handleProceedToDetails = () => {
    if (!selectedPatientId || (preSelectedPatientId && !selectedPatient)) return
    const patientFromList = displayedPatients.find((p: Patient) => p.id === selectedPatientId)
    const patient = patientFromList || selectedPatient
    
    if (!canCreateNewVisit(patient)) {
      toast.error(`Cannot create new visit. Patient has an active visit (${patient.lastVisit.status.replace('_', ' ')}).`)
      return
    }
    
    setSelectedPatient(patient)
    setCurrentStep("visit-details")
  }

  const handleCreateVisit = async () => {
    if (!selectedPatientId) return

    if (!canCreateVisit) {
      toast.error('Select Triage or a department before creating the visit.')
      return
    }

    try {
      const visitLevelNotes = queuedNotes.map((note) => {
        if (!note.departmentId) {
          return { type: 'GENERAL', text: note.text }
        }

        const departmentName = departments.find((dept) => String(dept.id) === String(note.departmentId))?.name
        const label = departmentName ? `[${departmentName}] ` : ''
        return { type: 'GENERAL', text: `${label}${note.text}` }
      })

      const visitInput: any = {
        patientId: selectedPatientId,
        visitNotes: visitLevelNotes,
      }

      if (hasSelectedDepartment) {
        visitInput.departmentIds = [selectedServiceId]
      }

      // Add insurance IDs if selected
      if (selectedInsuranceIds.length > 0) {
        visitInput.insuranceIds = selectedInsuranceIds
      }

      const result = await createVisit(visitInput)

      if (result.status === 'SUCCESS') {
        toast.success(result.message || "Visit created successfully!")
        if (onVisitCreated) {
          onVisitCreated()
        }
        handleClose()
      } else {
        const message = result.message || result.messages?.[0]?.text || 'Visit creation failed'
        toast.error(message)
      }
    } catch (error) {
      toast.error('Network error occurred while creating visit')
    }
  }

  const handleClose = () => {
    setCurrentStep("patient-selection")
    setSelectedPatientId(null)
    setSelectedPatient(null)
    setSearchQuery("")
    setSearchFilterType("name")
    setPatientFilter({})
    setShouldSearch(false)
    setSelectedServiceId(TRIAGE_SERVICE_ID)
    setSelectedInsuranceIds([])
    setVisitNoteText("")
    setVisitNoteDepartment("visit")
    setQueuedNotes([])
    onClose()
  }

  const handleBackToPatientSelection = () => {
    if (preSelectedPatientId) {
      // If we have a preselected patient, close modal instead of going back
      handleClose()
    } else {
      setCurrentStep("patient-selection")
      setSelectedServiceId(TRIAGE_SERVICE_ID)
      setSelectedInsuranceIds([])
      setVisitNoteText("")
      setVisitNoteDepartment("visit")
      setQueuedNotes([])
    }
  }

  const selectedDepartmentLabel = triageSelected
    ? 'Triage'
    : hasSelectedDepartment
      ? departments.find((dept) => String(dept.id) === String(selectedServiceId))?.name || 'Selected department'
      : ''

  const handleQueueNote = () => {
    const text = visitNoteText.trim()
    if (!text) return

    const note = {
      id: `note-${Date.now()}`,
      text,
      departmentId: visitNoteDepartment !== 'visit' ? visitNoteDepartment : undefined,
    }

    setQueuedNotes((prev) => [...prev, note])
    setVisitNoteText("")
  }

  const handleRemoveQueuedNote = (id: string) => {
    setQueuedNotes((prev) => prev.filter((note) => note.id !== id))
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose()
      }
    }}>
        <DialogContent
          showCloseButton={false}
          onPointerDownOutside={(e) => {
            if (currentStep === "visit-details") {
              e.preventDefault()
            }
          }}
          onEscapeKeyDown={(e) => {
            if (currentStep === "visit-details") {
              e.preventDefault()
            }
          }}
          className="sm:max-w-[500px] overflow-hidden rounded-2xl border border-border/50 bg-background shadow-lg p-3"
        >
          {currentStep === "visit-details" && (
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-1.5 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-200 z-50"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
        <DialogHeader className="text-center space-y-1 pb-2">
          <DialogTitle className="text-center text-base font-semibold">
                {currentStep === "patient-selection"
              ? preSelectedPatientId ? "Create Visit for New Patient" : "Create Visit - Select Patient"
              : "Create Visit - Visit Details"}
          </DialogTitle>
          {currentStep === "visit-details" && (
            <p className="text-xs text-muted-foreground px-2">
                Choose a service to attach to the visit now.
            </p>
          )}
        </DialogHeader>

        <div className="max-h-[calc(90vh-160px)] overflow-y-auto px-2 pb-2 pt-1">
          {currentStep === "patient-selection" && (
          <div className="space-y-3">
            {/* Search Box */}
            <div className="relative rounded-lg border border-border/50 bg-card shadow-sm">
              {/* Filter Pills */}
              <div className="px-3 pt-2 pb-1">
                <div className="flex gap-2 items-center justify-center flex-wrap">
                  <button
                    type="button"
                    onClick={() => setSearchFilterType("name")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      searchFilterType === "name"
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Name
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchFilterType("phoneNumber")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      searchFilterType === "phoneNumber"
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Phone
                  </button>
                                    <button
                    type="button"
                    onClick={() => setSearchFilterType("insuranceName")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      searchFilterType === "insuranceName"
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Insurance
                  </button>
                </div>
              </div>

              {/* Search Input */}
              <div className="relative px-3 py-2">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={`Search patients by ${searchFilterType === "name" ? "name" : searchFilterType === "phoneNumber" ? "phone number" : "insurance"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-8 h-10 text-sm bg-transparent border-0 focus-visible:ring-0"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Results Container - Separate card */}
            {(patientsLoading || (shouldSearch && !patientsLoading)) && (
              <div className="min-h-[100px] rounded-2xl bg-white/18 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_36px_rgba(15,23,42,0.08)] ring-1 ring-white/10 backdrop-blur-2xl dark:bg-black/15 dark:ring-white/5">
                {/* Animated typing indicator when searching */}
                {patientsLoading && (
                  <div className="flex items-center justify-center gap-0.5 text-sm text-muted-foreground">
                    <span className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "450ms" }}></span>
                    </span>
                  </div>
                )}

                {/* Patient Results */}
                {displayedPatients.length > 0 && (
                  <div className="space-y-2">
                    {displayedPatients.map((patient: Patient) => (
                      <div
                        key={patient.id}
                        className={`group relative p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          selectedPatientId === patient.id
                            ? "border-primary bg-primary/5"
                            : "border-border/50 hover:border-border"
                        } ${!canCreateNewVisit(patient) ? "opacity-60 cursor-not-allowed" : ""}`}
                        onClick={() => handlePatientSelect(patient)}
                        onMouseEnter={() => setHoveredPatientId(patient.id)}
                        onMouseLeave={() => setHoveredPatientId(null)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {patient.firstName} {patient.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {patient.primaryPhoneNumber && `Phone: ${patient.primaryPhoneNumber}`}
                              {patient.nationalIdNumber && ` · ID: ${patient.nationalIdNumber}`}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                              {patient.patientInsurances && patient.patientInsurances.length > 0 && (
                                <span className="ml-2">
                                  · {patient.patientInsurances.length} insurance{patient.patientInsurances.length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            {hoveredPatientId === patient.id && (
                              <div className="mt-2 space-y-2 text-[13px]">
                                {patient.patientInsurances && patient.patientInsurances.length > 0 && (
                                  <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-lg p-2 border border-primary/20">
                                    <div className="text-xs font-medium text-foreground mb-1">Insurance Providers:</div>
                                    <div className="space-y-1">
                                      {patient.patientInsurances.map((ins: any, idx: number) => (
                                        <div key={idx} className="text-xs text-foreground flex items-start gap-1">
                                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1 flex-shrink-0"></span>
                                          <div>
                                            <div className="font-medium">{ins.insuranceProvider.insuranceName} ({ins.insuranceProvider.acronym})</div>
                                            {ins.insuranceCardNumber && (
                                              <div className="text-muted-foreground text-[11px]">Card: {ins.insuranceCardNumber}</div>
                                            )}
                                            {ins.principalMemberName && (
                                              <div className="text-muted-foreground text-[11px]">Member: {ins.principalMemberName}</div>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="text-xs text-muted-foreground">
                                  {patient.lastVisit && (patient.lastVisit.status === 'CREATED' || patient.lastVisit.status === 'IN_PROGRESS') ? (
                                    <span className="text-orange-600 dark:text-orange-400 font-medium">
                                      Patient has an open visit
                                    </span>
                                  ) : patient.lastVisit ? (
                                    <span>Last visit: {new Date(patient.lastVisit.visitDate).toLocaleDateString()}</span>
                                  ) : (
                                    <span>No visit recorded</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setAddInsurancePatientId(patient.id)
                              setShowAddInsuranceModal(true)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Add insurance"
                          >
                            <ShieldPlus className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedPatientForEdit(patient)
                              setEditPatientModal(true)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Edit patient"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          )}

        {currentStep === "visit-details" && selectedPatient && (
          <div className="space-y-4 bg-[#F2EAE5] dark:bg-[#2a2520] p-4 rounded-2xl">
            {/* Selected Patient Info */}
            <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Selected Patient</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setAddInsurancePatientId(selectedPatient.id)
                      setShowAddInsuranceModal(true)
                    }}
                  >
                    <ShieldPlus className="w-3.5 h-3.5 mr-1" />
                    Add insurance
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setSelectedPatientForEdit(selectedPatient)
                      setEditPatientModal(true)
                    }}
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
              <div className="text-sm">
                <div className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</div>
                <div className="text-muted-foreground">
                  DOB: {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                  {selectedPatient.primaryPhoneNumber && ` • Phone: ${selectedPatient.primaryPhoneNumber}`}
                </div>
              </div>
            </div>

            {/* Insurance Selection - Multiple */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <label className="block text-sm font-medium text-foreground">
                  Insurance for Visit (Select one or more)
                </label>
                {(!selectedPatient.patientInsurances || selectedPatient.patientInsurances.length === 0) && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => {
                      setAddInsurancePatientId(selectedPatient.id)
                      setShowAddInsuranceModal(true)
                    }}
                  >
                    Add insurance to patient
                  </Button>
                )}
              </div>
            {selectedPatient.patientInsurances && selectedPatient.patientInsurances.length > 0 && (
              <div>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                  {selectedPatient.patientInsurances.map((insurance: any) => (
                    <label key={insurance.id} className="flex items-center space-x-2 cursor-pointer hover:bg-muted/30 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedInsuranceIds.includes(insurance.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInsuranceIds(prev => [...prev, insurance.id])
                          } else {
                            setSelectedInsuranceIds(prev => prev.filter(id => id !== insurance.id))
                          }
                        }}
                        className="rounded"
                      />
                      <div className="text-sm">
                        <div className="font-medium">
                          {insurance.insuranceProvider.insuranceName} ({insurance.insuranceProvider.acronym})
                        </div>
                        {insurance.insuranceCardNumber && (
                          <div className="text-xs text-muted-foreground">Card: {insurance.insuranceCardNumber}</div>
                        )}
                        {insurance.principalMemberName && (
                          <div className="text-xs text-muted-foreground">Member: {insurance.principalMemberName}</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                {selectedInsuranceIds.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No insurance selected - visit will be marked as private
                  </p>
                )}
                {selectedInsuranceIds.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedInsuranceIds.length} insurance{selectedInsuranceIds.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}
            {(!selectedPatient.patientInsurances || selectedPatient.patientInsurances.length === 0) && (
              <div className="rounded-lg border border-dashed border-border/70 px-3 py-4 text-center">
                <p className="text-xs text-muted-foreground">No insurances on this patient yet.</p>
              </div>
            )}
            </div>

            {/* Department Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Service
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Choose Triage or one or more departments for this visit.
              </p>
              <DepartmentAutocomplete
                departments={[{ id: TRIAGE_SERVICE_ID, name: 'Triage' }, ...departments]}
                selectedDepartmentId={selectedServiceId}
                onDepartmentSelect={setSelectedServiceId}
                placeholder={departmentsLoading ? 'Loading services...' : 'Choose service'}
                disabled={departmentsLoading}
              />
              {selectedDepartmentLabel && (
                <p className="text-xs text-muted-foreground mt-2">Selected service: {selectedDepartmentLabel}</p>
              )}
            </div>

            {/* Notes Section Toggle */}
            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNotesSection(!showNotesSection)}
                className="w-full justify-center gap-2 text-sm"
              >
                {showNotesSection ? (
                  <>
                    <X className="w-4 h-4" />
                    Hide Notes
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    Add Notes {queuedNotes.length > 0 && `(${queuedNotes.length})`}
                  </>
                )}
              </Button>

              {showNotesSection && (
                <div className="mt-2 space-y-2 border rounded-lg p-2 bg-white/40 dark:bg-black/20">
                  <label className="block text-sm font-medium text-foreground mb-2">Reception Notes (General)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_170px_auto] gap-2 items-center">
                    <Input
                      value={visitNoteText}
                      onChange={(e) => setVisitNoteText(e.target.value)}
                      placeholder="Write a general note..."
                    />
                    <Select value={visitNoteDepartment} onValueChange={setVisitNoteDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Applies to" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visit">Visit (General)</SelectItem>
                        {hasSelectedDepartment
                          ? departments
                              .filter((dept) => String(dept.id) === String(selectedServiceId))
                              .map((dept) => (
                                <SelectItem key={`dept-note-${dept.id}`} value={String(dept.id)}>
                                  Department: {dept.name}
                                </SelectItem>
                              ))
                          : null}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" onClick={handleQueueNote}>
                      Add Note
                    </Button>
                  </div>

                  {queuedNotes.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto pt-1">
                      {queuedNotes.map((note) => {
                        const departmentName = note.departmentId
                          ? departments.find((dept) => String(dept.id) === String(note.departmentId))?.name
                          : undefined

                        return (
                          <div key={note.id} className="rounded-md border border-border/70 bg-background/80 px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                                {departmentName ? `Department: ${departmentName}` : 'Visit'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveQueuedNote(note.id)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                Remove
                              </button>
                            </div>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{note.text}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        </div>

        <DialogFooter className="mt-2 flex justify-center items-center gap-3 px-0 pb-1 pt-2">
          {currentStep === "visit-details" && (
            <div className="flex justify-center items-center gap-3 w-full">
              <Button variant="outline" onClick={handleBackToPatientSelection} className="rounded-full px-6 border-white/20 bg-white/10 text-red-600 hover:bg-white/20 dark:border-white/10 dark:bg-white/5">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {preSelectedPatientId ? "Cancel" : "Back to Patient Selection"}
              </Button>
              <Button
                onClick={handleCreateVisit}
                disabled={visitLoading || !canCreateVisit}
                className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-lg"
              >
                {visitLoading ? "Creating..." : "Create Visit"}
              </Button>
            </div>
          )}
        </DialogFooter>
        </DialogContent>
      </Dialog>

      {insuranceTargetPatient && (
        <AddPatientInsuranceModal
          open={showAddInsuranceModal}
          onOpenChange={(open) => {
            setShowAddInsuranceModal(open)
            if (!open) setAddInsurancePatientId(null)
          }}
          patientId={insuranceTargetPatient.id}
          patientDateOfBirth={insuranceTargetPatient.dateOfBirth}
          patientInsurances={insuranceTargetPatient.patientInsurances || []}
          onSuccess={handleInsuranceSaved}
          context="reception"
        />
      )}

      <PatientEditModal
        isOpen={editPatientModal}
        onClose={() => {
          setEditPatientModal(false)
          setSelectedPatientForEdit(null)
        }}
        patient={selectedPatientForEdit}
        onPatientUpdated={(updatedPatient) => {
          toast.success(`Patient updated: ${updatedPatient.firstName} ${updatedPatient.lastName}`)
          setEditPatientModal(false)
          setSelectedPatientForEdit(null)
          // Update selection to edited patient
          setSelectedPatientId(updatedPatient.id.toString())
          setSelectedPatient(updatedPatient)
          setCurrentStep("visit-details")
        }}
      />
    </>
  )
}
