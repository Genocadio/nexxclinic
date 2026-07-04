"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  useRegisterPatient,
  useInsurances,
  useDepartments,
  useCreateVisit,
  usePatients,
} from "@/hooks/auth-hooks";
import type { Patient, Visit } from "@/lib/api-types";
import type { SearchPatientsInput } from "@/lib/api-input-types";
import type { RegisterPatientInput } from "@/hooks/patients/hooks";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { toast } from "react-toastify";
import {
  sanitizeEmailOrPhoneInput,
  sanitizePhoneInput,
  validateEmailOrPhone,
  calculateAge,
  isDominantMemberRequired,
  validateDateOfBirth,
} from "@/lib/validation-utils";
import PatientFormFields from "@/components/patient/patient-form-fields";
import PatientEditModal from "@/components/patient-edit-modal";

// moved inside component to access insurances safely

interface PatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientRegistered?: (
    patientId: string,
    patientInsurances: any[],
    proceedToVisit: boolean,
    createdVisit?: Visit,
  ) => void;
  hideSearchPanel?: boolean;
}

export default function PatientRegistrationModal({
  isOpen,
  onClose,
  onPatientRegistered,
  hideSearchPanel = false,
}: PatientRegistrationModalProps) {
  const { registerPatient, loading } = useRegisterPatient();
  const { insurances, loading: insurancesLoading } = useInsurances();
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");
  const [editPatientModal, setEditPatientModal] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] =
    useState<Patient | null>(null);

  // Search filters for potential duplicate detection
  const [searchFilters, setSearchFilters] = useState<SearchPatientsInput>({});
  const [hideMatchesAfterNoResult, setHideMatchesAfterNoResult] =
    useState(false);
  const hasSearchCriteria =
    Object.keys(searchFilters).length > 0 &&
    Object.values(searchFilters).some(
      (value) => value !== undefined && value !== "",
    );
  const { patients: potentialMatches, loading: searchingPatients } =
    usePatients(hasSearchCriteria ? searchFilters : undefined, 0, 10);
  const showPotentialMatches =
    !hideSearchPanel && hasSearchCriteria && !hideMatchesAfterNoResult;
  const modalGridClass = showPotentialMatches
    ? "grid grid-cols-1 lg:grid-cols-[760px_minmax(340px,1fr)]"
    : "grid grid-cols-1";
  const dialogWidthClass = showPotentialMatches
    ? "sm:max-w-[1180px]"
    : "sm:max-w-[780px]";

  // Reset search filters when modal opens (don't search on open)
  useEffect(() => {
    if (isOpen) {
      setSearchFilters({});
      setHideMatchesAfterNoResult(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!hasSearchCriteria) {
      setHideMatchesAfterNoResult(false);
      return;
    }

    if (!searchingPatients && potentialMatches.length === 0) {
      const timer = window.setTimeout(() => {
        setHideMatchesAfterNoResult(true);
      }, 2000);

      return () => window.clearTimeout(timer);
    }

    setHideMatchesAfterNoResult(false);
  }, [hasSearchCriteria, searchingPatients, potentialMatches.length]);

  const [formData, setFormData] = useState<RegisterPatientInput>({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    contactInfo: {
      phone: "",
      email: "",
      address: {
        country: "",
        province: "",
        district: "",
        sector: "",
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
  });

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue =
      field === "contactInfo.email"
        ? sanitizeEmailOrPhoneInput(value)
        : field === "contactInfo.phone" || field === "emergencyContact.phone"
          ? sanitizePhoneInput(value)
          : value;

    setFormData((prev) => {
      const keys = field.split(".");
      const updated = { ...prev };

      let current: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = sanitizedValue;

      return updated;
    });

    if (field === "dateOfBirth") setDateError("");

    // Update search filters for duplicate detection
    const nextFirstName =
      field === "firstName" ? sanitizedValue : formData.firstName;
    const nextLastName =
      field === "lastName" ? sanitizedValue : formData.lastName;
    const nextDateOfBirth =
      field === "dateOfBirth" ? sanitizedValue : formData.dateOfBirth;
    const nextGender = field === "gender" ? sanitizedValue : formData.gender;
    const nextPhone =
      field === "contactInfo.phone"
        ? sanitizedValue
        : formData.contactInfo?.phone;

    const firstNameReady = nextFirstName.trim().length >= 2;
    const hasOtherFieldsFilled = Boolean(
      nextLastName?.trim() ||
      nextDateOfBirth ||
      nextGender ||
      (nextPhone && nextPhone.trim().length >= 3) ||
      formData.contactInfo?.email?.trim() ||
      formData.nationalIdNumber?.trim() ||
      formData.emergencyContact?.name?.trim() ||
      formData.emergencyContact?.relation?.trim() ||
      formData.emergencyContact?.phone?.trim(),
    );

    const shouldSearch =
      firstNameReady && (field !== "firstName" || hasOtherFieldsFilled);

    if (!firstNameReady) {
      setSearchFilters({});
    } else if (shouldSearch) {
      setSearchFilters(() => {
        const newFilters: SearchPatientsInput = {};
        const fullName = [nextFirstName, nextLastName]
          .filter(Boolean)
          .join(" ")
          .trim();

        if (fullName.length > 0) {
          newFilters.name = fullName;
        }

        if (nextPhone && nextPhone.trim().length >= 3) {
          newFilters.phoneNumber = nextPhone.trim();
        }

        if (nextDateOfBirth) {
          const age = calculateAge(nextDateOfBirth);
          if (age > 0) {
            newFilters.age = age;
          }
        }

        Object.keys(newFilters).forEach((key) => {
          if (!newFilters[key as keyof SearchPatientsInput]) {
            delete newFilters[key as keyof SearchPatientsInput];
          }
        });

        return newFilters;
      });
    } else if (field === "firstName" && sanitizedValue.trim().length === 0) {
      // Clear search if firstName is emptied
      setSearchFilters({});
    }
  };

  const addInsurance = () => {
    setFormData((prev) => ({
      ...prev,
      insurances: [
        ...(prev.insurances || []),
        {
          insuranceId: "0",
          insuranceCardNumber: "",
          providingCompanyOrEmployer: "",
          dominantMember: {
            firstName: "",
            lastName: "",
            phone: "",
          },
        },
      ],
    }));
  };

  const updateInsurance = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      insurances: (prev.insurances || []).map((insurance, i) => {
        if (i === index) {
          if (field.startsWith("dominantMember.")) {
            const dominantMemberField = field.split(".")[1];
            return {
              ...insurance,
              dominantMember: {
                ...insurance.dominantMember,
                [dominantMemberField]: value,
              },
            };
          }
          return { ...insurance, [field]: value };
        }
        return insurance;
      }),
    }));
  };

  const removeInsurance = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      insurances: (prev.insurances || []).filter((_, i) => i !== index),
    }));
  };

  const handleCountryChange = (country: string) => {
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
    }));
  };

  const handleProvinceChange = (province: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        email: prev.contactInfo?.email,
        phone: prev.contactInfo?.phone,
        address: {
          ...prev.contactInfo?.address,
          province,
          district: "",
          sector: "",
        },
      },
    }));
  };

  const handleDistrictChange = (district: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        email: prev.contactInfo?.email,
        phone: prev.contactInfo?.phone,
        address: {
          ...prev.contactInfo?.address,
          district,
          sector: "",
        },
      },
    }));
  };

  const handleSectorChange = (sector: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        email: prev.contactInfo?.email,
        phone: prev.contactInfo?.phone,
        address: {
          ...prev.contactInfo?.address,
          sector,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName || !formData.dateOfBirth || !formData.gender) {
      toast.error(
        "Please fill in required fields (First Name, Date of Birth, and Gender)",
      );
      return;
    }

    const dobValidation = validateDateOfBirth(formData.dateOfBirth);
    if (!dobValidation.valid) {
      setDateError(dobValidation.error || "Invalid date of birth");
      toast.error(dobValidation.error || "Invalid date of birth");
      return;
    }
    setDateError("");

    // Validate email or phone if provided
    if (formData.contactInfo?.email) {
      const emailOrPhoneValidation = validateEmailOrPhone(
        formData.contactInfo.email,
      );
      if (!emailOrPhoneValidation.valid) {
        toast.error(`Email/Phone validation: ${emailOrPhoneValidation.error}`);
        return;
      }
    }

    // Validate dominant member requirement for patients <= 18 with insurance
    const hasInsurance = (formData.insurances?.length ?? 0) > 0;
    const dominantMemberRequired = isDominantMemberRequired(
      formData.dateOfBirth,
      hasInsurance,
    );

    if (dominantMemberRequired) {
      for (let i = 0; i < (formData.insurances?.length || 0); i++) {
        const insurance = formData.insurances![i];
        if (
          !insurance.dominantMember?.firstName ||
          !insurance.dominantMember?.lastName ||
          !insurance.dominantMember?.phone
        ) {
          toast.error(
            `Insurance #${i + 1}: Dominant member information (First Name, Last Name, Phone) is required for patients 18 years or younger`,
          );
          return;
        }
      }
    }

    if (formData.insurances && formData.insurances.length > 0) {
      for (let i = 0; i < formData.insurances.length; i++) {
        const insurance = formData.insurances[i];
        if (
          !insurance.insuranceId ||
          String(insurance.insuranceId) === "0" ||
          !insurance.insuranceCardNumber ||
          !insurance.providingCompanyOrEmployer
        ) {
          toast.error(
            `Insurance #${i + 1}: Insurance provider, card number, and providing company/employer are required`,
          );
          return;
        }
      }
    }

    try {
      const result = await registerPatient(formData);
      if (result.status === "SUCCESS") {
        toast.success(result.message || "Patient registered successfully!");
        if (onPatientRegistered && result.data?.patient?.id) {
          onPatientRegistered(
            result.data.patient.id,
            result.data.linkedInsurances || [],
            false,
            result.data,
          );
        }
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          middleName: "",
          dateOfBirth: "",
          gender: "",
          contactInfo: {
            phone: "",
            email: "",
            address: {
              country: "",
              province: "",
              district: "",
              sector: "",
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
          notes: "",
        });
        onClose();
      } else {
        const message =
          result.message ||
          result.messages?.[0]?.text ||
          "Patient registration failed";
        toast.error(message);
      }
    } catch (error) {
      toast.error("Network error occurred");
    }
  };

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
              modalGridClass +
              " gap-2 sm:gap-6 h-full max-h-[calc(90vh-180px)] overflow-hidden"
            }
          >
            {/* Registration Form */}
            <div className="mx-auto w-full max-w-[760px] overflow-y-auto scrollbar-hide pr-2 pb-20 rounded-2xl border border-border/50 bg-[#FBF2ED] dark:bg-slate-900 shadow-lg p-2 sm:p-4">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
                <PatientFormFields
                  formData={formData}
                  onFieldChange={handleInputChange}
                  onCountryChange={handleCountryChange}
                  onProvinceChange={handleProvinceChange}
                  onDistrictChange={handleDistrictChange}
                  onSectorChange={handleSectorChange}
                  onAddInsurance={addInsurance}
                  onUpdateInsurance={updateInsurance}
                  onRemoveInsurance={removeInsurance}
                  availableInsurances={insurances}
                  loading={loading}
                  dateError={dateError}
                />



                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-8 pt-3 sm:pt-6 border-t border-border/30 -mx-2 sm:-mx-4 px-2 sm:px-4 pb-2 sm:pb-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full px-4 py-2 sm:py-2.5 bg-background dark:bg-gray-900 border border-border/70 text-foreground hover:bg-muted/40 dark:hover:bg-muted/50 shadow-lg text-xs sm:text-base flex-1 sm:flex-initial"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-full px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-lg hover:opacity-90 transition-all duration-200 text-xs sm:text-base flex-1"
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
              </form>
            </div>

            {/* Potential Matches Panel (hidden on mobile) */}
            {showPotentialMatches && (
              <div className="hidden md:block border-l border-border/50 overflow-y-auto scrollbar-hide pb-20 rounded-2xl bg-[#FBF2ED] dark:bg-slate-900 shadow-lg px-8 py-6">
                <>
                  {searchingPatients && potentialMatches.length === 0 ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((index) => (
                        <div
                          key={index}
                          className="rounded-2xl bg-muted/50 p-4 animate-pulse"
                        >
                          <div className="h-4 w-2/3 rounded-full bg-muted-foreground/30 mb-3"></div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="h-3 rounded-full bg-muted-foreground/30"></div>
                            <div className="h-3 rounded-full bg-muted-foreground/30"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : potentialMatches.length > 0 ? (
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
                                setSelectedPatientForEdit(patient);
                                setEditPatientModal(true);
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
                                );
                                onClose();
                                if (onPatientRegistered) {
                                  onPatientRegistered(
                                    patient.id.toString(),
                                    patient.patientInsurances || [],
                                    true,
                                  );
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

                                        {/* Hover Tooltip */}
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
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-sm text-muted-foreground">
                        No matching patients found
                      </div>
                    </div>
                  )}
                </>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <PatientEditModal
        isOpen={editPatientModal}
        onClose={() => {
          setEditPatientModal(false);
          setSelectedPatientForEdit(null);
        }}
        patient={selectedPatientForEdit}
        onPatientUpdated={(updatedPatient) => {
          // After edit, automatically select the patient
          toast.success(
            `Patient updated and selected: ${updatedPatient.firstName} ${updatedPatient.lastName}`,
          );
          setEditPatientModal(false);
          setSelectedPatientForEdit(null);
          onClose();
          if (onPatientRegistered) {
            onPatientRegistered(
              updatedPatient.id.toString(),
              updatedPatient.patientInsurances || [],
              true,
            );
          }
        }}
      />
    </>
  );
}
