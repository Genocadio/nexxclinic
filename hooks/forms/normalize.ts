/**
 * normalize.ts - Canonical form-normalization functions shared by the forms
 * hooks (hooks/forms/hooks.ts) and the admin forms editor
 * (app/admin/forms/page.tsx). Single source of truth so backend shape changes
 * never drift between the data layer and the editor.
 */
import type {
  ConditionalRendering,
  FormAction,
  FormField,
  FormSection,
  TableConfig,
} from "@/lib/form-storage";

export const normalizeTableMode = (mode: unknown): TableConfig["mode"] => {
  const normalized = String(mode || "").toUpperCase();
  if (
    normalized === "DYNAMIC" ||
    mode === "variableRows" ||
    mode === "variableColumns"
  )
    return "DYNAMIC";
  return "STATIC";
};

export const toIntColumns = (value?: number) => {
  if (value === 1 || value === 2 || value === 3 || value === 4) return value;
  return 2;
};

export const normalizeFormField = (field: any, index: number): FormField => ({
  id: field?.id || `field_${Date.now()}_${index}`,
  label: field?.label || "Untitled",
  type: field?.type || "text",
  placeholder: field?.placeholder || undefined,
  required: Boolean(field?.required),
  hideLabel: Boolean(field?.hideLabel),
  boldLabel: Boolean(field?.boldLabel),
  centerLabel: Boolean(field?.centerLabel),
  italicLabel: Boolean(field?.italicLabel),
  underlineLabel: Boolean(field?.underlineLabel),
  options: Array.isArray(field?.options)
    ? field.options.filter(Boolean)
    : undefined,
  tableConfig: field?.tableConfig
    ? {
        mode: normalizeTableMode(field.tableConfig.mode),
        rows: Number(field.tableConfig.rows) || 3,
        columns: Number(field.tableConfig.columns) || 3,
        headerPlacement: field.tableConfig.headerPlacement || "none",
        columnHeaders: Array.isArray(field.tableConfig.columnHeaders)
          ? field.tableConfig.columnHeaders
          : [],
        rowHeaders: Array.isArray(field.tableConfig.rowHeaders)
          ? field.tableConfig.rowHeaders
          : [],
      }
    : undefined,
  labRecordConfig: field?.labRecordConfig
    ? {
        layout:
          field.labRecordConfig.layout === "result" ? "result" : "valueUnit",
        rows: Array.isArray(field.labRecordConfig.rows)
          ? field.labRecordConfig.rows.map((row: any, rowIndex: number) => ({
              id: row?.id || `lab_row_${Date.now()}_${rowIndex}`,
              name: row?.name || `Row ${rowIndex + 1}`,
              unitMode: row?.unitMode === "none" ? "none" : "dropdown",
              unitOptions: Array.isArray(row?.unitOptions)
                ? row.unitOptions.filter(Boolean)
                : [],
              defaultUnit: row?.defaultUnit || undefined,
              resultOptions: Array.isArray(row?.resultOptions)
                ? row.resultOptions.filter(Boolean)
                : [],
            }))
          : [],
      }
    : undefined,
  conditionalRendering: field?.conditionalRendering
    ? {
        dependsOn: field.conditionalRendering.dependsOn,
        condition: field.conditionalRendering.condition,
        value: field.conditionalRendering.value || undefined,
        itemType: field.conditionalRendering.itemType || undefined,
      }
    : undefined,
  order: typeof field?.order === "number" ? field.order : index,
});

export const normalizeFormSection = (
  section: any,
  index: number,
): FormSection => ({
  id: section?.id || `section_${Date.now()}_${index}`,
  title: section?.title || "Untitled Section",
  boldTitle: Boolean(section?.boldTitle),
  italicTitle: Boolean(section?.italicTitle),
  underlineTitle: Boolean(section?.underlineTitle),
  centerTitle: Boolean(section?.centerTitle),
  columns: toIntColumns(Number(section?.columns)),
  order: typeof section?.order === "number" ? section.order : index,
  fields: Array.isArray(section?.fields)
    ? section.fields.map((field: any, fieldIndex: number) =>
        normalizeFormField(field, fieldIndex),
      )
    : [],
});

export const normalizeFormAction = (action: any, index: number): FormAction => ({
  id: action?.id || `action_${Date.now()}_${index}`,
  name: action?.name || "Unnamed item",
  type: action?.type === "consumable" ? "consumable" : "action",
  quantity: Number(action?.quantity) || 1,
  price: Number(action?.price) || 0,
  isQuantifiable: action?.isQuantifiable !== false,
  backendId: action?.backendId ? String(action.backendId) : undefined,
});
