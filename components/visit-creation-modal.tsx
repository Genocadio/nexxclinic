"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { usePatients, useDepartments, useCreateVisit, usePatient, useAddDepartmentNote, type Patient, type PatientFilterInput } from "@/hooks/auth-hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, User, ArrowLeft, Edit, X } from "lucide-react"
import { toast } from "react-toastify"
import PatientEditModal from "@/components/patient-edit-modal"

interface VisitCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onVisitCreated?: () => void
  preSelectedPatientId?: string
}

type ModalStep = "patient-selection" | "visit-details"
type SearchFilterType = "name" | "phoneNumber" | "nationalId" | "insuranceName"

export default function VisitCreationModal({ isOpen, onClose, onVisitCreated, preSelectedPatientId }: VisitCreationModalProps) {
  const { patient: preSelectedPatientData, loading: _patientLoading } = usePatient(preSelectedPatientId || null)
  const { departments, loading: departmentsLoading } = useDepartments()
  const { createVisit, loading: visitLoading } = useCreateVisit()
  const { addDepartmentNote } = useAddDepartmentNote()
  
  const [currentStep, setCurrentStep] = useState<ModalStep>("patient-selection")
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(preSelectedPatientId || null)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilterType, setSearchFilterType] = useState<SearchFilterType>("name")
  const [patientFilter, setPatientFilter] = useState<PatientFilterInput>({})
  const [shouldSearch, setShouldSearch] = useState(false)
  
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([])
  const [selectedInsuranceIds, setSelectedInsuranceIds] = useState<string[]>([])
  const [visitNoteText, setVisitNoteText] = useState("")
  const [visitNoteDepartment, setVisitNoteDepartment] = useState<string>("visit")
  const [queuedNotes, setQueuedNotes] = useState<Array<{ id: string; text: string; departmentId?: string }>>([])
  const [editPatientModal, setEditPatientModal] = useState(false)
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<Patient | null>(null)
  const [hoveredPatientId, setHoveredPatientId] = useState<string | null>(null)

  // Only fetch patients when search is triggered
  const { patients, loading: patientsLoading, refetch: refetchPatients, totalElements } = usePatients(
    shouldSearch ? patientFilter : undefined,
    0,
    20
  )

  const canContinueFromSelection = Boolean(selectedPatientId && (!preSelectedPatientId || selectedPatient))

  // Search handler with debouncing
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setShouldSearch(false)
      setPatientFilter({})
      return
    }

    const filter: PatientFilterInput = {}
    
    switch (searchFilterType) {
      case "name":
        filter.name = searchQuery.trim()
        break
      case "phoneNumber":
        filter.phoneNumber = searchQuery.trim()
        break
      case "nationalId":
        // National ID is searched via name field in many systems, but we'll use phoneNumber as proxy
        filter.name = searchQuery.trim()
        break
      case "insuranceName":
        filter.insuranceName = searchQuery.trim()
        break
    }

    setPatientFilter(filter)
    setShouldSearch(true)
  }, [searchQuery, searchFilterType])

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setShouldSearch(false)
      setPatientFilter({})
      return
    }

    const timeoutId = setTimeout(() => {
      handleSearch()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchFilterType, handleSearch])

  const displayedPatients = preSelectedPatientData && !patients.some((p: Patient) => p.id === preSelectedPatientData.id)
    ? [preSelectedPatientData, ...patients]
    : patients

  useEffect(() => {
    if (preSelectedPatientData) {
      setSelectedPatient(preSelectedPatientData)
    }
  }, [preSelectedPatientData])

  useEffect(() => {
    if (preSelectedPatientId) {
      setSelectedPatientId(preSelectedPatientId)
      // Skip patient-selection step entirely if preselected
      if (preSelectedPatientData) {
        setSelectedPatient(preSelectedPatientData)
        setCurrentStep("visit-details")
      }
    } else {
      setSelectedPatientId(null)
      setCurrentStep("patient-selection")
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
      setSelectedDepartments([])
      setSelectedInsuranceIds([])
      setVisitNoteText("")
      setVisitNoteDepartment("visit")
      setQueuedNotes([])
    }
  }, [isOpen, preSelectedPatientId])

  const handlePatientSelect = (patient: any) => {
    setSelectedPatientId(patient.id)
    setSelectedPatient(patient)
    setCurrentStep("visit-details")
  }

  const handleProceedToDetails = () => {
    if (!selectedPatientId || (preSelectedPatientId && !selectedPatient)) return
    const patientFromList = displayedPatients.find((p: Patient) => p.id === selectedPatientId)
    setSelectedPatient(patientFromList || selectedPatient)
    setCurrentStep("visit-details")
  }

  const handleCreateVisit = async () => {
    if (!selectedPatientId || selectedDepartments.length === 0) return

    try {
      const visitLevelNotes = queuedNotes
        .filter((note) => !note.departmentId)
        .map((note) => ({ type: 'GENERAL', text: note.text }))

      const visitInput: any = {
        patientId: selectedPatientId,
        departmentIds: selectedDepartments,
        visitNotes: visitLevelNotes,
      }

      // Add insurance IDs if selected
      if (selectedInsuranceIds.length > 0) {
        visitInput.insuranceIds = selectedInsuranceIds
      }

      const result = await createVisit(visitInput)

      if (result.status === 'SUCCESS') {
        const createdVisitId = result.data?.id
        const departmentDedicatedNotes = queuedNotes.filter((note) => note.departmentId)

        if (createdVisitId && departmentDedicatedNotes.length > 0) {
          for (const note of departmentDedicatedNotes) {
            const saveRes = await addDepartmentNote(String(createdVisitId), String(note.departmentId), 'GENERAL', note.text)
            if (saveRes?.status !== 'SUCCESS') {
              toast.warning('Visit created but a department-dedicated note could not be saved')
            }
          }
        }

        toast.success("Visit created successfully!")
        if (onVisitCreated) {
          onVisitCreated()
        }
        handleClose()
      } else {
        const message = result.messages?.[0]?.text || 'Visit creation failed'
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
    setSelectedDepartments([])
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
      setSelectedDepartments([])
      setSelectedInsuranceIds([])
      setVisitNoteText("")
      setVisitNoteDepartment("visit")
      setQueuedNotes([])
    }
  }

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
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent showCloseButton={false} className="sm:max-w-[600px] backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-3xl border border-white/20 shadow-2xl">
        <DialogHeader className="text-center space-y-2 sticky top-0 bg-white/10 dark:bg-black/20 z-40 -mx-6 px-6 pb-4">
          <DialogTitle className="text-center">
            {currentStep === "patient-selection"
              ? preSelectedPatientId ? "Create Visit for New Patient" : "Create Visit - Select Patient"
              : "Create Visit - Visit Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(90vh-220px)] overflow-y-auto pr-2 pb-2">
          {currentStep === "patient-selection" && (
          <div className="space-y-4">
            {/* macOS Spotlight-style Search Box */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-border shadow-md overflow-hidden">
              {/* Filter Pills - Always visible on hover */}
              <div className="px-4 pt-3 pb-2 border-b border-border/30 transition-opacity opacity-60 hover:opacity-100">
                <div className="flex gap-2 items-center justify-center flex-wrap">
                  <button
                    type="button"
                    onClick={() => setSearchFilterType("name")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
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
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      searchFilterType === "phoneNumber"
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Phone
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchFilterType("nationalId")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      searchFilterType === "nationalId"
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    National ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchFilterType("insuranceName")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
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
              <div className="relative px-4 py-3">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={`Search patients by ${searchFilterType === "name" ? "name" : searchFilterType === "phoneNumber" ? "phone number" : searchFilterType === "nationalId" ? "national ID" : "insurance"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-10 h-12 text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Results Container - Separate card */}
            {(patientsLoading || (shouldSearch && !patientsLoading)) && (
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-border shadow-sm p-4 min-h-[100px]">
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

                {/* Patient List - Only show when there are results or no matches */}
                {shouldSearch && !patientsLoading && (
                  displayedPatients.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground">
                      No matches found
                    </div>
                  ) : (
                    <div className="space-y-2">
                  {displayedPatients.map((patient: Patient) => (
                    <div
                      key={patient.id}
                      onClick={() => handlePatientSelect(patient)}
                      onMouseEnter={() => setHoveredPatientId(patient.id)}
                      onMouseLeave={() => setHoveredPatientId(null)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedPatientId === patient.id
                          ? "bg-primary/10 border-primary shadow-md scale-[1.01]"
                          : hoveredPatientId === patient.id
                            ? "bg-primary/5 border-primary/60 shadow-md scale-[1.01]"
                            : "bg-background border-border/40 hover:border-primary/50 hover:shadow-sm"
                      }`}
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
                            {patient.contactInfo?.phone && `Phone: ${patient.contactInfo.phone}`}
                            {patient.nationalId && ` • ID: ${patient.nationalId}`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                            {patient.insurances && patient.insurances.length > 0 && (
                              <span className="ml-2">
                                • {patient.insurances.length} insurance{patient.insurances.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          {hoveredPatientId === patient.id && (
                            <div className="mt-2 space-y-1 text-[13px] text-foreground">
                              <div className="text-xs text-muted-foreground">
                                Insurances: {patient.insurances && patient.insurances.length > 0
                                  ? patient.insurances.map((ins: any) => `${ins.insurance.acronym}${ins.insuranceCardNumber ? ` - ${ins.insuranceCardNumber}` : ""}`).join(", ")
                                  : "None"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Last visit: {patient.latestVisit?.visitDate
                                  ? new Date(patient.latestVisit.visitDate).toLocaleString()
                                  : "No visit recorded"}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPatientForEdit(patient)
                            setEditPatientModal(true)
                          }}
                          title="Edit patient"
                          className="rounded-full opacity-60 hover:opacity-100"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
              </div>
            )}
          </div>
          )}

        {currentStep === "visit-details" && selectedPatient && (
          <div className="space-y-4 bg-[#F6EEE9] dark:bg-[#2a2520] p-4 rounded-2xl">
            {/* Selected Patient Info */}
            <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                <span className="font-medium">Selected Patient</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</div>
                <div className="text-muted-foreground">
                  DOB: {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                  {selectedPatient.contactInfo?.phone && ` • Phone: ${selectedPatient.contactInfo.phone}`}
                </div>
              </div>
            </div>

            {/* Insurance Selection - Multiple */}
            {selectedPatient.insurances && selectedPatient.insurances.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Insurance for Visit (Select one or more)
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                  {selectedPatient.insurances.map((insurance: any) => (
                    <label key={insurance.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedInsuranceIds.includes(insurance.insurance.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInsuranceIds(prev => [...prev, insurance.insurance.id])
                          } else {
                            setSelectedInsuranceIds(prev => prev.filter(id => id !== insurance.insurance.id))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">
                        {insurance.insurance.acronym}
                        {insurance.insuranceCardNumber && ` - ${insurance.insuranceCardNumber}`}
                      </span>
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

            {/* Department Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Departments
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                {departmentsLoading ? (
                  <div className="text-sm text-muted-foreground">Loading departments...</div>
                ) : departments.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No departments available</div>
                ) : (
                  departments.map((dept) => (
                    <label key={dept.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(dept.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDepartments(prev => [...prev, dept.id])
                          } else {
                            setSelectedDepartments(prev => prev.filter(id => id !== dept.id))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{dept.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Reception Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Reception Notes (General)</label>
              <div className="space-y-2 border rounded-lg p-3 bg-white/40 dark:bg-black/20">
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
                      {departments
                        .filter((dept) => selectedDepartments.includes(dept.id))
                        .map((dept) => (
                          <SelectItem key={`dept-note-${dept.id}`} value={String(dept.id)}>
                            Department: {dept.name}
                          </SelectItem>
                        ))}
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
            </div>
          </div>
        )}
        </div>

        <DialogFooter className="sticky md:sticky bottom-0 left-0 right-0 justify-center bg-gradient-to-t from-white/20 dark:from-black/30 to-white/10 dark:to-black/20 border-t border-white/20 -mx-6 px-6 pb-4 pt-4 z-50">
          {currentStep === "visit-details" && (
            <>
              <Button variant="outline" onClick={handleBackToPatientSelection} className="rounded-full px-6 border-red-500 text-red-600 hover:bg-red-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {preSelectedPatientId ? "Cancel" : "Back to Patient Selection"}
              </Button>
              <Button
                onClick={handleCreateVisit}
                disabled={visitLoading || selectedDepartments.length === 0}
                className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-lg"
              >
                {visitLoading ? "Creating..." : "Create Visit"}
              </Button>
            </>
          )}
        </DialogFooter>
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