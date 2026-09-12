import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useDemoMode } from '@/context/DemoModeContext';
import { formatINR, formatNumber } from '@/lib/utils';
import {
  Search,
  X,
  MapPin,
  Factory,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { sellers } = useDemoMode();
  const [query, setQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndustry('All');
    }
  }, [isOpen]);

  const industries = ['All', 'Cement', 'Steel', 'Ahmedabad', 'Surat', 'Jamnagar', 'Vadodara'];

  const filteredSuppliers = useMemo(() => {
    return sellers.filter((seller) => {
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        seller.company_name.toLowerCase().includes(q) ||
        seller.city.toLowerCase().includes(q) ||
        seller.location_name.toLowerCase().includes(q) ||
        seller.industry_type.toLowerCase().includes(q);

      const matchesChip =
        selectedIndustry === 'All' ||
        seller.industry_type.toLowerCase() === selectedIndustry.toLowerCase() ||
        seller.city.toLowerCase() === selectedIndustry.toLowerCase();

      return matchesQuery && matchesChip;
    });
  }, [sellers, query, selectedIndustry]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && filteredSuppliers.length > 0) {
        handleSelectSupplier(filteredSuppliers[0].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredSuppliers]);

  const handleSelectSupplier = (sellerId: string) => {
    onClose();
    navigate(`/marketplace/${sellerId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24"
          role="dialog"
          aria-modal="true"
          aria-label="Global Search Modal"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="flex items-center border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <Search className="h-5 w-5 text-emerald-600 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search suppliers by company, city (Ahmedabad, Surat...), or industry..."
                aria-label="Search query"
                className="w-full border-none bg-transparent px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-slate-100"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear query"
                  className="mr-2 rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                ESC
              </kbd>
            </div>

            {/* Filter Quick Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto border-b border-slate-100 bg-slate-50/80 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="h-3 w-3 text-slate-400" />
                Filter:
              </span>
              {industries.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSelectedIndustry(chip)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition border ${
                    selectedIndustry === chip
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-3 space-y-2">
              {filteredSuppliers.length === 0 ? (
                <div className="py-12 text-center">
                  <Factory className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
                  <p className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    No verified suppliers found
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Try searching for "UltraTech", "Cement", "Surat", or "Tata Steel"
                  </p>
                </div>
              ) : (
                filteredSuppliers.map((seller) => (
                  <div
                    key={seller.id}
                    onClick={() => handleSelectSupplier(seller.id)}
                    className="group flex items-center justify-between rounded-xl border border-slate-100 p-3 transition cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/40 dark:border-slate-800 dark:hover:border-emerald-900/50 dark:hover:bg-emerald-950/20"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                        <Factory className="h-4 w-4" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700 group-hover:underline dark:text-slate-200 dark:group-hover:text-emerald-400">
                            {seller.company_name}
                          </span>
                          {seller.verified && (
                            <span className="inline-flex items-center space-x-0.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400">
                              <ShieldCheck className="h-3 w-3 text-emerald-600" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {seller.city}, Gujarat
                          </span>
                          <span>•</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                            {seller.industry_type}
                          </span>
                          <span>•</span>
                          <span>Purity: <strong className="text-slate-700 dark:text-slate-300">{seller.purity_percentage}%</strong></span>
                          <span>•</span>
                          <span>Vol: <strong className="text-slate-700 dark:text-slate-300">{formatNumber(seller.volume_metric_tons)} t</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0 pl-3">
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {formatINR(seller.reserve_price_ton)}/t
                        </div>
                        <div className="flex items-center justify-end space-x-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <Sparkles className="h-3 w-3" />
                          <span>{seller.ai_match_score}/100 Match</span>
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition" />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="flex items-center gap-2">
                <span>Instant index across sellers & hubs</span>
                <span className="hidden sm:inline text-slate-400">• Press <kbd className="px-1 py-0.5 rounded bg-slate-200/70 text-[9px] font-mono text-slate-600">↵</kbd> to open top match</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/marketplace');
                }}
                className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 dark:text-emerald-400"
              >
                <span>View Full Marketplace</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

