// components/storefront/RotatingExamHeroText.tsx
"use client";

import { useEffect, useState } from "react";

const EXAMS = [
  "The dSAT",
  "The ACT",
  "The GRE",
  "AP Calculus",
];

export function RotatingExamHeroText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % EXAMS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-grid grid-cols-1 grid-rows-1 overflow-hidden text-left align-baseline">
      {EXAMS.map((exam, i) => {
        const isCurrent = i === index;
        const isPrev = i === (index - 1 + EXAMS.length) % EXAMS.length;

        // Moves right-to-left: enters from right (+100%), exits to left (-100%)
        let transformClass = "translate-x-full opacity-0 pointer-events-none";
        if (isCurrent) {
          transformClass = "translate-x-0 opacity-100";
        } else if (isPrev) {
          transformClass = "-translate-x-full opacity-0 pointer-events-none";
        }

        return (
          <span
            key={exam}
            aria-hidden={!isCurrent}
            className={`col-start-1 row-start-1 text-foreground/75 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${transformClass}`}
          >
            {exam}
          </span>
        );
      })}
    </span>
  );
}