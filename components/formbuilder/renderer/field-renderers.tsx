"use client";

import React, { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import type { InlineAnswerField } from "@/lib/formbuilder-storage";
import { INLINE_WIDTH } from "./utils";

function ReadonlyValue({
  value,
  emptyLabel = "—",
}: {
  value: string;
  emptyLabel?: string;
}) {
  return (
    <span className="inline-flex items-center min-h-7 px-2.5 py-0.5 text-sm rounded-md border border-slate-200 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-800/80 text-foreground font-medium shadow-xs">
      {value || emptyLabel}
    </span>
  );
}

export function SignatureCanvas({
  value,
  onChange,
  isError,
  edit,
}: {
  value: string;
  onChange: (v: string) => void;
  isError?: boolean;
  edit: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!value || !canvasRef.current || edit) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = value;
  }, [value, edit]);

  if (!edit) {
    return value ? (
      <div className="space-y-1">
        <img
          src={value}
          alt="Signature"
          className="max-w-full h-20 object-contain border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-100/80 dark:bg-slate-900/70 shadow-xs"
        />
      </div>
    ) : (
      <div className="h-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-900/70 flex items-center justify-center text-xs text-muted-foreground shadow-xs">
        No signature
      </div>
    );
  }

  const getPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    drawing.current = true;
    lastPos.current = getPos(e, canvasRef.current);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current || !canvasRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvasRef.current);
    ctx.beginPath();
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => {
    if (!drawing.current || !canvasRef.current) return;
    drawing.current = false;
    onChange(canvasRef.current.toDataURL());
  };

  const clear = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onChange("");
  };

  return (
    <div className="space-y-1">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={80}
          className={`w-full border-2 border-dashed rounded-lg cursor-crosshair touch-none transition-colors shadow-xs ${
            value
              ? "border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20"
              : isError
                ? "border-red-400 bg-red-50/50 dark:bg-red-950/30"
                : "border-slate-300 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {value && (
          <div className="absolute top-2 right-2 pointer-events-none animate-in zoom-in duration-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground/60">Sign above</span>
        {value && (
          <button
            type="button"
            onClick={clear}
            className="text-[10px] text-muted-foreground hover:text-destructive transition-colors font-medium"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export function AnswerInlineField({
  field,
  value,
  onChange,
  isError,
  edit,
}: {
  field: InlineAnswerField;
  value: string;
  onChange: (v: string) => void;
  isError?: boolean;
  edit: boolean;
}) {
  const w = INLINE_WIDTH[field.width ?? "sm"];
  const errorClass = isError
    ? "border-red-400 ring-2 ring-red-400/25 bg-red-50/70 dark:bg-red-950/40 text-foreground"
    : "border-teal-300/80 dark:border-teal-600/70 bg-teal-50/80 dark:bg-teal-950/60 hover:bg-teal-100/60 dark:hover:bg-teal-950/80 focus:bg-background dark:focus:bg-slate-950 text-foreground shadow-xs";
  const base = `${w} h-7 px-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400/30 transition-colors ${errorClass}`;

  if (!edit) {
    return <ReadonlyValue value={value} emptyLabel="—" />;
  }

  if (field.fieldType === "number") {
    return (
      <input
        type="number"
        placeholder={field.placeholder || ""}
        className={`${base} inline-block`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.fieldType === "date") {
    return (
      <input
        type="date"
        className={`${base} inline-block`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.fieldType === "select") {
    return (
      <select
        className={`${base} inline-block`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select…</option>
        {(field.options ?? []).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.fieldType === "textarea") {
    return edit ? (
      <textarea
        placeholder={field.placeholder || ""}
        rows={2}
        className={`w-full px-2.5 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400/30 resize-none mt-1 transition-colors ${errorClass}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <span className="inline-block min-w-32 px-2.5 py-1 text-sm rounded-md border border-slate-200 dark:border-slate-700/80 bg-slate-100/80 dark:bg-slate-800/80 whitespace-pre-wrap shadow-xs">
        {value || "—"}
      </span>
    );
  }

  return (
    <input
      type="text"
      placeholder={field.placeholder || ""}
      className={`${base} inline-block`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function FieldShell({
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
      {label && (
        <label className="text-sm font-medium block mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function ChoiceGroup({
  type,
  block,
  value,
  isError,
  edit,
  onChange,
}: {
  type: "checkbox" | "radio";
  block: {
    id: string;
    label?: string;
    required?: boolean;
    options?: string[];
  };
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
      {block.label && (
        <label className="text-sm font-medium block mb-1.5 text-foreground">
          {block.label}
          {block.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        className={`space-y-1.5 ${isError ? "rounded-lg p-2 -m-2 ring-2 ring-red-400/30 bg-red-50/40 dark:bg-red-950/20" : ""}`}
      >
        {(block.options ?? []).map((opt: string) => {
          const isChecked =
            type === "checkbox"
              ? Array.isArray(selected) && selected.includes(opt)
              : selected === opt;
          return (
            <label
              key={opt}
              className={`flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg border transition-all ${
                isChecked
                  ? "border-primary/50 bg-primary/5 dark:bg-primary/10 text-foreground font-medium shadow-xs"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-foreground hover:bg-slate-100/80 dark:hover:bg-slate-900"
              } ${!edit ? "cursor-default opacity-85" : "cursor-pointer"}`}
            >
              <input
                type={type}
                name={type === "radio" ? `radio_${block.id}` : undefined}
                checked={isChecked}
                onChange={() => toggle(opt)}
                className="h-4 w-4 rounded border-2 border-slate-300 dark:border-slate-600 accent-primary cursor-pointer disabled:cursor-default"
                disabled={!edit}
              />
              <span className="flex-1">{opt}</span>
            </label>
          );
        })}
      </div>
      {isError && (
        <p className="text-xs text-red-500 mt-1.5">
          {type === "checkbox"
            ? "Please select at least one option."
            : "Please select an option."}
        </p>
      )}
    </div>
  );
}
