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
  - id: "ap-calc-frq-q3"
    questionNumber: 3
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Integration and Accumulation of Change"
    skill: "Fundamental Theorem of Calculus, Accumulation Functions, and L'Hôpital's Rule"
    difficulty: "Medium"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q3.svg)

      The function $g$ is defined on the closed interval $[-3, 6]$. The graph of $g$ consists of two linear pieces and a semicircle, as shown in the figure above. Let $f$ be the function defined by $f(x) = 2x + \displaystyle\int_{0}^{x} g(t)\,dt$.
    prompt: |
      **(a)** Find $f(5)$ and $f'(5)$.

      **(b)** Find the value of $x$ in the closed interval $[-3, 2]$ at which $f$ attains its maximum value. Justify your answer.

      **(c)** For each of $\lim\limits_{x \to 0^-} g'(x)$ and $\lim\limits_{x \to 0^+} g'(x)$, find the value or state that it does not exist.

      **(d)** Find $\lim\limits_{x \to -1} \dfrac{f(x) + \frac{5}{2}}{e^{4x + 4} - 1}$.
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
            description: "Justifies absolute maximum at $x = 2$: $f'(x) = 2 + g(x) > 0$ for all $x \\in (-3, 2)$ (or Candidates Test evaluating $f(-3) = -\\frac{21}{2}$, $f(0) = 0$, and $f(2) = 4 - \\pi$)"
            points: 1
            requiresJustification: true
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
      Analyze an **accumulation function** $f(x) = 2x + \displaystyle\int_{0}^{x} g(t)\,dt$ built from a piecewise linear and semicircular graph $g$ without a calculator: **(a)** evaluate $f(5)$ via signed geometric areas and $f'(5)$ via the Fundamental Theorem of Calculus, **(b)** locate and justify the absolute maximum of $f$ on $[-3, 2]$, **(c)** evaluate one-sided limits of $g'(x)$ at $x = 0$, and **(d)** evaluate a $\dfrac{0}{0}$ limit at $x = -1$ using L'Hôpital's Rule.

      :::tabs
      == tab: Solving the question with Calculus
      Because no calculator is allowed, compute all definite integrals of $g$ as **signed geometric areas** (semicircles, triangles, and trapezoids) and use the Fundamental Theorem of Calculus to write $f'(x) = 2 + g(x)$ cleanly before tackling parts **(a)** through **(d)**.

      :::derivation
      == step: Part (a) — Evaluate f(5) and f'(5) (2 Points)
      -- why: Split $\displaystyle\int_{0}^{5} g(t)\,dt$ at $t = 4$ into the lower semicircle of radius $2$ on $[0, 4]$ (signed area $-\dfrac{1}{2}\pi(2)^2 = -2\pi$) plus the triangle on $[4, 5]$ (base $1$, height $4$, area $\dfrac{1}{2}(1)(4) = 2$), then differentiate $f(x)$ via FTC Part 1 to find $f'(5)$.
      $$
      \begin{aligned}
      f(5) &= 2(5) + \int_{0}^{4} g(t)\,dt + \int_{4}^{5} g(t)\,dt \\[.4cm]
      &= 10 + {\color{#2563eb}{\left(-\frac{1}{2}\pi(2)^2\right)}} + {\color{#16a34a}{\frac{1}{2}(1)(4)}} \\[.4cm]
      &= 10 - {\color{#2563eb}{2\pi}} + {\color{#16a34a}{2}} = 12 - 2\pi \\[.5cm]
      f'(x) &= \frac{d}{dx}\left[2x + \int_{0}^{x} g(t)\,dt\right] = 2 + g(x) \\[.4cm]
      f'(5) &= 2 + g(5) = 2 + 2 = 4
      \end{aligned}
      $$

      == step: Part (b) — Find and Justify the Absolute Maximum of f on [-3, 2] (3 Points)
      -- why: Solve $f'(x) = 2 + g(x) = 0 \implies g(x) = -2$ on $[-3, 2]$ to find critical points ($x = -2$ and $x = 2$), notice that $g(x) > -2$ everywhere on $(-2, 2)$ so $f'(x) > 0$ on $(-2, 2)$, and compare the candidates $x = -3, -2, 2$ (or note $f'(x) \ge 0$ on $[-2, 2]$ and $f(-3) < f(2)$).
      $$
      \begin{aligned}
      f'(x) = 2 + g(x) &= 0 \implies g(x) = -2 \implies x = -2,\; x = 2 \\[.4cm]
      f(-3) &= 2(-3) + \int_{0}^{-3} g(t)\,dt = -6 - \int_{-3}^{0} g(t)\,dt = -6 - \left(-\frac{1}{2}(2)(2) + \frac{1}{2}(1)(1)\right) = -6 + \frac{3}{2} = -\frac{9}{2} \\[.4cm]
      f(-2) &= 2(-2) - \int_{-2}^{0} g(t)\,dt = -4 - \left(-\frac{1}{2}(2)(2) + \frac{1}{2}(1)(1)\right) = -4 + \frac{3}{2} = -\frac{5}{2} \\[.4cm]
      f(2) &= 2(2) + \int_{0}^{2} g(t)\,dt = 4 + {\color{#2563eb}{\left(-\frac{1}{4}\pi(2)^2\right)}} = 4 - \pi \approx 0.858
      \end{aligned}
      $$
      Because $f$ is continuous on $[-3, 2]$ and $4 - \pi > -\dfrac{5}{2} > -\dfrac{9}{2}$ (equivalently, $f'(x) = 2 + g(x) > 0$ on $(-2, 2)$ and $f(-3) < f(2)$), $f$ attains its maximum value on $[-3, 2]$ at $x = 2$.

      == step: Part (c) — Evaluate One-Sided Limits of g'(x) at x = 0 (2 Points)
      -- why: Read the constant slope of the line segment immediately to the left of $x = 0$ for $\lim\limits_{x \to 0^-} g'(x)$, and inspect the tangent slope of the lower semicircle $(x - 2)^2 + y^2 = 4$ ($y = -\sqrt{4 - (x - 2)^2}$) as $x \to 0^+$ for $\lim\limits_{x \to 0^+} g'(x)$.
      $$
      \begin{aligned}
      \lim_{x \to 0^-} g'(x) &= \text{slope of line segment on } (-3, 0) = \frac{0 - 3}{0 - (-3)} = -1 \\[.4cm]
      \lim_{x \to 0^+} g'(x) &= \lim_{x \to 0^+} \frac{x - 2}{\sqrt{4 - (x - 2)^2}} = -\infty \implies \text{does not exist}
      \end{aligned}
      $$
      As $x \to 0^+$, the semicircle approaches a **vertical tangent line** at $(0, 0)$, so $\lim\limits_{x \to 0^+} g'(x)$ does not exist.

      == step: Part (d) — Evaluate the Limit at x = -1 Using L'Hôpital's Rule (2 Points)
      -- why: First verify continuity of $f$ and $e^{4x+4} - 1$ at $x = -1$ and show both numerator and denominator approach $0$ (indeterminate form $\dfrac{0}{0}$), then apply L'Hôpital's Rule by differentiating top and bottom separately.
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
      * **Part (a) Common Pitfall — Forgetting the Leading $2x$ Term or Negative Sign Below the $x$-Axis:** Differentiating $f(x)$ as $g(x)$ instead of $2 + g(x)$ drops the derivative of $2x$, and treating the semicircle area on $[0, 4]$ as $+2\pi$ instead of $-2\pi$ ignores that $g(t) \le 0$ on $[0, 4]$.
      * **Part (b) Common Pitfall — Missing the Endpoint $x = 2$ or Incomplete Justification:** Saying only "$f'(2) = 0$" does not prove an **absolute** maximum on $[-3, 2]$; always compare all candidate values ($x = -3, -2, 2$) or show $f'(x) > 0$ across $(-2, 2)$ alongside $f(-3) < f(2)$.
      * **Part (c) Common Pitfall — Writing $0$ for the Right-Hand Tangent Slope:** Because the semicircle is horizontal at its bottom $(2, -2)$, students sometimes confuse $(0, 0)$ with $(2, -2)$; at $x = 0$, the semicircle enters $(0, 0)$ vertically, so $g'(x) \to -\infty$ and the limit does not exist.
      * **Part (d) Common Pitfall — Applying L'Hôpital's Rule Without Verifying $\dfrac{0}{0}$ or Forgetting the Chain Rule Factor $4$:** AP rubrics require explicitly showing $\lim\limits_{x \to -1}\left(f(x) + \frac{5}{2}\right) = 0$ and $\lim\limits_{x \to -1}(e^{4x+4} - 1) = 0$ before differentiating, and differentiating $e^{4x+4}$ gives $4e^{4x+4}$, not $e^{4x+4}$.
  - id: "ap-calc-frq-q4"
    questionNumber: 4
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Applications of Integration"
    skill: "Area Between Curves, Washer Volumes of Revolution, and Rate of Change"
    difficulty: "Medium"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q4.svg)

      Let $f$ be the function defined by $f(x) = \dfrac{8}{x^2 + 4}$ for $x \ge 0$. Let $R$ be the shaded region in the first quadrant bounded by the graph of $f$, the horizontal line $y = 1$, and the $y$-axis, as shown in the figure above.
    prompt: |
      **(a)** Find the area of $R$.

      **(b)** Write, but do not evaluate, an integral expression for the volume of the solid generated when $R$ is rotated about the horizontal line $y = -1$.

      **(c)** Let $h(x)$ be the vertical distance between the point $(x, f(x))$ and the horizontal line $y = 1$. Find the rate of change of $h(x)$ with respect to $x$ at $x = 4$.
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
      Analyze the first-quadrant region $R$ bounded by $f(x) = \dfrac{8}{x^2 + 4}$, $y = 1$, and $x = 0$ without a calculator across three parts: **(a)** compute the exact area of $R$ via an inverse-tangent antiderivative, **(b)** set up (without evaluating) a **washer method** volume integral around the horizontal axis $y = -1$, and **(c)** find the instantaneous rate of change $h'(4)$ of the vertical distance between $(x, f(x))$ and $y = 1$ at $x = 4$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section II, Part B is calculator-inactive, solve for the intersection $x = 2$ algebraically, use the standard inverse-tangent rule $\displaystyle\int \dfrac{1}{x^2 + a^2}\,dx = \dfrac{1}{a}\arctan\left(\dfrac{x}{a}\right) + C$ in part **(a)**, measure both radii carefully from $y = -1$ in part **(b)**, and note that at $x = 4 > 2$ the curve lies **below** $y = 1$ so vertical distance is $h(x) = 1 - f(x)$ in part **(c)**.

      :::derivation
      == step: Part (a) — Find the Intersection and Compute the Exact Area of R (3 Points)
      -- why: Set $f(x) = 1$ for $x \ge 0$ to find the right-hand limit $x = 2$, integrate $\text{top} - \text{bottom} = \dfrac{8}{x^2 + 4} - 1$ over $[0, 2]$, and apply $\displaystyle\int \dfrac{1}{x^2 + 2^2}\,dx = \dfrac{1}{2}\arctan\left(\dfrac{x}{2}\right)$.
      $$
      \begin{aligned}
      \frac{8}{x^2 + 4} = 1 \implies x^2 + 4 = 8 \implies x^2 = 4 &\implies x = {\color{#2563eb}{2}} \quad (\text{since } x \ge 0) \\[.4cm]
      \text{Area} = \int_{0}^{{\color{#2563eb}{2}}} \left(\frac{8}{x^2 + 4} - 1\right) dx &= \left[8 \cdot \frac{1}{2}\arctan\left(\frac{x}{2}\right) - x\right]_{0}^{2} \\[.4cm]
      &= \Bigl[4\arctan(1) - 2\Bigr] - \Bigl[4\arctan(0) - 0\Bigr] \\[.4cm]
      &= 4\left(\frac{\pi}{4}\right) - 2 - 0 = \pi - 2
      \end{aligned}
      $$

      == step: Part (b) — Set Up the Washer Volume Integral About y = -1 (3 Points)
      -- why: Measure perpendicular distances from the axis of revolution $y = -1$ to the outer boundary $y = f(x)$ and inner boundary $y = 1$, then assemble $V = \pi \displaystyle\int_{0}^{2} \Bigl(\bigl[R(x)\bigr]^2 - \bigl[r(x)\bigr]^2\Bigr)\,dx$.
      $$
      \begin{aligned}
      \text{Outer radius:} \quad R(x) &= f(x) - (-1) = {\color{#2563eb}{\frac{8}{x^2 + 4} + 1}} \\[.3cm]
      \text{Inner radius:} \quad r(x) &= 1 - (-1) = {\color{#16a34a}{2}} \\[.4cm]
      V &= \pi \int_{0}^{2} \left[\left({\color{#2563eb}{\frac{8}{x^2 + 4} + 1}}\right)^2 - {\color{#16a34a}{2}}^2\right] dx = \pi \int_{0}^{2} \left[\left(\frac{8}{x^2 + 4} + 1\right)^2 - 4\right] dx
      \end{aligned}
      $$

      == step: Part (c) — Find the Rate of Change of Vertical Distance h(x) at x = 4 (3 Points)
      -- why: Because $x = 4$ lies to the right of the intersection $x = 2$, $f(x) < 1$ near $x = 4$, so the positive vertical distance is $h(x) = |f(x) - 1| = 1 - f(x)$; differentiate $h(x) = 1 - 8(x^2 + 4)^{-1}$ using the Chain Rule and evaluate at $x = 4$.
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
      * **Part (a) Common Pitfall — Forgetting the $\dfrac{1}{a} = \dfrac{1}{2}$ Factor in $\displaystyle\int \dfrac{1}{x^2 + 4}\,dx$:** Integrating $\dfrac{8}{x^2 + 4}$ as $8\arctan\left(\dfrac{x}{2}\right)$ instead of $8 \cdot \dfrac{1}{2}\arctan\left(\dfrac{x}{2}\right) = 4\arctan\left(\dfrac{x}{2}\right)$ doubles the $\pi$ term to $2\pi - 2$.
      * **Part (b) Common Pitfall — Squaring the Difference $[R(x) - r(x)]^2$ or Shifting the Wrong Direction:** Washer cross-sectional area requires $\pi\bigl([R(x)]^2 - [r(x)]^2\bigr)$, **never** $\pi[R(x) - r(x)]^2$, and rotating around $y = -1$ **adds** $1$ unit to each radius ($R(x) = f(x) + 1$, $r(x) = 2$) rather than subtracting $1$.
      * **Part (c) Common Pitfall — Using $h(x) = f(x) - 1$ Instead of $1 - f(x)$ at $x = 4$:** At $x = 4$, $f(4) = \dfrac{8}{20} = \dfrac{2}{5} < 1$, so the curve is *below* $y = 1$ and pulling farther away from $y = 1$ as $x$ increases; writing $h(x) = f(x) - 1$ yields $-\dfrac{4}{25}$ instead of the positive rate of change of distance $\dfrac{4}{25}$.

  - id: "ap-calc-frq-q5"
    questionNumber: 5
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Differential Equations"
    skill: "Tangent Line Approximation, Qualitative Differential Equation Analysis, and Separation of Variables"
    difficulty: "Medium"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      ![](./assets/APCalcAB-T1-S2B-Q5.svg)

      During a thermal calibration test, the function $y = f(t)$ models the temperature of a sensor, in degrees Celsius ($^{\circ}\text{C}$), at time $t$ minutes. At the start of the test ($t = 0$), the temperature of the sensor is $4^{\circ}\text{C}$. The function $y = f(t)$ satisfies the differential equation $\dfrac{dy}{dt} = \dfrac{1}{20}(24 - y)$.
    prompt: |
      **(a)** Use the line tangent to the graph of $y = f(t)$ at $t = 0$ to approximate the temperature of the sensor at time $t = 5$ minutes.

      **(b)** Using the given differential equation, determine whether the graph of $f$ could resemble the graph shown above. Give a reason for your answer.

      **(c)** Find an expression for $y = f(t)$ by solving the differential equation $\dfrac{dy}{dt} = \dfrac{1}{20}(24 - y)$ with the initial condition $f(0) = 4$.

      **(d)** Determine whether the temperature of the sensor is changing at an increasing or a decreasing rate for $t > 0$. Explain your reasoning.
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
      - label: "D"
        points: 2
        rubricNotes: "1 pt for second derivative expression d^2y/dt^2 < 0; 1 pt for concluding decreasing rate with explanation."
        criteria:
          - id: "q5-d-deriv2"
            description: "Finds $\\frac{d^2y}{dt^2} = -\\frac{1}{20}\\frac{dy}{dt} = -\\frac{1}{400}(24 - y)$ (or $-e^{-t/20}$) and notes $\\frac{d^2y}{dt^2} < 0$"
            points: 1
          - id: "q5-d-explain"
            description: "Concludes the temperature is changing at a decreasing rate because $\\frac{d^2y}{dt^2} < 0$ (the rate of change $\\frac{dy}{dt}$ is decreasing)"
            points: 1
            requiresJustification: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Analyze a Newton's-law-of-heating differential equation $\dfrac{dy}{dt} = \dfrac{1}{20}(24 - y)$ with initial condition $(0, 4)$ without a calculator across four parts: **(a)** build a linear approximation at $t = 0$ to estimate $f(5)$, **(b)** use the second derivative $\dfrac{d^2y}{dt^2}$ to test whether the solution curve can match the S-shaped graph shown, **(c)** solve the separable differential equation explicitly for $y = f(t)$, and **(d)** determine whether the temperature is changing at an increasing or decreasing rate for $t > 0$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section II, Part B is calculator-inactive, solve all four parts analytically—remembering to differentiate implicitly with respect to $t$ when computing $\dfrac{d^2y}{dt^2}$ in parts **(b)** and **(d)**, and keeping track of the negative sign from $\displaystyle\int \dfrac{1}{24 - y}\,dy = -\ln|24 - y|$ in part **(c)**.

      :::derivation
      == step: Part (a) — Linear Approximation at t = 0 to Estimate f(5) (2 Points)
      -- why: Evaluate the slope $\left.\dfrac{dy}{dt}\right|_{(0, 4)}$ by plugging $y = 4$ into the differential equation, write the tangent line $y - 4 = m(t - 0)$, and substitute $t = 5$.
      $$
      \begin{aligned}
      \left.\frac{dy}{dt}\right|_{(0, 4)} &= \frac{1}{20}\bigl(24 - {\color{#2563eb}{4}}\bigr) = \frac{20}{20} = {\color{#2563eb}{1}} \\[.4cm]
      y &= {\color{#2563eb}{4}} + {\color{#2563eb}{1}}(t - 0) = 4 + t \\[.4cm]
      f(5) &\approx 4 + 5 = 9^{\circ}\text{C}
      \end{aligned}
      $$

      == step: Part (b) — Test Concavity via d²y/dt² Against the Given Graph (2 Points)
      -- why: Differentiate $\dfrac{dy}{dt} = \dfrac{1}{20}(24 - y)$ implicitly with respect to $t$ (using the Chain Rule $\dfrac{d}{dt}[y] = \dfrac{dy}{dt}$) to find the sign of $\dfrac{d^2y}{dt^2}$ for $y < 24$, and compare against the concavity of the shown curve.
      $$
      \begin{aligned}
      \frac{d^2y}{dt^2} &= \frac{d}{dt}\left[\frac{1}{20}(24 - y)\right] = -\frac{1}{20}{\color{#2563eb}{\frac{dy}{dt}}} \\[.4cm]
      &= -\frac{1}{20}\left[\frac{1}{20}(24 - y)\right] = {\color{#2563eb}{-\frac{1}{400}(24 - y)}}
      \end{aligned}
      $$
      For $4 \le y < 24$, we have $24 - y > 0$, so $\dfrac{d^2y}{dt^2} < 0$ everywhere—meaning the graph of $f$ must be **strictly concave down** for all $t > 0$. **No**, the graph of $f$ cannot resemble the figure shown, because the shown graph is concave up initially (and changes concavity at an inflection point).

      == step: Part (c) — Solve the Separable Differential Equation Explicitly for y = f(t) (3 Points)
      -- why: Separate variables by dividing by $(24 - y)$ and multiplying by $dt$, integrate both sides (noting the negative sign from $u = 24 - y \implies du = -dy$), apply $f(0) = 4$ to solve for the constant, and isolate $y$.
      $$
      \begin{aligned}
      \frac{1}{24 - y}\,dy &= \frac{1}{20}\,dt \\[.4cm]
      \int \frac{1}{24 - y}\,dy &= \int \frac{1}{20}\,dt \\[.4cm]
      -\ln|24 - y| &= \frac{t}{20} + C \\[.4cm]
      \text{At } (0, 4): \quad -\ln|24 - {\color{#2563eb}{4}}| &= \frac{{\color{#2563eb}{0}}}{20} + C \implies C = {\color{#2563eb}{-\ln(20)}} \\[.4cm]
      -\ln(24 - y) &= \frac{t}{20} - \ln(20) \quad (\text{since } 24 - y > 0 \text{ near } y = 4) \\[.4cm]
      \ln\left(\frac{24 - y}{20}\right) &= -\frac{t}{20} \implies 24 - y = 20e^{-t/20} \implies y = 24 - 20e^{-t/20}
      \end{aligned}
      $$

      == step: Part (d) — Determine Whether Temperature Changes at an Increasing or Decreasing Rate (2 Points)
      -- why: "The rate at which the temperature is changing" is $\dfrac{dy}{dt}$, so whether that rate is increasing or decreasing is governed by the sign of its derivative $\dfrac{d^2y}{dt^2}$ for $t > 0$.
      $$
      \begin{aligned}
      \frac{dy}{dt} &= \frac{d}{dt}\Bigl[24 - 20e^{-t/20}\Bigr] = e^{-t/20} > 0 \\[.4cm]
      \frac{d^2y}{dt^2} &= \frac{d}{dt}\Bigl[e^{-t/20}\Bigr] = {\color{#2563eb}{-\frac{1}{20}e^{-t/20} < 0}} \quad \text{for all } t > 0
      \end{aligned}
      $$
      Because $\dfrac{d^2y}{dt^2} < 0$ for all $t > 0$, the first derivative $\dfrac{dy}{dt}$ is strictly decreasing; therefore, the temperature of the sensor is changing at a **decreasing rate** for $t > 0$.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Part (a) Common Pitfall — Plugging $t = 0$ Instead of $y = 4$ into $\dfrac{dy}{dt}$:** Because the differential equation $\dfrac{dy}{dt} = \dfrac{1}{20}(24 - y)$ depends on $y$ (autonomous), you must substitute the initial output $y(0) = 4$, not $t = 0$.
      * **Part (b) Common Pitfall — Omitting $\dfrac{dy}{dt}$ When Differentiating Implicitly:** Differentiating $\dfrac{1}{20}(24 - y)$ with respect to $t$ yields $-\dfrac{1}{20}\dfrac{dy}{dt}$, **not** $-\dfrac{1}{20}$ (though both happen to be negative when $y < 24$, omitting $\dfrac{dy}{dt}$ loses the second-derivative rubric point).
      * **Part (c) Common Pitfall — Dropping the Negative Sign in $\displaystyle\int \dfrac{1}{24 - y}\,dy$:** Because the derivative of $24 - y$ is $-1$, integrating $\dfrac{1}{24 - y}$ produces $-\ln|24 - y|$; forgetting the minus sign leads to exponential blowup $y = 24 - 20e^{+t/20}$ instead of asymptotic approach $y = 24 - 20e^{-t/20}$.
      * **Part (d) Common Pitfall — Looking at $\dfrac{dy}{dt} > 0$ Instead of $\dfrac{d^2y}{dt^2} < 0$:** Knowing $\dfrac{dy}{dt} > 0$ tells you the *temperature* is increasing, whereas the question asks whether the temperature is *changing at an increasing or decreasing rate*—which requires the sign of $\dfrac{d^2y}{dt^2}$.

  - id: "ap-calc-frq-q6"
    questionNumber: 6
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "Implicit Differentiation, Second Derivative Concavity, and Mean Value Theorem"
    difficulty: "Hard"
    stimulus: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      Consider the curve given by the equation $3(x - y) = 4 + \sin y$. For all points on the curve, $\dfrac{3}{4} \le \dfrac{dy}{dx} \le \dfrac{3}{2}$.
    prompt: |
      **(a)** Show that $\dfrac{dy}{dx} = \dfrac{3}{3 + \cos y}$.

      **(b)** For $0 < y < \pi$, there is a point $P$ on the curve through which the line tangent to the curve has slope $1$. Find the coordinates of the point $P$.

      **(c)** Determine the concavity of the curve at points for which $0 < y < \pi$. Give a reason for your answer.

      **(d)** Let $y = f(x)$ be a function, defined implicitly by $3(x - y) = 4 + \sin y$, that is continuous on the closed interval $[3, 3.2]$ and differentiable on the open interval $(3, 3.2)$. Use the Mean Value Theorem on the interval $[3, 3.2]$ to show that $\dfrac{3}{20} \le f(3.2) - f(3) \le \dfrac{3}{10}$.
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
      Analyze an **implicitly defined curve** $3(x - y) = 4 + \sin y$ without a calculator across four classic AP Calculus AB tasks: **(a)** verify the first derivative $\dfrac{dy}{dx} = \dfrac{3}{3 + \cos y}$ via implicit differentiation, **(b)** locate the point $P(x, y)$ with $0 < y < \pi$ where the tangent slope equals $1$, **(c)** determine the curve's concavity on $0 < y < \pi$ using the implicit second derivative $\dfrac{d^2y}{dx^2}$, and **(d)** bound the increment $f(3.2) - f(3)$ by combining the **Mean Value Theorem** with the given derivative bounds $\dfrac{3}{4} \le \dfrac{dy}{dx} \le \dfrac{3}{2}$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section II, Part B is calculator-inactive, solve every part symbolically—taking special care in part **(c)** to apply the **Chain Rule** factor $\dfrac{dy}{dx}$ when differentiating a function of $y$ with respect to $x$, and in part **(d)** to explicitly state the continuity and differentiability hypotheses of the Mean Value Theorem.

      :::derivation
      == step: Part (a) — Verify dy/dx = 3 / (3 + cos y) via Implicit Differentiation (2 Points)
      -- why: Differentiate both sides of $3(x - y) = 4 + \sin y$ with respect to $x$, attaching $\dfrac{dy}{dx}$ every time you differentiate a $y$-term, then collect all $\dfrac{dy}{dx}$ terms on one side.
      $$
      \begin{aligned}
      \frac{d}{dx}\Bigl[3(x - y)\Bigr] &= \frac{d}{dx}\Bigl[4 + \sin y\Bigr] \\[.4cm]
      3\left(1 - {\color{#2563eb}{\frac{dy}{dx}}}\right) &= \cos y \cdot {\color{#2563eb}{\frac{dy}{dx}}} \\[.4cm]
      3 - 3{\color{#2563eb}{\frac{dy}{dx}}} &= \cos y \cdot {\color{#2563eb}{\frac{dy}{dx}}} \\[.4cm]
      3 &= (3 + \cos y){\color{#2563eb}{\frac{dy}{dx}}} \implies \frac{dy}{dx} = \frac{3}{3 + \cos y}
      \end{aligned}
      $$

      == step: Part (b) — Find the Coordinates of Point P Where Tangent Slope = 1 (2 Points)
      -- why: Set $\dfrac{dy}{dx} = 1$ to solve for $y \in (0, \pi)$ first, then substitute that $y$-value back into the original curve equation $3(x - y) = 4 + \sin y$ to solve for $x$.
      $$
      \begin{aligned}
      \frac{3}{3 + \cos y} = 1 \implies 3 + \cos y = 3 &\implies \cos y = {\color{#2563eb}{0}} \\[.3cm]
      \text{For } 0 < y < \pi: &\quad y = {\color{#2563eb}{\frac{\pi}{2}}} \\[.4cm]
      3\left(x - {\color{#2563eb}{\frac{\pi}{2}}}\right) &= 4 + \sin\left({\color{#2563eb}{\frac{\pi}{2}}}\right) = 4 + 1 = 5 \\[.4cm]
      x - \frac{\pi}{2} &= \frac{5}{3} \implies x = {\color{#2563eb}{\frac{5}{3} + \frac{\pi}{2}}}
      \end{aligned}
      $$
      Thus, the coordinates of point $P$ are $\left(\dfrac{5}{3} + \dfrac{\pi}{2},\, \dfrac{\pi}{2}\right)$.

      == step: Part (c) — Compute d²y/dx² and Determine Concavity for 0 < y < π (3 Points)
      -- why: Rewrite $\dfrac{dy}{dx} = 3(3 + \cos y)^{-1}$ and differentiate with respect to $x$ using the Chain Rule (remembering both $\dfrac{d}{dy}[\cos y] = -\sin y$ and the inner derivative $\dfrac{dy}{dx}$), then substitute $\dfrac{dy}{dx} = \dfrac{3}{3 + \cos y}$ and check the sign of numerator and denominator on $(0, \pi)$.
      $$
      \begin{aligned}
      \frac{d^2y}{dx^2} &= \frac{d}{dx}\Bigl[3(3 + \cos y)^{-1}\Bigr] \\[.4cm]
      &= -3(3 + \cos y)^{-2}(-\sin y) \cdot {\color{#2563eb}{\frac{dy}{dx}}} \\[.4cm]
      &= \frac{3\sin y}{(3 + \cos y)^2} \cdot {\color{#2563eb}{\frac{3}{3 + \cos y}}} = {\color{#2563eb}{\frac{9\sin y}{(3 + \cos y)^3}}}
      \end{aligned}
      $$
      For $0 < y < \pi$, we have $\sin y > 0$ and $\cos y \ge -1 \implies 3 + \cos y \ge 2 > 0$, so $(3 + \cos y)^3 > 0$. Therefore, $\dfrac{d^2y}{dx^2} > 0$, which means the curve is **concave up** for all points with $0 < y < \pi$.

      == step: Part (d) — Use the Mean Value Theorem on [3, 3.2] to Bound f(3.2) - f(3) (2 Points)
      -- why: Cite that $f$ is continuous on $[3, 3.2]$ and differentiable on $(3, 3.2)$ to guarantee a number $c \in (3, 3.2)$ where $f'(c) = \dfrac{f(3.2) - f(3)}{3.2 - 3}$, substitute into the given inequality $\dfrac{3}{4} \le f'(c) \le \dfrac{3}{2}$, and multiply through by $3.2 - 3 = 0.2 = \dfrac{1}{5}$.
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
      * **Part (a) Common Pitfall — Forgetting $\dfrac{dy}{dx}$ on the Left Side ($3(1 - y')$):** Differentiating $3(x - y)$ with respect to $x$ gives $3 - 3\dfrac{dy}{dx}$, not $3 - 3y$; missing the left-hand $\dfrac{dy}{dx}$ breaks the verification immediately.
      * **Part (b) Common Pitfall — Stopping After Finding $y = \dfrac{\pi}{2}$ or Reversing $(x, y)$:** Because $\dfrac{dy}{dx}$ depends only on $y$, setting $\dfrac{dy}{dx} = 1$ gives the **$y$-coordinate** $y = \dfrac{\pi}{2}$ first—remember to plug it back into $3(x - y) = 4 + \sin y$ to find $x = \dfrac{5}{3} + \dfrac{\pi}{2}$ and write $(x, y)$ in the proper order.
      * **Part (c) Common Pitfall — Omitting the Chain Rule $\dfrac{dy}{dx}$ in $\dfrac{d^2y}{dx^2}$:** Differentiating $\dfrac{3}{3 + \cos y}$ with respect to $x$ (not $y$) requires multiplying by $\dfrac{dy}{dx}$, producing $\dfrac{9\sin y}{(3 + \cos y)^3}$ rather than $\dfrac{3\sin y}{(3 + \cos y)^2}$.
      * **Part (d) Common Pitfall — Not Mentioning the Mean Value Theorem or Point $c \in (3, 3.2)$:** AP rubrics specifically look for invoking the Mean Value Theorem on $[3, 3.2]$ (noting continuity on $[3, 3.2]$ and differentiability on $(3, 3.2)$) to equate $\dfrac{f(3.2) - f(3)}{0.2}$ to $f'(c)$ before applying $\dfrac{3}{4} \le f'(c) \le \dfrac{3}{2}$.