import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { TOTP } from "otplib";
import { prisma } from "./prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorCode: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);
        const twoFactorCode = credentials.twoFactorCode
          ? String(credentials.twoFactorCode).trim()
          : null;

        const profile = await prisma.profile.findUnique({
          where: { email },
        });

        if (!profile || !profile.password) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(password, profile.password);
        if (!isValidPassword) {
          return null;
        }

        // Two-factor authentication verification if activated
        if (profile.twoFactorAuthActivated) {
          if (!profile.twoFactorAuthSecret || !twoFactorCode) {
            throw new Error("2FA_REQUIRED");
          }

          const totp = new TOTP();
          const isValidToken = await totp.verify(twoFactorCode, {
            secret: profile.twoFactorAuthSecret,
          });

          if (!isValidToken) {
            throw new Error("INVALID_2FA_CODE");
          }
        }

        return {
          id: profile.id,
          email: profile.email,
          name: `${profile.firstName} ${profile.lastName}`,
          role: profile.role,
          tgpackage: profile.tgpackage,
          orgId: profile.orgId,
        };
      },
    }),
  ],
});