import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PuritySlider } from './PuritySlider';
import { AvailabilityDatePicker } from './AvailabilityDatePicker';
import {
  Factory,
  Box,
  IndianRupee,
  MapPin,
  FileText,
  Send,
  RotateCcw,
} from 'lucide-react';

export const listingFormSchema = z
  .object({
    purity_percentage: z
      .number()
      .min(80.0, 'Purity must be at least 80.0%')
      .max(99.9, 'Purity cannot exceed 99.9%'),
    volume_metric_tons: z
      .number()
      .gt(0, 'Quantity must be greater than 0 metric tons'),
    reserve_price_ton: z
      .number()
      .gt(0, 'Reserve price must be greater than ₹0/ton'),
    physical_state: z.enum(['liquid', 'pressurized_gas'] as const, {
      message: 'Please select a physical phase',
    }),
    location: z.string().optional(),
    available_from: z.string().min(1, 'Available From date is required'),
    available_until: z.string().min(1, 'Available Until date is required'),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.available_from || !data.available_until) return true;
      return new Date(data.available_until) >= new Date(data.available_from);
    },
    {
      message: 'Expiration date must be on or after dispatch start date',
      path: ['available_until'],
    }
  );

export type ListingFormValues = z.infer<typeof listingFormSchema>;

export interface ListingFormProps {
  initialCompanyLocation?: string;
  initialCompanyName?: string;
  onSubmit: (values: ListingFormValues) => void;
  onValuesChange?: (values: ListingFormValues) => void;
  onDirtyChange?: (isDirty: boolean) => void;
  isLoading?: boolean;
  className?: string;
}

export const ListingForm: React.FC<ListingFormProps> = ({
  initialCompanyLocation = '',
  onSubmit,
  onValuesChange,
  onDirtyChange,
  isLoading = false,
  className,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const defaultValues: ListingFormValues = {
    purity_percentage: 95.5,
    volume_metric_tons: 500,
    reserve_price_ton: 3200,
    physical_state: 'liquid',
    location: initialCompanyLocation,
    available_from: todayStr,
    available_until: thirtyDaysLater,
    description: 'Cryogenically scrubbed point-source CO₂ batch with certified low moisture content.',
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Keep location synced if loaded asynchronously
  useEffect(() => {
    if (initialCompanyLocation) {
      setValue('location', initialCompanyLocation, { shouldDirty: false });
    }
  }, [initialCompanyLocation, setValue]);

  // Sync dirty state to parent for Unsaved Changes Guard
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Watch form values and notify parent for instant live preview
  const watchedValues = watch();

  useEffect(() => {
    onValuesChange?.(watchedValues);
  }, [
    watchedValues.purity_percentage,
    watchedValues.volume_metric_tons,
    watchedValues.reserve_price_ton,
    watchedValues.physical_state,
    watchedValues.location,
    watchedValues.available_from,
    watchedValues.available_until,
    watchedValues.description,
    onValuesChange,
  ]);

  const handleReset = () => {
    reset({
      ...defaultValues,
      location: initialCompanyLocation,
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="flex-col items-start gap-1">
        <div className="flex items-center space-x-2">
          <Factory className="h-5 w-5 text-black dark:text-white" />
          <CardTitle>Batch Listing Specifications</CardTitle>
        </div>
        <p className="text-xs text-neutral-500">
          Specify the technical and commercial parameters of your point-source captured CO₂ batch.
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* 1. CO2 Purity Slider */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <Controller
              name="purity_percentage"
              control={control}
              render={({ field }) => (
                <PuritySlider
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  error={errors.purity_percentage?.message}
                  disabled={isLoading}
                />
              )}
            />
          </div>

          {/* 2. Quantity & Reserve Price 2-Column */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Quantity (Metric Tons)"
              type="number"
              step="any"
              min="0.1"
              disabled={isLoading}
              placeholder="e.g. 500"
              leftIcon={<Box className="h-4 w-4 text-neutral-400" />}
              error={errors.volume_metric_tons?.message}
              helperText="Net tonnage available for commercial off-take"
              {...register('volume_metric_tons', { valueAsNumber: true })}
            />

            <Input
              label="Reserve Floor Price (₹ / Ton)"
              type="number"
              step="any"
              min="1"
              disabled={isLoading}
              placeholder="e.g. 3200"
              leftIcon={<IndianRupee className="h-4 w-4 text-neutral-400" />}
              error={errors.reserve_price_ton?.message}
              helperText="Minimum acceptable bid price per ton"
              {...register('reserve_price_ton', { valueAsNumber: true })}
            />
          </div>

          {/* 3. Physical State & Auto-filled Plant Location */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="physical_state"
              control={control}
              render={({ field }) => (
                <Select
                  label="Physical Phase"
                  options={[
                    { value: 'liquid', label: 'Liquid CO₂ (Cryogenic Tanker)' },
                    { value: 'pressurized_gas', label: 'Pressurized Gas (Pipeline / High Pressure)' },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.physical_state?.message}
                  helperText="Transport medium required for dispatch"
                  disabled={isLoading}
                />
              )}
            />

            <Input
              label="Dispatch Plant Location"
              type="text"
              readOnly
              disabled={isLoading}
              placeholder="Auto-filled from corporate facility profile"
              leftIcon={<MapPin className="h-4 w-4 text-neutral-400" />}
              helperText="Auto-filled from your registered plant profile"
              {...register('location')}
            />
          </div>

          {/* 4. Availability Date Picker */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <AvailabilityDatePicker
              startDate={watch('available_from')}
              endDate={watch('available_until')}
              onStartDateChange={(d) => setValue('available_from', d, { shouldValidate: true })}
              onEndDateChange={(d) => setValue('available_until', d, { shouldValidate: true })}
              startDateError={errors.available_from?.message}
              endDateError={errors.available_until?.message}
              disabled={isLoading}
            />
          </div>

          {/* 5. Description */}
          <div className="w-full space-y-1.5">
            <label
              htmlFor="description"
              className="flex items-center space-x-1.5 text-xs font-semibold text-black dark:text-white"
            >
              <FileText className="h-3.5 w-3.5 text-neutral-400" />
              <span>Batch Description & Compliance Notes</span>
            </label>
            <textarea
              id="description"
              rows={3}
              disabled={isLoading}
              placeholder="Specify trace impurities, ISO certification, liquefaction parameters, or loading crane readiness..."
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-black placeholder-neutral-400 shadow-sm transition-colors focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                {errors.description.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <Button
            type="button"
            variant="ghost"
            size="md"
            disabled={!isDirty || isLoading}
            onClick={handleReset}
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset Defaults
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              disabled={isLoading}
              className="shadow-sm"
            >
              <Send className="mr-1.5 h-4 w-4" />
              <span>Publish Batch Listing</span>
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ListingForm;
