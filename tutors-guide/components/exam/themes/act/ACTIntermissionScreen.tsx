// components/exam/themes/act/ACTIntermissionScreen.tsx
"use client";

import React from "react";
import { IntermissionProps } from "@/types/examPresentation";
import { Play } from "lucide-react";

export const ACTIntermissionScreen: React.FC<IntermissionProps> = ({
  formattedTime,
  isMounted,
  onResumeEarly,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10202F] text-white p-6 select-none font-sans">
      <div className="w-full max-w-xl bg-white text-[#222222] rounded-none border border-neutral-300 shadow-2xl p-8 flex flex-col items-center text-center space-y-6">
        
        {/* ACT TestNav Banner */}
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-200 w-full justify-center">
          <span className="text-[20px] font-black italic tracking-tighter text-[#152B3C] font-sans flex items-center">
            <span className="text-[#E31B23] mr-0.5 not-italic text-base leading-none">▲</span>
            ACT
          </span>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-2">
            Scheduled Break
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-[#152B3C]">
            Intermission in Progress
          </h2>
          <p className="text-xs text-neutral-500">
            Section 2 has finalized. Please step away and rest before Section 3 begins.
          </p>
        </div>

        {/* Timer Box */}
        <div className="px-8 py-3 bg-[#F4F6F8] border border-neutral-300 rounded-xs">
          <span
            suppressHydrationWarning
            className="font-mono text-5xl font-bold text-[#152B3C]"
          >
            {isMounted ? formattedTime : "--:--"}
          </span>
        </div>

        <p className="text-xs text-neutral-600 max-w-md leading-relaxed">
          Your exam will advance to the next module automatically when time expires. Clicking below will end your break immediately.
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onResumeEarly}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#152B3C] hover:bg-[#10202F] text-white text-xs font-bold uppercase tracking-wider rounded-[3px] transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Resume Test Early</span>
        </button>
      </div>
    </div>
  );
};