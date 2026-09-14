import React from 'react';
import { MatchScore } from './MatchScore';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OpportunityBentoProps {
  topMatchName?: string;
  matchScore?: number;
  totalCapacityTonnes?: number;
  activePathwaysCount?: number;
  verifiedSinksCount?: number;
}

/**
 * OpportunityBento — Asymmetric bento grid visual hero for CarbonX Dashboard.
 */
export const OpportunityBento: React.FC<OpportunityBentoProps> = ({
  topMatchName = 'JSW Steel Emitter #3 → CarbonCure Concrete Sink',
  matchScore = 94,
  totalCapacityTonnes = 148200,
  activePathwaysCount = 14,
  verifiedSinksCount = 28,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Hero Match Card (Spans 2 columns, 2 rows on large) */}
      <div className="md:col-span-2 lg:col-span-2 relative overflow-hidden rounded-xl border border-[#00FF87]/40 bg-[#12141C] p-6 shadow-[0_0_30px_rgba(0,255,135,0.1)] transition-all hover:border-[#00FF87]">
        <div className="bg-tech-grid absolute inset-0 opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#222736]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#00FF87]" />
            <span className="font-mono text-xs font-bold text-[#00FF87] uppercase tracking-wider">
              TOP COMPATIBILITY MATCH
            </span>
          </div>
          <span className="rounded bg-[#00FF87]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#00FF87]">
            ALGORITHMIC V1.8
          </span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 my-6">
          <div>
            <h3 className="font-display text-xl font-extrabold text-[#F8FAFC] leading-snug">
              {topMatchName}
            </h3>
            <p className="font-sans text-xs text-[#94A3B8] mt-2">
              Direct mineral carbonation pathway with zero rail logistics overhead.
            </p>
          </div>
          <MatchScore score={matchScore} size="hero" showLabel={false} />
        </div>

        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[#222736]">
          <div className="font-mono text-xs text-[#94A3B8]">
            AVOIDED EMISSIONS: <span className="font-bold text-[#00FF87]">16,800 tCO₂e/yr</span>
          </div>
          <button
            onClick={() => navigate('/discovery')}
            data-cursor="INSPECT"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#00FF87] hover:underline"
          >
            VIEW FULL MATCH ANALYSIS <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Metric Card 1: Total CO2 Capacity */}
      <div className="rounded-xl border border-[#222736] bg-[#12141C] p-6 shadow-card flex flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
            SYSTEM CAPACITY
          </span>
          <div className="font-display text-4xl font-extrabold text-[#F8FAFC] mt-2">
            {(totalCapacityTonnes / 1000).toFixed(1)}k
          </div>
          <span className="font-mono text-xs font-semibold text-[#00FF87]">tCO₂ AVAILABLE / YEAR</span>
        </div>
        <p className="font-sans text-xs text-[#94A3B8] mt-4">Across 12 verified emitter facilities.</p>
      </div>

      {/* Metric Card 2: Pathways & Sinks */}
      <div className="rounded-xl border border-[#222736] bg-[#12141C] p-6 shadow-card flex flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
            VERIFIED SINKS & PATHWAYS
          </span>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="font-display text-4xl font-extrabold text-[#FF9F1C]">{verifiedSinksCount}</span>
            <span className="font-mono text-xs text-[#94A3B8]">SINKS</span>
          </div>
          <div className="font-mono text-xs font-semibold text-[#00F0FF] mt-1">
            {activePathwaysCount} CONVERSION PATHWAYS
          </div>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px] text-[#64748B] mt-4">
          <ShieldCheck className="h-3.5 w-3.5 text-[#00FF87]" /> ISO 14064 VERIFIED DATA
        </div>
      </div>
    </div>
  );
};
