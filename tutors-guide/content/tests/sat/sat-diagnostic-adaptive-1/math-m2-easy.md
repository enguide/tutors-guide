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
      <!-- GRAPH PLACEHOLDER: 
           Asset: ./assets/dSAT-T1-M2E-Q1.svg
           Description: An xy-plane showing the graph of an absolute value / V-shaped function f(x) opening upward.
           - x-axis labeled with tick marks at integers from -6 to 6.
           - y-axis labeled with tick marks every 2 units from -10 to 6.
           - The vertex of the graph is at (4, -8), which sits directly on the vertical grid line at x = 4.
           - The graph passes cleanly through (0, -4) and (8, 0).
           - An open coordinate callout or bold dot marks the lowest point of the graph at (4, -8).
      -->
      ![](./assets/dSAT-T1-M2E-Q1.svg)
    prompt: |
      The graph of the function $f$, where $y = f(x)$, is shown in the $xy$-plane. What is the minimum value of $f(x)$?
    explanation: |
      The minimum value of a function corresponds to the lowest $y$-coordinate on its graph.

      Observing the vertex (lowest point) of the graph, the coordinates are $(4, -8)$. The question asks for the minimum value of $f(x)$, which is the $y$-value at this point:
      $$\text{Minimum value} = -8$$

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
      First, calculate the total weight of the loaded crates:
      $$18 \times 115 = 2{,}070\text{ pounds}$$

      The total cargo consists of the existing crates plus the additional weight $w$. For the van to stay within its safe capacity, this sum must be less than or equal to $3{,}200$:
      $$2{,}070 + w \le 3{,}200$$

      Subtract $2{,}070$ from both sides:
      $$w \le 1{,}130$$
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
    correctAnswer: "C"
    domain: "Problem-Solving and Data Analysis"
    skill: "One-variable data: distributions and measures of center and spread"
    difficulty: "Easy"
    containsGraph: true
    containsChart: false
    containsDiagram: false
    stimulus: |
      <!-- GRAPH PLACEHOLDER: 
           Asset: ./assets/dSAT-T1-M2E-Q3.svg
           Description: A dot plot titled "Number of Books Checked Out per Student".
           - Horizontal axis labeled "Books checked out" with tick marks at 0, 1, 2, 3, 4, 5.
           - Number of dots above each value:
             * 0: 2 dots
             * 1: 4 dots
             * 2: 7 dots
             * 3: 5 dots
             * 4: 3 dots
             * 5: 1 dot
      -->
      ![](./assets/dSAT-T1-M2E-Q3.svg)
    prompt: |
      A librarian recorded the number of books checked out by each student in a reading group during the semester, as shown in the dot plot. What was the most frequent number of books checked out by a student in this group?
    explanation: |
      In a dot plot, the most frequent value (the mode) corresponds to the column with the greatest number of dots stacked vertically.

      Counting the dots for each book count:
      - $0$ books: $2$ students
      - $1$ book: $4$ students
      - $2$ books: $7$ students
      - $3$ books: $5$ students
      - $4$ books: $3$ students
      - $5$ books: $1$ student

      The column at $2$ has the tallest stack with $7$ dots, so $2$ was the most frequent number of books checked out.
    options:
      - id: "A"
        text: "$7$"
      - id: "B"
        text: "$5$"
      - id: "C"
        text: "$2$"
      - id: "D"
        text: "$1$"

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
      Set the total cost function $C(n)$ equal to $22.50$:
      $$1.25n + 7.50 = 22.50$$

      Subtract the flat platform fee ($7.50$) from both sides:
      $$1.25n = 15.00$$

      Divide by the per-album cost ($1.25$):
      $$n = \dfrac{15.00}{1.25} = 12$$
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
      Subtract $4$ from both sides of the equation:
      $$\dfrac{2}{5}m = 11.2 - 4$$
      $$\dfrac{2}{5}m = 7.2$$

      Multiply both sides by $\dfrac{5}{2}$ (or multiply by $5$ and divide by $2$):
      $$m = 7.2 \times \dfrac{5}{2} = 3.6 \times 5 = 18$$
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
      To find the number of flyers distributed, calculate $15\%$ of $840$:
      $$\text{Flyers distributed} = 0.15 \times 840$$

      Perform the multiplication:
      $$0.15 \times 840 = 126$$

      Therefore, the volunteers distributed $126$ flyers.
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
    prompt: |
      Which equation defines the function $g$?
    explanation: |
      A linear function can be written in slope-intercept form as $g(x) = mx + b$, where $m$ is the slope and $b$ is the $y$-intercept.

      1. Identify the $y$-intercept ($b$):
         When $x = 0$, $g(0) = 9$. Therefore, $b = 9$.

      2. Calculate the slope ($m$):
         Using the points $(0, 9)$ and $(2, 17)$:
         $$m = \dfrac{17 - 9}{2 - 0} = \dfrac{8}{2} = 4$$

      Substitute $m = 4$ and $b = 9$ into slope-intercept form:
      $$g(x) = 4x + 9$$
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
      To find the side length $s$, solve the equation for the positive value of $s$:
      $$5s^2 - 45 = 135$$

      Add $45$ to both sides:
      $$5s^2 = 180$$

      Divide both sides by $5$:
      $$s^2 = 36$$

      Take the square root of both sides:
      $$s = \pm 6$$

      Since a side length must be positive, $s = 6$.
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
    correctAnswer: "B"
    domain: "Geometry and Trigonometry"
    skill: "Lines, angles, and triangles"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: true
    stimulus: |
      <!-- DIAGRAM PLACEHOLDER: 
           Asset: ./assets/dSAT-T1-M2E-Q9.svg
           Description: A geometric diagram showing two horizontal parallel lines, line p and line q, intersected by a transversal line r slanting up and to the right.
           - Line p is the upper horizontal line, line q is the lower horizontal line.
           - At the intersection with line p, the acute angle in the top-right position (exterior) is labeled 58°.
           - At the intersection with line q, the acute angle in the interior alternate position (or corresponding top-right position) is labeled w°.
           - Below the diagram: "Note: Figure not drawn to scale."
      -->
      ![](./assets/dSAT-T1-M2E-Q9.svg)

      Note: Figure not drawn to scale.
    prompt: |
      In the figure shown, line $p$ is parallel to line $q$, and line $r$ intersects both lines. What is the value of $w$?
    explanation: |
      When two parallel lines are intersected by a transversal, corresponding angles are equal, and alternate interior angles are equal. 

      The angle labeled $w^\circ$ and the angle labeled $58^\circ$ occupy corresponding positions at their respective intersections with the transversal line $r$. 

      Because line $p$ and line $q$ are parallel, corresponding angles are congruent:
      $$w = 58$$
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
      <!-- GRAPH PLACEHOLDER: 
           Asset: ./assets/dSAT-T1-M2E-Q10.svg
           Description: A vertical bar chart titled "Primary Purpose of Library Visit".
           - Vertical axis labeled "Number of visitors" with grid lines from 0 to 20 in increments of 2.
           - Horizontal axis displays 4 distinct categories:
             * "Group study": bar height at 18
             * "Computer access": bar height at 17
             * "Author workshop": bar height at 11
             * "Tech assistance": bar height at 4
           - The total number of surveyed visitors across all 4 bars is 50.
      -->
      ![](./assets/dSAT-T1-M2E-Q10.svg)
    prompt: |
      A community library surveyed a random sample of $50$ patrons to determine the primary reason for their visit on a Saturday afternoon. The results are summarized in the bar graph shown. If one of these patrons is selected at random, what is the probability that the patron's primary reason for visiting was to attend an author workshop?
    explanation: |
      The probability of an event is given by the ratio of the number of favorable outcomes to the total number of possible outcomes:
      $$P = \dfrac{\text{Number of patrons attending an author workshop}}{\text{Total number of patrons surveyed}}$$

      From the bar graph:
      - The bar for "Author workshop" reaches an altitude of $11$ patrons.
      - The total number of surveyed patrons is $18 + 17 + 11 + 4 = 50$.

      Therefore, the probability is:
      $$\dfrac{11}{50}$$
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
    correctAnswer: "D"
    domain: "Algebra"
    skill: "Linear equations in two variables"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A catering service charges for events using the pricing model:

      $$
      \begin{aligned} 4x &= 48 \\ 5x - 38 &= y \end{aligned}
      $$

      where $x$ is the scheduled duration of an event in hours, and $y$ is the equipment preparation surcharge in dollars. What is the value of $y$?
    explanation: |
      1. Solve the first equation for $x$:
         $$4x = 48 \implies x = \dfrac{48}{4} = 12$$

      2. Substitute $x = 12$ into the second equation to find $y$:
         $$y = 5(12) - 38$$
         $$y = 60 - 38 = 22$$
    options:
      - id: "A"
        text: "$12$"
      - id: "B"
        text: "$38$"
      - id: "C"
        text: "$60$"
      - id: "D"
        text: "$22$"
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
      Each bag of cans contributes $1 \times c = c$ credits, and each bundle of cardboard contributes $4 \times b = 4b$ credits.

      The total number of credits earned from both items combined is $78$:
      $$c + 4b = 78$$
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
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A public university wanted to determine how many of its $24{,}000$ enrolled undergraduate students plan to enroll in a summer internship program. The university selected a random sample of $400$ undergraduate students and asked each whether they intend to enroll in an internship. Of the surveyed students, $15$ responded that they plan to enroll. Which of the following is the best estimate of the total number of enrolled undergraduate students who plan to enroll in an internship?
    explanation: |
      Calculate the proportion of students in the random sample who plan to enroll in an internship:
      $$\text{Sample proportion} = \dfrac{15}{400}$$

      Apply this sample proportion to estimate the total count across the entire undergraduate population of $24{,}000$ students:
      $$\text{Estimated total} = 24{,}000 \times \left(\dfrac{15}{400}\right)$$

      Simplify the calculation:
      $$\dfrac{24{,}000}{400} \times 15 = 60 \times 15 = 900$$

      Therefore, the best estimate of the total number of students is $900$.
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
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      An environmental agency models the estimated fish population, $P$, in a newly restored wetland reserve using the equation $P = 4{,}800(b)^t$ where $b$ is a positive growth constant and $t$ represents the time, in years, since the restoration began. According to the model, what was the estimated fish population in the wetland at the start of the restoration ($t = 0$)?
    explanation: |
      The initial population corresponds to the value of $P$ when time $t = 0$.

      Substitute $t = 0$ into the equation:
      $$P = 4{,}800(b)^0$$

      Since any nonzero number raised to the power of $0$ equals $1$:
      $$P = 4{,}800(1) = 4{,}800$$

      Therefore, the estimated fish population at the start of the restoration was $4{,}800$.
  - id: "sat-t1-m2e-q15"
    questionNumber: 15
    questionType: "MC"
    correctAnswer: "B"
    domain: "Geometry and Trigonometry"
    skill: "Lines, angles, and triangles"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: true
    stimulus: |
      <!-- DIAGRAM PLACEHOLDER: 
           Asset: ./assets/dSAT-T1-M2E-Q15.svg
           Description: A geometric diagram of large triangle ABC with a horizontal base AC.
           - Point B is the top vertex.
           - Point D lies on segment AB, and point E lies on segment BC.
           - Segment DE is drawn parallel to segment AC, creating smaller triangle BDE nested inside triangle ABC.
           - Parallel markings (arrows) are shown on segments DE and AC.
           - Note: Figure not drawn to scale.
      -->
      ![](./assets/dSAT-T1-M2E-Q15.svg)

      Note: Figure not drawn to scale.
    prompt: |
      In the figure shown, $\overline{DE}$ is parallel to $\overline{AC}$. The lengths of the segments are $BD = 15$, $BA = 25$, $BE = 18$, and $DE = 12$. What is the length of $\overline{AC}$?
    explanation: |
      Because $\overline{DE}$ is parallel to $\overline{AC}$, corresponding angles are congruent ($\angle BDE \cong \angle BAC$ and $\angle BED \cong \angle BCA$). Along with the shared angle at vertex $B$, triangle $BDE$ is similar to triangle $BAC$ by AA similarity:
      $$\triangle BDE \sim \triangle BAC$$

      Corresponding sides are proportional:
      $$\dfrac{DE}{AC} = \dfrac{BD}{BA}$$

      Substitute the given values into the proportion:
      $$\dfrac{12}{AC} = \dfrac{15}{25}$$

      Simplify $\dfrac{15}{25} = \dfrac{3}{5}$:
      $$\dfrac{12}{AC} = \dfrac{3}{5}$$

      Cross-multiply to solve for $AC$:
      $$3 \cdot AC = 12 \cdot 5$$
      $$3 \cdot AC = 60$$
      $$AC = 20$$

      *(Note: The length of $BE = 18$ is extraneous information).*
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
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      Which expression is equivalent to $45a^3 b^2 - 30a^2 b^4$?
    explanation: |
      To find an equivalent factored form, factor out the common term $15a^2 b^2$ (or test each expansion):
      $$45a^3 b^2 - 30a^2 b^4 = 5a^2 b^2(9a - 6b^2)$$

      Testing option D by distributing $5a^2 b^2$ into the parentheses:
      $$5a^2 b^2(9a) - 5a^2 b^2(6b^2) = 45a^3 b^2 - 30a^2 b^4$$

      This matches the given expression exactly.
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
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: true
    stimulus: |
      <!-- DIAGRAM PLACEHOLDER: 
           Asset: ./assets/dSAT-T1-M2E-Q17.svg
           Description: A diagram showing a corner formed by a vertical wall and a horizontal shelf meeting at a 90-degree right angle (indicated by a square right-angle symbol).
           - A straight metal brace connects a point on the wall to a point on the shelf, forming a right triangle.
           - Hash marks (tick marks) indicate that the vertical segment along the wall and the horizontal segment along the shelf have equal length.
           - The angle between the brace and the vertical wall is labeled a°.
           - Note: Figure not drawn to scale.
      -->
      ![](./assets/dSAT-T1-M2E-Q17.svg)

      Note: Figure not drawn to scale.
    prompt: |
      A straight metal brace supports a horizontal shelf against a vertical wall, meeting the wall at a $90^\circ$ angle. The brace attaches to the wall and to the shelf at equal distances from the corner, as indicated by the tick marks in the figure. What is the value of $a$?
    explanation: |
      1. The vertical wall and horizontal shelf form a right angle ($90^\circ$).
      2. The brace and the two surfaces form a right triangle whose two legs are equal in length (an isosceles right triangle).
      3. In any triangle, the angles opposite sides of equal length are congruent. Because the sum of angles in a triangle is $180^\circ$:
         $$90^\circ + 2a^\circ = 180^\circ$$
         $$2a = 90 \implies a = 45$$
  - id: "sat-t1-m2e-q18"
    questionNumber: 18
    questionType: "MC"
    correctAnswer: "B"
    domain: "Geometry and Trigonometry"
    skill: "Area and volume"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A landscape designer is installing two circular stone fire pits in a courtyard. Fire Pit $A$ has a diameter of $10$ meters. Fire Pit $B$ is already constructed and has a base area of $36\pi\text{ m}^2$. What is the combined total area of the bases of both fire pits, in $\text{m}^2$?
    explanation: |
      1. Find the radius of Fire Pit $A$:
         The diameter is $10\text{ meters}$, so its radius is $r = \dfrac{10}{2} = 5\text{ meters}$.

      2. Calculate the area of Fire Pit $A$:
         $$\text{Area}_A = \pi r^2 = \pi (5)^2 = 25\pi\text{ m}^2$$

      3. Add the areas of both fire pits:
         $$\text{Total Area} = \text{Area}_A + \text{Area}_B = 25\pi + 36\pi = 61\pi\text{ m}^2$$
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
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A vertical line and a parabola are defined by the system:

      $$
      \begin{aligned} 2x - 3 &= 11 \\ y &= 3x^2 - 15 \end{aligned}
      $$

      At what point $(x, y)$ in the $xy$-plane do the graphs of these two equations intersect?
    explanation: |
      1. Solve the first equation for the $x$-coordinate:
         $$2x - 3 = 11$$
         $$2x = 14 \implies x = 7$$

      2. Substitute $x = 7$ into the quadratic equation to determine the $y$-coordinate:
         $$y = 3(7)^2 - 15$$
         $$y = 3(49) - 15$$
         $$y = 147 - 15 = 132$$

      Therefore, the graphs intersect at $(7, 132)$.
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
    difficulty: "Easy"
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
      According to the Factor Theorem, a linear expression $(x - c)$ is a factor of a polynomial function $h(x)$ if and only if $h(c) = 0$ (that is, $x = c$ is an $x$-intercept or zero of the function).

      From the given table, $h(3) = 0$. 

      Since $x = 3$ is a zero of the polynomial, the corresponding factor is:
      $$(x - 3)$$

      *(Note: The point $(0, -6)$ represents the $y$-intercept, not a zero of the function).*
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
    correctAnswer: "A"
    domain: "Algebra"
    skill: "Linear equations in two variables"
    difficulty: "Easy"
    containsGraph: true
    containsChart: false
    containsDiagram: false
    stimulus: |
      A specialty boutique prepares corporate gift baskets containing bags of artisan coffee, $x$, and tins of loose-leaf tea, $y$. The system of equations below represents the combined number of items and the total dollar budget for a large order:

      $$
      \begin{aligned} x + y &= 40 \\ 12x + 8y &= 360 \end{aligned}
      $$

      Which of the following graphs on the $xy$-plane represents this system of equations for all possible combinations of $x$ and $y$?
    prompt: |
      Which graph correctly represents the given system?
    explanation: |
      To identify the correct graph, determine the $x$- and $y$-intercepts for each line in the first quadrant:

      1. For the first equation, $x + y = 40$:
         - Set $y = 0 \implies x = 40$. The $x$-intercept is $(40, 0)$.
         - Set $x = 0 \implies y = 40$. The $y$-intercept is $(0, 40)$.

      2. For the second equation, $12x + 8y = 360$:
         - Set $y = 0 \implies 12x = 360 \implies x = 30$. The $x$-intercept is $(30, 0)$.
         - Set $x = 0 \implies 8y = 360 \implies y = 45$. The $y$-intercept is $(0, 45)$.

      Comparing the two lines:
      - Both lines have negative slopes.
      - Along the vertical $y$-axis, the line for $12x + 8y = 360$ begins higher at $(0, 45)$ than the line for $x + y = 40$ at $(0, 40)$.
      - Along the horizontal $x$-axis, the line for $x + y = 40$ extends farther to $(40, 0)$ than the line for $12x + 8y = 360$ at $(30, 0)$.
      - The two lines intersect at $(10, 30)$.

      Graph A is the only graph showing both downward-sloping lines with intercepts at $(0, 40)$ and $(40, 0)$ for one line, and $(0, 45)$ and $(30, 0)$ for the second line.
    options:
      - id: "A"
        text: |
          <!-- GRAPH PLACEHOLDER: 
               Asset: ./assets/dSAT-T1-M2E-Q21-OptA.svg
               Description: First-quadrant graph with x-axis and y-axis scaled from 0 to 50 in increments of 10.
               - Line 1 passes through (0, 40) and (40, 0).
               - Line 2 passes through (0, 45) and (30, 0).
               - The two lines intersect cleanly at (10, 30). Both lines slope downward. (CORRECT)
          -->
          ![](./assets/dSAT-T1-M2E-Q21-OptA.svg)
      - id: "B"
        text: |
          <!-- GRAPH PLACEHOLDER: 
               Asset: ./assets/dSAT-T1-M2E-Q21-OptB.svg
               Description: First-quadrant graph with x-axis and y-axis scaled from 0 to 50 in increments of 10.
               - Line 1 passes through (0, 40) and (40, 0).
               - Line 2 is an upward-sloping line passing through the origin (0, 0) and (20, 30). (DISTRACTOR: sign error)
          -->
          ![](./assets/dSAT-T1-M2E-Q21-OptB.svg)
      - id: "C"
        text: |
          <!-- GRAPH PLACEHOLDER: 
               Asset: ./assets/dSAT-T1-M2E-Q21-OptC.svg
               Description: First-quadrant graph with x-axis and y-axis scaled from 0 to 50 in increments of 10.
               - Line 1 passes through (0, 30) and (30, 0).
               - Line 2 passes through (0, 40) and (45, 0). (DISTRACTOR: inverted intercepts)
          -->
          ![](./assets/dSAT-T1-M2E-Q21-OptC.svg)
      - id: "D"
        text: |
          <!-- GRAPH PLACEHOLDER: 
               Asset: ./assets/dSAT-T1-M2E-Q21-OptD.svg
               Description: First-quadrant graph with x-axis and y-axis scaled from 0 to 50 in increments of 10.
               - Both lines slope upward from the positive axes into the upper-right quadrant. (DISTRACTOR: inverted slope orientation)
          -->
          ![](./assets/dSAT-T1-M2E-Q21-OptD.svg)
  - id: "sat-t1-m2e-q22"
    questionNumber: 22
    questionType: "MC"
    correctAnswer: "A"
    domain: "Algebra"
    skill: "Operations with polynomials"
    difficulty: "Easy"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    prompt: |
      A manufacturing company models its projected monthly revenue, in hundreds of dollars, by the expression $R = 5x + 3y$, where $x$ and $y$ represent the number of standard and premium units sold, respectively. The company's operating expense is modeled by the expression $E = 8x - 9y + 14$. Which expression represents the company's projected net operating margin, defined as $R - E$?
    explanation: |
      To find $R - E$, substitute the expressions for $R$ and $E$ and distribute the negative sign across all terms in $E$:
      $$R - E = (5x + 3y) - (8x - 9y + 14)$$

      Distribute the negative sign:
      $$= 5x + 3y - 8x - (-9y) - 14$$
      $$= 5x + 3y - 8x + 9y - 14$$

      Combine like terms:
      - $x$-terms: $5x - 8x = -3x$
      - $y$-terms: $3y + 9y = 12y$
      - Constant term: $-14$

      $$R - E = -3x + 12y - 14$$
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