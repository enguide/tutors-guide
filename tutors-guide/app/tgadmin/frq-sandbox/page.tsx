// app/tgadmin/frq-sandbox/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getTestMetadata, getSectionById, ensureTestInDatabase } from "@/lib/contentLoader";
import { FrqSandboxClient } from "./FrqSandboxClient";

export const instant = false;

export default async function FrqSandboxPage() {
  await connection();
  const session = await auth();
  const userRole = session?.user?.role;

  if (!session || (userRole !== "ADMIN" && userRole !== "ORG_ADMIN" && userRole !== "TUTOR")) {
    redirect("/login");
  }

  const categorySlug = "ap_calc";
  const testId = "ap-calc-ab-practice-1";
  const sectionId = "ap-calc-ab-t1-s2a";

  const [metadata, section] = await Promise.all([
    getTestMetadata(categorySlug, testId),
    getSectionById(categorySlug, testId, sectionId),
  ]);

  if (!metadata || !section) {
    return (
      <div className="p-8 text-red-400 font-mono text-sm">
        Could not load {testId} / {sectionId}. Verify content files exist.
      </div>
    );
  }

  // Guarantees Test & Section records exist in Postgres for FrqSubmission foreign keys
  await ensureTestInDatabase(metadata);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
            Developer Test Harness
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-1">
            FRQ Optical Capture & Homography Sandbox
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Test mobile QR hand-off, 4-corner fiducial deskewing, and sub-part cropping for{" "}
            <code className="text-zinc-200">{testId}</code> ({section.frontmatter.sectionTitle})
            without completing an exam.
          </p>
        </div>

        <FrqSandboxClient
          testId={testId}
          sectionId={sectionId}
          questions={section.frontmatter.questions}
        />
      </div>
    </div>
  );
}