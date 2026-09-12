import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  Factory,
  Brain,
  Building2,
  Sparkles,
  CheckCircle2,
  Truck,
  ShieldCheck,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/marketplace');
    } else {
      navigate('/login?tab=register');
    }
  };

  const handleExploreMarketplace = () => {
    if (isAuthenticated) {
      navigate('/marketplace');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Background ambient lighting blobs */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 h-[500px] w-[850px] rounded-full bg-gradient-to-br from-emerald-200/40 via-blue-200/30 to-teal-100/20 blur-3xl dark:from-emerald-950/20 dark:via-blue-950/20 dark:to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headlines and CTAs */}
          <div className="text-center lg:col-span-7 lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur-md dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              <span>Gujarat Industrial Decarbonization Corridor</span>
              <span className="h-1 w-1 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">B2B CCUS Exchange</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl dark:text-white leading-[1.12]">
              Transform Captured <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">CO₂</span> into Commercial Value
            </h1>

            <p className="mx-auto max-w-2xl text-base text-neutral-600 sm:text-lg lg:mx-0 dark:text-neutral-300 leading-relaxed">
              CarbonX connects industrial point-source emitters with verified commercial off-takers across Gujarat—guaranteeing ISO 14064 compliance, cryogenic logistics, and algorithmic landed-cost optimization.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleGetStarted}
                className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                <span>{isAuthenticated ? 'Go to Platform' : 'Register Enterprise & Verify'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleExploreMarketplace}
                className="w-full sm:w-auto gap-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 dark:border-neutral-700 dark:bg-neutral-900"
              >
                <span>Explore Live Marketplace</span>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-neutral-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>ISO 14064 Verified Telemetry</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>PESO Cryo-Transit Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>Deterministic Match Engine</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Animated Globe with Gujarat CCUS Corridor Telemetry */}
          <div className="lg:col-span-5 flex justify-center">
            <style>
              {`
                @keyframes earthRotate {
                  0% { background-position: 0 0; }
                  100% { background-position: 600px 0; }
                }
                @keyframes orbitSlow {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                @keyframes floatCard {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-8px); }
                }
                @keyframes floatCardAlt {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(8px); }
                }
              `}
            </style>

            <div className="relative flex items-center justify-center w-full max-w-[460px] h-[480px]">
              {/* Outer Orbital Dashed Radar Ring */}
              <div 
                className="absolute h-[420px] w-[420px] rounded-full border border-dashed border-emerald-500/25 pointer-events-none"
                style={{ animation: 'orbitSlow 60s linear infinite' }}
              />

              {/* Inner Solid Orbital Ring */}
              <div 
                className="absolute h-[360px] w-[360px] rounded-full border border-teal-500/20 pointer-events-none"
                style={{ animation: 'orbitSlow 45s linear infinite reverse' }}
              />

              {/* Ambient Atmospheric Glow */}
              <div className="absolute h-[280px] w-[280px] rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

              {/* 3D Rotating Earth Sphere */}
              <div
                className="relative h-[280px] w-[280px] sm:h-[320px] sm:w-[320px] rounded-full overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.3),-10px_0_15px_#10b981_inset,20px_2px_30px_#000_inset,-30px_-2px_40px_#34d39999_inset,300px_0_60px_#00000088_inset] transition hover:scale-[1.02] cursor-grab active:cursor-grabbing"
                style={{
                  backgroundImage: "url('https://cdn.21st.dev/assets/mirror/f2/f2fe23d0c6a8406962e4c5ef969e13dc9de3faf37d3e7258a1067173325b254f.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "left",
                  animation: "earthRotate 35s linear infinite",
                }}
              >
                {/* Atmospheric Rim Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-transparent to-teal-300/20 pointer-events-none" />
              </div>

              {/* Floating Live Telemetry Badge 1: UltraTech Emitter (Top-Left) */}
              <div 
                className="absolute -top-2 left-0 sm:-left-4 z-20 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-white/95 p-3 shadow-xl backdrop-blur-md"
                style={{ animation: 'floatCard 4s ease-in-out infinite' }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Factory className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-900">UltraTech Sanand</span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono font-bold">
                    98.5% CO₂ Purity • 350t Ready
                  </div>
                </div>
              </div>

              {/* Floating Live Telemetry Badge 2: GreenGrow Buyer (Bottom-Right) */}
              <div 
                className="absolute -bottom-2 right-0 sm:-right-4 z-20 flex items-center gap-2.5 rounded-2xl border border-blue-200 bg-white/95 p-3 shadow-xl backdrop-blur-md"
                style={{ animation: 'floatCardAlt 5s ease-in-out infinite' }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-900">GreenGrow Chemicals</span>
                    <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1 py-0.2 rounded">Off-Take</span>
                  </div>
                  <div className="text-[10px] text-slate-600 font-mono">
                    ₹4,820/t Landed • Cryo Fleet Enroute
                  </div>
                </div>
              </div>

              {/* Floating AI Engine Match Badge: Center-Right */}
              <div 
                className="hidden sm:flex absolute top-1/2 -right-8 -translate-y-1/2 z-20 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-white shadow-2xl backdrop-blur-md"
              >
                <Brain className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse" />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Deterministic Match</div>
                  <div className="text-xs font-mono font-black text-emerald-400">96/100 Optimal Route</div>
                </div>
              </div>

              {/* Bottom Corridor Status Pill */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 shadow-sm text-[10px] text-slate-600 backdrop-blur-sm">
                <Truck className="h-3 w-3 text-emerald-600" />
                <span>Active Hazmat Corridor: <strong>Ahmedabad ⇄ Vadodara</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
