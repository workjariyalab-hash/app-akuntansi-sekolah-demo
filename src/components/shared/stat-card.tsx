'use client'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatRupiah, formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  isRupiah?: boolean
  trend?: number
  description?: string
  icon?: ReactNode
  className?: string
  valueClassName?: string
}

export function StatCard({
  title,
  value,
  isRupiah = false,
  trend,
  description,
  icon,
  className,
  valueClassName,
}: StatCardProps) {
  const displayValue =
    typeof value === 'number'
      ? isRupiah
        ? formatRupiah(value)
        : formatNumber(value)
      : value

  const trendIsPositive = trend !== undefined && trend > 0
  const trendIsNegative = trend !== undefined && trend < 0
  const trendIsNeutral = trend !== undefined && trend === 0

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p
              className={cn(
                'mt-1 text-2xl font-bold tracking-tight truncate',
                valueClassName
              )}
            >
              {displayValue}
            </p>
            {(trend !== undefined || description) && (
              <div className="mt-2 flex items-center gap-1.5">
                {trend !== undefined && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-xs font-medium',
                      trendIsPositive && 'text-green-600',
                      trendIsNegative && 'text-red-600',
                      trendIsNeutral && 'text-muted-foreground'
                    )}
                  >
                    {trendIsPositive && <TrendingUp className="h-3 w-3" />}
                    {trendIsNegative && <TrendingDown className="h-3 w-3" />}
                    {trendIsNeutral && <Minus className="h-3 w-3" />}
                    {Math.abs(trend).toFixed(1)}%
                  </span>
                )}
                {description && (
                  <span className="text-xs text-muted-foreground">{description}</span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 rounded-lg bg-muted p-2.5 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
