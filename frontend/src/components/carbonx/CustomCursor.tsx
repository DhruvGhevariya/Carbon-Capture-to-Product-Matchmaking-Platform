import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

/**
 * CustomCursor — Refined contextual desktop cursor inspired by Nexus Studio.
 * Disabled on touch screens, mobile viewports, or reduced-motion preferences.
 */
export const CustomCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isMagnetic, setIsMagnetic] = useState(false);

  const cursorX = useSpring(0, { damping: 28, stiffness: 350 });
  const cursorY = useSpring(0, { damping: 28, stiffness: 350 });

  useEffect(() => {
    // Media check: desktop non-touch with standard motion preference
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 1024;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || isSmallScreen || prefersReducedMotion) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Check hovered element for cursor attributes
      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest('[data-cursor], button, a, input, select') as HTMLElement | null;

      if (interactiveEl) {
        setIsHovered(true);
        const text = interactiveEl.getAttribute('data-cursor');
        setCursorText(text || '');
        setIsMagnetic(interactiveEl.hasAttribute('data-magnetic'));
      } else {
        setIsHovered(false);
        setCursorText('');
        setIsMagnetic(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [cursorX, cursorY]);

  if (!isEnabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Precision Center Dot */}
      <motion.div
        className="fixed top-0 left-0 h-2 w-2 rounded-full bg-[#E8FF47] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Interactive Outer Ring */}
      <motion.div
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full border border-[#E8FF47]/60 bg-[#E8FF47]/10 backdrop-blur-[1px] transition-all duration-200 ${
          isHovered ? 'h-10 w-10 border-[#E8FF47]' : 'h-6 w-6'
        } ${isMagnetic ? 'scale-125 border-[#FF6B35] bg-[#FF6B35]/20' : ''}`}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {cursorText && (
          <span className="font-mono text-[9px] font-bold tracking-widest text-[#E8FF47] uppercase">
            {cursorText}
          </span>
        )}
      </motion.div>
    </div>
  );
};
