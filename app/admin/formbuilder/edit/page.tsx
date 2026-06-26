"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { FormBlock, SavedForm } from "@/lib/formbuilder-storage";
import { TEMPLATE_PRESETS } from "@/lib/formbuilder-presets";
import { BlockCanvas } from "@/components/formbuilder/block-canvas";
import { PreviewSheet } from "@/components/formbuilder/preview-sheet";
import { FormRenderer } from "@/components/formbuilder/form-renderer";
import {
  useGetStandaloneForm,
  useUpdateStandaloneForm,
} from "@/hooks/standalone-forms";
import {
  ArrowLeft,
  Save,
  Eye,
  CheckCircle,
  Loader2,
  PenLine,
  Undo2,
  Redo2,
  Columns,
  Layout,
  Settings,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TYPE_COLORS: Record<string, string> = {
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

// ─── Inner editor (uses useSearchParams, must be inside Suspense) ─────────────

function FormEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { doctor, isAuthenticated, isLoading: authLoading } = useAuth();

  const formId = searchParams.get("id");

  // ── Backend data ──────────────────────────────────────────────────
  const { form: backendForm, loading: loadingForm } = useGetStandaloneForm(formId, { skip: authLoading || !isAuthenticated });
  const { updateForm, loading: saving, error: saveError } = useUpdateStandaloneForm();

  // ── Local editor state ────────────────────────────────────────────
  const [blocks, setBlocksRaw] = useState<FormBlock[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState<Record<string, any>>({});
  const [editingName, setEditingName] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "split" | "preview">("edit");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // ── History (undo / redo) ─────────────────────────────────────────
  const [past, setPast] = useState<FormBlock[][]>([]);
  const [future, setFuture] = useState<FormBlock[][]>([]);
  const pendingSnapshotRef = useRef<FormBlock[] | null>(null);
  const histTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const setBlocks = useCallback(
    (newBlocks: FormBlock[]) => {
      if (pendingSnapshotRef.current === null) {
        pendingSnapshotRef.current = blocks;
      }
      setFuture([]);
      setBlocksRaw(newBlocks);

      if (histTimerRef.current) clearTimeout(histTimerRef.current);
      histTimerRef.current = setTimeout(() => {
        if (pendingSnapshotRef.current !== null) {
          setPast((prev) => [...prev.slice(-49), pendingSnapshotRef.current!]);
          pendingSnapshotRef.current = null;
        }
      }, 600);
    },
    [blocks],
  );

  const undo = useCallback(() => {
    if (!canUndo) return;
    if (histTimerRef.current) {
      clearTimeout(histTimerRef.current);
      histTimerRef.current = null;
    }
    pendingSnapshotRef.current = null;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [blocks, ...f.slice(0, 49)]);
    setBlocksRaw(prev);
  }, [past, blocks, canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    if (histTimerRef.current) {
      clearTimeout(histTimerRef.current);
      histTimerRef.current = null;
    }
    pendingSnapshotRef.current = null;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p.slice(-49), blocks]);
    setBlocksRaw(next);
  }, [future, blocks, canRedo]);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Populate local state once backend form loads
  useEffect(() => {
    if (!backendForm || initialized) return;
    setName(backendForm.name);
    setDescription(backendForm.description ?? "");
    setTheme((backendForm.activeVersion?.theme as Record<string, any>) ?? {});
    setBlocksRaw((backendForm.activeVersion?.blocks as FormBlock[]) ?? []);
    setPast([]);
    setFuture([]);
    setInitialized(true);
  }, [backendForm, initialized]);

  // Redirect if no id
  useEffect(() => {
    if (!formId) router.replace("/admin/formbuilder");
  }, [formId, router]);

  // Redirect if form not found after loading (wait for auth to resolve first)
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    if (!loadingForm && initialized === false && !backendForm && formId) {
      router.replace("/admin/formbuilder");
    }
  }, [authLoading, isAuthenticated, loadingForm, backendForm, initialized, formId, router]);

  // Auto-save (debounced 1.5s)
  useEffect(() => {
    if (!initialized || !backendForm) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    autoSaveTimer.current = setTimeout(async () => {
      try {
        await updateForm(backendForm.id, {
          name,
          description,
          type: backendForm.type,
          category: backendForm.category,
          isTemplate: backendForm.isTemplate,
          blocks,
          theme,
        });
        setSavedAt(new Date());
      } catch {
        // silent — user can manually save
      }
    }, 1500);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [blocks, name]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleManualSave = useCallback(async () => {
    if (!backendForm) return;
    try {
      await updateForm(backendForm.id, {
        name,
        description,
        type: backendForm.type,
        category: backendForm.category,
        isTemplate: backendForm.isTemplate,
        blocks,
        theme,
      });
      setSavedAt(new Date());
    } catch {
      // error shown via saveError
    }
  }, [backendForm, name, description, blocks, theme, updateForm]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.metaKey || e.ctrlKey;
      if (!ctrl) return;

      if (e.key === "s") {
        e.preventDefault();
        handleManualSave();
        return;
      }

      const inTextField =
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLInputElement;

      if (!inTextField) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
          return;
        }
        if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault();
          redo();
          return;
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleManualSave, undo, redo]);

  if (loadingForm || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!backendForm) return null;

  const preset = TEMPLATE_PRESETS.find((p) => p.type === backendForm.type);

  // Build a SavedForm-compatible object for the preview renderer
  const previewForm: SavedForm = {
    id: backendForm.id,
    name,
    type: backendForm.type as any,
    blocks,
    version: backendForm.activeVersion?.majorVersion ?? 1,
    description,
    theme,
    createdAt: backendForm.createdAt,
    updatedAt: backendForm.updatedAt,
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-background shrink-0 z-10">
        {/* Back */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => {
            handleManualSave();
            router.push("/admin/formbuilder");
          }}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {/* Form name (inline editable) */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {editingName ? (
            <Input
              ref={nameInputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") {
                  setEditingName(false);
                }
              }}
              className="h-8 text-sm font-semibold max-w-xs"
              autoFocus
            />
          ) : (
            <button
              className="flex items-center gap-1.5 group"
              onClick={() => setEditingName(true)}
            >
              <span className="text-sm font-semibold text-foreground truncate max-w-[240px]">
                {name || "Untitled Form"}
              </span>
              <PenLine className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}

          {preset && (
            <Badge
              className={`text-[10px] px-1.5 py-0 shrink-0 ${TYPE_COLORS[backendForm.type] ?? ""}`}
            >
              {preset.emoji} {preset.label}
            </Badge>
          )}
        </div>

        {/* Block count */}
        <span className="text-xs text-muted-foreground shrink-0 hidden md:block">
          {blocks.length} block{blocks.length !== 1 ? "s" : ""}
        </span>

        {/* Save status */}
        <div className="shrink-0 hidden lg:flex items-center gap-1.5 text-[10px] text-muted-foreground min-w-[80px]">
          {saving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> Saving…
            </>
          ) : saveError ? (
            <>
              <AlertCircle className="h-3 w-3 text-destructive" />
              <span className="text-destructive">Error</span>
            </>
          ) : savedAt ? (
            <>
              <CheckCircle className="h-3 w-3 text-emerald-500" /> Saved
            </>
          ) : (
            <span className="opacity-50 uppercase tracking-tighter">Auto-save</span>
          )}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-muted/50 p-0.5 rounded-lg border border-border/50 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "h-7 px-2 text-[10px] gap-1.5 uppercase tracking-wider font-bold",
              viewMode === "edit" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setViewMode("edit")}
          >
            <Layout className="h-3 w-3" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "h-7 px-2 text-[10px] gap-1.5 uppercase tracking-wider font-bold",
              viewMode === "split" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setViewMode("split")}
          >
            <Columns className="h-3 w-3" />
            Split
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "h-7 px-2 text-[10px] gap-1.5 uppercase tracking-wider font-bold",
              viewMode === "preview" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setViewMode("preview")}
          >
            <Eye className="h-3 w-3" />
            Preview
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={undo}
            disabled={!canUndo}
            title={`Undo${canUndo ? ` (${past.length} step${past.length !== 1 ? "s" : ""})` : ""} — Ctrl+Z`}
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 mr-1"
            onClick={redo}
            disabled={!canRedo}
            title={`Redo${canRedo ? ` (${future.length} step${future.length !== 1 ? "s" : ""})` : ""} — Ctrl+Shift+Z`}
          >
            <Redo2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 bg-[#FF6900] hover:bg-[#e05f00] text-white"
            onClick={handleManualSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {(viewMode === "edit" || viewMode === "split") && (
          <div className={cn("flex-1 min-w-0 flex flex-col", viewMode === "split" && "border-r border-border")}>
            <BlockCanvas blocks={blocks} onChange={setBlocks} />
          </div>
        )}

        {(viewMode === "preview" || viewMode === "split") && (
          <div className="flex-1 min-w-0 overflow-y-auto bg-muted/10">
            <div className="max-w-2xl mx-auto px-8 py-12">
              <div className="bg-background shadow-sm border rounded-2xl p-8 min-h-[80vh]">
                <FormRenderer
                  form={previewForm}
                  showTitle={true}
                  edit={true}
                  onSubmit={(ans) => console.log("Preview submit", ans)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Preview sheet ── */}
      <PreviewSheet
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        form={previewForm}
      />

      {/* ── Settings Dialog ── */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Form Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Optional description for the form…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-20 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme?.primaryColor ?? "#FF6900"}
                  onChange={(e) =>
                    setTheme((t) => ({ ...t, primaryColor: e.target.value }))
                  }
                  className="h-10 w-10 rounded cursor-pointer border-none bg-transparent"
                />
                <Input
                  value={theme?.primaryColor ?? "#FF6900"}
                  onChange={(e) =>
                    setTheme((t) => ({ ...t, primaryColor: e.target.value }))
                  }
                  className="h-9 font-mono uppercase text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Logo Placement</Label>
              <Select
                value={theme?.logoPlacement ?? "left"}
                onValueChange={(val: any) =>
                  setTheme((t) => ({ ...t, logoPlacement: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setSettingsOpen(false);
                handleManualSave();
              }}
            >
              Apply & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function FormBuilderEditPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <FormEditor />
    </Suspense>
  );
}
