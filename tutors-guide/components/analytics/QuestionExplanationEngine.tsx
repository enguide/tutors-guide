// components/analytics/QuestionExplanationEngine.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import {
  DesmosExplanationEmbed,
  DesmosExpression,
  DesmosGraphBounds,
} from "@/components/tools/DesmosExplanationEmbed";
import {
  AlgebraicDerivationRail,
  DerivationStep,
} from "@/components/analytics/AlgebraicDerivationRail";
import { resolveTestAssetUrl } from "@/lib/contentPaths";
import { Compass, Workflow, Sparkles, Calculator } from "lucide-react";

interface QuestionExplanationEngineProps {
  explanation: string;
  category?: string;
  testId?: string;
  manifestBasePath?: string;
  domain?: string;
  skill?: string;
  questionNumber?: number;
}

interface SolutionTab {
  id: string;
  title: string;
  content: string;
}

/**
 * Converts custom inline semantic tokens ([[fade]], [[hl]], [[pivot]], [[ic]], [[dc]])
 * into data-attributed HTML spans while shielding LaTeX math blocks ($...$ and $$...$$).
 */
export function preprocessSemanticTokens(content: string): string {
  if (!content) return "";

  const mathTokens: string[] = [];
  let text = content.replace(/(\$\$[\s\S]*?\$\$|\$(?!\$)[^$\n]+?\$)/g, (match) => {
    mathTokens.push(match);
    return `XKMATHBLOCKTOKEN${mathTokens.length - 1}ENDX`;
  });

  text = text.replace(
    /\[\[blank\]\]/g,
    '<span data-rw-blank="true" aria-label="blank"></span>'
  );

  text = text.replace(
    /\[\[predict\]\]([\s\S]*?)\[\[\/predict\]\]/g,
    '<div data-rw-predict="true">$1</div>'
  );

  text = text.replace(
    /\[\[insight\]\]([\s\S]*?)\[\[\/insight\]\]/g,
    '<div data-rw-insight="true">$1</div>'
  );
  
  text = text.replace(
    /\[\[ans\]\]([\s\S]*?)\[\[\/ans\]\]/g,
    '<span data-rw-ans="true">$1</span>'
  );
  
  text = text.replace(
    /\[\[fade\]\]([\s\S]*?)\[\[\/fade\]\]/g,
    '<span data-rw-fade="true">$1</span>'
  );

  text = text.replace(
    /\[\[hl\]\]([\s\S]*?)\[\[\/hl\]\]/g,
    '<span data-act-highlight="true">$1</span>'
  );

  text = text.replace(
    /\[\[pivot\]\]([\s\S]*?)\[\[\/pivot\]\]/g,
    '<span data-rw-pivot="true">$1</span>'
  );

  text = text.replace(
    /\[\[ic\]\]([\s\S]*?)\[\[\/ic\]\]/g,
    '<span data-rw-clause="ic">$1</span>'
  );

  text = text.replace(
    /\[\[dc\]\]([\s\S]*?)\[\[\/dc\]\]/g,
    '<span data-rw-clause="dc">$1</span>'
  );

  text = text.replace(/XKMATHBLOCKTOKEN(\d+)ENDX/g, (_, index) => {
    return mathTokens[Number(index)] ?? "";
  });

  return text;
}

/**
 * 1. Safely extracts :::desmos ... ::: blocks into HTML placeholders
 */
function extractDesmosBlocks(content: string) {
  const desmosConfigs: Record<
    string,
    {
      expressions: DesmosExpression[];
      bounds?: DesmosGraphBounds;
      caption?: string;
      height?: number;
    }
  > = {};

  const processed = content.replace(
    /:::desmos\s*([\s\S]*?):::/g,
    (_, jsonStr) => {
      try {
        const cleaned = jsonStr.trim();
        const parsed = JSON.parse(cleaned);
        const placeholderId = `desmos-${Math.random().toString(36).substring(2, 9)}`;
        desmosConfigs[placeholderId] = parsed;
        return `<div data-desmos-id="${placeholderId}"></div>`;
      } catch (err) {
        console.error("Failed to parse Desmos JSON:", err, jsonStr);
        return `<div class="p-3 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs rounded border border-red-300">Error parsing Desmos configuration: Invalid JSON</div>`;
      }
    }
  );

  return { processed, desmosConfigs };
}

/**
 * 2. Safely extracts :::derivation ... ::: blocks into HTML placeholders
 */
function extractDerivationBlocks(content: string) {
  const derivationMap: Record<string, DerivationStep[]> = {};

  const processed = content.replace(/:::derivation\s*([\s\S]*?):::/g, (_, body) => {
    const rawSteps = body.split(/(?=== step:)/g);
    const steps: DerivationStep[] = [];

    rawSteps.forEach((raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed.startsWith("== step:")) return;

      const lines = trimmed.split("\n");
      const title = lines[0].replace("== step:", "").trim();

      let why = "";
      const mathLines: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith("-- why:")) {
          why = line.replace("-- why:", "").trim();
        } else {
          mathLines.push(line);
        }
      }

      steps.push({
        stepNumber: steps.length + 1,
        title,
        why: why || undefined,
        mathContent: preprocessSemanticTokens(mathLines.join("\n").trim()),
      });
    });

    const placeholderId = `deriv-${Math.random().toString(36).substring(2, 9)}`;
    derivationMap[placeholderId] = steps;
    return `<div data-derivation-id="${placeholderId}"></div>`;
  });

  return { processed, derivationMap };
}

/**
 * 3. Pre-extracts custom containers before tab regex matching
 */
function extractTabsAndBlocks(rawContent: string) {
  // Step A: Extract Desmos and Derivation blocks first to prevent inner ":::" collisions
  const { processed: contentWithDesmos, desmosConfigs } = extractDesmosBlocks(rawContent);
  const { processed: contentWithBoth, derivationMap } = extractDerivationBlocks(contentWithDesmos);

  // Step B: Match :::tabs ... :::
  const tabBlockRegex = /:::tabs([\s\S]*?):::(?:tabs)?/;
  const match = contentWithBoth.match(tabBlockRegex);

  if (!match) {
    return {
      hasTabs: false,
      preface: preprocessSemanticTokens(contentWithBoth),
      tabs: [] as SolutionTab[],
      postface: "",
      desmosConfigs,
      derivationMap,
    };
  }

  const preface = preprocessSemanticTokens(
    contentWithBoth.substring(0, match.index).trim()
  );
  const postface = preprocessSemanticTokens(
    contentWithBoth.substring(match.index! + match[0].length).trim()
  );
  const rawTabsBody = match[1];

  const tabSections = rawTabsBody.split(/(?=== tab:)/g);
  const tabs: SolutionTab[] = [];

  tabSections.forEach((section, idx) => {
    const trimmed = section.trim();
    if (!trimmed.startsWith("== tab:")) return;

    const firstLineEnd = trimmed.indexOf("\n");
    if (firstLineEnd === -1) {
      tabs.push({
        id: `tab-${idx}`,
        title: trimmed.substring(7).trim(),
        content: "",
      });
      return;
    }

    const title = trimmed.substring(7, firstLineEnd).trim();
    const tabContent = preprocessSemanticTokens(trimmed.substring(firstLineEnd).trim());

    tabs.push({
      id: `tab-${idx}`,
      title,
      content: tabContent,
    });
  });

  return {
    hasTabs: true,
    preface,
    tabs,
    postface,
    desmosConfigs,
    derivationMap,
  };
}

export const QuestionExplanationEngine: React.FC<QuestionExplanationEngineProps> = ({
  explanation,
  category,
  testId,
  manifestBasePath,
  domain,
  skill,
}) => {
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const { hasTabs, preface, tabs, postface, desmosConfigs, derivationMap } = useMemo(
    () => extractTabsAndBlocks(explanation),
    [explanation]
  );

  const activeTab = hasTabs && tabs.length > 0 ? tabs[activeTabIdx] || tabs[0] : null;

  const markdownComponents = useMemo(
    () => ({
      span: ({ node, children, ...props }: any) => {
        const isFade = props["data-rw-fade"] === "true";
        const isHighlight = props["data-act-highlight"] === "true";
        const isPivot = props["data-rw-pivot"] === "true";
        const clauseType = props["data-rw-clause"];

        if (isFade) {
          return (
            <span
              data-rw-fade="true"
              className="opacity-40 text-neutral-500 dark:text-neutral-400 transition-opacity duration-150"
              {...props}
            >
              {children}
            </span>
          );
        }

        if (isHighlight) {
          return (
            <span
              data-act-highlight="true"
              className="bg-amber-200/75 dark:bg-amber-400/25 text-neutral-950 dark:text-amber-100 font-medium rounded-[2px] px-1 py-0.5 transition-colors duration-150"
              {...props}
            >
              {children}
            </span>
          );
        }

        if (isPivot) {
          return (
            <span
              data-rw-pivot="true"
              className="bg-blue-500/10 dark:bg-blue-400/20 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500/60 font-semibold rounded-[2px] px-1 py-0.5"
              {...props}
            >
              {children}
            </span>
          );
        }

        if (clauseType === "ic") {
          return (
            <span
              data-rw-clause="ic"
              className="border-b-2 border-emerald-600/70 dark:border-emerald-400/70 pb-[1px]"
              {...props}
            >
              <sup className="text-[9px] font-mono font-bold uppercase tracking-tighter text-emerald-700 dark:text-emerald-300 mr-0.5 select-none">
                IC
              </sup>
              {children}
            </span>
          );
        }

        if (clauseType === "dc") {
          return (
            <span
              data-rw-clause="dc"
              className="border-b border-dashed border-amber-600/80 dark:border-amber-400/80 pb-[1px]"
              {...props}
            >
              <sup className="text-[9px] font-mono font-bold uppercase tracking-tighter text-amber-700 dark:text-amber-300 mr-0.5 select-none">
                DC
              </sup>
              {children}
            </span>
          );
        }

        return <span {...props}>{children}</span>;
      },

      div: ({ node, ...props }: any) => {
        const desmosId = props["data-desmos-id"];
        if (desmosId && desmosConfigs[desmosId]) {
          const config = desmosConfigs[desmosId];
          return (
            <DesmosExplanationEmbed
              id={desmosId}
              expressions={config.expressions}
              bounds={config.bounds}
              height={config.height}
              caption={config.caption}
            />
          );
        }

        const derivId = props["data-derivation-id"];
        if (derivId && derivationMap[derivId]) {
          return (
            <AlgebraicDerivationRail
              steps={derivationMap[derivId]}
              category={category}
              testId={testId}
              manifestBasePath={manifestBasePath}
            />
          );
        }

        return <div {...props} />;
      },

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
          <figure className="my-4 flex flex-col items-center w-full not-prose">
            <div className="p-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs max-w-full flex items-center justify-center">
              <img
                src={resolvedSrc}
                alt={alt || "Explanation diagram"}
                className={`max-h-[320px] max-w-full w-auto h-auto object-contain mx-auto select-none ${
                  isSvg
                    ? "dark:invert dark:contrast-200 dark:brightness-90 transition-[filter] duration-200"
                    : "rounded-[2px]"
                }`}
                loading="eager"
              />
            </div>
            {alt && (
              <figcaption className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 text-center tracking-tight font-mono">
                {alt}
              </figcaption>
            )}
          </figure>
        );
      },

      h3: ({ children }: any) => (
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mt-6 mb-3 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-1.5 not-prose">
          <Workflow className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          {children}
        </h3>
      ),

      blockquote: ({ children }: any) => (
        <blockquote className="my-4 border-l-3 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 px-4 py-3 rounded-r-sm text-neutral-800 dark:text-neutral-200 text-[13.5px] leading-relaxed not-italic">
          {children}
        </blockquote>
      ),

      table: ({ children }: any) => (
        <div className="my-5 w-full overflow-x-auto not-prose border border-neutral-200 dark:border-neutral-800 rounded-md">
          <table className="w-full border-collapse text-[13px] font-sans text-neutral-800 dark:text-neutral-200">
            {children}
          </table>
        </div>
      ),

      thead: ({ children }: any) => (
        <thead className="bg-neutral-100 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700 font-semibold text-neutral-900 dark:text-neutral-100">
          {children}
        </thead>
      ),

      tr: ({ children }: any) => (
        <tr className="border-b border-neutral-200 dark:border-neutral-800/60 last:border-b-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
          {children}
        </tr>
      ),

      th: ({ children }: any) => (
        <th className="px-3.5 py-2 text-left font-semibold">{children}</th>
      ),

      td: ({ children }: any) => (
        <td className="px-3.5 py-2.5 align-top">{children}</td>
      ),

      ul: ({ children }: any) => (
        <ul className="space-y-2.5 my-3 list-none pl-0 not-prose">{children}</ul>
      ),

      li: ({ children }: any) => (
        <li className="flex items-start text-[14px] leading-relaxed text-neutral-800 dark:text-neutral-200">
          <span className="w-4 shrink-0 text-blue-500 font-bold mr-1.5 select-none">
            ›
          </span>
          <div className="flex-1 min-w-0">{children}</div>
        </li>
      ),

      ol: ({ children }: any) => (
        <ol className="list-decimal pl-5 space-y-1.5 my-3 text-[14px] leading-relaxed">
          {children}
        </ol>
      ),

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
          return <div className="my-3 last:mb-0">{children}</div>;
        }

        return (
          <p className="mb-3.5 last:mb-0 text-[14px] leading-relaxed text-neutral-800 dark:text-neutral-200">
            {children}
          </p>
        );
      },

      strong: ({ children }: any) => (
        <strong className="font-semibold text-neutral-950 dark:text-white">
          {children}
        </strong>
      ),

      hr: () => (
        <hr className="my-5 border-neutral-200 dark:border-neutral-800" />
      ),
    }),
    [desmosConfigs, derivationMap, category, testId, manifestBasePath]
  );

  return (
    <div className="mt-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden font-sans">
      {/* Header Banner */}
      <div className="px-5 py-3.5 bg-linear-to-r from-blue-50 via-slate-50 to-white dark:from-blue-950/40 dark:via-neutral-900 dark:to-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
              Explanation
            </h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {domain ? `${domain} • ` : ""}
              {skill || "Methodology & Traps"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
            <Sparkles className="w-3 h-3" /> dSAT Calibrated
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 md:p-8">
        {/* Preface */}
        {preface && (
          <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-900 dark:text-neutral-100 font-sans">
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
              {preface}
            </ReactMarkdown>
          </div>
        )}

        {/* Tabbed Solutions */}
        {hasTabs && tabs.length > 0 && (
          <div className="my-6 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/40">
            {/* Tab Headers */}
            <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900 px-3 pt-2 gap-1 overflow-x-auto no-scrollbar">
              {tabs.map((tab, idx) => {
                const isActive = activeTabIdx === idx;
                const isDesmos = tab.title.toLowerCase().includes("desmos");
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabIdx(idx)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all border-b-2 rounded-t-sm whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "border-blue-600 bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs"
                        : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                  >
                    {isDesmos ? (
                      <Calculator className="w-3.5 h-3.5" />
                    ) : (
                      <Workflow className="w-3.5 h-3.5" />
                    )}
                    {tab.title}
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="p-5 md:p-6 bg-white dark:bg-neutral-900">
              {activeTab && (
                <div className="prose prose-neutral dark:prose-invert max-w-none font-sans">
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
                    {activeTab.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Postface */}
        {postface && (
          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 prose prose-neutral dark:prose-invert max-w-none font-sans">
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
              {postface}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};