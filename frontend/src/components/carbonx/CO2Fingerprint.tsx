import React from 'react';
import { Activity, Thermometer, Gauge, Droplets, Zap, ShieldCheck } from 'lucide-react';

interface CO2FingerprintProps {
  purityPercent?: number;
  volumeTonnes?: number;
  temperatureC?: number;
  pressureBar?: number;
  moisturePercent?: number;
  impuritiesPpm?: string;
  trlLevel?: number;
  className?: string;
}

/**
 * CO2Fingerprint — Scientific diagnostic matrix component presenting chemical & thermodynamic specifications.
 */
export const CO2Fingerprint: React.FC<CO2FingerprintProps> = ({
  purityPercent = 94.2,
  volumeTonnes = 18420,
  temperatureC = 145,
  pressureBar = 3.5,
  moisturePercent = 1.2,
  impuritiesPpm = 'SOx < 15 ppm · NOx < 40 ppm',
  trlLevel = 8,
  className = '',
}) => {
  const specs = [
    { label: 'CO₂ PURITY', value: `${purityPercent}%`, icon: Activity, status: 'HIGH PURITY', color: 'text-[#00FF87]' },
    { label: 'ANNUAL VOLUME', value: `${volumeTonnes.toLocaleString()} t/yr`, icon: Zap, status: 'CONTINUOUS', color: 'text-[#00FF87]' },
    { label: 'STACK TEMP', value: `${temperatureC} °C`, icon: Thermometer, status: 'WASTE HEAT AVAILABLE', color: 'text-[#FF9F1C]' },
    { label: 'STREAM PRESSURE', value: `${pressureBar} BAR`, icon: Gauge, status: 'LOW PRESSURE', color: 'text-[#00F0FF]' },
    { label: 'MOISTURE LEVEL', value: `${moisturePercent}%`, icon: Droplets, status: 'DRIED FEED', color: 'text-[#00F0FF]' },
    { label: 'TRL MATURITY', value: `TRL ${trlLevel}`, icon: ShieldCheck, status: 'COMMERCIAL READY', color: 'text-[#00FF87]' },
  ];

  return (
    <div className={`relative overflow-hidden rounded-xl border border-[#222736] bg-[#12141C] p-6 shadow-card ${className}`}>
      <div className="bg-tech-grid absolute inset-0 opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-[#222736]">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#00FF87]" />
          <div>
            <h4 className="font-display text-base font-bold text-[#F8FAFC]">CO₂ FEEDSTOCK FINGERPRINT</h4>
            <p className="font-mono text-[10px] text-[#94A3B8]">SPECTROGRAPHIC DIAGNOSTIC MATRIX · v3.2</p>
          </div>
        </div>
        <span className="rounded bg-[#00FF87]/10 border border-[#00FF87]/30 px-2.5 py-1 font-mono text-[10px] font-bold text-[#00FF87]">
          VERIFIED SPECTRA
        </span>
      </div>

      {/* Grid Matrix */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        {specs.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="rounded-lg border border-[#222736] bg-[#090A0F]/80 p-3.5">
              <div className="flex items-center justify-between text-[#94A3B8] mb-2">
                <span className="font-mono text-[10px] font-semibold uppercase">{item.label}</span>
                <Icon className="h-3.5 w-3.5 text-[#64748B]" />
              </div>
              <div className={`font-display text-xl font-bold tracking-tight ${item.color}`}>
                {item.value}
              </div>
              <div className="font-mono text-[9px] text-[#64748B] mt-1 tracking-wider uppercase">
                {item.status}
              </div>
            </div>
          );
        })}
      </div>

      {/* Impurity Footer */}
      <div className="relative z-10 mt-4 flex items-center justify-between rounded border border-[#222736] bg-[#090A0F] px-3 py-2 font-mono text-xs text-[#94A3B8]">
        <span className="text-[#64748B]">CRITICAL IMPURITIES:</span>
        <span className="font-semibold text-[#F8FAFC]">{impuritiesPpm}</span>
      </div>
    </div>
  );
};
