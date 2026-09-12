import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import apiService from '@/services/apiService';
import { PageHeader } from '@/components/ui/PageHeader';
import { ListingForm, type ListingFormValues } from '@/components/seller/ListingForm';
import { ListingPreviewCard } from '@/components/seller/ListingPreviewCard';
import { CheckCircle2, AlertCircle, ArrowLeft, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Form dirty state for Unsaved Changes Guard
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingNavigationPath, setPendingNavigationPath] = useState<string | null>(null);
  const isSubmittingOrSubmittedRef = useRef(false);

  const [previewData, setPreviewData] = useState<Partial<ListingFormValues>>({
    purity_percentage: 95.5,
    volume_metric_tons: 500,
    reserve_price_ton: 3200,
    physical_state: 'liquid',
    available_from: new Date().toISOString().split('T')[0],
    available_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: 'Cryogenically scrubbed point-source CO₂ batch with certified low moisture content.',
  });

  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);

  // Fetch company facility details if needed
  const { data: userProfileData } = useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      const res = await apiService.getCurrentUser();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const companyName =
    userProfileData?.company?.company_name || user?.company?.company_name || 'Industrial Facility';
  const companyLocation =
    userProfileData?.company?.location_name || user?.company?.location_name || 'Regional Facility Hub';

  // Listing creation mutation with optimistic updates
  const createListingMutation = useMutation({
    mutationFn: async (values: ListingFormValues) => {
      isSubmittingOrSubmittedRef.current = true;
      const payload = {
        purity_percentage: values.purity_percentage,
        volume_metric_tons: values.volume_metric_tons,
        physical_state: values.physical_state,
        reserve_price_ton: values.reserve_price_ton,
        available_from: values.available_from,
        available_until: values.available_until,
      };
      return await apiService.createListing(payload);
    },
    onMutate: async (values: ListingFormValues) => {
      // 1. Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['seller-dashboard'] });
      await queryClient.cancelQueries({ queryKey: ['seller-listings'] });
      await queryClient.cancelQueries({ queryKey: ['marketplace'] });

      // 2. Snapshot previous data
      const previousDashboard = queryClient.getQueryData(['seller-dashboard']);
      const previousListings = queryClient.getQueryData(['seller-listings']);
      const previousMarketplace = queryClient.getQueryData(['marketplace']);

      const optimisticId = `listing-opt-${Date.now()}`;
      const newListing = {
        id: optimisticId,
        seller_id: user?.id || 'seller-ultratech',
        company_name: companyName,
        location: companyLocation,
        purity_percentage: values.purity_percentage,
        volume_metric_tons: values.volume_metric_tons,
        physical_state: values.physical_state,
        reserve_price_ton: values.reserve_price_ton,
        available_from: values.available_from,
        available_until: values.available_until,
        status: 'available',
        description: values.description,
        created_at: new Date().toISOString(),
      };

      // 3. Optimistically update seller-dashboard
      queryClient.setQueryData(['seller-dashboard'], (old: any) => {
        if (!old) return old;
        const recent = old.recent_listings || old.listings || [];
        return {
          ...old,
          current_stored_tons: (old.current_stored_tons ?? 350) + values.volume_metric_tons,
          recent_listings: [newListing, ...recent],
          active_listings_count: (old.active_listings_count || recent.length) + 1,
          total_volume_available: (old.total_volume_available || 0) + values.volume_metric_tons,
        };
      });

      // 4. Optimistically update seller-listings
      queryClient.setQueryData(['seller-listings'], (old: any) => {
        if (!old) return { items: [newListing], total: 1 };
        if (Array.isArray(old)) return [newListing, ...old];
        return {
          ...old,
          items: [newListing, ...(old.items || [])],
          total: (old.total || 0) + 1,
        };
      });

      // 5. Optimistically update marketplace
      queryClient.setQueriesData({ queryKey: ['marketplace'] }, (old: any) => {
        if (!old) return old;
        const marketItem = {
          ...newListing,
          listing_id: newListing.id,
          seller_name: user?.full_name || 'Authorized Plant Engineer',
          seller_city: companyLocation.split(',')[0] || 'Sanand',
          price_per_ton: values.reserve_price_ton,
          available_tons: values.volume_metric_tons,
          ai_match_score: 96,
          is_verified: true,
        };
        if (Array.isArray(old)) return [marketItem, ...old];
        if (old.listings) {
          return {
            ...old,
            listings: [marketItem, ...(old.listings || [])],
            total: (old.total || 0) + 1,
          };
        }
        return old;
      });

      return { previousDashboard, previousListings, previousMarketplace };
    },
    onSuccess: (data) => {
      setIsFormDirty(false);

      // Show instant success toast notification
      setToastMessage({
        type: 'success',
        title: 'Listing Published Successfully!',
        description: `Batch #${data?.data?.listing_id ? data.data.listing_id.slice(0, 8) : ''} is now active on the industrial exchange.`,
      });

      // Instant client-side transition without page reload
      navigate('/seller/dashboard');
    },
    onError: (err: any, _variables, context) => {
      isSubmittingOrSubmittedRef.current = false;

      // Rollback caches on error
      if (context?.previousDashboard) {
        queryClient.setQueryData(['seller-dashboard'], context.previousDashboard);
      }
      if (context?.previousListings) {
        queryClient.setQueryData(['seller-listings'], context.previousListings);
      }
      if (context?.previousMarketplace) {
        queryClient.setQueryData(['marketplace'], context.previousMarketplace);
      }

      setToastMessage({
        type: 'error',
        title: 'Failed to Publish Listing',
        description: err?.message || 'An error occurred while publishing the batch. Please check your inputs.',
      });
    },
    onSettled: () => {
      // Silently refetch in background to sync with server
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['seller-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
    },
  });

  // Navigation guard logic
  const handleNavigateAttempt = (targetPath: string) => {
    if (isFormDirty && !isSubmittingOrSubmittedRef.current) {
      setPendingNavigationPath(targetPath);
      setShowLeaveDialog(true);
    } else {
      navigate(targetPath);
    }
  };

  const handleConfirmLeave = () => {
    setShowLeaveDialog(false);
    setIsFormDirty(false);
    isSubmittingOrSubmittedRef.current = true;
    navigate(pendingNavigationPath || '/seller/dashboard');
  };

  const handleStay = () => {
    setShowLeaveDialog(false);
    setPendingNavigationPath(null);
  };

  // Intercept window tab close or refresh when form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty && !isSubmittingOrSubmittedRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isFormDirty]);

  const handleFormSubmit = (values: ListingFormValues) => {
    setToastMessage(null);
    createListingMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      {/* Unsaved Changes Guard Confirmation Dialog */}
      {showLeaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-300 bg-white p-6 shadow-floating">
            <div className="flex items-center space-x-3 text-black">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-black">
                Unsaved Listing
              </h3>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-neutral-600">
              You have unsaved changes. Are you sure you want to leave?
            </p>

            <div className="mt-6 flex items-center justify-end space-x-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleStay}
              >
                Stay
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleConfirmLeave}
                className="bg-black hover:bg-neutral-800 text-white"
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="alert"
          className="fixed bottom-6 right-6 z-50 flex max-w-md items-start space-x-3 rounded-xl border border-black bg-white p-4 shadow-floating backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-5 text-black"
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-black" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-black" />
          )}
          <div className="flex-1 space-y-0.5">
            <h4 className="text-xs font-bold text-black">{toastMessage.title}</h4>
            <p className="text-[11px] text-neutral-600">
              {toastMessage.description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="rounded p-1 text-neutral-400 hover:text-black"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Create Stream Batch Listing"
        description="Publish captured point-source CO₂ volumes to the live marketplace for off-takers and industrial buyers."
        breadcrumbs={[
          { label: 'Plant Dashboard', to: '/seller/dashboard' },
          { label: 'Create Listing' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigateAttempt('/seller/dashboard')}
            className="gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Button>
        }
      />

      {/* Responsive Grid: Form on Left, Instant Preview on Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Form (7 Cols on large screens) */}
        <div className="lg:col-span-7 space-y-6">
          <ListingForm
            initialCompanyLocation={companyLocation}
            initialCompanyName={companyName}
            onSubmit={handleFormSubmit}
            onValuesChange={(vals) => setPreviewData(vals)}
            onDirtyChange={(dirty) => setIsFormDirty(dirty)}
            isLoading={createListingMutation.isPending}
          />
        </div>

        {/* Right Sticky Preview (5 Cols on large screens) */}
        <div className="lg:col-span-5">
          <div className="sticky top-20">
            <ListingPreviewCard
              companyName={companyName}
              location={companyLocation}
              purityPercentage={previewData.purity_percentage ?? 95.5}
              volumeMetricTons={previewData.volume_metric_tons ?? 500}
              reservePriceTon={previewData.reserve_price_ton ?? 3200}
              physicalState={previewData.physical_state ?? 'liquid'}
              availableFrom={previewData.available_from ?? ''}
              availableUntil={previewData.available_until ?? ''}
              description={previewData.description ?? ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListingPage;
