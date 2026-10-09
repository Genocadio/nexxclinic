import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";

export const PTYPE_LABEL: Record<string, string> = {
  DRUG: "Drug",
  MEDICAL_ACT: "Procedure",
  BIOLOGICAL_ACT: "Biological",
  CONSUMABLE_DEVICE: "Consumable",
};

export const PTYPE_COLOR: Record<string, string> = {
  DRUG: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  MEDICAL_ACT:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  BIOLOGICAL_ACT:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  CONSUMABLE_DEVICE:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
};

export function EntryList<T extends { id: string }>({
  items,
  render,
  onRemove,
  onEdit,
  emptyLabel,
}: {
  items: T[];
  render: (item: T) => React.ReactNode;
  onRemove?: (id: string) => void;
  onEdit?: (id: string) => void;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground italic">{emptyLabel}</p>;
  }
  return (
    <div className="space-y-1.5 pt-2 border-t border-border/60">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-2 px-3 py-2 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-sm shadow-xs transition-colors"
        >
          {render(item)}
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(item.id)}
              className="mt-0.5 p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0 transition-colors"
              aria-label="Edit"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="mt-0.5 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
