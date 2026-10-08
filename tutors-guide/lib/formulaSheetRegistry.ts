// lib/formulaSheetRegistry.ts

export interface ReferenceSheetData {
  id: string;
  title: string;
  subtitle?: string;
  content: string; // Markdown content with LaTeX
}

export const SAT_FORMULA_SHEET: ReferenceSheetData = {
  id: "sat-standard",
  title: "Digital SAT Reference Sheet",
  subtitle: "Reference information for use in all math modules.",
  content: `
### Geometric & Algebraic Formulas

* **Area of a Circle:** $A = \\pi r^2$
* **Circumference of a Circle:** $C = 2\\pi r$
* **Area of a Rectangle:** $A = \\ell w$
* **Area of a Triangle:** $A = \\frac{1}{2} b h$
* **Pythagorean Theorem:** $a^2 + b^2 = c^2$
* **Special Right Triangles:**
  * $30^\\circ - 60^\\circ - 90^\\circ$: side ratios $x : x\\sqrt{3} : 2x$
  * $45^\\circ - 45^\\circ - 90^\\circ$: side ratios $s : s : s\\sqrt{2}$
* **Volume of a Rectangular Prism:** $V = \\ell w h$
* **Volume of a Cylinder:** $V = \\pi r^2 h$
* **Volume of a Sphere:** $V = \\frac{4}{3} \\pi r^3$
* **Volume of a Cone:** $V = \\frac{1}{3} \\pi r^2 h$
* **Volume of a Pyramid:** $V = \\frac{1}{3} B h$

---

### Arc & Degree Reference
* The number of degrees of arc in a circle is $360^\\circ$.
* The number of radians of arc in a circle is $2\\pi$.
* The sum of the measures in degrees of the angles of a triangle is $180^\\circ$.
`,
};

export const AP_CALCULUS_SHEET: ReferenceSheetData = {
  id: "ap-calc",
  title: "AP Calculus Reference Sheet",
  subtitle: "Important algebraic and calculus relations.",
  content: `
### Essential Differentiation Rules
* **Power Rule:** $\\frac{d}{dx}[x^n] = n x^{n-1}$
* **Product Rule:** $\\frac{d}{dx}[u \\cdot v] = u'v + uv'$
* **Quotient Rule:** $\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}$
* **Chain Rule:** $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$

---

### Trigonometric Derivatives
* $\\frac{d}{dx}[\\sin x] = \\cos x$
* $\\frac{d}{dx}[\\cos x] = -\\sin x$
* $\\frac{d}{dx}[\\tan x] = \\sec^2 x$

---

### Fundamental Theorem of Calculus
* If $f$ is continuous on $[a, b]$, and $F' = f$, then:
$$\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)$$
* $\\frac{d}{dx}\\left[\\int_{a}^{x} f(t)\\,dt\\right] = f(x)$
`,
};

// Extensible registry map
export const FORMULA_SHEETS: Record<string, ReferenceSheetData> = {
  "sat-standard": SAT_FORMULA_SHEET,
  "ap-calc": AP_CALCULUS_SHEET,
};

export function getFormulaSheet(sheetId?: string): ReferenceSheetData | null {
  if (!sheetId) return null;
  return FORMULA_SHEETS[sheetId] || null;
}