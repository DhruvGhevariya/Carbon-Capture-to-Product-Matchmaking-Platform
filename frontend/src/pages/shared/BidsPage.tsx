import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import apiService from '@/services/apiService';
import { PageHeader } from '@/components/ui/PageHeader';
import { BidCard } from '@/components/shared/BidCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { formatINR, formatNumber } from '@/lib/utils';
import type { Bid } from '@/types';
import {
  SlidersHorizontal,
  RefreshCw,
  AlertTriangle,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  PlusCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type BidTab = 'pending' | 'accepted' | 'rejected';

export const BidsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { role } = useAuth();
  const navigate = useNavigate();
  const isSeller = role === 'seller';

  const [activeTab, setActiveTab] = useState<BidTab>('pending');
  const [confirmDialog, setConfirmDialog] = useState<{
    bid: Bid;
    action: 'accept' | 'reject';
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);

  // 1. Fetch Bids
  const {
    data: bidsResponse,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['bids'],
    queryFn: async () => {
      const res = await apiService.getBids();
      return res.data;
    },
  });

  const allBids: Bid[] = bidsResponse || [];

  // Categorize bids into tabs
  const pendingBids = allBids.filter((b) => b.status?.toLowerCase() === 'pending');
  const acceptedBids = allBids.filter((b) => b.status?.toLowerCase() === 'accepted');
  const rejectedBids = allBids.filter(
    (b) => b.status?.toLowerCase() === 'rejected' || b.status?.toLowerCase() === 'expired'
  );

  const displayedBids =
    activeTab === 'pending'
      ? pendingBids
      : activeTab === 'accepted'
      ? acceptedBids
      : rejectedBids;

  // 2. Accept / Reject Mutation with Optimistic Updates
  const bidActionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'accept' | 'reject' }) => {
      return await apiService.actOnBid(id, action);
    },
    onMutate: async ({ id, action }) => {
      // 1. Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['bids'] });
      await queryClient.cancelQueries({ queryKey: ['seller-dashboard'] });
      await queryClient.cancelQueries({ queryKey: ['orders'] });

      // 2. Snapshot previous states
      const previousBids = queryClient.getQueryData(['bids']);
      const previousDashboard = queryClient.getQueryData(['seller-dashboard']);
      const previousOrders = queryClient.getQueryData(['orders']);

      // 3. Find target bid
      const bidsList: Bid[] = (Array.isArray(previousBids) ? previousBids : (previousBids as any)?.data) || [];
      const targetBid = bidsList.find((b) => b.id === id);

      // 4. Optimistically update bids list immediately
      queryClient.setQueryData(['bids'], (old: any) => {
        if (!old) return old;
        const list = Array.isArray(old) ? old : old.data || [];
        const updated = list.map((b: Bid) =>
          b.id === id ? { ...b, status: action === 'accept' ? 'accepted' : 'rejected' } : b
        );
        return Array.isArray(old) ? updated : { ...old, data: updated };
      });

      // 5. Optimistically update seller-dashboard
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
        const newOrder = {
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

      // Close modal dialog immediately for instant UI feedback
      setConfirmDialog(null);

      return { previousBids, previousDashboard, previousOrders };
    },
    onSuccess: (_data, variables) => {
      setToastMessage({
        type: 'success',
        title: variables.action === 'accept' ? 'Purchase Bid Accepted!' : 'Purchase Bid Declined',
        description:
          variables.action === 'accept'
            ? 'Commercial order generated successfully and inventory has been allocated.'
            : 'The off-taker has been notified that this offer was declined.',
      });
    },
    onError: (err: any, _variables, context) => {
      // Rollback on error
      if (context?.previousBids) queryClient.setQueryData(['bids'], context.previousBids);
      if (context?.previousDashboard) queryClient.setQueryData(['seller-dashboard'], context.previousDashboard);
      if (context?.previousOrders) queryClient.setQueryData(['orders'], context.previousOrders);

      setToastMessage({
        type: 'error',
        title: 'Action Failed',
        description: err?.message || 'Could not update bid status.',
      });
    },
    onSettled: () => {
      // Silently sync with server in background
      queryClient.invalidateQueries({ queryKey: ['bids'] });
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handleOpenConfirm = (bid: Bid, action: 'accept' | 'reject') => {
    setConfirmDialog({ bid, action });
  };

  const handleExecuteAction = () => {
    if (!confirmDialog) return;
    bidActionMutation.mutate({
      id: confirmDialog.bid.id,
      action: confirmDialog.action,
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="alert"
          className="fixed bottom-6 right-6 z-50 flex max-w-md items-start space-x-3 rounded-xl border border-black bg-white p-4 shadow-floating backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-5 text-black"
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-black" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-black" />
          )}
          <div className="flex-1 space-y-0.5">
            <h4 className="text-xs font-bold text-black">{toastMessage.title}</h4>
            <p className="text-[11px] text-neutral-600">
              {toastMessage.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="rounded p-1 text-neutral-400 hover:text-black"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-neutral-300 bg-white p-6 shadow-floating">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-black">
                  {confirmDialog.action === 'accept'
                    ? 'Accept Purchase Bid?'
                    : 'Decline Purchase Bid?'}
                </h3>
                <p className="text-[11px] text-neutral-500">
                  {confirmDialog.action === 'accept'
                    ? 'Accepting generates an enforceable commercial contract.'
                    : 'Declining will notify the buyer and release the negotiation.'}
                </p>
              </div>
            </div>

            {/* Offer Recap */}
            <div className="mt-4 space-y-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Off-Taker:</span>
                <span className="font-semibold text-black flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-neutral-700" />
                  {confirmDialog.bid.counter_party_company || 'Enterprise Off-Taker'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Volume:</span>
                <span className="font-mono font-bold text-black">
                  {formatNumber(confirmDialog.bid.requested_quantity, 1)} Tons
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Offered Price:</span>
                <span className="font-mono font-bold text-black">
                  {formatINR(confirmDialog.bid.offered_price_ton)} / t
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-neutral-200">
                <span className="font-semibold text-black">
                  Contract Total:
                </span>
                <span className="font-mono font-extrabold text-black">
                  {formatINR(confirmDialog.bid.total_offered_value)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={bidActionMutation.isPending}
                onClick={() => setConfirmDialog(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={bidActionMutation.isPending}
                onClick={handleExecuteAction}
                className={
                  confirmDialog.action === 'reject'
                    ? 'border border-black bg-white hover:bg-neutral-100 text-black'
                    : 'bg-black text-white hover:bg-neutral-800'
                }
              >
                {confirmDialog.action === 'accept' ? 'Confirm & Execute' : 'Decline Offer'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Commercial Bids & Negotiations"
        description={
          isSeller
            ? 'Review and manage binding purchase offers submitted by industrial CO₂ off-takers.'
            : 'Track the status of your submitted purchase offers and contract negotiations.'
        }
        breadcrumbs={[
          { label: isSeller ? 'Plant Dashboard' : 'Marketplace', to: isSeller ? '/seller/dashboard' : '/marketplace' },
          { label: 'Bids' },
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
            {!isSeller && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/marketplace')}
                className="gap-1.5"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Explore Streams</span>
              </Button>
            )}
          </div>
        }
      />

      {/* Section Filter Tabs: Pending | Accepted | Rejected */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 pb-2">
        {[
          { id: 'pending' as BidTab, label: 'Pending Offers', count: pendingBids.length },
          { id: 'accepted' as BidTab, label: 'Accepted & Contracted', count: acceptedBids.length },
          { id: 'rejected' as BidTab, label: 'Declined / Expired', count: rejectedBids.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
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

      {/* Bids List */}
      {isError ? (
        <ErrorState
          title="Failed to load commercial bids"
          description="Could not query the purchase bid contract ledger. Please retry."
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <LoadingSkeleton type="card" rows={4} />
        </div>
      ) : displayedBids.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} bids found`}
          description={
            activeTab === 'pending'
              ? 'There are currently no purchase offers awaiting review.'
              : `You have no ${activeTab} bids recorded in this ledger.`
          }
          icon={SlidersHorizontal}
          action={
            !isSeller
              ? {
                  label: 'Browse Streams Marketplace',
                  onClick: () => navigate('/marketplace'),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {displayedBids.map((bid) => (
            <BidCard
              key={bid.id}
              bid={bid}
              isSeller={isSeller}
              onAccept={(b) => handleOpenConfirm(b, 'accept')}
              onReject={(b) => handleOpenConfirm(b, 'reject')}
              isActing={bidActionMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BidsPage;
