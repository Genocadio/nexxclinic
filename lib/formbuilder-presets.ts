// Template presets — pre-built block arrays for each form type
// All presets use Answer Fields (InlineAnswerField with [[ansN]] tokens)
// instead of the old {{placeholder}} token system.

import type {
  FormBlock,
  FormTemplateType,
  InlineAnswerField,
  InlineFieldType,
  InlineFieldWidth,
} from "./formbuilder-storage";
import { fbGenId } from "./formbuilder-storage";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function b(
  type: FormBlock["type"],
  extra: Partial<Omit<FormBlock, "id" | "type">> = {},
): FormBlock {
  return { id: fbGenId(), type, ...extra } as FormBlock;
}

/** Field definition shorthand for paf() */
type FDef = {
  type: InlineFieldType;
  hint?: string;
  w?: InlineFieldWidth;
  req?: boolean;
};

/**
 * Create a paragraph block with embedded answer fields.
 * Write [[1]], [[2]], … in the template — they map to the fields array by index.
 *
 * Example:
 *   paf("Patient: [[1]] · DOB: [[2]]",
 *     { type: "text", hint: "Patient name", w: "md", req: true },
 *     { type: "date", hint: "Date of birth", w: "sm" }
 *   )
 */
function paf(template: string, ...fields: FDef[]): FormBlock {
  let content = template;
  const inlineFields: InlineAnswerField[] = fields.map((f, i) => {
    const id = `ans${i + 1}`;
    content = content.replace(`[[${i + 1}]]`, `[[${id}]]`);
    return {
      id,
      fieldType: f.type,
      placeholder: f.hint,
      width: f.w ?? "sm",
      required: f.req ?? false,
    };
  });
  return b("paragraph", { content, inlineFields });
}

// ─── Preset definitions ───────────────────────────────────────────────────────

export interface TemplatePreset {
  type: FormTemplateType;
  label: string;
  description: string;
  emoji: string;
  color: string;
  blocks: () => FormBlock[];
}

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  // ──────────────────────── CONSULTATION ────────────────────────
  {
    type: "consultation",
    label: "Consultation Note",
    description: "History, examination, diagnosis and management plan.",
    emoji: "🩺",
    color:
      "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/30",
    blocks: () => [
      b("heading1", {
        content: "Consultation Note",
        align: "center",
        bold: true,
      }),
      b("divider"),
      paf(
        "Patient: [[1]]   ·   DOB: [[2]]   ·   ID: [[3]]",
        { type: "text", hint: "Patient name", w: "md", req: true },
        { type: "date", hint: "Date of birth", w: "sm" },
        { type: "text", hint: "Patient ID", w: "sm" },
      ),
      paf(
        "Clinician: [[1]]   ·   [[2]]   ·   Date: [[3]]",
        { type: "text", hint: "Clinician name", w: "md" },
        { type: "text", hint: "Department", w: "md" },
        { type: "date", hint: "Visit date", w: "sm" },
      ),
      b("divider"),
      b("heading2", { content: "Chief Complaint" }),
      b("textarea_input", {
        label: "Chief Complaint",
        placeholder: "Describe the main reason for the visit…",
        required: true,
      }),
      b("heading2", { content: "History of Present Illness" }),
      b("textarea_input", {
        label: "History",
        placeholder: "Onset, duration, severity, associated symptoms…",
      }),
      b("heading2", { content: "Past Medical History" }),
      b("textarea_input", {
        label: "Past Medical History",
        placeholder: "Previous illnesses, surgeries, hospitalizations…",
      }),
      b("heading2", { content: "Medications & Allergies" }),
      b("textarea_input", {
        label: "Current Medications",
        placeholder: "List current medications and dosages…",
      }),
      b("text_input", {
        label: "Known Allergies",
        placeholder: 'e.g. Penicillin — or write "None known"',
      }),
      b("heading2", { content: "Examination Findings" }),
      b("textarea_input", {
        label: "Physical Examination",
        placeholder: "Describe examination findings systematically…",
      }),
      b("heading2", { content: "Diagnosis" }),
      b("diagnostic_record", {
        label: "Diagnoses",
        placeholder: "Enter diagnosis name…",
        required: true,
      }),
      b("heading2", { content: "Management Plan" }),
      b("textarea_input", {
        label: "Treatment Plan",
        placeholder: "Medications, investigations, referrals, follow-up…",
        required: true,
      }),
      b("heading2", { content: "Medications Prescribed" }),
      b("medication_full", {
        label: "Prescribed Medications",
        placeholder: "Medication name…",
      }),
      b("heading2", { content: "Investigations / Lab" }),
      b("lab_record", {
        label: "Lab Results",
        labLayout: "valueUnit",
        labRows: [
          {
            id: fbGenId(),
            name: "Glucose",
            unitMode: "dropdown",
            unitOptions: ["mg/dL", "mmol/L"],
            defaultUnit: "mg/dL",
            resultOptions: ["+ve", "-ve"],
          },
          {
            id: fbGenId(),
            name: "HbA1c",
            unitMode: "dropdown",
            unitOptions: ["%", "mmol/mol"],
            defaultUnit: "%",
            resultOptions: ["+ve", "-ve"],
          },
          {
            id: fbGenId(),
            name: "Creatinine",
            unitMode: "dropdown",
            unitOptions: ["mg/dL", "µmol/L"],
            defaultUnit: "mg/dL",
            resultOptions: ["+ve", "-ve"],
          },
        ],
      }),
      b("heading2", { content: "Procedures / Products" }),
      b("product_listener", {
        label: "Add Procedure / Product",
        productListenerCenter: false,
      }),
      b("heading2", { content: "Additional Notes" }),
      b("textarea_input", {
        label: "Notes",
        placeholder: "Any additional observations or instructions…",
      }),
      b("divider"),
      paf(
        "[[1]]   ·   [[2]]   ·   License: [[3]]",
        { type: "text", hint: "Clinician name", w: "md" },
        { type: "text", hint: "Title", w: "sm" },
        { type: "text", hint: "License #", w: "sm" },
      ),
      b("signature", { label: "Clinician Signature" }),
      paf("Date: [[1]]", { type: "date", hint: "Date", w: "sm" }),
    ],
  },

  // ──────────────────────── CONSENT ────────────────────────
  {
    type: "consent",
    label: "Patient Consent Form",
    description: "Informed consent for procedures, treatment or data use.",
    emoji: "✍️",
    color:
      "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/30",
    blocks: () => [
      b("heading1", {
        content: "Patient Consent Form",
        align: "center",
        bold: true,
      }),
      b("text_input", {
        label: "Clinic / Hospital Name",
        placeholder: "e.g. NexxClinic",
      }),
      b("divider"),
      b("heading2", { content: "Patient Information" }),
      paf("Patient Name: [[1]]", {
        type: "text",
        hint: "Full name",
        w: "lg",
        req: true,
      }),
      paf(
        "Date of Birth: [[1]]   ·   Patient ID: [[2]]",
        { type: "date", hint: "Date of birth", w: "sm" },
        { type: "text", hint: "Patient ID", w: "sm" },
      ),
      b("divider"),
      b("heading2", { content: "Procedure / Treatment" }),
      b("text_input", {
        label: "Procedure / Treatment",
        placeholder: "Describe the procedure or treatment",
        required: true,
      }),
      paf(
        "Clinician: [[1]]   ·   Department: [[2]]   ·   Date: [[3]]",
        { type: "text", hint: "Clinician name", w: "md" },
        { type: "text", hint: "Department", w: "md" },
        { type: "date", hint: "Date", w: "sm" },
      ),
      b("divider"),
      b("heading2", { content: "Declaration" }),
      paf(
        "I, [[1]], hereby consent to the procedure / treatment described above.",
        { type: "text", hint: "Patient name", w: "md", req: true },
      ),
      b("paragraph", {
        content:
          "The clinician has fully explained the purpose, nature, risks and benefits of the proposed procedure. I have had the opportunity to ask questions and have received satisfactory answers.",
      }),
      b("paragraph", {
        content:
          "I understand I may withdraw this consent at any time before the procedure begins.",
      }),
      b("divider"),
      b("heading2", { content: "Acknowledgment" }),
      b("checkbox_single", {
        label: "I have read and understood this consent form.",
      }),
      b("checkbox_single", {
        label: "I agree to the procedure / treatment described above.",
      }),
      b("checkbox_single", {
        label: "My questions have been answered to my satisfaction.",
      }),
      b("divider"),
      b("heading2", { content: "Patient / Guardian Signature" }),
      b("text_input", {
        label: "Patient / Guardian Full Name",
        required: true,
      }),
      b("signature", { label: "Patient / Guardian Signature" }),
      b("spacer", { height: 16 }),
      b("heading2", { content: "Clinician Signature" }),
      b("signature", { label: "Clinician Signature" }),
      paf("Date: [[1]]", { type: "date", hint: "Date", w: "sm" }),
    ],
  },

  // ──────────────────────── REFERRAL ────────────────────────
  {
    type: "referral",
    label: "Referral Letter",
    description: "Patient referral to another specialist or department.",
    emoji: "📨",
    color:
      "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30",
    blocks: () => [
      b("heading1", {
        content: "Patient Referral Letter",
        align: "center",
        bold: true,
      }),
      paf(
        "[[1]]   ·   Date: [[2]]",
        { type: "text", hint: "Clinic / Hospital name", w: "md" },
        { type: "date", hint: "Date", w: "sm" },
      ),
      b("divider"),
      b("heading2", { content: "Patient Details" }),
      paf("Name: [[1]]", {
        type: "text",
        hint: "Patient name",
        w: "lg",
        req: true,
      }),
      paf(
        "DOB: [[1]]   ·   Gender: [[2]]   ·   ID: [[3]]",
        { type: "date", hint: "Date of birth", w: "sm" },
        { type: "text", hint: "Gender", w: "xs" },
        { type: "text", hint: "Patient ID", w: "sm" },
      ),
      paf(
        "Phone: [[1]]   ·   Insurance: [[2]]",
        { type: "text", hint: "Phone number", w: "sm" },
        { type: "text", hint: "Insurance provider", w: "md" },
      ),
      b("divider"),
      b("heading2", { content: "Referring Clinician" }),
      paf(
        "[[1]]   ·   [[2]]   ·   [[3]]",
        { type: "text", hint: "Clinician name", w: "md" },
        { type: "text", hint: "Title", w: "sm" },
        { type: "text", hint: "Department", w: "md" },
      ),
      b("divider"),
      b("heading2", { content: "Reason for Referral" }),
      b("textarea_input", {
        label: "Reason for Referral",
        placeholder: "Brief clinical summary and reason for referral…",
        required: true,
      }),
      b("heading2", { content: "Current Diagnosis" }),
      b("text_input", {
        label: "Diagnosis",
        placeholder: "Working / confirmed diagnosis",
        required: true,
      }),
      b("text_input", { label: "ICD Code", placeholder: "ICD-10/11 code" }),
      b("heading2", { content: "Current Management" }),
      b("textarea_input", {
        label: "Current Medications",
        placeholder: "List current medications…",
      }),
      b("textarea_input", {
        label: "Investigations Done",
        placeholder: "List relevant investigations and results…",
      }),
      b("heading2", { content: "Referral Destination" }),
      b("text_input", {
        label: "Referred To (Specialist / Facility)",
        placeholder: "Specialist name or facility",
        required: true,
      }),
      b("text_input", {
        label: "Urgency",
        placeholder: "Routine / Urgent / Emergency",
      }),
      b("heading2", { content: "Additional Notes" }),
      b("textarea_input", {
        label: "Notes",
        placeholder: "Any other relevant information…",
      }),
      b("divider"),
      paf(
        "[[1]]   ·   [[2]]   ·   License: [[3]]",
        { type: "text", hint: "Clinician name", w: "md" },
        { type: "text", hint: "Title", w: "sm" },
        { type: "text", hint: "License #", w: "sm" },
      ),
      b("signature", { label: "Clinician Signature" }),
      paf("Date: [[1]]", { type: "date", hint: "Date", w: "sm" }),
    ],
  },

  // ──────────────────────── DISCHARGE ────────────────────────
  {
    type: "discharge",
    label: "Discharge Summary",
    description:
      "Summary of hospital stay, treatment and discharge instructions.",
    emoji: "🏥",
    color:
      "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30",
    blocks: () => [
      b("heading1", {
        content: "Discharge Summary",
        align: "center",
        bold: true,
      }),
      b("text_input", {
        label: "Clinic / Hospital Name",
        placeholder: "e.g. NexxClinic",
      }),
      b("divider"),
      b("heading2", { content: "Patient Information" }),
      paf(
        "Name: [[1]]   ·   DOB: [[2]]   ·   ID: [[3]]",
        { type: "text", hint: "Patient name", w: "md", req: true },
        { type: "date", hint: "Date of birth", w: "sm" },
        { type: "text", hint: "Patient ID", w: "sm" },
      ),
      paf(
        "Gender: [[1]]   ·   Insurance: [[2]]",
        { type: "text", hint: "Gender", w: "xs" },
        { type: "text", hint: "Insurance provider", w: "md" },
      ),
      b("divider"),
      b("heading2", { content: "Admission Details" }),
      b("date_input", { label: "Date of Admission", required: true }),
      b("date_input", { label: "Date of Discharge", required: true }),
      b("text_input", { label: "Admitting Diagnosis", required: true }),
      b("heading2", { content: "Discharge Diagnosis" }),
      b("text_input", { label: "Final Diagnosis", required: true }),
      b("text_input", { label: "ICD Code" }),
      b("heading2", { content: "Treatment Given" }),
      b("textarea_input", {
        label: "Procedures Performed",
        placeholder: "List all procedures performed…",
      }),
      b("textarea_input", {
        label: "Medications Administered",
        placeholder: "List all medications given…",
      }),
      b("heading2", { content: "Discharge Condition" }),
      b("radio_group", {
        label: "Patient Condition at Discharge",
        options: ["Stable", "Improved", "Unchanged", "Deteriorated"],
        required: true,
      }),
      b("heading2", { content: "Discharge Instructions" }),
      b("textarea_input", {
        label: "Follow-up Instructions",
        placeholder: "Diet, activity, wound care…",
        required: true,
      }),
      b("textarea_input", {
        label: "Medications on Discharge",
        placeholder: "List discharge medications and dosages…",
      }),
      b("text_input", {
        label: "Follow-up Appointment",
        placeholder: "Date and department/clinic",
      }),
      b("heading2", { content: "Return to ER If" }),
      b("textarea_input", {
        label: "Warning Signs",
        placeholder: "List warning signs requiring immediate return…",
      }),
      b("divider"),
      paf(
        "[[1]]   ·   [[2]]   ·   [[3]]",
        { type: "text", hint: "Clinician name", w: "md" },
        { type: "text", hint: "Title", w: "sm" },
        { type: "text", hint: "Department", w: "md" },
      ),
      b("signature", { label: "Discharging Clinician Signature" }),
      paf("Date: [[1]]", { type: "date", hint: "Date", w: "sm" }),
    ],
  },

  // ──────────────────────── REPORT ────────────────────────
  {
    type: "report",
    label: "Medical Report",
    description: "General medical report, certificate or fitness assessment.",
    emoji: "📋",
    color:
      "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-950/30",
    blocks: () => [
      b("heading1", { content: "Medical Report", align: "center", bold: true }),
      b("text_input", {
        label: "Clinic / Hospital Name",
        placeholder: "e.g. NexxClinic",
      }),
      b("text_input", { label: "Clinic Address", placeholder: "Address" }),
      b("divider"),
      b("heading2", { content: "Patient Details" }),
      paf("Name: [[1]]", {
        type: "text",
        hint: "Patient name",
        w: "lg",
        req: true,
      }),
      paf(
        "DOB: [[1]]   ·   Age: [[2]]   ·   Gender: [[3]]",
        { type: "date", hint: "Date of birth", w: "sm" },
        { type: "text", hint: "Age", w: "xs" },
        { type: "text", hint: "Gender", w: "xs" },
      ),
      paf("ID: [[1]]", { type: "text", hint: "Patient ID", w: "sm" }),
      b("divider"),
      b("heading2", { content: "Report Details" }),
      b("text_input", {
        label: "Report Title",
        placeholder: "e.g. Medical Certificate, Fitness Report…",
        required: true,
      }),
      b("date_input", { label: "Report Date", required: true }),
      b("text_input", {
        label: "Purpose / Requested By",
        placeholder: "Who requested this report?",
      }),
      b("divider"),
      b("heading2", { content: "Clinical Summary" }),
      b("textarea_input", {
        label: "Clinical Findings",
        placeholder: "Summary of relevant clinical information…",
        required: true,
      }),
      b("text_input", { label: "Diagnosis", placeholder: "If applicable…" }),
      b("heading2", { content: "Opinion / Recommendation" }),
      b("textarea_input", {
        label: "Clinical Opinion",
        placeholder: "Clinical opinion and recommendations…",
        required: true,
      }),
      b("heading2", { content: "Restrictions / Notes" }),
      b("textarea_input", {
        label: "Restrictions",
        placeholder: "e.g. unfit for work, dietary restrictions…",
      }),
      b("divider"),
      b("paragraph", { content: "This report was prepared by:" }),
      paf(
        "[[1]]   ·   [[2]]   ·   License: [[3]]",
        { type: "text", hint: "Clinician name", w: "md" },
        { type: "text", hint: "Title", w: "sm" },
        { type: "text", hint: "License #", w: "sm" },
      ),
      paf(
        "[[1]]   ·   [[2]]",
        { type: "text", hint: "Department", w: "md" },
        { type: "text", hint: "Clinic name", w: "md" },
      ),
      b("signature", { label: "Clinician Signature" }),
      paf("Date: [[1]]", { type: "date", hint: "Date", w: "sm" }),
    ],
  },

  // ──────────────────────── CUSTOM / BLANK ────────────────────────
  {
    type: "custom",
    label: "Blank Form",
    description: "Start from scratch with an empty canvas.",
    emoji: "✨",
    color:
      "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900/30",
    blocks: () => [
      b("heading1", { content: "Untitled Form", align: "center" }),
      b("divider"),
      b("paragraph", { content: "" }),
    ],
  },
];

export function getPreset(type: FormTemplateType): TemplatePreset | undefined {
  return TEMPLATE_PRESETS.find((p) => p.type === type);
}
