import type { FormBlock } from "@/lib/formbuilder-storage";
import { shouldShowBlock } from "@/lib/formbuilder-conditional";
import type { FormAnswers, LabRowValues } from "./types";

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

export function splitInitialAnswers(initialAnswers?: FormAnswers) {
  const blockAnswers: FormAnswers = {};
  const inlineAnswers: Record<string, string> = {};

  Object.entries(initialAnswers ?? {}).forEach(([key, value]) => {
    if (key.includes("__")) {
      inlineAnswers[key] =
        typeof value === "string" ? value : String(value ?? "");
      return;
    }
    blockAnswers[key] = value;
  });

  return { blockAnswers, inlineAnswers };
}

export function isBlockViolating(
  block: FormBlock,
  answers: FormAnswers,
): boolean {
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

export function shouldRenderBlock(block: FormBlock, answers: FormAnswers) {
  return shouldShowBlock(block, answers);
}
