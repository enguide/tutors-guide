// app/tgadmin/content-preview/[category]/[testId]/page.tsx
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Role } from "@prisma/client";
import {
  getTestMetadata,
  getSectionById,
  resolveTestStatus,
} from "@/lib/contentLoader";
import { ContentPreviewViewer } from "@/components/tgadmin/ContentPreviewViewer";

interface PageProps {
  params: Promise<{ category: string; testId: string }>;
}

const STATUS_BADGE_STYLES: Record<string, { label: string; className: string }> = {
  draft: {
    label: "DRAFT — Hidden from Students",
    className:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  },
  archived: {
    label: "ARCHIVED — Hidden from Students",
    className:
      "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30",
  },
  published: {
    label: "PUBLISHED — Live on Student Dashboards",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  },
};

export default async function AdminTestPreviewPage({ params }: PageProps) {
  const { category, testId } = await params;
  const session = await auth();

  if (session?.user?.role !== Role.ADMIN) {
    redirect("/dashboard?notice=admin_required");
  }

  const metadata = await getTestMetadata(category.toLowerCase(), testId);
  if (!metadata) notFound();

  const status = resolveTestStatus(metadata);
  const statusBadge = STATUS_BADGE_STYLES[status] || STATUS_BADGE_STYLES.published;

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
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-600">
            {metadata.category} Content Inspection
          </span>
          <span
            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border ${statusBadge.className}`}
          >
            {statusBadge.label}
          </span>
        </div>
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