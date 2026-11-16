// app/dashboard/layout.tsx
import { ReactNode } from "react";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StudentNavbar } from "@/components/navigation/StudentNavbar";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 text-foreground flex flex-col">
      <StudentNavbar
        user={{ name: session.user.name, email: session.user.email }}
        onSignOut={handleSignOut}
      />
      <div className="flex-1 pb-12">{children}</div>
    </div>
  );
}