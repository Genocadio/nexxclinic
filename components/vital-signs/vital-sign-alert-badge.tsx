"use client";

import React from "react";
import {
  AlertTriangle,
  AlertCircle,
  Activity,
  Thermometer,
  Wind,
  Heart,
  Info,
} from "lucide-react";
import {
  type VitalAlert,
  evaluateVitalSignAlert,
} from "@/lib/mews-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface VitalSignAlertBadgeProps {
  measurementName: string;
  value: string | number | null | undefined;
  patientAge?: number | null;
  /** If pre-evaluated alert is already provided */
  alert?: VitalAlert | null;
  /** Compact mode: only dot/icon and brief text */
  compact?: boolean;
  className?: string;
  showIconOnly?: boolean;
}

export function VitalSignAlertBadge({
  measurementName,
  value,
  patientAge,
  alert: preEvaluatedAlert,
  compact = false,
  className,
  showIconOnly = false,
}: VitalSignAlertBadgeProps) {
  const alert =
    preEvaluatedAlert !== undefined
      ? preEvaluatedAlert
      : evaluateVitalSignAlert(measurementName, value, patientAge);

  if (!alert) return null;

  const renderIcon = () => {
    switch (alert.icon) {
      case "alert-circle":
        return <AlertCircle className="w-3.5 h-3.5 shrink-0 animate-pulse text-red-600 dark:text-red-400" />;
      case "alert-triangle":
        return <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />;
      case "thermometer":
        return <Thermometer className="w-3.5 h-3.5 shrink-0" />;
      case "wind":
        return <Wind className="w-3.5 h-3.5 shrink-0" />;
      case "heart":
        return <Heart className="w-3.5 h-3.5 shrink-0" />;
      case "activity":
      default:
        return <Activity className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  const isCritical = alert.severity === "CRITICAL";

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border transition-all cursor-help shadow-xs select-none",
              alert.badgeClassName,
              isCritical && "ring-2 ring-red-500/20",
              className,
            )}
            role="status"
            aria-label={`${alert.title}: ${alert.detail}`}
          >
            {renderIcon()}
            {!showIconOnly && (
              <span className="truncate max-w-[170px]">
                {compact ? alert.shortLabel : alert.badgeLabel.replace(/^[🔴🟠🟡]\s*/, "")}
              </span>
            )}
            {alert.mewsPoints > 0 && (
              <span
                className={cn(
                  "text-[10px] px-1 py-0.2 rounded font-mono font-bold leading-none",
                  isCritical
                    ? "bg-red-500/20 text-red-700 dark:text-red-300"
                    : "bg-amber-500/20 text-amber-700 dark:text-amber-300",
                )}
                title={`Contributes ${alert.mewsPoints} point(s) to MEWS`}
              >
                +{alert.mewsPoints}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs p-3 text-xs shadow-xl border border-border/80 bg-popover/95 backdrop-blur-md"
        >
          <div className="flex items-start gap-2 mb-1.5">
            <span className="text-base leading-none">
              {isCritical ? "🔴" : alert.severity === "WARNING" ? "🟠" : "🟡"}
            </span>
            <div>
              <p className="font-bold text-foreground text-sm">{alert.title}</p>
              <p className="text-[11px] font-medium text-muted-foreground">
                Clinical Warning • {alert.badgeLabel}
              </p>
            </div>
          </div>
          <p className="text-foreground/90 leading-relaxed">{alert.detail}</p>
          {alert.mewsPoints > 0 && (
            <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground font-medium">
              <span>MEWS Contribution:</span>
              <span className="font-bold text-foreground">
                +{alert.mewsPoints} point{alert.mewsPoints > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
