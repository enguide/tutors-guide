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
  /** Unique composite key e.g. "ap-calc-ab-t1-s2a::ap-calc-frq-q1::p1" */
  sheetKey: string;
  sectionId: string;
  sectionTitle?: string;
  questionId: string;
  questionNumber: number;
  pageNumber: number;
  parts: ManifestSubPart[];
}

export interface ManifestQuestion {
  sectionId: string;
  sectionTitle?: string;
  questionId: string;
  questionNumber: number;
  totalSheets: number;
  subParts: ManifestSubPart[];
  sheets: ManifestSheet[];
}

export interface SectionFrqManifest {
  testId: string;
  /** Present when scoped to a single section (e.g. sandbox); undefined when test-wide */
  sectionId?: string;
  totalQuestions: number;
  totalSheets: number;
  questions: ManifestQuestion[];
  sheets: ManifestSheet[];
}

export interface DecodedSheetQr {
  formId?: string;
  examCode?: string;
  sectionId?: string;
  questionId?: string;
  questionNumber: number;
  pageNumber: number;
  parts: string[];
}

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
  const markerRegex = /(?:^|\n|\s)\*{0,2}\(([a-fA-F])\)\*{0,2}/g;
  let match: RegExpExecArray | null;
  while ((match = markerRegex.exec(prompt)) !== null) {
    detectedLabels.add(match[1].toUpperCase());
  }

  if (detectedLabels.size === 0) {
    return [{ label: "A", points: 1.0 }];
  }

  return Array.from(detectedLabels)
    .sort()
    .map((label) => ({ label, points: 1.0 }));
}

function buildManifestQuestionsForSection(
  sectionId: string,
  sectionTitle: string | undefined,
  questions: QuestionFrontmatter[]
): { manifestQuestions: ManifestQuestion[]; allSheets: ManifestSheet[] } {
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
        sheetKey: `${sectionId}::${q.id}::p${pageNum}`,
        sectionId,
        sectionTitle,
        questionId: q.id,
        questionNumber: q.questionNumber,
        pageNumber: pageNum,
        parts: pageParts,
      };
      sheets.push(sheet);
      allSheets.push(sheet);
    }

    manifestQuestions.push({
      sectionId,
      sectionTitle,
      questionId: q.id,
      questionNumber: q.questionNumber,
      totalSheets,
      subParts,
      sheets,
    });
  }

  return { manifestQuestions, allSheets };
}

/**
 * Builds a single-section FRQ manifest (used by QuestionOptions & sandbox).
 */
export function buildSectionFrqManifest(
  testId: string,
  sectionId: string,
  questions: QuestionFrontmatter[],
  sectionTitle?: string
): SectionFrqManifest {
  const { manifestQuestions, allSheets } = buildManifestQuestionsForSection(
    sectionId,
    sectionTitle,
    questions
  );

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
 * Builds a unified test-wide FRQ manifest across ALL sections containing handwritten FRQs.
 */
export function buildTestFrqManifest(
  testId: string,
  sections: Array<{
    sectionId: string;
    sectionTitle?: string;
    questions: QuestionFrontmatter[];
  }>
): SectionFrqManifest {
  const manifestQuestions: ManifestQuestion[] = [];
  const allSheets: ManifestSheet[] = [];

  for (const sec of sections) {
    const built = buildManifestQuestionsForSection(
      sec.sectionId,
      sec.sectionTitle,
      sec.questions
    );
    manifestQuestions.push(...built.manifestQuestions);
    allSheets.push(...built.allSheets);
  }

  return {
    testId,
    totalQuestions: manifestQuestions.length,
    totalSheets: allSheets.length,
    questions: manifestQuestions,
    sheets: allSheets,
  };
}

/**
 * Parses both self-describing QR codes:
 *   "FORM:ap-calc-ab-practice-1;SEC:ap-calc-ab-t1-s2a;QID:ap-calc-frq-q1;Q:1;PG:1;PARTS:AB"
 * and legacy QR codes:
 *   "EXAM:AB_2026;Q:1;PG:4;PARTS:AB"
 */
export function parseSelfDescribingSheetQr(rawText: string): DecodedSheetQr | null {
  try {
    const segments = rawText.split(";").reduce((acc, segment) => {
      const colonIdx = segment.indexOf(":");
      if (colonIdx > 0) {
        const key = segment.slice(0, colonIdx).trim();
        const val = segment.slice(colonIdx + 1).trim();
        if (key && val) acc[key] = val;
      }
      return acc;
    }, {} as Record<string, string>);

    const rawQ = segments.Q;
    const rawQid = segments.I || segments.QID;
    if (!rawQ && !rawQid) return null;

    const qNum = rawQ ? parseInt(rawQ, 10) : NaN;
    const pNum = parseInt(segments.P || segments.PAGE || segments.PG || "1", 10);
    const rawParts = segments.R || segments.PARTS;
    const parts = rawParts ? rawParts.split("") : [];

    return {
      formId: segments.F || segments.FORM,
      examCode: segments.EXAM,
      sectionId: segments.S || segments.SEC,
      questionId: rawQid,
      questionNumber: Number.isFinite(qNum) ? qNum : 0,
      pageNumber: Number.isFinite(pNum) ? pNum : 1,
      parts,
    };
  } catch {
    return null;
  }
}

export type SheetQrMatchResult =
  | { status: "MATCHED"; question: ManifestQuestion; sheet: ManifestSheet }
  | { status: "WRONG_FORM"; expectedForm: string; actualForm: string }
  | { status: "NOT_IN_TEST"; reason: string };

/**
 * Validates and resolves a decoded QR payload against the active test/section manifest.
 */
export function matchQrAgainstManifest(
  manifest: SectionFrqManifest,
  qr: DecodedSheetQr
): SheetQrMatchResult {
  // 1. Strict form check when FORM is present in QR
  if (qr.formId && qr.formId !== manifest.testId) {
    return {
      status: "WRONG_FORM",
      expectedForm: manifest.testId,
      actualForm: qr.formId,
    };
  }

  // 2. Locate matching question by QID (+ optional SEC) or fallback to questionNumber
  let question: ManifestQuestion | undefined;
  if (qr.questionId) {
    question = manifest.questions.find(
      (q) =>
        q.questionId === qr.questionId &&
        (!qr.sectionId || q.sectionId === qr.sectionId)
    );
  }
  if (!question && qr.questionNumber > 0) {
    question = manifest.questions.find(
      (q) =>
        q.questionNumber === qr.questionNumber &&
        (!qr.sectionId || q.sectionId === qr.sectionId)
    );
  }

  if (!question) {
    return {
      status: "NOT_IN_TEST",
      reason: qr.questionNumber
        ? `Question ${qr.questionNumber} does not belong to this exam.`
        : "This response sheet does not belong to this exam.",
    };
  }

  // 3. Resolve relative sheet page (handles both 1/2 and sequential booklet page numbers)
  let relativePage = qr.pageNumber;
  if (qr.pageNumber > question.totalSheets) {
    relativePage = qr.pageNumber % 2 === 1 ? 1 : 2;
  }

  const sheet =
    question.sheets.find((s) => s.pageNumber === relativePage) || question.sheets[0];

  if (!sheet) {
    return {
      status: "NOT_IN_TEST",
      reason: `Sheet ${qr.pageNumber} not found for Question ${question.questionNumber}.`,
    };
  }

  return { status: "MATCHED", question, sheet };
}