// lib/scoring/percentileEngine.ts
import { Category } from "@prisma/client";

export type PercentileTable = Record<number, string>;

export const DEFAULT_SAT_PERCENTILES: PercentileTable = {
  1600: "99+", 1550: "99", 1500: "98", 1450: "96", 1400: "93",
  1350: "89",  1300: "84", 1200: "74", 1100: "61", 1000: "45",
  900: "30",   800: "17",  700: "6",   600: "1",   400: "1-",
};

export const DEFAULT_ACT_PERCENTILES: PercentileTable = {
  36: "99+", 35: "99+", 34: "99", 33: "98", 32: "96", 31: "95",
  30: "93",  29: "90",  28: "88", 27: "84", 26: "81", 25: "77",
  24: "73",  23: "68",  22: "63", 21: "57", 20: "50", 19: "44",
  18: "37",  17: "31",  16: "25", 15: "18", 14: "12", 13: "6",
};

export const DEFAULT_AP_PERCENTILES: PercentileTable = {
  5: "Top 20%",
  4: "Top 40%",
  3: "Passing (Top 60%)",
  2: "Not Passing",
  1: "Not Passing",
};

export function lookupPercentile(
  category: Category | string,
  score: number,
  customTable?: PercentileTable
): string {
  const table = customTable || getCategoryDefaultTable(category);
  if (!table) return "";

  if (table[score] !== undefined) return table[score];

  const scoreKeys = Object.keys(table).map(Number).sort((a, b) => b - a);
  for (const s of scoreKeys) {
    if (score >= s) {
      return table[s];
    }
  }
  return scoreKeys.length > 0 ? table[scoreKeys[scoreKeys.length - 1]] : "";
}

function getCategoryDefaultTable(category: Category | string): PercentileTable | null {
  const cat = String(category).toUpperCase();
  if (cat === "SAT") return DEFAULT_SAT_PERCENTILES;
  if (cat === "ACT") return DEFAULT_ACT_PERCENTILES;
  if (cat === "AP_CALC") return DEFAULT_AP_PERCENTILES;
  return null;
}