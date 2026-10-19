---
sectionId: "ap-calc-bc-t1-s1a"
sectionTitle: "Section I, Part A (No Calculator)"
sectionOrder: 1
timeLimit: 3600
config:
  calculator: "none"
  hasFormulaSheet: false
  layout: "single"
questions:
  - id: "ap-calc-bc-t1-s1a-q1"
    questionNumber: 1
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "Applying the Product Rule and Chain Rule"
    difficulty: "Easy"
    prompt: |
      If $f(x) = x\sqrt{4x + 3}$, then $f'(x) =$
    options:
      - id: "A"
        text: "$\\dfrac{6x + 3}{\\sqrt{4x + 3}}$"
      - id: "B"
        text: "$\\dfrac{9x + 6}{2\\sqrt{4x + 3}}$"
      - id: "C"
        text: "$\\dfrac{2}{\\sqrt{4x + 3}}$"
      - id: "D"
        text: "$\\dfrac{2x}{\\sqrt{4x + 3}}$"
    explanation: |
      Apply the product rule $\\dfrac{d}{dx}[u \\cdot v] = u'v + uv'$ with $u = x$ and $v = \\sqrt{4x + 3} = (4x + 3)^{1/2}$:

      1. **Differentiate each factor**:
         $$u' = \\dfrac{d}{dx}[x] = 1$$
         Using the chain rule for $v$:
         $$v' = \\dfrac{d}{dx}\\left[(4x + 3)^{1/2}\\right] = \\dfrac{1}{2}(4x + 3)^{-1/2} \\cdot \\dfrac{d}{dx}[4x + 3] = \\dfrac{1}{2\\sqrt{4x + 3}} \\cdot 4 = \\dfrac{2}{\\sqrt{4x + 3}}$$

      2. **Combine using the product rule**:
         $$f'(x) = 1 \\cdot \\sqrt{4x + 3} + x \\cdot \\dfrac{2}{\\sqrt{4x + 3}} = \\sqrt{4x + 3} + \\dfrac{2x}{\\sqrt{4x + 3}}$$

      3. **Find a common denominator**:
         $$f'(x) = \\dfrac{(\\sqrt{4x + 3})(\\sqrt{4x + 3}) + 2x}{\\sqrt{4x + 3}} = \\dfrac{(4x + 3) + 2x}{\\sqrt{4x + 3}} = \\dfrac{6x + 3}{\\sqrt{4x + 3}}$$

      **Distractor Rationale**:
      - **B is incorrect**: Results from omitting the inner derivative factor of $4$ when differentiating $\\sqrt{4x + 3}$, yielding $v' = \\frac{1}{2\\sqrt{4x+3}}$ and $\\frac{2(4x+3) + x}{2\\sqrt{4x+3}} = \\frac{9x+6}{2\\sqrt{4x+3}}$.
      - **C is incorrect**: Differentiates each factor separately and multiplies them together: $\\frac{d}{dx}[x] \\cdot \\frac{d}{dx}[\\sqrt{4x+3}] = 1 \\cdot \\frac{2}{\\sqrt{4x+3}}$.
      - **D is incorrect**: Evaluates only the second term $x \\cdot v'$ of the product rule, omitting $u'v = \\sqrt{4x+3}$.

  - id: "ap-calc-bc-t1-s1a-q2"
    questionNumber: 2
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Integration and Accumulation of Change"
    skill: "Antiderivatives and Indefinite Integrals"
    difficulty: "Easy"
    prompt: |
      $\displaystyle\int 5^{3x} \, dx =$
    options:
      - id: "A"
        text: "$\\dfrac{5^{3x}}{3\\ln 5} + C$"
      - id: "B"
        text: "$3(\\ln 5)5^{3x} + C$"
      - id: "C"
        text: "$\\dfrac{5^{3x}}{\\ln 5} + C$"
      - id: "D"
        text: "$\\dfrac{5^{3x+1}}{3x + 1} + C$"
    explanation: |
      To find the indefinite integral $\displaystyle\int 5^{3x} \, dx$, use $u$-substitution with the general exponential integration formula $\displaystyle\int a^u \, du = \dfrac{a^u}{\ln a} + C$:

      1. **Perform $u$-substitution**:
         Let $u = 3x$, which gives $du = 3 \, dx$, or $dx = \dfrac{1}{3} \, du$.

      2. **Substitute and evaluate the integral**:
         $$\displaystyle\int 5^{3x} \, dx = \dfrac{1}{3} \displaystyle\int 5^u \, du = \dfrac{1}{3} \left(\dfrac{5^u}{\ln 5}\right) + C = \dfrac{5^{3x}}{3\ln 5} + C$$

      **Distractor Rationale**:
      - **B is incorrect**: Differentiates the exponential function rather than integrating, computing $\frac{d}{dx}[5^{3x}] = 3(\ln 5)5^{3x}$.
      - **C is incorrect**: Accounts for the base $5$ by dividing by $\ln 5$, but neglects the factor of $\frac{1}{3}$ from the chain rule substitution $u = 3x$.
      - **D is incorrect**: Erroneously applies the power rule for polynomials ($\int x^n \, dx = \frac{x^{n+1}}{n+1}$) to an exponential expression.

  - id: "ap-calc-bc-t1-s1a-q3"
    questionNumber: 3
    questionType: "MC"
    layout: "single"
    correctAnswer: "D"
    domain: "Limits and Continuity"
    skill: "Determining Limits Using Algebraic Properties"
    difficulty: "Medium"
    prompt: |
      $\lim\limits_{x \to 4} \dfrac{|3x - 12|}{8 - 2x}$ is
    options:
      - id: "A"
        text: "$-\\dfrac{3}{2}$"
      - id: "B"
        text: "$0$"
      - id: "C"
        text: "$\\dfrac{3}{2}$"
      - id: "D"
        text: "nonexistent"
    explanation: |
      To evaluate the two-sided limit $\lim\limits_{x \to 4} \dfrac{|3x - 12|}{8 - 2x}$, analyze the one-sided limits by factoring common constants from the numerator and denominator:

      $$\dfrac{|3x - 12|}{8 - 2x} = \dfrac{|3(x - 4)|}{-2(x - 4)} = -\dfrac{3}{2} \cdot \dfrac{|x - 4|}{x - 4}$$

      1. **Evaluate the left-hand limit ($x \to 4^-$)**:
         When $x < 4$, the quantity $(x - 4)$ is negative, so $|x - 4| = -(x - 4)$:
         $$\lim_{x \to 4^-} \left(-\dfrac{3}{2} \cdot \dfrac{-(x - 4)}{x - 4}\right) = -\dfrac{3}{2} \cdot (-1) = \dfrac{3}{2}$$

      2. **Evaluate the right-hand limit ($x \to 4^+$)**:
         When $x > 4$, the quantity $(x - 4)$ is positive, so $|x - 4| = x - 4$:
         $$\lim_{x \to 4^+} \left(-\dfrac{3}{2} \cdot \dfrac{x - 4}{x - 4}\right) = -\dfrac{3}{2} \cdot (1) = -\dfrac{3}{2}$$

      3. **Compare one-sided limits**:
         Because $\lim\limits_{x \to 4^-} \dfrac{|3x - 12|}{8 - 2x} \neq \lim\limits_{x \to 4^+} \dfrac{|3x - 12|}{8 - 2x}$, the two-sided limit does not exist (is nonexistent).

      **Distractor Rationale**:
      - **A is incorrect**: Corresponds to evaluating only the right-hand limit ($x \to 4^+$) or simply removing the absolute value bars without piecewise consideration: $\frac{3(x-4)}{-2(x-4)} = -\frac{3}{2}$.
      - **B is incorrect**: Results from the misconception that evaluating the indeterminate form $\frac{0}{0}$ by direct substitution yields $0$.
      - **C is incorrect**: Corresponds to evaluating only the left-hand limit ($x \to 4^-$).

  - id: "ap-calc-bc-t1-s1a-q4"
    questionNumber: 4
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Integration and Accumulation of Change"
    skill: "Integrating Using Substitution"
    difficulty: "Medium"
    prompt: |
      $\displaystyle\int \dfrac{(x^{1/4} + 3)^3}{8x^{3/4}} \, dx =$
    options:
      - id: "A"
        text: "$\\dfrac{(x^{1/4} + 3)^4}{8} + C$"
      - id: "B"
        text: "$\\dfrac{(x^{1/4} + 3)^4}{32} + C$"
      - id: "C"
        text: "$\\dfrac{3(x^{1/4} + 3)^2}{32} + C$"
      - id: "D"
        text: "$\\dfrac{(x^{1/4} + 3)^4}{2} + C$"
    explanation: |
      To evaluate $\displaystyle\int \dfrac{(x^{1/4} + 3)^3}{8x^{3/4}} \, dx$, use $u$-substitution:

      1. **Choose the substitution variable**:
         Let $u = x^{1/4} + 3$.
         Differentiating with respect to $x$:
         $$du = \dfrac{1}{4}x^{-3/4} \, dx = \dfrac{1}{4x^{3/4}} \, dx \implies \dfrac{dx}{x^{3/4}} = 4 \, du$$

      2. **Substitute into the integrand**:
         $$\displaystyle\int \dfrac{(x^{1/4} + 3)^3}{8x^{3/4}} \, dx = \displaystyle\int \dfrac{u^3}{8} \cdot (4 \, du) = \dfrac{4}{8} \displaystyle\int u^3 \, du = \dfrac{1}{2} \displaystyle\int u^3 \, du$$

      3. **Integrate and back-substitute**:
         $$\dfrac{1}{2} \left(\dfrac{u^4}{4}\right) + C = \dfrac{u^4}{8} + C = \dfrac{(x^{1/4} + 3)^4}{8} + C$$

      **Distractor Rationale**:
      - **B is incorrect**: Forgets the inner factor of $\frac{1}{4}$ when computing the differential $du$, treating $\frac{dx}{x^{3/4}}$ simply as $du$, yielding $\frac{1}{8} \int u^3 \, du = \frac{u^4}{32} + C$.
      - **C is incorrect**: Applies differentiation procedures to $(x^{1/4} + 3)^3$ instead of evaluating an antiderivative.
      - **D is incorrect**: Evaluates $\frac{1}{2}\int u^3 \, du$ but fails to divide by the new power $4$ when integrating, resulting in $\frac{1}{2}u^4 + C$.

  - id: "ap-calc-bc-t1-s1a-q5"
    questionNumber: 5
    questionType: "MC"
    layout: "split"
    correctAnswer: "B"
    domain: "Integration and Accumulation of Change"
    skill: "Riemann Sums and Definite Integral Approximations"
    difficulty: "Medium"
    stimulus: |
      | $t \text{ (hours)}$ | $0$ | $3$ | $8$ | $14$ |
      | :---: | :---: | :---: | :---: | :---: |
      | $F(t) \text{ (gallons per hour)}$ | $120$ | $90$ | $70$ | $40$ |

      Industrial wastewater flows into a settling basin at a rate modeled by a continuous, decreasing function $F(t)$, where $t$ is measured in hours for $0 \le t \le 14$. The table above gives selected values of $F(t)$.
    prompt: |
      Using a right Riemann sum with the three subintervals indicated by the data in the table, what is the approximation of the total number of gallons of wastewater that flow into the basin during the $14$-hour period?
    options:
      - id: "A"
        text: "$200$"
      - id: "B"
        text: "$860$"
      - id: "C"
        text: "$980$"
      - id: "D"
        text: "$1{,}230$"
    explanation: |
      The total volume of wastewater entering the basin over the time interval $[0, 14]$ is given by the definite integral:
      $$\int_{0}^{14} F(t) \, dt$$

      Approximate this integral using a right Riemann sum with the three subintervals given in the table:

      1. **Subinterval 1 ($[0, 3]$)**:
         - Width: $\Delta t_1 = 3 - 0 = 3$
         - Right endpoint value: $F(3) = 90$
         - Volume contribution: $3 \times 90 = 270\text{ gallons}$

      2. **Subinterval 2 ($[3, 8]$)**:
         - Width: $\Delta t_2 = 8 - 3 = 5$
         - Right endpoint value: $F(8) = 70$
         - Volume contribution: $5 \times 70 = 350\text{ gallons}$

      3. **Subinterval 3 ($[8, 14]$)**:
         - Width: $\Delta t_3 = 14 - 8 = 6$
         - Right endpoint value: $F(14) = 40$
         - Volume contribution: $6 \times 40 = 240\text{ gallons}$

      Summing the three products gives:
      $$\text{Total} \approx 270 + 350 + 240 = 860\text{ gallons}$$

      **Distractor Rationale**:
      - **A is incorrect**: Adds the rate values at the right endpoints without multiplying by their respective subinterval widths: $90 + 70 + 40 = 200$.
      - **C is incorrect**: Assumes equal subinterval widths or averages endpoints incorrectly.
      - **D is incorrect**: Computes a left Riemann sum instead of a right Riemann sum: $3(120) + 5(90) + 6(70) = 360 + 450 + 420 = 1{,}230$.

  - id: "ap-calc-bc-t1-s1a-q6"
    questionNumber: 6
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Infinite Sequences and Series"
    skill: "Working with Geometric Series"
    difficulty: "Medium"
    prompt: |
      What is the sum of the series $\dfrac{5}{\pi} - \dfrac{5}{\pi^2} + \dfrac{5}{\pi^3} - \dfrac{5}{\pi^4} + \cdots + (-1)^{n+1}\dfrac{5}{\pi^n} + \cdots$ ?
    options:
      - id: "A"
        text: "$\\dfrac{5}{\\pi - 1}$"
      - id: "B"
        text: "$\\dfrac{5}{\\pi + 1}$"
      - id: "C"
        text: "$\\dfrac{5}{5 + \\pi}$"
      - id: "D"
        text: "The series diverges."
    explanation: |
      The given expression is an infinite geometric series of the form $\sum_{n=1}^\infty a r^{n-1}$:
      $$\dfrac{5}{\pi} - \dfrac{5}{\pi^2} + \dfrac{5}{\pi^3} - \dfrac{5}{\pi^4} + \cdots$$

      1. **Identify the first term $a$ and the common ratio $r$**:
         - First term: $a = \dfrac{5}{\pi}$
         - Common ratio: $r = \dfrac{-\dfrac{5}{\pi^2}}{\dfrac{5}{\pi}} = -\dfrac{1}{\pi}$

      2. **Verify convergence**:
         An infinite geometric series converges if and only if $|r| < 1$.
         Since $|r| = \left|-\dfrac{1}{\pi}\right| = \dfrac{1}{\pi} < 1$ (as $\pi \approx 3.14159$), the series converges.

      3. **Calculate the sum**:
         Using the sum formula $S = \dfrac{a}{1 - r}$:
         $$S = \dfrac{\dfrac{5}{\pi}}{1 - \left(-\dfrac{1}{\pi}\right)} = \dfrac{\dfrac{5}{\pi}}{1 + \dfrac{1}{\pi}} = \dfrac{\dfrac{5}{\pi}}{\dfrac{\pi + 1}{\pi}} = \dfrac{5}{\pi + 1}$$

      **Distractor Rationale**:
      - **A is incorrect**: Makes a sign error in the denominator by using $1 - r = 1 - \frac{1}{\pi}$, which would apply to a non-alternating series with a positive ratio $r = \frac{1}{\pi}$.
      - **C is incorrect**: Misapplies algebraic reduction when clearing complex fractions.
      - **D is incorrect**: Assumes that because $\pi > 1$, the terms do not approach zero, confusing the ratio $r = -\frac{1}{\pi}$ with its reciprocal $-\pi$.

  - id: "ap-calc-bc-t1-s1a-q7"
    questionNumber: 7
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Differentiation: Definition and Fundamental Properties"
    skill: "Defining the Derivative of a Function and Using Derivative Notation"
    difficulty: "Medium"
    prompt: |
      If $g(x) = (2x^2 - 1)^4$, what is $\lim\limits_{x \to -1} \dfrac{g(x) - g(-1)}{x + 1}$ ?
    options:
      - id: "A"
        text: "$-16$"
      - id: "B"
        text: "$-4$"
      - id: "C"
        text: "$0$"
      - id: "D"
        text: "$16$"
    explanation: |
      Recognize the limit as the alternative limit definition of the derivative of $g$ evaluated at $x = -1$:
      $$g'(-1) = \lim_{x \to -1} \dfrac{g(x) - g(-1)}{x - (-1)} = \lim_{x \to -1} \dfrac{g(x) - g(-1)}{x + 1}$$

      1. **Find the general derivative $g'(x)$ using the chain rule**:
         $$g'(x) = \dfrac{d}{dx}\left[(2x^2 - 1)^4\right] = 4(2x^2 - 1)^3 \cdot \dfrac{d}{dx}[2x^2 - 1]$$
         $$g'(x) = 4(2x^2 - 1)^3 \cdot (4x) = 16x(2x^2 - 1)^3$$

      2. **Evaluate $g'(x)$ at $x = -1$**:
         $$g'(-1) = 16(-1)\left(2(-1)^2 - 1\right)^3 = -16(2(1) - 1)^3 = -16(1)^3 = -16$$

      **Distractor Rationale**:
      - **B is incorrect**: Forgets to multiply by the inner derivative $4x$ when differentiating via the chain rule, evaluating $4(2(-1)^2 - 1)^3 \cdot (-1)$ or forgetting the outer factor $4$.
      - **C is incorrect**: Concludes the limit is $0$ because direct substitution into the numerator yields $g(-1) - g(-1) = 0$, failing to recognize an indeterminate form $\frac{0}{0}$.
      - **D is incorrect**: Makes a sign error when evaluating $x = -1$, yielding $+16$.

  - id: "ap-calc-bc-t1-s1a-q8"
    questionNumber: 8
    questionType: "MC"
    layout: "split"
    correctAnswer: "A"
    domain: "Differentiation: Analytical Applications of Differentiation"
    skill: "Connecting the Graphs of f, f', and f''"
    difficulty: "Hard"
    stimulus: |
      ![](./assets/APCalcBC-T1-S1A-Q8.svg)

      The graph of $g''$, the second derivative of the function $g$, is shown in the figure above.
    prompt: |
      Which of the following could be the graph of $g$ ?
    options:
      - id: "A"
        text: "![](./assets/APCalcBC-T1-S1A-Q8-A.svg)"
      - id: "B"
        text: "![](./assets/APCalcBC-T1-S1A-Q8-B.svg)"
      - id: "C"
        text: "![](./assets/APCalcBC-T1-S1A-Q8-C.svg)"
      - id: "D"
        text: "![](./assets/APCalcBC-T1-S1A-Q8-D.svg)"
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

  - id: "ap-calc-bc-t1-s1a-q9"
    questionNumber: 9
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Differential Equations"
    skill: "Approximating Values Using Local Linearity and Tangent Lines"
    difficulty: "Medium"
    prompt: |
      Let $y = f(x)$ be a differentiable function such that $\dfrac{dy}{dx} = \dfrac{2x - y}{x}$ and $f(2) = 1$. What is the approximation of $f(2.05)$ found by using the line tangent to the graph of $f$ at $x = 2$ ?
    options:
      - id: "A"
        text: "$0.075$"
      - id: "B"
        text: "$1.025$"
      - id: "C"
        text: "$1.075$"
      - id: "D"
        text: "$2.5$"
    explanation: |
      To approximate $f(2.05)$ using the tangent line at $x = 2$, determine the point of tangency and the slope $\left.\dfrac{dy}{dx}\right|_{(2, 1)}$:

      1. **Find the slope of the tangent line**:
         Substitute $x = 2$ and $y = 1$ into the differential equation:
         $$\left.\dfrac{dy}{dx}\right|_{(2, 1)} = \dfrac{2(2) - 1}{2} = \dfrac{4 - 1}{2} = \dfrac{3}{2} = 1.5$$

      2. **Write the equation of the tangent line $L(x)$**:
         $$L(x) = f(2) + f'(2)(x - 2)$$
         $$L(x) = 1 + 1.5(x - 2)$$

      3. **Evaluate $L(x)$ at $x = 2.05$**:
         $$L(2.05) = 1 + 1.5(2.05 - 2) = 1 + 1.5(0.05) = 1 + 0.075 = 1.075$$

      **Distractor Rationale**:
      - **A is incorrect**: Calculates only the change in $y$, $\Delta y = f'(2)\Delta x = 1.5(0.05) = 0.075$, forgetting to add the base function value $f(2) = 1$.
      - **B is incorrect**: Evaluates the slope incorrectly as $\frac{2 - 1}{2} = 0.5$ by dropping the coefficient $2$ on $x$, producing $1 + 0.5(0.05) = 1.025$.
      - **D is incorrect**: Neglects to multiply the slope by the step size $\Delta x = 0.05$, simply adding the slope directly to the initial value: $1 + 1.5 = 2.5$.
	 
  - id: "ap-calc-bc-t1-s1a-q10"
    questionNumber: 10
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Infinite Sequences and Series"
    skill: "Representing Functions as Power Series"
    difficulty: "Medium"
    prompt: |
      The series $1 - \dfrac{4x^2}{2!} + \dfrac{16x^4}{4!} - \dfrac{64x^6}{6!} + \cdots + (-1)^n \dfrac{(2x)^{2n}}{(2n)!} + \cdots$ converges to which of the following?
    options:
      - id: "A"
        text: "$\\cos(4x)$"
      - id: "B"
        text: "$e^{-4x^2}$"
      - id: "C"
        text: "$\\cos(2x)$"
      - id: "D"
        text: "$1 - 2x\\sin(2x)$"
    explanation: |
      Recall the standard Maclaurin series expansion for $\cos(u)$:
      $$\cos(u) = \sum_{n=0}^{\infty} (-1)^n \dfrac{u^{2n}}{(2n)!} = 1 - \dfrac{u^2}{2!} + \dfrac{u^4}{4!} - \dfrac{u^6}{6!} + \cdots$$

      1. **Compare terms with the given series**:
         The given series has terms with even powers of $x$ and corresponding even factorials $(2n)!$ in the denominator:
         $$1 - \dfrac{(2x)^2}{2!} + \dfrac{(2x)^4}{4!} - \dfrac{(2x)^6}{6!} + \cdots + (-1)^n \dfrac{(2x)^{2n}}{(2n)!} + \cdots$$

      2. **Substitute $u = 2x$ into the Maclaurin series for $\cos(u)$**:
         $$\sum_{n=0}^{\infty} (-1)^n \dfrac{(2x)^{2n}}{(2n)!} = \cos(2x)$$

      Therefore, the series converges to $\cos(2x)$ for all real numbers $x$.

      **Distractor Rationale**:
      - **A is incorrect**: Mistakenly uses the coefficient $4$ of the $x^2$ term as the internal argument rather than $2$, producing $\cos(4x) = 1 - \frac{16x^2}{2!} + \cdots$.
      - **B is incorrect**: Confuses the $(2n)!$ factorial pattern of the cosine series with the $n!$ pattern of the exponential series $e^u = \sum \frac{u^n}{n!}$.
      - **D is incorrect**: Conflates the series with an expression derived from integrating or multiplying trigonometric expansions.
	  
  - id: "ap-calc-bc-t1-s1a-q11"
    questionNumber: 11
    questionType: "MC"
    layout: "single"
    correctAnswer: "D"
    domain: "Integration and Accumulation of Change"
    skill: "Integrating Using Integration by Parts"
    difficulty: "Medium"
    prompt: |
      $\displaystyle\int x \sin(3x) \, dx =$
    options:
      - id: "A"
        text: "$-\\dfrac{1}{6}x^2 \\cos(3x) + C$"
      - id: "B"
        text: "$-\\dfrac{1}{3}x \\cos(3x) - \\dfrac{1}{9}\\sin(3x) + C$"
      - id: "C"
        text: "$\\dfrac{1}{3}x \\cos(3x) - \\dfrac{1}{9}\\sin(3x) + C$"
      - id: "D"
        text: "$-\\dfrac{1}{3}x \\cos(3x) + \\dfrac{1}{9}\\sin(3x) + C$"
    explanation: |
      To evaluate $\displaystyle\int x \sin(3x) \, dx$, apply integration by parts:
      $$\int u \, dv = uv - \int v \, du$$

      1. **Assign parts $u$ and $dv$**:
         Let $u = x \implies du = dx$
         Let $dv = \sin(3x) \, dx \implies v = \displaystyle\int \sin(3x) \, dx = -\dfrac{1}{3}\cos(3x)$

      2. **Apply the integration by parts formula**:
         $$\displaystyle\int x \sin(3x) \, dx = (x)\left(-\dfrac{1}{3}\cos(3x)\right) - \displaystyle\int \left(-\dfrac{1}{3}\cos(3x)\right) dx$$
         $$= -\dfrac{1}{3}x \cos(3x) + \dfrac{1}{3}\displaystyle\int \cos(3x) \, dx$$

      3. **Evaluate the remaining integral**:
         $$\displaystyle\int \cos(3x) \, dx = \dfrac{1}{3}\sin(3x)$$
         $$-\dfrac{1}{3}x \cos(3x) + \dfrac{1}{3}\left(\dfrac{1}{3}\sin(3x)\right) + C = -\dfrac{1}{3}x \cos(3x) + \dfrac{1}{9}\sin(3x) + C$$

      **Distractor Rationale**:
      - **A is incorrect**: Integrates each factor of the product separately and multiplies them together: $\int x\,dx \cdot \int \sin(3x)\,dx = (\frac{1}{2}x^2)(-\frac{1}{3}\cos(3x)) = -\frac{1}{6}x^2\cos(3x)$.
      - **B is incorrect**: Introduces a sign error on the second term, failing to distribute the negative sign in $-\int v\,du = -(-\frac{1}{3})\int \cos(3x)\,dx = +\frac{1}{3}\int \cos(3x)\,dx$.
      - **C is incorrect**: Makes a sign error when finding the antiderivative of $\sin(3x)$, erroneously using $+\frac{1}{3}\cos(3x)$ instead of $-\frac{1}{3}\cos(3x)$.
	  
  - id: "ap-calc-bc-t1-s1a-q12"
    questionNumber: 12
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "Differentiating Implicit Relations"
    difficulty: "Medium"
    prompt: |
      Given that $2x - \sec y = 5$, what is $\dfrac{dy}{dx}$ in terms of $y$ ?
    options:
      - id: "A"
        text: "$\\dfrac{dy}{dx} = -2\\cos y \\cot y$"
      - id: "B"
        text: "$\\dfrac{dy}{dx} = 2\\cos y \\cot y$"
      - id: "C"
        text: "$\\dfrac{dy}{dx} = 2\\sec y \\tan y$"
      - id: "D"
        text: "$\\dfrac{dy}{dx} = 2\\sin^2 y$"
    explanation: |
      Differentiate both sides of the equation implicitly with respect to $x$:
      $$\dfrac{d}{dx}[2x - \sec y] = \dfrac{d}{dx}[5]$$

      1. **Apply the chain rule to the trigonometric term**:
         $$2 - \sec y \tan y \dfrac{dy}{dx} = 0$$

      2. **Isolate $\dfrac{dy}{dx}$**:
         $$\sec y \tan y \dfrac{dy}{dx} = 2 \implies \dfrac{dy}{dx} = \dfrac{2}{\sec y \tan y}$$

      3. **Simplify using reciprocal trigonometric identities**:
         Using $\dfrac{1}{\sec y} = \cos y$ and $\dfrac{1}{\tan y} = \cot y$:
         $$\dfrac{dy}{dx} = 2 \left(\dfrac{1}{\sec y}\right)\left(\dfrac{1}{\tan y}\right) = 2 \cos y \cot y$$

      **Distractor Rationale**:
      - **A is incorrect**: Results from a sign error when solving $2 - \sec y \tan y \frac{dy}{dx} = 0$, carrying an extra negative sign to get $-2 \cos y \cot y$.
      - **C is incorrect**: Multiplies by the derivative of $\sec y$ rather than dividing by it when isolating $\frac{dy}{dx}$.
      - **D is incorrect**: Confuses the derivative of $\sec y$ with that of $\cot y$, which would yield $-\csc^2 y$ and reciprocal $\sin^2 y$.
	  
  - id: "ap-calc-bc-t1-s1a-q13"
    questionNumber: 13
    questionType: "MC"
    layout: "single"
    correctAnswer: "D"
    domain: "Differential Equations"
    skill: "Solving and Interpreting Logistic Models"
    difficulty: "Medium"
    prompt: |
      Which of the following graphs is the solution to the logistic differential equation $\dfrac{dP}{dt} = 0.4P\left(1 - \dfrac{P}{600}\right)$ with the initial condition $P(0) = 150$ ?
    options:
      - id: "A"
        text: "![](./assets/APCalcBC-T1-S1A-Q13-A.svg)"
      - id: "B"
        text: "![](./assets/APCalcBC-T1-S1A-Q13-B.svg)"
      - id: "C"
        text: "![](./assets/APCalcBC-T1-S1A-Q13-C.svg)"
      - id: "D"
        text: "![](./assets/APCalcBC-T1-S1A-Q13-D.svg)"
    explanation: |
      The given differential equation is the standard logistic model:
      $$\dfrac{dP}{dt} = kP\left(1 - \dfrac{P}{L}\right)$$
      where $k = 0.4$ is the growth rate constant and $L = 600$ is the carrying capacity.

      1. **Analyze asymptotic behavior**:
         Because the initial condition satisfies $0 < P(0) = 150 < 600$, the derivative $\dfrac{dP}{dt} > 0$ for all $t \ge 0$, meaning the solution $P(t)$ is strictly increasing. As $t \to \infty$, the population asymptotically approaches the carrying capacity $L = 600$, producing a horizontal asymptote at $P = 600$.

      2. **Determine concavity and inflection point**:
         Differentiating with respect to $t$:
         $$\dfrac{d^2P}{dt^2} = 0.4\left(1 - \dfrac{2P}{600}\right)\dfrac{dP}{dt}$$
         The inflection point occurs where $\dfrac{d^2P}{dt^2} = 0$, which corresponds to $P = \dfrac{L}{2} = 300$:
         - For $150 \le P < 300$, $\dfrac{d^2P}{dt^2} > 0$, so the curve is **concave up**.
         - For $300 < P < 600$, $\dfrac{d^2P}{dt^2} < 0$, so the curve is **concave down**.

      3. **Match with the correct graph**:
         The curve begins at $(0, 150)$, curves upward until reaching $P = 300$, changes concavity to concave down, and levels off along the horizontal dashed line $P = 600$. This matches the sigmoid graph shown in **D**.

      **Distractor Rationale**:
      - **A is incorrect**: Displays pure exponential growth ($P \to \infty$) with no upper bound or carrying capacity limit.
      - **B is incorrect**: Displays a decaying function that starts at $P(0) = 600$ and decreases toward $150$, which is inconsistent with $\frac{dP}{dt} > 0$ when $P = 150$.
      - **C is incorrect**: Displays a parabolic curve that rises and falls, failing to capture the asymptotic leveling at the carrying capacity.

  - id: "ap-calc-bc-t1-s1a-q14"
    questionNumber: 14
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Contextual and Analytical Applications of Differentiation"
    skill: "Determining Absolute Extrema on a Closed Interval"
    difficulty: "Medium"
    prompt: |
      What is the absolute minimum value of $f(x) = \cos x - \sqrt{3}\sin x$ on the closed interval $[0, \pi]$ ?
    options:
      - id: "A"
        text: "$-2\\sqrt{3}$"
      - id: "B"
        text: "$-2$"
      - id: "C"
        text: "$-1$"
      - id: "D"
        text: "$-\\sqrt{3}$"
    explanation: |
      By the Extreme Value Theorem, a continuous function on a closed interval attains its absolute extrema either at an interior critical point or at one of the endpoints.

      1. **Find the derivative and locate critical points**:
         $$f'(x) = -\sin x - \sqrt{3}\cos x$$
         Set $f'(x) = 0$:
         $$-\sin x = \sqrt{3}\cos x \implies \tan x = -\sqrt{3}$$
         On the interval $(0, \pi)$, $\tan x = -\sqrt{3}$ has exactly one solution in the second quadrant:
         $$x = \dfrac{2\pi}{3}$$

      2. **Evaluate $f(x)$ at the critical point and endpoints (Candidates Test)**:
         - **Left endpoint ($x = 0$)**:
           $$f(0) = \cos(0) - \sqrt{3}\sin(0) = 1 - 0 = 1$$
         - **Critical point ($x = \dfrac{2\pi}{3}$)**:
           $$f\left(\dfrac{2\pi}{3}\right) = \cos\left(\dfrac{2\pi}{3}\right) - \sqrt{3}\sin\left(\dfrac{2\pi}{3}\right) = -\dfrac{1}{2} - \sqrt{3}\left(\dfrac{\sqrt{3}}{2}\right) = -\dfrac{1}{2} - \dfrac{3}{2} = -2$$
         - **Right endpoint ($x = \pi$)**:
           $$f(\pi) = \cos(\pi) - \sqrt{3}\sin(\pi) = -1 - 0 = -1$$

      3. **Compare values**:
         Comparing $1$, $-2$, and $-1$, the smallest value is $-2$. Therefore, the absolute minimum value of $f$ on $[0, \pi]$ is $-2$.

      **Distractor Rationale**:
      - **A is incorrect**: Results from mistakenly multiplying the minimum value by $\sqrt{3}$.
      - **C is incorrect**: Corresponds to testing only the endpoints and choosing $f(\pi) = -1$, failing to identify or test the interior critical point at $x = \frac{2\pi}{3}$.
      - **D is incorrect**: Evaluates the function at the midpoint $x = \frac{\pi}{2}$, giving $f\left(\frac{\pi}{2}\right) = \cos\left(\frac{\pi}{2}\right) - \sqrt{3}\sin\left(\frac{\pi}{2}\right) = -\sqrt{3}$, without verifying whether it is a critical point.
  
  - id: "ap-calc-bc-t1-s1a-q15"
    questionNumber: 15
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Integration and Accumulation of Change"
    skill: "Calculating Definite Integrals Using Geometric Formulas"
    difficulty: "Medium"
    prompt: |
      ![](./assets/APCalcBC-T1-S1A-Q15.svg)

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

  - id: "ap-calc-bc-t1-s1a-q16"
    questionNumber: 16
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Integration and Accumulation of Change"
    skill: "Integrating Using Partial Fractions"
    difficulty: "Medium"
    prompt: |
      $\displaystyle\int \dfrac{2x + 1}{(1 - x)(2x - 3)} \, dx =$
    options:
      - id: "A"
        text: "$3\\ln|1 - x| - 4\\ln|2x - 3| + C$"
      - id: "B"
        text: "$3\\ln|1 - x| - 8\\ln|2x - 3| + C$"
      - id: "C"
        text: "$-3\\ln|1 - x| - 4\\ln|2x - 3| + C$"
      - id: "D"
        text: "$-3\\ln|1 - x| - 8\\ln|2x - 3| + C$"
    explanation: |
      Use the method of partial fraction decomposition on the rational expression:
      $$\dfrac{2x + 1}{(1 - x)(2x - 3)} = \dfrac{A}{1 - x} + \dfrac{B}{2x - 3}$$

      1. **Clear denominators and solve for coefficients**:
         $$2x + 1 = A(2x - 3) + B(1 - x)$$
         - Setting $x = 1$:
           $$2(1) + 1 = A(2(1) - 3) + B(0) \implies 3 = -A \implies A = -3$$
         - Setting $x = \dfrac{3}{2}$:
           $$2\left(\dfrac{3}{2}\right) + 1 = A(0) + B\left(1 - \dfrac{3}{2}\right) \implies 4 = -\dfrac{1}{2}B \implies B = -8$$

      2. **Rewrite and integrate term-by-term**:
         $$\displaystyle\int \left( \dfrac{-3}{1 - x} - \dfrac{8}{2x - 3} \right) dx$$
         - For the first term, let $u = 1 - x \implies du = -dx$:
           $$\displaystyle\int \dfrac{-3}{1 - x} \, dx = -3 \left(-\ln|1 - x|\right) = 3\ln|1 - x|$$
         - For the second term, let $v = 2x - 3 \implies dv = 2 \, dx \implies dx = \dfrac{1}{2} \, dv$:
           $$\displaystyle\int \dfrac{-8}{2x - 3} \, dx = -8 \left(\dfrac{1}{2}\ln|2x - 3|\right) = -4\ln|2x - 3|$$

      3. **Combine terms**:
         $$3\ln|1 - x| - 4\ln|2x - 3| + C$$

      **Distractor Rationale**:
      - **B is incorrect**: Forgets to divide by the coefficient $2$ when integrating $\frac{1}{2x - 3}$, keeping $-8\ln|2x - 3|$ instead of $-4\ln|2x - 3|$.
      - **C is incorrect**: Makes a sign error when integrating $\frac{-3}{1 - x}$, failing to account for $\frac{d}{dx}[1 - x] = -1$, yielding $-3\ln|1 - x|$.
      - **D is incorrect**: Combines both common errors: fails to apply the chain rule sign change on $1 - x$ and fails to divide by $2$ on $2x - 3$.
  
  - id: "ap-calc-bc-t1-s1a-q17"
    questionNumber: 17
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Contextual Applications of Differentiation"
    skill: "Solving Related Rates Problems"
    difficulty: "Medium"
    prompt: |
      A spherical soap bubble expands in such a way that its volume increases at a constant rate of $12\text{ cubic centimeters per second}$. At what rate, in centimeters per second, is the radius of the bubble increasing at the instant when the radius is $6\text{ centimeters}$? (The volume of a sphere of radius $r$ is $V = \dfrac{4}{3}\pi r^3$.)
    options:
      - id: "A"
        text: "$\\dfrac{1}{12\\pi}$"
      - id: "B"
        text: "$\\dfrac{1}{3\\pi}$"
      - id: "C"
        text: "$\\dfrac{1}{2\\pi}$"
      - id: "D"
        text: "$1{,}728\\pi$"
    explanation: |
      The volume of a sphere as a function of its radius is given by $V = \dfrac{4}{3}\pi r^3$.

      1. **Differentiate implicitly with respect to time $t$**:
         $$\dfrac{dV}{dt} = \dfrac{4}{3}\pi \cdot 3r^2 \dfrac{dr}{dt} = 4\pi r^2 \dfrac{dr}{dt}$$

      2. **Substitute the given values**:
         We are given that $\dfrac{dV}{dt} = 12\text{ cm}^3/\text{sec}$ and the instant occurs when $r = 6\text{ cm}$:
         $$12 = 4\pi (6)^2 \dfrac{dr}{dt}$$
         $$12 = 4\pi (36) \dfrac{dr}{dt}$$
         $$12 = 144\pi \dfrac{dr}{dt}$$

      3. **Solve for $\dfrac{dr}{dt}$**:
         $$\dfrac{dr}{dt} = \dfrac{12}{144\pi} = \dfrac{1}{12\pi}\text{ cm/sec}$$

      **Distractor Rationale**:
      - **B is incorrect**: Forgets the constant factor of $4$ when differentiating the volume formula, using $\frac{dV}{dt} = \pi r^2 \frac{dr}{dt}$, yielding $\frac{dr}{dt} = \frac{12}{36\pi} = \frac{1}{3\pi}$.
      - **C is incorrect**: Differentiates $r^3$ linearly without squaring $r$, using $4\pi r$ instead of $4\pi r^2$, yielding $\frac{12}{24\pi} = \frac{1}{2\pi}$.
      - **D is incorrect**: Multiplies the rate of volume change by the surface area instead of dividing: $12 \times 144\pi = 1{,}728\pi$.

  - id: "ap-calc-bc-t1-s1a-q18"
    questionNumber: 18
    questionType: "MC"
    layout: "single"
    correctAnswer: "D"
    domain: "Integration and Accumulation of Change"
    skill: "The Fundamental Theorem of Calculus and Accumulation Functions"
    difficulty: "Medium"
    prompt: |
      If $f(x) = \displaystyle\int_0^{x^3} \sin(t^2) \, dt$, then $f'(\sqrt{\pi}) =$
    options:
      - id: "A"
        text: "$3\\pi \\cos(\\pi^3)$"
      - id: "B"
        text: "$\\sin(\\pi^3)$"
      - id: "C"
        text: "$3\\pi \\sin\\pi$"
      - id: "D"
        text: "$3\\pi \\sin(\\pi^3)$"
    explanation: |
      Apply the Fundamental Theorem of Calculus Part 1 along with the chain rule:
      $$\dfrac{d}{dx} \left[ \displaystyle\int_a^{u(x)} g(t) \, dt \right] = g(u(x)) \cdot u'(x)$$

      1. **Differentiate $f(x)$ with respect to $x$**:
         Here, $g(t) = \sin(t^2)$ and $u(x) = x^3$, which gives $u'(x) = 3x^2$:
         $$f'(x) = \sin\left((x^3)^2\right) \cdot 3x^2 = 3x^2 \sin(x^6)$$

      2. **Evaluate at $x = \sqrt{\pi}$**:
         Substitute $x = \sqrt{\pi}$:
         $$x^2 = (\sqrt{\pi})^2 = \pi$$
         $$x^6 = (\sqrt{\pi})^6 = \pi^3$$
         $$f'(\sqrt{\pi}) = 3(\pi) \sin(\pi^3) = 3\pi \sin(\pi^3)$$

      **Distractor Rationale**:
      - **A is incorrect**: Unnecessarily differentiates the integrand $\sin$ into $\cos$, treating the operation as $\frac{d}{dx}[\sin(t^2)]$ rather than applying the Fundamental Theorem of Calculus.
      - **B is incorrect**: Omits the chain rule derivative of the upper limit $u'(x) = 3x^2$, resulting in $\sin((x^3)^2) = \sin(\pi^3)$.
      - **C is incorrect**: Substitutes $x$ directly for $t$ without compounding the exponents ($t^2$ with $t = x^3$), erroneously reducing the argument to $\sin\pi$.

  - id: "ap-calc-bc-t1-s1a-q19"
    questionNumber: 19
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Parametric, Polar, and Vector Functions"
    skill: "Calculating Derivatives of Polar Functions"
    difficulty: "Medium"
    prompt: |
      What is the slope of the line tangent to the polar curve $r = 3\theta^2$ when $\theta = \dfrac{\pi}{2}$ ?
    options:
      - id: "A"
        text: "$3\\pi$"
      - id: "B"
        text: "$-\\dfrac{\\pi}{4}$"
      - id: "C"
        text: "$-\\dfrac{4}{\\pi}$"
      - id: "D"
        text: "$\\dfrac{4}{\\pi}$"
    explanation: |
      The slope of the tangent line to a polar curve $r = f(\theta)$ is given by $\dfrac{dy}{dx} = \dfrac{dy/d\theta}{dx/d\theta}$, where $x = r\cos\theta$ and $y = r\sin\theta$:

      $$\dfrac{dy}{dx} = \dfrac{\dfrac{dr}{d\theta}\sin\theta + r\cos\theta}{\dfrac{dr}{d\theta}\cos\theta - r\sin\theta}$$

      1. **Find $r$ and $\dfrac{dr}{d\theta}$ at $\theta = \dfrac{\pi}{2}$**:
         $$r\left(\dfrac{\pi}{2}\right) = 3\left(\dfrac{\pi}{2}\right)^2 = \dfrac{3\pi^2}{4}$$
         $$\dfrac{dr}{d\theta} = 6\theta \implies \left.\dfrac{dr}{d\theta}\right|_{\theta=\pi/2} = 6\left(\dfrac{\pi}{2}\right) = 3\pi$$

      2. **Evaluate trigonometric values at $\theta = \dfrac{\pi}{2}$**:
         $$\sin\left(\dfrac{\pi}{2}\right) = 1 \quad \text{and} \quad \cos\left(\dfrac{\pi}{2}\right) = 0$$

      3. **Compute $\dfrac{dy}{d\theta}$ and $\dfrac{dx}{d\theta}$**:
         $$\left.\dfrac{dy}{d\theta}\right|_{\theta=\pi/2} = (3\pi)(1) + \left(\dfrac{3\pi^2}{4}\right)(0) = 3\pi$$
         $$\left.\dfrac{dx}{d\theta}\right|_{\theta=\pi/2} = (3\pi)(0) - \left(\dfrac{3\pi^2}{4}\right)(1) = -\dfrac{3\pi^2}{4}$$

      4. **Calculate the slope $\dfrac{dy}{dx}$**:
         $$\dfrac{dy}{dx} = \dfrac{3\pi}{-\dfrac{3\pi^2}{4}} = 3\pi \left(-\dfrac{4}{3\pi^2}\right) = -\dfrac{4}{\pi}$$

      **Distractor Rationale**:
      - **A is incorrect**: Corresponds to evaluating only $\frac{dr}{d\theta} = 3\pi$ or only the numerator $\frac{dy}{d\theta} = 3\pi$, forgetting to divide by $\frac{dx}{d\theta}$.
      - **B is incorrect**: Inverts the derivative quotient, calculating $\frac{dx}{dy} = \frac{-3\pi^2/4}{3\pi} = -\frac{\pi}{4}$.
      - **D is incorrect**: Makes a sign error in the product rule for $x = r\cos\theta$, using $+\sin\theta$ instead of $-\sin\theta$ for $\frac{d}{d\theta}[\cos\theta]$, resulting in a positive slope $\frac{4}{\pi}$.

  - id: "ap-calc-bc-t1-s1a-q20"
    questionNumber: 20
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Contextual and Analytical Applications of Differentiation"
    skill: "Applying the Mean Value Theorem"
    difficulty: "Easy"
    prompt: |
      Let $h$ be a twice-differentiable, increasing function of $x$. If $h(2) = 14$ and $h(8) = 50$, which of the following must be true on the interval $2 < x < 8$ ?
    options:
      - id: "A"
        text: "$h'(x) = 0$ for some $x$ in the interval."
      - id: "B"
        text: "$h'(x) = 6$ for some $x$ in the interval."
      - id: "C"
        text: "$h''(x) = 0$ for some $x$ in the interval."
      - id: "D"
        text: "$h''(x) \\ge 0$ for all $x$ in the interval."
    explanation: |
      Because $h$ is twice-differentiable on the entire interval, $h$ is continuous on the closed interval $[2, 8]$ and differentiable on the open interval $(2, 8)$.

      1. **Apply the Mean Value Theorem (MVT)**:
         The Mean Value Theorem states that there exists at least one number $c$ in the open interval $(2, 8)$ such that:
         $$h'(c) = \dfrac{h(8) - h(2)}{8 - 2}$$

      2. **Calculate the average rate of change**:
         $$h'(c) = \dfrac{50 - 14}{6} = \dfrac{36}{6} = 6$$
         Therefore, $h'(x) = 6$ for at least one value of $x$ in the interval $2 < x < 8$.

      **Distractor Rationale**:
      - **A is incorrect**: A derivative equal to zero is guaranteed by Rolle's Theorem only when $h(a) = h(b)$, which is not met here since $h$ is strictly increasing.
      - **C is incorrect**: A twice-differentiable function is not required to have an inflection point ($h''(x) = 0$); for instance, $h(x) = x^2 - 4x + 18$ satisfies all given conditions with $h''(x) = 2 \neq 0$ everywhere.
      - **D is incorrect**: The function could be strictly concave down, linear, or change concavity across $(2, 8)$; it is not required to be concave up ($h''(x) \ge 0$) on the interval.

  - id: "ap-calc-bc-t1-s1a-q21"
    questionNumber: 21
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Integration and Accumulation of Change"
    skill: "Integrating Using Long Division or Algebraic Manipulation"
    difficulty: "Medium"
    prompt: |
      $\displaystyle\int \dfrac{4x^2 + 6x - 11}{x + 3} \, dx =$
    options:
      - id: "A"
        text: "$2x^2 - 6x + 7\\ln|x + 3| + C$"
      - id: "B"
        text: "$2x^2 - 6x - \\dfrac{7}{(x + 3)^2} + C$"
      - id: "C"
        text: "$2x^2 + 6x - 7\\ln|x + 3| + C$"
      - id: "D"
        text: "$\\dfrac{\\dfrac{4}{3}x^3 + 3x^2 - 11x}{\\dfrac{1}{2}x^2 + 3x} + C$"
    explanation: |
      Because the degree of the numerator is greater than the degree of the denominator, first simplify the integrand using polynomial long division:

      1. **Divide $(4x^2 + 6x - 11)$ by $(x + 3)$**:
         $$\dfrac{4x^2 + 6x - 11}{x + 3} = 4x - 6 + \dfrac{7}{x + 3}$$
         - Multiplying the first quotient term: $4x(x + 3) = 4x^2 + 12x$
         - Subtracting: $(4x^2 + 6x - 11) - (4x^2 + 12x) = -6x - 11$
         - Multiplying the second quotient term: $-6(x + 3) = -6x - 18$
         - Subtracting: $(-6x - 11) - (-6x - 18) = 7$ (the remainder)

      2. **Integrate term-by-term**:
         $$\displaystyle\int \left(4x - 6 + \dfrac{7}{x + 3}\right) dx = 2x^2 - 6x + 7\ln|x + 3| + C$$

      **Distractor Rationale**:
      - **B is incorrect**: Differentiates the rational remainder term $\frac{7}{x+3}$ instead of integrating it, producing $-\frac{7}{(x+3)^2}$.
      - **C is incorrect**: Makes sign errors during the subtraction steps of polynomial long division.
      - **D is incorrect**: Integrates the numerator and denominator separately as independent polynomials.

  - id: "ap-calc-bc-t1-s1a-q22"
    questionNumber: 22
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Infinite Sequences and Series"
    skill: "Working with Comparison Tests for Convergence"
    difficulty: "Medium"
    prompt: |
      Which of the following statements about the convergence of the series $\displaystyle\sum_{n=1}^\infty \dfrac{1}{n^2 + \sqrt{n}}$ is true?
    options:
      - id: "A"
        text: "$\\displaystyle\\sum\\limits_{n=1}^\\infty \\dfrac{1}{n^2 + \\sqrt{n}}$ converges by comparison with $\\displaystyle\\sum_{n=1}^\\infty \\dfrac{1}{n}$."
      - id: "B"
        text: "$\\displaystyle\\sum_{n=1}^\\infty \\dfrac{1}{n^2 + \\sqrt{n}}$ converges by comparison with $\\displaystyle\\sum_{n=1}^\\infty \\dfrac{1}{n^2}$."
      - id: "C"
        text: "$\\displaystyle\\sum_{n=1}^\\infty \\dfrac{1}{n^2 + \\sqrt{n}}$ diverges by comparison with $\\displaystyle\\sum_{n=1}^\\infty \\dfrac{1}{n}$."
      - id: "D"
        text: "$\\displaystyle\\sum_{n=1}^\\infty \\dfrac{1}{n^2 + \\sqrt{n}}$ diverges by comparison with $\\displaystyle\\sum_{n=1}^\\infty \\dfrac{1}{n^2}$."
    explanation: |
      To determine the convergence of $\displaystyle\sum_{n=1}^\infty \dfrac{1}{n^2 + \sqrt{n}}$, apply the Direct Comparison Test:

      1. **Establish the term-by-term inequality**:
         For all integers $n \ge 1$:
         $$n^2 + \sqrt{n} > n^2 > 0$$
         Taking reciprocals reverses the inequality:
         $$0 < \dfrac{1}{n^2 + \sqrt{n}} < \dfrac{1}{n^2}$$

      2. **Identify the behavior of the comparison series**:
         The comparison series $\displaystyle\sum_{n=1}^\infty \dfrac{1}{n^2}$ is a $p$-series with $p = 2$. Since $p > 1$, this series converges.

      3. **Apply the Direct Comparison Test**:
         Because $0 < \dfrac{1}{n^2 + \sqrt{n}} < \dfrac{1}{n^2}$ for all $n \ge 1$ and the larger series $\displaystyle\sum_{n=1}^\infty \dfrac{1}{n^2}$ converges, the series $\displaystyle\sum_{n=1}^\infty \dfrac{1}{n^2 + \sqrt{n}}$ also converges by comparison with $\displaystyle\sum_{n=1}^\infty \dfrac{1}{n^2}$.

      **Distractor Rationale**:
      - **A is incorrect**: While $\frac{1}{n^2+\sqrt{n}} < \frac{1}{n}$ is true, the series $\sum \frac{1}{n}$ diverges ($p = 1$). Having terms smaller than a divergent series provides no information about convergence.
      - **C is incorrect**: The series converges, and comparison with the divergent harmonic series $\sum \frac{1}{n}$ cannot establish divergence since the terms are smaller than $\frac{1}{n}$.
      - **D is incorrect**: $\sum \frac{1}{n^2}$ is a convergent series, so it cannot be used to prove that another series diverges.

  - id: "ap-calc-bc-t1-s1a-q23"
    questionNumber: 23
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Applications of Integration"
    skill: "Calculating Arc Length of a Curve"
    difficulty: "Medium"
    prompt: |
      The length of the curve $y = \cos(2x)$ from $x = 0$ to $x = \dfrac{\pi}{3}$ is given by
    options:
      - id: "A"
        text: "$\\displaystyle\\int_0^{\\pi/3} \\sqrt{1 + \\sin^2(2x)} \\, dx$"
      - id: "B"
        text: "$\\displaystyle\\int_0^{\\pi/3} \\sqrt{1 - 4\\sin^2(2x)} \\, dx$"
      - id: "C"
        text: "$\\displaystyle\\int_0^{\\pi/3} \\sqrt{1 + 4\\sin^2(2x)} \\, dx$"
      - id: "D"
        text: "$\\displaystyle\\int_0^{\\pi/3} \\sqrt{1 + 4\\cos^2(2x)} \\, dx$"
    explanation: |
      The arc length $L$ of a smooth curve $y = f(x)$ on the interval $[a, b]$ is given by:
      $$L = \int_a^b \sqrt{1 + \left(f'(x)\right)^2} \, dx$$

      1. **Find the first derivative $f'(x)$ using the chain rule**:
         $$f(x) = \cos(2x) \implies f'(x) = -2\sin(2x)$$

      2. **Square the derivative**:
         $$\left(f'(x)\right)^2 = \left(-2\sin(2x)\right)^2 = 4\sin^2(2x)$$

      3. **Substitute into the arc length formula**:
         With limits of integration from $a = 0$ to $b = \dfrac{\pi}{3}$:
         $$L = \int_0^{\pi/3} \sqrt{1 + 4\sin^2(2x)} \, dx$$

      **Distractor Rationale**:
      - **A is incorrect**: Omits the chain rule coefficient $2$ when differentiating $\cos(2x)$, resulting in an unscaled $\sin^2(2x)$ term under the radical.
      - **B is incorrect**: Neglects to square the negative sign on $-2\sin(2x)$, incorrectly yielding a minus sign under the square root: $1 - 4\sin^2(2x)$.
      - **D is incorrect**: Confuses the original function with its derivative, placing $[f(x)]^2 = \cos^2(2x)$ under the radical rather than $[f'(x)]^2$.

  - id: "ap-calc-bc-t1-s1a-q24"
    questionNumber: 24
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Infinite Sequences and Series"
    skill: "Representing Functions as Power Series"
    difficulty: "Medium"
    prompt: |
      Let $g$ be a function such that $g'(x) = \cos(x^2)$ and $g(0) = 0$. What are the first three nonzero terms of the Maclaurin series for $g$ ?
    options:
      - id: "A"
        text: "$x - \\dfrac{x^5}{10} + \\dfrac{x^9}{216}$"
      - id: "B"
        text: "$x - \\dfrac{x^5}{2} + \\dfrac{x^9}{24}$"
      - id: "C"
        text: "$x - \\dfrac{x^5}{10} + \\dfrac{x^9}{72}$"
      - id: "D"
        text: "$-2x^3 + \\dfrac{x^7}{3} - \\dfrac{x^{11}}{60}$"
    explanation: |
      Recall the standard Maclaurin series expansion for $\cos(u)$:
      $$\cos(u) = 1 - \dfrac{u^2}{2!} + \dfrac{u^4}{4!} - \cdots = 1 - \dfrac{u^2}{2} + \dfrac{u^4}{24} - \cdots$$

      1. **Substitute $u = x^2$ to find the series for $g'(x)$**:
         $$g'(x) = 1 - \dfrac{(x^2)^2}{2} + \dfrac{(x^2)^4}{24} - \cdots = 1 - \dfrac{x^4}{2} + \dfrac{x^8}{24} - \cdots$$

      2. **Integrate term-by-term to find $g(x)$**:
         $$g(x) = \int \left( 1 - \dfrac{x^4}{2} + \dfrac{x^8}{24} - \cdots \right) dx$$
         $$g(x) = C + x - \dfrac{x^5}{2 \cdot 5} + \dfrac{x^9}{24 \cdot 9} - \cdots = C + x - \dfrac{x^5}{10} + \dfrac{x^9}{216} - \cdots$$

      3. **Apply the initial condition $g(0) = 0$**:
         $$g(0) = C = 0$$
         Therefore, the first three nonzero terms of the Maclaurin series for $g$ are:
         $$x - \dfrac{x^5}{10} + \dfrac{x^9}{216}$$

      **Distractor Rationale**:
      - **B is incorrect**: Integrates the powers of $x$ without dividing by the new exponent ($5$ and $9$), retaining the original denominators $2$ and $24$.
      - **C is incorrect**: Uses an incorrect factorial evaluation in the expansion of cosine, confusing $4! = 24$ with another factor such as $8$ or $12$, resulting in an incorrect third denominator ($8 \times 9 = 72$).
      - **D is incorrect**: Differentiates $g'(x)$ rather than integrating it to find $g(x)$.

  - id: "ap-calc-bc-t1-s1a-q25"
    questionNumber: 25
    questionType: "MC"
    layout: "split"
    correctAnswer: "C"
    domain: "Applications of Integration"
    skill: "Calculating Area in Polar Coordinates"
    difficulty: "Hard"
    stimulus: |
      ![](./assets/APCalcBC-T1-S1A-Q25.svg)

      The polar curves $r = 2 - 2\sin\theta$ and $r = 2 + 2\sin\theta$ are shown in the figure above.
    prompt: |
      Which of the following expressions gives the total area of the shaded regions enclosed by both curves?
    options:
      - id: "A"
        text: "$\\displaystyle\\int_0^\\pi (2 - 2\\sin\\theta)^2 \\, d\\theta$"
      - id: "B"
        text: "$\\displaystyle\\int_0^{\\pi/2} (2 - 2\\sin\\theta)^2 \\, d\\theta$"
      - id: "C"
        text: "$2\\displaystyle\\int_0^{\\pi/2} (2 - 2\\sin\\theta)^2 \\, d\\theta$"
      - id: "D"
        text: "$\\displaystyle\\int_0^{\\pi/2} \\left( (2 + 2\\sin\\theta)^2 - (2 - 2\\sin\\theta)^2 \\right) d\\theta$"
    explanation: |
      The total area enclosed by both polar curves consists of four symmetric sub-regions, one in each quadrant.

      1. **Determine the inner bounding curve in the first quadrant ($0 \\le \\theta \\le \\dfrac{\\pi}{2}$)**:
         For $\\theta \\in \\left[0, \\dfrac{\\pi}{2}\\right]$, $\\sin\\theta \\ge 0$, which implies:
         $$2 - 2\\sin\\theta \\le 2 + 2\\sin\\theta$$
         The boundary of the shaded region in the first quadrant is therefore formed by the curve closer to the origin, $r = 2 - 2\\sin\\theta$, as $\\theta$ sweeps from $0$ to $\\dfrac{\\pi}{2}$.

      2. **Calculate the area of one quadrant**:
         Using the polar area formula $\\text{Area} = \\dfrac{1}{2}\\displaystyle\\int_\\alpha^\\beta r^2 \\, d\\theta$:
         $$\\text{Area}_{\\text{QI}} = \\dfrac{1}{2}\\displaystyle\\int_0^{\\pi/2} (2 - 2\\sin\\theta)^2 \\, d\\theta$$

      3. **Use symmetry for all four quadrants**:
         By symmetry across both coordinate axes, the total area of the shaded regions is four times the area in the first quadrant:
         $$\\text{Total Area} = 4 \\times \\left(\\dfrac{1}{2}\\displaystyle\\int_0^{\\pi/2} (2 - 2\\sin\\theta)^2 \\, d\\theta\\right) = 2\\displaystyle\\int_0^{\\pi/2} (2 - 2\\sin\\theta)^2 \\, d\\theta$$

      **Distractor Rationale**:
      - **A is incorrect**: Integrates over $[0, \\pi]$ with a coefficient of $1$, which fails to properly account for the change in the closer bounding curve across quadrants.
      - **B is incorrect**: Forgets to multiply by $4$ to account for all four symmetric quadrants, evaluating $2 \\times \\frac{1}{2}\\int$ rather than $4 \\times \\frac{1}{2}\\int$.
      - **D is incorrect**: Erroneously applies the Cartesian "outer minus inner" washer method formula $\\int (R^2 - r^2)\\,d\\theta$, which calculates the area between two curves rather than the area common to the interior of both curves.

  - id: "ap-calc-bc-t1-s1a-q26"
    questionNumber: 26
    questionType: "MC"
    layout: "split"
    correctAnswer: "D"
    domain: "Contextual and Analytical Applications of Differentiation"
    skill: "Using the Extreme Value Theorem and Locating Critical Points"
    difficulty: "Hard"
    stimulus: |
      | $x$ | $3$ | $4$ | $5$ | $6$ | $7$ |
      | :---: | :---: | :---: | :---: | :---: | :---: |
      | $g(x)$ | $7$ | $1$ | $4$ | $8$ | $6$ |

      The table above gives values of the continuous function $g$ at selected values of $x$. It is given that $g$ has exactly two critical points on the open interval $(3, 7)$.
    prompt: |
      Which of the following must be true?
    options:
      - id: "A"
        text: "$g(x) > 0$ for all $x$ in the open interval $(3, 7)$."
      - id: "B"
        text: "$g'(x)$ exists for all $x$ in the open interval $(3, 7)$."
      - id: "C"
        text: "$g'(x) < 0$ for all $x$ in the open interval $(3, 4)$."
      - id: "D"
        text: "$g'(5) \\neq 0$"
    explanation: |
      Analyze the extrema of the continuous function $g$ across the subintervals using the Extreme Value Theorem:

      1. **Examine the interval $[3, 5]$**:
         The values are $g(3) = 7$, $g(4) = 1$, and $g(5) = 4$. Because $g(4) = 1$ is strictly less than both endpoints $g(3)$ and $g(5)$, the absolute minimum of $g$ on $[3, 5]$ must occur at an interior point $c_1 \in (3, 5)$. An interior extremum of a continuous function must occur at a critical point, guaranteeing at least one critical point in $(3, 5)$.

      2. **Examine the interval $[5, 7]$**:
         The values are $g(5) = 4$, $g(6) = 8$, and $g(7) = 6$. Because $g(6) = 8$ is strictly greater than both endpoints $g(5)$ and $g(7)$, the absolute maximum of $g$ on $[5, 7]$ must occur at an interior point $c_2 \in (5, 7)$. This guarantees at least one critical point in $(5, 7)$.

      3. **Count the critical points**:
         Because $g$ has **exactly two** critical points on $(3, 7)$, one must lie strictly inside $(3, 5)$ and the other strictly inside $(5, 7)$. If $g'(5) = 0$, then $x = 5$ would be a third distinct critical point in $(3, 7)$, which contradicts the given condition. Therefore, $g'(5) \neq 0$.

      **Distractor Rationale**:
      - **A is incorrect**: Although all tabulated values are positive, $g(x)$ could decrease below zero (e.g., between $x = 3$ and $x = 4$) before reaching its minimum.
      - **B is incorrect**: The function is given as continuous, not differentiable; critical points can occur where $g'(x)$ fails to exist (e.g., at a sharp corner or cusp).
      - **C is incorrect**: Although the average rate of change on $[3, 4]$ is negative, $g'(x)$ does not need to be negative at every point in $(3, 4)$.

  - id: "ap-calc-bc-t1-s1a-q27"
    questionNumber: 27
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Differential Equations"
    skill: "Sketching and Identifying Slope Fields"
    difficulty: "Medium"
    prompt: |
      Let $h$ be a function such that $h(y) > 0$ for all $y$. Which of the following could be a slope field for the differential equation $\dfrac{dy}{dx} = (4 - x^2)h(y)$ ?
    options:
      - id: "A"
        text: "![](./assets/APCalcBC-T1-S1A-Q27-A.svg)"
      - id: "B"
        text: "![](./assets/APCalcBC-T1-S1A-Q27-B.svg)"
      - id: "C"
        text: "![](./assets/APCalcBC-T1-S1A-Q27-C.svg)"
      - id: "D"
        text: "![](./assets/APCalcBC-T1-S1A-Q27-D.svg)"
    explanation: |
      Because $h(y) > 0$ for all real numbers $y$, the sign of the derivative $\dfrac{dy}{dx}$ depends entirely on the sign of the factor $(4 - x^2)$:

      1. **Locate where the slopes are zero ($\dfrac{dy}{dx} = 0$)**:
         $$\dfrac{dy}{dx} = 0 \iff 4 - x^2 = 0 \implies x = -2 \quad \text{and} \quad x = 2$$
         Thus, the slope field must display horizontal line segments everywhere along the vertical lines $x = -2$ and $x = 2$.

      2. **Determine the sign of the slopes between $x = -2$ and $x = 2$**:
         For $-2 < x < 2$, we have $4 - x^2 > 0$. Since $h(y) > 0$, it follows that:
         $$\dfrac{dy}{dx} > 0$$
         All segments between $x = -2$ and $x = 2$ (including along the $y$-axis where $x = 0$) must tilt upward from left to right (positive slopes).

      3. **Determine the sign of the slopes for $|x| > 2$**:
         For $x < -2$ or $x > 2$, we have $4 - x^2 < 0$, which implies:
         $$\dfrac{dy}{dx} < 0$$
         All segments to the left of $x = -2$ and to the right of $x = 2$ must tilt downward from left to right (negative slopes).

      The slope field in **A** correctly matches this sign behavior: negative slopes for $|x| > 2$, zero slopes along $x = \pm 2$, and positive slopes for $|x| < 2$.

      **Distractor Rationale**:
      - **B is incorrect**: Displays the opposite signs—negative slopes on $(-2, 2)$ and positive slopes on $(-\infty, -2) \cup (2, \infty)$—which corresponds to $\frac{dy}{dx} = (x^2 - 4)h(y)$.
      - **C is incorrect**: Displays horizontal segments along the horizontal lines $y = \pm 2$, confusing dependence on $x$ with dependence on $y$.
      - **D is incorrect**: Displays an asymmetric pattern across the $y$-axis, failing to account for the even symmetry $(4 - (-x)^2 = 4 - x^2)$.

  - id: "ap-calc-bc-t1-s1a-q28"
    questionNumber: 28
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Integration and Accumulation of Change"
    skill: "Evaluating Improper Integrals"
    difficulty: "Medium"
    prompt: |
      What are all values of $p$ for which $\displaystyle\int_1^\infty \dfrac{1}{x^{5p - 2}} \, dx$ converges?
    options:
      - id: "A"
        text: "$p > \\dfrac{2}{5}$"
      - id: "B"
        text: "$p < \\dfrac{3}{5}$"
      - id: "C"
        text: "$p > \\dfrac{3}{5}$"
      - id: "D"
        text: "$p > 1$"
    explanation: |
      Recall that the improper $p$-integral $\displaystyle\int_1^\infty \dfrac{1}{x^n} \, dx$ converges if and only if the exponent satisfies $n > 1$:

      1. **Evaluate using the limit definition**:
         For $n \neq 1$:
         $$\displaystyle\int_1^\infty x^{-n} \, dx = \lim_{b \to \infty} \left[ \dfrac{x^{1 - n}}{1 - n} \right]_1^b = \lim_{b \to \infty} \left( \dfrac{b^{1 - n}}{1 - n} - \dfrac{1}{1 - n} \right)$$
         This limit is finite if and only if $1 - n < 0$, which yields $n > 1$.

      2. **Apply the condition to the given exponent**:
         Here, the exponent is $n = 5p - 2$. Setting $n > 1$:
         $$5p - 2 > 1$$
         $$5p > 3$$
         $$p > \dfrac{3}{5}$$

      **Distractor Rationale**:
      - **A is incorrect**: Solves the condition for the denominator to grow ($n > 0$), setting $5p - 2 > 0 \implies p > \frac{2}{5}$. However, when $0 < n \le 1$, the integral diverges.
      - **B is incorrect**: Reverses the inequality sign, yielding $p < \frac{3}{5}$.
      - **D is incorrect**: Assumes that the parameter $p$ must independently satisfy $p > 1$, ignoring the linear expression in the exponent.

  - id: "ap-calc-bc-t1-s1a-q29"
    questionNumber: 29
    questionType: "MC"
    layout: "single"
    correctAnswer: "D"
    domain: "Differential Equations"
    skill: "Finding General Solutions Using Separation of Variables"
    difficulty: "Medium"
    prompt: |
      The concentration of a chemical in a solution at time $t \ge 0$ is modeled by the nonconstant, differentiable function $C$ and satisfies the differential equation $\dfrac{dC}{dt} = 3C + 2$, where $C(t)$ is measured in milligrams per liter and $t$ is measured in minutes. Which of the following must be true, where $K$ represents an arbitrary constant?
    options:
      - id: "A"
        text: "$C = \\dfrac{3}{2}C^2 + 2t + K$"
      - id: "B"
        text: "$\\ln|3C + 2| = \\dfrac{t}{3} + K$"
      - id: "C"
        text: "$\\ln|3C + 2| = t + K$"
      - id: "D"
        text: "$\\ln|3C + 2| = 3t + K$"
    explanation: |
      Solve the differential equation by separation of variables:
      $$\dfrac{dC}{dt} = 3C + 2$$

      1. **Separate variables**:
         Divide both sides by $(3C + 2)$ and multiply by $dt$:
         $$\dfrac{1}{3C + 2} \, dC = dt$$

      2. **Integrate both sides**:
         $$\displaystyle\int \dfrac{1}{3C + 2} \, dC = \displaystyle\int 1 \, dt$$
         Using substitution on the left side with $u = 3C + 2$ and $du = 3 \, dC$:
         $$\dfrac{1}{3} \ln|3C + 2| = t + C_1$$

      3. **Isolate the logarithmic expression**:
         Multiply both sides of the equation by $3$:
         $$\ln|3C + 2| = 3t + 3C_1$$
         Renaming the arbitrary constant $3C_1$ as $K$:
         $$\ln|3C + 2| = 3t + K$$

      **Distractor Rationale**:
      - **A is incorrect**: Integrates the right side directly with respect to $t$ without separating variables, treating $C$ as an independent variable rather than a function of $t$.
      - **B is incorrect**: Inverts the algebraic step when clearing the coefficient $\frac{1}{3}$, dividing $t$ by $3$ instead of multiplying by $3$.
      - **C is incorrect**: Neglects the inner derivative factor of $\frac{1}{3}$ when integrating $\frac{1}{3C+2}$, erroneously treating the antiderivative as simply $\ln|3C + 2| = t + K$.

  - id: "ap-calc-bc-t1-s1a-q30"
    questionNumber: 30
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Infinite Sequences and Series"
    skill: "Working with Radius and Interval of Convergence"
    difficulty: "Medium"
    prompt: |
      If the power series $\displaystyle\sum_{n=0}^\infty c_n(x - 3)^n$ converges at $x = 8$ and diverges at $x = -4$, which of the following must be true?

      - I. The series converges at $x = -2$.
      - II. The series converges at $x = 0$.
      - III. The series diverges at $x = 10$.
    options:
      - id: "A"
        text: "I only"
      - id: "B"
        text: "II only"
      - id: "C"
        text: "I and II only"
      - id: "D"
        text: "II and III only"
    explanation: |
      The power series is centered at $c = 3$. The distance from any value $x$ to the center is given by $|x - 3|$.

      1. **Analyze convergence at $x = 8$**:
         The distance from $x = 8$ to the center is $|8 - 3| = 5$. Because the series converges at $x = 8$, the radius of convergence $R$ must satisfy:
         $$R \ge 5$$
         By the properties of power series, the series is guaranteed to converge absolutely for all $x$ in the open interval $|x - 3| < 5$, which corresponds to:
         $$-2 < x < 8$$

      2. **Analyze divergence at $x = -4$**:
         The distance from $x = -4$ to the center is $|-4 - 3| = 7$. Because the series diverges at $x = -4$, the radius of convergence must satisfy:
         $$R \le 7$$
         Therefore, the series is guaranteed to diverge for all $x$ strictly farther than distance $7$ from the center ($|x - 3| > 7$):
         $$x < -4 \quad \text{or} \quad x > 10$$

      3. **Evaluate each statement**:
         - **Statement I ($x = -2$)**: The distance is $|-2 - 3| = 5$. Since $R$ could be exactly $5$, $x = -2$ could be an endpoint of the interval of convergence. Convergence at an endpoint depends on the specific coefficients $c_n$, so convergence is not guaranteed. Statement I is **not necessarily true**.
         - **Statement II ($x = 0$)**: The distance is $|0 - 3| = 3$. Because $3 < 5 \le R$, $x = 0$ lies strictly in the interior of the interval of convergence $(-2, 8)$. Therefore, the series must converge at $x = 0$. **Statement II is true**.
         - **Statement III ($x = 10$)**: The distance is $|10 - 3| = 7$. If $R = 7$, $x = 10$ is an endpoint of the interval of convergence and could converge or diverge. Therefore, divergence at $x = 10$ is not guaranteed. Statement III is **not necessarily true**.

      Thus, only Statement II must be true.

      **Distractor Rationale**:
      - **A and C are incorrect**: Include Statement I, erroneously assuming that if a power series converges at an endpoint $x = 8$, it must also converge at the opposite symmetric endpoint $x = -2$.
      - **D is incorrect**: Includes Statement III, failing to recognize that $x = 10$ lies on the potential boundary ($|x - 3| = 7$) where convergence or divergence is inconclusive without the explicit sequence $c_n$.