/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Category } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover" as any,
});

// Category & Bundle Pricing (in USD cents)
const TIER_PRICING: Record<string, { price: number; categories: Category[]; title: string }> = {
  SAT: { price: 15000, categories: [Category.SAT], title: "SAT Comprehensive Diagnostic Prep" },
  ACT: { price: 15000, categories: [Category.ACT], title: "ACT Comprehensive Diagnostic Prep" },
  ALL: { price: 25000, categories: [Category.SAT, Category.ACT], title: "Dual Test Bundle (SAT & ACT)" },
  GRE: { price: 18000, categories: [Category.GRE], title: "GRE Graduate Prep Suite" },
  AP_CALC: { price: 12000, categories: [Category.AP_CALC], title: "AP Calculus Diagnostic Access" },
};

export const POST = async (req: NextRequest) => {
  try {
    const sessionAuth = await auth();
    const body = await req.json().catch(() => ({}));

    const tierKey: string = body.tier || "SAT";
    const isB2B: boolean = Boolean(body.isB2B);
    const seats: number = isB2B ? Math.max(1, parseInt(body.seats || "5", 10)) : 1;
    const customerEmail: string | undefined = body.email?.toLowerCase().trim() || sessionAuth?.user?.email;
    const orgName: string | undefined = body.orgName?.trim();

    const selectedTier = TIER_PRICING[tierKey];
    if (!selectedTier) {
      return NextResponse.json({ error: "Invalid package tier selection" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: isB2B
                ? `${selectedTier.title} - Institutional (${seats} Seats)`
                : selectedTier.title,
              description: `1-Year Platform Access for ${selectedTier.categories.join(", ")}`,
            },
            unit_amount: selectedTier.price,
          },
          quantity: seats,
        },
      ],
      return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        buyerId: sessionAuth?.user?.id || "",
        categories: JSON.stringify(selectedTier.categories),
        tierKey,
        isB2B: isB2B ? "true" : "false",
        seatLimit: seats.toString(),
        orgName: orgName || "",
      },
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Failed to initialize checkout session" }, { status: 500 });
  }
};