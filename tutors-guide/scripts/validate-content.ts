/* eslint-disable @typescript-eslint/no-explicit-any */
// scripts/validate-content.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "tests");
const PUBLIC_DIR = path.join(process.cwd(), "public");

let errorsFound = 0;
let warningsFound = 0;

function reportError(file: string, message: string) {
  console.error(`\x1b[31m[FAIL]\x1b[0m ${file}: ${message}`);
  errorsFound++;
}

function reportWarning(file: string, message: string) {
  console.warn(`\x1b[33m[WARN]\x1b[0m ${file}: ${message}`);
  warningsFound++;
}

function checkMathDelimiters(content: string, context: string, filePath: string) {
  if (!content) return;

  // Strip code blocks, inline code spans, :::desmos JSON blocks, and escaped dollars (\$);
  const sanitized = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/:::desmos[\s\S]*?:::/g, "")
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

function checkCustomAuthoringBlocks(
  explanation: string,
  context: string,
  filePath: string
) {
  if (!explanation) return;

  // 1. Check balanced :::tabs, :::derivation, and :::desmos blocks
  const openContainerRegex = /^:::(tabs|derivation|desmos)\b/gm;
  const closeContainerRegex = /^:::\s*$/gm;

  const opens = (explanation.match(openContainerRegex) || []).length;
  const closes = (explanation.match(closeContainerRegex) || []).length;

  if (opens !== closes) {
    reportError(
      filePath,
      `Unbalanced custom container blocks (:::tabs / :::derivation / :::desmos) in ${context}: ${opens} opening tag(s) vs. ${closes} closing ':::' tag(s).`
    );
  }

  // 2. Enforce plain-text == step: headers (no inline/display LaTeX $ delimiters)
  const stepHeaderRegex = /^==\s*step:\s*(.+)$/gm;
  let stepMatch: RegExpExecArray | null;
  while ((stepMatch = stepHeaderRegex.exec(explanation)) !== null) {
    const headerTitle = stepMatch[1];
    if (headerTitle.includes("$")) {
      reportError(
        filePath,
        `LaTeX delimiter ($) detected in '== step:' header ("${headerTitle.trim()}") in ${context}. Step headers must be plain text.`
      );
    }
  }

  // 3. Validate JSON syntax and required fields inside every :::desmos block
  const desmosBlockRegex = /:::desmos\s*([\s\S]*?)\s*:::/g;
  let desmosMatch: RegExpExecArray | null;
  let blockIdx = 0;
  while ((desmosMatch = desmosBlockRegex.exec(explanation)) !== null) {
    blockIdx++;
    const rawJson = desmosMatch[1].trim();
    try {
      const parsed = JSON.parse(rawJson);
      if (!parsed.bounds || typeof parsed.bounds !== "object") {
        reportError(
          filePath,
          `:::desmos block #${blockIdx} in ${context} is missing a 'bounds' object.`
        );
      }
      if (!Array.isArray(parsed.expressions) || parsed.expressions.length === 0) {
        reportError(
          filePath,
          `:::desmos block #${blockIdx} in ${context} must contain a non-empty 'expressions' array.`
        );
      }
    } catch (err: any) {
      reportError(
        filePath,
        `Malformed JSON inside :::desmos block #${blockIdx} in ${context}: ${err?.message || "Invalid JSON"}`
      );
    }
  }

  // 4. Verify balanced inline semantic tokens ([[fade]], [[hl]], [[pivot]], [[ic]], [[dc]])
  for (const tag of ["fade", "hl", "pivot", "ic", "dc", "predict", "ans"]) {
    const openCount = (explanation.match(new RegExp(`\\[\\[${tag}\\]\\]`, "g")) || []).length;
    const closeCount = (explanation.match(new RegExp(`\\[\\[\\/${tag}\\]\\]`, "g")) || []).length;
    if (openCount !== closeCount) {
      reportError(
        filePath,
        `Unbalanced [[${tag}]]...[[/${tag}]] tags in ${context}: ${openCount} opening vs. ${closeCount} closing.`
      );
    }
  }
}

function checkImageReferences(
  markdown: string,
  context: string,
  category: string,
  testId: string,
  manifestBasePath: string | undefined,
  filePath: string
) {
  if (!markdown) return;

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
        `Asset not found in public directory (${context}): "${rawSrc}" -> expected at "${targetPublicPath}"`
      );
    }
  }
}

function validateMonotonicCurve(
  curve: Record<string, number>,
  label: string,
  metadataFile: string
) {
  if (!curve || typeof curve !== "object") {
    reportError(metadataFile, `${label} must be a numeric mapping object.`);
    return;
  }

  const keys = Object.keys(curve)
    .map(Number)
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);

  if (keys.length === 0) {
    reportError(metadataFile, `${label} has no valid numeric entries.`);
    return;
  }

  for (let i = 0; i < keys.length - 1; i++) {
    const lower = keys[i];
    const higher = keys[i + 1];
    if (curve[higher] < curve[lower]) {
      reportError(
        metadataFile,
        `${label} has non-monotonic curve: key ${higher} (${curve[higher]}) < key ${lower} (${curve[lower]})`
      );
    }
  }
}

function validateScoringConfig(
  metadata: any,
  metadataFile: string,
  sectionIds: Set<string>
) {
  const scoring = metadata.scoring;
  if (!scoring) return;

  const validScaleTypes = [
    "SAT_ADAPTIVE",
    "SAT_LINEAR",
    "ACT_CONCORDANCE",
    "AP_WEIGHTED",
    "GRE_SECTION",
    "ACADEMIC_MASTERY",
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

      if (typeof ap.mcMultiplier !== "number" || ap.mcMultiplier <= 0) {
        reportError(metadataFile, `apWeights.mcMultiplier must be a positive number.`);
      }
      if (typeof ap.frqMultiplier !== "number" || ap.frqMultiplier <= 0) {
        reportError(metadataFile, `apWeights.frqMultiplier must be a positive number.`);
      }

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
          reportError(
            metadataFile,
            `gradeCutoffs must define numeric thresholds for 5, 4, 3, and 2.`
          );
        } else if (!(c5 > c4 && c4 > c3 && c3 > c2 && c2 >= c1)) {
          reportError(
            metadataFile,
            `gradeCutoffs must be strictly descending: 5 (${c5}) > 4 (${c4}) > 3 (${c3}) > 2 (${c2}) >= 1 (${c1})`
          );
        }
      }
    }
  }

  // 2. Validate custom linear curves monotonicity (raw -> scaled)
  if (scoring.curves) {
    for (const [secId, curve] of Object.entries(
      scoring.curves as Record<string, Record<string, number>>
    )) {
      if (!sectionIds.has(secId)) {
        reportError(
          metadataFile,
          `scoring.curves references unknown sectionId "${secId}"`
        );
      }
      validateMonotonicCurve(curve, `scoring.curves["${secId}"]`, metadataFile);
    }
  }

  // 3. Validate adaptiveConfig overrides (difficultyWeights & domainCurves)
  if (scoring.adaptiveConfig) {
    const ac = scoring.adaptiveConfig;
    if (ac.difficultyWeights) {
      for (const role of ["routing", "hard", "easy"]) {
        const tierWeights = ac.difficultyWeights[role];
        if (!tierWeights) continue;
        for (const diff of ["Easy", "Medium", "Hard"]) {
          if (
            tierWeights[diff] !== undefined &&
            (typeof tierWeights[diff] !== "number" || tierWeights[diff] <= 0)
          ) {
            reportError(
              metadataFile,
              `adaptiveConfig.difficultyWeights.${role}.${diff} must be a positive number.`
            );
          }
        }
      }
    }

    if (ac.domainCurves) {
      for (const [domainKey, curveSet] of Object.entries(
        ac.domainCurves as Record<string, any>
      )) {
        if (!curveSet?.easy || !curveSet?.hard) {
          reportError(
            metadataFile,
            `adaptiveConfig.domainCurves["${domainKey}"] must define both 'easy' and 'hard' mappings.`
          );
        } else {
          validateMonotonicCurve(
            curveSet.easy,
            `adaptiveConfig.domainCurves["${domainKey}"].easy`,
            metadataFile
          );
          validateMonotonicCurve(
            curveSet.hard,
            `adaptiveConfig.domainCurves["${domainKey}"].hard`,
            metadataFile
          );
        }
      }
    }
  }
}

function validateAdaptiveStages(
  metadata: any,
  metadataFile: string,
  sectionIds: Set<string>,
  sectionQuestionCounts: Map<string, number>
) {
  if (!metadata.isAdaptive) return;

  if (!Array.isArray(metadata.stages) || metadata.stages.length === 0) {
    reportError(
      metadataFile,
      `isAdaptive is true but 'stages' array is missing or empty.`
    );
    return;
  }

  metadata.stages.forEach((stage: any, idx: number) => {
    const prefix = `stages[${idx}] (stageIndex: ${stage.stageIndex})`;
    if (!stage.sectionId || !sectionIds.has(stage.sectionId)) {
      reportError(
        metadataFile,
        `${prefix}: base sectionId "${stage.sectionId}" not found in sections manifest.`
      );
    }

    if (!stage.routing) {
      reportError(metadataFile, `${prefix}: missing 'routing' object.`);
    } else {
      if (typeof stage.routing.threshold !== "number" || stage.routing.threshold < 0) {
        reportError(
          metadataFile,
          `${prefix}: routing.threshold must be a non-negative number.`
        );
      } else {
        const baseQCount = sectionQuestionCounts.get(stage.sectionId);
        if (baseQCount !== undefined && stage.routing.threshold > baseQCount) {
          reportError(
            metadataFile,
            `${prefix}: routing.threshold (${stage.routing.threshold}) exceeds total questions (${baseQCount}) in "${stage.sectionId}".`
          );
        }
      }

      if (!stage.routing.onPass || !sectionIds.has(stage.routing.onPass)) {
        reportError(
          metadataFile,
          `${prefix}: routing.onPass "${stage.routing.onPass}" not found in sections.`
        );
      }
      if (!stage.routing.onFail || !sectionIds.has(stage.routing.onFail)) {
        reportError(
          metadataFile,
          `${prefix}: routing.onFail "${stage.routing.onFail}" not found in sections.`
        );
      }
    }
  });
}

function validateAll() {
  console.log(
    "Validating markdown content, frontmatter, LaTeX, Desmos blocks, inline tokens, assets, scoring, and adaptive routing...\n"
  );

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`Content directory not found at: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const validDifficulties = new Set(["Easy", "Medium", "Hard"]);
  const validQuestionTypes = new Set(["MC", "FR", "FRQ_HANDWRITTEN"]);
  const validStatuses = new Set(["draft", "published", "archived"]);

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

      if (metadata.status !== undefined && !validStatuses.has(String(metadata.status))) {
        reportError(
          metadataFile,
          `Invalid 'status' "${metadata.status}". Must be one of: draft, published, archived.`
        );
      }

      const sectionIds = new Set<string>(
        (metadata.sections || []).map((s: any) => s.id).filter(Boolean)
      );
      const sectionQuestionCounts = new Map<string, number>();

      // Validate scoring configurations
      validateScoringConfig(metadata, metadataFile, sectionIds);

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
        } else if (data.sectionId !== section.id) {
          reportError(
            sectionFilePath,
            `Frontmatter sectionId "${data.sectionId}" does not match manifest section id "${section.id}"`
          );
        }

        if (!data.questions || !Array.isArray(data.questions)) {
          reportError(sectionFilePath, "Frontmatter must contain a 'questions' array");
        } else {
          sectionQuestionCounts.set(section.id, data.questions.length);
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

            if (!q.questionType || !validQuestionTypes.has(q.questionType)) {
              reportError(
                sectionFilePath,
                `${qCtx}: Invalid or missing questionType "${q.questionType}". Must be MC, FR, or FRQ_HANDWRITTEN.`
              );
            }

            // Validate difficulty tag (critical for adaptive psychometric weighting)
            if (!q.difficulty) {
              if (metadata.isAdaptive) {
                reportError(
                  sectionFilePath,
                  `${qCtx}: Missing 'difficulty' ("Easy" | "Medium" | "Hard"), which is required for adaptive scoring.`
                );
              } else {
                reportWarning(sectionFilePath, `${qCtx}: Missing 'difficulty' tag.`);
              }
            } else if (!validDifficulties.has(String(q.difficulty))) {
              reportError(
                sectionFilePath,
                `${qCtx}: Invalid difficulty "${q.difficulty}". Must be exact case: "Easy", "Medium", or "Hard".`
              );
            }

            // Validate per-question stimulus / passage (math delimiters + asset paths)
            const qStimulus = q.stimulus ?? q.passage;
            if (qStimulus) {
              checkMathDelimiters(qStimulus, `${qCtx} stimulus`, sectionFilePath);
              checkImageReferences(
                qStimulus,
                `${qCtx} stimulus`,
                category,
                testId,
                metadata.assetBasePath,
                sectionFilePath
              );
            }

            // Validate prompt
            if (!q.prompt) {
              reportError(sectionFilePath, `${qCtx}: Missing 'prompt'`);
            } else {
              checkMathDelimiters(q.prompt, `${qCtx} prompt`, sectionFilePath);
              checkImageReferences(
                q.prompt,
                `${qCtx} prompt`,
                category,
                testId,
                metadata.assetBasePath,
                sectionFilePath
              );
            }

            // Validate explanation (math delimiters, custom ::: blocks, Desmos JSON, inline tokens, images)
            if (q.explanation) {
              checkMathDelimiters(q.explanation, `${qCtx} explanation`, sectionFilePath);
              checkCustomAuthoringBlocks(q.explanation, `${qCtx} explanation`, sectionFilePath);
              checkImageReferences(
                q.explanation,
                `${qCtx} explanation`,
                category,
                testId,
                metadata.assetBasePath,
                sectionFilePath
              );
            }

            if (!q.correctAnswer && q.questionType !== "FRQ_HANDWRITTEN") {
              reportError(sectionFilePath, `${qCtx}: Missing 'correctAnswer'`);
            }

            // Multiple-Choice Assertions
            if (q.questionType === "MC") {
              if (!Array.isArray(q.options) || q.options.length < 2) {
                reportError(
                  sectionFilePath,
                  `${qCtx}: MC questions must have at least 2 options`
                );
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
                    checkImageReferences(
                      opt.text,
                      `${qCtx} option ${opt.id}`,
                      category,
                      testId,
                      metadata.assetBasePath,
                      sectionFilePath
                    );
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
            } else if (q.questionType === "FR" && Array.isArray(q.options) && q.options.length > 0) {
              reportError(
                sectionFilePath,
                `${qCtx}: FR (Student-Produced Response) questions must not define an 'options' array.`
              );
            }
          });
        }

        // Validate section-level markdown body (if present)
        checkMathDelimiters(content, "Section markdown body", sectionFilePath);
        checkImageReferences(
          content,
          "Section markdown body",
          category,
          testId,
          metadata.assetBasePath,
          sectionFilePath
        );
      }

      // Validate adaptive routing graph after section question counts are known
      validateAdaptiveStages(
        metadata,
        metadataFile,
        sectionIds,
        sectionQuestionCounts
      );
    }
  }

  if (warningsFound > 0) {
    console.warn(`\nCompleted with ${warningsFound} warning(s).`);
  }

  if (errorsFound > 0) {
    console.error(`\nValidation failed with ${errorsFound} error(s).`);
    process.exit(1);
  } else {
    console.log(
      `\x1b[32m[PASS]\x1b[0m All test manifests, frontmatter, LaTeX, Desmos blocks, inline tokens, assets, scoring, and adaptive routes validated successfully.\n`
    );
  }
}

validateAll();