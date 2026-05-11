"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { usePatients, useDepartments, useCreateVisit, usePatient, type Patient, type PatientFilterInput } from "@/hooks/auth-hooks"
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
type SearchFilterType = "name" | "phoneNumber" | "insuranceName"

export default function VisitCreationModal({ isOpen, onClose, onVisitCreated, preSelectedPatientId }: VisitCreationModalProps) {
  const [currentStep, setCurrentStep] = useState<ModalStep>("patient-selection")
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(preSelectedPatientId || null)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  const { patient: preSelectedPatientData, loading: _patientLoading } = usePatient(preSelectedPatientId || null)
  const { patient: selectedPatientDetails } = usePatient(selectedPatientId && !preSelectedPatientId ? selectedPatientId : null)
  const { departments, loading: departmentsLoading } = useDepartments()
  const { createVisit, loading: visitLoading } = useCreateVisit()
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilterType, setSearchFilterType] = useState<SearchFilterType>("name")
  const [patientFilter, setPatientFilter] = useState<PatientFilterInput>({})
  const [shouldSearch, setShouldSearch] = useState(false)
  
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedInsuranceIds, setSelectedInsuranceIds] = useState<string[]>([])
  const [visitNoteText, setVisitNoteText] = useState("")
  const [visitNoteDepartment, setVisitNoteDepartment] = useState<string>("visit")
  const [queuedNotes, setQueuedNotes] = useState<Array<{ id: string; text: string; departmentId?: string }>>([])
  const [showNotesSection, setShowNotesSection] = useState(false)
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
      setSelectedPatient((current) => (current?.id === preSelectedPatientData.id ? current : preSelectedPatientData))
      setSelectedPatientId((current) => (current === preSelectedPatientData.id ? current : preSelectedPatientData.id))
      setCurrentStep((current) => (current === "visit-details" ? current : "visit-details"))
    }
  }, [preSelectedPatientData])

  useEffect(() => {
    if (selectedPatientDetails && !preSelectedPatientId) {
      setSelectedPatient((current) => (current?.id === selectedPatientDetails.id ? current : selectedPatientDetails))
    }
  }, [selectedPatientDetails, preSelectedPatientId])

  useEffect(() => {
    if (preSelectedPatientId) {
      setSelectedPatientId((current) => (current === preSelectedPatientId ? current : preSelectedPatientId))
      // Skip patient-selection step entirely if preselected
      if (preSelectedPatientData) {
        setSelectedPatient((current) => (current?.id === preSelectedPatientData.id ? current : preSelectedPatientData))
        setCurrentStep((current) => (current === "visit-details" ? current : "visit-details"))
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
      setSelectedDepartments([])
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
    if (!selectedPatientId || selectedDepartments.length === 0) return

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
        departmentIds: selectedDepartments,
        visitNotes: visitLevelNotes,
      }

      // Add insurance IDs if selected
      if (selectedInsuranceIds.length > 0) {
        visitInput.insuranceIds = selectedInsuranceIds
      }

      const result = await createVisit(visitInput)

      if (result.status === 'SUCCESS') {
        toast.success("Visit created successfully!")
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
      <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose()
      }
    }}>
        <DialogContent showCloseButton={false} className="sm:max-w-[500px] overflow-hidden rounded-2xl border border-border/50 bg-background shadow-lg p-3">
        <DialogHeader className="text-center space-y-1 pb-2">
          <DialogTitle className="text-center text-base font-semibold">
            {currentStep === "patient-selection"
              ? preSelectedPatientId ? "Create Visit for New Patient" : "Create Visit - Select Patient"
              : "Create Visit - Visit Details"}
          </DialogTitle>
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
                        className={`relative p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
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
                              {patient.contactInfo?.phone && `Phone: ${patient.contactInfo.phone}`}
                              {patient.nationalId && ` · ID: ${patient.nationalId}`}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                              {patient.insurances && patient.insurances.length > 0 && (
                                <span className="ml-2">
                                  · {patient.insurances.length} insurance{patient.insurances.length > 1 ? 's' : ''}
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
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setHoveredPatientId(patient.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
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
                        checked={selectedDepartments.includes(String(dept.id))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDepartments(prev => [...prev, String(dept.id)])
                          } else {
                            setSelectedDepartments(prev => prev.filter(id => id !== String(dept.id)))
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
                disabled={visitLoading || selectedDepartments.length === 0}
                className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-lg"
              >
                {visitLoading ? "Creating..." : "Create Visit"}
              </Button>
            </div>
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