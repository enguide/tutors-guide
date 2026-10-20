To incorporate `validate-content.ts` cleanly into your content production pipeline, treat validation not as a manual chore, but as an automated gatekeeper across four stages: **Authoring**, **Local Pre-Commit**, **CI/CD Pull Request Checks**, and **Build-Time Verification**.

---

### 1. Author-Time CLI Feedback (Fast Feedback Loop)

Content authors writing `.md` test sections in VS Code or Cursor need fast, single-command feedback without having to run a full build.

In `package.json`, expose dedicated audit scripts:

```json
{
  "scripts": {
    "validate:content": "tsx scripts/validate-content.ts",
    "validate:content:watch": "tsx watch scripts/validate-content.ts"
  }
}

```

* **`npm run validate:content`**: Runs the complete suite across all exams and returns terminal feedback in under 200ms.


* **`npm run validate:content:watch`**: Automatically re-runs validation whenever any `.md`, `metadata.json`, or asset file under `content/tests/` is saved.



---

### 2. Local Pre-Commit Gatekeeper (Husky + lint-staged)

Prevent broken markdown, missing SVG/WebP assets, or unbalanced KaTeX delimiters from ever being committed to your Git history.

#### A. Install tools

```bash
npm install -D husky lint-staged
npx husky init

```

#### B. Configure `lint-staged` in `package.json`

Whenever a staged file inside `content/tests/` changes, run validation automatically before allowing the commit:

```json
{
  "lint-staged": {
    "content/tests/**/*.{md,json}": [
      "npm run validate:content"
    ]
  }
}

```

#### C. Hook into Git Pre-Commit (`.husky/pre-commit`)

```bash
#!/bin/sh
npx lint-staged

```

If an author mistypes a multiple-choice key or forgets to export an SVG diagram into `public/`, Git blocks the commit and prints the exact file path and question number.

---

### 3. CI/CD Pull Request Gate (GitHub Actions)

When content writers, tutors, or curriculum developers open Pull Requests with new test material, automated CI asserts 100% schema compliance before merging.

Create `.github/workflows/content-audit.yml`:

```yaml
name: Content & Asset Integrity Audit

on:
  pull_request:
    paths:
      - 'content/tests/**'
      - 'public/content/tests/**'
      - 'scripts/validate-content.ts'
  push:
    branches:
      - main
    paths:
      - 'content/tests/**'
      - 'public/content/tests/**'

jobs:
  audit-content:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Content Integrity Audit
        run: npm run validate:content

```

Any PR containing unmatched LaTeX math delimiters, duplicate question IDs, or missing stimuli images fails CI immediately, preventing production regression.

---

### 4. Zero-Downtime Deployment Gate (`prebuild`)

To guarantee your zero-downtime deployment promise (Approach A in your architectural guidelines), make content validation a mandatory build prerequisite:

In `package.json`:

```json
{
  "scripts": {
    "validate:content": "tsx scripts/validate-content.ts",
    "prebuild": "npm run validate:content",
    "build": "next build"
  }
}

```

Next.js automatically invokes `prebuild` prior to running `next build`. If an invalid file slipped through, the container/Vercel build aborts before routing live student traffic to bad content.

---

### 5. Content Authoring Checklist (For Curriculum Creators)

Provide your content authors with this standard workflow:

1. **Create Section Folder:**
```text
content/tests/sat/sat-practice-2/
├── metadata.json
├── section-1-reading.md
├── section-2-math.md
└── assets/
    └── circle-diagram.svg

```


2. **Copy Static Assets:** Ensure all vector diagrams and charts are co-located in `assets/` and mirrored to `public/content/tests/...`.


3. **Verify:** Run `npm run validate:content` in the terminal.


4. **Commit & Push:** Once `[PASS]` is reported, open a PR.