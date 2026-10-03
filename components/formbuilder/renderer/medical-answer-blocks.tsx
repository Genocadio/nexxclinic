"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FlaskConical,
  Package,
  Pill,
  Plus,
  Stethoscope,
} from "lucide-react";
import type { FormBlock } from "@/lib/formbuilder-storage";
import type { MedicalBlockHandlers } from "../extensions/types";
import { ProductListenerWithVisitSync } from "./product-listener-sync";
import { EntryList, PTYPE_COLOR, PTYPE_LABEL } from "./medical-shared";
import type {
  AddedProduct,
  DiagEntry,
  LabRowValues,
  MedFullEntry,
  MedMiniEntry,
} from "./types";
import { uid } from "./utils";

export function DiagnosticAnswerBlock({
  block,
  value,
  onChange,
  isError,
  edit,
  handlers,
}: {
  block: FormBlock;
  value: DiagEntry[];
  onChange: (v: DiagEntry[]) => void;
  isError?: boolean;
  edit: boolean;
  handlers?: MedicalBlockHandlers | null;
}) {
  const items = handlers?.diagnostics ?? value ?? [];
  const add = async (diagnosis: string, description?: string) => {
    const name = diagnosis.trim();
    if (!name) return;
    if (handlers?.onAddDiagnosis) {
      await handlers.onAddDiagnosis(name, description);
      return;
    }
    onChange([
      ...value,
      {
        id: `d${uid()}`,
        diagnosis: name,
        description: description?.trim() || undefined,
      },
    ]);
  };
  const remove = async (id: string) => {
    if (handlers?.onRemoveDiagnosis) {
      await handlers.onRemoveDiagnosis(id);
      return;
    }
    onChange(value.filter((e) => e.id !== id));
  };

  return (
    <div className="my-3">
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5 text-foreground">
        <Stethoscope className="h-3.5 w-3.5 text-emerald-600" />
        {block.label || "Diagnoses"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`space-y-3 p-3.5 rounded-xl border transition-colors shadow-xs ${
          isError
            ? "border-red-400 bg-red-50/40 dark:bg-red-950/20"
            : "border-emerald-200/80 dark:border-emerald-800/70 bg-emerald-50/50 dark:bg-emerald-950/30"
        }`}
      >
        {edit && (
          <DiagnosticDraft
            onAdd={add}
            placeholder={block.placeholder || "Enter diagnosis name…"}
          />
        )}
        <EntryList
          emptyLabel="No diagnoses"
          items={items}
          render={(e) => (
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
          )}
          onRemove={edit ? remove : undefined}
        />
      </div>
    </div>
  );
}

function DiagnosticDraft({
  onAdd,
  placeholder,
}: {
  onAdd: (diagnosis: string, description?: string) => void | Promise<void>;
  placeholder: string;
}) {
  const [draftDiag, setDraftDiag] = React.useState("");
  const [draftDesc, setDraftDesc] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const submit = async () => {
    if (!draftDiag.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onAdd(draftDiag, draftDesc);
      setDraftDiag("");
      setDraftDesc("");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Input
        value={draftDiag}
        onChange={(e) => setDraftDiag(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        className="h-8 text-sm bg-white dark:bg-slate-900 border-emerald-300/70 dark:border-emerald-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
      />
      <Textarea
        value={draftDesc}
        onChange={(e) => setDraftDesc(e.target.value)}
        placeholder="Notes / description (optional)"
        className="text-sm min-h-[52px] resize-none bg-white dark:bg-slate-900 border-emerald-300/70 dark:border-emerald-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
        rows={2}
      />
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          onClick={submit}
          disabled={!draftDiag.trim() || submitting}
          className="h-7 rounded-full gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
        >
          <Plus className="h-3 w-3" /> Add Diagnosis
        </Button>
      </div>
    </>
  );
}

export function MedFullAnswerBlock({
  block,
  value,
  onChange,
  isError,
  edit,
  handlers,
}: {
  block: FormBlock;
  value: MedFullEntry[];
  onChange: (v: MedFullEntry[]) => void;
  isError?: boolean;
  edit: boolean;
  handlers?: MedicalBlockHandlers | null;
}) {
  const items = handlers?.medicationsFull ?? value ?? [];
  const remove = async (id: string) => {
    if (handlers?.onRemoveMedication) {
      await handlers.onRemoveMedication(id);
      return;
    }
    onChange(value.filter((e) => e.id !== id));
  };
  const addEntry = async (draft: Omit<MedFullEntry, "id">) => {
    if (handlers?.onAddMedicationFull) {
      await handlers.onAddMedicationFull(draft);
      return;
    }
    onChange([
      ...value,
      {
        id: `mf${uid()}`,
        ...draft,
        notes: draft.notes?.trim() || undefined,
      },
    ]);
  };
  return (
    <div className="my-3">
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5 text-foreground">
        <Pill className="h-3.5 w-3.5 text-blue-600" />
        {block.label || "Medications"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`space-y-3 p-3.5 rounded-xl border transition-colors shadow-xs ${
          isError
            ? "border-red-400 bg-red-50/40 dark:bg-red-950/20"
            : "border-blue-200/80 dark:border-blue-800/70 bg-blue-50/50 dark:bg-blue-950/30"
        }`}
      >
        {edit && (
          <MedFullDraft
            onAdd={addEntry}
            placeholder={block.placeholder || "Medication name…"}
          />
        )}
        <EntryList
          emptyLabel="No medications"
          items={items}
          render={(e) => (
            <div className="flex-1 min-w-0">
              <p className="font-medium break-words">{e.name}</p>
              <p className="text-xs text-muted-foreground">
                Frequency: {e.frequency} · Amount: {e.amount} · Days: {e.days}
              </p>
              {e.notes && (
                <p className="text-xs text-muted-foreground">{e.notes}</p>
              )}
            </div>
          )}
          onRemove={edit ? remove : undefined}
        />
      </div>
    </div>
  );
}

function MedFullDraft({
  onAdd,
  placeholder,
}: {
  onAdd: (v: Omit<MedFullEntry, "id">) => void | Promise<void>;
  placeholder: string;
}) {
  const [draft, setDraft] = React.useState({
    name: "",
    frequency: "",
    amount: "",
    days: "",
    notes: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const upd =
    (k: keyof typeof draft) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft((d) => ({ ...d, [k]: e.target.value }));
  const canAdd =
    draft.name.trim() &&
    draft.frequency.trim() &&
    draft.amount.trim() &&
    draft.days.trim();
  const submit = async () => {
    if (!canAdd || submitting) return;
    setSubmitting(true);
    try {
      await onAdd(draft);
      setDraft({ name: "", frequency: "", amount: "", days: "", notes: "" });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Input
        value={draft.name}
        onChange={upd("name")}
        placeholder={placeholder}
        className="h-8 text-sm bg-white dark:bg-slate-900 border-blue-300/70 dark:border-blue-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
      />
      <div className="grid grid-cols-3 gap-2">
        <Input
          value={draft.frequency}
          onChange={upd("frequency")}
          placeholder="Frequency"
          className="h-8 text-sm bg-white dark:bg-slate-900 border-blue-300/70 dark:border-blue-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
        />
        <Input
          value={draft.amount}
          onChange={upd("amount")}
          placeholder="Amount"
          className="h-8 text-sm bg-white dark:bg-slate-900 border-blue-300/70 dark:border-blue-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
        />
        <Input
          value={draft.days}
          onChange={upd("days")}
          placeholder="Days"
          className="h-8 text-sm bg-white dark:bg-slate-900 border-blue-300/70 dark:border-blue-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
        />
      </div>
      <Textarea
        value={draft.notes}
        onChange={upd("notes")}
        placeholder="Extra notes (optional)"
        className="text-sm min-h-[48px] resize-none bg-white dark:bg-slate-900 border-blue-300/70 dark:border-blue-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
        rows={2}
      />
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          onClick={submit}
          disabled={!canAdd || submitting}
          className="h-7 rounded-full gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
        >
          <Plus className="h-3 w-3" /> Add Medication
        </Button>
      </div>
    </>
  );
}

export function MedMiniAnswerBlock({
  block,
  value,
  onChange,
  isError,
  edit,
  handlers,
}: {
  block: FormBlock;
  value: MedMiniEntry[];
  onChange: (v: MedMiniEntry[]) => void;
  isError?: boolean;
  edit: boolean;
  handlers?: MedicalBlockHandlers | null;
}) {
  const items = handlers?.medicationsMini ?? value ?? [];
  const remove = async (id: string) => {
    if (handlers?.onRemoveMedication) {
      await handlers.onRemoveMedication(id);
      return;
    }
    onChange(value.filter((e) => e.id !== id));
  };
  const addEntry = async (name: string, notes?: string) => {
    if (handlers?.onAddMedicationMini) {
      await handlers.onAddMedicationMini(name, notes);
      return;
    }
    onChange([
      ...value,
      {
        id: `mm${uid()}`,
        name: name.trim(),
        notes: notes?.trim() || undefined,
      },
    ]);
  };
  return (
    <div className="my-3">
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5 text-foreground">
        <Pill className="h-3.5 w-3.5 text-indigo-600" />
        {block.label || "Medications"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`space-y-3 p-3.5 rounded-xl border transition-colors shadow-xs ${
          isError
            ? "border-red-400 bg-red-50/40 dark:bg-red-950/20"
            : "border-indigo-200/80 dark:border-indigo-800/70 bg-indigo-50/50 dark:bg-indigo-950/30"
        }`}
      >
        {edit && (
          <MedMiniDraft
            onAdd={addEntry}
            placeholder={block.placeholder || "Medication name…"}
          />
        )}
        <EntryList
          emptyLabel="No medications"
          items={items}
          render={(e) => (
            <div className="flex-1 min-w-0">
              <p className="font-medium break-words">{e.name}</p>
              {e.notes && (
                <p className="text-xs text-muted-foreground">{e.notes}</p>
              )}
            </div>
          )}
          onRemove={edit ? remove : undefined}
        />
      </div>
    </div>
  );
}

function MedMiniDraft({
  onAdd,
  placeholder,
}: {
  onAdd: (name: string, notes?: string) => void | Promise<void>;
  placeholder: string;
}) {
  const [draftName, setDraftName] = React.useState("");
  const [draftNotes, setDraftNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const submit = async () => {
    if (!draftName.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onAdd(draftName, draftNotes);
      setDraftName("");
      setDraftNotes("");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Input
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        className="h-8 text-sm bg-white dark:bg-slate-900 border-indigo-300/70 dark:border-indigo-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
      />
      <Textarea
        value={draftNotes}
        onChange={(e) => setDraftNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="text-sm min-h-[48px] resize-none bg-white dark:bg-slate-900 border-indigo-300/70 dark:border-indigo-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
        rows={2}
      />
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          onClick={submit}
          disabled={!draftName.trim() || submitting}
          className="h-7 rounded-full gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
        >
          <Plus className="h-3 w-3" /> Add Medication
        </Button>
      </div>
    </>
  );
}

export function LabAnswerBlock({
  block,
  value,
  onChange,
  isError,
  edit,
}: {
  block: FormBlock;
  value: LabRowValues;
  onChange: (v: LabRowValues) => void;
  isError?: boolean;
  edit: boolean;
}) {
  const layout = block.labLayout ?? "valueUnit";
  const rows = block.labRows?.length
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
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5 text-foreground">
        <FlaskConical className="h-3.5 w-3.5 text-purple-600" />
        {block.label || "Lab Results"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`overflow-x-auto border rounded-xl shadow-xs ${
          isError
            ? "border-red-400 bg-red-50/40 dark:bg-red-950/20"
            : "border-purple-200/80 dark:border-purple-800/70 bg-purple-50/50 dark:bg-purple-950/30"
        }`}
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-purple-200/60 dark:border-purple-800/60 bg-purple-100/60 dark:bg-purple-900/40 px-3 py-2 text-left text-xs font-semibold text-foreground">
                Name
              </th>
              {layout === "valueUnit" ? (
                <>
                  <th className="border-b border-purple-200/60 dark:border-purple-800/60 bg-purple-100/60 dark:bg-purple-900/40 px-3 py-2 text-left text-xs font-semibold text-foreground">
                    Value
                  </th>
                  <th className="border-b border-purple-200/60 dark:border-purple-800/60 bg-purple-100/60 dark:bg-purple-900/40 px-3 py-2 text-left text-xs font-semibold text-foreground">
                    Unit
                  </th>
                </>
              ) : (
                <th className="border-b border-purple-200/60 dark:border-purple-800/60 bg-purple-100/60 dark:bg-purple-900/40 px-3 py-2 text-left text-xs font-semibold text-foreground">
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
                  <td className="border-b border-purple-200/40 dark:border-purple-800/40 px-3 py-2 font-medium text-sm whitespace-nowrap text-foreground">
                    {row.name}
                  </td>
                  {layout === "valueUnit" ? (
                    <>
                      <td className="border-b border-purple-200/40 dark:border-purple-800/40 px-1.5 py-1.5 min-w-[80px]">
                        {edit ? (
                          <input
                            className="w-full h-7 px-2 text-xs border rounded-md bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800/80 text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white dark:focus:bg-slate-950"
                            value={rv.value ?? ""}
                            onChange={(e) =>
                              set(row.id, "value", e.target.value)
                            }
                            placeholder="Value"
                          />
                        ) : (
                          <span className="text-xs text-foreground">{rv.value || "—"}</span>
                        )}
                      </td>
                      <td className="border-b border-purple-200/40 dark:border-purple-800/40 px-1.5 py-1.5 min-w-[90px]">
                        {edit ? (
                          <select
                            className="w-full h-7 px-1.5 text-xs border rounded-md bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800/80 text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                            value={rv.unit ?? row.defaultUnit ?? units[0]}
                            onChange={(e) =>
                              set(row.id, "unit", e.target.value)
                            }
                          >
                            {units.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs text-foreground">
                            {rv.unit ?? row.defaultUnit ?? "—"}
                          </span>
                        )}
                      </td>
                    </>
                  ) : (
                    <td className="border-b border-purple-200/40 dark:border-purple-800/40 px-1.5 py-1.5 min-w-[100px]">
                      {edit ? (
                        <select
                          className="w-full h-7 px-1.5 text-xs border rounded-md bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800/80 text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
                          value={rv.result ?? ""}
                          onChange={(e) =>
                            set(row.id, "result", e.target.value)
                          }
                        >
                          <option value="">Select…</option>
                          {results.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-foreground">{rv.result || "—"}</span>
                      )}
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

export function ProductListenerAnswerBlock({
  block,
  value,
  onChange,
  isError,
  edit,
  handlers,
}: {
  block: FormBlock;
  value: AddedProduct[];
  onChange: (v: AddedProduct[]) => void;
  isError?: boolean;
  edit: boolean;
  handlers?: MedicalBlockHandlers | null;
}) {
  if (handlers?.onOpenProductPicker) {
    return (
      <ProductListenerWithVisitSync
        block={block}
        value={value}
        onChange={onChange}
        isError={isError}
        edit={edit}
        handlers={handlers}
        visitId={handlers.visitId}
        departmentId={handlers.departmentId}
      />
    );
  }

  const remove = (id: string) =>
    onChange(value.filter((item) => item.id !== id));
  return (
    <div className="my-3">
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5 text-foreground">
        <Package className="h-3.5 w-3.5 text-orange-600" />
        {block.label || "Products / Procedures"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`space-y-3 p-3.5 rounded-xl border transition-colors shadow-xs ${
          isError
            ? "border-red-400 bg-red-50/40 dark:bg-red-950/20"
            : "border-orange-200/80 dark:border-orange-800/70 bg-orange-50/50 dark:bg-orange-950/30"
        }`}
      >
        {edit && (
          <ProductDraft
            onAdd={(item) => onChange([...value, item])}
            centered={block.productListenerCenter ?? false}
            btnLabel={block.label || "Add Product"}
          />
        )}
        <EntryList
          emptyLabel="No products selected"
          items={value}
          render={(item) => (
            <div className="flex items-center gap-2 flex-1 min-w-0">
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
            </div>
          )}
          onRemove={edit ? remove : undefined}
        />
      </div>
    </div>
  );
}

function ProductDraft({
  onAdd,
  centered,
  btnLabel,
}: {
  onAdd: (item: AddedProduct) => void;
  centered: boolean;
  btnLabel: string;
}) {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("MEDICAL_ACT");
  const [price, setPrice] = React.useState("");
  const submit = () => {
    if (!name.trim()) return;
    onAdd({
      id: `prod${uid()}`,
      name: name.trim(),
      type,
      qty: 1,
      price: parseFloat(price) || 0,
    });
    setName("");
    setPrice("");
  };
  return (
    <div className="space-y-2">
      <div className={centered ? "flex justify-center" : "flex"}>
        <button
          type="button"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-orange-200/80 dark:border-orange-800/60 bg-white dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-850 text-foreground text-sm font-medium shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4 text-orange-600" />
          {btnLabel}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_120px_auto] gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product / procedure name"
          className="h-8 text-sm bg-white dark:bg-slate-900 border-orange-200/90 dark:border-orange-800/80 shadow-xs focus:bg-white dark:focus:bg-slate-950"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-8 rounded-md border border-orange-200/90 dark:border-orange-800/80 bg-white dark:bg-slate-900 px-3 text-sm text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-orange-400"
        >
          {Object.entries(PTYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="h-8 text-sm bg-white dark:bg-slate-900 border-orange-200/90 dark:border-orange-800/80 shadow-xs focus:bg-white dark:focus:bg-slate-950"
          type="number"
          step="any"
        />
        <Button
          type="button"
          size="sm"
          onClick={submit}
          disabled={!name.trim()}
          className="h-8 gap-1 bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
        >
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>
    </div>
  );
}
