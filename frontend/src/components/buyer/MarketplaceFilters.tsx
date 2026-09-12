import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  SlidersHorizontal,
  RotateCcw,
  Search,
  Gauge,
  Box,
  MapPin,
  IndianRupee,
  Layers,
  ArrowDownUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MarketplaceFilterState {
  search: string;
  minPurity: number | '';
  quantity: number | '';
  maxDistance: number | '';
  minPrice: number | '';
  maxPrice: number | '';
  physicalState: 'all' | 'liquid' | 'pressurized_gas';
  sortBy: 'ai_score' | 'distance_asc' | 'price_asc' | 'purity_desc';
}

export interface MarketplaceFiltersProps {
  filters: MarketplaceFilterState;
  onChange: (updated: Partial<MarketplaceFilterState>) => void;
  onReset: () => void;
  totalCount?: number;
  className?: string;
}

export const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalCount,
  className,
}) => {
  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.minPurity !== '') count++;
    if (filters.quantity !== '') count++;
    if (filters.maxDistance !== '') count++;
    if (filters.minPrice !== '' || filters.maxPrice !== '') count++;
    if (filters.physicalState !== 'all') count++;
    if (filters.sortBy !== 'ai_score') count++;
    return count;
  };

  const activeCount = getActiveFilterCount();

  return (
    <Card className={cn('overflow-hidden border-neutral-200 shadow-sm dark:border-neutral-800', className)}>
      <CardHeader className="border-b border-neutral-200 bg-neutral-50 pb-3.5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-4 w-4 text-black dark:text-white" />
            <CardTitle className="text-sm font-bold text-black dark:text-white">
              Filter Catalog
            </CardTitle>
            {activeCount > 0 && (
              <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-black">
                {activeCount} active
              </span>
            )}
          </div>
          {totalCount !== undefined && (
            <span className="text-[11px] font-medium text-neutral-500">
              {totalCount} streams
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4 text-xs">
        {/* Search Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="filter-search"
            className="flex items-center space-x-1.5 text-xs font-semibold text-black dark:text-white"
          >
            <Search className="h-3.5 w-3.5 text-neutral-400" />
            <span>Search Facility / Location</span>
          </label>
          <Input
            id="filter-search"
            type="text"
            placeholder="e.g. Dahej, Cement, Steel..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full text-xs"
          />
        </div>

        {/* Sort By */}
        <div className="space-y-1.5">
          <label
            htmlFor="filter-sort"
            className="flex items-center space-x-1.5 text-xs font-semibold text-black dark:text-white"
          >
            <ArrowDownUp className="h-3.5 w-3.5 text-neutral-400" />
            <span>Sort Streams By</span>
          </label>
          <Select
            id="filter-sort"
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as any })}
            options={[
              { value: 'ai_score', label: 'AI Match Score (Recommended)' },
              { value: 'distance_asc', label: 'Closest Distance (Fastest ETA)' },
              { value: 'price_asc', label: 'Lowest Landed Price' },
              { value: 'purity_desc', label: 'Highest Purity First' },
            ]}
          />
        </div>

        {/* Minimum CO2 Purity */}
        <div className="space-y-1.5 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-1.5 font-semibold text-black dark:text-white">
              <Gauge className="h-3.5 w-3.5 text-black dark:text-white" />
              <span>Min. Purity Floor</span>
            </label>
            <span className="font-mono font-bold text-black dark:text-white">
              {filters.minPurity !== '' ? `${filters.minPurity}%` : 'Any'}
            </span>
          </div>
          <input
            type="range"
            min="70"
            max="99.9"
            step="0.5"
            value={filters.minPurity !== '' ? filters.minPurity : 70}
            onChange={(e) => onChange({ minPurity: parseFloat(e.target.value) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-black dark:bg-neutral-700 dark:accent-white"
          />
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>70% (Min)</span>
            <span>90%</span>
            <span>95%</span>
            <span>99.9%</span>
          </div>
        </div>

        {/* Required Quantity */}
        <div className="space-y-1.5">
          <label
            htmlFor="filter-quantity"
            className="flex items-center space-x-1.5 font-semibold text-black dark:text-white"
          >
            <Box className="h-3.5 w-3.5 text-black dark:text-white" />
            <span>Demand Quantity (Tons)</span>
          </label>
          <Input
            id="filter-quantity"
            type="number"
            min="1"
            placeholder="e.g. 250"
            value={filters.quantity}
            onChange={(e) =>
              onChange({ quantity: e.target.value === '' ? '' : parseFloat(e.target.value) })
            }
          />
        </div>

        {/* Maximum Logistics Distance */}
        <div className="space-y-1.5 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-1.5 font-semibold text-black dark:text-white">
              <MapPin className="h-3.5 w-3.5 text-black dark:text-white" />
              <span>Max Road Distance</span>
            </label>
            <span className="font-mono font-bold text-black dark:text-white">
              {filters.maxDistance !== '' ? `${filters.maxDistance} km` : 'No Limit'}
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="2500"
            step="50"
            value={filters.maxDistance !== '' ? filters.maxDistance : 2500}
            onChange={(e) => onChange({ maxDistance: parseInt(e.target.value, 10) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-black dark:bg-neutral-700 dark:accent-white"
          />
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>50 km</span>
            <span>500 km</span>
            <span>1,500 km</span>
            <span>2,500 km</span>
          </div>
        </div>

        {/* Price Range (₹ / Ton) */}
        <div className="space-y-1.5">
          <label className="flex items-center space-x-1.5 font-semibold text-black dark:text-white">
            <IndianRupee className="h-3.5 w-3.5 text-black dark:text-white" />
            <span>Price Range (₹ / Ton)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min ₹"
              value={filters.minPrice}
              onChange={(e) =>
                onChange({ minPrice: e.target.value === '' ? '' : parseFloat(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="Max ₹"
              value={filters.maxPrice}
              onChange={(e) =>
                onChange({ maxPrice: e.target.value === '' ? '' : parseFloat(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Physical State Filter */}
        <div className="space-y-1.5">
          <label className="flex items-center space-x-1.5 font-semibold text-black dark:text-white">
            <Layers className="h-3.5 w-3.5 text-black dark:text-white" />
            <span>Physical Phase</span>
          </label>
          <div className="grid grid-cols-3 gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-700 dark:bg-neutral-800">
            {[
              { id: 'all', label: 'All' },
              { id: 'liquid', label: 'Liquid' },
              { id: 'pressurized_gas', label: 'Gas' },
            ].map((stateOption) => {
              const isSelected = filters.physicalState === stateOption.id;
              return (
                <button
                  key={stateOption.id}
                  type="button"
                  onClick={() => onChange({ physicalState: stateOption.id as any })}
                  className={cn(
                    'rounded-md py-1 text-[11px] font-bold transition-all',
                    isSelected
                      ? 'bg-black text-white shadow-sm dark:bg-white dark:text-black'
                      : 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'
                  )}
                >
                  {stateOption.label}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-neutral-100 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/20">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={activeCount === 0}
          className="w-full text-xs border-neutral-300 text-black hover:border-black dark:border-neutral-700 dark:text-white"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          <span>Reset All Filters</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MarketplaceFilters;
