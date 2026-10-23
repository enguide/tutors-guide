// components/exam/frq/FrqManualUploadFallback.tsx
"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getPresignedUploadForSession, finalizeSubmissionUpload } from "@/actions/frqCapture";

interface FrqManualUploadFallbackProps {
  sessionToken: string;
  onUploaded: (submissionId: string) => void;
}

export function FrqManualUploadFallback({
  sessionToken,
  onUploaded,
}: FrqManualUploadFallbackProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      setErrorMessage("Please upload a PNG, JPEG, or PDF file.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("File exceeds 15MB limit.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      // 1. Get presigned POST
      const presignedRes = await getPresignedUploadForSession(sessionToken, file.type);
      if (!presignedRes.success || !presignedRes.presigned) {
        throw new Error(presignedRes.error || "Failed to get upload authorization");
      }

      const { url, fields, key, publicUrl } = presignedRes.presigned;

      // 2. Direct upload to storage
      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
      formData.append("file", file);

      const uploadRes = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Direct storage upload failed");
      }

      // 3. Finalize record in database
      const finalizeRes = await finalizeSubmissionUpload({
        sessionToken,
        storageKey: key,
        publicUrl,
        mimeType: file.type,
        fileSizeBytes: file.size,
      });

      if (!finalizeRes.success || !finalizeRes.submission) {
        throw new Error(finalizeRes.error || "Failed to commit upload record");
      }

      onUploaded(finalizeRes.submission.id);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full mt-4">
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50/5" : "border-zinc-700 hover:border-zinc-500"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,application/pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8 text-zinc-400" />
          )}

          <p className="text-sm font-medium text-zinc-300">
            {isUploading ? "Uploading sheet to secure vault..." : "Or drop your scanned sheet / PDF here"}
          </p>
          <p className="text-xs text-zinc-500">Supports PDF, PNG, JPG up to 15MB</p>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 mt-2 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}