import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, Users, Percent, Award } from 'lucide-react';

export const ImpactSection: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({
    co2: 0,
    partners: 0,
    savings: 0,
    matchScore: 0,
  });

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 1800; // ms
    const startTime = performance.now();

    const targets = {
      co2: 25000,
      partners: 120,
      savings: 18,
      matchScore: 92,
    };

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setCounts({
        co2: Math.floor(ease * targets.co2),
        partners: Math.floor(ease * targets.partners),
        savings: Math.floor(ease * targets.savings),
        matchScore: Math.floor(ease * targets.matchScore),
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [hasAnimated]);

  const kpis = [
    {
      value: `${counts.co2.toLocaleString()}+`,
      label: 'Tons CO₂ Reused',
      subtext: 'Diverted from atmospheric flue stacks into circular products',
      icon: TrendingUp,
      accent: 'border-emerald-500',
    },
    {
      value: `${counts.partners}+`,
      label: 'Industrial Partners',
      subtext: 'Heavy cement, steel, chemical & biofuel facilities enrolled',
      icon: Users,
      accent: 'border-blue-500',
    },
    {
      value: `${counts.savings}%`,
      label: 'Average Logistics Savings',
      subtext: 'Optimized cryogenic haul routes and clustered aggregation',
      icon: Percent,
      accent: 'border-teal-500',
    },
    {
      value: `${counts.matchScore}`,
      label: 'Average AI Match Score',
      subtext: 'High-compatibility chemical purity and schedule alignment',
      icon: Award,
      accent: 'border-black dark:border-white',
    },
  ];

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="py-20 bg-neutral-50/80 dark:bg-neutral-900/50 border-y border-neutral-200/80 dark:border-neutral-800"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" size="sm">
            Proven Performance
          </Badge>
          <h2 className="text-3xl font-extrabold text-neutral-950 sm:text-4xl dark:text-white tracking-tight">
            Measurable Climate & Commercial Impact
          </h2>
          <p className="text-sm text-neutral-600 sm:text-base dark:text-neutral-400">
            Real industrial metrics proving the commercial viability of CCUS valorization across regional industrial clusters.
          </p>
        </div>

        {/* 4 Counter Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card
                key={kpi.label}
                className="relative overflow-hidden border-neutral-200 bg-white p-2 shadow-xs transition hover:shadow-card-hover dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className={`h-1 w-full ${kpi.accent} bg-current opacity-80`} />
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-neutral-400">
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] font-mono font-semibold uppercase">Verified</span>
                  </div>

                  <div className="font-mono text-3xl sm:text-4xl font-black text-neutral-950 dark:text-white tracking-tight">
                    {kpi.value}
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {kpi.label}
                  </h3>

                  <p className="text-xs text-neutral-500 leading-relaxed dark:text-neutral-400">
                    {kpi.subtext}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
