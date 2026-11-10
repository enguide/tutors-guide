// components/tools/FormulaSheetModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, MoveDiagonal } from "lucide-react";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";
import { getFormulaSheet } from "@/lib/formulaSheetRegistry";

interface FormulaSheetModalProps {
  sheetId?: string;
  isOpen: boolean;
  onClose: () => void;
}

function SixDotGrip({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 12" fill="currentColor" className={className}>
      <circle cx="3" cy="3" r="1.3" />
      <circle cx="8" cy="3" r="1.3" />
      <circle cx="13" cy="3" r="1.3" />
      <circle cx="3" cy="9" r="1.3" />
      <circle cx="8" cy="9" r="1.3" />
      <circle cx="13" cy="9" r="1.3" />
    </svg>
  );
}

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({
  sheetId,
  isOpen,
  onClose,
}) => {
  const sheet = getFormulaSheet(sheetId);
  const isSatReference = !sheetId || sheetId.toLowerCase().includes("sat");

  const DEFAULT_WIDTH = isSatReference ? 720 : 520;
  const DEFAULT_HEIGHT = isSatReference ? 400 : 640;

  // Responsive size initialization
  const [size, setSize] = useState<{ width: number; height: number }>(() => {
    if (typeof window === "undefined") {
      return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
    }
    const isMobile = window.innerWidth < 768;
    const targetWidth = isMobile
      ? Math.min(window.innerWidth - 16, DEFAULT_WIDTH)
      : Math.min(DEFAULT_WIDTH, window.innerWidth - 60);
    const targetHeight = isMobile
      ? Math.min(window.innerHeight - 140, 360)
      : Math.min(DEFAULT_HEIGHT, window.innerHeight - 100);

    return {
      width: Math.max(280, targetWidth),
      height: Math.max(240, targetHeight),
    };
  });

  // Responsive initial position
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window === "undefined") return { x: 80, y: 65 };
    const isMobile = window.innerWidth < 768;
    if (isMobile) return { x: 8, y: 72 };
    
    const targetWidth = Math.min(DEFAULT_WIDTH, window.innerWidth - 60);
    const initialX = Math.max(20, Math.min(window.innerWidth - targetWidth - 20, 80));
    return { x: initialX, y: 65 };
  });

  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; startX: number; startY: number }>({
    clientX: 0,
    clientY: 0,
    startX: 0,
    startY: 0,
  });
  const resizeStartRef = useRef<{ clientX: number; clientY: number; startW: number; startH: number }>({
    clientX: 0,
    clientY: 0,
    startW: 0,
    startH: 0,
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Unified Mouse & Touch listeners for drag and resize
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const currentY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isDraggingRef.current) {
        const deltaX = currentX - dragStartRef.current.clientX;
        const deltaY = currentY - dragStartRef.current.clientY;
        const nextX = Math.max(4, Math.min(window.innerWidth - 120, dragStartRef.current.startX + deltaX));
        const nextY = Math.max(4, Math.min(window.innerHeight - 60, dragStartRef.current.startY + deltaY));
        setPosition({ x: nextX, y: nextY });
      }

      if (isResizingRef.current) {
        const deltaW = currentX - resizeStartRef.current.clientX;
        const deltaH = currentY - resizeStartRef.current.clientY;
        const nextW = Math.max(260, Math.min(window.innerWidth - 12, resizeStartRef.current.startW + deltaW));
        const nextH = Math.max(220, Math.min(window.innerHeight - 20, resizeStartRef.current.startH + deltaH));
        setSize({ width: nextW, height: nextH });
      }
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
      isResizingRef.current = false;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("touchcancel", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  }, []);

  const startDrag = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      clientX,
      clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStartHeader = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  const startResize = (clientX: number, clientY: number) => {
    isResizingRef.current = true;
    resizeStartRef.current = {
      clientX,
      clientY,
      startW: size.width,
      startH: size.height,
    };
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        maxWidth: "calc(100vw - 12px)",
        maxHeight: "calc(100dvh - 75px)",
      }}
      className="fixed z-50 bg-white dark:bg-neutral-900 border border-neutral-400 dark:border-neutral-700 rounded-none shadow-2xl flex flex-col select-none touch-none"
    >
      {/* Bluebook Dark Header */}
      <div
        onMouseDown={handleMouseDownHeader}
        onTouchStart={handleTouchStartHeader}
        className="h-10 bg-[#1c1c1c] text-white px-3 grid grid-cols-3 items-center cursor-move select-none shrink-0 rounded-none touch-none"
      >
        <span className="justify-self-start text-[12px] sm:text-[13px] font-sans font-bold tracking-tight text-neutral-100">
          Reference
        </span>

        <div className="justify-self-center flex items-center text-neutral-200">
          <SixDotGrip className="w-6 h-6" />
        </div>

        <div className="justify-self-end flex items-center">
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-200 hover:text-white transition-colors cursor-pointer"
            title="Close reference"
          >
            <X className="w-5 h-5 stroke-2" />
          </button>
        </div>
      </div>

      {/* Reference Body */}
      <div className="flex-1 w-full h-full overflow-y-auto p-2 sm:p-4 flex items-center justify-center bg-white dark:bg-neutral-900">
        {isSatReference ? (
          <img
            src="/content/references/ReferenceEquations.svg"
            alt="Reference Equations"
            draggable={false}
            className="w-full h-full max-w-full max-h-full object-contain pointer-events-none select-none dark:invert dark:contrast-200 dark:brightness-90 transition-[filter] duration-200"
            loading="eager"
          />
        ) : sheet ? (
          <div className="w-full h-full font-serif text-[14px] sm:text-[15px] leading-relaxed">
            <MarkdownQuestionRenderer content={sheet.content} />
          </div>
        ) : null}
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          startResize(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          startResize(e.touches[0].clientX, e.touches[0].clientY);
        }}
        className="absolute -bottom-2 -right-2 w-7 h-7 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-full shadow-md cursor-nwse-resize flex items-center justify-center text-neutral-800 hover:text-black dark:text-neutral-200 dark:hover:text-white z-30 transition-transform active:scale-95 touch-none"
        title="Resize reference sheet"
      >
        <MoveDiagonal className="w-4 h-4 rotate-90" />
      </div>
    </div>
  );
};