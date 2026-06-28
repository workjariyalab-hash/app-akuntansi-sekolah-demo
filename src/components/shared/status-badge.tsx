'use client'

import { Badge } from '@/components/ui/badge'
import { getStatusColor, getStatusLabel } from '@/lib/format'

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'info'
  | 'outline'

interface StatusBadgeProps {
  status: string
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const variant = getStatusColor(status) as BadgeVariant
  return (
    <Badge variant={variant} className={className}>
      {label ?? getStatusLabel(status)}
    </Badge>
  )
}
