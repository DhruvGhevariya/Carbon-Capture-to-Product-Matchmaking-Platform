import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { HeroSection } from '@/components/public/HeroSection';
import { HowItWorks } from '@/components/public/HowItWorks';
import { FeaturesSection } from '@/components/public/FeaturesSection';
import { ImpactSection } from '@/components/public/ImpactSection';
import { CTASection } from '@/components/public/CTASection';
import { Footer } from '@/components/public/Footer';
import {
  ArrowRight,
  LogIn,
  LayoutDashboard,
  Factory,
  Building2,
  TrendingDown,
  ShieldCheck,
  Zap,
  Gauge,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/login?tab=register');
  };

  const handleMarketplaceClick = () => {
    if (isAuthenticated) {
      navigate(role === 'seller' ? '/seller/dashboard' : '/marketplace');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 font-black text-white text-sm shadow-sm">
              CX
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-950">
                Carbon<span className="text-emerald-600">X</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                CCUS Exchange
              </span>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-600">
            <a href="#hero" className="hover:text-emerald-700 transition">
              Overview
            </a>
            <a href="#how-it-works" className="hover:text-emerald-700 transition">
              How It Works
            </a>
            <a href="#solutions" className="hover:text-emerald-700 transition">
              Industrial Solutions
            </a>
            <a href="#features" className="hover:text-emerald-700 transition">
              Platform
            </a>
            <a href="#impact" className="hover:text-emerald-700 transition">
              Impact
            </a>
            <button
              type="button"
              onClick={handleMarketplaceClick}
              className="hover:text-emerald-700 transition cursor-pointer font-bold"
            >
              Marketplace
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleMarketplaceClick}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Go to Platform</span>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoginClick}
                  className="gap-1 text-xs border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRegisterClick}
                  className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  <span>Register Enterprise</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <div id="hero" className="bg-white">
          <HeroSection />
        </div>

        {/* 2. Key Industry Metrics Strip (CarbonCure Style) */}
        <section className="border-y border-slate-200 bg-slate-900 text-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left">
              <div className="space-y-1 lg:border-r lg:border-slate-800 lg:pr-6">
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                  450,000+
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  Metric Tonnes CO₂ Sequestered & Monetized
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-center lg:justify-start gap-1">
                  <TrendingDown className="h-3 w-3 text-emerald-400" />
                  <span>Audited ISO 14064 Compliance</span>
                </div>
              </div>

              <div className="space-y-1 lg:border-r lg:border-slate-800 lg:pr-6">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  98.8%
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  Average Telemetry Gas Purity
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-center lg:justify-start gap-1">
                  <Gauge className="h-3 w-3 text-blue-400" />
                  <span>Real-time mass spectrometer logs</span>
                </div>
              </div>

              <div className="space-y-1 lg:border-r lg:border-slate-800 lg:pr-6">
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                  ₹1,240
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  Average Logistics Freight Savings / Tonne
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-center lg:justify-start gap-1">
                  <Zap className="h-3 w-3 text-amber-400" />
                  <span>Algorithmic landed-cost routing</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  4 Hubs
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  Active Gujarat Industrial Corridors
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-center lg:justify-start gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>Ahmedabad • Surat • Jamnagar • Vadodara</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Partner Corridor Logos */}
        <section className="bg-white py-7 border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              Integrated across Gujarat's Leading Heavy Industrial Clusters
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-500 font-bold text-sm tracking-tight opacity-75">
              <span>UltraTech Cement</span>
              <span>•</span>
              <span>Tata Steel Hazira</span>
              <span>•</span>
              <span>JSW Metallurgical</span>
              <span>•</span>
              <span>GreenGrow Chemicals</span>
              <span>•</span>
              <span>Dahej PCPIR Hub</span>
            </div>
          </div>
        </section>

        {/* 4. Two-Sided Solutions Architecture (CarbonCure Style) */}
        <section id="solutions" className="py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Two-Sided CCUS Solution Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Designed for Industrial Emitters & Commercial Consumers
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                CarbonX turns carbon capture from a compliance cost center into an active, liquid revenue stream with binding digital settlements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Emitter / Seller Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <Factory className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase font-bold text-emerald-600 tracking-wider">
                        Point-Source Emitters
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        Monetize Captured Flue Carbon
                      </h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                    Seller Node
                  </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Connect scrubbed point-source flue emissions directly to vetted regional buyers. Monetize pressurized liquid CO₂ inventories while automating ISO 14064 emissions compliance credits.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Real-time telemetry integration with plant mass spectrometers</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Dynamic reserve price floor with transparent commercial bids</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Automated chain-of-custody transfer and custody verification</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleRegisterClick}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2"
                  >
                    <span>Onboard Emitter Facility</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Off-Taker / Buyer Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase font-bold text-blue-600 tracking-wider">
                        Commercial Off-Takers
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        Reliable Feedstock at Minimum Landed Cost
                      </h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-800">
                    Buyer Node
                  </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Source chemical and agricultural grade cryogenic CO₂ with 100% verified purity guarantees. Our neural matching engine calculates 6-factor route economics to minimize delivered cost.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Multi-attribute deterministic AI supplier match engine</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Dynamic cryogenic road tanker fleet dispatch & live tracking</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Automated Scope 3 emissions reduction accounting ledger</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleRegisterClick}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  >
                    <span>Register Commercial Off-Taker</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. How It Works Section */}
        <div id="how-it-works" className="bg-white">
          <HowItWorks />
        </div>

        {/* 6. Features Deep-Dive Section */}
        <div id="features" className="bg-slate-50">
          <FeaturesSection />
        </div>

        {/* 7. Decarbonization Impact Section */}
        <div id="impact" className="bg-white">
          <ImpactSection />
        </div>

        {/* 8. Call To Action Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;

