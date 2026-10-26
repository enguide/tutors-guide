// components/storefront/TierPricingGrid.tsx
"use client";

import { useState } from "react";
import { Check, ArrowRight, Building2, Mail } from "lucide-react";
import {
  PRICING_TIERS,
  EXAM_CATEGORIES,
  ExamCategory,
  PricingTier,
} from "@/config/pricing";
import { EmbeddedCheckoutModal } from "@/components/checkout/EmbeddedCheckoutModal";

interface TierPricingGridProps {
  isLoggedIn: boolean;
}

export function TierPricingGrid({ isLoggedIn }: TierPricingGridProps) {
  const [activeCategory, setActiveCategory] = useState<ExamCategory>(
    EXAM_CATEGORIES[0]?.id || "college-admissions"
  );
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  // Convert dictionary into array dynamically
  const allTiers = Object.values(PRICING_TIERS);
  const filteredTiers = allTiers.filter(
    (tier) => tier.category === activeCategory
  );

  return (
    <div className="space-y-10 font-sans">
      {/* Category Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-card border border-border">
        <div className="flex flex-wrap items-center gap-1">
          {EXAM_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground font-mono px-2">
          Individual Student Access • 1-Year Term
        </div>
      </div>

      {/* Dynamic Product Tiers Grid */}
      <div
        className={`grid gap-6 items-stretch ${
          filteredTiers.length === 1
            ? "grid-cols-1 max-w-xl mx-auto"
            : filteredTiers.length === 2
            ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {filteredTiers.map((tier) => {
          const displayPrice = `$${(tier.priceCents / 100).toFixed(0)}`;

          return (
            <div
              key={tier.key}
              className={`flex flex-col justify-between bg-card border transition-all ${
                tier.popular
                  ? "border-primary shadow-sm relative"
                  : "border-border hover:border-muted-foreground/40"
              }`}
            >
              {tier.popular && tier.badge && (
                <div className="absolute -top-3 left-6 px-2.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-mono tracking-widest uppercase">
                  {tier.badge}
                </div>
              )}

              <div className="p-6 sm:p-7 space-y-5">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                    Diagnostic Program
                  </span>
                  <h3 className="text-lg font-bold tracking-tight text-foreground uppercase mt-1">
                    {tier.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono tracking-tight text-foreground">
                      {displayPrice}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      / 1-year access
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Diagnostic &amp; Analytics Features
                  </span>
                  <ul className="space-y-2 text-xs">
                    {tier.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-muted-foreground"
                      >
                        <Check
                          size={14}
                          className="mt-0.5 shrink-0 text-foreground"
                        />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setSelectedTier(tier)}
                  className={`group relative w-full flex items-center justify-between text-xs font-bold py-3.5 px-4.5 transition-all duration-300 cursor-pointer overflow-hidden ${
                    tier.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_4px_24px_rgba(255,255,255,0.12)] border border-primary/40 hover:border-primary/80"
                      : "bg-muted text-foreground border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                  }`}
                >
                  <span className="tracking-widest uppercase transition-colors duration-200">
                    Begin Program
                  </span>

                  {/* Morphing & Sliding Arrow-to-Checkmark */}
                  <span className="flex items-center justify-center transition-transform duration-300 ease-out transform group-hover:translate-x-1">
                    <span className="relative w-4 h-4 flex items-center justify-center shrink-0">
                      <ArrowRight
                        size={15}
                        strokeWidth={2.25}
                        className="absolute inset-0 m-auto transition-all duration-300 ease-out transform group-hover:rotate-180 group-hover:scale-50 group-hover:opacity-0"
                      />
                      <Check
                        size={15}
                        strokeWidth={2.5}
                        className="absolute inset-0 m-auto transition-all duration-300 ease-out transform -rotate-180 scale-50 opacity-0 group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100"
                      />
                    </span>
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Institutional Inquiries Banner */}
      <div className="border border-border bg-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-foreground text-xs font-bold uppercase tracking-wider">
            <Building2 size={16} />
            <span>School, District &amp; Tutoring Cohorts</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Custom seat allocations, roster telemetry management, and dedicated instructor oversight portals are tailored to cohort size. Contact our academic partnerships team for institutional agreements.
          </p>
        </div>

        <a
          href="mailto:partnerships@thetutorsguide.com?subject=Institutional%20Cohort%20Inquiry"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-muted hover:bg-muted/80 text-foreground border border-border text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Mail size={14} />
          <span>Inquire for Cohorts</span>
        </a>
      </div>

      {/* Embedded Checkout Modal */}
      {selectedTier && (
        <EmbeddedCheckoutModal
          isOpen={Boolean(selectedTier)}
          onClose={() => setSelectedTier(null)}
          tierKey={selectedTier.key}
          tierTitle={selectedTier.title}
          priceFormatted={`$${(selectedTier.priceCents / 100).toFixed(0)}`}
          isLoggedIn={isLoggedIn}
          isB2B={false}
          seats={1}
        />
      )}
    </div>
  );
}