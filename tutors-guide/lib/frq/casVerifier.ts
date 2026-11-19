// lib/frq/casVerifier.ts

import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import "nerdamer/Calculus";
import "nerdamer/Solve";

export interface EquationStepCheck {
  rawStep: string;
  lhs: string;
  rhs: string;
  isAlgebraicallyValid: boolean | null; // null if non-numeric/prose equation
  note: string;
}

export interface CasVerificationSummary {
  finalAnswerMatchesKey: boolean | null;
  matchedCriterionIds: string[];
  mismatchedCriterionIds: string[];
  stepChecks: EquationStepCheck[];
  hasArithmeticSlip: boolean;
}

/**
 * Normalizes common LaTeX math constructs into CAS-parseable syntax.
 */
export function normalizeLatexToCas(latex: string): string {
  let s = latex
    .replace(/\$/g, "")
    .replace(/\\left|\\right/g, "")
    .replace(/\\cdot|\\times/g, "*")
    .replace(/\\div/g, "/")
    .replace(/\\pi\b/g, "pi")
    .replace(/\\theta\b/g, "theta")
    .replace(/\\infty\b/g, "Infinity")
    .replace(/\\ln\b/g, "log")
    .replace(/\\sin\b/g, "sin")
    .replace(/\\cos\b/g, "cos")
    .replace(/\\tan\b/g, "tan")
    .replace(/\\sec\b/g, "sec")
    .replace(/\\csc\b/g, "csc")
    .replace(/\\cot\b/g, "cot")
    .replace(/\\arcsin\b/g, "asin")
    .replace(/\\arccos\b/g, "acos")
    .replace(/\\arctan\b/g, "atan")
    .replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)")
    .replace(/\,dx|\,dt|\,du|\,dy/g, "")
    .trim();

  // Iteratively convert nested \frac{a}{b} -> ((a)/(b))
  let prev = "";
  while (prev !== s) {
    prev = s;
    s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "(($1)/($2))");
  }

  // Convert ^{exp} -> ^(exp)
  s = s.replace(/\^\{([^{}]+)\}/g, "^($1)");
  // Strip remaining curly braces
  s = s.replace(/[{}]/g, "");
  return s.trim();
}

/**
 * Checks whether two mathematical expressions are symbolically or numerically equivalent
 * (within AP Calculus 3-decimal-place rounding tolerance of 0.001 by default).
 */
export function areExpressionsEquivalent(
  studentLatex: string,
  expectedLatex: string,
  numericTolerance = 0.001
): boolean | null {
  try {
    const a = normalizeLatexToCas(studentLatex);
    const b = normalizeLatexToCas(expectedLatex);
    if (!a || !b) return null;

    // 1. Exact symbolic difference simplification: simplify((a) - (b)) === 0
    const diffExpr = nerdamer(`simplify((${a}) - (${b}))`);
    if (diffExpr.text() === "0") {
      return true;
    }

    // 2. Numeric evaluation comparison (supports AP 3-decimal rounding like 2.718 vs e)
    const valA = Number(nerdamer(a).evaluate().text("decimals"));
    const valB = Number(nerdamer(b).evaluate().text("decimals"));
    if (Number.isFinite(valA) && Number.isFinite(valB)) {
      return Math.abs(valA - valB) <= numericTolerance;
    }

    // 3. Multi-point random probing for univariate functions (e.g. antiderivatives with same variable)
    const varsA: string[] = nerdamer(a).variables();
    const varsB: string[] = nerdamer(b).variables();
    const allVars = Array.from(new Set([...varsA, ...varsB]));

    if (allVars.length === 1) {
      const v = allVars[0];
      const probePoints = [0.37, 1.13, 2.41];
      let validProbes = 0;

      for (const pt of probePoints) {
        const evalA = Number(
          nerdamer(a, { [v]: String(pt) }).evaluate().text("decimals")
        );
        const evalB = Number(
          nerdamer(b, { [v]: String(pt) }).evaluate().text("decimals")
        );
        if (Number.isFinite(evalA) && Number.isFinite(evalB)) {
          if (Math.abs(evalA - evalB) > numericTolerance) {
            return false;
          }
          validProbes++;
        }
      }
      if (validProbes >= 2) return true;
    }

    return false;
  } catch {
    return null;
  }
}

/**
 * Verifies a list of extracted equations ("LHS = RHS") and checks student expressions
 * against any expectedLatex criteria defined in the rubric.
 */
export function verifyStudentMathSteps(params: {
  extractedEquations: string[];
  finalExpression?: string;
  criteria?: Array<{
    id: string;
    expectedLatex?: string;
    numericTolerance?: number;
  }>;
}): CasVerificationSummary {
  const { extractedEquations, finalExpression, criteria = [] } = params;
  const stepChecks: EquationStepCheck[] = [];
  let hasArithmeticSlip = false;

  for (const eq of extractedEquations) {
    const parts = eq.split("=");
    if (parts.length < 2) continue;

    // Check adjacent pairs in chained equalities: A = B = C
    for (let i = 0; i < parts.length - 1; i++) {
      const lhs = parts[i].trim();
      const rhs = parts[i + 1].trim();
      if (!lhs || !rhs) continue;

      // Skip definition assignments like f'(x) = ... or u = ...
      const isFunctionDefinition = /^[a-zA-Z]['′]?\([a-zA-Z]\)$/.test(lhs) || /^[a-zA-Z]$/.test(lhs);
      if (isFunctionDefinition) {
        stepChecks.push({
          rawStep: `${lhs} = ${rhs}`,
          lhs,
          rhs,
          isAlgebraicallyValid: null,
          note: "Assignment / function definition",
        });
        continue;
      }

      const eqValid = areExpressionsEquivalent(lhs, rhs, 0.002);
      if (eqValid === false) {
        hasArithmeticSlip = true;
      }
      stepChecks.push({
        rawStep: `${lhs} = ${rhs}`,
        lhs,
        rhs,
        isAlgebraicallyValid: eqValid,
        note:
          eqValid === true
            ? "CAS verified equal"
            : eqValid === false
            ? "CAS flagged inequality / arithmetic slip"
            : "Symbolic/non-numeric step",
      });
    }
  }

  const matchedCriterionIds: string[] = [];
  const mismatchedCriterionIds: string[] = [];
  let finalAnswerMatchesKey: boolean | null = null;

  const candidatePool = [
    ...(finalExpression ? [finalExpression] : []),
    ...extractedEquations.flatMap((eq) =>
      eq.split("=").map((part) => part.trim()).filter(Boolean)
    ),
  ];

  for (const crit of criteria) {
    if (!crit.expectedLatex) continue;
    const tol = crit.numericTolerance ?? 0.001;

    let matched = false;
    let hadDecisiveComparison = false;

    for (const candidate of candidatePool) {
      const res = areExpressionsEquivalent(candidate, crit.expectedLatex, tol);
      if (res !== null) {
        hadDecisiveComparison = true;
        if (res === true) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      matchedCriterionIds.push(crit.id);
    } else if (hadDecisiveComparison) {
      mismatchedCriterionIds.push(crit.id);
    }
  }

  if (finalExpression) {
    const answerCriterion = [...criteria].reverse().find((c) => Boolean(c.expectedLatex));
    if (answerCriterion?.expectedLatex) {
      finalAnswerMatchesKey = areExpressionsEquivalent(
        finalExpression,
        answerCriterion.expectedLatex,
        answerCriterion.numericTolerance ?? 0.001
      );
    }
  }

  return {
    finalAnswerMatchesKey,
    matchedCriterionIds,
    mismatchedCriterionIds,
    stepChecks,
    hasArithmeticSlip,
  };
}