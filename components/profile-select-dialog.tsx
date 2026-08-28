"use client";

import { useState } from "react";
import { X, Stethoscope, Check, Building2, BedDouble, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DepartmentProfile } from "@/lib/api-types";

const ENCOUNTER_ICONS: Record<string, typeof Stethoscope> = {
  OUTPATIENT: Stethoscope,
  INPATIENT_OBSERVATION: Building2,
  INPATIENT_ADMISSION: BedDouble,
  FOLLOWUP: RotateCcw,
};

const ENCOUNTER_LABELS: Record<string, string> = {
  OUTPATIENT: "Outpatient",
  INPATIENT_OBSERVATION: "Inpatient Observation",
  INPATIENT_ADMISSION: "Inpatient Admission",
  FOLLOWUP: "Follow-up",
};

interface ProfileSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (profile: DepartmentProfile) => void;
  patientName: string;
  profiles: DepartmentProfile[];
  loading?: boolean;
}

export function ProfileSelectDialog({
  open,
  onClose,
  onSelect,
  patientName,
  profiles,
  loading = false,
}: ProfileSelectDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!open || profiles.length === 0) return null;

  const selected = profiles.find((p) => p.id === selectedId);

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Select Profile
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Choose a profile for{" "}
            <span className="font-medium">{patientName}</span> before starting
            the consultation.
          </p>

          <div className="space-y-2">
            {profiles.map((profile) => {
              const et = profile.encounterType || "OUTPATIENT";
              const Icon = ENCOUNTER_ICONS[et] || Stethoscope;
              const isSelected = selectedId === profile.id;
              return (
                <button
                  key={profile.id}
                  type="button"
                  disabled={loading}
                  onClick={() => setSelectedId(profile.id)}
                  className={`w-full flex items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border hover:bg-muted"
                  } ${loading ? "opacity-60" : ""}`}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{profile.name}</p>
                      {profile.isDefault && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {ENCOUNTER_LABELS[et] || et}
                    </p>
                    {profile.products && profile.products.length > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {profile.products.length} product{profile.products.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={!selected || loading}
            >
              <Stethoscope className="h-4 w-4 mr-1" />
              {loading ? "Starting..." : "Start Consult"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
