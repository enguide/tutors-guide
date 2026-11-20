---
sectionId: "ap-calc-ab-t1-s1a"
sectionTitle: "Section I, Part A (No Calculator)"
sectionOrder: 1
timeLimit: 3600
config:
  calculator: "none"
  hasFormulaSheet: false
  layout: "single"
questions:
  - id: "ap-calc-1a-q1"
    questionNumber: 1
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Limits and Continuity"
    skill: "Removing Discontinuities"
    difficulty: "Easy"
    prompt: |
      Let $f$ be the function given by $f(x) = \dfrac{3x^2 - 3x - 18}{x^2 - 5x + 6}$. For what values of $x$ does $f$ have a removable discontinuity?
    options:
      - id: "A"
        text: "$3$ only"
      - id: "B"
        text: "$2$ only"
      - id: "C"
        text: "$-2$ and $3$"
      - id: "D"
        text: "$2$ and $3$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify all $x$-values where the rational function $f(x)$ has a **removable discontinuity** (a hole where a common factor cancels and the two-sided limit exists), distinguishing it from a non-removable vertical asymptote.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive, factor the numerator and denominator completely to classify every zero of the denominator as either a hole (removable) or a vertical asymptote (non-removable).

      :::derivation
      == step: Factor Numerator and Denominator Completely
      -- why: Factor out the greatest common factor ($3$) in the numerator first so both quadratics can be factored cleanly into linear terms.
      $$
      \begin{aligned}
      f(x) &= \frac{3\left(x^2 - x - 6\right)}{x^2 - 5x + 6} \\[.4cm]
      &= \frac{3{\color{#2563eb}{(x - 3)}}(x + 2)}{{\color{#2563eb}{(x - 3)}}(x - 2)}
      \end{aligned}
      $$

      == step: Locate All Points of Discontinuity
      -- why: A rational function is undefined wherever its original denominator equals zero.
      $$
      \begin{aligned}
      (x - 3)(x - 2) &= 0 \\
      x = 3 \quad &\text{or} \quad x = 2
      \end{aligned}
      $$
      Thus, $f$ is discontinuous at both $x = 2$ and $x = 3$.

      == step: Classify Each Discontinuity via Limits
      -- why: A discontinuity at $x = c$ is **removable** if and only if $\lim_{x \to c} f(x)$ exists and is finite (caused by a canceled common factor).

      **At $x = 3$:** The common factor ${\color{#2563eb}{(x - 3)}}$ cancels for $x \neq 3$, leaving a finite limit:
      $$
      \begin{aligned}
      \lim_{x \to 3} f(x) &= \lim_{x \to 3} \frac{3(x + 2)}{x - 2} \\[.4cm]
      &= \frac{3(3 + 2)}{3 - 2} = 15
      \end{aligned}
      $$
      Because the two-sided limit exists while $f(3)$ is undefined, $x = \mathbf{\color{#16a34a}{3}}$ is a **removable discontinuity**.

      **At $x = 2$:** The factor $(x - 2)$ does not cancel. As $x \to 2$, the denominator approaches $0$ while the numerator approaches $3(4) = 12 \neq 0$, producing an infinite limit (vertical asymptote), which is **non-removable**.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $3$ only:** **Correct.** The common factor $(x - 3)$ cancels, creating a hole at $(3, 15)$, whereas $x = 2$ is a non-removable vertical asymptote.
      * **(B) $2$ only:** *Asymptote vs. Hole Trap.* Identifies the location of the non-removable vertical asymptote ($x = 2$) instead of the removable discontinuity ($x = 3$).
      * **(C) $-2$ and $3$:** *Numerator Zero Trap.* Confuses the $x$-intercept of the function ($x = -2$, where $f(-2) = 0$) with a point of discontinuity.
      * **(D) $2$ and $3$:** *Incomplete Classification Trap.* Lists all $x$-values where $f(x)$ is undefined without distinguishing between removable holes and non-removable vertical asymptotes.

  - id: "ap-calc-1a-q2"
    questionNumber: 2
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Differentiation: Definition and Fundamental Properties"
    skill: "Applying the Power Rule and Basic Derivative Rules"
    difficulty: "Easy"
    prompt: "If $f$ is the function given by $f(x) = \\dfrac{9}{x^2} + 4x + 3$, then $f'(3) =$"
    options:
      - id: "A"
        text: "$\\dfrac{8}{3}$"
      - id: "B"
        text: "$\\dfrac{10}{3}$"
      - id: "C"
        text: "$\\dfrac{14}{3}$"
      - id: "D"
        text: "$6$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Compute the instantaneous rate of change $f'(3)$ by rewriting the rational term with a negative exponent, applying the Power Rule term-by-term, and evaluating the resulting derivative at $x = 3$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive, rewrite fractional powers of $x$ using negative exponents ($\dfrac{c}{x^n} = c x^{-n}$) before differentiating so you can apply the Power Rule directly without using the Quotient Rule.

      :::derivation
      == step: Rewrite Rational Terms in Power Form
      -- why: Express $\dfrac{9}{x^2}$ with a negative exponent so the Power Rule $\dfrac{d}{dx}[x^n] = n x^{n-1}$ applies cleanly.
      $$
      \begin{aligned}
      f(x) &= \frac{9}{x^2} + 4x + 3 \\[.4cm]
      &= 9{\color{#2563eb}{x^{-2}}} + 4x + 3
      \end{aligned}
      $$

      == step: Differentiate Term-by-Term Using the Power Rule
      -- why: Multiply each coefficient by its exponent and decrease the exponent by $1$; the derivative of the constant $3$ is $0$.
      $$
      \begin{aligned}
      f'(x) &= 9(-2x^{-3}) + 4(1) + 0 \\[.4cm]
      &= -18{\color{#2563eb}{x^{-3}}} + 4 \\[.4cm]
      &= -\frac{18}{x^3} + 4
      \end{aligned}
      $$

      == step: Evaluate the Derivative at x = 3
      -- why: Substitute $x = 3$ into $f'(x)$, simplify the fraction before combining terms, and find a common denominator.
      $$
      \begin{aligned}
      f'(3) &= -\frac{18}{3^3} + 4 \\[.4cm]
      &= -\frac{18}{27} + 4 \\[.4cm]
      &= -\frac{2}{3} + \frac{12}{3} = \frac{10}{3}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\dfrac{8}{3}$:** *Arithmetic Fraction Trap.* Correctly reduces $-\dfrac{18}{27}$ to $-\dfrac{2}{3}$, but makes an arithmetic error when adding $4$ (evaluating $-\dfrac{2}{3} + \dfrac{10}{3} = \dfrac{8}{3}$).
      * **(B) $\dfrac{10}{3}$:** **Correct.** Rewrites $\dfrac{9}{x^2}$ as $9x^{-2}$, differentiates to $-\dfrac{18}{x^3} + 4$, and evaluates at $x = 3$ to get $-\dfrac{2}{3} + 4 = \dfrac{10}{3}$.
      * **(C) $\dfrac{14}{3}$:** *Sign Omission Trap.* Forgets the negative sign when bringing down the $-2$ exponent, computing $+\dfrac{2}{3} + 4 = \dfrac{14}{3}$.
      * **(D) $6$:** *Denominator-Only Differentiation Trap.* Differentiates $x^2$ directly in the denominator to write $f'(x) = \dfrac{9}{2x} + 4$, yielding $\dfrac{9}{6} + 4 = 5.5$ (and rounding or miscalculating to $6$).

  - id: "ap-calc-1a-q3"
    questionNumber: 3
    questionType: "MC"
    layout: "single"
    correctAnswer: "D"
    domain: "Limits and Continuity"
    skill: "Determining Limits from Graphs"
    difficulty: "Easy"
    prompt: |
      ![](./assets/APCalcAB-T1-S1A-Q3.svg)

      The graph of $y = g(x)$ is shown above. What is $\lim\limits_{x \to 2} g(x)$?
    options:
      - id: "A"
        text: "$-1$"
      - id: "B"
        text: "$1$"
      - id: "C"
        text: "$4$"
      - id: "D"
        text: "The limit does not exist."
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine the two-sided limit $\lim_{x \to 2} g(x)$ from the graph by checking whether the left-hand and right-hand limits approach the same $y$-value as $x$ gets arbitrarily close to $2$ (regardless of the solid dot value $g(2)$).

      :::tabs
      == tab: Solving the question with Calculus
      By definition, a two-sided limit $\lim_{x \to c} g(x)$ exists if and only if both one-sided limits exist and are equal: $\lim_{x \to c^-} g(x) = \lim_{x \to c^+} g(x)$. Inspect the behavior of the curve immediately to the left and right of $x = 2$.

      :::derivation
      == step: Evaluate the Left-Hand Limit
      -- why: Trace the graph as $x$ approaches $2$ from values strictly less than $2$ ($x \to 2^-$) to identify the $y$-value the curve approaches.
      $$
      \lim_{x \to 2^-} g(x) = \color{#2563eb}{1}
      $$
      *(The left branch approaches the open circle at $(2, 1)$.)*

      == step: Evaluate the Right-Hand Limit
      -- why: Trace the graph as $x$ approaches $2$ from values strictly greater than $2$ ($x \to 2^+$) to identify the $y$-value the curve approaches.
      $$
      \lim_{x \to 2^+} g(x) = \color{#2563eb}{4}
      $$
      *(The right branch approaches the open circle at $(2, 4)$.)*

      == step: Compare One-Sided Limits for Existence
      -- why: Because the graph exhibits a jump discontinuity at $x = 2$, the left-hand and right-hand limits do not match.
      $$
      \begin{aligned}
      \lim_{x \to 2^-} g(x) &\neq \lim_{x \to 2^+} g(x) \\[.3cm]
      \color{#2563eb}{1} &\neq \color{#2563eb}{4}
      \end{aligned}
      $$
      Because the one-sided limits are unequal, $\lim_{x \to 2} g(x)$ does not exist.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $-1$:** *Function Value vs. Limit Trap.* Reports the defined point value $g(2) = -1$ (the solid dot), which has no effect on the existence or value of the limit as $x \to 2$.
      * **(B) $1$:** *One-Sided Limit Trap (Left).* Evaluates only the left-hand limit $\lim_{x \to 2^-} g(x) = 1$ without checking whether the right-hand limit agrees.
      * **(C) $4$:** *One-Sided Limit Trap (Right).* Evaluates only the right-hand limit $\lim_{x \to 2^+} g(x) = 4$ without checking whether the left-hand limit agrees.
      * **(D) The limit does not exist.:** **Correct.** Because $\lim_{x \to 2^-} g(x) = 1 \neq 4 = \lim_{x \to 2^+} g(x)$, the two-sided limit does not exist.

  - id: "ap-calc-1a-q4"
    questionNumber: 4
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Integration and Accumulation of Change"
    skill: "Antiderivatives and Indefinite Integrals"
    difficulty: "Easy"
    prompt: "$\\displaystyle\\int 8e^{4x} \\, dx =$"
    options:
      - id: "A"
        text: "$2e^{4x} + C$"
      - id: "B"
        text: "$8e^{4x} + C$"
      - id: "C"
        text: "$32e^{4x} + C$"
      - id: "D"
        text: "$\\dfrac{8e^{4x+1}}{4x+1} + C$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Evaluate the indefinite integral $\displaystyle\int 8e^{4x} \, dx$ using $u$-substitution to account for the inner linear exponent $4x$, remembering to include the constant of integration $+ C$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive, apply $u$-substitution to reverse the Chain Rule for an exponential composite function of the form $\displaystyle\int e^{kx} \, dx = \dfrac{1}{k}e^{kx} + C$.

      :::derivation
      == step: Define the Substitution Variable u and Differential du
      -- why: Set $u$ equal to the inner linear exponent $4x$ and differentiate with respect to $x$ so the differential $dx$ can be replaced cleanly.
      $$
      \begin{aligned}
      u &= \color{#2563eb}{4x} \\[.3cm]
      du &= 4 \, dx \implies dx = \color{#2563eb}{\frac{1}{4} \, du}
      \end{aligned}
      $$

      == step: Rewrite the Integral in Terms of u
      -- why: Substitute $u = 4x$ and $dx = \dfrac{1}{4} \, du$ into the integrand, then factor the constant coefficients outside the integral.
      $$
      \begin{aligned}
      \int 8e^{4x} \, dx &= \int 8e^{\color{#2563eb}{u}} \left({\color{#2563eb}{\frac{1}{4} \, du}} \right) \\[.4cm]
      &= 2 \int e^u \, du
      \end{aligned}
      $$

      == step: Integrate and Back-Substitute u = 4x
      -- why: Apply the basic exponential antiderivative $\int e^u \, du = e^u + C$ and replace $u$ with the original expression in terms of $x$.
      $$
      \begin{aligned}
      2 \int e^u \, du &= 2e^u + C \\[.4cm]
      &= 2e^{4x} + C
      \end{aligned}
      $$
      *(Quick check: Differentiating $2e^{4x} + C$ via the Chain Rule gives $2 \cdot 4e^{4x} = 8e^{4x}$, confirming the antiderivative.)*
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $2e^{4x} + C$:** **Correct.** Divides the coefficient $8$ by the inner derivative $4$ during $u$-substitution to yield $2e^{4x} + C$.
      * **(B) $8e^{4x} + C$:** *Chain Rule Factor Omission Trap.* Integrates $e^{4x}$ as if the exponent were simply $x$, forgetting to divide by the inner derivative $k = 4$.
      * **(C) $32e^{4x} + C$:** *Differentiation vs. Integration Trap.* Multiplies by the inner derivative ($8 \times 4 = 32$) instead of dividing by it, applying the Chain Rule for derivatives rather than antiderivatives.
      * **(D) $\dfrac{8e^{4x+1}}{4x+1} + C$:** *Power Rule Misapplication Trap.* Treats the exponential expression $e^{4x}$ like a variable base $x^n$ and erroneously applies $\dfrac{x^{n+1}}{n+1}$.

  - id: "ap-calc-1a-q5"
    questionNumber: 5
    questionType: "MC"
    layout: "split"
    correctAnswer: "C"
    domain: "Integration and Accumulation of Change"
    skill: "Riemann Sums and Definite Integral Approximations"
    difficulty: "Medium"
    stimulus: |
      | $t \textrm{ (minutes)}$ | $0$ | $4$ | $10$ | $16$ |
      | :--- | :---: | :---: | :---: | :---: |
      | $W(t) \textrm{ (gallons per minute)}$ | $80$ | $80$ | $65$ | $45$ |

      Water is pumped into a municipal storage tank at a rate of $W(t)$ gallons per minute, where $t$ is measured in minutes for $0 \le t \le 16$. Selected values of the strictly decreasing rate function $W(t)$ are shown in the table above.
    prompt: |
      Using a right Riemann sum with the three subintervals indicated by the data in the table, what is the approximation of the total number of gallons of water pumped into the tank during the first $16$ minutes?
    options:
      - id: "A"
        text: "$190$"
      - id: "B"
        text: "$760$"
      - id: "C"
        text: "$980$"
      - id: "D"
        text: "$1{,}190$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Approximate the total volume of water $\displaystyle\int_{0}^{16} W(t) \, dt$ pumped into the tank over $[0, 16]$ using a **right Riemann sum** across the three unequal subintervals defined by the table data.

      :::tabs
      == tab: Solving the question with Calculus
      Because the table measurements are not evenly spaced ($t = 0, 4, 10, 16$), compute the width $\Delta t_i$ of each subinterval individually and multiply each width by the rate $W(t)$ at its **right endpoint**.

      :::derivation
      == step: Identify Subinterval Widths and Right Endpoints
      -- why: Partition $[0, 16]$ using the four consecutive table times and extract the width $\Delta t$ and right-endpoint height $W(t_{\text{right}})$ for each subinterval.
      $$
      \begin{aligned}
      \text{Subinterval } [0, 4]: \quad \Delta t_1 &= 4 - 0 = \color{#2563eb}{4}, \quad W(4) = \color{#2563eb}{80} \\[.3cm]
      \text{Subinterval } [4, 10]: \quad \Delta t_2 &= 10 - 4 = \color{#2563eb}{6}, \quad W(10) = \color{#2563eb}{65} \\[.3cm]
      \text{Subinterval } [10, 16]: \quad \Delta t_3 &= 16 - 10 = \color{#2563eb}{6}, \quad W(16) = \color{#2563eb}{45}
      \end{aligned}
      $$

      == step: Set Up and Evaluate the Right Riemann Sum
      -- why: Multiply each subinterval width by its corresponding right-endpoint rate and sum the three rectangular approximations.
      $$
      \begin{aligned}
      \int_{0}^{16} W(t) \, dt &\approx \Delta t_1 \cdot W(4) + \Delta t_2 \cdot W(10) + \Delta t_3 \cdot W(16) \\[.4cm]
      &= (\color{#2563eb}{4})(\color{#2563eb}{80}) + (\color{#2563eb}{6})(\color{#2563eb}{65}) + (\color{#2563eb}{6})(\color{#2563eb}{45}) \\[.4cm]
      &= 320 + 390 + 270 \\[.4cm]
      &= 980\text{ gallons}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $190$:** *Missing Widths Trap.* Sums the right-endpoint rates directly ($80 + 65 + 45 = 190$) without multiplying each rate by its subinterval duration $\Delta t_i$.
      * **(B) $760$:** *Equal-Width Assumption Trap.* Assumes a uniform width of $\Delta t = 4$ across all three subintervals ($4(80 + 65 + 45) = 760$) rather than noting that the second and third intervals have width $6$.
      * **(C) $980$:** **Correct.** Accurately accounts for the unequal subinterval widths ($4, 6, 6$) and multiplies by the right-endpoint rates ($80, 65, 45$) to obtain $320 + 390 + 270 = 980$.
      * **(D) $1{,}190$:** *Left vs. Right Riemann Sum Trap.* Computes a **left** Riemann sum using the left-endpoint values $W(0) = 80$, $W(4) = 80$, and $W(10) = 65$, giving $4(80) + 6(80) + 6(65) = 1{,}190$.

  - id: "ap-calc-1a-q6"
    questionNumber: 6
    questionType: "MC"
    layout: "single"
    correctAnswer: "D"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "Applying the Product Rule"
    difficulty: "Medium"
    prompt: |
      If $y = x^3(e^x + 2)$, then $\dfrac{dy}{dx} =$
    options:
      - id: "A"
        text: "$3x^2 e^x$"
      - id: "B"
        text: "$3x^2 e^x + 6x^2$"
      - id: "C"
        text: "$x^3 e^x + 3x^2 e^x + 2x^3$"
      - id: "D"
        text: "$x^3 e^x + 3x^2 e^x + 6x^2$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Compute the first derivative $\dfrac{dy}{dx}$ of the product $y = x^3(e^x + 2)$ using the **Product Rule**, then expand and arrange the resulting polynomial-exponential terms to match the target choices.

      :::tabs
      == tab: Solving the question with Calculus
      Because $y$ is written as the product of two variable expressions, $u = x^3$ and $v = e^x + 2$, apply the Product Rule $\dfrac{d}{dx}[u \cdot v] = u'v + uv'$ directly rather than differentiating each factor separately.

      :::derivation
      == step: Identify Factors and Compute Individual Derivatives
      -- why: Label the two multiplicative factors $u$ and $v$ and find their respective derivatives $u'$ and $v'$ using the Power Rule and exponential derivative rule.
      $$
      \begin{aligned}
      u &= x^3 \implies u' = \color{#2563eb}{3x^2} \\[.3cm]
      v &= e^x + 2 \implies v' = \color{#2563eb}{e^x}
      \end{aligned}
      $$

      == step: Apply the Product Rule Formula
      -- why: Substitute $u$, $v$, $u'$, and $v'$ into $\dfrac{dy}{dx} = u'v + uv'$.
      $$
      \begin{aligned}
      \frac{dy}{dx} &= u'v + uv' \\[.4cm]
      &= (\color{#2563eb}{3x^2})(e^x + 2) + (x^3)(\color{#2563eb}{e^x})
      \end{aligned}
      $$

      == step: Distribute and Reorder Terms
      -- why: Expand the product $3x^2(e^x + 2)$ and arrange terms in descending order of powers of $x$ to match the answer choices.
      $$
      \begin{aligned}
      \frac{dy}{dx} &= 3x^2 e^x + 6x^2 + x^3 e^x \\[.4cm]
      &= x^3 e^x + 3x^2 e^x + 6x^2
      \end{aligned}
      $$
      *(Alternative check: Expanding $y = x^3 e^x + 2x^3$ first and differentiating term-by-term gives $(3x^2 e^x + x^3 e^x) + 6x^2 = x^3 e^x + 3x^2 e^x + 6x^2$.)*
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $3x^2 e^x$:** *Product-of-Derivatives Trap.* Erroneously differentiates each factor individually and multiplies them together ($(3x^2)(e^x)$) instead of applying $u'v + uv'$.
      * **(B) $3x^2 e^x + 6x^2$:** *Partial Product Rule Trap.* Computes $u'v = 3x^2(e^x + 2)$ accurately, but forgets to add the second half of the Product Rule ($uv' = x^3 e^x$).
      * **(C) $x^3 e^x + 3x^2 e^x + 2x^3$:** *Incomplete Term Differentiation Trap.* Expands $y = x^3 e^x + 2x^3$ and applies the Product Rule to $x^3 e^x$, but forgets to differentiate the remaining $+ 2x^3$ term.
      * **(D) $x^3 e^x + 3x^2 e^x + 6x^2$:** **Correct.** Applies the Product Rule completely and simplifies $3x^2(e^x + 2) + x^3 e^x$ to $x^3 e^x + 3x^2 e^x + 6x^2$.

  - id: "ap-calc-1a-q7"
    questionNumber: 7
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Differential Equations"
    skill: "Finding Particular Solutions Using Initial Conditions"
    difficulty: "Medium"
    prompt: |
      If $f'(x) = 3x^2 - 4x$ and $f(3) = 5$, then $f(1) =$
    options:
      - id: "A"
        text: "$-5$"
      - id: "B"
        text: "$-1$"
      - id: "C"
        text: "$3$"
      - id: "D"
        text: "$13$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine the function value $f(1)$ from its derivative $f'(x) = 3x^2 - 4x$ and the initial condition $f(3) = 5$ by finding the particular antiderivative (solving for $+ C$) or by applying the Fundamental Theorem of Calculus backwards from $x = 3$ to $x = 1$.

      :::tabs
      == tab: Solving the question with Antiderivatives
      Integrating $f'(x)$ produces a family of functions differing by a constant $C$. Use the given condition $f(3) = 5$ to pin down $C$ before evaluating at $x = 1$.

      :::derivation
      == step: Find the General Antiderivative of f'(x)
      -- why: Apply the Power Rule for antiderivatives term-by-term and include the constant of integration $+ C$.
      $$
      \begin{aligned}
      f(x) &= \int (3x^2 - 4x) \, dx \\[.4cm]
      &= x^3 - 2x^2 + \color{#2563eb}{C}
      \end{aligned}
      $$

      == step: Use the Initial Condition f(3) = 5 to Solve for C
      -- why: Substitute $x = 3$ and $f(3) = 5$ into the general antiderivative to isolate $C$.
      $$
      \begin{aligned}
      f(3) &= (3)^3 - 2(3)^2 + \color{#2563eb}{C} = 5 \\[.3cm]
      27 - 18 + \color{#2563eb}{C} &= 5 \\[.3cm]
      9 + \color{#2563eb}{C} &= 5 \implies \color{#2563eb}{C = -4}
      \end{aligned}
      $$

      == step: Write the Particular Solution and Evaluate at x = 1
      -- why: Replace $C$ with $-4$ to form the unique function $f(x)$, then substitute $x = 1$.
      $$
      \begin{aligned}
      f(x) &= x^3 - 2x^2 - 4 \\[.3cm]
      f(1) &= (1)^3 - 2(1)^2 - 4 \\[.3cm]
      &= 1 - 2 - 4 = -5
      \end{aligned}
      $$
      :::

      == tab: Solving with the Fundamental Theorem of Calculus
      You can bypass solving explicitly for $C$ by expressing $f(1)$ in terms of the known anchor value $f(3)$ and the definite integral from $3$ to $1$.

      :::derivation
      == step: Set Up the Accumulation Equation from x = 3 to x = 1
      -- why: By the Fundamental Theorem of Calculus, $f(b) = f(a) + \int_{a}^{b} f'(x) \, dx$. Reverse the limits of integration so the lower limit is smaller than the upper limit.
      $$
      \begin{aligned}
      f(1) &= f(3) + \int_{3}^{1} (3x^2 - 4x) \, dx \\[.4cm]
      &= \color{#2563eb}{5} - \int_{1}^{3} (3x^2 - 4x) \, dx
      \end{aligned}
      $$

      == step: Evaluate the Definite Integral and Subtract from f(3)
      -- why: Compute the net change on $[1, 3]$ and subtract it from $5$ since we are moving backward from $x = 3$ to $x = 1$.
      $$
      \begin{aligned}
      f(1) &= 5 - \Bigl[ x^3 - 2x^2 \Bigr]_{1}^{3} \\[.4cm]
      &= 5 - \Bigl[ (27 - 18) - (1 - 2) \Bigr] \\[.4cm]
      &= 5 - \bigl[ 9 - (-1) \bigr] \\[.4cm]
      &= 5 - 10 = -5
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $-5$:** **Correct.** Solves for $C = -4$ using $f(3) = 5$ and evaluates $f(1) = 1 - 2 - 4 = -5$.
      * **(B) $-1$:** *Constant of Integration Omission Trap.* Forgets $+ C$ entirely when integrating $f'(x)$, computing $f(1) = (1)^3 - 2(1)^2 = -1$ while ignoring the condition $f(3) = 5$.
      * **(C) $3$:** *Sign Error on $C$ Trap.* Solves $9 + C = 5$ as $C = +4$ instead of $-4$, leading to $1 - 2 + 4 = 3$.
      * **(D) $13$:** *Limit Direction / Sign Reversal Trap.* Evaluates $f(3) + \int_{1}^{3} f'(x)\,dx = 5 + 10 = 15$ (or miscalculates the net change as $+8$ to get $5 + 8 = 13$), forgetting that moving backward from $x = 3$ to $x = 1$ requires subtracting the forward integral.

  - id: "ap-calc-1a-q8"
    questionNumber: 8
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Differentiation: Analytical Applications of Differentiation"
    skill: "Applying the Mean Value Theorem"
    difficulty: "Easy"
    prompt: |
      Let $h$ be a twice-differentiable, increasing function of $t$. If $h(0) = 15$ and $h(8) = 175$, which of the following must be true on the interval $0 < t < 8$ ?
    options:
      - id: "A"
        text: "$h'(t) = 0$ for some $t$ in the interval."
      - id: "B"
        text: "$h'(t) = 20$ for some $t$ in the interval."
      - id: "C"
        text: "$h''(t) = 0$ for some $t$ in the interval."
      - id: "D"
        text: "$h''(t) > 0$ for all $t$ in the interval."
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify a guaranteed statement about the derivatives of $h$ on $(0, 8)$ by verifying the hypotheses of the **Mean Value Theorem (MVT)** and equating the instantaneous rate of change $h'(t)$ to the average rate of change over $[0, 8]$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and no explicit formula for $h(t)$ is given, apply existence theorems directly by checking continuity and differentiability on $[0, 8]$.

      :::derivation
      == step: Verify Mean Value Theorem Hypotheses
      -- why: Differentiability implies continuity, so a twice-differentiable function satisfies both prerequisites of the Mean Value Theorem on any closed interval.
      Because $h$ is twice-differentiable everywhere, $h$ is:
      * **Continuous** on the closed interval $[0, 8]$, and
      * **Differentiable** on the open interval $(0, 8)$.

      == step: Compute the Average Rate of Change Over [0, 8]
      -- why: Calculate the secant slope $\dfrac{h(b) - h(a)}{b - a}$ using the endpoint values $h(0) = 15$ and $h(8) = 175$.
      $$
      \begin{aligned}
      \text{Average Rate of Change} &= \frac{h(8) - h(0)}{8 - 0} \\[.4cm]
      &= \frac{\color{#2563eb}{175} - \color{#2563eb}{15}}{8 - 0} \\[.4cm]
      &= \frac{160}{8} = 20
      \end{aligned}
      $$

      == step: Apply the Mean Value Theorem Conclusion
      -- why: MVT guarantees at least one number $t$ in the open interval $(0, 8)$ where the instantaneous derivative $h'(t)$ equals the average rate of change.
      $$
      h'(t) = 20 \quad \text{for some } t \in (0, 8)
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $h'(t) = 0$ for some $t$ in the interval.:** *Rolle's Theorem Misapplication Trap.* A zero derivative on $(a, b)$ is guaranteed only when $h(a) = h(b)$. Here $h(0) = 15 \neq 175 = h(8)$ (and $h$ is strictly increasing), so $h'(t)$ need never equal $0$.
      * **(B) $h'(t) = 20$ for some $t$ in the interval.:** **Correct.** Because $h$ is continuous on $[0, 8]$ and differentiable on $(0, 8)$, the Mean Value Theorem guarantees at least one $t \in (0, 8)$ where $h'(t) = \dfrac{175 - 15}{8 - 0} = 20$.
      * **(C) $h''(t) = 0$ for some $t$ in the interval.:** *Unwarranted Inflection Point Trap.* Being twice-differentiable does not force $h$ to change concavity. For example, $h(t) = 15 + \dfrac{5}{2}t^2$ satisfies all conditions while having $h''(t) = 5 \neq 0$ everywhere.
      * **(D) $h''(t) > 0$ for all $t$ in the interval.:** *Assumed Concavity Trap.* An increasing function can be linear ($h''(t) = 0$), concave down ($h''(t) < 0$), or have mixed concavity; nothing in the prompt forces $h$ to be strictly concave up.

  - id: "ap-calc-1a-q9"
    questionNumber: 9
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Differentiation: Definition and Fundamental Properties"
    skill: "Defining the Derivative of a Function and Using Derivative Notation"
    difficulty: "Medium"
    prompt: |
      When $x = 5e$, $\lim\limits_{h \to 0} \dfrac{\ln(x+h) - \ln(x)}{h}$ is
    options:
      - id: "A"
        text: "$\\dfrac{1}{5e}$"
      - id: "B"
        text: "$\\dfrac{1}{5}$"
      - id: "C"
        text: "$\\ln(5e)$"
      - id: "D"
        text: "nonexistent"
    explanation: |
      ### Takeoff: What were you asked to find?
      Evaluate the difference-quotient limit $\lim\limits_{h \to 0} \dfrac{\ln(x+h) - \ln(x)}{h}$ at $x = 5e$ by recognizing it as the **limit definition of the derivative** $f'(x)$ for $f(x) = \ln(x)$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive, avoid algebraic expansion of $\ln(x + h)$. Instead, match the limit structure directly to $f'(x) = \lim\limits_{h \to 0} \dfrac{f(x+h) - f(x)}{h}$.

      :::derivation
      == step: Match the Limit to the Definition of the Derivative
      -- why: Compare $\lim\limits_{h \to 0} \dfrac{\ln(x+h) - \ln(x)}{h}$ against the standard limit definition $f'(x) = \lim\limits_{h \to 0} \dfrac{f(x+h) - f(x)}{h}$ to identify the underlying function $f(x)$.
      $$
      \begin{aligned}
      f'(x) &= \lim_{h \to 0} \frac{f(x+h) - f(x)}{h} \\[.4cm]
      &= \lim_{h \to 0} \frac{\ln(x+h) - \ln(x)}{h} \implies f(x) = \color{#2563eb}{\ln(x)}
      \end{aligned}
      $$

      == step: Differentiate the Identified Function f(x)
      -- why: Apply the standard logarithmic derivative rule $\dfrac{d}{dx}[\ln(x)] = \dfrac{1}{x}$.
      $$
      f'(x) = \frac{d}{dx}[\color{#2563eb}{\ln(x)}] = \color{#2563eb}{\frac{1}{x}}
      $$

      == step: Evaluate f'(x) at x = 5e
      -- why: Substitute $x = 5e$ into $f'(x) = \dfrac{1}{x}$, treating $e$ as Euler's constant (not a variable).
      $$
      f'(5e) = \frac{1}{5e}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\dfrac{1}{5e}$:** **Correct.** Recognizes the limit as $f'(x) = \dfrac{1}{x}$ for $f(x) = \ln(x)$ and evaluates at $x = 5e$ to obtain $\dfrac{1}{5e}$.
      * **(B) $\dfrac{1}{5}$:** *Constant Factor Omission Trap.* Differentiates $\ln(x)$ properly to $\dfrac{1}{x}$, but drops Euler's constant $e$ from the denominator when substituting $x = 5e$.
      * **(C) $\ln(5e)$:** *Function vs. Derivative Trap.* Evaluates the original function $f(5e) = \ln(5e)$ instead of its derivative $f'(5e)$.
      * **(D) nonexistent:** *Indeterminate Form Trap.* Concludes the limit does not exist simply because direct substitution of $h = 0$ yields the indeterminate form $\dfrac{0}{0}$.

  - id: "ap-calc-1a-q10"
    questionNumber: 10
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Integration and Accumulation of Change"
    skill: "The Fundamental Theorem of Calculus and Accumulation Functions"
    difficulty: "Medium"
    prompt: |
      $\dfrac{d}{dx} \displaystyle\int_{1}^{x^4} \mkern-9mu \sqrt{t^2 + 5} \, dt =$
    options:
      - id: "A"
        text: "$\\sqrt{x^8 + 5}$"
      - id: "B"
        text: "$4x^3 \\sqrt{x^4 + 5}$"
      - id: "C"
        text: "$4x^3 \\sqrt{x^8 + 5}$"
      - id: "D"
        text: "$\\sqrt{x^8 + 5} - \\sqrt{6}$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Differentiate the accumulation function $\displaystyle\int_{1}^{x^4} \sqrt{t^2 + 5} \, dt$ with respect to $x$ by combining the **First Fundamental Theorem of Calculus** with the **Chain Rule** to account for the variable upper limit $u(x) = x^4$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive (and $\sqrt{t^2 + 5}$ has no elementary closed-form antiderivative), do not attempt to integrate first. Instead, apply $\dfrac{d}{dx} \displaystyle\int_{a}^{u(x)} f(t) \, dt = f(u(x)) \cdot u'(x)$ directly.

      :::derivation
      == step: Identify the Integrand and Upper Limit Components
      -- why: Confirm that the lower limit $a = 1$ is a constant (contributing $0$ upon differentiation) and isolate the integrand $f(t)$ and variable upper limit $u(x)$ along with its derivative $u'(x)$.
      $$
      \begin{aligned}
      f(t) &= \sqrt{t^2 + 5} \\[.3cm]
      u(x) &= \color{#2563eb}{x^4} \implies u'(x) = \color{#2563eb}{4x^3}
      \end{aligned}
      $$

      == step: Apply the Fundamental Theorem of Calculus with the Chain Rule
      -- why: Replace the dummy variable $t$ in the integrand with the upper limit $u(x) = x^4$ and multiply by the inner derivative $u'(x) = 4x^3$.
      $$
      \begin{aligned}
      \frac{d}{dx} \int_{1}^{{\color{#2563eb}{x^4}}} \sqrt{t^2 + 5} \, dt &= f\bigl({\color{#2563eb}{x^4}}\bigr) \cdot \color{#2563eb}{4x^3} \\[.4cm]
      &= \sqrt{(\color{#2563eb}{x^4})^2 + 5} \cdot \color{#2563eb}{4x^3}
      \end{aligned}
      $$

      == step: Simplify the Exponent Inside the Radical
      -- why: Apply the power-of-a-power rule $(x^4)^2 = x^{4 \cdot 2} = x^8$ and write the polynomial factor in front of the radical.
      $$
      \begin{aligned}
      \sqrt{(x^4)^2 + 5} \cdot 4x^3 &= 4x^3 \sqrt{x^8 + 5}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\sqrt{x^8 + 5}$:** *Chain Rule Omission Trap.* Substitutes $u(x) = x^4$ into the integrand properly, but forgets to multiply by the derivative of the upper limit ($u'(x) = 4x^3$).
      * **(B) $4x^3 \sqrt{x^4 + 5}$:** *Algebraic Substitution Trap.* Includes the Chain Rule factor $4x^3$, but substitutes $x^4$ in place of $t^2$ rather than squaring $x^4$ to get $(x^4)^2 = x^8$.
      * **(C) $4x^3 \sqrt{x^8 + 5}$:** **Correct.** Evaluates $f(x^4) \cdot u'(x) = \sqrt{(x^4)^2 + 5} \cdot 4x^3 = 4x^3 \sqrt{x^8 + 5}$.
      * **(D) $\sqrt{x^8 + 5} - \sqrt{6}$:** *Evaluation Theorem Confusion Trap.* Treats differentiation of an integral like evaluating $f(x^4) - f(1)$ directly on the integrand without differentiating, while also omitting $u'(x) = 4x^3$.

  - id: "ap-calc-1a-q11"
    questionNumber: 11
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "Differentiating Implicit Relations"
    difficulty: "Medium"
    prompt: |
      Given that $5x + \cot y = 7$, what is $\dfrac{dy}{dx}$ in terms of $y$?
    options:
      - id: "A"
        text: "$\\dfrac{dy}{dx} = 5 \\sin^2 y$"
      - id: "B"
        text: "$\\dfrac{dy}{dx} = -5 \\sin^2 y$"
      - id: "C"
        text: "$\\dfrac{dy}{dx} = 5 \\cos^2 y$"
      - id: "D"
        text: "$\\dfrac{dy}{dx} = -5 \\csc y \\cot y$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Find $\dfrac{dy}{dx}$ in terms of $y$ using **implicit differentiation** (applying the Chain Rule when differentiating $\cot y$ with respect to $x$), then simplify the resulting trigonometric ratio with a reciprocal identity.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and $y$ is defined implicitly as a function of $x$, differentiate both sides of $5x + \cot y = 7$ with respect to $x$, attaching $\dfrac{dy}{dx}$ to the derivative of any $y$-term.

      :::derivation
      == step: Differentiate Both Sides Implicitly with Respect to x
      -- why: Apply the Chain Rule to $\cot y$ using $\dfrac{d}{dx}[\cot y] = -\csc^2 y\cdot\dfrac{dy}{dx}$.
      $$
      \begin{aligned}
      \frac{d}{dx}[5x + \cot y] &= \frac{d}{dx}[7] \\[.4cm]
      5 + ({\color{#2563eb}{-\csc^2 y}\cdot\frac{dy}{dx}}) &= 0
      \end{aligned}
      $$

      == step: Isolate dy/dx Algebraically
      -- why: Move the $\csc^2 y \dfrac{dy}{dx}$ term to the right-hand side and divide both sides by $\csc^2 y$.
      $$
      \begin{aligned}
      \color{#2563eb}{\csc^2 y} \cdot \frac{dy}{dx} &= 5 \\[.4cm]
      \frac{dy}{dx} &= \frac{5}{\color{#2563eb}{\csc^2 y}}
      \end{aligned}
      $$

      == step: Rewrite Using the Reciprocal Trigonometric Identity
      -- why: Use $\dfrac{1}{\csc y} = \sin y$ (so $\dfrac{1}{\csc^2 y} = \sin^2 y$) to express the derivative cleanly without a denominator.
      $$
      \frac{dy}{dx} = 5 \sin^2 y
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\dfrac{dy}{dx} = 5 \sin^2 y$:** **Correct.** Differentiates $\cot y$ to $-\csc^2 y \dfrac{dy}{dx}$, isolates $\dfrac{dy}{dx} = \dfrac{5}{\csc^2 y}$, and applies $\dfrac{1}{\csc^2 y} = \sin^2 y$.
      * **(B) $\dfrac{dy}{dx} = -5 \sin^2 y$:** *Trigonometric Derivative Sign Trap.* Uses $+\csc^2 y$ instead of $-\csc^2 y$ as the derivative of $\cot y$, leaving an extraneous negative sign when isolating $\dfrac{dy}{dx}$.
      * **(C) $\dfrac{dy}{dx} = 5 \cos^2 y$:** *Reciprocal Identity Confusion Trap.* Erroneously recalls the reciprocal of $\csc y$ as $\cos y$ (which is actually the reciprocal of $\sec y$) rather than $\sin y$.
      * **(D) $\dfrac{dy}{dx} = -5 \csc y \cot y$:** *Wrong Cofunction Derivative & Algebra Trap.* Confuses $\dfrac{d}{dy}[\cot y] = -\csc^2 y$ with $\dfrac{d}{dy}[\csc y] = -\csc y \cot y$, and multiplies by $5$ instead of dividing by the trigonometric factor.

  - id: "ap-calc-1a-q12"
    questionNumber: 12
    questionType: "MC"
    layout: "split"
    correctAnswer: "C"
    domain: "Integration and Accumulation of Change"
    skill: "Properties of Definite Integrals"
    difficulty: "Medium"
    stimulus: |
      Let $g$ be the function defined by
      $$g(x) = \begin{cases} 3x^2 & \text{for } x < 0 \\ 4 & \text{for } x = 0 \\ 2x & \text{for } x > 0 \end{cases}$$
    prompt: |
      What is the value of $\displaystyle\int_{-1}^{2} g(x) \, dx$?
    options:
      - id: "A"
        text: "$4$"
      - id: "B"
        text: "$9$"
      - id: "C"
        text: "$5$"
      - id: "D"
        text: "nonexistent"
    explanation: |
      ### Takeoff: What were you asked to find?
      Evaluate the definite integral $\displaystyle\int_{-1}^{2} g(x) \, dx$ of a piecewise function by splitting the interval at the boundary $x = 0$, recognizing that an isolated point value at $x = 0$ ($g(0) = 4$) does not affect the area under the curve.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and $g$ is bounded with only a single removable discontinuity at $x = 0$, $g$ is Riemann integrable on $[-1, 2]$. Apply the additive interval property $\displaystyle\int_{a}^{b} g(x) \, dx = \displaystyle\int_{a}^{c} g(x) \, dx + \displaystyle\int_{c}^{b} g(x) \, dx$ at $c = 0$.

      :::derivation
      == step: Split the Definite Integral at the Piecewise Boundary x = 0
      -- why: Use the rule $g(x) = 3x^2$ on $[-1, 0)$ and $g(x) = 2x$ on $(0, 2]$; a single point at $x = 0$ has zero width and contributes $0$ to the definite integral.
      $$
      \begin{aligned}
      \int_{-1}^{2} g(x) \, dx &= \int_{-1}^{0} {\color{#2563eb}{3x^2}} \, dx + \int_{0}^{2} {\color{#2563eb}{2x}} \, dx
      \end{aligned}
      $$

      == step: Evaluate Each Piece via the Fundamental Theorem of Calculus
      -- why: Find an antiderivative for each polynomial branch and evaluate between its respective limits of integration.
      $$
      \begin{aligned}
      \int_{-1}^{0} 3x^2 \, dx &= \Bigl[ x^3 \Bigr]_{-1}^{0} = 0^3 - (-1)^3 = 0 - (-1) = \color{#2563eb}{1} \\[.4cm]
      \int_{0}^{2} 2x \, dx &= \Bigl[ x^2 \Bigr]_{0}^{2} = 2^2 - 0^2 = 4 - 0 = \color{#2563eb}{4}
      \end{aligned}
      $$

      == step: Sum the Two Definite Integrals
      -- why: Combine the net signed areas from $[-1, 0]$ and $[0, 2]$ to find the total integral over $[-1, 2]$.
      $$
      \begin{aligned}
      \int_{-1}^{2} g(x) \, dx &= {\color{#2563eb}{1}} + {\color{#2563eb}{4}} = 5
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $4$:** *Partial Interval Trap.* Evaluates only the right-hand branch $\displaystyle\int_{0}^{2} 2x \, dx = 4$, forgetting to add the contribution from $[-1, 0]$.
      * **(B) $9$:** *Single-Branch Misapplication Trap.* Applies the first formula $3x^2$ across the entire interval $[-1, 2]$, computing $\bigl[x^3\bigr]_{-1}^{2} = 8 - (-1) = 9$ instead of switching rules at $x = 0$.
      * **(C) $5$:** **Correct.** Splits the integral at $x = 0$ and sums $\displaystyle\int_{-1}^{0} 3x^2 \, dx = 1$ and $\displaystyle\int_{0}^{2} 2x \, dx = 4$ to get $5$.
      * **(D) nonexistent:** *Discontinuity vs. Integrability Trap.* Assumes a removable discontinuity at $x = 0$ ($g(0) = 4 \neq 0$) makes the definite integral undefined, confusing differentiability/continuity requirements with Riemann integrability.

  - id: "ap-calc-1a-q13"
    questionNumber: 13
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "Approximating Values Using Local Linearity and Tangent Lines"
    difficulty: "Medium"
    prompt: |
      Let $f$ be the function defined by $f(x) = \sqrt{x}$. What is the approximation for $f(28)$ found by using the line tangent to the graph of $f$ at the point $(25, 5)$ ?
    options:
      - id: "A"
        text: "$\\dfrac{47}{10}$"
      - id: "B"
        text: "$\\dfrac{53}{10}$"
      - id: "C"
        text: "$\\dfrac{51}{10}$"
      - id: "D"
        text: "$\\dfrac{28}{5}$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Approximate $f(28) = \sqrt{28}$ using **local linearity** by writing the equation of the tangent line $L(x) = f(a) + f'(a)(x - a)$ at the point of tangency $(25, 5)$ and evaluating $L(28)$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive, construct the linear approximation $L(x)$ centered at $a = 25$ (where both $f(25)$ and $f'(25)$ evaluate cleanly to rational numbers), then substitute $x = 28$.

      :::derivation
      == step: Differentiate f(x) and Find the Tangent Slope at x = 25
      -- why: Rewrite $f(x) = \sqrt{x}$ as $x^{1/2}$, apply the Power Rule to find $f'(x)$, and evaluate at $x = 25$ to determine the slope $m = f'(25)$.
      $$
      \begin{aligned}
      f'(x) &= \frac{d}{dx}\bigl[x^{1/2}\bigr] = \frac{1}{2}x^{-1/2} = \frac{1}{2\sqrt{x}} \\[.4cm]
      f'(25) &= \frac{1}{2\sqrt{25}} = \frac{1}{2(5)} = {\color{#2563eb}{\frac{1}{10}}}
      \end{aligned}
      $$

      == step: Write the Equation of the Tangent Line L(x)
      -- why: Use point-slope form $L(x) = y_1 + m(x - x_1)$ anchored at $(25, 5)$ with slope $m = \dfrac{1}{10}$.
      $$
      \begin{aligned}
      L(x) &= 5 + {\color{#2563eb}{\frac{1}{10}}}(x - 25)
      \end{aligned}
      $$

      == step: Evaluate L(28) to Approximate f(28)
      -- why: Substitute $x = 28$ into $L(x)$ and combine the resulting fractions over a common denominator of $10$.
      $$
      \begin{aligned}
      f(28) \approx L(28) &= 5 + {\color{#2563eb}{\frac{1}{10}}}(28 - 25) \\[.4cm]
      &= 5 + \frac{3}{10} \\[.4cm]
      &= \frac{50}{10} + \frac{3}{10} = \frac{53}{10}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\dfrac{47}{10}$:** *Sign Direction Trap.* Subtracts the linear increment $\dfrac{3}{10}$ from $5$ instead of adding it ($5 - \dfrac{3}{10} = \dfrac{47}{10}$), forgetting that $f$ is increasing on $[25, 28]$.
      * **(B) $\dfrac{53}{10}$:** **Correct.** Finds the tangent slope $f'(25) = \dfrac{1}{10}$ and evaluates $L(28) = 5 + \dfrac{1}{10}(28 - 25) = \dfrac{53}{10}$.
      * **(C) $\dfrac{51}{10}$:** *Missing $\Delta x$ Multiplier Trap.* Adds the slope $\dfrac{1}{10}$ directly to $f(25) = 5$ ($5 + \dfrac{1}{10} = \dfrac{51}{10}$), forgetting to multiply the slope by $(28 - 25) = 3$.
      * **(D) $\dfrac{28}{5}$:** *Power Rule Coefficient Omission Trap.* Drops the factor of $\dfrac{1}{2}$ when differentiating $x^{1/2}$ to write $f'(x) = \dfrac{1}{\sqrt{x}}$, producing a slope of $\dfrac{1}{5}$ and an estimate of $5 + \dfrac{3}{5} = \dfrac{28}{5}$.

  - id: "ap-calc-1a-q14"
    questionNumber: 14
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Differential Equations"
    skill: "Sketching and Identifying Slope Fields"
    difficulty: "Medium"
    prompt: |
      ![](./assets/APCalcAB-T1-S1A-Q22.svg)

      Shown above is a slope field for which of the following differential equations?
    options:
      - id: "A"
        text: "$\\dfrac{dy}{dx} = \\dfrac{x}{y}$"
      - id: "B"
        text: "$\\dfrac{dy}{dx} = -\\dfrac{x}{y}$"
      - id: "C"
        text: "$\\dfrac{dy}{dx} = xy$"
      - id: "D"
        text: "$\\dfrac{dy}{dx} = -xy$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Match the given slope field to its corresponding differential equation $\dfrac{dy}{dx}$ by inspecting where the tangent segments are horizontal ($\dfrac{dy}{dx} = 0$), where they become vertical ($\dfrac{dy}{dx}$ undefined), and their sign ($\dfrac{dy}{dx} > 0$ vs. $\dfrac{dy}{dx} < 0$) across the four quadrants.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive, test key geometric features of the slope field—specifically behavior along the coordinate axes ($x = 0$ and $y = 0$) and quadrant sign patterns—to systematically eliminate incorrect differential equations.

      :::derivation
      == step: Check Behavior Along the Coordinate Axes (x = 0 and y = 0)
      -- why: Determine whether $x$ and $y$ belong in the numerator or denominator by locating horizontal segments ($\dfrac{dy}{dx} = 0$) and vertical segments ($\dfrac{dy}{dx}$ undefined).
      $$
      \begin{aligned}
      \text{Along the } y\text{-axis } (x = 0, \, y \neq 0): &\quad \text{Segments are horizontal } \implies \frac{dy}{dx} = {\color{#2563eb}{0}} \\[.3cm]
      \text{Along the } x\text{-axis } (y = 0, \, x \neq 0): &\quad \text{Segments become vertical } \implies \frac{dy}{dx} \text{ is } {\color{#2563eb}{\text{undefined}}}
      \end{aligned}
      $$
      *(Because $\dfrac{dy}{dx}$ vanishes when $x = 0$ and is undefined when $y = 0$, $x$ must be in the numerator and $y$ must be in the denominator—eliminating $\dfrac{dy}{dx} = xy$ and $\dfrac{dy}{dx} = -xy$.)*

      == step: Perform Quadrant Sign Analysis
      -- why: Test the sign of the slope segments in Quadrant I ($x > 0, y > 0$) and Quadrant II ($x < 0, y > 0$) to distinguish between $\dfrac{x}{y}$ and $-\dfrac{x}{y}$.
      $$
      \begin{aligned}
      \text{Quadrant I } (x > 0, \, y > 0): &\quad \text{Segments slant downward } \implies \frac{dy}{dx} < {\color{#2563eb}{0}} \\[.3cm]
      \text{Test } \frac{dy}{dx} = -\frac{x}{y}: &\quad -\frac{(+)}{(+)} = {\color{#2563eb}{-}} \quad (\text{Matches}) \\[.3cm]
      \text{Quadrant II } (x < 0, \, y > 0): &\quad \text{Segments slant upward } \implies \frac{dy}{dx} > {\color{#2563eb}{0}} \\[.3cm]
      \text{Test } \frac{dy}{dx} = -\frac{x}{y}: &\quad -\frac{(-)}{(+)} = {\color{#2563eb}{+}} \quad (\text{Matches})
      \end{aligned}
      $$

      == step: Confirm the Differential Equation
      -- why: Conclude that $\dfrac{dy}{dx} = -\dfrac{x}{y}$ is the only equation matching both the axis behavior and the circular orthogonal flow across all quadrants.
      $$
      \frac{dy}{dx} = -\frac{x}{y}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\dfrac{dy}{dx} = \dfrac{x}{y}$:** *Quadrant Sign Reversal Trap.* Matches the horizontal slopes along $x = 0$ and vertical slopes along $y = 0$, but predicts positive slopes in Quadrant I ($x > 0, y > 0$), which corresponds to hyperbolas rather than the concentric circles shown.
      * **(B) $\dfrac{dy}{dx} = -\dfrac{x}{y}$:** **Correct.** Produces horizontal slopes along $x = 0$, vertical slopes along $y = 0$, negative slopes in Quadrants I and III, and positive slopes in Quadrants II and IV (concentric circles $x^2 + y^2 = C$).
      * **(C) $\dfrac{dy}{dx} = xy$:** *Numerator vs. Denominator Trap.* Gives horizontal slopes ($\dfrac{dy}{dx} = 0$) along **both** axes ($x = 0$ and $y = 0$) rather than vertical slopes along $y = 0$, and yields positive slopes in Quadrant I.
      * **(D) $\dfrac{dy}{dx} = -xy$:** *Missing Division by $y$ Trap.* Correctly produces negative slopes in Quadrant I, but forces slopes along the $x$-axis ($y = 0$) to be horizontal ($\dfrac{dy}{dx} = 0$) instead of vertical.

  - id: "ap-calc-1a-q15"
    questionNumber: 15
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "Applying the Chain Rule"
    difficulty: "Medium"
    prompt: |
      If $g$ is a differentiable function and $y = \cos\left(g(x^3)\right)$, what is $\dfrac{dy}{dx}$ when $x = 2$ ?
    options:
      - id: "A"
        text: "$-\\sin\\left(g'(8)\\right)$"
      - id: "B"
        text: "$-12 \\sin(g(8))$"
      - id: "C"
        text: "$-12 g'(8) \\sin(g(8))$"
      - id: "D"
        text: "$-g'(8) \\sin(g(8))$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the derivative $\dfrac{dy}{dx}$ at $x = 2$ for the three-layer composite function $y = \cos\bigl(g(x^3)\bigr)$ by peeling off one derivative layer at a time from the outside in via the **Chain Rule**.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and $g$ is an unspecified differentiable function, color-code the three nested layers—outermost, middle, and innermost—and differentiate one layer per step while leaving the inner arguments intact.

      :::derivation
      == step: Identify and Color-Code Each Nested Layer
      -- why: Highlight the outermost cosine shell, the middle $g(\cdot)$ shell, and the innermost polynomial $x^3$ so you can track every factor produced by the Chain Rule.
      $$
      y = {\color{#2563eb}{\cos\Bigl(}}{\color{#16a34a}{g\bigl(}}{\color{#d97706}{x^3}}{\color{#16a34a}{\bigr)}}{\color{#2563eb}{\Bigr)}}
      $$

      == step: Differentiate the Outermost Layer (Cosine)
      -- why: Apply $\dfrac{d}{du}[\cos(u)] = -\sin(u)$ while keeping the entire inner argument $g(x^3)$ unchanged, then multiply by the derivative of that inner expression.
      $$
      \begin{aligned}
      \frac{dy}{dx} &= {\color{#2563eb}{-\sin\Bigl(}}{\color{#16a34a}{g\bigl(}}{\color{#d97706}{x^3}}{\color{#16a34a}{\bigr)}}{\color{#2563eb}{\Bigr)}} \cdot \frac{d}{dx}\Bigl[{\color{#16a34a}{g\bigl(}}{\color{#d97706}{x^3}}{\color{#16a34a}{\bigr)}}\Bigr]
      \end{aligned}
      $$

      == step: Differentiate the Middle Layer (Function g)
      -- why: Apply the Chain Rule to $g(x^3)$ by taking $g'$ evaluated at the intact innermost argument $x^3$, then multiply by the derivative of $x^3$.
      $$
      \begin{aligned}
      \frac{dy}{dx} &= {\color{#2563eb}{-\sin\Bigl(}}{\color{#16a34a}{g\bigl(}}{\color{#d97706}{x^3}}{\color{#16a34a}{\bigr)}}{\color{#2563eb}{\Bigr)}} \cdot {\color{#16a34a}{g'\bigl(}}{\color{#d97706}{x^3}}{\color{#16a34a}{\bigr)}} \cdot \frac{d}{dx}\bigl[{\color{#d97706}{x^3}}\bigr]
      \end{aligned}
      $$

      == step: Differentiate the Innermost Layer (x^3)
      -- why: Apply the Power Rule $\dfrac{d}{dx}[x^3] = 3x^2$ to complete the Chain Rule expansion, then arrange the factors cleanly.
      $$
      \begin{aligned}
      \frac{dy}{dx} &= {\color{#2563eb}{-\sin\Bigl(}}{\color{#16a34a}{g\bigl(}}{\color{#d97706}{x^3}}{\color{#16a34a}{\bigr)}}{\color{#2563eb}{\Bigr)}} \cdot {\color{#16a34a}{g'\bigl(}}{\color{#d97706}{x^3}}{\color{#16a34a}{\bigr)}} \cdot {\color{#d97706}{3x^2}} \\[.4cm]
      &= -3x^2 g'(x^3) \sin\bigl(g(x^3)\bigr)
      \end{aligned}
      $$

      == step: Evaluate the Derivative at x = 2
      -- why: Substitute $x = 2$ into every occurrence of $x$, simplifying $2^3 = 8$ and $-3(2)^2 = -12$.
      $$
      \begin{aligned}
      \left.\frac{dy}{dx}\right|_{x=2} &= -3(2)^2 g'(2^3) \sin\bigl(g(2^3)\bigr) \\[.4cm]
      &= -12 g'(8) \sin(g(8))
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $-\sin\bigl(g'(8)\bigr)$:** *Differentiating Inside the Argument Trap.* Replaces $g(x^3)$ inside $-\sin(\cdot)$ with $g'(8)$ rather than keeping the original inner expression $g(8)$ intact and multiplying outside by $g'(8) \cdot 12$.
      * **(B) $-12 \sin(g(8))$:** *Middle Layer Omission Trap.* Differentiates the outer $\cos(\cdot)$ and innermost $x^3$ (giving $-3x^2 = -12$), but forgets to multiply by the derivative of the middle function $g'(8)$.
      * **(C) $-12 g'(8) \sin(g(8))$:** **Correct.** Applies the Chain Rule across all three layers to obtain $-3x^2 g'(x^3)\sin(g(x^3))$, which evaluates at $x = 2$ to $-12g'(8)\sin(g(8))$.
      * **(D) $-g'(8) \sin(g(8))$:** *Innermost Layer Omission Trap.* Applies the Chain Rule to $\cos(g(\cdot))$, but treats the argument of $g$ as $x$ instead of $x^3$, omitting the innermost factor $\dfrac{d}{dx}[x^3] = 3x^2 = 12$.

  - id: "ap-calc-1a-q16"
    questionNumber: 16
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Integration and Accumulation of Change"
    skill: "Calculating Definite Integrals Using Geometric Formulas"
    difficulty: "Medium"
    prompt: |
      ![](./assets/APCalcAB-T1-S1A-Q15.svg)

      The graph of $f'$, the first derivative of the function $f$, consists of a semicircle of radius $3$ and two line segments, as shown in the figure above. If $f(0) = 2$, what is $f(5)$ ?
    options:
      - id: "A"
        text: "$\\dfrac{9\\pi}{4} + 4$"
      - id: "B"
        text: "$\\dfrac{9\\pi}{2} + 4$"
      - id: "C"
        text: "$\\dfrac{9\\pi}{4} + 6$"
      - id: "D"
        text: "$\\dfrac{9\\pi}{2} + 6$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine the function value $f(5)$ from the graph of its derivative $f'$ and the initial value $f(0) = 2$ by applying the **Fundamental Theorem of Calculus**, computing $\displaystyle\int_{0}^{5} f'(x) \, dx$ via basic geometric area formulas.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and $f'$ is given graphically rather than algebraically, express $f(5)$ as the initial value $f(0)$ plus the net signed area under $f'$ from $x = 0$ to $x = 5$.

      :::derivation
      == step: Set Up the Accumulation Equation via the Fundamental Theorem of Calculus
      -- why: Relate the unknown value $f(5)$ to the given initial value $f(0) = 2$ and split the definite integral at $x = 3$ where the graph transitions from a circular arc to a line segment.
      $$
      \begin{aligned}
      f(5) &= f(0) + \int_{0}^{5} f'(x) \, dx \\[.4cm]
      &= {\color{#2563eb}{2}} + \int_{0}^{3} f'(x) \, dx + \int_{3}^{5} f'(x) \, dx
      \end{aligned}
      $$

      == step: Compute the Geometric Area on [0, 3] (Quarter Circle)
      -- why: On $[0, 3]$, the region bounded above the $x$-axis by $f'$ is one-quarter of a circle of radius $r = 3$, so apply $A = \dfrac{1}{4}\pi r^2$.
      $$
      \begin{aligned}
      \int_{0}^{3} f'(x) \, dx &= \frac{1}{4}\pi(3)^2 = {\color{#2563eb}{\frac{9\pi}{4}}}
      \end{aligned}
      $$

      == step: Compute the Geometric Area on [3, 5] (Right Triangle)
      -- why: On $[3, 5]$, the region bounded above the $x$-axis by $f'$ forms a right triangle with base $b = 5 - 3 = 2$ and height $h = 4$, so apply $A = \dfrac{1}{2}bh$.
      $$
      \begin{aligned}
      \int_{3}^{5} f'(x) \, dx &= \frac{1}{2}(5 - 3)(4) = \frac{1}{2}(2)(4) = {\color{#2563eb}{4}}
      \end{aligned}
      $$

      == step: Combine the Initial Value and Net Accumulated Area
      -- why: Add $f(0) = 2$ to the two positive geometric areas to obtain $f(5)$.
      $$
      \begin{aligned}
      f(5) &= {\color{#2563eb}{2}} + {\color{#2563eb}{\frac{9\pi}{4}}} + {\color{#2563eb}{4}} \\[.4cm]
      &= \frac{9\pi}{4} + 6
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\dfrac{9\pi}{4} + 4$:** *Initial Condition Omission Trap.* Calculates the definite integral $\displaystyle\int_{0}^{5} f'(x) \, dx = \dfrac{9\pi}{4} + 4$ accurately, but forgets to add the starting value $f(0) = 2$.
      * **(B) $\dfrac{9\pi}{2} + 4$:** *Full Semicircle & Initial Value Trap.* Uses the entire semicircle on $[-3, 3]$ ($\text{Area} = \dfrac{9\pi}{2}$) instead of starting at the lower limit $x = 0$, and also omits $f(0) = 2$.
      * **(C) $\dfrac{9\pi}{4} + 6$:** **Correct.** Combines the initial condition $f(0) = 2$ with the quarter-circle area $\dfrac{9\pi}{4}$ on $[0, 3]$ and triangle area $4$ on $[3, 5]$ to get $\dfrac{9\pi}{4} + 6$.
      * **(D) $\dfrac{9\pi}{2} + 6$:** *Wrong Lower Limit (Full Semicircle) Trap.* Adds $f(0) = 2$ and the triangle area $4$, but integrates across the entire semicircle from $x = -3$ to $x = 3$ ($\dfrac{9\pi}{2}$) rather than starting at $x = 0$.

  - id: "ap-calc-1a-q17"
    questionNumber: 17
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Differentiation: Definition and Fundamental Properties"
    skill: "Calculating Higher-Order Derivatives"
    difficulty: "Medium"
    prompt: |
      If $\dfrac{dy}{dx} = 2x^4 - 3x^3 + x - 5$, then $\dfrac{d^3y}{dx^3}$ evaluated at $x = 2$ is
    options:
      - id: "A"
        text: "$29$"
      - id: "B"
        text: "$60$"
      - id: "C"
        text: "$78$"
      - id: "D"
        text: "$125$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Evaluate the third derivative $\dfrac{d^3y}{dx^3}$ at $x = 2$. Because the prompt gives the **first derivative** $\dfrac{dy}{dx}$ (not the original function $y$), differentiate the given polynomial **two more times** before substituting $x = 2$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive, apply the Power Rule $\dfrac{d}{dx}[x^n] = nx^{n-1}$ repeatedly to step from $\dfrac{dy}{dx}$ to $\dfrac{d^2y}{dx^2}$, and then to $\dfrac{d^3y}{dx^3}$, before evaluating at $x = 2$.

      :::derivation
      == step: Differentiate Once to Find the Second Derivative
      -- why: Take the derivative of $\dfrac{dy}{dx}$ with respect to $x$ term-by-term to obtain $\dfrac{d^2y}{dx^2}$.
      $$
      \begin{aligned}
      \frac{d^2y}{dx^2} &= \frac{d}{dx}\bigl(2x^4 - 3x^3 + x - 5\bigr) \\[.4cm]
      &= {\color{#2563eb}{8x^3 - 9x^2 + 1}}
      \end{aligned}
      $$

      == step: Differentiate a Second Time to Find the Third Derivative
      -- why: Differentiate $\dfrac{d^2y}{dx^2}$ with respect to $x$ using the Power Rule to obtain $\dfrac{d^3y}{dx^3}$ (noting that the derivative of the constant $+1$ is $0$).
      $$
      \begin{aligned}
      \frac{d^3y}{dx^3} &= \frac{d}{dx}\bigl({\color{#2563eb}{8x^3 - 9x^2 + 1}}\bigr) \\[.4cm]
      &= {\color{#2563eb}{24x^2 - 18x}}
      \end{aligned}
      $$

      == step: Evaluate the Third Derivative at x = 2
      -- why: Substitute $x = 2$ into $\dfrac{d^3y}{dx^3} = 24x^2 - 18x$ and simplify arithmetically.
      $$
      \begin{aligned}
      \left.\frac{d^3y}{dx^3}\right|_{x=2} &= 24(2)^2 - 18(2) \\[.4cm]
      &= 24(4) - 36 \\[.4cm]
      &= 96 - 36 = 60
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $29$:** *Off-by-One Derivative Order Trap.* Differentiates only once instead of twice, evaluating the **second** derivative $\left.\dfrac{d^2y}{dx^2}\right|_{x=2} = 8(8) - 9(4) + 1 = 29$.
      * **(B) $60$:** **Correct.** Recognizes that the given expression is already $\dfrac{dy}{dx}$, differentiates twice to obtain $\dfrac{d^3y}{dx^3} = 24x^2 - 18x$, and evaluates at $x = 2$ to get $60$.
      * **(C) $78$:** *Treating $\dfrac{dy}{dx}$ as $y$ Trap.* Overlooks that the given equation is already the first derivative and differentiates three times to evaluate the **fourth** derivative $\left.\dfrac{d^4y}{dx^4}\right|_{x=2} = 48(2) - 18 = 78$.
      * **(D) $125$:** *Derivative Order vs. Exponent Trap.* Evaluates $\left.\dfrac{dy}{dx}\right|_{x=2} = 32 - 24 + 2 - 5 = 5$ and cubes the result ($5^3 = 125$), misreading $\dfrac{d^3y}{dx^3}$ as $\left(\dfrac{dy}{dx}\right)^3$.

  - id: "ap-calc-1a-q18"
    questionNumber: 18
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Integration and Accumulation of Change"
    skill: "Integrating Using Substitution"
    difficulty: "Medium"
    prompt: |
      Using the substitution $u = x - 2$, $\displaystyle\int \mkern-6mu\dfrac{x}{\sqrt{x - 2}} \, dx$ is equivalent to
    options:
      - id: "A"
        text: "$\\displaystyle\\int \\left(u^{1/2} - 2u^{-1/2}\\right) du$"
      - id: "B"
        text: "$\\displaystyle\\int u^{-1/2} \\, du$"
      - id: "C"
        text: "$\\displaystyle\\int \\left(u^{1/2} + 2u^{-1/2}\\right) du$"
      - id: "D"
        text: "$(u + 2) \\displaystyle\\int u^{-1/2} \\, du$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Rewrite the indefinite integral $\displaystyle\int \dfrac{x}{\sqrt{x - 2}} \, dx$ entirely in terms of the new variable $u$ using the **change-of-variables substitution** $u = x - 2$ (including back-solving for the leftover $x$ in the numerator and simplifying fractional exponents).

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and the numerator contains an extra factor of $x$ that is not absorbed by $du$, solve $u = x - 2$ explicitly for $x$ so every appearance of $x$ and $dx$ is replaced by an expression in $u$.

      :::derivation
      == step: Find the Differential du and Solve for x in Terms of u
      -- why: Differentiate $u = x - 2$ to relate $du$ and $dx$, and rearrange $u = x - 2$ to express the numerator $x$ in terms of $u$.
      $$
      \begin{aligned}
      u &= x - 2 \implies du = {\color{#2563eb}{dx}} \\[.3cm]
      x &= {\color{#2563eb}{u + 2}}
      \end{aligned}
      $$

      == step: Replace All x-Terms and dx in the Integral
      -- why: Substitute $x = u + 2$, $x - 2 = u$, and $dx = du$ into the original integral so no $x$-variables remain.
      $$
      \begin{aligned}
      \int \frac{x}{\sqrt{x - 2}} \, dx &= \int \frac{{\color{#2563eb}{u + 2}}}{\sqrt{{\color{#2563eb}{u}}}} \, {\color{#2563eb}{du}}
      \end{aligned}
      $$

      == step: Split the Fraction and Apply Exponent Rules
      -- why: Divide each term in the numerator by $\sqrt{u} = u^{1/2}$ and use $\dfrac{u^a}{u^b} = u^{a - b}$ to express the integrand in power form.
      $$
      \begin{aligned}
      \int \frac{u + 2}{u^{1/2}} \, du &= \int \left(\frac{u^1}{u^{1/2}} + \frac{2}{u^{1/2}}\right) du \\[.4cm]
      &= \int \left(u^{1 - 1/2} + 2u^{-1/2}\right) du \\[.4cm]
      &= \int \left(u^{1/2} + 2u^{-1/2}\right) du
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\displaystyle\int \left(u^{1/2} - 2u^{-1/2}\right) du$:** *Algebraic Rearrangement Sign Trap.* Solves $u = x - 2$ incorrectly as $x = u - 2$ instead of $x = u + 2$, producing a minus sign in front of $2u^{-1/2}$.
      * **(B) $\displaystyle\int u^{-1/2} \, du$:** *Leftover Variable Omission Trap.* Replaces $\sqrt{x - 2}$ with $u^{1/2}$ and $dx$ with $du$, but completely drops the $x$ factor in the numerator instead of replacing it with $u + 2$.
      * **(C) $\displaystyle\int \left(u^{1/2} + 2u^{-1/2}\right) du$:** **Correct.** Replaces $x$ with $u + 2$, divides term-by-term by $u^{1/2}$, and simplifies to $\displaystyle\int \left(u^{1/2} + 2u^{-1/2}\right) du$.
      * **(D) $(u + 2) \displaystyle\int u^{-1/2} \, du$:** *Pulling a Variable Outside the Integral Trap.* Correctly substitutes $x = u + 2$, but illegally factors the variable expression $(u + 2)$ outside the integral sign (only constants may be factored out of an integral).

  - id: "ap-calc-1a-q19"
    questionNumber: 19
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Differentiation: Analytical Applications of Differentiation"
    skill: "Determining Absolute Extrema on a Closed Interval"
    difficulty: "Medium"
    prompt: |
      Let $f$ be the function given by $f(x) = x^3 - 3x^2 - 24x$. What is the maximum value of $f$ on the interval $[0, 5]$ ?
    options:
      - id: "A"
        text: "$0$"
      - id: "B"
        text: "$4$"
      - id: "C"
        text: "$5$"
      - id: "D"
        text: "$8$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine the **absolute maximum value** (the largest $y$-value) of the continuous polynomial $f(x) = x^3 - 3x^2 - 24x$ on the closed interval $[0, 5]$ using the **Candidates Test** (Extreme Value Theorem) by evaluating $f(x)$ at all interior critical points and both interval endpoints.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and $f$ is continuous on the closed interval $[0, 5]$, the Extreme Value Theorem guarantees that the absolute maximum occurs either at an interior critical point where $f'(x) = 0$ or at one of the endpoints $x = 0$ or $x = 5$.

      :::derivation
      == step: Find f'(x) and Locate Critical Points in (0, 5)
      -- why: Differentiate $f(x)$ using the Power Rule, factor the resulting quadratic, and solve $f'(x) = 0$ to identify all candidate $x$-values inside $(0, 5)$.
      $$
      \begin{aligned}
      f'(x) &= 3x^2 - 6x - 24 \\[.3cm]
      &= 3(x^2 - 2x - 8) \\[.3cm]
      &= 3(x - 4)(x + 2)
      \end{aligned}
      $$
      Setting $f'(x) = 0$ gives $x = {\color{#2563eb}{4}}$ and $x = -2$. Discard $x = -2$ as it is not in the domain $[0, 5]$, leaving only $x = {\color{#2563eb}{4}}$ as an interior critical point.

      == step: Apply the Candidates Test at Endpoints and Interior Critical Points
      -- why: Evaluate the original function $f(x) = x^3 - 3x^2 - 24x$ at the left endpoint $x = 0$, the interior critical point $x = 4$, and the right endpoint $x = 5$.
      $$
      \begin{aligned}
      f({\color{#2563eb}{0}}) &= (0)^3 - 3(0)^2 - 24(0) = 0 \\[.3cm]
      f({\color{#2563eb}{4}}) &= (4)^3 - 3(4)^2 - 24(4) = 64 - 48 - 96 = -80 \\[.3cm]
      f({\color{#2563eb}{5}}) &= (5)^3 - 3(5)^2 - 24(5) = 125 - 75 - 120 = -70
      \end{aligned}
      $$

      == step: Compare Output Values to Identify the Absolute Maximum
      -- why: Select the largest $y$-value among all tested candidates ($0$, $-80$, and $-70$).
      $$
      \max_{x \in [0, 5]} f(x) = f(0) = 0
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $0$:** **Correct.** Evaluates $f$ at all candidates ($f(0) = 0$, $f(4) = -80$, $f(5) = -70$) and identifies $0$ as the greatest output value on $[0, 5]$.
      * **(B) $4$:** *$x$-Coordinate vs. $y$-Value (and Min vs. Max) Trap.* Reports the location of the interior critical point $x = 4$ (which is actually a local and absolute minimum where $f(4) = -80$) rather than the maximum output value.
      * **(C) $5$:** *Endpoint $x$-Coordinate Trap.* Assumes the function increases up to the right endpoint and reports the input $x = 5$ instead of evaluating $f(5) = -70$.
      * **(D) $8$:** *Factored Constant Misread Trap.* Pulls the constant $8$ from the factored quadratic $x^2 - 2x - 8 = 0$ rather than solving for the roots and evaluating $f(x)$.

  - id: "ap-calc-1a-q20"
    questionNumber: 20
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Limits and Continuity"
    skill: "Determining Limits at Infinity"
    difficulty: "Medium"
    prompt: |
      $\lim\limits_{x \to -\infty} \dfrac{5 + 3^x}{2 - 7^x}$ is
    options:
      - id: "A"
        text: "$-\\dfrac{3}{7}$"
      - id: "B"
        text: "$0$"
      - id: "C"
        text: "$\\dfrac{5}{2}$"
      - id: "D"
        text: "nonexistent"
    explanation: |
      ### Takeoff: What were you asked to find?
      Evaluate the limit at negative infinity $\lim\limits_{x \to -\infty} \dfrac{5 + 3^x}{2 - 7^x}$ by analyzing the end behavior of exponential functions $b^x$ (with base $b > 1$) as $x \to -\infty$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive, pay close attention to the sign of the limit ($x \to -\infty$, not $+\infty$). For any base $b > 1$, $b^x = \dfrac{1}{b^{-x}} \to 0$ as $x \to -\infty$, allowing direct substitution of the limiting values into the numerator and denominator.

      :::derivation
      == step: Determine the End Behavior of Each Exponential Term as x -> -infinity
      -- why: Since both bases $3 > 1$ and $7 > 1$, raising them to large negative powers drives each exponential term toward $0$.
      $$
      \begin{aligned}
      \lim_{x \to -\infty} 3^x &= {\color{#2563eb}{0}} \\[.3cm]
      \lim_{x \to -\infty} 7^x &= {\color{#2563eb}{0}}
      \end{aligned}
      $$

      == step: Apply Limit Laws to the Rational Expression
      -- why: Because the limit of the denominator is nonzero ($2 - 0 = 2 \neq 0$), apply the Quotient, Sum, and Difference Limit Laws directly.
      $$
      \begin{aligned}
      \lim_{x \to -\infty} \frac{5 + 3^x}{2 - 7^x} &= \frac{5 + \lim\limits_{x \to -\infty} 3^x}{2 - \lim\limits_{x \to -\infty} 7^x} \\[.4cm]
      &= \frac{5 + {\color{#2563eb}{0}}}{2 - {\color{#2563eb}{0}}} \\[.4cm]
      &= \frac{5}{2}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $-\dfrac{3}{7}$:** *Leading Coefficient Ratio Trap.* Erroneously divides the bases of the exponential terms ($\dfrac{3}{-7} = -\dfrac{3}{7}$) as if comparing equal-degree polynomials at infinity.
      * **(B) $0$:** *$x \to +\infty$ vs. $x \to -\infty$ Direction Trap.* Evaluates the limit as if $x \to +\infty$, where $7^x$ grows exponentially faster than $3^x$ and forces $\lim\limits_{x \to +\infty} \dfrac{5 + 3^x}{2 - 7^x} = 0$.
      * **(C) $\dfrac{5}{2}$:** **Correct.** Recognizes that $\lim\limits_{x \to -\infty} 3^x = 0$ and $\lim\limits_{x \to -\infty} 7^x = 0$, reducing the expression to $\dfrac{5 + 0}{2 - 0} = \dfrac{5}{2}$.
      * **(D) nonexistent:** *Negative Exponent Undefined Trap.* Confuses negative exponents ($b^{-100} = \dfrac{1}{b^{100}} \approx 0$) with undefined expressions, assuming the limit diverges as $x \to -\infty$.

  - id: "ap-calc-1a-q21"
    questionNumber: 21
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Differential Equations"
    skill: "Solving Motion Problems with Antiderivatives"
    difficulty: "Medium"
    prompt: |
      A particle moves along the $x$-axis so that at any time $t \ge 0$, its acceleration is given by $a(t) = -6 \cos(3t)$. If the velocity of the particle at $t = 0$ is $v(0) = 4$ and its position at $t = 0$ is $x(0) = 1$, then its position at time $t$ is $x(t) =$
    options:
      - id: "A"
        text: "$\\dfrac{2}{3} \\cos(3t) + 4t + 1$"
      - id: "B"
        text: "$\\dfrac{2}{3} \\cos(3t) + 4t + \\dfrac{1}{3}$"
      - id: "C"
        text: "$-\\dfrac{2}{3} \\cos(3t) + 4t + \\dfrac{5}{3}$"
      - id: "D"
        text: "$-18 \\cos(3t) + 4t + 19$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Recover the position function $x(t)$ from acceleration $a(t) = -6\cos(3t)$ by integrating **twice**—solving for the first integration constant $C_1$ using $v(0) = 4$, and then solving for the second integration constant $C_2$ using $x(0) = 1$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive, step backward along the rectilinear motion hierarchy ($a(t) \to v(t) \to x(t)$) using reverse Chain Rule factors of $\dfrac{1}{3}$ for $\cos(3t)$ and $\sin(3t)$, solving for each constant immediately after each integration.

      :::derivation
      == step: Integrate Acceleration to Find General Velocity v(t)
      -- why: Use $\displaystyle\int \cos(kt) \, dt = \dfrac{1}{k}\sin(kt) + C$ with $k = 3$ and include the first integration constant $C_1$.
      $$
      \begin{aligned}
      v(t) &= \int a(t) \, dt = \int -6\cos(3t) \, dt \\[.4cm]
      &= -6 \cdot \frac{1}{3}\sin(3t) + {\color{#2563eb}{C_1}} \\[.4cm]
      &= -2\sin(3t) + {\color{#2563eb}{C_1}}
      \end{aligned}
      $$

      == step: Apply Initial Velocity v(0) = 4 to Solve for C_1
      -- why: Substitute $t = 0$ and $v(0) = 4$ into $v(t)$ to determine $C_1$ and write the particular velocity function.
      $$
      \begin{aligned}
      v(0) &= -2\sin(0) + {\color{#2563eb}{C_1}} = 4 \\[.3cm]
      0 + {\color{#2563eb}{C_1}} &= 4 \implies {\color{#2563eb}{C_1 = 4}} \\[.3cm]
      v(t) &= -2\sin(3t) + 4
      \end{aligned}
      $$

      == step: Integrate Velocity to Find General Position x(t)
      -- why: Use $\displaystyle\int -\sin(kt) \, dt = \dfrac{1}{k}\cos(kt) + C$ with $k = 3$ (since $\dfrac{d}{dt}[\cos(3t)] = -3\sin(3t)$) and include a second integration constant $C_2$.
      $$
      \begin{aligned}
      x(t) &= \int v(t) \, dt = \int \bigl(-2\sin(3t) + 4\bigr) \, dt \\[.4cm]
      &= 2 \cdot \frac{1}{3}\cos(3t) + 4t + {\color{#2563eb}{C_2}} \\[.4cm]
      &= \frac{2}{3}\cos(3t) + 4t + {\color{#2563eb}{C_2}}
      \end{aligned}
      $$

      == step: Apply Initial Position x(0) = 1 to Solve for C_2
      -- why: Substitute $t = 0$ and $x(0) = 1$ into $x(t)$, remembering that $\cos(0) = 1$ (not $0$), to solve for $C_2$.
      $$
      \begin{aligned}
      x(0) &= \frac{2}{3}\cos(0) + 4(0) + {\color{#2563eb}{C_2}} = 1 \\[.4cm]
      \frac{2}{3}(1) + 0 + {\color{#2563eb}{C_2}} &= 1 \implies {\color{#2563eb}{C_2}} = 1 - \frac{2}{3} = {\color{#2563eb}{\frac{1}{3}}} \\[.4cm]
      x(t) &= \frac{2}{3}\cos(3t) + 4t + \frac{1}{3}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\dfrac{2}{3} \cos(3t) + 4t + 1$:** *Cosine-at-Zero Assumption Trap.* Sets $C_2 = x(0) = 1$ automatically as if $\cos(0) = 0$, forgetting that $\dfrac{2}{3}\cos(0) = \dfrac{2}{3}$ contributes to $x(0)$.
      * **(B) $\dfrac{2}{3} \cos(3t) + 4t + \dfrac{1}{3}$:** **Correct.** Integrates twice with factors of $\dfrac{1}{3}$, finds $C_1 = 4$ from $v(0) = 4$, and solves $\dfrac{2}{3} + C_2 = 1$ to get $C_2 = \dfrac{1}{3}$.
      * **(C) $-\dfrac{2}{3} \cos(3t) + 4t + \dfrac{5}{3}$:** *Antiderivative Sign Error Trap.* Integrates $-2\sin(3t)$ as $-\dfrac{2}{3}\cos(3t)$ instead of $+\dfrac{2}{3}\cos(3t)$, which then forces $-\dfrac{2}{3} + C_2 = 1 \implies C_2 = \dfrac{5}{3}$.
      * **(D) $-18 \cos(3t) + 4t + 19$:** *Differentiating Instead of Integrating Trap.* Multiplies by $3$ at each step instead of dividing by $3$ (treating $\int \cos(3t)\,dt$ like $3\sin(3t)$), producing $-18\cos(3t)$ and $C_2 = 19$.

  - id: "ap-calc-1a-q22"
    questionNumber: 22
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Differentiation: Analytical Applications of Differentiation"
    skill: "Using L'Hôpital's Rule for Finding Limits of Indeterminate Forms"
    difficulty: "Medium"
    prompt: |
      $\lim\limits_{x \to 0} \dfrac{3x^2}{e^{3x} - 3x - 1}$ is
    options:
      - id: "A"
        text: "$0$"
      - id: "B"
        text: "$\\dfrac{2}{3}$"
      - id: "C"
        text: "$2$"
      - id: "D"
        text: "nonexistent"
    explanation: |
      ### Takeoff: What were you asked to find?
      Evaluate the limit $\lim\limits_{x \to 0} \dfrac{3x^2}{e^{3x} - 3x - 1}$ by verifying the indeterminate form $\dfrac{0}{0}$ upon direct substitution and applying **L'Hôpital's Rule** repeatedly until direct substitution yields a finite ratio.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and both the numerator and denominator are differentiable everywhere, check the limit of the numerator and denominator separately before each application of L'Hôpital's Rule (differentiating top and bottom independently—not with the Quotient Rule).

      :::derivation
      == step: Verify the Initial 0/0 Indeterminate Form
      -- why: Confirm that both the numerator and denominator approach $0$ as $x \to 0$ so L'Hôpital's Rule is valid.
      $$
      \begin{aligned}
      \lim_{x \to 0} \bigl(3x^2\bigr) &= 3(0)^2 = {\color{#2563eb}{0}} \\[.3cm]
      \lim_{x \to 0} \bigl(e^{3x} - 3x - 1\bigr) &= e^{0} - 3(0) - 1 = 1 - 0 - 1 = {\color{#2563eb}{0}}
      \end{aligned}
      $$
      Since direct substitution produces the indeterminate form $\dfrac{{\color{#2563eb}{0}}}{{\color{#2563eb}{0}}}$, L'Hôpital's Rule applies.

      == step: Apply L'Hôpital's Rule a First Time and Re-Check
      -- why: Differentiate the numerator and denominator separately with respect to $x$ (using the Chain Rule $\dfrac{d}{dx}[e^{3x}] = 3e^{3x}$), then test $x = 0$ again.
      $$
      \begin{aligned}
      \lim_{x \to 0} \frac{3x^2}{e^{3x} - 3x - 1} &= \lim_{x \to 0} \frac{\dfrac{d}{dx}[3x^2]}{\dfrac{d}{dx}[e^{3x} - 3x - 1]} \\[.5cm]
      &= \lim_{x \to 0} \frac{{\color{#2563eb}{6x}}}{{\color{#2563eb}{3e^{3x} - 3}}}
      \end{aligned}
      $$
      Testing $x = 0$ again yields $\dfrac{6(0)}{3e^0 - 3} = \dfrac{{\color{#2563eb}{0}}}{{\color{#2563eb}{0}}}$, so L'Hôpital's Rule applies a second time.

      == step: Apply L'Hôpital's Rule a Second Time and Evaluate
      -- why: Differentiate the new numerator $6x$ and denominator $3e^{3x} - 3$ separately (remembering another Chain Rule factor of $3$ on $3e^{3x}$), then substitute $x = 0$.
      $$
      \begin{aligned}
      \lim_{x \to 0} \frac{6x}{3e^{3x} - 3} &= \lim_{x \to 0} \frac{\dfrac{d}{dx}[6x]}{\dfrac{d}{dx}[3e^{3x} - 3]} \\[.5cm]
      &= \lim_{x \to 0} \frac{6}{9e^{3x}} \\[.4cm]
      &= \frac{6}{9e^{0}} = \frac{6}{9} = \frac{2}{3}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $0$:** *Premature Stopping Trap.* Stops after the first application of L'Hôpital's Rule ($\dfrac{6x}{3e^{3x} - 3}$) and sees $0$ in the numerator, overlooking that the denominator $3e^0 - 3$ is also $0$.
      * **(B) $\dfrac{2}{3}$:** **Correct.** Applies L'Hôpital's Rule twice to reach $\lim\limits_{x \to 0} \dfrac{6}{9e^{3x}} = \dfrac{6}{9} = \dfrac{2}{3}$.
      * **(C) $2$:** *Chain Rule Factor Omission Trap.* Forgets to multiply by $3$ when differentiating $3e^{3x}$ a second time, writing $\dfrac{6}{3e^{3x}}$ instead of $\dfrac{6}{9e^{3x}}$ and getting $\dfrac{6}{3} = 2$.
      * **(D) nonexistent:** *Indeterminate vs. Undefined Trap.* Concludes the limit does not exist simply because direct substitution yields $\dfrac{0}{0}$ rather than resolving the indeterminate form with L'Hôpital's Rule.

  - id: "ap-calc-1a-q23"
    questionNumber: 23
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Integration and Accumulation of Change"
    skill: "Integrating Using Inverse Trigonometric Functions and Completing the Square"
    difficulty: "Medium"
    prompt: |
      $\displaystyle\int \mkern-6mu \dfrac{1}{x^2 - 6x + 10} \, dx =$
    options:
      - id: "A"
        text: "$\\arctan(x - 3) + C$"
      - id: "B"
        text: "$\\arcsin(x - 3) + C$"
      - id: "C"
        text: "$\\ln\\left|x^2 - 6x + 10\\right| + C$"
      - id: "D"
        text: "$\\arctan(x + 3) + C$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Evaluate the indefinite integral $\displaystyle\int \dfrac{1}{x^2 - 6x + 10} \, dx$ by **completing the square** on the irreducible quadratic denominator to transform the integrand into the standard **inverse tangent** form $\displaystyle\int \dfrac{1}{u^2 + 1} \, du = \arctan(u) + C$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and the denominator $x^2 - 6x + 10$ has negative discriminant ($b^2 - 4ac = 36 - 40 = -4 < 0$, so it cannot be factored over the reals), complete the square to isolate a squared binomial plus a positive constant.

      :::derivation
      == step: Complete the Square in the Denominator
      -- why: Take half of the $x$-coefficient ($\dfrac{-6}{2} = -3$), square it to get $(-3)^2 = 9$, and split $10$ as $9 + 1$ so the first three terms form a perfect square trinomial.
      $$
      \begin{aligned}
      x^2 - 6x + 10 &= (x^2 - 6x + {\color{#2563eb}{9}}) + {\color{#2563eb}{1}} \\[.4cm]
      &= {\color{#2563eb}{(x - 3)^2 + 1}}
      \end{aligned}
      $$

      == step: Rewrite the Integral Using u-Substitution
      -- why: Substitute $u = x - 3$ (with $du = dx$) to match the standard inverse tangent antiderivative template $\displaystyle\int \dfrac{1}{u^2 + 1} \, du$.
      $$
      \begin{aligned}
      \int \frac{1}{x^2 - 6x + 10} \, dx &= \int \frac{1}{{\color{#2563eb}{(x - 3)^2 + 1}}} \, dx \\[.4cm]
      &= \int \frac{1}{{\color{#2563eb}{u^2 + 1}}} \, du \qquad \bigl(\text{where } u = x - 3, \; du = dx\bigr)
      \end{aligned}
      $$

      == step: Apply the Arctangent Antiderivative Formula and Back-Substitute
      -- why: Integrate $\displaystyle\int \dfrac{1}{u^2 + 1} \, du = \arctan(u) + C$ and replace $u$ with $x - 3$.
      $$
      \begin{aligned}
      \int \frac{1}{u^2 + 1} \, du &= \arctan(u) + C \\[.4cm]
      &= \arctan(x - 3) + C
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\arctan(x - 3) + C$:** **Correct.** Completes the square to rewrite $x^2 - 6x + 10$ as $(x - 3)^2 + 1$ and applies $\displaystyle\int \dfrac{1}{u^2 + 1} \, du = \arctan(u) + C$ with $u = x - 3$.
      * **(B) $\arcsin(x - 3) + C$:** *Inverse Trigonometric Form Confusion Trap.* Confuses $\displaystyle\int \dfrac{1}{u^2 + 1} \, du = \arctan(u) + C$ with $\displaystyle\int \dfrac{1}{\sqrt{1 - u^2}} \, du = \arcsin(u) + C$, overlooking the absence of a square root and subtraction in the denominator.
      * **(C) $\ln\left|x^2 - 6x + 10\right| + C$:** *Missing Numerator Derivative Trap.* Applies the logarithmic rule $\displaystyle\int \dfrac{1}{u} \, du = \ln|u| + C$ directly to a quadratic denominator even though the required derivative $du = (2x - 6)\,dx$ is missing from the numerator.
      * **(D) $\arctan(x + 3) + C$:** *Completing-the-Square Sign Trap.* Factors $x^2 - 6x + 9$ with a plus sign as $(x + 3)^2$ instead of $(x - 3)^2$.

  - id: "ap-calc-1a-q24"
    questionNumber: 24
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "Solving Related Rates Problems"
    difficulty: "Medium"
    prompt: |
      The positive variables $x$ and $y$ change with respect to time $t$. The relationship between $x$ and $y$ is given by the equation $y^2 = (16 - x)^3$. At the instant when $\dfrac{dy}{dt} = 18$ and $x = 12$, what is the value of $\dfrac{dx}{dt}$ ?
    options:
      - id: "A"
        text: "$-6$"
      - id: "B"
        text: "$6$"
      - id: "C"
        text: "$-\\dfrac{1}{6}$"
      - id: "D"
        text: "$-12$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the instantaneous rate of change $\dfrac{dx}{dt}$ when $x = 12$ and $\dfrac{dy}{dt} = 18$ by differentiating the related-rates equation $y^2 = (16 - x)^3$ **implicitly with respect to time $t$** and solving for $y$ at the given instant.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and both $x$ and $y$ are functions of $t$, treat $x$ and $y$ as variables (do not plug in $x = 12$ until after differentiating), and include the Chain Rule factor $-\dfrac{dx}{dt}$ when differentiating $(16 - x)^3$.

      :::derivation
      == step: Find the Value of y at the Instant x = 12
      -- why: Substitute $x = 12$ into the original relation $y^2 = (16 - x)^3$ and use the given condition $y > 0$ ("positive variables") to select the positive square root.
      $$
      \begin{aligned}
      y^2 &= (16 - 12)^3 = 4^3 = 64 \\[.3cm]
      y &= \sqrt{64} = {\color{#2563eb}{8}} \qquad (y > 0)
      \end{aligned}
      $$

      == step: Differentiate Both Sides Implicitly with Respect to Time t
      -- why: Apply the Power Rule together with the Chain Rule on both sides, noting that $\dfrac{d}{dt}[16 - x] = -\dfrac{dx}{dt}$.
      $$
      \begin{aligned}
      \frac{d}{dt}\bigl[y^2\bigr] &= \frac{d}{dt}\Bigl[\bigl(16 - x\bigr)^3\Bigr] \\[.4cm]
      {\color{#2563eb}{2y}}\frac{dy}{dt} &= {\color{#2563eb}{3(16 - x)^2}}\left({\color{#2563eb}{-\frac{dx}{dt}}}\right) \\[.4cm]
      2y\frac{dy}{dt} &= -3(16 - x)^2\frac{dx}{dt}
      \end{aligned}
      $$

      == step: Substitute Known Instantaneous Values and Solve for dx/dt
      -- why: Plug in $x = 12$, $y = 8$, and $\dfrac{dy}{dt} = 18$, then divide both sides by $-48$ to isolate $\dfrac{dx}{dt}$.
      $$
      \begin{aligned}
      2({\color{#2563eb}{8}})({\color{#2563eb}{18}}) &= -3(16 - {\color{#2563eb}{12}})^2 \frac{dx}{dt} \\[.4cm]
      288 &= -3(4)^2 \frac{dx}{dt} \\[.4cm]
      288 &= -48 \frac{dx}{dt} \\[.4cm]
      \frac{dx}{dt} &= \frac{288}{-48} = -6
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $-6$:** **Correct.** Finds $y = 8$ at $x = 12$, differentiates with respect to $t$ to obtain $2y\dfrac{dy}{dt} = -3(16 - x)^2\dfrac{dx}{dt}$, and solves $288 = -48\dfrac{dx}{dt}$ to get $-6$.
      * **(B) $6$:** *Inner Derivative Sign Omission Trap.* Forgets the negative sign from $\dfrac{d}{dt}[16 - x] = -\dfrac{dx}{dt}$, solving $288 = 48\dfrac{dx}{dt}$ to get $+6$ instead of $-6$.
      * **(C) $-\dfrac{1}{6}$:** *Reciprocal Division Trap.* Isolates $\dfrac{dx}{dt}$ upside down as $\dfrac{-48}{288} = -\dfrac{1}{6}$ rather than $\dfrac{288}{-48} = -6$.
      * **(D) $-12$:** *Power Rule Coefficient Omission Trap.* Drops the factor of $2$ when differentiating $y^2$ (or omits a factor of $2$ during arithmetic), leading to $\dfrac{dx}{dt} = -12$ (note that $-3$ would correspond to dropping the $2$ in $2y\dfrac{dy}{dt}$, while doubling $288$ to $576$ yields $-12$).

  - id: "ap-calc-1a-q25"
    questionNumber: 25
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Differential Equations"
    skill: "Verifying Solutions for Differential Equations"
    difficulty: "Easy"
    prompt: |
      Which of the following is a solution to the differential equation $y'' - 9y = 0$ ?
    options:
      - id: "A"
        text: "$y = e^{3x}$"
      - id: "B"
        text: "$y = 3e^x$"
      - id: "C"
        text: "$y = \\sin(3x)$"
      - id: "D"
        text: "$y = \\cos(3x)$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify which candidate function $y$ satisfies the second-order linear differential equation $y'' - 9y = 0$ (equivalently, $y'' = 9y$) by computing the first and second derivatives of each candidate and substituting them into the equation.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive, rewrite $y'' - 9y = 0$ as $y'' = 9y$ and differentiate each candidate twice using the Chain Rule to see which function reproduces $+9$ times itself after two differentiations.

      :::derivation
      == step: Compute the First and Second Derivatives of y = e^(3x)
      -- why: Apply the Chain Rule $\dfrac{d}{dx}[e^{kx}] = ke^{kx}$ twice with $k = 3$ to find $y'$ and $y''$.
      $$
      \begin{aligned}
      y &= {\color{#2563eb}{e^{3x}}} \\[.3cm]
      y' &= \frac{d}{dx}\bigl[e^{3x}\bigr] = {\color{#2563eb}{3e^{3x}}} \\[.3cm]
      y'' &= \frac{d}{dx}\bigl[3e^{3x}\bigr] = {\color{#2563eb}{9e^{3x}}}
      \end{aligned}
      $$

      == step: Substitute y and y'' into the Differential Equation
      -- why: Plug $y'' = 9e^{3x}$ and $y = e^{3x}$ into the left-hand side of $y'' - 9y = 0$ to verify that the expression simplifies identically to $0$.
      $$
      \begin{aligned}
      y'' - 9y &= {\color{#2563eb}{9e^{3x}}} - 9\bigl({\color{#2563eb}{e^{3x}}}\bigr) \\[.4cm]
      &= 9e^{3x} - 9e^{3x} = 0
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $y = e^{3x}$:** **Correct.** Differentiating twice gives $y'' = 9e^{3x}$, so $y'' - 9y = 9e^{3x} - 9e^{3x} = 0$.
      * **(B) $y = 3e^x$:** *Coefficient vs. Exponent Placement Trap.* Places the factor of $3$ in front of $e^x$ rather than in the exponent; since $\dfrac{d^2}{dx^2}[3e^x] = 3e^x$, substituting yields $3e^x - 9(3e^x) = -24e^x \neq 0$.
      * **(C) $y = \sin(3x)$:** *Sign Error in Second Derivative Trap.* Differentiating $\sin(3x)$ twice yields $y'' = -9\sin(3x)$, which satisfies $y'' + 9y = 0$ rather than $y'' - 9y = 0$ ($-9\sin(3x) - 9\sin(3x) = -18\sin(3x) \neq 0$).
      * **(D) $y = \cos(3x)$:** *Sign Error in Second Derivative Trap.* Like $\sin(3x)$, differentiating $\cos(3x)$ twice introduces a minus sign ($y'' = -9\cos(3x)$), so $y'' - 9y = -18\cos(3x) \neq 0$.

  - id: "ap-calc-1a-q26"
    questionNumber: 26
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Differentiation: Analytical Applications of Differentiation"
    skill: "Applying the Mean Value Theorem"
    difficulty: "Medium"
    prompt: |
      For time $t \ge 1$, the position of a particle moving along the $x$-axis is given by $x(t) = \sqrt{t} + 3$. At what time $t$ in the interval $4 \le t \le 25$ is the instantaneous velocity of the particle equal to the average velocity of the particle over the interval $4 \le t \le 25$?
    options:
      - id: "A"
        text: "$4$"
      - id: "B"
        text: "$\\dfrac{29}{2}$"
      - id: "C"
        text: "$\\dfrac{49}{4}$"
      - id: "D"
        text: "$49$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the exact time $t \in [4, 25]$ guaranteed by the **Mean Value Theorem** where the instantaneous velocity $v(t) = x'(t)$ equals the average velocity $\dfrac{x(25) - x(4)}{25 - 4}$ over the closed interval $[4, 25]$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and $x(t) = \sqrt{t} + 3$ is continuous on $[4, 25]$ and differentiable on $(4, 25)$, compute the average rate of change of position over $[4, 25]$, differentiate $x(t)$ to find $v(t)$, and solve $v(t) = v_{\text{avg}}$.

      :::derivation
      == step: Compute the Average Velocity Over [4, 25]
      -- why: Evaluate $x(25)$ and $x(4)$ from $x(t) = \sqrt{t} + 3$ and divide the displacement $x(25) - x(4)$ by the elapsed time $25 - 4$.
      $$
      \begin{aligned}
      v_{\text{avg}} &= \frac{x(25) - x(4)}{25 - 4} \\[.4cm]
      &= \frac{(\sqrt{25} + 3) - (\sqrt{4} + 3)}{21} \\[.4cm]
      &= \frac{8 - 5}{21} = \frac{3}{21} = {\color{#2563eb}{\frac{1}{7}}}
      \end{aligned}
      $$

      == step: Find the Instantaneous Velocity Function v(t) = x'(t)
      -- why: Rewrite $x(t) = t^{1/2} + 3$ and apply the Power Rule $\dfrac{d}{dt}[t^{1/2}] = \dfrac{1}{2}t^{-1/2}$ to express $v(t)$ cleanly.
      $$
      \begin{aligned}
      v(t) = x'(t) &= \frac{d}{dt}\bigl[t^{1/2} + 3\bigr] \\[.4cm]
      &= \frac{1}{2}t^{-1/2} = {\color{#2563eb}{\frac{1}{2\sqrt{t}}}}
      \end{aligned}
      $$

      == step: Equate Instantaneous and Average Velocity and Solve for t
      -- why: Set $v(t) = v_{\text{avg}}$, isolate $\sqrt{t}$, and square both sides to solve for $t$ (verifying that $t \in (4, 25)$).
      $$
      \begin{aligned}
      {\color{#2563eb}{\frac{1}{2\sqrt{t}}}} &= {\color{#2563eb}{\frac{1}{7}}} \\[.4cm]
      2\sqrt{t} &= 7 \implies \sqrt{t} = \frac{7}{2} \\[.4cm]
      t &= \left(\frac{7}{2}\right)^2 = \frac{49}{4}
      \end{aligned}
      $$
      Since $\dfrac{49}{4} = 12.25$ lies strictly inside $(4, 25)$, this is the required time.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $4$:** *Endpoint Selection Trap.* Picks the left endpoint $t = 4$ of the interval $[4, 25]$ without setting $x'(t)$ equal to the average velocity.
      * **(B) $\dfrac{29}{2}$:** *Arithmetic Midpoint Trap.* Computes the midpoint of the time interval $\dfrac{4 + 25}{2} = \dfrac{29}{2}$ (which only equals the MVT point for quadratic functions, not square-root functions).
      * **(C) $\dfrac{49}{4}$:** **Correct.** Equates $x'(t) = \dfrac{1}{2\sqrt{t}}$ to the average velocity $\dfrac{1}{7}$ and solves $\sqrt{t} = \dfrac{7}{2}$ to obtain $t = \dfrac{49}{4}$.
      * **(D) $49$:** *Power Rule Coefficient Omission Trap.* Drops the factor of $\dfrac{1}{2}$ when differentiating $\sqrt{t}$, solving $\dfrac{1}{\sqrt{t}} = \dfrac{1}{7}$ to get $t = 49$ (which also lies outside $[4, 25]$).

  - id: "ap-calc-1a-q27"
    questionNumber: 27
    questionType: "MC"
    layout: "split"
    correctAnswer: "A"
    domain: "Differentiation: Analytical Applications of Differentiation"
    skill: "Connecting the Graphs of f, f', and f''"
    difficulty: "Hard"
    stimulus: |
      ![](./assets/APCalcAB-T1-S1A-Q8.svg)

      The graph of $g''$, the second derivative of the function $g$, is shown in the figure above.
    prompt: |
      Which of the following could be the graph of $g$ ?
    options:
      - id: "A"
        text: "![](./assets/APCalcAB-T1-S1A-Q8-A.svg)"
      - id: "B"
        text: "![](./assets/APCalcAB-T1-S1A-Q8-B.svg)"
      - id: "C"
        text: "![](./assets/APCalcAB-T1-S1A-Q8-C.svg)"
      - id: "D"
        text: "![](./assets/APCalcAB-T1-S1A-Q8-D.svg)"
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify a possible graph of the original function $g$ from the given graph of its second derivative $g''$ by translating the **sign of $g''(x)$** ($g''(x) > 0$ vs. $g''(x) < 0$) into intervals of **concavity** and locating the **points of inflection** where $g''$ crosses the $x$-axis.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and no explicit formula is given, use the Second Derivative Test for Concavity: $g$ is concave up wherever $g''(x) > 0$ (above the $x$-axis) and concave down wherever $g''(x) < 0$ (below the $x$-axis).

      :::derivation
      == step: Locate the Zeros of g''(x) and Map Its Sign Intervals
      -- why: Read the $x$-intercepts of the given graph of $g''$ ($x = -1$ and $x = 1$) and determine whether $g''(x)$ lies above or below the $x$-axis on each subinterval.
      $$
      \begin{aligned}
      \text{For } x < -1: &\quad g''(x) < {\color{#2563eb}{0}} \quad (\text{below } x\text{-axis}) \\[.3cm]
      \text{For } -1 < x < 1: &\quad g''(x) > {\color{#2563eb}{0}} \quad (\text{above } x\text{-axis}) \\[.3cm]
      \text{For } x > 1: &\quad g''(x) < {\color{#2563eb}{0}} \quad (\text{below } x\text{-axis})
      \end{aligned}
      $$

      == step: Translate the Sign of g''(x) into Concavity and Inflection Points of g
      -- why: Apply the rule that $g''(x) > 0 \implies g$ is concave up and $g''(x) < 0 \implies g$ is concave down, with points of inflection wherever $g''(x)$ changes sign.
      $$
      \begin{aligned}
      \text{On } (-\infty, -1): &\quad g \text{ is } {\color{#2563eb}{\text{concave down}}} \\[.3cm]
      \text{At } x = -1: &\quad {\color{#2563eb}{\text{Point of inflection}}} \quad (g'' \text{ changes from } - \text{ to } +) \\[.3cm]
      \text{On } (-1, 1): &\quad g \text{ is } {\color{#2563eb}{\text{concave up}}} \\[.3cm]
      \text{At } x = 1: &\quad {\color{#2563eb}{\text{Point of inflection}}} \quad (g'' \text{ changes from } + \text{ to } -) \\[.3cm]
      \text{On } (1, \infty): &\quad g \text{ is } {\color{#2563eb}{\text{concave down}}}
      \end{aligned}
      $$

      == step: Match the Concavity Sequence to the Candidate Graphs
      -- why: Select the only graph that transitions from concave down to concave up at $x = -1$, and back to concave down at $x = 1$.
      $$
      \text{Concave down} \;\xrightarrow{\;x = -1\;}\; \text{Concave up} \;\xrightarrow{\;x = 1\;}\; \text{Concave down} \implies \text{Graph A}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) Graph A:** **Correct.** Exhibits the exact concavity sequence required by $g''$: concave down on $(-\infty, -1)$, concave up on $(-1, 1)$, and concave down on $(1, \infty)$, with inflection points at $x = -1$ and $x = 1$.
      * **(B) Graph B:** *Concavity Sign Reversal Trap.* Shows the exact opposite concavity pattern (concave up $\rightarrow$ concave down $\rightarrow$ concave up), which would correspond to $-g''(x)$ rather than $g''(x)$.
      * **(C) Graph C:** *First-Derivative ($g'$) vs. Second-Derivative ($g''$) Confusion Trap.* Treats the given parabola as $g'$ rather than $g''$ (yielding a cubic-like curve with a single inflection point near $x = 0$ instead of two inflection points at $x = \pm 1$).
      * **(D) Graph D:** *Constant Concavity Trap.* Depicts a curve that remains concave down everywhere with no inflection points, ignoring the interval $(-1, 1)$ where $g''(x) > 0$.

  - id: "ap-calc-1a-q28"
    questionNumber: 28
    questionType: "MC"
    layout: "split"
    correctAnswer: "D"
    domain: "Integration and Accumulation of Change"
    skill: "Finding the Area Between Curves That Intersect at More than Two Points"
    difficulty: "Medium"
    stimulus: |
      ![](./assets/APCalcAB-T1-S1A-Q29.svg)

      The graphs of the function $f$ and the line $y = x$ are shown in the figure above. The graphs intersect at the points $(0, 0)$, $(2, 2)$, and $(4, 4)$.
    prompt: |
      Which of the following expressions give the total area of the regions enclosed by the graphs?

      I. $\left| \displaystyle\int_{0}^{4} (f(x) - x) \, dx \right|$

      II. $\displaystyle\int_{0}^{4} |f(x) - x| \, dx$

      III. $\displaystyle\int_{0}^{2} (f(x) - x) \, dx + \displaystyle\int_{2}^{4} (x - f(x)) \, dx$
    options:
      - id: "A"
        text: "II only"
      - id: "B"
        text: "III only"
      - id: "C"
        text: "I and II only"
      - id: "D"
        text: "II and III only"
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify which integral expressions represent the **total geometric area** of the two regions enclosed between the graph of $f$ and the line $y = x$ from $x = 0$ to $x = 4$, accounting for the fact that the curves cross each other at the interior intersection point $(2, 2)$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and no explicit formula for $f(x)$ is provided, set up the total area using the absolute distance $|f(x) - x|$ between the two curves and split the integral at the interior intersection $x = 2$ where the upper and lower functions switch roles.

      :::derivation
      == step: Express the Total Area Using an Absolute-Value Integrand
      -- why: Integrating the vertical distance $|f(x) - x|$ across $[0, 4]$ ensures that every vertical slice contributes a nonnegative quantity regardless of which curve is on top.
      $$
      \begin{aligned}
      \text{Total Area} &= \int_{0}^{4} {\color{#2563eb}{|f(x) - x|}} \, dx \quad \text{(Matches Statement II)}
      \end{aligned}
      $$

      == step: Split the Absolute-Value Integral at the Interior Intersection x = 2
      -- why: Identify which curve lies on top on each subinterval so you can rewrite $|f(x) - x|$ as $(\text{upper} - \text{lower})$ without absolute value bars.
      $$
      \begin{aligned}
      \text{On } [0, 2]: &\quad f(x) \ge x \implies |f(x) - x| = {\color{#2563eb}{f(x) - x}} \\[.3cm]
      \text{On } [2, 4]: &\quad x \ge f(x) \implies |f(x) - x| = {\color{#2563eb}{x - f(x)}}
      \end{aligned}
      $$
      Combining the two subintervals yields:
      $$
      \begin{aligned}
      \text{Total Area} &= \int_{0}^{2} \bigl({\color{#2563eb}{f(x) - x}}\bigr) \, dx + \int_{2}^{4} \bigl({\color{#2563eb}{x - f(x)}}\bigr) \, dx \quad \text{(Matches Statement III)}
      \end{aligned}
      $$

      == step: Evaluate Statement I to Confirm Why It Fails
      -- why: Compare placing absolute value bars outside the integral versus inside the integrand when the integrand changes sign on $(0, 4)$.
      $$
      \begin{aligned}
      \left|\int_{0}^{4} \bigl(f(x) - x\bigr) \, dx\right| &= \left|\int_{0}^{2} \bigl(f(x) - x\bigr) \, dx + \int_{2}^{4} \bigl(f(x) - x\bigr) \, dx\right| \\[.4cm]
      &= \bigl|{\color{#2563eb}{A_1 - A_2}}\bigr| \neq A_1 + A_2
      \end{aligned}
      $$
      Because $(f(x) - x)$ is positive on $(0, 2)$ and negative on $(2, 4)$, Statement I subtracts the two areas before taking the absolute value rather than summing them.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) II only:** *Incomplete Equivalent-Form Recognition Trap.* Recognizes the general absolute-value definition $\displaystyle\int_{0}^{4} |f(x) - x| \, dx$, but overlooks that Statement III is its exact piecewise expansion across $x = 2$.
      * **(B) III only:** *Incomplete Equivalent-Form Recognition Trap.* Correctly splits the region into $(\text{top} - \text{bottom})$ across $[0, 2]$ and $[2, 4]$, but misses that Statement II represents the exact same quantity in compact absolute-value notation.
      * **(C) I and II only:** *Absolute Value Outside vs. Inside Integral Trap.* Confuses $\left|\displaystyle\int_{0}^{4} (f(x) - x)\,dx\right|$ (which cancels signed areas on $[0, 2]$ and $[2, 4]$ before taking the magnitude) with $\displaystyle\int_{0}^{4} |f(x) - x|\,dx$ (which sums the positive areas of both regions).
      * **(D) II and III only:** **Correct.** Both $\displaystyle\int_{0}^{4} |f(x) - x| \, dx$ and $\displaystyle\int_{0}^{2} (f(x) - x) \, dx + \displaystyle\int_{2}^{4} (x - f(x)) \, dx$ accurately represent the sum of the two enclosed geometric areas.

  - id: "ap-calc-1a-q29"
    questionNumber: 29
    questionType: "MC"
    layout: "split"
    correctAnswer: "D"
    domain: "Differentiation: Analytical Applications of Differentiation"
    skill: "Using the Extreme Value Theorem and Locating Critical Points"
    difficulty: "Hard"
    stimulus: |
      | $x$ | $1$ | $2$ | $3$ | $4$ | $5$ |
      | :--- | :---: | :---: | :---: | :---: | :---: |
      | $g(x)$ | $8$ | $3$ | $5$ | $9$ | $7$ |

      The table above gives values of the continuous function $g$ at selected values of $x$. It is given that $g$ has exactly two critical points on the open interval $(1, 5)$.
    prompt: |
      Which of the following must be true?
    options:
      - id: "A"
        text: "$g(x) > 0$ for all $x$ in the open interval $(1, 5)$."
      - id: "B"
        text: "$g'(x)$ exists for all $x$ in the open interval $(1, 5)$."
      - id: "C"
        text: "$g'(x) < 0$ for all $x$ in the open interval $(1, 2)$."
      - id: "D"
        text: "$g'(3)$ does not equal $0$"
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine which statement is guaranteed to hold on $(1, 5)$ for the continuous function $g$ by combining the **Extreme Value Theorem** with the given constraint that $g$ has **exactly two critical points** on $(1, 5)$.

      :::tabs
      == tab: Solving the question with Calculus
      Because Section I, Part A is calculator-inactive and $g$ is continuous on $[1, 5]$ (not necessarily differentiable everywhere), apply the Extreme Value Theorem to two disjoint closed subintervals—$[1, 3]$ and $[3, 5]$—to force each subinterval to contain an interior extremum, thereby accounting for all allowed critical points on $(1, 5)$.

      :::derivation
      == step: Guarantee an Interior Critical Point on (1, 3) via the Extreme Value Theorem
      -- why: Compare the interior value $g(2) = 3$ to the endpoints $g(1) = 8$ and $g(3) = 5$ on the closed interval $[1, 3]$.
      $$
      g(2) = {\color{#2563eb}{3}} < \min\bigl(g(1), g(3)\bigr) = \min(8, 5) = 5
      $$
      Because $g$ is continuous on $[1, 3]$, the Extreme Value Theorem guarantees an absolute minimum on $[1, 3]$, and since $g(2) = 3$ is smaller than both endpoint values, that minimum must occur strictly inside the open interval ${\color{#2563eb}{(1, 3)}}$. Every interior local extremum occurs at a critical point, so $g$ has at least one critical point in ${\color{#2563eb}{(1, 3)}}$.

      == step: Guarantee a Second Interior Critical Point on (3, 5) via the Extreme Value Theorem
      -- why: Compare the interior value $g(4) = 9$ to the endpoints $g(3) = 5$ and $g(5) = 7$ on the closed interval $[3, 5]$.
      $$
      g(4) = {\color{#2563eb}{9}} > \max\bigl(g(3), g(5)\bigr) = \max(5, 7) = 7
      $$
      Because $g$ is continuous on $[3, 5]$, the Extreme Value Theorem guarantees an absolute maximum on $[3, 5]$, and since $g(4) = 9$ exceeds both endpoint values, that maximum must occur strictly inside the open interval ${\color{#2563eb}{(3, 5)}}$. Hence $g$ has at least one critical point in ${\color{#2563eb}{(3, 5)}}$.

      == step: Account for All Critical Points on (1, 5) to Deduce Behavior at x = 3
      -- why: Use the fact that $(1, 3)$ and $(3, 5)$ are disjoint and $g$ has only two critical points in total on $(1, 5)$.
      $$
      \begin{aligned}
      \text{Critical points in } (1, 3) &\ge {\color{#2563eb}{1}} \\[.2cm]
      \text{Critical points in } (3, 5) &\ge {\color{#2563eb}{1}} \\[.2cm]
      \text{Total critical points in } (1, 5) &= {\color{#2563eb}{2}} \\[.2cm]
      \implies \text{No critical point} &\text{ can exist at } x = 3
      \end{aligned}
      $$
      By definition, $x = 3$ would be a critical point if $g'(3) = 0$ or if $g'(3)$ did not exist. Since $x = 3$ is not a critical point, $g'(3)$ must exist and satisfy:
      $$
      g'(3) \neq 0
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $g(x) > 0$ for all $x$ in the open interval $(1, 5)$.:** *Interpolated Positivity Trap.* Although every tabulated output is positive, a continuous function can dip below $y = 0$ between $x = 1$ and $x = 3$ (for instance, attaining an absolute minimum of $-1$ at $x = 1.5$) while still matching every entry in the table and having exactly two critical points.
      * **(B) $g'(x)$ exists for all $x$ in the open interval $(1, 5)$.:** *Continuity vs. Differentiability Trap.* Critical points occur where $g'(x) = 0$ or where $g'(x)$ is undefined. One or both of the two critical points in $(1, 3)$ and $(3, 5)$ could be a sharp corner or cusp where $g'(x)$ fails to exist.
      * **(C) $g'(x) < 0$ for all $x$ in the open interval $(1, 2)$.:** *Monotonicity Between Table Entries Trap.* Even though $g(1) = 8 > 3 = g(2)$, the local minimum guaranteed on $(1, 3)$ could occur at $x = 1.5$ (say with $g(1.5) = 1$), making $g$ increase on $(1.5, 2)$ so that $g'(x) > 0$ for $x \in (1.5, 2)$.
      * **(D) $g'(3)$ does not equal $0$:** **Correct.** The Extreme Value Theorem forces one critical point inside $(1, 3)$ and a second critical point inside $(3, 5)$. Because $g$ has only two critical points on $(1, 5)$, $x = 3$ cannot be a critical point, so $g'(3)$ exists and cannot equal $0$.
---