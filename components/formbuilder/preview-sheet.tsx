"use client";

/**
 * PreviewSheet — slide-in sheet for the form-builder editor preview.
 *
 * Uses FormRenderer in answer mode. On submit it logs the collected answers
 * to the browser console (dev preview tool, not a production submission path).
 */

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { X, Printer, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SavedForm } from "@/lib/formbuilder-storage";
import { FormRenderer, type FormAnswers } from "./form-renderer";

interface PreviewSheetProps {
  open: boolean;
  onClose: () => void;
  form: SavedForm | null;
  answers?: FormAnswers;
  edit?: boolean;
}

export function PreviewSheet({
  open,
  onClose,
  form,
  answers,
  edit = true,
}: PreviewSheetProps) {
  const [mounted, setMounted] = useState(false);
  // Key is bumped whenever the sheet opens so FormRenderer resets cleanly
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Fresh form instance every time the preview is opened
      setRenderKey((k) => k + 1);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted || typeof document === "undefined") return null;

  const handlePrint = () => window.print();

  const handleSubmit = (answers: FormAnswers) => {
    console.group(
      `[FormBuilder Preview] Submitted answers — "${form?.name ?? "form"}"`,
    );
    console.log("Answers:", answers);
    console.groupEnd();
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-[90] transition-all duration-200 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-3xl bg-background shadow-2xl flex flex-col transition-transform duration-200 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="font-semibold text-foreground">
              {form?.name ?? "Form Preview"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Terminal className="h-3 w-3" />
              {edit
                ? "Answer mode — submit logs to console"
                : "Preview mode — read-only answers"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-10">
            <FormRenderer
              key={renderKey}
              form={form}
              showTitle={false}
              validate={edit}
              submitLabel="Submit (logs to console)"
              onSubmit={handleSubmit}
              initialAnswers={answers}
              edit={edit}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
