"use client";

import React from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  Plus,
  Trash2,
  PenLine,
} from "lucide-react";
import type { FormBlock, BlockType, TableCell, InlineAnswerField, InlineFieldType } from "@/lib/formbuilder-storage";
import { BlockWrapper, FormatButton } from "./block-wrapper";
import { InlineRichEditor, InlineContent, INLINE_FIELD_LABELS, nextAnsId, type InlineRichEditorHandle } from "./inline-rich-editor";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

interface TableBlockEditorProps {
  block: FormBlock;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  hovered: boolean;
  setHovered: (v: boolean) => void;
  onActivate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddBelow: (type?: BlockType) => void;
  onChange: (patch: Partial<FormBlock>) => void;
  allBlocks: FormBlock[];
  activeCell: { ri: number; ci: number } | null;
  setActiveCell: (cell: { ri: number; ci: number } | null) => void;
  activeCellEditorRef: React.RefObject<InlineRichEditorHandle | null>;
}

export function TableBlockEditor({
  block,
  isActive,
  isFirst,
  isLast,
  hovered,
  setHovered,
  onActivate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBelow,
  onChange,
  allBlocks,
  activeCell,
  setActiveCell,
  activeCellEditorRef,
}: TableBlockEditorProps) {
  const rows = Math.max(1, block.tableRows ?? 3);
  const cols = Math.max(1, block.tableCols ?? 3);

  const getCell = (ri: number, ci: number): TableCell =>
    block.tableCells?.[ri]?.[ci] ?? {};

  const patchCell = (ri: number, ci: number, patch: Partial<TableCell>) => {
    const cells: TableCell[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (__, c) => {
        const ex = block.tableCells?.[r]?.[c] ?? {};
        return r === ri && c === ci ? { ...ex, ...patch } : ex;
      }),
    );
    onChange({ tableCells: cells });
  };

  const addCellInlineField = (fieldType: InlineFieldType = "text") => {
    if (!activeCell) return;
    const { ri, ci } = activeCell;
    const cell = getCell(ri, ci);
    const newId = nextAnsId(cell.inlineFields ?? []);
    const label = INLINE_FIELD_LABELS[fieldType] ?? "Answer";
    const newContent = activeCellEditorRef.current?.insertField(newId, label);
    if (newContent == null) return;
    const newField: InlineAnswerField = {
      id: newId,
      fieldType,
      placeholder: "",
      required: false,
      width: "sm",
    };
    patchCell(ri, ci, {
      content: newContent,
      inlineFields: [...(cell.inlineFields ?? []), newField],
    });
  };

  const updateCellInlineField = (
    cri: number,
    cci: number,
    fieldId: string,
    patch: Partial<InlineAnswerField>,
  ) => {
    const cell = getCell(cri, cci);
    patchCell(cri, cci, {
      inlineFields: (cell.inlineFields ?? []).map((f) =>
        f.id === fieldId ? { ...f, ...patch } : f,
      ),
    });
  };

  const removeCellInlineField = (
    cri: number,
    cci: number,
    fieldId: string,
  ) => {
    const cell = getCell(cri, cci);
    const escaped = fieldId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    patchCell(cri, cci, {
      content: (cell.content ?? "").replace(
        new RegExp(`\\[\\[${escaped}\\]\\]`, "g"),
        "",
      ),
      inlineFields: (cell.inlineFields ?? []).filter((f) => f.id !== fieldId),
    });
  };

  const activeCellData = activeCell
    ? getCell(activeCell.ri, activeCell.ci)
    : null;

  const activeCellFieldIds = Array.from(
    (activeCellData?.content ?? "").matchAll(/\[\[([^\]]+)\]\]/g),
  ).map((m) => m[1]);

  const activeCellFields = activeCellFieldIds
    .map((id) =>
      (activeCellData?.inlineFields ?? []).find((f) => f.id === id),
    )
    .filter(Boolean) as InlineAnswerField[];

  const tableHasAnswerFields =
    block.tableCells?.some((row) =>
      row.some(
        (cell) =>
          (cell.content ?? "").includes("[[") &&
          (cell.inlineFields ?? []).length > 0,
      ),
    ) ?? false;

  return (
    <BlockWrapper
      block={block}
      isActive={isActive}
      isFirst={isFirst}
      isLast={isLast}
      hovered={hovered}
      setHovered={setHovered}
      onActivate={onActivate}
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onAddBelow={onAddBelow}
      allBlocks={allBlocks}
      onBlockChange={onChange}
    >
      {/* Table Toolbar */}
      {isActive && (
        <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">Rows:</span>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange({ tableRows: rows + 1 });
                }}
                className="w-5 h-5 flex items-center justify-center rounded border border-border hover:bg-muted"
              >
                +
              </button>
              <span className="font-semibold w-3 text-center">{rows}</span>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (rows > 1) onChange({ tableRows: rows - 1 });
                }}
                className="w-5 h-5 flex items-center justify-center rounded border border-border hover:bg-muted"
              >
                -
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">Cols:</span>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange({ tableCols: cols + 1 });
                }}
                className="w-5 h-5 flex items-center justify-center rounded border border-border hover:bg-muted"
              >
                +
              </button>
              <span className="font-semibold w-3 text-center">{cols}</span>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (cols > 1) onChange({ tableCols: cols - 1 });
                }}
                className="w-5 h-5 flex items-center justify-center rounded border border-border hover:bg-muted"
              >
                -
              </button>
            </div>
          </div>

          {activeCell && (
            <div className="flex items-center gap-1">
              <FormatButton
                icon={Bold}
                active={!!activeCellData?.bold}
                onClick={() =>
                  patchCell(activeCell.ri, activeCell.ci, {
                    bold: !activeCellData?.bold,
                  })
                }
                label="Bold"
              />
              <FormatButton
                icon={Italic}
                active={!!activeCellData?.italic}
                onClick={() =>
                  patchCell(activeCell.ri, activeCell.ci, {
                    italic: !activeCellData?.italic,
                  })
                }
                label="Italic"
              />
              <FormatButton
                icon={Underline}
                active={!!activeCellData?.underline}
                onClick={() =>
                  patchCell(activeCell.ri, activeCell.ci, {
                    underline: !activeCellData?.underline,
                  })
                }
                label="Underline"
              />
              <div className="w-px h-4 bg-border/50 mx-1" />
              <FormatButton
                icon={AlignLeft}
                active={(activeCellData?.align ?? "left") === "left"}
                onClick={() =>
                  patchCell(activeCell.ri, activeCell.ci, { align: "left" })
                }
                label="Align left"
              />
              <FormatButton
                icon={AlignCenter}
                active={activeCellData?.align === "center"}
                onClick={() =>
                  patchCell(activeCell.ri, activeCell.ci, { align: "center" })
                }
                label="Align center"
              />
              <FormatButton
                icon={AlignRight}
                active={activeCellData?.align === "right"}
                onClick={() =>
                  patchCell(activeCell.ri, activeCell.ci, { align: "right" })
                }
                label="Align right"
              />
              <div className="w-px h-4 bg-border/50 mx-1" />
              <TooltipProvider delayDuration={300}>
                {[
                  { type: "text", label: "Add Text", icon: "T" },
                  { type: "date", label: "Add Date", icon: "📅" },
                  { type: "number", label: "Add Num", icon: "#" },
                  { type: "select", label: "Add Drop", icon: "▽" },
                ].map((btn) => (
                  <Tooltip key={btn.type}>
                    <TooltipTrigger asChild>
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addCellInlineField(btn.type as any);
                        }}
                        className="px-1 py-1 rounded text-[10px] font-bold text-teal-600 hover:bg-teal-50"
                      >
                        {btn.icon}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{btn.label}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          )}
        </div>
      )}

      {/* Table grid */}
      <div className="overflow-x-auto pb-1">
        <table className="w-full border-collapse border border-border">
          <tbody>
            {Array.from({ length: rows }).map((_, ri) => (
              <tr key={ri}>
                {Array.from({ length: cols }).map((__, ci) => {
                  const cell = getCell(ri, ci);
                  const isCellActive =
                    isActive && activeCell?.ri === ri && activeCell?.ci === ci;
                  const align = cell.align ?? "left";
                  return (
                    <td
                      key={ci}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isActive) onActivate();
                        setActiveCell({ ri, ci });
                      }}
                      className={`border border-border p-2 min-w-[80px] transition-colors ${
                        isCellActive ? "bg-accent/20 ring-1 ring-primary/30 ring-inset" : "hover:bg-muted/30"
                      }`}
                    >
                      {isCellActive ? (
                        <InlineRichEditor
                          ref={activeCellEditorRef}
                          value={cell.content ?? ""}
                          inlineFields={cell.inlineFields}
                          onChange={(val) => patchCell(ri, ci, { content: val })}
                          className={`text-sm ${cell.bold ? "font-bold" : ""} ${cell.italic ? "italic" : ""} ${cell.underline ? "underline" : ""} text-${align}`}
                        />
                      ) : (
                        <div
                          className={`text-sm min-h-[1.5em] ${cell.bold ? "font-bold" : ""} ${cell.italic ? "italic" : ""} ${cell.underline ? "underline" : ""} text-${align}`}
                        >
                          <InlineContent
                            text={cell.content}
                            inlineFields={cell.inlineFields}
                          />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Active cell field config */}
      {isActive && activeCell && activeCellFields.length > 0 && (
        <div className="mt-4 p-2 rounded-lg border border-teal-100 bg-teal-50/20 space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-teal-600/50">
            Cell Answer Fields ({activeCell.ri + 1}, {activeCell.ci + 1})
          </p>
          {activeCellFields.map((field) => (
            <div
              key={field.id}
              className="flex items-center gap-2 bg-background p-1.5 rounded border border-teal-100/50 shadow-sm"
            >
              <div className="flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 font-bold text-[9px]">
                {field.id}
              </div>
              <Input
                className="h-6 text-[10px] flex-1"
                value={field.placeholder ?? ""}
                placeholder="Placeholder…"
                onChange={(e) =>
                  updateCellInlineField(
                    activeCell.ri,
                    activeCell.ci,
                    field.id,
                    { placeholder: e.target.value },
                  )
                }
              />
              {field.fieldType === "select" && (
                <Input
                  className="h-6 text-[10px] flex-1"
                  value={field.options?.join(", ") ?? ""}
                  placeholder="Options (comma separated)…"
                  onChange={(e) =>
                    updateCellInlineField(
                      activeCell.ri,
                      activeCell.ci,
                      field.id,
                      {
                        options: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    )
                  }
                />
              )}
              <label className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!field.required}
                  onChange={(e) =>
                    updateCellInlineField(
                      activeCell.ri,
                      activeCell.ci,
                      field.id,
                      { required: e.target.checked },
                    )
                  }
                  className="rounded"
                />
                Req
              </label>
              <button
                onClick={() =>
                  removeCellInlineField(
                    activeCell.ri,
                    activeCell.ci,
                    field.id,
                  )
                }
                className="p-0.5 rounded text-muted-foreground hover:text-destructive shrink-0"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isActive && !activeCell && (
        <p className="mt-2 text-[11px] text-muted-foreground/50 italic text-center">
          Click a cell to edit its content, format it, or add an answer field.
        </p>
      )}
    </BlockWrapper>
  );
}
