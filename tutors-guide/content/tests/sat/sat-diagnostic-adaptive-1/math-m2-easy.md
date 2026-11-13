---
sectionId: "sat-t1-m2e"
sectionTitle: "Mathematics - M2S"
sectionOrder: 4
timeLimit: 2100
questions:
  - id: "sat-t1-m2e-q1"
    questionNumber: 1
    questionType: "FR"
    correctAnswer: "-8"
    domain: "Advanced Math"
    skill: "Nonlinear functions"
    difficulty: "Easy"
    containsGraph: true
    containsChart: false
    containsDiagram: false
    stimulus: |
      ![](./assets/dSAT-T1-M2E-Q1.svg)
    prompt: |
      The graph of the function $f$, where $y = f(x)$, is shown in the $xy$-plane. What is the minimum value of $f(x)$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the **minimum value** of the function $f(x)$ from its graph. Whenever an SAT question asks for the *"minimum value of $f(x)$"* (or *"minimum value of $y$"*), it is asking for the lowest **$y$-coordinate** reached by the graph—not the $x$-coordinate where that minimum occurs.

      :::tabs

      == tab: Solving the question with Algebra
      Locate the lowest turning point (vertex) of the V-shaped absolute value graph and extract its output ($y$-coordinate).

      :::derivation
      == step: Identify the Coordinates of the Vertex
      -- why: The graph decreases to a sharp lowest point (vertex) and then increases, so the global minimum occurs right at the vertex.
      Reading the labeled vertex directly from the graph gives:
      $$
      ({\color{#2563eb}{x}}, {\color{#d97706}{y}}) = ({\color{#2563eb}{4}}, {\color{#d97706}{-8}})
      $$

      == step: Extract the Minimum Value of f(x)
      -- why: Because $y = f(x)$, the minimum value of $f(x)$ is the $y$-coordinate of the vertex, $f(4)$.
      $$
      \text{Minimum value of } f(x) = f({\color{#2563eb}{4}}) = {\color{#d97706}{-8}}
      $$
      :::

      **Shortcut Insight:** Distinguish **"what is the minimum value"** from **"for what value of $x$ does the minimum occur"**: *"value of $f(x)$"* always means **$y$** ($-8$), whereas *"value of $x$"* means **$x$** ($4$). You can also verify the vertex equation $f(x) = |x - 4| - 8$ using the $y$-intercept $(0, -4)$ and $x$-intercept $(-4, 0)$: $|0 - 4| - 8 = -4$ and $|-4 - 4| - 8 = 0$.

      == tab: Applying DESMOS
      You can model the graphed absolute value function in Desmos using its vertex form $f(x) = a|x - h| + k$ to confirm the lowest point visually.

      1. Using the vertex $(4, -8)$ and slope $\pm 1$ (confirmed by $(0, -4)$ and $(-4, 0)$), enter `f(x) = |x - 4| - 8` in line 1.
      2. Click the vertex at the bottom of the V-shape to verify the coordinate $(4, -8)$, confirming the minimum output is **`-8`**.

      :::desmos
      {
        "bounds": { "left": -10.5, "right": 14.5, "bottom": -10, "top": 6 },
        "settings": { "squareAxes": true },
        "expressions": [
          { "id": "fn", "latex": "f(x) = \\left|x - 4\\right| - 8", "color": "#2563eb" },
          { "id": "vertex", "latex": "(4, -8)", "color": "#dc2626", "label": "Minimum: (4, -8)", "showLabel": true }
        ],
        "caption": "The vertex of f(x) = |x - 4| - 8 sits at (4, -8), confirming that the minimum value of f(x) is -8."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      Because this is a **Student-Produced Response (SPR)** question, double-check that you avoided these common traps before entering **`-8`**:
      * **Reporting the $x$-Coordinate Instead of the $y$-Coordinate ($4$):** Entering $4$ answers *"for what value of $x$ is $f(x)$ at its minimum?"* rather than *"what is the minimum value of $f(x)$?"*
      * **Dropping the Negative Sign ($8$):** Forgetting to include the minus sign in front of $8$ on the SPR keypad.
      * **Reading an Intercept Instead of the Vertex ($-4$):** Entering the $y$-intercept $(0, -4)$ or $x$-intercept $(-4, 0)$ rather than the lowest point on the graph.

  - id: "sat-t1-m2e-q2"
    questionNumber: 2
    questionType: "MC"
    correctAnswer: "A"
    domain: "Algebra"
    skill: "Linear inequalities in one or two variables"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A delivery van has a maximum safe cargo capacity of $3{,}200$ pounds. The driver loads $18$ identical large crates, each weighing $115$ pounds, into the cargo area. If $w$ represents the combined weight, in pounds, of any additional items loaded into the van, which inequality represents all possible values of $w$ that keep the total cargo weight within the safe limit?
    explanation: |
      ### Takeoff: What were you asked to find?
      Write and solve a **one-variable linear inequality** representing the remaining cargo weight $w$ the van can safely carry. Add the weight of the $18$ loaded crates to $w$, set the total weight **less than or equal to** ($\le$) the $3{,}200$-pound maximum capacity, and solve for $w$.

      :::tabs

      == tab: Solving the question with Algebra
      Compute the total weight of the $18$ crates first, set up the capacity inequality, and isolate $w$.

      :::derivation
      == step: Calculate the Weight of the 18 Crates
      -- why: Multiply the number of crates ($18$) by the weight per crate ($115$ pounds).
      $$
      \text{Crate weight} = 18 \times 115 = {\color{#2563eb}{2{,}070}}\text{ pounds}
      $$

      == step: Set Up the Capacity Inequality
      -- why: Keeping the total cargo weight *"within the safe limit"* of $3{,}200$ pounds means the sum of the existing crate weight and $w$ cannot exceed $3{,}200$ ($\le$).
      $$
      {\color{#2563eb}{2{,}070}} + {\color{#d97706}{w}} \le 3{,}200
      $$

      == step: Isolate $w$
      -- why: Subtract $2{,}070$ from both sides of the inequality.
      $$
      \begin{aligned}
      {\color{#d97706}{w}} &\le 3{,}200 - {\color{#2563eb}{2{,}070}} \\
      {\color{#d97706}{w}} &\le 1{,}130
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Check the inequality direction first! Because $w$ is *additional* weight that cannot exceed the remaining space in the van, $w$ must have an **upper bound** ($\le$), immediately eliminating **(B)** and **(D)**. Next, estimate $18 \times 115 \approx 20 \times 100 = 2{,}000$, which leaves about $3{,}200 - 2{,}000 = 1{,}200$ pounds—pointing straight to **(A)** ($w \le 1{,}130$) over **(C)** ($w \le 3{,}085$).

      == tab: Applying DESMOS
      You can graph the total cargo weight function $y = 18(115) + x$ alongside the maximum capacity line $y = 3{,}200$ in Desmos (where $x$ represents $w$) to find the allowable region visually.

      1. Enter `y = 18 * 115 + x` in line 1 and `y = 3200` in line 2.
      2. Click the intersection point at $(1130, 3200)$: the total cargo weight stays at or below $3{,}200$ pounds whenever $x \le \mathbf{1{,}130}$.

      :::desmos
      {
        "bounds": { "left": -200, "right": 2000, "bottom": 1500, "top": 3800 },
        "expressions": [
          { "id": "cargo", "latex": "y = 18(115) + x", "color": "#2563eb" },
          { "id": "limit", "latex": "y = 3200", "color": "#16a34a" },
          { "id": "pt", "latex": "(1130, 3200)", "color": "#dc2626", "label": "(1130, 3200)", "showLabel": true }
        ],
        "caption": "The total cargo weight line y = 2070 + x stays at or below the 3,200-pound capacity limit for all x <= 1,130."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $w \le 1{,}130$:** **Correct.** Subtracts the $18 \times 115 = 2{,}070$ pounds of crates from the $3{,}200$-pound capacity to get $w \le 1{,}130$.
      * **(B) $w \ge 1{,}130$:** *Inequality Direction Trap.* Computes the remaining capacity $1{,}130$ accurately, but reverses the sign so $w$ is *at least* $1{,}130$ pounds, which would overload the van.
      * **(C) $w \le 3{,}085$:** *Single-Crate Trap.* Subtracts the weight of only **one** crate ($3{,}200 - 115 = 3{,}085$) instead of multiplying $115$ by all $18$ crates.
      * **(D) $w \ge 2{,}070$:** *Wrong Quantity & Sign Trap.* Uses the weight of the loaded crates ($2{,}070$) as a lower bound for $w$ rather than subtracting it from $3{,}200$.
    options:
      - id: "A"
        text: "$w \\le 1{,}130$"
      - id: "B"
        text: "$w \\ge 1{,}130$"
      - id: "C"
        text: "$w \\le 3{,}085$"
      - id: "D"
        text: "$w \\ge 2{,}070$"

  - id: "sat-t1-m2e-q3"
    questionNumber: 3
    questionType: "MC"
    correctAnswer: "B"
    domain: "Problem-Solving and Data Analysis"
    skill: "One-variable data: distributions and measures of center and spread"
    difficulty: "Easy"
    containsGraph: true
    containsChart: false
    containsDiagram: false
    stimulus: |
      ![](./assets/dSAT-T1-M2E-Q3.svg)
    prompt: |
      A librarian recorded the number of books checked out by each student in a reading group during the semester, as shown in the dot plot. What was the most frequent number of books checked out by a student in this group?
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify the **mode** (most frequent data value) from a dot plot. In a dot plot, the horizontal axis displays the **data values** (number of books checked out), while the height of each vertical stack of dots represents the **frequency** (number of students). Locate the tallest stack and read the value directly underneath it on the horizontal axis.

      :::tabs

      == tab: Solving the question with Algebra
      Count the dots in each column to identify the maximum frequency, then read the corresponding number of books on the horizontal axis.

      :::derivation
      == step: Count the Frequency of Each Book Count
      -- why: Each dot represents one student, so the vertical height of each stack gives the student count for that number of books.
      * $0$ books: $2$ students
      * $1$ book: $4$ students
      * ${\color{#2563eb}{2}}$ books: ${\color{#d97706}{7}}$ students
      * $3$ books: $5$ students
      * $4$ books: $3$ students
      * $5$ books: $1$ student

      == step: Identify the Most Frequent Number of Books
      -- why: Compare the frequencies to find the tallest stack, and report its horizontal-axis value rather than its dot count.
      $$
      \text{Maximum frequency} = {\color{#d97706}{7}}\text{ students at } {\color{#2563eb}{2}}\text{ books}
      $$
      Therefore, the most frequent number of books checked out was $2$.
      :::

      **Shortcut Insight:** Always separate **"how many"** (frequency = $7$ dots) from **"what value"** (data value = $2$ books)! On dot-plot mode questions, the tallest stack's height ($7$) is almost always placed as a trap answer choice alongside the actual horizontal-axis value ($2$).

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $1$:** *Lowest-Frequency Trap.* Confuses the minimum frequency ($1$ student at $5$ books) with the most frequent data value.
      * **(B) $2$:** **Correct.** The column above $2$ books has the tallest stack ($7$ dots), making $2$ the mode.
      * **(C) $5$:** *Maximum Value Trap.* Reports the largest number of books checked out by any student ($5$, the rightmost value on the axis) rather than the most *frequent* value.
      * **(D) $7$:** *Frequency-vs.-Value Trap.* Reports the number of students in the tallest stack ($7$ dots) instead of the number of books ($2$) represented by that column.
    options:
      - id: "A"
        text: "$1$"
      - id: "B"
        text: "$2$"
      - id: "C"
        text: "$5$"
      - id: "D"
        text: "$7$"

  - id: "sat-t1-m2e-q4"
    questionNumber: 4
    questionType: "MC"
    correctAnswer: "B"
    domain: "Algebra"
    skill: "Linear functions"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A digital music service charges a flat monthly platform access fee plus a fixed cost per album download. The total monthly cost, in dollars, is modeled by the function $C(n) = 1.25n + 7.50$, where $n$ is the number of albums downloaded in a month. If a customer was billed a total of &dollar;$22.50$ for one month, how many albums did the customer download that month?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the input $n$ (the number of albums downloaded) that produces a total monthly cost output of $C(n) = 22.50$. Set the linear cost model equal to $22.50$, subtract the flat monthly access fee ($7.50$) to isolate the variable download charges, and divide by the per-album rate ($1.25$).

      :::tabs

      == tab: Solving the question with Algebra
      Set the cost function equal to the total monthly bill, isolate the variable term $1.25n$, and solve for $n$.

      :::derivation
      == step: Set the Cost Function Equal to 22.50
      -- why: Replace $C(n)$ with the billed total of $22.50$ to form a one-variable linear equation in $n$.
      $$
      1.25{\color{#2563eb}{n}} + {\color{#d97706}{7.50}} = 22.50
      $$

      == step: Subtract the Flat Monthly Fee
      -- why: Remove the fixed access fee ($7.50$) from both sides to isolate the variable cost for the downloaded albums.
      $$
      \begin{aligned}
      1.25{\color{#2563eb}{n}} &= 22.50 - {\color{#d97706}{7.50}} \\
      1.25{\color{#2563eb}{n}} &= 15.00
      \end{aligned}
      $$

      == step: Divide by the Per-Album Cost
      -- why: Divide both sides by $1.25$ to solve for $n$.
      $$
      {\color{#2563eb}{n}} = \dfrac{15.00}{1.25} = 12
      $$
      :::

      **Shortcut Insight:** Convert the decimal rate into a simple fraction! Because $\$1.25 = \dfrac{5}{4}$ of a dollar, dividing $\$15.00$ by $\$1.25$ is identical to multiplying $15 \times \dfrac{4}{5} = 3 \times 4 = 12$ albums—no calculator needed.

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $10$:** *Arithmetic Slip Trap.* Subtracts $7.50$ to get $15.00$, but divides incorrectly or estimates $15 \div 1.50 = 10$.
      * **(B) $12$:** **Correct.** Subtracts the $\$7.50$ flat fee from $\$22.50$ to get $\$15.00$, then divides by $\$1.25$ per album to get $12$ albums.
      * **(C) $15$:** *Stopping-Early Trap.* Subtracts the flat fee ($22.50 - 7.50 = 15.00$) and reports the dollar amount spent on downloads rather than dividing by $\$1.25$ to find the number of albums.
      * **(D) $18$:** *Omitted-Fee Trap.* Ignores the $\$7.50$ flat access fee completely and divides the full bill by the per-album rate ($\dfrac{22.50}{1.25} = 18$).
    options:
      - id: "A"
        text: "$10$"
      - id: "B"
        text: "$12$"
      - id: "C"
        text: "$15$"
      - id: "D"
        text: "$18$"

  - id: "sat-t1-m2e-q5"
    questionNumber: 5
    questionType: "FR"
    correctAnswer: "18"
    domain: "Algebra"
    skill: "Linear equations in one variable"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      $$
      \dfrac{2}{5}m + 4 = 11.2
      $$

      What value of $m$ is the solution to the given equation?
    explanation: |
      ### Takeoff: What were you asked to find?
      Solve the one-variable linear equation for $m$. First subtract the constant term ($4$) from both sides to isolate the fraction term $\dfrac{2}{5}m$, then multiply both sides by the reciprocal $\dfrac{5}{2}$ (or convert $\dfrac{2}{5}$ to $0.4$) to solve for $m$.

      :::tabs

      == tab: Solving the question with Algebra
      Isolate the variable term $\dfrac{2}{5}m$ by subtracting $4$, then clear the fractional coefficient by multiplying by its reciprocal.

      :::derivation
      == step: Subtract 4 from Both Sides
      -- why: Move the constant term $+4$ to the right side of the equation to isolate $\dfrac{2}{5}m$.
      $$
      \begin{aligned}
      \dfrac{2}{5}{\color{#2563eb}{m}} + {\color{#d97706}{4}} &= 11.2 \\
      \dfrac{2}{5}{\color{#2563eb}{m}} &= 11.2 - {\color{#d97706}{4}} \\
      \dfrac{2}{5}{\color{#2563eb}{m}} &= 7.2
      \end{aligned}
      $$

      == step: Multiply Both Sides 5/2
      -- why: Multiplying by the reciprocal of $\dfrac{2}{5}$ cancels the fraction on the left side and isolates $m$.
      $$
      \begin{aligned}
      {\color{#2563eb}{m}} &= 7.2 \times \dfrac{5}{2} \\
      {\color{#2563eb}{m}} &= 3.6 \times 5 = 18
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Convert $\dfrac{2}{5}$ directly to the decimal $0.4$! Once you have $0.4m = 7.2$, multiply both sides by $10$ to eliminate decimals completely: $4m = 72 \implies m = \dfrac{72}{4} = 18$.

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      Because this is a **Student-Produced Response (SPR)** question, double-check that you avoided these common traps before entering **`18`**:
      * **Multiplying by $\dfrac{2}{5}$ Instead of $\dfrac{5}{2}$ ($2.88$):** Multiplying $7.2 \times \dfrac{2}{5} = 2.88$ instead of multiplying by the reciprocal $\dfrac{5}{2}$.
      * **Forgetting to Subtract $4$ First ($28$ or $24$):** Dividing $11.2$ by $\dfrac{2}{5}$ before subtracting $4$ gives $28$, or forgetting to multiply $4$ by $\dfrac{5}{2}$ when clearing fractions gives $28 - 4 = 24$.
      * **Adding $4$ Instead of Subtracting $4$ ($38$):** Computing $11.2 + 4 = 15.2$ instead of $11.2 - 4 = 7.2$, yielding $15.2 \times \dfrac{5}{2} = 38$.
  - id: "sat-t1-m2e-q6"
    questionNumber: 6
    questionType: "FR"
    correctAnswer: "126"
    domain: "Problem-Solving and Data Analysis"
    skill: "Percentages"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A community theater printed $840$ promotional flyers for an upcoming musical. Student volunteers distributed $15\%$ of these flyers on the first day of advertising. How many of the flyers did the volunteers distribute on the first day?
    explanation: |
      ### Takeoff: What were you asked to find?
      Calculate the exact number of flyers distributed on the first day, which is **$15\%$ of $840$**. Convert $15\%$ into its decimal form ($0.15$) or fraction form ($\dfrac{15}{100}$) and multiply by the total number of printed flyers ($840$).

      :::tabs

      == tab: Solving the question with Algebra
      Convert $15\%$ to a decimal and multiply by the total number of flyers ($840$).

      :::derivation
      == step: Convert 15% to a Decimal
      -- why: Divide $15$ by $100$ (move the decimal point two places to the left) so you can multiply directly.
      $$
      {\color{#2563eb}{15\%}} = \dfrac{15}{100} = {\color{#2563eb}{0.15}}
      $$

      == step: Multiply by the Total Number of Flyers
      -- why: Multiply the decimal rate ($0.15$) by the total printed flyers ($840$) to find how many were distributed.
      $$
      \begin{aligned}
      \text{Flyers distributed} &= {\color{#2563eb}{0.15}} \times {\color{#d97706}{840}} \\
      &= 126
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Split $15\%$ into **$10\% + 5\%$** for instant mental math! $10\%$ of $840$ is $84$, and $5\%$ is half of that ($42$). Adding them together gives $84 + 42 = 126$ flyers in seconds.

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      Because this is a **Student-Produced Response (SPR)** question, double-check that you avoided these common traps before entering **`126`**:
      * **Reporting the Remaining Flyers Instead of Distributed Flyers ($714$):** Subtracting $840 - 126 = 714$ answers *"how many flyers were left over?"* rather than *"how many flyers did the volunteers distribute?"*
      * **Decimal Place Error ($12.6$ or $1260$):** Multiplying by $0.015$ ($12.6$) or $1.5$ ($1{,}260$) instead of $0.15$.
      * **Dividing by $15$ Instead of Multiplying by $0.15$ ($56$):** Computing $\dfrac{840}{15} = 56$.
  - id: "sat-t1-m2e-q7"
    questionNumber: 7
    questionType: "MC"
    correctAnswer: "A"
    domain: "Algebra"
    skill: "Linear functions"
    difficulty: "Easy"
    containsGraph: false
    containsChart: true
    containsDiagram: false
    stimulus: |
      The table below displays selected values of $x$ and their corresponding values of $g(x)$ for a linear function $g$.

      | $x$ | $g(x)$ |
      | :---: | :---: |
      | $0$ | $9$ |
      | $2$ | $17$ |
      | $5$ | $29$ |
    prompt: |
      Which equation defines the function $g$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Determine the linear equation $g(x) = mx + b$ that matches all three $(x, g(x))$ pairs in the table. Read the **$y$-intercept** $b$ directly from the row where $x = 0$, then calculate the **slope** $m = \dfrac{\Delta y}{\Delta x}$ between any two rows in the table.

      :::tabs

      == tab: Solving the question with Algebra
      Identify the $y$-intercept from the first row of the table, compute the slope using two points, and substitute both values into slope-intercept form.

      :::derivation
      == step: Identify the y-Intercept from the Table
      -- why: In slope-intercept form $g(x) = mx + b$, the constant $b$ is the output when $x = 0$.
      From the first row $(0, 9)$, when $x = 0$, $g(0) = {\color{#d97706}{9}}$, so:
      $$
      {\color{#d97706}{b}} = 9
      $$

      == step: Calculate the Slope Using Two Points
      -- why: Divide the change in $g(x)$ by the change in $x$ using $(0, 9)$ and $(2, 17)$.
      $$
      {\color{#2563eb}{m}} = \dfrac{17 - 9}{2 - 0} = \dfrac{8}{2} = 4
      $$

      == step: Write the Equation and Verify with the Third Row
      -- why: Substitute $m = 4$ and $b = 9$ into $g(x) = mx + b$, then check $x = 5$.
      $$
      g(x) = {\color{#2563eb}{4}}x + {\color{#d97706}{9}}
      $$
      Checking $x = 5$: $g(5) = {\color{#2563eb}{4}}(5) + {\color{#d97706}{9}} = 20 + 9 = 29 \quad \checkmark$
      :::

      **Shortcut Insight:** Plug $x = 2$ directly into the answer choices! Because $g(0) = 9$, only choices with $+ 9$ can work—immediately eliminating **(C)**. Testing $x = 2$ in **(A)** gives $4(2) + 9 = 17$, matching the second row in under five seconds.

      == tab: Applying DESMOS
      You can enter the table values directly into Desmos and run a **linear regression** (`y_1 ~ m x_1 + b`) to extract the exact slope and $y$-intercept automatically.

      1. Enter the points `(0, 9)`, `(2, 17)`, and `(5, 29)` as order lists of the coordinates.
      2. In line 2, type `y_1 ~ m x_1 + b`.
      3. Desmos outputs `m = 4` and `b = 9` with $R^2 = 1$, confirming **$g(x) = 4x + 9$**.

      :::desmos
      {
        "bounds": { "left": -2, "right": 8, "bottom": -2, "top": 35 },
        "expressions": [
          { "id": "xvals", "latex": "x_1 = [0, 2, 5]" },
          { "id": "yvals", "latex": "y_1 = [9, 17, 29]" },
          { "id": "pts", "latex": "(x_1, y_1)", "color": "#2563eb" },
          { "id": "line", "latex": "y = 4x + 9", "color": "#16a34a" }
        ],
        "caption": "The line y = 4x + 9 passes cleanly through all three table points: (0, 9), (2, 17), and (5, 29)."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $g(x) = 4x + 9$:** **Correct.** Uses the $y$-intercept $g(0) = 9$ and divides $\Delta y = 8$ by $\Delta x = 2$ to get slope $m = 4$.
      * **(B) $g(x) = 8x + 9$:** *Unscaled Change Trap.* Computes the change in $g(x)$ ($17 - 9 = 8$) as the slope without dividing by the change in $x$ ($2 - 0 = 2$).
      * **(C) $g(x) = 9x + 4$:** *Swapped Slope and y-Intercept Trap.* Reverses $m = 4$ and $b = 9$, putting the $y$-intercept in front of $x$ and the slope as the constant term.
      * **(D) $g(x) = 2x + 9$:** *Using $\Delta x$ as Slope Trap.* Uses the change in $x$ ($2$) as the slope instead of $\dfrac{\Delta y}{\Delta x} = \dfrac{8}{2} = 4$.
    options:
      - id: "A"
        text: "$g(x) = 4x + 9$"
      - id: "B"
        text: "$g(x) = 8x + 9$"
      - id: "C"
        text: "$g(x) = 9x + 4$"
      - id: "D"
        text: "$g(x) = 2x + 9$"
  - id: "sat-t1-m2e-q8"
    questionNumber: 8
    questionType: "MC"
    correctAnswer: "A"
    domain: "Advanced Math"
    skill: "Nonlinear equations in one variable and systems of equations in two variables"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The area of a square garden patio is given by the equation $5s^2 - 45 = 135$, where $s$ is the side length of the patio in meters. What is the value of $s$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Solve the quadratic equation $5s^2 - 45 = 135$ for the side length $s$. Because $s^2$ appears alone without a linear $s$-term, isolate $s^2$ directly using inverse operations, take the square root of both sides, and keep the **positive** root since side length must be greater than $0$.

      :::tabs

      == tab: Solving the question with Algebra
      Isolate $s^2$ by adding $45$ and dividing by $5$, then take the positive square root.

      :::derivation
      == step: Add 45 to Both Sides
      -- why: Move the constant term $-45$ to the right side to isolate $5s^2$.
      $$
      \begin{aligned}
      5{\color{#2563eb}{s}}^2 - {\color{#d97706}{45}} &= 135 \\
      5{\color{#2563eb}{s}}^2 &= 135 + {\color{#d97706}{45}} \\
      5{\color{#2563eb}{s}}^2 &= 180
      \end{aligned}
      $$

      == step: Divide Both Sides by 5
      -- why: Divide by the coefficient $5$ to isolate $s^2$.
      $$
      {\color{#2563eb}{s}}^2 = \dfrac{180}{5} = 36
      $$

      == step: Take the Positive Square Root
      -- why: Solve for $s$ by taking the square root of both sides, discarding the negative root because length cannot be negative.
      $$
      {\color{#2563eb}{s}} = \sqrt{36} = 6
      $$
      :::

      **Shortcut Insight:** Divide the entire equation by $5$ right at the start! Because every term in $5s^2 - 45 = 135$ is divisible by $5$, dividing through immediately gives $s^2 - 9 = 27 \implies s^2 = 36 \implies s = 6$ with much smaller numbers.

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $6$:** **Correct.** Isolates $s^2 = 36$ and takes the positive square root $s = 6$.
      * **(B) $12$:** *Dividing by 2 Instead of Taking the Square Root Trap.* Solves $s^2 = 36$ correctly, or splits $5s^2 = 180$ carelessly, and divides $36 \div 3 = 12$ or confuses $6^2$ with $2s$.
      * **(C) $36$:** *Stopping at $s^2$ Trap.* Isolates $s^2 = 36$ and forgets the final step of taking the square root to find $s$.
      * **(D) $180$:** *Stopping After Step 1 Trap.* Adds $45$ to $135$ to get $5s^2 = 180$ and stops before dividing by $5$ and taking the square root.
    options:
      - id: "A"
        text: "$6$"
      - id: "B"
        text: "$12$"
      - id: "C"
        text: "$36$"
      - id: "D"
        text: "$180$"
  - id: "sat-t1-m2e-q9"
    questionNumber: 9
    questionType: "MC"
    correctAnswer: "D"
    domain: "Geometry and Trigonometry"
    skill: "Lines, angles, and triangles"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: true
    stimulus: |
      ![](./assets/dSAT-T1-M2E-Q9.svg)

      Note: Figure not drawn to scale.
    prompt: |
      In the figure shown, line $p$ is parallel to line $q$, and line $r$ intersects both lines. What is the value of $w$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the angle measure $w$ where transversal line $r$ intersects parallel lines $p$ and $q$. When a transversal crosses two parallel lines, every acute angle equals the other acute angles ($58^\circ$), every obtuse angle equals the other obtuse angles, and any acute-obtuse pair sums to **$180^\circ$** (supplementary).

      :::tabs

      == tab: Solving the question with Algebra
      Translate the $58^\circ$ angle down to its corresponding position on line $q$, then use the straight-line linear pair along line $q$ to solve for $w$.

      :::derivation
      == step: Find the Corresponding Angle on Line q
      -- why: Because line $p$ is parallel to line $q$, corresponding angles in the same relative position (upper-right) at each intersection are equal.
      ![](./assets/dSAT-T1-M2E-Q9EXP.svg)
      
      The upper-right angle formed by line $q$ and transversal $r$ corresponds directly to the $58^\circ$ angle on line $p$, so it also measures:
      $$
      {\color{#d97706}{58^\circ}}
      $$

      == step: Use Supplementary Angles Along Line q to Solve for w
      -- why: Along straight line $q$, the obtuse angle $w^\circ$ (upper-left) and the acute angle $58^\circ$ (upper-right) form a linear pair whose measures sum to $180^\circ$.
      $$
      \begin{aligned}
      {\color{#2563eb}{w}} + {\color{#d97706}{58}} &= 180 \\
      {\color{#2563eb}{w}} &= 180 - {\color{#d97706}{58}} = 122
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** On any parallel-lines-with-transversal diagram, there are only **two** angle sizes: the **acute** angles (all equal to $58^\circ$) and the **obtuse** angles (all equal to $180^\circ - 58^\circ = 122^\circ$). Because $w^\circ$ is visibly an obtuse angle (greater than $90^\circ$), you can immediately eliminate **(A)** ($32$) and **(B)** ($58$) and pick $180 - 58 = 122$ in seconds!

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $32$:** *Complementary Angle Trap.* Subtracts $58^\circ$ from $90^\circ$ ($90 - 58 = 32$) instead of subtracting from a straight angle of $180^\circ$.
      * **(B) $58$:** *Congruent-Angle Trap.* Assumes $w^\circ$ and $58^\circ$ are equal corresponding or alternate angles, ignoring that $58^\circ$ is in the upper-right position while $w^\circ$ is in the upper-left supplementary position.
      * **(C) $116$:** *Doubling Trap.* Multiplies $58 \times 2 = 116$ instead of subtracting $58$ from $180$.
      * **(D) $122$:** **Correct.** Transfers $58^\circ$ to the corresponding upper-right angle on line $q$, then subtracts from $180^\circ$ ($180 - 58 = 122$).
    options:
      - id: "A"
        text: "$32$"
      - id: "B"
        text: "$58$"
      - id: "C"
        text: "$116$"
      - id: "D"
        text: "$122$"
  - id: "sat-t1-m2e-q10"
    questionNumber: 10
    questionType: "MC"
    correctAnswer: "B"
    domain: "Problem-Solving and Data Analysis"
    skill: "Probability and conditional probability"
    difficulty: "Easy"
    containsGraph: true
    containsChart: false
    containsDiagram: false
    stimulus: |
      ![](./assets/dSAT-T1-M2E-Q10.svg)
    prompt: |
      A community library surveyed a random sample of $50$ patrons to determine the primary reason for their visit on a Saturday afternoon. The results are summarized in the bar graph shown. If one of these patrons is selected at random, what is the probability that the patron's primary reason for visiting was to attend an author workshop?
    explanation: |
      ### Takeoff: What were you asked to find?
      Calculate the simple theoretical probability that a randomly chosen patron from the $50$-person sample visited to attend an **author workshop**. Read the frequency for **Author workshop** from the bar graph and divide it by the total sample size of $50$ patrons:
      $$
      P(\text{Author workshop}) = \dfrac{\text{Number of patrons attending an author workshop}}{\text{Total number of patrons surveyed}}
      $$

      :::tabs

      == tab: Solving the question with Algebra
      Read the height of the **Author workshop** bar from the graph and divide by the total number of surveyed patrons ($50$).

      :::derivation
      == step: Read the Favorable Outcome Count from the Graph
      -- why: Locate the bar labeled "Author workshop" and read its value on the vertical frequency axis.
      From the bar graph, the number of patrons whose primary reason was to attend an author workshop is:
      $$
      {\color{#2563eb}{11}}
      $$

      == step: Divide by the Total Number of Surveyed Patrons
      -- why: Confirm the sum of all four bars ($18 + 17 + 11 + 4 = 50$) matches the $50$ patrons given in the prompt, then form the probability fraction.
      $$
      \begin{aligned}
      P(\text{Author workshop}) &= \dfrac{{\color{#2563eb}{11}}}{{\color{#d97706}{50}}}
      \end{aligned}
      $$
      Because $11$ is prime and does not divide $50$, the fraction $\dfrac{11}{50}$ is already in simplest form.
      :::

      **Shortcut Insight:** Always check the **denominator** first on bar-graph probability questions! The prompt explicitly gives the sample size as **$50$ patrons**, which immediately makes $\dfrac{\text{favorable}}{50}$ your target structure—pointing straight to **(B)** ($\dfrac{11}{50}$) without even needing to sum all four bars manually.

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $\dfrac{11}{100}$:** *Percentage-Denominator Trap.* Confuses a probability fraction out of $50$ patrons with a percentage denominator of $100$ (turning $11$ patrons into $11\% = \dfrac{11}{100}$ instead of $\dfrac{22}{100} = \dfrac{11}{50}$).
      * **(B) $\dfrac{11}{50}$:** **Correct.** Divides the $11$ patrons attending an author workshop by the $50$ total surveyed patrons.
      * **(C) $\dfrac{1}{4}$:** *Category-Count Trap.* Assumes each of the $4$ bars on the graph is equally likely ($\dfrac{1}{4}$), ignoring the actual patron counts represented by the bar heights.
      * **(D) $\dfrac{11}{39}$:** *Part-to-Part Odds Trap.* Compares the $11$ workshop patrons to the remaining $50 - 11 = 39$ non-workshop patrons ($\dfrac{11}{39}$) instead of dividing by the full sample of $50$.
    options:
      - id: "A"
        text: "$\\dfrac{11}{100}$"
      - id: "B"
        text: "$\\dfrac{11}{50}$"
      - id: "C"
        text: "$\\dfrac{1}{4}$"
      - id: "D"
        text: "$\\dfrac{11}{39}$"
  - id: "sat-t1-m2e-q11"
    questionNumber: 11
    questionType: "MC"
    correctAnswer: "B"
    domain: "Algebra"
    skill: "Linear equations in two variables"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A catering service charges for events using the pricing model:

      $$
      \begin{aligned}
      4x &= 48 \\
      5x - 38 &= y
      \end{aligned}
      $$

      where $x$ is the scheduled duration of an event in hours, and $y$ is the equipment preparation surcharge in dollars. What is the value of $y$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Solve the system of two linear equations for **$y$** (the equipment preparation surcharge in dollars). Because the first equation ($4x = 48$) contains only $x$, solve it immediately for $x$ and substitute that value into the second equation to calculate $y$—or graph both lines in Desmos and read the $y$-coordinate of their intersection.

      :::tabs

      == tab: Solving the question with Algebra
      Solve the first equation for $x$, then plug that value into the second equation to evaluate $y$.

      :::derivation
      == step: Solve the First Equation for x
      -- why: Divide both sides of $4x = 48$ by $4$ to isolate $x$.
      $$
      \begin{aligned}
      4{\color{#2563eb}{x}} &= 48 \\
      {\color{#2563eb}{x}} &= \dfrac{48}{4} = 12
      \end{aligned}
      $$

      == step: Substitute x = 12 into the Second Equation
      -- why: Replace $x$ with $12$ in $5x - 38 = y$ and simplify to find $y$.
      $$
      \begin{aligned}
      {\color{#d97706}{y}} &= 5({\color{#2563eb}{12}}) - 38 \\
      {\color{#d97706}{y}} &= 60 - 38 = 22
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Avoid solving for $x$ completely by scaling $4x = 48$ directly to $5x$! Notice that $5x$ is simply $4x + x$: since $4x = 48$, one $x$ is $\dfrac{48}{4} = 12$, so $5x = 48 + 12 = 60$. Subtracting $38$ gives $y = 60 - 38 = 22$ in one mental step.

      == tab: Applying DESMOS
      Because this system uses the variables $x$ and $y$ with **explicitly defined numerical constants** (and no unknown parameters like $a$ or $k$), you can solve it directly in Desmos by graphing both equations and clicking their intersection. *(Note: On harder questions that introduce unknown constants or ask for conditions where lines are parallel or identical, graphing alone won't isolate the answer—that is when algebraic structure becomes essential.)*

      1. Enter `4x = 48` in line 1 (which plots the vertical line $x = 12$) and `5x - 38 = y` in line 2.
      2. Click the gray intersection dot at $(12, 22)$ and read the $y$-coordinate, confirming $y = \mathbf{22}$.

      :::desmos
      {
        "bounds": { "left": -4, "right": 24, "bottom": -10, "top": 40 },
        "expressions": [
          { "id": "eq1", "latex": "4x = 48", "color": "#2563eb" },
          { "id": "eq2", "latex": "5x - 38 = y", "color": "#16a34a" },
          { "id": "pt", "latex": "(12, 22)", "color": "#dc2626", "label": "(12, 22)", "showLabel": true }
        ],
        "caption": "The vertical line 4x = 48 and the line 5x - 38 = y intersect at (12, 22), so y = 22."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $12$:** *Wrong-Variable Trap.* Solves the first equation accurately ($x = 12$), but reports the duration $x$ instead of substituting $x = 12$ to find $y$.
      * **(B) $22$:** **Correct.** Finds $x = 12$ from $4x = 48$, then computes $y = 5(12) - 38 = 22$.
      * **(C) $38$:** *Constant-Term Trap.* Reports the subtracted constant $38$ from the second equation without performing the substitution.
      * **(D) $60$:** *Stopping-Early Trap.* Multiplies $5(12) = 60$ correctly, but forgets to subtract $38$ to finish evaluating $y$.
    options:
      - id: "A"
        text: "$12$"
      - id: "B"
        text: "$22$"
      - id: "C"
        text: "$38$"
      - id: "D"
        text: "$60$"
  - id: "sat-t1-m2e-q12"
    questionNumber: 12
    questionType: "MC"
    correctAnswer: "B"
    domain: "Algebra"
    skill: "Linear equations in two variables"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      An environmental club earns fundraising credits by collecting recyclable materials. The club receives $1$ credit for each bag of aluminum cans turned in and $4$ credits for each bundle of cardboard turned in. At the end of the semester, the club earned a total of $78$ credits. Which equation models this relationship, where $c$ is the number of bags of cans and $b$ is the number of bundles of cardboard collected?
    explanation: |
      ### Takeoff: What were you asked to find?
      Translate the word problem into a **two-variable linear equation in standard form** ($Ax + By = C$). Multiply each item count ($c$ and $b$) by its corresponding per-unit credit value ($1$ and $4$), then set the sum of those two credit totals equal to $78$.

      :::tabs

      == tab: Solving the question with Algebra
      Write separate expressions for the credits earned from aluminum cans and cardboard bundles, then sum them to the total of $78$ credits.

      :::derivation
      == step: Express Credits Earned from Each Material
      -- why: Multiply the quantity of each recyclable item by the credits awarded per unit.
      * Credits from $c$ bags of aluminum cans at $1$ credit per bag:
        $$1 \cdot {\color{#2563eb}{c}} = {\color{#2563eb}{c}}$$
      * Credits from $b$ bundles of cardboard at $4$ credits per bundle:
        $$4 \cdot {\color{#d97706}{b}} = 4{\color{#d97706}{b}}$$

      == step: Sum Both Contributions to the Total Credits
      -- why: Combine the credits from cans and cardboard and set the total equal to $78$.
      $$
      {\color{#2563eb}{c}} + 4{\color{#d97706}{b}} = 78
      $$
      :::

      **Shortcut Insight:** Plug in a quick concrete test case! Suppose the club turned in **$0$ bags of cans** ($c = 0$) and **$2$ bundles of cardboard** ($b = 2$): at $4$ credits per bundle, they must earn $4(2) = 8$ credits (not $78$). Only an equation with **$4b$** gives $4(2) = 8$ credits for $2$ bundles of cardboard—immediately eliminating **(A)**, **(C)**, and **(D)** and confirming **(B)**!

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $4c + b = 78$:** *Swapped Coefficients Trap.* Attaches the $4$-credit rate to $c$ (bags of cans) and the $1$-credit rate to $b$ (bundles of cardboard) instead of matching $4$ credits to cardboard ($b$).
      * **(B) $c + 4b = 78$:** **Correct.** Multiplies $c$ bags of cans by $1$ credit and $b$ bundles of cardboard by $4$ credits, summing to $78$.
      * **(C) $c + \dfrac{b}{4} = 78$:** *Division-Instead-of-Multiplication Trap.* Divides $b$ by $4$ instead of multiplying $b$ by $4$, which would award only $\dfrac{1}{4}$ of a credit per bundle of cardboard.
      * **(D) $\dfrac{c}{4} + b = 78$:** *Swapped & Divided Trap.* Both attaches the $4$ to the wrong variable ($c$) and divides instead of multiplying.
    options:
      - id: "A"
        text: "$4c + b = 78$"
      - id: "B"
        text: "$c + 4b = 78$"
      - id: "C"
        text: "$c + \\dfrac{b}{4} = 78$"
      - id: "D"
        text: "$\\dfrac{c}{4} + b = 78$"
  - id: "sat-t1-m2e-q13"
    questionNumber: 13
    questionType: "MC"
    correctAnswer: "C"
    domain: "Problem-Solving and Data Analysis"
    skill: "Inference from sample statistics and margin of error"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A public university wanted to estimate how many of its $24{,}000$ enrolled undergraduate students plan to enroll in a summer internship program. The university selected a random sample of $400$ undergraduate students and asked each whether they intend to enroll in an internship. Of the surveyed students, $385$ responded that they do not plan to enroll, and the remaining students responded that they do plan to enroll. Based on this sample, which of the following is the best estimate of the total number of enrolled undergraduate students who plan to enroll in a summer internship?
    explanation: |
      ### Takeoff: What were you asked to find?
      Estimate the total number of students in the **$24{,}000$-student population** who plan to enroll in a summer internship. Because the prompt gives the number of surveyed students who do **not** plan to enroll ($385$ out of $400$), first find how many sampled students *do* plan to enroll, compute their sample proportion, and scale that proportion up to the full population of $24{,}000$.

      :::tabs

      == tab: Solving the question with Algebra
      Find the favorable count in the sample, form the sample proportion, and multiply by the total undergraduate population.

      :::derivation
      == step: Find the Number of Sampled Students Planning to Enroll
      -- why: Subtract the $385$ students who do not plan to enroll from the total sample size of $400$.
      $$
      \text{Sampled students planning to enroll} = 400 - 385 = {\color{#2563eb}{15}}
      $$

      == step: Form the Sample Proportion
      -- why: Divide the $15$ students planning to enroll by the sample size of $400$.
      $$
      \text{Sample proportion} = \dfrac{{\color{#2563eb}{15}}}{{\color{#d97706}{400}}}
      $$

      == step: Scale the Proportion to the Full Population
      -- why: Multiply the sample proportion by the $24{,}000$ enrolled undergraduate students.
      $$
      \begin{aligned}
      \text{Estimated total} &= 24{,}000 \times \dfrac{{\color{#2563eb}{15}}}{{\color{#d97706}{400}}} \\
      &= \dfrac{24{,}000}{{\color{#d97706}{400}}} \times {\color{#2563eb}{15}} \\
      &= 60 \times {\color{#2563eb}{15}} = 900
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Use a **scale factor** instead of converting $\dfrac{15}{400}$ into a decimal! Notice how many times the sample fits into the full population: $\dfrac{24{,}000}{400} = \dfrac{240}{4} = 60$. Since the population is $60$ times larger than the sample, simply multiply the $15$ students in the sample by $60$ to get $15 \times 60 = 900$.

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $15$:** *Stopping-Early Trap.* Finds the number of students in the *sample* who plan to enroll ($400 - 385 = 15$), but forgets to scale that count up to the $24{,}000$-student population.
      * **(B) $90$:** *Place-Value Trap.* Drops a zero when dividing $\dfrac{24{,}000}{400}$ (getting $6$ instead of $60$), yielding $6 \times 15 = 90$.
      * **(C) $900$:** **Correct.** Finds $400 - 385 = 15$ sampled students planning to enroll and scales $\dfrac{15}{400} \times 24{,}000 = 900$.
      * **(D) $9{,}000$:** *Place-Value Trap.* Adds an extra zero when scaling (computing $600 \times 15 = 9{,}000$, which would imply $37.5\%$ of the university rather than $3.75\%$).
    options:
      - id: "A"
        text: "$15$"
      - id: "B"
        text: "$90$"
      - id: "C"
        text: "$900$"
      - id: "D"
        text: "$9{,}000$"
  - id: "sat-t1-m2e-q14"
    questionNumber: 14
    questionType: "FR"
    correctAnswer: "4800"
    domain: "Advanced Math"
    skill: "Exponential functions"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      An environmental agency models the estimated fish population, $P$, in a newly restored wetland reserve using the equation $P = a(1.25)^t$, where $a$ is a positive constant and $t$ represents the time, in years, since the restoration began. According to the model, the estimated fish population was $7{,}500$ exactly $2$ years after the restoration began. What was the estimated fish population in the wetland at the start of the restoration ($t = 0$)?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the initial fish population at the start of the restoration (**$t = 0$**). In the exponential growth model $P = a(1.25)^t$, substituting $t = 0$ gives $P = a(1.25)^0 = a$, so finding the initial population is equivalent to solving for the unknown constant **$a$** using the given data point $(t, P) = (2, 7{,}500)$.

      :::tabs

      == tab: Solving the question with Algebra
      Substitute $t = 2$ and $P = 7{,}500$ into the exponential model to solve for $a$, then evaluate $P$ at $t = 0$.

      :::derivation
      == step: Relate the Initial Population to the Constant a
      -- why: Substitute $t = 0$ into $P = a(1.25)^t$ to confirm that the starting population equals $a$.
      $$
      P(0) = {\color{#2563eb}{a}}(1.25)^0 = {\color{#2563eb}{a}}(1) = {\color{#2563eb}{a}}
      $$

      == step: Substitute the Known Point at t = 2
      -- why: Use the given population of $7{,}500$ fish at $t = 2$ years to set up an equation for $a$.
      $$
      {\color{#d97706}{7{,}500}} = {\color{#2563eb}{a}}(1.25)^2
      $$

      == step: Solve for a
      -- why: Evaluate $(1.25)^2 = 1.5625$ (or $\dfrac{25}{16}$) and divide both sides to isolate $a$.
      $$
      \begin{aligned}
      {\color{#d97706}{7{,}500}} &= {\color{#2563eb}{a}}(1.5625) \\
      {\color{#2563eb}{a}} &= \dfrac{{\color{#d97706}{7{,}500}}}{1.5625} = 4{,}800
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Convert the decimal growth factor $1.25$ into the fraction **$\dfrac{5}{4}$**! Squaring $\dfrac{5}{4}$ gives $\left(\dfrac{5}{4}\right)^2 = \dfrac{25}{16}$, so $7{,}500 = a\left(\dfrac{25}{16}\right)$. Multiplying by the reciprocal gives $a = 7{,}500 \times \dfrac{16}{25} = 300 \times 16 = 4{,}800$ cleanly in your head.

      == tab: Applying DESMOS
      Because the equation $7{,}500 = a(1.25)^2$ has only **one unknown constant** ($a$) after substituting $t = 2$ and $P = 7{,}500$, you can solve it in Desmos by replacing $a$ with $x$ and finding where the two sides intersect. *(Note: Desmos will not plot an equation using $a$ directly without creating a slider; renaming the single unknown to $x$ turns it into an immediate intersection problem.)*

      1. Enter `y = x(1.25)^2` in line 1 and `y = 7500` in line 2.
      2. Click the intersection point at $(4800, 7500)$ and read the $x$-coordinate, confirming $a = \mathbf{4{,}800}$.

      :::desmos
      {
        "bounds": { "left": -500, "right": 6500, "bottom": -1000, "top": 9500 },
        "expressions": [
          { "id": "lhs", "latex": "y = x(1.25)^2", "color": "#2563eb" },
          { "id": "rhs", "latex": "y = 7500", "color": "#16a34a" },
          { "id": "pt", "latex": "(4800, 7500)", "color": "#dc2626", "label": "(4800, 7500)", "showLabel": true }
        ],
        "caption": "The line y = x(1.25)^2 intersects y = 7500 at (4800, 7500), confirming that the initial population is a = 4,800."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      Because this is a **Student-Produced Response (SPR)** question, double-check that you avoided these common traps before entering **`4800`**:
      * **Dividing by $1.25$ Only Once ($6000$):** Computing $\dfrac{7{,}500}{1.25} = 6{,}000$ gives the population after $1$ year ($t = 1$) instead of dividing by $(1.25)^2$ to step back $2$ full years to $t = 0$.
      * **Multiplying Instead of Dividing ($11718.75$):** Computing $7{,}500(1.25)^2 = 11{,}718.75$ projects the population $2$ years *forward* ($t = 4$) instead of solving backward for the starting population at $t = 0$.
      * **Using Linear Decay Instead of Exponential Growth ($3750$):** Subtracting $2 \times 25\% = 50\%$ of $7{,}500$ ($7{,}500 \times 0.50 = 3{,}750$) instead of dividing by $(1.25)^2$.
  - id: "sat-t1-m2e-q15"
    questionNumber: 15
    questionType: "MC"
    correctAnswer: "B"
    domain: "Geometry and Trigonometry"
    skill: "Lines, angles, and triangles"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: true
    stimulus: |
      ![](./assets/dSAT-T1-M2E-Q15.svg)

      Note: Figure not drawn to scale.
    prompt: |
      In the figure shown, $\overline{DE}$ is parallel to $\overline{AC}$. The lengths of the segments are $BD = 15$, $BA = 25$, $BE = 18$, and $DE = 12$. What is the length of $\overline{AC}$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the length of the base **$\overline{AC}$** in $\triangle BAC$. Because $\overline{DE}$ is parallel to $\overline{AC}$, the smaller top triangle ($\triangle BDE$) is **similar** to the full triangle ($\triangle BAC$), meaning corresponding sides of the two triangles are in the exact same ratio. Ignore the extraneous measurement $BE = 18$ (which belongs to the right side of the triangle, where $BC$ is unknown) and pair the left side of the small triangle ($BD = 15$) with the full left side of the large triangle ($BA = 25$).

      :::tabs

      == tab: Solving the question with Algebra
      Establish similarity between $\triangle BDE$ and $\triangle BAC$, set up the proportion of corresponding sides, and solve for $AC$.

      :::derivation
      == step: Confirm Triangle Similarity
      -- why: Because $\overline{DE} \parallel \overline{AC}$, corresponding angles along transversals $\overline{BA}$ and $\overline{BC}$ are congruent ($\angle BDE \cong \angle BAC$ and $\angle BED \cong \angle BCA$).
      With two pairs of congruent angles (and shared vertex angle $\angle B$), the two triangles are similar by Angle-Angle (AA) similarity:
      $$
      \triangle BDE \sim \triangle BAC
      $$

      == step: Set Up the Proportion of Corresponding Sides
      -- why: Match the parallel bases ($DE$ and $AC$) and the left sides ($BD$ and $BA$) of the small and large triangles.
      $$
      \dfrac{DE}{AC} = \dfrac{{\color{#2563eb}{BD}}}{{\color{#d97706}{BA}}}
      $$

      == step: Substitute the Given Lengths and Simplify
      -- why: Plug in $DE = 12$, $BD = 15$, and $BA = 25$, then reduce $\dfrac{15}{25}$ to lowest terms.
      $$
      \begin{aligned}
      \dfrac{12}{AC} &= \dfrac{{\color{#2563eb}{15}}}{{\color{#d97706}{25}}} \\
      \dfrac{12}{AC} &= \dfrac{{\color{#2563eb}{3}}}{{\color{#d97706}{5}}}
      \end{aligned}
      $$

      == step: Cross-Multiply to Solve for AC
      -- why: Multiply across the proportion and divide by $3$ to isolate $AC$.
      $$
      \begin{aligned}
      {\color{#2563eb}{3}} \cdot AC &= 12 \cdot {\color{#d97706}{5}} \\
      {\color{#2563eb}{3}} \cdot AC &= 60 \\
      AC &= \dfrac{60}{{\color{#2563eb}{3}}} = 20
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Use the **scale factor** from the small triangle to the large triangle! Comparing the left sides gives a scale factor of $\dfrac{BA}{BD} = \dfrac{25}{15} = \dfrac{5}{3}$. Simply multiply the small parallel base $DE = 12$ by $\dfrac{5}{3}$: $12 \times \dfrac{5}{3} = 4 \times 5 = 20$.

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $16$:** *Wrong-Segment Ratio Trap.* Pairs $BE = 18$ with $BD = 15$ or miscalculates the scale factor, overlooking that $BD = 15$ and $BA = 25$ are the only complete pair of corresponding sides.
      * **(B) $20$:** **Correct.** Uses $\triangle BDE \sim \triangle BAC$ to set up $\dfrac{12}{AC} = \dfrac{15}{25} = \dfrac{3}{5}$, yielding $AC = 20$.
      * **(C) $24$:** *Doubling Trap.* Assumes $D$ is the midpoint of $\overline{BA}$ (which would make $AC = 2 \cdot DE = 24$), ignoring that $BD = 15$ is more than half of $BA = 25$.
      * **(D) $30$:** *Part-to-Whole Misalignment Trap.* Subtracts $DA = 25 - 15 = 10$ and uses the bottom segment $DA = 10$ instead of the top triangle's side $BD = 15$ in the denominator ($\dfrac{12}{AC} = \dfrac{10}{25} \implies AC = 30$).
    options:
      - id: "A"
        text: "$16$"
      - id: "B"
        text: "$20$"
      - id: "C"
        text: "$24$"
      - id: "D"
        text: "$30$"
  - id: "sat-t1-m2e-q16"
    questionNumber: 16
    questionType: "MC"
    correctAnswer: "D"
    domain: "Advanced Math"
    skill: "Equivalent expressions"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Which expression is equivalent to $(45a^3 b^2 - 12a^2 b^4) - 18a^2 b^4$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Rewrite the multivariable polynomial in an equivalent factored form. First **combine like terms** that share the exact same variable powers ($a^2 b^4$), then factor out the common monomial **$5a^2 b^2$** shown outside the parentheses in the answer choices using the exponent rule $x^m \cdot x^n = x^{m+n}$.

      :::tabs

      == tab: Solving the question with Algebra
      Combine the like $a^2 b^4$ terms first, then factor out $5a^2 b^2$ from each remaining term.

      :::derivation
      == step: Combine Like Terms
      -- why: Group the two terms that have the identical variable part $a^2 b^4$ and add their coefficients.
      $$
      \begin{aligned}
      (45a^3 b^2 - 12a^2 b^4) - 18a^2 b^4 &= 45a^3 b^2 + (-12 - 18)a^2 b^4 \\[.3cm]
      &= 45a^3 b^2 - 30a^2 b^4
      \end{aligned}
      $$

      == step: Factor Out the Common Monomial Factor
      -- why: Notice that every answer choice factors out $5$ times powers of $a$ and $b$. Since the lowest power of $a$ is $a^2$ and the lowest power of $b$ is $b^2$, factor out $5{\color{#2563eb}{a^2}} {\color{#d97706}{b^2}}$ by subtracting exponents from each term.
      $$
      \begin{aligned}
      45a^3 b^2 - 30a^2 b^4 &= 5{\color{#2563eb}{a^2}}{\color{#d97706}{b^2}}\left(\dfrac{45a^3 b^2}{5{\color{#2563eb}{a^2}}{\color{#d97706}{b^2}}} - \dfrac{30a^2 b^4}{5{\color{#2563eb}{a^2}}{\color{#d97706}{b^2}}}\right) \\[.5cm]
      &= 5{\color{#2563eb}{a^2}}{\color{#d97706}{b^2}}(9a^{3-2}b^{2-2} - 6a^{2-2}b^{4-2}) \\[.3cm]
      &= 5{\color{#2563eb}{a^2}}{\color{#d97706}{b^2}}(9a - 6b^2)
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Track the **exponents** on the first term ($45a^3 b^2$) across the answer choices! Multiplying the outside factor by the first term inside the parentheses must give **$a^3 b^2$**:
      * **(A)** $ab^2 \cdot a^2 = a^3 b^2$ (keep), check second term: $ab^2 \cdot b = ab^3 \ne a^2 b^4$ (eliminate).
      * **(B)** $ab \cdot a^2 b = a^3 b^2$ (keep), check second term: $ab \cdot ab^2 = a^2 b^3 \ne a^2 b^4$ (eliminate).
      * **(C)** $a^2 b \cdot ab = a^3 b^2$ (keep), check second term: $a^2 b \cdot b^2 = a^2 b^3 \ne a^2 b^4$ (eliminate).
      * **(D)** $a^2 b^2 \cdot a = a^3 b^2$ and $a^2 b^2 \cdot b^2 = a^2 b^4$ — both match!

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $5ab^2(9a^2 - 6b)$:** *Exponent Subtraction Trap.* Expands to $45a^3 b^2 - 30ab^3$, missing one factor of $a$ and one factor of $b$ in the second term.
      * **(B) $5ab(9a^2 b - 6ab^2)$:** *Second-Term Exponent Trap.* Expands to $45a^3 b^2 - 30a^2 b^3$, producing $b^3$ instead of $b^4$ in the second term.
      * **(C) $5a^2 b(9ab - 6b^2)$:** *Second-Term Exponent Trap.* Also expands to $45a^3 b^2 - 30a^2 b^3$, missing one factor of $b$ in the second term.
      * **(D) $5a^2 b^2(9a - 6b^2)$:** **Correct.** Combines $-12a^2 b^4 - 18a^2 b^4 = -30a^2 b^4$ and factors out $5a^2 b^2$ cleanly.
    options:
      - id: "A"
        text: "$5ab^2(9a^2 - 6b)$"
      - id: "B"
        text: "$5ab(9a^2 b - 6ab^2)$"
      - id: "C"
        text: "$5a^2 b(9ab - 6b^2)$"
      - id: "D"
        text: "$5a^2 b^2(9a - 6b^2)$"
  - id: "sat-t1-m2e-q17"
    questionNumber: 17
    questionType: "FR"
    correctAnswer: "45"
    domain: "Geometry and Trigonometry"
    skill: "Lines, angles, and triangles"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: true
    stimulus: |
      ![](./assets/dSAT-T1-M2E-Q17.svg)

      Note: Figure not drawn to scale.
    prompt: |
      In the figure shown, a straight metal brace supports a horizontal shelf against a vertical wall, meeting the wall at a $90^\circ$ angle. If $b = 3a$, what is the value of $a$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the value of **$a$** by relating the interior acute angle **$a^\circ$** and the obtuse exterior angle **$b^\circ$** of a right triangle. Express the adjacent interior angle inside the triangle as $(180 - b)^\circ$ using the straight-line linear pair along the shelf, set the sum of the triangle's interior angles equal to $180^\circ$, and substitute $b = 3a$.

      :::tabs

      == tab: Solving the question with Algebra
      Express the bottom-right interior angle in terms of $b$, apply the triangle angle sum of $180^\circ$, and substitute $b = 3a$ to solve for $a$.

      :::derivation
      == step: Express the Third Interior Angle in Terms of b
      -- why: Along the straight horizontal shelf, the obtuse exterior angle $b^\circ$ and the adjacent interior angle of the triangle form a linear pair whose measures sum to $180^\circ$.
      $$
      \text{Interior angle at shelf} = 180^\circ - {\color{#d97706}{b}}^\circ
      $$

      == step: Set Up the Triangle Angle-Sum Equation
      -- why: The three interior angles of the right triangle—$90^\circ$ at the corner, $a^\circ$ at the wall, and $(180 - b)^\circ$ at the shelf—must sum to $180^\circ$.
      $$
      \begin{aligned}
      90 + {\color{#2563eb}{a}} + (180 - {\color{#d97706}{b}}) &= 180 \\
      90 + {\color{#2563eb}{a}} - {\color{#d97706}{b}} &= 0 \\
      {\color{#d97706}{b}} &= 90 + {\color{#2563eb}{a}}
      \end{aligned}
      $$

      == step: Substitute b = 3a and Solve for a
      -- why: Replace $b$ with $3a$ from the given condition to obtain a one-variable linear equation in $a$.
      $$
      \begin{aligned}
      3{\color{#2563eb}{a}} &= 90 + {\color{#2563eb}{a}} \\
      2{\color{#2563eb}{a}} &= 90 \\
      {\color{#2563eb}{a}} &= \dfrac{90}{2} = 45
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Apply the **Exterior Angle Theorem** directly! The exterior angle of any triangle ($b^\circ$) equals the sum of the two non-adjacent interior angles ($90^\circ$ and $a^\circ$), so $b = 90 + a$ immediately. Substituting $b = 3a$ gives $3a = 90 + a \implies 2a = 90 \implies a = 45$ in seconds.

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      Because this is a **Student-Produced Response (SPR)** question, double-check that you avoided these common traps before entering **`45`**:
      * **Reporting the Obtuse Exterior Angle $b$ Instead of $a$ ($135$):** Computing $b = 3(45) = 135$ and entering $b$ instead of $a$.
      * **Treating $a^\circ$ and $b^\circ$ as Supplementary ($45$ by Accident / Wrong Setup):** Setting $a + b = 180 \implies 4a = 180 \implies a = 45$ happens to give the same number here, but forgets the $90^\circ$ right angle at the corner—always include all three interior angles of the triangle!
      * **Forgetting to Subtract $a$ from $3a$ ($30$):** Setting $3a = 90$ instead of $3a = 90 + a$, which yields $a = 30$.
  - id: "sat-t1-m2e-q18"
    questionNumber: 18
    questionType: "MC"
    correctAnswer: "B"
    domain: "Geometry and Trigonometry"
    skill: "Area and volume"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A landscape designer is installing two circular stone fire pits in a courtyard. Fire Pit $A$ has a circumference of $10\pi$ meters. Fire Pit $B$ has a radius that is $1$ meter greater than the radius of Fire Pit $A$. What is the combined total area of the bases of both fire pits, in $\text{m}^2$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Calculate the **sum of the circular base areas** of Fire Pit $A$ and Fire Pit $B$ in terms of $\pi$. Use the circumference formula **$C = 2\pi r$** to find the radius of Fire Pit $A$, add $1\text{ meter}$ to find the radius of Fire Pit $B$, and then apply the circle area formula **$A = \pi r^2$** to both fire pits.

      :::tabs

      == tab: Solving the question with Algebra
      Find the radius of each fire pit, compute each circular base area using $A = \pi r^2$, and add the two areas together.

      :::derivation
      == step: Find the Radius of Fire Pit A from Its Circumference
      -- why: Substitute $C = 10\pi$ into the circle circumference formula $C = 2\pi r$ and solve for $r_A$.
      $$
      \begin{aligned}
      2\pi {\color{#2563eb}{r_A}} &= 10\pi \\
      {\color{#2563eb}{r_A}} &= \dfrac{10\pi}{2\pi} = 5\text{ meters}
      \end{aligned}
      $$

      == step: Find the Radius of Fire Pit B
      -- why: Fire Pit $B$ has a radius $1\text{ meter}$ greater than Fire Pit $A$.
      $$
      {\color{#d97706}{r_B}} = {\color{#2563eb}{5}} + 1 = 6\text{ meters}
      $$

      == step: Calculate Both Base Areas and Add Them Together
      -- why: Apply $A = \pi r^2$ to each radius and combine like $\pi$-terms.
      $$
      \begin{aligned}
      \text{Area}_A &= \pi({\color{#2563eb}{5}})^2 = 25\pi\text{ m}^2 \\
      \text{Area}_B &= \pi({\color{#d97706}{6}})^2 = 36\pi\text{ m}^2 \\
      \text{Total Area} &= 25\pi + 36\pi = 61\pi\text{ m}^2
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Recognize the **$5$-$6$ consecutive integer square pair** immediately! Once you divide $10\pi$ by $2\pi$ to see $r_A = 5$, you know the two radii are $5$ and $6$, so the coefficient in front of $\pi$ must be $5^2 + 6^2 = 25 + 36 = 61 \implies 61\pi$.

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $46\pi$:** *Circumference-as-Area Trap.* Uses the circumference $10\pi$ directly as the area of Fire Pit $A$ instead of finding $r_A = 5$ and squaring it ($10\pi + 36\pi = 46\pi$).
      * **(B) $61\pi$:** **Correct.** Finds $r_A = 5\text{ m}$ and $r_B = 6\text{ m}$, giving $\pi(5)^2 + \pi(6)^2 = 25\pi + 36\pi = 61\pi\text{ m}^2$.
      * **(C) $136\pi$:** *Diameter-Instead-of-Radius Trap.* Solves $2\pi r_A = 10\pi$ as $r_A = 10$ (the diameter), squaring $10$ for Fire Pit $A$ ($100\pi$) and adding $36\pi$ to get $136\pi$.
      * **(D) $421\pi$:** *Double-Diameter Trap.* Uses $r_A = 10$ ($100\pi$) and doubles $r_B$ or misapplies the radius increase ($20^2 + 21 = 421$), yielding $421\pi$.
    options:
      - id: "A"
        text: "$46\\pi$"
      - id: "B"
        text: "$61\\pi$"
      - id: "C"
        text: "$136\\pi$"
      - id: "D"
        text: "$421\\pi$"
  - id: "sat-t1-m2e-q19"
    questionNumber: 19
    questionType: "MC"
    correctAnswer: "B"
    domain: "Advanced Math"
    skill: "Nonlinear equations in one variable and systems of equations in two variables"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The graphs of the equations in the given system intersect at a single point $(x, y)$ in the $xy$-plane.

      $$
      \begin{aligned}
      2&x - 3 = 11 \\
      y &= 3x^2 - 15
      \end{aligned}
      $$

      What is the point of intersection $(x, y)$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find the ordered pair **$(x, y)$** where the vertical line $2x - 3 = 11$ and the parabola $y = 3x^2 - 15$ intersect in the $xy$-plane. Solve the linear first equation for the **$x$-coordinate**, then substitute that value into the quadratic second equation to calculate the corresponding **$y$-coordinate**.

      :::tabs

      == tab: Solving the question with Algebra
      Isolate $x$ from the first equation, then plug that $x$-value into the second equation to evaluate $y$.

      :::derivation
      == step: Solve the First Equation for x
      -- why: Add $3$ to both sides of $2x - 3 = 11$ and divide by $2$ to find the $x$-coordinate of the intersection.
      $$
      \begin{aligned}
      2{\color{#2563eb}{x}} - 3 &= 11 \\
      2{\color{#2563eb}{x}} &= 14 \\
      {\color{#2563eb}{x}} &= \dfrac{14}{2} = 7
      \end{aligned}
      $$

      == step: Substitute x = 7 into the Quadratic Equation for y
      -- why: Replace $x$ with $7$ in $y = 3x^2 - 15$, applying the exponent before multiplying by $3$.
      $$
      \begin{aligned}
      {\color{#d97706}{y}} &= 3({\color{#2563eb}{7}})^2 - 15 \\
      {\color{#d97706}{y}} &= 3(49) - 15 \\
      {\color{#d97706}{y}} &= 147 - 15 = 132
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Use the **answer choices as a two-stage filter**! Solving $2x - 3 = 11$ gives $x = 7$, which immediately eliminates **(C)** and **(D)**. Between **(A)** $(7, 147)$ and **(B)** $(7, 132)$, notice that $3(7^2) = 3(49) = 147$ is the value *before* subtracting $15$—so **(B)** $(7, 132)$ must be the final result.

      == tab: Applying DESMOS
      Because both equations are written in $x$ and $y$ with **explicitly defined numerical constants** (no unknown parameters like $a$ or $k$), you can solve this linear-quadratic system directly in Desmos by graphing both equations and clicking their intersection. *(Note: Because $y = 132$ is well above the standard default window, you will need to zoom out vertically or adjust the $y$-axis range to see the intersection.)*

      1. Enter `2x - 3 = 11` in line 1 and `y = 3x^2 - 15` in line 2.
      2. Zoom out (or set the $y$-axis maximum above $150$) and click the intersection point at $(7, 132)$, confirming choice **B**.

      :::desmos
      {
        "bounds": { "left": -4, "right": 14, "bottom": -30, "top": 170 },
        "expressions": [
          { "id": "line", "latex": "2x - 3 = 11", "color": "#2563eb" },
          { "id": "parab", "latex": "y = 3x^2 - 15", "color": "#16a34a" },
          { "id": "pt", "latex": "(7, 132)", "color": "#dc2626", "label": "(7, 132)", "showLabel": true }
        ],
        "caption": "The vertical line 2x - 3 = 11 and the parabola y = 3x^2 - 15 intersect at (7, 132)."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $(7, 147)$:** *Stopping-Early Trap.* Finds $x = 7$ and computes $3(7)^2 = 147$, but forgets to subtract $15$ in the second equation.
      * **(B) $(7, 132)$:** **Correct.** Solves $2x - 3 = 11$ to get $x = 7$, then evaluates $y = 3(7)^2 - 15 = 132$.
      * **(C) $(11, 348)$:** *Wrong-$x$ Substitution Trap.* Uses the right-hand constant $11$ as $x$ instead of solving $2x - 3 = 11$, computing $3(11)^2 - 15 = 348$.
      * **(D) $(14, 573)$:** *Forgetting-to-Divide-by-2 Trap.* Adds $3$ to get $2x = 14$, forgets to divide by $2$, and evaluates $3(14)^2 - 15 = 573$.
    options:
      - id: "A"
        text: "$(7, 147)$"
      - id: "B"
        text: "$(7, 132)$"
      - id: "C"
        text: "$(11, 348)$"
      - id: "D"
        text: "$(14, 573)$"
  - id: "sat-t1-m2e-q20"
    questionNumber: 20
    questionType: "MC"
    correctAnswer: "D"
    domain: "Advanced Math"
    skill: "Nonlinear functions"
    difficulty: "Medium"
    containsGraph: false
    containsChart: true
    containsDiagram: false
    stimulus: |
      The table below shows selected values for the polynomial function $h(x)$.

      | $x$ | $h(x)$ |
      | :---: | :---: |
      | $-2$ | $15$ |
      | $0$ | $-6$ |
      | $3$ | $0$ |
      | $7$ | $28$ |
    prompt: |
      Which of the following expressions must be a factor of $h(x)$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Identify a linear expression that **must be a factor** of the polynomial $h(x)$ using the given table of $(x, h(x))$ values. By the **Factor Theorem**, a linear binomial $(x - c)$ is guaranteed to be a factor of $h(x)$ whenever **$h(c) = 0$** (meaning $x = c$ is a zero, or $x$-intercept, of the polynomial).

      :::tabs

      == tab: Solving the question with Algebra
      Locate the row in the table where the output $h(x)$ equals $0$, identify the corresponding $x$-value (zero), and convert that zero into its linear factor $(x - c)$.

      :::derivation
      == step: Find the Zero of the Function from the Table
      -- why: Scan the $h(x)$ column for an output value of $0$, which identifies an $x$-intercept $(c, 0)$.
      Looking at the third row of the table, when $x = {\color{#2563eb}{3}}$, the function output is $h({\color{#2563eb}{3}}) = {\color{#d97706}{0}}$. Therefore, $x = {\color{#2563eb}{3}}$ is a zero of $h(x)$.

      == step: Apply the Factor Theorem
      -- why: If $x = c$ is a zero of a polynomial $h(x)$, then $(x - c)$ must be a factor of $h(x)$.
      Substituting $c = {\color{#2563eb}{3}}$ into $(x - c)$ gives the required factor:
      $$
      (x - {\color{#2563eb}{3}})
      $$
      :::

      **Shortcut Insight:** Remember the **"Opposite Sign" Rule** linking roots/zeros to factors! Whenever a table shows $(c, 0)$, set $x = c$ and move $c$ to the left side: $x = 3 \implies x - 3 = 0$, so **$(x - 3)$** is the factor. (Do not get distracted by $(0, -6)$—that is the $y$-intercept, not a zero where $h(x) = 0$!)

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $x + 6$:** *y-Intercept + Sign Trap.* Uses the $y$-intercept output $-6$ from $(0, -6)$ instead of a zero where $h(x) = 0$, and writes $x - (-6) = x + 6$.
      * **(B) $x - 6$:** *y-Intercept Trap.* Confuses the $y$-intercept $(0, -6)$ with an $x$-intercept and attaches $-6$ directly to $x$.
      * **(C) $x + 3$:** *Sign-Flip Trap.* Correctly identifies $x = 3$ as the zero from $(3, 0)$, but writes $(x + 3)$ instead of $(x - 3)$.
      * **(D) $x - 3$:** **Correct.** Identifies $h(3) = 0$ from the table and applies the Factor Theorem to get $(x - 3)$.
    options:
      - id: "A"
        text: "$x + 6$"
      - id: "B"
        text: "$x - 6$"
      - id: "C"
        text: "$x + 3$"
      - id: "D"
        text: "$x - 3$"
  - id: "sat-t1-m2e-q21"
    questionNumber: 21
    questionType: "MC"
    correctAnswer: "D"
    domain: "Algebra"
    skill: "Systems of two linear equations in two variables"
    difficulty: "Medium"
    containsGraph: true
    containsChart: false
    containsDiagram: false
    stimulus: |
      A specialty boutique prepares corporate gift baskets containing bags of artisan coffee, $x$, and tins of loose-leaf tea, $y$. Each bag of coffee costs &dollar;$12$, and each tin of tea costs &dollar;$8$. For a large order, the boutique must include a combined total of $40$ items with a total budget of &dollar;$360$.
    prompt: |
      Which graph in the $xy$-plane represents the system of equations modeling all possible combinations of $x$ and $y$ for this order?
    explanation: |
      ### Takeoff: What were you asked to find?
      Translate the word problem into a **system of two standard-form linear equations** in $x$ and $y$, then identify which first-quadrant graph matches both lines. Find the **$x$-intercept** (setting $y = 0$) and **$y$-intercept** (setting $x = 0$) of each equation and compare those intercepts against the four graphs.

      :::tabs

      == tab: Solving the question with Algebra
      Write the total-items equation and total-budget equation, find the axis intercepts of each line, and match them to the correct graph.

      :::derivation
      == step: Translate the Conditions into a System of Equations
      -- why: Express the total item count ($40$) and total cost ($360$) in terms of $x$ bags of coffee (at $\$12$ each) and $y$ tins of tea (at $\$8$ each).
      $$
      \begin{aligned}
      {\color{#2563eb}{x + y}} &= {\color{#2563eb}{40}} \\
      {\color{#d97706}{12x + 8y}} &= {\color{#d97706}{360}}
      \end{aligned}
      $$

      == step: Find the Intercepts of the Total-Items Line
      -- why: Substitute $y = 0$ to find the $x$-intercept and $x = 0$ to find the $y$-intercept of $x + y = 40$.
      * When $y = 0$: ${\color{#2563eb}{x = 40}} \implies x\text{-intercept at } (40, 0)$
      * When $x = 0$: ${\color{#2563eb}{y = 40}} \implies y\text{-intercept at } (0, 40)$

      == step: Find the Intercepts of the Total-Budget Line
      -- why: Substitute $y = 0$ and $x = 0$ into $12x + 8y = 360$ to find where the budget line crosses each axis.
      * When $y = 0$: $12x = 360 \implies {\color{#d97706}{x = 30}} \implies x\text{-intercept at } (30, 0)$
      * When $x = 0$: $8y = 360 \implies {\color{#d97706}{y = 45}} \implies y\text{-intercept at } (0, 45)$

      == step: Match the Intercepts and Intersection to the Graph
      -- why: Both lines slope downward from left to right and cross in the first quadrant where the budget line starts higher on the $y$-axis ($45 > 40$) and ends closer to the origin on the $x$-axis ($30 < 40$).
      Solving the system confirms the two lines intersect at $(10, 30)$ (since $10 + 30 = 40$ and $12(10) + 8(30) = 120 + 240 = 360$), matching **Graph D**.
      :::

      **Shortcut Insight:** Use **"All-Coffee vs. All-Tea" extreme scenarios** instead of formal algebra!
      * If the order has **only coffee** ($y = 0$), you need $40$ bags for the item count $(40, 0)$ and can afford $\dfrac{360}{12} = 30$ bags for the budget $(30, 0)$—so the two $x$-intercepts must be **$30$ and $40$**.
      * Looking at the horizontal $x$-axis across the four choices, **only Graph D** has $x$-intercepts at both $30$ and $40$!

      == tab: Applying DESMOS
      Once you translate the word problem into the two standard-form equations with **explicitly defined numerical constants**, you can plot both equations directly in Desmos and compare the resulting graph to the answer choices. *(Note: Because the intercepts reach $40$ and $45$, zoom out or set both axes from $0$ to $55$ in the Graph Settings wrench menu so the full first-quadrant segments match the scale of the answer choices.)*

      1. Enter `x + y = 40` in line 1 and `12x + 8y = 360` in line 2.
      2. Click the axis intercepts at $(0, 45)$, $(0, 40)$, $(30, 0)$, and $(40, 0)$—and the intersection at $(10, 30)$—to verify that the visual layout matches **Graph D**.

      :::desmos
      {
        "bounds": { "left": -5, "right": 55, "bottom": -5, "top": 55 },
        "expressions": [
          { "id": "items", "latex": "x + y = 40", "color": "#2563eb" },
          { "id": "budget", "latex": "12x + 8y = 360", "color": "#16a34a" },
          { "id": "pt", "latex": "(10, 30)", "color": "#dc2626", "label": "(10, 30)", "showLabel": true }
        ],
        "caption": "The lines x + y = 40 (intercepts (0, 40) and (40, 0)) and 12x + 8y = 360 (intercepts (0, 45) and (30, 0)) intersect at (10, 30), matching Graph D."
      }
      :::

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A):** *Positive-Slope Trap.* Plots two upward-sloping lines ($y = x + 10$ and $y = 1.5x - 15$) instead of downward-sloping constraint lines where increasing coffee ($x$) must decrease tea ($y$).
      * **(B):** *Ratio-Line Trap.* Plots $x + y = 40$ accurately, but replaces the budget line $12x + 8y = 360$ with a proportional line $y = 1.5x$ passing through the origin $(0, 0)$.
      * **(C):** *Swapped-Intercepts & Parallel-Lines Trap.* Places the budget line's intercepts at $(0, 40)$ and $(45, 0)$ instead of $(0, 45)$ and $(30, 0)$, and shifts the item line down to $(0, 30)$ and $(30, 0)$ so the two lines never intersect.
      * **(D):** **Correct.** Shows both downward-sloping lines with intercepts $(0, 40)$ and $(40, 0)$ for $x + y = 40$, intercepts $(0, 45)$ and $(30, 0)$ for $12x + 8y = 360$, and an intersection at $(10, 30)$.
    options:
      - id: "A"
        text: |
          ![](./assets/dSAT-T1-M2E-Q21-A.svg)
      - id: "B"
        text: |
          ![](./assets/dSAT-T1-M2E-Q21-B.svg)
      - id: "C"
        text: |
          ![](./assets/dSAT-T1-M2E-Q21-C.svg)
      - id: "D"
        text: |
          ![](./assets/dSAT-T1-M2E-Q21-D.svg)
  - id: "sat-t1-m2e-q22"
    questionNumber: 22
    questionType: "MC"
    correctAnswer: "A"
    domain: "Advanced Math"
    skill: "Equivalent expressions"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A manufacturing company models its projected quarterly revenue, in hundreds of dollars, by the expression $R = 3(3x - y) - 4x + 6y$, where $x$ and $y$ represent the number of standard and premium units sold, respectively. The company's quarterly operating expense is modeled by the expression $E = 2(4x - 5y + 7) + y$. Which expression represents the company's projected net operating margin, defined as $R - E$?
    explanation: |
      ### Takeoff: What were you asked to find?
      Find a simplified polynomial expression equivalent to **$R - E$** in terms of $x$ and $y$. First expand and simplify the expressions for revenue ($R$) and operating expense ($E$) separately, then subtract $E$ from $R$ by **distributing the negative sign to every single term** inside $E$ before combining like terms.

      :::tabs

      == tab: Solving the question with Algebra
      Simplify $R$ and $E$ individually, set up $R - E$ using parentheses around $E$, distribute the subtraction sign, and combine like terms.

      :::derivation
      == step: Simplify the Revenue and Operating Expense Expressions
      -- why: Distribute the constants $3$ and $2$ and combine like terms inside $R$ and $E$ before subtracting.
      $$
      \begin{aligned}
      {\color{#2563eb}{R}} &= 3(3x - y) - 4x + 6y = 9x - 3y - 4x + 6y = {\color{#2563eb}{5x + 3y}} \\
      {\color{#d97706}{E}} &= 2(4x - 5y + 7) + y = 8x - 10y + 14 + y = {\color{#d97706}{8x - 9y + 14}}
      \end{aligned}
      $$

      == step: Set Up R - E and Distribute the Negative Sign
      -- why: Wrap $E$ in parentheses so the minus sign flips the sign of all three terms ($8x$, $-9y$, and $+14$).
      $$
      \begin{aligned}
      {\color{#2563eb}{R}} - {\color{#d97706}{E}} &= ({\color{#2563eb}{5x + 3y}}) - ({\color{#d97706}{8x - 9y + 14}}) \\
      &= {\color{#2563eb}{5x + 3y}} - 8x + 9y - 14
      \end{aligned}
      $$

      == step: Combine Like Terms
      -- why: Group the $x$-terms, $y$-terms, and constant term separately.
      $$
      \begin{aligned}
      {\color{#2563eb}{R}} - {\color{#d97706}{E}} &= (5x - 8x) + (3y + 9y) - 14 \\
      &= -3x + 12y - 14
      \end{aligned}
      $$
      :::

      **Shortcut Insight:** Plug in **$x = 0$ and $y = 0$** first to check the constant term in two seconds! When $x = 0$ and $y = 0$, $R = 3(0) - 0 + 0 = 0$ and $E = 2(7) + 0 = 14$, so $R - E = 0 - 14 = \mathbf{-14}$. That immediately eliminates **(B)** and **(D)**. Next, test **$x = 0$ and $y = 1$**: $R = 3(-1) + 6 = 3$ and $E = 2(-5 + 7) + 1 = 5$, giving $R - E = 3 - 5 = -2$. Plugging $(0, 1)$ into **(A)** gives $12(1) - 14 = -2$ (whereas **(C)** gives $-6(1) - 14 = -20$), confirming **(A)**!

      :::

      ---

      ### Landing: Did you give the right answer to wrong question?
      * **(A) $-3x + 12y - 14$:** **Correct.** Simplifies $R = 5x + 3y$ and $E = 8x - 9y + 14$, distributes the negative sign across all terms of $E$, and combines like terms accurately.
      * **(B) $-3x + 12y + 14$:** *Partial-Distribution Trap.* Flips the signs of $8x$ and $-9y$, but forgets to distribute the negative sign to $+14$ (leaving $+14$ instead of $-14$).
      * **(C) $-3x - 6y - 14$:** *Missed Double-Negative Trap.* Subtracts $9y$ instead of $-9y$ ($3y - 9y = -6y$ instead of $3y - (-9y) = +12y$).
      * **(D) $3x - 12y + 14$:** *Reversed-Subtraction Trap.* Computes $E - R$ instead of $R - E$, flipping every sign in the final expression.
    options:
      - id: "A"
        text: "$-3x + 12y - 14$"
      - id: "B"
        text: "$-3x + 12y + 14$"
      - id: "C"
        text: "$-3x - 6y - 14$"
      - id: "D"
        text: "$3x - 12y + 14$"
---