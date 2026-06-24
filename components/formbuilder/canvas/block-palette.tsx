"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { BlockType } from "@/lib/formbuilder-storage";

export const PALETTE_GROUPS: {
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
    label: "Media",
    items: [
      { type: "media_embed", label: "Insert Image", icon: "🖼" },
      { type: "file_upload", label: "File Upload", icon: "📎" },
    ],
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

export function BlockPalette({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [search, setSearch] = useState("");

  const filteredGroups = PALETTE_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-3 py-2 border-b border-border shrink-0">
        <div className="relative">
          <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blocks…"
            className="pl-7 h-7 text-[11px] bg-background/50"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[10px] text-muted-foreground">No blocks found</p>
          </div>
        ) : (
          filteredGroups.map((group) => (
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
          ))
        )}
      </div>
    </div>
  );
}
