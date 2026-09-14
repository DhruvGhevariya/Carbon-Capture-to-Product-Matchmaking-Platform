import React from 'react';
import { Flame, Sparkles, Factory, ShieldCheck, Leaf } from 'lucide-react';


interface CarbonFlowDiagramProps {
  capturedTons?: number;
  purityPct?: number;
  utilizedTons?: number;
  productName?: string;
  netAvoidedTons?: number;
  className?: string;
}

export const CarbonFlowDiagram: React.FC<CarbonFlowDiagramProps> = ({
  capturedTons = 500,
  purityPct = 98.5,
  utilizedTons = 460,
  productName = 'Concrete Block Curing / Methanol',
  netAvoidedTons = 377,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Leaf className="h-4 w-4 text-emerald-600" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
            Industrial Carbon Transformation Flow
          </h3>
        </div>
        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          ISO 14064 Verified
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-center">
        {/* Step 1: Captured CO2 */}
        <div className="relative rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-500">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span>1. Capture Source</span>
          </div>
          <div className="mt-1.5 text-lg font-black text-slate-900 dark:text-white">
            {capturedTons.toLocaleString()} t
          </div>
          <p className="text-[10px] text-slate-400">Gross Point-Source</p>
        </div>

        {/* Step 2: Purification */}
        <div className="relative rounded-xl border border-teal-200 bg-teal-50/50 p-3.5 dark:border-teal-900 dark:bg-teal-950/30">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-teal-900 dark:text-teal-300">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            <span>2. Purification</span>
          </div>
          <div className="mt-1.5 text-lg font-black text-teal-950 dark:text-teal-200">
            {purityPct}% Purity
          </div>
          <p className="text-[10px] text-teal-700 dark:text-teal-400">Supercritical Stream</p>
        </div>

        {/* Step 3: Utilization */}
        <div className="relative rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 dark:border-blue-900 dark:bg-blue-950/30">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-blue-900 dark:text-blue-300">
            <Factory className="h-3.5 w-3.5 text-blue-600" />
            <span>3. Utilization</span>
          </div>
          <div className="mt-1.5 text-lg font-black text-blue-950 dark:text-blue-200">
            {utilizedTons.toLocaleString()} t
          </div>
          <p className="text-[10px] text-blue-700 dark:text-blue-400 truncate">{productName}</p>
        </div>

        {/* Step 4: Avoided Carbon */}
        <div className="relative rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-3.5 dark:border-emerald-700 dark:from-emerald-950/60 dark:to-slate-900">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-emerald-900 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>4. Net Avoided</span>
          </div>
          <div className="mt-1.5 text-xl font-black text-emerald-700 dark:text-emerald-400">
            {netAvoidedTons.toLocaleString()} t CO₂e
          </div>
          <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold">Net Climate Impact</p>
        </div>
      </div>
    </div>
  );
};
