import type { ReactNode } from "react";
import type { FormBlock, SavedForm } from "@/lib/formbuilder-storage";
import type { FormAction } from "@/lib/form-storage";
import type { PatientInsurance } from "@/lib/api-types";
import type {
  AddedProduct,
  DiagEntry,
  SymptomEntry,
  FormAnswers,
  MedFullEntry,
  MedMiniEntry,
} from "../renderer/types";

/** Per-block handlers injected by an extension into medical answer blocks. */
export interface MedicalBlockHandlers {
  /** Product listener — visit-synced product list */
  productActions?: FormAction[];
  onAddProduct?: (
    type: "action" | "consumable",
    item: {
      id: string;
      name: string;
      privatePrice?: number;
      isQuantifiable?: boolean;
    },
    quantity: number,
  ) => Promise<boolean>;
  onRemoveProduct?: (actionId: string) => void;
  onUpdateProductQuantity?: (actionId: string, quantity: number) => void;
  onRestoreProduct?: (actionId: string) => void;
  productsLocked?: boolean;
  hideProductAddButton?: boolean;
  visitDepartmentId?: string;
  linkedInsurances?: PatientInsurance[];

  /** Diagnostic record — live list from visit & direct mutations */
  diagnostics?: DiagEntry[];
  onAddDiagnosis?: (
    diagnosis: string,
    icd11Code?: string,
    type?: "FINAL" | "HYPOTHESIS",
  ) => Promise<boolean>;
  onRemoveDiagnosis?: (diagnosisId: string) => Promise<boolean>;
  onUpdateDiagnosisNotes?: (diagnosisId: string, notes: string) => Promise<boolean>;

  symptoms?: SymptomEntry[];
  onAddSymptom?: (symptom: string, sonomedId?: string, notes?: string) => Promise<boolean>;
  onRemoveSymptom?: (symptomId: string) => Promise<boolean>;
  onUpdateSymptomNotes?: (symptomId: string, notes: string) => Promise<boolean>;

  /** Medication blocks — live list from visit & direct mutations */
  medicationsFull?: MedFullEntry[];
  medicationsMini?: MedMiniEntry[];
  onAddMedicationFull?: (entry: Omit<MedFullEntry, "id">) => Promise<boolean>;
  onAddMedicationMini?: (name: string, notes?: string) => Promise<boolean>;
  onRemoveMedication?: (medicationId: string) => Promise<boolean>;
  onUpdateMedication?: (
    medicationId: string,
    medicationName: string,
    instructions: string,
  ) => Promise<boolean>;

  visitId?: string;
  departmentId?: string;
}

export interface FormRendererExtensionContext {
  form: SavedForm | null;
  answers: FormAnswers;
  inlineAnswers: Record<string, string>;
  edit: boolean;
  setAnswers: (
    updater: FormAnswers | ((prev: FormAnswers) => FormAnswers),
  ) => void;
}

export interface FormRendererExtension {
  id: string;
  /** Optional answer patches merged after initial hydration (visit → form). */
  getHydrationPatch?: (answers: FormAnswers) => FormAnswers | null;
  /** Per-block handler overrides for syncable medical blocks. */
  getBlockHandlers?: (block: FormBlock) => MedicalBlockHandlers | null;
  /** Portals/modals — render outside FormRenderer (e.g. ConsultationFormRenderer). */
  renderOverlay?: () => ReactNode;
  /** Called whenever merged answers change. */
  onAnswersChange?: (answers: FormAnswers) => void;
  /** Optional non-blocking sync notice surfaced by parent screens. */
  getSyncNotice?: () => { level: "info" | "warning"; message: string } | null;
}

export type {
  AddedProduct,
  DiagEntry,
  MedFullEntry,
  MedMiniEntry,
  FormAnswers,
};
