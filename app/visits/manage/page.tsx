"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { VisitManageAuditView } from "@/components/visit/visit-manage-audit-view"
import Header from "@/components/header"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/auth-context"

function VisitManageContent() {
  const searchParams = useSearchParams()
  const visitId = searchParams.get("visitId") || ""

  return <VisitManageAuditView visitId={visitId} />
}

export default function VisitManagePage() {
  const { doctor } = useAuth()

  return (
    <Suspense
      fallback={
        <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col">
          <Header doctor={doctor} />
          <div className="max-w-7xl w-full mx-auto p-6 space-y-6">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      }
    >
      <VisitManageContent />
    </Suspense>
  )
}
