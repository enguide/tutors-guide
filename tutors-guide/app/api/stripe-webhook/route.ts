/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Package } from "@prisma/client";

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
    return new NextResponse("Webhook Error: Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      const userId = metadata.userId;
      const targetPackage = (metadata.targetPackage as Package) || Package.SAT;
      const isB2B = metadata.isB2B === "true";
      const seats = parseInt(metadata.seats || "0", 10);
      const orgId = metadata.orgId;

      if (session.payment_status === "paid" && userId) {
        try {
          if (isB2B && orgId) {
            // B2B Flow: Increment organization seatLimit and update package tier
            await prisma.$transaction([
              prisma.organization.update({
                where: { id: orgId },
                data: {
                  seatLimit: { increment: seats },
                  packageType: targetPackage,
                  stripeCustomerId: (session.customer as string) || undefined,
                },
              }),
              prisma.profile.update({
                where: { id: userId },
                data: { tgpackage: targetPackage },
              }),
            ]);
            console.log(`B2B fulfillment completed: Org ${orgId} received +${seats} seats.`);
          } else {
            // B2C Flow: Upsert membership and update profile package tier directly
            await prisma.$transaction([
              prisma.profile.update({
                where: { id: userId },
                data: { tgpackage: targetPackage },
              }),
              prisma.membership.upsert({
                where: { profileId: userId },
                update: {
                  tgpackage: targetPackage,
                  stripeSessionId: session.id,
                },
                create: {
                  profileId: userId,
                  tgpackage: targetPackage,
                  stripeSessionId: session.id,
                },
              }),
            ]);
            console.log(`B2C fulfillment completed: User ${userId} upgraded to ${targetPackage}.`);
          }
        } catch (dbError) {
          console.error("Database Transaction Error during Stripe Webhook:", dbError);
          return NextResponse.json({ error: "Fulfillment transaction failed" }, { status: 500 });
        }
      } else {
        console.warn(`Webhook received incomplete session or missing userId: ${session.id}`);
      }
      break;
    }

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
};