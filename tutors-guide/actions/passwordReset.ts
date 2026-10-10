"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const profile = await prisma.profile.findUnique({
    where: { email: normalizedEmail },
  });

  // Always return success to prevent email enumeration
  if (!profile) {
    return { success: true };
  }

  // Token valid for 1 hour
  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  // Invalidate previous tokens for this profile
  await prisma.passwordResetToken.deleteMany({
    where: { profileId: profile.id },
  });

  await prisma.passwordResetToken.create({
    data: {
      profileId: profile.id,
      token,
      tokenExpiry,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  console.log(`\n========================================`);
  console.log(`[PASSWORD RESET LINK FOR ${normalizedEmail}]`);
  console.log(resetUrl);
  console.log(`========================================\n`);

  return { success: true };
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  if (!token || !newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!record || record.tokenExpiry < new Date()) {
    throw new Error("This reset link is invalid or has expired.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const [updatedProfile] = await prisma.$transaction([
    prisma.profile.update({
      where: { id: record.profileId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.delete({
      where: { id: record.id },
    }),
  ]);

  return { success: true, email: updatedProfile.email };
}