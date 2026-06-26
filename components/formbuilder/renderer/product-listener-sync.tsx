"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormActionsDisplay from "@/components/form-actions-display";
import { ProductLockedTooltip } from "@/components/consultation/product-locked-tooltip";
import type { FormBlock } from "@/lib/formbuilder-storage";
import type { AddedProduct } from "./types";
import type { MedicalBlockHandlers } from "../extensions/types";
import { EntryList, PTYPE_COLOR, PTYPE_LABEL } from "./medical-shared";
import { Package } from "lucide-react";

export function ProductListenerWithVisitSync({
  block,
  value,
  onChange,
  isError,
  edit,
  handlers,
  visitId,
  departmentId,
}: {
  block: FormBlock;
  value: AddedProduct[];
  onChange: (v: AddedProduct[]) => void;
  isError?: boolean;
  edit: boolean;
  handlers: MedicalBlockHandlers;
  visitId?: string;
  departmentId?: string;
}) {
  const locked = handlers.productsLocked ?? false;
  const actions = handlers.productActions ?? [];

  return (
    <div className="my-3">
      <label className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
        <Package className="h-3.5 w-3.5 text-orange-600" />
        {block.label || "Products / Procedures"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`space-y-2 p-3 rounded-lg border ${isError ? "border-red-400 bg-red-50/20 dark:bg-red-950/10" : "border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/10"}`}
      >
        {edit && !handlers.hideProductAddButton && (
          <div
            className={
              block.productListenerCenter ? "flex justify-center" : "flex"
            }
          >
            <ProductLockedTooltip locked={locked} className="inline-flex">
              <Button
                type="button"
                variant="outline"
                disabled={locked}
                onClick={() => handlers.onOpenProductPicker?.()}
                className="inline-flex h-9 px-4 rounded-xl gap-2 border-border/70 bg-card/70 hover:bg-card shadow-sm"
              >
                <Plus className="h-4 w-4" />
                {block.label || "Add Product"}
              </Button>
            </ProductLockedTooltip>
          </div>
        )}

        {actions.length > 0 ? (
          <FormActionsDisplay
            items={actions}
            hideLabel
            visitId={visitId}
            departmentId={departmentId}
            readOnly={locked}
            onUpdateQuantity={
              locked
                ? undefined
                : handlers.onUpdateProductQuantity
                  ? (id, qty) => handlers.onUpdateProductQuantity?.(id, qty)
                  : undefined
            }
            onRemove={
              locked
                ? undefined
                : handlers.onRemoveProduct
                  ? (id) => handlers.onRemoveProduct?.(id)
                  : undefined
            }
            onRestore={
              locked
                ? undefined
                : handlers.onRestoreProduct
                  ? (id) => handlers.onRestoreProduct?.(id)
                  : undefined
            }
          />
        ) : (
          <EntryList
            emptyLabel="No products selected"
            items={value}
            render={(item) => (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Package className="h-3 w-3 text-orange-500 shrink-0" />
                <span className="flex-1 font-medium truncate">{item.name}</span>
                {item.type && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${PTYPE_COLOR[item.type] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {PTYPE_LABEL[item.type] ?? item.type}
                  </span>
                )}
                <span className="text-muted-foreground shrink-0">
                  {item.price > 0 ? `${item.price.toLocaleString()} RWF` : "—"}
                </span>
              </div>
            )}
            onRemove={
              edit
                ? (id) => onChange(value.filter((item) => item.id !== id))
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
