"use client";

import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Visit } from "@/lib/api-types";
import {
  useAddDepartmentToVisit,
  useDepartments,
  useSearchWorkers,
} from "@/hooks/auth-hooks";
import { toast } from "react-toastify";
import { handleResponse } from "@/lib/response-handler";

interface AddDepartmentModalProps {
  visit: Visit;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddDepartmentModal({
  visit,
  isOpen,
  onClose,
  onSuccess,
}: AddDepartmentModalProps) {
  const {
    departments,
    error: departmentsError,
    loading: departmentsLoading,
  } = useDepartments();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [mode, setMode] = useState<"department" | "processor">("department");
  const [processorQuery, setProcessorQuery] = useState("");
  const [selectedProcessorId, setSelectedProcessorId] = useState<string>("");
  const [selectedProcessorDepartmentId, setSelectedProcessorDepartmentId] =
    useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const clearFormError = () => {
    if (formError) setFormError("");
  };

  const clearProcessorSelections = () => {
    setProcessorQuery("");
    setSelectedProcessorId("");
    setSelectedProcessorDepartmentId("");
    clearFormError();
  };
  const { addDepartmentToVisit, loading } = useAddDepartmentToVisit();
  const { workers: processorWorkers, loading: processorsLoading } =
    useSearchWorkers({
      name: processorQuery,
      role: "CLINICIAN",
      activeOnly: true,
    });

  useEffect(() => {
    if (!isOpen || !departmentsError) return;

    toast.error(
      departmentsError || "Failed to load departments for this visit",
    );
    onClose();
  }, [departmentsError, isOpen, onClose]);

  // Block adding departments to locked visit statuses
  useEffect(() => {
    if (!isOpen) return;
    const lockedStatuses = ["COMPLETED", "CANCELLED"];
    if (lockedStatuses.includes(visit.status)) {
      toast.error("Cannot add departments to this visit.");
      onClose();
    }
  }, [isOpen, visit.status, onClose]);

  // Filter out departments already in the visit
  const existingDepartmentIds =
    visit.departments?.map((d) => String(d.department?.id)) || [];
  const isDepartmentAlreadyInVisit = (departmentId: string) =>
    existingDepartmentIds.includes(String(departmentId));

  const availableDepartments = departments.filter(
    (dept) => !isDepartmentAlreadyInVisit(String(dept.id)),
  );

  if (departmentsError) {
    return null;
  }

  const handleSubmit = async () => {
    const departmentIdToUse =
      mode === "processor"
        ? selectedProcessorDepartmentId || selectedDepartmentId
        : selectedDepartmentId;

    if (mode === "processor" && !selectedProcessorId) {
      setFormError("Select a clinician/processor first");
      return;
    }

    if (!departmentIdToUse) {
      setFormError("Choose a department before adding it to the visit");
      return;
    }

    setFormError("");

    try {
      const result = await addDepartmentToVisit(
        visit.id,
        departmentIdToUse,
        mode === "processor" ? selectedProcessorId : null,
        selectedProfileId || null,
      );

      const ok = await handleResponse(result, {
        successMessage: "Department added to visit",
        errorMessage: true,
      });
      if (ok) {
        onSuccess?.();
        onClose();
        setSelectedDepartmentId("");
      }
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error("Failed to add department to visit");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Add Department to Visit
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Patient: {visit.patient.firstName} {visit.patient.lastName}
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visit Date: {new Date(visit.visitDate).toLocaleDateString()}
            </p>
          </div>

          {departmentsLoading ? (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">
              <p className="text-sm">Loading departments...</p>
            </div>
          ) : availableDepartments.length === 0 ? (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">
              <p className="text-sm">
                All departments have been added to this visit
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={mode === "department" ? "default" : "outline"}
                  onClick={() => {
                    setMode("department");
                    clearProcessorSelections();
                  }}
                >
                  Department
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={mode === "processor" ? "default" : "outline"}
                  onClick={() => {
                    setMode("processor");
                    setSelectedDepartmentId("");
                    clearFormError();
                  }}
                >
                  Clinician
                </Button>
              </div>

              {mode === "processor" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Search clinician (type at least 2 letters)
                    </label>
                    <input
                      value={processorQuery}
                      onChange={(e) => {
                        setProcessorQuery(e.target.value);
                        setSelectedProcessorId("");
                        setSelectedProcessorDepartmentId("");
                        clearFormError();
                      }}
                      placeholder="Search by name..."
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                    />
                    {processorsLoading && processorQuery.trim().length >= 2 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Searching...
                      </p>
                    )}
                  </div>

                  {processorWorkers.length > 0 && (
                    <div className="max-h-40 overflow-y-auto rounded-md border border-border">
                      {processorWorkers.map((w: any) => {
                        const fullName =
                          `${w.firstName || ""} ${w.lastName || ""}`.trim();

                        const linkedDepartments: any[] = Array.isArray(
                          w.departments,
                        )
                          ? w.departments
                          : [];
                        const linkedAlreadyAdded = linkedDepartments.filter(
                          (d) => isDepartmentAlreadyInVisit(String(d.id)),
                        );
                        const linkedAvailable = linkedDepartments.filter(
                          (d) => !isDepartmentAlreadyInVisit(String(d.id)),
                        );

                        const isFullyAlreadyAdded =
                          linkedDepartments.length > 0 &&
                          linkedAvailable.length === 0;

                        return (
                          <button
                            key={w.id}
                            type="button"
                            disabled={isFullyAlreadyAdded}
                          onClick={() => {
                            if (isFullyAlreadyAdded) return;
                            clearFormError();

                            setSelectedProcessorId(String(w.id));
                              if (linkedAvailable.length === 1) {
                                setSelectedProcessorDepartmentId(
                                  String(linkedAvailable[0].id),
                                );
                              } else {
                                setSelectedProcessorDepartmentId("");
                              }
                            }}
                            className={`w-full text-left px-3 py-2 text-sm border-b last:border-b-0 border-border/60 ${
                              isFullyAlreadyAdded
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-muted"
                            } ${
                              String(w.id) === String(selectedProcessorId)
                                ? "bg-muted"
                                : ""
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-medium">
                                {fullName || "Unnamed"}
                              </div>
                              {isFullyAlreadyAdded && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                  Already added
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-muted-foreground mt-0.5">
                              {linkedDepartments.length > 0 ? (
                                <>
                                  <div>
                                    Departments:{" "}
                                    {linkedDepartments
                                      .map((d: any) => d.name)
                                      .join(", ")}
                                  </div>
                                  {linkedAlreadyAdded.length > 0 && (
                                    <div>
                                      Already in visit:{" "}
                                      {linkedAlreadyAdded
                                        .map((d: any) => d.name)
                                        .join(", ")}
                                    </div>
                                  )}
                                </>
                              ) : (
                                "No department linked"
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {selectedProcessorId
                    ? (() => {
                        const chosen = processorWorkers.find(
                          (w: any) =>
                            String(w.id) === String(selectedProcessorId),
                        );
                        const linked = Array.isArray(chosen?.departments)
                          ? chosen.departments
                          : [];

                        if (linked.length > 1) {
                          return (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Choose which department for this clinician
                              </label>
                              <select
                                value={selectedProcessorDepartmentId}
                                onChange={(e) =>
                                  setSelectedProcessorDepartmentId(
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                              >
                                <option value="">Select department...</option>
                                {linked
                                  .filter((d: any) =>
                                    availableDepartments.some(
                                      (ad) => String(ad.id) === String(d.id),
                                    ),
                                  )
                                  .map((d: any) => (
                                    <option key={d.id} value={String(d.id)}>
                                      {d.name}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          );
                        }

                        // If none linked OR exactly one linked (auto-set), allow selecting from all available.
                        if (linked.length === 0) {
                          return (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Select Department for clinician
                              </label>

                              <div className="space-y-2">
                                {departments
                                  .filter(
                                    (d) =>
                                      !isDepartmentAlreadyInVisit(String(d.id)),
                                  )
                                  .map((d) => (
                                    <button
                                      key={d.id}
                                      type="button"
                                      onClick={() =>
                                        setSelectedDepartmentId(String(d.id))
                                      }
                                      className="w-full flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                                    >
                                      <span>{d.name}</span>
                                    </button>
                                  ))}

                                {departments
                                  .filter((d) =>
                                    isDepartmentAlreadyInVisit(String(d.id)),
                                  )
                                  .map((d) => (
                                    <button
                                      key={d.id}
                                      type="button"
                                      disabled
                                      className="w-full flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm opacity-50 cursor-not-allowed"
                                    >
                                      <span>{d.name}</span>
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                        Already added
                                      </span>
                                    </button>
                                  ))}
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })()
                    : null}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Select Department
                    </label>

                  <div className="space-y-2">
                    {departments
                      .filter((d) => !isDepartmentAlreadyInVisit(String(d.id)))
                      .map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => {
                            setSelectedDepartmentId(String(d.id));
                            setSelectedProfileId("");
                            clearFormError();
                          }}
                          className={`w-full flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:bg-muted ${
                            String(d.id) === String(selectedDepartmentId)
                              ? "bg-muted"
                              : ""
                          }`}
                        >
                          <span>{d.name}</span>
                          {(d as any).profiles?.length > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                              {(d as any).profiles.length}{" "}
                              profile{(d as any).profiles.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </button>
                      ))}

                    {departments
                      .filter((d) => isDepartmentAlreadyInVisit(String(d.id)))
                      .map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          disabled
                          className="w-full flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm opacity-50 cursor-not-allowed"
                        >
                          <span>{d.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                            Already added
                          </span>
                        </button>
                      ))}
                  </div>
                </div>

                {(() => {
                  const selectedDept = departments.find(
                    (d) => String(d.id) === String(selectedDepartmentId),
                  );
                  const profiles = (selectedDept as any)?.profiles || [];
                  const supportsRequests = Boolean(
                    (selectedDept as any)?.supportRequests,
                  );
                  if (!selectedDept || profiles.length === 0) return null;
                  if (supportsRequests) {
                    return (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        This department supports requests, so a profile cannot
                        be applied. Add its products manually.
                      </p>
                    );
                  }
                  return (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Profile (optional)
                      </label>
                      <select
                        value={selectedProfileId}
                        onChange={(e) => setSelectedProfileId(e.target.value)}
                        className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                      >
                        <option value="">
                          No profile — add products manually
                        </option>
                        {profiles.map((profile: any) => (
                          <option key={profile.id} value={String(profile.id)}>
                            {profile.name}
                            {profile.isDefault ? " (default)" : ""} ·{" "}
                            {profile.products?.length || 0} products
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        No profile is applied automatically. Only the profile
                        you select here will add its products to this
                        department.
                      </p>
                    </div>
                  );
                })()}
                </>
              )}

              {formError && (
                <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                  {formError}
                </p>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={
                    loading ||
                    (mode === "department" && !selectedDepartmentId) ||
                    (mode === "processor" &&
                      (!selectedProcessorId ||
                        !(
                          selectedProcessorDepartmentId || selectedDepartmentId
                        )))
                  }
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {loading ? "Adding..." : "Add Department"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
