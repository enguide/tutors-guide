/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { type NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover" as any,
});

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    redirect("/dashboard?status=invalid_session");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      redirect("/dashboard?status=failed");
    }
  } catch (error) {
    console.error("Session retrieval error:", error);
    return NextResponse.json({ error: "Unable to retrieve session" }, { status: 500 });
  }

  redirect("/dashboard?status=success");
};