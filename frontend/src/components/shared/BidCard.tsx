import React from 'react';
import type { Bid } from '@/types';
import { formatINR, formatNumber, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BidStatusBadge } from './BidStatusBadge';
import {
  Building2,
  Factory,
  Box,
  IndianRupee,
  Sparkles,
  Calendar,
  Check,
  X,
  ArrowRight,
} from 'lucide-react';

export interface BidCardProps {
  bid: Bid;
  isSeller: boolean;
  onAccept?: (bid: Bid) => void;
  onReject?: (bid: Bid) => void;
  isActing?: boolean;
  className?: string;
}

export const BidCard: React.FC<BidCardProps> = ({
  bid,
  isSeller,
  onAccept,
  onReject,
  isActing = false,
  className,
}) => {
  const matchScore = bid.ai_match_score ?? 90;
  const isPending = bid.status?.toLowerCase() === 'pending';

  // Format creation date
  const formattedDate = bid.created_at
    ? new Date(bid.created_at).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <Card
      className={cn(
        'overflow-hidden border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-card-hover',
        className
      )}
    >
      {/* Top Bar: Companies, AI Match, Status */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-sm">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span>{bid.counter_party_company || 'Off-Taker Enterprise'}</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-semibold">
              <Factory className="h-3.5 w-3.5 text-emerald-600" />
              <span>CarbonX Stream Hub</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <span>Contact: {bid.counter_party_name || 'Procurement Lead'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* AI Match Badge */}
          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-xs font-bold text-emerald-800 shadow-xs">
            <Sparkles className="h-3 w-3 text-emerald-600" />
            <span>{matchScore}% Fit</span>
          </span>

          {/* Status Badge */}
          <BidStatusBadge status={bid.status} size="sm" />
        </div>
      </div>

      {/* Metrics 3-Grid */}
      <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs">
        {/* Quantity */}
        <div className="space-y-0.5">
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-500">
            <Box className="h-3 w-3 text-blue-600" />
            Off-Take Volume
          </span>
          <p className="font-mono text-sm font-bold text-slate-900">
            {formatNumber(bid.requested_quantity, 1)} Tons
          </p>
        </div>

        {/* Offered Price */}
        <div className="space-y-0.5">
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-500">
            <IndianRupee className="h-3 w-3 text-emerald-600" />
            Offered Floor
          </span>
          <p className="font-mono text-sm font-bold text-slate-900">
            {formatINR(bid.offered_price_ton)}
            <span className="text-[10px] font-normal text-slate-500">/t</span>
          </p>
        </div>

        {/* Total Value */}
        <div className="space-y-0.5">
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-500">
            <IndianRupee className="h-3 w-3 text-teal-600" />
            Contract Value
          </span>
          <p className="font-mono text-sm font-black text-emerald-950">
            {formatINR(bid.total_offered_value)}
          </p>
        </div>
      </div>

      {/* Target Delivery Window */}
      {bid.delivery_target && (
        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Target Dispatch Window:</span>
          <span className="font-bold text-black dark:text-white">
            {new Date(bid.delivery_target).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      )}

      {/* Seller Action Buttons for Pending Bids */}
      {isSeller && isPending && (
        <div className="mt-4 flex items-center justify-end space-x-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isActing}
            onClick={() => onReject?.(bid)}
            className="border-neutral-300 text-black hover:border-black dark:border-neutral-700 dark:text-white text-xs"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            <span>Decline</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={isActing}
            onClick={() => onAccept?.(bid)}
            className="gap-1 shadow-sm text-xs"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Accept Offer</span>
          </Button>
        </div>
      )}
    </Card>
  );
};

export default BidCard;
