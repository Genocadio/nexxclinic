"use client"

import { useAuth } from "@/lib/auth-context"
import type { Worker } from "@/lib/api-types"
import { LogOut, Moon, Sun, UserCog, BarChart3, Monitor, Home, ArrowLeft } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { hasAdminAccess } from "@/lib/role-utils"
import { getClinicDisplayName, getClinicLogoUrl } from "@/lib/clinic-profile"
import { cn } from "@/lib/utils"

interface FloatingHeaderProps {
  doctor: Worker | null
}

export default function FloatingHeader({ doctor }: FloatingHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout, clinicProfile } = useAuth()
  const { preference, setThemePreference } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showClinicName, setShowClinicName] = useState(false)

  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const canAccessAdmin = hasAdminAccess(roles)
  const isAdminPath = pathname?.startsWith("/admin")
  const isRootPage = pathname === "/" || pathname === "/admin"
  const clinicName = getClinicDisplayName(clinicProfile)
  const clinicLogoUrl = getClinicLogoUrl(clinicProfile)

  const OPERATIONAL_REPORT_ROLES = ["CLINICIAN", "NURSE", "FINANCE", "RECEPTION"]
  const canAccessReports = roles.some((r) => OPERATIONAL_REPORT_ROLES.includes(String(r)))

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return (parts[0]?.substring(0, 2) || "DR").toUpperCase()
  }

  const handleMouseEnter = () => {
    setShowClinicName(true)
  }

  const handleMouseLeave = () => {
    setShowClinicName(false)
  }

  return (
    <>
      {/* Floating Home / Logo / Back (Left side of screen) */}
      <div className="fixed top-3 left-3 sm:top-3.5 sm:left-4 z-40">
        {isRootPage ? (
          <button
            type="button"
            onClick={() => router.push(isAdminPath ? "/admin" : "/")}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "h-10 sm:h-11 rounded-full bg-card/85 dark:bg-slate-900/85 backdrop-blur-xl border border-border/60 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer ring-2 ring-background/60 group select-none overflow-hidden",
              showClinicName ? "px-3 gap-2" : "w-10 sm:w-11 px-0"
            )}
            title={clinicName}
            aria-label={clinicName}
          >
            <img
              src={clinicLogoUrl}
              alt={`${clinicName} logo`}
              className="h-6 w-6 sm:h-7 sm:w-7 object-contain rounded-full shrink-0"
            />
            {showClinicName && (
              <span className="font-bold text-xs sm:text-sm text-foreground max-w-[140px] sm:max-w-[200px] truncate group-hover:text-primary transition-all duration-300 animate-in fade-in-0 slide-in-from-left-2 duration-200">
                {clinicName}
              </span>
            )}
          </button>
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
                  {isAdminPath ? (
                    <button
                      type="button"
                      onClick={() => {
                        router.push("/")
                        setDropdownOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[11px] font-semibold">
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
                          setDropdownOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer"
                      >
                        <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[11px] font-semibold">
                          A
                        </span>
                        <span className="text-sm font-medium">Admin Dashboard</span>
                      </button>
                    )
                  )}
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
                  {canAccessReports && (
                    <button
                      type="button"
                      onClick={() => {
                        router.push("/reports")
                        setDropdownOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all duration-200 text-left text-foreground cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">My Reports & Activity</span>
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
                        <span className="text-[11px]">Light</span>
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
                        <span className="text-[11px]">System</span>
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
                        <span className="text-[11px]">Dark</span>
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
