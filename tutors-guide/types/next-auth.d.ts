import { Role, Category } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: Role;
      orgId?: string | null;
      entitlements: Category[];
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: Role;
    orgId?: string | null;
    entitlements: Category[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    orgId?: string | null;
    entitlements: Category[];
  }
}