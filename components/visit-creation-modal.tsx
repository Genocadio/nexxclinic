"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  usePatients,
  useDepartments,
  useCreateVisit,
  usePatient,
} from "@/hooks/auth-hooks";
import type { Patient } from "@/lib/api-types";
import type { PatientFilterInput } from "@/hooks/patients/hooks";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, User, ArrowLeft, Edit, X, ShieldPlus } from "lucide-react";
import { getMediaUrl } from "@/lib/media-url";
import { toast } from "react-toastify";
import PatientEditModal from "@/components/patient-edit-modal";
import { AddPatientInsuranceModal } from "@/components/patient/add-patient-insurance-modal";
import { DepartmentAutocomplete } from "@/components/ui/department-autocomplete";

const TRIAGE_SERVICE_ID = "__TRIAGE__";

interface VisitCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisitCreated?: () => void;
  preSelectedPatientId?: string;
}

type ModalStep = "patient-selection" | "visit-details";
type SearchFilterType = "name" | "phoneNumber" | "insuranceName";

export default function VisitCreationModal({
  isOpen,
  onClose,
  onVisitCreated,
  preSelectedPatientId,
}: VisitCreationModalProps) {
  const [currentStep, setCurrentStep] =
    useState<ModalStep>("patient-selection");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    preSelectedPatientId || null,
  );
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const {
    patient: preSelectedPatientData,
    loading: _patientLoading,
    refetch: refetchPreSelectedPatient,
  } = usePatient(preSelectedPatientId || null);
  const {
    patient: selectedPatientDetails,
    refetch: refetchSelectedPatientDetails,
  } = usePatient(
    selectedPatientId && !preSelectedPatientId ? selectedPatientId : null,
  );
  const { departments, loading: departmentsLoading } = useDepartments();
  const { createVisit, loading: visitLoading } = useCreateVisit();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilterType, setSearchFilterType] =
    useState<SearchFilterType>("name");
  const [patientFilter, setPatientFilter] = useState<PatientFilterInput>({});
  const [shouldSearch, setShouldSearch] = useState(false);

  const [selectedServiceId, setSelectedServiceId] =
    useState<string>(TRIAGE_SERVICE_ID);
  const [selectedInsuranceIds, setSelectedInsuranceIds] = useState<string[]>(
    [],
  );

  const [editPatientModal, setEditPatientModal] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] =
    useState<Patient | null>(null);
  const [showAddInsuranceModal, setShowAddInsuranceModal] = useState(false);
  const [addInsurancePatientId, setAddInsurancePatientId] = useState<
    string | null
  >(null);
  const [hoveredPatientId, setHoveredPatientId] = useState<string | null>(null);

  // Only fetch patients when search is triggered
  const {
    patients,
    loading: patientsLoading,
    refetch: refetchPatients,
  } = usePatients(shouldSearch ? patientFilter : undefined, 0, 20);

  const {
    patient: insuranceTargetPatient,
    refetch: refetchInsuranceTargetPatient,
  } = usePatient(showAddInsuranceModal ? addInsurancePatientId : null);

  const handleInsuranceSaved = async () => {
    await refetchPatients();
    await refetchInsuranceTargetPatient();
    if (selectedPatientId) await refetchSelectedPatientDetails();
    if (preSelectedPatientId) await refetchPreSelectedPatient();
  };

  const triageSelected = selectedServiceId === TRIAGE_SERVICE_ID;
  const hasSelectedDepartment = Boolean(selectedServiceId && !triageSelected);
  const canCreateVisit = triageSelected || hasSelectedDepartment;

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setShouldSearch(false);
      setPatientFilter({});
      return;
    }

    const timeoutId = setTimeout(() => {
      const filter: PatientFilterInput = {};
      switch (searchFilterType) {
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
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchFilterType]);

  const displayedPatients =
    preSelectedPatientData &&
    !patients.some((p: Patient) => p.id === preSelectedPatientData.id)
      ? [preSelectedPatientData, ...patients]
      : patients;

  useEffect(() => {
    if (preSelectedPatientData) {
      setSelectedPatient((current: Patient | null) =>
        current?.id === preSelectedPatientData.id
          ? current
          : preSelectedPatientData,
      );
      setSelectedPatientId((current: string | null) =>
        current === preSelectedPatientData.id
          ? current
          : preSelectedPatientData.id,
      );
      setCurrentStep((current: ModalStep) =>
        current === "visit-details" ? current : "visit-details",
      );
    }
  }, [preSelectedPatientData]);

  useEffect(() => {
    if (selectedPatientDetails && !preSelectedPatientId) {
      setSelectedPatient((current: Patient | null) =>
        current?.id === selectedPatientDetails.id
          ? current
          : selectedPatientDetails,
      );
    }
  }, [selectedPatientDetails, preSelectedPatientId]);

  useEffect(() => {
    const patient = preSelectedPatientData || selectedPatientDetails;

    if (patient && patient.patientInsurances) {
      if (patient.patientInsurances.length === 1) {
        setSelectedInsuranceIds([String(patient.patientInsurances[0].id)]);
      } else {
        setSelectedInsuranceIds([]);
      }
    }
  }, [preSelectedPatientData, selectedPatientDetails]);

  useEffect(() => {
    if (preSelectedPatientId) {
      setSelectedPatientId((current: string | null) =>
        current === preSelectedPatientId ? current : preSelectedPatientId,
      );
      // Skip patient-selection step entirely if preselected
      if (preSelectedPatientData) {
        setSelectedPatient((current: Patient | null) =>
          current?.id === preSelectedPatientData.id
            ? current
            : preSelectedPatientData,
        );
        setCurrentStep((current: ModalStep) =>
          current === "visit-details" ? current : "visit-details",
        );
      }
    } else {
      setSelectedPatientId((current) => (current === null ? current : null));
      setCurrentStep((current) =>
        current === "patient-selection" ? current : "patient-selection",
      );
    }
  }, [preSelectedPatientId, preSelectedPatientData]);

  useEffect(() => {
    if (!isOpen) {
      // Reset modal state when closed
      setCurrentStep("patient-selection");
      setSelectedPatientId(preSelectedPatientId || null);
      setSelectedPatient(null);
      setSearchQuery("");
      setSearchFilterType("name");
      setPatientFilter({});
      setShouldSearch(false);
      setSelectedServiceId(TRIAGE_SERVICE_ID);
      setSelectedInsuranceIds([]);
    }
  }, [isOpen]);

  const canCreateNewVisit = useCallback((_patient: any) => {
    // Patient.lastVisit was removed from API schema.
    // Allow creation; backend should enforce any "already has open visit" rule.
    return true;
  }, []);

  const handlePatientSelect = useCallback(
    (patient: any) => {
      setSelectedPatientId(patient.id);
      setSelectedPatient(patient);
      setCurrentStep("visit-details");
    },
    [canCreateNewVisit],
  );

  const handleCreateVisit = async () => {
    if (!selectedPatientId) return;

    // The Create Visit button is disabled until a service is selected, so
    // this is a safety net (no toast — the UI already guides the user).
    if (!canCreateVisit) return;

    try {
      const visitInput: any = {
        patientId: selectedPatientId,
      };

      if (hasSelectedDepartment) {
        visitInput.departmentIds = [selectedServiceId];
      }

      // Add insurance IDs if selected
      if (selectedInsuranceIds.length > 0) {
        visitInput.insuranceIds = selectedInsuranceIds;
      }

      const result = await createVisit(visitInput);

      if (result.status === "SUCCESS") {
        toast.success(result.message || "Visit created successfully!");
        if (onVisitCreated) {
          onVisitCreated();
        }
        handleClose();
      } else {
        const message =
          result.message ||
          result.messages?.[0]?.text ||
          "Visit creation failed";
        toast.error(message);
      }
    } catch {
      toast.error("Network error occurred while creating visit");
    }
  };

  const handleClose = () => {
    setCurrentStep("patient-selection");
    setSelectedPatientId(null);
    setSelectedPatient(null);
    setSearchQuery("");
    setSearchFilterType("name");
    setPatientFilter({});
    setShouldSearch(false);
    setSelectedServiceId(TRIAGE_SERVICE_ID);
    setSelectedInsuranceIds([]);
    onClose();
  };

  const handleBackToPatientSelection = () => {
    if (preSelectedPatientId) {
      // If we have a preselected patient, close modal instead of going back
      handleClose();
    } else {
      setCurrentStep("patient-selection");
      setSelectedServiceId(TRIAGE_SERVICE_ID);
      setSelectedInsuranceIds([]);
    }
  };

  const selectedDepartmentLabel = triageSelected
    ? "Triage"
    : hasSelectedDepartment
      ? departments.find(
          (dept) => String(dept.id) === String(selectedServiceId),
        )?.name || "Selected department"
      : "";

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          onPointerDownOutside={(e) => {
            if (currentStep === "visit-details") {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (currentStep === "visit-details") {
              e.preventDefault();
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
                ? preSelectedPatientId
                  ? "Create Visit for New Patient"
                  : "Create Visit - Select Patient"
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
                          <span
                            className="w-2 h-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></span>
                          <span
                            className="w-2 h-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></span>
                          <span
                            className="w-2 h-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></span>
                          <span
                            className="w-2 h-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "450ms" }}
                          ></span>
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
                                  {patient.primaryPhoneNumber &&
                                    `Phone: ${patient.primaryPhoneNumber}`}
                                  {patient.nationalIdNumber &&
                                    ` · ID: ${patient.nationalIdNumber}`}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  DOB:{" "}
                                  {new Date(
                                    patient.dateOfBirth,
                                  ).toLocaleDateString()}
                                </div>
                                {patient.patientInsurances &&
                                  patient.patientInsurances.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {patient.patientInsurances.map(
                                      (ins: any, idx: number) => {
                                        const iconUrl = ins.insuranceProvider?.iconUrl;
                                        const acronym = ins.insuranceProvider?.acronym || '';
                                        const name = ins.insuranceProvider?.insuranceName || '';
                                        return (
                                          <span
                                            key={idx}
                                            className="relative group/ins inline-flex items-center justify-center h-5 min-w-[20px] rounded-full border border-primary/30 bg-primary/10 text-[10px] font-semibold text-primary px-1.5 cursor-default"
                                          >
                                            {iconUrl ? (
                                              <img
                                                src={getMediaUrl(iconUrl)}
                                                alt={name}
                                                className="h-3.5 w-3.5 rounded-full object-cover"
                                              />
                                            ) : (
                                              acronym
                                            )}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 invisible group-hover/ins:opacity-100 group-hover/ins:visible transition-all duration-150 z-50 pointer-events-none">
                                              <div className="bg-slate-900 dark:bg-slate-700 text-white text-[11px] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                                                <div className="font-semibold">{name}</div>
                                                {ins.insuranceCardNumber && (
                                                  <div className="text-slate-300">Card: {ins.insuranceCardNumber}</div>
                                                )}
                                                {ins.principalMemberName && (
                                                  <div className="text-slate-300">Member: {ins.principalMemberName}</div>
                                                )}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
                                              </div>
                                            </div>
                                          </span>
                                        );
                                      },
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAddInsurancePatientId(patient.id);
                                    setShowAddInsuranceModal(true);
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
                                    e.stopPropagation();
                                    setSelectedPatientForEdit(patient);
                                    setEditPatientModal(true);
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
                          setAddInsurancePatientId(selectedPatient.id);
                          setShowAddInsuranceModal(true);
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
                          setSelectedPatientForEdit(selectedPatient);
                          setEditPatientModal(true);
                        }}
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </div>
                    <div className="text-muted-foreground">
                      DOB:{" "}
                      {new Date(
                        selectedPatient.dateOfBirth,
                      ).toLocaleDateString()}
                      {selectedPatient.primaryPhoneNumber &&
                        ` • Phone: ${selectedPatient.primaryPhoneNumber}`}
                    </div>
                  </div>
                </div>

                {/* Insurance Selection - Multiple */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Insurance for Visit (Select one or more)
                    </label>
                    {(!selectedPatient.patientInsurances ||
                      selectedPatient.patientInsurances.length === 0) && (
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
                        onClick={() => {
                          setAddInsurancePatientId(selectedPatient.id);
                          setShowAddInsuranceModal(true);
                        }}
                      >
                        Add insurance to patient
                      </Button>
                    )}
                  </div>
                  {selectedPatient.patientInsurances &&
                    selectedPatient.patientInsurances.length > 0 && (
                      <div>
                        <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                          {selectedPatient.patientInsurances.map(
                            (insurance: any) => (
                              <label
                                key={insurance.id}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-muted/30 p-2 rounded transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedInsuranceIds.includes(
                                    insurance.id,
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedInsuranceIds((prev) => [
                                        ...prev,
                                        insurance.id,
                                      ]);
                                    } else {
                                      setSelectedInsuranceIds((prev) =>
                                        prev.filter(
                                          (id) => id !== insurance.id,
                                        ),
                                      );
                                    }
                                  }}
                                  className="rounded"
                                />
                                <div className="text-sm">
                                  <div className="font-medium">
                                    {insurance.insuranceProvider.insuranceName}{" "}
                                    ({insurance.insuranceProvider.acronym})
                                  </div>
                                  {insurance.insuranceCardNumber && (
                                    <div className="text-xs text-muted-foreground">
                                      Card: {insurance.insuranceCardNumber}
                                    </div>
                                  )}
                                  {insurance.principalMemberName && (
                                    <div className="text-xs text-muted-foreground">
                                      Member: {insurance.principalMemberName}
                                    </div>
                                  )}
                                </div>
                              </label>
                            ),
                          )}
                        </div>
                        {selectedInsuranceIds.length === 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            No insurance selected - visit will be marked as
                            private
                          </p>
                        )}
                        {selectedInsuranceIds.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {selectedInsuranceIds.length} insurance
                            {selectedInsuranceIds.length > 1 ? "s" : ""}{" "}
                            selected
                          </p>
                        )}
                      </div>
                    )}
                  {(!selectedPatient.patientInsurances ||
                    selectedPatient.patientInsurances.length === 0) && (
                    <div className="rounded-lg border border-dashed border-border/70 px-3 py-4 text-center">
                      <p className="text-xs text-muted-foreground">
                        No insurances on this patient yet.
                      </p>
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
                    departments={[
                      { id: TRIAGE_SERVICE_ID, name: "Triage" },
                      ...departments,
                    ]}
                    selectedDepartmentId={selectedServiceId}
                    onDepartmentSelect={setSelectedServiceId}
                    placeholder={
                      departmentsLoading
                        ? "Loading services..."
                        : "Choose service"
                    }
                    disabled={departmentsLoading}
                  />
                  {selectedDepartmentLabel && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Selected service: {selectedDepartmentLabel}
                    </p>
                  )}
                </div>

                {/* Notes Section Toggle */}
                <div className="pt-1"></div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-2 flex justify-center items-center gap-3 px-0 pb-1 pt-2">
            {currentStep === "visit-details" && (
              <div className="flex justify-center items-center gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={handleBackToPatientSelection}
                  className="rounded-full px-6 border-white/20 bg-white/10 text-red-600 hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {preSelectedPatientId
                    ? "Cancel"
                    : "Back to Patient Selection"}
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
            setShowAddInsuranceModal(open);
            if (!open) setAddInsurancePatientId(null);
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
          setEditPatientModal(false);
          setSelectedPatientForEdit(null);
        }}
        patient={selectedPatientForEdit}
        onPatientUpdated={(updatedPatient) => {
          toast.success(
            `Patient updated: ${updatedPatient.firstName} ${updatedPatient.lastName}`,
          );
          setEditPatientModal(false);
          setSelectedPatientForEdit(null);
          // Update selection to edited patient
          setSelectedPatientId(updatedPatient.id.toString());
          setSelectedPatient(updatedPatient);
          setCurrentStep("visit-details");
        }}
      />
    </>
  );
}
