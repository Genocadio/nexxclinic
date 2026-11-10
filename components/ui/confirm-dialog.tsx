"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirm button as destructive (red). */
  destructive?: boolean;
  /** While true the dialog stays open and both buttons disable with a spinner. */
  busy?: boolean;
  onConfirm: () => void;
}

/**
 * Styled replacement for native `confirm()` — consistent with the app's
 * design system (Radix AlertDialog). The dialog closes immediately on
 * confirm; async work lives in the parent's `onConfirm`.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  busy = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md p-5 sm:p-6">
        <AlertDialogHeader className="space-y-1.5">
          <AlertDialogTitle className="text-base font-semibold">{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {description}
            </AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2.5 sm:gap-3 pt-2">
          <AlertDialogCancel
            disabled={busy}
            onClick={() => onOpenChange(false)}
            className="h-8.5 px-3.5 text-xs font-medium"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={cn(
              "h-8.5 px-4 text-xs font-medium shadow-xs",
              destructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : undefined
            )}
          >
            {busy ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                {confirmLabel}…
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
