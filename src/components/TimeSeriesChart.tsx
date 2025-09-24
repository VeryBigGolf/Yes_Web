import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type Point = { t: string; v: number };
export default function TimeSeriesChart({
  title,
  data,
  loading,
}: {
  title: string;
  data: Point[];
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-lg font-semibold mb-3">{title}</div>
      <div className="h-[360px] w-full">
        {loading ? (
          <div className="h-full w-full animate-pulse rounded-xl bg-muted/40" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="t"
                tickFormatter={(v) => new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                minTickGap={24}
              />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip
                labelFormatter={(v) => new Date(v as string).toLocaleString()}
                formatter={(value: any) => [Number(value).toFixed(3), "Value"]}
              />
              <Line type="monotone" dataKey="v" dot={false} strokeWidth={2} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}