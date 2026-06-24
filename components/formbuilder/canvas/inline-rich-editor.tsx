"use client";

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import { PenLine } from "lucide-react";
import type { InlineAnswerField } from "@/lib/formbuilder-storage";

/** Chip style applied inline so no global CSS is needed (dark-mode via CSS var fallback). */
export const CHIP_STYLE =
  "display:inline-flex;align-items:center;gap:3px;padding:0 6px;" +
  "border-radius:4px;font-size:0.82em;font-weight:600;" +
  "background:rgb(204 251 241);color:rgb(15 118 110);border:1px solid rgb(153 246 228);" +
  "margin:0 2px;white-space:nowrap;cursor:default;user-select:none;" +
  "line-height:1.5;vertical-align:baseline;";

export const INLINE_FIELD_LABELS: Record<string, string> = {
  text: "Text",
  textarea: "Long text",
  date: "Date",
  number: "Number",
  select: "Dropdown",
};

export interface InlineRichEditorHandle {
  /** Insert a chip for fieldId at the current cursor and return the serialised content. */
  insertField(fieldId: string, label: string): string | null;
  focus(): void;
}

export const InlineRichEditor = React.forwardRef<
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

export function InlineContent({
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

export function AutoTextarea({
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

export function nextAnsId(existingFields: InlineAnswerField[]): string {
  let i = 1;
  while (existingFields.some((f) => f.id === `ans${i}`)) i++;
  return `ans${i}`;
}
