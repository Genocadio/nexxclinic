"use client";

import React from "react";
import {
  Users,
  Receipt,
  Lock,
  Package,
  StickyNote,
  CheckCircle2,
  AlertCircle,
  X,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface LiveToastItem {
  id: string;
  title: string;
  message?: string;
  variant?: "presence" | "billing" | "product" | "finalised" | "note" | "success" | "warning" | "info";
  persistent?: boolean;
  onClick?: () => void;
}

export interface VisitLiveToastsProps {
  toasts: LiveToastItem[];
  onDismiss: (id: string) => void;
}

export function VisitLiveToasts({
  toasts,
  onDismiss,
}: VisitLiveToastsProps) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Clinical and billing live updates"
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 flex flex-col gap-1.5 sm:gap-2 items-end max-w-[calc(100vw-1.5rem)] sm:max-w-xs pointer-events-none select-none"
    >
      {toasts.map((toast) => {
        const variant = toast.variant || "info";

        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-2.5 rounded-xl border p-2.5 sm:p-3 shadow-xl backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 w-full",
              variant === "presence" &&
                "border-emerald-300/80 bg-background/95 text-foreground dark:border-emerald-900/60 dark:bg-card/95",
              variant === "billing" &&
                "border-amber-300/80 bg-background/95 text-foreground dark:border-amber-900/60 dark:bg-card/95",
              variant === "finalised" &&
                "border-blue-300/80 bg-background/95 text-foreground dark:border-blue-900/60 dark:bg-card/95",
              variant === "product" &&
                "border-indigo-300/80 bg-background/95 text-foreground dark:border-indigo-900/60 dark:bg-card/95",
              variant === "note" &&
                "border-violet-300/80 bg-background/95 text-foreground dark:border-violet-900/60 dark:bg-card/95",
              variant === "success" &&
                "border-emerald-300/80 bg-background/95 text-foreground dark:border-emerald-900/60 dark:bg-card/95",
              variant === "warning" &&
                "border-amber-300/80 bg-background/95 text-foreground dark:border-amber-900/60 dark:bg-card/95",
              variant === "info" &&
                "border-border/80 bg-background/95 text-foreground dark:bg-card/95"
            )}
          >
            {/* Left Icon with subtle badge */}
            <div className="shrink-0 pt-0.5">
              {variant === "presence" && (
                <div className="relative flex items-center justify-center h-6 w-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <span className="animate-ping absolute -top-0.5 -right-0.5 inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
                  <span className="absolute -top-0.5 -right-0.5 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  <Users className="h-3.5 w-3.5" />
                </div>
              )}

              {variant === "billing" && (
                <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Receipt className="h-3.5 w-3.5" />
                </div>
              )}

              {variant === "finalised" && (
                <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
                  <Lock className="h-3.5 w-3.5" />
                </div>
              )}

              {variant === "product" && (
                <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                  <Package className="h-3.5 w-3.5" />
                </div>
              )}

              {variant === "note" && (
                <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-400">
                  <StickyNote className="h-3.5 w-3.5" />
                </div>
              )}

              {variant === "success" && (
                <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              )}

              {variant === "warning" && (
                <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                </div>
              )}

              {variant === "info" && (
                <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-muted text-muted-foreground">
                  <Info className="h-3.5 w-3.5" />
                </div>
              )}
            </div>

            {/* Text details */}
            <div
              onClick={() => {
                if (toast.onClick) {
                  toast.onClick();
                  onDismiss(toast.id);
                }
              }}
              className={cn(
                "flex-1 min-w-0 pr-1",
                toast.onClick && "cursor-pointer hover:opacity-85 transition-opacity"
              )}
            >
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-xs text-foreground leading-tight">
                  {toast.title}
                </span>
                {toast.persistent && (
                  <span className="text-[9px] font-medium text-muted-foreground bg-muted/60 px-1 py-0.2 rounded">
                    Active
                  </span>
                )}
                {toast.onClick && (
                  <span className="text-[9px] font-medium text-primary hover:underline">
                    View →
                  </span>
                )}
              </div>
              {toast.message && (
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                  {toast.message}
                </p>
              )}
            </div>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 p-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Dismiss notification"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Backwards-compatible alias for existing imports
export { VisitLiveToasts as ConsultationLiveToasts };
