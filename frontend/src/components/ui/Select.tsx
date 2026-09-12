import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id, disabled, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-xs text-neutral-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:disabled:bg-neutral-800',
              error
                ? 'border-red-600 focus:border-red-600 focus:ring-black'
                : 'border-neutral-300 hover:border-black focus:border-black focus:ring-black dark:border-neutral-700',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {error ? (
          <p className="text-[11px] font-medium text-error-600 dark:text-error-400">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
