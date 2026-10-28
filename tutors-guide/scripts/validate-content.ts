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

function checkMathDelimiters(content: string, context: string, filePath: string) {
  if (!content) return;

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
      `Unbalanced display math delimiters ($$) in ${context}. Count: ${displayMatches}`
    );
  }

  // Strip display math blocks before counting inline math ($)
  const inlineOnly = sanitized.replace(/\$\$[\s\S]*?\$\$/g, "");
  const inlineMatches = (inlineOnly.match(/\$/g) || []).length;
  if (inlineMatches % 2 !== 0) {
    reportError(
      filePath,
      `Unbalanced inline math delimiters ($) in ${context}. Count: ${inlineMatches}`
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

function validateScoringConfig(metadata: any, metadataFile: string, sectionIds: Set<string>) {
  const scoring = metadata.scoring;
  if (!scoring) return;

  const validScaleTypes = [
    "SAT_ADAPTIVE",
    "ACT_CONCORDANCE",
    "AP_WEIGHTED",
    "GRE_SECTION",
  ];

  if (!scoring.scaleType || !validScaleTypes.includes(scoring.scaleType)) {
    reportError(
      metadataFile,
      `Invalid 'scoring.scaleType' "${scoring.scaleType}". Must be one of: ${validScaleTypes.join(", ")}`
    );
  }

  // 1. Validate AP_WEIGHTED rules
  if (scoring.scaleType === "AP_WEIGHTED") {
    const ap = scoring.apWeights;
    if (!ap) {
      reportError(
        metadataFile,
        `scoring.scaleType is 'AP_WEIGHTED' but 'scoring.apWeights' is missing.`
      );
    } else {
      // Validate section IDs
      for (const id of ap.mcSectionIds || []) {
        if (!sectionIds.has(id)) {
          reportError(
            metadataFile,
            `apWeights.mcSectionIds references unknown sectionId "${id}"`
          );
        }
      }
      for (const id of ap.frqSectionIds || []) {
        if (!sectionIds.has(id)) {
          reportError(
            metadataFile,
            `apWeights.frqSectionIds references unknown sectionId "${id}"`
          );
        }
      }

      // Validate multipliers
      if (typeof ap.mcMultiplier !== "number" || ap.mcMultiplier <= 0) {
        reportError(metadataFile, `apWeights.mcMultiplier must be a positive number.`);
      }
      if (typeof ap.frqMultiplier !== "number" || ap.frqMultiplier <= 0) {
        reportError(metadataFile, `apWeights.frqMultiplier must be a positive number.`);
      }

      // Validate cutoffs: 5 > 4 > 3 > 2 > 1
      const cutoffs = ap.gradeCutoffs;
      if (!cutoffs || typeof cutoffs !== "object") {
        reportError(metadataFile, `apWeights.gradeCutoffs object is required.`);
      } else {
        const c5 = Number(cutoffs["5"]);
        const c4 = Number(cutoffs["4"]);
        const c3 = Number(cutoffs["3"]);
        const c2 = Number(cutoffs["2"]);
        const c1 = Number(cutoffs["1"] ?? 0);

        if ([c5, c4, c3, c2].some(isNaN)) {
          reportError(metadataFile, `gradeCutoffs must define numeric thresholds for 5, 4, 3, and 2.`);
        } else if (!(c5 > c4 && c4 > c3 && c3 > c2 && c2 >= c1)) {
          reportError(
            metadataFile,
            `gradeCutoffs must be strictly descending: 5 (${c5}) > 4 (${c4}) > 3 (${c3}) > 2 (${c2}) >= 1 (${c1})`
          );
        }
      }
    }
  }

  // 2. Validate custom curves monotonicity (raw -> scaled)
  if (scoring.curves) {
    for (const [secId, curve] of Object.entries(scoring.curves as Record<string, Record<string, number>>)) {
      if (!sectionIds.has(secId)) {
        reportError(
          metadataFile,
          `scoring.curves references unknown sectionId "${secId}"`
        );
      }

      const rawKeys = Object.keys(curve)
        .map(Number)
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      if (rawKeys.length === 0) {
        reportError(metadataFile, `scoring.curves["${secId}"] has no valid numeric entries.`);
      }

      for (let i = 0; i < rawKeys.length - 1; i++) {
        const lowerRaw = rawKeys[i];
        const higherRaw = rawKeys[i + 1];
        if (curve[higherRaw] < curve[lowerRaw]) {
          reportError(
            metadataFile,
            `scoring.curves["${secId}"] has non-monotonic curve: raw ${higherRaw} (${curve[higherRaw]}) < raw ${lowerRaw} (${curve[lowerRaw]})`
          );
        }
      }
    }
  }
}

function validateAdaptiveStages(metadata: any, metadataFile: string, sectionIds: Set<string>) {
  if (!metadata.isAdaptive) return;

  if (!Array.isArray(metadata.stages) || metadata.stages.length === 0) {
    reportError(metadataFile, `isAdaptive is true but 'stages' array is missing or empty.`);
    return;
  }

  metadata.stages.forEach((stage: any, idx: number) => {
    const prefix = `stages[${idx}] (stageIndex: ${stage.stageIndex})`;
    if (!stage.sectionId || !sectionIds.has(stage.sectionId)) {
      reportError(metadataFile, `${prefix}: base sectionId "${stage.sectionId}" not found in sections manifest.`);
    }

    if (!stage.routing) {
      reportError(metadataFile, `${prefix}: missing 'routing' object.`);
    } else {
      if (typeof stage.routing.threshold !== "number" || stage.routing.threshold < 0) {
        reportError(metadataFile, `${prefix}: routing.threshold must be a non-negative number.`);
      }
      if (!stage.routing.onPass || !sectionIds.has(stage.routing.onPass)) {
        reportError(metadataFile, `${prefix}: routing.onPass "${stage.routing.onPass}" not found in sections.`);
      }
      if (!stage.routing.onFail || !sectionIds.has(stage.routing.onFail)) {
        reportError(metadataFile, `${prefix}: routing.onFail "${stage.routing.onFail}" not found in sections.`);
      }
    }
  });
}

function validateAll() {
  console.log("Validating markdown content, frontmatter, assets, scoring, and adaptive routing...\n");

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

      const sectionIds = new Set<string>(
        (metadata.sections || []).map((s: any) => s.id).filter(Boolean)
      );

      // Validate scoring configurations & adaptive routing graph
      validateScoringConfig(metadata, metadataFile, sectionIds);
      validateAdaptiveStages(metadata, metadataFile, sectionIds);

      // Validate individual sections
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
          const seenQuestionIds = new Set<string>();

          data.questions.forEach((q: any, idx: number) => {
            const qNum = q.questionNumber || idx + 1;
            const qCtx = `Question #${qNum} (id: ${q.id || "MISSING"})`;

            if (!q.id) {
              reportError(sectionFilePath, `${qCtx}: Missing question 'id'`);
            } else if (seenQuestionIds.has(q.id)) {
              reportError(sectionFilePath, `${qCtx}: Duplicate question ID '${q.id}'`);
            } else {
              seenQuestionIds.add(q.id);
            }

            if (!q.prompt) {
              reportError(sectionFilePath, `${qCtx}: Missing 'prompt'`);
            } else {
              checkMathDelimiters(q.prompt, `${qCtx} prompt`, sectionFilePath);
            }

            if (q.explanation) {
              checkMathDelimiters(q.explanation, `${qCtx} explanation`, sectionFilePath);
            }

            if (!q.correctAnswer) {
              reportError(sectionFilePath, `${qCtx}: Missing 'correctAnswer'`);
            }

            // Multiple-Choice Assertions
            if (q.questionType === "MC") {
              if (!Array.isArray(q.options) || q.options.length < 2) {
                reportError(sectionFilePath, `${qCtx}: MC questions must have at least 2 options`);
              } else {
                const optionIds = new Set<string>();
                for (const opt of q.options) {
                  if (!opt.id) {
                    reportError(sectionFilePath, `${qCtx}: An option is missing an 'id'`);
                  } else {
                    optionIds.add(String(opt.id).toUpperCase());
                  }
                  if (opt.text) {
                    checkMathDelimiters(opt.text, `${qCtx} option ${opt.id}`, sectionFilePath);
                  }
                }

                if (
                  q.correctAnswer &&
                  !optionIds.has(String(q.correctAnswer).trim().toUpperCase())
                ) {
                  reportError(
                    sectionFilePath,
                    `${qCtx}: correctAnswer "${q.correctAnswer}" does not match any option IDs: [${Array.from(optionIds).join(", ")}]`
                  );
                }
              }
            }
          });
        }

        // Validate markdown body (stimulus)
        checkMathDelimiters(content, "Passage stimulus body", sectionFilePath);
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
      `\x1b[32m[PASS]\x1b[0m All test manifests, frontmatter, LaTeX, assets, scoring, and adaptive routes validated successfully.\n`
    );
  }
}

validateAll();