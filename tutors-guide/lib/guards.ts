import { auth } from "@/lib/auth";
import { Category } from "@prisma/client";
import { redirect } from "next/navigation";

export async function requireCategoryEntitlement(requiredCategory: Category) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/dashboard`);
  }

  // ADMIN bypasses entitlement checks
  if (session.user.role === "ADMIN") {
    return session.user;
  }

  const hasAccess = session.user.entitlements?.includes(requiredCategory);

  if (!hasAccess) {
    // Redirect to upgrade or dashboard with an unauthorized notice
    redirect(`/dashboard?error=unauthorized_category&required=${requiredCategory}`);
  }

  return session.user;
}