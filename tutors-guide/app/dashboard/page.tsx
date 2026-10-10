import { auth, signOut } from "@/lib/auth";
import Link from "next/link";
import { ShieldCheck, LogOut, ArrowRight, Loader2 } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";

async function SessionDiagnosticContent() {
  // Explicitly signals to Next.js 16's cacheComponents engine
  // that this component connects to dynamic runtime request data (cookies/headers)
  await connection();
  const session = await auth();

  return (
    <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[4px] p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h1 className="text-lg font-semibold text-white">Session Diagnostic</h1>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-[4px] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">User Details</label>
          <div className="bg-slate-950 p-3 rounded-[4px] border border-slate-800 text-xs font-mono">
            <p><span className="text-slate-500">Name:</span> {session?.user?.name || "Not logged in"}</p>
            <p><span className="text-slate-500">Email:</span> {session?.user?.email || "None"}</p>
            <p><span className="text-slate-500">Role:</span> {session?.user?.role || "None"}</p>
            <p><span className="text-slate-500">Org ID:</span> {session?.user?.orgId || "None"}</p>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Hydrated Entitlements</label>
          <div className="bg-slate-950 p-3 rounded-[4px] border border-slate-800 flex flex-wrap gap-2">
            {session?.user?.entitlements && session.user.entitlements.length > 0 ? (
              session.user.entitlements.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-[4px]"
                >
                  {cat}
                </span>
              ))
            ) : (
              <span className="text-xs text-amber-400">No active entitlements</span>
            )}
          </div>
        </div>

        {session?.user?.role === "STUDENT" || session?.user?.role === "ADMIN" ? (
  <div className="pt-2 flex gap-3">
    <Link
      href="/tests/sat/sat-practice-1/reading-writing-module-1"
      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-medium rounded-[4px] transition-colors"
    >
      Launch SAT Section <ArrowRight className="w-3.5 h-3.5" />
    </Link>
  </div>
) : (
  <div className="p-3 bg-slate-950 border border-slate-800 rounded-[4px] text-xs text-slate-400">
    <p className="font-semibold text-slate-300 mb-0.5">Staff Portal Access</p>
    Staff and institution administrators do not consume test licenses. Student roster management and reporting tools will appear here.
  </div>
)}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[4px] p-6 shadow-2xl flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          </div>
        }
      >
        <SessionDiagnosticContent />
      </Suspense>
    </div>
  );
}