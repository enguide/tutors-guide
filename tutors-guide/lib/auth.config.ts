import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // pages: {
  //   signIn: "/login",
  // },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tgpackage = user.tgpackage;
        token.orgId = user.orgId;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.tgpackage = token.tgpackage;
        session.user.orgId = token.orgId;
      }
      return session;
    },
  },
  providers: [], // Configured with Node dependencies in auth.ts
} satisfies NextAuthConfig;