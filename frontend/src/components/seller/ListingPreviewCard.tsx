import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatNumber } from '@/lib/utils';
import {
  Building2,
  MapPin,
  Gauge,
  Box,
  IndianRupee,
  Calendar,
  Sparkles,
  ShieldCheck,
  Eye,
  Layers,
  Clock,
} from 'lucide-react';

export interface ListingPreviewCardProps {
  companyName: string;
  location: string;
  purityPercentage: number;
  volumeMetricTons: number;
  reservePriceTon: number;
  physicalState: 'liquid' | 'pressurized_gas';
  availableFrom: string;
  availableUntil: string;
  description?: string;
  className?: string;
}

// Format INR currency without trailing decimals when whole, e.g. ₹5,04,000
const formatRevenueINR = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: Number.isInteger(val) ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(val);
};

// Calculate availability status based on current date
interface AvailabilityStatus {
  label: string;
  variant: 'primary' | 'secondary' | 'outline' | 'neutral';
}

const getAvailabilityStatus = (
  availableFromStr: string,
  availableUntilStr: string
): AvailabilityStatus => {
  if (!availableFromStr || !availableUntilStr) {
    return {
      label: 'Date Not Set',
      variant: 'outline',
    };
  }

  // Normalize to local midnight for accurate calendar date comparison
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [fromY, fromM, fromD] = availableFromStr.split('-').map(Number);
  const [untilY, untilM, untilD] = availableUntilStr.split('-').map(Number);

  const startDate = new Date(fromY, fromM - 1, fromD);
  const endDate = new Date(untilY, untilM - 1, untilD);

  // Past end date -> Expired (red)
  if (today > endDate) {
    return {
      label: 'Expired',
      variant: 'secondary',
    };
  }

  // Future start date -> Starts in X days (amber)
  if (today < startDate) {
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      label: `Starts in ${diffDays} day${diffDays === 1 ? '' : 's'}`,
      variant: 'outline',
    };
  }

  // Today within range -> Available Now (green)
  return {
    label: 'Available Now',
    variant: 'primary',
  };
};

export const ListingPreviewCard: React.FC<ListingPreviewCardProps> = ({
  companyName,
  location,
  purityPercentage,
  volumeMetricTons,
  reservePriceTon,
  physicalState,
  availableFrom,
  availableUntil,
  description,
  className,
}) => {
  const safeVolume = Number(volumeMetricTons) || 0;
  const safePrice = Number(reservePriceTon) || 0;
  const safePurity = Number(purityPercentage) || 0;

  // Formula: quantity × reserve_price
  const estimatedRevenue = safeVolume * safePrice;

  const availability = getAvailabilityStatus(availableFrom, availableUntil);

  const physicalStateLabel =
    physicalState === 'liquid' ? 'Cryogenic Liquid (LCO₂)' : 'Pressurized Gas (Pipeline)';

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          <Eye className="h-3.5 w-3.5 text-black dark:text-white" />
          <span>Marketplace Live Preview</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Availability Status Badge */}
          <Badge variant={availability.variant} size="sm" dot>
            {availability.label}
          </Badge>
          <Badge variant="outline" size="sm" dot>
            Draft
          </Badge>
        </div>
      </div>

      <Card className="overflow-hidden border-neutral-200 shadow-sm transition-all dark:border-neutral-800 dark:bg-black">
        {/* Top Header */}
        <CardHeader className="border-b border-neutral-200 bg-neutral-50 pb-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-black dark:text-white" />
                <CardTitle className="text-sm font-bold text-black dark:text-white">
                  {companyName || 'Your Enterprise Plant'}
                </CardTitle>
                <span title="Verified Point-Source Emitter Facility">
                  <ShieldCheck className="h-4 w-4 text-black dark:text-white" />
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                <MapPin className="h-3 w-3 text-neutral-400" />
                <span>{location || 'Location will appear from profile'}</span>
              </div>
            </div>

            <Badge variant="primary" size="sm">
              <Sparkles className="h-3 w-3" />
              <span>AI Ready</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Key Parameters 4-Grid */}
          <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
            {/* Purity */}
            <div className="space-y-0.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                <Gauge className="h-3 w-3 text-black dark:text-white" />
                Purity
              </span>
              <p className="font-mono text-sm font-bold text-black dark:text-white">
                {safePurity > 0 ? `${formatNumber(safePurity, 1)}%` : '--'}
              </p>
            </div>

            {/* Quantity */}
            <div className="space-y-0.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                <Box className="h-3 w-3 text-black dark:text-white" />
                Batch Quantity
              </span>
              <p className="font-mono text-sm font-bold text-black dark:text-white">
                {safeVolume > 0 ? `${formatNumber(safeVolume, 1)} t` : '--'}
              </p>
            </div>

            {/* Floor Price */}
            <div className="space-y-0.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                <IndianRupee className="h-3 w-3 text-black dark:text-white" />
                Reserve Floor
              </span>
              <p className="font-mono text-sm font-bold text-black dark:text-white">
                {safePrice > 0 ? `${formatRevenueINR(safePrice)}` : '--'}
                <span className="text-[10px] font-normal text-neutral-500">/t</span>
              </p>
            </div>

            {/* Physical Phase */}
            <div className="space-y-0.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                <Layers className="h-3 w-3 text-black dark:text-white" />
                Physical State
              </span>
              <p className="text-xs font-semibold capitalize text-black dark:text-white">
                {physicalState === 'liquid' ? 'Liquid (LCO₂)' : 'Gas (Compressed)'}
              </p>
            </div>
          </div>

          {/* Revenue Calculator Banner */}
          <div className="rounded-xl border border-black bg-black p-3.5 text-white dark:border-white dark:bg-white dark:text-black">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                  Estimated Revenue
                </span>
                <p className="text-base font-black">
                  {formatRevenueINR(estimatedRevenue)}
                </p>
              </div>
              <div className="text-right text-[11px]">
                <p className="font-bold">{formatNumber(safeVolume, 1)} Tons</p>
                <p className="text-[10px] opacity-80">
                  @ {formatRevenueINR(safePrice)} / ton
                </p>
              </div>
            </div>
          </div>

          {/* Availability Window & Status */}
          <div className="space-y-1.5 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                <span>Availability Window</span>
              </span>
              <Badge variant={availability.variant} size="sm" dot>
                {availability.label}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-black dark:text-white">
              <span>{availableFrom || 'Today'}</span>
              <Clock className="h-3 w-3 text-neutral-400" />
              <span>{availableUntil || 'Not set'}</span>
            </div>
          </div>

          {/* Description Preview */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Batch Specification Notes
            </span>
            <p className="rounded-lg border border-neutral-200 bg-white p-2.5 text-xs italic text-neutral-600 dark:border-neutral-800 dark:bg-black dark:text-neutral-400">
              {description || 'No batch description provided yet.'}
            </p>
          </div>
        </CardContent>

        <CardFooter className="border-t border-neutral-200 bg-neutral-50 py-3 text-[11px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
          <div className="flex items-center justify-between w-full">
            <span>Phase: {physicalStateLabel}</span>
            <span className="font-bold text-black dark:text-white">
              Auto-Matched by AI Engine
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ListingPreviewCard;
