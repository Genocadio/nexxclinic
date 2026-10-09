import type { FormBlock } from "@/lib/formbuilder-storage";
import type { FormAction } from "@/lib/form-storage";
import type { AddedProduct, DiagEntry, FormAnswers, MedFullEntry, MedMiniEntry } from "../../renderer/types";
import { collectAnswerableBlocks } from "../../renderer/utils";

export const CLINICAL_BLOCK_TYPES = new Set([
  "product_listener",
  "diagnostic_record",
  "hypothesis_record",
  "medication_full",
  "medication_mini",
]);

/** @deprecated Alias for backward compatibility */
export const SYNC_BLOCK_TYPES = CLINICAL_BLOCK_TYPES;

export function findClinicalBlocks(blocks: FormBlock[]) {
  return collectAnswerableBlocks(blocks).filter((b) =>
    CLINICAL_BLOCK_TYPES.has(b.type),
  );
}

/** @deprecated Alias for backward compatibility */
export const findSyncBlocks = findClinicalBlocks;

export function parseMedicationInstructions(instructions: string) {
  const raw = String(instructions || "");
  return {
    frequency: (raw.match(/Frequency:\s*([^,]+)/i)?.[1] || "").trim(),
    amount: (raw.match(/Amount:\s*([^,]+)/i)?.[1] || "").trim(),
    days: (raw.match(/Days:\s*([^,]+)/i)?.[1] || "").trim(),
    notes: (raw.match(/Extra notes:\s*(.+)$/i)?.[1] || "").trim(),
  };
}

export function buildLongMedicationInstructions(entry: Omit<MedFullEntry, "id">) {
  const { frequency, amount, days, notes } = entry;
  return `Frequency: ${frequency}, Amount: ${amount}, Days: ${days}${notes ? `, Extra notes: ${notes}` : ""}`;
}

export function extractProductIdentifiers(action: FormAction | AddedProduct) {
  const ids = new Set<string>();
  const add = (value: unknown) => {
    if (value !== null && value !== undefined) ids.add(String(value));
  };

  add((action as FormAction).backendId);
  add(action.id);
  add((action as FormAction).rawData?.id);
  add((action as FormAction).rawData?.product?.id);
  add((action as AddedProduct).catalogProductId);
  add((action as AddedProduct).backendId);

  return Array.from(ids);
}

export function visitProductToFormAction(line: {
  id: string;
  quantity?: number;
  price?: number | null;
  billingConfirmationStatus?: any;
  source?: string | null;
  confirmedBy?: { firstName?: string | null; lastName?: string | null } | null;
  product: {
    id: string;
    name: string;
    type?: string;
    clinicPrice?: number | null;
    privateRhicPrice?: number | null;
    quantifiable?: boolean | null;
  };
}): FormAction {
  const isConsumable = line.product.type === "CONSUMABLE_DEVICE";
  const price = Number(
    line.price ?? line.product.clinicPrice ?? line.product.privateRhicPrice ?? 0,
  );
  const confirmedByName = line.confirmedBy
    ? [line.confirmedBy.firstName, line.confirmedBy.lastName].filter(Boolean).join(" ")
    : null;
  return {
    id: `visit-prod-${line.id}`,
    name: line.product.name,
    type: isConsumable ? "consumable" : "action",
    quantity: line.quantity || 1,
    privatePrice: price,
    isQuantifiable: line.product.quantifiable !== false,
    backendId: String(line.id),
    rawData: { id: line.product.id, product: line.product },
    source: "saved",
    profileSource: line.source === "PROFILE",
    billingConfirmationStatus: line.billingConfirmationStatus || null,
    confirmedByName,
  };
}

export function formActionToAddedProduct(action: FormAction): AddedProduct {
  const productType =
    action.type === "consumable"
      ? "CONSUMABLE_DEVICE"
      : String(action.rawData?.product?.type || "MEDICAL_ACT");
  return {
    id: action.id,
    name: action.name,
    type: productType,
    qty: action.quantity,
    price: action.privatePrice ?? 0,
    backendId: action.backendId,
    catalogProductId: String(action.rawData?.id || action.rawData?.product?.id || ""),
    removedFromVisit: action.removedFromVisit,
    billingConfirmationStatus: action.billingConfirmationStatus ?? undefined,
    confirmedByName: action.confirmedByName ?? undefined,
  };
}

export function addedProductToFormAction(product: AddedProduct): FormAction {
  return {
    id: product.id,
    name: product.name,
    type: product.type === "CONSUMABLE_DEVICE" ? "consumable" : "action",
    quantity: product.qty,
    privatePrice: product.price,
    isQuantifiable: true,
    backendId: product.backendId,
    rawData: product.catalogProductId
      ? { id: product.catalogProductId, product: { id: product.catalogProductId, name: product.name, type: product.type } }
      : undefined,
    source: product.backendId ? "saved" : "local",
    removedFromVisit: product.removedFromVisit,
    billingConfirmationStatus: product.billingConfirmationStatus ?? null,
    confirmedByName: product.confirmedByName ?? null,
  };
}

/**
 * Strips clinical extension block answers from form answers before storage.
 * Clinical items (products, diagnoses, medications) are managed directly on
 * visit_department relational entities, so we do not duplicate them into JSON answers.
 */
export function stripClinicalAnswers(
  answers: FormAnswers,
  blocks?: FormBlock[],
): FormAnswers {
  if (!answers) return {};
  if (!blocks || blocks.length === 0) return answers;

  const clinicalBlockIds = new Set(
    findClinicalBlocks(blocks).map((b) => b.id),
  );

  const cleaned: FormAnswers = {};
  Object.entries(answers).forEach(([key, val]) => {
    if (!clinicalBlockIds.has(key)) {
      cleaned[key] = val;
    }
  });
  return cleaned;
}
