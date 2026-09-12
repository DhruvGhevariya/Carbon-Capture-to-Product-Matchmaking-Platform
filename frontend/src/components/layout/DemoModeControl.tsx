import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoMode } from '@/context/DemoModeContext';
import { useAuth } from '@/hooks/useAuth';
import {
  RotateCcw,
  Factory,
  Building2,
  ChevronDown,
  Zap,
} from 'lucide-react';

export const DemoModeControl: React.FC = () => {
  const navigate = useNavigate();
  const { isDemoMode, toggleDemoMode, resetDemoData } = useDemoMode();
  const { role, login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleQuickLogin = (targetRole: 'seller' | 'buyer') => {
    if (targetRole === 'seller') {
      login('demo-seller-token', {
        id: 'user-ultratech',
        email: 'rajesh.verma@ultratech.com',
        full_name: 'Rajesh K. Verma',
        role: 'seller',
        company_id: 'seller-ultratech',
        company_name: 'UltraTech Cement',
        is_active: true,
        company: {
          id: 'seller-ultratech',
          company_name: 'UltraTech Cement',
          industry_type: 'Cement',
          location_name: 'Sanand Industrial Cluster, Ahmedabad, Gujarat',
          latitude: 22.9868,
          longitude: 72.3814,
        },
      });
      navigate('/seller/dashboard');
    } else {
      login('demo-buyer-token', {
        id: 'user-greengrow',
        email: 'ananya.s@greengrow.in',
        full_name: 'Dr. Ananya Sengupta',
        role: 'buyer',
        company_id: 'buyer-greengrow',
        company_name: 'GreenGrow Chemicals',
        is_active: true,
        company: {
          id: 'buyer-greengrow',
          company_name: 'GreenGrow Chemicals',
          industry_type: 'Agro-Chemicals & Bio-enrichment',
          location_name: 'Kheda Agri Park, Vadodara Hub, Gujarat',
          latitude: 22.3100,
          longitude: 73.1900,
        },
      });
      navigate('/marketplace');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Demo Pill Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center space-x-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
          isDemoMode
            ? 'border-black bg-black text-white shadow-sm hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black'
            : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
        }`}
        title="HackOut Judging Demo Mode Controls"
      >
        <span className="relative flex h-2 w-2">
          {isDemoMode && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isDemoMode ? 'bg-white' : 'bg-neutral-400'
            }`}
          ></span>
        </span>
        <span className="hidden sm:inline">Demo Mode:</span>
        <strong className="font-bold">{isDemoMode ? 'ON' : 'OFF'}</strong>
        <ChevronDown className="h-3 w-3" />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-neutral-300 bg-white p-3.5 shadow-floating dark:border-neutral-800 dark:bg-neutral-900 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-black dark:text-white" />
              <span className="text-xs font-bold text-black dark:text-white">
                HackOut Demo Control
              </span>
            </div>
            <button
              type="button"
              onClick={toggleDemoMode}
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border transition ${
                isDemoMode
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black'
                  : 'bg-neutral-100 text-neutral-800 border-neutral-300'
              }`}
            >
              {isDemoMode ? 'Active' : 'Disabled'}
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              Toggles verified Gujarat CCUS records (UltraTech, Ambuja, Tata, JSW), bypasses auth, and resets state.
            </p>

            {/* Reset Demo Data Button */}
            <button
              type="button"
              onClick={() => {
                resetDemoData();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-1.5 rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs font-bold text-black transition hover:bg-neutral-100 hover:border-black"
            >
              <RotateCcw className="h-3.5 w-3.5 text-black" />
              <span>Reset Demo with One Click</span>
            </button>

            {/* Quick Switch / Login Persona */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Switch Judging Persona
              </span>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('seller')}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center text-xs font-bold border transition ${
                    role === 'seller'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-emerald-50/50 hover:border-emerald-300'
                  }`}
                >
                  <Factory className={`h-4 w-4 mb-1 ${role === 'seller' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span className="text-[11px]">UltraTech</span>
                  <span className={`text-[9px] font-normal ${role === 'seller' ? 'text-emerald-700' : 'text-slate-400'}`}>Seller / Emitter</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('buyer')}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center text-xs font-bold border transition ${
                    role === 'buyer'
                      ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-blue-50/50 hover:border-blue-300'
                  }`}
                >
                  <Building2 className={`h-4 w-4 mb-1 ${role === 'buyer' ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className="text-[11px]">GreenGrow</span>
                  <span className={`text-[9px] font-normal ${role === 'buyer' ? 'text-blue-700' : 'text-slate-400'}`}>Buyer / Off-Taker</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
