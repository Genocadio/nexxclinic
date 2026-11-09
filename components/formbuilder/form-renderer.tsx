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

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Button } from "@/components/ui/button";
import { AnswerBlock } from "./renderer/answer-block";
import type {
  FormAnswers,
  FormRendererProps,
  FormBlock,
} from "./renderer/types";
import {
  collectAnswerableBlocks,
  isBlockAnswered,
  isBlockViolating,
  shouldRenderBlock,
  splitInitialAnswers,
} from "./renderer/utils";
import { createExtensionBlockHandlersResolver } from "./extensions";
import { useAuth } from "@/lib/auth-context";
import { getMediaUrl } from "@/lib/media-url";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type { FormAnswers, FormRendererProps } from "./renderer/types";
export type {
  FormRendererExtension,
  MedicalBlockHandlers,
} from "./extensions/types";
export { useConsultationVisitExtension } from "./extensions/consultation-visit";
export { ConsultationFormRenderer } from "./consultation-form-renderer";

export interface FormRendererHandle {
  validateAndShowErrors: () => boolean;
  clearErrors: () => void;
}

export const FormRenderer = forwardRef<FormRendererHandle, FormRendererProps>(
  function FormRenderer(
    {
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
      hideSectionNav = false,
      extensions,
      controlledAnswers,
      onControlledAnswersChange,
    },
    ref,
  ) {
    const initial = useMemo(
      () => splitInitialAnswers(initialAnswers),
      [initialAnswers],
    );
    const isControlled = controlledAnswers !== undefined;
    const [internalAnswers, setInternalAnswers] = useState<FormAnswers>(
      initial.blockAnswers,
    );
    const answers = isControlled ? controlledAnswers : internalAnswers;
    const setAnswers = useCallback(
      (updater: FormAnswers | ((prev: FormAnswers) => FormAnswers)) => {
        const resolve = (prev: FormAnswers) =>
          typeof updater === "function"
            ? (updater as (p: FormAnswers) => FormAnswers)(prev)
            : updater;
        if (isControlled) {
          onControlledAnswersChange?.(resolve(controlledAnswers));
        } else {
          setInternalAnswers(resolve);
        }
      },
      [isControlled, controlledAnswers, onControlledAnswersChange],
    );
    const [inlineAnswers, setInlineAnswers] = useState<Record<string, string>>(
      initial.inlineAnswers,
    );
    const [showErrors, setShowErrors] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Inline answers render from local state seeded once at mount. When the
    // caller swaps in a different answer set without remounting (consultation
    // preview switching answers) that state goes stale, so re-seed it. Gated on
    // a content signature so live edits are never clobbered and a fresh
    // `initialAnswers` object literal on every render is a no-op.
    const incomingInlineSignature = useMemo(
      () => JSON.stringify(initial.inlineAnswers),
      [initial.inlineAnswers],
    );
    useEffect(() => {
      setInlineAnswers((prev) =>
        JSON.stringify(prev) === incomingInlineSignature
          ? prev
          : initial.inlineAnswers,
      );
    }, [incomingInlineSignature, initial.inlineAnswers]);

    const { doctor, clinicProfile } = useAuth();
    const context = useMemo(
      () => ({ doctor, clinicProfile }),
      [doctor, clinicProfile],
    );

    const scrollRef = useRef<HTMLDivElement>(null);
    const getBlockHandlers = useMemo(
      () => createExtensionBlockHandlersResolver(extensions),
      [extensions],
    );

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
      [edit, inlineAnswers, notifyChange, setAnswers],
    );

    const handleInlineChange = useCallback(
      (key: string, value: string) => {
        if (!edit) return;
        setInlineAnswers((prev) => {
          const next = { ...prev, [key]: value };
          notifyChange(answers, next);
          return next;
        });
        // Table/paragraph inline answers live in `inlineAnswers`, outside the
        // answer map. Controlled consumers (consultation auto-save) only watch
        // `answers`, so mirror the value there as well — otherwise the edit
        // never triggers a save and is lost on reload. Hydration splits these
        // `__` keys back out into `inlineAnswers`, so rendering is unaffected.
        setAnswers((prev) =>
          prev[key] === value ? prev : { ...prev, [key]: value },
        );
      },
      [answers, edit, notifyChange, setAnswers],
    );

    const sections = useMemo(() => {
      if (mode === "full")
        return [{ title: "Form", blocks: form?.blocks ?? [] }];

      const res: { title: string; blocks: FormBlock[] }[] = [];
      let currentSection: { title: string; blocks: FormBlock[] } = {
        title: "Start",
        blocks: [],
      };

      (form?.blocks ?? []).forEach((block) => {
        if (block.type === "heading1" || block.type === "heading2") {
          if (currentSection.blocks.length > 0) {
            res.push(currentSection);
          }
          currentSection = {
            title: block.content ?? "Section",
            blocks: [block],
          };
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
      () =>
        allBlocks.filter((b) => {
          if (!shouldRenderBlock(b, answers, getBlockHandlers, form?.blocks)) {
            return false;
          }
          return isBlockViolating(b, answers, getBlockHandlers(b));
        }),
      [allBlocks, answers, getBlockHandlers, form?.blocks],
    );

    const hasViolations = violations.length > 0;

    // Build section jump-nav chips for full mode when the form has multiple logical sections
    const jumpSections = useMemo(() => {
      if (mode !== "full" || hideSectionNav || !edit) return [];
      const topBlocks = (form?.blocks ?? []).filter((b) =>
        shouldRenderBlock(b, answers, getBlockHandlers, form?.blocks),
      );
      if (topBlocks.length === 0) return [];

      const headingTypes = new Set(["heading1", "heading2", "heading3"]);
      const hasMultipleHeadings =
        topBlocks.filter((b) => headingTypes.has(b.type)).length >= 2;

      type RawGroup = {
        id: string;
        title: string;
        blocks: FormBlock[];
      };
      const rawGroups: RawGroup[] = [];

      if (hasMultipleHeadings) {
        let current: RawGroup | null = null;
        for (const block of topBlocks) {
          if (headingTypes.has(block.type)) {
            if (current && current.blocks.length > 0) {
              rawGroups.push(current);
            }
            current = {
              id: block.id,
              title: (block.content || "Section").trim() || "Section",
              blocks: [block],
            };
          } else {
            if (!current) {
              current = {
                id: block.id,
                title: "Overview",
                blocks: [block],
              };
            } else {
              current.blocks.push(block);
            }
          }
        }
        if (current && current.blocks.length > 0) {
          rawGroups.push(current);
        }
      } else {
        // Fallback for forms without headings: group by clinical/labeled top-level blocks if >= 3
        const getFallbackTitle = (b: FormBlock): string | null => {
          if (b.label && b.label.trim()) return b.label.trim();
          if (b.content && headingTypes.has(b.type)) return b.content.trim();
          switch (b.type) {
            case "symptom_listener":
              return "Symptoms";
            case "diagnostic_record":
              return "Diagnosis";
            case "hypothesis_record":
              return "Hypothesis";
            case "medication_full":
            case "medication_mini":
              return "Medications";
            case "product_listener":
              return "Procedures & Products";
            case "lab_record":
              return "Lab Results";
            default:
              return null;
          }
        };

        for (const block of topBlocks) {
          const title = getFallbackTitle(block);
          if (title) {
            rawGroups.push({
              id: block.id,
              title,
              blocks: [block],
            });
          }
        }
      }

      if (rawGroups.length < 2) return [];

      const NON_ANSWER_TYPES = new Set([
        "heading1",
        "heading2",
        "heading3",
        "divider",
        "spacer",
      ]);

      return rawGroups.map((group) => {
        const answerable = collectAnswerableBlocks(group.blocks).filter(
          (b) =>
            !NON_ANSWER_TYPES.has(b.type) &&
            (b.type !== "paragraph" || (b.inlineFields?.length ?? 0) > 0) &&
            shouldRenderBlock(b, answers, getBlockHandlers, form?.blocks),
        );
        const groupViolations = answerable.filter((b) =>
          isBlockViolating(b, answers, getBlockHandlers(b)),
        );
        const answeredCount = answerable.filter((b) =>
          isBlockAnswered(b, answers, inlineAnswers, getBlockHandlers(b)),
        ).length;
        const hasError = showErrors && groupViolations.length > 0;
        const isComplete =
          answerable.length > 0 &&
          groupViolations.length === 0 &&
          answeredCount > 0;

        return {
          id: group.id,
          title: group.title,
          hasError,
          violationCount: groupViolations.length,
          firstViolationId: groupViolations[0]?.id ? String(groupViolations[0].id) : null,
          isComplete,
          answeredCount,
          totalCount: answerable.length,
        };
      });
    }, [mode, form?.blocks, answers, inlineAnswers, getBlockHandlers, showErrors]);

    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

    // Active section scroll tracking (captured across any scrollable ancestor or window)
    useEffect(() => {
      if (jumpSections.length === 0) return;

      const handleScroll = () => {
        // Check if user is scrolled near the bottom of their scroll container
        let isAtBottom = false;
        const container = scrollRef.current?.closest(".overflow-y-auto") as HTMLElement | null;
        if (container) {
          isAtBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < 50;
        } else if (typeof window !== "undefined" && document.documentElement) {
          isAtBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 50;
        }

        if (isAtBottom && jumpSections.length > 0) {
          setActiveSectionId(jumpSections[jumpSections.length - 1].id);
          return;
        }

        const triggerOffset = Math.max(120, window.innerHeight * 0.35);
        let currentId = jumpSections[0]?.id;

        for (const s of jumpSections) {
          const el = document.getElementById(`block-${s.id}`);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerOffset) {
            currentId = s.id;
          }
        }

        if (currentId) {
          setActiveSectionId(currentId);
        }
      };

      // Run immediately and after a short render delay
      handleScroll();
      const raf = requestAnimationFrame(handleScroll);

      // Listen with capture: true on document so ANY scroll container (including overflow-y-auto divs) triggers it
      document.addEventListener("scroll", handleScroll, { passive: true, capture: true });
      window.addEventListener("resize", handleScroll, { passive: true });

      return () => {
        cancelAnimationFrame(raf);
        document.removeEventListener("scroll", handleScroll, { capture: true });
        window.removeEventListener("resize", handleScroll);
      };
    }, [jumpSections]);

    const [timelineExpanded, setTimelineExpanded] = useState(false);
    const timelineLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleTimelineMouseEnter = useCallback(() => {
      if (timelineLeaveTimerRef.current) {
        clearTimeout(timelineLeaveTimerRef.current);
        timelineLeaveTimerRef.current = null;
      }
      setTimelineExpanded(true);
    }, []);

    const handleTimelineMouseLeave = useCallback(() => {
      if (timelineLeaveTimerRef.current) {
        clearTimeout(timelineLeaveTimerRef.current);
      }
      timelineLeaveTimerRef.current = setTimeout(() => {
        setTimelineExpanded(false);
      }, 160);
    }, []);

    const scrollToBlock = useCallback((blockId: string, highlightError = true) => {
      const el = document.getElementById(`block-${blockId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        if (highlightError) {
          el.classList.add("ring-2", "ring-red-500", "ring-offset-2");
          setTimeout(
            () => el.classList.remove("ring-2", "ring-red-500", "ring-offset-2"),
            2200,
          );
        } else {
          el.classList.add("ring-2", "ring-primary/50", "ring-offset-2");
          setTimeout(
            () => el.classList.remove("ring-2", "ring-primary/50", "ring-offset-2"),
            1400,
          );
        }
        // Focus first interactive field inside the target block after smooth scroll starts
        setTimeout(() => {
          const focusable = el.querySelector<HTMLElement>(
            "input:not([disabled]), textarea:not([disabled]), select:not([disabled])",
          );
          focusable?.focus({ preventScroll: true });
        }, 320);
      }
    }, []);

    const validateAndShowErrors = useCallback(() => {
      if (!validate) return true;
      if (hasViolations) {
        setShowErrors(true);
        // Smoothly scroll to and focus the first invalid block
        const first = violations[0];
        if (first?.id) {
          requestAnimationFrame(() => {
            scrollToBlock(String(first.id), true);
          });
        }
        return false;
      }
      return true;
    }, [validate, hasViolations, violations, scrollToBlock]);

    const clearErrors = useCallback(() => {
      setShowErrors(false);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        validateAndShowErrors,
        clearErrors,
      }),
      [validateAndShowErrors, clearErrors],
    );

    const handleSubmit = (e: React.SyntheticEvent) => {
      e.preventDefault();
      if (!edit) return;
      if (!validateAndShowErrors()) {
        return;
      }
      onSubmit?.({ ...answers, ...inlineAnswers });
    };

    if (!form) return null;

    const primaryColor = form.theme?.primaryColor || "#FF6900";
    const logoPlacement = form.theme?.logoPlacement || "left";
    const showLogo = logoPlacement !== "none" && Boolean(clinicProfile?.logoUrl);

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
          {(showTitle || showLogo) && (
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
              {showLogo && clinicProfile?.logoUrl && (
                <img
                  src={getMediaUrl(clinicProfile.logoUrl)}
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

          {/* Vertical Section Timeline (Small hyphens, expands to show all sections on hover) */}
          {mode === "full" && !hideSectionNav && edit && jumpSections.length >= 2 && (
            <nav
              aria-label="Form section timeline navigation"
              onMouseEnter={handleTimelineMouseEnter}
              onMouseLeave={handleTimelineMouseLeave}
              className="fixed right-2 sm:right-3.5 top-1/2 -translate-y-1/2 z-30 select-none"
            >
              {!timelineExpanded ? (
                /* Collapsed: Subtle, non-prominent hyphens — active is wider/bolder, missing reqs flagged, dull otherwise */
                <div className="flex flex-col items-end gap-2 py-3 px-2 cursor-pointer transition-opacity duration-200">
                  {jumpSections.map((section) => {
                    const isActive = activeSectionId === section.id;
                    return (
                      <div
                        key={section.id}
                        className="flex items-center justify-end h-2.5"
                      >
                        <span
                          className={cn(
                            "rounded-full transition-all duration-300 ease-out",
                            // Inactive is dull; Active is wider and bolder
                            isActive ? "w-6 h-[3.5px]" : "w-3 h-[2px]",
                            // Differentiate missing requirements vs filled vs no requirement
                            section.hasError
                              ? "bg-red-500 shadow-xs"
                              : section.isComplete
                                ? "bg-emerald-500/80"
                                : isActive
                                  ? "bg-primary shadow-xs"
                                  : "bg-foreground/20 dark:bg-foreground/25"
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Expanded on hover: Shows ALL section names simultaneously, status, and active position */
                <div className="flex flex-col rounded-2xl border border-border/80 bg-card/95 dark:bg-card/90 backdrop-blur-md shadow-2xl p-2 min-w-[220px] max-w-[300px] animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-border/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <span>Sections</span>
                    <span>
                      {jumpSections.filter((s) => s.isComplete).length}/{jumpSections.length} done
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-0.5">
                    {jumpSections.map((section) => {
                      const isActive = activeSectionId === section.id;
                      const targetBlockId =
                        section.hasError && section.firstViolationId
                          ? section.firstViolationId
                          : section.id;

                      return (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => {
                            scrollToBlock(targetBlockId, section.hasError);
                            setActiveSectionId(section.id);
                            setTimelineExpanded(false);
                          }}
                          className={cn(
                            "flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs group",
                            isActive
                              ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/25"
                              : "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
                          )}
                        >
                          {/* Bar/hyphen indicator matching status */}
                          <span
                            className={cn(
                              "rounded-full shrink-0 transition-all duration-200",
                              isActive ? "w-4 h-[3.5px]" : "w-2.5 h-[2px]",
                              section.hasError
                                ? "bg-red-500"
                                : section.isComplete
                                  ? "bg-emerald-500"
                                  : isActive
                                    ? "bg-primary"
                                    : "bg-muted-foreground/40 group-hover:bg-foreground/60"
                            )}
                          />

                          {/* Section title */}
                          <span className="flex-1 truncate">{section.title}</span>

                          {/* Status indicator on the right */}
                          {section.hasError ? (
                            <span className="shrink-0 flex items-center justify-center h-4 px-1.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 text-[10px] font-bold">
                              ! {section.violationCount}
                            </span>
                          ) : section.isComplete ? (
                            <span className="shrink-0 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                              ✓
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </nav>
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
                    blockHandlers={getBlockHandlers(block)}
                    getBlockHandlers={getBlockHandlers}
                    allBlocks={form.blocks}
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
                    setCurrentStep((s) => s - 1);
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
                  <p className="text-sm font-bold">
                    Please complete required fields
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {violations.slice(0, 5).map((v) => (
                      <button
                        key={v.id}
                        onClick={() => scrollToBlock(v.id)}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors truncate max-w-30"
                      >
                        {v.label || "Required Field"}
                      </button>
                    ))}
                    {violations.length > 5 && (
                      <span className="text-[11px] opacity-70">
                        +{violations.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);
