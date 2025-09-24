import { useEffect, useMemo } from "react";
import { useClientCsv } from "@/hooks/useClientCsv";
import { useDashboardStore } from "@/store/useDashboardStore";
import { sliceByRange, statsOf, type RangeKey } from "@/lib/timeRange";
import TimeSeriesChart from "@/components/TimeSeriesChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RANGE_OPTS: { key: RangeKey; label: string }[] = [
  { key: "15m", label: "15 minutes" },
  { key: "1h",  label: "1 hour" },
  { key: "8h",  label: "8 hours" },
  { key: "24h", label: "24 hours" },
  { key: "all", label: "All data" },
];

export default function TimeSeries() {
  const { columns, byFeature, latestISO, loading, error } = useClientCsv();

  const selected = useDashboardStore(s => s.selectedFeature);
  const setSelected = useDashboardStore(s => s.setSelectedFeature);
  const range = useDashboardStore(s => s.timeRange);
  const setRange = useDashboardStore(s => s.setTimeRange);

  // default selection = first column once loaded
  useEffect(() => {
    if (!selected && columns.length) setSelected(columns[0]);
  }, [columns, selected, setSelected]);

  const full = useMemo(
    () => (selected ? (byFeature.get(selected) ?? []) : []),
    [byFeature, selected]
  );

  const { data: series, usedFallback, anchorUsed } = useMemo(() => {
    const anchorNow = new Date().toISOString();
    return sliceByRange(full, range, anchorNow, latestISO ?? undefined);
  }, [full, range, latestISO]);

  const filtered = useMemo(
    () => series.filter(p => Number.isFinite(p.v)),
    [series]
  );

  const stats = useMemo(() => statsOf(filtered), [filtered]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-red-300">
          CSV load failed: {String(error)}
        </div>
      )}

      {range !== "all" && (
        <div className="rounded-xl border bg-indigo-500/10 border-indigo-500/30 p-3 text-sm">
          {usedFallback
            ? <>Showing <b>{RANGE_OPTS.find(r => r.key === range)?.label}</b> ending at CSV latest (<code>{anchorUsed}</code>).</>
            : <>Showing <b>{RANGE_OPTS.find(r => r.key === range)?.label}</b> ending now (<code>{anchorUsed}</code>).</>
          }
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="text-sm text-muted-foreground">Parameter:</div>
        <Select value={selected ?? ""} onValueChange={(v) => setSelected(v)} disabled={!columns.length}>
          <SelectTrigger className="w-[320px]">
            <SelectValue placeholder="Select parameter" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-sm text-muted-foreground ml-2">Time Range:</div>
        <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTS.map((r) => (
              <SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {["Min","Max","Mean","Latest"].map((lbl, i) => {
          const val = [stats.min, stats.max, stats.mean, stats.latest][i];
          return (
            <div key={lbl} className="rounded-xl border px-4 py-3">
              <div className="text-xs text-muted-foreground">{lbl}</div>
              <div className="mt-1 text-xl font-semibold">{val == null ? "N/A" : Number(val).toFixed(2)}</div>
            </div>
          );
        })}
      </div>

      <TimeSeriesChart
        key={`${selected ?? "none"}-${range}`}   // force redraw when feature/range changes
        title={selected ?? "—"}
        data={filtered}
        loading={loading}
      />

      {!loading && selected && filtered.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No data available for the selected time range.
        </div>
      )}
    </div>
  );
}