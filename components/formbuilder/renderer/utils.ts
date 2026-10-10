import type { FormBlock } from "@/lib/formbuilder-storage";
import { shouldShowBlock, type ProductItem } from "@/lib/formbuilder-conditional";
import type { FormAnswers, LabRowValues } from "./types";
import type { MedicalBlockHandlers } from "../extensions/types";

export const INLINE_WIDTH: Record<string, string> = {
  xs: "w-14",
  sm: "w-24",
  md: "w-40",
  lg: "w-56",
  full: "w-full",
};

export function uid() {
  return `_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export function splitInitialAnswers(initialAnswers: FormAnswers = {}) {
  const blockAnswers: FormAnswers = {};
  const inlineAnswers: Record<string, string> = {};

  Object.entries(initialAnswers).forEach(([key, value]) => {
    if (key.includes("__")) {
      inlineAnswers[key] =
        typeof value === "string" ? value : String(value ?? "");
      return;
    }
    blockAnswers[key] = value;
  });

  return { blockAnswers, inlineAnswers };
}

/**
 * Clinical list blocks (diagnostics, symptoms, medications, products) render
 * from live visit-department data supplied through `MedicalBlockHandlers` —
 * their answers are never written to `answers[block.id]` (and are stripped on
 * save). Validation must therefore read the handler-provided live lists when
 * present, otherwise populated required blocks always report as empty.
 */
function resolveClinicalList(
  block: FormBlock,
  handlers?: MedicalBlockHandlers | null,
): unknown[] | null {
  if (!handlers) return null;
  switch (block.type) {
    case "diagnostic_record": {
      const all = handlers.diagnostics;
      if (!Array.isArray(all)) return null;
      return all.filter((d) => (d.type ?? "FINAL") === "FINAL");
    }
    case "hypothesis_record": {
      const all = handlers.diagnostics;
      if (!Array.isArray(all)) return null;
      return all.filter((d) => d.type === "HYPOTHESIS");
    }
    case "symptom_listener":
      return Array.isArray(handlers.symptoms) ? handlers.symptoms : null;
    case "medication_full":
      return Array.isArray(handlers.medicationsFull)
        ? handlers.medicationsFull
        : null;
    case "medication_mini":
      return Array.isArray(handlers.medicationsMini)
        ? handlers.medicationsMini
        : null;
    case "product_listener":
      return Array.isArray(handlers.productActions)
        ? handlers.productActions
        : null;
    default:
      return null;
  }
}

export function isBlockViolating(
  block: FormBlock,
  answers: FormAnswers,
  handlers?: MedicalBlockHandlers | null,
): boolean {
  const minChars = block.minChars ?? (block as any).minLength;
  const hasMinChars = typeof minChars === "number" && minChars > 0;

  if (!block.required && !hasMinChars) return false;

  const clinical = resolveClinicalList(block, handlers);
  if (clinical) {
    return clinical.length === 0;
  }

  const v = answers[block.id];
  if (v === undefined || v === null) return true;
  switch (block.type) {
    case "text_input":
    case "textarea_input":
    case "number_input": {
      const strVal = String(v).trim();
      if (!strVal) return !!block.required;
      if (hasMinChars && strVal.length < minChars) return true;
      return false;
    }
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
    case "hypothesis_record":
    case "symptom_listener":
    case "medication_full":
    case "medication_mini":
    case "product_listener":
    case "file_upload":
      return !Array.isArray(v) || (v as unknown[]).length === 0;
    case "lab_record": {
      const typed = v as LabRowValues | undefined;
      if (!typed) return true;
      return !Object.values(typed).some((rv) => rv.value || rv.result);
    }
    default:
      return false;
  }
}

export function getBlockErrorMessage(
  block: FormBlock,
  answers: FormAnswers,
  handlers?: MedicalBlockHandlers | null,
): string | undefined {
  if (!isBlockViolating(block, answers, handlers)) return undefined;
  const v = answers[block.id];
  const minChars = block.minChars ?? (block as any).minLength;
  if (typeof minChars === "number" && minChars > 0) {
    const strVal = v !== undefined && v !== null ? String(v).trim() : "";
    if (!strVal) {
      return block.type === "number_input"
        ? `This field is required (minimum ${minChars} digits).`
        : `This field is required (minimum ${minChars} characters).`;
    }
    if (strVal.length < minChars) {
      return block.type === "number_input"
        ? `Minimum ${minChars} digits required (currently ${strVal.length}).`
        : `Minimum ${minChars} characters required (currently ${strVal.length}).`;
    }
  }
  if (block.type === "signature") {
    return "Signature is required.";
  }
  if (block.type === "file_upload") {
    return "At least one file is required.";
  }
  return "This field is required.";
}

export function collectAnswerableBlocks(blocks: FormBlock[]): FormBlock[] {
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

export function shouldRenderBlock(
  block: FormBlock,
  answers: FormAnswers,
  getBlockHandlers?: (block: FormBlock) => MedicalBlockHandlers | null | undefined,
  allBlocks?: FormBlock[],
) {
  const cr = block.conditionalRendering;
  if (!cr) return true;

  const fieldActions: Record<string, ProductItem[]> = {};
  const effectiveAnswers: Record<string, unknown> = { ...answers };

  if (getBlockHandlers && cr.dependsOn) {
    const parentBlock = allBlocks?.find((b) => b.id === cr.dependsOn) ?? {
      id: cr.dependsOn,
      type: "product_listener" as const,
    };
    const handlers = getBlockHandlers(parentBlock);
    if (handlers?.productActions) {
      fieldActions[cr.dependsOn] = handlers.productActions.map((a) => ({
        id: a.id,
        catalogProductId: a.rawData?.product?.id || a.rawData?.id || (a as any).catalogProductId,
        backendId: a.backendId,
        name: a.name || a.rawData?.product?.name,
        type: a.type,
        rawData: a.rawData,
        product: a.rawData?.product,
      }));
    }
    if (handlers?.diagnostics) {
      const diagnosisType = parentBlock.type === "hypothesis_record" ? "HYPOTHESIS" : "FINAL";
      effectiveAnswers[cr.dependsOn] = handlers.diagnostics.filter(
        (diagnosis) => (diagnosis.type ?? "FINAL") === diagnosisType,
      );
    }
    if (handlers?.medicationsFull && handlers.medicationsFull.length > 0) {
      effectiveAnswers[cr.dependsOn] = handlers.medicationsFull;
    }
    if (handlers?.medicationsMini && handlers.medicationsMini.length > 0) {
      effectiveAnswers[cr.dependsOn] = handlers.medicationsMini;
    }
  }

  return shouldShowBlock(block, effectiveAnswers, fieldActions);
}

export function replacePlaceholders(
  text: string,
  context: { doctor: any; clinicProfile: any },
) {
  if (!text) return "";
  let result = text;

  const mapping: Record<string, string> = {
    "{{doctor_name}}": context.doctor?.fullName || "",
    "{{doctor_title}}": context.doctor?.title || "",
    "{{clinic_name}}": context.clinicProfile?.name || "",
    "{{clinic_address}}": context.clinicProfile?.address || "",
    "{{clinic_phone}}": context.clinicProfile?.phone || "",
    "{{date_today}}": new Date().toLocaleDateString(),
  };

  Object.entries(mapping).forEach(([key, val]) => {
    result = result.split(key).join(val);
  });

  return result;
}
