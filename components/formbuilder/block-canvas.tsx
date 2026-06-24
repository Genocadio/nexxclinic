"use client";

import React, {
  useCallback,
  useRef,
  useState,
} from "react";
import { Plus, PenLine } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import type {
  BlockType,
  FormBlock,
} from "@/lib/formbuilder-storage";
import { fbMakeBlock } from "@/lib/formbuilder-storage";
import { BlockPalette } from "./canvas/block-palette";
import { BlockItem } from "./canvas/block-item";

export interface BlockCanvasProps {
  blocks: FormBlock[];
  onChange: (blocks: FormBlock[]) => void;
}

const TEXTUAL_TYPES: BlockType[] = [
  "heading1",
  "heading2",
  "heading3",
  "paragraph",
];

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
        <div className="flex-1 overflow-hidden">
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
      <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20" onClick={handleCanvasClick}>
        <div className="max-w-4xl mx-auto px-6 py-12 min-h-full" onClick={handleCanvasClick}>
          {blocks.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center min-h-[60vh] border-2 border-dashed border-border/50 rounded-3xl text-muted-foreground cursor-pointer hover:border-primary/50 hover:bg-muted/10 transition-all bg-background/50 shadow-sm"
              onClick={() => addBlock("paragraph", null)}
            >
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <PenLine className="h-6 w-6 opacity-40" />
              </div>
              <p className="font-semibold text-foreground">Start building your form</p>
              <p className="text-sm mt-1 opacity-60">
                Pick a block from the left panel or click here to add a paragraph
              </p>
            </div>
          ) : (
            <TooltipProvider delayDuration={250}>
              <div className="space-y-1 bg-background p-8 rounded-[2rem] shadow-xl border border-border/40 min-h-[80vh]">
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
                
                {/* Add block footer */}
                <div className="mt-12 flex justify-center pt-8 border-t border-dashed border-border/50">
                  <button
                    onClick={() =>
                      addBlock("paragraph", blocks[blocks.length - 1]?.id ?? null)
                    }
                    className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-2 px-6 py-2.5 rounded-full border border-border bg-background hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add block
                  </button>
                </div>
              </div>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}
