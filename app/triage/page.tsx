"use client";

import { Suspense, useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Trash2,
  Activity,
  ChevronLeft,
  ChevronRight,
  Plus,
  Building2,
  FileText,
  X,
  AlertCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/header";
import InlineTryAgain from "@/components/inline-try-again";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { handleResponse } from "@/lib/response-handler";
import {
  useAddVisitVitalSigns,
  useVisit,
  useDepartments,
  useAddDepartmentToVisit,
  useChangeVisitDepartmentProfile,
  useRemoveVisitDepartmentProfile,
  useUpdateVisitDepartmentStatus,
  normalizeVisitVitalSigns,
} from "@/hooks/auth-hooks";
import { AddDepartmentModal } from "@/components/add-department-modal";
// NEW: departmental notes wrapper
import DepartmentNotesFloating from "@/components/department-notes-floating";

interface VitalRow {
  id: string;
  measurementName: string;
  value: string;
  unit: string;
  isPreset?: boolean;
}

const defaultRows = (): VitalRow[] => [
  {
    id: "preset-bp",
    measurementName: "Blood Pressure",
    value: "",
    unit: "mmHg",
    isPreset: true,
  },
  {
    id: "preset-hr",
    measurementName: "Heart Rate",
    value: "",
    unit: "bpm",
    isPreset: true,
  },
  {
    id: "preset-temp",
    measurementName: "Temperature",
    value: "",
    unit: "°C",
    isPreset: true,
  },
  {
    id: "preset-spo2",
    measurementName: "Oxygen Saturation",
    value: "",
    unit: "%",
    isPreset: true,
  },
  {
    id: "preset-weight",
    measurementName: "Weight",
    value: "",
    unit: "kg",
    isPreset: true,
  },
  {
    id: "preset-height",
    measurementName: "Height",
    value: "",
    unit: "cm",
    isPreset: true,
  },
];

function TriagePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const visitId = searchParams.get("visitId") || "";
  const { doctor } = useAuth();
  const { visit, loading, error, refetch } = useVisit(visitId);
  const { addVisitVitalSigns, loading: savingVitals } = useAddVisitVitalSigns();
  const { departments = [] } = useDepartments();
  const { changeVisitDepartmentProfile, loading: changingProfile } =
    useChangeVisitDepartmentProfile();
  const { removeVisitDepartmentProfile, loading: removingProfile } =
    useRemoveVisitDepartmentProfile();
  const { updateDepartmentStatus, loading: updatingStatus } =
    useUpdateVisitDepartmentStatus();

  const [deptToCancel, setDeptToCancel] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [cancellingDept, setCancellingDept] = useState(false);

  const [rows, setRows] = useState<VitalRow[]>(defaultRows);
  const [modalOpen, setModalOpen] = useState(false);
  const [addDeptOpen, setAddDeptOpen] = useState(false);
  const [vitalIndex, setVitalIndex] = useState(0);
  // Inline validation for the vitals dialog (shown under the rows, no toasts).
  const [vitalFormError, setVitalFormError] = useState("");
  const [vitalRowErrors, setVitalRowErrors] = useState<Record<string, string>>(
    {},
  );

  const handleCancelDepartment = async (departmentId: string) => {
    if (cancellingDept) return;
    setCancellingDept(true);
    try {
      const res = await updateDepartmentStatus(departmentId, "CANCELLED");
      const ok = await handleResponse(res, {
        successMessage: "Department cancelled successfully.",
        errorMessage: true,
      });
      if (ok) {
        setDeptToCancel(null);
        await refetch();
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel department");
    } finally {
      setCancellingDept(false);
    }
  };

  const handleChangeProfile = async (
    visitDepartmentId: string,
    profileId: string | null,
  ) => {
    try {
      let res;
      if (!profileId) {
        res = await removeVisitDepartmentProfile(visitDepartmentId);
      } else {
        res = await changeVisitDepartmentProfile(visitDepartmentId, profileId);
      }
      const ok = await handleResponse(res, {
        successMessage: profileId
          ? "Department profile updated successfully."
          : "Department profile removed successfully.",
        errorMessage: true,
      });
      if (ok) {
        await refetch();
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
    }
  };

  useEffect(() => {
    if (!loading && !visit && !error) router.push("/");
  }, [loading, visit, error, router]);

  const patientName = visit
    ? `${visit.patient.firstName} ${visit.patient.lastName || ""}`.trim()
    : "Unknown patient";

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ").filter(Boolean);
    return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
  };

  const getAge = (dob?: string) => {
    if (!dob) return null;
    try {
      const diff = Date.now() - new Date(dob).getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    } catch {
      return null;
    }
  };

  const groupedEntries = useMemo(
    () => normalizeVisitVitalSigns(visit?.vitalSigns || []),
    [visit?.vitalSigns],
  );

  useEffect(() => {
    setVitalIndex((i) => Math.min(i, Math.max(0, groupedEntries.length - 1)));
  }, [groupedEntries.length]);

  const updateRow = (rowId: string, field: keyof VitalRow, value: string) => {
    setRows((rs) =>
      rs.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)),
    );
    if (vitalRowErrors[rowId] || vitalFormError) {
      setVitalRowErrors((prev) => {
        const next = { ...prev };
        // Custom rows can have three error keys (name/value/unit).
        delete next[rowId];
        delete next[`${rowId}:name`];
        delete next[`${rowId}:unit`];
        return next;
      });
      setVitalFormError("");
    }
  };
  const removeRow = (rowId: string) => {
    setRows((rs) => rs.filter((r) => r.id !== rowId));
    setVitalRowErrors((prev) => {
      const next = { ...prev };
      delete next[rowId];
      return next;
    });
  };
  const resetRows = () => {
    setRows(defaultRows());
    setVitalFormError("");
    setVitalRowErrors({});
  };

  const handleSubmit = async (e?: SyntheticEvent): Promise<boolean> => {
    if (e) e.preventDefault();
    const rowsToSend = rows.filter((row) =>
      row.isPreset
        ? !!row.value.trim()
        : !!(row.measurementName.trim() || row.value.trim() || row.unit.trim()),
    );
    if (!rowsToSend.length) {
      setVitalFormError("Add at least one vital sign before saving.");
      return false;
    }
    // Per-row inline errors — shown directly under each field.
    const rowErrors: Record<string, string> = {};
    rowsToSend.forEach((row) => {
      if (row.isPreset && !row.value.trim()) {
        rowErrors[row.id] = "Value cannot be empty";
      } else if (!row.isPreset) {
        if (!row.measurementName.trim())
          rowErrors[`${row.id}:name`] = "Name is required";
        if (!row.value.trim()) rowErrors[row.id] = "Value cannot be empty";
        if (!row.unit.trim()) rowErrors[`${row.id}:unit`] = "Unit is required";
      }
    });
    if (Object.keys(rowErrors).length > 0) {
      setVitalRowErrors(rowErrors);
      setVitalFormError("");
      return false;
    }
    const payload = rowsToSend.map((r) => ({
      measurementName: r.measurementName.trim(),
      value: r.value.trim(),
      unit: r.unit.trim(),
    }));

    if (!visit) {
      toast.error("Visit not loaded yet");
      return false;
    }
    try {
      const response = await addVisitVitalSigns(visit.id, payload);
      const saved = await handleResponse(response, {
        successMessage: "Vital signs saved successfully.",
        errorMessage: true,
      });
      if (saved) {
        resetRows();
        await refetch();
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err?.message || "Failed to save vital signs");
      return false;
    }
  };

  const triageSkeleton = (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-80 w-full rounded-3xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );

  // While loading (or before visit has arrived), always show skeleton.
  // This prevents the transient "Visit not found" flash on refresh.
  if (loading || (!visit && !error)) return triageSkeleton;

  if (error)
    return (
      <div className="min-h-screen bg-background">
        <Header doctor={doctor} />
        <div className="max-w-5xl mx-auto px-6 py-8">
          <InlineTryAgain
            onTryAgain={async () => {
              await refetch();
            }}
          />
        </div>
      </div>
    );

  if (!visit) return triageSkeleton;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(180deg,_rgba(248,250,252,1)_0%,_rgba(241,245,249,1)_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(15,23,42,1)_100%)]">
      <Header doctor={doctor} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="px-0 hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        {/* patient header: avatar left, actions right */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="rounded-2xl border border-border/60 bg-card/85 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white flex items-center justify-center text-lg font-semibold shadow-xl">
                {getInitials(patientName)}
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-foreground">
                  {patientName}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>
                    {getAge(visit.patient.dateOfBirth) !== null
                      ? `${getAge(visit.patient.dateOfBirth)}y`
                      : ""}
                  </span>
                  <span>{visit.patient.gender || ""}</span>
                </div>
              </div>
            </div>

            {/* actions moved to bottom dock */}
          </div>
        </div>

        {/* current vitals centered — GLOBAL to the visit, unchanged */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <Card className="border-border/60 bg-card/90 shadow-lg backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-xl">
                      Current vital signs
                    </CardTitle>
                    <CardDescription>
                      Most recent measurements recorded for this visit.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {groupedEntries.length > 1 && (
                      <div className="flex items-center gap-1">
                        <button
                          aria-label="Previous entry"
                          onClick={() =>
                            setVitalIndex((i) => Math.max(0, i - 1))
                          }
                          className="p-2 rounded-md hover:bg-muted/40"
                          disabled={vitalIndex === 0}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          aria-label="Next entry"
                          onClick={() =>
                            setVitalIndex((i) =>
                              Math.min(groupedEntries.length - 1, i + 1),
                            )
                          }
                          className="p-2 rounded-md hover:bg-muted/40"
                          disabled={vitalIndex === groupedEntries.length - 1}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {groupedEntries.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-6 text-center">
                    <Activity className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="font-medium text-foreground">
                      No vitals recorded yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Use the Record vital signs button above to capture the
                      first entry.
                    </p>
                  </div>
                ) : (
                  (() => {
                    const group = groupedEntries[vitalIndex];
                    if (!group) return null;
                    return (
                      <div key={group.createdAt} className="space-y-3">
                        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                          <span>
                            {group.createdAt && group.createdAt !== "unknown"
                              ? new Date(group.createdAt).toLocaleString()
                              : ""}
                          </span>
                          {groupedEntries.length > 0 && (
                            <span className="font-medium text-foreground">
                              {group.createdAt && group.createdAt !== "unknown"
                                ? new Date(group.createdAt).toLocaleString()
                                : "Recorded"}
                              {group.addedBy
                                ? ` • ${group.addedBy.firstName || ""} ${group.addedBy.lastName || ""}`
                                : null}
                            </span>
                          )}
                        </div>
                        {group.measurements.map((vital: any) => (
                          <div
                            key={vital.id}
                            className="rounded-2xl border border-border/60 bg-muted/20 p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {vital.measurementName}
                                </p>
                                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                                  {vital.value}{" "}
                                  <span className="text-sm font-medium text-muted-foreground">
                                    {vital.unit}
                                  </span>
                                </p>
                              </div>
                              <div className="text-right text-xs text-muted-foreground">
                                {group.addedBy ? (
                                  <p>
                                    By {group.addedBy.firstName || ""}{" "}
                                    {group.addedBy.lastName || ""}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Visit Departments Card */}
        <div className="flex justify-center mt-6">
          <div className="w-full max-w-3xl">
            <Card className="border-border/60 bg-card/90 shadow-lg backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-xl">
                        Visit Departments
                      </CardTitle>
                      <CardDescription>
                        Departments assigned to this visit. Manage profiles or cancel unserved departments.
                      </CardDescription>
                    </div>
                  </div>
                  {visit.status !== "COMPLETED" && visit.status !== "CANCELLED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAddDeptOpen(true)}
                      className="rounded-full flex items-center gap-1.5 text-xs shadow-sm hover:bg-primary/10 hover:text-primary hover:border-primary/40"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Department
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {(!visit.departments || visit.departments.length === 0) ? (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-6 text-center">
                    <Building2 className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="font-medium text-foreground">
                      No departments assigned yet
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add a department to route this patient to consultation.
                    </p>
                    {visit.status !== "COMPLETED" && visit.status !== "CANCELLED" && (
                      <Button
                        size="sm"
                        onClick={() => setAddDeptOpen(true)}
                        className="mt-4 rounded-full"
                      >
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add Department
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visit.departments.map((dept) => {
                      const deptCatalog = departments.find(
                        (d) => String(d.id) === String(dept.department?.id || dept.id),
                      );
                      const isSupportRequests = Boolean(
                        deptCatalog?.supportRequests || (dept.department as any)?.supportRequests,
                      );
                      const availableProfiles = (deptCatalog?.profiles || (dept.department as any)?.profiles || []) as Array<{ id: string; name: string; encounterType?: string }>;
                      const assignedProfile = dept.profile;
                      const isTerminal = dept.status === "COMPLETED" || dept.status === "FINALISED" || dept.status === "CANCELLED";
                      const isLocked = isTerminal || dept.status === "BILLING" || dept.status === "DEPARTMENT_EDITING";

                      // Can cancel department check: not terminal, no billed products
                      const deptProducts = dept.products || [];
                      const hasBilledProducts = deptProducts.some(
                        (p: any) => p.status === "BILLED" || p.status === "EXEMPTED" || p.status === "PATIENT_SHARE_EXEMPTED",
                      );
                      const canCancel = !isTerminal && !hasBilledProducts;

                      return (
                        <div
                          key={dept.id}
                          className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-semibold text-foreground truncate text-base">
                                {dept.department?.name || "Department"}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                dept.status === "ACTIVE" || (dept.status as string) === "IN_PROGRESS"
                                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                  : dept.status === "PENDING"
                                  ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                  : dept.status === "CANCELLED"
                                  ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}>
                                {dept.status || "PENDING"}
                              </span>
                            </div>

                            {canCancel && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setDeptToCancel({
                                    id: dept.id,
                                    name: dept.department?.name || "Department",
                                  })
                                }
                                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full h-8 px-2.5 flex items-center gap-1"
                              >
                                <X className="h-3.5 w-3.5" />
                                Cancel
                              </Button>
                            )}
                          </div>

                          {/* Profile Management Section */}
                          {isSupportRequests ? (
                            <p className="text-xs text-muted-foreground italic">
                              Requests department (no profiles applicable)
                            </p>
                          ) : availableProfiles.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic">
                              No profiles configured for this department
                            </p>
                          ) : (
                            <div className="space-y-1.5 pt-1 border-t border-border/40">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground font-medium flex items-center gap-1">
                                  <FileText className="h-3 w-3 text-primary" />
                                  Profile:
                                </span>
                                {assignedProfile ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-medium text-foreground">
                                      {assignedProfile.name}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                                      Active
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground italic">
                                    None assigned
                                  </span>
                                )}
                              </div>

                              {!isLocked ? (
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={assignedProfile?.id || "none"}
                                    onValueChange={(val) =>
                                      handleChangeProfile(
                                        dept.id,
                                        val === "none" ? null : val,
                                      )
                                    }
                                    disabled={changingProfile || removingProfile}
                                  >
                                    <SelectTrigger className="h-8 text-xs bg-background">
                                      <SelectValue
                                        placeholder={
                                          assignedProfile
                                            ? "Change profile..."
                                            : "Select & assign profile..."
                                        }
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">
                                        No profile
                                      </SelectItem>
                                      {availableProfiles.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                          {p.name}
                                          {p.encounterType
                                            ? ` (${p.encounterType})`
                                            : ""}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              ) : (
                                <p className="text-[11px] text-muted-foreground">
                                  Profile is locked on {dept.status.toLowerCase()} departments.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <ConfirmDialog
          open={Boolean(deptToCancel)}
          onOpenChange={(open) => {
            if (!open) setDeptToCancel(null);
          }}
          title="Cancel Department"
          description={
            deptToCancel
              ? `Are you sure you want to cancel the ${deptToCancel.name} department for this visit? This action cannot be undone.`
              : undefined
          }
          confirmLabel={cancellingDept ? "Cancelling..." : "Cancel Department"}
          destructive
          busy={cancellingDept}
          onConfirm={() => {
            if (deptToCancel) {
              void handleCancelDepartment(deptToCancel.id);
            }
          }}
        />

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent
            className="sm:max-w-2xl max-h-[90vh] overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-black/25 border border-white/20 rounded-3xl shadow-2xl p-3 flex flex-col"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogTitle className="sr-only">Record vital signs</DialogTitle>
            <div className="grid grid-cols-1 gap-4">
              <div className="overflow-y-auto scrollbar-hide pr-2 pb-6 rounded-2xl border border-border/50 bg-[#FBF2ED] dark:bg-slate-900 shadow-lg p-4 max-h-[64vh]">
                <h3 className="text-lg font-semibold mb-2">
                  Record vital signs
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {vitalFormError && (
                    <p
                      role="alert"
                      className="text-xs font-medium text-red-600 dark:text-red-400"
                    >
                      {vitalFormError}
                    </p>
                  )}
                  <div className="space-y-3">
                    {rows.map((row, index) => {
                      return (
                        <div
                          key={row.id}
                          className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_0.6fr_auto] gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4"
                        >
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Measurement
                            </label>
                            {row.isPreset ? (
                              <div className="flex h-10 items-center rounded-md border border-transparent bg-transparent px-3 text-sm font-medium text-foreground select-none pointer-events-none">
                                {row.measurementName}
                              </div>
                            ) : (
                              <Input
                                value={row.measurementName}
                                onChange={(ev) =>
                                  updateRow(
                                    row.id,
                                    "measurementName",
                                    ev.target.value,
                                  )
                                }
                                placeholder={
                                  index === 0
                                    ? "Blood Pressure"
                                    : "Measurement name"
                                }
                                className={
                                  vitalRowErrors[`${row.id}:name`]
                                    ? "border-red-500 focus-visible:ring-red-300"
                                    : ""
                                }
                              />
                            )}
                            {vitalRowErrors[`${row.id}:name`] && (
                              <p
                                className="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
                                role="alert"
                              >
                                {vitalRowErrors[`${row.id}:name`]}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Value
                            </label>
                            <Input
                              value={row.value}
                              onChange={(ev) =>
                                updateRow(row.id, "value", ev.target.value)
                              }
                              className={
                                vitalRowErrors[row.id]
                                  ? "border-red-500 focus-visible:ring-red-300"
                                  : ""
                              }
                              placeholder={
                                row.isPreset
                                  ? (() => {
                                      switch (row.measurementName) {
                                        case "Blood Pressure":
                                          return "120/80";
                                        case "Heart Rate":
                                          return "72";
                                        case "Temperature":
                                          return "37.0";
                                        case "Oxygen Saturation":
                                          return "98";
                                        case "Weight":
                                          return "70";
                                        case "Height":
                                          return "165";
                                        default:
                                          return "Value";
                                      }
                                    })()                                      : "Value"
                              }
                            />
                            {vitalRowErrors[row.id] && (
                              <p
                                className="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
                                role="alert"
                              >
                                {vitalRowErrors[row.id]}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Unit
                            </label>
                            {row.isPreset ? (
                              <div className="flex h-10 items-center rounded-md border border-transparent bg-transparent px-3 text-sm text-muted-foreground select-none pointer-events-none">
                                {row.unit}
                              </div>
                            ) : (
                              <Input
                                value={row.unit}
                                onChange={(ev) =>
                                  updateRow(row.id, "unit", ev.target.value)
                                }
                                placeholder="mmHg"
                                className={
                                  vitalRowErrors[`${row.id}:unit`]
                                    ? "border-red-500 focus-visible:ring-red-300"
                                    : ""
                                }
                              />
                            )}
                            {vitalRowErrors[`${row.id}:unit`] && (
                              <p
                                className="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
                                role="alert"
                              >
                                {vitalRowErrors[`${row.id}:unit`]}
                              </p>
                            )}
                          </div>
                          <div className="flex items-end justify-end">
                            {!row.isPreset ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeRow(row.id)}
                                disabled={rows.length === 1}
                                className="text-muted-foreground hover:text-destructive rounded-full"
                                aria-label="Remove measurement"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            ) : (
                              <div className="h-10 w-10" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </form>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resetRows();
                    setModalOpen(false);
                  }}
                  className="rounded-full px-5"
                >
                  Cancel
                </Button>
                <div className="flex-1" />
                <Button
                  size="sm"
                  onClick={async () => {
                    const saved = await handleSubmit();
                    if (saved) setModalOpen(false);
                  }}
                  disabled={savingVitals}
                  className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md"
                >
                  {savingVitals ? "Saving..." : "Save vital signs"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AddDepartmentModal
          visit={visit}
          isOpen={addDeptOpen}
          onClose={() => setAddDeptOpen(false)}
          onSuccess={async () => {
            setAddDeptOpen(false);
            await refetch();
          }}
        />

        {/* Floating dock (center bottom) with Add Vital and Add Department. Hidden for completed/cancelled visits. */}
        {visit && !["COMPLETED", "CANCELLED"].includes(visit.status) && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <div className="glass-gray rounded-full shadow-xl px-3 py-2 flex items-center gap-2">
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                        onClick={() => setModalOpen(true)}
                        aria-label="Add vital signs"
                      >
                        <Activity className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add vital signs</p>
                    </TooltipContent>
                  </Tooltip>

                  <div className="w-px h-8 bg-white/20" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                        onClick={() => setAddDeptOpen(true)}
                        aria-label="Add department"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add department</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        )}

        {/*
          ── Department notes (floating, right-side) ──────────────────────────
          Rendered only when the visit has at least 1 department.
          Vitals above remain GLOBAL to the visit — this component only
          handles notes, scoped per-department with tab switching.
        */}
        {(visit.departments?.length ?? 0) > 0 && (
          <DepartmentNotesFloating
            visitId={visit.id}
            visitDepartments={visit.departments ?? []}
            noteTypes={["PUBLIC", "CONSULTATION"]}
            allowedDisplayTypes={["PUBLIC", "CONSULTATION"]}
          />
        )}
      </main>
    </div>
  );
}

export default function TriagePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
      <TriagePageInner />
    </Suspense>
  );
}
