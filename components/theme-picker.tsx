"use client"

import React from "react"
import { Check, Sun, Moon, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme, type ThemePreference } from "@/lib/theme-context"

interface ThemeOption {
  id: ThemePreference
  name: string
  tag?: string
  description: string
  bestFor: string
  icon: React.ComponentType<{ className?: string }>
  iconClass: string
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "light",
    name: "Light",
    description: "Bright background with dark text. Crisp and familiar.",
    bestFor: "Well-lit rooms, reception and daytime shifts",
    icon: Sun,
    iconClass: "text-amber-500",
  },
  {
    id: "dark",
    name: "Dark",
    description: "Dim background with light text. Reduces glare and eye strain.",
    bestFor: "Low-light wards, night shifts, long sessions",
    icon: Moon,
    iconClass: "text-indigo-400",
  },
  {
    id: "system",
    name: "System",
    tag: "Auto",
    description: "Follows your device setting and switches automatically.",
    bestFor: "Devices that change between day and night mode",
    icon: Monitor,
    iconClass: "text-muted-foreground",
  },
]

// Fixed palettes so each preview always shows its own theme, whatever the current one is.
const PALETTES = {
  light: {
    bg: "#f8fafc",
    panel: "#ffffff",
    border: "#e2e8f0",
    text: "#0f172a",
    muted: "#94a3b8",
    primary: "#2563eb",
    success: "#10b981",
  },
  dark: {
    bg: "#0b1220",
    panel: "#111a2e",
    border: "#1e293b",
    text: "#f1f5f9",
    muted: "#64748b",
    primary: "#3b82f6",
    success: "#34d399",
  },
} as const

function MiniApp({ palette }: { palette: keyof typeof PALETTES }) {
  const c = PALETTES[palette]
  return (
    <div
      style={{ background: c.bg, borderColor: c.border }}
      className="h-full w-full border rounded-[8px] p-[6px] flex flex-col gap-[5px] overflow-hidden"
    >
      <div className="flex items-center gap-[4px]">
        <div style={{ background: c.primary }} className="w-[8px] h-[8px] rounded-full" />
        <div style={{ background: c.muted }} className="h-[3px] w-[28px] rounded-full opacity-70" />
      </div>
      <div
        style={{ background: c.panel, borderColor: c.border }}
        className="border rounded-[6px] p-[5px] flex flex-col gap-[4px]"
      >
        <div className="flex items-center justify-between gap-[4px]">
          <div style={{ background: c.text }} className="h-[4px] w-[34px] rounded-full" />
          <div style={{ background: c.success }} className="h-[5px] w-[14px] rounded-full opacity-80" />
        </div>
        <div style={{ background: c.muted }} className="h-[3px] w-[52px] rounded-full opacity-60" />
        <div style={{ background: c.primary }} className="h-[8px] w-full rounded-[3px] mt-[2px]" />
      </div>
    </div>
  )
}

function ThemePreview({ id }: { id: ThemePreference }) {
  if (id === "system") {
    return (
      <div className="relative h-full w-full">
        <div className="absolute inset-0">
          <MiniApp palette="light" />
        </div>
        <div className="absolute inset-0" style={{ clipPath: "polygon(55% 0, 100% 0, 100% 100%, 35% 100%)" }}>
          <MiniApp palette="dark" />
        </div>
      </div>
    )
  }
  return <MiniApp palette={id} />
}

interface ThemePickerProps {
  className?: string
}

export function ThemePicker({ className }: ThemePickerProps) {
  const { preference, setThemePreference } = useTheme()

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-[14px]", className)} role="radiogroup" aria-label="Color theme">
      {THEME_OPTIONS.map((opt) => {
        const selected = preference === opt.id
        const Icon = opt.icon
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setThemePreference(opt.id)}
            className={cn(
              "relative flex flex-col gap-[10px] p-[12px] rounded-[18px] border-2 text-left transition-all duration-150 cursor-pointer select-none min-w-0",
              selected
                ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md ring-2 ring-primary/20"
                : "border-border/60 hover:border-border-strong hover:bg-muted/30 bg-card/60 dark:bg-slate-900/40"
            )}
          >
            <div className="h-[92px] rounded-[10px] overflow-hidden">
              <ThemePreview id={opt.id} />
            </div>

            <div className="flex items-start justify-between gap-[6px]">
              <div className="min-w-0">
                <div className="flex items-center gap-[6px] flex-wrap">
                  <Icon className={cn("w-[14px] h-[14px] shrink-0", opt.iconClass)} />
                  <span className="font-semibold text-foreground text-[14px] leading-tight">{opt.name}</span>
                  {opt.tag && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-[6px] py-[1px] rounded-[4px] bg-primary/15 text-primary shrink-0">
                      {opt.tag}
                    </span>
                  )}
                </div>
                <p className="text-[11.5px] text-muted-foreground mt-[4px] leading-[16px]">{opt.description}</p>
                <p className="text-[11px] text-foreground/80 mt-[4px] leading-[15px]">
                  <span className="font-semibold">Best for:</span> {opt.bestFor}
                </p>
              </div>
              <div
                className={cn(
                  "w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors mt-[2px]",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/40 bg-transparent"
                )}
              >
                {selected && <Check className="w-[10px] h-[10px] stroke-[3]" />}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
