export type UserRole = 'seller' | 'buyer' | 'admin';

export type ListingStatus = 'available' | 'reserved' | 'sold' | 'cancelled';

export type BidStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export type OrderStatus = 'confirmed' | 'processing' | 'in_transit' | 'delivered' | 'completed' | 'disputed';

export interface Company {
  id: string;
  company_name: string;
  industry_type: string;
  location_name: string;
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  company_id?: string | null;
  company_name?: string;
  is_active?: boolean;
  company?: Company;
}

export interface Listing {
  id: string;
  seller_id: string;
  purity_percentage: number;
  volume_metric_tons: number;
  physical_state: 'liquid' | 'pressurized_gas';
  reserve_price_ton: number;
  status: ListingStatus;
  available_from: string;
  available_until: string;
  created_at: string;
  pending_bids_count?: number;
}

export interface MarketplaceCard {
  listing_id: string;
  company_name: string;
  industry_type: string;
  location: string;
  latitude: number;
  longitude: number;
  purity_percentage: number;
  volume_available_tons: number;
  physical_state: string;
  base_price_ton: number;
  distance_km: number;
  estimated_freight_ton: number;
  total_landed_cost_ton: number;
  ai_match_score: number;
  status: string;
  created_at: string;
}

export interface Bid {
  id: string;
  listing_id: string;
  purity_percentage?: number;
  counter_party_name?: string;
  counter_party_company?: string;
  offered_price_ton: number;
  requested_quantity: number;
  total_offered_value: number;
  currency?: string;
  delivery_target: string;
  status: BidStatus;
  ai_match_score?: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_reference: string;
  bid_id: string;
  listing_id: string;
  seller_id: string;
  seller_name: string;
  seller_company: string;
  buyer_id: string;
  buyer_name: string;
  buyer_company: string;
  final_price_ton: number;
  quantity_tons: number;
  total_value: number;
  delivery_window: string;
  order_status: OrderStatus;
  purity_percentage: number;
  confirmed_at: string;
}

export interface LogisticsEstimate {
  distance_km: number;
  eta_hours: number;
  transport_cost: number;
  cost_breakdown: {
    base_freight: number;
    fuel_surcharge: number;
    specialized_cryogenic_handling: number;
  };
  carbon_emission_kg: number;
}

export interface SellerDashboardData {
  active_listings: number;
  current_stored_tons: number;
  total_capacity_tons?: number;
  pending_bids: number;
  revenue: number;
  storage_utilization: number;
  currency: string;
  monthly_listing_trend?: Array<{
    month: string;
    capturedTons: number;
    offTakenTons: number;
    volume?: number;
    revenue?: number;
  }>;
}
