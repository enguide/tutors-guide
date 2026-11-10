// app/tgadmin/content-preview/[category]/[testId]/page.tsx
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { getTestMetadata, getSectionById } from "@/lib/contentLoader";
import { ContentPreviewViewer } from "@/components/tgadmin/ContentPreviewViewer";

interface PageProps {
  params: Promise<{ category: string; testId: string }>;
}

export default async function AdminTestPreviewPage({ params }: PageProps) {
  const { category, testId } = await params;
  const session = await auth();

  if (session?.user?.role !== Role.ADMIN) {
    redirect("/dashboard?notice=admin_required");
  }

  const metadata = await getTestMetadata(category.toLowerCase(), testId);
  if (!metadata) notFound();

  // Load all sections in parallel
  const sectionContents = await Promise.all(
    metadata.sections.map(async (sec) => {
      const parsed = await getSectionById(category.toLowerCase(), testId, sec.id);
      return { meta: sec, parsed };
    })
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-blue-600">
          {metadata.category} Content Inspection
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
          {metadata.title}
        </h1>
        {metadata.description && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {metadata.description}
          </p>
        )}
      </div>

      {/* Interactive Content Viewer */}
      <ContentPreviewViewer metadata={metadata} sections={sectionContents} />
    </div>
  );
}