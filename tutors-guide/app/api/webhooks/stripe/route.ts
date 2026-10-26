/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category, ClassYear, EnrollmentStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export const POST = async (req: NextRequest) => {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse("Webhook Signature Verification Failed", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const metadata = session.metadata || {};
    const isB2B = metadata.isB2B === "true";
    const seatLimit = Math.max(1, parseInt(metadata.seatLimit || "1", 10));
    const categories: Category[] = metadata.categories
      ? JSON.parse(metadata.categories)
      : [Category.SAT];
    const orgName = metadata.orgName || "Purchased Organization";
    const buyerEmail = (
      session.customer_details?.email ||
      session.customer_email ||
      ""
    ).toLowerCase().trim();

    if (!buyerEmail) {
      console.error("No customer email found in Stripe Checkout session:", session.id);
      return NextResponse.json({ error: "Missing customer email" }, { status: 400 });
    }

    // Idempotency: Check if this session was already provisioned
    const existingPool = await prisma.licensePool.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (existingPool) {
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }

    try {
      await prisma.$transaction(async (tx) => {
        // 1. Resolve or Create Purchaser Profile
        let profile = await tx.profile.findUnique({
          where: { email: buyerEmail },
        });

        // Resolve names: metadata input > Stripe customer_details > fallbacks
        const customerName = session.customer_details?.name || "";
        const [parsedFirst, ...parsedRest] = customerName.split(" ");
        const firstName = metadata.firstName || parsedFirst || "Student";
        const lastName = metadata.lastName || parsedRest.join(" ") || "Account";

        if (!profile) {
          // Use chosen pre-hashed password if present; otherwise generate a random secure hash
          const hashedPassword =
            metadata.hashedPassword && metadata.hashedPassword.length > 0
              ? metadata.hashedPassword
              : await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);

          profile = await tx.profile.create({
            data: {
              email: buyerEmail,
              firstName,
              lastName,
              password: hashedPassword,
              classYear: ClassYear.OTHER,
              role: isB2B ? Role.ORG_ADMIN : Role.STUDENT,
            },
          });
        }

        const oneYearExpiry = new Date();
        oneYearExpiry.setFullYear(oneYearExpiry.getFullYear() + 1);

        if (isB2B) {
          // 2A. B2B Flow: Create Org, LicensePool with join code, and invite code
          const inviteCode = `ORG-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

          const org = await tx.organization.create({
            data: {
              name: orgName,
              stripeCustomerId:
                typeof session.customer === "string" ? session.customer : undefined,
              members: { connect: { id: profile.id } },
            },
          });

          await tx.profile.update({
            where: { id: profile.id },
            data: { role: Role.ORG_ADMIN, orgId: org.id },
          });

          await tx.licensePool.create({
            data: {
              name: `${orgName} ${categories.join("/")} Pool`,
              stripeSessionId: session.id,
              seatLimit,
              categories,
              startsAt: new Date(),
              expiresAt: oneYearExpiry,
              purchaserId: profile.id,
              orgId: org.id,
              inviteCode,
            },
          });
        } else {
          // 2B. B2C Individual Flow: Pool (1 seat) + Direct Active Enrollment
          const pool = await tx.licensePool.create({
            data: {
              name: `Individual ${categories.join("/")} Access`,
              stripeSessionId: session.id,
              seatLimit: 1,
              categories,
              startsAt: new Date(),
              expiresAt: oneYearExpiry,
              purchaserId: profile.id,
            },
          });

          await tx.enrollment.create({
            data: {
              profileId: profile.id,
              licensePoolId: pool.id,
              status: EnrollmentStatus.ACTIVE,
            },
          });
        }
      });

      console.log(`Successfully provisioned checkout ${session.id} for ${buyerEmail}`);
    } catch (err: any) {
      console.error("Fulfillment Transaction Error:", err);
      return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
};