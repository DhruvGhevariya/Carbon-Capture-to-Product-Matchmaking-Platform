import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Clock, Truck, Package, ShieldCheck, Factory, MapPin } from 'lucide-react';

export type OrderStage = 'confirmed' | 'processing' | 'dispatch' | 'in_transit' | 'delivered';

export interface OrderTimelineProps {
  currentStage: string;
  className?: string;
}

interface StageDefinition {
  id: OrderStage;
  label: string;
  description: string;
  icon: React.ElementType;
}

const STAGES: StageDefinition[] = [
  {
    id: 'confirmed',
    label: 'Confirmed',
    description: 'Contract legally executed & volume reserved',
    icon: ShieldCheck,
  },
  {
    id: 'processing',
    label: 'Processing',
    description: 'Cryogenic liquefaction & quality assay verified',
    icon: Factory,
  },
  {
    id: 'dispatch',
    label: 'Dispatch',
    description: 'Tanker loaded & terminal gate cleared',
    icon: Package,
  },
  {
    id: 'in_transit',
    label: 'In Transit',
    description: 'En-route with live pressure & temperature telemetry',
    icon: Truck,
  },
  {
    id: 'delivered',
    label: 'Delivered',
    description: 'Safely transferred to off-taker storage tank',
    icon: MapPin,
  },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  currentStage,
  className,
}) => {
  // Normalize stage matching
  const normalizedStage = (currentStage?.toLowerCase() || 'confirmed') as OrderStage;

  // Map backend statuses to timeline index
  const getStageIndex = (stage: string): number => {
    switch (stage) {
      case 'confirmed':
        return 0;
      case 'processing':
        return 1;
      case 'dispatch':
        return 2;
      case 'in_transit':
        return 3;
      case 'delivered':
      case 'completed':
        return 4;
      default:
        return 0;
    }
  };

  const activeIndex = getStageIndex(normalizedStage);

  return (
    <div className={cn('w-full py-3', className)}>
      <div className="relative flex flex-col md:flex-row justify-between">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isPending = idx > activeIndex;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className="relative flex flex-1 items-start md:items-center md:flex-col text-left md:text-center pb-6 md:pb-0 group"
            >
              {/* Connecting line for desktop */}
              {idx > 0 && (
                <div
                  className={cn(
                    'hidden md:block absolute top-4 -left-1/2 w-full h-[2px] transition-colors duration-300',
                    idx <= activeIndex
                      ? 'bg-black dark:bg-white'
                      : 'bg-neutral-200 dark:bg-neutral-800'
                  )}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Connecting line for mobile */}
              {idx < STAGES.length - 1 && (
                <div
                  className={cn(
                    'md:hidden absolute left-4 top-8 w-[2px] h-full -ml-[1px] transition-colors duration-300',
                    idx < activeIndex
                      ? 'bg-black dark:bg-white'
                      : 'bg-neutral-200 dark:bg-neutral-800'
                  )}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Step Circle Icon */}
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                  isCompleted &&
                    'border-black bg-black text-white shadow-sm dark:border-white dark:bg-white dark:text-black',
                  isCurrent &&
                    'border-black bg-white text-black ring-4 ring-neutral-200 dark:border-white dark:bg-black dark:text-white dark:ring-neutral-800',
                  isPending &&
                    'border-neutral-300 bg-white text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-600'
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Clock className="h-4 w-4 animate-pulse" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
              </div>

              {/* Text Info */}
              <div className="ml-3.5 md:ml-0 md:mt-2.5 space-y-0.5 max-w-[150px]">
                <p
                  className={cn(
                    'text-xs font-bold transition-colors',
                    isCompleted && 'text-black dark:text-white',
                    isCurrent && 'text-black dark:text-white font-extrabold',
                    isPending && 'text-neutral-400 dark:text-neutral-500'
                  )}
                >
                  {stage.label}
                </p>
                <p className="text-[10px] leading-snug text-neutral-500 dark:text-neutral-400 hidden sm:block">
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
