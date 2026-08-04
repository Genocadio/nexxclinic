"use client";

import React from "react";
import {
  ArrowUp,
  ArrowDown,
  GripVertical,
  Trash2,
  Plus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FormBlock, BlockType } from "@/lib/formbuilder-storage";
import { ConditionalConfig } from "@/components/formbuilder/conditional-config";

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

export function BlockWrapper({
  block,
  isActive,
  isFirst,
  isLast,
  hovered,
  setHovered,
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

export function FormatButton({
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
