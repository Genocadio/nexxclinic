"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PageLoading } from "@/components/ui/page-loading"
import { VisitManageAuditView } from "@/components/visit/visit-manage-audit-view"

function VisitManageContent() {
  const searchParams = useSearchParams()
  const visitId = searchParams.get("visitId") || ""

  return <VisitManageAuditView visitId={visitId} />
}

export default function VisitManagePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <VisitManageContent />
    </Suspense>
  )
}
