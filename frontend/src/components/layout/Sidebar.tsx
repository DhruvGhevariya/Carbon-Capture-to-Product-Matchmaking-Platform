import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CarbonXLogo } from '@/components/brand/CarbonXLogo';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Layers,
  Sparkles,
  Truck,
  FileCheck2,
  SlidersHorizontal,
  X,
  ShieldCheck,
  TrendingUp,
  Beaker,
  Calculator,
  FolderKanban,
} from 'lucide-react';
import { cn } from '@/lib/utils';


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, user } = useAuth();
  const location = useLocation();

  const sellerNavItems: NavItem[] = [
    { label: 'Plant Dashboard', to: '/seller/dashboard', icon: LayoutDashboard },
    { label: 'CO2 Stream Discovery', to: '/discovery', icon: Beaker, badge: 'New' },
    { label: 'Create Batch Listing', to: '/seller/listings/new', icon: PlusCircle },
    { label: 'Storage Inventory', to: '/seller/listings', icon: Package },
    { label: 'Carbon Intelligence', to: '/intelligence', icon: Calculator, badge: 'ISO' },
    { label: 'Incoming Bids', to: '/seller/bids', icon: SlidersHorizontal, badge: 'Live' },
    { label: 'Joint Ventures', to: '/projects', icon: FolderKanban },
    { label: 'Commercial Orders', to: '/orders', icon: FileCheck2 },
  ];

  const buyerNavItems: NavItem[] = [
    { label: 'CO2 Stream Market', to: '/marketplace', icon: Layers },
    { label: 'Stream Discovery', to: '/discovery', icon: Beaker },
    { label: 'AI Match Engine', to: '/ai/recommend', icon: Sparkles, badge: 'AI' },
    { label: 'Carbon Intelligence', to: '/intelligence', icon: Calculator, badge: 'ISO' },
    { label: 'Freight & Logistics', to: '/logistics', icon: Truck },
    { label: 'My Purchase Bids', to: '/bids', icon: SlidersHorizontal },
    { label: 'Joint Ventures', to: '/projects', icon: FolderKanban },
    { label: 'Fulfillment Orders', to: '/orders', icon: FileCheck2 },
  ];

  const navItems = role === 'seller' ? sellerNavItems : buyerNavItems;


  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop static / Mobile drawer sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-64 shrink-0 flex-shrink-0 flex-col border-r border-[#222736] bg-[#090A0F] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#222736] px-5">
          <CarbonXLogo size="md" />

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#181B26] hover:text-[#F8FAFC] lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            {role === 'seller' ? 'POINT-SOURCE EMITTER' : 'CO2 OFF-TAKER'}
          </div>

          <nav className="space-y-1 font-sans">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              const isExact = location.pathname === item.to;
              const isSubpath = location.pathname.startsWith(`${item.to}/`);
              const hasMoreSpecificItem = navItems.some(
                (sibling) =>
                  sibling.to !== item.to &&
                  sibling.to.startsWith(item.to) &&
                  (location.pathname === sibling.to || location.pathname.startsWith(`${sibling.to}/`))
              );
              const isActive = isExact || (isSubpath && !hasMoreSpecificItem);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose()}
                  data-cursor={isActive ? undefined : 'NAVIGATE'}
                  className={cn(
                    'group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200',
                    isActive
                      ? 'bg-[#12141C] text-[#00FF87] font-semibold border-r-2 border-[#00FF87] shadow-[0_0_15px_rgba(0,255,135,0.15)]'
                      : 'text-[#94A3B8] hover:bg-[#181B26] hover:text-[#F8FAFC]'
                  )}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive
                          ? 'text-[#00FF87]'
                          : 'text-[#64748B] group-hover:text-[#F8FAFC]'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase',
                        item.badge === 'AI'
                          ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30'
                          : isActive
                          ? 'bg-[#00FF87]/20 text-[#00FF87]'
                          : 'bg-[#181B26] text-[#94A3B8] border border-[#222736]'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Operational Footer Widget */}
        <div className="shrink-0 border-t border-[#222736] p-3">
          <div className="rounded-xl border border-[#222736] bg-[#12141C] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 font-mono text-xs font-semibold text-[#00FF87]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#00FF87]" />
                <span>SPECTRA VERIFIED</span>
              </div>
              <span className="inline-flex items-center rounded bg-[#00FF87]/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#00FF87] border border-[#00FF87]/30">
                ISO 14064
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-[#94A3B8]">
              <span className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-[#00FF87]" />
                <span>PLATFORM FLOW</span>
              </span>
              <span className="font-bold text-[#F8FAFC]">14,820 t CO₂</span>
            </div>
          </div>

          <div className="mt-2 px-2 font-mono text-[9px] text-[#64748B]">
            <span>SESSION · {user?.company?.company_name || 'CarbonX OS'}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
