---
sectionId: "ap-calc-ab-t1-s2a"
sectionTitle: "Section II, Part A (Calculator Active)"
sectionOrder: 3
timeLimit: 2700
config:
  calculator: "desmos-graphing"
  hasFormulaSheet: false
  layout: "split-passage"
questions:
  # ===========================================================================
  # QUESTION 1 PARTS (A–D)
  # ===========================================================================
  - id: "ap-calc-frq-q1a"
    parentQuestionId: "ap-calc-frq-q1"
    parentQuestionNumber: 1
    subPartLabel: "A"
    points: 2
    questionNumber: 1
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Differentiation: Definition and Fundamental Properties"
    skill: "Approximating Derivatives from Tables and Contextual Interpretation"
    difficulty: "Easy"
    stimulus: |
      **A GRAPHING CALCULATOR IS REQUIRED FOR THIS QUESTION.**

      | $t \text{ (minutes)}$ | $0$ | $2$ | $5$ | $7$ | $10$ |
      | :--- | :---: | :---: | :---: | :---: | :---: |
      | $H(t) \text{ (gallons per minute)}$ | $14.2$ | $17.6$ | $22.4$ | $19.8$ | $24.5$ |

      Raw honey is being pumped into a storage vat. At time $t = 0$, the vat is empty. The rate at which honey is being pumped into the vat is modeled by the differentiable function $H$, where $H(t)$ is measured in gallons per minute for $0 \le t \le 10$ minutes. Selected values of $H(t)$ are given in the table above.
    prompt: |
      **Question 1 — Part (a)** *(Write your response in the Question 1, Part A box on your answer sheet.)*

      Using the data in the table, approximate $H'(6)$. Using correct units, interpret the meaning of $H'(6)$ in the context of the problem.
    subParts:
      - label: "A"
        points: 2
        rubricNotes: "1 pt for difference quotient approximation -1.3; 1 pt for contextual interpretation with units (gallons per minute per minute)."
        criteria:
          - id: "q1-a-approx"
            description: "Approximates $H'(6)$ using difference quotient: $\\frac{H(7) - H(5)}{7 - 5} = \\frac{19.8 - 22.4}{2} = -1.3$"
            points: 1
            expectedLatex: "-1.3"
            numericTolerance: 0.001
          - id: "q1-a-interp"
            description: "Interprets $H'(6)$ in context: the rate at which honey is being pumped into the vat is decreasing at $1.3$ gallons per minute per minute at time $t = 6$ minutes"
            points: 1
            requiredUnits: "gal/min^2"
            requiresJustification: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Approximate the instantaneous rate of change $H'(6)$ from the given table of values and interpret its meaning with appropriate units at $t = 6$ minutes.

      :::tabs
      == tab: Solving the question with Calculus
      Bracket $t = 6$ using the two closest adjacent table entries ($t = 5$ and $t = 7$) to form the symmetric difference quotient $\dfrac{H(7) - H(5)}{7 - 5}$, then state the quantity, direction ("decreasing"), value with units ($\text{gal/min}^2$), and exact instant ($t = 6$ minutes).

      :::derivation
      == step: Part (a) — Approximate H'(6) and Interpret in Context (2 Points)
      -- why: Use the average rate of change across $[5, 7]$ to estimate the derivative at $t = 6$.
      $$
      \begin{aligned}
      H'(6) &\approx \frac{{\color{#2563eb}{H(7) - H(5)}}}{{\color{#2563eb}{7 - 5}}} \\[.4cm]
      &= \frac{{\color{#2563eb}{19.8 - 22.4}}}{2} = \frac{-2.6}{2} = -1.3\text{ gallons per minute per minute}
      \end{aligned}
      $$
      **Contextual Interpretation:** At time $t = 6$ minutes, the rate at which honey is being pumped into the vat is **decreasing** at $1.3$ gallons per minute per minute (or $\text{gal/min}^2$).
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Missing "Rate of Change of the Rate" or Units:** Saying "the amount of honey is decreasing at $1.3$ gal/min" describes $H(6)$ instead of $H'(6)$. Because $H(t)$ is already in gallons per minute, $H'(6)$ must state that the **rate** is decreasing with units of **gallons per minute per minute** ($\text{gal/min}^2$).

  - id: "ap-calc-frq-q1b"
    parentQuestionId: "ap-calc-frq-q1"
    parentQuestionNumber: 1
    subPartLabel: "B"
    points: 2
    questionNumber: 2
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Integration and Accumulation of Change"
    skill: "Approximating Integrals with Right Riemann Sums"
    difficulty: "Easy"
    stimulus: |
      **A GRAPHING CALCULATOR IS REQUIRED FOR THIS QUESTION.**

      | $t \text{ (minutes)}$ | $0$ | $2$ | $5$ | $7$ | $10$ |
      | :--- | :---: | :---: | :---: | :---: | :---: |
      | $H(t) \text{ (gallons per minute)}$ | $14.2$ | $17.6$ | $22.4$ | $19.8$ | $24.5$ |

      Raw honey is being pumped into a storage vat. At time $t = 0$, the vat is empty. The rate at which honey is being pumped into the vat is modeled by the differentiable function $H$, where $H(t)$ is measured in gallons per minute for $0 \le t \le 10$ minutes. Selected values of $H(t)$ are given in the table above.
    prompt: |
      **Question 1 — Part (b)** *(Write your response in the Question 1, Part B box on your answer sheet.)*

      Write an integral expression that represents the total amount of honey pumped into the vat from time $t = 0$ to time $t = 10$. Use a right Riemann sum with the four subintervals indicated by the data in the table to approximate the integral.
    subParts:
      - label: "B"
        points: 2
        rubricNotes: "1 pt for definite integral expression; 1 pt for right Riemann sum approximation 215.5."
        criteria:
          - id: "q1-b-integral"
            description: "Writes definite integral for total honey added: $\\int_{0}^{10} H(t)\\,dt$"
            points: 1
          - id: "q1-b-rsum"
            description: "Computes right Riemann sum: $2(17.6) + 3(22.4) + 2(19.8) + 3(24.5) = 215.5$"
            points: 1
            expectedLatex: "215.5"
            numericTolerance: 0.001
    explanation: |
      ### Takeoff: What were you asked to find?
      Express the total honey pumped into the vat on $[0, 10]$ as a definite integral and approximate it using a four-subinterval right Riemann sum.

      :::tabs
      == tab: Solving the question with Calculus
      Multiply each subinterval's **unequal width** $\Delta t_i$ by the **right-endpoint height** $H(t_i)$ across $[0, 2]$, $[2, 5]$, $[5, 7]$, and $[7, 10]$.

      :::derivation
      == step: Part (b) — Write the Accumulation Integral and Compute the Right Riemann Sum (2 Points)
      -- why: Total accumulated inflow is $\displaystyle\int_{0}^{10} H(t)\,dt$.
      $$
      \begin{aligned}
      \text{Total honey pumped in} &= \int_{0}^{10} H(t)\,dt \\[.4cm]
      &\approx (2 - 0){\color{#2563eb}{H(2)}} + (5 - 2){\color{#2563eb}{H(5)}} + (7 - 5){\color{#2563eb}{H(7)}} + (10 - 7){\color{#2563eb}{H(10)}} \\[.4cm]
      &= 2({\color{#2563eb}{17.6}}) + 3({\color{#2563eb}{22.4}}) + 2({\color{#2563eb}{19.8}}) + 3({\color{#2563eb}{24.5}}) \\[.4cm]
      &= 35.2 + 67.2 + 39.6 + 73.5 = 215.5\text{ gallons}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Assuming Equal Subinterval Widths:** Notice the time stamps $0, 2, 5, 7, 10$ have widths $2, 3, 2, 3$—not uniform widths of $2.5$. Always compute $\Delta t_i = t_i - t_{i-1}$ individually for each rectangle.

  - id: "ap-calc-frq-q1c"
    parentQuestionId: "ap-calc-frq-q1"
    parentQuestionNumber: 1
    subPartLabel: "C"
    points: 3
    questionNumber: 3
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Integration and Accumulation of Change"
    skill: "Net Accumulation Models with Inflow and Outflow Rates"
    difficulty: "Medium"
    stimulus: |
      **A GRAPHING CALCULATOR IS REQUIRED FOR THIS QUESTION.**

      | $t \text{ (minutes)}$ | $0$ | $2$ | $5$ | $7$ | $10$ |
      | :--- | :---: | :---: | :---: | :---: | :---: |
      | $H(t) \text{ (gallons per minute)}$ | $14.2$ | $17.6$ | $22.4$ | $19.8$ | $24.5$ |

      Raw honey is being pumped into a storage vat. At time $t = 0$, the vat is empty. The rate at which honey is being pumped into the vat is modeled by the differentiable function $H$, where $H(t)$ is measured in gallons per minute for $0 \le t \le 10$ minutes. Selected values of $H(t)$ are given in the table above.
    prompt: |
      **Question 1 — Part (c)** *(Write your response in the Question 1, Part C box on your answer sheet.)*

      Honey is being drained from the vat for bottling at a rate modeled by $D(t) = 28\sqrt{\sin\left(\dfrac{\pi t}{85}\right)}$, where $D(t)$ is measured in gallons per minute for $0 \le t \le 10$ minutes. Using the result from part (b), approximate the amount of honey remaining in the vat at time $t = 10$.
    subParts:
      - label: "C"
        points: 3
        rubricNotes: "1 pt for integral of D(t); 1 pt for subtracting from part (b); 1 pt for numeric answer 92.115."
        criteria:
          - id: "q1-c-integral"
            description: "Sets up definite integral for honey drained: $\\int_{0}^{10} D(t)\\,dt$ (evaluates to $\\approx 123.385$)"
            points: 1
            expectedLatex: "123.385"
            numericTolerance: 0.002
          - id: "q1-c-diff"
            description: "Subtracts drained volume from part (b) total: $215.5 - \\int_{0}^{10} D(t)\\,dt$"
            points: 1
            allowConsequentialCarryover: true
          - id: "q1-c-ans"
            description: "Evaluates remaining honey at $t = 10$: $92.115$ gallons"
            points: 1
            expectedLatex: "92.115"
            numericTolerance: 0.002
            allowConsequentialCarryover: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Compute the remaining amount of honey in the vat at $t = 10$ by subtracting total outflow $\displaystyle\int_{0}^{10} D(t)\,dt$ from the inflow estimate in part (b).

      :::tabs
      == tab: Solving the question with Calculus & Desmos
      Start with the initial amount $0$ gallons, add the part (b) inflow approximation $215.5$, and subtract $\displaystyle\int_{0}^{10} D(t)\,dt$ evaluated in **radian mode**.

      :::derivation
      == step: Part (c) — Approximate Remaining Honey at t = 10 Using Desmos (3 Points)
      -- why: Net amount = Initial + Inflow − Outflow.
      $$
      \begin{aligned}
      \text{Remaining honey at } t = 10 &\approx 0 + {\color{#2563eb}{215.5}} - \int_{0}^{10} 28\sqrt{\sin\left(\frac{\pi t}{85}\right)}\,dt \\[.4cm]
      &\approx {\color{#2563eb}{215.5}} - {\color{#16a34a}{123.38498}} \\[.4cm]
      &\approx 92.115\text{ gallons}
      \end{aligned}
      $$
      :::

      :::desmos
      {
        "bounds": { "left": -1, "right": 11, "bottom": -2, "top": 28 },
        "expressions": [
          { "id": "outflow", "latex": "D(x)=28\\sqrt{\\sin(\\frac{\\pi x}{85})}", "color": "#16a34a" },
          { "id": "drained_total", "latex": "I=\\int_{0}^{10}D(x)dx", "color": "#2563eb" },
          { "id": "remaining_total", "latex": "R=215.5-I", "color": "#dc2626" }
        ],
        "caption": "Line 1 defines D(x) in green. Line 2 integrates D(x) on [0, 10] to get 123.385 gal drained, and Line 3 subtracts from 215.5 to yield 92.115 gal remaining."
      }
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Degree Mode or Premature Rounding:** Running $\sin\left(\dfrac{\pi t}{85}\right)$ in degree mode instead of **radian mode** produces an incorrect integral, and rounding before subtracting can shift the third decimal place of $92.115$.

  - id: "ap-calc-frq-q1d"
    parentQuestionId: "ap-calc-frq-q1"
    parentQuestionNumber: 1
    subPartLabel: "D"
    points: 2
    questionNumber: 4
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Contextual Applications of Differentiation"
    skill: "Interpreting Rates of Change in Applied Contexts"
    difficulty: "Easy"
    stimulus: |
      **A GRAPHING CALCULATOR IS REQUIRED FOR THIS QUESTION.**

      | $t \text{ (minutes)}$ | $0$ | $2$ | $5$ | $7$ | $10$ |
      | :--- | :---: | :---: | :---: | :---: | :---: |
      | $H(t) \text{ (gallons per minute)}$ | $14.2$ | $17.6$ | $22.4$ | $19.8$ | $24.5$ |

      Raw honey is being pumped into a storage vat. At time $t = 0$, the vat is empty. The rate at which honey is being pumped into the vat is modeled by the differentiable function $H$, where $H(t)$ is measured in gallons per minute for $0 \le t \le 10$ minutes. Selected values of $H(t)$ are given in the table above.
    prompt: |
      **Question 1 — Part (d)** *(Write your response in the Question 1, Part D box on your answer sheet.)*

      Based on the model in part (c), is the amount of honey in the vat increasing or decreasing at time $t = 7$ ? Show the work that leads to your answer.
    subParts:
      - label: "D"
        points: 2
        rubricNotes: "1 pt for evaluating D(7) ≈ 14.163 (or net rate H(7) - D(7) ≈ 5.637); 1 pt for concluding increasing with comparison."
        criteria:
          - id: "q1-d-eval"
            description: "Evaluates $D(7) = 28\\sqrt{\\sin\\left(\\frac{7\\pi}{85}\\right)} \\approx 14.163$ (or net rate $H(7) - D(7) \\approx 5.637$)"
            points: 1
            expectedLatex: "14.163"
            numericTolerance: 0.002
          - id: "q1-d-conc"
            description: "Concludes amount of honey in the vat is increasing at $t = 7$ because $H(7) - D(7) > 0$ (or $H(7) > D(7)$)"
            points: 1
            requiresJustification: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine whether the total volume of honey in the vat is increasing or decreasing at $t = 7$ by comparing the inflow rate $H(7)$ against the outflow rate $D(7)$.

      :::tabs
      == tab: Solving the question with Calculus & Desmos
      Because the net rate of change of volume is $V'(7) = H(7) - D(7)$, evaluate $D(7)$ on your calculator and compare it to $H(7) = 19.8$.

      :::derivation
      == step: Part (d) — Compare Inflow and Outflow Rates at t = 7 (2 Points)
      -- why: If $H(7) - D(7) > 0$, the total volume of honey is increasing.
      $$
      \begin{aligned}
      H(7) &= {\color{#2563eb}{19.8\text{ gal/min}}} \\[.3cm]
      D(7) &= 28\sqrt{\sin\left(\frac{7\pi}{85}\right)} \approx {\color{#16a34a}{14.16289\text{ gal/min}}} \\[.4cm]
      V'(7) = H(7) - D(7) &\approx 19.8 - 14.16289 = 5.637 > 0
      \end{aligned}
      $$
      Because $H(7) - D(7) > 0$ (or $H(7) > D(7)$), the amount of honey in the vat is **increasing** at time $t = 7$ minutes.
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Checking $D'(7)$ Instead of $H(7) - D(7)$:** Whether the *amount* of honey is increasing depends on the net rate $H(7) - D(7) > 0$, not on whether the drain rate $D(t)$ itself is increasing ($D'(7) > 0$).

  # ===========================================================================
  # QUESTION 2 PARTS (A–D)
  # ===========================================================================
  - id: "ap-calc-frq-q2a"
    parentQuestionId: "ap-calc-frq-q2"
    parentQuestionNumber: 2
    subPartLabel: "A"
    points: 2
    questionNumber: 5
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Contextual Applications of Differentiation"
    skill: "Straight-Line Motion: Acceleration as Derivative of Velocity"
    difficulty: "Easy"
    stimulus: |
      **A GRAPHING CALCULATOR IS REQUIRED FOR THIS QUESTION.**

      An autonomous underwater glider is traveling along a straight path. The glider's velocity can be modeled by $v(t) = 1.6 \ln\left(1 + t^2\right)$ meters per minute for $0 \le t \le 12$ minutes.
    prompt: |
      **Question 2 — Part (a)** *(Write your response in the Question 2, Part A box on your answer sheet.)*

      Find the acceleration of the glider at time $t = 4$ minutes.
    subParts:
      - label: "A"
        points: 2
        rubricNotes: "1 pt for expressing acceleration as v'(4); 1 pt for numeric value 64/85 (or 0.753)."
        criteria:
          - id: "q2-a-deriv"
            description: "Expresses acceleration as derivative of velocity at $t = 4$: $a(4) = v'(4)$ (or $v'(t) = \\frac{3.2t}{1 + t^2}$)"
            points: 1
          - id: "q2-a-value"
            description: "Evaluates acceleration at $t = 4$: $\\frac{64}{85} \\approx 0.753\\text{ m/min}^2$"
            points: 1
            expectedLatex: "\\frac{64}{85}"
            numericTolerance: 0.001
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the glider's instantaneous acceleration $a(4) = v'(4)$ at time $t = 4$ minutes.

      :::tabs
      == tab: Solving the question with Calculus & Desmos
      Differentiate $v(t) = 1.6\ln(1 + t^2)$ using the Chain Rule (or evaluate $\left.\dfrac{d}{dx}v(x)\right|_{x=4}$ directly on your calculator).

      :::derivation
      == step: Part (a) — Find Instantaneous Acceleration a(4) = v'(4) (2 Points)
      -- why: Acceleration is the first derivative of velocity with respect to time.
      $$
      \begin{aligned}
      a(t) = v'(t) &= 1.6 \cdot \frac{{\color{#2563eb}{2t}}}{{\color{#2563eb}{1 + t^2}}} = \frac{3.2t}{1 + t^2} \\[.4cm]
      a(4) = v'(4) &= \frac{3.2({\color{#2563eb}{4}})}{1 + {\color{#2563eb}{4}}^2} = \frac{12.8}{17} = \frac{64}{85} \approx 0.753\text{ meters per minute per minute}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Forgetting the Chain Rule Factor $2t$:** Differentiating $1.6\ln(1 + t^2)$ as $\dfrac{1.6}{1 + t^2}$ instead of $\dfrac{1.6(2t)}{1 + t^2}$ omits the inner derivative $2t$.

  - id: "ap-calc-frq-q2b"
    parentQuestionId: "ap-calc-frq-q2"
    parentQuestionNumber: 2
    subPartLabel: "B"
    points: 2
    questionNumber: 6
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Integration and Accumulation of Change"
    skill: "Straight-Line Motion: Displacement as Definite Integral of Velocity"
    difficulty: "Easy"
    stimulus: |
      **A GRAPHING CALCULATOR IS REQUIRED FOR THIS QUESTION.**

      An autonomous underwater glider is traveling along a straight path. The glider's velocity can be modeled by $v(t) = 1.6 \ln\left(1 + t^2\right)$ meters per minute for $0 \le t \le 12$ minutes.
    prompt: |
      **Question 2 — Part (b)** *(Write your response in the Question 2, Part B box on your answer sheet.)*

      What is the displacement of the glider over the interval $0 \le t \le 12$ minutes?
    subParts:
      - label: "B"
        points: 2
        rubricNotes: "1 pt for definite integral setup; 1 pt for displacement value 61.914."
        criteria:
          - id: "q2-b-integral"
            description: "Writes definite integral for displacement: $\\int_{0}^{12} v(t)\\,dt$"
            points: 1
          - id: "q2-b-value"
            description: "Evaluates displacement over $[0, 12]$: $61.914$ meters"
            points: 1
            expectedLatex: "61.914"
            numericTolerance: 0.002
    explanation: |
      ### Takeoff: What were you asked to find?
      Compute the net displacement of the glider over the time interval $0 \le t \le 12$ minutes.

      :::tabs
      == tab: Solving the question with Calculus & Desmos
      Integrate $v(t)$ from $t = 0$ to $t = 12$ on your graphing calculator and store the unrounded result $D \approx 61.91447$ for parts (c) and (d).

      :::derivation
      == step: Part (b) — Compute Total Displacement Over [0, 12] (2 Points)
      -- why: Displacement over $[a, b]$ is the definite integral $\displaystyle\int_{a}^{b} v(t)\,dt$.
      $$
      \begin{aligned}
      \text{Displacement} &= \int_{0}^{12} v(t)\,dt \\[.4cm]
      &= \int_{0}^{12} 1.6\ln\left(1 + t^2\right) dt \approx {\color{#2563eb}{61.91447}} \approx 61.914\text{ meters}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Premature Rounding:** Store the full-precision integral $61.91447$ in your calculator for use in parts (c) and (d) so rounding error does not carry forward.

  - id: "ap-calc-frq-q2c"
    parentQuestionId: "ap-calc-frq-q2"
    parentQuestionNumber: 2
    subPartLabel: "C"
    points: 2
    questionNumber: 7
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Integration and Accumulation of Change"
    skill: "Average Value of a Function and Mean Value Theorem for Integrals"
    difficulty: "Medium"
    stimulus: |
      **A GRAPHING CALCULATOR IS REQUIRED FOR THIS QUESTION.**

      An autonomous underwater glider is traveling along a straight path. The glider's velocity can be modeled by $v(t) = 1.6 \ln\left(1 + t^2\right)$ meters per minute for $0 \le t \le 12$ minutes.
    prompt: |
      **Question 2 — Part (c)** *(Write your response in the Question 2, Part C box on your answer sheet.)*

      At what time $t$, $0 \le t \le 12$, is the glider's instantaneous velocity equal to its average velocity over the interval $0 \le t \le 12$ ?
    subParts:
      - label: "C"
        points: 2
        rubricNotes: "1 pt for setting v(t) equal to average velocity; 1 pt for t = 4.914."
        criteria:
          - id: "q2-c-eq"
            description: "Sets instantaneous velocity equal to average velocity: $v(t) = \\frac{1}{12}\\int_{0}^{12} v(t)\\,dt$ (or $1.6\\ln(1 + t^2) \\approx 5.159$)"
            points: 1
            allowConsequentialCarryover: true
          - id: "q2-c-time"
            description: "Solves for time $t$: $4.914$ minutes"
            points: 1
            expectedLatex: "4.914"
            numericTolerance: 0.002
            allowConsequentialCarryover: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the time $t \in [0, 12]$ at which the glider's instantaneous velocity $v(t)$ equals its average velocity on $[0, 12]$.

      :::tabs
      == tab: Solving the question with Calculus & Desmos
      Compute $v_{\text{avg}} = \dfrac{1}{12 - 0}\displaystyle\int_{0}^{12} v(t)\,dt \approx 5.15954$, set $v(t) = v_{\text{avg}}$, and solve for $t \in [0, 12]$.

      :::derivation
      == step: Part (c) — Solve Instantaneous Velocity = Average Velocity on [0, 12] (2 Points)
      -- why: Average velocity over $[0, 12]$ is $\dfrac{1}{12}\displaystyle\int_{0}^{12} v(t)\,dt$.
      $$
      \begin{aligned}
      v_{\text{avg}} &= \frac{1}{12 - 0}\int_{0}^{12} v(t)\,dt \approx \frac{{\color{#2563eb}{61.91447}}}{12} \approx {\color{#16a34a}{5.15954\text{ m/min}}} \\[.4cm]
      1.6\ln\left(1 + t^2\right) &= {\color{#16a34a}{5.15954}} \\[.4cm]
      \ln\left(1 + t^2\right) &\approx 3.22471 \implies t = \sqrt{e^{3.22471} - 1} \approx 4.914\text{ minutes}
      \end{aligned}
      $$
      :::

      :::desmos
      {
        "bounds": { "left": -1, "right": 13, "bottom": -1, "top": 9 },
        "expressions": [
          { "id": "vel", "latex": "v(x)=1.6\\ln(1+x^2)", "color": "#2563eb" },
          { "id": "disp", "latex": "D=\\int_{0}^{12}v(x)dx", "color": "#16a34a" },
          { "id": "vavg", "latex": "y=\\frac{D}{12}", "color": "#16a34a" },
          { "id": "intersect_c", "latex": "(4.914,5.160)", "color": "#dc2626" }
        ],
        "caption": "The horizontal average velocity line y = D/12 ≈ 5.160 intersects v(x) at t ≈ 4.914 minutes."
      }
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Computing Average Acceleration Instead of Average Velocity:** Using $\dfrac{v(12) - v(0)}{12 - 0}$ computes *average acceleration* rather than *average velocity* $\dfrac{1}{12}\displaystyle\int_{0}^{12} v(t)\,dt$.

  - id: "ap-calc-frq-q2d"
    parentQuestionId: "ap-calc-frq-q2"
    parentQuestionNumber: 2
    subPartLabel: "D"
    points: 3
    questionNumber: 8
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Integration and Accumulation of Change"
    skill: "Recovering Position and Velocity from Constant Acceleration"
    difficulty: "Hard"
    stimulus: |
      **A GRAPHING CALCULATOR IS REQUIRED FOR THIS QUESTION.**

      An autonomous underwater glider is traveling along a straight path. The glider's velocity can be modeled by $v(t) = 1.6 \ln\left(1 + t^2\right)$ meters per minute for $0 \le t \le 12$ minutes.
    prompt: |
      **Question 2 — Part (d)** *(Write your response in the Question 2, Part D box on your answer sheet.)*

      A second drone arrives at the glider's starting position at time $t = 9$ minutes and follows the glider's path. During the interval $9 \le t \le 12$ minutes, the drone travels in the same direction as the glider with a constant acceleration of $3$ meters per minute per minute. The drone catches up to the glider at time $t = 12$ minutes. The drone's velocity at time $t = 9$ is $K$ meters per minute. Find the value of $K$.
    subParts:
      - label: "D"
        points: 3
        rubricNotes: "1 pt for drone velocity/displacement expression on [9, 12]; 1 pt for equating to glider displacement; 1 pt for K = 16.138."
        criteria:
          - id: "q2-d-drone"
            description: "Models drone velocity $v_{\\text{drone}}(t) = K + 3(t - 9)$ or displacement $\\int_{9}^{12} (K + 3(t - 9))\\,dt = 3K + 13.5$"
            points: 1
          - id: "q2-d-equate"
            description: "Equates drone displacement to glider's total displacement from part (b): $3K + 13.5 = \\int_{0}^{12} v(t)\\,dt$"
            points: 1
            allowConsequentialCarryover: true
          - id: "q2-d-ans"
            description: "Solves for initial drone velocity: $K = 16.138$ meters per minute"
            points: 1
            expectedLatex: "16.138"
            numericTolerance: 0.002
            allowConsequentialCarryover: true
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the initial velocity $K$ at $t = 9$ required for a second drone with constant acceleration $3\text{ m/min}^2$ to cover the glider's entire $12$-minute displacement during the $3$-minute interval $[9, 12]$.

      :::tabs
      == tab: Solving the question with Calculus
      Integrate $a_{\text{drone}}(t) = 3$ from $9$ to $t$ to obtain $v_{\text{drone}}(t) = K + 3(t - 9)$, integrate from $t = 9$ to $t = 12$ to get the drone's displacement, and equate it to the glider's total displacement $D \approx 61.91447$.

      :::derivation
      == step: Part (d) — Equate Drone Displacement on [9, 12] to Glider Displacement on [0, 12] (3 Points)
      -- why: Catching up at $t = 12$ from the same starting point means both vehicles have identical displacement at $t = 12$.
      $$
      \begin{aligned}
      v_{\text{drone}}(t) &= K + \int_{9}^{t} 3\,du = {\color{#2563eb}{K + 3(t - 9)}} \\[.4cm]
      \text{Displacement}_{\text{drone}} &= \int_{9}^{12} \Bigl(K + 3(t - 9)\Bigr)\,dt \\[.4cm]
      &= \left[Kt + \frac{3}{2}(t - 9)^2\right]_{9}^{12} = 3K + \frac{3}{2}(3)^2 = {\color{#2563eb}{3K + 13.5}} \\[.4cm]
      3K + 13.5 &= \int_{0}^{12} v(t)\,dt \approx {\color{#2563eb}{61.91447}} \\[.4cm]
      3K &\approx 48.41447 \implies K \approx \frac{48.41447}{3} \approx 16.138\text{ meters per minute}
      \end{aligned}
      $$
      :::
      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Common Pitfall — Shifting Velocity with $K + 3t$ Instead of $K + 3(t - 9)$:** Because the drone's velocity is $K$ at $t = 9$ (not at $t = 0$), always anchor the elapsed time as $(t - 9)$.