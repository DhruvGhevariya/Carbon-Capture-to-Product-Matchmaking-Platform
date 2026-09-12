import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowRightLeft,
  Factory,
  Building2,
  Menu,
  Search,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { GlobalSearchModal } from './GlobalSearchModal';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, role, switchRole, isAuthenticated, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Enforce Light Theme only
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRoleToggle = () => {
    if (!isAuthenticated || !role) return;
    const nextRole = role === 'seller' ? 'buyer' : 'seller';
    switchRole(nextRole);
    navigate(nextRole === 'seller' ? '/seller/dashboard' : '/marketplace');
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white/95 px-4 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90 sm:px-6">
        {/* Left section */}
        <div className="flex items-center space-x-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100 hover:text-black focus:outline-none dark:text-neutral-300 dark:hover:bg-neutral-800 lg:hidden"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="flex items-center space-x-2">
            <span className="hidden text-xs font-semibold uppercase tracking-wider text-neutral-400 sm:inline-block">
              Portal
            </span>
            <span className="hidden text-neutral-300 sm:inline-block">/</span>
            <div className={`flex items-center space-x-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${
              role === 'seller'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-blue-200 bg-blue-50 text-blue-800'
            }`}>
              {role === 'seller' ? (
                <>
                  <Factory className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Emitter Terminal</span>
                </>
              ) : role === 'buyer' ? (
                <>
                  <Building2 className="h-3.5 w-3.5 text-blue-600" />
                  <span>Off-Taker Terminal</span>
                </>
              ) : (
                <span>Enterprise Platform</span>
              )}
            </div>
          </div>
        </div>

        {/* Middle section: Global Search Bar trigger */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-600 transition hover:border-emerald-400 hover:bg-white hover:text-slate-900"
          >
            <div className="flex items-center space-x-2">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span>Search suppliers by company, city, industry...</span>
            </div>
            <kbd className="inline-flex items-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-700 shadow-xs">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right section: Demo Mode Pill, Persona switcher, Theme toggle, Notifications, User Badge */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile search button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none md:hidden"
            aria-label="Search suppliers"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Role Quick-Switcher */}
          {isAuthenticated && role && (
            <button
              onClick={handleRoleToggle}
              type="button"
              title="Switch between Seller (Emitter) and Buyer (Off-Taker)"
              className="hidden lg:flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-emerald-600" />
              <span>Role:</span>
              <strong className="capitalize underline decoration-emerald-500">{role}</strong>
            </button>
          )}

          {/* Notification System Dropdown */}
          <NotificationDropdown />

          {/* User profile interactive dropdown */}
          <div className="relative border-l border-slate-200 pl-2 sm:pl-3" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center space-x-2 rounded-xl p-1 transition hover:bg-slate-100 text-left focus:outline-none"
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white shadow-xs">
                {user?.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                  {user?.full_name || 'Guest User'}
                </div>
                <div className="max-w-[110px] truncate text-[10px] text-slate-500 font-medium">
                  {user?.company?.company_name || 'CarbonX'}
                </div>
              </div>
              <ChevronDown className="hidden sm:block h-3 w-3 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white shadow-xs">
                    {user?.full_name ? user.full_name.charAt(0) : 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.full_name || 'User'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email || 'user@carbonx.in'}</p>
                    <span className="inline-block mt-0.5 rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 border border-emerald-200 uppercase">
                      {role === 'seller' ? 'Point-Source Emitter' : 'CO2 Off-Taker'}
                    </span>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleRoleToggle();
                    }}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowRightLeft className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Switch to {role === 'seller' ? 'Buyer Terminal' : 'Emitter Terminal'}</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;
