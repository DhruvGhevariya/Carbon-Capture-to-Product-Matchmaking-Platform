import React from 'react';

interface TechnicalGridProps {
  dense?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * TechnicalGrid — Subtle low-opacity background grid lines giving an industrial instrumentation feel.
 */
export const TechnicalGrid: React.FC<TechnicalGridProps> = ({
  dense = false,
  className = '',
  children,
}) => {
  return (
    <div
      className={`relative ${
        dense ? 'bg-tech-grid-dense' : 'bg-tech-grid'
      } ${className}`}
    >
      {/* Corner crosshair ticks */}
      <div aria-hidden="true" className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#00FF87]/30 pointer-events-none" />
      <div aria-hidden="true" className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#00FF87]/30 pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#00FF87]/30 pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#00FF87]/30 pointer-events-none" />
      {children}
    </div>
  );
};
