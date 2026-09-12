import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/apiService';
import { PageHeader } from '@/components/ui/PageHeader';
import { MarketplaceFilters, type MarketplaceFilterState } from '@/components/buyer/MarketplaceFilters';
import { SupplierGrid } from '@/components/buyer/SupplierGrid';
import { MatchScoreLegend } from '@/components/buyer/MatchScoreLegend';
import { AISmartRecommendationBanner } from '@/components/buyer/AISmartRecommendationBanner';
import { SupplierDetailsModal } from '@/components/buyer/SupplierDetailsModal';
import { CompareDrawer } from '@/components/buyer/CompareDrawer';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';

export const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();

  // Filters State
  const initialFilters: MarketplaceFilterState = {
    search: '',
    minPurity: '',
    quantity: '',
    maxDistance: '',
    minPrice: '',
    maxPrice: '',
    physicalState: 'all',
    sortBy: 'ai_score',
  };

  const [filters, setFilters] = useState<MarketplaceFilterState>(initialFilters);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);

  // 1. Fetch Marketplace Catalog with React Query
  const {
    data: marketplaceData,
    isLoading: isMarketplaceLoading,
    isError: isMarketplaceError,
    refetch: refetchMarketplace,
    isRefetching,
  } = useQuery({
    queryKey: ['marketplace', filters],
    queryFn: async () => {
      const params: any = {
        sort_by: filters.sortBy,
        page: 1,
        limit: 50,
      };

      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.minPurity !== '') params.min_purity = Number(filters.minPurity);
      if (filters.maxDistance !== '') params.max_distance = Number(filters.maxDistance);
      if (filters.minPrice !== '') params.min_price = Number(filters.minPrice);
      if (filters.maxPrice !== '') params.max_price = Number(filters.maxPrice);
      if (filters.quantity !== '') params.quantity = Number(filters.quantity);

      const res = await apiService.getMarketplace(params);
      return res.data;
    },
  });

  // 2. Fetch AI Recommendations with POST /api/v1/ai/recommend
  const {
    data: aiRecommendData,
    isLoading: isAILoading,
  } = useQuery({
    queryKey: ['ai-recommendation', filters.minPurity, filters.quantity],
    queryFn: async () => {
      const payload = {
        minimum_purity_floor: filters.minPurity !== '' ? Number(filters.minPurity) : 90.0,
        required_quantity_tons: filters.quantity !== '' ? Number(filters.quantity) : 250.0,
        budget_ceiling_per_ton: filters.maxPrice !== '' ? Number(filters.maxPrice) : 8000.0,
        delivery_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        destination_latitude: 22.7523,
        destination_longitude: 72.6841,
      };

      const res = await apiService.getAIRecommendations(payload);
      return res;
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleFilterChange = (updated: Partial<MarketplaceFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleViewDetails = (listingId: string) => {
    setSelectedListingId(listingId);
    setIsModalOpen(true);
  };

  // Compare selection handlers (up to 2 suppliers)
  const handleToggleCompare = (id: string) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleRemoveCompare = (id: string) => {
    setSelectedCompareIds((prev) => prev.filter((item) => item !== id));
  };

  const handleClearCompare = () => {
    setSelectedCompareIds([]);
  };

  // Filter listings by physical state if selected
  const rawListings = marketplaceData?.listings || [];
  const filteredListings = rawListings.filter((item) => {
    if (filters.physicalState === 'all') return true;
    return item.physical_state === filters.physicalState;
  });

  const topRecommendation = aiRecommendData?.top_recommendation;

  const compareSuppliers = rawListings.filter((item) =>
    selectedCompareIds.includes(item.listing_id)
  );

  const selectedSupplier = rawListings.find(
    (item) => item.listing_id === selectedListingId
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Top Page Header */}
      <PageHeader
        title="Carbon Marketplace"
        description="Discover verified CO₂ suppliers ranked by AI."
        badge={
          <span className="flex items-center space-x-1 rounded-full bg-black px-2.5 py-0.5 text-xs font-bold text-white dark:bg-white dark:text-black">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Ranked Streams</span>
          </span>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchMarketplace()}
            disabled={isRefetching}
            className="gap-1.5 border-neutral-300 text-black hover:border-black dark:border-neutral-700 dark:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>Refresh Streams</span>
          </Button>
        }
      />

      {/* AI Smart Recommendation Banner */}
      <AISmartRecommendationBanner
        recommendation={topRecommendation}
        isLoading={isAILoading}
        onViewDetails={handleViewDetails}
      />

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (4 cols on lg, 3 on xl): Filters & AI Match Legend */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <MarketplaceFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            totalCount={filteredListings.length}
          />

          <MatchScoreLegend />
        </div>

        {/* Right Column (8 cols on lg, 9 on xl): Streams Grid */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Verified Captured Streams
              </span>
              <span className="rounded-full bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-[11px] font-bold text-black dark:bg-neutral-900 dark:border-neutral-800 dark:text-white">
                {filteredListings.length} Batches
              </span>
            </div>
            {selectedCompareIds.length > 0 && (
              <span className="text-xs font-bold text-black dark:text-white">
                Comparing {selectedCompareIds.length} / 2 suppliers
              </span>
            )}
          </div>

          {isMarketplaceError ? (
            <ErrorState
              title="Unable to load marketplace suppliers"
              description="Could not connect to the CCUS stream index. Please retry."
              onRetry={() => refetchMarketplace()}
              isRetrying={isRefetching}
            />
          ) : (
            <SupplierGrid
              suppliers={filteredListings}
              isLoading={isMarketplaceLoading}
              onViewDetails={handleViewDetails}
              onClearFilters={handleResetFilters}
              selectedCompareIds={selectedCompareIds}
              onToggleCompare={handleToggleCompare}
            />
          )}
        </div>
      </div>

      {/* Quick View Details Modal */}
      <SupplierDetailsModal
        listingId={selectedListingId}
        initialScore={selectedSupplier?.ai_match_score}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedListingId(null);
        }}
        onPlaceBid={(listingId) => {
          setIsModalOpen(false);
          navigate(`/marketplace/${listingId}`);
        }}
        onCalculateLogistics={(listingId) => {
          setIsModalOpen(false);
          navigate(`/marketplace/${listingId}`);
        }}
        onViewFullPage={(listingId) => {
          setIsModalOpen(false);
          navigate(`/marketplace/${listingId}`);
        }}
      />

      {/* Compare Suppliers Drawer */}
      <CompareDrawer
        suppliers={compareSuppliers}
        onRemove={handleRemoveCompare}
        onClear={handleClearCompare}
        onSelectSupplier={handleViewDetails}
      />
    </div>
  );
};

export default MarketplacePage;
