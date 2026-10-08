// components/tools/TGFormulaSheet.tsx
"use client";

import React from "react";
import { X } from "lucide-react";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";

interface TGFormulaSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const FORMULA_SHEET_MD = `
### Geometry & Trigonometric Reference

* **Area of a Circle:** $A = \\pi r^2$
* **Circumference of a Circle:** $C = 2\\pi r$
* **Area of a Rectangle:** $A = \\ell w$
* **Area of a Triangle:** $A = \\frac{1}{2} b h$
* **Pythagorean Theorem:** $a^2 + b^2 = c^2$
* **Special Right Triangles:**
  * $30^\\circ - 60^\\circ - 90^\\circ$: side ratios $x : x\\sqrt{3} : 2x$
  * $45^\\circ - 45^\\circ - 90^\\circ$: side ratios $s : s : s\\sqrt{2}$
* **Volume of a Rectangular Prism:** $V = \\ell w h$
* **Volume of a Cylinder:** $V = \\pi r^2 h$
* **Volume of a Sphere:** $V = \\frac{4}{3} \\pi r^3$
* **Volume of a Cone:** $V = \\frac{1}{3} \\pi r^2 h$
* **Volume of a Pyramid:** $V = \\frac{1}{3} B h$

> The number of degrees of arc in a circle is $360^\\circ$. The number of radians of arc in a circle is $2\\pi$. The sum of the measures in degrees of the angles of a triangle is $180^\\circ$.
`;

export const TGFormulaSheet: React.FC<TGFormulaSheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Reference Sheet
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <MarkdownQuestionRenderer content={FORMULA_SHEET_MD} />
        </div>
      </div>
    </div>
  );
};