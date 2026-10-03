"use client"

import { useAuth } from "@/lib/auth-context"
import type { Worker } from "@/lib/api-types"
import { LogOut, Moon, Sun, UserCog, BarChart3, Monitor } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { hasAdminAccess } from "@/lib/role-utils"
import { getClinicDisplayName, getClinicLogoUrl } from "@/lib/clinic-profile"
import { cn } from "@/lib/utils"

interface HeaderProps {
  doctor: Worker | null
}

export default function Header({ doctor }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout, clinicProfile } = useAuth()
  const { preference, setThemePreference } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const canAccessAdmin = hasAdminAccess(roles)
  const isAdminPath = pathname?.startsWith("/admin")
  const clinicName = getClinicDisplayName(clinicProfile)
  const clinicLogoUrl = getClinicLogoUrl(clinicProfile)

  const OPERATIONAL_REPORT_ROLES = ["CLINICIAN", "NURSE", "FINANCE", "RECEPTION"]
  const canAccessReports = roles.some((r) => OPERATIONAL_REPORT_ROLES.includes(String(r)))

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return (parts[0].substring(0, 2)).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-[90] h-16 bg-card/60 backdrop-blur-xl border-b border-border/30 flex items-center justify-between px-6 shadow-sm shrink-0">
      <button
        onClick={() => router.push(isAdminPath ? "/admin" : "/")}
        className="flex items-center gap-3 hover:opacity-90 transition-all duration-200 cursor-pointer"
      >
        <img src={clinicLogoUrl} alt={`${clinicName} logo`} className="h-10 w-10 object-contain" />
        <div>
          <h1 className="text-lg font-bold text-card-foreground">{clinicName}</h1>
        </div>
      </button>

      <div className="flex items-center gap-4">
        {doctor && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:bg-muted/50 rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200">
              {getInitials(`${doctor.firstName} ${doctor.lastName || ''}`)}
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-[95]"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-60 bg-background border border-border rounded-2xl shadow-xl z-[100] overflow-hidden isolate">
                  <div className="px-4 py-3 border-b border-border/30">
                    <p className="text-sm font-semibold text-card-foreground">{doctor.firstName} {doctor.lastName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{doctor.roles?.join(', ') || ''}</p>
                  </div>
                  {isAdminPath ? (
                    <button
                      onClick={() => {
                        router.push('/')
                        setDropdownOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all duration-200 text-left text-foreground"
                    >
                      <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[11px] font-semibold">M</span>
                      <span className="text-sm font-medium">Medical Dashboard</span>
                    </button>
                  ) : (
                    canAccessAdmin && (
                      <button
                        onClick={() => {
                          router.push('/admin')
                          setDropdownOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all duration-200 text-left text-foreground"
                      >
                        <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[11px] font-semibold">A</span>
                        <span className="text-sm font-medium">Admin Dashboard</span>
                      </button>
                    )
                  )}
                  <button
                    onClick={() => {
                      router.push('/account')
                      setDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all duration-200 text-left text-foreground"
                  >
                    <UserCog className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">My Account</span>
                  </button>
                  {canAccessReports && (
                    <button
                      onClick={() => {
                        router.push('/reports')
                        setDropdownOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all duration-200 text-left text-foreground"
                    >
                      <BarChart3 className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">My Reports & Activity</span>
                    </button>
                  )}
                  
                  {/* Horizontal 3-way Theme Switcher */}
                  <div className="px-3 py-2.5 border-t border-border/30">
                    <div className="flex items-center justify-between p-1 bg-muted/60 dark:bg-muted/40 rounded-xl border border-border/40">
                      <button
                        type="button"
                        onClick={() => setThemePreference("light")}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer",
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
                          "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer",
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
                          "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer",
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
                    onClick={() => {
                      logout()
                      setDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all duration-200 text-left text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
