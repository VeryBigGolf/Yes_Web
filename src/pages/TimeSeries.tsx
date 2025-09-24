import { useClientCsv } from "@/hooks/useClientCsv";
import { TimeSeriesChart } from "@/components/TimeSeriesChart";
import { useState, useMemo, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboardStore } from "@/store/useDashboardStore";

const TIME_RANGES = [
  { value: '15m', label: '15 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '8h', label: '8 hours' },
  { value: '24h', label: '24 hours' },
  { value: 'all', label: 'All data' },
];

export default function TimeSeries() {
  const { columns, byFeature, loading, error } = useClientCsv();
  const { selectedFeature } = useDashboardStore();
  const [selected, setSelected] = useState<string>(selectedFeature || "MAIN STEAM PRESSURE");
  const [timeRange, setTimeRange] = useState<string>("1h");

  // Update selected when selectedFeature changes (from Suggestions)
  useEffect(() => {
    if (selectedFeature) {
      setSelected(selectedFeature);
    }
  }, [selectedFeature]);

  const data = useMemo(() => {
    const allData = byFeature.get(selected) ?? [];
    
    if (timeRange === "all") return allData;
    
    const now = new Date();
    const rangeMs = {
      "15m": 15 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "8h": 8 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
    }[timeRange] || 60 * 60 * 1000;
    
    const cutoff = new Date(now.getTime() - rangeMs);
    return allData.filter(point => new Date(point.t) >= cutoff);
  }, [byFeature, selected, timeRange]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-red-300">
          CSV load failed: {String(error)}
        </div>
      )}
      
      {!loading && !error && (
        <div className="rounded-md border border-blue-500/40 bg-blue-500/10 p-3 text-blue-300">
          📊 Showing first day data from CSV
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="parameter-select" className="text-sm font-medium">
            Parameter:
          </label>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger id="parameter-select" className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {columns.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <label htmlFor="time-range" className="text-sm font-medium">
            Time Range:
          </label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger id="time-range" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <TimeSeriesChart 
        feature={selected as any} 
        data={data} 
        loading={loading} 
      />
    </div>
  );
}