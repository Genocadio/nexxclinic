"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import type { Patient, Visit, VisitDepartment } from "@/lib/api-types";
import type { FormAction } from "@/lib/form-storage";
import type { SavedForm } from "@/lib/formbuilder-storage";
import type { FormAnswers } from "@/components/formbuilder/form-renderer";
import { ConsultationFormRenderer } from "@/components/formbuilder/form-renderer";
import {
  useConsultationFormLoader,
  useSaveVisitStandaloneAnswer,
} from "@/hooks/standalone-forms";
import {
  mapStandaloneAnswerToSavedForm,
  mapStandaloneFormToSavedForm,
  parseStandaloneAnswers,
} from "@/lib/standalone-form-mapper";
import { ConsultationBottomDock } from "@/components/consultation/consultation-bottom-dock";
import InlineTryAgain from "@/components/inline-try-again";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StandaloneConsultationViewProps {
  visit: Visit;
  visitDepartment: VisitDepartment;
  patient: Patient;
  existingProducts?: FormAction[];
  onVisitRefetch?: () => void;
  onBack?: () => void;
}

export function StandaloneConsultationView({
  visit,
  visitDepartment,
  patient,
  existingProducts = [],
  onVisitRefetch,
  onBack,
}: StandaloneConsultationViewProps) {
  const router = useRouter();
  const catalogDepartmentId = String(visitDepartment.department?.id || "");
  const answerId = visitDepartment.answerId || null;

  const { answer, defaultForm, loading, error, refetch, source } =
    useConsultationFormLoader({
      departmentId: catalogDepartmentId,
      answerId,
    });

  const { saveVisitAnswer, loading: saving } = useSaveVisitStandaloneAnswer();

  const [rendererForm, setRendererForm] = useState<SavedForm | null>(null);
  const [formVersionId, setFormVersionId] = useState<string | null>(null);
  const [initialAnswers, setInitialAnswers] = useState<FormAnswers>({});
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [saveStatus, setSaveStatus] = useState<"saved" | "dirty" | "saving">("saved");
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    hydratedRef.current = false;
    setRendererForm(null);
    setFormVersionId(null);
    setInitialAnswers({});
    setAnswers({});
  }, [answerId, catalogDepartmentId]);

  useEffect(() => {
    if (loading || hydratedRef.current) return;

    if (source === "answer" && answer) {
      const mapped = mapStandaloneAnswerToSavedForm(answer);
      if (!mapped) return;
      const parsed = parseStandaloneAnswers(answer.answers);
      setRendererForm(mapped);
      setFormVersionId(answer.formVersion.id);
      setInitialAnswers(parsed);
      setAnswers(parsed);
      hydratedRef.current = true;
      setSaveStatus("saved");
      return;
    }

    if (source === "department" && defaultForm) {
      const mapped = mapStandaloneFormToSavedForm(defaultForm);
      if (!mapped || !defaultForm.activeVersion?.id) return;
      setRendererForm(mapped);
      setFormVersionId(defaultForm.activeVersion.id);
      setInitialAnswers({});
      setAnswers({});
      hydratedRef.current = true;
      setSaveStatus("saved");
    }
  }, [loading, source, answer, defaultForm]);

  const patientLabel = useMemo(() => {
    const name = [patient.firstName, patient.lastName].filter(Boolean).join(" ");
    return name || "Patient";
  }, [patient.firstName, patient.lastName]);

  const persistAnswers = useCallback(
    async (nextAnswers: FormAnswers, status: "DRAFT" | "FINAL") => {
      if (!formVersionId || !catalogDepartmentId) {
        throw new Error("Form context is missing");
      }
      setSaveStatus("saving");
      await saveVisitAnswer({
        visitId: visit.id,
        departmentId: catalogDepartmentId,
        formVersionId,
        answers: nextAnswers,
        status,
      });
      setSaveStatus("saved");
      onVisitRefetch?.();
    },
    [formVersionId, catalogDepartmentId, saveVisitAnswer, visit.id, onVisitRefetch],
  );

  const scheduleAutoSave = useCallback(
    (nextAnswers: FormAnswers) => {
      setAnswers(nextAnswers);
      setSaveStatus("dirty");
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        void persistAnswers(nextAnswers, "DRAFT").catch((err: unknown) => {
          setSaveStatus("dirty");
          toast.error(err instanceof Error ? err.message : "Auto-save failed");
        });
      }, 1500);
    },
    [persistAnswers],
  );

  const handleManualSave = async () => {
    try {
      await persistAnswers(answers, "DRAFT");
      toast.success("Draft saved");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleComplete = async () => {
    try {
      await persistAnswers(answers, "FINAL");
      toast.success("Consultation completed");
      router.push("/");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to complete consultation");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading consultation form…
      </div>
    );
  }

  if (error) {
    return <InlineTryAgain onTryAgain={() => void refetch()} />;
  }

  if (!rendererForm || !formVersionId) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center space-y-3">
        <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {answerId
            ? "Could not load the saved consultation answer."
            : "No default form is linked to this department. Link one in Admin → Departments."}
        </p>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Go back
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 pb-28">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{rendererForm.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {patientLabel} · {visitDepartment.department?.name || "Department"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {saveStatus === "saving"
              ? "Saving…"
              : saveStatus === "dirty"
                ? "Unsaved changes"
                : "Saved"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={saving}
            onClick={() => void handleManualSave()}
          >
            <Save className="h-4 w-4" />
            Save draft
          </Button>
        </div>
      </div>

      <ConsultationFormRenderer
        form={rendererForm}
        showTitle={false}
        hideSubmit
        initialAnswers={initialAnswers}
        controlledAnswers={answers}
        onControlledAnswersChange={scheduleAutoSave}
        visitId={visit.id}
        visitDepartmentId={visitDepartment.id}
        departmentId={catalogDepartmentId}
        visitDepartments={visit.departments}
        visitStatus={visit.status}
        visitDepartmentStatus={visitDepartment.status}
        existingProducts={existingProducts}
        onVisitRefetch={onVisitRefetch}
      />

      <ConsultationBottomDock onComplete={() => void handleComplete()} />
    </div>
  );
}
