import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MiniSparkline } from './MiniSparkline'
import { THRESHOLDS } from '@/lib/thresholds'
import { getThresholdStatus, getThresholdColor, getThresholdBgColor, cn } from '@/lib/utils'
import { formatParameterValue } from '@/lib/format'
import { DataPoint, FeatureKey } from '@/types'

interface KpiCardProps {
  feature: FeatureKey
  value: number | null
  sparklineData: DataPoint[]
  loading?: boolean
}

export function KpiCard({ feature, value, sparklineData, loading = false }: KpiCardProps) {
  const threshold = THRESHOLDS[feature]
  const status = value !== null && threshold 
    ? getThresholdStatus(value, threshold.min, threshold.max)
    : 'ok'

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-8 bg-muted animate-pulse rounded w-1/2" />
          <div className="h-10 bg-muted animate-pulse rounded" />
          <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      "rounded-2xl transition-all hover:shadow-md",
      getThresholdBgColor(status)
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {feature}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">
            {value !== null ? formatParameterValue(feature, value) : 'N/A'}
          </span>
          {status !== 'ok' && (
            <Badge 
              variant="outline" 
              className={cn("text-xs", getThresholdColor(status))}
            >
              {status === 'warn' ? 'Warning' : 'Critical'}
            </Badge>
          )}
        </div>
        
        <MiniSparkline 
          data={sparklineData} 
          color={status === 'ok' ? '#10b981' : status === 'warn' ? '#f59e0b' : '#ef4444'}
        />
        
        {threshold && (
          <div className="text-xs text-muted-foreground">
            Range: {threshold.min ?? '∞'} - {threshold.max ?? '∞'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
