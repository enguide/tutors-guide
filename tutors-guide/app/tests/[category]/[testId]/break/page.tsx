// app/tests/[category]/[testId]/break/page.tsx
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { getTestMetadata } from "@/lib/contentLoader";
import { BreakClient } from "./BreakClient";

export const instant = false;

interface BreakPageProps {
  params: Promise<{
    category: string;
    testId: string;
  }>;
}

export default async function BreakPage({ params }: BreakPageProps) {
  await connection();

  const { category, testId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/tests/${category}/${testId}/break`);
  }

  const metadata = await getTestMetadata(category, testId);
  if (!metadata) notFound();

  const cookieStore = await cookies();
  const breakCookie = cookieStore.get(`break_${testId}`);

  if (!breakCookie?.value) {
    redirect(`/tests/${category}/${testId}`);
  }

  const targetEndTime = parseInt(breakCookie.value, 10);

  return (
    <BreakClient
      testId={testId}
      category={category}
      targetEndTime={targetEndTime}
    />
  );
}