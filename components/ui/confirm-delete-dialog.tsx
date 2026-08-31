"use client";

import { Loader2, AlertTriangle } from "lucide-react";
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

export interface DeleteDependency {
  /** Human-readable label, e.g. "3 products", "5 notes" */
  label: string;
}

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Name of the entity being deleted, shown in the title. */
  entityName: string;
  /** Dependencies that will be permanently removed. Empty = no dependencies. */
  dependencies?: DeleteDependency[];
  /** Extra context message shown after the dependency list. */
  extraWarning?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** While true the dialog stays open and both buttons disable with a spinner. */
  busy?: boolean;
  onConfirm: () => void;
}

/**
 * Reusable destructive confirmation dialog that shows dependency warnings
 * before a delete action. Follows the ConfirmDialog pattern but adds:
 * - A warning icon
 * - A bulleted list of what will be lost
 * - A "this action cannot be undone" footer
 *
 * Use this instead of `window.confirm()` for any destructive action.
 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  entityName,
  dependencies = [],
  extraWarning,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  busy = false,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const hasDependencies = dependencies.length > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {`Delete "${entityName}"?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
              {hasDependencies ? (
                <>
                  <span>
                    This will permanently remove the following dependencies:
                  </span>
                  <ul className="mt-2 list-disc pl-4 text-sm">
                    {dependencies.map((dep, i) => (
                      <li key={i} className="text-destructive/80">
                        {dep.label}
                      </li>
                    ))}
                  </ul>
                  {extraWarning && (
                    <span className="mt-2 text-sm text-muted-foreground">
                      {extraWarning}
                    </span>
                  )}
                </>
              ) : (
                <span>
                  {extraWarning ||
                    "This action cannot be undone. All associated data will be permanently removed."}
                </span>
              )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy} onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
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
