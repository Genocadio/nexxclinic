"use client";

import { useEffect, useState, useMemo } from "react";
import { X, Plus, Search, Building2, User, Check, Loader2 } from "lucide-react";
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
  const [departmentQuery, setDepartmentQuery] = useState<string>("");
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

  // Filter out non-cancelled departments already in the visit
  const existingDepartmentIds = useMemo(
    () =>
      visit.departments
        ?.filter((d) => d.status !== "CANCELLED")
        .map((d) => String(d.department?.id)) || [],
    [visit.departments],
  );

  const isDepartmentAlreadyInVisit = (departmentId: string) =>
    existingDepartmentIds.includes(String(departmentId));

  const availableDepartments = useMemo(
    () => departments.filter((dept) => !isDepartmentAlreadyInVisit(String(dept.id))),
    [departments, existingDepartmentIds],
  );

  const filteredDepartments = useMemo(() => {
    const q = departmentQuery.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter((dept) =>
      dept.name?.toLowerCase().includes(q),
    );
  }, [departments, departmentQuery]);

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
        null,
      );

      const ok = await handleResponse(result, {
        successMessage: "Department added to visit",
        errorMessage: true,
      });
      if (ok) {
        onSuccess?.();
        onClose();
        setSelectedDepartmentId("");
        setDepartmentQuery("");
      }
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error("Failed to add department to visit");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-card/95 text-card-foreground rounded-2xl border border-border/80 shadow-2xl backdrop-blur-2xl w-full max-w-md p-6 animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header - Centered Layout */}
        <div className="relative mb-4 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Add Department to Visit
          </h3>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Patient Summary Card - Centered */}
        <div className="text-center rounded-xl bg-muted/60 backdrop-blur-sm border border-border/60 p-3 mb-5 space-y-1">
          <p className="text-sm font-medium text-foreground">
            Patient: {visit.patient?.firstName} {visit.patient?.lastName}
          </p>
          <p className="text-xs text-muted-foreground">
            Visit Date: {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString() : "N/A"}
          </p>
        </div>

        <div className="space-y-4">
          {departmentsLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm">Loading departments...</p>
            </div>
          ) : availableDepartments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm font-medium">
                All departments have been added to this visit
              </p>
            </div>
          ) : (
            <>
              {/* Mode Toggle - Centered */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={mode === "department" ? "default" : "outline"}
                  onClick={() => {
                    setMode("department");
                    clearProcessorSelections();
                  }}
                  className="px-4"
                >
                  <Building2 className="h-4 w-4 mr-1.5" />
                  Department
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={mode === "processor" ? "default" : "outline"}
                  onClick={() => {
                    setMode("processor");
                    setSelectedDepartmentId("");
                    setDepartmentQuery("");
                    clearFormError();
                  }}
                  className="px-4"
                >
                  <User className="h-4 w-4 mr-1.5" />
                  Clinician
                </Button>
              </div>

              {mode === "processor" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-center text-sm font-medium text-foreground mb-1.5">
                      Search Clinician
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        value={processorQuery}
                        onChange={(e) => {
                          setProcessorQuery(e.target.value);
                          setSelectedProcessorId("");
                          setSelectedProcessorDepartmentId("");
                          clearFormError();
                        }}
                        placeholder="Search clinician by name..."
                        className="w-full rounded-md border border-input bg-background pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      {processorQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setProcessorQuery("");
                            setSelectedProcessorId("");
                            setSelectedProcessorDepartmentId("");
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {processorsLoading && processorQuery.trim().length >= 2 && (
                      <p className="mt-1 text-center text-xs text-muted-foreground">
                        Searching...
                      </p>
                    )}
                  </div>

                  {processorWorkers.length > 0 && (
                    <div className="max-h-44 overflow-y-auto rounded-md border border-border bg-card">
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

                        const isSelected = String(w.id) === String(selectedProcessorId);

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
                            className={`w-full text-left px-3 py-2 text-sm border-b last:border-b-0 border-border/60 transition-colors ${
                              isFullyAlreadyAdded
                                ? "opacity-50 cursor-not-allowed bg-muted/20"
                                : isSelected
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted text-foreground"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-medium">
                                {fullName || "Unnamed"}
                              </div>
                              {isFullyAlreadyAdded ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                  Already added
                                </span>
                              ) : isSelected ? (
                                <Check className="h-4 w-4 text-primary shrink-0" />
                              ) : null}
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
                              <label className="block text-center text-sm font-medium text-foreground mb-1.5">
                                Choose department for this clinician
                              </label>
                              <select
                                value={selectedProcessorDepartmentId}
                                onChange={(e) =>
                                  setSelectedProcessorDepartmentId(
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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

                        // If none linked, allow selecting from available departments
                        if (linked.length === 0) {
                          return (
                            <div>
                              <label className="block text-center text-sm font-medium text-foreground mb-1.5">
                                Select Department for clinician
                              </label>

                              <div className="max-h-40 overflow-y-auto rounded-md border border-border bg-card">
                                {departments
                                  .filter(
                                    (d) =>
                                      !isDepartmentAlreadyInVisit(String(d.id)),
                                  )
                                  .map((d) => {
                                    const isSelected =
                                      String(d.id) ===
                                      String(selectedDepartmentId);
                                    return (
                                      <button
                                        key={d.id}
                                        type="button"
                                        onClick={() =>
                                          setSelectedDepartmentId(String(d.id))
                                        }
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm border-b last:border-b-0 border-border/60 transition-colors ${
                                          isSelected
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "hover:bg-muted text-foreground"
                                        }`}
                                      >
                                        <span>{d.name}</span>
                                        {isSelected && (
                                          <Check className="h-4 w-4 text-primary shrink-0" />
                                        )}
                                      </button>
                                    );
                                  })}

                                {departments
                                  .filter((d) =>
                                    isDepartmentAlreadyInVisit(String(d.id)),
                                  )
                                  .map((d) => (
                                    <button
                                      key={d.id}
                                      type="button"
                                      disabled
                                      className="w-full flex items-center justify-between px-3 py-2 text-sm border-b last:border-b-0 border-border/60 opacity-50 cursor-not-allowed bg-muted/20"
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
                /* Department Search with Auto-suggestion */
                <div className="space-y-3">
                  <div>
                    <label className="block text-center text-sm font-medium text-foreground mb-1.5">
                      Search Department
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        value={departmentQuery}
                        onChange={(e) => {
                          setDepartmentQuery(e.target.value);
                          setSelectedDepartmentId("");
                          clearFormError();
                        }}
                        placeholder="Search department by name..."
                        className="w-full rounded-md border border-input bg-background pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      {departmentQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setDepartmentQuery("");
                            setSelectedDepartmentId("");
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Auto-suggest dropdown list */}
                  {filteredDepartments.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto rounded-md border border-border bg-card">
                      {filteredDepartments.map((dept) => {
                        const isAlreadyAdded = isDepartmentAlreadyInVisit(
                          String(dept.id),
                        );
                        const isSelected =
                          String(dept.id) === String(selectedDepartmentId);

                        return (
                          <button
                            key={dept.id}
                            type="button"
                            disabled={isAlreadyAdded}
                            onClick={() => {
                              if (isAlreadyAdded) return;
                              setSelectedDepartmentId(String(dept.id));
                              setDepartmentQuery(dept.name);
                              clearFormError();
                            }}
                            className={`w-full text-left px-3 py-2.5 text-sm border-b last:border-b-0 border-border/60 flex items-center justify-between transition-colors ${
                              isAlreadyAdded
                                ? "opacity-50 cursor-not-allowed bg-muted/20"
                                : isSelected
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span>{dept.name}</span>
                            </div>
                            {isAlreadyAdded ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                Already added
                              </span>
                            ) : isSelected ? (
                              <Check className="h-4 w-4 text-primary shrink-0" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-sm text-muted-foreground rounded-md border border-dashed border-border">
                      No departments found matching &ldquo;{departmentQuery}&rdquo;
                    </div>
                  )}
                </div>
              )}

              {formError && (
                <p
                  className="text-center text-xs font-medium text-destructive mt-2"
                  role="alert"
                >
                  {formError}
                </p>
              )}

              {/* Action Button - Centered */}
              <div className="mt-6">
                <Button
                  onClick={handleSubmit}
                  className="w-full"
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
                  <Plus className="h-4 w-4 mr-1.5" />
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
