import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface MatchScoreLegendProps {
  className?: string;
  compact?: boolean;
}

export const MatchScoreLegend: React.FC<MatchScoreLegendProps> = ({
  className,
  compact = false,
}) => {
  const tiers = [
    {
      range: '85 – 100%',
      label: 'Optimal Match',
      variant: 'primary' as const,
      description: 'Maximum chemical purity alignment, minimal road freight distance, high reliability.',
    },
    {
      range: '70 – 84%',
      label: 'High Compatibility',
      variant: 'outline' as const,
      description: 'Meets industrial process specs with viable landed freight economics.',
    },
    {
      range: '50 – 69%',
      label: 'Moderate Match',
      variant: 'secondary' as const,
      description: 'Standard flue gas stream; may require localized purification or longer transit.',
    },
    {
      range: '< 50%',
      label: 'Baseline Match',
      variant: 'neutral' as const,
      description: 'Viable with custom logistics coordination or off-peak delivery windows.',
    },
  ];

  if (compact) {
    return (
      <div
        className={cn(
          'flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 text-xs shadow-sm dark:border-neutral-800 dark:bg-black',
          className
        )}
      >
        <div className="flex items-center space-x-1.5 font-bold text-black dark:text-white">
          <Sparkles className="h-3.5 w-3.5 text-black dark:text-white" />
          <span>AI Score:</span>
        </div>
        {tiers.map((t) => (
          <div key={t.range} className="flex items-center space-x-1.5">
            <Badge variant={t.variant} size="sm" dot>
              {t.range}
            </Badge>
            <span className="text-[11px] text-neutral-600 dark:text-neutral-400">{t.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-black',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-100 text-black border border-neutral-200 dark:bg-neutral-900 dark:text-white dark:border-neutral-800">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-black dark:text-white">
              AI Match Engine 1.0
            </h4>
            <p className="text-[10px] text-neutral-500">
              Multi-parameter objective scoring
            </p>
          </div>
        </div>
        <span className="flex items-center space-x-1 text-[10px] font-bold text-black dark:text-white">
          <ShieldCheck className="h-3 w-3" />
          <span>Deterministic</span>
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        {tiers.map((t) => (
          <div
            key={t.range}
            className="flex items-start justify-between space-x-2 rounded-lg bg-neutral-50 p-2 text-xs border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800"
          >
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <Badge variant={t.variant} size="sm" dot>
                  {t.range}
                </Badge>
                <span className="font-bold text-black dark:text-white">
                  {t.label}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {t.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500 flex items-center justify-between">
        <span>Evaluates: Purity • Distance • Freight • Volume</span>
        <CheckCircle2 className="h-3.5 w-3.5 text-black dark:text-white" />
      </div>
    </div>
  );
};

export default MatchScoreLegend;
