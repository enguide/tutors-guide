---
sectionId: "ap-calc-practice-1-s1"
sectionTitle: "Section I, Part A: Multiple Choice (No Calculator)"
sectionOrder: 1
timeLimit: 3600
questions:
  - id: "ap-calc-p1-001"
    questionNumber: 1
    questionType: "MC"
    correctAnswer: "B"
    domain: "Differentiation"
    skill: "Chain Rule & Trigonometric Derivatives"
    difficulty: "Medium"
    prompt: "If $f(x) = \\ln(\\cos(2x))$, what is $f'(x)$ on the interval $(0, \\pi/4)$?"
    explanation: "By the Chain Rule: $f'(x) = \\frac{1}{\\cos(2x)} \\cdot \\frac{d}{dx}(\\cos(2x)) = \\frac{1}{\\cos(2x)} \\cdot (-2\\sin(2x)) = -2\\tan(2x)$."
    options:
      - id: "A"
        text: "$-2\\cot(2x)$"
      - id: "B"
        text: "$-2\\tan(2x)$"
      - id: "C"
        text: "$2\\tan(2x)$"
      - id: "D"
        text: "$\\dfrac{-1}{\\sin(2x)}$"
  - id: "ap-calc-p1-002"
    questionNumber: 2
    questionType: "MC"
    correctAnswer: "C"
    domain: "Integration and Accumulation"
    skill: "Fundamental Theorem of Calculus"
    difficulty: "Hard"
    prompt: "Let $g(x) = \\int_{2}^{x^3} \\sqrt{1 + t^4} \\, dt$. What is the value of $g'(1)$?"
    explanation: "By the Fundamental Theorem of Calculus Part 1 combined with the Chain Rule: $g'(x) = \\sqrt{1 + (x^3)^4} \\cdot \\frac{d}{dx}(x^3) = 3x^2\\sqrt{1 + x^{12}}$. Evaluating at $x = 1$: $g'(1) = 3(1)^2\\sqrt{1 + 1} = 3\\sqrt{2}$."
    options:
      - id: "A"
        text: "$\\sqrt{2}$"
      - id: "B"
        text: "$2\\sqrt{2}$"
      - id: "C"
        text: "$3\\sqrt{2}$"
      - id: "D"
        text: "$6\\sqrt{2}$"
---

### Reference Notes: Particle Dynamics & Function Behavior

A particle moves along a straight line such that its velocity at time $t$ seconds is modeled by a continuous, twice-differentiable function.

For $0 \le t \le 6$, consider the analytic conditions governing accumulated displacement, concavity of positional paths, and critical value thresholds. Graphing calculators are **not permitted** for this part of the exam.