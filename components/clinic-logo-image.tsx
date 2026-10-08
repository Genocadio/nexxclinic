"use client"

import { useState, type ComponentProps } from "react"
import { DEFAULT_CLINIC_LOGO_URL } from "@/lib/clinic-profile"

type ClinicLogoImageProps = Omit<ComponentProps<"img">, "src"> & {
  src: string
}

export function ClinicLogoImage({ src, ...props }: ClinicLogoImageProps) {
  return <ImageWithFallback key={src} src={src} {...props} />
}

function ImageWithFallback({ src, ...props }: ClinicLogoImageProps) {
  const [failed, setFailed] = useState(false)
  const fallbackFailed = src === DEFAULT_CLINIC_LOGO_URL

  return (
    <img
      {...props}
      src={failed ? DEFAULT_CLINIC_LOGO_URL : src}
      onError={() => {
        if (!fallbackFailed) setFailed(true)
      }}
    />
  )
}
