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
    id: form.id,
    name: form.name,
    type: form.type as FormTemplateType,
    category: undefined,
    version: version.majorVersion,
    description: form.description,
    blocks: (version.blocks as FormBlock[]) ?? [],
    theme: (version.theme as SavedForm["theme"]) ?? undefined,
    createdAt: form.createdAt,
    updatedAt: form.updatedAt,
  };
}

export function mapStandaloneFormToSavedForm(form: StandaloneForm): SavedForm | null {
  if (!form.activeVersion) return null;
  return mapStandaloneVersionToSavedForm(form, form.activeVersion);
}

export function mapStandaloneAnswerToSavedForm(answer: StandaloneFormAnswer): SavedForm | null {
  if (!answer.form || !answer.formVersion) return null;
  return mapStandaloneVersionToSavedForm(answer.form, answer.formVersion);
}

export function parseStandaloneAnswers(raw: unknown): Record<string, unknown> {
  if (!raw) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }
  return {};
}
