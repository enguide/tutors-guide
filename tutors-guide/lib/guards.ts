// lib/guards.ts (additions)
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export async function requireStaffSession() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/tgadmin`);
  }

  const allowedRoles: Role[] = [Role.ORG_ADMIN, Role.TUTOR, Role.ADMIN];
  if (!allowedRoles.includes(session.user.role as Role)) {
    redirect(`/dashboard?error=unauthorized_staff_access`);
  }

  return session.user;
}

export async function requireOrgAdminSession() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/tgadmin`);
  }

  const allowedRoles: Role[] = [Role.ORG_ADMIN, Role.ADMIN];
  if (!allowedRoles.includes(session.user.role as Role)) {
    redirect(`/tgadmin?error=admin_only_access`);
  }

  return session.user;
}