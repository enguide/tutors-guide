// lib/scoring/mathEvaluator.ts

/**
 * Parses user-entered math input or answer keys (supporting integers, decimals,
 * fractions like "7/2" or "-3/4", numbers with commas like "1,200", and basic LaTeX).
 */
export function parseMathValue(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number") return isFinite(raw) ? raw : null;

  // 1. Clean whitespace, LaTeX math delimiters ($), and digit grouping commas
  const clean = String(raw).trim().replace(/\$/g, "").replace(/,/g, "").replace(/\s+/g, "");
  if (!clean) return null;

  // 2. Handle basic LaTeX \frac{a}{b} or \dfrac{a}{b}
  const latexFraction = clean.match(/^\\d?frac\{(-?\d+(?:\.\d+)?)\}\{([1-9]\d*(?:\.\d+)?)\}$/);
  if (latexFraction) {
    const num = parseFloat(latexFraction[1]);
    const den = parseFloat(latexFraction[2]);
    return den !== 0 ? num / den : null;
  }

  // 3. Match standard fractions: "a/b", "-a/b", or "a/-b"
  const fractionMatch = clean.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (fractionMatch) {
    const numerator = parseFloat(fractionMatch[1]);
    const denominator = parseFloat(fractionMatch[2]);
    if (denominator === 0 || isNaN(numerator) || isNaN(denominator)) return null;
    return numerator / denominator;
  }

  // 4. Standard float or integer
  const num = Number(clean);
  return isNaN(num) ? null : num;
}

/**
 * Checks equality between a student answer and a single target key.
 */
function evaluateSingleKey(
  responseType: "MC" | "FR",
  trimmedUser: string,
  targetKey: string
): boolean {
  const trimmedTarget = targetKey.trim();

  // Multiple Choice check (exact letter case-insensitive)
  if (responseType === "MC") {
    return trimmedUser.toUpperCase() === trimmedTarget.toUpperCase();
  }

  // Exact string match (ignoring case)
  if (trimmedUser.toLowerCase() === trimmedTarget.toLowerCase()) {
    return true;
  }

  // Numerical & fractional comparison with tolerance
  const studentVal = parseMathValue(trimmedUser);
  const correctVal = parseMathValue(trimmedTarget);

  if (studentVal !== null && correctVal !== null) {
    // 0.0001 precision threshold handles standard 3-4 decimal place SAT/AP rounding
    return Math.abs(studentVal - correctVal) < 0.0001;
  }

  return false;
}

/**
 * Evaluates whether a student's answer matches the official answer key.
 * - Supports raw number or string answer keys.
 * - Supports multiple valid keys separated by " | " or " OR " (e.g., "1/2 | 0.5").
 * - Handles equivalent fractions and float tolerance.
 */
export function evaluateAnswer(
  responseType: "MC" | "FR",
  userAnswer?: string | number | null,
  correctKey: string | number | null = ""
): boolean {
  if (userAnswer === null || userAnswer === undefined) return false;
  const trimmedUser = String(userAnswer).trim();
  if (!trimmedUser) return false;

  const rawKey = String(correctKey ?? "").trim();
  if (!rawKey) return false;

  // Support multiple accepted answers separated by " | " or " OR "
  const acceptableKeys = rawKey.includes(" | ")
    ? rawKey.split(" | ")
    : rawKey.includes(" OR ")
    ? rawKey.split(" OR ")
    : [rawKey];

  return acceptableKeys.some((key) => evaluateSingleKey(responseType, trimmedUser, key));
}