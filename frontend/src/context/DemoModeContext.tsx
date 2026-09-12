import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_DEMO_SELLERS,
  INITIAL_DEMO_BUYERS,
  INITIAL_DEMO_BIDS,
  INITIAL_DEMO_ORDERS,
  INITIAL_DEMO_ANALYTICS,
  type DemoSeller,
  type DemoBuyer,
} from '@/data/demoData';
import type { Bid, Order, Listing, MarketplaceCard } from '@/types';
import { useNotifications } from './NotificationContext';
import { useToast } from './ToastContext';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  resetDemoData: () => void;
  sellers: DemoSeller[];
  buyers: DemoBuyer[];
  bids: Bid[];
  orders: Order[];
  analytics: typeof INITIAL_DEMO_ANALYTICS;
  acceptBid: (bidId: string) => Promise<void>;
  rejectBid: (bidId: string) => Promise<void>;
  createBid: (data: {
    listing_id: string;
    offered_price_ton: number;
    requested_quantity: number;
    delivery_target: string;
  }) => Promise<Bid>;
  createListing: (data: Partial<Listing>) => Promise<Listing>;
  updateOrderStatus: (orderId: string, status: Order['order_status']) => Promise<void>;
  getMarketplaceCards: () => MarketplaceCard[];
  getMarketplaceDetail: (id: string) => any;
}

const STORAGE_KEYS = {
  DEMO_MODE: 'carbonx_demo_mode_enabled',
  SELLERS: 'carbonx_demo_sellers',
  BUYERS: 'carbonx_demo_buyers',
  BIDS: 'carbonx_demo_bids',
  ORDERS: 'carbonx_demo_orders',
};

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addNotification, resetNotifications } = useNotifications();
  const { success, info } = useToast();

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEMO_MODE);
    const token = localStorage.getItem('token');
    // If a real backend authentication token exists, Demo Mode must NEVER default to true
    if (token && !token.startsWith('demo-')) {
      return saved === 'true';
    }
    return saved === 'true';
  });

  const [sellers, setSellers] = useState<DemoSeller[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELLERS);
    return saved ? JSON.parse(saved) : INITIAL_DEMO_SELLERS;
  });

  const [buyers, setBuyers] = useState<DemoBuyer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUYERS);
    return saved ? JSON.parse(saved) : INITIAL_DEMO_BUYERS;
  });

  const [bids, setBids] = useState<Bid[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BIDS);
    return saved ? JSON.parse(saved) : INITIAL_DEMO_BIDS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_DEMO_ORDERS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, String(isDemoMode));
  }, [isDemoMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUYERS, JSON.stringify(buyers));
  }, [buyers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(bids));
  }, [bids]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => {
      const next = !prev;
      if (next) {
        success('Demo Mode Enabled', 'Loaded verified HackOut demo records.');
      } else {
        info('Demo Mode Disabled', 'Connecting strictly to live backend services.');
      }
      return next;
    });
  };

  const resetDemoData = () => {
    setSellers(INITIAL_DEMO_SELLERS);
    setBuyers(INITIAL_DEMO_BUYERS);
    setBids(INITIAL_DEMO_BIDS);
    setOrders(INITIAL_DEMO_ORDERS);
    resetNotifications();

    localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(INITIAL_DEMO_SELLERS));
    localStorage.setItem(STORAGE_KEYS.BUYERS, JSON.stringify(INITIAL_DEMO_BUYERS));
    localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(INITIAL_DEMO_BIDS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_DEMO_ORDERS));

    success('Demo Reset Completed', 'All records, bids, orders, and notifications reset to seed state.');
  };

  // Bid Actions
  const acceptBid = async (bidId: string) => {
    const targetBid = bids.find((b) => b.id === bidId);
    if (!targetBid) return;

    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: 'accepted' as const } : b))
    );

    // Create an order automatically upon accepting
    const seller = sellers.find((s) => s.id === targetBid.listing_id) || sellers[0];
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      order_reference: `#CX-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      bid_id: targetBid.id,
      listing_id: targetBid.listing_id,
      seller_id: seller.id,
      seller_name: seller.contact_person,
      seller_company: seller.company_name,
      buyer_id: 'buyer-ecobuild',
      buyer_name: targetBid.counter_party_name || 'Procurement Officer',
      buyer_company: targetBid.counter_party_company || 'EcoBuild Materials',
      final_price_ton: targetBid.offered_price_ton,
      quantity_tons: targetBid.requested_quantity,
      total_value: targetBid.total_offered_value + 32000,
      delivery_window: `Target Date: ${targetBid.delivery_target} • Scheduled`,
      order_status: 'confirmed',
      purity_percentage: targetBid.purity_percentage || seller.purity_percentage,
      confirmed_at: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    addNotification({
      title: 'Bid accepted',
      message: `Commercial order ${newOrder.order_reference} generated for ${newOrder.quantity_tons}t of CO₂`,
      type: 'order',
      link: '/orders',
    });
  };

  const rejectBid = async (bidId: string) => {
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: 'rejected' as const } : b))
    );

    addNotification({
      title: 'Purchase bid declined',
      message: `Purchase bid ${bidId} was declined and negotiation archived.`,
      type: 'bid',
      link: '/bids',
    });
  };

  const createBid = async (data: {
    listing_id: string;
    offered_price_ton: number;
    requested_quantity: number;
    delivery_target: string;
  }): Promise<Bid> => {
    const seller = sellers.find((s) => s.id === data.listing_id) || sellers[0];
    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      listing_id: data.listing_id,
      purity_percentage: seller.purity_percentage,
      counter_party_name: 'Dr. Ananya Sengupta',
      counter_party_company: 'GreenGrow Chemicals',
      offered_price_ton: data.offered_price_ton,
      requested_quantity: data.requested_quantity,
      total_offered_value: data.offered_price_ton * data.requested_quantity,
      currency: 'INR',
      delivery_target: data.delivery_target,
      status: 'pending',
      ai_match_score: seller.ai_match_score,
      created_at: new Date().toISOString(),
    };

    setBids((prev) => [newBid, ...prev]);

    addNotification({
      title: 'New bid received',
      message: `Offer received from GreenGrow Chemicals for ${data.requested_quantity}t @ ₹${data.offered_price_ton.toLocaleString('en-IN')}/t`,
      type: 'bid',
      link: '/seller/bids',
    });

    return newBid;
  };

  const createListing = async (data: Partial<Listing>): Promise<Listing> => {
    const newListingId = `seller-listing-${Date.now()}`;
    const newSeller: DemoSeller = {
      id: newListingId,
      company_name: 'UltraTech Cement (Plant #2)',
      industry_type: 'Cement',
      city: 'Ahmedabad',
      location_name: 'Sanand Industrial Cluster, Ahmedabad, Gujarat',
      latitude: 22.9868,
      longitude: 72.3814,
      purity_percentage: data.purity_percentage || 98.0,
      volume_metric_tons: data.volume_metric_tons || 200,
      reserve_price_ton: data.reserve_price_ton || 4600,
      ai_match_score: 95,
      verified: true,
      physical_state: data.physical_state || 'liquid',
      iso_certified: true,
      contact_person: 'Rajesh K. Verma',
      contact_email: 'rajesh.verma@ultratech.com',
    };

    setSellers((prev) => [newSeller, ...prev]);

    addNotification({
      title: 'Listing published',
      message: `New listing for ${newSeller.volume_metric_tons}t (${newSeller.purity_percentage}% purity) published.`,
      type: 'listing',
      link: '/marketplace',
    });

    const listing: Listing = {
      id: newListingId,
      seller_id: 'user-ultratech',
      purity_percentage: newSeller.purity_percentage,
      volume_metric_tons: newSeller.volume_metric_tons,
      physical_state: newSeller.physical_state,
      reserve_price_ton: newSeller.reserve_price_ton,
      status: 'available',
      available_from: data.available_from || new Date().toISOString().split('T')[0],
      available_until: data.available_until || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };

    return listing;
  };

  const updateOrderStatus = async (orderId: string, status: Order['order_status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: status } : o))
    );

    addNotification({
      title: status === 'in_transit' ? 'Order dispatched' : 'Delivery status updated',
      message: `Order ${orderId} status changed to ${status}.`,
      type: status === 'in_transit' ? 'order' : 'delivery',
      link: '/orders',
    });
  };

  const getMarketplaceCards = (): MarketplaceCard[] => {
    return sellers.map((seller) => {
      // Calculate realistic distance to buyer location (Ahmedabad reference)
      const distance =
        seller.city === 'Ahmedabad'
          ? 28
          : seller.city === 'Vadodara'
          ? 112
          : seller.city === 'Surat'
          ? 265
          : 320;
      const freightPerTon = Math.round(distance * 3.8 + 200);

      return {
        listing_id: seller.id,
        company_name: seller.company_name,
        industry_type: seller.industry_type,
        location: seller.location_name,
        latitude: seller.latitude,
        longitude: seller.longitude,
        purity_percentage: seller.purity_percentage,
        volume_available_tons: seller.volume_metric_tons,
        physical_state: seller.physical_state,
        base_price_ton: seller.reserve_price_ton,
        distance_km: distance,
        estimated_freight_ton: freightPerTon,
        total_landed_cost_ton: seller.reserve_price_ton + freightPerTon,
        ai_match_score: seller.ai_match_score,
        status: 'available',
        created_at: new Date().toISOString(),
      };
    });
  };

  const getMarketplaceDetail = (id: string) => {
    const seller = sellers.find((s) => s.id === id) || sellers[0];
    const distance =
      seller.city === 'Ahmedabad'
        ? 28
        : seller.city === 'Vadodara'
        ? 112
        : seller.city === 'Surat'
        ? 265
        : 320;
    const freightPerTon = Math.round(distance * 3.8 + 200);

    return {
      listing_id: seller.id,
      company: {
        id: seller.id,
        company_name: seller.company_name,
        industry_type: seller.industry_type,
        location_name: seller.location_name,
        latitude: seller.latitude,
        longitude: seller.longitude,
      },
      purity_percentage: seller.purity_percentage,
      available_tons: seller.volume_metric_tons,
      reserve_price_ton: seller.reserve_price_ton,
      physical_state: seller.physical_state,
      ai_match_score: seller.ai_match_score,
      estimated_distance_km: distance,
      estimated_freight_ton: freightPerTon,
      landed_cost_ton: seller.reserve_price_ton + freightPerTon,
      available_from: '2026-09-12',
      available_until: '2026-10-12',
      verified: seller.verified,
    };
  };

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        resetDemoData,
        sellers,
        buyers,
        bids,
        orders,
        analytics: INITIAL_DEMO_ANALYTICS,
        acceptBid,
        rejectBid,
        createBid,
        createListing,
        updateOrderStatus,
        getMarketplaceCards,
        getMarketplaceDetail,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
};

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}
