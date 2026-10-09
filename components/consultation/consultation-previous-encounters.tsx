"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Clock3,
  Stethoscope,
  Pill,
  X,
  ChevronRight,
  History,
  Pin,
} from "lucide-react";
import type {
  LastPatientDepartmentVisitOutput,
  VisitDepartment,
} from "@/lib/api-types";

type EncounterPreviewInput = {
  answerId: string;
  departmentName: string;
  patientName: string;
  visitId: string;
  visitDepartmentId: string;
  visitDepartment: VisitDepartment;
};

type Props = {
  data: LastPatientDepartmentVisitOutput | null;
  patientName: string;
  currentDepartmentId: string;
  hasAnsweredCurrentForm: boolean;
  onPreviewAnswerAction: (input: EncounterPreviewInput) => void;
};

const AUTO_DISMISS_MS = 120000;

function formatWhen(value?: string | null) {
  if (!value) return "Unknown time";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
}

function relativeWhen(value?: string | null) {
  if (!value) return "Earlier";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Earlier";
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

function summarizeDepartment(dept?: VisitDepartment | null) {
  const diagnoses = (dept?.diagnostics || [])
    .map((item) => item.diagnosisName)
    .filter(Boolean);
  const medications = (dept?.medications || [])
    .map((item) => item.medicationName)
    .filter(Boolean);
  const products = (dept?.products || [])
    .map((item) => item.product?.name)
    .filter(Boolean) as string[];
  return { diagnoses, medications, products };
}

function SummaryChips({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.slice(0, 4).map((item) => (
          <span
            key={`${label}-${item}`}
            className="inline-flex items-center rounded-full border border-border/70 bg-background px-2 py-0.5 text-[12px] text-foreground"
          >
            {item}
          </span>
        ))}
        {items.length > 4 && (
          <span className="inline-flex items-center rounded-full border border-dashed border-border/70 px-2 py-0.5 text-[12px] text-muted-foreground">
            +{items.length - 4} more
          </span>
        )}
      </div>
    </div>
  );
}

function DepartmentRow({
  department,
  visitId,
  patientName,
  onPreviewAnswerAction,
  highlighted,
}: {
  department: VisitDepartment;
  visitId: string;
  patientName: string;
  onPreviewAnswerAction: (input: EncounterPreviewInput) => void;
  highlighted?: boolean;
}) {
  const summary = summarizeDepartment(department);
  const hasPreview = Boolean(department.answerId);

  return (
    <div
      className={`rounded-xl border p-3 transition-all ${highlighted ? "border-primary/50 bg-primary/5" : "border-border/70 bg-background/80"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground">
              {department.department?.name || "Department"}
            </p>
            {highlighted && (
              <span className="text-[11px] font-medium text-primary/80">
                Previous in current department
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {department.status} •{" "}
            {formatWhen(department.completedAt || department.updatedAt)}
          </p>
        </div>
        {hasPreview && (
          <button
            type="button"
            onClick={() =>
              onPreviewAnswerAction({
                answerId: String(department.answerId),
                departmentName: department.department?.name || "Department",
                patientName,
                visitId,
                visitDepartmentId: String(department.id || ""),
                visitDepartment: department,
              })
            }
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground hover:bg-muted"
          >
            Preview
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <SummaryChips label="Diagnoses" items={summary.diagnoses} />
        <SummaryChips label="Medications" items={summary.medications} />
        <SummaryChips label="Products" items={summary.products} />
        {!summary.diagnoses.length &&
          !summary.medications.length &&
          !summary.products.length && (
            <p className="text-xs text-muted-foreground">
              No recorded summary for this encounter.
            </p>
          )}
      </div>
    </div>
  );
}

function ExpandableCard({
  title,
  subtitle,
  icon,
  children,
  pinned,
  onTogglePin,
  onDismiss,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
  pinned: boolean;
  onTogglePin: () => void;
  onDismiss: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const expanded = hovered || pinned;

  return (
    <div
      className={`group rounded-2xl border border-border/70 bg-card/95 p-2.5 shadow-lg backdrop-blur transition-all duration-200 hover:shadow-xl ${
        expanded
          ? "w-[min(88vw,22rem)] lg:w-[20rem]"
          : "w-[15rem]"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 shrink-0 rounded-xl bg-primary/10 p-1.5 text-primary">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{title}</p>
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {expanded && (
            <button
              type="button"
              onClick={onTogglePin}
              aria-pressed={pinned}
              aria-label={pinned ? "Unpin card" : "Pin card"}
              title={pinned ? "Unpin card" : "Pin card open"}
              className={`rounded-md p-1 transition-colors ${
                pinned
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Pin className={`h-4 w-4 ${pinned ? "fill-current" : ""}`} />
            </button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Dismiss card"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {expanded && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function ConsultationPreviousEncounters({
  data,
  patientName,
  currentDepartmentId,
  hasAnsweredCurrentForm,
  onPreviewAnswerAction,
}: Props) {
  const [dismissedVisitCard, setDismissedVisitCard] = useState(false);
  const [dismissedDepartmentCard, setDismissedDepartmentCard] = useState(false);
  const [visitPinned, setVisitPinned] = useState(false);
  const [departmentPinned, setDepartmentPinned] = useState(false);

  useEffect(() => {
    setVisitPinned(false);
    setDepartmentPinned(false);
  }, [data?.lastVisit?.id, data?.lastDepartmentVisit?.visitDepartment?.id]);

  useEffect(() => {
    if (!hasAnsweredCurrentForm) return;
    const timer = window.setTimeout(() => {
      setDismissedVisitCard(true);
      setDismissedDepartmentCard(true);
    }, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [hasAnsweredCurrentForm]);

  const lastVisit = data?.lastVisit || null;
  const lastDepartmentVisit = data?.lastDepartmentVisit || null;
  const highlightedDepartmentId = String(
    lastDepartmentVisit?.visitDepartment?.id || "",
  );

  const isDepartmentAlreadyInLastVisit = useMemo(() => {
    if (!lastVisit || !lastDepartmentVisit) return false;
    return String(lastVisit.id) === String(lastDepartmentVisit.visitId || "");
  }, [lastVisit, lastDepartmentVisit]);

  const visitDepartments = useMemo(() => {
    return (lastVisit?.departments || []).filter(Boolean);
  }, [lastVisit]);

  const currentDepartmentSummary = summarizeDepartment(
    lastDepartmentVisit?.visitDepartment || null,
  );
  const hasCurrentDepartmentMedications =
    currentDepartmentSummary.medications.length > 0;

  const showVisitCard = Boolean(lastVisit) && !dismissedVisitCard;
  const showDepartmentCard =
    Boolean(lastDepartmentVisit) &&
    !isDepartmentAlreadyInLastVisit &&
    !dismissedDepartmentCard;

  if (!showVisitCard && !showDepartmentCard) return null;

  return (
    <div className="fixed bottom-6 left-6 md:left-6 xl:left-[max(1.5rem,calc(50%-42.5rem))] z-[70] flex flex-col items-start gap-3">
      {showVisitCard && lastVisit && (
        <ExpandableCard
          title="Previous clinic visit"
          subtitle={`${relativeWhen(lastVisit.visitDate)} • ${formatWhen(lastVisit.visitDate)}`}
          icon={<History className="h-4 w-4" />}
          pinned={visitPinned}
          onTogglePin={() => setVisitPinned((prev) => !prev)}
          onDismiss={() => setDismissedVisitCard(true)}
        >
          <div className="space-y-3">
            <div className="rounded-xl border border-border/70 bg-background/70 p-3 text-xs text-muted-foreground">
              {visitDepartments.length} department
              {visitDepartments.length === 1 ? "" : "s"} visited on this visit.
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {visitDepartments.map((department) => (
                <DepartmentRow
                  key={department.id}
                  department={department}
                  visitId={String(lastVisit?.id || "")}
                  patientName={patientName}
                  onPreviewAnswerAction={onPreviewAnswerAction}
                  highlighted={
                    String(department.id) === highlightedDepartmentId ||
                    String(department.department?.id || "") ===
                      currentDepartmentId
                  }
                />
              ))}
            </div>
          </div>
        </ExpandableCard>
      )}

      {showDepartmentCard && lastDepartmentVisit?.visitDepartment && (
        <ExpandableCard
          title="Last encounter in this department"
          subtitle={`${relativeWhen(lastDepartmentVisit.visitDepartment.completedAt || lastDepartmentVisit.visitDepartment.updatedAt)}${hasCurrentDepartmentMedications ? " • Has medications" : ""}`}
          icon={<Clock3 className="h-4 w-4" />}
          pinned={departmentPinned}
          onTogglePin={() => setDepartmentPinned((prev) => !prev)}
          onDismiss={() => setDismissedDepartmentCard(true)}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <div className="rounded-xl border border-border/70 bg-background/70 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Stethoscope className="h-3.5 w-3.5" /> Diagnoses
                </div>
                <p className="mt-2 text-sm text-foreground">
                  {currentDepartmentSummary.diagnoses.slice(0, 2).join(", ") ||
                    "No diagnoses recorded"}
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/70 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Pill className="h-3.5 w-3.5" /> Medications
                </div>
                <p className="mt-2 text-sm text-foreground">
                  {currentDepartmentSummary.medications
                    .slice(0, 2)
                    .join(", ") || "No medications recorded"}
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/70 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <History className="h-3.5 w-3.5" /> Products
                </div>
                <p className="mt-2 text-sm text-foreground">
                  {currentDepartmentSummary.products.slice(0, 2).join(", ") ||
                    "No products recorded"}
                </p>
              </div>
            </div>
            <DepartmentRow
              department={lastDepartmentVisit.visitDepartment}
              visitId={String(lastDepartmentVisit.visitId || "")}
              patientName={patientName}
              onPreviewAnswerAction={onPreviewAnswerAction}
              highlighted
            />
          </div>
        </ExpandableCard>
      )}
    </div>
  );
}
