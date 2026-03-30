"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LegacyRegisterRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/auth?mode=register")
  }, [router])

  return null
}
