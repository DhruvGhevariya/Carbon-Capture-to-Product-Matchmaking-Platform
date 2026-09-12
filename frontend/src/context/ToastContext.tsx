import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, type, duration = 4500 }: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, title, description, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => {
      showToast({ title, description, type: 'success' });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      showToast({ title, description, type: 'error', duration: 6000 });
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, description?: string) => {
      showToast({ title, description, type: 'warning' });
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, description?: string) => {
      showToast({ title, description, type: 'info' });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}

      {/* Floating Toast Viewport - Top Right Position */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col space-y-2.5 sm:top-6 sm:right-6 max-w-sm w-full"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            return (
              <motion.div
                key={toast.id}
                role="alert"
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex w-full items-start space-x-3 rounded-xl border p-4 shadow-floating backdrop-blur-md ${
                  toast.type === 'success'
                    ? 'border-emerald-200 bg-white/95 text-emerald-950'
                    : toast.type === 'error'
                    ? 'border-red-200 bg-white/95 text-red-950'
                    : toast.type === 'warning'
                    ? 'border-amber-200 bg-white/95 text-amber-950'
                    : 'border-blue-200 bg-white/95 text-blue-950'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {toast.type === 'success' && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  )}
                  {toast.type === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  {toast.type === 'warning' && (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  )}
                  {toast.type === 'info' && (
                    <Info className="h-5 w-5 text-blue-600" />
                  )}
                </div>

                <div className="flex-1 space-y-0.5">
                  <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
                  {toast.description && (
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      {toast.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 rounded p-1 text-slate-400 hover:text-slate-700 transition"
                  aria-label="Dismiss toast"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
