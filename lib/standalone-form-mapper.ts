import type { FormBlock, FormTemplateType, SavedForm } from "@/lib/formbuilder-storage";
import type {
  StandaloneForm,
  StandaloneFormVersion,
} from "@/hooks/standalone-forms/hooks";
import type { StandaloneFormAnswer } from "@/hooks/standalone-forms/visit-answers";

export function mapStandaloneVersionToSavedForm(
  form: Pick<StandaloneForm, "id" | "name" | "type" | "description" | "createdAt" | "updatedAt">,
  version: StandaloneFormVersion,
): SavedForm {
  return {
    id: form.id || version.formId || "",
    name: form.name || "Consultation Form",
    type: (form.type as FormTemplateType) || "CONSULTATION",
    category: undefined,
    version: version.majorVersion ?? 1,
    description: form.description || "",
    blocks: (version.blocks as FormBlock[]) ?? [],
    theme: (version.theme as SavedForm["theme"]) ?? undefined,
    createdAt: form.createdAt || version.createdAt || "",
    updatedAt: form.updatedAt || version.createdAt || "",
  };
}

export function mapStandaloneFormToSavedForm(form: StandaloneForm): SavedForm | null {
  if (!form.activeVersion) return null;
  return mapStandaloneVersionToSavedForm(form, form.activeVersion);
}

export function mapStandaloneAnswerToSavedForm(
  answer: StandaloneFormAnswer,
  fallbackForm?: StandaloneForm | null,
): SavedForm | null {
  const form =
    answer.form ||
    fallbackForm ||
    (answer.formVersion
      ? {
          id: answer.formVersion.formId || "",
          name: "Consultation Form",
          type: "CONSULTATION",
          description: "",
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
        }
      : null);
  const version = answer.formVersion || form && "activeVersion" in form ? form.activeVersion : null;
  const targetVersion = version || answer.formVersion;
  if (!form || !targetVersion) return null;
  return mapStandaloneVersionToSavedForm(form, targetVersion);
}

export function parseStandaloneAnswers(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  let current: unknown = raw;
  if (typeof current === "string") {
    try {
      current = JSON.parse(current);
    } catch {
      return {};
    }
  }
  if (typeof current === "string") {
    try {
      current = JSON.parse(current);
    } catch {
      // ignore
    }
  }
  if (typeof current === "object" && current !== null && !Array.isArray(current)) {
    return current as Record<string, unknown>;
  }
  return {};
}
