import React from 'react';
import { Badge, type BadgeProps } from '@/components/ui/Badge';

export interface BidStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const BidStatusBadge: React.FC<BidStatusBadgeProps> = ({
  status,
  size = 'sm',
  className,
}) => {
  const normalized = status?.toLowerCase();

  let variant: BadgeProps['variant'] = 'neutral';
  let label = status;

  switch (normalized) {
    case 'pending':
      variant = 'warning';
      label = 'Pending Review';
      break;
    case 'accepted':
      variant = 'success';
      label = 'Accepted / Contracted';
      break;
    case 'rejected':
      variant = 'error';
      label = 'Declined';
      break;
    case 'expired':
      variant = 'neutral';
      label = 'Expired';
      break;
    default:
      variant = 'neutral';
      label = status;
  }

  return (
    <Badge variant={variant} size={size} dot className={className}>
      {label}
    </Badge>
  );
};

export default BidStatusBadge;
