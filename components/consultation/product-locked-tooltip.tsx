'use client'

import type { ReactElement } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { VISIT_PRODUCT_CHANGES_LOCKED_MESSAGE } from '@/lib/visit-product-lock'

interface ProductLockedTooltipProps {
  locked: boolean
  message?: string
  children: ReactElement
  className?: string
}

export function ProductLockedTooltip({
  locked,
  message = VISIT_PRODUCT_CHANGES_LOCKED_MESSAGE,
  children,
  className,
}: ProductLockedTooltipProps) {
  if (!locked) {
    return children
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={className || 'inline-flex'}>{children}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        {message}
      </TooltipContent>
    </Tooltip>
  )
}
