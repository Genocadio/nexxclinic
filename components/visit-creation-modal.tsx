"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  usePatients,
  useDepartments,
  useCreateVisit,
  usePatient,
  useInsurances,
} from "@/hooks/auth-hooks";
import { type Patient, getBasePatientSharePercentage } from "@/lib/api-types";
import type { PatientFilterInput } from "@/hooks/patients/hooks";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  User,
  ArrowLeft,
  Edit,
  X,
  ShieldPlus,
  ShieldAlert,
  Plus,
  Check,
  CreditCard,
  SlidersHorizontal,
  RotateCcw,
  Calendar,
  Shield,
} from "lucide-react";
import { getMediaUrl } from "@/lib/media-url";
import { isInsuranceActive, insuranceStatusLabel } from "@/lib/insurance-utils";
import { calculateAge } from "@/lib/validation-utils";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import PatientEditModal from "@/components/patient-edit-modal";
import { AddPatientInsuranceModal } from "@/components/patient/add-patient-insurance-modal";
import { DepartmentAutocomplete } from "@/components/ui/department-autocomplete";

const TRIAGE_SERVICE_ID = "__TRIAGE__";

function PatientCardSkeleton() {
  return (
    <div className="p-3.5 rounded-2xl border border-border/50 bg-white/60 dark:bg-slate-950/60 shadow-sm flex flex-col justify-between animate-pulse min-h-[160px]">
      <div className="flex items-start justify-between gap-2.5 mb-2.5">
        <div className="flex items-center gap-2.5 w-full">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
        </div>
      </div>
      <div className="space-y-2 my-2 bg-muted/20 p-2 rounded-xl border border-border/40">
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-4/5 rounded-md" />
      </div>
      <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-1/3 rounded-md" />
        <Skeleton className="h-4 w-12 rounded-md" />
      </div>
    </div>
  );
}

interface VisitCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisitCreated?: () => void;
  preSelectedPatientId?: string;
}

type ModalStep = "patient-selection" | "visit-details";
type SearchFilterType = "name" | "phoneNumber" | "insuranceCardNumber";
type GenderFilterType = "all" | "MALE" | "FEMALE" | "OTHER";
type AgeRangeType = "all" | "pediatric" | "adult" | "senior" | "custom" | "exact";

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
  const { insurances: availableInsurances, loading: insurancesLoading } = useInsurances();
  const { createVisit, loading: visitLoading } = useCreateVisit();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilterType, setSearchFilterType] =
    useState<SearchFilterType>("name");
  const [selectedInsuranceProviderId, setSelectedInsuranceProviderId] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<GenderFilterType>("all");
  const [ageRange, setAgeRange] = useState<AgeRangeType>("all");
  const [customAgeMin, setCustomAgeMin] = useState<string>("");
  const [customAgeMax, setCustomAgeMax] = useState<string>("");
  const [exactAge, setExactAge] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [patientFilter, setPatientFilter] = useState<PatientFilterInput>({});
  const [shouldSearch, setShouldSearch] = useState(false);

  const activeFilterCount = [
    Boolean(selectedInsuranceProviderId),
    Boolean(genderFilter && genderFilter !== "all"),
    Boolean(
      ageRange !== "all" &&
      (ageRange !== "custom" || customAgeMin || customAgeMax) &&
      (ageRange !== "exact" || exactAge)
    ),
  ].filter(Boolean).length;

  const handleResetFilters = useCallback(() => {
    setSelectedInsuranceProviderId("");
    setGenderFilter("all");
    setAgeRange("all");
    setCustomAgeMin("");
    setCustomAgeMax("");
    setExactAge("");
  }, []);

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
    const hasQuery = Boolean(searchQuery.trim());
    const hasFilter =
      Boolean(selectedInsuranceProviderId) ||
      (genderFilter && genderFilter !== "all") ||
      (ageRange !== "all" && (ageRange !== "custom" || customAgeMin || customAgeMax) && (ageRange !== "exact" || exactAge));

    if (!hasQuery && !hasFilter) {
      setShouldSearch(false);
      setPatientFilter({});
      return;
    }

    const timeoutId = setTimeout(() => {
      const filter: PatientFilterInput = {};
      if (hasQuery) {
        switch (searchFilterType) {
          case "name":
            filter.name = searchQuery.trim();
            break;
          case "phoneNumber":
            filter.phoneNumber = searchQuery.trim();
            break;
          case "insuranceCardNumber":
            filter.insuranceCardNumber = searchQuery.trim();
            break;
        }
      }

      if (selectedInsuranceProviderId) {
        filter.insuranceProviderId = selectedInsuranceProviderId;
      }

      if (genderFilter && genderFilter !== "all") {
        filter.gender = genderFilter;
      }

      if (ageRange === "pediatric") {
        filter.minAge = 0;
        filter.maxAge = 17;
      } else if (ageRange === "adult") {
        filter.minAge = 18;
        filter.maxAge = 64;
      } else if (ageRange === "senior") {
        filter.minAge = 65;
      } else if (ageRange === "exact" && exactAge.trim() && !isNaN(Number(exactAge))) {
        filter.age = Number(exactAge);
      } else if (ageRange === "custom") {
        if (customAgeMin.trim() && !isNaN(Number(customAgeMin))) {
          filter.minAge = Number(customAgeMin);
        }
        if (customAgeMax.trim() && !isNaN(Number(customAgeMax))) {
          filter.maxAge = Number(customAgeMax);
        }
      }

      setPatientFilter(filter);
      setShouldSearch(true);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    searchFilterType,
    selectedInsuranceProviderId,
    genderFilter,
    ageRange,
    customAgeMin,
    customAgeMax,
    exactAge,
  ]);

  const displayedPatients =
    preSelectedPatientData &&
    !patients.some((p: Patient) => p.id === preSelectedPatientData.id)
      ? [preSelectedPatientData, ...patients]
      : patients;

  useEffect(() => {
    if (preSelectedPatientData) {
      setSelectedPatient(preSelectedPatientData);
      setSelectedPatientId(preSelectedPatientData.id);
      setCurrentStep((current: ModalStep) =>
        current === "visit-details" ? current : "visit-details",
      );
    }
  }, [preSelectedPatientData]);

  useEffect(() => {
    if (selectedPatientDetails && !preSelectedPatientId) {
      setSelectedPatient(selectedPatientDetails);
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
      handleResetFilters();
      setPatientFilter({});
      setShouldSearch(false);
      setSelectedServiceId(TRIAGE_SERVICE_ID);
      setSelectedInsuranceIds([]);
    }
  }, [isOpen, handleResetFilters, preSelectedPatientId]);

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
    handleResetFilters();
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

  const dialogWidthClass = (() => {
    if (currentStep === "visit-details") {
      return "sm:max-w-[620px] max-w-[95vw]";
    }
    if (patientsLoading) {
      return "sm:max-w-[1050px] max-w-[96vw]";
    }
    if (displayedPatients.length === 1) {
      return "sm:max-w-[460px] max-w-[95vw]";
    }
    if (displayedPatients.length === 2) {
      return "sm:max-w-[760px] max-w-[95vw]";
    }
    if (displayedPatients.length >= 3) {
      return "sm:max-w-[1050px] max-w-[96vw]";
    }
    // Idle or No results:
    return "sm:max-w-[540px] max-w-[95vw]";
  })();

  const gridColsClass = (() => {
    if (displayedPatients.length === 1) {
      return "grid-cols-1";
    }
    if (displayedPatients.length === 2) {
      return "grid-cols-1 sm:grid-cols-2";
    }
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  })();

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
          className={cn(
            "overflow-hidden rounded-3xl border border-border/80 bg-card/95 dark:bg-card/95 text-card-foreground shadow-2xl backdrop-blur-2xl p-2.5 sm:p-3.5 gap-0 transition-all duration-300 ease-in-out",
            dialogWidthClass
          )}
        >
          <DialogTitle className="sr-only">
            {currentStep === "patient-selection"
              ? preSelectedPatientId
                ? "Create Visit for Patient"
                : "Create Visit - Select Patient"
              : "Create Visit - Visit Details"}
          </DialogTitle>

          <div className="max-h-[calc(92vh-40px)] overflow-y-auto">
            {currentStep === "patient-selection" && (
              <div className="rounded-2xl border border-border/50 bg-[#FBF2ED] dark:bg-slate-900 shadow-md p-3.5 sm:p-4.5 flex flex-col space-y-4">
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-bold text-foreground">
                    {preSelectedPatientId
                      ? "Create Visit for Patient"
                      : "Create Visit - Select Patient"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Search and select a registered patient to proceed with clinic visit creation.
                  </p>
                </div>

                {/* Centered Search & Filter Pill Box */}
                <div className="relative rounded-2xl border border-border/60 bg-white dark:bg-slate-950 p-2.5 sm:p-3 shadow-sm space-y-2.5">
                  {/* Filter Pills & Filter Popover */}
                  <div className="flex gap-2 items-center justify-center flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSearchFilterType("name")}
                      className={cn(
                        "px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                        searchFilterType === "name"
                          ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-sm scale-105"
                          : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Name
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchFilterType("phoneNumber")}
                      className={cn(
                        "px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                        searchFilterType === "phoneNumber"
                          ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-sm scale-105"
                          : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Phone
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchFilterType("insuranceCardNumber")}
                      className={cn(
                        "px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                        searchFilterType === "insuranceCardNumber"
                          ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-sm scale-105"
                          : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Card #
                    </button>

                    {/* Filter Popover */}
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border",
                            activeFilterCount > 0
                              ? "border-primary bg-primary/10 text-primary shadow-xs"
                              : "border-border/70 bg-background text-muted-foreground hover:text-foreground hover:border-primary/50"
                          )}
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Filters</span>
                          {activeFilterCount > 0 && (
                            <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                              {activeFilterCount}
                            </span>
                          )}
                        </button>
                      </PopoverTrigger>

                      <PopoverContent
                        align="center"
                        side="bottom"
                        sideOffset={8}
                        className="w-[320px] sm:w-[380px] p-4 rounded-2xl shadow-2xl border border-border/80 bg-background text-foreground z-[160] space-y-4"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-border/40">
                          <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-foreground">Filter Patients</span>
                            {activeFilterCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold">
                                {activeFilterCount} active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {activeFilterCount > 0 && (
                              <button
                                type="button"
                                onClick={handleResetFilters}
                                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Reset
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setIsFilterOpen(false)}
                              className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Section 1: Insurance Provider Badges (Acronyms) */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-primary" />
                            Insurance Provider
                          </label>
                          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 rounded-xl bg-muted/40 dark:bg-slate-900/60 border border-border/40">
                            <button
                              type="button"
                              onClick={() => setSelectedInsuranceProviderId("")}
                              className={cn(
                                "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1",
                                !selectedInsuranceProviderId
                                  ? "bg-background text-foreground shadow-xs font-semibold border border-border/80"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                              )}
                            >
                              All Insurances
                            </button>
                            {availableInsurances &&
                              availableInsurances.map((ins) => {
                                const isSelected = selectedInsuranceProviderId === ins.id;
                                const acronym = ins.acronym || ins.insuranceName;
                                return (
                                  <button
                                    key={ins.id}
                                    type="button"
                                    onClick={() => setSelectedInsuranceProviderId(isSelected ? "" : ins.id)}
                                    className={cn(
                                      "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5",
                                      isSelected
                                        ? "bg-primary/15 text-primary border border-primary/40 font-semibold shadow-xs scale-105"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent"
                                    )}
                                    title={ins.insuranceName}
                                  >
                                    {ins.iconUrl ? (
                                      <img
                                        src={getMediaUrl(ins.iconUrl)}
                                        alt={ins.insuranceName}
                                        className="h-3.5 w-3.5 rounded-full object-cover shrink-0"
                                      />
                                    ) : null}
                                    <span>{acronym}</span>
                                  </button>
                                );
                              })}
                          </div>
                        </div>

                        {/* Section 2: Gender Selector */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-primary" />
                            Gender
                          </label>
                          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-muted/40 dark:bg-slate-900/60 border border-border/40">
                            {(
                              [
                                { id: "all", label: "All" },
                                { id: "MALE", label: "Male" },
                                { id: "FEMALE", label: "Female" },
                                { id: "OTHER", label: "Other" },
                              ] as const
                            ).map((g) => (
                              <button
                                key={g.id}
                                type="button"
                                onClick={() => setGenderFilter(g.id)}
                                className={cn(
                                  "py-1.5 px-2 rounded-lg text-xs font-medium text-center transition-all cursor-pointer",
                                  genderFilter === g.id
                                    ? "bg-background text-foreground shadow-xs font-semibold border border-border/80"
                                    : "text-muted-foreground hover:text-foreground"
                                )}
                              >
                                {g.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Section 3: Age Filter */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            Age Range
                          </label>
                          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted/40 dark:bg-slate-900/60 border border-border/40 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setAgeRange("all");
                                setExactAge("");
                                setCustomAgeMin("");
                                setCustomAgeMax("");
                              }}
                              className={cn(
                                "py-1 px-2 rounded-lg font-medium transition-all text-center cursor-pointer",
                                ageRange === "all"
                                  ? "bg-background text-foreground shadow-xs font-semibold border border-border/80"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              All ages
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAgeRange("pediatric");
                                setExactAge("");
                              }}
                              className={cn(
                                "py-1 px-2 rounded-lg font-medium transition-all text-center cursor-pointer",
                                ageRange === "pediatric"
                                  ? "bg-background text-foreground shadow-xs font-semibold border border-border/80"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              0-17 yrs
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAgeRange("adult");
                                setExactAge("");
                              }}
                              className={cn(
                                "py-1 px-2 rounded-lg font-medium transition-all text-center cursor-pointer",
                                ageRange === "adult"
                                  ? "bg-background text-foreground shadow-xs font-semibold border border-border/80"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              18-64 yrs
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAgeRange("senior");
                                setExactAge("");
                              }}
                              className={cn(
                                "py-1 px-2 rounded-lg font-medium transition-all text-center cursor-pointer",
                                ageRange === "senior"
                                  ? "bg-background text-foreground shadow-xs font-semibold border border-border/80"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              65+ yrs
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAgeRange("custom");
                                setExactAge("");
                              }}
                              className={cn(
                                "py-1 px-2 rounded-lg font-medium transition-all text-center cursor-pointer",
                                ageRange === "custom"
                                  ? "bg-background text-foreground shadow-xs font-semibold border border-border/80"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              Custom
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAgeRange("exact");
                                setCustomAgeMin("");
                                setCustomAgeMax("");
                              }}
                              className={cn(
                                "py-1 px-2 rounded-lg font-medium transition-all text-center cursor-pointer",
                                ageRange === "exact"
                                  ? "bg-background text-foreground shadow-xs font-semibold border border-border/80"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              Exact Age
                            </button>
                          </div>

                          {ageRange === "custom" && (
                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="number"
                                min="0"
                                max="150"
                                placeholder="Min age"
                                value={customAgeMin}
                                onChange={(e) => setCustomAgeMin(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                              <span className="text-xs text-muted-foreground">to</span>
                              <input
                                type="number"
                                min="0"
                                max="150"
                                placeholder="Max age"
                                value={customAgeMax}
                                onChange={(e) => setCustomAgeMax(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                          )}

                          {ageRange === "exact" && (
                            <div className="pt-1">
                              <input
                                type="number"
                                min="0"
                                max="150"
                                placeholder="Exact age (e.g. 25)"
                                value={exactAge}
                                onChange={(e) => setExactAge(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={`Search patients by ${searchFilterType === "name" ? "name" : searchFilterType === "phoneNumber" ? "phone number" : "insurance card number"}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-9 h-11 text-sm rounded-xl border-border/60 bg-background/50 focus-visible:ring-primary/40"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Results Section */}
                {patientsLoading ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Searching patient database...
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pr-1">
                      {Array.from({ length: 9 }).map((_, idx) => (
                        <PatientCardSkeleton key={idx} />
                      ))}
                    </div>
                  </div>
                ) : displayedPatients.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                      <span className="font-semibold text-foreground">
                        Found {displayedPatients.length} matching patient{displayedPatients.length > 1 ? "s" : ""}
                      </span>
                      <span className="text-[11px] text-muted-foreground">Click a card to select</span>
                    </div>
                    <div className={cn("grid gap-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin", gridColsClass)}>
                      {displayedPatients.map((patient: Patient) => (
                        <div
                          key={patient.id}
                          className={cn(
                            "group relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between bg-white dark:bg-slate-950 shadow-sm",
                            selectedPatientId === patient.id
                              ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md"
                              : "border-border/60 hover:border-primary/60 hover:shadow-md hover:-translate-y-0.5",
                            !canCreateNewVisit(patient) && "opacity-60 cursor-not-allowed"
                          )}
                          onClick={() => handlePatientSelect(patient)}
                          onMouseEnter={() => setHoveredPatientId(patient.id)}
                          onMouseLeave={() => setHoveredPatientId(null)}
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#25D2D8]/20 via-[#5F77E8]/20 to-[#3CAAD8]/20 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                {patient.firstName?.[0] || ""}{patient.lastName?.[0] || ""}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                  {patient.firstName} {patient.lastName}
                                </h4>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  {patient.dateOfBirth && (
                                    <span>{calculateAge(patient.dateOfBirth)} yrs</span>
                                  )}
                                  {patient.gender && (
                                    <>
                                      <span>•</span>
                                      <span className="capitalize">{patient.gender.toLowerCase()}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions on hover */}
                            <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAddInsurancePatientId(patient.id);
                                  setShowAddInsuranceModal(true);
                                }}
                                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                                title="Add insurance"
                              >
                                <ShieldPlus className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPatientForEdit(patient);
                                  setEditPatientModal(true);
                                }}
                                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                                title="Edit patient"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>

                          {/* Info details */}
                          <div className="space-y-1 text-xs text-muted-foreground my-2 bg-muted/20 p-2 rounded-xl border border-border/40">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-muted-foreground">Phone:</span>
                              <span className="font-medium text-foreground truncate">{patient.primaryPhoneNumber || "—"}</span>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-muted-foreground">National ID:</span>
                              <span className="font-medium text-foreground truncate max-w-[120px]">{patient.nationalIdNumber || "—"}</span>
                            </div>
                          </div>

                          {/* Insurances & Select CTA */}
                          <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2 mt-auto">
                            <div className="flex flex-wrap gap-1.5 min-w-0 max-w-[70%]">
                              {patient.patientInsurances && patient.patientInsurances.length > 0 ? (
                                patient.patientInsurances.map((ins: any, idx: number) => {
                                  const active = isInsuranceActive(ins);
                                  const acronym = ins.insuranceProvider?.acronym || ins.insuranceProvider?.insuranceName || "INS";
                                  const name = ins.insuranceProvider?.insuranceName || ins.insuranceProvider?.name || acronym;
                                  const iconUrl = ins.insuranceProvider?.iconUrl;
                                  return (
                                    <div key={idx} className="relative group/ins inline-block">
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-[10px] px-1.5 py-0.5 h-5 rounded-md font-medium cursor-help transition-all flex items-center gap-1",
                                          active
                                            ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                                            : "border-amber-300 dark:border-amber-700 bg-amber-500/10 text-amber-600 dark:text-amber-400 opacity-70"
                                        )}
                                      >
                                        {iconUrl ? (
                                          <img
                                            src={getMediaUrl(iconUrl)}
                                            alt={name}
                                            className={cn("h-3 w-3 rounded-full object-cover shrink-0", !active && "grayscale")}
                                          />
                                        ) : !active ? (
                                          <ShieldAlert className="h-3 w-3 shrink-0 text-amber-500" />
                                        ) : null}
                                        <span>{acronym}</span>
                                      </Badge>

                                      {/* Hover Tooltip Popup */}
                                      <div className="absolute bottom-full left-0 mb-2 opacity-0 invisible group-hover/ins:opacity-100 group-hover/ins:visible transition-all duration-150 z-[150] pointer-events-none w-56">
                                        <div className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] rounded-xl p-2.5 shadow-2xl border border-slate-700/60 backdrop-blur-md space-y-1">
                                          <div className="flex items-center justify-between gap-1 border-b border-slate-700 pb-1">
                                            <span className="font-bold text-xs text-white truncate">{name}</span>
                                            <span
                                              className={cn(
                                                "text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0",
                                                active
                                                  ? "bg-emerald-500/20 text-emerald-300"
                                                  : "bg-amber-500/20 text-amber-300"
                                              )}
                                            >
                                              {active ? "Active" : insuranceStatusLabel(ins)}
                                            </span>
                                          </div>
                                          {ins.insuranceCardNumber && (
                                            <div className="flex justify-between text-slate-300 gap-2">
                                              <span className="text-slate-400 shrink-0">Card #:</span>
                                              <span className="font-mono font-medium truncate">{ins.insuranceCardNumber}</span>
                                            </div>
                                          )}
                                          {ins.providingCompanyOrEmployer && (
                                            <div className="flex justify-between text-slate-300 gap-2">
                                              <span className="text-slate-400 shrink-0">Employer:</span>
                                              <span className="truncate max-w-[120px]">{ins.providingCompanyOrEmployer}</span>
                                            </div>
                                          )}
                                          {ins.principalMemberName && (
                                            <div className="flex justify-between text-slate-300 gap-2">
                                              <span className="text-slate-400 shrink-0">Member:</span>
                                              <span className="truncate max-w-[120px]">{ins.principalMemberName}</span>
                                            </div>
                                          )}
                                          <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <span className="text-[10px] text-muted-foreground italic">Private / Self-pay</span>
                              )}
                            </div>

                            <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
                              Select <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : shouldSearch ? (
                  <div className="rounded-2xl border border-dashed border-border/70 p-6 text-center bg-white/40 dark:bg-slate-950/40">
                    <User className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm text-foreground">No matching patients found</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      We couldn&apos;t find any patient matching &quot;{searchQuery}&quot;. Please check for typos or register a new patient.
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {currentStep === "visit-details" && selectedPatient && (
              <div className="space-y-4 bg-[#FBF2ED] dark:bg-slate-900 border border-border/50 p-4 sm:p-5 rounded-2xl shadow-sm">
                {/* Selected Patient Info */}
                <div className="bg-white dark:bg-slate-950 border border-border/60 p-3.5 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {selectedPatient.firstName?.[0] || ""}{selectedPatient.lastName?.[0] || ""}
                      </div>
                      <span className="font-semibold text-sm">Selected Patient</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2.5 text-xs rounded-lg border-border/60"
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
                        className="h-7 px-2.5 text-xs rounded-lg border-border/60"
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
                    <div className="font-medium text-foreground">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      DOB:{" "}
                      {new Date(
                        selectedPatient.dateOfBirth,
                      ).toLocaleDateString()}
                      {selectedPatient.primaryPhoneNumber &&
                        ` • Phone: ${selectedPatient.primaryPhoneNumber}`}
                    </div>
                  </div>
                </div>

                {/* Insurance Selection - Cards Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-foreground">
                      Insurance for Visit
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {selectedInsuranceIds.length === 0 ? (
                        <span className="italic text-muted-foreground">Private / Self-pay</span>
                      ) : (
                        <span className="text-primary font-medium">
                          {selectedInsuranceIds.length} insurance{selectedInsuranceIds.length > 1 ? "s" : ""} selected
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Grid of Small Insurance Cards + Add Insurance Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {selectedPatient.patientInsurances &&
                      selectedPatient.patientInsurances.map((insurance: any) => {
                        const active = isInsuranceActive(insurance);
                        const isSelected = selectedInsuranceIds.includes(insurance.id);
                        const acronym =
                          insurance.insuranceProvider?.acronym ||
                          insurance.insuranceProvider?.insuranceName ||
                          "INS";
                        const providerName =
                          insurance.insuranceProvider?.insuranceName ||
                          insurance.insuranceProvider?.name ||
                          acronym;
                        const iconUrl = insurance.insuranceProvider?.iconUrl;
                        const patientSharePct =
                          insurance.patientSharePercentage ??
                          (insurance.insuranceProvider
                            ? getBasePatientSharePercentage(insurance.insuranceProvider)
                            : null);
                        const memberLabel = insurance.principalMember
                          ? "Principal / Self"
                          : insurance.principalMemberName
                            ? insurance.principalMemberName
                            : "Dependent";

                        return (
                          <div
                            key={insurance.id}
                            onClick={() => {
                              if (!active) return;
                              setSelectedInsuranceIds((prev) =>
                                prev.includes(insurance.id)
                                  ? prev.filter((id) => id !== insurance.id)
                                  : [...prev, insurance.id]
                              );
                            }}
                            className={cn(
                              "relative p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between select-none min-h-[105px]",
                              active
                                ? "cursor-pointer"
                                : "opacity-60 cursor-not-allowed bg-muted/10 border-amber-300 dark:border-amber-800",
                              active && isSelected
                                ? "border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/25 shadow-sm"
                                : active
                                  ? "border-border/60 bg-white dark:bg-slate-950 hover:border-primary/50 hover:shadow-xs"
                                  : ""
                            )}
                          >
                            {/* Header: Logo + Acronym & Badges */}
                            <div className="flex items-start justify-between gap-1.5 mb-1.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                {iconUrl ? (
                                  <img
                                    src={getMediaUrl(iconUrl)}
                                    alt={providerName}
                                    className={cn(
                                      "h-4 w-4 rounded-full object-cover shrink-0",
                                      !active && "grayscale"
                                    )}
                                  />
                                ) : null}
                                <span
                                  className="font-bold text-xs text-foreground truncate"
                                  title={providerName}
                                >
                                  {acronym}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {patientSharePct !== null && patientSharePct !== undefined && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 h-4.5 rounded-md font-semibold bg-primary/10 text-primary border-primary/25"
                                  >
                                    {patientSharePct}% share
                                  </Badge>
                                )}
                                {active && (
                                  <div
                                    className={cn(
                                      "w-4 h-4 rounded-md border flex items-center justify-center transition-all",
                                      isSelected
                                        ? "bg-primary border-primary text-white"
                                        : "border-border/80 bg-background/50"
                                    )}
                                  >
                                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Details: Card Number & Principal Member */}
                            <div className="space-y-0.5 text-[11px] text-muted-foreground my-1">
                              {insurance.insuranceCardNumber && (
                                <div className="flex items-center gap-1 truncate font-mono text-foreground font-medium">
                                  <CreditCard className="w-3 h-3 text-muted-foreground shrink-0" />
                                  <span className="truncate">{insurance.insuranceCardNumber}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 truncate text-muted-foreground">
                                <User className="w-3 h-3 text-muted-foreground shrink-0" />
                                <span className="truncate">{memberLabel}</span>
                              </div>
                            </div>

                            {/* Inactive Status Warning */}
                            {!active && (
                              <div className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3 shrink-0" />
                                <span className="truncate">{insuranceStatusLabel(insurance)}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {/* Add Insurance Card at the End */}
                    <button
                      type="button"
                      onClick={() => {
                        setAddInsurancePatientId(selectedPatient.id);
                        setShowAddInsuranceModal(true);
                      }}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl border border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all text-primary text-xs font-semibold gap-1.5 min-h-[105px] group cursor-pointer bg-white/40 dark:bg-slate-950/40"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center transition-all">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span>Add Insurance</span>
                    </button>
                  </div>

                  {(!selectedPatient.patientInsurances ||
                    selectedPatient.patientInsurances.length === 0) && (
                    <p className="text-[11px] text-muted-foreground italic px-0.5">
                      No insurance recorded for this patient. Click &quot;Add Insurance&quot; above to link a card or continue as Private.
                    </p>
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

          {currentStep === "visit-details" && (
            <DialogFooter className="mt-3 flex justify-center items-center gap-3 px-0 pb-1 pt-2">
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
            </DialogFooter>
          )}
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
