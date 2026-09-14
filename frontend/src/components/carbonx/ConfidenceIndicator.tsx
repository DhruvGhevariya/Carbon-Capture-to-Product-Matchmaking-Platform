import React from 'react';
import { ShieldCheck, Database, Cpu, Sparkles } from 'lucide-react';

interface ConfidenceIndicatorProps {
  confidenceScore?: number;
  level?: 'HIGH' | 'MEDIUM' | 'ESTIMATED';
  className?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidenceScore = 92,
  level = 'HIGH',
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded bg-[#090A0F] border border-[#222736] px-2.5 py-1 font-mono text-[10px] font-bold ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-[#00FF87] animate-pulse" />
      <span className="text-[#94A3B8]">CONFIDENCE:</span>
      <span className="text-[#00FF87]">{confidenceScore}% ({level})</span>
    </div>
  );
};

export type ProvenanceType = 'USER_PROVIDED' | 'CALCULATED' | 'ESTIMATED' | 'REFERENCE' | 'SYSTEM_DEFAULT';

interface ProvenanceBadgeProps {
  type: ProvenanceType;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({ type, className = '' }) => {
  const badgeConfig: Record<ProvenanceType, { label: string; icon: React.ElementType; color: string }> = {
    USER_PROVIDED: { label: 'USER SPECTRA', icon: Database, color: 'border-[#00F0FF]/40 bg-[#00F0FF]/10 text-[#00F0FF]' },
    CALCULATED: { label: 'THERMO CALCULATED', icon: Cpu, color: 'border-[#00FF87]/40 bg-[#00FF87]/10 text-[#00FF87]' },
    ESTIMATED: { label: 'AI ESTIMATED', icon: Sparkles, color: 'border-[#FF9F1C]/40 bg-[#FF9F1C]/10 text-[#FF9F1C]' },
    REFERENCE: { label: 'LAB BENCHMARK', icon: ShieldCheck, color: 'border-[#94A3B8]/40 bg-[#181B26] text-[#94A3B8]' },
    SYSTEM_DEFAULT: { label: 'DEFAULT METRIC', icon: Database, color: 'border-[#64748B]/40 bg-[#181B26] text-[#64748B]' },
  };

  const config = badgeConfig[type] || badgeConfig.CALCULATED;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase ${config.color} ${className}`}>
      <Icon className="h-2.5 w-2.5" />
      {config.label}
    </span>
  );
};
