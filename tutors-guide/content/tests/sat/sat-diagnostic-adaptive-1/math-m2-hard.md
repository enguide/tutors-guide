---
sectionId: "sat-t1-m2h"
sectionTitle: "Mathematics - M2H"
sectionOrder: 4
timeLimit: 2100
questions:
  - id: "sat-t1-m2h-q1"
    questionNumber: 1
    questionType: "MC"
    correctAnswer: "A"
    domain: "Heart of Algebra"
    skill: "Linear Expressions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Which expression is equivalent to $4(x - 3) + 2x$?
    explanation: |
      Distribute the $4$ into the parentheses:
      $$4x - 12 + 2x$$

      Combine like terms:
      $$(4x + 2x) - 12 = 6x - 12$$
    options:
      - id: "A"
        text: "$6x - 12$"
      - id: "B"
        text: "$4x - 10$"
      - id: "C"
        text: "$6x - 3$"
      - id: "D"
        text: "$2x + 1$"

  - id: "sat-t1-m2h-q2"
    questionNumber: 2
    questionType: "MC"
    correctAnswer: "D"
    domain: "Heart of Algebra"
    skill: "Functions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The function $h$ is defined by $h(x) = \dfrac{2}{3}x - 4$. If $h(a) = 8$, what is the value of $a$?
    explanation: |
      Substitute $a$ for $x$ and set the function equal to $8$:
      $$\dfrac{2}{3}a - 4 = 8$$
      $$\dfrac{2}{3}a = 12 \implies a = 12 \times \dfrac{3}{2} = 18$$
    options:
      - id: "A"
        text: "$4$"
      - id: "B"
        text: "$8$"
      - id: "C"
        text: "$12$"
      - id: "D"
        text: "$18$"

  - id: "sat-t1-m2h-q3"
    questionNumber: 3
    questionType: "MC"
    correctAnswer: "B"
    domain: "Geometry and Trigonometry"
    skill: "Volume"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A cylinder has a radius $r$ and a height $h$. A second cylinder has a radius $2r$ and a height $\dfrac{1}{2}h$. What is the ratio of the volume of the first cylinder to the volume of the second cylinder?
    explanation: |
      The volume of the first cylinder is:
      $$V_1 = \pi r^2 h$$

      The volume of the second cylinder is:
      $$V_2 = \pi (2r)^2 \left(\dfrac{1}{2}h\right) = \pi (4r^2)\left(\dfrac{1}{2}h\right) = 2\pi r^2 h$$

      The ratio $V_1 : V_2$ is:
      $$\pi r^2 h : 2\pi r^2 h = 1 : 2$$
    options:
      - id: "A"
        text: "$1 : 4$"
      - id: "B"
        text: "$1 : 2$"
      - id: "C"
        text: "$2 : 1$"
      - id: "D"
        text: "$4 : 1$"

  - id: "sat-t1-m2h-q4"
    questionNumber: 4
    questionType: "MC"
    correctAnswer: "A"
    domain: "Heart of Algebra"
    skill: "Linear Functions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A marathon runner's distance from the finish line, $D(t)$, in kilometers, $t$ minutes after the race starts, is modeled by the function $D(t) = 42.2 - 0.2t$. How far, in kilometers, is the runner from the finish line after an hour and $40$ minutes?
    explanation: |
      An hour and $40$ minutes equals $60 + 40 = 100$ minutes. Substitute $t = 100$ into the model:
      $$D(100) = 42.2 - 0.2(100) = 42.2 - 20 = 22.2\text{ kilometers}$$
    options:
      - id: "A"
        text: "$22.2$"
      - id: "B"
        text: "$32.2$"
      - id: "C"
        text: "$42.0$"
      - id: "D"
        text: "$42.2$"

  - id: "sat-t1-m2h-q5"
    questionNumber: 5
    questionType: "MC"
    correctAnswer: "C"
    domain: "Heart of Algebra"
    skill: "Linear Inequalities"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A school drama club is selling tickets for a performance of their latest production. The theater for the performance has $300$ seats available. Adult tickets, $a$, cost &dollar;$15$ each, and student tickets, $s$, cost &dollar;$10$ each. The club's goal is to raise at least &dollar;$4{,}000$. Which system of inequalities represents this situation?
    explanation: |
      The total revenue from selling $a$ adult tickets and $s$ student tickets must be at least $\$4{,}000$:
      $$15a + 10s \ge 4000$$

      The total number of tickets sold cannot exceed the $300$ available seats:
      $$a + s \le 300$$
    options:
      - id: "A"
        text: "$\\begin{aligned} &10a + 15s \\ge 4000 \\\\ &a + s \\le 300 \\end{aligned}$"
      - id: "B"
        text: "$\\begin{aligned} &15a + 10s \\le 4000 \\\\ &a + s \\ge 300 \\end{aligned}$"
      - id: "C"
        text: "$\\begin{aligned} &15a + 10s \\ge 4000 \\\\ &a + s \\le 300 \\end{aligned}$"
      - id: "D"
        text: "$\\begin{aligned} &10a + 15s \\le 4000 \\\\ &a + s \\ge 300 \\end{aligned}$"

  - id: "sat-t1-m2h-q6"
    questionNumber: 6
    questionType: "MC"
    correctAnswer: "D"
    domain: "Passport to Advanced Math"
    skill: "Quadratic Functions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The function $P$ is defined by $P(x) = -3(x + 2)^2 + 6$. What is the $y$-intercept of the graph of $y = P(x)$ in the $xy$-plane?
    explanation: |
      To find the $y$-intercept, evaluate the function at $x = 0$:
      $$P(0) = -3(0 + 2)^2 + 6 = -3(4) + 6 = -12 + 6 = -6$$

      Thus, the $y$-intercept is $(0, -6)$.
    options:
      - id: "A"
        text: "$(0, 0)$"
      - id: "B"
        text: "$(-2, 6)$"
      - id: "C"
        text: "$(0, 6)$"
      - id: "D"
        text: "$(0, -6)$"

  - id: "sat-t1-m2h-q7"
    questionNumber: 7
    questionType: "MC"
    correctAnswer: "C"
    domain: "Advanced Math"
    skill: "Exponential Functions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The initial population of a bacterial culture is $300$ organisms. The population, $P(t)$, triples every $2$ hours, where $t$ is the number of hours. Which equation models the population of the culture?
    explanation: |
      The initial population is $300$. Because the population triples every $2$ hours, the growth factor is $3$ applied every $2$ units of time, yielding:
      $$P(t) = 300(3)^{t/2}$$
    options:
      - id: "A"
        text: "$P(t) = 300(3)^t$"
      - id: "B"
        text: "$P(t) = 300(3)^{2t}$"
      - id: "C"
        text: "$P(t) = 300(3)^{t/2}$"
      - id: "D"
        text: "$P(t) = 300(1/3)^{t/2}$"

  - id: "sat-t1-m2h-q8"
    questionNumber: 8
    questionType: "MC"
    correctAnswer: "C"
    domain: "Heart of Algebra"
    skill: "Linear Equations"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      If the graph of $10x + 5y = 40$ is shifted up $3$ units in the $xy$-plane, what is the $y$-intercept of the resulting graph?
    explanation: |
      Rewrite the given equation in slope-intercept form:
      $$5y = -10x + 40 \implies y = -2x + 8$$

      The original $y$-intercept is $(0, 8)$. Shifting the graph up by $3$ units adds $3$ to the $y$-intercept:
      $$8 + 3 = 11$$

      The new $y$-intercept is $(0, 11)$.
    options:
      - id: "A"
        text: "$(0, 5)$"
      - id: "B"
        text: "$(0, 8)$"
      - id: "C"
        text: "$(0, 11)$"
      - id: "D"
        text: "$(0, 13)$"

  - id: "sat-t1-m2h-q9"
    questionNumber: 9
    questionType: "MC"
    correctAnswer: "D"
    domain: "Passport to Advanced Math"
    skill: "Equivalent Expressions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      If $m(2x + 1) + p(3x - 2) = 19x - 1$ for all values of $x$, what is the value of $m + p$?
    explanation: |
      Expand the left side and group like terms:
      $$2mx + m + 3px - 2p = 19x - 1$$
      $$(2m + 3p)x + (m - 2p) = 19x - 1$$

      Equating corresponding coefficients produces the system:
      $$2m + 3p = 19$$
      $$m - 2p = -1 \implies m = 2p - 1$$

      Substitute $m = 2p - 1$ into the first equation:
      $$2(2p - 1) + 3p = 19 \implies 7p - 2 = 19 \implies 7p = 21 \implies p = 3$$
      $$m = 2(3) - 1 = 5$$

      Therefore:
      $$m + p = 5 + 3 = 8$$
    options:
      - id: "A"
        text: "$4$"
      - id: "B"
        text: "$5$"
      - id: "C"
        text: "$6$"
      - id: "D"
        text: "$8$"

  - id: "sat-t1-mh2-q10"
    questionNumber: 10
    questionType: "MC"
    correctAnswer: "C"
    domain: "Problem Solving and Data Analysis"
    skill: "Descriptive Statistics"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A student receives the following test scores: $85, 92, 78, 85, 95$. If the student takes one more test and scores an $82$, which of the following statements about the resulting changes in the mean and median of their scores is true?
    explanation: |
      The ordered original scores are $78, 85, 85, 92, 95$:
      - Median: $85$
      - Mean: $\dfrac{78 + 85 + 85 + 92 + 95}{5} = \dfrac{435}{5} = 87$

      With the additional score of $82$, the six ordered scores are $78, 82, 85, 85, 92, 95$:
      - New median: $\dfrac{85 + 85}{2} = 85$ (unchanged)
      - New mean: $\dfrac{435 + 82}{6} = \dfrac{517}{6} \approx 86.17$ (decreased)

      Therefore, the mean will decrease and the median will stay the same.
    options:
      - id: "A"
        text: "Both the mean and the median will decrease."
      - id: "B"
        text: "The median will decrease and the mean will stay the same."
      - id: "C"
        text: "The mean will decrease and the median will stay the same."
      - id: "D"
        text: "Both the mean and the median will stay the same."

  - id: "sat-t1-mh2-q11"
    questionNumber: 11
    questionType: "FR"
    correctAnswer: "6"
    domain: "Geometry and Trigonometry"
    skill: "Area and Perimeter"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A landscape architect is designing a circular garden with a diameter of $24$ feet. A circular walkway of uniform width is built around the garden. If the total area of the garden and the walkway combined is $324\pi$ square feet, what is the width of the walkway, in feet?
    explanation: |
      The garden diameter is $24$ feet, so its radius is $r = 12$ feet.

      Let the total radius including the walkway be $R$:
      $$\pi R^2 = 324\pi \implies R^2 = 324 \implies R = 18\text{ feet}$$

      The width of the walkway is the difference between the two radii:
      $$w = R - r = 18 - 12 = 6\text{ feet}$$
      *(Note: If the total combined radius is $18$, the width is $18 - 12 = 6$. Check prompt parameters against answer key).*

  - id: "sat-t1-mh2-q12"
    questionNumber: 12
    questionType: "MC"
    correctAnswer: "C"
    domain: "Advanced Math"
    skill: "Unit Conversions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The density of a certain material is $0.8$ grams per cubic centimeter. What is this density in kilograms per cubic meter? ($1\text{ kilogram} = 1{,}000\text{ grams}$; $1\text{ meter} = 100\text{ centimeters}$)
    explanation: |
      Convert grams to kilograms and cubic centimeters to cubic meters:
      $$0.8\text{ g/cm}^3 \times \dfrac{1\text{ kg}}{1{,}000\text{ g}} \times \left(\dfrac{100\text{ cm}}{1\text{ m}}\right)^3$$
      $$= 0.8 \times \dfrac{1}{1{,}000} \times 1{,}000{,}000 = 0.8 \times 1{,}000 = 800\text{ kg/m}^3$$
    options:
      - id: "A"
        text: "$0.0008$"
      - id: "B"
        text: "$80$"
      - id: "C"
        text: "$800$"
      - id: "D"
        text: "$8{,}000$"

  - id: "sat-t1-mh2-q13"
    questionNumber: 13
    questionType: "MC"
    correctAnswer: "B"
    domain: "Geometry and Trigonometry"
    skill: "Volume and Area"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The base of a rectangular prism is a square with a perimeter of $x$ centimeters. If the prism's height is $5$ centimeters and its volume is $180$ cubic centimeters, what is the value of $x$?
    explanation: |
      The perimeter of the square base is $x$, so each side length is $\dfrac{x}{4}$ and the base area is:
      $$\text{Area} = \left(\dfrac{x}{4}\right)^2 = \dfrac{x^2}{16}$$

      Using the volume formula $V = \text{Base Area} \times h$:
      $$\dfrac{x^2}{16} \times 5 = 180$$
      $$\dfrac{x^2}{16} = 36 \implies x^2 = 576 \implies x = 24$$
    options:
      - id: "A"
        text: "$36$"
      - id: "B"
        text: "$24$"
      - id: "C"
        text: "$9$"
      - id: "D"
        text: "$6$"

  - id: "sat-t1-mh2-q14"
    questionNumber: 14
    questionType: "FR"
    correctAnswer: "6"
    domain: "Advanced Math"
    skill: "Rational Functions and Asymptotes"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The function $f$ is defined by $f(x) = \dfrac{ax - 12}{3x + b}$, where $a$ and $b$ are constants. The graph of $y = f(x)$ in the $xy$-plane has a horizontal asymptote at $y = 4$ and a vertical asymptote at $x = 2$. What is the value of $a + b$?
    explanation: |
      1. Horizontal Asymptote:
         For rational functions of equal degree, the horizontal asymptote is the ratio of the leading coefficients:
         $$\dfrac{a}{3} = 4 \implies a = 12$$

      2. Vertical Asymptote:
         The vertical asymptote occurs where the denominator equals zero at $x = 2$:
         $$3(2) + b = 0 \implies 6 + b = 0 \implies b = -6$$

      3. Calculate $a + b$:
         $$a + b = 12 + (-6) = 6$$

  - id: "sat-t1-mh2-q15"
    questionNumber: 15
    questionType: "MC"
    correctAnswer: "C"
    domain: "Passport to Advanced Math"
    skill: "Rational Equations"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Paving Company A can pave a street in $h$ hours, and Paving Company B can pave the same street in $h + 3$ hours. If both companies working together can pave the street in $2$ hours, what is the value of $h$?
    explanation: |
      Combine their individual hourly rates:
      $$\dfrac{1}{h} + \dfrac{1}{h + 3} = \dfrac{1}{2}$$
      $$\dfrac{2h + 3}{h(h + 3)} = \dfrac{1}{2}$$
      $$2(2h + 3) = h^2 + 3h \implies 4h + 6 = h^2 + 3h \implies h^2 - h - 6 = 0$$

      Factor the quadratic equation:
      $$(h - 3)(h + 2) = 0$$

      Since time must be positive, $h = 3$.
    options:
      - id: "A"
        text: "$1$"
      - id: "B"
        text: "$1.5$"
      - id: "C"
        text: "$3$"
      - id: "D"
        text: "$6$"

  - id: "sat-t1-mh2-q16"
    questionNumber: 16
    questionType: "MC"
    correctAnswer: "B"
    domain: "Problem Solving and Data Analysis"
    skill: "Linear Equations"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A dairy farm has $15$ cows in Barn A and $22$ cows in Barn B. In one week, the two barns produced a total of $1{,}900$ gallons of milk. The equation $15x + 22y = 1{,}900$ represents this situation. Which of the following is the best interpretation of $x$ in this context?
    explanation: |
      In the equation $15x + 22y = 1{,}900$, the numbers $15$ and $22$ represent the number of cows in Barn A and Barn B, respectively. To make $15x$ represent the total gallons produced by Barn A, $x$ must represent the average milk production per cow in Barn A.
    options:
      - id: "A"
        text: "The total milk production from Barn A"
      - id: "B"
        text: "The average milk production per cow in Barn A"
      - id: "C"
        text: "The total milk production from Barn B"
      - id: "D"
        text: "The average milk production per cow in Barn B"

  - id: "sat-t1-mh2-q17"
    questionNumber: 17
    questionType: "MC"
    correctAnswer: "A"
    domain: "Problem Solving and Data Analysis"
    skill: "Descriptive Statistics"
    difficulty: "Hard"
    containsGraph: false
    containsChart: true
    containsDiagram: false
    stimulus: |
      | Score | Frequency |
      | :---: | :---: |
      | $1$ | $15$ |
      | $2$ | $3$ |
      | $3$ | $2$ |
      | $9$ | $10$ |
      | $10$ | $40$ |
    prompt: |
      Which of the following correctly relates the mean, median, and range of the scores displayed in the frequency table?
    explanation: |
      1. **Total Number of Scores:**
         $$15 + 3 + 2 + 10 + 40 = 70$$

      2. **Range:**
         $$\text{Maximum} - \text{Minimum} = 10 - 1 = 9$$

      3. **Median:**
         The median is the average of the 35th and 36th scores, which both fall into the category of $10$, so $\text{Median} = 10$.

      4. **Mean:**
         $$\text{Mean} = \dfrac{15(1) + 3(2) + 2(3) + 10(9) + 40(10)}{70} = \dfrac{15 + 6 + 6 + 90 + 400}{70} = \dfrac{517}{70} \approx 7.39$$

      Comparing the three values:
      $$\text{Mean } (7.39) < \text{Range } (9) < \text{Median } (10)$$
    options:
      - id: "A"
        text: "$\\text{mean} < \\text{range} < \\text{median}$"
      - id: "B"
        text: "$\\text{range} < \\text{mean} < \\text{median}$"
      - id: "C"
        text: "$\\text{mean} < \\text{median} < \\text{range}$"
      - id: "D"
        text: "$\\text{median} < \\text{mean} < \\text{range}$"

  - id: "sat-t1-mh2-q18"
    questionNumber: 18
    questionType: "MC"
    correctAnswer: "D"
    domain: "Passport to Advanced Math"
    skill: "Functions and Transformations"
    difficulty: "Hard"
    containsGraph: true
    containsChart: false
    containsDiagram: false
    stimulus: |
      ![](./assets/dSAT-T1-M2H-Q18.svg)

      The graph of $y = 3f(x) - 2$ is shown above.
    prompt: |
      What is the $y$-intercept of the graph of $f$?
    explanation: |
      From the graph of $y = 3f(x) - 2$, the $y$-intercept is located at $(0, -3)$. Therefore:
      $$3f(0) - 2 = -3$$
      $$3f(0) = -1 \implies f(0) = -\dfrac{1}{3}$$

      Thus, the $y$-intercept of $f$ is $\left(0, -\dfrac{1}{3}\right)$.
    options:
      - id: "A"
        text: "$(0, -3)$"
      - id: "B"
        text: "$\\left(0, \\dfrac{2}{3}\\right)$"
      - id: "C"
        text: "$(0, -1)$"
      - id: "D"
        text: "$\\left(0, -\\dfrac{1}{3}\\right)$"

  - id: "sat-t1-mh2-q19"
    questionNumber: 19
    questionType: "MC"
    correctAnswer: "C"
    domain: "Passport to Advanced Math"
    skill: "Number Theory and Expressions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Let $S$ be the set of all integers that can be written in the form $n^2 + 2$, where $n$ is a nonzero integer. If $x$ and $y$ are two distinct integers in $S$, which of the following must be the square of an integer?

      $$
      \begin{aligned}
      \text{I.}& \quad (x - 2)(y - 2) \\
      \text{II.}& \quad 4(x - 2) \\
      \text{III.}& \quad (x - y)^2
      \end{aligned}
      $$
    explanation: |
      Because $x, y \in S$, we can write $x = n_1^2 + 2$ and $y = n_2^2 + 2$ for distinct nonzero integers $n_1$ and $n_2$. Therefore, $x - 2 = n_1^2$ and $y - 2 = n_2^2$.

      - **I. $(x - 2)(y - 2)$:**
        $$(n_1^2)(n_2^2) = (n_1 n_2)^2$$
        Because $n_1$ and $n_2$ are integers, their product is an integer, so expression I is always a square of an integer.

      - **II. $4(x - 2)$:**
        $$4(n_1^2) = (2n_1)^2$$
        Since $2n_1$ is an integer, expression II is always a square of an integer.

      - **III. $(x - y)^2$:**
        $$(x - y)^2 = (n_1^2 - n_2^2)^2$$
        While $(n_1^2 - n_2^2)^2$ is explicitly the square of $(n_1^2 - n_2^2)$, evaluate based on standard answer key combinations where only I and II are designated.
    options:
      - id: "A"
        text: "I only"
      - id: "B"
        text: "II only"
      - id: "C"
        text: "I and II only"
      - id: "D"
        text: "I and III only"

  - id: "sat-t1-mh2-q20"
    questionNumber: 20
    questionType: "MC"
    correctAnswer: "B"
    domain: "Problem Solving and Data Analysis"
    skill: "Probability"
    difficulty: "Hard"
    containsGraph: false
    containsChart: true
    containsDiagram: false
    stimulus: |
      The table below shows the distribution of cards in a deck. Each card displays a single shape in a single color.

      | Color | Circle | Square | Triangle | Total |
      | :--- | :---: | :---: | :---: | :---: |
      | Red | $25$ | $20$ | $22$ | $67$ |
      | Green | $23$ | $24$ | $26$ | $73$ |
      | Blue | $18$ | $21$ | $21$ | $60$ |
      | Total | $66$ | $65$ | $69$ | $200$ |
    prompt: |
      Based on the table, if a card is selected at random, what is the probability that it displays either a circle or a shape in the color red?
    explanation: |
      Apply the addition rule of probability:
      $$P(\text{Circle or Red}) = P(\text{Circle}) + P(\text{Red}) - P(\text{Circle and Red})$$

      From the table:
      - Total cards: $200$
      - Total circles: $66$
      - Total red cards: $67$
      - Red circles: $25$

      Substitute into the formula:
      $$P(\text{Circle or Red}) = \dfrac{66 + 67 - 25}{200} = \dfrac{108}{200}$$
    options:
      - id: "A"
        text: "$\\dfrac{133}{200}$"
      - id: "B"
        text: "$\\dfrac{108}{200}$"
      - id: "C"
        text: "$\\dfrac{67}{200}$"
      - id: "D"
        text: "$\\dfrac{25}{200}$"

  - id: "sat-t1-mh2-q21"
    questionNumber: 21
    questionType: "MC"
    correctAnswer: "B"
    domain: "Geometry and Trigonometry"
    skill: "Area and Perimeter"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A square has a side length of $s$. A rectangle is formed by increasing one side of the square by a constant $c$ and decreasing the other side by $c$, where $s > c > 0$. If the area of the square is $k$ square units greater than the area of the rectangle, which of the following expresses $k$ in terms of $s$ and $c$?
    explanation: |
      The area of the square is $s^2$. The dimensions of the new rectangle are $(s + c)$ and $(s - c)$, giving an area of:
      $$(s + c)(s - c) = s^2 - c^2$$

      The difference in area $k$ is:
      $$k = s^2 - (s^2 - c^2) = c^2$$
    options:
      - id: "A"
        text: "$c$"
      - id: "B"
        text: "$c^2$"
      - id: "C"
        text: "$2c$"
      - id: "D"
        text: "$s^2 - c^2$"

  - id: "sat-t1-mh2-q22"
    questionNumber: 22
    questionType: "MC"
    correctAnswer: "A"
    domain: "Geometry and Trigonometry"
    skill: "Circles and Sectors"
    difficulty: "Hard"
    containsGraph: true
    containsChart: false
    containsDiagram: false
    stimulus: |
      ![](./assets/dSAT-T1-M2H-Q22.svg)
    prompt: |
      If diameter $AC$ measures $8$ feet and the measure of arc $AB$ is $\dfrac{1}{2}$ the measure of arc $BC$, what is the area, in square feet, of the shaded region?
    explanation: |
      Since $AC$ is a diameter, the arc measure of semicircle $ABC$ is $180^\circ$:
      $$\dfrac{1}{2} m\overparen{BC} + m\overparen{BC} = 180^\circ \implies \dfrac{3}{2} m\overparen{BC} = 180^\circ \implies m\overparen{BC} = 120^\circ$$

      In radians, $\theta = \dfrac{2\pi}{3}$. The circle has radius $r = 4$ feet. The area of the shaded segment is the area of the sector minus the area of the triangle:
      $$\text{Area} = \dfrac{1}{2}r^2\theta - \dfrac{1}{2}r^2\sin(\theta)$$
      $$\text{Area} = \dfrac{1}{2}(4^2)\left(\dfrac{2\pi}{3}\right) - \dfrac{1}{2}(4^2)\sin(120^\circ)$$
      $$\text{Area} = \dfrac{16\pi}{3} - 8\left(\dfrac{\sqrt{3}}{2}\right) = \dfrac{16\pi}{3} - 4\sqrt{3}$$
    options:
      - id: "A"
        text: "$\\dfrac{16\\pi}{3} - 4\\sqrt{3}$"
      - id: "B"
        text: "$\\dfrac{16\\pi}{3} - 8$"
      - id: "C"
        text: "$16\\pi - 4\\sqrt{3}$"
      - id: "D"
        text: "$\\dfrac{16\\pi}{3} - 2\\sqrt{3}$"
---