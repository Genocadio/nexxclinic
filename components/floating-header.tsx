"use client"

import { useAuth } from "@/lib/auth-context"
import type { Worker } from "@/lib/api-types"
import { LogOut, Moon, Sun, UserCog, BarChart3, Monitor, Home, ArrowLeft, LayoutGrid, X, ShieldCheck, Sparkles, Landmark, Stethoscope } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { useRouter, usePathname } from "@/lib/navigation"
import { useState } from "react"
import {
  hasRole,
  hasAdminAccess,
  hasAdminOrManagerAccess,
  canAccessFinancialReports,
  canAccessMedicalReports,
  canAccessAnyClinicReports,
} from "@/lib/role-utils"
import { getClinicDisplayName, getClinicLogoUrl } from "@/lib/clinic-profile"
import { cn } from "@/lib/utils"
import { ClinicLogoImage } from "@/components/clinic-logo-image"
import { Badge } from "@/components/ui/badge"

interface FloatingHeaderProps {
  doctor: Worker | null
}

export default function FloatingHeader({ doctor }: FloatingHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout, clinicProfile } = useAuth()
  const { preference, setThemePreference } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [leftMenuOpen, setLeftMenuOpen] = useState(false)

  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const canAccessAdmin = hasAdminAccess(roles)
  const canAccessAdminOrManager = hasAdminOrManagerAccess(roles)
  const canFinancialReports = canAccessFinancialReports(roles)
  const canMedicalReports = canAccessMedicalReports(roles)
  const canAnyClinicReports = canAccessAnyClinicReports(roles)
  const canAccessReportsMenu = Boolean(doctor && (canAccessAdminOrManager || canAnyClinicReports))
  const isAdminPath = pathname?.startsWith("/admin")
  const isRootPage = pathname === "/" || pathname === "/admin"
  const clinicName = getClinicDisplayName(clinicProfile)
  const clinicLogoUrl = getClinicLogoUrl(clinicProfile)

  // Personal user report is only for users with operational duties (CLINICIAN, NURSE, FINANCE, RECEPTION)
  // Users who are strictly admin, manager, or reporting-only do not have personal patient/visit activity.
  const hasOperationalRole =
    hasRole(roles, "CLINICIAN") ||
    hasRole(roles, "NURSE") ||
    hasRole(roles, "FINANCE") ||
    hasRole(roles, "RECEPTION")
  const canAccessPersonalReport = hasOperationalRole

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return (parts[0]?.substring(0, 2) || "DR").toUpperCase()
  }

  return (
    <>
      {/* Floating Home / Logo / Back / Management Menu (Left side of screen) */}
      <div className="fixed top-3 left-3 sm:top-3.5 sm:left-4 z-40">
        <div className="relative">
          {isRootPage ? (
            canAccessReportsMenu ? (
              // For logged in users with admin/manager/reporting access on root pages: circular button with menu icon
              <>
                <button
                  type="button"
                  onClick={() => setLeftMenuOpen(!leftMenuOpen)}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-card/85 dark:bg-slate-900/85 backdrop-blur-xl border border-border/60 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer ring-2 ring-background/60 group select-none"
                  title={leftMenuOpen ? "Close menu" : "Menu"}
                  aria-label={leftMenuOpen ? "Close menu" : "Menu"}
                >
                  {leftMenuOpen ? (
                    <X className="h-5 w-5 text-foreground transition-all duration-200" />
                  ) : (
                    <LayoutGrid className="h-5 w-5 text-foreground transition-all duration-200" />
                  )}
                </button>

                {leftMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[95]"
                      onClick={() => setLeftMenuOpen(false)}
                    />
                    <div className="absolute left-0 mt-2 w-72 bg-card/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden isolate animate-in fade-in-0 zoom-in-95 duration-150">
                      <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                        <div className="flex items-center gap-2.5">
                          <ClinicLogoImage
                            src={clinicLogoUrl}
                            alt={`${clinicName} logo`}
                            className="h-7 w-7 object-contain rounded-full"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-card-foreground truncate">
                              {clinicName}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {canAccessAdminOrManager ? "Management & Reports" : canAnyClinicReports ? "Reports" : "Menu & Navigation"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Reports Group (Financial Reports & Medical Reports) */}
                      {canFinancialReports && (
                        <button
                          type="button"
                          onClick={() => {
                            router.push("/reports/financial")
                            setLeftMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/10 transition-all duration-200 text-left text-foreground cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Landmark className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-foreground">Financial Reports</span>
                              <Badge variant="default" className="text-[10px] py-0 px-1.5 h-4 font-normal">
                                Finance
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate">
                              Overview, earnings, waivers & loans
                            </p>
                          </div>
                        </button>
                      )}

                      {canMedicalReports && (
                        <button
                          type="button"
                          onClick={() => {
                            router.push("/reports/medical")
                            setLeftMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-500/10 transition-all duration-200 text-left text-foreground cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Stethoscope className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-foreground">Medical Reports</span>
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 font-normal text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                                Clinical
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate">
                              Diagnoses, symptoms, age brackets & Rx
                            </p>
                          </div>
                        </button>
                      )}

                      {(canAccessAdminOrManager || canAnyClinicReports) && <div className="border-t border-border/30" />}

                      {/* Navigation switchers */}
                      {isAdminPath ? (
                        <button
                          type="button"
                          onClick={() => {
                            router.push("/")
                            setLeftMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer"
                        >
                          <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[12px] font-semibold">
                            M
                          </span>
                          <span className="text-sm font-medium">Medical Dashboard</span>
                        </button>
                      ) : (
                        canAccessAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              router.push("/admin")
                              setLeftMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer"
                          >
                            <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[12px] font-semibold">
                              A
                            </span>
                            <span className="text-sm font-medium">Admin Console</span>
                          </button>
                        )
                      )}

                      {canAccessPersonalReport && (
                        <button
                          type="button"
                          onClick={() => {
                            router.push("/reports")
                            setLeftMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer"
                        >
                          <BarChart3 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">My Personal Activity</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => router.push(isAdminPath ? "/admin" : "/")}
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-card/85 dark:bg-slate-900/85 backdrop-blur-xl border border-border/60 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer ring-2 ring-background/60 group select-none"
                title={clinicName}
                aria-label={clinicName}
              >
                <ClinicLogoImage
                  src={clinicLogoUrl}
                  alt={`${clinicName} logo`}
                  className="h-6 w-6 sm:h-7 sm:w-7 object-contain rounded-full shrink-0"
                />
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={() => router.push(isAdminPath ? "/admin" : "/")}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-card/85 dark:bg-slate-900/85 backdrop-blur-xl border border-border/60 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer ring-2 ring-background/60 group select-none"
              title={isAdminPath ? "Back to Admin" : "Back to Dashboard"}
              aria-label={isAdminPath ? "Back to Admin" : "Back to Dashboard"}
            >
              <Home className="h-5 w-5 text-foreground group-hover:hidden transition-all duration-200" />
              <ArrowLeft className="h-5 w-5 text-primary hidden group-hover:block transition-all duration-200 -translate-x-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating User Avatar (Right side of screen) */}
      {doctor && (
        <div className="fixed top-3 right-3 sm:top-3.5 sm:right-4 z-40">
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ring-2 ring-background border border-border/40 select-none"
              title={`${doctor.firstName} ${doctor.lastName || ""}`}
              aria-label="User profile & navigation"
            >
              {getInitials(`${doctor.firstName} ${doctor.lastName || ""}`)}
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-[95]"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-card/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden isolate animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-border/30">
                    <p className="text-sm font-semibold text-card-foreground">
                      {doctor.firstName} {doctor.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {doctor.roles?.join(", ") || ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      router.push("/account")
                      setDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer"
                  >
                    <UserCog className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">My Account</span>
                  </button>
                  {canAccessPersonalReport && (
                    <button
                      type="button"
                      onClick={() => {
                        router.push("/reports")
                        setDropdownOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">My Personal Activity</span>
                    </button>
                  )}

                  {/* Horizontal Theme Switcher */}
                  <div className="px-3 py-2 border-t border-border/30">
                    <div className="flex items-center justify-between p-1 bg-muted/60 dark:bg-muted/40 rounded-xl border border-border/40">
                      <button
                        type="button"
                        onClick={() => setThemePreference("light")}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer",
                          preference === "light"
                            ? "bg-background text-foreground shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        title="Light Theme"
                        aria-label="Light Theme"
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span className="text-[12px]">Light</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setThemePreference("system")}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer",
                          preference === "system"
                            ? "bg-background text-foreground shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        title="System Theme"
                        aria-label="System Theme"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span className="text-[12px]">System</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setThemePreference("dark")}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer",
                          preference === "dark"
                            ? "bg-background text-foreground shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        title="Dark Theme"
                        aria-label="Dark Theme"
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span className="text-[12px]">Dark</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-border/30" />
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
