// lib/scoring/mathEvaluator.ts

/**
 * Parses user-entered math input (supporting fractions like "7/2" or "-3/4", 
 * decimals like ".5" or "0.5") into a reliable float representation.
 */
export function parseMathValue(raw: string): number | null {
  if (!raw) return null;
  const clean = raw.trim().replace(/\s+/g, "");

  // Match simple fraction "a/b" or "-a/b"
  const fractionMatch = clean.match(/^(-?\d+)\/(\d+)$/);
  if (fractionMatch) {
    const numerator = parseFloat(fractionMatch[1]);
    const denominator = parseFloat(fractionMatch[2]);
    if (denominator === 0) return null;
    return numerator / denominator;
  }

  // Match simple float/int
  const num = Number(clean);
  return isNaN(num) ? null : num;
}

/**
 * Evaluates whether a student's answer matches the official answer key.
 * - For MC: case-insensitive string equality.
 * - For FR: string match, equivalent fraction evaluation, or float tolerance (1e-4).
 */
export function evaluateAnswer(
  responseType: "MC" | "FR",
  userAnswer?: string | null,
  correctKey: string = ""
): boolean {
  if (!userAnswer || !userAnswer.trim()) return false;
  const trimmedUser = userAnswer.trim();
  const trimmedKey = correctKey.trim();

  // Multiple Choice check
  if (responseType === "MC") {
    return trimmedUser.toUpperCase() === trimmedKey.toUpperCase();
  }

  // Direct string equality for text-based FRQs
  if (trimmedUser.toLowerCase() === trimmedKey.toLowerCase()) {
    return true;
  }

  // Numerical & fractional comparison with tolerance
  const studentVal = parseMathValue(trimmedUser);
  const correctVal = parseMathValue(trimmedKey);

  if (studentVal !== null && correctVal !== null) {
    // 0.0001 precision threshold handles 3-4 decimal place rounding requirements
    return Math.abs(studentVal - correctVal) < 0.0001;
  }

  return false;
}