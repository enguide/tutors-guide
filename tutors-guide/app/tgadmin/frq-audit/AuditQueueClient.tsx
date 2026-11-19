// app/tgadmin/frq-audit/AuditQueueClient.tsx
"use client";

import React, { useState, useMemo } from "react";
import { resolveCropAudit } from "@/actions/frqAudit";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  CheckSquare,
  Square,
  Award,
  Ban,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface RubricCriterionItem {
  id?: string;
  criterion: string;
  earned: boolean;
  points: number;
  pointsPossible?: number;
  reason?: string;
  expectedLatex?: string;
  numericTolerance?: number;
  requiredUnits?: string;
  requiresJustification?: boolean;
  allowConsequentialCarryover?: boolean;
  aiEarned?: boolean;
}

interface StoredRubricPayload {
  stage?: string;
  questionNumber?: number;
  questionPrompt?: string;
  subPartNotes?: string;
  aiSuggestedPoints?: number | null;
  criteria?: RubricCriterionItem[];
}

interface AuditCrop {
  id: string;
  subPartLabel: string;
  cropUrl: string;
  transcription: string | null;
  pointsAwarded: number | null;
  pointsPossible: number;
  auditReason: string | null;
  rubricBreakdown?: unknown;
  frqSubmission: {
    questionId: string;
    pageNumber?: number;
    fullSheetUrl?: string | null;
    deskewedSheetUrl?: string | null;
    profile: {
      firstName: string;
      lastName: string;
      email: string;
    };
    test: {
      title: string;
    };
  };
}

function parseStoredRubric(raw: unknown): {
  meta: StoredRubricPayload;
  criteria: RubricCriterionItem[];
} {
  if (Array.isArray(raw)) {
    return {
      meta: {},
      criteria: (raw as RubricCriterionItem[]).map((c) => ({
        ...c,
        pointsPossible: c.pointsPossible ?? (c.points > 0 ? c.points : 1),
      })),
    };
  }
  if (raw && typeof raw === "object") {
    const obj = raw as StoredRubricPayload;
    const list = Array.isArray(obj.criteria) ? obj.criteria : [];
    return {
      meta: obj,
      criteria: list.map((c) => ({
        ...c,
        pointsPossible: c.pointsPossible ?? (c.points > 0 ? c.points : 1),
      })),
    };
  }
  return { meta: {}, criteria: [] };
}

export function AuditQueueClient({ initialCrops }: { initialCrops: AuditCrop[] }) {
  const [crops, setCrops] = useState(initialCrops);
  const [activeIdx, setActiveIdx] = useState(0);

  const activeCrop = crops[activeIdx];

  const handleAuditResolved = (resolvedCropId: string) => {
    setCrops((prev) => {
      const next = prev.filter((c) => c.id !== resolvedCropId);
      setActiveIdx((idx) => Math.min(idx, Math.max(0, next.length - 1)));
      return next;
    });
  };

  if (crops.length === 0) {
    return (
      <div className="p-12 text-center bg-zinc-900 border border-zinc-800 rounded-2xl">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold">Queue is clear</h3>
        <p className="text-xs text-zinc-400 mt-1">
          All handwritten responses have been evaluated.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Queue Pane */}
      <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2 max-h-[82vh] overflow-y-auto">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Pending Review ({crops.length})
        </h3>
        {crops.map((c, i) => {
          const { meta } = parseStoredRubric(c.rubricBreakdown);
          const qLabel = meta.questionNumber
            ? `Q${meta.questionNumber}`
            : c.frqSubmission.questionId;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                i === activeIdx
                  ? "bg-zinc-800 border-blue-500/60"
                  : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-white">
                  {qLabel} • Part {c.subPartLabel}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {c.pointsPossible} pt{c.pointsPossible === 1 ? "" : "s"}
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1 truncate">
                {c.frqSubmission.profile.firstName} {c.frqSubmission.profile.lastName}
              </p>
              <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                {c.frqSubmission.test.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Right One-Click Grading Workspace */}
      {activeCrop && (
        <CropAuditForm
          key={activeCrop.id}
          crop={activeCrop}
          onSuccess={() => handleAuditResolved(activeCrop.id)}
        />
      )}
    </div>
  );
}

interface CropAuditFormProps {
  crop: AuditCrop;
  onSuccess: () => void;
}

function CropAuditForm({ crop, onSuccess }: CropAuditFormProps) {
  const parsed = useMemo(
    () => parseStoredRubric(crop.rubricBreakdown),
    [crop.rubricBreakdown]
  );

  const [criteriaList, setCriteriaList] = useState<RubricCriterionItem[]>(
    parsed.criteria
  );
  const [points, setPoints] = useState<number>(crop.pointsAwarded ?? 0);
  const [transcription, setTranscription] = useState<string>(
    crop.transcription ?? ""
  );
  const [notes, setNotes] = useState<string>("");
  const [showOptionalInputs, setShowOptionalInputs] = useState<boolean>(false);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"crop" | "sheet">("crop");

  const rectifiedOrFullSheetUrl =
    crop.frqSubmission.deskewedSheetUrl || crop.frqSubmission.fullSheetUrl;

  const activeImageUrl =
    viewMode === "sheet" && rectifiedOrFullSheetUrl
      ? rectifiedOrFullSheetUrl
      : crop.cropUrl;

  const toggleCriterion = (idx: number) => {
    setCriteriaList((prev) => {
      const updated = prev.map((item, i) => {
        if (i !== idx) return item;
        const nextEarned = !item.earned;
        const maxPts = item.pointsPossible ?? 1;
        return {
          ...item,
          earned: nextEarned,
          points: nextEarned ? maxPts : 0,
          reason: nextEarned ? "Awarded by grader" : "Not earned",
        };
      });
      const sum = updated.reduce((acc, c) => acc + (c.earned ? c.points : 0), 0);
      setPoints(Math.min(crop.pointsPossible, sum));
      return updated;
    });
  };

  const handleSetAllCriteria = (earnedAll: boolean) => {
    setCriteriaList((prev) => {
      const updated = prev.map((item) => {
        const maxPts = item.pointsPossible ?? 1;
        return {
          ...item,
          earned: earnedAll,
          points: earnedAll ? maxPts : 0,
          reason: earnedAll ? "Awarded by grader" : "Not earned",
        };
      });
      const sum = updated.reduce((acc, c) => acc + (c.earned ? c.points : 0), 0);
      setPoints(Math.min(crop.pointsPossible, sum));
      return updated;
    });
  };

  const handleResolve = async () => {
    setIsSubmitting(true);
    try {
      // If tutor did not manually enter LaTeX, record clean rubric summary for student feedback
      const finalTranscription =
        transcription.trim().length > 0
          ? transcription.trim()
          : criteriaList.length > 0
          ? `${points}/${crop.pointsPossible} pts (${
              criteriaList
                .filter((c) => c.earned)
                .map((c) => c.criterion)
                .join("; ") || "No rubric criteria earned"
            })`
          : `${points}/${crop.pointsPossible} pts`;

      const updatedPayload: StoredRubricPayload = {
        ...parsed.meta,
        criteria: criteriaList,
      };

      const res = await resolveCropAudit({
        cropId: crop.id,
        pointsAwarded: points,
        transcription: finalTranscription,
        reviewerNotes: notes || undefined,
        rubricBreakdown: criteriaList.length > 0 ? updatedPayload : undefined,
      });

      if (res.success) {
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const qTitle = parsed.meta.questionNumber
    ? `Question ${parsed.meta.questionNumber} • Part ${crop.subPartLabel}`
    : `${crop.frqSubmission.questionId} • Part ${crop.subPartLabel}`;

  return (
    <div className="lg:col-span-9 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-white">{qTitle}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {points} / {crop.pointsPossible} pts
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Student:{" "}
            <span className="text-zinc-200 font-medium">
              {crop.frqSubmission.profile.firstName}{" "}
              {crop.frqSubmission.profile.lastName}
            </span>
            {crop.auditReason &&
              crop.auditReason !== "STAGE_1_HUMAN_GRADING" && (
                <span className="ml-2 text-amber-400">
                  • Flag: {crop.auditReason}
                </span>
              )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {parsed.meta.questionPrompt && (
            <button
              type="button"
              onClick={() => setShowPrompt((prev) => !prev)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1 cursor-pointer"
            >
              <span>Question Prompt</span>
              {showPrompt ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
          <a
            href={activeImageUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Full Size
          </a>
        </div>
      </div>

      {/* Optional Collapsible Question Prompt Context */}
      {showPrompt && parsed.meta.questionPrompt && (
        <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 max-h-48 overflow-y-auto">
          <MarkdownQuestionRenderer content={parsed.meta.questionPrompt} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Handwriting Crop / Rectified Full-Sheet Viewer */}
        <div className="md:col-span-6 space-y-2">
          {rectifiedOrFullSheetUrl && (
            <div className="flex items-center gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setViewMode("crop")}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  viewMode === "crop"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Part {crop.subPartLabel} Crop
              </button>
              <button
                type="button"
                onClick={() => setViewMode("sheet")}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  viewMode === "sheet"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {crop.frqSubmission.deskewedSheetUrl
                  ? "Rectified Full Sheet"
                  : "Original Full Sheet"}
              </button>
            </div>
          )}

          <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center p-2 min-h-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImageUrl}
              alt={
                viewMode === "sheet"
                  ? "Rectified full exam sheet"
                  : "Student response crop"
              }
              className="max-h-[440px] object-contain rounded"
            />
          </div>
        </div>

        {/* Right: One-Click Scoring Checklist */}
        <div className="md:col-span-6 space-y-4">
          {/* Quick Full-Credit / Zero-Credit Bar */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-zinc-400">
              Rubric Checklist (Click to Award)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSetAllCriteria(true)}
                className="px-2.5 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Award className="w-3 h-3" /> Full ({crop.pointsPossible})
              </button>
              <button
                type="button"
                onClick={() => handleSetAllCriteria(false)}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Ban className="w-3 h-3" /> 0 pts
              </button>
            </div>
          </div>

          {/* Interactive Criterion Checkboxes */}
          <div className="space-y-2">
            {criteriaList.map((item, idx) => (
              <button
                key={item.id || idx}
                type="button"
                onClick={() => toggleCriterion(idx)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${
                  item.earned
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-50"
                    : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                }`}
              >
                {item.earned ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-medium leading-relaxed">
                      <MarkdownQuestionRenderer
                        content={item.criterion}
                        className="prose-p:m-0 prose-p:inline"
                      />
                    </div>
                    <span
                      className={`text-xs font-mono font-bold shrink-0 px-1.5 py-0.5 rounded ${
                        item.earned
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-zinc-900 text-zinc-400"
                      }`}
                    >
                      {item.points}/{item.pointsPossible ?? 1} pt
                    </span>
                  </div>

                  {(item.expectedLatex ||
                    item.requiredUnits ||
                    item.allowConsequentialCarryover ||
                    item.requiresJustification) && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                      {item.expectedLatex && (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300">
                          Target: {item.expectedLatex}
                        </span>
                      )}
                      {item.requiredUnits && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300">
                          Units: {item.requiredUnits}
                        </span>
                      )}
                      {item.requiresJustification && (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300">
                          Justification Required
                        </span>
                      )}
                      {item.allowConsequentialCarryover && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300">
                          Carryover Allowed
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Manual Score Override + Optional Transcription/Notes Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-zinc-400">
                Total Points:
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max={crop.pointsPossible}
                value={points}
                onChange={(e) => setPoints(parseFloat(e.target.value) || 0)}
                className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-xs text-zinc-500 font-mono">
                / {crop.pointsPossible}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowOptionalInputs((prev) => !prev)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 underline underline-offset-2 cursor-pointer"
            >
              {showOptionalInputs
                ? "Hide notes / transcription"
                : "+ Add note / transcription"}
            </button>
          </div>

          {showOptionalInputs && (
            <div className="space-y-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Optional Reviewer Note
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                  placeholder="Optional feedback for student..."
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Optional LaTeX Transcription (Stage 2 Gold-Dataset Training)
                </label>
                <textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-blue-500 h-16"
                  placeholder="Optional LaTeX..."
                />
              </div>
            </div>
          )}

          {/* Primary One-Click Submit */}
          <button
            type="button"
            onClick={handleResolve}
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>Save Score ({points}/{crop.pointsPossible}) & Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}