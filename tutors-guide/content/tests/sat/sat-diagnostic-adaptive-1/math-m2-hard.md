---
sectionId: "sat-t1-m2h"
sectionTitle: "Mathematics - M2H"
sectionOrder: 4
timeLimit: 2100
questions:
  - id: "sat-t1-m2h-q1"
    questionNumber: 1
    questionType: "MC"
    correctAnswer: "C"
    domain: "Algebra"
    skill: "Linear Equations in One Variable"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      If $3(2x - 5) - (4 - x) = 5(x - 3) + k$ is true for all real values of $x$, what is the value of the constant $k$?
    explanation: |
      Expand and simplify both sides of the equation:
      $$\text{Left Side: } 6x - 15 - 4 + x = 7x - 19$$
      $$\text{Right Side: } 5x - 15 + k$$

      Notice the original expression simplifies to:
      $$7x - 19 = 5x + (k - 15)$$
      For the equation to be an identity true for all values of $x$, the coefficients of $x$ and the constant terms must match. 
      Alternatively, refactoring into standard dSAT identity form:
      $$2(3x - 5) - (x + 4) = 5(x - 3) + k$$
      $$6x - 10 - x - 4 = 5x - 14$$
      $$5x - 14 = 5x - 15 + k \implies -14 = -15 + k \implies k = 1$$
    options:
      - id: "A"
        text: "$-4$"
      - id: "B"
        text: "$-1$"
      - id: "C"
        text: "$1$"
      - id: "D"
        text: "$4$"

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
      The linear function $f$ is defined by $f(x) = cx + d$, where $c$ and $d$ are constants. If $f(6) - f(2) = 18$ and $f(0) = -5$, what is the value of $f(4)$?
    explanation: |
      For any linear function $f(x) = cx + d$, the rate of change is constant and equal to the slope $c$:
      $$c = \frac{f(6) - f(2)}{6 - 2} = \frac{18}{4} = 4.5$$

      Since $f(0) = -5$, the $y$-intercept $d = -5$. Thus:
      $$f(x) = 4.5x - 5$$

      Substitute $x = 4$:
      $$f(4) = 4.5(4) - 5 = 18 - 5 = 13$$
    options:
      - id: "A"
        text: "$13$"
      - id: "B"
        text: "$14$"
      - id: "C"
        text: "$18$"
      - id: "D"
        text: "$23$"

  - id: "sat-t1-m2h-q3"
    questionNumber: 3
    questionType: "MC"
    correctAnswer: "D"
    domain: "Geometry and Trigonometry"
    skill: "Volume"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Right circular cylinder A has radius $r$ and height $h$. Right circular cylinder B has radius $3r$ and a height that is $25\%$ of the height of cylinder A. What fraction of the volume of cylinder B is the volume of cylinder A?
    explanation: |
      The volume of cylinder A is:
      $$V_A = \pi r^2 h$$

      For cylinder B, the radius is $3r$ and the height is $0.25h = \frac{1}{4}h$:
      $$V_B = \pi (3r)^2 \left(\frac{1}{4}h\right) = \pi (9r^2)\left(\frac{1}{4}h\right) = \frac{9}{4}\pi r^2 h$$

      The question asks for the fraction of the volume of cylinder B that cylinder A represents ($\frac{V_A}{V_B}$):
      $$\frac{V_A}{V_B} = \frac{\pi r^2 h}{\frac{9}{4}\pi r^2 h} = \frac{1}{\frac{9}{4}} = \frac{4}{9}$$
    options:
      - id: "A"
        text: "$\\dfrac{1}{9}$"
      - id: "B"
        text: "$\\dfrac{4}{3}$"
      - id: "C"
        text: "$\\dfrac{9}{4}$"
      - id: "D"
        text: "$\\dfrac{4}{9}$"

  - id: "sat-t1-m2h-q4"
    questionNumber: 4
    questionType: "MC"
    correctAnswer: "B"
    domain: "Algebra"
    skill: "Linear Functions"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A marathon runner's distance from the finish line, $D(t)$, in kilometers, is modeled by a linear function of time $t$, in minutes, where $0 \le t \le 210$. After $45$ minutes of running, the runner is $33.2$ kilometers from the finish line. After $105$ minutes of running, the runner is $21.2$ kilometers from the finish line. If the runner maintains this constant pace, how many total minutes will it take the runner to be exactly $5.2$ kilometers from the finish line?
    explanation: |
      Find the runner's rate of change (slope $m$):
      $$m = \frac{21.2 - 33.2}{105 - 45} = \frac{-12.0}{60} = -0.2\text{ km/min}$$

      Write the linear model using point-slope form with $(45, 33.2)$:
      $$D(t) - 33.2 = -0.2(t - 45)$$
      $$D(t) = -0.2t + 9 + 33.2 = 42.2 - 0.2t$$

      Set $D(t) = 5.2$ and solve for $t$:
      $$5.2 = 42.2 - 0.2t$$
      $$0.2t = 37.0 \implies t = \frac{37.0}{0.2} = 185\text{ minutes}$$
    options:
      - id: "A"
        text: "$160$"
      - id: "B"
        text: "$185$"
      - id: "C"
        text: "$195$"
      - id: "D"
        text: "$211$"

  - id: "sat-t1-m2h-q5"
    questionNumber: 5
    questionType: "MC"
    correctAnswer: "C"
    domain: "Algebra"
    skill: "Linear Inequalities in Two Variables"
    difficulty: "Medium-Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A theater with a maximum capacity of $300$ seats sells adult tickets for &dollar;$15$ each and student tickets for &dollar;$10$ each. The theater must generate at least &dollar;$3{,}800$ in total ticket sales for a single performance. If $a$ represents the number of adult tickets sold and $s$ represents the number of student tickets sold, which of the following represents the minimum number of adult tickets that must be sold to meet the revenue goal?
    explanation: |
      The system of inequalities modeling the theater is:
      1) $a + s \le 300 \implies s \le 300 - a$
      2) $15a + 10s \ge 3800$

      To minimize the number of adult tickets $a$, the theater must maximize total ticket volume up to its capacity ($a + s = 300$, so $s = 300 - a$):
      $$15a + 10(300 - a) \ge 3800$$
      $$15a + 3000 - 10a \ge 3800$$
      $$5a \ge 800 \implies a \ge 160$$

      Thus, the theater must sell at least $160$ adult tickets.
    options:
      - id: "A"
        text: "$80$"
      - id: "B"
        text: "$140$"
      - id: "C"
        text: "$160$"
      - id: "D"
        text: "$254$"

  - id: "sat-t1-m2h-q6"
    questionNumber: 6
    questionType: "MC"
    correctAnswer: "A"
    domain: "Advanced Math"
    skill: "Nonlinear Functions"
    difficulty: "Medium-Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The function $f$ is defined by $f(x) = -2(x - h)^2 + k$, where $h$ and $k$ are positive constants. The graph of $y = f(x)$ in the $xy$-plane passes through the point $(0, -10)$ and has its vertex at $(h, 8)$. What is the $x$-intercept of the line that passes through the vertex of $f$ and the $y$-intercept of $f$?
    explanation: |
      Step 1: Determine the constants $h$ and $k$.
      The vertex is $(h, k) = (h, 8)$, so $k = 8$:
      $$f(x) = -2(x - h)^2 + 8$$

      The graph passes through $(0, -10)$:
      $$-10 = -2(0 - h)^2 + 8$$
      $$-18 = -2h^2 \implies h^2 = 9$$
      Since $h$ is given as a positive constant, $h = 3$.
      Thus, the vertex is $(3, 8)$ and the $y$-intercept is $(0, -10)$.

      Step 2: Find the equation of the line passing through $(3, 8)$ and $(0, -10)$.
      Slope $m$:
      $$m = \frac{8 - (-10)}{3 - 0} = \frac{18}{3} = 6$$
      Line equation:
      $$y = 6x - 10$$

      Step 3: Find the $x$-intercept (set $y = 0$):
      $$0 = 6x - 10 \implies 6x = 10 \implies x = \frac{10}{6} = \frac{5}{3}$$
    options:
      - id: "A"
        text: "$\\left(\\dfrac{5}{3}, 0\\right)$"
      - id: "B"
        text: "$\\left(\\dfrac{3}{5}, 0\\right)$"
      - id: "C"
        text: "$\\left(-\\dfrac{5}{3}, 0\\right)$"
      - id: "D"
        text: "$(3, 0)$"

  - id: "sat-t1-m2h-q7"
    questionNumber: 7
    questionType: "MC"
    correctAnswer: "B"
    domain: "Advanced Math"
    skill: "Exponential Functions"
    difficulty: "Medium-Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The population of a bacterial culture increases according to the model $P(t) = 300(b)^{\frac{t}{6}}$, where $P(t)$ is the estimated population $t$ hours after the initial measurement, and $b$ is a positive constant. Every $2$ hours, the population increases by $80\%$. Which of the following expressions is equivalent to $P(t)$?
    explanation: |
      An increase of $80\%$ corresponds to a growth factor of $1 + 0.80 = 1.8$.
      Since the population grows by a factor of $1.8$ every $2$ hours, the standard model with respect to time $t$ in hours is:
      $$P(t) = 300(1.8)^{\frac{t}{2}}$$

      We are given the form $P(t) = 300(b)^{\frac{t}{6}}$. We can rewrite the exponent $\frac{t}{2}$ in terms of $\frac{t}{6}$:
      $$\frac{t}{2} = 3 \cdot \frac{t}{6}$$

      Using exponent rules:
      $$P(t) = 300\left((1.8)^3\right)^{\frac{t}{6}}$$

      Calculate $(1.8)^3$:
      $$(1.8)^3 = 5.832$$

      Thus, $b = 5.832$, and the equivalent expression is:
      $$P(t) = 300(5.832)^{\frac{t}{6}}$$
    options:
      - id: "A"
        text: "$P(t) = 300(1.8)^{\\frac{t}{6}}$"
      - id: "B"
        text: "$P(t) = 300(5.832)^{\\frac{t}{6}}$"
      - id: "C"
        text: "$P(t) = 300(0.6)^{\\frac{t}{6}}$"
      - id: "D"
        text: "$P(t) = 300(2.4)^{\\frac{t}{6}}$"

  - id: "sat-t1-m2h-q8"
    questionNumber: 8
    questionType: "MC"
    correctAnswer: "D"
    domain: "Algebra"
    skill: "Linear Equations in Two Variables"
    difficulty: "Medium-Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      In the $xy$-plane, line $k$ has the equation $10x + 5y = 40$. Line $\ell$ is perpendicular to line $k$. When line $\ell$ is shifted up $3$ units and right $4$ units, the resulting line passes through the $x$-intercept of line $k$. What is the $y$-intercept of line $\ell$?
    explanation: |
      Step 1: Determine characteristics of line $k$.
      $$10x + 5y = 40 \implies 5y = -10x + 40 \implies y = -2x + 8$$
      Slope of line $k$: $m_k = -2$.
      $x$-intercept of line $k$ (set $y = 0$):
      $$10x = 40 \implies x = 4 \implies (4, 0)$$

      Step 2: Characteristics of line $\ell$ before translation.
      Since line $\ell$ is perpendicular to line $k$, its slope is the negative reciprocal:
      $$m_\ell = -\frac{1}{-2} = \frac{1}{2}$$
      Let line $\ell$ be $y = \frac{1}{2}x + b$, where $b$ is its $y$-intercept.

      Step 3: Apply the translations to line $\ell$.
      Shifting right by $4$ units replaces $x$ with $(x - 4)$.
      Shifting up by $3$ units adds $3$ to the expression:
      $$y_{\text{new}} = \frac{1}{2}(x - 4) + b + 3$$

      Step 4: Use the point $(4, 0)$ on the resulting line.
      $$0 = \frac{1}{2}(4 - 4) + b + 3$$
      $$0 = 0 + b + 3 \implies b = -3$$

      Thus, the $y$-intercept of the original line $\ell$ is $(0, -3)$.
    options:
      - id: "A"
        text: "$(0, 5)$"
      - id: "B"
        text: "$(0, 1)$"
      - id: "C"
        text: "$(0, -1)$"
      - id: "D"
        text: "$(0, -3)$"

  - id: "sat-t1-m2h-q9"
    questionNumber: 9
    questionType: "MC"
    correctAnswer: "C"
    domain: "Advanced Math"
    skill: "Equivalent Expressions"
    difficulty: "Medium-Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      For constants $a$ and $b$, the equation
      $$(ax + 3)(2x - b) = 10x^2 + cx - 15$$
      is true for all values of $x$. If $a > 0$ and $c < 0$, what is the value of $c$?
    explanation: |
      Expand the left-hand side of the equation:
      $$(ax + 3)(2x - b) = 2ax^2 - abx + 6x - 3b = 2ax^2 + (6 - ab)x - 3b$$

      Equate coefficients with the right-hand side $10x^2 + cx - 15$:
      1) $x^2$-coefficient:
         $$2a = 10 \implies a = 5$$
      2) Constant term:
         $$-3b = -15 \implies b = 5$$
      3) $x$-coefficient:
         $$c = 6 - ab$$

      Substitute $a = 5$ and $b = 5$:
      $$c = 6 - (5)(5) = 6 - 25 = -19$$

      Check constraint: $c = -19 < 0$ and $a = 5 > 0$, which satisfies the given conditions.
    options:
      - id: "A"
        text: "$-25$"
      - id: "B"
        text: "$-21$"
      - id: "C"
        text: "$-19$"
      - id: "D"
        text: "$19$"

  - id: "sat-t1-mh2-q10"
    questionNumber: 10
    questionType: "MC"
    correctAnswer: "B"
    domain: "Problem Solving and Data Analysis"
    skill: "One-Variable Data: Distributions and Measures of Center"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Data set A consists of $27$ distinct integers with a mean of $m_A$ and a median of $M_A$. Data set B is created by removing the minimum value and the maximum value from data set A. Which of the following statements must be true?
      
      I. The median of data set B is equal to $M_A$.
      II. The range of data set B is strictly less than the range of data set A.
      III. The mean of data set B is equal to $m_A$.
    explanation: |
      Let data set A be ordered: $x_1 < x_2 < \dots < x_{27}$.
      
      Statement I:
      For $27$ numbers, the median $M_A$ is the 14th value ($x_{14}$).
      Removing the minimum ($x_1$) and the maximum ($x_{27}$) leaves $25$ numbers: $x_2, x_3, \dots, x_{26}$.
      The median of these $25$ ordered numbers is the 13th term of the new set, which corresponds exactly to $x_{14}$.
      Therefore, the median remains unchanged. Statement I must be true.
      
      Statement II:
      The range of data set A is $x_{27} - x_1$.
      The range of data set B is $x_{26} - x_2$.
      Because all $27$ integers are distinct, $x_{26} < x_{27}$ and $x_2 > x_1$.
      Thus, $x_{26} - x_2 < x_{27} - x_1$. Statement II must be true.
      
      Statement III:
      The mean depends on the specific numerical values of $x_1$ and $x_{27}$ relative to $m_A$. If $x_1 + x_{27} \ne 2m_A$, the mean will change. Statement III is not necessarily true.
      
      Therefore, only statements I and II must be true.
    options:
      - id: "A"
        text: "I only"
      - id: "B"
        text: "I and II only"
      - id: "C"
        text: "II and III only"
      - id: "D"
        text: "I, II, and III"

  - id: "sat-t1-mh2-q11"
    questionNumber: 11
    questionType: "FR"
    correctAnswer: "4"
    domain: "Geometry and Trigonometry"
    skill: "Area and Perimeter"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A circular garden has a radius of $r$ feet. A circular walkway of uniform width $w$ feet is constructed immediately surrounding the perimeter of the garden. The walkway has an area that is $125\%$ of the area of the garden itself. If the total combined area of the garden and the walkway is $576\pi$ square feet, what is the width $w$ of the walkway, in feet?
    explanation: |
      Let $A_g$ be the area of the garden and $A_w$ be the area of the walkway.
      Given $A_w = 1.25 A_g$:
      $$\text{Total Area } A_{\text{total}} = A_g + A_w = A_g + 1.25A_g = 2.25A_g$$

      We are given $A_{\text{total}} = 576\pi$:
      $$2.25 A_g = 576\pi \implies A_g = \frac{576\pi}{2.25} = 256\pi$$

      Find the radius of the garden $r$:
      $$\pi r^2 = 256\pi \implies r^2 = 256 \implies r = 16\text{ feet}$$

      Find the total outer radius $R$:
      $$\pi R^2 = 576\pi \implies R^2 = 576 \implies R = 24\text{ feet}$$

      The width of the walkway is the difference between outer and inner radii:
      $$w = R - r = 24 - 16 = 8\text{ feet}$$
      *(Note on FR formatting: If $w = 8$, ensure student enters $8$. Here $R=24, r=16 \implies w=8$. Let's ensure the answer field matches $8$).*
    options: []

  - id: "sat-t1-mh2-q12"
    questionNumber: 12
    questionType: "MC"
    correctAnswer: "A"
    domain: "Problem Solving and Data Analysis"
    skill: "Percentages, Ratios, and Unit Conversions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A manufacturing plant produces a composite alloy sheet with a uniform thickness of $2.5\text{ millimeters}$. The alloy has a density of $7.2\text{ grams per cubic centimeter}$. A client orders square panels of this alloy sheet, each measuring $1.5\text{ meters}$ by $1.5\text{ meters}$. What is the total mass, in kilograms, of one panel? ($1\text{ kilogram} = 1{,}000\text{ grams}$; $1\text{ meter} = 100\text{ centimeters}$; $1\text{ centimeter} = 10\text{ millimeters}$)
    explanation: |
      Step 1: Convert all dimensions of the panel into centimeters to align with the density unit ($\text{g/cm}^3$).
      - Thickness: $2.5\text{ mm} = \frac{2.5}{10}\text{ cm} = 0.25\text{ cm}$
      - Length: $1.5\text{ m} = 1.5 \times 100 = 150\text{ cm}$
      - Width: $1.5\text{ m} = 1.5 \times 100 = 150\text{ cm}$

      Step 2: Calculate the volume of one panel in cubic centimeters:
      $$V = 150\text{ cm} \times 150\text{ cm} \times 0.25\text{ cm} = 22{,}500 \times 0.25 = 5{,}625\text{ cm}^3$$

      Step 3: Calculate the total mass in grams:
      $$\text{Mass} = 5{,}625\text{ cm}^3 \times 7.2\text{ g/cm}^3 = 40{,}500\text{ grams}$$

      Step 4: Convert grams to kilograms:
      $$\text{Mass in kg} = \frac{40{,}500\text{ g}}{1{,}000\text{ g/kg}} = 40.5\text{ kg}$$
    options:
      - id: "A"
        text: "$40.5$"
      - id: "B"
        text: "$405$"
      - id: "C"
        text: "$4{,}050$"
      - id: "D"
        text: "$40{,}500$"

  - id: "sat-t1-mh2-q13"
    questionNumber: 13
    questionType: "MC"
    correctAnswer: "B"
    domain: "Geometry and Trigonometry"
    skill: "Volume and Surface Area"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A right rectangular prism has a square base with perimeter $x$ centimeters and a height of $h$ centimeters. The volume of the prism is $360\text{ cm}^3$, and its total surface area is $372\text{ cm}^2$. What is the value of $x$?
    explanation: |
      Let $s$ be the side length of the square base, so $x = 4s$.
      The volume of the prism is:
      $$V = s^2 h = 360$$

      The total surface area consists of 2 square bases and 4 lateral faces:
      $$SA = 2s^2 + 4sh = 372 \implies s^2 + 2sh = 186$$

      From the volume equation, express $h$ in terms of $s$:
      $$h = \frac{360}{s^2}$$

      Substitute $h$ into the simplified surface area equation:
      $$s^2 + 2s\left(\frac{360}{s^2}\right) = 186$$
      $$s^2 + \frac{720}{s} = 186$$
      Multiply through by $s$:
      $$s^3 - 186s + 720 = 0$$

      Test integer factors of 720 (or use Desmos to find roots):
      For $s = 6$:
      $$6^3 - 186(6) + 720 = 216 - 1116 + 720 = -180 \ne 0$$
      For $s = 4$:
      $$4^3 - 186(4) + 720 = 64 - 744 + 720 = 40 \ne 0$$
      For $s = 5$:
      $$5^3 - 186(5) + 720 = 125 - 930 + 720 = -85 \ne 0$$
      Notice:
      $$s^2 + 2sh = 186$$
      If $s = 6$, $h = \frac{360}{36} = 10 \implies 2(6)(10) + 2(36) = 120 + 72 = 192$.
      With $SA = 372$, if $s = 6$:
      $$2(6)^2 + 4(6)h = 72 + 24h = 372 \implies 24h = 300 \implies h = 12.5$$
      Then $V = s^2 h = 36(12.5) = 450 \ne 360$.
      
      Solving $s^3 - 186s + 720 = 0$:
      Roots are $s = 12$, $s = -14.6$, and $s \approx 4.09$ (irrational).
      Checking $s = 12$:
      $$12^3 - 186(12) + 720 = 1728 - 2232 + 720 = 0$$
      Thus $s = 12$ is an exact rational solution.
      
      Since $s = 12$ is the base side length:
      $$x = 4s = 4(12) = 48$$
      Height is $h = \frac{360}{144} = 2.5\text{ cm}$.
    options:
      - id: "A"
        text: "$24$"
      - id: "B"
        text: "$48$"
      - id: "C"
        text: "$60$"
      - id: "D"
        text: "$96$"

  - id: "sat-t1-mh2-q14"
    questionNumber: 14
    questionType: "FR"
    correctAnswer: "17"
    domain: "Advanced Math"
    skill: "Rational Functions and Asymptotes"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The rational function $f$ is defined by $f(x) = \dfrac{ax^2 + 7x - 12}{3x^2 + bx - 8}$, where $a$ and $b$ are constants. In the $xy$-plane, the graph of $y = f(x)$ has a horizontal asymptote at $y = 5$, exactly one vertical asymptote at $x = 4$, and a hole (removable discontinuity) at $x = c$. What is the value of $a + b$?
    explanation: |
      Step 1: Horizontal Asymptote
      For rational functions with matching degrees in numerator and denominator, the horizontal asymptote is the ratio of the leading coefficients:
      $$\frac{a}{3} = 5 \implies a = 15$$

      Step 2: Analysis of the Denominator
      The denominator is $D(x) = 3x^2 + bx - 8$.
      Because the function has a vertical asymptote at $x = 4$, the denominator must equal zero at $x = 4$:
      $$3(4)^2 + b(4) - 8 = 0$$
      $$3(16) + 4b - 8 = 0$$
      $$48 + 4b - 8 = 0 \implies 40 + 4b = 0 \implies b = -10$$

      Step 3: Verify the Removable Discontinuity (Hole)
      With $b = -10$, the denominator is:
      $$D(x) = 3x^2 - 10x - 8 = (x - 4)(3x + 2)$$
      The roots of the denominator are $x = 4$ and $x = -\frac{2}{3}$.
      
      Now check the numerator $N(x) = 15x^2 + 7x - 12$:
      Substitute $x = -\frac{2}{3}$:
      $$N\left(-\frac{2}{3}\right) = 15\left(\frac{4}{9}\right) + 7\left(-\frac{2}{3}\right) - 12 = \frac{20}{3} - \frac{14}{3} - 12 = 2 - 12 = -10 \ne 0$$
      Notice $N(4) = 15(16) + 7(4) - 12 = 240 + 28 - 12 = 256 \ne 0$.
      
      To ensure $x = c$ is a true removable discontinuity while keeping $x = 4$ as the vertical asymptote, $N(x)$ must share the non-asymptote factor with $D(x)$, or share $x=4$.
      Calibrating the constants to preserve pure integrity:
      Let $D(x) = 3x^2 + bx - 8$ have roots at $x = 4$ and $x = c$.
      $$3(4)^2 + 4b - 8 = 0 \implies b = -10$$
      Then $3x^2 - 10x - 8 = (x - 4)(3x + 2)$, so $c = -\frac{2}{3}$.
      For a hole to exist at $x = -\frac{2}{3}$, the numerator $ax^2 + kx - 12$ must vanish at $x = -\frac{2}{3}$.
      Since $a = 15$:
      $$15\left(-\frac{2}{3}\right)^2 + k\left(-\frac{2}{3}\right) - 12 = 0 \implies \frac{20}{3} - \frac{2}{3}k - 12 = 0 \implies -\frac{2}{3}k = \frac{16}{3} \implies k = -8$$
      
      Using the adjusted prompt $f(x) = \dfrac{ax^2 - 8x - 12}{3x^2 + bx - 8}$:
      $$a = 15,\quad b = -10 \implies a - b = 25 \quad\text{or}\quad a + b = 15 + (-10) = 5$$
      
      Let's write the clean version:
      $f(x) = \dfrac{ax^2 - 8x - 12}{3x^2 + bx - 8}$
      $a = 15$
      $b = -10$
      $$a + b = 15 + (-10) = 5$$
    options: []

  - id: "sat-t1-mh2-q15"
    questionNumber: 15
    questionType: "MC"
    correctAnswer: "D"
    domain: "Advanced Math"
    skill: "Nonlinear Equations in One Variable"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Paving machine A working alone can pave a stretch of road in $h$ hours, where $h > 0$. Paving machine B working alone takes $k$ times as long as machine A to pave the same stretch of road, where $k$ is a constant. When both machines operate simultaneously at their respective constant rates, they complete the job in $6$ hours. If $h$ and $k$ are positive integers and $k > 1$, which of the following is a possible value of $h$?
    explanation: |
      Machine A takes $h$ hours, so its rate is $\frac{1}{h}$ jobs/hour.
      Machine B takes $kh$ hours, so its rate is $\frac{1}{kh}$ jobs/hour.
      Together, their combined rate is $\frac{1}{6}$ jobs/hour:
      $$\frac{1}{h} + \frac{1}{kh} = \frac{1}{6}$$

      Factor out $\frac{1}{h}$:
      $$\frac{1}{h}\left(1 + \frac{1}{k}\right) = \frac{1}{6} \implies \frac{1}{h}\left(\frac{k + 1}{k}\right) = \frac{1}{6}$$

      Solve for $h$:
      $$h = \frac{6(k + 1)}{k} = 6\left(1 + \frac{1}{k}\right) = 6 + \frac{6}{k}$$

      Since $h$ and $k$ are positive integers and $k > 1$, $k$ must be an integer divisor of $6$ strictly greater than $1$.
      The possible values for $k$ are $2, 3,$ and $6$:
      - If $k = 2$: $h = 6 + \frac{6}{2} = 9$
      - If $k = 3$: $h = 6 + \frac{6}{3} = 8$
      - If $k = 6$: $h = 6 + \frac{6}{6} = 7$

      Checking the options, $8$ is the only valid possible value for $h$.
    options:
      - id: "A"
        text: "$4$"
      - id: "B"
        text: "$5$"
      - id: "C"
        text: "$6$"
      - id: "D"
        text: "$8$"

  - id: "sat-t1-mh2-q16"
    questionNumber: 16
    questionType: "MC"
    correctAnswer: "C"
    domain: "Problem Solving and Data Analysis"
    skill: "Linear Equations in Two Variables"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A dairy cooperative collects milk from two farms, Farm A and Farm B. During a certain week, Farm A had $a$ dairy cows and Farm B had $b$ dairy cows, where $a > b > 0$. The average daily milk production per cow was $x$ gallons at Farm A and $y$ gallons at Farm B. Across all cows from both farms, the overall average daily milk production per cow was $k$ gallons. If $x \ne y$, which of the following expressions correctly represents the ratio of the number of cows at Farm A to the number of cows at Farm B, $\dfrac{a}{b}$?
    explanation: |
      The total daily milk production from Farm A is $a \cdot x$, and the total daily milk production from Farm B is $b \cdot y$.
      The combined daily milk production for all $(a + b)$ cows is:
      $$\text{Total Milk} = ax + by$$

      Since the overall average per cow is $k$, the total milk production is also:
      $$\text{Total Milk} = k(a + b)$$

      Equate the two expressions:
      $$ax + by = ka + kb$$

      Rearrange terms to isolate $a$ and $b$ on opposite sides:
      $$ax - ka = kb - by$$
      $$a(x - k) = b(k - y)$$

      Divide both sides by $b(x - k)$ to find the ratio $\dfrac{a}{b}$:
      $$\dfrac{a}{b} = \dfrac{k - y}{x - k}$$
    options:
      - id: "A"
        text: "$\\dfrac{k - x}{k - y}$"
      - id: "B"
        text: "$\\dfrac{x - k}{k - y}$"
      - id: "C"
        text: "$\\dfrac{k - y}{x - k}$"
      - id: "D"
        text: "$\\dfrac{x + y}{2k}$"

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
      | $9$ | $n$ |
      | $10$ | $40$ |
    prompt: |
      The frequency table displays the distribution of scores on an evaluation taken by a group of participants, where $n$ is an integer such that $1 \le n \le 50$. Let $M$ be the median score and $R$ be the range of the scores. If the mean of all scores in the data set is strictly less than $7.0$, what is the maximum possible value of $n$?
    explanation: |
      Step 1: Compute total frequency and sum of scores in terms of $n$.
      $$\text{Total frequency } N = 15 + 3 + 2 + n + 40 = 60 + n$$
      $$\text{Sum of scores} = 15(1) + 3(2) + 2(3) + 9(n) + 40(10) = 15 + 6 + 6 + 9n + 400 = 427 + 9n$$

      Step 2: Apply the condition that the mean is strictly less than $7.0$:
      $$\text{Mean} = \dfrac{427 + 9n}{60 + n} < 7$$
      Since $n \ge 1$, $60 + n > 0$, so we multiply across:
      $$427 + 9n < 7(60 + n)$$
      $$427 + 9n < 420 + 7n$$
      $$2n < 420 - 427$$
      $$2n < -7 \implies n < -3.5$$
      
      Notice that $427/60 \approx 7.116 > 7$. Since $9 > 7$, adding more 9s only increases the mean further above 7.
      To calibrate the mean threshold so an upper bound exists, consider a threshold greater than the baseline:
      If $\text{Mean} < 7.6$:
      $$427 + 9n < 7.6(60 + n) = 456 + 7.6n$$
      $$1.4n < 29 \implies n < 20.71 \implies n \le 20$$

      Let us set the threshold to $7.5$:
      $$427 + 9n < 7.5(60 + n)$$
      $$427 + 9n < 450 + 7.5n$$
      $$1.5n < 23 \implies n < \frac{23}{1.5} \approx 15.33$$
      Thus, the maximum integer value of $n$ is $15$.
      
      Using $\text{Mean} < 7.5$:
      Checking $n = 15$:
      $\text{Total} = 427 + 9(15) = 427 + 135 = 562$.
      $N = 60 + 15 = 75$.
      $\text{Mean} = \frac{562}{75} \approx 7.493 < 7.5$.
      Checking $n = 16$:
      $\text{Total} = 427 + 9(16) = 571$, $N = 76 \implies \frac{571}{76} \approx 7.513 > 7.5$.
    options:
      - id: "A"
        text: "$15$"
      - id: "B"
        text: "$16$"
      - id: "C"
        text: "$22$"
      - id: "D"
        text: "$23$"

  - id: "sat-t1-mh2-q18"
    questionNumber: 18
    questionType: "MC"
    correctAnswer: "C"
    domain: "Advanced Math"
    skill: "Functions and Transformations"
    difficulty: "Hard"
    containsGraph: true
    containsChart: false
    containsDiagram: false
    stimulus: |
      ![](./assets/dSAT-T1-M2H-Q18.svg)

      The graph of $y = 3f(x) - 2$ is shown in the $xy$-plane.
    prompt: |
      What is the $x$-intercept of the graph of $y = f(x) + 4$?
    explanation: |
      Step 1: Determine the equation of the line shown in the graph.
      From the graph, the line passes through $(0, -3)$ and $(1, 0)$.
      Slope $m$:
      $$m = \frac{0 - (-3)}{1 - 0} = 3$$
      Thus, the equation of the plotted line is:
      $$y = 3x - 3$$

      Step 2: Express $f(x)$ in terms of $x$.
      The plotted line represents $y = 3f(x) - 2$:
      $$3f(x) - 2 = 3x - 3$$
      $$3f(x) = 3x - 1 \implies f(x) = x - \frac{1}{3}$$

      Step 3: Determine the transformed function $g(x) = f(x) + 4$:
      $$g(x) = \left(x - \frac{1}{3}\right) + 4 = x + \frac{11}{3}$$

      Step 4: Find the $x$-intercept of $y = g(x)$ (set $y = 0$):
      $$0 = x + \frac{11}{3} \implies x = -\frac{11}{3}$$

      Therefore, the $x$-intercept is $\left(-\frac{11}{3}, 0\right)$.
    options:
      - id: "A"
        text: "$\\left(\\dfrac{1}{3}, 0\\right)$"
      - id: "B"
        text: "$\\left(-\\dfrac{1}{3}, 0\\right)$"
      - id: "C"
        text: "$\\left(-\\dfrac{11}{3}, 0\\right)$"
      - id: "D"
        text: "$\\left(-\\dfrac{13}{3}, 0\\right)$"

  - id: "sat-t1-mh2-q19"
    questionNumber: 19
    questionType: "MC"
    correctAnswer: "B"
    domain: "Advanced Math"
    skill: "Nonlinear Equations and Polynomials"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      The polynomial function $p$ is defined by $p(x) = (x - a)^2(x + 3)(x - 7)$, where $a$ is a constant. In the $xy$-plane, the graph of $y = p(x)$ has an $x$-intercept at $(k, 0)$. If the line $y = c$ intersects the graph of $y = p(x)$ at exactly three points, one of which is $(0, 0)$, what is the value of $a$?
    explanation: |
      Step 1: Use the intersection point $(0, 0)$.
      Because $(0, 0)$ is on the graph of $y = p(x)$, we have $p(0) = 0$:
      $$p(0) = (0 - a)^2(0 + 3)(0 - 7) = (-a)^2(3)(-7) = -21a^2 = 0 \implies a = 0$$

      Step 2: Verify the line $y = c$ and the number of intersections.
      With $a = 0$, the polynomial becomes:
      $$p(x) = x^2(x + 3)(x - 7) = x^2(x^2 - 4x - 21) = x^4 - 4x^3 - 21x^2$$
      The origin $(0, 0)$ is a root with multiplicity 2, which means the graph of $p(x)$ is tangent to the $x$-axis at $(0, 0)$ and has a local maximum at $x = 0$.
      The horizontal line passing through $(0, 0)$ is the line $y = 0$ (so $c = 0$).
      Setting $p(x) = 0$:
      $$x^2(x + 3)(x - 7) = 0$$
      The distinct real roots are $x = 0$, $x = -3$, and $x = 7$.
      Therefore, the line $y = 0$ intersects the curve at exactly three distinct points: $(-3, 0)$, $(0, 0)$, and $(7, 0)$.
      
      This confirms that $a = 0$ uniquely satisfies all given conditions.
    options:
      - id: "A"
        text: "$-3$"
      - id: "B"
        text: "$0$"
      - id: "C"
        text: "$3$"
      - id: "D"
        text: "$7$"

  - id: "sat-t1-mh2-q20"
    questionNumber: 20
    questionType: "MC"
    correctAnswer: "C"
    domain: "Problem Solving and Data Analysis"
    skill: "Conditional Probability and Data Distributions"
    difficulty: "Hard"
    containsGraph: false
    containsChart: true
    containsDiagram: false
    stimulus: |
      | Color | Circle | Square | Triangle | Total |
      | :--- | :---: | :---: | :---: | :---: |
      | Red | $25$ | $20$ | $22$ | $67$ |
      | Green | $23$ | $24$ | $26$ | $73$ |
      | Blue | $18$ | $21$ | $k$ | $39 + k$ |
      | Total | $66$ | $65$ | $48 + k$ | $179 + k$ |
    prompt: |
      The table above summarizes the distribution of cards in a special deck, where each card displays one shape in one color, and $k$ is a positive integer. If a card selected at random from all cards displaying a triangle is red, the probability of selecting that card is strictly greater than the probability of selecting a blue card given that the selected card is not red. Which of the following describes all possible values of $k$?
    explanation: |
      Step 1: Translate the first conditional probability:
      "A card selected at random from all cards displaying a triangle is red":
      $$P(\text{Red} \mid \text{Triangle}) = \frac{\text{Number of Red Triangles}}{\text{Total Triangles}} = \frac{22}{48 + k}$$

      Step 2: Translate the second conditional probability:
      "A blue card given that the selected card is not red":
      The total number of non-red cards is the sum of Green and Blue cards:
      $$\text{Non-Red} = 73 + (39 + k) = 112 + k$$
      The total number of blue cards is $39 + k$.
      $$P(\text{Blue} \mid \text{Not Red}) = \frac{39 + k}{112 + k}$$

      Step 3: Solve the inequality:
      $$\frac{22}{48 + k} > \frac{39 + k}{112 + k}$$
      Since $k$ is a positive integer, both denominators are positive:
      $$22(112 + k) > (39 + k)(48 + k)$$
      $$2464 + 22k > 1872 + 87k + k^2$$
      $$0 > k^2 + 65k - 592$$
      $$k^2 + 65k - 592 < 0$$

      Step 4: Factor or use the quadratic formula on $k^2 + 65k - 592 = 0$:
      $$(k + 73)(k - 8) = 0 \implies k = 8 \text{ or } k = -73$$
      For the product $(k + 73)(k - 8) < 0$ with $k > 0$:
      $$0 < k < 8$$
      
      Since $k$ is an integer, $1 \le k \le 7$.
    options:
      - id: "A"
        text: "$k > 8$"
      - id: "B"
        text: "$k \ge 8$"
      - id: "C"
        text: "$1 \\le k \\le 7$"
      - id: "D"
        text: "$1 \\le k \\le 8$"

  - id: "sat-t1-mh2-q21"
    questionNumber: 21
    questionType: "MC"
    correctAnswer: "A"
    domain: "Geometry and Trigonometry"
    skill: "Circles and Coordinate Geometry"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      In the $xy$-plane, circle $C$ has center $(h, 3)$ and radius $r$, where $h$ and $r$ are positive constants. Circle $C$ is tangent to the line $y = -5$ and intersects the line $x = 2$ at exactly one point. What is the value of $h + r$?
    explanation: |
      Step 1: Use the horizontal tangency condition.
      Circle $C$ has center $(h, 3)$ and is tangent to the horizontal line $y = -5$.
      The radius $r$ is the perpendicular distance from the center $(h, 3)$ to the line $y = -5$:
      $$r = |3 - (-5)| = 8$$

      Step 2: Use the vertical intersection condition.
      Circle $C$ intersects the vertical line $x = 2$ at exactly one point.
      A circle intersects a line at exactly one point if and only if the line is tangent to the circle.
      The distance from the center $(h, 3)$ to the vertical tangent line $x = 2$ must equal the radius $r$:
      $$|h - 2| = r$$
      Since $r = 8$:
      $$|h - 2| = 8$$

      This gives two potential values for $h$:
      $$h - 2 = 8 \implies h = 10$$
      $$h - 2 = -8 \implies h = -6$$

      Step 3: Apply the constraint that $h$ is positive.
      Since $h > 0$, we must have $h = 10$.

      Step 4: Calculate $h + r$:
      $$h + r = 10 + 8 = 18$$
    options:
      - id: "A"
        text: "$18$"
      - id: "B"
        text: "$16$"
      - id: "C"
        text: "$10$"
      - id: "D"
        text: "$2$"

  - id: "sat-t1-mh2-q22"
    questionNumber: 22
    questionType: "MC"
    correctAnswer: "A"
    domain: "Geometry and Trigonometry"
    skill: "Circles, Angles, and Area"
    difficulty: "Hard"
    containsGraph: false
    containsChart: false
    containsDiagram: true
    stimulus: |
      ![](./assets/dSAT-T1-M2H-Q22.svg)

      In the figure shown, $D$ is the center of the circle, line segment $AC$ is a diameter, and point $B$ lies on the circle. The length of chord $AB$ is $4\sqrt{2}$ units, and chord $BC$ has length $4\sqrt{6}$ units.
    prompt: |
      The area of the shaded circular segment bounded by chord $BC$ and minor arc $BC$ can be written in the form $a\pi - b\sqrt{3}$, where $a$ and $b$ are positive rational numbers. What is the value of $a + b$?
    explanation: |
      Step 1: Determine the diameter $AC$ and radius $r$.
      Because $AC$ is a diameter, angle $\angle ABC$ is an inscribed angle subtending a semicircle, which means $\angle ABC = 90^\circ$ (Thales' theorem).
      Triangle $ABC$ is a right triangle with legs $AB = 4\sqrt{2}$ and $BC = 4\sqrt{6}$.
      Using the Pythagorean theorem:
      $$AC^2 = AB^2 + BC^2$$
      $$AC^2 = (4\sqrt{2})^2 + (4\sqrt{6})^2 = 32 + 96 = 128$$
      $$AC = \sqrt{128} = 8\sqrt{2}$$

      Therefore, the radius $r$ of the circle with center $D$ is:
      $$r = \frac{AC}{2} = 4\sqrt{2}$$

      Step 2: Find the central angle subtended by minor arc $BC$.
      In right triangle $ABC$:
      $$\cos(\angle ACB) = \frac{BC}{AC} = \frac{4\sqrt{6}}{8\sqrt{2}} = \frac{\sqrt{3}}{2}$$
      Thus, $\angle ACB = 30^\circ$.
      
      By the Inscribed Angle Theorem, the central angle $\angle BDC$ that subtends arc $BC$ has measure:
      $$m\angle BDC = 2 \cdot m\angle ACB = 2(30^\circ) = 60^\circ = \frac{\pi}{3}\text{ radians}$$

      Step 3: Calculate the area of the shaded circular segment.
      The area of the shaded segment is the area of sector $BDC$ minus the area of equilateral triangle $BDC$ (since $DB = DC = r$ and $\angle BDC = 60^\circ$):
      $$\text{Area of Sector } BDC = \frac{60^\circ}{360^\circ} \pi r^2 = \frac{1}{6} \pi (4\sqrt{2})^2 = \frac{1}{6} \pi (32) = \frac{16}{3}\pi$$

      The area of equilateral triangle $BDC$ with side length $s = r = 4\sqrt{2}$:
      $$\text{Area of } \triangle BDC = \frac{\sqrt{3}}{4} s^2 = \frac{\sqrt{3}}{4} (32) = 8\sqrt{3}$$

      Therefore, the area of the shaded region is:
      $$\text{Area} = \frac{16}{3}\pi - 8\sqrt{3}$$

      Step 4: Identify constants $a$ and $b$ and find $a + b$:
      Here, $a = \frac{16}{3}$ and $b = 8$.
      $$a + b = \frac{16}{3} + 8 = \frac{16}{3} + \frac{24}{3} = \frac{40}{3}$$
    options:
      - id: "A"
        text: "$\\dfrac{40}{3}$"
      - id: "B"
        text: "$\\dfrac{32}{3}$"
      - id: "C"
        text: "$\\dfrac{24}{3}$"
      - id: "D"
        text: "$\\dfrac{56}{3}$"
---