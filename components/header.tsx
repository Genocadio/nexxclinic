"use client"

import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import type { Doctor } from "@/lib/types"
import { LogOut, Moon, Sun, UserCog } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { hasAdminAccess } from "@/lib/role-utils"

interface HeaderProps {
  doctor: Doctor | null
}

export default function Header({ doctor }: HeaderProps) {
  const router = useRouter()
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const canAccessAdmin = hasAdminAccess(roles)

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return (parts[0].substring(0, 2)).toUpperCase()
  }

  return (
    <header className="relative z-[90] h-16 bg-card/60 backdrop-blur-xl border-b border-border/30 flex items-center justify-between px-6 shadow-sm">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-3 hover:opacity-90 transition-all duration-200 cursor-pointer"
      >
        <div className="relative h-10 w-10">
          <Image
            src="/FullLogo.png"
            alt="NexxMed logo"
            fill
            sizes="40px"
            className="object-contain"
            priority
          />
        </div>
        <div>
          <h1 className="text-lg font-bold text-card-foreground">NexxMed</h1>
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
                {getInitials(doctor.name)}
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-[95]"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-2xl shadow-xl z-[100] overflow-hidden isolate">
                  <div className="px-4 py-3 border-b border-border/30">
                    <p className="text-sm font-semibold text-card-foreground">{doctor.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{doctor.specialization}</p>
                  </div>
                  {canAccessAdmin && (
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
                  )}
                  <button
                    onClick={() => {
                      router.push('/account')
                      setDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all duration-200 text-left text-foreground"
                  >
                    <UserCog className="w-4 h-4" />
                    <span className="text-sm font-medium">My Account</span>
                  </button>
                  <button
                    onClick={() => {
                      toggleTheme()
                      setDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all duration-200 text-left text-foreground"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </span>
                  </button>
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
