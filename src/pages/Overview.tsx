import { useClientCsv } from "@/hooks/useClientCsv";
import { THRESHOLDS } from "@/lib/thresholds";
import { KpiCard } from "@/components/KpiCard";
import { useSuggestions } from "@/hooks/useSuggestions";
import SuggestionCard from "@/components/SuggestionCard";
import { useMemo } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";

const KPI_KEYS = [
  "MAIN STEAM PRESSURE",
  "MAIN STEAM TEMPERATURE",
  "TOTAL AIR FLOW ACTUAL",
  "BOILER BANK GAS OUTLET OXYGEN",
  "STACK TEMPERATOR",
  "FURNACE PRESSURE BOILER 11",
];

export default function Overview() {
  const { columns, byFeature, loading, error } = useClientCsv();
  const { data: suggestions, loading: sugLoading, error: sugError } = useSuggestions();
  const { setCurrentPage, setSelectedFeature } = useDashboardStore();

  const kpis = useMemo(() => {
    return KPI_KEYS.map((key) => {
      const arr = byFeature.get(key) ?? [];
      const latest = arr.length ? arr[arr.length - 1].v : null;
      return { key, data: arr, latest };
    });
  }, [byFeature]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-red-300">
          Failed to load CSV. Ensure <code>/public/Boiler11_1.csv</code> exists. {String(error)}
        </div>
      )}
      
      {!loading && !error && (
        <div className="rounded-md border border-blue-500/40 bg-blue-500/10 p-3 text-blue-300">
          📊 Using first day data from CSV for optimal performance
        </div>
      )}

      <h2 className="text-xl font-semibold">Key Performance Indicators</h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpis.map(({ key, data, latest }) => {
          return (
            <KpiCard
              key={key}
              feature={key as any}
              value={latest}
              sparklineData={data}
              loading={loading}
            />
          );
        })}
      </div>

      <h3 className="text-lg font-semibold mt-6">Suggestions</h3>
      {sugError && (
        <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-amber-200">
          Failed to load suggestions: {sugError}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(sugLoading ? Array.from({length:3}) : suggestions).map((s:any, i:number) => (
          sugLoading ? (
            <div key={i} className="rounded-2xl border p-4 animate-pulse h-28 bg-muted/40" />
          ) : (
            <SuggestionCard
              key={s.id}
              s={s}
              onView={(feature) => {
                setSelectedFeature(feature);
                setCurrentPage('time-series');
              }}
            />
          )
        ))}
      </div>

      <h3 className="text-lg font-semibold mt-6">System Status</h3>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-muted-foreground">Parameters Monitored</div>
          <div className="mt-2 text-3xl font-semibold">{columns.length}</div>
          <div className="text-sm text-muted-foreground">Active sensors and measurements</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-muted-foreground">Data Points</div>
          <div className="mt-2 text-3xl font-semibold">
            {kpis.length > 0 ? kpis[0].data.length : 0}
          </div>
          <div className="text-sm text-muted-foreground">First day data points</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-muted-foreground">System Health</div>
          <div className="mt-2 text-3xl font-semibold text-green-400">Good</div>
          <div className="text-sm text-muted-foreground">All systems operating normally</div>
        </div>
      </div>
    </div>
  );
}