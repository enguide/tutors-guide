// components/checkout/EmbeddedCheckoutModal.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { X, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface EmbeddedCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierKey: string;
  tierTitle: string;
  priceFormatted: string;
  isLoggedIn: boolean;
  isB2B?: boolean;
  seats?: number;
}

export function EmbeddedCheckoutModal({
  isOpen,
  onClose,
  tierKey,
  tierTitle,
  priceFormatted,
  isLoggedIn,
  isB2B = false,
  seats = 1,
}: EmbeddedCheckoutModalProps) {
  const router = useRouter();

  const [step, setStep] = useState<"account" | "checkout">(
    isLoggedIn ? "checkout" : "account"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const initializeAuthCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: tierKey,
          isB2B,
          seats,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to initialize payment session");

      setClientSecret(data.clientSecret);
      setStep("checkout");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: tierKey,
          email,
          password,
          firstName,
          lastName,
          isB2B,
          seats,
          orgName: isB2B ? orgName : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to initialize payment session");

      setClientSecret(data.clientSecret);
      setStep("checkout");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Account setup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (email && password) {
      const authRes = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!authRes?.error) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="relative w-full max-w-2xl bg-card border border-border shadow-2xl p-6 sm:p-8 rounded-none flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                {isB2B ? "Institutional Account" : "Student Registration"}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-muted border border-border text-foreground">
                ANNUAL ACCESS
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground uppercase mt-0.5">
              {tierTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs shrink-0">
            {error}
          </div>
        )}

        <div className="overflow-y-auto flex-1 pr-1">
          {/* STEP 1: Registration Form */}
          {step === "account" && !isLoggedIn && (
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div className="p-3 bg-muted/40 border border-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    {isB2B
                      ? `Institutional License (${seats} Seats)`
                      : "Individual Access"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    One year of comprehensive examination access
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-foreground">
                  {priceFormatted}
                </span>
              </div>

              {isB2B && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    School or Institution Name
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-background border border-input px-3 py-2 text-xs font-sans text-foreground focus:outline-none focus:border-primary"
                    placeholder="e.g. Saint Mark's Academy"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-background border border-input px-3 py-2 text-xs font-sans text-foreground focus:outline-none focus:border-primary"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-background border border-input px-3 py-2 text-xs font-sans text-foreground focus:outline-none focus:border-primary"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-input px-3 py-2 text-xs font-sans text-foreground focus:outline-none focus:border-primary"
                  placeholder="jane.doe@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-input px-3 py-2 text-xs font-mono tracking-widest text-foreground focus:outline-none focus:border-primary"
                  placeholder="••••••••••••"
                />
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Minimum 8 characters. Your workspace will open automatically upon confirmation.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-between bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-3 px-4 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2 mx-auto">
                    <Loader2 className="w-4 h-4 animate-spin" /> Preparing Payment...
                  </span>
                ) : (
                  <>
                    <span className="tracking-widest uppercase">
                      Proceed to Payment
                    </span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Prompt for Authenticated Users */}
          {isLoggedIn && !clientSecret && (
            <div className="py-8 text-center space-y-4">
              <ShieldCheck className="w-10 h-10 mx-auto text-primary" />
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Authenticated Session
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  This program will be registered directly to your active account.
                </p>
              </div>
              <button
                onClick={initializeAuthCheckout}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2.5 px-6 transition-all cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
            </div>
          )}

          {/* STEP 2: Stripe Embedded Frame */}
          {step === "checkout" && clientSecret && (
            <div className="min-h-95">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret, onComplete: handleComplete }}
              >
                <EmbeddedCheckout className="stripe-embedded-frame" />
              </EmbeddedCheckoutProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}