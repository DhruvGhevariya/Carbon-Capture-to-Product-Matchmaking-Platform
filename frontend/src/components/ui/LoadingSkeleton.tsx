import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSkeletonProps {
  type?: 'table' | 'card' | 'line';
  rows?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'line',
  rows = 3,
  className,
}) => {
  if (type === 'card') {
    return (
      <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-neutral-200 bg-white p-5 shadow-card dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <div className="mt-6 flex justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <div className="h-5 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-7 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={cn('w-full space-y-3', className)}>
        <div className="h-10 w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-14 w-full animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800/60"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"
        />
      ))}
    </div>
  );
};
