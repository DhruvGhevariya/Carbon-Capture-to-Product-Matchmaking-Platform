import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatINR, formatNumber, cn } from '@/lib/utils';
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  Receipt,
  Layers,
} from 'lucide-react';

export interface OrderSummaryProps {
  quantityTons: number;
  basePriceTon: number;
  freightCostTon?: number;
  distanceKm?: number;
  etaHours?: number;
  currency?: string;
  className?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  quantityTons,
  basePriceTon,
  freightCostTon = 850,
  distanceKm = 145,
  etaHours = 3,
  className,
}) => {
  const safeQty = Number(quantityTons) || 0;
  const safePrice = Number(basePriceTon) || 0;
  const safeFreightPerTon = Number(freightCostTon) || 0;

  // 1. CO2 Value
  const co2Value = safeQty * safePrice;

  // 2. Freight Total
  const freightTotal = safeQty * safeFreightPerTon;

  // 3. Total Landed Cost
  const totalLandedCost = co2Value + freightTotal;
  const landedCostPerTon = safePrice + safeFreightPerTon;

  return (
    <Card className={cn('border-neutral-200 shadow-sm dark:border-neutral-800', className)}>
      <CardHeader className="border-b border-neutral-200 bg-neutral-50 pb-3.5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Receipt className="h-4 w-4 text-black dark:text-white" />
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
              Commercial Order Summary
            </CardTitle>
          </div>
          <span className="flex items-center text-[10px] font-bold text-black dark:text-white gap-1">
            <ShieldCheck className="h-3 w-3" />
            <span>Escrow Locked</span>
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4 text-xs">
        {/* Breakdown Items */}
        <div className="space-y-2.5">
          {/* CO2 Value */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 font-medium">
                <Layers className="h-3.5 w-3.5 text-black dark:text-white" />
                CO₂ Value ({formatNumber(safeQty, 1)} t @ {formatINR(safePrice)}/t)
              </span>
            </div>
            <span className="font-mono font-semibold text-black dark:text-white">
              {formatINR(co2Value)}
            </span>
          </div>

          {/* Freight */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 font-medium">
                <Truck className="h-3.5 w-3.5 text-black dark:text-white" />
                Logistics & Freight ({formatINR(safeFreightPerTon)}/t)
              </span>
            </div>
            <span className="font-mono font-semibold text-black dark:text-white">
              {formatINR(freightTotal)}
            </span>
          </div>

          {/* Route Parameters: Distance & ETA */}
          <div className="flex items-center justify-between pt-1 border-t border-dashed border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-neutral-400" />
              Distance: <strong className="text-black dark:text-white">{distanceKm} km</strong>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-neutral-400" />
              Transit ETA: <strong className="text-black dark:text-white">~{etaHours} Hours</strong>
            </span>
          </div>
        </div>

        {/* Highlighted Total Landed Cost Banner */}
        <div className="rounded-xl border border-black bg-black p-3.5 text-white dark:border-white dark:bg-white dark:text-black">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                Total Landed Cost
              </span>
              <p className="font-mono text-base font-black">
                {formatINR(totalLandedCost)}
              </p>
            </div>
            <div className="text-right text-[11px]">
              <p className="font-bold">{formatINR(landedCostPerTon)} / t</p>
              <p className="text-[10px] opacity-80">Landed Floor</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
