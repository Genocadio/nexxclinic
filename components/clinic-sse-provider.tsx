"use client"

import { useClinicSse } from "@/hooks/use-clinic-sse"

export function ClinicSseProvider({ children }: { children: React.ReactNode }) {
  useClinicSse()
  return <>{children}</>
}
