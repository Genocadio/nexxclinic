"use client"

import React, { useState } from "react"
import { Check, Sparkles, User, HeartPulse, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFontSize } from "@/lib/font-size-context"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import type { FontSizePreference } from "@/lib/api-types"

interface SizeOption {
  id: FontSizePreference
  name: string
  tag?: string
  description: string
  styles: {
    cardPadding: string
    nameSize: string
    metaSize: string
    avatarBox: string
    avatarIcon: number
    badgeSize: string
    badgePad: string
    vitalsSize: string
    vitalsPad: string
    vitalsIcon: number
    priceSize: string
    btnSize: string
    btnPad: string
    btnIcon: number
  }
}

const SIZE_OPTIONS: SizeOption[] = [
  {
    id: "sm",
    name: "Compact",
    description: "Dense view fitting maximum content on screen",
    styles: {
      cardPadding: "8px",
      nameSize: "12px",
      metaSize: "10px",
      avatarBox: "20px",
      avatarIcon: 11,
      badgeSize: "9.5px",
      badgePad: "1px 5px",
      vitalsSize: "10.5px",
      vitalsPad: "2px 5px",
      vitalsIcon: 11,
      priceSize: "11px",
      btnSize: "11px",
      btnPad: "4px 8px",
      btnIcon: 11,
    },
  },
  {
    id: "md",
    name: "Standard",
    tag: "Default",
    description: "Balanced layout for daily clinic operations",
    styles: {
      cardPadding: "10px",
      nameSize: "13.5px",
      metaSize: "11px",
      avatarBox: "24px",
      avatarIcon: 13,
      badgeSize: "10.5px",
      badgePad: "2px 7px",
      vitalsSize: "11.5px",
      vitalsPad: "3px 7px",
      vitalsIcon: 13,
      priceSize: "12.5px",
      btnSize: "12px",
      btnPad: "5px 10px",
      btnIcon: 12,
    },
  },
  {
    id: "lg",
    name: "Comfortable",
    description: "Spacious text with relaxed readability",
    styles: {
      cardPadding: "11px",
      nameSize: "15px",
      metaSize: "12px",
      avatarBox: "26px",
      avatarIcon: 14,
      badgeSize: "11.5px",
      badgePad: "2.5px 8px",
      vitalsSize: "12.5px",
      vitalsPad: "4px 8px",
      vitalsIcon: 14,
      priceSize: "13.5px",
      btnSize: "13px",
      btnPad: "6px 11px",
      btnIcon: 13,
    },
  },
  {
    id: "xl",
    name: "Large",
    tag: "High Visibility",
    description: "High clarity with maximum component visibility",
    styles: {
      cardPadding: "12px",
      nameSize: "16.5px",
      metaSize: "13px",
      avatarBox: "28px",
      avatarIcon: 15,
      badgeSize: "12.5px",
      badgePad: "3px 9px",
      vitalsSize: "13.5px",
      vitalsPad: "5px 9px",
      vitalsIcon: 15,
      priceSize: "14.5px",
      btnSize: "14px",
      btnPad: "7px 12px",
      btnIcon: 14,
    },
  },
]

interface FontSizePickerProps {
  onApplied?: () => void
  showApplyButton?: boolean
  className?: string
}

export function FontSizePicker({
  onApplied,
  showApplyButton = true,
  className,
}: FontSizePickerProps) {
  const { fontSize, previewSize, setPreview, applyFontSize, resetPreview, isLoading } =
    useFontSize()

  const [selectedSize, setSelectedSize] = useState<FontSizePreference>(previewSize || fontSize)

  const handleSelect = (size: FontSizePreference) => {
    setSelectedSize(size)
    // Instantly reflect in real-time global UI
    setPreview(size)
  }

  const handleApply = async () => {
    const success = await applyFontSize(selectedSize)
    if (success) {
      const opt = SIZE_OPTIONS.find((s) => s.id === selectedSize)
      toast.success(`Display size set to ${opt?.name || selectedSize}`)
      if (onApplied) {
        onApplied()
      }
    } else {
      toast.error("Failed to save font size setting. Please try again.")
    }
  }

  const handleReset = () => {
    setSelectedSize(fontSize)
    resetPreview()
  }

  const hasUnsavedChanges = selectedSize !== fontSize

  return (
    <div className={cn("space-y-[16px]", className)}>
      {/* 4 Cards Grid with Responsive Flow & Fixed Pixel Stability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
        {SIZE_OPTIONS.map((opt) => {
          const isSelected = selectedSize === opt.id
          const isCurrentActive = fontSize === opt.id
          const s = opt.styles

          return (
            <div
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={cn(
                "relative group flex flex-col justify-between p-[14px] rounded-[18px] border-2 transition-all duration-150 cursor-pointer select-none text-left min-w-0 overflow-hidden",
                isSelected
                  ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md ring-2 ring-primary/20"
                  : "border-border/60 hover:border-border-strong hover:bg-muted/30 bg-card/60 dark:bg-slate-900/40"
              )}
            >
              {/* Header: Option Name + Tag + Check Indicator */}
              <div className="flex items-start justify-between gap-[6px] mb-[8px]">
                <div className="min-w-0">
                  <div className="flex items-center gap-[6px] flex-wrap">
                    <span className="font-semibold text-foreground text-[14px] leading-tight">
                      {opt.name}
                    </span>
                    {opt.tag && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-[6px] py-[1px] rounded-[4px] bg-primary/15 text-primary shrink-0">
                        {opt.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-[2px] leading-[15px] line-clamp-2">
                    {opt.description}
                  </p>
                </div>

                <div
                  className={cn(
                    "w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors mt-[2px]",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40 bg-transparent"
                  )}
                >
                  {isSelected && <Check className="w-[10px] h-[10px] stroke-[3]" />}
                </div>
              </div>

              {/* Component Preview Simulation Box — Fixed to that specific option's actual scale */}
              <div
                style={{ padding: s.cardPadding }}
                className="mt-[8px] rounded-[12px] bg-background/95 dark:bg-slate-950/70 border border-border/60 space-y-[8px] overflow-hidden"
              >
                <div className="flex items-center gap-[4px] text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <Sparkles className="w-[12px] h-[12px] text-primary shrink-0" />
                  <span>Preview</span>
                </div>

                {/* Patient Badge */}
                <div className="flex items-center justify-between gap-[6px] py-[4px] px-[6px] rounded-[8px] bg-card border border-border/40 min-w-0">
                  <div className="flex items-center gap-[6px] min-w-0">
                    <div
                      style={{ width: s.avatarBox, height: s.avatarBox }}
                      className="rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0"
                    >
                      <User style={{ width: s.avatarIcon, height: s.avatarIcon }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        style={{ fontSize: s.nameSize }}
                        className="font-semibold text-foreground truncate leading-tight"
                      >
                        Jean Bizimana
                      </p>
                      <p
                        style={{ fontSize: s.metaSize }}
                        className="text-muted-foreground truncate leading-tight mt-[2px]"
                      >
                        #4829 • General
                      </p>
                    </div>
                  </div>

                  <span
                    style={{ fontSize: s.badgeSize, padding: s.badgePad }}
                    className="rounded-full font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 whitespace-nowrap"
                  >
                    Paid
                  </span>
                </div>

                {/* Vitals Pill & Price */}
                <div className="flex items-center justify-between gap-[6px] min-w-0">
                  <div
                    style={{ fontSize: s.vitalsSize, padding: s.vitalsPad }}
                    className="flex items-center gap-[4px] rounded-[6px] bg-muted/60 text-foreground font-medium shrink-0 whitespace-nowrap"
                  >
                    <HeartPulse
                      style={{ width: s.vitalsIcon, height: s.vitalsIcon }}
                      className="text-rose-500 shrink-0"
                    />
                    <span>BP 120/80</span>
                  </div>

                  <span
                    style={{ fontSize: s.priceSize }}
                    className="font-mono font-bold text-foreground shrink-0 whitespace-nowrap"
                  >
                    15,000 RWF
                  </span>
                </div>

                {/* Action button preview */}
                <div>
                  <div
                    style={{ fontSize: s.btnSize, padding: s.btnPad }}
                    className="w-full rounded-[8px] bg-primary text-primary-foreground flex items-center justify-center gap-[4px] font-medium shadow-sm leading-tight cursor-default"
                  >
                    <Plus style={{ width: s.btnIcon, height: s.btnIcon }} className="shrink-0" />
                    <span className="truncate">Add Service</span>
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-[10px] flex items-center justify-between text-[11px] min-w-0">
                {isCurrentActive ? (
                  <span className="font-medium text-emerald-600 dark:text-emerald-400 truncate">
                    ● Currently active
                  </span>
                ) : (
                  <span className="text-muted-foreground truncate">
                    Click to live-preview
                  </span>
                )}
                {isSelected && (
                  <span className="font-bold text-primary shrink-0 ml-[4px]">
                    Selected
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Apply / Reset Actions */}
      {showApplyButton && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] pt-[6px]">
          <p className="text-[12px] text-muted-foreground">
            {hasUnsavedChanges
              ? "Previewing live changes across the screen. Click \"Apply Size\" to save."
              : "Interface size is up to date."}
          </p>

          <div className="flex items-center gap-[10px] self-end sm:self-auto">
            {hasUnsavedChanges && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isLoading}
                className="rounded-full text-[12px] h-[34px] px-[16px]"
              >
                Reset Preview
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              disabled={isLoading || (!hasUnsavedChanges && Boolean(fontSize))}
              className="rounded-full px-[20px] text-[12px] h-[34px] font-medium shadow-sm"
            >
              {isLoading ? "Saving..." : "Apply Size"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
