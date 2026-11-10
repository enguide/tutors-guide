// actions/passwordReset.ts
"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendTransactionalEmail } from "@/lib/email/client";
import { getPasswordResetEmail } from "@/lib/email/templates";

export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const profile = await prisma.profile.findUnique({
    where: { email: normalizedEmail },
  });

  // Always return success to prevent email enumeration attacks
  if (!profile) {
    return { success: true };
  }

  // Token valid for 1 hour
  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  // Invalidate any previous unused tokens for this profile
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

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  // Prepare branded multipart email
  const { htmlBody, textBody, subject } = getPasswordResetEmail(resetUrl);

  // Asynchronously dispatch through Postmark
  try {
    await sendTransactionalEmail({
      to: normalizedEmail,
      subject,
      htmlBody,
      textBody,
      tag: "password-reset",
    });
  } catch (err) {
    console.error(`Failed to send password reset email to ${normalizedEmail}:`, err);
  }

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