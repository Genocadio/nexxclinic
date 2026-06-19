"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  fbGetForm,
  fbSaveForm,
  type FormBlock,
  type SavedForm,
} from "@/lib/formbuilder-storage";
import { TEMPLATE_PRESETS } from "@/lib/formbuilder-presets";
import { BlockCanvas } from "@/components/formbuilder/block-canvas";
import { PreviewSheet } from "@/components/formbuilder/preview-sheet";
import {
  ArrowLeft,
  Save,
  Eye,
  CheckCircle,
  Loader2,
  PenLine,
  Undo2,
  Redo2,
} from "lucide-react";

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
  const { doctor } = useAuth();

  const formId = searchParams.get("id");

  const [form, setForm] = useState<SavedForm | null>(null);
  // Blocks raw state — updated by both direct edits and undo/redo
  const [blocks, setBlocksRaw] = useState<FormBlock[]>([]);
  const [name, setName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ── History (undo / redo) ────────────────────────────────────────
  // `past`   = stack of states we can undo to (oldest first)
  // `future` = stack of states we can redo to (next-to-restore first)
  const [past, setPast] = useState<FormBlock[][]>([]);
  const [future, setFuture] = useState<FormBlock[][]>([]);

  // Reference to the "before" snapshot for the current editing sequence.
  // Cleared when the debounce fires and the snapshot is committed to `past`.
  const pendingSnapshotRef = useRef<FormBlock[] | null>(null);
  const histTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  // Blocks setter used by BlockCanvas — records history with 600ms debounce
  // so rapid typing produces a single undo step rather than one per character.
  const setBlocks = useCallback(
    (newBlocks: FormBlock[]) => {
      // First change in a sequence: capture the state *before* this change
      if (pendingSnapshotRef.current === null) {
        pendingSnapshotRef.current = blocks;
      }
      // Any new edit invalidates the redo stack
      setFuture([]);
      setBlocksRaw(newBlocks);

      // Debounce: only push to `past` after 600ms of no further edits
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
    // Cancel any pending debounced snapshot — the undo itself is the checkpoint
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

  // Load form on mount
  useEffect(() => {
    setMounted(true);
    if (!formId) {
      router.replace("/admin/formbuilder");
      return;
    }
    const loaded = fbGetForm(formId);
    if (!loaded) {
      router.replace("/admin/formbuilder");
      return;
    }
    setForm(loaded);
    setBlocksRaw(loaded.blocks);
    setName(loaded.name);
    // Don't treat initial load as an undoable action
    setPast([]);
    setFuture([]);
  }, [formId, router]);

  // Auto-save whenever blocks or name changes (debounced 1.5s)
  useEffect(() => {
    if (!form || !mounted) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    autoSaveTimer.current = setTimeout(() => {
      const updated = fbSaveForm({ ...form, name, blocks });
      setForm(updated);
      setSavedAt(new Date());
    }, 1500);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [blocks, name]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleManualSave = useCallback(() => {
    if (!form) return;
    setSaving(true);
    const updated = fbSaveForm({ ...form, name, blocks });
    setForm(updated);
    setSavedAt(new Date());
    setTimeout(() => setSaving(false), 500);
  }, [form, name, blocks]);

  // Keyboard shortcuts: Cmd/Ctrl+S, Ctrl+Z, Ctrl+Shift+Z / Ctrl+Y
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.metaKey || e.ctrlKey;
      if (!ctrl) return;

      // Save: always intercept
      if (e.key === "s") {
        e.preventDefault();
        handleManualSave();
        return;
      }

      // Undo / Redo: only when focus is NOT in a text field so that
      // native textarea undo still works when the user is typing.
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

  if (!mounted || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const preset = TEMPLATE_PRESETS.find((p) => p.type === form.type);

  // The form object for preview includes latest blocks and name
  const previewForm: SavedForm = { ...form, name, blocks };

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

          {/* Type badge */}
          {preset && (
            <Badge
              className={`text-[10px] px-1.5 py-0 shrink-0 ${TYPE_COLORS[form.type] ?? ""}`}
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
        <div className="shrink-0 hidden md:flex items-center gap-1.5 text-xs text-muted-foreground min-w-[100px]">
          {saving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> Saving…
            </>
          ) : savedAt ? (
            <>
              <CheckCircle className="h-3 w-3 text-emerald-500" /> Saved{" "}
              {savedAt.toLocaleTimeString()}
            </>
          ) : (
            <span className="opacity-50">Auto-save on</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Undo / Redo */}
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
            className="h-8 gap-1.5 bg-[#FF6900] hover:bg-[#e05f00] text-white"
            onClick={handleManualSave}
          >
            <Save className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>

      {/* ── Canvas (fills remaining height) ── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <BlockCanvas blocks={blocks} onChange={setBlocks} />
      </div>

      {/* ── Preview sheet ── */}
      <PreviewSheet
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        form={previewForm}
      />
    </div>
  );
}

// ─── Page export (wraps in Suspense for useSearchParams) ─────────────────────

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
