/* eslint-disable @typescript-eslint/no-explicit-any */
// scripts/validate-content.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "tests");
const PUBLIC_DIR = path.join(process.cwd(), "public");

let errorsFound = 0;

function reportError(file: string, message: string) {
  console.error(`\x1b[31m[FAIL]\x1b[0m ${file}: ${message}`);
  errorsFound++;
}

function checkMathDelimiters(content: string, filePath: string) {
  // Strip code blocks, inline code spans, and escaped dollars (\$);
  const sanitized = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/\\\$/g, "");

  // Check display math ($$)
  const displayMatches = (sanitized.match(/\$\$/g) || []).length;
  if (displayMatches % 2 !== 0) {
    reportError(
      filePath,
      `Unbalanced display math delimiters ($$). Count: ${displayMatches}`
    );
  }

  // Strip display math blocks before counting inline math ($)
  const inlineOnly = sanitized.replace(/\$\$[\s\S]*?\$\$/g, "");
  const inlineMatches = (inlineOnly.match(/\$/g) || []).length;
  if (inlineMatches % 2 !== 0) {
    reportError(
      filePath,
      `Unbalanced inline math delimiters ($). Count: ${inlineMatches}`
    );
  }
}

function checkImageReferences(
  markdown: string,
  category: string,
  testId: string,
  manifestBasePath: string | undefined,
  filePath: string
) {
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  let match: RegExpExecArray | null;

  while ((match = imageRegex.exec(markdown)) !== null) {
    const rawSrc = match[1].split(" ")[0].trim();
    if (rawSrc.startsWith("http://") || rawSrc.startsWith("https://")) continue;

    let targetPublicPath: string;

    if (rawSrc.startsWith("/")) {
      targetPublicPath = path.join(PUBLIC_DIR, rawSrc);
    } else {
      const cleanFile = rawSrc
        .replace(/^(\.\/|\/)?(assets\/)?/, "")
        .replace(/^\.\//, "");

      const base =
        manifestBasePath ||
        `/content/tests/${category.toLowerCase()}/${testId}/assets`;

      targetPublicPath = path.join(
        PUBLIC_DIR,
        base.replace(/\/$/, ""),
        cleanFile
      );
    }

    if (!fs.existsSync(targetPublicPath)) {
      reportError(
        filePath,
        `Asset not found in public directory: "${rawSrc}" -> expected at "${targetPublicPath}"`
      );
    }
  }
}

function validateAll() {
  console.log("Validating markdown content, frontmatter, and assets...\n");

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`Content directory not found at: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const categories = fs.readdirSync(CONTENT_DIR);

  for (const category of categories) {
    const catPath = path.join(CONTENT_DIR, category);
    if (!fs.statSync(catPath).isDirectory()) continue;

    const tests = fs.readdirSync(catPath);
    for (const testId of tests) {
      const testPath = path.join(catPath, testId);
      if (!fs.statSync(testPath).isDirectory()) continue;

      const metadataFile = path.join(testPath, "metadata.json");
      if (!fs.existsSync(metadataFile)) {
        reportError(metadataFile, "Missing metadata.json");
        continue;
      }

      let metadata: any;
      try {
        metadata = JSON.parse(fs.readFileSync(metadataFile, "utf-8"));
      } catch {
        reportError(metadataFile, "Malformed JSON syntax in metadata.json");
        continue;
      }

      for (const section of metadata.sections || []) {
        const sectionFilePath = path.join(testPath, section.file);
        if (!fs.existsSync(sectionFilePath)) {
          reportError(
            sectionFilePath,
            `Referenced file does not exist: ${section.file}`
          );
          continue;
        }

        const rawContent = fs.readFileSync(sectionFilePath, "utf-8");
        const { data, content } = matter(rawContent);

        if (!data.sectionId) {
          reportError(sectionFilePath, "Missing 'sectionId' in frontmatter");
        }
        if (!data.questions || !Array.isArray(data.questions)) {
          reportError(sectionFilePath, "Frontmatter must contain a 'questions' array");
        } else {
          for (const q of data.questions) {
            if (!q.id) reportError(sectionFilePath, "A question is missing an 'id'");
            if (!q.correctAnswer) {
              reportError(sectionFilePath, `Question ${q.id} missing 'correctAnswer'`);
            }
          }
        }

        checkMathDelimiters(content, sectionFilePath);
        checkImageReferences(
          content,
          category,
          testId,
          metadata.assetBasePath,
          sectionFilePath
        );
      }
    }
  }

  if (errorsFound > 0) {
    console.error(`\nValidation failed with ${errorsFound} error(s).`);
    process.exit(1);
  } else {
    console.log(
      `\x1b[32m[PASS]\x1b[0m All test manifests, frontmatter, LaTeX, and assets validated successfully.\n`
    );
  }
}

validateAll();