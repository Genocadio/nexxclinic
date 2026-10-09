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
} from "lucide-react";
import { formatDateOnly } from "@/lib/utils";
import type { Patient } from "@/lib/types";
import { PatientInsuranceBadge } from "@/components/patient-insurance-badge";
import { normalizeVisitVitalSigns } from "@/hooks/auth-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
}: {
  vitals: any[];
  slotStyle: any;
  pinned: boolean;
  canAddVitals: boolean;
  onAddVitals?: (vitals: Array<{ measurementName: string; value: string; unit: string }>) => Promise<boolean>;
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

  return (
    <div
      className="fixed z-40 w-80 bg-background border border-border rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
      style={slotStyle}
    >
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">Vital Signs</p>
          {pinned && <span className="text-xs bg-white/30 px-2 py-1 rounded">Pinned</span>}
        </div>
      </div>
      <div className="p-3">
        {adding && canAddVitals && onAddVitals && (
          <div className="mb-3 space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-2">
            <div className="grid grid-cols-[1.3fr_1fr_0.65fr] gap-1.5 border-b pb-1 text-[10px] font-semibold uppercase text-muted-foreground">
              <span>Measurement</span><span>Value</span><span>Unit</span>
            </div>
            <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {draft.map((item) => (
              <div key={item.id} className="grid grid-cols-[1.3fr_1fr_0.65fr_auto] items-center gap-1.5">
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

            <div className="space-y-2">
              {current.measurements.map((v: any) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">
                      {v.measurementName}
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

  const getPositionStyle = (
    slot: "single" | "upper" | "lower" | "middle",
    count: number,
  ) => {
    const base = { left: "5rem", transform: "translateY(-50%)" };
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

  const handlePanelClick = (panelKey: "id" | "vitals" | "history") => {
    if (panelKey === "id") {
      setIdPanel({ ...idPanel, pinned: !idPanel.pinned, hover: false });
    } else if (panelKey === "vitals") {
      setVitalsPanel({
        ...vitalsPanel,
        pinned: !vitalsPanel.pinned,
        hover: false,
      });
    } else if (panelKey === "history") {
      if (onOpenHistory) {
        onOpenHistory();
        return;
      }
      setHistoryPanel({
        ...historyPanel,
        pinned: !historyPanel.pinned,
        hover: false,
      });
    }
  };

  const showIdPanel = idPanel.pinned || idPanel.hover;
  const showVitalsPanel = vitalsPanel.pinned || vitalsPanel.hover;
  const showHistoryPanel = historyPanel.pinned || historyPanel.hover;

  return (
    <>
      {/* Left vertical pill with quick panel buttons */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 bg-card/60 backdrop-blur-xl border border-border/50 rounded-full p-2 shadow-2xl">
        <button
          title="Identification"
          className={`p-2 rounded-full transition-colors ${idPanel.pinned ? "bg-white/40 ring-2 ring-white/60" : "hover:bg-muted"}`}
          onMouseEnter={() =>
            setIdPanel({ ...idPanel, hover: !idPanel.pinned })
          }
          onMouseLeave={() => setIdPanel({ ...idPanel, hover: false })}
          onClick={() => handlePanelClick("id")}
        >
          <User
            className={`w-5 h-5 ${idPanel.pinned ? "text-foreground" : "text-muted-foreground"}`}
          />
        </button>
        <button
          title={hasVitals ? "Vital Signs" : "Add vital signs"}
          className={`p-2 rounded-full transition-colors ${
            vitalsPanel.pinned
              ? "bg-white/40 ring-2 ring-white/60"
              : "hover:bg-muted"
          }`}
          onMouseEnter={() =>
            setVitalsPanel({ ...vitalsPanel, hover: !vitalsPanel.pinned })
          }
          onMouseLeave={() =>
            setVitalsPanel({ ...vitalsPanel, hover: false })
          }
          onClick={() => {
            handlePanelClick("vitals");
          }}
        >
          {hasVitals ? <HeartPulse
            className={`w-5 h-5 ${vitalsPanel.pinned ? "text-foreground" : "text-muted-foreground"}`}
          />
          : <Plus className="w-5 h-5 text-muted-foreground" />}
        </button>
        <button
          title="History"
          className={`p-2 rounded-full transition-colors ${historyPanel.pinned ? "bg-white/40 ring-2 ring-white/60" : "hover:bg-muted"}`}
          onMouseEnter={() =>
            setHistoryPanel({ ...historyPanel, hover: !historyPanel.pinned })
          }
          onMouseLeave={() =>
            setHistoryPanel({ ...historyPanel, hover: false })
          }
          onClick={() => handlePanelClick("history")}
        >
          <HistoryIcon
            className={`w-5 h-5 ${historyPanel.pinned ? "text-foreground" : "text-muted-foreground"}`}
          />
        </button>
      </div>

      {/* Identification Panel */}
      {showIdPanel && (
        <div
          className="fixed z-40 w-80 bg-background border border-border rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
          style={
            getPositionStyle(getPanelSlot("id"), activePanels.length) as any
          }
        >
          <div className="flex items-center justify-between p-3 border-b border-border">
            <p className="text-sm font-semibold">Identification</p>
            {idPanel.pinned && (
              <span className="text-xs bg-white/30 px-2 py-1 rounded">
                Pinned
              </span>
            )}
          </div>
          <div className="p-4 space-y-2 text-sm">
            <div className="font-medium text-foreground">
              {patient.firstName} {patient.lastName}
            </div>
            {patient.patientIdentifier && (
              <div className="text-muted-foreground">
                ID: {patient.patientIdentifier}
              </div>
            )}
            <div className="text-muted-foreground">
              DOB: {formatDateOnly(patient.dateOfBirth)}
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
                  <div className="text-xs font-semibold text-foreground uppercase tracking-wide">
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
        />
      )}

      {/* History Panel */}
      {!onOpenHistory && showHistoryPanel && (
        <div
          className="fixed z-40 w-96 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
          style={
            getPositionStyle(
              getPanelSlot("history"),
              activePanels.length,
            ) as any
          }
        >
          <div className="flex items-center justify-between p-3 border-b border-border">
            <p className="text-sm font-semibold">History</p>
            {historyPanel.pinned && (
              <span className="text-xs bg-white/30 px-2 py-1 rounded">
                Pinned
              </span>
            )}
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
