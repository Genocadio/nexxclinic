"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Package,
  Stethoscope,
  Pill,
  FlaskConical,
  Search,
  Loader2,
  X,
} from "lucide-react";
import { useProductSearch } from "@/hooks/products/hooks";
import type { FormBlock, LabRow } from "@/lib/formbuilder-storage";
import { fbGenId } from "@/lib/formbuilder-storage";

// ─── Shared config panel primitives ──────────────────────────────────────────

function ConfigSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3 pt-3 border-t border-border/50 space-y-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function CfgField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}

// ─── Default lab rows (used when block has none yet) ─────────────────────────

const DEFAULT_LAB_ROWS: LabRow[] = [
  {
    id: "dlr_1",
    name: "Result 1",
    unitMode: "dropdown",
    unitOptions: ["mg/dL", "mmol/L", "g/dL"],
    defaultUnit: "mg/dL",
    resultOptions: ["+ve", "-ve"],
  },
  {
    id: "dlr_2",
    name: "Result 2",
    unitMode: "dropdown",
    unitOptions: ["mg/dL", "mmol/L", "g/dL"],
    defaultUnit: "mg/dL",
    resultOptions: ["+ve", "-ve"],
  },
  {
    id: "dlr_3",
    name: "Result 3",
    unitMode: "dropdown",
    unitOptions: ["mg/dL", "mmol/L", "g/dL"],
    defaultUnit: "mg/dL",
    resultOptions: ["+ve", "-ve"],
  },
];

// ─── 1. Diagnosis Block ───────────────────────────────────────────────────────

interface DiagEntry {
  id: string;
  diagnosis: string;
  description?: string;
}

function DiagnosticRecordBlock({
  block,
  isActive,
  onChange,
  onActivate,
}: MedBlockProps) {
  const [entries, setEntries] = useState<DiagEntry[]>([]);
  const [draftDiag, setDraftDiag] = useState("");
  const [draftDesc, setDraftDesc] = useState("");

  const add = () => {
    const name = draftDiag.trim();
    if (!name) return;
    setEntries((p) => [
      ...p,
      {
        id: `d_${Date.now()}`,
        diagnosis: name,
        description: draftDesc.trim() || undefined,
      },
    ]);
    setDraftDiag("");
    setDraftDesc("");
  };

  return (
    <div>
      <div className="space-y-2 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
        {/* Header — click to configure */}
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-1.5 cursor-pointer select-none"
          onClick={() => !isActive && onActivate?.()}
          onKeyDown={(e) => e.key === "Enter" && !isActive && onActivate?.()}
        >
          <Stethoscope className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {block.label || "Diagnoses"}
          </span>
          {block.required && <span className="text-red-500 text-xs">*</span>}
          {!isActive && (
            <span className="ml-auto text-[10px] text-muted-foreground/50 font-normal normal-case tracking-normal">
              click header to configure
            </span>
          )}
        </div>

        {/* Demo interaction */}
        <Input
          value={draftDiag}
          onChange={(e) => setDraftDiag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={block.placeholder || "Enter diagnosis name…"}
          className="h-8 text-sm bg-background"
        />
        <Textarea
          value={draftDesc}
          onChange={(e) => setDraftDesc(e.target.value)}
          placeholder="Notes / description (optional)"
          className="text-sm min-h-[52px] resize-none bg-background"
          rows={2}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={add}
            disabled={!draftDiag.trim()}
            className="h-7 rounded-full gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-3 w-3" />
            Add Diagnosis
          </Button>
        </div>

        {entries.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-emerald-200 dark:border-emerald-800">
            {entries.map((e) => (
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
                  onClick={() =>
                    setEntries((p) => p.filter((r) => r.id !== e.id))
                  }
                  className="mt-0.5 p-0.5 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isActive && (
        <ConfigSection title="Diagnosis block settings">
          <CfgField label="Label">
            <Input
              className="h-7 text-sm"
              value={block.label ?? ""}
              onChange={(e) => onChange({ label: e.target.value })}
            />
          </CfgField>
          <CfgField label="Diagnosis input placeholder">
            <Input
              className="h-7 text-sm"
              value={block.placeholder ?? ""}
              onChange={(e) => onChange({ placeholder: e.target.value })}
            />
          </CfgField>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!block.required}
              onChange={(e) => onChange({ required: e.target.checked })}
              className="rounded"
            />
            Required field
          </label>
        </ConfigSection>
      )}
    </div>
  );
}

// ─── 2. Full Medication Block ─────────────────────────────────────────────────

interface MedFullEntry {
  id: string;
  name: string;
  frequency: string;
  amount: string;
  days: string;
  notes?: string;
}

function MedicationFullBlock({
  block,
  isActive,
  onChange,
  onActivate,
}: MedBlockProps) {
  const [entries, setEntries] = useState<MedFullEntry[]>([]);
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

  const add = () => {
    if (
      !draft.name.trim() ||
      !draft.frequency.trim() ||
      !draft.amount.trim() ||
      !draft.days.trim()
    )
      return;
    setEntries((p) => [
      ...p,
      {
        id: `mf_${Date.now()}`,
        ...draft,
        notes: draft.notes.trim() || undefined,
      },
    ]);
    setDraft({ name: "", frequency: "", amount: "", days: "", notes: "" });
  };

  const canAdd =
    draft.name.trim() &&
    draft.frequency.trim() &&
    draft.amount.trim() &&
    draft.days.trim();

  return (
    <div>
      <div className="space-y-2 p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-1.5 cursor-pointer select-none"
          onClick={() => !isActive && onActivate?.()}
          onKeyDown={(e) => e.key === "Enter" && !isActive && onActivate?.()}
        >
          <Pill className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
            {block.label || "Medications"}
          </span>
          {block.required && <span className="text-red-500 text-xs">*</span>}
          {!isActive && (
            <span className="ml-auto text-[10px] text-muted-foreground/50 font-normal normal-case tracking-normal">
              click header to configure
            </span>
          )}
        </div>

        <Input
          value={draft.name}
          onChange={upd("name")}
          placeholder={block.placeholder || "Medication name…"}
          className="h-8 text-sm bg-background"
        />
        <div className="grid grid-cols-3 gap-2">
          <Input
            value={draft.frequency}
            onChange={upd("frequency")}
            placeholder="Frequency"
            className="h-8 text-sm bg-background"
          />
          <Input
            value={draft.amount}
            onChange={upd("amount")}
            placeholder="Amount"
            className="h-8 text-sm bg-background"
          />
          <Input
            value={draft.days}
            onChange={upd("days")}
            placeholder="Days"
            className="h-8 text-sm bg-background"
          />
        </div>
        <Textarea
          value={draft.notes}
          onChange={upd("notes")}
          placeholder="Extra notes (optional)"
          className="text-sm min-h-[48px] resize-none bg-background"
          rows={2}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={add}
            disabled={!canAdd}
            className="h-7 rounded-full gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-3 w-3" /> Add Medication
          </Button>
        </div>

        {entries.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-blue-200 dark:border-blue-800">
            {entries.map((e) => (
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
                  onClick={() =>
                    setEntries((p) => p.filter((r) => r.id !== e.id))
                  }
                  className="mt-0.5 p-0.5 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isActive && (
        <ConfigSection title="Full medication settings">
          <CfgField label="Label">
            <Input
              className="h-7 text-sm"
              value={block.label ?? ""}
              onChange={(e) => onChange({ label: e.target.value })}
            />
          </CfgField>
          <CfgField label="Medication name placeholder">
            <Input
              className="h-7 text-sm"
              value={block.placeholder ?? ""}
              onChange={(e) => onChange({ placeholder: e.target.value })}
            />
          </CfgField>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!block.required}
              onChange={(e) => onChange({ required: e.target.checked })}
              className="rounded"
            />
            Required field
          </label>
        </ConfigSection>
      )}
    </div>
  );
}

// ─── 3. Quick Medication Block ────────────────────────────────────────────────

interface MedMiniEntry {
  id: string;
  name: string;
  notes?: string;
}

function MedicationMiniBlock({
  block,
  isActive,
  onChange,
  onActivate,
}: MedBlockProps) {
  const [entries, setEntries] = useState<MedMiniEntry[]>([]);
  const [draftName, setDraftName] = useState("");
  const [draftNotes, setDraftNotes] = useState("");

  const add = () => {
    if (!draftName.trim()) return;
    setEntries((p) => [
      ...p,
      {
        id: `mm_${Date.now()}`,
        name: draftName.trim(),
        notes: draftNotes.trim() || undefined,
      },
    ]);
    setDraftName("");
    setDraftNotes("");
  };

  return (
    <div>
      <div className="space-y-2 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20">
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-1.5 cursor-pointer select-none"
          onClick={() => !isActive && onActivate?.()}
          onKeyDown={(e) => e.key === "Enter" && !isActive && onActivate?.()}
        >
          <Pill className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">
            {block.label || "Medications"}
          </span>
          {block.required && <span className="text-red-500 text-xs">*</span>}
          {!isActive && (
            <span className="ml-auto text-[10px] text-muted-foreground/50 font-normal normal-case tracking-normal">
              click header to configure
            </span>
          )}
        </div>

        <Input
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={block.placeholder || "Medication name…"}
          className="h-8 text-sm bg-background"
        />
        <Textarea
          value={draftNotes}
          onChange={(e) => setDraftNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="text-sm min-h-[48px] resize-none bg-background"
          rows={2}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={add}
            disabled={!draftName.trim()}
            className="h-7 rounded-full gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="h-3 w-3" /> Add Medication
          </Button>
        </div>

        {entries.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-indigo-200 dark:border-indigo-800">
            {entries.map((e) => (
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
                  onClick={() =>
                    setEntries((p) => p.filter((r) => r.id !== e.id))
                  }
                  className="mt-0.5 p-0.5 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isActive && (
        <ConfigSection title="Quick medication settings">
          <CfgField label="Label">
            <Input
              className="h-7 text-sm"
              value={block.label ?? ""}
              onChange={(e) => onChange({ label: e.target.value })}
            />
          </CfgField>
          <CfgField label="Medication name placeholder">
            <Input
              className="h-7 text-sm"
              value={block.placeholder ?? ""}
              onChange={(e) => onChange({ placeholder: e.target.value })}
            />
          </CfgField>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!block.required}
              onChange={(e) => onChange({ required: e.target.checked })}
              className="rounded"
            />
            Required field
          </label>
        </ConfigSection>
      )}
    </div>
  );
}

// ─── 4. Lab Record Block ──────────────────────────────────────────────────────

function LabRowEditor({
  row,
  layout,
  onChange,
  onDelete,
}: {
  row: LabRow;
  layout: "valueUnit" | "result";
  onChange: (r: LabRow) => void;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-1 p-2 rounded border border-border bg-background">
      <div className="flex items-center gap-2">
        <Input
          className="h-6 text-xs flex-1"
          value={row.name}
          onChange={(e) => onChange({ ...row, name: e.target.value })}
          placeholder="Row name"
        />
        <button
          onClick={onDelete}
          className="text-muted-foreground hover:text-destructive shrink-0"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      {layout === "valueUnit" && (
        <div>
          <p className="text-[10px] text-muted-foreground mb-0.5">
            Units (comma-separated)
          </p>
          <Input
            className="h-6 text-xs"
            value={row.unitOptions.join(", ")}
            onChange={(e) => {
              const units = e.target.value
                .split(",")
                .map((u) => u.trim())
                .filter(Boolean);
              onChange({
                ...row,
                unitOptions: units,
                defaultUnit: units[0] ?? row.defaultUnit,
              });
            }}
            placeholder="mg/dL, mmol/L, %"
          />
        </div>
      )}
      {layout === "result" && (
        <div>
          <p className="text-[10px] text-muted-foreground mb-0.5">
            Result options (comma-separated)
          </p>
          <Input
            className="h-6 text-xs"
            value={row.resultOptions.join(", ")}
            onChange={(e) => {
              const opts = e.target.value
                .split(",")
                .map((o) => o.trim())
                .filter(Boolean);
              onChange({ ...row, resultOptions: opts });
            }}
            placeholder="+ve, -ve, Equivocal"
          />
        </div>
      )}
    </div>
  );
}

function LabRecordBlock({
  block,
  isActive,
  onChange,
  onActivate,
}: MedBlockProps) {
  const layout = block.labLayout ?? "valueUnit";
  const rows = block.labRows?.length ? block.labRows : DEFAULT_LAB_ROWS;

  // Demo fill values — ephemeral, not saved to block schema
  const [demoValues, setDemoValues] = useState<
    Record<string, { value?: string; unit?: string; result?: string }>
  >({});
  const updateDemo = (
    rowId: string,
    key: "value" | "unit" | "result",
    val: string,
  ) => setDemoValues((p) => ({ ...p, [rowId]: { ...p[rowId], [key]: val } }));

  const updateRow = (idx: number, newRow: LabRow) => {
    const updated = [...rows];
    updated[idx] = newRow;
    onChange({ labRows: updated });
  };
  const deleteRow = (idx: number) =>
    onChange({ labRows: rows.filter((_, i) => i !== idx) });
  const addRow = () => {
    const newRow: LabRow = {
      id: fbGenId(),
      name: `Row ${rows.length + 1}`,
      unitMode: "dropdown",
      unitOptions: ["mg/dL", "mmol/L"],
      defaultUnit: "mg/dL",
      resultOptions: ["+ve", "-ve"],
    };
    onChange({ labRows: [...rows, newRow] });
  };

  return (
    <div>
      <div className="p-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-1.5 mb-2 cursor-pointer select-none"
          onClick={() => !isActive && onActivate?.()}
          onKeyDown={(e) => e.key === "Enter" && !isActive && onActivate?.()}
        >
          <FlaskConical className="h-3.5 w-3.5 text-purple-600 shrink-0" />
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
            {block.label || "Lab Results"}
          </span>
          {block.required && <span className="text-red-500 text-xs">*</span>}
          {!isActive && (
            <span className="ml-auto text-[10px] text-muted-foreground/50 font-normal normal-case tracking-normal">
              click header to configure
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border bg-muted/60 px-2.5 py-1.5 text-left text-xs font-semibold">
                  Name
                </th>
                {layout === "valueUnit" ? (
                  <>
                    <th className="border border-border bg-muted/60 px-2.5 py-1.5 text-left text-xs font-semibold">
                      Value
                    </th>
                    <th className="border border-border bg-muted/60 px-2.5 py-1.5 text-left text-xs font-semibold">
                      Unit
                    </th>
                  </>
                ) : (
                  <th className="border border-border bg-muted/60 px-2.5 py-1.5 text-left text-xs font-semibold">
                    Result
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const val = demoValues[row.id] ?? {};
                const units = row.unitOptions.length
                  ? row.unitOptions
                  : ["mg/dL", "mmol/L"];
                const results = row.resultOptions.length
                  ? row.resultOptions
                  : ["+ve", "-ve"];
                return (
                  <tr key={row.id}>
                    <td className="border border-border px-2.5 py-1.5 text-sm font-medium whitespace-nowrap">
                      {row.name}
                    </td>
                    {layout === "valueUnit" ? (
                      <>
                        <td className="border border-border px-1 py-1 min-w-[80px]">
                          <input
                            className="w-full h-7 px-2 text-xs border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
                            value={val.value ?? ""}
                            onChange={(e) =>
                              updateDemo(row.id, "value", e.target.value)
                            }
                            placeholder="Value"
                          />
                        </td>
                        <td className="border border-border px-1 py-1 min-w-[90px]">
                          <select
                            className="w-full h-7 px-1 text-xs border rounded bg-background focus:outline-none"
                            value={val.unit ?? row.defaultUnit ?? units[0]}
                            onChange={(e) =>
                              updateDemo(row.id, "unit", e.target.value)
                            }
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
                      <td className="border border-border px-1 py-1 min-w-[100px]">
                        <select
                          className="w-full h-7 px-1 text-xs border rounded bg-background focus:outline-none"
                          value={val.result ?? ""}
                          onChange={(e) =>
                            updateDemo(row.id, "result", e.target.value)
                          }
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

      {isActive && (
        <ConfigSection title="Lab record settings">
          <CfgField label="Label">
            <Input
              className="h-7 text-sm"
              value={block.label ?? ""}
              onChange={(e) => onChange({ label: e.target.value })}
            />
          </CfgField>

          {/* Layout picker */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Layout</p>
            <div className="flex gap-2">
              {(["valueUnit", "result"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => onChange({ labLayout: l })}
                  className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${layout === l ? "bg-primary text-white border-primary" : "bg-background text-foreground border-border hover:bg-muted/40"}`}
                >
                  {l === "valueUnit" ? "Value + Unit" : "Result only"}
                </button>
              ))}
            </div>
          </div>

          {/* Row editor */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">
              Rows ({rows.length})
            </p>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
              {rows.map((row, idx) => (
                <LabRowEditor
                  key={row.id}
                  row={row}
                  layout={layout}
                  onChange={(r) => updateRow(idx, r)}
                  onDelete={() => deleteRow(idx)}
                />
              ))}
            </div>
            <button
              onClick={addRow}
              className="w-full mt-1.5 py-1.5 text-xs text-muted-foreground border border-dashed border-border rounded hover:bg-muted/30 transition-colors"
            >
              + Add Row
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!block.required}
              onChange={(e) => onChange({ required: e.target.checked })}
              className="rounded"
            />
            Required field
          </label>
        </ConfigSection>
      )}
    </div>
  );
}

// ─── 5. Product / Action Listener Block ──────────────────────────────────────

// ─── Product type display helpers ────────────────────────────────────────────

const PTYPE_LABEL: Record<string, string> = {
  DRUG: "Drug",
  MEDICAL_ACT: "Procedure",
  BIOLOGICAL_ACT: "Biological",
  CONSUMABLE_DEVICE: "Consumable",
};

const PTYPE_COLOR: Record<string, string> = {
  DRUG: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  MEDICAL_ACT:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  BIOLOGICAL_ACT:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  CONSUMABLE_DEVICE:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
};

interface AddedProduct {
  id: string;
  name: string;
  type: string;
  qty: number;
  price: number;
}

function ProductListenerBlock({
  block,
  isActive,
  onChange,
  onActivate,
}: MedBlockProps) {
  const [addedItems, setAddedItems] = useState<AddedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const centered = block.productListenerCenter ?? false;
  const btnLabel = block.label || "Add Product";

  // Real API search — skips automatically when query < 2 chars
  const { products: searchResults, loading: searching } = useProductSearch(
    searchQuery,
    { size: 12 },
  );

  const handleAdd = (product: any) => {
    if (addedItems.some((i) => i.id === String(product.id))) return;
    setAddedItems((p) => [
      ...p,
      {
        id: String(product.id),
        name: product.name,
        type: product.type ?? "MEDICAL_ACT",
        qty: 1,
        price: product.clinicPrice ?? 0,
      },
    ]);
    setSearchQuery("");
    setShowSearch(false);
  };

  const handleOpenSearch = () => {
    setShowSearch(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  return (
    <div>
      <div className="space-y-2 p-3 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
        {/* Header */}
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-1.5 cursor-pointer select-none"
          onClick={() => !isActive && onActivate?.()}
          onKeyDown={(e) => e.key === "Enter" && !isActive && onActivate?.()}
        >
          <Package className="h-3.5 w-3.5 text-orange-600 shrink-0" />
          <span className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide">
            Product / Procedure Listener
          </span>
          {!isActive && (
            <span className="ml-auto text-[10px] text-muted-foreground/50 font-normal normal-case tracking-normal">
              click header to configure
            </span>
          )}
        </div>

        {/* Add button (preview of how it looks on the filled form) */}
        <div className={centered ? "flex justify-center" : "flex"}>
          <button
            onClick={handleOpenSearch}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-border bg-card/80 text-sm hover:bg-card shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            {btnLabel}
          </button>
        </div>

        {/* Search panel */}
        {showSearch && (
          <div className="rounded-lg border border-border bg-background shadow-sm overflow-hidden">
            {/* Search input */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products & procedures…"
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground/50"
              />
              {searching && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground shrink-0" />
              )}
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
                className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-48 overflow-y-auto">
              {searchQuery.length < 2 ? (
                <p className="px-3 py-4 text-xs text-muted-foreground/60 text-center italic">
                  Type at least 2 characters to search…
                </p>
              ) : searching && searchResults.length === 0 ? (
                <p className="px-3 py-4 text-xs text-muted-foreground/60 text-center">
                  Searching…
                </p>
              ) : searchResults.length === 0 ? (
                <p className="px-3 py-4 text-xs text-muted-foreground/60 text-center">
                  No products found
                </p>
              ) : (
                searchResults.map((p: any) => (
                  <button
                    key={p.id}
                    onClick={() => handleAdd(p)}
                    disabled={addedItems.some((i) => i.id === String(p.id))}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-b border-border/30 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                      {p.genericName && p.genericName !== p.name && (
                        <p className="text-xs text-muted-foreground truncate">
                          {p.genericName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {p.type && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${PTYPE_COLOR[p.type] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {PTYPE_LABEL[p.type] ?? p.type}
                        </span>
                      )}
                      {p.clinicPrice != null && (
                        <span className="text-xs text-muted-foreground">
                          {p.clinicPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Added items */}
        {addedItems.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-orange-200 dark:border-orange-800">
            {addedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-border bg-background text-xs"
              >
                <Package className="h-3 w-3 text-orange-500 shrink-0" />
                <span className="flex-1 font-medium truncate">{item.name}</span>
                {item.type && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${PTYPE_COLOR[item.type] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {PTYPE_LABEL[item.type] ?? item.type}
                  </span>
                )}
                <span className="text-muted-foreground shrink-0">
                  {item.price > 0 ? `${item.price.toLocaleString()} RWF` : "—"}
                </span>
                <button
                  onClick={() =>
                    setAddedItems((p) => p.filter((x) => x.id !== item.id))
                  }
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-muted-foreground/70 italic pt-1 border-t border-orange-200/60 dark:border-orange-800/40">
          Links to the product / procedure catalog. Products added during
          consultation are automatically tracked for billing.
        </p>
      </div>

      {isActive && (
        <ConfigSection title="Product listener settings">
          <CfgField label="Button label">
            <Input
              className="h-7 text-sm"
              value={block.label ?? ""}
              onChange={(e) => onChange({ label: e.target.value })}
              placeholder="Add Product"
            />
          </CfgField>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!block.productListenerCenter}
              onChange={(e) =>
                onChange({ productListenerCenter: e.target.checked })
              }
              className="rounded"
            />
            Center the button
          </label>
        </ConfigSection>
      )}
    </div>
  );
}

// ─── Public props interface ───────────────────────────────────────────────────

export interface MedBlockProps {
  block: FormBlock;
  isActive: boolean;
  onChange: (patch: Partial<FormBlock>) => void;
  onActivate?: () => void;
}

// ─── Main dispatcher ──────────────────────────────────────────────────────────

export function MedicalBlockItem(props: MedBlockProps) {
  switch (props.block.type) {
    case "diagnostic_record":
      return <DiagnosticRecordBlock {...props} />;
    case "medication_full":
      return <MedicationFullBlock {...props} />;
    case "medication_mini":
      return <MedicationMiniBlock {...props} />;
    case "lab_record":
      return <LabRecordBlock {...props} />;
    case "product_listener":
      return <ProductListenerBlock {...props} />;
    default:
      return null;
  }
}
