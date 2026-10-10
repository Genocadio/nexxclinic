"use client"

import { useEffect, useRef, useState, type ComponentProps } from "react"
import { DEFAULT_CLINIC_LOGO_URL } from "@/lib/clinic-profile"

type ClinicLogoImageProps = Omit<ComponentProps<"img">, "src"> & {
  src: string
}

/** How long to wait for the primary logo before falling back to the default. */
const FALLBACK_AFTER_MS = 4000

export function ClinicLogoImage({ src, ...props }: ClinicLogoImageProps) {
  return <ImageWithFallback key={src} src={src} {...props} />
}

function ImageWithFallback({ src, ...props }: ClinicLogoImageProps) {
  const [failed, setFailed] = useState(false)
  const loadedRef = useRef(false)
  const fallbackFailed = src === DEFAULT_CLINIC_LOGO_URL

  // A dead or hanging primary URL (e.g. a storage proxy that never answers)
  // would otherwise leave the logo blank until the browser gives up. Swap to
  // the bundled default once the image has not loaded within a few seconds.
  useEffect(() => {
    if (fallbackFailed) return
    const timer = window.setTimeout(() => {
      if (!loadedRef.current) setFailed(true)
    }, FALLBACK_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [src, fallbackFailed])

  return (
    <img
      {...props}
      src={failed ? DEFAULT_CLINIC_LOGO_URL : src}
      onLoad={() => {
        loadedRef.current = true
      }}
      onError={() => {
        if (!fallbackFailed) setFailed(true)
      }}
    />
  )
}
