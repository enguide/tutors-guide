---
sectionId: "ap-calc-ab-t1-s2b"
sectionTitle: "Section II, Part B (No Calculator)"
sectionOrder: 4
timeLimit: 3600
config:
  calculator: "none"
  hasFormulaSheet: false
  layout: "single"
questions:
  - id: "ap-calc-frq-q3"
    questionNumber: 3
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Differential Equations"
    skill: "Separable Differential Equations and Particular Solutions"
    difficulty: "Medium"
    prompt: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      Consider the differential equation $\dfrac{dy}{dx} = \dfrac{x(y - 1)}{2}$.

      ---

      **(a)** On the axes provided, sketch a slope field for the given differential equation at the nine points indicated.

      **(b)** Find $\dfrac{d^2y}{dx^2}$ in terms of $x$ and $y$. Determine the concavity of all solution curves in Quadrant II.

      **(c)** Find the particular solution $y = f(x)$ to the differential equation with the initial condition $f(0) = 3$.
    subParts:
      - label: "A"
        points: 2
        rubricNotes: "1 pt for zero slopes at $x = 0$ and $y = 1$; 1 pt for positive/negative signs and relative steepness at remaining points."
        criteria:
          - id: "q3-a-zero"
            description: "Draws horizontal (zero) slope segments along $x = 0$ and $y = 1$"
            points: 1
          - id: "q3-a-nonzero"
            description: "Draws accurate non-zero slope signs and relative steepness at remaining grid points"
            points: 1
      - label: "B"
        points: 3
        rubricNotes: "2 pts for implicit second derivative $\\frac{d^2y}{dx^2} = \\frac{(y-1)(2 + x^2)}{4}$; 1 pt for Quadrant II concavity justification."
        criteria:
          - id: "q3-b-deriv"
            description: "Applies Product Rule and Chain Rule: $\\frac{d^2y}{dx^2} = \\frac{1}{2}\\left[(y - 1) + x\\frac{dy}{dx}\\right]$"
            points: 1
          - id: "q3-b-expr"
            description: "Substitutes $\\frac{dy}{dx}$ in terms of $x$ and $y$: $\\frac{(y - 1)(2 + x^2)}{4}$"
            points: 1
            expectedLatex: "\\frac{(y - 1)(2 + x^2)}{4}"
          - id: "q3-b-concavity"
            description: "Concludes solution curves in Quadrant II ($x < 0, y > 0$) are concave up because $y - 1 > 0$ (for $y > 1$) or explains sign dependence at $y = 1$ ($\\frac{d^2y}{dx^2} > 0$ when $y > 1$, $< 0$ when $0 < y < 1$)"
            points: 1
            requiresJustification: true
            allowConsequentialCarryover: true
      - label: "C"
        points: 4
        rubricNotes: "1 pt separation of variables; 1 pt antiderivatives; 1 pt constant of integration using $f(0)=3$; 1 pt particular solution $y = 1 + 2e^{x^2/4}$."
        criteria:
          - id: "q3-c-sep"
            description: "Separates variables: $\\frac{1}{y - 1}\\,dy = \\frac{x}{2}\\,dx$"
            points: 1
          - id: "q3-c-anti"
            description: "Finds both antiderivatives: $\\ln|y - 1| = \\frac{x^2}{4} + C$"
            points: 1
            allowConsequentialCarryover: true
          - id: "q3-c-const"
            description: "Uses initial condition $f(0) = 3$ to find $C = \\ln 2$ (or $A = 2$)"
            points: 1
            allowConsequentialCarryover: true
          - id: "q3-c-sol"
            description: "Solves explicitly for particular solution: $y = 1 + 2e^{x^2/4}$"
            points: 1
            expectedLatex: "1 + 2e^{x^2/4}"
            allowConsequentialCarryover: true

  - id: "ap-calc-frq-q4"
    questionNumber: 4
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Integration and Accumulation of Change"
    skill: "Fundamental Theorem of Calculus and Accumulation Functions"
    difficulty: "Medium"
    prompt: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      The continuous function $g$ is defined on the closed interval $[-4, 6]$. The graph of $g$ consists of three line segments and a semicircle. Let $f(x) = 2 + \displaystyle\int_{0}^{x} g(t)\,dt$.

      ---

      **(a)** Find $f(4)$ and $f(-4)$.

      **(b)** Find all values of $x$ in the open interval $(-4, 6)$ at which $f$ has a relative minimum. Justify your answer.

      **(c)** On what open intervals contained in $(-4, 6)$ is the graph of $f$ both concave up and decreasing? Explain your reasoning.
    subParts:
      - label: "A"
        points: 3
        rubricNotes: "1 pt for using $f(x) = 2 + \\int_0^x g(t)\\,dt$ with limit reversal on $f(-4)$; 1 pt for $f(4)$; 1 pt for $f(-4)$."
        criteria:
          - id: "q4-a-setup"
            description: "Applies accumulation definition $f(4) = 2 + \\int_0^4 g(t)\\,dt$ and $f(-4) = 2 - \\int_{-4}^0 g(t)\\,dt$"
            points: 1
          - id: "q4-a-f4"
            description: "Correctly evaluates $f(4)$ from geometric areas under $g$"
            points: 1
          - id: "q4-a-fneg4"
            description: "Correctly evaluates $f(-4)$ from geometric areas under $g$"
            points: 1
      - label: "B"
        points: 3
        rubricNotes: "1 pt for identifying $f'(x) = g(x)$; 1 pt for locating relative minimum $x$-coordinate(s); 1 pt for sign-change justification."
        criteria:
          - id: "q4-b-deriv"
            description: "States Fundamental Theorem connection: $f'(x) = g(x)$"
            points: 1
          - id: "q4-b-cand"
            description: "Identifies interior critical point(s) where $g(x) = 0$"
            points: 1
          - id: "q4-b-just"
            description: "Justifies relative minimum via sign change of $f'(x) = g(x)$ from negative to positive"
            points: 1
            requiresJustification: true
      - label: "C"
        points: 3
        rubricNotes: "1 pt for connecting concave up to $f''(x) = g'(x) > 0$ ($g$ increasing); 1 pt for connecting decreasing to $f'(x) = g(x) < 0$; 1 pt for correct open intervals."
        criteria:
          - id: "q4-c-concavity"
            description: "Relates $f$ concave up to $f''(x) = g'(x) > 0$ ($g$ increasing)"
            points: 1
            requiresJustification: true
          - id: "q4-c-decreasing"
            description: "Relates $f$ decreasing to $f'(x) = g(x) < 0$ ($g$ below $x$-axis)"
            points: 1
            requiresJustification: true
          - id: "q4-c-intervals"
            description: "Identifies open subintervals where $g$ is both increasing and negative"
            points: 1

  - id: "ap-calc-frq-q5"
    questionNumber: 5
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Contextual Applications of Differentiation"
    skill: "Related Rates and Geometric Modeling"
    difficulty: "Hard"
    prompt: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      A cylindrical container with a radius of $10\text{ cm}$ contains liquid that is draining through a valve at the bottom. The height of the liquid in the container is $h$ centimeters, and the volume of liquid in the container is given by $V = \pi r^2 h = 100\pi h$.

      The height $h$ decreases at a rate modeled by $\dfrac{dh}{dt} = -\dfrac{1}{5}\sqrt{h}\text{ cm/sec}$, where $t$ is measured in seconds.

      ---

      **(a)** Find the rate of change of the volume of liquid with respect to time when $h = 25\text{ cm}$. Indicate units of measure.

      **(b)** Show that $\dfrac{d^2h}{dt^2} = \dfrac{1}{50}$.

      **(c)** At $t = 0$, the height of the liquid is $h = 36\text{ cm}$. Use separation of variables to find an expression for $h$ in terms of $t$.
    subParts:
      - label: "A"
        points: 3
        rubricNotes: "1 pt for $\\frac{dV}{dt} = 100\\pi \\frac{dh}{dt}$; 1 pt for $-100\\pi$; 1 pt for units ($\\text{cm}^3/\\text{sec}$)."
        criteria:
          - id: "q5-a-deriv"
            description: "Differentiates volume with respect to time: $\\frac{dV}{dt} = 100\\pi \\frac{dh}{dt}$"
            points: 1
          - id: "q5-a-value"
            description: "Evaluates at $h = 25$: $\\frac{dV}{dt} = 100\\pi\\left(-\\frac{1}{5}\\sqrt{25}\\right) = -100\\pi$"
            points: 1
            expectedLatex: "-100\\pi"
            numericTolerance: 0.001
          - id: "q5-a-units"
            description: "Indicates correct units: cubic centimeters per second ($\\text{cm}^3/\\text{sec}$)"
            points: 1
            requiredUnits: "cm^3/sec"
      - label: "B"
        points: 2
        rubricNotes: "1 pt for Chain Rule differentiation with respect to $t$; 1 pt for substituting $\\frac{dh}{dt}$ and simplifying to $\\frac{1}{50}$."
        criteria:
          - id: "q5-b-chain"
            description: "Differentiates $\\frac{dh}{dt} = -\\frac{1}{5}h^{1/2}$ with respect to $t$ using Chain Rule: $-\\frac{1}{10}h^{-1/2}\\frac{dh}{dt}$"
            points: 1
          - id: "q5-b-simplify"
            description: "Substitutes $\\frac{dh}{dt} = -\\frac{1}{5}\\sqrt{h}$ and simplifies algebraically to $\\frac{1}{50}$"
            points: 1
            expectedLatex: "\\frac{1}{50}"
      - label: "C"
        points: 4
        rubricNotes: "1 pt separation of variables; 1 pt antiderivatives $2\\sqrt{h} = -\\frac{1}{5}t + C$; 1 pt constant $C = 12$ from $h(0)=36$; 1 pt explicit solution $h = (6 - \\frac{t}{10})^2$."
        criteria:
          - id: "q5-c-sep"
            description: "Separates variables: $h^{-1/2}\\,dh = -\\frac{1}{5}\\,dt$"
            points: 1
          - id: "q5-c-anti"
            description: "Finds antiderivatives: $2\\sqrt{h} = -\\frac{1}{5}t + C$"
            points: 1
            allowConsequentialCarryover: true
          - id: "q5-c-const"
            description: "Applies initial condition $h(0) = 36$ to find $C = 12$"
            points: 1
            allowConsequentialCarryover: true
          - id: "q5-c-sol"
            description: "Solves explicitly for $h(t)$: $h = \\left(6 - \\frac{t}{10}\\right)^2$ (for $0 \\le t \\le 60$)"
            points: 1
            expectedLatex: "(6 - t/10)^2"
            allowConsequentialCarryover: true

  - id: "ap-calc-frq-q6"
    questionNumber: 6
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Analytical Applications of Differentiation"
    skill: "Mean Value Theorem and Function Behavior"
    difficulty: "Medium"
    prompt: |
      **NO CALCULATOR IS ALLOWED FOR THIS QUESTION.**

      Let $f$ be a twice-differentiable function such that $f(2) = 5$ and $f(6) = 17$. Selected values of $f'(x)$ are continuous on $[2, 6]$.

      ---

      **(a)** Explain why there must exist a value $c$, for $2 < c < 6$, such that $f'(c) = 3$.

      **(b)** Evaluate $\displaystyle\int_{2}^{6} f'(x) f''(x) \, dx$.

      **(c)** Let $h(x) = \dfrac{f(x)}{x^2}$. Find $h'(2)$ if $f'(2) = 4$.
    subParts:
      - label: "A"
        points: 2
        rubricNotes: "1 pt for difference quotient $\\frac{f(6) - f(2)}{6 - 2} = 3$; 1 pt for invoking Mean Value Theorem with differentiability/continuity hypotheses."
        criteria:
          - id: "q6-a-avg"
            description: "Computes average rate of change: $\\frac{f(6) - f(2)}{6 - 2} = \\frac{17 - 5}{4} = 3$"
            points: 1
            expectedLatex: "3"
          - id: "q6-a-mvt"
            description: "States that $f$ is differentiable (hence continuous) on $[2, 6]$, so by the Mean Value Theorem there exists $c \\in (2, 6)$ with $f'(c) = 3$"
            points: 1
            requiresJustification: true
      - label: "B"
        points: 3
        rubricNotes: "2 pts for antiderivative $\\frac{1}{2}[f'(x)]^2$; 1 pt for evaluating $\\frac{1}{2}([f'(6)]^2 - [f'(2)]^2)$."
        criteria:
          - id: "q6-b-usub"
            description: "Applies substitution $u = f'(x),\\, du = f''(x)\\,dx$ to obtain antiderivative $\\frac{1}{2}[f'(x)]^2$"
            points: 2
          - id: "q6-b-eval"
            description: "Applies Fundamental Theorem of Calculus: $\\frac{1}{2}\\left([f'(6)]^2 - [f'(2)]^2\\right)$"
            points: 1
            allowConsequentialCarryover: true
      - label: "C"
        points: 4
        rubricNotes: "2 pts for Quotient Rule expression for $h'(x)$; 1 pt for substituting $x = 2, f(2) = 5, f'(2) = 4$; 1 pt for final value $\\frac{3}{8}$."
        criteria:
          - id: "q6-c-quotient"
            description: "Applies Quotient Rule: $h'(x) = \\frac{x^2 f'(x) - 2x f(x)}{x^4}$"
            points: 2
          - id: "q6-c-sub"
            description: "Substitutes $x = 2$, $f(2) = 5$, and $f'(2) = 4$: $\\frac{4(4) - 4(5)}{16}$"
            points: 1
            allowConsequentialCarryover: true
          - id: "q6-c-ans"
            description: "Simplifies final value: $-\\frac{1}{4}$"
            points: 1
            expectedLatex: "-\\frac{1}{4}"
            numericTolerance: 0.001
            allowConsequentialCarryover: true