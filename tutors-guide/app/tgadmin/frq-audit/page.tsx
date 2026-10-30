// app/tgadmin/frq-audit/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getPendingAuditCrops } from "@/actions/frqAudit";
import { AuditQueueClient } from "./AuditQueueClient";

export const instant = false;

export default async function FrqAuditPage() {
  await connection();
  const session = await auth();
  const userRole = session?.user?.role;

  if (!session || (userRole !== "ADMIN" && userRole !== "ORG_ADMIN" && userRole !== "TUTOR")) {
    redirect("/login");
  }

  const res = await getPendingAuditCrops();
  const crops = res.crops || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">FRQ Human Review Queue</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Resolve ambiguous strokes, low vision agreement flags, or student-contested evaluations.
          </p>
        </div>

        <AuditQueueClient initialCrops={crops} />
      </div>
    </div>
  );
}