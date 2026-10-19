---
sectionId: "ap-calc-bc-t1-s1b"
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
  - id: "ap-calc-bc-t1-s1b-q30"
    questionNumber: 30
    questionType: "MC"
    layout: "split"
    correctAnswer: "C"
    domain: "Limits and Continuity"
    skill: "Confirming Continuity over a Domain"
    difficulty: "Easy"
    stimulus: |
      ![](./assets/APCalcBC-T1-S1B-Q30.svg)

      The graph of the function $g$ is shown in the figure above.
    prompt: |
      Which of the following statements must be false?
    options:
      - id: "A"
        text: "$\\lim\\limits_{x \\to -1^+} g(x) = 2$"
      - id: "B"
        text: "$\\lim\\limits_{x \\to -1^-} g(x) = -\\infty$"
      - id: "C"
        text: "$\\lim\\limits_{x \\to -1} g(x) = g(-1)$"
      - id: "D"
        text: "$\\lim\\limits_{x \\to \\infty} g(x) = 0$"
    explanation: |
      To determine which statement is false, evaluate each statement against the graphical behavior of $g$:

      1. **Examine the one-sided limits at $x = -1$**:
         - As $x$ approaches $-1$ from the right ($x \\to -1^+$), the values of $g(x)$ approach the solid endpoint at $(-1, 2)$. Therefore, $\\lim\\limits_{x \\to -1^+} g(x) = 2$ is a true statement.
         - As $x$ approaches $-1$ from the left ($x \\to -1^-$), the curve plunges downward alongside the vertical dashed asymptote $x = -1$. Therefore, $\\lim\\limits_{x \\to -1^-} g(x) = -\\infty$ is a true statement.

      2. **Examine the two-sided limit and continuity condition**:
         - A two-sided limit $\\lim\\limits_{x \\to -1} g(x)$ exists if and only if both one-sided limits exist and are equal:
           $$\\lim\\limits_{x \\to -1^-} g(x) = \\lim\\limits_{x \\to -1^+} g(x)$$
         - Because $\\lim\\limits_{x \\to -1^-} g(x) = -\\infty$ and $\\lim\\limits_{x \\to -1^+} g(x) = 2$, the two-sided limit $\\lim\\limits_{x \\to -1} g(x)$ does not exist.
         - Consequently, the statement $\\lim\\limits_{x \\to -1} g(x) = g(-1)$ must be false.

      3. **Examine end behavior as $x \\to \\infty$**:
         - As $x$ increases without bound ($x \\to \\infty$), the graph approaches the horizontal line $y = 0$. Therefore, $\\lim\\limits_{x \\to \\infty} g(x) = 0$ is a true statement.

      **Distractor Rationale**:
      - **A is true**: Accurately describes the right-hand limit approaching the closed endpoint $(-1, 2)$.
      - **B is true**: Accurately reflects the unbounded downward vertical asymptotic behavior to the left of $x = -1$.
      - **D is true**: Correctly identifies the horizontal asymptote $y = 0$ as $x \\to \\infty$.
	  
  - id: "ap-calc-bc-t1-s1b-q31"
    questionNumber: 31
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Contextual Applications of Differentiation"
    skill: "Interpreting the Meaning of the Derivative in Context"
    difficulty: "Easy"
    prompt: |
      The rate at which thermal energy escapes from an insulated container, in kilojoules per minute, is modeled by $H$, a differentiable function of the number of minutes after cooling begins. Which of the following is the best interpretation of $H'(5)$ ?
    options:
      - id: "A"
        text: "The total amount of thermal energy, in kilojoules, that has escaped from the container during the first five minutes after cooling begins"
      - id: "B"
        text: "The rate at which thermal energy escapes from the container, in kilojoules per minute, five minutes after cooling begins"
      - id: "C"
        text: "The rate of change of the rate at which thermal energy escapes from the container, in kilojoules per minute per minute, five minutes after cooling begins"
      - id: "D"
        text: "The amount of change, in kilojoules per minute, in the rate at which thermal energy escapes during the first five minutes after cooling begins"
    explanation: |
      To interpret $H'(5)$, analyze the meaning and units of the derivative of a rate function:

      1. **Identify the meaning of $H(t)$**:
         $H(t)$ is the instantaneous rate of heat loss at time $t$, measured in $\text{kilojoules per minute}$.

      2. **Determine the derivative $H'(t)$ and its units**:
         The derivative $H'(t) = \dfrac{dH}{dt}$ represents the instantaneous rate of change of $H(t)$ with respect to time $t$.
         $$\text{Units of } H'(t) = \dfrac{\text{units of } H}{\text{units of } t} = \dfrac{\text{kilojoules per minute}}{\text{minute}} = \text{kilojoules per minute per minute}$$

      3. **Interpret $H'(5)$**:
         Evaluating at $t = 5$ gives the rate of change of the rate at which thermal energy escapes from the container, measured in kilojoules per minute per minute, precisely five minutes after cooling begins.

      **Distractor Rationale**:
      - **A is incorrect**: Corresponds to the definite integral $\displaystyle\int_0^5 H(t) \, dt$, which measures the total accumulated thermal energy (in kilojoules) over the interval $[0, 5]$.
      - **B is incorrect**: Describes the value of the function $H(5)$ itself, representing the rate of heat loss at $t = 5$, rather than its rate of change.
      - **D is incorrect**: Corresponds to the net change in the rate over the time interval $[0, 5]$, given by $H(5) - H(0) = \displaystyle\int_0^5 H'(t) \, dt$.
	  
  - id: "ap-calc-bc-t1-s1b-q32"
    questionNumber: 32
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Applications of Integration"
    skill: "Finding the Average Value of a Function on an Interval"
    difficulty: "Medium"
    prompt: |
      On a certain spring day, the temperature, in degrees Fahrenheit, inside an agricultural greenhouse $t$ hours after 6 A.M. ($t = 0$) is modeled by the function $T(t) = 72 - 14\cos\left(\dfrac{\pi t}{8}\right)$. What is the average temperature in the greenhouse between 7 A.M. ($t = 1$) and 11 A.M. ($t = 5$), in degrees Fahrenheit?
    options:
      - id: "A"
        text: "$67.176$"
      - id: "B"
        text: "$53.741$"
      - id: "C"
        text: "$68.212$"
      - id: "D"
        text: "$76.824$"
    explanation: |
      The average value of a continuous function $f$ on the closed interval $[a, b]$ is given by:
      $$f_{\text{avg}} = \dfrac{1}{b - a} \int_{a}^{b} f(t) \, dt$$

      For this problem, the time interval is from $t = 1$ to $t = 5$, so $a = 1$ and $b = 5$:
      $$T_{\text{avg}} = \dfrac{1}{5 - 1} \int_{1}^{5} \left(72 - 14\cos\left(\dfrac{\pi t}{8}\right)\right) dt = \dfrac{1}{4} \int_{1}^{5} \left(72 - 14\cos\left(\dfrac{\pi t}{8}\right)\right) dt$$

      1. **Evaluate the definite integral using a graphing calculator**:
         $$\int_{1}^{5} \left(72 - 14\cos\left(\dfrac{\pi t}{8}\right)\right) dt \approx 268.7042$$

         *(Analytic antiderivative verification)*:
         $$\int \left(72 - 14\cos\left(\dfrac{\pi t}{8}\right)\right) dt = 72t - \dfrac{112}{\pi}\sin\left(\dfrac{\pi t}{8}\right)$$
         Evaluating between $t = 1$ and $t = 5$:
         $$\left[72(5) - \dfrac{112}{\pi}\sin\left(\dfrac{5\pi}{8}\right)\right] - \left[72(1) - \dfrac{112}{\pi}\sin\left(\dfrac{\pi}{8}\right)\right] \approx 327.0622 - 58.3580 = 268.7042$$

      2. **Divide by the length of the interval**:
         $$T_{\text{avg}} = \dfrac{268.7042}{4} \approx 67.17605 \approx 67.176^\circ\text{F}$$

      **Distractor Rationale**:
      - **B is incorrect**: Results from dividing the accumulated integral by the upper endpoint $b = 5$ rather than the interval width $b - a = 4$: $\frac{268.7042}{5} \approx 53.741$.
      - **C is incorrect**: Represents the arithmetic average of the endpoint temperatures $\frac{T(1) + T(5)}{2} = \frac{59.066 + 77.358}{2} \approx 68.212$, which fails to account for continuous accumulation across the interval.
      - **D is incorrect**: Results from a sign error when integrating $-\cos(u)$, treating the antiderivative as $+\sin(u)$, giving $\frac{1}{4}(307.2958) \approx 76.824$.
	  
  - id: "ap-calc-bc-t1-s1b-q33"
    questionNumber: 33
    questionType: "MC"
    layout: "split"
    correctAnswer: "B"
    domain: "Differential Equations"
    skill: "Approximating Solutions Using Euler's Method"
    difficulty: "Medium"
    stimulus: |
      | $x$ | $1.5$ | $2.0$ | $2.5$ | $3.0$ | $3.5$ |
      | :---: | :---: | :---: | :---: | :---: | :---: |
      | $g'(x)$ | $1.8$ | $1.4$ | $1.1$ | $0.7$ | $0.4$ |

      Let $y = g(x)$ be the solution to the differential equation $\dfrac{dy}{dx} = g'(x)$ with initial condition $g(2) = 8$. Selected values of $g'(x)$ are given in the table above.
    prompt: |
      What is the approximation for $g(3)$ if Euler's method is used with a step size of $0.5$, starting at $x = 2$ ?
    options:
      - id: "A"
        text: "$8.90$"
      - id: "B"
        text: "$9.25$"
      - id: "C"
        text: "$9.40$"
      - id: "D"
        text: "$10.50$"
    explanation: |
      Euler's method approximates values of $y = g(x)$ iteratively using the formula:
      $$y_{n+1} = y_n + g'(x_n)\Delta x$$

      The starting point is $(x_0, y_0) = (2, 8)$ with step size $\Delta x = 0.5$:

      1. **Step 1 ($x_0 = 2.0 \to x_1 = 2.5$)**:
         - From the table, $g'(2.0) = 1.4$.
         - Compute $y_1$:
           $$y_1 = 8 + 1.4(0.5) = 8 + 0.70 = 8.70$$
         - The new point is $(2.5, 8.70)$.

      2. **Step 2 ($x_1 = 2.5 \to x_2 = 3.0$)**:
         - From the table, $g'(2.5) = 1.1$.
         - Compute $y_2$:
           $$y_2 = 8.70 + 1.1(0.5) = 8.70 + 0.55 = 9.25$$

      Therefore, the approximation for $g(3)$ is $9.25$.

      **Distractor Rationale**:
      - **A is incorrect**: Erroneously uses the derivative values at the right endpoints of each subinterval, $g'(2.5) = 1.1$ and $g'(3.0) = 0.7$, yielding $8 + (1.1)(0.5) + (0.7)(0.5) = 8.90$.
      - **C is incorrect**: Uses a single step of size $\Delta x = 1.0$ from $x = 2$ to $x = 3$, computing $8 + 1.4(1.0) = 9.40$.
      - **D is incorrect**: Forgets to multiply the rates of change by the step size $\Delta x = 0.5$, directly adding $8 + 1.4 + 1.1 = 10.50$.
	  
  - id: "ap-calc-bc-t1-s1b-q34"
    questionNumber: 34
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Analytical Applications of Differentiation"
    skill: "Determining Concavity of Functions over Their Domains"
    difficulty: "Medium"
    prompt: |
      The first derivative of the function $g$ is defined by $g'(x) = (x^2 + 2)\cos(2x + 1)$ for $-2 < x < 2$. On which of the following intervals is the graph of $g$ concave up?
    options:
      - id: "A"
        text: "$(-2, -0.628)$ and $(1.244, 2)$"
      - id: "B"
        text: "$(-0.628, 1.244)$"
      - id: "C"
        text: "$(-1.285, 0.285)$ and $(1.856, 2)$"
      - id: "D"
        text: "$(-2, -1.285)$ and $(0.285, 1.856)$"
    explanation: |
      The graph of a twice-differentiable function $g$ is concave up on intervals where its second derivative satisfies $g''(x) > 0$, which corresponds to intervals where the first derivative $g'(x)$ is strictly increasing.

      1. **Graph $g'(x)$ or evaluate $g''(x)$ on a graphing calculator**:
         Enter $y_1 = (x^2 + 2)\cos(2x + 1)$ on the window $x \in (-2, 2)$.
         To find where $g$ is concave up, locate the intervals where $y_1$ has a positive slope (is increasing), or graph the numerical derivative $y_2 = \dfrac{d}{dx}[y_1]$ and find where $y_2 > 0$.

      2. **Differentiate analytically to verify**:
         Applying the product rule and chain rule to $g'(x)$:
         $$g''(x) = 2x\cos(2x + 1) - 2(x^2 + 2)\sin(2x + 1)$$

      3. **Find the zeros of $g''(x)$ on the interval $(-2, 2)$**:
         Setting $g''(x) = 0$ yields two roots:
         $$x \approx -0.628 \quad \text{and} \quad x \approx 1.244$$

      4. **Perform a sign analysis of $g''(x)$**:
         - For $-2 < x < -0.628$: $g''(x) > 0$, so $g$ is **concave up**.
         - For $-0.628 < x < 1.244$: $g''(x) < 0$, so $g$ is **concave down**.
         - For $1.244 < x < 2$: $g''(x) > 0$, so $g$ is **concave up**.

      Therefore, the graph of $g$ is concave up on the intervals $(-2, -0.628)$ and $(1.244, 2)$.

      **Distractor Rationale**:
      - **B is incorrect**: Identifies the interval where $g''(x) < 0$ (or where $g'$ is decreasing), representing where the graph of $g$ is concave down rather than concave up.
      - **C is incorrect**: Corresponds to the intervals where $g'(x) > 0$, confusing the condition for $g$ being increasing with the condition for $g$ being concave up. The values $-1.285$, $0.285$, and $1.856$ are roots of $g'(x) = 0$ where $\cos(2x + 1) = 0$.
      - **D is incorrect**: Corresponds to the intervals where $g'(x) < 0$, representing where $g$ is decreasing.
	  
  - id: "ap-calc-bc-t1-s1b-q35"
    questionNumber: 35
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Contextual Applications of Differentiation"
    skill: "Straight-Line Motion - Connecting Position, Velocity, and Acceleration"
    difficulty: "Medium"
    prompt: |
      For $t \ge 0$, the velocity of a particle moving along the $x$-axis is given by $v(t) = t^3 - 8.5t^2 + 18t - 6$. At what time $t$ does the direction of motion of the particle change from right to left?
    options:
      - id: "A"
        text: "$0.414$"
      - id: "B"
        text: "$1.409$"
      - id: "C"
        text: "$2.753$"
      - id: "D"
        text: "$5.333$"
    explanation: |
      A particle moving along a horizontal axis moves to the right when its velocity is positive ($v(t) > 0$) and to the left when its velocity is negative ($v(t) < 0$). Therefore, the direction of motion changes from right to left when $v(t)$ changes sign from positive to negative.

      1. **Find the zeros of the velocity function**:
         Graph $y_1 = t^3 - 8.5t^2 + 18t - 6$ on a graphing calculator for $t \ge 0$ and calculate the roots:
         $$t_1 \approx 0.414, \quad t_2 \approx 2.753, \quad t_3 \approx 5.333$$

      2. **Perform a sign analysis of $v(t)$**:
         - For $0 \le t < 0.414$: $v(t) < 0$ (the particle moves to the left).
         - At $t \approx 0.414$: $v(t)$ changes from negative to positive (direction changes from left to right).
         - For $0.414 < t < 2.753$: $v(t) > 0$ (the particle moves to the right).
         - At $t \approx 2.753$: $v(t)$ changes from positive to negative (direction changes from **right to left**).
         - For $2.753 < t < 5.333$: $v(t) < 0$ (the particle moves to the left).
         - At $t \approx 5.333$: $v(t)$ changes from negative to positive (direction changes from left to right).

      Therefore, the particle changes its direction of motion from right to left at $t \approx 2.753$.

      **Distractor Rationale**:
      - **A is incorrect**: At $t \approx 0.414$, the velocity transitions from negative to positive, meaning the particle changes direction from left to right rather than right to left.
      - **B is incorrect**: Represents a zero of the acceleration function $a(t) = v'(t) = 3t^2 - 17t + 18 = 0$ (where $t = \frac{17 - \sqrt{73}}{6} \approx 1.409$), which is a local maximum of the velocity function, not a change in the direction of motion.
      - **D is incorrect**: At $t \approx 5.333$, the velocity transitions from negative to positive, corresponding to another change in direction from left to right.
	  
  - id: "ap-calc-bc-t1-s1b-q36"
    questionNumber: 36
    questionType: "MC"
    layout: "single"
    correctAnswer: "D"
    domain: "Limits and Continuity"
    skill: "Working with the Intermediate Value Theorem"
    difficulty: "Easy"
    prompt: |
      Let $g$ be a function such that $g(-1) = 4$ and $g(4) = -5$. Which of the following conditions ensures that $g(c) = 0$ for some value $c$ in the open interval $(-1, 4)$ ?
    options:
      - id: "A"
        text: "$\\displaystyle\\int_{-1}^{4} g(x) \\, dx$ exists."
      - id: "B"
        text: "$g$ is decreasing on the closed interval $[-1, 4]$."
      - id: "C"
        text: "$g$ is defined for all values of $x$ in the closed interval $[-1, 4]$."
      - id: "D"
        text: "$g$ is continuous on the closed interval $[-1, 4]$."
    explanation: |
      The Intermediate Value Theorem (IVT) states that if a function $g$ is continuous on a closed interval $[a, b]$, and $k$ is any value strictly between $g(a)$ and $g(b)$, then there exists at least one value $c$ in the open interval $(a, b)$ such that $g(c) = k$.

      1. **Verify the intermediate value**:
         The value $0$ lies strictly between $g(-1) = 4$ and $g(4) = -5$ since $-5 < 0 < 4$.

      2. **Identify the required hypothesis**:
         The sole hypothesis needed for the Intermediate Value Theorem to guarantee the existence of such a value $c \in (-1, 4)$ is that $g$ is **continuous on the closed interval $[-1, 4]$**.

      **Distractor Rationale**:
      - **A is incorrect**: A function can have jump discontinuities and still be Riemann integrable. For example, a piecewise step function that jumps from $4$ down to $-5$ without taking on $0$ has a well-defined definite integral.
      - **B is incorrect**: Monotonicity alone does not ensure the intermediate value property without continuity. For instance, the function defined by $g(x) = 4$ for $x \in [-1, 1]$ and $g(x) = -5$ for $x \in (1, 4]$ is non-increasing (and strictly decreasing versions can be constructed with jumps) but never equals $0$.
      - **C is incorrect**: Being defined everywhere on $[-1, 4]$ does not prevent jump or essential discontinuities from skipping over $0$.
	  
  - id: "ap-calc-bc-t1-s1b-q37"
    questionNumber: 37
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Parametric Equations, Polar Coordinates, and Vector-Valued Functions"
    skill: "Vector-Valued Functions and Particle Motion"
    difficulty: "Medium"
    prompt: |
      For time $t > 0$, the position of an object moving in the $xy$-plane is given by the parametric equations $x(t) = t\sin\left(\dfrac{t}{3}\right)$ and $y(t) = \sqrt{2t^2 + 1}$. What is the speed of the object at time $t = 2$ ?
    options:
      - id: "A"
        text: "$1.333$"
      - id: "B"
        text: "$1.756$"
      - id: "C"
        text: "$1.496$"
      - id: "D"
        text: "$2.476$"
    explanation: |
      The speed of an object moving in the $xy$-plane defined parametrically by $\left(x(t), y(t)\right)$ is given by the magnitude of its velocity vector:
      $$\text{Speed}(t) = \|\vec{v}(t)\| = \sqrt{(x'(t))^2 + (y'(t))^2}$$

      1. **Differentiate $x(t)$ with respect to $t$ using the product and chain rules**:
         $$x'(t) = \dfrac{d}{dt}\left[t\right]\sin\left(\dfrac{t}{3}\right) + t\dfrac{d}{dt}\left[\sin\left(\dfrac{t}{3}\right)\right] = \sin\left(\dfrac{t}{3}\right) + \dfrac{t}{3}\cos\left(\dfrac{t}{3}\right)$$
         At $t = 2$ (ensuring radian mode):
         $$x'(2) = \sin\left(\dfrac{2}{3}\right) + \dfrac{2}{3}\cos\left(\dfrac{2}{3}\right) \approx 0.618370 + 0.523925 \approx 1.142295$$

      2. **Differentiate $y(t)$ with respect to $t$ using the chain rule**:
         $$y'(t) = \dfrac{d}{dt}\left[(2t^2 + 1)^{1/2}\right] = \dfrac{1}{2}(2t^2 + 1)^{-1/2}(4t) = \dfrac{2t}{\sqrt{2t^2 + 1}}$$
         At $t = 2$:
         $$y'(2) = \dfrac{2(2)}{\sqrt{2(2^2) + 1}} = \dfrac{4}{\sqrt{9}} = \dfrac{4}{3} \approx 1.333333$$

      3. **Calculate the speed at $t = 2$**:
         $$\text{Speed}(2) = \sqrt{(1.142295)^2 + (1.333333)^2} = \sqrt{1.304838 + 1.777778} = \sqrt{3.082616} \approx 1.75574 \approx 1.756$$

      **Distractor Rationale**:
      - **A is incorrect**: Evaluates only the vertical velocity component $y'(2) = \frac{4}{3} \approx 1.333$, omitting the contribution of the horizontal velocity component $x'(2)$.
      - **C is incorrect**: Results from evaluating the trigonometric function in degree mode rather than radian mode when computing $x'(2)$, producing $\sqrt{(0.67826)^2 + (1.33333)^2} \approx 1.496$.
      - **D is incorrect**: Computes the sum of the scalar velocity components $x'(2) + y'(2) = 1.142 + 1.333 = 2.476$ rather than using the Pythagorean magnitude $\sqrt{(x')^2 + (y')^2}$.
	  
  - id: "ap-calc-bc-t1-s1b-q38"
    questionNumber: 38
    questionType: "MC"
    layout: "split"
    correctAnswer: "A"
    domain: "Differentiation: Composite, Implicit, and Inverse Functions"
    skill: "Applying the Chain Rule"
    difficulty: "Medium"
    stimulus: |
      ![](./assets/APCalcBC-T1-S1B-Q38.svg)

      The graph of the function $h$ is shown above, consisting of two line segments.
    prompt: |
      If $f$ is the function given by $f(x) = h(h(x))$, what is the value of $f'(-1)$ ?
    options:
      - id: "A"
        text: "$-6$"
      - id: "B"
        text: "$-2$"
      - id: "C"
        text: "$3$"
      - id: "D"
        text: "$6$"
    explanation: |
      To find $f'(-1)$, apply the chain rule to the composite function $f(x) = h(h(x))$:
      $$f'(x) = h'(h(x)) \cdot h'(x)$$
      Evaluating at $x = -1$:
      $$f'(-1) = h'(h(-1)) \cdot h'(-1)$$

      1. **Determine the values on the first line segment ($x \le 0$)**:
         - The segment passes through $(-3, -4)$ and $(0, 5)$.
         - Slope of this segment:
           $$m_1 = \dfrac{5 - (-4)}{0 - (-3)} = \dfrac{9}{3} = 3$$
         - Because $-1$ lies on this segment, the derivative is $h'(-1) = 3$.
         - Using the point-slope form $y - 5 = 3(x - 0)$, the equation of this segment is $h(x) = 3x + 5$.
         - Evaluating at $x = -1$:
           $$h(-1) = 3(-1) + 5 = 2$$

      2. **Determine the derivative on the second line segment ($x \ge 0$)**:
         - Substitute $h(-1) = 2$ into the outer derivative:
           $$h'(h(-1)) = h'(2)$$
         - The second segment passes through $(0, 5)$ and $(5, -5)$.
         - Slope of this segment:
           $$m_2 = \dfrac{-5 - 5}{5 - 0} = \dfrac{-10}{5} = -2$$
         - Because $x = 2$ lies in the open interval $(0, 5)$, the derivative is $h'(2) = -2$.

      3. **Compute $f'(-1)$ using the chain rule**:
         $$f'(-1) = h'(2) \cdot h'(-1) = (-2) \cdot (3) = -6$$

      **Distractor Rationale**:
      - **B is incorrect**: Evaluates only the outer derivative $h'(h(-1)) = h'(2) = -2$, neglecting to multiply by the inner derivative $h'(-1) = 3$.
      - **C is incorrect**: Evaluates only the inner derivative $h'(-1) = 3$, failing to apply the outer differentiation step.
      - **D is incorrect**: Results from a sign error when computing the slope of the decreasing segment, treating $h'(2)$ as $+2$ instead of $-2$.
	  
  - id: "ap-calc-bc-t1-s1b-q39"
    questionNumber: 39
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Integration and Accumulation of Change"
    skill: "Applying Properties of Definite Integrals"
    difficulty: "Medium"
    prompt: |
      Let $g$ be a continuous function such that $g(-x) = g(x)$ for all $x$. If $\displaystyle\int_{0}^{3} g(x) \, dx = 7$, then $\displaystyle\int_{-3}^{3} (2g(x) - 5) \, dx =$
    options:
      - id: "A"
        text: "$-30$"
      - id: "B"
        text: "$-16$"
      - id: "C"
        text: "$-2$"
      - id: "D"
        text: "$13$"
    explanation: |
      Apply the properties of definite integrals and the symmetry of even functions:

      1. **Apply linearity of integration**:
         $$\int_{-3}^{3} (2g(x) - 5) \, dx = 2\int_{-3}^{3} g(x) \, dx - \int_{-3}^{3} 5 \, dx$$

      2. **Apply the even function symmetry property**:
         Because $g(-x) = g(x)$ for all $x$, $g$ is an even function. The integral of an even function over a symmetric interval $[-a, a]$ is twice the integral over $[0, a]$:
         $$\int_{-3}^{3} g(x) \, dx = 2\int_{0}^{3} g(x) \, dx = 2(7) = 14$$

      3. **Evaluate the constant integral**:
         $$\int_{-3}^{3} 5 \, dx = 5 \cdot (3 - (-3)) = 5 \cdot 6 = 30$$

      4. **Combine the results**:
         $$\int_{-3}^{3} (2g(x) - 5) \, dx = 2(14) - 30 = 28 - 30 = -2$$

      **Distractor Rationale**:
      - **A is incorrect**: Mistakenly treats $g$ as an odd function, assuming $\int_{-3}^3 g(x) \, dx = 0$, which yields $2(0) - 30 = -30$.
      - **B is incorrect**: Forgets to double the accumulation across the symmetric interval, setting $\int_{-3}^3 g(x) \, dx = \int_0^3 g(x) \, dx = 7$, yielding $2(7) - 30 = -16$.
      - **D is incorrect**: Multiplies the constant by the half-interval width $3 - 0 = 3$ instead of the total width $3 - (-3) = 6$, giving $28 - 15 = 13$.
	  
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

  - id: "ap-calc-bc-t1-s1b-q41"
    questionNumber: 41
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    domain: "Infinite Sequences and Series"
    skill: "Alternating Series Test for Convergence"
    difficulty: "Medium"
    prompt: |
      Let $\{a_n\}$ be a sequence of positive real numbers such that $\lim\limits_{n \to \infty} a_n = 0$ and $a_{n+1} \le a_n$ for all $n \ge 1$. Which of the following statements must be true?
    options:
      - id: "A"
        text: "$\\displaystyle\\sum_{n=1}^{\\infty} a_n$ converges."
      - id: "B"
        text: "$\\displaystyle\\sum_{n=1}^{\\infty} (-1)^{n+1} a_n$ converges."
      - id: "C"
        text: "$\\displaystyle\\sum_{n=1}^{\\infty} a_n^2$ converges."
      - id: "D"
        text: "$\\lim\\limits_{n \\to \\infty} \\dfrac{a_{n+1}}{a_n} < 1$"
    explanation: |
      To determine which statement must be true, apply standard convergence tests and analyze counterexamples for each option:

      1. **Evaluate Choice B (Alternating Series Test)**:
         The Alternating Series Test guarantees that an alternating series of the form $\sum_{n=1}^{\infty} (-1)^{n+1} a_n$ converges if:
         - $a_n > 0$ for all $n \ge 1$ (given).
         - $a_{n+1} \le a_n$ for all $n \ge 1$ (terms are non-increasing, given).
         - $\lim\limits_{n \to \infty} a_n = 0$ (given).

         Because all three hypotheses of the Alternating Series Test are satisfied, the series $\sum_{n=1}^{\infty} (-1)^{n+1} a_n$ **must converge**.

      **Distractor Rationale**:
      - **A is false**: Having $\lim\limits_{n \to \infty} a_n = 0$ is a necessary condition for convergence, but not a sufficient one. For example, if $a_n = \dfrac{1}{n}$, then $a_n > 0$, $a_{n+1} < a_n$, and $\lim\limits_{n \to \infty} a_n = 0$, but the harmonic series $\sum_{n=1}^{\infty} \dfrac{1}{n}$ diverges.
      - **C is false**: Consider $a_n = \dfrac{1}{\sqrt{n}}$. The sequence is positive, strictly decreasing, and approaches $0$ as $n \to \infty$. However, $\sum_{n=1}^{\infty} a_n^2 = \sum_{n=1}^{\infty} \dfrac{1}{n}$, which is the divergent harmonic series ($p$-series with $p = 1$).
      - **D is false**: The ratio test condition $\lim\limits_{n \to \infty} \left|\frac{a_{n+1}}{a_n}\right| < 1$ is sufficient for absolute convergence, but sequences can decrease to zero without having a ratio limit strictly less than $1$. For $a_n = \dfrac{1}{n}$, $\lim\limits_{n \to \infty} \dfrac{a_{n+1}}{a_n} = \lim\limits_{n \to \infty} \dfrac{n}{n+1} = 1$.
	  
  - id: "ap-calc-bc-t1-s1b-q42"
    questionNumber: 42
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Parametric Equations, Polar Coordinates, and Vector-Valued Functions"
    skill: "Solving Motion Problems Using Parametric and Vector-Valued Functions"
    difficulty: "Medium"
    prompt: |
      At time $t \ge 0$, a particle moving in the $xy$-plane has velocity vector given by $v(t) = \left\langle 2, e^{-t^2/2} \right\rangle$. If the particle is at the point $\left(2, \dfrac{3}{2}\right)$ at time $t = 0$, how far is the particle from the origin at time $t = 2$ ?
    options:
      - id: "A"
        text: "$4.175$"
      - id: "B"
        text: "$4.824$"
      - id: "C"
        text: "$6.578$"
      - id: "D"
        text: "$8.696$"
    explanation: |
      The distance of the particle from the origin at time $t = 2$ is given by the Euclidean distance formula:
      $$\text{Distance} = \sqrt{\left(x(2)\right)^2 + \left(y(2)\right)^2}$$

      1. **Find the position coordinates $x(2)$ and $y(2)$ by accumulating velocity from $t = 0$**:
         - Horizontal position:
           $$x(2) = x(0) + \int_{0}^{2} x'(t) \, dt = 2 + \int_{0}^{2} 2 \, dt = 2 + [2t]_0^2 = 2 + 4 = 6$$
         - Vertical position:
           $$y(2) = y(0) + \int_{0}^{2} y'(t) \, dt = \dfrac{3}{2} + \int_{0}^{2} e^{-t^2/2} \, dt$$

      2. **Evaluate the vertical accumulation using a graphing calculator**:
         $$\int_{0}^{2} e^{-t^2/2} \, dt \approx 1.19629$$
         $$y(2) = 1.5 + 1.19629 = 2.69629$$

      3. **Compute the distance from the origin**:
         $$\text{Distance} = \sqrt{(6)^2 + (2.69629)^2} = \sqrt{36 + 7.26998} = \sqrt{43.26998} \approx 6.578$$

      **Distractor Rationale**:
      - **A is incorrect**: Omits the initial position $(x(0), y(0)) = (2, 1.5)$ entirely and calculates the magnitude of the displacement vector over $[0, 2]$: $\sqrt{4^2 + (1.196)^2} \approx 4.175$.
      - **B is incorrect**: Forgets the initial condition for $x$ while including it for $y$, evaluating $\sqrt{4^2 + (2.696)^2} \approx 4.824$.
      - **D is incorrect**: Computes the sum of the coordinates $x(2) + y(2) = 6 + 2.696 = 8.696$ instead of computing the distance from the origin via the Pythagorean theorem.
	  
  - id: "ap-calc-bc-t1-s1b-q43"
    questionNumber: 43
    questionType: "MC"
    layout: "split"
    correctAnswer: "A"
    domain: "Infinite Sequences and Series"
    skill: "Taylor Polynomial Approximations of Functions"
    difficulty: "Medium"
    stimulus: |
      Let $g$ be a twice-differentiable function with $g(0) = 2$, $g'(0) = -3$, and $g''(0) = 4$.
    prompt: |
      Which of the following could be the graph of the second-degree Taylor polynomial for $g$ about $x = 0$ ?
    options:
      - id: "A"
        text: "![](./assets/APCalcBC-T1-S1B-Q43-A.svg)"
      - id: "B"
        text: "![](./assets/APCalcBC-T1-S1B-Q43-B.svg)"
      - id: "C"
        text: "![](./assets/APCalcBC-T1-S1B-Q43-C.svg)"
      - id: "D"
        text: "![](./assets/APCalcBC-T1-S1B-Q43-D.svg)"
    explanation: |
      The second-degree Taylor polynomial for a function $g$ centered at $x = 0$ is defined as:
      $$P_2(x) = g(0) + g'(0)x + \dfrac{g''(0)}{2!}x^2$$

      1. **Substitute the given values**:
         $$P_2(x) = 2 + (-3)x + \dfrac{4}{2!}x^2 = 2 - 3x + 2x^2 = 2x^2 - 3x + 2$$

      2. **Analyze the graphical characteristics of $P_2(x)$**:
         - **$y$-intercept**: $P_2(0) = 2$, so the graph must cross the $y$-axis at $(0, 2)$.
         - **Slope at $x = 0$**: $P_2'(0) = -3 < 0$, which means the graph is strictly decreasing as it crosses the $y$-axis.
         - **Concavity**: The leading coefficient of the quadratic term is positive ($a = 2 > 0$), and $P_2''(x) = 4 > 0$. Thus, the graph is a parabola that is concave up (opens upward).
         - **Vertex location**:
           $$x_v = -\dfrac{b}{2a} = -\dfrac{-3}{2(2)} = \dfrac{3}{4} = 0.75$$
           Because $x_v > 0$, the minimum occurs to the right of the $y$-axis in the first quadrant, with $P_2(0.75) = 2(0.75)^2 - 3(0.75) + 2 = 0.875 > 0$.

      Only graph **A** shows a concave-up parabola with a $y$-intercept at $(0, 2)$, a negative initial slope, and a vertex in the first quadrant near $x = 0.75$.

      **Distractor Rationale**:
      - **B is incorrect**: Shows a concave-down parabola, resulting from a sign error on the second derivative ($g''(0) = -4$).
      - **C is incorrect**: Shows the linear first-degree tangent line approximation $P_1(x) = 2 - 3x$, omitting the quadratic degree term $\frac{g''(0)}{2!}x^2$.
      - **D is incorrect**: Shows a parabola with a positive slope at $x = 0$ and its vertex in the second quadrant, corresponding to an incorrect sign on the first derivative ($g'(0) = +3$).
	  
  - id: "ap-calc-bc-t1-s1b-q44"
    questionNumber: 44
    questionType: "MC"
    layout: "single"
    correctAnswer: "C"
    domain: "Infinite Sequences and Series"
    skill: "Alternating Series Error Bound"
    difficulty: "Medium"
    prompt: |
      The series $\displaystyle\sum_{n=1}^{\infty} \dfrac{(-1)^n}{\sqrt[3]{n}}$ converges to $S$. Based on the alternating series error bound, what is the least number of terms in the series that must be summed to guarantee a partial sum that is within $0.05$ of $S$ ?
    options:
      - id: "A"
        text: "$20$"
      - id: "B"
        text: "$399$"
      - id: "C"
        text: "$7{,}999$"
      - id: "D"
        text: "$8{,}000$"
    explanation: |
      The Alternating Series Error Bound states that if an alternating series satisfies the hypotheses of the Alternating Series Test, the error in approximating the infinite sum $S$ with the $N\text{th}$ partial sum $S_N$ is bounded by the absolute value of the first omitted term:
      $$|S - S_N| \le a_{N+1}$$

      For the given series, the general term magnitude is $a_n = \dfrac{1}{\sqrt[3]{n}}$, which means the first omitted term is:
      $$a_{N+1} = \dfrac{1}{\sqrt[3]{N+1}}$$

      1. **Set up the error inequality**:
         We require the error bound to be at most $0.05$:
         $$\dfrac{1}{\sqrt[3]{N+1}} \le 0.05$$

      2. **Solve for $N$ algebraically**:
         $$\dfrac{1}{\sqrt[3]{N+1}} \le \dfrac{1}{20}$$
         $$\sqrt[3]{N+1} \ge 20$$
         Cubing both sides:
         $$N + 1 \ge 20^3 = 8{,}000$$
         $$N \ge 8{,}000 - 1 = 7{,}999$$

      Therefore, the least number of terms that must be summed to guarantee an approximation within $0.05$ of $S$ is $7{,}999$.

      **Distractor Rationale**:
      - **A is incorrect**: Inverts the tolerance $\frac{1}{0.05} = 20$ without cubing both sides to eliminate the cube root.
      - **B is incorrect**: Squares the quantity instead of cubing it ($20^2 - 1 = 400 - 1 = 399$).
      - **D is incorrect**: Uses $a_N$ instead of the first omitted term $a_{N+1}$, solving $\frac{1}{\sqrt[3]{N}} \le 0.05 \implies N \ge 8{,}000$.