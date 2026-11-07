"use client";

import React from "react";
import { AlertCircle, AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import {
  calculateMewsScore,
  type MewsEvaluation,
} from "@/lib/mews-utils";
import { cn } from "@/lib/utils";

interface VitalSignsMewsBannerProps {
  measurements: Array<{ measurementName: string; value: string | number }>;
  patientAge?: number | null;
  className?: string;
  compact?: boolean;
}

export function VitalSignsMewsBanner({
  measurements,
  patientAge,
  className,
  compact = false,
}: VitalSignsMewsBannerProps) {
  const evaluation: MewsEvaluation = React.useMemo(() => {
    return calculateMewsScore(measurements, patientAge);
  }, [measurements, patientAge]);

  // If there are no measurements or score is 0 and no alerts, we can render either normal badge or null based on compact
  if (evaluation.alerts.length === 0 && evaluation.score === 0) {
    if (compact) return null;
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
          className,
        )}
      >
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span className="font-semibold">Vitals Normal</span>
        <span className="text-muted-foreground hidden sm:inline">• MEWS 0</span>
      </div>
    );
  }

  const isHighRisk = evaluation.level === "HIGH";
  const isMediumRisk = evaluation.level === "MEDIUM";

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border transition-all",
          evaluation.badgeClassName,
          className,
        )}
        title={evaluation.description}
      >
        {isHighRisk ? (
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600 animate-pulse" />
        ) : isMediumRisk ? (
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
        ) : (
          <Activity className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>MEWS: {evaluation.score}</span>
        <span className="text-[10px] font-semibold uppercase opacity-90">
          ({evaluation.level})
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border p-2.5 sm:p-3 transition-all",
        evaluation.badgeClassName,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0">
            {isHighRisk ? (
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
            ) : isMediumRisk ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <Activity className="w-4 h-4" />
            )}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider">
                {evaluation.title}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-background/60 border border-current">
                Score: {evaluation.score} / {evaluation.maxPossibleRecordedScore}
              </span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              {evaluation.description}
            </p>
          </div>
        </div>
      </div>

      {evaluation.alerts.length > 0 && (
        <div className="mt-2 pt-2 border-t border-current/15 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 mr-1">
            Triggered Alerts:
          </span>
          {evaluation.alerts.map((alert, idx) => (
            <span
              key={`${alert.metric}-${idx}`}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-background/70 border border-current/20 shadow-2xs"
            >
              {alert.badgeLabel}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
