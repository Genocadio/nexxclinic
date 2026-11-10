"use client";

import { useAuth } from "@/lib/auth-context";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormRendererHandle } from "@/components/formbuilder/form-renderer";
import { useRouter } from "@/lib/navigation";
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
  Check,
  Lock,
  Receipt,
  Users,
  User,
  HeartPulse,
  History as HistoryIcon,
  ChevronDown,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";
import { useVisitLiveness, isViewerBilling } from "@/hooks/use-visit-liveness";
import {
  playNoteNotificationSound,
  playBillingNotificationSound,
} from "@/lib/sound-notifications";
import { useConfirmVisitDepartmentProduct } from "@/hooks/billing/hooks";
import type { Patient, Visit, VisitDepartment } from "@/lib/api-types";
import type { FormAction } from "@/lib/form-storage";
import type { SavedForm } from "@/lib/formbuilder-storage";
import { formatRWF, cn } from "@/lib/utils";
import { getInsuranceAwarePricing } from "@/lib/insurance-utils";
import { ConsultationFormRenderer } from "@/components/formbuilder/form-renderer";
import type { FormAnswers } from "@/components/formbuilder/form-renderer";
import { ConsultationBottomDock } from "@/components/consultation/consultation-bottom-dock";
import { ConsultationPreviousEncounters } from "@/components/consultation/consultation-previous-encounters";
import { ConsultationPreviewSheet } from "@/components/dashboard/consultation-preview-sheet";
import PatientHistorySidePane from "@/components/patient-history-side-pane";
import VisitNotesFloating from "@/components/visit-notes-floating";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useHoverPin } from "@/hooks/use-hover-pin";
import { PatientIdentificationDropdownContent } from "@/components/consultation/consultation-top-dropdowns";
import { ConsultationPatientHeaderStrip } from "@/components/consultation/consultation-patient-header-strip";
import { ConsultationVitalsTicker } from "@/components/consultation/consultation-vitals-ticker";
import { isNoteUnreadForUser } from "@/lib/note-utils";
import {
  ConsultationLiveToasts,
  type LiveToastItem,
} from "@/components/consultation/consultation-live-toasts";
import InlineTryAgain from "@/components/inline-try-again";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/ui/page-loading";
import { Skeleton } from "@/components/ui/skeleton";
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
  useAddVisitVitalSigns,
  useLastPatientDepartmentVisit,
  useMarkVisitDepartmentNotesViewed,
  useVisitDepartmentNotes,
} from "@/hooks/visits";
import { useUpdateVisitDepartmentStatus } from "@/hooks/visits/department-mutations";
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
import { stripClinicalAnswers } from "@/components/formbuilder/extensions/consultation-visit/utils";
import { normalizeVisitVitalSigns } from "@/hooks/visits/vital-signs";
import { calculateAge } from "@/lib/validation-utils";
import { PatientInsuranceBadge } from "@/components/patient-insurance-badge";
import { calculateAnthropometrics } from "@/lib/mews-utils";

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
  const firstVisitDepartmentId = String(visitDepartment.id || "");

  // Real-time overrides from SSE events to ensure instant reflection
  const [liveVisitFinalised, setLiveVisitFinalised] = useState(
    String(visit.status || "").toUpperCase() === "FINALISED",
  );
  const [liveDepartmentStatus, setLiveDepartmentStatus] = useState<string | null>(
    visitDepartment.status ? String(visitDepartment.status).toUpperCase() : null,
  );
  const [liveBilled, setLiveBilled] = useState(false);

  useEffect(() => {
    if (String(visit.status || "").toUpperCase() === "FINALISED") {
      setLiveVisitFinalised(true);
    }
  }, [visit.status]);

  useEffect(() => {
    if (visitDepartment.status) {
      setLiveDepartmentStatus(String(visitDepartment.status).toUpperCase());
    }
  }, [visitDepartment.status]);

  const { doctor } = useAuth();
  const refetchNotesRef = useRef<() => Promise<any> | void>(() => {});
  const refetchActiveChildNotesRef = useRef<() => Promise<any> | void>(() => {});

  // Dedicated clinical real-time floating notifications (bottom-right)
  const [liveToasts, setLiveToasts] = useState<LiveToastItem[]>([]);
  const [dismissedPersistentIds, setDismissedPersistentIds] = useState<Set<string>>(new Set());

  const addLiveToast = useCallback((toast: Omit<LiveToastItem, "id"> & { id?: string }) => {
    const id = toast.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setLiveToasts((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      return [...filtered, { ...toast, id }];
    });

    if (!toast.persistent) {
      setTimeout(() => {
        setLiveToasts((prev) => prev.filter((t) => t.id !== id));
      }, 6000);
    }
  }, []);

  const handleDismissLiveToast = useCallback((id: string) => {
    setLiveToasts((prev) => prev.filter((t) => t.id !== id));
    setDismissedPersistentIds((prev) => new Set(prev).add(id));
  }, []);

  // Real-time presence and SSE handling for consultation
  const { billingViewers, otherViewers, updateActivity } = useVisitLiveness(visit.id, {
    onBillingPersonnelOpened: (viewer) => {
      addLiveToast({
        id: `billing-opened-${viewer.workerId}`,
        variant: "presence",
        title: "Billing Opened",
        message: `${viewer.name} opened this visit for billing.`,
      });
      playNoteNotificationSound();
    },
    onSseEvent: (detail) => {
      const eventVisitId = String(detail.visitId || "").toLowerCase();
      const currentVisitId = String(visit.id || "").toLowerCase();
      if (eventVisitId && currentVisitId && eventVisitId !== currentVisitId) return;

      const isSelfEvent = Boolean(
        (detail.actorId && doctor?.id && String(detail.actorId) === String(doctor.id)) ||
        manualSaveRef.current ||
        finalisingRef.current
      );

      if (detail.type === "BILLING_COMPLETED") {
        if (!isSelfEvent) {
          const actor = detail.actorName ? ` by ${detail.actorName}` : "";
          addLiveToast({
            variant: "billing",
            title: "Billing Completed",
            message: `This visit has been billed${actor}.`,
          });
          playBillingNotificationSound();
        }
        setLiveBilled(true);
        onVisitRefetch?.();
      } else if (detail.type === "VISIT_DEPARTMENT_STATE_CHANGED") {
        const deptStatus = String(detail.departmentStatus || "").toUpperCase();
        const actor = detail.actorName ? ` by ${detail.actorName}` : "";

        if (deptStatus === "BILLING") {
          if (!isSelfEvent) {
            addLiveToast({
              variant: "billing",
              title: "Sent to Billing",
              message: `This visit was sent to billing${actor}.`,
            });
          }
          setLiveDepartmentStatus("BILLING");
        } else if (deptStatus === "ACTIVE") {
          if (!isSelfEvent) {
            addLiveToast({
              variant: "success",
              title: "Consultation Resumed",
              message: `Consultation resumed${actor}.`,
            });
          }
          setLiveDepartmentStatus("ACTIVE");
          setLiveBilled(false);
          setLocallyFinalised(false);
        } else if (deptStatus === "FINALISED") {
          if (!isSelfEvent) {
            addLiveToast({
              variant: "finalised",
              title: "Department Finalised",
              message: `This visit department has been finalised${actor}.`,
            });
          }
          setLiveDepartmentStatus("FINALISED");
        } else if (deptStatus === "COMPLETED") {
          if (!isSelfEvent) {
            addLiveToast({
              variant: "success",
              title: "Department Completed",
              message: `Department completed${actor}.`,
            });
          }
          setLiveDepartmentStatus("COMPLETED");
        }
        onVisitRefetch?.();
      } else if (detail.type === "VISIT_DISCHARGED") {
        if (!isSelfEvent) {
          const actor = detail.actorName ? ` by ${detail.actorName}` : "";
          addLiveToast({
            variant: "finalised",
            title: "Visit Finalised",
            message: `This visit has been finalised${actor}.`,
          });
        }
        setLiveVisitFinalised(true);
        onVisitRefetch?.();
      } else if (detail.type === "VISIT_PRODUCT_CHANGED") {
        addLiveToast({
          variant: "product",
          title: "Orders Updated",
          message: "Products or investigation requests updated.",
          onClick: () => {
            if (requestProductsEnabled) setRequestProductsOpen(true);
          },
        });
        onVisitRefetch?.();
      } else if (detail.type === "VISIT_NOTE_ADDED") {
        if (detail.actorId !== doctor?.id) {
          const typeLabel = detail.metadata?.noteType
            ? `${String(detail.metadata.noteType).toLowerCase()} `
            : "";
          const actor = detail.actorName ? ` by ${detail.actorName}` : "";
          addLiveToast({
            variant: "note",
            title: "New Note Added",
            message: `New ${typeLabel}note added${actor}. Click to view.`,
            onClick: () => {
              notesHoverPin.setPinned(true);
            },
          });
          playNoteNotificationSound();
        }
        void refetchNotesRef.current?.();
        void refetchActiveChildNotesRef.current?.();
        onVisitRefetch?.();
      } else if (detail.type === "VISIT_CANCELLED") {
        if (!isSelfEvent) {
          addLiveToast({
            variant: "warning",
            title: "Visit Cancelled",
            message: `This visit has been cancelled.`,
          });
        }
        onVisitRefetch?.();
      } else if (detail.type === "VISIT_REOPENED") {
        if (!isSelfEvent) {
          addLiveToast({
            variant: "info",
            title: "Visit Reopened",
            message: `This visit has been reopened.`,
          });
        }
        setLiveVisitFinalised(false);
        setLiveDepartmentStatus(null);
        setLiveBilled(false);
        onVisitRefetch?.();
      }
    },
  });

  // Freeze the loader's answer input for the life of this mount. Once hydrated,
  // the loader must NOT flip sources (department → answer) when the parent's
  // visit cache echoes back the answerId we just created — that flip unmounted
  // the form to a spinner and could dead-end on "Could not load the saved
  // consultation answer.". The created id is tracked in localAnswerIdRef for
  // subsequent saves, so the loader only needs the id present at mount time.
  const [loaderAnswerId, setLoaderAnswerId] = useState<string | null>(answerId);
  const loaderDepartmentRef = useRef(catalogDepartmentId);
  const [locallyFinalised, setLocallyFinalised] = useState(false);
  const [isFinalising, setIsFinalising] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const { answer, defaultForm, loading, error, refetch, source } =
    useConsultationFormLoader({
      departmentId: catalogDepartmentId,
      answerId: loaderAnswerId,
    });

  const effectiveVisitStatus = liveVisitFinalised
    ? "FINALISED"
    : String(visit.status || "").toUpperCase();

  const effectiveDepartmentStatus =
    liveDepartmentStatus ||
    String(visitDepartment.status || "").toUpperCase();

  const isCancelled =
    effectiveVisitStatus === "CANCELLED" ||
    effectiveDepartmentStatus === "CANCELLED";

  const isVisitFinalised = effectiveVisitStatus === "FINALISED";
  const isDepartmentFinalised = effectiveDepartmentStatus === "FINALISED";
  const isFinalised = isVisitFinalised || isDepartmentFinalised || locallyFinalised;

  const isDepartmentBilling = effectiveDepartmentStatus === "BILLING";
  const isDepartmentCompleted = effectiveDepartmentStatus === "COMPLETED";

  const hasBilledProducts = Boolean(
    visitDepartment.products?.some(
      (p) => String(p.billingState || "").toUpperCase() === "BILLED",
    ),
  );

  const isDepartmentEditing =
    effectiveDepartmentStatus === "DEPARTMENT_EDITING" ||
    visitDepartment.status === "DEPARTMENT_EDITING";

  const isReturnedFromBilling = Boolean(
    visit?.hasReturnedFromBilling ||
    visitDepartment?.lastRoutingAction === "SENT_BACK" ||
    (visitDepartment?.status === "ACTIVE" && visit?.hasReturnedFromBilling)
  );

  // A department is only locked for products if finance has actually billed/settled products (hasBilledProducts or liveBilled)
  // while not in DEPARTMENT_EDITING status AND NOT returned from billing.
  // Unbilled products in BILLING status and visits returned from billing remain editable during continued consultation.
  const isLockedInBilling =
    (hasBilledProducts || liveBilled) &&
    !isDepartmentEditing &&
    !isReturnedFromBilling;
  const isActuallyBilled = isLockedInBilling;
  const isBilled = isLockedInBilling;

  const isFinalisedAnswer =
    !isDepartmentEditing &&
    (isFinalised ||
      String(answer?.status || "").toUpperCase() === "FINAL" ||
      String(answer?.status || "").toUpperCase() === "SUBMITTED" ||
      Boolean(visitDepartment.hasFinalizedConsultationAnswers));
  const isTerminalVisit =
    visit?.status === "COMPLETED" ||
    visit?.status === "FINALISED" ||
    isFinalised;

  const productsLocked = isCancelled || isFinalised || isActuallyBilled || isDepartmentCompleted;
  const { updateDepartmentStatus } = useUpdateVisitDepartmentStatus();
  const { saveVisitAnswer } = useSaveVisitStandaloneAnswer();
  const { addChildVisitDepartment } = useAddChildVisitDepartment();
  const { addProduct } = useAddProductToVisitDepartment();
  const { confirmVisitDepartmentProduct } = useConfirmVisitDepartmentProduct();
  const [confirmingChildProductId, setConfirmingChildProductId] = useState<string | null>(null);
  const { addVisitDepartmentNote } = useAddVisitDepartmentNote();
  const { addVisitVitalSigns } = useAddVisitVitalSigns();
  const { markNotesViewed } = useMarkVisitDepartmentNotesViewed();
  const { notes: departmentNotes, refetch: refetchNotes } =
    useVisitDepartmentNotes(visit.id, firstVisitDepartmentId || null);
  refetchNotesRef.current = refetchNotes;
  const userRoles = doctor?.roles || [];
  const currentUserId = doctor?.id;
  const unreadNotesCount = isTerminalVisit
    ? 0
    : (departmentNotes || []).filter((note: any) =>
        isNoteUnreadForUser(note, userRoles, currentUserId, visitDepartment)
      ).length;
  const { data: previousEncounterData } = useLastPatientDepartmentVisit(
    visit.id,
    catalogDepartmentId || null,
    { skip: !visit.id || !catalogDepartmentId },
  );

  // Live product tracking for real-time notifications (product added / quantity updated)
  const prevProductsRef = useRef<Array<{ id: string; name: string; quantity: number; billingState?: string }>>([]);

  useEffect(() => {
    const currentProducts = (visitDepartment.products || []).map((p: any) => ({
      id: String(p.id || p.productId || ""),
      name: String(p.product?.name || p.name || "Product"),
      quantity: Number(p.quantity ?? 1),
      billingState: String(p.billingState || "").toUpperCase(),
    }));

    if (prevProductsRef.current.length === 0 && currentProducts.length > 0) {
      prevProductsRef.current = currentProducts;
      return;
    }

    const prevMap = new Map(prevProductsRef.current.map((p) => [p.id, p]));

    for (const curr of currentProducts) {
      const prev = prevMap.get(curr.id);
      if (!prev) {
        addLiveToast({
          id: `product-added-${curr.id}`,
          variant: "product",
          title: "Product Added",
          message: `${curr.name} (Qty: ${curr.quantity}) added to visit.`,
        });
      } else if (prev.quantity !== curr.quantity) {
        addLiveToast({
          id: `product-qty-${curr.id}-${curr.quantity}`,
          variant: "product",
          title: "Quantity Updated",
          message: `${curr.name}: quantity updated (${prev.quantity} → ${curr.quantity}).`,
        });
      }
    }

    prevProductsRef.current = currentProducts;
  }, [visitDepartment.products, addLiveToast]);

  // Merge live transient notifications with active persistent state toasts
  const allLiveToasts = useMemo(() => {
    const list: LiveToastItem[] = [...liveToasts];

    // Presence: Billing viewers
    if (billingViewers.length > 0 && !dismissedPersistentIds.has("presence-billing")) {
      list.push({
        id: "presence-billing",
        title: "Billing Viewing Visit",
        message: `${billingViewers.map((v) => v.name).join(", ")} is currently viewing this visit.`,
        variant: "presence",
        persistent: true,
      });
    }

    // Presence: Colleague viewers
    if (otherViewers && otherViewers.length > 0 && !dismissedPersistentIds.has("presence-others")) {
      list.push({
        id: "presence-others",
        title: "Colleague Viewing",
        message: `${otherViewers.map((v) => v.name).join(", ")} is currently viewing this visit.`,
        variant: "presence",
        persistent: true,
      });
    }

    // Status: Visit In Billing
    if (!isFinalised && isBilled && !dismissedPersistentIds.has("state-billing")) {
      list.push({
        id: "state-billing",
        title: "Visit In Billing",
        message: "Currently open or billed by finance. Products and records are locked.",
        variant: "billing",
        persistent: true,
      });
    }

    // Status: Visit Finalised
    if (isFinalised && !dismissedPersistentIds.has("state-finalised")) {
      list.push({
        id: "state-finalised",
        title: "Visit Finalised",
        message: "Consultation is finalised. Records and products are locked.",
        variant: "finalised",
        persistent: true,
      });
    }

    return list;
  }, [
    liveToasts,
    billingViewers,
    otherViewers,
    isBilled,
    isFinalised,
    dismissedPersistentIds,
  ]);

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
  const notesHoverPin = useHoverPin({ graceMs: 180 });

  // Auto-open unread dedicated notes until marked as read
  useEffect(() => {
    if (unreadNotesCount > 0) {
      notesHoverPin.setPinned(true);
    }
  }, [unreadNotesCount, notesHoverPin]);
  const [patientHistoryOpen, setPatientHistoryOpen] = useState(false);
  const [previewConsultationOpen, setPreviewConsultationOpen] = useState(false);
  const [previewConsultationContext, setPreviewConsultationContext] = useState<{
    answerId: string;
    departmentName: string;
    patientName: string;
    visitId: string;
    visitDepartmentId: string;
    visitDepartment: Visit["departments"][number] | null;
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
  const visitInsurances = useMemo(() => {
    if (visit?.linkedInsurances && visit.linkedInsurances.length > 0) {
      return visit.linkedInsurances;
    }
    return visit?.patient?.patientInsurances || [];
  }, [visit?.linkedInsurances, visit?.patient?.patientInsurances]);

  const activeInsuranceAcronym = useMemo(() => {
    if (!visitInsurances || visitInsurances.length === 0) return null;
    const ins = visitInsurances[0];
    return (
      ins?.insuranceProvider?.acronym ||
      ins?.insuranceProvider?.insuranceName ||
      ins?.insuranceProvider?.name ||
      "Insured"
    );
  }, [visitInsurances]);

  const [pendingRequestProducts, setPendingRequestProducts] = useState<
    Array<{
      id: string;
      name: string;
      type?: string;
      code?: string;
      quantifiable?: boolean;
      quantity: number;
      clinicPrice?: number | null;
      privateRhicPrice?: number | null;
      insuranceCoverages?: any[];
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
  const patientHoverPin = useHoverPin({ graceMs: 180 });
  const vitalsHoverPin = useHoverPin({ graceMs: 180 });

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedRef = useRef(false);
  const lastSavedSnapshotRef = useRef("");
  const saveInFlightRef = useRef(false);
  const finalisingRef = useRef(false);
  const manualSaveRef = useRef(false);
  const autoPinnedVitalsRef = useRef(false);
  const investigationProductSearchRef = useRef<HTMLInputElement>(null);
  const formRendererRef = useRef<FormRendererHandle | null>(null);
  const localAnswerIdRef = useRef<string | null>(
    answerId ? String(answerId) : null,
  );
  const loadedAnswerSignatureRef = useRef<string>("");

  const patientLabel = useMemo(() => {
    const parts = [patient.firstName, patient.middleName, patient.lastName]
      .filter(Boolean)
      .map((s) => String(s).trim())
      .filter(Boolean);
    const fromParts = parts.join(" ");
    if (patient.fullName && patient.fullName.trim()) {
      const trimmedFull = patient.fullName.trim();
      if (trimmedFull.split(/\s+/).length > parts.length) {
        return trimmedFull;
      }
    }
    return fromParts || patient.fullName?.trim() || "Patient";
  }, [patient.firstName, patient.middleName, patient.lastName, patient.fullName]);

  const patientAge = useMemo(() => {
    if (patient?.age != null && !Number.isNaN(Number(patient.age))) {
      return Number(patient.age);
    }
    if (patient?.dateOfBirth) {
      const calculated = calculateAge(patient.dateOfBirth);
      if (!Number.isNaN(calculated)) {
        return calculated;
      }
    }
    return null;
  }, [patient?.age, patient?.dateOfBirth]);

  const latestVitalsGroup = useMemo(() => {
    const groups = normalizeVisitVitalSigns(visit?.vitalSigns || []);
    return groups[0] || null;
  }, [visit?.vitalSigns]);

  const latestAnthropometrics = useMemo(
    () =>
      calculateAnthropometrics(
        latestVitalsGroup?.measurements || [],
        patientAge,
      ),
    [latestVitalsGroup?.measurements, patientAge],
  );

  const parentVisitDepartment = useMemo(
    () =>
      visit.departments?.find(
        (dept) => String(dept.id) === String(visitDepartment.id),
      ) || visitDepartment,
    [visit.departments, visitDepartment],
  );
  const canAddVitals =
    !isCancelled &&
    !isFinalised &&
    !isBilled &&
    Boolean(
      doctor?.roles?.some((role: any) =>
        ["CLINICIAN", "DOCTOR"].includes(String(role?.name || role).toUpperCase()),
      ),
    );
  const handleAddVitals = async (
    vitalSigns: Array<{ measurementName: string; value: string; unit: string }>,
  ) => {
    try {
      const result = await addVisitVitalSigns(visit.id, vitalSigns);
      if (result.status !== "SUCCESS") {
        toast.error(result.message || "Failed to add vital signs");
        return false;
      }
      toast.success("Vital signs added");
      onVisitRefetch?.();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add vital signs");
      return false;
    }
  };
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
  refetchActiveChildNotesRef.current = refetchActiveChildNotes;
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
      options?: { silent?: boolean; skipDuplicateCheck?: boolean; sendToBilling?: boolean },
    ) => {
      if (!formVersionId || !catalogDepartmentId) {
        throw new Error("Form context is missing");
      }

      // Never save a finalised form back down to a draft unless in DEPARTMENT_EDITING mode.
      if (status === "DRAFT" && isFinalised && !isDepartmentEditing) {
        return null;
      }

      // Strip live clinical block answers (products, diagnoses, medications)
      // because they are maintained on visit_department relational entities.
      const cleanAnswers = stripClinicalAnswers(nextAnswers, rendererForm?.blocks);
      const snapshot = buildAnswersSnapshot(cleanAnswers);
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
        answers: cleanAnswers,
        status,
        answerId: localAnswerIdRef.current,
        sendToBilling: options?.sendToBilling ?? false,
      });

      const savedAnswerId =
        result?.answer?.id || result?.visitDepartment?.answerId;
      const isFirstCreation = !localAnswerIdRef.current && Boolean(savedAnswerId);
      if (savedAnswerId) {
        localAnswerIdRef.current = String(savedAnswerId);
      }

      lastSavedSnapshotRef.current = snapshot;
      setSaveStatus("saved");
      hydratedRef.current = true;

      if (status === "FINAL") {
        setLocallyFinalised(true);
      } else if (isFirstCreation && !options?.sendToBilling) {
        onVisitRefetch?.();
      }

      return result;
    },
    [
      catalogDepartmentId,
      formVersionId,
      isFinalisedAnswer,
      onVisitRefetch,
      saveVisitAnswer,
      visit.id,
      visitDepartment.id,
    ],
  );

  useEffect(() => {
    const nextAnswerId = answerId ? String(answerId) : null;
    const currentLocalAnswerId = localAnswerIdRef.current;

    // A department change is the only legitimate reason to rebuild the form.
    // An answerId prop flip that merely echoes the answer we just created must
    // never tear down the mounted form or swap the loader source.
    if (catalogDepartmentId === loaderDepartmentRef.current) {
      if (!hydratedRef.current) {
        // Initial mount or prop update before hydration: adopt the prop's answer id for the loader.
        localAnswerIdRef.current = nextAnswerId;
        if (nextAnswerId !== loaderAnswerId) {
          setLoaderAnswerId(nextAnswerId);
        }
        return;
      }
      // Already hydrated: keep the form stable. If the prop reports an answer
      // id before our local ref caught up, adopt it as the save target.
      if (nextAnswerId && !currentLocalAnswerId) {
        localAnswerIdRef.current = nextAnswerId;
      }
      return;
    }

    // Genuine department change → full reset and point the loader at the new
    // department's answer (if any).
    loaderDepartmentRef.current = catalogDepartmentId;
    setLoaderAnswerId(nextAnswerId);
    localAnswerIdRef.current = nextAnswerId;
    loadedAnswerSignatureRef.current = "";
    hydratedRef.current = false;
    lastSavedSnapshotRef.current = "";
    setRendererForm(null);
    setFormVersionId(null);
    setInitialAnswers({});
    setAnswers({});
    setSaveStatus("saved");
  }, [answerId, catalogDepartmentId, loaderAnswerId]);

  useEffect(() => {
    if (loading || hydratedRef.current) return;

    // Prefer the saved answer when one is available and mappable.
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

      const mapped = mapStandaloneAnswerToSavedForm(answer, defaultForm);
      const parsed = parseStandaloneAnswers(answer.answers) as FormAnswers;
      const targetVersionId = answer.formVersion?.id || defaultForm?.activeVersion?.id;
      if (mapped && targetVersionId) {
        setRendererForm(mapped);
        setFormVersionId(targetVersionId);
        setInitialAnswers(parsed);
        setAnswers(parsed);
        localAnswerIdRef.current = String(answer.id);
        loadedAnswerSignatureRef.current = signature;
        lastSavedSnapshotRef.current = buildAnswersSnapshot(parsed);
        hydratedRef.current = true;
        setSaveStatus("saved");
        return;
      }
      // The saved answer is unusable (missing form/version) — fall back to the
      // department's default form below instead of dead-ending.
    }

    // Fallback: the department's default form. Used for the first-ever answer
    // (nothing saved yet) and when a saved answer cannot be loaded/mapped.
    if (defaultForm && defaultForm.activeVersion?.id) {
      const signature = JSON.stringify({
        departmentId: catalogDepartmentId,
        formId: defaultForm.id,
        formVersionId: defaultForm.activeVersion.id,
      });
      if (
        loadedAnswerSignatureRef.current === signature &&
        hydratedRef.current
      ) {
        return;
      }

      const mapped = mapStandaloneFormToSavedForm(defaultForm);
      if (!mapped) return;
      const parsed = answer ? (parseStandaloneAnswers(answer.answers) as FormAnswers) : {};
      setRendererForm(mapped);
      setFormVersionId(defaultForm.activeVersion.id);
      setInitialAnswers(parsed);
      setAnswers(parsed);
      loadedAnswerSignatureRef.current = signature;
      lastSavedSnapshotRef.current = buildAnswersSnapshot(parsed);
      hydratedRef.current = true;
      setSaveStatus("saved");
    }
  }, [loading, source, answer, defaultForm, catalogDepartmentId]);

  useEffect(() => {
    const trimmed = productSearchQuery.trim();
    const timer = window.setTimeout(() => {
      setDebouncedProductSearchQuery(trimmed.length >= 2 ? trimmed : "");
    }, 250);

    return () => window.clearTimeout(timer);
  }, [productSearchQuery]);

  // Sync real-time activity (WhatsApp-style typing / product searching presence)
  useEffect(() => {
    if (productSearchFocused || productSearchQuery.trim().length > 0) {
      updateActivity("searching_products");
    } else if (notesHoverPin.isOpen) {
      updateActivity("typing_notes");
    } else {
      updateActivity("viewing");
    }
  }, [productSearchFocused, productSearchQuery, notesHoverPin.isOpen, updateActivity]);

  // Keep the latest persistAnswers in a ref so the autosave debounce effect can
  // depend only on `answers`. persistAnswers' identity changes whenever its deps
  // change (e.g. onVisitRefetch is an inline arrow from the parent), and letting
  // that reset the 1.5s timer on unrelated renders would delay autosaves.
  const persistAnswersRef = useRef(persistAnswers);
  useEffect(() => {
    persistAnswersRef.current = persistAnswers;
  }, [persistAnswers]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (isFinalisedAnswer || isBilled) return;

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
        // Draft saves must never impose form validation. Clear any errors left
        // over from a previous (failed) "Finalise and Complete" attempt.
        formRendererRef.current?.clearErrors();
        await persistAnswersRef.current(answers, "DRAFT", { silent: true });
      } catch {
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
  }, [answers, isFinalisedAnswer, isBilled]);

  // Keyboard shortcuts for fast clinical navigation:
  // Alt+P: Toggle Patient Identification card
  // Alt+V: Toggle Vital Signs panel
  // Alt+H: Toggle Patient History
  // Alt+I: Toggle Investigations / Lab Orders
  // Alt+N: Toggle Visit Notes
  // Cmd/Ctrl+S: Force immediate draft save
  // Cmd/Ctrl+Enter: Open Complete / Finalise dialog
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt+P — Toggle Patient Identification
      if (event.altKey && !event.metaKey && !event.ctrlKey && event.code === "KeyP") {
        event.preventDefault();
        patientHoverPin.togglePin();
        return;
      }

      // Alt+V — Toggle Vital Signs
      if (event.altKey && !event.metaKey && !event.ctrlKey && event.code === "KeyV") {
        event.preventDefault();
        vitalsHoverPin.togglePin();
        return;
      }

      // Alt+H — Toggle Patient History
      if (event.altKey && !event.metaKey && !event.ctrlKey && event.code === "KeyH") {
        event.preventDefault();
        setPatientHistoryOpen((prev) => !prev);
        return;
      }

      // Alt+I — Toggle Investigations
      if (event.altKey && !event.metaKey && !event.ctrlKey && event.code === "KeyI") {
        if (!requestProductsEnabled) return;
        event.preventDefault();
        setRequestProductsOpen((prev) => !prev);
        return;
      }

      // Alt+N — Toggle Visit Notes
      if (event.altKey && !event.metaKey && !event.ctrlKey && event.code === "KeyN") {
        if (isTerminalVisit) return;
        event.preventDefault();
        notesHoverPin.togglePin();
        return;
      }

      // Cmd/Ctrl+S — Force immediate draft save
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === "s"
      ) {
        event.preventDefault();
        if (isFinalised || isBilled || saveInFlightRef.current) return;
        if (autoSaveTimer.current) {
          clearTimeout(autoSaveTimer.current);
          autoSaveTimer.current = null;
        }
        saveInFlightRef.current = true;
        formRendererRef.current?.clearErrors();
        void persistAnswersRef
          .current(answers, "DRAFT", {
            silent: false,
            skipDuplicateCheck: true,
            sendToBilling: false,
          })
          .catch(() => {
            setSaveStatus("dirty");
          })
          .finally(() => {
            saveInFlightRef.current = false;
          });
        return;
      }

      // Cmd/Ctrl+Enter — Open Complete / Finalise dialog (unless typing inside Visit Notes composer)
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        const target = event.target as HTMLElement | null;
        if (target?.closest('[aria-label="Consultation Notes"]')) {
          return;
        }
        event.preventDefault();
        if (isFinalised || isFinalising) return;
        if (unreadNotesCount > 0) {
          toast.warn("Please view the notes first before completing this visit.");
          notesHoverPin.setPinned(true);
          return;
        }
        setShowFinalizeConfirm(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    answers,
    isBilled,
    isFinalised,
    isFinalising,
    isTerminalVisit,
    notesHoverPin,
    patientHoverPin,
    requestProductsEnabled,
    unreadNotesCount,
    vitalsHoverPin,
  ]);

  const handleManualSave = async () => {
    if (isFinalised) {
      toast.warn("This visit is already finalised.");
      return;
    }
    if (manualSaveRef.current) return;
    manualSaveRef.current = true;
    setSavingDraft(true);
    try {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = null;
      }
      formRendererRef.current?.clearErrors();

      // State transition rules:
      // 1. If in edit mode (DEPARTMENT_EDITING): keep the state intact (sendToBilling: false).
      // 2. Otherwise: sendToBilling: true. The backend inspects all departments on the visit;
      //    if unbilled products exist, it transitions the departments to BILLING.
      //    If already billed and no unbilled products exist, it just saves answers without changing state.
      const shouldSendToBilling = !isDepartmentEditing;
      await persistAnswers(answers, "DRAFT", { skipDuplicateCheck: true, sendToBilling: shouldSendToBilling });

      toast.success("Consultation saved for later editing");
      // "Complete Visit Edit Later" = done with this visit for now — head home.
      router.push("/");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      manualSaveRef.current = false;
      setSavingDraft(false);
    }
  };

  const handleComplete = async () => {
    if (isFinalised) {
      toast.warn("This visit is already finalised.");
      return;
    }
    if (unreadNotesCount > 0) {
      toast.warn("Please view the notes first before completing this visit.");
      notesHoverPin.setPinned(true);
      return;
    }

    if (finalisingRef.current) return;
    finalisingRef.current = true;
    setIsFinalising(true);

    try {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = null;
      }
      // Belt-and-braces: a FINAL save must always pass validation, regardless of
      // which entry point triggered it.
      const valid = formRendererRef.current?.validateAndShowErrors() ?? true;
      if (!valid) {
        toast.error("Please complete required fields before finalising");
        return;
      }

      // State transition rules:
      // 1. If in edit mode (DEPARTMENT_EDITING): keep the state intact (sendToBilling: false).
      // 2. If unbilled products exist or visit was returned from billing: sendToBilling = true so it goes back to billing!
      // 3. If visit is already billed / no unbilled products and not in edit mode: backend marks department as FINALISED.
      const shouldSendToBilling = (!isDepartmentEditing && !isBilled) || isReturnedFromBilling;
      await persistAnswers(answers, "FINAL", { skipDuplicateCheck: true, sendToBilling: shouldSendToBilling });

      if (isReturnedFromBilling && visitDepartment?.id) {
        if (effectiveDepartmentStatus !== "BILLING") {
          await updateDepartmentStatus(String(visitDepartment.id), "BILLING");
        }
      }

      toast.success(
        isReturnedFromBilling
          ? "Sent back to billing successfully"
          : shouldSendToBilling
            ? "Sent to billing successfully"
            : "Consultation answers saved successfully",
      );
      router.push("/");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to complete consultation",
      );
    } finally {
      finalisingRef.current = false;
      setIsFinalising(false);
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
    quantifiable?: boolean;
    clinicPrice?: number | null;
    privateRhicPrice?: number | null;
    insuranceCoverages?: any[];
  }) => {
    setPendingRequestProducts((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, { ...product, quantity: 1, quantifiable: product.quantifiable !== false }];
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
          processorId: doctor?.id,
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
          doctor?.id,
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

  const ageGenderSummary = useMemo(() => {
    const parts: string[] = [];
    if (patientAge != null) {
      parts.push(patientAge === 0 ? "<1y" : `${patientAge}y`);
    }
    if (patient?.gender) {
      parts.push(String(patient.gender).charAt(0).toUpperCase());
    }
    return parts.join(" • ");
  }, [patientAge, patient?.gender]);

  if (loading && !rendererForm) {
    return <PageLoading />;
  }

  if (error && !rendererForm) {
    return <InlineTryAgain onTryAgain={() => void refetch()} />;
  }

  if (!rendererForm || !formVersionId) {
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
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2.5 sm:py-4 space-y-3 sm:space-y-4 pb-24">
      {/* Sticky Compact Patient Header Strip — shared consultation/billing component */}
      <ConsultationPatientHeaderStrip
        className="sticky top-2 z-30"
        patient={patient}
        patientLabel={patientLabel}
        ageGenderSummary={ageGenderSummary}
        activeInsuranceAcronym={activeInsuranceAcronym}
        visitInsurances={visitInsurances}
        departmentName={visitDepartment?.department?.name}
        visitId={visit?.id}
        historyOpen={patientHistoryOpen}
        onToggleHistory={() => setPatientHistoryOpen((prev) => !prev)}
        actions={
          <>
            <ConsultationVitalsTicker
              vitals={visit?.vitalSigns || []}
              canAddVitals={canAddVitals}
              onAddVitals={handleAddVitals}
              patientAge={patientAge}
              hoverPin={vitalsHoverPin}
            />
            {requestProductsEnabled && (
              <button
                type="button"
                onClick={() => setRequestProductsOpen(true)}
                className="relative inline-flex items-center gap-1 rounded-lg border border-border/60 bg-background px-2 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors whitespace-nowrap"
                title="Investigations / Lab Orders (Alt+I)"
                aria-label="Open investigations"
              >
                <FlaskConical className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="hidden sm:inline">Orders</span>
                <kbd className="hidden xl:inline-block rounded bg-muted px-1 py-0.2 text-[9px] font-mono text-muted-foreground">
                  ⌥I
                </kbd>
                {!requestProductsOpen && hasUnreadChildRequestNotes && (
                  <span className="ml-0.5 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-4 text-center">
                    {childRequestUnreadNotesCount}
                  </span>
                )}
              </button>
            )}
          </>
        }
        notes={departmentNotes}
        noteTypes={["BILLING", "FORMS", "CONSULTATION", "ADMIN", "PUBLIC"]}
        unreadNotesCount={unreadNotesCount}
        notesTitle="Consultation Notes"
        firstVisitDepartmentId={firstVisitDepartmentId}
        isTerminalVisit={isTerminalVisit}
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
        onMarkNotesViewed={async () => {
          await markNotesViewed(firstVisitDepartmentId);
          await refetchNotes();
          onVisitRefetch?.();
        }}
      />

      <ConsultationPreviousEncounters
        data={previousEncounterData}
        patientName={patientLabel}
        currentDepartmentId={catalogDepartmentId}
        currentVisitId={visit?.id}
        currentVisitDepartmentId={firstVisitDepartmentId}
        hasAnsweredCurrentForm={hasAnyAnswerContent}
        onPreviewAnswerAction={({
          answerId,
          departmentName,
          patientName,
          visitId,
          visitDepartmentId,
          visitDepartment,
        }) => {
          setPreviewConsultationContext({
            answerId,
            departmentName,
            patientName,
            visitId,
            visitDepartmentId,
            visitDepartment,
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
        validate
        edit={!isFinalised && !isTerminalVisit}
        initialAnswers={initialAnswers}
        controlledAnswers={answers}
        onControlledAnswersChange={setAnswers}
        visitId={visit.id}
        visitDepartmentId={String(visitDepartment.id)}
        departmentId={catalogDepartmentId}
        visitDepartments={visit.departments as any}
        visitStatus={effectiveVisitStatus}
        visitDepartmentStatus={effectiveDepartmentStatus}
        existingProducts={existingProducts}
        linkedInsurances={visitInsurances}
        patientAge={patientAge}
        patientWeightKg={latestAnthropometrics.weightKg}
        patientBsaM2={latestAnthropometrics.bsaM2}
        onOpenVitals={() => vitalsHoverPin.setPinned(true)}
        onVisitRefetch={onVisitRefetch}
      />

      {!patientHistoryOpen && (
        <ConsultationBottomDock
          visitId={visit?.id}
          departmentId={String(visitDepartment.id)}
          departmentName={visitDepartment.department?.name}
          processors={visitDepartment.processors || []}
          profiles={visitDepartment.department?.profiles || []}
          activeProfileId={visitDepartment.profile?.id}
          visitDepartmentStatus={effectiveDepartmentStatus}
          products={visitDepartment.products || []}
          onComplete={() => {
            if (isFinalised) return;
            if (unreadNotesCount > 0) {
              toast.warn(
                "Please view the notes first before completing this visit.",
              );
              notesHoverPin.setPinned(true);
              return;
            }
            setShowFinalizeConfirm(true);
          }}
          completeDisabled={isFinalised || unreadNotesCount > 0 || isFinalising}
          completeDisabledReason={
            isFinalised
              ? "Visit is finalised. Edits are locked."
              : unreadNotesCount > 0
                ? `Unread notes: ${unreadNotesCount}. Open notes to read them first.`
                : undefined
          }
          isBilled={isActuallyBilled || isDepartmentEditing}
          saveIndicator={{
            visible: hasAnyAnswerContent || isFinalised || isActuallyBilled,
            status: isFinalised ? "saved" : saveStatus,
          }}
        />
      )}

      <Dialog open={showFinalizeConfirm} onOpenChange={setShowFinalizeConfirm}>
        <DialogContent className="sm:max-w-md p-5 sm:p-6">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="text-base font-semibold">
              {isActuallyBilled || isDepartmentEditing
                ? "Save Answers"
                : isReturnedFromBilling
                  ? "Send back to Billing"
                  : "Send to Billing"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isActuallyBilled || isDepartmentEditing
                ? "Save your consultation documentation. Since billing is already completed, answers will be saved without altering billing status."
                : isReturnedFromBilling
                  ? "Save your consultation documentation and send this patient back to Billing."
                  : "Submit consultation documentation and send this visit to Billing for payment processing."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2.5 sm:gap-3 pt-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8.5 px-3.5 text-xs font-medium"
              disabled={isFinalising || savingDraft || isFinalised}
              onClick={() => {
                setShowFinalizeConfirm(false);
                void handleManualSave();
              }}
            >
              {savingDraft ? "Saving…" : "Save as Draft"}
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8.5 px-4 text-xs font-medium shadow-xs"
              disabled={unreadNotesCount > 0 || isFinalising || isFinalised}
              onClick={async () => {
                if (finalisingRef.current || isFinalised) return;
                const valid =
                  formRendererRef.current?.validateAndShowErrors() ?? true;
                if (!valid) {
                  // keep dialog open so user sees why they can't finalise
                  toast.error(
                    "Please complete required fields before submitting",
                  );
                  return;
                }
                setShowFinalizeConfirm(false);
                void handleComplete();
              }}
            >
              {isFinalising
                ? "Submitting…"
                : isActuallyBilled || isDepartmentEditing
                  ? "Save Answers"
                  : isReturnedFromBilling
                    ? "Send back to Billing"
                    : "Send to Billing"}
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
          overlayClassName="z-[95] inset-0"
          className="z-[100] inset-y-0 right-0 h-full w-full gap-0 border-l p-0 sm:max-w-lg flex flex-col"
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
                            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                              {(childDept.products || []).map((line) => {
                                const isPendingConfirm =
                                  line.billingConfirmationStatus === "PENDING_OPERATOR_CONFIRMATION";
                                const isConfirmingThis = confirmingChildProductId === line.id;
                                return (
                                  <li key={line.id} className="flex items-center justify-between gap-2 py-0.5">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-medium text-foreground">
                                        {line.product?.name || "Product"}
                                      </span>
                                      <span className="text-muted-foreground">× {line.quantity}</span>
                                      {isPendingConfirm && (
                                        <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                                          Added in Billing
                                        </span>
                                      )}
                                    </div>
                                    {isPendingConfirm && (
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        disabled={isConfirmingThis || isFinalised || isBilled}
                                        className="h-6 px-2 text-[12px] font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-300 dark:border-emerald-800 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={async () => {
                                          try {
                                            setConfirmingChildProductId(line.id);
                                            await confirmVisitDepartmentProduct(line.id);
                                            toast.success("Product accepted");
                                            onVisitRefetch?.();
                                          } catch (err: any) {
                                            toast.error(err?.message || "Failed to confirm product");
                                          } finally {
                                            setConfirmingChildProductId(null);
                                          }
                                        }}
                                      >
                                        {isConfirmingThis ? (
                                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                        ) : (
                                          <Check className="h-3 w-3 mr-1 text-emerald-600" />
                                        )}
                                        Accept
                                      </Button>
                                    )}
                                  </li>
                                );
                              })}
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
                              className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isFinalised || String(childDept.status || "").toUpperCase() === "FINALISED"}
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
                                <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground animate-bounce">
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
                  <div className="space-y-1.5 py-1">
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
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
                          <div className="p-3 space-y-2">
                            <Skeleton className="h-4 w-3/4 rounded" />
                            <Skeleton className="h-4 w-1/2 rounded" />
                          </div>
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
                              const pricing = getInsuranceAwarePricing(product, visitInsurances);
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
                                        quantifiable: product.quantifiable,
                                        clinicPrice: product.clinicPrice,
                                        privateRhicPrice: product.privateRhicPrice,
                                        insuranceCoverages: product.insuranceCoverages,
                                      })
                                    }
                                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 gap-2"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <span className="font-medium block truncate">
                                        {product.name}
                                      </span>
                                      <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5 mt-0.5">
                                        <span>{product.type || "Product"}</span>
                                        {product.code && <span>• {product.code}</span>}
                                        {alreadyAdded && <span className="text-amber-600 font-semibold">• Added</span>}
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      {pricing.coverageDetails.length > 0 ? (
                                        pricing.coverageDetails.map((coverage: any, idx: number) => {
                                          const isZeroPaying = Number(coverage.cost) <= 0 || coverage.covered === false;
                                          return (
                                            <div key={idx} className="flex items-center justify-end gap-1.5">
                                              <span className={`text-xs font-semibold ${isZeroPaying ? "text-muted-foreground line-through" : "text-primary"}`}>
                                                {formatRWF(Number(coverage.cost))}
                                              </span>
                                              <span className="text-[11px] text-muted-foreground">
                                                {coverage.insuranceProvider?.acronym || coverage.insuranceProvider?.insuranceName}
                                              </span>
                                              {isZeroPaying && (
                                                <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-1 py-0.5 rounded font-medium">
                                                  Not Covered
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                                          <span>{formatRWF(pricing.price)}</span>
                                          {visitInsurances.length > 0 && (
                                            <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-1 py-0.5 rounded font-medium">
                                              Private
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
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
                      {pendingRequestProducts.map((product) => {
                        const pricing = getInsuranceAwarePricing(product as any, visitInsurances);
                        return (
                          <li
                            key={product.id}
                            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="font-medium truncate">
                                {product.name}
                              </div>
                              <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5">
                                <span>{product.type || "Product"}</span>
                                {product.code && <span>• {product.code}</span>}
                                <span>•</span>
                                {pricing.coverageDetails.length > 0 ? (
                                  pricing.coverageDetails.map((cov: any, idx: number) => {
                                    const isZero = Number(cov.cost) <= 0 || cov.covered === false;
                                    return (
                                      <span key={idx} className={isZero ? "text-muted-foreground line-through" : "text-primary font-medium"}>
                                        {formatRWF(Number(cov.cost))} ({cov.insuranceProvider?.acronym || cov.insuranceProvider?.insuranceName})
                                      </span>
                                    );
                                  })
                                ) : (
                                  <span>
                                    {formatRWF(pricing.price)}{" "}
                                    {visitInsurances.length > 0 ? "(Private)" : ""}
                                  </span>
                                )}
                              </div>
                            </div>
                          {product.quantifiable !== false && (
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
                          )}
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
                      );
                    })}
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
                    activeChildDepartmentNotes.map((note: any) => {
                      const isChildNoteUnread = isNoteUnreadForUser(
                        note,
                        userRoles,
                        currentUserId,
                        activeChildNotesDepartment
                      );
                      return (
                      <div
                        key={note.id}
                        className="rounded-lg border border-border/70 bg-card p-2"
                        onClick={async () => {
                          if (isChildNoteUnread && activeChildNotesDepartmentId) {
                            await markNotesViewed(activeChildNotesDepartmentId);
                            await refetchActiveChildNotes();
                            onVisitRefetch?.();
                          }
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {note.noteType || "CONSULTATION"}
                            {isChildNoteUnread && (
                              <span className="ml-1 rounded-full bg-primary px-1 text-[10px] text-primary-foreground animate-pulse">
                                NEW
                              </span>
                            )}
                          </p>
                          <span className="text-[11px] text-muted-foreground">
                            {note.createdAt
                              ? new Date(note.createdAt).toLocaleString()
                              : ""}
                          </span>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-xs text-foreground">
                          {note.content || ""}
                        </p>
                      </div>
                    );
                    })
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
                    <p className="text-[12px] text-muted-foreground">
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
                      pendingRequestProducts.length === 0 ||
                      productsLocked
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

      {patientHistoryOpen && (
        <PatientHistorySidePane
          patientId={patient.id}
          currentVisitId={visit.id || ""}
          currentVisitDepartmentId={String(visitDepartment.id || "") || null}
          onPreviewDepartmentAnswers={({
            answerId,
            departmentName,
            patientName,
            visitId,
            visitDepartmentId,
            visitDepartment,
          }) => {
            setPreviewConsultationContext({
              answerId,
              departmentName,
              patientName,
              visitId,
              visitDepartmentId,
              visitDepartment,
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
        visitId={previewConsultationContext?.visitId}
        visitDepartmentId={previewConsultationContext?.visitDepartmentId}
        visitDepartment={previewConsultationContext?.visitDepartment ?? null}
        previewStartedAt={previewConsultationContext?.previewStartedAt || null}
      />

      {/* Floating Bottom-Right Clinical Live Updates (Presence, Billing, Products, Notes) */}
      <ConsultationLiveToasts
        toasts={allLiveToasts}
        onDismiss={handleDismissLiveToast}
      />
    </div>
  );
}
