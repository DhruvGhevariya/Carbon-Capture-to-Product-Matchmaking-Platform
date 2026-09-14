import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, DollarSign, Leaf, MapPin, Zap } from 'lucide-react';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
  className?: string;
}

/**
 * MatchScore — Animated visual hero match score with editorial contrast.
 */
export const MatchScore: React.FC<MatchScoreProps> = ({
  score,
  size = 'hero',
  showLabel = true,
  className = '',
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, score));
    const duration = 1000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const getSignalColor = (val: number) => {
    if (val >= 80) return 'text-[#E8FF47] border-[#E8FF47] bg-[#E8FF47]/10';
    if (val >= 60) return 'text-[#FF6B35] border-[#FF6B35] bg-[#FF6B35]/10';
    return 'text-[#FF4B4B] border-[#FF4B4B] bg-[#FF4B4B]/10';
  };

  if (size === 'hero') {
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        <div className="relative flex items-center justify-center">
          {/* Animated Glow Halo */}
          <div className="absolute -inset-4 rounded-full bg-[#E8FF47]/10 blur-xl animate-pulse-glow" />

          {/* Main Hero Number */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative flex h-36 w-36 items-center justify-center rounded-full border-2 border-[#E8FF47] bg-[#080812] shadow-[0_0_40px_rgba(232,255,71,0.2)]"
          >
            <div className="text-center">
              <span className="font-display text-5xl font-extrabold tracking-tight text-[#F0F0F8]">
                {displayScore}
              </span>
              <span className="font-display text-2xl font-bold text-[#E8FF47]">%</span>
            </div>
          </motion.div>
        </div>

        {showLabel && (
          <div className="mt-3 text-center">
            <span className="font-mono text-xs font-bold tracking-widest text-[#E8FF47] uppercase">
              COMPATIBILITY SCORE
            </span>
            <p className="font-mono text-[10px] text-[#9898B8] mt-0.5">ALGORITHMIC V1.8 VERIFIED</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`inline-flex h-9 px-3 items-center justify-center rounded border font-display text-base font-bold ${getSignalColor(score)}`}>
        {displayScore}%
      </span>
      {showLabel && (
        <span className="font-mono text-xs font-semibold text-[#94A3B8] uppercase">MATCH SCORE</span>
      )}
    </div>
  );
};

interface BreakdownItem {
  key: string;
  name: string;
  score: number;
  weight: string;
  icon: React.ElementType;
}

interface MatchScoreBreakdownProps {
  technicalScore?: number;
  economicScore?: number;
  environmentalScore?: number;
  geographicScore?: number;
  trlScore?: number;
}

export const MatchScoreBreakdown: React.FC<MatchScoreBreakdownProps> = ({
  technicalScore = 96,
  economicScore = 88,
  environmentalScore = 95,
  geographicScore = 92,
  trlScore = 90,
}) => {
  const items: BreakdownItem[] = [
    { key: 'tech', name: 'Technical & Purity Compatibility', score: technicalScore, weight: '35% Weight', icon: Cpu },
    { key: 'econ', name: 'Economic ROI & CAPEX/OPEX Fit', score: economicScore, weight: '25% Weight', icon: DollarSign },
    { key: 'env', name: 'Environmental & Permanence Impact', score: environmentalScore, weight: '20% Weight', icon: Leaf },
    { key: 'geo', name: 'Geographic Distance & Pipeline Access', score: geographicScore, weight: '10% Weight', icon: MapPin },
    { key: 'trl', name: 'TRL Technology Commercial Readiness', score: trlScore, weight: '10% Weight', icon: Zap },
  ];

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className="rounded-lg border border-[#222736] bg-[#090A0F]/90 p-3.5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#181B26] text-[#00FF87]">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-sans text-xs font-semibold text-[#F8FAFC]">{item.name}</span>
                  <span className="font-mono text-[10px] text-[#64748B] ml-2">({item.weight})</span>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-[#00FF87]">{item.score}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#181B26]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 0.6, delay: 0.2 + idx * 0.08 }}
                className="h-full bg-[#00FF87]"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
