import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export type ProjectStage =
  | 'DRAFT'
  | 'PROPOSED'
  | 'UNDER_REVIEW'
  | 'TECHNICAL_VALIDATION'
  | 'COMMERCIAL_NEGOTIATION'
  | 'ACTIVE'
  | 'COMPLETED';

interface IndustrialTimelineProps {
  currentStage: ProjectStage;
  className?: string;
}

const stagesList: { id: ProjectStage; label: string }[] = [
  { id: 'DRAFT', label: 'DRAFT' },
  { id: 'PROPOSED', label: 'PROPOSED' },
  { id: 'UNDER_REVIEW', label: 'UNDER REVIEW' },
  { id: 'TECHNICAL_VALIDATION', label: 'TECH VALIDATION' },
  { id: 'COMMERCIAL_NEGOTIATION', label: 'COMMERCIAL NEGOTIATION' },
  { id: 'ACTIVE', label: 'ACTIVE OPERATION' },
  { id: 'COMPLETED', label: 'COMPLETED' },
];

/**
 * IndustrialTimeline — Progressive milestone line illuminating active project lifecycle stage.
 */
export const IndustrialTimeline: React.FC<IndustrialTimelineProps> = ({
  currentStage = 'TECHNICAL_VALIDATION',
  className = '',
}) => {
  const currentIndex = stagesList.findIndex((s) => s.id === currentStage);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-[#222736] bg-[#12141C] p-6 shadow-card ${className}`}>
      <div className="flex items-center justify-between pb-4 border-b border-[#222736] mb-6">
        <span className="font-mono text-xs font-bold text-[#F8FAFC] uppercase">
          PROJECT LIFECYCLE PROGRESSION
        </span>
        <span className="rounded bg-[#00FF87]/10 border border-[#00FF87]/30 px-2 py-0.5 font-mono text-[10px] font-bold text-[#00FF87]">
          STAGE: {currentStage.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Horizontal Connector Line for Desktop */}
        <div className="hidden md:block absolute top-4 left-4 right-4 h-0.5 bg-[#222736] z-0">
          <div
            className="h-full bg-[#00FF87] transition-all duration-500"
            style={{
              width: `${(currentIndex / (stagesList.length - 1)) * 100}%`,
            }}
          />
        </div>

        {stagesList.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={stage.id} className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
                  isPassed
                    ? 'border-[#00FF87] bg-[#00FF87] text-[#090A0F]'
                    : isCurrent
                    ? 'border-[#00FF87] bg-[#090A0F] text-[#00FF87] ring-4 ring-[#00FF87]/20'
                    : 'border-[#222736] bg-[#090A0F] text-[#64748B]'
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <span className="font-mono text-xs font-bold">{idx + 1}</span>
                )}
              </div>

              <span
                className={`font-mono text-[10px] font-semibold uppercase tracking-wider text-center ${
                  isCurrent
                    ? 'text-[#00FF87]'
                    : isPassed
                    ? 'text-[#F8FAFC]'
                    : 'text-[#64748B]'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
