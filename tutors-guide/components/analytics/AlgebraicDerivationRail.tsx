// components/analytics/AlgebraicDerivationRail.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { ArrowRight, Info } from "lucide-react";
import { resolveTestAssetUrl } from "@/lib/contentPaths";

export interface DerivationStep {
  stepNumber: number;
  title: string;
  why?: string;
  mathContent: string;
}

interface AlgebraicDerivationRailProps {
  steps: DerivationStep[];
  category?: string;
  testId?: string;
  manifestBasePath?: string;
}

export const AlgebraicDerivationRail: React.FC<AlgebraicDerivationRailProps> = ({
  steps,
  category,
  testId,
  manifestBasePath,
}) => {
  const markdownComponents = useMemo(
    () => ({
      img: ({ src, alt = "" }: any) => {
        if (typeof src !== "string" || !src.trim()) {
          return null;
        }

        let resolvedSrc =
          category && testId
            ? resolveTestAssetUrl(category, testId, src, manifestBasePath)
            : src;

        if (
          !resolvedSrc.startsWith("http://") &&
          !resolvedSrc.startsWith("https://") &&
          !resolvedSrc.startsWith("/")
        ) {
          resolvedSrc = "/" + resolvedSrc.replace(/^(\.\/|\/)?/, "");
        }

        const isSvg = resolvedSrc.toLowerCase().endsWith(".svg");

        return (
          <figure className="my-2 flex flex-col items-center w-full">
            <img
              src={resolvedSrc}
              alt={alt || "Derivation step diagram"}
              className={`max-h-[240px] max-w-full w-auto h-auto object-contain mx-auto select-none ${
                isSvg
                  ? "dark:invert dark:contrast-200 dark:brightness-90 transition-[filter] duration-200"
                  : "rounded-[2px]"
              }`}
              loading="eager"
            />
            {alt && (
              <figcaption className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 text-center font-mono">
                {alt}
              </figcaption>
            )}
          </figure>
        );
      },

      p: ({ children }: any) => {
        const childrenArray = React.Children.toArray(children);
        const hasBlockElement = childrenArray.some((child) => {
          if (React.isValidElement(child)) {
            return (
              child.type === "figure" ||
              (child.props as any)?.node?.tagName === "img" ||
              (child.props as any)?.src !== undefined
            );
          }
          return false;
        });

        if (hasBlockElement) {
          return <div className="my-2 last:mb-0">{children}</div>;
        }

        return <p className="mb-2 last:mb-0">{children}</p>;
      },
    }),
    [category, testId, manifestBasePath]
  );

  return (
    <div className="relative my-6 space-y-6 not-prose font-sans">
      {/* Continuous Timeline Spine */}
      <div className="absolute left-4 top-4 bottom-6 w-0.5 bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;

        return (
          <div key={idx} className="relative flex items-start gap-4 sm:gap-6 group">
            {/* Step Number Node */}
            <div
              className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors z-10 ${
                isLast
                  ? "bg-blue-600 border-blue-400 text-white shadow-sm ring-4 ring-blue-500/10"
                  : "bg-white dark:bg-neutral-900 border-blue-600 text-blue-600 dark:text-blue-400"
              }`}
            >
              {step.stepNumber}
            </div>

            {/* Step Card: Two-Column Math & Rationale */}
            <div className="flex-1 min-w-0 bg-white dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 sm:p-5 shadow-xs transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
              {/* Header Title */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  {step.title}
                </span>
              </div>

              {/* Grid: Math on Left, Strategy/Why on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Mathematical Derivation Lane */}
                <div className="md:col-span-7 bg-neutral-50/70 dark:bg-neutral-950/50 border border-neutral-200/70 dark:border-neutral-800/80 rounded-md p-3.5 overflow-x-auto flex items-center justify-center min-h-18">
                  <div className="w-full text-[14.5px] leading-relaxed text-neutral-900 dark:text-neutral-100">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[
                        rehypeRaw,
                        [
                          rehypeKatex,
                          {
                            output: "htmlAndMathml",
                            strict: false,
                            trust: true,
                            throwOnError: false,
                          },
                        ],
                      ]}
                      components={markdownComponents}
                    >
                      {step.mathContent}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Verbal Rationale / Why Lane */}
                {step.why && (
                  <div className="md:col-span-5 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 rounded-md p-3 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-blue-900 dark:text-blue-300 block text-[11px] uppercase tracking-wider mb-0.5">
                        Rationale and Pitfalls
                      </span>
                      <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[
                          rehypeRaw,
                          [
                            rehypeKatex,
                            {
                              output: "htmlAndMathml",
                              strict: false,
                              trust: true,
                              throwOnError: false,
                            },
                          ],
                        ]}
                        components={markdownComponents}
                      >
                        {step.why}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};