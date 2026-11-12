---
sectionId: "sat-t1-m2h"
sectionTitle: "Mathematics - M2H"
sectionOrder: 4
timeLimit: 2100
questions:
  - id: "sat-t1-m2h-q1"
    questionNumber: 1
    questionType: "MC"
    correctAnswer: "B"
    domain: "Algebra"
    skill: "Linear Equations in One Variable"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      In the equation below, $a$ and $b$ are constants:
      $$a(3x - 4) + 2(x + 5) = 17x + b$$
      If the equation has infinitely many real solutions, what is the value of $a + b$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the sum $a + b$ for a linear equation with **infinitely many real solutions**. For a linear identity to hold true for every real value of $x$, the $x$-coefficients on both sides must match, and the constant terms on both sides must also match.

      :::tabs

      == tab: Solving the question with Algebra
      Because unknown constants ($a$ and $b$) appear on both sides, matching coefficients algebraically is the most direct and reliable approach.

      :::derivation
      == step: Expand and Group Like Terms
      -- why: Distribute $a$ and $2$ on the left side, then separate the $x$-terms from the constant terms.
      $$
      \begin{aligned}
      a(3x - 4) + 2(x + 5) &= 17x + b \\
      3ax - 4a + 2x + 10 &= 17x + b \\
      \mathbf{\color{#2563eb}{(3a + 2)}}x + \mathbf{\color{#d97706}{(10 - 4a)}} &= \mathbf{\color{#2563eb}{17}}x + \mathbf{\color{#d97706}{b}}
      \end{aligned}
      $$

      == step: Solve for Constant $a$
      -- why: For infinitely many solutions, the coefficient of $x$ on the left must equal the coefficient of $x$ on the right.
      $$
      \begin{aligned}
      \mathbf{\color{#2563eb}{3a + 2}} &= \mathbf{\color{#2563eb}{17}} \\
      3a &= 15 \\
      a &= \mathbf{\color{#2563eb}{5}}
      \end{aligned}
      $$

      == step: Solve for Constant $b$
      -- why: Set the constant terms equal and substitute $a = 5$.
      $$
      \begin{aligned}
      \mathbf{\color{#d97706}{b}} &= \mathbf{\color{#d97706}{10 - 4a}} \\
      b &= 10 - 4(\mathbf{\color{#2563eb}{5}}) \\
      b &= 10 - 20 = \mathbf{\color{#d97706}{-10}}
      \end{aligned}
      $$

      == step: Evaluate Target Expression $(a + b)$
      -- why: Combine $a$ and $b$ carefully to avoid dropping the negative sign on $b$.
      $$
      \begin{aligned}
      a + b &= \mathbf{\color{#2563eb}{5}} + (\mathbf{\color{#d97706}{-10}}) = \mathbf{-5}
      \end{aligned}
      $$
      :::

      == tab: Applying DESMOS
      You can verify your constants in Desmos using **sliders**. When two linear expressions are identical, their graphs overlap completely for every value of $x$.

      1. Enter `y = a(3x - 4) + 2(x + 5)` in line 1 and accept the slider for `a`.
      2. Enter `y = 17x + b` in line 2 and accept the slider for `b`.
      3. Set `a = 5` and `b = -10` to confirm the two lines coincide completely, then evaluate `a + b` in line 3.

      :::desmos
      {
        "bounds": { "left": -5, "right": 5, "bottom": -30, "top": 30 },
        "expressions": [
          { "id": "a_val", "latex": "a = 5", "color": "#444444" },
          { "id": "b_val", "latex": "b = -10", "color": "#444444" },
          { "id": "lhs", "latex": "y = a(3x - 4) + 2(x + 5)", "color": "#2563eb" },
          { "id": "rhs", "latex": "y = 17x + b", "color": "#16a34a" },
          { "id": "ans", "latex": "a + b", "color": "#dc2626" }
        ],
        "caption": "With a = 5 and b = -10, both lines overlap completely across all x-values, and a + b evaluates to -5."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $-15$:** *Sign Error Trap.* Correctly finds $b = -10$, but treats $a$ as $-5$ (or computes $b - a = -10 - 5 = -15$).
      * **(B) $-5$:** **Correct.** Finds $a = 5$ and $b = -10$, then sums $5 + (-10) = -5$.
      * **(C) $5$:** *Wrong Target Trap.* Stops after solving for $a = 5$ instead of computing $a + b$.
      * **(D) $15$:** *Sign Error Trap.* Drops the negative sign when finding $b$ ($b = 10$ instead of $-10$) and adds $5 + 10 = 15$.
    options:
      - id: "A"
        text: "$-15$"
      - id: "B"
        text: "$-5$"
      - id: "C"
        text: "$5$"
      - id: "D"
        text: "$15$"

  - id: "sat-t1-m2h-q2"
    questionNumber: 2
    questionType: "MC"
    correctAnswer: "A"
    domain: "Algebra"
    skill: "Linear Functions"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      For a linear function $f$, it is given that $f(8) - f(2) = 36$. If $f(5) = 19$, what is the value of $f(11)$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the output value $f(11)$ of a **linear function** using its constant rate of change (slope) and a known point $f(5) = 19$. Because linear functions change by equal output amounts over equal input intervals, you can solve this directly without ever finding the $y$-intercept.

      :::tabs

      == tab: Solving the question with Algebra
      Use the constant slope formula $m = \dfrac{\Delta y}{\Delta x}$ to bridge the given difference $f(8) - f(2) = 36$ to $f(11)$.

      :::derivation
      == step: Find the Constant Rate of Change (Slope)
      -- why: Divide the given change in output by the corresponding change in input from $x = 2$ to $x = 8$.
      $$
      \begin{aligned}
      m &= \frac{f(8) - f(2)}{8 - 2} \\
      &= \frac{\mathbf{\color{#2563eb}{36}}}{\mathbf{\color{#d97706}{6}}} = \mathbf{\color{#2563eb}{6}}
      \end{aligned}
      $$

      == step: Apply the Slope to Find $f(11)$
      -- why: Moving from $x = 5$ to $x = 11$ is an input change of $\Delta x = 11 - 5 = 6$. Multiply the slope by $\Delta x$ and add to $f(5)$.
      $$
      \begin{aligned}
      f(11) &= f(5) + m(11 - 5) \\
      &= 19 + \mathbf{\color{#2563eb}{6}}(\mathbf{\color{#d97706}{6}}) \\
      &= 19 + \mathbf{\color{#2563eb}{36}} = \mathbf{55}
      \end{aligned}
      $$
      :::

      *Shortcut Insight:* Notice that going from $x = 2$ to $x = 8$ is a step of $\Delta x = +6$, which caused the output to rise by $+36$. Going from $x = 5$ to $x = 11$ is the **exact same input step** ($\Delta x = +6$), so the output must also rise by $+36$: $19 + 36 = \mathbf{55}$.

      == tab: Applying DESMOS
      Because $f(x)$ is linear, any $y$-intercept that satisfies $f(5) = 19$ with the slope $m = \frac{36}{8 - 2}$ will produce the exact same value at $x = 11$.

      1. In line 1, compute the slope: `m = 36 / (8 - 2)` (outputs `6`).
      2. In line 2, write the point-slope form anchored at $(5, 19)$: `f(x) = m(x - 5) + 19`.
      3. In line 3, evaluate `f(11)` directly (outputs **`55`**).

      :::desmos
      {
        "bounds": { "left": -2, "right": 14, "bottom": -10, "top": 70 },
        "expressions": [
          { "id": "slope", "latex": "m = \\frac{36}{8 - 2}", "color": "#444444" },
          { "id": "func", "latex": "f(x) = m(x - 5) + 19", "color": "#2563eb" },
          { "id": "pt1", "latex": "(5, 19)", "color": "#d97706", "label": "(5, 19)", "showLabel": true },
          { "id": "pt2", "latex": "(11, 55)", "color": "#dc2626", "label": "(11, 55)", "showLabel": true }
        ],
        "caption": "Line 1 defines slope m = 6, Line 2 anchors f(x) at (5, 19), and the red point confirms f(11) = 55."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $55$:** **Correct.** Adds the $6$-unit horizontal change multiplied by the slope of $6$ to $f(5)$: $19 + 36 = 55$.
      * **(B) $49$:** *Interval Miscalculation Trap.* Multiplies the slope of $6$ by $5$ instead of $6$ ($19 + 30 = 49$), miscounting the distance between $x = 5$ and $x = 11$.
      * **(C) $37$:** *Partial Step Trap.* Adds only half the interval change ($19 + 18 = 37$), as if moving $\Delta x = 3$ units instead of $6$.
      * **(D) $36$:** *Wrong Target Trap.* Stops after finding the change in output ($\Delta y = 36$) instead of adding it to the starting value $f(5) = 19$.
    options:
      - id: "A"
        text: "$55$"
      - id: "B"
        text: "$49$"
      - id: "C"
        text: "$37$"
      - id: "D"
        text: "$36$"

  - id: "sat-t1-m2h-q3"
    questionNumber: 3
    questionType: "MC"
    correctAnswer: "C"
    domain: "Geometry and Trigonometry"
    skill: "Area and Volume"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Right circular cylinder X has radius $r$ and height $h$. Right circular cylinder Y is formed by increasing the radius of cylinder X by $60\%$ and decreasing its height by $p\%$. If cylinder X and cylinder Y have the exact same volume, which of the following is closest to the value of $p$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the percentage decrease $p$ in height required to keep the **volume of a right circular cylinder** ($V = \pi r^2 h$) unchanged after its radius increases by $60\%$. Because the radius is **squared** in the volume formula, a $60\%$ increase in radius scales the cross-sectional area by a factor of $1.6^2 = 2.56$.

      :::tabs

      == tab: Solving the question with Algebra
      Set the volume of cylinder Y equal to the volume of cylinder X and cancel the shared variables $\pi$, $r^2$, and $h$.

      :::derivation
      == step: Express Cylinder Y's Dimensions as Multipliers
      -- why: Increasing by $60\%$ multiplies $r$ by $1.60$, while decreasing by $p\%$ multiplies $h$ by $\left(1 - \dfrac{p}{100}\right)$.
      $$
      \begin{aligned}
      r_Y &= \mathbf{\color{#2563eb}{1.6}}r \\
      h_Y &= \mathbf{\color{#d97706}{\left(1 - \frac{p}{100}\right)}}h
      \end{aligned}
      $$

      == step: Equate the Two Cylinder Volumes
      -- why: Substitute $r_Y$ and $h_Y$ into $V_Y = \pi r_Y^2 h_Y$ and set it equal to $V_X = \pi r^2 h$.
      $$
      \begin{aligned}
      \pi (\mathbf{\color{#2563eb}{1.6}}r)^2 \mathbf{\color{#d97706}{\left(1 - \frac{p}{100}\right)}}h &= \pi r^2 h \\
      \mathbf{\color{#2563eb}{2.56}} \pi r^2 h \mathbf{\color{#d97706}{\left(1 - \frac{p}{100}\right)}} &= \pi r^2 h
      \end{aligned}
      $$

      == step: Cancel Common Factors and Isolate the Height Multiplier
      -- why: Divide both sides by $\pi r^2 h$ to isolate the remaining height multiplier.
      $$
      \begin{aligned}
      \mathbf{\color{#2563eb}{2.56}} \mathbf{\color{#d97706}{\left(1 - \frac{p}{100}\right)}} &= 1 \\
      \mathbf{\color{#d97706}{1 - \frac{p}{100}}} &= \frac{1}{\mathbf{\color{#2563eb}{2.56}}} = 0.390625
      \end{aligned}
      $$

      == step: Solve for p
      -- why: Subtract the remaining height fraction ($0.390625$) from $1$ to find the percentage decrease, then multiply by $100$.
      $$
      \begin{aligned}
      \frac{p}{100} &= 1 - 0.390625 = 0.609375 \\
      p &= 60.9375 \approx \mathbf{61}
      \end{aligned}
      $$
      :::

      == tab: Shortcut Strategy
      When a geometry or percent-change problem gives **only relative percentages** and no fixed measurements, plug in $1$ (or $10$) for the original dimensions to bypass algebraic variables completely.

      :::derivation
      == step: Choose Unit Dimensions for Cylinder X
      -- why: Setting $r = 1$ and $h = 1$ keeps the initial volume clean and easy to compare.
      $$
      \begin{aligned}
      r_X &= 1, \quad h_X = 1 \\
      V_X &= \pi(1)^2(1) = \mathbf{\color{#2563eb}{\pi}}
      \end{aligned}
      $$

      == step: Apply the 60% Radius Increase to Cylinder Y
      -- why: Increase $r_X = 1$ by $60\%$ to get $r_Y = 1.6$, and set $V_Y$ equal to $V_X = \pi$.
      $$
      \begin{aligned}
      V_Y = \pi(\mathbf{\color{#2563eb}{1.6}})^2 h_Y &= V_X \\[.3cm]
      \pi(1.6)^2 h_Y &= \mathbf{\color{#2563eb}{\pi}} \\[.3cm]
      2.56h_Y &= 1 \\[.1cm]
      h_Y &= \frac{1}{\mathbf{\color{#2563eb}{2.56}}} \approx \mathbf{\color{#d97706}{0.3906}}
      \end{aligned}
      $$

      == step: Read Off the Percentage Decrease
      -- why: Because the original height was $1$ ($100\%$), subtract the new height ($39.06\%$) from $100\%$.
      $$
      \begin{aligned}
      p &= 100\% - \mathbf{\color{#d97706}{39.06\%}} = 60.94\% \approx \mathbf{61}
      \end{aligned}
      $$
      :::

      == tab: Applying DESMOS
      Because $r$ and $h$ cancel out completely, you can assign clean unit values ($r = 1$ and $h = 1$) and use Desmos to solve directly for $p$.

      1. In line 1, calculate the new height multiplier: `1 / 1.6^2` (outputs `0.390625`).
      2. In line 2, convert that multiplier into a percentage decrease: `100 * (1 - 1 / 1.6^2)` (outputs **`60.9375`**, which rounds to **`61`**).

      :::desmos
      {
        "bounds": { "left": -10, "right": 100, "bottom": -10, "top": 100 },
        "expressions": [
          { "id": "mult", "latex": "\\frac{1}{1.6^2}", "color": "#2563eb" },
          { "id": "pct", "latex": "100\\left(1 - \\frac{1}{1.6^2}\\right)", "color": "#d97706" }
        ],
        "caption": "Line 1 finds the remaining height multiplier (0.390625), and Line 2 converts it directly to the percentage decrease p = 60.94%."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $39$:** *Complement Trap.* Reports the **remaining** percentage of height ($39.06\%$) rather than the percentage **decrease** ($100\% - 39.06\% \approx 61\%$).
      * **(B) $60$:** *Linear Scaling Trap.* Assumes a $60\%$ increase in radius is canceled out by an equal $60\%$ decrease in height, forgetting that the radius is **squared** in the volume formula.
      * **(C) $61$:** **Correct.** Evaluates $100\left(1 - \dfrac{1}{1.6^2}\right) = 60.9375\%$, which is closest to $61$.
      * **(D) $75$:** *Wrong Exponent / Rounding Trap.* Approximates $1.6^2$ loosely as $4$ (as if the radius doubled) and computes $1 - \dfrac{1}{4} = 75\%$.
    options:
      - id: "A"
        text: "$39$"
      - id: "B"
        text: "$60$"
      - id: "C"
        text: "$61$"
      - id: "D"
        text: "$75$"
  - id: "sat-t1-m2h-q4"
    questionNumber: 4
    questionType: "MC"
    correctAnswer: "C"
    domain: "Algebra"
    skill: "Linear Functions"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Two runners, Elena and Marcus, run along the same $24$-kilometer trail. Marcus starts the run $15$ minutes before Elena. Marcus runs at a constant speed of $8$ kilometers per hour, while Elena runs at a constant speed of $12$ kilometers per hour. When Elena overtakes Marcus, how many kilometers are both runners from the end of the trail?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the remaining distance **from the end of the $24$-kilometer trail** when Elena catches up to Marcus. Make sure to convert Marcus's $15$-minute head start into hours first, solve for the meeting point from the start, and then subtract that distance from $24\text{ km}$.

      :::tabs

      == tab: Solving the question with DESMOS
      Because both runners move at constant speeds, graphing their distance-time equations in Desmos immediately reveals the intersection point where Elena overtakes Marcus.

      Let $x = \text{hours since Elena started}$ and $y = \text{distance from the start (in km)}$. Since $15\text{ minutes} = \dfrac{15}{60} = 0.25\text{ hours}$, enter:
      * **Marcus:** $y = 8(x + 0.25)$
      * **Elena:** $y = 12x$

      Click the intersection point at $(0.5, 6)$ to see they meet **$6\text{ km}$** from the start, then evaluate `24 - 6` in line 3 to get **$18$**.

      :::desmos
      {
        "bounds": { "left": -0.2, "right": 2.2, "bottom": -2, "top": 26 },
        "expressions": [
          { "id": "marcus", "latex": "y = 8(x + 0.25)", "color": "#2563eb" },
          { "id": "elena", "latex": "y = 12x", "color": "#16a34a" },
          { "id": "meet", "latex": "(0.5, 6)", "color": "#dc2626", "label": "(0.5, 6)", "showLabel": true },
          { "id": "rem", "latex": "24 - 6", "color": "#444444" }
        ],
        "caption": "Marcus's head-start line (blue) and Elena's line (green) intersect at (0.5, 6). Subtracting 6 km from the 24 km trail gives 18 km."
      }
      :::

      == tab: Solving the question with Algebra
      Set up linear distance equations ($d = rt$) in consistent units (kilometers and hours), equate them to find the overtaking time, and subtract from the total trail length.

      :::derivation
      == step: Convert Units and Write Distance Equations
      -- why: Convert $15\text{ minutes}$ to $\dfrac{15}{60} = 0.25\text{ hours}$. Let $t$ be Elena's running time in hours; Marcus runs for $(t + 0.25)$ hours.
      $$
      \begin{aligned}
      D_{\text{Marcus}} &= \mathbf{\color{#2563eb}{8(t + 0.25) = 8t + 2}} \\
      D_{\text{Elena}} &= \mathbf{\color{#d97706}{12t}}
      \end{aligned}
      $$

      == step: Solve for the Overtaking Time $t$
      -- why: Elena overtakes Marcus when both runners are the exact same distance from the starting line.
      $$
      \begin{aligned}
      \mathbf{\color{#d97706}{12t}} &= \mathbf{\color{#2563eb}{8t + 2}} \\
      4t &= 2 \\
      t &= \mathbf{\color{#d97706}{0.5\text{ hours}}}
      \end{aligned}
      $$

      == step: Find Distance from the End of the Trail
      -- why: Substitute $t = 0.5$ to find the distance from the start, then subtract from $24\text{ km}$ to answer the target question.
      $$
      \begin{aligned}
      D_{\text{start}} &= 12(\mathbf{\color{#d97706}{0.5}}) = 6\text{ km} \\
      D_{\text{end}} &= 24 - 6 = \mathbf{18\text{ km}}
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** In his $15$-minute ($0.25\text{ hr}$) head start, Marcus gets $8 \times 0.25 = 2\text{ km}$ ahead. Elena closes that gap at $12 - 8 = 4\text{ km/h}$, so she catches him in $\dfrac{2\text{ km}}{4\text{ km/h}} = 0.5\text{ hours}$—having run $12 \times 0.5 = 6\text{ km}$, leaving $24 - 6 = \mathbf{18\text{ km}}$ to the finish.

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $6$:** *Wrong Target Trap.* Reports the distance from the **starting line** ($6\text{ km}$) instead of the remaining distance to the **end of the trail** ($24 - 6 = 18\text{ km}$).
      * **(B) $12$:** *Midpoint / Speed Trap.* Confuses Elena's speed ($12\text{ km/h}$) or half the trail length ($12\text{ km}$) with the remaining distance.
      * **(C) $18$:** **Correct.** Finds they meet $6\text{ km}$ into the trail and subtracts $24 - 6 = 18\text{ km}$.
      * **(D) $20$:** *Unit Conversion Trap.* Fails to convert $15\text{ minutes}$ to hours properly (or miscalculates the head start as $4\text{ km}$ instead of $2\text{ km}$, yielding $24 - 4 = 20$).
    options:
      - id: "A"
        text: "$6$"
      - id: "B"
        text: "$12$"
      - id: "C"
        text: "$18$"
      - id: "D"
        text: "$20$"

  - id: "sat-t1-m2h-q5"
    questionNumber: 5
    questionType: "MC"
    correctAnswer: "B"
    domain: "Algebra"
    skill: "Linear Inequalities in Two Variables"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      In the $xy$-plane, the point $(p, q)$ lies in the solution set to the system of inequalities below:
      $$
      \begin{aligned}
      y &\le -2x + 14 \\
      y &\le 3x - 11
      \end{aligned}
      $$
      What is the maximum possible value of $q$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the maximum possible $y$-coordinate ($q$) of any point $(p, q)$ that satisfies **both** linear inequalities simultaneously. Because $y$ is bounded from above ($\le$) by two lines with opposite slopes, the solution region forms a downward-opening wedge whose highest point (maximum $y$-value) occurs right at the **intersection of the two boundary lines**.

      :::tabs

      == tab: Solving the question with DESMOS
      Graphing a system of inequalities in Desmos immediately shows the overlapping shaded region and lets you click its highest vertex directly.

      1. Enter `y <= -2x + 14` in line 1.
      2. Enter `y <= 3x - 11` in line 2.
      3. Inspect the doubly shaded region at the bottom: its highest corner (vertex) is at **$(5, 4)$**. Since $q$ represents the $y$-coordinate, the maximum value of $q$ is **$4$**.

      :::desmos
      {
        "bounds": { "left": -4, "right": 14, "bottom": -12, "top": 18 },
        "expressions": [
          { "id": "ineq1", "latex": "y \\le -2x + 14", "color": "#2563eb" },
          { "id": "ineq2", "latex": "y \\le 3x - 11", "color": "#16a34a" },
          { "id": "vertex", "latex": "(5, 4)", "color": "#dc2626", "label": "(5, 4)", "showLabel": true }
        ],
        "caption": "The overlapping shaded region sits beneath both boundary lines, reaching its highest point (maximum y-value) at the vertex (5, 4)."
      }
      :::

      == tab: Solving the question with Algebra
      To find the peak of the feasible region algebraically, set the two boundary equations equal to locate their intersection point $(p, q)$.

      :::derivation
      == step: Find the $x$-Coordinate of the Boundary Intersection
      -- why: The two boundary lines $y = -2x + 14$ and $y = 3x - 11$ meet at the peak of the solution set. Set them equal to solve for $x$.
      $$
      \begin{aligned}
      \mathbf{\color{#2563eb}{-2x + 14}} &= \mathbf{\color{#d97706}{3x - 11}} \\
      14 + 11 &= 3x + 2x \\
      25 &= 5x \\
      x &= \mathbf{\color{#2563eb}{5}}
      \end{aligned}
      $$

      == step: Substitute $x = 5$ to Find the Maximum $y$-Value ($q$)
      -- why: Plug $x = 5$ into either boundary equation to find the $y$-coordinate of the highest point in the solution region.
      $$
      \begin{aligned}
      y &= \mathbf{\color{#2563eb}{-2}}(\mathbf{\color{#2563eb}{5}}) + 14 \\
      &= -10 + 14 = \mathbf{4}
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Whenever two inequalities both take the form $y \le m_1 x + b_1$ and $y \le m_2 x + b_2$ with opposite-sign slopes ($m_1 < 0 < m_2$), $y$ is always maximized at the intersection of the two lines—you never need to test corner points separately.

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $2$:** *Sign / Arithmetic Trap.* Result of subtracting $14 - 11 = 3$ or miscalculating $-2(5) + 14$ when substituting $x = 5$.
      * **(B) $4$:** **Correct.** Finds the intersection vertex $(5, 4)$ of the two upper boundaries and reports the $y$-coordinate $q = 4$.
      * **(C) $5$:** *Wrong Target Trap.* Reports the $x$-coordinate ($p = 5$) of the intersection point instead of the $y$-coordinate ($q = 4$).
      * **(D) $14$:** *Single-Constraint Trap.* Uses the $y$-intercept $(0, 14)$ of the first inequality without checking the second inequality—at $x = 0$, the second inequality requires $y \le 3(0) - 11 = -11$, so $(0, 14)$ is outside the solution set.
    options:
      - id: "A"
        text: "$2$"
      - id: "B"
        text: "$4$"
      - id: "C"
        text: "$5$"
      - id: "D"
        text: "$14$"

  - id: "sat-t1-m2h-q6"
    questionNumber: 6
    questionType: "MC"
    correctAnswer: "D"
    domain: "Advanced Math"
    skill: "Nonlinear Functions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The quadratic function $f$ is defined by $f(x) = -2(x - h)^2 + k$, where $h$ and $k$ are positive constants. The graph of $y = f(x)$ passes through the points $(0, -14)$ and $(8, -14)$. If the maximum value of $f(x)$ is $18$, what is the value of $f(5)$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Evaluate $f(5)$ for a downward-opening parabola written in **vertex form**, $f(x) = -2(x - h)^2 + k$. Use the symmetry of two equal-height points to find the vertex's $x$-coordinate ($h$), use the maximum value to identify the vertex's $y$-coordinate ($k$), and then plug in $x = 5$.

      :::tabs

      == tab: Solving the question with Algebra
      Because a parabola is symmetric across the vertical line $x = h$, any two points with the same $y$-value sit equidistant on either side of $h$.

      :::derivation
      == step: Find h Using Parabola Symmetry
      -- why: The points $(0, -14)$ and $(8, -14)$ share the same $y$-coordinate, so $h$ is the midpoint of their $x$-coordinates.
      $$
      \begin{aligned}
      h &= \dfrac{\mathbf{\color{#2563eb}{0}} + \mathbf{\color{#2563eb}{8}}}{2} = \mathbf{\color{#2563eb}{4}}
      \end{aligned}
      $$

      == step: Identify k from the Maximum Value
      -- why: Since the leading coefficient $-2$ is less than $0$, the parabola opens downward and reaches its maximum at the vertex $(h, k)$.
      $$
      \begin{aligned}
      k &= \mathbf{\color{#d97706}{18}}
      \end{aligned}
      $$

      == step: Write the Complete Function and Evaluate f(5)
      -- why: Substitute $h = 4$ and $k = 18$ into $f(x) = -2(x - h)^2 + k$, then evaluate at $x = 5$.
      $$
      \begin{aligned}
      f(x) &= -2(x - \mathbf{\color{#2563eb}{4}})^2 + \mathbf{\color{#d97706}{18}} \\
      f(5) &= -2(5 - \mathbf{\color{#2563eb}{4}})^2 + \mathbf{\color{#d97706}{18}} \\
      &= -2(1)^2 + 18 \\
      &= -2 + 18 = \mathbf{16}
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Once you know the vertex is at $(4, 18)$ and the leading coefficient is $a = -2$, any point $1$ unit away from the axis of symmetry ($x = 5$ is $1$ unit right of $x = 4$) drops by $a(1)^2 = -2$ from the peak: $18 - 2 = \mathbf{16}$.

      == tab: Applying DESMOS
      Once you determine $h = \dfrac{0 + 8}{2} = 4$ from symmetry and $k = 18$ from the maximum value, define the function directly in Desmos to verify the given points and evaluate $f(5)$.

      1. In line 1, enter `f(x) = -2(x - 4)^2 + 18`.
      2. Confirm the graph passes through $(0, -14)$ and $(8, -14)$ with a peak at $(4, 18)$.
      3. In line 2, enter `f(5)` to read off **`16`** directly.

      :::desmos
      {
        "bounds": { "left": -3, "right": 11, "bottom": -18, "top": 22 },
        "expressions": [
          { "id": "parabola", "latex": "f(x) = -2(x - 4)^2 + 18", "color": "#2563eb" },
          { "id": "sym1", "latex": "(0, -14)", "color": "#444444", "label": "(0, -14)", "showLabel": true },
          { "id": "sym2", "latex": "(8, -14)", "color": "#444444", "label": "(8, -14)", "showLabel": true },
          { "id": "vertex", "latex": "(4, 18)", "color": "#d97706", "label": "(4, 18)", "showLabel": true },
          { "id": "target", "latex": "(5, 16)", "color": "#dc2626", "label": "(5, 16)", "showLabel": true }
        ],
        "caption": "The parabola passes through (0, -14) and (8, -14), peaks at vertex (4, 18), and passes through (5, 16)."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $10$:** *Wrong Shift Trap.* Evaluates $f(6)$ instead of $f(5)$ (moving $2$ units from the vertex: $-2(2)^2 + 18 = 10$).
      * **(B) $12$:** *Sign / Arithmetic Trap.* Multiplies $-2(1)^2$ as $-6$ or subtracts $18 - 6 = 12$.
      * **(C) $14$:** *Sign / Constant Trap.* Drops the negative sign on $-14$ from the given points $(0, -14)$ and $(8, -14)$, or miscomputes $18 - 4 = 14$.
      * **(D) $16$:** **Correct.** Finds the vertex $(4, 18)$ and evaluates $f(5) = -2(5 - 4)^2 + 18 = 16$.
    options:
      - id: "A"
        text: "$10$"
      - id: "B"
        text: "$12$"
      - id: "C"
        text: "$14$"
      - id: "D"
        text: "$16$"
  - id: "sat-t1-m2h-q7"
    questionNumber: 7
    questionType: "MC"
    correctAnswer: "C"
    domain: "Advanced Math"
    skill: "Nonlinear Functions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The population of a certain bacteria culture triples every $4$ hours. If the initial population of the culture is $N_0$, the population $P(t)$ after $t$ hours can be modeled by the equation $P(t) = N_0 (1 + r)^{\dfrac{t}{12}}$, where $r$ is a constant. What is the value of $r$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the constant $r$ by rewriting an **exponential growth model** from a $4$-hour tripling period into an equivalent $12$-hour growth period, $P(t) = N_0(1 + r)^{\dfrac{t}{12}}$. Pay close attention to the structure $(1 + r)$: once you find the $12$-hour growth factor, you must still subtract $1$ to isolate $r$.

      :::tabs

      == tab: Solving the question with Algebra
      Write the standard exponential model for tripling every $4$ hours, then use exponent laws to rewrite the base with an exponent of $\dfrac{t}{12}$.

      :::derivation
      == step: Write the 4-Hour Tripling Model
      -- why: Starting from $N_0$, multiplying by $3$ every $4$ hours gives an exponent of $\dfrac{t}{4}$.
      $$
      \begin{aligned}
      P(t) &= N_0 (\mathbf{\color{#2563eb}{3}})^{\dfrac{t}{4}}
      \end{aligned}
      $$

      == step: Rewrite the Exponent to Match t/12
      -- why: Express $\dfrac{t}{4}$ as $3 \cdot \dfrac{t}{12}$ and apply the power-of-a-power rule $\left(a^m\right)^n = a^{mn}$.
      $$
      \begin{aligned}
      N_0 (\mathbf{\color{#2563eb}{3}})^{\dfrac{t}{4}} &= N_0 (\mathbf{\color{#2563eb}{3}})^{3 \cdot \dfrac{t}{12}} \\
      &= N_0 \left(\mathbf{\color{#2563eb}{3^3}}\right)^{\dfrac{t}{12}} \\
      &= N_0 (\mathbf{\color{#d97706}{27}})^{\dfrac{t}{12}}
      \end{aligned}
      $$

      == step: Equate Bases and Solve for r
      -- why: Compare $N_0 (\mathbf{\color{#d97706}{27}})^{\dfrac{t}{12}}$ directly with $N_0 (1 + r)^{\dfrac{t}{12}}$ and subtract $1$.
      $$
      \begin{aligned}
      1 + r &= \mathbf{\color{#d97706}{27}} \\
      r &= \mathbf{\color{#d97706}{27}} - 1 = \mathbf{26}
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Plug in $t = 12$ hours so the target exponent $\dfrac{t}{12}$ becomes $\dfrac{12}{12} = 1$. Since the bacteria triples every $4$ hours, in $12$ hours it triples $\dfrac{12}{4} = 3$ times ($3 \times 3 \times 3 = 27$), so $1 + r = 27 \implies r = \mathbf{26}$.

      == tab: Applying DESMOS
      Set $N_0 = 1$ and evaluate the population at $t = 12$ hours—the exact time when the exponent $\dfrac{t}{12}$ simplifies to $1$.

      1. In line 1, compute the $12$-hour growth factor: `3^(12/4)` (outputs `27`).
      2. Since $1 + r = 27$, enter `3^(12/4) - 1` in line 2 to output **`26`** directly.
      3. Optionally graph `y = 3^(x/4)` and `y = (1 + 26)^(x/12)` to verify that the two curves overlap completely for all $x$.

      :::desmos
      {
        "bounds": { "left": -1, "right": 14, "bottom": -2, "top": 32 },
        "expressions": [
          { "id": "factor", "latex": "3^{\\frac{12}{4}}", "color": "#2563eb" },
          { "id": "r_val", "latex": "3^{\\frac{12}{4}} - 1", "color": "#d97706" },
          { "id": "curve1", "latex": "y = 3^{\\frac{x}{4}}", "color": "#2563eb" },
          { "id": "curve2", "latex": "y = (1 + 26)^{\\frac{x}{12}}", "color": "#16a34a" }
        ],
        "caption": "Both exponential curves overlap identically across all t, and evaluating 3^(12/4) - 1 gives r = 26."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $8$:** *Linear Scaling + Offset Trap.* Multiplies $3 \times 3 = 9$ instead of cubing $3^3 = 27$, then subtracts $1$ to get $8$.
      * **(B) $9$:** *Linear Scaling Trap.* Multiplies the tripling factor $3$ by the $3$ time intervals ($3 \times 3 = 9$) instead of raising $3$ to the $3\text{rd}$ power ($3^3 = 27$).
      * **(C) $26$:** **Correct.** Finds the $12$-hour growth factor $3^3 = 27$ and solves $1 + r = 27 \implies r = 26$.
      * **(D) $27$:** *Wrong Target Trap.* Reports the $12$-hour growth factor ($1 + r = 27$) instead of subtracting $1$ to solve for $r$.
    options:
      - id: "A"
        text: "$8$"
      - id: "B"
        text: "$9$"
      - id: "C"
        text: "$26$"
      - id: "D"
        text: "$27$"

  - id: "sat-t1-m2h-q8"
    questionNumber: 8
    questionType: "MC"
    correctAnswer: "A"
    domain: "Algebra"
    skill: "Linear Equations in Two Variables"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      In the $xy$-plane, line $k$ passes through the points $(0, 2)$ and $(c, 0)$, where $c > 1$. Line $\ell$ is perpendicular to line $k$ and passes through the point $(0, -15)$. If lines $k$ and $\ell$ intersect at the point $(4, p)$, what is the value of $c$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the $x$-intercept $c$ ($c > 1$) of line $k$ using **perpendicular line slopes** and a shared intersection point $(4, p)$. Express both lines in slope-intercept form ($y = mx + b$) in terms of $c$, evaluate both at $x = 4$ to set their $y$-coordinates ($p$) equal, and solve for $c$.

      :::tabs

      == tab: Solving the question with Algebra
      Write equations for lines $k$ and $\ell$ in terms of $c$, then equate their outputs at $x = 4$.

      :::derivation
      == step: Find the Equation of Line k
      -- why: Use $(0, 2)$ and $(c, 0)$ to find the slope $m_k$, then use the $y$-intercept $(0, 2)$ to write line $k$ in slope-intercept form.
      $$
      \begin{aligned}
      m_k = \dfrac{0 - 2}{c - 0} &= \mathbf{\color{#2563eb}{-\dfrac{2}{c}}} \\[.3cm]
      \text{Line } k: \quad y &= \mathbf{\color{#2563eb}{-\dfrac{2}{c}}}x + 2
      \end{aligned}
      $$

      == step: Find the Equation of Perpendicular Line l
      -- why: Perpendicular lines have opposite-reciprocal slopes. Flip and negate $m_k$, then use the $y$-intercept $(0, -15)$.
      $$
      \begin{aligned}
      m_\ell = -\dfrac{1}{\mathbf{\color{#2563eb}{-\dfrac{2}{c}}}} &= \mathbf{\color{#d97706}{\dfrac{c}{2}}} \\[.3cm]
      \text{Line } \ell: \quad y &= \mathbf{\color{#d97706}{\dfrac{c}{2}}}x - 15
      \end{aligned}
      $$

      == step: Equate $y$-Values at the Intersection (4, p)
      -- why: Both lines pass through $(4, p)$, so plugging $x = 4$ into each equation yields the same value $p$.
      $$
      \begin{aligned}
      \mathbf{\color{#2563eb}{-\dfrac{2}{c}}}(4) + 2 &= \mathbf{\color{#d97706}{\dfrac{c}{2}}}(4) - 15 \\[.3cm]
      -\dfrac{8}{c} + 2 &= 2c - 15
      \end{aligned}
      $$

      == step: Clear the Denominator and Solve for c
      -- why: Multiply every term by $c$ to form a quadratic equation, factor, and select the root where $c > 1$.
      $$
      \begin{aligned}
      -8 + 2c &= 2c^2 - 15c \\
      2c^2 - 17c + 8 &= 0 \\
      (2c - 1)(c - 8) &= 0
      \end{aligned}
      $$
      Since $c > 1$, discard $c = \dfrac{1}{2}$ and take $c = \mathbf{8}$.
      :::

      **Shortcut Insight:** Notice that the segment from $(0, 2)$ to $(4, p)$ on line $k$ and the segment from $(0, -15)$ to $(4, p)$ on line $\ell$ form a **right triangle** whose hypotenuse runs vertically along the $y$-axis from $(0, -15)$ to $(0, 2)$ (length $17$), with altitude $x = 4$ to the right angle at $(4, p)$. By the geometric mean altitude theorem, $4^2 = (2 - p)(p - (-15)) \implies 16 = (2 - p)(p + 15)$, which gives $p = 1$ immediately—then $(0, 2)$ to $(4, 1)$ drops $1$ unit every $4$ units right, hitting the $x$-axis at $c = \mathbf{8}$.

      == tab: Applying DESMOS
      You can use a **slider** for $c$ in Desmos to watch lines $k$ and $\ell$ move until they intersect directly at $x = 4$.

      1. Enter `y = (-2/c)x + 2` in line 1 and accept the slider for `c` (set `c > 1`).
      2. Enter `y = (c/2)x - 15` in line 2.
      3. Enter `x = 4` in line 3 as a vertical guide line, then adjust `c` (or test the answer choices) until both lines meet on `x = 4`—which occurs at **`c = 8`**, intersecting at $(4, 1)$.

      :::desmos
      {
        "bounds": { "left": -2, "right": 11, "bottom": -16, "top": 6 },
        "expressions": [
          { "id": "c_val", "latex": "c = 8", "color": "#444444" },
          { "id": "line_k", "latex": "y = -\\frac{2}{c}x + 2", "color": "#2563eb" },
          { "id": "line_l", "latex": "y = \\frac{c}{2}x - 15", "color": "#16a34a" },
          { "id": "guide", "latex": "x = 4", "color": "#9ca3af" },
          { "id": "pt", "latex": "(4, 1)", "color": "#dc2626", "label": "(4, 1)", "showLabel": true }
        ],
        "caption": "When c = 8, line k (blue) and perpendicular line l (green) intersect right on the vertical line x = 4 at (4, 1)."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $8$:** **Correct.** Solves $2c^2 - 17c + 8 = 0$ with $c > 1$ to get $c = 8$, giving intersection $(4, 1)$.
      * **(B) $6$:** *Arithmetic / Factoring Trap.* Result of miscombining constants when clearing the denominator ($-8 + 2c = 2c^2 - 15c$).
      * **(C) $4$:** *Wrong Target Trap.* Reports the $x$-coordinate of the intersection point $(4, 1)$ instead of the $x$-intercept $c$ of line $k$.
      * **(D) $2$:** *Wrong Target Trap.* Reports the $y$-intercept of line $k$ from $(0, 2)$ rather than its $x$-intercept $c$.
    options:
      - id: "A"
        text: "$8$"
      - id: "B"
        text: "$6$"
      - id: "C"
        text: "$4$"
      - id: "D"
        text: "$2$"

  - id: "sat-t1-m2h-q9"
    questionNumber: 9
    questionType: "MC"
    correctAnswer: "C"
    domain: "Advanced Math"
    skill: "Equivalent Expressions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      For constants $a$ and $b$, the equation
      $$(ax + 4)(bx - 3) = 15x^2 + kx - 12$$
      is true for all real values of $x$. If $a + b = 8$ and $a > b$, what is the value of $k$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the middle coefficient $k$ in a **polynomial identity** that holds true for all real values of $x$. Expand the product on the left, match the $x^2$-coefficients to find $ab$, pair that with $a + b = 8$ and $a > b$ to determine $a$ and $b$, and then compute $k$ from the $x$-coefficient.

      :::tabs

      == tab: Solving the question with Algebra
      Expand $(ax + 4)(bx - 3)$ and match corresponding powers of $x$ on both sides of the equation.

      :::derivation
      == step: Expand the Left-Hand Side and Group Like Terms
      -- why: Multiply the two binomials and combine the $x$-terms so both sides are in standard quadratic form.
      $$
      \begin{aligned}
      (ax + 4)(bx - 3) &= abx^2 - 3ax + 4bx - 12 \\
      &= \mathbf{\color{#2563eb}{ab}}x^2 + \mathbf{\color{#d97706}{(4b - 3a)}}x - 12
      \end{aligned}
      $$

      == step: Match Coefficients to Find a and b
      -- why: Equate the $x^2$-coefficients to get $ab = 15$, then find two numbers that multiply to $15$ and add to $8$ with $a > b$.
      $$
      \begin{aligned}
      \mathbf{\color{#2563eb}{ab}} &= \mathbf{\color{#2563eb}{15}} \\
      a + b &= 8
      \end{aligned}
      $$
      The factor pair of $15$ that sums to $8$ is $5$ and $3$. Because $a > b$, assign:
      $$
      a = \mathbf{\color{#2563eb}{5}}, \quad b = \mathbf{\color{#d97706}{3}}
      $$

      == step: Substitute a and b to Solve for k
      -- why: Equate the $x$-coefficients ($k = 4b - 3a$) and plug in $a = 5$ and $b = 3$.
      $$
      \begin{aligned}
      k &= 4b - 3a \\
      &= 4(\mathbf{\color{#d97706}{3}}) - 3(\mathbf{\color{#2563eb}{5}}) \\
      &= 12 - 15 = \mathbf{-3}
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Once you spot $ab = 15$ and $a + b = 8$ with $a > b$, immediately write the factored form $(5x + 4)(3x - 3)$—or even faster, plug $x = 1$ into $(5x + 4)(3x - 3) = 15x^2 + kx - 12$: $(9)(0) = 15 + k - 12 \implies 0 = 3 + k \implies k = \mathbf{-3}$.

      == tab: Applying DESMOS
      Once you identify $a = 5$ and $b = 3$ from $ab = 15$, $a + b = 8$, and $a > b$, you can verify the identity and find $k$ visually in Desmos using a slider.

      1. Enter `y = (5x + 4)(3x - 3)` in line 1.
      2. Enter `y = 15x^2 + kx - 12` in line 2 and accept the slider for `k`.
      3. Adjust `k` (or test the answer choices) until the two parabolas overlap completely—which occurs at **`k = -3`**.

      :::desmos
      {
        "bounds": { "left": -3, "right": 3, "bottom": -16, "top": 20 },
        "expressions": [
          { "id": "k_val", "latex": "k = -3", "color": "#444444" },
          { "id": "lhs", "latex": "y = (5x + 4)(3x - 3)", "color": "#2563eb" },
          { "id": "rhs", "latex": "y = 15x^2 + kx - 12", "color": "#16a34a" }
        ],
        "caption": "With k = -3, the expanded quadratic y = 15x^2 - 3x - 12 matches y = (5x + 4)(3x - 3) identically across all x."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $-15$:** *Sign / Distribution Trap.* Multiplies $-3a = -15$ correctly, but forgets to add the $+4b = +12$ cross-term.
      * **(B) $-7$:** *Sign Reversal Trap.* Subtracts both cross-terms instead of adding ($-12 - (-5)$ or $-4(3) + 5 = -7$).
      * **(C) $-3$:** **Correct.** Identifies $a = 5$ and $b = 3$, then evaluates $k = 4(3) - 3(5) = -3$.
      * **(D) $11$:** *Swapped Variables Trap.* Ignores the constraint $a > b$ and sets $a = 3, b = 5$, yielding $k = 4(5) - 3(3) = 11$.
    options:
      - id: "A"
        text: "$-15$"
      - id: "B"
        text: "$-7$"
      - id: "C"
        text: "$-3$"
      - id: "D"
        text: "$11$"
  - id: "sat-t1-m2h-q10"
    questionNumber: 10
    questionType: "MC"
    correctAnswer: "B"
    domain: "Problem-Solving and Data Analysis"
    skill: "One-variable data: distributions and measures of center and spread"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Data set A consists of $27$ distinct integers with a mean of $m_A$, a median of $M_A$, and a range of $R_A$. Data set B is formed by removing the minimum value and the maximum value from data set A. Which of the following statements must be true?
      
      - I. The median of data set B is equal to $M_A$.
      - II. The range of data set B is strictly less than $R_A$.
      - III. The mean of data set B is equal to $m_A$.
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine which of the three statements about **median, range, and mean** *must* hold true when the single minimum and single maximum values are removed from a set of $27$ **distinct** integers. Remember: in "must be true" questions, a statement only holds if it works for *every* possible valid data set—even heavily skewed ones.

      :::tabs

      == tab: Solving the question with Algebra
      Order the $27$ distinct integers from least to greatest as $x_1 < x_2 < \dots < x_{27}$, and test each statistical measure before and after trimming $x_1$ and $x_{27}$.

      :::derivation
      == step: Evaluate Statement I (Median)
      -- why: Locate the middle position of the ordered list before and after removing one value from each end.
      For $27$ ordered values, the median $M_A$ sits at position $\dfrac{27 + 1}{2} = \mathbf{\color{#2563eb}{14}}$, so $M_A = x_{14}$.
      Removing $x_1$ and $x_{27}$ leaves $25$ ordered values ($x_2$ through $x_{26}$), whose median sits at position $\dfrac{25 + 1}{2} = 13$ of the new list—which is still $\mathbf{\color{#2563eb}{x_{14}}}$.
      Thus, Statement I **must be true**.

      == step: Evaluate Statement II (Range)
      -- why: Compare $\text{Range} = \text{Max} - \text{Min}$ using the fact that all $27$ integers are **distinct** (no ties at the ends).
      $$
      \begin{aligned}
      R_A &= \mathbf{\color{#2563eb}{x_{27} - x_1}} \\
      R_B &= \mathbf{\color{#d97706}{x_{26} - x_2}}
      \end{aligned}
      $$
      Because the integers are distinct, $x_{26} < x_{27}$ and $x_2 > x_1$. Subtracting a strictly larger minimum from a strictly smaller maximum guarantees $\mathbf{\color{#d97706}{R_B}} < \mathbf{\color{#2563eb}{R_A}}$.
      Thus, Statement II **must be true**.

      == step: Evaluate Statement III (Mean)
      -- why: Removing two values keeps the mean unchanged *only* if the average of those two removed values equals $m_A$.
      $$
      \text{Mean unchanged} \iff \dfrac{x_1 + x_{27}}{2} = m_A
      $$
      If data set A is skewed (for instance, $\{1, 2, 3, \dots, 26, 100\}$), removing the outlier $100$ and $1$ pulls the mean downward, so $m_B \neq m_A$.
      Thus, Statement III **is not necessarily true**.
      :::

      **Shortcut Insight:** On "must be true" data-set questions, immediately test a small **skewed** model set with the same odd-count structure—such as $A = \{1, 2, 3, 4, 100\}$ trimmed to $B = \{2, 3, 4\}$. Here the median stays $3$ (I is true), the range drops from $99$ to $2$ (II is true), and the mean plunges from $22$ to $3$ (III is false)—locking in **I and II only** in seconds.

      == tab: Applying DESMOS
      You can use Desmos's built-in statistical functions (`mean`, `median`, `max`, `min`) on a compact skewed test list (such as a $5$-element distinct integer list, which mirrors the odd-count behavior of $27$ elements) to verify which properties survive trimming the endpoints.

      1. In line 1, define a skewed list: `A = [1, 2, 3, 4, 20]`.
      2. In line 2, define the trimmed list: `B = [2, 3, 4]`.
      3. Compare `median(A)` vs. `median(B)` (both `3`), `max(A) - min(A)` vs. `max(B) - min(B)` (`19` vs. `2`), and `mean(A)` vs. `mean(B)` (`6` vs. `3`).

      :::desmos
      {
        "bounds": { "left": -2, "right": 22, "bottom": -2, "top": 12 },
        "expressions": [
          { "id": "listA", "latex": "A = [1, 2, 3, 4, 20]", "color": "#2563eb" },
          { "id": "listB", "latex": "B = [2, 3, 4]", "color": "#16a34a" },
          { "id": "med", "latex": "\\operatorname{median}(A) - \\operatorname{median}(B)", "color": "#2563eb" },
          { "id": "rng", "latex": "(\\max(B) - \\min(B)) - (\\max(A) - \\min(A))", "color": "#d97706" },
          { "id": "mn", "latex": "\\operatorname{mean}(A) - \\operatorname{mean}(B)", "color": "#dc2626" }
        ],
        "caption": "Testing a skewed distinct integer list shows the median difference is 0 (I holds), the range decreases by 17 (II holds), and the mean shifts by 3 (III fails)."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) I only:** *Tied Endpoints Trap.* Assumes the minimum or maximum value could be repeated (e.g., $\{1, 1, \dots, 27, 27\}$), forgetting that the prompt specifies $27$ **distinct** integers, which forces the range to strictly decrease.
      * **(B) I and II only:** **Correct.** Trimming both ends preserves the middle term ($x_{14}$) and strictly shrinks the spread between distinct endpoints, while the mean shifts whenever the endpoints aren't symmetric around $m_A$.
      * **(C) II and III only:** *Median Shift Trap.* Mistakenly thinks removing two elements changes the median, while assuming removing both extremes cancels out their effect on the mean.
      * **(D) I, II, and III:** *Symmetry Assumption Trap.* Assumes the data set must be symmetric around its mean so that removing the minimum and maximum leaves the mean unchanged.
    options:
      - id: "A"
        text: "I only"
      - id: "B"
        text: "I and II only"
      - id: "C"
        text: "II and III only"
      - id: "D"
        text: "I, II, and III"

  - id: "sat-t1-m2h-q11"
    questionNumber: 11
    questionType: "MC"
    correctAnswer: "C"
    domain: "Geometry and Trigonometry"
    skill: "Circles"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: true
    stimulus: |
      Two concentric circles in the $xy$-plane share the same center. A chord of the larger circle has length $24$ and is tangent to the smaller circle.
    prompt: |
      What is the area of the region inside the larger circle but outside the smaller circle?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the area of the ring-shaped region (**annulus**) between two concentric circles, $\text{Area} = \pi R^2 - \pi r^2 = \pi(R^2 - r^2)$. You do **not** need to find the individual radii $R$ and $r$—only the value of the combined expression $R^2 - r^2$, which comes directly from the right triangle formed by the tangent chord.

      :::tabs

      == tab: Solving the question with Algebra
      Draw the radius $r$ to the point of tangency and the radius $R$ to one endpoint of the chord to form a right triangle.

      :::derivation
      == step: Bisect the Tangent Chord
      -- why: A radius drawn to a point of tangency is perpendicular to the tangent line, and a perpendicular from the center of a circle bisects any chord.
      
      ![](./assets/dSAT-T1-M2H-Q11EXP.svg)
      $$
      \text{Half-chord length} = \dfrac{24}{2} = \mathbf{\color{#2563eb}{12}}
      $$

      == step: Apply the Pythagorean Theorem to Find Difference of the Squared Radii
      -- why: The inner radius $r$ and the half-chord ($12$) are the legs of a right triangle whose hypotenuse is the outer radius $R$.
      $$
      \begin{aligned}
      r^2 + \mathbf{\color{#2563eb}{12}}^2 &= R^2 \\
      R^2 - r^2 &= \mathbf{\color{#d97706}{144}}
      \end{aligned}
      $$

      == step: Substitute into the Area Formula
      -- why: Factor $\pi$ out of the difference of areas $\pi R^2 - \pi r^2$ and replace $R^2 - r^2$ with $144$.
      $$
      \begin{aligned}
      \text{Area} &= \pi R^2 - \pi r^2 \\
      &= \pi(\mathbf{\color{#d97706}{R^2 - r^2}}) \\
      &= \pi(\mathbf{\color{#d97706}{144}}) = \mathbf{144\pi}
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Because the problem gives **only** the chord length ($24$), the ring's area must be identical for *every* valid pair of concentric circles! Choose the easiest right triangle with leg $12$—the classic $5\text{-}12\text{-}13$ triple ($r = 5, R = 13$)—and compute $\pi(13^2 - 5^2) = \pi(169 - 25) = \mathbf{144\pi}$ in seconds.

      == tab: Applying DESMOS
      Because any valid pair of concentric circles produces the exact same area, you can model the geometry in Desmos centered at $(0, 0)$ using the $5\text{-}12\text{-}13$ right triangle ($r = 5, R = 13$).

      1. Graph the inner circle `x^2 + y^2 = 5^2` and outer circle `x^2 + y^2 = 13^2`.
      2. Plot the horizontal tangent chord `y = 5 {-12 <= x <= 12}` of length $24$, touching the inner circle at $(0, 5)$ and meeting the outer circle at $(-12, 5)$ and $(12, 5)$.
      3. In line 4, evaluate `13^2 - 5^2` to confirm $R^2 - r^2 = \mathbf{144}$, giving an area of **$144\pi$**.

      :::desmos
      {
        "bounds": { "left": -25, "right": 25, "bottom": -16, "top": 16 },
        "expressions": [
          { "id": "outer", "latex": "x^2 + y^2 = 13^2", "color": "#2563eb" },
          { "id": "inner", "latex": "x^2 + y^2 = 5^2", "color": "#16a34a" },
          { "id": "chord", "latex": "y = 5 \\left\\{-12 \\le x \\le 12\\right\\}", "color": "#dc2626" },
          { "id": "leg_r", "latex": "x = 0 \\left\\{0 \\le y \\le 5\\right\\}", "color": "#444444" },
          { "id": "diff", "latex": "13^2 - 5^2", "color": "#d97706" }
        ],
        "caption": "Modeling the concentric circles with r = 5 and R = 13 shows the chord of length 24 tangent at (0, 5) and confirms R^2 - r^2 = 144."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $48\pi$:** *Circumference / Linear Trap.* Multiplies the full chord length $24$ by $2$ ($24 \times 2 = 48$) instead of squaring half the chord.
      * **(B) $72\pi$:** *Halving Error Trap.* Squares half the chord ($12^2 = 144$) and then mistakenly divides by $2$ ($144 \div 2 = 72$).
      * **(C) $144\pi$:** **Correct.** Uses the right triangle formed by $r$, $R$, and half the chord ($12$) to find $R^2 - r^2 = 12^2 = 144$, giving $\text{Area} = 144\pi$.
      * **(D) $576\pi$:** *Forgot to Bisect Chord Trap.* Uses the full chord length ($24^2 = 576$) instead of half the chord length ($12^2 = 144$) in the Pythagorean theorem.
    options:
      - id: "A"
        text: "$48\\pi$"
      - id: "B"
        text: "$72\\pi$"
      - id: "C"
        text: "$144\\pi$"
      - id: "D"
        text: "$576\\pi$"

  - id: "sat-t1-m2h-q12"
    questionNumber: 12
    questionType: "MC"
    correctAnswer: "D"
    domain: "Problem-Solving and Data Analysis"
    skill: "Probability and conditional probability"
    difficulty: "Hard"
    containsGraph: false
    containsChart: true
    containsDiagram: false
    stimulus: |
      The table below summarizes the distribution of $120$ clinical research participants categorized by treatment group and outcome status.

      | | Positive Outcome | No Improvement | Total |
      | :--- | :---: | :---: | :---: |
      | **Treatment A** | $24$ | $24$ | $48$ |
      | **Treatment B** | $k$ | $m$ | $72$ |
      | **Total** | $24 + k$ | $24 + m$ | $120$ |

      A participant is selected at random. The probability that the participant experienced a positive outcome given that the participant received Treatment B is twice the probability that a participant received Treatment A given that the participant experienced a positive outcome.
    prompt: |
      What is the value of $k$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Solve for the missing cell count $k$ by translating two **conditional probabilities** from a two-way table into an algebraic equation. Pay close attention to the word **"given"**: the condition that follows *"given"* determines the **denominator** (the restricted subgroup) of each probability fraction.

      :::tabs

      == tab: Solving the question with DESMOS
      Once you set up the conditional probability equation $\dfrac{k}{72} = 2\left(\dfrac{24}{24 + k}\right)$, graphing both sides in Desmos lets you solve the rational/quadratic equation immediately without factoring large numbers ($3{,}456$).

      1. Enter `y = x / 72` in line 1 (representing $P(\text{Positive} \mid \text{Treatment B})$).
      2. Enter `y = 2 * (24 / (24 + x))` in line 2 (representing $2 \times P(\text{Treatment A} \mid \text{Positive})$).
      3. Click the positive intersection point at $(48, 0.667)$ to read off $k = \mathbf{48}$ directly.

      :::desmos
      {
        "bounds": { "left": -10, "right": 75, "bottom": -0.2, "top": 1.8 },
        "expressions": [
          { "id": "lhs", "latex": "y = \\frac{x}{72}", "color": "#2563eb" },
          { "id": "rhs", "latex": "y = 2\\left(\\frac{24}{24 + x}\\right)", "color": "#16a34a" },
          { "id": "pt", "latex": "(48, \\frac{2}{3})", "color": "#dc2626", "label": "(48, 2/3)", "showLabel": true }
        ],
        "caption": "The positive intersection of y = x/72 (blue) and y = 48/(24 + x) (green) occurs at x = 48, confirming k = 48."
      }
      :::

      == tab: Solving the question with Algebra
      Identify the restricted denominator for each conditional probability, equate them per the prompt, and solve the resulting quadratic.

      :::derivation
      == step: Write Both Conditional Probabilities in Terms of k
      -- why: Whatever follows **"given"** defines the row or column total used in the denominator.
      * **Given Treatment B** (row total $= 72$):
      $$P(\text{Positive} \mid \text{Treatment B}) = \mathbf{\color{#2563eb}{\dfrac{k}{72}}}$$
      * **Given Positive Outcome** (column total $= 24 + k$):
      $$P(\text{Treatment A} \mid \text{Positive}) = \mathbf{\color{#d97706}{\dfrac{24}{24 + k}}}$$

      == step: Set Up the Ratio Equation and Simplify
      -- why: Multiply $P(\text{Treatment A} \mid \text{Positive})$ by $2$ and set it equal to $P(\text{Positive} \mid \text{Treatment B})$.
      $$
      \begin{aligned}
      \mathbf{\color{#2563eb}{\dfrac{k}{72}}} &= 2\left(\mathbf{\color{#d97706}{\dfrac{24}{24 + k}}}\right) \\
      \mathbf{\color{#2563eb}{\dfrac{k}{72}}} &= \dfrac{48}{24 + k}
      \end{aligned}
      $$

      == step: Cross-Multiply and Factor the Quadratic
      -- why: Clear both denominators, set the equation to $0$, and choose the positive root since $k$ is a count of participants.
      $$
      \begin{aligned}
      k(24 + k) &= 72 \times 48 \\
      k^2 + 24k &= 3{,}456 \\
      k^2 + 24k - 3{,}456 &= 0 \\
      (k - 48)(k + 72) &= 0
      \end{aligned}
      $$
      Since $k > 0$ (and $k \le 72$), discard $k = -72$ and take $k = \mathbf{48}$.
      :::

      **Shortcut Insight:** Once simplified to $\dfrac{k}{72} = \dfrac{48}{24 + k}$, look at the numerators and denominators: setting $k = 48$ makes both numerators equal to $48$ and both denominators equal to $72$ ($24 + 48 = 72$), confirming $\dfrac{48}{72} = \dfrac{48}{72}$ instantaneously without expanding $72 \times 48$.

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $24$:** *Complement Cell Trap.* Solves for $k = 48$ and subtracts from the Treatment B total ($72 - 48 = 24$), reporting $m$ ("No Improvement") instead of $k$ ("Positive Outcome").
      * **(B) $36$:** *Half-Total Trap.* Takes half of the Treatment B row total ($72 \div 2 = 36$), assuming a $50\%$ positive outcome rate.
      * **(C) $40$:** *Unconditional Denominator Trap.* Uses the grand total ($120$) instead of the conditional denominators ($72$ and $24 + k$), solving $\dfrac{k}{120} = 2\left(\dfrac{24}{120}\right) \implies k = 48$ or miscomputing $\dfrac{120}{3} = 40$.
      * **(D) $48$:** **Correct.** Sets $\dfrac{k}{72} = 2\left(\dfrac{24}{24 + k}\right)$ and solves $k^2 + 24k - 3{,}456 = 0$ to obtain $k = 48$.
    options:
      - id: "A"
        text: "$24$"
      - id: "B"
        text: "$36$"
      - id: "C"
        text: "$40$"
      - id: "D"
        text: "$48$"
  - id: "sat-t1-m2h-q13"
    questionNumber: 13
    questionType: "MC"
    correctAnswer: "C"
    domain: "Geometry and Trigonometry"
    skill: "Area and Volume"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A right rectangular prism has a length of $x$ centimeters, a width of $(x - 3)$ centimeters, and a height of $4$ centimeters. The length of the longest interior diagonal of the prism (connecting two opposite vertices) is $\sqrt{133}$ centimeters. What is the total surface area of the prism, in square centimeters?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the **total surface area** ($\text{SA} = 2(lw + lh + wh)$) of a right rectangular prism using its 3D interior **space diagonal** ($d = \sqrt{l^2 + w^2 + h^2} = \sqrt{133}$). Use the space diagonal equation to solve for $x$, determine all three side lengths, and then sum the areas of all $6$ rectangular faces.

      :::tabs

      == tab: Solving the question with Algebra
      Apply the 3D Pythagorean theorem ($l^2 + w^2 + h^2 = d^2$) to solve for $x$, then substitute the prism's dimensions into the surface area formula.

      :::derivation
      == step: Set Up and Solve the Space Diagonal Equation
      -- why: Substitute $l = x$, $w = x - 3$, $h = 4$, and $d = \sqrt{133}$ into $l^2 + w^2 + h^2 = d^2$.

      ![](./assets/dSAT-T1-M2H-Q13EXP.svg)
      $$
      \begin{aligned}
      {\color{#2563eb}{x}^2} + {\color{#d97706}{(x - 3)}}^2 + 4^2 &= \left(\sqrt{133}\right)^2 \\
      x^2 + (x^2 - 6x + 9) + 16 &= 133 \\
      2x^2 - 6x + 25 &= 133 \\
      2x^2 - 6x - 108 &= 0
      \end{aligned}
      $$
      Divide through by $2$ and factor:
      $$
      \begin{aligned}
      x^2 - 3x - 54 &= 0 \\
      (x - 9)(x + 6) &= 0
      \end{aligned}
      $$
      Since side length must be positive, $x = \mathbf{\color{#2563eb}{9}}$.

      == step: Identify All Three Prism Dimensions
      -- why: Substitute $x = 9$ into the expressions for length, width, and height.
      $$
      \begin{aligned}
      l &= \mathbf{\color{#2563eb}{9}}\text{ cm} \\
      w &= \mathbf{\color{#2563eb}{9}} - 3 = \mathbf{\color{#d97706}{6}}\text{ cm} \\
      h &= 4\text{ cm}
      \end{aligned}
      $$

      == step: Calculate the Total Surface Area
      -- why: Sum the areas of the three distinct pairs of opposite rectangular faces and multiply by $2$.
      $$
      \begin{aligned}
      \text{SA} &= 2(lw + lh + wh) \\
      &= 2\big((\mathbf{\color{#2563eb}{9}})(\mathbf{\color{#d97706}{6}}) + (\mathbf{\color{#2563eb}{9}})(4) + (\mathbf{\color{#d97706}{6}})(4)\big) \\
      &= 2(54 + 36 + 24) \\
      &= 2(114) = \mathbf{228}
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Subtract the height squared ($4^2 = 16$) from $d^2 = 133$ right away to see that $x^2 + (x - 3)^2 = 117$. Testing small integer pairs separated by $3$ immediately spots $9^2 + 6^2 = 81 + 36 = 117$, giving $(l, w, h) = (9, 6, 4)$ without expanding or factoring a quadratic.

      == tab: Applying DESMOS
      You can solve the space diagonal equation for $x$ and compute the surface area directly in Desmos.

      1. In line 1, graph `y = x^2 + (x - 3)^2 + 4^2` and in line 2 graph `y = 133` to find the positive intersection at $x = \mathbf{9}$.
      2. In line 3, define a helper function `S(x) = 2(x(x - 3) + 4x + 4(x - 3))` and evaluate `S(9)` to output **`228`** directly.

      :::desmos
      {
        "bounds": { "left": -3, "right": 14, "bottom": -15, "top": 250 },
        "expressions": [
          { "id": "diag_sq", "latex": "y = x^2 + (x - 3)^2 + 4^2", "color": "#2563eb" },
          { "id": "target_d", "latex": "y = 133", "color": "#16a34a" },
          { "id": "pt", "latex": "(9, 133)", "color": "#dc2626", "label": "(9, 133)", "showLabel": true },
          { "id": "sa_func", "latex": "S(x) = 2(x(x - 3) + 4x + 4(x - 3))", "color": "#d97706" },
          { "id": "ans", "latex": "S(9)", "color": "#444444" }
        ],
        "caption": "The positive intersection at (9, 133) confirms x = 9, and evaluating the surface area function S(9) outputs 228 directly."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $114$:** *Half-Surface-Area Trap.* Sums the areas of the three unique faces ($54 + 36 + 24 = 114$), forgetting to multiply by $2$ to account for all $6$ faces of the prism.
      * **(B) $192$:** *Sign / Dimension Trap.* Evaluates the surface area using $(l, w, h) = (9, 6, 3)$ or omits one pair of faces ($2(54 + 36) + 12 = 192$).
      * **(C) $228$:** **Correct.** Finds $x = 9$ from $x^2 + (x - 3)^2 + 4^2 = 133$, yielding dimensions $9 \times 6 \times 4$ and $\text{SA} = 2(54 + 36 + 24) = 228$.
      * **(D) $270$:** *Wrong Dimension Trap.* Adds $3$ instead of subtracting $3$ for the width—using $(l, w, h) = (9, 12, 4)$ or $(12, 9, 3)$—or miscomputes $2(135) = 270$.
    options:
      - id: "A"
        text: "$114$"
      - id: "B"
        text: "$192$"
      - id: "C"
        text: "$228$"
      - id: "D"
        text: "$270$"

  - id: "sat-t1-m2h-q14"
    questionNumber: 14
    questionType: "MC"
    correctAnswer: "A"
    domain: "Advanced Math"
    skill: "Equivalent Expressions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The rational function $f$ is defined by:
      $$f(x) = \dfrac{2x^2 + kx - 12}{x^2 - 5x + 6}$$
      where $k$ is a constant. For all $x > 3$, $f(x)$ is equivalent to $\dfrac{2x + 6}{x - 3}$. What is the value of $k$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the constant $k$ that makes the rational function $f(x)$ simplify to $\dfrac{2x + 6}{x - 3}$ for all $x > 3$. Because the denominator $x^2 - 5x + 6$ factors into $(x - 2)(x - 3)$, the factor $(x - 2)$ must cancel out from the numerator, meaning the numerator equals $(x - 2)(2x + 6)$.

      :::tabs

      == tab: Solving the question with Algebra
      Factor the denominator to identify the cancelled binomial $(x - 2)$, then expand the numerator's factored form to match the $x$-coefficient $k$.

      :::derivation
      == step: Factor the Denominator
      -- why: Rewrite $x^2 - 5x + 6$ as a product of two linear binomials to compare with the simplified denominator $(x - 3)$.
      $$
      \begin{aligned}
      x^2 - 5x + 6 &= \mathbf{\color{#2563eb}{(x - 2)}}(x - 3)
      \end{aligned}
      $$

      == step: Reconstruct the Numerator Before Cancellation
      -- why: Since $f(x)$ simplifies to $\dfrac{2x + 6}{x - 3}$ after dividing out $\mathbf{\color{#2563eb}{(x - 2)}}$, the original numerator must be the product $\mathbf{\color{#2563eb}{(x - 2)}}(2x + 6)$.
      $$
      \begin{aligned}
      2x^2 + kx - 12 &= \mathbf{\color{#2563eb}{(x - 2)}}(2x + 6) \\
      &= 2x^2 + 6x - 4x - 12 \\
      &= 2x^2 + \mathbf{\color{#d97706}{2}}x - 12
      \end{aligned}
      $$

      == step: Match Coefficients to Solve for $k$
      -- why: Compare the $x$-coefficients of $2x^2 + kx - 12$ and $2x^2 + 2x - 12$.
      $$
      k = \mathbf{2}
      $$
      :::

      **Shortcut Insight:** Since the equation holds for all $x > 3$, plug in a clean test value like $x = 4$:

      $$\dfrac{2(4)^2 + 4k - 12}{4^2 - 5(4) + 6} = \dfrac{2(4) + 6}{4 - 3} \implies \dfrac{20 + 4k}{2} = 14 \implies 10 + 2k = 14 \implies k = \mathbf{2}.$$

      == tab: Applying DESMOS
      Because the two rational expressions are equivalent for all $x > 3$, you can use a **slider** for $k$ in Desmos to find the exact value where both graphs overlap completely to the right of $x = 3$.

      1. Enter `f(x) = (2x^2 + kx - 12) / (x^2 - 5x + 6)` in line 1 and accept the slider for `k`.
      2. Enter `g(x) = (2x + 6) / (x - 3)` in line 2.
      3. Set `k = 2` (or test the answer choices) to confirm that `f(x)` and `g(x)` coincide everywhere for $x > 3$.

      :::desmos
      {
        "bounds": { "left": -4, "right": 10, "bottom": -15, "top": 25 },
        "expressions": [
          { "id": "k_val", "latex": "k = 2", "color": "#444444" },
          { "id": "func_f", "latex": "f(x) = \\frac{2x^2 + kx - 12}{x^2 - 5x + 6}", "color": "#2563eb" },
          { "id": "func_g", "latex": "g(x) = \\frac{2x + 6}{x - 3}", "color": "#16a34a" },
          { "id": "pt", "latex": "(4, 14)", "color": "#dc2626", "label": "(4, 14)", "showLabel": true }
        ],
        "caption": "When k = 2, f(x) and g(x) overlap completely for all x > 3, passing through (4, 14)."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $2$:** **Correct.** Expands $(x - 2)(2x + 6) = 2x^2 + 2x - 12$ to match $k = 2$.
      * **(B) $4$:** *Sign / Arithmetic Trap.* Subtracts $6x - 2x = 4x$ instead of $6x - 4x = 2x$, or forgets to divide $2k = 4$ by $2$.
      * **(C) $6$:** *Wrong Term Trap.* Reports the constant term $6$ from the numerator binomial $(2x + 6)$ instead of the combined $x$-coefficient $k = 2$.
      * **(D) $8$:** *Partial Evaluation Trap.* Evaluates $2(2)^2 = 8$ when testing $x = 2$ as a root of the numerator and stops before subtracting $12$ and dividing by $2$.
    options:
      - id: "A"
        text: "$2$"
      - id: "B"
        text: "$4$"
      - id: "C"
        text: "$6$"
      - id: "D"
        text: "$8$"

  - id: "sat-t1-m2h-q15"
    questionNumber: 15
    questionType: "MC"
    correctAnswer: "C"
    domain: "Advanced Math"
    skill: "Nonlinear Equations in One Variable"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Paving machine A working alone can pave a stretch of road in $h$ hours, where $h > 0$. Paving machine B working alone takes $k$ times as long as machine A to pave the same stretch of road, where $k$ is a constant. When both machines operate simultaneously at their respective constant rates, they complete the job in $6$ hours. If $h$ and $k$ are positive integers and $k > 1$, which of the following is a possible value of $h$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find a possible positive integer value for $h$ (the time Machine A needs alone) using a **combined work-rate rational equation** and **integer divisibility constraints**. Add the two machines' individual hourly rates to equal their combined rate of $\dfrac{1}{6}$ job per hour, express $h$ in terms of $k$, and determine which integer divisors $k > 1$ produce an integer $h$.

      :::tabs

      == tab: Solving the question with Algebra
      Set up the work-rate equation $\text{Rate}_A + \text{Rate}_B = \text{Rate}_{\text{combined}}$, isolate $h$, and test integer divisors of $6$.

      :::derivation
      == step: Write the Combined Work-Rate Equation
      -- why: Machine A takes $h$ hours (rate $= \dfrac{1}{h}$), Machine B takes $kh$ hours (rate $= \dfrac{1}{kh}$), and together they take $6$ hours (rate $= \dfrac{1}{6}$).
      $$
      {\color{#2563eb}\dfrac{1}{h}} + {\color{#d97706}\dfrac{1}{kh}} = \dfrac{1}{6}
      $$

      == step: Isolate $h$ in Terms of $k$
      -- why: Factor out $\dfrac{1}{h}$, combine the fraction in $k$, and solve explicitly for $h$.
      $$
      \begin{aligned}
      \dfrac{1}{h}\left(1 + \dfrac{1}{\color{#d97706}{k}}\right) &= \dfrac{1}{6} \\
      \dfrac{1}{h}\left(\dfrac{\color{#d97706}{k} + 1}{\color{#d97706}{k}}\right) &= \dfrac{1}{6} \\
      h &= \dfrac{6(\color{#d97706}{k} + 1)}{\color{#d97706}{k}} = 6 + \dfrac{6}{\color{#d97706}{k}}
      \end{aligned}
      $$

      == step: Apply Positive Integer and $k > 1$ Constraints
      -- why: Because $h$ is an integer, $\dfrac{6}{k}$ must be an integer, so $k$ must be a positive factor of $6$ strictly greater than $1$ ($k \in \{2, 3, 6\}$).
      * If $\color{#d97706}{k = 2}$: $\quad h = 6 + \dfrac{6}{2} = 6 + 3 = 9$
      * If $\color{#d97706}{k = 3}$: $\quad h = 6 + \dfrac{6}{3} = 6 + 2 = \color{#2563eb}{8}$
      * If $\color{#d97706}{k = 6}$: $\quad h = 6 + \dfrac{6}{6} = 6 + 1 = 7$

      Thus, the only valid integer values for $h$ are $7$, $8$, and $9$. Matching against the answer choices gives $h = 8$.
      :::

      **Shortcut Insight:** Use logic bounds before doing any algebra! Working *together* takes $6$ hours, so Machine A alone must take **more than $6$ hours** (eliminating $4$ and $6$). Furthermore, because $k > 1$, Machine B is slower than Machine A—if they had equal speeds ($k = 1$), each would take $2 \times 6 = 12$ hours, so the faster Machine A must take **less than $12$ hours** (eliminating $12$). That immediately traps $h$ strictly between $6$ and $12$ ($6 < h < 12$), leaving **$8$** as the only possible answer!

      == tab: Applying DESMOS
      Once you express $h$ as a function of $k$—namely $h = 6 + \dfrac{6}{k}$—you can graph the curve in Desmos for $x > 1$ (where $x$ represents $k$ and $y$ represents $h$) and check where integer $x$-coordinates produce integer $y$-coordinates.

      1. Enter `y = 6 + 6/x {x > 1}` in line 1.
      2. Inspect the points with integer coordinates along the curve: $(2, 9)$, $(3, 8)$, and $(6, 7)$.
      3. Comparing those $y$-values ($9, 8, 7$) with the choices confirms **$8$** is the valid option.

      :::desmos
      {
        "bounds": { "left": 0, "right": 9, "bottom": 0, "top": 14 },
        "expressions": [
          { "id": "curve", "latex": "y = 6 + \\frac{6}{x} \\left\\{x > 1\\right\\}", "color": "#2563eb" },
          { "id": "pt1", "latex": "(2, 9)", "color": "#444444", "label": "(2, 9)", "showLabel": true },
          { "id": "pt2", "latex": "(3, 8)", "color": "#dc2626", "label": "(3, 8)", "showLabel": true },
          { "id": "pt3", "latex": "(6, 7)", "color": "#444444", "label": "(6, 7)", "showLabel": true }
        ],
        "caption": "For x > 1, the curve y = 6 + 6/x passes through integer points (2, 9), (3, 8), and (6, 7), confirming h = 8."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $4$:** *Impossible Time Trap.* Suggests Machine A working alone ($4$ hours) is faster than both machines working together ($6$ hours), which violates $k > 0$.
      * **(B) $6$:** *Zero-Contribution Trap.* Assumes Machine A takes the full $6$ hours on its own, which would require Machine B to contribute zero work ($k \to \infty$).
      * **(C) $8$:** **Correct.** Corresponds to $k = 3$, giving $h = 6 + \dfrac{6}{3} = 8$ hours (with Machine B taking $3 \times 8 = 24$ hours, and $\dfrac{1}{8} + \dfrac{1}{24} = \dfrac{4}{24} = \dfrac{1}{6}$).
      * **(D) $12$:** *Boundary Violation Trap.* Solves for the equal-rate case $k = 1$ ($h = 6 + \dfrac{6}{1} = 12$), violating the explicit constraint $k > 1$.
    options:
      - id: "A"
        text: "$4$"
      - id: "B"
        text: "$6$"
      - id: "C"
        text: "$8$"
      - id: "D"
        text: "$12$"
  - id: "sat-t1-m2h-q16"
    questionNumber: 16
    questionType: "MC"
    correctAnswer: "C"
    domain: "Problem-Solving and Data Analysis"
    skill: "Ratios, rates, proportional relationships, and units"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A dairy cooperative collects milk from two farms, Farm A and Farm B. During a certain week, Farm A had $a$ dairy cows and Farm B had $b$ dairy cows, where $a > b > 0$. The average daily milk production per cow was $x$ gallons at Farm A and $y$ gallons at Farm B. Across all cows from both farms, the overall average daily milk production per cow was $k$ gallons. If $x$ does not equal $y$, which of the following expressions represents the ratio of the number of cows at Farm A to the number of cows at Farm B, $\dfrac{a}{b}$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Express the ratio $\dfrac{a}{b}$ in terms of $x$, $y$, and $k$ using a **weighted average** relationship. Express the total combined milk production across both farms in two ways—first by summing each farm's total output, and second by multiplying the combined cow count $(a + b)$ by the overall average $k$—then isolate $\dfrac{a}{b}$.

      :::tabs

      == tab: Solving the question with Algebra
      Set up the total milk equation, group the $\color{#2563eb}{a}$-terms on one side and the $\color{#d97706}{b}$-terms on the other, and divide to form $\dfrac{\color{#2563eb}{a}}{\color{#d97706}{b}}$.

      :::derivation
      == step: Express Total Daily Milk Production in Two Ways
      -- why: Total output equals the sum of Farm A's milk ($ax$) and Farm B's milk ($by$), which also equals the overall average ($k$) times total cows ($a + b$).
      $$
        {\color{#2563eb}{a}}x + {\color{#d97706}{b}}y = k({\color{#2563eb}{a}} + {\color{#d97706}{b}})
      $$

      == step: Group a-Terms and b-Terms on Opposite Sides
      -- why: Expand $k(a + b) = ka + kb$, move all $a$-terms to the left and all $b$-terms to the right, and factor out $a$ and $b$.
      $$
      \begin{aligned}
      {\color{#2563eb}{a}}x + {\color{#d97706}{b}}y &= k{\color{#2563eb}{a}} + k{\color{#d97706}{b}} \\
      {\color{#2563eb}{a}}x - k{\color{#2563eb}{a}} &= k{\color{#d97706}{b}} - {\color{#d97706}{b}}y \\
      {\color{#2563eb}{a}}(x - k) &= {\color{#d97706}{b}}(k - y)
      \end{aligned}
      $$

      == step: Divide to Isolate a/b
      -- why: Divide both sides by $b(x - k)$ (which is nonzero because $x \neq y$ ensures $k \neq x$).
      $$
      \dfrac{\color{#2563eb}{a}}{\color{#d97706}{b}} = \dfrac{k - y}{x - k}
      $$
      :::

      **Shortcut Insight:** Use the **weighted-average tug-of-war (alligation)** principle or test clean numbers! Because $a > b$, there are *more* cows at Farm A than at Farm B, so the overall average $k$ must be pulled **closer to $x$ than to $y$** (meaning $|x - k| < |k - y|$). That immediately guarantees $\dfrac{|k - y|}{|x - k|} > 1$, matching $\dfrac{a}{b} > 1$! You can also plug in $a = 3, b = 1$ with $x = 10, y = 2$: the overall average is $k = \dfrac{3(10) + 1(2)}{4} = 8$, and only $\dfrac{k - y}{x - k} = \dfrac{8 - 2}{10 - 8} = \dfrac{6}{2} = 3$ equals $\dfrac{a}{b}$.

      == tab: Applying DESMOS
      When a question has multiple variables and symbolic answer choices, assigning concrete numbers that satisfy all constraints ($a > b > 0$ and $x \neq y$) in Desmos lets you verify the exact matching expression immediately.

      1. Choose $a = 3$, $b = 1$ (so the target ratio $\dfrac{a}{b} = 3$), $x = 10$, and $y = 2$.
      2. Compute the weighted average: `k = (a*x + b*y) / (a + b)` (outputs `k = 8`).
      3. Evaluate `(k - y) / (x - k)` in line 6 to confirm it outputs **`3`**, matching `a / b`.

      :::desmos
      {
        "bounds": { "left": -2, "right": 12, "bottom": -2, "top": 12 },
        "expressions": [
          { "id": "a_val", "latex": "a = 3", "color": "#2563eb" },
          { "id": "b_val", "latex": "b = 1", "color": "#d97706" },
          { "id": "x_val", "latex": "x = 10", "color": "#444444" },
          { "id": "y_val", "latex": "y = 2", "color": "#444444" },
          { "id": "k_val", "latex": "k = \\frac{ax + by}{a + b}", "color": "#16a34a" },
          { "id": "ans", "latex": "\\frac{k - y}{x - k}", "color": "#dc2626" }
        ],
        "caption": "With a = 3, b = 1, x = 10, and y = 2, the weighted average is k = 8, and (k - y)/(x - k) evaluates to 3 = a/b."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\dfrac{k - x}{k - y}$:** *Sign-Order Trap.* Reverses the subtraction order in the numerator ($k - x$ instead of $x - k$) while also inverting the fraction, producing a negative value since $k$ lies between $x$ and $y$.
      * **(B) $\dfrac{x - k}{k - y}$:** *Inverted Ratio Trap.* Solves for $\dfrac{b}{a}$ (Farm B to Farm A) instead of $\dfrac{a}{b}$ (Farm A to Farm B); because $a > b$, this ratio is less than $1$.
      * **(C) $\dfrac{k - y}{x - k}$:** **Correct.** Rearranges $ax + by = k(a + b)$ into $a(x - k) = b(k - y)$ and divides to yield $\dfrac{a}{b} = \dfrac{k - y}{x - k}$.
      * **(D) $\dfrac{x + y}{2k}$:** *Unweighted Average Trap.* Confuses a weighted average with a simple arithmetic mean $\dfrac{x + y}{2}$, ignoring that Farms A and B have different numbers of cows ($a \neq b$).
    options:
      - id: "A"
        text: "$\\dfrac{k - x}{k - y}$"
      - id: "B"
        text: "$\\dfrac{x - k}{k - y}$"
      - id: "C"
        text: "$\\dfrac{k - y}{x - k}$"
      - id: "D"
        text: "$\\dfrac{x + y}{2k}$"

  - id: "sat-t1-m2h-q17"
    questionNumber: 17
    questionType: "MC"
    correctAnswer: "B"
    domain: "Problem-Solving and Data Analysis"
    skill: "One-variable data: distributions and measures of center and spread"
    difficulty: "Hard"
    containsGraph: false
    containsChart: true
    containsDiagram: false
    stimulus: |
      The frequency table below summarizes the score distribution of a group of participants on an assessment, where $n$ is a positive integer.

      | Score | Frequency |
      | :---: | :---: |
      | $2$ | $14$ |
      | $4$ | $6$ |
      | $6$ | $n$ |
      | $8$ | $18$ |
      | $10$ | $12$ |
    prompt: |
      If the median score of the participants is strictly greater than the mean score of the participants, what is the greatest possible value of $n$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the greatest positive integer $n$ (the frequency of score $6$) for which $\text{Median} > \text{Mean}$. First express the **mean** in terms of $n$ to establish a lower bound on what the median must exceed, and then use **cumulative frequencies** to find the exact cutoff where the median drops to $6$.

      :::tabs

      == tab: Solving the question with Algebra
      Compute the mean as a function of $n$ to see how it compares to $6$, then determine the largest integer $n$ that keeps the median strictly greater than $6$.

      :::derivation
      == step: Express the Mean in Terms of n and Bound It
      -- why: Divide the sum of $(\text{Score} \times \text{Frequency})$ by the total number of participants $N = 14 + 6 + n + 18 + 12 = 50 + n$.
      $$
      \begin{aligned}
      \text{Mean} &= \dfrac{14(2) + 6(4) + {\color{#2563eb}{n}}(6) + 18(8) + 12(10)}{50 + {\color{#2563eb}{n}}} \\
      &= \dfrac{28 + 24 + 6{\color{#2563eb}{n}} + 144 + 120}{50 + {\color{#2563eb}{n}}} \\
      &= \dfrac{316 + 6{\color{#2563eb}{n}}}{50 + {\color{#2563eb}{n}}} \\
      &= \dfrac{6(50 + {\color{#2563eb}{n}}) + 16}{50 + {\color{#2563eb}{n}}} = 6 + \dfrac{16}{50 + {\color{#2563eb}{n}}}
      \end{aligned}
      $$
      Because $n$ is a positive integer, $\dfrac{16}{50 + n} > 0$, which guarantees $\text{Mean} > {\color{#d97706}{6}}$ for **all** $n$.

      == step: Determine When the Median Exceeds 6
      -- why: Since $\text{Mean} > 6$, satisfying $\text{Median} > \text{Mean}$ requires $\text{Median} > {\color{#d97706}{6}}$. Compare the count of scores $\le 6$ against the count of scores $\ge 8$.
      * **Scores $\le 6$:** $14 + 6 + {\color{#2563eb}{n}} = 20 + {\color{#2563eb}{n}}$ participants
      * **Scores $\ge 8$:** $18 + 12 = {\color{#d97706}{30}}$ participants

      For the median to exceed $6$, the lower group ($20 + n$) cannot outnumber the upper group ($30$):
      $$
      20 + {\color{#2563eb}{n}} \le {\color{#d97706}{30}} \implies {\color{#2563eb}{n}} \le 10
      $$

      == step: Verify the Boundary Cases n = 10 and n = 11
      -- why: Confirm whether the even-total split at $n = 10$ still keeps $\text{Median} > \text{Mean}$.
      * **At ${\color{#2563eb}{n = 10}}$:** Total participants $N = 60$. The $30\text{th}$ ordered score is $6$ and the $31\text{st}$ ordered score is $8$, giving:
      $$\text{Median} = \dfrac{6 + 8}{2} = {\color{#d97706}{7}} > \text{Mean} \left(6 + \dfrac{16}{60} \approx 6.27\right) \quad \checkmark$$
      * **At ${\color{#2563eb}{n = 11}}$:** Total participants $N = 61$. The $31\text{st}$ ordered score is $6$, giving:
      $$\text{Median} = 6 < \text{Mean} \left(6 + \dfrac{16}{61} \approx 6.26\right) \quad \times$$

      Therefore, the greatest possible value of $n$ is $10$.
      :::

      **Shortcut Insight:** Balance the two sides around the middle score $6$! Without score $6$, there are $20$ participants below $6$ ($2$ and $4$) and $30$ participants above $6$ ($8$ and $10$). Adding $n = 10$ sixes makes the lower-plus-middle count $20 + 10 = 30$, perfectly balancing the $30$ upper scores so the median splits $6$ and $8$ to equal $7$—still comfortably above the mean ($\approx 6.27$). Adding just one more $6$ ($n = 11$) pulls the median down to $6$, below the mean.

      == tab: Applying DESMOS
      You can plot the **mean** as a continuous function of $x$ (representing $n$) and use Desmos's built-in `median` function on expanded score lists at $x = 10$ and $x = 11$ to verify the exact cutoff.

      1. Enter `M(x) = (316 + 6x) / (50 + x)` in line 1 to track the mean for any $n = x$.
      2. Evaluate `M(10)` ($\approx 6.27$) and `M(11)` ($\approx 6.26$).
      3. At $n = 10$ ($N = 60$), the two middle scores are $6$ and $8$, so $\text{Median} = \dfrac{6 + 8}{2} = 7 > 6.27$, whereas at $n = 11$ ($N = 61$), the $31\text{st}$ score is $6 < 6.26$—confirming **$10$**.

      :::desmos
      {
        "bounds": { "left": 0, "right": 18, "bottom": 4.5, "top": 9.5 },
        "expressions": [
          { "id": "mean_fn", "latex": "M(x) = \\frac{316 + 6x}{50 + x}", "color": "#2563eb" },
          { "id": "n10_med", "latex": "(10, 7)", "color": "#16a34a", "label": "n = 10: Median = 7", "showLabel": true },
          { "id": "n10_mean", "latex": "(10, M(10))", "color": "#2563eb", "label": "Mean ≈ 6.27", "showLabel": true },
          { "id": "n11_med", "latex": "(11, 6)", "color": "#dc2626", "label": "n = 11: Median = 6", "showLabel": true }
        ],
        "caption": "At n = 10, the median is 7 (above the mean curve M(10) ≈ 6.27); at n = 11, the median drops to 6 (below M(11) ≈ 6.26)."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $9$:** *Strict Inequality Boundary Trap.* Solves $20 + n < 30 \implies n < 10$ to keep the median strictly at $8$, missing that at $n = 10$ ($N = 60$) the median is the average of $6$ and $8$ ($= 7$), which is still strictly greater than the mean ($\approx 6.27$).
      * **(B) $10$:** **Correct.** Balances the $20 + 10 = 30$ scores at or below $6$ with the $30$ scores at or above $8$, yielding $\text{Median} = \dfrac{6 + 8}{2} = 7 > \text{Mean} \approx 6.27$.
      * **(C) $11$:** *Off-by-One Trap.* At $n = 11$ ($N = 61$), the $31\text{st}$ value falls inside score $6$, dropping the median to $6$, which is *less* than the mean ($\approx 6.26$).
      * **(D) $15$:** *Unweighted Midpoint Trap.* Averages the extreme frequencies or sets $n$ to the average of $14$ and $16$, pushing the median down to $6$.
    options:
      - id: "A"
        text: "$9$"
      - id: "B"
        text: "$10$"
      - id: "C"
        text: "$11$"
      - id: "D"
        text: "$15$"

  - id: "sat-t1-m2h-q18"
    questionNumber: 18
    questionType: "FR"
    correctAnswer: "17"
    domain: "Advanced Math"
    skill: "Nonlinear functions"
    difficulty: "Medium"
    containsGraph: true
    containsChart: false
    containsDiagram: false
    stimulus: |
      ![](./assets/dSAT-T1-M2H-Q18.svg)

      The line shown in the $xy$-plane represents the graph of $y = g(x)$.
    prompt: |
      The function $f$ is defined by $f(x) = 2g(x + 1) + 5$, where $g$ is the function graphed. What is the value of $f(2)$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Evaluate $f(2)$ for a transformed function $f(x) = 2g(x + 1) + 5$. Work from the **inside out**: first substitute $x = 2$ inside the parentheses to determine which input of $g$ you need, read that corresponding $y$-value directly from the graph of $y = g(x)$, and then apply the vertical stretch ($\times 2$) and vertical shift ($+ 5$).

      :::tabs

      == tab: Solving the question with Algebra
      Substitute $x = 2$ into the definition of $f(x)$, locate the point on the graph of $y = g(x)$, and simplify.

      :::derivation
      == step: Evaluate the Input to g at x = 2
      -- why: Replace every $x$ in $f(x) = 2g(x + 1) + 5$ with $2$ and simplify inside the parentheses first.
      $$
      \begin{aligned}
      f({\color{#2563eb}{2}}) &= 2g({\color{#2563eb}{2}} + 1) + 5 \\
      &= 2g({\color{#2563eb}{3}}) + 5
      \end{aligned}
      $$

      == step: Read g(3) from the Graph (or Linear Equation)
      -- why: Locate $x = 3$ on the horizontal axis and read the $y$-coordinate of the point on the line $y = g(x)$.
      The graphed line passes through $(0, -3)$ and $(1, 0)$, giving slope $m = \dfrac{0 - (-3)}{1 - 0} = 3$ and equation $g(x) = 3x - 3$. At $x = {\color{#2563eb}{3}}$, the line passes directly through $({\color{#2563eb}{3}}, {\color{#d97706}{6}})$, so:
      $$
      g({\color{#2563eb}{3}}) = {\color{#d97706}{6}}
      $$

      == step: Substitute g(3) = 6 and Compute f(2)
      -- why: Multiply $g(3)$ by $2$ and add $5$ following standard order of operations.
      $$
      \begin{aligned}
      f(2) &= 2({\color{#d97706}{6}}) + 5 \\
      &= 12 + 5 = 17
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** You don't need to write out the algebraic equation $g(x) = 3x - 3$ at all! Because the line crosses grid intersections cleanly at $(0, -3)$ and $(1, 0)$, each $1$-unit step right moves $3$ units up—taking you straight to $(2, 3)$ and $(3, 6)$, so $g(3) = 6$ and $2(6) + 5 = 17$ in seconds.

      == tab: Applying DESMOS
      Once you read two lattice points from the graphed line—such as $(0, -3)$ and $(1, 0)$—you can define both $g(x)$ and $f(x)$ directly in Desmos to evaluate $f(2)$ error-free.

      1. Enter `g(x) = 3x - 3` in line 1 and confirm it passes through $(0, -3)$, $(1, 0)$, and $(3, 6)$.
      2. Enter `f(x) = 2g(x + 1) + 5` in line 2.
      3. Enter `f(2)` in line 3 to output **`17`** directly.

      :::desmos
      {
        "bounds": { "left": -3, "right": 6, "bottom": -5, "top": 20 },
        "expressions": [
          { "id": "fn_g", "latex": "g(x) = 3x - 3", "color": "#2563eb" },
          { "id": "fn_f", "latex": "f(x) = 2g(x + 1) + 5", "color": "#16a34a" },
          { "id": "pt_g", "latex": "(3, 6)", "color": "#2563eb", "label": "(3, 6)", "showLabel": true },
          { "id": "pt_f", "latex": "(2, 17)", "color": "#dc2626", "label": "(2, 17)", "showLabel": true },
          { "id": "ans", "latex": "f(2)", "color": "#444444" }
        ],
        "caption": "Evaluating g(3) = 6 on the blue line y = g(x) gives f(2) = 2(6) + 5 = 17 on the transformed green line y = f(x)."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      Because this is a **Student-Produced Response (SPR)** question, double-check that you avoided these common traps before entering **`17`**:
      * **Evaluating $g(2)$ instead of $g(3)$ ($11$):** Forgetting the $+ 1$ inside $g(x + 1)$ and plugging in $g(2) = 3$ yields $2(3) + 5 = 11$.
      * **Horizontal Shift Direction Trap ($5$):** Subtracting $1$ instead of adding $1$ inside the parentheses evaluates $g(2 - 1) = g(1) = 0$, giving $2(0) + 5 = 5$.
      * **Using the $x$-Coordinate Instead of the $y$-Coordinate ($11$):** Plugging the input $3$ directly into $2(3) + 5 = 11$ instead of reading the output $g(3) = 6$ from the vertical axis.
  - id: "sat-t1-m2h-q19"
    questionNumber: 19
    questionType: "FR"
    correctAnswer: "40"
    domain: "Advanced Math"
    skill: "Nonlinear functions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The polynomial function $p$ is defined by $p(x) = ax^3 + bx^2 + cx + d$, where $a$, $b$, $c$, and $d$ are constants. In the $xy$-plane, the graph of $y = p(x)$ crosses the $x$-axis at $(-3, 0)$, is tangent to the $x$-axis at $(1, 0)$, and passes through the point $(2, 25)$. What is the value of $p(-1)$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Evaluate $p(-1)$ for a cubic polynomial described by its **$x$-intercept behavior** rather than an explicit factored formula. Translate the two $x$-intercepts into factored form—using a single factor where the graph **crosses** the $x$-axis and a squared factor where the graph is **tangent** to the $x$-axis—then use $(2, 25)$ to find the leading coefficient $a$ before evaluating $p(-1)$.

      :::tabs

      == tab: Solving the question with Algebra
      Build the factored form of the cubic polynomial from its intercepts and multiplicities, solve for $a$ using $(2, 25)$, and evaluate $p(-1)$.

      :::derivation
      == step: Construct the Factored Form from Intercept Multiplicities
      -- why: A cubic polynomial has degree $3$. Crossing the $x$-axis at $(-3, 0)$ gives a linear factor $(x + 3)$ of multiplicity $1$, while being tangent to the $x$-axis at $(1, 0)$ gives a repeated factor $(x - 1)^2$ of multiplicity $2$.
      $$
      p(x) = {\color{#2563eb}{a}}(x + 3)(x - 1)^2
      $$

      == step: Substitute (2, 25) to Solve for a
      -- why: Because $(2, 25)$ lies on the graph of $y = p(x)$, substituting $x = 2$ must yield $p(2) = 25$.
      $$
      \begin{aligned}
      {\color{#d97706}{25}} &= {\color{#2563eb}{a}}({\color{#d97706}{2}} + 3)({\color{#d97706}{2}} - 1)^2 \\
      {\color{#d97706}{25}} &= {\color{#2563eb}{a}}(5)(1)^2 \\
      {\color{#d97706}{25}} &= 5{\color{#2563eb}{a}} \implies {\color{#2563eb}{a}} = 5
      \end{aligned}
      $$

      == step: Evaluate p(-1) Using the Complete Function
      -- why: Substitute $a = 5$ and $x = -1$ into $p(x) = 5(x + 3)(x - 1)^2$.
      $$
      \begin{aligned}
      p(-1) &= {\color{#2563eb}{5}}(-1 + 3)(-1 - 1)^2 \\
      &= {\color{#2563eb}{5}}(2)(-2)^2 \\
      &= {\color{#2563eb}{5}}(2)(4) = 40
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Once you identify the factored structure $p(x) = a(x + 3)(x - 1)^2$, take the ratio $\dfrac{p(-1)}{p(2)}$ directly so $a$ cancels out without ever solving for it:
      $$\dfrac{p(-1)}{25} = \dfrac{\cancel{a}(-1 + 3)(-1 - 1)^2}{\cancel{a}(2 + 3)(2 - 1)^2} = \dfrac{(2)(4)}{(5)(1)} = \dfrac{8}{5} \implies p(-1) = 25 \times \dfrac{8}{5} = 40.$$

      == tab: Applying DESMOS
      Once you translate the intercept descriptions into the factored template $p(x) = a(x + 3)(x - 1)^2$, you can use Desmos to lock the curve onto $(2, 25)$ and read off $p(-1)$ immediately.

      1. Enter `p(x) = a(x + 3)(x - 1)^2` in line 1 and accept the slider for `a`.
      2. Plot `(2, 25)` in line 2, then adjust `a` (or use regression `25 ~ a(2 + 3)(2 - 1)^2`) so the curve passes through $(2, 25)$—setting `a = 5`.
      3. Enter `p(-1)` in line 4 to output **`40`** directly.

      :::desmos
      {
        "bounds": { "left": -4.5, "right": 4, "bottom": -8, "top": 46 },
        "expressions": [
          { "id": "a_val", "latex": "a = 5", "color": "#444444" },
          { "id": "poly", "latex": "p(x) = a(x + 3)(x - 1)^2", "color": "#2563eb" },
          { "id": "pt_given", "latex": "(2, 25)", "color": "#16a34a", "label": "(2, 25)", "showLabel": true },
          { "id": "pt_target", "latex": "(-1, 40)", "color": "#dc2626", "label": "(-1, 40)", "showLabel": true },
          { "id": "ans", "latex": "p(-1)", "color": "#d97706" }
        ],
        "caption": "Crossing at (-3, 0) and bouncing tangentially at (1, 0) fixes p(x) = a(x + 3)(x - 1)^2; passing through (2, 25) sets a = 5 and gives p(-1) = 40."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      Because this is a **Student-Produced Response (SPR)** question, double-check that you avoided these common traps before entering **`40`**:
      * **Squaring the Wrong Factor ($-10$):** Writing $p(x) = a(x + 3)^2(x - 1)$ instead of squaring the tangent root $(x - 1)^2$ gives $25 = a(25)(1) \implies a = 1$ and $p(-1) = 1(4)(-2) = -8$ (or $-10$ with sign errors).
      * **Sign Error When Squaring $(-2)$ ($-40$):** Evaluating $(-2)^2$ as $-4$ instead of $+4$ yields $5(2)(-4) = -40$.
      * **Omitting the Leading Coefficient $a$ ($8$):** Evaluating $(x + 3)(x - 1)^2$ at $x = -1$ to get $(2)(4) = 8$ and forgetting to scale by $a = 5$.
  - id: "sat-t1-m2h-q20"
    questionNumber: 20
    questionType: "FR"
    correctAnswer: "18"
    domain: "Problem-Solving and Data Analysis"
    skill: "Probability and conditional probability"
    difficulty: "Medium"
    containsGraph: false
    containsChart: true
    containsDiagram: false
    stimulus: |
      The table below summarizes the distribution of $200$ game pieces categorized by color and shape, where $k$ is a positive integer.

      | Color | Circle | Square | Triangle | Total |
      | :--- | :---: | :---: | :---: | :---: |
      | **Red** | $26$ | $18$ | $24$ | $68$ |
      | **Blue** | $22$ | $k$ | $20$ | $42 + k$ |
      | **Green** | $24$ | $24$ | $24$ | $72$ |
      | **Total** | $72$ | $42 + k$ | $68$ | $200$ |
    prompt: |
      A game piece is selected at random from the collection. The probability of selecting a square piece given that the piece is blue is equal to $\dfrac{3}{10}$. What is the value of $k$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Solve for the missing cell count $k$ (the number of blue square pieces) in a two-way frequency table. You can set up the **conditional probability** equation $P(\text{Square} \mid \text{Blue}) = \dfrac{3}{10}$ by restricting the denominator strictly to the **Blue** row total ($42 + k$), or verify directly from the grand total of $200$ game pieces.

      :::tabs

      == tab: Solving the question with Algebra
      Write the conditional probability $P(\text{Square} \mid \text{Blue})$ using the Blue row of the table, set it equal to $\dfrac{3}{10}$, and cross-multiply to solve for $k$.

      :::derivation
      == step: Set Up the Conditional Probability Ratio
      -- why: The condition **"given that the piece is blue"** restricts the sample space to the Blue row only, where there are $k$ square pieces out of $42 + k$ total blue pieces.
      $$
      P(\text{Square} \mid \text{Blue}) = \dfrac{{\color{#2563eb}{k}}}{{\color{#d97706}{42 + k}}} = \dfrac{3}{10}
      $$

      == step: Cross-Multiply and Solve for k
      -- why: Clear the denominators by cross-multiplying, then group the $k$-terms on one side.
      $$
      \begin{aligned}
      10{\color{#2563eb}{k}} &= 3({\color{#d97706}{42 + k}}) \\
      10{\color{#2563eb}{k}} &= 126 + 3{\color{#2563eb}{k}} \\
      7{\color{#2563eb}{k}} &= 126 \\
      {\color{#2563eb}{k}} &= \dfrac{126}{7} = 18
      \end{aligned}
      $$

      == step: Cross-Check Against the Table's Grand Total
      -- why: Confirm that $k = 18$ also satisfies the total count of $200$ game pieces across all three colors.
      $$
      68 + (42 + {\color{#2563eb}{18}}) + 72 = 68 + 60 + 72 = 200 \quad \checkmark
      $$
      :::

      **Shortcut Insight:** Always check the **Total** row or column before setting up algebra! Because the rightmost column sums all three colors to $200$, you can find $k$ in a single arithmetic step: $68 + (42 + k) + 72 = 200 \implies 182 + k = 200 \implies k = 18$, and then use $\dfrac{18}{42 + 18} = \dfrac{18}{60} = \dfrac{3}{10}$ as a two-second confirmation.

      == tab: Applying DESMOS
      Graph both sides of the conditional probability equation $\dfrac{x}{42 + x} = \dfrac{3}{10}$ in Desmos (using $x$ in place of $k$) to find the solution directly.

      1. Enter `y = x / (42 + x)` in line 1 to represent $P(\text{Square} \mid \text{Blue})$.
      2. Enter `y = 3 / 10` in line 2.
      3. Click the intersection point at $(18, 0.3)$ to read off $k = \mathbf{18}$ directly.

      :::desmos
      {
        "bounds": { "left": -5, "right": 35, "bottom": -0.1, "top": 0.6 },
        "expressions": [
          { "id": "cond_prob", "latex": "y = \\frac{x}{42 + x}", "color": "#2563eb" },
          { "id": "target_p", "latex": "y = \\frac{3}{10}", "color": "#16a34a" },
          { "id": "pt", "latex": "(18, 0.3)", "color": "#dc2626", "label": "(18, 0.3)", "showLabel": true }
        ],
        "caption": "The curve y = x/(42 + x) intersects the horizontal line y = 3/10 at x = 18, confirming k = 18."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      Because this is a **Student-Produced Response (SPR)** question, double-check that you avoided these common traps before entering **`18`**:
      * **Reporting Total Blue Pieces ($60$):** Solving $42 + k = 60$ and entering the entire Blue row total ($60$) instead of the individual cell value $k = 18$.
      * **Using the Grand Total as Denominator ($60$):** Setting $\dfrac{k}{200} = \dfrac{3}{10}$ ignores the conditional restriction *"given that the piece is blue"* and gives $k = 60$, which violates the table's total of $200$.
      * **Using the Square Column Total Instead of the Blue Row Total:** Notice both the Blue row total and Square column total happen to equal $42 + k$, so both give $\dfrac{k}{42 + k}$—just be sure not to accidentally use the Red ($68$) or Green ($72$) row totals.
  - id: "sat-t1-m2h-q21"
    questionNumber: 21
    questionType: "FR"
    correctAnswer: "18"
    domain: "Geometry and Trigonometry"
    skill: "Circles"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      In the $xy$-plane, circle $C$ has center $(h, 3)$ and radius $r$, where $h$ and $r$ are positive constants. Circle $C$ is tangent to the horizontal line $y = -5$ and intersects the vertical line $x = 2$ at exactly one point. What is the value of $h + r$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the sum $h + r$ for a circle centered at $(h, 3)$ that is **tangent** to two perpendicular lines: the horizontal line $y = -5$ and the vertical line $x = 2$ (intersecting a circle at *exactly one point* means the line is tangent to the circle). Use the perpendicular distance from the center to each tangent line to find $r$ first and then $h$.

      :::tabs

      == tab: Solving the question with Algebra
      Use the vertical tangent $y = -5$ to determine the radius $r$, then use the horizontal distance to $x = 2$ along with $h > 0$ to solve for $h$.

      :::derivation
      == step: Find the Radius r from the Horizontal Tangent y = -5
      -- why: A radius drawn to a point of tangency is perpendicular to the tangent line. Since $y = -5$ is horizontal, the radius equals the vertical distance between $y = 3$ and $y = -5$.
      
      ![](./assets/dSAT-T1-M2H-Q21EXP.svg)
      
      $$
      {\color{#2563eb}{r}} = |3 - (-5)| = |3 + 5| = 8
      $$

      == step: Find h from the Vertical Tangent x = 2
      -- why: Intersecting the vertical line $x = 2$ at exactly one point means $x = 2$ is tangent to circle $C$, so the horizontal distance from $(h, 3)$ to $x = 2$ must equal $r = 8$.
      $$
      |{\color{#d97706}{h}} - 2| = {\color{#2563eb}{8}}
      $$
      Split the absolute value equation into two cases:
      $$
      \begin{aligned}
      {\color{#d97706}{h}} - 2 &= 8 \implies {\color{#d97706}{h}} = 10 \\
      {\color{#d97706}{h}} - 2 &= -8 \implies {\color{#d97706}{h}} = -6
      \end{aligned}
      $$
      Because $h$ is a **positive** constant ($h > 0$), discard $h = -6$ and select ${\color{#d97706}{h}} = 10$.

      == step: Compute h + r
      -- why: Add the positive values of $h$ and $r$ obtained above.
      $$
      {\color{#d97706}{h}} + {\color{#2563eb}{r}} = {\color{#d97706}{10}} + {\color{#2563eb}{8}} = 18
      $$
      :::

      **Shortcut Insight:** Picture the corner box formed by the two tangent lines $x = 2$ and $y = -5$ meeting at $(2, -5)$. Because the circle is tangent to both lines and its center $(h, 3)$ has $h > 0$ (to the right of $x = 2$) and $y = 3 > -5$ (above $y = -5$), the center must lie **one radius to the right** of $x = 2$ and **one radius above** $y = -5$:
      $$r = 3 - (-5) = 8 \quad\text{and}\quad h = 2 + r = 2 + 8 = 10 \implies h + r = 18.$$

      == tab: Applying DESMOS
      You can graph the circle $(x - h)^2 + (y - 3)^2 = r^2$ alongside the two boundary lines $y = -5$ and $x = 2$ in Desmos to verify the tangency points visually.

      1. Enter `y = -5` and `x = 2` to form the two tangent boundaries.
      2. Enter `(x - h)^2 + (y - 3)^2 = r^2` with `r = 8` and `h = 10`.
      3. Confirm that the circle touches $y = -5$ at the single point $(10, -5)$ and touches $x = 2$ at the single point $(2, 3)$, giving $h + r = 10 + 8 = \mathbf{18}$.

      :::desmos
      {
        "bounds": { "left": -15, "right": 25, "bottom": -10, "top": 15 },
        "expressions": [
          { "id": "h_val", "latex": "h = 10", "color": "#444444" },
          { "id": "r_val", "latex": "r = 8", "color": "#444444" },
          { "id": "circ", "latex": "(x - h)^2 + (y - 3)^2 = r^2", "color": "#2563eb" },
          { "id": "tan_y", "latex": "y = -5", "color": "#16a34a" },
          { "id": "tan_x", "latex": "x = 2", "color": "#d97706" },
          { "id": "center", "latex": "(10, 3)", "color": "#dc2626", "label": "Center (10, 3)", "showLabel": true }
        ],
        "caption": "Circle C centered at (10, 3) with radius r = 8 is tangent to both y = -5 at (10, -5) and x = 2 at (2, 3)."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      Because this is a **Student-Produced Response (SPR)** question, double-check that you avoided these common traps before entering **`18`**:
      * **Subtracting Instead of Adding Signed Coordinates ($2$ or $6$):** Computing $|3 - 5| = 2$ instead of $|3 - (-5)| = 8$ for the radius yields $r = 2$ and $h = 4$, giving $h + r = 6$.
      * **Reporting Only $h$ ($10$) or Only $r$ ($8$):** Stopping after finding $r = 8$ or $h = 10$ instead of computing their sum $h + r = 18$.
      * **Choosing the Negative Case ($2$):** Using $h = -6$ (from $h - 2 = -8$) gives $-6 + 8 = 2$, which violates the explicit condition that $h$ is a **positive** constant.
  - id: "sat-t1-m2h-q22"
    questionNumber: 22
    questionType: "FR"
    correctAnswer: "21"
    domain: "Geometry and Trigonometry"
    skill: "Circles"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: true
    stimulus: |
      ![](./assets/dSAT-T1-M2H-Q22.svg)

      In the figure shown, line segment $AC$ is a diameter of the circle with center $D$ and radius $6$. Point $B$ lies on the circle such that the measure of minor arc $AB$ is $\dfrac{\pi}{3}$ radians.
    prompt: |
      The area of the shaded circular segment bounded by chord $BC$ and minor arc $BC$ can be written in the form $a\pi - b\sqrt{3}$, where $a$ and $b$ are positive integers. What is the value of $a + b$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find $a + b$ after expressing the area of the **shaded circular segment** in the form $a\pi - b\sqrt{3}$. A circular segment's area is the difference between a **sector** and a **triangle**:
      $$\text{Area}_{\text{segment}} = \text{Area}(\text{Sector } BDC) - \text{Area}(\triangle BDC)$$
      First find the central angle $\angle BDC$ using the semicircle's $\pi$ radians, then compute the sector area and triangle area separately before matching $a$ and $b$.

      :::tabs

      == tab: Solving the question with Algebra
      Determine the central angle $\angle BDC$, calculate the area of sector $BDC$ and isosceles $\triangle BDC$, and subtract.

      :::derivation
      == step: Find the Central Angle BDC
      -- why: Because $AC$ is a diameter, minor arcs $AB$ and $BC$ form a semicircle totaling $\pi$ radians ($180^\circ$).
      $$
      m\angle BDC = \pi - \dfrac{\pi}{3} = {\color{#2563eb}{\dfrac{2\pi}{3}}}\text{ radians} \quad (120^\circ)
      $$

      == step: Calculate the Area of Sector BDC
      -- why: Use the radian sector area formula $\text{Area}_{\text{sector}} = \dfrac{1}{2}r^2\theta$ with $r = 6$ and $\theta = \dfrac{2\pi}{3}$ (or take $\dfrac{120^\circ}{360^\circ} = \dfrac{1}{3}$ of the circle's area $\pi(6)^2$).
      $$
      \begin{aligned}
      \text{Area}(\text{Sector } BDC) &= \dfrac{1}{2}(6)^2\left({\color{#2563eb}{\dfrac{2\pi}{3}}}\right) \\
      &= \dfrac{1}{2}(36)\left({\color{#2563eb}{\dfrac{2\pi}{3}}}\right) = {\color{#2563eb}{12}}\pi
      \end{aligned}
      $$

      == step: Calculate the Area of Triangle BDC
      -- why: Drop an altitude from center $D$ to chord $BC$ to split isosceles $\triangle BDC$ ($DB = DC = 6$, vertex angle $120^\circ$) into two $30^\circ\text{-}60^\circ\text{-}90^\circ$ right triangles, each with height $3$ and base $3\sqrt{3}$ (total base $BC = 6\sqrt{3}$).
      $$
      \begin{aligned}
      \text{Area}(\triangle BDC) &= \dfrac{1}{2}(\text{base})(\text{height}) \\[.3cm]
      &= \dfrac{1}{2}(6\sqrt{3})(3) = {\color{#d97706}{9}}\sqrt{3}
      \end{aligned}
      $$

      == step: Subtract and Match $a\pi - b\sqrt{3}$ to Find $a + b$
      -- why: Subtract the triangle area from the sector area, match the coefficients of $a\pi - b\sqrt{3}$, and compute $a + b$.
      $$
      \begin{aligned}
      \text{Area}_{\text{segment}} = {\color{#2563eb}{12}}&\pi - {\color{#d97706}{9}}\sqrt{3} \\
      \text{Matching } a&\pi - b\sqrt{3} \implies {\color{#2563eb}{a}} = {\color{#2563eb}{12}} \text{ and } {\color{#d97706}{b}} = {\color{#d97706}{9}} \\
      {\color{#2563eb}{a}} + {\color{#d97706}{b}} &= {\color{#2563eb}{12}} + {\color{#d97706}{9}} = 21
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** A $120^\circ$ isosceles triangle with legs $r$ has the **exact same area** as an equilateral triangle with side length $r$! Why? Cutting the $120^\circ$ triangle in half along its altitude creates two $30^\circ\text{-}60^\circ\text{-}90^\circ$ triangles that reassemble back-to-back into an equilateral triangle of side $6$. Using $\text{Area}_{\text{eq}} = \dfrac{s^2\sqrt{3}}{4} = \dfrac{36\sqrt{3}}{4} = 9\sqrt{3}$ avoids any trig!

      == tab: Applying DESMOS
      You can use Desmos to verify your exact radical coefficients ($12$ and $9$) against the decimal area of the circular segment.

      1. Set `r = 6` and `theta = 2 * pi / 3` in lines 1 and 2.
      2. Compute the exact segment area `S = 0.5 * r^2 * (theta - sin(theta))` in line 3 ($\approx 22.1107$).
      3. Evaluate `12 * pi - 9 * sqrt(3)` in line 4 to verify an identical match ($\approx 22.1107$), confirming $a + b = 12 + 9 = \mathbf{21}$.

      :::desmos
      {
        "bounds": { "left": -12.5, "right": 12.5, "bottom": -8, "top": 8 },
        "settings": { "squareAxes": true },
        "expressions": [
          { "id": "circle", "latex": "x^2 + y^2 = 6^2", "color": "#444444" },
          { "id": "R_val", "latex": "R = 6", "color": "#444444" },
          { "id": "ang_val", "latex": "t = \\frac{2\\pi}{3}", "color": "#444444" },
          { "id": "seg_num", "latex": "S = \\frac{1}{2}R^2(t - \\sin(t))", "color": "#2563eb" },
          { "id": "seg_exact", "latex": "12\\pi - 9\\sqrt{3}", "color": "#16a34a" },
          { "id": "ans", "latex": "12 + 9", "color": "#dc2626" }
        ],
        "caption": "Both the trigonometric circular segment formula S and 12*pi - 9*sqrt(3) evaluate to 22.1107, confirming a + b = 21."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      Because this is a **Student-Produced Response (SPR)** question, double-check that you avoided these common traps before entering **`21`**:
      * **Using Minor Arc $AB$ ($\dfrac{\pi}{3}$) Instead of Minor Arc $BC$ ($\dfrac{2\pi}{3}$) ($15$):** Computing the segment for the $60^\circ$ sector instead of the $120^\circ$ sector yields $6\pi - 9\sqrt{3}$, giving $6 + 9 = 15$.
      * **Forgetting the $\dfrac{1}{2}$ in Sector or Triangle Area ($33$ or $30$):** Using $\pi r^2 \cdot \dfrac{1}{3} = 12\pi$ is right, but forgetting $\dfrac{1}{2}$ in $\triangle BDC$ gives $18\sqrt{3} \implies 12 + 18 = 30$.
      * **Subtracting $a - b$ Instead of Adding $a + b$ ($3$):** Seeing the minus sign in $a\pi - b\sqrt{3}$ and computing $12 - 9 = 3$ instead of $12 + 9 = 21$.
---