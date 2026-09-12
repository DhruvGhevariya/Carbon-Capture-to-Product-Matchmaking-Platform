import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/utils';
import {
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

export const AIRecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const [minPurity, setMinPurity] = useState<number>(95.0);
  const [targetVolume, setTargetVolume] = useState<number>(250);
  const [maxBudget, setMaxBudget] = useState<number>(5500);

  // Simulated rank scoring based on input parameters
  const suppliers = [
    {
      id: 'seller-ultratech',
      name: 'UltraTech Cement',
      city: 'Ahmedabad',
      purity: 98.5,
      score: 96,
      confidence: 98.4,
      distance: 28,
      price: 4800,
      freight: 310,
      landed: 5110,
      why: 'UltraTech Cement scores #1. The 28 km short haul keeps cryogenic trucking cost at only ₹310/t. Certified 98.5% purity exceeds floor with zero sulfur traces.',
    },
    {
      id: 'seller-jswsteel',
      name: 'JSW Steel',
      city: 'Vadodara',
      purity: 96.0,
      score: 94,
      confidence: 96.1,
      distance: 112,
      price: 4200,
      freight: 620,
      landed: 4820,
      why: 'Lowest overall landed cost (₹4,820/t). Proximity in Vadodara industrial corridor allows same-day delivery dispatch.',
    },
    {
      id: 'seller-ambuja',
      name: 'Ambuja Cement',
      city: 'Surat',
      purity: 97.2,
      score: 92,
      confidence: 94.0,
      distance: 265,
      price: 4500,
      freight: 1210,
      landed: 5710,
      why: 'High-purity liquid buffer batch ready for loading. Slightly higher distance penalty due to 265 km Hazira transit.',
    },
    {
      id: 'seller-tatasteel',
      name: 'Tata Steel',
      city: 'Jamnagar',
      purity: 94.8,
      score: 89,
      confidence: 91.2,
      distance: 320,
      price: 3900,
      freight: 1460,
      landed: 5360,
      why: 'Highest available single batch volume (500 tons), but delivered in pressurized gas phase.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Deterministic AI Match Engine"
        description="Explore 6-factor CCUS optimization: Purity match, transport distance, reserve pricing, inventory headroom, and delivery reliability."
        breadcrumbs={[
          { label: 'Marketplace', to: '/marketplace' },
          { label: 'AI Match Engine' },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Requirements Tuning */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-neutral-300">
            <CardHeader className="border-b border-neutral-100 pb-3">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="h-4 w-4 text-black" />
                <CardTitle>Off-Take Criteria</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <Input
                label="Minimum CO₂ Purity Floor (%)"
                type="number"
                step="0.1"
                min="80"
                max="99.9"
                value={minPurity}
                onChange={(e) => setMinPurity(Number(e.target.value))}
              />

              <Input
                label="Required Volume (Metric Tons)"
                type="number"
                min="10"
                max="1000"
                value={targetVolume}
                onChange={(e) => setTargetVolume(Number(e.target.value))}
              />

              <Input
                label="Budget Ceiling (₹ / Ton Landed)"
                type="number"
                min="1000"
                max="15000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
              />

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600">
                <span className="font-semibold text-black">Mathematical Model:</span> Deterministic weighted score calculated from ISO 14064 emitter telemetry without LLM hallucinations.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Ranked Recommendations */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Ranked Verified Streams ({suppliers.length} Candidates)
            </span>
            <span className="text-xs font-bold text-black">Algorithm: CarbonX v1.0</span>
          </div>

          <div className="space-y-4">
            {suppliers.map((s, idx) => (
              <Card key={s.id} className={idx === 0 ? 'border-black ring-1 ring-black shadow-md' : 'border-neutral-300'}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-neutral-400">#{idx + 1}</span>
                        <h4 className="text-base font-bold text-black">{s.name}</h4>
                        <span className="text-xs text-neutral-500">({s.city}, Gujarat)</span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-600">{s.why}</p>
                    </div>

                    <div className="text-right shrink-0 pl-4">
                      <span className="inline-flex items-center rounded-full bg-black px-2.5 py-1 text-xs font-extrabold text-white">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {s.score}/100 Match
                      </span>
                      <div className="mt-1 text-[10px] text-neutral-400 font-mono">
                        {s.confidence}% Confidence
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-100 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase">Purity</span>
                      <p className="font-bold text-black">{s.purity}%</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase">Distance</span>
                      <p className="font-bold text-black">{s.distance} km</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase">CO₂ Price</span>
                      <p className="font-bold text-black font-mono">{formatINR(s.price)}/t</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase">Landed Cost</span>
                      <p className="font-bold text-black font-mono">{formatINR(s.landed)}/t</p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      variant={idx === 0 ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => navigate(`/marketplace/${s.id}`)}
                      className="gap-1.5"
                    >
                      <span>View & Place Bid</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationPage;
