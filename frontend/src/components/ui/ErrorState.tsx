import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load telemetry or ledger data',
  description = 'An unexpected error occurred while communicating with the CarbonX network. Check your connection or retry.',
  onRetry,
  isRetrying = false,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/40 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-sm dark:bg-red-950 dark:text-red-400">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h4 className="mt-4 text-sm font-bold text-neutral-900 dark:text-white">
        {title}
      </h4>

      {description && (
        <p className="mt-1.5 max-w-md text-xs text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}

      {onRetry && (
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            className="gap-2 border-red-300 text-red-700 hover:bg-red-100/50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Retrying Connection...' : 'Retry Operation'}</span>
          </Button>
        </div>
      )}
    </div>
  );
};
