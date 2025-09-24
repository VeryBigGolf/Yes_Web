import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { DataPoint } from '@/types'

interface MiniSparklineProps {
  data: DataPoint[]
  color?: string
  height?: number
}

export function MiniSparkline({ data, color = '#3b82f6', height = 40 }: MiniSparklineProps) {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-muted rounded"
        style={{ height }}
      >
        <span className="text-xs text-muted-foreground">No data</span>
      </div>
    )
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
