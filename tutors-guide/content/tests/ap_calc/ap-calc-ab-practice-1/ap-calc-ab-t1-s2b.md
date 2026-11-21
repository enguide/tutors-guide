---
sectionId: "ap-calc-ab-t1-s2b"
sectionTitle: "Section II, Part B (No Calculator)"
sectionOrder: 4
timeLimit: 3600
config:
  calculator: "none"
  hasFormulaSheet: false
  layout: "split-passage"
questions:
  # ===========================================================================
  # QUESTION 3 PARTS (A–D)
  # ===========================================================================
  - id: "ap-calc-frq-q3a"
    parentQuestionId: "ap-calc-frq-q3"
    parentQuestionNumber: 3
    subPartLabel: "A"
    points: 2
    questionNumber: 1
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Integration and Accumulation of Change"
    skill: "Evaluating Accumulation Functions via Geometric Area and FTC Part 1"
    difficulty: "Easy"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q3.svg)

      The function $g$ is defined on the closed interval $[-3, 6]$. The graph of $g$ consists of two linear pieces and a semicircle, as shown in the figure above. Let $f$ be the function defined by $f(x) = 2x + \displaystyle\int_{0}^{x} g(t)\,dt$.
    prompt: |
      **Question 3 — Part (a)** *(Write your response in the Question 3, Part A box on your answer sheet.)*

      Find $f(5)$ and $f'(5)$.
    subParts:
      - label: "A"
        points: 2
        rubricNotes: "1 pt for f(5) = 12 - 2π; 1 pt for f'(5) = 4."
        criteria:
          - id: "q3-a-f5"
            description: "Evaluates $f(5) = 2(5) + \\int_{0}^{4} g(t)\\,dt + \\int_{4}^{5} g(t)\\,dt = 10 - 2\\pi + 2 = 12 - 2\\pi$"
            points: 1
            expectedLatex: "12 - 2\\pi"
            numericTolerance: 0.001
          - id: "q3-a-fp5"
            description: "Computes $f'(5) = 2 + g(5) = 2 + 2 = 4$"
            points: 1
            expectedLatex: "4"
    explanation: |
      ### Takeoff: What were you asked to find?
      Evaluate $f(5)$ using signed geometric areas from the graph of $g$, and compute $f'(5)$ using the Fundamental Theorem of Calculus.

      :::tabs
      == tab: Solving the question with Calculus
      Split $\displaystyle\int_{0}^{5} g(t)\,dt$ at $t = 4$ into the lower semicircle of radius $2$ on $[0, 4]$ and the triangle on $[4, 5]$, then differentiate $f(x)$ via FTC Part 1.

      :::derivation
      == step: Part (a) — Evaluate f(5) and f'(5) (2 Points)
      -- why: Definite integrals represent signed area, and $\dfrac{d}{dx}\displaystyle\int_{0}^{x} g(t)\,dt = g(x)$.
      $$
      \begin{aligned}
      f(5) &= 2(5) + \int_{0}^{4} g(t)\,dt + \int_{4}^{5} g(t)\,dt \\[.4cm]
      &= 10 + {\color{#2563eb}{\left(-\frac{1}{2}\pi(2)^2\right)}} + {\color{#16a34a}{\frac{1}{2}(1)(4)}} \\[.4cm]
      &= 10 - {\color{#2563eb}{2\pi}} + {\color{#16a34a}{2}} = 12 - 2\pi \\[.5cm]
      f'(x) &= \frac{d}{dx}\left[2x + \int_{0}^{x} g(t)\,dt\right] = 2 + g(x) \\[.4cm]
      f'(5) &= 2 + g(5) = 2 + 2 = 4
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Forgetting the Leading $2x$ Term or Negative Sign Below the $x$-Axis:** Differentiating $f(x)$ as $g(x)$ instead of $2 + g(x)$ drops the derivative of $2x$, and treating the semicircle area on $[0, 4]$ as $+2\pi$ ignores that $g(t) \le 0$.

  - id: "ap-calc-frq-q3b"
    parentQuestionId: "ap-calc-frq-q3"
    parentQuestionNumber: 3
    subPartLabel: "B"
    points: 3
    questionNumber: 2
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Analytical Applications of Differentiation"
    skill: "Finding and Justifying Absolute Extrema of Accumulation Functions"
    difficulty: "Medium"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q3.svg)

      The function $g$ is defined on the closed interval $[-3, 6]$. The graph of $g$ consists of two linear pieces and a semicircle, as shown in the figure above. Let $f$ be the function defined by $f(x) = 2x + \displaystyle\int_{0}^{x} g(t)\,dt$.
    prompt: |
      **Question 3 — Part (b)** *(Write your response in the Question 3, Part B box on your answer sheet.)*

      Find the value of $x$ in the closed interval $[-3, 2]$ at which $f$ attains its maximum value. Justify your answer.
    subParts:
      - label: "B"
        points: 3
        rubricNotes: "1 pt for f'(x) = 2 + g(x); 1 pt for identifying x = 2; 1 pt for justification on [-3, 2]."
        criteria:
          - id: "q3-b-deriv"
            description: "Identifies derivative $f'(x) = 2 + g(x)$"
            points: 1
          - id: "q3-b-cand"
            description: "Identifies $x = 2$ as the location of the absolute maximum on $[-3, 2]$"
            points: 1
            expectedLatex: "2"
          - id: "q3-b-just"
            description: "Justifies absolute maximum at $x = 2$: $f'(x) = 2 + g(x) > 0$ for all $x \\in (-3, 2)$ (or Candidates Test evaluating $f(-3)$, $f(-2)$, and $f(2) = 4 - \\pi$)"
            points: 1
            requiresJustification: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Locate and justify the absolute maximum value of $f$ on the closed interval $[-3, 2]$.

      :::tabs
      == tab: Solving the question with Calculus
      Solve $f'(x) = 2 + g(x) = 0 \implies g(x) = -2$ on $[-3, 2]$ to find critical points ($x = -2$ and $x = 2$), and apply the Candidates Test on $[-3, 2]$.

      :::derivation
      == step: Part (b) — Find and Justify the Absolute Maximum of f on [-3, 2] (3 Points)
      -- why: Continuous functions on closed intervals attain absolute extrema at critical points or endpoints.
      $$
      \begin{aligned}
      f'(x) = 2 + g(x) &= 0 \implies g(x) = -2 \implies x = -2,\; x = 2 \\[.4cm]
      f(-3) &= 2(-3) + \int_{0}^{-3} g(t)\,dt = -6 - \int_{-3}^{0} g(t)\,dt = -6 - \left(-\frac{1}{2}(2)(2) + \frac{1}{2}(1)(1)\right) = -\frac{9}{2} \\[.4cm]
      f(-2) &= 2(-2) - \int_{-2}^{0} g(t)\,dt = -4 - \left(-\frac{1}{2}(2)(2) + \frac{1}{2}(1)(1)\right) = -\frac{5}{2} \\[.4cm]
      f(2) &= 2(2) + \int_{0}^{2} g(t)\,dt = 4 + {\color{#2563eb}{\left(-\frac{1}{4}\pi(2)^2\right)}} = 4 - \pi \approx 0.858
      \end{aligned}
      $$
      Because $f$ is continuous on $[-3, 2]$ and $4 - \pi > -\dfrac{5}{2} > -\dfrac{9}{2}$, $f$ attains its maximum value on $[-3, 2]$ at $x = 2$.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Incomplete Justification:** Saying only "$f'(2) = 0$" does not prove an **absolute** maximum on $[-3, 2]$; always compare all candidate values ($x = -3, -2, 2$).

  - id: "ap-calc-frq-q3c"
    parentQuestionId: "ap-calc-frq-q3"
    parentQuestionNumber: 3
    subPartLabel: "C"
    points: 2
    questionNumber: 3
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Differentiation: Definition and Fundamental Properties"
    skill: "One-Sided Derivative Limits and Vertical Tangents from Graphs"
    difficulty: "Medium"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q3.svg)

      The function $g$ is defined on the closed interval $[-3, 6]$. The graph of $g$ consists of two linear pieces and a semicircle, as shown in the figure above. Let $f$ be the function defined by $f(x) = 2x + \displaystyle\int_{0}^{x} g(t)\,dt$.
    prompt: |
      **Question 3 — Part (c)** *(Write your response in the Question 3, Part C box on your answer sheet.)*

      For each of $\lim\limits_{x \to 0^-} g'(x)$ and $\lim\limits_{x \to 0^+} g'(x)$, find the value or state that it does not exist.
    subParts:
      - label: "C"
        points: 2
        rubricNotes: "1 pt for left-hand derivative limit -1; 1 pt for right-hand derivative limit does not exist."
        criteria:
          - id: "q3-c-left"
            description: "Evaluates left-hand derivative limit: $\\lim_{x \\to 0^-} g'(x) = -1$"
            points: 1
            expectedLatex: "-1"
          - id: "q3-c-right"
            description: "States that $\\lim_{x \\to 0^+} g'(x)$ does not exist (vertical tangent at $x = 0$ where $g'(x) \\to -\\infty$)"
            points: 1
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine the left-hand and right-hand limits of the derivative $g'(x)$ as $x$ approaches $0$.

      :::tabs
      == tab: Solving the question with Calculus
      Read the constant slope of the line segment on $(-3, 0)$ for $x \to 0^-$, and inspect the tangent slope of the semicircle at $(0, 0)$ for $x \to 0^+$.

      :::derivation
      == step: Part (c) — Evaluate One-Sided Limits of g'(x) at x = 0 (2 Points)
      -- why: One-sided derivative limits examine the slope behavior on each side of $x = 0$.
      $$
      \begin{aligned}
      \lim_{x \to 0^-} g'(x) &= \text{slope of line segment on } (-3, 0) = \frac{0 - 3}{0 - (-3)} = -1 \\[.4cm]
      \lim_{x \to 0^+} g'(x) &= \lim_{x \to 0^+} \frac{x - 2}{\sqrt{4 - (x - 2)^2}} = -\infty \implies \text{does not exist}
      \end{aligned}
      $$
      As $x \to 0^+$, the semicircle approaches a **vertical tangent line** at $(0, 0)$, so $\lim\limits_{x \to 0^+} g'(x)$ does not exist.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Writing $0$ for the Right-Hand Tangent Slope:** At $x = 0$, the semicircle enters $(0, 0)$ vertically, so $g'(x) \to -\infty$ and the limit does not exist.

  - id: "ap-calc-frq-q3d"
    parentQuestionId: "ap-calc-frq-q3"
    parentQuestionNumber: 3
    subPartLabel: "D"
    points: 2
    questionNumber: 4
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Contextual Applications of Differentiation"
    skill: "Evaluating Indeterminate Limits Using L'Hôpital's Rule"
    difficulty: "Medium"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q3.svg)

      The function $g$ is defined on the closed interval $[-3, 6]$. The graph of $g$ consists of two linear pieces and a semicircle, as shown in the figure above. Let $f$ be the function defined by $f(x) = 2x + \displaystyle\int_{0}^{x} g(t)\,dt$.
    prompt: |
      **Question 3 — Part (d)** *(Write your response in the Question 3, Part D box on your answer sheet.)*

      Find $\lim\limits_{x \to -1} \dfrac{f(x) + \frac{5}{2}}{e^{4x + 4} - 1}$.
    subParts:
      - label: "D"
        points: 2
        rubricNotes: "1 pt for showing 0/0 indeterminate form and applying L'Hôpital's Rule; 1 pt for value 3/4."
        criteria:
          - id: "q3-d-lhop"
            description: "Verifies $f(-1) = -2 - \\frac{1}{2} = -\\frac{5}{2}$ (indeterminate form $\\frac{0}{0}$) and applies L'Hôpital's Rule: $\\lim_{x \\to -1} \\frac{f'(x)}{4e^{4x+4}}$"
            points: 1
          - id: "q3-d-ans"
            description: "Evaluates limit: $\\frac{f'(-1)}{4} = \\frac{2 + g(-1)}{4} = \\frac{3}{4}$"
            points: 1
            expectedLatex: "\\frac{3}{4}"
            numericTolerance: 0.001
    explanation: |
      ### Takeoff: What were you asked to find?
      Evaluate the limit $\lim\limits_{x \to -1} \dfrac{f(x) + \frac{5}{2}}{e^{4x + 4} - 1}$ by verifying the $\dfrac{0}{0}$ indeterminate form and applying L'Hôpital's Rule.

      :::tabs
      == tab: Solving the question with Calculus
      Verify that both numerator and denominator approach $0$ as $x \to -1$, then differentiate numerator and denominator separately.

      :::derivation
      == step: Part (d) — Evaluate the Limit at x = -1 Using L'Hôpital's Rule (2 Points)
      -- why: Direct substitution yields $\dfrac{0}{0}$.
      $$
      \begin{aligned}
      f(-1) &= 2(-1) + \int_{0}^{-1} g(t)\,dt = -2 - \int_{-1}^{0} g(t)\,dt = -2 - {\color{#16a34a}{\frac{1}{2}(1)(1)}} = -\frac{5}{2} \\[.4cm]
      \lim_{x \to -1} \left(f(x) + \frac{5}{2}\right) &= -\frac{5}{2} + \frac{5}{2} = 0 \quad \text{and} \quad \lim_{x \to -1} \left(e^{4x + 4} - 1\right) = e^0 - 1 = 0 \\[.4cm]
      \lim_{x \to -1} \frac{f(x) + \frac{5}{2}}{e^{4x + 4} - 1} &\stackrel{\text{L'H}}{=} \lim_{x \to -1} \frac{f'(x)}{4e^{4x + 4}} = \frac{f'(-1)}{4e^0} = \frac{2 + g(-1)}{4} = \frac{2 + 1}{4} = \frac{3}{4}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Applying L'Hôpital's Rule Without Verifying $\dfrac{0}{0}$ or Forgetting the Chain Rule Factor $4$:** Always show numerator and denominator limits equal $0$ separately, and differentiate $e^{4x+4}$ as $4e^{4x+4}$.

  # ===========================================================================
  # QUESTION 4 PARTS (A–C)
  # ===========================================================================
  - id: "ap-calc-frq-q4a"
    parentQuestionId: "ap-calc-frq-q4"
    parentQuestionNumber: 4
    subPartLabel: "A"
    points: 3
    questionNumber: 5
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Applications of Integration"
    skill: "Finding the Area Between Curves Expressed as Functions of x"
    difficulty: "Medium"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q4.svg)

      Let $f$ be the function defined by $f(x) = \dfrac{8}{x^2 + 4}$ for $x \ge 0$. Let $R$ be the shaded region in the first quadrant bounded by the graph of $f$, the horizontal line $y = 1$, and the $y$-axis, as shown in the figure above.
    prompt: |
      **Question 4 — Part (a)** *(Write your response in the Question 4, Part A box on your answer sheet.)*

      Find the area of $R$.
    subParts:
      - label: "A"
        points: 3
        rubricNotes: "1 pt for integral with limits [0, 2]; 1 pt for antiderivative 4*arctan(x/2) - x; 1 pt for exact value π - 2."
        criteria:
          - id: "q4-a-integral"
            description: "Finds intersection $x = 2$ and sets up area integral: $\\int_{0}^{2} \\left(\\frac{8}{x^2 + 4} - 1\\right) dx$"
            points: 1
          - id: "q4-a-anti"
            description: "Finds antiderivative: $4\\arctan\\left(\\frac{x}{2}\\right) - x$"
            points: 1
            allowConsequentialCarryover: true
          - id: "q4-a-ans"
            description: "Evaluates exact area of $R$: $\\pi - 2$"
            points: 1
            expectedLatex: "\\pi - 2"
            numericTolerance: 0.001
            allowConsequentialCarryover: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the exact area of region $R$ bounded by $f(x) = \dfrac{8}{x^2 + 4}$, $y = 1$, and $x = 0$.

      :::tabs
      == tab: Solving the question with Calculus
      Solve $f(x) = 1$ for $x \ge 0$ to find the upper limit $x = 2$, integrate $\dfrac{8}{x^2 + 4} - 1$, and apply $\displaystyle\int \dfrac{1}{x^2 + a^2}\,dx = \dfrac{1}{a}\arctan\left(\dfrac{x}{a}\right)$.

      :::derivation
      == step: Part (a) — Find the Intersection and Compute the Exact Area of R (3 Points)
      -- why: Integrate top curve minus bottom curve across $[0, 2]$.
      $$
      \begin{aligned}
      \frac{8}{x^2 + 4} = 1 \implies x^2 + 4 = 8 \implies x^2 = 4 &\implies x = {\color{#2563eb}{2}} \quad (\text{since } x \ge 0) \\[.4cm]
      \text{Area} = \int_{0}^{{\color{#2563eb}{2}}} \left(\frac{8}{x^2 + 4} - 1\right) dx &= \left[8 \cdot \frac{1}{2}\arctan\left(\frac{x}{2}\right) - x\right]_{0}^{2} \\[.4cm]
      &= \Bigl[4\arctan(1) - 2\Bigr] - \Bigl[4\arctan(0) - 0\Bigr] \\[.4cm]
      &= 4\left(\frac{\pi}{4}\right) - 2 - 0 = \pi - 2
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Forgetting the $\dfrac{1}{a} = \dfrac{1}{2}$ Factor in $\displaystyle\int \dfrac{1}{x^2 + 4}\,dx$:** Integrating $\dfrac{8}{x^2 + 4}$ gives $4\arctan\left(\dfrac{x}{2}\right)$, not $8\arctan\left(\dfrac{x}{2}\right)$.

  - id: "ap-calc-frq-q4b"
    parentQuestionId: "ap-calc-frq-q4"
    parentQuestionNumber: 4
    subPartLabel: "B"
    points: 3
    questionNumber: 6
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Applications of Integration"
    skill: "Volumes with Washer Method: Revolving Around Other Axes"
    difficulty: "Medium"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q4.svg)

      Let $f$ be the function defined by $f(x) = \dfrac{8}{x^2 + 4}$ for $x \ge 0$. Let $R$ be the shaded region in the first quadrant bounded by the graph of $f$, the horizontal line $y = 1$, and the $y$-axis, as shown in the figure above.
    prompt: |
      **Question 4 — Part (b)** *(Write your response in the Question 4, Part B box on your answer sheet.)*

      Write, but do not evaluate, an integral expression for the volume of the solid generated when $R$ is rotated about the horizontal line $y = -1$.
    subParts:
      - label: "B"
        points: 3
        rubricNotes: "1 pt for outer and inner radii; 1 pt for washer integrand R(x)^2 - r(x)^2; 1 pt for π and limits [0, 2]."
        criteria:
          - id: "q4-b-radii"
            description: "Identifies outer radius $R(x) = \\frac{8}{x^2 + 4} + 1$ and inner radius $r(x) = 2$"
            points: 1
          - id: "q4-b-integrand"
            description: "Sets up washer difference of squares: $\\left(\\frac{8}{x^2 + 4} + 1\\right)^2 - 2^2$"
            points: 1
            allowConsequentialCarryover: true
          - id: "q4-b-complete"
            description: "Includes constant factor $\\pi$ and limits $[0, 2]$: $\\pi \\int_{0}^{2} \\left[\\left(\\frac{8}{x^2 + 4} + 1\\right)^2 - 4\\right] dx$"
            points: 1
            allowConsequentialCarryover: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Set up a washer-method volume integral when region $R$ is revolved around the horizontal line $y = -1$.

      :::tabs
      == tab: Solving the question with Calculus
      Measure perpendicular distances from $y = -1$ to the outer boundary $y = f(x)$ and inner boundary $y = 1$, then form $\pi \displaystyle\int_{0}^{2} \Bigl(\bigl[R(x)\bigr]^2 - \bigl[r(x)\bigr]^2\Bigr)\,dx$.

      :::derivation
      == step: Part (b) — Set Up the Washer Volume Integral About y = -1 (3 Points)
      -- why: Rotating around $y = -1$ shifts every vertical radius upward by $+1$ unit.
      $$
      \begin{aligned}
      \text{Outer radius:} \quad R(x) &= f(x) - (-1) = {\color{#2563eb}{\frac{8}{x^2 + 4} + 1}} \\[.3cm]
      \text{Inner radius:} \quad r(x) &= 1 - (-1) = {\color{#16a34a}{2}} \\[.4cm]
      V &= \pi \int_{0}^{2} \left[\left({\color{#2563eb}{\frac{8}{x^2 + 4} + 1}}\right)^2 - {\color{#16a34a}{2}}^2\right] dx = \pi \int_{0}^{2} \left[\left(\frac{8}{x^2 + 4} + 1\right)^2 - 4\right] dx
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Squaring the Difference $[R(x) - r(x)]^2$:** Washer cross-sectional area requires $\pi\bigl([R(x)]^2 - [r(x)]^2\bigr)$, never $\pi[R(x) - r(x)]^2$.

  - id: "ap-calc-frq-q4c"
    parentQuestionId: "ap-calc-frq-q4"
    parentQuestionNumber: 4
    subPartLabel: "C"
    points: 3
    questionNumber: 7
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "Differentiating Rational Functions with the Chain Rule"
    difficulty: "Medium"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q4.svg)

      Let $f$ be the function defined by $f(x) = \dfrac{8}{x^2 + 4}$ for $x \ge 0$. Let $R$ be the shaded region in the first quadrant bounded by the graph of $f$, the horizontal line $y = 1$, and the $y$-axis, as shown in the figure above.
    prompt: |
      **Question 4 — Part (c)** *(Write your response in the Question 4, Part C box on your answer sheet.)*

      Let $h(x)$ be the vertical distance between the point $(x, f(x))$ and the horizontal line $y = 1$. Find the rate of change of $h(x)$ with respect to $x$ at $x = 4$.
    subParts:
      - label: "C"
        points: 3
        rubricNotes: "1 pt for distance expression h(x) = 1 - f(x) for x > 2; 1 pt for derivative h'(x) = 16x/(x^2 + 4)^2; 1 pt for h'(4) = 4/25."
        criteria:
          - id: "q4-c-dist"
            description: "Expresses vertical distance for $x > 2$ (where $f(x) < 1$): $h(x) = 1 - \\frac{8}{x^2 + 4}$"
            points: 1
          - id: "q4-c-deriv"
            description: "Differentiates with respect to $x$: $h'(x) = \\frac{16x}{(x^2 + 4)^2}$"
            points: 1
            allowConsequentialCarryover: true
          - id: "q4-c-ans"
            description: "Evaluates at $x = 4$: $h'(4) = \\frac{64}{400} = \\frac{4}{25}$ (or $0.16$)"
            points: 1
            expectedLatex: "\\frac{4}{25}"
            numericTolerance: 0.001
            allowConsequentialCarryover: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the instantaneous rate of change $h'(4)$ of the vertical distance $h(x) = |f(x) - 1|$ at $x = 4$.

      :::tabs
      == tab: Solving the question with Calculus
      Because $x = 4 > 2$, $f(x) < 1$ near $x = 4$, so $h(x) = 1 - f(x)$.

      :::derivation
      == step: Part (c) — Find the Rate of Change of Vertical Distance h(x) at x = 4 (3 Points)
      -- why: Express $h(x)$ without absolute value for $x > 2$ and differentiate via the Chain Rule.
      $$
      \begin{aligned}
      \text{For } x > 2: \quad h(x) &= 1 - f(x) = 1 - 8(x^2 + 4)^{-1} \\[.4cm]
      h'(x) &= 0 - 8(-1)(x^2 + 4)^{-2}(2x) = {\color{#2563eb}{\frac{16x}{(x^2 + 4)^2}}} \\[.4cm]
      h'(4) &= \frac{16({\color{#2563eb}{4}})}{({\color{#2563eb}{4}}^2 + 4)^2} = \frac{64}{20^2} = \frac{64}{400} = \frac{4}{25}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Using $h(x) = f(x) - 1$ Instead of $1 - f(x)$ at $x = 4$:** At $x = 4$, $f(4) = \dfrac{2}{5} < 1$, so the curve lies below $y = 1$ and the distance between them is increasing at $+\dfrac{4}{25}$.

  # ===========================================================================
  # QUESTION 5 PARTS (A–D)
  # ===========================================================================
  - id: "ap-calc-frq-q5a"
    parentQuestionId: "ap-calc-frq-q5"
    parentQuestionNumber: 5
    subPartLabel: "A"
    points: 2
    questionNumber: 8
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Contextual Applications of Differentiation"
    skill: "Approximating Values of a Function Using Local Linearity and Linearization"
    difficulty: "Easy"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q5.svg)

      During a thermal calibration test, the function $y = f(t)$ models the temperature of a sensor, in degrees Celsius ($^{\circ}\text{C}$), at time $t$ minutes. At the start of the test ($t = 0$), the temperature of the sensor is $4^{\circ}\text{C}$. The function $y = f(t)$ satisfies the differential equation $\dfrac{dy}{dt} = \dfrac{1}{20}(24 - y)$.
    prompt: |
      **Question 5 — Part (a)** *(Write your response in the Question 5, Part A box on your answer sheet.)*

      Use the line tangent to the graph of $y = f(t)$ at $t = 0$ to approximate the temperature of the sensor at time $t = 5$ minutes.
    subParts:
      - label: "A"
        points: 2
        rubricNotes: "1 pt for slope dy/dt = 1 at t = 0 and tangent line equation; 1 pt for approximation 9."
        criteria:
          - id: "q5-a-tangent"
            description: "Finds slope $\\left.\\frac{dy}{dt}\\right|_{t=0} = \\frac{1}{20}(24 - 4) = 1$ and writes tangent line $y = 4 + t$"
            points: 1
          - id: "q5-a-approx"
            description: "Approximates temperature at $t = 5$: $f(5) \\approx 4 + 5 = 9^{\\circ}\\text{C}$"
            points: 1
            expectedLatex: "9"
            numericTolerance: 0.001
            allowConsequentialCarryover: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Construct the tangent line to $y = f(t)$ at $(0, 4)$ and evaluate it at $t = 5$.

      :::tabs
      == tab: Solving the question with Calculus
      Substitute $y(0) = 4$ into $\dfrac{dy}{dt} = \dfrac{1}{20}(24 - y)$ to find the slope $m = 1$, then evaluate $y = 4 + t$ at $t = 5$.

      :::derivation
      == step: Part (a) — Linear Approximation at t = 0 to Estimate f(5) (2 Points)
      -- why: Tangent line at $(t_0, y_0)$ is $y = y_0 + m(t - t_0)$.
      $$
      \begin{aligned}
      \left.\frac{dy}{dt}\right|_{(0, 4)} &= \frac{1}{20}\bigl(24 - {\color{#2563eb}{4}}\bigr) = \frac{20}{20} = {\color{#2563eb}{1}} \\[.4cm]
      y &= {\color{#2563eb}{4}} + {\color{#2563eb}{1}}(t - 0) = 4 + t \\[.4cm]
      f(5) &\approx 4 + 5 = 9^{\circ}\text{C}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Plugging $t = 0$ Instead of $y = 4$ into $\dfrac{dy}{dt}$:** Because the differential equation is autonomous, substitute $y(0) = 4$, not $t = 0$.

  - id: "ap-calc-frq-q5b"
    parentQuestionId: "ap-calc-frq-q5"
    parentQuestionNumber: 5
    subPartLabel: "B"
    points: 2
    questionNumber: 9
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Differential Equations"
    skill: "Reasoning Using Slope Fields and Second-Derivative Concavity"
    difficulty: "Medium"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q5.svg)

      During a thermal calibration test, the function $y = f(t)$ models the temperature of a sensor, in degrees Celsius ($^{\circ}\text{C}$), at time $t$ minutes. At the start of the test ($t = 0$), the temperature of the sensor is $4^{\circ}\text{C}$. The function $y = f(t)$ satisfies the differential equation $\dfrac{dy}{dt} = \dfrac{1}{20}(24 - y)$.
    prompt: |
      **Question 5 — Part (b)** *(Write your response in the Question 5, Part B box on your answer sheet.)*

      Using the given differential equation, determine whether the graph of $f$ could resemble the graph shown above. Give a reason for your answer.
    subParts:
      - label: "B"
        points: 2
        rubricNotes: "1 pt for computing second derivative sign (concave down); 1 pt for concluding No with concavity contradiction."
        criteria:
          - id: "q5-b-concavity"
            description: "Shows $\\frac{d^2y}{dt^2} = -\\frac{1}{20}\\frac{dy}{dt} = -\\frac{1}{400}(24 - y) < 0$ for $y < 24$, so the graph of $f$ must be strictly concave down"
            points: 1
          - id: "q5-b-reason"
            description: "Concludes No, the graph of $f$ cannot resemble the figure because the shown graph is concave up initially (has an inflection point)"
            points: 1
            requiresJustification: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Use the second derivative $\dfrac{d^2y}{dt^2}$ derived from the differential equation to determine whether the curve shown in the figure could be the graph of $f$.

      :::tabs
      == tab: Solving the question with Calculus
      Differentiate $\dfrac{dy}{dt} = \dfrac{1}{20}(24 - y)$ implicitly with respect to $t$ to determine concavity for $y < 24$.

      :::derivation
      == step: Part (b) — Test Concavity via d²y/dt² Against the Given Graph (2 Points)
      -- why: Differentiating with respect to $t$ requires the Chain Rule factor $\dfrac{dy}{dt}$.
      $$
      \begin{aligned}
      \frac{d^2y}{dt^2} &= \frac{d}{dt}\left[\frac{1}{20}(24 - y)\right] = -\frac{1}{20}{\color{#2563eb}{\frac{dy}{dt}}} \\[.4cm]
      &= -\frac{1}{20}\left[\frac{1}{20}(24 - y)\right] = {\color{#2563eb}{-\frac{1}{400}(24 - y)}}
      \end{aligned}
      $$
      For $4 \le y < 24$, $24 - y > 0 \implies \dfrac{d^2y}{dt^2} < 0$, so $f$ is strictly concave down. **No**, the graph of $f$ cannot resemble the figure shown, because the shown graph is concave up initially (has an inflection point).
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Omitting $\dfrac{dy}{dt}$ When Differentiating Implicitly:** Always include $\dfrac{dy}{dt}$ when differentiating $y$ with respect to $t$.

  - id: "ap-calc-frq-q5c"
    parentQuestionId: "ap-calc-frq-q5"
    parentQuestionNumber: 5
    subPartLabel: "C"
    points: 3
    questionNumber: 10
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Differential Equations"
    skill: "Finding Particular Solutions Using Separation of Variables"
    difficulty: "Medium"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q5.svg)

      During a thermal calibration test, the function $y = f(t)$ models the temperature of a sensor, in degrees Celsius ($^{\circ}\text{C}$), at time $t$ minutes. At the start of the test ($t = 0$), the temperature of the sensor is $4^{\circ}\text{C}$. The function $y = f(t)$ satisfies the differential equation $\dfrac{dy}{dt} = \dfrac{1}{20}(24 - y)$.
    prompt: |
      **Question 5 — Part (c)** *(Write your response in the Question 5, Part C box on your answer sheet.)*

      Find an expression for $y = f(t)$ by solving the differential equation $\dfrac{dy}{dt} = \dfrac{1}{20}(24 - y)$ with the initial condition $f(0) = 4$.
    subParts:
      - label: "C"
        points: 3
        rubricNotes: "1 pt for separation of variables; 1 pt for antiderivatives and initial condition C = -ln(20); 1 pt for y = 24 - 20e^(-t/20)."
        criteria:
          - id: "q5-c-sep"
            description: "Separates variables: $\\frac{1}{24 - y}\\,dy = \\frac{1}{20}\\,dt$"
            points: 1
          - id: "q5-c-anti"
            description: "Integrates both sides ($-\\ln|24 - y| = \\frac{t}{20} + C$) and uses $f(0) = 4$ to find $C = -\\ln(20)$"
            points: 1
            allowConsequentialCarryover: true
          - id: "q5-c-sol"
            description: "Solves explicitly for $y = f(t)$: $y = 24 - 20e^{-t/20}$"
            points: 1
            expectedLatex: "24 - 20e^{-t/20}"
            allowConsequentialCarryover: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Solve the separable initial-value problem $\dfrac{dy}{dt} = \dfrac{1}{20}(24 - y)$, $f(0) = 4$, explicitly for $y = f(t)$.

      :::tabs
      == tab: Solving the question with Calculus
      Separate variables, integrate both sides (keeping the negative sign from $u = 24 - y$), apply $f(0) = 4$, and solve for $y$.

      :::derivation
      == step: Part (c) — Solve the Separable Differential Equation Explicitly for y = f(t) (3 Points)
      -- why: Separate $y$ and $t$ variables before antidifferentiating.
      $$
      \begin{aligned}
      \frac{1}{24 - y}\,dy &= \frac{1}{20}\,dt \\[.4cm]
      -\ln|24 - y| &= \frac{t}{20} + C \\[.4cm]
      \text{At } (0, 4): \quad -\ln|24 - {\color{#2563eb}{4}}| &= \frac{{\color{#2563eb}{0}}}{20} + C \implies C = {\color{#2563eb}{-\ln(20)}} \\[.4cm]
      \ln\left(\frac{24 - y}{20}\right) &= -\frac{t}{20} \implies 24 - y = 20e^{-t/20} \implies y = 24 - 20e^{-t/20}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Dropping the Negative Sign in $\displaystyle\int \dfrac{1}{24 - y}\,dy$:** Integrating $\dfrac{1}{24 - y}$ yields $-\ln|24 - y|$.

  - id: "ap-calc-frq-q5d"
    parentQuestionId: "ap-calc-frq-q5"
    parentQuestionNumber: 5
    subPartLabel: "D"
    points: 2
    questionNumber: 11
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Analytical Applications of Differentiation"
    skill: "Using the Second Derivative to Analyze Rate of Change of a Rate"
    difficulty: "Medium"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q5.svg)

      During a thermal calibration test, the function $y = f(t)$ models the temperature of a sensor, in degrees Celsius ($^{\circ}\text{C}$), at time $t$ minutes. At the start of the test ($t = 0$), the temperature of the sensor is $4^{\circ}\text{C}$. The function $y = f(t)$ satisfies the differential equation $\dfrac{dy}{dt} = \dfrac{1}{20}(24 - y)$.
    prompt: |
      **Question 5 — Part (d)** *(Write your response in the Question 5, Part D box on your answer sheet.)*

      Determine whether the temperature of the sensor is changing at an increasing or a decreasing rate for $t > 0$. Explain your reasoning.
    subParts:
      - label: "D"
        points: 2
        rubricNotes: "1 pt for second derivative expression d^2y/dt^2 < 0; 1 pt for concluding decreasing rate with explanation."
        criteria:
          - id: "q5-d-deriv2"
            description: "Finds $\\frac{d^2y}{dt^2} = -\\frac{1}{20}\\frac{dy}{dt} = -\\frac{1}{400}(24 - y)$ (or $-\\frac{1}{20}e^{-t/20}$) and notes $\\frac{d^2y}{dt^2} < 0$"
            points: 1
          - id: "q5-d-explain"
            description: "Concludes the temperature is changing at a decreasing rate because $\\frac{d^2y}{dt^2} < 0$ (the rate of change $\\frac{dy}{dt}$ is decreasing)"
            points: 1
            requiresJustification: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine whether the rate of change $\dfrac{dy}{dt}$ is increasing or decreasing for $t > 0$.

      :::tabs
      == tab: Solving the question with Calculus
      Inspect the sign of $\dfrac{d^2y}{dt^2}$ for $t > 0$.

      :::derivation
      == step: Part (d) — Determine Whether Temperature Changes at an Increasing or Decreasing Rate (2 Points)
      -- why: A quantity's rate of change $\dfrac{dy}{dt}$ is decreasing when its derivative $\dfrac{d^2y}{dt^2}$ is negative.
      $$
      \begin{aligned}
      \frac{dy}{dt} &= \frac{d}{dt}\Bigl[24 - 20e^{-t/20}\Bigr] = e^{-t/20} > 0 \\[.4cm]
      \frac{d^2y}{dt^2} &= \frac{d}{dt}\Bigl[e^{-t/20}\Bigr] = {\color{#2563eb}{-\frac{1}{20}e^{-t/20} < 0}} \quad \text{for all } t > 0
      \end{aligned}
      $$
      Because $\dfrac{d^2y}{dt^2} < 0$ for all $t > 0$, the rate of change $\dfrac{dy}{dt}$ is decreasing; therefore, the temperature of the sensor is changing at a **decreasing rate** for $t > 0$.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Looking at $\dfrac{dy}{dt} > 0$ Instead of $\dfrac{d^2y}{dt^2} < 0$:** $\dfrac{dy}{dt} > 0$ shows the *temperature* is rising, whereas $\dfrac{d^2y}{dt^2} < 0$ shows the *rate* is decreasing.

  # ===========================================================================
  # QUESTION 6 PARTS (A–D)
  # ===========================================================================
  - id: "ap-calc-frq-q6a"
    parentQuestionId: "ap-calc-frq-q6"
    parentQuestionNumber: 6
    subPartLabel: "A"
    points: 2
    questionNumber: 12
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "Implicit Differentiation"
    difficulty: "Easy"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      Consider the curve given by the equation $3(x - y) = 4 + \sin y$. For all points on the curve, $\dfrac{3}{4} \le \dfrac{dy}{dx} \le \dfrac{3}{2}$.
    prompt: |
      **Question 6 — Part (a)** *(Write your response in the Question 6, Part A box on your answer sheet.)*

      Show that $\dfrac{dy}{dx} = \dfrac{3}{3 + \cos y}$.
    subParts:
      - label: "A"
        points: 2
        rubricNotes: "1 pt for implicit differentiation with respect to x; 1 pt for solving algebraically to 3/(3 + cos y)."
        criteria:
          - id: "q6-a-implicit"
            description: "Differentiates both sides implicitly with respect to $x$: $3\\left(1 - \\frac{dy}{dx}\\right) = \\cos y \\frac{dy}{dx}$"
            points: 1
          - id: "q6-a-solve"
            description: "Isolates $\\frac{dy}{dx}$ algebraically to show $\\frac{dy}{dx} = \\frac{3}{3 + \\cos y}$"
            points: 1
            expectedLatex: "\\frac{3}{3 + \\cos y}"
    explanation: |
      ### Takeoff: What were you asked to find?
      Verify via implicit differentiation that $\dfrac{dy}{dx} = \dfrac{3}{3 + \cos y}$.

      :::tabs
      == tab: Solving the question with Calculus
      Differentiate both sides of $3(x - y) = 4 + \sin y$ with respect to $x$ and isolate $\dfrac{dy}{dx}$.

      :::derivation
      == step: Part (a) — Verify dy/dx = 3 / (3 + cos y) via Implicit Differentiation (2 Points)
      -- why: Attach $\dfrac{dy}{dx}$ when differentiating $y$-terms with respect to $x$.
      $$
      \begin{aligned}
      \frac{d}{dx}\Bigl[3(x - y)\Bigr] &= \frac{d}{dx}\Bigl[4 + \sin y\Bigr] \\[.4cm]
      3\left(1 - {\color{#2563eb}{\frac{dy}{dx}}}\right) &= \cos y \cdot {\color{#2563eb}{\frac{dy}{dx}}} \\[.4cm]
      3 - 3{\color{#2563eb}{\frac{dy}{dx}}} &= \cos y \cdot {\color{#2563eb}{\frac{dy}{dx}}} \\[.4cm]
      3 &= (3 + \cos y){\color{#2563eb}{\frac{dy}{dx}}} \implies \frac{dy}{dx} = \frac{3}{3 + \cos y}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Forgetting $\dfrac{dy}{dx}$ on the Left Side ($3(1 - y')$):** Missing the left-hand $\dfrac{dy}{dx}$ prevents isolating the denominator $3 + \cos y$.

  - id: "ap-calc-frq-q6b"
    parentQuestionId: "ap-calc-frq-q6"
    parentQuestionNumber: 6
    subPartLabel: "B"
    points: 2
    questionNumber: 13
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "Finding Points on Implicit Curves with Given Tangent Slope"
    difficulty: "Medium"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      Consider the curve given by the equation $3(x - y) = 4 + \sin y$. For all points on the curve, $\dfrac{3}{4} \le \dfrac{dy}{dx} \le \dfrac{3}{2}$.
    prompt: |
      **Question 6 — Part (b)** *(Write your response in the Question 6, Part B box on your answer sheet.)*

      For $0 < y < \pi$, there is a point $P$ on the curve through which the line tangent to the curve has slope $1$. Find the coordinates of the point $P$.
    subParts:
      - label: "B"
        points: 2
        rubricNotes: "1 pt for setting dy/dx = 1 to find y = π/2; 1 pt for solving x = 5/3 + π/2."
        criteria:
          - id: "q6-b-yval"
            description: "Sets $\\frac{3}{3 + \\cos y} = 1 \\implies \\cos y = 0$, finding $y = \\frac{\\pi}{2}$ on $(0, \\pi)$"
            points: 1
            expectedLatex: "\\frac{\\pi}{2}"
          - id: "q6-b-xval"
            description: "Substitutes $y = \\frac{\\pi}{2}$ into $3(x - y) = 4 + \\sin y$ to find $x = \\frac{5}{3} + \\frac{\\pi}{2}$, giving $P\\left(\\frac{5}{3} + \\frac{\\pi}{2},\\, \\frac{\\pi}{2}\\right)$"
            points: 1
            expectedLatex: "\\frac{5}{3} + \\frac{\\pi}{2}"
            allowConsequentialCarryover: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the coordinates $(x, y)$ of the point $P$ with $0 < y < \pi$ where the tangent slope equals $1$.

      :::tabs
      == tab: Solving the question with Calculus
      Set $\dfrac{dy}{dx} = 1$ to solve for $y \in (0, \pi)$ first, then plug $y$ back into $3(x - y) = 4 + \sin y$.

      :::derivation
      == step: Part (b) — Find the Coordinates of Point P Where Tangent Slope = 1 (2 Points)
      -- why: Solve for $y$ from the slope condition, then solve for $x$ from the curve equation.
      $$
      \begin{aligned}
      \frac{3}{3 + \cos y} = 1 \implies 3 + \cos y = 3 &\implies \cos y = {\color{#2563eb}{0}} \\[.3cm]
      \text{For } 0 < y < \pi: &\quad y = {\color{#2563eb}{\frac{\pi}{2}}} \\[.4cm]
      3\left(x - {\color{#2563eb}{\frac{\pi}{2}}}\right) &= 4 + \sin\left({\color{#2563eb}{\frac{\pi}{2}}}\right) = 4 + 1 = 5 \\[.4cm]
      x - \frac{\pi}{2} &= \frac{5}{3} \implies x = {\color{#2563eb}{\frac{5}{3} + \frac{\pi}{2}}}
      \end{aligned}
      $$
      Thus, $P = \left(\dfrac{5}{3} + \dfrac{\pi}{2},\, \dfrac{\pi}{2}\right)$.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Stopping After Finding $y = \dfrac{\pi}{2}$ or Reversing $(x, y)$:** Remember to substitute $y = \dfrac{\pi}{2}$ into the original curve equation to solve for $x$.

  - id: "ap-calc-frq-q6c"
    parentQuestionId: "ap-calc-frq-q6"
    parentQuestionNumber: 6
    subPartLabel: "C"
    points: 3
    questionNumber: 14
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "Calculating Higher-Order Implicit Derivatives and Concavity"
    difficulty: "Hard"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      Consider the curve given by the equation $3(x - y) = 4 + \sin y$. For all points on the curve, $\dfrac{3}{4} \le \dfrac{dy}{dx} \le \dfrac{3}{2}$.
    prompt: |
      **Question 6 — Part (c)** *(Write your response in the Question 6, Part C box on your answer sheet.)*

      Determine the concavity of the curve at points for which $0 < y < \pi$. Give a reason for your answer.
    subParts:
      - label: "C"
        points: 3
        rubricNotes: "1 pt for Chain Rule differentiation in terms of dy/dx; 1 pt for substituting dy/dx to get 9*sin(y)/(3 + cos(y))^3; 1 pt for concluding concave up with reason."
        criteria:
          - id: "q6-c-chain"
            description: "Differentiates $\\frac{dy}{dx}$ with respect to $x$ using Chain Rule: $\\frac{d^2y}{dx^2} = \\frac{3\\sin y}{(3 + \\cos y)^2}\\frac{dy}{dx}$"
            points: 1
          - id: "q6-c-expr"
            description: "Substitutes $\\frac{dy}{dx} = \\frac{3}{3 + \\cos y}$ to obtain $\\frac{d^2y}{dx^2} = \\frac{9\\sin y}{(3 + \\cos y)^3}$"
            points: 1
            expectedLatex: "\\frac{9\\sin y}{(3 + \\cos y)^3}"
            allowConsequentialCarryover: true
          - id: "q6-c-concavity"
            description: "Concludes the curve is concave up for $0 < y < \\pi$ because $\\sin y > 0$ and $(3 + \\cos y)^3 > 0$, so $\\frac{d^2y}{dx^2} > 0$"
            points: 1
            requiresJustification: true
            allowConsequentialCarryover: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Compute the second derivative $\dfrac{d^2y}{dx^2}$ implicitly and determine the concavity of the curve for $0 < y < \pi$.

      :::tabs
      == tab: Solving the question with Calculus
      Differentiate $\dfrac{dy}{dx} = 3(3 + \cos y)^{-1}$ with respect to $x$ using the Chain Rule, substitute $\dfrac{dy}{dx} = \dfrac{3}{3 + \cos y}$, and evaluate the sign on $(0, \pi)$.

      :::derivation
      == step: Part (c) — Compute d²y/dx² and Determine Concavity for 0 < y < π (3 Points)
      -- why: Differentiating a function of $y$ with respect to $x$ requires multiplying by $\dfrac{dy}{dx}$.
      $$
      \begin{aligned}
      \frac{d^2y}{dx^2} &= \frac{d}{dx}\Bigl[3(3 + \cos y)^{-1}\Bigr] \\[.4cm]
      &= -3(3 + \cos y)^{-2}(-\sin y) \cdot {\color{#2563eb}{\frac{dy}{dx}}} \\[.4cm]
      &= \frac{3\sin y}{(3 + \cos y)^2} \cdot {\color{#2563eb}{\frac{3}{3 + \cos y}}} = {\color{#2563eb}{\frac{9\sin y}{(3 + \cos y)^3}}}
      \end{aligned}
      $$
      For $0 < y < \pi$, $\sin y > 0$ and $(3 + \cos y)^3 > 0$, so $\dfrac{d^2y}{dx^2} > 0$ and the curve is **concave up**.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Omitting the Chain Rule $\dfrac{dy}{dx}$ in $\dfrac{d^2y}{dx^2}$:** Always multiply by $\dfrac{dy}{dx}$ when differentiating $\cos y$ with respect to $x$.

  - id: "ap-calc-frq-q6d"
    parentQuestionId: "ap-calc-frq-q6"
    parentQuestionNumber: 6
    subPartLabel: "D"
    points: 2
    questionNumber: 15
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Analytical Applications of Differentiation"
    skill: "Using the Mean Value Theorem to Bound Function Increments"
    difficulty: "Hard"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      Consider the curve given by the equation $3(x - y) = 4 + \sin y$. For all points on the curve, $\dfrac{3}{4} \le \dfrac{dy}{dx} \le \dfrac{3}{2}$.
    prompt: |
      **Question 6 — Part (d)** *(Write your response in the Question 6, Part D box on your answer sheet.)*

      Let $y = f(x)$ be a function, defined implicitly by $3(x - y) = 4 + \sin y$, that is continuous on the closed interval $[3, 3.2]$ and differentiable on the open interval $(3, 3.2)$. Use the Mean Value Theorem on the interval $[3, 3.2]$ to show that $\dfrac{3}{20} \le f(3.2) - f(3) \le \dfrac{3}{10}$.
    subParts:
      - label: "D"
        points: 2
        rubricNotes: "1 pt for applying Mean Value Theorem on [3, 3.2] to express f'(c) = (f(3.2) - f(3))/0.2; 1 pt for bounding increment using 3/4 <= f'(c) <= 3/2."
        criteria:
          - id: "q6-d-mvt"
            description: "Invokes Mean Value Theorem on $[3, 3.2]$: there exists $c \\in (3, 3.2)$ such that $f'(c) = \\frac{f(3.2) - f(3)}{3.2 - 3} = \\frac{f(3.2) - f(3)}{0.2}$"
            points: 1
            requiresJustification: true
          - id: "q6-d-bound"
            description: "Applies $\\frac{3}{4} \\le f'(c) \\le \\frac{3}{2}$ and multiplies by $0.2 = \\frac{1}{5}$ to show $\\frac{3}{20} \\le f(3.2) - f(3) \\le \\frac{3}{10}$"
            points: 1
            requiresJustification: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Use the Mean Value Theorem on $[3, 3.2]$ alongside the derivative bounds $\dfrac{3}{4} \le \dfrac{dy}{dx} \le \dfrac{3}{2}$ to bound $f(3.2) - f(3)$.

      :::tabs
      == tab: Solving the question with Calculus
      Invoke the Mean Value Theorem on $[3, 3.2]$ to write $f'(c) = \dfrac{f(3.2) - f(3)}{0.2}$ for some $c \in (3, 3.2)$, then substitute into $\dfrac{3}{4} \le f'(c) \le \dfrac{3}{2}$.

      :::derivation
      == step: Part (d) — Use the Mean Value Theorem on [3, 3.2] to Bound f(3.2) - f(3) (2 Points)
      -- why: Continuity on $[3, 3.2]$ and differentiability on $(3, 3.2)$ guarantee a point $c \in (3, 3.2)$ where instantaneous slope equals average slope.
      $$
      \begin{aligned}
      \text{By MVT, } \exists\, c \in (3, 3.2) \text{ such that } f'(c) &= \frac{f(3.2) - f(3)}{3.2 - 3} = {\color{#2563eb}{\frac{f(3.2) - f(3)}{0.2}}} \\[.4cm]
      \frac{3}{4} \le {\color{#2563eb}{f'(c)}} &\le \frac{3}{2} \\[.4cm]
      \frac{3}{4} \le \frac{f(3.2) - f(3)}{0.2} &\le \frac{3}{2} \\[.4cm]
      \frac{3}{4}\left({\color{#2563eb}{\frac{1}{5}}}\right) \le f(3.2) - f(3) &\le \frac{3}{2}\left({\color{#2563eb}{\frac{1}{5}}}\right) \\[.4cm]
      \frac{3}{20} \le f(3.2) - f(3) &\le \frac{3}{10}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Not Mentioning the Mean Value Theorem or Point $c \in (3, 3.2)$:** AP rubrics require explicitly invoking the Mean Value Theorem to equate $\dfrac{f(3.2) - f(3)}{0.2}$ to $f'(c)$.