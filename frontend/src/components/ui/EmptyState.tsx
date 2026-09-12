import React from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-700',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
        <Icon className="h-6 w-6" />
      </div>

      <h4 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">
        {title}
      </h4>

      {description && (
        <p className="mt-1 max-w-sm text-xs text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-4">
          <Button variant="primary" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};
