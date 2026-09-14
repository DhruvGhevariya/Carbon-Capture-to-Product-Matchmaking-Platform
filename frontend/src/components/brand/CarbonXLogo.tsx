import React from 'react';

interface CarbonXLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const CarbonXLogo: React.FC<CarbonXLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizeClass =
    size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-11 w-11' : 'h-9 w-9';
  const textSizeClass =
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      {/* Refined Geometric Symbol: CO2 Circular Transformation Mark */}
      <div
        className={`relative flex ${iconSizeClass} shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 shadow-md shadow-emerald-950/20 border border-emerald-500/30`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-emerald-400"
        >
          {/* Outer Transformation Nodes */}
          <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.4" />
          
          {/* Diamond CO2 Core */}
          <path
            d="M16 6L24 16L16 26L8 16L16 6Z"
            stroke="url(#emeraldGradient)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          
          {/* Inner Circular Exchange */}
          <circle cx="16" cy="16" r="3.5" fill="#10B981" />
          
          <defs>
            <linearGradient id="emeraldGradient" x1="8" y1="6" x2="24" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981" />
              <stop offset="1" stopColor="#0D9488" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5 leading-none">
            <span className={`${textSizeClass} font-extrabold tracking-tight text-slate-900 dark:text-white`}>
              Carbon<span className="text-emerald-600 dark:text-emerald-400">X</span>
            </span>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide uppercase text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              Platform
            </span>
          </div>
          <span className="mt-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
            Industrial CCUS Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
