"use client";

import { useEffect, useMemo, useState } from "react";
import {
  User,
  HeartPulse,
  History as HistoryIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Pin,
} from "lucide-react";
import { formatDateOnly } from "@/lib/utils";
import type { Patient } from "@/lib/types";
import { PatientInsuranceBadge } from "@/components/patient-insurance-badge";
import { normalizeVisitVitalSigns } from "@/hooks/auth-hooks";
import { calculateAge } from "@/lib/validation-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VitalSignAlertBadge } from "@/components/vital-signs/vital-sign-alert-badge";
import { VitalSignsMewsBanner } from "@/components/vital-signs/vital-signs-mews-banner";
import { calculateAnthropometrics } from "@/lib/mews-utils";

interface PanelState {
  pinned: boolean;
  hover: boolean;
}

function VitalsPanel({
  vitals,
  slotStyle,
  pinned,
  canAddVitals,
  onAddVitals,
  onTogglePin,
  onClose,
  patientAge,
}: {
  vitals: any[];
  slotStyle: any;
  pinned: boolean;
  canAddVitals: boolean;
  onAddVitals?: (vitals: Array<{ measurementName: string; value: string; unit: string }>) => Promise<boolean>;
  onTogglePin?: () => void;
  onClose?: () => void;
  patientAge?: number | null;
}) {
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
    <div
      className="fixed z-50 lg:z-40 inset-x-3 top-20 mx-auto w-auto max-w-md lg:inset-x-auto lg:mx-0 lg:w-72 xl:w-80 max-h-[calc(100dvh-6.5rem)] overflow-y-auto overscroll-contain bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-2xl transition-all duration-200"
      style={slotStyle}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2.5 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm font-semibold">Vital Signs</p>
          {pinned && (
            <span className="hidden lg:inline-block text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
              Pinned
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onTogglePin && (
            <button
              type="button"
              onClick={onTogglePin}
              className={`hidden lg:inline-flex p-1 rounded-md transition-colors ${
                pinned
                  ? "text-primary hover:bg-primary/10"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              title={pinned ? "Unpin card" : "Pin card"}
              aria-label={pinned ? "Unpin card" : "Pin card"}
            >
              <Pin className={`w-3.5 h-3.5 ${pinned ? "fill-current" : ""}`} />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Close vital signs"
              aria-label="Close vital signs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="p-3">
        {adding && canAddVitals && onAddVitals && (
          <div className="mb-3 space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-2">
            {draft.some((item) => !!item.value.trim()) && (
              <VitalSignsMewsBanner
                measurements={draft.filter((item) => !!item.value.trim())}
                patientAge={patientAge}
                compact
                className="mb-2"
              />
            )}
            {(draftAnthropometrics.bmi != null || (isPediatric && draftAnthropometrics.weightKg != null)) && (
              <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5 rounded-lg border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-1.5 text-xs">
                {draftAnthropometrics.bmi != null ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-foreground">
                      BMI: {draftAnthropometrics.bmi} kg/m²
                    </span>
                    {draftAnthropometrics.bmiLabel && (
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${draftAnthropometrics.bmiBadgeClassName}`}
                      >
                        {draftAnthropometrics.bmiLabel}
                      </span>
                    )}
                    {draftAnthropometrics.bsaM2 != null && (
                      <span className="text-[11px] text-muted-foreground">
                        • BSA: {draftAnthropometrics.bsaM2} m²
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="font-medium text-indigo-700 dark:text-indigo-300">
                    Pediatric Dosing Weight: {draftAnthropometrics.weightKg} kg
                  </span>
                )}
              </div>
            )}
            <div className="grid grid-cols-[1.3fr_1fr_0.65fr] gap-1.5 border-b pb-1 text-[10px] font-semibold uppercase text-muted-foreground">
              <span>Measurement</span><span>Value</span><span>Unit</span>
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {draft.map((item) => (
              <div key={item.id} className="space-y-1 rounded-md bg-background/50 p-1.5 border border-border/40">
                <div className="grid grid-cols-[1.3fr_1fr_0.65fr_auto] items-center gap-1.5">
                  {(["measurementName", "value", "unit"] as const).map((field) => {
                    const editable = field === "value" || editingCell === `${item.id}:${field}`;
                    return editable ? (
                      <Input key={field} autoFocus value={item[field]} className="h-8 text-xs"
                        onBlur={() => field !== "value" && setEditingCell(null)}
                        onChange={(event) => setDraft((current) => current.map((row) =>
                          row.id === item.id ? { ...row, [field]: event.target.value } : row,
                        ))} />
                    ) : (
                      <button key={field} type="button"
                        className="h-8 rounded-md px-2 text-left text-xs text-muted-foreground hover:bg-muted"
                        onDoubleClick={() => setEditingCell(`${item.id}:${field}`)}>
                        {item[field] || "Double-click to edit"}
                      </button>
                    );
                  })}
                  {!item.isPreset && (
                    <button
                      type="button"
                      className="flex h-6 w-6 items-center justify-center rounded-full text-red-500 hover:bg-red-500/10"
                      title="Remove measurement"
                      aria-label={`Remove ${item.measurementName}`}
                      onClick={() => setDraft((current) => current.filter((row) => row.id !== item.id))}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {item.value.trim() && (
                  <div className="pt-0.5">
                    <VitalSignAlertBadge
                      measurementName={item.measurementName}
                      value={item.value}
                      patientAge={patientAge}
                    />
                  </div>
                )}
              </div>
            ))}
            </div>
            <button
              type="button"
              className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-primary/40 text-primary transition-colors hover:bg-primary/10"
              title="Add custom measurement"
              aria-label="Add custom measurement"
              onClick={() => setDraft((current) => [...current, {
                id: `custom-${Date.now()}`, measurementName: "Custom measurement", value: "", unit: "", isPreset: false,
              }])}>
              <Plus className="h-3.5 w-3.5" />
            </button>
            <Button type="button" size="sm" className="h-8 w-full"
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
                    })),
                );
                setSaving(false);
                if (ok) {
                  setAdding(false);
                  setDraft(defaultDraft);
                }
              }}>
              {saving ? "Saving…" : "Save vital signs"}
            </Button>
          </div>
        )}
        {groups.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No vitals recorded
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0 text-xs text-muted-foreground">
                <div className="truncate font-medium text-foreground">
                  {current?.createdAt && current.createdAt !== "unknown"
                    ? `Recorded ${new Date(current.createdAt).toLocaleString()}`
                    : "Recorded"}
                  {current?.addedBy
                    ? ` • ${current.addedBy.firstName || ""} ${current.addedBy.lastName || ""}`
                    : ""}
                </div>
              </div>
              {groups.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIndex((i) => Math.max(0, i - 1))}
                    className="p-1 rounded hover:bg-muted/40"
                    disabled={index === 0}
                    aria-label="Previous vitals"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setIndex((i) => Math.min(groups.length - 1, i + 1))
                    }
                    className="p-1 rounded hover:bg-muted/40"
                    disabled={index === groups.length - 1}
                    aria-label="Next vitals"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* MEWS & Early Warning Alerts */}
            {current?.measurements && current.measurements.length > 0 && (
              <VitalSignsMewsBanner
                measurements={current.measurements}
                patientAge={patientAge}
                className="mb-2.5"
              />
            )}

            {/* Auto-calculated BMI, BSA & Pediatric Weight summary */}
            {(currentAnthropometrics.bmi != null || (isPediatric && currentAnthropometrics.weightKg != null)) && (
              <div className="mb-2.5 rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-3 py-2 text-xs">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {currentAnthropometrics.bmi != null ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-foreground">
                        BMI: {currentAnthropometrics.bmi} kg/m²
                      </span>
                      {currentAnthropometrics.bmiLabel && (
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${currentAnthropometrics.bmiBadgeClassName}`}
                        >
                          {currentAnthropometrics.bmiLabel}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                      Pediatric Weight: {currentAnthropometrics.weightKg} kg
                    </span>
                  )}
                  {currentAnthropometrics.bsaM2 != null && (
                    <span
                      className="text-[11px] font-medium text-muted-foreground"
                      title="Body Surface Area (Mosteller formula)"
                    >
                      BSA: {currentAnthropometrics.bsaM2} m²
                    </span>
                  )}
                </div>
                {isPediatric && currentAnthropometrics.weightKg != null && currentAnthropometrics.bmi != null && (
                  <div className="mt-1 pt-1 border-t border-indigo-500/20 text-[11px] text-indigo-800 dark:text-indigo-200 font-medium">
                    👶 Pediatric Dosing Weight: <span className="font-bold">{currentAnthropometrics.weightKg} kg</span> ({patientAge} {patientAge === 1 ? "yr" : "yrs"})
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              {current.measurements.map((v: any) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between gap-2.5 rounded-2xl border border-border/60 bg-muted/20 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="truncate text-sm font-medium text-foreground">
                        {v.measurementName}
                      </span>
                      <VitalSignAlertBadge
                        measurementName={v.measurementName}
                        value={v.value}
                        patientAge={patientAge}
                      />
                    </div>
                  </div>
                  <div className="whitespace-nowrap text-right text-lg font-bold text-indigo-700 dark:text-indigo-300">
                    {v.value}{" "}
                    <span className="text-sm font-medium text-muted-foreground">
                      {v.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface ConsultationSidePanelsProps {
  patient: Patient;
  idPanel: PanelState;
  vitalsPanel: PanelState;
  historyPanel: PanelState;
  setIdPanel: (state: PanelState) => void;
  setVitalsPanel: (state: PanelState) => void;
  setHistoryPanel: (state: PanelState) => void;
  onOpenHistory?: () => void;
  canAddVitals?: boolean;
  onAddVitals?: (vitals: Array<{ measurementName: string; value: string; unit: string }>) => Promise<boolean>;
  vitals?: any[];
  visitInsurances?: Array<{
    id: string;
    insuranceProvider: { acronym?: string | null; insuranceName?: string | null; name?: string | null };
    insuranceCardNumber?: string | null;
    providingCompanyOrEmployer?: string | null;
    principalMember?: boolean;
    principalMemberName?: string | null;
    deactivated?: boolean;
    validFrom?: string | null;
    validUntil?: string | null;
  }>;
}

export function ConsultationSidePanels({
  patient,
  idPanel,
  vitalsPanel,
  historyPanel,
  setIdPanel,
  setVitalsPanel,
  setHistoryPanel,
  onOpenHistory,
  vitals = [],
  visitInsurances = [],
  canAddVitals = false,
  onAddVitals,
}: ConsultationSidePanelsProps) {
  const hasVitals = Array.isArray(vitals) && vitals.length > 0;
  const activePanels = [
    { key: "id", active: idPanel.pinned || idPanel.hover },
    { key: "vitals", active: vitalsPanel.pinned || vitalsPanel.hover },
    { key: "history", active: historyPanel.pinned || historyPanel.hover },
  ].filter((p) => p.active);

  const getPanelSlot = (
    panelKey: string,
  ): "single" | "upper" | "lower" | "middle" => {
    if (activePanels.length === 0) return "single";
    if (activePanels.length === 1) return "single";
    if (activePanels.length === 2) {
      const panelIndex = activePanels.findIndex((p) => p.key === panelKey);
      return panelIndex === 0 ? "upper" : "lower";
    }
    const panelIndex = activePanels.findIndex((p) => p.key === panelKey);
    return panelIndex === 0 ? "upper" : panelIndex === 1 ? "middle" : "lower";
  };

  const [isDesktopViewport, setIsDesktopViewport] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktopViewport(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const canHoverPreview = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1280px) and (hover: hover)").matches;

  const getPositionStyle = (
    slot: "single" | "upper" | "lower" | "middle",
    count: number,
  ) => {
    if (!isDesktopViewport) {
      return undefined;
    }
    const base = { left: "3.25rem", transform: "translateY(-50%)" };
    if (count <= 1) return { ...base, top: "50%" };
    if (count === 2) {
      return slot === "upper"
        ? { ...base, top: "30%" }
        : { ...base, top: "70%" };
    }
    if (slot === "upper") return { ...base, top: "25%" };
    if (slot === "middle") return { ...base, top: "50%" };
    return { ...base, top: "75%" };
  };

  const closeAllPanels = () => {
    setIdPanel({ pinned: false, hover: false });
    setVitalsPanel({ pinned: false, hover: false });
    setHistoryPanel({ pinned: false, hover: false });
  };

  const handlePanelClick = (panelKey: "id" | "vitals" | "history") => {
    if (panelKey === "id") {
      const nextPinned = !idPanel.pinned;
      setIdPanel({ pinned: nextPinned, hover: false });
      if (!isDesktopViewport && nextPinned) {
        setVitalsPanel({ pinned: false, hover: false });
        setHistoryPanel({ pinned: false, hover: false });
      }
    } else if (panelKey === "vitals") {
      const nextPinned = !vitalsPanel.pinned;
      setVitalsPanel({
        pinned: nextPinned,
        hover: false,
      });
      if (!isDesktopViewport && nextPinned) {
        setIdPanel({ pinned: false, hover: false });
        setHistoryPanel({ pinned: false, hover: false });
      }
    } else if (panelKey === "history") {
      if (onOpenHistory) {
        onOpenHistory();
        return;
      }
      const nextPinned = !historyPanel.pinned;
      setHistoryPanel({
        pinned: nextPinned,
        hover: false,
      });
      if (!isDesktopViewport && nextPinned) {
        setIdPanel({ pinned: false, hover: false });
        setVitalsPanel({ pinned: false, hover: false });
      }
    }
  };

  const showIdPanel = idPanel.pinned || idPanel.hover;
  const showVitalsPanel = vitalsPanel.pinned || vitalsPanel.hover;
  const showHistoryPanel = historyPanel.pinned || historyPanel.hover;

  const patientFullName = useMemo(() => {
    const parts = [patient.firstName, patient.middleName, patient.lastName]
      .filter(Boolean)
      .map((s) => String(s).trim())
      .filter(Boolean);
    const fromParts = parts.join(" ");
    if (patient.fullName && patient.fullName.trim()) {
      const trimmedFull = patient.fullName.trim();
      if (trimmedFull.split(/\s+/).length > parts.length) {
        return trimmedFull;
      }
    }
    return fromParts || patient.fullName?.trim() || "Patient";
  }, [patient.firstName, patient.middleName, patient.lastName, patient.fullName]);

  const patientAge = useMemo(() => {
    if (patient.age != null && !Number.isNaN(Number(patient.age))) {
      return Number(patient.age);
    }
    if (patient.dateOfBirth) {
      const calculated = calculateAge(patient.dateOfBirth);
      if (!Number.isNaN(calculated)) {
        return calculated;
      }
    }
    return null;
  }, [patient.age, patient.dateOfBirth]);

  const ageText = useMemo(() => {
    if (patientAge == null) return null;
    if (patientAge === 0) return "< 1 yr";
    return `${patientAge} ${patientAge === 1 ? "yr" : "yrs"}`;
  }, [patientAge]);

  return (
    <>
      {/* Mobile/Tablet backdrop to dismiss open floating panel */}
      {(showIdPanel || showVitalsPanel || (!onOpenHistory && showHistoryPanel)) && (
        <div
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] lg:hidden"
          onClick={closeAllPanels}
          aria-hidden="true"
        />
      )}

      {/* Left vertical pill with compact quick panel buttons (desktop lg+) */}
      <div className="hidden lg:flex fixed left-2.5 xl:left-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-1.5 bg-card/85 backdrop-blur-md border border-border/60 rounded-full p-1 shadow-lg">
        <button
          title="Identification"
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            idPanel.pinned
              ? "bg-primary/15 text-primary ring-1 ring-primary/40"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          onMouseEnter={() => {
            if (canHoverPreview()) {
              setIdPanel({ ...idPanel, hover: !idPanel.pinned });
            }
          }}
          onMouseLeave={() => setIdPanel({ ...idPanel, hover: false })}
          onClick={() => handlePanelClick("id")}
        >
          <User className="w-4 h-4" />
        </button>
        <button
          title={hasVitals ? "Vital Signs (Alt+V)" : "Add vital signs (Alt+V)"}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            vitalsPanel.pinned
              ? "bg-primary/15 text-primary ring-1 ring-primary/40"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          onMouseEnter={() => {
            if (canHoverPreview()) {
              setVitalsPanel({ ...vitalsPanel, hover: !vitalsPanel.pinned });
            }
          }}
          onMouseLeave={() =>
            setVitalsPanel({ ...vitalsPanel, hover: false })
          }
          onClick={() => {
            handlePanelClick("vitals");
          }}
        >
          {hasVitals ? (
            <HeartPulse className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
        <button
          title="History"
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            historyPanel.pinned
              ? "bg-primary/15 text-primary ring-1 ring-primary/40"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          onMouseEnter={() => {
            if (canHoverPreview()) {
              setHistoryPanel({ ...historyPanel, hover: !historyPanel.pinned });
            }
          }}
          onMouseLeave={() =>
            setHistoryPanel({ ...historyPanel, hover: false })
          }
          onClick={() => handlePanelClick("history")}
        >
          <HistoryIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Identification Panel */}
      {showIdPanel && (
        <div
          className="fixed z-50 lg:z-40 inset-x-3 top-20 mx-auto w-auto max-w-md lg:inset-x-auto lg:mx-0 lg:w-72 xl:w-80 max-h-[calc(100dvh-6.5rem)] overflow-y-auto overscroll-contain bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-2xl transition-all duration-200"
          style={
            getPositionStyle(getPanelSlot("id"), activePanels.length) as any
          }
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2.5 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-2">
              <p className="text-xs sm:text-sm font-semibold">Identification</p>
              {idPanel.pinned && (
                <span className="hidden lg:inline-block text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                  Pinned
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handlePanelClick("id")}
                className={`hidden lg:inline-flex p-1 rounded-md transition-colors ${
                  idPanel.pinned
                    ? "text-primary hover:bg-primary/10"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                title={idPanel.pinned ? "Unpin card" : "Pin card"}
                aria-label={idPanel.pinned ? "Unpin card" : "Pin card"}
              >
                <Pin className={`w-3.5 h-3.5 ${idPanel.pinned ? "fill-current" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => setIdPanel({ pinned: false, hover: false })}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Close identification"
                aria-label="Close identification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="p-3.5 space-y-1.5 text-xs sm:text-sm">
            <div className="font-semibold text-foreground text-sm sm:text-base leading-tight">
              {patientFullName}
            </div>
            {patient.patientIdentifier && (
              <div className="text-muted-foreground">
                ID: {patient.patientIdentifier}
              </div>
            )}
            <div className="text-muted-foreground">
              DOB: {patient.dateOfBirth ? formatDateOnly(patient.dateOfBirth) : "N/A"}
              {ageText && (
                <span className="ml-1.5 text-foreground/80 font-medium">
                  ({ageText})
                </span>
              )}
            </div>
            <div className="text-muted-foreground">
              Gender: {patient.gender}
            </div>
            {patient.primaryPhoneNumber && (
              <div className="text-muted-foreground">
                Phone: {patient.primaryPhoneNumber}
              </div>
            )}
            <div className="pt-2 border-t border-border/40">
              {visitInsurances && visitInsurances.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-foreground uppercase tracking-wide">
                    Insurance
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {visitInsurances.map((ins) => {
                      return (
                        <PatientInsuranceBadge
                          key={ins.id}
                          insurance={ins}
                          compact
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-xs font-medium text-muted-foreground">
                  <span className="inline-block bg-muted/40 px-2 py-1 rounded-full">
                    Private
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showVitalsPanel && (
        <VitalsPanel
          vitals={vitals}
          slotStyle={
            getPositionStyle(getPanelSlot("vitals"), activePanels.length) as any
          }
          pinned={vitalsPanel.pinned}
          canAddVitals={canAddVitals}
          onAddVitals={onAddVitals}
          onTogglePin={() => handlePanelClick("vitals")}
          onClose={() => setVitalsPanel({ pinned: false, hover: false })}
          patientAge={patientAge}
        />
      )}

      {/* History Panel */}
      {!onOpenHistory && showHistoryPanel && (
        <div
          className="fixed z-50 lg:z-40 inset-x-3 top-20 mx-auto w-auto max-w-md lg:inset-x-auto lg:mx-0 lg:w-72 xl:w-80 max-h-[calc(100dvh-6.5rem)] overflow-y-auto overscroll-contain bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-2xl transition-all duration-200"
          style={
            getPositionStyle(
              getPanelSlot("history"),
              activePanels.length,
            ) as any
          }
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2.5 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-2">
              <p className="text-xs sm:text-sm font-semibold">History</p>
              {historyPanel.pinned && (
                <span className="hidden lg:inline-block text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                  Pinned
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handlePanelClick("history")}
                className={`hidden lg:inline-flex p-1 rounded-md transition-colors ${
                  historyPanel.pinned
                    ? "text-primary hover:bg-primary/10"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                title={historyPanel.pinned ? "Unpin card" : "Pin card"}
                aria-label={historyPanel.pinned ? "Unpin card" : "Pin card"}
              >
                <Pin className={`w-3.5 h-3.5 ${historyPanel.pinned ? "fill-current" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => setHistoryPanel({ pinned: false, hover: false })}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Close history"
                aria-label="Close history"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Allergies</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Fluoroquinolones (rash)</li>
                <li>Penicillin (hives)</li>
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Past Medical History</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hypertension (I10)</li>
                <li>Type 2 Diabetes (E11)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
