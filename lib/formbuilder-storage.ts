// Form Builder – core types and localStorage persistence
// Not department-based. Forms are identified only by id and name.

export type BlockType =
  | "heading1"
  | "heading2"
  | "heading3"
  | "paragraph"
  | "divider"
  | "spacer"
  | "text_input"
  | "textarea_input"
  | "number_input"
  | "date_input"
  | "checkbox_single"
  | "checkbox_group"
  | "radio_group"
  | "select_input"
  | "signature"
  | "table"
  | "diagnostic_record"
  | "medication_full"
  | "medication_mini"
  | "lab_record"
  | "product_listener"
  | "layout";

export interface FormBlock {
  id: string;
  type: BlockType;
  /** Raw text content for heading/paragraph. Supports {{placeholder_key}} tokens. */
  content?: string;
  /** Text alignment for heading/paragraph */
  align?: "left" | "center" | "right";
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  /** Label for input-type blocks */
  label?: string;
  /** Input placeholder hint */
  placeholder?: string;
  required?: boolean;
  /** Options list for checkbox_group, radio_group, select_input */
  options?: string[];
  /** Table config */
  tableRows?: number;
  tableCols?: number;
  tableHeaders?: string[];
  /** Spacer height in px */
  height?: number;

  // ── Paragraph inline answer fields ──
  /** Answer fields embedded in paragraph content as [[field_id]] tokens */
  inlineFields?: InlineAnswerField[];

  // ── Table answer mode ──
  /** Column indices (0-based) that accept user answers in fill mode */
  tableAnswerColumns?: number[];
  /** Per-cell static text content [row][col] — displayed in non-answer cells */
  tableStaticContent?: string[][];
  /** Per-cell rich content for the Word-like table editor (supersedes tableStaticContent/tableAnswerColumns) */
  tableCells?: TableCell[][];
  /** Columns for the layout block */
  layoutColumns?: LayoutColumn[];

  /** Lab record layout */
  labLayout?: "valueUnit" | "result";
  /** Lab record row definitions */
  labRows?: LabRow[];
  /** Product listener — center the Add button */
  productListenerCenter?: boolean;
  /** Optional condition that controls whether this block is shown at fill-time */
  conditionalRendering?: BlockConditional;
}

export interface LabRow {
  id: string;
  name: string;
  unitMode: "dropdown" | "none";
  unitOptions: string[];
  defaultUnit?: string;
  resultOptions: string[];
}

// ─── Conditional rendering ────────────────────────────────────────────────────

export type ConditionalConditionType =
  | "notEmpty" // field has any value
  | "equals" // value strictly equals a string
  | "checked" // single checkbox is ticked
  | "includes" // array/string includes a value
  | "hasItem"; // product listener has a matching item

export interface BlockConditional {
  /** ID of the block whose value drives the condition */
  dependsOn: string;
  condition: ConditionalConditionType;
  /** For 'equals', 'includes', 'hasItem' (item name filter) */
  value?: string;
  /** For 'hasItem' — filter by product type */
  itemType?: "action" | "consumable";
}

// ─── Inline answer fields (for paragraph blocks) ──────────────────────────

/** Field types that can be embedded inline in paragraph text */
export type InlineFieldType =
  | "text"
  | "textarea"
  | "date"
  | "number"
  | "select";

/** Visual width hint for inline answer fields */
export type InlineFieldWidth = "xs" | "sm" | "md" | "lg" | "full";

/**
 * An answer field embedded in paragraph content as a [[field_id]] token.
 * The clinician fills this in at consultation time.
 */
export interface InlineAnswerField {
  id: string;
  fieldType: InlineFieldType;
  placeholder?: string;
  /** Options list for select type */
  options?: string[];
  required?: boolean;
  width?: InlineFieldWidth;
  /** Optional condition — field only shown when a parent block condition is met */
  conditionalRendering?: BlockConditional;
}

// ─── Layout columns ─────────────────────────────────────────────────────────

/** A single column inside a layout block, containing its own blocks. */
export interface LayoutColumn {
  id: string;
  blocks: FormBlock[];
}

/** Rich cell definition for Word-like table editing */
export interface TableCell {
  content?: string;
  inlineFields?: InlineAnswerField[];
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: "left" | "center" | "right";
}

export type FormTemplateType =
  | "consultation"
  | "consent"
  | "referral"
  | "discharge"
  | "report"
  | "custom";

export interface SavedForm {
  id: string;
  name: string;
  type: FormTemplateType;
  description?: string;
  blocks: FormBlock[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "nexxclinic_formbuilder_v1";

function read(): SavedForm[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(forms: SavedForm[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
}

export function fbGetAllForms(): SavedForm[] {
  return read().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function fbGetForm(id: string): SavedForm | null {
  return read().find((f) => f.id === id) ?? null;
}

export function fbSaveForm(
  form: Omit<SavedForm, "id" | "createdAt" | "updatedAt"> & { id?: string },
): SavedForm {
  const all = read();
  const now = new Date().toISOString();

  if (form.id) {
    const existing = all.find((f) => f.id === form.id);
    const updated: SavedForm = {
      ...form,
      id: form.id,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    write(
      existing
        ? all.map((f) => (f.id === form.id ? updated : f))
        : [...all, updated],
    );
    return updated;
  }

  const created: SavedForm = {
    ...form,
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now,
    updatedAt: now,
  };
  write([...all, created]);
  return created;
}

export function fbDeleteForm(id: string): void {
  write(read().filter((f) => f.id !== id));
}

export function fbDuplicateForm(id: string): SavedForm | null {
  const form = fbGetForm(id);
  if (!form) return null;
  return fbSaveForm({
    ...form,
    id: undefined,
    name: `${form.name} (Copy)`,
    blocks: form.blocks.map((b) => ({ ...b, id: fbGenId() })),
  });
}

export function fbGenId(): string {
  return `b_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

/** Create a minimal blank block of the given type */
export function fbMakeBlock(type: BlockType): FormBlock {
  const id = fbGenId();
  switch (type) {
    case "heading1":
    case "heading2":
    case "heading3":
    case "paragraph":
      return { id, type, content: "" };
    case "divider":
      return { id, type };
    case "spacer":
      return { id, type, height: 32 };
    case "text_input":
      return {
        id,
        type,
        label: "Text field",
        placeholder: "",
        required: false,
      };
    case "textarea_input":
      return { id, type, label: "Text area", placeholder: "", required: false };
    case "number_input":
      return {
        id,
        type,
        label: "Number field",
        placeholder: "",
        required: false,
      };
    case "date_input":
      return { id, type, label: "Date field", required: false };
    case "checkbox_single":
      return {
        id,
        type,
        label: "I agree to the above statement",
        required: false,
      };
    case "checkbox_group":
      return {
        id,
        type,
        label: "Select all that apply",
        options: ["Option A", "Option B", "Option C"],
        required: false,
      };
    case "radio_group":
      return {
        id,
        type,
        label: "Select one option",
        options: ["Option A", "Option B", "Option C"],
        required: false,
      };
    case "select_input":
      return {
        id,
        type,
        label: "Select",
        options: ["Option A", "Option B", "Option C"],
        required: false,
      };
    case "signature":
      return { id, type, label: "Signature" };
    case "table":
      return {
        id,
        type,
        tableRows: 3,
        tableCols: 3,
        tableCells: Array.from({ length: 3 }, () =>
          Array.from({ length: 3 }, () => ({})),
        ),
      };
    case "layout":
      return {
        id,
        type,
        layoutColumns: [
          { id: fbGenId(), blocks: [] },
          { id: fbGenId(), blocks: [] },
        ],
      };
    case "diagnostic_record":
      return {
        id,
        type,
        label: "Diagnoses",
        placeholder: "Enter diagnosis name…",
        required: false,
      };
    case "medication_full":
      return {
        id,
        type,
        label: "Medications",
        placeholder: "Medication name…",
        required: false,
      };
    case "medication_mini":
      return {
        id,
        type,
        label: "Medications",
        placeholder: "Medication name…",
        required: false,
      };
    case "lab_record":
      return {
        id,
        type,
        label: "Lab Results",
        labLayout: "valueUnit" as const,
        labRows: [
          {
            id: fbGenId(),
            name: "Result 1",
            unitMode: "dropdown" as const,
            unitOptions: ["mg/dL", "mmol/L", "g/dL"],
            defaultUnit: "mg/dL",
            resultOptions: ["+ve", "-ve"],
          },
          {
            id: fbGenId(),
            name: "Result 2",
            unitMode: "dropdown" as const,
            unitOptions: ["mg/dL", "mmol/L", "g/dL"],
            defaultUnit: "mg/dL",
            resultOptions: ["+ve", "-ve"],
          },
          {
            id: fbGenId(),
            name: "Result 3",
            unitMode: "dropdown" as const,
            unitOptions: ["mg/dL", "mmol/L", "g/dL"],
            defaultUnit: "mg/dL",
            resultOptions: ["+ve", "-ve"],
          },
        ],
        required: false,
      };
    case "product_listener":
      return {
        id,
        type,
        label: "Add Product / Procedure",
        productListenerCenter: false,
      };
    default:
      return { id, type };
  }
}
