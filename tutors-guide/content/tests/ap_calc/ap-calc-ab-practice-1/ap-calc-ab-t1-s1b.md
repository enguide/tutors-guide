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
      A continuous function $g$ is decreasing on any interval where its derivative satisfies $g'(x) \\le 0$, provided $g'(x) = 0$ occurs only at isolated points.

      1. **Analyze the sign of $g'(x)$ from the graph**:
         - For $x \\in [-3, -2)$, the graph of $g'$ lies strictly above the $x$-axis, so $g'(x) > 0$.
         - At $x = -2$, $g'(-2) = 0$.
         - For $x \\in (-2, 1)$, $g'(x) < 0$.
         - At $x = 1$, the graph touches the $x$-axis with a local maximum, meaning $g'(1) = 0$.
         - For $x \\in (1, 4)$, $g'(x) < 0$.
         - At $x = 4$, $g'(4) = 0$.

      2. **Evaluate the combined interval**:
         Because $g'(x) \\le 0$ on the entire interval $[-2, 4]$ and is zero only at isolated points ($x = 1$, $x = -2$, and $x = 4$), the function $g$ is strictly decreasing on the entire closed interval $[-2, 4]$.

      **Distractor Rationale**:
      - **A is incorrect**: This is the interval where $g'(x) \\ge 0$, representing where $g$ is *increasing*, not decreasing.
      - **B is incorrect**: This choice assumes that reaching a horizontal tangent where $g'(1) = 0$ terminates the decreasing interval. Because $g'(x)$ remains negative immediately after $x = 1$, $g$ continues to decrease across $x = 1$.
      - **C is incorrect**: This reflects the intervals where the derivative graph itself is decreasing ($g''(x) < 0$), which represents intervals where $g$ is *concave down*, not where $g$ is decreasing.

  - id: "ap-calc-1b-q31"
    questionNumber: 31
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
      The function $C(t)$ models the rate of fuel consumption with units of $\\text{liters per minute}$, and $t$ is measured in $\\text{minutes}$.

      1. **Determine the derivative's physical meaning and units**:
         The derivative $C'(t) = \\frac{dC}{dt}$ represents the instantaneous rate of change of $C(t)$ with respect to time $t$.
         $$\\text{Units of } C'(t) = \\frac{\\text{units of } C}{\\text{units of } t} = \\frac{\\text{liters/min}}{\\text{min}} = \\text{liters per minute per minute}$$

      2. **Interpret at the specific value $t = 5$**:
         Evaluating at $t = 5$ yields the instantaneous rate of change of the consumption rate specifically at the moment $5$ minutes after the test begins.

      **Distractor Rationale**:
      - **A is incorrect**: The total volume of fuel consumed is represented by the definite integral $\\int_0^5 C(t)\\,dt$, measured in liters.
      - **B is incorrect**: This is the value of the function itself, $C(5)$, which has units of liters per minute.
      - **D is incorrect**: The net change in the consumption rate over the time interval $[0, 5]$ is given by $C(5) - C(0) = \\int_0^5 C'(t)\\,dt$, measured in liters per minute.

  - id: "ap-calc-1b-q32"
    questionNumber: 32
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
      By the Fundamental Theorem of Calculus, the position of the particle at $t = 3$ is equal to its initial position at $t = 1$ plus the net displacement over the time interval $[1, 3]$:
      $$x(3) = x(1) + \int_1^3 v(t)\,dt$$

      1. **Substitute known values**:
         $$x(3) = 2 + \int_1^3 \frac{6}{t^2 + 1}\,dt$$

      2. **Evaluate the definite integral**:
         Using numerical integration on a graphing calculator:
         $$\int_1^3 \frac{6}{t^2 + 1}\,dt \approx 2.7819$$

      3. **Compute the final position**:
         $$x(3) \approx 2 + 2.7819 = 4.7819 \approx 4.782$$

      **Distractor Rationale**:
      - **A is incorrect**: Corresponds to subtracting the net displacement from the initial position ($2 - 2.782 = -0.782$).
      - **B is incorrect**: This is only the net displacement $\int_1^3 v(t)\,dt \approx 2.782$, forgetting to add the initial position $x(1) = 2$.
      - **C is incorrect**: Corresponds to evaluating the velocity change or using an incorrect trapezoidal sum with $n = 1$ subinterval: $2 + \frac{3 - 1}{2}\bigl(v(1) + v(3)\bigr) = 2 + 1(3 + 0.6) = 5.6$ or an erroneous calculator integrand entry.

  - id: "ap-calc-1b-q33"
    questionNumber: 33
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
      A function $h$ is continuous on an open interval $(a, b)$ if there are no breaks, jumps, or holes at any point in the interval. It is not differentiable on $(a, b)$ if there is at least one point in the interval where the derivative does not exist (such as a corner, cusp, or vertical tangent).

      1. **Analyze each interval**:
         - On $(0, 1)$: The graph is smooth and unbroken. The function is both continuous and differentiable on $(0, 1)$.
         - On $(1, 2)$: The graph has a removable discontinuity (a hole at $x = 1.5$ with an isolated point at $(1.5, 3)$). Since $\\lim_{x \\to 1.5} h(x) \\neq h(1.5)$, $h$ is not continuous on $(1, 2)$.
         - On $(2, 3)$: The graph has a jump discontinuity at $x = 2.5$ because $\\lim_{x \\to 2.5^-} h(x) \\neq \\lim_{x \\to 2.5^+} h(x)$. Therefore, $h$ is not continuous on $(2, 3)$.
         - On $(3, 4)$: The curve has no breaks, jumps, or holes, so $h$ is continuous on $(3, 4)$. However, at $x = 3.5$, the graph forms a sharp corner where the left-hand and right-hand slopes are unequal:
           $$\\lim_{x \\to 3.5^-} h'(x) > 0 \\quad \\text{and} \\quad \\lim_{x \\to 3.5^+} h'(x) < 0$$
           Therefore, $h'(3.5)$ does not exist, making $h$ continuous but not differentiable on $(3, 4)$.

      **Distractor Rationale**:
      - **A is incorrect**: The function is both continuous and differentiable on this interval.
      - **B is incorrect**: The function fails the condition of being continuous due to the removable discontinuity at $x = 1.5$.
      - **C is incorrect**: The function fails the condition of being continuous due to the jump discontinuity at $x = 2.5$.

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
      The graph of a twice-differentiable function $g$ is concave up on intervals where its second derivative satisfies $g''(x) > 0$ (or equivalently, where its first derivative $g'(x)$ is strictly increasing).

      1. **Graph or differentiate using technology**:
         Using a graphing calculator, either graph $y_1 = g'(x) = (x^2 + 2)\cos(2x + 1)$ and observe where the graph has a positive slope (is increasing), or calculate its derivative $y_2 = \frac{d}{dx}[g'(x)]$:
         $$g''(x) = 2x\cos(2x + 1) - 2(x^2 + 2)\sin(2x + 1)$$

      2. **Find the zeros of $g''(x)$ on the interval $(-2, 2)$**:
         Solving $g''(x) = 0$ yields two roots:
         $$x \approx -0.628 \quad \text{and} \quad x \approx 1.238$$

      3. **Determine the sign of $g''(x)$**:
         - For $x \in (-2, -0.628)$: $g''(x) > 0 \implies g$ is concave up.
         - For $x \in (-0.628, 1.238)$: $g''(x) < 0 \implies g$ is concave down.
         - For $x \in (1.238, 2)$: $g''(x) > 0 \implies g$ is concave up.

      Therefore, the graph of $g$ is concave up on $(-2, -0.628)$ and $(1.238, 2)$.

      **Distractor Rationale**:
      - **B is incorrect**: This is the interval where $g''(x) < 0$, which corresponds to where the graph of $g$ is concave *down*.
      - **C is incorrect**: This corresponds to the interval where $g'(x) > 0$, representing where $g$ is *increasing*, not concave up.
      - **D is incorrect**: This corresponds to the intervals where $g'(x) < 0$, representing where $g$ is *decreasing*.

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
      The total increase in the depth of snow from $t = 0$ to $t = 4$ hours is given by the definite integral of the rate function $S(t)$ over the interval $[0, 4]$:
      $$\Delta D = \int_0^4 S(t)\,dt = \int_0^4 \left(0.8 + t\sin\left(\frac{\pi t^2}{30}\right)\right) dt$$

      1. **Evaluate using a graphing calculator**:
         Using numerical integration ($\text{fnInt}$):
         $$\int_0^4 \left(0.8 + t\sin\left(\frac{\pi t^2}{30}\right)\right) dt \approx 8.4737 \approx 8.474\text{ cm}$$

      2. **Analytical verification**:
         - $\int_0^4 0.8\,dt = 0.8(4) = 3.2$
         - Using substitution with $u = \frac{\pi t^2}{30}$ and $du = \frac{\pi t}{15}\,dt$:
           $$\int_0^4 t\sin\left(\frac{\pi t^2}{30}\right) dt = \frac{15}{\pi} \left[-\cos\left(\frac{\pi t^2}{30}\right)\right]_0^4 = \frac{15}{\pi}\left(1 - \cos\left(\frac{8\pi}{15}\right)\right) \approx 5.2737$$
         - Total depth increase $= 3.2 + 5.2737 = 8.4737 \approx 8.474\text{ cm}$.

      **Distractor Rationale**:
      - **A is incorrect**: This is the *average rate* of increase over the 4-hour period, $\frac{1}{4}\int_0^4 S(t)\,dt \approx 2.118\text{ cm/hr}$, rather than the total accumulated depth.
      - **B is incorrect**: This is the instantaneous rate of snowfall at time $t = 4$, $S(4) = 0.8 + 4\sin\left(\frac{8\pi}{15}\right) \approx 4.778\text{ cm/hr}$.
      - **C is incorrect**: This represents only the integral of the second term, $\int_0^4 t\sin\left(\frac{\pi t^2}{30}\right) dt \approx 5.274\text{ cm}$, omitting the initial constant accumulation term of $0.8\text{ cm/hr}$ over the $4$ hours ($3.2\text{ cm}$).

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
      The Intermediate Value Theorem (IVT) states that if a function $g$ is continuous on the closed interval $[a, b]$, then for any value $d$ strictly between $g(a)$ and $g(b)$, there exists at least one value $c \\in (a, b)$ such that $g(c) = d$.

      1. **Check the values**:
         Here, $a = -2$, $b = 3$, $g(-2) = 9$, and $g(3) = 1$.
         The target value is $d = 4$, which satisfies $1 < 4 < 9$.

      2. **Identify the required hypothesis**:
         To guarantee that $g$ takes on the intermediate value $4$ without skipping it via a break or jump, the sufficient and required condition provided is that $g$ is continuous on the closed interval $[-2, 3]$.

      **Distractor Rationale**:
      - **B is incorrect**: A function can be decreasing while having jump discontinuities (for example, a step function that drops from $9$ directly to $2$), thereby completely bypassing the output value $4$.
      - **C is incorrect**: The existence of a two-sided limit at a single point ($x = 0$) provides no information about the continuity or behavior of $g$ across the rest of the interval $[-2, 3]$.
      - **D is incorrect**: This statement relates to the conclusion of the Mean Value Theorem for rates of change ($g'(c) = -1.6$), which does not guarantee that the function attains a specific intermediate output value $g(c) = 4$.

  - id: "ap-calc-1b-q37"
    questionNumber: 37
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
      The rate of change of the particle's velocity is given by its acceleration $a(t) = v'(t)$. 
      The velocity is decreasing when $v'(t) = a(t) < 0$. It is **decreasing most rapidly** where its rate of change $a(t)$ attains its absolute minimum on the closed interval $[0, 7]$.

      1. **Find critical points of $a(t)$**:
         $$a'(t) = \frac{d}{dt}\bigl[(t - 7)\sin t\bigr] = \sin t + (t - 7)\cos t$$
         Using a graphing calculator to solve $a'(t) = 0$ on the interval $[0, 7]$ gives:
         $$t \approx 1.391 \quad \text{and} \quad t \approx 4.385$$

      2. **Evaluate $a(t)$ at the critical points and endpoints (Candidates Test)**:
         - Endpoint $t = 0$: $a(0) = (0 - 7)\sin(0) = 0$
         - Critical point $t \approx 1.391$: $a(1.391) \approx (1.391 - 7)\sin(1.391) \approx -5.519$
         - Critical point $t \approx 4.385$: $a(4.385) \approx (4.385 - 7)\sin(4.385) \approx 2.482$
         - Endpoint $t = 7$: $a(7) = (7 - 7)\sin(7) = 0$

      3. **Conclusion**:
         The absolute minimum of $a(t)$ is approximately $-5.519$, occurring at $t \approx 1.391$. Thus, the particle's velocity is decreasing most rapidly at $t = 1.391$.

      **Distractor Rationale**:
      - **A is incorrect**: $t = 0$ is an endpoint where $a(0) = 0$, meaning the velocity is momentarily stationary, not decreasing.
      - **C is incorrect**: $t = \pi \approx 3.142$ is a zero of the acceleration function where $a(\pi) = 0$; this represents an inflection point of velocity, not where velocity is changing most rapidly.
      - **D is incorrect**: $t \approx 4.385$ is the absolute maximum of acceleration ($a(4.385) \approx 2.482$), which represents the point where the velocity is *increasing* most rapidly.

  - id: "ap-calc-1b-q38"
    questionNumber: 38
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
      By definition, the average value of a continuous function $g$ over an interval $[a, b]$ is given by:
      $$g_{\text{avg}} = \frac{1}{b - a}\int_a^b g(x)\,dx$$

      1. **Substitute given values**:
         Here, $a = 3$, $b = 7$, and $g_{\text{avg}} = 5$:
         $$5 = \frac{1}{7 - 3}\int_3^7 g(x)\,dx = \frac{1}{4}\int_3^7 g(x)\,dx$$

      2. **Solve for the definite integral**:
         $$\int_3^7 g(x)\,dx = 5 \times 4 = 20$$

      3. **Connect integral to geometric area**:
         Because $g(x) \ge 0$ for all $x$ in $[3, 7]$, the area of the region enclosed by $y = g(x)$, $x = 3$, $x = 7$, and the $x$-axis is precisely the definite integral $\int_3^7 g(x)\,dx = 20$.

      **Distractor Rationale**:
      - **A is incorrect**: Divides the average value by the interval width ($\frac{5}{4}$) rather than multiplying.
      - **B is incorrect**: Conflates the average height of the function ($5$) with the total accumulated area under the curve.
      - **D is incorrect**: Multiplies the average value by the upper limit of integration ($5 \times 7 = 35$) rather than the width of the interval ($7 - 3 = 4$).

  - id: "ap-calc-1b-q39"
    questionNumber: 39
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
      1. **Estimate $\lim_{x \to 2} g(x)$ from the table**:
         - As $x$ approaches $2$ from the left ($x = 1.9, 1.99, 1.999$), the values of $g(x)$ decrease toward $0$ ($0.1245 \to 0.0118 \to 0.0012$).
         - As $x$ approaches $2$ from the right ($x = 2.1, 2.01, 2.001$), the values of $g(x)$ increase toward $0$ ($-0.1302 \to -0.0121 \to -0.0011$).
         - Therefore, $\lim_{x \to 2} g(x) = 0$.

      2. **Apply the limit property for continuous composite functions**:
         Because the exponential function $y = e^u$ is continuous everywhere:
         $$\lim_{x \to 2} e^{-4g(x)} = e^{\lim_{x \to 2} [-4g(x)]} = e^{-4 \cdot 0} = e^0 = 1$$

      **Distractor Rationale**:
      - **A is incorrect**: Conflates the exponent's constant coefficient $-4$ with the value of the exponential expression.
      - **B is incorrect**: Results from the common algebraic misconception that $e^0 = 0$ rather than $1$.
      - **D is incorrect**: Assumes that because $g(2)$ is not explicitly given in the table, the limit cannot exist. The values approaching from both the left and right clearly converge to $0$.

  - id: "ap-calc-1b-q40"
    questionNumber: 40
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
      The volume of a solid with known cross sections perpendicular to the $x$-axis is given by:
      $$V = \int_a^b A(x)\,dx$$
      where $A(x)$ is the cross-sectional area at position $x$.

      1. **Find the limits of integration**:
         Set the two curves equal to find their points of intersection in the first quadrant:
         $$3\cos\left(\frac{\pi x}{6}\right) = \frac{1}{3}(x - 3)^2$$
         The curves intersect at $x = 0$ (where $y = 3$) and at $x = 3$ (where $y = 0$). Thus, the limits are $a = 0$ to $b = 3$.

      2. **Determine the diameter and cross-sectional area**:
         The diameter of each semicircle is the vertical distance between the two curves:
         $$d(x) = 3\cos\left(\frac{\pi x}{6}\right) - \frac{1}{3}(x - 3)^2$$
         The radius of each semicircle is $r(x) = \frac{d(x)}{2}$. The area of each semicircular cross section is:
         $$A(x) = \frac{1}{2}\pi [r(x)]^2 = \frac{1}{2}\pi \left(\frac{d(x)}{2}\right)^2 = \frac{\pi}{8}[d(x)]^2$$

      3. **Compute the volume using a graphing calculator**:
         $$V = \frac{\pi}{8} \int_0^3 \left(3\cos\left(\frac{\pi x}{6}\right) - \frac{1}{3}(x - 3)^2\right)^2 dx \approx \frac{\pi}{8}(2.9944) \approx 1.176$$

      **Distractor Rationale**:
      - **B is incorrect**: Uses $\frac{\pi}{4}\int_0^3 [d(x)]^2\,dx$, erroneously treating the diameter as the radius of a full circle halved ($A = \frac{1}{4}\pi d^2$), which doubles the correct volume.
      - **C is incorrect**: Computes the volume if each cross section were a square with side length $d(x)$, evaluating $\int_0^3 [d(x)]^2\,dx \approx 2.994$ and omitting the geometric factor of $\frac{\pi}{8}$.
      - **D is incorrect**: Uses $\frac{\pi}{2}\int_0^3 [d(x)]^2\,dx$, confusing the radius formula by taking $\frac{1}{2}\pi [d(x)]^2$.

  - id: "ap-calc-1b-q41"
    questionNumber: 41
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
      To evaluate $\int_1^5 (2f(x) - 3g(x))\,dx$, apply the linearity and limit-reversal properties of definite integrals.

      1. **Apply the reversal of limits property**:
         Reversing the limits of integration changes the sign of the integral:
         $$\int_1^5 g(x)\,dx = -\int_5^1 g(x)\,dx = -(4) = -4$$

      2. **Apply the linearity property of definite integrals**:
         $$\int_1^5 (2f(x) - 3g(x))\,dx = 2\int_1^5 f(x)\,dx - 3\int_1^5 g(x)\,dx$$

      3. **Substitute the known values**:
         $$2(6) - 3(-4) = 12 + 12 = 24$$

      **Distractor Rationale**:
      - **A is incorrect**: Fails to reverse the limits for $g(x)$, erroneously using $\int_1^5 g(x)\,dx = 4$ and computing $2(6) - 3(4) = 12 - 12 = 0$.
      - **B is incorrect**: Omits the scalar multiplier $3$ on $g(x)$ while neglecting limit reversal, calculating $2(6) - 4 = 8$.
      - **D is incorrect**: Inverts the sign on the first integral or applies inconsistent scalar multiplication across terms.

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
      The sign of the second derivative determines the concavity of $g$ and the relative positions of its secant and tangent lines:

      1. **Analyze the second derivative**:
         Since $g''(x) > 0$ for all $x$, the graph of $g$ is strictly concave up on its entire domain.

      2. **Position of the tangent line**:
         Because $g$ is concave up, any tangent line lies strictly below the graph of $g$ except at the point of tangency. At $x = 5.2$ (where $x \neq 5$):
         $$T(5.2) < g(5.2)$$

      3. **Position of the secant line**:
         For a concave-up function, the secant line connecting two points on the graph lies strictly above the graph between those two points. Because $5.2$ lies in the interior of the interval $(2, 6)$:
         $$g(5.2) < S(5.2)$$

      4. **Combine the inequalities**:
         Combining both relationships yields:
         $$T(5.2) < g(5.2) < S(5.2)$$

      **Distractor Rationale**:
      - **A is incorrect**: This is the order for a concave-down function ($g''(x) < 0$), where the secant line lies below the curve and the tangent line lies above the curve.
      - **B is incorrect**: Places the graph of the function above both the secant line and the tangent line, violating the secant chord property on $(2, 6)$.
      - **D is incorrect**: Assumes that tangent line approximations are always overestimates, which is only true when $g''(x) < 0$.

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
      We evaluate each statement using calculus and the given initial condition:

      1. **Evaluate Statement I ($M(5)$)**:
         By the Fundamental Theorem of Calculus:
         $$M(5) = M(0) + \int_0^5 M'(t)\,dt = 50 + \int_0^5 (0.6t^2 + 8t + 150)\,dt$$
         Computing the integral:
         $$\int_0^5 (0.6t^2 + 8t + 150)\,dt = \left[0.2t^3 + 4t^2 + 150t\right]_0^5 = 0.2(125) + 4(25) + 150(5) = 25 + 100 + 750 = 875$$
         $$M(5) = 50 + 875 = 925\text{ grams}$$
         Therefore, **Statement I is true**.

      2. **Evaluate Statement II ($M'(5)$)**:
         The rate of change of the mass at $t = 5$ is given directly by the first derivative:
         $$M'(5) = 0.6(5)^2 + 8(5) + 150 = 0.6(25) + 40 + 150 = 15 + 40 + 150 = 205\text{ grams per hour}$$
         Therefore, **Statement II is true**.

      3. **Evaluate Statement III ($M''(5)$)**:
         The rate of change of the rate of change is given by the second derivative:
         $$M''(t) = \frac{d}{dt}\left[0.6t^2 + 8t + 150\right] = 1.2t + 8$$
         $$M''(5) = 1.2(5) + 8 = 6 + 8 = 14\text{ grams per hour per hour}$$
         Therefore, **Statement III is true**.

      Because Statements I, II, and III are all true, choice D is correct.

      **Distractor Rationale**:
      - **A and B are incorrect**: These omit Statement III, which correctly evaluates the second derivative $M''(5) = 14$.
      - **C is incorrect**: This choice omits Statement I, which occurs when a student fails to add the initial mass $M(0) = 50$ (believing the mass is only $875$ grams) and therefore rejects Statement I.

  - id: "ap-calc-1b-q44"
    questionNumber: 44
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
      The equation $f(g(x)) = x$ defines $g$ as the inverse function of $f$, meaning $g(x) = f^{-1}(x)$.

      1. **Differentiate both sides using the chain rule**:
         $$\frac{d}{dx}[f(g(x))] = \frac{d}{dx}[x]$$
         $$f'(g(x)) \cdot g'(x) = 1 \implies g'(x) = \frac{1}{f'(g(x))}$$

      2. **Evaluate at $x = 5$**:
         $$g'(5) = \frac{1}{f'(g(5))}$$

      3. **Determine $g(5)$ from the table**:
         Since $f(2) = 5$, it follows that $g(5) = f^{-1}(5) = 2$.

      4. **Evaluate the derivative**:
         From the table, $f'(2) = 4$. Substituting this value yields:
         $$g'(5) = \frac{1}{f'(2)} = \frac{1}{4}$$

      **Distractor Rationale**:
      - **A is incorrect**: Conflates the derivative of an inverse function with the slope of a perpendicular normal line ($-\frac{1}{m}$).
      - **B is incorrect**: Evaluates $\frac{1}{f'(5)} = \frac{1}{9}$, failing to recognize that the input to $f'$ must be the inverse value $g(5) = 2$, not $5$.
      - **D is incorrect**: Computes $f'(g(5)) = 4$ but forgets to take the reciprocal.
---