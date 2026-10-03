"use client"

import FloatingHeader from "@/components/floating-header"
import type { Worker } from "@/lib/api-types"

interface HeaderProps {
  doctor: Worker | null
}

export default function Header({ doctor }: HeaderProps) {
  return <FloatingHeader doctor={doctor} />
}
