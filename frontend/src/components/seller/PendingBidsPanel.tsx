import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatINR, formatNumber } from '@/lib/utils';
import type { Bid } from '@/types';
import { SlidersHorizontal, Sparkles, Building2, Check, X } from 'lucide-react';

export interface PendingBidsPanelProps {
  bids: Bid[];
  isLoading?: boolean;
  onAccept?: (bidId: string) => void;
  onReject?: (bidId: string) => void;
  onViewAll?: () => void;
  actionLoadingId?: string | null;
}

export const PendingBidsPanel: React.FC<PendingBidsPanelProps> = ({
  bids,
  isLoading = false,
  onAccept,
  onReject,
  onViewAll,
  actionLoadingId,
}) => {
  const [confirmBid, setConfirmBid] = useState<Bid | null>(null);
  const pendingList = bids.filter((b) => b.status === 'pending');

  return (
    <>
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-4 w-4 text-black dark:text-white" />
              <CardTitle>Pending Purchase Bids</CardTitle>
              <span className="rounded-full bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-xs font-bold text-black dark:bg-neutral-900 dark:border-neutral-800 dark:text-white">
                {pendingList.length}
              </span>
            </div>
            {onViewAll && (
              <button
                type="button"
                onClick={onViewAll}
                className="text-xs font-bold text-black hover:underline dark:text-white"
              >
                All Bids →
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {isLoading ? (
            <LoadingSkeleton rows={3} />
          ) : pendingList.length === 0 ? (
            <EmptyState
              title="No incoming bids pending"
              description="Active buyers will submit purchase offers based on your listed price and purity."
              className="border-0 py-6"
            />
          ) : (
            <div className="space-y-3">
              {pendingList.slice(0, 3).map((bid) => {
                const isActing = actionLoadingId === bid.id;
                const matchScore = bid.ai_match_score ?? 88;

                return (
                  <div
                    key={bid.id}
                    className="rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:border-black dark:border-neutral-800 dark:bg-black"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <Building2 className="h-3.5 w-3.5 text-black dark:text-white" />
                          <h4 className="text-xs font-bold text-black dark:text-white">
                            {bid.counter_party_company || 'Off-Taker Enterprise'}
                          </h4>
                        </div>
                        <p className="text-[11px] text-neutral-500">
                          Contact: {bid.counter_party_name || 'Procurement Lead'}
                        </p>
                      </div>

                      <span className="inline-flex items-center space-x-1 rounded-full bg-black px-2.5 py-0.5 text-xs font-bold text-white shadow-sm dark:bg-white dark:text-black">
                        <Sparkles className="h-3 w-3" />
                        <span>{matchScore}% Fit</span>
                      </span>
                    </div>

                    {/* Commercial terms */}
                    <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-2.5 dark:border-neutral-800 dark:bg-neutral-900 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-neutral-500">Requested Volume</span>
                        <p className="tabular-nums font-bold text-black dark:text-white">
                          {formatNumber(bid.requested_quantity, 1)} Tons
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-neutral-500">Offered Price</span>
                        <p className="tabular-nums font-bold text-black dark:text-white">
                          {formatINR(bid.offered_price_ton)}
                          <span className="text-[10px] font-normal text-neutral-500">/t</span>
                        </p>
                      </div>
                    </div>

                    {/* Total Value & Action Buttons */}
                    <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                      <div>
                        <span className="text-[10px] text-neutral-400">Contract Total:</span>
                        <p className="tabular-nums text-xs font-black text-black dark:text-white">
                          {formatINR(bid.total_offered_value)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isActing}
                          onClick={() => onReject?.(bid.id)}
                          className="border-neutral-300 text-black hover:border-black text-xs"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Decline</span>
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          disabled={isActing}
                          isLoading={isActing}
                          onClick={() => setConfirmBid(bid)}
                          className="text-xs"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Accept Offer</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog before accepting bid */}
      {confirmBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-floating dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Accept this purchase bid?
            </h3>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Accepting will generate a legally binding commercial order and allocate inventory.
            </p>

            <div className="mt-4 space-y-2 rounded-xl border border-neutral-100 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/60 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Buyer:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {confirmBid.counter_party_company || confirmBid.counter_party_name || 'Off-Taker Enterprise'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Quantity:</span>
                <span className="tabular-nums font-semibold text-neutral-900 dark:text-white">
                  {formatNumber(confirmBid.requested_quantity, 1)} Tons
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Offered Price:</span>
                <span className="tabular-nums font-bold text-primary-700 dark:text-primary-400">
                  {formatINR(confirmBid.offered_price_ton)} / ton
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmBid(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const bidId = confirmBid.id;
                  setConfirmBid(null);
                  onAccept?.(bidId);
                }}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
