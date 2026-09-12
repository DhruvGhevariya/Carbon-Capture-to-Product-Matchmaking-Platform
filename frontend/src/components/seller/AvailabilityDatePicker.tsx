import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export interface AvailabilityDatePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  startDateError?: string;
  endDateError?: string;
  disabled?: boolean;
  className?: string;
}

export const AvailabilityDatePicker: React.FC<AvailabilityDatePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startDateError,
  endDateError,
  disabled = false,
  className,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate duration window in days
  const calculateDays = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : null;
  };

  const windowDays = calculateDays();

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          <Calendar className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
          <span>Batch Dispatch & Storage Window</span>
        </label>
        {windowDays !== null && (
          <span className="flex items-center space-x-1 rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-700 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-300">
            <Clock className="h-3 w-3 text-primary-600 dark:text-primary-400" />
            <span>{windowDays} Days Available Window</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Available From */}
        <div className="space-y-1">
          <label
            htmlFor="available_from"
            className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400"
          >
            Available From (Earliest Pickup)
          </label>
          <div className="relative">
            <input
              id="available_from"
              type="date"
              value={startDate}
              min={todayStr}
              disabled={disabled}
              onChange={(e) => onStartDateChange(e.target.value)}
              className={cn(
                'w-full rounded-lg border bg-white px-3 py-2 text-xs text-neutral-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:disabled:bg-neutral-800',
                startDateError
                  ? 'border-error-600 focus:border-error-600 focus:ring-error-500'
                  : 'border-neutral-200 hover:border-neutral-300 focus:border-primary-600 dark:border-neutral-700'
              )}
            />
          </div>
          {startDateError && (
            <p className="text-[10px] font-medium text-error-600 dark:text-error-400">
              {startDateError}
            </p>
          )}
        </div>

        {/* Available Until */}
        <div className="space-y-1">
          <label
            htmlFor="available_until"
            className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400"
          >
            Available Until (Storage Expiration)
          </label>
          <div className="relative">
            <input
              id="available_until"
              type="date"
              value={endDate}
              min={startDate || todayStr}
              disabled={disabled}
              onChange={(e) => onEndDateChange(e.target.value)}
              className={cn(
                'w-full rounded-lg border bg-white px-3 py-2 text-xs text-neutral-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:disabled:bg-neutral-800',
                endDateError
                  ? 'border-error-600 focus:border-error-600 focus:ring-error-500'
                  : 'border-neutral-200 hover:border-neutral-300 focus:border-primary-600 dark:border-neutral-700'
              )}
            />
          </div>
          {endDateError && (
            <p className="text-[10px] font-medium text-error-600 dark:text-error-400">
              {endDateError}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1.5 text-[11px] text-neutral-600 dark:text-neutral-400">
        <span>Window:</span>
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{startDate || 'Today'}</span>
        <ArrowRight className="h-3 w-3 text-neutral-400" />
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{endDate || 'Select end date'}</span>
      </div>
    </div>
  );
};

export default AvailabilityDatePicker;
