// app/test-preview/page.tsx
import { getTestMetadata, getSectionById } from "@/lib/contentLoader";
import { MarkdownQuestionRenderer } from "@/components/MarkdownQuestionRenderer";

export default async function TestPreviewPage() {
  const category = "sat";
  const testId = "sat-practice-1";

  const metadata = await getTestMetadata(category, testId);
  const readingSection = await getSectionById(category, testId, "sat-practice-1-s1");
  const mathSection = await getSectionById(category, testId, "sat-practice-1-s2");

  if (!metadata || !readingSection || !mathSection) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Content</h1>
        <p className="mt-2 text-slate-600">
          Could not find metadata or markdown sections for <code>{testId}</code>. Ensure the content files exist in <code>content/tests/sat/sat-practice-1/</code>.
        </p>
      </main>
    );
  }

  const sectionsToDisplay = [readingSection, mathSection];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Test Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {metadata.category} Diagnostic Preview
          </span>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {metadata.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {metadata.description}
          </p>
        </header>

        {/* Section Previews */}
        {sectionsToDisplay.map(({ frontmatter, content }) => (
          <section
            key={frontmatter.sectionId}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  {frontmatter.sectionTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  ID: <code className="font-mono">{frontmatter.sectionId}</code> | Time Limit: {Math.floor(frontmatter.timeLimit / 60)} mins
                </p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Order: {frontmatter.sectionOrder}
              </span>
            </div>

            {/* Markdown Body Passage / Instructions */}
            {content.trim() && (
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Passage / Module Context
                </span>
                <MarkdownQuestionRenderer content={content} />
              </div>
            )}

            {/* Questions Rendered from Frontmatter */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Questions ({frontmatter.questions.length})
              </h3>

              {frontmatter.questions.map((question) => (
                <div
                  key={question.id}
                  className="border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Question {question.questionNumber}
                    </span>
                    <div className="flex gap-2">
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-mono">
                        {question.questionType}
                      </span>
                      <span className="text-xs bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-2 py-0.5 rounded font-medium">
                        Key: {question.correctAnswer}
                      </span>
                    </div>
                  </div>

                  {/* Render Question Prompt with Math Support */}
                  <MarkdownQuestionRenderer content={question.prompt} />

                  {/* Multiple Choice Options */}
                  {question.questionType === "MC" && question.options && (
                    <div className="grid grid-cols-1 gap-2 pt-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm"
                        >
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {option.id}.
                          </span>
                          <span className="text-slate-800 dark:text-slate-200">
                            {option.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Free Response Input Placeholder */}
                  {question.questionType === "FR" && (
                    <div className="pt-2">
                      <div className="w-48 px-3 py-2 border border-dashed border-slate-300 dark:border-slate-700 rounded text-xs text-slate-400 bg-slate-50 dark:bg-slate-950 font-mono">
                        [Student grid-in input]
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}