import type { BillingItem } from "@/lib/billing-utils";

/** Type of a coverage/patient-share % resolver (getCoveragePercentageForBillingItem). */
export type ResolveCoveragePct = (item: BillingItem) => number;

/**
 * Serialize the change-relevant state of a single billing item into a stable
 * JSON string. `resolveSnapshotPct` yields the currently-resolved coverage /
 * patient-share percentage for the item.
 *
 * We include the resolved percentage (`pct`) in addition to the raw item
 * fields because the displayed insurance/patient amounts are DERIVED from it.
 * A change that only affects the resolved percentage — without touching
 * selectedInsuranceId / selectedCoverageId / price etc. — would otherwise be
 * invisible to change detection.
 */
export function serializeBillingItem(
  item: BillingItem,
  resolveSnapshotPct: ResolveCoveragePct,
): string {
  return JSON.stringify({
    q: item.quantity,
    ei: item.selectedInsuranceId,
    ec: item.selectedCoverageId,
    et: item.exemptionType,
    ex: item.exempted,
    er: item.exemptionReason,
    inc: item.insuranceNotCovered,
    pr: item.processorId,
    p: item.price,
    pct: resolveSnapshotPct(item),
  });
}

/** Serialize the *baseline* (frozen) state of a snapshot item. */
function serializeSnapshotItem(
  item: BillingItem,
  resolveSnapshotPct: ResolveCoveragePct,
): string {
  return JSON.stringify({
    q: item.quantity,
    ei: item.selectedInsuranceId,
    ec: item.selectedCoverageId,
    et: item.exemptionType,
    ex: item.exempted,
    er: item.exemptionReason,
    inc: item.insuranceNotCovered,
    pr: item.processorId,
    p: item.price,
    // Use the frozen `snapshotPct` baked at capture time so insurance-data
    // edits DURING the session are still detected rather than masked.
    pct: item.snapshotPct ?? resolveSnapshotPct(item),
  });
}

/**
 * Build the frozen snapshot baseline used for edit-mode change detection.
 * Each item gets its resolved % baked onto `snapshotPct` so the baseline is
 * stable even if insurance/coverage data changes later.
 */
export function snapshotBillingItems(
  items: BillingItem[] | null,
  resolveSnapshotPct: ResolveCoveragePct,
): BillingItem[] | null {
  return items?.map((item) => ({
    ...item,
    snapshotPct: resolveSnapshotPct(item),
  })) ?? null;
}

/**
 * Per-item change map used to render NEW / CHANGED badges in edit mode.
 * `"added"` = not in the snapshot, `"modified"` = same id but different state.
 */
export function detectEditedItemChanges(
  currentItems: BillingItem[],
  snapshotItems: BillingItem[],
  resolveSnapshotPct: ResolveCoveragePct,
): Map<string, "added" | "modified"> {
  const map = new Map<string, "added" | "modified">();
  const snapshotMap = new Map(
    snapshotItems.map((item) => [
      item.id,
      serializeSnapshotItem(item, resolveSnapshotPct),
    ]),
  );
  const snapshotIds = new Set(snapshotItems.map((item) => item.id));

  for (const item of currentItems) {
    if (!snapshotIds.has(item.id)) {
      map.set(item.id, "added");
    } else {
      const snapStr = snapshotMap.get(item.id);
      if (
        snapStr !== undefined &&
        serializeBillingItem(item, resolveSnapshotPct) !== snapStr
      ) {
        map.set(item.id, "modified");
      }
    }
  }
  return map;
}

/**
 * Whether any of the current items differ from the edit-mode snapshot baseline
 * (added / removed / changed). This powers the Complete Edit button and any
 * "changes detected" indicator.
 */
export function hasEditChanges(
  currentItems: BillingItem[],
  snapshotItems: BillingItem[] | null,
  resolveSnapshotPct: ResolveCoveragePct,
): boolean {
  if (!snapshotItems) return false;
  if (currentItems.length !== snapshotItems.length) return true;

  const snapshotIds = new Set(snapshotItems.map((item) => item.id));
  for (const item of currentItems) {
    if (!snapshotIds.has(item.id)) return true; // added
  }
  for (const id of snapshotIds) {
    if (!currentItems.some((item) => item.id === id)) return true; // removed
  }

  const snapshotMap = new Map(
    snapshotItems.map((item) => [
      item.id,
      serializeSnapshotItem(item, resolveSnapshotPct),
    ]),
  );
  for (const item of currentItems) {
    const snapStr = snapshotMap.get(item.id);
    if (snapStr === undefined) return true;
    if (serializeBillingItem(item, resolveSnapshotPct) !== snapStr) return true;
  }
  return false;
}
