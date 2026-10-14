# Test Content Authoring Guide & Markdown Specification

This reference guide establishes standard content authoring patterns across all exam categories (SAT, ACT, AP, and GRE). Content is authored using YAML frontmatter paired with standard Markdown, LaTeX math via KaTeX, GFM tables, and linked SVG/raster assets.

---

## 1. File Structure & Path Conventions

Each test section resides in its own Markdown file inside `content/tests/[category]/[testId]/[sectionFile].md`. Section assets (images, graphs, SVGs) should be placed inside an `assets/` subfolder next to the Markdown file.

```
content/tests/
  └── sat/
      └── practice-test-1/
          ├── metadata.json
          ├── module-1-reading.md
          ├── module-2-math.md
          └── assets/
              ├── q4-diagram.svg
              ├── choice-a.svg
              └── choice-b.svg

```

Referencing assets in YAML frontmatter should always use the relative pattern:

`./assets/[filename].[svg|png|jpg]`

---

## 2. Global Section Headers

Every file begins with YAML frontmatter bounded by triple dashes (`---`).

```yaml
---
sectionId: "sat-m1-rw"
sectionTitle: "Reading and Writing: Module 1"
sectionOrder: 1
timeLimit: 1920 # Total duration in seconds (32 minutes)
config:
  calculator: "none" # "none" | "desmos-graphing" | "basic"
  hasFormulaSheet: false
  layout: "split-passage" # Default section fallback layout: "split-passage" | "single-column"
questions:
  # Item declarations follow below
---
```[cite: 21]

---

## 3. Question Layout Modes

Authors can determine how items render using the `layout` attribute:

* **Automatic Mode (Omitted `layout`)**:
  * If a `stimulus` or `passage` exists $\rightarrow$ Automatically renders in two-pane split view[cite: 18, 21, 22].
  * If no stimulus is defined $\rightarrow$ Automatically renders in single-column view[cite: 18, 21, 22].
* **Explicit `layout: "split"`**: Forces two-pane view[cite: 21].
* **Explicit `layout: "single"`**: Forces single-column view across the screen even if context or tables are included[cite: 21].

---

## 4. Question Types & Pattern Library

### Pattern A: Standard Reading & Writing Question (Split View)
Used for SAT Reading & Writing and ACT Reading passages with reference stimuli[cite: 6, 21].

```yaml
  - id: "rw-01"
    questionNumber: 1
    questionType: "MC"
    correctAnswer: "B"
    domain: "Craft and Structure"
    skill: "Words in Context"
    difficulty: "Medium"
    stimulus: |
      Coastal salt marsh ecosystems represent dynamic interfaces between terrestrial margins and open marine systems. While initial environmental forecasts predicted widespread collapse due to accelerated sea-level rise, recent field studies indicate that continuous mineral and organic accumulation has substantially ______ these barrier zones against storm energy.
    prompt: "Which choice completes the text with the most logical and precise word or phrase?"
    options:
      - id: "A"
        text: "diminished"
      - id: "B"
        text: "bolstered"
      - id: "C"
        text: "obscured"
      - id: "D"
        text: "neglected"
    explanation: |
      Choice **B** is correct. In this context, "bolstered" means reinforced or strengthened, which directly matches the passage's explanation that mineral and organic accumulation protects barrier zones.
```[cite: 21]

---

### Pattern B: Math Multiple Choice with KaTeX Equations
Inline formulas are enclosed with single dollar signs (`$...$`), and standalone block math uses double dollar signs (`$$...$$`).

```yaml
  - id: "math-01"
    questionNumber: 2
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    domain: "Advanced Math"
    skill: "Nonlinear Equations"
    difficulty: "Hard"
    prompt: |
      For a certain rectangular region, the ratio of its length to its width is $35$ to $10$. If the width of the rectangular region increases by $7$ units, how must the length change to maintain this ratio?
    options:
      - id: "A"
        text: "It must decrease by $24.5$ units."
      - id: "B"
        text: "It must increase by $24.5$ units."
      - id: "C"
        text: "It must decrease by $7$ units."
      - id: "D"
        text: "It must increase by $7$ units."
    explanation: |
      Let length be $L$ and width be $W$, where $\frac{L}{W} = \frac{35}{10} = 3.5$.
      
      When the width becomes $W + 7$, the new length $L'$ must satisfy:
      $$\frac{L'}{W + 7} = 3.5 \implies L' = 3.5W + 24.5 = L + 24.5$$
```[cite: 21]

---

### Pattern C: Math Student-Produced Response (Free Response / Grid-In)
Omit the `options` array and set `questionType: "FR"`[cite: 21].

```yaml
  - id: "math-frq-01"
    questionNumber: 3
    questionType: "FR"
    layout: "single"
    correctAnswer: "17"
    domain: "Algebra"
    skill: "Linear Equations in One Variable"
    difficulty: "Medium"
    prompt: |
      If $4x - 8 = 60$, what is the value of $x$?
    explanation: |
      Adding $8$ to both sides yields:
      $$4x = 68$$
      Dividing by $4$ gives:
      $$x = 17$$
```[cite: 21]

---

### Pattern D: Question with SVG or Raster Diagram in the Prompt
Images use standard Markdown syntax[cite: 8]. An optional caption will automatically render centered below the figure[cite: 8].

```yaml
  - id: "calc-04"
    questionNumber: 4
    questionType: "MC"
    correctAnswer: "C"
    stimulus: |
      ![Velocity graph of a particle along the x-axis](./assets/velocity-curve.svg)
      *Figure 1: Velocity function $v(t)$ over the interval $[0, 8]$.*
    prompt: |
      The graph of the velocity function $v(t)$ of a particle moving along the $x$-axis is shown above. At what time $t$ does the particle change direction?
    options:
      - id: "A"
        text: "$t = 2$"
      - id: "B"
        text: "$t = 3$"
      - id: "C"
        text: "$t = 5$"
      - id: "D"
        text: "$t = 7$"
```[cite: 8, 21]

---

### Pattern E: Options Containing GFM Tables
Multi-line YAML strings (`|`) allow tables to be placed directly into answer choices[cite: 21].

```yaml
  - id: "table-choice-01"
    questionNumber: 5
    questionType: "MC"
    layout: "single"
    correctAnswer: "A"
    prompt: "Which table shows a relation where $y$ is a linear function of $x$ with a rate of change of $4$?"
    options:
      - id: "A"
        text: |
          | $x$ | $y$ |
          | :---: | :---: |
          | 1 | 4 |
          | 2 | 8 |
          | 3 | 12 |
      - id: "B"
        text: |
          | $x$ | $y$ |
          | :---: | :---: |
          | 1 | 2 |
          | 2 | 4 |
          | 3 | 16 |
      - id: "C"
        text: |
          | $x$ | $y$ |
          | :---: | :---: |
          | 1 | 1 |
          | 2 | 5 |
          | 3 | 10 |
      - id: "D"
        text: |
          | $x$ | $y$ |
          | :---: | :---: |
          | 1 | 3 |
          | 2 | 6 |
          | 3 | 9 |
```[cite: 21]

---

### Pattern F: Options Containing Graphs (SVG / Raster)
When options are visual figures, use relative asset links inside each option's `text` property[cite: 8, 21, 24].

```yaml
  - id: "graph-choice-01"
    questionNumber: 6
    questionType: "MC"
    layout: "single"
    correctAnswer: "B"
    prompt: "Which of the following graphs best represents the equation $y = -(x - 2)^2 + 3$?"
    options:
      - id: "A"
        text: "![Parabola opening downward with vertex at (-2, 3)](./assets/graph-choice-a.svg)"
      - id: "B"
        text: "![Parabola opening downward with vertex at (2, 3)](./assets/graph-choice-b.svg)"
      - id: "C"
        text: "![Parabola opening upward with vertex at (2, -3)](./assets/graph-choice-c.svg)"
      - id: "D"
        text: "![Parabola opening upward with vertex at (-2, -3)](./assets/graph-choice-d.svg)"
```[cite: 8, 21, 24]

---
### Pattern G: Interleaved Stimulus Content
- id: "calc-interleaved-01"
    questionNumber: 7
    questionType: "MC"
    domain: "Differential Equations"
    skill: "Modeling Rates of Change"
    difficulty: "Hard"
    stimulus: |
      A tank contains water that is being drained according to the rate function $R(t)$, measured in liters per minute, where $t$ is time in minutes for $0 \le t \le 12$. The draining rate satisfies:
      $$R(t) = \frac{k}{t + 2}$$
      where $k$ is a positive constant.

      Selected values of the rate $R(t)$ at specific intervals are recorded in the table below:

      | $t$ (minutes) | $0$ | $3$ | $6$ | $10$ |
      | :--- | :---: | :---: | :---: | :---: |
      | $R(t)$ (L/min) | $20$ | $8$ | $5$ | $3.3$ |

      At time $t = 6$, an auxiliary drain valve is opened. The supplementary draining rate $S(t)$ is represented by the curve shown in the graph below:

      ![Graph of supplementary rate S(t)](./assets/auxiliary-drain-curve.svg)
      *Figure 1: Rate of drainage from auxiliary valve $S(t)$ over $[6, 12]$.*

      Engineers estimate that the total volume drained over the 12-minute window is modeled by $\int_{0}^{12} (R(t) + S(t)) \, dt$.

    prompt: |
      Using a trapezoidal sum with the three subintervals indicated by the table data, what is the approximation for $\int_{0}^{10} R(t) \, dt$?
    options:
      - id: "A"
        text: "$68.6\\text{ liters}$"
      - id: "B"
        text: "$83.1\\text{ liters}$"
      - id: "C"
        text: "$92.4\\text{ liters}$"
      - id: "D"
        text: "$104.0\\text{ liters}$"
```[cite: 8]

### Rules for Authors Doing Interleaved Layouts:
* **Always use `|` after `stimulus:` or `prompt:`**: This preserves all internal line breaks, indentation, and blank lines.
* **Blank lines between block types**: Always leave a single blank line between a paragraph of text, a table, and an image to allow the Markdown lexer to distinguish distinct block elements[cite: 8].

---

## 5. Authoring Checklist & Best Practices

1. **Math Delimiters**: Never use raw characters like `x^2` or `/` in algebraic stems; wrap them in single dollars: `$x^2$` and `\frac{a}{b}$`.
2. **Blanks in Reading Passages**: Use a continuous line of underscores (`______`) to represent text completion blanks[cite: 14].
3. **Punctuation in Options**: Do not include letter prefixes inside the text (e.g., write `"text: 'diminished'"` instead of `"text: 'A) diminished'"`), as option letter discs are rendered dynamically by the UI[cite: 7, 21].
4. **SVG Dark Mode**: Ensure SVGs have transparent backgrounds without hardcoded `#ffffff` fills so that the test shell's dark mode inverted filters render cleanly without white boxes[cite: 8].

```