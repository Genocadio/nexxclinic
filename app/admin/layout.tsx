import type React from 'react'
import AdminBottomDock from '@/components/admin-bottom-dock'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AdminBottomDock />
    </>
  )
}
