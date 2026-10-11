"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowUpRight, Loader2, AlertCircle } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const emailParam = searchParams.get("email") || "";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    authError === "CredentialsSignin"
      ? "Invalid authentication credentials."
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("Access denied. Invalid email or security key.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage("Authentication gateway failure. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] relative z-20">
      {/* Heavy Smoked Frosted Glass Panel */}
      <div className="relative rounded-[4px] bg-[#0c0c0e]/50 backdrop-blur-[48px] border border-white/[0.1] p-8 md:p-9 shadow-[0_32px_96px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.18),inset_0_0_24px_rgba(255,255,255,0.02)]">
        
        {/* Specular Edge Highlight */}
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#e7dec8]/50 to-transparent" />

        {/* Console Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
              Candidate Portal
            </span>
            <span className="text-[9px] font-mono tracking-widest text-zinc-400 border border-white/[0.1] px-2 py-0.5 rounded-[2px] bg-white/[0.03]">
              ORIZURU // 2.6
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white font-sans">
            Client Authentication
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
            Enter your credentials to load your active diagnostic suites and telemetry traces.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-[2px] bg-[#1a080d]/80 border border-[#f43f5e]/30 text-xs text-[#fda4af] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#f43f5e]" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-400">
              Account Identification
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@apexprep.com"
              className="w-full bg-black/60 border border-white/[0.1] rounded-[2px] px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/10 transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-400">
                Security Key
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Reset key
              </Link>
            </div>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-black/60 border border-white/[0.1] rounded-[2px] px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/10 transition-all font-mono tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-between bg-white hover:bg-zinc-200 text-black text-xs font-semibold py-3 px-4 rounded-[2px] transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_24px_rgba(255,255,255,0.08)] group"
          >
            {loading ? (
              <span className="w-full flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Verifying Access...</span>
              </span>
            ) : (
              <>
                <span className="tracking-wider">ENTER WORKSTATION</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Frosted Footer Divider */}
        <div className="mt-7 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>COHORT ENROLLMENT?</span>
          <Link
            href="/join"
            className="text-white hover:text-zinc-300 flex items-center gap-1 transition-colors"
          >
            <span>CLAIM SEAT</span>
            <span className="text-[#e7dec8]">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#040405] text-white flex items-center justify-center p-6 lg:p-16 relative overflow-hidden select-none animate-fadeIn duration-500">
      
      {/* Deep Obsidian Ambient Lighting: Subtle Refraction Pools */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#6366f1]/[0.2] via-[#a855f7]/[0.05] to-[#10b981]/[0.03] rounded-full blur-[180px]" />
        <div className="absolute -top-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-[#c084fc]/[0.05] via-[#ec4899]/[0.03] to-transparent rounded-full blur-[180px]" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-gradient-to-br from-[#c084fc]/[0.03] to-[#38bdf8]/[0.03] rounded-full blur-[170px]" />
      </div>

      {/* Shared Ecru Paper Texture & Shading Engine */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="ecruPaperGrain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.94  0 0 0 0 0.91  0 0 0 0 0.85  0 0 0 0.18 0" result="coloredNoise" />
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="textured" />
            <feBlend mode="multiply" in="SourceGraphic" in2="textured" />
          </filter>

          <linearGradient id="facetEcruCrease" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffdf8" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#d5c8b2" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#8c7a65" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="facetEcruPrimary" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#fdfbf5" />
            <stop offset="50%" stopColor="#f4ece1" />
            <stop offset="100%" stopColor="#e3d6c1" />
          </linearGradient>

          <linearGradient id="facetEcruMuted" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f2e9dc" />
            <stop offset="60%" stopColor="#dfd1bc" />
            <stop offset="100%" stopColor="#cbbba4" />
          </linearGradient>

          <linearGradient id="facetEcruDeep" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d3c3ab" />
            <stop offset="55%" stopColor="#b49f85" />
            <stop offset="100%" stopColor="#7a6852" />
          </linearGradient>

          <linearGradient id="facetEcruShadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a775e" />
            <stop offset="100%" stopColor="#433729" />
          </linearGradient>

          <linearGradient id="facetEcruSpecular" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f7f1e6" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ded0ba" stopOpacity="0.75" />
          </linearGradient>
        </defs>
      </svg>

      {/* Main Structural Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Side: Brand Editorial Stage */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-10 relative">
          
          {/* Top Brand Marker */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-[1px] bg-gradient-to-r from-[#e7dec8] to-[#d5c7ad]" />
            <span className="text-[11px] font-mono tracking-[0.28em] uppercase text-zinc-400">
              Architectural Test Engineering
            </span>
          </div>

          {/* Primary Editorial Typography */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-[-0.04em] text-white uppercase leading-[0.95]">
              The Tutors
              <span className="block text-zinc-100">Guide</span>
            </h1>
            <p className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#fffdf8] via-[#e7dec8] to-[#c7b494]">
              Diagnostics#
            </p>
          </div>

          {/* Editorial Data Specimen Panel: Heavy Plexi-Frost & Sharp Geometry */}
          <div className="max-w-md rounded-[4px] bg-[#0c0c0e]/50 backdrop-blur-[48px] border border-white/[0.12] p-6 space-y-3 relative z-10 shadow-[0_24px_64px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.18)]">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>01 // GEOMETRIC DISCIPLINE</span>
              <span className="text-zinc-200 font-semibold tracking-wide">99.8th Percentile</span>
            </div>
            <div className="h-[1px] bg-white/[0.08]" />
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Dynamic item-response calibration, Bluebook & TestNav layout fidelity, and sub-second telemetry modeling built for candidates targeting top-tier admissions.
            </p>
          </div>
        </div>

        {/* Right Side: Frosted Glass Form Console + Repositioned Crane */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end relative">

          {/* =========================================================================
              ORIGAMI CRANE: Moved 2x further up & left (-top-96, -left-96 to -left-[32rem])
              Now hovering prominently in the center-left visual aperture.
             ========================================================================= */}
          <div className="absolute -top-96 -left-96 sm:-left-[28rem] md:-left-[32rem] w-[624px] h-[624px] sm:w-[768px] sm:h-[768px] pointer-events-none select-none z-10 opacity-95 transition-all duration-700">
            <svg 
              viewBox="0 0 400 400" 
              filter="url(#ecruPaperGrain)"
              className="w-full h-full drop-shadow-[0_28px_70px_rgba(0,0,0,0.95)]"
            >
              <g stroke="url(#facetEcruCrease)" strokeWidth="0.8" strokeLinejoin="round">
                {/* Left Large Extended Wing */}
                <polygon 
                  points="200,190 60,80 180,240" 
                  fill="url(#facetEcruPrimary)" 
                />
                <polygon 
                  points="60,80 130,220 180,240" 
                  fill="url(#facetEcruSpecular)" 
                  fillOpacity="0.85" 
                />

                {/* Right Extended Wing (Sweeps behind login glass) */}
                <polygon 
                  points="200,190 340,90 220,240" 
                  fill="url(#facetEcruMuted)" 
                />
                <polygon 
                  points="340,90 270,220 220,240" 
                  fill="url(#facetEcruDeep)" 
                />

                {/* Central Diamond Body */}
                <polygon 
                  points="200,150 170,250 200,290 230,250" 
                  fill="url(#facetEcruPrimary)" 
                />

                {/* Left Folded Breast Flap */}
                <polygon 
                  points="200,150 170,250 200,220" 
                  fill="url(#facetEcruSpecular)" 
                />

                {/* Right Folded Breast Flap */}
                <polygon 
                  points="200,150 230,250 200,220" 
                  fill="url(#facetEcruShadow)" 
                />

                {/* Long Angular Neck & Head */}
                <polygon 
                  points="200,220 140,230 110,130" 
                  fill="url(#facetEcruPrimary)" 
                />
                {/* Folded Beak Tip */}
                <polygon 
                  points="110,130 95,145 118,148" 
                  fill="#ffffff" 
                  fillOpacity="0.9" 
                />

                {/* Tail Extension */}
                <polygon 
                  points="200,220 260,240 300,170" 
                  fill="url(#facetEcruSpecular)" 
                />
                <polygon 
                  points="200,240 260,240 300,170" 
                  fill="url(#facetEcruDeep)" 
                />
              </g>
            </svg>
          </div>

          <Suspense
            fallback={
              <div className="w-full max-w-[420px] bg-[#0c0c0d]/80 rounded-[4px] border border-white/[0.12] p-8 flex items-center justify-center relative z-20">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>

      </div>
    </main>
  );
}