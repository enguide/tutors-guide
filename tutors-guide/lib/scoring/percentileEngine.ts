// lib/scoring/percentileEngine.ts
import { Category } from "@prisma/client";

export type PercentileTable = Record<number, string>;

// Official College Board Digital SAT Composite Percentiles
export const SAT_PERCENTILE_TABLE: PercentileTable = {
  1600: "99+", 1590: "99+", 1580: "99+", 1570: "99+", 1560: "99+", 1550: "99",
  1540: "99",  1530: "99",  1520: "98",  1510: "98",  1500: "98",  1490: "97",
  1480: "97",  1470: "97",  1460: "96",  1450: "96",  1440: "95",  1430: "95",
  1420: "94",  1410: "94",  1400: "93",  1390: "93",  1380: "92",  1370: "91",
  1360: "90",  1350: "89",  1340: "88",  1330: "87",  1320: "86",  1310: "85",
  1300: "84",  1290: "83",  1280: "82",  1270: "81",  1260: "79",  1250: "78",
  1240: "77",  1230: "75",  1220: "74",  1210: "72",  1200: "71",  1190: "69",
  1180: "67",  1170: "66",  1160: "64",  1150: "62",  1140: "60",  1130: "59",
  1120: "57",  1110: "55",  1100: "53",  1090: "51",  1080: "49",  1070: "47",
  1060: "45",  1050: "44",  1040: "42",  1030: "40",  1020: "38",  1010: "36",
  1000: "34",   950: "27",   900: "20",   850: "14",   800: "9",    750: "5",
   700: "3",    650: "1",    600: "1-",   400: "1-",
};

// Official ACT Composite National Ranks
export const ACT_PERCENTILE_TABLE: PercentileTable = {
  36: "99+", 35: "99+", 34: "99", 33: "98", 32: "96", 31: "95",
  30: "93",  29: "90",  28: "88", 27: "84", 26: "81", 25: "77",
  24: "73",  23: "68",  22: "63", 21: "57", 20: "50", 19: "44",
  18: "37",  17: "31",  16: "25", 15: "18", 14: "12", 13: "6",
  12: "3",   11: "1",    1: "1-",
};

// Official ETS GRE Combined (Verbal + Quant: 260-340)
export const GRE_PERCENTILE_TABLE: PercentileTable = {
  340: "99+", 335: "98", 330: "95", 325: "90", 320: "82",
  315: "72",  310: "60", 305: "47", 300: "34", 290: "15",
  280: "4",   260: "1-",
};

export const AP_GRADE_PERCENTILE_TABLE: PercentileTable = {
  5: "Extremely Well Qualified (Top 15–20%)",
  4: "Well Qualified",
  3: "Qualified",
  2: "Possibly Qualified",
  1: "No Recommendation",
};

export function lookupPercentile(
  category: Category | string,
  score: number,
  formOverrideTable?: PercentileTable
): string | null {
  // 1. Academic drills (e.g. Diff Eq, Linear Algebra) use percentage mastery, not percentiles
  const normalizedCategory = String(category).trim().toUpperCase();
  if (normalizedCategory === "ACADEMIC") {
    return null;
  }

  // 2. Form-specific override (if test author explicitly provided one)
  let table: PercentileTable | null = formOverrideTable || null;

  // 3. Fallback to centralized program-wide table
  if (!table) {
    if (normalizedCategory === "SAT") table = SAT_PERCENTILE_TABLE;
    else if (normalizedCategory === "ACT") table = ACT_PERCENTILE_TABLE;
    else if (normalizedCategory === "GRE") table = GRE_PERCENTILE_TABLE;
    else if (normalizedCategory.startsWith("AP")) table = AP_GRADE_PERCENTILE_TABLE;
  }

  if (!table) return null;

  // Direct match
  if (table[score] !== undefined) {
    return table[score];
  }

  // Descending threshold match (handles scores falling between defined steps)
  const scoreKeys = Object.keys(table)
    .map(Number)
    .sort((a, b) => b - a);

  for (const threshold of scoreKeys) {
    if (score >= threshold) {
      return table[threshold];
    }
  }

  return scoreKeys.length > 0 ? table[scoreKeys[scoreKeys.length - 1]] : null;
}