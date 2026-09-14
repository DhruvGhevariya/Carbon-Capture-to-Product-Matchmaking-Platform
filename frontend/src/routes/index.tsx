import React, { Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

// Lazy loaded page components
const LandingPage = React.lazy(() => import('@/pages/public/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const SellerDashboardPage = React.lazy(() => import('@/pages/seller/SellerDashboardPage').then(m => ({ default: m.SellerDashboardPage })));
const CreateListingPage = React.lazy(() => import('@/pages/seller/CreateListingPage').then(m => ({ default: m.CreateListingPage })));
const MarketplacePage = React.lazy(() => import('@/pages/buyer/MarketplacePage').then(m => ({ default: m.MarketplacePage })));
const SupplierDetailsPage = React.lazy(() => import('@/pages/buyer/SupplierDetailsPage').then(m => ({ default: m.SupplierDetailsPage })));
const BidsPage = React.lazy(() => import('@/pages/shared/BidsPage').then(m => ({ default: m.BidsPage })));
const OrdersPage = React.lazy(() => import('@/pages/shared/OrdersPage').then(m => ({ default: m.OrdersPage })));
const SellerListingsPage = React.lazy(() => import('@/pages/seller/SellerListingsPage').then(m => ({ default: m.SellerListingsPage })));
const LogisticsPage = React.lazy(() => import('@/pages/buyer/LogisticsPage').then(m => ({ default: m.LogisticsPage })));
const AIRecommendationPage = React.lazy(() => import('@/pages/buyer/AIRecommendationPage').then(m => ({ default: m.AIRecommendationPage })));
const DiscoveryFingerprintPage = React.lazy(() => import('@/pages/discovery/DiscoveryFingerprintPage').then(m => ({ default: m.DiscoveryFingerprintPage })));
const CarbonIntelligencePage = React.lazy(() => import('@/pages/intelligence/CarbonIntelligencePage').then(m => ({ default: m.CarbonIntelligencePage })));
const PartnershipProjectsPage = React.lazy(() => import('@/pages/projects/PartnershipProjectsPage').then(m => ({ default: m.PartnershipProjectsPage })));
const DemoOne = React.lazy(() => import('@/components/ui/demo'));
const VelarisDemo = React.lazy(() => import('@/components/ui/velaris-demo'));

const PageFallback: React.FC = () => (
  <div className="space-y-6 p-4 sm:p-6" role="status" aria-label="Loading page content">
    <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
    <LoadingSkeleton type="card" rows={3} />
    <LoadingSkeleton type="table" rows={4} />
  </div>
);

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export const PublicRoute: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={role === 'seller' ? '/seller/dashboard' : '/marketplace'} replace />;
  }
  return <Outlet />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<DemoOne />} />
        <Route path="/velaris" element={<VelarisDemo />} />

        {/* Auth Public Route */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected routes wrapped in AppLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
            <Route path="/seller/listings" element={<SellerListingsPage />} />
            <Route path="/seller/listings/new" element={<CreateListingPage />} />
            <Route path="/discovery" element={<DiscoveryFingerprintPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/:id" element={<SupplierDetailsPage />} />
            <Route path="/ai/recommend" element={<AIRecommendationPage />} />
            <Route path="/intelligence" element={<CarbonIntelligencePage />} />
            <Route path="/logistics" element={<LogisticsPage />} />
            <Route path="/bids" element={<BidsPage />} />
            <Route path="/seller/bids" element={<BidsPage />} />
            <Route path="/projects" element={<PartnershipProjectsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>
        </Route>


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

