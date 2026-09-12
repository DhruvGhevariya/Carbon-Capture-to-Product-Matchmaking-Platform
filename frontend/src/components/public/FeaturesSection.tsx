import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Calculator,
  Truck,
  BarChart3,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'AI Recommendation Engine',
      icon: Sparkles,
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300',
      badge: 'Deterministic Algorithm',
      description:
        'Matches industrial buyers and sellers using a multi-factor ranking model that factors in purity floor, required tonnage, and physical phase without LLM hallucinations.',
    },
    {
      title: 'Transparent Landed Cost',
      icon: Calculator,
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300',
      badge: 'Zero Hidden Fees',
      description:
        'Real-time financial breakdown combining emitter reserve prices, cryogenic refrigeration tolls, and road freight to show the exact landed cost per ton upfront.',
    },
    {
      title: 'Logistics Optimization',
      icon: Truck,
      iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-300',
      badge: 'Gujarat CCUS Corridors',
      description:
        'Automated routing across western industrial hubs, calculation of cryogenic boil-off degradation, transit time ETAs, and verified PESO hazardous cargo compliance.',
    },
    {
      title: 'Explainable Match Score',
      icon: BarChart3,
      iconBg: 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white',
      badge: 'ISO 14064 Auditable',
      description:
        'Auditable 0–100 compatibility scores transparently breaking down purity compliance, proximity, price parity, volume availability, and supplier fulfillment reliability.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" size="sm">
            Core Architecture
          </Badge>
          <h2 className="text-3xl font-extrabold text-neutral-950 sm:text-4xl dark:text-white tracking-tight">
            Engineered for Industrial Decarbonization
          </h2>
          <p className="text-sm text-neutral-600 sm:text-base dark:text-neutral-400">
            A high-performance exchange platform built specifically for bulk industrial carbon capture, physical logistics, and circular off-take contracts.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group relative border-neutral-200 bg-white p-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/90 dark:hover:border-neutral-700"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconBg} shadow-xs transition group-hover:scale-110`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-950 dark:text-white transition group-hover:text-black dark:group-hover:text-emerald-400">
                    {feature.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed dark:text-neutral-300">
                    {feature.description}
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

export default FeaturesSection;
