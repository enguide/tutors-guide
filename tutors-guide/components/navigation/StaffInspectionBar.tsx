// components/navigation/StaffInspectionBar.tsx
import Link from "next/link";
import { ArrowLeft, Users, ShieldCheck } from "lucide-react";

interface StaffInspectionBarProps {
  student: {
    id: string;
    name: string;
    email: string;
  };
}

export function StaffInspectionBar({ student }: StaffInspectionBarProps) {
  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-337.5 mx-auto px-4 sm:px-8 h-14 flex items-center justify-between text-xs">
        {/* Left: Navigation back to student inspection view */}
        <div className="flex items-center gap-4">
          <Link
            href={`/tgadmin/student/${student.id}`}
            className="flex items-center gap-1.5 font-bold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Student Profile</span>
          </Link>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <Link
            href="/tgadmin"
            className="text-slate-400 hover:text-white transition-colors hidden sm:inline-flex items-center gap-1"
          >
            <Users size={13} />
            <span>Cohort Roster</span>
          </Link>
        </div>

        {/* Right: Inspection Target Metadata */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 font-mono text-[11px] rounded-none">
            <ShieldCheck size={13} />
            <span>Inspecting: <strong>{student.name}</strong> ({student.email})</span>
          </div>
        </div>
      </div>
    </div>
  );
}