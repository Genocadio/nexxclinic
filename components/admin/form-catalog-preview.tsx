"use client";

// @ts-nocheck - extracted from app/admin/forms/page.tsx (legacy untyped editor)
import { Badge } from "@/components/ui/badge";
import type { FormField, FormSection } from "@/lib/form-storage";
import type { BackendForm } from "@/lib/form-builder-types";

export function FormCatalogPreview({ form }: { form: BackendForm | null }) {
  if (!form) {
    return (
      <p className="text-sm text-muted-foreground">
        No form loaded for preview.
      </p>
    );
  }

  const orderedItems = [
    ...(form.fields || []).map((field) => ({
      ...field,
      itemType: "field" as const,
    })),
    ...(form.sections || []).map((section) => ({
      ...section,
      itemType: "section" as const,
    })),
  ].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant={form.status === "FINAL" ? "secondary" : "default"}>
          {form.status === "FINAL" ? "Final" : "Draft"}
        </Badge>
        {form.version && (
          <Badge variant="outline">Version {form.version}</Badge>
        )}
      </div>

      {orderedItems.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          This form has no fields yet.
        </p>
      ) : (
        orderedItems.map((item) => {
          if (item.itemType === "field") {
            const field = item as FormField & { itemType: "field" };
            return (
              <div key={field.id} className="rounded-lg border p-3 space-y-1">
                <p className="text-sm font-medium">
                  {field.label}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({field.type})
                  </span>
                </p>
                {field.placeholder && (
                  <p className="text-xs text-muted-foreground">
                    Placeholder: {field.placeholder}
                  </p>
                )}
                {field.options && field.options.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Options: {field.options.join(", ")}
                  </p>
                )}
              </div>
            );
          }

          const section = item as FormSection & { itemType: "section" };
          return (
            <div key={section.id} className="rounded-lg border p-3 space-y-2">
              <div>
                <p className="text-sm font-semibold">{section.title}</p>
                <p className="text-xs text-muted-foreground">
                  {section.columns} column(s)
                </p>
              </div>
              {(section.fields || []).length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No fields in this section.
                </p>
              ) : (
                <div className="space-y-1">
                  {(section.fields || []).map((field) => (
                    <p key={field.id} className="text-xs">
                      {field.label}{" "}
                      <span className="text-muted-foreground">
                        ({field.type})
                      </span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
