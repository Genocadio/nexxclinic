"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormRendererHandle } from "@/components/formbuilder/form-renderer";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  FlaskConical,
  Loader2,
  StickyNote,
  X as XIcon,
  Minus,
  Plus,
  Search,
  MessageSquarePlus,
} from "lucide-react";
import { toast } from "react-toastify";
import type { Patient, Visit, VisitDepartment } from "@/lib/api-types";
import type { FormAction } from "@/lib/form-storage";
import type { SavedForm } from "@/lib/formbuilder-storage";
import { ConsultationFormRenderer } from "@/components/formbuilder/form-renderer";
import type { FormAnswers } from "@/components/formbuilder/form-renderer";
import { ConsultationBottomDock } from "@/components/consultation/consultation-bottom-dock";
import { ConsultationPreviousEncounters } from "@/components/consultation/consultation-previous-encounters";
import { ConsultationSidePanels } from "@/components/consultation/consultation-side-panels";
import { ConsultationPreviewSheet } from "@/components/dashboard/consultation-preview-sheet";
import PatientHistorySidePane from "@/components/patient-history-side-pane";
import VisitNotesFloating from "@/components/visit-notes-floating";
import InlineTryAgain from "@/components/inline-try-again";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDepartments } from "@/hooks/departments/hooks";
import { useProductSearch } from "@/hooks/products/hooks";
import {
  useAddChildVisitDepartment,
  useAddProductToVisitDepartment,
  useAddVisitDepartmentNote,
  useLastPatientDepartmentVisit,
  useMarkVisitDepartmentNotesViewed,
  useVisitDepartmentNotes,
} from "@/hooks/visits";
import {
  useConsultationFormLoader,
  useSaveVisitStandaloneAnswer,
} from "@/hooks/standalone-forms";
import {
  mapStandaloneAnswerToSavedForm,
  mapStandaloneFormToSavedForm,
  parseStandaloneAnswers,
} from "@/lib/standalone-form-mapper";
import { isVisitOrDepartmentClosedForProducts } from "@/lib/visit-product-lock";

interface StandaloneConsultationViewProps {
  visit: Visit;
  visitDepartment: VisitDepartment;
  patient: Patient;
  existingProducts?: FormAction[];
  onVisitRefetch?: () => void;
  onBack?: () => void;
}

interface PanelState {
  pinned: boolean;
  hover: boolean;
}

const normalizeSnapshotValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeSnapshotValue(item));
  }

  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = normalizeSnapshotValue(
          (value as Record<string, unknown>)[key],
        );
        return acc;
      }, {});
  }

  return value ?? null;
};

const buildAnswersSnapshot = (answers: FormAnswers) =>
  JSON.stringify(normalizeSnapshotValue(answers));

const isEditableChildVisitDepartmentStatus = (status?: string) => {
  const normalized = String(status || "").toUpperCase();
  return normalized !== "COMPLETED" && normalized !== "CANCELLED";
};

export function StandaloneConsultationView({
  visit,
  visitDepartment,
  patient,
  existingProducts = [],
  onVisitRefetch,
}: StandaloneConsultationViewProps) {
  const router = useRouter();
  const catalogDepartmentId = String(visitDepartment.department?.id || "");
  const answerId = visitDepartment.answerId || null;
  const requestProductsEnabled = Boolean(
    visitDepartment.department?.requestsProducts,
  );
  const productsLocked = isVisitOrDepartmentClosedForProducts(
    visit.status,
    visitDepartment.status,
  );
  const firstVisitDepartmentId = String(visitDepartment.id || "");

  const { answer, defaultForm, loading, error, refetch, source } =
    useConsultationFormLoader({
      departmentId: catalogDepartmentId,
      answerId,
    });
  const { saveVisitAnswer, loading: saving } = useSaveVisitStandaloneAnswer();
  const { addChildVisitDepartment } = useAddChildVisitDepartment();
  const { addProduct } = useAddProductToVisitDepartment();
  const { addVisitDepartmentNote } = useAddVisitDepartmentNote();
  const { markNotesViewed } = useMarkVisitDepartmentNotesViewed();
  const { notes: departmentNotes, refetch: refetchNotes } =
    useVisitDepartmentNotes(visit.id, firstVisitDepartmentId || null);
  const unreadNotesCount = (departmentNotes || []).filter(
    (note: any) => !note?.viewed,
  ).length;
  const { data: previousEncounterData } = useLastPatientDepartmentVisit(
    visit.id,
    catalogDepartmentId || null,
    { skip: !visit.id || !catalogDepartmentId },
  );

  const [rendererForm, setRendererForm] = useState<SavedForm | null>(null);
  const [formVersionId, setFormVersionId] = useState<string | null>(null);
  const [initialAnswers, setInitialAnswers] = useState<FormAnswers>({});
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [saveStatus, setSaveStatus] = useState<"saved" | "dirty" | "saving">(
    "saved",
  );

  const hasAnyAnswerContent = useMemo(() => {
    const hasContent = (value: unknown): boolean => {
      if (value == null) return false;
      if (typeof value === "string") return value.trim().length > 0;
      if (typeof value === "number" || typeof value === "boolean") return true;
      if (Array.isArray(value)) return value.some(hasContent);
      if (typeof value === "object") {
        return Object.values(value as Record<string, unknown>).some(hasContent);
      }
      return false;
    };

    return Object.values(answers || {}).some(hasContent);
  }, [answers]);
  const [notesOpen, setNotesOpen] = useState(false);
  const [patientHistoryOpen, setPatientHistoryOpen] = useState(false);
  const [previewConsultationOpen, setPreviewConsultationOpen] = useState(false);
  const [previewConsultationContext, setPreviewConsultationContext] = useState<{
    answerId: string;
    departmentName: string;
    patientName: string;
    previewStartedAt: number;
  } | null>(null);
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);
  const [requestProductsOpen, setRequestProductsOpen] = useState(false);
  const [activeChildNotesDepartmentId, setActiveChildNotesDepartmentId] =
    useState<string | null>(null);
  const [childNoteDraft, setChildNoteDraft] = useState("");
  const [addingChildNoteForId, setAddingChildNoteForId] = useState<
    string | null
  >(null);
  const [selectedRequestDepartmentId, setSelectedRequestDepartmentId] =
    useState<string | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [debouncedProductSearchQuery, setDebouncedProductSearchQuery] =
    useState("");
  const [productSearchFocused, setProductSearchFocused] = useState(false);
  const [pendingRequestProducts, setPendingRequestProducts] = useState<
    Array<{
      id: string;
      name: string;
      type?: string;
      code?: string;
      quantity: number;
    }>
  >([]);
  const [
    targetExistingChildVisitDepartmentId,
    setTargetExistingChildVisitDepartmentId,
  ] = useState<string | null>(null);
  const [requestComposerMode, setRequestComposerMode] = useState<
    "existing-child" | "other-service" | null
  >(null);
  const [isSubmittingInvestigations, setIsSubmittingInvestigations] =
    useState(false);
  const [requestErrorMessage, setRequestErrorMessage] = useState<string | null>(
    null,
  );
  const [idPanel, setIdPanel] = useState<PanelState>({
    pinned: false,
    hover: false,
  });
  const [vitalsPanel, setVitalsPanel] = useState<PanelState>({
    pinned: false,
    hover: false,
  });
  const [historyPanel, setHistoryPanel] = useState<PanelState>({
    pinned: false,
    hover: false,
  });

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedRef = useRef(false);
  const lastSavedSnapshotRef = useRef("");
  const saveInFlightRef = useRef(false);
  const autoPinnedVitalsRef = useRef(false);
  const investigationProductSearchRef = useRef<HTMLInputElement>(null);
  const formRendererRef = useRef<FormRendererHandle | null>(null);
  const localAnswerIdRef = useRef<string | null>(
    answerId ? String(answerId) : null,
  );
  const loadedAnswerSignatureRef = useRef<string>("");

  const patientLabel = useMemo(() => {
    const name = [patient.firstName, patient.lastName]
      .filter(Boolean)
      .join(" ");
    return name || "Patient";
  }, [patient.firstName, patient.lastName]);

  const parentVisitDepartment = useMemo(
    () =>
      visit.departments?.find(
        (dept) => String(dept.id) === String(visitDepartment.id),
      ) || visitDepartment,
    [visit.departments, visitDepartment],
  );
  const childInvestigationDepartments =
    parentVisitDepartment?.childVisitDepartments || [];
  const activeChildNotesDepartment = activeChildNotesDepartmentId
    ? childInvestigationDepartments.find(
        (dept) => String(dept.id) === String(activeChildNotesDepartmentId),
      ) || null
    : null;
  const {
    notes: activeChildDepartmentNotes = [],
    refetch: refetchActiveChildNotes,
  } = useVisitDepartmentNotes(visit.id, activeChildNotesDepartmentId || null);
  const hasUnreadChildRequestNotes = childInvestigationDepartments.some(
    (dept) => (dept.notes?.newNotes || 0) > 0,
  );
  const childRequestUnreadNotesCount = childInvestigationDepartments.reduce(
    (sum, dept) => sum + (dept.notes?.newNotes || 0),
    0,
  );

  const {
    departments: supportDepartments = [],
    loading: supportDepartmentsLoading,
    error: supportDepartmentsError,
  } = useDepartments({
    skip: !requestProductsEnabled,
    input: { supportRequests: true, page: 0, size: 200 },
  });

  const selectedRequestDepartment = selectedRequestDepartmentId
    ? supportDepartments.find(
        (dept) => String(dept.id) === String(selectedRequestDepartmentId),
      ) || null
    : null;

  const {
    products: requestProducts = [],
    loading: requestProductsLoading,
    error: requestProductsError,
  } = useProductSearch(debouncedProductSearchQuery, { size: 8 });

  const availableSupportDepartmentsForNewRequest = useMemo(() => {
    const requestedDepartmentIds = new Set(
      childInvestigationDepartments.map((dept) =>
        String(dept.department?.id || ""),
      ),
    );
    return supportDepartments.filter(
      (dept) =>
        String(dept.id) !== catalogDepartmentId &&
        !requestedDepartmentIds.has(String(dept.id)),
    );
  }, [supportDepartments, childInvestigationDepartments, catalogDepartmentId]);

  const canRequestFromOtherService = !productsLocked;
  const isAppendingToExistingChild =
    requestComposerMode === "existing-child" &&
    Boolean(targetExistingChildVisitDepartmentId);
  const showCurrentRequestSection =
    childInvestigationDepartments.length > 0 || canRequestFromOtherService;
  const showRequestComposer = requestComposerMode === null;
  const showProductSearchComposer = Boolean(
    selectedRequestDepartmentId && requestComposerMode,
  );
  const showProductSuggestionPanel =
    productSearchFocused && debouncedProductSearchQuery.length >= 2;

  const persistAnswers = useCallback(
    async (
      nextAnswers: FormAnswers,
      status: "DRAFT" | "FINAL",
      options?: { silent?: boolean; skipDuplicateCheck?: boolean },
    ) => {
      if (!formVersionId || !catalogDepartmentId) {
        throw new Error("Form context is missing");
      }

      const snapshot = buildAnswersSnapshot(nextAnswers);
      if (
        status === "DRAFT" &&
        !options?.skipDuplicateCheck &&
        snapshot === lastSavedSnapshotRef.current
      ) {
        setSaveStatus("saved");
        return null;
      }

      if (!options?.silent) {
        setSaveStatus("saving");
      }

      const result = await saveVisitAnswer({
        visitId: visit.id,
        visitDepartmentId: String(visitDepartment.id),
        formVersionId,
        answers: nextAnswers,
        status,
        answerId: localAnswerIdRef.current,
      });

      const savedAnswerId = result?.answer?.id;
      if (savedAnswerId) {
        localAnswerIdRef.current = String(savedAnswerId);
      }

      lastSavedSnapshotRef.current = snapshot;
      setSaveStatus("saved");
      hydratedRef.current = true;

      if (status === "FINAL") {
        onVisitRefetch?.();
      }

      return result;
    },
    [
      catalogDepartmentId,
      formVersionId,
      onVisitRefetch,
      saveVisitAnswer,
      visit.id,
      visitDepartment.id,
    ],
  );

  useEffect(() => {
    const nextAnswerId = answerId ? String(answerId) : null;
    const currentLocalAnswerId = localAnswerIdRef.current;

    if (!nextAnswerId && currentLocalAnswerId && hydratedRef.current) {
      return;
    }

    if (
      catalogDepartmentId &&
      nextAnswerId === currentLocalAnswerId &&
      hydratedRef.current
    ) {
      return;
    }

    localAnswerIdRef.current = nextAnswerId;
    loadedAnswerSignatureRef.current = "";
    hydratedRef.current = false;
    lastSavedSnapshotRef.current = "";
    setRendererForm(null);
    setFormVersionId(null);
    setInitialAnswers({});
    setAnswers({});
    setSaveStatus("saved");
  }, [answerId, catalogDepartmentId]);

  useEffect(() => {
    if (loading || hydratedRef.current) return;

    if (source === "answer" && answer) {
      const signature = JSON.stringify({
        id: answer.id,
        updatedAt: answer.updatedAt,
        formVersionId: answer.formVersion?.id,
      });
      if (
        loadedAnswerSignatureRef.current === signature &&
        hydratedRef.current
      ) {
        return;
      }

      const mapped = mapStandaloneAnswerToSavedForm(answer);
      if (!mapped) return;
      const parsed = parseStandaloneAnswers(answer.answers) as FormAnswers;
      setRendererForm(mapped);
      setFormVersionId(answer.formVersion.id);
      setInitialAnswers(parsed);
      setAnswers(parsed);
      localAnswerIdRef.current = String(answer.id);
      loadedAnswerSignatureRef.current = signature;
      lastSavedSnapshotRef.current = buildAnswersSnapshot(parsed);
      hydratedRef.current = true;
      setSaveStatus("saved");
      return;
    }

    if (source === "department" && defaultForm) {
      const signature = JSON.stringify({
        departmentId: catalogDepartmentId,
        formId: defaultForm.id,
        formVersionId: defaultForm.activeVersion?.id,
      });
      if (
        loadedAnswerSignatureRef.current === signature &&
        hydratedRef.current
      ) {
        return;
      }

      const mapped = mapStandaloneFormToSavedForm(defaultForm);
      if (!mapped || !defaultForm.activeVersion?.id) return;
      setRendererForm(mapped);
      setFormVersionId(defaultForm.activeVersion.id);
      setInitialAnswers({});
      setAnswers({});
      loadedAnswerSignatureRef.current = signature;
      lastSavedSnapshotRef.current = buildAnswersSnapshot({});
      hydratedRef.current = true;
      setSaveStatus("saved");
    }
  }, [loading, source, answer, defaultForm]);

  useEffect(() => {
    if (!visit?.vitalSigns?.length || autoPinnedVitalsRef.current) return;
    setVitalsPanel((current) =>
      current.pinned ? current : { ...current, pinned: true, hover: true },
    );
    autoPinnedVitalsRef.current = true;
  }, [visit?.vitalSigns?.length]);

  useEffect(() => {
    const trimmed = productSearchQuery.trim();
    const timer = window.setTimeout(() => {
      setDebouncedProductSearchQuery(trimmed.length >= 2 ? trimmed : "");
    }, 250);

    return () => window.clearTimeout(timer);
  }, [productSearchQuery]);

  useEffect(() => {
    if (!hydratedRef.current) return;

    const currentSnapshot = buildAnswersSnapshot(answers);
    if (currentSnapshot === lastSavedSnapshotRef.current) {
      if (!saveInFlightRef.current) {
        setSaveStatus("saved");
      }
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = null;
      }
      return;
    }

    setSaveStatus("dirty");

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(async () => {
      if (saveInFlightRef.current) return;

      const snapshotAtSaveStart = buildAnswersSnapshot(answers);
      if (snapshotAtSaveStart === lastSavedSnapshotRef.current) {
        setSaveStatus("saved");
        return;
      }

      saveInFlightRef.current = true;
      try {
        await persistAnswers(answers, "DRAFT", { silent: true });
      } catch (_err: unknown) {
        setSaveStatus("dirty");
      } finally {
        saveInFlightRef.current = false;
      }
    }, 1500);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [answers, persistAnswers]);

  const handleManualSave = async () => {
    try {
      await persistAnswers(answers, "DRAFT", { skipDuplicateCheck: true });
      toast.success("Draft saved");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleComplete = async () => {
    const valid = formRendererRef.current?.validateAndShowErrors() ?? true;
    if (!valid) {
      toast.error("Please complete required fields before finalising");
      return;
    }

    try {
      await persistAnswers(answers, "FINAL", { skipDuplicateCheck: true });
      toast.success("Consultation completed");
      router.push("/");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to complete consultation",
      );
    }
  };

  const resetInvestigationComposer = () => {
    setSelectedRequestDepartmentId(null);
    setTargetExistingChildVisitDepartmentId(null);
    setRequestComposerMode(null);
    setProductSearchQuery("");
    setDebouncedProductSearchQuery("");
    setPendingRequestProducts([]);
    setRequestErrorMessage(null);
  };

  const handleContinueExistingChildRequest = (childDept: VisitDepartment) => {
    setRequestComposerMode("existing-child");
    setTargetExistingChildVisitDepartmentId(String(childDept.id));
    setSelectedRequestDepartmentId(String(childDept.department?.id || ""));
    setRequestErrorMessage(null);
    window.setTimeout(() => investigationProductSearchRef.current?.focus(), 50);
  };

  const handleStartOtherServiceRequest = () => {
    setRequestComposerMode("other-service");
    setSelectedRequestDepartmentId(null);
    setTargetExistingChildVisitDepartmentId(null);
    setPendingRequestProducts([]);
    setRequestErrorMessage(null);
  };

  const handleSelectRequestDepartment = (value: string) => {
    setSelectedRequestDepartmentId(value);
    setRequestErrorMessage(null);
    window.setTimeout(() => investigationProductSearchRef.current?.focus(), 50);
  };

  const handleAddPendingRequestProduct = (product: {
    id: string;
    name: string;
    type?: string;
    code?: string;
  }) => {
    setPendingRequestProducts((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
    setProductSearchQuery("");
    setDebouncedProductSearchQuery("");
  };

  const handleUpdatePendingRequestProductQuantity = (
    productId: string,
    quantity: number,
  ) => {
    setPendingRequestProducts((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  };

  const handleRemovePendingRequestProduct = (productId: string) => {
    setPendingRequestProducts((prev) =>
      prev.filter((item) => item.id !== productId),
    );
  };

  const handleSubmitInvestigations = async () => {
    if (!selectedRequestDepartmentId || pendingRequestProducts.length === 0)
      return;

    setIsSubmittingInvestigations(true);
    setRequestErrorMessage(null);

    try {
      let targetVisitDepartmentId = targetExistingChildVisitDepartmentId;

      if (!targetVisitDepartmentId) {
        const created = await addChildVisitDepartment({
          parentVisitDepartmentId: firstVisitDepartmentId,
          departmentId: selectedRequestDepartmentId,
          products: [],
        });
        targetVisitDepartmentId = String(created?.data?.id || "");
      }

      if (!targetVisitDepartmentId) {
        throw new Error("Could not create request department");
      }

      for (const product of pendingRequestProducts) {
        await addProduct(
          visit.id,
          targetVisitDepartmentId,
          product.id,
          product.quantity,
        );
      }

      toast.success("Investigations updated");
      setRequestProductsOpen(false);
      resetInvestigationComposer();
      onVisitRefetch?.();
    } catch (err: unknown) {
      setRequestErrorMessage(
        err instanceof Error ? err.message : "Failed to submit investigations",
      );
    } finally {
      setIsSubmittingInvestigations(false);
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
    if (loading) {
      return (
        <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading consultation form…
        </div>
      );
    }
    return (
      <div className="rounded-xl border border-dashed p-8 text-center space-y-3">
        <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {answerId || localAnswerIdRef.current
            ? "Could not load the saved consultation answer."
            : "No default form is linked to this department. Link one in Admin → Departments."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 pb-28">
      <div className="fixed right-6 top-1/2 z-50 -translate-y-1/2 flex flex-col items-center gap-3 rounded-full border border-border/60 bg-card/80 p-2 shadow-2xl backdrop-blur">
        {requestProductsEnabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative rounded-full border border-border/70 bg-background p-2"
            title="Investigations"
            aria-label="Open investigations"
            onClick={() => setRequestProductsOpen(true)}
          >
            <FlaskConical className="h-5 w-5" />
            {!requestProductsOpen && hasUnreadChildRequestNotes && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold leading-5 text-center shadow-lg ring-2 ring-background animate-bounce">
                {childRequestUnreadNotesCount}
              </span>
            )}
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setNotesOpen((prev) => !prev)}
          className="relative rounded-full border border-border/70 bg-background p-2"
          title="Notes"
          aria-label="Open notes"
        >
          <StickyNote className="h-5 w-5" />
          {!notesOpen && unreadNotesCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold leading-5 text-center shadow-lg ring-2 ring-background animate-bounce">
              {unreadNotesCount}
            </span>
          )}
        </Button>
      </div>

      <ConsultationSidePanels
        patient={patient as any}
        vitals={visit?.vitalSigns || []}
        visitInsurances={visit?.patient?.patientInsurances || []}
        idPanel={idPanel}
        vitalsPanel={vitalsPanel}
        historyPanel={historyPanel}
        setIdPanel={setIdPanel}
        setVitalsPanel={setVitalsPanel}
        setHistoryPanel={setHistoryPanel}
        onOpenHistory={() => setPatientHistoryOpen(true)}
      />

      <ConsultationPreviousEncounters
        data={previousEncounterData}
        patientName={patientLabel}
        currentDepartmentId={catalogDepartmentId}
        hasAnsweredCurrentForm={hasAnyAnswerContent}
        onPreviewAnswerAction={({ answerId, departmentName, patientName }) => {
          setPreviewConsultationContext({
            answerId,
            departmentName,
            patientName,
            previewStartedAt: Date.now(),
          });
          setPreviewConsultationOpen(true);
        }}
      />

      <ConsultationFormRenderer
        ref={formRendererRef}
        form={rendererForm}
        showTitle={false}
        hideSubmit
        validate={false}
        initialAnswers={initialAnswers}
        controlledAnswers={answers}
        onControlledAnswersChange={setAnswers}
        visitId={visit.id}
        visitDepartmentId={String(visitDepartment.id)}
        departmentId={catalogDepartmentId}
        visitDepartments={visit.departments as any}
        visitStatus={visit.status}
        visitDepartmentStatus={visitDepartment.status}
        existingProducts={existingProducts}
        onVisitRefetch={onVisitRefetch}
      />

      {!patientHistoryOpen && (
        <ConsultationBottomDock
          onComplete={() => setShowFinalizeConfirm(true)}
          saveIndicator={{
            visible: hasAnyAnswerContent,
            status: saveStatus,
          }}
        />
      )}

      <Dialog open={showFinalizeConfirm} onOpenChange={setShowFinalizeConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Visit</DialogTitle>
            <DialogDescription>
              Choose whether to save this visit for later editing or finalise it
              now.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowFinalizeConfirm(false);
                void handleManualSave();
              }}
            >
              Complete Visit Edit Later
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowFinalizeConfirm(false);
                void handleComplete();
              }}
            >
              Finalise and Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet
        open={requestProductsOpen}
        onOpenChange={(open) => {
          setRequestProductsOpen(open);
          if (!open) resetInvestigationComposer();
        }}
      >
        <SheetContent
          side="right"
          showCloseButton={false}
          overlayClassName="z-[95] top-16 bottom-0 left-0 right-0"
          className="z-[100] top-16 bottom-0 h-auto w-full gap-0 border-l p-0 sm:max-w-lg flex flex-col"
        >
          <SheetHeader className="relative shrink-0 border-b border-border px-12 py-4">
            <button
              type="button"
              onClick={() => setRequestProductsOpen(false)}
              className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border border-border/70 bg-card flex items-center justify-center shadow-sm hover:bg-muted"
              aria-label="Close investigations"
              title="Close"
            >
              <XIcon className="h-4 w-4" />
            </button>
            <SheetTitle className="text-center">Investigations</SheetTitle>
          </SheetHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {showCurrentRequestSection && (
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-sm font-semibold">Current request</div>
                {childInvestigationDepartments.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {childInvestigationDepartments.map((childDept) => {
                      const canAddMoreProducts =
                        !productsLocked &&
                        isEditableChildVisitDepartmentStatus(childDept.status);
                      const isActiveTarget =
                        requestComposerMode === "existing-child" &&
                        String(targetExistingChildVisitDepartmentId || "") ===
                          String(childDept.id);
                      return (
                        <div
                          key={childDept.id}
                          className={`rounded-xl border bg-background p-3 ${isActiveTarget ? "border-primary/60 ring-1 ring-primary/20" : "border-border/70"}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-medium text-sm">
                              {childDept.department?.name || "Service"}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {childDept.status}
                            </span>
                          </div>
                          {(childDept.products || []).length > 0 ? (
                            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                              {(childDept.products || []).map((line) => (
                                <li key={line.id}>
                                  {line.product?.name || "Product"} ×{" "}
                                  {line.quantity}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-xs text-muted-foreground">
                              No products listed yet.
                            </p>
                          )}
                          <div className="mt-3 flex flex-col gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setActiveChildNotesDepartmentId(
                                  String(childDept.id),
                                );
                                setChildNoteDraft("");
                              }}
                            >
                              <MessageSquarePlus className="mr-2 h-4 w-4" />
                              Add consultation note
                              {(childDept.notes?.newNotes || 0) > 0 && (
                                <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground animate-bounce">
                                  {childDept.notes?.newNotes || 0}
                                </span>
                              )}
                            </Button>
                            {canAddMoreProducts && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() =>
                                  handleContinueExistingChildRequest(childDept)
                                }
                              >
                                Add more products
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No service requests on this visit yet.
                  </p>
                )}

                {canRequestFromOtherService && requestProductsEnabled && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => handleStartOtherServiceRequest()}
                  >
                    Request from other service
                  </Button>
                )}
              </div>
            )}

            {requestComposerMode === "other-service" && !productsLocked && (
              <div className="space-y-2 rounded-xl border border-border p-4 bg-background">
                <div className="text-sm font-semibold">Service department</div>
                {supportDepartmentsLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Loading services…
                  </p>
                ) : supportDepartmentsError ? (
                  <p className="text-sm text-destructive">
                    Failed to load services: {supportDepartmentsError}
                  </p>
                ) : availableSupportDepartmentsForNewRequest.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    All services are already requested on this visit.
                  </p>
                ) : (
                  <Select
                    value={selectedRequestDepartmentId || undefined}
                    onValueChange={(val) =>
                      handleSelectRequestDepartment(String(val))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose service department" />
                    </SelectTrigger>
                    <SelectContent className="z-[110]">
                      {availableSupportDepartmentsForNewRequest.map((dept) => (
                        <SelectItem
                          key={dept.id}
                          value={String(dept.id)}
                          className="text-sm"
                        >
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {showProductSearchComposer && selectedRequestDepartment && (
              <div className="space-y-4 rounded-xl border border-border p-4 bg-background">
                <div className="space-y-1 text-center">
                  <div className="text-sm font-semibold">
                    {selectedRequestDepartment.name} request
                  </div>
                  {isAppendingToExistingChild && (
                    <p className="text-xs text-muted-foreground">
                      Adding products to an existing open request
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className="sr-only"
                    htmlFor="investigation-product-search"
                  >
                    Search product
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      ref={investigationProductSearchRef}
                      id="investigation-product-search"
                      type="search"
                      value={productSearchQuery}
                      onChange={(event) =>
                        setProductSearchQuery(event.target.value)
                      }
                      onFocus={() => setProductSearchFocused(true)}
                      onBlur={() => {
                        window.setTimeout(() => {
                          if (
                            document.activeElement !==
                            investigationProductSearchRef.current
                          ) {
                            setProductSearchFocused(false);
                          }
                        }, 150);
                      }}
                      placeholder="Search product…"
                      className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-9 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      autoComplete="off"
                    />
                    {productSearchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setProductSearchQuery("");
                          setDebouncedProductSearchQuery("");
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Clear search"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    )}
                    {showProductSuggestionPanel && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
                        {requestProductsLoading ? (
                          <p className="px-3 py-2 text-sm text-muted-foreground">
                            Searching…
                          </p>
                        ) : requestProductsError ? (
                          <p className="px-3 py-2 text-sm text-destructive">
                            Search failed.
                          </p>
                        ) : requestProducts.length === 0 ? (
                          <p className="px-3 py-2 text-sm text-muted-foreground">
                            No products found.
                          </p>
                        ) : (
                          <ul className="max-h-48 overflow-y-auto py-1">
                            {requestProducts.map((product: any) => {
                              const alreadyAdded = pendingRequestProducts.some(
                                (item) => item.id === String(product.id),
                              );
                              return (
                                <li key={product.id}>
                                  <button
                                    type="button"
                                    disabled={alreadyAdded}
                                    onMouseDown={(event) =>
                                      event.preventDefault()
                                    }
                                    onClick={() =>
                                      handleAddPendingRequestProduct({
                                        id: String(product.id),
                                        name: product.name,
                                        type: product.type,
                                        code: product.code,
                                      })
                                    }
                                    className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <span className="font-medium">
                                      {product.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {product.type || "Product"} •{" "}
                                      {product.code || "No code"}
                                      {alreadyAdded ? " • Added" : ""}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {requestErrorMessage && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {requestErrorMessage}
                  </div>
                )}

                {pendingRequestProducts.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Added products
                    </div>
                    <ul className="space-y-2">
                      {pendingRequestProducts.map((product) => (
                        <li
                          key={product.id}
                          className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {product.type || "Product"} •{" "}
                              {product.code || "No code"}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              aria-label={`Decrease quantity for ${product.name}`}
                              disabled={product.quantity <= 1}
                              onClick={() =>
                                handleUpdatePendingRequestProductQuantity(
                                  product.id,
                                  product.quantity - 1,
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <input
                              type="number"
                              min={1}
                              step={1}
                              value={product.quantity}
                              onChange={(event) => {
                                const parsed = Number(event.target.value);
                                if (Number.isFinite(parsed)) {
                                  handleUpdatePendingRequestProductQuantity(
                                    product.id,
                                    parsed,
                                  );
                                }
                              }}
                              onBlur={(event) => {
                                const parsed = Number(event.target.value);
                                if (!Number.isFinite(parsed) || parsed < 1) {
                                  handleUpdatePendingRequestProductQuantity(
                                    product.id,
                                    1,
                                  );
                                }
                              }}
                              className="h-7 w-12 rounded-md border border-border bg-background text-center text-xs tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              aria-label={`Quantity for ${product.name}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              aria-label={`Increase quantity for ${product.name}`}
                              onClick={() =>
                                handleUpdatePendingRequestProductQuantity(
                                  product.id,
                                  product.quantity + 1,
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemovePendingRequestProduct(product.id)
                            }
                            className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label={`Remove ${product.name}`}
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeChildNotesDepartment && (
              <div className="space-y-3 rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">
                      {activeChildNotesDepartment.department?.name || "Service"}{" "}
                      notes
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Consultation notes dedicated to this child request.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveChildNotesDepartmentId(null);
                      setChildNoteDraft("");
                    }}
                  >
                    Close
                  </Button>
                </div>

                <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl border border-border bg-background p-3">
                  {activeChildDepartmentNotes.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No notes yet.
                    </p>
                  ) : (
                    activeChildDepartmentNotes.map((note: any) => (
                      <div
                        key={note.id}
                        className="rounded-lg border border-border/70 bg-card p-2"
                        onClick={async () => {
                          if (!note?.viewed && activeChildNotesDepartmentId) {
                            await markNotesViewed(activeChildNotesDepartmentId);
                            await refetchActiveChildNotes();
                            onVisitRefetch?.();
                          }
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {note.noteType || "CONSULTATION"}
                            {!note.viewed && (
                              <span className="ml-1 rounded-full bg-primary px-1 text-[9px] text-primary-foreground animate-pulse">
                                NEW
                              </span>
                            )}
                          </p>
                          <span className="text-[10px] text-muted-foreground">
                            {note.createdAt
                              ? new Date(note.createdAt).toLocaleString()
                              : ""}
                          </span>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-xs text-foreground">
                          {note.content || ""}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-2">
                  <textarea
                    value={childNoteDraft}
                    onChange={(event) => setChildNoteDraft(event.target.value)}
                    placeholder="Add consultation note for this child request..."
                    className="min-h-24 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-muted-foreground">
                      Saved as consultation notes on this child visit
                      department.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      disabled={
                        !childNoteDraft.trim() ||
                        addingChildNoteForId === activeChildNotesDepartment.id
                      }
                      onClick={async () => {
                        const visitDepartmentId = String(
                          activeChildNotesDepartment.id || "",
                        );
                        if (!visitDepartmentId) return;
                        setAddingChildNoteForId(visitDepartmentId);
                        try {
                          const result = await addVisitDepartmentNote(
                            visitDepartmentId,
                            childNoteDraft.trim(),
                            "CONSULTATION",
                          );
                          if (result?.status !== "SUCCESS") {
                            throw new Error(
                              result?.message || "Failed to add note",
                            );
                          }
                          await markNotesViewed(visitDepartmentId);
                          setChildNoteDraft("");
                          await refetchActiveChildNotes();
                          onVisitRefetch?.();
                        } catch (err: unknown) {
                          toast.error(
                            err instanceof Error
                              ? err.message
                              : "Failed to add note",
                          );
                        } finally {
                          setAddingChildNoteForId(null);
                        }
                      }}
                    >
                      {addingChildNoteForId === activeChildNotesDepartment.id
                        ? "Saving..."
                        : "Save note"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {(showRequestComposer || showProductSearchComposer) && (
            <SheetFooter className="shrink-0 border-t border-border px-4 py-4">
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                {showRequestComposer &&
                  childInvestigationDepartments.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={resetInvestigationComposer}
                      disabled={isSubmittingInvestigations}
                      className="sm:mr-auto"
                    >
                      Back
                    </Button>
                  )}
                {showProductSearchComposer && (
                  <Button
                    onClick={handleSubmitInvestigations}
                    disabled={
                      isSubmittingInvestigations ||
                      !firstVisitDepartmentId ||
                      !selectedRequestDepartmentId ||
                      pendingRequestProducts.length === 0
                    }
                  >
                    {isSubmittingInvestigations
                      ? "Submitting…"
                      : pendingRequestProducts.length === 0
                        ? isAppendingToExistingChild
                          ? "Add products"
                          : "Request products"
                        : isAppendingToExistingChild
                          ? `Add ${pendingRequestProducts.length} product${pendingRequestProducts.length === 1 ? "" : "s"}`
                          : `Request ${pendingRequestProducts.length} product${pendingRequestProducts.length === 1 ? "" : "s"}`}
                  </Button>
                )}
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      <VisitNotesFloating
        title="Consultation Notes"
        notes={departmentNotes}
        noteTypes={["BILLING", "FORMS", "CONSULTATION", "ADMIN", "PUBLIC"]}
        open={notesOpen}
        onOpenChange={setNotesOpen}
        hideToggleButton
        onAddNote={async (noteType, content) => {
          if (!firstVisitDepartmentId)
            throw new Error("No department selected for consultation note");
          const result = await addVisitDepartmentNote(
            firstVisitDepartmentId,
            content,
            noteType,
          );
          if (result?.status !== "SUCCESS") {
            throw new Error(result?.message || "Failed to add note");
          }
          await refetchNotes();
          onVisitRefetch?.();
        }}
        onMarkAsViewed={async () => {
          await markNotesViewed(firstVisitDepartmentId);
          await refetchNotes();
          onVisitRefetch?.();
        }}
      />

      {patientHistoryOpen && (
        <PatientHistorySidePane
          patientId={patient.id}
          currentVisitId={visit.id || ""}
          currentVisitDepartmentId={String(visitDepartment.id || "") || null}
          onPreviewDepartmentAnswers={({
            answerId,
            departmentName,
            patientName,
          }) => {
            setPreviewConsultationContext({
              answerId,
              departmentName,
              patientName,
              previewStartedAt: Date.now(),
            });
            setPreviewConsultationOpen(true);
          }}
          onClose={() => setPatientHistoryOpen(false)}
        />
      )}

      <ConsultationPreviewSheet
        open={previewConsultationOpen}
        onOpenChange={(open) => {
          setPreviewConsultationOpen(open);
          if (!open) {
            setPreviewConsultationContext(null);
          }
        }}
        answerId={previewConsultationContext?.answerId || null}
        departmentName={previewConsultationContext?.departmentName}
        patientName={previewConsultationContext?.patientName}
        previewStartedAt={previewConsultationContext?.previewStartedAt || null}
      />
    </div>
  );
}
