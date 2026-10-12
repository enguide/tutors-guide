// components/tools/CalculatorToolbar.tsx
"use client";

import React from "react";
import { CalculatorType } from "@/types/examConfig";
import { ToggleGraph } from "./ToggleGraph";
import { GRECalculatorModal } from "./GRECalculatorModal";

interface CalculatorToolbarProps {
  type: CalculatorType;
  isOpen: boolean;
  onClose: () => void;
  onInteract?: () => void;
  onTransfer?: (value: string) => void;
}

export const CalculatorToolbar: React.FC<CalculatorToolbarProps> = ({
  type,
  isOpen,
  onClose,
  onInteract,
  onTransfer,
}) => {
  if (type === "none") return null;

  if (type === "desmos-graphing") {
    return (
      <ToggleGraph
        isOpen={isOpen}
        onClose={onClose}
        onInteract={onInteract}
      />
    );
  }

  if (type === "gre-basic") {
    return (
      <GRECalculatorModal
        isOpen={isOpen}
        onClose={onClose}
        onInteract={onInteract}
        onTransfer={onTransfer}
      />
    );
  }

  return null;
};