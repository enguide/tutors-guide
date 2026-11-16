// components/navigation/StudentNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Users,
  LogOut,
  GraduationCap,
} from "lucide-react";

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
  const isInsideExamRunner =
    pathname.startsWith("/tests/") && !pathname.includes("/results");
  if (isInsideExamRunner) {
    return null;
  }

  const isDashboard = pathname === "/dashboard";
  const isTests = pathname.startsWith("/dashboard/tests");
  const isResults =
    pathname.startsWith("/dashboard/results") ||
    (pathname.startsWith("/tests/") && pathname.includes("/results"));
  const isMentors = pathname.startsWith("/settings/mentors");

  const navLinks = [
    {
      href: "/dashboard",
      title: "Overview",
      icon: LayoutDashboard,
      isActive: isDashboard,
    },
    {
      href: "/dashboard/tests",
      title: "Practice Tests",
      icon: BookOpen,
      isActive: isTests,
    },
    {
      href: "/dashboard/results",
      title: "My Results",
      icon: BarChart3,
      isActive: isResults,
    },
    {
      href: "/settings/mentors",
      title: "Mentors",
      icon: Users,
      isActive: isMentors,
    },
  ];

  return (
    <header className="border-b border-border bg-card sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand & Nav */}
        <div className="flex items-center gap-2 sm:gap-5 md:gap-8 min-w-0">
          <Link
            href="/dashboard"
            className="min-h-10 flex items-center gap-2 font-black tracking-tight text-base sm:text-lg shrink-0"
            title="Tutors Guide Home"
          >
            <div className="p-1.5 bg-primary text-primary-foreground">
              <GraduationCap size={18} />
            </div>
            <div className="flex flex-row font-bold">
              <span className="hidden md:inline">TheTutors</span>
              <span className="hidden md:inline text-foreground/75">Guide</span>
            </div>
          </Link>

          {/* Student Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="flex items-center gap-0.5 sm:gap-1.5 md:gap-2 text-xs font-bold shrink-0"
          >
            {navLinks.map(({ href, title, icon: Icon, isActive }) => (
              <Link
                key={href}
                href={href}
                title={title}
                aria-label={title}
                aria-current={isActive ? "page" : undefined}
                className={`min-h-10 min-w-10 flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 border-b-2 transition-colors ${
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={16} className="shrink-0" />
                {/* Active tab displays its label on all screen sizes; inactive tabs show on lg+ */}
                <span className={`whitespace-nowrap ${isActive ? "inline" : "hidden lg:inline"}`}>
                  {title}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Identity & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs shrink-0">
          <div className="hidden md:flex flex-col text-right max-w-44 truncate">
            <span className="font-bold text-foreground truncate">
              {user.name || "Student"}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono truncate">
              {user.email}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSignOut()}
            title="Sign Out"
            aria-label="Sign Out"
            className="min-h-10 min-w-10 flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 border border-input hover:bg-muted text-muted-foreground hover:text-foreground font-semibold transition-colors cursor-pointer rounded-none"
          >
            <LogOut size={15} className="shrink-0" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}