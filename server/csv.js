const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const dayjs = require("dayjs");

const CSV_CANDIDATES = [
  path.resolve(process.cwd(), "server/data/Boiler11_1.csv"),
  path.resolve(process.cwd(), "Boiler11_1.csv"),
];

let rows = [];
let columns = [];

function coerceNumber(x) {
  if (x === undefined || x === null) return NaN;
  const n = Number(String(x).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : NaN;
}

function loadCsv() {
  for (const p of CSV_CANDIDATES) {
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      const recs = parse(raw, { columns: true, skip_empty_lines: true });
      rows = recs.map((r) => {
        const out = {};
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
    };
  });
  columns = Object.keys(rows[0]);
  return { ok: false };
}

function getColumns() {
  return columns.filter((c) => c !== "Time");
}

function rangeToMinutes(r) {
  switch (r) {
    case "15m": return 15;
    case "1h": return 60;
    case "8h": return 480;
    case "24h": return 1440;
    default: return Infinity;
  }
}

function getSeries(feature, range = "1h") {
  const mins = rangeToMinutes(range);
  const cutoff = isFinite(mins) ? dayjs().subtract(mins, "minute") : null;

  let filteredRows = rows
    .filter((r) => r["Time"])
    .filter((r) => (cutoff ? dayjs(String(r["Time"])).isAfter(cutoff) : true));

  // If no data in the requested range, generate demo data
  if (filteredRows.length === 0 && cutoff) {
    const now = dayjs();
    const points = Math.min(mins, 60); // Max 60 points
    const interval = Math.max(1, Math.floor(mins / points));
    
    filteredRows = Array.from({ length: points }, (_, i) => {
      const t = now.subtract((points - 1 - i) * interval, "minute").toISOString();
      const baseValue = 50; // Base value for demo
      const variation = Math.sin(i / 10) * 10 + Math.cos(i / 7) * 5;
      return {
        Time: t,
        [feature]: baseValue + variation
      };
    });
  }

  return filteredRows
    .map((r) => ({
      t: new Date(String(r["Time"])).toISOString(),
      v: Number(r[feature]),
    }))
    .filter((p) => Number.isFinite(p.v));
}

module.exports = { loadCsv, getColumns, getSeries };
