import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PlusCircle, ShoppingBag, Sparkles, Zap, ShieldAlert } from 'lucide-react';

export interface QuickActionsPanelProps {
  onCreateListing: () => void;
  onViewMarketplace: () => void;
  onViewAIInsights: () => void;
  className?: string;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onCreateListing,
  onViewMarketplace,
  onViewAIInsights,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-black dark:text-white" />
          <CardTitle>Terminal Quick Actions</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* 1. Create Listing */}
        <Button
          variant="primary"
          size="md"
          onClick={onCreateListing}
          className="w-full justify-start text-xs shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Publish CO₂ Stream Batch</span>
        </Button>

        {/* 2. View Marketplace */}
        <Button
          variant="outline"
          size="md"
          onClick={onViewMarketplace}
          className="w-full justify-start text-xs border-neutral-300 text-black hover:border-black dark:border-neutral-700 dark:text-white"
        >
          <ShoppingBag className="h-4 w-4 text-black dark:text-white" />
          <span>Browse Active Marketplace</span>
        </Button>

        {/* 3. AI Insights */}
        <Button
          variant="ghost"
          size="md"
          onClick={onViewAIInsights}
          className="w-full justify-start text-xs border border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
        >
          <Sparkles className="h-4 w-4 text-black dark:text-white" />
          <span>AI Demand Forecast & Insights</span>
        </Button>

        {/* Platform Status Notice */}
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 text-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center space-x-1.5 text-black dark:text-white font-bold">
            <ShieldAlert className="h-4 w-4 text-black dark:text-white" />
            <span>Platform Status</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-neutral-500">
            Real-time buffer pressure telemetry is synchronized with ISO 14064 carbon capture accountability records.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
