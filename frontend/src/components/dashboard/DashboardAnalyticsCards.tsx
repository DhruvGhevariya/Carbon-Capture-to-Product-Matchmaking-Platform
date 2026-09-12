import React from 'react';
import { formatINR, formatNumber } from '@/lib/utils';
import {
  TrendingUp,
  IndianRupee,
  Sparkles,
  Building2,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export interface DashboardAnalyticsCardsProps {
  totalCO2Traded?: number;
  totalRevenue?: number;
  averageAIMatch?: number;
  activePartners?: number;
  trendData?: Array<{ month: string; volume: number; revenue: number }>;
}

export const DashboardAnalyticsCards: React.FC<DashboardAnalyticsCardsProps> = ({
  totalCO2Traded = 0,
  totalRevenue = 0,
  averageAIMatch = 0,
  activePartners = 0,
  trendData = [],
}) => {
  return (
    <div className="space-y-4">
      {/* 4 Required Analytics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* 1. Total CO2 Traded */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300 hover:shadow-card-hover transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total CO₂ Traded
              </p>
              <h3 className="mt-1.5 font-mono text-2xl font-black text-slate-900">
                {formatNumber(totalCO2Traded)} <span className="text-sm font-sans font-medium text-slate-500">Tons</span>
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-xs">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs font-bold text-emerald-700">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+24.2% MoM</span>
            </div>
            <span className="text-[11px] text-slate-400">Gujarat Cluster</span>
          </div>

          {/* Mini Recharts Area Sparkline */}
          <div className="mt-3 h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#059669"
                  strokeWidth={2}
                  fill="url(#co2Gradient)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Total Revenue */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-card-hover transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Revenue
              </p>
              <h3 className="mt-1.5 font-mono text-2xl font-black text-slate-900">
                {formatINR(totalRevenue)}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 shadow-xs">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs font-bold text-blue-700">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+18.5% YoY</span>
            </div>
            <span className="text-[11px] text-slate-400">Escrow Settled</span>
          </div>

          {/* Mini Recharts Bar Sparkline */}
          <div className="mt-3 h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <Bar dataKey="revenue" fill="#3B82F6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Average AI Match */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-purple-300 hover:shadow-card-hover transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Average AI Match
              </p>
              <h3 className="mt-1.5 font-mono text-2xl font-black text-slate-900">
                {averageAIMatch}%
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200/80 shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-800 border border-purple-200">
              <ShieldCheck className="mr-1 h-3 w-3 text-purple-600" />
              6-Factor Model
            </span>
            <span className="text-[11px] text-slate-400">98.4% Confidence</span>
          </div>

          {/* Progress bar visual */}
          <div className="mt-5 space-y-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xs"
                style={{ width: `${averageAIMatch}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Threshold: 80%</span>
              <span className="font-semibold text-emerald-700">Optimal Match</span>
            </div>
          </div>
        </div>

        {/* 4. Active Industrial Partners */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-amber-300 hover:shadow-card-hover transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Industrial Partners
              </p>
              <h3 className="mt-1.5 font-mono text-2xl font-black text-slate-900">
                {activePartners} <span className="text-sm font-sans font-medium text-slate-500">Enterprises</span>
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 shadow-xs">
              <Building2 className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              4 Sellers • 3 Buyers
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">100% KYC Verified</span>
          </div>

          <div className="mt-4 flex -space-x-1.5 overflow-hidden">
            {[
              { name: 'UltraTech', bg: 'bg-emerald-100 text-emerald-800' },
              { name: 'Ambuja', bg: 'bg-blue-100 text-blue-800' },
              { name: 'Tata', bg: 'bg-teal-100 text-teal-800' },
              { name: 'JSW', bg: 'bg-indigo-100 text-indigo-800' },
              { name: 'GreenGrow', bg: 'bg-amber-100 text-amber-800' },
              { name: 'EcoBuild', bg: 'bg-cyan-100 text-cyan-800' },
              { name: 'CarbonFuel', bg: 'bg-purple-100 text-purple-800' },
            ].map((p) => (
              <div
                key={p.name}
                title={p.name}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold shadow-xs ${p.bg}`}
              >
                {p.name.charAt(0)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
