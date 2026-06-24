"use client";

import React from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  PenLine,
  Trash2,
} from "lucide-react";
import type { FormBlock, BlockType, InlineAnswerField } from "@/lib/formbuilder-storage";
import { BlockWrapper, FormatButton } from "./block-wrapper";
import { InlineRichEditor, InlineContent, INLINE_FIELD_LABELS, nextAnsId, type InlineRichEditorHandle } from "./inline-rich-editor";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

interface TextBlockEditorProps {
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
  paragraphEditorRef: React.RefObject<InlineRichEditorHandle | null>;
  inlineSelectOptionDrafts: Record<string, string>;
  setInlineSelectOptionDrafts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function TextBlockEditor({
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
  paragraphEditorRef,
  inlineSelectOptionDrafts,
  setInlineSelectOptionDrafts,
}: TextBlockEditorProps) {
  
  const isParagraphBlock = block.type === "paragraph";
  const activeParagraphInlineFieldIds = Array.from(
    (block.content ?? "").matchAll(/\[\[([^\]]+)\]\]/g),
  ).map((m) => m[1]);
  const activeParagraphInlineFields = activeParagraphInlineFieldIds
    .map((id) => (block.inlineFields ?? []).find((f) => f.id === id))
    .filter(Boolean) as InlineAnswerField[];

  const addParagraphInlineField = (fieldType: any = "text") => {
    const newId = nextAnsId(block.inlineFields ?? []);
    const label = INLINE_FIELD_LABELS[fieldType] ?? "Answer";
    const newContent = paragraphEditorRef.current?.insertField(newId, label);
    if (newContent == null) return;
    const newField: InlineAnswerField = {
      id: newId,
      fieldType,
      placeholder: "",
      required: false,
      width: "sm",
    };
    onChange({
      content: newContent,
      inlineFields: [...(block.inlineFields ?? []), newField],
    });
  };

  const updateParagraphInlineField = (
    fieldId: string,
    patch: Partial<InlineAnswerField>,
  ) => {
    onChange({
      inlineFields: (block.inlineFields ?? []).map((f) =>
        f.id === fieldId ? { ...f, ...patch } : f,
      ),
    });
  };

  const removeParagraphInlineField = (fieldId: string) => {
    const escaped = fieldId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    onChange({
      content: (block.content ?? "").replace(
        new RegExp(`\\[\\[${escaped}\\]\\]`, "g"),
        "",
      ),
      inlineFields: (block.inlineFields ?? []).filter((f) => f.id !== fieldId),
    });
  };

  const renderTextBlock = () => {
    const alignment = block.align ?? "left";
    const textClass =
      block.type === "heading1"
        ? "text-3xl font-bold"
        : block.type === "heading2"
          ? "text-2xl font-bold"
          : block.type === "heading3"
            ? "text-xl font-bold"
            : "text-sm leading-relaxed";

    return (
      <div className="space-y-2">
        {/* Formatting toolbar (when active) */}
        {isActive && (
          <div className="flex items-center gap-1 mb-2 pb-2 border-b border-border/50">
            <FormatButton
              icon={Bold}
              active={!!block.bold}
              onClick={() => onChange({ bold: !block.bold })}
              label="Bold"
            />
            <FormatButton
              icon={Italic}
              active={!!block.italic}
              onClick={() => onChange({ italic: !block.italic })}
              label="Italic"
            />
            <FormatButton
              icon={Underline}
              active={!!block.underline}
              onClick={() => onChange({ underline: !block.underline })}
              label="Underline"
            />
            <div className="w-px h-4 bg-border/50 mx-1" />
            <FormatButton
              icon={AlignLeft}
              active={alignment === "left"}
              onClick={() => onChange({ align: "left" })}
              label="Align left"
            />
            <FormatButton
              icon={AlignCenter}
              active={alignment === "center"}
              onClick={() => onChange({ align: "center" })}
              label="Align center"
            />
            <FormatButton
              icon={AlignRight}
              active={alignment === "right"}
              onClick={() => onChange({ align: "right" })}
              label="Align right"
            />

            {isParagraphBlock && (
              <>
                <div className="w-px h-4 bg-border/50 mx-1" />
                <TooltipProvider delayDuration={300}>
                  {[
                    { type: "text", label: "Add Text Field", icon: "T" },
                    { type: "date", label: "Add Date Field", icon: "📅" },
                    { type: "number", label: "Add Number Field", icon: "#" },
                    { type: "select", label: "Add Dropdown", icon: "▽" },
                  ].map((btn) => (
                    <Tooltip key={btn.type}>
                      <TooltipTrigger asChild>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            addParagraphInlineField(btn.type as any);
                          }}
                          className="px-1.5 py-1 rounded text-[10px] font-bold text-teal-600 hover:bg-teal-50 transition-colors"
                        >
                          {btn.icon}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{btn.label}</TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </>
            )}
          </div>
        )}

        {isActive ? (
          <InlineRichEditor
            ref={paragraphEditorRef}
            value={block.content ?? ""}
            inlineFields={block.inlineFields}
            onChange={(content) => onChange({ content })}
            placeholder={
              isParagraphBlock ? "Type something…" : "Heading text…"
            }
            className={`${textClass} ${block.bold ? "font-bold" : ""} ${block.italic ? "italic" : ""} ${block.underline ? "underline" : ""} text-${alignment}`}
          />
        ) : (
          <div
            className={`${textClass} ${block.bold ? "font-bold" : ""} ${block.italic ? "italic" : ""} ${block.underline ? "underline" : ""} text-${alignment} cursor-text min-h-[1.5em]`}
            onClick={onActivate}
          >
            <InlineContent
              text={block.content}
              inlineFields={block.inlineFields}
              empty={isParagraphBlock ? "Empty paragraph…" : "Empty heading…"}
            />
          </div>
        )}

        {/* Inline field config (when active) */}
        {isActive && isParagraphBlock && activeParagraphInlineFields.length > 0 && (
          <div className="mt-4 p-3 rounded-xl border border-teal-100 bg-teal-50/30 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600/60 mb-1">
              Inline Answer Fields
            </p>
            {activeParagraphInlineFields.map((field) => (
              <div
                key={field.id}
                className="flex items-center gap-3 bg-background/80 p-2 rounded-lg border border-teal-100/50 shadow-sm"
              >
                <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-md bg-teal-100 text-teal-700 font-bold text-[10px]">
                  <PenLine className="h-2.5 w-2.5" />
                  {field.id}
                </div>
                <Input
                  className="h-7 text-xs flex-1"
                  value={field.placeholder ?? ""}
                  placeholder="Placeholder hint…"
                  onChange={(e) =>
                    updateParagraphInlineField(field.id, {
                      placeholder: e.target.value,
                    })
                  }
                />
                {field.fieldType === "select" && (
                  <Input
                    className="h-7 text-xs flex-1"
                    value={inlineSelectOptionDrafts[field.id] ?? ""}
                    placeholder="Options (comma separated)…"
                    onChange={(e) => {
                      const val = e.target.value;
                      setInlineSelectOptionDrafts((prev) => ({
                        ...prev,
                        [field.id]: val,
                      }));
                      updateParagraphInlineField(field.id, {
                        options: val
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      });
                    }}
                  />
                )}
                <label className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!field.required}
                    onChange={(e) =>
                      updateParagraphInlineField(field.id, {
                        required: e.target.checked,
                      })
                    }
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  Req
                </label>
                <button
                  onClick={() => removeParagraphInlineField(field.id)}
                  className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
      {renderTextBlock()}
    </BlockWrapper>
  );
}
