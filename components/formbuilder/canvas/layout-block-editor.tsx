"use client";

import React from "react";
import {
  BlockType,
  FormBlock,
  fbGenId,
  fbMakeBlock,
} from "@/lib/formbuilder-storage";
import { BlockWrapper } from "./block-wrapper";

interface LayoutBlockEditorProps {
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
  activeNestedBlockId: string | null;
  setActiveNestedBlockId: (id: string | null) => void;
  pendingNestedBlockRef: React.MutableRefObject<{ blockId: string } | null>;
  // We'll pass the BlockItem component as a prop to avoid circular dependency
  renderBlockItem: (props: any) => React.ReactNode;
}

export function LayoutBlockEditor({
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
  activeNestedBlockId,
  setActiveNestedBlockId,
  pendingNestedBlockRef,
  renderBlockItem,
}: LayoutBlockEditorProps) {
  const columns = block.layoutColumns ?? [];
  const numCols = columns.length;

  const desktopColumns = Math.min(Math.max(1, numCols), 4);

  const updateColumn = (colId: string, newBlocks: FormBlock[]) =>
    onChange({
      layoutColumns: columns.map((col) =>
        col.id === colId ? { ...col, blocks: newBlocks } : col,
      ),
    });

  const addToColumn = (colId: string, type: BlockType) => {
    const col = columns.find((c) => c.id === colId);
    if (!col) return;
    const nb = fbMakeBlock(type);
    updateColumn(colId, [...col.blocks, nb]);
    setActiveNestedBlockId(nb.id);
  };

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
      {/* Column count controls */}
      {isActive && (
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span className="text-muted-foreground shrink-0">Columns:</span>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onMouseDown={(e) => {
                e.preventDefault();
                if (n === numCols) return;
                if (n > numCols) {
                  onChange({
                    layoutColumns: [
                      ...columns,
                      ...Array.from({ length: n - numCols }, () => ({
                        id: fbGenId(),
                        blocks: [],
                      })),
                    ],
                  });
                } else {
                  onChange({ layoutColumns: columns.slice(0, n) });
                }
                setActiveNestedBlockId(null);
              }}
              className={`w-7 h-7 rounded border text-xs font-semibold transition-colors ${
                numCols === n
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {/* Columns grid */}
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns:
            numCols <= 1
              ? "minmax(0, 1fr)"
              : `repeat(${desktopColumns}, minmax(0, 1fr))`,
        }}
      >
        {columns.map((col, colIdx) => (
          <div
            key={col.id}
            className={`min-w-0 overflow-x-auto flex flex-col rounded-lg transition-colors ${
              isActive ? "border border-dashed border-border/50 bg-muted/5" : ""
            }`}
            onClick={(e) => {
              if (!isActive) {
                e.stopPropagation();
                onActivate();
              }
            }}
          >
            {/* Column label */}
            {isActive && (
              <span className="px-2 pt-1.5 pb-0.5 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40 select-none">
                Column {colIdx + 1}
              </span>
            )}

            {/* Nested blocks */}
            <div className="flex-1 px-1 pb-1 space-y-0.5">
              {col.blocks.length === 0 && isActive && (
                <div className="h-8 flex items-center justify-center text-[11px] text-muted-foreground/30 italic select-none">
                  Empty
                </div>
              )}
              {col.blocks.map((nb, nbIdx) =>
                renderBlockItem({
                  key: nb.id,
                  block: nb,
                  isActive: isActive && activeNestedBlockId === nb.id,
                  isFirst: nbIdx === 0,
                  isLast: nbIdx === col.blocks.length - 1,
                  onActivate: () => {
                    if (isActive) {
                      setActiveNestedBlockId(nb.id);
                    } else {
                      pendingNestedBlockRef.current = { blockId: nb.id };
                      onActivate();
                    }
                  },
                  onDeactivate: () => setActiveNestedBlockId(null),
                  allBlocks: col.blocks,
                  onChange: (patch: any) =>
                    updateColumn(
                      col.id,
                      col.blocks.map((b) =>
                        b.id === nb.id ? { ...b, ...patch } : b,
                      ),
                    ),
                  onDelete: () => {
                    updateColumn(
                      col.id,
                      col.blocks.filter((b) => b.id !== nb.id),
                    );
                    if (activeNestedBlockId === nb.id)
                      setActiveNestedBlockId(null);
                  },
                  onMoveUp: () => {
                    if (nbIdx === 0) return;
                    const arr = [...col.blocks];
                    [arr[nbIdx], arr[nbIdx - 1]] = [arr[nbIdx - 1], arr[nbIdx]];
                    updateColumn(col.id, arr);
                  },
                  onMoveDown: () => {
                    if (nbIdx === col.blocks.length - 1) return;
                    const arr = [...col.blocks];
                    [arr[nbIdx], arr[nbIdx + 1]] = [arr[nbIdx + 1], arr[nbIdx]];
                    updateColumn(col.id, arr);
                  },
                  onAddBelow: (type?: BlockType) =>
                    addToColumn(col.id, type ?? "paragraph"),
                }),
              )}
            </div>

            {/* Add button inside column */}
            {isActive && (
              <div className="px-2 py-2">
                <ColumnBlockAdder onAdd={(type) => addToColumn(col.id, type)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </BlockWrapper>
  );
}

// ─── ColumnBlockAdder (copy from original or move to shared) ──────────────────
import { useState } from "react";
import { Plus } from "lucide-react";

const COLUMN_BLOCK_TYPES: { type: BlockType; label: string; icon: string }[] = [
  { type: "paragraph", label: "Paragraph", icon: "¶" },
  { type: "heading2", label: "Heading 2", icon: "H2" },
  { type: "heading3", label: "Heading 3", icon: "H3" },
  { type: "text_input", label: "Text", icon: "T" },
  { type: "textarea_input", label: "Textarea", icon: "¤" },
  { type: "number_input", label: "Number", icon: "#" },
  { type: "date_input", label: "Date", icon: "📅" },
  { type: "select_input", label: "Dropdown", icon: "▽" },
  { type: "checkbox_single", label: "Checkbox", icon: "☑" },
  { type: "checkbox_group", label: "Checkboxes", icon: "☑☑" },
  { type: "radio_group", label: "Radio", icon: "◉" },
  { type: "table", label: "Table", icon: "⊞" },
  { type: "signature", label: "Signature", icon: "✒" },
  { type: "divider", label: "Divider", icon: "—" },
  { type: "media_embed", label: "Image", icon: "🖼" },
  { type: "file_upload", label: "Upload", icon: "📎" },
];

function ColumnBlockAdder({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-1 py-1.5 rounded text-[11px] text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/30 border border-dashed border-transparent hover:border-border/40 transition-colors"
      >
        <Plus className="h-3 w-3" />
        Add block
      </button>
    );
  }

  return (
    <div className="border border-border/60 rounded-lg bg-background shadow-sm p-2">
      <div className="grid grid-cols-4 gap-0.5">
        {COLUMN_BLOCK_TYPES.map((item) => (
          <button
            key={item.type}
            onMouseDown={(e) => {
              e.preventDefault();
              onAdd(item.type);
              setOpen(false);
            }}
            className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded hover:bg-muted transition-colors text-center"
          >
            <span className="text-sm leading-none">{item.icon}</span>
            <span className="text-[9px] text-muted-foreground leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={() => setOpen(false)}
        className="w-full mt-1.5 text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
