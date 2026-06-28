"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormRenderer } from "@/components/formbuilder/form-renderer";
import { useStandaloneAnswer } from "@/hooks/standalone-forms/visit-answers";
import {
  mapStandaloneAnswerToSavedForm,
  parseStandaloneAnswers,
} from "@/lib/standalone-form-mapper";
import type { VisitDepartment } from "@/lib/api-types";

interface ConsultationPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  answerId: string | null;
  departmentName?: string;
  patientName?: string;
  visitDepartment?: VisitDepartment | null;
  previewStartedAt?: number | null;
}

export function ConsultationPreviewSheet({
  open,
  onOpenChange,
  answerId,
  departmentName,
  patientName,
  visitDepartment,
  previewStartedAt,
}: ConsultationPreviewSheetProps) {
  const [previewReadyLogged, setPreviewReadyLogged] = useState(false);
  const [isRendered, setIsRendered] = useState(open);

  const { answer, loading, error } = useStandaloneAnswer(answerId, {
    skip: !open || !answerId,
  });

  const previewForm = useMemo(
    () => (answer ? mapStandaloneAnswerToSavedForm(answer) : null),
    [answer],
  );
  const previewAnswers = useMemo(
    () => parseStandaloneAnswers(answer?.answers) as Record<string, unknown>,
    [answer?.answers],
  );
  const answerStatus = answer?.status || null;

  useEffect(() => {
    if (open) {
      setIsRendered(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsRendered(false);
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPreviewReadyLogged(false);
      return;
    }

    if (!previewForm || loading || previewReadyLogged) return;

    const elapsedMs =
      typeof previewStartedAt === "number"
        ? Date.now() - previewStartedAt
        : null;
    console.log("[ConsultationPreview] ready", {
      answerId,
      hasAnswers: Boolean(answer?.answers),
      hasForm: Boolean(previewForm),
      elapsedMs,
    });
    setPreviewReadyLogged(true);
  }, [
    answer?.answers,
    answerId,
    loading,
    open,
    previewForm,
    previewReadyLogged,
    previewStartedAt,
  ]);

  if (!isRendered || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[88]">
      <div
        className={`absolute top-16 bottom-0 left-0 md:left-[420px] right-0 bg-transparent transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Consultation Preview"
        className={`absolute right-0 top-16 h-[calc(100vh-4rem)] w-[min(92vw,56rem)] border-l border-border bg-background shadow-2xl transition-transform duration-200 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-border/70 px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold text-foreground">
                    Consultation Preview
                  </h2>
                  {answerStatus && (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${answerStatus === "FINAL" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {answerStatus.toLowerCase()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {patientName ? `${patientName} • ` : ""}
                  {departmentName || "Department"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close preview"
              >
                ×
              </button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-88px)] px-4 py-4">
            <div className="space-y-4">
              {loading && (
                <p className="text-sm text-muted-foreground">
                  Loading consultation answers...
                </p>
              )}

              {!loading && !answerId && visitDepartment && (
                <div className="mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Department summary
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      No saved form answer exists yet for this department, so
                      this preview shows recorded department data.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Diagnoses
                      </p>
                      {visitDepartment.diagnostics?.length ? (
                        <ul className="space-y-1 text-sm text-foreground list-disc pl-5">
                          {visitDepartment.diagnostics.map((item) => (
                            <li key={item.id}>{item.diagnosisName}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No diagnoses recorded.
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Medications
                      </p>
                      {visitDepartment.medications?.length ? (
                        <ul className="space-y-1 text-sm text-foreground list-disc pl-5">
                          {visitDepartment.medications.map((item) => (
                            <li key={item.id}>{item.medicationName}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No medications recorded.
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Products
                      </p>
                      {visitDepartment.products?.length ? (
                        <ul className="space-y-1 text-sm text-foreground list-disc pl-5">
                          {visitDepartment.products.map((item) => (
                            <li key={item.id}>
                              {item.product?.name || "Product"}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No products recorded.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!loading && !answerId && !visitDepartment && (
                <p className="text-sm text-muted-foreground">
                  No saved consultation answer is available for this department.
                </p>
              )}

              {!loading && answerId && error && (
                <p className="text-sm text-destructive">
                  Failed to load consultation answers: {error}
                </p>
              )}

              {!loading && answerId && !error && !previewForm && (
                <p className="text-sm text-muted-foreground">
                  The saved consultation answer was found, but the form could
                  not be loaded.
                </p>
              )}

              {!loading && previewForm && !error && (
                <div className="mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <FormRenderer
                    form={previewForm}
                    showTitle={true}
                    edit={false}
                    validate={false}
                    hideSubmit={true}
                    initialAnswers={previewAnswers}
                    className="mx-auto"
                  />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
