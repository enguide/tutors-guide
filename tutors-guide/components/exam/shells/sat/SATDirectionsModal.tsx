// components/exam/shells/sat/SATDirectionsModal.tsx
"use client";

import React, { useEffect } from "react";

interface SATDirectionsModalProps {
  isOpen: boolean;
  sectionTitle: string;
  onClose: () => void;
}

export const SATDirectionsModal: React.FC<SATDirectionsModalProps> = ({
  isOpen,
  sectionTitle,
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

  const isMath = sectionTitle.toLowerCase().includes("math");

  return (
    <div className="fixed inset-x-0 top-18 bottom-0 z-50 bg-[#1e1e1e]/90 select-none font-sans animate-in fade-in duration-100">
      {/* Background click catcher */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* 
        Left-anchored Modal Stage:
        - Small margin on left (ml-5 sm:ml-6)
        - Small margin on top (pt-4)
        - Responsive width with max constraint (max-w-4xl lg:max-w-5xl)
        - Stays strictly left-aligned regardless of how wide the viewport is
      */}
      <div className="relative z-10 ml-5 sm:ml-6 pt-4 w-[calc(100vw-2.5rem)] sm:w-[calc(100vw-3rem)] max-w-4xl lg:max-w-5xl flex flex-col">
        
        {/* Seamless Upward Beak aligned directly under the Directions text */}
        <div 
          className="absolute top-[8px] left-9 w-4 h-4 bg-white dark:bg-neutral-900 rotate-45 border-t border-l border-neutral-300 dark:border-neutral-700 z-20 pointer-events-none"
        />

        {/* Modal Card */}
        <div className="relative z-10 w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-2xl p-7 sm:p-10 md:p-12 text-neutral-900 dark:text-neutral-100 max-h-[calc(100vh-120px)] flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {sectionTitle.includes("Directions")
                ? sectionTitle
                : `${sectionTitle} Directions`}
            </h2>

            {!isMath ? (
              /* Reading & Writing Directions */
              <div className="space-y-5 text-[15px] sm:text-[16px] leading-relaxed text-neutral-800 dark:text-neutral-200 font-normal">
                <p>
                  The questions in this section address a number of important reading and writing skills. Each question includes one or more texts, which may include a table or graph. Read each text and question carefully, then choose the best answer to the question based on the text(s).
                </p>
                <p>
                  All questions in this section are multiple-choice with four answer choices. Each question has a single best answer.
                </p>
              </div>
            ) : (
              /* Math Directions */
              <div className="space-y-4 text-[14.5px] sm:text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200 font-normal max-h-[50vh] overflow-y-auto pr-3">
                <p>
                  The questions in this section address a number of important math skills. Use of a calculator is permitted for all questions.
                </p>
                <p>Unless a question indicates otherwise, you may assume that:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-[14px]">
                  <li>All variables and expressions represent real numbers.</li>
                  <li>Figures provided are drawn to scale unless otherwise stated.</li>
                  <li>All figures lie in a plane.</li>
                  <li>
                    The domain of a given function{" "}
                    <span className="font-serif italic">f</span> is the set of all real numbers{" "}
                    <span className="font-serif italic">x</span> for which{" "}
                    <span className="font-serif italic">f(x)</span> is a real number.
                  </li>
                </ul>

                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                    For Student-Produced Response (Grid-In) Questions:
                  </h3>
                  <ul className="list-disc list-inside space-y-1.5 pl-2 text-[14px]">
                    <li>If you find more than one correct answer, enter only one answer.</li>
                    <li>
                      You can enter up to 5 characters for a positive answer and up to 6 characters (including the negative sign) for a negative answer.
                    </li>
                    <li>
                      If your answer is a fraction that doesn&apos;t fit in the provided space, enter the decimal equivalent.
                    </li>
                    <li>
                      If an answer is a decimal that doesn&apos;t fit in the provided space, enter it by truncating or rounding at the fourth digit.
                    </li>
                    <li>
                      Do not enter mixed numbers such as{" "}
                      <span className="font-serif italic">3 1/2</span> as an answer (enter{" "}
                      <span className="font-serif italic">7/2</span> or{" "}
                      <span className="font-serif italic">3.5</span>).
                    </li>
                    <li>Do not enter symbols such as a percent sign, comma, or dollar sign.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Yellow Continue Pill Button */}
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