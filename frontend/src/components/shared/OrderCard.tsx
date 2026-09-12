import React from 'react';
import type { Order } from '@/types';
import { formatINR, formatNumber, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge, type BadgeProps } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  Building2,
  Factory,
  Box,
  IndianRupee,
  Clock,
  ArrowRight,
  Truck,
  ShieldCheck,
} from 'lucide-react';

export interface OrderCardProps {
  order: Order;
  onClick?: (order: Order) => void;
  className?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onClick,
  className,
}) => {
  const normalizedStatus = order.order_status?.toLowerCase();

  // Status mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { variant: 'primary' as BadgeProps['variant'], label: 'Confirmed' };
      case 'processing':
        return { variant: 'warning' as BadgeProps['variant'], label: 'Processing' };
      case 'in_transit':
        return { variant: 'secondary' as BadgeProps['variant'], label: 'In Transit' };
      case 'delivered':
      case 'completed':
        return { variant: 'success' as BadgeProps['variant'], label: 'Delivered' };
      default:
        return { variant: 'neutral' as BadgeProps['variant'], label: status };
    }
  };

  const statusInfo = getStatusBadge(normalizedStatus);

  // Approximate ETA & freight if needed
  const distanceKm = 145;
  const etaHours = Math.round(distanceKm / 45); // ~3 Hours
  const approxFreightPerTon = 850;
  const totalLandedCost = order.total_value + order.quantity_tons * approxFreightPerTon;

  return (
    <Card
      className={cn(
        'group overflow-hidden border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-card-hover',
        className
      )}
    >
      {/* Top Bar: Order Reference, Verification & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/80">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-mono text-xs font-black text-black dark:text-white">
                {order.order_reference}
              </span>
              <ShieldCheck className="h-3.5 w-3.5 text-black dark:text-white" />
            </div>
            <span className="text-[10px] text-neutral-400">
              Contracted: {new Date(order.confirmed_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        <Badge variant={statusInfo.variant} size="sm" dot>
          {statusInfo.label}
        </Badge>
      </div>

      {/* Counterparties: Supplier & Buyer */}
      <div className="mt-3.5 flex items-center justify-between rounded-lg bg-neutral-50 p-3 text-xs border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
        {/* Supplier */}
        <div className="flex items-center space-x-2 min-w-0">
          <Factory className="h-4 w-4 shrink-0 text-black dark:text-white" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-semibold text-neutral-500">Supplier</span>
            <p className="truncate font-bold text-black dark:text-white">
              {order.seller_company || 'Point-Source Emitter'}
            </p>
          </div>
        </div>

        <ArrowRight className="h-4 w-4 shrink-0 text-neutral-400 mx-2" />

        {/* Buyer */}
        <div className="flex items-center space-x-2 min-w-0 text-right justify-end">
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-semibold text-neutral-500">Buyer</span>
            <p className="truncate font-bold text-black dark:text-white">
              {order.buyer_company || 'Industrial Off-Taker'}
            </p>
          </div>
          <Building2 className="h-4 w-4 shrink-0 text-black dark:text-white" />
        </div>
      </div>

      {/* Metrics Grid: Quantity, Landed Cost, ETA */}
      <div className="mt-3.5 grid grid-cols-3 gap-2.5 rounded-xl border border-neutral-200 bg-white p-2.5 dark:border-neutral-800 dark:bg-black text-xs">
        {/* Quantity */}
        <div className="space-y-0.5">
          <span className="flex items-center gap-1 text-[10px] uppercase text-neutral-500 font-semibold">
            <Box className="h-3 w-3 text-black dark:text-white" />
            Quantity
          </span>
          <p className="font-mono text-xs font-bold text-black dark:text-white">
            {formatNumber(order.quantity_tons, 1)} t
          </p>
        </div>

        {/* Landed Cost */}
        <div className="space-y-0.5">
          <span className="flex items-center gap-1 text-[10px] uppercase text-neutral-500 font-semibold">
            <IndianRupee className="h-3 w-3 text-black dark:text-white" />
            Landed Cost
          </span>
          <p className="font-mono text-xs font-black text-black dark:text-white">
            {formatINR(totalLandedCost)}
          </p>
        </div>

        {/* ETA */}
        <div className="space-y-0.5">
          <span className="flex items-center gap-1 text-[10px] uppercase text-neutral-500 font-semibold">
            <Clock className="h-3 w-3 text-black dark:text-white" />
            Transit ETA
          </span>
          <p className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
            ~{etaHours}h road
          </p>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800 text-xs">
        <span className="text-[11px] text-neutral-500 flex items-center gap-1">
          <Truck className="h-3.5 w-3.5 text-neutral-400" />
          {order.delivery_window || 'Standard Logistics Dispatch Window'}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onClick?.(order)}
          className="gap-1 text-xs text-black hover:underline dark:text-white font-bold"
        >
          <span>View Order Timeline</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
};

export default OrderCard;
