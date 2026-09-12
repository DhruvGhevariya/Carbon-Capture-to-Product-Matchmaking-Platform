import React from 'react';
import { cn } from '@/lib/utils';
import { Gauge, Sparkles, Check } from 'lucide-react';

export interface PuritySliderProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const PRESET_PURITIES = [
  { label: '85.0% Flue Gas', value: 85.0 },
  { label: '92.5% Industrial', value: 92.5 },
  { label: '95.0% Chemical', value: 95.0 },
  { label: '98.5% High Purity', value: 98.5 },
  { label: '99.9% Food Grade', value: 99.9 },
];

export const PuritySlider: React.FC<PuritySliderProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  min = 80.0,
  max = 99.9,
  step = 0.1,
  className,
}) => {
  const percentage = Math.min(Math.max(Number(value) || min, min), max);

  // Grade categorization
  const getGradeInfo = (purity: number) => {
    if (purity >= 99.5) {
      return {
        label: 'ISBT Food & Beverage Grade',
        color: 'text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700',
        note: 'Suitable for food packaging, carbonated drinks, and pharma synthesis.',
      };
    }
    if (purity >= 95.0) {
      return {
        label: 'Chemical & Technology Grade',
        color: 'text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700',
        note: 'Ideal for e-fuels, enhanced oil recovery (EOR), and mineral carbonation.',
      };
    }
    if (purity >= 90.0) {
      return {
        label: 'Standard Industrial Grade',
        color: 'text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700',
        note: 'Commonly used for concrete curing, greenhouse enrichment, and water treatment.',
      };
    }
    return {
      label: 'Raw Flue Gas Capture',
      color: 'text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700',
      note: 'Secondary refinement or localized sequestration required.',
    };
  };

  const grade = getGradeInfo(percentage);

  // Calculate percentage along slider track for visual gradient
  const progressPercent = ((percentage - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-1.5 text-xs font-semibold text-black dark:text-white">
          <Gauge className="h-3.5 w-3.5 text-black dark:text-white" />
          <span>CO₂ Stream Purity (%)</span>
        </label>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm font-black text-black dark:text-white">
            {percentage.toFixed(1)}%
          </span>
          <span
            className={cn(
              'rounded-full border px-2 py-0.5 text-[10px] font-bold transition-colors',
              grade.color
            )}
          >
            {grade.label}
          </span>
        </div>
      </div>

      {/* Slider Track and Input */}
      <div className="relative py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={percentage}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            background: `linear-gradient(to right, #000000 0%, #000000 ${progressPercent}%, #E5E7EB ${progressPercent}%, #E5E7EB 100%)`,
          }}
          className={cn(
            'h-2.5 w-full cursor-pointer appearance-none rounded-lg accent-black transition-all focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-white',
            error && 'ring-2 ring-black'
          )}
        />
        <div className="mt-1 flex justify-between text-[10px] text-neutral-500">
          <span>{min.toFixed(1)}% (Industrial Min)</span>
          <span>90.0%</span>
          <span>95.0%</span>
          <span>{max.toFixed(1)}% (Ultra Pure)</span>
        </div>
      </div>

      {/* Quality Context Note */}
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-[11px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <div className="flex items-start space-x-1.5">
          <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-black dark:text-white" />
          <span>{grade.note}</span>
        </div>
      </div>

      {/* Preset Quick-Select Chips */}
      <div className="space-y-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          Market Industry Presets
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_PURITIES.map((preset) => {
            const isSelected = Math.abs(percentage - preset.value) < 0.05;
            return (
              <button
                key={preset.value}
                type="button"
                disabled={disabled}
                onClick={() => onChange(preset.value)}
                className={cn(
                  'inline-flex items-center space-x-1 rounded-md px-2 py-1 text-[11px] font-bold transition-all',
                  isSelected
                    ? 'border border-black bg-black text-white shadow-sm dark:border-white dark:bg-white dark:text-black'
                    : 'border border-neutral-200 bg-white text-neutral-600 hover:border-black hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300'
                )}
              >
                {isSelected && <Check className="h-3 w-3 text-white dark:text-black" />}
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="text-[11px] font-medium text-error-600 dark:text-error-400">{error}</p>
      )}
    </div>
  );
};

export default PuritySlider;
