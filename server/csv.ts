import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import dayjs from "dayjs";

export type Row = Record<string, string | number>;
export type SeriesPoint = { t: string; v: number };

const CSV_CANDIDATES = [
  path.resolve(process.cwd(), "server/data/Boiler11_1.csv"),
  path.resolve(process.cwd(), "Boiler11_1.csv"),
];

let rows: Row[] = [];
let columns: string[] = [];

function coerceNumber(x: string) {
  if (x === undefined || x === null) return NaN;
  const n = Number(String(x).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : NaN;
}

export function loadCsv(): { ok: boolean; path?: string } {
  for (const p of CSV_CANDIDATES) {
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      const recs = parse(raw, { columns: true, skip_empty_lines: true });
      rows = recs.map((r: any) => {
        const out: Row = {};
        for (const k of Object.keys(r)) {
          if (k === "Time") out[k] = r[k];
          else out[k] = coerceNumber(r[k]);
        }
        return out;
      });
      columns = Object.keys(rows[0] ?? {});
      return { ok: true, path: p };
    }
  }
  // demo data (fallback)
  const now = dayjs();
  rows = Array.from({ length: 60 }, (_, i) => {
    const t = now.subtract(59 - i, "minute").toISOString();
    return {
      Time: t,
      "MAIN STEAM PRESSURE": 50 + Math.sin(i / 6) * 5,
      "MAIN STEAM TEMPERATURE": 480 + Math.cos(i / 8) * 10,
      "TOTAL AIR FLOW ACTUAL": 60 + Math.sin(i / 7) * 8,
      "BOILER BANK GAS OUTLET OXYGEN": 3 + Math.cos(i / 9) * 0.5,
      "STACK TEMPERATOR": 160 + Math.sin(i / 5) * 6,
      "FURNACE PRESSURE BOILER 11": 0 + Math.cos(i / 10) * 2,
    } as Row;
  });
  columns = Object.keys(rows[0]);
  return { ok: false };
}

export function getColumns(): string[] {
  return columns.filter((c) => c !== "Time");
}

type RangeKey = "15m" | "1h" | "8h" | "24h" | "all";
function rangeToMinutes(r: string): number {
  switch (r) {
    case "15m": return 15;
    case "1h": return 60;
    case "8h": return 480;
    case "24h": return 1440;
    default: return Infinity;
  }
}

export function getSeries(feature: string, range: RangeKey = "1h"): SeriesPoint[] {
  const mins = rangeToMinutes(range);
  const cutoff = isFinite(mins) ? dayjs().subtract(mins, "minute") : null;

  return rows
    .filter((r) => r["Time"])
    .filter((r) => (cutoff ? dayjs(String(r["Time"])).isAfter(cutoff) : true))
    .map((r) => ({
      t: new Date(String(r["Time"])).toISOString(),
      v: Number(r[feature]),
    }))
    .filter((p) => Number.isFinite(p.v));
}