// components/exam/shells/ap/APDirectionsModal.tsx
"use client";

import React, { useEffect } from "react";

interface APDirectionsModalProps {
  isOpen: boolean;
  sectionTitle: string;
  isFreeResponseSection: boolean;
  hasCalculator: boolean;
  onClose: () => void;
}

export const APDirectionsModal: React.FC<APDirectionsModalProps> = ({
  isOpen,
  sectionTitle,
  isFreeResponseSection,
  hasCalculator,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-18 bottom-0 z-50 bg-[#1e1e1e]/90 select-none font-sans animate-in fade-in duration-100">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 ml-5 sm:ml-6 pt-4 w-[calc(100vw-2.5rem)] sm:w-[calc(100vw-3rem)] max-w-4xl lg:max-w-5xl flex flex-col">
        {/* Upward Beak aligned directly under the Directions trigger */}
        <div className="absolute top-[8px] left-9 w-4 h-4 bg-white dark:bg-neutral-900 rotate-45 border-t border-l border-neutral-300 dark:border-neutral-700 z-20 pointer-events-none" />

        <div className="relative z-10 w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-2xl p-7 sm:p-10 md:p-12 text-neutral-900 dark:text-neutral-100 max-h-[calc(100vh-120px)] flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {sectionTitle.includes("Directions")
                ? sectionTitle
                : `${sectionTitle} Directions`}
            </h2>

            {!isFreeResponseSection ? (
              <div className="space-y-4 text-[14.5px] sm:text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200 font-normal">
                <p>
                  {hasCalculator
                    ? "A graphing calculator is required for some questions in this part of the exam."
                    : "A calculator may NOT be used on this part of the exam."}
                </p>
                <p>
                  Solve each problem, using any available space for scratchwork. Then decide which is the best of the choices given and select the corresponding option.
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-[14px]">
                  <li>
                    Unless otherwise specified, the domain of a function{" "}
                    <span className="font-serif italic">f</span> is assumed to be the set of all real numbers{" "}
                    <span className="font-serif italic">x</span> for which{" "}
                    <span className="font-serif italic">f(x)</span> is a real number.
                  </li>
                  <li>
                    The inverse of a trigonometric function{" "}
                    <span className="font-serif italic">f</span> may be indicated using the inverse function notation{" "}
                    <span className="font-serif italic">f</span>
                    <sup>&minus;1</sup> or with the prefix &ldquo;arc&rdquo; (e.g.,{" "}
                    <span className="font-serif italic">sin</span>
                    <sup>&minus;1</sup> <span className="font-serif italic">x</span> = arcsin{" "}
                    <span className="font-serif italic">x</span>).
                  </li>
                  <li>
                    Your score on Section I is based on the number of questions answered correctly. Points are not deducted for incorrect answers or unanswered questions.
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4 text-[14.5px] sm:text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200 font-normal">
                <p>
                  {hasCalculator
                    ? "A graphing calculator is required for some parts of the problems in this section."
                    : "A calculator may NOT be used on this part of the exam."}
                </p>
                <p>
                  Write your complete solutions clearly in your printed free-response booklet inside the designated sub-part boxes (Parts A, B, C, D).
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-[14px]">
                  <li>
                    <strong>Show all your work:</strong> Clearly label any functions, graphs, tables, or other objects that you use. Justifications require that you give mathematical reasons, and that you verify the needed conditions under which relevant theorems, properties, definitions, or tests are applied.
                  </li>
                  <li>
                    <strong>Decimal accuracy:</strong> Unless otherwise specified, numerical answers need not be simplified, and decimal approximations must be correct to <strong>three places after the decimal point</strong>.
                  </li>
                  <li>
                    <strong>End-of-exam upload:</strong> Do not pause to scan pages during the timed section. Once you finish Section II, you will be prompted to scan and submit all response sheets continuously.
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-10 py-2.5 bg-[#FFD100] hover:bg-[#F5C800] text-neutral-950 text-xs sm:text-sm font-bold rounded-full shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};