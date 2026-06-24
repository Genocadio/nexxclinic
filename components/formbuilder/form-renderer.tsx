"use client";

/**
 * FormRenderer — reusable answer-mode/view-mode form component.
 *
 * `initialAnswers` may contain both block answers and inline answers.
 * Inline answer keys use:
 * - paragraph inline fields → `blockId__fieldId`
 * - table inline fields → `blockId__ri__ci__fieldId`
 *
 * When `edit` is `false`, the component renders provided answers read-only.
 * When `edit` is `true` (default), the component allows editing them.
 */

import React, { useCallback, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AnswerBlock } from "./renderer/answer-block";
import type { FormAnswers, FormRendererProps, FormBlock } from "./renderer/types";
import {
  collectAnswerableBlocks,
  isBlockViolating,
  splitInitialAnswers,

} from "./renderer/utils";
import { useAuth } from "@/lib/auth-context";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type { FormAnswers } from "./renderer/types";

export function FormRenderer({
  form,
  showTitle = false,
  validate = true,
  onSubmit,
  onChange,
  submitLabel = "Submit",
  hideSubmit = false,
  className = "",
  initialAnswers = {},
  edit = true,
  mode = "full",
}: FormRendererProps) {
  const initial = useMemo(
    () => splitInitialAnswers(initialAnswers),
    [initialAnswers],
  );
  const [answers, setAnswers] = useState<FormAnswers>(initial.blockAnswers);
  const [inlineAnswers, setInlineAnswers] = useState<Record<string, string>>(
    initial.inlineAnswers,
  );
  const [showErrors, setShowErrors] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const { doctor, clinicProfile } = useAuth();
  const context = useMemo(
    () => ({ doctor, clinicProfile }),
    [doctor, clinicProfile],
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const notifyChange = useCallback(
    (ans: FormAnswers, inline: Record<string, string>) => {
      onChange?.({ ...ans, ...inline });
    },
    [onChange],
  );

  const handleAnswerChange = useCallback(
    (blockId: string, value: unknown) => {
      if (!edit) return;
      setAnswers((prev) => {
        const next = { ...prev, [blockId]: value };
        notifyChange(next, inlineAnswers);
        return next;
      });
    },
    [edit, inlineAnswers, notifyChange],
  );

  const handleInlineChange = useCallback(
    (key: string, value: string) => {
      if (!edit) return;
      setInlineAnswers((prev) => {
        const next = { ...prev, [key]: value };
        notifyChange(answers, next);
        return next;
      });
    },
    [answers, edit, notifyChange],
  );

  const sections = useMemo(() => {
    if (mode === "full") return [{ title: "Form", blocks: form?.blocks ?? [] }];
    
    const res: { title: string; blocks: FormBlock[] }[] = [];
    let currentSection: { title: string; blocks: FormBlock[] } = { title: "Start", blocks: [] };

    (form?.blocks ?? []).forEach((block) => {
      if (block.type === "heading1" || block.type === "heading2") {
        if (currentSection.blocks.length > 0) {
          res.push(currentSection);
        }
        currentSection = { title: block.content ?? "Section", blocks: [block] };
      } else {
        currentSection.blocks.push(block);
      }
    });
    if (currentSection.blocks.length > 0) res.push(currentSection);
    return res.length > 0 ? res : [{ title: "Form", blocks: [] }];
  }, [form?.blocks, mode]);

  const allBlocks = useMemo(
    () => collectAnswerableBlocks(form?.blocks ?? []),
    [form?.blocks],
  );
  
  const violations = useMemo(
    () => allBlocks.filter((b) => isBlockViolating(b, answers)),
    [allBlocks, answers],
  );

  const hasViolations = violations.length > 0;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!edit) return;
    if (validate && hasViolations) {
      setShowErrors(true);
      return;
    }
    onSubmit?.({ ...answers, ...inlineAnswers });
  };

  const scrollToBlock = (blockId: string) => {
    const el = document.getElementById(`block-${blockId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-red-500", "ring-offset-2");
      setTimeout(() => el.classList.remove("ring-2", "ring-red-500", "ring-offset-2"), 2000);
    }
  };

  if (!form) return null;

  const primaryColor = form.theme?.primaryColor || "#FF6900";
  const logoPlacement = form.theme?.logoPlacement || "left";

  const currentBlocks =
    mode === "wizard" ? sections[currentStep].blocks : form.blocks;
  const isLastStep =
    mode === "wizard" ? currentStep === sections.length - 1 : true;

  return (
    <div
      className={cn("relative flex flex-col min-h-full", className)}
      style={{ "--primary": primaryColor } as React.CSSProperties}
    >
      <form onSubmit={handleSubmit} noValidate className="flex-1">
        {/* Header / Logo area */}
        {(showTitle || clinicProfile?.logoUrl) && (
          <div
            className={cn(
              "mb-8 flex flex-col",
              logoPlacement === "center"
                ? "items-center text-center"
                : logoPlacement === "right"
                  ? "items-end text-right"
                  : "items-start text-left",
            )}
          >
            {clinicProfile?.logoUrl && (
              <img
                src={clinicProfile.logoUrl}
                alt="Clinic Logo"
                className="h-12 w-auto mb-4"
              />
            )}
            {showTitle && form.name && (
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {form.name}
                </h1>
                {form.description && (
                  <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                    {form.description}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {mode === "wizard" && sections.length > 1 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: primaryColor }}
              >
                Step {currentStep + 1} of {sections.length}:{" "}
                {sections[currentStep].title}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {Math.round(((currentStep + 1) / sections.length) * 100)}%
                Complete
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${((currentStep + 1) / sections.length) * 100}%`,
                  backgroundColor: primaryColor,
                }}
              />
            </div>
          </div>
        )}

        <div className="space-y-6" ref={scrollRef}>
          {form.blocks.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">
              <p className="text-2xl mb-2">📄</p>
              <p>No blocks in this form yet.</p>
            </div>
          ) : (
            currentBlocks.map((block) => (
              <div
                key={block.id}
                id={`block-${block.id}`}
                className="transition-all duration-300 rounded-lg"
              >
                <AnswerBlock
                  block={block}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                  showErrors={showErrors}
                  inlineAnswers={inlineAnswers}
                  onInlineChange={handleInlineChange}
                  edit={edit}
                  context={context}
                />
              </div>
            ))
          )}
        </div>

        {edit && (
          <div className="mt-12 flex items-center gap-3">
            {mode === "wizard" && currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCurrentStep(s => s - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}

            {!isLastStep ? (
              <Button
                type="button"
                onClick={() => {
                  setCurrentStep((s) => s + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="gap-2 px-8"
                style={{ backgroundColor: primaryColor }}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              !hideSubmit && (
                <Button
                  type="submit"
                  className="text-white px-8 gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {submitLabel}
                </Button>
              )
            )}
          </div>
        )}
      </form>

      {/* Sticky Validation Summary */}
      {edit && showErrors && hasViolations && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-destructive text-destructive-foreground shadow-2xl rounded-2xl p-4 border border-destructive/20 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">Please complete required fields</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {violations.slice(0, 5).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => scrollToBlock(v.id)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors truncate max-w-30"
                    >
                      {v.label || "Required Field"}
                    </button>
                  ))}
                  {violations.length > 5 && (
                    <span className="text-[10px] opacity-70">+{violations.length - 5} more</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
