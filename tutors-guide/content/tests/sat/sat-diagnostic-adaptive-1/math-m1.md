---
sectionId: "sat-t1-m1"
sectionTitle: "Mathematics - M1"
sectionOrder: 3
timeLimit: 2100
questions:
  - id: "sat-t1-m1-q1"
    questionNumber: 1
    questionType: "MC"
    correctAnswer: "B"
    domain: "Algebra"
    skill: "Linear Equations in Two Variables"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A moving company charges a flat service fee of &dollar;$150$ for any move, plus an additional rate of &dollar;$45$ per hour of labor. Which equation represents this situation, where $C$ is the total cost of the move in dollars and $h$ is the number of hours of labor required?
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify the linear equation in slope-intercept form ($y = mx + b$) representing total cost $C$ in terms of hours $h$ by differentiating between fixed initial costs and variable rates of change.

      :::tabs
      == tab: Solving the question with Algebra
      Translating verbal word problems into linear models requires mapping components of the prompt directly to the standard linear structure: $\text{Total} = (\text{Unit Rate} \times \text{Quantity}) + \text{Initial Value}$.

      :::derivation
      == step: Identify Fixed vs. Variable Quantities
      -- why: Isolate which quantity is constant (the $y$-intercept) and which scales per unit of time (the slope).
      $$
      \begin{aligned}
      \text{Flat service fee (fixed)} &= \mathbf{\color{#2563eb}{150}} \\
      \text{Hourly labor rate (variable)} &= \mathbf{\color{#16a34a}{45 \text{ per hour}}}
      \end{aligned}
      $$

      == step: Construct Total Variable Cost
      -- why: Multiply the unit rate by the independent variable representing hours ($h$).
      $$
      \begin{aligned}
      \text{Variable Cost} &= 45 \times h \\
      &= \mathbf{\color{#16a34a}{45h}}
      \end{aligned}
      $$

      == step: Combine Fixed and Variable Costs
      -- why: The total cost $C$ is the sum of the variable labor charges and the base initial fee.
      $$
      \begin{aligned}
      C &= \text{Variable Cost} + \text{Flat Fee} \\
      C &= \mathbf{\color{#2563eb}{45h + 150}}
      \end{aligned}
      $$
      :::
      == tab: Applying DESMOS
      While this is primarily a conceptual translation problem, Desmos can be used to verify rate of change and $y$-intercept behavior by testing boundary values (e.g., $h = 0$ hours and $h = 1$ hour).

      * At $h = 0$ hours, cost must equal the initial flat fee: $150$.
      * At $h = 1$ hour, cost must equal $150 + 45 = 195$.

      Input the candidate equations using $x$ for $h$ and $y$ for $C$, then use table generation or direct coordinate evaluation to verify $(0, 150)$ and $(1, 195)$.

      :::desmos
      {
        "bounds": { "left": -2, "right": 5, "bottom": -20, "top": 300 },
        "expressions": [
          { "id": "eq_target", "latex": "y = 45x + 150", "color": "#2563eb" },
          { "id": "p0", "latex": "(0, 150)", "color": "#16a34a", "label": "Flat Fee: (0, 150)", "showLabel": true },
          { "id": "p1", "latex": "(1, 195)", "color": "#16a34a", "label": "1 Hour: (1, 195)", "showLabel": true }
        ],
        "caption": "The graph of y = 45x + 150 passes through (0, 150) representing the base fee and increases at a constant rate of 45 per unit of x."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $C = 150h + 45$:** *Reversed Roles Trap.* Inverts the constant and the rate of change, charging &dollar;$150$ per hour and a one-time fee of &dollar;$45$.
      * **(B) $C = 45h + 150$:** **Correct.** Accurately pairs the rate of &dollar;$45$ with the variable $h$ and treats &dollar;$150$ as the constant intercept.
      * **(C) $C = \dfrac{h}{45} + 150$:** *Inverse Operation Trap.* Divides hours by the rate instead of multiplying, implying each hour adds only $\approx$ &dollar;$0.02$ to the total cost.
      * **(D) $C = 195h$:** *Over-Aggregation Trap.* Incorrectly sums the fixed fee and hourly rate ($150 + 45 = 195$) and applies the entire sum across every hour of labor.
    options:
      - id: "A"
        text: "$C = 150h + 45$"
      - id: "B"
        text: "$C = 45h + 150$"
      - id: "C"
        text: "$C = \\dfrac{h}{45} + 150$"
      - id: "D"
        text: "$C = 195h$"

  - id: "sat-t1-m1-q2"
    questionNumber: 2
    questionType: "MC"
    correctAnswer: "B"
    domain: "Geometry and Trigonometry"
    skill: "Area and Perimeter"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Rectangle $A$ has an area of $48$ square inches. The length of Rectangle $B$ is $2$ times the length of Rectangle $A$, and the width of Rectangle $B$ is $\dfrac{1}{2}$ the width of Rectangle $A$. What is the area, in square inches, of Rectangle $B$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine the new area of Rectangle $B$ after scaling the original dimensions of Rectangle $A$ by reciprocal scale factors $(2$ and $\dfrac{1}{2})$.

      :::tabs
      == tab: Solving the question with Algebra
      Directly applying dimensional scaling laws or symbolic substitution is the fastest, lowest-friction method for this question. It requires no guesswork and works instantaneously on paper.

      :::derivation
      == step: Define Original Dimensions and Area
      -- why: Express the area formula for the reference shape, Rectangle $A$.
      $$
      \begin{aligned}
      \text{Area}_A &= l \times w = \mathbf{\color{#2563eb}{48}}
      \end{aligned}
      $$

      == step: Express New Dimensions of Rectangle $B$
      -- why: Apply the linear scale factors given in the prompt to length and width.
      $$
      \begin{aligned}
      l_B &= 2l \\
      w_B &= \frac{1}{2}w
      \end{aligned}
      $$

      == step: Calculate Scaled Area
      -- why: Multiply the modified dimensions and observe how the scale factors interact via the associative and commutative properties.
      $$
      \begin{aligned}
      \text{Area}_B &= l_B \times w_B \\
      &= (2l)\left(\frac{1}{2}w\right) \\
      &= \left(2 \times \frac{1}{2}\right)(lw) \\
      &= 1(lw) = lw
      \end{aligned}
      $$

      == step: Substitute Known Area Value
      -- why: Because $lw = 48$, the total area remains completely invariant.
      $$
      \begin{aligned}
      \text{Area}_B &= \mathbf{\color{#16a34a}{48}}
      \end{aligned}
      $$
      :::

      == tab: Applying DESMOS
      While algebraic scaling takes less than 10 seconds, Desmos can serve as a sanity check by assigning concrete numbers to the unknown variables (picking sample dimensions that satisfy $l \times w = 48$). 

      *Note: Over-relying on Desmos for proportional scaling questions slows you down significantly. On advanced dSAT questions involving abstract constants ($k$ or $c$), direct dimensional analysis is far superior.*

      1. Choose simple integer dimensions for Rectangle $A$ such that $l \cdot w = 48$ (e.g., $l = 8$ and $w = 6$).
      2. Define $l_B = 2 \cdot 8 = 16$ and $w_B = \frac{1}{2} \cdot 6 = 3$.
      3. Evaluate the product $l_B \cdot w_B$.

      :::desmos
      {
        "bounds": { "left": -2, "right": 20, "bottom": -2, "top": 55 },
        "expressions": [
          { "id": "exp1", "latex": "l = 8", "color": "#2563eb" },
          { "id": "exp2", "latex": "w = 6", "color": "#2563eb" },
          { "id": "area_A", "latex": "A_{area} = l \\cdot w", "color": "#444444" },
          { "id": "area_B", "latex": "B_{area} = (2l) \\cdot (0.5w)", "color": "#16a34a" }
        ],
        "caption": "Setting sample dimensions l = 8 and w = 6 demonstrates that doubling length while halving width leaves the product exactly at 48."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) 24:** *Half-Scale Trap.* Applies only the $\dfrac{1}{2}$ width factor while forgetting that the length was simultaneously doubled ($48 \times \dfrac{1}{2} = 24$).
      * **(B) 48:** **Correct.** The multiplicative factor $2$ and the fractional factor $\dfrac{1}{2}$ are reciprocals that cancel out completely ($2 \times \dfrac{1}{2} = 1$).
      * **(C) 72:** *Perimeter / Additive Confusion Trap.* Results from mistakenly adding scale factors or miscalculating dimensions ($48 + 24 = 72$).
      * **(D) 96:** *Double-Scale Trap.* Applies only the factor of $2$ for the length while neglecting the width reduction ($48 \times 2 = 96$).
    options:
      - id: "A"
        text: "$24$"
      - id: "B"
        text: "$48$"
      - id: "C"
        text: "$72$"
      - id: "D"
        text: "$96$"

  - id: "sat-t1-m1-q3"
    questionNumber: 3
    questionType: "MC"
    correctAnswer: "C"
    domain: "Algebra"
    skill: "Linear Equations in One Variable"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The equation $A = \dfrac{1}{2}h(b_1 + b_2)$ gives the area $A$ of a trapezoid in terms of the height $h$ and the bases $b_1$ and $b_2$. Which of the following correctly expresses the value of $h$ in terms of $A$, $b_1$, and $b_2$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Rearrange a geometric formula to isolate the target variable $h$ using inverse operations (multiplication and division).

      :::tabs

      == tab: Solving the question with Algebra
      Literal equations (rearranging formulas) are solved fastest and most reliably on paper by undoing operations in reverse order of operations.

      :::derivation
      == step: State the Given Formula
      -- why: Identify how the variable $h$ is currently bound to the other terms.
      $$
      \begin{aligned}
      A &= \frac{1}{2}h(b_1 + b_2)
      \end{aligned}
      $$

      == step: Clear the Fractional Coefficient
      -- why: Multiply both sides of the equation by $2$ (the reciprocal of $\dfrac{1}{2}$) to eliminate the fraction.
      $$
      \begin{aligned}
      2 \cdot A &= 2 \cdot \left(\frac{1}{2}h(b_1 + b_2)\right) \\
      \mathbf{\color{#2563eb}{2A}} &= h(b_1 + b_2)
      \end{aligned}
      $$

      == step: Isolate Variable h
      -- why: Divide both sides by the entire grouped quantity $(b_1 + b_2)$ to undo multiplication.
      $$
      \begin{aligned}
      \frac{2A}{b_1 + b_2} &= \frac{h(b_1 + b_2)}{b_1 + b_2} \\
      h &= \mathbf{\frac{2A}{b_1 + b_2}}
      \end{aligned}
      $$
      :::

      == tab: Applying DESMOS
      Literal equations contain only variables, meaning they cannot be graphed directly as functions of $x$ and $y$ without assigning values. While algebraic isolation takes under 10 seconds, you can use Desmos as a verification engine by plugging in easy test values for each variable.

      *Note: Setting up arbitrary sliders or constants in Desmos for pure formula rearrangement is slow and prone to input errors. Mastering manual inverse operations is far more effective for literal equations on the dSAT.*

      1. Choose non-zero test values for the independent variables: let $h = 4$, $b_1 = 3$, and $b_2 = 5$.
      2. Compute the resulting area: $A = \frac{1}{2}(4)(3 + 5) = 16$.
      3. Test which candidate expression evaluates back to $h = 4$ when using $A = 16$, $b_1 = 3$, and $b_2 = 5$.

      :::desmos
      {
        "bounds": { "left": -2, "right": 20, "bottom": -2, "top": 20 },
        "expressions": [
          { "id": "exp_A", "latex": "A = 16", "color": "#2563eb" },
          { "id": "exp_b1", "latex": "b_{1} = 3", "color": "#2563eb" },
          { "id": "exp_b2", "latex": "b_{2} = 5", "color": "#2563eb" },
          { "id": "test_C", "latex": "\\frac{2A}{b_{1} + b_{2}}", "color": "#16a34a" }
        ],
        "caption": "Evaluating 2A / (b_1 + b_2) with A = 16, b_1 = 3, and b_2 = 5 outputs 4, matching the target value of h."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $h = 2A - b_1 - b_2$:** *Operation Confusion Trap.* Incorrectly applies subtraction instead of division to separate the factor $(b_1 + b_2)$ from $h$.
      * **(B) $h = \dfrac{A}{2(b_1 + b_2)}$:** *Reciprocal Error Trap.* Divides by $2$ instead of multiplying by $2$, placing the constant $2$ in the denominator.
      * **(C) $h = \dfrac{2A}{b_1 + b_2}$:** **Correct.** Successfully multiplies by $2$ and divides by the binomial sum $(b_1 + b_2)$.
      * **(D) $h = A - \dfrac{1}{2}(b_1 + b_2)$:** *Additive Structure Trap.* Treats the relationship as additive rather than multiplicative, subtracting terms from $A$.
    options:
      - id: "A"
        text: "$h = 2A - b_1 - b_2$"
      - id: "B"
        text: "$h = \\dfrac{A}{2(b_1 + b_2)}$"
      - id: "C"
        text: "$h = \\dfrac{2A}{b_1 + b_2}$"
      - id: "D"
        text: "$h = A - \\dfrac{1}{2}(b_1 + b_2)$"

  - id: "sat-t1-m1-q4"
    questionNumber: 4
    questionType: "MC"
    correctAnswer: "A"
    domain: "Algebra"
    skill: "Linear Inequalities in Two Variables"
    difficulty: "Easy"
    containsGraph: true
    containsChart: false
    containsDiagram: false
    stimulus: |
      ![](./assets/dSAT-T1-M1-Q4.svg)

      The given graph shows the solution to a linear inequality.
    prompt: |
      Which of the following could represent that inequality?
    explanation: |
      ### Takeoff: What were you asked to find?
      Match the given shaded coordinate plane to its symbolic inequality by identifying the boundary line style (strict vs. non-strict) and the direction of shading relative to the boundary.

      :::tabs

      == tab: Solving the question with Heuristics & Visual Inspection
      Linear inequality graphs can be solved in seconds through two visual checks: line style (dashed vs. solid) and shading direction (above vs. below).

      :::derivation
      == step: Inspect Boundary Line Style
      -- why: A dashed boundary line means points directly on the line are excluded from the solution set, requiring a strict inequality ($>$ or $<$).
      A **dashed boundary line** indicates a strict inequality ($>$ or $<$), excluding points that lie directly on the line. 

      *This immediately eliminates options B and C, which feature non-strict inequalities ($\le$ and $\ge$).*

      == step: Inspect Shading Direction
      -- why: In slope-intercept form $y > mx + b$ or $y < mx + b$, the inequality symbol directly governs vertical shading relative to the boundary line.
      The solution set is shaded **above** the boundary line. For an inequality solved for $y$, shading above corresponds to the greater-than symbol:

      $$
      y > -\dfrac{2}{3}x + 4
      $$

      == step: Verify with a Test Point
      -- why: Pick a simple coordinate clearly outside the shaded region, such as the origin $(0, 0)$, to confirm that it produces a false statement.
      The origin $(0, 0)$ lies in the unshaded region, so substituting $(0, 0)$ must yield a false statement:
      $$
      \begin{aligned}
      0 &> -\dfrac{2}{3}(0) + 4 \\
      0 &> 4 \quad \text{(False)}
      \end{aligned}
      $$
      Because $(0, 0)$ is false, the half-plane that does not contain the origin is shaded, confirming the equation.
      :::

      == tab: Applying DESMOS
      While direct visual inspection is much faster, Desmos can instantly confirm the visual match by typing the candidate inequalities and comparing the rendered region and boundary style to the prompt diagram.

      *Note: Entering inequalities into Desmos is an effective fallback if you ever second-guess boundary dash styles or shading rules under test pressure.*

      1. Enter `y > -2/3 x + 4`.
      2. Observe that Desmos automatically renders a **dashed boundary line** and shades the region **above** the line.
      3. Verify that the boundary crosses $(0, 4)$ and $(6, 0)$, exactly matching the prompt.

      :::desmos
      {
        "bounds": { "left": -7, "right": 11, "bottom": -9, "top": 9 },
        "expressions": [
          { "id": "ineq", "latex": "y > -\\frac{2}{3}x + 4", "color": "#2563eb" },
          { "id": "p1", "latex": "(0, 4)", "color": "#16a34a", "label": "y-int (0, 4)", "showLabel": true },
          { "id": "p2", "latex": "(6, 0)", "color": "#16a34a", "label": "x-int (6, 0)", "showLabel": true },
          { "id": "origin", "latex": "(0, 0)", "color": "#dc2626", "label": "(0, 0) Unshaded", "showLabel": true }
        ],
        "caption": "Desmos automatically renders y > -2/3x + 4 with a dashed boundary passing through (0, 4) and (6, 0), with shading covering the upper half-plane."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $y > -\dfrac{2}{3}x + 4$:** **Correct.** The dashed line corresponds to a strict inequality ($>$), and points above the line satisfy $y > mx + b$.
      * **(B) $y \le -\dfrac{2}{3}x + 4$:** *Boundary & Shading Double Trap.* Uses $\le$, which requires a solid line and shading below the line (including the origin).
      * **(C) $y \ge -\dfrac{2}{3}x + 4$:** *Boundary Line Trap.* Correctly identifies shading above the line, but uses $\ge$ (which requires a solid boundary line).
      * **(D) $y < -\dfrac{2}{3}x + 4$:** *Direction Trap.* Correctly recognizes the dashed boundary line, but shades the region below the line rather than above it.
    options:
      - id: "A"
        text: "$y > -\\dfrac{2}{3}x + 4$"
      - id: "B"
        text: "$y \\le -\\dfrac{2}{3}x + 4$"
      - id: "C"
        text: "$y \\ge -\\dfrac{2}{3}x + 4$"
      - id: "D"
        text: "$y < -\\dfrac{2}{3}x + 4$"

  - id: "sat-t1-m1-q5"
    questionNumber: 5
    questionType: "FR"
    correctAnswer: "120"
    domain: "Problem-Solving and Data Analysis"
    skill: "Ratios, Rates, and Proportions"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A bag contains only red and blue marbles. The number of red marbles, $R$, to the number of blue marbles, $B$, in the bag is $11$ to $4$. If there are $88$ red marbles, what is the total number of marbles in the bag?
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine the total marble count $(R + B)$ using the part-to-part ratio $11:4$ and the known quantity of red marbles ($R = 88$).

      :::tabs

      == tab: Solving the question with Algebra
      Proportions and scaling multipliers are solved fastest mentally or with direct scratchwork. You can either scale to find the missing part or scale the total ratio directly.

      :::derivation
      == step: Determine the Scale Factor (Multiplier)
      -- why: Find the common multiplier $x$ that scales the ratio parts to the actual quantities.
      Using the ratio $\dfrac{R}{B} = \dfrac{11}{4}$ and $R = 88$:
      $$
      \begin{aligned}
      11x &= 88 \\
      x &= \frac{88}{11} = 8
      \end{aligned}
      $$
      Each "part" of the ratio corresponds to $8$ marbles.

      == step: Method 1 — Calculate Blue Marbles and Sum
      -- why: Multiply the blue ratio term by the multiplier and add to the red marbles.
      $$
      \begin{aligned}
      B &= 4x = 4(8) = 32 \\
      \text{Total} &= R + B = 88 + 32 = \mathbf{120}
      \end{aligned}
      $$

      == step: Method 2 — Direct Total Ratio Scaling (Faster)
      -- why: Sum the ratio parts first to find the total relative units, then scale by the multiplier in a single operation.
      $$
      \begin{aligned}
      \text{Total Parts} &= 11 + 4 = 15 \\
      \text{Total Marbles} &= 15 \times 8 = \mathbf{120}
      \end{aligned}
      $$
      :::

      == tab: Applying DESMOS
      While direct arithmetic is faster than typing, Desmos can serve as a simple scratchpad or proportion solver to eliminate manual calculation errors.

      *Note: For simple ratio and proportion word problems, setting up equations in Desmos often takes more time than basic scratchwork. Reserve Desmos for multi-step proportions or equations with messy decimals.*

      1. In line 1, enter the proportion to solve for $B$: `88 / B = 11 / 4` (or let Desmos find the root of `88 / x - 11 / 4 = 0`).
      2. In line 2, evaluate the sum: `88 + 32`.

      :::desmos
      {
        "bounds": { "left": -80, "right": 80, "bottom": -20, "top": 140 },
        "expressions": [
          { "id": "scale", "latex": "x = \\frac{88}{11}", "color": "#2563eb" },
          { "id": "blue", "latex": "B = 4x", "color": "#2563eb" },
          { "id": "total", "latex": "88 + B", "color": "#16a34a" }
        ],
        "caption": "Line 1 computes the multiplier x = 8. Line 2 determines B = 32. Line 3 evaluates the total count 88 + 32 = 120."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **32:** *Wrong Target Trap.* This is the number of blue marbles ($B = 4 \times 8$), not the total number of marbles in the bag.
      * **8:** *Multiplier Trap.* This is the scale factor ($88 \div 11$), representing the size of one ratio part rather than the total count.
      * **120:** **Correct.** Directly sums the red and blue counts ($88 + 32 = 120$) or scales the combined ratio units ($15 \times 8 = 120$).

  - id: "sat-t1-m1-q6"
    questionNumber: 6
    questionType: "MC"
    correctAnswer: "A"
    domain: "Problem-Solving and Data Analysis"
    skill: "Percentages"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A researcher found that the number of active users on a platform increased by $20\%$ from Year $1$ to Year $2$, and then decreased by $15\%$ from Year $2$ to Year $3$. If the number of users in Year $3$ was $k$ times the number of users in Year $1$, what is the value of $k$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine the cumulative scale factor $k$ resulting from consecutive percentage changes (a $20\%$ increase followed by a $15\%$ decrease).

      :::tabs

      == tab: Solving the question with Algebra
      Consecutive percentage changes are solved fastest by converting each percentage shift into its decimal multiplier (growth or decay factor) and multiplying them directly.

      :::derivation
      == step: Convert Percentage Changes to Multipliers
      -- why: An increase of $p\%$ corresponds to a multiplier of $(1 + r)$, and a decrease of $p\%$ corresponds to $(1 - r)$, where $r = \dfrac{p}{100}$.
      For Year 1 to Year 2 ($20\%$ increase):
      $$1 + 0.20 = 1.20$$

      For Year 2 to Year 3 ($15\%$ decrease):
      $$1 - 0.15 = 0.85$$

      == step: Compound the Multipliers
      -- why: Express Year 3 in terms of Year 1 by chaining the consecutive multipliers.
      Let $U_1$, $U_2$, and $U_3$ represent the user counts across Years 1, 2, and 3:
      $$
      \begin{aligned}
      U_2 &= 1.20 \cdot U_1 \\
      U_3 &= 0.85 \cdot U_2 \\
      U_3 &= 0.85(1.20 \cdot U_1) \\
      U_3 &= (1.20 \times 0.85) U_1
      \end{aligned}
      $$

      == step: Evaluate the Combined Multiplier k
      -- why: The prompt defines $U_3 = k \cdot U_1$, so $k$ is the product of the two multipliers.
      $$
      \begin{aligned}
      k &= 1.20 \times 0.85 \\
      k &= \mathbf{1.02}
      \end{aligned}
      $$
      :::

      == tab: Applying DESMOS
      While algebraic compounding takes only a single product, you can use Desmos as a direct scratchpad or test the scenario with a concrete initial value (such as $100$ users).

      *Note: Avoid over-complicating percentage problems with elaborate functions or sliders in Desmos. Multiplying the decay and growth multipliers directly in a single line is all that is required.*

      1. In line 1, enter the direct product of the multipliers: `(1 + 0.20)(1 - 0.15)`.
      2. Alternatively, set an initial population `y_1 = 100`, compute `y_3 = 100(1.20)(0.85) = 102`, and evaluate the ratio `y_3 / y_1`.

      :::desmos
      {
        "bounds": { "left": -1, "right": 5, "bottom": -0.5, "top": 2 },
        "expressions": [
          { "id": "mult", "latex": "k = (1 + 0.20)(1 - 0.15)", "color": "#2563eb" },
          { "id": "test_pop", "latex": "100 \\cdot 1.20 \\cdot 0.85", "color": "#16a34a" },
          { "id": "ratio", "latex": "\\frac{102}{100}", "color": "#444444" }
        ],
        "caption": "Line 1 directly evaluates (1.20)(0.85) = 1.02. Lines 2 and 3 confirm with a starting population of 100 that the resulting count is 102, giving k = 1.02."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) 1.02:** **Correct.** Accurately multiplies the successive factors: $1.20 \times 0.85 = 1.02$.
      * **(B) 1.05:** *Additive Trap.* Erroneously adds and subtracts the raw percentages ($20\% - 15\% = +5\% \implies 1.05$), failing to recognize that the $15\%$ decrease applies to the larger, already-increased population.
      * **(C) 1.35:** *Addition of Multipliers Trap.* Adds the two percentage amounts directly ($20\% + 15\% = 35\% \implies 1.35$), treating the decrease as an increase.
      * **(D) 1.38:** *Double Increase Trap.* Calculates consecutive increases ($1.20 \times 1.15 = 1.38$) instead of accounting for the $15\%$ decrease.
    options:
      - id: "A"
        text: "$1.02$"
      - id: "B"
        text: "$1.05$"
      - id: "C"
        text: "$1.35$"
      - id: "D"
        text: "$1.38$"

  - id: "sat-t1-m1-q7"
    questionNumber: 7
    questionType: "MC"
    correctAnswer: "C"
    domain: "Problem-Solving and Data Analysis"
    skill: "Unit Conversions"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      An astronomer measures the distance to a nearby star to be $8$ parsecs. Which of the following is closest to the distance to the star in light-years? ($1\text{ parsec} \approx 3.26\text{ light-years}$)
    explanation: |
      ### Takeoff: What were you asked to find?
      Convert an astronomical distance from parsecs to light-years using dimensional analysis and the given conversion factor ($1\text{ parsec} \approx 3.26\text{ light-years}$).

      :::tabs

      == tab: Solving the question with Algebra
      Unit conversion questions are solved most reliably on scratch paper by setting up a conversion factor where unwanted units cancel out.

      :::derivation
      == step: Set Up the Conversion Ratio
      -- why: Align units so that parsecs cancel out and light-years remain in the numerator.
      Given that $1\text{ parsec} \approx 3.26\text{ light-years}$, set up the dimensional ratio:
      $$
      8\text{ parsecs} \times \frac{3.26\text{ light-years}}{1\text{ parsec}}
      $$

      == step: Multiply and Evaluate
      -- why: Cancel the unit "parsec" and evaluate the numerical product.
      $$
      \begin{aligned}
      \text{Distance} &= 8 \times 3.26 \\
      &= \mathbf{26.08\text{ light-years}}
      \end{aligned}
      $$
      :::

      == tab: Applying DESMOS
      Because this is a single arithmetic operation, you can use Desmos as a direct scratchpad calculator to eliminate multiplication mistakes.

      *Note: Dimensional analysis relies on knowing whether to multiply or divide. Desmos will only calculate the value you input—it will not prevent an inverted unit error if you divide instead of multiply.*

      In line 1, enter the product: `8 * 3.26`.

      :::desmos
      {
        "bounds": { "left": -2, "right": 10, "bottom": -5, "top": 35 },
        "expressions": [
          { "id": "calc", "latex": "8 \\cdot 3.26", "color": "#2563eb" }
        ],
        "caption": "Evaluating 8 * 3.26 yields 26.08 directly."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) 2.45:** *Inverted Operation Trap.* Divides by the conversion factor instead of multiplying ($8 \div 3.26 \approx 2.45$).
      * **(B) 11.26:** *Additive Trap.* Adds the distance and the conversion rate together ($8 + 3.26 = 11.26$) instead of multiplying them.
      * **(C) 26.08:** **Correct.** Directly multiplies $8 \times 3.26 = 26.08$.
      * **(D) 32.60:** *Place Value Trap.* Scales the conversion factor by $10$ instead of $8$ ($3.26 \times 10 = 32.60$).
    options:
      - id: "A"
        text: "$2.45$"
      - id: "B"
        text: "$11.26$"
      - id: "C"
        text: "$26.08$"
      - id: "D"
        text: "$32.60$"

  - id: "sat-t1-m1-q8"
    questionNumber: 8
    questionType: "MC"
    correctAnswer: "B"
    domain: "Algebra"
    skill: "Linear Equations in Two Variables"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A school cafeteria sells apples for &dollar;$0.75$ each and bananas for &dollar;$0.40$ each. On Tuesday morning, the cafeteria collected a total of &dollar;$116.00$ from the sale of $220$ total pieces of fruit (apples and bananas combined). How many more bananas than apples were sold?
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify the system of linear equations modeling total items and total revenue. The question asks for the difference $(B - A)$, not just an individual quantity.

      :::tabs
      == tab: Solving the question with DESMOS
      When all coefficients and constants are fully known, graphing the system in Desmos is the fastest, lowest-risk execution method on the dSAT. 
      Let $x = \text{apples}$ and $y = \text{bananas}$. Type both equations into Desmos:
      
      * $x + y = 220$
      * $0.75x + 0.40y = 116$
      
      Click the intersection point to inspect the coordinates: $(80, 140)$.
      In line 3, immediately enter: $140 - 80$, which outputs **$60$**.

      :::desmos
      {
        "bounds": { "left": -20, "right": 260, "bottom": -20, "top": 300 },
        "expressions": [
          { "id": "eq1", "latex": "x + y = 220", "color": "#2563eb" },
          { "id": "eq2", "latex": "0.75x + 0.40y = 116", "color": "#16a34a" },
          { "id": "pt", "latex": "(80, 140)", "color": "#dc2626", "label": "(80, 140)", "showLabel": true },
          { "id": "ans", "latex": "140 - 80", "color": "#444444" }
        ],
        "caption": "Lines 1 & 2 plot the constraints. The red dot confirms the intersection at (80, 140). Line 3 calculates 140 - 80 = 60 directly."
      }
      :::

      == tab: Solving the question with Algebra
      While DESMOS is an excellent tool for _this_ question, mastering algebraic substitution and elimination is essential for harder dSAT questions where unknown constants (like $k$ or $c$) can prevent direct graphing.

      :::derivation
      == step: Set Up System of Equations
      -- why: Express one variable in terms of the other using the total piece count constraint ($220$).
      $$
      \begin{aligned}
      A + B &= 220 \\
      A &= \mathbf{\color{#2563eb}{220 - B}}
      \end{aligned}
      $$

      == step: Substitute into Revenue Equation
      -- why: Replace $A$ to collapse the system into a single linear equation in $B$.
      $$
      \begin{aligned}
      0.75A + 0.40B &= 116 \\
      0.75(\mathbf{\color{#2563eb}{220 - B}}) + 0.40B &= 116
      \end{aligned}
      $$

      == step: Expand and Isolate Variable $B$
      -- why: Distribute $0.75$ and collect like terms. Ensure the negative signs cancel correctly on division.
      $$
      \begin{aligned}
      165 - 0.75B + 0.40B &= 116 \\
      165 - 0.35B &= 116 \\
      -0.35B &= -49 \\
      B &= \frac{-49}{-0.35} = \mathbf{\color{#2563eb}{140}}
      \end{aligned}
      $$

      == step: Solve for Target Difference $(B - A)$
      -- why: Avoid the classic trap of selecting $140$ or $80$. The prompt specifically demands $(B - A)$.
      $$
      \begin{aligned}
      A &= 220 - 140 = 80 \\
      B - A &= 140 - 80 = \mathbf{60}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) 40:** *Miscalculation Trap.* Result of misreading total fruit or arithmetic errors during subtraction.
      * **(B) 60:** **Correct.** Directly evaluates $140 - 80 = 60$.
      * **(C) 80:** *Wrong Target Trap.* This is the number of apples sold ($A$), not the difference between bananas and apples.
      * **(D) 140:** *Wrong Target Trap.* This is the number of bananas sold ($B$).
    options:
      - id: "A"
        text: "40"
      - id: "B"
        text: "60"
      - id: "C"
        text: "80"
      - id: "D"
        text: "140"

  - id: "sat-t1-m1-q9"
    questionNumber: 9
    questionType: "SPR"
    correctAnswer: "34"
    domain: "Advanced Math"
    skill: "Nonlinear Functions"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The function $f$ is defined by $f(x) = (2x - 3)(x + 5)$. If $f(a) = 0$ and $a > 0$, what is the value of $f(a + 2)$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the positive root $a$ of the factored quadratic function, shift that input by $+2$, and evaluate the function at the new value: $f(a + 2)$.

      :::tabs

      == tab: Solving the question with Algebra
      Factored quadratics allow you to read zeros directly via the Zero Product Property. Solving on paper requires three clear steps: find the positive root, add $2$, and substitute back in.

      :::derivation
      == step: Find the Roots of f(x)
      -- why: Apply the Zero Product Property by setting each factor equal to zero.
      Given $f(a) = (2a - 3)(a + 5) = 0$:
      $$
      \begin{aligned}
      2a - 3 &= 0 \implies 2a = 3 \implies a = \frac{3}{2} = 1.5 \\
      a + 5 &= 0 \implies a = -5
      \end{aligned}
      $$

      == step: Select the Valid Root
      -- why: The prompt specifies the constraint $a > 0$, eliminating the negative root.
      Since $a > 0$:
      $$a = 1.5$$

      == step: Calculate the Target Input (a + 2)
      -- why: Avoid evaluating at $a$ directly; the question asks for $f(a + 2)$.
      $$a + 2 = 1.5 + 2 = 3.5$$

      == step: Evaluate f(a + 2)
      -- why: Substitute $x = 3.5$ back into the original function definition.
      $$
      \begin{aligned}
      f(3.5) &= (2(3.5) - 3)(3.5 + 5) \\
      &= (7 - 3)(8.5) \\
      &= (4)(8.5) = \mathbf{34}
      \end{aligned}
      $$
      :::

      == tab: Applying DESMOS
      Desmos makes evaluating multi-step function compositions fast and eliminates mental arithmetic mistakes entirely.

      *Note: When a problem defines a named function like $f(x)$, defining it in Desmos allows you to solve both the root finding and subsequent evaluation in just two lines.*

      1. In line 1, define the function: `f(x) = (2x - 3)(x + 5)`.
      2. Inspect the $x$-intercepts on the graph. The positive intercept is at $x = 1.5$.
      3. In line 2, directly define `a = 1.5`.
      4. In line 3, type `f(a + 2)`. Desmos automatically outputs **$34$**.

      :::desmos
      {
        "bounds": { "left": -7, "right": 6, "bottom": -35, "top": 40 },
        "expressions": [
          { "id": "fx", "latex": "f(x) = (2x - 3)(x + 5)", "color": "#2563eb" },
          { "id": "root_pos", "latex": "(1.5, 0)", "color": "#16a34a", "label": "a = 1.5", "showLabel": true },
          { "id": "root_neg", "latex": "(-5, 0)", "color": "#9ca3af", "label": "a = -5 (discard)", "showLabel": true },
          { "id": "eval_pt", "latex": "(3.5, f(3.5))", "color": "#dc2626", "label": "(3.5, 34)", "showLabel": true },
          { "id": "ans", "latex": "f(1.5 + 2)", "color": "#444444" }
        ],
        "caption": "Line 1 defines f(x). The graph identifies the positive root at x = 1.5. Entering f(1.5 + 2) immediately evaluates to 34."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **34:** **Correct Answer.** Directly evaluates $f(1.5 + 2) = f(3.5) = (4)(8.5) = 34$.
      * **17:** *Arithmetic Factor Trap.* Results from dropping the factor of $2$ when multiplying $(7 - 3)(8.5) \implies 2 \times 8.5 = 17$ instead of $4 \times 8.5$.
      * **1.5:** *Wrong Target Trap.* Identifies the correct value of $a$, but fails to evaluate $f(a + 2)$.
      * **3.5:** *Input Trap.* Correctly calculates the new input value $a + 2 = 1.5 + 2 = 3.5$, but forgets to evaluate the function $f(x)$ at this input.
      * **-9:** *Negative Root Trap.* Uses the extraneous root $a = -5$, calculating $a + 2 = -3$ and evaluating $f(-3) = (2(-3) - 3)(-3 + 5) = (-9)(2) = -18$.

  - id: "sat-t1-m1-q10"
    questionNumber: 10
    questionType: "MC"
    correctAnswer: "A"
    domain: "Advanced Math"
    skill: "Equivalent Expressions"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Which expression is equivalent to $\dfrac{3}{c} + \dfrac{c}{6}$, where $c > 0$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Combine two rational terms with distinct algebraic denominators into a single equivalent fractional expression by finding the least common denominator.

      :::tabs

      == tab: Solving the question with Algebra
      Combining algebraic fractions on paper requires finding a common denominator and scaling each numerator accordingly. It is fast, direct, and avoids calculator setup.

      :::derivation
      == step: Determine the Least Common Denominator (LCD)
      -- why: The denominators are $c$ and $6$. Because they share no common factors, their least common denominator is their product.
      $$
      \text{LCD} = 6 \cdot c = 6c
      $$

      == step: Rewrite Each Fraction Over the LCD
      -- why: Multiply each fraction by a form of $1$ (e.g., $\dfrac{6}{6}$ or $\dfrac{c}{c}$) to convert both denominators to $6c$ without altering their values.
      For the first fraction:
      $$
      \frac{3}{c} \cdot \frac{6}{6} = \frac{18}{6c}
      $$
      For the second fraction:
      $$
      \frac{c}{6} \cdot \frac{c}{c} = \frac{c^2}{6c}
      $$

      == step: Add Numerators Over the Common Denominator
      -- why: Once denominators match, combine numerators directly over the single common denominator $6c$.
      $$
      \begin{aligned}
      \frac{18}{6c} + \frac{c^2}{6c} &= \frac{18 + c^2}{6c}
      \end{aligned}
      $$
      :::

      == tab: Applying DESMOS
      Because this problem contains an abstract variable $c$ rather than $x$ and $y$, you cannot graph it directly without replacing $c$ with $x$ or defining a test value for $c$. 

      *Note: Entering rational test values into Desmos takes considerably more time than finding the LCD mentally. Use Desmos primarily as a sanity check if you are uncertain of your fraction addition.*

      1. In line 1, enter the target expression substituting $x$ for $c$: `y = 3/x + x/6`.
      2. In line 2, enter option A: `y = (18 + x^2) / (6x)`.
      3. Observe that both graphs overlap completely for all $x > 0$.
      4. Alternatively, assign a test value like `c = 2`:
        * Target expression: `3/2 + 2/6 = 1.5 + 0.333... = 1.833...`
        * Option A: `(18 + 2^2) / (6 * 2) = 22 / 12 = 1.833...`

      :::desmos
      {
        "bounds": { "left": -2, "right": 10, "bottom": -2, "top": 8 },
        "expressions": [
          { "id": "target", "latex": "y = \\frac{3}{x} + \\frac{x}{6}", "color": "#2563eb" },
          { "id": "choice_A", "latex": "y = \\frac{18 + x^{2}}{6x}", "color": "#16a34a", "lineStyle": "DASHED" }
        ],
        "caption": "The solid curve of the original expression and the dashed curve of (18 + x^2)/(6x) overlap perfectly across the domain x > 0."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\dfrac{18 + c^2}{6c}$:** **Correct.** Accurately converts both fractions to the common denominator $6c$, yielding $\dfrac{18}{6c} + \dfrac{c^2}{6c} = \dfrac{18 + c^2}{6c}$.
      * **(B) $\dfrac{3 + c}{c + 6}$:** *Across-the-Bar Addition Trap.* Adds numerators straight across and denominators straight across, violating the fundamental rules of fraction addition.
      * **(C) $\dfrac{18 + c}{6c}$:** *Incomplete Scaling Trap.* Correctly scales the first numerator by $6$ ($3 \times 6 = 18$), but forgets to multiply the second numerator by $c$, writing $c$ instead of $c^2$.
      * **(D) $\dfrac{3c}{6}$:** *Cross-Multiplication / Cancellation Trap.* Confuses fraction addition with cross-canceling or multiplication.
    options:
      - id: "A"
        text: "$\\dfrac{18 + c^2}{6c}$"
      - id: "B"
        text: "$\\dfrac{3 + c}{c + 6}$"
      - id: "C"
        text: "$\\dfrac{18 + c}{6c}$"
      - id: "D"
        text: "$\\dfrac{3c}{6}$"

  - id: "sat-t1-m1-q11"
    questionNumber: 11
    questionType: "MC"
    correctAnswer: "D"
    domain: "Algebra"
    skill: "Linear Equations in Two Variables"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The line $L$ passes through the points $(4, 5)$ and $(15, 12)$. If the point $(x, 10)$ lies on line $L$, what is the value of $x$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine the missing $x$-coordinate for a point on line $L$ given that line $L$ passes through two fully defined coordinate pairs, $(4, 5)$ and $(15, 12)$.

      :::tabs

      == tab: Solving the question with Algebra
      Because the slope between any two pairs of points on a single straight line is constant, setting two slope expressions equal allows you to solve for the missing coordinate directly without finding the full equation of the line.

      :::derivation
      == step: Calculate the Slope of Line L
      -- why: Use the two fully known points $(4, 5)$ and $(15, 12)$ to determine the constant rate of change.
      $$
      m = \frac{12 - 5}{15 - 4} = \frac{7}{11}
      $$

      == step: Set Up the Proportional Slope Expression
      -- why: Apply the slope formula between the reference point $(4, 5)$ and the target point $(x, 10)$ using the known slope $\dfrac{7}{11}$.
      $$
      \begin{aligned}
      \frac{10 - 5}{x - 4} &= \frac{7}{11} \\
      \frac{5}{x - 4} &= \frac{7}{11}
      \end{aligned}
      $$

      == step: Cross-Multiply and Solve for x
      -- why: Clear the denominators to isolate the variable $x$.
      $$
      \begin{aligned}
      7(x - 4) &= 5 \times 11 \\
      7x - 28 &= 55 \\
      7x &= 55 + 28 \\
      7x &= 83 \\
      x &= \mathbf{\frac{83}{7}}
      \end{aligned}
      $$
      :::

      == tab: Applying DESMOS
      When coordinate fractions become cumbersome, Desmos provides a rapid, arithmetic-free way to find the unknown coordinate by plotting the line and inspecting its intersection with the horizontal line $y = 10$.

      *Note: Entering two points and finding an intersection in Desmos eliminates fractional cross-multiplication errors under time pressure.*

      1. In line 1, use the two-point form directly or construct a table with $(4, 5)$ and $(15, 12)$ using linear regression: `y_1 ~ m x_1 + b`.
      2. Alternatively, write the line using point-slope form with the known points: `y - 5 = ((12 - 5)/(15 - 4))(x - 4)`.
      3. In line 2, graph the target horizontal line: `y = 10`.
      4. Click the intersection point to inspect the coordinates: `(11.857, 10)`.
      5. In line 3, type `83 / 7` to verify the fraction converts to `11.85714...`.

      :::desmos
      {
        "bounds": { "left": -2, "right": 20, "bottom": -2, "top": 16 },
        "expressions": [
          { "id": "line_L", "latex": "y - 5 = \\frac{7}{11}(x - 4)", "color": "#2563eb" },
          { "id": "target_y", "latex": "y = 10", "color": "#16a34a", "lineStyle": "DASHED" },
          { "id": "p1", "latex": "(4, 5)", "color": "#2563eb", "label": "(4, 5)", "showLabel": true },
          { "id": "p2", "latex": "(15, 12)", "color": "#2563eb", "label": "(15, 12)", "showLabel": true },
          { "id": "pt_int", "latex": "(\\frac{83}{7}, 10)", "color": "#dc2626", "label": "(83/7, 10)", "showLabel": true }
        ],
        "caption": "The intersection of line L with y = 10 occurs at x = 83/7 ≈ 11.857."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\dfrac{59}{7}$:** *Sign Error Trap.* Subtracts $28$ instead of adding it during the isolation step ($55 - 28 = 27 \implies 7x = 59$ if combined with miscalculated numerators).
      * **(B) $\dfrac{66}{7}$:** *Denominator Misalignment Trap.* Cross-multiplies incorrectly by pairing $11 \times 6$ rather than $11 \times 5$.
      * **(C) $\dfrac{72}{7}$:** *Arithmetic Slip Trap.* Makes an addition error when summing $55$ and constants ($55 + 17 = 72$).
      * **(D) $\dfrac{83}{7}$:** **Correct.** Accurately establishes the slope $\dfrac{7}{11}$ and solves $7x - 28 = 55 \implies 7x = 83 \implies x = \dfrac{83}{7}$.
    options:
      - id: "A"
        text: "$\\dfrac{59}{7}$"
      - id: "B"
        text: "$\\dfrac{66}{7}$"
      - id: "C"
        text: "$\\dfrac{72}{7}$"
      - id: "D"
        text: "$\\dfrac{83}{7}$"

  - id: "sat-t1-m1-q12"
    questionNumber: 12
    questionType: "MC"
    correctAnswer: "D"
    domain: "Algebra"
    skill: "Linear Equations in Two Variables"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      $$
      \begin{aligned}
      4a& + 2b = 18 \\
      3b& = 2 + 4a
      \end{aligned}
      $$

      The system of equations above has a solution $(a, b)$. What is the value of $10b$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Solve the system of two linear equations for the composite target expression $10b$, rather than just the single variable $b$.

      :::tabs

      == tab: Solving the question with Algebra
      High-scoring dSAT test takers look for ways to solve directly for the asked-for expression as a single unit. Because the target is $10b$, reaching $5b$ allows you to double both sides immediately—saving time and completely bypassing the trap of accidentally selecting $b = 4$.

      :::derivation
      == step: Substitute the Block Term (4a)
      -- why: Rearrange the second equation to express the identical term $4a$ in terms of $b$, then substitute it directly into the first equation.
      Rearrange $3b = 2 + 4a$ by subtracting $2$ from both sides:
      $$4a = 3b - 2$$

      Substitute $(3b - 2)$ for $4a$ in the first equation:
      $$
      \begin{aligned}
      (3b - 2) + 2b &= 18 \\
      5b - 2 &= 18
      \end{aligned}
      $$

      == step: Isolate the Intermediate Expression (5b)
      -- why: Add $2$ to both sides to find the value of $5b$.
      $$5b = 20$$

      == step: Scale Directly to the Target Expression (10b)
      -- why: Notice that $10b$ is exactly twice $5b$. Multiply both sides by $2$ to solve for the target unit in one step, neutralizing the risk of solving down to $b = 4$ and picking option A.
      $$
      \begin{aligned}
      2 \cdot (5b) &= 2 \cdot (20) \\
      \mathbf{10b} &= \mathbf{40}
      \end{aligned}
      $$
      :::

      == tab: Applying DESMOS
      Because this is a linear system with fully known constants, Desmos can instantly find the values of $a$ and $b$ by replacing $a$ with $x$ and $b$ with $y$, then clicking the intersection point.

      *Note: While Desmos easily provides the intersection point $(2.5, 4)$, test takers who do not write down the requested target often glance at the coordinate $y = 4$ and immediately select option A. Always check your target before reading coordinates.*

      1. In line 1, enter: `4x + 2y = 18`.
      2. In line 2, enter: `3y = 2 + 4x`.
      3. Click the intersection point to inspect the coordinates: `(2.5, 4)`.
      4. In line 3, multiply the $y$-value by $10$: `10 * 4`, which outputs **$40$**.

      :::desmos
      {
        "bounds": { "left": -2, "right": 8, "bottom": -2, "top": 10 },
        "expressions": [
          { "id": "eq1", "latex": "4x + 2y = 18", "color": "#2563eb" },
          { "id": "eq2", "latex": "3y = 2 + 4x", "color": "#16a34a" },
          { "id": "pt_int", "latex": "(2.5, 4)", "color": "#dc2626", "label": "(a, b) = (2.5, 4)", "showLabel": true },
          { "id": "eval", "latex": "10 \\cdot 4", "color": "#444444" }
        ],
        "caption": "Lines 1 and 2 graph the constraints, intersecting at (2.5, 4). Line 3 scales the y-coordinate to evaluate 10b = 10(4) = 40."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) 4:** *Wrong Target Trap.* Solves all the way down to $b = 4$ and selects it directly without scaling up to $10b$. Solving for $10b$ as a unit ($2 \times 5b = 40$) avoids this trap completely.
      * **(B) 10:** *Coefficient Confusion Trap.* Confuses the multiplier $10$ with the value of the expression, or makes an isolation error where $b = 1$.
      * **(C) 20:** *Intermediate Step Trap.* Solves for the intermediate expression $5b = 20$ but forgets to double it to reach $10b$.
      * **(D) 40:** **Correct.** Directly scales $5b = 20$ by a factor of $2$ to evaluate $10b = 40$.
    options:
      - id: "A"
        text: "$4$"
      - id: "B"
        text: "$10$"
      - id: "C"
        text: "$20$"
      - id: "D"
        text: "$40$"

  - id: "sat-t1-m1-q13"
    questionNumber: 13
    questionType: "FR"
    correctAnswer: "8"
    domain: "Algebra"
    skill: "Linear Equations in One Variable"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The equation $L = 0.6x + 5.2$ models the length $L$, in feet, of a spring when a mass of $x$ kilograms is attached to it. What mass, in kilograms, must be attached to the spring for its length to be $10$ feet?
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine the input value $x$ (mass in kilograms) that produces an output value $L = 10$ (spring length in feet) using the linear model $L = 0.6x + 5.2$.

      :::tabs

      == tab: Solving the question with Algebra
      Linear evaluation with one known dependent variable is solved cleanly by substituting the output value and isolating the independent variable using standard inverse operations.

      :::derivation
      == step: Substitute the Given Output Value
      -- why: The prompt specifies that the spring length $L$ is $10$ feet, so replace $L$ with $10$.
      $$10 = 0.6x + 5.2$$

      == step: Isolate the Variable Term
      -- why: Subtract the constant initial length ($5.2$) from both sides.
      $$
      \begin{aligned}
      10 - 5.2 &= 0.6x \\
      4.8 &= 0.6x
      \end{aligned}
      $$

      == step: Solve for Mass x
      -- why: Divide by the rate coefficient $0.6$. Clearing decimals ($\frac{48}{6}$) makes the division effortless.
      $$
      \begin{aligned}
      x &= \frac{4.8}{0.6} = \frac{48}{6} = \mathbf{8}
      \end{aligned}
      $$
      :::

      == tab: Applying DESMOS
      Desmos can solve any single-variable linear equation instantly by graphing the equation directly and clicking the vertical line intercept, or graphing both sides as separate lines.

      *Note: Entering one-variable equations directly into Desmos is a quick sanity check, but be sure to type $x$ (not $L$) so Desmos plots a vertical line along the $x$-axis.*

      1. In line 1, enter the equation directly: `10 = 0.6x + 5.2`.
      2. Click the resulting vertical line to read the $x$-intercept: `(8, 0)`.
      3. Alternatively, enter `y = 0.6x + 5.2` and `y = 10`, then click their intersection point: `(8, 10)`.

      :::desmos
      {
        "bounds": { "left": -2, "right": 14, "bottom": -2, "top": 14 },
        "expressions": [
          { "id": "eq_line", "latex": "y = 0.6x + 5.2", "color": "#2563eb" },
          { "id": "target_y", "latex": "y = 10", "color": "#16a34a", "lineStyle": "DASHED" },
          { "id": "pt_int", "latex": "(8, 10)", "color": "#dc2626", "label": "x = 8", "showLabel": true }
        ],
        "caption": "The spring length model y = 0.6x + 5.2 intersects the target length y = 10 at x = 8."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **8:** **Correct Answer.** Substituting $L = 10$ yields $4.8 = 0.6x \implies x = 8$.
      * **11.2:** *Reversed Input/Output Trap.* Evaluates $L$ for an input of $x = 10$ ($0.6(10) + 5.2 = 6 + 5.2 = 11.2$) instead of solving for the mass that produces a length of $10$.
      * **4.8:** *Premature Termination Trap.* Subtracts $5.2$ from $10$ to get $4.8$, but forgets to divide by the rate coefficient $0.6$.
      * **0.8:** *Decimal Shift Trap.* Makes a place-value slip during division, evaluating $4.8 \div 0.6$ as $0.8$ instead of $8$.

  - id: "sat-t1-m1-q14"
    questionNumber: 14
    questionType: "MC"
    correctAnswer: "C"
    domain: "Advanced Math"
    skill: "Exponential Functions"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      $$
      P(m) = 101(2.718)^{-0.125m}
      $$

      The atmospheric pressure, $P$, in kilopascals, at an altitude of $m$ kilometers above sea level is modeled by the function above. According to the model, what is the atmospheric pressure, in kilopascals, at sea level?
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify the initial atmospheric pressure $P(0)$ when the altitude is at sea level ($m = 0$) by recognizing the standard structure of an exponential model $f(x) = a \cdot b^x$.

      :::tabs

      == tab: Solving the question with Algebra
      In any exponential model of the form $f(x) = a \cdot b^{kx}$, the coefficient $a$ represents the initial value when the input is zero, because any non-zero base raised to the power of zero equals $1$.

      :::derivation
      == step: Identify the Sea Level Input Condition
      -- why: The variable $m$ represents altitude above sea level, meaning sea level corresponds to an altitude of zero.
      $$m = 0$$

      == step: Substitute m = 0 into the Function
      -- why: Evaluate the function directly at the baseline condition.
      $$
      \begin{aligned}
      P(0) &= 101(2.718)^{-0.125(0)} \\
      &= 101(2.718)^{0}
      \end{aligned}
      $$

      == step: Apply the Zero Exponent Rule
      -- why: For any non-zero real number $b$, $b^0 = 1$.
      $$
      \begin{aligned}
      (2.718)^{0} &= 1 \\
      P(0) &= 101(1) = \mathbf{101}
      \end{aligned}
      $$
      :::

      == tab: Solving the question with DESMOS
      While recognizing the initial value $a = 101$ takes less than 3 seconds by sight, Desmos can be used to evaluate the function or inspect the $y$-intercept.

      *Note: Entering long decimal exponential models into Desmos wastes valuable test time when the question only asks for the initial value (the vertical intercept). Memorizing the structure $y = a \cdot b^x$ is far more efficient.*

      1. In line 1, define the function: `P(m) = 101(2.718)^(-0.125m)`.
      2. In line 2, evaluate at sea level: `P(0)`.
      3. Desmos immediately outputs **$101$**.

      :::desmos
      {
        "bounds": { "left": -2, "right": 10, "bottom": -10, "top": 120 },
        "expressions": [
          { "id": "model", "latex": "y = 101(2.718)^{-0.125x}", "color": "#2563eb" },
          { "id": "y_int", "latex": "(0, 101)", "color": "#16a34a", "label": "Sea Level: (0, 101)", "showLabel": true },
          { "id": "eval", "latex": "101(2.718)^{0}", "color": "#444444" }
        ],
        "caption": "The curve crosses the vertical axis at (0, 101), confirming that the pressure at an altitude of m = 0 is exactly 101 kilopascals."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) 1:** *Zero Exponent Misapplication Trap.* Replaces the entire expression with $1$ upon seeing the exponent evaluate to $0$, forgetting to multiply by the leading coefficient $101$.
      * **(B) 2.718:** *Base Confusion Trap.* Confuses the base of the exponential term with the value of the function at $m = 0$.
      * **(C) 101:** **Correct.** Directly evaluates $P(0) = 101(2.718)^0 = 101(1) = 101$.
      * **(D) 101.125:** *Additive Parameter Trap.* Incorrectly adds the exponent rate parameter ($0.125$) to the base coefficient ($101$).
    options:
      - id: "A"
        text: "$1$"
      - id: "B"
        text: "$2.718$"
      - id: "C"
        text: "$101$"
      - id: "D"
        text: "$101.125$"

  - id: "sat-t1-m1-q15"
    questionNumber: 15
    questionType: "MC"
    correctAnswer: "A"
    domain: "Advanced Math"
    skill: "Radical Equations"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      If $\sqrt{2x + 15} = x + 6$, what is the set of all real solutions to the equation?
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine the set of all valid real solutions to a radical equation, ensuring that any extraneous roots created by squaring are detected and discarded.

      :::tabs

      == tab: Solving the question with DESMOS
      Graphing both sides of a radical equation in Desmos is the optimal execution method on the dSAT. Desmos naturally graphs only the principal (non-negative) square root, instantly revealing real intersections and completely eliminating the risk of falling for extraneous roots.

      1. In line 1, graph the left-hand side: `y = \sqrt{2x + 15}`.
      2. In line 2, graph the right-hand side: `y = x + 6`.
      3. Click the intersection point to inspect the coordinate: `(-3, 3)`.
      4. Observe that there is only one intersection point at $x = -3$. At $x = -7$, the linear function drops to $-1$, which cannot intersect the non-negative radical curve, immediately proving $x = -7$ is extraneous.

      :::desmos
      {
        "bounds": { "left": -10, "right": 4, "bottom": -3, "top": 8 },
        "expressions": [
          { "id": "f_sqrt", "latex": "y = \\sqrt{2x + 15}", "color": "#2563eb" },
          { "id": "f_line", "latex": "y = x + 6", "color": "#16a34a" },
          { "id": "valid_pt", "latex": "(-3, 3)", "color": "#dc2626", "label": "Valid: (-3, 3)", "showLabel": true },
          { "id": "ext_pt1", "latex": "(-7, 1)", "color": "#9ca3af", "label": "(-7, 1)", "showLabel": true },
          { "id": "ext_pt2", "latex": "(-7, -1)", "color": "#9ca3af", "label": "(-7, -1)", "showLabel": true }
        ],
        "caption": "The curves intersect only once at (-3, 3). At x = -7, the linear function equals -1, which cannot equal the principal square root value of 1."
      }
      :::

      == tab: Solving the question with Algebra
      While Desmos provides the fastest verification, mastering algebraic isolation and extraneous root checking is critical for questions that contain unknown constants ($k$ or $c$) that prevent direct graphing.

      :::derivation
      == step: Square Both Sides
      -- why: Eliminate the radical by raising both sides to the second power. Remember to expand $(x + 6)^2$ as a full binomial square.
      $$
      \begin{aligned}
      (\sqrt{2x + 15})^2 &= (x + 6)^2 \\
      2x + 15 &= x^2 + 12x + 36
      \end{aligned}
      $$

      == step: Set Quadratic Equal to Zero and Factor
      -- why: Collect all terms onto one side of the equation to find candidate roots via factoring.
      $$
      \begin{aligned}
      0 &= x^2 + 12x - 2x + 36 - 15 \\
      0 &= x^2 + 10x + 21 \\
      0 &= (x + 3)(x + 7)
      \end{aligned}
      $$
      Setting each factor to zero yields candidate solutions:
      $$x = -3 \quad \text{or} \quad x = -7$$

      == step: Test for Extraneous Solutions
      -- why: The radical symbol denotes the principal (non-negative) square root. The right-hand side $(x + 6)$ must equal the non-negative output.
      Test $x = -3$:
      $$
      \begin{aligned}
      \sqrt{2(-3) + 15} &= -3 + 6 \\
      \sqrt{9} &= 3 \\
      3 &= 3 \quad \text{(Valid)}
      \end{aligned}
      $$

      Test $x = -7$:
      $$
      \begin{aligned}
      \sqrt{2(-7) + 15} &= -7 + 6 \\
      \sqrt{1} &= -1 \\
      1 &= -1 \quad \text{(Extraneous)}
      \end{aligned}
      $$
      Because $x = -7$ fails the test in the original equation, the solution set contains only $\{-3\}$.
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\\{-3\\}$:** **Correct.** Accurately identifies both algebraic candidates and eliminates $x = -7$ as an extraneous root since $\sqrt{1} \neq -1$.
      * **(B) $\\{-3, 7\\}$:** *Sign Flip Trap.* Makes a sign error when solving the factor $(x + 7) = 0$, incorrectly writing positive $7$ instead of $-7$.
      * **(C) $\\{-3, -7\\}$:** *Extraneous Root Trap.* Solves the quadratic $x^2 + 10x + 21 = 0$ correctly but forgets that squaring both sides can introduce extraneous solutions that do not satisfy the original radical.
      * **(D) $\\{-7\\}$:** *Reversed Validation Trap.* Keeps the extraneous root while discarding the actual valid solution.
    options:
      - id: "A"
        text: "$\\{-3\\}$"
      - id: "B"
        text: "$\\{-3, 7\\}$"
      - id: "C"
        text: "$\\{-3, -7\\}$"
      - id: "D"
        text: "$\\{-7\\}$"

  - id: "sat-t1-m1-q16"
    questionNumber: 16
    questionType: "FR"
    correctAnswer: "4"
    domain: "Advanced Math"
    skill: "Quadratic Equations"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A system of equations consists of $y = 2x^2 - 12x + 20$ and $y = mx - 12$. If the system has exactly one real solution $(x, y)$, and $m > 0$, what is the value of $m$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the positive value of the parameter $m$ such that the linear-quadratic system has exactly one real solution, meaning the line is tangent to the parabola.

      :::tabs

      == tab: Solving the question with Algebra
      When a line intersects a parabola at exactly one point, setting their expressions equal results in a quadratic equation whose discriminant ($\Delta = b^2 - 4ac$) must equal zero.

      :::derivation
      == step: Set Up the Combined Quadratic Equation
      -- why: Equate the two expressions for $y$ to solve for the $x$-coordinates of intersection.
      $$
      \begin{aligned}
      2x^2 - 12x + 20 &= mx - 12 \\
      2x^2 - 12x - mx + 20 + 12 &= 0 \\
      2x^2 - (12 + m)x + 32 &= 0
      \end{aligned}
      $$
      Here, the standard form coefficients are 
      
      $$
      a = 2 \quad b = -(12 + m) \quad c = 32
      $$

      == step: Apply the Discriminant Condition
      -- why: Exactly one real solution occurs if and only if the discriminant $\Delta = b^2 - 4ac$ equals $0$.
      $$
      \begin{aligned}
      \Delta = b^2 - 4ac &= 0 \\
      [-(12 + m)]^2 - 4(2)(32) &= 0 \\
      (12 + m)^2 - 256 &= 0 \\
      (12 + m)^2 &= \mathbf{\color{#2563eb}{256}}
      \end{aligned}
      $$

      == step: Solve for the Parameter $m$
      -- why: Take the square root of both sides, remembering to apply the constraint $m > 0$.
      $$
      \begin{aligned}
      12 + m &= \pm\sqrt{256} \\
      12 + m &= \pm 16
      \end{aligned}
      $$
      Evaluating both branches:
      * $12 + m = 16 \implies m = 16 - 12 = \mathbf{4}$
      * $12 + m = -16 \implies m = -16 - 12 = -28$

      Since the problem specifies that $m > 0$, we conclude $m = \mathbf{4}$.
      :::

      == tab: Solving the question with DESMOS
      Using an interactive slider allows you to visually pinpoint tangency on the dSAT:

      1. In line 1, graph the fixed parabola: `y = 2x^2 - 12x + 20`.
      2. In line 2, graph the line with parameter $m$: `y = mx - 12`.
      3. Add a slider for $m$ (restricted to $m > 0$). Drag $m$ starting from $1$ upward until the line touches the curve at exactly one point of tangency instead of slicing through it twice or missing it entirely. Notice that tangency occurs cleanly when $m = 4$.
      4. IMPORTANT: This only works because of the slider's natural calibration and the fact that the anwser is an integer. You must be able to perform the necessary algebra in situations where the answer is more complicated.

      :::desmos
      {
        "bounds": { "left": -4, "right": 10, "bottom": -16, "top": 28 },
        "expressions": [
          { "id": "parabola", "latex": "y = 2x^2 - 12x + 20", "color": "#2563eb" },
          { "id": "line", "latex": "y = mx - 12", "color": "#16a34a" },
          { 
            "id": "slider_m", 
            "latex": "m = 1", 
            "slider": { "min": "0", "max": "10", "step": "0.5" } 
          }
        ],
        "caption": "Adjust the slider for m. When m < 4 the line misses the parabola; at m = 4 it touches at exactly one point (4, 4); for m > 4 it cuts across two points."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Entering -28:** *Constraint Oversight Trap.* Solved the quadratic equation $(12 + m)^2 = 256$ to get $12 + m = -16 \implies m = -28$, but missed the given condition $m > 0$.
      * **Entering 16:** *Intermediate Step Trap.* Stopped after taking the square root ($\sqrt{256} = 16$) and forgot to subtract $12$ to isolate $m$.
      * **Entering 4:** **Correct.** Accurately isolated $m = 16 - 12 = 4$, satisfying $m > 0$.

  - id: "sat-t1-m1-q17"
    questionNumber: 17
    questionType: "MC"
    correctAnswer: "B"
    domain: "Problem Solving and Data Analysis"
    skill: "Scatterplots and Modeling"
    difficulty: "Medium"
    containsGraph: true
    containsChart: false
    containsDiagram: false
    stimulus: |
      ![](./assets/dSAT-T1-M1-Q17.svg)

      A scientist is studying the melting rate of four identical ice blocks in a room held at a constant temperature. Each data point on the scatterplot represents the weight of one specific block of ice, $y$ (in ounces), measured after it had been melting for a specific number of hours, $x$. A line of best fit for the data is given by $y = -1.2x + 14.5$.
    prompt: |
      Which of the following is the best interpretation of the $x$-intercept of this line?
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify the real-world contextual meaning of the line of best fit's $x$-intercept by determining what condition occurs when $y = 0$.

      :::tabs

      == tab: Solving the question with Algebra
      In a linear modeling context, intercepts are defined by setting the opposite variable to zero and mapping the result back to physical units.

      :::derivation
      == step: Define the Meaning of the Variables
      -- why: Ground each axis in the given problem scenario before interpreting intercepts.
      * $x$ represents the **time elapsed** (in hours).
      * $y$ represents the **predicted weight** of the ice block (in ounces).

      == step: Calculate the $x$-Intercept
      -- why: The $x$-intercept is the point on the line where the dependent variable $y$ equals $0$.
      Set $y = 0$ in the linear model:
      $$
      \begin{aligned}
      0 &= -1.2x + 14.5 \\
      1.2x &= 14.5 \\
      x &= \frac{14.5}{1.2} \approx \mathbf{12.08\text{ hours}}
      \end{aligned}
      $$

      == step: Map the Coordinates to Physical Meaning
      -- why: Translate $(12.1, 0)$ into plain English within the context of the study.

      **Zero Weight:** When $y = 0$, the ice block has a weight of **$0$ ounces**, meaning it has melted completely.

      **Model vs. Measurement:** Because this comes from a line of best fit rather than raw experimental data, it represents a **predicted value**, not a guaranteed actual measurement.

      **Conclusion:** The $x$-intercept means *the predicted amount of time it takes for an ice block to melt completely is approximately $12.1$ hours*.
      :::

      == tab: Applying DESMOS
      You can graph the line of best fit in Desmos to click and confirm both intercepts directly:

      1. In line 1, graph the model: `y = -1.2x + 14.5 {x >= 0} {y >= 0}`.
      2. Click on the gray point where the line meets the horizontal axis ($x$-axis). Desmos will display the coordinates: `(12.083, 0)`.
      3. Because the vertical coordinate ($y$, weight in ounces) is $0$, the block has completely melted at $x \approx 12.1$ hours.

      :::desmos
      {
        "bounds": { "left": -2, "right": 16, "bottom": -2, "top": 18 },
        "expressions": [
          { "id": "line", "latex": "y = -1.2x + 14.5 \\left\\{0 \\le x \\le 12.083\\right\\}", "color": "#2563eb" },
          { "id": "x_int", "latex": "(12.083, 0)", "color": "#dc2626", "label": "x-intercept: (12.1, 0)", "showLabel": true },
          { "id": "y_int", "latex": "(0, 14.5)", "color": "#16a34a", "label": "y-intercept: (0, 14.5)", "showLabel": true }
        ],
        "caption": "The line crosses the x-axis at (12.083, 0). At y = 0 ounces (completely melted), the elapsed time x is approximately 12.1 hours."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) The predicted initial weight of each ice block before melting began was 14.5 ounces:** *Intercept Confusion Trap.* This describes the **$y$-intercept** $(0, 14.5)$, where time $x = 0$ hours, not the $x$-intercept.
      * **(B) The predicted amount of time it takes for an ice block to melt completely is approximately 12.1 hours:** **Correct.** Accurately pairs $y = 0$ ounces (fully melted) with $x \approx 12.1$ hours as a model prediction.
      * **(C) For every 1 hour that passes, the predicted weight of an ice block decreases by 1.2 ounces:** *Slope vs. Intercept Trap.* This is the interpretation of the **slope** ($m = -1.2$), representing the rate of change per hour.
      * **(D) The actual time it took for every ice block in the study to reach 0 ounces was exactly 12.1 hours:** *Prediction vs. Reality Trap.* A line of best fit provides a statistical *model* (predicted estimate); it does not guarantee the *actual* measurement for every individual sample in the real world.
    options:
      - id: "A"
        text: "The predicted initial weight of each ice block before melting began was $14.5$ ounces."
      - id: "B"
        text: "The predicted amount of time it takes for an ice block to melt completely is approximately $12.1$ hours."
      - id: "C"
        text: "For every $1$ hour that passes, the predicted weight of an ice block decreases by $1.2$ ounces."
      - id: "D"
        text: "The actual time it took for every ice block in the study to reach $0$ ounces was exactly $12.1$ hours."

  - id: "sat-t1-m1-q18"
    questionNumber: 18
    questionType: "MC"
    correctAnswer: "D"
    domain: "Algebra"
    skill: "Systems of Equations"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Which of the following systems of equations has no solution?
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify which system represents two parallel lines that never intersect, meaning their variable coefficients are directly proportional but their constant terms are not.

      :::tabs

      == tab: Solving the question with Algebra
      A system of two linear equations in standard form ($Ax + By = C$) has **no solution** when the lines have identical slopes but different $y$-intercepts:
      $$
      \dfrac{A_1}{A_2} = \dfrac{B_1}{B_2} \neq \dfrac{C_1}{C_2}
      $$

      :::derivation
      == step: Rule for Number of Solutions
      -- why: Establish the algebraic criteria governing intersections in standard form.

      **Single Solution:** The lines intersect at one point if their coefficient ratios differ: $\dfrac{A_1}{A_2} \neq \dfrac{B_1}{B_2}$.

      **Infinitely Many Solutions:** The equations describe the exact same line when all ratios match: $\dfrac{A_1}{A_2} = \dfrac{B_1}{B_2} = \dfrac{C_1}{C_2}$.

      **No Solution:** The lines are parallel and distinct when the variable ratios match but the constants produce a contradiction: $\dfrac{A_1}{A_2} = \dfrac{B_1}{B_2} \neq \dfrac{C_1}{C_2}$.

      == step: Test Option D
      -- why: Align the coefficients of both equations using a scalar multiplier to test for consistency.

      Multiply the first equation by $3$:
      $$
      \begin{aligned}
      3(2x + y) &= 3(4) \\
      6x + 3y &= \mathbf{\color{#2563eb}{12}}
      \end{aligned}
      $$

      Subtract the second given equation ($6x + 3y = 10$):
      $$
      \begin{aligned}
      (6x + 3y) - (6x + 3y) &= 12 - 10 \\
      \mathbf{0} &= \mathbf{2}
      \end{aligned}
      $$

      **Contradiction:** Because $0 = 2$ is mathematically false for all values of $x$ and $y$, the two lines never intersect. Therefore, the system has **no solution**.
      :::

      == tab: Solving the question with DESMOS
      On the dSAT, you can type candidate systems directly into Desmos. Parallel lines will visually never cross:

      1. In line 1, enter: `2x + y = 4`.
      2. In line 2, enter: `6x + 3y = 10`.
      3. Notice that both lines run in the exact same direction with equal steepness (slope $m = -2$) but different vertical intercepts ($y = 4$ versus $y \approx 3.33$). Because they remain parallel everywhere, there is no intersection point.

      :::desmos
      {
        "bounds": { "left": -6, "right": 8, "bottom": -6, "top": 8 },
        "expressions": [
          { "id": "eq1", "latex": "2x + y = 4", "color": "#2563eb" },
          { "id": "eq2", "latex": "6x + 3y = 10", "color": "#dc2626" }
        ],
        "caption": "The two lines share a slope of -2 but have different y-intercepts (4 and 10/3). Because parallel lines never meet, the system has no solution."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) One Solution Trap:** Adding the equations eliminates $y$ immediately ($2x = 10 \implies x = 5, y = 0$). This system intersects at exactly one coordinate point, $(5, 0)$.
      * **(B) Infinitely Many Solutions Trap:** Multiplying the top equation by $2$ yields $4x - 6y = 12$, which is identical to the second equation. This represents the same line twice, producing infinitely many solutions.
      * **(C) Infinitely Many Solutions Trap:** Dividing the top equation by $5$ gives $x + 2y = 3$, which matches the second equation completely, yielding infinitely many solutions.
      * **(D) Correct:** Scaling the first equation produces $6x + 3y = 12$, conflicting with $6x + 3y = 10$ ($12 \neq 10$). The lines are parallel and distinct, resulting in no solution.
    options:
      - id: "A"
        text: "$\\begin{aligned} &x + y = 5 \\\\ &x - y = 5 \\end{aligned}$"
      - id: "B"
        text: "$\\begin{aligned} &2x - 3y = 6 \\\\ &4x - 6y = 12 \\end{aligned}$"
      - id: "C"
        text: "$\\begin{aligned} &5x + 10y = 15 \\\\ &x + 2y = 3 \\end{aligned}$"
      - id: "D"
        text: "$\\begin{aligned} &2x + y = 4 \\\\ &6x + 3y = 10 \\end{aligned}$"

  - id: "sat-t1-m1-q19"
    questionNumber: 19
    questionType: "MC"
    correctAnswer: "A"
    domain: "Geometry and Trigonometry"
    skill: "Area and Perimeter"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A scalene triangle has sides of length $2a$, $3a$, and $4a$, where $a > 0$. A square has side length $s$. If the perimeter of the triangle is $P$ and the perimeter of the square is $S$, what is $s + a$ in terms of $S$ and $P$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Express the sum of the side lengths $(s + a)$ in terms of the given perimeters $S$ and $P$ by isolating each variable and finding a common denominator.

      :::tabs

      == tab: Solving the question with Algebra
      Perimeter formulas relate linear dimensions directly to total boundary lengths. Isolate the side variables first before combining fractional expressions.

      :::derivation
      == step: Express $a$ in Terms of $P$
      -- why: Use the definition of perimeter (sum of all side lengths) for the triangle.

      Sum the three side lengths to find the total perimeter $P$:
      $$
      \begin{aligned}
      P &= 2a + 3a + 4a \\
      P &= 9a \\
      a &= \mathbf{\color{#2563eb}{\frac{P}{9}}}
      \end{aligned}
      $$

      *(Note: The triangle exists and is valid because the side lengths satisfy the Triangle Inequality Theorem: $2a + 3a = 5a > 4a$.)*

      == step: Express $s$ in Terms of $S$
      -- why: Relate the side length of a square to its total perimeter $S$.

      A square has $4$ congruent sides of length $s$:
      $$
      \begin{aligned}
      S &= 4s \\
      s &= \mathbf{\color{#2563eb}{\frac{S}{4}}}
      \end{aligned}
      $$

      == step: Add the Terms and Combine Fractions
      -- why: Form the target sum $s + a$ and compute a common denominator for $4$ and $9$.

      Substitute the expressions for $s$ and $a$:
      $$
      s + a = \frac{S}{4} + \frac{P}{9}
      $$

      The least common multiple of $4$ and $9$ is $36$. Multiply each term by the appropriate factor:
      $$
      \begin{aligned}
      s + a &= \frac{S \times 9}{4 \times 9} + \frac{P \times 4}{9 \times 4} \\[.4cm]
      &= \frac{9S}{36} + \frac{4P}{36} \\[.4cm]
      &= \mathbf{\frac{9S + 4P}{36}}
      \end{aligned}
      $$
      :::

      == tab: Applying DESMOS
      For abstract algebraic questions with multiple parameters, pick simple test values in Desmos to evaluate the target expression and test the answer options instantly:

      1. Choose convenient side lengths: let $a = 1$ and $s = 1$.
      2. Enter the corresponding perimeters:
        * Triangle perimeter: `P = 2(1) + 3(1) + 4(1) = 9`
        * Square perimeter: `S = 4(1) = 4`
      3. The target value is $s + a = 1 + 1 = \mathbf{2}$.
      4. Type each answer choice into Desmos using your defined `S` and `P` values to see which produces $2$.

      :::desmos
      {
        "bounds": { "left": -2, "right": 10, "bottom": -2, "top": 12 },
        "expressions": [
          { "id": "P_val", "latex": "P = 9", "color": "#2563eb" },
          { "id": "S_val", "latex": "S = 4", "color": "#16a34a" },
          { "id": "target", "latex": "s_a = 1 + 1", "color": "#444444" },
          { "id": "optA", "latex": "\\frac{9S + 4P}{36}", "color": "#dc2626" },
          { "id": "optC", "latex": "\\frac{4S + 9P}{36}", "color": "#9333ea" }
        ],
        "caption": "Defining P = 9 and S = 4 gives a target of s + a = 2. Option A evaluates directly to (9(4) + 4(9))/36 = 72/36 = 2."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) Correct:** Accurately calculates $s = \dfrac{S}{4}$ and $a = \dfrac{P}{9}$, yielding $\dfrac{9S + 4P}{36}$ after applying the common denominator $36$.
      * **(B) Denominator Addition Trap:** Adds the individual denominators ($4 + 9 = 13$) directly ($\dfrac{S}{4} + \dfrac{P}{9} \to \dfrac{S + P}{13}$), violating fraction addition rules.
      * **(C) Inverted Coefficients Trap:** Cross-multiplies incorrectly, applying the coefficient $4$ to $S$ and $9$ to $P$ ($\dfrac{4S + 9P}{36}$).
      * **(D) Common Denominator Trap:** Multiplies the denominators together to obtain $36$, but doubles it to $72$ without doubling the numerator, or adds $36 + 36$ in the denominator.
    options:
      - id: "A"
        text: "$\\dfrac{9S + 4P}{36}$"
      - id: "B"
        text: "$\\dfrac{S + P}{13}$"
      - id: "C"
        text: "$\\dfrac{4S + 9P}{36}$"
      - id: "D"
        text: "$\\dfrac{9S + 4P}{72}$"

  - id: "sat-t1-m1-q20"
    questionNumber: 20
    questionType: "MC"
    correctAnswer: "C"
    domain: "Problem Solving and Data Analysis"
    skill: "Rates"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A printer initially produces pages at a rate of $120$ pages every $3$ minutes. After printing the first $2{,}400$ pages, the printer's rate decreases by $25\%$ due to a power-save mode. To the nearest tenth of an hour, how many total hours will it take for the printer to complete a $7{,}200$-page document?
    explanation: |
      ### Takeoff: What were you asked to find?
      Calculate the total print time in hours for a $7{,}200$-page print job divided into two phases: the first $2{,}400$ pages printed at full speed, and the remaining pages printed at a $25\%$ reduced speed.

      :::tabs

      == tab: Solving the question with Algebra
      Multi-stage rate problems require tracking both job size and production speed per phase, converting minutes to hours to match the requested final units.

      :::derivation
      == step: Determine Initial Rate in Pages per Hour
      -- why: Convert the rate from pages per minute to pages per hour to streamline all subsequent time calculations.

      Find the speed in pages per minute:
      $$
      r_1 = \frac{120\text{ pages}}{3\text{ minutes}} = 40\text{ pages/min}
      $$

      Convert to hours by multiplying by $60\text{ minutes/hour}$:
      $$
      r_1 = 40 \times 60 = \mathbf{\color{#2563eb}{2{,}400\text{ pages/hour}}}
      $$

      == step: Calculate Time for Phase 1
      -- why: Apply the fundamental work formula $\text{Time} = \dfrac{\text{Work}}{\text{Rate}}$ to the first batch of pages.

      **Phase 1 Work:** The printer produces the first $2{,}400$ pages at rate $r_1$:
      $$
      t_1 = \frac{2{,}400\text{ pages}}{2{,}400\text{ pages/hour}} = \mathbf{1.0\text{ hour}}
      $$

      == step: Determine the Reduced Rate and Remaining Work
      -- why: Apply the $25\%$ percentage decrease and determine how many pages remain to be printed.

      **Remaining Job Size:**
      $$
      \text{Pages remaining} = 7{,}200 - 2{,}400 = \mathbf{4{,}800\text{ pages}}
      $$

      **Reduced Speed ($r_2$):** A $25\%$ decrease means the printer operates at $100\% - 25\% = 75\%$ of its original speed:
      $$
      r_2 = 2{,}400 \times (1 - 0.25) = 2{,}400 \times 0.75 = \mathbf{\color{#2563eb}{1{,}800\text{ pages/hour}}}
      $$

      == step: Calculate Phase 2 Time and Sum Total Hours
      -- why: Compute time spent on the second phase and sum $t_1 + t_2$, rounding to the nearest tenth.

      **Phase 2 Time ($t_2$):**
      $$
      t_2 = \frac{4{,}800\text{ pages}}{1{,}800\text{ pages/hour}} = \frac{8}{3} \approx 2.667\text{ hours}
      $$

      **Total Time:**
      $$
      \text{Total} = t_1 + t_2 = 1.0 + 2.667 = 3.667 \approx \mathbf{3.7\text{ hours}}
      $$
      :::

      == tab: Applying DESMOS
      Desmos functions as an error-free scratchpad for chaining rates and conversions directly in sequential lines:

      1. In line 1, define the original hourly rate: `r_1 = (120 / 3) * 60`.
      2. In line 2, compute the reduced rate: `r_2 = r_1 * 0.75`.
      3. In line 3, sum the times for both phases: `(2400 / r_1) + (4800 / r_2)`.
      4. Desmos outputs `3.6666...`, which rounds to **$3.7$**.

      :::desmos
      {
        "bounds": { "left": -2, "right": 10, "bottom": -2, "top": 10 },
        "expressions": [
          { "id": "r1", "latex": "r_{1}=\\frac{120}{3}\\cdot60", "color": "#2563eb" },
          { "id": "r2", "latex": "r_{2}=r_{1}\\cdot0.75", "color": "#16a34a" },
          { "id": "total_time", "latex": "T=\\frac{2400}{r_{1}}+\\frac{4800}{r_{2}}", "color": "#dc2626" }
        ],
        "caption": "Line 1 defines r_1 = 2400 pages/hr. Line 2 calculates r_2 = 1800 pages/hr. Line 3 evaluates total time as 1 + 2.667 = 3.667 hours (rounds to 3.7)."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) 3.0:** *No Rate Reduction Trap.* Calculates the entire $7{,}200$ pages at the initial speed of $2{,}400$ pages/hour ($7{,}200 \div 2{,}400 = 3.0$ hours), ignoring the slowdown.
      * **(B) 3.4:** *Misapplied Reduction Trap.* Applies the $25\%$ slowdown to the total time or miscalculates the second phase using an incorrect reduced rate (e.g., subtracting $25$ pages/min instead of $25\%$).
      * **(C) 3.7:** **Correct.** Accurately computes $1.0\text{ hr}$ for the first $2{,}400$ pages and $2.67\text{ hrs}$ for the remaining $4{,}800$ pages, giving $3.67 \approx 3.7$ hours.
      * **(D) 4.0:** *Full Document Slowdown Trap.* Calculates the entire $7{,}200$-page job at the reduced speed of $1{,}800$ pages/hour ($7{,}200 \div 1{,}800 = 4.0$ hours), ignoring that the first $2{,}400$ pages were printed at full speed.
    options:
      - id: "A"
        text: "$3.0$"
      - id: "B"
        text: "$3.4$"
      - id: "C"
        text: "$3.7$"
      - id: "D"
        text: "$4.0$"

  - id: "sat-t1-m1-q21"
    questionNumber: 21
    questionType: "MC"
    correctAnswer: "B"
    domain: "Geometry and Trigonometry"
    skill: "Circles"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A circle in the $xy$-plane has the equation $x^2 + y^2 - 6hx + 2ky = 0$, where $h$ and $k$ are constants. Which of the following correctly gives its radius in terms of $h$ and $k$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Convert the general form equation of the circle into standard form by completing the square, then identify the radius $r$ in terms of constants $h$ and $k$.

      :::tabs

      == tab: Solving the question with Algebra
      The standard equation of a circle is $(x - x_0)^2 + (y - y_0)^2 = r^2$, where $(x_0, y_0)$ is the center and $r$ is the radius. To find $r$, complete the square for both the $x$ and $y$ variable groups.

      :::derivation
      == step: Group Terms and Prepare to Complete the Square
      -- why: Regroup the terms by variable and isolate constant values on the right-hand side.

      Rearrange the given equation:
      $$
      (x^2 - 6hx) + (y^2 + 2ky) = 0
      $$

      == step: Complete the Square for Both Variables
      -- why: Add the square of half each linear coefficient to both sides of the equation to maintain equality.

      **For the $x$-terms:** Half of $-6h$ is $-3h$, and $(-3h)^2 = 9h^2$. Add $9h^2$ to both sides.

      **For the $y$-terms:** Half of $2k$ is $k$, and $(k)^2 = k^2$. Add $k^2$ to both sides.

      Add these values to both sides of the equation:
      $$
      \begin{aligned}
      (x^2 - 6hx + \mathbf{\color{#2563eb}{9h^2}}) + (y^2 + 2ky + \mathbf{\color{#2563eb}{k^2}}) &= 0 + \mathbf{\color{#2563eb}{9h^2 + k^2}} \\
      (x - 3h)^2 + (y + k)^2 &= \mathbf{9h^2 + k^2}
      \end{aligned}
      $$

      == step: Extract the Radius
      -- why: In standard form, the right-hand side equals $r^2$, so take the principal square root.

      **Equate to $r^2$:**
      $$
      r^2 = 9h^2 + k^2
      $$

      **Take the square root:**
      $$
      r = \mathbf{\sqrt{9h^2 + k^2}}
      $$

      *(Note: $\sqrt{9h^2 + k^2} \neq 3h + k$. Radicals cannot be distributed across addition.)*
      :::

      == tab: Applying DESMOS
      When circle equations involve unknown constants like $h$ and $k$, you can assign simple numerical test values in Desmos to find the radius visually or by inspection:

      1. Choose simple values for the constants: let $h = 1$ and $k = 2$.
      2. In line 1, graph the specific circle: `x^2 + y^2 - 6(1)x + 2(2)y = 0`.
      3. Click the circle to locate its center at $(3, -2)$ and its extreme right edge at $(x \approx 6.606, -2)$.
      4. Compute the radius directly: distance from center to edge is $6.606 - 3 = \mathbf{3.606}$.
      5. Test each formula option using $h = 1$ and $k = 2$:
        * $\sqrt{9(1)^2 + (2)^2} = \sqrt{13} \approx \mathbf{3.606}$ (matches Option B).
        * $3(1) + 2 = 5$ (Option A fails).

      :::desmos
      {
        "bounds": { "left": -3, "right": 9, "bottom": -7, "top": 3 },
        "expressions": [
          { "id": "circle", "latex": "x^2 + y^2 - 6x + 4y = 0", "color": "#2563eb" },
          { "id": "center", "latex": "(3, -2)", "color": "#dc2626", "label": "Center: (3, -2)", "showLabel": true },
          { "id": "edge", "latex": "(3 + \\sqrt{13}, -2)", "color": "#16a34a", "label": "Edge: (6.61, -2)", "showLabel": true },
          { "id": "radius_check", "latex": "r = \\sqrt{9(1)^2 + 2^2}", "color": "#444444" }
        ],
        "caption": "With h = 1 and k = 2, the center is (3, -2) and the distance to the perimeter is sqrt(13) ≈ 3.606, confirming Option B."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) Square Root of Sum Trap:** Incorrectly distributes the square root across addition ($\sqrt{9h^2 + k^2} \to 3h + k$). Radicals distribute over multiplication, never over addition.
      * **(B) Correct:** Accurately adds $9h^2$ and $k^2$ to both sides when completing the square, then takes the square root to yield $r = \sqrt{9h^2 + k^2}$.
      * **(C) Unsquared Factor Trap:** Forgets to square the half-coefficient for $x$ ($(-3)^2 = 9$, not $3$), mistakenly using $3h^2$ instead of $9h^2$.
      * **(D) $r^2$ vs. $r$ Trap:** Finds the correct right-hand side in standard form ($r^2 = 9h^2 + k^2$) but forgets to take the square root to find $r$.
    options:
      - id: "A"
        text: "$3h + k$"
      - id: "B"
        text: "$\\sqrt{9h^2 + k^2}$"
      - id: "C"
        text: "$\\sqrt{3h^2 + k^2}$"
      - id: "D"
        text: "$9h^2 + k^2$"

  - id: "sat-t1-m1-q22"
    questionNumber: 22
    questionType: "FR"
    correctAnswer: "2"
    domain: "Advanced Math"
    skill: "Quadratic Equations"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The equation $2x^2 - 8x - 7 = 0$ has two solutions. One of the solutions can be written as $k - \sqrt{\dfrac{15}{k}}$, where $k$ is a constant. What is the value of $k$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Solve the quadratic equation and pattern-match the smaller solution to the target template $k - \sqrt{\dfrac{15}{k}}$ to determine the value of constant $k$.

      :::tabs

      == tab: Solving the question with Algebra
      Completing the square or applying the quadratic formula reveals the exact radical form of the roots, allowing direct structural comparison with the target expression.

      :::derivation
      == step: Normalize the Quadratic Equation
      -- why: Divide by the leading coefficient $2$ so the $x^2$ term has a coefficient of $1$.

      Divide all terms by $2$:
      $$
      x^2 - 4x - \frac{7}{2} = 0
      $$

      == step: Complete the Square
      -- why: Rewrite the quadratic expression into vertex form $(x - h)^2 = d$ to directly expose the root structure.

      Move the constant term to the right-hand side:
      $$
      x^2 - 4x = \frac{7}{2}
      $$

      Add $(\dfrac{-4}{2})^2 = (-2)^2 = 4$ to both sides:
      $$
      \begin{aligned}
      x^2 - 4x + 4 &= \frac{7}{2} + 4 \\[.4cm]
      (x - 2)^2 &= \frac{7}{2} + \frac{8}{2} \\[.4cm]
      (x - 2)^2 &= \mathbf{\color{#2563eb}{\frac{15}{2}}}
      \end{aligned}
      $$

      == step: Solve for $x$ and Pattern-Match to Find $k$
      -- why: Extract square roots and compare the smaller root with $k - \sqrt{\dfrac{15}{k}}$.

      Take the square root of both sides:
      $$
      x - 2 = \pm\sqrt{\frac{15}{2}} \implies x = 2 \pm \sqrt{\frac{15}{2}}
      $$

      The two solutions are:
      * Larger solution: $2 + \sqrt{\dfrac{15}{2}}$
      * Smaller solution: $2 - \sqrt{\dfrac{15}{2}}$

      Align the smaller solution with the given form:
      $$
      \mathbf{k} - \sqrt{\frac{15}{\mathbf{k}}} = \mathbf{2} - \sqrt{\frac{15}{\mathbf{2}}}
      $$

      By direct pattern matching, $k = \mathbf{2}$.
      :::

      == tab: Solving the question with DESMOS
      You can use Desmos to find the numerical roots and test candidate integer values of $k$ directly:

      1. In line 1, graph the parabola: `y = 2x^2 - 8x - 7`.
      2. Click the smaller $x$-intercept to read its decimal value: `x ≈ -0.7386`.
      3. In line 2, type the expression: `f(k) = k - \sqrt{15 / k}`.
      4. Test integers in line 3: evaluate `f(2) = 2 - \sqrt{15 / 2}`. Desmos outputs `-0.7386127875...`, confirming an exact match with the parabola's root.

      :::desmos
      {
        "bounds": { "left": -4, "right": 8, "bottom": -18, "top": 10 },
        "expressions": [
          { "id": "parabola", "latex": "y = 2x^2 - 8x - 7", "color": "#2563eb" },
          { "id": "root_pt", "latex": "(2 - \\sqrt{15/2}, 0)", "color": "#dc2626", "label": "Root: (-0.739, 0)", "showLabel": true },
          { "id": "check_val", "latex": "2 - \\sqrt{\\frac{15}{2}}", "color": "#16a34a" }
        ],
        "caption": "The left root is approximately -0.7386. Evaluating 2 - sqrt(15/2) matches this intercept exactly, confirming k = 2."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Entering 4:** *Coefficient Trap.* Uses the linear coefficient from $x^2 - 4x$ directly without dividing by $2$ when completing the square.
      * **Entering 15:** *Radicand Numerator Trap.* Pulls the constant $15$ from inside the radical rather than identifying the base and denominator parameter $k$.
      * **Entering -2:** *Sign Inversion Trap.* Confuses the subtraction sign in $(x - 2)^2$ with a negative root or mistakes the template structure $k - \sqrt{\dots}$ to mean $k$ must be negative.
      * **Entering 2:** **Correct.** Accurately completes the square to find roots $2 \pm \sqrt{\dfrac{15}{2}}$, directly matching $k = 2$.
---