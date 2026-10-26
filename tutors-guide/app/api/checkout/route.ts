// app/api/checkout/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PRICING_TIERS } from "@/config/pricing";
import bcrypt from "bcryptjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover" as any,
});

export const POST = async (req: NextRequest) => {
  try {
    const sessionAuth = await auth();
    const body = await req.json().catch(() => ({}));

    const tierKey: string = body.tier || "SAT";
    const isB2B: boolean = Boolean(body.isB2B);
    const seats: number = isB2B ? Math.max(1, parseInt(body.seats || "1", 10)) : 1;
    const customerEmail: string | undefined =
      body.email?.toLowerCase().trim() || sessionAuth?.user?.email;
    const orgName: string | undefined = body.orgName?.trim();
    const firstName: string = body.firstName?.trim() || "";
    const lastName: string = body.lastName?.trim() || "";
    const rawPassword: string | undefined = body.password?.trim();

    // Dynamically validate against PRICING_TIERS
    const selectedTier = PRICING_TIERS[tierKey];
    if (!selectedTier) {
      return NextResponse.json(
        { error: `Invalid program tier selection: ${tierKey}` },
        { status: 400 }
      );
    }

    // Hash password if unauthenticated candidate registered on the front page
    let hashedPassword = "";
    if (!sessionAuth && rawPassword) {
      if (rawPassword.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters long" },
          { status: 400 }
        );
      }
      hashedPassword = await bcrypt.hash(rawPassword, 10);
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

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
              description: `1-Year Comprehensive Access for ${selectedTier.categories.join(", ")}`,
            },
            unit_amount: selectedTier.priceCents,
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
        firstName,
        lastName,
        hashedPassword,
      },
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: "Failed to initialize checkout session" },
      { status: 500 }
    );
  }
};