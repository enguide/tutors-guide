// lib/frq/manifest.ts
import { FrqSubPartDefinition, QuestionFrontmatter } from "@/types/content";

export interface ManifestSubPart {
  label: string;       // "A", "B", "C", "D"
  pointsPossible: number;
  pageNumber: number;  // 1-indexed sheet within this question (1 = A/B, 2 = C/D)
  slotIndex: 0 | 1;    // 0 = top box, 1 = bottom box
  rubricNotes?: string;
}

export interface ManifestSheet {
  /** Unique composite key e.g. "ap-calc-frq-q1::p1" */
  sheetKey: string;
  questionId: string;
  questionNumber: number;
  pageNumber: number;
  parts: ManifestSubPart[];
}

export interface ManifestQuestion {
  questionId: string;
  questionNumber: number;
  totalSheets: number;
  subParts: ManifestSubPart[];
  sheets: ManifestSheet[];
}

export interface SectionFrqManifest {
  testId: string;
  sectionId: string;
  totalQuestions: number;
  totalSheets: number;
  questions: ManifestQuestion[];
  sheets: ManifestSheet[];
}

/**
 * Extracts sub-part definitions either from explicit frontmatter `subParts`
 * or by parsing bold/parenthesized markers like **(a)**, (a), **Part A** from the prompt.
 */
export function resolveQuestionSubParts(question: QuestionFrontmatter): FrqSubPartDefinition[] {
  if (Array.isArray(question.subParts) && question.subParts.length > 0) {
    return question.subParts.map((sp) => ({
      label: sp.label.trim().toUpperCase(),
      points: typeof sp.points === "number" && sp.points > 0 ? sp.points : 1.0,
      rubricNotes: sp.rubricNotes,
    }));
  }

  const prompt = question.prompt || "";
  const detectedLabels = new Set<string>();

  // Match patterns like **(a)**, **(b)**, (a), (b), or **Part A** at line starts or after whitespace
  const markerRegex = /(?:^|\n|\s)\*{0,2}\(([a-fA-F])\)\*{0,2}/g;
  let match: RegExpExecArray | null;
  while ((match = markerRegex.exec(prompt)) !== null) {
    detectedLabels.add(match[1].toUpperCase());
  }

  if (detectedLabels.size === 0) {
    // Default fallback if prompt has no explicit sub-part markers (single-part FRQ)
    return [{ label: "A", points: 1.0 }];
  }

  // Sort alphabetically: A, B, C, D...
  const sorted = Array.from(detectedLabels).sort();
  return sorted.map((label) => ({
    label,
    points: 1.0,
  }));
}

/**
 * Builds the authoritative SectionFrqManifest from section questions.
 * Used across desktop modal, mobile scanner, QR matcher, and server cropper.
 */
export function buildSectionFrqManifest(
  testId: string,
  sectionId: string,
  questions: QuestionFrontmatter[]
): SectionFrqManifest {
  const handwrittenQuestions = questions
    .filter((q) => q.questionType === "FRQ_HANDWRITTEN")
    .sort((a, b) => a.questionNumber - b.questionNumber);

  const manifestQuestions: ManifestQuestion[] = [];
  const allSheets: ManifestSheet[] = [];

  for (const q of handwrittenQuestions) {
    const rawParts = resolveQuestionSubParts(q);

    const subParts: ManifestSubPart[] = rawParts.map((part, idx) => ({
      label: part.label,
      pointsPossible: part.points ?? 1.0,
      pageNumber: Math.floor(idx / 2) + 1,
      slotIndex: (idx % 2) as 0 | 1,
      rubricNotes: part.rubricNotes,
    }));

    const totalSheets = Math.max(1, Math.ceil(subParts.length / 2));
    const sheets: ManifestSheet[] = [];

    for (let pageNum = 1; pageNum <= totalSheets; pageNum++) {
      const pageParts = subParts.filter((sp) => sp.pageNumber === pageNum);
      const sheet: ManifestSheet = {
        sheetKey: `${q.id}::p${pageNum}`,
        questionId: q.id,
        questionNumber: q.questionNumber,
        pageNumber: pageNum,
        parts: pageParts,
      };
      sheets.push(sheet);
      allSheets.push(sheet);
    }

    manifestQuestions.push({
      questionId: q.id,
      questionNumber: q.questionNumber,
      totalSheets,
      subParts,
      sheets,
    });
  }

  return {
    testId,
    sectionId,
    totalQuestions: manifestQuestions.length,
    totalSheets: allSheets.length,
    questions: manifestQuestions,
    sheets: allSheets,
  };
}

/**
 * Resolves a decoded QR code (e.g., Q:2, PG:4 or PAGE:2) against the manifest.
 */
export function lookupSheetInManifest(
  manifest: SectionFrqManifest,
  questionNumber: number,
  rawPageNumber: number
): { question: ManifestQuestion; sheet: ManifestSheet } | null {
  const question = manifest.questions.find((q) => q.questionNumber === questionNumber);
  if (!question) return null;

  // Handle both relative page numbers (1, 2) and sequential booklet page numbers (1..12)
  let relativePage = rawPageNumber;
  if (rawPageNumber > question.totalSheets) {
    // In APCalculusABFRQPDF.tex, sequential pages are odd for Sheet 1 (1,3,5,7,9,11)
    // and even for Sheet 2 (2,4,6,8,10,12).
    relativePage = rawPageNumber % 2 === 1 ? 1 : 2;
  }

  const sheet =
    question.sheets.find((s) => s.pageNumber === relativePage) || question.sheets[0];

  if (!sheet) return null;
  return { question, sheet };
}