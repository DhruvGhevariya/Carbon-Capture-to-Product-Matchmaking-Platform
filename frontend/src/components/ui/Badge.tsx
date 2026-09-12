import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    primary:
      'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    secondary:
      'bg-blue-50 text-blue-700 border-blue-200/80',
    success:
      'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-semibold',
    warning:
      'bg-amber-50 text-amber-800 border-amber-200/80',
    error:
      'bg-red-50 text-red-700 border-red-200/80',
    neutral:
      'bg-slate-100 text-slate-700 border-slate-200',
    outline:
      'bg-white text-slate-700 border-slate-300',
  };

  const dotColors = {
    primary: 'bg-emerald-500',
    secondary: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    neutral: 'bg-slate-400',
    outline: 'bg-slate-400',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-0.5 text-xs gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
};
