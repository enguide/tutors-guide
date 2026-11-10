// app/tgadmin/content-preview/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { discoverAllContent } from "@/lib/contentLoader";
import Link from "next/link";

export default async function AdminContentCatalogPage() {
  const session = await auth();

  // Strict Global ADMIN Check (excludes ORG_ADMIN, TUTOR, STUDENT)
  if (session?.user?.role !== Role.ADMIN) {
    redirect("/dashboard?notice=admin_required");
  }

  const catalog = await discoverAllContent();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Authoritative Content Registry & Previews
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Dynamic preview for item stems, stimulus passages, scoring keys, and curriculum explanations across all supported exam categories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalog.map((catGroup) => (
          <div key={catGroup.category} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 uppercase tracking-wide">
                {catGroup.category}
              </span>
              <h2 className="text-xl font-semibold text-slate-900 mt-3 mb-2">
                {catGroup.category} Test Suite
              </h2>
              <ul className="divide-y divide-slate-100 mt-4">
                {catGroup.tests.map((t) => (
                  <li key={t.testId} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-800">{t.title}</div>
                      <div className="text-xs text-slate-500">{t.sectionsCount} Sections</div>
                    </div>
                    <Link
                      href={`/tgadmin/content-preview/${catGroup.category.toLowerCase()}/${t.testId}`}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      Inspect Items →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}