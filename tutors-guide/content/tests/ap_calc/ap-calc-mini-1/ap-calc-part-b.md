---
sectionId: "ap-calc-sec1b"
sectionTitle: "Section I, Part B (Calculator Active)"
sectionOrder: 2
timeLimit: 300
questions:
  - id: "ap-calc-1b-q1"
    questionNumber: 1
    questionType: "MC"
    correctAnswer: "B"
    domain: "Differential Equations"
    skill: "Rates of Change"
    difficulty: "Hard"
    stimulus: "Water is pumped into a storage tank at a variable rate modeled by $R(t) = 150 \\sin^2(t/4)$ liters per hour, where $t$ is measured in hours for $0 \\le t \\le 8$."
    prompt: "Using a graphing calculator, find the total amount of water pumped into the tank from $t = 0$ to $t = 6$ hours, rounded to the nearest integer."
    explanation: "Integrate R(t) from 0 to 6: \\int_0^6 150 \\sin^2(t/4) dt. Using numeric integration: \\int_0^6 75(1 - \\cos(t/2)) dt = 75[t - 2\\sin(t/2)]_0^6 = 75[6 - 2\\sin(3)] \\approx 75[6 - 2(0.1411)] \\approx 75(5.7177) \\approx 429 liters."
    options:
      - id: "A"
        text: "$385$ liters"
      - id: "B"
        text: "$429$ liters"
      - id: "C"
        text: "$512$ liters"
      - id: "D"
        text: "$600$ liters"

  - id: "ap-calc-1b-q2"
    questionNumber: 2
    questionType: "MC"
    correctAnswer: "D"
    domain: "Applications of Derivatives"
    skill: "Particle Motion"
    difficulty: "Medium"
    prompt: "A particle moves along a straight line so that its velocity at time $t \\ge 0$ is given by $v(t) = t^3 - 4t^2 + 3$. At what time $t$ in the interval $[1, 4]$ does the particle attain its minimum velocity?"
    explanation: "Acceleration a(t) = v'(t) = 3t^2 - 8t = t(3t - 8) = 0 -> t = 8/3 \\approx 2.67. Since v''(t) = 6t - 8 > 0 at t = 8/3, this represents a local minimum. Checking endpoints: v(1) = 0, v(4) = 3, v(8/3) \\approx -6.48. Thus, the minimum velocity occurs at t = 8/3."
    options:
      - id: "A"
        text: "$t = 1.00$"
      - id: "B"
        text: "$t = 2.00$"
      - id: "C"
        text: "$t = 2.45$"
      - id: "D"
        text: "$t = 2.67$"
---