"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Package, ShieldCheck, Building2, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { isManagerWithoutAdmin } from "@/lib/role-utils"

const adminActions = [
  { label: "Manage Insurances", icon: ShieldCheck, path: "/admin/insurances" },
  { label: "Manage Actions & Consumables", icon: Package, path: "/admin/actions-consumables" },
  { label: "Manage Departments", icon: Building2, path: "/admin/departments" },
  { label: "Manage Users", icon: Users, path: "/admin/users" },
]

export default function AdminDashboardPage() {
  const { doctor } = useAuth()
  const router = useRouter()
  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const managerOnlyAdminAccess = isManagerWithoutAdmin(roles)
  const visibleAdminActions = managerOnlyAdminAccess
    ? adminActions.filter((action) => action.path === "/admin/users")
    : adminActions

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage system configuration and settings.</p>
        </div>

        {/* Admin action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visibleAdminActions.map(({ label, icon: Icon, path }) => (
            <div
              key={label}
              className="bg-card/70 dark:bg-slate-900/70 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => router.push(path)}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">
                    {label === "Manage Insurances" ? "Create, edit, and delete insurances" : 
                     label === "Manage Actions & Consumables" ? "Create, edit, and delete actions & consumables" :
                     label === "Manage Departments" ? "Organize hospital departments" :
                     "Manage system users and permissions"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="rounded-full"
              >
                Open
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
