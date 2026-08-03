/**
 * editor-utils.ts - Shared helpers for the form editor UI (admin forms page
 * and the extracted FieldEditor component). Kept here so both consumers use
 * one copy of the table-header / conditional-value logic.
 */
import type { FormAction, TableHeaderPlacement } from "@/lib/form-storage";

export const headerPlacementHasSide = (
  placement: TableHeaderPlacement | undefined,
  side: "top" | "left" | "right",
) => {
  if (!placement || placement === "none") return false;
  if (placement === "both") return side === "top" || side === "left";
  return placement.split("-").includes(side);
};

export const buildTableHeaderPlacement = (sides: {
  top: boolean;
  left: boolean;
  right: boolean;
}): TableHeaderPlacement => {
  const active = ["top", "left", "right"].filter(
    (side) => sides[side as keyof typeof sides],
  );
  if (active.length === 0) return "none";
  if (active.length === 3) return "top-left-right";
  return active.join("-") as TableHeaderPlacement;
};

export const normalizeTableHeaderPlacement = (
  placement: TableHeaderPlacement | undefined,
): TableHeaderPlacement => {
  if (!placement) return "none";
  if (placement === "both") return "top-left";
  return placement;
};

export const splitConditionalValues = (value?: string): string[] => {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const matchesConditionalProductValue = (
  item: FormAction,
  expectedValue: string,
): boolean => {
  const expected = expectedValue.trim().toLowerCase();
  if (!expected) return false;

  const name = String(item.name || "")
    .trim()
    .toLowerCase();
  const ids = [
    item.id,
    item.backendId,
    item.rawData?.id,
    item.rawData?.product?.id,
    item.rawData?.action?.id,
    item.rawData?.consumable?.id,
  ]
    .filter(Boolean)
    .map((id) => String(id).trim().toLowerCase());

  return name.includes(expected) || ids.includes(expected);
};
