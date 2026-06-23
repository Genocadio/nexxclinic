"use client";

import React, { useEffect, useRef } from "react";
import type { InlineAnswerField } from "@/lib/formbuilder-storage";
import { INLINE_WIDTH } from "./utils";

function ReadonlyValue({ value, emptyLabel = "—" }: { value: string; emptyLabel?: string }) {
  return <span className="inline-block min-h-7 px-2 py-1 text-sm rounded border border-dashed border-border bg-muted/30">{value || emptyLabel}</span>;
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
        <img src={value} alt="Signature" className="max-w-full h-20 object-contain border-b-2 border-dashed border-slate-400 dark:border-slate-600 rounded bg-slate-50/40 dark:bg-slate-800/20" />
      </div>
    ) : (
      <div className="h-20 rounded border-b-2 border-dashed border-slate-400 dark:border-slate-600 bg-slate-50/40 dark:bg-slate-800/20 flex items-center justify-center text-xs text-muted-foreground">
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
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        className={`w-full border-b-2 border-dashed rounded cursor-crosshair touch-none ${
          isError
            ? "border-red-400 bg-red-50/30 dark:bg-red-950/20"
            : "border-slate-400 dark:border-slate-600 bg-slate-50/40 dark:bg-slate-800/20"
        }`}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground/50">Sign above</span>
        {value && (
          <button
            type="button"
            onClick={clear}
            className="text-[10px] text-muted-foreground hover:text-destructive"
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
    ? "border-red-400 ring-1 ring-red-400/50 bg-red-50/30 dark:bg-red-950/20"
    : "border-teal-300 dark:border-teal-600 bg-teal-50/50 dark:bg-teal-900/20";
  const base = `${w} h-7 px-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-teal-400 ${errorClass}`;

  if (!edit) {
    return <ReadonlyValue value={value} emptyLabel={field.placeholder || "—"} />;
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
        className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none mt-1 ${errorClass}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <span className="inline-block min-w-32 px-2 py-1 text-sm rounded border border-dashed border-border bg-muted/30 whitespace-pre-wrap">
        {value || field.placeholder || "—"}
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
