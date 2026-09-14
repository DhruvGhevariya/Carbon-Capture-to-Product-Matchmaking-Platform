import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'data-cursor'?: string;
}

/**
 * MagneticButton — Subtle magnetic interaction CTA inspired by Nexus Studio.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
  type = 'button',
  'data-cursor': dataCursor = 'CLICK',
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    // Small magnetic pull range (max 6px)
    const distanceX = (e.clientX - centerX) * 0.18;
    const distanceY = (e.clientY - centerY) * 0.18;
    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantStyles = {
    primary:
      'bg-[#E8FF47] text-[#04040A] font-bold shadow-[0_0_20px_rgba(232,255,71,0.25)] hover:shadow-[0_0_30px_rgba(232,255,71,0.45)] hover:bg-[#F3FF7A]',
    secondary:
      'bg-[#FF6B35] text-[#04040A] font-bold shadow-[0_0_20px_rgba(255,107,53,0.25)] hover:shadow-[0_0_30px_rgba(255,107,53,0.45)] hover:bg-[#FF8559]',
    outline:
      'border border-[#12122E] bg-[#080812] text-[#F0F0F8] hover:border-[#E8FF47] hover:text-[#E8FF47]',
    ghost:
      'bg-transparent text-[#9898B8] hover:text-[#F0F0F8] hover:bg-[#0D0D1F]',
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.5 }}
      data-cursor={dataCursor}
      data-magnetic="true"
      className={`relative inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-sans tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};
