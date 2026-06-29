"use client";

import React from "react";
import type { TableCell } from "@/lib/formbuilder-storage";
import { AnswerInlineField } from "./field-renderers";
import { AnswerBlockProps } from "./types";
import { AnswerBlock } from "./answer-block";
import { replacePlaceholders } from "./utils";

export function ParagraphAnswerBlock({
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
  const content = block.content || "";
  const hasInline = content.includes("[[");
  if (!hasInline)
    return (
      <p
        className={`text-sm leading-relaxed my-1.5 ${alignClass} ${styleClass}`}
      >
        {content}
      </p>
    );
  const parts = content.split(/(\[\[[^\]]+\]\])/g);
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

export function TableAnswerBlock({
  block,
  showErrors,
  inlineAnswers,
  onInlineChange,
  edit,
  context,
}: {
  block: AnswerBlockProps["block"];
  showErrors: boolean;
  inlineAnswers: Record<string, string>;
  onInlineChange: (key: string, value: string) => void;
  edit: boolean;
  context?: { doctor: any; clinicProfile: any };
}) {
  const rows = Math.max(1, block.tableRows ?? 3);
  const cols = Math.max(1, block.tableCols ?? 3);
  const getCell = (ri: number, ci: number): TableCell =>
    block.tableCells?.[ri]?.[ci] ?? {};

  const ctx = context ?? { doctor: null, clinicProfile: null };

  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri}>
              {Array.from({ length: cols }).map((_, ci) => {
                const cell = getCell(ri, ci);
                const cellContent = replacePlaceholders(
                  cell.content ?? "",
                  ctx,
                );
                const hasAnswer =
                  cellContent.includes("[[") &&
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
                      {cellContent}
                    </td>
                  );
                const parts = cellContent.split(/\[\[([^\]]+)\]\]/g);
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

export function LayoutAnswerBlock({
  block,
  answers,
  onAnswerChange,
  showErrors,
  inlineAnswers,
  onInlineChange,
  edit,
  context,
  getBlockHandlers,
}: AnswerBlockProps) {
  const columns = block.layoutColumns ?? [];
  const numCols = Math.max(1, columns.length || 1);
  const desktopColumns = Math.min(numCols, 4);

  return (
    <div
      className="my-3 grid gap-4"
      style={{
        gridTemplateColumns:
          numCols <= 1
            ? "minmax(0, 1fr)"
            : `repeat(${desktopColumns}, minmax(0, 1fr))`,
      }}
    >
      {columns.map((col) => (
        <div key={col.id} className="min-w-0 overflow-x-auto rounded-lg">
          <div className="min-w-0 space-y-0">
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
                context={context}
                blockHandlers={getBlockHandlers?.(b)}
                getBlockHandlers={getBlockHandlers}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
