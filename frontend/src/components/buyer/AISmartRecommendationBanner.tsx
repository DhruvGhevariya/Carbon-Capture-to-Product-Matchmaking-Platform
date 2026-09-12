import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatINR, formatNumber, cn } from '@/lib/utils';
import {
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Gauge,
  IndianRupee,
  CheckCircle2,
} from 'lucide-react';

export interface DimensionBreakdown {
  purity_score: number;
  distance_score: number;
  price_score: number;
  quantity_score: number;
  delivery_score: number;
  reliability_score: number;
}

export interface SupplierRecommendation {
  listing_id: string;
  supplier_name: string;
  industry_type: string;
  location: string;
  match_score: number;
  confidence_score: number;
  compatibility_tier: string;
  purity_percentage: number;
  distance_km: number;
  total_landed_cost_ton: number;
  dimension_breakdown?: DimensionBreakdown;
  explanation: string;
}

export interface AISmartRecommendationBannerProps {
  recommendation?: SupplierRecommendation | null;
  isLoading?: boolean;
  onViewDetails: (listingId: string) => void;
  className?: string;
}

export const AISmartRecommendationBanner: React.FC<AISmartRecommendationBannerProps> = ({
  recommendation,
  isLoading = false,
  onViewDetails,
  className,
}) => {
  if (isLoading) {
    return (
      <Card className={cn('animate-pulse border-primary-200 bg-white p-6 dark:border-primary-800 dark:bg-neutral-900', className)}>
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-6 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800/60" />
          <div className="h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800/60" />
          <div className="h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800/60" />
          <div className="h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800/60" />
        </div>
      </Card>
    );
  }

  if (!recommendation) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-blue-50/60 p-6 shadow-sm',
        className
      )}
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                AI Match Engine • #1 Recommended Supplier
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                Optimal Choice
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Evaluated against real-time plant demand specs & transport distance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" size="md">
            Confidence: {formatNumber(recommendation.confidence_score, 1)}%
          </Badge>
          <div className="flex items-center space-x-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
            <Award className="h-3.5 w-3.5" />
            <span>{recommendation.match_score}/100 Match Score</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Left 7 Cols: Supplier Identity & Natural Language Explanation */}
        <div className="lg:col-span-7 space-y-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-black text-slate-900">
                {recommendation.supplier_name}
              </h3>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-xs text-slate-500">• {recommendation.industry_type}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>{recommendation.location}</span>
            </div>
          </div>

          {/* Why Recommended Callout */}
          <div className="rounded-xl border border-emerald-200/70 bg-white/90 p-3.5 shadow-xs">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                  Why AI Recommended This Stream:
                </span>
                <p className="text-xs leading-relaxed text-slate-700">
                  {recommendation.explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Dimension score chips if available */}
          {recommendation.dimension_breakdown && (
            <div className="flex flex-wrap gap-2 text-[10px] text-slate-700">
              <span className="rounded bg-white/80 px-2 py-0.5 border border-emerald-200/80 font-medium">
                Purity Match: {Math.round(recommendation.dimension_breakdown.purity_score)}%
              </span>
              <span className="rounded bg-white/80 px-2 py-0.5 border border-blue-200/80 font-medium">
                Logistics Score: {Math.round(recommendation.dimension_breakdown.distance_score)}%
              </span>
              <span className="rounded bg-white/80 px-2 py-0.5 border border-amber-200/80 font-medium">
                Price Fit: {Math.round(recommendation.dimension_breakdown.price_score)}%
              </span>
              <span className="rounded bg-white/80 px-2 py-0.5 border border-purple-200/80 font-medium">
                Reliability: {Math.round(recommendation.dimension_breakdown.reliability_score)}%
              </span>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Key Specifications & CTA */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Purity */}
            <div className="rounded-lg bg-emerald-50/70 border border-emerald-100 p-2">
              <span className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase text-slate-500">
                <Gauge className="h-3 w-3 text-emerald-600" />
                Purity
              </span>
              <p className="font-mono text-sm font-bold text-emerald-950">
                {formatNumber(recommendation.purity_percentage, 1)}%
              </p>
            </div>

            {/* Distance */}
            <div className="rounded-lg bg-blue-50/70 border border-blue-100 p-2">
              <span className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase text-slate-500">
                <MapPin className="h-3 w-3 text-blue-600" />
                Distance
              </span>
              <p className="font-mono text-sm font-bold text-blue-950">
                {Math.round(recommendation.distance_km)} km
              </p>
            </div>

            {/* Landed Cost */}
            <div className="rounded-lg bg-teal-50/70 border border-teal-100 p-2">
              <span className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase text-slate-500">
                <IndianRupee className="h-3 w-3 text-teal-600" />
                Landed
              </span>
              <p className="font-mono text-sm font-bold text-teal-950">
                {formatINR(recommendation.total_landed_cost_ton)}
                <span className="text-[10px] font-normal text-slate-500">/t</span>
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => onViewDetails(recommendation.listing_id)}
            className="w-full justify-center shadow-sm"
          >
            <span>View Match Details</span>
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AISmartRecommendationBanner;
