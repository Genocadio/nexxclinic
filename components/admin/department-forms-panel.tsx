"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Link2, Unlink, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useDepartmentFormLinking,
  useDepartmentForms,
  useSearchStandaloneForms,
} from "@/hooks/standalone-forms";

interface DepartmentFormsPanelProps {
  departmentId: string;
  departmentName?: string;
}

export function DepartmentFormsPanel({
  departmentId,
  departmentName,
}: DepartmentFormsPanelProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedFormId, setSelectedFormId] = useState("");

  const { linkedForms, defaultForm, loading, refetch } = useDepartmentForms(departmentId);
  const { forms: availableForms, loading: searchLoading } = useSearchStandaloneForms(search);
  const { linkForm, unlinkForm, setDefaultForm, loading: mutating } =
    useDepartmentFormLinking(departmentId);

  const linkedIds = useMemo(
    () => new Set(linkedForms.map((item) => item.form.id)),
    [linkedForms],
  );

  const pickableForms = useMemo(
    () => availableForms.filter((form) => !linkedIds.has(form.id)),
    [availableForms, linkedIds],
  );

  const handleLink = async () => {
    if (!selectedFormId) return;
    try {
      await linkForm(selectedFormId);
      setSelectedFormId("");
      setSearch("");
      await refetch();
      toast({ title: "Form linked", description: "Standalone form linked to department." });
    } catch (err: unknown) {
      toast({
        title: "Link failed",
        description: err instanceof Error ? err.message : "Could not link form",
        variant: "destructive",
      });
    }
  };

  const handleUnlink = async (formId: string) => {
    try {
      await unlinkForm(formId);
      await refetch();
      toast({ title: "Form unlinked" });
    } catch (err: unknown) {
      toast({
        title: "Unlink failed",
        description: err instanceof Error ? err.message : "Could not unlink form",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (formId: string) => {
    try {
      await setDefaultForm(formId);
      await refetch();
      toast({ title: "Default form updated" });
    } catch (err: unknown) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Could not set default",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 border-t pt-6">
      <div>
        <h3 className="text-sm font-semibold">Consultation Forms</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Link standalone forms to {departmentName || "this department"}. One form is the default for new consultations.
        </p>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ) : linkedForms.length === 0 ? (
        <p className="text-xs text-muted-foreground rounded-lg border border-dashed p-4">
          No forms linked yet. Search and link a standalone form below.
        </p>
      ) : (
        <div className="space-y-2">
          {linkedForms.map(({ form, isDefault }) => (
            <div
              key={form.id}
              className="flex items-center justify-between gap-2 p-3 rounded-lg border bg-background"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium truncate">{form.name}</span>
                  {isDefault && (
                    <Badge variant="secondary" className="text-[10px] gap-1">
                      <Star className="h-3 w-3" /> Default
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {form.type}
                  {form.activeVersion?.versionLabel
                    ? ` · v${form.activeVersion.versionLabel}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!isDefault && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={mutating}
                    onClick={() => void handleSetDefault(form.id)}
                  >
                    Set default
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  disabled={mutating}
                  onClick={() => void handleUnlink(form.id)}
                  title="Unlink form"
                >
                  <Unlink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {defaultForm && !linkedForms.some((item) => item.isDefault) && (
            <p className="text-xs text-amber-600">
              Default form is set but not listed — try refreshing.
            </p>
          )}
        </div>
      )}

      <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground">Link a standalone form</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search forms by name or category…"
            className="pl-9"
          />
        </div>
        <div className="max-h-40 overflow-y-auto space-y-1">
          {searchLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : pickableForms.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">
              {search ? "No matching forms." : "Type to search standalone forms."}
            </p>
          ) : (
            pickableForms.slice(0, 20).map((form) => (
              <button
                key={form.id}
                type="button"
                onClick={() => setSelectedFormId(form.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm border transition-colors ${
                  selectedFormId === form.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-muted"
                }`}
              >
                <span className="font-medium">{form.name}</span>
                <span className="text-xs text-muted-foreground ml-2">{form.type}</span>
              </button>
            ))
          )}
        </div>
        <Button
          className="w-full gap-2"
          disabled={!selectedFormId || mutating}
          onClick={() => void handleLink()}
        >
          <Link2 className="h-4 w-4" />
          Link selected form
        </Button>
      </div>
    </div>
  );
}
