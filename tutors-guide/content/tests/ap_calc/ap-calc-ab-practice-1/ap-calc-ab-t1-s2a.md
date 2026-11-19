---
sectionId: "ap-calc-ab-t1-s2a"
sectionTitle: "Section II, Part A (Calculator Active)"
sectionOrder: 3
timeLimit: 2700
config:
  calculator: "desmos-graphing"
  hasFormulaSheet: false
  layout: "single"
questions:
  - id: "ap-calc-frq-q1"
    questionNumber: 1
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Integration and Accumulation of Change"
    skill: "Applying Definite Integrals in Applied Contexts"
    difficulty: "Hard"
    prompt: |
      **A GRAPHING CALCULATOR IS REQUIRED FOR THIS QUESTION.**

      From $5\text{ A.M.}$ to $10\text{ A.M.}$, the rate at which vehicles arrive at a highway toll plaza is modeled by the function $A(t) = 450 + 250\sin\left(\dfrac{\pi t}{4}\right)$, where $t$ is the number of hours after $5\text{ A.M.}$ ($0 \le t \le 5$) and $A(t)$ is measured in vehicles per hour.

      Between $5\text{ A.M.}$ and $10\text{ A.M.}$, vehicles are processed through the toll plaza at a constant rate of $500$ vehicles per hour. At $t = 0$, there are $120$ vehicles waiting in line.

      ---

      **(a)** Write an integral expression that represents the total number of vehicles that arrive at the toll plaza from $t = 0$ to $t = 3$. Find this value.

      **(b)** Find the rate of change of the number of vehicles waiting in line at $t = 2$. Indicate units of measure.

      **(c)** At what time $t$, for $0 \le t \le 5$, is the number of vehicles waiting in line at an absolute maximum? Justify your answer.

      **(d)** Is the number of vehicles waiting in line increasing or decreasing at $t = 4$? Give a reason for your answer.
    subParts:
      - label: "A"
        points: 2
        rubricNotes: "1 pt for definite integral setup; 1 pt for numeric value (1893.268 or 1893)."
        criteria:
          - id: "q1-a-integral"
            description: "Definite integral setup: $\\int_{0}^{3} A(t)\\,dt$"
            points: 1
          - id: "q1-a-value"
            description: "Evaluates total arrivals: $1893.268$ vehicles"
            points: 1
            expectedLatex: "1893.268"
            numericTolerance: 0.002
      - label: "B"
        points: 2
        rubricNotes: "1 pt for value $A(2) - 500 = 200$; 1 pt for units (vehicles per hour)."
        criteria:
          - id: "q1-b-value"
            description: "Computes net rate $A(2) - 500 = 700 - 500 = 200$"
            points: 1
            expectedLatex: "200"
            numericTolerance: 0.001
          - id: "q1-b-units"
            description: "Indicates correct units: vehicles per hour"
            points: 1
            requiredUnits: "vehicles/hr"
      - label: "C"
        points: 3
        rubricNotes: "1 pt for setting $A(t) - 500 = 0$; 1 pt for identifying $t = 3.744$ (or $3.745$); 1 pt for Candidates Test justification."
        criteria:
          - id: "q1-c-eq"
            description: "Sets rate of change of line equal to zero: $A(t) - 500 = 0$ or $A(t) = 500$"
            points: 1
          - id: "q1-c-crit"
            description: "Identifies interior critical point $t = 3.745$ ($3.7448$)"
            points: 1
            expectedLatex: "3.745"
            numericTolerance: 0.002
          - id: "q1-c-just"
            description: "Candidates Test justification evaluating $L(t) = 120 + \\int_0^t (A(s)-500)\\,ds$ at $t = 0, 3.745, 5$ to conclude absolute maximum at $t = 3.745$"
            points: 1
            requiresJustification: true
            allowConsequentialCarryover: true
      - label: "D"
        points: 2
        rubricNotes: "1 pt for evaluating $A(4) - 500 = -50$; 1 pt for concluding decreasing with reason ($A(4) - 500 < 0$)."
        criteria:
          - id: "q1-d-rate"
            description: "Evaluates net rate at $t = 4$: $A(4) - 500 = 450 - 500 = -50$"
            points: 1
            expectedLatex: "-50"
            numericTolerance: 0.001
          - id: "q1-d-reason"
            description: "Concludes the number of vehicles waiting in line is decreasing because $A(4) - 500 < 0$ (or $A(4) < 500$)"
            points: 1
            requiresJustification: true

  - id: "ap-calc-frq-q2"
    questionNumber: 2
    questionType: "FRQ_HANDWRITTEN"
    correctAnswer: "RUBRIC"
    domain: "Applications of Integration"
    skill: "Area Between Curves and Volumes of Solids"
    difficulty: "Hard"
    prompt: |
      **A GRAPHING CALCULATOR IS REQUIRED FOR THIS QUESTION.**

      Let $R$ be the region enclosed by the graph of $f(x) = \ln(x + 2)$, the horizontal line $y = 2$, and the vertical line $x = 0$.

      ---

      **(a)** Find the area of region $R$.

      **(b)** The region $R$ is the base of a solid. For this solid, each cross section perpendicular to the $x$-axis is a square. Write, but do not evaluate, an integral expression that gives the volume of the solid.

      **(c)** Write, but do not evaluate, an integral expression that gives the volume of the solid generated when $R$ is rotated about the horizontal line $y = 2$.
    subParts:
      - label: "A"
        points: 3
        rubricNotes: "1 pt for upper limit $x = e^2 - 2 \\approx 5.389$; 1 pt for area integral; 1 pt for numeric area 3.389."
        criteria:
          - id: "q2-a-limit"
            description: "Finds upper intersection limit $\\ln(x + 2) = 2 \\implies x = e^2 - 2 \\approx 5.389$"
            points: 1
            expectedLatex: "e^2 - 2"
            numericTolerance: 0.001
          - id: "q2-a-integral"
            description: "Definite integral for area: $\\int_{0}^{e^2 - 2} (2 - \\ln(x + 2))\\,dx$"
            points: 1
            allowConsequentialCarryover: true
          - id: "q2-a-value"
            description: "Evaluates area of region $R$: $3.389$ (or $e^2 - 4$)"
            points: 1
            expectedLatex: "3.389"
            numericTolerance: 0.001
            allowConsequentialCarryover: true
      - label: "B"
        points: 3
        rubricNotes: "1 pt for cross-sectional side length $2 - \\ln(x+2)$; 1 pt for squared integrand; 1 pt for limits $[0, e^2 - 2]$."
        criteria:
          - id: "q2-b-side"
            description: "Expresses cross-section side length: $s(x) = 2 - \\ln(x + 2)$"
            points: 1
          - id: "q2-b-integrand"
            description: "Squares side length for cross-sectional area: $(2 - \\ln(x + 2))^2$"
            points: 1
          - id: "q2-b-limits"
            description: "Complete volume integral with limits $[0, e^2 - 2]$: $\\int_{0}^{e^2 - 2} (2 - \\ln(x + 2))^2\\,dx$"
            points: 1
            allowConsequentialCarryover: true
      - label: "C"
        points: 3
        rubricNotes: "1 pt for radius $2 - \\ln(x+2)$; 1 pt for disk integrand $\\pi(2 - \\ln(x+2))^2$; 1 pt for limits $[0, e^2 - 2]$."
        criteria:
          - id: "q2-c-radius"
            description: "Identifies disk radius from axis $y = 2$: $r(x) = 2 - \\ln(x + 2)$"
            points: 1
          - id: "q2-c-integrand"
            description: "Sets up disk integrand with $\\pi$ and squared radius: $\\pi (2 - \\ln(x + 2))^2$"
            points: 1
          - id: "q2-c-limits"
            description: "Complete volume of revolution integral with limits $[0, e^2 - 2]$: $\\pi \\int_{0}^{e^2 - 2} (2 - \\ln(x + 2))^2\\,dx$"
            points: 1
            allowConsequentialCarryover: true