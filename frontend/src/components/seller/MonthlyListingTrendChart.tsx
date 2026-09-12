import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

export interface TrendDataPoint {
  month: string;
  capturedTons: number;
  offTakenTons: number;
}

export interface MonthlyListingTrendChartProps {
  trendData: TrendDataPoint[];
}

export const MonthlyListingTrendChart: React.FC<MonthlyListingTrendChartProps> = ({
  trendData,
}) => {
  if (!trendData || trendData.length === 0) {
    return (
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div>
            <CardTitle>Capture & Off-Take Trajectory</CardTitle>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              6-Month point-source CO₂ production vs. realized commercial sales
            </p>
          </div>
        </CardHeader>
        <CardContent className="py-8">
          <EmptyState
            title="No historical listing data"
            description="Monthly trends will appear after listings are created."
            className="border-0 py-6"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col justify-between border border-slate-200 hover:border-emerald-300 hover:shadow-card-hover transition-all">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle>Capture & Off-Take Trajectory</CardTitle>
            <p className="text-xs text-slate-500">
              6-Month point-source CO₂ production vs. realized commercial sales
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span>Monthly Trend</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCaptured" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="colorOffTaken" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.8} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748B' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748B' }}
                unit="t"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  color: '#0F172A',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
                  fontSize: '12px',
                }}
                formatter={(val: number, name: string) => [
                  `${val} Tons`,
                  name === 'capturedTons' ? 'Captured Stream' : 'Commercial Off-Take',
                ]}
              />
              <Area
                type="monotone"
                dataKey="capturedTons"
                stroke="#059669"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCaptured)"
              />
              <Area
                type="monotone"
                dataKey="offTakenTons"
                stroke="#2563EB"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOffTaken)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center space-x-6 border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
            <span className="text-slate-700 font-medium">Captured Volume (Tons)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            <span className="text-slate-700 font-medium">Off-Taken Sales (Tons)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
