"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Package, ShieldCheck, Building2, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { isManagerWithoutAdmin } from "@/lib/role-utils"

const adminActions = [
  { label: "Manage Insurances", icon: ShieldCheck, path: "/admin/insurances" },
  { label: "Manage Products", icon: Package, path: "/admin/products" },
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
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8 flex flex-col justify-center items-center">
        {/* Centered header aligned with dashboard-header */}
        <div className="text-center space-y-2 mb-4 w-full">
          <h1 className="text-3xl font-bold text-foreground block w-full">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage system configuration and settings.
          </p>
        </div>

        {/* Admin action cards centered and fully responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
          {visibleAdminActions.map(({ label, icon: Icon, path }) => (
            <div
              key={label}
              className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-lg flex items-center justify-between cursor-pointer hover:border-primary/50 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
              onClick={() => router.push(path)}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {label === "Manage Insurances" ? "Create, edit, and delete insurances" :
                      label === "Manage Products" ? "Create, edit, and delete products" :
                        label === "Manage Departments" ? "Organize hospital departments" :
                          "Manage system users and permissions"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="rounded-full bg-white dark:bg-slate-950 font-medium"
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
