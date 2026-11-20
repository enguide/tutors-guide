---
sectionId: "ap-calc-ab-t1-s1b"
sectionTitle: "Section I, Part B (Calculator)"
sectionOrder: 2
timeLimit: 3600
config:
  calculator: "desmos-graphing"
  hasFormulaSheet: false
  hasCrossOutMode: true
  allowBacktracking: true
  allowSectionReview: true
questions:
  - id: "ap-calc-1b-q30"
    questionNumber: 30
    questionType: "MC"
    layout: "split"
    correctAnswer: "C"
    domain: "Limits and Continuity"
    skill: "2.B: Identify mathematical information from graphical, numerical, analytical, and/or verbal representations."
    difficulty: "Easy"
    stimulus: |
      | $x$ | $1.9$ | $1.99$ | $1.999$ | $2.001$ | $2.01$ | $2.1$ |
      | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
      | $g(x)$ | $0.1245$ | $0.0118$ | $0.0012$ | $-0.0011$ | $-0.0121$ | $-0.1302$ |

      The function $g$ is continuous and strictly decreasing for $x > 0$. The table above gives values of $g$ at selected values of $x$.
    prompt: |
      Of the following, which is the best approximation for $\lim\limits_{x \to 2} e^{-4g(x)}$?
    options:
      - id: "A"
        text: "$-4$"
      - id: "B"
        text: "$0$"
      - id: "C"
        text: "$1$"
      - id: "D"
        text: "The limit does not exist."
    explanation: |
      ### Takeoff: What were you asked to find?
      Estimate the composite limit $\lim\limits_{x \to 2} e^{-4g(x)}$ by reading the two-sided numerical behavior of $g(x)$ as $x \to 2$ from the given table and then applying the **Composite Function Limit Law** using the continuity of $y = e^u$.

      :::tabs
      == tab: Solving the question with Calculus
      Even though Section I, Part B permits a graphing calculator, no algebraic formula for $g(x)$ is provided—so determine $\lim\limits_{x \to 2} g(x)$ directly from the left- and right-hand table entries around $x = 2$, then pass the limit inside the continuous exponential function.

      :::derivation
      == step: Estimate the Left- and Right-Hand Limits of g(x) as x -> 2
      -- why: Inspect the tabulated outputs of $g(x)$ as $x$ gets arbitrarily close to $2$ from both sides ($x \to 2^-$ and $x \to 2^+$) to confirm that both one-sided limits converge to the same value.
      $$
      \begin{aligned}
      \lim_{x \to 2^-} g(x): &\quad 0.1245 \to 0.0118 \to 0.0012 \implies \lim_{x \to 2^-} g(x) = {\color{#2563eb}{0}} \\[.3cm]
      \lim_{x \to 2^+} g(x): &\quad -0.1302 \to -0.0121 \to -0.0011 \implies \lim_{x \to 2^+} g(x) = {\color{#2563eb}{0}}
      \end{aligned}
      $$
      Because the left- and right-hand limits agree (and $g$ is continuous), the two-sided limit is $\lim\limits_{x \to 2} g(x) = {\color{#2563eb}{0}}$.

      == step: Apply the Composite Limit Law to Evaluate the Exponential Limit
      -- why: Because the outer exponential function $f(u) = e^{-4u}$ is continuous everywhere, move the limit inside the exponent and evaluate $e^0$.
      $$
      \begin{aligned}
      \lim_{x \to 2} e^{-4g(x)} &= \exp\left(-4 \lim_{x \to 2} g(x)\right) \\[.4cm]
      &= e^{-4({\color{#2563eb}{0}})} \\[.4cm]
      &= e^{0} = 1
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $-4$:** *Coefficient Confusion Trap.* Mistakes the constant multiplier $-4$ in the exponent for the value of the exponential expression itself, overlooking that $-4 \cdot 0 = 0$ and $e^0 = 1$.
      * **(B) $0$:** *$e^0 = 0$ Algebraic Misconception Trap.* Correctly finds $\lim\limits_{x \to 2} g(x) = 0$ and simplifies the exponent to $0$, but mistakenly evaluates $e^0$ as $0$ instead of $1$.
      * **(C) $1$:** **Correct.** Determines from the table that $\lim\limits_{x \to 2} g(x) = 0$ and uses continuity of the exponential function to evaluate $e^{-4(0)} = e^0 = 1$.
      * **(D) The limit does not exist.:** *Missing Table Entry Trap.* Assumes the limit fails to exist simply because $x = 2$ is omitted from the table (or because $g(x)$ changes sign from positive to negative across $x = 2$), ignoring that both one-sided limits converge smoothly to $0$.

  - id: "ap-calc-1b-q31"
    questionNumber: 31
    questionType: "MC"
    layout: "split"
    correctAnswer: "D"
    domain: "Differentiation: Definition and Fundamental Properties"
    skill: "2.B: Identify mathematical information from graphical, numerical, analytical, and/or verbal representations."
    difficulty: "Easy"
    stimulus: |
      ![](./assets/APCalcAB-T1-S1B-Q33.svg)

      The graph of the function $h$ is shown above on the interval $[0, 4]$.
    prompt: |
      On which of the following open intervals is the function $h$ continuous but not differentiable?
    options:
      - id: "A"
        text: "$(0, 1)$"
      - id: "B"
        text: "$(1, 2)$"
      - id: "C"
        text: "$(2, 3)$"
      - id: "D"
        text: "$(3, 4)$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify which open interval contains a point where the graph of $h$ is **unbroken** (continuous everywhere on the interval) yet fails to have a unique tangent slope (not differentiable at some interior point due to a sharp corner, cusp, or vertical tangent).

      :::tabs
      == tab: Solving the question with Calculus
      Because the function $h$ is given purely graphically, inspect each unit interval $(a, b)$ against the two geometric criteria: (1) **continuity** requires no holes, jumps, or vertical asymptotes, and (2) **non-differentiability** requires a sharp corner, cusp, or vertical tangent where the left- and right-hand derivatives disagree.

      :::derivation
      == step: Check Continuity Across All Four Candidate Intervals
      -- why: Eliminate any interval containing a hole (removable discontinuity) or break (jump discontinuity), since a function must first be continuous on $(a, b)$ to meet the condition "continuous but not differentiable."
      $$
      \begin{aligned}
      \text{On } (0, 1): &\quad \text{Unbroken smooth curve} \implies {\color{#2563eb}{\text{Continuous}}} \\[.3cm]
      \text{On } (1, 2): &\quad \text{Hole at } x = 1.5 \text{ with displaced point } (1.5, 3) \implies {\color{#2563eb}{\text{Not continuous}}} \\[.3cm]
      \text{On } (2, 3): &\quad \text{Jump break at } x = 2.5 \implies {\color{#2563eb}{\text{Not continuous}}} \\[.3cm]
      \text{On } (3, 4): &\quad \text{Unbroken connected path} \implies {\color{#2563eb}{\text{Continuous}}}
      \end{aligned}
      $$

      == step: Test Differentiability on the Surviving Continuous Intervals (0, 1) and (3, 4)
      -- why: Compare the left- and right-hand tangent slopes across $(0, 1)$ and $(3, 4)$ to locate where the derivative $h'(x)$ fails to exist.
      $$
      \begin{aligned}
      \text{On } (0, 1): &\quad \text{Smooth tangent line everywhere} \implies h'(x) {\color{#2563eb}{\text{ exists everywhere}}} \\[.3cm]
      \text{At } x = 3.5 \in (3, 4): &\quad \lim_{x \to 3.5^-} h'(x) > 0 \neq \lim_{x \to 3.5^+} h'(x) < 0 \implies h'(3.5) {\color{#2563eb}{\text{ does not exist}}}
      \end{aligned}
      $$
      Because $h$ is continuous on $(3, 4)$ but has a sharp corner at $x = 3.5$, $(3, 4)$ is the only interval where $h$ is continuous but not differentiable.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $(0, 1)$:** *Both Continuous and Differentiable Trap.* The graph of $h$ is both unbroken and smooth on $(0, 1)$, so $h$ is differentiable everywhere on $(0, 1)$.
      * **(B) $(1, 2)$:** *Removable Discontinuity Trap.* Although $h$ is not differentiable at $x = 1.5$, it also fails continuity there because $\lim\limits_{x \to 1.5} h(x) \neq h(1.5)$ (a hole with a displaced dot at $(1.5, 3)$).
      * **(C) $(2, 3)$:** *Jump Discontinuity Trap.* Fails differentiability at $x = 2.5$, but fails continuity as well because the left- and right-hand limits at $x = 2.5$ do not match.
      * **(D) $(3, 4)$:** **Correct.** The graph is completely connected on $(3, 4)$ (continuous), but forms a sharp corner at $x = 3.5$ where the one-sided derivatives have opposite signs (not differentiable).
  - id: "ap-calc-1b-q32"
    questionNumber: 32
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Contextual Applications of Differentiation"
    skill: "4.A: Use precise mathematical language to articulate reasoning."
    difficulty: "Easy"
    prompt: |
      The rate at which an engine consumes fuel, in liters per minute, is modeled by $C$, a differentiable function of the time $t$, in minutes after the test begins. Which of the following is the best interpretation of $C'(5)$?
    options:
      - id: "A"
        text: "The total amount of fuel, in liters, consumed by the engine during the first $5$ minutes of the test"
      - id: "B"
        text: "The rate at which the engine is consuming fuel, in liters per minute, $5$ minutes after the test begins"
      - id: "C"
        text: "The rate of change of the fuel consumption rate, in liters per minute per minute, $5$ minutes after the test begins"
      - id: "D"
        text: "The net change in the rate of fuel consumption, in liters per minute, over the first $5$ minutes of the test"
    explanation: |
      ### Takeoff: What were you asked to find?
      Interpret the physical meaning and units of the derivative $C'(5)$ in context, keeping in mind that the given function $C(t)$ is **already a rate** (liters per minute), so its derivative $C'(t)$ measures the **rate of change of a rate**.

      :::tabs
      == tab: Solving the question with Calculus
      Because this is a conceptual contextual-interpretation item with no numerical formula, use unit analysis ($\text{units of } C'(t) = \dfrac{\text{units of } C}{\text{units of } t}$) together with the instantaneous time anchor $t = 5$ to pin down both the units and phrasing of $C'(5)$.

      :::derivation
      == step: Identify the Units of the Output C(t) and Input t
      -- why: Read the quantity and measurement units directly from the problem statement before differentiating.
      $$
      \begin{aligned}
      C(t) &: \text{rate of fuel consumption in } {\color{#2563eb}{\text{liters per minute}}} \\[.3cm]
      t &: \text{time elapsed since test began in } {\color{#2563eb}{\text{minutes}}}
      \end{aligned}
      $$

      == step: Determine the Meaning and Units of the Derivative C'(t)
      -- why: Differentiating $C$ with respect to $t$ yields $C'(t) = \dfrac{dC}{dt}$, which divides the output units of $C$ by the input units of $t$.
      $$
      \begin{aligned}
      \text{Units of } C'(t) = \frac{\text{units of } C}{\text{units of } t} &= \frac{{\color{#2563eb}{\text{liters per minute}}}}{{\color{#2563eb}{\text{minute}}}} \\[.4cm]
      &= {\color{#2563eb}{\text{liters per minute per minute}}}
      \end{aligned}
      $$
      Because $C(t)$ itself is the fuel consumption rate, $C'(t)$ represents the **rate of change of the fuel consumption rate**.

      == step: Anchor the Interpretation at the Specific Instant t = 5
      -- why: Distinguish an instantaneous derivative value at $t = 5$ ("$5$ minutes after the test begins") from an accumulated quantity over an interval $[0, 5]$ ("during the first $5$ minutes").
      
      $C'(5)$ represents the rate of change of the fuel consumption rate, in liters per minute per minute, $5$ minutes after the test begins
      
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) The total amount of fuel, in liters, consumed by the engine during the first $5$ minutes of the test:** *Integral vs. Derivative Trap.* Describes the definite integral $\displaystyle\int_{0}^{5} C(t) \, dt$ (which accumulates fuel in liters over $[0, 5]$) rather than the derivative $C'(5)$.
      * **(B) The rate at which the engine is consuming fuel, in liters per minute, $5$ minutes after the test begins:** *Function Value $C(5)$ vs. Derivative $C'(5)$ Trap.* Because the prompt defines $C(t)$ as a rate, students often forget that differentiating adds a second "per minute"; this statement describes $C(5)$, not $C'(5)$.
      * **(C) The rate of change of the fuel consumption rate, in liters per minute per minute, $5$ minutes after the test begins:** **Correct.** Correctly identifies $C'(5)$ as the instantaneous rate of change of the consumption rate at $t = 5$ with units of $\dfrac{\text{liters/min}}{\text{min}}$.
      * **(D) The net change in the rate of fuel consumption, in liters per minute, over the first $5$ minutes of the test:** *Net Change Over an Interval Trap.* Describes $C(5) - C(0) = \displaystyle\int_{0}^{5} C'(t) \, dt$ (which has units of liters per minute and spans the interval $[0, 5]$) rather than the instantaneous derivative $C'(5)$.

  - id: "ap-calc-1b-q33"
    questionNumber: 33
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Integration and Accumulation of Change"
    skill: "1.C: Identify an appropriate mathematical rule or procedure for a given situation."
    difficulty: "Easy"
    prompt: |
      Let $f$ and $g$ be continuous functions. If $\displaystyle\int_1^5 f(x)\,dx = 6$ and $\displaystyle\int_5^1 g(x)\,dx = 4$, then $\displaystyle\int_1^5 (2f(x) - 3g(x))\,dx =$
    options:
      - id: "A"
        text: "$0$"
      - id: "B"
        text: "$8$"
      - id: "C"
        text: "$24$"
      - id: "D"
        text: "$36$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Evaluate the linear combination $\displaystyle\int_1^5 (2f(x) - 3g(x))\,dx$ by first reconciling the **reversed limits of integration** on $\displaystyle\int_5^1 g(x)\,dx = 4$ and then applying the **linearity properties of definite integrals**.

      :::tabs
      == tab: Solving the question with Calculus
      Even though Section I, Part B permits a graphing calculator, no explicit formulas are given for $f$ and $g$. Instead, align the integration limits from $1$ to $5$ before splitting the integral across sums and constant multiples.

      :::derivation
      == step: Reverse the Limits of Integration on g(x)
      -- why: Notice that the given integral for $g$ runs from $5$ to $1$ rather than $1$ to $5$; apply $\displaystyle\int_a^b g(x)\,dx = -\displaystyle\int_b^a g(x)\,dx$ so both integrals share the exact same interval $[1, 5]$.
      $$
      \begin{aligned}
      \int_1^5 g(x)\,dx &= -\int_5^1 g(x)\,dx \\[.4cm]
      &= -({\color{#2563eb}{4}}) = {\color{#2563eb}{-4}}
      \end{aligned}
      $$

      == step: Apply Linearity Properties of Definite Integrals
      -- why: Split the integral across subtraction using $\displaystyle\int_a^b [u(x) - v(x)]\,dx = \displaystyle\int_a^b u(x)\,dx - \displaystyle\int_a^b v(x)\,dx$ and pull out the constant factors $2$ and $3$.
      $$
      \begin{aligned}
      \int_1^5 \bigl(2f(x) - 3g(x)\bigr)\,dx &= 2\int_1^5 f(x)\,dx - 3\int_1^5 g(x)\,dx
      \end{aligned}
      $$

      == step: Substitute the Known Integral Values and Simplify
      -- why: Plug in $\displaystyle\int_1^5 f(x)\,dx = 6$ and $\displaystyle\int_1^5 g(x)\,dx = -4$, paying close attention to the double negative $-3(-4) = +12$.
      $$
      \begin{aligned}
      2\int_1^5 f(x)\,dx - 3\int_1^5 g(x)\,dx &= 2({\color{#2563eb}{6}}) - 3({\color{#2563eb}{-4}}) \\[.4cm]
      &= 12 + 12 = 24
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $0$:** *Reversed Limits Oversight Trap.* Overlooks that the limits on $\displaystyle\int_5^1 g(x)\,dx = 4$ are upside down, plugging $+4$ directly into $2(6) - 3(4) = 12 - 12 = 0$.
      * **(B) $8$:** *Missing Constant Multiple & Limit Reversal Trap.* Both forgets to negate $\displaystyle\int_5^1 g(x)\,dx$ when reversing limits and drops the coefficient $3$ on $g(x)$, computing $2(6) - 4 = 8$.
      * **(C) $24$:** **Correct.** Reverses the limits to get $\displaystyle\int_1^5 g(x)\,dx = -4$ and computes $2(6) - 3(-4) = 12 + 12 = 24$.
      * **(D) $36$:** *Coefficient Swap / Sign Error Trap.* Misapplies the scalar multipliers or signs (for instance, computing $3(6) - 3(-4) = 30$ or $4(6) - 3(-4) = 36$), rather than multiplying $f$ by $2$ and $g$ by $-3$.

  - id: "ap-calc-1b-q34"
    questionNumber: 34
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Contextual and Analytical Applications of Differentiation"
    skill: "1.E: Apply appropriate mathematical rules or procedures, with and without technology."
    difficulty: "Medium"
    prompt: |
      The first derivative of the function $g$ is defined by $g'(x) = (x^2 + 2)\cos(2x + 1)$ for $-2 < x < 2$. On which of the following intervals is the graph of $g$ concave up?
    options:
      - id: "A"
        text: "$(-2, -0.628)$ and $(1.238, 2)$"
      - id: "B"
        text: "$(-0.628, 1.238)$"
      - id: "C"
        text: "$(-1.285, 0.285)$"
      - id: "D"
        text: "$(-2, -1.285)$ and $(0.285, 2)$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify the open subintervals of $(-2, 2)$ on which the graph of $g$ is **concave up**—that is, where $g''(x) > 0$, or equivalently, where the given first derivative $g'(x)$ is **strictly increasing**.

      :::tabs
      == tab: Solving the question with Desmos (Graphing Calculator)
      Because $g''(x) = 0$ produces a transcendental equation that cannot be solved algebraically in closed form, use Desmos (in **radian mode**) either to inspect where $g'(x)$ is rising or to graph $g''(x)$ directly and locate where $g''(x)$ lies above the $x$-axis.

      :::derivation
      == step: Define g'(x) and Graph g''(x) on (-2, 2) in Radian Mode
      -- why: Confirm your calculator is set to radians, enter $f(x) = (x^2 + 2)\cos(2x + 1)\{-2 < x < 2\}$, and plot its derivative $y = f'(x)$ (which represents $g''(x)$) to see directly where $g''(x) > 0$.
      $$
      \begin{aligned}
      f(x) &= (x^2 + 2)\cos(2x + 1) \quad \text{for } -2 < x < 2 \\[.3cm]
      g''(x) = f'(x) &= {\color{#2563eb}{\frac{d}{dx}\Bigl[(x^2 + 2)\cos(2x + 1)\Bigr]}}
      \end{aligned}
      $$

      == step: Locate the Zeros of g''(x) (Extrema of g'(x)) on (-2, 2)
      -- why: Click the $x$-intercepts of $g''(x)$ (or equivalently, the local maximum and local minimum of $g'(x)$) within $-2 < x < 2$ and round to three decimal places.
      $$
      \begin{aligned}
      g''(x) = 0 \implies x &\approx {\color{#2563eb}{-0.628}} \quad \text{(local maximum of } g'\text{)} \\[.3cm]
      x &\approx {\color{#2563eb}{1.238}} \quad \text{(local minimum of } g'\text{)}
      \end{aligned}
      $$

      == step: Determine Where g''(x) > 0 (g'(x) Is Increasing)
      -- why: Read the subintervals of $(-2, 2)$ where the graph of $g''(x)$ sits above the $x$-axis (and $g'(x)$ slopes upward).
      $$
      \begin{aligned}
      \text{On } (-2, -0.628): &\quad g''(x) > {\color{#2563eb}{0}} \; (g' \text{ is increasing}) \implies g \text{ is } {\color{#2563eb}{\text{concave up}}} \\[.3cm]
      \text{On } (-0.628, 1.238): &\quad g''(x) < {\color{#2563eb}{0}} \; (g' \text{ is decreasing}) \implies g \text{ is concave down} \\[.3cm]
      \text{On } (1.238, 2): &\quad g''(x) > {\color{#2563eb}{0}} \; (g' \text{ is increasing}) \implies g \text{ is } {\color{#2563eb}{\text{concave up}}}
      \end{aligned}
      $$
      Combining the intervals where $g''(x) > 0$ gives $(-2, -0.628)$ and $(1.238, 2)$.
      :::

      :::desmos
      {
        "bounds": { "left": -2.3, "right": 2.3, "bottom": -14, "top": 14 },
        "expressions": [
          { "id": "f", "latex": "f(x)=(x^2+2)\\cos(2x+1)", "color": "#6b7280" },
          { "id": "g_double_prime", "latex": "g(x)=\\frac{d}{dx}f(x)", "color": "#2563eb" },
          { "id": "root_1", "latex": "(-0.628, 0)", "color": "#dc2626" },
          { "id": "root_2", "latex": "(1.238, 0)", "color": "#dc2626" }
        ],
        "caption": "Line 1 defines g'(x) = f(x) in gray. Line 2 plots g''(x) in blue, crossing the x-axis at (-0.628, 0) and (1.238, 0). Reading where the blue curve lies above the x-axis on (-2, 2) gives (-2, -0.628) and (1.238, 2)."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $(-2, -0.628)$ and $(1.238, 2)$:** **Correct.** Identifies the two subintervals on $(-2, 2)$ where $g''(x) > 0$ (equivalently, where the graph of $g'(x)$ is increasing).
      * **(B) $(-0.628, 1.238)$:** *Concave Down Interval Trap.* Selects the middle subinterval where $g''(x) < 0$ ($g'(x)$ is decreasing), which is where $g$ is concave **down** rather than concave up.
      * **(C) $(-1.285, 0.285)$:** *Increasing vs. Concave Up ($g' > 0$ vs. $g'' > 0$) Trap.* Finds the zeros of the given function $g'(x)$ itself ($x \approx -1.285$ and $x \approx 0.285$) and selects where $g'(x) > 0$, which tells where $g$ is **increasing** rather than concave up.
      * **(D) $(-2, -1.285)$ and $(0.285, 2)$:** *Decreasing vs. Concave Up ($g' < 0$ vs. $g'' > 0$) Trap.* Selects the intervals where the given expression $g'(x) < 0$, which tells where $g$ is **decreasing** rather than concave up.

  - id: "ap-calc-1b-q35"
    questionNumber: 35
    questionType: "MC"
    layout: "single"
    correctAnswer: "D"
    domain: "Integration and Accumulation of Change"
    skill: "1.E: Apply appropriate mathematical rules or procedures, with and without technology."
    difficulty: "Medium"
    prompt: |
      During a winter storm, the depth of snow on a roadway increases at a rate modeled by $S(t) = 0.8 + t\sin\left(\dfrac{\pi t^2}{30}\right)$, where $t$ is the time in hours since the snowfall began and $S(t)$ is measured in centimeters per hour. How much did the depth of snow on the roadway increase from $t = 0$ to $t = 4$ hours?
    options:
      - id: "A"
        text: "$2.118\\text{ cm}$"
      - id: "B"
        text: "$4.778\\text{ cm}$"
      - id: "C"
        text: "$5.274\\text{ cm}$"
      - id: "D"
        text: "$8.474\\text{ cm}$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the **net accumulation** (total increase in snow depth, in centimeters) from $t = 0$ to $t = 4$ hours by integrating the given rate function $S(t)$ (measured in centimeters per hour) over the interval $[0, 4]$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part B permits a graphing calculator, set up the definite integral of the accumulation rate $S(t)$ over $[0, 4]$ and evaluate it numerically using Desmos or `fnInt` (in **radian mode**).

      :::derivation
      == step: Set Up the Accumulation Integral Over [0, 4]
      -- why: Multiply the instantaneous rate $S(t)$ ($\text{cm/hr}$) by $dt$ ($\text{hr}$) and integrate from $t = 0$ to $t = 4$ to accumulate the total change in depth ($\text{cm}$).
      $$
      \begin{aligned}
      \text{Increase in depth} &= \int_{0}^{4} S(t) \, dt \\[.4cm]
      &= \int_{0}^{4} \left(0.8 + t\sin\left(\frac{\pi t^2}{30}\right)\right) dt
      \end{aligned}
      $$

      == step: Evaluate the Definite Integral Using Desmos / Graphing Calculator
      -- why: Confirm your calculator is in **radian mode**, define $S(t) = 0.8 + t\sin\left(\dfrac{\pi t^2}{30}\right)$, and compute $\displaystyle\int_{0}^{4} S(t)\,dt$ (using `int` in Desmos or `fnInt` on a TI calculator), rounding the final output to three decimal places.
      $$
      \begin{aligned}
      \int_{0}^{4} \left(0.8 + t\sin\left(\frac{\pi t^2}{30}\right)\right) dt &\approx {\color{#2563eb}{8.47374}} \\[.4cm]
      &\approx 8.474\text{ cm}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $2.118\text{ cm}$:** *Average Rate vs. Total Accumulation Trap.* Divides the definite integral by the interval length $4 - 0 = 4$ ($\dfrac{1}{4}\displaystyle\int_{0}^{4} S(t)\,dt \approx 2.118\text{ cm/hr}$), computing the **average snowfall rate** rather than the total accumulated snow depth.
      * **(B) $4.778\text{ cm}$:** *Function Value $S(4)$ vs. Integral Trap.* Evaluates the snowfall rate at the single instant $t = 4$ ($S(4) = 0.8 + 4\sin\left(\dfrac{8\pi}{15}\right) \approx 4.778\text{ cm/hr}$) rather than integrating over $[0, 4]$.
      * **(C) $5.274\text{ cm}$:** *Dropped Constant Term Trap.* Evaluates only $\displaystyle\int_{0}^{4} t\sin\left(\dfrac{\pi t^2}{30}\right) dt \approx 5.274\text{ cm}$, omitting the constant term $0.8$ (which contributes $\displaystyle\int_{0}^{4} 0.8\,dt = 0.8(4) = 3.2\text{ cm}$).
      * **(D) $8.474\text{ cm}$:** **Correct.** Integrates the complete rate function $S(t)$ over $[0, 4]$ in radian mode to obtain $8.47374 \approx 8.474\text{ cm}$.

  - id: "ap-calc-1b-q36"
    questionNumber: 36
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Limits and Continuity"
    skill: "3.E: Provide reasons or rationales for solutions and conclusions."
    difficulty: "Easy"
    prompt: |
      Let $g$ be a function such that $g(-2) = 9$ and $g(3) = 1$. Which of the following conditions ensures that $g(c) = 4$ for some value $c$ in the open interval $(-2, 3)$?
    options:
      - id: "A"
        text: "$g$ is continuous on the closed interval $[-2, 3]$."
      - id: "B"
        text: "$g$ is decreasing on the closed interval $[-2, 3]$."
      - id: "C"
        text: "$\\lim\\limits_{x \\to 0} g(x)$ exists."
      - id: "D"
        text: "$g'(c) = \\dfrac{g(3) - g(-2)}{3 - (-2)}$ for some value $c$ in the open interval $(-2, 3)$."
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify the exact theorem hypothesis required to guarantee that the function $g$ takes on the intermediate output value $g(c) = 4$ at least once on $(-2, 3)$, given the endpoint values $g(-2) = 9$ and $g(3) = 1$.

      :::tabs
      == tab: Solving the question with Calculus
      Because this is a conceptual theorem-hypothesis item with no explicit formula for $g$, match the target statement ("$g(c) = 4$ for some $c \in (-2, 3)$") to the **Intermediate Value Theorem (IVT)** and check its required hypothesis on $[-2, 3]$.

      :::derivation
      == step: Verify That the Target Value Lies Strictly Between the Endpoint Values
      -- why: Confirm that $4$ sits strictly between $g(3) = 1$ and $g(-2) = 9$ so the Intermediate Value Theorem applies to the target output $y = 4$.
      $$
      \begin{aligned}
      g(3) = {\color{#2563eb}{1}} < {\color{#2563eb}{4}} < {\color{#2563eb}{9}} = g(-2)
      \end{aligned}
      $$

      == step: State the Required Hypothesis of the Intermediate Value Theorem
      -- why: Recall that the Intermediate Value Theorem guarantees at least one $c \in (a, b)$ with $g(c) = k$ if and only if $g$ is continuous across the entire closed interval $[a, b]$.
      $$
      \begin{aligned}
      \text{Hypothesis:} &\quad g \text{ is } {\color{#2563eb}{\text{continuous on the closed interval } [-2, 3]}} \\[.3cm]
      \text{Conclusion:} &\quad \exists\, c \in (-2, 3) \text{ such that } g(c) = 4
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $g$ is continuous on the closed interval $[-2, 3]$.:** **Correct.** Continuity on $[-2, 3]$ prevents jumps, breaks, or holes, satisfying the exact hypothesis of the Intermediate Value Theorem so $g$ cannot pass from $9$ down to $1$ without crossing $y = 4$.
      * **(B) $g$ is decreasing on the closed interval $[-2, 3]$.:** *Monotonicity Without Continuity Trap.* A decreasing function can still have a jump discontinuity (for example, $g(x) = 9$ for $x \le 0$ and $g(x) = 1$ for $x > 0$), jumping right over $y = 4$ without ever equaling $4$.
      * **(C) $\lim\limits_{x \to 0} g(x)$ exists.:** *Single-Point Limit Trap.* Knowing that $g$ approaches a limit at one isolated interior point $x = 0$ says nothing about jumps or breaks elsewhere on $[-2, 3]$ (or even whether $g(0)$ equals that limit).
      * **(D) $g'(c) = \dfrac{g(3) - g(-2)}{3 - (-2)}$ for some value $c$ in the open interval $(-2, 3)$.:** *Mean Value Theorem Conclusion Trap.* Confuses the **Intermediate Value Theorem** (which guarantees a specific *function output* $g(c) = 4$) with the **Mean Value Theorem** (which guarantees a specific *derivative / slope* $g'(c) = \dfrac{1 - 9}{5} = -1.6$).
  - id: "ap-calc-1b-q37"
    questionNumber: 37
    questionType: "MC"
    layout: "split"
    correctAnswer: "C"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "1.E: Apply appropriate mathematical rules or procedures, with and without technology."
    difficulty: "Medium"
    stimulus: |
      | $x$ | $2$ | $5$ |
      | :---: | :---: | :---: |
      | $f(x)$ | $5$ | $17$ |
      | $f'(x)$ | $4$ | $9$ |

      Selected values of the increasing, differentiable function $f$ and its derivative $f'$ are shown in the table above.
    prompt: |
      If $g$ is a differentiable function such that $f(g(x)) = x$ for all $x$, what is the value of $g'(5)$?
    options:
      - id: "A"
        text: "$-\\dfrac{1}{4}$"
      - id: "B"
        text: "$\\dfrac{1}{9}$"
      - id: "C"
        text: "$\\dfrac{1}{4}$"
      - id: "D"
        text: "$4$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the derivative $g'(5)$ of the inverse function $g = f^{-1}$ (defined by the identity $f\bigl(g(x)\bigr) = x$) by differentiating both sides via the **Chain Rule** and matching the output $y = 5$ back to its corresponding input $x = 2$ in the table.

      :::tabs
      == tab: Solving the question with Calculus
      Because no algebraic formula is given for $f$, differentiate the inverse identity ${\color{#2563eb}{f\Bigl(}}{\color{#16a34a}{g(x)}}{\color{#2563eb}{\Bigr)}} = x$ directly with respect to $x$ so you never have to memorize a separate inverse-derivative formula—and remember that $g(5)$ is the $x$-value where $f(x) = 5$.

      :::derivation
      == step: Differentiate the Inverse Identity Using the Chain Rule
      -- why: Differentiate both sides of ${\color{#2563eb}{f\Bigl(}}{\color{#16a34a}{g(x)}}{\color{#2563eb}{\Bigr)}} = x$ with respect to $x$, peeling off the outer layer $f'$ evaluated at the intact inner argument $g(x)$ and multiplying by $g'(x)$.
      $$
      \begin{aligned}
      \frac{d}{dx}\Bigl[{\color{#2563eb}{f\Bigl(}}{\color{#16a34a}{g(x)}}{\color{#2563eb}{\Bigr)}}\Bigr] &= \frac{d}{dx}[x] \\[.4cm]
      {\color{#2563eb}{f'\Bigl(}}{\color{#16a34a}{g(x)}}{\color{#2563eb}{\Bigr)}} \cdot {\color{#16a34a}{g'(x)}} &= 1 \\[.4cm]
      {\color{#16a34a}{g'(x)}} &= \frac{1}{{\color{#2563eb}{f'\Bigl(}}{\color{#16a34a}{g(x)}}{\color{#2563eb}{\Bigr)}}}
      \end{aligned}
      $$

      == step: Find g(5) by Reversing Input and Output in the Table
      -- why: Since $f\bigl(g(5)\bigr) = 5$ and $f$ is strictly increasing (one-to-one), scan the $f(x)$ row of the table for the output $5$ to read off its corresponding $x$-value.
      $$
      \begin{aligned}
      f(2) = 5 \implies {\color{#16a34a}{g(5)}} = {\color{#16a34a}{2}}
      \end{aligned}
      $$

      == step: Substitute g(5) = 2 and Read f'(2) from the Table
      -- why: Plug $x = 5$ into the derivative formula, replace ${\color{#16a34a}{g(5)}}$ with ${\color{#16a34a}{2}}$, and substitute $f'(2) = 4$ from the table.
      $$
      \begin{aligned}
      {\color{#16a34a}{g'(5)}} &= \frac{1}{{\color{#2563eb}{f'\Bigl(}}{\color{#16a34a}{g(5)}}{\color{#2563eb}{\Bigr)}}} \\[.4cm]
      &= \frac{1}{{\color{#2563eb}{f'\bigl(}}{\color{#16a34a}{2}}{\color{#2563eb}{\bigr)}}} \\[.4cm]
      &= \frac{1}{4}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $-\dfrac{1}{4}$:** *Opposite-Reciprocal (Normal Line) Trap.* Confuses the reciprocal slope of an inverse function ($\dfrac{1}{f'(2)}$) with the negative-reciprocal slope of a perpendicular normal line ($-\dfrac{1}{f'(2)} = -\dfrac{1}{4}$).
      * **(B) $\dfrac{1}{9}$:** *Using $x = 5$ Instead of $g(5) = 2$ Trap.* Evaluates $\dfrac{1}{f'(5)} = \dfrac{1}{9}$ directly at $x = 5$, forgetting that $5$ is the **output** of $f$ (so $g(5) = 2$), not the input to $f'$.
      * **(C) $\dfrac{1}{4}$:** **Correct.** Uses $f(2) = 5 \implies g(5) = 2$ and computes $g'(5) = \dfrac{1}{f'(g(5))} = \dfrac{1}{f'(2)} = \dfrac{1}{4}$.
      * **(D) $4$:** *Reciprocal Omission Trap.* Correctly locates $g(5) = 2$ and reads $f'(2) = 4$ from the table, but forgets to take the reciprocal $\dfrac{1}{f'(2)}$.

  - id: "ap-calc-1b-q38"
    questionNumber: 38
    questionType: "MC"
    layout: "split"
    correctAnswer: "D"
    domain: "Contextual and Analytical Applications of Differentiation"
    skill: "2.E: Describe the relationships among different representations of functions and their derivatives."
    difficulty: "Medium"
    stimulus: |
      ![](./assets/APCalcAB-T1-S1B-Q30.svg)

      The graph of $g'$, the derivative of the continuous function $g$, is shown above on the closed interval $[-3, 4]$.
    prompt: |
      On which of the following intervals is the function $g$ decreasing?
    options:
      - id: "A"
        text: "$[-3, -2]$ only"
      - id: "B"
        text: "$[-2, 1]$ only"
      - id: "C"
        text: "$[-3, -0.6]$ and $[1, 2.8]$"
      - id: "D"
        text: "$[-2, 4]$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify the interval on which the continuous function $g$ is **decreasing** from the given graph of its derivative $g'$ by locating where $g'(x) \le 0$ (on or below the $x$-axis), paying careful attention to what happens at an interior point where $g'$ touches the $x$-axis without crossing it.

      :::tabs
      == tab: Solving the question with Calculus
      Because the graph provided is $g'$ (not $g$), translate **sign** ($g'(x) < 0$ vs. $g'(x) > 0$) rather than **slope** ($g''(x)$) into intervals of decrease: a continuous function $g$ decreases across an entire interval whenever $g'(x) < 0$ everywhere except possibly at isolated zeros.

      :::derivation
      == step: Map the Sign of g'(x) Across [-3, 4]
      -- why: Read the $x$-intercepts of the graph of $g'$ ($x = -2$, $x = 1$, and $x = 4$) and record whether $g'(x)$ lies above ($+$) or below ($-$) the $x$-axis on each subinterval.
      $$
      \begin{aligned}
      \text{On } [-3, -2): &\quad g'(x) > {\color{#2563eb}{0}} \quad (\text{above } x\text{-axis}) \\[.3cm]
      \text{At } x = -2: &\quad g'(-2) = {\color{#2563eb}{0}} \\[.3cm]
      \text{On } (-2, 1): &\quad g'(x) < {\color{#2563eb}{0}} \quad (\text{below } x\text{-axis}) \\[.3cm]
      \text{At } x = 1: &\quad g'(1) = {\color{#2563eb}{0}} \quad (\text{touches } x\text{-axis without crossing}) \\[.3cm]
      \text{On } (1, 4): &\quad g'(x) < {\color{#2563eb}{0}} \quad (\text{below } x\text{-axis}) \\[.3cm]
      \text{At } x = 4: &\quad g'(4) = {\color{#2563eb}{0}}
      \end{aligned}
      $$

      == step: Combine Subintervals Where g'(x) <= 0 Across Isolated Zeros
      -- why: Because $g$ is continuous on $[-2, 4]$ and $g'(x) < 0$ on both $(-2, 1)$ and $(1, 4)$, the isolated horizontal tangent at $x = 1$ (an inflection-style plateau with $g'(1) = 0$) does not interrupt the downward trend of $g$.
      $$
      \begin{aligned}
      g'(x) \le 0 \text{ on } [-2, 1] \text{ and } g'(x) \le 0 \text{ on } [1, 4] &\implies g \text{ is decreasing on } [-2, 4]
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $[-3, -2]$ only:** *Increasing vs. Decreasing Sign Reversal Trap.* Selects the interval where $g'(x) \ge 0$ (above the $x$-axis), which is where $g$ is **increasing** rather than decreasing.
      * **(B) $[-2, 1]$ only:** *Splitting Across an Isolated Zero Trap.* Stops at $x = 1$ because $g'(1) = 0$; however, since $g'(x)$ stays negative on both sides of $x = 1$ and $g$ is continuous, $g$ decreases continuously across $[-2, 4]$ without turning around.
      * **(C) $[-3, -0.6]$ and $[1, 2.8]$:** *Confusing $g'$ with $g$ ($g'' < 0$ vs. $g' < 0$) Trap.* Picks the intervals where the **graph of $g'$ itself is falling** ($g''(x) < 0$), which tells where $g$ is **concave down** rather than decreasing.
      * **(D) $[-2, 4]$:** **Correct.** Because $g$ is continuous and $g'(x) \le 0$ across the entire interval $[-2, 4]$ (with only isolated zeros at $x = -2, 1, 4$), $g$ is decreasing on $[-2, 4]$.

  - id: "ap-calc-1b-q39"
    questionNumber: 39
    questionType: "MC"
    layout: "single"
    correctAnswer: "D"
    domain: "Integration and Accumulation of Change"
    skill: "1.E: Apply appropriate mathematical rules or procedures, with and without technology."
    difficulty: "Medium"
    prompt: |
      A particle moves along the $x$-axis so that its velocity at time $t$ is given by $v(t) = \dfrac{6}{t^2 + 1}$. If the position of the particle is $x = 2$ when $t = 1$, what is the position of the particle when $t = 3$ ?
    options:
      - id: "A"
        text: "$-0.782$"
      - id: "B"
        text: "$2.782$"
      - id: "C"
        text: "$3.541$"
      - id: "D"
        text: "$4.782$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the particle's **position** $x(3)$ at $t = 3$ by combining its **initial position** $x(1) = 2$ with its **net displacement** $\displaystyle\int_{1}^{3} v(t)\,dt$ over the time interval $[1, 3]$ via the **Fundamental Theorem of Calculus**.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part B permits a graphing calculator, write the net-change accumulation equation $x(3) = x(1) + \displaystyle\int_{1}^{3} v(t)\,dt$ (with lower limit $t = 1$, not $t = 0$) and evaluate the entire expression directly in Desmos or with `fnInt`.

      :::derivation
      == step: Set Up the Position-Accumulation Equation via the Fundamental Theorem of Calculus
      -- why: Anchor the definite integral at the given initial time $t = 1$ so that $x(3) - x(1) = \displaystyle\int_{1}^{3} v(t)\,dt$, and isolate $x(3)$ by adding the initial position $x(1) = 2$.
      $$
      \begin{aligned}
      x(3) &= {\color{#2563eb}{x(1)}} + \int_{1}^{3} v(t) \, dt \\[.4cm]
      &= {\color{#2563eb}{2}} + \int_{1}^{3} \frac{6}{t^2 + 1} \, dt
      \end{aligned}
      $$

      == step: Evaluate the Displacement Integral and Add the Initial Position on a Calculator
      -- why: Enter `2 + \int_1^3 6/(t^2 + 1) dt` in Desmos (or `2 + fnInt(6/(X^2 + 1), X, 1, 3)` on a TI calculator) in a single expression so full precision is preserved before rounding to three decimal places.
      $$
      \begin{aligned}
      \int_{1}^{3} \frac{6}{t^2 + 1} \, dt &\approx {\color{#2563eb}{2.78191}} \\[.4cm]
      x(3) &\approx 2 + {\color{#2563eb}{2.78191}} = 4.78191 \approx 4.782
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $-0.782$:** *Sign Reversal on Displacement Trap.* Subtracts the net displacement from the initial position ($2 - 2.782 = -0.782$) rather than adding $x(1) + \displaystyle\int_{1}^{3} v(t)\,dt$.
      * **(B) $2.782$:** *Forgotten Initial Condition Trap.* Evaluates only the net displacement $\displaystyle\int_{1}^{3} v(t)\,dt \approx 2.782$, forgetting to add the starting position $x(1) = 2$.
      * **(C) $3.541$:** *Wrong Lower Limit / Misentered Expression Trap.* Results from using an incorrect lower limit (such as $t = 0$ with an altered setup) or mis-entering the integrand/formula rather than computing $2 + \displaystyle\int_{1}^{3} \dfrac{6}{t^2 + 1}\,dt$.
      * **(D) $4.782$:** **Correct.** Combines the initial position $x(1) = 2$ with the displacement $\displaystyle\int_{1}^{3} \dfrac{6}{t^2 + 1}\,dt \approx 2.78191$ to obtain $4.782$.

  - id: "ap-calc-1b-q40"
    questionNumber: 40
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Applications of Integration"
    skill: "1.C: Identify an appropriate mathematical rule or procedure for a given situation."
    difficulty: "Easy"
    prompt: |
      If the average value of the continuous function $g$ over the closed interval $[3, 7]$ is $5$ and if $g(x) \ge 0$ for all $x$ in $[3, 7]$, what is the area of the region enclosed by the graph of $y = g(x)$, the lines $x = 3$ and $x = 7$, and the $x$-axis?
    options:
      - id: "A"
        text: "$\\dfrac{5}{4}$"
      - id: "B"
        text: "$5$"
      - id: "C"
        text: "$20$"
      - id: "D"
        text: "$35$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the **geometric area** under the nonnegative curve $y = g(x)$ across the interval $[3, 7]$ by linking the **Average Value of a Function** formula $g_{\text{avg}} = \dfrac{1}{b - a}\displaystyle\int_{a}^{b} g(x)\,dx$ to the definite integral $\displaystyle\int_{3}^{7} g(x)\,dx$.

      :::tabs
      == tab: Solving the question with Calculus
      Even though Section I, Part B permits a graphing calculator, no explicit formula is given for $g(x)$. Instead, use the geometric meaning of average value: a rectangle of width $b - a$ and height $g_{\text{avg}}$ has the exact same area as the region under $y = g(x)$ on $[a, b]$.

      :::derivation
      == step: Set Up the Average Value Formula on [3, 7]
      -- why: Substitute $a = 3$, $b = 7$, and $g_{\text{avg}} = 5$ into $g_{\text{avg}} = \dfrac{1}{b - a}\displaystyle\int_{a}^{b} g(x)\,dx$.
      $$
      \begin{aligned}
      g_{\text{avg}} &= \frac{1}{b - a}\int_{a}^{b} g(x) \, dx \\[.4cm]
      {\color{#2563eb}{5}} &= \frac{1}{{\color{#2563eb}{7 - 3}}}\int_{3}^{7} g(x) \, dx \\[.4cm]
      5 &= \frac{1}{4}\int_{3}^{7} g(x) \, dx
      \end{aligned}
      $$

      == step: Isolate the Definite Integral and Connect to Geometric Area
      -- why: Multiply both sides by the interval width $4$, and use the condition $g(x) \ge 0$ on $[3, 7]$ to equate the definite integral directly to the enclosed geometric area.
      $$
      \begin{aligned}
      \int_{3}^{7} g(x) \, dx &= {\color{#2563eb}{5}} \times {\color{#2563eb}{4}} = 20 \\[.4cm]
      \text{Since } g(x) \ge 0 \text{ on } [3, 7], \quad \text{Area} &= \int_{3}^{7} g(x) \, dx = 20
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\dfrac{5}{4}$:** *Dividing Instead of Multiplying by Width Trap.* Divides the given average value $5$ by the interval width $7 - 3 = 4$ instead of multiplying ($g_{\text{avg}} \cdot (b - a)$).
      * **(B) $5$:** *Average Height vs. Total Area Trap.* Confuses the average height of the curve ($g_{\text{avg}} = 5$) with the total area under the curve, forgetting to multiply by the base width $b - a = 4$.
      * **(C) $20$:** **Correct.** Rearranges $5 = \dfrac{1}{7 - 3}\displaystyle\int_{3}^{7} g(x)\,dx$ to get $\displaystyle\int_{3}^{7} g(x)\,dx = 5 \cdot 4 = 20$, which equals the area because $g(x) \ge 0$.
      * **(D) $35$:** *Upper Endpoint Instead of Interval Width Trap.* Multiplies the average value $5$ by the upper endpoint $b = 7$ ($5 \times 7 = 35$) rather than the interval length $7 - 3 = 4$.

  - id: "ap-calc-1b-q41"
    questionNumber: 41
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Contextual and Analytical Applications of Differentiation"
    skill: "1.E: Apply appropriate mathematical rules or procedures, with and without technology."
    difficulty: "Medium"
    prompt: |
      The acceleration of a particle moving along the $x$-axis is given by $a(t) = (t - 7)\sin t$ for $0 \le t \le 7$. At what value of $t$ is the particle's velocity decreasing most rapidly?
    options:
      - id: "A"
        text: "$0$"
      - id: "B"
        text: "$1.391$"
      - id: "C"
        text: "$3.142$"
      - id: "D"
        text: "$4.385$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the time $t \in [0, 7]$ at which the particle's **velocity is decreasing most rapidly**—meaning the **rate of change of velocity**, $v'(t) = a(t)$, attains its **absolute minimum** (most negative value) on the closed interval $[0, 7]$.

      :::tabs
      == tab: Solving the question with Desmos (Graphing Calculator)
      Because $a'(t) = \sin t + (t - 7)\cos t = 0$ cannot be solved algebraically in closed form and $a(t)$ is already given directly in the prompt, graph $a(t)$ on $[0, 7]$ in Desmos (in **radian mode**) and apply the **Candidates Test** to find the global minimum of $a(t)$.

      :::derivation
      == step: Translate "Velocity Decreasing Most Rapidly" into an Optimization Target
      -- why: Recognize that the rate of change of velocity is $v'(t) = a(t)$, so velocity decreases most rapidly where $a(t)$ reaches its most negative value (absolute minimum) on $[0, 7]$.
      $$
      \text{Rate of change of } v(t) = v'(t) = {\color{#2563eb}{a(t) = (t - 7)\sin t}} \quad \text{on } [0, 7]
      $$

      == step: Graph a(t) in Desmos and Locate All Interior Extrema on [0, 7]
      -- why: Confirm your calculator is in **radian mode**, enter $a(t) = (t - 7)\sin(t)\{0 \le t \le 7\}$, and click the turning points where $a'(t) = 0$ to inspect their coordinates.
      $$
      \begin{aligned}
      a'(t) = 0 \implies t &\approx {\color{#2563eb}{1.391}} \quad \bigl(\text{local minimum of } a(t)\bigr) \\[.3cm]
      t &\approx {\color{#2563eb}{4.385}} \quad \bigl(\text{local maximum of } a(t)\bigr)
      \end{aligned}
      $$

      == step: Compare Candidates (Endpoints and Critical Points) to Confirm the Absolute Minimum
      -- why: Evaluate $a(t)$ at the endpoints $t = 0, 7$ and interior critical points $t \approx 1.391, 4.385$ to verify which candidate produces the lowest value of $a(t)$.
      $$
      \begin{aligned}
      a(0) &= (0 - 7)\sin(0) = {\color{#2563eb}{0}} \\[.3cm]
      a(1.391) &\approx (1.391 - 7)\sin(1.391) \approx {\color{#2563eb}{-5.519}} \quad (\text{Absolute minimum of } a) \\[.3cm]
      a(4.385) &\approx (4.385 - 7)\sin(4.385) \approx {\color{#2563eb}{2.482}} \quad (\text{Absolute maximum of } a) \\[.3cm]
      a(7) &= (7 - 7)\sin(7) = {\color{#2563eb}{0}}
      \end{aligned}
      $$
      Since $a(t)$ reaches its lowest value of $-5.519$ at $t \approx 1.391$, the velocity is decreasing most rapidly at $t = 1.391$.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $0$:** *Endpoint Without Evaluation Trap.* Picks the left endpoint $t = 0$, where $a(0) = 0$ (meaning velocity has zero instantaneous rate of change at $t = 0$, not its steepest decrease).
      * **(B) $1.391$:** **Correct.** Locates the absolute minimum of $a(t) = v'(t)$ on $[0, 7]$, where $a(1.391) \approx -5.519$.
      * **(C) $3.142$:** *Zero of Acceleration ($a(t) = 0$) Trap.* Finds $t = \pi \approx 3.142$ where $a(\pi) = 0$ (where acceleration changes sign from negative to positive, i.e., a local minimum of *velocity* itself rather than where velocity is decreasing most rapidly).
      * **(D) $4.385$:** *Maximum vs. Minimum Acceleration Trap.* Finds the other critical point of $a(t)$ at $t \approx 4.385$, which is the **absolute maximum** of $a(t)$ ($a(4.385) \approx +2.482$)—where velocity is **increasing** most rapidly rather than decreasing most rapidly.

  - id: "ap-calc-1b-q42"
    questionNumber: 42
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Contextual and Analytical Applications of Differentiation"
    skill: "2.E: Describe the relationships among different representations of functions and their derivatives."
    difficulty: "Medium"
    prompt: |
      Let $g$ be a twice-differentiable function such that $g''(x) > 0$ for all $x$. The graph of $y = S(x)$ is the secant line passing through the points $(2, g(2))$ and $(6, g(6))$. The graph of $y = T(x)$ is the line tangent to the graph of $g$ at $x = 5$. Which of the following is true?
    options:
      - id: "A"
        text: "$S(5.2) < g(5.2) < T(5.2)$"
      - id: "B"
        text: "$T(5.2) < S(5.2) < g(5.2)$"
      - id: "C"
        text: "$T(5.2) < g(5.2) < S(5.2)$"
      - id: "D"
        text: "$g(5.2) < T(5.2) < S(5.2)$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Order the three values $T(5.2)$, $g(5.2)$, and $S(5.2)$ from least to greatest by using the concavity condition $g''(x) > 0$ to compare a **tangent line** $T(x)$ at $x = 5$ and a **secant line** $S(x)$ across $[2, 6]$ against the curve $y = g(x)$ at the interior point $x = 5.2$.

      :::tabs
      == tab: Solving the question with Calculus
      Because this is a conceptual concavity-comparison item with no explicit formula for $g(x)$, translate $g''(x) > 0$ ("strictly concave up everywhere") into the geometric positions of tangent lines (always below the curve away from the point of tangency) and secant chords (always above the curve strictly between the endpoints).

      :::derivation
      == step: Determine the Concavity of g from g''(x) > 0
      -- why: Recall that a positive second derivative $g''(x) > 0$ means the slope $g'(x)$ is strictly increasing, so the graph of $g$ bends upward everywhere.
      $$
      g''(x) > 0 \text{ for all } x \implies \text{The graph of } g \text{ is } {\color{#2563eb}{\text{strictly concave up everywhere}}}
      $$

      == step: Compare the Tangent Line T(5.2) to the Curve g(5.2)
      -- why: Because $g$ is strictly concave up, the tangent line $y = T(x)$ at $x = 5$ lies strictly below the graph of $g$ for every $x \neq 5$ (tangent line approximations underestimate a concave-up curve).
      $$
      \begin{aligned}
      T(5) = g(5) \quad \text{and} \quad 5.2 \neq 5 \implies {\color{#2563eb}{T(5.2) < g(5.2)}}
      \end{aligned}
      $$

      == step: Compare the Secant Line S(5.2) to the Curve g(5.2)
      -- why: Because $g$ is strictly concave up, the secant chord $y = S(x)$ joining $(2, g(2))$ and $(6, g(6))$ lies strictly above the curve for every $x$ strictly inside $(2, 6)$; check that $5.2 \in (2, 6)$.
      $$
      \begin{aligned}
      2 < 5.2 < 6 \implies {\color{#2563eb}{g(5.2) < S(5.2)}}
      \end{aligned}
      $$

      == step: Chain the Two Inequalities Together at x = 5.2
      -- why: Combine $T(5.2) < g(5.2)$ and $g(5.2) < S(5.2)$ into a single three-way inequality.
      $$
      T(5.2) < g(5.2) < S(5.2)
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $S(5.2) < g(5.2) < T(5.2)$:** *Concavity Direction Reversal Trap.* Reverses the effect of $g''(x) > 0$, producing the ordering for a **concave-down** function ($g''(x) < 0$), where the secant chord sits below the curve and the tangent line sits above it.
      * **(B) $T(5.2) < S(5.2) < g(5.2)$:** *Secant Chord Below Curve Trap.* Correctly places the tangent line below $g(5.2)$, but mistakenly places the secant chord below $g(5.2)$ as well—ignoring that a bowl-shaped (concave-up) arc dips beneath the straight line connecting its endpoints $(2, g(2))$ and $(6, g(6))$.
      * **(C) $T(5.2) < g(5.2) < S(5.2)$:** **Correct.** For a strictly concave-up function on $(2, 6)$, the tangent line at $x = 5$ underestimates $g(5.2)$ while the secant line across $[2, 6]$ overestimates $g(5.2)$.
      * **(D) $g(5.2) < T(5.2) < S(5.2)$:** *Tangent Line Overestimate Trap.* Assumes tangent lines always lie above the curve ($g(5.2) < T(5.2)$), which happens only when $g''(x) < 0$ (concave down).

  - id: "ap-calc-1b-q43"
    questionNumber: 43
    questionType: "MC"
    layout: "single"
    correctAnswer: "D"
    domain: "Integration and Accumulation of Change"
    skill: "4.A: Use precise mathematical language to articulate reasoning."
    difficulty: "Medium"
    prompt: |
      The mass of a bacterial culture in a bioreactor at time $t$ hours is modeled by the function $M$ with first derivative $M'(t) = 0.6t^2 + 8t + 150$. At time $t = 0$, the mass of the culture is $50$ grams. Which of the following statements are true?

      - I. At time $t = 5$, the mass of the culture is $925$ grams.
      - II. At time $t = 5$, the mass of the culture is increasing at a rate of $205$ grams per hour.
      - III. At time $t = 5$, the rate of change of the mass of the culture is increasing at a rate of $14$ grams per hour per hour.
    options:
      - id: "A"
        text: "I and II only"
      - id: "B"
        text: "II only"
      - id: "C"
        text: "II and III only"
      - id: "D"
        text: "I, II, and III"
    explanation: |
      ### Takeoff: What were you asked to find?
      Verify three statements at $t = 5$ hours corresponding to three different derivative orders of the bacterial mass model: the **accumulated mass** $M(5)$ (Statement I), the **instantaneous growth rate** $M'(5)$ (Statement II), and the **rate of change of the growth rate** $M''(5)$ (Statement III).

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part B permits a graphing calculator and $M'(t)$ is a simple polynomial, you can evaluate $M(5)$, $M'(5)$, and $M''(5)$ analytically in seconds—or verify all three simultaneously in Desmos by defining $f(t) = 0.6t^2 + 8t + 150$ and evaluating `50 + \int_0^5 f(t) dt`, `f(5)`, and `f'(5)`.

      :::derivation
      == step: Verify Statement I — Total Mass M(5) via the Fundamental Theorem of Calculus
      -- why: Combine the initial mass $M(0) = 50$ grams with the net mass accumulated from $t = 0$ to $t = 5$ via $M(5) = M(0) + \displaystyle\int_{0}^{5} M'(t)\,dt$ (or enter `50 + \int_0^5 (0.6t^2 + 8t + 150) dt` on your calculator).
      $$
      \begin{aligned}
      M(5) &= {\color{#2563eb}{M(0)}} + \int_{0}^{5} \bigl(0.6t^2 + 8t + 150\bigr)\,dt \\[.4cm]
      &= {\color{#2563eb}{50}} + \Bigl[0.2t^3 + 4t^2 + 150t\Bigr]_{0}^{5} \\[.4cm]
      &= 50 + \bigl(0.2(125) + 4(25) + 150(5)\bigr) \\[.4cm]
      &= 50 + (25 + 100 + 750) = 50 + {\color{#2563eb}{875}} = 925\text{ grams}
      \end{aligned}
      $$
      Statement I is **true**.

      == step: Verify Statement II — Instantaneous Rate of Change M'(5)
      -- why: Substitute $t = 5$ directly into the given first derivative $M'(t) = 0.6t^2 + 8t + 150$ (whose units are grams per hour) and check that $M'(5) > 0$ ("increasing").
      $$
      \begin{aligned}
      M'(5) &= 0.6({\color{#2563eb}{5}})^2 + 8({\color{#2563eb}{5}}) + 150 \\[.4cm]
      &= 0.6(25) + 40 + 150 \\[.4cm]
      &= 15 + 40 + 150 = 205\text{ grams per hour}
      \end{aligned}
      $$
      Because $M'(5) = 205 > 0$, the mass is increasing at $205$ grams per hour at $t = 5$, so Statement II is **true**.

      == step: Verify Statement III — Second Derivative M''(5)
      -- why: Differentiate $M'(t)$ to find $M''(t)$ (the rate of change of the mass growth rate, in grams per hour per hour) and evaluate at $t = 5$ (or compute `f'(5)` on your calculator).
      $$
      \begin{aligned}
      M''(t) &= \frac{d}{dt}\bigl[0.6t^2 + 8t + 150\bigr] = {\color{#2563eb}{1.2t + 8}} \\[.4cm]
      M''(5) &= 1.2({\color{#2563eb}{5}}) + 8 = 6 + 8 = 14\text{ grams per hour per hour}
      \end{aligned}
      $$
      Because $M''(5) = 14 > 0$, the rate of change of the mass is increasing at $14$ grams per hour per hour at $t = 5$, so Statement III is **true**.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) I and II only:** *Second-Derivative Interpretation Trap.* Correctly verifies $M(5) = 925$ and $M'(5) = 205$, but rejects Statement III due to misinterpreting "rate of change of the rate of change" ($M''(5)$) or dropping the $1.2t$ coefficient when differentiating $0.6t^2$.
      * **(B) II only:** *Omitted Initial Condition & Second Derivative Trap.* Recognizes the direct evaluation $M'(5) = 205$, but misses both the initial mass $M(0) = 50$ in Statement I and the second derivative $M''(5) = 14$ in Statement III.
      * **(C) II and III only:** *Forgotten Initial Condition ($M(0) = 50$) Trap.* Computes only the net change $\displaystyle\int_{0}^{5} M'(t)\,dt = 875\text{ grams}$ without adding the starting mass $M(0) = 50\text{ grams}$, falsely concluding that Statement I ($925\text{ grams}$) is incorrect.
      * **(D) I, II, and III:** **Correct.** Accurately evaluates $M(5) = 50 + 875 = 925\text{ grams}$, $M'(5) = 205\text{ grams/hr}$, and $M''(5) = 14\text{ grams/hr}^2$.

  - id: "ap-calc-1b-q44"
    questionNumber: 44
    questionType: "MC"
    layout: "split"
    correctAnswer: "A"
    domain: "Applications of Integration"
    skill: "1.E: Apply appropriate mathematical rules or procedures, with and without technology."
    difficulty: "Hard"
    stimulus: |
      ![](./assets/APCalcAB-T1-S1B-Q40.svg)

      Let $R$ be the region in the first quadrant bounded by the graphs of $y = 3\cos\left(\dfrac{\pi x}{6}\right)$ and $y = \dfrac{1}{3}(x - 3)^2$, as shown in the figure above.
    prompt: |
      The region $R$ is the base of a solid. For the solid, each cross section perpendicular to the $x$-axis is a semicircle with its diameter in region $R$. What is the volume of the solid?
    options:
      - id: "A"
        text: "$1.176$"
      - id: "B"
        text: "$2.352$"
      - id: "C"
        text: "$2.994$"
      - id: "D"
        text: "$4.703$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the **volume** of a solid whose base is the first-quadrant region $R$ and whose cross sections perpendicular to the $x$-axis are **semicircles** with diameters spanning vertically across $R$, by integrating the semicircular cross-sectional area $A(x) = \dfrac{\pi}{8}[d(x)]^2$ from the left intersection to the right intersection.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part B permits a graphing calculator, set up the cross-sectional area function $A(x)$ analytically—carefully halving the vertical span $d(x)$ to get the radius $r(x) = \dfrac{d(x)}{2}$ before squaring—and evaluate the resulting volume integral in Desmos or with `fnInt` (in **radian mode**).

      :::derivation
      == step: Identify the Intersection Limits of Region R
      -- why: Check where the upper curve $y = 3\cos\left(\dfrac{\pi x}{6}\right)$ and lower curve $y = \dfrac{1}{3}(x - 3)^2$ meet in the first quadrant to determine the integration bounds $[a, b]$.
      $$
      \begin{aligned}
      \text{At } x = 0: &\quad 3\cos(0) = 3 \quad \text{and} \quad \frac{1}{3}(0 - 3)^2 = 3 \implies (0, 3) \\[.3cm]
      \text{At } x = 3: &\quad 3\cos\left(\frac{\pi}{2}\right) = 0 \quad \text{and} \quad \frac{1}{3}(3 - 3)^2 = 0 \implies (3, 0)
      \end{aligned}
      $$
      Thus, the region $R$ spans the closed interval $[{\color{#2563eb}{0}}, {\color{#2563eb}{3}}]$.

      == step: Express the Diameter d(x) and Semicircular Cross-Sectional Area A(x)
      -- why: Compute the vertical slice length $d(x) = \text{top} - \text{bottom}$, divide by $2$ to obtain the radius $r(x) = \dfrac{d(x)}{2}$, and substitute into $A = \dfrac{1}{2}\pi r^2$.
      $$
      \begin{aligned}
      d(x) &= {\color{#2563eb}{3\cos\left(\frac{\pi x}{6}\right) - \frac{1}{3}(x - 3)^2}} \\[.4cm]
      A(x) &= \frac{1}{2}\pi \Bigl[r(x)\Bigr]^2 = \frac{1}{2}\pi \left(\frac{{\color{#2563eb}{d(x)}}}{2}\right)^2 = {\color{#2563eb}{\frac{\pi}{8}\Bigl[d(x)\Bigr]^2}}
      \end{aligned}
      $$

      == step: Set Up and Evaluate the Volume Integral on a Graphing Calculator
      -- why: Confirm your calculator is in **radian mode**, define $f(x) = 3\cos(\pi x/6)$ and $g(x) = (1/3)(x - 3)^2$ in Desmos (or `Y1` and `Y2` on a TI calculator), and evaluate $V = \dfrac{\pi}{8}\displaystyle\int_{0}^{3} \bigl(f(x) - g(x)\bigr)^2\,dx$ in a single step before rounding to three decimal places.
      $$
      \begin{aligned}
      V &= \int_{0}^{3} A(x)\,dx \\[.4cm]
      &= \frac{\pi}{8} \int_{0}^{3} \left(3\cos\left(\frac{\pi x}{6}\right) - \frac{1}{3}(x - 3)^2\right)^2 dx \\[.4cm]
      &\approx \frac{\pi}{8}({\color{#2563eb}{2.99441}}) \approx 1.17590 \approx 1.176
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $1.176$:** **Correct.** Uses the semicircular area formula $A(x) = \dfrac{1}{2}\pi\left(\dfrac{d(x)}{2}\right)^2 = \dfrac{\pi}{8}[d(x)]^2$ and integrates in radian mode over $[0, 3]$ to obtain $1.176$.
      * **(B) $2.352$:** *Missing Factor of 1/2 (Full Circle vs. Semicircle) Trap.* Integrates $\dfrac{\pi}{4}\displaystyle\int_{0}^{3} [d(x)]^2\,dx \approx 2.352$, which gives the volume for **full circular** cross sections of diameter $d(x)$ rather than **semicircles**.
      * **(C) $2.994$:** *Square Cross-Section Formula Trap.* Evaluates $\displaystyle\int_{0}^{3} [d(x)]^2\,dx \approx 2.994$ without multiplying by $\dfrac{\pi}{8}$, computing the volume for **square** cross sections instead of semicircles.
      * **(D) $4.703$:** *Diameter-as-Radius Trap.* Treats the vertical distance $d(x)$ as the radius rather than the diameter ($A(x) = \dfrac{1}{2}\pi [d(x)]^2$), multiplying the correct answer by $4$ to get $\dfrac{\pi}{2}(2.99441) \approx 4.703$.
---