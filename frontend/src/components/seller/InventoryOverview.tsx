import React from 'react';
import { KPIStatCard } from '@/components/ui/KPIStatCard';
import { formatINR, formatNumber } from '@/lib/utils';
import { Layers, Database, SlidersHorizontal, IndianRupee } from 'lucide-react';

export interface InventoryOverviewProps {
  activeListings: number;
  currentStoredTons: number;
  pendingBids: number;
  revenue: number;
  isLoading?: boolean;
}

export const InventoryOverview: React.FC<InventoryOverviewProps> = ({
  activeListings,
  currentStoredTons,
  pendingBids,
  revenue,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* 1. Active Listings */}
      <KPIStatCard
        title="Active CCUS Batches"
        value={activeListings}
        icon={Layers}
        trend="+14% this month"
        trendDirection="up"
        color="emerald"
      />

      {/* 2. CO2 Stored Inventory */}
      <KPIStatCard
        title="Buffer Storage (Tons)"
        value={`${formatNumber(currentStoredTons, 1)} t`}
        icon={Database}
        trend="72% Capacity"
        trendDirection="neutral"
        color="blue"
      />

      {/* 3. Pending Purchase Bids */}
      <KPIStatCard
        title="Pending Purchase Bids"
        value={pendingBids}
        icon={SlidersHorizontal}
        trend={pendingBids > 0 ? 'Requires Action' : 'All Cleared'}
        trendDirection={pendingBids > 0 ? 'up' : 'neutral'}
        color="amber"
      />

      {/* 4. Realized Revenue */}
      <KPIStatCard
        title="Contract Revenue Realized"
        value={formatINR(revenue)}
        icon={IndianRupee}
        trend="+18.5% YoY"
        trendDirection="up"
        color="purple"
      />
    </div>
  );
};
