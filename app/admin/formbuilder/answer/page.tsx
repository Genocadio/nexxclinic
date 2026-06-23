"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, FilePenLine, Loader2 } from "lucide-react";
import { fbGetForm, type SavedForm } from "@/lib/formbuilder-storage";
import { TEMPLATE_PRESETS } from "@/lib/formbuilder-presets";
import { FormRenderer, type FormAnswers } from "@/components/formbuilder/form-renderer";

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

function FormAnswerPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { doctor } = useAuth();
  const formId = searchParams.get("id");

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<SavedForm | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<FormAnswers | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!formId) {
      router.replace("/admin/formbuilder");
      return;
    }
    const loaded = fbGetForm(formId);
    if (!loaded) {
      router.replace("/admin/formbuilder");
      return;
    }
    setForm(loaded);
  }, [formId, router]);

  const preset = useMemo(
    () => TEMPLATE_PRESETS.find((p) => p.type === form?.type),
    [form?.type],
  );

  if (!mounted || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
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
                  {form.name}
                </h1>
                {preset && (
                  <Badge className={`text-[10px] px-1.5 py-0 ${TYPE_COLORS[form.type] ?? ""}`}>
                    {preset.emoji} {preset.label}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Answer this form using the reusable answer renderer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => router.push(`/admin/formbuilder/edit?id=${form.id}`)}
            >
              <FilePenLine className="h-4 w-4" />
              Edit Form
            </Button>
          </div>
        </div>

        {submittedAnswers && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/20 px-4 py-3 flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Form submitted in answer mode
              </p>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                Answers were captured successfully in the reusable renderer. They are currently kept in page state only.
              </p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="px-6 py-5 sm:px-8 sm:py-8">
            <FormRenderer
              form={form}
              showTitle={false}
              validate={true}
              submitLabel="Submit Answers"
              onSubmit={setSubmittedAnswers}
              edit={true}
            />
          </div>
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
