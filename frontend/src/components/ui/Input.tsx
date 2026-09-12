import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-neutral-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg border bg-white px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500 dark:disabled:bg-neutral-800',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error
                ? 'border-red-600 focus:border-red-600 focus:ring-black'
                : 'border-neutral-300 hover:border-black focus:border-black focus:ring-black dark:border-neutral-700',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 flex items-center text-neutral-400">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';
