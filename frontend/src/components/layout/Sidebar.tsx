import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
    { label: 'Create Batch Listing', to: '/seller/listings/new', icon: PlusCircle },
    { label: 'Storage Inventory', to: '/seller/listings', icon: Package },
    { label: 'Incoming Bids', to: '/seller/bids', icon: SlidersHorizontal, badge: 'Live' },
    { label: 'Commercial Orders', to: '/orders', icon: FileCheck2 },
  ];

  const buyerNavItems: NavItem[] = [
    { label: 'CO2 Stream Market', to: '/marketplace', icon: Layers },
    { label: 'AI Match Engine', to: '/ai/recommend', icon: Sparkles, badge: 'AI' },
    { label: 'Freight & Logistics', to: '/logistics', icon: Truck },
    { label: 'My Purchase Bids', to: '/bids', icon: SlidersHorizontal },
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
          'fixed inset-y-0 left-0 z-50 flex h-full w-64 shrink-0 flex-shrink-0 flex-col border-r border-neutral-300 bg-white transition-transform duration-200 ease-in-out dark:border-neutral-800 dark:bg-neutral-900 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm shadow-emerald-600/20">
              <span className="text-base font-black tracking-tight">CX</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  Carbon<span className="text-emerald-600">X</span>
                </span>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  MVP
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500">
                CCUS Value Exchange
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {role === 'seller' ? 'Point-Source Emitter' : 'CO2 Off-Taker'}
          </div>

          <nav className="space-y-1">
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
                  className={cn(
                    'group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all',
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 font-semibold shadow-xs border-r-2 border-emerald-600'
                      : 'text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-900'
                  )}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive
                          ? 'text-emerald-600'
                          : 'text-slate-400 group-hover:text-emerald-700'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                        item.badge === 'AI'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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
        <div className="shrink-0 border-t border-slate-200 p-3">
          <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-slate-50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-900">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Purity Verified</span>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                ISO 14064
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
              <span className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                <span>Platform Flow</span>
              </span>
              <span className="font-bold text-slate-900">1,470 t CO₂</span>
            </div>
          </div>

          <div className="mt-2 px-2 text-[10px] text-slate-400">
            <span>Enterprise Session • {user?.company?.company_name || 'CarbonX'}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
