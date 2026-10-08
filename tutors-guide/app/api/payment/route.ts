/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Package } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover" as any,
});

// Price table in cents
const PACKAGE_PRICES: Record<Package, number> = {
  [Package.SAT]: 15000, // $150.00
  [Package.ACT]: 15000, // $150.00
  [Package.ALL]: 25000, // $250.00
  [Package.NONE]: 0,
};

export const POST = async (req: NextRequest) => {
  const sessionAuth = await auth();
  const userId = sessionAuth?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const targetPackage: Package = body.packageType || Package.SAT;
    const isB2B = Boolean(body.isB2B);
    const seatQuantity = Math.max(1, parseInt(body.seats || "1", 10));
    const orgId = body.orgId || sessionAuth.user.orgId;

    if (targetPackage === Package.NONE) {
      return NextResponse.json({ error: "Invalid package selection" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Dynamic pricing: per-seat for B2B or flat rate for B2C
    const unitPrice = PACKAGE_PRICES[targetPackage];
    const quantity = isB2B ? seatQuantity : 1;

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: isB2B
                ? `${targetPackage} Institutional Seats (${quantity} seats)`
                : `${targetPackage} Comprehensive Diagnostic Access`,
            },
            unit_amount: unitPrice,
          },
          quantity,
        },
      ],
      return_url: `${origin}/checkout-confirm?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId,
        targetPackage,
        isB2B: isB2B ? "true" : "false",
        seats: quantity.toString(),
        orgId: orgId || "",
      },
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe Checkout Session Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};