export interface DemoSeller {
  id: string;
  company_name: string;
  industry_type: 'Cement' | 'Steel' | 'Chemicals' | 'Power';
  city: string;
  location_name: string;
  latitude: number;
  longitude: number;
  purity_percentage: number;
  volume_metric_tons: number;
  reserve_price_ton: number;
  ai_match_score: number;
  verified: boolean;
  physical_state: 'liquid' | 'pressurized_gas';
  iso_certified: boolean;
  contact_person: string;
  contact_email: string;
}

export interface DemoBuyer {
  id: string;
  company_name: string;
  industry_type: string;
  city: string;
  location_name: string;
  latitude: number;
  longitude: number;
  contact_person: string;
  contact_email: string;
  demand_tons_month: number;
  min_purity: number;
}

export interface DemoNotification {
  id: string;
  title: string;
  message: string;
  type: 'bid' | 'order' | 'listing' | 'delivery' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

// 4 Specified Sellers
export const INITIAL_DEMO_SELLERS: DemoSeller[] = [
  {
    id: 'seller-ultratech',
    company_name: 'UltraTech Cement',
    industry_type: 'Cement',
    city: 'Ahmedabad',
    location_name: 'Sanand Industrial Cluster, Ahmedabad, Gujarat',
    latitude: 22.9868,
    longitude: 72.3814,
    purity_percentage: 98.5,
    volume_metric_tons: 350,
    reserve_price_ton: 4800,
    ai_match_score: 96,
    verified: true,
    physical_state: 'liquid',
    iso_certified: true,
    contact_person: 'Rajesh K. Verma (VP Operations)',
    contact_email: 'rajesh.verma@ultratech.com',
  },
  {
    id: 'seller-ambuja',
    company_name: 'Ambuja Cement',
    industry_type: 'Cement',
    city: 'Surat',
    location_name: 'Hazira Industrial Zone, Surat, Gujarat',
    latitude: 21.1702,
    longitude: 72.8311,
    purity_percentage: 97.2,
    volume_metric_tons: 220,
    reserve_price_ton: 4500,
    ai_match_score: 92,
    verified: true,
    physical_state: 'liquid',
    iso_certified: true,
    contact_person: 'Suresh Singhania (Plant Lead)',
    contact_email: 'suresh.s@ambujacement.com',
  },
  {
    id: 'seller-tatasteel',
    company_name: 'Tata Steel',
    industry_type: 'Steel',
    city: 'Jamnagar',
    location_name: 'Jamnagar Metallurgical Corridor, Gujarat',
    latitude: 22.4707,
    longitude: 70.0577,
    purity_percentage: 94.8,
    volume_metric_tons: 500,
    reserve_price_ton: 3900,
    ai_match_score: 89,
    verified: true,
    physical_state: 'pressurized_gas',
    iso_certified: true,
    contact_person: 'Pradeep Patnaik (Captive CCUS Lead)',
    contact_email: 'p.patnaik@tatasteel.com',
  },
  {
    id: 'seller-jswsteel',
    company_name: 'JSW Steel',
    industry_type: 'Steel',
    city: 'Vadodara',
    location_name: 'Waghodia Industrial Belt, Vadodara, Gujarat',
    latitude: 22.3072,
    longitude: 73.1812,
    purity_percentage: 96.0,
    volume_metric_tons: 400,
    reserve_price_ton: 4200,
    ai_match_score: 94,
    verified: true,
    physical_state: 'liquid',
    iso_certified: true,
    contact_person: 'Amitabh Sen (Director Energy & Decarb)',
    contact_email: 'a.sen@jsw.in',
  },
];

// 3 Specified Buyers
export const INITIAL_DEMO_BUYERS: DemoBuyer[] = [
  {
    id: 'buyer-greengrow',
    company_name: 'GreenGrow Chemicals',
    industry_type: 'Agro-Chemicals & Bio-enrichment',
    city: 'Vadodara',
    location_name: 'Kheda Agri Park, Vadodara Hub, Gujarat',
    latitude: 22.3100,
    longitude: 73.1900,
    contact_person: 'Dr. Ananya Sengupta',
    contact_email: 'ananya.s@greengrow.in',
    demand_tons_month: 250,
    min_purity: 95.0,
  },
  {
    id: 'buyer-ecobuild',
    company_name: 'EcoBuild Materials',
    industry_type: 'Sustainable Concrete & Precast',
    city: 'Ahmedabad',
    location_name: 'Naroda Industrial Estate, Ahmedabad, Gujarat',
    latitude: 23.0225,
    longitude: 72.5714,
    contact_person: 'Vikram Mehra',
    contact_email: 'vikram.m@ecobuild.in',
    demand_tons_month: 400,
    min_purity: 92.0,
  },
  {
    id: 'buyer-carbonfuel',
    company_name: 'CarbonFuel Labs',
    industry_type: 'Synthetic Fuels & CCU Hydrocarbons',
    city: 'Surat',
    location_name: 'Surat Clean Tech Innovation Cluster, Gujarat',
    latitude: 21.1800,
    longitude: 72.8200,
    contact_person: 'Dr. Rohan Deshmukh',
    contact_email: 'rohan.d@carbonfuel.tech',
    demand_tons_month: 300,
    min_purity: 96.5,
  },
];

// Realistic Bids
export const INITIAL_DEMO_BIDS = [
  {
    id: 'bid-101',
    listing_id: 'seller-ultratech',
    purity_percentage: 98.5,
    counter_party_name: 'Vikram Mehra',
    counter_party_company: 'EcoBuild Materials',
    offered_price_ton: 4800,
    requested_quantity: 150,
    total_offered_value: 720000,
    currency: 'INR',
    delivery_target: '2026-09-18',
    status: 'accepted' as const,
    ai_match_score: 96,
    created_at: '2026-09-11T14:30:00Z',
  },
  {
    id: 'bid-102',
    listing_id: 'seller-jswsteel',
    purity_percentage: 96.0,
    counter_party_name: 'Dr. Ananya Sengupta',
    counter_party_company: 'GreenGrow Chemicals',
    offered_price_ton: 4150,
    requested_quantity: 200,
    total_offered_value: 830000,
    currency: 'INR',
    delivery_target: '2026-09-22',
    status: 'pending' as const,
    ai_match_score: 94,
    created_at: '2026-09-12T01:15:00Z',
  },
  {
    id: 'bid-103',
    listing_id: 'seller-tatasteel',
    purity_percentage: 94.8,
    counter_party_name: 'Dr. Rohan Deshmukh',
    counter_party_company: 'CarbonFuel Labs',
    offered_price_ton: 3850,
    requested_quantity: 300,
    total_offered_value: 1155000,
    currency: 'INR',
    delivery_target: '2026-09-25',
    status: 'pending' as const,
    ai_match_score: 89,
    created_at: '2026-09-11T18:45:00Z',
  },
  {
    id: 'bid-104',
    listing_id: 'seller-ambuja',
    purity_percentage: 97.2,
    counter_party_name: 'Vikram Mehra',
    counter_party_company: 'EcoBuild Materials',
    offered_price_ton: 4450,
    requested_quantity: 120,
    total_offered_value: 534000,
    currency: 'INR',
    delivery_target: '2026-09-28',
    status: 'pending' as const,
    ai_match_score: 93,
    created_at: '2026-09-10T09:20:00Z',
  },
  {
    id: 'bid-105',
    listing_id: 'seller-ambuja',
    purity_percentage: 97.2,
    counter_party_name: 'Dr. Ananya Sengupta',
    counter_party_company: 'GreenGrow Chemicals',
    offered_price_ton: 4400,
    requested_quantity: 100,
    total_offered_value: 440000,
    currency: 'INR',
    delivery_target: '2026-09-15',
    status: 'rejected' as const,
    ai_match_score: 91,
    created_at: '2026-09-08T11:00:00Z',
  },
];

// Realistic Commercial Orders
export const INITIAL_DEMO_ORDERS = [
  {
    id: 'order-8821',
    order_reference: '#CX-ORD-8821',
    bid_id: 'bid-101',
    listing_id: 'seller-ultratech',
    seller_id: 'seller-ultratech',
    seller_name: 'Rajesh K. Verma',
    seller_company: 'UltraTech Cement',
    buyer_id: 'buyer-ecobuild',
    buyer_name: 'Vikram Mehra',
    buyer_company: 'EcoBuild Materials',
    final_price_ton: 4800,
    quantity_tons: 150,
    total_value: 752000, // Includes logistics
    delivery_window: 'Target Date: 2026-09-18 • Slot: Morning (09:00 - 13:00)',
    order_status: 'processing' as const, // actively dispatching
    purity_percentage: 98.5,
    confirmed_at: '2026-09-11T16:00:00Z',
  },
  {
    id: 'order-7749',
    order_reference: '#CX-ORD-7749',
    bid_id: 'bid-104',
    listing_id: 'seller-ambuja',
    seller_id: 'seller-ambuja',
    seller_name: 'Suresh Singhania',
    seller_company: 'Ambuja Cement',
    buyer_id: 'buyer-carbonfuel',
    buyer_name: 'Dr. Rohan Deshmukh',
    buyer_company: 'CarbonFuel Labs',
    final_price_ton: 4500,
    quantity_tons: 80,
    total_value: 410000,
    delivery_window: 'Target Date: 2026-09-14 • ETA: 6 Hours (GJ-05-CX-412)',
    order_status: 'in_transit' as const,
    purity_percentage: 97.2,
    confirmed_at: '2026-09-10T12:00:00Z',
  },
  {
    id: 'order-6512',
    order_reference: '#CX-ORD-6512',
    bid_id: 'bid-prev-1',
    listing_id: 'seller-tatasteel',
    seller_id: 'seller-tatasteel',
    seller_name: 'Pradeep Patnaik',
    seller_company: 'Tata Steel',
    buyer_id: 'buyer-greengrow',
    buyer_name: 'Dr. Ananya Sengupta',
    buyer_company: 'GreenGrow Chemicals',
    final_price_ton: 3900,
    quantity_tons: 250,
    total_value: 1125000,
    delivery_window: 'Completed • Custody verified on 2026-09-09',
    order_status: 'completed' as const,
    purity_percentage: 94.8,
    confirmed_at: '2026-09-06T09:30:00Z',
  },
  {
    id: 'order-5190',
    order_reference: '#CX-ORD-5190',
    bid_id: 'bid-prev-2',
    listing_id: 'seller-jswsteel',
    seller_id: 'seller-jswsteel',
    seller_name: 'Amitabh Sen',
    seller_company: 'JSW Steel',
    buyer_id: 'buyer-ecobuild',
    buyer_name: 'Vikram Mehra',
    buyer_company: 'EcoBuild Materials',
    final_price_ton: 4200,
    quantity_tons: 120,
    total_value: 580000,
    delivery_window: 'Target Date: 2026-09-20 • Staged for Loading',
    order_status: 'confirmed' as const,
    purity_percentage: 96.0,
    confirmed_at: '2026-09-11T11:00:00Z',
  },
];

// Realistic Notifications
export const INITIAL_DEMO_NOTIFICATIONS: DemoNotification[] = [
  {
    id: 'notif-1',
    title: 'New bid received',
    message: 'EcoBuild Materials placed a purchase bid for 150 tons @ ₹4,800/ton',
    type: 'bid',
    timestamp: '12 mins ago',
    read: false,
    link: '/seller/bids',
  },
  {
    id: 'notif-2',
    title: 'Bid accepted',
    message: 'Tata Steel accepted bid for order #CX-ORD-6512 (250t @ ₹3,900/ton)',
    type: 'bid',
    timestamp: '1 hour ago',
    read: false,
    link: '/orders',
  },
  {
    id: 'notif-3',
    title: 'Listing published',
    message: 'UltraTech Cement published 350t Liquid CO₂ batch (98.5% purity) to marketplace',
    type: 'listing',
    timestamp: '3 hours ago',
    read: false,
    link: '/marketplace',
  },
  {
    id: 'notif-4',
    title: 'Order dispatched',
    message: 'Batch #CX-ORD-7749 (80t) is now en route via Cryo-Tanker GJ-05-CX-412',
    type: 'order',
    timestamp: '5 hours ago',
    read: true,
    link: '/orders',
  },
  {
    id: 'notif-5',
    title: 'Delivery completed',
    message: '250t industrial CO₂ successfully offloaded at GreenGrow Chemicals facility',
    type: 'delivery',
    timestamp: 'Yesterday',
    read: true,
    link: '/orders',
  },
];

// Aggregate Analytics
export const INITIAL_DEMO_ANALYTICS = {
  total_co2_traded_tons: 1470,
  total_revenue_inr: 6845000,
  average_ai_match: 92.8,
  active_industrial_partners: 7, // 4 Sellers + 3 Buyers
  monthly_listing_trend: [
    { month: 'Apr', volume: 180, revenue: 864000, capturedTons: 180, offTakenTons: 150 },
    { month: 'May', volume: 220, revenue: 1056000, capturedTons: 220, offTakenTons: 195 },
    { month: 'Jun', volume: 290, revenue: 1392000, capturedTons: 290, offTakenTons: 260 },
    { month: 'Jul', volume: 340, revenue: 1632000, capturedTons: 340, offTakenTons: 310 },
    { month: 'Aug', volume: 410, revenue: 1968000, capturedTons: 410, offTakenTons: 380 },
    { month: 'Sep', volume: 480, revenue: 2304000, capturedTons: 480, offTakenTons: 440 },
  ],
  storage_utilization: {
    current_stored_tons: 350,
    total_capacity_tons: 500,
    utilization_pct: 70,
  },
};
