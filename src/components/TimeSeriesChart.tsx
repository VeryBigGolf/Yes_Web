import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { formatParameterValue } from '@/lib/format'
import { DataPoint, FeatureKey } from '@/types'

interface TimeSeriesChartProps {
  feature: FeatureKey | null
  data: DataPoint[]
  loading?: boolean
  realtimeOn?: boolean
  onRealtimeToggle?: (on: boolean) => void
}

export function TimeSeriesChart({ 
  feature, 
  data, 
  loading = false, 
  realtimeOn = false,
  onRealtimeToggle 
}: TimeSeriesChartProps) {
  const [stats, setStats] = useState<{
    min: number | null
    max: number | null
    mean: number | null
    latest: number | null
  }>({ min: null, max: null, mean: null, latest: null })

  useEffect(() => {
    if (data.length === 0) {
      setStats({ min: null, max: null, mean: null, latest: null })
      return
    }

    const values = data.map(d => d.v)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const latest = data[data.length - 1]?.v || null

    setStats({ min, max, mean, latest })
  }, [data])

  const formatTooltipValue = (value: number) => {
    return feature ? formatParameterValue(feature, value) : value.toString()
  }

  const formatXAxisTick = (tickItem: string) => {
    const date = new Date(tickItem)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-6 bg-muted animate-pulse rounded w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  if (!feature) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Time Series Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            Select a parameter from the sidebar to view its time series
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {feature}
            {realtimeOn && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Live
              </Badge>
            )}
          </CardTitle>
          
          {onRealtimeToggle && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Realtime</span>
              <Switch
                checked={realtimeOn}
                onCheckedChange={onRealtimeToggle}
                aria-label="Toggle realtime updates"
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Min</div>
            <div className="font-semibold">
              {stats.min !== null ? formatTooltipValue(stats.min) : 'N/A'}
            </div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Max</div>
            <div className="font-semibold">
              {stats.max !== null ? formatTooltipValue(stats.max) : 'N/A'}
            </div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Mean</div>
            <div className="font-semibold">
              {stats.mean !== null ? formatTooltipValue(stats.mean) : 'N/A'}
            </div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Latest</div>
            <div className="font-semibold">
              {stats.latest !== null ? formatTooltipValue(stats.latest) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-96">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available for the selected time range
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="t" 
                  tickFormatter={formatXAxisTick}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value) => [formatTooltipValue(value as number), feature]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
