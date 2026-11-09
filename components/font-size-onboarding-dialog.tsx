"use client"

import React from "react"
import { useAuth } from "@/lib/auth-context"
import { useFontSize } from "@/lib/font-size-context"
import { useTheme, type ThemePreference } from "@/lib/theme-context"
import { FontSizePicker } from "@/components/font-size-picker"
import { Button } from "@/components/ui/button"
import { Type, Sparkles, Sun, Moon, Monitor, Palette } from "lucide-react"
import { toast } from "react-toastify"

export function FontSizeOnboardingDialog() {
  const { doctor, isAuthenticated } = useAuth()
  const { hasPersistedSetting, previewSize, applyDisplaySettings, isLoading } = useFontSize()
  const { preference, setThemePreference } = useTheme()

  // Only show if user is authenticated and hasn't persisted their font size preference yet
  const shouldShow = isAuthenticated && doctor && !hasPersistedSetting

  if (!shouldShow) {
    return null
  }

  const handleApplyAndContinue = async () => {
    const success = await applyDisplaySettings({
      fontSize: previewSize,
      theme: preference,
    })
    if (success) {
      toast.success("Display & theme preferences saved!")
    } else {
      toast.error("Could not save preferences. Please try again.")
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="font-size-onboarding-title"
      // Backdrop: NO blur so user sees the real UI behind update live!
      className="fixed inset-0 z-50 flex items-center justify-center p-[16px] sm:p-[24px] bg-black/45 select-none overflow-y-auto animate-in fade-in duration-150"
    >
      {/* 
        Fixed Pixel Container:
        Using literal pixel values ensures this popup NEVER shrinks or expands
        when the background UI font size changes!
      */}
      <div className="relative w-full max-w-[920px] my-auto bg-card border-2 border-border shadow-2xl rounded-[24px] p-[22px] sm:p-[28px] space-y-[18px] overflow-hidden max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="space-y-[6px] text-center max-w-[560px] mx-auto shrink-0">
          <div className="inline-flex items-center justify-center gap-[6px] px-[10px] py-[3px] rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
            <Sparkles className="w-[12px] h-[12px]" />
            <span>Welcome Setup</span>
          </div>

          <h2
            id="font-size-onboarding-title"
            className="text-[20px] sm:text-[23px] font-bold tracking-tight text-foreground flex items-center justify-center gap-[8px]"
          >
            <Type className="w-[22px] h-[22px] text-primary shrink-0" />
            <span>Personalize Your Display & Theme</span>
          </h2>

          <p className="text-[12px] sm:text-[13px] text-muted-foreground leading-[18px]">
            Choose your preferred theme and interface sizing. The screen behind this window
            updates live as you test different options.
          </p>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto space-y-[18px] pr-[4px]">
          {/* Section 1: Color Theme Selector */}
          <div className="p-[14px] rounded-[16px] bg-muted/30 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-[12px]">
            <div className="flex items-center gap-[8px]">
              <div className="w-[28px] h-[28px] rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Palette className="w-[15px] h-[15px]" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground leading-tight">
                  Color Theme
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-[2px]">
                  Switch between light and dark modes
                </p>
              </div>
            </div>

            {/* Theme segmented buttons */}
            <div className="flex items-center p-[3px] bg-muted/60 dark:bg-muted/40 rounded-[12px] border border-border/40 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setThemePreference("light")}
                className={`flex items-center gap-[6px] py-[5px] px-[12px] rounded-[9px] text-[12px] font-medium transition-all duration-150 cursor-pointer ${
                  preference === "light"
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Light Theme"
              >
                <Sun className="w-[14px] h-[14px] text-amber-500" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => setThemePreference("system")}
                className={`flex items-center gap-[6px] py-[5px] px-[12px] rounded-[9px] text-[12px] font-medium transition-all duration-150 cursor-pointer ${
                  preference === "system"
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="System Theme"
              >
                <Monitor className="w-[14px] h-[14px]" />
                <span>System</span>
              </button>

              <button
                type="button"
                onClick={() => setThemePreference("dark")}
                className={`flex items-center gap-[6px] py-[5px] px-[12px] rounded-[9px] text-[12px] font-medium transition-all duration-150 cursor-pointer ${
                  preference === "dark"
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Dark Theme"
              >
                <Moon className="w-[14px] h-[14px] text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Section 2: 4 Font Size Cards */}
          <div>
            <div className="mb-[8px] flex items-center justify-between">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                Interface Font Size
              </p>
              <span className="text-[11px] text-muted-foreground">
                Click any card to preview live
              </span>
            </div>

            <FontSizePicker showApplyButton={false} />
          </div>
        </div>

        {/* Footer: Non-dismissible Apply & Continue Button */}
        <div className="pt-[14px] border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-[12px] shrink-0">
          <p className="text-[11.5px] text-muted-foreground text-center sm:text-left">
            You can modify both theme and display sizes anytime from your User Profile.
          </p>

          <Button
            type="button"
            size="default"
            onClick={handleApplyAndContinue}
            disabled={isLoading}
            className="w-full sm:w-auto h-[38px] px-[26px] rounded-full font-semibold shadow-md text-[13px]"
          >
            {isLoading ? "Saving Preferences..." : "Apply & Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}
