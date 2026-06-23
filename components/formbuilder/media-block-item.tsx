"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FormBlock } from "@/lib/formbuilder-storage";
import { MediaUploader } from "@/components/ui/media-uploader";
import { MediaPickerModal } from "@/components/ui/media-picker-modal";
import { Input } from "@/components/ui/input";
import {
  ImagePlus,
  FolderSearch,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Upload,
  FileUp,
  X,
} from "lucide-react";
import type { UploadResult } from "@/lib/storage-service";

// ─── Shared primitives ────────────────────────────────────────────────────────

function CfgSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 pt-3 border-t border-border/50 space-y-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function CfgRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}

// ─── Width helpers ────────────────────────────────────────────────────────────

const WIDTH_CLASSES: Record<NonNullable<FormBlock["mediaWidth"]>, string> = {
  sm: "max-w-xs",
  md: "max-w-sm",
  lg: "max-w-lg",
  full: "w-full",
};

const ALIGN_WRAPPER: Record<NonNullable<FormBlock["align"]>, string> = {
  left: "flex justify-start",
  center: "flex justify-center",
  right: "flex justify-end",
};

// ─── Upload mode hints ────────────────────────────────────────────────────────

const MODE_LABELS: Record<NonNullable<FormBlock["uploadMode"]>, string> = {
  images: "Images only",
  images_videos: "Images & Videos",
  documents: "Documents",
  all: "All file types",
};

const MODE_HINTS: Record<NonNullable<FormBlock["uploadMode"]>, string> = {
  images: "JPG, PNG, GIF, WebP…",
  images_videos: "JPG, PNG, MP4, MOV…",
  documents: "PDF, DOC, XLSX, CSV…",
  all: "Any file type",
};

// ─── MediaEmbedBlockItem ──────────────────────────────────────────────────────

interface MediaEmbedBlockItemProps {
  block: FormBlock;
  isActive: boolean;
  onChange: (patch: Partial<FormBlock>) => void;
}

export function MediaEmbedBlockItem({
  block,
  isActive,
  onChange,
}: MediaEmbedBlockItemProps) {
  const [showUploader, setShowUploader] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const align = block.align ?? "center";
  const width = block.mediaWidth ?? "md";
  const storagePath = `forms/${block.id}/insert`;

  function handleUploaded(files: UploadResult[]) {
    const first = files[0];
    if (first) {
      onChange({ mediaUrl: first.url, mediaPath: first.path });
      setShowUploader(false);
    }
  }

  return (
    <div className="w-full">
      {/* ── Image / placeholder ── */}
      <div className={cn(ALIGN_WRAPPER[align])}>
        {block.mediaUrl ? (
          <div className={cn(WIDTH_CLASSES[width])}>
            <img
              src={block.mediaUrl}
              alt={block.mediaCaption ?? "Embedded image"}
              className="w-full rounded-md object-contain"
            />
            {block.mediaCaption && (
              <p className="mt-1 text-center text-xs text-muted-foreground italic">
                {block.mediaCaption}
              </p>
            )}
          </div>
        ) : (
          <div className="flex w-full max-w-sm flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-10 text-muted-foreground/60">
            <ImagePlus className="size-8" />
            <p className="text-xs">Click to add image</p>
          </div>
        )}
      </div>

      {/* ── Config panel (active only) ── */}
      {isActive && (
        <div className="mt-3 rounded-lg border border-border/60 bg-muted/30 px-3 pb-3">
          {/* Upload */}
          <CfgSection title="Image">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowUploader((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors",
                  showUploader
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background hover:bg-muted/60",
                )}
              >
                <Upload className="size-3.5" />
                Upload
              </button>
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs transition-colors hover:bg-muted/60"
              >
                <FolderSearch className="size-3.5" />
                Browse existing
              </button>
              {block.mediaUrl && (
                <button
                  type="button"
                  onClick={() => onChange({ mediaUrl: "", mediaPath: "" })}
                  className="ml-auto flex items-center gap-1.5 rounded-md border border-destructive/40 px-2.5 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/5"
                >
                  <X className="size-3.5" />
                  Remove
                </button>
              )}
            </div>

            {showUploader && (
              <div className="mt-2">
                <MediaUploader
                  bucket="form"
                  storagePath={storagePath}
                  accept="image/*"
                  multiple={false}
                  onUploaded={handleUploaded}
                  currentUrl={block.mediaUrl || undefined}
                />
              </div>
            )}
          </CfgSection>

          {/* Alignment */}
          <CfgSection title="Alignment">
            <div className="flex gap-1">
              {(["left", "center", "right"] as const).map((a) => {
                const Icon = a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => onChange({ align: a })}
                    className={cn(
                      "flex size-7 items-center justify-center rounded-md border text-xs transition-colors",
                      align === a
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted/60",
                    )}
                    title={a.charAt(0).toUpperCase() + a.slice(1)}
                  >
                    <Icon className="size-3.5" />
                  </button>
                );
              })}
            </div>
          </CfgSection>

          {/* Width */}
          <CfgSection title="Width">
            <div className="flex gap-1">
              {(["sm", "md", "lg", "full"] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onChange({ mediaWidth: w })}
                  className={cn(
                    "flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors",
                    width === w
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted/60",
                  )}
                >
                  {w === "full" && <Maximize2 className="size-3" />}
                  {w.toUpperCase()}
                </button>
              ))}
            </div>
          </CfgSection>

          {/* Caption */}
          <CfgSection title="Caption (optional)">
            <Input
              value={block.mediaCaption ?? ""}
              onChange={(e) => onChange({ mediaCaption: e.target.value })}
              placeholder="Add a caption…"
              className="h-7 text-xs"
            />
          </CfgSection>
        </div>
      )}

      {/* Picker modal */}
      <MediaPickerModal
        open={showPicker}
        onClose={() => setShowPicker(false)}
        bucket="form"
        folder={storagePath}
        accept="images"
        title="Pick an image"
        onPick={(file) => onChange({ mediaUrl: file.url, mediaPath: file.path })}
      />
    </div>
  );
}

// ─── FileUploadBlockItem ──────────────────────────────────────────────────────

interface FileUploadBlockItemProps {
  block: FormBlock;
  isActive: boolean;
  onChange: (patch: Partial<FormBlock>) => void;
}

export function FileUploadBlockItem({
  block,
  isActive,
  onChange,
}: FileUploadBlockItemProps) {
  const mode = block.uploadMode ?? "images";
  const label = block.label || "Upload Files";

  return (
    <div className="w-full">
      {/* ── Upload zone preview ── */}
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 px-6 py-8 text-center">
        <FileUp className="size-8 text-muted-foreground/60" />
        <p className="text-sm font-medium">
          {label}
          {block.required && (
            <span className="ml-1 text-xs text-destructive">(required)</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">{MODE_HINTS[mode]}</p>
        {block.uploadMultiple && (
          <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-muted-foreground">
            Multiple files
          </span>
        )}
      </div>

      {/* ── Config panel (active only) ── */}
      {isActive && (
        <div className="mt-3 rounded-lg border border-border/60 bg-muted/30 px-3 pb-3">
          {/* Label */}
          <CfgSection title="Label">
            <Input
              value={block.label ?? ""}
              onChange={(e) => onChange({ label: e.target.value })}
              placeholder="Upload Files"
              className="h-7 text-xs"
            />
          </CfgSection>

          {/* Upload mode */}
          <CfgSection title="Accepted file types">
            <div className="flex flex-col gap-1.5">
              {(["images", "images_videos", "documents", "all"] as const).map((m) => (
                <label key={m} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name={`upload-mode-${block.id}`}
                    checked={mode === m}
                    onChange={() => onChange({ uploadMode: m })}
                    className="accent-primary"
                  />
                  <span className="text-xs">{MODE_LABELS[m]}</span>
                </label>
              ))}
            </div>
          </CfgSection>

          {/* Multiple files */}
          <CfgSection title="File count">
            <CfgRow label="">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={block.uploadMultiple ?? false}
                  onChange={(e) =>
                    onChange({ uploadMultiple: e.target.checked })
                  }
                  className="accent-primary"
                />
                <span className="text-xs">Allow multiple files</span>
              </label>
            </CfgRow>
            {block.uploadMultiple && (
              <CfgRow label="Max files">
                <Input
                  type="number"
                  min={2}
                  value={block.uploadMaxFiles ?? ""}
                  onChange={(e) =>
                    onChange({
                      uploadMaxFiles: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="No limit"
                  className="h-7 w-28 text-xs"
                />
              </CfgRow>
            )}
          </CfgSection>

          {/* Required */}
          <CfgSection title="Validation">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={block.required ?? false}
                onChange={(e) => onChange({ required: e.target.checked })}
                className="accent-primary"
              />
              <span className="text-xs">Required field</span>
            </label>
          </CfgSection>
        </div>
      )}
    </div>
  );
}
