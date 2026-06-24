"use client";

import React, { useState, useEffect, useRef } from "react";
import type { FormBlock, BlockType, InlineAnswerField } from "@/lib/formbuilder-storage";
import { MedicalBlockItem } from "@/components/formbuilder/medical-block-item";
import { MediaEmbedBlockItem, FileUploadBlockItem } from "@/components/formbuilder/media-block-item";
import { BlockWrapper } from "./block-wrapper";
import { InputBlockEditor } from "./input-block-editor";
import { TextBlockEditor } from "./text-block-editor";
import { TableBlockEditor } from "./table-block-editor";
import { LayoutBlockEditor } from "./layout-block-editor";
import type { InlineRichEditorHandle } from "./inline-rich-editor";

export interface BlockItemProps {
  block: FormBlock;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onChange: (patch: Partial<FormBlock>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddBelow: (type?: BlockType) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  allBlocks: FormBlock[];
}

const TEXTUAL_TYPES: BlockType[] = ["heading1", "heading2", "heading3", "paragraph"];
const MEDICAL_TYPES: BlockType[] = ["diagnostic_record", "medication_full", "medication_mini", "lab_record", "product_listener"];

export function BlockItem(props: BlockItemProps) {
  const { block, isActive, onActivate, onChange } = props;
  const [hovered, setHovered] = useState(false);
  const [inlineSelectOptionDrafts, setInlineSelectOptionDrafts] = useState<Record<string, string>>({});

  // ── Rich-editor refs ──
  const paragraphEditorRef = useRef<InlineRichEditorHandle>(null);
  const activeCellEditorRef = useRef<InlineRichEditorHandle>(null);

  // ── Sub-editing state ──
  const [activeCell, setActiveCell] = useState<{ ri: number; ci: number } | null>(null);
  const pendingActiveCellRef = useRef<{ ri: number; ci: number } | null>(null);
  const [activeNestedBlockId, setActiveNestedBlockId] = useState<string | null>(null);
  const pendingNestedBlockRef = useRef<{ blockId: string } | null>(null);

  // Reset / consume editing sub-state when block gains or loses focus
  useEffect(() => {
    if (!isActive) {
      setActiveCell(null);
      pendingActiveCellRef.current = null;
      setActiveNestedBlockId(null);
      pendingNestedBlockRef.current = null;
    } else {
      if (pendingActiveCellRef.current) {
        setActiveCell(pendingActiveCellRef.current);
        pendingActiveCellRef.current = null;
      }
      if (pendingNestedBlockRef.current) {
        setActiveNestedBlockId(pendingNestedBlockRef.current.blockId);
        pendingNestedBlockRef.current = null;
      }
    }
  }, [isActive]);

  const editorProps = {
    ...props,
    hovered,
    setHovered,
  };

  if (MEDICAL_TYPES.includes(block.type)) {
    return (
      <BlockWrapper {...editorProps} onBlockChange={onChange}>
        <MedicalBlockItem
          block={block}
          isActive={isActive}
          onChange={onChange}
          onActivate={onActivate}
        />
      </BlockWrapper>
    );
  }

  if (block.type === "media_embed") {
    return (
      <BlockWrapper {...editorProps} onBlockChange={onChange}>
        <MediaEmbedBlockItem block={block} isActive={isActive} onChange={onChange} />
      </BlockWrapper>
    );
  }

  if (block.type === "file_upload") {
    return (
      <BlockWrapper {...editorProps} onBlockChange={onChange}>
        <FileUploadBlockItem block={block} isActive={isActive} onChange={onChange} />
      </BlockWrapper>
    );
  }

  if (block.type === "spacer") {
    return (
      <BlockWrapper {...editorProps} onBlockChange={onChange}>
        <div
          className={`group/spacer relative w-full flex items-center justify-center border border-dashed border-transparent hover:border-border transition-colors ${isActive ? "border-border bg-muted/20" : ""}`}
          style={{ height: block.height ?? 32 }}
          onClick={onActivate}
        >
          <div className="h-px w-full bg-border/30" />
          {isActive && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 bg-background/80 backdrop-blur-sm">
              <span className="text-[10px] text-muted-foreground mr-2 font-mono uppercase tracking-widest">
                Spacer: {block.height}px
              </span>
              <input
                type="range"
                min={8}
                max={200}
                step={8}
                value={block.height ?? 32}
                onChange={(e) => onChange({ height: parseInt(e.target.value) })}
                className="w-24 h-1 bg-muted rounded-full appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>
      </BlockWrapper>
    );
  }

  if (block.type === "divider") {
    return (
      <BlockWrapper {...editorProps} onBlockChange={onChange}>
        <div className="py-4 cursor-pointer" onClick={onActivate}>
          <div className="h-px w-full bg-border" />
        </div>
      </BlockWrapper>
    );
  }

  if (block.type === "signature") {
    return (
      <BlockWrapper {...editorProps} onBlockChange={onChange}>
        {isActive ? (
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground">Label</label>
              <input
                className="mt-0.5 h-7 w-full text-sm border rounded px-2"
                value={block.label ?? ""}
                onChange={(e) => onChange({ label: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div className="py-2 cursor-pointer" onClick={onActivate}>
            <p className="text-xs text-muted-foreground mb-2">{block.label ?? "Signature"}</p>
            <div className="h-12 border-b-2 border-dashed border-slate-400 dark:border-slate-600 relative">
              <span className="absolute bottom-1 left-0 text-[10px] text-muted-foreground/50">Sign here</span>
            </div>
          </div>
        )}
      </BlockWrapper>
    );
  }

  if (block.type === "table") {
    return (
      <TableBlockEditor
        {...editorProps}
        activeCell={activeCell}
        setActiveCell={setActiveCell}
        activeCellEditorRef={activeCellEditorRef}
      />
    );
  }

  if (block.type === "layout") {
    return (
      <LayoutBlockEditor
        {...editorProps}
        activeNestedBlockId={activeNestedBlockId}
        setActiveNestedBlockId={setActiveNestedBlockId}
        pendingNestedBlockRef={pendingNestedBlockRef}
        renderBlockItem={(p: BlockItemProps) => <BlockItem {...p} />}
      />
    );
  }

  if (TEXTUAL_TYPES.includes(block.type)) {
    return (
      <TextBlockEditor
        {...editorProps}
        paragraphEditorRef={paragraphEditorRef}
        inlineSelectOptionDrafts={inlineSelectOptionDrafts}
        setInlineSelectOptionDrafts={setInlineSelectOptionDrafts}
      />
    );
  }

  // Fallback for input blocks
  return <InputBlockEditor {...editorProps} />;
}
