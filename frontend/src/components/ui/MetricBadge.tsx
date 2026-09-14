import React from 'react';

interface MetricBadgeProps {
  label: string;
  type?: 'purity' | 'trl' | 'status' | 'verification' | 'info';
  status?: 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  type = 'info',
  status = 'neutral',
  className = '',
}) => {
  const getBadgeStyle = () => {
    if (type === 'purity') {
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    }
    if (type === 'trl') {
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30';
    }
    if (type === 'verification') {
      return 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30';
    }

    switch (status) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'warning':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'error':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${getBadgeStyle()} ${className}`}
    >
      {label}
    </span>
  );
};
