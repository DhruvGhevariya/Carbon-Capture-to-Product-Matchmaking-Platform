import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Flame, Factory, Cpu, Layers, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled outside or state update
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const quickActions = [
    {
      id: 'add-source',
      title: 'Register CO₂ Emitter Source',
      subtitle: 'Add industrial emissions specs, stack temp & purity data',
      category: 'Seller Action',
      icon: Flame,
      path: '/seller/sources/new',
      badge: 'SELLER',
    },
    {
      id: 'create-match',
      title: 'Run Algorithmic Matchmaker',
      subtitle: 'Calculate compatibility score against active utilization sinks',
      category: 'Intelligence',
      icon: Sparkles,
      path: '/discovery',
      badge: 'AI MATCH',
    },
    {
      id: 'add-sink',
      title: 'Create Product Sink Listing',
      subtitle: 'Publish feedstock specification for synthetic fuels, concrete or polymers',
      category: 'Buyer Action',
      icon: Factory,
      path: '/buyer/sinks/new',
      badge: 'BUYER',
    },
    {
      id: 'explore-tech',
      title: 'Browse CCUS Technologies & Pathways',
      subtitle: 'Inspect TRL 1-9 direct air capture, point-source & mineralization tech',
      category: 'Database',
      icon: Cpu,
      path: '/technologies-products-pathways',
      badge: 'TECH DB',
    },
    {
      id: 'copilot',
      title: 'Ask CarbonX Intelligence Copilot',
      subtitle: 'Run natural language queries on thermodynamic feasibility & carbon markets',
      category: 'AI Assistant',
      icon: Layers,
      path: '/copilot',
      badge: 'COPILOT',
    },
  ];

  const filteredActions = quickActions.filter(
    (action) =>
      action.title.toLowerCase().includes(query.toLowerCase()) ||
      action.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      action.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#090A0F]/80 backdrop-blur-md"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-[#333B52] bg-[#12141C] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 border-b border-[#222736] px-4 py-3.5">
              <Search className="h-5 w-5 text-[#00FF87]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search (e.g. CO2 Emitter, Match score, Mineralization)..."
                className="w-full bg-transparent font-sans text-sm text-[#F8FAFC] placeholder-[#64748B] outline-none"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="rounded p-1 text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-[#333B52] bg-[#181B26] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#94A3B8]">
                ESC
              </kbd>
            </div>

            {/* Results Body */}
            <div className="max-h-96 overflow-y-auto p-2">
              <div className="px-3 py-1.5 font-mono text-[10px] font-semibold tracking-wider text-[#64748B] uppercase">
                Global Operations & Command Palette
              </div>

              {filteredActions.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-sans text-sm text-[#94A3B8]">No matching platform commands found.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleSelect(action.path)}
                        data-cursor="OPEN"
                        className="group flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-[#181B26]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#222736] bg-[#090A0F] text-[#00FF87] group-hover:border-[#00FF87]/50">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-sans text-sm font-semibold text-[#F8FAFC] group-hover:text-[#00FF87]">
                                {action.title}
                              </span>
                              <span className="rounded bg-[#00FF87]/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#00FF87]">
                                {action.badge}
                              </span>
                            </div>
                            <p className="font-sans text-xs text-[#94A3B8]">{action.subtitle}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#64748B] opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-[#00FF87]" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-[#222736] bg-[#090A0F]/80 px-4 py-2.5 font-mono text-[11px] text-[#64748B]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#00FF87]" />
                <span>CARBONX-SYSTEM v1.8 · ENCRYPTED TELEMETRY</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Navigate: <kbd className="text-[#94A3B8]">↑↓</kbd></span>
                <span>Select: <kbd className="text-[#94A3B8]">⏎</kbd></span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
