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
    correctAnswer: "B"
    domain: "Differentiation: Definition and Fundamental Properties"
    skill: "Applying the Power Rule and Basic Derivative Rules"
    difficulty: "Easy"
    prompt: "If $f$ is the function given by $f(x) = \\dfrac{9}{x^2} + 4x + 3$, then $f'(3) =$"
    explanation: |
      **Core Concept:** Before applying the Power Rule, rewrite rational terms with negative exponents: $\dfrac{c}{x^n} = c x^{-n}$. Differentiate term-by-term using $\dfrac{d}{dx}[x^n] = n x^{n-1}$, then substitute the evaluation point.

      **Step-by-Step Solution:**
      - Rewrite $f(x)$ in power form:
         $$f(x) = 9x^{-2} + 4x + 3$$

      - Differentiate term-by-term with respect to $x$:
         $$f'(x) = 9(-2x^{-3}) + 4(1) + 0 = -18x^{-3} + 4 = -\dfrac{18}{x^3} + 4$$

      - Evaluate at $x = 3$:
         $$f'(3) = -\dfrac{18}{3^3} + 4 = -\dfrac{18}{27} + 4 = -\dfrac{2}{3} + \dfrac{12}{3} = \dfrac{10}{3}$$

      **Distractor Rationale:**
      * **A** ($\dfrac{8}{3}$): Drops the negative sign on the exponent rule, computing $\dfrac{2}{3} + \dfrac{6}{3} = \dfrac{8}{3}$ or making an arithmetic error when combining $-\dfrac{2}{3} + 4$.
      * **C** ($\dfrac{14}{3}$): Forgets the negative sign resulting from differentiating $x^{-2}$, evaluating $+\dfrac{2}{3} + 4 = \dfrac{14}{3}$.
      * **D** ($6$): Differentiates the denominator in place ($\dfrac{d}{dx}[x^2] = 2x$), writing $f'(x) = \dfrac{9}{2x} + 4$ and evaluating $\dfrac{9}{6} + 4 = \dfrac{3}{2} + 4 = \dfrac{11}{2} \approx 6$.

      Therefore, choice **B** is correct.
    options:
      - id: "A"
        text: "$\\dfrac{8}{3}$"
      - id: "B"
        text: "$\\dfrac{10}{3}$"
      - id: "C"
        text: "$\\dfrac{14}{3}$"
      - id: "D"
        text: "$6$"

  - id: "ap-calc-1a-q2"
    questionNumber: 2
    questionType: "MC"
    correctAnswer: "A"
    domain: "Integration and Accumulation of Change"
    skill: "Antiderivatives and Indefinite Integrals"
    difficulty: "Easy"
    prompt: "$\\displaystyle\\int 8e^{4x} \\, dx =$"
    explanation: |
      **Core Concept:** The indefinite integral of an exponential composite function of the linear form $e^{kx}$ is $\displaystyle\int e^{kx} \, dx = \dfrac{1}{k}e^{kx} + C$. For standard $u$-substitution, set $u = kx$ so that $dx = \dfrac{1}{k}\, du$.

      **Step-by-Step Solution:**
      1. Set up $u$-substitution:
         Let $u = 4x \implies du = 4 \, dx \implies dx = \dfrac{1}{4} \, du$

      2. Transform the integral into terms of $u$:
         $$\displaystyle\int 8e^{4x} \, dx = \displaystyle\int 8e^u \left(\dfrac{1}{4} \, du\right) = 2 \displaystyle\int e^u \, du$$

      3. Integrate and substitute back $u = 4x$:
         $$2e^u + C = 2e^{4x} + C$$

      **AP Exam Tip (Mental Check):** Always differentiate your antiderivative to verify: $\dfrac{d}{dx}\left[2e^{4x} + C\right] = 2(4)e^{4x} = 8e^{4x}$.

      **Distractor Rationale:**
      * **B** ($8e^{4x} + C$): Forgets to divide by the inner derivative $k = 4$ (chain rule factor for integration).
      * **C** ($32e^{4x} + C$): Multiplies by the internal derivative ($8 \times 4$) rather than dividing by it, confusing integration with differentiation.
      * **D** ($\dfrac{8e^{4x+1}}{4x+1} + C$): Mistakenly applies the algebraic Power Rule $\dfrac{x^{n+1}}{n+1}$ to an exponential function.

      Therefore, choice **A** is correct.
    options:
      - id: "A"
        text: "$2e^{4x} + C$"
      - id: "B"
        text: "$8e^{4x} + C$"
      - id: "C"
        text: "$32e^{4x} + C$"
      - id: "D"
        text: "$\\dfrac{8e^{4x+1}}{4x+1} + C$"

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
      To determine whether the two-sided limit $\lim_{x \to 2} g(x)$ exists, compare the one-sided limits from the left and right:
      
      * Left-hand limit: As $x$ approaches $2$ from values less than $2$, the graph approaches the open circle at $y = 1$, so $\lim_{x \to 2^-} g(x) = 1$.
      * Right-hand limit: As $x$ approaches $2$ from values greater than $2$, the graph approaches the open circle at $y = 4$, so $\lim_{x \to 2^+} g(x) = 4$.

      Because $\lim_{x \to 2^-} g(x) \neq \lim_{x \to 2^+} g(x)$, the two-sided limit does not exist.

      Distractor rationale:
      * **A** ($-1$): Confuses the limit with the defined function value $g(2) = -1$.
      * **B** ($1$): Evaluates only the left-hand limit $\lim_{x \to 2^-} g(x)$.
      * **C** ($4$): Evaluates only the right-hand limit $\lim_{x \to 2^+} g(x)$.

      Therefore, choice **D** is correct.

  - id: "ap-calc-1a-q4"
    questionNumber: 4
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
      Find the general antiderivative of $f'(x)$:
      $$f(x) = \displaystyle\int (3x^2 - 4x) \, dx = x^3 - 2x^2 + C$$

      Use the initial condition $f(3) = 5$ to solve for the constant of integration $C$:
      $$f(3) = (3)^3 - 2(3)^2 + C = 5$$
      $$27 - 18 + C = 5$$
      $$9 + C = 5 \implies C = -4$$

      Substitute $C = -4$ into the particular solution and evaluate at $x = 1$:
      $$f(x) = x^3 - 2x^2 - 4$$
      $$f(1) = (1)^3 - 2(1)^2 - 4 = 1 - 2 - 4 = -5$$

      Alternatively, apply the Fundamental Theorem of Calculus:
      $$f(1) = f(3) + \displaystyle\int_{3}^{1} f'(x) \, dx = 5 - \displaystyle\int_{1}^{3} (3x^2 - 4x) \, dx$$
      $$f(1) = 5 - \left[ x^3 - 2x^2 \right]_{1}^{3} = 5 - \left[ (27 - 18) - (1 - 2) \right] = 5 - [9 - (-1)] = 5 - 10 = -5$$

      Distractor rationale:
      * **B** ($-1$): Omits the constant of integration entirely and computes $(1)^3 - 2(1)^2$.
      * **C** ($3$): Signs error in finding $C$ ($C = +4$).
      * **D** ($13$): Adds the integral from $1$ to $3$ instead of subtracting it ($5 + 8$).

      Therefore, choice **A** is correct.

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
      The total volume of water pumped into the tank over the interval $[0, 16]$ is given by the definite integral:
      $$\displaystyle\int_{0}^{16} W(t) \, dt$$

      Approximate this integral using a right Riemann sum over the three subintervals $[0, 4]$, $[4, 10]$, and $[10, 16]$:

      1. **Subinterval 1 ($[0, 4]$):**
         $$\Delta t_1 = 4 - 0 = 4$$
         Right endpoint rate: $W(4) = 80$
         Accumulation: $4 \times 80 = 320$

      2. **Subinterval 2 ($[4, 10]$):**
         $$\Delta t_2 = 10 - 4 = 6$$
         Right endpoint rate: $W(10) = 65$
         Accumulation: $6 \times 65 = 390$

      3. **Subinterval 3 ($[10, 16]$):**
         $$\Delta t_3 = 16 - 10 = 6$$
         Right endpoint rate: $W(16) = 45$
         Accumulation: $6 \times 45 = 270$

      Sum the three contributions:
      $$\text{Total} \approx 320 + 390 + 270 = 980\text{ gallons}$$

      Distractor rationale:
      * **A** ($190$): Adds the right-endpoint rates directly without multiplying by interval widths ($80 + 65 + 45$).
      * **B** ($760$): Assumes an equal width of $\Delta t = 4$ for all intervals ($4 \times 190$).
      * **D** ($1{,}190$): Computes a left Riemann sum using left endpoints $W(0)=80$, $W(4)=80$, and $W(10)=65$: $4(80) + 6(80) + 6(65) = 320 + 480 + 390 = 1{,}190$.

      Therefore, choice **C** is correct.

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
      Apply the product rule $\dfrac{d}{dx}[u \cdot v] = u'v + uv'$ where $u = x^3$ and $v = e^x + 2$:
      
      * $u' = 3x^2$
      * $v' = e^x$

      Substitute into the formula:
      $$\dfrac{dy}{dx} = 3x^2(e^x + 2) + x^3(e^x)$$
      $$\dfrac{dy}{dx} = 3x^2 e^x + 6x^2 + x^3 e^x = x^3 e^x + 3x^2 e^x + 6x^2$$

      Alternatively, expand the expression before differentiating:
      $$y = x^3 e^x + 2x^3$$
      $$\dfrac{dy}{dx} = \left(3x^2 e^x + x^3 e^x\right) + 6x^2 = x^3 e^x + 3x^2 e^x + 6x^2$$

      Distractor rationale:
      * **A** ($3x^2 e^x$): Differentiates each factor individually and multiplies them together: $\dfrac{d}{dx}[x^3] \cdot \dfrac{d}{dx}[e^x + 2] = (3x^2)(e^x)$.
      * **B** ($3x^2 e^x + 6x^2$): Differentiates only the first factor $x^3$ and distributes across $(e^x + 2)$, omitting the $x^3 e^x$ term.
      * **C** ($x^3 e^x + 3x^2 e^x + 2x^3$): Differentiates the first term correctly but fails to differentiate $2x^3$.

      Therefore, choice **D** is correct.

  - id: "ap-calc-1a-q7"
    questionNumber: 7
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
      Find the velocity function $v(t)$ by integrating acceleration:
      $$v(t) = \displaystyle\int a(t) \, dt = \displaystyle\int -6 \cos(3t) \, dt = -2 \sin(3t) + C_1$$

      Apply the initial velocity condition $v(0) = 4$:
      $$-2 \sin(0) + C_1 = 4 \implies 0 + C_1 = 4 \implies C_1 = 4$$
      $$v(t) = -2 \sin(3t) + 4$$

      Find the position function $x(t)$ by integrating velocity:
      $$x(t) = \displaystyle\int v(t) \, dt = \displaystyle\int \left(-2 \sin(3t) + 4\right) \, dt = \dfrac{2}{3} \cos(3t) + 4t + C_2$$

      Apply the initial position condition $x(0) = 1$:
      $$\dfrac{2}{3} \cos(0) + 4(0) + C_2 = 1$$
      $$\dfrac{2}{3}(1) + 0 + C_2 = 1 \implies C_2 = 1 - \dfrac{2}{3} = \dfrac{1}{3}$$

      Substitute $C_2$ back into $x(t)$:
      $$x(t) = \dfrac{2}{3} \cos(3t) + 4t + \dfrac{1}{3}$$

      Distractor rationale:
      * **A** ($\\dfrac{2}{3} \\cos(3t) + 4t + 1$): Incorrectly assumes $C_2 = x(0) = 1$ without accounting for the non-zero value of $\\dfrac{2}{3}\\cos(0)$.
      * **C** ($-\\dfrac{2}{3} \\cos(3t) + 4t + \\dfrac{5}{3}$): Makes a sign error when taking the antiderivative of $-\\sin(3t)$.
      * **D** ($-18 \\cos(3t) + 4t + 19$): Differentiates trigonometric arguments by multiplying by $3$ instead of dividing by $3$.

      Therefore, choice **B** is correct.

  - id: "ap-calc-1a-q8"
    questionNumber: 8
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
      The sign of the second derivative $g''$ determines the concavity of the original function $g$:
      * When $g''(x) > 0$, the graph of $g$ is **concave up**.
      * When $g''(x) < 0$, the graph of $g$ is **concave down**.
      * Points where $g''$ crosses the $x$-axis represent inflection points where the concavity changes.

      From the given graph of $g''$:
      1. For $x < -1$: $g''(x) < 0$, so $g$ must be **concave down**.
      2. For $-1 < x < 1$: $g''(x) > 0$, so $g$ must be **concave up** (with a local minimum near $x = 0$).
      3. For $x > 1$: $g''(x) < 0$, so $g$ must be **concave down**.

      Only the graph in **A** exhibits this concavity sequence: concave down $\rightarrow$ concave up $\rightarrow$ concave down, with inflection points located at $x = -1$ and $x = 1$.

      Distractor rationale:
      * **B**: Displays the opposite concavity pattern (concave up $\rightarrow$ concave down $\rightarrow$ concave up), which would result from an upward-opening second derivative.
      * **C**: Represents a cubic-like polynomial with only one point of inflection near $x = 0$.
      * **D**: Displays a curve that is concave down everywhere with no changes in concavity.

      Therefore, choice **A** is correct.

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
      Recognize the limit as the limit definition of the derivative of the function $f(x) = \ln(x)$:
      $$f'(x) = \lim_{h \to 0} \dfrac{f(x+h) - f(x)}{h} = \lim_{h \to 0} \dfrac{\ln(x+h) - \ln(x)}{h}$$

      The derivative of $f(x) = \ln(x)$ is:
      $$f'(x) = \dfrac{1}{x}$$

      Evaluating at the given value $x = 5e$:
      $$f'(5e) = \dfrac{1}{5e}$$

      Distractor rationale:
      * **B** ($\dfrac{1}{5}$): Drops the constant $e$ from the denominator.
      * **C** ($\ln(5e)$): Confuses the derivative of the function with the function value $f(5e)$.
      * **D** (nonexistent): Erroneously assumes the expression does not exist due to direct substitution yielding the indeterminate form $\dfrac{0}{0}$.

      Therefore, choice **A** is correct.

  - id: "ap-calc-1a-q10"
    questionNumber: 10
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
      Note that the given equation provides the first derivative $\dfrac{dy}{dx}$, not $y$. To find the third derivative $\dfrac{d^3y}{dx^3}$, differentiate the given expression two more times with respect to $x$:

      1. First additional differentiation yields the second derivative:
         $$\dfrac{d^2y}{dx^2} = \dfrac{d}{dx}\left(2x^4 - 3x^3 + x - 5\right) = 8x^3 - 9x^2 + 1$$

      2. Second additional differentiation yields the third derivative:
         $$\dfrac{d^3y}{dx^3} = \dfrac{d}{dx}\left(8x^3 - 9x^2 + 1\right) = 24x^2 - 18x$$

      Evaluate $\dfrac{d^3y}{dx^3}$ at $x = 2$:
      $$\left.\dfrac{d^3y}{dx^3}\right|_{x=2} = 24(2)^2 - 18(2) = 24(4) - 36 = 96 - 36 = 60$$

      Distractor rationale:
      * **A** ($29$): Differentiates only once, evaluating $\dfrac{d^2y}{dx^2}$ at $x = 2$: $8(8) - 9(4) + 1 = 29$.
      * **C** ($78$): Treats the given equation as $y$ rather than $\dfrac{dy}{dx}$ and differentiates three times to obtain the fourth derivative: $48(2) - 18 = 78$.
      * **D** ($125$): Evaluates $\dfrac{dy}{dx}$ at $x = 2$ ($5$) and cubes it ($5^3 = 125$), misinterpreting the order of the derivative notation as an exponent.

      Therefore, choice **B** is correct.

  - id: "ap-calc-1a-q11"
    questionNumber: 11
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
      A function with a jump or removable discontinuity at an isolated point remains Riemann integrable, and the function value at a single point does not affect the value of the definite integral.

      Split the definite integral at the boundary $x = 0$:
      $$\displaystyle\int_{-1}^{2} g(x) \, dx = \displaystyle\int_{-1}^{0} 3x^2 \, dx + \displaystyle\int_{0}^{2} 2x \, dx$$

      Evaluate each piece separately:
      $$\displaystyle\int_{-1}^{0} 3x^2 \, dx = \left[ x^3 \right]_{-1}^{0} = 0^3 - (-1)^3 = 1$$
      $$\displaystyle\int_{0}^{2} 2x \, dx = \left[ x^2 \right]_{0}^{2} = 2^2 - 0^2 = 4$$

      Sum the results:
      $$\displaystyle\int_{-1}^{2} g(x) \, dx = 1 + 4 = 5$$

      Distractor rationale:
      * **A** ($4$): Only evaluates the positive branch $\displaystyle\int_{0}^{2} 2x \, dx$, ignoring the interval $[-1, 0]$.
      * **B** ($9$): Evaluates the first rule $3x^2$ over the entire interval $[-1, 2]$: $[x^3]_{-1}^{2} = 8 - (-1) = 9$.
      * **D** (nonexistent): Incorrectly assumes that a discontinuity at $x = 0$ makes the integral undefined.

      Therefore, choice **C** is correct.

  - id: "ap-calc-1a-q12"
    questionNumber: 12
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
      Differentiate both sides of the equation with respect to $x$:
      $$\dfrac{d}{dx}[5x + \cot y] = \dfrac{d}{dx}[7]$$

      Apply the chain rule to the second term:
      $$5 - \csc^2 y \dfrac{dy}{dx} = 0$$

      Isolate $\dfrac{dy}{dx}$:
      $$\csc^2 y \dfrac{dy}{dx} = 5$$
      $$\dfrac{dy}{dx} = \dfrac{5}{\csc^2 y}$$

      Using the reciprocal trigonometric identity $\dfrac{1}{\csc y} = \sin y$:
      $$\dfrac{dy}{dx} = 5 \sin^2 y$$

      Distractor rationale:
      * **B** ($-5 \\sin^2 y$): Forgets that $\dfrac{d}{dx}[\cot y] = -\csc^2 y \dfrac{dy}{dx}$, creating an extraneous negative sign.
      * **C** ($5 \\cos^2 y$): Incorrectly identifies the reciprocal of $\csc^2 y$ as $\cos^2 y$.
      * **D** ($-5 \\csc y \\cot y$): Confuses the derivative of $\cot y$ with that of $\csc y$.

      Therefore, choice **A** is correct.

  - id: "ap-calc-1a-q13"
    questionNumber: 13
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
      First, calculate the average velocity of the particle over the interval $[4, 25]$:
      $$v_{\text{avg}} = \dfrac{x(25) - x(4)}{25 - 4} = \dfrac{(\sqrt{25} + 3) - (\sqrt{4} + 3)}{21} = \dfrac{8 - 5}{21} = \dfrac{3}{21} = \dfrac{1}{7}$$

      Next, find the instantaneous velocity $v(t) = x'(t)$ by differentiating $x(t) = t^{1/2} + 3$:
      $$x'(t) = \dfrac{1}{2\sqrt{t}}$$

      Set the instantaneous velocity equal to the average velocity and solve for $t$:
      $$\dfrac{1}{2\sqrt{t}} = \dfrac{1}{7}$$
      $$2\sqrt{t} = 7 \implies \sqrt{t} = \dfrac{7}{2}$$
      $$t = \left(\dfrac{7}{2}\right)^2 = \dfrac{49}{4}$$

      Notice that $\dfrac{49}{4} = 12.25$, which lies within the open interval $(4, 25)$, as guaranteed by the Mean Value Theorem.

      Distractor rationale:
      * **A** ($4$): Selects the left endpoint of the interval.
      * **B** ($\dfrac{29}{2}$): Computes the midpoint of the interval $\dfrac{4 + 25}{2}$ instead of solving for $t$.
      * **D** ($49$): Omits the factor of $2$ in the derivative of $\sqrt{t}$ (solving $\dfrac{1}{\sqrt{t}} = \dfrac{1}{7} \implies t = 49$).

      Therefore, choice **C** is correct.

  - id: "ap-calc-1a-q14"
    questionNumber: 14
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
      Apply the chain rule repeatedly to differentiate the three-layer composite function:

      1. Differentiate the outermost cosine function:
         $$\dfrac{d}{dx}[\cos(u)] = -\sin(u) \cdot \dfrac{du}{dx}, \quad \text{where } u = g(x^3)$$

      2. Differentiate the middle function $g(x^3)$:
         $$\dfrac{d}{dx}\left[g(x^3)\right] = g'(x^3) \cdot \dfrac{d}{dx}[x^3]$$

      3. Differentiate the innermost function $x^3$:
         $$\dfrac{d}{dx}[x^3] = 3x^2$$

      Combine all factors:
      $$\dfrac{dy}{dx} = -\sin\left(g(x^3)\right) \cdot g'(x^3) \cdot 3x^2 = -3x^2 g'(x^3) \sin\left(g(x^3)\right)$$

      Evaluate at $x = 2$:
      $$\left.\dfrac{dy}{dx}\right|_{x=2} = -3(2)^2 g'\left(2^3\right) \sin\left(g\left(2^3\right)\right) = -12 g'(8) \sin(g(8))$$

      Distractor rationale:
      * **A** ($-\\sin(g'(8))$): Incorrectly differentiates inside the argument of the trigonometric function.
      * **B** ($-12 \\sin(g(8))$): Omits the derivative of the intermediate function $g'(8)$.
      * **D** ($-g'(8) \\sin(g(8))$): Omits the derivative of the innermost polynomial term $3x^2 = 12$.

      Therefore, choice **C** is correct.

  - id: "ap-calc-1a-q15"
    questionNumber: 15
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
      By the Fundamental Theorem of Calculus:
      $$f(5) = f(0) + \displaystyle\int_{0}^{5} f'(x) \, dx$$

      The definite integral $\displaystyle\int_{0}^{5} f'(x) \, dx$ corresponds to the net signed area between the graph of $f'$ and the $x$-axis from $x = 0$ to $x = 5$:

      1. **Interval $[0, 3]$:**
         This section forms a quarter circle of radius $r = 3$:
         $$\text{Area}_1 = \dfrac{1}{4} \pi (3)^2 = \dfrac{9\pi}{4}$$

      2. **Interval $[3, 5]$:**
         This section forms a right triangle with base $5 - 3 = 2$ and height $4$:
         $$\text{Area}_2 = \dfrac{1}{2}(2)(4) = 4$$

      Sum the initial value and accumulated areas:
      $$f(5) = 2 + \left(\dfrac{9\pi}{4} + 4\right) = \dfrac{9\pi}{4} + 6$$

      Distractor rationale:
      * **A** ($\dfrac{9\pi}{4} + 4$): Forgets to add the initial value $f(0) = 2$.
      * **B** ($\dfrac{9\pi}{2} + 4$): Uses the entire semicircle area $\dfrac{1}{2}\pi(3)^2 = \dfrac{9\pi}{2}$ instead of the quarter circle on $[0, 3]$, and forgets $f(0) = 2$.
      * **D** ($\dfrac{9\pi}{2} + 6$): Uses the full semicircle area $\dfrac{9\pi}{2}$ instead of $[0, 3]$.

      Therefore, choice **C** is correct.

  - id: "ap-calc-1a-q16"
    questionNumber: 16
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
      By the Extreme Value Theorem, a continuous function on a closed interval attains its absolute maximum either at an interior critical point or at one of the endpoints.

      Find the derivative and locate critical points:
      $$f'(x) = 3x^2 - 6x - 24 = 3(x^2 - 2x - 8) = 3(x - 4)(x + 2)$$

      Setting $f'(x) = 0$ yields $x = 4$ and $x = -2$. The only critical point inside the interval $[0, 5]$ is $x = 4$.

      Evaluate $f(x)$ at the critical point and at the endpoints $x = 0$ and $x = 5$:
      * $f(0) = (0)^3 - 3(0)^2 - 24(0) = 0$
      * $f(4) = (4)^3 - 3(4)^2 - 24(4) = 64 - 48 - 96 = -80$
      * $f(5) = (5)^3 - 3(5)^2 - 24(5) = 125 - 75 - 120 = -70$

      Comparing the values, the maximum value of $f$ on $[0, 5]$ is $0$, which occurs at $x = 0$.

      Distractor rationale:
      * **B** ($4$): Confuses the $x$-coordinate of the local minimum ($x = 4$) with the maximum function value.
      * **C** ($5$): Assumes the maximum occurs at the right-hand endpoint and reports the $x$-value ($5$).
      * **D** ($8$): Misinterprets the constant $8$ from factoring $x^2 - 2x - 8$.

      Therefore, choice **A** is correct.

  - id: "ap-calc-1a-q17"
    questionNumber: 17
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
      Complete the square for the quadratic expression in the denominator:
      $$x^2 - 6x + 10 = (x^2 - 6x + 9) + 1 = (x - 3)^2 + 1$$

      Rewrite the integral:
      $$\displaystyle\int \dfrac{1}{(x - 3)^2 + 1} \, dx$$

      Let $u = x - 3$, so $du = dx$:
      $$\displaystyle\int \dfrac{1}{u^2 + 1} \, du = \arctan(u) + C = \arctan(x - 3) + C$$

      Distractor rationale:
      * **B** ($\arcsin(x - 3) + C$): Confuses the integrand form with the derivative of $\arcsin(u)$, which requires a square root $\dfrac{1}{\sqrt{1 - u^2}}$.
      * **C** ($\ln|x^2 - 6x + 10| + C$): Incorrectly applies the natural logarithm rule without the derivative of the denominator ($2x - 6$) present in the numerator.
      * **D** ($\arctan(x + 3) + C$): Makes a sign error when completing the square, using $(x + 3)^2$ instead of $(x - 3)^2$.

      Therefore, choice **A** is correct.

  - id: "ap-calc-1a-q18"
    questionNumber: 18
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
      Find the slope of the tangent line by differentiating $f(x) = x^{1/2}$:
      $$f'(x) = \dfrac{1}{2\sqrt{x}}$$

      Evaluate the derivative at the point of tangency $x = 25$:
      $$f'(25) = \dfrac{1}{2\sqrt{25}} = \dfrac{1}{2(5)} = \dfrac{1}{10}$$

      Construct the equation of the tangent line $L(x)$ at $(25, 5)$:
      $$L(x) = 5 + \dfrac{1}{10}(x - 25)$$

      Use the tangent line to approximate $f(28)$:
      $$f(28) \approx L(28) = 5 + \dfrac{1}{10}(28 - 25) = 5 + \dfrac{3}{10} = \dfrac{53}{10}$$

      Distractor rationale:
      * **A** ($\dfrac{47}{10}$): Subtracts the change instead of adding it ($5 - \dfrac{3}{10}$).
      * **C** ($\dfrac{51}{10}$): Fails to multiply by $\Delta x = 3$, simply adding the slope to the base value ($5 + \dfrac{1}{10}$).
      * **D** ($\dfrac{28}{5}$): Drops the constant factor of $2$ when taking the derivative of $\sqrt{x}$, resulting in a slope of $\dfrac{1}{5}$ and an approximation of $5 + \dfrac{3}{5} = \dfrac{28}{5}$.

      Therefore, choice **B** is correct.

  - id: "ap-calc-1a-q19"
    questionNumber: 19
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
      Evaluating the limit by direct substitution yields the indeterminate form $\dfrac{0}{0}$:
      $$\dfrac{3(0)^2}{e^0 - 3(0) - 1} = \dfrac{0}{1 - 0 - 1} = \dfrac{0}{0}$$

      Because both numerator and denominator are differentiable and evaluate to $0$, apply L'Hôpital's Rule by differentiating the numerator and denominator with respect to $x$:
      $$\lim_{x \to 0} \dfrac{\dfrac{d}{dx}[3x^2]}{\dfrac{d}{dx}[e^{3x} - 3x - 1]} = \lim_{x \to 0} \dfrac{6x}{3e^{3x} - 3}$$

      Evaluating at $x = 0$ again yields the indeterminate form $\dfrac{0}{0}$:
      $$\dfrac{6(0)}{3e^0 - 3} = \dfrac{0}{3 - 3} = \dfrac{0}{0}$$

      Apply L'Hôpital's Rule a second time:
      $$\lim_{x \to 0} \dfrac{\dfrac{d}{dx}[6x]}{\dfrac{d}{dx}[3e^{3x} - 3]} = \lim_{x \to 0} \dfrac{6}{9e^{3x}}$$

      Now evaluate by direct substitution:
      $$\dfrac{6}{9e^0} = \dfrac{6}{9} = \dfrac{2}{3}$$

      Distractor rationale:
      * **A** ($0$): Stops after the first differentiation and evaluates the numerator as $0$ without recognizing the denominator is also $0$.
      * **C** ($2$): Forgets the chain rule factor of $3$ when taking the derivative of $3e^{3x}$ in the denominator, evaluating $\dfrac{6}{3} = 2$.
      * **D** (nonexistent): Erroneously assumes the indeterminate forms imply the limit does not exist.

      Therefore, choice **B** is correct.

  - id: "ap-calc-1a-q20"
    questionNumber: 20
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
      Because $h$ is twice-differentiable, $h$ is both continuous on the closed interval $[0, 8]$ and differentiable on the open interval $(0, 8)$.

      By the Mean Value Theorem, there must exist at least one value of $t$ in the open interval $(0, 8)$ such that the instantaneous rate of change equals the average rate of change:
      $$h'(t) = \dfrac{h(8) - h(0)}{8 - 0} = \dfrac{175 - 15}{8} = \dfrac{160}{8} = 20$$

      Distractor rationale:
      * **A**: A derivative of $0$ is guaranteed by Rolle's Theorem only when $h(a) = h(b)$, which is not the case here since $h$ is strictly increasing.
      * **C**: A twice-differentiable function does not necessarily have an inflection point ($h''(t) = 0$); for example, a purely concave-up function such as $h(t) = 15 + \dfrac{5}{2}t^2$ satisfies all given conditions without $h''(t)$ ever equaling $0$.
      * **D**: The function could be concave down, linear, or change concavity on the interval; it is not required to be concave up ($h''(t) > 0$) everywhere.

      Therefore, choice **B** is correct.

  - id: "ap-calc-1a-q21"
    questionNumber: 21
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
      Apply the Fundamental Theorem of Calculus Part 1 with the chain rule:
      $$\dfrac{d}{dx} \displaystyle\int_{a}^{u(x)} f(t) \, dt = f(u(x)) \cdot u'(x)$$

      Identify the components:
      * Integrand: $f(t) = \sqrt{t^2 + 5}$
      * Upper limit: $u(x) = x^4$
      * Derivative of upper limit: $u'(x) = 4x^3$
      * Lower limit: $a = 1$ (a constant, whose derivative contributes $0$)

      Substitute $u(x) = x^4$ into the integrand and multiply by $u'(x)$:
      $$f(x^4) \cdot u'(x) = \sqrt{(x^4)^2 + 5} \cdot 4x^3 = 4x^3 \sqrt{x^8 + 5}$$

      Distractor rationale:
      * **A** ($\sqrt{x^8 + 5}$): Omits the chain rule factor $4x^3$ from differentiating the upper limit.
      * **B** ($4x^3 \sqrt{x^4 + 5}$): Substitutes $x^4$ into $t$ without squaring it ($t^2$).
      * **D** ($\sqrt{x^8 + 5} - \sqrt{6}$): Applies the evaluation theorem $F(b) - F(a)$ directly to the integrand without differentiating.

      Therefore, choice **C** is correct.

  - id: "ap-calc-1a-q22"
    questionNumber: 22
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
      Analyze the slope field along axes and across quadrants:

      1. **Along the $y$-axis ($x = 0$):**
         The slope segments are horizontal ($\dfrac{dy}{dx} = 0$) at all points where $x = 0$ (except the origin). This eliminates options where the slope does not vanish when $x = 0$.

      2. **Along the $x$-axis ($y = 0$):**
         As points approach $y = 0$ for non-zero $x$, the segments become vertical (slopes approach $\pm \infty$ or are undefined). This indicates $y$ appears in the denominator, eliminating $\dfrac{dy}{dx} = xy$ and $\dfrac{dy}{dx} = -xy$.

      3. **Sign Analysis in Quadrant I ($x > 0, y > 0$):**
         The segments tilt downward from left to right, indicating negative slopes ($\dfrac{dy}{dx} < 0$).
         * For $\dfrac{dy}{dx} = \dfrac{x}{y}$, slopes in Quadrant I would be positive ($\dfrac{+}{+} = +$).
         * For $\dfrac{dy}{dx} = -\dfrac{x}{y}$, slopes in Quadrant I are negative ($-\dfrac{+}{+} = -$).

      Therefore, choice **B** is correct.

  - id: "ap-calc-1a-q23"
    questionNumber: 23
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
      Given the substitution $u = x - 2$:
      $$du = dx \quad \text{and} \quad x = u + 2$$

      Substitute both $x$ and $dx$ into the original integral:
      $$\displaystyle\int \dfrac{x}{\sqrt{x - 2}} \, dx = \displaystyle\int \dfrac{u + 2}{\sqrt{u}} \, du$$

      Separate the terms in the numerator and simplify using exponent rules:
      $$\displaystyle\int \left(\dfrac{u}{u^{1/2}} + \dfrac{2}{u^{1/2}}\right) du = \displaystyle\int \left(u^{1/2} + 2u^{-1/2}\right) du$$

      Distractor rationale:
      * **A**: Solves incorrectly for $x$ as $u - 2$ instead of $u + 2$, leading to a negative sign on the second term.
      * **B**: Drops the variable numerator $x$ entirely, replacing it with $1$.
      * **D**: Erroneously factors the variable term $(u + 2)$ outside the integral sign, which is only valid for non-zero constants.

      Therefore, choice **C** is correct.

  - id: "ap-calc-1a-q24"
    questionNumber: 24
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
      Factor the numerator and denominator completely:
      $$f(x) = \dfrac{3\left(x^2 - x - 6\right)}{x^2 - 5x + 6} = \dfrac{3(x - 3)(x + 2)}{(x - 3)(x - 2)}$$

      Discontinuities occur where the denominator equals zero, at $x = 2$ and $x = 3$:

      * **At $x = 3$:** The common linear factor $(x - 3)$ cancels from the numerator and denominator. Evaluating the limit as $x$ approaches $3$:
        $$\lim_{x \to 3} f(x) = \lim_{x \to 3} \dfrac{3(x + 2)}{x - 2} = \dfrac{3(3 + 2)}{3 - 2} = 15$$
        Because the two-sided limit exists and is finite while $f(3)$ is undefined, $f$ has a **removable discontinuity** at $x = 3$.

      * **At $x = 2$:** The factor $(x - 2)$ remains in the denominator. As $x \to 2$, the denominator approaches $0$ while the numerator approaches $3(4) = 12 \neq 0$, producing a vertical asymptote (non-removable discontinuity).

      Distractor rationale:
      * **B** ($2$ only): Identifies the location of the vertical asymptote rather than the removable discontinuity.
      * **C** ($-2$ and $3$): Confuses the zeros of the numerator with the points of discontinuity.
      * **D** ($2$ and $3$): Lists all points where $f(x)$ is undefined without distinguishing removable discontinuities from vertical asymptotes.

      Therefore, choice **A** is correct.

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
      A function $y$ is a solution to the differential equation if substituting $y$ and its second derivative $y''$ satisfies $y'' - 9y = 0$ (or equivalently, $y'' = 9y$).

      Test each option:
      * **Choice A ($y = e^{3x}$):**
        $$y' = 3e^{3x}$$
        $$y'' = 9e^{3x}$$
        $$y'' - 9y = 9e^{3x} - 9(e^{3x}) = 0$$
        This satisfies the differential equation.

      * **Choice B ($y = 3e^x$):**
        $$y' = 3e^x, \quad y'' = 3e^x \implies y'' - 9y = 3e^x - 27e^x = -24e^x \neq 0$$

      * **Choice C ($y = \sin(3x)$) and Choice D ($y = \cos(3x)$):**
        Differentiating twice introduces a negative sign:
        $$y'' = -9\sin(3x) \implies y'' - 9y = -9\sin(3x) - 9\sin(3x) = -18\sin(3x) \neq 0$$
        (These functions are solutions to $y'' + 9y = 0$, not $y'' - 9y = 0$).

      Therefore, choice **A** is correct.

  - id: "ap-calc-1a-q26"
    questionNumber: 26
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
      Analyze the behavior of $g$ across the intervals using the Extreme Value Theorem:

      1. **Interval $(1, 3)$:**
         Since $g(1) = 8$, $g(2) = 3$, and $g(3) = 5$, the continuous function $g$ decreases and then increases, attaining a local minimum value on the interval $(1, 3)$. A local extremum inside an open interval must occur at a critical point, so there is at least one critical point in $(1, 3)$.

      2. **Interval $(3, 5)$:**
         Since $g(3) = 5$, $g(4) = 9$, and $g(5) = 7$, the function increases and then decreases, attaining a local maximum value on the interval $(3, 5)$. This guarantees at least one critical point in $(3, 5)$.

      Because $g$ has **exactly two** critical points on $(1, 5)$, one must lie strictly inside $(1, 3)$ and the other strictly inside $(3, 5)$.

      If $g'(3) = 0$, then $x = 3$ would be a third distinct critical point on $(1, 5)$, contradicting the given condition. Therefore, $g'(3) \neq 0$.

      Distractor rationale:
      * **A**: While all tabulated values are positive, $g$ could dip below zero between $x = 1$ and $x = 2$ before reaching its minimum.
      * **B**: The function is given as continuous, not necessarily differentiable everywhere; a critical point can occur where $g'(x)$ is undefined.
      * **C**: While the average rate of change on $[1, 2]$ is negative, $g'(x)$ is not required to be negative at every individual point in $(1, 2)$.

      Therefore, choice **D** is correct.

  - id: "ap-calc-1a-q27"
    questionNumber: 27
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
      First, determine the value of $y$ at the given instant when $x = 12$:
      $$y^2 = (16 - 12)^3 = 4^3 = 64$$
      Since $y$ is a positive variable, $y = \sqrt{64} = 8$.

      Next, differentiate both sides of the equation with respect to $t$ using the chain rule:
      $$\dfrac{d}{dt}\left[y^2\right] = \dfrac{d}{dt}\left[(16 - x)^3\right]$$
      $$2y \dfrac{dy}{dt} = 3(16 - x)^2 \left(-\dfrac{dx}{dt}\right)$$
      $$2y \dfrac{dy}{dt} = -3(16 - x)^2 \dfrac{dx}{dt}$$

      Substitute the known values $y = 8$, $x = 12$, and $\dfrac{dy}{dt} = 18$:
      $$2(8)(18) = -3(16 - 12)^2 \dfrac{dx}{dt}$$
      $$288 = -3(4^2) \dfrac{dx}{dt}$$
      $$288 = -48 \dfrac{dx}{dt}$$
      $$\dfrac{dx}{dt} = -\dfrac{288}{48} = -6$$

      Distractor rationale:
      * **B** ($6$): Omits the negative sign resulting from the chain rule when differentiating $(16 - x)$.
      * **C** ($-\\dfrac{1}{6}$): Inverts the ratio when isolating $\\dfrac{dx}{dt}$.
      * **D** ($-12$): Drops the coefficient of $2$ when taking the derivative of $y^2$, leading to $144 = -48 \\dfrac{dx}{dt}$ or dropping a factor of $2$.

      Therefore, choice **A** is correct.

  - id: "ap-calc-1a-q28"
    questionNumber: 28
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
      Evaluate the end behavior of the exponential terms as $x$ approaches $-\infty$:
      
      For any base $b > 1$, $\lim_{x \to -\infty} b^x = 0$. Since $3 > 1$ and $7 > 1$:
      $$\lim_{x \to -\infty} 3^x = 0 \quad \text{and} \quad \lim_{x \to -\infty} 7^x = 0$$

      Substitute these limits into the rational expression:
      $$\lim_{x \to -\infty} \dfrac{5 + 3^x}{2 - 7^x} = \dfrac{5 + 0}{2 - 0} = \dfrac{5}{2}$$

      Distractor rationale:
      * **A** ($-\dfrac{3}{7}$): Evaluates the ratio of the exponential terms as though $x \to +\infty$ rather than $-\infty$.
      * **B** ($0$): Assumes that the exponential term in the denominator dominates the constants as $x \to -\infty$.
      * **D** (nonexistent): Mistakenly assumes negative infinite limits involving exponentials are undefined.

      Therefore, choice **C** is correct.

  - id: "ap-calc-1a-q29"
    questionNumber: 29
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
      The total geometric area between two continuous curves on an interval $[a, b]$ is defined by:
      $$\text{Area} = \displaystyle\int_{a}^{b} |\text{upper} - \text{lower}| \, dx = \displaystyle\int_{0}^{4} |f(x) - x| \, dx$$
      Thus, expression **II** is correct.

      On the interval $[0, 2]$, the graph of $f$ lies above the line $y = x$, so $f(x) \ge x$. On the interval $[2, 4]$, the line $y = x$ lies above the graph of $f$, so $x \ge f(x)$. Splitting the integral across the intersection point $x = 2$ using $(\text{top} - \text{bottom})$ gives:
      $$\text{Area} = \displaystyle\int_{0}^{2} (f(x) - x) \, dx + \displaystyle\int_{2}^{4} (x - f(x)) \, dx$$
      Thus, expression **III** is correct.

      Expression **I** computes the absolute value of the net signed area across the entire interval $[0, 4]$. Because $(f(x) - x)$ is positive on $[0, 2]$ and negative on $[2, 4]$, the two regions cancel each other rather than sum together. Therefore, expression **I** does not represent the total enclosed area.

      Distractor rationale:
      * **A** (II only): Overlooks that expression III correctly expands the absolute value integral piecewise.
      * **B** (III only): Overlooks that expression II is the exact integral definition using absolute value.
      * **C** (I and II only): Incorrectly assumes that placing absolute value bars outside the entire integral produces the sum of the physical areas.

      Therefore, choice **D** is correct.
---