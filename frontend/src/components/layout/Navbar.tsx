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
  Sparkles,
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { GlobalSearchModal } from './GlobalSearchModal';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenCopilot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenCopilot }) => {
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

  // Set Dark Theme as Primary CarbonX Experience
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const handleRoleToggle = () => {
    if (!isAuthenticated || !role) return;
    const nextRole = role === 'seller' ? 'buyer' : 'seller';
    switchRole(nextRole);
    navigate(nextRole === 'seller' ? '/seller/dashboard' : '/marketplace');
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#222736] bg-[#090A0F]/90 px-4 backdrop-blur-md sm:px-6">
        {/* Left section */}
        <div className="flex items-center space-x-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="inline-flex items-center justify-center rounded-md p-2 text-[#94A3B8] hover:bg-[#181B26] hover:text-[#F8FAFC] focus:outline-none lg:hidden"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="flex items-center space-x-2">
            <span className="hidden font-mono text-[10px] font-bold uppercase tracking-wider text-[#64748B] sm:inline-block">
              PORTAL
            </span>
            <span className="hidden text-[#333B52] sm:inline-block">/</span>
            <div className={`flex items-center space-x-1.5 rounded-full border px-2.5 py-1 font-mono text-xs font-bold ${
              role === 'seller'
                ? 'border-[#00FF87]/30 bg-[#00FF87]/10 text-[#00FF87]'
                : 'border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF]'
            }`}>
              {role === 'seller' ? (
                <>
                  <Factory className="h-3.5 w-3.5 text-[#00FF87]" />
                  <span>EMITTER TERMINAL</span>
                </>
              ) : role === 'buyer' ? (
                <>
                  <Building2 className="h-3.5 w-3.5 text-[#00F0FF]" />
                  <span>OFF-TAKER TERMINAL</span>
                </>
              ) : (
                <span>ENTERPRISE PLATFORM</span>
              )}
            </div>
          </div>
        </div>

        {/* Middle section: Global Search Bar trigger */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            data-cursor="SEARCH"
            className="flex w-full items-center justify-between rounded-xl border border-[#222736] bg-[#12141C] px-3.5 py-1.5 font-sans text-xs text-[#94A3B8] transition hover:border-[#00FF87] hover:text-[#F8FAFC]"
          >
            <div className="flex items-center space-x-2">
              <Search className="h-3.5 w-3.5 text-[#00FF87]" />
              <span>Search CO₂ sources, sinks, match scores...</span>
            </div>
            <kbd className="inline-flex items-center rounded border border-[#333B52] bg-[#181B26] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#00FF87]">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right section: Persona switcher, Notifications, Copilot, User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="rounded-lg p-2 text-[#94A3B8] hover:bg-[#181B26] hover:text-[#F8FAFC] focus:outline-none md:hidden"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Role Quick-Switcher */}
          {isAuthenticated && role && (
            <button
              onClick={handleRoleToggle}
              type="button"
              data-cursor="SWITCH"
              title="Switch between Seller (Emitter) and Buyer (Off-Taker)"
              className="hidden lg:flex items-center space-x-1.5 rounded-lg border border-[#222736] bg-[#12141C] px-2.5 py-1.5 font-mono text-xs font-bold text-[#F8FAFC] transition hover:border-[#00FF87] hover:text-[#00FF87]"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-[#00FF87]" />
              <span>ROLE:</span>
              <strong className="capitalize text-[#00FF87]">{role}</strong>
            </button>
          )}

          {/* AI Copilot Quick Launcher */}
          {onOpenCopilot && (
            <button
              onClick={onOpenCopilot}
              type="button"
              data-cursor="COPILOT"
              className="inline-flex items-center space-x-1.5 rounded-xl border border-[#00FF87]/40 bg-[#00FF87]/10 px-3 py-1.5 font-mono text-xs font-bold text-[#00FF87] shadow-[0_0_15px_rgba(0,255,135,0.15)] hover:bg-[#00FF87] hover:text-[#090A0F] transition duration-200"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">COPILOT</span>
            </button>
          )}

          {/* Notification System Dropdown */}
          <NotificationDropdown />

          {/* User Profile */}
          <div className="relative border-l border-[#222736] pl-2 sm:pl-3" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center space-x-2 rounded-xl p-1 transition hover:bg-[#181B26] text-left focus:outline-none"
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00FF87] font-mono text-xs font-bold text-[#090A0F]">
                {user?.full_name ? user.full_name.charAt(0) : 'C'}
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-xs font-bold text-[#F8FAFC] truncate max-w-[110px]">
                  {user?.full_name || 'Carbon Operator'}
                </div>
                <div className="max-w-[110px] truncate font-mono text-[10px] text-[#94A3B8]">
                  {user?.company?.company_name || 'CarbonX OS'}
                </div>
              </div>
              <ChevronDown className="hidden sm:block h-3 w-3 text-[#64748B]" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[#222736] bg-[#12141C] p-3 shadow-floating z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center space-x-3 pb-3 border-b border-[#222736]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00FF87] font-mono text-sm font-bold text-[#090A0F]">
                    {user?.full_name ? user.full_name.charAt(0) : 'C'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#F8FAFC] truncate">{user?.full_name || 'User'}</p>
                    <p className="font-mono text-[10px] text-[#94A3B8] truncate">{user?.email || 'operator@carbonx.in'}</p>
                    <span className="inline-block mt-1 rounded bg-[#00FF87]/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#00FF87] border border-[#00FF87]/30 uppercase">
                      {role === 'seller' ? 'Point-Source Emitter' : 'CO2 Off-Taker'}
                    </span>
                  </div>
                </div>

                <div className="mt-2 space-y-1 font-sans">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleRoleToggle();
                    }}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-[#CBD5E1] hover:bg-[#181B26] hover:text-[#00FF87] transition"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowRightLeft className="h-3.5 w-3.5 text-[#00FF87]" />
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
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#FF4B4B] hover:bg-[#FF4B4B]/10 transition"
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

      {/* Global Command Center Dialog Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;
