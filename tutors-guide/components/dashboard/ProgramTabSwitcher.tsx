// components/dashboard/ProgramTabSwitcher.tsx
"use client";

import Link from "next/link";
import { Category } from "@prisma/client";

interface ProgramTabSwitcherProps {
  userEntitlements: Category[];
  activeProgram: Category;
}

export function ProgramTabSwitcher({
  userEntitlements,
  activeProgram,
}: ProgramTabSwitcherProps) {
  if (userEntitlements.length <= 1) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
          Active Program:
        </span>
        {userEntitlements.length === 1 ? (
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary">
            {userEntitlements[0]}
          </span>
        ) : (
          <span className="text-xs text-amber-500 font-medium">None</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
        Active Program:
      </span>
      <div className="flex items-center gap-1.5">
        {userEntitlements.map((cat) => {
          const isSelected = cat === activeProgram;
          return (
            <Link
              key={cat}
              href={`/dashboard?program=${cat}`}
              className={`text-[11px] font-mono font-bold px-2.5 py-1 transition-colors border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>
    </div>
  );
}