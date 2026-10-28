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