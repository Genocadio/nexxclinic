"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MediaUploader } from "@/components/ui/media-uploader";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field-error";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAuth } from "@/lib/auth-context";
import {
  useCreateInsuranceProvider,
  useDeleteInsuranceProvider,
  useInsurances,
  useUpdateInsuranceProvider,
} from "@/hooks/auth-hooks";
import { Pencil, Trash2, ArrowLeft, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  insuranceProviderFormSchema,
  type InsuranceProviderFormValues,
} from "@/lib/form-schemas";

export default function ManageInsurancesPage() {
  const router = useRouter();
  const { doctor } = useAuth();
  const { insurances, loading, error, refetch } = useInsurances({
    supportedByClinic: null,
    page: 0,
    size: 200,
  });
  const { createInsuranceProvider } = useCreateInsuranceProvider();
  const { updateInsuranceProvider } = useUpdateInsuranceProvider();
  const { deleteInsuranceProvider } = useDeleteInsuranceProvider();
  const [iconUrl, setIconUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors: formErrors },
  } = useForm<InsuranceProviderFormValues>({
    resolver: zodResolver(insuranceProviderFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      acronym: "",
      coverage: "",
      supportedByClinic: true,
    },
  });

  const resetForm = () => {
    reset({
      name: "",
      acronym: "",
      coverage: "",
      supportedByClinic: true,
    });
    setIconUrl("");
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleCreate = async (values: InsuranceProviderFormValues) => {
    const coverageValue = Number(values.coverage);
    setSaving(true);
    try {
      const response = await createInsuranceProvider({
        insuranceName: values.name,
        acronym: values.acronym,
        defaultCoveragePercentage: coverageValue,
        supportedByClinic: values.supportedByClinic,
        iconUrl: iconUrl || undefined,
      });
      if (response?.status === "SUCCESS") {
        await refetch();
        toast.success(
          response?.message || "Insurance provider created successfully!",
        );
        resetForm();
        setModalOpen(false);
      } else {
        toast.error(response?.message || "Failed to create insurance provider");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to create insurance provider");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (values: InsuranceProviderFormValues) => {
    if (editingId == null) return;
    const coverageValue = Number(values.coverage);
    setSaving(true);
    try {
      const response = await updateInsuranceProvider(editingId, {
        insuranceName: values.name,
        acronym: values.acronym,
        defaultCoveragePercentage: coverageValue,
        supportedByClinic: values.supportedByClinic,
        iconUrl: iconUrl || undefined,
      });
      if (response?.status === "SUCCESS") {
        await refetch();
        toast.success(
          response?.message || "Insurance provider updated successfully!",
        );
        resetForm();
        setModalOpen(false);
      } else {
        toast.error(response?.message || "Failed to update insurance provider");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update insurance provider");
    } finally {
      setSaving(false);
    }
  };

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      const response = await deleteInsuranceProvider(id);
      if (response?.status === "SUCCESS") {
        await refetch();
        if (editingId === id) resetForm();
        toast.success(
          response?.message || "Insurance provider deleted successfully!",
        );
      } else {
        toast.error(response?.message || "Delete failed: Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete insurance provider");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header doctor={doctor} />
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        {/* Title Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => router.push("/admin")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Manage Insurances
              </h1>
              <p className="text-muted-foreground">
                Create, edit, and delete insurances.
              </p>
            </div>
          </div>
          <Button
            onClick={openAddModal}
            className="rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Insurance
          </Button>
        </div>

        {/* Mobile Sticky FAB */}
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <Button
            onClick={openAddModal}
            className="h-12 w-12 rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Register / Edit Insurance Dialog Modal */}
        <Dialog
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-black/25 border border-white/20 rounded-3xl shadow-2xl p-3 flex flex-col">
            <div className="flex-1 overflow-hidden bg-[#FBF2ED] dark:bg-slate-900 border border-border/40 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {editingId
                    ? "Edit Insurance Provider"
                    : "Register Insurance Provider"}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "Modify the fields below to update the insurance provider."
                    : "Fill in the details below to create and register a new insurance provider."}
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto pr-2 space-y-5 my-4 scrollbar-thin">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Insurance Name *
                  </label>
                  <Input
                    placeholder="e.g. RSSB"
                    {...register("name")}
                    className={`rounded-xl bg-white dark:bg-slate-950 ${formErrors.name ? "border-red-500 focus-visible:ring-red-300" : ""}`}
                  />
                  <FieldError message={formErrors.name?.message} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Acronym *
                  </label>
                  <Input
                    placeholder="e.g. RSSB"
                    {...register("acronym")}
                    className={`rounded-xl bg-white dark:bg-slate-950 ${formErrors.acronym ? "border-red-500 focus-visible:ring-red-300" : ""}`}
                  />
                  <FieldError message={formErrors.acronym?.message} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Default Coverage Percentage *
                  </label>
                  <Input
                    placeholder="e.g. 85"
                    type="number"
                    {...register("coverage")}
                    className={`rounded-xl bg-white dark:bg-slate-950 ${formErrors.coverage ? "border-red-500 focus-visible:ring-red-300" : ""}`}
                  />
                  <FieldError message={formErrors.coverage?.message} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Coverage document (upload)
                  </label>

                  <MediaUploader
                    accept="image/*,application/pdf"
                    multiple={false}
                    disabled={saving}
                    currentUrl={iconUrl || undefined}
                    hint="Upload the insurance coverage document (PDF/image)."
                    onUploaded={(files) => {
                      const first = files[0];
                      setIconUrl(first?.url || "");
                    }}
                    onError={(err) => {
                      console.error("Coverage upload error:", err);
                    }}
                  />

                  {/* Hidden storage field (we store the uploaded file URL) */}
                  <Input type="hidden" value={iconUrl} readOnly />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="supported-checkbox"
                    checked={getValues("supportedByClinic")}
                    onCheckedChange={(checked) =>
                      setValue("supportedByClinic", Boolean(checked), {
                        shouldValidate: true,
                      })
                    }
                  />
                  <label
                    htmlFor="supported-checkbox"
                    className="text-sm font-semibold text-foreground cursor-pointer select-none"
                  >
                    Supported by clinic
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/30 sticky bottom-0 bg-background/95 dark:bg-slate-900/95 -mx-2 px-2 pb-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-5"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingId ? handleSubmit(handleUpdate) : handleSubmit(handleCreate)}
                  className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md"
                  disabled={saving}
                >
                  {editingId ? "Update Provider" : "Register Provider"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Existing Insurances Panel */}
        <section className="bg-card/70 dark:bg-slate-900/70 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <p className="text-sm font-semibold text-foreground">
            Existing Insurances
          </p>

          <div className="space-y-2">
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, idx) => (
                  <Skeleton
                    key={idx}
                    className="h-14 w-full rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <p className="text-destructive text-sm">
                {typeof error === "string"
                  ? error
                  : "Failed to load insurances"}
              </p>
            ) : insurances.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No insurances yet.
              </p>
            ) : (
              <div className="space-y-2">
                {insurances.map((ins) => (
                  <div
                    key={ins.id}
                    className="flex items-center justify-between bg-card/60 dark:bg-slate-900/60 border border-border/40 dark:border-slate-800 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{ins.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ins.acronym} • {ins.defaultCoveragePercentage}%
                        coverage •{" "}
                        {ins.supportedByClinic
                          ? "Clinic Supported"
                          : "External"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          setEditingId(ins.id);
                          reset({
                            name: ins.insuranceName || "",
                            acronym: ins.acronym || "",
                            coverage: String(ins.defaultCoveragePercentage),
                            supportedByClinic: Boolean(ins.supportedByClinic),
                          });
                          setIconUrl(ins.iconUrl || "");
                          setModalOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="rounded-full"
                        onClick={() => setDeleteTargetId(ins.id)}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
        title="Delete insurance provider?"
        description="This provider and its coverages will be removed. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (!deleteTargetId) return;
          setDeleteTargetId(null);
          void handleDelete(deleteTargetId);
        }}
      />
    </div>
  );
}
