"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FormBlock, BlockType } from "@/lib/formbuilder-storage";
import { BlockWrapper } from "./block-wrapper";

interface InputBlockEditorProps {
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
}

export function InputBlockEditor({
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
}: InputBlockEditorProps) {
  const [optionsInput, setOptionsInput] = useState(
    block.options?.join("\n") ?? "",
  );

  useEffect(() => {
    if (isActive) {
      setOptionsInput(block.options?.join("\n") ?? "");
    }
  }, [isActive, block.options]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isActive) {
        const options = optionsInput
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        onChange({ options });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [optionsInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const isChoice = [
    "checkbox_single",
    "checkbox_group",
    "radio_group",
    "select_input",
  ].includes(block.type);

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
      {/* Preview */}
      <div className="py-0.5" onClick={!isActive ? onActivate : undefined}>
        <div className="flex items-center gap-1.5 mb-1">
          <label
            className={`text-sm font-medium ${!block.label ? "text-muted-foreground/50 italic" : ""}`}
          >
            {block.label || "(no label)"}
          </label>
          {block.required && <span className="text-red-500 text-sm">*</span>}
        </div>

        {block.type === "text_input" && (
          <div className="h-9 border rounded-md bg-muted/30 px-3 flex items-center text-xs text-muted-foreground/50">
            {block.placeholder || "Text input"}
          </div>
        )}
        {block.type === "textarea_input" && (
          <div className="min-h-[5rem] border rounded-md bg-muted/30 px-3 py-2 text-xs text-muted-foreground/50">
            {block.placeholder || "Multi-line text"}
          </div>
        )}
        {block.type === "number_input" && (
          <div className="h-9 w-32 border rounded-md bg-muted/30 px-3 flex items-center text-xs text-muted-foreground/50">
            {block.placeholder || "0"}
          </div>
        )}
        {block.type === "date_input" && (
          <div className="h-9 w-44 border rounded-md bg-muted/30 px-3 flex items-center text-xs text-muted-foreground/50">
            dd / mm / yyyy
          </div>
        )}
        {block.type === "checkbox_single" && (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 rounded-sm border-border bg-background" />
            <span className="text-sm text-muted-foreground/70">
              {block.label || "(no label)"}
            </span>
          </div>
        )}
        {block.type === "checkbox_group" && (
          <div className="space-y-1.5">
            {(block.options ?? ["Option A"]).map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 rounded-sm border-border bg-background shrink-0" />
                <span className="text-sm">{opt}</span>
              </div>
            ))}
          </div>
        )}
        {block.type === "radio_group" && (
          <div className="space-y-1.5">
            {(block.options ?? ["Option A"]).map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 rounded-full border-border bg-background shrink-0" />
                <span className="text-sm">{opt}</span>
              </div>
            ))}
          </div>
        )}
        {block.type === "select_input" && (
          <div className="h-9 border rounded-md bg-muted/30 px-3 flex items-center justify-between text-xs text-muted-foreground/50 w-64">
            <span>Select an option…</span>
            <ChevronDown className="h-3 w-3" />
          </div>
        )}
      </div>

      {/* Config panel (when active) */}
      {isActive && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
          {block.type !== "checkbox_single" && (
            <div>
              <label className="text-xs text-muted-foreground">Label</label>
              <Input
                className="mt-0.5 h-7 text-sm"
                value={block.label ?? ""}
                onChange={(e) => onChange({ label: e.target.value })}
              />
            </div>
          )}
          {block.type === "checkbox_single" && (
            <div>
              <label className="text-xs text-muted-foreground">
                Checkbox label
              </label>
              <Input
                className="mt-0.5 h-7 text-sm"
                value={block.label ?? ""}
                onChange={(e) => onChange({ label: e.target.value })}
              />
            </div>
          )}
          {["text_input", "textarea_input", "number_input"].includes(
            block.type,
          ) && (
            <div>
              <label className="text-xs text-muted-foreground">
                Placeholder hint
              </label>
              <Input
                className="mt-0.5 h-7 text-sm"
                value={block.placeholder ?? ""}
                placeholder="e.g. Enter value…"
                onChange={(e) => onChange({ placeholder: e.target.value })}
              />
            </div>
          )}
          {["checkbox_group", "radio_group", "select_input"].includes(
            block.type,
          ) && (
            <div>
              <label className="text-xs text-muted-foreground">
                Options (one per line)
              </label>
              <Textarea
                className="mt-0.5 text-sm min-h-[80px]"
                value={optionsInput}
                placeholder={"Option A\nOption B\nOption C"}
                onChange={(e) => setOptionsInput(e.target.value)}
              />
            </div>
          )}
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!block.required}
              onChange={(e) => onChange({ required: e.target.checked })}
              className="rounded"
            />
            Required field
          </label>
        </div>
      )}
    </BlockWrapper>
  );
}
