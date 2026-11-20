"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface ReportsSectionDockItem {
  id: string
  label: string
  icon: LucideIcon
  count?: number
}

interface ReportsSectionDockProps {
  items: ReportsSectionDockItem[]
  activeId: string
  onSelect: (id: string) => void
}

export function ReportsSectionDock({
  items,
  activeId,
  onSelect,
}: ReportsSectionDockProps) {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)
  const activeIndex = items.findIndex((item) => item.id === activeId)

  return (
    <div className="w-full flex items-center justify-center px-12 sm:px-14 md:px-16 max-w-full">
      <div
        onMouseLeave={() => setHoveredItemId(null)}
        className="inline-flex items-center gap-0.5 sm:gap-1 bg-card/85 backdrop-blur-xl border border-border/70 p-1 rounded-2xl shadow-xs flex-nowrap shrink-0"
      >
        {items.map((item, index) => {
          const isActive = activeId === item.id
          const distance = Math.abs(index - activeIndex)
          const isHovered = hoveredItemId === item.id
          const anyHovered = hoveredItemId !== null
          const isOnlyItem = items.length === 1
          const Icon = item.icon
          const isExpanded = isOnlyItem || (anyHovered ? isHovered : distance === 1 || distance === 2)

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              onMouseEnter={() => {
                if (!window.matchMedia("(min-width: 1024px)").matches) {
                  setHoveredItemId(item.id)
                }
              }}
              title={item.label}
              aria-label={item.label}
              aria-pressed={isActive}
              className={cn(
                "group relative inline-flex items-center gap-1 sm:gap-1.5 rounded-xl h-8 sm:h-8.5 text-xs font-medium transition-all duration-300 ease-out shrink-0 cursor-pointer select-none",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
                isExpanded ? "px-2 sm:px-2.5" : "px-1.5 sm:px-2",
                "lg:px-2.5"
              )}
            >
              <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
              <span
                className={cn(
                  "transition-all duration-300 ease-out overflow-hidden whitespace-nowrap",
                  anyHovered
                    ? isHovered
                      ? "max-w-[110px] opacity-100 font-semibold"
                      : "max-w-0 opacity-0"
                    : isOnlyItem
                      ? "max-w-[105px] opacity-100"
                      : isActive
                      ? "max-w-0 opacity-0"
                      : distance === 1
                        ? "max-w-[65px] sm:max-w-[90px] opacity-100"
                        : distance === 2
                          ? "max-w-0 sm:max-w-[90px] opacity-0 sm:opacity-100"
                          : "max-w-0 opacity-0",
                  "lg:max-w-[105px] lg:opacity-100 lg:font-medium"
                )}
              >
                {item.label}
              </span>
              {item.count !== undefined && (
                <Badge
                  variant={isActive ? "secondary" : "outline"}
                  className={cn(
                    "py-0 px-1 text-[10px] shrink-0 font-mono transition-colors",
                    anyHovered
                      ? isHovered
                        ? "inline-flex"
                        : "hidden md:inline-flex"
                      : "hidden md:inline-flex",
                    "lg:inline-flex",
                    isActive
                      ? "bg-primary-foreground/20 text-current border-transparent"
                      : "bg-muted/40 text-muted-foreground border-border/60"
                  )}
                >
                  {item.count}
                </Badge>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
