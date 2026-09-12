import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { ArrowRight, LogIn, Sparkles } from 'lucide-react';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleExploreMarketplace = () => {
    if (isAuthenticated) {
      navigate('/marketplace');
    } else {
      navigate('/login');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <section className="py-20 bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-8 md:p-16 text-center shadow-xl dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950">
          {/* Ambient Glows */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-gradient-to-r from-emerald-200/40 via-blue-200/30 to-teal-200/40 blur-3xl dark:from-emerald-950/20 dark:to-blue-950/20"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold text-neutral-800 shadow-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Join the CCUS Circular Economy</span>
            </div>

            <h2 className="text-3xl font-black text-neutral-950 sm:text-4xl lg:text-5xl dark:text-white tracking-tight">
              Ready to build a circular carbon economy?
            </h2>

            <p className="text-sm text-neutral-600 sm:text-base dark:text-neutral-300 leading-relaxed">
              Whether you are an industrial emitter looking to monetize captured emissions, or an off-taker sourcing verified bulk CO₂ feedstock—CarbonX gets you trading in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleExploreMarketplace}
                className="w-full sm:w-auto gap-2 bg-black hover:bg-neutral-800 text-white shadow-md hover:shadow-lg transition-all"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleLogin}
                className="w-full sm:w-auto gap-2 border-neutral-300 bg-white hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
