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
  - id: "ap-calc-frq-q1"
    questionNumber: 1
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Integration and Accumulation of Change"
    skill: "Riemann Sums, Rate Accumulation, and Tabular Derivative Approximation"
    difficulty: "Medium"
    stimulus: |
      **A GRAPHING CALCULATOR IS REQUIRED FOR THIS QUESTION.**

      | $t \text{ (minutes)}$ | $0$ | $2$ | $5$ | $7$ | $10$ |
      | :--- | :---: | :---: | :---: | :---: | :---: |
      | $H(t) \text{ (gallons per minute)}$ | $14.2$ | $17.6$ | $22.4$ | $19.8$ | $24.5$ |

      Raw honey is being pumped into a storage vat. At time $t = 0$, the vat is empty. The rate at which honey is being pumped into the vat is modeled by the differentiable function $H$, where $H(t)$ is measured in gallons per minute for $0 \le t \le 10$ minutes. Selected values of $H(t)$ are given in the table above.
    prompt: |
      **(a)** Using the data in the table, approximate $H'(6)$. Using correct units, interpret the meaning of $H'(6)$ in the context of the problem.

      **(b)** Write an integral expression that represents the total amount of honey pumped into the vat from time $t = 0$ to time $t = 10$. Use a right Riemann sum with the four subintervals indicated by the data in the table to approximate the integral.

      **(c)** Honey is being drained from the vat for bottling at a rate modeled by $D(t) = 28\sqrt{\sin\left(\dfrac{\pi t}{85}\right)}$, where $D(t)$ is measured in gallons per minute for $0 \le t \le 10$ minutes. Using the result from part (b), approximate the amount of honey remaining in the vat at time $t = 10$.

      **(d)** Based on the model in part (c), is the amount of honey in the vat increasing or decreasing at time $t = 7$ ? Show the work that leads to your answer.
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
      Analyze an **inflow-outflow accumulation model** across four free-response parts: **(a)** approximate and interpret an instantaneous rate of change of the inflow rate from a table, **(b)** set up and approximate total inflow over $[0, 10]$ via a right Riemann sum, **(c)** compute net remaining honey at $t = 10$ using calculator integration of the outflow rate $D(t)$, and **(d)** determine whether total volume is increasing or decreasing at $t = 7$ by comparing inflow and outflow rates.

      :::tabs
      == tab: Solving the question with Calculus & Desmos
      Work through parts **(a)** and **(b)** directly from the unevenly spaced table intervals, then use Desmos (in **radian mode**) in parts **(c)** and **(d)** to evaluate the definite integral of $D(t)$ and compare $H(7)$ against $D(7)$.

      :::derivation
      == step: Part (a) — Approximate H'(6) and Interpret in Context (2 Points)
      -- why: Bracket $t = 6$ using the two closest adjacent table entries ($t = 5$ and $t = 7$) to form the average rate of change $\dfrac{H(7) - H(5)}{7 - 5}$, then state the quantity, direction ("decreasing"), value with units ($\text{gal/min}^2$), and exact instant ($t = 6$ minutes).
      $$
      \begin{aligned}
      H'(6) &\approx \frac{{\color{#2563eb}{H(7) - H(5)}}}{{\color{#2563eb}{7 - 5}}} \\[.4cm]
      &= \frac{{\color{#2563eb}{19.8 - 22.4}}}{2} = \frac{-2.6}{2} = -1.3\text{ gallons per minute per minute}
      \end{aligned}
      $$
      **Contextual Interpretation:** At time $t = 6$ minutes, the rate at which honey is being pumped into the vat is **decreasing** at $1.3$ gallons per minute per minute (or $\text{gal/min}^2$).

      == step: Part (b) — Write the Accumulation Integral and Compute the Right Riemann Sum (2 Points)
      -- why: Express total honey pumped in over $[0, 10]$ as $\displaystyle\int_{0}^{10} H(t)\,dt$, then multiply each subinterval's **unequal width** $\Delta t_i$ by the **right-endpoint height** $H(t_i)$ across $[0, 2]$, $[2, 5]$, $[5, 7]$, and $[7, 10]$.
      $$
      \begin{aligned}
      \text{Total honey pumped in} &= \int_{0}^{10} H(t)\,dt \\[.4cm]
      &\approx (2 - 0){\color{#2563eb}{H(2)}} + (5 - 2){\color{#2563eb}{H(5)}} + (7 - 5){\color{#2563eb}{H(7)}} + (10 - 7){\color{#2563eb}{H(10)}} \\[.4cm]
      &= 2({\color{#2563eb}{17.6}}) + 3({\color{#2563eb}{22.4}}) + 2({\color{#2563eb}{19.8}}) + 3({\color{#2563eb}{24.5}}) \\[.4cm]
      &= 35.2 + 67.2 + 39.6 + 73.5 = 215.5\text{ gallons}
      \end{aligned}
      $$

      == step: Part (c) — Approximate Remaining Honey at t = 10 Using Desmos (3 Points)
      -- why: Start with the initial amount $0$ gallons, add the part (b) inflow approximation $215.5$, and subtract the total drained volume $\displaystyle\int_{0}^{10} D(t)\,dt$ evaluated in **radian mode** on your graphing calculator.
      $$
      \begin{aligned}
      \text{Remaining honey at } t = 10 &\approx 0 + {\color{#2563eb}{215.5}} - \int_{0}^{10} 28\sqrt{\sin\left(\frac{\pi t}{85}\right)}\,dt \\[.4cm]
      &\approx {\color{#2563eb}{215.5}} - {\color{#16a34a}{123.38498}} \\[.4cm]
      &\approx 92.115\text{ gallons}
      \end{aligned}
      $$

      == step: Part (d) — Determine Whether Honey in the Vat Is Increasing or Decreasing at t = 7 (2 Points)
      -- why: Compare the inflow rate $H(7)$ from the table against the outflow rate $D(7)$ from the formula; because the net rate of change $V'(7) = H(7) - D(7)$ is positive, the volume is increasing.
      $$
      \begin{aligned}
      H(7) &= {\color{#2563eb}{19.8\text{ gal/min}}} \\[.3cm]
      D(7) &= 28\sqrt{\sin\left(\frac{7\pi}{85}\right)} \approx {\color{#16a34a}{14.16289\text{ gal/min}}} \\[.4cm]
      V'(7) = H(7) - D(7) &\approx 19.8 - 14.16289 = 5.637 > 0
      \end{aligned}
      $$
      Because $H(7) - D(7) > 0$ (or $H(7) > D(7)$), the amount of honey in the vat is **increasing** at time $t = 7$ minutes.
      :::

      :::desmos
      {
        "bounds": { "left": -1, "right": 11, "bottom": -2, "top": 28 },
        "expressions": [
          { "id": "outflow", "latex": "D(x)=28\\sqrt{\\sin(\\frac{\\pi x}{85})}", "color": "#16a34a" },
          { "id": "drained_total", "latex": "I=\\int_{0}^{10}D(x)dx", "color": "#2563eb" },
          { "id": "remaining_total", "latex": "R=215.5-I", "color": "#dc2626" },
          { "id": "d_seven", "latex": "D(7)", "color": "#16a34a" },
          { "id": "net_seven", "latex": "19.8-D(7)", "color": "#2563eb" }
        ],
        "caption": "Line 1 defines the outflow rate D(x) in green. Line 2 integrates D(x) on [0, 10] to get 123.385 gal drained, and Line 3 subtracts from 215.5 to yield 92.115 gal remaining. Lines 4 and 5 evaluate D(7) ≈ 14.163 and the net rate 19.8 - D(7) ≈ 5.637 > 0."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Part (a) Common Pitfall — Missing "Rate of Change of the Rate" or Units:** Saying "the amount of honey is decreasing at $1.3$ gal/min" describes $H(6)$ instead of $H'(6)$. Because $H(t)$ is already in gallons per minute, $H'(6)$ must state that the **rate** is decreasing with units of **gallons per minute per minute** ($\text{gal/min}^2$).
      * **Part (b) Common Pitfall — Assuming Equal Subinterval Widths:** Notice the time stamps $0, 2, 5, 7, 10$ have widths $2, 3, 2, 3$—not uniform widths of $2.5$. Always compute $\Delta t_i = t_i - t_{i-1}$ individually for each rectangle.
      * **Part (c) Common Pitfall — Degree Mode or Premature Rounding:** Running $\sin\left(\dfrac{\pi t}{85}\right)$ in degree mode instead of **radian mode** produces a drastically wrong integral, and rounding $\displaystyle\int_{0}^{10} D(t)\,dt$ before subtracting can shift the third decimal place of $92.115$.
      * **Part (d) Common Pitfall — Checking $D'(7)$ Instead of $H(7) - D(7)$:** Whether the *amount* of honey is increasing depends on the net rate $H(7) - D(7) > 0$, not on whether the drain rate $D(t)$ itself is increasing ($D'(7) > 0$).

  - id: "ap-calc-frq-q2"
    questionNumber: 2
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Contextual Applications of Differentiation"
    skill: "Straight-Line Motion: Acceleration, Displacement, and Average Velocity"
    difficulty: "Hard"
    stimulus: |
      **A GRAPHING CALCULATOR IS REQUIRED FOR THIS QUESTION.**

      An autonomous underwater glider is traveling along a straight path. The glider's velocity can be modeled by $v(t) = 1.6 \ln\left(1 + t^2\right)$ meters per minute for $0 \le t \le 12$ minutes.
    prompt: |
      **(a)** Find the acceleration of the glider at time $t = 4$ minutes.

      **(b)** What is the displacement of the glider over the interval $0 \le t \le 12$ minutes?

      **(c)** At what time $t$, $0 \le t \le 12$, is the glider's instantaneous velocity equal to its average velocity over the interval $0 \le t \le 12$ ?

      **(d)** A second drone arrives at the glider's starting position at time $t = 9$ minutes and follows the glider's path. During the interval $9 \le t \le 12$ minutes, the drone travels in the same direction as the glider with a constant acceleration of $3$ meters per minute per minute. The drone catches up to the glider at time $t = 12$ minutes. The drone's velocity at time $t = 9$ is $K$ meters per minute. Find the value of $K$.
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
      Analyze straight-line particle motion across four free-response parts: **(a)** compute the glider's instantaneous acceleration $a(4) = v'(4)$, **(b)** integrate $v(t)$ over $[0, 12]$ to find total displacement, **(c)** find the time $t \in [0, 12]$ where instantaneous velocity $v(t)$ matches average velocity $\dfrac{1}{12}\displaystyle\int_{0}^{12} v(t)\,dt$, and **(d)** find the initial velocity $K$ at $t = 9$ required for a second drone with constant acceleration $3\text{ m/min}^2$ to cover the glider's entire $12$-minute displacement during the $3$-minute interval $[9, 12]$.

      :::tabs
      == tab: Solving the question with Calculus & Desmos
      Define $v(x) = 1.6\ln(1 + x^2)$ once in Desmos so every subsequent part can reference $v(x)$ directly with full machine precision before rounding final answers to three decimal places.

      :::derivation
      == step: Part (a) — Find Instantaneous Acceleration a(4) = v'(4) (2 Points)
      -- why: Differentiate $v(t) = 1.6\ln(1 + t^2)$ using the Chain Rule (or evaluate $\left.\dfrac{d}{dx}v(x)\right|_{x=4}$ directly on your calculator) and include units of $\text{m/min}^2$.
      $$
      \begin{aligned}
      a(t) = v'(t) &= 1.6 \cdot \frac{{\color{#2563eb}{2t}}}{{\color{#2563eb}{1 + t^2}}} = \frac{3.2t}{1 + t^2} \\[.4cm]
      a(4) = v'(4) &= \frac{3.2({\color{#2563eb}{4}})}{1 + {\color{#2563eb}{4}}^2} = \frac{12.8}{17} = \frac{64}{85} \approx 0.753\text{ meters per minute per minute}
      \end{aligned}
      $$

      == step: Part (b) — Compute Total Displacement Over [0, 12] (2 Points)
      -- why: Integrate the velocity function $v(t)$ from $t = 0$ to $t = 12$ on your graphing calculator; store the unrounded value $D \approx 61.91447$ for parts (c) and (d).
      $$
      \begin{aligned}
      \text{Displacement} &= \int_{0}^{12} v(t)\,dt \\[.4cm]
      &= \int_{0}^{12} 1.6\ln\left(1 + t^2\right) dt \approx {\color{#2563eb}{61.91447}} \approx 61.914\text{ meters}
      \end{aligned}
      $$

      == step: Part (c) — Solve Instantaneous Velocity = Average Velocity on [0, 12] (2 Points)
      -- why: Divide the unrounded displacement from part (b) by the interval width $12 - 0 = 12$ to get $v_{\text{avg}}$, set $v(t) = v_{\text{avg}}$, and find the intersection in $[0, 12]$ (guaranteed to exist by the Mean Value Theorem for Integrals).
      $$
      \begin{aligned}
      v_{\text{avg}} &= \frac{1}{12 - 0}\int_{0}^{12} v(t)\,dt \approx \frac{{\color{#2563eb}{61.91447}}}{12} \approx {\color{#16a34a}{5.15954\text{ m/min}}} \\[.4cm]
      1.6\ln\left(1 + t^2\right) &= {\color{#16a34a}{5.15954}} \\[.4cm]
      \ln\left(1 + t^2\right) &\approx 3.22471 \implies t = \sqrt{e^{3.22471} - 1} \approx 4.914\text{ minutes}
      \end{aligned}
      $$

      == step: Part (d) — Equate Drone Displacement on [9, 12] to Glider Displacement on [0, 12] (3 Points)
      -- why: Because the drone starts at the glider's origin at $t = 9$ with velocity $K$ and constant acceleration $a_{\text{drone}}(t) = 3$, integrate $a_{\text{drone}}(t)$ from $9$ to $t$ to get $v_{\text{drone}}(t) = K + 3(t - 9)$, integrate from $t = 9$ to $t = 12$ to get the drone's displacement, and set it equal to the glider's total displacement $D \approx 61.91447$.
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

      :::desmos
      {
        "bounds": { "left": -1, "right": 13, "bottom": -1, "top": 9 },
        "expressions": [
          { "id": "vel", "latex": "v(x)=1.6\\ln(1+x^2)", "color": "#2563eb" },
          { "id": "disp", "latex": "D=\\int_{0}^{12}v(x)dx", "color": "#16a34a" },
          { "id": "vavg", "latex": "y=\\frac{D}{12}", "color": "#16a34a" },
          { "id": "intersect_c", "latex": "(4.914,5.160)", "color": "#dc2626" },
          { "id": "solve_k", "latex": "K=\\frac{D-13.5}{3}", "color": "#dc2626" }
        ],
        "caption": "Line 1 plots v(x) in blue. Line 2 computes total displacement D ≈ 61.914 m, and Line 3 plots the horizontal average velocity line y = D/12 ≈ 5.160 m/min in green, intersecting v(x) at t ≈ 4.914 min. Line 5 solves 3K + 13.5 = D to give K ≈ 16.138 m/min."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **Part (a) Common Pitfall — Forgetting the Chain Rule Factor $2t$:** Differentiating $1.6\ln(1 + t^2)$ as $\dfrac{1.6}{1 + t^2}$ instead of $\dfrac{1.6(2t)}{1 + t^2}$ omits the inner derivative $2t$ and gives $\dfrac{1.6}{17} \approx 0.094$ rather than $\dfrac{64}{85} \approx 0.753$.
      * **Part (b) Common Pitfall — Premature Rounding Before Parts (c) and (d):** Rounding $D = 61.91447$ to $61.9$ before dividing by $12$ in part (c) or subtracting $13.5$ in part (d) can corrupt the third decimal place—always reference the unrounded stored integral.
      * **Part (c) Common Pitfall — Computing Average Acceleration Instead of Average Velocity:** Using $\dfrac{v(12) - v(0)}{12 - 0}$ computes *average acceleration* rather than *average velocity* $\dfrac{1}{12}\displaystyle\int_{0}^{12} v(t)\,dt$.
      * **Part (d) Common Pitfall — Shifting Velocity with $K + 3t$ Instead of $K + 3(t - 9)$:** Because the drone's velocity is $K$ at $t = 9$ (not at $t = 0$), writing $v_{\text{drone}}(t) = K + 3t$ overstates its velocity by $27\text{ m/min}$ on $[9, 12]$; always anchor the time elapsed as $(t - 9)$.