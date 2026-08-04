"use client";

import React from "react";
import type { AnswerBlockProps } from "./types";
import {
  ChoiceGroup,
  FieldShell,
  SignatureCanvas,
} from "./field-renderers";
import { DiagnosticAnswerBlock, LabAnswerBlock, MedFullAnswerBlock, MedMiniAnswerBlock, ProductListenerAnswerBlock } from "./medical-answer-blocks";
import { isBlockViolating, shouldRenderBlock, replacePlaceholders } from "./utils";
import { FileUploadAnswerBlock, type UploadedAnswerFile } from "./file-upload-block";
import { getMediaUrl } from "@/lib/media-url";
import {
  LayoutAnswerBlock,
  ParagraphAnswerBlock,
  TableAnswerBlock,
} from "./layout-answer-blocks";


export function AnswerBlock({
  block,
  answers,
  onAnswerChange,
  showErrors,
  inlineAnswers,
  onInlineChange,
  edit,
  context,
  blockHandlers,
  getBlockHandlers,
}: AnswerBlockProps) {
  if (!shouldRenderBlock(block, answers)) return null;

  const ctx = context ?? { doctor: null, clinicProfile: null };
  const content = replacePlaceholders(block.content ?? "", ctx);

  const val = answers[block.id] ?? (block.type === "checkbox_group" ? [] : "");
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
          {content}
        </h1>
      );
    case "heading2":
      return (
        <h2
          className={`text-xl font-semibold leading-snug mt-6 mb-2 ${alignClass} ${styleClass}`}
        >
          {content}
        </h2>
      );
    case "heading3":
      return (
        <h3
          className={`text-base font-semibold leading-snug mt-4 mb-1.5 ${alignClass} ${styleClass}`}
        >
          {content}
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
            block: { ...block, content },
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
          {...{
            block,
            showErrors,
            inlineAnswers,
            onInlineChange,
            edit,
            context: ctx,
          }}
        />
      );
    case "diagnostic_record":
      return (
        <DiagnosticAnswerBlock
          block={block}
          value={(val as any[]) ?? []}
          onChange={(v: any) => onAnswerChange(block.id, v)}
          isError={isError}
          edit={edit}
          handlers={blockHandlers}
        />
      );
    case "medication_full":
      return (
        <MedFullAnswerBlock
          block={block}
          value={(val as any[]) ?? []}
          onChange={(v: any) => onAnswerChange(block.id, v)}
          isError={isError}
          edit={edit}
          handlers={blockHandlers}
        />
      );
    case "medication_mini":
      return (
        <MedMiniAnswerBlock
          block={block}
          value={(val as any[]) ?? []}
          onChange={(v: any) => onAnswerChange(block.id, v)}
          isError={isError}
          edit={edit}
          handlers={blockHandlers}
        />
      );
    case "lab_record":
      return (
        <LabAnswerBlock
          block={block}
          value={(val as Record<string, any>) ?? {}}
          onChange={(v: any) => onAnswerChange(block.id, v)}
          isError={isError}
          edit={edit}
        />
      );
    case "product_listener":
      return (
        <ProductListenerAnswerBlock
          block={block}
          value={(val as any[]) ?? []}
          onChange={(v: any) => onAnswerChange(block.id, v)}
          isError={isError}
          edit={edit}
          handlers={blockHandlers}
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
            src={getMediaUrl(block.mediaUrl)}
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
    case "layout":
      return (
        <LayoutAnswerBlock
          block={block}
          answers={answers}
          onAnswerChange={onAnswerChange}
          showErrors={showErrors}
          inlineAnswers={inlineAnswers}
          onInlineChange={onInlineChange}
          edit={edit}
          context={ctx}
          getBlockHandlers={getBlockHandlers}
        />
      );
    default:
      return null;
  }
}
