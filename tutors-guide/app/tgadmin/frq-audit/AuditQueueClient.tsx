// app/tgadmin/frq-audit/AuditQueueClient.tsx
"use client";

import React, { useState } from "react";
import { resolveCropAudit } from "@/actions/frqAudit";
import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react";

interface AuditCrop {
  id: string;
  subPartLabel: string;
  cropUrl: string;
  transcription: string | null;
  pointsAwarded: number | null;
  pointsPossible: number;
  auditReason: string | null;
  frqSubmission: {
    questionId: string;
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

export function AuditQueueClient({ initialCrops }: { initialCrops: AuditCrop[] }) {
  const [crops, setCrops] = useState(initialCrops);
  const [activeIdx, setActiveIdx] = useState(0);

  const activeCrop = crops[activeIdx];

  const handleAuditResolved = (resolvedCropId: string) => {
    setCrops((prev) => prev.filter((c) => c.id !== resolvedCropId));
    setActiveIdx(0);
  };

  if (crops.length === 0) {
    return (
      <div className="p-12 text-center bg-zinc-900 border border-zinc-800 rounded-2xl">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold">Queue is clear</h3>
        <p className="text-xs text-zinc-400 mt-1">
          No student submissions currently require manual human inspection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left List Pane */}
      <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Flagged Items ({crops.length})
        </h3>
        {crops.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveIdx(i)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              i === activeIdx
                ? "bg-zinc-800 border-blue-500/50"
                : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">
                Part {c.subPartLabel}
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                Audit Required
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 truncate">
              {c.frqSubmission.profile.firstName} {c.frqSubmission.profile.lastName}
            </p>
            <p className="text-[11px] text-zinc-500 truncate mt-0.5">
              {c.frqSubmission.test.title}
            </p>
          </button>
        ))}
      </div>

      {/* Right Inspector Workspace - Keyed by crop.id to eliminate useEffect state syncing */}
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
  const [points, setPoints] = useState<number>(crop.pointsAwarded ?? 0);
  const [transcription, setTranscription] = useState<string>(crop.transcription ?? "");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResolve = async () => {
    setIsSubmitting(true);
    try {
      const res = await resolveCropAudit({
        cropId: crop.id,
        pointsAwarded: points,
        transcription,
        reviewerNotes: notes,
      });

      if (res.success) {
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white">
            Evaluating Part {crop.subPartLabel}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Flag Reason: <span className="text-amber-400">{crop.auditReason}</span>
          </p>
        </div>
        <a
          href={crop.cropUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Full Image
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Handwriting Crop Display */}
        <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center p-2 min-h-[280px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={crop.cropUrl}
            alt="Student response crop"
            className="max-h-[360px] object-contain rounded"
          />
        </div>

        {/* Audit Form Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              LaTeX Transcription
            </label>
            <textarea
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-blue-500 h-24"
              placeholder="\int_{a}^{b} f(x) dx..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Points Awarded (out of {crop.pointsPossible})
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max={crop.pointsPossible}
              value={points}
              onChange={(e) => setPoints(parseFloat(e.target.value) || 0)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Reviewer Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
              placeholder="Reason for adjustment..."
            />
          </div>

          <button
            type="button"
            onClick={handleResolve}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Commit Audit & Resolve
          </button>
        </div>
      </div>
    </div>
  );
}