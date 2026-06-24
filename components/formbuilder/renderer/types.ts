import type { FormBlock, InlineAnswerField, LabRow, LayoutColumn, SavedForm, TableCell } from "@/lib/formbuilder-storage";

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
  initialAnswers?: FormAnswers;
  edit?: boolean;
  mode?: "full" | "wizard";
}

export interface DiagEntry {
  id: string;
  diagnosis: string;
  description?: string;
}

export interface MedFullEntry {
  id: string;
  name: string;
  frequency: string;
  amount: string;
  days: string;
  notes?: string;
}

export interface MedMiniEntry {
  id: string;
  name: string;
  notes?: string;
}

export type LabRowValues = Record<
  string,
  { value?: string; unit?: string; result?: string }
>;

export interface AddedProduct {
  id: string;
  name: string;
  type: string;
  qty: number;
  price: number;
}

export interface AnswerBlockProps {
  block: FormBlock;
  answers: FormAnswers;
  onAnswerChange: (blockId: string, value: unknown) => void;
  showErrors: boolean;
  inlineAnswers: Record<string, string>;
  onInlineChange: (key: string, value: string) => void;
  edit: boolean;
  context?: { doctor: any; clinicProfile: any };
}

export type { FormBlock, InlineAnswerField, LabRow, LayoutColumn, SavedForm, TableCell };
