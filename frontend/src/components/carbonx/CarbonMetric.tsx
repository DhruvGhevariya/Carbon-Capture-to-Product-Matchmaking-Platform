import React from 'react';

interface CarbonMetricProps {
  value: string | number;
  unit?: string;
  label: string;
  subtext?: string;
  trend?: string;
  highlight?: boolean;
  className?: string;
}

export const CarbonMetric: React.FC<CarbonMetricProps> = ({
  value,
  unit = '',
  label,
  subtext,
  trend,
  highlight = false,
  className = '',
}) => {
  return (
    <div
      className={`rounded-xl border p-5 transition-all duration-200 ${
        highlight
          ? 'border-[#00FF87]/50 bg-[#12141C] shadow-[0_0_20px_rgba(0,255,135,0.1)]'
          : 'border-[#222736] bg-[#12141C]'
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
          {label}
        </span>
        {trend && (
          <span className="font-mono text-[10px] font-bold text-[#00FF87] bg-[#00FF87]/10 px-1.5 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
          {value}
        </span>
        {unit && <span className="font-mono text-xs font-bold text-[#00FF87]">{unit}</span>}
      </div>

      {subtext && <p className="font-sans text-xs text-[#64748B] mt-1">{subtext}</p>}
    </div>
  );
};
