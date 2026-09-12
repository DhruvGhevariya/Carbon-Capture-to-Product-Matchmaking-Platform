import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/services/apiService';
import type { Bid } from '@/types';
import { formatINR, formatNumber } from '@/lib/utils';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import {
  Building2,
  Gauge,
  Box,
  IndianRupee,
  Truck,
  Sparkles,
  ShieldCheck,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
} from 'lucide-react';

export const SupplierDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [requestedVolume, setRequestedVolume] = useState<number>(100);
  const [offeredPrice, setOfferedPrice] = useState<number>(3200);
  const [deliveryTarget, setDeliveryTarget] = useState<string>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);

  // Fetch listing and company details
  const { data: detailData, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['marketplace-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('Listing ID required');
      const res = await apiService.getMarketplaceDetail(id);
      return res.data;
    },
    enabled: Boolean(id),
  });

  // Bid submission mutation with optimistic updates
  const placeBidMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Missing listing id');
      return await apiService.createBid({
        listing_id: id,
        offered_price_ton: offeredPrice,
        requested_quantity: requestedVolume,
        delivery_target: deliveryTarget,
      });
    },
    onMutate: async () => {
      // 1. Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['bids'] });
      await queryClient.cancelQueries({ queryKey: ['seller-dashboard'] });

      // 2. Snapshot previous bids
      const previousBids = queryClient.getQueryData(['bids']);
      const previousDashboard = queryClient.getQueryData(['seller-dashboard']);

      const optimisticBid: Bid = {
        id: `bid-opt-${Date.now()}`,
        listing_id: id || 'listing-1',
        purity_percentage: detailData?.purity_percentage || 98.0,
        counter_party_name: detailData?.company?.company_name || 'UltraTech Cement',
        counter_party_company: detailData?.company?.company_name || 'UltraTech Cement',
        offered_price_ton: offeredPrice,
        requested_quantity: requestedVolume,
        total_offered_value: offeredPrice * requestedVolume,
        delivery_target: deliveryTarget,
        status: 'pending',
        ai_match_score: detailData?.ai_score || 94,
        created_at: new Date().toISOString(),
      };

      // 3. Optimistically append new bid to bids list
      queryClient.setQueryData(['bids'], (old: any) => {
        if (!old) return [optimisticBid];
        if (Array.isArray(old)) return [optimisticBid, ...old];
        if (old.data && Array.isArray(old.data)) return { ...old, data: [optimisticBid, ...old.data] };
        return [optimisticBid];
      });

      // 4. Optimistically update seller-dashboard pending bids count
      queryClient.setQueryData(['seller-dashboard'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pending_bids_count: (old.pending_bids_count || 0) + 1,
          pending_bids: [optimisticBid, ...(old.pending_bids || [])],
        };
      });

      return { previousBids, previousDashboard };
    },
    onSuccess: () => {
      setToastMessage({
        type: 'success',
        title: 'Commercial Bid Submitted!',
        description: `Your bid of ${formatINR(offeredPrice)}/t for ${requestedVolume} tons has been transmitted to the emitter.`,
      });
    },
    onError: (err: any, _variables, context) => {
      // Rollback on error
      if (context?.previousBids) queryClient.setQueryData(['bids'], context.previousBids);
      if (context?.previousDashboard) queryClient.setQueryData(['seller-dashboard'], context.previousDashboard);

      setToastMessage({
        type: 'error',
        title: 'Bid Submission Failed',
        description: err?.message || 'Unable to register bid on the network.',
      });
    },
    onSettled: () => {
      // Silently sync with server in background
      queryClient.invalidateQueries({ queryKey: ['bids'] });
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard'] });
    },
  });

  const handlePlaceBid = () => {
    placeBidMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" rows={6} />
      </div>
    );
  }

  if (error || !detailData) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/marketplace')} className="gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Marketplace</span>
        </Button>
        <ErrorState
          title="CO₂ Stream Batch Unavailable"
          description="The requested point-source listing could not be retrieved from the catalog. Please retry or choose another verified supplier."
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
      </div>
    );
  }

  const company = detailData.company;
  const purity = detailData.purity_percentage ?? 95.0;
  const availableTons = detailData.available_tons ?? 500;
  const reservePrice = detailData.reserve_price_ton ?? 3200;
  const physicalState = detailData.physical_state === 'liquid' ? 'Cryogenic Liquid (LCO₂)' : 'Pressurized Gas';

  // Logistics calculations
  const distanceKm = 145;
  const etaHours = Math.round(distanceKm / 45);
  const transportCost = Math.round(distanceKm * 4.2 + 250);
  const totalLandedCost = reservePrice + transportCost;
  const totalContractOffer = requestedVolume * offeredPrice;

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

      {/* Page Header */}
      <PageHeader
        title={company?.name || 'Verified CO₂ Stream Supplier'}
        description={`Point-source capture batch specifications for ${company?.name || 'Industrial Facility'} (${company?.industry || 'Enterprise'}).`}
        breadcrumbs={[
          { label: 'Carbon Marketplace', to: '/marketplace' },
          { label: 'Supplier Details' },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/marketplace')}
              className="gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Marketplace</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => document.getElementById('commercial-bid-card')?.scrollIntoView({ behavior: 'smooth' })}
              className="gap-1.5 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Place Bid</span>
            </Button>
          </div>
        }
      />

      {/* Top AI Match & Quality Banner */}
      <div className="rounded-2xl border border-black bg-black text-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  AI Recommendation Score: 96 / 100
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-black">
                  Optimal Fit
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-300">
                Purity exceeds off-take requirements with low moisture content and minimum cryogenic transit degradation.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/logistics')}
              className="gap-1.5 text-xs border-white text-white hover:bg-white hover:text-black"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Calculate Logistics</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Spec Sheet (7 Cols), Right Commercial / Bid Panel (5 Cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Technical Specifications */}
        <div className="lg:col-span-7 space-y-6">
          {/* Technical Specs Card */}
          <Card className="border-neutral-300">
            <CardHeader className="border-b border-neutral-100 pb-3">
              <div className="flex items-center space-x-2">
                <Gauge className="h-4 w-4 text-black" />
                <CardTitle>Chemical & Technical Parameters</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5">
                  <span className="text-[10px] font-semibold uppercase text-neutral-500">CO₂ Purity</span>
                  <p className="mt-1 font-mono text-base font-bold text-black">
                    {formatNumber(purity, 2)}%
                  </p>
                  <span className="text-[10px] text-neutral-600 font-medium">ISBT Standard</span>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5">
                  <span className="text-[10px] font-semibold uppercase text-neutral-500">Physical Phase</span>
                  <p className="mt-1 text-sm font-bold text-black">
                    {physicalState}
                  </p>
                  <span className="text-[10px] text-neutral-400">Cryogenic Tanker</span>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5">
                  <span className="text-[10px] font-semibold uppercase text-neutral-500">Capture Source</span>
                  <p className="mt-1 text-sm font-bold text-black">
                    {company?.industry || 'Industrial Flue'}
                  </p>
                  <span className="text-[10px] text-neutral-400">Point-Source Scrubbed</span>
                </div>
              </div>

              {/* Plant Location & Facility Terms */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-neutral-500" />
                    Facility Address & Dispatch Yard
                  </span>
                  <span className="flex items-center text-[10px] font-semibold text-black gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Facility
                  </span>
                </div>
                <p className="text-xs text-neutral-600">
                  {company?.address || 'Industrial CCUS Corridor, Western Hub'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Freight & Landed Cost Breakdown Card */}
          <Card className="border-neutral-300">
            <CardHeader className="border-b border-neutral-100 pb-3">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-black" />
                <CardTitle>Logistics & Route Economics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3">
                  <span className="text-[10px] uppercase text-neutral-500">Haul Distance</span>
                  <p className="font-mono text-sm font-bold text-black">{distanceKm} km</p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3">
                  <span className="text-[10px] uppercase text-neutral-500">Estimated Transit</span>
                  <p className="font-mono text-sm font-bold text-black">~{etaHours} Hours</p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3">
                  <span className="text-[10px] uppercase text-neutral-500">Freight Quote</span>
                  <p className="font-mono text-sm font-bold text-black">{formatINR(transportCost)}/t</p>
                </div>
                <div className="rounded-xl border border-black bg-neutral-100 p-3">
                  <span className="text-[10px] uppercase text-black font-semibold">Total Landed</span>
                  <p className="font-mono text-sm font-bold text-black">{formatINR(totalLandedCost)}/t</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-neutral-400" />
                  <span className="text-neutral-600">
                    Dispatch Buffer Window: {detailData.available_from} → {detailData.available_until}
                  </span>
                </div>
                <Badge variant="primary" size="sm" dot>
                  Active Stream
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Interactive Commercial Bid Terminal */}
        <div className="lg:col-span-5 space-y-6">
          <Card id="commercial-bid-card" className="border-black shadow-md">
            <CardHeader className="border-b border-neutral-200 bg-neutral-50 pb-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="h-4 w-4 text-black" />
                  <CardTitle className="text-sm font-bold">Commercial Bid Desk</CardTitle>
                </div>
                <Badge variant="primary" size="sm">
                  Live Terminal
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase">Available Inventory</span>
                  <p className="font-mono text-sm font-bold text-black">
                    {formatNumber(availableTons, 1)} Tons
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 uppercase">Emitter Floor</span>
                  <p className="font-mono text-sm font-bold text-black">
                    {formatINR(reservePrice)} / t
                  </p>
                </div>
              </div>

              {/* Input: Requested Quantity */}
              <div className="space-y-1.5">
                <label className="font-semibold text-black">
                  Off-Take Quantity (Tons)
                </label>
                <Input
                  type="number"
                  min="1"
                  max={availableTons}
                  value={requestedVolume}
                  onChange={(e) => setRequestedVolume(Number(e.target.value) || 0)}
                  leftIcon={<Box className="h-4 w-4 text-neutral-400" />}
                />
              </div>

              {/* Input: Bid Price Per Ton */}
              <div className="space-y-1.5">
                <label className="font-semibold text-black">
                  Offered Price (₹ / Ton)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(Number(e.target.value) || 0)}
                  leftIcon={<IndianRupee className="h-4 w-4 text-neutral-400" />}
                />
              </div>

              {/* Input: Delivery Target Date */}
              <div className="space-y-1.5">
                <label className="font-semibold text-black">
                  Requested Delivery Window
                </label>
                <Input
                  type="date"
                  value={deliveryTarget}
                  onChange={(e) => setDeliveryTarget(e.target.value)}
                  leftIcon={<Calendar className="h-4 w-4 text-neutral-400" />}
                />
              </div>

              {/* Total Contract Valuation */}
              <div className="rounded-xl border border-black bg-black text-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Total Purchase Valuation
                    </span>
                    <p className="text-lg font-black text-white">
                      {formatINR(totalContractOffer)}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-neutral-300">
                    <p className="font-semibold">{requestedVolume} Tons</p>
                    <p className="text-[10px] text-neutral-400">@ {formatINR(offeredPrice)}/t</p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/20">
              <Button
                variant="primary"
                size="md"
                onClick={handlePlaceBid}
                isLoading={placeBidMutation.isPending}
                className="w-full justify-center shadow-sm"
              >
                <Send className="mr-1.5 h-4 w-4" />
                <span>Transmit Commercial Offer</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailsPage;
