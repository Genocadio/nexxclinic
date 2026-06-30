"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ClipboardList,
  Loader2,
  AlertCircle,
  CalendarClock,
  UserRound,
  Stethoscope,
} from "lucide-react";
import { TEMPLATE_PRESETS } from "@/lib/formbuilder-presets";
import type { FormBlock, SavedForm } from "@/lib/formbuilder-storage";
import { FormRenderer } from "@/components/formbuilder/form-renderer";
import {
  useGetStandaloneForm,
  useGetStandaloneAnswers,
} from "@/hooks/standalone-forms";
import { useStandaloneAnswer } from "@/hooks/standalone-forms/visit-answers";
import {
  mapStandaloneAnswerToSavedForm,
  parseStandaloneAnswers,
} from "@/lib/standalone-form-mapper";

const TYPE_COLORS: Record<string, string> = {
  consultation:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  consent: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  referral:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  discharge:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  report:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  custom: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

function formatDateTime(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function FormAnswerPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { doctor, isAuthenticated, isLoading: authLoading } = useAuth();
  const formId = searchParams.get("id");
  const answerId = searchParams.get("answerId");

  const {
    form: backendForm,
    loading: formLoading,
    error: formError,
  } = useGetStandaloneForm(formId, {
    skip: authLoading || !isAuthenticated,
  });
  const {
    answers,
    loading: answersLoading,
    error: answersError,
  } = useGetStandaloneAnswers(formId, {
    skip: authLoading || !isAuthenticated || !formId,
  });
  const {
    answer,
    loading: selectedAnswerLoading,
    error: selectedAnswerError,
  } = useStandaloneAnswer(answerId, {
    skip: !answerId,
  });

  useEffect(() => {
    if (!formId) router.replace("/admin/formbuilder");
  }, [formId, router]);

  const selectedAnswer = useMemo(() => {
    if (answerId && answer) return answer;
    return null;
  }, [answer, answerId]);

  const rendererForm = useMemo(() => {
    if (!selectedAnswer) return null;
    return mapStandaloneAnswerToSavedForm(selectedAnswer);
  }, [selectedAnswer]);

  const selectedAnswers = useMemo(
    () =>
      selectedAnswer
        ? (parseStandaloneAnswers(selectedAnswer.answers) as Record<
            string,
            unknown
          >)
        : {},
    [selectedAnswer],
  );

  const preset = useMemo(
    () => TEMPLATE_PRESETS.find((p) => p.type === backendForm?.type),
    [backendForm?.type],
  );

  if (formLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (formError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {formError}
        </div>
      </div>
    );
  }

  if (!backendForm) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shrink-0"
              onClick={() => router.push("/admin/formbuilder")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground truncate">
                  {backendForm.name}
                </h1>
                {backendForm.isTemplate && (
                  <Badge variant="outline">Template</Badge>
                )}
                {preset && (
                  <Badge
                    className={`text-[10px] px-1.5 py-0 ${TYPE_COLORS[backendForm.type] ?? ""}`}
                  >
                    {preset.emoji} {preset.label}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                View all saved answers for this form.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() =>
                router.push(`/admin/formbuilder/edit?id=${backendForm.id}`)
              }
            >
              Edit Form
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
          <aside className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden xl:sticky xl:top-6 self-start z-10">
            <div className="border-b border-border px-4 py-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                  Answers
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {answersLoading
                  ? "Loading answers…"
                  : `${answers.length} answer${answers.length === 1 ? "" : "s"}`}
              </p>
            </div>

            <div className="max-h-[calc(100vh-240px)] overflow-y-auto p-3 space-y-2">
              {answersLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground px-2 py-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading answers…
                </div>
              )}

              {!answersLoading && answersError && (
                <div className="flex items-center gap-2 text-sm text-destructive px-2 py-3">
                  <AlertCircle className="h-4 w-4" />
                  {answersError}
                </div>
              )}

              {!answersLoading && !answersError && answers.length === 0 && (
                <div className="px-2 py-6 text-sm text-muted-foreground text-center">
                  No answers found for this form yet.
                </div>
              )}

              {!answersLoading &&
                !answersError &&
                answers.map((item) => {
                  const active = String(item.id) === String(answerId || "");
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        router.push(
                          `/admin/formbuilder/answer?id=${backendForm.id}&answerId=${item.id}`,
                        )
                      }
                      className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="uppercase">
                          {item.status}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {item.formVersion?.versionLabel ||
                            `v${item.formVersion?.majorVersion ?? 1}`}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarClock className="h-3 w-3" />
                          {formatDateTime(
                            item.submittedAt ||
                              item.updatedAt ||
                              item.createdAt,
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <UserRound className="h-3 w-3" />
                          Patient: {item.patientId || "-"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Stethoscope className="h-3 w-3" />
                          Visit: {item.visitId || "-"}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </aside>

          <section className="min-w-0">
            {answerId && selectedAnswerLoading && (
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading selected answer…
              </div>
            )}

            {answerId && selectedAnswerError && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {selectedAnswerError}
              </div>
            )}

            {!answerId && !answersLoading && answers.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center text-muted-foreground">
                Select an answer from the left to preview it.
              </div>
            )}

            {rendererForm && !selectedAnswerLoading && !selectedAnswerError && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <FormRenderer
                  form={rendererForm as SavedForm}
                  showTitle={true}
                  edit={false}
                  validate={false}
                  hideSubmit={true}
                  initialAnswers={selectedAnswers}
                  className="mx-auto max-w-3xl"
                />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default function FormAnswerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <FormAnswerPageInner />
    </Suspense>
  );
}
