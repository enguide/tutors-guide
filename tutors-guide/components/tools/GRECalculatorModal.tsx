// components/tools/GRECalculatorModal.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";

interface GRECalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInteract?: () => void;
  onTransfer?: (value: string) => void;
}

export const GRECalculatorModal: React.FC<GRECalculatorModalProps> = ({
  isOpen,
  onClose,
  onInteract,
  onTransfer,
}) => {
  // Calculator state
  const [display, setDisplay] = useState("0.");
  const [memory, setMemory] = useState<number | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  // Position state for drag behavior
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 120, y: 100 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  // Keep interaction callback reference synced with active question index
  const onInteractRef = useRef(onInteract);
  useEffect(() => {
    onInteractRef.current = onInteract;
  }, [onInteract]);

  // Meaningful action wrapper (excludes C, CE, and Close)
  const triggerMeaningfulAction = (actionFn: () => void) => {
    onInteractRef.current?.();
    actionFn();
  };

  // Global mouse handlers for window dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - dragStartRef.current.mouseX;
        const deltaY = e.clientY - dragStartRef.current.mouseY;
        const nextX = Math.max(10, Math.min(window.innerWidth - 220, dragStartRef.current.startX + deltaX));
        const nextY = Math.max(10, Math.min(window.innerHeight - 380, dragStartRef.current.startY + deltaY));
        setPosition({ x: nextX, y: nextY });
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
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

  // Calculator button actions
  const handleDigit = (digit: string) => {
    if (shouldResetDisplay || display === "0.") {
      setDisplay(digit.endsWith(".") ? digit : `${digit}.`);
      setShouldResetDisplay(false);
    } else {
      const clean = display.endsWith(".") ? display.slice(0, -1) : display;
      setDisplay(`${clean}${digit}.`);
    }
  };

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay("0.");
      setShouldResetDisplay(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(`${display}.`);
    }
  };

  // Pure resets (do NOT fire onInteract)
  const handleClear = () => {
    setDisplay("0.");
    setPrevValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleClearEntry = () => {
    setDisplay("0.");
    setShouldResetDisplay(false);
  };

  const handleToggleSign = () => {
    const current = parseFloat(display);
    if (!isNaN(current) && current !== 0) {
      const flipped = -current;
      setDisplay(`${flipped}${String(flipped).includes(".") ? "" : "."}`);
    }
  };

  const handleSqrt = () => {
    const current = parseFloat(display);
    if (current >= 0) {
      const result = Math.sqrt(current);
      const formatted = Number.isInteger(result) ? `${result}.` : `${result}`;
      setDisplay(formatted);
      setShouldResetDisplay(true);
    } else {
      setDisplay("Error");
      setShouldResetDisplay(true);
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(display);
    setPrevValue(current);
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const handleEquals = () => {
    if (prevValue === null || operation === null) return;
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case "+": result = prevValue + current; break;
      case "−": result = prevValue - current; break;
      case "×": result = prevValue * current; break;
      case "÷": result = current !== 0 ? prevValue / current : 0; break;
    }

    const formatted = Number.isInteger(result) ? `${result}.` : `${result}`;
    setDisplay(formatted);
    setPrevValue(null);
    setOperation(null);
    setShouldResetDisplay(true);
  };

  const handleMemoryAdd = () => {
    const current = parseFloat(display);
    setMemory((prev) => (prev || 0) + current);
    setShouldResetDisplay(true);
  };

  const handleMemoryRecall = () => {
    if (memory !== null) {
      const formatted = Number.isInteger(memory) ? `${memory}.` : `${memory}`;
      setDisplay(formatted);
      setShouldResetDisplay(true);
    }
  };

  const handleMemoryClear = () => {
    setMemory(null);
  };

  const handleTransfer = () => {
    const valueToTransfer = display.endsWith(".") ? display.slice(0, -1) : display;
    onTransfer?.(valueToTransfer);
  };

  return (
    <div
      style={{
        display: isOpen ? "flex" : "none",
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      className="fixed z-50 w-52 bg-[#d1d3d6] border-2 border-neutral-700 rounded-xl shadow-2xl flex-col p-2.5 select-none font-sans"
    >
      {/* Draggable Header with Close Box */}
      <div
        onMouseDown={handleMouseDownHeader}
        className="h-7 w-full flex items-center justify-end cursor-move mb-1.5"
      >
        <button
          type="button"
          onClick={onClose}
          className="w-5 h-5 flex items-center justify-center border border-neutral-800 rounded-xs bg-[#e2e4e7] hover:bg-white text-xs font-bold leading-none"
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* LCD Display */}
      <div className="bg-white border-2 border-neutral-800 rounded-md px-2 py-1.5 mb-2.5 shadow-inner flex items-center justify-end">
        <span className="font-mono text-xl font-bold tracking-tight text-neutral-900 truncate">
          {display}
        </span>
      </div>

      {/* Keypad Grid (5 columns x 5 rows) */}
      <div className="grid grid-cols-5 gap-1.5 text-xs font-bold">
        {/* Row 1: Memory & Parentheses */}
        <button type="button" onClick={() => triggerMeaningfulAction(handleMemoryRecall)} className="h-8 rounded bg-[#1e4e78] text-white hover:opacity-90">MR</button>
        <button type="button" onClick={handleMemoryClear} className="h-8 rounded bg-[#1e4e78] text-white hover:opacity-90">MC</button>
        <button type="button" onClick={() => triggerMeaningfulAction(handleMemoryAdd)} className="h-8 rounded bg-[#1e4e78] text-white hover:opacity-90">M+</button>
        <button type="button" onClick={() => triggerMeaningfulAction(() => {})} className="h-8 rounded bg-[#4176a5] text-white hover:opacity-90">(</button>
        <button type="button" onClick={() => triggerMeaningfulAction(() => {})} className="h-8 rounded bg-[#82a3c2] text-white hover:opacity-90">)</button>

        {/* Row 2: 7 8 9 ÷ C */}
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleDigit("7"))} className="h-8 rounded bg-white text-neutral-900 border border-neutral-300 shadow-xs hover:bg-neutral-50">7</button>
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleDigit("8"))} className="h-8 rounded bg-white text-neutral-900 border border-neutral-300 shadow-xs hover:bg-neutral-50">8</button>
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleDigit("9"))} className="h-8 rounded bg-white text-neutral-900 border border-neutral-300 shadow-xs hover:bg-neutral-50">9</button>
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleOperator("÷"))} className="h-8 rounded bg-[#4176a5] text-white hover:opacity-90">÷</button>
        <button type="button" onClick={handleClear} className="h-8 rounded bg-[#d35400] text-white hover:opacity-90">C</button>

        {/* Row 3: 4 5 6 × CE */}
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleDigit("4"))} className="h-8 rounded bg-white text-neutral-900 border border-neutral-300 shadow-xs hover:bg-neutral-50">4</button>
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleDigit("5"))} className="h-8 rounded bg-white text-neutral-900 border border-neutral-300 shadow-xs hover:bg-neutral-50">5</button>
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleDigit("6"))} className="h-8 rounded bg-white text-neutral-900 border border-neutral-300 shadow-xs hover:bg-neutral-50">6</button>
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleOperator("×"))} className="h-8 rounded bg-[#4176a5] text-white hover:opacity-90">×</button>
        <button type="button" onClick={handleClearEntry} className="h-8 rounded bg-[#d35400] text-white hover:opacity-90">CE</button>

        {/* Row 4: 1 2 3 − √ */}
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleDigit("1"))} className="h-8 rounded bg-white text-neutral-900 border border-neutral-300 shadow-xs hover:bg-neutral-50">1</button>
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleDigit("2"))} className="h-8 rounded bg-white text-neutral-900 border border-neutral-300 shadow-xs hover:bg-neutral-50">2</button>
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleDigit("3"))} className="h-8 rounded bg-white text-neutral-900 border border-neutral-300 shadow-xs hover:bg-neutral-50">3</button>
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleOperator("−"))} className="h-8 rounded bg-[#4176a5] text-white hover:opacity-90">−</button>
        <button type="button" onClick={() => triggerMeaningfulAction(handleSqrt)} className="h-8 rounded bg-[#4176a5] text-white hover:opacity-90">√</button>

        {/* Row 5: ± 0 . + = */}
        <button type="button" onClick={() => triggerMeaningfulAction(handleToggleSign)} className="h-8 rounded bg-[#4176a5] text-white hover:opacity-90">±</button>
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleDigit("0"))} className="h-8 rounded bg-white text-neutral-900 border border-neutral-300 shadow-xs hover:bg-neutral-50">0</button>
        <button type="button" onClick={() => triggerMeaningfulAction(handleDecimal)} className="h-8 rounded bg-white text-neutral-900 border border-neutral-300 shadow-xs hover:bg-neutral-50">.</button>
        <button type="button" onClick={() => triggerMeaningfulAction(() => handleOperator("+"))} className="h-8 rounded bg-[#4176a5] text-white hover:opacity-90">+</button>
        <button type="button" onClick={() => triggerMeaningfulAction(handleEquals)} className="h-8 rounded bg-[#1e4e78] text-white hover:opacity-90">=</button>
      </div>

      {/* Transfer Display Action Button */}
      <button
        type="button"
        onClick={() => triggerMeaningfulAction(handleTransfer)}
        className="w-full mt-2.5 h-8 bg-[#8f9298] hover:bg-[#7e8288] text-white font-bold rounded-md text-xs shadow-xs transition-colors flex items-center justify-center tracking-wide"
      >
        Transfer Display
      </button>
    </div>
  );
};