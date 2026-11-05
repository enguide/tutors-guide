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

  // Position and Dimension State (Default size matches official reference proportions)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 120, y: 70 });
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 500, height: 600 });

  // Drag and resize tracking refs
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number }>({
    mouseX: 0,
    mouseY: 0,
    startW: 0,
    startH: 0,
  });

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Window-level mouse listeners for drag & resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - dragStartRef.current.mouseX;
        const deltaY = e.clientY - dragStartRef.current.mouseY;
        const nextX = Math.max(10, Math.min(window.innerWidth - 150, dragStartRef.current.startX + deltaX));
        const nextY = Math.max(10, Math.min(window.innerHeight - 80, dragStartRef.current.startY + deltaY));
        setPosition({ x: nextX, y: nextY });
      }

      if (isResizingRef.current) {
        const deltaW = e.clientX - resizeStartRef.current.mouseX;
        const deltaH = e.clientY - resizeStartRef.current.mouseY;
        const nextW = Math.max(320, Math.min(window.innerWidth - 40, resizeStartRef.current.startW + deltaW));
        const nextH = Math.max(340, Math.min(window.innerHeight - 40, resizeStartRef.current.startH + deltaH));
        setSize({ width: nextW, height: nextH });
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      isResizingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    isResizingRef.current = true;
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: size.width,
      startH: size.height,
    };
  };

  if (!isOpen || !sheet) return null;

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      className="fixed z-50 bg-white dark:bg-neutral-900 border border-neutral-400 dark:border-neutral-700 rounded-none shadow-2xl flex flex-col select-none"
    >
      {/* Bluebook Dark Header with 3-Column Centering Grid */}
      <div
        onMouseDown={handleMouseDownHeader}
        className="h-10 bg-[#1c1c1c] text-white px-3 grid grid-cols-3 items-center cursor-move select-none shrink-0 rounded-none"
      >
        {/* Column 1: Left Title */}
        <span className="justify-self-start text-[13px] font-sans font-bold tracking-tight text-neutral-100">
          Reference
        </span>

        {/* Column 2: Exact Center Grip */}
                  <div className="justify-self-center flex items-center text-neutral-200">
                    <SixDotGrip className="w-6 h-6" />
                  </div>
        
                  {/* Column 3: Right-aligned Close Button */}
                  <div className="justify-self-end flex items-center">
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-1 text-neutral-200 hover:text-white transition-colors cursor-pointer"
                      title="Close calculator"
                    >
                      <X className="w-5 h-5 stroke-2" />
                    </button>
                  </div>
      </div>

      {/* Reference Body: Scrollable & responsive container */}
      <div className="flex-1 w-full h-full overflow-y-auto p-5 font-serif text-[15px] leading-relaxed">
        <MarkdownQuestionRenderer content={sheet.content} />
      </div>

      {/* Circular Bottom-Right Resize Handle */}
      <div
        onMouseDown={handleMouseDownResize}
        className="absolute -bottom-2 -right-2 w-7 h-7 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-full shadow-md cursor-nwse-resize flex items-center justify-center text-neutral-800 hover:text-black dark:text-neutral-200 dark:hover:text-white z-30 transition-transform active:scale-95"
        title="Resize reference sheet"
      >
        <MoveDiagonal className="w-4 h-4 rotate-90" />
      </div>
    </div>
  );
};