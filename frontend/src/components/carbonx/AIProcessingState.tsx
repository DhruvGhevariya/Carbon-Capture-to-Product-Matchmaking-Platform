import React from 'react';
import { Sparkles, Layers, CheckCircle2, Loader2 } from 'lucide-react';

export type AIStateStep = 'ANALYZING' | 'RETRIEVING_SPECTRA' | 'CALCULATING_THERMO' | 'GENERATING_EXPLANATION' | 'COMPLETE';

interface AIProcessingStateProps {
  currentStep: AIStateStep;
  details?: string;
  className?: string;
}

export const AIProcessingState: React.FC<AIProcessingStateProps> = ({
  currentStep = 'CALCULATING_THERMO',
  details = 'Running Aspen HYSYS mass & energy balance simulation...',
  className = '',
}) => {
  const steps: { id: AIStateStep; label: string }[] = [
    { id: 'ANALYZING', label: 'ANALYZING QUERY' },
    { id: 'RETRIEVING_SPECTRA', label: 'RETRIEVING FEEDSTOCK SPECTRA' },
    { id: 'CALCULATING_THERMO', label: 'THERMODYNAMIC CALCULATIONS' },
    { id: 'GENERATING_EXPLANATION', label: 'GENERATING REPORT' },
  ];

  const currentIdx = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className={`rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/5 p-5 shadow-card ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-[#00F0FF]/20">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#00F0FF] animate-pulse" />
          <span className="font-mono text-xs font-bold text-[#00F0FF] uppercase tracking-wider">
            CARBONX INTELLIGENCE ENGINE ACTIVE
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#94A3B8]">MODEL: CLIMATE-COPILOT v2.4</span>
      </div>

      <div className="mt-4 space-y-2">
        {steps.map((s, idx) => {
          const isDone = idx < currentIdx || currentStep === 'COMPLETE';
          const isCurrent = idx === currentIdx && currentStep !== 'COMPLETE';

          return (
            <div key={s.id} className="flex items-center gap-3 font-mono text-xs">
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-[#00FF87]" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 text-[#00F0FF] animate-spin" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-[#222736]" />
              )}
              <span
                className={
                  isDone
                    ? 'text-[#F8FAFC] font-semibold'
                    : isCurrent
                    ? 'text-[#00F0FF] font-bold'
                    : 'text-[#64748B]'
                }
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {details && (
        <div className="mt-4 rounded border border-[#222736] bg-[#090A0F] p-3 font-mono text-xs text-[#94A3B8]">
          <span className="text-[#00F0FF]">LIVE LOG:</span> {details}
        </div>
      )}
    </div>
  );
};

interface CopilotContextProps {
  entityName: string;
  entityType: 'SOURCE' | 'SINK' | 'PATHWAY' | 'PROJECT';
  idTag: string;
  confidence: number;
}

export const CopilotContext: React.FC<CopilotContextProps> = ({
  entityName = 'JSW Steel Plant Emitter #3',
  entityType = 'SOURCE',
  idTag = 'CO2-104',
  confidence = 94.2,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#222736] bg-[#12141C] px-4 py-2.5">
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4 text-[#00F0FF]" />
        <span className="font-mono text-xs text-[#64748B]">ANALYZING CONTEXT:</span>
        <span className="font-sans text-xs font-bold text-[#F8FAFC]">{entityName}</span>
        <span className="rounded bg-[#00F0FF]/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#00F0FF]">
          {entityType} #{idTag}
        </span>
      </div>
      <div className="font-mono text-xs text-[#00FF87] font-bold">
        CONFIDENCE {confidence}%
      </div>
    </div>
  );
};
