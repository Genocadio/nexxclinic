"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  FlaskConical,
  Loader2,
  Package,
  Pill,
  Plus,
  Search,
  Stethoscope,
} from "lucide-react";
import type { FormBlock } from "@/lib/formbuilder-storage";
import { useIcd11DiseaseSearch, useSnomedSymptomSearch } from "@/hooks/icd11";
import type { MedicalBlockHandlers } from "../extensions/types";
import { ProductListenerWithVisitSync } from "./product-listener-sync";
import { EntryList, PTYPE_COLOR, PTYPE_LABEL } from "./medical-shared";
import type {
  AddedProduct,
  DiagEntry,
  LabRowValues,
  MedFullEntry,
  MedMiniEntry,
  SymptomEntry,
} from "./types";
import { uid } from "./utils";

function bodySystemLabels(systems: string[] | null | undefined): string[] {
  if (!systems?.length) return [];
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const system of systems) {
    const label = system
      .trim()
      .replace(/^Finding of\s+/i, "")
      .replace(/\s+-\s+finding$/i, "")
      .replace(/\s+finding$/i, "");
    if (!label || seen.has(label.toLowerCase())) continue;
    seen.add(label.toLowerCase());
    labels.push(label);
  }
  return labels;
}

function alternateNames(synonyms: string[] | null | undefined, max = 3): string[] {
  if (!synonyms?.length) return [];
  const seen = new Set<string>();
  const names: string[] = [];
  for (const synonym of synonyms) {
    const name = synonym.trim();
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    names.push(name);
    if (names.length >= max) break;
  }
  return names;
}

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
  return (
    <DiagnosisAnswerBlock
      block={block}
      value={value}
      onChange={onChange}
      isError={isError}
      edit={edit}
      handlers={handlers}
      diagnosisType="FINAL"
    />
  );
}

export function SymptomListenerAnswerBlock({
  block,
  value,
  onChange,
  isError,
  edit,
  handlers,
}: {
  block: FormBlock;
  value: SymptomEntry[];
  onChange: (v: SymptomEntry[]) => void;
  isError?: boolean;
  edit: boolean;
  handlers?: MedicalBlockHandlers | null;
}) {
  const entries = handlers?.symptoms ?? (Array.isArray(value) ? value : []);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const { suggestions, loading, error } = useSnomedSymptomSearch(debouncedQuery);
  React.useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(searchTerm.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [searchTerm]);
  const searchPending = searchTerm.trim() !== debouncedQuery.trim();
  const canAdd = handlers ? Boolean(handlers.onAddSymptom) : edit;
  const canRemove = handlers ? Boolean(handlers.onRemoveSymptom) : edit;
  const canEditNotes = handlers ? Boolean(handlers.onUpdateSymptomNotes) : edit;

  const add = async (selectedName = searchTerm, sonomedId?: string) => {
    const name = selectedName.trim();
    if (!name || submitting) return;
    setSubmitting(true);
    try {
      const ok = handlers?.onAddSymptom
        ? await handlers.onAddSymptom(name, sonomedId)
        : true;
      if (ok) {
        if (!handlers) {
          onChange([...entries, { id: `s${uid()}`, symptom: name, sonomedId }]);
        }
        setSearchTerm("");
        setDebouncedQuery("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const addFromSuggestion = async (name: string, sonomedId?: string) => {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      const ok = handlers?.onAddSymptom
        ? await handlers.onAddSymptom(name, sonomedId)
        : true;
      if (ok) {
        onChange([...entries, { id: `s${uid()}`, symptom: name, sonomedId }]);
        setSearchTerm("");
        setDebouncedQuery("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (handlers?.onRemoveSymptom) {
      await handlers.onRemoveSymptom(id);
      return;
    }
    onChange(entries.filter((entry) => entry.id !== id));
  };

  const updateNotes = async (id: string, notes: string): Promise<boolean> => {
    if (handlers?.onUpdateSymptomNotes) {
      return handlers.onUpdateSymptomNotes(id, notes);
    }
    onChange(entries.map((entry) => (
      entry.id === id ? { ...entry, notes } : entry
    )));
    return true;
  };

  return (
    <div className="my-3">
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
        <Stethoscope className="h-3.5 w-3.5 text-blue-600" />
        {block.label || "Signs and symptoms"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div className={`space-y-3 rounded-xl border p-3.5 ${isError ? "border-red-400" : "border-blue-200 bg-blue-50/40 dark:border-blue-800 dark:bg-blue-950/20"}`}>
        {canAdd && (
          <>
            <div className="relative">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void add();
                  }
                }}
                placeholder={block.placeholder || "Search a sign or symptom…"}
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={searchTerm.trim().length >= 2}
                className="h-8 text-sm pr-8 bg-background"
              />
              {loading ? (
                <Loader2 className="absolute right-2.5 top-2 h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Search className="absolute right-2.5 top-2 h-4 w-4 text-muted-foreground" />
              )}
              {searchTerm.trim().length >= 2 && (
                <div
                  role="listbox"
                  aria-label="Symptom suggestions"
                  className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-border bg-background shadow-lg"
                >
                  {error ? (
                    <div className="border-b border-border/50 px-3 py-2 text-xs text-destructive">
                      Symptom search is unavailable.
                    </div>
                  ) : searchPending || loading ? (
                    <p className="px-3 py-2 text-xs text-muted-foreground">
                      Searching symptoms…
                    </p>
                  ) : suggestions.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-muted-foreground">
                      No symptom matches.
                    </p>
                  ) : (
                    suggestions.map((suggestion, index) => {
                      const regions = bodySystemLabels(suggestion.bodySystem);
                      const alternate = alternateNames(suggestion.synonyms);
                      const disabled = submitting || !suggestion.preferred;
                      const addName = (name?: string) => {
                        if (!name || disabled) return;
                        void add(name, suggestion.id || undefined);
                      };
                      return (
                        <div
                          key={suggestion.id || `${suggestion.preferred}-${index}`}
                          role="option"
                          aria-selected={false}
                          aria-disabled={disabled}
                          tabIndex={disabled ? -1 : 0}
                          onClick={() => addName(suggestion.preferred)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              addName(suggestion.preferred);
                            }
                          }}
                          className={`flex w-full flex-col gap-1 border-b border-border/50 px-3 py-2 text-left text-sm last:border-0 ${
                            disabled
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer hover:bg-muted/60"
                          }`}
                        >
                          <span className="flex w-full items-center gap-2">
                            <span className="min-w-0 flex-1 truncate font-medium">
                              {suggestion.preferred}
                            </span>
                            {regions.length > 0 && (
                              <span
                                className="max-w-[55%] shrink-0 truncate text-xs text-muted-foreground"
                                title={regions.join(" · ")}
                              >
                                {regions.join(" · ")}
                              </span>
                            )}
                          </span>
                          {alternate.length > 0 && (
                            <span className="flex w-full flex-wrap items-center gap-1">
                              {alternate.map((name) => (
                                <button
                                  key={name}
                                  type="button"
                                  title={`Add “${name}” as symptom`}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    addName(name);
                                  }}
                                  className="max-w-[48%] truncate rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                                >
                                  {name}
                                </button>
                              ))}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                  {!error && !searchPending && !loading && (
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      disabled={submitting}
                      onClick={() => void add(searchTerm.trim())}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-blue-700 hover:bg-muted/60 disabled:opacity-50 dark:text-blue-300"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add “{searchTerm.trim()}” as symptom
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        <EntryList
          emptyLabel="No signs or symptoms recorded"
          items={entries}
          render={(entry) => (
            <div className="flex-1 min-w-0">
              <p className="font-medium break-words">{entry.symptom}</p>
              <DiagnosisNotesEditor
                notes={entry.notes ?? ""}
                canEdit={canEditNotes}
                entryLabel="symptom"
                onSave={(notes) => updateNotes(entry.id, notes)}
              />
            </div>
          )}
          onRemove={canRemove ? remove : undefined}
        />
      </div>
    </div>
  );
}

export function HypothesisAnswerBlock({
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
  return (
    <DiagnosisAnswerBlock
      block={block}
      value={value}
      onChange={onChange}
      isError={isError}
      edit={edit}
      handlers={handlers}
      diagnosisType="HYPOTHESIS"
    />
  );
}

function DiagnosisAnswerBlock({
  block,
  value,
  onChange,
  isError,
  edit,
  handlers,
  diagnosisType,
}: {
  block: FormBlock;
  value: DiagEntry[];
  onChange: (v: DiagEntry[]) => void;
  isError?: boolean;
  edit: boolean;
  handlers?: MedicalBlockHandlers | null;
  diagnosisType: "FINAL" | "HYPOTHESIS";
}) {
  const answerEntries = Array.isArray(value) ? value : [];
  const diagnosisItems = handlers?.diagnostics ?? answerEntries;
  const items = diagnosisItems.filter((entry) => (entry.type ?? "FINAL") === diagnosisType);
  const isHypothesis = diagnosisType === "HYPOTHESIS";
  const entryLabel = isHypothesis ? "hypothesis" : "diagnosis";
  const add = async (
    diagnosis: string,
    icd11Code?: string,
  ): Promise<boolean> => {
    const name = diagnosis.trim();
    if (!name) return false;
    if (handlers?.onAddDiagnosis) {
      return handlers.onAddDiagnosis(name, icd11Code, diagnosisType);
    }
    onChange([
      ...answerEntries,
      {
        id: `d${uid()}`,
        diagnosis: name,
        icd11Code,
        type: diagnosisType,
        notes: "",
      },
    ]);
    return true;
  };
  const remove = async (id: string) => {
    if (handlers?.onRemoveDiagnosis) {
      await handlers.onRemoveDiagnosis(id);
      return;
    }
    onChange(answerEntries.filter((e) => e.id !== id));
  };
  const updateNotes = async (id: string, notes: string): Promise<boolean> => {
    if (handlers?.onUpdateDiagnosisNotes) {
      return handlers.onUpdateDiagnosisNotes(id, notes);
    }
    onChange(answerEntries.map((entry) => (
      entry.id === id ? { ...entry, notes } : entry
    )));
    return true;
  };

  const canAdd = handlers ? Boolean(handlers.onAddDiagnosis) : edit;
  const canRemove = handlers ? Boolean(handlers.onRemoveDiagnosis) : edit;
  const canEditNotes = handlers ? Boolean(handlers.onUpdateDiagnosisNotes) : edit;

  return (
    <div className="my-3">
      <label className="text-sm leading-5 font-medium flex items-center gap-1.5 mb-1.5 text-foreground">
        <Stethoscope className="h-3.5 w-3.5 text-emerald-600" />
        {block.label || (isHypothesis ? "Hypotheses" : "Diagnoses")}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`space-y-3 p-3.5 rounded-xl border transition-colors shadow-xs ${
          isError
            ? "border-red-400 bg-red-50/40 dark:bg-red-950/20"
            : "border-emerald-200/80 dark:border-emerald-800/70 bg-emerald-50/50 dark:bg-emerald-950/30"
        }`}
      >
        {canAdd && (
          <DiagnosticDraft
            onAdd={add}
            placeholder={block.placeholder || "Search disease or ICD-11 code…"}
            entryLabel={entryLabel}
          />
        )}
        <EntryList
          emptyLabel={isHypothesis ? "No hypotheses" : "No final diagnoses"}
          items={items}
          render={(e) => (
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className="font-medium leading-snug break-words">
                  {e.diagnosis}
                </p>
                {e.icd11Code && (
                  <span className="text-xs text-emerald-700 dark:text-emerald-300">
                    ICD-11 {e.icd11Code}
                  </span>
                )}
              </div>
              {!isHypothesis && (
                <DiagnosisNotesEditor
                  notes={e.notes ?? ""}
                  canEdit={canEditNotes}
                  onSave={(notes) => updateNotes(e.id, notes)}
                />
              )}
            </div>
          )}
          onRemove={canRemove ? remove : undefined}
        />
      </div>
    </div>
  );
}

function DiagnosticDraft({
  onAdd,
  placeholder,
  entryLabel,
}: {
  onAdd: (diagnosis: string, icd11Code?: string) => Promise<boolean>;
  placeholder: string;
  entryLabel: "diagnosis" | "hypothesis";
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const { suggestions, loading, error } = useIcd11DiseaseSearch(debouncedQuery);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(searchTerm), 250);
    return () => window.clearTimeout(timeout);
  }, [searchTerm]);
  const searchPending = searchTerm.trim() !== debouncedQuery.trim();

  const addDiagnosis = async (
    diagnosis: string,
    icd11Code?: string,
  ) => {
    if (!diagnosis.trim() || submitting) return;
    setSubmitting(true);
    try {
      if (await onAdd(diagnosis, icd11Code)) {
        setSearchTerm("");
        setDebouncedQuery("");
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className="relative">
        <div className="relative">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void addDiagnosis(searchTerm);
              }
            }}
            placeholder={placeholder}
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={searchTerm.trim().length >= 2}
            className="h-8 text-sm pr-8 bg-white dark:bg-slate-900 border-emerald-300/70 dark:border-emerald-700/70 shadow-xs focus:bg-white dark:focus:bg-slate-950"
          />
          {loading ? (
            <Loader2 className="absolute right-2.5 top-2 h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="absolute right-2.5 top-2 h-4 w-4 text-muted-foreground" />
          )}
        </div>
        {searchTerm.trim().length >= 2 && (
          <div
            role="listbox"
            aria-label="ICD-11 disease suggestions"
            className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-border bg-background shadow-lg"
          >
            {error ? (
              <div className="border-b border-border/50 px-3 py-2 text-xs text-destructive">
                Disease search is unavailable.
              </div>
            ) : searchPending || loading ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                Searching diseases…
              </p>
            ) : suggestions.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                No ICD-11 matches.
              </p>
            ) : (
              suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id ?? `${suggestion.code}-${index}`}
                  type="button"
                  role="option"
                  aria-selected={false}
                  disabled={submitting || !suggestion.title}
                  onClick={() => {
                    if (suggestion.title) {
                      void addDiagnosis(suggestion.title, suggestion.code ?? undefined);
                    }
                  }}
                  className="flex w-full items-center gap-2 border-b border-border/50 px-3 py-2 text-left text-sm last:border-0 hover:bg-muted/60 disabled:opacity-50"
                >
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {suggestion.title}
                  </span>
                  {suggestion.code && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {suggestion.code}
                    </span>
                  )}
                </button>
              ))
            )}
            <button
              type="button"
              role="option"
              aria-selected={false}
              disabled={submitting}
              onClick={() => void addDiagnosis(searchTerm.trim())}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-emerald-700 hover:bg-muted/60 disabled:opacity-50 dark:text-emerald-300"
            >
              <Plus className="h-3.5 w-3.5" />
              Add “{searchTerm.trim()}” as {entryLabel}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function DiagnosisNotesEditor({
  notes,
  canEdit,
  onSave,
  entryLabel = "diagnosis",
}: {
  notes: string;
  canEdit: boolean;
  onSave: (notes: string) => Promise<boolean>;
  entryLabel?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(notes);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => setDraft(notes), [notes]);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (await onSave(draft.trim())) setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  if (!canEdit) {
    return notes ? (
      <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">
        {notes}
      </p>
    ) : null;
  }

  return (
    <div className="mt-1">
      {notes && !open && (
        <p className="mb-1 whitespace-pre-wrap text-xs text-muted-foreground">
          {notes}
        </p>
      )}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-300"
        >
          {notes ? "Edit notes" : "Add notes"}
        </button>
      ) : (
        <div className="flex items-start gap-2">
          <Textarea
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Add notes for this ${entryLabel}…`}
            rows={2}
            className="min-h-[52px] resize-y text-xs"
          />
          <Button
            type="button"
            size="icon"
            aria-label={`Save ${entryLabel} notes`}
            title="Save notes"
            disabled={saving}
            onClick={() => void save()}
            className="h-8 w-8 shrink-0 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
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
  const editMedication = async (id: string) => {
    const current = items.find((item) => item.id === id);
    if (!current || !handlers?.onUpdateMedication) return;
    const name = window.prompt("Medication name", current.name);
    if (name == null || !name.trim()) return;
    const instructions = window.prompt(
      "Instructions",
      [current.frequency, current.amount, current.days, current.notes].filter(Boolean).join(" · "),
    );
    if (instructions == null || !instructions.trim()) return;
    await handlers.onUpdateMedication(id, name.trim(), instructions.trim());
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
  const canAdd = handlers ? Boolean(handlers.onAddMedicationFull) : edit;

  return (
    <div className="my-3">
      <label className="text-sm leading-5 font-medium flex items-center gap-1.5 mb-1.5 text-foreground">
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
        {canAdd && (
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
          onEdit={edit && handlers?.onUpdateMedication ? (id) => void editMedication(id) : undefined}
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
  const editMedication = async (id: string) => {
    const current = items.find((item) => item.id === id);
    if (!current || !handlers?.onUpdateMedication) return;
    const name = window.prompt("Medication name", current.name);
    if (name == null || !name.trim()) return;
    const instructions = window.prompt("Notes", current.notes || "");
    if (instructions == null) return;
    await handlers.onUpdateMedication(id, name.trim(), instructions.trim() || "No additional notes");
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
  const canAdd = handlers ? Boolean(handlers.onAddMedicationMini) : edit;

  return (
    <div className="my-3">
      <label className="text-sm leading-5 font-medium flex items-center gap-1.5 mb-1.5 text-foreground">
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
        {canAdd && (
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
          onEdit={edit && handlers?.onUpdateMedication ? (id) => void editMedication(id) : undefined}
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
      <label className="text-sm leading-5 font-medium flex items-center gap-1.5 mb-1.5 text-foreground">
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
  // Any consultation/visit context (handlers present) must use the visit-synced
  // listener — even when the picker is unavailable (locked / read-only) — so we
  // never fall back to the local manual-entry draft which doesn't hit the visit.
  if (handlers && (handlers.onAddProduct || handlers.productActions)) {
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
      <label className="text-sm leading-5 font-medium flex items-center gap-1.5 mb-1.5 text-foreground">
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
          <div
            className={
              block.productListenerCenter ? "flex justify-center" : "flex"
            }
          >
            <Button
              type="button"
              variant="outline"
              disabled
              title="Products are picked from the catalog during a consultation"
              className="inline-flex h-9 px-4 rounded-xl gap-2 border-orange-200/80 dark:border-orange-800/60 bg-white dark:bg-slate-900 text-foreground text-sm font-medium shadow-xs"
            >
              <Plus className="h-4 w-4 text-orange-600" />
              {block.label || "Add Product"}
            </Button>
          </div>
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
                  className={`text-[11px] px-1.5 py-0.5 rounded font-medium shrink-0 ${PTYPE_COLOR[item.type] ?? "bg-muted text-muted-foreground"}`}
                >
                  {PTYPE_LABEL[item.type] ?? item.type}
                </span>
              )}
              <span className="text-xs font-semibold tabular-nums text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5 leading-none shrink-0">
                ×{item.qty ?? 1}
              </span>
            </div>
          )}
          onRemove={edit ? remove : undefined}
        />
      </div>
    </div>
  );
}
