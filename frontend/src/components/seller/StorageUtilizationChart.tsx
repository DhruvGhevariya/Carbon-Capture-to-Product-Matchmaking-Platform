import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatNumber } from '@/lib/utils';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface StorageUtilizationChartProps {
  currentStoredTons: number;
  totalCapacityTons: number;
  utilizationPercentage: number;
}

export const StorageUtilizationChart: React.FC<StorageUtilizationChartProps> = ({
  currentStoredTons,
  totalCapacityTons,
  utilizationPercentage,
}) => {
  const used = Math.min(Math.max(currentStoredTons, 0), totalCapacityTons > 0 ? totalCapacityTons : currentStoredTons);
  const available = Math.max(totalCapacityTons - used, 0);

  const data = [
    { name: 'Stored Buffer (Used)', value: Number(used.toFixed(1)), color: '#059669' },
    { name: 'Available Capacity', value: Number(available.toFixed(1)), color: '#E2E8F0' },
  ];

  const isWarning = utilizationPercentage >= 75;

  return (
    <Card className="flex flex-col justify-between border border-slate-200 hover:border-emerald-300 hover:shadow-card-hover transition-all">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle>Storage Utilization</CardTitle>
            <p className="text-xs text-slate-500">
              Liquid CO₂ tank capacity and storage utilization
            </p>
          </div>
          {isWarning ? (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              <span>High Storage (&gt;75%)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Normal Level</span>
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recharts Donut */}
        <div className="relative h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  color: '#0F172A',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value} Tons`, '']}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Gauge Readout */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="tabular-nums text-2xl font-black text-slate-900">
              {utilizationPercentage.toFixed(1)}%
            </span>
            <span className="text-[10px] uppercase font-bold text-emerald-700">Utilized</span>
          </div>
        </div>

        {/* Legend & Metric Summary */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
              <span className="text-slate-600">Current Stored</span>
            </div>
            <p className="tabular-nums font-bold text-slate-900">
              {formatNumber(used, 1)} / {formatNumber(totalCapacityTons, 1)} Tons
            </p>
          </div>

          <div className="space-y-1 text-right">
            <div className="flex items-center justify-end space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="text-slate-600">Available Capacity</span>
            </div>
            <p className="tabular-nums font-bold text-slate-900">
              {formatNumber(available, 1)} Tons Available
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
