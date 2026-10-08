import { Role, Package } from "@prisma/client";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      tgpackage: Package;
      orgId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    tgpackage: Package;
    orgId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    tgpackage: Package;
    orgId?: string | null;
  }
}