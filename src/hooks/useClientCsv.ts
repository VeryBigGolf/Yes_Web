import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import dayjs from "dayjs";

export type Row = Record<string, string | number>;
export type DataPoint = { t: string; v: number };

export function useClientCsv(src: string = "/Boiler11_1.csv") {
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    Papa.parse(src, {
      download: true,
      header: true,
      dynamicTyping: false, // we'll coerce ourselves
      skipEmptyLines: true,
              complete: (res) => {
                if (!alive) return;
                console.log("CSV parse complete:", res);
                if (res.errors?.length) {
                  console.error("CSV parse errors:", res.errors);
                }
                const recs = (res.data as any[]).filter(Boolean);
                console.log("Filtered records:", recs.length);
                if (recs.length === 0) {
                  setRows([]);
                  setColumns([]);
                  setLoading(false);
                  return;
                }
        // Coerce numbers (all except 'Time')
        const out = recs.map((r) => {
          const o: Row = {};
          for (const k of Object.keys(r)) {
            if (k === "Time") {
              o[k] = String(r[k]).trim();
            } else {
              const raw = String(r[k] ?? "").replace(/,/g, "").trim();
              const n = Number(raw);
              o[k] = Number.isFinite(n) ? n : NaN;
            }
          }
          return o;
        });
                setRows(out);
                setColumns(Object.keys(out[0] || {}).filter((c) => c !== "Time"));
                setLoading(false);
                
                // Debug logging
                console.log(`[CSV] Loaded ${out.length} total rows, ${Object.keys(out[0] || {}).length} columns`);
                console.log(`[CSV] Columns:`, Object.keys(out[0] || {}));
                if (out.length > 0) {
                  const firstDay = new Date(String(out[0]["Time"])).toDateString();
                  const firstDayCount = out.filter(r => 
                    new Date(String(r["Time"])).toDateString() === firstDay
                  ).length;
                  console.log(`[CSV] Using first day data: ${firstDay} (${firstDayCount} rows)`);
                  console.log(`[CSV] First timestamp: ${out[0]["Time"]}`);
                  console.log(`[CSV] Last timestamp: ${out[out.length - 1]["Time"]}`);
                }
      },
      error: (e) => {
        if (!alive) return;
        console.error("CSV load error:", e);
        setError(String(e));
        setLoading(false);
      },
    });

    return () => { alive = false; };
  }, [src]);

  const byFeature = useMemo(() => {
    const m = new Map<string, DataPoint[]>();
    for (const c of columns) m.set(c, []);
    
    // Get only the first day of data
    const firstDay = rows.length > 0 ? new Date(String(rows[0]["Time"])).toDateString() : null;
    const firstDayRows = firstDay ? rows.filter(r => 
      new Date(String(r["Time"])).toDateString() === firstDay
    ) : rows;
    
    for (const r of firstDayRows) {
      const t = new Date(String(r["Time"])).toISOString();
      for (const c of columns) {
        const v = Number(r[c] as any);
        if (Number.isFinite(v)) m.get(c)!.push({ t, v });
      }
    }
    // Ensure ascending time order
    for (const [k, arr] of m) arr.sort((a, b) => +new Date(a.t) - +new Date(b.t));
    return m;
  }, [rows, columns]);

  const latestISO = useMemo(() => {
    let latest: string | null = null;
    for (const arr of byFeature.values()) {
      if (arr.length) {
        const t = arr[arr.length - 1].t;
        if (!latest || new Date(t) > new Date(latest)) latest = t;
      }
    }
    return latest ?? null;
  }, [byFeature]);

  return { rows, columns, byFeature, loading, error, latestISO };
}
