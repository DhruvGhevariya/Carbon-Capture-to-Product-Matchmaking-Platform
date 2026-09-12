import React from 'react';
import { cn, formatINR, formatNumber } from '@/lib/utils';
import { ShieldCheck, MapPin, Gauge, Box, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export interface SupplierCardProps {
  id: string;
  companyName: string;
  industry: string;
  purityPercentage: number;
  availableTons: number;
  distanceKm: number;
  reservePriceTon: number;
  aiMatchScore: number;
  isVerified?: boolean;
  location?: string;
  onViewDetails?: (id: string) => void;
  className?: string;
  isSelectedForCompare?: boolean;
  onToggleCompare?: (id: string) => void;
  disableCompare?: boolean;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  id,
  companyName,
  industry,
  purityPercentage,
  availableTons,
  distanceKm,
  reservePriceTon,
  aiMatchScore,
  isVerified = true,
  location,
  onViewDetails,
  className,
  isSelectedForCompare = false,
  onToggleCompare,
  disableCompare = false,
}) => {
  return (
    <div
      className={cn(
        'group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-black dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-600',
        className
      )}
    >
      <div>
        {/* Top bar: Company name, Industry & AI Match Score badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-black dark:text-white">
                {companyName}
              </h4>
              {isVerified && (
                <span title="Verified Point-Source Capture Facility">
                  <ShieldCheck className="h-4 w-4 text-black dark:text-white" />
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500">{industry}</p>
            {location && (
              <p className="flex items-center gap-1 text-[11px] text-neutral-400">
                <MapPin className="h-3 w-3 text-black dark:text-white" />
                <span>{location}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col items-end">
            <span className="inline-flex items-center space-x-1 rounded-full bg-black px-2.5 py-1 text-xs font-bold text-white shadow-sm dark:bg-white dark:text-black">
              <Sparkles className="h-3 w-3" />
              <span>{aiMatchScore}% Match</span>
            </span>
          </div>
        </div>

        {/* Technical Specs Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-lg bg-neutral-50 p-3 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
          <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-neutral-500">
              <Gauge className="h-3 w-3 text-black dark:text-white" />
              CO₂ Purity
            </span>
            <p className="tabular-nums text-xs font-bold text-black dark:text-white">
              {formatNumber(purityPercentage, 2)}%
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-neutral-500">
              <Box className="h-3 w-3 text-black dark:text-white" />
              Available Volume
            </span>
            <p className="tabular-nums text-xs font-bold text-black dark:text-white">
              {formatNumber(availableTons, 1)} Tons
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-neutral-500">
              <MapPin className="h-3 w-3 text-black dark:text-white" />
              Distance
            </span>
            <p className="tabular-nums text-xs font-bold text-black dark:text-white">
              {Math.round(distanceKm)} km
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold uppercase text-neutral-500">
              Reserve Floor
            </span>
            <p className="tabular-nums text-xs font-bold text-black dark:text-white">
              {formatINR(reservePriceTon)}
              <span className="text-[10px] font-normal text-neutral-500">/t</span>
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400">Base Quote</span>
          <p className="tabular-nums text-sm font-black text-black dark:text-white">
            {formatINR(reservePriceTon)}
            <span className="text-xs font-normal text-neutral-500"> / metric ton</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onToggleCompare && (
            <button
              type="button"
              onClick={() => onToggleCompare(id)}
              disabled={disableCompare && !isSelectedForCompare}
              className={cn(
                'flex items-center space-x-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors',
                isSelectedForCompare
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-neutral-300 bg-white text-black hover:border-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white',
                disableCompare && !isSelectedForCompare && 'cursor-not-allowed opacity-40'
              )}
            >
              <input
                type="checkbox"
                checked={isSelectedForCompare}
                readOnly
                className="h-3 w-3 rounded accent-black pointer-events-none"
              />
              <span>Compare</span>
            </button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewDetails?.(id)}
            className="group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
