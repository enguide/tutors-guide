// app/tgadmin/student/[studentId]/page.tsx
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { getStudentExamsForStaff } from "@/actions/observability";
import { requireStaffSession } from "@/lib/guards";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, ChevronRight } from "lucide-react";

export const instant = false;

interface StudentInspectionPageProps {
  params: Promise<{ studentId: string }>;
}

async function StudentInspectionContent({ paramsPromise }: { paramsPromise: Promise<{ studentId: string }> }) {
  await connection();
  await requireStaffSession();

  const { studentId } = await paramsPromise;

  let data;
  try {
    data = await getStudentExamsForStaff(studentId);
  } catch (err) {
    notFound();
  }

  const { student, exams } = data;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/tgadmin"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} /> Back to Cohort Roster
      </Link>

      {/* Student Banner */}
      <div className="bg-card border border-slate-200 dark:border-slate-800 rounded-none p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
            Student Inspection Profile
          </span>
          <h1 className="text-2xl font-black">{student.name}</h1>
          <p className="text-xs text-muted-foreground font-mono">{student.email}</p>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
          <div className="text-center">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Attempts</span>
            <div className="text-2xl font-black">{exams.length}</div>
          </div>
        </div>
      </div>

      {/* Completed Diagnostics List */}
      <div className="space-y-3">
        <h2 className="text-base font-bold tracking-tight">Completed Diagnostic Exams</h2>

        {exams.length > 0 ? (
          <div className="border border-slate-200 dark:border-slate-800 bg-card rounded-none divide-y divide-border shadow-xs">
            {exams.map((exam) => (
              <div
                key={exam.testId}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 border border-border bg-muted/40 font-bold uppercase">
                      {exam.category}
                    </span>
                    <h3 className="font-bold text-sm text-foreground">{exam.testTitle}</h3>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {new Date(exam.completedAt).toLocaleDateString()}
                    </span>
                    {exam.percentile && <span>Percentile: {exam.percentile}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Score</span>
                    <div className="text-xl font-black">{exam.compositeScore ?? "—"}</div>
                  </div>

                  <Link
                    href={`/tests/${exam.category.toLowerCase()}/${exam.testId}/results?studentId=${student.id}`}
                    className="flex items-center gap-1 px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-muted font-bold text-xs transition-colors rounded-none"
                  >
                    <span>View Telemetry</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed rounded-none bg-card text-muted-foreground text-xs">
            This student has not completed any full diagnostic exams yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentInspectionPage({ params }: StudentInspectionPageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-none" />
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-none" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-none" />
        </div>
      }
    >
      <StudentInspectionContent paramsPromise={params} />
    </Suspense>
  );
}