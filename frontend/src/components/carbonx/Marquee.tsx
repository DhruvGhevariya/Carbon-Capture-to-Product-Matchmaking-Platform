import React from 'react';

interface MarqueeProps {
  items: string[];
  speed?: number;
  className?: string;
}

/**
 * Marquee — Continuous industrial intelligence ticker.
 * Pauses on hover, respects prefers-reduced-motion.
 */
export const Marquee: React.FC<MarqueeProps> = ({
  items,
  className = '',
}) => {
  return (
    <div className={`group relative flex overflow-hidden border-y border-[#222736] bg-[#090A0F]/60 py-2.5 backdrop-blur-md select-none ${className}`}>
      {/* Gradient Fades on edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-[#090A0F] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-[#090A0F] to-transparent" />

      <div className="flex shrink-0 gap-8 animate-marquee group-hover:[animation-play-state:paused]">
        {items.concat(items).map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF87] animate-pulse" />
            <span className="font-mono text-xs font-medium tracking-wider text-[#94A3B8] uppercase whitespace-nowrap">
              {item}
            </span>
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="flex shrink-0 gap-8 animate-marquee group-hover:[animation-play-state:paused]">
        {items.concat(items).map((item, index) => (
          <div key={`dup-${index}`} className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF87] animate-pulse" />
            <span className="font-mono text-xs font-medium tracking-wider text-[#94A3B8] uppercase whitespace-nowrap">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
