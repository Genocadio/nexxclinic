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
  User,
  ShieldAlert,
  Pencil,
} from "lucide-react";
import { isInsuranceActive, insuranceStatusLabel } from "@/lib/insurance-utils";
import { formatDateOnly } from "@/lib/utils";
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  useUpdateVisitVitalSigns,
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

const defaultRows = (initialHeight = "", initialWeight = ""): VitalRow[] => [
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
    value: initialWeight || "",
    unit: "kg",
    isPreset: true,
  },
  {
    id: "preset-height",
    measurementName: "Height",
    value: initialHeight || "",
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
  const { updateVisitVitalSigns, loading: updatingVitals } =
    useUpdateVisitVitalSigns();
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
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [addDeptOpen, setAddDeptOpen] = useState(false);
  const [vitalIndex, setVitalIndex] = useState(0);
  const [idPanel, setIdPanel] = useState({ pinned: true, hover: false });
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
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

  useEffect(() => {
    if (visit?.departments && visit.departments.length > 0) {
      if (
        !selectedDeptId ||
        !visit.departments.some((d) => d.id === selectedDeptId)
      ) {
        const firstActive = visit.departments.find(
          (d) => d.status !== "COMPLETED" && d.status !== "CANCELLED",
        );
        setSelectedDeptId(firstActive ? firstActive.id : visit.departments[0].id);
      }
    } else {
      setSelectedDeptId(null);
    }
  }, [visit?.departments, selectedDeptId]);

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

  const getPreviousHeightAndWeight = () => {
    let prevHeight = "";
    let prevWeight = "";
    for (const group of groupedEntries) {
      for (const m of group.measurements || []) {
        const name = (m.measurementName || "").trim().toLowerCase();
        if (!prevHeight && name === "height" && m.value) {
          prevHeight = m.value;
        }
        if (!prevWeight && name === "weight" && m.value) {
          prevWeight = m.value;
        }
      }
      if (prevHeight && prevWeight) break;
    }
    return { prevHeight, prevWeight };
  };

  const canEditGroup = (group: any) => {
    if (visit?.status === "COMPLETED" || visit?.status === "CANCELLED")
      return false;
    if (!group.createdAt || group.createdAt === "unknown") return false;
    const createdTime = new Date(group.createdAt).getTime();
    if (isNaN(createdTime)) return false;
    const tenMinutes = 10 * 60 * 1000;
    return Date.now() - createdTime <= tenMinutes;
  };

  const handleOpenAddVitals = () => {
    setEditingGroupId(null);
    const { prevHeight, prevWeight } = getPreviousHeightAndWeight();
    setRows(defaultRows(prevHeight, prevWeight));
    setVitalFormError("");
    setVitalRowErrors({});
    setModalOpen(true);
  };

  const handleEditVitalsGroup = (group: any) => {
    setEditingGroupId(group.id);
    const presetNames = [
      "Blood Pressure",
      "Heart Rate",
      "Temperature",
      "Oxygen Saturation",
      "Weight",
      "Height",
    ];
    const mappedRows: VitalRow[] = (group.measurements || []).map(
      (m: any, idx: number) => ({
        id: m.id || `edit-${idx}`,
        measurementName: m.measurementName,
        value: m.value,
        unit: m.unit,
        isPreset: presetNames.includes(m.measurementName),
      }),
    );
    setRows(mappedRows.length > 0 ? mappedRows : defaultRows());
    setVitalFormError("");
    setVitalRowErrors({});
    setModalOpen(true);
  };

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
  const addRow = () => {
    const newId = `custom-${Date.now()}`;
    setRows((rs) => [
      ...rs,
      {
        id: newId,
        measurementName: "",
        value: "",
        unit: "",
        isPreset: false,
      },
    ]);
  };
  const resetRows = () => {
    const { prevHeight, prevWeight } = getPreviousHeightAndWeight();
    setRows(defaultRows(prevHeight, prevWeight));
    setEditingGroupId(null);
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
      let response;
      if (editingGroupId) {
        response = await updateVisitVitalSigns(editingGroupId, payload);
      } else {
        response = await addVisitVitalSigns(visit.id, payload);
      }
      const saved = await handleResponse(response, {
        successMessage: editingGroupId
          ? "Vital signs updated successfully."
          : "Vital signs saved successfully.",
        errorMessage: true,
      });
      if (saved) {
        resetRows();
        setEditingGroupId(null);
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

      {/* Floating Left Identification Button */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 bg-card/60 backdrop-blur-xl border border-border/50 rounded-full p-2 shadow-2xl">
        <button
          title="Identification"
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            idPanel.pinned
              ? "bg-primary/20 text-primary ring-2 ring-primary/40"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          onMouseEnter={() =>
            setIdPanel((prev) => ({ ...prev, hover: !prev.pinned }))
          }
          onMouseLeave={() => setIdPanel((prev) => ({ ...prev, hover: false }))}
          onClick={() =>
            setIdPanel((prev) => ({ ...prev, pinned: !prev.pinned, hover: false }))
          }
        >
          <User className="w-5 h-5" />
        </button>
      </div>

      {/* Identification Panel */}
      {(idPanel.pinned || idPanel.hover) && visit?.patient && (
        <div
          className="fixed z-40 w-80 bg-background border border-border rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
          style={{ left: "5rem", top: "50%", transform: "translateY(-50%)" }}
          onMouseEnter={() => setIdPanel((prev) => ({ ...prev, hover: true }))}
          onMouseLeave={() => setIdPanel((prev) => ({ ...prev, hover: false }))}
        >
          <div className="flex items-center justify-between p-3 border-b border-border">
            <p className="text-sm font-semibold">Identification</p>
            {idPanel.pinned && (
              <span className="text-xs bg-muted px-2 py-1 rounded font-medium">
                Pinned
              </span>
            )}
          </div>
          <div className="p-4 space-y-2 text-sm">
            <div className="font-medium text-foreground">
              {visit.patient.firstName} {visit.patient.lastName || ""}
            </div>
            {visit.patient.patientIdentifier && (
              <div className="text-muted-foreground">
                ID: {visit.patient.patientIdentifier}
              </div>
            )}
            <div className="text-muted-foreground">
              DOB: {formatDateOnly(visit.patient.dateOfBirth)}
              {getAge(visit.patient.dateOfBirth) !== null
                ? ` (${getAge(visit.patient.dateOfBirth)}y)`
                : ""}
            </div>
            {visit.patient.gender && (
              <div className="text-muted-foreground">
                Gender: {visit.patient.gender}
              </div>
            )}
            {visit.patient.primaryPhoneNumber && (
              <div className="text-muted-foreground">
                Phone: {visit.patient.primaryPhoneNumber}
              </div>
            )}
            <div className="pt-2 border-t border-border/40">
              {visit.patient.patientInsurances && visit.patient.patientInsurances.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Insurance
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {visit.patient.patientInsurances.map((ins: any) => {
                      const active = isInsuranceActive(ins);
                      return (
                        <span
                          key={ins.id}
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${
                            active
                              ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30"
                              : "bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700 opacity-60"
                          }`}
                          title={active ? ins.insuranceProvider?.insuranceName : insuranceStatusLabel(ins)}
                        >
                          {!active && <ShieldAlert className="inline h-3 w-3 mr-0.5 -mt-0.5" />}
                          {ins.insuranceProvider?.acronym ||
                            ins.insuranceProvider?.insuranceName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-xs font-medium text-muted-foreground">
                  <span className="inline-block bg-muted/40 px-2 py-1 rounded-full">
                    Private
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Vital Signs Section (Centered Vertical Tables + Increased Height + Rightmost Circular Add Button) */}
        <div className="flex justify-center w-full my-4">
          <div className="w-full max-w-5xl space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Vital Signs
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Recorded physiological measurements
                  </p>
                </div>
                {groupedEntries.length > 0 && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25 font-semibold ml-2">
                    {groupedEntries.length}{" "}
                    {groupedEntries.length === 1 ? "record" : "records"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-center items-stretch gap-6 overflow-x-auto pb-4 pt-1 scrollbar-thin">
              {groupedEntries.map((group, index) => {
                const isLatest = index === 0;
                const canEdit = canEditGroup(group);

                return (
                  <div
                    key={group.id || group.createdAt}
                    className={`flex-shrink-0 w-80 sm:w-96 rounded-3xl border bg-card/95 shadow-xl backdrop-blur-2xl overflow-hidden flex flex-col min-h-[380px] transition-all hover:shadow-2xl ${
                      isLatest
                        ? "border-primary/50 ring-2 ring-primary/30"
                        : "border-border/80"
                    }`}
                  >
                    {/* Table Header */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/70 bg-muted/40">
                      <div className="flex items-center gap-2 min-w-0">
                        {isLatest && (
                          <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/40 shadow-xs">
                            Latest
                          </span>
                        )}
                        <span className="text-sm font-bold text-foreground truncate">
                          {group.createdAt && group.createdAt !== "unknown"
                            ? new Date(group.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              }) +
                              " • " +
                              new Date(group.createdAt).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                              })
                            : "Recorded"}
                        </span>
                      </div>

                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => handleEditVitalsGroup(group)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/15 transition-all cursor-pointer"
                          title="Edit vitals (within 10m)"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {group.addedBy && (
                      <div className="px-5 py-1.5 bg-muted/15 text-xs text-muted-foreground font-medium border-b border-border/40 truncate">
                        Recorded by {group.addedBy.firstName || ""}{" "}
                        {group.addedBy.lastName || ""}
                      </div>
                    )}

                    {/* Vertical Table */}
                    <div className="p-0 flex-1 flex flex-col justify-between">
                      <table className="w-full text-sm text-left border-collapse">
                        <tbody>
                          {group.measurements.map((vital: any, mIdx: number) => (
                            <tr
                              key={vital.id || mIdx}
                              className="border-b border-border/50 last:border-0 hover:bg-muted/25 transition-colors"
                            >
                              <td className="px-5 py-3 font-medium text-foreground/80">
                                {vital.measurementName}
                              </td>
                              <td className="px-5 py-3 text-right whitespace-nowrap">
                                <span className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                                  {vital.value}
                                </span>
                                <span className="text-xs font-semibold text-muted-foreground ml-1.5">
                                  {vital.unit}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              {/* Circular Add Button on the rightmost */}
              {visit.status !== "COMPLETED" && visit.status !== "CANCELLED" && (
                <div className="flex-shrink-0 flex flex-col items-center justify-center min-h-[380px] w-36 gap-3 border-2 border-dashed border-primary/40 hover:border-primary/80 rounded-3xl bg-card/50 hover:bg-primary/5 transition-all p-4 shadow-sm hover:shadow-md">
                  <button
                    type="button"
                    onClick={handleOpenAddVitals}
                    className="w-16 h-16 rounded-full border-2 border-primary/60 hover:border-primary bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all cursor-pointer group"
                    title="Add Vital Signs"
                  >
                    <Plus className="w-8 h-8 transition-transform group-hover:scale-110" />
                  </button>
                  <span className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors text-center">
                    Add Vitals
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Visit Departments (Pill Dock) */}
        <div className="flex items-center justify-center mt-6">
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-card/85 backdrop-blur-md rounded-full border border-border/70 shadow-sm max-w-full">
            {visit.departments && visit.departments.length > 0 ? (
              <>
                {visit.departments.map((dept, index) => {
                  const isCompleted =
                    dept.status === "COMPLETED" || dept.status === "FINALISED";
                  const isCancelled = dept.status === "CANCELLED";

                  // Can cancel department check: not terminal, no billed products
                  const deptProducts = dept.products || [];
                  const hasBilledProducts = deptProducts.some(
                    (p: any) =>
                      p.status === "BILLED" ||
                      p.status === "EXEMPTED" ||
                      p.status === "PATIENT_SHARE_EXEMPTED",
                  );
                  const canCancel =
                    !isCompleted && !isCancelled && !hasBilledProducts;

                  const totalDepts = visit.departments?.length ?? 0;
                  const isMany = totalDepts > 6;
                  const isOlder = isMany && index < totalDepts - 4;
                  const deptName = dept.department?.name || `Dept #${index + 1}`;
                  const shortLetters = deptName.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() || "DP";

                  return (
                    <div
                      key={dept.id}
                      className={`group relative flex items-center h-8 rounded-full text-xs font-semibold transition-all duration-300 ease-in-out border ${
                        isCompleted
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25"
                          : isCancelled
                          ? "bg-red-500/10 text-red-500 border-red-500/20 line-through opacity-70"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
                      } ${
                        isOlder
                          ? "px-2.5 hover:px-3.5"
                          : "px-3.5"
                      }`}
                      title={deptName}
                    >
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          isCompleted
                            ? "bg-emerald-500"
                            : isCancelled
                            ? "bg-red-500"
                            : "bg-amber-500 animate-pulse"
                        }`}
                      />

                      {isOlder ? (
                        <>
                          {/* 2-letter abbreviation by default when older */}
                          <span className="font-bold uppercase tracking-wider ml-1.5 group-hover:hidden select-none">
                            {shortLetters}
                          </span>
                          {/* Expands on hover to show full name, status, and cancel */}
                          <div className="hidden group-hover:flex items-center gap-1.5 ml-1.5 whitespace-nowrap animate-in fade-in duration-200">
                            <span className="font-bold max-w-[160px] truncate">
                              {deptName}
                            </span>
                            <span className="text-[10px] uppercase font-bold opacity-80">
                              {dept.status || "PENDING"}
                            </span>
                            {canCancel && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeptToCancel({
                                    id: dept.id,
                                    name: deptName,
                                  });
                                }}
                                title="Cancel department"
                                className="ml-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 ml-1.5 whitespace-nowrap">
                          <span className="font-bold max-w-[160px] truncate">
                            {deptName}
                          </span>
                          <span className="text-[10px] uppercase font-bold opacity-80">
                            {dept.status || "PENDING"}
                          </span>
                          {canCancel && (
                            <button
                              type="button"
                              onClick={() =>
                                setDeptToCancel({
                                  id: dept.id,
                                  name: deptName,
                                })
                              }
                              title="Cancel department"
                              className="ml-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {visit.status !== "COMPLETED" &&
                  visit.status !== "CANCELLED" && (
                    <button
                      type="button"
                      onClick={() => setAddDeptOpen(true)}
                      className="flex items-center gap-1.5 h-8 px-3.5 rounded-full text-xs font-semibold border border-dashed border-primary/50 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary transition-all cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Department</span>
                    </button>
                  )}
              </>
            ) : (
              visit.status !== "COMPLETED" &&
              visit.status !== "CANCELLED" && (
                <button
                  type="button"
                  onClick={() => setAddDeptOpen(true)}
                  className="flex items-center gap-1.5 h-8 px-4 rounded-full text-xs font-semibold border border-dashed border-primary/50 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Department</span>
                </button>
              )
            )}
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
            showCloseButton={false}
            className="sm:max-w-2xl bg-card/95 text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-6 flex flex-col gap-4"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {editingGroupId ? "Edit Vital Signs" : "Record Vital Signs"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Enter patient physiological measurements
                </DialogDescription>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
              {vitalFormError && (
                <div
                  role="alert"
                  className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium"
                >
                  {vitalFormError}
                </div>
              )}

              {/* 6 Preset vitals in a sleek 3-column / 2-row grid (no scrolling needed) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {rows
                  .filter((r) => r.isPreset)
                  .map((row) => {
                    const hasError = !!vitalRowErrors[row.id];
                    return (
                      <div
                        key={row.id}
                        className={`rounded-2xl border p-3 bg-muted/20 hover:bg-muted/30 transition-all flex flex-col justify-between gap-1 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary ${
                          hasError
                            ? "border-red-500/80 bg-red-500/5"
                            : "border-border/70 hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-foreground/80 truncate">
                            {row.measurementName}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded-md">
                            {row.unit}
                          </span>
                        </div>
                        <Input
                          value={row.value}
                          onChange={(ev) =>
                            updateRow(row.id, "value", ev.target.value)
                          }
                          placeholder={
                            row.measurementName === "Blood Pressure"
                              ? "120/80"
                              : row.measurementName === "Heart Rate"
                              ? "72"
                              : row.measurementName === "Temperature"
                              ? "37.0"
                              : row.measurementName === "Oxygen Saturation"
                              ? "98"
                              : row.measurementName === "Weight"
                              ? "70"
                              : row.measurementName === "Height"
                              ? "165"
                              : "Value"
                          }
                          className="h-8 text-lg font-bold text-indigo-700 dark:text-indigo-300 placeholder:text-muted-foreground/30 border-0 bg-transparent px-0 focus-visible:ring-0 shadow-none"
                        />
                        {hasError && (
                          <p className="text-[10px] font-medium text-red-600 dark:text-red-400 truncate">
                            {vitalRowErrors[row.id]}
                          </p>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Custom Measurements (if any) */}
              {rows.some((r) => !r.isPreset) && (
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-semibold text-muted-foreground">
                    Additional Measurements
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                    {rows
                      .filter((r) => !r.isPreset)
                      .map((row) => (
                        <div
                          key={row.id}
                          className="flex items-center gap-2 p-2 rounded-xl border border-border/60 bg-muted/20"
                        >
                          <div className="flex-1">
                            <Input
                              value={row.measurementName}
                              onChange={(e) =>
                                updateRow(
                                  row.id,
                                  "measurementName",
                                  e.target.value,
                                )
                              }
                              placeholder="Name (e.g. Glucose)"
                              className={`h-8 text-xs font-medium ${
                                vitalRowErrors[`${row.id}:name`]
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {vitalRowErrors[`${row.id}:name`] && (
                              <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">
                                {vitalRowErrors[`${row.id}:name`]}
                              </p>
                            )}
                          </div>
                          <div className="w-24">
                            <Input
                              value={row.value}
                              onChange={(e) =>
                                updateRow(row.id, "value", e.target.value)
                              }
                              placeholder="Value"
                              className={`h-8 text-xs font-bold ${
                                vitalRowErrors[row.id] ? "border-red-500" : ""
                              }`}
                            />
                            {vitalRowErrors[row.id] && (
                              <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">
                                {vitalRowErrors[row.id]}
                              </p>
                            )}
                          </div>
                          <div className="w-20">
                            <Input
                              value={row.unit}
                              onChange={(e) =>
                                updateRow(row.id, "unit", e.target.value)
                              }
                              placeholder="Unit"
                              className={`h-8 text-xs ${
                                vitalRowErrors[`${row.id}:unit`]
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {vitalRowErrors[`${row.id}:unit`] && (
                              <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">
                                {vitalRowErrors[`${row.id}:unit`]}
                              </p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRow(row.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-lg flex-shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Add Custom Vital Trigger */}
              <div className="flex items-center justify-between pt-0.5">
                <button
                  type="button"
                  onClick={addRow}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add custom vital
                </button>
              </div>

              {/* Action Buttons (Cancel and Save/Update, No X button in header) */}
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resetRows();
                    setModalOpen(false);
                  }}
                  className="rounded-full px-5 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={async () => {
                    const saved = await handleSubmit();
                    if (saved) setModalOpen(false);
                  }}
                  disabled={savingVitals || updatingVitals}
                  className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white font-semibold shadow-md cursor-pointer"
                >
                  {savingVitals || updatingVitals
                    ? "Saving..."
                    : editingGroupId
                    ? "Update vital signs"
                    : "Save vital signs"}
                </Button>
              </div>
            </form>
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
