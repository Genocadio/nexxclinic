"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/auth-context"
import { useClinicProfile, useUpsertClinicProfile } from "@/hooks/auth-hooks"
import { canManageAdminUsers } from "@/lib/role-utils"
import {
  ArrowLeft,
  Save,
  Printer,
  FileText,
  CheckCircle2,
  ExternalLink,
  Download,
  Receipt,
  Layers,
  Sparkles,
  ShieldCheck,
  Info,
  HelpCircle,
} from "lucide-react"

type PaperSizeOption = {
  key: string
  name: string
  subtitle: string
  dimensions: string
  dimensionsInches: string
  orientation: "Portrait" | "Landscape" | "Continuous Roll"
  printerType: string
  bestFor: string
  badge?: string
  scaleRatio: string
}

const PAPER_SIZES: PaperSizeOption[] = [
  {
    key: "a4p",
    name: "A4 Portrait",
    subtitle: "Standard International Medical Invoice",
    dimensions: "210 × 297 mm",
    dimensionsInches: '8.27" × 11.69"',
    orientation: "Portrait",
    printerType: "Laser / Inkjet (Standard Tray)",
    bestFor: "Full-page medical invoices, insurance claims, comprehensive billing & clinic records.",
    badge: "Recommended",
    scaleRatio: "1.02×",
  },
  {
    key: "letter",
    name: "US Letter Portrait",
    subtitle: "Standard North American Sheet",
    dimensions: "215.9 × 279.4 mm",
    dimensionsInches: '8.5" × 11.0"',
    orientation: "Portrait",
    printerType: "Laser / Inkjet (Letter Tray)",
    bestFor: "Standard North American paper sizes and clinics utilizing US Letter stock.",
    scaleRatio: "1.00× (Base Reference)",
  },
  {
    key: "a4l",
    name: "A4 Landscape (2-Up)",
    subtitle: "Half-Page Dual Column Layout",
    dimensions: "297 × 210 mm",
    dimensionsInches: '11.69" × 8.27"',
    orientation: "Landscape",
    printerType: "Laser / Inkjet (A4 Tray)",
    bestFor: "Compact half-page format (2-column layout). Fits consecutive invoices side-by-side in batch printing.",
    badge: "Compact 2-Up",
    scaleRatio: "0.82×",
  },
  {
    key: "pos",
    name: "80mm Thermal Receipt",
    subtitle: "Thermal POS Roll Paper",
    dimensions: "80 mm × Auto Height",
    dimensionsInches: '3.15" Roll Width',
    orientation: "Continuous Roll",
    printerType: "80mm Thermal Receipt Printer (Epson/Star/POS)",
    bestFor: "High-speed front desk checkout, outpatient pharmacy receipts, zero ink/toner cost.",
    badge: "Fast Checkout",
    scaleRatio: "0.38× (Narrow Thermal)",
  },
]

export default function AdminSettingsPage() {
  const router = useRouter()
  const { doctor, clinicProfile, setClinicProfile } = useAuth()
  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const canAccess = canManageAdminUsers(roles)

  const {
    clinicProfile: loadedProfile,
    loading: loadingProfile,
    refetch,
  } = useClinicProfile()
  const { upsertClinicProfile, loading: saving } = useUpsertClinicProfile()

  const currentProfile = clinicProfile || loadedProfile

  // Extract current paper size from metadata (fallback to 'letter' or 'a4p')
  const savedPaperSize = useMemo(() => {
    if (!currentProfile?.metadata) return "letter"

    // Metadata can be array of { key, value } or object map
    if (Array.isArray(currentProfile.metadata)) {
      const entry = currentProfile.metadata.find(
        (m: any) =>
          m?.key?.toLowerCase() === "invoice_paper_size" ||
          m?.key?.toLowerCase() === "paper_size"
      )
      if (entry?.value) return entry.value.toLowerCase().trim()
    } else if (typeof currentProfile.metadata === "object") {
      const meta = currentProfile.metadata as Record<string, string>
      const val = meta.invoice_paper_size || meta.paper_size
      if (val) return val.toLowerCase().trim()
    }
    return "letter"
  }, [currentProfile])

  const [selectedPaperSize, setSelectedPaperSize] = useState<string>("letter")
  const [isModified, setIsModified] = useState(false)

  // Sync state when profile loads
  useEffect(() => {
    if (savedPaperSize) {
      setSelectedPaperSize(savedPaperSize)
      setIsModified(false)
    }
  }, [savedPaperSize])

  const handleSelectPaperSize = (key: string) => {
    setSelectedPaperSize(key)
    setIsModified(key !== savedPaperSize)
  }

  const handleSaveSettings = async () => {
    try {
      // Build updated metadata list
      let existingMetadata: { key: string; value: string }[] = []
      if (Array.isArray(currentProfile?.metadata)) {
        existingMetadata = currentProfile.metadata
          .filter((m: any) => m && m.key && m.key.toLowerCase() !== "invoice_paper_size" && m.key.toLowerCase() !== "paper_size")
          .map((m: any) => ({ key: String(m.key), value: String(m.value || "") }))
      } else if (currentProfile?.metadata && typeof currentProfile.metadata === "object") {
        existingMetadata = Object.entries(currentProfile.metadata)
          .filter(([k]) => k.toLowerCase() !== "invoice_paper_size" && k.toLowerCase() !== "paper_size")
          .map(([key, value]) => ({ key, value: String(value || "") }))
      }

      const updatedMetadata = [
        ...existingMetadata,
        { key: "invoice_paper_size", value: selectedPaperSize },
      ]

      const response = await upsertClinicProfile({
        metadata: updatedMetadata,
      })

      if (response.status === "SUCCESS") {
        if (response.data) {
          setClinicProfile(response.data)
        }
        await refetch()
        setIsModified(false)
        toast.success(`Invoice paper setting updated to ${PAPER_SIZES.find(p => p.key === selectedPaperSize)?.name || selectedPaperSize}!`)
      } else {
        toast.error(response.message || "Failed to update settings")
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update settings")
    }
  }

  const handlePreviewPdf = (paperKey: string) => {
    const previewUrl = `/api/invoices/preview/${paperKey}`
    window.open(previewUrl, "_blank", "noopener,noreferrer")
  }

  const handleDownloadAllPreviews = () => {
    const zipUrl = `/api/invoices/preview/all`
    window.open(zipUrl, "_blank")
  }

  const activeOption = PAPER_SIZES.find((p) => p.key === selectedPaperSize) || PAPER_SIZES[0]

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header doctor={doctor} />
        <main className="max-w-3xl mx-auto px-6 py-16 text-center space-y-3">
          <ShieldCheck className="w-12 h-12 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold">Access restricted</h1>
          <p className="text-muted-foreground">
            Only administrators and managers have access to system configuration settings.
          </p>
          <Button onClick={() => router.push("/admin")} className="rounded-full">
            Back to Admin Dashboard
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <Header doctor={doctor} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Top Action & Navigation Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 border-border/60 hover:bg-muted"
              onClick={() => router.push("/admin")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  System Settings
                </h1>
                <Badge variant="outline" className="text-[11px] bg-primary/5 text-primary border-primary/20">
                  Admin Configuration
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Configure clinic printing preferences, invoice layouts, and operational defaults.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadAllPreviews}
              className="rounded-full text-xs h-9 px-4 gap-1.5 border-border/70 shadow-sm"
              title="Download mock PDF samples for all 4 paper layouts in a ZIP file"
            >
              <Download className="h-3.5 w-3.5" />
              Download Sample Pack (ZIP)
            </Button>

            <Button
              onClick={handleSaveSettings}
              disabled={saving || !isModified}
              className={`rounded-full h-9 px-5 text-xs font-semibold gap-1.5 transition-all shadow-md ${
                isModified
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground border border-border/50"
              }`}
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : isModified ? "Save Changes" : "Saved"}
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        {loadingProfile ? (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64 rounded-3xl" />
              <Skeleton className="h-64 rounded-3xl" />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Invoice Paper Section */}
            <div className="bg-card/70 backdrop-blur-xl border border-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Printer className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      Invoice Paper & Print Layout
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Choose the default paper size and format for all generated patient bills and insurance invoices.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-medium px-2.5 py-1">
                    Active: <span className="font-bold text-foreground ml-1">{activeOption.name}</span>
                  </Badge>
                </div>
              </div>

              {/* Paper Size Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PAPER_SIZES.map((option) => {
                  const isSelected = selectedPaperSize === option.key
                  const isCurrentSaved = savedPaperSize === option.key

                  return (
                    <div
                      key={option.key}
                      onClick={() => handleSelectPaperSize(option.key)}
                      className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? "border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 shadow-md ring-1 ring-blue-600/30 dark:ring-blue-500/30"
                          : "border-border/60 bg-background/60 hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      {/* Top status indicator & badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-5 w-5 rounded-full flex items-center justify-center border transition-all ${
                              isSelected
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-muted-foreground/30 bg-background"
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                          </div>
                          <div>
                            <p className="font-bold text-base text-foreground flex items-center gap-2">
                              {option.name}
                              {option.badge && (
                                <Badge
                                  variant="secondary"
                                  className={`text-[10px] px-1.5 py-0 ${
                                    option.key === "a4p"
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                      : option.key === "a4l"
                                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                      : option.key === "pos"
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                  }`}
                                >
                                  {option.badge}
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                              {option.subtitle}
                            </p>
                          </div>
                        </div>

                        {isCurrentSaved && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-2 py-0.5 bg-background border-border text-muted-foreground"
                          >
                            Current Default
                          </Badge>
                        )}
                      </div>

                      {/* Description & specifications */}
                      <div className="my-4 space-y-2">
                        <p className="text-xs text-foreground/80 leading-relaxed">
                          {option.bestFor}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-border/40 text-muted-foreground">
                          <div>
                            <span className="font-semibold text-foreground/70">Dimensions: </span>
                            {option.dimensions}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground/70">Printer: </span>
                            {option.printerType.split(" ")[0]}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground/70">Orientation: </span>
                            {option.orientation}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground/70">Scale: </span>
                            {option.scaleRatio}
                          </div>
                        </div>
                      </div>

                      {/* Bottom actions: Preview sample */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/40">
                        <span className="text-[11px] text-muted-foreground">
                          {option.dimensionsInches}
                        </span>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePreviewPdf(option.key)
                          }}
                          className="h-7 px-2.5 text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1 rounded-lg"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Preview Sample PDF
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Informational Guidance Box */}
              <div className="rounded-2xl p-4 bg-muted/40 border border-border/50 flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
                <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-foreground">How this works: </span>
                  When an invoice is printed or finalized, NexxClinic dynamically formats the PDF geometry, font scale, and table columns to fit your configured paper size. If no setting is stored in the database, the system uses the server default configuration.
                </div>
              </div>
            </div>

            {/* Quick Summary / Hardware Advice */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                  <FileText className="h-4 w-4 text-emerald-500" />
                  Office Laser & Inkjet
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use <strong>A4 Portrait</strong> or <strong>Letter</strong> for standard high-resolution full page receipts. Best for formal insurance submissions and official stamps.
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                  <Layers className="h-4 w-4 text-purple-500" />
                  Half-Page Landscape (2-Up)
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Select <strong>A4 Landscape (2-Up)</strong> for compact half-sheet billing. In batch invoice printing, consecutive bills fill the left and right halves of each sheet.
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                  <Receipt className="h-4 w-4 text-amber-500" />
                  Thermal POS Printers
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Select <strong>80mm Thermal</strong> if using thermal roll printers (Epson TM-T88, Bixolon, Xprinter). Instant thermal printing without ribbon or toner replacement.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
