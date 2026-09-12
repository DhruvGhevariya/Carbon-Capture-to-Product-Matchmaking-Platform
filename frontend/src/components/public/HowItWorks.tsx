import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Factory, Brain, Truck, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Capture CO₂',
      icon: Factory,
      iconColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
      badge: 'Point-Source Telemetry',
      text: 'Industrial emitters publish verified CO₂ batches.',
      points: [
        'Continuous purity monitoring (80% – 99.9%)',
        'Certified cryogenic liquid or gas storage telemetry',
        'Custom reserve pricing & dispatch scheduling',
      ],
    },
    {
      step: '02',
      title: 'AI Matchmaking',
      icon: Brain,
      iconColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300',
      badge: '6-Factor Match Model',
      text: 'Our AI ranks the best buyers using purity, distance, price, quantity and logistics.',
      points: [
        'Deterministic ISO 14064 algorithm without hallucinations',
        'Haul distance & road tanker toll economics',
        'Explainable match score breakdown out of 100',
      ],
    },
    {
      step: '03',
      title: 'Trade & Deliver',
      icon: Truck,
      iconColor: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-300',
      badge: 'Enforceable Off-Take',
      text: 'Buyers place bids, sellers accept, and logistics complete the transaction.',
      points: [
        'Real-time commercial bid negotiations desk',
        'Dedicated cryogenic road tankers with GPS tracking',
        'Automated chain-of-custody delivery verification',
      ],
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 bg-neutral-50/70 dark:bg-neutral-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" size="sm">
            End-to-End Workflow
          </Badge>
          <h2 className="text-3xl font-extrabold text-neutral-950 sm:text-4xl dark:text-white tracking-tight">
            How CarbonX Works
          </h2>
          <p className="text-sm text-neutral-600 sm:text-base dark:text-neutral-400">
            A deterministic 3-step pipeline transforming carbon emissions from a regulatory liability into profitable off-take contracts.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.step}
                className="group relative overflow-hidden border-neutral-200/80 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover dark:border-neutral-800 dark:bg-neutral-900"
              >
                {/* Accent top gradient line */}
                <div
                  className={`h-1.5 w-full ${
                    idx === 0
                      ? 'bg-emerald-500'
                      : idx === 1
                      ? 'bg-blue-600'
                      : 'bg-teal-500'
                  }`}
                />

                <CardContent className="p-7 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconColor} shadow-xs transition group-hover:scale-105`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-3xl font-black text-neutral-200 dark:text-neutral-800 group-hover:text-neutral-300 dark:group-hover:text-neutral-700 transition">
                      {item.step}
                    </span>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Step {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-neutral-950 dark:text-white">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed dark:text-neutral-300">
                    {item.text}
                  </p>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-[11px] text-neutral-500">
                    {item.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
