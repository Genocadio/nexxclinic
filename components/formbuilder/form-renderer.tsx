"use client";

/**
 * FormRenderer — reusable answer-mode form component.
 *
 * Props:
 *   form        — the SavedForm to render (blocks + metadata)
 *   showTitle   — show the form name/title at the top
 *   validate    — when true, required-field violations are highlighted on submit attempt
 *   onSubmit    — called with the collected FormAnswers when the user submits
 *   onChange    — called with live FormAnswers on every keystroke / interaction
 *   submitLabel — label for the submit button (default: "Submit")
 *   hideSubmit  — hide the submit button entirely (useful for embedding)
 *
 * Answer shape (FormAnswers):
 *   Record<blockId, value>
 *   - simple inputs → string
 *   - checkbox_single → boolean
 *   - checkbox_group → string[]
 *   - diagnostic_record → { items: DiagEntry[] }
 *   - medication_full → { items: MedFullEntry[] }
 *   - medication_mini → { items: MedMiniEntry[] }
 *   - lab_record → { rows: Record<rowId, { value?: string; unit?: string; result?: string }> }
 *   - product_listener → { items: AddedProduct[] }
 *   - paragraph inline fields → stored as blockId__fieldId → string
 *   - table inline fields → stored as blockId__ri__ci__fieldId → string
 *   - signature → string (data URL from canvas, or "" if empty)
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Stethoscope, Pill, FlaskConical } from "lucide-react";
import type {
  FormBlock,
  InlineAnswerField,
  LabRow,
  LayoutColumn,
  SavedForm,
  TableCell,
} from "@/lib/formbuilder-storage";
import { shouldShowBlock } from "@/lib/formbuilder-conditional";

// ─── Public types ─────────────────────────────────────────────────────────────

export type FormAnswers = Record<string, unknown>;

export interface FormRendererProps {
  form: SavedForm | null;
  showTitle?: boolean;
  validate?: boolean;
  onSubmit?: (answers: FormAnswers) => void;
  onChange?: (answers: FormAnswers) => void;
  submitLabel?: string;
  hideSubmit?: boolean;
  className?: string;
}

// ─── Internal answer-field entry types ───────────────────────────────────────

interface DiagEntry {
  id: string;
  diagnosis: string;
  description?: string;
}
interface MedFullEntry {
  id: string;
  name: string;
  frequency: string;
  amount: string;
  days: string;
  notes?: string;
}
interface MedMiniEntry {
  id: string;
  name: string;
  notes?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const INLINE_WIDTH: Record<string, string> = {
  xs: "w-14",
  sm: "w-24",
  md: "w-40",
  lg: "w-56",
  full: "w-full",
};

function uid() {
  return `_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// ─── Signature canvas block ───────────────────────────────────────────────────

function SignatureCanvas({
  value,
  onChange,
  isError,
}: {
  value: string;
  onChange: (v: string) => void;
  isError?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // If an external value exists, paint it on mount
  useEffect(() => {
    if (!value || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = value;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    drawing.current = true;
    lastPos.current = getPos(e, canvasRef.current);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current || !canvasRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvasRef.current);
    ctx.beginPath();
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => {
    if (!drawing.current || !canvasRef.current) return;
    drawing.current = false;
    onChange(canvasRef.current.toDataURL());
  };

  const clear = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onChange("");
  };

  return (
    <div className="space-y-1">
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        className={`w-full border-b-2 border-dashed rounded cursor-crosshair touch-none ${
          isError
            ? "border-red-400 bg-red-50/30 dark:bg-red-950/20"
            : "border-slate-400 dark:border-slate-600 bg-slate-50/40 dark:bg-slate-800/20"
        }`}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground/50">Sign above</span>
        {value && (
          <button
            type="button"
            onClick={clear}
            className="text-[10px] text-muted-foreground hover:text-destructive"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Inline answer field (inside paragraph text / table cells) ────────────────

function AnswerInlineField({
  field,
  value,
  onChange,
  isError,
}: {
  field: InlineAnswerField;
  value: string;
  onChange: (v: string) => void;
  isError?: boolean;
}) {
  const w = INLINE_WIDTH[field.width ?? "sm"];
  const errorClass = isError
    ? "border-red-400 ring-1 ring-red-400/50 bg-red-50/30 dark:bg-red-950/20"
    : "border-teal-300 dark:border-teal-600 bg-teal-50/50 dark:bg-teal-900/20";
  const base = `${w} h-7 px-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-teal-400 ${errorClass}`;

  if (field.fieldType === "number")
    return (
      <input
        type="number"
        placeholder={field.placeholder || ""}
        className={`${base} inline-block`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  if (field.fieldType === "date")
    return (
      <input
        type="date"
        className={`${base} inline-block`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  if (field.fieldType === "select")
    return (
      <select
        className={`${base} inline-block`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select…</option>
        {(field.options ?? []).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  if (field.fieldType === "textarea")
    return (
      <textarea
        placeholder={field.placeholder || ""}
        rows={2}
        className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none mt-1 ${errorClass}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  return (
    <input
      type="text"
      placeholder={field.placeholder || ""}
      className={`${base} inline-block`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// ─── Diagnostic record block (answer mode) ────────────────────────────────────

function DiagnosticAnswerBlock({
  block,
  value,
  onChange,
  isError,
}: {
  block: FormBlock;
  value: DiagEntry[];
  onChange: (v: DiagEntry[]) => void;
  isError?: boolean;
}) {
  const [draftDiag, setDraftDiag] = useState("");
  const [draftDesc, setDraftDesc] = useState("");

  const add = () => {
    const name = draftDiag.trim();
    if (!name) return;
    onChange([
      ...value,
      {
        id: `d${uid()}`,
        diagnosis: name,
        description: draftDesc.trim() || undefined,
      },
    ]);
    setDraftDiag("");
    setDraftDesc("");
  };

  const remove = (id: string) => onChange(value.filter((e) => e.id !== id));

  return (
    <div className="my-3">
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
        <Stethoscope className="h-3.5 w-3.5 text-emerald-600" />
        {block.label || "Diagnoses"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`space-y-2 p-3 rounded-lg border ${
          isError
            ? "border-red-400 bg-red-50/20 dark:bg-red-950/10"
            : "border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10"
        }`}
      >
        <Input
          value={draftDiag}
          onChange={(e) => setDraftDiag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={block.placeholder || "Enter diagnosis name…"}
          className="h-8 text-sm"
        />
        <Textarea
          value={draftDesc}
          onChange={(e) => setDraftDesc(e.target.value)}
          placeholder="Notes / description (optional)"
          className="text-sm min-h-[52px] resize-none"
          rows={2}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={add}
            disabled={!draftDiag.trim()}
            className="h-7 rounded-full gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-3 w-3" /> Add Diagnosis
          </Button>
        </div>
        {value.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-emerald-200 dark:border-emerald-800">
            {value.map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-2 px-2.5 py-1.5 rounded-md border border-border bg-background text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium leading-snug break-words">
                    {e.diagnosis}
                  </p>
                  {e.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {e.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(e.id)}
                  className="mt-0.5 p-0.5 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Medication Full block (answer mode) ──────────────────────────────────────

function MedFullAnswerBlock({
  block,
  value,
  onChange,
  isError,
}: {
  block: FormBlock;
  value: MedFullEntry[];
  onChange: (v: MedFullEntry[]) => void;
  isError?: boolean;
}) {
  const [draft, setDraft] = useState({
    name: "",
    frequency: "",
    amount: "",
    days: "",
    notes: "",
  });
  const upd =
    (k: keyof typeof draft) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft((d) => ({ ...d, [k]: e.target.value }));

  const canAdd =
    draft.name.trim() &&
    draft.frequency.trim() &&
    draft.amount.trim() &&
    draft.days.trim();

  const add = () => {
    if (!canAdd) return;
    onChange([
      ...value,
      { id: `mf${uid()}`, ...draft, notes: draft.notes.trim() || undefined },
    ]);
    setDraft({ name: "", frequency: "", amount: "", days: "", notes: "" });
  };

  const remove = (id: string) => onChange(value.filter((e) => e.id !== id));

  return (
    <div className="my-3">
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
        <Pill className="h-3.5 w-3.5 text-blue-600" />
        {block.label || "Medications"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`space-y-2 p-3 rounded-lg border ${
          isError
            ? "border-red-400 bg-red-50/20 dark:bg-red-950/10"
            : "border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10"
        }`}
      >
        <Input
          value={draft.name}
          onChange={upd("name")}
          placeholder={block.placeholder || "Medication name…"}
          className="h-8 text-sm"
        />
        <div className="grid grid-cols-3 gap-2">
          <Input
            value={draft.frequency}
            onChange={upd("frequency")}
            placeholder="Frequency"
            className="h-8 text-sm"
          />
          <Input
            value={draft.amount}
            onChange={upd("amount")}
            placeholder="Amount"
            className="h-8 text-sm"
          />
          <Input
            value={draft.days}
            onChange={upd("days")}
            placeholder="Days"
            className="h-8 text-sm"
          />
        </div>
        <Textarea
          value={draft.notes}
          onChange={upd("notes")}
          placeholder="Extra notes (optional)"
          className="text-sm min-h-[48px] resize-none"
          rows={2}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={add}
            disabled={!canAdd}
            className="h-7 rounded-full gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-3 w-3" /> Add Medication
          </Button>
        </div>
        {value.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-blue-200 dark:border-blue-800">
            {value.map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-2 px-2.5 py-1.5 rounded-md border border-border bg-background text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium break-words">{e.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Frequency: {e.frequency} · Amount: {e.amount} · Days:{" "}
                    {e.days}
                  </p>
                  {e.notes && (
                    <p className="text-xs text-muted-foreground">{e.notes}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(e.id)}
                  className="mt-0.5 p-0.5 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Medication Mini block (answer mode) ──────────────────────────────────────

function MedMiniAnswerBlock({
  block,
  value,
  onChange,
  isError,
}: {
  block: FormBlock;
  value: MedMiniEntry[];
  onChange: (v: MedMiniEntry[]) => void;
  isError?: boolean;
}) {
  const [draftName, setDraftName] = useState("");
  const [draftNotes, setDraftNotes] = useState("");

  const add = () => {
    if (!draftName.trim()) return;
    onChange([
      ...value,
      {
        id: `mm${uid()}`,
        name: draftName.trim(),
        notes: draftNotes.trim() || undefined,
      },
    ]);
    setDraftName("");
    setDraftNotes("");
  };

  const remove = (id: string) => onChange(value.filter((e) => e.id !== id));

  return (
    <div className="my-3">
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
        <Pill className="h-3.5 w-3.5 text-indigo-600" />
        {block.label || "Medications"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`space-y-2 p-3 rounded-lg border ${
          isError
            ? "border-red-400 bg-red-50/20 dark:bg-red-950/10"
            : "border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/10"
        }`}
      >
        <Input
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={block.placeholder || "Medication name…"}
          className="h-8 text-sm"
        />
        <Textarea
          value={draftNotes}
          onChange={(e) => setDraftNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="text-sm min-h-[48px] resize-none"
          rows={2}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={add}
            disabled={!draftName.trim()}
            className="h-7 rounded-full gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="h-3 w-3" /> Add Medication
          </Button>
        </div>
        {value.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-indigo-200 dark:border-indigo-800">
            {value.map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-2 px-2.5 py-1.5 rounded-md border border-border bg-background text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium break-words">{e.name}</p>
                  {e.notes && (
                    <p className="text-xs text-muted-foreground">{e.notes}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(e.id)}
                  className="mt-0.5 p-0.5 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Lab record block (answer mode) ──────────────────────────────────────────

type LabRowValues = Record<
  string,
  { value?: string; unit?: string; result?: string }
>;

function LabAnswerBlock({
  block,
  value,
  onChange,
  isError,
}: {
  block: FormBlock;
  value: LabRowValues;
  onChange: (v: LabRowValues) => void;
  isError?: boolean;
}) {
  const layout = block.labLayout ?? "valueUnit";
  const rows: LabRow[] = block.labRows?.length
    ? block.labRows
    : [
        {
          id: "r1",
          name: "Result 1",
          unitMode: "dropdown",
          unitOptions: ["mg/dL", "mmol/L"],
          defaultUnit: "mg/dL",
          resultOptions: ["+ve", "-ve"],
        },
        {
          id: "r2",
          name: "Result 2",
          unitMode: "dropdown",
          unitOptions: ["mg/dL", "mmol/L"],
          defaultUnit: "mg/dL",
          resultOptions: ["+ve", "-ve"],
        },
        {
          id: "r3",
          name: "Result 3",
          unitMode: "dropdown",
          unitOptions: ["mg/dL", "mmol/L"],
          defaultUnit: "mg/dL",
          resultOptions: ["+ve", "-ve"],
        },
      ];

  const set = (rowId: string, key: "value" | "unit" | "result", val: string) =>
    onChange({ ...value, [rowId]: { ...value[rowId], [key]: val } });

  return (
    <div className="my-3">
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
        <FlaskConical className="h-3.5 w-3.5 text-purple-600" />
        {block.label || "Lab Results"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`overflow-x-auto border rounded-lg ${
          isError
            ? "border-red-400 bg-red-50/20 dark:bg-red-950/10"
            : "border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/10"
        }`}
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border bg-muted/40 px-3 py-1.5 text-left text-xs font-semibold">
                Name
              </th>
              {layout === "valueUnit" ? (
                <>
                  <th className="border-b border-border bg-muted/40 px-3 py-1.5 text-left text-xs font-semibold">
                    Value
                  </th>
                  <th className="border-b border-border bg-muted/40 px-3 py-1.5 text-left text-xs font-semibold">
                    Unit
                  </th>
                </>
              ) : (
                <th className="border-b border-border bg-muted/40 px-3 py-1.5 text-left text-xs font-semibold">
                  Result
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rv = value[row.id] ?? {};
              const units = row.unitOptions.length
                ? row.unitOptions
                : ["mg/dL", "mmol/L"];
              const results = row.resultOptions.length
                ? row.resultOptions
                : ["+ve", "-ve"];
              return (
                <tr key={row.id}>
                  <td className="border-b border-border/50 px-3 py-2 font-medium text-sm whitespace-nowrap">
                    {row.name}
                  </td>
                  {layout === "valueUnit" ? (
                    <>
                      <td className="border-b border-border/50 px-1 py-1 min-w-[80px]">
                        <input
                          className="w-full h-7 px-2 text-xs border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
                          value={rv.value ?? ""}
                          onChange={(e) => set(row.id, "value", e.target.value)}
                          placeholder="Value"
                        />
                      </td>
                      <td className="border-b border-border/50 px-1 py-1 min-w-[90px]">
                        <select
                          className="w-full h-7 px-1 text-xs border rounded bg-background focus:outline-none"
                          value={rv.unit ?? row.defaultUnit ?? units[0]}
                          onChange={(e) => set(row.id, "unit", e.target.value)}
                        >
                          {units.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </td>
                    </>
                  ) : (
                    <td className="border-b border-border/50 px-1 py-1 min-w-[100px]">
                      <select
                        className="w-full h-7 px-1 text-xs border rounded bg-background focus:outline-none"
                        value={rv.result ?? ""}
                        onChange={(e) => set(row.id, "result", e.target.value)}
                      >
                        <option value="">Select…</option>
                        {results.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Validate a single block ──────────────────────────────────────────────────

/**
 * Returns true when the block has a required violation given the current answers.
 * Only called when `validate` prop is true and the user has attempted to submit.
 */
function isBlockViolating(block: FormBlock, answers: FormAnswers): boolean {
  if (!block.required) return false;
  const v = answers[block.id];
  switch (block.type) {
    case "text_input":
    case "textarea_input":
    case "number_input":
    case "date_input":
      return !v || String(v).trim() === "";
    case "checkbox_single":
      return !v;
    case "checkbox_group":
    case "radio_group":
      return !Array.isArray(v) ? !v : (v as string[]).length === 0;
    case "select_input":
      return !v || String(v) === "";
    case "signature":
      return !v || String(v) === "";
    case "diagnostic_record":
    case "medication_full":
    case "medication_mini":
      // stored as a plain array of entries
      return !Array.isArray(v) || (v as unknown[]).length === 0;
    case "lab_record": {
      // required = at least one row filled
      const typed = v as LabRowValues | undefined;
      if (!typed) return true;
      return !Object.values(typed).some((rv) => rv.value || rv.result);
    }
    default:
      return false;
  }
}

// ─── Single block renderer (answer mode) ─────────────────────────────────────

interface AnswerBlockProps {
  block: FormBlock;
  answers: FormAnswers;
  onAnswerChange: (blockId: string, value: unknown) => void;
  showErrors: boolean;
  /** Flat key-value store for inline paragraph / table fields: "blockId__fieldId" → string */
  inlineAnswers: Record<string, string>;
  onInlineChange: (key: string, value: string) => void;
}

function AnswerBlock({
  block,
  answers,
  onAnswerChange,
  showErrors,
  inlineAnswers,
  onInlineChange,
}: AnswerBlockProps) {
  // Conditional rendering
  if (!shouldShowBlock(block, answers)) return null;

  const val = answers[block.id];
  const isError = showErrors && isBlockViolating(block, answers);

  const alignClass =
    block.align === "center"
      ? "text-center"
      : block.align === "right"
        ? "text-right"
        : "text-left";
  const styleClass = [
    block.bold ? "font-bold" : "",
    block.italic ? "italic" : "",
    block.underline ? "underline" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inputBase = `w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background transition-colors ${
    isError
      ? "border-red-400 ring-1 ring-red-400/40 bg-red-50/20 dark:bg-red-950/10"
      : "border-input"
  }`;

  switch (block.type) {
    // ── Static display ────────────────────────────────────────────────────────
    case "heading1":
      return (
        <h1
          className={`text-3xl font-bold leading-tight my-4 ${alignClass} ${styleClass}`}
        >
          {block.content}
        </h1>
      );
    case "heading2":
      return (
        <h2
          className={`text-xl font-semibold leading-snug mt-6 mb-2 ${alignClass} ${styleClass}`}
        >
          {block.content}
        </h2>
      );
    case "heading3":
      return (
        <h3
          className={`text-base font-semibold leading-snug mt-4 mb-1.5 ${alignClass} ${styleClass}`}
        >
          {block.content}
        </h3>
      );
    case "divider":
      return <hr className="border-t-2 border-border my-4" />;
    case "spacer":
      return <div style={{ height: block.height ?? 32 }} />;

    // ── Paragraph (may contain inline fields) ─────────────────────────────────
    case "paragraph": {
      const hasInline = (block.content ?? "").includes("[[");
      if (!hasInline) {
        return (
          <p
            className={`text-sm leading-relaxed my-1.5 ${alignClass} ${styleClass}`}
          >
            {block.content || ""}
          </p>
        );
      }
      const parts = (block.content ?? "").split(/(\[\[[^\]]+\]\])/g);
      return (
        <div
          className={`text-sm leading-relaxed my-1.5 ${alignClass} ${styleClass} flex flex-wrap items-baseline gap-x-0.5`}
        >
          {parts
            .filter((p) => p.length > 0)
            .map((part, idx) => {
              const fi = part.match(/^\[\[([^\]]+)\]\]$/);
              if (fi) {
                const field = (block.inlineFields ?? []).find(
                  (f) => f.id === fi[1],
                );
                if (!field)
                  return (
                    <span
                      key={idx}
                      className="inline-block w-16 h-6 border-b border-dashed border-border mx-0.5"
                    />
                  );
                const key = `${block.id}__${field.id}`;
                const fError =
                  showErrors && field.required && !inlineAnswers[key];
                return (
                  <AnswerInlineField
                    key={idx}
                    field={field}
                    value={inlineAnswers[key] ?? ""}
                    onChange={(v) => onInlineChange(key, v)}
                    isError={fError}
                  />
                );
              }
              return <span key={idx}>{part}</span>;
            })}
        </div>
      );
    }

    // ── Text input ────────────────────────────────────────────────────────────
    case "text_input":
      return (
        <div className="my-3">
          <label className="text-sm font-medium block mb-1">
            {block.label}
            {block.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            className={inputBase}
            placeholder={block.placeholder || ""}
            value={(val as string) ?? ""}
            onChange={(e) => onAnswerChange(block.id, e.target.value)}
          />
          {isError && (
            <p className="text-xs text-red-500 mt-1">This field is required.</p>
          )}
        </div>
      );

    case "textarea_input":
      return (
        <div className="my-3">
          <label className="text-sm font-medium block mb-1">
            {block.label}
            {block.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            rows={4}
            className={`${inputBase} resize-y min-h-[4.5rem]`}
            placeholder={block.placeholder || ""}
            value={(val as string) ?? ""}
            onChange={(e) => onAnswerChange(block.id, e.target.value)}
          />
          {isError && (
            <p className="text-xs text-red-500 mt-1">This field is required.</p>
          )}
        </div>
      );

    case "number_input":
      return (
        <div className="my-3">
          <label className="text-sm font-medium block mb-1">
            {block.label}
            {block.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="number"
            className={`${inputBase} w-36`}
            placeholder={block.placeholder || "0"}
            value={(val as string) ?? ""}
            onChange={(e) => onAnswerChange(block.id, e.target.value)}
          />
          {isError && (
            <p className="text-xs text-red-500 mt-1">This field is required.</p>
          )}
        </div>
      );

    case "date_input":
      return (
        <div className="my-3">
          <label className="text-sm font-medium block mb-1">
            {block.label}
            {block.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="date"
            className={`${inputBase} w-44`}
            value={(val as string) ?? ""}
            onChange={(e) => onAnswerChange(block.id, e.target.value)}
          />
          {isError && (
            <p className="text-xs text-red-500 mt-1">This field is required.</p>
          )}
        </div>
      );

    case "checkbox_single":
      return (
        <div
          className={`my-2 flex items-start gap-2.5 ${isError ? "rounded-md p-1 -m-1 ring-1 ring-red-400/50 bg-red-50/20 dark:bg-red-950/10" : ""}`}
        >
          <input
            type="checkbox"
            id={`chk_${block.id}`}
            checked={Boolean(val)}
            onChange={(e) => onAnswerChange(block.id, e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-2 border-border accent-primary"
          />
          <label htmlFor={`chk_${block.id}`} className="text-sm cursor-pointer">
            {block.label}
            {block.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      );

    case "checkbox_group": {
      const selected: string[] = Array.isArray(val) ? (val as string[]) : [];
      const toggle = (opt: string) => {
        const next = selected.includes(opt)
          ? selected.filter((o) => o !== opt)
          : [...selected, opt];
        onAnswerChange(block.id, next);
      };
      return (
        <div className="my-3">
          <label className="text-sm font-medium block mb-1.5">
            {block.label}
            {block.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div
            className={`space-y-1.5 ${isError ? "rounded-md p-2 -m-2 ring-1 ring-red-400/50 bg-red-50/20 dark:bg-red-950/10" : ""}`}
          >
            {(block.options ?? []).map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggle(opt)}
                  className="h-4 w-4 rounded border-2 border-border accent-primary"
                />
                {opt}
              </label>
            ))}
          </div>
          {isError && (
            <p className="text-xs text-red-500 mt-1">
              Please select at least one option.
            </p>
          )}
        </div>
      );
    }

    case "radio_group": {
      const selected = (val as string) ?? "";
      return (
        <div className="my-3">
          <label className="text-sm font-medium block mb-1.5">
            {block.label}
            {block.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div
            className={`space-y-1.5 ${isError ? "rounded-md p-2 -m-2 ring-1 ring-red-400/50 bg-red-50/20 dark:bg-red-950/10" : ""}`}
          >
            {(block.options ?? []).map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="radio"
                  name={`radio_${block.id}`}
                  checked={selected === opt}
                  onChange={() => onAnswerChange(block.id, opt)}
                  className="h-4 w-4 border-2 border-border accent-primary"
                />
                {opt}
              </label>
            ))}
          </div>
          {isError && (
            <p className="text-xs text-red-500 mt-1">
              Please select an option.
            </p>
          )}
        </div>
      );
    }

    case "select_input": {
      const selected = (val as string) ?? "";
      return (
        <div className="my-3">
          <label className="text-sm font-medium block mb-1">
            {block.label}
            {block.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            className={`${inputBase} max-w-xs`}
            value={selected}
            onChange={(e) => onAnswerChange(block.id, e.target.value)}
          >
            <option value="">Select an option…</option>
            {(block.options ?? []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {isError && (
            <p className="text-xs text-red-500 mt-1">
              Please select an option.
            </p>
          )}
        </div>
      );
    }

    case "signature":
      return (
        <div className="my-6">
          <p className="text-sm font-medium mb-2">
            {block.label ?? "Signature"}
            {block.required && <span className="text-red-500 ml-1">*</span>}
          </p>
          <div className="max-w-xs">
            <SignatureCanvas
              value={(val as string) ?? ""}
              onChange={(v) => onAnswerChange(block.id, v)}
              isError={isError}
            />
          </div>
          {isError && (
            <p className="text-xs text-red-500 mt-1">Signature is required.</p>
          )}
        </div>
      );

    // ── Table ─────────────────────────────────────────────────────────────────
    case "table": {
      const rows = Math.max(1, block.tableRows ?? 3);
      const cols = Math.max(1, block.tableCols ?? 3);
      const getCell = (ri: number, ci: number): TableCell =>
        block.tableCells?.[ri]?.[ci] ?? {};

      return (
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {Array.from({ length: rows }).map((_, ri) => (
                <tr key={ri}>
                  {Array.from({ length: cols }).map((_, ci) => {
                    const cell = getCell(ri, ci);
                    const hasAnswer =
                      (cell.content ?? "").includes("[[") &&
                      (cell.inlineFields ?? []).length > 0;

                    const cAlign =
                      cell.align === "center"
                        ? "text-center"
                        : cell.align === "right"
                          ? "text-right"
                          : "text-left";
                    const cStyle = [
                      cell.bold ? "font-bold" : "",
                      cell.italic ? "italic" : "",
                      cell.underline ? "underline" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    if (hasAnswer) {
                      const parts = (cell.content ?? "").split(
                        /\[\[([^\]]+)\]\]/g,
                      );
                      return (
                        <td
                          key={ci}
                          className={`border border-border px-2 py-1.5 min-w-[80px] bg-teal-50/30 dark:bg-teal-900/10 ${cAlign} ${cStyle}`}
                        >
                          <div className="flex flex-wrap items-baseline gap-0.5">
                            {parts
                              .filter((p) => p.length > 0)
                              .map((part, pi) => {
                                const field = (cell.inlineFields ?? []).find(
                                  (f) => f.id === part,
                                );
                                if (field) {
                                  const key = `${block.id}__${ri}__${ci}__${field.id}`;
                                  const fError =
                                    showErrors &&
                                    field.required &&
                                    !inlineAnswers[key];
                                  return (
                                    <AnswerInlineField
                                      key={pi}
                                      field={field}
                                      value={inlineAnswers[key] ?? ""}
                                      onChange={(v) => onInlineChange(key, v)}
                                      isError={fError}
                                    />
                                  );
                                }
                                return <span key={pi}>{part}</span>;
                              })}
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={ci}
                        className={`border border-border px-3 py-2 text-sm min-w-[80px] select-none ${cAlign} ${cStyle}`}
                      >
                        {cell.content ?? ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // ── Medical specialised blocks ────────────────────────────────────────────
    case "diagnostic_record":
      return (
        <DiagnosticAnswerBlock
          block={block}
          value={(val as DiagEntry[]) ?? []}
          onChange={(v) => onAnswerChange(block.id, v)}
          isError={isError}
        />
      );

    case "medication_full":
      return (
        <MedFullAnswerBlock
          block={block}
          value={(val as MedFullEntry[]) ?? []}
          onChange={(v) => onAnswerChange(block.id, v)}
          isError={isError}
        />
      );

    case "medication_mini":
      return (
        <MedMiniAnswerBlock
          block={block}
          value={(val as MedMiniEntry[]) ?? []}
          onChange={(v) => onAnswerChange(block.id, v)}
          isError={isError}
        />
      );

    case "lab_record":
      return (
        <LabAnswerBlock
          block={block}
          value={(val as LabRowValues) ?? {}}
          onChange={(v) => onAnswerChange(block.id, v)}
          isError={isError}
        />
      );

    case "product_listener":
      // product_listener is a live-session billing tool; in standalone form-renderer
      // we render it as an informational placeholder
      return (
        <div className="my-3 p-3 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/10">
          <p className="text-xs text-muted-foreground/70 italic">
            Product / procedure listener — available in consultation context.
          </p>
        </div>
      );

    // ── Layout ────────────────────────────────────────────────────────────────
    case "layout": {
      const columns: LayoutColumn[] = block.layoutColumns ?? [];
      const numCols = columns.length;
      const gridClass =
        numCols <= 1
          ? "grid-cols-1"
          : numCols === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : numCols === 3
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

      return (
        <div className={`my-3 grid ${gridClass} gap-4`}>
          {columns.map((col) => (
            <div key={col.id} className="min-w-0 space-y-0">
              {col.blocks.map((b) => (
                <AnswerBlock
                  key={b.id}
                  block={b}
                  answers={answers}
                  onAnswerChange={onAnswerChange}
                  showErrors={showErrors}
                  inlineAnswers={inlineAnswers}
                  onInlineChange={onInlineChange}
                />
              ))}
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}

// ─── Collect all answerable block IDs (including nested layout columns) ────────

function collectAnswerableBlocks(blocks: FormBlock[]): FormBlock[] {
  const result: FormBlock[] = [];
  for (const b of blocks) {
    if (b.type === "layout") {
      for (const col of b.layoutColumns ?? []) {
        result.push(...collectAnswerableBlocks(col.blocks));
      }
    } else {
      result.push(b);
    }
  }
  return result;
}

// ─── FormRenderer ─────────────────────────────────────────────────────────────

export function FormRenderer({
  form,
  showTitle = false,
  validate = true,
  onSubmit,
  onChange,
  submitLabel = "Submit",
  hideSubmit = false,
  className = "",
}: FormRendererProps) {
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [inlineAnswers, setInlineAnswers] = useState<Record<string, string>>(
    {},
  );
  const [showErrors, setShowErrors] = useState(false);

  // Notify parent on every change
  const notifyChange = useCallback(
    (ans: FormAnswers, inline: Record<string, string>) => {
      if (!onChange) return;
      onChange({ ...ans, ...inline });
    },
    [onChange],
  );

  const handleAnswerChange = useCallback(
    (blockId: string, value: unknown) => {
      setAnswers((prev) => {
        const next = { ...prev, [blockId]: value };
        notifyChange(next, inlineAnswers);
        return next;
      });
    },
    [inlineAnswers, notifyChange],
  );

  const handleInlineChange = useCallback(
    (key: string, value: string) => {
      setInlineAnswers((prev) => {
        const next = { ...prev, [key]: value };
        notifyChange(answers, next);
        return next;
      });
    },
    [answers, notifyChange],
  );

  // Collect all required blocks for validation
  const allBlocks = useMemo(
    () => collectAnswerableBlocks(form?.blocks ?? []),
    [form?.blocks],
  );

  const hasViolations = useMemo(
    () =>
      allBlocks.some(
        (b) => shouldShowBlock(b, answers) && isBlockViolating(b, answers),
      ),
    [allBlocks, answers],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate && hasViolations) {
      setShowErrors(true);
      return;
    }
    const combined = { ...answers, ...inlineAnswers };
    onSubmit?.(combined);
  };

  if (!form) return null;

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      {showTitle && form.name && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{form.name}</h1>
          {form.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {form.description}
            </p>
          )}
        </div>
      )}

      {form.blocks.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          <p className="text-2xl mb-2">📄</p>
          <p>No blocks in this form yet.</p>
        </div>
      ) : (
        form.blocks.map((block) => (
          <AnswerBlock
            key={block.id}
            block={block}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            showErrors={showErrors}
            inlineAnswers={inlineAnswers}
            onInlineChange={handleInlineChange}
          />
        ))
      )}

      {showErrors && hasViolations && (
        <p className="text-sm text-red-500 mt-4 font-medium">
          Please fill in all required fields before submitting.
        </p>
      )}

      {!hideSubmit && (
        <div className="mt-8">
          <Button
            type="submit"
            className="bg-[#FF6900] hover:bg-[#e05f00] text-white px-8"
          >
            {submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}
