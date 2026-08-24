"use client";

import { useState } from "react";
import { X, Stethoscope, Building2, BedDouble, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EncounterType } from "@/lib/api-types";

interface EncounterTypeSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (encounterType: EncounterType) => void;
  patientName: string;
  loading?: boolean;
}

const ENCOUNTER_TYPE_OPTIONS: {
  value: EncounterType;
  label: string;
  description: string;
  icon: typeof Stethoscope;
}[] = [
  {
    value: EncounterType.OUTPATIENT,
    label: "Outpatient",
    description: "Patient visits without admission",
    icon: Stethoscope,
  },
  {
    value: EncounterType.INPATIENT_OBSERVATION,
    label: "Inpatient Observation",
    description: "Patient admitted for observation",
    icon: Building2,
  },
  {
    value: EncounterType.INPATIENT_ADMISSION,
    label: "Inpatient Admission",
    description: "Patient admitted for treatment",
    icon: BedDouble,
  },
  {
    value: EncounterType.FOLLOWUP,
    label: "Follow-up",
    description: "Follow-up visit for ongoing care",
    icon: RotateCcw,
  },
];

export function EncounterTypeSelectDialog({
  open,
  onClose,
  onSelect,
  patientName,
  loading = false,
}: EncounterTypeSelectDialogProps) {
  const [selected, setSelected] = useState<EncounterType | null>(null);

  if (!open) return null;

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
            Select Encounter Type
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
            Choose the encounter type for{" "}
            <span className="font-medium">{patientName}</span> before starting
            the consultation.
          </p>

          <div className="space-y-2">
            {ENCOUNTER_TYPE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = selected === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={loading}
                  onClick={() => setSelected(option.value)}
                  className={`w-full flex items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border hover:bg-muted"
                  } ${loading ? "opacity-60" : ""}`}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isSelected
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
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
