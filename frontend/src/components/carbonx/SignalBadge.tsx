import React from 'react';

export type SignalType = 'ACTIVE' | 'OPTIMAL' | 'PENDING' | 'WARNING' | 'ALERT';

interface SignalBadgeProps {
  type: SignalType;
  label?: string;
  className?: string;
}

export const SignalBadge: React.FC<SignalBadgeProps> = ({
  type = 'ACTIVE',
  label,
  className = '',
}) => {
  const styles: Record<SignalType, { text: string; bg: string; dot: string }> = {
    ACTIVE: { text: 'text-[#00FF87]', bg: 'bg-[#00FF87]/10 border-[#00FF87]/30', dot: 'bg-[#00FF87]' },
    OPTIMAL: { text: 'text-[#00F0FF]', bg: 'bg-[#00F0FF]/10 border-[#00F0FF]/30', dot: 'bg-[#00F0FF]' },
    PENDING: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10 border-[#FF9F1C]/30', dot: 'bg-[#FF9F1C]' },
    WARNING: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10 border-[#FF9F1C]/30', dot: 'bg-[#FF9F1C]' },
    ALERT: { text: 'text-[#FF4B4B]', bg: 'bg-[#FF4B4B]/10 border-[#FF4B4B]/30', dot: 'bg-[#FF4B4B]' },
  };

  const style = styles[type] || styles.ACTIVE;
  const textLabel = label || type;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase ${style.text} ${style.bg} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot} animate-pulse`} />
      {textLabel}
    </span>
  );
};
