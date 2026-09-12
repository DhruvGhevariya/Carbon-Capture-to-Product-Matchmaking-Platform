import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type KPIStatColor = 'primary' | 'secondary' | 'emerald' | 'amber' | 'blue' | 'purple' | 'slate';
export type TrendDirection = 'up' | 'down' | 'neutral';

export interface KPIStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendDirection?: TrendDirection;
  color?: KPIStatColor;
  className?: string;
}

export const KPIStatCard: React.FC<KPIStatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'neutral',
  color = 'primary',
  className,
}) => {
  const iconColorStyles: Record<KPIStatColor, string> = {
    primary: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    secondary: 'bg-blue-50 text-blue-600 border-blue-200/80',
    blue: 'bg-blue-50 text-blue-600 border-blue-200/80',
    amber: 'bg-amber-50 text-amber-600 border-amber-200/80',
    purple: 'bg-purple-50 text-purple-600 border-purple-200/80',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const trendStyles: Record<TrendDirection, { container: string; icon: string }> = {
    up: {
      container: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'text-emerald-600',
    },
    down: {
      container: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: 'text-amber-600',
    },
    neutral: {
      container: 'bg-slate-50 text-slate-600 border-slate-200',
      icon: 'text-slate-400',
    },
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-card-hover',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl border shadow-xs',
            iconColorStyles[color] || iconColorStyles.primary
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="tabular-nums text-2xl font-extrabold tracking-tight text-slate-900">
          {value}
        </span>

        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
              trendStyles[trendDirection].container
            )}
          >
            {trendDirection === 'up' && (
              <TrendingUp className={cn('h-3 w-3', trendStyles[trendDirection].icon)} />
            )}
            {trendDirection === 'down' && (
              <TrendingDown className={cn('h-3 w-3', trendStyles[trendDirection].icon)} />
            )}
            {trendDirection === 'neutral' && (
              <Minus className={cn('h-3 w-3', trendStyles[trendDirection].icon)} />
            )}
            <span>{trend}</span>
          </span>
        )}
      </div>
    </div>
  );
};
