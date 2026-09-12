import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/apiService';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatINR, formatNumber } from '@/lib/utils';
import type { Listing } from '@/types';
import {
  Package,
  PlusCircle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

export const SellerListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const {
    data: listingsResponse,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['seller-listings'],
    queryFn: async () => {
      const res = await apiService.getSellerListings();
      return res.data;
    },
  });

  const listings: Listing[] = listingsResponse?.items ?? [];

  const filteredListings = listings.filter((l) => {
    if (filterStatus === 'all') return true;
    return l.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Storage Inventory & Batch Ledger"
        description="Manage active point-source CO₂ production batches, physical cryo-storage, and reserve prices."
        breadcrumbs={[
          { label: 'Plant Dashboard', to: '/seller/dashboard' },
          { label: 'Inventory' },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/seller/listings/new')}
              className="gap-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Batch</span>
            </Button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 pb-2">
        {[
          { id: 'all', label: 'All Batches', count: listings.length },
          { id: 'available', label: 'Available', count: listings.filter((l) => l.status === 'available').length },
          { id: 'reserved', label: 'Contracted', count: listings.filter((l) => l.status === 'reserved').length },
        ].map((tab) => {
          const isActive = filterStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.2 text-[10px] ${
                  isActive ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-800'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isError ? (
        <ErrorState
          title="Failed to load storage inventory"
          description="Could not query batch telemetry from the plant storage ledger. Please retry."
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <LoadingSkeleton type="card" rows={4} />
        </div>
      ) : filteredListings.length === 0 ? (
        <EmptyState
          title="No batches found"
          description="No production batches match this status. Create a new listing to broadcast available volume."
          icon={Package}
          action={{
            label: 'Create Batch Listing',
            onClick: () => navigate('/seller/listings/new'),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="border-neutral-300">
              <CardContent className="space-y-3.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400">BATCH #{listing.id.slice(-6).toUpperCase()}</span>
                    <h4 className="text-base font-bold text-black">{formatNumber(listing.volume_metric_tons)} Tons</h4>
                  </div>
                  <Badge variant="primary" size="sm">
                    {listing.purity_percentage}% Purity
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500">Physical State:</span>
                    <span className="font-medium capitalize text-black">
                      {listing.physical_state === 'liquid' ? 'Cryogenic Liquid (LCO₂)' : 'Pressurized Gas'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500">Reserve Price:</span>
                    <span className="font-mono font-bold text-black">{formatINR(listing.reserve_price_ton)} / t</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500">Estimated Value:</span>
                    <span className="font-mono font-bold text-black">
                      {formatINR(listing.volume_metric_tons * listing.reserve_price_ton)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-500">Available Until:</span>
                    <span className="text-neutral-800">{listing.available_until || 'Rolling Contract'}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">Status: {listing.status}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/marketplace/${listing.id}`)}
                    className="gap-1 text-[11px]"
                  >
                    <span>View in Market</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerListingsPage;
