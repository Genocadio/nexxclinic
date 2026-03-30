"use client"

import { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Building2, Package, ShieldCheck, Users } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { isManagerWithoutAdmin } from '@/lib/role-utils'

const adminDockItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Departments', path: '/admin/departments', icon: Building2 },
  { label: 'Actions', path: '/admin/actions-consumables', icon: Package },
  { label: 'Insurances', path: '/admin/insurances', icon: ShieldCheck },
  { label: 'Users', path: '/admin/users', icon: Users },
]

export default function AdminBottomDock() {
  const pathname = usePathname()
  const router = useRouter()
  const { doctor } = useAuth()
  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const managerOnlyAdminAccess = isManagerWithoutAdmin(roles)
  const visibleDockItems = managerOnlyAdminAccess
    ? adminDockItems.filter((item) => item.path === '/admin' || item.path === '/admin/users')
    : adminDockItems

  const shouldHide = useMemo(() => {
    if (!pathname?.startsWith('/admin')) return true
    // Form builder has its own dedicated dock.
    if (pathname === '/admin/forms') return true
    return false
  }, [pathname])

  if (shouldHide) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className="glass-gray rounded-full shadow-xl px-3 py-2 flex items-center gap-2">
        <TooltipProvider>
          {visibleDockItems.map(({ label, path, icon: Icon }) => {
            const isActive = pathname === path
            return (
              <Tooltip key={path}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => router.push(path)}
                    className={`rounded-full h-11 w-11 border-2 border-white/30 shadow-lg ${
                      isActive
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-transparent text-white/90 hover:bg-blue-600 hover:text-white'
                    }`}
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </div>
    </div>
  )
}
