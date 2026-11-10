"use client"

import React, { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useFontSize } from "@/lib/font-size-context"
import { useTheme } from "@/lib/theme-context"
import { FontSizePicker } from "@/components/font-size-picker"
import { ThemePicker } from "@/components/theme-picker"
import { Button } from "@/components/ui/button"
import { Type, Sparkles, Palette, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { toast } from "react-toastify"

export function FontSizeOnboardingDialog() {
  const { doctor, isAuthenticated } = useAuth()
  const { hasPersistedSetting, previewSize, applyDisplaySettings, isLoading } = useFontSize()
  const { preference } = useTheme()
  const [step, setStep] = useState<1 | 2>(1)

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
            {step === 1 ? (
              <Type className="w-[22px] h-[22px] text-primary shrink-0" />
            ) : (
              <Palette className="w-[22px] h-[22px] text-primary shrink-0" />
            )}
            <span>{step === 1 ? "Choose Your Text Size" : "Choose Your Theme"}</span>
          </h2>

          <p className="text-[12px] sm:text-[13px] text-muted-foreground leading-[18px]">
            {step === 1
              ? "Pick the interface size that is most comfortable to read. The screen behind this window updates live."
              : "Pick how the app looks. Each card previews the theme, and the screen behind this window updates live."}
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-[8px] pt-[4px]" aria-label={`Step ${step} of 2`}>
            {[1, 2].map((n) => (
              <div key={n} className="flex items-center gap-[8px]">
                <div
                  className={`w-[22px] h-[22px] rounded-full text-[11px] font-bold flex items-center justify-center ${
                    n < step
                      ? "bg-primary text-primary-foreground"
                      : n === step
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {n < step ? <Check className="w-[12px] h-[12px] stroke-[3]" /> : n}
                </div>
                <span className={`text-[11.5px] ${n === step ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                  {n === 1 ? "Font size" : "Theme"}
                </span>
                {n === 1 && <div className="w-[28px] h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto pr-[4px]">
          {step === 1 ? <FontSizePicker showApplyButton={false} /> : <ThemePicker />}
        </div>

        {/* Footer: Step navigation (non-dismissible) */}
        <div className="pt-[14px] border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-[12px] shrink-0">
          <p className="text-[11.5px] text-muted-foreground text-center sm:text-left">
            You can change both anytime from My Account.
          </p>

          <div className="flex items-center gap-[10px] w-full sm:w-auto">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="h-[38px] px-[18px] rounded-full text-[13px] gap-[6px]"
              >
                <ArrowLeft className="w-[14px] h-[14px]" />
                Back
              </Button>
            )}
            {step === 1 ? (
              <Button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 sm:flex-none h-[38px] px-[26px] rounded-full font-semibold shadow-md text-[13px] gap-[6px]"
              >
                Next: Theme
                <ArrowRight className="w-[14px] h-[14px]" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleApplyAndContinue}
                disabled={isLoading}
                className="flex-1 sm:flex-none h-[38px] px-[26px] rounded-full font-semibold shadow-md text-[13px]"
              >
                {isLoading ? "Saving Preferences..." : "Save & Continue"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
