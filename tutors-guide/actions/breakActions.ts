// actions/breakActions.ts
"use server";

import { cookies } from "next/headers";

export async function clearBreakCookieAction(testId: string) {
  const cookieStore = await cookies();
  cookieStore.delete(`break_${testId}`);
}