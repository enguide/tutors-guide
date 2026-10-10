import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { TOTP } from "otplib";
import { prisma } from "./prisma";
import { authConfig } from "./auth.config";
import { Category, EnrollmentStatus } from "@prisma/client";

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
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);
        const twoFactorCode = credentials.twoFactorCode
          ? String(credentials.twoFactorCode).trim()
          : null;

        const profile = await prisma.profile.findUnique({
          where: { email },
          include: {
            enrollments: {
              where: {
                status: EnrollmentStatus.ACTIVE,
                licensePool: {
                  expiresAt: { gt: new Date() },
                },
              },
              include: {
                licensePool: {
                  select: { categories: true },
                },
              },
            },
          },
        });

        if (!profile || !profile.password) return null;

        const isValidPassword = await bcrypt.compare(password, profile.password);
        if (!isValidPassword) return null;

        if (profile.twoFactorAuthActivated) {
          if (!profile.twoFactorAuthSecret || !twoFactorCode) {
            throw new Error("2FA_REQUIRED");
          }
          const totp = new TOTP();
          const isValidToken = await totp.verify(twoFactorCode, {
            secret: profile.twoFactorAuthSecret,
          });
          if (!isValidToken) throw new Error("INVALID_2FA_CODE");
        }

        // Aggregate unique entitled categories across all active license pools
        const categorySet = new Set<Category>();
        for (const enrollment of profile.enrollments) {
          for (const cat of enrollment.licensePool.categories) {
            categorySet.add(cat);
          }
        }

        return {
          id: profile.id,
          email: profile.email,
          name: `${profile.firstName} ${profile.lastName}`,
          role: profile.role,
          orgId: profile.orgId,
          entitlements: Array.from(categorySet),
        };
      },
    }),
  ],
});