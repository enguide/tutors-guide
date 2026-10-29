// components/tools/FormulaSheetModal.tsx
"use client";

import React, { useEffect } from "react";
import { X, BookOpen } from "lucide-react";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { getFormulaSheet } from "@/lib/formulaSheetRegistry";

interface FormulaSheetModalProps {
  sheetId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({
  sheetId,
  isOpen,
  onClose,
}) => {
  const sheet = getFormulaSheet(sheetId);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !sheet) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="formula-sheet-title"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
              <BookOpen size={18} />
            </div>
            <div>
              <h2
                id="formula-sheet-title"
                className="text-base font-bold text-slate-900 dark:text-slate-100"
              >
                {sheet.title}
              </h2>
              {sheet.subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {sheet.subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close formula sheet"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">
          <MarkdownQuestionRenderer content={sheet.content} />
        </div>
      </div>
    </div>
  );
};