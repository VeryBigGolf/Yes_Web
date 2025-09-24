export type RangeKey = "15m" | "1h" | "8h" | "24h" | "all";

export function minutesForRange(r: RangeKey): number | "all" {
  switch (r) {
    case "15m": return 15;
    case "1h":  return 60;
    case "8h":  return 480;
    case "24h": return 1440;
    default:    return "all";
  }
}

/**
 * Slice a series by a time window counting back from `anchorISO`.
 * If result is empty and `fallbackISO` provided, slice again using it.
 * Uses native Date math (no dayjs plugins needed).
 */
export function sliceByRange<T extends { t: string }>(
  series: T[],
  range: RangeKey,
  anchorISO: string,
  fallbackISO?: string
): { data: T[]; anchorUsed: string; usedFallback: boolean } {
  if (range === "all") return { data: series, anchorUsed: anchorISO, usedFallback: false };

  const mins = minutesForRange(range);
  if (mins === "all") return { data: series, anchorUsed: anchorISO, usedFallback: false };

  function windowSlice(anchorStr: string) {
    const anchorMs = Date.parse(anchorStr);
    const fromMs = anchorMs - mins * 60_000;
    return series.filter(p => {
      const tMs = Date.parse(p.t);
      return Number.isFinite(tMs) && tMs > fromMs && tMs <= anchorMs;
    });
  }

  let sliced = windowSlice(anchorISO);
  if (sliced.length === 0 && fallbackISO) {
    sliced = windowSlice(fallbackISO);
    return { data: sliced, anchorUsed: fallbackISO, usedFallback: true };
  }
  return { data: sliced, anchorUsed: anchorISO, usedFallback: false };
}

/** Simple stats for a numeric series */
export function statsOf(series: Array<{ v: number }>) {
  if (!series.length) return { min: null, max: null, mean: null, latest: null };
  let min = Infinity, max = -Infinity, sum = 0;
  for (const p of series) {
    const v = p.v;
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }
  const mean = sum / series.length;
  const latest = series[series.length - 1]?.v ?? null;
  return { min, max, mean, latest };
}
