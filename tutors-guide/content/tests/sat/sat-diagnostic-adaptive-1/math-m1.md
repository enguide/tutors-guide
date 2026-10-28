---
sectionId: "sat-t1-m1"
sectionTitle: "Math - Module 1"
sectionOrder: 3
timeLimit: 2100
questions:
  - id: "sat-t1-m1-q1"
    questionNumber: 1
    questionType: "MC"
    correctAnswer: "B"
    domain: "Heart of Algebra"
    skill: "Linear Equations"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A moving company charges a flat service fee of $\$150$ for any move, plus an additional rate of $\\$45$ per hour of labor. Which equation represents this situation, where $C$ is the total cost of the move in dollars and $h$ is the number of hours of labor required?
    explanation: |
      The total cost $C$ is the sum of the flat service fee ($\$150$) and the variable hourly rate ($\$45$ multiplied by the number of hours $h$). This gives the linear equation $C = 45h + 150$.
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
      Let the length and width of Rectangle $A$ be $l$ and $w$, respectively, so that $lw = 48$. Rectangle $B$ has dimensions $2l$ and $\dfrac{1}{2}w$. Its area is:
      $$(2l)\left(\dfrac{1}{2}w\right) = lw = 48\text{ square inches}$$
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
    domain: "Heart of Algebra"
    skill: "Rearranging Equations"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The equation $A = \dfrac{1}{2}h(b_1 + b_2)$ gives the area $A$ of a trapezoid in terms of the height $h$ and the bases $b_1$ and $b_2$. Which of the following correctly expresses the value of $h$ in terms of $A$, $b_1$, and $b_2$?
    explanation: |
      To solve for $h$, first multiply both sides of the equation by $2$ to eliminate the fraction:
      $$2A = h(b_1 + b_2)$$

      Then divide both sides by $(b_1 + b_2)$ to isolate $h$:
      $$h = \dfrac{2A}{b_1 + b_2}$$
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
    correctAnswer: "D"
    domain: "Heart of Algebra"
    skill: "Linear Inequalities"
    difficulty: "Easy"
    containsGraph: true
    containsChart: false
    containsDiagram: false
    stimulus: |
      ![Linear Inequality Graph](./assets/linear-inequality-graph.svg)

      The given graph shows the solution to a linear inequality.
    prompt: |
      Which of the following could represent that inequality?
    explanation: |
      The boundary line has a $y$-intercept of $4$ and an $x$-intercept of $6$, giving a slope of $m = -\dfrac{2}{3}$. Because the boundary line is dashed and the region containing the origin $(0, 0)$ is shaded, the inequality is strict:
      $$y < -\dfrac{2}{3}x + 4$$
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
    correctAnswer: 120
    domain: "Passport to Advanced Math"
    skill: "Ratios and Proportions"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A bag contains only red and blue marbles. The number of red marbles, $R$, to the number of blue marbles, $B$, in the bag is $11$ to $4$. If there are $88$ red marbles, what is the total number of marbles in the bag?
    explanation: |
      The ratio of red marbles to blue marbles is $11:4$. Since there are $88$ red marbles, divide $88$ by $11$ to find the scaling factor:
      $$\dfrac{88}{11} = 8$$

      The number of blue marbles is $4 \times 8 = 32$. The total number of marbles is the sum of red and blue marbles:
      $$88 + 32 = 120$$

  - id: "sat-t1-m1-q6"
    questionNumber: 6
    questionType: "MC"
    correctAnswer: "A"
    domain: "Problem Solving and Data Analysis"
    skill: "Percentages"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A researcher found that the number of active users on a platform increased by $20\%$ from Year $1$ to Year $2$, and then decreased by $15\%$ from Year $2$ to Year $3$. If the number of users in Year $3$ was $k$ times the number of users in Year $1$, what is the value of $k$?
    explanation: |
      An increase of $20\%$ corresponds to a multiplier of $1.20$, and a decrease of $15\%$ corresponds to a multiplier of $0.85$. Multiplying these consecutive growth factors yields:
      $$k = 1.20 \times 0.85 = 1.02$$
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
    domain: "Advanced Math"
    skill: "Unit Conversions"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      An astronomer measures the distance to a nearby star to be $8$ parsecs. Which of the following is closest to the distance to the star in light-years? ($1\text{ parsec} \approx 3.26\text{ light-years}$)
    explanation: |
      To convert parsecs to light-years, multiply the distance in parsecs by the conversion factor:
      $$8 \times 3.26 = 26.08\text{ light-years}$$
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
    correctAnswer: "A"
    domain: "Heart of Algebra"
    skill: "Linear Equations"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The equation $0.75A + 0.40B = 120$ models the total revenue, in dollars, generated by a school cafeteria from the sale of $A$ apples and $B$ bananas on a given morning. Based on the model, how many more cents does one apple cost than one banana?
    explanation: |
      In the model, the coefficients $0.75$ and $0.40$ represent the price of one apple ($\$0.75$) and one banana ($\$0.40$) in dollars. The difference in price is:
      $$\$0.75 - \$0.40 = \$0.35$$

      Converting this to cents by multiplying by $100$ gives $35$ cents.
    options:
      - id: "A"
        text: "$35$"
      - id: "B"
        text: "$75$"
      - id: "C"
        text: "$115$"
      - id: "D"
        text: "$120$"

  - id: "sat-t1-m1-q9"
    questionNumber: 9
    questionType: "FR"
    correctAnswer: "0"
    domain: "Heart of Algebra"
    skill: "Functions"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      If $f(k) = (5k - 2)(k + 3)$, what is the value of $f(0.4)$?
    explanation: |
      Substitute $k = 0.4$ into the function:
      $$f(0.4) = (5(0.4) - 2)(0.4 + 3) = (2 - 2)(3.4) = (0)(3.4) = 0$$

  - id: "sat-t1-m1-q10"
    questionNumber: 10
    questionType: "MC"
    correctAnswer: "A"
    domain: "Passport to Advanced Math"
    skill: "Equivalent Expressions"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Which expression is equivalent to $\dfrac{3}{c} + \dfrac{c}{6}$, where $c \neq 0$?
    explanation: |
      To add the rational expressions, find a common denominator of $6c$:
      $$\dfrac{3(6)}{6c} + \dfrac{c(c)}{6c} = \dfrac{18 + c^2}{6c}$$
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
    domain: "Heart of Algebra"
    skill: "Linear Equations"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The line $L$ passes through the points $(4, 5)$ and $(15, 12)$. If the point $(x, 10)$ lies on line $L$, what is the value of $x$?
    explanation: |
      First, calculate the slope of line $L$:
      $$m = \dfrac{12 - 5}{15 - 4} = \dfrac{7}{11}$$

      Use the slope formula with $(4, 5)$ and $(x, 10)$:
      $$\dfrac{10 - 5}{x - 4} = \dfrac{7}{11}$$
      $$\dfrac{5}{x - 4} = \dfrac{7}{11} \implies 7(x - 4) = 55 \implies 7x - 28 = 55 \implies 7x = 83 \implies x = \dfrac{83}{7}$$
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
    domain: "Heart of Algebra"
    skill: "Systems of Equations"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      $$\begin{aligned}
      4a + 2b &= 18 \\\\
      3b &= 2 + 4a
      \end{aligned}$$

      The system of equations above has a solution $(a, b)$. What is the value of $10b$?
    explanation: |
      Rearrange the second equation to isolate $4a$:
      $$4a = 3b - 2$$

      Substitute $(3b - 2)$ for $4a$ in the first equation:
      $$(3b - 2) + 2b = 18$$
      $$5b - 2 = 18 \implies 5b = 20 \implies b = 4$$

      Multiply by $10$ to find the requested value:
      $$10b = 10(4) = 40$$
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
    domain: "Heart of Algebra"
    skill: "Linear Equations"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The equation $L = 0.6x + 5.2$ models the length $L$, in feet, of a spring when a mass of $x$ kilograms is attached to it. What mass, in kilograms, must be attached to the spring for its length to be $10$ feet?
    explanation: |
      Substitute $L = 10$ into the equation and solve for $x$:
      $$10 = 0.6x + 5.2$$
      $$4.8 = 0.6x \implies x = \dfrac{4.8}{0.6} = 8$$

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
      $$P(m) = 101(2.718)^{-0.125m}$$

      The atmospheric pressure, $P$, in kilopascals, at an altitude of $m$ kilometers above sea level is modeled by the function above. According to the model, what is the atmospheric pressure, in kilopascals, at sea level?
    explanation: |
      At sea level, the altitude is $m = 0$. Evaluating the function at $m = 0$:
      $$P(0) = 101(2.718)^0 = 101(1) = 101\text{ kilopascals}$$
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
    domain: "Passport to Advanced Math"
    skill: "Radical Equations"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      If $\sqrt{2x + 15} = x + 6$, what is the set of all real solutions to the equation?
    explanation: |
      Square both sides of the equation:
      $$2x + 15 = (x + 6)^2$$
      $$2x + 15 = x^2 + 12x + 36$$
      $$x^2 + 10x + 21 = 0 \implies (x + 3)(x + 7) = 0$$

      This produces candidate values $x = -3$ and $x = -7$. Check for extraneous solutions in the original equation:
      - For $x = -3$: $\sqrt{2(-3) + 15} = \sqrt{9} = 3$ and $-3 + 6 = 3$ (valid).
      - For $x = -7$: $\sqrt{2(-7) + 15} = \sqrt{1} = 1$, but $-7 + 6 = -1 \neq 1$ (extraneous).

      Thus, the only valid solution is $\{-3\}$.
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
    domain: "Passport to Advanced Math"
    skill: "Quadratic Equations"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A system of equations consists of $y = 2x^2 - 12x + 20$ and $y = mx - 12$. If the system has exactly one real solution $(x, y)$, and $m > 0$, what is the value of $m$?
    explanation: |
      Set the equations equal to each other:
      $$2x^2 - 12x + 20 = mx - 12$$
      $$2x^2 - (12 + m)x + 32 = 0$$

      For the system to have exactly one real solution, the discriminant must equal zero:
      $$\Delta = [-(12 + m)]^2 - 4(2)(32) = 0$$
      $$(12 + m)^2 - 256 = 0 \implies (12 + m)^2 = 256$$

      Taking square roots yields $12 + m = 16$ or $12 + m = -16$. Since $m > 0$:
      $$m = 16 - 12 = 4$$

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
      ![Ice Block Melting Scatterplot](./assets/ice-block-scatterplot.svg)

      A scientist is studying the melting rate of four identical ice blocks in a room held at a constant temperature. Each data point on the scatterplot represents the weight of one specific block of ice, $y$ (in ounces), measured after it had been melting for a specific number of hours, $x$. A line of best fit for the data is given by $y = -1.2x + 14.5$.
    prompt: |
      Which of the following is the best interpretation of the $x$-intercept of this line?
    explanation: |
      The $x$-intercept occurs where $y = 0$, representing the point where the weight of the ice block reaches $0$ ounces:
      $$0 = -1.2x + 14.5 \implies x = \dfrac{14.5}{1.2} \approx 12.1\text{ hours}$$

      Therefore, the $x$-intercept represents the predicted amount of time it takes for an ice block to melt completely.
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
    domain: "Heart of Algebra"
    skill: "Systems of Equations"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Which of the following systems of equations has no solution?
    explanation: |
      A system of linear equations has no solution if the lines are parallel (they share the same slope but have distinct $y$-intercepts).

      In choice **D**, the equations are:
      $$2x + y = 4$$
      $$6x + 3y = 10$$

      Multiplying the first equation by $3$ yields $6x + 3y = 12$. Comparing this to $6x + 3y = 10$ produces the contradiction $12 = 10$. Thus, this system has no solution.
    options:
      - id: "A"
        text: "$x + y = 5 \\quad \\text{and} \\quad x - y = 5$"
      - id: "B"
        text: "$2x - 3y = 6 \\quad \\text{and} \\quad 4x - 6y = 12$"
      - id: "C"
        text: "$5x + 10y = 15 \\quad \\text{and} \\quad x + 2y = 3$"
      - id: "D"
        text: "$2x + y = 4 \\quad \\text{and} \\quad 6x + 3y = 10$"

  - id: "sat-t1-m1-q19"
    questionNumber: 19
    questionType: "MC"
    correctAnswer: "A"
    domain: "Geometry and Trigonometry"
    skill: "Perimeter"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A scalene triangle has sides of length $a$, $2a$, and $3a$. A square has a side length $s$. If the total perimeter of the triangle is $P$ and the total perimeter of the square is $S$, then, in terms of their perimeters, what is $s + a$?
    explanation: |
      The perimeter of the triangle is:
      $$P = a + 2a + 3a = 6a \implies a = \dfrac{P}{6}$$

      The perimeter of the square is:
      $$S = 4s \implies s = \dfrac{S}{4}$$

      Summing $s$ and $a$:
      $$s + a = \dfrac{S}{4} + \dfrac{P}{6} = \dfrac{3S + 2P}{12}$$
    options:
      - id: "A"
        text: "$\\dfrac{3S + 2P}{12}$"
      - id: "B"
        text: "$\\dfrac{S + P}{10}$"
      - id: "C"
        text: "$\\dfrac{3S + 2P}{24}$"
      - id: "D"
        text: "$\\dfrac{2S + 3P}{12}$"

  - id: "sat-t1-m1-q20"
    questionNumber: 20
    questionType: "MC"
    correctAnswer: "C"
    domain: "Problem Solving and Data Analysis"
    skill: "Rates"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A printer initially produces pages at a rate of $120$ pages every $3$ minutes. After printing the first $2{,}400$ pages, the printer's rate decreases by $25\%$ due to a power-save mode. To the nearest tenth of an hour, how many total hours will it take for the printer to complete a $7{,}200$-page document?
    explanation: |
      1. Calculate initial rate:
         $$r_1 = \dfrac{120\text{ pages}}{3\text{ minutes}} = 40\text{ pages/min} = 2{,}400\text{ pages/hour}$$

      2. Time for the first $2{,}400$ pages:
         $$t_1 = \dfrac{2{,}400}{2{,}400} = 1.0\text{ hour}$$

      3. Calculate reduced rate after $25\%$ reduction:
         $$r_2 = 2{,}400 \times (1 - 0.25) = 1{,}800\text{ pages/hour}$$

      4. Remaining pages: $7{,}200 - 2{,}400 = 4{,}800$ pages.
         $$t_2 = \dfrac{4{,}800}{1{,}800} = \dfrac{8}{3} \approx 2.67\text{ hours}$$

      5. Total time:
         $$\text{Total} = 1.0 + 2.67 \approx 3.7\text{ hours}$$
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
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A circle in the $xy$-plane has the equation $x^2 + y^2 - 6hx + 2ky = 0$, where $h$ and $k$ are constants. Which of the following correctly gives its radius in terms of $h$ and $k$?
    explanation: |
      Complete the square for both the $x$ and $y$ terms:
      $$(x^2 - 6hx + 9h^2) + (y^2 + 2ky + k^2) = 9h^2 + k^2$$
      $$(x - 3h)^2 + (y + k)^2 = 9h^2 + k^2$$

      The standard form of a circle is $(x - x_0)^2 + (y - y_0)^2 = r^2$. Taking the square root gives:
      $$r = \sqrt{9h^2 + k^2}$$
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
    domain: "Passport to Advanced Math"
    skill: "Quadratic Equations"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The equation $2x^2 - 8x - 7 = 0$ has two solutions. One of the solutions can be written as $k - \sqrt{\dfrac{15}{k}}$, where $k$ is a constant. What is the value of $k$?
    explanation: |
      Divide the equation by $2$ and complete the square:
      $$x^2 - 4x - \dfrac{7}{2} = 0$$
      $$(x - 2)^2 - 4 - \dfrac{7}{2} = 0$$
      $$(x - 2)^2 = \dfrac{15}{2}$$
      $$x = 2 \pm \sqrt{\dfrac{15}{2}}$$

      Matching the form $k - \sqrt{\dfrac{15}{k}}$ with $2 - \sqrt{\dfrac{15}{2}}$, we find $k = 2$.
---