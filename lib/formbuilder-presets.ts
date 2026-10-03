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
    description: "History, examination, procedures, diagnosis and management plan.",
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
      b("heading2", { content: "Procedures / Products" }),
      b("product_listener", {
        label: "Add Procedure / Product",
        productListenerCenter: false,
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
      b("heading2", { content: "Additional Notes" }),
      b("textarea_input", {
        label: "Notes",
        placeholder: "Any additional observations or instructions…",
      }),
    ],
  },

  // ──────────────────────── OPHTHALMOLOGY ────────────────────────
  {
    type: "ophthalmology",
    label: "Ophthalmology Consultation",
    description:
      "Eye-focused examination with RE/LE VA, refraction, IOP, ocular compartments, procedures and Rx.",
    emoji: "👁️",
    color:
      "border-cyan-300 bg-cyan-50 dark:border-cyan-700 dark:bg-cyan-950/30",
    blocks: () => [
      b("heading1", {
        content: "Ophthalmology Consultation Note",
        align: "center",
        bold: true,
      }),
      b("divider"),

      // ── Chief Complaint & History ──
      b("heading2", { content: "Chief Complaint" }),
      b("textarea_input", {
        label: "Chief Complaint",
        placeholder:
          "Ocular symptoms (decreased vision, pain, redness, discharge, flashes/floaters, diplopia, foreign body sensation), laterality (RE/LE/Both), duration…",
        required: true,
      }),
      b("heading2", { content: "History of Present Illness" }),
      b("textarea_input", {
        label: "History of Present Illness",
        placeholder:
          "Onset, progression, aggravating/relieving factors, visual disturbance details…",
      }),
      b("heading2", { content: "Ocular & Medical History" }),
      b("textarea_input", {
        label: "Past Ocular History",
        placeholder:
          "Previous eye surgeries, laser treatment, ocular trauma, amblyopia, glaucoma, contact lens wear, previous glasses history…",
      }),
      b("textarea_input", {
        label: "Systemic Medical History & Allergies",
        placeholder:
          "Diabetes mellitus, hypertension, thyroid disorders, autoimmune disease, current systemic medications, known drug/eye-drop allergies…",
      }),
      b("divider"),

      // ── Visual Acuity Records ──
      b("heading2", { content: "Visual Acuity (VA) Records" }),
      paf(
        "Presenting VA (Unaided):   RE (OD): [[1]]   ·   LE (OS): [[2]]",
        { type: "text", hint: "e.g. 6/18 or 20/60", w: "md" },
        { type: "text", hint: "e.g. 6/12 or 20/40", w: "md" },
      ),
      paf(
        "Pinhole VA (PH):           RE (OD): [[1]]   ·   LE (OS): [[2]]",
        { type: "text", hint: "e.g. 6/6 or NI", w: "md" },
        { type: "text", hint: "e.g. 6/6 or NI", w: "md" },
      ),
      b("spacer", { height: 12 }),

      // ── Existing Glasses Table ──
      b("heading2", { content: "Existing Glasses / Habitual Correction" }),
      b("table", {
        tableRows: 3,
        tableCols: 6,
        tableHeaders: [
          "Eye",
          "Sphere (Sph)",
          "Cylinder (Cyl)",
          "Axis",
          "Near Add",
          "VA with Glasses",
        ],
        tableCells: [
          [
            { content: "Eye", bold: true, align: "center" },
            { content: "Sphere (Sph)", bold: true, align: "center" },
            { content: "Cylinder (Cyl)", bold: true, align: "center" },
            { content: "Axis (°)", bold: true, align: "center" },
            { content: "Near Add", bold: true, align: "center" },
            { content: "VA with Glasses", bold: true, align: "center" },
          ],
          [
            { content: "RE (OD)", bold: true, align: "center" },
            {
              content: "[[ans1]]",
              inlineFields: [
                {
                  id: "ans1",
                  fieldType: "text",
                  placeholder: "+/- D",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans2]]",
              inlineFields: [
                {
                  id: "ans2",
                  fieldType: "text",
                  placeholder: "Cyl D",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans3]]",
              inlineFields: [
                {
                  id: "ans3",
                  fieldType: "text",
                  placeholder: "0 - 180°",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans4]]",
              inlineFields: [
                {
                  id: "ans4",
                  fieldType: "text",
                  placeholder: "+ Add",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans5]]",
              inlineFields: [
                {
                  id: "ans5",
                  fieldType: "text",
                  placeholder: "e.g. 6/6",
                  width: "xs",
                },
              ],
            },
          ],
          [
            { content: "LE (OS)", bold: true, align: "center" },
            {
              content: "[[ans6]]",
              inlineFields: [
                {
                  id: "ans6",
                  fieldType: "text",
                  placeholder: "+/- D",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans7]]",
              inlineFields: [
                {
                  id: "ans7",
                  fieldType: "text",
                  placeholder: "Cyl D",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans8]]",
              inlineFields: [
                {
                  id: "ans8",
                  fieldType: "text",
                  placeholder: "0 - 180°",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans9]]",
              inlineFields: [
                {
                  id: "ans9",
                  fieldType: "text",
                  placeholder: "+ Add",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans10]]",
              inlineFields: [
                {
                  id: "ans10",
                  fieldType: "text",
                  placeholder: "e.g. 6/6",
                  width: "xs",
                },
              ],
            },
          ],
        ],
      }),
      b("spacer", { height: 12 }),

      // ── Subjective Refraction / Best Corrected Visual Acuity (BCVA) ──
      b("heading2", {
        content: "Refraction & Best Corrected Visual Acuity (BCVA)",
      }),
      b("table", {
        tableRows: 3,
        tableCols: 6,
        tableHeaders: [
          "Eye",
          "Sphere (Sph)",
          "Cylinder (Cyl)",
          "Axis",
          "Near Add",
          "BCVA",
        ],
        tableCells: [
          [
            { content: "Eye", bold: true, align: "center" },
            { content: "Sphere (Sph)", bold: true, align: "center" },
            { content: "Cylinder (Cyl)", bold: true, align: "center" },
            { content: "Axis (°)", bold: true, align: "center" },
            { content: "Near Add", bold: true, align: "center" },
            { content: "BCVA", bold: true, align: "center" },
          ],
          [
            { content: "RE (OD)", bold: true, align: "center" },
            {
              content: "[[ans1]]",
              inlineFields: [
                {
                  id: "ans1",
                  fieldType: "text",
                  placeholder: "+/- D",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans2]]",
              inlineFields: [
                {
                  id: "ans2",
                  fieldType: "text",
                  placeholder: "Cyl D",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans3]]",
              inlineFields: [
                {
                  id: "ans3",
                  fieldType: "text",
                  placeholder: "0 - 180°",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans4]]",
              inlineFields: [
                {
                  id: "ans4",
                  fieldType: "text",
                  placeholder: "+ Add",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans5]]",
              inlineFields: [
                {
                  id: "ans5",
                  fieldType: "text",
                  placeholder: "e.g. 6/6",
                  width: "xs",
                },
              ],
            },
          ],
          [
            { content: "LE (OS)", bold: true, align: "center" },
            {
              content: "[[ans6]]",
              inlineFields: [
                {
                  id: "ans6",
                  fieldType: "text",
                  placeholder: "+/- D",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans7]]",
              inlineFields: [
                {
                  id: "ans7",
                  fieldType: "text",
                  placeholder: "Cyl D",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans8]]",
              inlineFields: [
                {
                  id: "ans8",
                  fieldType: "text",
                  placeholder: "0 - 180°",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans9]]",
              inlineFields: [
                {
                  id: "ans9",
                  fieldType: "text",
                  placeholder: "+ Add",
                  width: "xs",
                },
              ],
            },
            {
              content: "[[ans10]]",
              inlineFields: [
                {
                  id: "ans10",
                  fieldType: "text",
                  placeholder: "e.g. 6/6",
                  width: "xs",
                },
              ],
            },
          ],
        ],
      }),
      b("divider"),

      // ── Intraocular Pressure (IOP) ──
      b("heading2", { content: "Intraocular Pressure (IOP)" }),
      paf(
        "IOP:   RE (OD): [[1]] mmHg   ·   LE (OS): [[2]] mmHg   ·   Method: [[3]]   ·   Time: [[4]]",
        { type: "text", hint: "RE IOP (mmHg)", w: "xs" },
        { type: "text", hint: "LE IOP (mmHg)", w: "xs" },
        { type: "text", hint: "Goldmann / NCT / Tonopen", w: "md" },
        { type: "text", hint: "e.g. 10:30 AM", w: "xs" },
      ),
      b("divider"),

      // ── Major Ocular Compartments (Slit Lamp & Posterior Segment) ──
      b("heading2", { content: "Slit Lamp & Ocular Examination Findings" }),
      paf(
        "Lids & Adnexa:   RE (OD): [[1]]   ·   LE (OS): [[2]]",
        { type: "text", hint: "Lids, lashes, lacrimal, ptosis…", w: "lg" },
        { type: "text", hint: "Lids, lashes, lacrimal, ptosis…", w: "lg" },
      ),
      paf(
        "Conjunctiva & Sclera:   RE (OD): [[1]]   ·   LE (OS): [[2]]",
        {
          type: "text",
          hint: "Clear / injected / discharge / pinguecula…",
          w: "lg",
        },
        {
          type: "text",
          hint: "Clear / injected / discharge / pinguecula…",
          w: "lg",
        },
      ),
      paf(
        "Cornea:   RE (OD): [[1]]   ·   LE (OS): [[2]]",
        {
          type: "text",
          hint: "Clear / epithelial defect / infiltrates / edema…",
          w: "lg",
        },
        {
          type: "text",
          hint: "Clear / epithelial defect / infiltrates / edema…",
          w: "lg",
        },
      ),
      paf(
        "Anterior Chamber:   RE (OD): [[1]]   ·   LE (OS): [[2]]",
        {
          type: "text",
          hint: "Deep & quiet / cells & flare / hyphema…",
          w: "lg",
        },
        {
          type: "text",
          hint: "Deep & quiet / cells & flare / hyphema…",
          w: "lg",
        },
      ),
      paf(
        "Iris & Pupil:   RE (OD): [[1]]   ·   LE (OS): [[2]]",
        {
          type: "text",
          hint: "Round, regular, reactive to light, no RAPD…",
          w: "lg",
        },
        {
          type: "text",
          hint: "Round, regular, reactive to light, no RAPD…",
          w: "lg",
        },
      ),
      paf(
        "Lens:   RE (OD): [[1]]   ·   LE (OS): [[2]]",
        {
          type: "text",
          hint: "Clear / nuclear sclerosis / cortical / PCIOL…",
          w: "lg",
        },
        {
          type: "text",
          hint: "Clear / nuclear sclerosis / cortical / PCIOL…",
          w: "lg",
        },
      ),
      paf(
        "Vitreous:   RE (OD): [[1]]   ·   LE (OS): [[2]]",
        {
          type: "text",
          hint: "Clear / PVD / vitreous hemorrhage / cells…",
          w: "lg",
        },
        {
          type: "text",
          hint: "Clear / PVD / vitreous hemorrhage / cells…",
          w: "lg",
        },
      ),
      paf(
        "Fundus / Retina / Optic Disc / Macula:   RE (OD): [[1]]   ·   LE (OS): [[2]]",
        {
          type: "text",
          hint: "Disc pink, sharp margins, C/D ratio, macula flat, vessels normal…",
          w: "lg",
        },
        {
          type: "text",
          hint: "Disc pink, sharp margins, C/D ratio, macula flat, vessels normal…",
          w: "lg",
        },
      ),
      b("textarea_input", {
        label: "Detailed Examination Notes & Drawings / Diagrams",
        placeholder:
          "Additional findings, gonioscopy, dilated fundus exam, OCT / visual field notes…",
      }),
      b("divider"),

      // ── Procedures / Products ──
      b("heading2", { content: "Procedures & Diagnostics Performed" }),
      b("product_listener", {
        label: "Add Ophthalmic Procedure / Service",
        productListenerCenter: false,
      }),

      // ── Diagnostics ──
      b("heading2", { content: "Diagnosis" }),
      b("diagnostic_record", {
        label: "Ophthalmic Diagnoses",
        placeholder:
          "Enter eye diagnosis (e.g. Cataract, Glaucoma, Refractive Error, Conjunctivitis)…",
        required: true,
      }),
      b("divider"),

      // ── Prescriptions & Management ──
      b("heading2", { content: "Optical / Spectacle Prescription" }),
      paf(
        "Spectacle Rx:   RE: Sph [[1]] Cyl [[2]] Axis [[3]] Add [[4]]   ·   LE: Sph [[5]] Cyl [[6]] Axis [[7]] Add [[8]]   ·   PD: [[9]] mm",
        { type: "text", hint: "Sph", w: "xs" },
        { type: "text", hint: "Cyl", w: "xs" },
        { type: "text", hint: "Axis", w: "xs" },
        { type: "text", hint: "Add", w: "xs" },
        { type: "text", hint: "Sph", w: "xs" },
        { type: "text", hint: "Cyl", w: "xs" },
        { type: "text", hint: "Axis", w: "xs" },
        { type: "text", hint: "Add", w: "xs" },
        { type: "text", hint: "PD mm", w: "xs" },
      ),
      b("heading2", {
        content: "Medications Prescribed (Eye Drops & Systemic)",
      }),
      b("medication_full", {
        label: "Prescribed Eye Medications",
        placeholder: "Medication name (drops, ointments, systemic)…",
      }),
      b("heading2", { content: "Management & Follow-up Plan" }),
      b("textarea_input", {
        label: "Treatment Plan & Follow-up Instructions",
        placeholder:
          "Eye care instructions, medication schedule, danger signs (sudden vision loss, severe pain), follow-up interval…",
        required: true,
      }),
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
