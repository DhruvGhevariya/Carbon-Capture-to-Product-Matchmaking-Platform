import React from 'react';
import { SupplierCard } from '@/components/ui/SupplierCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Layers } from 'lucide-react';
import type { MarketplaceCard } from '@/types';
import { cn } from '@/lib/utils';

export interface SupplierGridProps {
  suppliers: MarketplaceCard[];
  isLoading: boolean;
  onViewDetails: (listingId: string) => void;
  onClearFilters?: () => void;
  className?: string;
  selectedCompareIds?: string[];
  onToggleCompare?: (id: string) => void;
}

export const SupplierGrid: React.FC<SupplierGridProps> = ({
  suppliers,
  isLoading,
  onViewDetails,
  onClearFilters,
  className,
  selectedCompareIds = [],
  onToggleCompare,
}) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <LoadingSkeleton type="card" rows={6} />
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <EmptyState
        title="No CO₂ streams match your criteria"
        description="Try relaxing your minimum purity floor, expanding maximum logistics distance, or adjusting your price ceiling."
        icon={Layers}
        action={
          onClearFilters
            ? {
                label: 'Reset Filters',
                onClick: onClearFilters,
              }
            : undefined
        }
        className={className}
      />
    );
  }

  const isMaxCompareReached = selectedCompareIds.length >= 2;

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3',
        className
      )}
    >
      {suppliers.map((supplier) => {
        const isSelected = selectedCompareIds.includes(supplier.listing_id);
        return (
          <SupplierCard
            key={supplier.listing_id}
            id={supplier.listing_id}
            companyName={supplier.company_name}
            industry={supplier.industry_type}
            purityPercentage={supplier.purity_percentage}
            availableTons={supplier.volume_available_tons}
            distanceKm={supplier.distance_km}
            reservePriceTon={supplier.base_price_ton}
            aiMatchScore={supplier.ai_match_score}
            isVerified={true}
            location={supplier.location}
            onViewDetails={onViewDetails}
            isSelectedForCompare={isSelected}
            onToggleCompare={onToggleCompare}
            disableCompare={isMaxCompareReached && !isSelected}
          />
        );
      })}
    </div>
  );
};

export default SupplierGrid;
