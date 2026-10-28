# Comprehensive Test Content Authoring & Formatting Guide

This guide establishes the standardized markdown architecture, frontmatter schemas, media telemetry flags, and test-specific UI conventions for content authors across the Digital SAT, ACT, and AP examination suites.

---

## 1. Architectural Overview & File System Conventions

Test materials are authored as standard Markdown (`.md`) files with rich YAML frontmatter and co-located static assets version-controlled directly in the repository:

```text
content/
└── tests/
    └── [category]/                # e.g., sat, act, ap-calc, gre
        └── [test-id]/             # e.g., sat-practice-1
            ├── metadata.json      # Test index & section configs
            ├── section-1.md       # Section Markdown body & frontmatter
            └── assets/            # Co-located diagrams & illustrations
                ├── diagram-1.svg
                └── chart-2.webp

```

* **Vector First (SVG):** Use vector SVGs for geometric diagrams, coordinate planes, graphs, and line art so they scale cleanly and adapt to dark/light themes.
* **Raster Images (WebP/PNG):** Reserve WebP (with fallback PNGs) strictly for historical primary-source scans, fine art, or shaded photographic stimuli.

---

## 2. Standardized YAML Frontmatter Schema

Each section file combines comprehensive frontmatter telemetry with a markdown body. To ensure clean separation between mutable data and static content, **all passage contexts, data tables, and introductory stimuli are housed directly inside the `stimulus` field of each question object**, converting every question into an atomic, independent record.

### Universal Question Schema Properties:

* `id`: Unique string identifier (e.g., `"sat-rw-m1-q1"`).
* `questionNumber`: Integer item index within the section.
* `questionType`: `"MC"` (Multiple Choice), `"FR"` (Free Response / Grid-In), or `"FRQ_HANDWRITTEN"` (AP Multi-part Free Response).
* `correctAnswer`: Correct answer key (`"A"`, `"B"`, `"C"`, `"D"`, a numeric value, or `"RUBRIC"` for AP FRQs).
* `domain`: Core curriculum domain tag.
* `skill`: Specific concept or skill tested.
* `difficulty`: Tier (`"Easy"`, `"Medium"`, or `"Hard"`).
* `containsGraph`: Boolean flag (`true`/`false`) indicating coordinate geometry or function plots.
* `containsChart`: Boolean flag (`true`/`false`) indicating data tables or statistical charts.
* `containsDiagram`: Boolean flag (`true`/`false`) indicating geometric figures or vector illustrations.
* `stimulus`: Multi-line block (`|`) containing passage text, background information, data tables, or multi-part prompts.
* `prompt`: The specific question text being asked.
* `explanation`: Step-by-step breakdown of the correct answer and distractor rationales.
* `options`: Array of option objects (`id` and `text`) for multiple-choice items.

---

## 3. Test-Specific Formatting & Authoring Conventions

Different standardized tests present very different user interfaces and interaction models. Authors must follow these category-specific rules:

### A. Digital SAT Conventions (Bluebook Emulation)

* **Layout:** Split-passage view (`split-passage`) pairing a reading passage on the left pane with the prompt and options on the right pane.
* **Underline & Focus Mechanics:** Uses blank underlines or targeted inline highlights (`[[u:1]]text[[/u]]`) corresponding to specific question items. When an item is selected, the left pane automatically scrolls and highlights the target line.
* **Tools:** Desmos graphing calculator enabled for Math sections; interactive formula reference sheet modal available.

### B. ACT Conventions (TestNav Emulation)

* **Layout:** Full passage or multi-paragraph reading stimulus housed in the `stimulus` field, accompanied by a series of questions referencing underlined words, phrases, or sentence placement markers.
* **Interactive Underlines & Moving Highlights:**
* Use `[[u:N]]text[[/u]]` to mark underlined segments corresponding to question number `N` (e.g., `[[u:1]]frequently altered[[/u]]`).
* When a student navigates to question `N`, the test runner dynamically applies a **"moving highlight"** across that specific underline in the passage.
* For sentence placement questions, use bracketed markers `[[[A]:10]]`, `[[[B]:10]]`, etc., which highlight dynamically when question 10 is active.



### C. AP Exams Conventions (Academic & Free Response)

* **Layout:** Single-column academic layout optimized for advanced mathematics (`STIXTwoText` / LaTeX notation).
* **Multiple Choice:** Standard rigorous AP multiple-choice items with four options (`A` through `D`).
* **Handwritten Free Response (`FRQ_HANDWRITTEN`):**
* Free-response questions omit the `options` array entirely.
* Large, multi-part questions (parts a, b, c, d) are structured directly inside the `prompt` or `stimulus` field using Markdown blockquotes and bold subpart headers (e.g., `**(a)**`, `**(b)**`).
* `correctAnswer` is set to `"RUBRIC"` to indicate instructor or automated rubric grading.



---

## 4. Complete Authoring Examples by Test Type

### Example 1: Digital SAT Multiple-Choice (Split Passage & Underline Target)

```yaml
---
sectionId: "sat-practice-1-s1"
sectionTitle: "Reading and Writing - Module 1"
sectionOrder: 1
timeLimit: 1920
questions:
  - id: "sat-p1-rw-001"
    questionNumber: 1
    questionType: "MC"
    correctAnswer: "B"
    domain: "Craft and Structure"
    skill: "Words in Context"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    stimulus: |
      Recent examinations of municipal water networks in early industrial settlements challenge prior consensus. Although historical accounts characterized early civic infrastructure as thoroughly fragile, updated archaeological excavations suggest these distribution conduits were remarkably [[u:1]]fortified[[/u]] and maintained with precision.
    prompt: "Which choice completes the text with the most logical and precise word or phrase?"
    explanation: "The text explains that continuous maintenance protected water networks. 'Fortified' accurately conveys resilience against storm surges."
    options:
      - id: "A"
        text: "diminished"
      - id: "B"
        text: "fortified"
      - id: "C"
        text: "obscured"
      - id: "D"
        text: "stagnated"
---

```

---

### Example 2: ACT English/Reading Style (Moving Underlines & Passage Context)

```yaml
---
sectionId: "act-english-m1"
sectionTitle: "English - Test 1"
sectionOrder: 1
timeLimit: 2700
questions:
  - id: "act-eng-q1"
    questionNumber: 1
    questionType: "MC"
    correctAnswer: "A"
    domain: "Production of Writing"
    skill: "Author's Intent & Style"
    difficulty: "Medium"
    containsGraph: false
    containsChart: false
    containsDiagram: false
    stimulus: |
      The architecture of the mid-century municipal library reflected an era of civic optimism. Architects often [[u:1]]incorporated expansive glass facades[[/u]] that invited natural light deep into the reading rooms, establishing a seamless visual connection between the public square and the quiet study carrels within.
    prompt: "Which choice best maintains the tone and style established in the passage?"
    explanation: "Choice A preserves the formal tone and vivid descriptive imagery without redundancy."
    options:
      - id: "A"
        text: "incorporated expansive glass facades"
      - id: "B"
        text: "put in big glass windows everywhere"
      - id: "C"
        text: "added glass walls that you could see through"
      - id: "D"
        text: "slapped glass panes across the front"
  - id: "act-eng-q2"
    questionNumber: 2
    questionType: "MC"
    correctAnswer: "C"
    domain: "Sentence Structure"
    skill: "Modifier Placement"
    difficulty: "Hard"
    stimulus: |
      The architecture of the mid-century municipal library reflected an era of civic optimism. Architects often incorporated expansive glass facades that invited natural light deep into the reading rooms, establishing a seamless visual connection between the public square and the quiet [[u:2]]study carrels within[[/u]].
    prompt: "Which choice provides the most precise modifier placement?"
    explanation: "Choice C ensures correct adjectival modification."
    options:
      - id: "A"
        text: "study carrels situated inside"
      - id: "B"
        text: "interior study carrels"
      - id: "C"
        text: "study carrels within"
      - id: "D"
        text: "internal reading desks"
---

```

---

### Example 3: AP Calculus Free Response (Handwritten Multi-Part FRQ)

```yaml
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
    containsGraph: false
    containsChart: false
    containsDiagram: false
    stimulus: |
      **A GRAPHING CALCULATOR IS REQUIRED FOR THIS QUESTION.**

      From $5\text{ A.M.}$ to $10\text{ A.M.}$, the rate at which vehicles arrive at a highway toll plaza is modeled by the function $A(t) = 450 + 250\sin\left(\dfrac{\pi t}{4}\right)$, where $t$ is the number of hours after $5\text{ A.M.}$ ($0 \le t \le 5$) and $A(t)$ is measured in vehicles per hour.

      Between $5\text{ A.M.}$ and $10\text{ A.M.}$, vehicles are processed through the toll plaza at a constant rate of $500$ vehicles per hour. At $t = 0$, there are $120$ vehicles waiting in line.
    prompt: |
      ---

      **(a)** Write an integral expression that represents the total number of vehicles that arrive at the toll plaza from $t = 0$ to $t = 3$. Find this value.

      **(b)** Find the rate of change of the number of vehicles waiting in line at $t = 2$. Indicate units of measure.

      **(c)** At what time $t$, for $0 \le t \le 5$, is the number of vehicles waiting in line at an absolute maximum? Justify your answer.

      **(d)** Is the number of vehicles waiting in line increasing or decreasing at $t = 4$? Give a reason for your answer.
    explanation: |
      **Scoring Rubric Overview:**
      * **(a)** $\displaystyle\int_{0}^{3} A(t) \, dt \approx 1859.399$ vehicles.
      * **(b)** Rate of change formula $R'(2) = A(2) - 500 = 200$ vehicles/hour.
      * **(c)** Evaluates critical points and endpoints $t = 0, 1.487, 5$, concluding maximum occurs at $t = 5$.
      * **(d)** Compares arrival rate $A(4) = 450$ to processing rate $500$, determining decreasing.
---

```

---

## 5. Summary Reference Table for Markup Telemetry

| Syntax Pattern | Purpose / Behavior | Test Suite Applicability |
| --- | --- | --- |
| `[[u:N]]text[[/u]]` | Underlines text and binds it to question item `N` with active scroll / moving highlight. | SAT & ACT |
| `[[u]]text[[/u]]` | Static underline without item binding. | General |
| `[[hl]]text[[/hl]]` | Static background highlight for definitions or key terms. | General |
| `[[#N]]` | Invisible paragraph scroll anchor for long-passage navigation. | SAT & ACT |
| `[[[A]:N]]` | Sentence insertion placement marker bound to item `N`. | SAT & ACT |
| `$inline$` / `$$display$$` | KaTeX rendered mathematical notation. | Math & Science (SAT, AP, GRE) |

Yes, your request makes complete sense. The subtle differences between `|` block scalars, single-backslash `\`, double-backslash `\\`, and Markdown/KaTeX formatting stem from how the **YAML parser**, **markdown tokenizer (`react-markdown` + `remark-gfm`)**, and **KaTeX (`rehype-katex`)** process the source text.

---

### Authoring Rules & Style Guide for Mathematics Questions

#### 1. YAML String Style: When to Use `|` (Block Literal) vs Inline Quotes `"`

In YAML, a block scalar introduced by `|` preserves newlines and avoids string escape parsing.

* **Use `|` (Block Literal Scalar) for:**
* **Any multi-line field**: All `explanation` fields, multi-line `stimulus` blocks, and multi-line `prompt` blocks.
* **Content containing Markdown tables, images, or lists**:
```yaml
stimulus: |
  ![](./assets/APCalcAB-T1-S1A-Q3.svg)

  The graph of $y = g(x)$ is shown above.

```


* **Single-line prompts that contain LaTeX**: Even for single-line prompts, using `prompt: |` (or standard block scalar) prevents JSON/YAML escaping issues.


* **Use inline quotes `"..."` only for:**
* Short, single-line math expressions in `options` items (e.g., `text: "$\\dfrac{10}{3}$"`).
* Short metadata fields (e.g., `id: "ap-calc-1a-q1"`, `difficulty: "Easy"`).



---

#### 2. Escaping Rules: When to Use `\\` vs `\`

The choice between `\\` and `\` depends strictly on whether the field is inside a **quoted string (`"..."`)** or a **block literal (`|`)**.

| Context | Backslash Rule | Example | Why? |
| --- | --- | --- | --- |
| **Inside Quoted YAML Strings** (`"..."`) | **Double `\\**` | `"$\\dfrac{8}{3}$"`, `"$\\lim\\limits_{x \\to 2}$"` | YAML evaluates escape characters inside `"..."`. `\\d` becomes a literal `\d` passed to KaTeX. A single `\d` is invalid YAML. |
| **Inside Block Literals** (` | `) | **Single `\**` | `$$\dfrac{d}{dx}[x^n] = n x^{n-1}$$`, `$\lim\limits_{x \to 0}$` |
| **LaTeX Spacing Inside Quoted Strings** | **Double `\\,**` | `"$\\displaystyle\\int 8e^{4x} \\, dx =$"` | `\\,` yields a thin space `\,` in the rendered KaTeX output. |
| **LaTeX Spacing Inside ` | ` Blocks** | **Single `\,**` | `$$\int f(x) \, dx$$` |

> **Author Golden Rule:** If the line starts under a `|` block, write standard LaTeX with single backslashes (`\dfrac`, `\int`, `\limits`). If you are defining an option inside double quotes (`text: "..."`), double every backslash (`\\dfrac`, `\\int`, `\\limits`).

---

#### 3. Markdown Tables & GFM Delimiters (`|`)

The renderer uses `remark-gfm` to render GitHub-Flavored Markdown tables.

* **Always declare tables under `|` blocks** (e.g., in `stimulus: |`).
* **Format:** Wrap every row with leading and trailing pipe characters (`|`), including the header separator:
```yaml
stimulus: |
  | $t \textrm{ (minutes)}$ | $0$ | $4$ | $10$ |
  | :--- | :---: | :---: |
  | $W(t)$ | $80$ | $80$ | $65$ |

```


* **Alignment Indicators:**
* `:---` for left-aligned text.
* `:---:` for centered text/numbers (standard for math values).
* `---:` for right-aligned values.


* **Math Inside Cells:** Keep LaTeX inside dollar signs (`$0$`, `$W(t)$`) and use `\textrm{...}` or `\text{...}` for descriptive units.

---

#### 4. Custom Component Patterns Supported by `MarkdownQuestionRenderer`

The custom renderer supports specific tokens processed prior to Markdown/KaTeX rendering:

* **Roman Numeral Multi-Select Lists:**
Lines starting with Roman numerals in lists are converted into aligned, non-prose prompt items:
```yaml
prompt: |
  Which of the following expressions give the total area?

  I. $\left| \displaystyle\int_{0}^{4} (f(x) - x) \, dx \right|$
  II. $\displaystyle\int_{0}^{4} |f(x) - x| \, dx$
  III. $\displaystyle\int_{0}^{2} (f(x) - x) \, dx + \displaystyle\int_{2}^{4} (x - f(x)) \, dx$

```


* **Question Target Underlines & Anchors:**
* `[[u:1]]text[[/u]]`: Underlines text and binds it to question #1 for active highlighting and auto-scroll.
* `[[#1]]`: Invisible scroll target anchor for question #1.
* `[[u]]text[[/u]]`: Plain static underline.
* `[[hl]]text[[/hl]]`: Static background highlight.
* `[[[A]:15]]`: ACT/SAT style placement letter badge for question #15.



---

#### 5. Mathematics & LaTeX Conventions

* **Fractions:** Prefer `\dfrac{a}{b}` over `\frac{a}{b}` for readability in both inline and display math.
* **Integral Signs:** Always use `\displaystyle\int` for inline integrals to prevent subscript/superscript cramping:
* Prompt: `$\displaystyle\int_{0}^{4} f(x) \, dx$`
* Spacing before differential: Include a thin space before $dx$, written as `\, dx` (or `\\, dx` in quotes).


* **Negative Kerning for Stems:** When an integral has a large top/bottom limit or tightly spaced integrand, use `\mkern-6mu` or `\mkern-9mu` directly after the integral sign:
* `$\displaystyle\int \mkern-6mu \dfrac{1}{x^2 + 1} \, dx$`


* **Number Formatting:** In 4-digit numbers inside math mode, suppress math-spacing around commas using braces:
* `$1{,}190$` (not `$1,190$`, which KaTeX treats as a coordinate list separator with extra space).


* **Limits:** Use `\lim\limits_{x \to a}` so that subscript indices stay directly beneath the limit operator rather than offset to the side.

---

### Authoring Checklist for QA

1. [ ] Is the question prompt or explanation written in a `|` block? If yes, verify single backslashes are used throughout (`\dfrac`, `\int`).
2. [ ] Are options wrapped in `"..."`? If yes, verify all backslashes are doubled (`"$\\dfrac{...}{...}$"`).
3. [ ] Are all tables placed inside multi-line block literals (`|`) with explicit alignment bars (`| :---: |`)?
4. [ ] Are 4+ digit numbers inside math mode formatted as `$1{,}000$` instead of `$1,000$`?
5. [ ] Do inline definite integrals specify `\displaystyle` and end with `\, dx`?