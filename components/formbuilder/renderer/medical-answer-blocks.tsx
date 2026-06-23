"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FlaskConical,
  Package,
  Pill,
  Plus,
  Stethoscope,
  Trash2,
} from "lucide-react";
import type { FormBlock } from "@/lib/formbuilder-storage";
import type {
  AddedProduct,
  DiagEntry,
  FormAnswers,
  LabRowValues,
  MedFullEntry,
  MedMiniEntry,
} from "./types";
import { uid } from "./utils";

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

export function DiagnosticAnswerBlock({
  block,
  value,
  onChange,
  isError,
  edit,
}: {
  block: FormBlock;
  value: DiagEntry[];
  onChange: (v: DiagEntry[]) => void;
  isError?: boolean;
  edit: boolean;
}) {
  const add = (diagnosis: string, description?: string) => {
    const name = diagnosis.trim();
    if (!name) return;
    onChange([
      ...value,
      {
        id: `d${uid()}`,
        diagnosis: name,
        description: description?.trim() || undefined,
      },
    ]);
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
        className={`space-y-2 p-3 rounded-lg border ${isError ? "border-red-400 bg-red-50/20 dark:bg-red-950/10" : "border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10"}`}
      >
        {edit && (
          <DiagnosticDraft
            onAdd={add}
            placeholder={block.placeholder || "Enter diagnosis name…"}
          />
        )}
        <EntryList
          emptyLabel="No diagnoses"
          items={value}
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
  onAdd: (diagnosis: string, description?: string) => void;
  placeholder: string;
}) {
  const [draftDiag, setDraftDiag] = React.useState("");
  const [draftDesc, setDraftDesc] = React.useState("");
  const submit = () => {
    if (!draftDiag.trim()) return;
    onAdd(draftDiag, draftDesc);
    setDraftDiag("");
    setDraftDesc("");
  };
  return (
    <>
      <Input
        value={draftDiag}
        onChange={(e) => setDraftDiag(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
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
          onClick={submit}
          disabled={!draftDiag.trim()}
          className="h-7 rounded-full gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
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
}: {
  block: FormBlock;
  value: MedFullEntry[];
  onChange: (v: MedFullEntry[]) => void;
  isError?: boolean;
  edit: boolean;
}) {
  const remove = (id: string) => onChange(value.filter((e) => e.id !== id));
  return (
    <div className="my-3">
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
        <Pill className="h-3.5 w-3.5 text-blue-600" />
        {block.label || "Medications"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`space-y-2 p-3 rounded-lg border ${isError ? "border-red-400 bg-red-50/20 dark:bg-red-950/10" : "border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10"}`}
      >
        {edit && (
          <MedFullDraft
            onAdd={(draft) =>
              onChange([
                ...value,
                {
                  id: `mf${uid()}`,
                  ...draft,
                  notes: draft.notes?.trim() || undefined,
                },
              ])
            }
            placeholder={block.placeholder || "Medication name…"}
          />
        )}
        <EntryList
          emptyLabel="No medications"
          items={value}
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
  onAdd: (v: Omit<MedFullEntry, "id">) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = React.useState({
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
  const submit = () => {
    if (!canAdd) return;
    onAdd(draft);
    setDraft({ name: "", frequency: "", amount: "", days: "", notes: "" });
  };
  return (
    <>
      <Input
        value={draft.name}
        onChange={upd("name")}
        placeholder={placeholder}
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
          onClick={submit}
          disabled={!canAdd}
          className="h-7 rounded-full gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white"
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
}: {
  block: FormBlock;
  value: MedMiniEntry[];
  onChange: (v: MedMiniEntry[]) => void;
  isError?: boolean;
  edit: boolean;
}) {
  const remove = (id: string) => onChange(value.filter((e) => e.id !== id));
  return (
    <div className="my-3">
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
        <Pill className="h-3.5 w-3.5 text-indigo-600" />
        {block.label || "Medications"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`space-y-2 p-3 rounded-lg border ${isError ? "border-red-400 bg-red-50/20 dark:bg-red-950/10" : "border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/10"}`}
      >
        {edit && (
          <MedMiniDraft
            onAdd={(name, notes) =>
              onChange([
                ...value,
                {
                  id: `mm${uid()}`,
                  name: name.trim(),
                  notes: notes?.trim() || undefined,
                },
              ])
            }
            placeholder={block.placeholder || "Medication name…"}
          />
        )}
        <EntryList
          emptyLabel="No medications"
          items={value}
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
  onAdd: (name: string, notes?: string) => void;
  placeholder: string;
}) {
  const [draftName, setDraftName] = React.useState("");
  const [draftNotes, setDraftNotes] = React.useState("");
  const submit = () => {
    if (!draftName.trim()) return;
    onAdd(draftName, draftNotes);
    setDraftName("");
    setDraftNotes("");
  };
  return (
    <>
      <Input
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
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
          onClick={submit}
          disabled={!draftName.trim()}
          className="h-7 rounded-full gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
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
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
        <FlaskConical className="h-3.5 w-3.5 text-purple-600" />
        {block.label || "Lab Results"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`overflow-x-auto border rounded-lg ${isError ? "border-red-400 bg-red-50/20 dark:bg-red-950/10" : "border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/10"}`}
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
                        {edit ? (
                          <input
                            className="w-full h-7 px-2 text-xs border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
                            value={rv.value ?? ""}
                            onChange={(e) =>
                              set(row.id, "value", e.target.value)
                            }
                            placeholder="Value"
                          />
                        ) : (
                          <span className="text-xs">{rv.value || "—"}</span>
                        )}
                      </td>
                      <td className="border-b border-border/50 px-1 py-1 min-w-[90px]">
                        {edit ? (
                          <select
                            className="w-full h-7 px-1 text-xs border rounded bg-background focus:outline-none"
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
                          <span className="text-xs">
                            {rv.unit ?? row.defaultUnit ?? "—"}
                          </span>
                        )}
                      </td>
                    </>
                  ) : (
                    <td className="border-b border-border/50 px-1 py-1 min-w-[100px]">
                      {edit ? (
                        <select
                          className="w-full h-7 px-1 text-xs border rounded bg-background focus:outline-none"
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
                        <span className="text-xs">{rv.result || "—"}</span>
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
}: {
  block: FormBlock;
  value: AddedProduct[];
  onChange: (v: AddedProduct[]) => void;
  isError?: boolean;
  edit: boolean;
}) {
  const remove = (id: string) =>
    onChange(value.filter((item) => item.id !== id));
  return (
    <div className="my-3">
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
        <Package className="h-3.5 w-3.5 text-orange-600" />
        {block.label || "Products / Procedures"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`space-y-2 p-3 rounded-lg border ${isError ? "border-red-400 bg-red-50/20 dark:bg-red-950/10" : "border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/10"}`}
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
      price: Number(price) || 0,
    });
    setName("");
    setPrice("");
  };
  return (
    <div className="space-y-2">
      <div className={centered ? "flex justify-center" : "flex"}>
        <button
          type="button"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-border bg-card/80 text-sm shadow-sm"
        >
          <Plus className="h-4 w-4" />
          {btnLabel}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_120px_auto] gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product / procedure name"
          className="h-8 text-sm"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-8 rounded-md border border-input bg-background px-3 text-sm"
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
          className="h-8 text-sm"
          type="number"
        />
        <Button
          type="button"
          size="sm"
          onClick={submit}
          disabled={!name.trim()}
          className="h-8 gap-1"
        >
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>
    </div>
  );
}

function EntryList<T extends { id: string }>({
  items,
  render,
  onRemove,
  emptyLabel,
}: {
  items: T[];
  render: (item: T) => React.ReactNode;
  onRemove?: (id: string) => void;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground italic">{emptyLabel}</p>;
  }
  return (
    <div className="space-y-1.5 pt-2 border-t border-border/50">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-2 px-2.5 py-1.5 rounded-md border border-border bg-background text-sm"
        >
          {render(item)}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="mt-0.5 p-0.5 text-muted-foreground hover:text-destructive shrink-0"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

import * as React from "react";
