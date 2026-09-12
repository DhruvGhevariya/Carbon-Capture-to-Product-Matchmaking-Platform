import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { formatINR, formatNumber } from '@/lib/utils';
import type { Listing } from '@/types';
import { Layers } from 'lucide-react';

export interface RecentListingsTableProps {
  listings: Listing[];
  isLoading?: boolean;
  onViewAll?: () => void;
  onRowClick?: (listing: Listing) => void;
}

export const RecentListingsTable: React.FC<RecentListingsTableProps> = ({
  listings,
  isLoading = false,
  onViewAll,
  onRowClick,
}) => {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'primary';
      case 'reserved':
        return 'outline';
      case 'sold':
        return 'secondary';
      case 'cancelled':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const columns: Column<Listing>[] = [
    {
      key: 'id',
      header: 'Batch ID',
      render: (item) => (
        <span className="font-mono text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">
          #{item.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'purity_percentage',
      header: 'CO₂ Purity',
      render: (item) => (
        <span className="tabular-nums font-bold text-black dark:text-white">
          {formatNumber(item.purity_percentage, 2)}%
        </span>
      ),
    },
    {
      key: 'volume_metric_tons',
      header: 'Available Volume',
      render: (item) => (
        <span className="tabular-nums font-medium">
          {formatNumber(item.volume_metric_tons, 1)} t
        </span>
      ),
    },
    {
      key: 'reserve_price_ton',
      header: 'Floor Price',
      render: (item) => (
        <span className="tabular-nums font-semibold text-black dark:text-white">
          {formatINR(item.reserve_price_ton)}
          <span className="text-[10px] text-neutral-400">/t</span>
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'right',
      render: (item) => (
        <Badge variant={getStatusVariant(item.status)} size="sm" dot>
          <span className="capitalize">{item.status}</span>
        </Badge>
      ),
    },
  ];

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-black dark:text-white" />
            <CardTitle>Recent Batch Streams</CardTitle>
          </div>
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-bold text-black hover:underline dark:text-white"
            >
              View Inventory →
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <DataTable
          columns={columns}
          data={listings.slice(0, 5)}
          loading={isLoading}
          emptyTitle="No batch listings published"
          emptyDescription="Create your first point-source CO₂ batch to receive purchase offers."
          onRowClick={onRowClick}
          className="border-0 shadow-none rounded-none"
        />
      </CardContent>
    </Card>
  );
};
