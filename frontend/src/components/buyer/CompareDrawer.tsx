import React from 'react';
import type { MarketplaceCard } from '@/types';
import { formatINR, formatNumber, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  X,
  Sparkles,
  ArrowRight,
  Gauge,
  Box,
  MapPin,
  IndianRupee,
  Truck,
  Check,
  Building2,
  Scale,
} from 'lucide-react';

export interface CompareDrawerProps {
  suppliers: MarketplaceCard[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onSelectSupplier: (id: string) => void;
  className?: string;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  suppliers,
  onRemove,
  onClear,
  onSelectSupplier,
  className,
}) => {
  if (suppliers.length === 0) return null;

  const first = suppliers[0];
  const second = suppliers.length > 1 ? suppliers[1] : null;

  // Comparison evaluation helpers (returns 1 for first, 2 for second, or 0 for tie)
  // 1. Purity: Higher is better
  const betterPurity = second
    ? first.purity_percentage > second.purity_percentage
      ? 1
      : second.purity_percentage > first.purity_percentage
      ? 2
      : 0
    : 0;

  // 2. Quantity: Higher is better
  const betterQuantity = second
    ? first.volume_available_tons > second.volume_available_tons
      ? 1
      : second.volume_available_tons > first.volume_available_tons
      ? 2
      : 0
    : 0;

  // 3. Distance: Lower is better (shorter transit)
  const betterDistance = second
    ? first.distance_km < second.distance_km
      ? 1
      : second.distance_km < first.distance_km
      ? 2
      : 0
    : 0;

  // 4. Price: Lower is better
  const betterPrice = second
    ? first.base_price_ton < second.base_price_ton
      ? 1
      : second.base_price_ton < first.base_price_ton
      ? 2
      : 0
    : 0;

  // 5. Landed Cost: Lower is better
  const betterLandedCost = second
    ? first.total_landed_cost_ton < second.total_landed_cost_ton
      ? 1
      : second.total_landed_cost_ton < first.total_landed_cost_ton
      ? 2
      : 0
    : 0;

  // 6. AI Match: Higher is better
  const betterAIMatch = second
    ? first.ai_match_score > second.ai_match_score
      ? 1
      : second.ai_match_score > first.ai_match_score
      ? 2
      : 0
    : 0;

  return (
    <aside
      aria-label="Supplier Comparison Drawer"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/95 p-4 shadow-floating backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95 sm:p-5',
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-black border border-neutral-200 dark:bg-neutral-900 dark:text-white dark:border-neutral-800">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-black dark:text-white">
                Supplier Comparison Matrix ({suppliers.length}/2 Selected)
              </h4>
              <p className="text-[10px] text-neutral-500">
                Direct head-to-head parameter evaluation • Optimal values highlighted
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-xs text-neutral-500 hover:text-black dark:hover:text-white"
            >
              Clear Comparison
            </Button>
          </div>
        </div>

        {/* Comparison Table / Grid */}
        <div className="mt-2 overflow-x-auto">
          <div className="min-w-[580px] rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black text-xs">
            <div className="grid grid-cols-12 border-b border-neutral-200 bg-neutral-50 p-3 font-semibold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
              <div className="col-span-4 text-[11px] uppercase tracking-wider text-neutral-400">
                Specification Metric
              </div>
              <div className="col-span-4 flex items-center justify-between pr-2">
                <div className="flex items-center space-x-1.5 truncate">
                  <Building2 className="h-3.5 w-3.5 text-black dark:text-white" />
                  <span className="truncate font-bold text-black dark:text-white">
                    {first.company_name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(first.listing_id)}
                  className="text-neutral-400 hover:text-black dark:hover:text-white"
                  aria-label={`Remove ${first.company_name} from comparison`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="col-span-4 flex items-center justify-between pr-2">
                {second ? (
                  <>
                    <div className="flex items-center space-x-1.5 truncate">
                      <Building2 className="h-3.5 w-3.5 text-black dark:text-white" />
                      <span className="truncate font-bold text-black dark:text-white">
                        {second.company_name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(second.listing_id)}
                      className="text-neutral-400 hover:text-black dark:hover:text-white"
                      aria-label={`Remove ${second.company_name} from comparison`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <span className="text-[11px] italic text-neutral-400">
                    Select a 2nd supplier to compare
                  </span>
                )}
              </div>
            </div>

            {/* Row 1: CO2 Purity */}
            <div className="grid grid-cols-12 items-center border-b border-neutral-100 p-2.5 dark:border-neutral-800">
              <div className="col-span-4 flex items-center space-x-1.5 text-neutral-600 dark:text-neutral-400">
                <Gauge className="h-3.5 w-3.5 text-black dark:text-white" />
                <span>Purity (%)</span>
              </div>
              <div className="col-span-4">
                <span
                  className={cn(
                    'inline-flex items-center space-x-1 rounded-md px-2 py-0.5 font-mono font-bold',
                    betterPurity === 1
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-black dark:text-white'
                  )}
                >
                  {betterPurity === 1 && <Check className="h-3 w-3 text-white dark:text-black" />}
                  <span>{formatNumber(first.purity_percentage, 2)}%</span>
                </span>
              </div>
              <div className="col-span-4">
                {second ? (
                  <span
                    className={cn(
                      'inline-flex items-center space-x-1 rounded-md px-2 py-0.5 font-mono font-bold',
                      betterPurity === 2
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-black dark:text-white'
                    )}
                  >
                    {betterPurity === 2 && <Check className="h-3 w-3 text-white dark:text-black" />}
                    <span>{formatNumber(second.purity_percentage, 2)}%</span>
                  </span>
                ) : (
                  <span className="text-neutral-300">--</span>
                )}
              </div>
            </div>

            {/* Row 2: Available Quantity */}
            <div className="grid grid-cols-12 items-center border-b border-neutral-100 p-2.5 dark:border-neutral-800">
              <div className="col-span-4 flex items-center space-x-1.5 text-neutral-600 dark:text-neutral-400">
                <Box className="h-3.5 w-3.5 text-black dark:text-white" />
                <span>Quantity</span>
              </div>
              <div className="col-span-4">
                <span
                  className={cn(
                    'inline-flex items-center space-x-1 rounded-md px-2 py-0.5 font-mono font-bold',
                    betterQuantity === 1
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-black dark:text-white'
                  )}
                >
                  {betterQuantity === 1 && <Check className="h-3 w-3 text-white dark:text-black" />}
                  <span>{formatNumber(first.volume_available_tons, 1)} Tons</span>
                </span>
              </div>
              <div className="col-span-4">
                {second ? (
                  <span
                    className={cn(
                      'inline-flex items-center space-x-1 rounded-md px-2 py-0.5 font-mono font-bold',
                      betterQuantity === 2
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-black dark:text-white'
                    )}
                  >
                    {betterQuantity === 2 && <Check className="h-3 w-3 text-white dark:text-black" />}
                    <span>{formatNumber(second.volume_available_tons, 1)} Tons</span>
                  </span>
                ) : (
                  <span className="text-neutral-300">--</span>
                )}
              </div>
            </div>

            {/* Row 3: Road Distance */}
            <div className="grid grid-cols-12 items-center border-b border-neutral-100 p-2.5 dark:border-neutral-800">
              <div className="col-span-4 flex items-center space-x-1.5 text-neutral-600 dark:text-neutral-400">
                <MapPin className="h-3.5 w-3.5 text-black dark:text-white" />
                <span>Transit Distance</span>
              </div>
              <div className="col-span-4">
                <span
                  className={cn(
                    'inline-flex items-center space-x-1 rounded-md px-2 py-0.5 font-mono font-bold',
                    betterDistance === 1
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-black dark:text-white'
                  )}
                >
                  {betterDistance === 1 && <Check className="h-3 w-3 text-white dark:text-black" />}
                  <span>{Math.round(first.distance_km)} km</span>
                </span>
              </div>
              <div className="col-span-4">
                {second ? (
                  <span
                    className={cn(
                      'inline-flex items-center space-x-1 rounded-md px-2 py-0.5 font-mono font-bold',
                      betterDistance === 2
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-black dark:text-white'
                    )}
                  >
                    {betterDistance === 2 && <Check className="h-3 w-3 text-white dark:text-black" />}
                    <span>{Math.round(second.distance_km)} km</span>
                  </span>
                ) : (
                  <span className="text-neutral-300">--</span>
                )}
              </div>
            </div>

            {/* Row 4: Base Price */}
            <div className="grid grid-cols-12 items-center border-b border-neutral-100 p-2.5 dark:border-neutral-800">
              <div className="col-span-4 flex items-center space-x-1.5 text-neutral-600 dark:text-neutral-400">
                <IndianRupee className="h-3.5 w-3.5 text-black dark:text-white" />
                <span>Base Price (Floor)</span>
              </div>
              <div className="col-span-4">
                <span
                  className={cn(
                    'inline-flex items-center space-x-1 rounded-md px-2 py-0.5 font-mono font-bold',
                    betterPrice === 1
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-black dark:text-white'
                  )}
                >
                  {betterPrice === 1 && <Check className="h-3 w-3 text-white dark:text-black" />}
                  <span>{formatINR(first.base_price_ton)} / t</span>
                </span>
              </div>
              <div className="col-span-4">
                {second ? (
                  <span
                    className={cn(
                      'inline-flex items-center space-x-1 rounded-md px-2 py-0.5 font-mono font-bold',
                      betterPrice === 2
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-black dark:text-white'
                    )}
                  >
                    {betterPrice === 2 && <Check className="h-3 w-3 text-white dark:text-black" />}
                    <span>{formatINR(second.base_price_ton)} / t</span>
                  </span>
                ) : (
                  <span className="text-neutral-300">--</span>
                )}
              </div>
            </div>

            {/* Row 5: Total Landed Cost */}
            <div className="grid grid-cols-12 items-center border-b border-neutral-100 p-2.5 dark:border-neutral-800">
              <div className="col-span-4 flex items-center space-x-1.5 text-neutral-600 dark:text-neutral-400">
                <Truck className="h-3.5 w-3.5 text-black dark:text-white" />
                <span>Final Landed Cost</span>
              </div>
              <div className="col-span-4">
                <span
                  className={cn(
                    'inline-flex items-center space-x-1 rounded-md px-2 py-0.5 font-mono font-extrabold',
                    betterLandedCost === 1
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-black dark:text-white'
                  )}
                >
                  {betterLandedCost === 1 && <Check className="h-3 w-3 text-white dark:text-black" />}
                  <span>{formatINR(first.total_landed_cost_ton)} / t</span>
                </span>
              </div>
              <div className="col-span-4">
                {second ? (
                  <span
                    className={cn(
                      'inline-flex items-center space-x-1 rounded-md px-2 py-0.5 font-mono font-extrabold',
                      betterLandedCost === 2
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-black dark:text-white'
                    )}
                  >
                    {betterLandedCost === 2 && <Check className="h-3 w-3 text-white dark:text-black" />}
                    <span>{formatINR(second.total_landed_cost_ton)} / t</span>
                  </span>
                ) : (
                  <span className="text-neutral-300">--</span>
                )}
              </div>
            </div>

            {/* Row 6: AI Match Score */}
            <div className="grid grid-cols-12 items-center p-2.5">
              <div className="col-span-4 flex items-center space-x-1.5 text-neutral-600 dark:text-neutral-400">
                <Sparkles className="h-3.5 w-3.5 text-black dark:text-white" />
                <span>AI Match Score</span>
              </div>
              <div className="col-span-4">
                <span
                  className={cn(
                    'inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-black',
                    betterAIMatch === 1
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'bg-neutral-100 text-black border border-neutral-200 dark:bg-neutral-900 dark:text-white'
                  )}
                >
                  {betterAIMatch === 1 && <Check className="h-3 w-3 text-white dark:text-black" />}
                  <span>{first.ai_match_score} / 100</span>
                </span>
              </div>
              <div className="col-span-4">
                {second ? (
                  <span
                    className={cn(
                      'inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-black',
                      betterAIMatch === 2
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'bg-neutral-100 text-black border border-neutral-200 dark:bg-neutral-900 dark:text-white'
                    )}
                  >
                    {betterAIMatch === 2 && <Check className="h-3 w-3 text-white dark:text-black" />}
                    <span>{second.ai_match_score} / 100</span>
                  </span>
                ) : (
                  <span className="text-neutral-300">--</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectSupplier(first.listing_id)}
            className="text-xs border-black text-black hover:bg-neutral-100 dark:border-white dark:text-white"
          >
            <span>View {first.company_name}</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>

          {second && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onSelectSupplier(second.listing_id)}
              className="text-xs shadow-sm"
            >
              <span>View {second.company_name}</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CompareDrawer;
