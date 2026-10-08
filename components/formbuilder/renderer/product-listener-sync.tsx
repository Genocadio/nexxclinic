"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Package, Search } from "lucide-react";
import { useProductSearch } from "@/hooks/products";
import FormActionsDisplay from "@/components/form-actions-display";
import type { FormBlock } from "@/lib/formbuilder-storage";
import type { Product } from "@/lib/api-types";
import type { AddedProduct } from "./types";
import type { MedicalBlockHandlers } from "../extensions/types";
import { EntryList, PTYPE_COLOR, PTYPE_LABEL } from "./medical-shared";
import { getInsuranceAwarePricing, getInsuranceDisplayName } from "@/lib/insurance-utils";
import { formatRWF } from "@/lib/utils";

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
  const linkedInsurances = useMemo(() => {
    const providers = new Map(
      (handlers.linkedInsurances ?? []).map((insurance) => [
        insurance.insuranceProvider.id,
        insurance,
      ]),
    );
    return Array.from(providers.values());
  }, [handlers.linkedInsurances]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const { products, loading, error } = useProductSearch(debouncedQuery, {
    size: 10,
    visitDepartmentId: handlers.visitDepartmentId,
  });

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedQuery(searchTerm.trim()),
      250,
    );
    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  const addProduct = async (product: Product) => {
    if (!handlers.onAddProduct || addingProductId) return;
    setAddingProductId(String(product.id));
    try {
      const added = await handlers.onAddProduct(
        product.type === "CONSUMABLE_DEVICE" ? "consumable" : "action",
        {
          id: String(product.id),
          name: product.name,
          privatePrice: product.privateRhicPrice ?? product.clinicPrice ?? 0,
          isQuantifiable: product.quantifiable !== false,
        },
        1,
      );
      if (added) {
        setSearchTerm("");
        setDebouncedQuery("");
      }
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <div className="my-3">
      <label className="text-sm leading-5 font-medium flex items-center gap-1.5 mb-1.5 text-foreground">
        <Package className="h-3.5 w-3.5 text-orange-600" />
        {block.label || "Products / Procedures"}
        {block.required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`space-y-3 p-3.5 rounded-xl border transition-colors shadow-xs ${
          isError
            ? "border-red-400 bg-red-50/40 dark:bg-red-950/20"
            : "border-orange-200/80 dark:border-orange-800/70 bg-orange-50/50 dark:bg-orange-950/30"
        }`}
      >
        {edit && !handlers.hideProductAddButton && handlers.onAddProduct && (
          <div className="space-y-1.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                disabled={locked}
                placeholder="Search products and procedures…"
                autoComplete="off"
                aria-label="Search products and procedures"
                className="h-9 pl-9 pr-9 rounded-xl bg-white dark:bg-slate-900"
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
            {searchTerm.trim().length >= 2 && (
              <div
                role="listbox"
                aria-label="Product search results"
                className="max-h-56 overflow-y-auto rounded-lg border border-border bg-background"
              >
                {error ? (
                  <p className="px-3 py-2 text-xs text-destructive">
                    Product search is unavailable. Please try again.
                  </p>
                ) : searchTerm.trim() !== debouncedQuery.trim() || (loading && products.length === 0) ? (
                  <p className="px-3 py-2 text-xs text-muted-foreground">
                    Searching products…
                  </p>
                ) : products.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-muted-foreground">
                    No products found.
                  </p>
                ) : (
                  products.map((product: Product) => (
                    <button
                      key={product.id}
                      type="button"
                      role="option"
                      aria-selected={false}
                      disabled={Boolean(addingProductId)}
                      onClick={() => void addProduct(product)}
                      className="flex w-full items-center gap-3 border-b border-border/50 px-3 py-2 text-left text-sm last:border-0 hover:bg-muted/60 disabled:opacity-50"
                    >
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {product.name}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {PTYPE_LABEL[product.type] ?? product.type}
                      </span>
                      <span className="flex shrink-0 flex-wrap justify-end gap-x-2 text-xs font-medium text-foreground">
                        {linkedInsurances.length === 1
                          ? formatRWF(
                              getInsuranceAwarePricing(product, linkedInsurances)
                                .price,
                            )
                          : linkedInsurances.length > 1
                            ? linkedInsurances.map((insurance) => (
                                <span
                                  key={insurance.id}
                                  className="whitespace-nowrap"
                                >
                                  {getInsuranceDisplayName(
                                    insurance.insuranceProvider,
                                  )}
                                  :{" "}
                                  {formatRWF(
                                    getInsuranceAwarePricing(product, [
                                      insurance,
                                    ]).price,
                                  )}
                                </span>
                              ))
                            : formatRWF(
                                Number(
                                  product.clinicPrice ??
                                    product.privateRhicPrice ??
                                    0,
                                ),
                              )}
                      </span>
                      {addingProductId === String(product.id) && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
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
                    className={`text-[11px] px-1.5 py-0.5 rounded font-medium shrink-0 ${PTYPE_COLOR[item.type] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {PTYPE_LABEL[item.type] ?? item.type}
                  </span>
                )}
                <span className="text-xs font-semibold tabular-nums text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5 leading-none shrink-0">
                  ×{item.qty ?? 1}
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
