// scripts/simulateSatScoring.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { TestMetadata, QuestionFrontmatter } from "../types/content";
import { evaluateNextExamRoute } from "../lib/adaptive/branchingController";
import { synthesizeExamComposite } from "../lib/scoring/scoringEngine";
import { ItemScoringRecord, normalizeQuestionDifficulty } from "../lib/scoring/adaptiveScorer";

/**
 * 3PL IRT Item Characteristic Curve:
 * P(correct | theta) = c + (1 - c) / (1 + exp(-1.7 * a * (theta - b)))
 */
function simulateItemProbability(
  theta: number,
  difficulty: string | undefined,
  moduleRole: "routing" | "easy" | "hard",
  isMultipleChoice: boolean
): number {
  const diff = normalizeQuestionDifficulty(difficulty);

  // Item difficulty parameter (b) calibrated by module tier and item tag
  const bTable: Record<"routing" | "easy" | "hard", Record<"Easy" | "Medium" | "Hard", number>> = {
    routing: { Easy: -1.1, Medium: 0.0, Hard: 1.1 },
    easy:    { Easy: -1.6, Medium: -0.7, Hard: 0.2 },
    hard:    { Easy: 0.1,  Medium: 1.0,  Hard: 1.9 },
  };

  const b = bTable[moduleRole][diff];
  const a = diff === "Hard" ? 1.25 : diff === "Medium" ? 1.1 : 0.95; // discrimination
  const c = isMultipleChoice ? 0.22 : 0.02; // pseudo-guessing parameter (0.25 for 4-option MC)

  return c + (1 - c) / (1 + Math.exp(-1.7 * a * (theta - b)));
}

function loadTestBank(testDir: string) {
  const metadata: TestMetadata = JSON.parse(
    fs.readFileSync(path.join(testDir, "metadata.json"), "utf8")
  );
  const sections = new Map<string, QuestionFrontmatter[]>();

  for (const sec of metadata.sections) {
    const rawMd = fs.readFileSync(path.join(testDir, sec.file), "utf8");
    const parsed = matter(rawMd);
    sections.set(sec.id, parsed.data.questions as QuestionFrontmatter[]);
  }

  return { metadata, sections };
}

function runSimulation(numStudents = 10_000) {
  const testDir = path.join(
    process.cwd(),
    "content/tests/sat/sat-diagnostic-adaptive-1"
  );
  const { metadata, sections } = loadTestBank(testDir);

  let rwHardCount = 0;
  let mathHardCount = 0;
  let rwEasyMax = 200;
  let rwHardMin = 800;
  let mathEasyMax = 200;
  let mathHardMin = 800;

  const composites: number[] = [];
  const buckets: Record<string, number> = {
    "400-590": 0,
    "600-790": 0,
    "800-990": 0,
    "1000-1190": 0,
    "1200-1390": 0,
    "1400-1600": 0,
  };

  for (let i = 0; i < numStudents; i++) {
    // Draw student latent ability theta from standard normal N(0, 1) via Box-Muller
    const u1 = Math.max(1e-7, Math.random());
    const u2 = Math.random();
    const theta = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    const submittedResults: {
      sectionId: string;
      numCorrect: number;
      totalQuestions: number;
      rawScore: number;
    }[] = [];
    const itemRecordsBySection = new Map<string, ItemScoringRecord[]>();
    const submittedIds: string[] = [];

    const simulateSection = (secId: string, role: "routing" | "easy" | "hard") => {
      const qs = sections.get(secId)!;
      let correct = 0;
      const records: ItemScoringRecord[] = [];

      for (const q of qs) {
        const p = simulateItemProbability(
          theta,
          q.difficulty,
          role,
          q.questionType === "MC"
        );
        const isCorrect = Math.random() < p;
        if (isCorrect) correct++;
        records.push({
          questionId: q.id,
          sectionId: secId,
          isCorrect,
          difficulty: q.difficulty,
          domain: q.domain,
        });
      }

      submittedIds.push(secId);
      submittedResults.push({
        sectionId: secId,
        numCorrect: correct,
        totalQuestions: qs.length,
        rawScore: correct,
      });
      itemRecordsBySection.set(secId, records);
      return correct;
    };

    // Stage 1: RW M1 -> Branch -> RW M2
    const rw1Raw = simulateSection("sat-t1-rw1", "routing");
    const rwRoute = evaluateNextExamRoute(metadata, "sat-t1-rw1", rw1Raw, submittedIds);
    simulateSection(rwRoute.nextSectionId!, rwRoute.tierSelected!);

    // Stage 2: Math M1 -> Branch -> Math M2
    const m1Raw = simulateSection("sat-t1-m1", "routing");
    const mRoute = evaluateNextExamRoute(metadata, "sat-t1-m1", m1Raw, submittedIds);
    simulateSection(mRoute.nextSectionId!, mRoute.tierSelected!);

    const synthesis = synthesizeExamComposite(
      metadata,
      submittedResults,
      itemRecordsBySection
    );

    const rwScore = synthesis.scaledSectionScores["sat-t1-rw1"];
    const mathScore = synthesis.scaledSectionScores["sat-t1-m1"];

    if (rwRoute.tierSelected === "hard") {
      rwHardCount++;
      rwHardMin = Math.min(rwHardMin, rwScore);
    } else {
      rwEasyMax = Math.max(rwEasyMax, rwScore);
    }

    if (mRoute.tierSelected === "hard") {
      mathHardCount++;
      mathHardMin = Math.min(mathHardMin, mathScore);
    } else {
      mathEasyMax = Math.max(mathEasyMax, mathScore);
    }

    const c = synthesis.compositeScore;
    composites.push(c);
    if (c < 600) buckets["400-590"]++;
    else if (c < 800) buckets["600-790"]++;
    else if (c < 1000) buckets["800-990"]++;
    else if (c < 1200) buckets["1000-1190"]++;
    else if (c < 1400) buckets["1200-1390"]++;
    else buckets["1400-1600"]++;
  }

  composites.sort((a, b) => a - b);
  const mean = Math.round(composites.reduce((a, b) => a + b, 0) / numStudents);
  const median = composites[Math.floor(numStudents / 2)];

  console.log(`\n=== dSAT Monte Carlo Calibration Report (${numStudents.toLocaleString()} Virtual Students) ===`);
  console.log(`Mean Composite: ${mean} | Median Composite: ${median} (Target national benchmark: ~1020–1060)`);
  console.log(`RW Routing Split:   ${((rwHardCount / numStudents) * 100).toFixed(1)}% M2-Hard | Overlap Band: [${rwHardMin}, ${rwEasyMax}]`);
  console.log(`Math Routing Split: ${((mathHardCount / numStudents) * 100).toFixed(1)}% M2-Hard | Overlap Band: [${mathHardMin}, ${mathEasyMax}]`);
  console.log("\nComposite Score Distribution:");
  for (const [band, count] of Object.entries(buckets)) {
    const pct = ((count / numStudents) * 100).toFixed(1).padStart(5);
    const bar = "█".repeat(Math.round((count / numStudents) * 40));
    console.log(`  ${band.padEnd(10)} | ${pct}% | ${bar}`);
  }
}

runSimulation(10_000);