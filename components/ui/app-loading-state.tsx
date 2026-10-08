"use client"

import { PageLoading } from "@/components/ui/page-loading"

export function AppLoadingState({ className }: { message?: string; className?: string }) {
  return <PageLoading className={className} />
}
