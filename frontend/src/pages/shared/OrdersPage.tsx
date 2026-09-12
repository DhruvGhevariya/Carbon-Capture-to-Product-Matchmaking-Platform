import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/apiService';
import { PageHeader } from '@/components/ui/PageHeader';
import { OrderCard } from '@/components/shared/OrderCard';
import { OrderTimeline } from '@/components/shared/OrderTimeline';
import { OrderSummary } from '@/components/shared/OrderSummary';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/utils';
import type { Order } from '@/types';
import {
  FileCheck2,
  RefreshCw,
  X,
  Building2,
  Factory,
  ShieldCheck,
  Calendar,
  Gauge,
  Truck,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch orders from GET /api/v1/orders
  const {
    data: ordersResponse,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await apiService.getOrders();
      return res.data;
    },
  });

  const orders: Order[] = ordersResponse || [];

  // Filter orders by status tab
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'all') return true;
    const s = order.order_status?.toLowerCase();
    if (statusFilter === 'active') {
      return s === 'confirmed' || s === 'processing' || s === 'in_transit' || s === 'dispatch';
    }
    if (statusFilter === 'delivered') {
      return s === 'delivered' || s === 'completed';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Commercial Contracts & Orders"
        description="Track executed CCUS commercial contracts, logistics dispatch, and physical chain-of-custody."
        breadcrumbs={[
          { label: 'Plant Dashboard', to: '/seller/dashboard' },
          { label: 'Orders' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>Refresh Orders</span>
          </Button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 pb-2 dark:border-neutral-800">
        {[
          { id: 'all', label: 'All Orders', count: orders.length },
          {
            id: 'active',
            label: 'Active Fulfillment',
            count: orders.filter((o) => {
              const s = o.order_status?.toLowerCase();
              return s === 'confirmed' || s === 'processing' || s === 'in_transit' || s === 'dispatch';
            }).length,
          },
          {
            id: 'delivered',
            label: 'Delivered',
            count: orders.filter((o) => {
              const s = o.order_status?.toLowerCase();
              return s === 'delivered' || s === 'completed';
            }).length,
          },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.2 text-[10px] ${
                  isActive ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-800'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>


      {/* Orders Grid */}
      {isError ? (
        <ErrorState
          title="Failed to load commercial contracts and orders"
          description="Could not query active fulfillment records from the CarbonX node. Please retry."
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <LoadingSkeleton type="card" rows={4} />
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title="No commercial orders found"
          description="Executed orders from accepted bids will appear here with live dispatch tracking."
          icon={FileCheck2}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={(ord) => setSelectedOrder(ord)}
            />
          ))}
        </div>
      )}

      {/* Order Detail Modal with Timeline & Summary */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-floating dark:border-neutral-800 dark:bg-neutral-900">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-800/40">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <FileCheck2 className="h-5 w-5 text-black dark:text-white" />
                  <h3 className="font-mono text-base font-bold text-neutral-950 dark:text-white">
                    Order Contract {selectedOrder.order_reference}
                  </h3>
                  <Badge variant="primary" size="sm" dot>
                    Active Chain of Custody
                  </Badge>
                </div>
                <p className="text-xs text-neutral-500">
                  Confirmed: {new Date(selectedOrder.confirmed_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="max-h-[78vh] overflow-y-auto p-6 space-y-6 text-xs">
              {/* 1. Order Timeline Component */}
              <Card className="p-4 border-neutral-200 dark:border-neutral-800">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-3">
                  Physical Dispatch & Fulfillment Lifecycle
                </h4>
                <OrderTimeline currentStage={selectedOrder.order_status} />
              </Card>

              {/* Counterparties & Technical Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Counterparties */}
                <Card className="p-4 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-black" />
                    Contract Counterparties
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start space-x-2 rounded-lg bg-neutral-50 p-2.5 dark:bg-neutral-800/50">
                      <Factory className="h-4 w-4 text-black mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] text-neutral-400 font-semibold uppercase">Point-Source Emitter</span>
                        <p className="font-bold text-neutral-900 dark:text-white">{selectedOrder.seller_company}</p>
                        <p className="text-[11px] text-neutral-500">Authorized Plant Contact: {selectedOrder.seller_name}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 rounded-lg bg-neutral-50 p-2.5 dark:bg-neutral-800/50">
                      <Building2 className="h-4 w-4 text-neutral-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] text-neutral-400 font-semibold uppercase">Off-Taker Enterprise</span>
                        <p className="font-bold text-neutral-900 dark:text-white">{selectedOrder.buyer_company}</p>
                        <p className="text-[11px] text-neutral-500">Procurement Lead: {selectedOrder.buyer_name}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Technical Specs */}
                <Card className="p-4 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Gauge className="h-4 w-4 text-black" />
                    Chemical Quality & Verification
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-2.5 dark:border-neutral-800 dark:bg-neutral-800/40">
                      <span className="text-[10px] text-neutral-400 font-semibold uppercase">Purity Floor</span>
                      <p className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
                        {formatNumber(selectedOrder.purity_percentage ?? 98.2, 1)}%
                      </p>
                      <span className="text-[10px] text-neutral-600 font-medium">ISBT Standard</span>
                    </div>

                    <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-2.5 dark:border-neutral-800 dark:bg-neutral-800/40">
                      <span className="text-[10px] text-neutral-400 font-semibold uppercase">Contract Tonnage</span>
                      <p className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
                        {formatNumber(selectedOrder.quantity_tons, 1)} Tons
                      </p>
                      <span className="text-[10px] text-neutral-500">Cryogenic Liquid</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-neutral-500 pt-1">
                    <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                    <span>Scheduled Delivery Window: <strong className="text-neutral-800 dark:text-neutral-200">{selectedOrder.delivery_window}</strong></span>
                  </div>
                </Card>
              </div>

              {/* 2. Order Summary Card Component */}
              <OrderSummary
                quantityTons={selectedOrder.quantity_tons}
                basePriceTon={selectedOrder.final_price_ton}
                freightCostTon={850}
                distanceKm={145}
                etaHours={3}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
              <span className="text-xs text-neutral-500 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-black" />
                <span>Dedicated cryogenic road tanker allocated</span>
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Close View
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
