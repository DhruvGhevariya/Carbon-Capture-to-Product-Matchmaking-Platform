import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-white px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
      {/* Main Auth Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center space-x-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white shadow-sm dark:bg-white dark:text-black">
              <span className="text-xl font-black tracking-tight">CX</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-black dark:text-white">
              Carbon<span className="text-black dark:text-white">X</span>
            </span>
          </div>

          <h2 className="mt-3 text-lg font-bold tracking-tight text-black dark:text-white">
            Industrial Terminal Login
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Transform Captured Carbon into Industrial Value
          </p>

          <div className="mt-2.5 flex items-center justify-center space-x-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-[10px] font-bold text-black dark:bg-neutral-900 dark:border-neutral-800 dark:text-white">
              <ShieldCheck className="h-3 w-3 text-black dark:text-white" />
              Verified CCUS Exchange
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-[10px] font-bold text-black dark:bg-neutral-900 dark:border-neutral-800 dark:text-white">
              <Sparkles className="h-3 w-3 text-black dark:text-white" />
              Deterministic AI
            </span>
          </div>
        </div>

        {/* Card Container */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-7 shadow-xl dark:border-neutral-800 dark:bg-black sm:p-8">
          {children}
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-neutral-400">
          Protected by AES-256 JWT Authentication & ISO 14064 Compliance
        </p>
      </div>
    </div>
  );
};
