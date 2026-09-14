import React from 'react';
import { AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface MatchExplanationProps {
  sourceName?: string;
  sinkName?: string;
  rationale: string[];
  warnings: string[];
  netAvoidedTons: number;
  estimatedRevenue: string;
}

/**
 * MatchExplanation — Sticky storytelling narrative explaining the match reasoning, risks, and economic upside.
 */
export const MatchExplanation: React.FC<MatchExplanationProps> = ({
  rationale = [
    'CO₂ stream purity (94.2%) exceeds minimum threshold (88.0%) required for direct mineral carbonation.',
    'Flue gas stack temperature (145°C) provides sufficient waste heat for amine solvent regeneration.',
    'Geographic proximity (42 km) enables low-cost direct pipeline transport without rail logistics overhead.',
  ],
  warnings = [
    'SOx content requires secondary gas polishing unit if stack moisture exceeds 2.5%.',
  ],
  netAvoidedTons = 16800,
  estimatedRevenue = '$3.1M / year',
}) => {
  return (
    <div className="space-y-6">
      {/* Rationale Card */}
      <div className="rounded-xl border border-[#222736] bg-[#12141C] p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#222736]">
          <Sparkles className="h-5 w-5 text-[#00FF87]" />
          <h3 className="font-display text-base font-bold text-[#F8FAFC]">
            WHY THIS MATCH WORKS
          </h3>
        </div>

        <ul className="space-y-3">
          {rationale.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00FF87] mt-0.5" />
              <span className="font-sans text-xs text-[#CBD5E1] leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Warnings & Risk Mitigation */}
      {warnings.length > 0 && (
        <div className="rounded-xl border border-[#FF9F1C]/40 bg-[#FF9F1C]/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-[#FF9F1C]" />
            <span className="font-mono text-xs font-bold text-[#FF9F1C] uppercase">
              TECHNICAL WARNINGS & RISK CONSIDERATIONS
            </span>
          </div>
          <ul className="space-y-1.5 pl-6 list-disc text-xs text-[#FF9F1C]">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Impact & Financial Summary Bento Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#222736] bg-[#090A0F] p-5">
          <span className="font-mono text-[10px] font-bold text-[#94A3B8] uppercase">NET AVOIDED CARBON</span>
          <div className="font-display text-3xl font-extrabold text-[#00FF87] mt-1">
            {netAvoidedTons.toLocaleString()}
          </div>
          <span className="font-mono text-xs text-[#64748B]">tCO₂e / YEAR SEQUESTERED</span>
        </div>

        <div className="rounded-xl border border-[#222736] bg-[#090A0F] p-5">
          <span className="font-mono text-[10px] font-bold text-[#FF9F1C] uppercase font-mono">ESTIMATED REVENUE / OPEX SAVINGS</span>
          <div className="font-display text-3xl font-extrabold text-[#FF9F1C] mt-1">
            {estimatedRevenue}
          </div>
          <span className="font-mono text-xs text-[#64748B]">PRODUCT OFFTAKE CONTRACT VALUE</span>
        </div>
      </div>
    </div>
  );
};
