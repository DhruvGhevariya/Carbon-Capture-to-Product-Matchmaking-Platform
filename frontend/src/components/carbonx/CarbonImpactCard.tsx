import React from 'react';
import { Leaf, DollarSign } from 'lucide-react';

interface CarbonImpactCardProps {
  avoidedEmissions: number;
  captureEfficiency: number;
  carbonCreditsValue?: string;
  className?: string;
}

export const CarbonImpactCard: React.FC<CarbonImpactCardProps> = ({
  avoidedEmissions = 18420,
  captureEfficiency = 92.4,
  carbonCreditsValue = '$828,900 / year',
  className = '',
}) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-[#222736] bg-[#12141C] p-6 shadow-card ${className}`}>
      <div className="flex items-center justify-between pb-4 border-b border-[#222736]">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-[#00FF87]" />
          <span className="font-mono text-xs font-bold text-[#F8FAFC] uppercase">CARBON NET IMPACT</span>
        </div>
        <span className="font-mono text-[10px] text-[#00FF87] bg-[#00FF87]/10 px-2 py-0.5 rounded border border-[#00FF87]/30">
          ARTICLE 6 COMPLIANT
        </span>
      </div>

      <div className="mt-5">
        <span className="font-mono text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
          ANNUAL AVOIDED CO₂ EMISSIONS
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-display text-5xl font-extrabold tracking-tight text-[#F8FAFC]">
            {avoidedEmissions.toLocaleString()}
          </span>
          <span className="font-mono text-sm font-bold text-[#00FF87]">tCO₂e / yr</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-[#222736]">
        <div>
          <span className="font-mono text-[10px] text-[#64748B] uppercase">CAPTURE EFFICIENCY</span>
          <p className="font-display text-lg font-bold text-[#F8FAFC]">{captureEfficiency}%</p>
        </div>
        <div>
          <span className="font-mono text-[10px] text-[#64748B] uppercase">EST. CREDIT YIELD</span>
          <p className="font-display text-lg font-bold text-[#00FF87]">{carbonCreditsValue}</p>
        </div>
      </div>
    </div>
  );
};

interface EconomicScenarioCardProps {
  capex: string;
  opexPerTon: string;
  offtakePricePerTon: string;
  paybackPeriodYears: number;
  npv7Year: string;
  className?: string;
}

export const EconomicScenarioCard: React.FC<EconomicScenarioCardProps> = ({
  capex = '$12.4M',
  opexPerTon = '$42.50 / ton',
  offtakePricePerTon = '$185.00 / ton',
  paybackPeriodYears = 3.8,
  npv7Year = '$14.8M',
  className = '',
}) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-[#222736] bg-[#12141C] p-6 shadow-card ${className}`}>
      <div className="flex items-center justify-between pb-4 border-b border-[#222736]">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-[#FF9F1C]" />
          <span className="font-mono text-xs font-bold text-[#F8FAFC] uppercase">COMMERCIAL FEASIBILITY & ROI</span>
        </div>
        <span className="font-mono text-[10px] text-[#FF9F1C] bg-[#FF9F1C]/10 px-2 py-0.5 rounded border border-[#FF9F1C]/30">
          BANKABLE SCENARIO
        </span>
      </div>

      <div className="mt-5">
        <span className="font-mono text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
          PROJECT PAYBACK PERIOD
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-display text-5xl font-extrabold tracking-tight text-[#FF9F1C]">
            {paybackPeriodYears}
          </span>
          <span className="font-mono text-sm font-bold text-[#F8FAFC]">YEARS</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#222736]">
        <div>
          <span className="font-mono text-[10px] text-[#64748B] uppercase">CAPEX</span>
          <p className="font-display text-base font-bold text-[#F8FAFC]">{capex}</p>
        </div>
        <div>
          <span className="font-mono text-[10px] text-[#64748B] uppercase">OPEX</span>
          <p className="font-display text-base font-bold text-[#F8FAFC]">{opexPerTon}</p>
        </div>
        <div>
          <span className="font-mono text-[10px] text-[#64748B] uppercase">OFFTAKE PRICE</span>
          <p className="font-display text-base font-bold text-[#00FF87]">{offtakePricePerTon}</p>
        </div>
        <div>
          <span className="font-mono text-[10px] text-[#64748B] uppercase">7-YR NPV</span>
          <p className="font-display text-base font-bold text-[#FF9F1C]">{npv7Year}</p>
        </div>
      </div>
    </div>
  );
};
