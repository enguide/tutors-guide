// actions/mentorship.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LinkStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface MentorshipLinkItem {
  id: string;
  status: LinkStatus;
  createdAt: Date;
  tutor: {
    id: string;
    name: string;
    email: string;
  };
  student: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Generates or retrieves a shareable tutor connection code (e.g. TUTOR-A1B2C3)
 */
export async function getOrCreateTutorInviteLink(): Promise<{ inviteUrl: string; inviteCode: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userRole = session.user.role as Role;
  if (userRole !== Role.TUTOR && userRole !== Role.ADMIN) {
    throw new Error("Only tutors can generate student connection links.");
  }

  // Use the profile ID directly or a deterministic hash for tutor invites
  const inviteCode = `TUTOR-${session.user.id.slice(-6).toUpperCase()}`;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const inviteUrl = `${baseUrl}/link-tutor?tutorId=${session.user.id}`;

  return { inviteUrl, inviteCode };
}

/**
 * Student initiates a connection to an independent tutor by tutor email
 */
export async function requestMentorConnection(tutorEmail: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const normalizedEmail = tutorEmail.trim().toLowerCase();

  const tutorProfile = await prisma.profile.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, role: true, firstName: true, lastName: true },
  });

  if (!tutorProfile || (tutorProfile.role !== Role.TUTOR && tutorProfile.role !== Role.ADMIN)) {
    throw new Error("No registered tutor found with that email address.");
  }

  if (tutorProfile.id === session.user.id) {
    throw new Error("You cannot link yourself as a tutor.");
  }

  const link = await prisma.tutorStudentLink.upsert({
    where: {
      tutorId_studentId: {
        tutorId: tutorProfile.id,
        studentId: session.user.id,
      },
    },
    create: {
      tutorId: tutorProfile.id,
      studentId: session.user.id,
      status: LinkStatus.PENDING,
    },
    update: {
      // Re-activate if previously revoked
      status: LinkStatus.PENDING,
    },
  });

  revalidatePath("/settings/mentors");
  return {
    success: true,
    linkId: link.id,
    tutorName: `${tutorProfile.firstName} ${tutorProfile.lastName}`.trim() || normalizedEmail,
  };
}

/**
 * Student connects to a tutor via a tutor's invite link
 */
export async function acceptTutorInvite(tutorId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (tutorId === session.user.id) {
    throw new Error("You cannot link yourself as a tutor.");
  }

  const tutor = await prisma.profile.findUnique({
    where: { id: tutorId },
    select: { id: true, role: true, firstName: true, lastName: true },
  });

  if (!tutor || (tutor.role !== Role.TUTOR && tutor.role !== Role.ADMIN)) {
    throw new Error("Invalid tutor link.");
  }

  const link = await prisma.tutorStudentLink.upsert({
    where: {
      tutorId_studentId: {
        tutorId: tutor.id,
        studentId: session.user.id,
      },
    },
    create: {
      tutorId: tutor.id,
      studentId: session.user.id,
      status: LinkStatus.ACTIVE,
    },
    update: {
      status: LinkStatus.ACTIVE,
    },
  });

  revalidatePath("/settings/mentors");
  revalidatePath("/tgadmin");
  return {
    success: true,
    linkId: link.id,
    tutorName: `${tutor.firstName} ${tutor.lastName}`.trim(),
  };
}

/**
 * Fetch all mentor links for the logged-in student (active & pending)
 */
export async function getStudentMentorshipLinks(): Promise<MentorshipLinkItem[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const links = await prisma.tutorStudentLink.findMany({
    where: {
      studentId: session.user.id,
      status: { in: [LinkStatus.ACTIVE, LinkStatus.PENDING] },
    },
    include: {
      tutor: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      student: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return links.map((l) => ({
    id: l.id,
    status: l.status,
    createdAt: l.createdAt,
    tutor: {
      id: l.tutor.id,
      name: `${l.tutor.firstName} ${l.tutor.lastName}`.trim() || l.tutor.email,
      email: l.tutor.email,
    },
    student: {
      id: l.student.id,
      name: `${l.student.firstName} ${l.student.lastName}`.trim() || l.student.email,
      email: l.student.email,
    },
  }));
}

/**
 * Responds to a link request or revokes an active link
 */
export async function respondToMentorshipRequest(linkId: string, accept: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const link = await prisma.tutorStudentLink.findUnique({
    where: { id: linkId },
  });

  if (!link) {
    throw new Error("Link not found.");
  }

  // Only the student granting access or the tutor linked can resolve the link
  if (link.studentId !== session.user.id && link.tutorId !== session.user.id) {
    throw new Error("Unauthorized to modify this mentorship link.");
  }

  if (accept) {
    await prisma.tutorStudentLink.update({
      where: { id: linkId },
      data: { status: LinkStatus.ACTIVE },
    });
  } else {
    await prisma.tutorStudentLink.delete({
      where: { id: linkId },
    });
  }

  revalidatePath("/settings/mentors");
  revalidatePath("/tgadmin");
  return { success: true };
}

/**
 * Sovereign revocation by student or tutor
 */
export async function revokeMentorshipAccess(linkId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const link = await prisma.tutorStudentLink.findUnique({
    where: { id: linkId },
  });

  if (!link) {
    throw new Error("Mentorship link not found.");
  }

  if (link.studentId !== session.user.id && link.tutorId !== session.user.id) {
    throw new Error("Unauthorized to revoke this mentorship link.");
  }

  await prisma.tutorStudentLink.update({
    where: { id: linkId },
    data: { status: LinkStatus.REVOKED },
  });

  revalidatePath("/settings/mentors");
  revalidatePath("/tgadmin");
  return { success: true };
}