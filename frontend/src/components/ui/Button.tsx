import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg active:scale-[0.98]';

    const variants = {
      primary:
        'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600 shadow-sm shadow-emerald-600/10',
      secondary:
        'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 shadow-sm',
      outline:
        'border border-slate-300 bg-white text-slate-800 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 shadow-sm',
      ghost:
        'text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-800',
      danger:
        'bg-red-600 text-white hover:bg-red-700 border border-red-600 shadow-sm focus:ring-red-500',
    };

    const sizes = {
      sm: 'px-2.5 py-1 text-xs gap-1.5',
      md: 'px-3.5 py-2 text-xs font-medium gap-2',
      lg: 'px-4 py-2.5 text-sm font-semibold gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="h-3.5 w-3.5 animate-spin text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
