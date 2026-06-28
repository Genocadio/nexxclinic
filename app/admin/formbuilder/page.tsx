"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getPreset, TEMPLATE_PRESETS } from "@/lib/formbuilder-presets";
import type { FormTemplateType } from "@/lib/formbuilder-storage";
import { TemplatePicker } from "@/components/formbuilder/template-picker";
import {
  useGetStandaloneForms,
  useCreateStandaloneForm,
  useDeleteStandaloneForm,
  useDuplicateStandaloneForm,
  useUpdateStandaloneForm,
  type StandaloneForm,
} from "@/hooks/standalone-forms";
import {
  Plus,
  Search,
  FileText,
  Copy,
  Trash2,
  PenLine,
  ArrowLeft,
  Clock,
  LayoutGrid,
  List,
  ClipboardPenLine,
  CloudUpload,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<FormTemplateType, string> = {
  consultation: "Consultation",
  consent: "Consent",
  referral: "Referral",
  discharge: "Discharge",
  report: "Report",
  custom: "Custom",
};

const TYPE_COLORS: Record<FormTemplateType, string> = {
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

const CATEGORIES: { label: string; value: FormTemplateType | "all" }[] = [
  { label: "All Forms", value: "all" },
  { label: "Consultation", value: "consultation" },
  { label: "Consent", value: "consent" },
  { label: "Referral", value: "referral" },
  { label: "Discharge", value: "discharge" },
  { label: "Report", value: "report" },
  { label: "Custom", value: "custom" },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

// ─── Save-templates dialog ────────────────────────────────────────────────────

interface SaveTemplatesDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function SaveTemplatesDialog({
  open,
  onClose,
  onSaved,
}: SaveTemplatesDialogProps) {
  const { createForm, loading } = useCreateStandaloneForm();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = TEMPLATE_PRESETS.length;
  const current = TEMPLATE_PRESETS[currentIdx];

  const handleSaveOne = useCallback(async () => {
    if (!current) return;
    setError(null);
    try {
      const preset = getPreset(current.type as FormTemplateType);
      const blocks = preset ? preset.blocks() : [];
      await createForm({
        name: current.label,
        description: `Default ${current.label} template`,
        type: current.type,
        isTemplate: true,
        blocks,
      });
      if (currentIdx + 1 >= total) {
        setDone(true);
        onSaved();
      } else {
        setCurrentIdx((i) => i + 1);
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to save template");
    }
  }, [current, currentIdx, total, createForm, onSaved]);

  const handleSkip = () => {
    if (currentIdx + 1 >= total) {
      setDone(true);
      onSaved();
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handleClose = () => {
    setCurrentIdx(0);
    setDone(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CloudUpload className="h-5 w-5 text-[#FF6900]" />
            Save Templates to Backend
          </DialogTitle>
          <DialogDescription>
            No forms found in the backend. Would you like to save the built-in
            templates to your backend one by one?
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center space-y-2">
            <p className="text-sm font-medium text-emerald-600">
              All templates processed!
            </p>
            <p className="text-xs text-muted-foreground">
              Your templates are now saved to the backend.
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Template {currentIdx + 1} of {total}
              </span>
              <span className="font-medium text-foreground">
                {current?.emoji} {current?.label}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF6900] transition-all"
                style={{ width: `${(currentIdx / total) * 100}%` }}
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Save{" "}
              <span className="font-semibold text-foreground">
                {current?.label}
              </span>{" "}
              template to backend?
            </p>

            {error && (
              <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          {done ? (
            <Button onClick={handleClose}>Done</Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Cancel All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkip}
                disabled={loading}
              >
                Skip
              </Button>
              <Button
                size="sm"
                className="bg-[#FF6900] hover:bg-[#e05f00] text-white gap-1.5"
                onClick={handleSaveOne}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CloudUpload className="h-3.5 w-3.5" />
                )}
                Save
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FormBuilderListPage() {
  const router = useRouter();
  const { doctor, isAuthenticated, isLoading: authLoading } = useAuth();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [category, setCategory] = useState<FormTemplateType | "all">("all");
  const [saveTemplatesOpen, setSaveTemplatesOpen] = useState(false);
  const [templatePromptShown, setTemplatePromptShown] = useState(false);

  const { forms, loading, error, refetch } = useGetStandaloneForms({
    category: category === "all" ? undefined : category,
    name: search.trim() || undefined,
    skip: authLoading || !isAuthenticated,
  });
  const { createForm, loading: creating } = useCreateStandaloneForm();
  const { updateForm, loading: updatingForm } = useUpdateStandaloneForm();
  const { deleteForm } = useDeleteStandaloneForm();
  const { duplicateForm } = useDuplicateStandaloneForm();

  // Show save-templates dialog once when backend is empty after loading
  const shouldPrompt =
    !loading && !error && forms.length === 0 && !templatePromptShown;

  if (shouldPrompt && !saveTemplatesOpen) {
    setTemplatePromptShown(true);
    setSaveTemplatesOpen(true);
  }

  const handleCreate = async (name: string, type: FormTemplateType) => {
    const preset = getPreset(type);
    const blocks = preset ? preset.blocks() : [];
    try {
      const created = await createForm({
        name,
        type,
        blocks,
        isTemplate: false,
      });
      setPickerOpen(false);
      refetch();
      router.push(`/admin/formbuilder/edit?id=${created.id}`);
    } catch (err: any) {
      alert(err?.message ?? "Failed to create form");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this form? This cannot be undone.")) return;
    try {
      await deleteForm(id, true);
      refetch();
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete form");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await duplicateForm(id);
      refetch();
      router.push(`/admin/formbuilder/edit?id=${copy.id}`);
    } catch (err: any) {
      alert(err?.message ?? "Failed to duplicate form");
    }
  };

  const handleToggleTemplate = async (form: StandaloneForm) => {
    if (!form.activeVersion) {
      alert("This form has no active version to update.");
      return;
    }

    try {
      await updateForm(form.id, {
        name: form.name,
        description: form.description,
        type: form.type,
        category: form.category,
        isTemplate: !form.isTemplate,
        blocks: form.activeVersion.blocks,
        theme: form.activeVersion.theme,
      });
      refetch();
    } catch (err: any) {
      alert(err?.message ?? "Failed to update template status");
    }
  };

  const filtered = forms.filter((f) =>
    search.trim() ? true : category === "all" || f.type === category,
  );

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
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
                Form Builder
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {loading ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                  </span>
                ) : (
                  `${forms.length} form${forms.length !== 1 ? "s" : ""} • ${forms.filter((form) => form.isTemplate).length} template${forms.filter((form) => form.isTemplate).length !== 1 ? "s" : ""}`
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {forms.length === 0 && !loading && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setSaveTemplatesOpen(true)}
              >
                <CloudUpload className="h-4 w-4" />
                Save Templates
              </Button>
            )}
            <Button
              onClick={() => setPickerOpen(true)}
              disabled={creating}
              className="bg-[#FF6900] hover:bg-[#e05f00] text-white gap-2"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              New Form
            </Button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-56 shrink-0 space-y-1">
            <h2 className="text-[10px] font-bold text-muted-foreground px-3 mb-2 uppercase tracking-widest">
              Categories
            </h2>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all",
                  category === cat.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {cat.label}
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full",
                    category === cat.value
                      ? "bg-primary-foreground/20"
                      : "bg-muted-foreground/10",
                  )}
                >
                  {cat.value === "all"
                    ? forms.length
                    : forms.filter((f) => f.type === cat.value).length}
                </span>
              </button>
            ))}
          </aside>

          {/* Form list area */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-52 max-w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search forms…"
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-36 rounded-2xl border border-border bg-muted/30 animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-4 opacity-30" />
                {forms.length === 0 ? (
                  <>
                    <p className="text-lg font-medium text-foreground">
                      No forms yet
                    </p>
                    <p className="text-sm mt-1">
                      Create your first form or save the built-in templates to
                      your backend.
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => setSaveTemplatesOpen(true)}
                      >
                        <CloudUpload className="h-4 w-4" />
                        Save Templates
                      </Button>
                      <Button
                        className="bg-[#FF6900] hover:bg-[#e05f00] text-white gap-2"
                        onClick={() => setPickerOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        New Form
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm">No forms match your search.</p>
                    <button
                      className="text-sm text-primary mt-2 underline"
                      onClick={() => setSearch("")}
                    >
                      Clear search
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Grid view */}
            {!loading && viewMode === "grid" && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((form) => {
                  const preset = TEMPLATE_PRESETS.find(
                    (p) => p.type === form.type,
                  );
                  const blockCount = form.activeVersion?.blocks?.length ?? 0;
                  return (
                    <div
                      key={form.id}
                      className="group flex flex-col rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all overflow-hidden cursor-pointer"
                      onClick={() =>
                        router.push(`/admin/formbuilder/edit?id=${form.id}`)
                      }
                    >
                      <div
                        className={`h-1.5 ${preset?.color.includes("blue") ? "bg-blue-400" : preset?.color.includes("rose") ? "bg-rose-400" : preset?.color.includes("amber") ? "bg-amber-400" : preset?.color.includes("emerald") ? "bg-emerald-400" : preset?.color.includes("purple") ? "bg-purple-400" : "bg-slate-400"}`}
                      />
                      <div className="flex flex-col gap-3 p-4 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {preset?.emoji ?? "📄"}
                            </span>
                            {form.isTemplate && (
                              <Badge variant="outline" className="text-[9px]">
                                Template
                              </Badge>
                            )}
                          </div>
                          <Badge
                            className={`text-[10px] px-1.5 py-0 ${TYPE_COLORS[form.type as FormTemplateType] ?? ""}`}
                          >
                            {TYPE_LABELS[form.type as FormTemplateType] ??
                              form.type}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                            {form.name}
                          </h3>
                          {form.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {form.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {blockCount} block{blockCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/50 pt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />{" "}
                            {timeAgo(form.updatedAt)}
                          </span>
                          <div
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              title="View answers"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/admin/formbuilder/answer?id=${form.id}`,
                                );
                              }}
                              className="h-7 gap-1.5 px-2 text-[11px]"
                            >
                              <ClipboardPenLine className="h-3 w-3" />
                              View answers
                            </Button>
                            <button
                              title="Edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/admin/formbuilder/edit?id=${form.id}`,
                                );
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <PenLine className="h-3 w-3" />
                            </button>
                            <button
                              title="Duplicate"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicate(form.id);
                              }}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button
                              title={
                                form.isTemplate
                                  ? "Unset as template"
                                  : "Set as template"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTemplate(form);
                              }}
                              disabled={updatingForm}
                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-50"
                            >
                              <Badge className="h-3 w-3 p-0 text-[8px] bg-transparent text-current border-0 shadow-none">
                                T
                              </Badge>
                            </button>
                            <button
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(form.id);
                              }}
                              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List view */}
            {!loading && viewMode === "list" && filtered.length > 0 && (
              <div className="border border-border rounded-2xl overflow-hidden">
                {filtered.map((form, idx) => {
                  const preset = TEMPLATE_PRESETS.find(
                    (p) => p.type === form.type,
                  );
                  return (
                    <div
                      key={form.id}
                      className={`group flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors ${idx > 0 ? "border-t border-border" : ""}`}
                      onClick={() =>
                        router.push(`/admin/formbuilder/edit?id=${form.id}`)
                      }
                    >
                      <span className="text-lg">{preset?.emoji ?? "📄"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {form.name}
                          </p>
                          {form.isTemplate && (
                            <Badge variant="outline" className="text-[9px]">
                              Template
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {form.activeVersion?.blocks?.length ?? 0} blocks ·
                          updated {timeAgo(form.updatedAt)}
                        </p>
                      </div>
                      <Badge
                        className={`text-[10px] px-1.5 py-0 shrink-0 ${TYPE_COLORS[form.type as FormTemplateType] ?? ""}`}
                      >
                        {TYPE_LABELS[form.type as FormTemplateType] ??
                          form.type}
                      </Badge>
                      <div
                        className="flex items-center gap-1 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/admin/formbuilder/answer?id=${form.id}`,
                            );
                          }}
                          title="View answers"
                          className="h-7 gap-1.5 px-2 text-[11px]"
                        >
                          <ClipboardPenLine className="h-3.5 w-3.5" />
                          View answers
                        </Button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/admin/formbuilder/edit?id=${form.id}`,
                            );
                          }}
                          title="Edit"
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <PenLine className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate(form.id);
                          }}
                          title="Duplicate"
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTemplate(form);
                          }}
                          title={
                            form.isTemplate
                              ? "Unset as template"
                              : "Set as template"
                          }
                          disabled={updatingForm}
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-50"
                        >
                          <Badge className="h-3.5 w-3.5 p-0 text-[8px] bg-transparent text-current border-0 shadow-none">
                            T
                          </Badge>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(form.id);
                          }}
                          title="Delete"
                          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <TemplatePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onCreate={handleCreate}
      />

      <SaveTemplatesDialog
        open={saveTemplatesOpen}
        onClose={() => setSaveTemplatesOpen(false)}
        onSaved={() => {
          setSaveTemplatesOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
