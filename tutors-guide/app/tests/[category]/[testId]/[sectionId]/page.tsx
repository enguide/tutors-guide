// app/tests/[category]/[testId]/[sectionId]/page.tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  getTestMetadata,
  getSectionById,
  ensureTestInDatabase,
} from "@/lib/contentLoader";
import { resolveSectionConfig } from "@/lib/examConfigRegistry";
import { SupportedExamCategory } from "@/types/examConfig";
import { ExamClient } from "@/components/exam/ExamClient";
import { Category } from "@prisma/client";

export const instant = false;

interface ExamPageRouteProps {
  params: Promise<{
    category: string;
    testId: string;
    sectionId: string;
  }>;
}

export default async function ExamSectionPage({ params }: ExamPageRouteProps) {
  const { category, testId, sectionId } = await params;
  const examCat = category.toUpperCase() as SupportedExamCategory;

  // 1. Authenticate user, enforce STUDENT role, & verify category entitlement
const session = await auth();

if (!session?.user) {
  redirect(`/login?callbackUrl=/tests/${category}/${testId}/${sectionId}`);
}

const userRole = session.user.role;
const isAdmin = userRole === "ADMIN";
const isStudent = userRole === "STUDENT";

// ORG_ADMIN and TUTOR are barred from taking tests
if (!isAdmin && !isStudent) {
  redirect(`/dashboard?notice=staff_restricted`);
}

const hasEntitlement = session.user.entitlements?.includes(examCat as unknown as Category);

if (!isAdmin && !hasEntitlement) {
  redirect(`/dashboard?error=unauthorized_category&required=${examCat}`);
}

  // 2. Load test metadata and section data
  const metadata = await getTestMetadata(category, testId);
  const section = await getSectionById(category, testId, sectionId);

  if (!metadata || !section) {
    notFound();
  }

  // Auto-sync: Guarantee this Test & Section exist in PostgreSQL before client boots
  await ensureTestInDatabase(metadata);

  // 3. Locate the section entry in metadata.json to pull its manifest config
  const manifestSection = metadata.sections.find((s) => s.id === sectionId);

  // 4. Cascade overrides: Category Defaults -> metadata.config -> metadata.sections[i].config -> frontmatter.config
  const effectiveConfig = resolveSectionConfig(
    examCat,
    metadata.config,
    {
      ...(manifestSection?.config || {}),
      ...(section.frontmatter.config || {}),
    }
  );

  return (
    <ExamClient
      metadata={metadata}
      section={section}
      effectiveConfig={effectiveConfig}
      category={category}
      testId={testId}
    />
  );
}