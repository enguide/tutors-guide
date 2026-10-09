// app/tests/[category]/[testId]/[sectionId]/page.tsx
import { notFound } from "next/navigation";
import { getTestMetadata, getSectionById } from "@/lib/contentLoader";
import { resolveSectionConfig } from "@/lib/examConfigRegistry";
import { SupportedExamCategory } from "@/types/examConfig";
import { ExamClient } from "@/components/exam/ExamClient";

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

  const metadata = await getTestMetadata(category, testId);
  const section = await getSectionById(category, testId, sectionId);

  if (!metadata || !section) {
    notFound();
  }

  // 1. Locate the section entry in metadata.json to pull its manifest config
  const manifestSection = metadata.sections.find((s) => s.id === sectionId);

  // 2. Cascade overrides: Category Defaults -> metadata.config -> metadata.sections[i].config -> frontmatter.config
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