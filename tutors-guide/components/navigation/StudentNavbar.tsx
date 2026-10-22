// components/navigation/StudentNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, BarChart3, Users, LogOut, GraduationCap } from "lucide-react";

interface StudentNavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  onSignOut: () => Promise<void>;
}

export function StudentNavbar({ user, onSignOut }: StudentNavbarProps) {
  const pathname = usePathname();

  // Completely hide the student navbar when inside an active exam runner
  const isInsideExamRunner = pathname.startsWith("/tests/") && !pathname.includes("/results");
  if (isInsideExamRunner) {
    return null;
  }

  const isDashboard = pathname === "/dashboard";
  const isTests = pathname.startsWith("/dashboard/tests");
  const isResults = pathname.startsWith("/dashboard/results") || (pathname.startsWith("/tests/") && pathname.includes("/results"));
  const isMentors = pathname.startsWith("/settings/mentors");

  return (
    <header className="border-b border-border bg-card sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-black tracking-tight text-base sm:text-lg">
            <div className="p-1.5 bg-primary text-primary-foreground">
              <GraduationCap size={18} />
            </div>
            <span>Tutors Guide</span>
          </Link>

          {/* Student Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 text-xs font-bold">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-2 transition-colors border-b-2 ${
                isDashboard
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutDashboard size={14} />
              <span className="hidden sm:inline">Overview</span>
            </Link>

            <Link
              href="/dashboard/tests"
              className={`flex items-center gap-1.5 px-3 py-2 transition-colors border-b-2 ${
                isTests
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen size={14} />
              <span>Practice Tests</span>
            </Link>

            <Link
              href="/dashboard/results"
              className={`flex items-center gap-1.5 px-3 py-2 transition-colors border-b-2 ${
                isResults
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 size={14} />
              <span>My Results</span>
            </Link>

            <Link
              href="/settings/mentors"
              className={`flex items-center gap-1.5 px-3 py-2 transition-colors border-b-2 ${
                isMentors
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users size={14} />
              <span className="hidden sm:inline">Mentors</span>
            </Link>
          </nav>
        </div>

        {/* User Identity & Sign Out */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-bold text-foreground">{user.name || "Student"}</span>
            <span className="text-[10px] text-muted-foreground font-mono">{user.email}</span>
          </div>

          <button
            onClick={() => onSignOut()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-input hover:bg-muted text-muted-foreground hover:text-foreground font-semibold transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}