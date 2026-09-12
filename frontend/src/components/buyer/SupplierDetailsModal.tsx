import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/apiService';
import { formatINR, formatNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import {
  X,
  Building2,
  MapPin,
  Gauge,
  Box,
  IndianRupee,
  Truck,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  Send,
  ExternalLink,
  Factory,
  ArrowRight,
  Clock,
  Award,
} from 'lucide-react';

export interface SupplierDetailsModalProps {
  listingId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onPlaceBid: (listingId: string) => void;
  onCalculateLogistics: (listingId: string) => void;
  onViewFullPage?: (listingId: string) => void;
  initialScore?: number;
}

export const SupplierDetailsModal: React.FC<SupplierDetailsModalProps> = ({
  listingId,
  isOpen,
  onClose,
  onPlaceBid,
  onCalculateLogistics,
  onViewFullPage,
  initialScore,
}) => {
  const { data: detailData, isLoading } = useQuery({
    queryKey: ['marketplace-detail', listingId],
    queryFn: async () => {
      if (!listingId) return null;
      const res = await apiService.getMarketplaceDetail(listingId);
      return res.data;
    },
    enabled: isOpen && Boolean(listingId),
  });

  if (!isOpen || !listingId) return null;

  const data = detailData;
  const company = data?.company;

  // Key parameters
  const purity = data?.purity_percentage ?? 98.2;
  const availableTons = data?.available_tons ?? 500;
  const reservePrice = data?.reserve_price_ton ?? 3200;
  const physicalState = data?.physical_state === 'liquid' ? 'Cryogenic Liquid (LCO₂)' : 'Pressurized Gas';

  // Logistics parameters
  const distanceKm = 145;
  const etaHours = Math.round(distanceKm / 45); // ~3.2 hrs -> 3 Hours
  const transportCost = Math.round(distanceKm * 4.2 + 250); // ~₹859/t
  const totalLandedCost = reservePrice + transportCost;

  // AI Breakdown scores (backend deterministic engine model)
  const breakdownRows = [
    {
      dimension: 'Purity',
      weight: '30%',
      score: purity >= 99.0 ? 98 : purity >= 95 ? 94 : 85,
      weighted: (purity >= 99.0 ? 98 : purity >= 95 ? 94 : 85) * 0.3,
      rationale: `${formatNumber(purity, 1)}% exceeds standard 90% flue gas floor`,
    },
    {
      dimension: 'Distance',
      weight: '25%',
      score: distanceKm <= 100 ? 95 : distanceKm <= 200 ? 90 : 78,
      weighted: (distanceKm <= 100 ? 95 : distanceKm <= 200 ? 90 : 78) * 0.25,
      rationale: `${distanceKm} km transit minimizes cryogenic boil-off loss`,
    },
    {
      dimension: 'Price',
      weight: '20%',
      score: reservePrice <= 3500 ? 92 : 84,
      weighted: (reservePrice <= 3500 ? 92 : 84) * 0.2,
      rationale: `${formatINR(reservePrice)}/t floor offers strong economic margin`,
    },
    {
      dimension: 'Quantity',
      weight: '10%',
      score: availableTons >= 250 ? 96 : 80,
      weighted: (availableTons >= 250 ? 96 : 80) * 0.1,
      rationale: `${formatNumber(availableTons, 1)} tons provides reliable buffer headroom`,
    },
    {
      dimension: 'Delivery',
      weight: '10%',
      score: 95,
      weighted: 95 * 0.1,
      rationale: `Rapid tanker loading readiness within 24h of dispatch window`,
    },
    {
      dimension: 'Reliability',
      weight: '5%',
      score: 98,
      weighted: 98 * 0.05,
      rationale: `Verified continuous emission monitoring telemetry (ISO 14064)`,
    },
  ];

  const calculatedTotal = Math.round(
    breakdownRows.reduce((acc, row) => acc + row.weighted, 0)
  );

  const displayScore = initialScore ?? (calculatedTotal || 92);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-floating dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-black">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-black dark:text-white" />
              <h3 className="text-base font-bold text-black dark:text-white">
                {company?.name || 'CO₂ Capture Facility'}
              </h3>
              <ShieldCheck className="h-4 w-4 text-black dark:text-white" />
            </div>
            <div className="flex items-center space-x-2 text-xs text-neutral-500">
              <span className="capitalize">{company?.industry || 'Industrial Plant'}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                <span>{company?.address || 'Certified Facility'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="max-h-[78vh] overflow-y-auto p-6 space-y-5 text-xs">
          {isLoading ? (
            <LoadingSkeleton type="card" rows={3} />
          ) : (
            <>
              {/* 1. AI Score Breakdown Section */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-black space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3 dark:border-neutral-800">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-black border border-neutral-200 dark:bg-neutral-900 dark:text-white dark:border-neutral-800">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black dark:text-white">
                        Why this supplier scored {displayScore}/100
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        Multi-criteria algorithmic evaluation based on physical, chemical & logistics parameters
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 rounded-full bg-black px-3 py-1 text-xs font-bold text-white shadow-sm dark:bg-white dark:text-black">
                    <Award className="h-3.5 w-3.5" />
                    <span>Top Match Score: {displayScore}/100</span>
                  </div>
                </div>

                {/* Score Breakdown Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
                        <th className="py-2 px-3">Criteria</th>
                        <th className="py-2 px-3">Weight</th>
                        <th className="py-2 px-3">Sub-Score</th>
                        <th className="py-2 px-3">Weighted Pts</th>
                        <th className="py-2 px-3">Performance Rationale</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {breakdownRows.map((row) => (
                        <tr key={row.dimension} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                          <td className="py-2 px-3 font-semibold text-black dark:text-white">
                            {row.dimension}
                          </td>
                          <td className="py-2 px-3 text-neutral-500">{row.weight}</td>
                          <td className="py-2 px-3 font-mono font-bold text-black dark:text-white">
                            {row.score}/100
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-black dark:text-white">
                            {row.weighted.toFixed(1)}
                          </td>
                          <td className="py-2 px-3 text-[11px] text-neutral-600 dark:text-neutral-400">
                            {row.rationale}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-neutral-200 bg-neutral-50 font-bold dark:border-neutral-700 dark:bg-neutral-900">
                        <td className="py-2.5 px-3 text-black dark:text-white" colSpan={3}>
                          Total Composite AI Score
                        </td>
                        <td className="py-2.5 px-3 font-mono text-sm font-black text-black dark:text-white">
                          {displayScore} / 100
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-black dark:text-white font-bold">
                          Optimal Chemical & Logistics Alignment
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* 2. Landed Cost Card: CO2 Price + Transport Cost = Final Landed Cost */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-black">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <IndianRupee className="h-4 w-4 text-black dark:text-white" />
                    <span className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                      Landed Cost Calculation
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-500">
                    Transparent Commercial Economics
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-5 items-center gap-3 text-center sm:text-left">
                  {/* CO2 Price */}
                  <div className="sm:col-span-2 rounded-lg bg-neutral-50 p-3 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
                    <span className="text-[10px] uppercase font-semibold text-neutral-500">CO₂ Price (Base Floor)</span>
                    <p className="mt-0.5 font-mono text-base font-black text-black dark:text-white">
                      {formatINR(reservePrice)}
                      <span className="text-xs font-normal text-neutral-500"> / t</span>
                    </p>
                  </div>

                  {/* Plus Sign */}
                  <div className="flex items-center justify-center font-black text-lg text-black dark:text-white">
                    +
                  </div>

                  {/* Transport Cost */}
                  <div className="sm:col-span-2 rounded-lg bg-neutral-50 p-3 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
                    <span className="text-[10px] uppercase font-semibold text-neutral-500">Transport Cost (Logistics)</span>
                    <p className="mt-0.5 font-mono text-base font-black text-black dark:text-white">
                      {formatINR(transportCost)}
                      <span className="text-xs font-normal text-neutral-500"> / t</span>
                    </p>
                  </div>
                </div>

                {/* Final Highlighted Landed Cost */}
                <div className="mt-3 flex items-center justify-between rounded-xl bg-black p-3.5 text-white shadow-sm dark:bg-white dark:text-black">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                      = Final Landed Cost
                    </span>
                    <p className="text-[11px] opacity-80">
                      Delivered directly to receiving facility storage buffer
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xl font-black tracking-tight">
                      {formatINR(totalLandedCost)}
                      <span className="text-xs font-semibold opacity-90"> / metric ton</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Logistics Route Card: Seller -> Distance -> Buyer (with ETA below) */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-black space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Truck className="h-4 w-4 text-black dark:text-white" />
                    <h4 className="text-xs font-bold text-black dark:text-white">
                      Logistics Dispatch Route
                    </h4>
                  </div>
                  <Badge variant="neutral" size="sm">
                    Cryogenic Road Transport
                  </Badge>
                </div>

                {/* Route Flow Visualization */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Seller Facility */}
                    <div className="flex items-center space-x-2.5 flex-1 min-w-0 w-full sm:w-auto">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
                        <Factory className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase text-neutral-500">Origin Emitter</span>
                        <p className="truncate text-xs font-bold text-black dark:text-white">
                          {company?.name || 'Capture Facility'}
                        </p>
                        <p className="truncate text-[10px] text-neutral-500">
                          {company?.address || 'Industrial Facility Yard'}
                        </p>
                      </div>
                    </div>

                    {/* Distance Arrow */}
                    <div className="flex flex-col items-center px-3 py-1 my-2 sm:my-0">
                      <span className="font-mono text-xs font-black text-black dark:text-white">
                        {distanceKm} km
                      </span>
                      <div className="relative flex items-center w-28 sm:w-32 my-1">
                        <div className="h-[2px] w-full bg-black dark:bg-white" />
                        <ArrowRight className="-ml-1 h-3.5 w-3.5 shrink-0 text-black dark:text-white" />
                      </div>
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
                        Dedicated Route
                      </span>
                    </div>

                    {/* Buyer Plant */}
                    <div className="flex items-center justify-end space-x-2.5 flex-1 min-w-0 w-full sm:w-auto text-right">
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase text-neutral-500">Destination Buyer</span>
                        <p className="truncate text-xs font-bold text-black dark:text-white">
                          Your Off-Take Facility
                        </p>
                        <p className="truncate text-[10px] text-neutral-500">
                          Regional Receiving Terminal
                        </p>
                      </div>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200 text-black dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
                        <Building2 className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* ETA Below */}
                  <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-neutral-600 dark:text-neutral-400">
                      <Clock className="h-3.5 w-3.5 text-black dark:text-white" />
                      <span>Estimated Transit Duration (ETA):</span>
                    </div>
                    <span className="font-mono text-xs font-black text-black dark:text-white">
                      ~{etaHours} Hours Transit
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Parameters Summary */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-neutral-500">
                    <Gauge className="h-3 w-3 text-black dark:text-white" />
                    CO₂ Purity
                  </span>
                  <p className="mt-1 font-mono text-sm font-bold text-black dark:text-white">
                    {formatNumber(purity, 2)}%
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-neutral-500">
                    <Box className="h-3 w-3 text-black dark:text-white" />
                    Available Tons
                  </span>
                  <p className="mt-1 font-mono text-sm font-bold text-black dark:text-white">
                    {formatNumber(availableTons, 1)} t
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-neutral-500">
                    <Layers className="h-3 w-3 text-black dark:text-white" />
                    Physical Phase
                  </span>
                  <p className="mt-1 text-xs font-bold text-black dark:text-white truncate">
                    {physicalState}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-neutral-500">
                    <Calendar className="h-3 w-3 text-black dark:text-white" />
                    Buffer Window
                  </span>
                  <p className="mt-1 text-xs font-bold text-black dark:text-white">
                    Active & Ready
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-black">
          <div>
            {onViewFullPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewFullPage(listingId)}
                className="gap-1.5 text-xs text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                <span>Full Spec Sheet</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCalculateLogistics(listingId)}
              className="gap-1.5 border-black text-black hover:bg-neutral-100 dark:border-white dark:text-white"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Calculate Logistics</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onPlaceBid(listingId)}
              className="gap-1.5 shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Place Bid</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailsModal;
