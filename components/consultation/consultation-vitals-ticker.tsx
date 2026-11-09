"use client";

import { useState, useMemo, useEffect } from "react";
import { HeartPulse, AlertTriangle, AlertCircle, ChevronDown, Pin } from "lucide-react";
import { normalizeVisitVitalSigns } from "@/hooks/visits/vital-signs";
import { evaluateVitalSignAlert } from "@/lib/mews-utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { VitalsDropdownContent } from "@/components/consultation/consultation-top-dropdowns";
import { useHoverPin } from "@/hooks/use-hover-pin";
import { cn } from "@/lib/utils";

interface ConsultationVitalsTickerProps {
  vitals: any[];
  canAddVitals: boolean;
  onAddVitals?: (vitals: Array<{ measurementName: string; value: string; unit: string }>) => Promise<boolean>;
  patientAge?: number | null;
  hoverPin?: ReturnType<typeof useHoverPin>;
}

export function ConsultationVitalsTicker({
  vitals,
  canAddVitals,
  onAddVitals,
  patientAge,
  hoverPin: externalHoverPin,
}: ConsultationVitalsTickerProps) {
  const internalHoverPin = useHoverPin({ graceMs: 180 });
  const hoverPin = externalHoverPin || internalHoverPin;
  const {
    isOpen,
    isPinned,
    onMouseEnter,
    onMouseLeave,
    togglePin,
    close,
  } = hoverPin;

  const groups = useMemo(() => normalizeVisitVitalSigns(vitals || []), [vitals]);
  const latestGroup = groups[0];

  const measurements = useMemo(() => {
    return (latestGroup?.measurements || []).filter(
      (m) => m.value && String(m.value).trim().length > 0
    );
  }, [latestGroup]);

  // Rotate between recorded vitals every 5 seconds
  const [activeVitalIndex, setActiveVitalIndex] = useState(0);

  useEffect(() => {
    if (measurements.length <= 1) {
      setActiveVitalIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setActiveVitalIndex((prev) => (prev + 1) % measurements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [measurements.length]);

  const currentVital = measurements[activeVitalIndex % measurements.length];

  const alert = useMemo(() => {
    if (!currentVital) return null;
    return evaluateVitalSignAlert(currentVital.measurementName, currentVital.value, patientAge);
  }, [currentVital, patientAge]);

  const isAbnormal = Boolean(
    alert && (alert.severity === "CRITICAL" || alert.severity === "WARNING" || alert.severity === "MILD")
  );
  const isCritical = alert?.severity === "CRITICAL";

  const formattedVitalLabel = useMemo(() => {
    if (!currentVital) return "";
    const name = currentVital.measurementName.trim().toLowerCase();
    const val = currentVital.value.trim();
    const unit = (currentVital.unit || "").trim();

    if (name.includes("blood pressure") || name === "bp") {
      return `BP: ${val}`;
    }
    if (name.includes("heart rate") || name.includes("pulse") || name === "hr") {
      return `HR: ${val} bpm`;
    }
    if (name.includes("temperature") || name === "temp") {
      return `Temp: ${val}${unit === "°C" || unit.toLowerCase() === "c" ? "°C" : " " + unit}`;
    }
    if (name.includes("oxygen") || name.includes("spo2") || name.includes("o2")) {
      return `SpO2: ${val}${unit === "%" ? "%" : " " + unit}`;
    }
    if (name.includes("weight") || name === "wt") {
      return `Wt: ${val} kg`;
    }
    if (name.includes("height") || name === "ht") {
      return `Ht: ${val} cm`;
    }
    if (name.includes("respiratory") || name === "rr") {
      return `RR: ${val} /min`;
    }
    return `${currentVital.measurementName}: ${val} ${unit}`.trim();
  }, [currentVital]);

  return (
    <Popover
      open={isOpen}
      onOpenChange={(val) => {
        if (!val) close();
      }}
    >
      <PopoverTrigger asChild>
        {measurements.length === 0 ? (
          /* When no vitals recorded: Only show icon */
          <button
            type="button"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={(e) => {
              e.preventDefault();
              togglePin();
            }}
            className={cn(
              "inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border/60 bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0",
              isOpen && "bg-primary/10 border-primary/40 text-primary",
              isPinned && "ring-1 ring-primary/40"
            )}
            title="No vitals recorded • Hover to preview, click to pin (Alt+V)"
            aria-label="No vitals recorded • Hover to preview, click to pin"
          >
            <HeartPulse className="h-3.5 w-3.5" />
          </button>
        ) : (
          /* When vitals exist: Ticker cycling through vitals every 5s with abnormal warning */
          <button
            type="button"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={(e) => {
              e.preventDefault();
              togglePin();
            }}
            className={cn(
              "relative inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition-all whitespace-nowrap shrink-0",
              isAbnormal
                ? isCritical
                  ? "border-red-500/60 bg-red-500/15 text-red-700 dark:text-red-300 dark:bg-red-950/40 animate-pulse shadow-xs"
                  : "border-amber-500/50 bg-amber-500/15 text-amber-800 dark:text-amber-300 dark:bg-amber-950/40 shadow-xs"
                : isOpen
                  ? "border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/30"
                  : "border-border/60 bg-background text-foreground hover:bg-muted",
              isPinned && "ring-1 ring-primary/50"
            )}
            title={
              isAbnormal && alert
                ? `Clinical Alert: ${alert.title} — ${alert.detail}`
                : `Vital Signs: ${formattedVitalLabel} • Hover to preview, click to pin (Alt+V)`
            }
          >
            {isAbnormal ? (
              isCritical ? (
                <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400 shrink-0 animate-bounce" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              )
            ) : (
              <HeartPulse className="h-3.5 w-3.5 text-primary shrink-0" />
            )}

            <span className="font-semibold tracking-tight">
              {formattedVitalLabel}
            </span>

            {isAbnormal && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            )}

            <ChevronDown className="h-3 w-3 text-muted-foreground opacity-60 shrink-0 ml-0.5" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={6}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="w-[340px] sm:w-[390px] p-0 rounded-2xl shadow-2xl border border-border/80 bg-background/95 backdrop-blur-md overflow-hidden max-h-[80vh] flex flex-col"
      >
        <VitalsDropdownContent
          vitals={vitals}
          canAddVitals={canAddVitals}
          onAddVitals={onAddVitals}
          patientAge={patientAge}
        />
      </PopoverContent>
    </Popover>
  );
}
