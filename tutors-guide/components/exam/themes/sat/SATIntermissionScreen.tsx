// components/exam/themes/sat/SATIntermissionScreen.tsx
"use client";

import React from "react";
import { IntermissionProps } from "@/types/examPresentation";

export const SATIntermissionScreen: React.FC<IntermissionProps> = ({
  formattedTime,
  isMounted,
  onResumeEarly,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#1c1c1c] text-white flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none font-sans overflow-y-auto">
      
      {/* Main Two-Column Stage */}
      <div className="max-w-6xl w-full mx-auto my-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
        {/* Left Column: Timer Card & Resume Button */}
        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-6">
          <div className="min-w-70 max-w-sm border border-border rounded-lg py-3 px-3 flex flex-col items-center text-center">
            <span className="text-base sm:text-lg font-medium text-neutral-300">
              Remaining Break Time:
            </span>
            <span
              suppressHydrationWarning
              className="font-sans text-5xl sm:text-6xl font-semibold tracking-tight text-white mt-2"
            >
              {isMounted ? formattedTime : "--:--"}
            </span>
          </div>

          <button
            type="button"
            onClick={onResumeEarly}
            className="px-3 py-3 bg-[#FFD100] hover:bg-[#F5C800] text-neutral-950 text-sm font-bold rounded-full shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            Resume Testing
          </button>
        </div>

        {/* Right Column: Practice Break Directions & Official Rules */}
        <div className="md:col-span-7 space-y-6 text-left">
          {/* Section 1: Practice Test Instructions */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Practice Test Break
            </h1>
            <p className="text-sm sm:text-[15px] leading-relaxed text-neutral-300 font-normal">
              You can resume this practice test as soon as you&apos;re ready to move
              on. On test day, you&apos;ll wait until the clock counts down. Read
              below to see how breaks work on test day.
            </p>
          </div>

          <hr className="border-t border-neutral-700" />

          {/* Section 2: Break Rules */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Take a Break: Do Not Close Your Device
            </h2>

            <p className="text-sm sm:text-[15px] leading-relaxed text-neutral-300">
              After the break, a{" "}
              <strong className="text-white font-semibold">
                Resume Testing Now
              </strong>{" "}
              button will appear and you&apos;ll start the next session.
            </p>

            <div className="space-y-3 pt-1">
              <span className="block text-sm sm:text-[15px] font-bold text-white">
                Follow these rules during the break:
              </span>

              <ol className="space-y-2.5 text-sm sm:text-[14.5px] leading-relaxed text-neutral-300 list-none">
                <li className="flex items-start gap-2.5">
                  <span className="text-neutral-400 font-medium">1.</span>
                  <span>Do not disturb students who are still testing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-neutral-400 font-medium">2.</span>
                  <span>Do not exit the app or close your laptop.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-neutral-400 font-medium">3.</span>
                  <span>
                    Do not access phones, smartwatches, textbooks, notes, or the
                    internet.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-neutral-400 font-medium">4.</span>
                  <span>Do not eat or drink near any testing device.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-neutral-400 font-medium">5.</span>
                  <span>
                    Do not speak in the testing room; outside the room, do not
                    discuss the exam with anyone.
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Empty Footer Spacer */}
      <div className="h-4" />
    </div>
  );
};