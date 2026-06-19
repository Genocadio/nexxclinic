"use client";

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  PenLine,
} from "lucide-react";
import type {
  BlockType,
  FormBlock,
  InlineAnswerField,
  InlineFieldType,
  InlineFieldWidth,
  LayoutColumn,
  TableCell,
} from "@/lib/formbuilder-storage";
import { fbGenId, fbMakeBlock } from "@/lib/formbuilder-storage";
import { MedicalBlockItem } from "@/components/formbuilder/medical-block-item";
import { ConditionalConfig } from "@/components/formbuilder/conditional-config";

// ─── InlineRichEditor — contentEditable paragraph/cell editor with chip tokens ─

/** Chip style applied inline so no global CSS is needed (dark-mode via CSS var fallback). */
const CHIP_STYLE =
  "display:inline-flex;align-items:center;gap:3px;padding:0 6px;" +
  "border-radius:4px;font-size:0.82em;font-weight:600;" +
  "background:rgb(204 251 241);color:rgb(15 118 110);border:1px solid rgb(153 246 228);" +
  "margin:0 2px;white-space:nowrap;cursor:default;user-select:none;" +
  "line-height:1.5;vertical-align:baseline;";

export interface InlineRichEditorHandle {
  /** Insert a chip for fieldId at the current cursor and return the serialised content. */
  insertField(fieldId: string, label: string): string | null;
  focus(): void;
}

const InlineRichEditor = React.forwardRef<
  InlineRichEditorHandle,
  {
    value: string;
    inlineFields?: InlineAnswerField[];
    onChange: (v: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    placeholder?: string;
    className?: string;
  }
>(function InlineRichEditor(
  { value, inlineFields, onChange, onKeyDown, placeholder, className },
  ref,
) {
  const divRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef(value);
  const skipSyncRef = useRef(false);

  // Build HTML with chip spans for [[id]] tokens
  const buildHTML = useCallback(
    (text: string): string =>
      text
        .split(/(\[\[[^\]]+\]\])/g)
        .map((part) => {
          const m = part.match(/^\[\[([^\]]+)\]\]$/);
          if (m) {
            const field = (inlineFields ?? []).find((f) => f.id === m[1]);
            const label =
              INLINE_FIELD_LABELS[field?.fieldType ?? "text"] ?? "Answer";
            return (
              `<span data-fid="${m[1]}" contenteditable="false" spellcheck="false" style="${CHIP_STYLE}">` +
              `\u270f\u00a0${label}</span>`
            );
          }
          return part
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        })
        .join(""),
    [inlineFields],
  );

  // Serialise DOM → token string
  const readContent = (el: HTMLElement): string => {
    let out = "";
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        out += node.textContent ?? "";
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const span = node as HTMLElement;
        const fid = span.getAttribute("data-fid");
        if (fid) {
          out += `[[${fid}]]`;
        } else if (span.tagName === "BR") {
          out += "\n";
        } else {
          out += readContent(span); // recurse for <div> inserted by browser on Enter
        }
      }
    });
    return out;
  };

  useImperativeHandle(ref, () => ({
    insertField(fieldId: string, label: string): string | null {
      const el = divRef.current;
      if (!el) return null;
      el.focus();

      const sel = window.getSelection();
      let range: Range;
      if (sel && sel.rangeCount > 0 && el.contains(sel.anchorNode)) {
        range = sel.getRangeAt(0);
      } else {
        range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
      }
      range.deleteContents();

      const chip = document.createElement("span");
      chip.setAttribute("data-fid", fieldId);
      chip.setAttribute("contenteditable", "false");
      chip.setAttribute("spellcheck", "false");
      chip.style.cssText = CHIP_STYLE;
      chip.textContent = `\u270f\u00a0${label}`;

      range.insertNode(chip);

      // Move cursor after the chip
      const after = document.createRange();
      after.setStartAfter(chip);
      after.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(after);

      const newContent = readContent(el);
      lastValueRef.current = newContent;
      skipSyncRef.current = true;
      return newContent;
    },
    focus() {
      divRef.current?.focus();
    },
  }));

  // Mount: set initial HTML
  useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = buildHTML(value);
      lastValueRef.current = value;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // External value sync (e.g. field removed → content changes from parent)
  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }
    if (divRef.current && value !== lastValueRef.current) {
      const hadFocus = document.activeElement === divRef.current;
      divRef.current.innerHTML = buildHTML(value);
      lastValueRef.current = value;
      if (hadFocus) {
        const r = document.createRange();
        r.selectNodeContents(divRef.current);
        r.collapse(false);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(r);
      }
    }
  }, [value, buildHTML]);

  // Update chip labels in-place when field type changes (no cursor disruption)
  useEffect(() => {
    divRef.current
      ?.querySelectorAll<HTMLElement>("[data-fid]")
      .forEach((chip) => {
        const fid = chip.getAttribute("data-fid");
        const field = (inlineFields ?? []).find((f) => f.id === fid);
        const label =
          INLINE_FIELD_LABELS[field?.fieldType ?? "text"] ?? "Answer";
        chip.textContent = `\u270f\u00a0${label}`;
      });
  }, [inlineFields]);

  const handleInput = () => {
    if (!divRef.current) return;
    const newVal = readContent(divRef.current);
    lastValueRef.current = newVal;
    onChange(newVal);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  return (
    <div className="relative">
      {!value && placeholder && (
        <span className="absolute top-0 left-0 pointer-events-none text-muted-foreground/40 italic select-none text-sm">
          {placeholder}
        </span>
      )}
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={onKeyDown}
        onPaste={handlePaste}
        className={`outline-none leading-relaxed ${className ?? ""}`}
        style={{
          minHeight: "1.5em",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      />
    </div>
  );
});

// ─── Inline answer field helpers ───────────────────────────────────────────────

/**
 * Returns the next sequential answer-field slot name that isn't already used.
 * Tokens stored in content look like [[ans1]], [[ans2]], … — short and readable.
 */
function nextAnsId(existingFields: InlineAnswerField[]): string {
  let i = 1;
  while (existingFields.some((f) => f.id === `ans${i}`)) i++;
  return `ans${i}`;
}

const INLINE_FIELD_LABELS: Record<string, string> = {
  text: "Text",
  textarea: "Long text",
  date: "Date",
  number: "Number",
  select: "Dropdown",
};

// ─── Inline content renderer ──────────────────────────────────────────────────

function InlineContent({
  text,
  empty,
  inlineFields,
}: {
  text?: string;
  empty?: string;
  inlineFields?: InlineAnswerField[];
}) {
  if (!text) {
    return (
      <span className="text-muted-foreground/40 italic select-none">
        {empty ?? ""}
      </span>
    );
  }

  // Only split on [[field_id]] answer-field tokens — no more {{placeholder}} tokens
  const parts = text.split(/(\[\[[^\]]+\]\])/g);

  return (
    <>
      {parts
        .filter((p) => p.length > 0)
        .map((part, idx) => {
          const fi = part.match(/^\[\[([^\]]+)\]\]$/);
          if (fi) {
            const field = inlineFields?.find((f) => f.id === fi[1]);
            const typeLabel = field
              ? (INLINE_FIELD_LABELS[field.fieldType] ?? field.fieldType)
              : "?";
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0 rounded-md text-[0.82em] font-semibold mx-0.5 border bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700"
              >
                <PenLine className="h-2.5 w-2.5" />
                {typeLabel}
              </span>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
    </>
  );
}

// ─── Auto-growing textarea ────────────────────────────────────────────────────

function AutoTextarea({
  value,
  onChange,
  onKeyDown,
  className,
  placeholder,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  className?: string;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const ref = (inputRef ?? innerRef) as React.RefObject<HTMLTextAreaElement>;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [value, ref]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={1}
      className={`w-full resize-none overflow-hidden bg-transparent outline-none border-none focus:ring-0 p-0 leading-relaxed ${className ?? ""}`}
    />
  );
}

// ─── Block type palette (left sidebar) ───────────────────────────────────────

const PALETTE_GROUPS: {
  label: string;
  items: { type: BlockType; label: string; icon: string }[];
}[] = [
  {
    label: "Text",
    items: [
      { type: "heading1", label: "Heading 1", icon: "H1" },
      { type: "heading2", label: "Heading 2", icon: "H2" },
      { type: "heading3", label: "Heading 3", icon: "H3" },
      { type: "paragraph", label: "Paragraph", icon: "¶" },
    ],
  },
  {
    label: "Structure",
    items: [
      { type: "divider", label: "Divider", icon: "—" },
      { type: "spacer", label: "Spacer", icon: "↕" },
      { type: "table", label: "Table", icon: "⊞" },
      { type: "layout", label: "Columns Layout", icon: "▥" },
    ],
  },
  {
    label: "Inputs",
    items: [
      { type: "text_input", label: "Text Field", icon: "T" },
      { type: "textarea_input", label: "Text Area", icon: "¤" },
      { type: "number_input", label: "Number", icon: "#" },
      { type: "date_input", label: "Date", icon: "📅" },
    ],
  },
  {
    label: "Selection",
    items: [
      { type: "checkbox_single", label: "Checkbox", icon: "☑" },
      { type: "checkbox_group", label: "Checkbox Group", icon: "☑☑" },
      { type: "radio_group", label: "Radio Group", icon: "◉" },
      { type: "select_input", label: "Dropdown", icon: "▽" },
    ],
  },
  {
    label: "Document",
    items: [{ type: "signature", label: "Signature", icon: "✒" }],
  },
  {
    label: "Clinical",
    items: [
      { type: "diagnostic_record", label: "Diagnosis Block", icon: "🩻" },
      { type: "medication_full", label: "Full Medication", icon: "💊" },
      { type: "medication_mini", label: "Quick Medication", icon: "💉" },
      { type: "lab_record", label: "Lab Record", icon: "🧪" },
      { type: "product_listener", label: "Product Listener", icon: "🔗" },
    ],
  },
];

function BlockPalette({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <div className="px-2 py-3 space-y-4">
      {PALETTE_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground px-1 mb-1.5">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <button
                key={item.type}
                onClick={() => onAdd(item.type)}
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-left"
              >
                <span className="w-6 text-center text-xs font-bold text-muted-foreground shrink-0">
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ColumnBlockAdder ─────────────────────────────────────────────────────

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

// ─── Single block ─────────────────────────────────────────────────────

interface BlockItemProps {
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

const TEXTUAL_TYPES: BlockType[] = [
  "heading1",
  "heading2",
  "heading3",
  "paragraph",
];

function BlockItem({
  block,
  isActive,
  isFirst,
  isLast,
  onActivate,
  onDeactivate,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBelow,
  textareaRef,
  allBlocks,
}: BlockItemProps) {
  const [hovered, setHovered] = useState(false);
  const [optionsInput, setOptionsInput] = useState(
    block.options?.join("\n") ?? "",
  );

  // ── Rich-editor refs: paragraph gets its own, active table cell gets its own ───
  const paragraphEditorRef = useRef<InlineRichEditorHandle>(null);
  const activeCellEditorRef = useRef<InlineRichEditorHandle>(null);

  // ── Table cell editing state ────────────────────────────────────────────
  const [activeCell, setActiveCell] = useState<{
    ri: number;
    ci: number;
  } | null>(null);
  const pendingActiveCellRef = useRef<{ ri: number; ci: number } | null>(null);

  // ── Layout nested-block editing state ──────────────────────────────────────
  const [activeNestedBlockId, setActiveNestedBlockId] = useState<string | null>(
    null,
  );
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

  const isTextual = TEXTUAL_TYPES.includes(block.type);

  // ─── Inline answer field handlers (paragraph blocks only) ─────────────────

  const handleAddInlineField = useCallback(
    (fieldType: InlineFieldType = "text") => {
      const newId = nextAnsId(block.inlineFields ?? []);
      const label = INLINE_FIELD_LABELS[fieldType] ?? "Answer";
      // insertField inserts the chip at the editor cursor and returns serialised content
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
    },
    [block.inlineFields, onChange],
  );

  const handleUpdateInlineField = useCallback(
    (fieldId: string, patch: Partial<InlineAnswerField>) => {
      const fields = (block.inlineFields ?? []).map((f) =>
        f.id === fieldId ? { ...f, ...patch } : f,
      );
      onChange({ inlineFields: fields });
    },
    [block.inlineFields, onChange],
  );

  const handleRemoveInlineField = useCallback(
    (fieldId: string) => {
      const escaped = fieldId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const newContent = (block.content ?? "").replace(
        new RegExp(`\\[\\[${escaped}\\]\\]`, "g"),
        "",
      );
      const newFields = (block.inlineFields ?? []).filter(
        (f) => f.id !== fieldId,
      );
      onChange({ content: newContent, inlineFields: newFields });
    },
    [block.content, block.inlineFields, onChange],
  );

  // Sync options textarea → block
  useEffect(() => {
    if (!isActive) return;
    const next = optionsInput
      .split("\n")
      .map((o) => o.trim())
      .filter(Boolean);
    if (JSON.stringify(next) !== JSON.stringify(block.options)) {
      onChange({ options: next });
    }
  }, [optionsInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync options from block → textarea when activated
  useEffect(() => {
    if (isActive) setOptionsInput(block.options?.join("\n") ?? "");
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onDeactivate();
    }
    if (e.key === "Enter" && !e.shiftKey && isTextual) {
      e.preventDefault();
      onAddBelow("paragraph");
    }
  };

  /* ── TEXT BLOCK (heading / paragraph) ── */
  const renderTextBlock = () => {
    const sizeClass =
      block.type === "heading1"
        ? "text-3xl font-bold leading-tight"
        : block.type === "heading2"
          ? "text-xl font-semibold leading-snug"
          : block.type === "heading3"
            ? "text-base font-semibold leading-snug"
            : "text-sm leading-relaxed";

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

    const isParagraph = block.type === "paragraph";

    // Inline fields currently referenced by [[id]] tokens in content
    const referencedIds = Array.from(
      (block.content ?? "").matchAll(/\[\[([^\]]+)\]\]/g),
    ).map((m) => m[1]);
    const activeInlineFields = referencedIds
      .map((id) => (block.inlineFields ?? []).find((f) => f.id === id))
      .filter(Boolean) as InlineAnswerField[];

    if (isActive) {
      return (
        <div className="space-y-2">
          {/* Formatting toolbar */}
          <div className="flex items-center gap-0.5 flex-wrap -ml-1">
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
            <div className="w-px h-4 bg-border mx-1" />
            <FormatButton
              icon={AlignLeft}
              active={!block.align || block.align === "left"}
              onClick={() => onChange({ align: "left" })}
              label="Left"
            />
            <FormatButton
              icon={AlignCenter}
              active={block.align === "center"}
              onClick={() => onChange({ align: "center" })}
              label="Center"
            />
            <FormatButton
              icon={AlignRight}
              active={block.align === "right"}
              onClick={() => onChange({ align: "right" })}
              label="Right"
            />
            {/* Answer Field button — paragraph only */}
            {isParagraph && (
              <>
                <div className="w-px h-4 bg-border mx-1" />
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleAddInlineField("text");
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors"
                      >
                        <PenLine className="h-3 w-3" />
                        Answer Field
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Insert an answer field at cursor — configure type below
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>

          {isParagraph ? (
            <InlineRichEditor
              ref={paragraphEditorRef}
              value={block.content ?? ""}
              inlineFields={block.inlineFields}
              onChange={(v) => onChange({ content: v })}
              onKeyDown={
                handleKeyDown as (
                  e: React.KeyboardEvent<HTMLDivElement>,
                ) => void
              }
              className={`${sizeClass} ${alignClass} ${styleClass}`}
              placeholder="Write text, then click Answer Field to insert fillable areas…"
            />
          ) : (
            <AutoTextarea
              inputRef={textareaRef}
              value={block.content ?? ""}
              onChange={(v) => onChange({ content: v })}
              onKeyDown={
                handleKeyDown as (
                  e: React.KeyboardEvent<HTMLTextAreaElement>,
                ) => void
              }
              className={`${sizeClass} ${alignClass} ${styleClass} placeholder:text-muted-foreground/40`}
              placeholder={
                block.type === "heading1"
                  ? "Heading 1…"
                  : block.type === "heading2"
                    ? "Heading 2…"
                    : "Heading 3…"
              }
            />
          )}

          {/* Answer fields panel — shown only for paragraphs that have inline fields */}
          {isParagraph && activeInlineFields.length > 0 && (
            <div className="mt-2 pt-3 border-t border-teal-200/60 dark:border-teal-800/40 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                <PenLine className="h-3 w-3" />
                Answer Fields ({activeInlineFields.length})
              </p>
              {activeInlineFields.map((field, fi) => (
                <div
                  key={field.id}
                  className="flex items-center gap-1.5 p-2 rounded-lg border border-teal-200/70 dark:border-teal-700/40 bg-teal-50/40 dark:bg-teal-900/10 flex-wrap"
                >
                  {/* Index badge */}
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 shrink-0 w-4 text-center">
                    {fi + 1}
                  </span>

                  {/* Field type */}
                  <select
                    value={field.fieldType}
                    onChange={(e) =>
                      handleUpdateInlineField(field.id, {
                        fieldType: e.target.value as InlineFieldType,
                        options:
                          e.target.value !== "select"
                            ? undefined
                            : field.options,
                      })
                    }
                    className="h-6 px-1 text-xs border rounded bg-background"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="select">Dropdown</option>
                    <option value="textarea">Long text</option>
                  </select>

                  {/* Width */}
                  <select
                    value={field.width ?? "sm"}
                    onChange={(e) =>
                      handleUpdateInlineField(field.id, {
                        width: e.target.value as InlineFieldWidth,
                      })
                    }
                    className="h-6 px-1 text-xs border rounded bg-background w-16"
                    title="Display width"
                  >
                    <option value="xs">XS</option>
                    <option value="sm">SM</option>
                    <option value="md">MD</option>
                    <option value="lg">LG</option>
                    <option value="full">Full</option>
                  </select>

                  {/* Options input for dropdown type */}
                  {field.fieldType === "select" && (
                    <Input
                      className="h-6 text-xs flex-1 min-w-[120px]"
                      placeholder="opt1, opt2, opt3…"
                      value={field.options?.join(", ") ?? ""}
                      onChange={(e) =>
                        handleUpdateInlineField(field.id, {
                          options: e.target.value
                            .split(",")
                            .map((o) => o.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  )}

                  {/* Placeholder for non-select */}
                  {field.fieldType !== "select" && (
                    <Input
                      className="h-6 text-xs flex-1 min-w-[100px]"
                      placeholder="Hint text…"
                      value={field.placeholder ?? ""}
                      onChange={(e) =>
                        handleUpdateInlineField(field.id, {
                          placeholder: e.target.value,
                        })
                      }
                    />
                  )}

                  {/* Required */}
                  <label className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!field.required}
                      onChange={(e) =>
                        handleUpdateInlineField(field.id, {
                          required: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    Req
                  </label>

                  {/* Delete field */}
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleRemoveInlineField(field.id)}
                          className="p-0.5 rounded text-muted-foreground hover:text-destructive shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Remove this answer field</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // ── Display mode ──
    const textClass = `${sizeClass} ${alignClass} ${styleClass} min-h-[1.5em] cursor-text`;
    return (
      <div className={textClass} onClick={onActivate}>
        <InlineContent
          text={block.content}
          inlineFields={block.inlineFields}
          empty={
            block.type === "paragraph"
              ? "Start typing…"
              : block.type === "heading1"
                ? "Heading 1"
                : block.type === "heading2"
                  ? "Heading 2"
                  : "Heading 3"
          }
        />
      </div>
    );
  };

  /* ── DIVIDER ── */
  if (block.type === "divider") {
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
        <hr className="border-t-2 border-border my-1 cursor-default" />
      </BlockWrapper>
    );
  }

  /* ── SPACER ── */
  if (block.type === "spacer") {
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
        {isActive ? (
          <div className="flex items-center gap-3 py-1">
            <span className="text-xs text-muted-foreground">Height (px):</span>
            <input
              type="number"
              className="w-20 border rounded px-2 py-0.5 text-xs bg-background"
              value={block.height ?? 32}
              min={8}
              max={200}
              onChange={(e) =>
                onChange({ height: parseInt(e.target.value) || 32 })
              }
            />
          </div>
        ) : (
          <div
            style={{ height: block.height ?? 32 }}
            className="flex items-center justify-center text-[10px] text-muted-foreground/30 select-none border-dashed border border-border/30 rounded"
          >
            {hovered ? `${block.height ?? 32}px spacer` : ""}
          </div>
        )}
      </BlockWrapper>
    );
  }

  /* ── SIGNATURE ── */
  if (block.type === "signature") {
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
        {isActive ? (
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground">Label</label>
              <Input
                className="mt-0.5 h-7 text-sm"
                value={block.label ?? ""}
                onChange={(e) => onChange({ label: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div className="py-2 cursor-pointer">
            <p className="text-xs text-muted-foreground mb-2">
              {block.label ?? "Signature"}
            </p>
            <div className="h-12 border-b-2 border-dashed border-slate-400 dark:border-slate-600 relative">
              <span className="absolute bottom-1 left-0 text-[10px] text-muted-foreground/50">
                Sign here
              </span>
            </div>
          </div>
        )}
      </BlockWrapper>
    );
  }

  /* ── TABLE ── */
  if (block.type === "table") {
    const rows = Math.max(1, block.tableRows ?? 3);
    const cols = Math.max(1, block.tableCols ?? 3);

    // ── Cell helpers ─────────────────────────────────────────────────────────

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

    // ── Active-cell derived data ──────────────────────────────────────────────

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

    // Does this table have any answer fields at all?
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
        {/* ── Size controls ── */}
        {isActive && (
          <div className="flex flex-wrap items-center gap-4 mb-2 text-xs">
            <label className="flex items-center gap-2">
              <span className="text-muted-foreground">Rows</span>
              <input
                type="number"
                min={1}
                max={20}
                value={rows}
                onChange={(e) => {
                  onChange({ tableRows: parseInt(e.target.value) || 1 });
                  setActiveCell(null);
                }}
                className="w-14 border rounded px-2 py-0.5 bg-background"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-muted-foreground">Columns</span>
              <input
                type="number"
                min={1}
                max={10}
                value={cols}
                onChange={(e) => {
                  onChange({ tableCols: parseInt(e.target.value) || 1 });
                  setActiveCell(null);
                }}
                className="w-14 border rounded px-2 py-0.5 bg-background"
              />
            </label>
            {tableHasAnswerFields && (
              <span className="text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1">
                <PenLine className="h-3 w-3" />
                Has answer fields
              </span>
            )}
          </div>
        )}

        {/* ── Cell formatting toolbar — shown when a cell is selected ── */}
        {isActive && activeCell && (
          <TooltipProvider delayDuration={300}>
            <div className="flex items-center gap-0.5 mb-2 pb-2 border-b border-border/50 flex-wrap -ml-1">
              <FormatButton
                icon={Bold}
                active={!!activeCellData?.bold}
                onClick={() =>
                  activeCell &&
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
                  activeCell &&
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
                  activeCell &&
                  patchCell(activeCell.ri, activeCell.ci, {
                    underline: !activeCellData?.underline,
                  })
                }
                label="Underline"
              />
              <div className="w-px h-4 bg-border mx-1" />
              <FormatButton
                icon={AlignLeft}
                active={
                  !activeCellData?.align || activeCellData.align === "left"
                }
                onClick={() =>
                  activeCell &&
                  patchCell(activeCell.ri, activeCell.ci, { align: "left" })
                }
                label="Align left"
              />
              <FormatButton
                icon={AlignCenter}
                active={activeCellData?.align === "center"}
                onClick={() =>
                  activeCell &&
                  patchCell(activeCell.ri, activeCell.ci, { align: "center" })
                }
                label="Align center"
              />
              <FormatButton
                icon={AlignRight}
                active={activeCellData?.align === "right"}
                onClick={() =>
                  activeCell &&
                  patchCell(activeCell.ri, activeCell.ci, { align: "right" })
                }
                label="Align right"
              />
              <div className="w-px h-4 bg-border mx-1" />
              {/* Answer field inserter */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addCellInlineField("text");
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors"
                  >
                    <PenLine className="h-3 w-3" />
                    Answer Field
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  Insert an answer field at cursor in this cell
                </TooltipContent>
              </Tooltip>
              <span className="ml-auto text-[10px] text-muted-foreground/40">
                R{activeCell.ri + 1} · C{activeCell.ci + 1}
              </span>
            </div>
          </TooltipProvider>
        )}

        {/* ── Table ── */}
        <div
          className="overflow-x-auto"
          onClick={() => !isActive && onActivate()}
        >
          <table className="w-full border-collapse text-sm">
            <tbody>
              {Array.from({ length: rows }).map((_, ri) => (
                <tr key={ri}>
                  {Array.from({ length: cols }).map((_, ci) => {
                    const cell = getCell(ri, ci);
                    const isCellActive =
                      isActive &&
                      activeCell?.ri === ri &&
                      activeCell?.ci === ci;

                    const cellAlignClass =
                      cell.align === "center"
                        ? "text-center"
                        : cell.align === "right"
                          ? "text-right"
                          : "text-left";
                    const cellStyleClass = [
                      cell.bold ? "font-bold" : "",
                      cell.italic ? "italic" : "",
                      cell.underline ? "underline" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <td
                        key={ci}
                        onClick={(e) => {
                          if (!isActive) {
                            // First click: activate the block, queue cell selection
                            pendingActiveCellRef.current = { ri, ci };
                            onActivate();
                          } else {
                            e.stopPropagation();
                            setActiveCell({ ri, ci });
                          }
                        }}
                        className={`border border-border min-w-[80px] cursor-text transition-colors ${
                          isCellActive
                            ? "ring-2 ring-inset ring-primary/50 bg-background p-0"
                            : isActive
                              ? "hover:bg-muted/20 px-2 py-1"
                              : "px-3 py-2"
                        }`}
                      >
                        {isCellActive ? (
                          <InlineRichEditor
                            ref={activeCellEditorRef}
                            value={cell.content ?? ""}
                            inlineFields={cell.inlineFields}
                            onChange={(v) => patchCell(ri, ci, { content: v })}
                            className={`px-2 py-1 text-sm ${cellAlignClass} ${cellStyleClass}`}
                            placeholder="Type here…"
                          />
                        ) : (
                          <div
                            className={`text-sm min-h-[28px] ${
                              cell.content
                                ? `${cellAlignClass} ${cellStyleClass}`
                                : ""
                            }`}
                          >
                            {cell.content ? (
                              <InlineContent
                                text={cell.content}
                                inlineFields={cell.inlineFields}
                              />
                            ) : (
                              isActive && (
                                <span className="text-muted-foreground/20 text-xs select-none">
                                  ·
                                </span>
                              )
                            )}
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

        {/* ── Answer fields panel for the active cell ── */}
        {isActive && activeCell && activeCellFields.length > 0 && (
          <div className="mt-3 pt-3 border-t border-teal-200/60 dark:border-teal-800/40 space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
              <PenLine className="h-3 w-3" />
              Answer Fields — R{activeCell.ri + 1}·C{activeCell.ci + 1} (
              {activeCellFields.length})
            </p>
            {activeCellFields.map((field, fi) => (
              <div
                key={field.id}
                className="flex items-center gap-1.5 p-2 rounded-lg border border-teal-200/70 dark:border-teal-700/40 bg-teal-50/40 dark:bg-teal-900/10 flex-wrap"
              >
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 shrink-0 w-4 text-center">
                  {fi + 1}
                </span>
                <select
                  value={field.fieldType}
                  onChange={(e) =>
                    updateCellInlineField(
                      activeCell.ri,
                      activeCell.ci,
                      field.id,
                      {
                        fieldType: e.target.value as InlineFieldType,
                        options:
                          e.target.value !== "select"
                            ? undefined
                            : field.options,
                      },
                    )
                  }
                  className="h-6 px-1 text-xs border rounded bg-background"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="select">Dropdown</option>
                  <option value="textarea">Long text</option>
                </select>
                <select
                  value={field.width ?? "sm"}
                  onChange={(e) =>
                    updateCellInlineField(
                      activeCell.ri,
                      activeCell.ci,
                      field.id,
                      { width: e.target.value as InlineFieldWidth },
                    )
                  }
                  className="h-6 px-1 text-xs border rounded bg-background w-16"
                >
                  <option value="xs">XS</option>
                  <option value="sm">SM</option>
                  <option value="md">MD</option>
                  <option value="lg">LG</option>
                  <option value="full">Full</option>
                </select>
                {field.fieldType === "select" ? (
                  <Input
                    className="h-6 text-xs flex-1 min-w-[120px]"
                    placeholder="opt1, opt2, opt3…"
                    value={field.options?.join(", ") ?? ""}
                    onChange={(e) =>
                      updateCellInlineField(
                        activeCell.ri,
                        activeCell.ci,
                        field.id,
                        {
                          options: e.target.value
                            .split(",")
                            .map((o) => o.trim())
                            .filter(Boolean),
                        },
                      )
                    }
                  />
                ) : (
                  <Input
                    className="h-6 text-xs flex-1 min-w-[100px]"
                    placeholder="Hint text…"
                    value={field.placeholder ?? ""}
                    onChange={(e) =>
                      updateCellInlineField(
                        activeCell.ri,
                        activeCell.ci,
                        field.id,
                        { placeholder: e.target.value },
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
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
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
                    </TooltipTrigger>
                    <TooltipContent>Remove answer field</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        )}

        {/* ── Click-to-edit hint when no cell is selected ── */}
        {isActive && !activeCell && (
          <p className="mt-2 text-[11px] text-muted-foreground/50 italic text-center">
            Click a cell to edit its content, format it, or add an answer field.
          </p>
        )}
      </BlockWrapper>
    );
  }

  /* ── LAYOUT (columns) ── */
  if (block.type === "layout") {
    const columns = block.layoutColumns ?? [];
    const numCols = columns.length;

    const gridClass =
      numCols <= 1
        ? "grid-cols-1"
        : numCols === 2
          ? "grid-cols-1 sm:grid-cols-2"
          : numCols === 3
            ? "grid-cols-1 sm:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

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
        <div className={`grid ${gridClass} gap-3`}>
          {columns.map((col, colIdx) => (
            <div
              key={col.id}
              className={`min-w-0 flex flex-col rounded-lg transition-colors ${
                isActive
                  ? "border border-dashed border-border/50 bg-muted/5"
                  : ""
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
                {col.blocks.map((nb, nbIdx) => (
                  <BlockItem
                    key={nb.id}
                    block={nb}
                    isActive={isActive && activeNestedBlockId === nb.id}
                    isFirst={nbIdx === 0}
                    isLast={nbIdx === col.blocks.length - 1}
                    onActivate={() => {
                      if (isActive) {
                        setActiveNestedBlockId(nb.id);
                      } else {
                        pendingNestedBlockRef.current = { blockId: nb.id };
                        onActivate();
                      }
                    }}
                    onDeactivate={() => setActiveNestedBlockId(null)}
                    allBlocks={col.blocks}
                    onChange={(patch) =>
                      updateColumn(
                        col.id,
                        col.blocks.map((b) =>
                          b.id === nb.id ? { ...b, ...patch } : b,
                        ),
                      )
                    }
                    onDelete={() => {
                      updateColumn(
                        col.id,
                        col.blocks.filter((b) => b.id !== nb.id),
                      );
                      if (activeNestedBlockId === nb.id)
                        setActiveNestedBlockId(null);
                    }}
                    onMoveUp={() => {
                      if (nbIdx === 0) return;
                      const arr = [...col.blocks];
                      [arr[nbIdx], arr[nbIdx - 1]] = [
                        arr[nbIdx - 1],
                        arr[nbIdx],
                      ];
                      updateColumn(col.id, arr);
                    }}
                    onMoveDown={() => {
                      if (nbIdx === col.blocks.length - 1) return;
                      const arr = [...col.blocks];
                      [arr[nbIdx], arr[nbIdx + 1]] = [
                        arr[nbIdx + 1],
                        arr[nbIdx],
                      ];
                      updateColumn(col.id, arr);
                    }}
                    onAddBelow={(type) =>
                      addToColumn(col.id, type ?? "paragraph")
                    }
                  />
                ))}
              </div>

              {/* Add block to this column */}
              {isActive && (
                <div className="px-1 pb-1">
                  <ColumnBlockAdder
                    onAdd={(type) => addToColumn(col.id, type)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </BlockWrapper>
    );
  }

  /* ── MEDICAL / CLINICAL BLOCKS ── */
  const MEDICAL_TYPES: BlockType[] = [
    "diagnostic_record",
    "medication_full",
    "medication_mini",
    "lab_record",
    "product_listener",
  ];

  if (MEDICAL_TYPES.includes(block.type)) {
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
        <MedicalBlockItem
          block={block}
          isActive={isActive}
          onChange={onChange}
          onActivate={onActivate}
        />
      </BlockWrapper>
    );
  }

  /* ── INPUT BLOCKS ── */
  const isInput = [
    "text_input",
    "textarea_input",
    "number_input",
    "date_input",
  ].includes(block.type);
  const isChoice = [
    "checkbox_single",
    "checkbox_group",
    "radio_group",
    "select_input",
  ].includes(block.type);

  if (isInput || isChoice) {
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

  /* ── HEADING / PARAGRAPH ── */
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

// ─── Format button ────────────────────────────────────────────────────────────

function FormatButton({
  icon: Icon,
  active,
  onClick,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onClick();
          }}
          className={`p-1 rounded text-xs transition-colors ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

// ─── Block wrapper (hover controls) ──────────────────────────────────────────

interface BlockWrapperProps {
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
  children: React.ReactNode;
  allBlocks?: FormBlock[];
  onBlockChange?: (patch: Partial<FormBlock>) => void;
}

function BlockWrapper({
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
  children,
  allBlocks: wrapperAllBlocks,
  onBlockChange,
}: BlockWrapperProps) {
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative group flex gap-1 items-start rounded-lg transition-colors px-1 py-1 ${
        isActive
          ? "bg-accent/30 ring-1 ring-border"
          : hovered
            ? "bg-muted/40"
            : ""
      }`}
    >
      {/* Left: move controls */}
      <div
        className={`flex flex-col items-center gap-0 pt-1 shrink-0 transition-opacity ${
          hovered || isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onMoveUp}
                disabled={isFirst}
                className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ArrowUp className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Move up</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="cursor-grab p-0.5 rounded hover:bg-muted text-muted-foreground/40">
                <GripVertical className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Drag to reorder</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onMoveDown}
                disabled={isLast}
                className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ArrowDown className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Move down</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 py-0.5">
        {children}
        {wrapperAllBlocks && onBlockChange && (
          <ConditionalConfig
            allBlocks={wrapperAllBlocks}
            currentBlockId={block.id}
            value={block.conditionalRendering}
            onChange={(cr) => onBlockChange({ conditionalRendering: cr })}
            isActive={isActive}
          />
        )}
      </div>

      {/* Right: delete + add */}
      <div
        className={`flex flex-col items-center gap-0 pt-1 shrink-0 transition-opacity ${
          hovered || isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onDelete}
                className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Delete block</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onAddBelow()}
                className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Add block below</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

// ─── Main BlockCanvas component ───────────────────────────────────────────────

export interface BlockCanvasProps {
  blocks: FormBlock[];
  onChange: (blocks: FormBlock[]) => void;
}

export function BlockCanvas({ blocks, onChange }: BlockCanvasProps) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // Ref into the active paragraph's textarea — used for inline field insertion
  const activeTextareaRef = useRef<HTMLTextAreaElement>(null);

  const activateBlock = useCallback((id: string) => {
    setActiveBlockId(id);
  }, []);

  const addBlock = useCallback(
    (type: BlockType, afterId?: string | null) => {
      const newBlock = fbMakeBlock(type);
      if (!afterId) {
        onChange([...blocks, newBlock]);
      } else {
        const idx = blocks.findIndex((b) => b.id === afterId);
        const next = [...blocks];
        next.splice(idx + 1, 0, newBlock);
        onChange(next);
      }
      setTimeout(() => activateBlock(newBlock.id), 0);
    },
    [blocks, onChange, activateBlock],
  );

  const updateBlock = useCallback(
    (id: string, patch: Partial<FormBlock>) => {
      onChange(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    },
    [blocks, onChange],
  );

  const removeBlock = useCallback(
    (id: string) => {
      const idx = blocks.findIndex((b) => b.id === id);
      onChange(blocks.filter((b) => b.id !== id));
      setActiveBlockId(idx > 0 ? blocks[idx - 1].id : null);
    },
    [blocks, onChange],
  );

  const moveBlock = useCallback(
    (id: string, dir: "up" | "down") => {
      const idx = blocks.findIndex((b) => b.id === id);
      if (dir === "up" && idx === 0) return;
      if (dir === "down" && idx === blocks.length - 1) return;
      const next = [...blocks];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      onChange(next);
    },
    [blocks, onChange],
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) setActiveBlockId(null);
    },
    [],
  );

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* ── Left sidebar — blocks only ── */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-border bg-muted/20 overflow-hidden">
        <div className="px-3 py-2 border-b border-border shrink-0">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
            Blocks
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <BlockPalette
            onAdd={(type) =>
              addBlock(
                type,
                activeBlockId ?? blocks[blocks.length - 1]?.id ?? null,
              )
            }
          />
        </div>
      </aside>

      {/* ── Canvas ── */}
      <div className="flex-1 overflow-y-auto" onClick={handleCanvasClick}>
        <div className="px-6 py-8 min-h-full" onClick={handleCanvasClick}>
          {blocks.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center min-h-[60vh] border-2 border-dashed border-border/50 rounded-2xl text-muted-foreground cursor-pointer hover:border-primary/50 hover:bg-muted/10 transition-all"
              onClick={() => addBlock("paragraph", null)}
            >
              <PenLine className="h-8 w-8 mb-3 opacity-40" />
              <p className="font-medium text-sm">Click to start writing</p>
              <p className="text-xs mt-1 opacity-60">
                or pick a block type from the left panel
              </p>
            </div>
          ) : (
            <TooltipProvider delayDuration={250}>
              <div className="space-y-0.5">
                {blocks.map((block, idx) => (
                  <BlockItem
                    key={block.id}
                    block={block}
                    isActive={activeBlockId === block.id}
                    isFirst={idx === 0}
                    isLast={idx === blocks.length - 1}
                    onActivate={() => activateBlock(block.id)}
                    onDeactivate={() => setActiveBlockId(null)}
                    allBlocks={blocks}
                    onChange={(patch) => updateBlock(block.id, patch)}
                    onDelete={() => removeBlock(block.id)}
                    onMoveUp={() => moveBlock(block.id, "up")}
                    onMoveDown={() => moveBlock(block.id, "down")}
                    onAddBelow={(type) =>
                      addBlock(type ?? "paragraph", block.id)
                    }
                    textareaRef={
                      activeBlockId === block.id &&
                      TEXTUAL_TYPES.includes(block.type)
                        ? activeTextareaRef
                        : undefined
                    }
                  />
                ))}
              </div>
              {/* Add block footer */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() =>
                    addBlock("paragraph", blocks[blocks.length - 1]?.id ?? null)
                  }
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-4 py-2 rounded-full border border-transparent hover:border-border hover:bg-muted/30 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add block
                </button>
              </div>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}
