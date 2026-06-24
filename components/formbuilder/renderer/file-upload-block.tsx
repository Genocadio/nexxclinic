"use client";

import React from "react";
import { MediaUploader } from "@/components/ui/media-uploader";
import type { FormBlock } from "@/lib/formbuilder-storage";
import { useAuth } from "@/lib/auth-context";

export type UploadedAnswerFile = {
  name: string;
  path: string;
  url: string;
  mimeType: string;
  size: number;
};

export function FileUploadAnswerBlock({
  block,
  value,
  onChange,
  isError,
  edit,
}: {
  block: FormBlock;
  value: UploadedAnswerFile[];
  onChange: (v: UploadedAnswerFile[]) => void;
  isError: boolean;
  edit: boolean;
}) {
  const { clinicProfile } = useAuth();
  const accept =
    block.uploadMode === "images"
      ? "image/*"
      : block.uploadMode === "images_videos"
        ? "image/*,video/*"
        : block.uploadMode === "documents"
          ? ".pdf,.doc,.docx,.txt,.xlsx,.csv,.xls"
          : "*";

  const hint =
    block.uploadMode === "images"
      ? "Images only"
      : block.uploadMode === "images_videos"
        ? "Images and videos"
        : block.uploadMode === "documents"
          ? "PDF, Word, Excel, CSV, and text files"
          : "Any file type";

  const clinicId = clinicProfile?.id || "default";
  const storagePath = `clinics/${clinicId}/answers/${block.id}`;

  const removeFile = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const isImage = (file: UploadedAnswerFile) =>
    file.mimeType.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name);

  return (
    <div
      className={`my-3 ${isError ? "rounded-md p-2 -m-2 ring-1 ring-red-400/50 bg-red-50/20 dark:bg-red-950/10" : ""}`}
    >
      <label className="text-sm font-medium block mb-1">
        {block.label || "Upload Files"}
        {block.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {edit && (
        <MediaUploader
          bucket="form_answers"
          storagePath={storagePath}
          accept={accept}
          multiple={block.uploadMultiple ?? false}
          maxFiles={block.uploadMaxFiles}
          label={block.label || "Upload Files"}
          hint={hint}
          onUploaded={(results) => {
            const files = results.map((r) => ({
              name: r.name,
              path: r.path,
              url: r.url,
              mimeType: "",
              size: 0,
            }));
            onChange([...value, ...files]);
          }}
        />
      )}

      {value.length === 0 && !edit ? (
        <p className="text-sm text-muted-foreground italic">
          No files uploaded
        </p>
      ) : value.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {value.map((file, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              {isImage(file) ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="h-10 w-10 rounded object-cover border border-border flex-shrink-0"
                />
              ) : (
                <div className="h-10 w-10 rounded border border-border bg-muted flex items-center justify-center flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>
              )}
              <span className="truncate flex-1">{file.name}</span>
              {edit && (
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {isError && (
        <p className="text-xs text-red-500 mt-1">
          At least one file is required.
        </p>
      )}
    </div>
  );
}
