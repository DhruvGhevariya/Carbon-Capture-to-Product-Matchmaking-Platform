import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Filter, Zap, Box, ShieldCheck, ArrowRight } from 'lucide-react';

interface FlowStep {
  id: string;
  name: string;
  subtext: string;
  status: 'active' | 'optimal' | 'pending';
  metric: string;
  icon: React.ElementType;
}

interface CarbonFlowProps {
  sourceName?: string;
  sourceTonnage?: number;
  productName?: string;
  purityPercent?: number;
  avoidedTonnage?: number;
}

/**
 * CarbonFlow — Signature scientific visualization tracking the CO₂ transformation pipeline.
 * CO₂ SOURCE → CAPTURE → TREATMENT → UTILIZATION → PRODUCT → AVOIDED EMISSIONS
 */
export const CarbonFlow: React.FC<CarbonFlowProps> = ({
  sourceName = 'Integrated Steel Plant',
  sourceTonnage = 18420,
  productName = 'Precast Concrete Elements',
  purityPercent = 94.2,
  avoidedTonnage = 16800,
}) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps: FlowStep[] = [
    {
      id: 'source',
      name: 'CO₂ EMITTER SOURCE',
      subtext: sourceName,
      status: 'active',
      metric: `${sourceTonnage.toLocaleString()} t/yr`,
      icon: Flame,
    },
    {
      id: 'capture',
      name: 'POST-COMBUSTION CAPTURE',
      subtext: 'Amine Absorption Unit',
      status: 'optimal',
      metric: '92% Recovery Rate',
      icon: Filter,
    },
    {
      id: 'treatment',
      name: 'PURIFICATION & DRIED',
      subtext: 'Cryogenic Distillation',
      status: 'optimal',
      metric: `${purityPercent}% Pure CO₂`,
      icon: Zap,
    },
    {
      id: 'utilization',
      name: 'CONVERSION PATHWAY',
      subtext: 'Direct Mineral Carbonation',
      status: 'active',
      metric: 'TRL 8 Commercial',
      icon: Zap,
    },
    {
      id: 'product',
      name: 'PRODUCT SINK',
      subtext: productName,
      status: 'optimal',
      metric: '$185 / Ton Value',
      icon: Box,
    },
    {
      id: 'avoided',
      name: 'NET AVOIDED EMISSIONS',
      subtext: 'Permanently Sequestered',
      status: 'optimal',
      metric: `${avoidedTonnage.toLocaleString()} tCO₂e/yr`,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#222736] bg-[#12141C] p-6 shadow-card">
      {/* Background grid */}
      <div className="bg-tech-grid absolute inset-0 opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#222736]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00FF87] animate-pulse" />
            <h3 className="font-display text-lg font-bold tracking-tight text-[#F8FAFC]">
              CARBON TRANSFORMATION PIPELINE
            </h3>
          </div>
          <p className="font-mono text-xs text-[#94A3B8] mt-0.5">
            INSTRUMENTATION TELEMETRY · FLOW-ID #CF-2026-994
          </p>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-[#090A0F] border border-[#222736] px-3 py-1.5 rounded-md">
            <span className="text-[#64748B]">MASS BALANCE:</span>
            <span className="font-bold text-[#00FF87]">98.4% EFFICIENT</span>
          </div>
        </div>
      </div>

      {/* Pipeline Steps Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isSelected = activeStep === index;
          return (
            <div key={step.id} className="relative group">
              <motion.div
                onHoverStart={() => setActiveStep(index)}
                onHoverEnd={() => setActiveStep(null)}
                whileHover={{ y: -3 }}
                className={`relative flex flex-col justify-between rounded-lg border p-4 transition-all duration-200 h-full ${
                  isSelected
                    ? 'border-[#00FF87] bg-[#181B26] shadow-[0_0_20px_rgba(0,255,135,0.15)]'
                    : 'border-[#222736] bg-[#090A0F]/80 hover:border-[#333B52]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded border border-[#222736] bg-[#12141C] text-[#00FF87]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-[#64748B]">
                      0{index + 1}
                    </span>
                  </div>

                  <h4 className="font-mono text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                    {step.name}
                  </h4>
                  <p className="font-sans text-xs font-semibold text-[#F8FAFC] mt-1 line-clamp-1">
                    {step.subtext}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#222736]/60">
                  <span className="font-mono text-xs font-bold text-[#00FF87]">
                    {step.metric}
                  </span>
                </div>
              </motion.div>

              {/* Connecting Flow Arrow for Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#12141C] border border-[#222736] text-[#00FF87]">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
