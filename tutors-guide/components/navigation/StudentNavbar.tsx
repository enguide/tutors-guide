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
      <div className="max-w-6xl mx-auto px-3 sm:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand & Nav */}
        <div className="flex items-center gap-2 sm:gap-6 md:gap-8 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-black tracking-tight text-base sm:text-lg shrink-0"
            title="Tutors Guide Home"
          >
            <div className="p-1.5 bg-primary text-primary-foreground">
              <GraduationCap size={18} />
            </div>
            <span className="hidden md:inline">Tutors Guide</span>
          </Link>

          {/* Student Navigation Links */}
          <nav className="flex items-center gap-0.5 sm:gap-1 md:gap-2 text-xs font-bold shrink-0">
            <Link
              href="/dashboard"
              title="Overview"
              aria-label="Overview"
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 transition-colors border-b-2 ${
                isDashboard
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutDashboard size={16} className="shrink-0" />
              <span className="hidden lg:inline">Overview</span>
            </Link>

            <Link
              href="/dashboard/tests"
              title="Practice Tests"
              aria-label="Practice Tests"
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 transition-colors border-b-2 ${
                isTests
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen size={16} className="shrink-0" />
              <span className="hidden lg:inline">Practice Tests</span>
            </Link>

            <Link
              href="/dashboard/results"
              title="My Results"
              aria-label="My Results"
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 transition-colors border-b-2 ${
                isResults
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 size={16} className="shrink-0" />
              <span className="hidden lg:inline">My Results</span>
            </Link>

            <Link
              href="/settings/mentors"
              title="Mentors & Privacy"
              aria-label="Mentors & Privacy"
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 transition-colors border-b-2 ${
                isMentors
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users size={16} className="shrink-0" />
              <span className="hidden lg:inline">Mentors</span>
            </Link>
          </nav>
        </div>

        {/* User Identity & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs shrink-0">
          <div className="hidden md:flex flex-col text-right max-w-[160px] truncate">
            <span className="font-bold text-foreground truncate">{user.name || "Student"}</span>
            <span className="text-[10px] text-muted-foreground font-mono truncate">{user.email}</span>
          </div>

          <button
            onClick={() => onSignOut()}
            title="Sign Out"
            aria-label="Sign Out"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border border-input hover:bg-muted text-muted-foreground hover:text-foreground font-semibold transition-colors cursor-pointer rounded-none"
          >
            <LogOut size={14} className="shrink-0" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}