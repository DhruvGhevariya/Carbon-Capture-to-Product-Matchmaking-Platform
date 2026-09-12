import React from 'react';
import { cn, formatINR } from '@/lib/utils';
import { Sparkles, CheckCircle2, Clock, MapPin, Award, ArrowRight } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';

export interface AIRecommendationCardProps {
  supplierName: string;
  industry: string;
  matchScore: number;
  confidenceScore: number;
  whyRecommended: string;
  landedCost: number;
  etaHours: number;
  distanceKm: number;
  purityPercentage?: number;
  onSelectSupplier?: () => void;
  className?: string;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  supplierName,
  industry,
  matchScore,
  confidenceScore,
  whyRecommended,
  landedCost,
  etaHours,
  distanceKm,
  purityPercentage,
  onSelectSupplier,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-primary-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-primary-800 dark:bg-neutral-900',
        className
      )}
    >
      {/* Top Banner: AI Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-600 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-400">
              Optimal Match Matchmaker
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-neutral-500">
              <Award className="h-3.5 w-3.5 text-primary-600" />
              <span>Multi-attribute Optimization Model 1.0</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" size="md">
            Confidence: {confidenceScore.toFixed(1)}%
          </Badge>
          <div className="rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
            {matchScore} / 100 Score
          </div>
        </div>
      </div>

      {/* Main recommendation summary */}
      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Supplier details */}
        <div className="space-y-2 lg:col-span-2">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase text-neutral-400">Best Supplier</span>
            <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
              {supplierName}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">{industry}</p>
          </div>

          {/* Explainable AI Natural Language Box */}
          <div className="mt-3 rounded-xl border border-primary-200/60 bg-white/80 p-3.5 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-800/80">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                  Why Recommended
                </span>
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {whyRecommended}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Commercial & Logistics Metrics Snapshot */}
        <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-800/60">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-semibold uppercase text-neutral-400">
                Total Landed Cost
              </span>
              <p className="tabular-nums text-xl font-extrabold text-primary-700 dark:text-primary-400">
                {formatINR(landedCost)}
                <span className="text-xs font-normal text-neutral-500"> / ton</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-neutral-100 pt-2.5 text-xs dark:border-neutral-700">
              <div className="space-y-0.5">
                <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                  <Clock className="h-3 w-3 text-secondary-500" />
                  ETA
                </span>
                <span className="tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">
                  {etaHours.toFixed(1)} hrs
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                  <MapPin className="h-3 w-3 text-amber-500" />
                  Distance
                </span>
                <span className="tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">
                  {Math.round(distanceKm)} km
                </span>
              </div>
            </div>

            {purityPercentage && (
              <div className="rounded bg-neutral-50 px-2 py-1 text-center text-[11px] font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                Verified CO₂ Stream: <strong className="text-primary-700 dark:text-primary-400">{purityPercentage}%</strong> Purity
              </div>
            )}
          </div>

          {onSelectSupplier && (
            <Button
              variant="primary"
              size="md"
              onClick={onSelectSupplier}
              className="mt-4 w-full"
            >
              <span>Initiate Purchase Offer</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
