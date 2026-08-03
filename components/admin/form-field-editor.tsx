"use client";

// @ts-nocheck - extracted from app/admin/forms/page.tsx (legacy untyped editor)
import { useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignCenter,
  PanelLeft,
  PanelRight,
  PanelTop,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getRuntimeConfig } from "@/lib/runtime-config";
import type {
  ConditionalRendering,
  FormField,
  LabRecordLayout,
  LabRecordRowConfig,
  TableConfig,
  TableHeaderPlacement,
} from "@/lib/form-storage";
import {
  buildTableHeaderPlacement,
  headerPlacementHasSide,
  splitConditionalValues,
} from "@/hooks/forms/editor-utils";

export function FieldEditor({
  field,
  label,
  setLabel,
  type,
  setType,
  placeholder,
  setPlaceholder,
  required,
  setRequired,
  hideLabel,
  setHideLabel,
  boldLabel,
  setBoldLabel,
  centerLabel,
  setCenterLabel,
  italicLabel,
  setItalicLabel,
  underlineLabel,
  setUnderlineLabel,
  options,
  setOptions,
  tableMode,
  setTableMode,
  tableRows,
  setTableRows,
  tableColumns,
  setTableColumns,
  tableHeaderPlacement,
  setTableHeaderPlacement,
  tableColumnHeaders,
  setTableColumnHeaders,
  tableRowHeaders,
  setTableRowHeaders,
  labRecordLayout,
  setLabRecordLayout,
  labRecordRows,
  setLabRecordRows,
  conditionalEnabled,
  setConditionalEnabled,
  conditionalDependsOn,
  setConditionalDependsOn,
  conditionalCondition,
  setConditionalCondition,
  conditionalValue,
  setConditionalValue,
  conditionalItemType,
  setConditionalItemType,
  availableFields,
  onSave,
  onClose,
}: {
  field: FormField | null;
  label: string;
  setLabel: (v: string) => void;
  type: FormField["type"];
  setType: (v: FormField["type"]) => void;
  placeholder: string;
  setPlaceholder: (v: string) => void;
  required: boolean;
  setRequired: (v: boolean) => void;
  hideLabel: boolean;
  setHideLabel: (v: boolean) => void;
  boldLabel: boolean;
  setBoldLabel: (v: boolean) => void;
  centerLabel: boolean;
  setCenterLabel: (v: boolean) => void;
  italicLabel: boolean;
  setItalicLabel: (v: boolean) => void;
  underlineLabel: boolean;
  setUnderlineLabel: (v: boolean) => void;
  options: string;
  setOptions: (v: string) => void;
  tableMode: TableConfig["mode"];
  setTableMode: (v: TableConfig["mode"]) => void;
  tableRows: number;
  setTableRows: (v: number) => void;
  tableColumns: number;
  setTableColumns: (v: number) => void;
  tableHeaderPlacement: TableHeaderPlacement;
  setTableHeaderPlacement: (v: TableHeaderPlacement) => void;
  tableColumnHeaders: string;
  setTableColumnHeaders: (v: string) => void;
  tableRowHeaders: string;
  setTableRowHeaders: (v: string) => void;
  labRecordLayout: LabRecordLayout;
  setLabRecordLayout: (v: LabRecordLayout) => void;
  labRecordRows: LabRecordRowConfig[];
  setLabRecordRows: (v: LabRecordRowConfig[]) => void;
  conditionalEnabled: boolean;
  setConditionalEnabled: (v: boolean) => void;
  conditionalDependsOn: string;
  setConditionalDependsOn: (v: string) => void;
  conditionalCondition: ConditionalRendering["condition"];
  setConditionalCondition: (v: ConditionalRendering["condition"]) => void;
  conditionalValue: string;
  setConditionalValue: (v: string) => void;
  conditionalItemType: "action" | "consumable" | "product";
  setConditionalItemType: (v: "action" | "consumable" | "product") => void;
  availableFields: FormField[];
  onSave: () => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"nameType" | "config">(
    field ? "config" : "nameType",
  );
  const showPlaceholder = ![
    "select",
    "radio",
    "checkbox",
    "table",
    "labRecord",
    "actionListener",
  ].includes(type);

  useEffect(() => {
    setStep(field ? "config" : "nameType");
  }, [field]);
  const [itemSearch, setItemSearch] = useState("");
  const [itemOptions, setItemOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedItemNames, setSelectedItemNames] = useState<
    Record<string, string>
  >({});
  const [itemLoading, setItemLoading] = useState(false);
  const selectedProductIds = splitConditionalValues(conditionalValue);

  const addConditionalProduct = (item: { id: string; name: string }) => {
    if (selectedProductIds.includes(item.id)) {
      setItemSearch("");
      setItemOptions([]);
      return;
    }

    setSelectedItemNames((prev) => ({ ...prev, [item.id]: item.name }));
    setConditionalValue([...selectedProductIds, item.id].join(","));
    setItemSearch("");
    setItemOptions([]);
  };

  const removeConditionalProduct = (id: string) => {
    setConditionalValue(
      selectedProductIds.filter((itemId) => itemId !== id).join(","),
    );
  };

  useEffect(() => {
    if (conditionalCondition !== "hasItem") {
      setItemSearch("");
      return;
    }

    if (!conditionalValue) {
      setItemSearch("");
    }
  }, [conditionalValue, conditionalCondition]);

  useEffect(() => {
    if (conditionalCondition !== "hasItem") {
      setItemOptions([]);
      return;
    }
    const q = itemSearch.trim();
    if (q.length < 2) {
      setItemOptions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setItemLoading(true);
        const baseUrl = getRuntimeConfig().API_BASE_URL || "http://backend:8080";
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken") || ""
            : "";
        const query = `query SearchProducts($name: String, $page: Int, $size: Int) { products(input: { name: $name, page: $page, size: $size }) { data { id name type genericName } } }`;
        const variables = { name: q, page: 0, size: 10 };
        const resp = await fetch(`${baseUrl}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ query, variables }),
          signal: controller.signal,
        });
        if (!resp.ok) throw new Error("search failed");
        const data = await resp.json();
        const items = data?.data?.products?.data || [];
        const uniqueItems: { id: string; name: string }[] = Array.from(
          new Map(
            (items || [])
              .filter((it: any) => it?.id && it?.name)
              .map((it: any) => [
                String(it.id),
                { id: String(it.id), name: String(it.name || "").trim() },
              ]),
          ).values(),
        ) as { id: string; name: string }[];
        setItemOptions(uniqueItems);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          setItemOptions([]);
        }
      } finally {
        setItemLoading(false);
      }
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [itemSearch, conditionalCondition]);
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-2xl space-y-5 max-h-[70vh] overflow-y-auto scrollbar-hide rounded-2xl border border-border/50 bg-[#FBF2ED] dark:bg-slate-900 shadow-lg p-2 sm:p-4">
        {/** Step 1: name + type for new fields; Step 2: type-specific config. */}
        {!field && step === "nameType" ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Label</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Type</label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as FormField["type"])}
              >
                <SelectTrigger className="w-full min-w-0 text-left truncate flex items-center justify-between">
                  <SelectValue className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="radio">Radio</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="labRecord">Lab Record</SelectItem>
                  <SelectItem value="diagnosticRecord">
                    Diagnostic Record
                  </SelectItem>
                  <SelectItem value="medicationLongForm">
                    Medication Long Form
                  </SelectItem>
                  <SelectItem value="medicationMiniForm">
                    Medication Mini Form
                  </SelectItem>
                  <SelectItem value="actionListener">
                    Product Listener
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-8 pt-3 sm:pt-6 border-t border-border/30 sticky bottom-0 left-0 right-0 bg-gradient-to-t from-[#FBF2ED] dark:from-slate-900 to-[#FBF2ED]/95 dark:to-slate-900/95 -mx-2 sm:-mx-4 px-2 sm:px-4 pb-2 sm:pb-4 z-50">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 sm:py-2.5 bg-background dark:bg-gray-900 border border-border/70 text-foreground hover:bg-muted/40 dark:hover:bg-muted/50 shadow-lg text-xs sm:text-base flex-1 sm:flex-initial"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep("config")}
                disabled={!label || !label.trim()}
                className="rounded-full px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-lg hover:opacity-90 transition-all duration-200 text-xs sm:text-base flex-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-medium">Label</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Label Styling</label>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant={boldLabel ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setBoldLabel(!boldLabel)}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={italicLabel ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setItalicLabel(!italicLabel)}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={underlineLabel ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setUnderlineLabel(!underlineLabel)}
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={centerLabel ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCenterLabel(!centerLabel)}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={hideLabel}
                  onCheckedChange={(v) => setHideLabel(Boolean(v))}
                />
                <span className="text-xs">Hide Label</span>
              </div>
            </div>
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Type</label>
                <Select
                  value={type}
                  onValueChange={(v) => {
                    const nextType = v as FormField["type"];
                    setType(nextType);
                    if (nextType === "table") {
                      setTableMode("STATIC");
                      setTableRows(3);
                      setTableColumns(3);
                      setTableHeaderPlacement("none");
                      setTableColumnHeaders("");
                      setTableRowHeaders("");
                    }
                    if (nextType === "labRecord") {
                      setLabRecordLayout("valueUnit");
                      setLabRecordRows(
                        Array.from({ length: 3 }, (_, idx) => ({
                          id: `lab_row_${idx + 1}`,
                          name: `Row ${idx + 1}`,
                          unitMode: "dropdown" as "dropdown" | "none",
                          unitOptions: ["mg/dL", "mmol/L"],
                          defaultUnit: "mg/dL",
                          resultOptions: [],
                        })),
                      );
                    }
                  }}
                >
                  <SelectTrigger className="w-full min-w-0 text-left truncate flex items-center justify-between">
                    <SelectValue className="truncate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="labRecord">Lab Record</SelectItem>
                    <SelectItem value="diagnosticRecord">
                      Diagnostic Record
                    </SelectItem>
                    <SelectItem value="medicationLongForm">
                      Medication Long Form
                    </SelectItem>
                    <SelectItem value="medicationMiniForm">
                      Medication Mini Form
                    </SelectItem>
                    <SelectItem value="actionListener">
                      Product Listener
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Required</label>
                <div className="flex items-center gap-2 py-2">
                  <Checkbox
                    checked={required}
                    onCheckedChange={(v) => setRequired(Boolean(v))}
                  />
                  <span className="text-xs">Required</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={conditionalEnabled}
                  onCheckedChange={(v) => setConditionalEnabled(Boolean(v))}
                />
                <span className="text-xs font-medium">
                  Conditional Rendering
                </span>
              </div>
              {conditionalEnabled && (
                <div className="space-y-3 pl-6 border-l-2 border-border/60">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">
                      Show when field:
                    </label>
                    <Select
                      value={conditionalDependsOn}
                      onValueChange={setConditionalDependsOn}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFields
                          .filter((f) => f.id !== field?.id)
                          .map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Condition:</label>
                    {(() => {
                      const dependsOnField = availableFields.find(
                        (f) => f.id === conditionalDependsOn,
                      );
                      const isActionListener =
                        dependsOnField?.type === "actionListener";
                      return (
                        <Select
                          value={conditionalCondition}
                          onValueChange={(v) =>
                            setConditionalCondition(
                              v as ConditionalRendering["condition"],
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="notEmpty">
                              Is not empty
                            </SelectItem>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="checked">Is checked</SelectItem>
                            <SelectItem value="includes">
                              Includes option
                            </SelectItem>
                            <SelectItem
                              value="hasItem"
                              disabled={!isActionListener}
                            >
                              Has products
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    })()}
                    {(() => {
                      const dependsOnField = availableFields.find(
                        (f) => f.id === conditionalDependsOn,
                      );
                      const isActionListener =
                        dependsOnField?.type === "actionListener";
                      if (
                        conditionalCondition === "hasItem" &&
                        !isActionListener
                      ) {
                        return (
                          <p className="text-[11px] text-orange-600">
                            Select an action listener field to enable this
                            condition.
                          </p>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  {conditionalCondition !== "notEmpty" &&
                    conditionalCondition !== "checked" && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium">
                          {conditionalCondition === "hasItem"
                            ? "Search product"
                            : "Value"}
                        </label>
                        {conditionalCondition === "hasItem" &&
                        availableFields.find(
                          (f) => f.id === conditionalDependsOn,
                        )?.type === "actionListener" ? (
                          <>
                            <Input
                              value={itemSearch}
                              onChange={(e) => {
                                setItemSearch(e.target.value);
                              }}
                              placeholder="Type product name to search"
                            />
                            {selectedProductIds.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {selectedProductIds.map((id) => (
                                  <Badge
                                    key={id}
                                    variant="secondary"
                                    className="gap-1 rounded-full px-2 py-1"
                                  >
                                    <span className="max-w-[180px] truncate">
                                      {selectedItemNames[id] || id}
                                    </span>
                                    <button
                                      type="button"
                                      className="text-muted-foreground hover:text-foreground"
                                      onClick={() =>
                                        removeConditionalProduct(id)
                                      }
                                      aria-label={`Remove ${selectedItemNames[id] || id}`}
                                    >
                                      x
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {itemLoading && (
                              <p className="text-[11px] text-muted-foreground">
                                Searching products…
                              </p>
                            )}
                            {itemOptions.length > 0 && (
                              <div className="grid gap-2">
                                {itemOptions.map((item) => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    className="w-full rounded-lg border border-border/60 px-3 py-2 text-left text-sm text-foreground hover:bg-muted/30"
                                    onClick={() => addConditionalProduct(item)}
                                  >
                                    {item.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <Input
                            value={conditionalValue}
                            onChange={(e) =>
                              setConditionalValue(e.target.value)
                            }
                            placeholder={
                              conditionalCondition === "includes"
                                ? "Option text"
                                : "Enter value"
                            }
                          />
                        )}
                      </div>
                    )}
                </div>
              )}
            </div>
            <div className="space-y-2 border-t pt-4">
              {showPlaceholder ? (
                <div className="space-y-1">
                  <label className="text-xs font-medium">Placeholder</label>
                  <Input
                    value={placeholder}
                    onChange={(e) => setPlaceholder(e.target.value)}
                  />
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  This field type does not use a placeholder.
                </p>
              )}
            </div>
            {type === "table" && (
              <div className="space-y-3 border border-dashed rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Table Settings</span>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>Static preset:</span>
                    <Select
                      value={`${tableMode === "STATIC" ? tableRows : 0}x${tableMode === "STATIC" ? tableColumns : 0}`}
                      onValueChange={(value) => {
                        const [rows, columns] = value
                          .split("x")
                          .map((part) => Number(part));
                        if (rows > 0 && columns > 0) {
                          setTableMode("STATIC");
                          setTableRows(rows);
                          setTableColumns(columns);
                        }
                      }}
                    >
                      <SelectTrigger className="min-w-[8rem]">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "2x2",
                          "2x3",
                          "2x4",
                          "3x2",
                          "3x3",
                          "3x4",
                          "4x2",
                          "4x3",
                          "4x4",
                          "5x3",
                        ].map((preset) => (
                          <SelectItem key={preset} value={preset}>
                            {preset}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Mode</label>
                    <Select
                      value={tableMode}
                      onValueChange={(v) =>
                        setTableMode(v as TableConfig["mode"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STATIC">Static</SelectItem>
                        <SelectItem value="DYNAMIC">Dynamic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Headers</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { side: "top" as const, Icon: PanelTop, label: "Top" },
                        {
                          side: "left" as const,
                          Icon: PanelLeft,
                          label: "Left",
                        },
                        {
                          side: "right" as const,
                          Icon: PanelRight,
                          label: "Right",
                        },
                      ].map(({ side, Icon, label }) => {
                        const selected = headerPlacementHasSide(
                          tableHeaderPlacement,
                          side,
                        );
                        return (
                          <Button
                            key={side}
                            type="button"
                            size="icon"
                            variant={selected ? "default" : "outline"}
                            className="h-10 w-10 rounded-xl p-0"
                            aria-label={`Toggle ${label} header`}
                            onClick={() =>
                              setTableHeaderPlacement(
                                buildTableHeaderPlacement({
                                  top:
                                    side === "top"
                                      ? !selected
                                      : headerPlacementHasSide(
                                          tableHeaderPlacement,
                                          "top",
                                        ),
                                  left:
                                    side === "left"
                                      ? !selected
                                      : headerPlacementHasSide(
                                          tableHeaderPlacement,
                                          "left",
                                        ),
                                  right:
                                    side === "right"
                                      ? !selected
                                      : headerPlacementHasSide(
                                          tableHeaderPlacement,
                                          "right",
                                        ),
                                }),
                              )
                            }
                          >
                            <Icon className="h-4 w-4" />
                          </Button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {tableHeaderPlacement === "none"
                        ? "No headers selected."
                        : `Headers: ${tableHeaderPlacement.replaceAll("-", " + ")}`}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Rows</label>
                    <Input
                      type="number"
                      min={1}
                      value={tableRows}
                      onChange={(e) =>
                        setTableRows(Number(e.target.value) || 1)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Columns</label>
                    <Input
                      type="number"
                      min={1}
                      value={tableColumns}
                      onChange={(e) =>
                        setTableColumns(Number(e.target.value) || 1)
                      }
                    />
                  </div>
                </div>
                {headerPlacementHasSide(tableHeaderPlacement, "top") && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium">
                      Column Headers
                    </label>
                    <Textarea
                      rows={2}
                      value={tableColumnHeaders}
                      onChange={(e) => setTableColumnHeaders(e.target.value)}
                      placeholder="One per line"
                    />
                  </div>
                )}
                {(headerPlacementHasSide(tableHeaderPlacement, "left") ||
                  headerPlacementHasSide(tableHeaderPlacement, "right")) && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Row Headers</label>
                    <Textarea
                      rows={2}
                      value={tableRowHeaders}
                      onChange={(e) => setTableRowHeaders(e.target.value)}
                      placeholder="One per line"
                    />
                  </div>
                )}
                {tableHeaderPlacement === "none" && (
                  <p className="text-xs text-muted-foreground italic">
                    No headers configured. Table will display as a plain grid.
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  Only one axis can be variable at a time; headers are
                  configurable here and locked in the live preview.
                </p>
              </div>
            )}
            {type === "labRecord" && (
              <div className="space-y-3 border border-dashed rounded-lg p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">
                    Lab Record Settings
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs rounded-full"
                    onClick={() =>
                      setLabRecordRows([
                        ...labRecordRows,
                        {
                          id: `lab_row_${Date.now()}`,
                          name: `Row ${labRecordRows.length + 1}`,
                          unitMode:
                            labRecordLayout === "valueUnit"
                              ? "dropdown"
                              : "none",
                          unitOptions:
                            labRecordLayout === "valueUnit"
                              ? ["mg/dL", "mmol/L"]
                              : [],
                          defaultUnit:
                            labRecordLayout === "valueUnit"
                              ? "mg/dL"
                              : undefined,
                          resultOptions:
                            labRecordLayout === "result" ? ["+ve", "-ve"] : [],
                        },
                      ])
                    }
                  >
                    + Row
                  </Button>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Layout</label>
                  <Select
                    value={labRecordLayout}
                    onValueChange={(v) => {
                      const nextLayout = v as LabRecordLayout;
                      setLabRecordLayout(nextLayout);
                      setLabRecordRows(
                        Array.from({ length: 3 }, (_, idx) => ({
                          id: `lab_row_${idx + 1}`,
                          name: `Row ${idx + 1}`,
                          unitMode:
                            nextLayout === "valueUnit" ? "dropdown" : "none",
                          unitOptions:
                            nextLayout === "valueUnit"
                              ? ["mg/dL", "mmol/L"]
                              : [],
                          defaultUnit:
                            nextLayout === "valueUnit" ? "mg/dL" : undefined,
                          resultOptions:
                            nextLayout === "result" ? ["+ve", "-ve"] : [],
                        })),
                      );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="valueUnit">
                        Name / Value / Unit
                      </SelectItem>
                      <SelectItem value="result">Name / Result</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  {(labRecordRows.length > 0 ? labRecordRows : []).map(
                    (row, index) => (
                      <div
                        key={row.id || `lab-row-${index}`}
                        className="rounded-lg border bg-background p-3 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Row {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-destructive rounded-full"
                            onClick={() =>
                              setLabRecordRows(
                                labRecordRows.filter((_, idx) => idx !== index),
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Name</label>
                          <Input
                            value={row.name}
                            onChange={(e) =>
                              setLabRecordRows(
                                labRecordRows.map((item, idx) =>
                                  idx === index
                                    ? { ...item, name: e.target.value }
                                    : item,
                                ),
                              )
                            }
                            placeholder="e.g. CRP"
                          />
                        </div>
                        {labRecordLayout === "valueUnit" ? (
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                              <label className="text-xs font-medium">
                                Unit mode
                              </label>
                              <Select
                                value={row.unitMode || "dropdown"}
                                onValueChange={(v) =>
                                  setLabRecordRows(
                                    labRecordRows.map((item, idx) =>
                                      idx === index
                                        ? {
                                            ...item,
                                            unitMode: v as "dropdown" | "none",
                                          }
                                        : item,
                                    ),
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="dropdown">
                                    Dropdown
                                  </SelectItem>
                                  <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium">
                                Default unit
                              </label>
                              <Input
                                value={row.defaultUnit || ""}
                                onChange={(e) =>
                                  setLabRecordRows(
                                    labRecordRows.map((item, idx) =>
                                      idx === index
                                        ? {
                                            ...item,
                                            defaultUnit: e.target.value,
                                          }
                                        : item,
                                    ),
                                  )
                                }
                                placeholder="e.g. mg/dL"
                              />
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-xs font-medium">
                                Unit options
                              </label>
                              <Textarea
                                rows={2}
                                value={(row.unitOptions || []).join("\n")}
                                onChange={(e) =>
                                  setLabRecordRows(
                                    labRecordRows.map((item, idx) =>
                                      idx === index
                                        ? {
                                            ...item,
                                            unitOptions: e.target.value
                                              .split("\n")
                                              .map((value) => value.trim())
                                              .filter(Boolean),
                                          }
                                        : item,
                                    ),
                                  )
                                }
                                placeholder="One unit per line"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <label className="text-xs font-medium">
                              Result options
                            </label>
                            <Textarea
                              rows={2}
                              value={(row.resultOptions || []).join("\n")}
                              onChange={(e) =>
                                setLabRecordRows(
                                  labRecordRows.map((item, idx) =>
                                    idx === index
                                      ? {
                                          ...item,
                                          resultOptions: e.target.value
                                            .split("\n")
                                            .map((value) => value.trim())
                                            .filter(Boolean),
                                        }
                                      : item,
                                  ),
                                )
                              }
                              placeholder="+ve\n-ve"
                            />
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Use fixed names for the row labels. The value or result is
                  captured as the answer for each row.
                </p>
              </div>
            )}
            {(type === "select" || type === "radio" || type === "checkbox") && (
              <div className="space-y-1">
                <label className="text-xs font-medium">
                  Options (one per line)
                </label>
                <Textarea
                  rows={3}
                  value={options}
                  onChange={(e) => setOptions(e.target.value)}
                />
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-8 pt-3 sm:pt-6 border-t border-border/30 sticky bottom-0 left-0 right-0 bg-gradient-to-t from-[#FBF2ED] dark:from-slate-900 to-[#FBF2ED]/95 dark:to-slate-900/95 -mx-2 sm:-mx-4 px-2 sm:px-4 pb-2 sm:pb-4 z-50">
              <button
                type="button"
                onClick={() => {
                  if (!field) {
                    onClose();
                  } else {
                    setStep("nameType");
                  }
                }}
                className="rounded-full px-4 py-2 sm:py-2.5 bg-background dark:bg-gray-900 border border-border/70 text-foreground hover:bg-muted/40 dark:hover:bg-muted/50 shadow-lg text-xs sm:text-base flex-1 sm:flex-initial"
              >
                {field ? "Back" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={onSave}
                className="rounded-full px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-lg hover:opacity-90 transition-all duration-200 text-xs sm:text-base flex-1"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
