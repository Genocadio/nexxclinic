import type { FormBlock } from "@/lib/formbuilder-storage";
import type { FormAction } from "@/lib/form-storage";
import type { VisitDepartment } from "@/hooks/types";
import type { AddedProduct, DiagEntry, FormAnswers, MedFullEntry, MedMiniEntry } from "../../renderer/types";
import { collectAnswerableBlocks } from "../../renderer/utils";

export const SYNC_BLOCK_TYPES = new Set([
  "product_listener",
  "diagnostic_record",
  "medication_full",
  "medication_mini",
]);

export function findSyncBlocks(blocks: FormBlock[]) {
  return collectAnswerableBlocks(blocks).filter((b) =>
    SYNC_BLOCK_TYPES.has(b.type),
  );
}

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
  product: {
    id: string;
    name: string;
    type?: string;
    clinicPrice?: number | null;
    privateRhicPrice?: number | null;
  };
}): FormAction {
  const isConsumable = line.product.type === "CONSUMABLE_DEVICE";
  const price = Number(
    line.price ?? line.product.clinicPrice ?? line.product.privateRhicPrice ?? 0,
  );
  return {
    id: `visit-prod-${line.id}`,
    name: line.product.name,
    type: isConsumable ? "consumable" : "action",
    quantity: line.quantity || 1,
    privatePrice: price,
    isQuantifiable: true,
    backendId: String(line.id),
    rawData: { id: line.product.id, product: line.product },
    source: "saved",
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
    price: action.privatePrice,
    backendId: action.backendId,
    catalogProductId: String(action.rawData?.id || action.rawData?.product?.id || ""),
    removedFromVisit: action.removedFromVisit,
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
  };
}

export function hydrateClinicalAnswers(
  blocks: FormBlock[],
  answers: FormAnswers,
  visitDepartment: Pick<VisitDepartment, "diagnostics" | "medications">,
): FormAnswers | null {
  const syncBlocks = findSyncBlocks(blocks);
  const diagnosticBlocks = syncBlocks.filter((b) => b.type === "diagnostic_record");
  const medFullBlocks = syncBlocks.filter((b) => b.type === "medication_full");
  const medMiniBlocks = syncBlocks.filter((b) => b.type === "medication_mini");

  const backendDiagnostics = visitDepartment.diagnostics ?? [];
  const backendMedications = visitDepartment.medications ?? [];

  let changed = false;
  const next = { ...answers };

  const existingMedicationIds = new Set<string>();
  Object.values(next).forEach((val) => {
    if (Array.isArray(val)) {
      val.forEach((item: { id?: string }) => {
        if (item?.id) existingMedicationIds.add(String(item.id));
      });
    }
  });

  diagnosticBlocks.forEach((block) => {
    const current = (Array.isArray(next[block.id]) ? next[block.id] : []) as DiagEntry[];
    const existingKeys = new Set(
      current.map(
        (item) =>
          `${item.id}:${item.diagnosis.toLowerCase()}:${String(item.description || "").toLowerCase()}`,
      ),
    );
    const missing = backendDiagnostics
      .map((item) => ({
        id: String(item.id || `diag_${Date.now()}`),
        diagnosis: String(item.diagnosisName || ""),
        description: String(item.icd11Code || "") || undefined,
      }))
      .filter((item) => {
        const key = `${item.id}:${item.diagnosis.toLowerCase()}:${String(item.description || "").toLowerCase()}`;
        return item.diagnosis && !existingKeys.has(key);
      });
    if (missing.length > 0) {
      next[block.id] = [...current, ...missing];
      changed = true;
    }
  });

  const targetMedBlocks =
    medFullBlocks.length > 0 ? medFullBlocks : medMiniBlocks;

  targetMedBlocks.forEach((block) => {
    const current: (MedFullEntry | MedMiniEntry)[] = Array.isArray(next[block.id])
      ? (next[block.id] as (MedFullEntry | MedMiniEntry)[])
      : [];
    const existingKeys = new Set(
      (current as Array<{ id?: string; name?: string; notes?: string }>).map(
        (item) =>
          `${item.id}:${String(item.name || "").toLowerCase()}:${String(item.notes || "").toLowerCase()}`,
      ),
    );

    const missing = backendMedications
      .map((item) => {
        const parsed = parseMedicationInstructions(String(item.instructions || ""));
        if (block.type === "medication_full") {
          return {
            id: String(item.id || `med_full_${Date.now()}`),
            name: String(item.medicationName || ""),
            frequency: parsed.frequency,
            amount: parsed.amount,
            days: parsed.days,
            notes: parsed.notes || undefined,
          } satisfies MedFullEntry;
        }
        return {
          id: String(item.id || `med_mini_${Date.now()}`),
          name: String(item.medicationName || ""),
          notes: String(item.instructions || "") || undefined,
        } satisfies MedMiniEntry;
      })
      .filter((item) => {
        const key = `${item.id}:${String(item.name || "").toLowerCase()}:${String((item as MedMiniEntry).notes || "").toLowerCase()}`;
        if (!item.name) return false;
        if (existingKeys.has(key)) return false;
        if (existingMedicationIds.has(String(item.id))) return false;
        return true;
      });

    if (missing.length > 0) {
      next[block.id] = [...current, ...missing];
      changed = true;
    }
  });

  return changed ? next : null;
}

export function hydrateProductAnswers(
  blocks: FormBlock[],
  answers: FormAnswers,
  visitProducts: FormAction[],
): FormAnswers | null {
  const productBlocks = findSyncBlocks(blocks).filter(
    (b) => b.type === "product_listener",
  );
  if (productBlocks.length === 0 || visitProducts.length === 0) return null;

  let changed = false;
  const next = { ...answers };

  productBlocks.forEach((block) => {
    const current = (Array.isArray(next[block.id]) ? next[block.id] : []) as AddedProduct[];
    const currentIds = new Set(current.flatMap((p) => extractProductIdentifiers(p)));

    const missing = visitProducts.filter((product) => {
      const ids = extractProductIdentifiers(product);
      return !ids.some((id) => currentIds.has(id));
    });

    if (missing.length > 0) {
      next[block.id] = [...current, ...missing.map(formActionToAddedProduct)];
      changed = true;
    }
  });

  return changed ? next : null;
}

export function markRemovedVisitProducts(
  answers: FormAnswers,
  blocks: FormBlock[],
  visitProducts: FormAction[],
): FormAnswers | null {
  const productBlocks = findSyncBlocks(blocks).filter(
    (b) => b.type === "product_listener",
  );
  if (productBlocks.length === 0) return null;

  const visitIds = new Set(visitProducts.flatMap(extractProductIdentifiers));
  let changed = false;
  const next = { ...answers };

  productBlocks.forEach((block) => {
    const current = (Array.isArray(next[block.id]) ? next[block.id] : []) as AddedProduct[];
    let blockChanged = false;
    const updated = current.map((product) => {
      if (!product.backendId) return product;
      const exists = visitIds.has(String(product.backendId));
      const removedFromVisit = !exists;
      if (product.removedFromVisit === removedFromVisit) return product;
      blockChanged = true;
      changed = true;
      return { ...product, removedFromVisit };
    });
    if (blockChanged) next[block.id] = updated;
  });

  return changed ? next : null;
}
