"use client";

import type { LayoutColumn, TableCell } from "@/lib/formbuilder-storage";
import type { FormBlock } from "@/lib/formbuilder-storage";
import type { AnswerBlockProps } from "./types";
import { AnswerInlineField, SignatureCanvas } from "./field-renderers";
import {
  DiagnosticAnswerBlock,
  LabAnswerBlock,
  MedFullAnswerBlock,
  MedMiniAnswerBlock,
  ProductListenerAnswerBlock,
} from "./medical-answer-blocks";
import { isBlockViolating, shouldRenderBlock } from "./utils";
import { MediaUploader } from "@/components/ui/media-uploader";

type UploadedAnswerFile = {
  name: string;
  path: string;
  url: string;
  mimeType: string;
  size: number;
};

function FileUploadAnswerBlock({
  block,
  value,
  onChange,
  isError,
  edit,
}: {
  block: FormBlock;
  value: UploadedAnswerFile[];
  onChange: (v: UploadedAnswerFile[]) => void;
  isError: boolean;
  edit: boolean;
}) {
  const accept =
    block.uploadMode === "images"
      ? "image/*"
      : block.uploadMode === "images_videos"
        ? "image/*,video/*"
        : block.uploadMode === "documents"
          ? ".pdf,.doc,.docx,.txt,.xlsx,.csv,.xls"
          : "*";

  const hint =
    block.uploadMode === "images"
      ? "Images only"
      : block.uploadMode === "images_videos"
        ? "Images and videos"
        : block.uploadMode === "documents"
          ? "PDF, Word, Excel, CSV, and text files"
          : "Any file type";

  const removeFile = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const isImage = (file: UploadedAnswerFile) =>
    file.mimeType.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name);

  return (
    <div
      className={`my-3 ${isError ? "rounded-md p-2 -m-2 ring-1 ring-red-400/50 bg-red-50/20 dark:bg-red-950/10" : ""}`}
    >
      <label className="text-sm font-medium block mb-1">
        {block.label || "Upload Files"}
        {block.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {edit && (
        <MediaUploader
          bucket="form"
          storagePath={`forms/${block.id}/upload`}
          accept={accept}
          multiple={block.uploadMultiple ?? false}
          maxFiles={block.uploadMaxFiles}
          label={block.label || "Upload Files"}
          hint={hint}
          onUploaded={(results) => {
            const files = results.map((r) => ({
              name: r.name,
              path: r.path,
              url: r.url,
              mimeType: "",
              size: 0,
            }));
            onChange([...value, ...files]);
          }}
        />
      )}

      {value.length === 0 && !edit ? (
        <p className="text-sm text-muted-foreground italic">
          No files uploaded
        </p>
      ) : value.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {value.map((file, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              {isImage(file) ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="h-10 w-10 rounded object-cover border border-border flex-shrink-0"
                />
              ) : (
                <div className="h-10 w-10 rounded border border-border bg-muted flex items-center justify-center flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>
              )}
              <span className="truncate flex-1">{file.name}</span>
              {edit && (
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {isError && (
        <p className="text-xs text-red-500 mt-1">
          At least one file is required.
        </p>
      )}
    </div>
  );
}

export function AnswerBlock({
  block,
  answers,
  onAnswerChange,
  showErrors,
  inlineAnswers,
  onInlineChange,
  edit,
}: AnswerBlockProps) {
  if (!shouldRenderBlock(block, answers)) return null;

  const val = answers[block.id];
  const isError = showErrors && isBlockViolating(block, answers);
  const alignClass =
    block.align === "center"
      ? "text-center"
      : block.align === "right"
        ? "text-right"
        : "text-left";
  const styleClass = [
    block.bold ? "font-bold" : "",
    block.italic ? "italic" : "",
    block.underline ? "underline" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const inputBase = `w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background transition-colors ${isError ? "border-red-400 ring-1 ring-red-400/40 bg-red-50/20 dark:bg-red-950/10" : "border-input"}`;

  switch (block.type) {
    case "heading1":
      return (
        <h1
          className={`text-3xl font-bold leading-tight my-4 ${alignClass} ${styleClass}`}
        >
          {block.content}
        </h1>
      );
    case "heading2":
      return (
        <h2
          className={`text-xl font-semibold leading-snug mt-6 mb-2 ${alignClass} ${styleClass}`}
        >
          {block.content}
        </h2>
      );
    case "heading3":
      return (
        <h3
          className={`text-base font-semibold leading-snug mt-4 mb-1.5 ${alignClass} ${styleClass}`}
        >
          {block.content}
        </h3>
      );
    case "divider":
      return <hr className="border-t-2 border-border my-4" />;
    case "spacer":
      return <div style={{ height: block.height ?? 32 }} />;
    case "paragraph":
      return (
        <ParagraphAnswerBlock
          {...{
            block,
            inlineAnswers,
            onInlineChange,
            showErrors,
            alignClass,
            styleClass,
            edit,
          }}
        />
      );
    case "text_input":
      return (
        <FieldShell
          label={block.label}
          required={block.required}
          error={isError ? "This field is required." : undefined}
        >
          <input
            type="text"
            className={inputBase}
            placeholder={block.placeholder || ""}
            value={(val as string) ?? ""}
            onChange={(e) => onAnswerChange(block.id, e.target.value)}
            readOnly={!edit}
          />
        </FieldShell>
      );
    case "textarea_input":
      return (
        <FieldShell
          label={block.label}
          required={block.required}
          error={isError ? "This field is required." : undefined}
        >
          <textarea
            rows={4}
            className={`${inputBase} resize-y min-h-[4.5rem]`}
            placeholder={block.placeholder || ""}
            value={(val as string) ?? ""}
            onChange={(e) => onAnswerChange(block.id, e.target.value)}
            readOnly={!edit}
          />
        </FieldShell>
      );
    case "number_input":
      return (
        <FieldShell
          label={block.label}
          required={block.required}
          error={isError ? "This field is required." : undefined}
        >
          <input
            type="number"
            className={`${inputBase} w-36`}
            placeholder={block.placeholder || "0"}
            value={(val as string) ?? ""}
            onChange={(e) => onAnswerChange(block.id, e.target.value)}
            readOnly={!edit}
          />
        </FieldShell>
      );
    case "date_input":
      return (
        <FieldShell
          label={block.label}
          required={block.required}
          error={isError ? "This field is required." : undefined}
        >
          {edit ? (
            <input
              type="date"
              className={`${inputBase} w-44`}
              value={(val as string) ?? ""}
              onChange={(e) => onAnswerChange(block.id, e.target.value)}
            />
          ) : (
            <div className={`${inputBase} w-44`}>{(val as string) || "—"}</div>
          )}
        </FieldShell>
      );
    case "checkbox_single":
      return (
        <div
          className={`my-2 flex items-start gap-2.5 ${isError ? "rounded-md p-1 -m-1 ring-1 ring-red-400/50 bg-red-50/20 dark:bg-red-950/10" : ""}`}
        >
          <input
            type="checkbox"
            id={`chk_${block.id}`}
            checked={Boolean(val)}
            onChange={(e) => onAnswerChange(block.id, e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-2 border-border accent-primary"
            disabled={!edit}
          />
          <label htmlFor={`chk_${block.id}`} className="text-sm cursor-pointer">
            {block.label}
            {block.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      );
    case "checkbox_group":
      return (
        <ChoiceGroup
          type="checkbox"
          block={block}
          value={Array.isArray(val) ? (val as string[]) : []}
          isError={isError}
          edit={edit}
          onChange={(next) => onAnswerChange(block.id, next)}
        />
      );
    case "radio_group":
      return (
        <ChoiceGroup
          type="radio"
          block={block}
          value={(val as string) ?? ""}
          isError={isError}
          edit={edit}
          onChange={(next) => onAnswerChange(block.id, next)}
        />
      );
    case "select_input":
      return (
        <FieldShell
          label={block.label}
          required={block.required}
          error={isError ? "Please select an option." : undefined}
        >
          {edit ? (
            <select
              className={`${inputBase} max-w-xs`}
              value={(val as string) ?? ""}
              onChange={(e) => onAnswerChange(block.id, e.target.value)}
            >
              <option value="">Select an option…</option>
              {(block.options ?? []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <div className={`${inputBase} max-w-xs`}>
              {(val as string) || "—"}
            </div>
          )}
        </FieldShell>
      );
    case "signature":
      return (
        <div className="my-6">
          <p className="text-sm font-medium mb-2">
            {block.label ?? "Signature"}
            {block.required && <span className="text-red-500 ml-1">*</span>}
          </p>
          <div className="max-w-xs">
            <SignatureCanvas
              value={(val as string) ?? ""}
              onChange={(v) => onAnswerChange(block.id, v)}
              isError={isError}
              edit={edit}
            />
          </div>
          {isError && (
            <p className="text-xs text-red-500 mt-1">Signature is required.</p>
          )}
        </div>
      );
    case "table":
      return (
        <TableAnswerBlock
          {...{ block, showErrors, inlineAnswers, onInlineChange, edit }}
        />
      );
    case "diagnostic_record":
      return (
        <DiagnosticAnswerBlock
          block={block}
          value={(val as any[]) ?? []}
          onChange={(v) => onAnswerChange(block.id, v)}
          isError={isError}
          edit={edit}
        />
      );
    case "medication_full":
      return (
        <MedFullAnswerBlock
          block={block}
          value={(val as any[]) ?? []}
          onChange={(v) => onAnswerChange(block.id, v)}
          isError={isError}
          edit={edit}
        />
      );
    case "medication_mini":
      return (
        <MedMiniAnswerBlock
          block={block}
          value={(val as any[]) ?? []}
          onChange={(v) => onAnswerChange(block.id, v)}
          isError={isError}
          edit={edit}
        />
      );
    case "lab_record":
      return (
        <LabAnswerBlock
          block={block}
          value={(val as Record<string, any>) ?? {}}
          onChange={(v) => onAnswerChange(block.id, v)}
          isError={isError}
          edit={edit}
        />
      );
    case "product_listener":
      return (
        <ProductListenerAnswerBlock
          block={block}
          value={(val as any[]) ?? []}
          onChange={(v) => onAnswerChange(block.id, v)}
          isError={isError}
          edit={edit}
        />
      );
    case "media_embed": {
      const widthClass =
        block.mediaWidth === "sm"
          ? "max-w-xs"
          : block.mediaWidth === "lg"
            ? "max-w-lg"
            : block.mediaWidth === "full"
              ? "w-full"
              : "max-w-sm";
      const mediaAlignClass =
        block.align === "center"
          ? "mx-auto"
          : block.align === "right"
            ? "ml-auto"
            : "";
      if (!block.mediaUrl) return null;
      return (
        <figure
          className={`my-4 ${block.align === "center" ? "text-center" : block.align === "right" ? "text-right" : "text-left"}`}
        >
          <img
            src={block.mediaUrl}
            alt={block.mediaCaption || ""}
            className={`${widthClass} ${mediaAlignClass} rounded-md`}
          />
          {block.mediaCaption && (
            <figcaption className="text-xs text-muted-foreground mt-1.5">
              {block.mediaCaption}
            </figcaption>
          )}
        </figure>
      );
    }
    case "file_upload":
      return (
        <FileUploadAnswerBlock
          block={block}
          value={(val as UploadedAnswerFile[]) ?? []}
          onChange={(v) => onAnswerChange(block.id, v)}
          isError={isError}
          edit={edit}
        />
      );
    case "layout": {
      const columns: LayoutColumn[] = block.layoutColumns ?? [];
      const numCols = columns.length;
      const gridClass =
        numCols <= 1
          ? "grid-cols-1"
          : numCols === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : numCols === 3
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      return (
        <div className={`my-3 grid ${gridClass} gap-4`}>
          {columns.map((col) => (
            <div key={col.id} className="min-w-0 space-y-0">
              {col.blocks.map((b) => (
                <AnswerBlock
                  key={b.id}
                  block={b}
                  answers={answers}
                  onAnswerChange={onAnswerChange}
                  showErrors={showErrors}
                  inlineAnswers={inlineAnswers}
                  onInlineChange={onInlineChange}
                  edit={edit}
                />
              ))}
            </div>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

function FieldShell({
  label,
  required,
  children,
  error,
}: {
  label?: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="my-3">
      <label className="text-sm font-medium block mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function ParagraphAnswerBlock({
  block,
  inlineAnswers,
  onInlineChange,
  showErrors,
  alignClass,
  styleClass,
  edit,
}: {
  block: AnswerBlockProps["block"];
  inlineAnswers: Record<string, string>;
  onInlineChange: (key: string, value: string) => void;
  showErrors: boolean;
  alignClass: string;
  styleClass: string;
  edit: boolean;
}) {
  const hasInline = (block.content ?? "").includes("[[");
  if (!hasInline)
    return (
      <p
        className={`text-sm leading-relaxed my-1.5 ${alignClass} ${styleClass}`}
      >
        {block.content || ""}
      </p>
    );
  const parts = (block.content ?? "").split(/(\[\[[^\]]+\]\])/g);
  return (
    <div
      className={`text-sm leading-relaxed my-1.5 ${alignClass} ${styleClass} flex flex-wrap items-baseline gap-x-0.5`}
    >
      {parts
        .filter((p) => p.length > 0)
        .map((part, idx) => {
          const fi = part.match(/^\[\[([^\]]+)\]\]$/);
          if (!fi) return <span key={idx}>{part}</span>;
          const field = (block.inlineFields ?? []).find((f) => f.id === fi[1]);
          if (!field)
            return (
              <span
                key={idx}
                className="inline-block w-16 h-6 border-b border-dashed border-border mx-0.5"
              />
            );
          const key = `${block.id}__${field.id}`;
          const fError = showErrors && field.required && !inlineAnswers[key];
          return (
            <AnswerInlineField
              key={idx}
              field={field}
              value={inlineAnswers[key] ?? ""}
              onChange={(v) => onInlineChange(key, v)}
              isError={fError}
              edit={edit}
            />
          );
        })}
    </div>
  );
}

function TableAnswerBlock({
  block,
  showErrors,
  inlineAnswers,
  onInlineChange,
  edit,
}: {
  block: AnswerBlockProps["block"];
  showErrors: boolean;
  inlineAnswers: Record<string, string>;
  onInlineChange: (key: string, value: string) => void;
  edit: boolean;
}) {
  const rows = Math.max(1, block.tableRows ?? 3);
  const cols = Math.max(1, block.tableCols ?? 3);
  const getCell = (ri: number, ci: number): TableCell =>
    block.tableCells?.[ri]?.[ci] ?? {};
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri}>
              {Array.from({ length: cols }).map((_, ci) => {
                const cell = getCell(ri, ci);
                const hasAnswer =
                  (cell.content ?? "").includes("[[") &&
                  (cell.inlineFields ?? []).length > 0;
                const cAlign =
                  cell.align === "center"
                    ? "text-center"
                    : cell.align === "right"
                      ? "text-right"
                      : "text-left";
                const cStyle = [
                  cell.bold ? "font-bold" : "",
                  cell.italic ? "italic" : "",
                  cell.underline ? "underline" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                if (!hasAnswer)
                  return (
                    <td
                      key={ci}
                      className={`border border-border px-3 py-2 text-sm min-w-[80px] select-none ${cAlign} ${cStyle}`}
                    >
                      {cell.content ?? ""}
                    </td>
                  );
                const parts = (cell.content ?? "").split(/\[\[([^\]]+)\]\]/g);
                return (
                  <td
                    key={ci}
                    className={`border border-border px-2 py-1.5 min-w-[80px] bg-teal-50/30 dark:bg-teal-900/10 ${cAlign} ${cStyle}`}
                  >
                    <div className="flex flex-wrap items-baseline gap-0.5">
                      {parts
                        .filter((p) => p.length > 0)
                        .map((part, pi) => {
                          const field = (cell.inlineFields ?? []).find(
                            (f) => f.id === part,
                          );
                          if (!field) return <span key={pi}>{part}</span>;
                          const key = `${block.id}__${ri}__${ci}__${field.id}`;
                          const fError =
                            showErrors && field.required && !inlineAnswers[key];
                          return (
                            <AnswerInlineField
                              key={pi}
                              field={field}
                              value={inlineAnswers[key] ?? ""}
                              onChange={(v) => onInlineChange(key, v)}
                              isError={fError}
                              edit={edit}
                            />
                          );
                        })}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChoiceGroup({
  type,
  block,
  value,
  isError,
  edit,
  onChange,
}: {
  type: "checkbox" | "radio";
  block: AnswerBlockProps["block"];
  value: string[] | string;
  isError: boolean;
  edit: boolean;
  onChange: (next: string[] | string) => void;
}) {
  const selected = value;
  const toggle = (opt: string) => {
    if (type === "checkbox") {
      const current = Array.isArray(selected) ? selected : [];
      onChange(
        current.includes(opt)
          ? current.filter((o) => o !== opt)
          : [...current, opt],
      );
      return;
    }
    onChange(opt);
  };
  return (
    <div className="my-3">
      <label className="text-sm font-medium block mb-1.5">
        {block.label}
        {block.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        className={`space-y-1.5 ${isError ? "rounded-md p-2 -m-2 ring-1 ring-red-400/50 bg-red-50/20 dark:bg-red-950/10" : ""}`}
      >
        {(block.options ?? []).map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type={type}
              name={type === "radio" ? `radio_${block.id}` : undefined}
              checked={
                type === "checkbox"
                  ? Array.isArray(selected) && selected.includes(opt)
                  : selected === opt
              }
              onChange={() => toggle(opt)}
              className="h-4 w-4 rounded border-2 border-border accent-primary"
              disabled={!edit}
            />
            {opt}
          </label>
        ))}
      </div>
      {isError && (
        <p className="text-xs text-red-500 mt-1">
          {type === "checkbox"
            ? "Please select at least one option."
            : "Please select an option."}
        </p>
      )}
    </div>
  );
}
