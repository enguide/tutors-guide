// app/tgadmin/layout.tsx
import { ReactNode } from "react";
import { connection } from "next/server";
import { requireStaffSession } from "@/lib/guards";
import Link from "next/link";
import { Building2, LogOut, BookOpen } from "lucide-react";
import { signOut } from "@/lib/auth";
import { Role } from "@prisma/client";

// Opt out of static prerendering for this authenticated layout
export const instant = false;

export default async function TgAdminLayout({ children }: { children: ReactNode }) {
  await connection();
  const staff = await requireStaffSession();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground flex flex-col">
      {/* Header Bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/tgadmin" className="flex items-center gap-2 font-black tracking-tight text-base sm:text-lg">
              <Building2 className="text-primary" size={20} />
              <span>Institutional & Tutor Portal</span>
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Link href="/tgadmin" className="text-foreground hover:text-primary transition-colors">
                Roster & Telemetry
              </Link>

              {staff.role === Role.ADMIN && (
                <Link
                  href="/tgadmin/content-preview"
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                >
                  <BookOpen size={14} />
                  <span>Content Preview</span>
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-bold">{staff.name || staff.email}</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">{staff.role}</span>
            </div>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-input hover:bg-muted font-bold transition-colors cursor-pointer text-xs"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Administrative Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">{children}</main>
    </div>
  );
}