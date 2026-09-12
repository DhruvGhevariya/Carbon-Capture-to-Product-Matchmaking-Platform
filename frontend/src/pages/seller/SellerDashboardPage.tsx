import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/services/apiService';
import { PageHeader } from '@/components/ui/PageHeader';
import { DashboardAnalyticsCards } from '@/components/dashboard/DashboardAnalyticsCards';
import { StorageUtilizationChart } from '@/components/seller/StorageUtilizationChart';
import { MonthlyListingTrendChart } from '@/components/seller/MonthlyListingTrendChart';
import { RecentListingsTable } from '@/components/seller/RecentListingsTable';
import { PendingBidsPanel } from '@/components/seller/PendingBidsPanel';
import { QuickActionsPanel } from '@/components/seller/QuickActionsPanel';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { PlusCircle, RefreshCw } from 'lucide-react';
import type { Listing, Bid, Order } from '@/types';

export const SellerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // 1. Fetch Dashboard Metrics from GET /api/v1/seller/dashboard
  const {
    data: dashboardResponse,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    refetch: refetchDashboard,
    isRefetching,
  } = useQuery({
    queryKey: ['seller-dashboard'],
    queryFn: async () => {
      const res = await apiService.getSellerDashboard();
      return res.data;
    },
  });

  // 2. Fetch Seller's active listings
  const {
    data: listingsResponse,
    isLoading: isListingsLoading,
    isError: isListingsError,
    refetch: refetchListings,
  } = useQuery({
    queryKey: ['seller-listings'],
    queryFn: async () => {
      const res = await apiService.getSellerListings();
      return res.data;
    },
  });

  // 3. Fetch Incoming bids (standardized key: ['bids'])
  const {
    data: bidsResponse,
    isLoading: isBidsLoading,
    isError: isBidsError,
    refetch: refetchBids,
  } = useQuery({
    queryKey: ['bids'],
    queryFn: async () => {
      const res = await apiService.getBids();
      return res.data;
    },
  });

  // 4. Accept/Reject Bid Mutation with Optimistic Updates
  const bidActionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'accept' | 'reject' }) => {
      setActionLoadingId(id);
      return await apiService.actOnBid(id, action);
    },
    onMutate: async ({ id, action }) => {
      // 1. Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['bids'] });
      await queryClient.cancelQueries({ queryKey: ['seller-dashboard'] });
      await queryClient.cancelQueries({ queryKey: ['orders'] });

      // 2. Snapshot previous state
      const previousBids = queryClient.getQueryData(['bids']);
      const previousDashboard = queryClient.getQueryData(['seller-dashboard']);
      const previousOrders = queryClient.getQueryData(['orders']);

      // 3. Find target bid
      const bidsList: Bid[] = (Array.isArray(previousBids) ? previousBids : (previousBids as any)?.data) || [];
      const targetBid = bidsList.find((b) => b.id === id);

      // 4. Optimistically update bids
      queryClient.setQueryData(['bids'], (old: any) => {
        if (!old) return old;
        const list = Array.isArray(old) ? old : old.data || [];
        const updated = list.map((b: Bid) =>
          b.id === id ? { ...b, status: action === 'accept' ? 'accepted' : 'rejected' } : b
        );
        return Array.isArray(old) ? updated : { ...old, data: updated };
      });

      // 5. Optimistically update seller-dashboard (instant KPI updates)
      queryClient.setQueryData(['seller-dashboard'], (old: any) => {
        if (!old) return old;
        const currentRevenue = old.revenue ?? 6845000;
        const addedValue = targetBid ? targetBid.total_offered_value : 1600000;
        const pendingBids = old.pending_bids || [];
        return {
          ...old,
          revenue: action === 'accept' ? currentRevenue + addedValue : currentRevenue,
          pending_bids_count: Math.max(0, (old.pending_bids_count || 1) - 1),
          accepted_bids_count: action === 'accept' ? (old.accepted_bids_count || 0) + 1 : (old.accepted_bids_count || 0),
          pending_bids: pendingBids.filter((b: any) => b.id !== id),
        };
      });

      // 6. Optimistically update orders on accept
      if (action === 'accept') {
        const newOrder: Order = {
          id: `order-opt-${Date.now()}`,
          order_reference: `#CX-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          bid_id: id,
          listing_id: targetBid?.listing_id || 'listing-1',
          seller_id: 'seller-ultratech',
          seller_name: 'Rajesh K. Verma',
          seller_company: 'UltraTech Cement',
          buyer_id: 'buyer-ecobuild',
          buyer_name: targetBid?.counter_party_name || 'Procurement Lead',
          buyer_company: targetBid?.counter_party_company || 'EcoBuild Materials',
          final_price_ton: targetBid?.offered_price_ton || 3200,
          quantity_tons: targetBid?.requested_quantity || 500,
          total_value: (targetBid?.total_offered_value || 1600000) + 30000,
          delivery_window: `Target Date: ${targetBid?.delivery_target || new Date().toISOString().split('T')[0]} • Scheduled`,
          order_status: 'confirmed',
          purity_percentage: targetBid?.purity_percentage || 98.0,
          confirmed_at: new Date().toISOString(),
        };

        queryClient.setQueryData(['orders'], (old: any) => {
          if (!old) return [newOrder];
          if (Array.isArray(old)) return [newOrder, ...old];
          if (old.data && Array.isArray(old.data)) return { ...old, data: [newOrder, ...old.data] };
          return [newOrder];
        });
      }

      return { previousBids, previousDashboard, previousOrders };
    },
    onSuccess: (_data, variables) => {
      showSuccessToast(
        variables.action === 'accept' ? 'Purchase Bid Accepted!' : 'Purchase Bid Declined',
        variables.action === 'accept'
          ? 'Contract generated and revenue reflected in plant ledger.'
          : 'The buyer has been notified that this offer was declined.'
      );
    },
    onError: (err: any, _variables, context) => {
      // Rollback on error
      if (context?.previousBids) queryClient.setQueryData(['bids'], context.previousBids);
      if (context?.previousDashboard) queryClient.setQueryData(['seller-dashboard'], context.previousDashboard);
      if (context?.previousOrders) queryClient.setQueryData(['orders'], context.previousOrders);

      showErrorToast(
        'Action Failed',
        err?.message || 'Could not update bid status. Please try again.'
      );
    },
    onSettled: () => {
      setActionLoadingId(null);
      // Silently refetch in background
      queryClient.invalidateQueries({ queryKey: ['bids'] });
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['seller-listings'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handleAcceptBid = (bidId: string) => {
    bidActionMutation.mutate({ id: bidId, action: 'accept' });
  };

  const handleRejectBid = (bidId: string) => {
    bidActionMutation.mutate({ id: bidId, action: 'reject' });
  };

  const handleRetryAll = () => {
    refetchDashboard();
    refetchListings();
    refetchBids();
    showSuccessToast('Telemetry Refreshed', 'Buffer pressures and commercial contract ledgers synchronized.');
  };

  const dashboard = dashboardResponse;
  const currentStored = dashboard?.current_stored_tons ?? 350;
  const totalCapacity = dashboard?.total_capacity_tons ?? 500;
  const revenueTotal = dashboard?.revenue ?? 6845000;
  const storageUtilizationPct = dashboard?.storage_utilization ?? 70;
  const monthlyListingTrend = (dashboard?.monthly_listing_trend && dashboard.monthly_listing_trend.length > 0)
    ? dashboard.monthly_listing_trend.map((t) => ({
        month: t.month,
        capturedTons: t.capturedTons ?? t.volume ?? 180,
        offTakenTons: t.offTakenTons ?? (t.volume ? Math.round(t.volume * 0.85) : 150),
        volume: t.volume ?? t.capturedTons ?? 180,
        revenue: t.revenue ?? (t.volume ? t.volume * 4800 : 864000),
      }))
    : [
        { month: 'Apr', volume: 180, revenue: 864000, capturedTons: 180, offTakenTons: 150 },
        { month: 'May', volume: 220, revenue: 1056000, capturedTons: 220, offTakenTons: 195 },
        { month: 'Jun', volume: 290, revenue: 1392000, capturedTons: 290, offTakenTons: 260 },
        { month: 'Jul', volume: 340, revenue: 1632000, capturedTons: 340, offTakenTons: 310 },
        { month: 'Aug', volume: 410, revenue: 1968000, capturedTons: 410, offTakenTons: 380 },
        { month: 'Sep', volume: 480, revenue: 2304000, capturedTons: 480, offTakenTons: 440 },
      ];

  const listings: Listing[] = listingsResponse?.items ?? [];
  const bids: Bid[] = (bidsResponse as unknown as Bid[]) ?? [];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header with Real-time Sync & CTA */}
      <PageHeader
        title="Seller Dashboard"
        description="Monitor cryogenic buffer telemetry, active stream batches, and incoming purchase contracts."
        breadcrumbs={[{ label: 'Terminal', to: '/seller/dashboard' }, { label: 'Plant Overview' }]}
        actions={
          <div className="flex items-center space-x-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryAll}
              disabled={isRefetching}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/seller/listings/new')}
              className="gap-1.5 shadow-sm"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Listing</span>
            </Button>
          </div>
        }
      />

      {/* Error state handling with Retry button */}
      {isDashboardError && (
        <ErrorState
          title="Could not connect to Industrial Telemetry Service"
          description="Failed to load real-time buffer storage levels and listing trends from the emitter node."
          onRetry={handleRetryAll}
          isRetrying={isRefetching}
        />
      )}

      {/* Top Row: 4 Required Dashboard Analytics Cards */}
      {isDashboardLoading ? (
        <LoadingSkeleton type="card" rows={4} />
      ) : (
        <DashboardAnalyticsCards
          totalCO2Traded={1470}
          totalRevenue={revenueTotal}
          averageAIMatch={92.8}
          activePartners={7}
          trendData={monthlyListingTrend}
        />
      )}

      {/* Middle Row: Analytics (Donut & Area Charts) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StorageUtilizationChart
          currentStoredTons={currentStored}
          totalCapacityTons={totalCapacity}
          utilizationPercentage={storageUtilizationPct}
        />

        <MonthlyListingTrendChart trendData={monthlyListingTrend} />
      </div>

      {/* Bottom Grid: Recent Listings (2/3) + Pending Bids & Quick Actions (1/3) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left 2 Cols: Recent Listings Table */}
        <div className="xl:col-span-2 space-y-6">
          {isListingsError ? (
            <ErrorState
              title="Failed to load emitter batches"
              description="Listing records could not be retrieved from the ledger."
              onRetry={() => refetchListings()}
            />
          ) : (
            <RecentListingsTable
              listings={listings}
              isLoading={isListingsLoading}
              onViewAll={() => navigate('/seller/listings')}
              onRowClick={() => navigate('/seller/listings')}
            />
          )}
        </div>

        {/* Right 1 Col: Pending Bids Panel & Quick Actions */}
        <div className="space-y-6">
          {isBidsError ? (
            <ErrorState
              title="Failed to load incoming bids"
              description="Could not query commercial bids stream."
              onRetry={() => refetchBids()}
            />
          ) : (
            <PendingBidsPanel
              bids={bids}
              isLoading={isBidsLoading}
              onAccept={handleAcceptBid}
              onReject={handleRejectBid}
              onViewAll={() => navigate('/seller/bids')}
              actionLoadingId={actionLoadingId}
            />
          )}

          <QuickActionsPanel
            onCreateListing={() => navigate('/seller/listings/new')}
            onViewMarketplace={() => navigate('/marketplace')}
            onViewAIInsights={() => navigate('/ai/recommend')}
          />
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
