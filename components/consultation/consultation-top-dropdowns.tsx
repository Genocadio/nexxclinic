"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  User,
  Shield,
  HeartPulse,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
  AlertTriangle,
  History as HistoryIcon,
  CheckCircle2,
  ExternalLink,
  Pin,
  Loader2,
  Check,
  Info,
} from "lucide-react";
import { formatDateOnly, cn } from "@/lib/utils";
import type { Patient, PatientInsurance } from "@/lib/api-types";
import { isInsuranceActive, insuranceStatusLabel } from "@/lib/insurance-utils";
import { PatientInsuranceBadge } from "@/components/patient-insurance-badge";
import { normalizeVisitVitalSigns } from "@/hooks/visits/vital-signs";
import { calculateAnthropometrics } from "@/lib/mews-utils";
import { VitalSignsMewsBanner } from "@/components/vital-signs/vital-signs-mews-banner";
import { VitalSignAlertBadge } from "@/components/vital-signs/vital-sign-alert-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── 1. Patient Identification Dropdown Content ──────────────────────────────
export interface PatientIdentificationDropdownContentProps {
  patient: Patient;
  patientFullName: string;
  ageText?: string | null;
  visitInsurances?: any[];
  departmentName?: string;
  isPinned?: boolean;
  onTogglePin?: () => void;
  onClose?: () => void;
  // Optional interactive insurance management (used in billing):
  patientInsurances?: PatientInsurance[];
  activeInsuranceIds?: Set<string>;
  onToggleInsurance?: (insuranceId: string, active: boolean) => void;
  onAddInsurance?: () => void;
  billedInsuranceIds?: Set<string>;
  readOnly?: boolean;
  addingVisitInsurance?: boolean;
}

export function PatientIdentificationDropdownContent({
  patient,
  patientFullName,
  ageText,
  visitInsurances = [],
  departmentName,
  isPinned,
  onTogglePin,
  onClose,
  patientInsurances,
  activeInsuranceIds,
  onToggleInsurance,
  onAddInsurance,
  billedInsuranceIds,
  readOnly = false,
  addingVisitInsurance = false,
}: PatientIdentificationDropdownContentProps) {
  const addressParts = [
    patient.district,
    patient.city,
    patient.cell,
    patient.village,
  ]
    .filter(Boolean)
    .join(", ");

  const allPatientInsurances = useMemo(() => {
    const list = [...(patientInsurances || patient.patientInsurances || [])];
    for (const vIns of visitInsurances || []) {
      if (!list.some((p) => String(p.id) === String(vIns.id))) {
        list.push(vIns);
      }
    }
    return list;
  }, [patientInsurances, patient.patientInsurances, visitInsurances]);

  const isApplied = useCallback(
    (ins: any) => {
      if (!ins) return false;
      const idStr = String(ins.id);
      if (activeInsuranceIds) {
        return activeInsuranceIds.has(idStr) || activeInsuranceIds.has(ins.id);
      }
      return (visitInsurances || []).some(
        (v) => String(v.id) === idStr || (v.insuranceCardNumber && v.insuranceCardNumber === ins.insuranceCardNumber)
      );
    },
    [activeInsuranceIds, visitInsurances],
  );

  const appliedInsurances = useMemo(() => {
    const fromAll = allPatientInsurances.filter(isApplied);
    if (fromAll.length > 0) return fromAll;
    if (visitInsurances && visitInsurances.length > 0) return visitInsurances;
    return [];
  }, [allPatientInsurances, isApplied, visitInsurances]);

  const nonAppliedInsurances = useMemo(() => {
    return allPatientInsurances.filter((pi) => !isApplied(pi));
  }, [allPatientInsurances, isApplied]);

  return (
    <div className="flex flex-col bg-background text-foreground text-xs sm:text-sm">
      {/* Header — clean centered/justified layout without pin/close buttons */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/70 bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-3 w-3" />
          </div>
          <h3 className="text-xs font-semibold text-foreground">
            Patient & Insurance
          </h3>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono bg-background/80 border border-border/60 px-1.5 py-0.5 rounded-md">
          MRN: {patient.patientIdentifier || "N/A"}
        </span>
      </div>

      {/* Body — space-optimized */}
      <div className="p-3 space-y-2.5 max-h-[72vh] overflow-y-auto">
        <div>
          <p className="text-sm sm:text-base font-bold text-foreground leading-tight">
            {patientFullName}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-muted-foreground">
            {patient.gender && (
              <Badge variant="secondary" className="text-xs py-0 px-1.5 h-4 font-medium uppercase">
                {patient.gender}
              </Badge>
            )}
            <span>
              DOB: {patient.dateOfBirth ? formatDateOnly(patient.dateOfBirth) : "N/A"}
              {ageText && <strong className="ml-1 text-foreground">({ageText})</strong>}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-border/50 text-xs">
          {patient.primaryPhoneNumber && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="text-foreground font-medium">{patient.primaryPhoneNumber}</span>
            </div>
          )}

          {addressParts && (
            <div className="text-muted-foreground text-xs leading-relaxed">
              <span className="font-semibold text-foreground/80">Address:</span> {addressParts}
            </div>
          )}

          {patient.nationalIdNumber && (
            <div className="text-muted-foreground text-xs">
              <span className="font-semibold text-foreground/80">National ID:</span> {patient.nationalIdNumber}
            </div>
          )}

          {patient.passportNumber && (
            <div className="text-muted-foreground text-xs">
              <span className="font-semibold text-foreground/80">Passport:</span> {patient.passportNumber}
            </div>
          )}
        </div>

        {/* Insurance Section: Active Applied Policy vs Non-Applied Policies */}
        <div className="pt-2 border-t border-border/50 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Insurance on Visit
            </p>
            <div className="flex items-center gap-1.5">
              {departmentName && (
                <span className="text-xs text-muted-foreground">
                  Dept: {departmentName}
                </span>
              )}
              {onAddInsurance && !readOnly && (
                <TooltipProvider delayDuration={2000}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label="Add insurance policy"
                        className="h-6 w-6 rounded-md border border-border/70 bg-background hover:bg-muted hover:border-primary/50 flex items-center justify-center text-primary transition-colors shrink-0 shadow-xs cursor-pointer"
                        onClick={onAddInsurance}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Add insurance policy
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {appliedInsurances.length > 0 ? (
            appliedInsurances.map((activeInsurance: any) => (
              <div
                key={activeInsurance.id || activeInsurance.insuranceCardNumber || "active-ins"}
                className="rounded-xl border border-primary/30 bg-primary/5 p-2.5 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs sm:text-sm text-foreground">
                    {activeInsurance.insuranceProvider?.acronym ||
                      activeInsurance.insuranceProvider?.insuranceName ||
                      activeInsurance.insuranceProvider?.name ||
                      "Insurance"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="default" className="text-xs py-0.5 px-2 font-normal bg-emerald-600 text-white">
                      Applied To Visit
                    </Badge>
                    {onToggleInsurance && (() => {
                      const isUsedInBilling = billedInsuranceIds != null && (
                        billedInsuranceIds.has(String(activeInsurance.id)) ||
                        billedInsuranceIds.has(activeInsurance.id)
                      );

                      if (isUsedInBilling || readOnly) {
                        return (
                          <TooltipProvider delayDuration={150}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  role="button"
                                  tabIndex={0}
                                  aria-label="Insurance locked"
                                  className="h-6 w-6 rounded-md border border-border/70 bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-help"
                                >
                                  <Info className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs text-xs">
                                {readOnly
                                  ? "Visit is already billed. Insurance cannot be changed."
                                  : "Insurance is locked because it is used in billed items. Remove or change products first to unapply."}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      }

                      return (
                        <TooltipProvider delayDuration={2000}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                aria-label="Unapply insurance from this visit"
                                className="h-6 w-6 rounded-md border border-destructive/40 bg-background hover:bg-destructive/10 text-destructive flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
                                disabled={addingVisitInsurance}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  await onToggleInsurance(String(activeInsurance.id), false);
                                }}
                              >
                                {addingVisitInsurance ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <X className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              Unapply insurance from this visit
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs pt-1 border-t border-primary/10">
                  <div>
                    <span className="text-muted-foreground block text-xs">Card Number</span>
                    <span className="font-mono font-semibold text-foreground">
                      {activeInsurance.insuranceCardNumber || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Member Type</span>
                    <span className="font-medium text-foreground">
                      {activeInsurance.principalMember ? "Principal Member" : "Dependent"}
                    </span>
                  </div>
                  {activeInsurance.providingCompanyOrEmployer && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground block text-xs">Employer / Scheme</span>
                      <span className="font-medium text-foreground">{activeInsurance.providingCompanyOrEmployer}</span>
                    </div>
                  )}
                  {(activeInsurance.validFrom || activeInsurance.validUntil) && (
                    <div className="col-span-2 text-xs text-muted-foreground">
                      Valid: {activeInsurance.validFrom ? formatDateOnly(activeInsurance.validFrom) : "—"} to{" "}
                      {activeInsurance.validUntil ? formatDateOnly(activeInsurance.validUntil) : "Ongoing"}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-border/60 bg-muted/40 p-2.5">
              <span className="inline-block rounded-full bg-muted/80 px-2 py-0.5 text-xs font-semibold text-foreground mb-1">
                Private / Out-of-Pocket
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No third-party insurance applied to this visit. Services are billed out-of-pocket.
              </p>
            </div>
          )}

          {/* Non-applied insurances */}
          {nonAppliedInsurances.length > 0 && (
            <div className="pt-2 border-t border-border/40 space-y-1.5">
              <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Other Registered Policies (Not applied)
              </p>
              <div className="space-y-1.5">
                {nonAppliedInsurances.map((ins: any) => (
                  <div
                    key={ins.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg border border-dashed border-border/70 bg-muted/30 opacity-60 hover:opacity-100 transition-all text-xs"
                    title="Registered on patient record, but not selected for this visit."
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-foreground/80 block">
                        {ins.insuranceProvider?.acronym || ins.insuranceProvider?.name || "Insurance"}
                      </span>
                      <span className="text-muted-foreground text-[10px] font-mono truncate block">
                        {ins.insuranceCardNumber || "No card number"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant="outline" className="text-xs py-0.5 px-2 text-muted-foreground border-border/60 bg-muted/50">
                        Not applied
                      </Badge>
                      {onToggleInsurance && (() => {
                        const active = isInsuranceActive(ins);
                        if (!active || readOnly) {
                          return (
                            <TooltipProvider delayDuration={150}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Policy status info"
                                    className="h-6 w-6 rounded-md border border-border/70 bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-help"
                                  >
                                    <Info className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs text-xs">
                                  {readOnly
                                    ? "Visit is already billed"
                                    : insuranceStatusLabel(ins)}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        }

                        return (
                          <TooltipProvider delayDuration={2000}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  aria-label="Apply insurance to this visit"
                                  className="h-6 w-6 rounded-md border border-primary/40 bg-background hover:bg-primary/10 text-primary flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
                                  disabled={addingVisitInsurance}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await onToggleInsurance(String(ins.id), true);
                                  }}
                                >
                                  {addingVisitInsurance ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                Apply insurance to this visit
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 2. Insurance Dropdown Content ───────────────────────────────────────────
interface InsuranceDropdownContentProps {
  visitInsurances?: any[];
  patientInsurances?: any[];
  departmentName?: string;
  onClose?: () => void;
}

export function InsuranceDropdownContent({
  visitInsurances = [],
  patientInsurances = [],
  departmentName,
  onClose,
}: InsuranceDropdownContentProps) {
  const activeInsurance = visitInsurances[0];
  const otherPatientInsurances = useMemo(() => {
    if (!activeInsurance) return patientInsurances;
    return patientInsurances.filter((pi) => pi.id !== activeInsurance.id);
  }, [activeInsurance, patientInsurances]);

  return (
    <div className="flex flex-col bg-background text-foreground text-xs sm:text-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border/70 bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Shield className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground">
              Insurance Coverage
            </h3>
            {departmentName && (
              <p className="text-[10px] text-muted-foreground">
                Active department: {departmentName}
              </p>
            )}
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Close"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-3">
        {activeInsurance ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm text-foreground">
                  {activeInsurance.insuranceProvider?.acronym ||
                    activeInsurance.insuranceProvider?.insuranceName ||
                    activeInsurance.insuranceProvider?.name ||
                    "Insurance"}
                </span>
                <Badge variant="default" className="text-xs py-0.5 px-2 font-normal">
                  Active On Visit
                </Badge>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {activeInsurance.insuranceProvider?.insuranceName || activeInsurance.insuranceProvider?.name}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
              <div>
                <span className="text-muted-foreground block text-xs">Card Number</span>
                <span className="font-mono font-semibold text-foreground">
                  {activeInsurance.insuranceCardNumber || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Member Type</span>
                <span className="font-medium text-foreground">
                  {activeInsurance.principalMember ? "Principal Member" : "Dependent"}
                </span>
              </div>
              {activeInsurance.principalMemberName && !activeInsurance.principalMember && (
                <div className="col-span-2">
                  <span className="text-muted-foreground block text-xs">Principal Name</span>
                  <span className="font-medium text-foreground">{activeInsurance.principalMemberName}</span>
                </div>
              )}
              {activeInsurance.providingCompanyOrEmployer && (
                <div className="col-span-2">
                  <span className="text-muted-foreground block text-xs">Employer / Scheme</span>
                  <span className="font-medium text-foreground">{activeInsurance.providingCompanyOrEmployer}</span>
                </div>
              )}
              {(activeInsurance.validFrom || activeInsurance.validUntil) && (
                <div className="col-span-2 text-xs text-muted-foreground">
                  <span className="text-muted-foreground block text-xs">Validity</span>
                  <span className="text-foreground">
                    {activeInsurance.validFrom ? formatDateOnly(activeInsurance.validFrom) : "—"} to{" "}
                    {activeInsurance.validUntil ? formatDateOnly(activeInsurance.validUntil) : "Ongoing"}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border/70 bg-card p-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-muted/80 px-2 py-0.5 text-xs font-semibold text-foreground">
                Private Self-Pay
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This visit has no third-party insurance assigned. All consultation and medical services will be billed out-of-pocket directly to the patient.
            </p>
          </div>
        )}

        {/* Other registered insurances for patient */}
        {otherPatientInsurances.length > 0 && (
          <div className="pt-2 border-t border-border/50 space-y-1.5">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
              Other Registered Policies ({otherPatientInsurances.length})
            </p>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {otherPatientInsurances.map((ins: any) => (
                <div
                  key={ins.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg border border-border/50 bg-card/60 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-foreground">
                      {ins.insuranceProvider?.acronym || ins.insuranceProvider?.name || "Insurance"}
                    </span>
                    <span className="text-muted-foreground text-[10px] block font-mono truncate">
                      {ins.insuranceCardNumber || "No card number"}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 shrink-0 text-muted-foreground">
                    Registered
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 3. Vitals Dropdown Content ──────────────────────────────────────────────
interface VitalsDropdownContentProps {
  vitals: any[];
  canAddVitals: boolean;
  onAddVitals?: (vitals: Array<{ measurementName: string; value: string; unit: string }>) => Promise<boolean>;
  patientAge?: number | null;
  isPinned?: boolean;
  onTogglePin?: () => void;
  onClose?: () => void;
}

export function VitalsDropdownContent({
  vitals,
  canAddVitals,
  onAddVitals,
  patientAge,
  isPinned,
  onTogglePin,
  onClose,
}: VitalsDropdownContentProps) {
  type DraftVital = {
    id: string;
    measurementName: string;
    value: string;
    unit: string;
    isPreset?: boolean;
  };
  const defaultDraft = (): DraftVital[] => [
    { id: "bp", measurementName: "Blood Pressure", value: "", unit: "mmHg", isPreset: true },
    { id: "hr", measurementName: "Heart Rate", value: "", unit: "bpm", isPreset: true },
    { id: "temp", measurementName: "Temperature", value: "", unit: "°C", isPreset: true },
    { id: "spo2", measurementName: "Oxygen Saturation", value: "", unit: "%", isPreset: true },
    { id: "weight", measurementName: "Weight", value: "", unit: "kg", isPreset: true },
    { id: "height", measurementName: "Height", value: "", unit: "cm", isPreset: true },
  ];

  const [index, setIndex] = useState(0);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<DraftVital[]>(defaultDraft);
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const groups = useMemo(() => normalizeVisitVitalSigns(vitals), [vitals]);

  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, groups.length - 1)));
  }, [groups.length]);

  useEffect(() => {
    if (groups.length === 0 && canAddVitals) {
      setAdding(true);
    }
  }, [groups.length, canAddVitals]);

  const current = groups[index];
  const draftAnthropometrics = useMemo(
    () =>
      calculateAnthropometrics(
        draft.filter((item) => !!item.value.trim()),
        patientAge,
      ),
    [draft, patientAge],
  );
  const currentAnthropometrics = useMemo(
    () => calculateAnthropometrics(current?.measurements || [], patientAge),
    [current?.measurements, patientAge],
  );
  const isPediatric = patientAge != null && patientAge < 15;

  return (
    <div className="flex flex-col bg-background text-foreground text-xs sm:text-sm">
      {/* Header — clean centered/justified layout without pin/close buttons */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/70 bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <HeartPulse className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-foreground">
              Vital Signs & MEWS
            </h3>
            {groups.length > 0 && (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 font-mono">
                {groups.length} {groups.length === 1 ? "record" : "records"}
              </Badge>
            )}
          </div>
        </div>
        {canAddVitals && onAddVitals && !adding && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 px-2 text-[11px] gap-1 rounded-md"
            onClick={() => setAdding(true)}
          >
            <Plus className="h-3 w-3" />
            <span>Record</span>
          </Button>
        )}
      </div>

      {/* Body — space-optimized */}
      <div className="p-2.5 sm:p-3 space-y-2.5 overflow-y-auto max-h-[70vh]">
        {/* Record Vitals form */}
        {adding && canAddVitals && onAddVitals && (
          <div className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center justify-between pb-1 border-b border-primary/15">
              <span className="text-xs font-bold text-foreground">Record New Vitals</span>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="text-[11px] text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>

            {draft.some((item) => !!item.value.trim()) && (
              <VitalSignsMewsBanner
                measurements={draft.filter((item) => !!item.value.trim())}
                patientAge={patientAge}
                compact
              />
            )}

            <div className="grid grid-cols-[1.3fr_1fr_0.65fr] gap-1.5 border-b pb-1 text-[10px] font-semibold uppercase text-muted-foreground">
              <span>Measurement</span>
              <span>Value</span>
              <span>Unit</span>
            </div>

            <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {draft.map((item) => (
                <div key={item.id} className="space-y-1 rounded-md bg-background/80 p-1.5 border border-border/40">
                  <div className="grid grid-cols-[1.3fr_1fr_0.65fr_auto] items-center gap-1.5">
                    {(["measurementName", "value", "unit"] as const).map((field) => {
                      const editable = field === "value" || editingCell === `${item.id}:${field}`;
                      return editable ? (
                        <Input
                          key={field}
                          autoFocus={field === "value"}
                          value={item[field]}
                          className="h-7 text-xs px-2"
                          onBlur={() => field !== "value" && setEditingCell(null)}
                          onChange={(event) =>
                            setDraft((current) =>
                              current.map((row) =>
                                row.id === item.id ? { ...row, [field]: event.target.value } : row
                              )
                            )
                          }
                        />
                      ) : (
                        <button
                          key={field}
                          type="button"
                          className="h-7 rounded-md px-2 text-left text-xs text-muted-foreground hover:bg-muted truncate"
                          onDoubleClick={() => setEditingCell(`${item.id}:${field}`)}
                        >
                          {item[field] || "Edit"}
                        </button>
                      );
                    })}
                    {!item.isPreset && (
                      <button
                        type="button"
                        className="flex h-5 w-5 items-center justify-center rounded-full text-red-500 hover:bg-red-500/10"
                        title="Remove"
                        onClick={() => setDraft((current) => current.filter((row) => row.id !== item.id))}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  {item.value.trim() && (
                    <div className="pt-0.5">
                      <VitalSignAlertBadge
                        measurementName={item.measurementName}
                        value={item.value}
                        patientAge={patientAge}
                        compact
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              size="sm"
              className="h-8 w-full mt-2"
              disabled={saving || draft.every((item) => !item.value.trim())}
              onClick={async () => {
                setSaving(true);
                const ok = await onAddVitals(
                  draft
                    .filter((item) => item.value.trim())
                    .map(({ measurementName, value, unit }) => ({
                      measurementName,
                      value,
                      unit,
                    }))
                );
                setSaving(false);
                if (ok) {
                  setAdding(false);
                  setDraft(defaultDraft());
                }
              }}
            >
              {saving ? "Saving…" : "Save Vital Signs"}
            </Button>
          </div>
        )}

        {/* Existing Vitals List */}
        {groups.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
            <HeartPulse className="h-6 w-6 mx-auto mb-1.5 opacity-40" />
            <p>No vital signs recorded for this visit yet.</p>
          </div>
        ) : (
          <>
            {/* Timestamp & pagination header */}
            <div className="flex items-center justify-between gap-2 pb-1 border-b border-border/50 text-xs">
              <div className="min-w-0">
                <span className="font-semibold text-foreground truncate block">
                  {current?.createdAt && current.createdAt !== "unknown"
                    ? new Date(current.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Latest record"}
                </span>
                {current?.addedBy && (
                  <span className="text-[10px] text-muted-foreground">
                    by {current.addedBy.firstName || ""} {current.addedBy.lastName || ""}
                  </span>
                )}
              </div>
              {groups.length > 1 && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIndex((i) => Math.max(0, i - 1))}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30"
                    disabled={index === 0}
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {index + 1}/{groups.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIndex((i) => Math.min(groups.length - 1, i + 1))}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30"
                    disabled={index === groups.length - 1}
                    aria-label="Next"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* MEWS Risk Banner */}
            {current?.measurements && current.measurements.length > 0 && (
              <VitalSignsMewsBanner
                measurements={current.measurements}
                patientAge={patientAge}
              />
            )}

            {/* Anthropometrics summary */}
            {(currentAnthropometrics.bmi != null || (isPediatric && currentAnthropometrics.weightKg != null)) && (
              <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-3 py-2 text-xs flex items-center justify-between gap-2 flex-wrap">
                {currentAnthropometrics.bmi != null && (
                  <span className="font-semibold text-foreground">
                    BMI: {currentAnthropometrics.bmi} kg/m² ({currentAnthropometrics.bmiLabel || "Normal"})
                  </span>
                )}
                {currentAnthropometrics.bsaM2 != null && (
                  <span className="text-muted-foreground text-[11px]">
                    BSA: {currentAnthropometrics.bsaM2} m²
                  </span>
                )}
              </div>
            )}

            {/* Measurements Grid */}
            <div className="grid grid-cols-2 gap-2">
              {current?.measurements?.map((m: any) => (
                <div
                  key={m.id || m.measurementName}
                  className="p-2 rounded-xl border border-border/60 bg-card/70 space-y-1"
                >
                  <span className="text-[10px] font-semibold text-muted-foreground block uppercase tracking-wider truncate">
                    {m.measurementName}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-foreground">{m.value}</span>
                    {m.unit && <span className="text-[10px] text-muted-foreground">{m.unit}</span>}
                  </div>
                  <VitalSignAlertBadge
                    measurementName={m.measurementName}
                    value={m.value}
                    patientAge={patientAge}
                    compact
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
